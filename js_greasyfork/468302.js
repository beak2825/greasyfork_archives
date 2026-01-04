// ==UserScript==
// @name         GlobalTools
// @namespace    http://tampermonkey.net/
// @version      0.2.12
// @description  挂载到window下一级 tls_enjoy 属性集合-常用工具函数
// @author       Enjoy
// @include        *://*/*
// @include        file:///*
// @homepage      https://greasyfork.org/zh-CN/scripts/468302-%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0tls
// @license MIT
// @icon          https://foruda.gitee.com/avatar/1725500487420291325/4867929_enjoy_li_1725500487.png!avatar200
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468302/GlobalTools.user.js
// @updateURL https://update.greasyfork.org/scripts/468302/GlobalTools.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 342:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(882)["default"]);
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

/***/ 882:
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 501:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(342)();
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


/***/ })

/******/ 	});
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
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function asyncToGenerator_asyncToGenerator(n) {
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

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/typeof.js
function typeof_typeof(o) {
  "@babel/helpers - typeof";

  return typeof_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, typeof_typeof(o);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != typeof_typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof_typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == typeof_typeof(i) ? i : i + "";
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/defineProperty.js

function defineProperty_defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
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

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}

// EXTERNAL MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(501);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function createClass_createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function classCallCheck_classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}

;// CONCATENATED MODULE: ./tools/GM.js






function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { defineProperty_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/** @描述 函数文档 https://www.tampermonkey.net/documentation.php#api:GM_addElement */

/**
 * @description 创建element
 * @export
 * @param {*} tag
 * @param {*} [options={}]
 * @param {*} [win=window]
 * @returns {*}
 */
function createElement(tag) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var win = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  if (!win.GM_createElement) {
    win.GM_createElement = GM_createElement;
  }
  return GM_createElement(tag, options);
  /**
   * @param {*} tag
   * @param {*}  options {
   * 			idPrefix = `enjoy_${ENV_CRX}_${tag}`,
   * 			el = 'html',
   * 			autoInsert = true,
   * 			randomType = 'single',
   * 			id = '',
   * 			addPrefix = true,
   * 			insertType = tag === 'style' ? 'appendChild' : 'prepend',
   * 		}
   * @returns {*} dom
   */
  function GM_createElement(tag, options) {
    var _options$idPrefix = options.idPrefix,
      idPrefix = _options$idPrefix === void 0 ? "enjoy_".concat("GlobalTools", "_").concat(tag, "_") : _options$idPrefix,
      _options$el = options.el,
      el = _options$el === void 0 ? 'html' : _options$el,
      _options$autoInsert = options.autoInsert,
      autoInsert = _options$autoInsert === void 0 ? true : _options$autoInsert,
      _options$randomType = options.randomType,
      randomType = _options$randomType === void 0 ? 'single' : _options$randomType,
      _options$id = options.id,
      id = _options$id === void 0 ? '' : _options$id,
      _options$addPrefix = options.addPrefix,
      addPrefix = _options$addPrefix === void 0 ? true : _options$addPrefix,
      _options$insertType = options.insertType,
      insertType = _options$insertType === void 0 ? tag === 'style' ? 'appendChild' : 'prepend' : _options$insertType;
    if (addPrefix) {
      id = "".concat(idPrefix).concat(id);
    }
    if (randomType !== 'single') {
      id = "".concat(id, "_").concat(Math.floor(Math.random() * 1000));
    }
    options.id = id;
    var dom = document.querySelector("#".concat(id));
    if (!dom) {
      dom = document.createElement(tag);
    }
    for (var key in options) {
      if (Object.hasOwnProperty.call(options, key) && key !== 'el') {
        dom[key] = options[key];
      }
    }
    if (autoInsert) {
      if (typeof el === 'string') {
        el = document.querySelector(el) || document.documentElement;
      }

      //insertType  prepend | appendChild
      el[insertType](dom);
    }
    return dom;
  }
}

/** @描述 是否匹配到目标url */
function isMatched() {
  var urls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var currentUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : location.href;
  if (typeof urls === 'string') {
    urls = [urls];
  }
  return !!urls.find(function (regUrl) {
    return new RegExp(regUrl).test(currentUrl);
  });
}
function prependMetaUF8() {
  return document.querySelector('meta[charset="UTF-8"]') || createElement('meta', {
    charset: 'utf-8'
  });
}

/**
 * @description doCopy 复制文本到剪贴板
 * @export
 * @param {*} text
 */
function doCopy(text) {
  var _navigator;
  if (!text) return console.warn('doCopy 参数为空');
  if (document.hasFocus() && (_navigator = navigator) !== null && _navigator !== void 0 && (_navigator = _navigator.clipboard) !== null && _navigator !== void 0 && _navigator.writeText) {
    // localhost、127.0.0.1或者https中才能正常使用
    // 读取剪贴板
    // navigator.clipboard.readText().then((clipText) => {console.log('clipText=',clipText)})

    // 写入剪贴板
    navigator.clipboard.writeText(text)["catch"](function (err) {
      return console.error("clipboard.writeText\uFF1A".concat(err));
    });
    return;
  }
  var textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = text;
  textarea.select();
  document.execCommand('Copy');
  setTimeout(function () {
    textarea.remove();
  }, 1000);
}

/**
 * 检测element元素的可见性，即 非display:none
 * @param {*} element
 * @returns {*}  {Boolean}
 */
function checkVisibility(element) {
  if (element.checkVisibility) {
    return element.checkVisibility();
  }
  return !!element.offsetParent;
}
/**
 * @description 创建element的提示
 * @export
 * @param {*} [options={}]
 * @returns {*}
 */
function createElementTipFn() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$setTimeoutSt = options.setTimeoutStep,
    setTimeoutStep = _options$setTimeoutSt === void 0 ? 1000 : _options$setTimeoutSt,
    _options$backgroundCo = options.backgroundColors,
    backgroundColors = _options$backgroundCo === void 0 ? {
      warn: 'rgb(181 156 51 / 60%)',
      success: 'rgb(3 113 3 / 60%)',
      error: 'rgb(165 2 2 / 60%)',
      info: 'rgb(67 62 62 / 60%)'
    } : _options$backgroundCo,
    _options$color = options.color,
    color = _options$color === void 0 ? '#ffffff' : _options$color,
    _options$opacity = options.opacity,
    opacity = _options$opacity === void 0 ? 1 : _options$opacity;
  var setTimeoutStamp = 0;
  return function createElementTip() {
    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var content = configs.content,
      e = configs.e,
      _configs$type = configs.type,
      type = _configs$type === void 0 ? 'info' : _configs$type,
      _configs$tagType = configs.tagType,
      tagType = _configs$tagType === void 0 ? 'span' : _configs$tagType;
    if (!content) return;
    console.log("content => %O ", content);
    clearTimeout(setTimeoutStamp);
    var contentDom = createElement(tagType, {
      id: 'createElementTip',
      innerText: content,
      style: "\n            font-size:14px;\n            font-weight:600;\n            color:".concat(color, ";\n            position: fixed;\n            left: ").concat(numbericalInterval(e.clientX - 46), "px;\n            top: ").concat(numbericalInterval(e.clientY - 35, [5, window.innerHeight - 35]), "px;\n            background-color:").concat(backgroundColors[type], ";\n            opacity: ").concat(opacity, ";\n            border-radius: 4px;\n            padding: 4px 8px;\n            box-shadow:0 0 5px 0 rgb(255 255 255 / 60%) inset;\n            pointer-event:none;\n            z-index:").concat((Math.floor(Date.now() / 1000) + '').slice(-5), ";\n\t\t\t\t\t\tdisplay:inline-block;\n            ")
    });
    setTimeoutStamp = setTimeout(function () {
      // contentDom.remove()
      contentDom.style.display = 'none';
    }, setTimeoutStep);
  };
}
/**
 * @description dom是否可编辑
 * @param {*} [dom=document.activeElement]
 * @returns {*}  {boolean}
 */

function isContentEditableOfDOM() {
  var dom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.activeElement;
  if (dom.tagName === 'INPUT' || dom.tagName === 'TEXTAREA') {
    return !dom.disabled;
  } else {
    return !!findParentElement(dom, function (dom) {
      return dom.contentEditable === 'true';
    }, null);
  }
}

