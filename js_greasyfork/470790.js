// ==UserScript==
// @name         MostBeautifulFont-Hack
// @namespace    http://tampermonkey.net/
// @version      4.0.8
// @description  最美字体-Hack：1、全网页 设置Hack字体，便于阅读英文网站和代码【容易混淆的字母和符号 aoO0Q CG iIlL|1 g9q {}[] ~-+<=】。【最后：1、localStorage中，支持关闭某一特定功能】
// @author       Enjoy
// @include        *://*/*
// @include        file:///*
// @exclude      *localhost*
// @exclude 　　 *hrwork*
// @exclude 　　 *zhaopinyun*
// @exclude 　　 *zhidegan*
// @exclude 　　 *.58.com*
// @exclude 　　 doc.weixin.qq.com*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @homepage     https://greasyfork.org/zh-CN/scripts/456560
// @license MIT
// @icon          https://foruda.gitee.com/avatar/1725500487420291325/4867929_enjoy_li_1725500487.png!avatar200
// @grant        none
// @homepageURL  https://greasyfork.org/zh-CN/scripts/470790
// @downloadURL https://update.greasyfork.org/scripts/470790/MostBeautifulFont-Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/470790/MostBeautifulFont-Hack.meta.js
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
      idPrefix = _options$idPrefix === void 0 ? "enjoy_".concat("MostBeautifulHackFont", "_").concat(tag, "_") : _options$idPrefix,
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
        el = document.querySelector(el);
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
;// CONCATENATED MODULE: ./src/MostBeautifulHackFont.js

