// ==UserScript==
// @name 编程猫源码云功能
// @namespace https://s-lightning.github.io/
// @author SLIGHTNING
// @version 1.1.0 alpha
// @description 用于编程猫源码云功能（云变量、云列表等）的客户端库，包含查看和修改编程猫已发布的源码作品的云变量和云列表的功能
// @icon https://cdn-community.codemao.cn/community_frontend/asset/icon_kitten4_bd2e0.png
// @license AGPL-3.0
// @require https://cdn.jsdelivr.net/npm/diff@5.2.0/dist/diff.js
// ==/UserScript==

/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _asyncToGenerator; }
/* harmony export */ });
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}


/***/ }),
/* 2 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classCallCheck; }
/* harmony export */ });
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}


/***/ }),
/* 3 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _createClass; }
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}


/***/ }),
/* 4 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toPropertyKey; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : i + "";
}


/***/ }),
/* 5 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}


/***/ }),
/* 6 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toPrimitive; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}


/***/ }),
/* 7 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _possibleConstructorReturn; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);


function _possibleConstructorReturn(t, e) {
  if (e && ("object" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t);
}


/***/ }),
/* 8 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}


/***/ }),
/* 9 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _getPrototypeOf; }
/* harmony export */ });
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}


/***/ }),
/* 10 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _inherits; }
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, e);
}


/***/ }),
/* 11 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ }),
/* 12 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(13)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),
/* 13 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(14)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/***/ (function(module) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudFunction: function() { return /* binding */ KittenCloudFunction; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(26);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(27);
/* harmony import */ var _module_kitten_cloud_online_user_number__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(81);
/* harmony import */ var _module_network_web_socket_kitten_cloud_web_socket__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(83);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(82);
/* harmony import */ var _module_kitten_cloud_function_config_layer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(86);
/* harmony import */ var _module_cloud_data_group_kitten_cloud_public_variable_group__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(88);
/* harmony import */ var _module_cloud_data_kitten_cloud_data_type__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(104);
/* harmony import */ var _module_network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(89);
/* harmony import */ var _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(105);
/* harmony import */ var _module_cloud_data_group_kitten_cloud_private_variable_group__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(106);
/* harmony import */ var _utils_single_config__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(87);
/* harmony import */ var _codemao_user_codemao_user__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(109);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(29);
/* harmony import */ var _module_cloud_data_group_kitten_cloud_list_group__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(112);










function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }















/**
 * 源码云功能主类，用于管理源码云的连接、数据、事件等。
 */
var KittenCloudFunction = /*#__PURE__*/function (_KittenCloudFunctionC) {
  function KittenCloudFunction(argument) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4__["default"])(this, KittenCloudFunction);
    _this = _callSuper(this, KittenCloudFunction);
    _this.autoReconnectIntervalTime = new _utils_single_config__WEBPACK_IMPORTED_MODULE_21__.SingleConfig(8000, 8000);
    var work = argument instanceof _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_11__.CodemaoWork ? argument : null;
    if (!(argument instanceof _module_network_web_socket_kitten_cloud_web_socket__WEBPACK_IMPORTED_MODULE_13__.KittenCloudWeb_Socket)) {
      argument = new _module_network_web_socket_kitten_cloud_web_socket__WEBPACK_IMPORTED_MODULE_13__.KittenCloudWeb_Socket(argument);
    }
    _this.socket = argument;
    _this.work = _this.socket.work;
    _this.autoReconnectIntervalTime.changed.connect(function (_ref) {
      var newValue = _ref.newValue;
      if (typeof newValue == "boolean") {
        _this.socket.autoReconnect = newValue;
        return;
      }
      _this.socket.autoReconnect = true;
      _this.socket.autoReconnectIntervalTime = newValue;
    });
    _this.socket.opened.connect( /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(work != null)) {
              _context.next = 7;
              break;
            }
            _context.t0 = _this;
            _context.t1 = _module_network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_18__.KittenCloudSendMessageType.JOIN;
            _context.next = 5;
            return work.info.id;
          case 5:
            _context.t2 = _context.sent.toString();
            _context.t0.send.call(_context.t0, _context.t1, _context.t2);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
    _this.socket.received.connect(function (message) {
      _this.handleReceived(message);
    });
    _this.opened = new _utils_signal__WEBPACK_IMPORTED_MODULE_14__.Signal();
    _this.disconnected = new _utils_signal__WEBPACK_IMPORTED_MODULE_14__.Signal();
    _this.closed = new _utils_signal__WEBPACK_IMPORTED_MODULE_14__.Signal();
    _this.errored = new _utils_signal__WEBPACK_IMPORTED_MODULE_14__.Signal();
    _this.socket.disconnected.connect(function () {
      _this.disconnected.emit();
    });
    _this.socket.closed.connect(function () {
      _this.closed.emit();
    });
    _this.socket.errored.connect(function (error) {
      _this.errored.emit(error);
    });
    _this.onlineUserNumber = new Promise(function (resolve, reject) {
      _this.onlineUserNumberResolve = resolve;
      _this.onlineUserNumberReject = reject;
    });
    _this.socket.errored.connect(function (error) {
      var _this$onlineUserNumbe, _this2;
      (_this$onlineUserNumbe = (_this2 = _this).onlineUserNumberReject) === null || _this$onlineUserNumbe === void 0 || _this$onlineUserNumbe.call(_this2, error);
    });
    _this.privateVariable = new _module_cloud_data_group_kitten_cloud_private_variable_group__WEBPACK_IMPORTED_MODULE_20__.KittenCloudPrivateVariableGroup(_this);
    _this.publicVariable = new _module_cloud_data_group_kitten_cloud_public_variable_group__WEBPACK_IMPORTED_MODULE_16__.KittenCloudPublicVariableGroup(_this);
    _this.list = new _module_cloud_data_group_kitten_cloud_list_group__WEBPACK_IMPORTED_MODULE_24__.KittenCloudListGroup(_this);
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_8__["default"])(KittenCloudFunction, _KittenCloudFunctionC);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudFunction, [{
    key: "close",
    value: function close() {
      this.socket.close();
    }
  }, {
    key: "send",
    value: function send(type, message) {
      this.socket.send([type, message]);
    }
  }, {
    key: "handleReceived",
    value: function handleReceived(message) {
      var _this3 = this;
      (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().mark(function _callee2() {
        var _message, type, data, dataArray, privateVariableArray, publicVariableArray, listArray, _iterator, _step, item, cvid, name, value, _type;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _message = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(message, 2), type = _message[0], data = _message[1];
              _context2.t0 = type;
              _context2.next = _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.JOIN ? 4 : _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.RECEIVE_ALL_DATA ? 6 : _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.UPDATE_PRIVATE_VARIABLE ? 52 : _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.RECEIVE_PRIVATE_VARIABLE_RANKING_LIST ? 54 : _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.UPDATE_PUBLIC_VARIABLE ? 56 : _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.UPDATE_LIST ? 58 : _context2.t0 === _module_network_kitten_cloud_receive_message_type__WEBPACK_IMPORTED_MODULE_19__.KittenCloudReceiveMessageType.UPDATE_ONLINE_USER_NUMBER ? 60 : 73;
              break;
            case 4:
              _this3.send(_module_network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_18__.KittenCloudSendMessageType.GET_ALL_DATA, {});
              return _context2.abrupt("break", 74);
            case 6:
              if (!(data == null)) {
                _context2.next = 8;
                break;
              }
              throw new Error("获取全部数据数据为空");
            case 8:
              if (!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(data) != "object" || !Array.isArray(data))) {
                _context2.next = 10;
                break;
              }
              throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u83B7\u53D6\u5168\u90E8\u6570\u636E\u6570\u636E\uFF1A".concat(data));
            case 10:
              dataArray = data;
              privateVariableArray = [], publicVariableArray = [], listArray = [];
              _iterator = _createForOfIteratorHelper(dataArray);
              _context2.prev = 13;
              _iterator.s();
            case 15:
              if ((_step = _iterator.n()).done) {
                _context2.next = 39;
                break;
              }
              item = _step.value;
              if (!(item == null)) {
                _context2.next = 19;
                break;
              }
              return _context2.abrupt("continue", 37);
            case 19:
              if (!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(item) != "object")) {
                _context2.next = 21;
                break;
              }
              throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u83B7\u53D6\u5168\u90E8\u6570\u636E\u6570\u636E\u4E2D\u7684\u6570\u636E\uFF1A".concat(item));
            case 21:
              if ("cvid" in item && typeof item.cvid == "string" && "name" in item && typeof item.name == "string" && "value" in item && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(item.value == "string" || item.value == "number" || Array.isArray(item.value)) && "type" in item && typeof item.type == "number") {
                _context2.next = 23;
                break;
              }
              throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u83B7\u53D6\u5168\u90E8\u6570\u636E\u6570\u636E\u4E2D\u7684\u6570\u636E\uFF1A".concat(item));
            case 23:
              cvid = item.cvid, name = item.name, value = item.value, _type = item.type;
              if (!(_type == _module_cloud_data_kitten_cloud_data_type__WEBPACK_IMPORTED_MODULE_17__.KittenCloudDataType.PRIVATE_VARIABLE)) {
                _context2.next = 28;
                break;
              }
              privateVariableArray.push({
                cvid: cvid,
                name: name,
                value: value
              });
              _context2.next = 37;
              break;
            case 28:
              if (!(_type == _module_cloud_data_kitten_cloud_data_type__WEBPACK_IMPORTED_MODULE_17__.KittenCloudDataType.PUBLIC_VARIABLE)) {
                _context2.next = 32;
                break;
              }
              publicVariableArray.push({
                cvid: cvid,
                name: name,
                value: value
              });
              _context2.next = 37;
              break;
            case 32:
              if (!(_type == _module_cloud_data_kitten_cloud_data_type__WEBPACK_IMPORTED_MODULE_17__.KittenCloudDataType.LIST)) {
                _context2.next = 36;
                break;
              }
              listArray.push({
                cvid: cvid,
                name: name,
                value: value
              });
              _context2.next = 37;
              break;
            case 36:
              throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u83B7\u53D6\u5168\u90E8\u6570\u636E\u6570\u636E\u4E2D\u7684\u6570\u636E\u6570\u636E\uFF1A".concat(item, "\uFF0C\u6570\u636E\u7C7B\u578B ").concat(_type, " \u4E0D\u652F\u6301"));
            case 37:
              _context2.next = 15;
              break;
            case 39:
              _context2.next = 44;
              break;
            case 41:
              _context2.prev = 41;
              _context2.t1 = _context2["catch"](13);
              _iterator.e(_context2.t1);
            case 44:
              _context2.prev = 44;
              _iterator.f();
              return _context2.finish(44);
            case 47:
              _this3.privateVariable.update(privateVariableArray);
              _this3.publicVariable.update(publicVariableArray);
              _this3.list.update(listArray);
              _this3.opened.emit();
              return _context2.abrupt("break", 74);
            case 52:
              _this3.privateVariable.handleCloudUpdate(data);
              return _context2.abrupt("break", 74);
            case 54:
              _this3.privateVariable.handleReceiveRankingList(data);
              return _context2.abrupt("break", 74);
            case 56:
              _this3.publicVariable.handleCloudUpdate(data);
              return _context2.abrupt("break", 74);
            case 58:
              _this3.list.handleCloudUpdate(data);
              return _context2.abrupt("break", 74);
            case 60:
              if (!(data == null)) {
                _context2.next = 62;
                break;
              }
              throw new Error("在线用户数量数据为空");
            case 62:
              if (!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__["default"])(data) != "object" || !("total" in data) || typeof data.total != "number")) {
                _context2.next = 64;
                break;
              }
              throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u5728\u7EBF\u7528\u6237\u6570\u91CF\u6570\u636E\uFF1A".concat(data));
            case 64:
              if (!(_this3.onlineUserNumberResolve != null)) {
                _context2.next = 69;
                break;
              }
              _this3.onlineUserNumberResolve(new _module_kitten_cloud_online_user_number__WEBPACK_IMPORTED_MODULE_12__.KittenCloudOnlineUserNumber(data.total));
              delete _this3.onlineUserNumberResolve;
              _context2.next = 72;
              break;
            case 69:
              _context2.next = 71;
              return _this3.onlineUserNumber;
            case 71:
              _context2.sent.update({
                total: data.total
              });
            case 72:
              return _context2.abrupt("break", 74);
            case 73:
              throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u6D88\u606F\u7C7B\u578B\uFF1A".concat(type));
            case 74:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[13, 41, 44, 47]]);
      }))().catch(function (error) {
        _this3.errored.emit(error);
      });
    }

    /**
     * 用于获取云数据实例。
     * @param index 该数据的名称或 cvid
     * @returns 对应云数据实例
     * @throws 如果不存在该云数据实例，则抛出异常
     */
  }, {
    key: "get",
    value: (function () {
      var _get = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().mark(function _callee3(index) {
        var groupArray, _i, _groupArray, group;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              groupArray = [this.privateVariable, this.publicVariable, this.list];
              _i = 0, _groupArray = groupArray;
            case 2:
              if (!(_i < _groupArray.length)) {
                _context3.next = 15;
                break;
              }
              group = _groupArray[_i];
              _context3.prev = 4;
              _context3.next = 7;
              return group.get(index);
            case 7:
              return _context3.abrupt("return", _context3.sent);
            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](4);
            case 12:
              _i++;
              _context3.next = 2;
              break;
            case 15:
              throw new Error("\u4E91\u6570\u636E ".concat(index, " \u4E0D\u5B58\u5728"));
            case 16:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[4, 10]]);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }())
  }, {
    key: "getAll",
    value: function () {
      var _getAll = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().mark(function _callee4() {
        var groupArray, result, _i2, _groupArray2, group;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_10___default().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              groupArray = [this.privateVariable, this.publicVariable, this.list];
              result = [];
              _i2 = 0, _groupArray2 = groupArray;
            case 3:
              if (!(_i2 < _groupArray2.length)) {
                _context4.next = 16;
                break;
              }
              group = _groupArray2[_i2];
              _context4.t0 = result.push;
              _context4.t1 = result;
              _context4.t2 = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"];
              _context4.next = 10;
              return group.getAll();
            case 10:
              _context4.t3 = _context4.sent;
              _context4.t4 = (0, _context4.t2)(_context4.t3);
              _context4.t0.apply.call(_context4.t0, _context4.t1, _context4.t4);
            case 13:
              _i2++;
              _context4.next = 3;
              break;
            case 16:
              return _context4.abrupt("return", result);
            case 17:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getAll() {
        return _getAll.apply(this, arguments);
      }
      return getAll;
    }()
  }], [{
    key: "caught",
    get:
    /**
     * 当从全局 Web_Socket 中捕获到源码云的连接，会将其转换为 KittenCloudFunction 实例并通过该信号通知。
     *
     * 该功能会污染全局 Web_Socket，仅在该信号被访问时才会启用。
     */
    function get() {
      if (KittenCloudFunction._caught == null) {
        KittenCloudFunction._caught = new _utils_signal__WEBPACK_IMPORTED_MODULE_14__.Signal();
        KittenCloudFunction.startCatch();
      }
      return KittenCloudFunction._caught;
    }
  }, {
    key: "startCatch",
    value: function startCatch() {
      var originalWeb_Socket = new Function("return " + ["Web", "Socket"].join(""))();
      new Function("webSocket", "\n            webSocket.prototype = ".concat("Web", "Socket", ".prototype;\n            ", "Web", "Socket", " = webSocket;\n        "))(function (url) {
        var socket = new originalWeb_Socket(url);
        if (typeof url == "string") {
          url = new URL(url);
        }
        if (!KittenCloudFunction.caught.isEmpty() && url.hostname == ["socketcv", "codemao", "cn"].join(".") && url.pathname == "/cloudstorage/") {
          var _url$searchParams$get;
          var workID = parseInt((_url$searchParams$get = url.searchParams.get("session_id")) !== null && _url$searchParams$get !== void 0 ? _url$searchParams$get : "0");
          var instance = KittenCloudFunction._caughtInstance.get(workID);
          if (instance == null) {
            instance = new KittenCloudFunction(socket);
            KittenCloudFunction._caughtInstance.set(workID, instance);
          } else {
            instance.socket.changeWeb_Socket(socket);
          }
          KittenCloudFunction.caught.emit(instance);
        }
        return socket;
      });
    }

    /**
     * 当前连接的作品。
     */

    /**
     * 源码云连接打开时触发该信号。
     *
     * 源码云连接打开是指 Web_Socket 连接成功，并且源码云功能完成了云功能初始化操作，这意味着在此之后可以正常使用云功能。
     */

    /**
     * 源码云连接断开时触发该信号。
     *
     * 源码云连接断开是指 Web_Socket 连接断开，如果不是客户端主动断开且配置了自动重连，会自动重新连接。
     */

    /**
     * 源码云连接关闭时触发该信号。
     *
     * 源码云连接关闭是指 Web_Socket 连接断开且之后不会再自动重连。
     */

    /**
     * 源码云连接发生错误时触发该信号。
     */

    /**
     * 该 Promise 实例会在源码云连接成功时被 resolve，并提供一个 {@link KittenCloudOnlineUserNumber} 实例作为参数。
     *
     * 如果源码云连接失败，则该 Promise 实例会被 reject。
     */

    /** 用于管理云私有变量。*/
    /** 用于管理云公有变量。*/
    /** 用于管理云列表。*/

    /**
     * 自动重连间隔时间（毫秒），填 `false` 表示禁用自动重连。
     *
     * 默认值：`8000`。
     */
  }, {
    key: "user",
    get:
    /**
     * 用于获取当前用户信息
     * @returns CodemaoUser
     */
    function get() {
      if (KittenCloudFunction._user == _utils_other__WEBPACK_IMPORTED_MODULE_23__.None) {
        KittenCloudFunction._user = new _codemao_user_codemao_user__WEBPACK_IMPORTED_MODULE_22__.CodemaoUser();
      }
      return KittenCloudFunction._user;
    }
  }]);
}(_module_kitten_cloud_function_config_layer__WEBPACK_IMPORTED_MODULE_15__.KittenCloudFunctionConfigLayer);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(KittenCloudFunction, "_caughtInstance", new Map());
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(KittenCloudFunction, "_user", _utils_other__WEBPACK_IMPORTED_MODULE_23__.None);

/***/ }),
/* 16 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);




function _toConsumableArray(r) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(r) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(r) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}


/***/ }),
/* 17 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r);
}


/***/ }),
/* 18 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}


/***/ }),
/* 19 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}


/***/ }),
/* 20 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r, a) : void 0;
  }
}


/***/ }),
/* 21 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ }),
/* 22 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(25);




function _slicedToArray(r, e) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(r, e) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(r, e) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}


/***/ }),
/* 23 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}


/***/ }),
/* 24 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}


/***/ }),
/* 25 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}


/***/ }),
/* 26 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

function _defineProperty(e, r, t) {
  return (r = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodemaoWork: function() { return /* binding */ CodemaoWork; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _codemao_work_info__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28);




/**
 * 编程猫作品。
 */
var CodemaoWork = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(
/**
 * 作品信息，详见{@link CodemaoWorkInfo}。
 */

/**
 * @param info 已知作品信息。
 */
function CodemaoWork(info) {
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, CodemaoWork);
  this.info = new _codemao_work_info__WEBPACK_IMPORTED_MODULE_2__.CodemaoWorkInfo(info);
});