/**
 * @description 数字区间
 * @param {*} val
 * @param {*} [interval=[10, window.innerWidth]]
 * @returns {*}
 */
function numbericalInterval(val) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [5, window.innerWidth - 130];
  var indexStart = interval[0];
  var indexEnd = interval[1];
  if (val < indexStart) return indexStart;
  if (val > indexEnd) return indexEnd;
  return val;
}

/**
 * @description 可滚动的dom
 * @param {*} dom
 * @returns {*}
 */
function findHasScrollbarDom(dom) {
  if (!(dom instanceof HTMLElement)) {
    console.warn("\u53EF\u6EDA\u52A8\u7684dom\u51FD\u6570 findHasScrollbarDom:\u53C2\u6570dom\u5FC5\u987B\u4E3Aelement\u5143\u7D20 ");
    return void 0;
  }
  while (dom) {
    if (dom.offsetHeight < dom.scrollHeight && !(window.getComputedStyle(dom).overflowY == 'visible' || window.getComputedStyle(dom).overflowY == 'hidden')) {
      break;
    }
    dom = dom.parentElement;
  }
  if (!dom || dom === document.body) {
    // 始终是 documentElement等同于window
    dom = document.documentElement;
  }
  console.warn("\u9875\u9762\u6EDA\u52A8\u5143\u7D20\u7684tagName: ", dom.tagName.toLocaleLowerCase(), 'dom.className：', dom.className);
  return dom;
}

/**
 * @description 获取方法配置
 * @param {string} [key='']
 * @param {*} [defaultOpt={ includedUrls: [] }]
 * @returns {*} {Object}
 **/
function getSettingFromLocalStorage() {
  var fileName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var defaultOpt = arguments.length > 1 ? arguments[1] : undefined;
  var mergedSettingOpt = _objectSpread({
    runType: '0',
    includedUrls: [],
    excludeUrls: []
  }, defaultOpt);
  var fullSettingKey = "enjoy_setting";
  var storageData = localStorage.getItem(fullSettingKey);
  var fullSettings = storageData ? JSON.parse(storageData) : {};
  var SETTING = _objectSpread(_objectSpread({}, mergedSettingOpt), fullSettings === null || fullSettings === void 0 ? void 0 : fullSettings[fileName]);
  fullSettings[fileName] = SETTING;
  fullSettings.runTypeDest = undefined;
  fullSettings.instructions = "\n\u4E00\u3001\u5339\u914D\u89C4\u5219\u4F18\u5148\u7EA7\uFF1Aruntype > * > excludedUrls > includedUrls\n\u4E8C\u3001runType\u662F\u9488\u5BF9\u5728\u5F53\u524D\u57DF\u540D\u89C4\u5219\uFF1A0(\u9ED8\u8BA4\u6267\u884C\u5339\u914D\u89C4\u5219)\uFF1B1(\u5F3A\u5236\u6267\u884C,\u5373\u8DF3\u8FC7\u5339\u914D\u89C4\u5219)\uFF1B2(\u4E0D\u6267\u884C)\n";
  localStorage.setItem(fullSettingKey, JSON.stringify(fullSettings || {}, null, 2));
  return SETTING;
}

/**
 * @description 是否执行该方法
 * @param {*} [settingOpt={}]
 * @returns {*}  {Boolean}
 */
function isExcutableBySetting() {
  var settingOpt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var runType = settingOpt.runType,
    _settingOpt$excludeUr = settingOpt.excludeUrls,
    excludeUrls = _settingOpt$excludeUr === void 0 ? [] : _settingOpt$excludeUr,
    _settingOpt$includedU = settingOpt.includedUrls,
    includedUrls = _settingOpt$includedU === void 0 ? [] : _settingOpt$includedU;
  if (runType == '1') return true;
  if (runType == '2') return false;
  var HREF = location.href;
  if (excludeUrls !== null && excludeUrls !== void 0 && excludeUrls.length && isMatched(excludeUrls, HREF)) {
    return false;
  }
  if ((includedUrls === null || includedUrls === void 0 ? void 0 : includedUrls.length) === 0) return true;
  var findOne = isMatched(includedUrls, HREF);
  return !!findOne;
}

/**
 * @description 是否不执行
 * @param {String} fileName
 * @param {Object} settingOpt { excludeUrls: [ ],feature:"feature",includedUrls: [ ],name: "name",runType: "0",}
 * @returns {Boolean}
 */
function codeIsNotExcutable(fileName, settingOpt) {
  try {
    // logSettingOptWithColor()
    var setting = getSettingFromLocalStorage(fileName, settingOpt);
    return _objectSpread({
      notExcutable: !isExcutableBySetting(setting)
    }, setting);
  } catch (error) {
    // base64路径下，禁用storage
    console.error(error);
    return _objectSpread({
      notExcutable: true
    }, settingOpt);
  }
}

/**
 * @description 彩色打印
 * @param {string} [key='enjoy_setting']
 */
function logSettingOptWithColor(key) {
  var dataKey = 'is-log-of-enjoy';
  if (true) return;
  // if (document.body.getAttribute(dataKey)) return
  document.body.setAttribute(dataKey, '1');

  // clearTimeout(window.EnjoyColorLogTimer || 0)
  window.EnjoyColorLogTimer = setTimeout(function () {
    var _key;
    (_key = key) !== null && _key !== void 0 ? _key : key = 'enjoy_setting';
    var SETTINGS = JSON.parse(localStorage[key] || '{}');
    console.log("%c\uD83D\uDC47 ".concat(key, " \u8BBE\u7F6E\u53C2\u6570\uFF1A"), 'background:#4e0ab780;color:#fff;', '\n', SETTINGS, "\n\nkeyNameList:", Object.keys(SETTINGS));
    console.log("%c\uD83D\uDC47\u81EA\u5B9A\u4E49\u914D\u7F6E\uFF0C\u4EE3\u7801\u5982\u4E0B\uFF1A", 'background:#4e0ab747;color:#fff;', "\n\u5F53\u524D\u57DF\u540D\u4E0B\u662F\u5426\u8FD0\u884C\u76F8\u5E94\u51FD\u6570,", "\n\u8BBE\u7F6ErunType(1\u3001\u5F3A\u5236\u8FD0\u884C\uFF1B2\u3001\u4E0D\u8FD0\u884C)\u3002", '\n\n', modifyRuntype.toString(), "\nmodifyRuntype('keyName',2)");
  }, 3 * 1000);
}
/**
 * @description 修改运行机制
 * @export
 * @param {string} keyName
 * @param {0|1|2} runType
 */
function modifyRuntype(keyName, runType) {
  var keyOfSETTINGS = 'enjoy_setting';
  var SETTINGS = JSON.parse(localStorage.getItem(keyOfSETTINGS) || '{}');
  if (!SETTINGS[keyName]) return;
  SETTINGS[keyName].runType = runType || 2;
  localStorage.setItem(keyOfSETTINGS, JSON.stringify(SETTINGS, null, 2));
}

/**
 * @description 查找特定条件的父级元素
 * @export
 * @param {Element} dom
 * @param {Function} callback
 * @param {Element} [defaultVal=document.documentElement]
 * @returns {Element}
 */
function findParentElement(dom, callback) {
  var defaultVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  if (!(dom instanceof HTMLElement)) {
    console.warn("\u67E5\u627E\u7279\u5B9A\u6761\u4EF6\u7684\u7236\u7EA7\u5143\u7D20\u51FD\u6570 findParentElement:\u53C2\u6570dom\u5FC5\u987B\u4E3Aelement\u5143\u7D20 ");
    return void 0;
  }
  while (dom) {
    if (callback(dom)) {
      break;
    }
    dom = dom.parentElement;
  }
  if (!dom || dom === document.body) {
    // 始终是 documentElement等同于window
    dom = defaultVal;
  }
  return dom;
}

