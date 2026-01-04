function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SC_Statistic = /*#__PURE__*/function () {
  function SC_Statistic() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, SC_Statistic);
    _defineProperty(this, "baseURL", "");
    _defineProperty(this, "intervalHanlde", undefined);
    _defineProperty(this, "visitHash", undefined);
    _defineProperty(this, "session_id", undefined);
    _defineProperty(this, "key", undefined);
    _defineProperty(this, "visit_time", undefined);
    _defineProperty(this, "install_page", "");
    _defineProperty(this, "operation_page", "");
    _defineProperty(this, "version", undefined);
    _defineProperty(this, "iframe", false);
    _defineProperty(this, "postData", undefined);
    _defineProperty(this, "enableGM", true);
    _defineProperty(this, "enableXML", true);
    _defineProperty(this, "whitelist", []);
    var _option$intervalTime = option.intervalTime,
      intervalTime = _option$intervalTime === void 0 ? 1000 * 60 * 2 : _option$intervalTime,
      _option$customHash = option.customHash,
      customHash = _option$customHash === void 0 ? undefined : _option$customHash,
      _option$key = option.key,
      key = _option$key === void 0 ? undefined : _option$key,
      _option$banFrame = option.banFrame,
      banFrame = _option$banFrame === void 0 ? false : _option$banFrame,
      _option$enableGM = option.enableGM,
      enableGM = _option$enableGM === void 0 ? true : _option$enableGM,
      _option$enableXML = option.enableXML,
      enableXML = _option$enableXML === void 0 ? true : _option$enableXML,
      _option$baseURL = option.baseURL,
      baseURL = _option$baseURL === void 0 ? "https://scriptcat.org/api/v2/statistics/collect" : _option$baseURL,
      _option$whitelist = option.whitelist,
      whitelist = _option$whitelist === void 0 ? [] : _option$whitelist;
    this.whitelist = Array.isArray(whitelist) ? whitelist : [whitelist];
    this.baseURL = baseURL;
    this.enableGM = enableGM;
    this.enableXML = enableXML;
    this.session_id = this.generateUUID();
    this.key = key;
    this.customHash = customHash;
    this.visit_time = this.getUnixTime();
    this.install_page = GM_info.scriptUpdateURL || "";
    this.operation_page = window.location.href;
    this.iframe = self != top;
    this.version = GM_info.script.version || "0.0.0";
    if (banFrame && this.iframe) {
      return;
    }
    this.init({
      intervalTime: intervalTime
    });
  }
  _createClass(SC_Statistic, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref) {
        var _this = this;
        var intervalTime;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              intervalTime = _ref.intervalTime;
              if (this.key === undefined) {
                console.log("SC_Statistic: the key params is required");
              }
              _context.next = 4;
              return this.getNetworkWhite();
            case 4:
              this.developHelper();
              if (this.validWhiteList()) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return");
            case 7:
              this.submitMessage();
              if (intervalTime !== undefined) {
                this.intervalHanlde = setInterval(this.submitMessage.bind(this), intervalTime);
              }
              if (navigator.sendBeacon) {
                window.addEventListener("beforeunload", function () {
                  if (_this.postData) {
                    var fd = new FormData();
                    var mergeObj = {
                      duration: _this.getUnixTime() - _this.visit_time
                    };
                    var contentObj = _this.postData;
                    for (var key in contentObj) {
                      if (mergeObj[key]) {
                        fd.append(key, mergeObj[key]);
                      } else {
                        fd.append(key, contentObj[key]);
                      }
                    }
                    fd.append("exit_time", _this.getUnixTime());
                    navigator.sendBeacon(_this.baseURL, fd);
                  }
                }, false);
              }
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init(_x) {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "getNetworkWhite",
    value: function () {
      var _getNetworkWhite = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var netWorkKey, netWorkValue, isRun, currentDate, lastDate, timeDiff, result, response;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(typeof GM_getValue !== "undefined" && typeof GM_setValue !== "undefined" && this.whitelist.length === 0)) {
                _context2.next = 10;
                break;
              }
              netWorkKey = "__NetworkWhiteData";
              netWorkValue = GM_getValue(netWorkKey);
              isRun = false;
              if (netWorkValue === undefined) {
                isRun = true;
              } else {
                try {
                  netWorkValue = JSON.parse(netWorkValue);
                  currentDate = new Date();
                  lastDate = new Date(netWorkValue.time);
                  timeDiff = currentDate - lastDate;
                  if (timeDiff > 3600000) {
                    isRun = true;
                  } else {
                    this.whitelist = netWorkValue.whitelist;
                  }
                } catch (error) {
                  isRun = true;
                }
              }
              if (!isRun) {
                _context2.next = 10;
                break;
              }
              _context2.next = 8;
              return this.UNION_Post({
                url: this.baseURL + "/whitelist",
                data: {
                  statistics_key: this.key
                }
              });
            case 8:
              result = _context2.sent;
              if (result.status) {
                response = result.data;
                if (response && response.msg === "success" && response.code === 0) {
                  this.whitelist = response.data.whitelist;
                  GM_setValue(netWorkKey, JSON.stringify({
                    time: Date.now(),
                    whitelist: this.whitelist
                  }));
                }
              }
            case 10:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getNetworkWhite() {
        return _getNetworkWhite.apply(this, arguments);
      }
      return getNetworkWhite;
    }()
  }, {
    key: "developHelper",
    value: function developHelper() {
      if (!this.enableXML && !this.enableGM) {
        console.warn("Log is no network handle,please enable any method or enable GM_xmlhttpRequest.");
      }
      if (this.whitelist.length === 0) {
        console.log("SC_Statistic: whitelist is no data,please input statistic website list");
      }
    }
  }, {
    key: "validWhiteList",
    value: function validWhiteList() {
      var host = window.location.host;
      var whitelist = this.whitelist;
      for (var index = 0; index < whitelist.length; index++) {
        var whiteItem = whitelist[index];
        if (whiteItem.split(".").length < 2) {
          console.log("SC_Statistic: whitelist item must have [.] char");
          continue;
        }
        if (host.includes(whiteItem)) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "closeintervalTime",
    value: function closeintervalTime() {
      clearInterval(this.intervalHanlde);
    }
  }, {
    key: "GM_Post",
    value: function GM_Post(_ref2) {
      var _this2 = this;
      var url = _ref2.url,
        data = _ref2.data;
      return new Promise(function (resolve) {
        var parseResponse = _this2.parseResponse;
        if (typeof GM_xmlhttpRequest !== "undefined") {
          GM_xmlhttpRequest({
            url: url,
            method: "POST",
            data: JSON.stringify(data),
            headers: {
              "Content-type": "application/json"
            },
            onload: function onload(xhr) {
              resolve({
                status: true,
                data: parseResponse(xhr.responseText)
              });
            },
            onerror: function onerror(xhr) {
              resolve({
                status: false
              });
            },
            ontimeout: function ontimeout(xhr) {
              resolve({
                status: false
              });
            }
          });
        } else {
          resolve({
            status: false
          });
        }
      });
    }
  }, {
    key: "XML_Post",
    value: function XML_Post(_ref3) {
      var _this3 = this;
      var url = _ref3.url,
        data = _ref3.data;
      return new Promise(function (resolve) {
        var parseResponse = _this3.parseResponse;
        try {
          var xmlhttp = new XMLHttpRequest();
          xmlhttp.open("POST", url, true);
          xmlhttp.setRequestHeader("Content-type", "application/json");
          xmlhttp.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
              if (this.status !== 200) {
                resolve({
                  status: false
                });
              } else {
                resolve({
                  status: true,
                  data: parseResponse(this.response)
                });
              }
            }
          };
          xmlhttp.send(JSON.stringify(data));
        } catch (error) {
          resolve({
            status: false
          });
        }
      });
    }
  }, {
    key: "parseResponse",
    value: function parseResponse(text) {
      try {
        return JSON.parse(text);
      } catch (error) {
        return text;
      }
    }
  }, {
    key: "UNION_Post",
    value: function () {
      var _UNION_Post = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(config) {
        var result, _result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!this.enableXML) {
                _context3.next = 6;
                break;
              }
              _context3.next = 3;
              return this.XML_Post(config);
            case 3:
              result = _context3.sent;
              if (!result.status) {
                _context3.next = 6;
                break;
              }
              return _context3.abrupt("return", result);
            case 6:
              if (!this.enableGM) {
                _context3.next = 12;
                break;
              }
              _context3.next = 9;
              return this.GM_Post(config);
            case 9:
              _result = _context3.sent;
              if (!_result.status) {
                _context3.next = 12;
                break;
              }
              return _context3.abrupt("return", _result);
            case 12:
              return _context3.abrupt("return", {
                status: false
              });
            case 13:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function UNION_Post(_x2) {
        return _UNION_Post.apply(this, arguments);
      }
      return UNION_Post;
    }()
  }, {
    key: "flushContent",
    value: function () {
      var _flushContent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var visitEntity, duration, hashContent;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.getVisitHash();
            case 2:
              visitEntity = _context4.sent;
              duration = this.getUnixTime() - this.visit_time;
              hashContent = {
                visitor_id: visitEntity.hash,
                visitor_type: visitEntity.type,
                operation_page: this.operation_page,
                duration: duration,
                install_page: this.install_page,
                statistics_key: this.key,
                session_id: this.session_id,
                visit_time: this.visit_time,
                version: this.version
              };
              return _context4.abrupt("return", hashContent);
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function flushContent() {
        return _flushContent.apply(this, arguments);
      }
      return flushContent;
    }()
  }, {
    key: "submitMessage",
    value: function () {
      var _submitMessage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return this.flushContent();
            case 3:
              this.postData = _context5.sent;
              this.UNION_Post({
                url: this.baseURL + "",
                data: this.postData
              });
              _context5.next = 9;
              break;
            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5["catch"](0);
            case 9:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[0, 7]]);
      }));
      function submitMessage() {
        return _submitMessage.apply(this, arguments);
      }
      return submitMessage;
    }()
  }, {
    key: "getVisitHash",
    value: function () {
      var _getVisitHash = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        var saveVisit, customHasg, hash;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!(this.visitHash !== undefined)) {
                _context6.next = 2;
                break;
              }
              return _context6.abrupt("return", this.visitHash);
            case 2:
              saveVisit = {
                hash: "",
                type: 2
              };
              customHasg = this.customHash && this.customHash();
              if (customHasg !== undefined) {
                saveVisit = {
                  hash: customHasg,
                  type: 3
                };
              } else if (typeof GM_getValue !== "undefined" && typeof GM_setValue !== "undefined") {
                saveVisit = {
                  hash: this.getGmHash(),
                  type: 1
                };
              } else {
                hash = localStorage["__VisitUUID"];
                if (hash === undefined) {
                  hash = this.generateUUID();
                  localStorage["__VisitUUID"] = hash;
                }
                saveVisit.hash = hash;
              }
              return _context6.abrupt("return", this.visitHash = saveVisit);
            case 6:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function getVisitHash() {
        return _getVisitHash.apply(this, arguments);
      }
      return getVisitHash;
    }()
  }, {
    key: "getGmHash",
    value: function getGmHash() {
      var hashResult = GM_getValue("__VisitUUID");
      if (hashResult === undefined) {
        hashResult = this.generateUUID();
        GM_setValue("__VisitUUID", hashResult);
      }
      return hashResult;
    }
  }, {
    key: "getUnixTime",
    value: function getUnixTime() {
      return Math.floor(Date.parse(new Date()) / 1000);
    }
  }, {
    key: "generateUUID",
    value: function generateUUID() {
      var d = Date.now();
      if (typeof performance !== "undefined" && typeof performance.now === "function") {
        d += performance.now();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
      });
    }
  }]);
  return SC_Statistic;
}();