/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodemaoWorkInfo: function() { return /* binding */ CodemaoWorkInfo; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(26);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(30);
/* harmony import */ var _codemao_work_type__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(80);










/**
 * 作品信息对象。
 */

/**
 * ## 编程猫作品信息类
 *
 * - 用于获取编程猫作品信息。
 * - 所有属性均为`Promise`对象，当属性获取失败时访问该属性的值会被拒绝。
 *
 * 提供的作品信息详见类属性
 *
 * ### 具有以下特性：
 * - 集成多个API接口，以确保在部分API接口信息获取失败时仍能提供尽可能完整的作品信息。
 * - 内置懒加载和缓存机制，以减少不必要的请求。
 *
 * ### 集成API接口
 *
 * #### 已经集成的API接口
 * - {@link getWorkInfo}
 * - {@link getWorkDetail}
 * - {@link getNemoWorkPublicResource}
 * - {@link getKittenWorkPublicResource}
 *
 * #### 将来可能集成的API接口：
 * - {@link searchWorkByName}
 *
 * #### API优先级：
 * - 优先使用 {@link getWorkInfo} 接口获取作品信息，该接口包含了作品的全部信息，但是容易出错。
 * - 如果 {@link getWorkInfo} 接口获取失败，则使用 {@link getWorkDetail} 接口获取作品的大部分信息。
 * - 如果 {@link getWorkDetail} 接口获取失败，则使用 {@link getNemoWorkPublicResource} 和 {@link getKittenWorkPublicResource} 接口获取作品的少部分信息。
 * - 如果所有接口都获取失败，则抛出异常，对应属性的值会被拒绝。
 */
var CodemaoWorkInfo = /*#__PURE__*/function () {
  /**
   * @param info 已知的作品信息。
   */
  function CodemaoWorkInfo(info) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, CodemaoWorkInfo);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_workInfo", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_workDetail", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_nemoPublicResource", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_kittenPublicResource", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_id", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_name", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_type", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_description", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_operationInstruction", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_publishTime", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_playerURL", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_shareURL", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_coverURL", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_previewURL", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_viewTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_likeTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_collectTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_shareTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_commentTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_openResource", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    this.set(info);
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(CodemaoWorkInfo, [{
    key: "workInfo",
    get: function get() {
      var _this = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this._workInfo == null)) {
                _context2.next = 7;
                break;
              }
              _this._workInfo = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee() {
                var workInfo;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      _context.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getWorkInfo;
                      _context.next = 3;
                      return _this.id;
                    case 3:
                      _context.t1 = _context.sent;
                      _context.next = 6;
                      return (0, _context.t0)(_context.t1);
                    case 6:
                      workInfo = _context.sent;
                      return _context.abrupt("return", {
                        id: workInfo.id,
                        name: workInfo.work_name,
                        type: _codemao_work_type__WEBPACK_IMPORTED_MODULE_8__.CodemaoWorkType.parse(workInfo.type),
                        description: workInfo.description,
                        operationInstruction: workInfo.operation,
                        publishTime: new Date(workInfo.publish_time * 1000),
                        playerURL: workInfo.player_url,
                        shareURL: workInfo.share_url,
                        coverURL: workInfo.preview,
                        previewURL: workInfo.screenshot_cover_url,
                        viewTimes: workInfo.view_times,
                        likeTimes: workInfo.praise_times,
                        collectTimes: workInfo.collect_times,
                        shareTimes: workInfo.share_times,
                        commentTimes: workInfo.comment_times,
                        openResource: workInfo.fork_enable
                      });
                    case 8:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }))();
              _context2.t0 = _this;
              _context2.next = 5;
              return _this._workInfo;
            case 5:
              _context2.t1 = _context2.sent;
              _context2.t0.set.call(_context2.t0, _context2.t1);
            case 7:
              _context2.next = 9;
              return _this._workInfo;
            case 9:
              return _context2.abrupt("return", _context2.sent);
            case 10:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    }
  }, {
    key: "workDetail",
    get: function get() {
      var _this2 = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee4() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(_this2._workDetail == null)) {
                _context4.next = 7;
                break;
              }
              _this2._workDetail = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee3() {
                var _yield$getWorkDetail, workInfo, qrcodeUrl, allowFork;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getWorkDetail;
                      _context3.next = 3;
                      return _this2.id;
                    case 3:
                      _context3.t1 = _context3.sent;
                      _context3.next = 6;
                      return (0, _context3.t0)(_context3.t1);
                    case 6:
                      _yield$getWorkDetail = _context3.sent;
                      workInfo = _yield$getWorkDetail.workInfo;
                      qrcodeUrl = _yield$getWorkDetail.qrcodeUrl;
                      allowFork = _yield$getWorkDetail.allowFork;
                      return _context3.abrupt("return", {
                        id: workInfo.id,
                        name: workInfo.name,
                        description: workInfo.description,
                        publishTime: new Date(workInfo.publish_time * 1000),
                        shareURL: qrcodeUrl,
                        previewURL: workInfo.preview,
                        viewTimes: workInfo.view_times,
                        likeTimes: workInfo.praise_times,
                        collectTimes: workInfo.collection_times,
                        openResource: Boolean(allowFork)
                      });
                    case 11:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              }))();
              _context4.t0 = _this2;
              _context4.next = 5;
              return _this2._workDetail;
            case 5:
              _context4.t1 = _context4.sent;
              _context4.t0.set.call(_context4.t0, _context4.t1);
            case 7:
              _context4.next = 9;
              return _this2._workDetail;
            case 9:
              return _context4.abrupt("return", _context4.sent);
            case 10:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }))();
    }
  }, {
    key: "nemoWorkPublicResource",
    get: function get() {
      var _this3 = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee6() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!(_this3._nemoPublicResource == null)) {
                _context6.next = 7;
                break;
              }
              _this3._nemoPublicResource = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee5() {
                var source;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getNemoWorkPublicResource;
                      _context5.next = 3;
                      return _this3.id;
                    case 3:
                      _context5.t1 = _context5.sent;
                      _context5.next = 6;
                      return (0, _context5.t0)(_context5.t1);
                    case 6:
                      source = _context5.sent;
                      return _context5.abrupt("return", {
                        id: source.work_id,
                        name: source.name,
                        type: _codemao_work_type__WEBPACK_IMPORTED_MODULE_8__.CodemaoWorkType.NEMO,
                        coverURL: source.preview,
                        previewURL: source.preview,
                        viewTimes: source.view_times,
                        likeTimes: source.n_likes
                      });
                    case 8:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }))();
              _context6.t0 = _this3;
              _context6.next = 5;
              return _this3._nemoPublicResource;
            case 5:
              _context6.t1 = _context6.sent;
              _context6.t0.set.call(_context6.t0, _context6.t1);
            case 7:
              _context6.next = 9;
              return _this3._nemoPublicResource;
            case 9:
              return _context6.abrupt("return", _context6.sent);
            case 10:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }))();
    }
  }, {
    key: "kittenWorkPublicResource",
    get: function get() {
      var _this4 = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee8() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (!(_this4._kittenPublicResource == null)) {
                _context8.next = 7;
                break;
              }
              _this4._kittenPublicResource = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee7() {
                var source;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee7$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getKittenWorkPublicResource;
                      _context7.next = 3;
                      return _this4.id;
                    case 3:
                      _context7.t1 = _context7.sent;
                      _context7.next = 6;
                      return (0, _context7.t0)(_context7.t1);
                    case 6:
                      source = _context7.sent;
                      return _context7.abrupt("return", {
                        name: source.name,
                        type: _codemao_work_type__WEBPACK_IMPORTED_MODULE_8__.CodemaoWorkType.KITTEN,
                        publishTime: new Date(source.updated_time * 1000)
                      });
                    case 8:
                    case "end":
                      return _context7.stop();
                  }
                }, _callee7);
              }))();
              _context8.t0 = _this4;
              _context8.next = 5;
              return _this4._kittenPublicResource;
            case 5:
              _context8.t1 = _context8.sent;
              _context8.t0.set.call(_context8.t0, _context8.t1);
            case 7:
              _context8.next = 9;
              return _this4._kittenPublicResource;
            case 9:
              return _context8.abrupt("return", _context8.sent);
            case 10:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }))();
    }
  }, {
    key: "id",
    get:
    /**
     * 作品 ID。
     */
    function get() {
      if (this._id == null) {
        this._id = Promise.reject(new Error("没有提供ID"));
      }
      return this._id;
    }

    /**
     * 作品名称。
     */
  }, {
    key: "name",
    get: function get() {
      var _this5 = this;
      if (this._name == null) {
        this._name = Promise.any([Promise.reject(new Error("没有提供名称")), this.workInfo.catch(function (getWorkInfoError) {
          return _this5.workDetail.catch(function (getWorkDetailError) {
            return Promise.reject([getWorkInfoError, getWorkDetailError]);
          });
        }).catch(function (error0) {
          return Promise.any([_this5.nemoWorkPublicResource, _this5.kittenWorkPublicResource]).catch(function (error1) {
            return Promise.reject([].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(error0), (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(error1.errors)));
          });
        }).then(function (info) {
          return info.name;
        })]).catch(function (_ref9) {
          var errors = _ref9.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._name;
    }

    /**
     * 作品类型，详见 {@link CodemaoWorkType}。
     */
  }, {
    key: "type",
    get: function get() {
      var _this6 = this;
      if (this._type == null) {
        this._type = Promise.any([Promise.reject(new Error("没有提供类型")), this.workInfo.catch(function (error0) {
          return Promise.any([_this6.nemoWorkPublicResource, _this6.kittenWorkPublicResource]).catch(function (error1) {
            return Promise.reject([error0].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(error1.errors)));
          });
        }).then(function (info) {
          return info.type;
        })]).catch(function (_ref10) {
          var errors = _ref10.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._type;
    }

    /**
     * 作品描述。
     */
  }, {
    key: "description",
    get: function get() {
      var _this7 = this;
      if (this._description == null) {
        this._description = Promise.any([Promise.reject(new Error("没有提供描述")), this.workInfo.catch(function (error0) {
          return _this7.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.description;
        })]).catch(function (_ref11) {
          var errors = _ref11.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._description;
    }

    /**
     * 作品操作说明。
     */
  }, {
    key: "operationInstruction",
    get: function get() {
      if (this._operationInstruction == null) {
        this._operationInstruction = Promise.any([Promise.reject(new Error("没有提供操作说明")), this.workInfo.then(function (info) {
          return info.operationInstruction;
        })]).catch(function (_ref12) {
          var errors = _ref12.errors;
          return Promise.reject(errors);
        });
      }
      return this._operationInstruction;
    }

    /**
     * 作品发布时间。
     */
  }, {
    key: "publishTime",
    get: function get() {
      var _this8 = this;
      if (this._publishTime == null) {
        this._publishTime = Promise.any([Promise.reject(new Error("没有提供发布时间")), this.workInfo.catch(function (error0) {
          return _this8.kittenWorkPublicResource.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.publishTime;
        })]).catch(function (_ref13) {
          var errors = _ref13.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._publishTime;
    }

    /**
     * 作品运行器（即 Player）地址。
     */
  }, {
    key: "playerURL",
    get: function get() {
      if (this._playerURL == null) {
        this._playerURL = Promise.any([Promise.reject(new Error("没有提供运行器地址")), this.workInfo.then(function (info) {
          return info.playerURL;
        })]).catch(function (_ref14) {
          var errors = _ref14.errors;
          return Promise.reject(errors);
        });
      }
      return this._playerURL;
    }

    /**
     * 作品分享地址。
     */
  }, {
    key: "shareURL",
    get: function get() {
      var _this9 = this;
      if (this._shareURL == null) {
        this._shareURL = Promise.any([Promise.reject(new Error("没有提供分享地址")), this.workInfo.catch(function (error0) {
          return _this9.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.shareURL;
        })]).catch(function (_ref15) {
          var errors = _ref15.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._shareURL;
    }

    /**
     * 作品封面地址。
     */
  }, {
    key: "coverURL",
    get: function get() {
      var _this10 = this;
      if (this._coverURL == null) {
        this._coverURL = Promise.any([Promise.reject(new Error("没有提供封面地址")), this.workInfo.catch(function (error0) {
          return _this10.nemoWorkPublicResource.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.coverURL;
        })]).catch(function (_ref16) {
          var errors = _ref16.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._coverURL;
    }

    /**
     * 作品预览地址。
     */
  }, {
    key: "previewURL",
    get: function get() {
      var _this11 = this;
      if (this._previewURL == null) {
        this._previewURL = Promise.any([Promise.reject(new Error("没有提供预览地址")), this.workInfo.catch(function (error0) {
          return _this11.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).catch(function (error0) {
          return _this11.nemoWorkPublicResource.catch(function (error1) {
            return Promise.reject([].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(error0), [error1]));
          });
        }).then(function (info) {
          return info.previewURL;
        })]).catch(function (_ref17) {
          var errors = _ref17.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._previewURL;
    }

    /**
     * 作品被浏览的次数。
     */
  }, {
    key: "viewTimes",
    get: function get() {
      var _this12 = this;
      if (this._viewTimes == null) {
        this._viewTimes = Promise.any([Promise.reject(new Error("没有提供浏览次数")), this.workInfo.catch(function (error0) {
          return _this12.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).catch(function (error0) {
          return _this12.nemoWorkPublicResource.catch(function (error1) {
            return Promise.reject([].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(error0), [error1]));
          });
        }).then(function (info) {
          return info.viewTimes;
        })]).catch(function (_ref18) {
          var errors = _ref18.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._viewTimes;
    }

    /**
     * 点赞该作品的人数。
     */
  }, {
    key: "likeTimes",
    get: function get() {
      var _this13 = this;
      if (this._likeTimes == null) {
        this._likeTimes = Promise.any([Promise.reject(new Error("没有提供点赞次数")), this.workInfo.catch(function (error0) {
          return _this13.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).catch(function (error0) {
          return _this13.nemoWorkPublicResource.catch(function (error1) {
            return Promise.reject([].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(error0), [error1]));
          });
        }).then(function (info) {
          return info.likeTimes;
        })]).catch(function (_ref19) {
          var errors = _ref19.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._likeTimes;
    }

    /**
     * 收藏该作品的人数。
     */
  }, {
    key: "collectTimes",
    get: function get() {
      var _this14 = this;
      if (this._collectTimes == null) {
        this._collectTimes = Promise.any([Promise.reject(new Error("没有提供收藏次数")), this.workInfo.catch(function (error0) {
          return _this14.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.collectTimes;
        })]).catch(function (_ref20) {
          var errors = _ref20.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._collectTimes;
    }

    /**
     * 作品被分享的次数。
     */
  }, {
    key: "shareTimes",
    get: function get() {
      if (this._shareTimes == null) {
        this._shareTimes = Promise.any([Promise.reject(new Error("没有提供分享次数")), this.workInfo.then(function (info) {
          return info.shareTimes;
        })]).catch(function (_ref21) {
          var errors = _ref21.errors;
          return Promise.reject(errors);
        });
      }
      return this._shareTimes;
    }

    /**
     * 作品的评论区中评论的数量，包括二级评论。
     */
  }, {
    key: "commentTimes",
    get: function get() {
      if (this._commentTimes == null) {
        this._commentTimes = Promise.any([Promise.reject(new Error("没有提供评论次数")), this.workInfo.then(function (info) {
          return info.commentTimes;
        })]).catch(function (_ref22) {
          var errors = _ref22.errors;
          return Promise.reject(errors);
        });
      }
      return this._commentTimes;
    }

    /**
     * 作品是否是否开源。
     */
  }, {
    key: "openResource",
    get: function get() {
      var _this15 = this;
      if (this._openResource == null) {
        this._openResource = Promise.any([Promise.reject(new Error("没有提供开源状态")), this.workInfo.catch(function (error0) {
          return _this15.workDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.openResource;
        })]).catch(function (_ref23) {
          var errors = _ref23.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._openResource;
    }
  }, {
    key: "set",
    value: function set(info) {
      if (info.id != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._id = Promise.resolve(info.id);
      if (info.name != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._name = Promise.resolve(info.name);
      if (info.type != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._type = Promise.resolve(info.type);
      if (info.description != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._description = Promise.resolve(info.description);
      if (info.operationInstruction != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._operationInstruction = Promise.resolve(info.operationInstruction);
      if (info.publishTime != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._publishTime = Promise.resolve(info.publishTime);
      if (info.playerURL != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._playerURL = Promise.resolve(info.playerURL);
      if (info.shareURL != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._shareURL = Promise.resolve(info.shareURL);
      if (info.coverURL != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._coverURL = Promise.resolve(info.coverURL);
      if (info.previewURL != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._previewURL = Promise.resolve(info.previewURL);
      if (info.viewTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._viewTimes = Promise.resolve(info.viewTimes);
      if (info.likeTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._likeTimes = Promise.resolve(info.likeTimes);
      if (info.collectTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._collectTimes = Promise.resolve(info.collectTimes);
      if (info.shareTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._shareTimes = Promise.resolve(info.shareTimes);
      if (info.commentTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._commentTimes = Promise.resolve(info.commentTimes);
      if (info.openResource != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._openResource = Promise.resolve(info.openResource);
    }
  }]);
}();

/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   None: function() { return /* binding */ None; },
/* harmony export */   equal: function() { return /* binding */ equal; },
/* harmony export */   merge: function() { return /* binding */ merge; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

var None = null;
function equal(a, b) {
  if (a === b) {
    return true;
  }
  if (a && b && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(a) == "object" && (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(b) == "object") {
    if (a.constructor != b.constructor) {
      return false;
    }
    if (Array.isArray(a)) {
      if (a.length != b.length) {
        return false;
      }
      for (var i = 0; i < a.length; i++) {
        if (!equal(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    var keys = Object.keys(a);
    if (keys.length != Object.keys(b).length) {
      return false;
    }
    for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
      var key = _keys[_i];
      if (!(key in b) || !equal(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
function merge(target, source) {
  for (var key in source) {
    if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(source[key]) == "object" && source[key] != None) {
      if (!(key in target)) {
        target[key] = {};
      }
      if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(target[key]) == "object" && target[key] != None) {
        merge(target[key], source[key]);
      }
    } else if (!(key in target)) {
      target[key] = source[key];
    }
  }
  return target;
}

/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getKittenWorkPublicResource: function() { return /* binding */ getKittenWorkPublicResource; },
/* harmony export */   getNemoWorkPublicResource: function() { return /* binding */ getNemoWorkPublicResource; },
/* harmony export */   getThisUserDetail: function() { return /* binding */ getThisUserDetail; },
/* harmony export */   getUserDetail: function() { return /* binding */ getUserDetail; },
/* harmony export */   getUserHonor: function() { return /* binding */ getUserHonor; },
/* harmony export */   getUserProfile: function() { return /* binding */ getUserProfile; },
/* harmony export */   getWorkDetail: function() { return /* binding */ getWorkDetail; },
/* harmony export */   getWorkInfo: function() { return /* binding */ getWorkInfo; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31);



function moduleResponseDate(data) {
  if (data.code != 200) {
    throw new Error("codemao api error: ".concat(data.msg));
  }
  return data.data;
}
/**
 * https://api.codemao.cn/tiger/v3/web/accounts/profile
 * @param authorization 用户凭证，留空则使用浏览器 Cookie
 * @returns 用户信息
 */
function getUserProfile(_x) {
  return _getUserProfile.apply(this, arguments);
}

/**
 * https://api.codemao.cn/web/users/details
 *
 * 用户被封号时该 API 不可用。
 *
 * @param authorization 用户凭证，留空则使用浏览器 Cookie
 */
function _getUserProfile() {
  _getUserProfile = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(authorization) {
    var headers;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          headers = authorization == null ? {} : {
            Cookie: "Authorization=".concat(authorization)
          };
          _context.next = 3;
          return (0,axios__WEBPACK_IMPORTED_MODULE_2__["default"])({
            method: "GET",
            url: "https://api.codemao.cn/tiger/v3/web/accounts/profile",
            withCredentials: true,
            headers: headers
          });
        case 3:
          return _context.abrupt("return", _context.sent.data);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getUserProfile.apply(this, arguments);
}
function getThisUserDetail(_x2) {
  return _getThisUserDetail.apply(this, arguments);
}

/**
 * https://api.codemao.cn/api/user/info/detail/${userID}
 */
function _getThisUserDetail() {
  _getThisUserDetail = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee2(authorization) {
    var headers;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          headers = authorization == null ? {} : {
            Cookie: "Authorization=".concat(authorization)
          };
          _context2.next = 3;
          return (0,axios__WEBPACK_IMPORTED_MODULE_2__["default"])({
            method: "GET",
            url: "https://api.codemao.cn/web/users/details",
            withCredentials: true,
            headers: headers
          });
        case 3:
          return _context2.abrupt("return", _context2.sent.data);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getThisUserDetail.apply(this, arguments);
}
function getUserDetail(_x3) {
  return _getUserDetail.apply(this, arguments);
}

/**
 * https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=${userID}
 */
function _getUserDetail() {
  _getUserDetail = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee3(userID) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t0 = moduleResponseDate;
          _context3.next = 3;
          return axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://api.codemao.cn/api/user/info/detail/".concat(userID));
        case 3:
          _context3.t1 = _context3.sent.data;
          return _context3.abrupt("return", (0, _context3.t0)(_context3.t1).userInfo);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getUserDetail.apply(this, arguments);
}
function getUserHonor(_x4) {
  return _getUserHonor.apply(this, arguments);
}

/**
 * https://api.codemao.cn/creation-tools/v1/works/${workID}
 */
function _getUserHonor() {
  _getUserHonor = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee4(userID) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=".concat(userID));
        case 2:
          return _context4.abrupt("return", _context4.sent.data);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _getUserHonor.apply(this, arguments);
}
function getWorkInfo(_x5) {
  return _getWorkInfo.apply(this, arguments);
}

/**
 * https://api.codemao.cn/api/work/info/${workID}
 */
function _getWorkInfo() {
  _getWorkInfo = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee5(workID) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://api.codemao.cn/creation-tools/v1/works/".concat(workID));
        case 2:
          return _context5.abrupt("return", _context5.sent.data);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _getWorkInfo.apply(this, arguments);
}
function getWorkDetail(_x6) {
  return _getWorkDetail.apply(this, arguments);
}

/**
 * https://api.codemao.cn/creation-tools/v1/works/${workID}/source/public
 */
function _getWorkDetail() {
  _getWorkDetail = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee6(workID) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.t0 = moduleResponseDate;
          _context6.next = 3;
          return axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://api.codemao.cn/api/work/info/".concat(workID));
        case 3:
          _context6.t1 = _context6.sent.data;
          return _context6.abrupt("return", (0, _context6.t0)(_context6.t1).workDetail);
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _getWorkDetail.apply(this, arguments);
}
function getNemoWorkPublicResource(_x7) {
  return _getNemoWorkPublicResource.apply(this, arguments);
}

/**
 * https://api-creation.codemao.cn/kitten/r2/work/player/load/${workID}
 */
function _getNemoWorkPublicResource() {
  _getNemoWorkPublicResource = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee7(workID) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://api.codemao.cn/creation-tools/v1/works/".concat(workID, "/source/public"));
        case 2:
          return _context7.abrupt("return", _context7.sent.data);
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _getNemoWorkPublicResource.apply(this, arguments);
}
function getKittenWorkPublicResource(_x8) {
  return _getKittenWorkPublicResource.apply(this, arguments);
}
function _getKittenWorkPublicResource() {
  _getKittenWorkPublicResource = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee8(workID) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return axios__WEBPACK_IMPORTED_MODULE_2__["default"].get("https://api-creation.codemao.cn/kitten/r2/work/player/load/".concat(workID));
        case 2:
          return _context8.abrupt("return", _context8.sent.data);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _getKittenWorkPublicResource.apply(this, arguments);
}

/***/ }),
/* 31 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32);
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(33);
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34);
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(70);
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(43);
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(52);
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(56);
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(76);
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(55);
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(75);
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(37);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(38);
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(77);
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(78);
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(53);
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(57);
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(79);




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_15__["default"].getAdapter;

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_16__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
});


/***/ }),
/* 33 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ bind; }
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),
/* 34 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32);
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(35);
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40);
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(41);
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70);
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(67);
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74);
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(53);











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;

        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ buildURL; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36);





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),
/* 36 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(38);
/* harmony import */ var _platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39);




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_platform_node_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSpecCompliantForm(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        ((_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]')) && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ dispatchRequest; }
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42);
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(55);
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(43);
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56);
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57);









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),
/* 42 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ transformData; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32);
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),
/* 43 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(38);
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44);
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(37);
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(45);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(46);
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(52);










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isResponse(data) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isReadableStream(data)) {
      return data;
    }

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),
/* 45 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ toURLEncodedForm; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32);
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(46);






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),
/* 46 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(47);
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ..._common_utils_js__WEBPACK_IMPORTED_MODULE_0__,
  ..._node_index_js__WEBPACK_IMPORTED_MODULE_1__["default"]
});


/***/ }),
/* 47 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(48);
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49);
/* harmony import */ var _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(50);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob: _classes_Blob_js__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),
/* 48 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof FormData !== 'undefined' ? FormData : null);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof Blob !== 'undefined' ? Blob : null);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasBrowserEnv: function() { return /* binding */ hasBrowserEnv; },
/* harmony export */   hasStandardBrowserEnv: function() { return /* binding */ hasStandardBrowserEnv; },
/* harmony export */   hasStandardBrowserWebWorkerEnv: function() { return /* binding */ hasStandardBrowserWebWorkerEnv; },
/* harmony export */   origin: function() { return /* binding */ origin; }
/* harmony export */ });
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = (
  (product) => {
    return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
  })(typeof navigator !== 'undefined' && navigator.product);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';




/***/ }),
/* 52 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54);





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),
/* 55 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isCancel; }
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),
/* 56 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32);
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39);
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(58);
/* harmony import */ var _fetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(38);






const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  fetch: _fetch_js__WEBPACK_IMPORTED_MODULE_2__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_4__["default"](
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),
/* 58 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(32);
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59);
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(44);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(38);
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(56);
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(60);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(46);
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(61);
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])(config);
    let requestData = _config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(_config.headers).normalize();
    let {responseType} = _config;
    let onCanceled;
    function done() {
      if (_config.cancelToken) {
        _config.cancelToken.unsubscribe(onCanceled);
      }

      if (_config.signal) {
        _config.signal.removeEventListener('abort', onCanceled);
      }
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_2__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED, _config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_NETWORK, _config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_4__["default"];
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ECONNABORTED,
        _config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_5__["default"].isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (typeof _config.onDownloadProgress === 'function') {
      request.addEventListener('progress', (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof _config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_config.onUploadProgress));
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_7__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_8__["default"])(_config.url);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_9__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),
/* 59 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ settle; }
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),
/* 60 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ parseProtocol; }
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),
/* 61 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(62);
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0,_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return (0,_throttle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  }, freq);
});


/***/ }),
/* 62 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });


/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1000 / freq;
  let timer = null;
  return function throttled() {
    const force = this === true;

    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, arguments);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, arguments);
      }, threshold - (now - timestamp));
    }
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(46);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(32);
/* harmony import */ var _isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(65);
/* harmony import */ var _cookies_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(66);
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67);
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(70);
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);
/* harmony import */ var _buildURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35);









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((config) => {
  const newConfig = (0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(headers);

  newConfig.url = (0,_buildURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_3__["default"])(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFormData(data)) {
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_platform_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].hasStandardBrowserEnv) {
    withXSRFToken && _utils_js__WEBPACK_IMPORTED_MODULE_4__["default"].isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && (0,_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_6__["default"])(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies_js__WEBPACK_IMPORTED_MODULE_7__["default"].read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});



/***/ }),
/* 65 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());


/***/ }),
/* 66 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path) && cookie.push('path=' + path);

      _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });



/***/ }),
/* 67 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ buildFullPath; }
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68);
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69);





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),
/* 68 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isAbsoluteURL; }
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),
/* 69 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ combineURLs; }
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),
/* 70 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ mergeConfig; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53);





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),
/* 71 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(38);
/* harmony import */ var _helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(72);
/* harmony import */ var _helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(73);
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(53);
/* harmony import */ var _helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(61);
/* harmony import */ var _helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(64);
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(59);










const fetchProgressDecorator = (total, fn) => {
  const lengthComputable = total != null;
  return (loaded) => setTimeout(() => fn({
    lengthComputable,
    total,
    loaded
  }));
}

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const supportsRequestStream = isReadableStreamSupported && (() => {
  let duplexAccessed = false;

  const hasContentType = new Request(_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
})();

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported && !!(()=> {
  try {
    return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isReadableStream(new Response('').body);
  } catch(err) {
    // return undefined
  }
})();

const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"](`Response type '${type}' is not supported`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isBlob(body)) {
    return body.size;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isSpecCompliantForm(body)) {
    return (await new Request(body).arrayBuffer()).byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArrayBufferView(body)) {
    return body.byteLength;
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isURLSearchParams(body)) {
    body = body + '';
  }

  if(_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = (0,_helpers_resolveConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
    (0,_helpers_composeSignals_js__WEBPACK_IMPORTED_MODULE_4__["default"])([signal, cancelToken], timeout) : [];

  let finished, request;

  const onFinish = () => {
    !finished && setTimeout(() => {
      composedSignal && composedSignal.unsubscribe();
    });

    finished = true;
  }

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        data = (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_5__.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
          requestContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(onUploadProgress)
        ), null, encodeText);
      }
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(withCredentials)) {
      withCredentials = withCredentials ? 'cors' : 'omit';
    }

    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      withCredentials
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].toFiniteNumber(response.headers.get('content-length'));

      response = new Response(
        (0,_helpers_trackStream_js__WEBPACK_IMPORTED_MODULE_5__.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
          responseContentLength,
          (0,_helpers_progressEventReducer_js__WEBPACK_IMPORTED_MODULE_6__["default"])(onDownloadProgress, true)
        ), isStreamResponse && onFinish, encodeText),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && onFinish();

    stopTimeout && stopTimeout();

    return await new Promise((resolve, reject) => {
      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_7__["default"])(resolve, reject, {
        data: responseData,
        headers: _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_8__["default"].from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    onFinish();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"].from(err, err && err.code, config, request);
  }
}));




/***/ }),
/* 72 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(56);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);



const composeSignals = (signals, timeout) => {
  let controller = new AbortController();

  let aborted;

  const onabort = function (cancel) {
    if (!aborted) {
      aborted = true;
      unsubscribe();
      const err = cancel instanceof Error ? cancel : this.reason;
      controller.abort(err instanceof _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? err : new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_1__["default"](err instanceof Error ? err.message : err));
    }
  }

  let timer = timeout && setTimeout(() => {
    onabort(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](`timeout ${timeout} of ms exceeded`, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ETIMEDOUT))
  }, timeout)

  const unsubscribe = () => {
    if (signals) {
      timer && clearTimeout(timer);
      timer = null;
      signals.forEach(signal => {
        signal &&
        (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
      });
      signals = null;
    }
  }

  signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

  const {signal} = controller;

  signal.unsubscribe = unsubscribe;

  return [signal, () => {
    timer && clearTimeout(timer);
    timer = null;
  }];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (composeSignals);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readBytes: function() { return /* binding */ readBytes; },
/* harmony export */   streamChunk: function() { return /* binding */ streamChunk; },
/* harmony export */   trackStream: function() { return /* binding */ trackStream; }
/* harmony export */ });


const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize, encode) {
  for await (const chunk of iterable) {
    yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
  const iterator = readBytes(stream, chunkSize, encode);

  let bytes = 0;

  return new ReadableStream({
    type: 'bytes',

    async pull(controller) {
      const {done, value} = await iterator.next();

      if (done) {
        controller.close();
        onFinish();
        return;
      }

      let len = value.byteLength;
      onProgress && onProgress(bytes += len);
      controller.enqueue(new Uint8Array(value));
    },
    cancel(reason) {
      onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}


/***/ }),
/* 74 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(75);
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),
/* 75 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: function() { return /* binding */ VERSION; }
/* harmony export */ });
const VERSION = "1.7.2";

/***/ }),
/* 76 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56);




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ spread; }
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),
/* 78 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ isAxiosError; }
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),
/* 79 */
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodemaoWorkType: function() { return /* binding */ CodemaoWorkType; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);



var _CodemaoWorkType;
/** 作品类型。*/var CodemaoWorkType = /*#__PURE__*/function () {
  function CodemaoWorkType(name) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, CodemaoWorkType);
    this.name = name;
    this.symbol = Symbol(name);
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(CodemaoWorkType, [{
    key: "toString",
    value: function toString() {
      return this.name;
    }
  }], [{
    key: "from",
    value: function from(argument) {
      if (argument instanceof CodemaoWorkType) {
        return argument;
      }
      return CodemaoWorkType.parse(argument);
    }
  }, {
    key: "parse",
    value: function parse(type) {
      type = type.toUpperCase();
      if (!(type in typeMap)) {
        throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u4F5C\u54C1\u7C7B\u578B\uFF1A".concat(type));
      }
      return typeMap[type];
    }

    /** 作品类型名称。*/
    /** 作品类型符号。*/
  }]);
}();
_CodemaoWorkType = CodemaoWorkType;
/** 作品使用 NEMO 创作。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(CodemaoWorkType, "NEMO", new _CodemaoWorkType("NEMO"));
/** 作品使用 KITTEN 创作。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(CodemaoWorkType, "KITTEN", new _CodemaoWorkType("KITTEN"));
var typeMap = {
  "NEMO": CodemaoWorkType.NEMO,
  "KITTEN": CodemaoWorkType.KITTEN,
  "KITTEN2": CodemaoWorkType.KITTEN,
  "KITTEN3": CodemaoWorkType.KITTEN,
  "KITTEN4": CodemaoWorkType.KITTEN
};

/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudOnlineUserNumber: function() { return /* binding */ KittenCloudOnlineUserNumber; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(82);




/**
 * 在线用户数变化消息，当在线用户数发生变化时会收到该消息，详见 {@link KittenCloudOnlineUserNumber.changed}
 */

/**
 * 提供在线用户数相关功能。
 */
var KittenCloudOnlineUserNumber = /*#__PURE__*/function () {
  /**
   * 在线用户数变化时会触发该信号，并提供原有在线用户数和新在线用户数。
   *
   * 在线用户数变化消息详见 {@link KittenCloudOnlineUserNumberChangObject}
   */

  function KittenCloudOnlineUserNumber(
  /**
   * 当前在线用户数。
   */
  value) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudOnlineUserNumber);
    this.value = value;
    this.changed = new _utils_signal__WEBPACK_IMPORTED_MODULE_2__.Signal();
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudOnlineUserNumber, [{
    key: "update",
    value: function update(_ref) {
      var total = _ref.total;
      var originalNumber = this.value;
      var newNumber = total;
      this.value = newNumber;
      this.changed.emit({
        originalNumber: originalNumber,
        newNumber: newNumber
      });
    }
  }]);
}();

/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Signal: function() { return /* binding */ Signal; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


/**
 * 信号。
 *
 * 当有消息需要向外界发送时，就可以使用信号。
 */
var Signal = /*#__PURE__*/function () {
  function Signal() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Signal);
    this.slots = [];
  }

  /**
   * 连接一个消息接收函数，当有消息被发送时，该函数将被调用。
   *
   * @param slot 接收函数
   */
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Signal, [{
    key: "connect",
    value: function connect(slot) {
      this.slots.push(slot);
    }

    /**
     * 断开一个消息接收函数，使其不再接收消息。如果该函数不在接收列表中，则什么也不做。
     *
     * @param slot 要断开的接收函数
     */
  }, {
    key: "disconnect",
    value: function disconnect(slot) {
      var index = this.slots.indexOf(slot);
      if (index >= 0) {
        this.slots.splice(index, 1);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.slots = [];
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.slots.length == 0;
    }
  }, {
    key: "emit",
    value: function emit(message) {
      this.slots.slice().forEach(function (slot) {
        slot(message);
      });
    }

    /**
     * 等待消息被发送或超时。
     *
     * @param timeout 超时时间（毫秒），`0` 表示永不超时。
     * @returns 一个 Promise 对象，当收到消息时，该对象将被 resolve，如果等待超时，则该对象将被 reject。
     */
  }, {
    key: "wait",
    value: function wait() {
      var _this = this;
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return new Promise(function (resolve, reject) {
        var slot = function slot(message) {
          _this.disconnect(slot);
          resolve(message);
        };
        _this.connect(slot);
        if (timeout > 0) {
          setTimeout(function () {
            _this.disconnect(slot);
            reject(new Error("Timeout"));
          }, timeout);
        }
      });
    }
  }]);
}();

/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudWeb_Socket: function() { return /* binding */ KittenCloudWeb_Socket; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils_web_socket_proxy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(84);
/* harmony import */ var _codemao_work_codemao_work_type__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(80);
/* harmony import */ var _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(27);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(82);
/* harmony import */ var _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(85);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(29);






function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }







var KITTEN_WEB_SOCKET_URL_PARAMS = (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])({}, _codemao_work_codemao_work_type__WEBPACK_IMPORTED_MODULE_8__.CodemaoWorkType.NEMO.symbol, {
  authorization_type: 5,
  stag: 2,
  EIO: 3,
  transport: "websocket"
}), _codemao_work_codemao_work_type__WEBPACK_IMPORTED_MODULE_8__.CodemaoWorkType.KITTEN.symbol, {
  authorization_type: 1,
  stag: 1,
  EIO: 3,
  transport: "websocket"
});
var KittenCloudWeb_Socket = /*#__PURE__*/function () {
  function KittenCloudWeb_Socket(argument) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, KittenCloudWeb_Socket);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(this, "autoReconnect", true);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(this, "autoReconnectIntervalTime", 8000);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(this, "isOpened", false);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(this, "socketResolve", _utils_other__WEBPACK_IMPORTED_MODULE_12__.None);
    this.manage = argument instanceof _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_9__.CodemaoWork;
    this.sended = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    this.opened = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    this.disconnected = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    this.received = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    this.errored = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    this.closed = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    this.pingHandlerArray = [];
    if (argument instanceof _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_9__.CodemaoWork) {
      this.work = argument;
    } else {
      var _URL$searchParams$get;
      this.work = new _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_9__.CodemaoWork({
        id: parseInt((_URL$searchParams$get = new URL(argument.url).searchParams.get("session_id")) !== null && _URL$searchParams$get !== void 0 ? _URL$searchParams$get : "0")
      });
    }
    this.setSocket(argument);
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudWeb_Socket, [{
    key: "changeWeb_Socket",
    value: function changeWeb_Socket(argument) {
      this.setSocket(argument);
    }
  }, {
    key: "setSocket",
    value: function setSocket(argument) {
      var _this = this;
      this.socket = this.getSocket(argument);
      if (this.socketResolve != _utils_other__WEBPACK_IMPORTED_MODULE_12__.None) {
        this.socketResolve(this.socket);
        this.socketResolve = _utils_other__WEBPACK_IMPORTED_MODULE_12__.None;
      }
      this.socket.then(function (socket) {
        socket.sended.connect(function (message) {
          _this.sended.emit(message);
        });
        socket.received.connect(function (message) {
          _this.handleReceived(message.data);
        });
        socket.errored.connect(function (error) {
          _this.errored.emit(error);
        });
        socket.closed.connect(function (event) {
          _this.handleClose(event);
        });
      });
    }
  }, {
    key: "getSocket",
    value: function () {
      var _getSocket = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6___default().mark(function _callee2(argument) {
        var url, socket;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(argument instanceof _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_9__.CodemaoWork)) {
                _context2.next = 8;
                break;
              }
              _context2.next = 3;
              return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6___default().mark(function _callee() {
                var scheme, host, port, path, particularParams, params;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_6___default().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      scheme = window.location.protocol == "https:" ? "wss" : "ws";
                      host = ["socketcv", "codemao", "cn"].join(".");
                      port = 9096;
                      path = "/cloudstorage/";
                      _context.next = 6;
                      return argument.info.type;
                    case 6:
                      _context.t0 = _context.sent.symbol;
                      particularParams = KITTEN_WEB_SOCKET_URL_PARAMS[_context.t0];
                      if (!(particularParams == _utils_other__WEBPACK_IMPORTED_MODULE_12__.None)) {
                        _context.next = 16;
                        break;
                      }
                      _context.t1 = Error;
                      _context.t2 = "\u4E0D\u652F\u6301\u7684\u4F5C\u54C1\u7C7B\u578B: ";
                      _context.next = 13;
                      return argument.info.type;
                    case 13:
                      _context.t3 = _context.sent.name;
                      _context.t4 = _context.t2.concat.call(_context.t2, _context.t3);
                      throw new _context.t1(_context.t4);
                    case 16:
                      _context.t5 = "session_id=";
                      _context.next = 19;
                      return argument.info.id;
                    case 19:
                      _context.t6 = _context.sent;
                      params = _context.t5.concat.call(_context.t5, _context.t6, "&").concat(Object.entries(particularParams).map(function (_ref2) {
                        var _ref3 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref2, 2),
                          key = _ref3[0],
                          value = _ref3[1];
                        return "".concat(key, "=").concat(value);
                      }).join("&"));
                      return _context.abrupt("return", "".concat(scheme, "://").concat(host, ":").concat(port).concat(path, "?").concat(params));
                    case 22:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }))();
            case 3:
              url = _context2.sent;
              socket = new _utils_web_socket_proxy__WEBPACK_IMPORTED_MODULE_7__.Web_SocketProxy(url);
              return _context2.abrupt("return", socket);
            case 8:
              if (!(argument instanceof new Function("return " + ["Web", "Socket"].join(""))())) {
                _context2.next = 12;
                break;
              }
              return _context2.abrupt("return", new _utils_web_socket_proxy__WEBPACK_IMPORTED_MODULE_7__.Web_SocketProxy(argument));
            case 12:
              return _context2.abrupt("return", argument);
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function getSocket(_x) {
        return _getSocket.apply(this, arguments);
      }
      return getSocket;
    }()
  }, {
    key: "handleReceived",
    value: function handleReceived(message) {
      try {
        var _exec$, _exec;
        var type = parseInt((_exec$ = (_exec = /^[0-9]+/.exec(message)) === null || _exec === void 0 ? void 0 : _exec[0]) !== null && _exec$ !== void 0 ? _exec$ : "-1");
        var data = message.length == type.toString().length ? _utils_other__WEBPACK_IMPORTED_MODULE_12__.None : JSON.parse(message.slice(type.toString().length));
        if (!this.manage && type != _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.MESSAGE) {
          return;
        }
        switch (type) {
          case _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.UPGRADE:
            if (data == _utils_other__WEBPACK_IMPORTED_MODULE_12__.None) {
              throw new Error("升级数据为空");
            }
            if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(data) != "object" || !("pingInterval" in data) || !("pingTimeout" in data) || typeof data.pingInterval != "number" || typeof data.pingTimeout != "number") {
              throw new Error("无法识别的升级数据格式");
            }
            this.startPing(data.pingInterval, data.pingTimeout);
            break;
          case _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.ERROR:
            this.handleServerError();
            break;
          case _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.PONG:
            clearTimeout(this.pingHandlerArray.shift());
            break;
          case _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.CONNECT:
            this.opened.emit();
            break;
          case _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.CLOSE:
            this.handleServerClose();
            break;
          case _kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.MESSAGE:
            if (data == _utils_other__WEBPACK_IMPORTED_MODULE_12__.None) {
              throw new Error("消息数据为空");
            }
            if (!Array.isArray(data) || data.length != 2 || typeof data[0] != "string") {
              throw new Error("无法识别的消息格式");
            }
            if (typeof data[1] == "string") {
              try {
                data[1] = JSON.parse(data[1]);
              } catch (error) {}
            }
            this.received.emit(data);
            break;
          default:
            throw new Error("\u672A\u77E5\u6D88\u606F\u7C7B\u578B: ".concat(type));
        }
      } catch (error) {
        this.errored.emit(error);
      }
    }
  }, {
    key: "startPing",
    value: function startPing(interval, timeout) {
      var _this2 = this;
      if (this.pingHandler != _utils_other__WEBPACK_IMPORTED_MODULE_12__.None) {
        this.stopPing();
      }
      this.pingHandlerArray = [];
      this.pingHandler = setInterval(function () {
        _this2.socket.then(function (socket) {
          socket.send(_kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.PING.toString());
          _this2.pingHandlerArray.push(setTimeout(function () {
            _this2.clientErrorClose(new Error("保活超时"));
          }, timeout));
        });
      }, interval);
    }
  }, {
    key: "stopPing",
    value: function stopPing() {
      if (this.pingHandler != _utils_other__WEBPACK_IMPORTED_MODULE_12__.None) {
        clearInterval(this.pingHandler);
      }
      var _iterator = _createForOfIteratorHelper(this.pingHandlerArray),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var timeout = _step.value;
          clearTimeout(timeout);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "send",
    value: function send(message) {
      var _this3 = this;
      this.socket.then(function (socket) {
        if (typeof message != "string") {
          message = JSON.stringify(message);
        }
        socket.send("".concat(_kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.MESSAGE.toString()).concat(message));
      }).catch(function (reason) {
        _this3.errored.emit(reason);
      });
    }
  }, {
    key: "handleClose",
    value: function handleClose(event) {
      var _this4 = this;
      this.disconnected.emit();
      if (!this.autoReconnect) {
        this.closed.emit(event);
        return;
      }
      if (this.isOpened) {
        this.isOpened = false;
        if (this.manage) {
          var url;
          this.socket.then(function (socket) {
            url = socket.url;
          });
          this.socket = new Promise(function (resolve) {
            setTimeout(function () {
              _this4.socketResolve = resolve;
              _this4.setSocket(new _utils_web_socket_proxy__WEBPACK_IMPORTED_MODULE_7__.Web_SocketProxy(url));
            }, _this4.autoReconnectIntervalTime);
          });
        } else {
          this.socket = new Promise(function (resolve, reject) {
            _this4.socketResolve = resolve;
            setTimeout(function () {
              _this4.closed.emit(event);
              reject(new Error("重连等待超时"));
            });
          });
        }
      }
    }
  }, {
    key: "handleServerError",
    value: function handleServerError() {
      this.errored.emit(new Error("服务器错误"));
      this.socket.then(function (socket) {
        try {
          socket.close();
        } catch (error) {}
      });
    }
  }, {
    key: "clientErrorClose",
    value: function clientErrorClose(error) {
      this.errored.emit(error);
      this.socket.then(function (socket) {
        socket.send(_kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.ERROR.toString());
        socket.close();
      });
    }
  }, {
    key: "handleServerClose",
    value: function handleServerClose() {
      this.socket.then(function (socket) {
        try {
          socket.close();
        } catch (error) {}
      });
    }
  }, {
    key: "close",
    value: function close() {
      var _this5 = this;
      this.socket.then(function (socket) {
        socket.send(_kitten_cloud_web_socket_message_type__WEBPACK_IMPORTED_MODULE_11__.KittenCloudWeb_SocketMessageType.CLOSE.toString());
        _this5.isOpened = false;
        socket.close();
      }).catch(function (reason) {
        _this5.errored.emit(reason);
      });
    }
  }]);
}();

/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Web_SocketProxy: function() { return /* binding */ Web_SocketProxy; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _signal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(82);



var Web_SocketProxy = /*#__PURE__*/function () {
  function Web_SocketProxy(argument) {
    var _this$socket$onopen,
      _this$socket$onmessag,
      _this$socket$onerror,
      _this$socket$onclose,
      _this = this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Web_SocketProxy);
    var Web_Socket = new Function("return " + ["Web", "Socket"].join(""))();
    if (typeof argument == "string" || argument instanceof URL) {
      this.url = argument.toString();
      this.socket = new Web_Socket(this.url);
    } else {
      this.url = argument.url;
      this.socket = argument;
    }
    this.sended = new _signal__WEBPACK_IMPORTED_MODULE_2__.Signal();
    this.opened = new _signal__WEBPACK_IMPORTED_MODULE_2__.Signal();
    this.received = new _signal__WEBPACK_IMPORTED_MODULE_2__.Signal();
    this.errored = new _signal__WEBPACK_IMPORTED_MODULE_2__.Signal();
    this.closed = new _signal__WEBPACK_IMPORTED_MODULE_2__.Signal();
    var originalSend = this.socket.send;
    var originalOnOpen = (_this$socket$onopen = this.socket.onopen) !== null && _this$socket$onopen !== void 0 ? _this$socket$onopen : function () {};
    var originalOnMessage = (_this$socket$onmessag = this.socket.onmessage) !== null && _this$socket$onmessag !== void 0 ? _this$socket$onmessag : function () {};
    var originalOnError = (_this$socket$onerror = this.socket.onerror) !== null && _this$socket$onerror !== void 0 ? _this$socket$onerror : function () {};
    var originalOnClose = (_this$socket$onclose = this.socket.onclose) !== null && _this$socket$onclose !== void 0 ? _this$socket$onclose : function () {};
    this.socket.send = function (message) {
      originalSend.call(_this.socket, message);
      _this.sended.emit(message);
    };
    this.socket.onopen = function (event) {
      originalOnOpen.call(_this.socket, event);
      _this.opened.emit(event);
    };
    this.socket.onmessage = function (event) {
      originalOnMessage.call(_this.socket, event);
      _this.received.emit(event);
    };
    this.socket.onerror = function (event) {
      originalOnError.call(_this.socket, event);
      _this.errored.emit(event);
    };
    this.socket.onclose = function (event) {
      originalOnClose.call(_this.socket, event);
      _this.closed.emit(event);
    };
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Web_SocketProxy, [{
    key: "send",
    value: function send(message) {
      this.socket.send(message);
    }
  }, {
    key: "close",
    value: function close() {
      this.socket.close();
    }
  }]);
}();

/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudWeb_SocketMessageType: function() { return /* binding */ KittenCloudWeb_SocketMessageType; }
/* harmony export */ });
var KittenCloudWeb_SocketMessageType = /*#__PURE__*/function (KittenCloudWeb_SocketMessageType) {
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["UPGRADE"] = 0] = "UPGRADE";
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["ERROR"] = 1] = "ERROR";
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["PING"] = 2] = "PING";
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["PONG"] = 3] = "PONG";
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["CONNECT"] = 40] = "CONNECT";
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["CLOSE"] = 41] = "CLOSE";
  KittenCloudWeb_SocketMessageType[KittenCloudWeb_SocketMessageType["MESSAGE"] = 42] = "MESSAGE";
  return KittenCloudWeb_SocketMessageType;
}({});

/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudFunctionConfigLayer: function() { return /* binding */ KittenCloudFunctionConfigLayer; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);
/* harmony import */ var _utils_single_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(87);




/**
 * 源码云功能的配置层，用于管理源码云功能的配置项。
 */
var KittenCloudFunctionConfigLayer = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(
/**
 * 本地预更新。
 *
 * 在没有开启本地预更新时，每次在本地执行数据更新操作时，都会等到该操作同步到云端并收到来自服务器的反馈后再更新本地的数据，这与普通的变量在修改后立即更新其值并不相同。
 *
 * 开启本地预更新后，本地执行数据更新操作时，会假定该操作同步到云端之前没有其它用户对该数据进行操作，并基于此提前更新本地的数据，如果假定不成立，则会修正本地数据。具体而言，本地执行数据更新操作时，会立即更新本地的数据，如果在当前操作被同步到云端之前收到了来自服务器的反馈的其它更新数据，则会撤销本地对数据的更改，并执行来自云端的更改，最后再执行本地对数据的更改。
 *
 * 默认值：对于云变量开启，对于云列表关闭。
 */

/**
 * 缓存时间（毫秒），填 `false` 表示绝对关闭。
 *
 * 默认值：`0`
 */

/**
 * 上传间隔时间（毫秒），填 `false` 表示绝对关闭。
 *
 * 默认值：对于私有云变量为 `1500`，对于其它为 `0`。
 *
 * @warning 私有云变量的上传间隔时间必须不少于 1500 毫秒。
 */

/**
 * 字符串长度限制，字符串量的长度不能超过此限制，超出部分会被丢弃。
 *
 * 默认值：`1024`。
 *
 * @warning 字符串长度限制必须不大于 1024.
 */

/**
 * 列表长度限制，列表的长度不能超过此限制，超出部分会被丢弃。
 *
 * 默认值：1000。
 *
 * @warning 列表长度限制必须不大于 1000
 */

function KittenCloudFunctionConfigLayer() {
  var _ref2, _upper$localPreupdate, _ref3, _upper$cacheTime, _ref4, _upper$uploadInterval, _ref5, _upper$stringLengthLi, _ref6, _upper$listLengthLimi;
  var upper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _utils_other__WEBPACK_IMPORTED_MODULE_2__.None;
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    localPreupdate = _ref.localPreupdate,
    cacheTime = _ref.cacheTime,
    updateIntervalTime = _ref.updateIntervalTime,
    stringLengthLimit = _ref.stringLengthLimit,
    listLengthLimit = _ref.listLengthLimit;
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudFunctionConfigLayer);
  this.localPreupdate = new _utils_single_config__WEBPACK_IMPORTED_MODULE_3__.SingleConfig((_ref2 = (_upper$localPreupdate = upper === null || upper === void 0 ? void 0 : upper.localPreupdate) !== null && _upper$localPreupdate !== void 0 ? _upper$localPreupdate : localPreupdate) !== null && _ref2 !== void 0 ? _ref2 : true, localPreupdate);
  this.cacheTime = new _utils_single_config__WEBPACK_IMPORTED_MODULE_3__.SingleConfig((_ref3 = (_upper$cacheTime = upper === null || upper === void 0 ? void 0 : upper.cacheTime) !== null && _upper$cacheTime !== void 0 ? _upper$cacheTime : cacheTime) !== null && _ref3 !== void 0 ? _ref3 : 0, cacheTime);
  this.uploadIntervalTime = new _utils_single_config__WEBPACK_IMPORTED_MODULE_3__.SingleConfig((_ref4 = (_upper$uploadInterval = upper === null || upper === void 0 ? void 0 : upper.uploadIntervalTime) !== null && _upper$uploadInterval !== void 0 ? _upper$uploadInterval : updateIntervalTime) !== null && _ref4 !== void 0 ? _ref4 : 0, updateIntervalTime);
  this.stringLengthLimit = new _utils_single_config__WEBPACK_IMPORTED_MODULE_3__.SingleConfig((_ref5 = (_upper$stringLengthLi = upper === null || upper === void 0 ? void 0 : upper.stringLengthLimit) !== null && _upper$stringLengthLi !== void 0 ? _upper$stringLengthLi : stringLengthLimit) !== null && _ref5 !== void 0 ? _ref5 : 1024, stringLengthLimit);
  this.listLengthLimit = new _utils_single_config__WEBPACK_IMPORTED_MODULE_3__.SingleConfig((_ref6 = (_upper$listLengthLimi = upper === null || upper === void 0 ? void 0 : upper.listLengthLimit) !== null && _upper$listLengthLimi !== void 0 ? _upper$listLengthLimi : listLengthLimit) !== null && _ref6 !== void 0 ? _ref6 : 1000, listLengthLimit);
});

/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SingleConfig: function() { return /* binding */ SingleConfig; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);
/* harmony import */ var _other__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(29);
/* harmony import */ var _signal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(82);





var SingleConfig = /*#__PURE__*/function () {
  function SingleConfig(upper, value) {
    var _this = this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, SingleConfig);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "changed", new _signal__WEBPACK_IMPORTED_MODULE_4__.Signal());
    this.upper = upper;
    this.store = value;
    if (upper instanceof SingleConfig) {
      upper.changed.connect(function (change) {
        if (_this.store == _other__WEBPACK_IMPORTED_MODULE_3__.None) {
          _this.changed.emit(change);
        }
      });
    }
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(SingleConfig, [{
    key: "config",
    get: function get() {
      return this.store;
    },
    set: function set(value) {
      var originalValue = this.value;
      this.store = value;
      var newValue = this.value;
      if (originalValue != value) {
        this.changed.emit({
          originalValue: originalValue,
          newValue: newValue
        });
      }
    }
  }, {
    key: "value",
    get: function get() {
      if (this.store != _other__WEBPACK_IMPORTED_MODULE_3__.None) {
        return this.store;
      }
      if (this.upper instanceof SingleConfig) {
        return this.upper.value;
      }
      return this.upper;
    },
    set: function set(value) {
      this.config = value;
    }
  }]);
}();