/** 原生横向滚动条 吸附 页面底部 */
var StickyHorizontalNativeScrollBar = /*#__PURE__*/(/* unused pure expression or super */ null && (_createClass(function StickyHorizontalNativeScrollBar() {
  var _this = this;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, StickyHorizontalNativeScrollBar);
  /** 创建滚轴组件元素 */
  _defineProperty(this, "createScrollbar", function () {
    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    if (_this.scrollbar) return _this.scrollbar;
    var timer = Date.now();
    _this.thumbId = "thumb".concat(timer);
    _this.scrollbarId = "scrollbar".concat(timer);
    _this.scrollbar = document.createElement('div');
    _this.scrollbar.setAttribute('id', _this.scrollbarId);
    _this.scrollbar.innerHTML = "\n\t\t\t<style>\n\t\t\t\t#".concat(_this.scrollbarId, " {\n\t\t\t\t\tposition: sticky;\n\t\t\t\t\twidth: 100%;\n\t\t\t\t\tbox-shadow: 0 15px 0 0 #fff;\n\t\t\t\t\tbottom: 8px;\n\t\t\t\t\tleft: 0;\n\t\t\t\t\theight: 17px;\n\t\t\t\t\toverflow-x: auto;\n\t\t\t\t\toverflow-y: hidden;\n\t\t\t\t\tmargin-top: -17px;\n\t\t\t\t\tz-index: 3;\n\t\t\t\t\t").concat(style, "\n\t\t\t\t}\n\t\t\t</style>\n\t\t\t<div id=\"").concat(_this.thumbId, "\" style=\"height: 1px;\"></div>\n\t\t");
  });
  /** 把滚轴组件元素插入目标元素的后面 */
  _defineProperty(this, "insertScrollbar", function (el) {
    _this.target = el;
    if (typeof el === 'string') {
      _this.target = document.querySelector(el);
    }
    if (!_this.target) throw Error('el Dom do not exit');
    _this.targetParentElement = document.querySelector(el).parentElement;
    if (!_this.targetParentElement.querySelector("#".concat(_this.scrollbarId))) {
      _this.targetParentElement.insertBefore(_this.scrollbar, _this.target.nextSibling);
    }
    return _this.target;
  });
  /** 设置 滚轴组件元素尺寸 */
  _defineProperty(this, "setScrollbarSize", throttle(function () {
    _this.scrollbar.style.width = _this.target.clientWidth + 'px';
    _this.scrollbar.querySelector("#".concat(_this.thumbId)).style.width = _this.target.scrollWidth + 'px';
  }, 100));
  /** 监听目标元素和滚轴元素的scroll和页面resize事件 */
  _defineProperty(this, "onEvent", function () {
    _this.target.addEventListener('scroll', _this.onScrollTarget);
    _this.scrollbar.addEventListener('scroll', _this.onScrollScrollbar);
    window.addEventListener('resize', _this.setScrollbarSize);
  });
  /** 移除事件 */
  _defineProperty(this, "removeEvent", function () {
    _this.target.removeEventListener('scroll', _this.onScrollTarget);
    _this.scrollbar.removeEventListener('scroll', _this.onScrollScrollbar);
    window.removeEventListener('resize', _this.setScrollbarSize);
  });
  _defineProperty(this, "onScrollTarget", throttle(function (e) {
    _this.scrollbar.scrollLeft = e.target.scrollLeft;
  }, 100));
  _defineProperty(this, "onScrollScrollbar", throttle(function (e) {
    _this.target.scrollLeft = e.target.scrollLeft;
  }, 100));
  var _el = options.el,
    _options$style = options.style,
    _style = _options$style === void 0 ? '' : _options$style;
  this.createScrollbar(_style);
  this.insertScrollbar(_el);
  this.setScrollbarSize();
  this.onEvent();
})));

/** 插入横向滚动条 */
var HorizontalScrollBar = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function HorizontalScrollBar() {
    var _this2 = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, HorizontalScrollBar);
    /** 创建滚轴组件元素 */
    _defineProperty(this, "createScrollbar", function (setStyle) {
      if (_this2.scrollbar) return _this2.scrollbar;
      var timer = Date.now();
      _this2.scrollbarId = "scrollbar".concat(timer);
      _this2.scrollbar = document.createElement('div');
      _this2.scrollbar.setAttribute('data-part', 'scrollbar');
      _this2.scrollbar.setAttribute('id', _this2.scrollbarId);
      _this2.scrollbar.innerHTML = "\n\t\t".concat(setStyle(_this2.scrollbarId) || _this2.setDefaultStyle(_this2.scrollbarId), "\n\t\t<div data-part=\"thumb\"></div>\n\t\t");
    });
    /** 把滚轴组件元素插入目标元素的后面 */
    _defineProperty(this, "insertScrollbar", function (el) {
      _this2.target = el;
      if (typeof el === 'string') {
        _this2.target = document.querySelector(el);
      }
      if (!_this2.target) throw Error('el Dom do not exit');
      _this2.targetParentElement = document.querySelector(el).parentElement;
      if (!_this2.targetParentElement.querySelector("#".concat(_this2.scrollbarId))) {
        _this2.targetParentElement.insertBefore(_this2.scrollbar, _this2.target.nextSibling);
      }
      return _this2.target;
    });
    /** 根据目标元素 设置 滚轴组件元素尺寸 */
    _defineProperty(this, "setScrollbarSize", function () {
      _this2.scrollbar.style.width = _this2.target.clientWidth + 'px';
      _this2.thumb = _this2.scrollbar.querySelector('[data-part="thumb"]');
      _this2.thumb.style.width = _this2.scrollbar.clientWidth * _this2.target.clientWidth / _this2.target.scrollWidth + 'px';
      _this2.offsetMax = _this2.scrollbar.clientWidth - _this2.thumb.clientWidth;
      _this2.rate = (_this2.target.scrollWidth - _this2.target.clientWidth) / _this2.offsetMax;
    });
    /** */
    _defineProperty(this, "onMouseDownOfThumb", function (e) {
      console.log("mousedown => %O ");
      _this2.prePageX = e.pageX;
      _this2.isMousedown = true;
    });
    /** */
    _defineProperty(this, "onMouseUpOfWindow", function (e) {
      _this2.isMousedown = false;
    });
    /** */
    _defineProperty(this, "requestAnimationFrameCallback", function (offsetLeft) {
      _this2.thumb.style.left = offsetLeft + 'px';
      _this2.target.scrollLeft = offsetLeft * _this2.rate;
    });
    /** */
    _defineProperty(this, "onMousemoveOfWindow", function (e) {
      if (_this2.isMousedown) {
        var offsetLeft = Number(_this2.thumb.style.left.replace('px', '')) + Number(e.pageX - _this2.prePageX);
        offsetLeft = Math.max(0, offsetLeft);
        offsetLeft = Math.min(offsetLeft, _this2.offsetMax);
        _this2.requestAnimationFrameCallback(offsetLeft);
        _this2.prePageX = e.pageX;
      }
    });
    /** 监听目标元素和滚轴元素的scroll和页面resize事件 */
    _defineProperty(this, "onEvent", function () {
      _this2.thumb.addEventListener('mousedown', _this2.onMouseDownOfThumb);
      window.addEventListener('mouseup', _this2.onMouseUpOfWindow);
      window.addEventListener('mousemove', _this2.onMousemoveOfWindow);
      window.addEventListener('resize', _this2.setScrollbarSize);
    });
    /** 移除事件 */
    _defineProperty(this, "removeEvent", function () {
      _this2.thumb.removeEventListener('mousedown', _this2.onMouseDownOfThumb);
      window.removeEventListener('mouseup', _this2.onMouseUpOfWindow);
      window.removeEventListener('mousemove', _this2.onMousemoveOfWindow);
      window.removeEventListener('resize', _this2.setScrollbarSize);
    });
    var _el2 = options.el,
      _options$setStyle = options.setStyle,
      _setStyle = _options$setStyle === void 0 ? function () {
        return null;
      } : _options$setStyle;
    this.createScrollbar(_setStyle);
    this.insertScrollbar(_el2);
    this.setScrollbarSize();
    this.onEvent();
  }
  return _createClass(HorizontalScrollBar, [{
    key: "setDefaultStyle",
    value: function setDefaultStyle(scrollbarId) {
      return "\n\t\t<style>\n\t\t\t#".concat(scrollbarId, " {\n\t\t\t\theight: 17px;\n\t\t\t\tbackground-color: #f1f1f1;\n\t\t\t\tposition: relative;\n\t\t\t}\n\t\t\t#").concat(scrollbarId, ">[data-part=\"thumb\"] {\n\t\t\t\theight: 100%;\n\t\t\t\tbackground-color: #c1c1c1;\n\t\t\t\tposition: absolute;\n\t\t\t}\n\t\t\t#").concat(scrollbarId, ">[data-part=\"thumb\"]:active {\n\t\t\t\tbackground-color: #787878;\n\t\t\t}\n\t\t</style>\n\t");
    }
  }]);
}()));

