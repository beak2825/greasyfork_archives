// ==UserScript==
// @name         边读边看图
// @namespace    http://tampermonkey.net/
// @version      0.8.85
// @description  功能一览：1、图文对照: 双击把图片固定在页面上，同时支持缩放、移动功能，便于图文对照阅读； 2、图片背景图: 使用浏览器查看在线图片或本地图片时，增加页面背景图，以便清晰显示当前图片轮廓 3、命名链接：打开链接方式，总是以命名的新窗口，跳转同一个链接页面，只激活,不刷新；4、快捷链接：点击链接文本时，跳转相应链接页面；5、鼠标选中文字后，(0.5秒内)立马松开左键，自动复制文字；反之，保持鼠标不移动超过 0.5秒后再松开，不会复制文字； 6、一键复制代码块：鼠标悬浮代码块后，点击显示的红色边框，复制到剪贴板 7、CSDN：仅在主动触发登录时，显示登录弹层 【最后：1、localStorage中，支持关闭某一特定功能】
// @author       Enjoy
// @icon          https://foruda.gitee.com/avatar/1725500487420291325/4867929_enjoy_li_1725500487.png!avatar200
// @include        *://*/*
// @include        file:///*
// @include        data:*/*;base64,*
// @exclude      *localhost*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @license      GPL License
// 函数文档 https://www.tampermonkey.net/documentation.php#api:GM_addElement
// @homepageURL https://greasyfork.org/zh-CN/scripts/456560
// @downloadURL https://update.greasyfork.org/scripts/456560/%E8%BE%B9%E8%AF%BB%E8%BE%B9%E7%9C%8B%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/456560/%E8%BE%B9%E8%AF%BB%E8%BE%B9%E7%9C%8B%E5%9B%BE.meta.js
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

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/defineProperty.js

function defineProperty_defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