/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudPublicVariableGroup: function() { return /* binding */ KittenCloudPublicVariableGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(29);
/* harmony import */ var _network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(89);
/* harmony import */ var _kitten_cloud_public_variable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(90);
/* harmony import */ var _update_command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(95);
/* harmony import */ var _update_command_kitten_cloud_public_variable_set_command__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(98);
/* harmony import */ var _update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_variable_group__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(102);







function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }







var KittenCloudPublicVariableGroup = /*#__PURE__*/function (_KittenCloudVariableG) {
  function KittenCloudPublicVariableGroup() {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudPublicVariableGroup);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, KittenCloudPublicVariableGroup, [].concat(args));
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "dataTypeName", "公有云变量");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "dataUpdateSendMessageType", _network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__.KittenCloudSendMessageType.UPDATE_PUBLIC_VARIABLE);
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudPublicVariableGroup, _KittenCloudVariableG);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudPublicVariableGroup, [{
    key: "createData",
    value: function createData(cvid, name, value) {
      return new _kitten_cloud_public_variable__WEBPACK_IMPORTED_MODULE_9__.KittenCloudPublicVariable(this.connection, this, cvid, name, value);
    }
  }, {
    key: "toUploadMessage",
    value: function toUploadMessage(message) {
      if (message == "fail") {
        throw new Error("更新失败");
      }
      if (!Array.isArray(message)) {
        throw new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(message));
      }
      var errorArray = [];
      var result = {};
      var _iterator = _createForOfIteratorHelper(message),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var singleMessage = _step.value;
          if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(singleMessage) != "object") {
            errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(message)));
            continue;
          }
          var data = this.dataMap.get(singleMessage.cvid);
          if (data == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
            errorArray.push(new Error("\u627E\u4E0D\u5230 cvid \u4E3A ".concat(singleMessage.cvid, " \u7684\u516C\u6709\u4E91\u53D8\u91CF")));
            continue;
          }
          result[singleMessage.cvid] = new _update_command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_10__.KittenCloudDataUpdateCommandGroup([new _update_command_kitten_cloud_public_variable_set_command__WEBPACK_IMPORTED_MODULE_11__.KittenCloudPublicVariableSetCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_12__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.value)]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (errorArray.length != 0) {
        Object.assign(errorArray, {
          message: result
        });
        throw errorArray;
      }
      return result;
    }
  }]);
}(_kitten_cloud_variable_group__WEBPACK_IMPORTED_MODULE_13__.KittenCloudVariableGroup);