/** 持久化数据状态 */
var PersistentStorage = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function PersistentStorage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PersistentStorage);
    var _options$valKey = options.valKey,
      valKey = _options$valKey === void 0 ? 'valKey' : _options$valKey,
      _options$storageType = options.storageType,
      storageType = _options$storageType === void 0 ? 'sessionStorage' : _options$storageType;
    this.valKey = valKey;
    this.storageType = storageType;
  }
  return _createClass(PersistentStorage, [{
    key: "write",
    value: function write(val) {
      val = _typeof(val) === 'object' ? JSON.stringify(val, null, 2) : val;
      val && window[this.storageType].setItem(this.valKey, val);
    }
  }, {
    key: "read",
    value: function read() {
      var val = window[this.storageType].getItem(this.valKey);
      return val ? JSON.parse(val) : val;
    }
  }, {
    key: "remove",
    value: function remove() {
      window[this.storageType].removeItem(this.valKey);
    }
  }]);
}()));

/**
 * @description 节流函数
 * @export
 * @param {Function} func
 * @param {Number} [wait=100]
 * @returns {Function}
 */
function throttle(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var isDoing = false;
  return function () {
    if (isDoing) return;
    isDoing = true;
    func.apply(void 0, arguments);
    setTimeout(function () {
      isDoing = false;
    }, wait);
  };
}

/**
 * @description 防抖函数
 * @export
 * @param {Function} func
 * @param {Number} [wait=100]
 * @param {'end'|'front'} type
 * @returns {Function}
 */
function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'end';
  var timer = 0;
  return function () {
    clearTimeout(timer);
    for (var _len = arguments.length, rest = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      rest[_key2] = arguments[_key2];
    }
    timer = setTimeout.apply(void 0, [func, wait].concat(rest));
  };
}

/**
 * @description 等候
 * @export
 * @param {number} [interval=17]
 * @returns {Promise}
 */
function awaitTime() {
  var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 17;
  return new Promise(function (resolve) {
    setTimeout(resolve, interval);
  });
}

/**
 * @description 打开已在窗口仅激活，不刷新
 * @export
 * @class OpenPlus
 */
var OpenPlus = /*#__PURE__*/(/* unused pure expression or super */ null && (_createClass(function OpenPlus() {
  var _this3 = this;
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, OpenPlus);
  _defineProperty(this, "openPre", function () {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
      return null;
    };
    for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
      rest[_key3 - 1] = arguments[_key3];
    }
    var win = _this3.open.apply(_this3, rest);
    callback === null || callback === void 0 || callback();
    return win;
  });
  _defineProperty(this, "open", function (href) {
    var willOpenTab = _this3.win.tabsCacheOfOpenPlus[href];
    for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
      rest[_key4 - 1] = arguments[_key4];
    }
    if (willOpenTab === undefined) {
      var _this3$win;
      willOpenTab = (_this3$win = _this3.win).open.apply(_this3$win, [href].concat(rest));
      _this3.win.nextOfOpenPlus.forEach(function (item) {
        return item === null || item === void 0 ? void 0 : item();
      });
      return _this3.win.tabsCacheOfOpenPlus[href] = willOpenTab;
    } else if (willOpenTab.closed === true) {
      var _this3$win2;
      return (_this3$win2 = _this3.win).open.apply(_this3$win2, [href].concat(rest));
    } else if (willOpenTab.closed === false) {
      willOpenTab.focus();
      return willOpenTab;
    }
  });
  var _opt$win = opt.win,
    _win = _opt$win === void 0 ? window : _opt$win,
    _opt$next = opt.next,
    next = _opt$next === void 0 ? function () {
      return null;
    } : _opt$next;
  this.win = _win;
  this.win.tabsCacheOfOpenPlus = this.win.tabsCacheOfOpenPlus || {};
  this.win.nextOfOpenPlus = this.win.nextOfOpenPlus || [];
  this.win.nextOfOpenPlus.push(next);
})));
function modifyStorage() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opt$storageName = opt.storageName,
    storageName = _opt$storageName === void 0 ? 'localStorage' : _opt$storageName,
    chainKeys = opt.chainKeys,
    _opt$doType = opt.doType,
    doType = _opt$doType === void 0 ? 'get' : _opt$doType,
    val = opt.val,
    _opt$prefix = opt.prefix,
    prefix = _opt$prefix === void 0 ? 'enjoy_setting' : _opt$prefix;
  if (prefix) {
    chainKeys = "".concat(prefix, ".").concat(chainKeys);
  }
  chainKeys = chainKeys.split('.');
  var keyOfLevel1 = chainKeys.shift();
  var keyOfEnd = chainKeys.pop();
  var isObject = true;
  var storage = null;
  try {
    storage = JSON.parse(window[storageName].getItem(keyOfLevel1));
  } catch (error) {
    isObject = false;
    storage = window[storageName].getItem(keyOfLevel1);
    console.error("".concat(storageName, " ").concat(chainKeys, " \u4E00\u7EA7\u5C5E\u6027\u503C\u4E3A\u57FA\u672C\u7C7B\u578B"));
    return;
  }
  var obj = storage;
  chainKeys.forEach(function (key) {
    obj = obj[key];
  });
  if (doType === 'set') {
    obj[keyOfEnd] = val;
    window[storageName].setItem(keyOfLevel1, JSON.stringify(storage, null, 2));
  } else {
    return obj[keyOfEnd];
  }
}

/**
 * @description 简便的Storage SimpleStorage({ prefix: 'prefix' })
 * @param {*} opt
 */
function storagex() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var Storage = /*#__PURE__*/createClass_createClass(function Storage() {
    var _this4 = this;
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck_classCallCheck(this, Storage);
    defineProperty_defineProperty(this, "storage", null);
    defineProperty_defineProperty(this, "setItem", function (keys, val) {
      _this4.formatChainKeys(keys);
      _this4.getFirstLevelVal();
      _this4.chainVal('set', val);
      return void 0;
    });
    defineProperty_defineProperty(this, "getItem", function (keys) {
      _this4.formatChainKeys(keys);
      _this4.getFirstLevelVal();
      return _this4.chainVal('get');
    });
    defineProperty_defineProperty(this, "removeItem", function (keys) {
      _this4.formatChainKeys(keys);
      _this4.getFirstLevelVal();
      return _this4.chainVal('remove');
    });
    defineProperty_defineProperty(this, "clear", function () {
      var keysWithPrefix = Object.keys(_this4.storage).filter(function (item) {
        return item.startsWith(_this4.prefix);
      });
      keysWithPrefix.forEach(function (key) {
        return _this4.storage.removeItem(key);
      });
      return void 0;
    });
    defineProperty_defineProperty(this, "getFirstLevelVal", function () {
      var state = _this4.storage[_this4.prefix + _this4.startKey];
      try {
        state = JSON.parse(state);
      } catch (error) {}
      _this4.cache = state;
      return state;
    });
    defineProperty_defineProperty(this, "formatChainKeys", function (keys) {
      keys = keys.split('.');
      _this4.startKey = keys.shift();
      _this4.endKey = keys.pop();
      _this4.middlekeys = keys;
      return keys;
    });
    defineProperty_defineProperty(this, "chainVal", function (doType, val) {
      var obj = _this4.cache;
      _this4.middlekeys.forEach(function (key) {
        obj = obj[key];
      });
      if (doType === 'set') {
        if (_this4.endKey) {
          obj[_this4.endKey] = val;
        } else {
          _this4.cache = val;
        }
        _this4.storage.setItem(_this4.prefix + _this4.startKey, _this4.isObject(_this4.cache) ? JSON.stringify(_this4.cache, null, 2) : _this4.cache);
      } else if (doType === 'get') {
        if (_this4.endKey) {
          return obj[_this4.endKey];
        }
        return _this4.cache;
      } else if (doType === 'remove') {
        if (_this4.endKey) {
          var isDeleted = delete obj[_this4.endKey];
          isDeleted && _this4.setItem(_this4.startKey, _this4.cache);
          return isDeleted;
        }
        _this4.storage.removeItem(_this4.prefix + _this4.startKey);
      }
    });
    defineProperty_defineProperty(this, "isObject", function (value) {
      var type = typeof_typeof(value);
      return value != null && (type === 'object' || type === 'function');
    });
    var prefix = opt.prefix,
      storage = opt.storage;
    this.prefix = prefix ? "".concat(prefix, "_") : '';
    this.storage = storage;
  });
  if (opt.storage && sessionStorage.__proto__.setItemX) return opt.storage;
  var storage = new Storage(opt);
  if (opt.storage) return storage;
  if (sessionStorage.__proto__.setItemX) return;
  sessionStorage.__proto__.setItemX = function (key, val) {
    storage.storage = this;
    storage.setItem(key, val);
  };
  sessionStorage.__proto__.getItemX = function (key) {
    storage.storage = this;
    return storage.getItem(key);
  };
  sessionStorage.__proto__.removeItemX = function (key) {
    storage.storage = this;
    return storage.removeItem(key);
  };
  sessionStorage.__proto__.clearX = function () {
    storage.storage = this;
    return storage.clear();
  };
}

