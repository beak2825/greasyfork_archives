// ==UserScript==
// @name         Ninja.io Utils
// @namespace    https://itsmeow.cat
// @version      1.32
// @description  Some small QOL improvements to ninja.io!
// @author       Meow
// @match        https://ninja.io/*
// @match        https://ninja.io
// @match        http://ninja.io/*
// @match        http://ninja.io
// @match        https://*.ninja.io/*
// @match        http://*.ninja.io/*
// @match        https://*.ninja.io
// @match        http://*.ninja.io
// @icon         https://www.google.com/s2/favicons?domain=ninja.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.min.js
// @homepageURL  https://nutils.itsmeow.cat
// @supportURL   https://github.com/itzTheMeow/NinjaIOUtils/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441245/Ninjaio%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/441245/Ninjaio%20Utils.meta.js
// ==/UserScript==

/*
  This file was generated automatically by a build script!
  If you want to see the source code, view it on github:
  > https://github.com/itzTheMeow/NinjaIOUtils
*/

(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/localforage/dist/localforage.js
  var require_localforage = __commonJS({
    "node_modules/localforage/dist/localforage.js"(exports, module) {
      (function(f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
          module.exports = f();
        } else if (typeof define === "function" && define.amd) {
          define([], f);
        } else {
          var g;
          if (typeof window !== "undefined") {
            g = window;
          } else if (typeof global !== "undefined") {
            g = global;
          } else if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
          g.localforage = f();
        }
      })(function() {
        var define2, module2, exports2;
        return function e(t, n, r) {
          function s(o2, u) {
            if (!n[o2]) {
              if (!t[o2]) {
                var a = typeof __require == "function" && __require;
                if (!u && a)
                  return a(o2, true);
                if (i)
                  return i(o2, true);
                var f = new Error("Cannot find module '" + o2 + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
              }
              var l = n[o2] = { exports: {} };
              t[o2][0].call(l.exports, function(e2) {
                var n2 = t[o2][1][e2];
                return s(n2 ? n2 : e2);
              }, l, l.exports, e, t, n, r);
            }
            return n[o2].exports;
          }
          var i = typeof __require == "function" && __require;
          for (var o = 0; o < r.length; o++)
            s(r[o]);
          return s;
        }({ 1: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
            var scheduleDrain;
            {
              if (Mutation) {
                var called = 0;
                var observer = new Mutation(nextTick);
                var element = global2.document.createTextNode("");
                observer.observe(element, {
                  characterData: true
                });
                scheduleDrain = function() {
                  element.data = called = ++called % 2;
                };
              } else if (!global2.setImmediate && typeof global2.MessageChannel !== "undefined") {
                var channel = new global2.MessageChannel();
                channel.port1.onmessage = nextTick;
                scheduleDrain = function() {
                  channel.port2.postMessage(0);
                };
              } else if ("document" in global2 && "onreadystatechange" in global2.document.createElement("script")) {
                scheduleDrain = function() {
                  var scriptEl = global2.document.createElement("script");
                  scriptEl.onreadystatechange = function() {
                    nextTick();
                    scriptEl.onreadystatechange = null;
                    scriptEl.parentNode.removeChild(scriptEl);
                    scriptEl = null;
                  };
                  global2.document.documentElement.appendChild(scriptEl);
                };
              } else {
                scheduleDrain = function() {
                  setTimeout(nextTick, 0);
                };
              }
            }
            var draining;
            var queue = [];
            function nextTick() {
              draining = true;
              var i, oldQueue;
              var len = queue.length;
              while (len) {
                oldQueue = queue;
                queue = [];
                i = -1;
                while (++i < len) {
                  oldQueue[i]();
                }
                len = queue.length;
              }
              draining = false;
            }
            module3.exports = immediate;
            function immediate(task) {
              if (queue.push(task) === 1 && !draining) {
                scheduleDrain();
              }
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {}], 2: [function(_dereq_, module3, exports3) {
          "use strict";
          var immediate = _dereq_(1);
          function INTERNAL() {
          }
          var handlers = {};
          var REJECTED = ["REJECTED"];
          var FULFILLED = ["FULFILLED"];
          var PENDING = ["PENDING"];
          module3.exports = Promise2;
          function Promise2(resolver) {
            if (typeof resolver !== "function") {
              throw new TypeError("resolver must be a function");
            }
            this.state = PENDING;
            this.queue = [];
            this.outcome = void 0;
            if (resolver !== INTERNAL) {
              safelyResolveThenable(this, resolver);
            }
          }
          Promise2.prototype["catch"] = function(onRejected) {
            return this.then(null, onRejected);
          };
          Promise2.prototype.then = function(onFulfilled, onRejected) {
            if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
              return this;
            }
            var promise = new this.constructor(INTERNAL);
            if (this.state !== PENDING) {
              var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
              unwrap(promise, resolver, this.outcome);
            } else {
              this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
            }
            return promise;
          };
          function QueueItem(promise, onFulfilled, onRejected) {
            this.promise = promise;
            if (typeof onFulfilled === "function") {
              this.onFulfilled = onFulfilled;
              this.callFulfilled = this.otherCallFulfilled;
            }
            if (typeof onRejected === "function") {
              this.onRejected = onRejected;
              this.callRejected = this.otherCallRejected;
            }
          }
          QueueItem.prototype.callFulfilled = function(value) {
            handlers.resolve(this.promise, value);
          };
          QueueItem.prototype.otherCallFulfilled = function(value) {
            unwrap(this.promise, this.onFulfilled, value);
          };
          QueueItem.prototype.callRejected = function(value) {
            handlers.reject(this.promise, value);
          };
          QueueItem.prototype.otherCallRejected = function(value) {
            unwrap(this.promise, this.onRejected, value);
          };
          function unwrap(promise, func, value) {
            immediate(function() {
              var returnValue;
              try {
                returnValue = func(value);
              } catch (e) {
                return handlers.reject(promise, e);
              }
              if (returnValue === promise) {
                handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
              } else {
                handlers.resolve(promise, returnValue);
              }
            });
          }
          handlers.resolve = function(self2, value) {
            var result = tryCatch(getThen, value);
            if (result.status === "error") {
              return handlers.reject(self2, result.value);
            }
            var thenable = result.value;
            if (thenable) {
              safelyResolveThenable(self2, thenable);
            } else {
              self2.state = FULFILLED;
              self2.outcome = value;
              var i = -1;
              var len = self2.queue.length;
              while (++i < len) {
                self2.queue[i].callFulfilled(value);
              }
            }
            return self2;
          };
          handlers.reject = function(self2, error) {
            self2.state = REJECTED;
            self2.outcome = error;
            var i = -1;
            var len = self2.queue.length;
            while (++i < len) {
              self2.queue[i].callRejected(error);
            }
            return self2;
          };
          function getThen(obj) {
            var then = obj && obj.then;
            if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
              return function appyThen() {
                then.apply(obj, arguments);
              };
            }
          }
          function safelyResolveThenable(self2, thenable) {
            var called = false;
            function onError(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.reject(self2, value);
            }
            function onSuccess(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.resolve(self2, value);
            }
            function tryToUnwrap() {
              thenable(onSuccess, onError);
            }
            var result = tryCatch(tryToUnwrap);
            if (result.status === "error") {
              onError(result.value);
            }
          }
          function tryCatch(func, value) {
            var out = {};
            try {
              out.value = func(value);
              out.status = "success";
            } catch (e) {
              out.status = "error";
              out.value = e;
            }
            return out;
          }
          Promise2.resolve = resolve;
          function resolve(value) {
            if (value instanceof this) {
              return value;
            }
            return handlers.resolve(new this(INTERNAL), value);
          }
          Promise2.reject = reject;
          function reject(reason) {
            var promise = new this(INTERNAL);
            return handlers.reject(promise, reason);
          }
          Promise2.all = all;
          function all(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var values = new Array(len);
            var resolved = 0;
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              allResolver(iterable[i], i);
            }
            return promise;
            function allResolver(value, i2) {
              self2.resolve(value).then(resolveFromAll, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
              function resolveFromAll(outValue) {
                values[i2] = outValue;
                if (++resolved === len && !called) {
                  called = true;
                  handlers.resolve(promise, values);
                }
              }
            }
          }
          Promise2.race = race;
          function race(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              resolver(iterable[i]);
            }
            return promise;
            function resolver(value) {
              self2.resolve(value).then(function(response) {
                if (!called) {
                  called = true;
                  handlers.resolve(promise, response);
                }
              }, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
            }
          }
        }, { "1": 1 }], 3: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            if (typeof global2.Promise !== "function") {
              global2.Promise = _dereq_(2);
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "2": 2 }], 4: [function(_dereq_, module3, exports3) {
          "use strict";
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function getIDB() {
            try {
              if (typeof indexedDB !== "undefined") {
                return indexedDB;
              }
              if (typeof webkitIndexedDB !== "undefined") {
                return webkitIndexedDB;
              }
              if (typeof mozIndexedDB !== "undefined") {
                return mozIndexedDB;
              }
              if (typeof OIndexedDB !== "undefined") {
                return OIndexedDB;
              }
              if (typeof msIndexedDB !== "undefined") {
                return msIndexedDB;
              }
            } catch (e) {
              return;
            }
          }
          var idb = getIDB();
          function isIndexedDBValid() {
            try {
              if (!idb || !idb.open) {
                return false;
              }
              var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
              var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
              return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && typeof IDBKeyRange !== "undefined";
            } catch (e) {
              return false;
            }
          }
          function createBlob(parts, properties) {
            parts = parts || [];
            properties = properties || {};
            try {
              return new Blob(parts, properties);
            } catch (e) {
              if (e.name !== "TypeError") {
                throw e;
              }
              var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
              var builder = new Builder();
              for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
              }
              return builder.getBlob(properties.type);
            }
          }
          if (typeof Promise === "undefined") {
            _dereq_(3);
          }
          var Promise$1 = Promise;
          function executeCallback(promise, callback) {
            if (callback) {
              promise.then(function(result) {
                callback(null, result);
              }, function(error) {
                callback(error);
              });
            }
          }
          function executeTwoCallbacks(promise, callback, errorCallback) {
            if (typeof callback === "function") {
              promise.then(callback);
            }
            if (typeof errorCallback === "function") {
              promise["catch"](errorCallback);
            }
          }
          function normalizeKey(key2) {
            if (typeof key2 !== "string") {
              console.warn(key2 + " used as a key, but it is not a string.");
              key2 = String(key2);
            }
            return key2;
          }
          function getCallback() {
            if (arguments.length && typeof arguments[arguments.length - 1] === "function") {
              return arguments[arguments.length - 1];
            }
          }
          var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
          var supportsBlobs = void 0;
          var dbContexts = {};
          var toString = Object.prototype.toString;
          var READ_ONLY = "readonly";
          var READ_WRITE = "readwrite";
          function _binStringToArrayBuffer(bin) {
            var length2 = bin.length;
            var buf = new ArrayBuffer(length2);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length2; i++) {
              arr[i] = bin.charCodeAt(i);
            }
            return buf;
          }
          function _checkBlobSupportWithoutCaching(idb2) {
            return new Promise$1(function(resolve) {
              var txn = idb2.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
              var blob = createBlob([""]);
              txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
              txn.onabort = function(e) {
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
              };
              txn.oncomplete = function() {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
              };
            })["catch"](function() {
              return false;
            });
          }
          function _checkBlobSupport(idb2) {
            if (typeof supportsBlobs === "boolean") {
              return Promise$1.resolve(supportsBlobs);
            }
            return _checkBlobSupportWithoutCaching(idb2).then(function(value) {
              supportsBlobs = value;
              return supportsBlobs;
            });
          }
          function _deferReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = {};
            deferredOperation.promise = new Promise$1(function(resolve, reject) {
              deferredOperation.resolve = resolve;
              deferredOperation.reject = reject;
            });
            dbContext.deferredOperations.push(deferredOperation);
            if (!dbContext.dbReady) {
              dbContext.dbReady = deferredOperation.promise;
            } else {
              dbContext.dbReady = dbContext.dbReady.then(function() {
                return deferredOperation.promise;
              });
            }
          }
          function _advanceReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.resolve();
              return deferredOperation.promise;
            }
          }
          function _rejectReadiness(dbInfo, err) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.reject(err);
              return deferredOperation.promise;
            }
          }
          function _getConnection(dbInfo, upgradeNeeded) {
            return new Promise$1(function(resolve, reject) {
              dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
              if (dbInfo.db) {
                if (upgradeNeeded) {
                  _deferReadiness(dbInfo);
                  dbInfo.db.close();
                } else {
                  return resolve(dbInfo.db);
                }
              }
              var dbArgs = [dbInfo.name];
              if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
              }
              var openreq = idb.open.apply(idb, dbArgs);
              if (upgradeNeeded) {
                openreq.onupgradeneeded = function(e) {
                  var db = openreq.result;
                  try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                      db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                  } catch (ex) {
                    if (ex.name === "ConstraintError") {
                      console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                      throw ex;
                    }
                  }
                };
              }
              openreq.onerror = function(e) {
                e.preventDefault();
                reject(openreq.error);
              };
              openreq.onsuccess = function() {
                var db = openreq.result;
                db.onversionchange = function(e) {
                  e.target.close();
                };
                resolve(db);
                _advanceReadiness(dbInfo);
              };
            });
          }
          function _getOriginalConnection(dbInfo) {
            return _getConnection(dbInfo, false);
          }
          function _getUpgradedConnection(dbInfo) {
            return _getConnection(dbInfo, true);
          }
          function _isUpgradeNeeded(dbInfo, defaultVersion) {
            if (!dbInfo.db) {
              return true;
            }
            var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
            var isDowngrade = dbInfo.version < dbInfo.db.version;
            var isUpgrade = dbInfo.version > dbInfo.db.version;
            if (isDowngrade) {
              if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + `" can't be downgraded from version ` + dbInfo.db.version + " to version " + dbInfo.version + ".");
              }
              dbInfo.version = dbInfo.db.version;
            }
            if (isUpgrade || isNewStore) {
              if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                  dbInfo.version = incVersion;
                }
              }
              return true;
            }
            return false;
          }
          function _encodeBlob(blob) {
            return new Promise$1(function(resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;
              reader.onloadend = function(e) {
                var base64 = btoa(e.target.result || "");
                resolve({
                  __local_forage_encoded_blob: true,
                  data: base64,
                  type: blob.type
                });
              };
              reader.readAsBinaryString(blob);
            });
          }
          function _decodeBlob(encodedBlob) {
            var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
            return createBlob([arrayBuff], { type: encodedBlob.type });
          }
          function _isEncodedBlob(value) {
            return value && value.__local_forage_encoded_blob;
          }
          function _fullyReady(callback) {
            var self2 = this;
            var promise = self2._initReady().then(function() {
              var dbContext = dbContexts[self2._dbInfo.name];
              if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
              }
            });
            executeTwoCallbacks(promise, callback, callback);
            return promise;
          }
          function _tryReconnect(dbInfo) {
            _deferReadiness(dbInfo);
            var dbContext = dbContexts[dbInfo.name];
            var forages = dbContext.forages;
            for (var i = 0; i < forages.length; i++) {
              var forage = forages[i];
              if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
              }
            }
            dbInfo.db = null;
            return _getOriginalConnection(dbInfo).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              for (var i2 = 0; i2 < forages.length; i2++) {
                forages[i2]._dbInfo.db = db;
              }
            })["catch"](function(err) {
              _rejectReadiness(dbInfo, err);
              throw err;
            });
          }
          function createTransaction(dbInfo, mode, callback, retries) {
            if (retries === void 0) {
              retries = 1;
            }
            try {
              var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
              callback(null, tx);
            } catch (err) {
              if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) {
                return Promise$1.resolve().then(function() {
                  if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    if (dbInfo.db) {
                      dbInfo.version = dbInfo.db.version + 1;
                    }
                    return _getUpgradedConnection(dbInfo);
                  }
                }).then(function() {
                  return _tryReconnect(dbInfo).then(function() {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                  });
                })["catch"](callback);
              }
              callback(err);
            }
          }
          function createDbContext() {
            return {
              forages: [],
              db: null,
              dbReady: null,
              deferredOperations: []
            };
          }
          function _initStorage(options) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options) {
              for (var i in options) {
                dbInfo[i] = options[i];
              }
            }
            var dbContext = dbContexts[dbInfo.name];
            if (!dbContext) {
              dbContext = createDbContext();
              dbContexts[dbInfo.name] = dbContext;
            }
            dbContext.forages.push(self2);
            if (!self2._initReady) {
              self2._initReady = self2.ready;
              self2.ready = _fullyReady;
            }
            var initPromises = [];
            function ignoreErrors() {
              return Promise$1.resolve();
            }
            for (var j = 0; j < dbContext.forages.length; j++) {
              var forage = dbContext.forages[j];
              if (forage !== self2) {
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
              }
            }
            var forages = dbContext.forages.slice(0);
            return Promise$1.all(initPromises).then(function() {
              dbInfo.db = dbContext.db;
              return _getOriginalConnection(dbInfo);
            }).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo, self2._defaultConfig.version)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              self2._dbInfo = dbInfo;
              for (var k = 0; k < forages.length; k++) {
                var forage2 = forages[k];
                if (forage2 !== self2) {
                  forage2._dbInfo.db = dbInfo.db;
                  forage2._dbInfo.version = dbInfo.version;
                }
              }
            });
          }
          function getItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.get(key2);
                    req.onsuccess = function() {
                      var value = req.result;
                      if (value === void 0) {
                        value = null;
                      }
                      if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                      }
                      resolve(value);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (cursor) {
                        var value = cursor.value;
                        if (_isEncodedBlob(value)) {
                          value = _decodeBlob(value);
                        }
                        var result = iterator(value, cursor.key, iterationNumber++);
                        if (result !== void 0) {
                          resolve(result);
                        } else {
                          cursor["continue"]();
                        }
                      } else {
                        resolve();
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              var dbInfo;
              self2.ready().then(function() {
                dbInfo = self2._dbInfo;
                if (toString.call(value) === "[object Blob]") {
                  return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                    if (blobSupport) {
                      return value;
                    }
                    return _encodeBlob(value);
                  });
                }
                return value;
              }).then(function(value2) {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    if (value2 === null) {
                      value2 = void 0;
                    }
                    var req = store.put(value2, key2);
                    transaction.oncomplete = function() {
                      if (value2 === void 0) {
                        value2 = null;
                      }
                      resolve(value2);
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store["delete"](key2);
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onerror = function() {
                      reject(req.error);
                    };
                    transaction.onabort = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.clear();
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.count();
                    req.onsuccess = function() {
                      resolve(req.result);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              if (n < 0) {
                resolve(null);
                return;
              }
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(null);
                        return;
                      }
                      if (n === 0) {
                        resolve(cursor.key);
                      } else {
                        if (!advanced) {
                          advanced = true;
                          cursor.advance(n);
                        } else {
                          resolve(cursor.key);
                        }
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys2 = [];
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(keys2);
                        return;
                      }
                      keys2.push(cursor.key);
                      cursor["continue"]();
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance(options, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              var isCurrentDb = options.name === currentConfig.name && self2._dbInfo.db;
              var dbPromise = isCurrentDb ? Promise$1.resolve(self2._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                  forages[i]._dbInfo.db = db;
                }
                return db;
              });
              if (!options.storeName) {
                promise = dbPromise.then(function(db) {
                  _deferReadiness(options);
                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                  }
                  var dropDBPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.deleteDatabase(options.name);
                    req.onerror = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      reject(req.error);
                    };
                    req.onblocked = function() {
                      console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      resolve(db2);
                    };
                  });
                  return dropDBPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var i2 = 0; i2 < forages.length; i2++) {
                      var _forage = forages[i2];
                      _advanceReadiness(_forage._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              } else {
                promise = dbPromise.then(function(db) {
                  if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                  }
                  var newVersion = db.version + 1;
                  _deferReadiness(options);
                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                  }
                  var dropObjectPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.open(options.name, newVersion);
                    req.onerror = function(err) {
                      var db2 = req.result;
                      db2.close();
                      reject(err);
                    };
                    req.onupgradeneeded = function() {
                      var db2 = req.result;
                      db2.deleteObjectStore(options.storeName);
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      db2.close();
                      resolve(db2);
                    };
                  });
                  return dropObjectPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var j = 0; j < forages.length; j++) {
                      var _forage2 = forages[j];
                      _forage2._dbInfo.db = db2;
                      _advanceReadiness(_forage2._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              }
            }
            executeCallback(promise, callback);
            return promise;
          }
          var asyncStorage = {
            _driver: "asyncStorage",
            _initStorage,
            _support: isIndexedDBValid(),
            iterate,
            getItem,
            setItem,
            removeItem,
            clear,
            length,
            key,
            keys,
            dropInstance
          };
          function isWebSQLValid() {
            return typeof openDatabase === "function";
          }
          var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var BLOB_TYPE_PREFIX = "~~local_forage_type~";
          var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
          var SERIALIZED_MARKER = "__lfsc__:";
          var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
          var TYPE_ARRAYBUFFER = "arbf";
          var TYPE_BLOB = "blob";
          var TYPE_INT8ARRAY = "si08";
          var TYPE_UINT8ARRAY = "ui08";
          var TYPE_UINT8CLAMPEDARRAY = "uic8";
          var TYPE_INT16ARRAY = "si16";
          var TYPE_INT32ARRAY = "si32";
          var TYPE_UINT16ARRAY = "ur16";
          var TYPE_UINT32ARRAY = "ui32";
          var TYPE_FLOAT32ARRAY = "fl32";
          var TYPE_FLOAT64ARRAY = "fl64";
          var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
          var toString$1 = Object.prototype.toString;
          function stringToBuffer(serializedString) {
            var bufferLength = serializedString.length * 0.75;
            var len = serializedString.length;
            var i;
            var p = 0;
            var encoded1, encoded2, encoded3, encoded4;
            if (serializedString[serializedString.length - 1] === "=") {
              bufferLength--;
              if (serializedString[serializedString.length - 2] === "=") {
                bufferLength--;
              }
            }
            var buffer = new ArrayBuffer(bufferLength);
            var bytes = new Uint8Array(buffer);
            for (i = 0; i < len; i += 4) {
              encoded1 = BASE_CHARS.indexOf(serializedString[i]);
              encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
              encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
              encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
              bytes[p++] = encoded1 << 2 | encoded2 >> 4;
              bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
              bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
            }
            return buffer;
          }
          function bufferToString(buffer) {
            var bytes = new Uint8Array(buffer);
            var base64String = "";
            var i;
            for (i = 0; i < bytes.length; i += 3) {
              base64String += BASE_CHARS[bytes[i] >> 2];
              base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
              base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
              base64String += BASE_CHARS[bytes[i + 2] & 63];
            }
            if (bytes.length % 3 === 2) {
              base64String = base64String.substring(0, base64String.length - 1) + "=";
            } else if (bytes.length % 3 === 1) {
              base64String = base64String.substring(0, base64String.length - 2) + "==";
            }
            return base64String;
          }
          function serialize(value, callback) {
            var valueType = "";
            if (value) {
              valueType = toString$1.call(value);
            }
            if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
              var buffer;
              var marker = SERIALIZED_MARKER;
              if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
              } else {
                buffer = value.buffer;
                if (valueType === "[object Int8Array]") {
                  marker += TYPE_INT8ARRAY;
                } else if (valueType === "[object Uint8Array]") {
                  marker += TYPE_UINT8ARRAY;
                } else if (valueType === "[object Uint8ClampedArray]") {
                  marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === "[object Int16Array]") {
                  marker += TYPE_INT16ARRAY;
                } else if (valueType === "[object Uint16Array]") {
                  marker += TYPE_UINT16ARRAY;
                } else if (valueType === "[object Int32Array]") {
                  marker += TYPE_INT32ARRAY;
                } else if (valueType === "[object Uint32Array]") {
                  marker += TYPE_UINT32ARRAY;
                } else if (valueType === "[object Float32Array]") {
                  marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === "[object Float64Array]") {
                  marker += TYPE_FLOAT64ARRAY;
                } else {
                  callback(new Error("Failed to get type for BinaryArray"));
                }
              }
              callback(marker + bufferToString(buffer));
            } else if (valueType === "[object Blob]") {
              var fileReader = new FileReader();
              fileReader.onload = function() {
                var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
              };
              fileReader.readAsArrayBuffer(value);
            } else {
              try {
                callback(JSON.stringify(value));
              } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);
                callback(null, e);
              }
            }
          }
          function deserialize(value) {
            if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
              return JSON.parse(value);
            }
            var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
            var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
            var blobType;
            if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
              var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
              blobType = matcher[1];
              serializedString = serializedString.substring(matcher[0].length);
            }
            var buffer = stringToBuffer(serializedString);
            switch (type) {
              case TYPE_ARRAYBUFFER:
                return buffer;
              case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
              case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
              case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
              case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
              case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
              case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
              case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
              case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
              case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
              case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
              default:
                throw new Error("Unkown type: " + type);
            }
          }
          var localforageSerializer = {
            serialize,
            deserialize,
            stringToBuffer,
            bufferToString
          };
          function createDbTable(t, dbInfo, callback, errorCallback) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
          }
          function _initStorage$1(options) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options) {
              for (var i in options) {
                dbInfo[i] = typeof options[i] !== "string" ? options[i].toString() : options[i];
              }
            }
            var dbInfoPromise = new Promise$1(function(resolve, reject) {
              try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
              } catch (e) {
                return reject(e);
              }
              dbInfo.db.transaction(function(t) {
                createDbTable(t, dbInfo, function() {
                  self2._dbInfo = dbInfo;
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              }, reject);
            });
            dbInfo.serializer = localforageSerializer;
            return dbInfoPromise;
          }
          function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
            t.executeSql(sqlStatement, args, callback, function(t2, error) {
              if (error.code === error.SYNTAX_ERR) {
                t2.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t3, results) {
                  if (!results.rows.length) {
                    createDbTable(t3, dbInfo, function() {
                      t3.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                  } else {
                    errorCallback(t3, error);
                  }
                }, errorCallback);
              } else {
                errorCallback(t2, error);
              }
            }, errorCallback);
          }
          function getItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key2], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$1(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t2, results) {
                    var rows = results.rows;
                    var length2 = rows.length;
                    for (var i = 0; i < length2; i++) {
                      var item = rows.item(i);
                      var result = item.value;
                      if (result) {
                        result = dbInfo.serializer.deserialize(result);
                      }
                      result = iterator(result, item.key, i + 1);
                      if (result !== void 0) {
                        resolve(result);
                        return;
                      }
                    }
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function _setItem(key2, value, callback, retriesLeft) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                if (value === void 0) {
                  value = null;
                }
                var originalValue = value;
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    dbInfo.db.transaction(function(t) {
                      tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key2, value2], function() {
                        resolve(originalValue);
                      }, function(t2, error2) {
                        reject(error2);
                      });
                    }, function(sqlError) {
                      if (sqlError.code === sqlError.QUOTA_ERR) {
                        if (retriesLeft > 0) {
                          resolve(_setItem.apply(self2, [key2, originalValue, callback, retriesLeft - 1]));
                          return;
                        }
                        reject(sqlError);
                      }
                    });
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$1(key2, value, callback) {
            return _setItem.apply(this, [key2, value, callback, 1]);
          }
          function removeItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key2], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t2, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$1(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n + 1], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t2, results) {
                    var keys2 = [];
                    for (var i = 0; i < results.rows.length; i++) {
                      keys2.push(results.rows.item(i).key);
                    }
                    resolve(keys2);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getAllStoreNames(db) {
            return new Promise$1(function(resolve, reject) {
              db.transaction(function(t) {
                t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t2, results) {
                  var storeNames = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                  }
                  resolve({
                    db,
                    storeNames
                  });
                }, function(t2, error) {
                  reject(error);
                });
              }, function(sqlError) {
                reject(sqlError);
              });
            });
          }
          function dropInstance$1(options, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                var db;
                if (options.name === currentConfig.name) {
                  db = self2._dbInfo.db;
                } else {
                  db = openDatabase(options.name, "", "", 0);
                }
                if (!options.storeName) {
                  resolve(getAllStoreNames(db));
                } else {
                  resolve({
                    db,
                    storeNames: [options.storeName]
                  });
                }
              }).then(function(operationInfo) {
                return new Promise$1(function(resolve, reject) {
                  operationInfo.db.transaction(function(t) {
                    function dropTable(storeName) {
                      return new Promise$1(function(resolve2, reject2) {
                        t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                          resolve2();
                        }, function(t2, error) {
                          reject2(error);
                        });
                      });
                    }
                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                      operations.push(dropTable(operationInfo.storeNames[i]));
                    }
                    Promise$1.all(operations).then(function() {
                      resolve();
                    })["catch"](function(e) {
                      reject(e);
                    });
                  }, function(sqlError) {
                    reject(sqlError);
                  });
                });
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var webSQLStorage = {
            _driver: "webSQLStorage",
            _initStorage: _initStorage$1,
            _support: isWebSQLValid(),
            iterate: iterate$1,
            getItem: getItem$1,
            setItem: setItem$1,
            removeItem: removeItem$1,
            clear: clear$1,
            length: length$1,
            key: key$1,
            keys: keys$1,
            dropInstance: dropInstance$1
          };
          function isLocalStorageValid() {
            try {
              return typeof localStorage !== "undefined" && "setItem" in localStorage && !!localStorage.setItem;
            } catch (e) {
              return false;
            }
          }
          function _getKeyPrefix(options, defaultConfig) {
            var keyPrefix = options.name + "/";
            if (options.storeName !== defaultConfig.storeName) {
              keyPrefix += options.storeName + "/";
            }
            return keyPrefix;
          }
          function checkIfLocalStorageThrows() {
            var localStorageTestKey = "_localforage_support_test";
            try {
              localStorage.setItem(localStorageTestKey, true);
              localStorage.removeItem(localStorageTestKey);
              return false;
            } catch (e) {
              return true;
            }
          }
          function _isLocalStorageUsable() {
            return !checkIfLocalStorageThrows() || localStorage.length > 0;
          }
          function _initStorage$2(options) {
            var self2 = this;
            var dbInfo = {};
            if (options) {
              for (var i in options) {
                dbInfo[i] = options[i];
              }
            }
            dbInfo.keyPrefix = _getKeyPrefix(options, self2._defaultConfig);
            if (!_isLocalStorageUsable()) {
              return Promise$1.reject();
            }
            self2._dbInfo = dbInfo;
            dbInfo.serializer = localforageSerializer;
            return Promise$1.resolve();
          }
          function clear$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var keyPrefix = self2._dbInfo.keyPrefix;
              for (var i = localStorage.length - 1; i >= 0; i--) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key2);
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result = localStorage.getItem(dbInfo.keyPrefix + key2);
              if (result) {
                result = dbInfo.serializer.deserialize(result);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$2(iterator, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var keyPrefix = dbInfo.keyPrefix;
              var keyPrefixLength = keyPrefix.length;
              var length2 = localStorage.length;
              var iterationNumber = 1;
              for (var i = 0; i < length2; i++) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) !== 0) {
                  continue;
                }
                var value = localStorage.getItem(key2);
                if (value) {
                  value = dbInfo.serializer.deserialize(value);
                }
                value = iterator(value, key2.substring(keyPrefixLength), iterationNumber++);
                if (value !== void 0) {
                  return value;
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$2(n, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result;
              try {
                result = localStorage.key(n);
              } catch (error) {
                result = null;
              }
              if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var length2 = localStorage.length;
              var keys2 = [];
              for (var i = 0; i < length2; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                  keys2.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
              }
              return keys2;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$2(callback) {
            var self2 = this;
            var promise = self2.keys().then(function(keys2) {
              return keys2.length;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              localStorage.removeItem(dbInfo.keyPrefix + key2);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$2(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              if (value === void 0) {
                value = null;
              }
              var originalValue = value;
              return new Promise$1(function(resolve, reject) {
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    try {
                      localStorage.setItem(dbInfo.keyPrefix + key2, value2);
                      resolve(originalValue);
                    } catch (e) {
                      if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                        reject(e);
                      }
                      reject(e);
                    }
                  }
                });
              });
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance$2(options, callback) {
            callback = getCallback.apply(this, arguments);
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              var currentConfig = this.config();
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                if (!options.storeName) {
                  resolve(options.name + "/");
                } else {
                  resolve(_getKeyPrefix(options, self2._defaultConfig));
                }
              }).then(function(keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                  var key2 = localStorage.key(i);
                  if (key2.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key2);
                  }
                }
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var localStorageWrapper = {
            _driver: "localStorageWrapper",
            _initStorage: _initStorage$2,
            _support: isLocalStorageValid(),
            iterate: iterate$2,
            getItem: getItem$2,
            setItem: setItem$2,
            removeItem: removeItem$2,
            clear: clear$2,
            length: length$2,
            key: key$2,
            keys: keys$2,
            dropInstance: dropInstance$2
          };
          var sameValue = function sameValue2(x, y) {
            return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
          };
          var includes = function includes2(array, searchElement) {
            var len = array.length;
            var i = 0;
            while (i < len) {
              if (sameValue(array[i], searchElement)) {
                return true;
              }
              i++;
            }
            return false;
          };
          var isArray = Array.isArray || function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
          };
          var DefinedDrivers = {};
          var DriverSupport = {};
          var DefaultDrivers = {
            INDEXEDDB: asyncStorage,
            WEBSQL: webSQLStorage,
            LOCALSTORAGE: localStorageWrapper
          };
          var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];
          var OptionalDriverMethods = ["dropInstance"];
          var LibraryMethods = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(OptionalDriverMethods);
          var DefaultConfig = {
            description: "",
            driver: DefaultDriverOrder.slice(),
            name: "localforage",
            size: 4980736,
            storeName: "keyvaluepairs",
            version: 1
          };
          function callWhenReady(localForageInstance, libraryMethod) {
            localForageInstance[libraryMethod] = function() {
              var _args = arguments;
              return localForageInstance.ready().then(function() {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
              });
            };
          }
          function extend() {
            for (var i = 1; i < arguments.length; i++) {
              var arg = arguments[i];
              if (arg) {
                for (var _key in arg) {
                  if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                      arguments[0][_key] = arg[_key].slice();
                    } else {
                      arguments[0][_key] = arg[_key];
                    }
                  }
                }
              }
            }
            return arguments[0];
          }
          var LocalForage = function() {
            function LocalForage2(options) {
              _classCallCheck(this, LocalForage2);
              for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                  var driver = DefaultDrivers[driverTypeKey];
                  var driverName = driver._driver;
                  this[driverTypeKey] = driverName;
                  if (!DefinedDrivers[driverName]) {
                    this.defineDriver(driver);
                  }
                }
              }
              this._defaultConfig = extend({}, DefaultConfig);
              this._config = extend({}, this._defaultConfig, options);
              this._driverSet = null;
              this._initDriver = null;
              this._ready = false;
              this._dbInfo = null;
              this._wrapLibraryMethodsWithReady();
              this.setDriver(this._config.driver)["catch"](function() {
              });
            }
            LocalForage2.prototype.config = function config(options) {
              if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
                if (this._ready) {
                  return new Error("Can't call config() after localforage has been used.");
                }
                for (var i in options) {
                  if (i === "storeName") {
                    options[i] = options[i].replace(/\W/g, "_");
                  }
                  if (i === "version" && typeof options[i] !== "number") {
                    return new Error("Database version must be a number.");
                  }
                  this._config[i] = options[i];
                }
                if ("driver" in options && options.driver) {
                  return this.setDriver(this._config.driver);
                }
                return true;
              } else if (typeof options === "string") {
                return this._config[options];
              } else {
                return this._config;
              }
            };
            LocalForage2.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
              var promise = new Promise$1(function(resolve, reject) {
                try {
                  var driverName = driverObject._driver;
                  var complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                  }
                  var driverMethods = LibraryMethods.concat("_initStorage");
                  for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
                      reject(complianceError);
                      return;
                    }
                  }
                  var configureMissingMethods = function configureMissingMethods2() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory2(methodName) {
                      return function() {
                        var error = new Error("Method " + methodName + " is not implemented by the current driver");
                        var promise2 = Promise$1.reject(error);
                        executeCallback(promise2, arguments[arguments.length - 1]);
                        return promise2;
                      };
                    };
                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                      var optionalDriverMethod = OptionalDriverMethods[_i];
                      if (!driverObject[optionalDriverMethod]) {
                        driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                      }
                    }
                  };
                  configureMissingMethods();
                  var setDriverSupport = function setDriverSupport2(support) {
                    if (DefinedDrivers[driverName]) {
                      console.info("Redefining LocalForage driver: " + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    resolve();
                  };
                  if ("_support" in driverObject) {
                    if (driverObject._support && typeof driverObject._support === "function") {
                      driverObject._support().then(setDriverSupport, reject);
                    } else {
                      setDriverSupport(!!driverObject._support);
                    }
                  } else {
                    setDriverSupport(true);
                  }
                } catch (e) {
                  reject(e);
                }
              });
              executeTwoCallbacks(promise, callback, errorCallback);
              return promise;
            };
            LocalForage2.prototype.driver = function driver() {
              return this._driver || null;
            };
            LocalForage2.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
              var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
              executeTwoCallbacks(getDriverPromise, callback, errorCallback);
              return getDriverPromise;
            };
            LocalForage2.prototype.getSerializer = function getSerializer(callback) {
              var serializerPromise = Promise$1.resolve(localforageSerializer);
              executeTwoCallbacks(serializerPromise, callback);
              return serializerPromise;
            };
            LocalForage2.prototype.ready = function ready(callback) {
              var self2 = this;
              var promise = self2._driverSet.then(function() {
                if (self2._ready === null) {
                  self2._ready = self2._initDriver();
                }
                return self2._ready;
              });
              executeTwoCallbacks(promise, callback, callback);
              return promise;
            };
            LocalForage2.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
              var self2 = this;
              if (!isArray(drivers)) {
                drivers = [drivers];
              }
              var supportedDrivers = this._getSupportedDrivers(drivers);
              function setDriverToConfig() {
                self2._config.driver = self2.driver();
              }
              function extendSelfWithDriver(driver) {
                self2._extend(driver);
                setDriverToConfig();
                self2._ready = self2._initStorage(self2._config);
                return self2._ready;
              }
              function initDriver(supportedDrivers2) {
                return function() {
                  var currentDriverIndex = 0;
                  function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers2.length) {
                      var driverName = supportedDrivers2[currentDriverIndex];
                      currentDriverIndex++;
                      self2._dbInfo = null;
                      self2._ready = null;
                      return self2.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }
                    setDriverToConfig();
                    var error = new Error("No available storage method found.");
                    self2._driverSet = Promise$1.reject(error);
                    return self2._driverSet;
                  }
                  return driverPromiseLoop();
                };
              }
              var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
                return Promise$1.resolve();
              }) : Promise$1.resolve();
              this._driverSet = oldDriverSetDone.then(function() {
                var driverName = supportedDrivers[0];
                self2._dbInfo = null;
                self2._ready = null;
                return self2.getDriver(driverName).then(function(driver) {
                  self2._driver = driver._driver;
                  setDriverToConfig();
                  self2._wrapLibraryMethodsWithReady();
                  self2._initDriver = initDriver(supportedDrivers);
                });
              })["catch"](function() {
                setDriverToConfig();
                var error = new Error("No available storage method found.");
                self2._driverSet = Promise$1.reject(error);
                return self2._driverSet;
              });
              executeTwoCallbacks(this._driverSet, callback, errorCallback);
              return this._driverSet;
            };
            LocalForage2.prototype.supports = function supports(driverName) {
              return !!DriverSupport[driverName];
            };
            LocalForage2.prototype._extend = function _extend(libraryMethodsAndProperties) {
              extend(this, libraryMethodsAndProperties);
            };
            LocalForage2.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
              var supportedDrivers = [];
              for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                  supportedDrivers.push(driverName);
                }
              }
              return supportedDrivers;
            };
            LocalForage2.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
              for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
              }
            };
            LocalForage2.prototype.createInstance = function createInstance(options) {
              return new LocalForage2(options);
            };
            return LocalForage2;
          }();
          var localforage_js = new LocalForage();
          module3.exports = localforage_js;
        }, { "3": 3 }] }, {}, [4])(4);
      });
    }
  });

  // src/applySettingsHook.ts
  function applySettingsHook() {
    Manager.prototype._applySettings = Manager.prototype.applySettings;
    Manager.prototype.applySettings = function(s) {
      this.isRanked = s.ranked;
      return this._applySettings(s);
    };
  }

  // src/config.ts
  var config_default = {
    ver: "1.32",
    api: "https://nutils.itsmeow.cat",
    customDelimiter: "__custom",
    actualGameVersion: document.querySelector(`script[src*="game.js"]`)?.src.split("/").pop()?.split("?v=")?.[1] || (() => {
      try {
        return App.ClientVersion;
      } catch {
        return "unknown";
      }
    })(),
    PacketTypeMap: {
      systemMessage: "w",
      chatSend: "x",
      findMatch: "h",
      joinMatch: "j",
      data: "d",
      data2: "p",
      joinedMessage: "i"
    },
    Colors: {
      dotGreen: 65280,
      dotGrey: 8947848,
      dotOrange: 16757012,
      green: 8978312,
      grey: 16777215,
      red: 12603201,
      white: 13421772,
      yellow: 16763904
    },
    MapIDs: {
      Hull: 1,
      Igloo: 2,
      Temple: 3,
      DragonsDen: 4,
      dm_Arena1: 5,
      Elysium: 6,
      Tobruk: 7,
      ColdFusion: 8,
      TwinFaces: 9,
      KodysIsland: 10,
      Canyon: 11,
      Hill364: 12,
      Stasis: 13,
      ctf_Evening: 14,
      ArcticDusk: 15,
      Cathedral: 16,
      ctf_Lambda: 17,
      Aerial: 18,
      ctf_FacingWorlds: 19,
      ctf_Ash: 20,
      ctf_Naom: 21,
      dm_Hunter: 22,
      Tribal: 23,
      Kiwi: 24,
      Webb: 26,
      dm_Sleet: 27,
      SpaceStation: 28,
      Sinkhole: 29,
      LonelyIsland: 30,
      dm_Nexus: 31
    },
    WeaponReloadTimes: {
      Fists: 0,
      Shotgun: 0,
      SubmachineGun: 0,
      NadeLauncher: 2e3,
      Barrett: 2500,
      ShockRifle: 0,
      PulseGun: 0,
      FlameThrower: 0,
      RPG: 4e3,
      Rifle: 2e3,
      LaserGun: 0,
      LinkGun: 0,
      AK47: 0,
      Chainsaw: 0,
      DesertEagle: 0,
      Minigun: 0,
      X75: 0,
      MAC10: 0,
      Bow: 300,
      RocketLauncher: 0,
      Carbine: 0,
      BoomerangGun: 0,
      M60: 4e3,
      Uzi: 0,
      Bouncyball: 0
    }
  };

  // src/settings/settings.ts
  var settingsKey = "ninjaioutils";
  var SETTINGS = {
    ...{
      uiScale: 0,
      showFPS: true,
      texturePack: null,
      typewriter: false,
      apiKey: "",
      appearOnline: true,
      enableHotkeyMessages: true,
      hotkeyMessages: [],
      helpfulUI: true
    },
    ...JSON.parse(localStorage.getItem(settingsKey) || "{}")
  };
  var saveSettings = () => {
    localStorage.setItem(settingsKey, JSON.stringify(SETTINGS));
  };

  // src/settings/settingsTabGraphics.ts
  function hookGraphicsSettingsTab() {
    app.menu.settingsPanel.graphicsTab.addChild(app.menu.settingsPanel.graphicsTab.fpsDisplay = new Checkbox("showFPS", "Show FPS Display", true));
    app.menu.settingsPanel.graphicsTab.fpsDisplay.x = app.menu.settingsPanel.graphicsTab.enableAA.x;
    app.menu.settingsPanel.graphicsTab.fpsDisplay.y = app.menu.settingsPanel.graphicsTab.enableAA.y + app.menu.settingsPanel.graphicsTab.enableAA.height + 12;
    app.menu.settingsPanel.graphicsTab.fpsDisplay.on(Checkbox.CHANGE, function(b) {
      SETTINGS.showFPS = b;
      saveSettings();
      if (frameDisplay.style.display == "none" && SETTINGS.showFPS)
        showFPS();
    });
    app.menu.settingsPanel.graphicsTab.fpsDisplay.setChecked(SETTINGS.showFPS);
    app.menu.settingsPanel.graphicsTab.addChild(app.menu.settingsPanel.graphicsTab.uiScaler = new Slider("chatOpacity", "UI scale", SETTINGS.uiScale || 0.4, 2, 0.4));
    if (!SETTINGS.uiScale)
      app.menu.settingsPanel.graphicsTab.uiScaler.valueLabel.text = "default";
    app.menu.settingsPanel.graphicsTab.uiScaler.x = app.menu.settingsPanel.graphicsTab.fpsDisplay.x;
    app.menu.settingsPanel.graphicsTab.uiScaler.y = app.menu.settingsPanel.graphicsTab.fpsDisplay.y + app.menu.settingsPanel.graphicsTab.fpsDisplay.height + 10;
    app.menu.settingsPanel.graphicsTab.uiScaler.on(Slider.CHANGE, (b) => {
      b = Math.round(b * 10) / 10;
      if (b == 0.4) {
        app.menu.settingsPanel.graphicsTab.uiScaler.valueLabel.text = "default";
        b = 0;
      }
      if (b == SETTINGS.uiScale)
        return;
      App.NUIScale = SETTINGS.uiScale = b;
      saveSettings();
      app.onResize();
      const conf = document.createElement("div");
      const confy = document.createElement("button");
      confy.innerHTML = "OK";
      confy.onclick = () => conf.remove();
      conf.appendChild(confy);
      const confn = document.createElement("button");
      confn.innerHTML = "Undo";
      confn.onclick = () => {
        App.NUIScale = SETTINGS.uiScale = 0;
        saveSettings();
        app.onResize();
        conf.remove();
      };
      confn.style.marginLeft = "0.3rem";
      conf.appendChild(confn);
      conf.style.position = "absolute";
      conf.style.top = "50%";
      conf.style.left = "50%";
      conf.style.transform = "translate(-50%,-50%)";
      conf.style.backgroundColor = "rgba(0,0,0,0.8)";
      conf.style.padding = "0.5rem";
      document.body.appendChild(conf);
    });
    app.menu.settingsPanel.graphicsTab.addChild(app.menu.settingsPanel.graphicsTab.helpfulBox = new Checkbox("helpful", "Enable Helpful UI (healthbars)", true));
    app.menu.settingsPanel.graphicsTab.helpfulBox.x = app.menu.settingsPanel.graphicsTab.fpsDisplay.x;
    app.menu.settingsPanel.graphicsTab.helpfulBox.y = app.menu.settingsPanel.graphicsTab.uiScaler.y + app.menu.settingsPanel.graphicsTab.uiScaler.height + 12;
    app.menu.settingsPanel.graphicsTab.helpfulBox.on(Checkbox.CHANGE, function(b) {
      SETTINGS.helpfulUI = b;
      saveSettings();
    });
    app.menu.settingsPanel.graphicsTab.helpfulBox.setChecked(SETTINGS.helpfulUI);
  }

  // src/hotkeyMessages.ts
  var isRateLimited = false;
  var registeredHotkeyMessages = new Map(SETTINGS.hotkeyMessages);
  async function handleKeyDown(e) {
    if (e.repeat)
      return;
    const isAltPressed = UserInput.pressed[18];
    const message = registeredHotkeyMessages.get(e.key);
    if (message && isAltPressed && SETTINGS.enableHotkeyMessages)
      sendChatMessage(message);
  }
  async function sendChatMessage(message) {
    if (!app.client.socket || isRateLimited)
      return;
    const binaryChatMessage = Client.compress({
      t: config_default.PacketTypeMap.chatSend,
      msg: message
    });
    app.client.socket.send(binaryChatMessage);
    isRateLimited = true;
    setTimeout(() => isRateLimited = false, 1e3 * 1.4);
  }

  // src/settings/settingsTabHotkeyMsgs.ts
  function getHotkeyMsgsTab() {
    class HotkeyMessagesTab extends PIXI.Container {
      constructor() {
        super();
        const tab = this;
        EventDispatcher.call(this);
        this.marginLeft = 40;
        this.marginTop = 52;
        this.off = this.marginTop + 6;
        this.hkmTitle = new PIXI.Text("Hotkey Messages", {
          fontName: "Arial",
          fontSize: 18,
          lineHeight: 18,
          fill: config_default.Colors.yellow,
          strokeThickness: 3,
          lineJoin: "round"
        });
        this.hkmTitle.x = this.marginLeft - 5;
        this.hkmTitle.y = this.off;
        this.addChild(this.hkmTitle);
        this.hkmHint = new PIXI.Text("(Use fullscreen to avoid conflics with browser hotkeys)", {
          fontName: "Arial",
          fontSize: 14,
          fill: config_default.Colors.white,
          strokeThickness: 2,
          lineJoin: "round"
        });
        this.hkmHint.x = this.hkmTitle.x + this.hkmTitle.width + 3;
        this.hkmHint.y = this.off + 2;
        this.addChild(this.hkmHint);
        this.enableHKM = new Checkbox("enableHKM", "Enable Hotkey Messages", true);
        this.enableHKM.x = this.marginLeft;
        this.enableHKM.y = this.off += 34;
        this.enableHKM.on(Checkbox.CHANGE, function(b) {
          SETTINGS.enableHotkeyMessages = b;
          saveSettings();
        });
        this.addChild(this.enableHKM);
        this.enableHKM.setChecked(SETTINGS.enableHotkeyMessages);
        const doHotkey = (key) => {
          const keyLabel = new PIXI.Text(`ALT + ${key.toUpperCase()}`, {
            fontName: "Arial",
            fontSize: 16,
            fill: config_default.Colors.yellow,
            strokeThickness: 3,
            lineJoin: "round"
          });
          keyLabel.x = this.marginLeft;
          keyLabel.y = this.off += 55;
          this.addChild(keyLabel);
          const keyText = new InputField(`${key}_hotkey`, false, 24);
          keyText.setDimensions(370, 35);
          keyText.forceLowerCase = false;
          keyText.setMaxChars(40);
          if (registeredHotkeyMessages.get(key))
            keyText.setText(registeredHotkeyMessages.get(key));
          keyText.x = 125;
          keyText.y = this.off - 6;
          keyText.setFilter("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 <>?!@#$%^&*()-_+=[]{}:~|/.");
          keyText.addListener(InputField.CHANGE, function(d) {
            const message = d.data.value || "";
            registeredHotkeyMessages.set(key, message);
            SETTINGS.hotkeyMessages = [...registeredHotkeyMessages];
            saveSettings();
          });
          this.addChild(keyText);
        };
        ["a", "s", "d", "q", "w", "e"].forEach((k) => doHotkey(k));
      }
    }
    return HotkeyMessagesTab;
  }

  // src/settings/settingsTabSound.ts
  function hookSoundSettingsTab() {
    app.menu.settingsPanel.soundTab.addChild(app.menu.settingsPanel.soundTab.typewriter = new Checkbox("typewriter", "Enable Typing Noise", true));
    app.menu.settingsPanel.soundTab.typewriter.x = app.menu.settingsPanel.soundTab.volumeSlider.x;
    app.menu.settingsPanel.soundTab.typewriter.y = app.menu.settingsPanel.soundTab.volumeSlider.y + app.menu.settingsPanel.soundTab.volumeSlider.height + 14;
    app.menu.settingsPanel.soundTab.typewriter.on(Checkbox.CHANGE, function(b) {
      SETTINGS.typewriter = b;
      saveSettings();
    });
    app.menu.settingsPanel.soundTab.typewriter.setChecked(SETTINGS.typewriter);
  }

  // src/settings/settingsTabTex.ts
  var import_localforage = __toESM(require_localforage());

  // src/Scrollbar.ts
  function getScrollbar() {
    class _Scrollbar extends PIXI.Container {
      constructor(h, start = 0) {
        super();
        this.h = h;
        this.start = start;
        this.scrolling = false;
        this.oy = 0;
        this.scrollBar = new PIXI.Graphics();
        this.scrollBar.lineStyle(1, 16777215, 0.4, 0);
        this.scrollBar.drawRoundedRect(0, -5, 20, this.h, 4);
        this.scrollBar.endFill();
        this.scrollBar.x = 0;
        this.scrollBar.y = 0;
        this.scrollBar.interactive = true;
        this.scrollBar.alpha = 0.5;
        this.addChild(this.scrollBar);
        this.scrollBar.hitArea = new PIXI.Rectangle(-4, -4, 32, this.h + 8);
        this.scrollButton = new PIXI.Graphics();
        this.scrollButton.lineStyle(1, 16777215, 0.4, 0);
        this.scrollButton.beginFill(16777215, 0.2);
        this.scrollButton.drawRoundedRect(0, 0, 16, 32, 4);
        this.scrollButton.endFill();
        this.scrollButton.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        this.addChild(this.scrollButton);
        this.scrollButton.x = 2;
        this.scrollButton.y = -3 + (this.h - 39) * this.start;
        this.scrollBar.on("mouseover", () => {
          this.scrollBar.alpha = 1;
        });
        this.scrollBar.on("mouseout", () => {
          this.scrollBar.alpha = 0.5;
        });
        this.scrollBar.on("mouseupoutside", () => {
          this.scrolling = false;
        });
        this.scrollBar.on("mousedown", (c) => {
          c.stopPropagation();
          this.scrolling = true;
          this.oy = c.data.global.y / App.Scale;
        });
        this.scrollBar.on("mouseup", (c) => {
          c.stopPropagation();
          this.scrolling = false;
        });
        this.scrollBar.on("mousemove", (c) => {
          this.scroll(c.data.global.y / App.Scale);
        });
        this.scrollBar.on("pointerup", () => {
          this.scrolling = false;
        });
        this.scrollBar.on("pointerupoutside", () => {
          this.scrolling = false;
        });
        this.scrollBar.on("pointerdown", (c) => {
          this.scrolling = true;
          this.oy = c.data.global.y / App.Scale;
          this.scroll(c.data.global.y / App.Scale);
        });
        this.scrollBar.on("pointermove", (c) => this.scroll(c.data.global.y / App.Scale));
        this.wheelListener = (c) => {
          this.scrolling = true;
          this.scroll(this.oy + 0.2 * c.data.delta);
          this.scrolling = false;
        };
      }
      scrolling = false;
      oy = 0;
      scrollBar;
      scrollButton;
      wheelListener;
      enableWheel() {
        UserInput.hasListener(UserInput.WHEEL, this.wheelListener) || UserInput.addListener(UserInput.WHEEL, this.wheelListener);
      }
      disableWheel() {
        UserInput.removeListener(UserInput.WHEEL, this.wheelListener);
      }
      scroll(a) {
        if (this.scrolling) {
          let b = this.scrollButton.y + (a - this.oy);
          -3 > b ? b = -3 : b > this.h - 39 && (b = this.h - 39);
          let c = this.h / (this.h - 39);
          this.scrollButton.y = b;
          this.oy = a;
          this.emit(Scrollbar.SCROLL, 1 / this.h * (b + 3) * c);
        }
      }
      reset() {
        this.scrollButton.y = -3 + (this.h - 39) * this.start;
      }
      onMouseOver() {
        this.scrollButton.alpha = 1;
      }
      onMouseOut() {
        this.scrollButton.alpha = 0.5;
      }
    }
    const Scrollbar = _Scrollbar;
    Scrollbar.SCROLL = "scroll";
    return Scrollbar;
  }

  // src/settings/settingsTabTex.ts
  function getTexTab() {
    const maxPacks = 6;
    const FileUploader = document.createElement("input");
    FileUploader.type = "file";
    FileUploader.accept = "application/zip";
    FileUploader.multiple = false;
    FileUploader.style.display = "none";
    document.body.appendChild(FileUploader);
    class TexTab extends PIXI.Container {
      constructor() {
        super();
        const tab = this;
        EventDispatcher.call(this);
        this.marginLeft = 40;
        this.marginTop = 52;
        this.off = this.marginTop + 6;
        this.texTitle = new PIXI.Text("Texture Packs", {
          fontName: "Arial",
          fontSize: 18,
          lineHeight: 18,
          fill: config_default.Colors.yellow,
          strokeThickness: 3,
          lineJoin: "round"
        });
        this.texTitle.x = this.marginLeft - 5;
        this.texTitle.y = this.off;
        this.addChild(this.texTitle);
        this.texHint = new PIXI.Text("(make sure to click save)", {
          fontName: "Arial",
          fontSize: 14,
          fill: config_default.Colors.white,
          strokeThickness: 2,
          lineJoin: "round"
        });
        this.texHint.x = this.texTitle.x + this.texTitle.width + 3;
        this.texHint.y = this.off + 2;
        this.addChild(this.texHint);
        this.off += 30;
        const customTitle = new PIXI.Text("Custom Pack (read docs for tutorial)", {
          fontName: "Arial",
          fontSize: 16,
          fill: config_default.Colors.white,
          strokeThickness: 2,
          lineJoin: "round"
        });
        customTitle.x = this.marginLeft;
        customTitle.y = this.off;
        this.addChild(customTitle);
        this.off += 20;
        const customDesc = new PIXI.Text("Upload a zip file containing your textures.", {
          fontName: "Arial",
          fontSize: 14,
          fill: config_default.Colors.yellow,
          strokeThickness: 2,
          lineJoin: "round"
        });
        customDesc.x = this.marginLeft;
        customDesc.y = this.off;
        this.addChild(customDesc);
        this.off += 24;
        const uploader = new Button("uploader");
        uploader.addListener(Button.BUTTON_RELEASED, async () => {
          if (await import_localforage.default.getItem("custom_pack")) {
            await import_localforage.default.removeItem("custom_pack");
            delete this.hasCust;
            this.runPacks();
          } else {
            FileUploader.click();
          }
        });
        uploader.x = this.marginLeft + 8;
        uploader.y = this.off;
        uploader.scale.x = uploader.scale.y = 0.75;
        this.addChild(uploader);
        this.off += 12;
        const off = this.off;
        this.packIndex = 0;
        !(this.runPacks = async () => {
          this.off = off;
          if (this.hadPacks)
            this.hadPacks.map((p) => p.destroy());
          this.hadPacks = [];
          const packs = this.packList || (this.packList = await fetch(`${config_default.api}/packs`).then((r) => r.json()));
          const custom = this.hasCust || (this.hasCust = await import_localforage.default.getItem("custom_pack") || true);
          const packList = packs.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1).slice(this.packIndex, this.packIndex + maxPacks);
          if (custom && custom !== true) {
            packList.unshift({
              id: config_default.customDelimiter,
              name: "Custom Pack",
              description: "Custom texture pack: " + custom.name,
              author: "You!",
              hasCombined: false,
              hasSeamless: false
            });
            uploader.setText("Delete");
            uploader.setTint(config_default.Colors.red);
          } else {
            uploader.setText("Upload");
            uploader.setTint(config_default.Colors.grey);
          }
          packList.forEach((pak) => {
            const hasPack = SETTINGS.texturePack == pak.id;
            const packName = new PIXI.Text(`${pak.name || "Texture Pack"} (by ${pak.author || "Unnamed"})`, {
              fontName: "Arial",
              fontSize: 16,
              fill: config_default.Colors.white,
              strokeThickness: 2,
              lineJoin: "round"
            });
            packName.x = this.marginLeft;
            packName.y = this.off += 28;
            this.hadPacks.push(this.addChild(packName));
            const flags = [];
            if (pak.hasCombined)
              flags.push("textures");
            if (pak.hasSeamless)
              flags.push("terrain");
            const packDescription = new PIXI.Text(`${pak.description || "No Description."}${flags.length ? ` (${flags.join(", ")})` : ""}`, {
              fontName: "Arial",
              fontSize: 14,
              fill: config_default.Colors.white,
              strokeThickness: 2,
              lineJoin: "round"
            });
            packDescription.x = this.marginLeft;
            packDescription.y = this.off += packName.height + 2;
            this.hadPacks.push(this.addChild(packDescription));
            const packButton = new Button(`pack_btn_${pak.id}`);
            packButton.x = packName.x + packName.width + 12;
            packButton.y = this.off - packName.height;
            packButton.setText(hasPack ? "Remove" : "Use");
            packButton.setTint(hasPack ? config_default.Colors.red : config_default.Colors.green);
            packButton.scale.x = packButton.scale.y = 0.5;
            packButton.addListener(Button.BUTTON_RELEASED, async () => {
              SETTINGS.texturePack = hasPack ? null : pak.id;
              app.menu.settingsPanel.controlsTab.forceRefresh = true;
              saveSettings();
              this.runPacks();
            });
            this.hadPacks.push(this.addChild(packButton));
          });
        })();
      }
    }
    TexTab.prototype.onShow = function() {
      if (!this.scroller) {
        const off = this.parent.texTabButton.height + 32;
        this.scroller = new (getScrollbar())(this.parent.height - off - 12 - this.parent.applyButton.height);
        this.scroller.x = this.parent.width - this.scroller.width * 1.75;
        this.scroller.y = off;
        this.scroller.on(getScrollbar().SCROLL, (prog) => {
          this.packIndex = Math.round((this.packList.length - maxPacks) * prog);
          this.runPacks();
        });
        this.addChild(this.scroller);
      }
      this.scroller.enableWheel();
      const tab = this;
      FileUploader.onchange = () => {
        [...FileUploader.files].forEach(async (f) => {
          if (f.type.startsWith("application/") && f.type.includes("zip")) {
            await import_localforage.default.setItem("custom_pack", f);
            delete tab.hasCust;
            tab.runPacks();
            app.menu.settingsPanel.controlsTab.forceRefresh = true;
          }
        });
      };
    };
    TexTab.prototype.onHide = function() {
      this.scroller.disableWheel();
    };
    return TexTab;
  }

  // src/settings/settingsTab.ts
  function settingsTab() {
    SettingsPanel.OPEN_TAB = "opened_settings_tab";
    if (!app.menu?.settingsPanel)
      return setTimeout(() => settingsTab(), 500);
    function SettingsPanelNew(w, h) {
      const pan = new SettingsPanel(w, h);
      function newTab(title, name, x, tab) {
        name = `${name}Tab`;
        pan[name] = new tab();
        pan[`${name}Button`] = new PIXI.Text(title, {
          fontName: "Arial",
          fontSize: 18,
          lineHeight: 18,
          fill: config_default.Colors.yellow,
          strokeThickness: 3,
          lineJoin: "round"
        });
        pan[`${name}Button`].resolution = 1.5 * App.DevicePixelRatio;
        pan[`${name}Button`].anchor.x = pan[`${name}Button`].anchor.y = 0.5;
        pan[`${name}Button`].x = x + 56;
        pan[`${name}Button`].y = 28;
        pan.addChild(pan[`${name}Button`]);
        pan[`${name}ButtonBackground`] = new PIXI.Graphics();
        pan[`${name}ButtonBackground`].beginFill(16777215, 0.1);
        pan[`${name}ButtonBackground`].drawRoundedRect(0, 0, 112, 30, 2);
        pan[`${name}ButtonBackground`].endFill();
        pan[`${name}ButtonBackground`].x = x;
        pan[`${name}ButtonBackground`].y = 12;
        pan[`${name}ButtonBackground`].interactive = true;
        pan[`${name}ButtonBackground`].on("touchstart", pan.displayTab.bind(pan, SettingsPanel.Tabs.UTIL));
        pan[`${name}ButtonBackground`].on("mousedown", pan.displayTab.bind(pan, SettingsPanel.Tabs.UTIL));
        pan[`${name}ButtonBackground`].on("mouseover", function() {
          pan[`${name}ButtonBackground`].tint = 11184810;
        });
        pan[`${name}ButtonBackground`].on("mouseout", function() {
          pan[`${name}ButtonBackground`].tint = 16777215;
        });
        pan.addChild(pan[`${name}ButtonBackground`]);
      }
      newTab("Texture Pack", "tex", 302, getTexTab());
      newTab("Messages", "hkm", 418, getHotkeyMsgsTab());
      return pan;
    }
    SettingsPanel.Tabs.TEX = "tex";
    SettingsPanel.Tabs.HKM = "hkm";
    const oldX = app.menu.settingsPanel.x, oldY = app.menu.settingsPanel.y;
    app.menu.settingsPanel.destroy();
    app.menu.settingsPanel = SettingsPanelNew(660, 524);
    app.menu.settingsPanel.x = oldX;
    app.menu.settingsPanel.y = oldY;
    app.menu.resize();
    app.menu.settingsPanel.displayTab = function(name) {
      AudioEffects.ButtonClick.audio.play();
      saveSettings();
      Object.values(SettingsPanel.Tabs).filter((t2) => t2 !== name).forEach((i) => {
        const t2 = this[`${i}Tab`];
        if (t2.parent) {
          if (t2.onHide)
            t2.onHide();
          this.removeChild(t2);
        }
        this[`${i}TabButtonBackground`].alpha = 1;
      });
      const t = this[`${name}Tab`];
      this[`${name}TabButtonBackground`].alpha = 0;
      this.addChild(t);
      if (t.onShow)
        t.onShow();
      app.menu.settingsPanel.selectedTab = name;
      App.Layer.memberMenu.emit(SettingsPanel.OPEN_TAB, name);
    };
    Object.values(SettingsPanel.Tabs).forEach((d) => {
      const tab = app.menu.settingsPanel[`${d}TabButtonBackground`];
      tab.on("mousedown", app.menu.settingsPanel.displayTab.bind(app.menu.settingsPanel, d));
      tab._events.mousedown.shift();
    });
    hookSoundSettingsTab();
    hookGraphicsSettingsTab();
  }

  // src/shareURLs.ts
  var gameLinkData = { id: "", name: "", pass: "" };
  function clearSaved() {
    window.location.hash = "";
    gameLinkData.id = gameLinkData.name = gameLinkData.pass = "";
  }
  function initShareURLHook() {
    App.Layer.on("join_game", (name, id, pass) => {
      setHash(id, name, pass);
    });
    app.client.addListener(Protocol.DISCONNECT, () => {
      clearSaved();
      settingsTab();
    });
    APIClient.realPostCreateGame = APIClient.postCreateGame;
    APIClient.postCreateGame = function(serverID, settings, mode, time, serverName, serverPass, customData, auth) {
      setHash(serverID, serverName, serverPass);
      return APIClient.realPostCreateGame(serverID, settings, mode, time, serverName, serverPass, customData, auth);
    };
  }
  function tryJoinLink(args) {
    const [id, name, pass] = args || window.location.hash.substring(1)?.split("&").map(decodeURIComponent) || [];
    if (!id || !name)
      return;
    App.Console.log(`Attempting to join room ${name}...`);
    const loadingMenu = App.Layer.loadingMenu;
    App.Layer.addChild(loadingMenu);
    loadingMenu.show();
    loadingMenu.setTitle(`Click to join server.
${name}`);
    loadingMenu.cancelCount = -1;
    loadingMenu.joinButton = new Button("join");
    loadingMenu.joinButton.selected = true;
    loadingMenu.joinButton.setText("Join");
    loadingMenu.joinButton.scale.x = loadingMenu.joinButton.scale.y = 0.8;
    loadingMenu.joinButton.addListener(Button.BUTTON_RELEASED, function() {
      removeJoinStuff();
      loadingMenu.show();
      App.Layer.emit("join_game", name, id, pass || "");
    });
    loadingMenu.joinButton.x = loadingMenu.title.x + 0.5 * (loadingMenu.title.width - loadingMenu.joinButton.width);
    loadingMenu.joinButton.y = loadingMenu.title.y + 40;
    loadingMenu.joinButton.setTint(config_default.Colors.green);
    loadingMenu.container.addChild(loadingMenu.joinButton);
    loadingMenu.cancelButton2 = new Button("cancel2");
    loadingMenu.cancelButton2.setText("Cancel");
    loadingMenu.cancelButton2.scale.x = loadingMenu.cancelButton2.scale.y = 0.8;
    loadingMenu.cancelButton2.addListener(Button.BUTTON_RELEASED, function() {
      removeJoinStuff();
      clearSaved();
      return loadingMenu.emit(Layer.Events.LOADING_CANCEL);
    });
    loadingMenu.cancelButton2.x = loadingMenu.joinButton.x + loadingMenu.joinButton.width + 8;
    loadingMenu.cancelButton2.y = loadingMenu.title.y + 40;
    loadingMenu.cancelButton2.setTint(config_default.Colors.red);
    loadingMenu.container.addChild(loadingMenu.cancelButton2);
    loadingMenu.title.y -= 36;
    function removeJoinStuff() {
      loadingMenu.title.y += 36;
      loadingMenu.container.removeChild(loadingMenu.joinButton);
      loadingMenu.container.removeChild(loadingMenu.cancelButton2);
    }
  }

  // src/utils.ts
  var inGame = () => app.matchStarted && app.client.socket && app.client.socket.readyState == WebSocket.OPEN;
  function setHash(id, name, pass) {
    gameLinkData.id = id;
    gameLinkData.name = name;
    gameLinkData.pass = pass || "";
    window.location.hash = pass ? `${id}&${encodeURIComponent(name)}&${encodeURIComponent(pass)}` : `${id}&${encodeURIComponent(name)}`;
  }
  function io(url) {
    return window.io(url);
  }

  // src/fpsCounter.ts
  var frameDisplay = document.createElement("div");
  Object.entries({
    padding: "0.3rem 0.4rem",
    font: "16px Arial",
    display: "none",
    position: "fixed",
    top: "0px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
    pointerEvents: "none",
    userSelect: "none"
  }).forEach((e) => {
    frameDisplay.style[e[0]] = e[1];
  });
  frameDisplay.textContent = "...";
  document.body.appendChild(frameDisplay);
  function showFPS() {
    let lastUpdate = Date.now(), frames = 0;
    if (SETTINGS.showFPS)
      frameDisplay.style.display = "block";
    function updateCounter() {
      const now = Date.now(), elapsed = now - lastUpdate;
      if (elapsed < 500) {
        frames++;
      } else {
        let fps = `${Math.round(frames / (elapsed / 1e3))} FPS`;
        if (inGame())
          fps += ` - ${App.Stats.ping || 0}ms`;
        if (frameDisplay.innerText !== fps)
          frameDisplay.innerText = fps;
        frames = 0;
        lastUpdate = now;
        frameDisplay.style.display = "block";
      }
      if (!SETTINGS.showFPS)
        return frameDisplay.style.display = "none";
    }
    app._stepCallback = app._stepCallback || app.stepCallback;
    app.stepCallback = function(...d) {
      try {
        updateCounter();
      } catch (err) {
        console.error(err);
      }
      return app._stepCallback(...d);
    };
  }

  // src/friendOnlineHook.ts
  function initFriendOnlineHook() {
    SocialMenu.prototype._maskFriendList = SocialMenu.prototype.maskFriendList;
    SocialMenu.prototype.maskFriendList = function(scrollDist) {
      this.friends.sort((f1, f2) => f2.seen.getTime() - f1.seen.getTime()).forEach((f, fi) => f.y = 47 + fi * SocialMenu.ItemHeight);
      this._maskFriendList(scrollDist);
    };
    FriendItem = class FriendItem extends PIXI.Graphics {
      id;
      name;
      seen;
      clan;
      nameLabel;
      onlineNow;
      constructor(id, name, seen, clan) {
        super();
        this.id = id;
        this.name = name;
        this.seen = new Date(Date.parse(seen) - 6e4 * new Date().getTimezoneOffset());
        this.onlineNow = !!App.Layer.socialMenu.onlineFriends?.includes(this.id);
        if (this.onlineNow)
          this.seen = new Date();
        this.clan = clan;
        this.beginFill(16777215, 0.15);
        this.drawRoundedRect(0, 0, 340, 26, 4);
        this.endFill();
        this.interactive = true;
        this.tint = 12303291;
        this.on("mouseover", () => {
          this.tint = 16777215;
        });
        this.on("mouseout", () => {
          this.tint = 12303291;
        });
        this.on("mousedown", () => this.emit(SocialMenu.ACCESS_PROFILE, this.id));
        this.on("rightdown", () => this.emit(SocialMenu.SHOW_FRIEND_DROPDOWN, this.id));
        this.beginFill(this.onlineNow ? config_default.Colors.dotGreen : 30 > Math.round((Date.now() - this.seen.getTime()) / 1e3) ? config_default.Colors.dotOrange : config_default.Colors.dotGrey, 1);
        this.drawCircle(320, 13, 8);
        this.endFill();
        this.nameLabel = new PIXI.BitmapText(this.name, { fontName: "Open Sans", fontSize: 22 });
        this.nameLabel.x = 8;
        this.nameLabel.y = 2;
        this.addChild(this.nameLabel);
      }
    };
  }
  async function updateFriendList(reload = true) {
    if (App.Layer.socialMenu.mode == "friends") {
      try {
        const friendsOnline = await fetch(`${config_default.api}/onlineplayers`).then((res) => res.json());
        App.Layer.socialMenu.onlineFriends = friendsOnline?.filter((f) => App.Layer.socialMenu.friends.find((fr) => fr.id == f)) || [];
      } catch {
        App.Layer.socialMenu.onlineFriends = [];
      }
      if (reload)
        await App.Layer.socialMenu.loadFriends();
    }
  }

  // src/friendSearch.ts
  function socialMenuHook() {
    SocialMenu.prototype.maskInvitationList = function(scrollDist) {
      const pl = "Type to search.";
      const pad = 8;
      if (!this.listSearch) {
        this.listSearch = new InputField("list_search", false, SocialMenu.ItemHeight / 1.5);
        this.listSearch.setDimensions(this.listContainer.width, SocialMenu.ItemHeight);
        this.listSearch.forceLowerCase = false;
        this.listSearch.setMaxChars(128);
        this.listSearch.setFilter("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890:/?.#-_ ");
        this.listSearch.x = pad;
        this.listSearch.y = this.height - this.listSearch.height - pad / 2 - this.infoText.height;
        this.listSearch.setText(pl);
        const ls = this;
        this.listSearch.addListener(InputField.CHANGE, function(d2) {
          d2 = d2.data.value || "";
          if (d2.startsWith(pl) || d2 == pl.slice(0, pl.length - 1)) {
            d2 = d2.substring(pl.length);
            ls.listSearch.setText(d2);
          }
          ls.maskInvitationList(ls.inviteScrollRatio);
        });
      }
      this.listContainer.removeChildren = () => {
        this.listContainer.removeChild(...this.listContainer.children);
        this.container.removeChild(this.listSearch);
      };
      const searchTerm = this.listSearch.getText() || "";
      const filtered = searchTerm && searchTerm !== pl ? this.invites.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())) : null;
      this.invites.forEach((i) => {
        i.alpha = 1;
        i.isRed = false;
        if (!i.redReady) {
          i.redReady = true;
          i.on("mouseout", function() {
            i.tint = i.isRed ? config_default.Colors.red : 12303291;
          });
        }
      });
      if (!this.listSearch.parent)
        this.container.addChild(this.listSearch);
      const listHeight = SocialMenu.ListHeight - this.listSearch.height - pad / 2;
      const itemDisplayCount = Math.floor(listHeight / SocialMenu.ItemHeight);
      if (this.invites.length <= itemDisplayCount) {
        this.listContainer.y = 0;
      } else {
        this.invites.forEach((i) => this.listContainer.removeChild(i));
        this.listContainer.y = -(scrollDist * (this.invites.length * SocialMenu.ItemHeight - (listHeight - SocialMenu.ItemHeight)));
        for (var d = Math.round(Math.abs(this.listContainer.y / SocialMenu.ItemHeight)), displayOffset = 0; displayOffset < itemDisplayCount; displayOffset++) {
          const inv = this.invites[d + displayOffset];
          this.listContainer.addChild(inv);
          let g;
          if (0 === displayOffset) {
            g = d * SocialMenu.ItemHeight + this.listContainer.y;
            inv.alpha = 0 <= g ? 1 : 1 - 1 / (0.5 * SocialMenu.ItemHeight) * Math.abs(g);
          } else {
            displayOffset === itemDisplayCount - 1 ? (g = d * SocialMenu.ItemHeight + this.listContainer.y, inv.alpha = 0 > g ? 1 : 1 - 1 / (0.5 * SocialMenu.ItemHeight) * Math.abs(g)) : inv.alpha = 1;
          }
        }
        this.inviteScrollRatio = scrollDist;
      }
      this.listSearch.y = this.height - this.listSearch.height - pad / 2 - this.infoText.height;
      this.invites.forEach((i) => {
        i.tint = 12303291;
        if (!filtered)
          return;
        if (filtered.includes(i)) {
          i.tint = 12603201;
          i.alpha = 1;
          i.isRed = true;
        } else {
          i.alpha *= 0.5;
        }
      });
    };
  }

  // src/fullscreenHook.ts
  function hookFullscreen() {
    window.addEventListener("keydown", (e) => {
      if (e.key == "F11") {
        e.preventDefault();
        if (document.fullscreenElement)
          document.exitFullscreen();
        else
          document.querySelector("html").requestFullscreen();
      }
    });
  }

  // src/hookUtilsMenu.ts
  function hookUtilsMenu() {
    const menu = App.Layer.memberMenu;
    menu.memberButton.parent.removeChild(menu.memberButton);
    menu.clanButton.parent.removeChild(menu.clanButton);
    let menuClanState = 0;
    menu.memberclanButton = new MemberMenuButton("", 16763904, 18);
    menu.memberclanButton.x = 0;
    menu.memberclanButton.y = menu.rankingButton.y + 70;
    menu.memberclanButton.on(MemberMenuButton.BUTTON_PRESSED, () => {
      if (!["member", "clan"].includes(App.Layer.memberMenu.mode))
        menuClanState = 0;
      menuClanState++;
      if (menuClanState == 3)
        menuClanState = 0;
      title1.tint = title2.tint = config_default.Colors.yellow;
      switch (menuClanState) {
        case 0:
          menu.emit(Layer.Events.MENU_ACCESS);
          break;
        case 1:
          menu.emit(Layer.Events.MEMBER_ACCESS);
          title1.tint = config_default.Colors.green;
          break;
        case 2:
          menu.emit(Layer.Events.CLAN_BROWSER_ACCESS);
          title2.tint = config_default.Colors.green;
          break;
      }
    });
    menu.memberButton.setActive = (n) => {
      if (menuClanState == 1 || !menuClanState && !n) {
        menu.memberclanButton.setActive(n);
        if (!n)
          title1.tint = config_default.Colors.yellow;
      }
    };
    menu.clanButton.setActive = (n) => {
      if (menuClanState == 2 || !menuClanState && !n) {
        menu.memberclanButton.setActive(n);
        if (!n)
          title2.tint = config_default.Colors.yellow;
      }
    };
    const ico1 = new PIXI.Sprite(App.CombinedTextures["menu_icon_players"]);
    ico1.x = 0.25 * menu.memberclanButton.rectWidth;
    menu.memberclanButton.addChild(ico1);
    const ico2 = new PIXI.Sprite(App.CombinedTextures["menu_icon_clans"]);
    ico2.x = 0.75 * menu.memberclanButton.rectWidth;
    menu.memberclanButton.addChild(ico2);
    ico1.scale.x = ico1.scale.y = ico2.scale.x = ico2.scale.y = 0.25;
    ico1.anchor.x = ico1.anchor.y = ico2.anchor.x = ico2.anchor.y = 0.5;
    ico1.tint = ico2.tint = config_default.Colors.white;
    ico1.y = ico2.y = 0.37 * menu.memberclanButton.rectHeight;
    const icosep = new PIXI.Text("/", {
      fontSize: 16,
      fontName: "Arial",
      fill: config_default.Colors.white,
      lineJoin: "round",
      strokeThickness: 3
    });
    icosep.x = 0.5 * menu.memberclanButton.rectWidth;
    icosep.y = 0.37 * menu.memberclanButton.rectHeight;
    icosep.anchor.x = icosep.anchor.y = 0.5;
    menu.memberclanButton.addChild(icosep);
    const title1 = new PIXI.Text("Players", {
      fontSize: 11,
      fontName: "Arial",
      fill: config_default.Colors.white,
      lineJoin: "round",
      strokeThickness: 2
    });
    title1.x = 0.25 * menu.memberclanButton.rectWidth;
    menu.memberclanButton.addChild(title1);
    const title2 = new PIXI.Text("Clans", {
      fontSize: 14,
      fontName: "Arial",
      fill: config_default.Colors.white,
      lineJoin: "round",
      strokeThickness: 2
    });
    title2.x = 0.75 * menu.memberclanButton.rectWidth;
    menu.memberclanButton.addChild(title2);
    const titlesep = new PIXI.Text("/", {
      fontSize: 16,
      fontName: "Arial",
      fill: config_default.Colors.white,
      lineJoin: "round",
      strokeThickness: 3
    });
    titlesep.x = 0.5 * menu.memberclanButton.rectWidth;
    menu.memberclanButton.addChild(titlesep);
    title1.y = title2.y = titlesep.y = 0.7 * menu.memberclanButton.rectHeight;
    title1.anchor.x = title1.anchor.y = title2.anchor.x = title2.anchor.y = titlesep.anchor.x = titlesep.anchor.y = 0.5;
    title1.tint = title2.tint = config_default.Colors.yellow;
    menu.container.addChild(menu.memberclanButton);
    const setActive = menu.clanButton.setActive.bind(menu.clanButton);
    menu.clanButton.setActive = (n) => {
      setActive(n);
      if (!n)
        menu.utilsButton.setActive(0);
    };
    menu.utilsButton = new MemberMenuButton("NinjaIOUtils", 16763904, 15, "gears_icon");
    menu.utilsButton.x = 0;
    menu.utilsButton.y = menu.memberButton.y + 70;
    menu.utilsButton.on(MemberMenuButton.BUTTON_PRESSED, () => {
      if (menu.utilsButton.active) {
        menu.utilsButton.setActive(0);
        menu.emit(Layer.Events.MENU_ACCESS);
        return;
      }
      menu.emit(Layer.Events.MENU_ACCESS);
      menu.playButton.setActive(0);
      menu.utilsButton.setActive(1);
      App.Layer.utilsMenu.show();
      App.Layer.addChild(App.Layer.utilsMenu);
      App.Layer.emit(Layer.Events.HIDE_MENU);
      app.onResize();
    });
    menu.utilsButton.icon.scale.x = menu.utilsButton.icon.scale.y = 0.7;
    menu.container.addChild(menu.utilsButton);
    class UtilsMenu extends Feature {
      ox = 0;
      oy = 0;
      off = 0;
      marginLeft = 0;
      background = new PIXI.Graphics();
      closeButton = new ImgButton();
      pmTitle = new PIXI.Text("NinjaIOUtils", {
        fontName: "Arial",
        fontSize: 19,
        lineHeight: 16,
        fill: config_default.Colors.yellow,
        strokeThickness: 3,
        lineJoin: "round"
      });
      constructor() {
        super();
        this.background.interactive = true;
        this.background.x = 0;
        this.background.y = 40;
        this.background.lineStyle(1, 16777215, 0.1, 0);
        this.background.beginFill(3355443, 0.9);
        this.background.drawRect(0, 0, 660, 524);
        this.background.endFill();
        this.background.beginFill(0, 0.3);
        this.background.drawRect(10, 10, 640, 504);
        this.background.endFill();
        this.background.drawRect(15, 42, 630, 2);
        this.container.addChild(this.background);
        this.ox = 10;
        this.oy = 60;
        this.closeButton.x = this.background.width - 40;
        this.closeButton.y = this.oy - 6;
        this.closeButton.scale.x = this.closeButton.scale.y = 0.8;
        this.closeButton.on(ImgButton.CLICK, () => App.Layer.memberMenu.emit(Layer.Events.MENU_ACCESS));
        this.container.addChild(this.closeButton);
        this.pmTitle.x = 0.5 * this.width - 20;
        this.pmTitle.y = this.oy - 4;
        this.pmTitle.anchor.x = 0.5;
        this.container.addChild(this.pmTitle);
        this.container.x = 0.5 * -this.width;
        this.reposition();
      }
      reposition() {
        this.off = 0;
      }
      show() {
      }
    }
    App.Layer.mainMenuHides.push(App.Layer.utilsMenu = new UtilsMenu());
    [
      "loginMenu",
      "memberBrowserMenu",
      "clanBrowserMenu",
      "registerMenu",
      "upResetMenu",
      "profileMenu",
      "userMenu",
      "rankingMenu",
      "newsMenu",
      "partnerMenu",
      "serverListMenu",
      "clanMenu",
      "serverCreationMenu",
      "renameMenu",
      "logoutMenu",
      "guestProfileMenu"
    ].forEach((e) => App.Layer[e].hides.push(App.Layer.utilsMenu));
    App.Layer.features.push(App.Layer.utilsMenu);
  }

  // src/userCommunicationProtocol.ts
  var commConfig = {
    prefix: "$NIOU",
    sep: "|"
  };
  var commPackets = {
    gameLink: "requestGameLink"
  };
  function decodeUserCommunication(message) {
    if (!message.startsWith(commConfig.prefix))
      return null;
    const args = message.split(commConfig.sep);
    if (!Object.values(commPackets).includes(args[1]))
      return null;
    return {
      packet: args[1],
      args: args.slice(2)
    };
  }
  async function communicateUser(id, packetID, args) {
    await APIClient.postFriendMessage(id, [commConfig.prefix, packetID, ...args].join(commConfig.sep), app.credential.id);
    return true;
  }

  // src/joinGameHook.ts
  function hookJoinGameButton() {
    const btn = new Button("usr_join");
    btn.setText("Join Game");
    btn.scale.x = btn.scale.y = 0.75;
    const repos = () => btn.x = App.Layer.userMenu.ox + App.Layer.userMenu.w - btn.width - 30;
    repos();
    btn.y = App.Layer.userMenu.h - 10;
    btn.visible = false;
    btn.addListener(Button.BUTTON_PRESSED, async () => {
      btn.setText("Requesting link...");
      repos();
      const rej = (msg) => {
        btn.setText(msg);
        repos();
        setTimeout(() => (btn.setText("Join Game"), repos()), 4e3);
      };
      const req = String(Date.now());
      await communicateUser(App.Layer.userMenu.id, commPackets.gameLink, [req]);
      const res = (await fetch(`${config_default.api}/requestlink?id=${req}&userid=${App.Layer.userMenu.id}`).then((r) => r.json()))?.[0];
      if (res == false)
        rej("User not in game.");
      else if (res == true)
        rej("User in private game.");
      else if (Array.isArray(res)) {
        btn.setText("Join Game");
        repos();
        App.Layer.userMenu.onCloseButtonReleased();
        tryJoinLink([res[0], res[1], res[2]]);
      } else
        return rej("User not online.");
    });
    App.Layer.userMenu.container.addChild(btn);
    App.Layer.userMenu._load = App.Layer.userMenu.load;
    App.Layer.userMenu.load = async (id, type) => {
      btn.visible = false;
      await App.Layer.userMenu._load(id, type);
      await updateFriendList(false);
      btn.visible = App.Layer.socialMenu.onlineFriends.includes(App.Layer.userMenu.id);
    };
  }

  // src/mapIdentifier.ts
  function initMapIdentifier() {
    Client.prototype.onMessage = function(_a) {
      const a = Client.decompress(_a.data);
      try {
        if (a.type == config_default.PacketTypeMap.data && a.data.type == config_default.PacketTypeMap.joinedMessage && a.data.info.startsWith("You joined ")) {
          let roomName = a.data.info.substring("You joined ".length);
          setHash(app.client.server.id, roomName, gameLinkData.pass);
        }
        const repFail = () => App.Console.log(`# Failed to identify map. Please report to Meow.`);
        const repSuccess = (id, name) => App.Console.log(`# Identified map as ${name} (ID: ${id}).`);
        if (a.type == config_default.PacketTypeMap.data2 && a.data.t == config_default.PacketTypeMap.systemMessage && a.data.msg.startsWith("Joining ")) {
          const mapName = (a.data.msg.match(/(?: - )(.*)(?: by)/) || [])[1];
          this.mapID = 0;
          if (mapName) {
            const mapID = config_default.MapIDs[mapName];
            if (mapID) {
              repSuccess(mapID, mapName);
              this.mapID = mapID;
            } else
              repFail();
          } else
            repFail();
        } else if (a.type == config_default.PacketTypeMap.data2 && a.data.t == config_default.PacketTypeMap.systemMessage && a.data.msg.startsWith("loading map: ")) {
          const mapName = a.data.msg.substring("loading map: ".length);
          this.mapID = 0;
          if (mapName) {
            const mapID = config_default.MapIDs[mapName];
            if (mapID) {
              repSuccess(mapID, mapName);
              this.mapID = mapID;
            } else
              repFail();
          } else
            repFail();
        }
      } catch (err) {
        console.error(err);
      }
      this.dispatchEvent(a);
    };
  }

  // src/matchStartHook.ts
  var startingLevel = { l: 0 };
  function matchStartHook() {
    App.prototype.realInitGameMode = App.prototype.initGameMode;
    App.prototype.initGameMode = function(data) {
      this.realInitGameMode(data);
      this.game.on(Game.MATCH_START, async function() {
        startingLevel.l = 0;
        startingLevel.l = Number((await APIClient.getUserProfile(app.credential.playerid)).experience);
      });
    };
  }

  // src/matchEndHook.ts
  function matchEndHook() {
    Game.prototype._endGame = Game.prototype.endGame;
    Game.prototype.endGame = function(data) {
      if (SETTINGS.apiKey) {
        App.Console.log("Attempting to upload match score...");
        if (this.manager.isRanked) {
          try {
            const leaderIndex = data.leaderboard.id.indexOf(this.sessionId);
            const statModel = {
              id: app.credential.playerid,
              map: app.client.mapID,
              mode: this.mode,
              kills: data.leaderboard.kills[leaderIndex],
              deaths: data.leaderboard.deaths[leaderIndex],
              caps: data.leaderboard.points ? data.leaderboard.points[leaderIndex] : 0
            };
            fetch(`${config_default.api}/submit?key=${SETTINGS.apiKey}`, {
              method: "POST",
              body: JSON.stringify(statModel),
              headers: {
                "Content-Type": "application/json"
              }
            }).then((res) => res.json()).then((res) => {
              if (res.err) {
                App.Console.log(`Failed to upload match score! ERR_${res.err}`);
                App.Console.log(`Error: ${res.message}`);
              } else {
                App.Console.log("Successfully uploaded match score!");
              }
            }).catch((err) => {
              App.Console.log("Failed to upload match score! (check console for errors)");
              console.error(err);
            });
          } catch (err) {
            App.Console.log("Failed to upload match score! (check console for errors)");
            console.error(err);
          }
        } else {
          App.Console.log("Match is unranked or custom, scores not uploaded.");
        }
      }
      app.game.reticle.children.forEach((c) => c.visible = false);
      (async () => {
        const xp = Number((await APIClient.getUserProfile(app.credential.playerid))?.experience) || 0;
        if (xp && startingLevel.l) {
          const plevel = Math.min(Math.max(Math.floor(0.2 * Math.sqrt(startingLevel.l / 15.625)), 1), 160);
          const level = Math.min(Math.max(Math.floor(0.2 * Math.sqrt(xp / 15.625)), 1), 160);
          const xpNeeded = 15.625 * Math.pow((level + 1) / 0.2, 2) - (1 === level ? 0 : 15.625 * Math.pow(level / 0.2, 2));
          const gain = xp - startingLevel.l;
          App.Console.log(`You gained ${gain.toLocaleString()} (${Math.round(gain / xpNeeded * 1e3) / 10}%) experience this round!`, config_default.Colors.green);
          if (level > plevel)
            App.Console.log(`You leveled up! You are now level ${level}.`, config_default.Colors.yellow);
        }
        startingLevel.l = 0;
      })();
      return this._endGame(data);
    };
  }

  // src/repositionItems.ts
  function reposItems() {
    if (!app.menu)
      return;
    try {
      App.Layer.partyMenu.reposition();
      app.menu.joinButton.x = app.menu.backgroundImage.x + 28;
      app.menu.serverListButton.x = app.menu.joinButton.x + app.menu.joinButton.width + 26;
      app.menu.serverListButton.y = app.menu.joinButton.y;
      app.menu.serverCreateButton.x = app.menu.serverListButton.x - (app.menu.serverCreateButton.width - app.menu.serverListButton.width);
      app.menu.serverCreateButton.y = app.menu.serverListButton.y + app.menu.serverListButton.height + 14;
      app.menu.partyButton.x = app.menu.serverCreateButton.x - (app.menu.partyButton.backgroundEnabled.width - 10);
      app.menu.partyButton.y = app.menu.serverCreateButton.y - 4;
      app.menu.onlineOption.x = app.menu.joinButton.x + (app.menu.partyButton.x - app.menu.joinButton.x - app.menu.onlineOption.width) * 0.75;
      app.menu.onlineOption.y = app.menu.serverCreateButton.y + app.menu.serverCreateButton.height / 2 - app.menu.onlineOption.height / 2 + 2;
    } catch {
    }
  }
  function reindexItems() {
    app.menu.modeContainer.parent.addChild(app.menu.modeContainer);
    app.menu.serverContainer.parent.addChild(app.menu.serverContainer);
  }

  // src/onlineStatus.ts
  var failedOnline = false;
  var wentOnline = false;
  var onlineSocket;
  function goOnline() {
    if (app.credential.accounttype == "guest") {
      if (failedOnline)
        return;
      failedOnline = true;
      return App.Console.log("Failed to go online: You are not logged in!");
    }
    failedOnline = false;
    if (onlineSocket)
      onlineSocket.disconnect();
    onlineSocket = io(config_default.api);
    onlineSocket.on("connect", () => onlineSocket && onlineSocket.emit("init", 0 /* online */, app.credential.playerid));
    onlineSocket.on("success", () => {
      App.Console.log("Successfully went online!");
      wentOnline = true;
    });
    onlineSocket.on("fail", (msg) => {
      wentOnline = false;
      failedOnline = true;
      App.Console.log(`Failed to go online: ${msg}`);
    });
    onlineSocket.on("disconnect", () => {
      onlineSocket = null;
      if (wentOnline)
        App.Console.log("Went offline.");
      wentOnline = false;
    });
    onlineSocket.on("needsLink", async (requestID) => {
      const messages = JSON.parse(await APIClient.getMessages(app.credential.id))?.messages;
      const msg = messages?.find((m) => decodeUserCommunication(m.message)?.packet == commPackets.gameLink);
      if (msg && decodeUserCommunication(msg.message)?.args[0] == requestID) {
        if (!inGame())
          onlineSocket.emit("gotLink", requestID, false);
        else if (gameLinkData.pass)
          onlineSocket.emit("gotLink", requestID, true);
        else
          onlineSocket.emit("gotLink", requestID, [
            gameLinkData.id,
            gameLinkData.name,
            gameLinkData.pass
          ]);
      } else
        onlineSocket.emit("gotLink", requestID, null);
    });
  }
  function goOffline() {
    if (onlineSocket) {
      onlineSocket.emit("dc");
      onlineSocket.disconnect();
    }
  }
  function initOnlineOptionHook() {
    function doOnlineStatusOption() {
      app.menu.onlineOption = new Checkbox("appearOnline", "Appear Online", true);
      app.menu.onlineOption.setChecked(SETTINGS.appearOnline);
      app.menu.onlineOption.on(Checkbox.CHANGE, function(b) {
        SETTINGS.appearOnline = b;
        saveSettings();
        if (SETTINGS.appearOnline)
          goOnline();
        else
          goOffline();
      });
      app.menu.onlineOption.scale.x = app.menu.onlineOption.scale.y = 1.1;
      app.menu.container.addChild(app.menu.onlineOption);
      reindexItems();
      reposItems();
    }
    doOnlineStatusOption();
    app.onShowMenu(() => doOnlineStatusOption());
    if (SETTINGS.appearOnline)
      goOnline();
    setInterval(() => SETTINGS.appearOnline && !onlineSocket && !failedOnline && goOnline(), 1e3);
  }

  // src/partyMenu.ts
  function initPartyMenu() {
    class PartyMenu extends Feature {
      ox = 0;
      oy = 0;
      off = 0;
      marginLeft = 0;
      memberList = [];
      readyState = false;
      socket;
      code = "";
      background = new PIXI.Graphics();
      closeButton = new ImgButton();
      pmTitle = new PIXI.Text("Party Manager", {
        fontName: "Arial",
        fontSize: 19,
        lineHeight: 16,
        fill: config_default.Colors.yellow,
        strokeThickness: 3,
        lineJoin: "round"
      });
      startContainer = new PIXI.Container();
      partyCodeText = new PIXI.Text("Enter a party code:", {
        fontName: "Arial",
        fontSize: 16,
        fill: config_default.Colors.yellow,
        strokeThickness: 2,
        lineJoin: "round"
      });
      codeInput = new InputField("code_input", false, 24);
      joinPartyButton = new Button("join_party");
      loadingContainer = new PIXI.Container();
      loadingText = new PIXI.Text("", {
        fontName: "Arial",
        fontSize: 16,
        fill: config_default.Colors.yellow,
        strokeThickness: 2,
        lineJoin: "round"
      });
      preGameContainer = new PIXI.Container();
      preGameMemberList = new PIXI.Container();
      partyCodeListText = new PIXI.Text("Party Code: ", {
        fontName: "Arial",
        fontSize: 18,
        fill: config_default.Colors.yellow,
        strokeThickness: 2,
        lineJoin: "round"
      });
      readyButton = new Button("join_party");
      leaveButton = new Button("leave_party");
      constructor() {
        super();
        this.background.interactive = true;
        this.background.x = 0;
        this.background.y = 40;
        this.background.lineStyle(1, 16777215, 0.1, 0);
        this.background.beginFill(3355443, 0.9);
        this.background.drawRect(0, 0, 660, 524);
        this.background.endFill();
        this.background.beginFill(0, 0.3);
        this.background.drawRect(10, 10, 640, 504);
        this.background.endFill();
        this.background.drawRect(15, 42, 630, 2);
        this.container.addChild(this.background);
        this.ox = 10;
        this.oy = 60;
        this.closeButton.x = this.background.width - 40;
        this.closeButton.y = this.oy - 6;
        this.closeButton.scale.x = this.closeButton.scale.y = 0.8;
        this.closeButton.on(ImgButton.CLICK, () => App.Layer.memberMenu.emit(Layer.Events.MENU_ACCESS));
        this.container.addChild(this.closeButton);
        this.pmTitle.x = 0.5 * this.width - 20;
        this.pmTitle.y = this.oy - 4;
        this.pmTitle.anchor.x = 0.5;
        this.container.addChild(this.pmTitle);
        this.container.x = 0.5 * -this.width;
        this.container.addChild(this.startContainer);
        this.startContainer.addChild(this.partyCodeText);
        this.codeInput.setDimensions(190, 35);
        this.codeInput.forceLowerCase = false;
        this.codeInput.setMaxChars(16);
        this.codeInput.setFilter("abcdefghijklmnopqrstuvwxyz.");
        this.codeInput.addListener(InputField.SUBMIT, () => this.joinParty());
        this.startContainer.addChild(this.codeInput);
        this.joinPartyButton.setText("Join Party");
        this.joinPartyButton.scale.x = this.joinPartyButton.scale.y = 0.75;
        this.joinPartyButton.addListener(Button.BUTTON_RELEASED, () => this.joinParty());
        this.startContainer.addChild(this.joinPartyButton);
        this.container.addChild(this.loadingContainer);
        this.loadingContainer.visible = false;
        this.loadingContainer.addChild(this.loadingText);
        this.container.addChild(this.preGameContainer);
        this.preGameContainer.visible = false;
        this.preGameContainer.addChild(this.preGameMemberList);
        this.preGameContainer.addChild(this.partyCodeListText);
        this.readyButton.setText("Ready");
        this.readyButton.setTint(config_default.Colors.green);
        this.readyButton.scale.x = this.readyButton.scale.y = 0.75;
        this.readyButton.addListener(Button.BUTTON_RELEASED, () => this.socket.emit("isReady", !this.readyState));
        this.preGameContainer.addChild(this.readyButton);
        this.leaveButton.setText("Leave Party");
        this.leaveButton.setTint(config_default.Colors.red);
        this.leaveButton.scale.x = this.leaveButton.scale.y = 0.75;
        this.leaveButton.addListener(Button.BUTTON_RELEASED, () => this.socket.emit("leave"));
        this.preGameContainer.addChild(this.leaveButton);
        this.reposition();
      }
      reposition() {
        this.off = 0;
        this.startContainer.x = this.ox;
        this.startContainer.y = this.oy;
        this.partyCodeText.x = this.marginLeft = this.ox + 10;
        this.partyCodeText.y = this.off = this.oy;
        this.codeInput.x = this.marginLeft;
        this.codeInput.y = this.off += 24;
        this.joinPartyButton.x = this.marginLeft + this.codeInput.width + this.joinPartyButton.width / 6;
        this.joinPartyButton.y = this.off + 4;
        this.off = 0;
        this.loadingContainer.x = this.ox;
        this.loadingContainer.y = this.oy;
        this.loadingText.x = this.marginLeft = this.ox + 10;
        this.loadingText.y = this.off = this.oy;
        this.off = 0;
        this.preGameContainer.x = this.ox;
        this.preGameContainer.y = this.oy;
        this.partyCodeListText.x = this.marginLeft = this.ox + 10;
        this.partyCodeListText.y = this.off += 38;
        this.preGameMemberList.x = this.ox;
        this.preGameMemberList.y = this.off += 4;
        this.readyButton.x = this.width - this.readyButton.width - 34;
        this.readyButton.y = this.height - this.readyButton.height * 2 - 6;
        this.leaveButton.x = this.ox + 10;
        this.leaveButton.y = this.readyButton.y;
      }
      setTitle(text = "Party Manager") {
        this.pmTitle.setText(text);
      }
      startLoading(text) {
        this.hideAllWindows();
        this.loadingContainer.visible = true;
        this.loadingText.text = text;
      }
      hideAllWindows() {
        this.startContainer.visible = this.loadingContainer.visible = this.preGameContainer.visible = false;
      }
      show() {
      }
      joinParty() {
        const code = this.codeInput.getText();
        if (!code.trim())
          return this.codeInput.markInvalid(), this.codeInput.setFocus(true);
        this.startLoading("Joining party...");
        this.socket = io(config_default.api);
        this.socket.once("connect", () => {
          this.socket.emit("init", 1 /* party */, code, app.credential.username);
          this.socket.once("denyJoin", () => this.startLoading("Invalid party code."));
          this.socket.once("joinedParty", (code2) => {
            this.code = code2;
            this.hideAllWindows();
            this.preGameContainer.visible = true;
            this.partyCodeListText.text = `Party Code: ${this.code}`;
          });
          this.socket.on("updateMembers", (m) => this.updateMembers(m));
        });
        this.socket.on("joinErr", (err) => {
          this.socket.disconnect();
          this.startLoading(err);
          setTimeout(() => {
            this.hideAllWindows();
            this.startContainer.visible = true;
          }, 2500);
        });
        this.socket.on("disconnect", () => {
          this.socket.disconnect();
          this.hideAllWindows();
          this.startContainer.visible = true;
          this.memberList = [];
        });
        this.socket.on("connect_error", () => {
          this.socket.disconnect();
          this.startLoading("Error connecting to socket.");
          setTimeout(() => {
            this.hideAllWindows();
            this.startContainer.visible = true;
          }, 2500);
        });
      }
      isPartyOwner() {
        return this.memberList[0].me;
      }
      updateMembers(list) {
        this.memberList = list;
        this.preGameMemberList.removeChildren();
        this.reposition();
        this.memberList.forEach((m, i) => {
          if (m.me) {
            this.readyState = m.ready;
            this.readyButton.setText(this.readyState ? "Not Ready" : "Ready");
            this.readyButton.setTint(this.readyState ? config_default.Colors.red : config_default.Colors.green);
            this.reposition();
          }
          const text = new PIXI.Text(m.name + (m.ready ? " (Ready)" : " (Not Ready)"), {
            fontName: "Arial",
            fontSize: 16,
            fill: m.ready ? config_default.Colors.green : config_default.Colors.white,
            strokeThickness: 2,
            lineJoin: "round"
          });
          text.x = this.preGameMemberList.x;
          text.y = this.preGameMemberList.y + 14 + 18 * (i || -0.5);
          this.preGameMemberList.addChild(text);
          if (this.isPartyOwner() && i) {
            const banBtn = new Button(`ban_mem`);
            banBtn.setText("Ban");
            banBtn.setTint(config_default.Colors.red);
            banBtn.scale.x = banBtn.scale.y = 0.5;
            banBtn.x = text.x + text.width + 12;
            banBtn.y = text.y;
            banBtn.addListener(Button.BUTTON_RELEASED, () => this.socket.emit("banMem", m.name));
            this.preGameMemberList.addChild(banBtn);
          }
        });
      }
    }
    function doPartyButton() {
      App.Layer.mainMenuHides.push(App.Layer.partyMenu = new PartyMenu());
      [
        "loginMenu",
        "memberBrowserMenu",
        "clanBrowserMenu",
        "registerMenu",
        "upResetMenu",
        "profileMenu",
        "userMenu",
        "rankingMenu",
        "newsMenu",
        "partnerMenu",
        "serverListMenu",
        "clanMenu",
        "serverCreationMenu",
        "renameMenu",
        "logoutMenu",
        "guestProfileMenu"
      ].forEach((e) => App.Layer[e].hides.push(App.Layer.partyMenu));
      App.Layer.features.push(App.Layer.partyMenu);
      app.menu.partyButton = new MemberMenuButton("Party", config_default.Colors.yellow, 18, "head_alpha", false);
      app.menu.partyButton.on(MemberMenuButton.BUTTON_PRESSED, function() {
        App.Layer.mainMenuHides.forEach(function(c) {
          return App.Layer.hideFeature(c);
        });
        App.Layer.memberMenu.playButton.setActive(0);
        App.Layer.partyMenu.show();
        App.Layer.addChild(App.Layer.partyMenu);
        App.Layer.emit(Layer.Events.HIDE_MENU);
        app.onResize();
      });
      app.menu.partyButton.scale = { x: 0.8, y: 0.8 };
      app.menu.partyButton.icon.scale = { x: 0.6, y: 0.6 };
      app.menu.container.addChild(app.menu.partyButton);
      reindexItems();
    }
    doPartyButton();
    app.onShowMenu(() => doPartyButton());
    app.menu._resize = app.menu.resize;
    app.menu.resize = () => {
      app.menu._resize();
      reposItems();
    };
  }

  // src/playerDataHook.ts
  function hookPlayerData() {
    Manager.prototype._createLocalPlayer = Manager.prototype.createLocalPlayer;
    Manager.prototype.createLocalPlayer = function(...d) {
      const plr = this._createLocalPlayer(...d);
      this.localPlayer.update(null, null, null, true);
      return plr;
    };
    Player.prototype._update = Player.prototype.update;
    Player.prototype.update = function(...d) {
      const doForce = d[3] == true;
      const upd = !doForce ? this._update(...d) : null;
      if (SETTINGS.helpfulUI) {
        const isLocal = doForce || this.id == app.game.manager.getLocalPlayer()?.id, hideHUD = this.alive && (isLocal || !this.prone) && !app.game.gameover;
        const hpbar = this.hpbar || (this.hpbar = new HealthBar());
        if (!hpbar.parent) {
          this.visual.addChild(hpbar);
          hpbar.scale.x = hpbar.scale.y = 0.25;
          hpbar.x = -hpbar.width / 2;
          hpbar.y = isLocal ? -65 : -50;
          hpbar.background.visible = false;
        }
        if (hpbar.getValue() !== this.health)
          hpbar.setValue(this.health);
        hpbar.visible = hideHUD;
        if (isLocal) {
          const jetbar = this.jetbar || (this.jetbar = new JetBar());
          if (!jetbar.parent) {
            this.visual.addChild(jetbar);
            jetbar.scale.x = jetbar.scale.y = 0.25;
            jetbar.x = -jetbar.width / 2;
            jetbar.y = -50;
            jetbar.background.visible = false;
          }
          this.jetLeft = app.game.hud.jetBar.getValue();
          if (jetbar.getValue() !== this.jetLeft)
            jetbar.setValue(this.jetLeft);
          if (!app.game.hud.jetBar._setValue) {
            app.game.hud.jetBar._setValue = app.game.hud.jetBar.setValue;
            app.game.hud.jetBar.setValue = (v) => {
              jetbar.maxValue = app.game.hud.jetBar.maxValue;
              jetbar.setValue(v);
              return app.game.hud.jetBar._setValue(v);
            };
          }
          jetbar.visible = hideHUD;
          const ammobar = this.ammobar || (this.ammobar = new PIXI.Graphics());
          if (!ammobar.parent) {
            app.game.reticle.addChild(ammobar);
            ammobar.x = -18;
            ammobar.y = 26;
            ammobar.scale.x = ammobar.scale.y = 0.3;
            ammobar.rotation = -Math.PI / 2;
          }
          this.ammoLeft = app.game.hud.ammoBar.getValue();
          if (ammobar.value !== this.ammoLeft)
            ammobar.value = this.ammoLeft;
          (ammobar.update = ammobar.update || (() => {
            const delta = Date.now() - ammobar.lastUpdate, maxReload = config_default.WeaponReloadTimes[Object.entries(ItemList).find((e) => e[1] == ammobar.item)?.[0]] || 0;
            if (ammobar.reloadTime)
              ammobar.reloadTime = ammobar.reloadTime - delta || -1;
            else
              ammobar.reloadTime = maxReload;
            ammobar.lastUpdate = Date.now();
            ammobar.value = app.game.hud.ammoBar.getValue();
            ammobar.max = app.game.hud.ammoBar.maxValue;
            if (!maxReload || ammobar.value > 0)
              ammobar.reloadTime = 0;
            const w = 12, r = 30, clr = ammobar.value > 0 ? config_default.Colors.yellow : config_default.Colors.red;
            ammobar.clear();
            ammobar.lineStyle(w, clr, 0.2);
            ammobar.arc(0, 0, r, 0, Math.PI * 2);
            ammobar.lineStyle(w, clr);
            ammobar.arc(0, 0, r, 0, Math.PI * 2 * (ammobar.value > 0 ? ammobar.value / ammobar.max : ammobar.reloadTime > 0 ? ammobar.reloadTime / Math.max(0, maxReload) || ammobar.reloadTime : 1));
            ammobar.endFill();
            if (ammobar.reloadTime > 0)
              setTimeout(() => ammobar.update(), 10);
          }))();
          if (!app.game.hud.ammoBar._update) {
            app.game.hud.ammoBar._update = app.game.hud.ammoBar.update;
            app.game.hud.ammoBar.update = () => {
              app.game.hud.ammoBar._update();
              ammobar.update();
            };
          }
          if (!app.game.hud.ammoBar._setValue) {
            app.game.hud.ammoBar._setValue = app.game.hud.ammoBar.setValue;
            app.game.hud.ammoBar.setValue = (v) => {
              app.game.hud.ammoBar._setValue(v);
              ammobar.update();
            };
          }
          if (!app.game.hud.ammoBar._setItem) {
            app.game.hud.ammoBar._setItem = app.game.hud.ammoBar.setItem;
            app.game.hud.ammoBar.setItem = (i) => {
              app.game.hud.ammoBar._setItem(i);
              ammobar.item = i ? i.t : null;
            };
          }
          const beltbar = this.beltbar || (this.beltbar = new PIXI.Container());
          if (!beltbar.parent) {
            app.game.reticle.addChild(beltbar);
            beltbar.x = 10;
            beltbar.y = 26;
          }
          (beltbar.update = beltbar.update || (() => {
            beltbar.removeChildren();
            beltbar.value = app.game.hud.ammoBar.beltAmmoAmount;
            if (beltbar.value <= 0)
              beltbar.item = null;
            if (beltbar.item) {
              for (let i = beltbar.value; i--; i > 0) {
                const beltIcon = new SpriteMap[beltbar.item]();
                beltIcon.anchor.x = beltIcon.anchor.y = 0;
                beltIcon.x = i * 16;
                beltIcon.y = 0;
                beltIcon.width = beltIcon.height = 0.15;
                beltbar.addChild(beltIcon);
              }
            }
          }))();
          if (!app.game.hud.ammoBar._setBeltItem) {
            app.game.hud.ammoBar._setBeltItem = app.game.hud.ammoBar.setBeltItem;
            app.game.hud.ammoBar.setBeltItem = (i) => {
              app.game.hud.ammoBar._setBeltItem(i);
              beltbar.item = i ? i.t.substring(1) : null;
              beltbar.update();
            };
          }
          if (!app.game.hud.ammoBar._decrementBeltValue) {
            app.game.hud.ammoBar._decrementBeltValue = app.game.hud.ammoBar.decrementBeltValue;
            app.game.hud.ammoBar.decrementBeltValue = () => {
              app.game.hud.ammoBar._decrementBeltValue();
              beltbar.update();
            };
          }
          app.game.reticle.children.forEach((c) => c.visible = doForce || hideHUD);
        }
      }
      return upd;
    };
  }

  // src/preloaderHook.ts
  function hookPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader)
      return;
    const tst = setInterval(function() {
      try {
        App.RemovePreloader = function() {
          let b = 1;
          preloader.style.pointerEvents = "none";
          const c = setInterval(() => {
            0 < b - 0.05 ? (preloader.style.opacity = String(b), b -= 0.05) : (preloader.remove(), clearInterval(c));
          }, 1e3 / 60);
        };
        clearInterval(tst);
      } catch {
      }
    }, 10);
    const st = document.createElement("style");
    st.innerHTML = "#preloader{cursor:default!important;}#texresetbtn{cursor:pointer!important;}";
    document.head.appendChild(st);
    preloader.style.top = preloader.style.left = "0px";
    const reset = document.createElement("button");
    reset.id = "texresetbtn";
    Object.entries({
      backgroundColor: "#FF0000",
      border: "1px solid rgba(255,255,255,0.7)",
      position: "fixed",
      bottom: "1rem",
      right: "1rem",
      opacity: "0.5",
      borderRadius: "6px",
      padding: "2px",
      color: "white"
    }).forEach((s) => {
      reset.style[s[0]] = s[1];
    });
    reset.innerText = "Skip Loading Texture Packs";
    reset.onclick = () => {
      app.proceed();
      window.SKIP_TEX_LOAD = true;
      reset.remove();
    };
    preloader.appendChild(reset);
  }

  // src/socialMenuHook.ts
  function hookSocialMenu() {
    const menu = App.Layer.socialMenu;
    class RecordingMenu extends Feature {
      mx = 0;
      my = 0;
      down = false;
      dragging = false;
      title;
      background;
      closeButton;
      startButton;
      dlWEBM;
      dlMP4;
      donedl;
      previd;
      recordingSince = 0;
      preContainer;
      postContainer;
      constructor() {
        super();
        this.background = new PIXI.Graphics();
        this.background.lineStyle(1, 16777215, 0.1, 0);
        this.background.beginFill(3355443, 0.9);
        this.background.drawRoundedRect(0, 0, 400, 320, 4);
        this.background.interactive = true;
        this.container.addChild(this.background);
        this.background.on("mousedown", (a) => {
          a.stopPropagation();
          this.down = true;
          this.ox = a.data.global.x;
          this.oy = a.data.global.y;
        });
        this.background.on("mouseup", (a) => {
          a.stopPropagation();
          this.down = this.dragging = false;
        });
        this.background.on("mousemove", (a) => {
          if (this.down) {
            let b = a.data.global.x;
            a = a.data.global.y;
            let c = b - this.ox, d = a - this.oy;
            this.x += c;
            this.y += d;
            this.ox = b;
            this.oy = a;
            0 < Math.sqrt(c * c + d * d) && (this.dragging = true);
          }
        });
        this.title = new PIXI.BitmapText("Screen Recorder", {
          fontName: "Open Sans",
          fontSize: 28
        });
        this.title.x = this.mx = 8;
        this.title.y = this.my = 6;
        this.title.tint = config_default.Colors.red;
        this.container.addChild(this.title);
        setInterval(() => this.updateTitle(), 900);
        this.closeButton = new PIXI.Sprite(App.CombinedTextures.exit);
        this.closeButton.scale.x = this.closeButton.scale.y = 0.8;
        this.closeButton.alpha = 0.5;
        this.closeButton.interactive = true;
        this.closeButton.x = this.width - 28;
        this.closeButton.y = 2;
        this.closeButton.on("mousedown", (a) => {
          this.closeButton.alpha = 0.5;
          this.parent.removeChild(this);
          AudioEffects.ButtonClick.audio.play();
        });
        this.closeButton.on("mouseover", (a) => {
          this.closeButton.alpha = 1;
          AudioEffects.ButtonHover.audio.play();
        });
        this.closeButton.on("mouseout", (a) => {
          this.closeButton.alpha = 0.5;
        });
        this.container.addChild(this.closeButton);
        this.container.addChild(this.preContainer = new PIXI.Container());
        this.container.addChild(this.postContainer = new PIXI.Container());
        this.postContainer.visible = false;
        this.startButton = new Button("start_rec");
        this.setupStartButton();
        this.startButton.scale.x = this.startButton.scale.y = 0.75;
        this.startButton.x = this.mx + 10;
        this.startButton.y = this.my += this.title.height + 10;
        this.startButton.addListener(Button.BUTTON_RELEASED, () => {
          if (this.recordingSince && this.recorder)
            this.recorder.stop();
          else
            this.onRecStart();
        });
        this.preContainer.addChild(this.startButton);
        this.mx = 18;
        this.my = this.title.height + 16;
        this.donedl = new Button("dl_done");
        this.donedl.setText("Done");
        this.donedl.setTint(config_default.Colors.yellow);
        this.donedl.scale.x = this.donedl.scale.y = 0.7;
        this.donedl.x = this.mx;
        this.donedl.y = this.my;
        this.donedl.addListener(Button.BUTTON_RELEASED, () => {
          this.preContainer.visible = true;
          this.postContainer.visible = false;
          this.stream = this.recorder = this.recordedChunks = null;
        });
        this.postContainer.addChild(this.donedl);
        this.previd = new Button("dl_prev");
        this.previd.setText("Preview");
        this.previd.setTint(config_default.Colors.green);
        this.previd.scale.x = this.previd.scale.y = 0.7;
        this.previd.x = this.donedl.x + this.donedl.width + 6;
        this.previd.y = this.my;
        this.previd.addListener(Button.BUTTON_RELEASED, () => window.open(URL.createObjectURL(new Blob(this.recordedChunks, { type: "video/webm" })), "_blank"));
        this.postContainer.addChild(this.previd);
        this.dlWEBM = new Button("dl_webm");
        this.dlWEBM.setText("Download WEBM");
        this.dlWEBM.scale.x = this.dlWEBM.scale.y = 0.7;
        this.dlWEBM.x = this.mx;
        this.dlWEBM.y = this.my += this.donedl.height + 8;
        this.dlWEBM.addListener(Button.BUTTON_RELEASED, () => {
          this.dlBlob(new Blob(this.recordedChunks, { type: "video/webm" }));
        });
        this.postContainer.addChild(this.dlWEBM);
        this.dlMP4 = new Button("dl_mp4");
        this.dlMP4.setText("Convert to MP4 (slow)");
        this.dlMP4.scale.x = this.dlMP4.scale.y = 0.7;
        this.dlMP4.x = this.dlWEBM.x + this.dlWEBM.width + 6;
        this.dlMP4.y = this.dlWEBM.y;
        this.dlMP4.addListener(Button.BUTTON_RELEASED, async () => {
          try {
            this.dlMP4.setText("Starting...");
            const worker = new Worker(URL.createObjectURL(new Blob([await fetch(`${config_default.api}/ffmpeg.js`).then((r) => r.text())], {
              type: "application/javascript"
            })));
            worker.onmessage = async (e) => {
              try {
                const msg = e.data;
                switch (msg.type) {
                  case "ready":
                    this.dlMP4.setText("Converting...");
                    console.log(`[ConversionWorker] Worker ready!`);
                    worker.postMessage({
                      bypass: true,
                      type: "run",
                      arguments: [
                        "-i",
                        "video.webm",
                        "-vf",
                        "crop=trunc(iw/2)*2:trunc(ih/2)*2",
                        "-preset",
                        "ultrafast",
                        "vid.mp4"
                      ],
                      MEMFS: [
                        {
                          name: "video.webm",
                          data: await new Blob(this.recordedChunks, {
                            type: "video/webm"
                          }).arrayBuffer()
                        }
                      ]
                    });
                    break;
                  case "stdout":
                  case "stderr":
                    console.log(`[ConversionWorker.${msg.type}] ${msg.data}`);
                    if (msg.data == "Conversion failed!") {
                      this.dlMP4.setText("Error!");
                    }
                    break;
                  case "done":
                    this.dlMP4.setText("Convert to MP4 (slow)");
                    if (typeof msg.data !== "string" && msg.data.MEMFS) {
                      this.dlBlob(new Blob([msg.data.MEMFS[0].data], { type: "video/mp4" }));
                    }
                    break;
                }
              } catch (err) {
                alert(`Error with conversion: ${err}, ${err.stack}`);
              }
            };
          } catch (err) {
            alert(`Error creating conversion worker: ${err}, ${err.stack}`);
          }
        });
        this.postContainer.addChild(this.dlMP4);
      }
      updateTitle() {
        const timeRec = Math.floor((Date.now() - this.recordingSince) / 1e3);
        this.title.text = this.recordingSince ? `Recording... (${Math.floor(timeRec / 60).toString().padStart(2, "0")}:${Math.floor(timeRec % 60).toString().padStart(2, "0")})` : `Screen Recorder`;
      }
      setupStartButton() {
        this.startButton.setText("Start Recording");
        this.startButton.setTint(config_default.Colors.green);
      }
      stream;
      recorder;
      recordedChunks;
      onRecStart() {
        this.recordingSince = Date.now();
        this.updateTitle();
        this.startButton.setText("Stop Recording");
        this.startButton.setTint(config_default.Colors.red);
        try {
          this.stream = new MediaStream();
          const howlStream = Howler.ctx.createMediaStreamDestination();
          Howler.masterGain.connect(howlStream);
          const vid = App.Renderer.view.captureStream();
          this.stream.addTrack(howlStream.stream.getTracks()[0]);
          this.stream.addTrack(vid.getTracks()[0]);
          this.recordedChunks = [];
          this.recorder = new MediaRecorder(this.stream, { bitsPerSecond: 4e7 });
          this.recorder.ondataavailable = (e) => this.recordedChunks.push(e.data);
          this.recorder.onstop = () => this.onRecStop();
          this.recorder.start();
        } catch (err) {
          alert(`Error starting recording: ${err}, ${err.stack}`);
        }
      }
      onRecStop() {
        this.recordingSince = 0;
        this.updateTitle();
        this.setupStartButton();
        this.preContainer.visible = false;
        this.postContainer.visible = true;
        this.dlMP4.setText("Convert to MP4 (slow)");
      }
      dlBlob(blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `NinjaRecording-${new Date().toISOString().split(".")[0].replace("T", "-").replace(/:/g, ".")}.${blob.type.split("/").pop()}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }
    class SocialMenuDropdown extends PIXI.Container {
      background;
      constructor() {
        super();
        this.background = new PIXI.Graphics();
        this.background.clear();
        this.background.lineStyle(1, 16777215, 0.4, 0.3);
        this.background.beginFill(5592405, 0.9);
        this.background.drawRoundedRect(0, 0, 110, 64, 4);
        this.background.endFill();
        this.addChild(this.background);
        const clanChatBtn = new SocialMenuDropdownActionRow("Clan Chat", () => menu.onClanChatButtonReleased.bind(menu)(), config_default.Colors.white);
        const recordBtn = new SocialMenuDropdownActionRow("Record", () => {
          menu.addChild(menu.recMenu);
          menu.recMenu.x = -Math.abs(menu.width - menu.recMenu.width) / 2;
          menu.recMenu.y = -Math.abs(menu.height - menu.recMenu.height) / 2;
        }, config_default.Colors.red);
        clanChatBtn.x = 10;
        clanChatBtn.y = 4;
        recordBtn.x = 10;
        recordBtn.y = 34;
        this.addChild(clanChatBtn);
        this.addChild(recordBtn);
      }
    }
    class SocialMenuDropdownActionRow extends PIXI.Container {
      actionText;
      constructor(text, onclick, color) {
        super();
        this.text = text;
        this.actionText = new PIXI.BitmapText(this.text, { fontName: "Open Sans", fontSize: 24 });
        this.hitArea = new PIXI.Rectangle(0, 0, 100, 30);
        this.actionText.tint = color;
        this.actionText.alpha = 0.7;
        this.interactive = true;
        this.on("mouseover", () => this.actionText.alpha = 1);
        this.on("mouseout", () => this.actionText.alpha = 0.7);
        this.on("mousedown", (e) => {
          e.stopPropagation();
          onclick();
        });
        this.addChild(this.actionText);
      }
    }
    menu.clanChatButton.destroy();
    const dropdownMenu = new SocialMenuDropdown();
    menu.recMenu = new RecordingMenu();
    menu.dropdownButton = new Button("drop");
    menu.dropdownButton.setText("V");
    menu.dropdownButton.scale.x = menu.dropdownButton.scale.y = 0.7;
    menu.dropdownButton.addListener(Button.BUTTON_RELEASED, () => {
      if (dropdownMenu.parent)
        return menu.container.removeChild(dropdownMenu);
      menu.container.addChild(dropdownMenu);
      dropdownMenu.x = menu.dropdownButton.x - dropdownMenu.width + menu.dropdownButton.width;
      dropdownMenu.y = menu.dropdownButton.y + menu.dropdownButton.parent.y + menu.dropdownButton.height;
    });
    menu.dropdownButton.x = menu.clanButton.x + menu.clanButton.width + 6;
    menu.dropdownButton.y = 8;
    menu.container.addChild(menu.dropdownButton);
  }

  // src/texturePack.ts
  var import_localforage2 = __toESM(require_localforage());
  function hookTextureLoader() {
    class WorkerNew extends Worker {
      _postMessage;
      constructor(url, opts) {
        super(url, opts);
        this._postMessage = this.postMessage;
        this.postMessage = this.newPostMessage;
      }
      newPostMessage(data, ...args) {
        if (SETTINGS.texturePack && !window.SKIP_TEX_LOAD && !data?.bypass) {
          fetch(`${config_default.api}/packs/${SETTINGS.texturePack}`).then((r) => r.json()).then(async (pack) => {
            if (pack && data.id == "loadImageBitmap" && typeof data.data[0] == "string" && SETTINGS.texturePack) {
              const orig = data.data[0];
              const isCustom = SETTINGS.texturePack == config_default.customDelimiter;
              if ((pack.hasCombined || isCustom) && orig.includes("ninja.io") && orig.includes("combined") && orig.endsWith(".png"))
                data.data[0] = `${config_default.api}/packs/${SETTINGS.texturePack}/combined.png?v=${config_default.actualGameVersion}`;
              if ((pack.hasSeamless || isCustom) && orig.includes("ninja.io") && orig.includes("seamless") && orig.endsWith(".png"))
                data.data[0] = `${config_default.api}/packs/${SETTINGS.texturePack}/seamless.png?v=${config_default.actualGameVersion}`;
              if (data.data[0].startsWith(config_default.api) && isCustom) {
                const zip = await import_localforage2.default.getItem("custom_pack");
                if (zip) {
                  const form = new FormData();
                  form.append("zip", zip);
                  const res = await fetch(data.data[0], {
                    method: "POST",
                    body: form
                  }).then((r) => r.blob());
                  data.data[0] = URL.createObjectURL(res);
                } else
                  data.data[0] = orig;
              }
            }
            this._postMessage(data, ...args);
          }).catch(() => {
            this._postMessage(data, ...args);
          });
        } else
          this._postMessage(data, ...args);
      }
    }
    window.Worker = Worker = WorkerNew;
  }

  // src/updateChecker.ts
  async function checkUpdate() {
    try {
      const newest = await fetch(`${config_default.api}/ver`).then((r) => r.text());
      const num = (str) => Number(str.replace(/\./, ""));
      if (num(newest) > num(config_default.ver)) {
        App.Console.log(`Hey! A new version of NinjaIOUtils is available. (${newest})`, config_default.Colors.red);
      }
    } catch {
    }
  }

  // src/index.ts
  hookTextureLoader();
  if (!navigator.clipboard.readText) {
    navigator.clipboard.readText = function() {
      return new Promise((res) => res(prompt("Paste text now.") || ""));
    };
  }
  hookPreloader();
  window.NIOUCheckReload = () => {
    if (!app.game)
      return "Enter a game...";
    let reloadTime = 0, times = [];
    if (!app.game.hud.ammoBar.__setValue)
      app.game.hud.ammoBar.__setValue = app.game.hud.ammoBar.setValue;
    app.game.hud.ammoBar.setValue = (v) => {
      if (v <= 0 && !reloadTime)
        reloadTime = Date.now();
      if (reloadTime && v > 0) {
        const t = Date.now() - reloadTime;
        times.push(t);
        const avg = (num) => {
          const total = times.slice(-num);
          return Math.round(total.reduce((t2, c) => t2 + c, 0) / total.length);
        };
        console.log(`Time to reload: ${t}ms
Last 5 avg: ${avg(5)}ms
Last 10 avg: ${avg(10)}ms
Last 15 avg: ${avg(15)}ms`);
        reloadTime = 0;
      }
      app.game.hud.ammoBar.__setValue(v);
    };
    return "Shoot gun till reload. Reload the page to disable this logging.";
  };
  var socialMenuDone = false;
  var testing = setInterval(() => {
    if (!socialMenuDone) {
      try {
        if (SocialMenu && FriendItem) {
          socialMenuHook();
          initFriendOnlineHook();
          socialMenuDone = true;
        } else
          return;
      } catch {
        return;
      }
    }
    try {
      if (!app || !app.menu || !app.menu.joinButton || typeof app.status.updating !== "boolean" || !APIClient || !APIClient.postCreateGame)
        return;
    } catch {
      return;
    }
    clearInterval(testing);
    App.Console.log("Loading NinjaIOUtils...");
    if (app.credential.accounttype == "guest")
      alert(`NinjaIOUtils works best when you are logged in!
No support will be provided to logged out users experiencing issues, sorry.`);
    app._showMenu = app.showMenu;
    const menuListeners = [];
    app.onShowMenu = (cb) => {
      menuListeners.push(cb);
    };
    app.showMenu = function() {
      app._showMenu();
      menuListeners.forEach((l) => l());
      reposItems();
    };
    showFPS();
    matchStartHook();
    matchEndHook();
    applySettingsHook();
    initShareURLHook();
    App.Stats.realSetPing = App.Stats.setPing;
    App.Stats.setPing = function(ping) {
      App.Stats.ping = ping;
      return App.Stats.realSetPing(ping);
    };
    App.Console.consoleInput.addListener(InputField.CHANGE, () => {
      if (SETTINGS.typewriter)
        AudioEffects.ButtonHover.audio.play();
    });
    initOnlineOptionHook();
    initPartyMenu();
    App.Console.log("Successfully injected party menu button.");
    settingsTab();
    App.Console.log("Successfully injected settings tab.");
    hookFullscreen();
    reposItems();
    initMapIdentifier();
    hookSocialMenu();
    window.addEventListener("resize", () => reposItems());
    window.addEventListener("focus", () => setTimeout(() => reposItems(), 50));
    setInterval(() => reposItems(), 100);
    document.addEventListener("keydown", handleKeyDown);
    updateFriendList();
    hookJoinGameButton();
    setTimeout(() => updateFriendList(), 2e3);
    setInterval(() => updateFriendList(), 6e4);
    checkUpdate();
    hookUtilsMenu();
    hookPlayerData();
    app.onResize = window.eval(`(function ${app.onResize.toString().replace(`App.Scale=b`, `b=App.NUIScale||b,App.Scale=b`)})`);
    App.NUIScale = SETTINGS.uiScale;
    app.onResize();
    App.Console.log(`NinjaIOUtils ${config_default.ver} Loaded Successfully!`);
    tryJoinLink();
  }, 50);
})();
/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
