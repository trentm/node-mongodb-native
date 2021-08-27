/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
'use strict';

const expect = require('chai').expect;
const { getSymbolFrom } = require('../tools/utils');
const { MongoNetworkError } = require('../../src/index');
const {
  PoolClosedError: MongoPoolClosedError,
  WaitQueueTimeoutError: MongoWaitQueueTimeoutError
} = require('../../src/cmap/errors');

describe('MongoErrors', () => {
  // import errors as object
  let errorClasses = Object.fromEntries(
    Object.entries(require('../../src/index')).filter(([key]) => key.endsWith('Error'))
  );
  errorClasses = { ...errorClasses, MongoPoolClosedError, MongoWaitQueueTimeoutError };

  for (const errorName in errorClasses) {
    describe(errorName, () => {
      it(`name should be read-only`, () => {
        // Dynamically create error class with message
        let error = new errorClasses[errorName]('generated by test');
        // expect name property to be class name
        expect(error).to.have.property('name', errorName);

        try {
          error.name = 'renamed by test';
        } catch (err) {}
        expect(error).to.have.property('name', errorName);
      });
    });
  }

  describe('when MongoNetworkError is constructed', () => {
    it('should only define beforeHandshake symbol if boolean option passed in', function () {
      const errorWithOptionTrue = new MongoNetworkError('', { beforeHandshake: true });
      expect(getSymbolFrom(errorWithOptionTrue, 'beforeHandshake', false)).to.be.a('symbol');

      const errorWithOptionFalse = new MongoNetworkError('', { beforeHandshake: false });
      expect(getSymbolFrom(errorWithOptionFalse, 'beforeHandshake', false)).to.be.a('symbol');

      const errorWithBadOption = new MongoNetworkError('', { beforeHandshake: 'not boolean' });
      expect(getSymbolFrom(errorWithBadOption, 'beforeHandshake', false)).to.be.an('undefined');

      const errorWithoutOption = new MongoNetworkError('');
      expect(getSymbolFrom(errorWithoutOption, 'beforeHandshake', false)).to.be.an('undefined');
    });
  });
});