/**
 * @description  处理标记内容
 * @param {*} opt
 * @returns {*}
 */
function operateComment(opt) {
  var _opt$text = opt.text,
    text = _opt$text === void 0 ? '' : _opt$text,
    _opt$S = opt.S,
    S = _opt$S === void 0 ? '/*' : _opt$S,
    _opt$E = opt.E,
    E = _opt$E === void 0 ? '*/' : _opt$E,
    _opt$modify = opt.modify,
    modify = _opt$modify === void 0 ? function (val) {
      return val;
    } : _opt$modify;
  var stack = [];
  var index = text.indexOf(S);
  if (index === -1) return text;
  while (index <= text.length - 1) {
    if (text[index] + text[index + 1] == S) {
      stack.push(index);
    } else if (text[index] + text[index + 1] == E) {
      var latestIndex = stack.pop();
      if (latestIndex !== undefined) {
        var middle = modify(text.slice(latestIndex + S.length, index));
        text = text.slice(0, latestIndex) + middle + text.slice(index + S.length);
        index = latestIndex + middle.length;
      }
    }
    index++;
  }
  return text;
}

/** 添加动画函数 */
function addAnimation(dom, className) {
  if (!dom || !className) return;
  if (!dom.animationend) {
    dom.animationend = function () {
      dom.classList.remove(className);
    };
  }
  dom.removeEventListener('animationend', dom.animationend);
  dom.addEventListener('animationend', dom.animationend);
  dom.classList.add(className);
}

// 判断当前浏览器运行环境
function getBrowserEnv() {
  var userAgent = window.navigator.userAgent.toLowerCase();
  var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  // 是否为支付宝环境
  var isAliPay = /alipayclient/.test(userAgent);
  // 是否为淘宝环境
  var isTaoBao = /windvane/.test(userAgent);
  // 是否为企业微信环境
  var isWxWork = /wxwork/.test(userAgent);
  // 是否为微信环境
  var isWeChat = /micromessenger/.test(userAgent) && !isWxWork;
  // 是否为移动端
  var isPhone = agents.some(function (x) {
    return new RegExp(x.toLocaleLowerCase()).test(userAgent);
  });
  return {
    isAliPay: isAliPay,
    isTaoBao: isTaoBao,
    isWxWork: isWxWork,
    isWeChat: isWeChat,
    isPhone: isPhone
  };
}
var RegisterDbltouchEvent = /*#__PURE__*/(/* unused pure expression or super */ null && (function () {
  function RegisterDbltouchEvent(el, fn) {
    _classCallCheck(this, RegisterDbltouchEvent);
    this.el = el || window;
    this.callback = fn;
    this.timer = null;
    this.prevPosition = {};
    this.isWaiting = false;

    // 注册click事件，注意this指向
    this.el.addEventListener('click', this.handleClick.bind(this), true);
  }
  return _createClass(RegisterDbltouchEvent, [{
    key: "handleClick",
    value: function handleClick(evt) {
      var _this5 = this;
      var pageX = evt.pageX;
      var pageY = evt.pageY;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (!evt.isTrusted) {
        return;
      }
      if (this.isWaiting) {
        this.isWaiting = false;
        var diffX = Math.abs(pageX - this.prevPosition.pageX);
        var diffY = Math.abs(pageY - this.prevPosition.pageY);
        // 如果满足位移小于10，则是双击
        if (diffX <= 10 && diffY <= 10) {
          // 取消当前事件传递，并派发1个自定义双击事件
          evt.stopPropagation();
          evt.target.dispatchEvent(new PointerEvent('dbltouch', {
            cancelable: false,
            bubbles: true
          }));
          // 也可以采用回调函数的方式
          this.callback && this.callback(evt);
        }
      } else {
        this.prevPostion = {
          pageX: pageX,
          pageY: pageY
        };
        // 阻止冒泡，不让事件继续传播
        evt.stopPropagation();
        // 开始等待第2次点击
        this.isWaiting = true;
        // 设置200ms倒计时，200ms后重新派发当前事件
        this.timer = setTimeout(function () {
          _this5.isWaiting = false;
          evt.target.dispatchEvent(evt);
        }, 200);
      }
    }
  }]);
}()));
/**移动端 双击 */
function addDbltouch() {
  var dom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var handle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (event) {
    console.log('双击', event, Date.now());
  };
  var preTimestamp = 0;
  dom.addEventListener('click', function (event) {
    var currentTimestamp = Date.now();
    if (currentTimestamp - preTimestamp < 200) handle(event);
    preTimestamp = currentTimestamp;
  });
}

/**
 * @description 获取dom
 * @export
 * @param {*} element
 * @param {*} selector
 * @param {number} [timeout=80]
 * @param {boolean} [isAlways=true]
 * @returns {*}
 */
function getElement(_x, _x2) {
  return _getElement.apply(this, arguments);
}

/**
 * @description 分隔dom分区
 * @param {*} e
 * @param {number} [divideX=3]
 * @param {*} [divideY=divideX]
 * @returns {*} string
 */
function _getElement() {
  _getElement = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(element, selector) {
    var timeout,
      isAlways,
      count,
      _args = arguments;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          timeout = _args.length > 2 && _args[2] !== undefined ? _args[2] : 80;
          isAlways = _args.length > 3 && _args[3] !== undefined ? _args[3] : true;
          count = 0;
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var timeId = setInterval(function () {
              if (timeout && count++ >= timeout) {
                clearInterval(timeId);
                console.warn('[utils.getElement] Element is not find.' + ' selector: ' + selector);
                // 保持原生逻辑，即未找到时，返回null,便于之后执行埋点，比如错误上报
                return resolve(null);
              }
              var node = element.querySelector(selector);
              if (node) {
                //node 总是返回 或 显示状态条件下，找到后即刻返回
                if (isAlways || node.offsetParent) {
                  resolve(node);
                  clearInterval(timeId);
                }
              }
            }, 200);
          }));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getElement.apply(this, arguments);
}
function divideDom(e) {
  var divideX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var divideY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : divideX;
  if (!divideX) {
    throw new Error('divideDom 函数 divideX 参数不能为空');
  }
  if (!divideY) {
    divideX = divideY;
    console.warn("divideDom \u51FD\u6570 dom \u5206\u533A \u4E3A ".concat(divideX, "*").concat(divideY));
  }
  var resultStr = "".concat(getIdx(e.target.offsetWidth, divideX, e.offsetX), "-").concat(getIdx(e.target.offsetHeight, divideY, e.offsetY));
  console.log("resultStr => %O ", resultStr);
  return resultStr;

  // 获取坐标
  function getIdx(size, divide, offsetPosition) {
    var size_step = Math.ceil(size / divide);
    var posi_idx = Math.floor(offsetPosition / size_step);
    if (offsetPosition % size_step) {
      posi_idx++;
    }
    return posi_idx;
  }
}
;// CONCATENATED MODULE: ./src/tool/vimport.js



function run() {
  return _run.apply(this, arguments);
}

/**
 * @description
 * @export
 * @param {'dayjs@1.11.9'|dayjs} moduleAndVersion
 */
