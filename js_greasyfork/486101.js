// ==UserScript==
// @name         特殊自用
// @namespace    http://tampermonkey.net/
// @version      3.0.88
// @description  1、微信公众号文章：调整内容布局(左、中、右)；列表增加序号和分割线，便于阅读，滚动条长显，便于了解阅读进度；单击标题一键复制标题和地址 2、文本片段样式; 3、本地web 127.0.0.1 补全favicon图标=> 囍;查看本地目录路径时，增加 favicon📂、斑马纹、限宽；4、阿里云发布流水线 发布完成后提醒功能；5、企业微信word文档，左对齐；6、特定域名页面设置快捷按钮； 7、cn.bing.com 壁纸下载时进行命名，避免重复使用默认名 8、阿基米德FM(m.ajmide.com/wx)限制最大宽度500px 9、蓝湖查看UI设计图时，增加透明背景色，以便清晰显示 10、蜻蜓FM样式：通过 重置样式 ，使表格中的 节目名 独占一行，从而文字全展示，避免省略符出现 11、kimi大模型 页面UI table 最大宽度【最后：1、localStorage中，支持关闭某一特定功能】；
// @author       Enjoy
// @icon         https://foruda.gitee.com/avatar/1725500487420291325/4867929_enjoy_li_1725500487.png!avatar200
// @include        *://*/*
// @include        file:///*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @license      GPL License
// 函数文档 https://www.tampermonkey.net/documentation.php#api:GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/486101/%E7%89%B9%E6%AE%8A%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/486101/%E7%89%B9%E6%AE%8A%E8%87%AA%E7%94%A8.meta.js
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
      idPrefix = _options$idPrefix === void 0 ? "enjoy_".concat("SelfUseTools", "_").concat(tag, "_") : _options$idPrefix,
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
;// CONCATENATED MODULE: ./src/tool/officialAccountUI.js