/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudSendMessageType: function() { return /* binding */ KittenCloudSendMessageType; }
/* harmony export */ });
var KittenCloudSendMessageType = /*#__PURE__*/function (KittenCloudSendMessageType) {
  KittenCloudSendMessageType["JOIN"] = "join";
  KittenCloudSendMessageType["GET_ALL_DATA"] = "list_variables";
  KittenCloudSendMessageType["UPDATE_PRIVATE_VARIABLE"] = "update_private_vars";
  KittenCloudSendMessageType["GET_PRIVATE_VARIABLE_RANKING_LIST"] = "list_ranking";
  KittenCloudSendMessageType["UPDATE_PUBLIC_VARIABLE"] = "update_vars";
  KittenCloudSendMessageType["UPDATE_LIST"] = "update_lists";
  return KittenCloudSendMessageType;
}({});

/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudPublicVariable: function() { return /* binding */ KittenCloudPublicVariable; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_variable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(91);
/* harmony import */ var _update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(94);
/* harmony import */ var _update_command_kitten_cloud_public_variable_set_command__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(98);





function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



/**
 * 公有云变量。
 */
var KittenCloudPublicVariable = /*#__PURE__*/function (_KittenCloudVariable) {
  function KittenCloudPublicVariable(connection, group, cvid, name, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudPublicVariable);
    _this = _callSuper(this, KittenCloudPublicVariable, [connection, group, cvid, name, value]);
    _this.group = group;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudPublicVariable, _KittenCloudVariable);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudPublicVariable, [{
    key: "update",
    value: function update(value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_public_variable_set_command__WEBPACK_IMPORTED_MODULE_7__.KittenCloudPublicVariableSetCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_6__.KittenCloudDataUpdateSource.CLOUD, this, value));
    }

    /**
     * 设置公有云变量的值。
     *
     * @param value 要设置的值
     */
  }, {
    key: "set",
    value: function set(value) {
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_public_variable_set_command__WEBPACK_IMPORTED_MODULE_7__.KittenCloudPublicVariableSetCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_6__.KittenCloudDataUpdateSource.LOCAL, this, value));
    }
  }]);
}(_kitten_cloud_variable__WEBPACK_IMPORTED_MODULE_5__.KittenCloudVariable);