function _run() {
  _run = asyncToGenerator_asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee() {
    var setting;
    return regenerator_default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          setting = codeIsNotExcutable('vimport', {
            name: '快捷导入js模块cdn版本包',
            feature: '快捷导入js模块cdn版本包',
            importQueue: [],
            // 单击时，按网站设计的方式跳转 ['dayjs','vue']
            usage: "importQueue= ['dayjs','vue']，会一次导入dayjs，vue"
          });
          if (!setting.notExcutable) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return");
        case 4:
          window.vimport = bootcdn;
          autoImport(setting.importQueue);
          _context.next = 11;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return _run.apply(this, arguments);
}
function bootcdn(_x) {
  return _bootcdn.apply(this, arguments);
}
function _bootcdn() {
  _bootcdn = asyncToGenerator_asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee2(moduleAndVersion) {
    var setting, serializerOfDocument;
    return regenerator_default().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (moduleAndVersion) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return");
        case 2:
          collectQueue(moduleAndVersion);
          setting = formatParams(moduleAndVersion);
          console.log("setting => %O ", setting);
          _context2.next = 7;
          return fetch("https://unpkg.com/".concat(moduleAndVersion), {
            method: 'GET'
          });
        case 7:
          _context2.next = 9;
          return _context2.sent.text();
        case 9:
          serializerOfDocument = _context2.sent;
          if (serializerOfDocument) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", console.warn('${moduleAndVersion} 引入失败，未找到相应版'));
        case 12:
          console.warn('${moduleAndVersion} 引入成功');
          console.warn("\u5F15\u5165\u5730\u5740\uFF1Ahttps://unpkg.com/".concat(moduleAndVersion));
          console.warn('请用window.${setting.rename}访问');
          createElement('script', {
            randomType: 'new',
            el: 'body',
            src: "https://unpkg.com/".concat(moduleAndVersion)
          });
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _bootcdn.apply(this, arguments);
}
function formatParams(moduleAndVersion) {
  moduleAndVersion = moduleAndVersion.split('@');
  return {
    name: moduleAndVersion[0],
    version: moduleAndVersion[1] || '',
    url: moduleAndVersion.join('/') + '/',
    rename: moduleAndVersion[0] + (moduleAndVersion[1] || '').replace(/\./g, '_')
  };
}

// 栈 stack 队列 queue
function collectQueue(moduleAndVersion) {
  var importQueue = JSON.parse(sessionStorage.importcdn || '[]');
  var importQueueSet = new Set(importQueue);
  console.log("moduleAndVersion => %O ", moduleAndVersion);
  importQueueSet.add(moduleAndVersion);
  importQueue = Array.from(importQueueSet);
  console.log("importQueue => %O ", importQueue);
  sessionStorage.importQueue = JSON.stringify(importQueue);
}
function autoImport(importQueue) {
  var importQueueSet = new Set(importQueue);
  importQueue = Array.from(importQueueSet);
  importQueue.forEach(function (moduleName) {
    window.importcdn(moduleName);
  });
  console.warn('当前tab页，一次导入包', importQueue);
}
;// CONCATENATED MODULE: ./src/GlobalTools.js






function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = GlobalTools_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function GlobalTools_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return GlobalTools_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? GlobalTools_arrayLikeToArray(r, a) : void 0; } }
function GlobalTools_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function GlobalTools_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function GlobalTools_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? GlobalTools_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : GlobalTools_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