// EXTERNAL MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(501);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
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
      idPrefix = _options$idPrefix === void 0 ? "enjoy_".concat("ImgPreview", "_").concat(tag, "_") : _options$idPrefix,
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
var OpenPlus = /*#__PURE__*/createClass_createClass(function OpenPlus() {
  var _this3 = this;
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  classCallCheck_classCallCheck(this, OpenPlus);
  defineProperty_defineProperty(this, "openPre", function () {
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
  defineProperty_defineProperty(this, "open", function (href) {
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
});
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
  var Storage = /*#__PURE__*/_createClass(function Storage() {
    var _this4 = this;
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Storage);
    _defineProperty(this, "storage", null);
    _defineProperty(this, "setItem", function (keys, val) {
      _this4.formatChainKeys(keys);
      _this4.getFirstLevelVal();
      _this4.chainVal('set', val);
      return void 0;
    });
    _defineProperty(this, "getItem", function (keys) {
      _this4.formatChainKeys(keys);
      _this4.getFirstLevelVal();
      return _this4.chainVal('get');
    });
    _defineProperty(this, "removeItem", function (keys) {
      _this4.formatChainKeys(keys);
      _this4.getFirstLevelVal();
      return _this4.chainVal('remove');
    });
    _defineProperty(this, "clear", function () {
      var keysWithPrefix = Object.keys(_this4.storage).filter(function (item) {
        return item.startsWith(_this4.prefix);
      });
      keysWithPrefix.forEach(function (key) {
        return _this4.storage.removeItem(key);
      });
      return void 0;
    });
    _defineProperty(this, "getFirstLevelVal", function () {
      var state = _this4.storage[_this4.prefix + _this4.startKey];
      try {
        state = JSON.parse(state);
      } catch (error) {}
      _this4.cache = state;
      return state;
    });
    _defineProperty(this, "formatChainKeys", function (keys) {
      keys = keys.split('.');
      _this4.startKey = keys.shift();
      _this4.endKey = keys.pop();
      _this4.middlekeys = keys;
      return keys;
    });
    _defineProperty(this, "chainVal", function (doType, val) {
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
    _defineProperty(this, "isObject", function (value) {
      var type = _typeof(value);
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
;// CONCATENATED MODULE: ./src/tool/previewImg.js




var EMIT_EVENT_TYPE = getBrowserEnv().isPhone ? 'dbltouch' : 'dblclick';
// const EMIT_EVENT_TYPE = 'dblclick'
var ImgPreviewer = /*#__PURE__*/createClass_createClass(function ImgPreviewer() {
  var _this = this;
  var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  classCallCheck_classCallCheck(this, ImgPreviewer);
  defineProperty_defineProperty(this, "createGlobalStyle", function () {
    createElement('style', {
      randomType: 'newOne',
      innerHTML: "\n\t\t\t/* \u7F29\u653E  */\n\t\t\t body img {\n\n\t\t\t /* \u5149\u6807 \u5448\u73B0 \u653E\u5927\u56FE\u6807 */\n\t\t\t /*\tcursor: zoom-in !important; */\n\n\t\t\t/* \u907F\u514D pointer-events: none; \u60C5\u51B5\u51FA\u73B0   inherit  initial  auto */\n       pointer-events: auto !important;\n\n\t\t\t}\n\n\t\t\t/* https://greasyfork.org/zh-CN/scripts/456560-\u8FB9\u8BFB\u8FB9\u770B\u56FE \u4F1A\u4EA7\u751F\u6210\u4EBA\u5185\u5BB9iframe\u5E7F\u544A */\n      #script-show-info-ad {\n\t\t\t  display: none;;\n\t\t\t}\n\n\t\t\t"
    });
  });
  /** @描述 状态 */
  defineProperty_defineProperty(this, "state", null);
  defineProperty_defineProperty(this, "shadowRoot", null);
  defineProperty_defineProperty(this, "maskContent", null);
  /** @描述 创建 shadowRoot */
  defineProperty_defineProperty(this, "createShadowRoot", function () {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#imgPreview';
    selector = selector.replace(/[.#]/g, '');
    var dom = document.querySelector("#".concat(selector));
    if (!dom) {
      dom = createElement('div', {
        addPrefix: false,
        id: selector,
        style: 'width:0;height:0'
      });
    }
    if (!dom.shadowRoot) {
      // 添加在body下,获取 dom.shadowRoot
      dom.attachShadow({
        mode: 'open'
      });
      // dom.shadowRoot.appendChild(maskContent)
      // 创建蒙层容器
      var maskContent = createElement('div', {
        className: 'modal',
        el: dom.shadowRoot
      });
      maskContent.appendChild(_this.createStyle(_this.state));
    }
    return dom.shadowRoot;
  });
  /** @描述 合并选项 */
  defineProperty_defineProperty(this, "mergeOptions", function (options) {
    var opt = {};
    var defaultOptions = {
      contentSelector: 'body',
      selector: 'img',
      showRootSelector: '#img_preview',
      backgroundColor: 'rgba(0,0,0,0)',
      extraStyle: ''
    };
    Object.assign(opt, defaultOptions, options);
    return opt;
  });
  /** @描述 创建shadowbox中的样式 */
  defineProperty_defineProperty(this, "createStyle", function (_ref) {
    var contentSelector = _ref.contentSelector,
      selector = _ref.selector,
      backgroundColor = _ref.backgroundColor,
      extraStyle = _ref.extraStyle;
    return createElement('style', {
      autoInsert: false,
      randomType: 'newOne',
      innerHTML: "".concat(contentSelector, " ").concat(selector, " {\n      cursor: zoom-in;\n    }\n      /* \u56FE\u7247\u9884\u89C8 */\n      .modal {\n      touch-action: none;\n      position: fixed;\n      z-index: 10000;\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n      background-color: ").concat(backgroundColor, ";\n      user-select: none;\n      pointer-events: none;\n\t\t\t--box-shadow-focus:rgb(125 230 221 / 90%);\n      }\n      .modal>*{\n        pointer-events: auto;\n      }\n      .modal>img {\n      position: absolute;\n      padding: 0;\n      margin: 0;\n      box-shadow: var(--box-shadow-focus) 0 0 8px 2px;\n      /* border-radius: 10px; */\n      /* transition: all var(--delay_time); */\n      transform: translateZ(0);\n\t\t\t/* \u900F\u660E\u56FE\u7247 \u886C\u56FE */\n\t\t\tbackground: repeating-conic-gradient(#202020 0, #202020 25%, #303030 0, #303030 50%) 0 0/30px 30px;\n      }\n\n      img.isPreviewed {\n        animation: activeImg 0.5s 4 ease-out forwards;\n        transition: all;\n\n      }\n\n      @keyframes activeImg {\n        0% {\n          box-shadow: var(--box-shadow-focus) 0 0 8px 2px;\n        }\n        50% {\n          box-shadow: rgb(255 0 0 / 70%) 0 0 8px 2px;\n        }\n        100% {\n          box-shadow: rgb(239 126 4 / 95%) 0 0 8px 2px;\n        }\n      }\n      ").concat(extraStyle, "\n      ")
    });
  });
  /** @描述 预览操作 */
  defineProperty_defineProperty(this, "onPreviwerEvent", function () {
    var that = _this;
    var _that$state = that.state,
      contentSelector = _that$state.contentSelector,
      selector = _that$state.selector;
    var eventsProxy = document.querySelector(contentSelector) || window.document.body;
    var operationHandle = function operationHandle(e) {
      var _e$target$imgItemInMo;
      var src = that.getImgSrc(e.target);
      if (!src) return;
      e.preventDefault();

      // let previewTargetDom = [...that.shadowRoot.querySelectorAll(selector)].find((item) => that.getImgSrc(item) === src)
      var previewTargetDom = (_e$target$imgItemInMo = e.target.imgItemInModal) === null || _e$target$imgItemInMo === void 0 || (_e$target$imgItemInMo = _e$target$imgItemInMo.state) === null || _e$target$imgItemInMo === void 0 ? void 0 : _e$target$imgItemInMo.cloneEl;

      // 第n+1次双击原图预览时
      if (previewTargetDom) {
        //原图的预览图已存在，则激活并最上面显示
        if (!previewTargetDom.classList.contains('isPreviewed')) {
          previewTargetDom.classList.add('isPreviewed');
          // previewTargetDom.remove()
          // that.shadowRoot.querySelector('.modal').appendChild(previewTargetDom)
          that.setTopImg(previewTargetDom);
        } else {
          // previewTargetDom.remove()

          e.target.imgItemInModal.ondblclick({
            animation: 'opacity',
            preventDefault: function preventDefault() {
              return null;
            }
          });
          previewTargetDom = null;
        }
        return;
      }
      // 第一次双击原图预览时
      if (!previewTargetDom) {
        // originalEl.style.opacity = 0
        e.target.imgItemInModal = new ImgItemInModal(that.shadowRoot, e.target, src);
        console.log("e.target.imgItemInModal => %O ", e.target.imgItemInModal);
      }
    };
    getBrowserEnv().isPhone ? addDbltouch(eventsProxy, operationHandle) : eventsProxy.addEventListener(EMIT_EVENT_TYPE, operationHandle);
  });
  defineProperty_defineProperty(this, "getImgSrc", function (dom) {
    var _dom$dataset, _window$getComputedSt;
    return (dom === null || dom === void 0 || (_dom$dataset = dom.dataset) === null || _dom$dataset === void 0 ? void 0 : _dom$dataset.src) || (dom === null || dom === void 0 ? void 0 : dom.src) || ((_window$getComputedSt = window.getComputedStyle(dom).backgroundImage.match(/^url\("([^\s]+)"\)$/i)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt[1]);
  });
  /** 最顶层的图片 绑定到容器*/
  defineProperty_defineProperty(this, "setTopImg", function (domImg) {
    if (!_this.maskContent) {
      _this.maskContent = _this.shadowRoot.querySelector('.modal');
    }
    if (domImg && _this.maskContent && _this.maskContent.topImg !== domImg) {
      if (_this.maskContent.topImg) {
        _this.maskContent.topImg.style.zIndex = '';
      }
      domImg.style.zIndex = '1';
      _this.maskContent.topImg = domImg;
    }
  });
  this.state = this.mergeOptions(_options);
  this.shadowRoot = this.createShadowRoot();
  this.onPreviwerEvent();
  this.createGlobalStyle();
  return this.shadowRoot;
});
var ImgItemInModal = /*#__PURE__*/function () {
  function ImgItemInModal(_shadowRoot, _originalEl, _src) {
    var _this2 = this;
    classCallCheck_classCallCheck(this, ImgItemInModal);
    defineProperty_defineProperty(this, "state", {
      scale: 1,
      offset: {
        left: 0,
        top: 0
      },
      origin: 'center',
      initialData: {
        offset: {},
        origin: 'center',
        scale: 1
      },
      startPoint: {
        x: 0,
        y: 0
      },
      // 记录初始触摸点位
      isTouching: false,
      // 标记是否正在移动
      isMove: false,
      // 正在移动中，与点击做区别
      touches: new Map(),
      // 触摸点数组
      lastDistance: 0,
      lastScale: 1,
      // 记录下最后的缩放值
      scaleOrigin: {
        x: 0,
        y: 0
      },
      // 原图originalEl与预览图cloneEl互相引用
      originalEl: null,
      cloneEl: null
    });
    defineProperty_defineProperty(this, "mergeOptions", function (shadowRoot, originalEl, src) {
      var _window = window,
        winWidth = _window.innerWidth,
        winHeight = _window.innerHeight;
      var offsetWidth = originalEl.offsetWidth,
        offsetHeight = originalEl.offsetHeight;

      // Element.getBoundingClientRect() 方法返回元素的大小及其相对于【视口】的位置
      var _originalEl$getBoundi = originalEl.getBoundingClientRect(),
        top = _originalEl$getBoundi.top,
        left = _originalEl$getBoundi.left;
      return {
        shadowRoot: shadowRoot,
        originalEl: originalEl,
        src: src,
        winWidth: winWidth,
        winHeight: winHeight,
        offsetWidth: offsetWidth,
        offsetHeight: offsetHeight,
        top: top,
        left: left,
        maskContent: shadowRoot.querySelector('.modal')
      };
    });
    /** @描述 添加图片 */
    defineProperty_defineProperty(this, "appendImg", function (src, originalEl) {
      // 克隆节点 能从缓存中获取图片，以便节省流量
      var cloneEl = null;
      if (originalEl.tagName === 'IMG') {
        cloneEl = originalEl.cloneNode();
      } else {
        cloneEl = document.createElement('img');
        cloneEl.src = src;
      }
      console.log("\u53CC\u51FB\u7684\u56FE\u7247\u5730\u5740 => %O ", cloneEl.src);
      _this2.state.maskContent.appendChild(cloneEl);
      _this2.setTopImg(cloneEl);
      return cloneEl;
    });
    /** 最顶层的图片 绑定到容器*/
    defineProperty_defineProperty(this, "setTopImg", function (domImg) {
      if (domImg && _this2.state.maskContent && _this2.state.maskContent.topImg !== domImg) {
        if (_this2.state.maskContent.topImg) {
          _this2.state.maskContent.topImg.style.zIndex = '';
        }
        domImg.style.zIndex = '1';
        _this2.state.maskContent.topImg = domImg;
      }
    });
    /** @描述 预览容器modal中的Img元素 添加监听滚轴缩放、移动、双击事件 */
    defineProperty_defineProperty(this, "onEventsController", function (cloneEl) {
      var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'addEventListener';
      var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [EMIT_EVENT_TYPE, 'mousewheel', 'pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'mouseleave'];
      console.log("onEventsController \u7684 eventType=> %O ", eventType);
      var that = _this2;
      events.forEach(function (item) {
        if (item === 'mousewheel') {
          if (EMIT_EVENT_TYPE === 'dbltouch') {
            addDbltouch(cloneEl, that.ondbltouch);
          } else {
            cloneEl[eventType]('mousewheel', that["on".concat(item)], {
              passive: false
            });
          }
          return;
        }
        cloneEl[eventType](item, that["on".concat(item)]);
      });
    });
    /** @描述 双击事件 */
    defineProperty_defineProperty(this, "ondblclick", function (e) {
      _this2.ondbltouch(e);
      return;
      e.preventDefault();
      var that = _this2;
      var state = that.state;
      console.log("\u5F53\u524D\u9884\u89C8\u56FE\u7247\u7684\u72B6\u6001\u53CA\u5F15\u7528\u5173\u7CFBstate => %O ", state);
      if (state.isMove) {
        state.isMove = false;
      } else {
        // const animationTime = this.getTimeOfClearImgAnimation(state)
        var animationTime = 0.4;
        var originalElPositionState = state.originalEl.getBoundingClientRect();
        that.changeStyle(state.cloneEl, ["transform: translate(0,0)", "transition: all ".concat(animationTime, "s ease-out"), "left: ".concat(originalElPositionState.left, "px"), "top: ".concat(originalElPositionState.top, "px"), "width: ".concat(originalElPositionState.width, "px")]);
        // state.cloneEl.removeEventListener('dblclick', that.ondblclick)

        // this.onEventsController(state.cloneEl, 'removeEventListener')
        setTimeout(function () {
          // state.maskContent.removeChild(state.cloneEl)
          console.log('开始执行清除预览图片');
          // 先清除原图对预览图的引用
          state.cloneEl.remove();
          state.cloneEl = null;
          state.originalEl.imgItemInModal = null;
        }, animationTime * 1000 + 100);
      }
    });
    /** @描述 双触摸事件 */
    defineProperty_defineProperty(this, "ondbltouch", function (e) {
      e.preventDefault();
      var that = _this2;
      var state = that.state;
      console.log("\u5F53\u524D\u9884\u89C8\u56FE\u7247\u7684\u72B6\u6001\u53CA\u5F15\u7528\u5173\u7CFBstate => %O ", state);
      if (state.isMove) {
        state.isMove = false;
      } else {
        var animationTime = 0.4;
        if (e.animation == 'opacity') {
          // 点击原图清除时，透明后清除，不干扰用户浏览内容
          // const animationTime = this.getTimeOfClearImgAnimation(state)
          var originalElPositionState = state.originalEl.getBoundingClientRect();
          that.changeStyle(state.cloneEl, ["opacity: 0", "transition: all ".concat(animationTime, "s ease-out")]);
        } else {
          // 点击预览图清除时，移动后清除，便于定位预览图的原图位置
          // const animationTime = this.getTimeOfClearImgAnimation(state)
          var _originalElPositionState = state.originalEl.getBoundingClientRect();
          that.changeStyle(state.cloneEl, ["transform: translate(0,0)", "transition: all ".concat(animationTime, "s ease-out"), "left: ".concat(_originalElPositionState.left, "px"), "top: ".concat(_originalElPositionState.top, "px"), "width: ".concat(_originalElPositionState.width, "px")]);
        }

        // state.cloneEl.removeEventListener('dblclick', that.ondblclick)
        _this2.onEventsController(state.cloneEl, 'removeEventListener');
        setTimeout(function () {
          // state.maskContent.removeChild(state.cloneEl)
          console.log('开始执行清除预览图片');
          // 先清除原图对预览图的引用
          state.cloneEl.remove();
          state.cloneEl = null;
          state.originalEl.imgItemInModal = null;
        }, animationTime * 1000 + 100);
      }
    });
    /** 清除预览图片动作时长 */
    defineProperty_defineProperty(this, "getTimeOfClearImgAnimation", function (state) {
      var cloneElPositionState = state.cloneEl.getBoundingClientRect();
      var originalElPositionState = state.originalEl.getBoundingClientRect();
      var maxOffsetVal = Math.max(Math.abs(originalElPositionState.left - cloneElPositionState.left), Math.abs(originalElPositionState.top - cloneElPositionState.top));
      var animationTime = 0.1 * maxOffsetVal / 400 + 0.2;
      console.log('清除预览图片的距离及动作时长: ', maxOffsetVal + 'px', animationTime + 's');
      return animationTime;
    });
    /** @描述  指针按下事件*/
    defineProperty_defineProperty(this, "onpointerdown", function (e) {
      e.preventDefault();
      var that = _this2;
      var state = that.state;
      state.touches.set(e.pointerId, e);
      // TODO: 点击存入触摸点
      state.isTouching = true;
      state.startPoint = {
        x: e.clientX,
        y: e.clientY
      };
      if (state.touches.size === 2) {
        // TODO: 判断双指触摸，并立即记录初始数据
        state.lastDistance = that.getDistance();
        state.lastScale = state.scale;
      }
      _this2.setTopImg(e.target);
    });
    /** @描述 滚轮缩放 */
    defineProperty_defineProperty(this, "onmousewheel", function (e) {
      e.preventDefault();
      if (!e.deltaY) return;
      var that = _this2;
      var state = that.state;
      state.origin = "".concat(e.offsetX, "px ").concat(e.offsetY, "px");

      // 缩放执行
      if (e.deltaY < 0) {
        // 放大
        state.scale += 0.18;
      } else if (e.deltaY > 0) {
        state.scale >= 0.28 && (state.scale -= 0.18);
        // 缩小
      }
      if (state.scale < state.initialData.scale) {
        that.reduction();
      }
      state.offset = that.getOffsetPageCenter(e.offsetX, e.offsetY);
      that.changeStyle(state.cloneEl, ['transition: all .15s', "transform-origin: ".concat(state.origin), "transform: translate(".concat(state.offset.left + 'px', ", ").concat(state.offset.top + 'px', ") scale(").concat(state.scale, ")")]);
      _this2.setTopImg(e.target);
    });
    /** @描述 获取中心改变的偏差 */
    defineProperty_defineProperty(this, "getOffsetPageCenter", function () {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var state = _this2.state;
      var touchArr = Array.from(state.touches);
      if (touchArr.length === 2) {
        var start = touchArr[0][1];
        var end = touchArr[1][1];
        x = (start.offsetX + end.offsetX) / 2;
        y = (start.offsetY + end.offsetY) / 2;
      }
      state.origin = "".concat(x, "px ").concat(y, "px");
      var offsetLeft = (state.scale - 1) * (x - state.scaleOrigin.x) + state.offset.left;
      var offsetTop = (state.scale - 1) * (y - state.scaleOrigin.y) + state.offset.top;
      state.scaleOrigin = {
        x: x,
        y: y
      };
      return {
        left: offsetLeft,
        top: offsetTop
      };
    });
    /** @描述  获取距离*/
    defineProperty_defineProperty(this, "getDistance", function () {
      var touchArr = Array.from(_this2.state.touches);
      if (touchArr.length < 2) {
        return 0;
      }
      var start = touchArr[0][1];
      var end = touchArr[1][1];
      return Math.hypot(end.x - start.x, end.y - start.y);
    });
    /** @描述  修改样式，减少回流重绘*/
    defineProperty_defineProperty(this, "changeStyle", function (el, arr, isResetAllStyle) {
      var original = el.style.cssText.split(';');
      original.pop();
      if (isResetAllStyle) {
        el.className = '';
        el.style.cssText = arr.join(';') + ';';
      } else {
        el.style.cssText = original.concat(arr).join(';') + ';';
      }
    });
    /** @描述 还原记录，用于边界处理 */
    defineProperty_defineProperty(this, "reduction", function () {
      var that = _this2;
      var state = that.state;
      that.timer && clearTimeout(that.timer);
      that.timer = setTimeout(function () {
        that.changeStyle(state.cloneEl, ["transform: translate(".concat(state.offset.left + 'px', ", ").concat(state.offset.top + 'px', ") scale(").concat(state.scale, ")"), "transform-origin: ".concat(state.origin)]);
      }, 300);
    });
    /** @描述 松开指针 事件 */
    defineProperty_defineProperty(this, "onpointerup", function (e) {
      e.preventDefault();
      var that = _this2;
      var state = that.state;
      state.touches["delete"](e.pointerId);
      // TODO: 抬起移除触摸点
      if (state.touches.size <= 0) {
        state.isTouching = false;
      } else {
        var touchArr = Array.from(state.touches);
        // 更新点位
        state.startPoint = {
          x: touchArr[0][1].clientX,
          y: touchArr[0][1].clientY
        };
      }
      setTimeout(function () {
        state.isMove = false;
      }, 300);
    });
    /** @描述 指针移动事件 */
    defineProperty_defineProperty(this, "onpointermove", function (e) {
      e.preventDefault();
      var that = _this2;
      var state = that.state;
      if (state.isTouching) {
        state.isMove = true;
        if (state.touches.size < 2) {
          // 单指滑动
          state.offset = {
            left: state.offset.left + (e.clientX - state.startPoint.x),
            top: state.offset.top + (e.clientY - state.startPoint.y)
          };
          that.changeStyle(state.cloneEl, ['transition: all 0s', "transform: translate(".concat(state.offset.left + 'px', ", ").concat(state.offset.top + 'px', ") scale(").concat(state.scale, ")"), "transform-origin: ".concat(origin)]);
          // 更新点位
          state.startPoint = {
            x: e.clientX,
            y: e.clientY
          };
        } else {
          // 双指缩放
          state.touches.set(e.pointerId, e);
          var ratio = that.getDistance() / state.lastDistance;
          state.scale = ratio * state.lastScale;
          state.offset = that.getOffsetPageCenter();
          if (state.scale < state.initialData.scale) {
            that.reduction();
          }
          that.changeStyle(state.cloneEl, ['transition: all 0s', "transform: translate(".concat(state.offset.left + 'px', ", ").concat(state.offset.top + 'px', ") scale(").concat(state.scale, ")"), "transform-origin: ".concat(state.origin)]);
        }
      }
    });
    /** @描述 取消指针事件 */
    defineProperty_defineProperty(this, "onpointercancel", function (e) {
      e.preventDefault();
      _this2.state.touches.clear();
      // 可能存在特定事件导致中断，真机操作时 pointerup 在某些边界情况下不会生效，所以需要清空
    });
    /** 鼠标离开图片时，移动操作结束 */
    defineProperty_defineProperty(this, "onmouseleave", function (e) {
      _this2.state.isMove = false;
      _this2.state.isTouching = false;
    });
    /** @描述 移动图片到屏幕中心位置 */
    defineProperty_defineProperty(this, "fixPosition", function (cloneEl) {
      var that = _this2;
      var state = that.state;

      /** @描述 原图片 中心点 */
      var originalCenterPoint = {
        x: state.offsetWidth / 2 + state.left,
        y: state.offsetHeight / 2 + state.top
      };

      /** @描述 页面 中心点 */
      var winCenterPoint = {
        x: state.winWidth / 2,
        y: state.winHeight / 2
      };

      /** @描述  新建图片的定位点：通过原图片中心点到页面中心点的 偏移量*/
      var offsetDistance = {
        left: winCenterPoint.x - originalCenterPoint.x + state.left,
        top: winCenterPoint.y - originalCenterPoint.y + state.top
      };

      /** @描述 放大后的 */
      var scaleNum = _this2.adaptScale();
      var diffs = {
        left: (scaleNum - 1) * state.offsetWidth / 2,
        top: (scaleNum - 1) * state.offsetHeight / 2
      };
      _this2.changeStyle(cloneEl, ["left: ".concat(state.left, "px"), "top: ".concat(state.top, "px"), 'transition: all 0.3s', "width: ".concat(state.offsetWidth * scaleNum + 'px'), "height:auto", "transform: translate(".concat(offsetDistance.left - state.left - diffs.left, "px, ").concat(offsetDistance.top - state.top - diffs.top, "px)")], true);

      /** @描述 消除偏差:让图片相对于window  0 0定位，通过translate设置中心点重合*/
      setTimeout(function () {
        that.changeStyle(cloneEl, ['transition: all 0s', "left: 0", "top: 0", "transform: translate(".concat(offsetDistance.left - diffs.left, "px, ").concat(offsetDistance.top - diffs.top, "px)")]);
        that.state.offset = {
          left: offsetDistance.left - diffs.left,
          top: offsetDistance.top - diffs.top
        };
        // 记录值
        that.record();
      }, 300);
    });
    /** @描述 计算自适应屏幕的缩放 */
    defineProperty_defineProperty(this, "adaptScale", function () {
      var _this2$state = _this2.state,
        winWidth = _this2$state.winWidth,
        winHeight = _this2$state.winHeight,
        originalEl = _this2$state.originalEl;
      var w = originalEl.offsetWidth,
        h = originalEl.offsetHeight;
      var scale = (winWidth - 60) / w;
      if (h * scale > winHeight - 60) {
        scale = (winHeight - 60) / h;
      }
      return scale;
    });
    this.state = Object.assign({}, this.state, this.mergeOptions(_shadowRoot, _originalEl, _src));
    var _cloneEl = this.appendImg(_src, _originalEl);
    this.state.cloneEl = _cloneEl;
    this.fixPosition(_cloneEl);
    this.onEventsController(_cloneEl);
    // return this
  }
  return createClass_createClass(ImgItemInModal, [{
    key: "record",
    value: /** @描述 记录初始化数据 */
    function record() {
      var state = this.state;
      state.initialData = Object.assign({}, {
        offset: state.offset,
        origin: state.origin,
        scale: state.scale
      });
    }
  }]);
}();
function run() {
  try {
    if (codeIsNotExcutable('previewImg', {
      name: '图文对照阅读',
      feature: '图片预览，固定图片，便于图文对照阅读',
      includedUrls: []
    }).notExcutable) return;
    var shadowRoot = new ImgPreviewer({
      backgroundColor: 'transparent'
    });
  } catch (error) {
    console.error(error);
  }
}
;// CONCATENATED MODULE: ./src/tool/addBackgroundImg.js

/**
 * @description 添加背景色
 */
function addBackgroundImg_run() {
  try {
    if (codeIsNotExcutable('addBackgroundImg', {
      name: '添加背景图片',
      feature: '使用浏览器查看在线图片或本地图片时，增加页面背景图，以便清晰显示当前图片轮廓',
      includedUrls: []
    }).notExcutable) return;
    addBackgroundImg();
  } catch (error) {
    console.error(error);
  }
}

/** @描述  添加背景色*/
function addBackgroundImg() {
  var ua = navigator.userAgent.toLowerCase();
  var doc = document.body || document.documentElement;
  var isQQBrowser = ua.indexOf('qqbrowser/') > -1;
  if (document.contentType.startsWith('image/')) {
    if (isQQBrowser && doc.tagName !== 'svg') {
      setTimeout(function () {
        loaded();
      }, 666);
    } else {
      loaded();
    }
  }
}
function loaded() {
  var doc = document.body || document.documentElement;
  var win = window;
  // var bgImage = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTAgMGgzMnYzMkgwem0zMiAzMmgzMnYzMkgzMnoiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNMCAzMmgzMnYzMkgwek0zMiAwaDMydjMySDMyeiIgZmlsbD0iIzIyMiIvPjwvc3ZnPg==`

  var bgCSS = "repeating-conic-gradient(#202020 0, #202020 25%, #303030 0, #303030 50%) 0 0/30px 30px !important";
  var contentType = document.contentType; // image/svg+xml  image/png

  /* .bgImage{
  		background: #202020;
  		background-image: linear-gradient(45deg, #303030 25%, transparent 0), linear-gradient(45deg, transparent 75%, #303030 0), linear-gradient(45deg, #303030 25%, transparent 0), linear-gradient(45deg, transparent 75%, #303030 0);
  		background-position: 0 0, 15px 15px, 15px 15px, 30px 30px;
  		background-size: 30px 30px;
  } */

  var docTagName = function (tag) {
    var tagName = tag && tag.tagName.toLowerCase();
    if (tagName) {
      if (tagName == 'svg') {
        return tagName;
      }
      if (tagName == 'body' && tag.children && tag.children.length) {
        tagName = tag.children[0].tagName.toLowerCase();
        if (tagName == 'img') {
          return tagName;
        } else {
          tagName = document.querySelector('img');
          return tagName && tagName.tagName && tagName.tagName.toLowerCase();
        }
      }
    }
  }(doc);
  var isViewerMode = docTagName == 'svg' || docTagName == 'img';
  var imgOutlineCss = "img:hover{outline: 0.5px dotted rgb(254 254 254 / 20%);}";
  if (isViewerMode) {
    if (document.head) {
      var styleText = [];
      if (isQQBrowserPS()) {
        styleText.push("body{box-sizing: border-box;background-attachment: fixed !important;background-repeat: repeat !important;}");
        // styleText.push(`body{background: url(${bgImage}) !important;}`)
        styleText.push("body{background: ".concat(bgCSS, ";}"));
      } else {
        styleText.push("img{position: static !important;background-color: rgba(0, 0, 0, 0) !important;}".concat(imgOutlineCss));
      }
      if (document.body.innerText) {
        createElement('style', {
          randomType: 'newOne',
          el: 'head',
          type: 'text/css',
          innerHTML: styleText.join('')
        }, win);
      } else {
        // 本地图片文件
        createElement('style', {
          randomType: 'newOne',
          el: 'head',
          type: 'text/css',
          innerHTML: "body{background: ".concat(bgCSS, ";}img{background-color: rgba(0, 0, 0, 0) !important;}").concat(imgOutlineCss)
        }, win);
      }
    }
    if (isQQBrowserPS()) {
      doc.style.position = 'static';
      doc.style.top = 'auto';
      doc.style.left = 'auto';
      doc.style.transform = 'none';
    } else {
      // doc.style.backgroundImage = `url(${bgImage})`
      doc.style.background = bgCSS;
      doc.style.backgroundAttachment = 'fixed';
      doc.style.boxSizing = 'border-box';
      // doc.style.outline = '#696767 dashed 1px'
      if (docTagName == 'svg') {
        doc.style.background = bgCSS.replace('!important', '');
        doc.style.position = 'absolute';
        doc.style.top = '50%';
        doc.style.left = '50%';
        doc.style.transform = 'translate(-50%, -50%)';
        doc.style.margin = '10px';
        doc.style.width = 'auto';
        doc.style.height = 'auto';
        doc.style.maxWidth = '100%';
        doc.style.maxHeight = '100%';
      }
    }
  }
  function isQQBrowserPS() {
    return document && document.body && document.body.classList.contains('qb-picture-ps');
  }
}
;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.25.6/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}

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

;// CONCATENATED MODULE: ./src/tool/openUrlInText.js




/**
 * @description 含有链接的文本,点击时跳转相应链接
 * @export
 */
function openUrlInText_run() {
  try {
    if (codeIsNotExcutable('openUrlInText', {
      name: '单击打开文本中链接',
      feature: '点击链接文本时，跳转相应链接，便于查看链接地址的内容',
      includedUrls: []
    }).notExcutable) return;
    var openPlus = new OpenPlus();
    window.addEventListener('click', /*#__PURE__*/function () {
      var _ref = asyncToGenerator_asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee(e) {
        var _innerTextsOfAllText$;
        var dom, innerTextsOfAllText, url;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              dom = e.target; // 非左击
              if (!(e.button !== 0)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return");
            case 3:
              if (!(dom.childElementCount && !_toConsumableArray(dom.childNodes).find(function (item) {
                var _item$textContent$mat, _item$textContent;
                return item.nodeName === '#text' && ((_item$textContent$mat = (_item$textContent = item.textContent).match) === null || _item$textContent$mat === void 0 ? void 0 : _item$textContent$mat.call(_item$textContent, /https?:\/\/[\S]{4,}/));
              }))) {
                _context.next = 5;
                break;
              }
              return _context.abrupt("return");
            case 5:
              if (!(dom.tagName === 'A' && dom !== null && dom !== void 0 && dom.href)) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return");
            case 7:
              if (!isContentEditableOfDOM()) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return");
            case 9:
              if (!window.getSelection().toString()) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return");
            case 11:
              innerTextsOfAllText = dom.innerText;
              url = innerTextsOfAllText === null || innerTextsOfAllText === void 0 || (_innerTextsOfAllText$ = innerTextsOfAllText.match) === null || _innerTextsOfAllText$ === void 0 ? void 0 : _innerTextsOfAllText$.call(innerTextsOfAllText, /https?:\/\/[\S]{4,}/);
              if (url) {
                /* 				openPlus.openPre(
                async () => {
                	await awaitTime(100)
                	createLinkStyle(url[0], dom)
                },
                url[0],
                url[0]
                ) */
                openPlus.open(url[0], url[0]);
              }
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), {
      capture: true //利用捕获阶段，解决【阻止冒泡】阻断事件传播
    });
    /* 	function createLinkStyle(url, element) {
    if (!url) return
    element.innerHTML = element.innerHTML.trim().split(url).join(`<a href='${url}' target='${url}'> ${url} </a>`)
    } */
  } catch (error) {
    console.error(error);
  }
}

/*
window.open打开已在的窗口(不同源)时只激活不刷新


备注：



*/
;// CONCATENATED MODULE: ./src/tool/copySelectedText.js

/**
 * @description 复制所选文字：鼠标选中文字后，0.5秒内松开左键，自动复制到剪贴板；超过 0.5秒后松开，不再进行复制；一键复制代码块：鼠标悬浮代码块后，点击显示的红色边框，复制到剪贴板
 * @export
 */
function copySelectedText_run() {
  try {
    var onEmitCopyHandle = function onEmitCopyHandle(e, is_mousemove) {
      if (isContentEditableOfDOM()) return;
      var dom = e.target;

      // window.getSelection().toString() 双击空白处 会选中 \n
      var selectedText = window.getSelection().toString().trim();

      //  || dom.tagName === 'BLOCKQUOTE'
      // https://mp.weixin.qq.com/s/1iBEjoZeA7bUmpAA1KEYhA

      /*
      https://blog.csdn.net/Charissa2017/article/details/103863588
      		offsetWidth 盒子自身占据的空间 ,包含 边框
      clientWidth 盒子自身容器拥有的空间 ，包含 padding，但 不包含边框
      */
      //

      // 代码块复制 无需移动
      if (dom.tagName === 'PRE' && e.target.offsetWidth >= e.offsetX && e.target.clientWidth <= e.offsetX) {
        // 嵌套 pre>code>code会导致重复
        /* 		function getCodesInnerText(dom, selector) {
        	const nodeList = dom.querySelectorAll(selector)
        	if (nodeList.length) {
        		return [...nodeList].reduce((pre, cur) => pre + cur.innerText + '\n', '')
        	}
        	return ''
        } */
        // 嵌套 pre>code*2>code*2
        // querySelectorAll('code') [code1,code1_1,code1_2,code2,code2-1,code2_2]
        var getCodesInnerText = function getCodesInnerText(dom, selector) {
          var nodeList = dom.querySelectorAll(selector);
          var resultStr = '';
          var topDom = null;
          for (var idx = 0, len = nodeList.length; idx < len; idx++) {
            var _topDom;
            var item = nodeList[idx];
            if (!((_topDom = topDom) !== null && _topDom !== void 0 && _topDom.contains(item))) {
              resultStr += item.innerText; // 不包含时，拼接内容

              topDom = item; // 同时重置
            }
          }
          return resultStr;
        };
        //  dom.querySelector('code')?.innerText  csdn 序号在pre标签里

        // const willCopyText = selectedText || dom.querySelector('code')?.innerText || dom.innerText
        // const willCopyText = selectedText || dom.innerText

        var willCopyText = selectedText || getCodesInnerText(dom, 'code') || dom.innerText;
        copyTextAndTip(e, willCopyText, selectedText);
        return;
      }

      // shift + click 无需移动
      if (selectedText && e.shiftKey) {
        copyTextAndTip(e, '', selectedText);
        return;
      }

      // 双击选中时，超过两个字符复制
      if (!is_mousemove) {
        // 不是手动选择的，即双击选中的
        if (selectedText.length <= 2) {
          return; // 不复制
        }
      }

      // 手动选中 ，不为空，才复制
      if (selectedText) {
        copyTextAndTip(e, '', selectedText);
        return;
      }
    }; // document.documentElement.addEventListener('click', onEmitCopyHandle, {
    // 	capture: true, //利用捕获阶段，解决【阻止冒泡】阻断事件传播
    // })
    var copyTextAndTip = function copyTextAndTip(e, willCopyText, selectedText) {
      setTimeout(function () {
        createElementTip({
          e: e,
          content: selectedText ? '文字_复制成功' : '代码块_复制成功'
        });
        doCopy((willCopyText || selectedText).trim());
      }, 500);
    };
    // const filename = 'copySelectedText'
    var filename = "copySelectedText";
    if (codeIsNotExcutable(filename, {
      name: '复制所选文本',
      feature: '1、复制所选文字：鼠标选中文字后，0.5秒 后松开左键后，自动复制到剪贴板，超过 0.5秒松开，不进行复制；2、一键复制代码块：鼠标悬浮代码块后，点击显示的红色边框，复制到剪贴板',
      includedUrls: []
    }).notExcutable) return;
    createElement('style', {
      el: 'head',
      id: 'a_click_target',
      randomType: 'newOne',
      textContent: "\n\t\t/* \u5141\u8BB8\u590D\u5236 */\n\t\t* {\n\t\t\tuser-select: text !important;\n\t\t}\n\n\t\t/* fix  https://developer.mozilla.org/zh-CN/play */\n\t\tpre, code{\n\t\t\tword-break: break-all;\n\t\t}\n\n\t\t/* \u4E00\u952E\u590D\u5236\u4EE3\u7801\uFF1A\u9F20\u6807\u60AC\u6D6E\u4EE3\u7801\uFF0C\u70B9\u51FB\u7EA2\u8272\u8FB9\u6846  */\n\t\t:not(blockquote, pre) > pre {\n\t\t\t/* border-left: 8px solid #6d6b6b45 !important; */\n\t\t\t/* border-left: 8px solid transparent !important; */\n\t\t\tborder-radius: 4px !important;\n\t\t\toverflow-x: auto !important;\n\t\t\twhite-space: pre-wrap !important;\n\t\t\tcursor: pointer;\n\t\t}\n\t\t:not(blockquote, pre) > pre:hover {\n\t\t\t/* border-left-color: #6709099c !important; */\n\t\t\tborder-right: 8px solid #6709099c !important;\n\t\t\tmargin-right: -8px;\n\t\t\tposition: relative;\n\t\t}\n\n\t\t/* :not(blockquote, pre) > pre:hover:after {\n\t\t\tcontent: '\u4E00\u952E\u590D\u5236';\n\t\t\tdisplay: inline-block;\n\t\t\twidth: 10px;\n\t\t\ttransform: translateX(-4px);\n\t\t\tfont-size: 10px;\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tright: -4px;\n\t\t\tcolor: #fff;\n\t\t\tline-height: 14px;\n\t\t\tbackground: #a26969;\n\t\t\tpadding: 0 0 6px 4px;\n\t\t\tborder-radius: 0 0 0 16px;\n\t\t} */\n\n\t\t/* \u6CE8\u91CA\u6587\u672C\u8FC7\u957F\u65F6\uFF0C\u6362\u884C */\n\t\t:not(blockquote, pre) > pre > * {\n\t\t\tborder-radius: 0 !important;\n\t\t\twhite-space: pre-wrap !important;\n\t\t\tcursor: auto;\n\t\t}\n\n\t\t:not(blockquote, pre) > pre code {\n\t\t\tdisplay: block !important;\n\t\t}\n"
    });
    var createElementTip = createElementTipFn();
    var pre_done_time = 0;
    var is_mousedown = false;
    var is_mousemove = false; // 避免双击时，选中复制
    document.documentElement.addEventListener('mousedown', function (e) {
      //e.button :0	鼠标左键；1	鼠标中键；2	鼠标右键
      //e.buttons : 如果同时多个按键被按下，buttons 的值为各键对应值做与计算（+）后的值。 https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/buttons
      if (e.button === 0) {
        // 左键时
        is_mousedown = true;
        pre_done_time = Date.now();
      }
    }, {
      capture: true //利用捕获阶段，解决【阻止冒泡】阻断事件传播
    });
    document.documentElement.addEventListener('mousemove', function (e) {
      if (e.button === 0 && is_mousedown) {
        pre_done_time = Date.now();
        is_mousemove = true;
      }
    }, {
      capture: true //利用捕获阶段，解决【阻止冒泡】阻断事件传播
    });
    document.documentElement.addEventListener('mouseup', function (e) {
      if (e.button === 0 && is_mousedown && Date.now() - pre_done_time < 500) {
        onEmitCopyHandle(e, is_mousemove);
      }
      is_mousedown = false;
      is_mousemove = false;
    }, {
      capture: true //利用捕获阶段，解决【阻止冒泡】阻断事件传播
    });
  } catch (error) {
    console.error(error);
  }
}
;// CONCATENATED MODULE: ./src/tool/csdn.js

function csdn_run() {
  try {
    if (codeIsNotExcutable('csdn', {
      name: 'csdn登录',
      feature: 'CSDN：仅在主动触发登录时，显示登录弹层，以便减少不必要的登录',
      includedUrls: ['csdn.net']
    }).notExcutable) return;
    createElement('style', {
      el: 'head',
      id: 'csdn-ui',
      textContent: "\n        /* csdn \u4EE3\u7801\u5185\u5BB9\u5168\u5C55\u793A */\n        .hide-preCode-box{\n            padding-top:0px !important;\n        }\n\n        /* \u9690\u85CF\u3010\u767B\u5F55\u540E\u590D\u5236\u3011\u6587\u6848*/\n        .hljs-button.signin{\n            opacity:0;\n        }\n\n        /* csdn\u767B\u5F55\u5F39\u5C42\u79FB\u81F3\u5DE6\u4E0B\u89D2\n        .passport-login-container {\n            top:calc(100vh - 485px) !important;\n            width:410px !important;\n            height: 520px !important;\n            border-radius: 8px !important;\n            box-shadow: -5px 5px 10px 5px #979393 !important;\n            transform: scale(0.8) !important;\n            left: -24px;\n        }\n        */\n        "
    });
    createElement('style', {
      el: 'head',
      addPrefix: '',
      id: 'csdn-ui-login',
      randomType: 'single',
      textContent: "\n        /* \u9690\u85CF\u767B\u5F55\u5F39\u5C42 */\n        .passport-login-container{\n            display:none;\n        }\n        .passport-login-mark {\n            display:none !important;\n        }\n        "
    });
    document.addEventListener('click', function (e) {
      var _target$className, _target$className$inc;
      var target = e.target;
      if ((_target$className = target.className) !== null && _target$className !== void 0 && (_target$className$inc = _target$className.includes) !== null && _target$className$inc !== void 0 && _target$className$inc.call(_target$className, 'toolbar-btn-loginfun')) {
        var _document$querySelect;
        (_document$querySelect = document.querySelector('#csdn-ui-login')) === null || _document$querySelect === void 0 || _document$querySelect.remove();
      }
    });
  } catch (error) {
    console.error(error);
  }
}
;// CONCATENATED MODULE: ./src/tool/calibreUI.js

// 解压后的epub电子书 浏览器预览
function calibreUI_run() {
  try {
    if (location.href.toLocaleLowerCase().includes('/oebps/text/')) {
      modifyUI();
    }
  } catch (error) {
    console.error(error);
  }
}
function modifyUI() {
  createElement('style', {
    id: 'calibreUI',
    innerHTML: "\n\t\t\tbody {\n\t\t\t\tmax-width:700px;\n\t\t\t}\n\t\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/ImgPreview.js

ImgPreview_run();
function ImgPreview_run() {
  run();
  addBackgroundImg_run();
  openUrlInText_run();
  copySelectedText_run();
  csdn_run();
  calibreUI_run();
}
})();

/******/ })()
;