/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudVariable: function() { return /* binding */ KittenCloudVariable; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(82);
/* harmony import */ var _kitten_cloud_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(92);





function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



/**
 * 云变量的值的类型。
 */

/**
 * 云变量变化消息的类型，当云变量的值被改变时会收到此消息，详见{@link KittenCloudVariable.changed}。
 */

/**
 * 云变量
 */
var KittenCloudVariable = /*#__PURE__*/function (_KittenCloudData) {
  /**
   * 云变量的值改变信号，当云变量的值发生改变时触发此信号。
   *
   * 变化消息类型详见{@link KittenCloudVariableChangeMessage}。
   */

  function KittenCloudVariable(connection, group, cvid, name, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudVariable);
    _this = _callSuper(this, KittenCloudVariable, [connection, group, cvid, name]);
    _this.group = group;
    _this.value = value;
    _this.changed = new _utils_signal__WEBPACK_IMPORTED_MODULE_5__.Signal();
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudVariable, _KittenCloudData);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudVariable, [{
    key: "get",
    value:
    /**
     * 获取云变量的值。
     *
     * @returns 云变量的值
     */
    function get() {
      return this.value;
    }
  }]);
}(_kitten_cloud_data__WEBPACK_IMPORTED_MODULE_6__.KittenCloudData);

/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudData: function() { return /* binding */ KittenCloudData; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_function_config_layer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(86);
/* harmony import */ var _update_kitten_cloud_data_update_manager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(93);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



/**
 * 云数据。
 */
var KittenCloudData = /*#__PURE__*/function (_KittenCloudFunctionC) {
  function KittenCloudData(connection, group, cvid, name) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudData);
    _this = _callSuper(this, KittenCloudData, [group]);
    _this.connection = connection;
    _this.group = group;
    _this.cvid = cvid;
    _this.name = name;
    _this.updateManager = new _update_kitten_cloud_data_update_manager__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateManager(connection, _this);
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudData, _KittenCloudFunctionC);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudData, [{
    key: "singleValueProcess",
    value: function singleValueProcess(value) {
      if (typeof value == "number") {
        return value;
      }
      if (typeof value != "string") {
        throw new Error("\u4E0D\u652F\u6301\u7684\u503C\u7C7B\u578B\uFF1A".concat((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(value)));
      }
      var stringValue = value;
      if (stringValue.length > this.stringLengthLimit.value) {
        stringValue = stringValue.slice(0, this.stringLengthLimit.value);
      }
      return stringValue;
    }
  }]);
}(_kitten_cloud_function_config_layer__WEBPACK_IMPORTED_MODULE_6__.KittenCloudFunctionConfigLayer);

/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudDataUpdateManager: function() { return /* binding */ KittenCloudDataUpdateManager; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(82);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(94);
/* harmony import */ var _command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);



function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }




function configValueToNumber(value) {
  if (typeof value == "boolean") {
    return 0;
  }
  return value;
}
var KittenCloudDataUpdateManager = /*#__PURE__*/function () {
  function KittenCloudDataUpdateManager(connection, data) {
    var _this = this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudDataUpdateManager);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "firstUnuploadedUpdateTime", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "lastUploadTime", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "uploadHandle", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(this, "pauseUpdate", false);
    this.connection = connection;
    this.data = data;
    this.unuploadedUpdateCommand = new _command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataUpdateCommandGroup();
    this.uploadingUpdateCommand = new _command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataUpdateCommandGroup();
    this.neededToUpload = new _utils_signal__WEBPACK_IMPORTED_MODULE_3__.Signal();
    this.data.cacheTime.changed.connect(function () {
      _this.setUploadHandle();
    });
    this.data.uploadIntervalTime.changed.connect(function () {
      _this.setUploadHandle();
    });
    this.data.localPreupdate.changed.connect(function (_ref) {
      var LocalPreupdate = _ref.newValue;
      _this.withPauseUpdate(function () {
        if (LocalPreupdate) {
          _this.unuploadedUpdateCommand.execute();
        } else {
          _this.unuploadedUpdateCommand.revoke();
        }
      });
    });
    this.pausedUpdateCommandArray = [];
    this.connection.opened.connect(function () {
      _this.setUploadHandle();
    });
    this.connection.disconnected.connect(function () {
      if (_this.uploadHandle != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        clearTimeout(_this.uploadHandle);
        _this.uploadHandle = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
      }
      _this.uploadingUpdateCommand = new _command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataUpdateCommandGroup();
    });
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudDataUpdateManager, [{
    key: "withPauseUpdate",
    value: function withPauseUpdate(func) {
      this.pauseUpdate = true;
      func();
      this.pauseUpdate = false;
      var _iterator = _createForOfIteratorHelper(this.pausedUpdateCommandArray),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var command = _step.value;
          this.handleNewUpdateCommand(command);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.pausedUpdateCommandArray = [];
    }
  }, {
    key: "addUpdateCommand",
    value: function addUpdateCommand(command) {
      if (this.pauseUpdate) {
        this.pausedUpdateCommandArray.push(command);
        return;
      }
      this.handleNewUpdateCommand(command);
    }
  }, {
    key: "handleUploadingSuccess",
    value: function handleUploadingSuccess() {
      var firstUpdateCommand = this.uploadingUpdateCommand.shift();
      if (firstUpdateCommand != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None && !this.data.localPreupdate.value) {
        firstUpdateCommand.execute();
      }
    }
  }, {
    key: "handleUploadingError",
    value: function handleUploadingError() {
      var firstUpdateCommand = this.uploadingUpdateCommand.shift();
      if (firstUpdateCommand != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None && this.data.localPreupdate.value) {
        firstUpdateCommand.revoke();
      }
    }
  }, {
    key: "handleNewUpdateCommand",
    value: function handleNewUpdateCommand(command) {
      var _this2 = this;
      this.withPauseUpdate(function () {
        switch (command.source) {
          case _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_4__.KittenCloudDataUpdateSource.LOCAL:
            if (!command.isLegal()) {
              return;
            }
            if (_this2.data.localPreupdate.value) {
              if (!command.isEffective()) {
                return;
              }
              command.execute();
            }
            _this2.unuploadedUpdateCommand.add(command);
            if (_this2.data.localPreupdate.value) {
              _this2.unuploadedUpdateCommand.removeBackIneffective();
            }
            if (_this2.firstUnuploadedUpdateTime == 0) {
              _this2.firstUnuploadedUpdateTime = Date.now();
              _this2.setUploadHandle();
            }
            if (_this2.unuploadedUpdateCommand.isEmpty() && _this2.firstUnuploadedUpdateTime != 0) {
              _this2.firstUnuploadedUpdateTime = 0;
              if (_this2.uploadHandle != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
                clearTimeout(_this2.uploadHandle);
              }
            }
            break;
          case _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_4__.KittenCloudDataUpdateSource.CLOUD:
            var firstUploadingCommand = _this2.uploadingUpdateCommand.first();
            if (firstUploadingCommand == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
              command.execute();
            } else if ((0,_utils_other__WEBPACK_IMPORTED_MODULE_6__.equal)(command.toJSON(), firstUploadingCommand.toJSON())) {
              _this2.uploadingUpdateCommand.shift();
              if (!_this2.data.localPreupdate.value) {
                firstUploadingCommand.execute();
                _this2.uploadingUpdateCommand.removeFrontIneffective();
              }
            } else {
              if (_this2.data.localPreupdate.value) {
                _this2.unuploadedUpdateCommand.revoke();
                _this2.uploadingUpdateCommand.revoke();
                command.execute();
                _this2.uploadingUpdateCommand.execute();
                _this2.uploadingUpdateCommand.removeBackIneffective();
                _this2.unuploadedUpdateCommand.revoke();
                _this2.unuploadedUpdateCommand.removeBackIneffective();
              } else {
                command.execute();
              }
            }
            break;
        }
      });
    }
  }, {
    key: "setUploadHandle",
    value: function setUploadHandle() {
      var _this3 = this;
      if (this.uploadHandle != null) {
        clearTimeout(this.uploadHandle);
      }
      if (this.firstUnuploadedUpdateTime == 0) {
        return;
      }
      var cacheTime = this.data.cacheTime.value;
      var uploadIntervalTime = this.data.uploadIntervalTime.value;
      var now = Date.now();
      var cacheNow = this.firstUnuploadedUpdateTime + configValueToNumber(cacheTime);
      var uploadIntervalNow = this.lastUploadTime + configValueToNumber(uploadIntervalTime);
      if (cacheTime === false && uploadIntervalTime === false) {
        this.neededToUpload.emit();
      } else if (cacheTime === false && uploadIntervalNow < now) {
        this.neededToUpload.emit();
      } else if (uploadIntervalTime === false && cacheNow < now) {
        this.neededToUpload.emit();
      } else {
        this.uploadHandle = setTimeout(function () {
          _this3.neededToUpload.emit();
        }, Math.max(cacheNow, uploadIntervalNow) - now);
      }
    }
  }, {
    key: "upload",
    value: function upload() {
      if (this.uploadHandle != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        clearTimeout(this.uploadHandle);
        this.uploadHandle = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
      }
      this.firstUnuploadedUpdateTime = 0;
      this.lastUploadTime = Date.now();
      var command = this.unuploadedUpdateCommand;
      this.unuploadedUpdateCommand = new _command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataUpdateCommandGroup();
      this.uploadingUpdateCommand.addAll(command);
      return command;
    }
  }]);
}();

/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudDataUpdateSource: function() { return /* binding */ KittenCloudDataUpdateSource; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);



var _KittenCloudDataUpdateSource;
/** 更新来源。*/var KittenCloudDataUpdateSource = /*#__PURE__*/function () {
  /** 更新来源名称。*/
  /** 更新来源符号。*/

  function KittenCloudDataUpdateSource(name) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudDataUpdateSource);
    this.name = name;
    this.symbol = Symbol(name);
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudDataUpdateSource, [{
    key: "toString",
    value: function toString() {
      return this.name;
    }
  }]);
}();
_KittenCloudDataUpdateSource = KittenCloudDataUpdateSource;
/** 更新来源于本地。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudDataUpdateSource, "LOCAL", new _KittenCloudDataUpdateSource("本地"));
/** 更新来源于云端。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudDataUpdateSource, "CLOUD", new _KittenCloudDataUpdateSource("云端"));
/** 更新来源于撤销。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudDataUpdateSource, "REVOKE", new _KittenCloudDataUpdateSource("撤销"));

/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudDataUpdateCommandGroup: function() { return /* binding */ KittenCloudDataUpdateCommandGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _utils_command_revocable_command_group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(96);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);





function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }


var KittenCloudDataUpdateCommandGroup = /*#__PURE__*/function (_RevocableCommandGrou) {
  function KittenCloudDataUpdateCommandGroup() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudDataUpdateCommandGroup);
    return _callSuper(this, KittenCloudDataUpdateCommandGroup, arguments);
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudDataUpdateCommandGroup, _RevocableCommandGrou);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudDataUpdateCommandGroup, [{
    key: "removeFrontIneffective",
    value: function removeFrontIneffective() {
      var firstCommand;
      while ((firstCommand = this.first()) != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        if (firstCommand.isEffective()) {
          break;
        } else {
          this.shift();
        }
      }
    }
  }, {
    key: "removeBackIneffective",
    value: function removeBackIneffective() {
      var lastCommand;
      while ((lastCommand = this.last()) != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        if (lastCommand.isEffective()) {
          break;
        } else {
          this.pop();
        }
      }
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      var result = [];
      var _iterator = _createForOfIteratorHelper(this.commandArray),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var command = _step.value;
          if (command.isLegal()) {
            result.push(command.toCloudJSON());
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return result;
    }
  }, {
    key: "toCloudString",
    value: function toCloudString() {
      return JSON.stringify(this.toCloudJSON());
    }
  }]);
}(_utils_command_revocable_command_group__WEBPACK_IMPORTED_MODULE_5__.RevocableCommandGroup);

/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RevocableCommandGroup: function() { return /* binding */ RevocableCommandGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _command_group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(97);





function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var RevocableCommandGroup = /*#__PURE__*/function (_CommandGroup) {
  function RevocableCommandGroup() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, RevocableCommandGroup);
    return _callSuper(this, RevocableCommandGroup, arguments);
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(RevocableCommandGroup, _CommandGroup);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(RevocableCommandGroup, [{
    key: "revoke",
    value: function revoke() {
      for (var i = this.commandArray.length - 1; i >= 0; i--) {
        var _this$commandArray$i;
        (_this$commandArray$i = this.commandArray[i]) === null || _this$commandArray$i === void 0 || _this$commandArray$i.revoke();
      }
    }
  }]);
}(_command_group__WEBPACK_IMPORTED_MODULE_5__.CommandGroup);

/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandGroup: function() { return /* binding */ CommandGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _other__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);


function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

var CommandGroup = /*#__PURE__*/function () {
  function CommandGroup() {
    var commandArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, CommandGroup);
    this.commandArray = commandArray;
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(CommandGroup, [{
    key: "execute",
    value: function execute() {
      var _iterator = _createForOfIteratorHelper(this.commandArray),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var command = _step.value;
          command.execute();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this.commandArray.length;
    }
  }, {
    key: "add",
    value: function add(command) {
      var lastCommand = this.commandArray.slice(-1)[0];
      if (lastCommand != _other__WEBPACK_IMPORTED_MODULE_2__.None && "merge" in lastCommand && typeof lastCommand.merge == "function") {
        try {
          lastCommand.merge(command);
        } catch (error) {
          this.commandArray.push(command);
        }
      } else {
        this.commandArray.push(command);
      }
    }
  }, {
    key: "addAll",
    value: function addAll(commands) {
      if (commands instanceof CommandGroup) {
        commands = commands.commandArray;
      }
      var _iterator2 = _createForOfIteratorHelper(commands),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var command = _step2.value;
          this.add(command);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.commandArray.length == 0;
    }
  }, {
    key: "first",
    value: function first() {
      return this.commandArray[0];
    }
  }, {
    key: "last",
    value: function last() {
      return this.commandArray.slice(-1)[0];
    }
  }, {
    key: "shift",
    value: function shift() {
      return this.commandArray.shift();
    }
  }, {
    key: "pop",
    value: function pop() {
      return this.commandArray.pop();
    }
  }]);
}();

/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudPublicVariableSetCommand: function() { return /* binding */ KittenCloudPublicVariableSetCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_variable_set_command__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(99);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var KittenCloudPublicVariableSetCommand = /*#__PURE__*/function (_KittenCloudVariableS) {
  function KittenCloudPublicVariableSetCommand() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudPublicVariableSetCommand);
    return _callSuper(this, KittenCloudPublicVariableSetCommand, arguments);
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudPublicVariableSetCommand, _KittenCloudVariableS);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudPublicVariableSetCommand, [{
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "set",
        cvid: this.variable.cvid,
        value: this.value,
        param_type: (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(this.value)
      };
    }
  }]);
}(_kitten_cloud_variable_set_command__WEBPACK_IMPORTED_MODULE_6__.KittenCloudVariableSetCommand);

/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudVariableSetCommand: function() { return /* binding */ KittenCloudVariableSetCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_variable_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(100);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudVariableSetCommand = /*#__PURE__*/function (_KittenCloudVariableU) {
  function KittenCloudVariableSetCommand(source, variable, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudVariableSetCommand);
    _this = _callSuper(this, KittenCloudVariableSetCommand, [source, variable]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "backup", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    _this.value = value;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudVariableSetCommand, _KittenCloudVariableU);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudVariableSetCommand, [{
    key: "execute",
    value: function execute() {
      if (this.backup != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("\u65E0\u6CD5\u6267\u884C\u547D\u4EE4\uFF1A\u547D\u4EE4\u5DF2\u88AB\u6267\u884C\uFF0C\u4E0D\u80FD\u91CD\u590D\u6267\u884C");
      }
      this.backup = this.variable.value;
      this.variable.value = this.value;
      this.variable.changed.emit({
        source: this.source,
        originalValue: this.backup,
        newValue: this.value
      });
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.backup == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("\u65E0\u6CD5\u64A4\u9500\u547D\u4EE4\uFF1A\u547D\u4EE4\u5C1A\u672A\u6267\u884C");
      }
      this.variable.value = this.backup;
      this.variable.changed.emit({
        source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
        originalValue: this.value,
        newValue: this.backup
      });
      this.backup = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return this.backup == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None ? this.value !== this.variable.value : this.value !== this.backup;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "set",
        value: this.value
      };
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return true;
    }
  }, {
    key: "merge",
    value: function merge(that) {
      if (this.backup == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None != (that.backup == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None)) {
        throw new Error("命令执行状态不一致，不能合并");
      }
      this.value = that.value;
    }
  }]);
}(_kitten_cloud_variable_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudVariableUpdateCommand);

/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudVariableUpdateCommand: function() { return /* binding */ KittenCloudVariableUpdateCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_data_update_command__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(101);





function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var KittenCloudVariableUpdateCommand = /*#__PURE__*/function (_KittenCloudDataUpdat) {
  function KittenCloudVariableUpdateCommand(source, variable) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudVariableUpdateCommand);
    _this = _callSuper(this, KittenCloudVariableUpdateCommand, [source, variable]);
    _this.variable = variable;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudVariableUpdateCommand, _KittenCloudDataUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(KittenCloudVariableUpdateCommand);
}(_kitten_cloud_data_update_command__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataUpdateCommand);

/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudDataUpdateCommand: function() { return /* binding */ KittenCloudDataUpdateCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


var KittenCloudDataUpdateCommand = /*#__PURE__*/function () {
  function KittenCloudDataUpdateCommand(source, data) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudDataUpdateCommand);
    this.source = source;
    this.data = data;
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudDataUpdateCommand, [{
    key: "toCloudString",
    value: function toCloudString() {
      return JSON.stringify(this.toCloudJSON());
    }
  }]);
}();

/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudVariableGroup: function() { return /* binding */ KittenCloudVariableGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_data_group__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(103);





function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var KittenCloudVariableGroup = /*#__PURE__*/function (_KittenCloudDataGroup) {
  function KittenCloudVariableGroup(connection) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudVariableGroup);
    return _callSuper(this, KittenCloudVariableGroup, [connection, config]);
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudVariableGroup, _KittenCloudDataGroup);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudVariableGroup, [{
    key: "toCloudUploadMessage",
    value: function toCloudUploadMessage(message) {
      var result = [];
      for (var _i = 0, _Object$values = Object.values(message); _i < _Object$values.length; _i++) {
        var singleDataMessage = _Object$values[_i];
        var _iterator = _createForOfIteratorHelper(singleDataMessage.toCloudJSON()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var singleMessage = _step.value;
            result.push(singleMessage);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return result;
    }
  }]);
}(_kitten_cloud_data_group__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataGroup);