run();
storagex();
GlobalTools_run(window);
function GlobalTools_run(win) {
  // getLogObjectValue(['$0', 'temp1'])
  // windowProxy()
  var tools = {
    backPrototype: backPrototype,
    createPlainFile: createPlainFile,
    getRegMobile: getRegMobile,
    phoneFormat: phoneFormat,
    getRegName: getRegName,
    getRegEmail: getRegEmail,
    getRegIDCard: getRegIDCard,
    getQuery: getQuery,
    toSearch: toSearch,
    transformThousandth: transformThousandth,
    deleteProperty: deleteProperty,
    asyncRequire: asyncRequire,
    transformData: transformData,
    previewFile: previewFile,
    dateUtil: dateUtil,
    toWithOpener: toWithOpener,
    downloadFile: downloadFile,
    base64ToBlob: base64ToBlob,
    base64ImgtoFile: base64ImgtoFile,
    isHasBtnPower: isHasBtnPower,
    getBrowerEnv: getBrowerEnv,
    formatReportDataToStr: formatReportDataToStr,
    copyStrToClipboard: copyStrToClipboard,
    getPropertiesOfObj: getPropertiesOfObj,
    lgd: lgd,
    lg$0: lg$0,
    lgdt1: lgdt1,
    getPrototypeChainOfObject: getPrototypeChainOfObject,
    getLogObjectValue: getLogObjectValue,
    storagex: storagex,
    pickFileDom: pickFileDom,
    mockArr: mockArr,
    getArr: mockArr,
    getBasepath: getBasepath,
    downloadFileByAElement: downloadFileByAElement,
    selectFilesByInput: selectFilesByInput
  };

  /** 选择文件，支持多选 */
  function selectFilesByInput() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (files) {
      return null;
    };
    // 选择文件，支持多选

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    // input.setAttribute('accept','*')
    input.setAttribute('multiple', '');
    input.addEventListener('input', function () {
      console.log('input = ', input, 'input.files=', input.files);
      callback(input.files);
    });
    input.click();
  }

  /** 获取静态资源的文件名 */
  function getBasepath(fileUrl) {
    var _a$pathname$match;
    /** 获取静态资源的文件名 */
    if (!fileUrl) {
      console.error('getBasepath 函数 fileUrl参数不能为空');
      return fileUrl;
    }
    var a = document.createElement('a');
    a.href = fileUrl;
    var basepath = ((_a$pathname$match = a.pathname.match(/[^/]*?$/)) === null || _a$pathname$match === void 0 ? void 0 : _a$pathname$match[0]) || '';
    var filename = '';
    var mimetype = '';
    if (basepath) {
      var mimeTypeMatch = basepath.match(/\.[^.]*$/);
      if (mimeTypeMatch) {
        mimetype = mimeTypeMatch[0];
        filename = basepath.slice(0, mimeTypeMatch.index);
      } else {
        filename = basepath;
      }
    }
    return {
      basepath: basepath,
      filename: filename,
      mimetype: mimetype
    };
  }

  /** @描述 通过 a标签下载文件  */
  function downloadFileByAElement(url) {
    var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    /** @描述 通过 a标签下载文件  */
    if (!url) {
      throw new Error('downloadFileByAElement 函数中 url不能为空 ');
    }
    fetch(url, {
      method: 'get',
      responseType: 'blob'
    }).then(function (res) {
      return res.blob();
    }).then(function (blob) {
      var basePathObj = getBasepath(url);
      if (filename) {
        if (!filename.endsWith(basePathObj.mimetype)) {
          filename += basePathObj.mimetype;
        }
      }
      var link = document.createElement('a');
      link.setAttribute('download', filename || basePathObj.basepath);
      link.href = window.URL.createObjectURL(new Blob([blob]));
      link.click();
      window.URL.revokeObjectURL(link.href);
    })["catch"](function (err) {
      console.error(err);
      // 报错时，跳转新页面
      var link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.href = url;
      link.click();
    });
  }

  /** mock 生成数组 */
  function mockArr() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (id) {
      return {
        id: id
      };
    };
    /** mock 生成数组 */
    // Array.from(new Array(10),item=>item)
    return new Array(count).fill(undefined).map(function (item, index) {
      return cb(index, index);
    });
  }
  /** 获取文件 */
  function pickFileDom() {
    /** 获取文件 */
    var pickFileDom = createElement('input', {
      el: 'body',
      id: 'pickFileDom',
      addPrefix: false,
      autoInsert: true,
      type: 'file',
      style: 'position:fixed;top:-100px'
    });
    pickFileDom.addEventListener('change', function (e) {
      var _e$target;
      if ((_e$target = e.target) !== null && _e$target !== void 0 && _e$target.files) {
        console.log(e.target.files[0]);
      }
    });
    pickFileDom.click();
  }
  function getPrototypeChainOfObject(Obj) {
    /** @描述 对象原型链 */

    var idx = 0;
    var str = "".concat(Obj.name || '参数', "\u7684\u539F\u578B\u94FE\u662F\uFF1A ");
    next(Obj);
    return str;

    /** @描述 递归 */
    function next(obj) {
      var _ObjType$match;
      var ObjType = Object.toLocaleString.call(obj);
      var ObjFlag = ((_ObjType$match = ObjType.match(/^\[object ([a-zA-Z]+)\]/)) === null || _ObjType$match === void 0 ? void 0 : _ObjType$match[1]) || typeof_typeof(ObjType);
      str += "\u7B2C ".concat(idx, " \u7EA7\u3010").concat(ObjFlag, "\u3011.__proto__ \u25B6\uFE0F ");
      idx++;
      if (obj.__proto__) {
        next(obj.__proto__);
      } else {
        str += "\u7B2C ".concat(idx, " \u7EA7\u3010null\u3011");
      }
    }
  }
  function lgdt1() {
    var _console;
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }
    /** @描述 以对象形式打印 $0 */
    (_console = console).log.apply(_console, ["temp1 ==%O", temp1].concat(rest));
  }
  function lgd() {
    var _console3;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    /** @描述 以对象形式打印 temp1 */

    var desc = args[0],
      rest = args.slice(1);
    if (rest.length && typeof desc === 'string') {
      var _console2;
      return (_console2 = console).log.apply(_console2, ["".concat(desc, " %O")].concat(_toConsumableArray(rest)));
    }
    (_console3 = console).log.apply(_console3, ["%O"].concat(args));
  }
  function lg$0() {
    var _console4;
    for (var _len3 = arguments.length, rest = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      rest[_key3] = arguments[_key3];
    }
    /** @描述 以对象形式打印 $0 */
    (_console4 = console).log.apply(_console4, ["$0 ==%O", $0].concat(rest));
  }
  function backPrototype(resourceObj) {
    /**
     * @description 对象原型链:继承谁的属性和方法
     * @param {*} resourceObj
     * @returns {*} string
     */

    var str = '';
    next(resourceObj);
    str = str + 'null';
    console.log("%c \u8BE5\u5BF9\u8C61\u539F\u578B\u94FE\u662F\uFF1A", 'color:red', str);
    return str;
    function next(obj) {
      var _ObjType$match2;
      var ObjType = Object.toLocaleString.call(obj);
      var ObjFlag = ((_ObjType$match2 = ObjType.match(/^\[object ([a-zA-Z]+)\]/)) === null || _ObjType$match2 === void 0 ? void 0 : _ObjType$match2[1]) || '无';
      str = str + ObjFlag + ' + .__proto__ >> ';
      if (obj.__proto__) {
        next(obj.__proto__);
      }
    }
  }
  function createPlainFile() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      a: 'a'
    };
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'name';
    /**
     * @description 创建文本文件
     * @param {string} [content={ a: 'a' }]
     * @param {string} [name='name']
     */

    // 下载保存json文件
    var eleLink = document.createElement('a');
    eleLink.download = name + '.json';
    // 字符内容转变成blob地址
    var data = JSON.stringify(content, undefined, 4);
    var blob = new Blob([data], {
      type: 'text/json'
    });
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    eleLink.click();
    // 然后移除
  }
  function getRegMobile() {
    /** @描述 正则 - 手机号 */
    return /^1[2|3|4|5|6|7|8|9][\d]{9}$/;
  }
  function phoneFormat() {
    var phone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    /** @描述 格式化 - 手机号 */
    if (!phone || !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(phone)) return;
    phone = phone.replace(/\D/g, '').slice(0, 11);
    phone = phone.replace(/^(\d{3})/, '$1  ').replace(/(\d{4})/, '$1  ').replace(/[\s]+$/, '');
    return phone;
  }
  function getRegName() {
    /** @描述 正则 - 姓名 */

    return /^[0-9|A-Za-z|\u4e00-\u9fa5|\s]+$/;
  }
  function getRegEmail() {
    /** @描述 正则 - 邮箱 */

    return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
  }
  function getRegIDCard() {
    /** @描述 正则 - 大陆身份证号码 */
    return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  }
  function getQuery() {
    var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.search;
    /** @描述 获取 url 参数 */

    var query = {};
    search.substr(1).split('&').forEach(function (str) {
      var strArr = str.split('=');
      var key = strArr[0];
      if (!key) return;
      var val = decodeURIComponent(strArr[1]);
      try {
        val = JSON.parse(val);
      } catch (err) {}
      query[key] = val;
    });
    return query;
  }
  function toSearch() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    /** @描述 转换成 url search */
    var arr = Object.keys(obj).map(function (key) {
      var val = obj[key];
      if (typeof val !== 'string') {
        try {
          val = JSON.stringify(val);
        } catch (err) {
          console.error(err);
        }
      }
      return "".concat(key, "=").concat(encodeURIComponent(val));
    });
    return '?' + arr.join('&');
  }
  function transformThousandth(value, fixed) {
    /**
     * 格式化金额 千分符
     * @param value
     * @param fixed
     */

    var needFixed = fixed != null;
    var num = Number(value);
    if (isNaN(num)) {
      return needFixed ? 0 .toFixed(fixed) : '0';
    }
    // return (needFixed ? num.toFixed(fixed) : num.toString()).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
    var str = needFixed ? num.toFixed(fixed) : num.toString();
    var arr = str.split('.');
    var result = arr[0] ? arr[0].replace(/(?=(?!\b)(\d{3})+$)/g, ',') : '0';
    if (arr[1] != null) {
      result += ".".concat(arr[1]);
    }
    return result;
  }
  function deleteProperty() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [undefined, null, ''];
    /**
     * 删除指定值的属性
     * @param obj
     */

    var res = {};
    var isArray = Array.isArray(v);
    for (var key in obj) {
      if (isArray) {
        if (!v.includes(obj[key])) res[key] = obj[key];
      } else {
        if (obj[key] !== v) res[key] = obj[key];
      }
    }
    return res;
  }
  function asyncRequire(url, name, type) {
    /**
     * 通过插入标签以加载 js/css 文件
     * @param {String} url 需要载入的 js/css url
     * @param {String} name 文件载入后挂载到 window 下的变量名
     * @param {String} type 文件类型 默认取后缀名
     */

    return new Promise(function (resolve, reject) {
      var head = document.head || document.getElementsByTagName('head')[0] || document.body;
      var filePath = url.split('?')[0];
      var ext = filePath.substring(filePath.lastIndexOf('.') + 1);
      if (document.getElementById("async-require-".concat(name || 'unknown'))) {
        return resolve(name ? window[name] : 'loaded');
      }
      var element;
      if (ext == 'js' || type == 'js') {
        element = document.createElement('script');
        element.src = url;
        element.onload = function (e) {
          return resolve(name ? window[name] : e);
        };
      } else if (ext == 'css' || type == 'css') {
        element = document.createElement('link');
        element.rel = 'stylesheet';
        element.type = 'text/css';
        element.href = url;
        element.onload = resolve;
      } else {
        return console.warn('好像有点不对劲...请指定文件类型: js | css');
      }
      element.id = "async-require-".concat(name);
      element.onerror = reject;
      head.appendChild(element);
    });
  }
  function transformData(sourceData, relation) {
    /**
     * 返回数据
     * @param {Array} sourceData 原数组
     * @param {Array} 映射字段
     */

    return sourceData.map(function (item) {
      var _relation = _slicedToArray(relation, 2),
        key = _relation[0],
        name = _relation[1];
      return {
        label: item[name],
        value: item[key]
      };
    });
  }
  function previewFile(fileUrl) {
    /**
     * 在线预览文件
     * @param  {String}  fileUrl  静态资源地址
     */

    var link = document.createElement('a');
    link.href = fileUrl;
    var ext = (link.pathname.split('.')[1] || '').toLowerCase();
    var allowedExt = {
      bmp: 1,
      gif: 1,
      jpg: 1,
      jpeg: 1,
      png: 1,
      apng: 1,
      webp: 1,
      htm: 1,
      html: 1,
      pdf: 1
    };
    if (ext && allowedExt[ext]) {
      var _window;
      var url = "https://static.hrwork.com/tools/pdfviewer/index.html?file=".concat(encodeURIComponent(fileUrl));
      if ((_window = window) !== null && _window !== void 0 && _window.__ZPA_CRX) {
        return void dispatchEvent(new CustomEvent('$create_tab', {
          detail: url
        }));
      }
      window.open(url);
    } else {
      alert("\u4E0D\u652F\u6301\u5728\u7EBF\u9884\u89C8\u6B64\u7C7B\u578B(".concat(ext !== null && ext !== void 0 ? ext : '', ")\u6587\u4EF6"));
    }
  }
  function dateUtil() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
    /**
     * 获取特定格式日期
     * date: 可以为日期字符串、日期对象，不传参数默认当前系统时间
     * format: 输出日期时间格式, 不传参数默认 YYYY-MM-DD HH:mm:ss 格式
     * 例：
     * dateUtil().format()
     * // 2022-06-16 11:56:02
     *
     * // 不传入日期，默认以当前日期，格式化为特定格式日期
     * dateUtil().format('YYYY年MM月DD日 (周W) HH时mm分ss秒')
     * // 2022年06月16日 (周四) 12时01分51秒
     *
     * // 传入指定日期(string | date)，格式化为指定格式日期(string)
     * dateUtil('2015.7.12').format('YYYY年MM月DD日 HH时mm秒ss分 星期W')
     * // 2015年07月12日 00时00分00秒 星期三
     */

    time = typeof time === 'string' ? time.replace(/-/g, '/') : time;
    var date = isNaN(new Date(time)) ? time : new Date(time);
    return {
      date: date,
      format: format
    };
    function format() {
      var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'YYYY-MM-DD HH:mm:ss';
      var weeks = ['日', '一', '二', '三', '四', '五', '六'];
      var padStart = function padStart(d) {
        return (d + '').padStart(2, '0');
      };
      var M = date.getMonth() + 1 + '';
      var D = date.getDate() + '';
      var H = date.getHours() + '';
      var m = date.getMinutes() + '';
      var s = date.getSeconds() + '';
      return rule.replace('YYYY', date.getFullYear()).replace('MM', padStart(M)).replace('M', M).replace('DD', padStart(D)).replace('D', D).replace('HH', padStart(H)).replace('H', H).replace('mm', padStart(m)).replace('m', m).replace('ss', padStart(s)).replace('s', s).replace(/W/, weeks[date.getDay()]).replace(/w/, date.getDay());
    }
  }
  function toWithOpener(href) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    /**
     * 共享opener跳转
     * @param { Object } router  如：
     * @param { Object } options  如：
     */

    var _options$target = options.target,
      target = _options$target === void 0 ? '_blank' : _options$target,
      routes = options.routes;
    var win = window.open(href, target);
    // 设置新打开页面的面包屑
    if (routes && Array.isArray(routes)) {
      var cloneRoutes = _toConsumableArray(routes);
      cloneRoutes.shift();
      cloneRoutes[cloneRoutes.length - 1] = GlobalTools_objectSpread(GlobalTools_objectSpread({}, cloneRoutes[cloneRoutes.length - 1]), {}, {
        a: true,
        path: '/zhaopintong/' + location.hash
      });
      win.sessionStorage.parent_routes = JSON.stringify(cloneRoutes);
    }
    return win;
  }
  function downloadFile(href) {
    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    /**
     * 通过url一键下载图片
     * @param { String } href  如:
     * @param { String } fileName  如:
     */

    if (!href) {
      return;
    }
    var aLink = document.createElement('a');
    aLink.download = fileName + Date.now();
    aLink.href = href;
    aLink.click();
  }
  function base64ToBlob(base64Code) {
    /**
     * base64转Blob对象
     * @param { String } code  如：
     */

    var parts = base64Code.split(';base64,');
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uint8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uint8Array], {
      type: contentType
    });
  }
  function base64ImgtoFile(base64Code) {
    var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'file';
    /**
     * base64转文件对象
     * @param { String } base64Code  如：
     * @param { String } filename  如：
     */

    var arr = base64Code.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var suffix = mime.split('/')[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "".concat(filename, ".").concat(suffix), {
      type: mime
    });
  }
  function isHasBtnPower() {
    var powerList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    /**
     * @description 判断角色是否有页面级按钮的权限
     * @param {*} [powerList=[]]
     * @param {string} [code='']
     * @returns {*}  {boolean}
     */

    if (!code) return false;
    if (typeof code === 'string') code = [code];
    var _iterator = _createForOfIteratorHelper(code),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _powerList$includes;
        var value = _step.value;
        if (powerList !== null && powerList !== void 0 && (_powerList$includes = powerList.includes) !== null && _powerList$includes !== void 0 && _powerList$includes.call(powerList, value)) return true;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return false;
  }
  function getBrowerEnv() {
    /** @描述 判断当前浏览器运行环境 */

    var userAgent = window.navigator.userAgent.toLowerCase();
    var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    // 是否为支付宝环境
    var isAliPay = /alipayclient/.test(userAgent);
    // 是否为淘宝环境
    var isTaoBao = /windvane/.test(userAgent);
    // 是否为企业微信环境
    var isWxWork = /wxwork/.test(userAgent);
    // 是否为微信环境
    var isWeChat = /micromessenger/.test(userAgent) && !isWxWork;
    // 是否为移动端
    var isPhone = agents.some(function (x) {
      return new RegExp(x.toLocaleLowerCase()).test(userAgent);
    });
    return {
      isAliPay: isAliPay,
      isTaoBao: isTaoBao,
      isWxWork: isWxWork,
      isWeChat: isWeChat,
      isPhone: isPhone
    };
  }

  //
  function formatReportDataToStr() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var headerLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    /** @描述 格式化报表数据拼接成字符串，以便复制到剪贴板 */

    return arr.reduce(function (pre, cur) {
      return pre + headerLabel.reduceRight(function (pre2, cur2) {
        return "".concat(cur[cur2.key], "\t").concat(pre2);
      }, '\n');
    }, headerLabel.reduceRight(function (pre, cur) {
      return "".concat(cur.title, "\t").concat(pre);
    }, '\n'));
  }
  function copyStrToClipboard(value) {
    /** @描述 把字符串复制到剪贴板 */

    var textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('Copy');
    document.body.removeChild(textarea);
  }
  function copyStrToClipboardOfNavigator(_x) {
    return _copyStrToClipboardOfNavigator.apply(this, arguments);
  }
  function _copyStrToClipboardOfNavigator() {
    _copyStrToClipboardOfNavigator = asyncToGenerator_asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee(value) {
      return regenerator_default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return navigator.clipboard.writeText(value);
          case 2:
            return _context.abrupt("return", _context.sent);
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _copyStrToClipboardOfNavigator.apply(this, arguments);
  }
  function getPropertiesOfObj(_ref) {
    var _ref$obj = _ref.obj,
      obj = _ref$obj === void 0 ? {} : _ref$obj,
      _ref$keys = _ref.keys,
      keys = _ref$keys === void 0 ? [] : _ref$keys;
    /**
     * @描述 获取对象的指定属性集合
     * @param {*} { obj = {}, keys = [] }
     * @returns {*}
     */

    var newObj = {};
    keys.forEach(function (key) {
      newObj[key] = obj[key];
    });
    return newObj;
  }

  /** @描述 定义以对象形式 获取window属性值 */
  function getLogObjectValue(arr) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_o';
    var win2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : win;
    /** @描述 定义以对象形式 获取window属性值 */
    arr.forEach(function (newKey) {
      Object.defineProperty(win2, "".concat(newKey), {
        get: function get() {
          console.log('%O', win2[newKey]);
          return win2[newKey];
        }
      });
    });
  }

  /** @描述 代理window，读取属性时，即打印对象 */
  function windowProxy() {
    var win2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : win;
    /** @描述 代理window，读取属性时，即打印对象 */
    var result;
    win2.enjoy_wp6 = new Proxy(win2, {
      get: function get(obj, prop) {
        result = obj[prop];
        console.log("\uD83C\uDF8F ".concat(prop, "=%O"), result);
        return result;
      }
    });
  }
  if (!win.tls_enjoy) {
    win.tls_enjoy = tools;
  }
  Object.defineProperty(tools, 'fns', {
    /** @描述 对象下的函数名列表 */get: function get() {
      return Object.keys(tools);
    }
  });
}
})();

/******/ })()
;