function run() {
  try {
    if (codeIsNotExcutable('officialAccountUI', {
      name: '微信公众号',
      feature: '1、微信公众号布局，支持左右调整和持久化，以便为图片预览腾出操作空间；2、列表项目li标签增加序号和分割线，便于阅读；3、微信公众号 点击发布时间，一键复制标题和地址 4、支持开启：滚轴紧固定在内容右侧',
      includedUrls: ['mp.weixin.qq.com'],
      fixedSrollbar: false
    }).notExcutable) return;
    modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function modifyUI() {
  // 微信公众号
  createElement('style', {
    id: 'officialAccountUI',
    innerHTML: "\n\t\t\t/* body {\n\t\t\t\tmax-width: 667px !important;\n\t\t\t} */\n\n\t\t\t.rich_media_area_primary_inner:hover{\n\t\t\t\toutline-color: #a39e9e75 !important;\n\t\t\t}\n\n\t\t\tspan,\n\t\t\tp {\n\t\t\t\tfont-size: 14px !important;\n\t\t\t}\n\n\t\t\tol,\n\t\t\tul {\n\t\t\t\tpadding-left: 50px !important;\n\t\t\t\tlist-style-type: decimal !important;\n\t\t\t}\n\n\t\t\t/* ol > li:nth-child(2n),\n\t\t\tul > li:nth-child(2n) {\n\t\t\t\tbackground: rgb(0 0 0/ 5%);\n\t\t\t}\n\t\t\t*/\n\t\t\tli {\n\t\t\t\tbox-shadow: 0 2px 0 0 #0000001a;\n\t\t\t\t}\n\t\t\t/* \u53BB\u9664\u8DF3\u8F6C\u63A8\u8350\u9605\u8BFB\u8FDE\u63A5\u540E\u7684\u8499\u5C42 */\n\t\t\t.weui-mask,\n\t\t\t.weui-mask + weui-dialog_link{\n\t\t\t\tdisplay: none;\n\t\t\t}\n\n\t\t\t/* \u5173\u6CE8\u516C\u4F17\u53F7\u4E8C\u7EF4\u7801  */\n\t\t\t.not_in_mm .qr_code_pc{\n\t\t\t\tposition: fixed !important;\n\t\t\t\ttop:0;\n\t\t\t\tright:0;\n\t\t\t}\n\n\t\t\t/* \u5207\u6362\u5E03\u5C40\uFF1A\u53CC\u51FB\u6807\u9898 */\n\t\t\tbody.float_left{\n\t\t\t\tfloat:left;\n\t\t\t}\n\n\t\t\tbody.float_middle{\n\t\t\t\tmargin-left:auto;\n\t\t\t\tmargin-right:auto;\n\t\t\t}\n\n\t\t\tbody.float_right{\n\t\t\t\tfloat:right;\n\t\t\t}\n\n\t\t\thtml.float_right #js_pc_qr_code .qr_code_pc{\n        right:auto;\n\t\t\t\tleft:0;\n\t\t\t}\n\n\t\t\t/* \u6807\u9898\u680F */\n\t\t\t#activity-name{\n        position: sticky;\n        top: 0;\n        z-index: 2;\n        background: #fff;\n\t\t\t\tpadding: 5px 0;\n\t\t\t\tbackground-image: linear-gradient(to top, transparent 0, rgba(0, 0, 0, .2) 8px, transparent 0);\n\t\t\t}\n\n\t\t\t#activity-name::after{\n\t\t\t\tcontent:'\u25C0 \u5355\u51FB\u590D\u5236\u6807\u9898\u25C0 \u53CC\u51FB\u8C03\u6574\u5E03\u5C40';\n\t\t\t\tfont-size: 12px;\n\t\t\t\tcolor: #e77a8b66;\n\t\t\t\twidth: 92px;\n\t\t\t\tdisplay: inline-block;\n\t\t\t\tline-height: 12px;\n\t\t\t\ttransform: translateY(2px);\n\t\t\t}\n\n\t\t\t#activity-name,\n\t\t\t.rich_media_meta_nickname a{\n    \t\tcursor: pointer;\n\t\t\t}\n\n\t\t\t#activity-name:hover::after,\n\t\t\t.rich_media_meta_nickname:hover::after{\n\t\t\t\tcolor: #e77a8b;\n\t\t\t}\n\n\n\t\t\t/* */\n\t\t\t.mp_profile_iframe_wrp{\n\t\t\t\tdisplay:none;\n\t\t\t}\n\t\t\t.mp_profile_iframe_wrp~p{\n\t\t\t\tdisplay:none;\n\t\t\t}\n\n\t\t.rich_media_meta_nickname #js_name::after {\n\t\t\t\tcontent: '\u5355\u51FB\u5173\u6CE8\u516C\u4F17\u53F7';\n\t\t\t\tfont-size: 12px;\n\t\t\t\tcolor: #f5dde1;\n\t\t\t\ttransform: translate(-50px, 0px);\n\t\t\t\twhite-space: nowrap;\n\t\t}\n\n\t\t.not_in_mm .qr_code_pc{\n\t\t\tposition: fixed !important;\n    \ttop: 0;\n      right: -88px;\n      opacity: 0.45;\n\t\t\ttransition: 0.3s;\n\t\t\tdisplay: none;\n\t\t}\n    .not_in_mm .qr_code_pc:hover{\n\t\t\tright: 0;\n\t\t  opacity: 1;\n\t\t}\n\n\t\t/* \u6EDA\u52A8\u6761\u5E38\u663E */\n\t\t.pages_skin_windows::-webkit-scrollbar-thumb, .pages_skin_windows *::-webkit-scrollbar-thumb{\n\t\t\tbackground-color:#595858fa;\n\t\t\tborder: 2px solid transparent;\n\t\t}\n\t\t.pages_skin_windows::-webkit-scrollbar-thumb:hover, .pages_skin_windows *::-webkit-scrollbar-thumb:hover {\n\t\t\tbackground: #9d0909bd;\n\t  }\n\n\t\t/* \u5F3A\u5236\u5B57\u4F53 Hack-thin */\n\t\t#js_base_container #page-content .rich_media_area_primary_inner *{\n\t\t\tfont-family: Hack-thin !important;\n\t\t}\n\n\t\t/* PC\u4F1A\u9690\u85CF\u5185\u5BB9 \u9AD8\u6548\u7387\u5DE5\u5177\u641C\u7F57 https://mp.weixin.qq.com/s/qubteYFSjPKSTlgStmzSQw */\n\t\t.mp_profile_iframe_wrp~p{\n\t\t\tdisplay: block;\n\t\t}\n\t\t\t"
  }, window);
  var classEnums = ['float_left', 'float_middle', 'float_right'];
  setTimeout(function () {
    var titleDom = document.querySelector('#activity-name');
    titleDom === null || titleDom === void 0 || titleDom.addEventListener('dblclick', function () {
      var idx = classEnums.findIndex(function (item) {
        return document.body.className.includes(item);
      });
      var nextClassName = classEnums[idx + 1] || 'float_left';
      if (idx >= 0) {
        document.body.classList.replace(classEnums[idx], nextClassName);
      } else {
        document.body.classList.add(nextClassName);
      }
      localStorage.setItem('Enjoy_layoutType', nextClassName);
    });
    var activity_name = document.querySelector('#activity-name');
    activity_name === null || activity_name === void 0 || activity_name.addEventListener('click', function (e) {
      doCopy("".concat(document.title, "\n").concat(location.href));
    });
  }, 3 * 1000);

  // 持久化布局： 进入页面后
  var Enjoy_layoutType = localStorage.getItem('Enjoy_layoutType');
  if (!Enjoy_layoutType) {
    Enjoy_layoutType = 'float_middle';
  } else if (Enjoy_layoutType === 'true') {
    Enjoy_layoutType = 'float_right';
  }
  document.body.classList.add(Enjoy_layoutType);

  // 滚轴固定在内容附近
  if (localStorage.getItemX('enjoy_setting').officialAccountUI.fixedSrollbar) {
    var rich_media_area_primary_inner = document.querySelector('.rich_media_area_primary_inner');
    if (rich_media_area_primary_inner) {
      rich_media_area_primary_inner.style.padding = '0 10px';
      // rich_media_area_primary_inner.style.boxShadow = '0px 0px 14px 0px #474545fa'
      rich_media_area_primary_inner.style.outline = '1px dashed #76797600';
      rich_media_area_primary_inner.style.overflowY = 'auto';
      rich_media_area_primary_inner.style.height = "calc(".concat(rich_media_area_primary_inner.scrollHeight - document.body.scrollHeight, "px + 100vh)");
    }
  }
}
;// CONCATENATED MODULE: ./src/tool/WeWorkDocUI.js

function WeWorkDocUI_run() {
  try {
    if (codeIsNotExcutable('WeWorkDocUI', {
      name: '企业微信word文档',
      feature: '企业微信word文档，左对齐',
      includedUrls: ['doc.weixin.qq.com/doc']
    }).notExcutable) return;
    WeWorkDocUI_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function WeWorkDocUI_modifyUI() {
  // 微信公众号
  createElement('style', {
    id: 'WeWorkDocUI',
    innerHTML: "\n\t\t\t#zoomable-container{\n\t\t\t\tmargin-left:230px !important;\n\t\t\t\t}\n\t\t\t"
  }, window);

  /* 	setTimeout(() => {
  	let titleDom = document.querySelector('#activity-name')
  	titleDom.addEventListener('dblclick', () => {
  		localStorage.Enjoy_layoutType = document.documentElement.classList.toggle('float_right')
  	})
  }, 3 * 1000)
  
  // 持久化布局
  if (localStorage.Enjoy_layoutType === 'true') {
  	document.documentElement.classList.toggle('float_right')
  } */
}
;// CONCATENATED MODULE: ./src/tool/textFragments.js

function textFragments_run() {
  try {
    if (codeIsNotExcutable('textFragments', {
      name: '文本片段样式',
      feature: '文本片段（Text Fragment）允许你直接链接到 web 文档中的特定文本部分，而不需要作者使用 URL 片段中的特定语法对其进行注释 https://developer.mozilla.org/zh-CN/docs/Web/Text_fragments'
    }).notExcutable) return;
    textFragments_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function textFragments_modifyUI() {
  // 微信公众号
  createElement('style', {
    id: 'textFragments',
    innerHTML: "\n      ::target-text {\n\t\t\t\tcolor: #fff !important;\n\t\t\t\tbackground-color: orangered !important;\n\t\t  }\n\t\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/tool/addFaviconOfDevApi.js

function addFaviconOfDevApi_run() {
  try {
    // 本地文件路径， 增加📂 icon
    if (location.href.toLocaleLowerCase().includes('file:///')) {
      createElement('link', {
        el: 'head',
        rel: 'shortcut icon',
        href: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PHRleHQgeT0iMTUiIHg9Ii0yIj7wn5OCPC90ZXh0Pjwvc3ZnPg==',
        type: 'image/x-icon'
      });

      // 本地文件 目录样式
      createElement('style', {
        el: 'head',
        innerHTML: "\n\t\t\t\t#parentDirLinkBox~table {\n\t\t\t\t\tborder-collapse:separate;\n\t\t\t\t\tword-break: break-all;\n\t\t\t\t\tmax-width: 600px;\n\t\t\t\t}\n\n\t\t\t\t#parentDirLinkBox~table tbody tr:nth-child(2n+1) td{\n\t\t\t\t\tbackground-color: #eee;\n\t\t\t\t}\n\t\t\t\t"
      });
    }
    if (codeIsNotExcutable('addFaviconOfDevApi', {
      name: '开发环境下创建favicon',
      feature: '127.0.0.1域名下增加，网页增加favicon和标题，便于区别非开发环境',
      includedUrls: ['127.0.0.1']
    }).notExcutable) return;
    createFaviconElementInLocalhostIP();
    modifyDocumentTitle();
  } catch (error) {
    console.error(error);
  }
}
function createFaviconElementInLocalhostIP() {
  if (document.querySelector("link[rel*='icon'][href*='/']")) return;
  createElement('link', {
    el: 'head',
    rel: 'shortcut icon',
    href: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSI+PHRleHQgeT0iMTMiIGZpbGw9InJlZCI+5ZuNPC90ZXh0Pjwvc3ZnPg==',
    type: 'image/x-icon'
  });
}
function modifyDocumentTitle() {
  var _document$title;
  if (!((_document$title = document.title) !== null && _document$title !== void 0 && _document$title.includes('Document'))) return;
  document.title = '🌄🌔🌟🌈';
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

;// CONCATENATED MODULE: ./src/tool/aliyun.js


function aliyun_run() {
  try {
    if (codeIsNotExcutable('aliyun', {
      name: '阿里云流水线',
      feature: '以时间生产默认流水线版本号',
      includedUrls: ['flow.aliyun.com/pipelines']
    }).notExcutable) return;
    autofillPublishForm();
    setTimeout(onFlowPublishState, 5 * 1000);
  } catch (error) {
    console.error(error);
  }
}

/** 阿里云流水线 发布时 自动填充表单 */
function autofillPublishForm() {
  function setting() {
    /* const pathname = location.pathname
    let options = localStorage.getItemX('latest_deploy') || {}
    const branchDom = document.querySelector('[placeholder="可输入分支/标签"]')
    const versionDom = document.querySelector('#product_version')
    const backupDom = document.querySelector('[placeholder="输入运行备注"]')
    console.log('回显值', options)
    let currentCache = options[pathname]
    if (currentCache) {
    	let emitKey = ''
    	for (let key in branchDom) {
    		console.log(key)
    		if (key.includes('__reactEventHandlers')) {
    			emitKey = key
    			break
    		}
    	}
    	branchDom[emitKey].onChange({
    		target: {
    			value: currentCache.branch,
    		},
    	})
    			versionDom[emitKey].onChange({
    		target: {
    			value: currentCache.version || new Date().toLocaleString(),
    		},
    	})
    			backupDom[emitKey].onChange({
    		target: {
    			value: currentCache.backup,
    		},
    	})
    } else {
    	currentCache = {}
    } */

    var versionDom = document.querySelector('#product_version');
    var submitDom = document.querySelector('.next-dialog-footer .next-btn-primary');
    if (submitDom) {
      submitDom.addEventListener('click', function () {
        // currentCache.branch = branchDom.value
        // currentCache.version = versionDom.value
        // currentCache.backup = backupDom.value
        // options[pathname] = currentCache
        // localStorage.setItemX('latest_deploy', options)

        // if (['daily_auto_click', 'auto_click', 'auto'].includes(currentCache.version)) {
        if (['daily_auto_click', 'auto_click', 'auto', 'dev', 'test', 'test_1', 'test_2'].includes(versionDom.value)) {
          // 自动点击，运行daily
          setTimeout(function () {
            var allCardNodes = _toConsumableArray(document.querySelectorAll('.flow-job-new--flowJobRoot--AJ1IepS'));
            allCardNodes.forEach(function (item) {
              if (item.innerText.toLowerCase().includes('daily')) {
                console.log("\u81EA\u52A8\u70B9\u51FB\uFF0C\u8FD0\u884Cdaily");
                item.querySelector('button').click();
              }
            });
          }, 2e3);
        }
      });
    } else {
      console.log('submitDom为空');
    }
  }
  document.addEventListener('click', function (e) {
    var _document$querySelect;
    if ((_document$querySelect = document.querySelector('.is-yunxiao.next-btn-primary:not(.next-btn-text)')) !== null && _document$querySelect !== void 0 && _document$querySelect.contains(e.target)) {
      console.warn('点击了 运行');
      setTimeout(setting, 2e3);
    }
  });
}
/** 阿里云流水线发布通知 */
function onFlowPublishState() {
  var shortcutIconNode = document.querySelector('[rel="shortcut icon"]');
  window.onFlowPublishState = {
    isRuning: '',
    shortcutIconNode: shortcutIconNode,
    titleRaw: document.title,
    titleActive: '✅',
    //'🌄🌈✅'
    shortcutIconRaw: shortcutIconNode.getAttribute('href'),
    shortcutIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAAbFBMVEUbfwkyjCL////7/fv0+fOBuHbE3r9dpE88kSwnhhbt9evk8OLY6dXT5s+z1a2jy5yaxpJ1smpUn0ZRnUNOnEBMmz1HmDgsiRsegg32+vW92ri417OlzJ6Mv4R7tXFtrWFhplVHlzg2jicjgxG9riC1AAAAhElEQVQoz+WStw7DMAwF5VN17yW9/f8/BslqSV4NmAuHA4nHA0W87AZPjshfWvcRPoCcwnw2qDay/yap0jC3kE2rfO+6bv9DrkB1nvwG9K9fofHdN+bkgxAPKJ2PLxqKpVfgAn7OUBnkPeRvLpGSSxr0+1RAEvHfnDIrIvzTjbv4jz3xL76wBCl44Y7QAAAAAElFTkSuQmCC',
    setTimeoutIdForActive: 0,
    isNoticeing: false
  };
  onPublishState();
  function onPublishState() {
    var runningList = document.querySelectorAll('.status-icon.running');
    //.status-icon.init
    //.status-icon.running
    //.status-icon.success

    if (runningList.length > 1 && !window.onFlowPublishState.isRuning) {
      window.onFlowPublishState.isRuning = 'Running';
      console.log('PublishState is Running');
    } else if (runningList.length <= 1 && window.onFlowPublishState.isRuning === 'Running') {
      console.log('PublishState is Completed');
      // 通知
      window.onFlowPublishState.isRuning = 'Completed';
      window.onFlowPublishState.isNoticeing = true;
      sendMsg();
    }
    setTimeout(onPublishState, 1000 * 10);
  }
  function sendMsg() {
    // 多tab页
    // if(document.hidden) return;
    createNotify('阿里云通知' + window.onFlowPublishState.titleActive, {
      body: "\u963F\u91CC\u4E91\u6D41\u6C34\u7EBF\u53D1\u5E03\u5B8C\u6210\n".concat(document.querySelector('.new-detail-page-title').innerText)
    });
    modifyDocTitle();
  }

  /** @描述 初始化状态 */
  function resetInitState() {
    if (window.onFlowPublishState.isNoticeing === true) {
      resetUIState();
      clearTimeout(window.onFlowPublishState.setTimeoutIdForActive);
      window.onFlowPublishState.isNoticeing = false;
      window.onFlowPublishState.isRuning = '';
    }
  }
  /** 恢复状态 */
  function resetUIState() {
    document.title = document.title.replace(window.onFlowPublishState.titleActive, '');
    window.onFlowPublishState.shortcutIconNode.setAttribute('href', window.onFlowPublishState.shortcutIconRaw);
  }
  /** 修改标题 */
  function modifyDocTitle() {
    // if (window.onFlowPublishState.isRuning === 'Running') {
    // 	/** 阿里云 处于发布状态时，终止通知，并恢复标题栏 */
    // 	resetInitState()
    // 	return
    // }

    var activeTitle = window.onFlowPublishState.titleActive;
    // 激活状态
    if (!document.title.includes(activeTitle)) {
      document.title = activeTitle + document.title;
      window.onFlowPublishState.shortcutIconNode.setAttribute('href', window.onFlowPublishState.shortcutIcon);
    } else {
      resetUIState();
    }
    window.onFlowPublishState.setTimeoutIdForActive = setTimeout(modifyDocTitle, 0.6 * 1000);
  }

  /** 要权限 */
  function createNotify(title, options) {
    var PERMISSON_GRANTED = 'granted';
    var PERMISSON_DENIED = 'denied';
    var PERMISSON_DEFAULT = 'default';
    if (Notification.permission === PERMISSON_GRANTED) {
      notify(title, options);
    } else {
      Notification.requestPermission(function (res) {
        if (res === PERMISSON_GRANTED) {
          notify(title, options);
        }
      });
    }
  }

  /** 发通知 */
  function notify($title, $options) {
    var notification = new Notification($title, $options);
  }

  /** 切换tab时，重置状态 */
  document.addEventListener('visibilitychange', onVisibilitychangeHand);
  function onVisibilitychangeHand() {
    // 'visible'
    // 'hidden'
    // 'prerender'

    console.log(document.visibilityState);
    // if(document.hidden === true || document.hidden === false) {
    // if (document.visibilityState === 'hidden' || document.visibilityState === 'visible') {
    // document.removeEventListener('visibilitychange', onVisibilitychangeHand)
    //3秒后 清除标题
    setTimeout(resetInitState, 3 * 1000);
    // }
  }

  /** @描述 点击页面时，重置状态 */
  document.addEventListener('click', onClickHandle);
  function onClickHandle() {
    setTimeout(resetInitState, 3 * 1000);
  }
}

/*
// 🌈
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABQVBMVEUnKCLoEiQTFBEEBAT3Ywv/yD0VxgsARv90TakcHRgMDQsBAQHqGiAfIBscAgTDDh3tLRqiDBntNRf5ehYYGRUQEA7xXgs5BAgKAAEJRvgBTuskSOQzSNkGa7FSNngNlmXXyDT1tTTurjIaESaNxSQTuiHrPRXjRhApvA/3aQ5VBg0KCgkJMwcbR+sCUdxFSsxcS7oAMLFqS68HdKhxS6VjQpI5M4hBK18GV1Y4JVEQpkgAFkALEjwRrDv1yDrOxzLLyDHwpCwTtSv3oirzoCrrnyodEyq7iyj8nCfukySFxSP1kyOPiiLfESLVECEWDyHPECDrHx/6hxxkvRvtLBuXCxeTCxZLvhVJuRWDChT4cBLfQBI1vBELBxFAMg9iBw/tVA6gMwtLBQtLLwoQiQirRAg+DQYpAwYlAgU+GQMQAQLjHZEjAAABD0lEQVQY03XQ1XbCUBAFUCa5FiFCiOAFStG6u7u7u/f/P6A3kLTpQ8/jXrPWzJzY30iCLTflqMRlRdHcxpMYMVlxz3YBwPxFSWzoAOpJ4vrxBwXvFMB4QDyvIdqaDmoVIWt7tbQeoKAdgOEgq4QxntvpoOTp0IPQJsYLxzXy0kHxEhLoqojnbwiZKky0UXgH1akXcTchhT5KB9somlBFK9wqOZrK9o/5mNRARRbuIktpmhliLO+jfM+3LOILkqNZNjJeFn1UTHDqfHCW9rLRfVGQ4rwGZe8QHeEtMkwHWLkZPP0FBtrA5ySdYnkl+DD5wY9cxrUKzbBJOUTPfft8vmu1pmfWbu2wWiESKfZvvgFnTxzmWfHGVAAAAABJRU5ErkJggg==



// ✅

data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAAbFBMVEUbfwkyjCL////7/fv0+fOBuHbE3r9dpE88kSwnhhbt9evk8OLY6dXT5s+z1a2jy5yaxpJ1smpUn0ZRnUNOnEBMmz1HmDgsiRsegg32+vW92ri417OlzJ6Mv4R7tXFtrWFhplVHlzg2jicjgxG9riC1AAAAhElEQVQoz+WStw7DMAwF5VN17yW9/f8/BslqSV4NmAuHA4nHA0W87AZPjshfWvcRPoCcwnw2qDay/yap0jC3kE2rfO+6bv9DrkB1nvwG9K9fofHdN+bkgxAPKJ2PLxqKpVfgAn7OUBnkPeRvLpGSSxr0+1RAEvHfnDIrIvzTjbv4jz3xL76wBCl44Y7QAAAAAElFTkSuQmCC
*/
;// CONCATENATED MODULE: ./src/tool/crxUI.js

function crxUI_run() {
  try {
    if (codeIsNotExcutable('crxUI', {
      name: 'chrome 扩展文档',
      feature: 'chrome 扩展文档样式： 方法 和 参数类型',
      includedUrls: ['developer.chrome.com']
    }).notExcutable) return;
    crxUI_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function crxUI_modifyUI() {
  // 微信公众号
  createElement('style', {
    id: 'crxUI',
    innerHTML: "\n\t\t.crxUI .viewport--desktop.color-scheme--light>.devsite-wrapper>*>.devsite-main-content>*>.devsite-article>.devsite-article-body.clearfix>.dcc-reference>*>.dcc-code-sections>.stack>.stack>*>.dcc-code-sections__label[id^=method-]{\n\t\t\t\tfont-size: 20px !important;\n\t\t}\n\t\t.crxUI [id^=method-]{\n\t\t\tbackground: #e8efde  !important;\n\t\t\tfont-weight: 800 !important;\n\t  }\n\t\t.crxUI .viewport--desktop.color-scheme--light>.devsite-wrapper>*>.devsite-main-content>*>.devsite-article>.devsite-article-body.clearfix>.dcc-reference>*>.dcc-code-sections>.stack>.stack>*>.dcc-code-sections__label[id^=method-]::after{\n\t\tcontent:\" \u2B50\"\n\t\t}\n\t\t.crxUI [id^=type-]{\n\t\t\t\t background: #d1e2f9 !important;\n\t\t\t\tfont-weight: 800 !important;\n\t\t}\n\n\t\th1.devsite-page-title::after {\n\t\t\tcontent: '\u53CC\u51FB\u70B9\u4EAE\u51FD\u6570\u6837\u5F0F';\n\t\t\tfont-size: 12px;\n\t\t\tcolor: #e8efde;\n\t\t\tmargin: 0 4px;\n\t  }\n\t\t.crxUI h1.devsite-page-title::after{\n\t\t\tcontent: '\u53CC\u51FB\u5173\u95ED\u51FD\u6570\u6837\u5F0F';\n\t\t}\n\t\t\t"
  }, window);
  setTimeout(function () {
    var titleDom = document.querySelector('.devsite-page-title');
    titleDom.addEventListener('dblclick', function () {
      localStorage.setItem('Enjoy_crxUIType', document.documentElement.classList.toggle('crxUI'));
    });
  }, 3 * 1000);

  // 持久化布局
  if (localStorage.getItem('Enjoy_crxUIType') === 'true') {
    document.documentElement.classList.toggle('crxUI');
  }
}
;// CONCATENATED MODULE: ./src/tool/ShortcutButtons.js

function ShortcutButtons_run() {
  try {
    var setting = codeIsNotExcutable('addShortcutButtons', {
      name: '特定域名页面设置快捷按钮',
      feature: "\u901A\u8FC7 localStorage.setItem('Enjoy_addShortcutButtons','\u3010\u6807\u9898>url\u3011\u3010\u6807\u98982>url2\u3011') \u7279\u5B9A\u57DF\u540D\u9875\u9762\u8BBE\u7F6E\u5FEB\u6377\u6309\u94AE",
      // includedUrls: ['flow.aliyun.com/pipelines'],
      excludeUrls: ['zhaopinyun', 'hrwork', 'zhidegan']
    });
    if (setting.notExcutable) {
      return;
    }
    if (window.top === window) {
      /** @描述 只在顶层window下，执行 */
      setTimeout(addShortcutButtons, 2 * 1000);
    }
  } catch (error) {
    console.error(error);
  }
}
function addShortcutButtons() {
  // 【上海前端任务进度表 https://doc.weixin.qq.com/sheet/e3_AGoAOAbDAHY1f60EbVcQWGUR4wZ1a?scode=AOgAegeEAAwrjmDHT9&tab=BB08J2】
  createElement('div', {
    id: 'addShortcutButtons',
    el: 'body',
    innerHTML: "\n\t\t\t\t<style>\n\t\t\t[id$='_addShortcutButtons'] {\n\t\t\t\tposition: fixed;\n\t\t\t\tbottom: 42px;\n\t\t\t\tz-index: 9005;\n\t\t\t\ttext-wrap: nowrap;\n\n\t\t\t\tfont-size: 10px;\n\t\t\t\ttransition: 0.1s;\n\t\t\t\tmax-width: 25px;\n\t\t\t\twidth: 50vh;\n\t\t\t\ttext-align: left !important;\n\t\t\t\topacity: 0.4;\n\t\t\t}\n\n\t\t\t[id$='_addShortcutButtons']:hover {\n\t\t\t\tmax-width: 500px;\n\t\t\t\topacity: 1;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-a-list > a {\n\t\t\t\tdisplay: block;\n\t\t\t\tpadding: 1px 0;\n\t\t\t\tcursor: pointer;\n\n\t\t\t\t/* text-ellipsis */\n\t\t\t\twidth: 100%;\n\t\t\t\toverflow: hidden;\n\t\t\t\twhite-space: nowrap;\n\t\t\t\t/* text-overflow: ellipsis; */\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-textarea {\n\t\t\t\tdisplay: none;\n\t\t\t\tmax-height: 60vh;\n\t\t\t\tfont-size: 12px;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-textarea._addShortcutButtons-textarea-show {\n\t\t\t\tdisplay: inline-block;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-operate span {\n\t\t\t\tmargin-right: 2px;\n\t\t\t\tcursor: pointer;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-operate span:nth-child(n + 2) {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-textarea._addShortcutButtons-textarea-show\n\t\t\t\t+ #_addShortcutButtons-operate\n\t\t\t\t> span:nth-child(n + 2) {\n\t\t\t\tdisplay: inline;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-textarea._addShortcutButtons-textarea-show\n\t\t\t\t+ #_addShortcutButtons-operate\n\t\t\t\t> span:nth-child(1) {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\n\t\t\t#_addShortcutButtons-a-list {\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-direction: column;\n\t\t\t\ttext-wrap: nowrap;\n\t\t\t}\n\t\t</style>\n\n\n\t\t<textarea\n\t\tid=\"_addShortcutButtons-textarea\"\n\t\tname=\"w3review\"\n\t\trows=\"5\"\n\t\tcols=\"60\"\n\t\tplaceholder=\"\u652F\u6301\u591A\u4E2A\uFF0C\u683C\u5F0F\uFF1A\n\u3010\u6807\u98981\u300Burl1\u3011\n\u3010\u6807\u98982\u300Burl2\u3011\"\n\t></textarea>\n\t<div id=\"_addShortcutButtons-operate\">\n\t\t<span title=\"\u270F\uFE0F \u7F16\u8F91 \u5FEB\u6377\u952E\u5217\u8868\" onclick=\"enjoyShortcutButton.editTextArea()\">\u270F\uFE0F</span>\n\t\t<span title=\"\uD83D\uDEAB \u53D6\u6D88 \u5FEB\u6377\u952E\u5217\u8868\" onclick=\"enjoyShortcutButton.cancelTextArea()\">\uD83D\uDEAB</span>\n\t\t<span title=\"\uD83C\uDD97 \u4FDD\u5B58 \u5FEB\u6377\u952E\u5217\u8868\" onclick=\"enjoyShortcutButton.submitTextArea()\">\uD83C\uDD97</span>\n\t</div>\n\t<div id=\"_addShortcutButtons-a-list\"></div>\n\t\t"
  }, window);
  createElement('script', {
    id: 'addShortcutButtons-script',
    el: 'body',
    innerHTML: "\n\tclass EnjoyShortcutButton {\n\t\tconstructor() {\n\t\t\tthis.addShortcutButtonsTextareaDom = document.querySelector('#_addShortcutButtons-textarea')\n\t\t\tthis.addShortcutButtonsAListDom = document.querySelector('#_addShortcutButtons-a-list')\n\n\t\t\t// \u5FEB\u6377\u6309\u94AE \u6E32\u67D3\n\t\t\tthis.renderShortBtns(localStorage.getItem('Enjoy_addShortcutButtons'))\n\t\t}\n\n\t\t/** @\u63CF\u8FF0 \u7F16\u8F91 */\n\t\teditTextArea() {\n\t\t\tthis.addShortcutButtonsTextareaDom.classList.toggle('_addShortcutButtons-textarea-show')\n\t\t\tthis.addShortcutButtonsTextareaDom.value = localStorage.getItem('Enjoy_addShortcutButtons')\n\t\t}\n\t\t/** @\u63CF\u8FF0 \u53D6\u6D88\u7F16\u8F91 */\n\t\tcancelTextArea() {\n\t\t\tif (confirm('\u786E\u5B9A\u53D6\u6D88\u5417')) {\n\t\t\t\tthis.editTextArea()\n\t\t\t}\n\t\t}\n\t\t/** @\u63CF\u8FF0 \u4FDD\u5B58\u7F16\u8F91 */\n\t\tsubmitTextArea() {\n\t\t\t// prompt('\u8BF7\u8F93\u5165\u94FE\u63A5\u5FEB\u6377\u6309\u94AE\u914D\u7F6E\uFF0C\u4EE5 >\u3001\u3010\u3011\u5206\u9694\uFF0C\u652F\u6301\u591A\u4E2A\uFF0C\u683C\u5F0F\u5982\u4E0B\uFF1A\u3010\u6807\u9898>url\u3011\u3010\u6807\u98982>url2\u3011\u3010\u6807\u98983>url3\u3011','\u9ED8\u8BA4\u503C')\n\t\t\tif (confirm('\u786E\u5B9A\u4FDD\u5B58\u5417')) {\n\t\t\t\ttry {\n\t\t\t\t\tthis.addShortcutButtonsTextareaDom.classList.remove('_addShortcutButtons-textarea-show')\n\t\t\t\t\tlocalStorage.setItem('Enjoy_addShortcutButtons', this.addShortcutButtonsTextareaDom.value || '')\n\t\t\t\t\tthis.renderShortBtns(this.addShortcutButtonsTextareaDom.value || '')\n\t\t\t\t} catch (error) {\n\t\t\t\t\tconsole.error(error)\n\t\t\t\t\talert('\u64CD\u4F5C\u5931\u8D25')\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t/** @\u63CF\u8FF0 \u6E32\u67D3\u6309\u94AE */\n\t\trenderShortBtns(value = '') {\n\t\t\tvalue = value || ''\n\t\t\tif (this.addShortcutButtonsAListDom) {\n\t\t\t\tthis.addShortcutButtonsAListDom.innerHTML = value\n\t\t\t\t\t.replace(/\\s/g, '')\n\t\t\t\t\t.replace(/(^\u3010|\u3011$)/g, '')\n\t\t\t\t\t.split('\u3011\u3010')\n\t\t\t\t\t.map((item = '') => {\n\t\t\t\t\t\treturn item.split('\u300B')\n\t\t\t\t\t})\n\t\t\t\t\t.filter((item) => item.length)\n\t\t\t\t\t.map(([title, url]) => {\n\t\t\t\t\t\turl = url || title\n\t\t\t\t\t\tif (!url.includes('://')) {\n\t\t\t\t\t\t\t// \u7EDD\u5BF9\u8DEF\u5F84\n\t\t\t\t\t\t\turl = '//' + url\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn '<a href=\"' + url + '\" target=\"' + url + '\">' + title + '</a>'\n\t\t\t\t\t})\n\t\t\t\t\t.join('')\n\t\t\t} else {\n\t\t\t\tthrow new Error('\u6CA1\u67E5\u627E\u5230 \u8FDE\u63A5\u5FEB\u6377\u6309\u94AE \u7684\u5BB9\u5668')\n\t\t\t}\n\t\t}\n\t}\n\t// console.log('window',window,window.enjoyShortcutButton)\n\tif (!window.enjoyShortcutButton) {\n\t\twindow.enjoyShortcutButton = new EnjoyShortcutButton()\n\t}\n\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/tool/cn_bing_willpaper.js

function cn_bing_willpaper_run() {
  try {
    // filename 所在文件的文件名
    // const filename = import.meta.url // Get current path
    // 	.split(/[\\/]/)
    // 	.pop() // Get current filename
    // 	.replace(/\.[^.]+$/, '') // Drop extension
    var filename = "cn_bing_willpaper";
    if (codeIsNotExcutable(filename, {
      name: 'bing.com 壁纸下载',
      feature: 'bing.com 壁纸下载时进行命名，避免重复使用默认名',
      includedUrls: ['cn.bing.com', 'www.bing.com']
    }).notExcutable) return;
    cn_bing_willpaper_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
/*
mouseover: 只要鼠标指针移入事件所绑定的元素或  【其子元素】  ，都会触发该事件
mouseenter: 只有鼠标指针移入事件所绑定的元素时，才会触发该事件

mouseout: 只要鼠标指针移出事件所绑定的元素或 【其子元素】 ，都会触发该事件
mouseleave: 只有鼠标指针移出事件所绑定的元素时，才会触发该事件
*/
function cn_bing_willpaper_modifyUI() {
  setTimeout(function () {
    var headline_el = document.querySelector('.headline');
    headline_el && headline_el.addEventListener('mouseleave', function (e) {
      return [setTimeout(function () {
        var name_el = document.querySelector('.musCardCont h3 a');
        var download_link_el = document.querySelector('.downloadLink');
        if (name_el && download_link_el) {
          console.log('cn.bing.com 壁纸下载时进行命名，避免重复使用默认名');
          download_link_el.setAttribute('download', "bing_".concat(name_el.innerText, ".png").replace(/\s|\\|\//g, ''));
          // 	`${name_el.innerText}_${new Date().toISOString().slice(0, 19)}.png`
        }
      }, 100)];
    });
  }, 1 * 1000);
}
;// CONCATENATED MODULE: ./src/tool/ajmide.js

var filename = "ajmide";
function ajmide_run() {
  try {
    if (codeIsNotExcutable(filename, {
      name: '阿基米德FM',
      feature: '限制宽度',
      includedUrls: ['m.ajmide.com/wx', 'm.ajmide.com/m']
    }).notExcutable) return;
    ajmide_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function ajmide_modifyUI() {
  createElement('style', {
    id: filename,
    innerHTML: "\n\t\t\t.view-container,\n\t\t\t.cload{\n\t\t\t\tmax-width: 500px;\n\t\t\t}\n\t\t\t.reset_pc{\n\t\t\t\tmargin-left:none !important;\n\t\t\t}\n\t\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/tool/lanhuapp.js

// 蓝湖背景色
function lanhuapp_run() {
  try {
    if (codeIsNotExcutable('lanhuapp', {
      name: '蓝湖',
      feature: '蓝湖查看UI图时，增加背景色',
      includedUrls: ['lanhuapp.com/web']
    }).notExcutable) return;
    lanhuapp_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function lanhuapp_modifyUI() {
  createElement('style', {
    id: 'lanhuapp',
    innerHTML: "\n      /* \u62D6\u5230\u65F6\u4F1A\u5BFC\u81F4\u900F\u660E\u80CC\u666F\u8272\u65B9\u683C\u4E5F\u4F1A\u53D8\u52A8\uFF0C\u6643\u5F97\u773C\u775B\u53D7\u4E0D\u4E86 */\n\t\t\t/*\n\t\t\t#stage,\n\t\t\t#detail_container {\n\t\t\t\tbackground: repeating-conic-gradient(#555 0, #555 25%, #444 25%, #444 50%) 0 0 / 30px 30px !important;\n\t\t\t\tbackground: repeating-conic-gradient(#555 0 25%, #444 25% 50%) 0 0 / 30px 30px !important;\n\t\t\t}\n\t\t\t*/\n\n\t\t\t#detail_container,\n\t\t\t#canvas-wrap {\n\n\t\t\t/*\tbackground: repeating-conic-gradient(#202020 0, #202020 25%, #303030 25%, #303030 50%) 0 0 / 30px 30px !important; */\n\t\t\t/*\tbackground: repeating-conic-gradient(#202020 0 25%, #303030 25% 50%) 0 0 / 30px 30px !important; */\n\n\t\t\t/*\tbackground: repeating-conic-gradient(#555 0, #555 25%, #444 25%, #444 50%) 0 0 / 30px 30px !important; */\n\t\t\t\tbackground: repeating-conic-gradient(#555 0 25%, #444 25% 50%) 0 0 / 30px 30px !important;\n\t\t\t}\n\t\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/tool/qtfm.js

// 蜻蜓FM 浏览器预览
function qtfm_run() {
  try {
    try {
      var setting = codeIsNotExcutable('qtfmUI', {
        name: '蜻蜓FM样式',
        feature: "\u873B\u8713FM\u6837\u5F0F\uFF1A\u901A\u8FC7 \u91CD\u7F6E\u6837\u5F0F \uFF0C\u4F7F\u8868\u683C\u4E2D\u7684 \u8282\u76EE\u540D \u72EC\u5360\u4E00\u884C\uFF0C\u4ECE\u800C\u6587\u5B57\u5168\u5C55\u793A\uFF0C\u907F\u514D\u7701\u7565\u7B26\u51FA\u73B0",
        includedUrls: ['www.qtfm.cn']
        // excludeUrls: ['zhaopinyun', 'hrwork', 'zhidegan'],
      });
      if (setting.notExcutable) {
        return;
      }
      if (window.top === window) {
        /** @描述 只在顶层window下，执行 */
        setTimeout(qtfm_modifyUI, 2 * 1000);
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}
function qtfm_modifyUI() {
  createElement('style', {
    id: 'qtfmUI',
    innerHTML: "\n.program-row-root .col1{\n\twidth: 100% !important;\n}\n.program-row-root .col1 .pTitle .chargeP,\n.radio-program-row-root .col1 div{\n\tmax-width: unset !important;\n}\n\t\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/tool/gpt_ui.js


/* 大模型 页面UI table 最大宽度 */
function gpt_ui_run() {
  try {
    if (codeIsNotExcutable('gpt_ui', {
      name: '大模型 页面UI table 最大宽度',
      feature: '大模型 页面UI table 最大宽度',
      includedUrls: ['www.kimi.com']
    }).notExcutable) return;
    gpt_ui_modifyUI();
  } catch (error) {
    console.error(error);
  }
}
function gpt_ui_modifyUI() {
  createElement('style', {
    id: 'gpt_ui',
    innerHTML: "\n\t\t\t/* kimi \u5BF9\u8BDD\u5185\u5BB9\u5E03\u5C40 */\n\t\t\t.chat-content-container>.chat-content-list{\n\t\t\t\tmargin: 0;\n\n\t\t\t\t/* kimi \u9875 \u8868\u683C\u5BBD\u5EA6 */\n\t\t\t.table.markdown-table {\n\t\t\t\tmax-width: calc(100vw - 350px);\n    \t\twidth: max-content;\n\n\t\t\t\ttable {\n\t\t\t\t\tmax-width: 100%;\n\n\t\t\t\t\ttd {\n\t\t\t\t\t\tmax-width: unset;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\t}\n\n\n\t\t\t"
  }, window);
}
;// CONCATENATED MODULE: ./src/SelfUseTools.js


SelfUseTools_run();
function SelfUseTools_run() {
  // linkByNamedWin.run() linkByNamedWin,  1、命名链接：打开链接方式，总是以命名的新窗口，跳转同一个链接页面，只激活,不刷新
  run();
  WeWorkDocUI_run();
  textFragments_run();
  addFaviconOfDevApi_run();
  aliyun_run();
  crxUI_run();
  ShortcutButtons_run();
  cn_bing_willpaper_run();
  ajmide_run();
  lanhuapp_run();
  qtfm_run();
  gpt_ui_run();
}
})();

/******/ })()
;