/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudDataGroup: function() { return /* binding */ KittenCloudDataGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(26);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(29);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(82);
/* harmony import */ var _kitten_cloud_function_config_layer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(86);









function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudDataGroup = /*#__PURE__*/function (_KittenCloudFunctionC) {
  function KittenCloudDataGroup(connection, config) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, KittenCloudDataGroup);
    _this = _callSuper(this, KittenCloudDataGroup, [connection, config]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "connecting", true);
    _this.connection = connection;
    _this.connected = new _utils_signal__WEBPACK_IMPORTED_MODULE_10__.Signal();
    _this.dataArray = [];
    _this.dataMap = new Map();
    _this.array = _this.dataArray;
    _this.uploadCount = [];
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__["default"])(KittenCloudDataGroup, _KittenCloudFunctionC);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(KittenCloudDataGroup, [{
    key: "update",
    value: function update(data) {
      var _this2 = this;
      this.connecting = false;
      var _iterator = _createForOfIteratorHelper(data),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          var _data = this.dataMap.get(item.cvid);
          if (_data == null) {
            var newData = this.createData(item.cvid, item.name, item.value);
            this.dataArray.push(newData);
            this.dataMap.set(item.name, newData);
            this.dataMap.set(item.cvid, newData);
            newData.updateManager.neededToUpload.connect(function () {
              _this2.handleUpload();
            });
          } else {
            _data.update(item.value);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.connected.emit();
    }
  }, {
    key: "get",
    value: function () {
      var _get = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().mark(function _callee(index) {
        var data;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!this.connecting) {
                _context.next = 3;
                break;
              }
              _context.next = 3;
              return this.connected.wait();
            case 3:
              data = this.dataMap.get(index);
              if (!(data == null)) {
                _context.next = 6;
                break;
              }
              throw new Error("\u83B7\u53D6".concat(this.dataTypeName, "\u5931\u8D25\uFF1A").concat(this.dataTypeName, " ").concat(index, " \u4E0D\u5B58\u5728"));
            case 6:
              return _context.abrupt("return", data);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "getAll",
    value: function () {
      var _getAll = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_8___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.connecting) {
                _context2.next = 3;
                break;
              }
              _context2.next = 3;
              return this.connected.wait();
            case 3:
              return _context2.abrupt("return", this.dataArray);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getAll() {
        return _getAll.apply(this, arguments);
      }
      return getAll;
    }()
  }, {
    key: "handleUpload",
    value: function handleUpload() {
      var uploadCount = [];
      var uploadMessage = {};
      var _iterator2 = _createForOfIteratorHelper(this.dataArray),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var data = _step2.value;
          var singleUploadMessage = data.updateManager.upload();
          uploadMessage[data.cvid] = singleUploadMessage;
          uploadCount.push(singleUploadMessage.length);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      this.uploadCount.push(uploadCount);
      this.connection.send(this.dataUpdateSendMessageType, this.toCloudUploadMessage(uploadMessage));
    }
  }, {
    key: "handleCloudUpdate",
    value: function handleCloudUpdate(cloudMessage) {
      var errorArray = [];
      this.uploadCount.shift();
      var message;
      try {
        message = this.toUploadMessage(cloudMessage);
      } catch (error) {
        if (!Array.isArray(error)) {
          this.handleCloudUpdateError();
          var _message;
          if (error instanceof Error) {
            _message = error.message;
          } else if (typeof error == "string") {
            _message = error;
          } else {
            _message = JSON.stringify(error);
          }
          throw new Error("\u66F4\u65B0".concat(this.dataTypeName, "\u5931\u8D25\uFF1A").concat(_message));
        }
        var _iterator3 = _createForOfIteratorHelper(error),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var singleError = _step3.value;
            errorArray.push(singleError);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(error) != "object" || !("message" in error)) {
          errorArray.push(new Error("\u66F4\u65B0".concat(this.dataTypeName, "\u5931\u8D25\uFF1A\u627E\u4E0D\u5230\u66F4\u65B0\u6570\u636E")));
        }
        message = error.message;
      }
      var _iterator4 = _createForOfIteratorHelper(this.dataArray),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var data = _step4.value;
          var singleMessage = message[data.cvid];
          if (singleMessage == _utils_other__WEBPACK_IMPORTED_MODULE_9__.None) {
            continue;
          }
          var updateCommand = void 0;
          while ((updateCommand = singleMessage.shift()) != _utils_other__WEBPACK_IMPORTED_MODULE_9__.None) {
            data.updateManager.addUpdateCommand(updateCommand);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "handleCloudUpdateError",
    value: function handleCloudUpdateError() {
      var firstUploadCount = this.uploadCount.shift();
      if (firstUploadCount == _utils_other__WEBPACK_IMPORTED_MODULE_9__.None) {
        throw new Error("不存在上传数据");
      }
      for (var i = 0; i < this.dataArray.length; i++) {
        for (;;) {
          var _this$dataArray$i;
          var count = firstUploadCount[i];
          if (count == _utils_other__WEBPACK_IMPORTED_MODULE_9__.None || count <= 0) {
            break;
          }
          (_this$dataArray$i = this.dataArray[i]) === null || _this$dataArray$i === void 0 || _this$dataArray$i.updateManager.handleUploadingError();
          firstUploadCount[i] = count - 1;
        }
      }
    }
  }]);
}(_kitten_cloud_function_config_layer__WEBPACK_IMPORTED_MODULE_11__.KittenCloudFunctionConfigLayer);

/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudDataType: function() { return /* binding */ KittenCloudDataType; }
/* harmony export */ });
var KittenCloudDataType = /*#__PURE__*/function (KittenCloudDataType) {
  KittenCloudDataType[KittenCloudDataType["PRIVATE_VARIABLE"] = 0] = "PRIVATE_VARIABLE";
  KittenCloudDataType[KittenCloudDataType["PUBLIC_VARIABLE"] = 1] = "PUBLIC_VARIABLE";
  KittenCloudDataType[KittenCloudDataType["LIST"] = 2] = "LIST";
  return KittenCloudDataType;
}({});

/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudReceiveMessageType: function() { return /* binding */ KittenCloudReceiveMessageType; }
/* harmony export */ });
var KittenCloudReceiveMessageType = /*#__PURE__*/function (KittenCloudReceiveMessageType) {
  KittenCloudReceiveMessageType["JOIN"] = "connect_done";
  KittenCloudReceiveMessageType["RECEIVE_ALL_DATA"] = "list_variables_done";
  KittenCloudReceiveMessageType["UPDATE_PRIVATE_VARIABLE"] = "update_private_vars_done";
  KittenCloudReceiveMessageType["RECEIVE_PRIVATE_VARIABLE_RANKING_LIST"] = "list_ranking_done";
  KittenCloudReceiveMessageType["UPDATE_PUBLIC_VARIABLE"] = "update_vars_done";
  KittenCloudReceiveMessageType["UPDATE_LIST"] = "update_lists_done";
  KittenCloudReceiveMessageType["ILLEGAL_EVENT"] = "illegal_event_done";
  KittenCloudReceiveMessageType["UPDATE_ONLINE_USER_NUMBER"] = "online_users_change";
  return KittenCloudReceiveMessageType;
}({});

/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudPrivateVariableGroup: function() { return /* binding */ KittenCloudPrivateVariableGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(29);
/* harmony import */ var _network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(89);
/* harmony import */ var _kitten_cloud_private_variable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(107);
/* harmony import */ var _kitten_cloud_variable_group__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(102);







function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }




var KittenCloudPrivateVariableGroup = /*#__PURE__*/function (_KittenCloudVariableG) {
  function KittenCloudPrivateVariableGroup(connection) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudPrivateVariableGroup);
    _this = _callSuper(this, KittenCloudPrivateVariableGroup, [connection, {
      cacheTime: 100,
      updateIntervalTime: 1500
    }]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "dataTypeName", "私有云变量");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "dataUpdateSendMessageType", _network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__.KittenCloudSendMessageType.UPDATE_PRIVATE_VARIABLE);
    _this.getRankingListArray = [];
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudPrivateVariableGroup, _KittenCloudVariableG);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudPrivateVariableGroup, [{
    key: "sendGetRankingList",
    value: function sendGetRankingList(variable, message) {
      this.getRankingListArray.push(variable);
      this.connection.send(_network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__.KittenCloudSendMessageType.GET_PRIVATE_VARIABLE_RANKING_LIST, message);
    }
  }, {
    key: "handleReceiveRankingList",
    value: function handleReceiveRankingList(data) {
      var first = this.getRankingListArray.shift();
      if (first == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
        throw new Error("没有请求排行榜，却收到了排行榜响应");
      }
      first.handleReceiveRankingList(data);
    }
  }, {
    key: "createData",
    value: function createData(cvid, name, value) {
      return new _kitten_cloud_private_variable__WEBPACK_IMPORTED_MODULE_9__.KittenCloudPrivateVariable(this.connection, this, cvid, name, value);
    }
  }, {
    key: "handleCloudUpdate",
    value: function handleCloudUpdate(__cloudMessage) {
      try {
        var firstUploadCount = this.uploadCount.shift();
        if (firstUploadCount == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
          throw new Error("不存在上传数据");
        }
        for (var i = 0; i < this.dataArray.length; i++) {
          for (;;) {
            var _this$dataArray$i;
            var count = firstUploadCount[i];
            if (count == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None || count <= 0) {
              break;
            }
            (_this$dataArray$i = this.dataArray[i]) === null || _this$dataArray$i === void 0 || _this$dataArray$i.updateManager.handleUploadingSuccess();
            firstUploadCount[i] = count - 1;
          }
        }
      } catch (error) {
        this.handleCloudUpdateError();
      }
    }
  }, {
    key: "toUploadMessage",
    value: function toUploadMessage(message) {
      if (!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(message) == "object" && message != null && "code" in message && "msg" in message)) {
        throw new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(message));
      }
      if (message.code == 1 && message.msg == "ok") {
        return {};
      }
      throw new Error("\u79C1\u6709\u4E91\u53D8\u91CF\u66F4\u65B0\u5931\u8D25\uFF1A".concat(JSON.stringify(message)));
    }
  }]);
}(_kitten_cloud_variable_group__WEBPACK_IMPORTED_MODULE_10__.KittenCloudVariableGroup);

/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudPrivateVariable: function() { return /* binding */ KittenCloudPrivateVariable; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_variable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(91);
/* harmony import */ var _update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _update_command_kitten_cloud_private_variable_set_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(108);
/* harmony import */ var _codemao_user_codemao_user__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(109);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(29);






function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }





/**
 * 私有云变量。
 */
var KittenCloudPrivateVariable = /*#__PURE__*/function (_KittenCloudVariable) {
  function KittenCloudPrivateVariable(connection, group, cvid, name, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudPrivateVariable);
    _this = _callSuper(this, KittenCloudPrivateVariable, [connection, group, cvid, name, value]);
    _this.group = group;
    _this.getRankingListResolveArray = [];
    _this.getRankingListRejectArray = [];
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudPrivateVariable, _KittenCloudVariable);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudPrivateVariable, [{
    key: "update",
    value: function update(value) {
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_private_variable_set_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudPrivateVariableSetCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.CLOUD, this, value));
    }

    /**
     * 设置私有云变量的值。
     *
     * @param value 要设置的值
     */
  }, {
    key: "set",
    value: function set(value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_private_variable_set_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudPrivateVariableSetCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.LOCAL, this, value));
    }

    /**
     * 获取排名列表。
     *
     * @param limit 限制数量，列表的长度不超过限制数量
     * @param order 排名顺序，1 为顺序，-1 为逆序
     * @returns 排名列表
     */
  }, {
    key: "getRankingList",
    value: function getRankingList(limit, order) {
      var _this2 = this;
      if (limit <= 0) {
        throw new Error("限制必须大于 0");
      }
      if (order != 1 && order != -1) {
        throw new Error("顺序只能为 1（顺序） 或 -1（逆序）");
      }
      this.group.sendGetRankingList(this, {
        cvid: this.cvid,
        limit: limit,
        order_type: order
      });
      return new Promise(function (resolve, reject) {
        _this2.getRankingListResolveArray.push(resolve);
        _this2.getRankingListRejectArray.push(reject);
      });
    }
  }, {
    key: "handleReceiveRankingList",
    value: function handleReceiveRankingList(data) {
      var resolve = this.getRankingListResolveArray.shift(),
        reject = this.getRankingListRejectArray.shift();
      if (data == _utils_other__WEBPACK_IMPORTED_MODULE_10__.None) {
        reject(new Error("收到了空排名数据"));
        return;
      }
      if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(data) != "object") {
        reject(new Error("无法识别的排名数据：" + data));
        return;
      }
      if (!("items" in data && Array.isArray(data.items))) {
        reject(new Error("无法识别的排名数据：" + JSON.stringify(data)));
        return;
      }
      var list = data.items;
      var result = [];
      var errorArray = [];
      var _iterator = _createForOfIteratorHelper(list),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item == _utils_other__WEBPACK_IMPORTED_MODULE_10__.None) {
            errorArray.push(new Error("排名数据为空"));
          } else if ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(item) != "object") {
            errorArray.push(new Error("无法识别的排名数据：" + item));
          } else if (!("value" in item && typeof item.value == "number" && "nickname" in item && typeof item.nickname == "string" && "avatar_url" in item && typeof item.avatar_url == "string" && "identifier" in item && typeof item.identifier == "string")) {
            errorArray.push(new Error("无法识别的排名数据：" + JSON.stringify(item)));
          } else {
            result.push({
              value: item.value,
              user: new _codemao_user_codemao_user__WEBPACK_IMPORTED_MODULE_9__.CodemaoUser({
                id: parseInt(item.identifier),
                nickname: item.nickname,
                avatarURL: item.avatar_url
              })
            });
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      resolve(result);
      if (errorArray.length > 0) {
        reject(errorArray);
      }
    }
  }]);
}(_kitten_cloud_variable__WEBPACK_IMPORTED_MODULE_6__.KittenCloudVariable);

/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudPrivateVariableSetCommand: function() { return /* binding */ KittenCloudPrivateVariableSetCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_variable_set_command__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(99);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var KittenCloudPrivateVariableSetCommand = /*#__PURE__*/function (_KittenCloudVariableS) {
  function KittenCloudPrivateVariableSetCommand() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudPrivateVariableSetCommand);
    return _callSuper(this, KittenCloudPrivateVariableSetCommand, arguments);
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudPrivateVariableSetCommand, _KittenCloudVariableS);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudPrivateVariableSetCommand, [{
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        cvid: this.variable.cvid,
        value: this.value,
        param_type: (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(this.value)
      };
    }
  }]);
}(_kitten_cloud_variable_set_command__WEBPACK_IMPORTED_MODULE_6__.KittenCloudVariableSetCommand);