run(window);
function run(win) {
  if (codeIsNotExcutable('MostBeautifulFont', {
    feature: '最美字体-Hack：1、全网页 设置Hack字体，便于阅读英文网站和代码【容易混淆的字母和符号 aoO0Q CG iIlL|1 g9q {}[] ~-+<=】。',
    excludeUrls: ['pc.qq.com']
  }).notExcutable) return;
  //容易混淆的字母和符号[aoO0Q CG iIlL|1 g9q {}[] ~-+<=]
  //在【暴力猴】该脚本设置页，可以设置需要排除的页面地址
  //建议把运行时机设置为 document-body，这样可以更快的设置好字体样式
  //Hack-Nerd-Font字体包地址 https://gitee.com/enjoy_li/public-assets/raw/master/assets/Hack-Nerd-Font/Hack-Nerd-Font.zip
  var fontName = 'Hack-thin';
  var fontStyle = createElement('style', {
    id: 'MostBeautifulFont',
    type: 'text/css'
  });
  fontStyle.addSnippets = function addSnippets(snippet) {
    fontStyle.innerHTML = fontStyle.innerHTML + snippet;
  };
  var styleSnippets = "\n/* 1\u3001\u964D\u4F4E\u7F51\u9875\u4EAE\u5EA6\u4E3A75%\uFF1B\nhtml{\n  filter: brightness(75%) !important;\n}\n*/\n*{\n\ttext-transform:none !important;\n}\n";
  var fontFamilySnippet = '';
  setTimeout(function () {
    styleSnippets += fontFamilySnippet;
    fontStyle.innerHTML = styleSnippets;
  }, 50);

  // let isMatchIcon = [document.title,location.href].find(item => item.toLocaleLowerCase().includes('icon'))
  var isMatchIcon = false;
  if (!!isMatchIcon) {
    console.warn('匹配到icon页面', isMatchIcon);
  } else {
    fontFamilySnippet = "\n*{ font-family: ".concat(fontName, "; }\n\npre,code{\n    font-family: '").concat(fontName, "' !important;\n\t\tletter-spacing: 0 !important;\n}\n\n@font-face {\n  font-family: ").concat(fontName, ";\n  src: url('data:application/octet-stream;base64,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YFlmsAFjYbACJUZhOCMgPCM4GyEgIEYjR7ABKyNhOCFZsS4BFCstsEUssQA4Ky6xLgEUKy2wRiyxADkrISMgIDywBCNCIzixLgEUK7AEQy6wListsEcssAAVIEewACNCsgABARUUEy6wNCotsEgssAAVIEewACNCsgABARUUEy6wNCotsEkssQABFBOwNSotsEossDcqLbBLLLAAFkUjIC4gRoojYTixLgEUKy2wTCywCCNCsEsrLbBNLLIAAEQrLbBOLLIAAUQrLbBPLLIBAEQrLbBQLLIBAUQrLbBRLLIAAEUrLbBSLLIAAUUrLbBTLLIBAEUrLbBULLIBAUUrLbBVLLMAAABBKy2wViyzAAEAQSstsFcsswEAAEErLbBYLLMBAQBBKy2wWSyzAAABQSstsFosswABAUErLbBbLLMBAAFBKy2wXCyzAQEBQSstsF0ssgAAQystsF4ssgABQystsF8ssgEAQystsGAssgEBQystsGEssgAARistsGIssgABRistsGMssgEARistsGQssgEBRistsGUsswAAAEIrLbBmLLMAAQBCKy2wZyyzAQAAQistsGgsswEBAEIrLbBpLLMAAAFCKy2waiyzAAEBQistsGssswEAAUIrLbBsLLMBAQFCKy2wbSyxADorLrEuARQrLbBuLLEAOiuwPistsG8ssQA6K7A/Ky2wcCywABaxADorsEArLbBxLLEBOiuwPistsHIssQE6K7A/Ky2wcyywABaxATorsEArLbB0LLEAOysusS4BFCstsHUssQA7K7A+Ky2wdiyxADsrsD8rLbB3LLEAOyuwQCstsHgssQE7K7A+Ky2weSyxATsrsD8rLbB6LLEBOyuwQCstsHsssQA8Ky6xLgEUKy2wfCyxADwrsD4rLbB9LLEAPCuwPystsH4ssQA8K7BAKy2wfyyxATwrsD4rLbCALLEBPCuwPystsIEssQE8K7BAKy2wgiyxAD0rLrEuARQrLbCDLLEAPSuwPistsIQssQA9K7A/Ky2whSyxAD0rsEArLbCGLLEBPSuwPistsIcssQE9K7A/Ky2wiCyxAT0rsEArLbCJLLMJBAIDRVghGyMhWUIrsAhlsAMkUHixBQEVRVgwWS0AAQAB//8ADwACAGj+lgRoBaQAAwAHAIZLsAdQWEATAAMAAAMAYQACAgFdBAEBAT0CTBtL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YXRuIC1mIGxhdG4gLW0gIkhhY2stUmVndWxhci1UQS50eHQiIC13IEcgLVcgLXQgLVggIiJIYWNrLVJlZ3VsYXJDaHJpc3RvcGhlciBTaW1wa2luc0NocmlzdG9waGVyIFNpbXBraW5zaHR0cHM6Ly9naXRodWIuY29tL2Nocmlzc2ltcGtpbnMvSGFja2h0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3NpbXBraW5zL0hhY2tIYWNrIENvcHlyaWdodCAyMDE2LCBDaHJpc3RvcGhlciBTaW1wa2lucyB3aXRoIFJlc2VydmVkIEZvbnQgTmFtZSAiSGFjayIuCgpCaXRzdHJlYW0gVmVyYSBTYW5zIE1vbm8gQ29weXJpZ2h0IDIwMDMgQml0c3RyZWFtIEluYy4gYW5kIGxpY2Vuc2VkIHVuZGVyIHRoZSBCaXRzdHJlYW0gVmVyYSBMaWNlbnNlIHdpdGggUmVzZXJ2ZWQgRm9udCBOYW1lcyAiQml0c3RyZWFtIiBhbmQgIlZlcmEiCgpEZWphVnUgbW9kaWZpY2F0aW9ucyBvZiB0aGUgb3JpZ2luYWwgQml0c3RyZWFtIFZlcmEgU2FucyBNb25vIHR5cGVmYWNlIGhhdmUgYmVlbiBjb21taXR0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uCgoKVGhpcyBGb250IFNvZnR3YXJlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBIYWNrIE9wZW4gRm9udCBMaWNlbnNlIHYyLjAgYW5kIHRoZSBCaXRzdHJlYW0gVmVyYSBMaWNlbnNlLgoKVGhlc2UgbGljZW5zZXMgYXJlIGNvcGllZCBiZWxvdy4KCgpIQUNLIE9QRU4gRk9OVCBMSUNFTlNFIHYyLjAKCihWZXJzaW9uIDEuMCAtIDA2IFNlcHRlbWJlciAyMDE1KQoKKFZlcnNpb24gMi4wIC0gMjcgU2VwdGVtYmVyIDIwMTUpCgpDb3B5cmlnaHQgMjAxNSBieSBDaHJpc3RvcGhlciBTaW1wa2lucy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC4KCkRFRklOSVRJT05TCgoiQXV0aG9yIiByZWZlcnMgdG8gYW55IGRlc2lnbmVyLCBlbmdpbmVlciwgcHJvZ3JhbW1lciwgdGVjaG5pY2FsIHdyaXRlciBvciBvdGhlciBwZXJzb24gd2hvIGNvbnRyaWJ1dGVkIHRvIHRoZSBGb250IFNvZnR3YXJlLgoKUEVSTUlTU0lPTiBBTkQgQ09ORElUSU9OUwoKUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGUgZm9udHMgYWNjb21wYW55aW5nIHRoaXMgbGljZW5zZSAoIkZvbnRzIikgYW5kIGFzc29jaWF0ZWQgc291cmNlIGNvZGUsIGRvY3VtZW50YXRpb24sIGFuZCBiaW5hcnkgZmlsZXMgKHRoZSAiRm9udCBTb2Z0d2FyZSIpLCB0byByZXByb2R1Y2UgYW5kIGRpc3RyaWJ1dGUgdGhlIG1vZGlmaWNhdGlvbnMgdG8gdGhlIEJpdHN0cmVhbSBWZXJhIEZvbnQgU29mdHdhcmUsIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIHN0dWR5LCBjb3B5LCBtZXJnZSwgZW1iZWQsIG1vZGlmeSwgcmVkaXN0cmlidXRlLCBhbmQvb3Igc2VsbCBtb2RpZmllZCBvciB1bm1vZGlmaWVkIGNvcGllcyBvZiB0aGUgRm9udCBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIEZvbnQgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczoKCigxKSBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgbW9kaWZpZWQgYW5kIHVubW9kaWZpZWQgY29waWVzIG9mIHRoZSBGb250IFNvZnR3YXJlIHR5cGVmYWNlcy4gVGhlc2Ugbm90aWNlcyBjYW4gYmUgaW5jbHVkZWQgZWl0aGVyIGFzIHN0YW5kLWFsb25lIHRleHQgZmlsZXMsIGh1bWFuLXJlYWRhYmxlIGhlYWRlcnMgb3IgaW4gdGhlIGFwcHJvcHJpYXRlIG1hY2hpbmUtcmVhZGFibGUgbWV0YWRhdGEgZmllbGRzIHdpdGhpbiB0ZXh0IG9yIGJpbmFyeSBmaWxlcyBhcyBsb25nIGFzIHRob3NlIGZpZWxkcyBjYW4gYmUgZWFzaWx5IHZpZXdlZCBieSB0aGUgdXNlci4KCigyKSBUaGUgRm9udCBTb2Z0d2FyZSBtYXkgYmUgbW9kaWZpZWQsIGFsdGVyZWQsIG9yIGFkZGVkIHRvLCBhbmQgaW4gcGFydGljdWxhciB0aGUgZGVzaWducyBvZiBnbHlwaHMgb3IgY2hhcmFjdGVycyBpbiB0aGUgRm9udHMgbWF5IGJlIG1vZGlmaWVkIGFuZCBhZGRpdGlvbmFsIGdseXBocyBvciBjaGFyYWN0ZXJzIG1heSBiZSBhZGRlZCB0byB0aGUgRm9udHMsIG9ubHkgaWYgdGhlIGZvbnRzIGFyZSByZW5hbWVkIHRvIG5hbWVzIG5vdCBjb250YWluaW5nIHRoZSB3b3JkICJIYWNrIi4KCigzKSBOZWl0aGVyIHRoZSBGb250IFNvZnR3YXJlIG5vciBhbnkgb2YgaXRzIGluZGl2aWR1YWwgY29tcG9uZW50cywgaW4gb3JpZ2luYWwgb3IgbW9kaWZpZWQgdmVyc2lvbnMsIG1heSBiZSBzb2xkIGJ5IGl0c2VsZi4KClRFUk1JTkFUSU9OCgpUaGlzIGxpY2Vuc2UgYmVjb21lcyBudWxsIGFuZCB2b2lkIGlmIGFueSBvZiB0aGUgYWJvdmUgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4KClRIRSBGT05UIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBBTlkgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQgT0YgQ09QWVJJR0hULCBQQVRFTlQsIFRSQURFTUFSSywgT1IgT1RIRVIgUklHSFQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgSU5DTFVESU5HIEFOWSBHRU5FUkFMLCBTUEVDSUFMLCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIFRIRSBVU0UgT1IgSU5BQklMSVRZIFRPIFVTRSBUSEUgRk9OVCBTT0ZUV0FSRSBPUiBGUk9NIE9USEVSIERFQUxJTkdTIElOIFRIRSBGT05UIFNPRlRXQVJFLgoKRXhjZXB0IGFzIGNvbnRhaW5lZCBpbiB0aGlzIG5vdGljZSwgdGhlIG5hbWVzIG9mIENocmlzdG9waGVyIFNpbXBraW5zIGFuZCB0aGUgQXV0aG9yKHMpIG9mIHRoZSBGb250IFNvZnR3YXJlIHNoYWxsIG5vdCBiZSB1c2VkIHRvIHByb21vdGUsIGVuZG9yc2Ugb3IgYWR2ZXJ0aXNlIGFueSBtb2RpZmllZCB2ZXJzaW9uLCBleGNlcHQgdG8gYWNrbm93bGVkZ2UgdGhlIGNvbnRyaWJ1dGlvbihzKSBvZiBDaHJpc3RvcGhlciBTaW1wa2lucyBhbmQgdGhlIEF1dGhvcihzKSBvciB3aXRoIHRoZWlyIGV4cGxpY2l0IHdyaXR0ZW4gcGVybWlzc2lvbi4gIEZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLCBjb250YWN0OiBjaHJpcyBhdCBzb3VyY2Vmb3VuZHJ5IGRvdCBvcmcuCgoKCkJJVFNUUkVBTSBWRVJBIExJQ0VOU0UKCkNvcHlyaWdodCAoYykgMjAwMyBieSBCaXRzdHJlYW0sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC4gQml0c3RyZWFtIFZlcmEgaXMgYSB0cmFkZW1hcmsgb2YgQml0c3RyZWFtLCBJbmMuCgpQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoZSBmb250cyBhY2NvbXBhbnlpbmcgdGhpcyBsaWNlbnNlICgiRm9udHMiKSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgIkZvbnQgU29mdHdhcmUiKSwgdG8gcmVwcm9kdWNlIGFuZCBkaXN0cmlidXRlIHRoZSBGb250IFNvZnR3YXJlLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBGb250IFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgRm9udCBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOgoKVGhlIGFib3ZlIGNvcHlyaWdodCBhbmQgdHJhZGVtYXJrIG5vdGljZXMgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgRm9udCBTb2Z0d2FyZSB0eXBlZmFjZXMuCgpUaGUgRm9udCBTb2Z0d2FyZSBtYXkgYmUgbW9kaWZpZWQsIGFsdGVyZWQsIG9yIGFkZGVkIHRvLCBhbmQgaW4gcGFydGljdWxhciB0aGUgZGVzaWducyBvZiBnbHlwaHMgb3IgY2hhcmFjdGVycyBpbiB0aGUgRm9udHMgbWF5IGJlIG1vZGlmaWVkIGFuZCBhZGRpdGlvbmFsIGdseXBocyBvciBjaGFyYWN0ZXJzIG1heSBiZSBhZGRlZCB0byB0aGUgRm9udHMsIG9ubHkgaWYgdGhlIGZvbnRzIGFyZSByZW5hbWVkIHRvIG5hbWVzIG5vdCBjb250YWluaW5nIGVpdGhlciB0aGUgd29yZHMgIkJpdHN0cmVhbSIgb3IgdGhlIHdvcmQgIlZlcmEiLgoKVGhpcyBMaWNlbnNlIGJlY29tZXMgbnVsbCBhbmQgdm9pZCB0byB0aGUgZXh0ZW50IGFwcGxpY2FibGUgdG8gRm9udHMgb3IgRm9udCBTb2Z0d2FyZSB0aGF0IGhhcyBiZWVuIG1vZGlmaWVkIGFuZCBpcyBkaXN0cmlidXRlZCB1bmRlciB0aGUgIkJpdHN0cmVhbSBWZXJhIiBuYW1lcy4KClRoZSBGb250IFNvZnR3YXJlIG1heSBiZSBzb2xkIGFzIHBhcnQgb2YgYSBsYXJnZXIgc29mdHdhcmUgcGFja2FnZSBidXQgbm8gY29weSBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgRm9udCBTb2Z0d2FyZSB0eXBlZmFjZXMgbWF5IGJlIHNvbGQgYnkgaXRzZWxmLgoKVEhFIEZPTlQgU09GVFdBUkUgSVMgUFJPVklERUQgIkFTIElTIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIEFOWSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVCBPRiBDT1BZUklHSFQsIFBBVEVOVCwgVFJBREVNQVJLLCBPUiBPVEhFUiBSSUdIVC4gSU4gTk8gRVZFTlQgU0hBTEwgQklUU1RSRUFNIE9SIFRIRSBHTk9NRSBGT1VOREFUSU9OIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgSU5DTFVESU5HIEFOWSBHRU5FUkFMLCBTUEVDSUFMLCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIFRIRSBVU0UgT1IgSU5BQklMSVRZIFRPIFVTRSBUSEUgRk9OVCBTT0ZUV0FSRSBPUiBGUk9NIE9USEVSIERFQUxJTkdTIElOIFRIRSBGT05UIFNPRlRXQVJFLgoKRXhjZXB0IGFzIGNvbnRhaW5lZCBpbiB0aGlzIG5vdGljZSwgdGhlIG5hbWVzIG9mIEdub21lLCB0aGUgR25vbWUgRm91bmRhdGlvbiwgYW5kIEJpdHN0cmVhbSBJbmMuLCBzaGFsbCBub3QgYmUgdXNlZCBpbiBhZHZlcnRpc2luZyBvciBvdGhlcndpc2UgdG8gcHJvbW90ZSB0aGUgc2FsZSwgdXNlIG9yIG90aGVyIGRlYWxpbmdzIGluIHRoaXMgRm9udCBTb2Z0d2FyZSB3aXRob3V0IHByaW9yIHdyaXR0ZW4gYXV0aG9yaXphdGlvbiBmcm9tIHRoZSBHbm9tZSBGb3VuZGF0aW9uIG9yIEJpdHN0cmVhbSBJbmMuLCByZXNwZWN0aXZlbHkuIEZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLCBjb250YWN0OiBmb250cyBhdCBnbm9tZSBkb3Qgb3JnLmh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3NpbXBraW5zL0hhY2svYmxvYi9tYXN0ZXIvTElDRU5TRS5tZABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANgAgAEMAaAByAGkAcwB0AG8AcABoAGUAcgAgAFMAaQBtAHAAawBpAG4AcwAgAC8AIABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADAAMwAgAGIAeQAgAEIAaQB0AHMAdAByAGUAYQBtACwAIABJAG4AYwAuACAAQQBsAGwAIABSAGkAZwBoAHQAcwAgAFIAZQBzAGUAcgB2AGUAZAAuAEgAYQBjAGsAUgBlAGcAdQBsAGEAcgBDAGgAcgBpAHMAdABvAHAAaABlAHIAUwBpAG0AcABrAGkAbgBzADoAIABIAGEAYwBrADoAIAAyADAAMQA2AEgAYQBjAGsAIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAyAC4AMAAyADAAOwAgAHQAdABmAGEAdQB0AG8AaABpAG4AdAAgACgAdgAxAC4ANQApACAALQBsACAANAAgAC0AcgAgADgAMAAgAC0ARwAgADMANQAwACAALQB4ACAAMAAgAC0ASAAgADEAOAAxACAALQBEACAAbABhAHQAbgAgAC0AZgAgAGwAYQB0AG4AIAAtAG0AIAAiAEgAYQBjAGsALQBSAGUAZwB1AGwAYQByAC0AVABBAC4AdAB4AHQAIgAgAC0AdwAgAEcAIAAtAFcAIAAtAHQAIAAtAFgAIAAiACIASABhAGMAawAtAFIAZQBnAHUAbABhAHIAQwBoAHIAaQBzAHQAbwBwAGgAZQByACAAUwBpAG0AcABrAGkAbgBzAEMAaAByAGkAcwB0AG8AcABoAGUAcgAgAFMAaQBtAHAAawBpAG4AcwBoAHQAdABwAHMAOgAvAC8AZwBpAHQAaAB1AGIALgBjAG8AbQAvAGMAaAByAGkAcwBzAGkAbQBwAGsAaQBuAHMALwBIAGEAYwBrAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AYwBoAHIAaQBzAHMAaQBtAHAAawBpAG4AcwAvAEgAYQBjAGsASABhAGMAawAgAEMAbwBwAHkAcgBpAGcAaAB0ACAAMgAwADEANgAsACAAQwBoAHIAaQBzAHQAbwBwAGgAZQByACAAUwBpAG0AcABrAGkAbgBzACAAdwBpAHQAaAAgAFIAZQBzAGUAcgB2AGUAZAAgAEYAbwBuAHQAIABOAGEAbQBlACAAIgBIAGEAYwBrACIALgAKAAoAQgBpAHQAcwB0AHIAZQBhAG0AIABWAGUAcgBhACAAUwBhAG4AcwAgAE0AbwBuAG8AIABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAwADMAIABCAGkAdABzAHQAcgBlAGEAbQAgAEkAbgBjAC4AIABhAG4AZAAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAQgBpAHQAcwB0AHIAZQBhAG0AIABWAGUAcgBhACAATABpAGMAZQBuAHMAZQAgAHcAaQB0AGgAIABSAGUAcwBlAHIAdgBlAGQAIABGAG8AbgB0ACAATgBhAG0AZQBzACAAIgBCAGkAdABzAHQAcgBlAGEAbQAiACAAYQBuAGQAIAAiAFYAZQByAGEAIgAKAAoARABlAGoAYQBWAHUAIABtAG8AZABpAGYAaQBjAGEAdABpAG8AbgBzACAAbwBmACAAdABoAGUAIABvAHIAaQBnAGkAbgBhAGwAIABCAGkAdABzAHQAcgBlAGEAbQAgAFYAZQByAGEAIABTAGEAbgBzACAATQBvAG4AbwAgAHQAeQBwAGUAZgBhAGMAZQAgAGgAYQB2AGUAIABiAGUAZQBuACAAYwBvAG0AbQBpAHQAdABlAGQAIAB0AG8AIAB0AGgAZQAgAHAAdQBiAGwAaQBjACAAZABvAG0AYQBpAG4ALgAKAAoACgBUAGgAaQBzACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAASABhAGMAawAgAE8AcABlAG4AIABGAG8AbgB0ACAATABpAGMAZQBuAHMAZQAgAHYAMgAuADAAIABhAG4AZAAgAHQAaABlACAAQgBpAHQAcwB0AHIAZQBhAG0AIABWAGUAcgBhACAATABpAGMAZQBuAHMAZQAuAAoACgBUAGgAZQBzAGUAIABsAGkAYwBlAG4AcwBlAHMAIABhAHIAZQAgAGMAbwBwAGkAZQBkACAAYgBlAGwAbwB3AC4ACgAKAAoASABBAEMASwAgAE8AUABFAE4AIABGAE8ATgBUACAATABJAEMARQBOAFMARQAgAHYAMgAuADAACgAKACgAVgBlAHIAcwBpAG8AbgAgADEALgAwACAALQAgADAANgAgAFMAZQBwAHQAZQBtAGIAZQByACAAMgAwADEANQApAAoACgAoAFYAZQByAHMAaQBvAG4AIAAyAC4AMAAgAC0AIAAyADcAIABTAGUAcAB0AGUAbQBiAGUAcgAgADIAMAAxADUAKQAKAAoAQwBvAHAAeQByAGkAZwBoAHQAIAAyADAAMQA1ACAAYgB5ACAAQwBoAHIAaQBzAHQAbwBwAGgAZQByACAAUwBpAG0AcABrAGkAbgBzAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAC4ACgAKAEQARQBGAEkATgBJAFQASQBPAE4AUwAKAAoAIgBBAHUAdABoAG8AcgAiACAAcgBlAGYAZQByAHMAIAB0AG8AIABhAG4AeQAgAGQAZQBzAGkAZwBuAGUAcgAsACAAZQBuAGcAaQBuAGUAZQByACwAIABwAHIAbwBnAHIAYQBtAG0AZQByACwAIAB0AGUAYwBoAG4AaQBjAGEAbAAgAHcAcgBpAHQAZQByACAAbwByACAAbwB0AGgAZQByACAAcABlAHIAcwBvAG4AIAB3AGgAbwAgAGMAbwBuAHQAcgBpAGIAdQB0AGUAZAAgAHQAbwAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAuAAoACgBQAEUAUgBNAEkAUwBTAEkATwBOACAAQQBOAEQAIABDAE8ATgBEAEkAVABJAE8ATgBTAAoACgBQAGUAcgBtAGkAcwBzAGkAbwBuACAAaQBzACAAaABlAHIAZQBiAHkAIABnAHIAYQBuAHQAZQBkACwAIABmAHIAZQBlACAAbwBmACAAYwBoAGEAcgBnAGUALAAgAHQAbwAgAGEAbgB5ACAAcABlAHIAcwBvAG4AIABvAGIAdABhAGkAbgBpAG4AZwAgAGEAIABjAG8AcAB5ACAAbwBmACAAdABoAGUAIABmAG8AbgB0AHMAIABhAGMAYwBvAG0AcABhAG4AeQBpAG4AZwAgAHQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAKAAiAEYAbwBuAHQAcwAiACkAIABhAG4AZAAgAGEAcwBzAG8AYwBpAGEAdABlAGQAIABzAG8AdQByAGMAZQAgAGMAbwBkAGUALAAgAGQAbwBjAHUAbQBlAG4AdABhAHQAaQBvAG4ALAAgAGEAbgBkACAAYgBpAG4AYQByAHkAIABmAGkAbABlAHMAIAAoAHQAaABlACAAIgBGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACIAKQAsACAAdABvACAAcgBlAHAAcgBvAGQAdQBjAGUAIABhAG4AZAAgAGQAaQBzAHQAcgBpAGIAdQB0AGUAIAB0AGgAZQAgAG0AbwBkAGkAZgBpAGMAYQB0AGkAbwBuAHMAIAB0AG8AIAB0AGgAZQAgAEIAaQB0AHMAdAByAGUAYQBtACAAVgBlAHIAYQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUALAAgAGkAbgBjAGwAdQBkAGkAbgBnACAAdwBpAHQAaABvAHUAdAAgAGwAaQBtAGkAdABhAHQAaQBvAG4AIAB0AGgAZQAgAHIAaQBnAGgAdABzACAAdABvACAAdQBzAGUALAAgAHMAdAB1AGQAeQAsACAAYwBvAHAAeQAsACAAbQBlAHIAZwBlACwAIABlAG0AYgBlAGQALAAgAG0AbwBkAGkAZgB5ACwAIAByAGUAZABpAHMAdAByAGkAYgB1AHQAZQAsACAAYQBuAGQALwBvAHIAIABzAGUAbABsACAAbQBvAGQAaQBmAGkAZQBkACAAbwByACAAdQBuAG0AbwBkAGkAZgBpAGUAZAAgAGMAbwBwAGkAZQBzACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACwAIABhAG4AZAAgAHQAbwAgAHAAZQByAG0AaQB0ACAAcABlAHIAcwBvAG4AcwAgAHQAbwAgAHcAaABvAG0AIAB0AGgAZQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABmAHUAcgBuAGkAcwBoAGUAZAAgAHQAbwAgAGQAbwAgAHMAbwAsACAAcwB1AGIAagBlAGMAdAAgAHQAbwAgAHQAaABlACAAZgBvAGwAbABvAHcAaQBuAGcAIABjAG8AbgBkAGkAdABpAG8AbgBzADoACgAKACgAMQApACAAVABoAGUAIABhAGIAbwB2AGUAIABjAG8AcAB5AHIAaQBnAGgAdAAgAG4AbwB0AGkAYwBlACAAYQBuAGQAIAB0AGgAaQBzACAAcABlAHIAbQBpAHMAcwBpAG8AbgAgAG4AbwB0AGkAYwBlACAAcwBoAGEAbABsACAAYgBlACAAaQBuAGMAbAB1AGQAZQBkACAAaQBuACAAYQBsAGwAIABtAG8AZABpAGYAaQBlAGQAIABhAG4AZAAgAHUAbgBtAG8AZABpAGYAaQBlAGQAIABjAG8AcABpAGUAcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHQAeQBwAGUAZgBhAGMAZQBzAC4AIABUAGgAZQBzAGUAIABuAG8AdABpAGMAZQBzACAAYwBhAG4AIABiAGUAIABpAG4AYwBsAHUAZABlAGQAIABlAGkAdABoAGUAcgAgAGEAcwAgAHMAdABhAG4AZAAtAGEAbABvAG4AZQAgAHQAZQB4AHQAIABmAGkAbABlAHMALAAgAGgAdQBtAGEAbgAtAHIAZQBhAGQAYQBiAGwAZQAgAGgAZQBhAGQAZQByAHMAIABvAHIAIABpAG4AIAB0AGgAZQAgAGEAcABwAHIAbwBwAHIAaQBhAHQAZQAgAG0AYQBjAGgAaQBuAGUALQByAGUAYQBkAGEAYgBsAGUAIABtAGUAdABhAGQAYQB0AGEAIABmAGkAZQBsAGQAcwAgAHcAaQB0AGgAaQBuACAAdABlAHgAdAAgAG8AcgAgAGIAaQBuAGEAcgB5ACAAZgBpAGwAZQBzACAAYQBzACAAbABvAG4AZwAgAGEAcwAgAHQAaABvAHMAZQAgAGYAaQBlAGwAZABzACAAYwBhAG4AIABiAGUAIABlAGEAcwBpAGwAeQAgAHYAaQBlAHcAZQBkACAAYgB5ACAAdABoAGUAIAB1AHMAZQByAC4ACgAKACgAMgApACAAVABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAbQBhAHkAIABiAGUAIABtAG8AZABpAGYAaQBlAGQALAAgAGEAbAB0AGUAcgBlAGQALAAgAG8AcgAgAGEAZABkAGUAZAAgAHQAbwAsACAAYQBuAGQAIABpAG4AIABwAGEAcgB0AGkAYwB1AGwAYQByACAAdABoAGUAIABkAGUAcwBpAGcAbgBzACAAbwBmACAAZwBsAHkAcABoAHMAIABvAHIAIABjAGgAYQByAGEAYwB0AGUAcgBzACAAaQBuACAAdABoAGUAIABGAG8AbgB0AHMAIABtAGEAeQAgAGIAZQAgAG0AbwBkAGkAZgBpAGUAZAAgAGEAbgBkACAAYQBkAGQAaQB0AGkAbwBuAGEAbAAgAGcAbAB5AHAAaABzACAAbwByACAAYwBoAGEAcgBhAGMAdABlAHIAcwAgAG0AYQB5ACAAYgBlACAAYQBkAGQAZQBkACAAdABvACAAdABoAGUAIABGAG8AbgB0AHMALAAgAG8AbgBsAHkAIABpAGYAIAB0AGgAZQAgAGYAbwBuAHQAcwAgAGEAcgBlACAAcgBlAG4AYQBtAGUAZAAgAHQAbwAgAG4AYQBtAGUAcwAgAG4AbwB0ACAAYwBvAG4AdABhAGkAbgBpAG4AZwAgAHQAaABlACAAdwBvAHIAZAAgACIASABhAGMAawAiAC4ACgAKACgAMwApACAATgBlAGkAdABoAGUAcgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAG4AbwByACAAYQBuAHkAIABvAGYAIABpAHQAcwAgAGkAbgBkAGkAdgBpAGQAdQBhAGwAIABjAG8AbQBwAG8AbgBlAG4AdABzACwAIABpAG4AIABvAHIAaQBnAGkAbgBhAGwAIABvAHIAIABtAG8AZABpAGYAaQBlAGQAIAB2AGUAcgBzAGkAbwBuAHMALAAgAG0AYQB5ACAAYgBlACAAcwBvAGwAZAAgAGIAeQAgAGkAdABzAGUAbABmAC4ACgAKAFQARQBSAE0ASQBOAEEAVABJAE8ATgAKAAoAVABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABiAGUAYwBvAG0AZQBzACAAbgB1AGwAbAAgAGEAbgBkACAAdgBvAGkAZAAgAGkAZgAgAGEAbgB5ACAAbwBmACAAdABoAGUAIABhAGIAbwB2AGUAIABjAG8AbgBkAGkAdABpAG8AbgBzACAAYQByAGUAIABuAG8AdAAgAG0AZQB0AC4ACgAKAFQASABFACAARgBPAE4AVAAgAFMATwBGAFQAVwBBAFIARQAgAEkAUwAgAFAAUgBPAFYASQBEAEUARAAgACIAQQBTACAASQBTACIALAAgAFcASQBUAEgATwBVAFQAIABXAEEAUgBSAEEATgBUAFkAIABPAEYAIABBAE4AWQAgAEsASQBOAEQALAAgAEUAWABQAFIARQBTAFMAIABPAFIAIABJAE0AUABMAEkARQBEACwAIABJAE4AQwBMAFUARABJAE4ARwAgAEIAVQBUACAATgBPAFQAIABMAEkATQBJAFQARQBEACAAVABPACAAQQBOAFkAIABXAEEAUgBSAEEATgBUAEkARQBTACAATwBGACAATQBFAFIAQwBIAEEATgBUAEEAQgBJAEwASQBUAFkALAAgAEYASQBUAE4ARQBTAFMAIABGAE8AUgAgAEEAIABQAEEAUgBUAEkAQwBVAEwAQQBSACAAUABVAFIAUABPAFMARQAgAEEATgBEACAATgBPAE4ASQBOAEYAUgBJAE4ARwBFAE0ARQBOAFQAIABPAEYAIABDAE8AUABZAFIASQBHAEgAVAAsACAAUABBAFQARQBOAFQALAAgAFQAUgBBAEQARQBNAEEAUgBLACwAIABPAFIAIABPAFQASABFAFIAIABSAEkARwBIAFQALgAgAEkATgAgAE4ATwAgAEUAVgBFAE4AVAAgAFMASABBAEwATAAgAFQASABFACAAQwBPAFAAWQBSAEkARwBIAFQAIABIAE8ATABEAEUAUgAgAEIARQAgAEwASQBBAEIATABFACAARgBPAFIAIABBAE4AWQAgAEMATABBAEkATQAsACAARABBAE0AQQBHAEUAUwAgAE8AUgAgAE8AVABIAEUAUgAgAEwASQBBAEIASQBMAEkAVABZACwAIABJAE4AQwBMAFUARABJAE4ARwAgAEEATgBZACAARwBFAE4ARQBSAEEATAAsACAAUwBQAEUAQwBJAEEATAAsACAASQBOAEQASQBSAEUAQwBUACwAIABJAE4AQwBJAEQARQBOAFQAQQBMACwAIABPAFIAIABDAE8ATgBTAEUAUQBVAEUATgBUAEkAQQBMACAARABBAE0AQQBHAEUAUwAsACAAVwBIAEUAVABIAEUAUgAgAEkATgAgAEEATgAgAEEAQwBUAEkATwBOACAATwBGACAAQwBPAE4AVABSAEEAQwBUACwAIABUAE8AUgBUACAATwBSACAATwBUAEgARQBSAFcASQBTAEUALAAgAEEAUgBJAFMASQBOAEcAIABGAFIATwBNACwAIABPAFUAVAAgAE8ARgAgAFQASABFACAAVQBTAEUAIABPAFIAIABJAE4AQQBCAEkATABJAFQAWQAgAFQATwAgAFUAUwBFACAAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFACAATwBSACAARgBSAE8ATQAgAE8AVABIAEUAUgAgAEQARQBBAEwASQBOAEcAUwAgAEkATgAgAFQASABFACAARgBPAE4AVAAgAFMATwBGAFQAVwBBAFIARQAuAAoACgBFAHgAYwBlAHAAdAAgAGEAcwAgAGMAbwBuAHQAYQBpAG4AZQBkACAAaQBuACAAdABoAGkAcwAgAG4AbwB0AGkAYwBlACwAIAB0AGgAZQAgAG4AYQBtAGUAcwAgAG8AZgAgAEMAaAByAGkAcwB0AG8AcABoAGUAcgAgAFMAaQBtAHAAawBpAG4AcwAgAGEAbgBkACAAdABoAGUAIABBAHUAdABoAG8AcgAoAHMAKQAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHMAaABhAGwAbAAgAG4AbwB0ACAAYgBlACAAdQBzAGUAZAAgAHQAbwAgAHAAcgBvAG0AbwB0AGUALAAgAGUAbgBkAG8AcgBzAGUAIABvAHIAIABhAGQAdgBlAHIAdABpAHMAZQAgAGEAbgB5ACAAbQBvAGQAaQBmAGkAZQBkACAAdgBlAHIAcwBpAG8AbgAsACAAZQB4AGMAZQBwAHQAIAB0AG8AIABhAGMAawBuAG8AdwBsAGUAZABnAGUAIAB0AGgAZQAgAGMAbwBuAHQAcgBpAGIAdQB0AGkAbwBuACgAcwApACAAbwBmACAAQwBoAHIAaQBzAHQAbwBwAGgAZQByACAAUwBpAG0AcABrAGkAbgBzACAAYQBuAGQAIAB0AGgAZQAgAEEAdQB0AGgAbwByACgAcwApACAAbwByACAAdwBpAHQAaAAgAHQAaABlAGkAcgAgAGUAeABwAGwAaQBjAGkAdAAgAHcAcgBpAHQAdABlAG4AIABwAGUAcgBtAGkAcwBzAGkAbwBuAC4AIAAgAEYAbwByACAAZgB1AHIAdABoAGUAcgAgAGkAbgBmAG8AcgBtAGEAdABpAG8AbgAsACAAYwBvAG4AdABhAGMAdAA6ACAAYwBoAHIAaQBzACAAYQB0ACAAcwBvAHUAcgBjAGUAZgBvAHUAbgBkAHIAeQAgAGQAbwB0ACAAbwByAGcALgAKAAoACgAKAEIASQBUAFMAVABSAEUAQQBNACAAVgBFAFIAQQAgAEwASQBDAEUATgBTAEUACgAKAEMAbwBwAHkAcgBpAGcAaAB0ACAAKABjACkAIAAyADAAMAAzACAAYgB5ACAAQgBpAHQAcwB0AHIAZQBhAG0ALAAgAEkAbgBjAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAC4AIABCAGkAdABzAHQAcgBlAGEAbQAgAFYAZQByAGEAIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABCAGkAdABzAHQAcgBlAGEAbQAsACAASQBuAGMALgAKAAoAUABlAHIAbQBpAHMAcwBpAG8AbgAgAGkAcwAgAGgAZQByAGUAYgB5ACAAZwByAGEAbgB0AGUAZAAsACAAZgByAGUAZQAgAG8AZgAgAGMAaABhAHIAZwBlACwAIAB0AG8AIABhAG4AeQAgAHAAZQByAHMAbwBuACAAbwBiAHQAYQBpAG4AaQBuAGcAIABhACAAYwBvAHAAeQAgAG8AZgAgAHQAaABlACAAZgBvAG4AdABzACAAYQBjAGMAbwBtAHAAYQBuAHkAaQBuAGcAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAgACgAIgBGAG8AbgB0AHMAIgApACAAYQBuAGQAIABhAHMAcwBvAGMAaQBhAHQAZQBkACAAZABvAGMAdQBtAGUAbgB0AGEAdABpAG8AbgAgAGYAaQBsAGUAcwAgACgAdABoAGUAIAAiAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIgApACwAIAB0AG8AIAByAGUAcAByAG8AZAB1AGMAZQAgAGEAbgBkACAAZABpAHMAdAByAGkAYgB1AHQAZQAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAsACAAaQBuAGMAbAB1AGQAaQBuAGcAIAB3AGkAdABoAG8AdQB0ACAAbABpAG0AaQB0AGEAdABpAG8AbgAgAHQAaABlACAAcgBpAGcAaAB0AHMAIAB0AG8AIAB1AHMAZQAsACAAYwBvAHAAeQAsACAAbQBlAHIAZwBlACwAIABwAHUAYgBsAGkAcwBoACwAIABkAGkAcwB0AHIAaQBiAHUAdABlACwAIABhAG4AZAAvAG8AcgAgAHMAZQBsAGwAIABjAG8AcABpAGUAcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAsACAAYQBuAGQAIAB0AG8AIABwAGUAcgBtAGkAdAAgAHAAZQByAHMAbwBuAHMAIAB0AG8AIAB3AGgAbwBtACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAZgB1AHIAbgBpAHMAaABlAGQAIAB0AG8AIABkAG8AIABzAG8ALAAgAHMAdQBiAGoAZQBjAHQAIAB0AG8AIAB0AGgAZQAgAGYAbwBsAGwAbwB3AGkAbgBnACAAYwBvAG4AZABpAHQAaQBvAG4AcwA6AAoACgBUAGgAZQAgAGEAYgBvAHYAZQAgAGMAbwBwAHkAcgBpAGcAaAB0ACAAYQBuAGQAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG4AbwB0AGkAYwBlAHMAIABhAG4AZAAgAHQAaABpAHMAIABwAGUAcgBtAGkAcwBzAGkAbwBuACAAbgBvAHQAaQBjAGUAIABzAGgAYQBsAGwAIABiAGUAIABpAG4AYwBsAHUAZABlAGQAIABpAG4AIABhAGwAbAAgAGMAbwBwAGkAZQBzACAAbwBmACAAbwBuAGUAIABvAHIAIABtAG8AcgBlACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAdAB5AHAAZQBmAGEAYwBlAHMALgAKAAoAVABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAbQBhAHkAIABiAGUAIABtAG8AZABpAGYAaQBlAGQALAAgAGEAbAB0AGUAcgBlAGQALAAgAG8AcgAgAGEAZABkAGUAZAAgAHQAbwAsACAAYQBuAGQAIABpAG4AIABwAGEAcgB0AGkAYwB1AGwAYQByACAAdABoAGUAIABkAGUAcwBpAGcAbgBzACAAbwBmACAAZwBsAHkAcABoAHMAIABvAHIAIABjAGgAYQByAGEAYwB0AGUAcgBzACAAaQBuACAAdABoAGUAIABGAG8AbgB0AHMAIABtAGEAeQAgAGIAZQAgAG0AbwBkAGkAZgBpAGUAZAAgAGEAbgBkACAAYQBkAGQAaQB0AGkAbwBuAGEAbAAgAGcAbAB5AHAAaABzACAAbwByACAAYwBoAGEAcgBhAGMAdABlAHIAcwAgAG0AYQB5ACAAYgBlACAAYQBkAGQAZQBkACAAdABvACAAdABoAGUAIABGAG8AbgB0AHMALAAgAG8AbgBsAHkAIABpAGYAIAB0AGgAZQAgAGYAbwBuAHQAcwAgAGEAcgBlACAAcgBlAG4AYQBtAGUAZAAgAHQAbwAgAG4AYQBtAGUAcwAgAG4AbwB0ACAAYwBvAG4AdABhAGkAbgBpAG4AZwAgAGUAaQB0AGgAZQByACAAdABoAGUAIAB3AG8AcgBkAHMAIAAiAEIAaQB0AHMAdAByAGUAYQBtACIAIABvAHIAIAB0AGgAZQAgAHcAbwByAGQAIAAiAFYAZQByAGEAIgAuAAoACgBUAGgAaQBzACAATABpAGMAZQBuAHMAZQAgAGIAZQBjAG8AbQBlAHMAIABuAHUAbABsACAAYQBuAGQAIAB2AG8AaQBkACAAdABvACAAdABoAGUAIABlAHgAdABlAG4AdAAgAGEAcABwAGwAaQBjAGEAYgBsAGUAIAB0AG8AIABGAG8AbgB0AHMAIABvAHIAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAdABoAGEAdAAgAGgAYQBzACAAYgBlAGUAbgAgAG0AbwBkAGkAZgBpAGUAZAAgAGEAbgBkACAAaQBzACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAdQBuAGQAZQByACAAdABoAGUAIAAiAEIAaQB0AHMAdAByAGUAYQBtACAAVgBlAHIAYQAiACAAbgBhAG0AZQBzAC4ACgAKAFQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAG0AYQB5ACAAYgBlACAAcwBvAGwAZAAgAGEAcwAgAHAAYQByAHQAIABvAGYAIABhACAAbABhAHIAZwBlAHIAIABzAG8AZgB0AHcAYQByAGUAIABwAGEAYwBrAGEAZwBlACAAYgB1AHQAIABuAG8AIABjAG8AcAB5ACAAbwBmACAAbwBuAGUAIABvAHIAIABtAG8AcgBlACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAdAB5AHAAZQBmAGEAYwBlAHMAIABtAGEAeQAgAGIAZQAgAHMAbwBsAGQAIABiAHkAIABpAHQAcwBlAGwAZgAuAAoACgBUAEgARQAgAEYATwBOAFQAIABTAE8ARgBUAFcAQQBSAEUAIABJAFMAIABQAFIATwBWAEkARABFAEQAIAAiAEEAUwAgAEkAUwAiACwAIABXAEkAVABIAE8AVQBUACAAVwBBAFIAUgBBAE4AVABZACAATwBGACAAQQBOAFkAIABLAEkATgBEACwAIABFAFgAUABSAEUAUwBTACAATwBSACAASQBNAFAATABJAEUARAAsACAASQBOAEMATABVAEQASQBOAEcAIABCAFUAVAAgAE4ATwBUACAATABJAE0ASQBUAEUARAAgAFQATwAgAEEATgBZACAAVwBBAFIAUgBBAE4AVABJAEUAUwAgAE8ARgAgAE0ARQBSAEMASABBAE4AVABBAEIASQBMAEkAVABZACwAIABGAEkAVABOAEUAUwBTACAARgBPAFIAIABBACAAUABBAFIAVABJAEMAVQBMAEEAUgAgAFAAVQBSAFAATwBTAEUAIABBAE4ARAAgAE4ATwBOAEkATgBGAFIASQBOAEcARQBNAEUATgBUACAATwBGACAAQwBPAFAAWQBSAEkARwBIAFQALAAgAFAAQQBUAEUATgBUACwAIABUAFIAQQBEAEUATQBBAFIASwAsACAATwBSACAATwBUAEgARQBSACAAUgBJAEcASABUAC4AIABJAE4AIABOAE8AIABFAFYARQBOAFQAIABTAEgAQQBMAEwAIABCAEkAVABTAFQAUgBFAEEATQAgAE8AUgAgAFQASABFACAARwBOAE8ATQBFACAARgBPAFUATgBEAEEAVABJAE8ATgAgAEIARQAgAEwASQBBAEIATABFACAARgBPAFIAIABBAE4AWQAgAEMATABBAEkATQAsACAARABBAE0AQQBHAEUAUwAgAE8AUgAgAE8AVABIAEUAUgAgAEwASQBBAEIASQBMAEkAVABZACwAIABJAE4AQwBMAFUARABJAE4ARwAgAEEATgBZACAARwBFAE4ARQBSAEEATAAsACAAUwBQAEUAQwBJAEEATAAsACAASQBOAEQASQBSAEUAQwBUACwAIABJAE4AQwBJAEQARQBOAFQAQQBMACwAIABPAFIAIABDAE8ATgBTAEUAUQBVAEUATgBUAEkAQQBMACAARABBAE0AQQBHAEUAUwAsACAAVwBIAEUAVABIAEUAUgAgAEkATgAgAEEATgAgAEEAQwBUAEkATwBOACAATwBGACAAQwBPAE4AVABSAEEAQwBUACwAIABUAE8AUgBUACAATwBSACAATwBUAEgARQBSAFcASQBTAEUALAAgAEEAUgBJAFMASQBOAEcAIABGAFIATwBNACwAIABPAFUAVAAgAE8ARgAgAFQASABFACAAVQBTAEUAIABPAFIAIABJAE4AQQBCAEkATABJAFQAWQAgAFQATwAgAFUAUwBFACAAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFACAATwBSACAARgBSAE8ATQAgAE8AVABIAEUAUgAgAEQARQBBAEwASQBOAEcAUwAgAEkATgAgAFQASABFACAARgBPAE4AVAAgAFMATwBGAFQAVwBBAFIARQAuAAoACgBFAHgAYwBlAHAAdAAgAGEAcwAgAGMAbwBuAHQAYQBpAG4AZQBkACAAaQBuACAAdABoAGkAcwAgAG4AbwB0AGkAYwBlACwAIAB0AGgAZQAgAG4AYQBtAGUAcwAgAG8AZgAgAEcAbgBvAG0AZQAsACAAdABoAGUAIABHAG4AbwBtAGUAIABGAG8AdQBuAGQAYQB0AGkAbwBuACwAIABhAG4AZAAgAEIAaQB0AHMAdAByAGUAYQBtACAASQBuAGMALgAsACAAcwBoAGEAbABsACAAbgBvAHQAIABiAGUAIAB1AHMAZQBkACAAaQBuACAAYQBkAHYAZQByAHQAaQBzAGkAbgBnACAAbwByACAAbwB0AGgAZQByAHcAaQBzAGUAIAB0AG8AIABwAHIAbwBtAG8AdABlACAAdABoAGUAIABzAGEAbABlACwAIAB1AHMAZQAgAG8AcgAgAG8AdABoAGUAcgAgAGQAZQBhAGwAaQBuAGcAcwAgAGkAbgAgAHQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAdwBpAHQAaABvAHUAdAAgAHAAcgBpAG8AcgAgAHcAcgBpAHQAdABlAG4AIABhAHUAdABoAG8AcgBpAHoAYQB0AGkAbwBuACAAZgByAG8AbQAgAHQAaABlACAARwBuAG8AbQBlACAARgBvAHUAbgBkAGEAdABpAG8AbgAgAG8AcgAgAEIAaQB0AHMAdAByAGUAYQBtACAASQBuAGMALgAsACAAcgBlAHMAcABlAGMAdABpAHYAZQBsAHkALgAgAEYAbwByACAAZgB1AHIAdABoAGUAcgAgAGkAbgBmAG8AcgBtAGEAdABpAG8AbgAsACAAYwBvAG4AdABhAGMAdAA6ACAAZgBvAG4AdABzACAAYQB0ACAAZwBuAG8AbQBlACAAZABvAHQAIABvAHIAZwAuAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AYwBoAHIAaQBzAHMAaQBtAHAAawBpAG4AcwAvAEgAYQBjAGsALwBiAGwAbwBiAC8AbQBhAHMAdABlAHIALwBMAEkAQwBFAE4AUwBFAC4AbQBkAAAAAgAAAAAAAP8kAFoAAAABAAAAAAAAAAAAAAAAAAAAXwBfAAAAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AEwAUABUAFgAXABgAGQAaABsAHAANAD8AHQAPAAQABgARACIABQAKAB4AEgBCAF4AYAA+AEAACwAMABAABwBhACAAIQAfAAgADgBfACMACQBBAEMAJABLuAFeUlixAQGOWbABuQgACABjcLEAB0K1AEg0IAQAKrEAB0JAClAFOwgnCBUHBAgqsQAHQkAKVwJFBjEGHgUECCqxAAtCvRRADwAKAAWAAAQACSqxAA9CvQCAAEAAQABAAAQACSqxAwBEsSQBiFFYsECIWLEDZESxJgGIUVi6CIAAAQRAiGNUWLEDAERZWVlZQApTBD0IKQgXBwQMKrgB/4WwBI2xAgBEsAZeswVkBgBERA==') format('truetype');\n}\n");
  }
}
})();

/******/ })()
;