/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodemaoUser: function() { return /* binding */ CodemaoUser; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _codemao_user_info__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(110);




/**
 * 编程猫用户。
 */
var CodemaoUser = /*#__PURE__*/(0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(
/**
 * 用户信息，详见{@link CodemaoUserInfo}。
 */

/**
 * @param info 已知用户信息。
 */
function CodemaoUser() {
  var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, CodemaoUser);
  this.info = new _codemao_user_info__WEBPACK_IMPORTED_MODULE_2__.CodemaoUserInfo(info);
});

/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodemaoUserInfo: function() { return /* binding */ CodemaoUserInfo; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(26);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(30);
/* harmony import */ var _codemao_user_sex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(111);










/**
 * 用户信息对象。
 */

/**
 * 编程猫用户信息类。
 *
 * - 用于获取编程猫用户信息。
 * - 所有属性均为`Promise`对象，当属性获取失败时访问该属性的值会被拒绝。
 *
 * 提供的用户信息详见类属性。
 *
 * ### 具有以下特性：
 * - 集成多个API接口，以确保在部分API接口信息获取失败时仍能提供尽可能完整的用户信息。
 * - 内置懒加载和缓存机制，以减少不必要的请求。
 *
 * ### 集成API接口
 *
 * #### 已经集成的API接口
 * - {@link getUserProfile}
 * - {@link getThisUserDetail}
 * - {@link getUserDetail}
 * - {@link getUserHonor}
 *
 * #### 将来可能集成的API接口：
 * - {@link searchUserByName}
 *
 * #### API优先级：
 * {@link getUserProfile} > {@link getThisUserDetail} > {@link getUserDetail} > {@link getUserHonor}
 */
var CodemaoUserInfo = /*#__PURE__*/function () {
  /**
   * @param info 已知的用户信息。
   */
  function CodemaoUserInfo(info) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, CodemaoUserInfo);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_profile", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_thisDetail", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_detail", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_honor", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_authorization", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_id", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_username", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_nickname", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_realname", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_avatarURL", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_coverURL", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_description", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_doing", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_email", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_level", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_grade", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_birthday", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_sex", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_viewTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_praiseTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_collectTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__["default"])(this, "_forkTimes", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    if (Object.keys(info).length == 0) {
      this.set({
        authorization: _utils_other__WEBPACK_IMPORTED_MODULE_6__.None
      });
    } else {
      this.set(info);
    }
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(CodemaoUserInfo, [{
    key: "profile",
    get: function get() {
      var _this = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this._profile == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None)) {
                _context2.next = 7;
                break;
              }
              _this._profile = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee() {
                var profile;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      _context.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getUserProfile;
                      _context.next = 3;
                      return _this.authorization;
                    case 3:
                      _context.t1 = _context.sent;
                      _context.next = 6;
                      return (0, _context.t0)(_context.t1);
                    case 6:
                      profile = _context.sent;
                      return _context.abrupt("return", {
                        id: profile.id,
                        nickname: profile.nickname,
                        avatarURL: profile.avatar_url,
                        description: profile.description,
                        grade: profile.grade,
                        birthday: new Date(profile.birthday * 1000)
                      });
                    case 8:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }))();
              _context2.t0 = _this;
              _context2.next = 5;
              return _this._profile;
            case 5:
              _context2.t1 = _context2.sent;
              _context2.t0.set.call(_context2.t0, _context2.t1);
            case 7:
              return _context2.abrupt("return", _this._profile);
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    }
  }, {
    key: "thisDetail",
    get: function get() {
      var _this2 = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee4() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(_this2._thisDetail == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None)) {
                _context4.next = 7;
                break;
              }
              _this2._thisDetail = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee3() {
                var userDetail;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee3$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getThisUserDetail;
                      _context3.next = 3;
                      return _this2.authorization;
                    case 3:
                      _context3.t1 = _context3.sent;
                      _context3.next = 6;
                      return (0, _context3.t0)(_context3.t1);
                    case 6:
                      userDetail = _context3.sent;
                      return _context3.abrupt("return", {
                        id: userDetail.id,
                        username: userDetail.username,
                        nickname: userDetail.nickname,
                        realname: userDetail.real_name,
                        avatarURL: userDetail.avatar_url,
                        description: userDetail.description,
                        email: userDetail.email,
                        birthday: new Date(userDetail.birthday * 1000),
                        sex: _codemao_user_sex__WEBPACK_IMPORTED_MODULE_8__.CodemaoUserSex.from(userDetail.sex)
                      });
                    case 8:
                    case "end":
                      return _context3.stop();
                  }
                }, _callee3);
              }))();
              _context4.t0 = _this2;
              _context4.next = 5;
              return _this2._thisDetail;
            case 5:
              _context4.t1 = _context4.sent;
              _context4.t0.set.call(_context4.t0, _context4.t1);
            case 7:
              return _context4.abrupt("return", _this2._thisDetail);
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }))();
    }
  }, {
    key: "detail",
    get: function get() {
      var _this3 = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee6() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!(_this3._detail == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None)) {
                _context6.next = 7;
                break;
              }
              _this3._detail = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee5() {
                var userDetail;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getUserDetail;
                      _context5.next = 3;
                      return _this3.id;
                    case 3:
                      _context5.t1 = _context5.sent;
                      _context5.next = 6;
                      return (0, _context5.t0)(_context5.t1);
                    case 6:
                      userDetail = _context5.sent;
                      return _context5.abrupt("return", {
                        id: userDetail.user.id,
                        nickname: userDetail.user.nickname,
                        avatarURL: userDetail.user.avatar,
                        description: userDetail.user.description,
                        doing: userDetail.user.doing,
                        level: userDetail.user.level,
                        sex: _codemao_user_sex__WEBPACK_IMPORTED_MODULE_8__.CodemaoUserSex.from(userDetail.user.sex),
                        viewTimes: userDetail.viewTimes,
                        praiseTimes: userDetail.praiseTimes,
                        forkTimes: userDetail.forkedTimes
                      });
                    case 8:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }))();
              _context6.t0 = _this3;
              _context6.next = 5;
              return _this3._detail;
            case 5:
              _context6.t1 = _context6.sent;
              _context6.t0.set.call(_context6.t0, _context6.t1);
            case 7:
              return _context6.abrupt("return", _this3._detail);
            case 8:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }))();
    }
  }, {
    key: "honor",
    get: function get() {
      var _this4 = this;
      return (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee8() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (!(_this4._honor == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None)) {
                _context8.next = 7;
                break;
              }
              _this4._honor = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().mark(function _callee7() {
                var honor;
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default().wrap(function _callee7$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.t0 = _codemao_community_api__WEBPACK_IMPORTED_MODULE_7__.getUserHonor;
                      _context7.next = 3;
                      return _this4.id;
                    case 3:
                      _context7.t1 = _context7.sent;
                      _context7.next = 6;
                      return (0, _context7.t0)(_context7.t1);
                    case 6:
                      honor = _context7.sent;
                      return _context7.abrupt("return", {
                        id: honor.user_id,
                        nickname: honor.nickname,
                        avatarURL: honor.avatar_url,
                        coverURL: honor.user_cover,
                        description: honor.user_description,
                        doing: honor.doing,
                        level: honor.author_level,
                        viewTimes: honor.view_times,
                        praiseTimes: honor.liked_total,
                        collectTimes: honor.collect_times,
                        forkTimes: honor.re_created_total
                      });
                    case 8:
                    case "end":
                      return _context7.stop();
                  }
                }, _callee7);
              }))();
              _context8.t0 = _this4;
              _context8.next = 5;
              return _this4._honor;
            case 5:
              _context8.t1 = _context8.sent;
              _context8.t0.set.call(_context8.t0, _context8.t1);
            case 7:
              return _context8.abrupt("return", _this4._honor);
            case 8:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }))();
    }
  }, {
    key: "authorization",
    get:
    /**
     * 身份信息。
     */
    function get() {
      if (this._authorization == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._authorization = Promise.reject(new Error("没有提供身份信息"));
      }
      return this._authorization;
    }

    /**
     * 用户ID。
     */
  }, {
    key: "id",
    get: function get() {
      var _this5 = this;
      if (this._id == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._id = Promise.any([Promise.reject(new Error("没有提供ID")), this.profile.catch(function (error0) {
          return _this5.thisDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.id;
        })]).catch(function (_ref9) {
          var errors = _ref9.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._id;
    }

    /**
     * 用户名，用户名可以用于登录编程猫账号。如果用户没有设置用户名，则返回空字符串。
     */
  }, {
    key: "username",
    get: function get() {
      if (this._username == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._username = Promise.any([Promise.reject(new Error("没有提供用户名")), this.thisDetail.then(function (info) {
          return info.username;
        })]).catch(function (_ref10) {
          var errors = _ref10.errors;
          return Promise.reject(errors);
        });
      }
      return this._username;
    }

    /**
     * 用户昵称。
     */
  }, {
    key: "nickname",
    get: function get() {
      var _this6 = this;
      if (this._nickname == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._nickname = Promise.any([Promise.reject(new Error("没有提供昵称")), this.profile.catch(function (error0) {
          return _this6.thisDetail.catch(function (error1) {
            return _this6.detail.catch(function (error2) {
              return _this6.honor.catch(function (error3) {
                return Promise.reject([error0, error1, error2, error3]);
              });
            });
          });
        }).then(function (info) {
          return info.nickname;
        })]).catch(function (_ref11) {
          var errors = _ref11.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._nickname;
    }

    /**
     * 用户真实姓名。如果用户没有填写真实姓名，则返回空字符串。
     */
  }, {
    key: "realname",
    get: function get() {
      if (this._realname == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._realname = Promise.any([Promise.reject(new Error("没有提供真实姓名")), this.thisDetail.then(function (info) {
          return info.realname;
        })]).catch(function (_ref12) {
          var errors = _ref12.errors;
          return Promise.reject(errors);
        });
      }
      return this._realname;
    }

    /**
     * 用户头像地址。
     */
  }, {
    key: "avatarURL",
    get: function get() {
      var _this7 = this;
      if (this._avatarURL == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._avatarURL = Promise.any([Promise.reject(new Error("没有提供头像地址")), this.profile.catch(function (error0) {
          return _this7.thisDetail.catch(function (error1) {
            return _this7.detail.catch(function (error2) {
              return _this7.honor.catch(function (error3) {
                return Promise.reject([error0, error1, error2, error3]);
              });
            });
          });
        }).then(function (info) {
          return info.avatarURL;
        })]).catch(function (_ref13) {
          var errors = _ref13.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._avatarURL;
    }

    /**
     * 用户背景图片地址。
     */
  }, {
    key: "coverURL",
    get: function get() {
      if (this._coverURL == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._coverURL = Promise.any([Promise.reject(new Error("没有提供背景图片地址")), this.honor.then(function (info) {
          return info.coverURL;
        })]).catch(function (_ref14) {
          var errors = _ref14.errors;
          return Promise.reject(errors);
        });
      }
      return this._coverURL;
    }

    /**
     * 用户描述。
     */
  }, {
    key: "description",
    get: function get() {
      var _this8 = this;
      if (this._description == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._description = Promise.any([Promise.reject(new Error("没有提供描述")), this.profile.catch(function (error0) {
          return _this8.thisDetail.catch(function (error1) {
            return _this8.detail.catch(function (error2) {
              return _this8.honor.catch(function (error3) {
                return Promise.reject([error0, error1, error2, error3]);
              });
            });
          });
        }).then(function (info) {
          return info.description;
        })]).catch(function (_ref15) {
          var errors = _ref15.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._description;
    }

    /**
     * 用户正在做什么。
     */
  }, {
    key: "doing",
    get: function get() {
      if (this._doing == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._doing = Promise.any([Promise.reject(new Error("没有提供正在做什么")), this.detail.then(function (info) {
          return info.doing;
        })]).catch(function (_ref16) {
          var errors = _ref16.errors;
          return Promise.reject(errors);
        });
      }
      return this._doing;
    }

    /**
     * 用户邮箱地址。
     */
  }, {
    key: "email",
    get: function get() {
      if (this._email == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._email = Promise.any([Promise.reject(new Error("没有提供邮箱")), this.thisDetail.then(function (info) {
          return info.email;
        })]).catch(function (_ref17) {
          var errors = _ref17.errors;
          return Promise.reject(errors);
        });
      }
      return this._email;
    }

    /**
     * 用户级别。
     */
  }, {
    key: "level",
    get: function get() {
      if (this._level == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._level = Promise.any([Promise.reject(new Error("没有提供级别")), this.detail.then(function (info) {
          return info.level;
        })]).catch(function (_ref18) {
          var errors = _ref18.errors;
          return Promise.reject(errors);
        });
      }
      return this._level;
    }

    /**
     * 用户等级。
     */
  }, {
    key: "grade",
    get: function get() {
      if (this._grade == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._grade = Promise.any([Promise.reject(new Error("没有提供等级")), this.profile.then(function (info) {
          return info.grade;
        })]).catch(function (_ref19) {
          var errors = _ref19.errors;
          return Promise.reject(errors);
        });
      }
      return this._grade;
    }

    /**
     * 用户生日。
     */
  }, {
    key: "birthday",
    get: function get() {
      var _this9 = this;
      if (this._birthday == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._birthday = Promise.any([Promise.reject(new Error("没有提供生日")), this.profile.catch(function (error0) {
          return _this9.thisDetail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.birthday;
        })]).catch(function (_ref20) {
          var errors = _ref20.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._birthday;
    }

    /**
     * 用户性别。详见 {@link CodemaoUserSex}。
     */
  }, {
    key: "sex",
    get: function get() {
      var _this10 = this;
      if (this._sex == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._sex = Promise.any([Promise.reject(new Error("没有提供性别")), this.thisDetail.catch(function (error0) {
          return _this10.detail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.sex;
        })]).catch(function (_ref21) {
          var errors = _ref21.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._sex;
    }

    /**
     * 用户所有作品被浏览的次数总和。
     */
  }, {
    key: "viewTimes",
    get: function get() {
      var _this11 = this;
      if (this._viewTimes == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._viewTimes = Promise.any([Promise.reject(new Error("没有提供浏览次数")), this.detail.catch(function (error0) {
          return _this11.honor.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.viewTimes;
        })]).catch(function (_ref22) {
          var errors = _ref22.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._viewTimes;
    }

    /**
     * 用户所有作品被点赞的次数总和。
     */
  }, {
    key: "praiseTimes",
    get: function get() {
      var _this12 = this;
      if (this._praiseTimes == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._praiseTimes = Promise.any([Promise.reject(new Error("没有提供点赞次数")), this.detail.catch(function (error0) {
          return _this12.honor.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.praiseTimes;
        })]).catch(function (_ref23) {
          var errors = _ref23.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._praiseTimes;
    }

    /**
     * 用户所有作品被收藏的次数总和。
     */
  }, {
    key: "collectTimes",
    get: function get() {
      if (this._collectTimes == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._collectTimes = Promise.any([Promise.reject(new Error("没有提供收藏次数")), this.honor.then(function (info) {
          return info.collectTimes;
        })]).catch(function (_ref24) {
          var errors = _ref24.errors;
          return Promise.reject(errors);
        });
      }
      return this._collectTimes;
    }

    /**
     * 用户所有作品被再创作的次数总和。
     */
  }, {
    key: "forkTimes",
    get: function get() {
      var _this13 = this;
      if (this._forkTimes == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        this._forkTimes = Promise.any([Promise.reject(new Error("没有提供再创作次数")), this.honor.catch(function (error0) {
          return _this13.detail.catch(function (error1) {
            return Promise.reject([error0, error1]);
          });
        }).then(function (info) {
          return info.forkTimes;
        })]).catch(function (_ref25) {
          var errors = _ref25.errors;
          return Promise.reject([errors[0]].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(errors[1])));
        });
      }
      return this._forkTimes;
    }
  }, {
    key: "set",
    value: function set(info) {
      if (info.authorization != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._authorization = Promise.resolve(info.authorization);
      if (info.id != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._id = Promise.resolve(info.id);
      if (info.username != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._username = Promise.resolve(info.username);
      if (info.nickname != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._nickname = Promise.resolve(info.nickname);
      if (info.realname != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._nickname = Promise.resolve(info.realname);
      if (info.avatarURL != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._avatarURL = Promise.resolve(info.avatarURL);
      if (info.coverURL != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._coverURL = Promise.resolve(info.coverURL);
      if (info.description != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._description = Promise.resolve(info.description);
      if (info.doing != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._doing = Promise.resolve(info.doing);
      if (info.email != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._email = Promise.resolve(info.email);
      if (info.level != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._level = Promise.resolve(info.level);
      if (info.grade != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._grade = Promise.resolve(info.grade);
      if (info.birthday != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._birthday = Promise.resolve(info.birthday);
      if (info.sex != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._sex = Promise.resolve(info.sex);
      if (info.viewTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._viewTimes = Promise.resolve(info.viewTimes);
      if (info.praiseTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._praiseTimes = Promise.resolve(info.praiseTimes);
      if (info.collectTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._collectTimes = Promise.resolve(info.collectTimes);
      if (info.forkTimes != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) this._forkTimes = Promise.resolve(info.forkTimes);
    }
  }]);
}();

/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CodemaoUserSex: function() { return /* binding */ CodemaoUserSex; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);



var _CodemaoUserSex;
/** 用户性别。*/var CodemaoUserSex = /*#__PURE__*/function () {
  function CodemaoUserSex(name) {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, CodemaoUserSex);
    this.name = name;
    this.symbol = Symbol(name);
  }
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(CodemaoUserSex, [{
    key: "toString",
    value: function toString() {
      return this.name;
    }
  }], [{
    key: "from",
    value: function from(argument) {
      if (argument instanceof CodemaoUserSex) {
        return argument;
      }
      return CodemaoUserSex.parse(argument);
    }
  }, {
    key: "parse",
    value: function parse(type) {
      if (typeof type == "number") {
        type = type.toString();
      }
      type = type.toUpperCase();
      if (!(type in typeMap)) {
        throw new Error("\u65E0\u6CD5\u8BC6\u522B\u7684\u7528\u6237\u6027\u522B\uFF1A".concat(type));
      }
      return typeMap[type];
    }

    /** 用户性别名称。*/
    /** 用户性别符号。*/
  }]);
}();
_CodemaoUserSex = CodemaoUserSex;
/** 用户为男性。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(CodemaoUserSex, "MALE", new _CodemaoUserSex("男"));
/** 用户为女性。*/
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__["default"])(CodemaoUserSex, "FEMALE", new _CodemaoUserSex("女"));
var typeMap = {
  "1": CodemaoUserSex.MALE,
  "MALE": CodemaoUserSex.MALE,
  "0": CodemaoUserSex.FEMALE,
  "FEMALE": CodemaoUserSex.FEMALE
};

/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListGroup: function() { return /* binding */ KittenCloudListGroup; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(29);
/* harmony import */ var _network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(89);
/* harmony import */ var _kitten_cloud_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(113);
/* harmony import */ var _update_command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(95);
/* harmony import */ var _update_command_kitten_cloud_list_add_command__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(114);
/* harmony import */ var _update_command_kitten_cloud_list_empty_command__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(116);
/* harmony import */ var _update_command_kitten_cloud_list_pop_command__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(117);
/* harmony import */ var _update_command_kitten_cloud_list_push_command__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(118);
/* harmony import */ var _update_command_kitten_cloud_list_remove_command__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(119);
/* harmony import */ var _update_command_kitten_cloud_list_replace_command__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(120);
/* harmony import */ var _update_command_kitten_cloud_list_replace_last_command__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(121);
/* harmony import */ var _update_command_kitten_cloud_list_unshift_command__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(122);
/* harmony import */ var _update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_data_group__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(103);







function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }














var KittenCloudListGroup = /*#__PURE__*/function (_KittenCloudDataGroup) {
  function KittenCloudListGroup(connection) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudListGroup);
    _this = _callSuper(this, KittenCloudListGroup, [connection, {
      localPreupdate: false
    }]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "dataTypeName", "云列表");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "dataUpdateSendMessageType", _network_kitten_cloud_send_message_type__WEBPACK_IMPORTED_MODULE_8__.KittenCloudSendMessageType.UPDATE_LIST);
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(KittenCloudListGroup, _KittenCloudDataGroup);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(KittenCloudListGroup, [{
    key: "createData",
    value: function createData(cvid, name, value) {
      return new _kitten_cloud_list__WEBPACK_IMPORTED_MODULE_9__.KittenCloudList(this.connection, this, cvid, name, value);
    }
  }, {
    key: "toCloudUploadMessage",
    value: function toCloudUploadMessage(message) {
      var newMessage = {};
      for (var cvid in message) {
        var _message$cvid, _message$cvid2;
        if ((_message$cvid = message[cvid]) !== null && _message$cvid !== void 0 && _message$cvid.isEmpty()) {
          continue;
        }
        newMessage[cvid] = (_message$cvid2 = message[cvid]) === null || _message$cvid2 === void 0 ? void 0 : _message$cvid2.toCloudJSON();
      }
      return newMessage;
    }
  }, {
    key: "toUploadMessage",
    value: function toUploadMessage(message) {
      if (message == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
        throw new Error("更新数据为空");
      }
      if (!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(message) == "object")) {
        throw new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(message));
      }
      var result = {};
      var errorArray = [];
      for (var cvid in message) {
        var data = this.dataMap.get(cvid);
        if (data == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
          errorArray.push(new Error("\u672A\u627E\u5230\u6570\u636E\uFF1A".concat(cvid)));
          continue;
        }
        var item = message[cvid];
        result[cvid] = new _update_command_kitten_cloud_data_update_command_group__WEBPACK_IMPORTED_MODULE_10__.KittenCloudDataUpdateCommandGroup();
        if (item == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
          errorArray.push(new Error("更新数据为空"));
        } else if (!Array.isArray(item)) {
          errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(item))));
        } else {
          var _iterator = _createForOfIteratorHelper(item),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var singleMessage = _step.value;
              if (singleMessage == _utils_other__WEBPACK_IMPORTED_MODULE_7__.None) {
                errorArray.push(new Error("更新数据为空"));
              } else if (!((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(singleMessage) == "object" && "action" in singleMessage && typeof singleMessage.action == "string")) {
                errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
              } else {
                switch (singleMessage.action) {
                  case "append":
                    if ("value" in singleMessage && (typeof singleMessage.value == "number" || typeof singleMessage.value == "string")) {
                      result[cvid].add(new _update_command_kitten_cloud_list_push_command__WEBPACK_IMPORTED_MODULE_14__.KittenCloudListPushCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.value));
                    } else {
                      errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                    }
                    break;
                  case "unshift":
                    if ("value" in singleMessage && (typeof singleMessage.value == "number" || typeof singleMessage.value == "string")) {
                      result[cvid].add(new _update_command_kitten_cloud_list_unshift_command__WEBPACK_IMPORTED_MODULE_18__.KittenCloudListUnshiftCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.value));
                    } else {
                      errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                    }
                    break;
                  case "insert":
                    if ("nth" in singleMessage && typeof singleMessage.nth == "number" && "value" in singleMessage && (typeof singleMessage.value == "number" || typeof singleMessage.value == "string")) {
                      result[cvid].add(new _update_command_kitten_cloud_list_add_command__WEBPACK_IMPORTED_MODULE_11__.KittenCloudListAddCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.nth - 1, singleMessage.value));
                    } else {
                      errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                    }
                    break;
                  case "delete":
                    if (!("nth" in singleMessage)) {
                      errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                    } else if (singleMessage.nth == "last") {
                      result[cvid].add(new _update_command_kitten_cloud_list_pop_command__WEBPACK_IMPORTED_MODULE_13__.KittenCloudListPopCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data));
                    } else if (singleMessage.nth == "all") {
                      result[cvid].add(new _update_command_kitten_cloud_list_empty_command__WEBPACK_IMPORTED_MODULE_12__.KittenCloudListEmptyCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data));
                    } else {
                      if (typeof singleMessage.nth != "number") {
                        errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                      }
                      result[cvid].add(new _update_command_kitten_cloud_list_remove_command__WEBPACK_IMPORTED_MODULE_15__.KittenCloudListRemoveCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.nth - 1));
                    }
                    break;
                  case "replace":
                    if (!("nth" in singleMessage)) {
                      errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                      break;
                    }
                    if (!("value" in singleMessage && (typeof singleMessage.value == "number" || typeof singleMessage.value == "string"))) {
                      errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                      break;
                    }
                    if (singleMessage.nth == "last") {
                      result[cvid].add(new _update_command_kitten_cloud_list_replace_last_command__WEBPACK_IMPORTED_MODULE_17__.KittenCloudListReplaceLastCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.value));
                    } else {
                      if (typeof singleMessage.nth != "number") {
                        errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                        break;
                      }
                      result[cvid].add(new _update_command_kitten_cloud_list_replace_command__WEBPACK_IMPORTED_MODULE_16__.KittenCloudListReplaceCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_19__.KittenCloudDataUpdateSource.CLOUD, data, singleMessage.nth - 1, singleMessage.value));
                    }
                    break;
                  default:
                    errorArray.push(new Error("\u65E0\u6CD5\u8BC6\u522B\u66F4\u65B0\u6570\u636E\u683C\u5F0F\uFF1A".concat(JSON.stringify(singleMessage))));
                    break;
                }
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
      return result;
    }
  }]);
}(_kitten_cloud_data_group__WEBPACK_IMPORTED_MODULE_20__.KittenCloudDataGroup);

/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudList: function() { return /* binding */ KittenCloudList; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(29);
/* harmony import */ var _utils_signal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(82);
/* harmony import */ var _kitten_cloud_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(92);
/* harmony import */ var _update_command_kitten_cloud_list_add_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(114);
/* harmony import */ var _update_command_kitten_cloud_list_empty_command__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(116);
/* harmony import */ var _update_command_kitten_cloud_list_pop_command__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(117);
/* harmony import */ var _update_command_kitten_cloud_list_push_command__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(118);
/* harmony import */ var _update_command_kitten_cloud_list_remove_command__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(119);
/* harmony import */ var _update_command_kitten_cloud_list_replace_command__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(120);
/* harmony import */ var _update_command_kitten_cloud_list_replace_last_command__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(121);
/* harmony import */ var _update_command_kitten_cloud_list_unshift_command__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(122);
/* harmony import */ var _update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(94);
/* harmony import */ var diff__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(123);
/* harmony import */ var diff__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(diff__WEBPACK_IMPORTED_MODULE_17__);





function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }














/**
 * 云列表项的值的类型。
 */

/**
 * 云列表添加尾项到消息的类型，当云列表添加尾项时会收到此消息，详见 {@link KittenCloudList.pushed}。
 */

/**
 * 云列表添加首项消息的类型，当云列表添加首项时会收到此消息，详见 {@link KittenCloudList.unshifted}。
 */

/**
 * 云列表添加项到指定位置消息的类型，当云列表添加项到指定位置时会收到此消息，详见 {@link KittenCloudList.added}。
 */

/**
 * 云列表移除最后一项消息的类型，当云列表删除最后一项时会收到此消息，详见 {@link KittenCloudList.popped}。
 */

/**
 * 云列表移除指定项消息的类型，当云列表删除指定项时会收到此消息，详见 {@link KittenCloudList.removed}。
 */

/**
 * 云列表清空消息的类型，当云列表清空时会收到此消息，详见 {@link KittenCloudList.emptied}。
 */

/**
 * 云列替换最后一项消息的类型，当云列表替换最后一项时会收到此消息，详见 {@link KittenCloudList.replacedLast}。
 */

/**
 * 云列替换指定项消息的类型，当云列表替换指定项时会收到此消息，详见 {@link KittenCloudList.replaced}。
 */

/**
 * 云列替换所有项消息的类型，当云列表替换所有项时会收到此消息，详见 {@link KittenCloudList.replacedAll}。
 */

/**
 * 云列表。
 */
var KittenCloudList = /*#__PURE__*/function (_KittenCloudData) {
  /**
   * 添加尾项信号，当云列表添加尾项时触发此信号。
   *
   * 添加尾项消息类型详见 {@link KittenCloudListPushMessageObject}。
   */

  /**
   * 添加首项信号，当云列表添加首项时触发此信号。
   *
   * 添加首项消息类型详见 {@link KittenCloudListUnshiftMessageObject}。
   */

  /**
   * 添加项到指定位置信号，当云列表添加项到指定位置时触发此信号。
   *
   * 添加项到指定位置消息类型详见 {@link KittenCloudListAddMessageObject}。
   */

  /**
   * 移除最后一项信号，当云列表删除最后一项时触发此信号。
   *
   * 移除最后一项消息类型详见 {@link KittenCloudListPopMessageObject}。
   */

  /**
   * 移除指定项信号，当云列表删除指定项时触发此信号。
   *
   * 移除指定项消息类型详见 {@link KittenCloudListRemoveMessageObject}。
   */

  /**
   * 清空信号，当云列表清空时触发此信号。
   *
   * 清空消息类型详见 {@link KittenCloudListEmptyMessageObject}。
   */

  /**
   * 替换最后一项信号，当云列表替换最后一项时触发此信号。
   *
   * 替换最后一项消息类型详见 {@link KittenCloudListReplaceLastMessageObject}。
   */

  /**
   * 替换指定项信号，当云列表替换指定项时触发此信号。
   *
   * 替换指定项消息类型详见 {@link KittenCloudListReplaceMessageObject}。
   */

  /**
   * 替换所有项信号，当云列表替换所有项时触发此信号。
   *
   * 替换所有项消息类型详见 {@link KittenCloudListReplaceAllMessageObject}。
   */

  function KittenCloudList(connection, group, cvid, name, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudList);
    _this = _callSuper(this, KittenCloudList, [connection, group, cvid, name]);
    _this.group = group;
    _this.value = value;
    _this.pushed = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.unshifted = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.added = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.popped = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.removed = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.emptied = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.replacedLast = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.replaced = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    _this.replacedAll = new _utils_signal__WEBPACK_IMPORTED_MODULE_6__.Signal();
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudList, _KittenCloudData);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudList, [{
    key: "update",
    value: function update(value) {
      var diff = this.compareTo(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.CLOUD, value);
      var _iterator = _createForOfIteratorHelper(diff),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var command = _step.value;
          this.updateManager.addUpdateCommand(command);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "compareTo",
    value: function compareTo(source, value) {
      var diff = (0,diff__WEBPACK_IMPORTED_MODULE_17__.diffArrays)(this.value, value);
      var position = 0;
      var result = [];
      var _iterator2 = _createForOfIteratorHelper(diff),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var change = _step2.value;
          if (!change.removed && !change.added) {
            position += change.value.length;
          } else if (change.removed) {
            for (var i = 0; i < change.value.length; i++) {
              result.push(new _update_command_kitten_cloud_list_remove_command__WEBPACK_IMPORTED_MODULE_12__.KittenCloudListRemoveCommand(source, this, position));
            }
          } else if (change.added) {
            var _value = _utils_other__WEBPACK_IMPORTED_MODULE_5__.None;
            var length = change.value.length;
            while ((_value = change.value.pop()) != _utils_other__WEBPACK_IMPORTED_MODULE_5__.None) {
              result.push(new _update_command_kitten_cloud_list_add_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListAddCommand(source, this, position, _value));
            }
            position += length;
          } else {
            throw new Error("未预期的数组差异");
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return result;
    }

    /**
     * 添加新的项到尾部。
     *
     * @param value 添加的新的项的值
     */
  }, {
    key: "push",
    value: function push(value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_push_command__WEBPACK_IMPORTED_MODULE_11__.KittenCloudListPushCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this, value));
    }

    /**
     * 添加新的项到头部。
     *
     * @param value 添加的新的项的值
     */
  }, {
    key: "unshift",
    value: function unshift(value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_unshift_command__WEBPACK_IMPORTED_MODULE_15__.KittenCloudListUnshiftCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this, value));
    }

    /**
     * 添加新的项到指定位置。
     *
     * @param index 位置索引
     * @param value 添加的新的项的值
     */
  }, {
    key: "add",
    value: function add(index, value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_add_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListAddCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this, index, value));
    }

    /**
     * 移除最后一项。
     */
  }, {
    key: "pop",
    value: function pop() {
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_pop_command__WEBPACK_IMPORTED_MODULE_10__.KittenCloudListPopCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this));
    }

    /**
     * 移除指项。
     *
     * @param index 位置索引
     */
  }, {
    key: "remove",
    value: function remove(index) {
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_remove_command__WEBPACK_IMPORTED_MODULE_12__.KittenCloudListRemoveCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this, index));
    }

    /**
     * 清空列表。
     */
  }, {
    key: "empty",
    value: function empty() {
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_empty_command__WEBPACK_IMPORTED_MODULE_9__.KittenCloudListEmptyCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this));
    }

    /**
     * 替换最后一项。
     *
     * @param value 新的值
     */
  }, {
    key: "replaceLast",
    value: function replaceLast(value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_replace_last_command__WEBPACK_IMPORTED_MODULE_14__.KittenCloudListReplaceLastCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this, value));
    }

    /**
     * 替换指定项。
     *
     * @param index 位置索引
     * @param value 新的值
     */
  }, {
    key: "replace",
    value: function replace(index, value) {
      value = this.singleValueProcess(value);
      this.updateManager.addUpdateCommand(new _update_command_kitten_cloud_list_replace_command__WEBPACK_IMPORTED_MODULE_13__.KittenCloudListReplaceCommand(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, this, index, value));
    }

    /**
     * 从源列表复制所有项。
     *
     * 该操作会对比源列表和当前列表，并将差异应用到当前列表。
     *
     * @param source 源列表
     */
  }, {
    key: "copyFrom",
    value: function copyFrom(source) {
      var _this2 = this;
      if (source instanceof KittenCloudList) {
        source = source.value;
      }
      source = source.map(function (item) {
        return _this2.singleValueProcess(item);
      });
      var diff = this.compareTo(_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_16__.KittenCloudDataUpdateSource.LOCAL, source);
      var _iterator3 = _createForOfIteratorHelper(diff),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var command = _step3.value;
          this.updateManager.addUpdateCommand(command);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    /**
     * 获取一份当前列表的副本数组。
     *
     * @returns 当前列表的副本数组
     */
  }, {
    key: "copy",
    value: function copy() {
      return this.value.slice();
    }

    /**
     * 获取指定位置的项。
     *
     * @param index 位置索引
     * @returns 指定位置的项，如果索引越界则返回 `None`
     */
  }, {
    key: "get",
    value: function get(index) {
      return this.value[index];
    }

    /**
     * 获取列表的长度。
     *
     * @returns 列表的长度
     */
  }, {
    key: "length",
    get: function get() {
      return this.value.length;
    }

    /**
     * 获取指定项在列表中第一次出现的位置。
     *
     * @param item 要查找的项
     * @returns 指定项在列表中第一次出现的位置，如果不存在则返回 `-1`
     */
  }, {
    key: "indexOf",
    value: function indexOf(item) {
      return this.value.indexOf(item);
    }

    /**
     * 获取指定项在列表中最后一次出现的位置。
     *
     * @param item 要查找的项
     * @returns 指定项在列表中最后一次出现的位置，如果不存在则返回 `-1`
     */
  }, {
    key: "lastIndexOf",
    value: function lastIndexOf(item) {
      return this.value.lastIndexOf(item);
    }

    /**
     * 判断指定项是否在列表中。
     *
     * @param item 要查找的项
     * @returns 指定项是否在列表中
     */
  }, {
    key: "includes",
    value: function includes(item) {
      return this.value.includes(item);
    }

    /**
     * 用指定字符串连接列表中的所有项。
     *
     * @param separator 项之间的分隔符
     * @returns 连接后的字符串
     */
  }, {
    key: "join",
    value: function join(separator) {
      return this.value.join(separator);
    }
  }]);
}(_kitten_cloud_data__WEBPACK_IMPORTED_MODULE_7__.KittenCloudData);

/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListAddCommand: function() { return /* binding */ KittenCloudListAddCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListAddCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListAddCommand(source, list, index, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListAddCommand);
    _this = _callSuper(this, KittenCloudListAddCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "effective", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    _this.list = list;
    _this.index = index;
    _this.value = value;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListAddCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListAddCommand, [{
    key: "execute",
    value: function execute() {
      if (this.effective != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.effective = 0 <= this.index && this.index <= this.list.length;
      if (this.effective) {
        this.list.value.splice(this.index, 0, this.value);
        this.effective = true;
        this.list.added.emit({
          source: this.source,
          index: this.index,
          item: this.value
        });
      }
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      if (this.effective) {
        this.list.value.splice(this.index, 1);
        this.list.removed.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          index: this.index,
          item: this.value
        });
      }
      this.effective = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None ? 0 <= this.index && this.index <= this.list.length : this.effective;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return 0 <= this.index && this.index < this.data.listLengthLimit.value;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "add",
        index: this.index
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "insert",
        cvid: this.list.cvid,
        nth: this.index + 1,
        value: this.value
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListUpdateCommand: function() { return /* binding */ KittenCloudListUpdateCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _kitten_cloud_data_update_command__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(101);





function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var KittenCloudListUpdateCommand = /*#__PURE__*/function (_KittenCloudDataUpdat) {
  function KittenCloudListUpdateCommand() {
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, KittenCloudListUpdateCommand);
    return _callSuper(this, KittenCloudListUpdateCommand, arguments);
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListUpdateCommand, _KittenCloudDataUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(KittenCloudListUpdateCommand);
}(_kitten_cloud_data_update_command__WEBPACK_IMPORTED_MODULE_5__.KittenCloudDataUpdateCommand);

/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListEmptyCommand: function() { return /* binding */ KittenCloudListEmptyCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListEmptyCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListEmptyCommand(source, list) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListEmptyCommand);
    _this = _callSuper(this, KittenCloudListEmptyCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "backup", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    _this.list = list;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListEmptyCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListEmptyCommand, [{
    key: "execute",
    value: function execute() {
      if (this.backup != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.backup = this.list.value;
      this.list.value = [];
      this.list.emptied.emit({
        source: this.source,
        list: this.backup.slice()
      });
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.backup == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      this.list.value = this.backup;
      this.list.replacedAll.emit({
        source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
        originalList: [],
        newList: this.backup.slice()
      });
      this.backup = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return true;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "empty"
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "delete",
        cvid: this.list.cvid,
        nth: "all"
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListPopCommand: function() { return /* binding */ KittenCloudListPopCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListPopCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListPopCommand(source, list) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListPopCommand);
    _this = _callSuper(this, KittenCloudListPopCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "effective", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "backup", 0);
    _this.list = list;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListPopCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListPopCommand, [{
    key: "execute",
    value: function execute() {
      if (this.effective != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.effective = this.list.length > 0;
      if (this.effective) {
        this.backup = this.list.value.pop();
        this.list.popped.emit({
          source: this.source,
          item: this.backup
        });
      }
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      if (this.effective) {
        this.list.value.push(this.backup);
        this.list.pushed.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          item: this.backup
        });
      }
      this.effective = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None ? this.list.length > 0 : this.effective;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "pop"
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "delete",
        nth: "last"
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListPushCommand: function() { return /* binding */ KittenCloudListPushCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListPushCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListPushCommand(source, list, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListPushCommand);
    _this = _callSuper(this, KittenCloudListPushCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "effective", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    _this.list = list;
    _this.value = value;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListPushCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListPushCommand, [{
    key: "execute",
    value: function execute() {
      if (this.effective != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.effective = this.list.length < this.list.listLengthLimit.value;
      if (this.effective) {
        this.list.value.push(this.value);
        this.list.pushed.emit({
          source: this.source,
          item: this.value
        });
      }
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      if (this.effective) {
        this.list.value.pop();
        this.list.popped.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          item: this.value
        });
      }
      this.effective = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None ? this.list.length < this.list.listLengthLimit.value : this.effective;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "push",
        value: this.value
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "append",
        cvid: this.list.cvid,
        value: this.value
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListRemoveCommand: function() { return /* binding */ KittenCloudListRemoveCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListRemoveCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListRemoveCommand(source, list, index) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListRemoveCommand);
    _this = _callSuper(this, KittenCloudListRemoveCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "effective", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "backup", 0);
    _this.list = list;
    _this.index = index;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListRemoveCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListRemoveCommand, [{
    key: "execute",
    value: function execute() {
      if (this.effective != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.effective = 0 <= this.index && this.index < this.list.length;
      if (this.effective) {
        this.backup = this.list.value.splice(this.index, 1)[0];
        this.effective = true;
        this.list.removed.emit({
          source: this.source,
          index: this.index,
          item: this.backup
        });
      }
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      if (this.effective) {
        this.list.value.splice(this.index, 0, this.backup);
        this.list.added.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          index: this.index,
          item: this.backup
        });
      }
      this.effective = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None ? 0 <= this.index && this.index < this.list.length : this.effective;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return 0 <= this.index && this.index < this.data.listLengthLimit.value;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "remove",
        index: this.index
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "delete",
        cvid: this.list.cvid,
        nth: this.index + 1
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListReplaceCommand: function() { return /* binding */ KittenCloudListReplaceCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListReplaceCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListReplaceCommand(source, list, index, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListReplaceCommand);
    _this = _callSuper(this, KittenCloudListReplaceCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "effective", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "backup", 0);
    _this.list = list;
    _this.index = index;
    _this.value = value;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListReplaceCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListReplaceCommand, [{
    key: "execute",
    value: function execute() {
      if (this.effective != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.effective = 0 <= this.index && this.index < this.list.length;
      if (this.effective) {
        this.backup = this.list.value[this.index];
        this.list.value[this.index] = this.value;
        this.effective = true;
        this.list.replaced.emit({
          source: this.source,
          index: this.index,
          originalItem: this.backup,
          newItem: this.value
        });
      }
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      if (this.effective) {
        this.list.value[this.index] = this.backup;
        this.list.replaced.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          index: this.index,
          originalItem: this.value,
          newItem: this.backup
        });
      }
      this.effective = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return 0 <= this.index && this.index < this.list.length;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return 0 <= this.index && this.index < this.data.listLengthLimit.value;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "replace",
        index: this.index,
        value: this.value
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "replace",
        cvid: this.list.cvid,
        nth: this.index + 1,
        value: this.value
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListReplaceLastCommand: function() { return /* binding */ KittenCloudListReplaceLastCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListReplaceLastCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListReplaceLastCommand(source, list, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListReplaceLastCommand);
    _this = _callSuper(this, KittenCloudListReplaceLastCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "effective", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "backup", 0);
    _this.list = list;
    _this.value = value;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListReplaceLastCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListReplaceLastCommand, [{
    key: "execute",
    value: function execute() {
      if (this.effective != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.effective = this.list.length > 0;
      if (this.effective) {
        this.backup = this.list.value.splice(-1, 1, this.value)[0];
        this.list.replacedLast.emit({
          source: this.source,
          originalItem: this.backup,
          newItem: this.value
        });
      }
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      if (this.effective) {
        this.list.value.splice(-1, 1, this.backup);
        this.list.replacedLast.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          originalItem: this.value,
          newItem: this.backup
        });
      }
      this.effective = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return this.effective == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None ? this.list.length > 0 : this.effective;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "replaceLast",
        value: this.value
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "replace",
        nth: "last",
        value: this.value
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KittenCloudListUnshiftCommand: function() { return /* binding */ KittenCloudListUnshiftCommand; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(26);
/* harmony import */ var _utils_other__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(29);
/* harmony import */ var _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(115);






function _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var KittenCloudListUnshiftCommand = /*#__PURE__*/function (_KittenCloudListUpdat) {
  function KittenCloudListUnshiftCommand(source, list, value) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, KittenCloudListUnshiftCommand);
    _this = _callSuper(this, KittenCloudListUnshiftCommand, [source, list]);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "overflow", _utils_other__WEBPACK_IMPORTED_MODULE_6__.None);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, "overflowValue", 0);
    _this.list = list;
    _this.value = value;
    return _this;
  }
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(KittenCloudListUnshiftCommand, _KittenCloudListUpdat);
  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(KittenCloudListUnshiftCommand, [{
    key: "execute",
    value: function execute() {
      if (this.overflow != _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法执行命令：命令已被执行，不能重复执行");
      }
      this.list.value.unshift(this.value);
      this.overflow = this.list.length > this.list.listLengthLimit.value;
      if (this.overflow) {
        this.overflowValue = this.list.value.pop();
      }
      this.list.unshifted.emit({
        source: this.source,
        item: this.value
      });
    }
  }, {
    key: "revoke",
    value: function revoke() {
      if (this.overflow == _utils_other__WEBPACK_IMPORTED_MODULE_6__.None) {
        throw new Error("无法撤销命令：命令尚未执行");
      }
      this.list.value.shift();
      this.overflow = _utils_other__WEBPACK_IMPORTED_MODULE_6__.None;
      this.list.removed.emit({
        source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
        index: 0,
        item: this.overflowValue
      });
      if (this.overflow) {
        this.list.value.push(this.overflowValue);
        this.list.pushed.emit({
          source: _kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource.REVOKE,
          item: this.overflowValue
        });
      }
    }
  }, {
    key: "isEffective",
    value: function isEffective() {
      return true;
    }
  }, {
    key: "isLegal",
    value: function isLegal() {
      return true;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        method: "unshift",
        value: this.value
      };
    }
  }, {
    key: "toCloudJSON",
    value: function toCloudJSON() {
      return {
        action: "unshift",
        cvid: this.list.cvid,
        value: this.value
      };
    }
  }]);
}(_kitten_cloud_list_update_command__WEBPACK_IMPORTED_MODULE_8__.KittenCloudListUpdateCommand);

/***/ }),
/* 123 */
/***/ (function(module) {

"use strict";
module.exports = require("diff");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
/* harmony import */ var _codemao_work_codemao_work_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(80);
/* harmony import */ var _kitten_cloud_function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _module_cloud_data_kitten_cloud_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(92);
/* harmony import */ var _module_cloud_data_kitten_cloud_variable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(91);
/* harmony import */ var _module_cloud_data_kitten_cloud_private_variable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(107);
/* harmony import */ var _module_cloud_data_kitten_cloud_public_variable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(90);
/* harmony import */ var _module_cloud_data_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94);
/* harmony import */ var _codemao_user_codemao_user_sex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(111);









Object.assign(window, {
  CodemaoUserSex: _codemao_user_codemao_user_sex__WEBPACK_IMPORTED_MODULE_8__.CodemaoUserSex,
  CodemaoWork: _codemao_work_codemao_work__WEBPACK_IMPORTED_MODULE_0__.CodemaoWork,
  CodemaoWorkType: _codemao_work_codemao_work_type__WEBPACK_IMPORTED_MODULE_1__.CodemaoWorkType,
  KittenCloudFunction: _kitten_cloud_function__WEBPACK_IMPORTED_MODULE_2__.KittenCloudFunction,
  KittenCloudData: _module_cloud_data_kitten_cloud_data__WEBPACK_IMPORTED_MODULE_3__.KittenCloudData,
  KittenCloudVariable: _module_cloud_data_kitten_cloud_variable__WEBPACK_IMPORTED_MODULE_4__.KittenCloudVariable,
  KittenCloudPrivateVariable: _module_cloud_data_kitten_cloud_private_variable__WEBPACK_IMPORTED_MODULE_5__.KittenCloudPrivateVariable,
  KittenCloudPublicVariable: _module_cloud_data_kitten_cloud_public_variable__WEBPACK_IMPORTED_MODULE_6__.KittenCloudPublicVariable,
  KittenCloudDataUpdateSource: _module_cloud_data_update_kitten_cloud_data_update_source__WEBPACK_IMPORTED_MODULE_7__.KittenCloudDataUpdateSource
});
}();
/******/ })()
;