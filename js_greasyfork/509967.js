// ==UserScript==
// @name         wiki-工时统计
// @namespace    npm/vite-plugin-monkey
// @version      0.0.7
// @author       monkey
// @description  表格统计工时
// @license      MIT
// @icon         https://www.qianxin.com/favicon.ico
// @match        *://wiki.qianxin-inc.cn/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/509967/wiki-%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/509967/wiki-%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(o=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=o,document.head.appendChild(t)})('@font-face{font-family:iconfont;src:url(//at.alicdn.com/t/c/font_4622934_otm49hwnffj.woff2?t=1727177061564) format("woff2"),url(//at.alicdn.com/t/c/font_4622934_otm49hwnffj.woff?t=1727177061564) format("woff"),url(//at.alicdn.com/t/c/font_4622934_otm49hwnffj.ttf?t=1727177061564) format("truetype")}.iconfont{font-family:iconfont!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-data:before{content:"\\e63d"}.icon-yanfagongshi:before{content:"\\e603"}.icon-fuzhi:before{content:"\\ec7a"}.group-btn-wrapper[data-v-3a4c270e]{position:fixed;right:16px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;justify-content:center;gap:16px}.group-btn-wrapper i[data-v-3a4c270e]{font-size:24px;color:#ccc;cursor:pointer}.group-btn-wrapper i[data-v-3a4c270e]:hover{color:#666}.show-total-box[data-v-3a4c270e]{position:fixed;background:#999;color:#fff;padding:8px}');

(function(vue) {
  "use strict";
  const style = "";
  const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
      const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
      if (checkForDefaultPrevented === false || !shouldPrevent) {
        return oursHandler == null ? void 0 : oursHandler(event);
      }
    };
    return handleEvent;
  };
  var _a;
  const isClient = typeof window !== "undefined";
  const isString$1 = (val) => typeof val === "string";
  const noop = () => {
  };
  const isIOS = isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function identity$1(arg) {
    return arg;
  }
  function tryOnScopeDispose(fn2) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn2);
      return true;
    }
    return false;
  }
  function tryOnMounted(fn2, sync = true) {
    if (vue.getCurrentInstance())
      vue.onMounted(fn2);
    else if (sync)
      fn2();
    else
      vue.nextTick(fn2);
  }
  function useTimeoutFn(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, resolveUnref(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient)
        start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending: vue.readonly(isPending),
      start,
      stop
    };
  }
  function unrefElement(elRef) {
    var _a2;
    const plain = resolveUnref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  function useEventListener(...args) {
    let target;
    let events;
    let listeners;
    let options;
    if (isString$1(args[0]) || Array.isArray(args[0])) {
      [events, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events))
      events = [events];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn2) => fn2());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(...events.flatMap((event) => {
        return listeners.map((listener) => register(el, event, listener, options2));
      }));
    }, { immediate: true, flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  let _iOSWorkaround = false;
  function onClickOutside(target, handler, options = {}) {
    const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
    if (!window2)
      return;
    if (isIOS && !_iOSWorkaround) {
      _iOSWorkaround = true;
      Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
    }
    let shouldListen = true;
    const shouldIgnore = (event) => {
      return ignore.some((target2) => {
        if (typeof target2 === "string") {
          return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
        } else {
          const el = unrefElement(target2);
          return el && (event.target === el || event.composedPath().includes(el));
        }
      });
    };
    const listener = (event) => {
      const el = unrefElement(target);
      if (!el || el === event.target || event.composedPath().includes(el))
        return;
      if (event.detail === 0)
        shouldListen = !shouldIgnore(event);
      if (!shouldListen) {
        shouldListen = true;
        return;
      }
      handler(event);
    };
    const cleanup = [
      useEventListener(window2, "click", listener, { passive: true, capture }),
      useEventListener(window2, "pointerdown", (e) => {
        const el = unrefElement(target);
        if (el)
          shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
      }, { passive: true }),
      detectIframe && useEventListener(window2, "blur", (event) => {
        var _a2;
        const el = unrefElement(target);
        if (((_a2 = window2.document.activeElement) == null ? void 0 : _a2.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
          handler(event);
      })
    ].filter(Boolean);
    const stop = () => cleanup.forEach((fn2) => fn2());
    return stop;
  }
  function useSupported(callback, sync = false) {
    const isSupported = vue.ref();
    const update = () => isSupported.value = Boolean(callback());
    update();
    tryOnMounted(update, sync);
    return isSupported;
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  _global[globalKey];
  var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
  var __hasOwnProp$g = Object.prototype.hasOwnProperty;
  var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$g)
      for (var prop of __getOwnPropSymbols$g(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useResizeObserver(target, callback, options = {}) {
    const _a2 = options, { window: window2 = defaultWindow } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
    let observer;
    const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported.value && window2 && el) {
        observer = new ResizeObserver(callback);
        observer.observe(el, observerOptions);
      }
    }, { immediate: true, flush: "post" });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }
  var SwipeDirection;
  (function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
  })(SwipeDirection || (SwipeDirection = {}));
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a2, b2) => {
    for (var prop in b2 || (b2 = {}))
      if (__hasOwnProp.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b2)) {
        if (__propIsEnum.call(b2, prop))
          __defNormalProp(a2, prop, b2[prop]);
      }
    return a2;
  };
  const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
  __spreadValues({
    linear: identity$1
  }, _TransitionPresets);
  /**
  * @vue/shared v3.4.31
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const NOOP = () => {
  };
  const hasOwnProperty$c = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$c.call(val, key);
  const isArray$2 = Array.isArray;
  const isFunction$1 = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  const freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  const root$1 = root;
  var Symbol$1 = root$1.Symbol;
  const Symbol$2 = Symbol$1;
  var objectProto$e = Object.prototype;
  var hasOwnProperty$b = objectProto$e.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$e.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$b.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto$d = Object.prototype;
  var nativeObjectToString = objectProto$d.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag$1 = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
  }
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var isArray = Array.isArray;
  const isArray$1 = isArray;
  var INFINITY$1 = 1 / 0;
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray$1(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  function identity(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var coreJsData = root$1["__core-js_shared__"];
  const coreJsData$1 = coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype, objectProto$c = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$a = objectProto$c.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString$1.call(hasOwnProperty$a).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var WeakMap = getNative(root$1, "WeakMap");
  const WeakMap$1 = WeakMap;
  var objectCreate = Object.create;
  var baseCreate = function() {
    function object() {
    }
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  const baseCreate$1 = baseCreate;
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  function constant(value) {
    return function() {
      return value;
    };
  }
  var defineProperty = function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();
  const defineProperty$1 = defineProperty;
  var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
    return defineProperty$1(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };
  const baseSetToString$1 = baseSetToString;
  var setToString = shortOut(baseSetToString$1);
  const setToString$1 = setToString;
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty$1) {
      defineProperty$1(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var objectProto$b = Object.prototype;
  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$9.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  var nativeMax$1 = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax$1(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax$1(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  function baseRest(func, start) {
    return setToString$1(overRest(func, start, identity), func + "");
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
      return eq(object[index], value);
    }
    return false;
  }
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  var objectProto$a = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$a;
    return value === proto;
  }
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var argsTag$2 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$2;
  }
  var objectProto$9 = Object.prototype;
  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$8.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  const isArguments$1 = isArguments;
  function stubFalse() {
    return false;
  }
  var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  const isBuffer$1 = isBuffer;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", weakMapTag$1 = "[object WeakMap]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var freeProcess = moduleExports$1 && freeGlobal$1.process;
  var nodeUtil = function() {
    try {
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  const nodeUtil$1 = nodeUtil;
  var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  const isTypedArray$1 = isTypedArray;
  var objectProto$8 = Object.prototype;
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$7.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var nativeKeys = overArg(Object.keys, Object);
  const nativeKeys$1 = nativeKeys;
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys$1(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$6.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  var objectProto$6 = Object.prototype;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$5.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray$1(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var nativeCreate = getNative(Object, "create");
  const nativeCreate$1 = nativeCreate;
  function hashClear() {
    this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
    this.size = 0;
  }
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? void 0 : result;
    }
    return hasOwnProperty$4.call(data, key) ? data[key] : void 0;
  }
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$3.call(data, key);
  }
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  var Map$1 = getNative(root$1, "Map");
  const Map$2 = Map$1;
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$2 || ListCache)(),
      "string": new Hash()
    };
  }
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function getMapData(map2, key) {
    var data = map2.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  const stringToPath$1 = stringToPath;
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function castPath(value, object) {
    if (isArray$1(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath$1(toString(value));
  }
  var INFINITY = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }
  var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray$1(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }
  function flatRest(func) {
    return setToString$1(overRest(func, void 0, flatten), func + "");
  }
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  const getPrototype$1 = getPrototype;
  var objectTag$2 = "[object Object]";
  var funcProto = Function.prototype, objectProto$3 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag$2) {
      return false;
    }
    var proto = getPrototype$1(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$2.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  function stubArray() {
    return [];
  }
  var objectProto$2 = Object.prototype;
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  const getSymbols$1 = getSymbols;
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols$1);
  }
  var DataView = getNative(root$1, "DataView");
  const DataView$1 = DataView;
  var Promise$1 = getNative(root$1, "Promise");
  const Promise$2 = Promise$1;
  var Set$1 = getNative(root$1, "Set");
  const Set$2 = Set$1;
  var mapTag$1 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$1 = "[object Set]", weakMapTag = "[object WeakMap]";
  var dataViewTag$1 = "[object DataView]";
  var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$1);
  var getTag = baseGetTag;
  if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1 || Map$2 && getTag(new Map$2()) != mapTag$1 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag$1 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$1;
          case mapCtorString:
            return mapTag$1;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$1;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  const getTag$1 = getTag;
  var Uint8Array = root$1.Uint8Array;
  const Uint8Array$1 = Uint8Array;
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate$1(getPrototype$1(object)) : {};
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function mapToArray(map2) {
    var index = -1, result = Array(map2.size);
    map2.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
  var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray$1(object), othIsArr = isArray$1(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer$1(object)) {
      if (!isBuffer$1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray$1(object) || isArguments$1(object));
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray$1(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var baseFor = createBaseFor();
  const baseFor$1 = baseFor;
  function baseForOwn(object, iteratee) {
    return object && baseFor$1(object, iteratee, keys);
  }
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  var baseEach = createBaseEach(baseForOwn);
  const baseEach$1 = baseEach;
  var now = function() {
    return root$1.Date.now();
  };
  const now$1 = now;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now$1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now$1());
    }
    function debounced() {
      var time = now$1(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  function assignMergeValue(object, key, value) {
    if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  function safeGet(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray$1(srcValue), isBuff = !isArr && isBuffer$1(srcValue), isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray$1(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments$1(srcValue)) {
        newValue = objValue;
        if (isArguments$1(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor$1(source, function(srcValue, key) {
      stack || (stack = new Stack());
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }
  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach$1(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }
  function map(collection, iteratee) {
    var func = isArray$1(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee));
  }
  function flatMap(collection, iteratee) {
    return baseFlatten(map(collection, iteratee), 1);
  }
  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  function isNil(value) {
    return value == null;
  }
  function isUndefined$1(value) {
    return value === void 0;
  }
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });
  const merge$1 = merge;
  function baseSet(object, path, value, customizer) {
    if (!isObject(object)) {
      return object;
    }
    path = castPath(path, object);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }
  function basePickBy(object, paths, predicate) {
    var index = -1, length = paths.length, result = {};
    while (++index < length) {
      var path = paths[index], value = baseGet(object, path);
      if (predicate(value, path)) {
        baseSet(result, castPath(path, object), value);
      }
    }
    return result;
  }
  function basePick(object, paths) {
    return basePickBy(object, paths, function(value, path) {
      return hasIn(object, path);
    });
  }
  var pick = flatRest(function(object, paths) {
    return object == null ? {} : basePick(object, paths);
  });
  const pick$1 = pick;
  function set(object, path, value) {
    return object == null ? object : baseSet(object, path, value);
  }
  const isUndefined = (val) => val === void 0;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => typeof val === "number";
  const isElement = (e) => {
    if (typeof Element === "undefined")
      return false;
    return e instanceof Element;
  };
  const isPropAbsent = (prop) => {
    return isNil(prop);
  };
  const isStringNumber = (val) => {
    if (!isString(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
  };
  const rAF = (fn2) => isClient ? window.requestAnimationFrame(fn2) : setTimeout(fn2, 16);
  const keysOf = (arr) => Object.keys(arr);
  const getProp = (obj, path, defaultValue) => {
    return {
      get value() {
        return get(obj, path, defaultValue);
      },
      set value(val) {
        set(obj, path, val);
      }
    };
  };
  class ElementPlusError extends Error {
    constructor(m2) {
      super(m2);
      this.name = "ElementPlusError";
    }
  }
  function throwError(scope, m2) {
    throw new ElementPlusError(`[${scope}] ${m2}`);
  }
  function debugWarn(scope, message2) {
  }
  const classNameToArray = (cls = "") => cls.split(" ").filter((item) => !!item.trim());
  const hasClass = (el, cls) => {
    if (!el || !cls)
      return false;
    if (cls.includes(" "))
      throw new Error("className should not contain space.");
    return el.classList.contains(cls);
  };
  const addClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.add(...classNameToArray(cls));
  };
  const removeClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.remove(...classNameToArray(cls));
  };
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString(value)) {
      return value;
    }
  }
  /*! Element Plus Icons Vue v2.3.1 */
  var arrow_down_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowDown",
    __name: "arrow-down",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        })
      ]));
    }
  });
  var arrow_down_default = arrow_down_vue_vue_type_script_setup_true_lang_default;
  var arrow_right_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowRight",
    __name: "arrow-right",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
        })
      ]));
    }
  });
  var arrow_right_default = arrow_right_vue_vue_type_script_setup_true_lang_default;
  var arrow_up_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowUp",
    __name: "arrow-up",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
        })
      ]));
    }
  });
  var arrow_up_default = arrow_up_vue_vue_type_script_setup_true_lang_default;
  var circle_close_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCloseFilled",
    __name: "circle-close-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
        })
      ]));
    }
  });
  var circle_close_filled_default = circle_close_filled_vue_vue_type_script_setup_true_lang_default;
  var close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Close",
    __name: "close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        })
      ]));
    }
  });
  var close_default = close_vue_vue_type_script_setup_true_lang_default;
  var info_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "InfoFilled",
    __name: "info-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
        })
      ]));
    }
  });
  var info_filled_default = info_filled_vue_vue_type_script_setup_true_lang_default;
  var loading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Loading",
    __name: "loading",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
        })
      ]));
    }
  });
  var loading_default = loading_vue_vue_type_script_setup_true_lang_default;
  var success_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "SuccessFilled",
    __name: "success-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
        })
      ]));
    }
  });
  var success_filled_default = success_filled_vue_vue_type_script_setup_true_lang_default;
  var warning_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "WarningFilled",
    __name: "warning-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
        })
      ]));
    }
  });
  var warning_filled_default = warning_filled_vue_vue_type_script_setup_true_lang_default;
  const epPropKey = "__epPropKey";
  const definePropType = (val) => val;
  const isEpProp = (val) => isObject$1(val) && !!val[epPropKey];
  const buildProp = (prop, key) => {
    if (!isObject$1(prop) || isEpProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        vue.warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
      }
      return valid;
    } : void 0;
    const epProp = {
      type,
      required: !!required,
      validator: _validator,
      [epPropKey]: true
    };
    if (hasOwn(prop, "default"))
      epProp.default = defaultValue;
    return epProp;
  };
  const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
    key,
    buildProp(option, key)
  ]));
  const iconPropType = definePropType([
    String,
    Object,
    Function
  ]);
  const TypeComponents = {
    Close: close_default,
    SuccessFilled: success_filled_default,
    InfoFilled: info_filled_default,
    WarningFilled: warning_filled_default,
    CircleCloseFilled: circle_close_filled_default
  };
  const TypeComponentsMap = {
    success: success_filled_default,
    warning: warning_filled_default,
    error: circle_close_filled_default,
    info: info_filled_default
  };
  const withInstall = (main, extra) => {
    main.install = (app) => {
      for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
        app.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main[key] = comp;
      }
    }
    return main;
  };
  const withInstallFunction = (fn2, name) => {
    fn2.install = (app) => {
      fn2._context = app._context;
      app.config.globalProperties[name] = fn2;
    };
    return fn2;
  };
  const withInstallDirective = (directive, name) => {
    directive.install = (app) => {
      app.directive(name, directive);
    };
    return directive;
  };
  const withNoopInstall = (component) => {
    component.install = NOOP;
    return component;
  };
  const EVENT_CODE = {
    tab: "Tab",
    enter: "Enter",
    space: "Space",
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    esc: "Escape",
    delete: "Delete",
    backspace: "Backspace",
    numpadEnter: "NumpadEnter",
    pageUp: "PageUp",
    pageDown: "PageDown",
    home: "Home",
    end: "End"
  };
  const UPDATE_MODEL_EVENT = "update:modelValue";
  const componentSizes = ["", "default", "small", "large"];
  const mutable = (val) => val;
  const useDeprecated = ({ from, replacement, scope, version, ref, type = "API" }, condition) => {
    vue.watch(() => vue.unref(condition), (val) => {
    }, {
      immediate: true
    });
  };
  var English = {
    name: "en",
    el: {
      breadcrumb: {
        label: "Breadcrumb"
      },
      colorpicker: {
        confirm: "OK",
        clear: "Clear",
        defaultLabel: "color picker",
        description: "current color is {color}. press enter to select a new color."
      },
      datepicker: {
        now: "Now",
        today: "Today",
        cancel: "Cancel",
        clear: "Clear",
        confirm: "OK",
        dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
        monthTablePrompt: "Use the arrow keys and enter to select the month",
        yearTablePrompt: "Use the arrow keys and enter to select the year",
        selectedDate: "Selected date",
        selectDate: "Select date",
        selectTime: "Select time",
        startDate: "Start Date",
        startTime: "Start Time",
        endDate: "End Date",
        endTime: "End Time",
        prevYear: "Previous Year",
        nextYear: "Next Year",
        prevMonth: "Previous Month",
        nextMonth: "Next Month",
        year: "",
        month1: "January",
        month2: "February",
        month3: "March",
        month4: "April",
        month5: "May",
        month6: "June",
        month7: "July",
        month8: "August",
        month9: "September",
        month10: "October",
        month11: "November",
        month12: "December",
        week: "week",
        weeks: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat"
        },
        weeksFull: {
          sun: "Sunday",
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday"
        },
        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        }
      },
      inputNumber: {
        decrease: "decrease number",
        increase: "increase number"
      },
      select: {
        loading: "Loading",
        noMatch: "No matching data",
        noData: "No data",
        placeholder: "Select"
      },
      dropdown: {
        toggleDropdown: "Toggle Dropdown"
      },
      cascader: {
        noMatch: "No matching data",
        loading: "Loading",
        placeholder: "Select",
        noData: "No data"
      },
      pagination: {
        goto: "Go to",
        pagesize: "/page",
        total: "Total {total}",
        pageClassifier: "",
        page: "Page",
        prev: "Go to previous page",
        next: "Go to next page",
        currentPage: "page {pager}",
        prevPages: "Previous {pager} pages",
        nextPages: "Next {pager} pages",
        deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
      },
      dialog: {
        close: "Close this dialog"
      },
      drawer: {
        close: "Close this dialog"
      },
      messagebox: {
        title: "Message",
        confirm: "OK",
        cancel: "Cancel",
        error: "Illegal input",
        close: "Close this dialog"
      },
      upload: {
        deleteTip: "press delete to remove",
        delete: "Delete",
        preview: "Preview",
        continue: "Continue"
      },
      slider: {
        defaultLabel: "slider between {min} and {max}",
        defaultRangeStartLabel: "pick start value",
        defaultRangeEndLabel: "pick end value"
      },
      table: {
        emptyText: "No Data",
        confirmFilter: "Confirm",
        resetFilter: "Reset",
        clearFilter: "All",
        sumText: "Sum"
      },
      tour: {
        next: "Next",
        previous: "Previous",
        finish: "Finish"
      },
      tree: {
        emptyText: "No Data"
      },
      transfer: {
        noMatch: "No matching data",
        noData: "No data",
        titles: ["List 1", "List 2"],
        filterPlaceholder: "Enter keyword",
        noCheckedFormat: "{total} items",
        hasCheckedFormat: "{checked}/{total} checked"
      },
      image: {
        error: "FAILED"
      },
      pageHeader: {
        title: "Back"
      },
      popconfirm: {
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      },
      carousel: {
        leftArrow: "Carousel arrow left",
        rightArrow: "Carousel arrow right",
        indicator: "Carousel switch to index {index}"
      }
    }
  };
  const buildTranslator = (locale) => (path, option) => translate(path, option, vue.unref(locale));
  const translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_2, key) => {
    var _a2;
    return `${(_a2 = option == null ? void 0 : option[key]) != null ? _a2 : `{${key}}`}`;
  });
  const buildLocaleContext = (locale) => {
    const lang = vue.computed(() => vue.unref(locale).name);
    const localeRef = vue.isRef(locale) ? locale : vue.ref(locale);
    return {
      lang,
      locale: localeRef,
      t: buildTranslator(locale)
    };
  };
  const localeContextKey = Symbol("localeContextKey");
  const useLocale = (localeOverrides) => {
    const locale = localeOverrides || vue.inject(localeContextKey, vue.ref());
    return buildLocaleContext(vue.computed(() => locale.value || English));
  };
  const defaultNamespace = "el";
  const statePrefix = "is-";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const namespaceContextKey = Symbol("namespaceContextKey");
  const useGetDerivedNamespace = (namespaceOverrides) => {
    const derivedNamespace = namespaceOverrides || (vue.getCurrentInstance() ? vue.inject(namespaceContextKey, vue.ref(defaultNamespace)) : vue.ref(defaultNamespace));
    const namespace = vue.computed(() => {
      return vue.unref(derivedNamespace) || defaultNamespace;
    });
    return namespace;
  };
  const useNamespace = (block, namespaceOverrides) => {
    const namespace = useGetDerivedNamespace(namespaceOverrides);
    const b2 = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m2 = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be2 = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `${statePrefix}${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b: b2,
      e,
      m: m2,
      be: be2,
      em,
      bm,
      bem,
      is,
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };
  const _prop = buildProp({
    type: definePropType(Boolean),
    default: null
  });
  const _event = buildProp({
    type: definePropType(Function)
  });
  const createModelToggleComposable = (name) => {
    const updateEventKey = `update:${name}`;
    const updateEventKeyRaw2 = `onUpdate:${name}`;
    const useModelToggleEmits2 = [updateEventKey];
    const useModelToggleProps2 = {
      [name]: _prop,
      [updateEventKeyRaw2]: _event
    };
    const useModelToggle2 = ({
      indicator,
      toggleReason,
      shouldHideWhenRouteChanges,
      shouldProceed,
      onShow,
      onHide
    }) => {
      const instance = vue.getCurrentInstance();
      const { emit } = instance;
      const props = instance.props;
      const hasUpdateHandler = vue.computed(() => isFunction$1(props[updateEventKeyRaw2]));
      const isModelBindingAbsent = vue.computed(() => props[name] === null);
      const doShow = (event) => {
        if (indicator.value === true) {
          return;
        }
        indicator.value = true;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onShow)) {
          onShow(event);
        }
      };
      const doHide = (event) => {
        if (indicator.value === false) {
          return;
        }
        indicator.value = false;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onHide)) {
          onHide(event);
        }
      };
      const show = (event) => {
        if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed())
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, true);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doShow(event);
        }
      };
      const hide = (event) => {
        if (props.disabled === true || !isClient)
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, false);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doHide(event);
        }
      };
      const onChange = (val) => {
        if (!isBoolean(val))
          return;
        if (props.disabled && val) {
          if (hasUpdateHandler.value) {
            emit(updateEventKey, false);
          }
        } else if (indicator.value !== val) {
          if (val) {
            doShow();
          } else {
            doHide();
          }
        }
      };
      const toggle = () => {
        if (indicator.value) {
          hide();
        } else {
          show();
        }
      };
      vue.watch(() => props[name], onChange);
      if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) {
        vue.watch(() => ({
          ...instance.proxy.$route
        }), () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        });
      }
      vue.onMounted(() => {
        onChange(props[name]);
      });
      return {
        hide,
        show,
        toggle,
        hasUpdateHandler
      };
    };
    return {
      useModelToggle: useModelToggle2,
      useModelToggleProps: useModelToggleProps2,
      useModelToggleEmits: useModelToggleEmits2
    };
  };
  const useProp = (name) => {
    const vm = vue.getCurrentInstance();
    return vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a2.$props) == null ? void 0 : _b[name];
    });
  };
  var E$1 = "top", R = "bottom", W = "right", P$1 = "left", me = "auto", G = [E$1, R, W, P$1], U$1 = "start", J = "end", Xe = "clippingParents", je = "viewport", K = "popper", Ye = "reference", De = G.reduce(function(t, e) {
    return t.concat([e + "-" + U$1, e + "-" + J]);
  }, []), Ee = [].concat(G, [me]).reduce(function(t, e) {
    return t.concat([e, e + "-" + U$1, e + "-" + J]);
  }, []), Ge = "beforeRead", Je = "read", Ke = "afterRead", Qe = "beforeMain", Ze = "main", et = "afterMain", tt = "beforeWrite", nt = "write", rt = "afterWrite", ot = [Ge, Je, Ke, Qe, Ze, et, tt, nt, rt];
  function C(t) {
    return t ? (t.nodeName || "").toLowerCase() : null;
  }
  function H(t) {
    if (t == null)
      return window;
    if (t.toString() !== "[object Window]") {
      var e = t.ownerDocument;
      return e && e.defaultView || window;
    }
    return t;
  }
  function Q(t) {
    var e = H(t).Element;
    return t instanceof e || t instanceof Element;
  }
  function B(t) {
    var e = H(t).HTMLElement;
    return t instanceof e || t instanceof HTMLElement;
  }
  function Pe(t) {
    if (typeof ShadowRoot == "undefined")
      return false;
    var e = H(t).ShadowRoot;
    return t instanceof e || t instanceof ShadowRoot;
  }
  function Mt(t) {
    var e = t.state;
    Object.keys(e.elements).forEach(function(n) {
      var r = e.styles[n] || {}, o2 = e.attributes[n] || {}, i = e.elements[n];
      !B(i) || !C(i) || (Object.assign(i.style, r), Object.keys(o2).forEach(function(a2) {
        var s2 = o2[a2];
        s2 === false ? i.removeAttribute(a2) : i.setAttribute(a2, s2 === true ? "" : s2);
      }));
    });
  }
  function Rt(t) {
    var e = t.state, n = { popper: { position: e.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
    return Object.assign(e.elements.popper.style, n.popper), e.styles = n, e.elements.arrow && Object.assign(e.elements.arrow.style, n.arrow), function() {
      Object.keys(e.elements).forEach(function(r) {
        var o2 = e.elements[r], i = e.attributes[r] || {}, a2 = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : n[r]), s2 = a2.reduce(function(f2, c2) {
          return f2[c2] = "", f2;
        }, {});
        !B(o2) || !C(o2) || (Object.assign(o2.style, s2), Object.keys(i).forEach(function(f2) {
          o2.removeAttribute(f2);
        }));
      });
    };
  }
  var Ae = { name: "applyStyles", enabled: true, phase: "write", fn: Mt, effect: Rt, requires: ["computeStyles"] };
  function q(t) {
    return t.split("-")[0];
  }
  var X$1 = Math.max, ve = Math.min, Z = Math.round;
  function ee(t, e) {
    e === void 0 && (e = false);
    var n = t.getBoundingClientRect(), r = 1, o2 = 1;
    if (B(t) && e) {
      var i = t.offsetHeight, a2 = t.offsetWidth;
      a2 > 0 && (r = Z(n.width) / a2 || 1), i > 0 && (o2 = Z(n.height) / i || 1);
    }
    return { width: n.width / r, height: n.height / o2, top: n.top / o2, right: n.right / r, bottom: n.bottom / o2, left: n.left / r, x: n.left / r, y: n.top / o2 };
  }
  function ke(t) {
    var e = ee(t), n = t.offsetWidth, r = t.offsetHeight;
    return Math.abs(e.width - n) <= 1 && (n = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), { x: t.offsetLeft, y: t.offsetTop, width: n, height: r };
  }
  function it(t, e) {
    var n = e.getRootNode && e.getRootNode();
    if (t.contains(e))
      return true;
    if (n && Pe(n)) {
      var r = e;
      do {
        if (r && t.isSameNode(r))
          return true;
        r = r.parentNode || r.host;
      } while (r);
    }
    return false;
  }
  function N$1(t) {
    return H(t).getComputedStyle(t);
  }
  function Wt(t) {
    return ["table", "td", "th"].indexOf(C(t)) >= 0;
  }
  function I$1(t) {
    return ((Q(t) ? t.ownerDocument : t.document) || window.document).documentElement;
  }
  function ge(t) {
    return C(t) === "html" ? t : t.assignedSlot || t.parentNode || (Pe(t) ? t.host : null) || I$1(t);
  }
  function at(t) {
    return !B(t) || N$1(t).position === "fixed" ? null : t.offsetParent;
  }
  function Bt(t) {
    var e = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1, n = navigator.userAgent.indexOf("Trident") !== -1;
    if (n && B(t)) {
      var r = N$1(t);
      if (r.position === "fixed")
        return null;
    }
    var o2 = ge(t);
    for (Pe(o2) && (o2 = o2.host); B(o2) && ["html", "body"].indexOf(C(o2)) < 0; ) {
      var i = N$1(o2);
      if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none")
        return o2;
      o2 = o2.parentNode;
    }
    return null;
  }
  function se(t) {
    for (var e = H(t), n = at(t); n && Wt(n) && N$1(n).position === "static"; )
      n = at(n);
    return n && (C(n) === "html" || C(n) === "body" && N$1(n).position === "static") ? e : n || Bt(t) || e;
  }
  function Le(t) {
    return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
  }
  function fe(t, e, n) {
    return X$1(t, ve(e, n));
  }
  function St(t, e, n) {
    var r = fe(t, e, n);
    return r > n ? n : r;
  }
  function st() {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  function ft(t) {
    return Object.assign({}, st(), t);
  }
  function ct(t, e) {
    return e.reduce(function(n, r) {
      return n[r] = t, n;
    }, {});
  }
  var Tt = function(t, e) {
    return t = typeof t == "function" ? t(Object.assign({}, e.rects, { placement: e.placement })) : t, ft(typeof t != "number" ? t : ct(t, G));
  };
  function Ht(t) {
    var e, n = t.state, r = t.name, o2 = t.options, i = n.elements.arrow, a2 = n.modifiersData.popperOffsets, s2 = q(n.placement), f2 = Le(s2), c2 = [P$1, W].indexOf(s2) >= 0, u2 = c2 ? "height" : "width";
    if (!(!i || !a2)) {
      var m2 = Tt(o2.padding, n), v2 = ke(i), l2 = f2 === "y" ? E$1 : P$1, h2 = f2 === "y" ? R : W, p2 = n.rects.reference[u2] + n.rects.reference[f2] - a2[f2] - n.rects.popper[u2], g = a2[f2] - n.rects.reference[f2], x2 = se(i), y = x2 ? f2 === "y" ? x2.clientHeight || 0 : x2.clientWidth || 0 : 0, $ = p2 / 2 - g / 2, d2 = m2[l2], b2 = y - v2[u2] - m2[h2], w2 = y / 2 - v2[u2] / 2 + $, O2 = fe(d2, w2, b2), j = f2;
      n.modifiersData[r] = (e = {}, e[j] = O2, e.centerOffset = O2 - w2, e);
    }
  }
  function Ct(t) {
    var e = t.state, n = t.options, r = n.element, o2 = r === void 0 ? "[data-popper-arrow]" : r;
    o2 != null && (typeof o2 == "string" && (o2 = e.elements.popper.querySelector(o2), !o2) || !it(e.elements.popper, o2) || (e.elements.arrow = o2));
  }
  var pt = { name: "arrow", enabled: true, phase: "main", fn: Ht, effect: Ct, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] };
  function te(t) {
    return t.split("-")[1];
  }
  var qt = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function Vt(t) {
    var e = t.x, n = t.y, r = window, o2 = r.devicePixelRatio || 1;
    return { x: Z(e * o2) / o2 || 0, y: Z(n * o2) / o2 || 0 };
  }
  function ut(t) {
    var e, n = t.popper, r = t.popperRect, o2 = t.placement, i = t.variation, a2 = t.offsets, s2 = t.position, f2 = t.gpuAcceleration, c2 = t.adaptive, u2 = t.roundOffsets, m2 = t.isFixed, v2 = a2.x, l2 = v2 === void 0 ? 0 : v2, h2 = a2.y, p2 = h2 === void 0 ? 0 : h2, g = typeof u2 == "function" ? u2({ x: l2, y: p2 }) : { x: l2, y: p2 };
    l2 = g.x, p2 = g.y;
    var x2 = a2.hasOwnProperty("x"), y = a2.hasOwnProperty("y"), $ = P$1, d2 = E$1, b2 = window;
    if (c2) {
      var w2 = se(n), O2 = "clientHeight", j = "clientWidth";
      if (w2 === H(n) && (w2 = I$1(n), N$1(w2).position !== "static" && s2 === "absolute" && (O2 = "scrollHeight", j = "scrollWidth")), w2 = w2, o2 === E$1 || (o2 === P$1 || o2 === W) && i === J) {
        d2 = R;
        var A2 = m2 && w2 === b2 && b2.visualViewport ? b2.visualViewport.height : w2[O2];
        p2 -= A2 - r.height, p2 *= f2 ? 1 : -1;
      }
      if (o2 === P$1 || (o2 === E$1 || o2 === R) && i === J) {
        $ = W;
        var k = m2 && w2 === b2 && b2.visualViewport ? b2.visualViewport.width : w2[j];
        l2 -= k - r.width, l2 *= f2 ? 1 : -1;
      }
    }
    var D2 = Object.assign({ position: s2 }, c2 && qt), S2 = u2 === true ? Vt({ x: l2, y: p2 }) : { x: l2, y: p2 };
    if (l2 = S2.x, p2 = S2.y, f2) {
      var L;
      return Object.assign({}, D2, (L = {}, L[d2] = y ? "0" : "", L[$] = x2 ? "0" : "", L.transform = (b2.devicePixelRatio || 1) <= 1 ? "translate(" + l2 + "px, " + p2 + "px)" : "translate3d(" + l2 + "px, " + p2 + "px, 0)", L));
    }
    return Object.assign({}, D2, (e = {}, e[d2] = y ? p2 + "px" : "", e[$] = x2 ? l2 + "px" : "", e.transform = "", e));
  }
  function Nt(t) {
    var e = t.state, n = t.options, r = n.gpuAcceleration, o2 = r === void 0 ? true : r, i = n.adaptive, a2 = i === void 0 ? true : i, s2 = n.roundOffsets, f2 = s2 === void 0 ? true : s2, c2 = { placement: q(e.placement), variation: te(e.placement), popper: e.elements.popper, popperRect: e.rects.popper, gpuAcceleration: o2, isFixed: e.options.strategy === "fixed" };
    e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, ut(Object.assign({}, c2, { offsets: e.modifiersData.popperOffsets, position: e.options.strategy, adaptive: a2, roundOffsets: f2 })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, ut(Object.assign({}, c2, { offsets: e.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: f2 })))), e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-placement": e.placement });
  }
  var Me = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: Nt, data: {} }, ye = { passive: true };
  function It(t) {
    var e = t.state, n = t.instance, r = t.options, o2 = r.scroll, i = o2 === void 0 ? true : o2, a2 = r.resize, s2 = a2 === void 0 ? true : a2, f2 = H(e.elements.popper), c2 = [].concat(e.scrollParents.reference, e.scrollParents.popper);
    return i && c2.forEach(function(u2) {
      u2.addEventListener("scroll", n.update, ye);
    }), s2 && f2.addEventListener("resize", n.update, ye), function() {
      i && c2.forEach(function(u2) {
        u2.removeEventListener("scroll", n.update, ye);
      }), s2 && f2.removeEventListener("resize", n.update, ye);
    };
  }
  var Re = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
  }, effect: It, data: {} }, _t = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function be(t) {
    return t.replace(/left|right|bottom|top/g, function(e) {
      return _t[e];
    });
  }
  var zt = { start: "end", end: "start" };
  function lt(t) {
    return t.replace(/start|end/g, function(e) {
      return zt[e];
    });
  }
  function We(t) {
    var e = H(t), n = e.pageXOffset, r = e.pageYOffset;
    return { scrollLeft: n, scrollTop: r };
  }
  function Be(t) {
    return ee(I$1(t)).left + We(t).scrollLeft;
  }
  function Ft(t) {
    var e = H(t), n = I$1(t), r = e.visualViewport, o2 = n.clientWidth, i = n.clientHeight, a2 = 0, s2 = 0;
    return r && (o2 = r.width, i = r.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (a2 = r.offsetLeft, s2 = r.offsetTop)), { width: o2, height: i, x: a2 + Be(t), y: s2 };
  }
  function Ut(t) {
    var e, n = I$1(t), r = We(t), o2 = (e = t.ownerDocument) == null ? void 0 : e.body, i = X$1(n.scrollWidth, n.clientWidth, o2 ? o2.scrollWidth : 0, o2 ? o2.clientWidth : 0), a2 = X$1(n.scrollHeight, n.clientHeight, o2 ? o2.scrollHeight : 0, o2 ? o2.clientHeight : 0), s2 = -r.scrollLeft + Be(t), f2 = -r.scrollTop;
    return N$1(o2 || n).direction === "rtl" && (s2 += X$1(n.clientWidth, o2 ? o2.clientWidth : 0) - i), { width: i, height: a2, x: s2, y: f2 };
  }
  function Se(t) {
    var e = N$1(t), n = e.overflow, r = e.overflowX, o2 = e.overflowY;
    return /auto|scroll|overlay|hidden/.test(n + o2 + r);
  }
  function dt(t) {
    return ["html", "body", "#document"].indexOf(C(t)) >= 0 ? t.ownerDocument.body : B(t) && Se(t) ? t : dt(ge(t));
  }
  function ce(t, e) {
    var n;
    e === void 0 && (e = []);
    var r = dt(t), o2 = r === ((n = t.ownerDocument) == null ? void 0 : n.body), i = H(r), a2 = o2 ? [i].concat(i.visualViewport || [], Se(r) ? r : []) : r, s2 = e.concat(a2);
    return o2 ? s2 : s2.concat(ce(ge(a2)));
  }
  function Te(t) {
    return Object.assign({}, t, { left: t.x, top: t.y, right: t.x + t.width, bottom: t.y + t.height });
  }
  function Xt(t) {
    var e = ee(t);
    return e.top = e.top + t.clientTop, e.left = e.left + t.clientLeft, e.bottom = e.top + t.clientHeight, e.right = e.left + t.clientWidth, e.width = t.clientWidth, e.height = t.clientHeight, e.x = e.left, e.y = e.top, e;
  }
  function ht(t, e) {
    return e === je ? Te(Ft(t)) : Q(e) ? Xt(e) : Te(Ut(I$1(t)));
  }
  function Yt(t) {
    var e = ce(ge(t)), n = ["absolute", "fixed"].indexOf(N$1(t).position) >= 0, r = n && B(t) ? se(t) : t;
    return Q(r) ? e.filter(function(o2) {
      return Q(o2) && it(o2, r) && C(o2) !== "body";
    }) : [];
  }
  function Gt(t, e, n) {
    var r = e === "clippingParents" ? Yt(t) : [].concat(e), o2 = [].concat(r, [n]), i = o2[0], a2 = o2.reduce(function(s2, f2) {
      var c2 = ht(t, f2);
      return s2.top = X$1(c2.top, s2.top), s2.right = ve(c2.right, s2.right), s2.bottom = ve(c2.bottom, s2.bottom), s2.left = X$1(c2.left, s2.left), s2;
    }, ht(t, i));
    return a2.width = a2.right - a2.left, a2.height = a2.bottom - a2.top, a2.x = a2.left, a2.y = a2.top, a2;
  }
  function mt(t) {
    var e = t.reference, n = t.element, r = t.placement, o2 = r ? q(r) : null, i = r ? te(r) : null, a2 = e.x + e.width / 2 - n.width / 2, s2 = e.y + e.height / 2 - n.height / 2, f2;
    switch (o2) {
      case E$1:
        f2 = { x: a2, y: e.y - n.height };
        break;
      case R:
        f2 = { x: a2, y: e.y + e.height };
        break;
      case W:
        f2 = { x: e.x + e.width, y: s2 };
        break;
      case P$1:
        f2 = { x: e.x - n.width, y: s2 };
        break;
      default:
        f2 = { x: e.x, y: e.y };
    }
    var c2 = o2 ? Le(o2) : null;
    if (c2 != null) {
      var u2 = c2 === "y" ? "height" : "width";
      switch (i) {
        case U$1:
          f2[c2] = f2[c2] - (e[u2] / 2 - n[u2] / 2);
          break;
        case J:
          f2[c2] = f2[c2] + (e[u2] / 2 - n[u2] / 2);
          break;
      }
    }
    return f2;
  }
  function ne(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o2 = r === void 0 ? t.placement : r, i = n.boundary, a2 = i === void 0 ? Xe : i, s2 = n.rootBoundary, f2 = s2 === void 0 ? je : s2, c2 = n.elementContext, u2 = c2 === void 0 ? K : c2, m2 = n.altBoundary, v2 = m2 === void 0 ? false : m2, l2 = n.padding, h2 = l2 === void 0 ? 0 : l2, p2 = ft(typeof h2 != "number" ? h2 : ct(h2, G)), g = u2 === K ? Ye : K, x2 = t.rects.popper, y = t.elements[v2 ? g : u2], $ = Gt(Q(y) ? y : y.contextElement || I$1(t.elements.popper), a2, f2), d2 = ee(t.elements.reference), b2 = mt({ reference: d2, element: x2, strategy: "absolute", placement: o2 }), w2 = Te(Object.assign({}, x2, b2)), O2 = u2 === K ? w2 : d2, j = { top: $.top - O2.top + p2.top, bottom: O2.bottom - $.bottom + p2.bottom, left: $.left - O2.left + p2.left, right: O2.right - $.right + p2.right }, A2 = t.modifiersData.offset;
    if (u2 === K && A2) {
      var k = A2[o2];
      Object.keys(j).forEach(function(D2) {
        var S2 = [W, R].indexOf(D2) >= 0 ? 1 : -1, L = [E$1, R].indexOf(D2) >= 0 ? "y" : "x";
        j[D2] += k[L] * S2;
      });
    }
    return j;
  }
  function Jt(t, e) {
    e === void 0 && (e = {});
    var n = e, r = n.placement, o2 = n.boundary, i = n.rootBoundary, a2 = n.padding, s2 = n.flipVariations, f2 = n.allowedAutoPlacements, c2 = f2 === void 0 ? Ee : f2, u2 = te(r), m2 = u2 ? s2 ? De : De.filter(function(h2) {
      return te(h2) === u2;
    }) : G, v2 = m2.filter(function(h2) {
      return c2.indexOf(h2) >= 0;
    });
    v2.length === 0 && (v2 = m2);
    var l2 = v2.reduce(function(h2, p2) {
      return h2[p2] = ne(t, { placement: p2, boundary: o2, rootBoundary: i, padding: a2 })[q(p2)], h2;
    }, {});
    return Object.keys(l2).sort(function(h2, p2) {
      return l2[h2] - l2[p2];
    });
  }
  function Kt(t) {
    if (q(t) === me)
      return [];
    var e = be(t);
    return [lt(t), e, lt(e)];
  }
  function Qt(t) {
    var e = t.state, n = t.options, r = t.name;
    if (!e.modifiersData[r]._skip) {
      for (var o2 = n.mainAxis, i = o2 === void 0 ? true : o2, a2 = n.altAxis, s2 = a2 === void 0 ? true : a2, f2 = n.fallbackPlacements, c2 = n.padding, u2 = n.boundary, m2 = n.rootBoundary, v2 = n.altBoundary, l2 = n.flipVariations, h2 = l2 === void 0 ? true : l2, p2 = n.allowedAutoPlacements, g = e.options.placement, x2 = q(g), y = x2 === g, $ = f2 || (y || !h2 ? [be(g)] : Kt(g)), d2 = [g].concat($).reduce(function(z, V) {
        return z.concat(q(V) === me ? Jt(e, { placement: V, boundary: u2, rootBoundary: m2, padding: c2, flipVariations: h2, allowedAutoPlacements: p2 }) : V);
      }, []), b2 = e.rects.reference, w2 = e.rects.popper, O2 = /* @__PURE__ */ new Map(), j = true, A2 = d2[0], k = 0; k < d2.length; k++) {
        var D2 = d2[k], S2 = q(D2), L = te(D2) === U$1, re = [E$1, R].indexOf(S2) >= 0, oe = re ? "width" : "height", M2 = ne(e, { placement: D2, boundary: u2, rootBoundary: m2, altBoundary: v2, padding: c2 }), T2 = re ? L ? W : P$1 : L ? R : E$1;
        b2[oe] > w2[oe] && (T2 = be(T2));
        var pe = be(T2), _2 = [];
        if (i && _2.push(M2[S2] <= 0), s2 && _2.push(M2[T2] <= 0, M2[pe] <= 0), _2.every(function(z) {
          return z;
        })) {
          A2 = D2, j = false;
          break;
        }
        O2.set(D2, _2);
      }
      if (j)
        for (var ue = h2 ? 3 : 1, xe = function(z) {
          var V = d2.find(function(de) {
            var ae = O2.get(de);
            if (ae)
              return ae.slice(0, z).every(function(Y2) {
                return Y2;
              });
          });
          if (V)
            return A2 = V, "break";
        }, ie = ue; ie > 0; ie--) {
          var le = xe(ie);
          if (le === "break")
            break;
        }
      e.placement !== A2 && (e.modifiersData[r]._skip = true, e.placement = A2, e.reset = true);
    }
  }
  var vt = { name: "flip", enabled: true, phase: "main", fn: Qt, requiresIfExists: ["offset"], data: { _skip: false } };
  function gt(t, e, n) {
    return n === void 0 && (n = { x: 0, y: 0 }), { top: t.top - e.height - n.y, right: t.right - e.width + n.x, bottom: t.bottom - e.height + n.y, left: t.left - e.width - n.x };
  }
  function yt(t) {
    return [E$1, W, R, P$1].some(function(e) {
      return t[e] >= 0;
    });
  }
  function Zt(t) {
    var e = t.state, n = t.name, r = e.rects.reference, o2 = e.rects.popper, i = e.modifiersData.preventOverflow, a2 = ne(e, { elementContext: "reference" }), s2 = ne(e, { altBoundary: true }), f2 = gt(a2, r), c2 = gt(s2, o2, i), u2 = yt(f2), m2 = yt(c2);
    e.modifiersData[n] = { referenceClippingOffsets: f2, popperEscapeOffsets: c2, isReferenceHidden: u2, hasPopperEscaped: m2 }, e.attributes.popper = Object.assign({}, e.attributes.popper, { "data-popper-reference-hidden": u2, "data-popper-escaped": m2 });
  }
  var bt = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: Zt };
  function en(t, e, n) {
    var r = q(t), o2 = [P$1, E$1].indexOf(r) >= 0 ? -1 : 1, i = typeof n == "function" ? n(Object.assign({}, e, { placement: t })) : n, a2 = i[0], s2 = i[1];
    return a2 = a2 || 0, s2 = (s2 || 0) * o2, [P$1, W].indexOf(r) >= 0 ? { x: s2, y: a2 } : { x: a2, y: s2 };
  }
  function tn(t) {
    var e = t.state, n = t.options, r = t.name, o2 = n.offset, i = o2 === void 0 ? [0, 0] : o2, a2 = Ee.reduce(function(u2, m2) {
      return u2[m2] = en(m2, e.rects, i), u2;
    }, {}), s2 = a2[e.placement], f2 = s2.x, c2 = s2.y;
    e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += f2, e.modifiersData.popperOffsets.y += c2), e.modifiersData[r] = a2;
  }
  var wt = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: tn };
  function nn(t) {
    var e = t.state, n = t.name;
    e.modifiersData[n] = mt({ reference: e.rects.reference, element: e.rects.popper, strategy: "absolute", placement: e.placement });
  }
  var He = { name: "popperOffsets", enabled: true, phase: "read", fn: nn, data: {} };
  function rn(t) {
    return t === "x" ? "y" : "x";
  }
  function on(t) {
    var e = t.state, n = t.options, r = t.name, o2 = n.mainAxis, i = o2 === void 0 ? true : o2, a2 = n.altAxis, s2 = a2 === void 0 ? false : a2, f2 = n.boundary, c2 = n.rootBoundary, u2 = n.altBoundary, m2 = n.padding, v2 = n.tether, l2 = v2 === void 0 ? true : v2, h2 = n.tetherOffset, p2 = h2 === void 0 ? 0 : h2, g = ne(e, { boundary: f2, rootBoundary: c2, padding: m2, altBoundary: u2 }), x2 = q(e.placement), y = te(e.placement), $ = !y, d2 = Le(x2), b2 = rn(d2), w2 = e.modifiersData.popperOffsets, O2 = e.rects.reference, j = e.rects.popper, A2 = typeof p2 == "function" ? p2(Object.assign({}, e.rects, { placement: e.placement })) : p2, k = typeof A2 == "number" ? { mainAxis: A2, altAxis: A2 } : Object.assign({ mainAxis: 0, altAxis: 0 }, A2), D2 = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, S2 = { x: 0, y: 0 };
    if (w2) {
      if (i) {
        var L, re = d2 === "y" ? E$1 : P$1, oe = d2 === "y" ? R : W, M2 = d2 === "y" ? "height" : "width", T2 = w2[d2], pe = T2 + g[re], _2 = T2 - g[oe], ue = l2 ? -j[M2] / 2 : 0, xe = y === U$1 ? O2[M2] : j[M2], ie = y === U$1 ? -j[M2] : -O2[M2], le = e.elements.arrow, z = l2 && le ? ke(le) : { width: 0, height: 0 }, V = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : st(), de = V[re], ae = V[oe], Y2 = fe(0, O2[M2], z[M2]), jt = $ ? O2[M2] / 2 - ue - Y2 - de - k.mainAxis : xe - Y2 - de - k.mainAxis, Dt = $ ? -O2[M2] / 2 + ue + Y2 + ae + k.mainAxis : ie + Y2 + ae + k.mainAxis, Oe = e.elements.arrow && se(e.elements.arrow), Et = Oe ? d2 === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (L = D2 == null ? void 0 : D2[d2]) != null ? L : 0, Pt = T2 + jt - Ce - Et, At = T2 + Dt - Ce, qe = fe(l2 ? ve(pe, Pt) : pe, T2, l2 ? X$1(_2, At) : _2);
        w2[d2] = qe, S2[d2] = qe - T2;
      }
      if (s2) {
        var Ve, kt = d2 === "x" ? E$1 : P$1, Lt = d2 === "x" ? R : W, F2 = w2[b2], he = b2 === "y" ? "height" : "width", Ne = F2 + g[kt], Ie = F2 - g[Lt], $e = [E$1, P$1].indexOf(x2) !== -1, _e = (Ve = D2 == null ? void 0 : D2[b2]) != null ? Ve : 0, ze = $e ? Ne : F2 - O2[he] - j[he] - _e + k.altAxis, Fe = $e ? F2 + O2[he] + j[he] - _e - k.altAxis : Ie, Ue = l2 && $e ? St(ze, F2, Fe) : fe(l2 ? ze : Ne, F2, l2 ? Fe : Ie);
        w2[b2] = Ue, S2[b2] = Ue - F2;
      }
      e.modifiersData[r] = S2;
    }
  }
  var xt = { name: "preventOverflow", enabled: true, phase: "main", fn: on, requiresIfExists: ["offset"] };
  function an(t) {
    return { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop };
  }
  function sn(t) {
    return t === H(t) || !B(t) ? We(t) : an(t);
  }
  function fn(t) {
    var e = t.getBoundingClientRect(), n = Z(e.width) / t.offsetWidth || 1, r = Z(e.height) / t.offsetHeight || 1;
    return n !== 1 || r !== 1;
  }
  function cn(t, e, n) {
    n === void 0 && (n = false);
    var r = B(e), o2 = B(e) && fn(e), i = I$1(e), a2 = ee(t, o2), s2 = { scrollLeft: 0, scrollTop: 0 }, f2 = { x: 0, y: 0 };
    return (r || !r && !n) && ((C(e) !== "body" || Se(i)) && (s2 = sn(e)), B(e) ? (f2 = ee(e, true), f2.x += e.clientLeft, f2.y += e.clientTop) : i && (f2.x = Be(i))), { x: a2.left + s2.scrollLeft - f2.x, y: a2.top + s2.scrollTop - f2.y, width: a2.width, height: a2.height };
  }
  function pn(t) {
    var e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = [];
    t.forEach(function(i) {
      e.set(i.name, i);
    });
    function o2(i) {
      n.add(i.name);
      var a2 = [].concat(i.requires || [], i.requiresIfExists || []);
      a2.forEach(function(s2) {
        if (!n.has(s2)) {
          var f2 = e.get(s2);
          f2 && o2(f2);
        }
      }), r.push(i);
    }
    return t.forEach(function(i) {
      n.has(i.name) || o2(i);
    }), r;
  }
  function un(t) {
    var e = pn(t);
    return ot.reduce(function(n, r) {
      return n.concat(e.filter(function(o2) {
        return o2.phase === r;
      }));
    }, []);
  }
  function ln(t) {
    var e;
    return function() {
      return e || (e = new Promise(function(n) {
        Promise.resolve().then(function() {
          e = void 0, n(t());
        });
      })), e;
    };
  }
  function dn(t) {
    var e = t.reduce(function(n, r) {
      var o2 = n[r.name];
      return n[r.name] = o2 ? Object.assign({}, o2, r, { options: Object.assign({}, o2.options, r.options), data: Object.assign({}, o2.data, r.data) }) : r, n;
    }, {});
    return Object.keys(e).map(function(n) {
      return e[n];
    });
  }
  var Ot = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function $t() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return !e.some(function(r) {
      return !(r && typeof r.getBoundingClientRect == "function");
    });
  }
  function we(t) {
    t === void 0 && (t = {});
    var e = t, n = e.defaultModifiers, r = n === void 0 ? [] : n, o2 = e.defaultOptions, i = o2 === void 0 ? Ot : o2;
    return function(a2, s2, f2) {
      f2 === void 0 && (f2 = i);
      var c2 = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, Ot, i), modifiersData: {}, elements: { reference: a2, popper: s2 }, attributes: {}, styles: {} }, u2 = [], m2 = false, v2 = { state: c2, setOptions: function(p2) {
        var g = typeof p2 == "function" ? p2(c2.options) : p2;
        h2(), c2.options = Object.assign({}, i, c2.options, g), c2.scrollParents = { reference: Q(a2) ? ce(a2) : a2.contextElement ? ce(a2.contextElement) : [], popper: ce(s2) };
        var x2 = un(dn([].concat(r, c2.options.modifiers)));
        return c2.orderedModifiers = x2.filter(function(y) {
          return y.enabled;
        }), l2(), v2.update();
      }, forceUpdate: function() {
        if (!m2) {
          var p2 = c2.elements, g = p2.reference, x2 = p2.popper;
          if ($t(g, x2)) {
            c2.rects = { reference: cn(g, se(x2), c2.options.strategy === "fixed"), popper: ke(x2) }, c2.reset = false, c2.placement = c2.options.placement, c2.orderedModifiers.forEach(function(j) {
              return c2.modifiersData[j.name] = Object.assign({}, j.data);
            });
            for (var y = 0; y < c2.orderedModifiers.length; y++) {
              if (c2.reset === true) {
                c2.reset = false, y = -1;
                continue;
              }
              var $ = c2.orderedModifiers[y], d2 = $.fn, b2 = $.options, w2 = b2 === void 0 ? {} : b2, O2 = $.name;
              typeof d2 == "function" && (c2 = d2({ state: c2, options: w2, name: O2, instance: v2 }) || c2);
            }
          }
        }
      }, update: ln(function() {
        return new Promise(function(p2) {
          v2.forceUpdate(), p2(c2);
        });
      }), destroy: function() {
        h2(), m2 = true;
      } };
      if (!$t(a2, s2))
        return v2;
      v2.setOptions(f2).then(function(p2) {
        !m2 && f2.onFirstUpdate && f2.onFirstUpdate(p2);
      });
      function l2() {
        c2.orderedModifiers.forEach(function(p2) {
          var g = p2.name, x2 = p2.options, y = x2 === void 0 ? {} : x2, $ = p2.effect;
          if (typeof $ == "function") {
            var d2 = $({ state: c2, name: g, instance: v2, options: y }), b2 = function() {
            };
            u2.push(d2 || b2);
          }
        });
      }
      function h2() {
        u2.forEach(function(p2) {
          return p2();
        }), u2 = [];
      }
      return v2;
    };
  }
  we();
  var mn = [Re, He, Me, Ae];
  we({ defaultModifiers: mn });
  var gn = [Re, He, Me, Ae, wt, vt, xt, pt, bt], yn = we({ defaultModifiers: gn });
  const usePopper = (referenceElementRef, popperElementRef, opts = {}) => {
    const stateUpdater = {
      name: "updateState",
      enabled: true,
      phase: "write",
      fn: ({ state }) => {
        const derivedState = deriveState(state);
        Object.assign(states.value, derivedState);
      },
      requires: ["computeStyles"]
    };
    const options = vue.computed(() => {
      const { onFirstUpdate, placement, strategy, modifiers } = vue.unref(opts);
      return {
        onFirstUpdate,
        placement: placement || "bottom",
        strategy: strategy || "absolute",
        modifiers: [
          ...modifiers || [],
          stateUpdater,
          { name: "applyStyles", enabled: false }
        ]
      };
    });
    const instanceRef = vue.shallowRef();
    const states = vue.ref({
      styles: {
        popper: {
          position: vue.unref(options).strategy,
          left: "0",
          top: "0"
        },
        arrow: {
          position: "absolute"
        }
      },
      attributes: {}
    });
    const destroy = () => {
      if (!instanceRef.value)
        return;
      instanceRef.value.destroy();
      instanceRef.value = void 0;
    };
    vue.watch(options, (newOptions) => {
      const instance = vue.unref(instanceRef);
      if (instance) {
        instance.setOptions(newOptions);
      }
    }, {
      deep: true
    });
    vue.watch([referenceElementRef, popperElementRef], ([referenceElement, popperElement]) => {
      destroy();
      if (!referenceElement || !popperElement)
        return;
      instanceRef.value = yn(referenceElement, popperElement, vue.unref(options));
    });
    vue.onBeforeUnmount(() => {
      destroy();
    });
    return {
      state: vue.computed(() => {
        var _a2;
        return { ...((_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.state) || {} };
      }),
      styles: vue.computed(() => vue.unref(states).styles),
      attributes: vue.computed(() => vue.unref(states).attributes),
      update: () => {
        var _a2;
        return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.update();
      },
      forceUpdate: () => {
        var _a2;
        return (_a2 = vue.unref(instanceRef)) == null ? void 0 : _a2.forceUpdate();
      },
      instanceRef: vue.computed(() => vue.unref(instanceRef))
    };
  };
  function deriveState(state) {
    const elements = Object.keys(state.elements);
    const styles = fromPairs(elements.map((element) => [element, state.styles[element] || {}]));
    const attributes = fromPairs(elements.map((element) => [element, state.attributes[element]]));
    return {
      styles,
      attributes
    };
  }
  function useTimeout() {
    let timeoutHandle;
    const registerTimeout = (fn2, delay) => {
      cancelTimeout();
      timeoutHandle = window.setTimeout(fn2, delay);
    };
    const cancelTimeout = () => window.clearTimeout(timeoutHandle);
    tryOnScopeDispose(() => cancelTimeout());
    return {
      registerTimeout,
      cancelTimeout
    };
  }
  const defaultIdInjection = {
    prefix: Math.floor(Math.random() * 1e4),
    current: 0
  };
  const ID_INJECTION_KEY = Symbol("elIdInjection");
  const useIdInjection = () => {
    return vue.getCurrentInstance() ? vue.inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
  };
  const useId = (deterministicId) => {
    const idInjection = useIdInjection();
    const namespace = useGetDerivedNamespace();
    const idRef = vue.computed(() => vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
    return idRef;
  };
  let registeredEscapeHandlers = [];
  const cachedHandler = (e) => {
    const event = e;
    if (event.key === EVENT_CODE.esc) {
      registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
    }
  };
  const useEscapeKeydown = (handler) => {
    vue.onMounted(() => {
      if (registeredEscapeHandlers.length === 0) {
        document.addEventListener("keydown", cachedHandler);
      }
      if (isClient)
        registeredEscapeHandlers.push(handler);
    });
    vue.onBeforeUnmount(() => {
      registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
      if (registeredEscapeHandlers.length === 0) {
        if (isClient)
          document.removeEventListener("keydown", cachedHandler);
      }
    });
  };
  let cachedContainer;
  const usePopperContainerId = () => {
    const namespace = useGetDerivedNamespace();
    const idInjection = useIdInjection();
    const id = vue.computed(() => {
      return `${namespace.value}-popper-container-${idInjection.prefix}`;
    });
    const selector = vue.computed(() => `#${id.value}`);
    return {
      id,
      selector
    };
  };
  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  };
  const usePopperContainer = () => {
    const { id, selector } = usePopperContainerId();
    vue.onBeforeMount(() => {
      if (!isClient)
        return;
      if (!cachedContainer && !document.body.querySelector(selector.value)) {
        cachedContainer = createContainer(id.value);
      }
    });
    return {
      id,
      selector
    };
  };
  const useDelayedToggleProps = buildProps({
    showAfter: {
      type: Number,
      default: 0
    },
    hideAfter: {
      type: Number,
      default: 200
    },
    autoClose: {
      type: Number,
      default: 0
    }
  });
  const useDelayedToggle = ({
    showAfter,
    hideAfter,
    autoClose,
    open,
    close
  }) => {
    const { registerTimeout } = useTimeout();
    const {
      registerTimeout: registerTimeoutForAutoClose,
      cancelTimeout: cancelTimeoutForAutoClose
    } = useTimeout();
    const onOpen = (event) => {
      registerTimeout(() => {
        open(event);
        const _autoClose = vue.unref(autoClose);
        if (isNumber(_autoClose) && _autoClose > 0) {
          registerTimeoutForAutoClose(() => {
            close(event);
          }, _autoClose);
        }
      }, vue.unref(showAfter));
    };
    const onClose = (event) => {
      cancelTimeoutForAutoClose();
      registerTimeout(() => {
        close(event);
      }, vue.unref(hideAfter));
    };
    return {
      onOpen,
      onClose
    };
  };
  const FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
  const useForwardRef = (forwardRef) => {
    const setForwardRef = (el) => {
      forwardRef.value = el;
    };
    vue.provide(FORWARD_REF_INJECTION_KEY, {
      setForwardRef
    });
  };
  const useForwardRefDirective = (setForwardRef) => {
    return {
      mounted(el) {
        setForwardRef(el);
      },
      updated(el) {
        setForwardRef(el);
      },
      unmounted() {
        setForwardRef(null);
      }
    };
  };
  const initial = {
    current: 0
  };
  const zIndex = vue.ref(0);
  const defaultInitialZIndex = 2e3;
  const ZINDEX_INJECTION_KEY = Symbol("elZIndexContextKey");
  const zIndexContextKey = Symbol("zIndexContextKey");
  const useZIndex = (zIndexOverrides) => {
    const increasingInjection = vue.getCurrentInstance() ? vue.inject(ZINDEX_INJECTION_KEY, initial) : initial;
    const zIndexInjection = zIndexOverrides || (vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0);
    const initialZIndex = vue.computed(() => {
      const zIndexFromInjection = vue.unref(zIndexInjection);
      return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
    });
    const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      increasingInjection.current++;
      zIndex.value = increasingInjection.current;
      return currentZIndex.value;
    };
    if (!isClient && !vue.inject(ZINDEX_INJECTION_KEY))
      ;
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
  };
  const useSizeProp = buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  const SIZE_INJECTION_KEY = Symbol("size");
  const useGlobalSize = () => {
    const injectedSize = vue.inject(SIZE_INJECTION_KEY, {});
    return vue.computed(() => {
      return vue.unref(injectedSize.size) || "";
    });
  };
  const useEmptyValuesProps = buildProps({
    emptyValues: Array,
    valueOnClear: {
      type: [String, Number, Boolean, Function],
      default: void 0,
      validator: (val) => isFunction$1(val) ? !val() : !val
    }
  });
  const ariaProps = buildProps({
    ariaLabel: String,
    ariaOrientation: {
      type: String,
      values: ["horizontal", "vertical", "undefined"]
    },
    ariaControls: String
  });
  const useAriaProps = (arias) => {
    return pick$1(ariaProps, arias);
  };
  const configProviderContextKey = Symbol();
  const globalConfig = vue.ref();
  function useGlobalConfig(key, defaultValue = void 0) {
    const config = vue.getCurrentInstance() ? vue.inject(configProviderContextKey, globalConfig) : globalConfig;
    if (key) {
      return vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = config.value) == null ? void 0 : _a2[key]) != null ? _b : defaultValue;
      });
    } else {
      return config;
    }
  }
  function useGlobalComponentSettings(block, sizeFallback) {
    const config = useGlobalConfig();
    const ns = useNamespace(block, vue.computed(() => {
      var _a2;
      return ((_a2 = config.value) == null ? void 0 : _a2.namespace) || defaultNamespace;
    }));
    const locale = useLocale(vue.computed(() => {
      var _a2;
      return (_a2 = config.value) == null ? void 0 : _a2.locale;
    }));
    const zIndex2 = useZIndex(vue.computed(() => {
      var _a2;
      return ((_a2 = config.value) == null ? void 0 : _a2.zIndex) || defaultInitialZIndex;
    }));
    const size = vue.computed(() => {
      var _a2;
      return vue.unref(sizeFallback) || ((_a2 = config.value) == null ? void 0 : _a2.size) || "";
    });
    provideGlobalConfig(vue.computed(() => vue.unref(config) || {}));
    return {
      ns,
      locale,
      zIndex: zIndex2,
      size
    };
  }
  const provideGlobalConfig = (config, app, global2 = false) => {
    var _a2;
    const inSetup = !!vue.getCurrentInstance();
    const oldConfig = inSetup ? useGlobalConfig() : void 0;
    const provideFn = (_a2 = app == null ? void 0 : app.provide) != null ? _a2 : inSetup ? vue.provide : void 0;
    if (!provideFn) {
      return;
    }
    const context = vue.computed(() => {
      const cfg = vue.unref(config);
      if (!(oldConfig == null ? void 0 : oldConfig.value))
        return cfg;
      return mergeConfig(oldConfig.value, cfg);
    });
    provideFn(configProviderContextKey, context);
    provideFn(localeContextKey, vue.computed(() => context.value.locale));
    provideFn(namespaceContextKey, vue.computed(() => context.value.namespace));
    provideFn(zIndexContextKey, vue.computed(() => context.value.zIndex));
    provideFn(SIZE_INJECTION_KEY, {
      size: vue.computed(() => context.value.size || "")
    });
    if (global2 || !globalConfig.value) {
      globalConfig.value = context.value;
    }
    return context;
  };
  const mergeConfig = (a2, b2) => {
    const keys2 = [.../* @__PURE__ */ new Set([...keysOf(a2), ...keysOf(b2)])];
    const obj = {};
    for (const key of keys2) {
      obj[key] = b2[key] !== void 0 ? b2[key] : a2[key];
    }
    return obj;
  };
  const configProviderProps = buildProps({
    a11y: {
      type: Boolean,
      default: true
    },
    locale: {
      type: definePropType(Object)
    },
    size: useSizeProp,
    button: {
      type: definePropType(Object)
    },
    experimentalFeatures: {
      type: definePropType(Object)
    },
    keyboardNavigation: {
      type: Boolean,
      default: true
    },
    message: {
      type: definePropType(Object)
    },
    zIndex: Number,
    namespace: {
      type: String,
      default: "el"
    },
    ...useEmptyValuesProps
  });
  const messageConfig = {};
  vue.defineComponent({
    name: "ElConfigProvider",
    props: configProviderProps,
    setup(props, { slots }) {
      vue.watch(() => props.message, (val) => {
        Object.assign(messageConfig, val != null ? val : {});
      }, { immediate: true, deep: true });
      const config = provideGlobalConfig(props);
      return () => vue.renderSlot(slots, "default", { config: config == null ? void 0 : config.value });
    }
  });
  var _export_sfc$1 = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const iconProps = buildProps({
    size: {
      type: definePropType([Number, String])
    },
    color: {
      type: String
    }
  });
  const __default__$g = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    ...__default__$g,
    props: iconProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("icon");
      const style2 = vue.computed(() => {
        const { size, color } = props;
        if (!size && !color)
          return {};
        return {
          fontSize: isUndefined(size) ? void 0 : addUnit(size),
          "--color": color
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("i", vue.mergeProps({
          class: vue.unref(ns).b(),
          style: vue.unref(style2)
        }, _ctx.$attrs), [
          vue.renderSlot(_ctx.$slots, "default")
        ], 16);
      };
    }
  });
  var Icon = /* @__PURE__ */ _export_sfc$1(_sfc_main$o, [["__file", "icon.vue"]]);
  const ElIcon = withInstall(Icon);
  const formContextKey = Symbol("formContextKey");
  const formItemContextKey = Symbol("formItemContextKey");
  const useFormSize = (fallback, ignore = {}) => {
    const emptyRef = vue.ref(void 0);
    const size = ignore.prop ? emptyRef : useProp("size");
    const globalConfig2 = ignore.global ? emptyRef : useGlobalSize();
    const form = ignore.form ? { size: void 0 } : vue.inject(formContextKey, void 0);
    const formItem = ignore.formItem ? { size: void 0 } : vue.inject(formItemContextKey, void 0);
    return vue.computed(() => size.value || vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig2.value || "");
  };
  const useFormDisabled = (fallback) => {
    const disabled = useProp("disabled");
    const form = vue.inject(formContextKey, void 0);
    return vue.computed(() => disabled.value || vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
  };
  const useFormItem = () => {
    const form = vue.inject(formContextKey, void 0);
    const formItem = vue.inject(formItemContextKey, void 0);
    return {
      form,
      formItem
    };
  };
  const useFormItemInputId = (props, {
    formItemContext,
    disableIdGeneration,
    disableIdManagement
  }) => {
    if (!disableIdGeneration) {
      disableIdGeneration = vue.ref(false);
    }
    if (!disableIdManagement) {
      disableIdManagement = vue.ref(false);
    }
    const inputId = vue.ref();
    let idUnwatch = void 0;
    const isLabeledByFormItem = vue.computed(() => {
      var _a2;
      return !!(!(props.label || props.ariaLabel) && formItemContext && formItemContext.inputIds && ((_a2 = formItemContext.inputIds) == null ? void 0 : _a2.length) <= 1);
    });
    vue.onMounted(() => {
      idUnwatch = vue.watch([vue.toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration2]) => {
        const newId = id != null ? id : !disableIdGeneration2 ? useId().value : void 0;
        if (newId !== inputId.value) {
          if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
            if (!(disableIdManagement == null ? void 0 : disableIdManagement.value) && !disableIdGeneration2 && newId) {
              formItemContext.addInputId(newId);
            }
          }
          inputId.value = newId;
        }
      }, { immediate: true });
    });
    vue.onUnmounted(() => {
      idUnwatch && idUnwatch();
      if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
        inputId.value && formItemContext.removeInputId(inputId.value);
      }
    });
    return {
      isLabeledByFormItem,
      inputId
    };
  };
  const GAP = 4;
  const BAR_MAP = {
    vertical: {
      offset: "offsetHeight",
      scroll: "scrollTop",
      scrollSize: "scrollHeight",
      size: "height",
      key: "vertical",
      axis: "Y",
      client: "clientY",
      direction: "top"
    },
    horizontal: {
      offset: "offsetWidth",
      scroll: "scrollLeft",
      scrollSize: "scrollWidth",
      size: "width",
      key: "horizontal",
      axis: "X",
      client: "clientX",
      direction: "left"
    }
  };
  const renderThumbStyle = ({
    move,
    size,
    bar
  }) => ({
    [bar.size]: size,
    transform: `translate${bar.axis}(${move}%)`
  });
  const scrollbarContextKey = Symbol("scrollbarContextKey");
  const thumbProps = buildProps({
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: {
      type: Number,
      required: true
    },
    always: Boolean
  });
  const COMPONENT_NAME$1 = "Thumb";
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    __name: "thumb",
    props: thumbProps,
    setup(__props) {
      const props = __props;
      const scrollbar = vue.inject(scrollbarContextKey);
      const ns = useNamespace("scrollbar");
      if (!scrollbar)
        throwError(COMPONENT_NAME$1, "can not inject scrollbar context");
      const instance = vue.ref();
      const thumb = vue.ref();
      const thumbState = vue.ref({});
      const visible = vue.ref(false);
      let cursorDown = false;
      let cursorLeave = false;
      let originalOnSelectStart = isClient ? document.onselectstart : null;
      const bar = vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
      const thumbStyle = vue.computed(() => renderThumbStyle({
        size: props.size,
        move: props.move,
        bar: bar.value
      }));
      const offsetRatio = vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
      const clickThumbHandler = (e) => {
        var _a2;
        e.stopPropagation();
        if (e.ctrlKey || [1, 2].includes(e.button))
          return;
        (_a2 = window.getSelection()) == null ? void 0 : _a2.removeAllRanges();
        startDrag(e);
        const el = e.currentTarget;
        if (!el)
          return;
        thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
      };
      const clickTrackHandler = (e) => {
        if (!thumb.value || !instance.value || !scrollbar.wrapElement)
          return;
        const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
        const thumbHalf = thumb.value[bar.value.offset] / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const startDrag = (e) => {
        e.stopImmediatePropagation();
        cursorDown = true;
        document.addEventListener("mousemove", mouseMoveDocumentHandler);
        document.addEventListener("mouseup", mouseUpDocumentHandler);
        originalOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;
      };
      const mouseMoveDocumentHandler = (e) => {
        if (!instance.value || !thumb.value)
          return;
        if (cursorDown === false)
          return;
        const prevPage = thumbState.value[bar.value.axis];
        if (!prevPage)
          return;
        const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
        const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
        const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const mouseUpDocumentHandler = () => {
        cursorDown = false;
        thumbState.value[bar.value.axis] = 0;
        document.removeEventListener("mousemove", mouseMoveDocumentHandler);
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
        restoreOnselectstart();
        if (cursorLeave)
          visible.value = false;
      };
      const mouseMoveScrollbarHandler = () => {
        cursorLeave = false;
        visible.value = !!props.size;
      };
      const mouseLeaveScrollbarHandler = () => {
        cursorLeave = true;
        visible.value = cursorDown;
      };
      vue.onBeforeUnmount(() => {
        restoreOnselectstart();
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
      });
      const restoreOnselectstart = () => {
        if (document.onselectstart !== originalOnSelectStart)
          document.onselectstart = originalOnSelectStart;
      };
      useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
      useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              ref_key: "instance",
              ref: instance,
              class: vue.normalizeClass([vue.unref(ns).e("bar"), vue.unref(ns).is(vue.unref(bar).key)]),
              onMousedown: clickTrackHandler
            }, [
              vue.createElementVNode("div", {
                ref_key: "thumb",
                ref: thumb,
                class: vue.normalizeClass(vue.unref(ns).e("thumb")),
                style: vue.normalizeStyle(vue.unref(thumbStyle)),
                onMousedown: clickThumbHandler
              }, null, 38)
            ], 34), [
              [vue.vShow, _ctx.always || visible.value]
            ])
          ]),
          _: 1
        }, 8, ["name"]);
      };
    }
  });
  var Thumb = /* @__PURE__ */ _export_sfc$1(_sfc_main$n, [["__file", "thumb.vue"]]);
  const barProps = buildProps({
    always: {
      type: Boolean,
      default: true
    },
    minSize: {
      type: Number,
      required: true
    }
  });
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "bar",
    props: barProps,
    setup(__props, { expose }) {
      const props = __props;
      const scrollbar = vue.inject(scrollbarContextKey);
      const moveX = vue.ref(0);
      const moveY = vue.ref(0);
      const sizeWidth = vue.ref("");
      const sizeHeight = vue.ref("");
      const ratioY = vue.ref(1);
      const ratioX = vue.ref(1);
      const handleScroll = (wrap) => {
        if (wrap) {
          const offsetHeight = wrap.offsetHeight - GAP;
          const offsetWidth = wrap.offsetWidth - GAP;
          moveY.value = wrap.scrollTop * 100 / offsetHeight * ratioY.value;
          moveX.value = wrap.scrollLeft * 100 / offsetWidth * ratioX.value;
        }
      };
      const update = () => {
        const wrap = scrollbar == null ? void 0 : scrollbar.wrapElement;
        if (!wrap)
          return;
        const offsetHeight = wrap.offsetHeight - GAP;
        const offsetWidth = wrap.offsetWidth - GAP;
        const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
        const height = Math.max(originalHeight, props.minSize);
        const width = Math.max(originalWidth, props.minSize);
        ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
        ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
        sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
        sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
      };
      expose({
        handleScroll,
        update
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(Thumb, {
            move: moveX.value,
            ratio: ratioX.value,
            size: sizeWidth.value,
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"]),
          vue.createVNode(Thumb, {
            move: moveY.value,
            ratio: ratioY.value,
            size: sizeHeight.value,
            vertical: "",
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"])
        ], 64);
      };
    }
  });
  var Bar = /* @__PURE__ */ _export_sfc$1(_sfc_main$m, [["__file", "bar.vue"]]);
  const scrollbarProps = buildProps({
    height: {
      type: [String, Number],
      default: ""
    },
    maxHeight: {
      type: [String, Number],
      default: ""
    },
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: definePropType([String, Object, Array]),
      default: ""
    },
    wrapClass: {
      type: [String, Array],
      default: ""
    },
    viewClass: {
      type: [String, Array],
      default: ""
    },
    viewStyle: {
      type: [String, Array, Object],
      default: ""
    },
    noresize: Boolean,
    tag: {
      type: String,
      default: "div"
    },
    always: Boolean,
    minSize: {
      type: Number,
      default: 20
    },
    id: String,
    role: String,
    ...useAriaProps(["ariaLabel", "ariaOrientation"])
  });
  const scrollbarEmits = {
    scroll: ({
      scrollTop,
      scrollLeft
    }) => [scrollTop, scrollLeft].every(isNumber)
  };
  const COMPONENT_NAME = "ElScrollbar";
  const __default__$f = vue.defineComponent({
    name: COMPONENT_NAME
  });
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    ...__default__$f,
    props: scrollbarProps,
    emits: scrollbarEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("scrollbar");
      let stopResizeObserver = void 0;
      let stopResizeListener = void 0;
      const scrollbarRef = vue.ref();
      const wrapRef = vue.ref();
      const resizeRef = vue.ref();
      const barRef = vue.ref();
      const wrapStyle = vue.computed(() => {
        const style2 = {};
        if (props.height)
          style2.height = addUnit(props.height);
        if (props.maxHeight)
          style2.maxHeight = addUnit(props.maxHeight);
        return [props.wrapStyle, style2];
      });
      const wrapKls = vue.computed(() => {
        return [
          props.wrapClass,
          ns.e("wrap"),
          { [ns.em("wrap", "hidden-default")]: !props.native }
        ];
      });
      const resizeKls = vue.computed(() => {
        return [ns.e("view"), props.viewClass];
      });
      const handleScroll = () => {
        var _a2;
        if (wrapRef.value) {
          (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
          emit("scroll", {
            scrollTop: wrapRef.value.scrollTop,
            scrollLeft: wrapRef.value.scrollLeft
          });
        }
      };
      function scrollTo(arg1, arg2) {
        if (isObject$1(arg1)) {
          wrapRef.value.scrollTo(arg1);
        } else if (isNumber(arg1) && isNumber(arg2)) {
          wrapRef.value.scrollTo(arg1, arg2);
        }
      }
      const setScrollTop = (value) => {
        if (!isNumber(value)) {
          return;
        }
        wrapRef.value.scrollTop = value;
      };
      const setScrollLeft = (value) => {
        if (!isNumber(value)) {
          return;
        }
        wrapRef.value.scrollLeft = value;
      };
      const update = () => {
        var _a2;
        (_a2 = barRef.value) == null ? void 0 : _a2.update();
      };
      vue.watch(() => props.noresize, (noresize) => {
        if (noresize) {
          stopResizeObserver == null ? void 0 : stopResizeObserver();
          stopResizeListener == null ? void 0 : stopResizeListener();
        } else {
          ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
          stopResizeListener = useEventListener("resize", update);
        }
      }, { immediate: true });
      vue.watch(() => [props.maxHeight, props.height], () => {
        if (!props.native)
          vue.nextTick(() => {
            var _a2;
            update();
            if (wrapRef.value) {
              (_a2 = barRef.value) == null ? void 0 : _a2.handleScroll(wrapRef.value);
            }
          });
      });
      vue.provide(scrollbarContextKey, vue.reactive({
        scrollbarElement: scrollbarRef,
        wrapElement: wrapRef
      }));
      vue.onMounted(() => {
        if (!props.native)
          vue.nextTick(() => {
            update();
          });
      });
      vue.onUpdated(() => update());
      expose({
        wrapRef,
        update,
        scrollTo,
        setScrollTop,
        setScrollLeft,
        handleScroll
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "scrollbarRef",
          ref: scrollbarRef,
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.createElementVNode("div", {
            ref_key: "wrapRef",
            ref: wrapRef,
            class: vue.normalizeClass(vue.unref(wrapKls)),
            style: vue.normalizeStyle(vue.unref(wrapStyle)),
            onScroll: handleScroll
          }, [
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
              id: _ctx.id,
              ref_key: "resizeRef",
              ref: resizeRef,
              class: vue.normalizeClass(vue.unref(resizeKls)),
              style: vue.normalizeStyle(_ctx.viewStyle),
              role: _ctx.role,
              "aria-label": _ctx.ariaLabel,
              "aria-orientation": _ctx.ariaOrientation
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "class", "style", "role", "aria-label", "aria-orientation"]))
          ], 38),
          !_ctx.native ? (vue.openBlock(), vue.createBlock(Bar, {
            key: 0,
            ref_key: "barRef",
            ref: barRef,
            always: _ctx.always,
            "min-size": _ctx.minSize
          }, null, 8, ["always", "min-size"])) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var Scrollbar = /* @__PURE__ */ _export_sfc$1(_sfc_main$l, [["__file", "scrollbar.vue"]]);
  const ElScrollbar = withInstall(Scrollbar);
  const POPPER_INJECTION_KEY = Symbol("popper");
  const POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");
  const roleTypes = [
    "dialog",
    "grid",
    "group",
    "listbox",
    "menu",
    "navigation",
    "tooltip",
    "tree"
  ];
  const popperProps = buildProps({
    role: {
      type: String,
      values: roleTypes,
      default: "tooltip"
    }
  });
  const __default__$e = vue.defineComponent({
    name: "ElPopper",
    inheritAttrs: false
  });
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    ...__default__$e,
    props: popperProps,
    setup(__props, { expose }) {
      const props = __props;
      const triggerRef = vue.ref();
      const popperInstanceRef = vue.ref();
      const contentRef = vue.ref();
      const referenceRef = vue.ref();
      const role = vue.computed(() => props.role);
      const popperProvides = {
        triggerRef,
        popperInstanceRef,
        contentRef,
        referenceRef,
        role
      };
      expose(popperProvides);
      vue.provide(POPPER_INJECTION_KEY, popperProvides);
      return (_ctx, _cache) => {
        return vue.renderSlot(_ctx.$slots, "default");
      };
    }
  });
  var Popper = /* @__PURE__ */ _export_sfc$1(_sfc_main$k, [["__file", "popper.vue"]]);
  const popperArrowProps = buildProps({
    arrowOffset: {
      type: Number,
      default: 5
    }
  });
  const __default__$d = vue.defineComponent({
    name: "ElPopperArrow",
    inheritAttrs: false
  });
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    ...__default__$d,
    props: popperArrowProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("popper");
      const { arrowOffset, arrowRef, arrowStyle } = vue.inject(POPPER_CONTENT_INJECTION_KEY, void 0);
      vue.watch(() => props.arrowOffset, (val) => {
        arrowOffset.value = val;
      });
      vue.onBeforeUnmount(() => {
        arrowRef.value = void 0;
      });
      expose({
        arrowRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          ref_key: "arrowRef",
          ref: arrowRef,
          class: vue.normalizeClass(vue.unref(ns).e("arrow")),
          style: vue.normalizeStyle(vue.unref(arrowStyle)),
          "data-popper-arrow": ""
        }, null, 6);
      };
    }
  });
  var ElPopperArrow = /* @__PURE__ */ _export_sfc$1(_sfc_main$j, [["__file", "arrow.vue"]]);
  const NAME = "ElOnlyChild";
  const OnlyChild = vue.defineComponent({
    name: NAME,
    setup(_2, {
      slots,
      attrs
    }) {
      var _a2;
      const forwardRefInjection = vue.inject(FORWARD_REF_INJECTION_KEY);
      const forwardRefDirective = useForwardRefDirective((_a2 = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a2 : NOOP);
      return () => {
        var _a22;
        const defaultSlot = (_a22 = slots.default) == null ? void 0 : _a22.call(slots, attrs);
        if (!defaultSlot)
          return null;
        if (defaultSlot.length > 1) {
          return null;
        }
        const firstLegitNode = findFirstLegitChild(defaultSlot);
        if (!firstLegitNode) {
          return null;
        }
        return vue.withDirectives(vue.cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
      };
    }
  });
  function findFirstLegitChild(node) {
    if (!node)
      return null;
    const children = node;
    for (const child of children) {
      if (isObject$1(child)) {
        switch (child.type) {
          case vue.Comment:
            continue;
          case vue.Text:
          case "svg":
            return wrapTextContent(child);
          case vue.Fragment:
            return findFirstLegitChild(child.children);
          default:
            return child;
        }
      }
      return wrapTextContent(child);
    }
    return null;
  }
  function wrapTextContent(s2) {
    const ns = useNamespace("only-child");
    return vue.createVNode("span", {
      "class": ns.e("content")
    }, [s2]);
  }
  const popperTriggerProps = buildProps({
    virtualRef: {
      type: definePropType(Object)
    },
    virtualTriggering: Boolean,
    onMouseenter: {
      type: definePropType(Function)
    },
    onMouseleave: {
      type: definePropType(Function)
    },
    onClick: {
      type: definePropType(Function)
    },
    onKeydown: {
      type: definePropType(Function)
    },
    onFocus: {
      type: definePropType(Function)
    },
    onBlur: {
      type: definePropType(Function)
    },
    onContextmenu: {
      type: definePropType(Function)
    },
    id: String,
    open: Boolean
  });
  const __default__$c = vue.defineComponent({
    name: "ElPopperTrigger",
    inheritAttrs: false
  });
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    ...__default__$c,
    props: popperTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const { role, triggerRef } = vue.inject(POPPER_INJECTION_KEY, void 0);
      useForwardRef(triggerRef);
      const ariaControls = vue.computed(() => {
        return ariaHaspopup.value ? props.id : void 0;
      });
      const ariaDescribedby = vue.computed(() => {
        if (role && role.value === "tooltip") {
          return props.open && props.id ? props.id : void 0;
        }
        return void 0;
      });
      const ariaHaspopup = vue.computed(() => {
        if (role && role.value !== "tooltip") {
          return role.value;
        }
        return void 0;
      });
      const ariaExpanded = vue.computed(() => {
        return ariaHaspopup.value ? `${props.open}` : void 0;
      });
      let virtualTriggerAriaStopWatch = void 0;
      vue.onMounted(() => {
        vue.watch(() => props.virtualRef, (virtualEl) => {
          if (virtualEl) {
            triggerRef.value = unrefElement(virtualEl);
          }
        }, {
          immediate: true
        });
        vue.watch(triggerRef, (el, prevEl) => {
          virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
          virtualTriggerAriaStopWatch = void 0;
          if (isElement(el)) {
            [
              "onMouseenter",
              "onMouseleave",
              "onClick",
              "onKeydown",
              "onFocus",
              "onBlur",
              "onContextmenu"
            ].forEach((eventName) => {
              var _a2;
              const handler = props[eventName];
              if (handler) {
                el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                (_a2 = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a2.call(prevEl, eventName.slice(2).toLowerCase(), handler);
              }
            });
            virtualTriggerAriaStopWatch = vue.watch([ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded], (watches) => {
              [
                "aria-controls",
                "aria-describedby",
                "aria-haspopup",
                "aria-expanded"
              ].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (isElement(prevEl)) {
            [
              "aria-controls",
              "aria-describedby",
              "aria-haspopup",
              "aria-expanded"
            ].forEach((key) => prevEl.removeAttribute(key));
          }
        }, {
          immediate: true
        });
      });
      vue.onBeforeUnmount(() => {
        virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
        virtualTriggerAriaStopWatch = void 0;
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return !_ctx.virtualTriggering ? (vue.openBlock(), vue.createBlock(vue.unref(OnlyChild), vue.mergeProps({ key: 0 }, _ctx.$attrs, {
          "aria-controls": vue.unref(ariaControls),
          "aria-describedby": vue.unref(ariaDescribedby),
          "aria-expanded": vue.unref(ariaExpanded),
          "aria-haspopup": vue.unref(ariaHaspopup)
        }), {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 16, ["aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup"])) : vue.createCommentVNode("v-if", true);
      };
    }
  });
  var ElPopperTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$i, [["__file", "trigger.vue"]]);
  const FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
  const FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
  const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
  const FOCUS_AFTER_TRAPPED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const FOCUSOUT_PREVENTED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
  const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
  const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
  const focusReason = vue.ref();
  const lastUserFocusTimestamp = vue.ref(0);
  const lastAutomatedFocusTimestamp = vue.ref(0);
  let focusReasonUserCount = 0;
  const obtainAllFocusableElements = (element) => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput)
          return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  };
  const getVisibleElement = (elements, container) => {
    for (const element of elements) {
      if (!isHidden(element, container))
        return element;
    }
  };
  const isHidden = (element, container) => {
    if (getComputedStyle(element).visibility === "hidden")
      return true;
    while (element) {
      if (container && element === container)
        return false;
      if (getComputedStyle(element).display === "none")
        return true;
      element = element.parentElement;
    }
    return false;
  };
  const getEdges = (container) => {
    const focusable = obtainAllFocusableElements(container);
    const first = getVisibleElement(focusable, container);
    const last = getVisibleElement(focusable.reverse(), container);
    return [first, last];
  };
  const isSelectable = (element) => {
    return element instanceof HTMLInputElement && "select" in element;
  };
  const tryFocus = (element, shouldSelect) => {
    if (element && element.focus) {
      const prevFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      lastAutomatedFocusTimestamp.value = window.performance.now();
      if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
        element.select();
      }
    }
  };
  function removeFromStack(list, item) {
    const copy = [...list];
    const idx = list.indexOf(item);
    if (idx !== -1) {
      copy.splice(idx, 1);
    }
    return copy;
  }
  const createFocusableStack = () => {
    let stack = [];
    const push = (layer) => {
      const currentLayer = stack[0];
      if (currentLayer && layer !== currentLayer) {
        currentLayer.pause();
      }
      stack = removeFromStack(stack, layer);
      stack.unshift(layer);
    };
    const remove = (layer) => {
      var _a2, _b;
      stack = removeFromStack(stack, layer);
      (_b = (_a2 = stack[0]) == null ? void 0 : _a2.resume) == null ? void 0 : _b.call(_a2);
    };
    return {
      push,
      remove
    };
  };
  const focusFirstDescendant = (elements, shouldSelect = false) => {
    const prevFocusedElement = document.activeElement;
    for (const element of elements) {
      tryFocus(element, shouldSelect);
      if (document.activeElement !== prevFocusedElement)
        return;
    }
  };
  const focusableStack = createFocusableStack();
  const isFocusCausedByUserEvent = () => {
    return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
  };
  const notifyFocusReasonPointer = () => {
    focusReason.value = "pointer";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const notifyFocusReasonKeydown = () => {
    focusReason.value = "keyboard";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const useFocusReason = () => {
    vue.onMounted(() => {
      if (focusReasonUserCount === 0) {
        document.addEventListener("mousedown", notifyFocusReasonPointer);
        document.addEventListener("touchstart", notifyFocusReasonPointer);
        document.addEventListener("keydown", notifyFocusReasonKeydown);
      }
      focusReasonUserCount++;
    });
    vue.onBeforeUnmount(() => {
      focusReasonUserCount--;
      if (focusReasonUserCount <= 0) {
        document.removeEventListener("mousedown", notifyFocusReasonPointer);
        document.removeEventListener("touchstart", notifyFocusReasonPointer);
        document.removeEventListener("keydown", notifyFocusReasonKeydown);
      }
    });
    return {
      focusReason,
      lastUserFocusTimestamp,
      lastAutomatedFocusTimestamp
    };
  };
  const createFocusOutPreventedEvent = (detail) => {
    return new CustomEvent(FOCUSOUT_PREVENTED, {
      ...FOCUSOUT_PREVENTED_OPTS,
      detail
    });
  };
  const _sfc_main$h = vue.defineComponent({
    name: "ElFocusTrap",
    inheritAttrs: false,
    props: {
      loop: Boolean,
      trapped: Boolean,
      focusTrapEl: Object,
      focusStartEl: {
        type: [Object, String],
        default: "first"
      }
    },
    emits: [
      ON_TRAP_FOCUS_EVT,
      ON_RELEASE_FOCUS_EVT,
      "focusin",
      "focusout",
      "focusout-prevented",
      "release-requested"
    ],
    setup(props, { emit }) {
      const forwardRef = vue.ref();
      let lastFocusBeforeTrapped;
      let lastFocusAfterTrapped;
      const { focusReason: focusReason2 } = useFocusReason();
      useEscapeKeydown((event) => {
        if (props.trapped && !focusLayer.paused) {
          emit("release-requested", event);
        }
      });
      const focusLayer = {
        paused: false,
        pause() {
          this.paused = true;
        },
        resume() {
          this.paused = false;
        }
      };
      const onKeydown = (e) => {
        if (!props.loop && !props.trapped)
          return;
        if (focusLayer.paused)
          return;
        const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
        const { loop } = props;
        const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
        const currentFocusingEl = document.activeElement;
        if (isTabbing && currentFocusingEl) {
          const container = currentTarget;
          const [first, last] = getEdges(container);
          const isTabbable = first && last;
          if (!isTabbable) {
            if (currentFocusingEl === container) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
              }
            }
          } else {
            if (!shiftKey && currentFocusingEl === last) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(first, true);
              }
            } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason2.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(last, true);
              }
            }
          }
        }
      };
      vue.provide(FOCUS_TRAP_INJECTION_KEY, {
        focusTrapRef: forwardRef,
        onKeydown
      });
      vue.watch(() => props.focusTrapEl, (focusTrapEl) => {
        if (focusTrapEl) {
          forwardRef.value = focusTrapEl;
        }
      }, { immediate: true });
      vue.watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
        if (forwardRef2) {
          forwardRef2.addEventListener("keydown", onKeydown);
          forwardRef2.addEventListener("focusin", onFocusIn);
          forwardRef2.addEventListener("focusout", onFocusOut);
        }
        if (oldForwardRef) {
          oldForwardRef.removeEventListener("keydown", onKeydown);
          oldForwardRef.removeEventListener("focusin", onFocusIn);
          oldForwardRef.removeEventListener("focusout", onFocusOut);
        }
      });
      const trapOnFocus = (e) => {
        emit(ON_TRAP_FOCUS_EVT, e);
      };
      const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
      const onFocusIn = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (!trapContainer)
          return;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!props.trapped) {
          const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
          if (!isPrevFocusedInTrap) {
            lastFocusBeforeTrapped = relatedTarget;
          }
        }
        if (isFocusedInTrap)
          emit("focusin", e);
        if (focusLayer.paused)
          return;
        if (props.trapped) {
          if (isFocusedInTrap) {
            lastFocusAfterTrapped = target;
          } else {
            tryFocus(lastFocusAfterTrapped, true);
          }
        }
      };
      const onFocusOut = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (focusLayer.paused || !trapContainer)
          return;
        if (props.trapped) {
          const relatedTarget = e.relatedTarget;
          if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
            setTimeout(() => {
              if (!focusLayer.paused && props.trapped) {
                const focusoutPreventedEvent = createFocusOutPreventedEvent({
                  focusReason: focusReason2.value
                });
                emit("focusout-prevented", focusoutPreventedEvent);
                if (!focusoutPreventedEvent.defaultPrevented) {
                  tryFocus(lastFocusAfterTrapped, true);
                }
              }
            }, 0);
          }
        } else {
          const target = e.target;
          const isFocusedInTrap = target && trapContainer.contains(target);
          if (!isFocusedInTrap)
            emit("focusout", e);
        }
      };
      async function startTrap() {
        await vue.nextTick();
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          focusableStack.push(focusLayer);
          const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
          lastFocusBeforeTrapped = prevFocusedElement;
          const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
          if (!isPrevFocusContained) {
            const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
            trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
            trapContainer.dispatchEvent(focusEvent);
            if (!focusEvent.defaultPrevented) {
              vue.nextTick(() => {
                let focusStartEl = props.focusStartEl;
                if (!isString(focusStartEl)) {
                  tryFocus(focusStartEl);
                  if (document.activeElement !== focusStartEl) {
                    focusStartEl = "first";
                  }
                }
                if (focusStartEl === "first") {
                  focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                }
                if (document.activeElement === prevFocusedElement || focusStartEl === "container") {
                  tryFocus(trapContainer);
                }
              });
            }
          }
        }
      }
      function stopTrap() {
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
          const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
            ...FOCUS_AFTER_TRAPPED_OPTS,
            detail: {
              focusReason: focusReason2.value
            }
          });
          trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          trapContainer.dispatchEvent(releasedEvent);
          if (!releasedEvent.defaultPrevented && (focusReason2.value == "keyboard" || !isFocusCausedByUserEvent() || trapContainer.contains(document.activeElement))) {
            tryFocus(lastFocusBeforeTrapped != null ? lastFocusBeforeTrapped : document.body);
          }
          trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          focusableStack.remove(focusLayer);
        }
      }
      vue.onMounted(() => {
        if (props.trapped) {
          startTrap();
        }
        vue.watch(() => props.trapped, (trapped) => {
          if (trapped) {
            startTrap();
          } else {
            stopTrap();
          }
        });
      });
      vue.onBeforeUnmount(() => {
        if (props.trapped) {
          stopTrap();
        }
      });
      return {
        onKeydown
      };
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
  }
  var ElFocusTrap = /* @__PURE__ */ _export_sfc$1(_sfc_main$h, [["render", _sfc_render$4], ["__file", "focus-trap.vue"]]);
  const POSITIONING_STRATEGIES = ["fixed", "absolute"];
  const popperCoreConfigProps = buildProps({
    boundariesPadding: {
      type: Number,
      default: 0
    },
    fallbackPlacements: {
      type: definePropType(Array),
      default: void 0
    },
    gpuAcceleration: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 12
    },
    placement: {
      type: String,
      values: Ee,
      default: "bottom"
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    strategy: {
      type: String,
      values: POSITIONING_STRATEGIES,
      default: "absolute"
    }
  });
  const popperContentProps = buildProps({
    ...popperCoreConfigProps,
    id: String,
    style: {
      type: definePropType([String, Array, Object])
    },
    className: {
      type: definePropType([String, Array, Object])
    },
    effect: {
      type: String,
      default: "dark"
    },
    visible: Boolean,
    enterable: {
      type: Boolean,
      default: true
    },
    pure: Boolean,
    focusOnShow: {
      type: Boolean,
      default: false
    },
    trapping: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: definePropType([String, Array, Object])
    },
    popperStyle: {
      type: definePropType([String, Array, Object])
    },
    referenceEl: {
      type: definePropType(Object)
    },
    triggerTargetEl: {
      type: definePropType(Object)
    },
    stopPopperMouseEvent: {
      type: Boolean,
      default: true
    },
    virtualTriggering: Boolean,
    zIndex: Number,
    ...useAriaProps(["ariaLabel"])
  });
  const popperContentEmits = {
    mouseenter: (evt) => evt instanceof MouseEvent,
    mouseleave: (evt) => evt instanceof MouseEvent,
    focus: () => true,
    blur: () => true,
    close: () => true
  };
  const buildPopperOptions = (props, modifiers = []) => {
    const { placement, strategy, popperOptions } = props;
    const options = {
      placement,
      strategy,
      ...popperOptions,
      modifiers: [...genModifiers(props), ...modifiers]
    };
    deriveExtraModifiers(options, popperOptions == null ? void 0 : popperOptions.modifiers);
    return options;
  };
  const unwrapMeasurableEl = ($el) => {
    if (!isClient)
      return;
    return unrefElement($el);
  };
  function genModifiers(options) {
    const { offset, gpuAcceleration, fallbackPlacements } = options;
    return [
      {
        name: "offset",
        options: {
          offset: [0, offset != null ? offset : 12]
        }
      },
      {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      },
      {
        name: "flip",
        options: {
          padding: 5,
          fallbackPlacements
        }
      },
      {
        name: "computeStyles",
        options: {
          gpuAcceleration
        }
      }
    ];
  }
  function deriveExtraModifiers(options, modifiers) {
    if (modifiers) {
      options.modifiers = [...options.modifiers, ...modifiers != null ? modifiers : []];
    }
  }
  const DEFAULT_ARROW_OFFSET = 0;
  const usePopperContent = (props) => {
    const { popperInstanceRef, contentRef, triggerRef, role } = vue.inject(POPPER_INJECTION_KEY, void 0);
    const arrowRef = vue.ref();
    const arrowOffset = vue.ref();
    const eventListenerModifier = vue.computed(() => {
      return {
        name: "eventListeners",
        enabled: !!props.visible
      };
    });
    const arrowModifier = vue.computed(() => {
      var _a2;
      const arrowEl = vue.unref(arrowRef);
      const offset = (_a2 = vue.unref(arrowOffset)) != null ? _a2 : DEFAULT_ARROW_OFFSET;
      return {
        name: "arrow",
        enabled: !isUndefined$1(arrowEl),
        options: {
          element: arrowEl,
          padding: offset
        }
      };
    });
    const options = vue.computed(() => {
      return {
        onFirstUpdate: () => {
          update();
        },
        ...buildPopperOptions(props, [
          vue.unref(arrowModifier),
          vue.unref(eventListenerModifier)
        ])
      };
    });
    const computedReference = vue.computed(() => unwrapMeasurableEl(props.referenceEl) || vue.unref(triggerRef));
    const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
    vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance);
    vue.onMounted(() => {
      vue.watch(() => {
        var _a2;
        return (_a2 = vue.unref(computedReference)) == null ? void 0 : _a2.getBoundingClientRect();
      }, () => {
        update();
      });
    });
    return {
      attributes,
      arrowRef,
      contentRef,
      instanceRef,
      state,
      styles,
      role,
      forceUpdate,
      update
    };
  };
  const usePopperContentDOM = (props, {
    attributes,
    styles,
    role
  }) => {
    const { nextZIndex } = useZIndex();
    const ns = useNamespace("popper");
    const contentAttrs = vue.computed(() => vue.unref(attributes).popper);
    const contentZIndex = vue.ref(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
    const contentClass = vue.computed(() => [
      ns.b(),
      ns.is("pure", props.pure),
      ns.is(props.effect),
      props.popperClass
    ]);
    const contentStyle = vue.computed(() => {
      return [
        { zIndex: vue.unref(contentZIndex) },
        vue.unref(styles).popper,
        props.popperStyle || {}
      ];
    });
    const ariaModal = vue.computed(() => role.value === "dialog" ? "false" : void 0);
    const arrowStyle = vue.computed(() => vue.unref(styles).arrow || {});
    const updateZIndex = () => {
      contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
    };
    return {
      ariaModal,
      arrowStyle,
      contentAttrs,
      contentClass,
      contentStyle,
      contentZIndex,
      updateZIndex
    };
  };
  const usePopperContentFocusTrap = (props, emit) => {
    const trapped = vue.ref(false);
    const focusStartRef = vue.ref();
    const onFocusAfterTrapped = () => {
      emit("focus");
    };
    const onFocusAfterReleased = (event) => {
      var _a2;
      if (((_a2 = event.detail) == null ? void 0 : _a2.focusReason) !== "pointer") {
        focusStartRef.value = "first";
        emit("blur");
      }
    };
    const onFocusInTrap = (event) => {
      if (props.visible && !trapped.value) {
        if (event.target) {
          focusStartRef.value = event.target;
        }
        trapped.value = true;
      }
    };
    const onFocusoutPrevented = (event) => {
      if (!props.trapping) {
        if (event.detail.focusReason === "pointer") {
          event.preventDefault();
        }
        trapped.value = false;
      }
    };
    const onReleaseRequested = () => {
      trapped.value = false;
      emit("close");
    };
    return {
      focusStartRef,
      trapped,
      onFocusAfterReleased,
      onFocusAfterTrapped,
      onFocusInTrap,
      onFocusoutPrevented,
      onReleaseRequested
    };
  };
  const __default__$b = vue.defineComponent({
    name: "ElPopperContent"
  });
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    ...__default__$b,
    props: popperContentProps,
    emits: popperContentEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const {
        focusStartRef,
        trapped,
        onFocusAfterReleased,
        onFocusAfterTrapped,
        onFocusInTrap,
        onFocusoutPrevented,
        onReleaseRequested
      } = usePopperContentFocusTrap(props, emit);
      const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);
      const {
        ariaModal,
        arrowStyle,
        contentAttrs,
        contentClass,
        contentStyle,
        updateZIndex
      } = usePopperContentDOM(props, {
        styles,
        attributes,
        role
      });
      const formItemContext = vue.inject(formItemContextKey, void 0);
      const arrowOffset = vue.ref();
      vue.provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowStyle,
        arrowRef,
        arrowOffset
      });
      if (formItemContext && (formItemContext.addInputId || formItemContext.removeInputId)) {
        vue.provide(formItemContextKey, {
          ...formItemContext,
          addInputId: NOOP,
          removeInputId: NOOP
        });
      }
      let triggerTargetAriaStopWatch = void 0;
      const updatePopper = (shouldUpdateZIndex = true) => {
        update();
        shouldUpdateZIndex && updateZIndex();
      };
      const togglePopperAlive = () => {
        updatePopper(false);
        if (props.visible && props.focusOnShow) {
          trapped.value = true;
        } else if (props.visible === false) {
          trapped.value = false;
        }
      };
      vue.onMounted(() => {
        vue.watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
          triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
          triggerTargetAriaStopWatch = void 0;
          const el = vue.unref(triggerTargetEl || contentRef.value);
          const prevEl = vue.unref(prevTriggerTargetEl || contentRef.value);
          if (isElement(el)) {
            triggerTargetAriaStopWatch = vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
              ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (prevEl !== el && isElement(prevEl)) {
            ["role", "aria-label", "aria-modal", "id"].forEach((key) => {
              prevEl.removeAttribute(key);
            });
          }
        }, { immediate: true });
        vue.watch(() => props.visible, togglePopperAlive, { immediate: true });
      });
      vue.onBeforeUnmount(() => {
        triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
        triggerTargetAriaStopWatch = void 0;
      });
      expose({
        popperContentRef: contentRef,
        popperInstanceRef: instanceRef,
        updatePopper,
        contentStyle
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
          ref_key: "contentRef",
          ref: contentRef
        }, vue.unref(contentAttrs), {
          style: vue.unref(contentStyle),
          class: vue.unref(contentClass),
          tabindex: "-1",
          onMouseenter: _cache[0] || (_cache[0] = (e) => _ctx.$emit("mouseenter", e)),
          onMouseleave: _cache[1] || (_cache[1] = (e) => _ctx.$emit("mouseleave", e))
        }), [
          vue.createVNode(vue.unref(ElFocusTrap), {
            trapped: vue.unref(trapped),
            "trap-on-focus-in": true,
            "focus-trap-el": vue.unref(contentRef),
            "focus-start-el": vue.unref(focusStartRef),
            onFocusAfterTrapped: vue.unref(onFocusAfterTrapped),
            onFocusAfterReleased: vue.unref(onFocusAfterReleased),
            onFocusin: vue.unref(onFocusInTrap),
            onFocusoutPrevented: vue.unref(onFocusoutPrevented),
            onReleaseRequested: vue.unref(onReleaseRequested)
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusin", "onFocusoutPrevented", "onReleaseRequested"])
        ], 16);
      };
    }
  });
  var ElPopperContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$g, [["__file", "content.vue"]]);
  const ElPopper = withInstall(Popper);
  const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
  const useTooltipContentProps = buildProps({
    ...useDelayedToggleProps,
    ...popperContentProps,
    appendTo: {
      type: definePropType([String, Object])
    },
    content: {
      type: String,
      default: ""
    },
    rawContent: {
      type: Boolean,
      default: false
    },
    persistent: Boolean,
    visible: {
      type: definePropType(Boolean),
      default: null
    },
    transition: String,
    teleported: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    ...useAriaProps(["ariaLabel"])
  });
  const useTooltipTriggerProps = buildProps({
    ...popperTriggerProps,
    disabled: Boolean,
    trigger: {
      type: definePropType([String, Array]),
      default: "hover"
    },
    triggerKeys: {
      type: definePropType(Array),
      default: () => [EVENT_CODE.enter, EVENT_CODE.space]
    }
  });
  const {
    useModelToggleProps: useTooltipModelToggleProps,
    useModelToggleEmits: useTooltipModelToggleEmits,
    useModelToggle: useTooltipModelToggle
  } = createModelToggleComposable("visible");
  const useTooltipProps = buildProps({
    ...popperProps,
    ...useTooltipModelToggleProps,
    ...useTooltipContentProps,
    ...useTooltipTriggerProps,
    ...popperArrowProps,
    showArrow: {
      type: Boolean,
      default: true
    }
  });
  const tooltipEmits = [
    ...useTooltipModelToggleEmits,
    "before-show",
    "before-hide",
    "show",
    "hide",
    "open",
    "close"
  ];
  const isTriggerType = (trigger, type) => {
    if (isArray$2(trigger)) {
      return trigger.includes(type);
    }
    return trigger === type;
  };
  const whenTrigger = (trigger, type, handler) => {
    return (e) => {
      isTriggerType(vue.unref(trigger), type) && handler(e);
    };
  };
  const __default__$a = vue.defineComponent({
    name: "ElTooltipTrigger"
  });
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: useTooltipTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("tooltip");
      const { controlled, id, open, onOpen, onClose, onToggle } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const triggerRef = vue.ref(null);
      const stopWhenControlledOrDisabled = () => {
        if (vue.unref(controlled) || props.disabled) {
          return true;
        }
      };
      const trigger = vue.toRef(props, "trigger");
      const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onOpen));
      const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onClose));
      const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "click", (e) => {
        if (e.button === 0) {
          onToggle(e);
        }
      }));
      const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onOpen));
      const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onClose));
      const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "contextmenu", (e) => {
        e.preventDefault();
        onToggle(e);
      }));
      const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
        const { code } = e;
        if (props.triggerKeys.includes(code)) {
          e.preventDefault();
          onToggle(e);
        }
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopperTrigger), {
          id: vue.unref(id),
          "virtual-ref": _ctx.virtualRef,
          open: vue.unref(open),
          "virtual-triggering": _ctx.virtualTriggering,
          class: vue.normalizeClass(vue.unref(ns).e("trigger")),
          onBlur: vue.unref(onBlur),
          onClick: vue.unref(onClick),
          onContextmenu: vue.unref(onContextMenu),
          onFocus: vue.unref(onFocus),
          onMouseenter: vue.unref(onMouseenter),
          onMouseleave: vue.unref(onMouseleave),
          onKeydown: vue.unref(onKeydown)
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "virtual-ref", "open", "virtual-triggering", "class", "onBlur", "onClick", "onContextmenu", "onFocus", "onMouseenter", "onMouseleave", "onKeydown"]);
      };
    }
  });
  var ElTooltipTrigger = /* @__PURE__ */ _export_sfc$1(_sfc_main$f, [["__file", "trigger.vue"]]);
  const __default__$9 = vue.defineComponent({
    name: "ElTooltipContent",
    inheritAttrs: false
  });
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
    props: useTooltipContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const { selector } = usePopperContainerId();
      const ns = useNamespace("tooltip");
      const contentRef = vue.ref(null);
      const destroyed = vue.ref(false);
      const {
        controlled,
        id,
        open,
        trigger,
        onClose,
        onOpen,
        onShow,
        onHide,
        onBeforeShow,
        onBeforeHide
      } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const transitionClass = vue.computed(() => {
        return props.transition || `${ns.namespace.value}-fade-in-linear`;
      });
      const persistentRef = vue.computed(() => {
        return props.persistent;
      });
      vue.onBeforeUnmount(() => {
        destroyed.value = true;
      });
      const shouldRender = vue.computed(() => {
        return vue.unref(persistentRef) ? true : vue.unref(open);
      });
      const shouldShow = vue.computed(() => {
        return props.disabled ? false : vue.unref(open);
      });
      const appendTo = vue.computed(() => {
        return props.appendTo || selector.value;
      });
      const contentStyle = vue.computed(() => {
        var _a2;
        return (_a2 = props.style) != null ? _a2 : {};
      });
      const ariaHidden = vue.computed(() => !vue.unref(open));
      const onTransitionLeave = () => {
        onHide();
      };
      const stopWhenControlled = () => {
        if (vue.unref(controlled))
          return true;
      };
      const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
        if (props.enterable && vue.unref(trigger) === "hover") {
          onOpen();
        }
      });
      const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
        if (vue.unref(trigger) === "hover") {
          onClose();
        }
      });
      const onBeforeEnter = () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
        onBeforeShow == null ? void 0 : onBeforeShow();
      };
      const onBeforeLeave = () => {
        onBeforeHide == null ? void 0 : onBeforeHide();
      };
      const onAfterShow = () => {
        onShow();
        stopHandle = onClickOutside(vue.computed(() => {
          var _a2;
          return (_a2 = contentRef.value) == null ? void 0 : _a2.popperContentRef;
        }), () => {
          if (vue.unref(controlled))
            return;
          const $trigger = vue.unref(trigger);
          if ($trigger !== "hover") {
            onClose();
          }
        });
      };
      const onBlur = () => {
        if (!props.virtualTriggering) {
          onClose();
        }
      };
      let stopHandle;
      vue.watch(() => vue.unref(open), (val) => {
        if (!val) {
          stopHandle == null ? void 0 : stopHandle();
        }
      }, {
        flush: "post"
      });
      vue.watch(() => props.content, () => {
        var _a2, _b;
        (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.updatePopper) == null ? void 0 : _b.call(_a2);
      });
      expose({
        contentRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, {
          disabled: !_ctx.teleported,
          to: vue.unref(appendTo)
        }, [
          vue.createVNode(vue.Transition, {
            name: vue.unref(transitionClass),
            onAfterLeave: onTransitionLeave,
            onBeforeEnter,
            onAfterEnter: onAfterShow,
            onBeforeLeave
          }, {
            default: vue.withCtx(() => [
              vue.unref(shouldRender) ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElPopperContent), vue.mergeProps({
                key: 0,
                id: vue.unref(id),
                ref_key: "contentRef",
                ref: contentRef
              }, _ctx.$attrs, {
                "aria-label": _ctx.ariaLabel,
                "aria-hidden": vue.unref(ariaHidden),
                "boundaries-padding": _ctx.boundariesPadding,
                "fallback-placements": _ctx.fallbackPlacements,
                "gpu-acceleration": _ctx.gpuAcceleration,
                offset: _ctx.offset,
                placement: _ctx.placement,
                "popper-options": _ctx.popperOptions,
                strategy: _ctx.strategy,
                effect: _ctx.effect,
                enterable: _ctx.enterable,
                pure: _ctx.pure,
                "popper-class": _ctx.popperClass,
                "popper-style": [_ctx.popperStyle, vue.unref(contentStyle)],
                "reference-el": _ctx.referenceEl,
                "trigger-target-el": _ctx.triggerTargetEl,
                visible: vue.unref(shouldShow),
                "z-index": _ctx.zIndex,
                onMouseenter: vue.unref(onContentEnter),
                onMouseleave: vue.unref(onContentLeave),
                onBlur,
                onClose: vue.unref(onClose)
              }), {
                default: vue.withCtx(() => [
                  !destroyed.value ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                [vue.vShow, vue.unref(shouldShow)]
              ]) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["name"])
        ], 8, ["disabled", "to"]);
      };
    }
  });
  var ElTooltipContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$e, [["__file", "content.vue"]]);
  const _hoisted_1$7 = ["innerHTML"];
  const _hoisted_2$6 = { key: 1 };
  const __default__$8 = vue.defineComponent({
    name: "ElTooltip"
  });
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: useTooltipProps,
    emits: tooltipEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      usePopperContainer();
      const id = useId();
      const popperRef = vue.ref();
      const contentRef = vue.ref();
      const updatePopper = () => {
        var _a2;
        const popperComponent = vue.unref(popperRef);
        if (popperComponent) {
          (_a2 = popperComponent.popperInstanceRef) == null ? void 0 : _a2.update();
        }
      };
      const open = vue.ref(false);
      const toggleReason = vue.ref();
      const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
        indicator: open,
        toggleReason
      });
      const { onOpen, onClose } = useDelayedToggle({
        showAfter: vue.toRef(props, "showAfter"),
        hideAfter: vue.toRef(props, "hideAfter"),
        autoClose: vue.toRef(props, "autoClose"),
        open: show,
        close: hide
      });
      const controlled = vue.computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
      vue.provide(TOOLTIP_INJECTION_KEY, {
        controlled,
        id,
        open: vue.readonly(open),
        trigger: vue.toRef(props, "trigger"),
        onOpen: (event) => {
          onOpen(event);
        },
        onClose: (event) => {
          onClose(event);
        },
        onToggle: (event) => {
          if (vue.unref(open)) {
            onClose(event);
          } else {
            onOpen(event);
          }
        },
        onShow: () => {
          emit("show", toggleReason.value);
        },
        onHide: () => {
          emit("hide", toggleReason.value);
        },
        onBeforeShow: () => {
          emit("before-show", toggleReason.value);
        },
        onBeforeHide: () => {
          emit("before-hide", toggleReason.value);
        },
        updatePopper
      });
      vue.watch(() => props.disabled, (disabled) => {
        if (disabled && open.value) {
          open.value = false;
        }
      });
      const isFocusInsideContent = (event) => {
        var _a2, _b;
        const popperContent = (_b = (_a2 = contentRef.value) == null ? void 0 : _a2.contentRef) == null ? void 0 : _b.popperContentRef;
        const activeElement = (event == null ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent && popperContent.contains(activeElement);
      };
      vue.onDeactivated(() => open.value && hide());
      expose({
        popperRef,
        contentRef,
        isFocusInsideContent,
        updatePopper,
        onOpen,
        onClose,
        hide
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopper), {
          ref_key: "popperRef",
          ref: popperRef,
          role: _ctx.role
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(ElTooltipTrigger, {
              disabled: _ctx.disabled,
              trigger: _ctx.trigger,
              "trigger-keys": _ctx.triggerKeys,
              "virtual-ref": _ctx.virtualRef,
              "virtual-triggering": _ctx.virtualTriggering
            }, {
              default: vue.withCtx(() => [
                _ctx.$slots.default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["disabled", "trigger", "trigger-keys", "virtual-ref", "virtual-triggering"]),
            vue.createVNode(ElTooltipContent, {
              ref_key: "contentRef",
              ref: contentRef,
              "aria-label": _ctx.ariaLabel,
              "boundaries-padding": _ctx.boundariesPadding,
              content: _ctx.content,
              disabled: _ctx.disabled,
              effect: _ctx.effect,
              enterable: _ctx.enterable,
              "fallback-placements": _ctx.fallbackPlacements,
              "hide-after": _ctx.hideAfter,
              "gpu-acceleration": _ctx.gpuAcceleration,
              offset: _ctx.offset,
              persistent: _ctx.persistent,
              "popper-class": _ctx.popperClass,
              "popper-style": _ctx.popperStyle,
              placement: _ctx.placement,
              "popper-options": _ctx.popperOptions,
              pure: _ctx.pure,
              "raw-content": _ctx.rawContent,
              "reference-el": _ctx.referenceEl,
              "trigger-target-el": _ctx.triggerTargetEl,
              "show-after": _ctx.showAfter,
              strategy: _ctx.strategy,
              teleported: _ctx.teleported,
              transition: _ctx.transition,
              "virtual-triggering": _ctx.virtualTriggering,
              "z-index": _ctx.zIndex,
              "append-to": _ctx.appendTo
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "content", {}, () => [
                  _ctx.rawContent ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    innerHTML: _ctx.content
                  }, null, 8, _hoisted_1$7)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$6, vue.toDisplayString(_ctx.content), 1))
                ]),
                _ctx.showArrow ? (vue.openBlock(), vue.createBlock(vue.unref(ElPopperArrow), {
                  key: 0,
                  "arrow-offset": _ctx.arrowOffset
                }, null, 8, ["arrow-offset"])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["aria-label", "boundaries-padding", "content", "disabled", "effect", "enterable", "fallback-placements", "hide-after", "gpu-acceleration", "offset", "persistent", "popper-class", "popper-style", "placement", "popper-options", "pure", "raw-content", "reference-el", "trigger-target-el", "show-after", "strategy", "teleported", "transition", "virtual-triggering", "z-index", "append-to"])
          ]),
          _: 3
        }, 8, ["role"]);
      };
    }
  });
  var Tooltip = /* @__PURE__ */ _export_sfc$1(_sfc_main$d, [["__file", "tooltip.vue"]]);
  const ElTooltip = withInstall(Tooltip);
  const badgeProps = buildProps({
    value: {
      type: [String, Number],
      default: ""
    },
    max: {
      type: Number,
      default: 99
    },
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      values: ["primary", "success", "warning", "info", "danger"],
      default: "danger"
    },
    showZero: {
      type: Boolean,
      default: true
    },
    color: String,
    dotStyle: {
      type: definePropType([String, Object, Array])
    },
    badgeStyle: {
      type: definePropType([String, Object, Array])
    },
    offset: {
      type: definePropType(Array),
      default: [0, 0]
    },
    dotClass: {
      type: String
    },
    badgeClass: {
      type: String
    }
  });
  const _hoisted_1$6 = ["textContent"];
  const __default__$7 = vue.defineComponent({
    name: "ElBadge"
  });
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: badgeProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("badge");
      const content = vue.computed(() => {
        if (props.isDot)
          return "";
        if (isNumber(props.value) && isNumber(props.max)) {
          if (props.max < props.value) {
            return `${props.max}+`;
          }
          return props.value === 0 && !props.showZero ? "" : `${props.value}`;
        }
        return `${props.value}`;
      });
      const style2 = vue.computed(() => {
        var _a2, _b, _c, _d, _e, _f;
        return [
          {
            backgroundColor: props.color,
            marginRight: addUnit(-((_b = (_a2 = props.offset) == null ? void 0 : _a2[0]) != null ? _b : 0)),
            marginTop: addUnit((_d = (_c = props.offset) == null ? void 0 : _c[1]) != null ? _d : 0)
          },
          (_e = props.dotStyle) != null ? _e : {},
          (_f = props.badgeStyle) != null ? _f : {}
        ];
      });
      useDeprecated({
        from: "dot-style",
        replacement: "badge-style",
        version: "2.8.0",
        scope: "el-badge",
        ref: "https://element-plus.org/en-US/component/badge.html"
      }, vue.computed(() => !!props.dotStyle));
      useDeprecated({
        from: "dot-class",
        replacement: "badge-class",
        version: "2.8.0",
        scope: "el-badge",
        ref: "https://element-plus.org/en-US/component/badge.html"
      }, vue.computed(() => !!props.dotClass));
      expose({
        content
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.renderSlot(_ctx.$slots, "default"),
          vue.createVNode(vue.Transition, {
            name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
            persisted: ""
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("sup", {
                class: vue.normalizeClass([
                  vue.unref(ns).e("content"),
                  vue.unref(ns).em("content", _ctx.type),
                  vue.unref(ns).is("fixed", !!_ctx.$slots.default),
                  vue.unref(ns).is("dot", _ctx.isDot),
                  _ctx.dotClass,
                  _ctx.badgeClass
                ]),
                style: vue.normalizeStyle(vue.unref(style2)),
                textContent: vue.toDisplayString(vue.unref(content))
              }, null, 14, _hoisted_1$6), [
                [vue.vShow, !_ctx.hidden && (vue.unref(content) || _ctx.isDot)]
              ])
            ]),
            _: 1
          }, 8, ["name"])
        ], 2);
      };
    }
  });
  var Badge = /* @__PURE__ */ _export_sfc$1(_sfc_main$c, [["__file", "badge.vue"]]);
  const ElBadge = withInstall(Badge);
  const buttonGroupContextKey = Symbol("buttonGroupContextKey");
  const useButton = (props, emit) => {
    useDeprecated({
      from: "type.text",
      replacement: "link",
      version: "3.0.0",
      scope: "props",
      ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
    }, vue.computed(() => props.type === "text"));
    const buttonGroupContext = vue.inject(buttonGroupContextKey, void 0);
    const globalConfig2 = useGlobalConfig("button");
    const { form } = useFormItem();
    const _size = useFormSize(vue.computed(() => buttonGroupContext == null ? void 0 : buttonGroupContext.size));
    const _disabled = useFormDisabled();
    const _ref = vue.ref();
    const slots = vue.useSlots();
    const _type = vue.computed(() => props.type || (buttonGroupContext == null ? void 0 : buttonGroupContext.type) || "");
    const autoInsertSpace = vue.computed(() => {
      var _a2, _b, _c;
      return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a2 = globalConfig2.value) == null ? void 0 : _a2.autoInsertSpace) != null ? _c : false;
    });
    const _props = vue.computed(() => {
      if (props.tag === "button") {
        return {
          ariaDisabled: _disabled.value || props.loading,
          disabled: _disabled.value || props.loading,
          autofocus: props.autofocus,
          type: props.nativeType
        };
      }
      return {};
    });
    const shouldAddSpace = vue.computed(() => {
      var _a2;
      const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
      if (autoInsertSpace.value && (defaultSlot == null ? void 0 : defaultSlot.length) === 1) {
        const slot = defaultSlot[0];
        if ((slot == null ? void 0 : slot.type) === vue.Text) {
          const text = slot.children;
          return /^\p{Unified_Ideograph}{2}$/u.test(text.trim());
        }
      }
      return false;
    });
    const handleClick = (evt) => {
      if (props.nativeType === "reset") {
        form == null ? void 0 : form.resetFields();
      }
      emit("click", evt);
    };
    return {
      _disabled,
      _size,
      _type,
      _ref,
      _props,
      shouldAddSpace,
      handleClick
    };
  };
  const buttonTypes = [
    "default",
    "primary",
    "success",
    "warning",
    "info",
    "danger",
    "text",
    ""
  ];
  const buttonNativeTypes = ["button", "submit", "reset"];
  const buttonProps = buildProps({
    size: useSizeProp,
    disabled: Boolean,
    type: {
      type: String,
      values: buttonTypes,
      default: ""
    },
    icon: {
      type: iconPropType
    },
    nativeType: {
      type: String,
      values: buttonNativeTypes,
      default: "button"
    },
    loading: Boolean,
    loadingIcon: {
      type: iconPropType,
      default: () => loading_default
    },
    plain: Boolean,
    text: Boolean,
    link: Boolean,
    bg: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    color: String,
    dark: Boolean,
    autoInsertSpace: {
      type: Boolean,
      default: void 0
    },
    tag: {
      type: definePropType([String, Object]),
      default: "button"
    }
  });
  const buttonEmits = {
    click: (evt) => evt instanceof MouseEvent
  };
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a2) {
    a2 = parseFloat(a2);
    if (isNaN(a2) || a2 < 0 || a2 > 1) {
      a2 = 1;
    }
    return a2;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c2) {
    return c2.length === 1 ? "0" + c2 : String(c2);
  }
  function rgbToRgb(r, g, b2) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b2, 255) * 255
    };
  }
  function rgbToHsl(r, g, b2) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b2 = bound01(b2, 255);
    var max = Math.max(r, g, b2);
    var min = Math.min(r, g, b2);
    var h2 = 0;
    var s2 = 0;
    var l2 = (max + min) / 2;
    if (max === min) {
      s2 = 0;
      h2 = 0;
    } else {
      var d2 = max - min;
      s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
      switch (max) {
        case r:
          h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
          break;
        case g:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g) / d2 + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s: s2, l: l2 };
  }
  function hue2rgb(p2, q2, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p2 + (q2 - p2) * (6 * t);
    }
    if (t < 1 / 2) {
      return q2;
    }
    if (t < 2 / 3) {
      return p2 + (q2 - p2) * (2 / 3 - t) * 6;
    }
    return p2;
  }
  function hslToRgb(h2, s2, l2) {
    var r;
    var g;
    var b2;
    h2 = bound01(h2, 360);
    s2 = bound01(s2, 100);
    l2 = bound01(l2, 100);
    if (s2 === 0) {
      g = l2;
      b2 = l2;
      r = l2;
    } else {
      var q2 = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
      var p2 = 2 * l2 - q2;
      r = hue2rgb(p2, q2, h2 + 1 / 3);
      g = hue2rgb(p2, q2, h2);
      b2 = hue2rgb(p2, q2, h2 - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b2 * 255 };
  }
  function rgbToHsv(r, g, b2) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b2 = bound01(b2, 255);
    var max = Math.max(r, g, b2);
    var min = Math.min(r, g, b2);
    var h2 = 0;
    var v2 = max;
    var d2 = max - min;
    var s2 = max === 0 ? 0 : d2 / max;
    if (max === min) {
      h2 = 0;
    } else {
      switch (max) {
        case r:
          h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
          break;
        case g:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g) / d2 + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s: s2, v: v2 };
  }
  function hsvToRgb(h2, s2, v2) {
    h2 = bound01(h2, 360) * 6;
    s2 = bound01(s2, 100);
    v2 = bound01(v2, 100);
    var i = Math.floor(h2);
    var f2 = h2 - i;
    var p2 = v2 * (1 - s2);
    var q2 = v2 * (1 - f2 * s2);
    var t = v2 * (1 - (1 - f2) * s2);
    var mod = i % 6;
    var r = [v2, q2, p2, p2, t, v2][mod];
    var g = [t, v2, v2, q2, p2, p2][mod];
    var b2 = [p2, p2, t, v2, v2, q2][mod];
    return { r: r * 255, g: g * 255, b: b2 * 255 };
  }
  function rgbToHex(r, g, b2, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b2).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b2, a2, allow4Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b2).toString(16)),
      pad2(convertDecimalToHex(a2))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d2) {
    return Math.round(parseFloat(d2) * 255).toString(16);
  }
  function convertHexToDecimal(h2) {
    return parseIntFromHex(h2) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return {
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a2 = 1;
    var s2 = null;
    var v2 = null;
    var l2 = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s2 = convertToPercentage(color.s);
        v2 = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s2, v2);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s2 = convertToPercentage(color.s);
        l2 = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s2, l2);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a2 = color.a;
      }
    }
    a2 = boundAlpha(a2);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a: a2
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var TinyColor = function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a2;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a2 = opts.format) !== null && _a2 !== void 0 ? _a2 : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R2;
      var G2;
      var B2;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R2 = RsRGB / 12.92;
      } else {
        R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G2 = GsRGB / 12.92;
      } else {
        G2 = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B2 = BsRGB / 12.92;
      } else {
        B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.isMonochrome = function() {
      var s2 = this.toHsl().s;
      return s2 === 0;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h2 = Math.round(hsv.h * 360);
      var s2 = Math.round(hsv.s * 100);
      var v2 = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%)") : "hsva(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h2 = Math.round(hsl.h * 360);
      var s2 = Math.round(hsl.s * 100);
      var l2 = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%)") : "hsla(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toHexShortString = function(allowShortChar) {
      if (allowShortChar === void 0) {
        allowShortChar = false;
      }
      return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r = Math.round(this.r);
      var g = Math.round(this.g);
      var b2 = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b2, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b2, ", ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x2) {
        return "".concat(Math.round(bound01(x2, 255) * 100), "%");
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x2) {
        return Math.round(bound01(x2, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a2 = Object.entries(names); _i < _a2.length; _i++) {
        var _b = _a2[_i], key = _b[0], value = _b[1];
        if (hex === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format) {
      var formatSet = Boolean(format);
      format = format !== null && format !== void 0 ? format : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
      if (needsAlphaFormat) {
        if (format === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }
      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format === "name") {
        formattedString = this.toName();
      }
      if (format === "hsl") {
        formattedString = this.toHslString();
      }
      if (format === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p2 = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p2 + rgb1.r,
        g: (rgb2.g - rgb1.g) * p2 + rgb1.g,
        b: (rgb2.b - rgb1.b) * p2 + rgb1.b,
        a: (rgb2.a - rgb1.a) * p2 + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h2 = hsv.h;
      var s2 = hsv.s;
      var v2 = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({ h: h2, s: s2, v: v2 }));
        v2 = (v2 + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h2 = hsl.h;
      return [
        this,
        new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
        new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
      ];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      var alpha = fg.a + bg.a * (1 - fg.a);
      return new TinyColor2({
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
        a: alpha
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n) {
      var hsl = this.toHsl();
      var h2 = hsl.h;
      var result = [this];
      var increment = 360 / n;
      for (var i = 1; i < n; i++) {
        result.push(new TinyColor2({ h: (h2 + i * increment) % 360, s: hsl.s, l: hsl.l }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }();
  function darken(color, amount = 20) {
    return color.mix("#141414", amount).toString();
  }
  function useButtonCustomStyle(props) {
    const _disabled = useFormDisabled();
    const ns = useNamespace("button");
    return vue.computed(() => {
      let styles = {};
      const buttonColor = props.color;
      if (buttonColor) {
        const color = new TinyColor(buttonColor);
        const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
        if (props.plain) {
          styles = ns.cssVarBlock({
            "bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
            "text-color": buttonColor,
            "border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
            "hover-text-color": `var(${ns.cssVarName("color-white")})`,
            "hover-bg-color": buttonColor,
            "hover-border-color": buttonColor,
            "active-bg-color": activeBgColor,
            "active-text-color": `var(${ns.cssVarName("color-white")})`,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            styles[ns.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
          }
        } else {
          const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
          const textColor = color.isDark() ? `var(${ns.cssVarName("color-white")})` : `var(${ns.cssVarName("color-black")})`;
          styles = ns.cssVarBlock({
            "bg-color": buttonColor,
            "text-color": textColor,
            "border-color": buttonColor,
            "hover-bg-color": hoverBgColor,
            "hover-text-color": textColor,
            "hover-border-color": hoverBgColor,
            "active-bg-color": activeBgColor,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns.cssVarName("color-white")})`;
            styles[ns.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
          }
        }
      }
      return styles;
    });
  }
  const __default__$6 = vue.defineComponent({
    name: "ElButton"
  });
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const buttonStyle = useButtonCustomStyle(props);
      const ns = useNamespace("button");
      const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } = useButton(props, emit);
      const buttonKls = vue.computed(() => [
        ns.b(),
        ns.m(_type.value),
        ns.m(_size.value),
        ns.is("disabled", _disabled.value),
        ns.is("loading", props.loading),
        ns.is("plain", props.plain),
        ns.is("round", props.round),
        ns.is("circle", props.circle),
        ns.is("text", props.text),
        ns.is("link", props.link),
        ns.is("has-bg", props.bg)
      ]);
      expose({
        ref: _ref,
        size: _size,
        type: _type,
        disabled: _disabled,
        shouldAddSpace
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), vue.mergeProps({
          ref_key: "_ref",
          ref: _ref
        }, vue.unref(_props), {
          class: vue.unref(buttonKls),
          style: vue.unref(buttonStyle),
          onClick: vue.unref(handleClick)
        }), {
          default: vue.withCtx(() => [
            _ctx.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              _ctx.$slots.loading ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass(vue.unref(ns).is("loading"))
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.loadingIcon)))
                ]),
                _: 1
              }, 8, ["class"]))
            ], 64)) : _ctx.icon || _ctx.$slots.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
              default: vue.withCtx(() => [
                _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon), { key: 0 })) : vue.renderSlot(_ctx.$slots, "icon", { key: 1 })
              ]),
              _: 3
            })) : vue.createCommentVNode("v-if", true),
            _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              class: vue.normalizeClass({ [vue.unref(ns).em("text", "expand")]: vue.unref(shouldAddSpace) })
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 16, ["class", "style", "onClick"]);
      };
    }
  });
  var Button = /* @__PURE__ */ _export_sfc$1(_sfc_main$b, [["__file", "button.vue"]]);
  const buttonGroupProps = {
    size: buttonProps.size,
    type: buttonProps.type
  };
  const __default__$5 = vue.defineComponent({
    name: "ElButtonGroup"
  });
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: buttonGroupProps,
    setup(__props) {
      const props = __props;
      vue.provide(buttonGroupContextKey, vue.reactive({
        size: vue.toRef(props, "size"),
        type: vue.toRef(props, "type")
      }));
      const ns = useNamespace("button");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(`${vue.unref(ns).b("group")}`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var ButtonGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$a, [["__file", "button-group.vue"]]);
  const ElButton = withInstall(Button, {
    ButtonGroup
  });
  withNoopInstall(ButtonGroup);
  const nodeList = /* @__PURE__ */ new Map();
  let startClick;
  if (isClient) {
    document.addEventListener("mousedown", (e) => startClick = e);
    document.addEventListener("mouseup", (e) => {
      for (const handlers of nodeList.values()) {
        for (const { documentHandler } of handlers) {
          documentHandler(e, startClick);
        }
      }
    });
  }
  function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
      excludes = binding.arg;
    } else if (isElement(binding.arg)) {
      excludes.push(binding.arg);
    }
    return function(mouseup, mousedown) {
      const popperRef = binding.instance.popperRef;
      const mouseUpTarget = mouseup.target;
      const mouseDownTarget = mousedown == null ? void 0 : mousedown.target;
      const isBound = !binding || !binding.instance;
      const isTargetExists = !mouseUpTarget || !mouseDownTarget;
      const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
      const isSelf = el === mouseUpTarget;
      const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
      const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
      if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
        return;
      }
      binding.value(mouseup, mousedown);
    };
  }
  const ClickOutside = {
    beforeMount(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      nodeList.get(el).push({
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      });
    },
    updated(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      const handlers = nodeList.get(el);
      const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
      const newHandler = {
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      };
      if (oldHandlerIndex >= 0) {
        handlers.splice(oldHandlerIndex, 1, newHandler);
      } else {
        handlers.push(newHandler);
      }
    },
    unmounted(el) {
      nodeList.delete(el);
    }
  };
  var v = false, o, f, s, u, d, N, l, p, m, w, D, x, E, M, F;
  function a() {
    if (!v) {
      v = true;
      var e = navigator.userAgent, n = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e), i = /(Mac OS X)|(Windows)|(Linux)/.exec(e);
      if (x = /\b(iPhone|iP[ao]d)/.exec(e), E = /\b(iP[ao]d)/.exec(e), w = /Android/i.exec(e), M = /FBAN\/\w+;/i.exec(e), F = /Mobile/i.exec(e), D = !!/Win64/.exec(e), n) {
        o = n[1] ? parseFloat(n[1]) : n[5] ? parseFloat(n[5]) : NaN, o && document && document.documentMode && (o = document.documentMode);
        var r = /(?:Trident\/(\d+.\d+))/.exec(e);
        N = r ? parseFloat(r[1]) + 4 : o, f = n[2] ? parseFloat(n[2]) : NaN, s = n[3] ? parseFloat(n[3]) : NaN, u = n[4] ? parseFloat(n[4]) : NaN, u ? (n = /(?:Chrome\/(\d+\.\d+))/.exec(e), d = n && n[1] ? parseFloat(n[1]) : NaN) : d = NaN;
      } else
        o = f = s = d = u = NaN;
      if (i) {
        if (i[1]) {
          var t = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);
          l = t ? parseFloat(t[1].replace("_", ".")) : true;
        } else
          l = false;
        p = !!i[2], m = !!i[3];
      } else
        l = p = m = false;
    }
  }
  var _ = { ie: function() {
    return a() || o;
  }, ieCompatibilityMode: function() {
    return a() || N > o;
  }, ie64: function() {
    return _.ie() && D;
  }, firefox: function() {
    return a() || f;
  }, opera: function() {
    return a() || s;
  }, webkit: function() {
    return a() || u;
  }, safari: function() {
    return _.webkit();
  }, chrome: function() {
    return a() || d;
  }, windows: function() {
    return a() || p;
  }, osx: function() {
    return a() || l;
  }, linux: function() {
    return a() || m;
  }, iphone: function() {
    return a() || x;
  }, mobile: function() {
    return a() || x || E || w || F;
  }, nativeApp: function() {
    return a() || M;
  }, android: function() {
    return a() || w;
  }, ipad: function() {
    return a() || E;
  } }, A = _;
  var c = !!(typeof window < "u" && window.document && window.document.createElement), U = { canUseDOM: c, canUseWorkers: typeof Worker < "u", canUseEventListeners: c && !!(window.addEventListener || window.attachEvent), canUseViewport: c && !!window.screen, isInWorker: !c }, h = U;
  var X;
  h.canUseDOM && (X = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true);
  function S(e, n) {
    if (!h.canUseDOM || n && !("addEventListener" in document))
      return false;
    var i = "on" + e, r = i in document;
    if (!r) {
      var t = document.createElement("div");
      t.setAttribute(i, "return;"), r = typeof t[i] == "function";
    }
    return !r && X && e === "wheel" && (r = document.implementation.hasFeature("Events.wheel", "3.0")), r;
  }
  var b = S;
  var O = 10, I = 40, P = 800;
  function T(e) {
    var n = 0, i = 0, r = 0, t = 0;
    return "detail" in e && (i = e.detail), "wheelDelta" in e && (i = -e.wheelDelta / 120), "wheelDeltaY" in e && (i = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (n = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (n = i, i = 0), r = n * O, t = i * O, "deltaY" in e && (t = e.deltaY), "deltaX" in e && (r = e.deltaX), (r || t) && e.deltaMode && (e.deltaMode == 1 ? (r *= I, t *= I) : (r *= P, t *= P)), r && !n && (n = r < 1 ? -1 : 1), t && !i && (i = t < 1 ? -1 : 1), { spinX: n, spinY: i, pixelX: r, pixelY: t };
  }
  T.getEventType = function() {
    return A.firefox() ? "DOMMouseScroll" : b("wheel") ? "wheel" : "mousewheel";
  };
  var Y = T;
  /**
  * Checks if an event is supported in the current execution environment.
  *
  * NOTE: This will not work correctly for non-generic events such as `change`,
  * `reset`, `load`, `error`, and `select`.
  *
  * Borrows from Modernizr.
  *
  * @param {string} eventNameSuffix Event name, e.g. "click".
  * @param {?boolean} capture Check if the capture phase is supported.
  * @return {boolean} True if the event is supported.
  * @internal
  * @license Modernizr 3.0.0pre (Custom Build) | MIT
  */
  const mousewheel = function(element, callback) {
    if (element && element.addEventListener) {
      const fn2 = function(event) {
        const normalized = Y(event);
        callback && Reflect.apply(callback, this, [event, normalized]);
      };
      element.addEventListener("wheel", fn2, { passive: true });
    }
  };
  const Mousewheel = {
    beforeMount(el, binding) {
      mousewheel(el, binding.value);
    }
  };
  const checkboxProps = {
    modelValue: {
      type: [Number, String, Boolean],
      default: void 0
    },
    label: {
      type: [String, Boolean, Number, Object],
      default: void 0
    },
    value: {
      type: [String, Boolean, Number, Object],
      default: void 0
    },
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: {
      type: String,
      default: void 0
    },
    trueValue: {
      type: [String, Number],
      default: void 0
    },
    falseValue: {
      type: [String, Number],
      default: void 0
    },
    trueLabel: {
      type: [String, Number],
      default: void 0
    },
    falseLabel: {
      type: [String, Number],
      default: void 0
    },
    id: {
      type: String,
      default: void 0
    },
    controls: {
      type: String,
      default: void 0
    },
    border: Boolean,
    size: useSizeProp,
    tabindex: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    },
    ...useAriaProps(["ariaControls"])
  };
  const checkboxEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
    change: (val) => isString(val) || isNumber(val) || isBoolean(val)
  };
  const checkboxGroupContextKey = Symbol("checkboxGroupContextKey");
  const useCheckboxDisabled = ({
    model,
    isChecked
  }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isLimitDisabled = vue.computed(() => {
      var _a2, _b;
      const max = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value;
      const min = (_b = checkboxGroup == null ? void 0 : checkboxGroup.min) == null ? void 0 : _b.value;
      return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
    });
    const isDisabled = useFormDisabled(vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.disabled.value) || isLimitDisabled.value));
    return {
      isDisabled,
      isLimitDisabled
    };
  };
  const useCheckboxEvent = (props, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
    isLabeledByFormItem
  }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const { formItem } = useFormItem();
    const { emit } = vue.getCurrentInstance();
    function getLabeledValue(value) {
      var _a2, _b, _c, _d;
      return [true, props.trueValue, props.trueLabel].includes(value) ? (_b = (_a2 = props.trueValue) != null ? _a2 : props.trueLabel) != null ? _b : true : (_d = (_c = props.falseValue) != null ? _c : props.falseLabel) != null ? _d : false;
    }
    function emitChangeEvent(checked, e) {
      emit("change", getLabeledValue(checked), e);
    }
    function handleChange(e) {
      if (isLimitExceeded.value)
        return;
      const target = e.target;
      emit("change", getLabeledValue(target.checked), e);
    }
    async function onClickRoot(e) {
      if (isLimitExceeded.value)
        return;
      if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
        const eventTargets = e.composedPath();
        const hasLabel = eventTargets.some((item) => item.tagName === "LABEL");
        if (!hasLabel) {
          model.value = getLabeledValue([false, props.falseValue, props.falseLabel].includes(model.value));
          await vue.nextTick();
          emitChangeEvent(model.value, e);
        }
      }
    }
    const validateEvent = vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.validateEvent) || props.validateEvent);
    vue.watch(() => props.modelValue, () => {
      if (validateEvent.value) {
        formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
      }
    });
    return {
      handleChange,
      onClickRoot
    };
  };
  const useCheckboxModel = (props) => {
    const selfModel = vue.ref(false);
    const { emit } = vue.getCurrentInstance();
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isGroup = vue.computed(() => isUndefined(checkboxGroup) === false);
    const isLimitExceeded = vue.ref(false);
    const model = vue.computed({
      get() {
        var _a2, _b;
        return isGroup.value ? (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.modelValue) == null ? void 0 : _a2.value : (_b = props.modelValue) != null ? _b : selfModel.value;
      },
      set(val) {
        var _a2, _b;
        if (isGroup.value && isArray$2(val)) {
          isLimitExceeded.value = ((_a2 = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a2.value) !== void 0 && val.length > (checkboxGroup == null ? void 0 : checkboxGroup.max.value) && val.length > model.value.length;
          isLimitExceeded.value === false && ((_b = checkboxGroup == null ? void 0 : checkboxGroup.changeEvent) == null ? void 0 : _b.call(checkboxGroup, val));
        } else {
          emit(UPDATE_MODEL_EVENT, val);
          selfModel.value = val;
        }
      }
    });
    return {
      model,
      isGroup,
      isLimitExceeded
    };
  };
  const useCheckboxStatus = (props, slots, { model }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isFocused = vue.ref(false);
    const actualValue = vue.computed(() => {
      if (!isPropAbsent(props.value)) {
        return props.value;
      }
      return props.label;
    });
    const isChecked = vue.computed(() => {
      const value = model.value;
      if (isBoolean(value)) {
        return value;
      } else if (isArray$2(value)) {
        if (isObject$1(actualValue.value)) {
          return value.map(vue.toRaw).some((o2) => isEqual(o2, actualValue.value));
        } else {
          return value.map(vue.toRaw).includes(actualValue.value);
        }
      } else if (value !== null && value !== void 0) {
        return value === props.trueValue || value === props.trueLabel;
      } else {
        return !!value;
      }
    });
    const checkboxButtonSize = useFormSize(vue.computed(() => {
      var _a2;
      return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
    }), {
      prop: true
    });
    const checkboxSize = useFormSize(vue.computed(() => {
      var _a2;
      return (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a2.value;
    }));
    const hasOwnLabel = vue.computed(() => {
      return !!slots.default || !isPropAbsent(actualValue.value);
    });
    return {
      checkboxButtonSize,
      isChecked,
      isFocused,
      checkboxSize,
      hasOwnLabel,
      actualValue
    };
  };
  const useCheckbox = (props, slots) => {
    const { formItem: elFormItem } = useFormItem();
    const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
    const {
      isFocused,
      isChecked,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel,
      actualValue
    } = useCheckboxStatus(props, slots, { model });
    const { isDisabled } = useCheckboxDisabled({ model, isChecked });
    const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
      formItemContext: elFormItem,
      disableIdGeneration: hasOwnLabel,
      disableIdManagement: isGroup
    });
    const { handleChange, onClickRoot } = useCheckboxEvent(props, {
      model,
      isLimitExceeded,
      hasOwnLabel,
      isDisabled,
      isLabeledByFormItem
    });
    const setStoreValue = () => {
      function addToStore() {
        var _a2, _b;
        if (isArray$2(model.value) && !model.value.includes(actualValue.value)) {
          model.value.push(actualValue.value);
        } else {
          model.value = (_b = (_a2 = props.trueValue) != null ? _a2 : props.trueLabel) != null ? _b : true;
        }
      }
      props.checked && addToStore();
    };
    setStoreValue();
    useDeprecated({
      from: "controls",
      replacement: "aria-controls",
      version: "2.8.0",
      scope: "el-checkbox",
      ref: "https://element-plus.org/en-US/component/checkbox.html"
    }, vue.computed(() => !!props.controls));
    useDeprecated({
      from: "label act as value",
      replacement: "value",
      version: "3.0.0",
      scope: "el-checkbox",
      ref: "https://element-plus.org/en-US/component/checkbox.html"
    }, vue.computed(() => isGroup.value && isPropAbsent(props.value)));
    useDeprecated({
      from: "true-label",
      replacement: "true-value",
      version: "3.0.0",
      scope: "el-checkbox",
      ref: "https://element-plus.org/en-US/component/checkbox.html"
    }, vue.computed(() => !!props.trueLabel));
    useDeprecated({
      from: "false-label",
      replacement: "false-value",
      version: "3.0.0",
      scope: "el-checkbox",
      ref: "https://element-plus.org/en-US/component/checkbox.html"
    }, vue.computed(() => !!props.falseLabel));
    return {
      inputId,
      isLabeledByFormItem,
      isChecked,
      isDisabled,
      isFocused,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel,
      model,
      actualValue,
      handleChange,
      onClickRoot
    };
  };
  const _hoisted_1$5 = ["id", "indeterminate", "name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$5 = ["id", "indeterminate", "disabled", "value", "name", "tabindex"];
  const __default__$4 = vue.defineComponent({
    name: "ElCheckbox"
  });
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = vue.useSlots();
      const {
        inputId,
        isLabeledByFormItem,
        isChecked,
        isDisabled,
        isFocused,
        checkboxSize,
        hasOwnLabel,
        model,
        actualValue,
        handleChange,
        onClickRoot
      } = useCheckbox(props, slots);
      const ns = useNamespace("checkbox");
      const compKls = vue.computed(() => {
        return [
          ns.b(),
          ns.m(checkboxSize.value),
          ns.is("disabled", isDisabled.value),
          ns.is("bordered", props.border),
          ns.is("checked", isChecked.value)
        ];
      });
      const spanKls = vue.computed(() => {
        return [
          ns.e("input"),
          ns.is("disabled", isDisabled.value),
          ns.is("checked", isChecked.value),
          ns.is("indeterminate", props.indeterminate),
          ns.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(!vue.unref(hasOwnLabel) && vue.unref(isLabeledByFormItem) ? "span" : "label"), {
          class: vue.normalizeClass(vue.unref(compKls)),
          "aria-controls": _ctx.indeterminate ? _ctx.controls || _ctx.ariaControls : null,
          onClick: vue.unref(onClickRoot)
        }, {
          default: vue.withCtx(() => {
            var _a2, _b;
            return [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(spanKls))
              }, [
                _ctx.trueValue || _ctx.falseValue || _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                  key: 0,
                  id: vue.unref(inputId),
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
                  class: vue.normalizeClass(vue.unref(ns).e("original")),
                  type: "checkbox",
                  indeterminate: _ctx.indeterminate,
                  name: _ctx.name,
                  tabindex: _ctx.tabindex,
                  disabled: vue.unref(isDisabled),
                  "true-value": (_a2 = _ctx.trueValue) != null ? _a2 : _ctx.trueLabel,
                  "false-value": (_b = _ctx.falseValue) != null ? _b : _ctx.falseLabel,
                  onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                  onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
                  onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
                  onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
                  }, ["stop"]))
                }, null, 42, _hoisted_1$5)), [
                  [vue.vModelCheckbox, vue.unref(model)]
                ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                  key: 1,
                  id: vue.unref(inputId),
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(model) ? model.value = $event : null),
                  class: vue.normalizeClass(vue.unref(ns).e("original")),
                  type: "checkbox",
                  indeterminate: _ctx.indeterminate,
                  disabled: vue.unref(isDisabled),
                  value: vue.unref(actualValue),
                  name: _ctx.name,
                  tabindex: _ctx.tabindex,
                  onChange: _cache[6] || (_cache[6] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                  onFocus: _cache[7] || (_cache[7] = ($event) => isFocused.value = true),
                  onBlur: _cache[8] || (_cache[8] = ($event) => isFocused.value = false),
                  onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
                  }, ["stop"]))
                }, null, 42, _hoisted_2$5)), [
                  [vue.vModelCheckbox, vue.unref(model)]
                ]),
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(ns).e("inner"))
                }, null, 2)
              ], 2),
              vue.unref(hasOwnLabel) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("label"))
              }, [
                vue.renderSlot(_ctx.$slots, "default"),
                !_ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                  vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
                ], 64)) : vue.createCommentVNode("v-if", true)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ];
          }),
          _: 3
        }, 8, ["class", "aria-controls", "onClick"]);
      };
    }
  });
  var Checkbox = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["__file", "checkbox.vue"]]);
  const _hoisted_1$4 = ["name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$4 = ["name", "tabindex", "disabled", "value"];
  const __default__$3 = vue.defineComponent({
    name: "ElCheckboxButton"
  });
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = vue.useSlots();
      const {
        isFocused,
        isChecked,
        isDisabled,
        checkboxButtonSize,
        model,
        actualValue,
        handleChange
      } = useCheckbox(props, slots);
      const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
      const ns = useNamespace("checkbox");
      const activeStyle = vue.computed(() => {
        var _a2, _b, _c, _d;
        const fillValue = (_b = (_a2 = checkboxGroup == null ? void 0 : checkboxGroup.fill) == null ? void 0 : _a2.value) != null ? _b : "";
        return {
          backgroundColor: fillValue,
          borderColor: fillValue,
          color: (_d = (_c = checkboxGroup == null ? void 0 : checkboxGroup.textColor) == null ? void 0 : _c.value) != null ? _d : "",
          boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
        };
      });
      const labelKls = vue.computed(() => {
        return [
          ns.b("button"),
          ns.bm("button", checkboxButtonSize.value),
          ns.is("disabled", isDisabled.value),
          ns.is("checked", isChecked.value),
          ns.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        var _a2, _b;
        return vue.openBlock(), vue.createElementBlock("label", {
          class: vue.normalizeClass(vue.unref(labelKls))
        }, [
          _ctx.trueValue || _ctx.falseValue || _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 0,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: vue.unref(isDisabled),
            "true-value": (_a2 = _ctx.trueValue) != null ? _a2 : _ctx.trueLabel,
            "false-value": (_b = _ctx.falseValue) != null ? _b : _ctx.falseLabel,
            onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
            onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
            onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
            onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_1$4)), [
            [vue.vModelCheckbox, vue.unref(model)]
          ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 1,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(model) ? model.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: vue.unref(isDisabled),
            value: vue.unref(actualValue),
            onChange: _cache[6] || (_cache[6] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
            onFocus: _cache[7] || (_cache[7] = ($event) => isFocused.value = true),
            onBlur: _cache[8] || (_cache[8] = ($event) => isFocused.value = false),
            onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_2$4)), [
            [vue.vModelCheckbox, vue.unref(model)]
          ]),
          _ctx.$slots.default || _ctx.label ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
            style: vue.normalizeStyle(vue.unref(isChecked) ? vue.unref(activeStyle) : void 0)
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
            ])
          ], 6)) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var CheckboxButton = /* @__PURE__ */ _export_sfc$1(_sfc_main$8, [["__file", "checkbox-button.vue"]]);
  const checkboxGroupProps = buildProps({
    modelValue: {
      type: definePropType(Array),
      default: () => []
    },
    disabled: Boolean,
    min: Number,
    max: Number,
    size: useSizeProp,
    label: String,
    fill: String,
    textColor: String,
    tag: {
      type: String,
      default: "div"
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    ...useAriaProps(["ariaLabel"])
  });
  const checkboxGroupEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isArray$2(val),
    change: (val) => isArray$2(val)
  };
  const __default__$2 = vue.defineComponent({
    name: "ElCheckboxGroup"
  });
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: checkboxGroupProps,
    emits: checkboxGroupEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("checkbox");
      const { formItem } = useFormItem();
      const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const changeEvent = async (value) => {
        emit(UPDATE_MODEL_EVENT, value);
        await vue.nextTick();
        emit("change", value);
      };
      const modelValue = vue.computed({
        get() {
          return props.modelValue;
        },
        set(val) {
          changeEvent(val);
        }
      });
      vue.provide(checkboxGroupContextKey, {
        ...pick$1(vue.toRefs(props), [
          "size",
          "min",
          "max",
          "disabled",
          "validateEvent",
          "fill",
          "textColor"
        ]),
        modelValue,
        changeEvent
      });
      useDeprecated({
        from: "label",
        replacement: "aria-label",
        version: "2.8.0",
        scope: "el-checkbox-group",
        ref: "https://element-plus.org/en-US/component/checkbox.html"
      }, vue.computed(() => !!props.label));
      vue.watch(() => props.modelValue, () => {
        if (props.validateEvent) {
          formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
        }
      });
      return (_ctx, _cache) => {
        var _a2;
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
          id: vue.unref(groupId),
          class: vue.normalizeClass(vue.unref(ns).b("group")),
          role: "group",
          "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.label || _ctx.ariaLabel || "checkbox-group" : void 0,
          "aria-labelledby": vue.unref(isLabeledByFormItem) ? (_a2 = vue.unref(formItem)) == null ? void 0 : _a2.labelId : void 0
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
      };
    }
  });
  var CheckboxGroup = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["__file", "checkbox-group.vue"]]);
  const ElCheckbox = withInstall(Checkbox, {
    CheckboxButton,
    CheckboxGroup
  });
  withNoopInstall(CheckboxButton);
  withNoopInstall(CheckboxGroup);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    inheritAttrs: false
  });
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default");
  }
  var Collection = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["render", _sfc_render$3], ["__file", "collection.vue"]]);
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    name: "ElCollectionItem",
    inheritAttrs: false
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default");
  }
  var CollectionItem = /* @__PURE__ */ _export_sfc$1(_sfc_main$5, [["render", _sfc_render$2], ["__file", "collection-item.vue"]]);
  const COLLECTION_ITEM_SIGN = `data-el-collection-item`;
  const createCollectionWithScope = (name) => {
    const COLLECTION_NAME = `El${name}Collection`;
    const COLLECTION_ITEM_NAME = `${COLLECTION_NAME}Item`;
    const COLLECTION_INJECTION_KEY = Symbol(COLLECTION_NAME);
    const COLLECTION_ITEM_INJECTION_KEY = Symbol(COLLECTION_ITEM_NAME);
    const ElCollection = {
      ...Collection,
      name: COLLECTION_NAME,
      setup() {
        const collectionRef = vue.ref(null);
        const itemMap = /* @__PURE__ */ new Map();
        const getItems = () => {
          const collectionEl = vue.unref(collectionRef);
          if (!collectionEl)
            return [];
          const orderedNodes = Array.from(collectionEl.querySelectorAll(`[${COLLECTION_ITEM_SIGN}]`));
          const items = [...itemMap.values()];
          return items.sort((a2, b2) => orderedNodes.indexOf(a2.ref) - orderedNodes.indexOf(b2.ref));
        };
        vue.provide(COLLECTION_INJECTION_KEY, {
          itemMap,
          getItems,
          collectionRef
        });
      }
    };
    const ElCollectionItem = {
      ...CollectionItem,
      name: COLLECTION_ITEM_NAME,
      setup(_2, { attrs }) {
        const collectionItemRef = vue.ref(null);
        const collectionInjection = vue.inject(COLLECTION_INJECTION_KEY, void 0);
        vue.provide(COLLECTION_ITEM_INJECTION_KEY, {
          collectionItemRef
        });
        vue.onMounted(() => {
          const collectionItemEl = vue.unref(collectionItemRef);
          if (collectionItemEl) {
            collectionInjection.itemMap.set(collectionItemEl, {
              ref: collectionItemEl,
              ...attrs
            });
          }
        });
        vue.onBeforeUnmount(() => {
          const collectionItemEl = vue.unref(collectionItemRef);
          collectionInjection.itemMap.delete(collectionItemEl);
        });
      }
    };
    return {
      COLLECTION_INJECTION_KEY,
      COLLECTION_ITEM_INJECTION_KEY,
      ElCollection,
      ElCollectionItem
    };
  };
  const dropdownProps = buildProps({
    trigger: useTooltipTriggerProps.trigger,
    effect: {
      ...useTooltipContentProps.effect,
      default: "light"
    },
    type: {
      type: definePropType(String)
    },
    placement: {
      type: definePropType(String),
      default: "bottom"
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    id: String,
    size: {
      type: String,
      default: ""
    },
    splitButton: Boolean,
    hideOnClick: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    showTimeout: {
      type: Number,
      default: 150
    },
    hideTimeout: {
      type: Number,
      default: 150
    },
    tabindex: {
      type: definePropType([Number, String]),
      default: 0
    },
    maxHeight: {
      type: definePropType([Number, String]),
      default: ""
    },
    popperClass: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: "menu"
    },
    buttonProps: {
      type: definePropType(Object)
    },
    teleported: useTooltipContentProps.teleported
  });
  buildProps({
    command: {
      type: [Object, String, Number],
      default: () => ({})
    },
    disabled: Boolean,
    divided: Boolean,
    textValue: String,
    icon: {
      type: iconPropType
    }
  });
  buildProps({
    onKeydown: { type: definePropType(Function) }
  });
  [
    EVENT_CODE.down,
    EVENT_CODE.pageDown,
    EVENT_CODE.home
  ];
  [EVENT_CODE.up, EVENT_CODE.pageUp, EVENT_CODE.end];
  createCollectionWithScope("Dropdown");
  const popoverProps = buildProps({
    trigger: useTooltipTriggerProps.trigger,
    placement: dropdownProps.placement,
    disabled: useTooltipTriggerProps.disabled,
    visible: useTooltipContentProps.visible,
    transition: useTooltipContentProps.transition,
    popperOptions: dropdownProps.popperOptions,
    tabindex: dropdownProps.tabindex,
    content: useTooltipContentProps.content,
    popperStyle: useTooltipContentProps.popperStyle,
    popperClass: useTooltipContentProps.popperClass,
    enterable: {
      ...useTooltipContentProps.enterable,
      default: true
    },
    effect: {
      ...useTooltipContentProps.effect,
      default: "light"
    },
    teleported: useTooltipContentProps.teleported,
    title: String,
    width: {
      type: [String, Number],
      default: 150
    },
    offset: {
      type: Number,
      default: void 0
    },
    showAfter: {
      type: Number,
      default: 0
    },
    hideAfter: {
      type: Number,
      default: 200
    },
    autoClose: {
      type: Number,
      default: 0
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    persistent: {
      type: Boolean,
      default: true
    },
    "onUpdate:visible": {
      type: Function
    }
  });
  const popoverEmits = {
    "update:visible": (value) => isBoolean(value),
    "before-enter": () => true,
    "before-leave": () => true,
    "after-enter": () => true,
    "after-leave": () => true
  };
  const updateEventKeyRaw = `onUpdate:visible`;
  const __default__$1 = vue.defineComponent({
    name: "ElPopover"
  });
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: popoverProps,
    emits: popoverEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const onUpdateVisible = vue.computed(() => {
        return props[updateEventKeyRaw];
      });
      const ns = useNamespace("popover");
      const tooltipRef = vue.ref();
      const popperRef = vue.computed(() => {
        var _a2;
        return (_a2 = vue.unref(tooltipRef)) == null ? void 0 : _a2.popperRef;
      });
      const style2 = vue.computed(() => {
        return [
          {
            width: addUnit(props.width)
          },
          props.popperStyle
        ];
      });
      const kls = vue.computed(() => {
        return [ns.b(), props.popperClass, { [ns.m("plain")]: !!props.content }];
      });
      const gpuAcceleration = vue.computed(() => {
        return props.transition === `${ns.namespace.value}-fade-in-linear`;
      });
      const hide = () => {
        var _a2;
        (_a2 = tooltipRef.value) == null ? void 0 : _a2.hide();
      };
      const beforeEnter = () => {
        emit("before-enter");
      };
      const beforeLeave = () => {
        emit("before-leave");
      };
      const afterEnter = () => {
        emit("after-enter");
      };
      const afterLeave = () => {
        emit("update:visible", false);
        emit("after-leave");
      };
      expose({
        popperRef,
        hide
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElTooltip), vue.mergeProps({
          ref_key: "tooltipRef",
          ref: tooltipRef
        }, _ctx.$attrs, {
          trigger: _ctx.trigger,
          placement: _ctx.placement,
          disabled: _ctx.disabled,
          visible: _ctx.visible,
          transition: _ctx.transition,
          "popper-options": _ctx.popperOptions,
          tabindex: _ctx.tabindex,
          content: _ctx.content,
          offset: _ctx.offset,
          "show-after": _ctx.showAfter,
          "hide-after": _ctx.hideAfter,
          "auto-close": _ctx.autoClose,
          "show-arrow": _ctx.showArrow,
          "aria-label": _ctx.title,
          effect: _ctx.effect,
          enterable: _ctx.enterable,
          "popper-class": vue.unref(kls),
          "popper-style": vue.unref(style2),
          teleported: _ctx.teleported,
          persistent: _ctx.persistent,
          "gpu-acceleration": vue.unref(gpuAcceleration),
          "onUpdate:visible": vue.unref(onUpdateVisible),
          onBeforeShow: beforeEnter,
          onBeforeHide: beforeLeave,
          onShow: afterEnter,
          onHide: afterLeave
        }), {
          content: vue.withCtx(() => [
            _ctx.title ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(vue.unref(ns).e("title")),
              role: "title"
            }, vue.toDisplayString(_ctx.title), 3)) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.content), 1)
            ])
          ]),
          default: vue.withCtx(() => [
            _ctx.$slots.reference ? vue.renderSlot(_ctx.$slots, "reference", { key: 0 }) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 16, ["trigger", "placement", "disabled", "visible", "transition", "popper-options", "tabindex", "content", "offset", "show-after", "hide-after", "auto-close", "show-arrow", "aria-label", "effect", "enterable", "popper-class", "popper-style", "teleported", "persistent", "gpu-acceleration", "onUpdate:visible"]);
      };
    }
  });
  var Popover = /* @__PURE__ */ _export_sfc$1(_sfc_main$4, [["__file", "popover.vue"]]);
  const attachEvents = (el, binding) => {
    const popperComponent = binding.arg || binding.value;
    const popover = popperComponent == null ? void 0 : popperComponent.popperRef;
    if (popover) {
      popover.triggerRef = el;
    }
  };
  var PopoverDirective = {
    mounted(el, binding) {
      attachEvents(el, binding);
    },
    updated(el, binding) {
      attachEvents(el, binding);
    }
  };
  const VPopover = "popover";
  const ElPopoverDirective = withInstallDirective(PopoverDirective, VPopover);
  const ElPopover = withInstall(Popover, {
    directive: ElPopoverDirective
  });
  const getCell = function(event) {
    var _a2;
    return (_a2 = event.target) == null ? void 0 : _a2.closest("td");
  };
  const orderBy = function(array, sortKey, reverse, sortMethod, sortBy) {
    if (!sortKey && !sortMethod && (!sortBy || Array.isArray(sortBy) && !sortBy.length)) {
      return array;
    }
    if (typeof reverse === "string") {
      reverse = reverse === "descending" ? -1 : 1;
    } else {
      reverse = reverse && reverse < 0 ? -1 : 1;
    }
    const getKey = sortMethod ? null : function(value, index) {
      if (sortBy) {
        if (!Array.isArray(sortBy)) {
          sortBy = [sortBy];
        }
        return sortBy.map((by) => {
          if (typeof by === "string") {
            return get(value, by);
          } else {
            return by(value, index, array);
          }
        });
      }
      if (sortKey !== "$key") {
        if (isObject$1(value) && "$value" in value)
          value = value.$value;
      }
      return [isObject$1(value) ? get(value, sortKey) : value];
    };
    const compare = function(a2, b2) {
      if (sortMethod) {
        return sortMethod(a2.value, b2.value);
      }
      for (let i = 0, len = a2.key.length; i < len; i++) {
        if (a2.key[i] < b2.key[i]) {
          return -1;
        }
        if (a2.key[i] > b2.key[i]) {
          return 1;
        }
      }
      return 0;
    };
    return array.map((value, index) => {
      return {
        value,
        index,
        key: getKey ? getKey(value, index) : null
      };
    }).sort((a2, b2) => {
      let order = compare(a2, b2);
      if (!order) {
        order = a2.index - b2.index;
      }
      return order * +reverse;
    }).map((item) => item.value);
  };
  const getColumnById = function(table, columnId) {
    let column = null;
    table.columns.forEach((item) => {
      if (item.id === columnId) {
        column = item;
      }
    });
    return column;
  };
  const getColumnByKey = function(table, columnKey) {
    let column = null;
    for (let i = 0; i < table.columns.length; i++) {
      const item = table.columns[i];
      if (item.columnKey === columnKey) {
        column = item;
        break;
      }
    }
    if (!column)
      throwError("ElTable", `No column matching with column-key: ${columnKey}`);
    return column;
  };
  const getColumnByCell = function(table, cell, namespace) {
    const matches = (cell.className || "").match(new RegExp(`${namespace}-table_[^\\s]+`, "gm"));
    if (matches) {
      return getColumnById(table, matches[0]);
    }
    return null;
  };
  const getRowIdentity = (row, rowKey) => {
    if (!row)
      throw new Error("Row is required when get row identity");
    if (typeof rowKey === "string") {
      if (!rowKey.includes(".")) {
        return `${row[rowKey]}`;
      }
      const key = rowKey.split(".");
      let current = row;
      for (const element of key) {
        current = current[element];
      }
      return `${current}`;
    } else if (typeof rowKey === "function") {
      return rowKey.call(null, row);
    }
  };
  const getKeysMap = function(array, rowKey) {
    const arrayMap2 = {};
    (array || []).forEach((row, index) => {
      arrayMap2[getRowIdentity(row, rowKey)] = { row, index };
    });
    return arrayMap2;
  };
  function mergeOptions(defaults, config) {
    const options = {};
    let key;
    for (key in defaults) {
      options[key] = defaults[key];
    }
    for (key in config) {
      if (hasOwn(config, key)) {
        const value = config[key];
        if (typeof value !== "undefined") {
          options[key] = value;
        }
      }
    }
    return options;
  }
  function parseWidth(width) {
    if (width === "")
      return width;
    if (width !== void 0) {
      width = Number.parseInt(width, 10);
      if (Number.isNaN(width)) {
        width = "";
      }
    }
    return width;
  }
  function parseMinWidth(minWidth) {
    if (minWidth === "")
      return minWidth;
    if (minWidth !== void 0) {
      minWidth = parseWidth(minWidth);
      if (Number.isNaN(minWidth)) {
        minWidth = 80;
      }
    }
    return minWidth;
  }
  function parseHeight(height) {
    if (typeof height === "number") {
      return height;
    }
    if (typeof height === "string") {
      if (/^\d+(?:px)?$/.test(height)) {
        return Number.parseInt(height, 10);
      } else {
        return height;
      }
    }
    return null;
  }
  function compose(...funcs) {
    if (funcs.length === 0) {
      return (arg) => arg;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce((a2, b2) => (...args) => a2(b2(...args)));
  }
  function toggleRowStatus(statusArr, row, newVal) {
    let changed = false;
    const index = statusArr.indexOf(row);
    const included = index !== -1;
    const toggleStatus = (type) => {
      if (type === "add") {
        statusArr.push(row);
      } else {
        statusArr.splice(index, 1);
      }
      changed = true;
      if (isArray$2(row.children)) {
        row.children.forEach((item) => {
          toggleRowStatus(statusArr, item, newVal != null ? newVal : !included);
        });
      }
    };
    if (isBoolean(newVal)) {
      if (newVal && !included) {
        toggleStatus("add");
      } else if (!newVal && included) {
        toggleStatus("remove");
      }
    } else {
      included ? toggleStatus("remove") : toggleStatus("add");
    }
    return changed;
  }
  function walkTreeNode(root2, cb, childrenKey = "children", lazyKey = "hasChildren") {
    const isNil2 = (array) => !(Array.isArray(array) && array.length);
    function _walker(parent, children, level) {
      cb(parent, children, level);
      children.forEach((item) => {
        if (item[lazyKey]) {
          cb(item, null, level + 1);
          return;
        }
        const children2 = item[childrenKey];
        if (!isNil2(children2)) {
          _walker(item, children2, level + 1);
        }
      });
    }
    root2.forEach((item) => {
      if (item[lazyKey]) {
        cb(item, null, 0);
        return;
      }
      const children = item[childrenKey];
      if (!isNil2(children)) {
        _walker(item, children, 0);
      }
    });
  }
  let removePopper = null;
  function createTablePopper(props, popperContent, trigger, table) {
    if ((removePopper == null ? void 0 : removePopper.trigger) === trigger) {
      return;
    }
    removePopper == null ? void 0 : removePopper();
    const parentNode = table == null ? void 0 : table.refs.tableWrapper;
    const ns = parentNode == null ? void 0 : parentNode.dataset.prefix;
    const popperOptions = {
      strategy: "fixed",
      ...props.popperOptions
    };
    const vm = vue.createVNode(ElTooltip, {
      content: popperContent,
      virtualTriggering: true,
      virtualRef: trigger,
      appendTo: parentNode,
      placement: "top",
      transition: "none",
      offset: 0,
      hideAfter: 0,
      ...props,
      popperOptions,
      onHide: () => {
        removePopper == null ? void 0 : removePopper();
      }
    });
    vm.appContext = { ...table.appContext, ...table };
    const container = document.createElement("div");
    vue.render(vm, container);
    vm.component.exposed.onOpen();
    const scrollContainer = parentNode == null ? void 0 : parentNode.querySelector(`.${ns}-scrollbar__wrap`);
    removePopper = () => {
      vue.render(null, container);
      scrollContainer == null ? void 0 : scrollContainer.removeEventListener("scroll", removePopper);
      removePopper = null;
    };
    removePopper.trigger = trigger;
    scrollContainer == null ? void 0 : scrollContainer.addEventListener("scroll", removePopper);
  }
  function getCurrentColumns(column) {
    if (column.children) {
      return flatMap(column.children, getCurrentColumns);
    } else {
      return [column];
    }
  }
  function getColSpan(colSpan, column) {
    return colSpan + column.colSpan;
  }
  const isFixedColumn = (index, fixed, store, realColumns) => {
    let start = 0;
    let after = index;
    const columns = store.states.columns.value;
    if (realColumns) {
      const curColumns = getCurrentColumns(realColumns[index]);
      const preColumns = columns.slice(0, columns.indexOf(curColumns[0]));
      start = preColumns.reduce(getColSpan, 0);
      after = start + curColumns.reduce(getColSpan, 0) - 1;
    } else {
      start = index;
    }
    let fixedLayout;
    switch (fixed) {
      case "left":
        if (after < store.states.fixedLeafColumnsLength.value) {
          fixedLayout = "left";
        }
        break;
      case "right":
        if (start >= columns.length - store.states.rightFixedLeafColumnsLength.value) {
          fixedLayout = "right";
        }
        break;
      default:
        if (after < store.states.fixedLeafColumnsLength.value) {
          fixedLayout = "left";
        } else if (start >= columns.length - store.states.rightFixedLeafColumnsLength.value) {
          fixedLayout = "right";
        }
    }
    return fixedLayout ? {
      direction: fixedLayout,
      start,
      after
    } : {};
  };
  const getFixedColumnsClass = (namespace, index, fixed, store, realColumns, offset = 0) => {
    const classes = [];
    const { direction, start, after } = isFixedColumn(index, fixed, store, realColumns);
    if (direction) {
      const isLeft = direction === "left";
      classes.push(`${namespace}-fixed-column--${direction}`);
      if (isLeft && after + offset === store.states.fixedLeafColumnsLength.value - 1) {
        classes.push("is-last-column");
      } else if (!isLeft && start - offset === store.states.columns.value.length - store.states.rightFixedLeafColumnsLength.value) {
        classes.push("is-first-column");
      }
    }
    return classes;
  };
  function getOffset(offset, column) {
    return offset + (column.realWidth === null || Number.isNaN(column.realWidth) ? Number(column.width) : column.realWidth);
  }
  const getFixedColumnOffset = (index, fixed, store, realColumns) => {
    const {
      direction,
      start = 0,
      after = 0
    } = isFixedColumn(index, fixed, store, realColumns);
    if (!direction) {
      return;
    }
    const styles = {};
    const isLeft = direction === "left";
    const columns = store.states.columns.value;
    if (isLeft) {
      styles.left = columns.slice(0, start).reduce(getOffset, 0);
    } else {
      styles.right = columns.slice(after + 1).reverse().reduce(getOffset, 0);
    }
    return styles;
  };
  const ensurePosition = (style2, key) => {
    if (!style2)
      return;
    if (!Number.isNaN(style2[key])) {
      style2[key] = `${style2[key]}px`;
    }
  };
  function useExpand(watcherData) {
    const instance = vue.getCurrentInstance();
    const defaultExpandAll = vue.ref(false);
    const expandRows = vue.ref([]);
    const updateExpandRows = () => {
      const data = watcherData.data.value || [];
      const rowKey = watcherData.rowKey.value;
      if (defaultExpandAll.value) {
        expandRows.value = data.slice();
      } else if (rowKey) {
        const expandRowsMap = getKeysMap(expandRows.value, rowKey);
        expandRows.value = data.reduce((prev, row) => {
          const rowId = getRowIdentity(row, rowKey);
          const rowInfo = expandRowsMap[rowId];
          if (rowInfo) {
            prev.push(row);
          }
          return prev;
        }, []);
      } else {
        expandRows.value = [];
      }
    };
    const toggleRowExpansion = (row, expanded) => {
      const changed = toggleRowStatus(expandRows.value, row, expanded);
      if (changed) {
        instance.emit("expand-change", row, expandRows.value.slice());
      }
    };
    const setExpandRowKeys = (rowKeys) => {
      instance.store.assertRowKey();
      const data = watcherData.data.value || [];
      const rowKey = watcherData.rowKey.value;
      const keysMap = getKeysMap(data, rowKey);
      expandRows.value = rowKeys.reduce((prev, cur) => {
        const info = keysMap[cur];
        if (info) {
          prev.push(info.row);
        }
        return prev;
      }, []);
    };
    const isRowExpanded = (row) => {
      const rowKey = watcherData.rowKey.value;
      if (rowKey) {
        const expandMap = getKeysMap(expandRows.value, rowKey);
        return !!expandMap[getRowIdentity(row, rowKey)];
      }
      return expandRows.value.includes(row);
    };
    return {
      updateExpandRows,
      toggleRowExpansion,
      setExpandRowKeys,
      isRowExpanded,
      states: {
        expandRows,
        defaultExpandAll
      }
    };
  }
  function useCurrent(watcherData) {
    const instance = vue.getCurrentInstance();
    const _currentRowKey = vue.ref(null);
    const currentRow = vue.ref(null);
    const setCurrentRowKey = (key) => {
      instance.store.assertRowKey();
      _currentRowKey.value = key;
      setCurrentRowByKey(key);
    };
    const restoreCurrentRowKey = () => {
      _currentRowKey.value = null;
    };
    const setCurrentRowByKey = (key) => {
      const { data, rowKey } = watcherData;
      let _currentRow = null;
      if (rowKey.value) {
        _currentRow = (vue.unref(data) || []).find((item) => getRowIdentity(item, rowKey.value) === key);
      }
      currentRow.value = _currentRow;
      instance.emit("current-change", currentRow.value, null);
    };
    const updateCurrentRow = (_currentRow) => {
      const oldCurrentRow = currentRow.value;
      if (_currentRow && _currentRow !== oldCurrentRow) {
        currentRow.value = _currentRow;
        instance.emit("current-change", currentRow.value, oldCurrentRow);
        return;
      }
      if (!_currentRow && oldCurrentRow) {
        currentRow.value = null;
        instance.emit("current-change", null, oldCurrentRow);
      }
    };
    const updateCurrentRowData = () => {
      const rowKey = watcherData.rowKey.value;
      const data = watcherData.data.value || [];
      const oldCurrentRow = currentRow.value;
      if (!data.includes(oldCurrentRow) && oldCurrentRow) {
        if (rowKey) {
          const currentRowKey = getRowIdentity(oldCurrentRow, rowKey);
          setCurrentRowByKey(currentRowKey);
        } else {
          currentRow.value = null;
        }
        if (currentRow.value === null) {
          instance.emit("current-change", null, oldCurrentRow);
        }
      } else if (_currentRowKey.value) {
        setCurrentRowByKey(_currentRowKey.value);
        restoreCurrentRowKey();
      }
    };
    return {
      setCurrentRowKey,
      restoreCurrentRowKey,
      setCurrentRowByKey,
      updateCurrentRow,
      updateCurrentRowData,
      states: {
        _currentRowKey,
        currentRow
      }
    };
  }
  function useTree(watcherData) {
    const expandRowKeys = vue.ref([]);
    const treeData = vue.ref({});
    const indent = vue.ref(16);
    const lazy = vue.ref(false);
    const lazyTreeNodeMap = vue.ref({});
    const lazyColumnIdentifier = vue.ref("hasChildren");
    const childrenColumnName = vue.ref("children");
    const instance = vue.getCurrentInstance();
    const normalizedData = vue.computed(() => {
      if (!watcherData.rowKey.value)
        return {};
      const data = watcherData.data.value || [];
      return normalize(data);
    });
    const normalizedLazyNode = vue.computed(() => {
      const rowKey = watcherData.rowKey.value;
      const keys2 = Object.keys(lazyTreeNodeMap.value);
      const res = {};
      if (!keys2.length)
        return res;
      keys2.forEach((key) => {
        if (lazyTreeNodeMap.value[key].length) {
          const item = { children: [] };
          lazyTreeNodeMap.value[key].forEach((row) => {
            const currentRowKey = getRowIdentity(row, rowKey);
            item.children.push(currentRowKey);
            if (row[lazyColumnIdentifier.value] && !res[currentRowKey]) {
              res[currentRowKey] = { children: [] };
            }
          });
          res[key] = item;
        }
      });
      return res;
    });
    const normalize = (data) => {
      const rowKey = watcherData.rowKey.value;
      const res = {};
      walkTreeNode(data, (parent, children, level) => {
        const parentId = getRowIdentity(parent, rowKey);
        if (Array.isArray(children)) {
          res[parentId] = {
            children: children.map((row) => getRowIdentity(row, rowKey)),
            level
          };
        } else if (lazy.value) {
          res[parentId] = {
            children: [],
            lazy: true,
            level
          };
        }
      }, childrenColumnName.value, lazyColumnIdentifier.value);
      return res;
    };
    const updateTreeData = (ifChangeExpandRowKeys = false, ifExpandAll = ((_a2) => (_a2 = instance.store) == null ? void 0 : _a2.states.defaultExpandAll.value)()) => {
      var _a2;
      const nested = normalizedData.value;
      const normalizedLazyNode_ = normalizedLazyNode.value;
      const keys2 = Object.keys(nested);
      const newTreeData = {};
      if (keys2.length) {
        const oldTreeData = vue.unref(treeData);
        const rootLazyRowKeys = [];
        const getExpanded = (oldValue, key) => {
          if (ifChangeExpandRowKeys) {
            if (expandRowKeys.value) {
              return ifExpandAll || expandRowKeys.value.includes(key);
            } else {
              return !!(ifExpandAll || (oldValue == null ? void 0 : oldValue.expanded));
            }
          } else {
            const included = ifExpandAll || expandRowKeys.value && expandRowKeys.value.includes(key);
            return !!((oldValue == null ? void 0 : oldValue.expanded) || included);
          }
        };
        keys2.forEach((key) => {
          const oldValue = oldTreeData[key];
          const newValue = { ...nested[key] };
          newValue.expanded = getExpanded(oldValue, key);
          if (newValue.lazy) {
            const { loaded = false, loading = false } = oldValue || {};
            newValue.loaded = !!loaded;
            newValue.loading = !!loading;
            rootLazyRowKeys.push(key);
          }
          newTreeData[key] = newValue;
        });
        const lazyKeys = Object.keys(normalizedLazyNode_);
        if (lazy.value && lazyKeys.length && rootLazyRowKeys.length) {
          lazyKeys.forEach((key) => {
            const oldValue = oldTreeData[key];
            const lazyNodeChildren = normalizedLazyNode_[key].children;
            if (rootLazyRowKeys.includes(key)) {
              if (newTreeData[key].children.length !== 0) {
                throw new Error("[ElTable]children must be an empty array.");
              }
              newTreeData[key].children = lazyNodeChildren;
            } else {
              const { loaded = false, loading = false } = oldValue || {};
              newTreeData[key] = {
                lazy: true,
                loaded: !!loaded,
                loading: !!loading,
                expanded: getExpanded(oldValue, key),
                children: lazyNodeChildren,
                level: ""
              };
            }
          });
        }
      }
      treeData.value = newTreeData;
      (_a2 = instance.store) == null ? void 0 : _a2.updateTableScrollY();
    };
    vue.watch(() => expandRowKeys.value, () => {
      updateTreeData(true);
    });
    vue.watch(() => normalizedData.value, () => {
      updateTreeData();
    });
    vue.watch(() => normalizedLazyNode.value, () => {
      updateTreeData();
    });
    const updateTreeExpandKeys = (value) => {
      expandRowKeys.value = value;
      updateTreeData();
    };
    const toggleTreeExpansion = (row, expanded) => {
      instance.store.assertRowKey();
      const rowKey = watcherData.rowKey.value;
      const id = getRowIdentity(row, rowKey);
      const data = id && treeData.value[id];
      if (id && data && "expanded" in data) {
        const oldExpanded = data.expanded;
        expanded = typeof expanded === "undefined" ? !data.expanded : expanded;
        treeData.value[id].expanded = expanded;
        if (oldExpanded !== expanded) {
          instance.emit("expand-change", row, expanded);
        }
        instance.store.updateTableScrollY();
      }
    };
    const loadOrToggle = (row) => {
      instance.store.assertRowKey();
      const rowKey = watcherData.rowKey.value;
      const id = getRowIdentity(row, rowKey);
      const data = treeData.value[id];
      if (lazy.value && data && "loaded" in data && !data.loaded) {
        loadData(row, id, data);
      } else {
        toggleTreeExpansion(row, void 0);
      }
    };
    const loadData = (row, key, treeNode) => {
      const { load } = instance.props;
      if (load && !treeData.value[key].loaded) {
        treeData.value[key].loading = true;
        load(row, treeNode, (data) => {
          if (!Array.isArray(data)) {
            throw new TypeError("[ElTable] data must be an array");
          }
          treeData.value[key].loading = false;
          treeData.value[key].loaded = true;
          treeData.value[key].expanded = true;
          if (data.length) {
            lazyTreeNodeMap.value[key] = data;
          }
          instance.emit("expand-change", row, true);
        });
      }
    };
    return {
      loadData,
      loadOrToggle,
      toggleTreeExpansion,
      updateTreeExpandKeys,
      updateTreeData,
      normalize,
      states: {
        expandRowKeys,
        treeData,
        indent,
        lazy,
        lazyTreeNodeMap,
        lazyColumnIdentifier,
        childrenColumnName
      }
    };
  }
  const sortData = (data, states) => {
    const sortingColumn = states.sortingColumn;
    if (!sortingColumn || typeof sortingColumn.sortable === "string") {
      return data;
    }
    return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod, sortingColumn.sortBy);
  };
  const doFlattenColumns = (columns) => {
    const result = [];
    columns.forEach((column) => {
      if (column.children && column.children.length > 0) {
        result.push.apply(result, doFlattenColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  };
  function useWatcher$1() {
    var _a2;
    const instance = vue.getCurrentInstance();
    const { size: tableSize } = vue.toRefs((_a2 = instance.proxy) == null ? void 0 : _a2.$props);
    const rowKey = vue.ref(null);
    const data = vue.ref([]);
    const _data = vue.ref([]);
    const isComplex = vue.ref(false);
    const _columns = vue.ref([]);
    const originColumns = vue.ref([]);
    const columns = vue.ref([]);
    const fixedColumns = vue.ref([]);
    const rightFixedColumns = vue.ref([]);
    const leafColumns = vue.ref([]);
    const fixedLeafColumns = vue.ref([]);
    const rightFixedLeafColumns = vue.ref([]);
    const updateOrderFns = [];
    const leafColumnsLength = vue.ref(0);
    const fixedLeafColumnsLength = vue.ref(0);
    const rightFixedLeafColumnsLength = vue.ref(0);
    const isAllSelected = vue.ref(false);
    const selection = vue.ref([]);
    const reserveSelection = vue.ref(false);
    const selectOnIndeterminate = vue.ref(false);
    const selectable = vue.ref(null);
    const filters = vue.ref({});
    const filteredData = vue.ref(null);
    const sortingColumn = vue.ref(null);
    const sortProp = vue.ref(null);
    const sortOrder = vue.ref(null);
    const hoverRow = vue.ref(null);
    vue.watch(data, () => instance.state && scheduleLayout(false), {
      deep: true
    });
    const assertRowKey = () => {
      if (!rowKey.value)
        throw new Error("[ElTable] prop row-key is required");
    };
    const updateChildFixed = (column) => {
      var _a22;
      (_a22 = column.children) == null ? void 0 : _a22.forEach((childColumn) => {
        childColumn.fixed = column.fixed;
        updateChildFixed(childColumn);
      });
    };
    const updateColumns = () => {
      _columns.value.forEach((column) => {
        updateChildFixed(column);
      });
      fixedColumns.value = _columns.value.filter((column) => column.fixed === true || column.fixed === "left");
      rightFixedColumns.value = _columns.value.filter((column) => column.fixed === "right");
      if (fixedColumns.value.length > 0 && _columns.value[0] && _columns.value[0].type === "selection" && !_columns.value[0].fixed) {
        _columns.value[0].fixed = true;
        fixedColumns.value.unshift(_columns.value[0]);
      }
      const notFixedColumns = _columns.value.filter((column) => !column.fixed);
      originColumns.value = [].concat(fixedColumns.value).concat(notFixedColumns).concat(rightFixedColumns.value);
      const leafColumns2 = doFlattenColumns(notFixedColumns);
      const fixedLeafColumns2 = doFlattenColumns(fixedColumns.value);
      const rightFixedLeafColumns2 = doFlattenColumns(rightFixedColumns.value);
      leafColumnsLength.value = leafColumns2.length;
      fixedLeafColumnsLength.value = fixedLeafColumns2.length;
      rightFixedLeafColumnsLength.value = rightFixedLeafColumns2.length;
      columns.value = [].concat(fixedLeafColumns2).concat(leafColumns2).concat(rightFixedLeafColumns2);
      isComplex.value = fixedColumns.value.length > 0 || rightFixedColumns.value.length > 0;
    };
    const scheduleLayout = (needUpdateColumns, immediate = false) => {
      if (needUpdateColumns) {
        updateColumns();
      }
      if (immediate) {
        instance.state.doLayout();
      } else {
        instance.state.debouncedUpdateLayout();
      }
    };
    const isSelected = (row) => {
      return selection.value.includes(row);
    };
    const clearSelection = () => {
      isAllSelected.value = false;
      const oldSelection = selection.value;
      selection.value = [];
      if (oldSelection.length) {
        instance.emit("selection-change", []);
      }
    };
    const cleanSelection = () => {
      let deleted;
      if (rowKey.value) {
        deleted = [];
        const selectedMap = getKeysMap(selection.value, rowKey.value);
        const dataMap = getKeysMap(data.value, rowKey.value);
        for (const key in selectedMap) {
          if (hasOwn(selectedMap, key) && !dataMap[key]) {
            deleted.push(selectedMap[key].row);
          }
        }
      } else {
        deleted = selection.value.filter((item) => !data.value.includes(item));
      }
      if (deleted.length) {
        const newSelection = selection.value.filter((item) => !deleted.includes(item));
        selection.value = newSelection;
        instance.emit("selection-change", newSelection.slice());
      }
    };
    const getSelectionRows = () => {
      return (selection.value || []).slice();
    };
    const toggleRowSelection = (row, selected = void 0, emitChange = true) => {
      const changed = toggleRowStatus(selection.value, row, selected);
      if (changed) {
        const newSelection = (selection.value || []).slice();
        if (emitChange) {
          instance.emit("select", newSelection, row);
        }
        instance.emit("selection-change", newSelection);
      }
    };
    const _toggleAllSelection = () => {
      var _a22, _b;
      const value = selectOnIndeterminate.value ? !isAllSelected.value : !(isAllSelected.value || selection.value.length);
      isAllSelected.value = value;
      let selectionChanged = false;
      let childrenCount = 0;
      const rowKey2 = (_b = (_a22 = instance == null ? void 0 : instance.store) == null ? void 0 : _a22.states) == null ? void 0 : _b.rowKey.value;
      data.value.forEach((row, index) => {
        const rowIndex = index + childrenCount;
        if (selectable.value) {
          if (selectable.value.call(null, row, rowIndex) && toggleRowStatus(selection.value, row, value)) {
            selectionChanged = true;
          }
        } else {
          if (toggleRowStatus(selection.value, row, value)) {
            selectionChanged = true;
          }
        }
        childrenCount += getChildrenCount(getRowIdentity(row, rowKey2));
      });
      if (selectionChanged) {
        instance.emit("selection-change", selection.value ? selection.value.slice() : []);
      }
      instance.emit("select-all", (selection.value || []).slice());
    };
    const updateSelectionByRowKey = () => {
      const selectedMap = getKeysMap(selection.value, rowKey.value);
      data.value.forEach((row) => {
        const rowId = getRowIdentity(row, rowKey.value);
        const rowInfo = selectedMap[rowId];
        if (rowInfo) {
          selection.value[rowInfo.index] = row;
        }
      });
    };
    const updateAllSelected = () => {
      var _a22, _b, _c;
      if (((_a22 = data.value) == null ? void 0 : _a22.length) === 0) {
        isAllSelected.value = false;
        return;
      }
      let selectedMap;
      if (rowKey.value) {
        selectedMap = getKeysMap(selection.value, rowKey.value);
      }
      const isSelected2 = function(row) {
        if (selectedMap) {
          return !!selectedMap[getRowIdentity(row, rowKey.value)];
        } else {
          return selection.value.includes(row);
        }
      };
      let isAllSelected_ = true;
      let selectedCount = 0;
      let childrenCount = 0;
      for (let i = 0, j = (data.value || []).length; i < j; i++) {
        const keyProp = (_c = (_b = instance == null ? void 0 : instance.store) == null ? void 0 : _b.states) == null ? void 0 : _c.rowKey.value;
        const rowIndex = i + childrenCount;
        const item = data.value[i];
        const isRowSelectable = selectable.value && selectable.value.call(null, item, rowIndex);
        if (!isSelected2(item)) {
          if (!selectable.value || isRowSelectable) {
            isAllSelected_ = false;
            break;
          }
        } else {
          selectedCount++;
        }
        childrenCount += getChildrenCount(getRowIdentity(item, keyProp));
      }
      if (selectedCount === 0)
        isAllSelected_ = false;
      isAllSelected.value = isAllSelected_;
    };
    const getChildrenCount = (rowKey2) => {
      var _a22;
      if (!instance || !instance.store)
        return 0;
      const { treeData } = instance.store.states;
      let count = 0;
      const children = (_a22 = treeData.value[rowKey2]) == null ? void 0 : _a22.children;
      if (children) {
        count += children.length;
        children.forEach((childKey) => {
          count += getChildrenCount(childKey);
        });
      }
      return count;
    };
    const updateFilters = (columns2, values) => {
      if (!Array.isArray(columns2)) {
        columns2 = [columns2];
      }
      const filters_ = {};
      columns2.forEach((col) => {
        filters.value[col.id] = values;
        filters_[col.columnKey || col.id] = values;
      });
      return filters_;
    };
    const updateSort = (column, prop, order) => {
      if (sortingColumn.value && sortingColumn.value !== column) {
        sortingColumn.value.order = null;
      }
      sortingColumn.value = column;
      sortProp.value = prop;
      sortOrder.value = order;
    };
    const execFilter = () => {
      let sourceData = vue.unref(_data);
      Object.keys(filters.value).forEach((columnId) => {
        const values = filters.value[columnId];
        if (!values || values.length === 0)
          return;
        const column = getColumnById({
          columns: columns.value
        }, columnId);
        if (column && column.filterMethod) {
          sourceData = sourceData.filter((row) => {
            return values.some((value) => column.filterMethod.call(null, value, row, column));
          });
        }
      });
      filteredData.value = sourceData;
    };
    const execSort = () => {
      data.value = sortData(filteredData.value, {
        sortingColumn: sortingColumn.value,
        sortProp: sortProp.value,
        sortOrder: sortOrder.value
      });
    };
    const execQuery = (ignore = void 0) => {
      if (!(ignore && ignore.filter)) {
        execFilter();
      }
      execSort();
    };
    const clearFilter = (columnKeys) => {
      const { tableHeaderRef } = instance.refs;
      if (!tableHeaderRef)
        return;
      const panels = Object.assign({}, tableHeaderRef.filterPanels);
      const keys2 = Object.keys(panels);
      if (!keys2.length)
        return;
      if (typeof columnKeys === "string") {
        columnKeys = [columnKeys];
      }
      if (Array.isArray(columnKeys)) {
        const columns_ = columnKeys.map((key) => getColumnByKey({
          columns: columns.value
        }, key));
        keys2.forEach((key) => {
          const column = columns_.find((col) => col.id === key);
          if (column) {
            column.filteredValue = [];
          }
        });
        instance.store.commit("filterChange", {
          column: columns_,
          values: [],
          silent: true,
          multi: true
        });
      } else {
        keys2.forEach((key) => {
          const column = columns.value.find((col) => col.id === key);
          if (column) {
            column.filteredValue = [];
          }
        });
        filters.value = {};
        instance.store.commit("filterChange", {
          column: {},
          values: [],
          silent: true
        });
      }
    };
    const clearSort = () => {
      if (!sortingColumn.value)
        return;
      updateSort(null, null, null);
      instance.store.commit("changeSortCondition", {
        silent: true
      });
    };
    const {
      setExpandRowKeys,
      toggleRowExpansion,
      updateExpandRows,
      states: expandStates,
      isRowExpanded
    } = useExpand({
      data,
      rowKey
    });
    const {
      updateTreeExpandKeys,
      toggleTreeExpansion,
      updateTreeData,
      loadOrToggle,
      states: treeStates
    } = useTree({
      data,
      rowKey
    });
    const {
      updateCurrentRowData,
      updateCurrentRow,
      setCurrentRowKey,
      states: currentData
    } = useCurrent({
      data,
      rowKey
    });
    const setExpandRowKeysAdapter = (val) => {
      setExpandRowKeys(val);
      updateTreeExpandKeys(val);
    };
    const toggleRowExpansionAdapter = (row, expanded) => {
      const hasExpandColumn = columns.value.some(({ type }) => type === "expand");
      if (hasExpandColumn) {
        toggleRowExpansion(row, expanded);
      } else {
        toggleTreeExpansion(row, expanded);
      }
    };
    return {
      assertRowKey,
      updateColumns,
      scheduleLayout,
      isSelected,
      clearSelection,
      cleanSelection,
      getSelectionRows,
      toggleRowSelection,
      _toggleAllSelection,
      toggleAllSelection: null,
      updateSelectionByRowKey,
      updateAllSelected,
      updateFilters,
      updateCurrentRow,
      updateSort,
      execFilter,
      execSort,
      execQuery,
      clearFilter,
      clearSort,
      toggleRowExpansion,
      setExpandRowKeysAdapter,
      setCurrentRowKey,
      toggleRowExpansionAdapter,
      isRowExpanded,
      updateExpandRows,
      updateCurrentRowData,
      loadOrToggle,
      updateTreeData,
      states: {
        tableSize,
        rowKey,
        data,
        _data,
        isComplex,
        _columns,
        originColumns,
        columns,
        fixedColumns,
        rightFixedColumns,
        leafColumns,
        fixedLeafColumns,
        rightFixedLeafColumns,
        updateOrderFns,
        leafColumnsLength,
        fixedLeafColumnsLength,
        rightFixedLeafColumnsLength,
        isAllSelected,
        selection,
        reserveSelection,
        selectOnIndeterminate,
        selectable,
        filters,
        filteredData,
        sortingColumn,
        sortProp,
        sortOrder,
        hoverRow,
        ...expandStates,
        ...treeStates,
        ...currentData
      }
    };
  }
  function replaceColumn(array, column) {
    return array.map((item) => {
      var _a2;
      if (item.id === column.id) {
        return column;
      } else if ((_a2 = item.children) == null ? void 0 : _a2.length) {
        item.children = replaceColumn(item.children, column);
      }
      return item;
    });
  }
  function sortColumn(array) {
    array.forEach((item) => {
      var _a2, _b;
      item.no = (_a2 = item.getColumnIndex) == null ? void 0 : _a2.call(item);
      if ((_b = item.children) == null ? void 0 : _b.length) {
        sortColumn(item.children);
      }
    });
    array.sort((cur, pre) => cur.no - pre.no);
  }
  function useStore() {
    const instance = vue.getCurrentInstance();
    const watcher = useWatcher$1();
    const ns = useNamespace("table");
    const mutations = {
      setData(states, data) {
        const dataInstanceChanged = vue.unref(states._data) !== data;
        states.data.value = data;
        states._data.value = data;
        instance.store.execQuery();
        instance.store.updateCurrentRowData();
        instance.store.updateExpandRows();
        instance.store.updateTreeData(instance.store.states.defaultExpandAll.value);
        if (vue.unref(states.reserveSelection)) {
          instance.store.assertRowKey();
          instance.store.updateSelectionByRowKey();
        } else {
          if (dataInstanceChanged) {
            instance.store.clearSelection();
          } else {
            instance.store.cleanSelection();
          }
        }
        instance.store.updateAllSelected();
        if (instance.$ready) {
          instance.store.scheduleLayout();
        }
      },
      insertColumn(states, column, parent, updateColumnOrder) {
        const array = vue.unref(states._columns);
        let newColumns = [];
        if (!parent) {
          array.push(column);
          newColumns = array;
        } else {
          if (parent && !parent.children) {
            parent.children = [];
          }
          parent.children.push(column);
          newColumns = replaceColumn(array, parent);
        }
        sortColumn(newColumns);
        states._columns.value = newColumns;
        states.updateOrderFns.push(updateColumnOrder);
        if (column.type === "selection") {
          states.selectable.value = column.selectable;
          states.reserveSelection.value = column.reserveSelection;
        }
        if (instance.$ready) {
          instance.store.updateColumns();
          instance.store.scheduleLayout();
        }
      },
      updateColumnOrder(states, column) {
        var _a2;
        const newColumnIndex = (_a2 = column.getColumnIndex) == null ? void 0 : _a2.call(column);
        if (newColumnIndex === column.no)
          return;
        sortColumn(states._columns.value);
        if (instance.$ready) {
          instance.store.updateColumns();
        }
      },
      removeColumn(states, column, parent, updateColumnOrder) {
        const array = vue.unref(states._columns) || [];
        if (parent) {
          parent.children.splice(parent.children.findIndex((item) => item.id === column.id), 1);
          vue.nextTick(() => {
            var _a2;
            if (((_a2 = parent.children) == null ? void 0 : _a2.length) === 0) {
              delete parent.children;
            }
          });
          states._columns.value = replaceColumn(array, parent);
        } else {
          const index = array.indexOf(column);
          if (index > -1) {
            array.splice(index, 1);
            states._columns.value = array;
          }
        }
        const updateFnIndex = states.updateOrderFns.indexOf(updateColumnOrder);
        updateFnIndex > -1 && states.updateOrderFns.splice(updateFnIndex, 1);
        if (instance.$ready) {
          instance.store.updateColumns();
          instance.store.scheduleLayout();
        }
      },
      sort(states, options) {
        const { prop, order, init } = options;
        if (prop) {
          const column = vue.unref(states.columns).find((column2) => column2.property === prop);
          if (column) {
            column.order = order;
            instance.store.updateSort(column, prop, order);
            instance.store.commit("changeSortCondition", { init });
          }
        }
      },
      changeSortCondition(states, options) {
        const { sortingColumn, sortProp, sortOrder } = states;
        const columnValue = vue.unref(sortingColumn), propValue = vue.unref(sortProp), orderValue = vue.unref(sortOrder);
        if (orderValue === null) {
          states.sortingColumn.value = null;
          states.sortProp.value = null;
        }
        const ignore = { filter: true };
        instance.store.execQuery(ignore);
        if (!options || !(options.silent || options.init)) {
          instance.emit("sort-change", {
            column: columnValue,
            prop: propValue,
            order: orderValue
          });
        }
        instance.store.updateTableScrollY();
      },
      filterChange(_states, options) {
        const { column, values, silent } = options;
        const newFilters = instance.store.updateFilters(column, values);
        instance.store.execQuery();
        if (!silent) {
          instance.emit("filter-change", newFilters);
        }
        instance.store.updateTableScrollY();
      },
      toggleAllSelection() {
        instance.store.toggleAllSelection();
      },
      rowSelectedChanged(_states, row) {
        instance.store.toggleRowSelection(row);
        instance.store.updateAllSelected();
      },
      setHoverRow(states, row) {
        states.hoverRow.value = row;
      },
      setCurrentRow(_states, row) {
        instance.store.updateCurrentRow(row);
      }
    };
    const commit = function(name, ...args) {
      const mutations2 = instance.store.mutations;
      if (mutations2[name]) {
        mutations2[name].apply(instance, [instance.store.states].concat(args));
      } else {
        throw new Error(`Action not found: ${name}`);
      }
    };
    const updateTableScrollY = function() {
      vue.nextTick(() => instance.layout.updateScrollY.apply(instance.layout));
    };
    return {
      ns,
      ...watcher,
      mutations,
      commit,
      updateTableScrollY
    };
  }
  const InitialStateMap = {
    rowKey: "rowKey",
    defaultExpandAll: "defaultExpandAll",
    selectOnIndeterminate: "selectOnIndeterminate",
    indent: "indent",
    lazy: "lazy",
    data: "data",
    ["treeProps.hasChildren"]: {
      key: "lazyColumnIdentifier",
      default: "hasChildren"
    },
    ["treeProps.children"]: {
      key: "childrenColumnName",
      default: "children"
    }
  };
  function createStore(table, props) {
    if (!table) {
      throw new Error("Table is required.");
    }
    const store = useStore();
    store.toggleAllSelection = debounce(store._toggleAllSelection, 10);
    Object.keys(InitialStateMap).forEach((key) => {
      handleValue(getArrKeysValue(props, key), key, store);
    });
    proxyTableProps(store, props);
    return store;
  }
  function proxyTableProps(store, props) {
    Object.keys(InitialStateMap).forEach((key) => {
      vue.watch(() => getArrKeysValue(props, key), (value) => {
        handleValue(value, key, store);
      });
    });
  }
  function handleValue(value, propsKey, store) {
    let newVal = value;
    let storeKey = InitialStateMap[propsKey];
    if (typeof InitialStateMap[propsKey] === "object") {
      storeKey = storeKey.key;
      newVal = newVal || InitialStateMap[propsKey].default;
    }
    store.states[storeKey].value = newVal;
  }
  function getArrKeysValue(props, keys2) {
    if (keys2.includes(".")) {
      const keyList = keys2.split(".");
      let value = props;
      keyList.forEach((key) => {
        value = value[key];
      });
      return value;
    } else {
      return props[keys2];
    }
  }
  class TableLayout {
    constructor(options) {
      this.observers = [];
      this.table = null;
      this.store = null;
      this.columns = [];
      this.fit = true;
      this.showHeader = true;
      this.height = vue.ref(null);
      this.scrollX = vue.ref(false);
      this.scrollY = vue.ref(false);
      this.bodyWidth = vue.ref(null);
      this.fixedWidth = vue.ref(null);
      this.rightFixedWidth = vue.ref(null);
      this.gutterWidth = 0;
      for (const name in options) {
        if (hasOwn(options, name)) {
          if (vue.isRef(this[name])) {
            this[name].value = options[name];
          } else {
            this[name] = options[name];
          }
        }
      }
      if (!this.table) {
        throw new Error("Table is required for Table Layout");
      }
      if (!this.store) {
        throw new Error("Store is required for Table Layout");
      }
    }
    updateScrollY() {
      const height = this.height.value;
      if (height === null)
        return false;
      const scrollBarRef = this.table.refs.scrollBarRef;
      if (this.table.vnode.el && (scrollBarRef == null ? void 0 : scrollBarRef.wrapRef)) {
        let scrollY = true;
        const prevScrollY = this.scrollY.value;
        scrollY = scrollBarRef.wrapRef.scrollHeight > scrollBarRef.wrapRef.clientHeight;
        this.scrollY.value = scrollY;
        return prevScrollY !== scrollY;
      }
      return false;
    }
    setHeight(value, prop = "height") {
      if (!isClient)
        return;
      const el = this.table.vnode.el;
      value = parseHeight(value);
      this.height.value = Number(value);
      if (!el && (value || value === 0))
        return vue.nextTick(() => this.setHeight(value, prop));
      if (typeof value === "number") {
        el.style[prop] = `${value}px`;
        this.updateElsHeight();
      } else if (typeof value === "string") {
        el.style[prop] = value;
        this.updateElsHeight();
      }
    }
    setMaxHeight(value) {
      this.setHeight(value, "max-height");
    }
    getFlattenColumns() {
      const flattenColumns = [];
      const columns = this.table.store.states.columns.value;
      columns.forEach((column) => {
        if (column.isColumnGroup) {
          flattenColumns.push.apply(flattenColumns, column.columns);
        } else {
          flattenColumns.push(column);
        }
      });
      return flattenColumns;
    }
    updateElsHeight() {
      this.updateScrollY();
      this.notifyObservers("scrollable");
    }
    headerDisplayNone(elm) {
      if (!elm)
        return true;
      let headerChild = elm;
      while (headerChild.tagName !== "DIV") {
        if (getComputedStyle(headerChild).display === "none") {
          return true;
        }
        headerChild = headerChild.parentElement;
      }
      return false;
    }
    updateColumnsWidth() {
      if (!isClient)
        return;
      const fit = this.fit;
      const bodyWidth = this.table.vnode.el.clientWidth;
      let bodyMinWidth = 0;
      const flattenColumns = this.getFlattenColumns();
      const flexColumns = flattenColumns.filter((column) => typeof column.width !== "number");
      flattenColumns.forEach((column) => {
        if (typeof column.width === "number" && column.realWidth)
          column.realWidth = null;
      });
      if (flexColumns.length > 0 && fit) {
        flattenColumns.forEach((column) => {
          bodyMinWidth += Number(column.width || column.minWidth || 80);
        });
        if (bodyMinWidth <= bodyWidth) {
          this.scrollX.value = false;
          const totalFlexWidth = bodyWidth - bodyMinWidth;
          if (flexColumns.length === 1) {
            flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth;
          } else {
            const allColumnsWidth = flexColumns.reduce((prev, column) => prev + Number(column.minWidth || 80), 0);
            const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
            let noneFirstWidth = 0;
            flexColumns.forEach((column, index) => {
              if (index === 0)
                return;
              const flexWidth = Math.floor(Number(column.minWidth || 80) * flexWidthPerPixel);
              noneFirstWidth += flexWidth;
              column.realWidth = Number(column.minWidth || 80) + flexWidth;
            });
            flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
          }
        } else {
          this.scrollX.value = true;
          flexColumns.forEach((column) => {
            column.realWidth = Number(column.minWidth);
          });
        }
        this.bodyWidth.value = Math.max(bodyMinWidth, bodyWidth);
        this.table.state.resizeState.value.width = this.bodyWidth.value;
      } else {
        flattenColumns.forEach((column) => {
          if (!column.width && !column.minWidth) {
            column.realWidth = 80;
          } else {
            column.realWidth = Number(column.width || column.minWidth);
          }
          bodyMinWidth += column.realWidth;
        });
        this.scrollX.value = bodyMinWidth > bodyWidth;
        this.bodyWidth.value = bodyMinWidth;
      }
      const fixedColumns = this.store.states.fixedColumns.value;
      if (fixedColumns.length > 0) {
        let fixedWidth = 0;
        fixedColumns.forEach((column) => {
          fixedWidth += Number(column.realWidth || column.width);
        });
        this.fixedWidth.value = fixedWidth;
      }
      const rightFixedColumns = this.store.states.rightFixedColumns.value;
      if (rightFixedColumns.length > 0) {
        let rightFixedWidth = 0;
        rightFixedColumns.forEach((column) => {
          rightFixedWidth += Number(column.realWidth || column.width);
        });
        this.rightFixedWidth.value = rightFixedWidth;
      }
      this.notifyObservers("columns");
    }
    addObserver(observer) {
      this.observers.push(observer);
    }
    removeObserver(observer) {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    }
    notifyObservers(event) {
      const observers = this.observers;
      observers.forEach((observer) => {
        var _a2, _b;
        switch (event) {
          case "columns":
            (_a2 = observer.state) == null ? void 0 : _a2.onColumnsChange(this);
            break;
          case "scrollable":
            (_b = observer.state) == null ? void 0 : _b.onScrollableChange(this);
            break;
          default:
            throw new Error(`Table Layout don't have event ${event}.`);
        }
      });
    }
  }
  const { CheckboxGroup: ElCheckboxGroup } = ElCheckbox;
  const _sfc_main$3 = vue.defineComponent({
    name: "ElTableFilterPanel",
    components: {
      ElCheckbox,
      ElCheckboxGroup,
      ElScrollbar,
      ElTooltip,
      ElIcon,
      ArrowDown: arrow_down_default,
      ArrowUp: arrow_up_default
    },
    directives: { ClickOutside },
    props: {
      placement: {
        type: String,
        default: "bottom-start"
      },
      store: {
        type: Object
      },
      column: {
        type: Object
      },
      upDataColumn: {
        type: Function
      }
    },
    setup(props) {
      const instance = vue.getCurrentInstance();
      const { t } = useLocale();
      const ns = useNamespace("table-filter");
      const parent = instance == null ? void 0 : instance.parent;
      if (!parent.filterPanels.value[props.column.id]) {
        parent.filterPanels.value[props.column.id] = instance;
      }
      const tooltipVisible = vue.ref(false);
      const tooltip = vue.ref(null);
      const filters = vue.computed(() => {
        return props.column && props.column.filters;
      });
      const filterClassName = vue.computed(() => {
        if (props.column.filterClassName) {
          return `${ns.b()} ${props.column.filterClassName}`;
        }
        return ns.b();
      });
      const filterValue = vue.computed({
        get: () => {
          var _a2;
          return (((_a2 = props.column) == null ? void 0 : _a2.filteredValue) || [])[0];
        },
        set: (value) => {
          if (filteredValue.value) {
            if (typeof value !== "undefined" && value !== null) {
              filteredValue.value.splice(0, 1, value);
            } else {
              filteredValue.value.splice(0, 1);
            }
          }
        }
      });
      const filteredValue = vue.computed({
        get() {
          if (props.column) {
            return props.column.filteredValue || [];
          }
          return [];
        },
        set(value) {
          if (props.column) {
            props.upDataColumn("filteredValue", value);
          }
        }
      });
      const multiple = vue.computed(() => {
        if (props.column) {
          return props.column.filterMultiple;
        }
        return true;
      });
      const isActive = (filter) => {
        return filter.value === filterValue.value;
      };
      const hidden = () => {
        tooltipVisible.value = false;
      };
      const showFilterPanel = (e) => {
        e.stopPropagation();
        tooltipVisible.value = !tooltipVisible.value;
      };
      const hideFilterPanel = () => {
        tooltipVisible.value = false;
      };
      const handleConfirm = () => {
        confirmFilter(filteredValue.value);
        hidden();
      };
      const handleReset = () => {
        filteredValue.value = [];
        confirmFilter(filteredValue.value);
        hidden();
      };
      const handleSelect = (_filterValue) => {
        filterValue.value = _filterValue;
        if (typeof _filterValue !== "undefined" && _filterValue !== null) {
          confirmFilter(filteredValue.value);
        } else {
          confirmFilter([]);
        }
        hidden();
      };
      const confirmFilter = (filteredValue2) => {
        props.store.commit("filterChange", {
          column: props.column,
          values: filteredValue2
        });
        props.store.updateAllSelected();
      };
      vue.watch(tooltipVisible, (value) => {
        if (props.column) {
          props.upDataColumn("filterOpened", value);
        }
      }, {
        immediate: true
      });
      const popperPaneRef = vue.computed(() => {
        var _a2, _b;
        return (_b = (_a2 = tooltip.value) == null ? void 0 : _a2.popperRef) == null ? void 0 : _b.contentRef;
      });
      return {
        tooltipVisible,
        multiple,
        filterClassName,
        filteredValue,
        filterValue,
        filters,
        handleConfirm,
        handleReset,
        handleSelect,
        isActive,
        t,
        ns,
        showFilterPanel,
        hideFilterPanel,
        popperPaneRef,
        tooltip
      };
    }
  });
  const _hoisted_1$3 = { key: 0 };
  const _hoisted_2$3 = ["disabled"];
  const _hoisted_3 = ["label", "onClick"];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_checkbox = vue.resolveComponent("el-checkbox");
    const _component_el_checkbox_group = vue.resolveComponent("el-checkbox-group");
    const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
    const _component_arrow_up = vue.resolveComponent("arrow-up");
    const _component_arrow_down = vue.resolveComponent("arrow-down");
    const _component_el_icon = vue.resolveComponent("el-icon");
    const _component_el_tooltip = vue.resolveComponent("el-tooltip");
    const _directive_click_outside = vue.resolveDirective("click-outside");
    return vue.openBlock(), vue.createBlock(_component_el_tooltip, {
      ref: "tooltip",
      visible: _ctx.tooltipVisible,
      offset: 0,
      placement: _ctx.placement,
      "show-arrow": false,
      "stop-popper-mouse-event": false,
      teleported: "",
      effect: "light",
      pure: "",
      "popper-class": _ctx.filterClassName,
      persistent: ""
    }, {
      content: vue.withCtx(() => [
        _ctx.multiple ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(_ctx.ns.e("content"))
          }, [
            vue.createVNode(_component_el_scrollbar, {
              "wrap-class": _ctx.ns.e("wrap")
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_checkbox_group, {
                  modelValue: _ctx.filteredValue,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.filteredValue = $event),
                  class: vue.normalizeClass(_ctx.ns.e("checkbox-group"))
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.filters, (filter) => {
                      return vue.openBlock(), vue.createBlock(_component_el_checkbox, {
                        key: filter.value,
                        value: filter.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(filter.text), 1)
                        ]),
                        _: 2
                      }, 1032, ["value"]);
                    }), 128))
                  ]),
                  _: 1
                }, 8, ["modelValue", "class"])
              ]),
              _: 1
            }, 8, ["wrap-class"])
          ], 2),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(_ctx.ns.e("bottom"))
          }, [
            vue.createElementVNode("button", {
              class: vue.normalizeClass({ [_ctx.ns.is("disabled")]: _ctx.filteredValue.length === 0 }),
              disabled: _ctx.filteredValue.length === 0,
              type: "button",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleConfirm && _ctx.handleConfirm(...args))
            }, vue.toDisplayString(_ctx.t("el.table.confirmFilter")), 11, _hoisted_2$3),
            vue.createElementVNode("button", {
              type: "button",
              onClick: _cache[2] || (_cache[2] = (...args) => _ctx.handleReset && _ctx.handleReset(...args))
            }, vue.toDisplayString(_ctx.t("el.table.resetFilter")), 1)
          ], 2)
        ])) : (vue.openBlock(), vue.createElementBlock("ul", {
          key: 1,
          class: vue.normalizeClass(_ctx.ns.e("list"))
        }, [
          vue.createElementVNode("li", {
            class: vue.normalizeClass([
              _ctx.ns.e("list-item"),
              {
                [_ctx.ns.is("active")]: _ctx.filterValue === void 0 || _ctx.filterValue === null
              }
            ]),
            onClick: _cache[3] || (_cache[3] = ($event) => _ctx.handleSelect(null))
          }, vue.toDisplayString(_ctx.t("el.table.clearFilter")), 3),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.filters, (filter) => {
            return vue.openBlock(), vue.createElementBlock("li", {
              key: filter.value,
              class: vue.normalizeClass([_ctx.ns.e("list-item"), _ctx.ns.is("active", _ctx.isActive(filter))]),
              label: filter.value,
              onClick: ($event) => _ctx.handleSelect(filter.value)
            }, vue.toDisplayString(filter.text), 11, _hoisted_3);
          }), 128))
        ], 2))
      ]),
      default: vue.withCtx(() => [
        vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
          class: vue.normalizeClass([
            `${_ctx.ns.namespace.value}-table__column-filter-trigger`,
            `${_ctx.ns.namespace.value}-none-outline`
          ]),
          onClick: _cache[4] || (_cache[4] = (...args) => _ctx.showFilterPanel && _ctx.showFilterPanel(...args))
        }, [
          vue.createVNode(_component_el_icon, null, {
            default: vue.withCtx(() => [
              _ctx.column.filterOpened ? (vue.openBlock(), vue.createBlock(_component_arrow_up, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_arrow_down, { key: 1 }))
            ]),
            _: 1
          })
        ], 2)), [
          [_directive_click_outside, _ctx.hideFilterPanel, _ctx.popperPaneRef]
        ])
      ]),
      _: 1
    }, 8, ["visible", "placement", "popper-class"]);
  }
  var FilterPanel = /* @__PURE__ */ _export_sfc$1(_sfc_main$3, [["render", _sfc_render$1], ["__file", "filter-panel.vue"]]);
  function useLayoutObserver(root2) {
    const instance = vue.getCurrentInstance();
    vue.onBeforeMount(() => {
      tableLayout.value.addObserver(instance);
    });
    vue.onMounted(() => {
      onColumnsChange(tableLayout.value);
      onScrollableChange(tableLayout.value);
    });
    vue.onUpdated(() => {
      onColumnsChange(tableLayout.value);
      onScrollableChange(tableLayout.value);
    });
    vue.onUnmounted(() => {
      tableLayout.value.removeObserver(instance);
    });
    const tableLayout = vue.computed(() => {
      const layout = root2.layout;
      if (!layout) {
        throw new Error("Can not find table layout.");
      }
      return layout;
    });
    const onColumnsChange = (layout) => {
      var _a2;
      const cols = ((_a2 = root2.vnode.el) == null ? void 0 : _a2.querySelectorAll("colgroup > col")) || [];
      if (!cols.length)
        return;
      const flattenColumns = layout.getFlattenColumns();
      const columnsMap = {};
      flattenColumns.forEach((column) => {
        columnsMap[column.id] = column;
      });
      for (let i = 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        const name = col.getAttribute("name");
        const column = columnsMap[name];
        if (column) {
          col.setAttribute("width", column.realWidth || column.width);
        }
      }
    };
    const onScrollableChange = (layout) => {
      var _a2, _b;
      const cols = ((_a2 = root2.vnode.el) == null ? void 0 : _a2.querySelectorAll("colgroup > col[name=gutter]")) || [];
      for (let i = 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        col.setAttribute("width", layout.scrollY.value ? layout.gutterWidth : "0");
      }
      const ths = ((_b = root2.vnode.el) == null ? void 0 : _b.querySelectorAll("th.gutter")) || [];
      for (let i = 0, j = ths.length; i < j; i++) {
        const th = ths[i];
        th.style.width = layout.scrollY.value ? `${layout.gutterWidth}px` : "0";
        th.style.display = layout.scrollY.value ? "" : "none";
      }
    };
    return {
      tableLayout: tableLayout.value,
      onColumnsChange,
      onScrollableChange
    };
  }
  const TABLE_INJECTION_KEY = Symbol("ElTable");
  function useEvent(props, emit) {
    const instance = vue.getCurrentInstance();
    const parent = vue.inject(TABLE_INJECTION_KEY);
    const handleFilterClick = (event) => {
      event.stopPropagation();
      return;
    };
    const handleHeaderClick = (event, column) => {
      if (!column.filters && column.sortable) {
        handleSortClick(event, column, false);
      } else if (column.filterable && !column.sortable) {
        handleFilterClick(event);
      }
      parent == null ? void 0 : parent.emit("header-click", column, event);
    };
    const handleHeaderContextMenu = (event, column) => {
      parent == null ? void 0 : parent.emit("header-contextmenu", column, event);
    };
    const draggingColumn = vue.ref(null);
    const dragging = vue.ref(false);
    const dragState = vue.ref({});
    const handleMouseDown = (event, column) => {
      if (!isClient)
        return;
      if (column.children && column.children.length > 0)
        return;
      if (draggingColumn.value && props.border) {
        dragging.value = true;
        const table = parent;
        emit("set-drag-visible", true);
        const tableEl = table == null ? void 0 : table.vnode.el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = instance.vnode.el.querySelector(`th.${column.id}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + 30;
        addClass(columnEl, "noclick");
        dragState.value = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };
        const resizeProxy = table == null ? void 0 : table.refs.resizeProxy;
        resizeProxy.style.left = `${dragState.value.startLeft}px`;
        document.onselectstart = function() {
          return false;
        };
        document.ondragstart = function() {
          return false;
        };
        const handleMouseMove2 = (event2) => {
          const deltaLeft = event2.clientX - dragState.value.startMouseLeft;
          const proxyLeft = dragState.value.startLeft + deltaLeft;
          resizeProxy.style.left = `${Math.max(minLeft, proxyLeft)}px`;
        };
        const handleMouseUp = () => {
          if (dragging.value) {
            const { startColumnLeft, startLeft } = dragState.value;
            const finalLeft = Number.parseInt(resizeProxy.style.left, 10);
            const columnWidth = finalLeft - startColumnLeft;
            column.width = column.realWidth = columnWidth;
            table == null ? void 0 : table.emit("header-dragend", column.width, startLeft - startColumnLeft, column, event);
            requestAnimationFrame(() => {
              props.store.scheduleLayout(false, true);
            });
            document.body.style.cursor = "";
            dragging.value = false;
            draggingColumn.value = null;
            dragState.value = {};
            emit("set-drag-visible", false);
          }
          document.removeEventListener("mousemove", handleMouseMove2);
          document.removeEventListener("mouseup", handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;
          setTimeout(() => {
            removeClass(columnEl, "noclick");
          }, 0);
        };
        document.addEventListener("mousemove", handleMouseMove2);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };
    const handleMouseMove = (event, column) => {
      if (column.children && column.children.length > 0)
        return;
      const el = event.target;
      if (!isElement(el)) {
        return;
      }
      const target = el == null ? void 0 : el.closest("th");
      if (!column || !column.resizable)
        return;
      if (!dragging.value && props.border) {
        const rect = target.getBoundingClientRect();
        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = "col-resize";
          if (hasClass(target, "is-sortable")) {
            target.style.cursor = "col-resize";
          }
          draggingColumn.value = column;
        } else if (!dragging.value) {
          bodyStyle.cursor = "";
          if (hasClass(target, "is-sortable")) {
            target.style.cursor = "pointer";
          }
          draggingColumn.value = null;
        }
      }
    };
    const handleMouseOut = () => {
      if (!isClient)
        return;
      document.body.style.cursor = "";
    };
    const toggleOrder = ({ order, sortOrders }) => {
      if (order === "")
        return sortOrders[0];
      const index = sortOrders.indexOf(order || null);
      return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
    };
    const handleSortClick = (event, column, givenOrder) => {
      var _a2;
      event.stopPropagation();
      const order = column.order === givenOrder ? null : givenOrder || toggleOrder(column);
      const target = (_a2 = event.target) == null ? void 0 : _a2.closest("th");
      if (target) {
        if (hasClass(target, "noclick")) {
          removeClass(target, "noclick");
          return;
        }
      }
      if (!column.sortable)
        return;
      const states = props.store.states;
      let sortProp = states.sortProp.value;
      let sortOrder;
      const sortingColumn = states.sortingColumn.value;
      if (sortingColumn !== column || sortingColumn === column && sortingColumn.order === null) {
        if (sortingColumn) {
          sortingColumn.order = null;
        }
        states.sortingColumn.value = column;
        sortProp = column.property;
      }
      if (!order) {
        sortOrder = column.order = null;
      } else {
        sortOrder = column.order = order;
      }
      states.sortProp.value = sortProp;
      states.sortOrder.value = sortOrder;
      parent == null ? void 0 : parent.store.commit("changeSortCondition");
    };
    return {
      handleHeaderClick,
      handleHeaderContextMenu,
      handleMouseDown,
      handleMouseMove,
      handleMouseOut,
      handleSortClick,
      handleFilterClick
    };
  }
  function useStyle$2(props) {
    const parent = vue.inject(TABLE_INJECTION_KEY);
    const ns = useNamespace("table");
    const getHeaderRowStyle = (rowIndex) => {
      const headerRowStyle = parent == null ? void 0 : parent.props.headerRowStyle;
      if (typeof headerRowStyle === "function") {
        return headerRowStyle.call(null, { rowIndex });
      }
      return headerRowStyle;
    };
    const getHeaderRowClass = (rowIndex) => {
      const classes = [];
      const headerRowClassName = parent == null ? void 0 : parent.props.headerRowClassName;
      if (typeof headerRowClassName === "string") {
        classes.push(headerRowClassName);
      } else if (typeof headerRowClassName === "function") {
        classes.push(headerRowClassName.call(null, { rowIndex }));
      }
      return classes.join(" ");
    };
    const getHeaderCellStyle = (rowIndex, columnIndex, row, column) => {
      var _a2;
      let headerCellStyles = (_a2 = parent == null ? void 0 : parent.props.headerCellStyle) != null ? _a2 : {};
      if (typeof headerCellStyles === "function") {
        headerCellStyles = headerCellStyles.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      }
      const fixedStyle = getFixedColumnOffset(columnIndex, column.fixed, props.store, row);
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return Object.assign({}, headerCellStyles, fixedStyle);
    };
    const getHeaderCellClass = (rowIndex, columnIndex, row, column) => {
      const fixedClasses = getFixedColumnsClass(ns.b(), columnIndex, column.fixed, props.store, row);
      const classes = [
        column.id,
        column.order,
        column.headerAlign,
        column.className,
        column.labelClassName,
        ...fixedClasses
      ];
      if (!column.children) {
        classes.push("is-leaf");
      }
      if (column.sortable) {
        classes.push("is-sortable");
      }
      const headerCellClassName = parent == null ? void 0 : parent.props.headerCellClassName;
      if (typeof headerCellClassName === "string") {
        classes.push(headerCellClassName);
      } else if (typeof headerCellClassName === "function") {
        classes.push(headerCellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }
      classes.push(ns.e("cell"));
      return classes.filter((className) => Boolean(className)).join(" ");
    };
    return {
      getHeaderRowStyle,
      getHeaderRowClass,
      getHeaderCellStyle,
      getHeaderCellClass
    };
  }
  const getAllColumns = (columns) => {
    const result = [];
    columns.forEach((column) => {
      if (column.children) {
        result.push(column);
        result.push.apply(result, getAllColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  };
  const convertToRows = (originColumns) => {
    let maxLevel = 1;
    const traverse = (column, parent) => {
      if (parent) {
        column.level = parent.level + 1;
        if (maxLevel < column.level) {
          maxLevel = column.level;
        }
      }
      if (column.children) {
        let colSpan = 0;
        column.children.forEach((subColumn) => {
          traverse(subColumn, column);
          colSpan += subColumn.colSpan;
        });
        column.colSpan = colSpan;
      } else {
        column.colSpan = 1;
      }
    };
    originColumns.forEach((column) => {
      column.level = 1;
      traverse(column, void 0);
    });
    const rows = [];
    for (let i = 0; i < maxLevel; i++) {
      rows.push([]);
    }
    const allColumns = getAllColumns(originColumns);
    allColumns.forEach((column) => {
      if (!column.children) {
        column.rowSpan = maxLevel - column.level + 1;
      } else {
        column.rowSpan = 1;
        column.children.forEach((col) => col.isSubColumn = true);
      }
      rows[column.level - 1].push(column);
    });
    return rows;
  };
  function useUtils$1(props) {
    const parent = vue.inject(TABLE_INJECTION_KEY);
    const columnRows = vue.computed(() => {
      return convertToRows(props.store.states.originColumns.value);
    });
    const isGroup = vue.computed(() => {
      const result = columnRows.value.length > 1;
      if (result && parent) {
        parent.state.isGroup.value = true;
      }
      return result;
    });
    const toggleAllSelection = (event) => {
      event.stopPropagation();
      parent == null ? void 0 : parent.store.commit("toggleAllSelection");
    };
    return {
      isGroup,
      toggleAllSelection,
      columnRows
    };
  }
  var TableHeader = vue.defineComponent({
    name: "ElTableHeader",
    components: {
      ElCheckbox
    },
    props: {
      fixed: {
        type: String,
        default: ""
      },
      store: {
        required: true,
        type: Object
      },
      border: Boolean,
      defaultSort: {
        type: Object,
        default: () => {
          return {
            prop: "",
            order: ""
          };
        }
      }
    },
    setup(props, { emit }) {
      const instance = vue.getCurrentInstance();
      const parent = vue.inject(TABLE_INJECTION_KEY);
      const ns = useNamespace("table");
      const filterPanels = vue.ref({});
      const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent);
      vue.onMounted(async () => {
        await vue.nextTick();
        await vue.nextTick();
        const { prop, order } = props.defaultSort;
        parent == null ? void 0 : parent.store.commit("sort", { prop, order, init: true });
      });
      const {
        handleHeaderClick,
        handleHeaderContextMenu,
        handleMouseDown,
        handleMouseMove,
        handleMouseOut,
        handleSortClick,
        handleFilterClick
      } = useEvent(props, emit);
      const {
        getHeaderRowStyle,
        getHeaderRowClass,
        getHeaderCellStyle,
        getHeaderCellClass
      } = useStyle$2(props);
      const { isGroup, toggleAllSelection, columnRows } = useUtils$1(props);
      instance.state = {
        onColumnsChange,
        onScrollableChange
      };
      instance.filterPanels = filterPanels;
      return {
        ns,
        filterPanels,
        onColumnsChange,
        onScrollableChange,
        columnRows,
        getHeaderRowClass,
        getHeaderRowStyle,
        getHeaderCellClass,
        getHeaderCellStyle,
        handleHeaderClick,
        handleHeaderContextMenu,
        handleMouseDown,
        handleMouseMove,
        handleMouseOut,
        handleSortClick,
        handleFilterClick,
        isGroup,
        toggleAllSelection
      };
    },
    render() {
      const {
        ns,
        isGroup,
        columnRows,
        getHeaderCellStyle,
        getHeaderCellClass,
        getHeaderRowClass,
        getHeaderRowStyle,
        handleHeaderClick,
        handleHeaderContextMenu,
        handleMouseDown,
        handleMouseMove,
        handleSortClick,
        handleMouseOut,
        store,
        $parent
      } = this;
      let rowSpan = 1;
      return vue.h("thead", {
        class: { [ns.is("group")]: isGroup }
      }, columnRows.map((subColumns, rowIndex) => vue.h("tr", {
        class: getHeaderRowClass(rowIndex),
        key: rowIndex,
        style: getHeaderRowStyle(rowIndex)
      }, subColumns.map((column, cellIndex) => {
        if (column.rowSpan > rowSpan) {
          rowSpan = column.rowSpan;
        }
        return vue.h("th", {
          class: getHeaderCellClass(rowIndex, cellIndex, subColumns, column),
          colspan: column.colSpan,
          key: `${column.id}-thead`,
          rowspan: column.rowSpan,
          style: getHeaderCellStyle(rowIndex, cellIndex, subColumns, column),
          onClick: ($event) => handleHeaderClick($event, column),
          onContextmenu: ($event) => handleHeaderContextMenu($event, column),
          onMousedown: ($event) => handleMouseDown($event, column),
          onMousemove: ($event) => handleMouseMove($event, column),
          onMouseout: handleMouseOut
        }, [
          vue.h("div", {
            class: [
              "cell",
              column.filteredValue && column.filteredValue.length > 0 ? "highlight" : ""
            ]
          }, [
            column.renderHeader ? column.renderHeader({
              column,
              $index: cellIndex,
              store,
              _self: $parent
            }) : column.label,
            column.sortable && vue.h("span", {
              onClick: ($event) => handleSortClick($event, column),
              class: "caret-wrapper"
            }, [
              vue.h("i", {
                onClick: ($event) => handleSortClick($event, column, "ascending"),
                class: "sort-caret ascending"
              }),
              vue.h("i", {
                onClick: ($event) => handleSortClick($event, column, "descending"),
                class: "sort-caret descending"
              })
            ]),
            column.filterable && vue.h(FilterPanel, {
              store,
              placement: column.filterPlacement || "bottom-start",
              column,
              upDataColumn: (key, value) => {
                column[key] = value;
              }
            })
          ])
        ]);
      }))));
    }
  });
  function useEvents(props) {
    const parent = vue.inject(TABLE_INJECTION_KEY);
    const tooltipContent = vue.ref("");
    const tooltipTrigger = vue.ref(vue.h("div"));
    const handleEvent = (event, row, name) => {
      var _a2;
      const table = parent;
      const cell = getCell(event);
      let column;
      const namespace = (_a2 = table == null ? void 0 : table.vnode.el) == null ? void 0 : _a2.dataset.prefix;
      if (cell) {
        column = getColumnByCell({
          columns: props.store.states.columns.value
        }, cell, namespace);
        if (column) {
          table == null ? void 0 : table.emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table == null ? void 0 : table.emit(`row-${name}`, row, column, event);
    };
    const handleDoubleClick = (event, row) => {
      handleEvent(event, row, "dblclick");
    };
    const handleClick = (event, row) => {
      props.store.commit("setCurrentRow", row);
      handleEvent(event, row, "click");
    };
    const handleContextMenu = (event, row) => {
      handleEvent(event, row, "contextmenu");
    };
    const handleMouseEnter = debounce((index) => {
      props.store.commit("setHoverRow", index);
    }, 30);
    const handleMouseLeave = debounce(() => {
      props.store.commit("setHoverRow", null);
    }, 30);
    const getPadding = (el) => {
      const style2 = window.getComputedStyle(el, null);
      const paddingLeft = Number.parseInt(style2.paddingLeft, 10) || 0;
      const paddingRight = Number.parseInt(style2.paddingRight, 10) || 0;
      const paddingTop = Number.parseInt(style2.paddingTop, 10) || 0;
      const paddingBottom = Number.parseInt(style2.paddingBottom, 10) || 0;
      return {
        left: paddingLeft,
        right: paddingRight,
        top: paddingTop,
        bottom: paddingBottom
      };
    };
    const toggleRowClassByCell = (rowSpan, event, toggle) => {
      let node = event.target.parentNode;
      while (rowSpan > 1) {
        node = node == null ? void 0 : node.nextSibling;
        if (!node || node.nodeName !== "TR")
          break;
        toggle(node, "hover-row hover-fixed-row");
        rowSpan--;
      }
    };
    const handleCellMouseEnter = (event, row, tooltipOptions) => {
      var _a2;
      const table = parent;
      const cell = getCell(event);
      const namespace = (_a2 = table == null ? void 0 : table.vnode.el) == null ? void 0 : _a2.dataset.prefix;
      if (cell) {
        const column = getColumnByCell({
          columns: props.store.states.columns.value
        }, cell, namespace);
        if (cell.rowSpan > 1) {
          toggleRowClassByCell(cell.rowSpan, event, addClass);
        }
        const hoverState = table.hoverState = { cell, column, row };
        table == null ? void 0 : table.emit("cell-mouse-enter", hoverState.row, hoverState.column, hoverState.cell, event);
      }
      if (!tooltipOptions) {
        return;
      }
      const cellChild = event.target.querySelector(".cell");
      if (!(hasClass(cellChild, `${namespace}-tooltip`) && cellChild.childNodes.length)) {
        return;
      }
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      let rangeWidth = range.getBoundingClientRect().width;
      let rangeHeight = range.getBoundingClientRect().height;
      const offsetWidth = rangeWidth - Math.floor(rangeWidth);
      const { width: cellChildWidth, height: cellChildHeight } = cellChild.getBoundingClientRect();
      if (offsetWidth < 1e-3) {
        rangeWidth = Math.floor(rangeWidth);
      }
      const offsetHeight = rangeHeight - Math.floor(rangeHeight);
      if (offsetHeight < 1e-3) {
        rangeHeight = Math.floor(rangeHeight);
      }
      const { top, left, right, bottom } = getPadding(cellChild);
      const horizontalPadding = left + right;
      const verticalPadding = top + bottom;
      if (rangeWidth + horizontalPadding > cellChildWidth || rangeHeight + verticalPadding > cellChildHeight || cellChild.scrollWidth > cellChildWidth) {
        createTablePopper(tooltipOptions, cell.innerText || cell.textContent, cell, table);
      }
    };
    const handleCellMouseLeave = (event) => {
      const cell = getCell(event);
      if (!cell)
        return;
      if (cell.rowSpan > 1) {
        toggleRowClassByCell(cell.rowSpan, event, removeClass);
      }
      const oldHoverState = parent == null ? void 0 : parent.hoverState;
      parent == null ? void 0 : parent.emit("cell-mouse-leave", oldHoverState == null ? void 0 : oldHoverState.row, oldHoverState == null ? void 0 : oldHoverState.column, oldHoverState == null ? void 0 : oldHoverState.cell, event);
    };
    return {
      handleDoubleClick,
      handleClick,
      handleContextMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleCellMouseEnter,
      handleCellMouseLeave,
      tooltipContent,
      tooltipTrigger
    };
  }
  function useStyles(props) {
    const parent = vue.inject(TABLE_INJECTION_KEY);
    const ns = useNamespace("table");
    const getRowStyle = (row, rowIndex) => {
      const rowStyle = parent == null ? void 0 : parent.props.rowStyle;
      if (typeof rowStyle === "function") {
        return rowStyle.call(null, {
          row,
          rowIndex
        });
      }
      return rowStyle || null;
    };
    const getRowClass = (row, rowIndex) => {
      const classes = [ns.e("row")];
      if ((parent == null ? void 0 : parent.props.highlightCurrentRow) && row === props.store.states.currentRow.value) {
        classes.push("current-row");
      }
      if (props.stripe && rowIndex % 2 === 1) {
        classes.push(ns.em("row", "striped"));
      }
      const rowClassName = parent == null ? void 0 : parent.props.rowClassName;
      if (typeof rowClassName === "string") {
        classes.push(rowClassName);
      } else if (typeof rowClassName === "function") {
        classes.push(rowClassName.call(null, {
          row,
          rowIndex
        }));
      }
      return classes;
    };
    const getCellStyle = (rowIndex, columnIndex, row, column) => {
      const cellStyle = parent == null ? void 0 : parent.props.cellStyle;
      let cellStyles = cellStyle != null ? cellStyle : {};
      if (typeof cellStyle === "function") {
        cellStyles = cellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      }
      const fixedStyle = getFixedColumnOffset(columnIndex, props == null ? void 0 : props.fixed, props.store);
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return Object.assign({}, cellStyles, fixedStyle);
    };
    const getCellClass = (rowIndex, columnIndex, row, column, offset) => {
      const fixedClasses = getFixedColumnsClass(ns.b(), columnIndex, props == null ? void 0 : props.fixed, props.store, void 0, offset);
      const classes = [column.id, column.align, column.className, ...fixedClasses];
      const cellClassName = parent == null ? void 0 : parent.props.cellClassName;
      if (typeof cellClassName === "string") {
        classes.push(cellClassName);
      } else if (typeof cellClassName === "function") {
        classes.push(cellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }
      classes.push(ns.e("cell"));
      return classes.filter((className) => Boolean(className)).join(" ");
    };
    const getSpan = (row, column, rowIndex, columnIndex) => {
      let rowspan = 1;
      let colspan = 1;
      const fn2 = parent == null ? void 0 : parent.props.spanMethod;
      if (typeof fn2 === "function") {
        const result = fn2({
          row,
          column,
          rowIndex,
          columnIndex
        });
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (typeof result === "object") {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }
      return { rowspan, colspan };
    };
    const getColspanRealWidth = (columns, colspan, index) => {
      if (colspan < 1) {
        return columns[index].realWidth;
      }
      const widthArr = columns.map(({ realWidth, width }) => realWidth || width).slice(index, index + colspan);
      return Number(widthArr.reduce((acc, width) => Number(acc) + Number(width), -1));
    };
    return {
      getRowStyle,
      getRowClass,
      getCellStyle,
      getCellClass,
      getSpan,
      getColspanRealWidth
    };
  }
  function useRender$1(props) {
    const parent = vue.inject(TABLE_INJECTION_KEY);
    const ns = useNamespace("table");
    const {
      handleDoubleClick,
      handleClick,
      handleContextMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleCellMouseEnter,
      handleCellMouseLeave,
      tooltipContent,
      tooltipTrigger
    } = useEvents(props);
    const {
      getRowStyle,
      getRowClass,
      getCellStyle,
      getCellClass,
      getSpan,
      getColspanRealWidth
    } = useStyles(props);
    const firstDefaultColumnIndex = vue.computed(() => {
      return props.store.states.columns.value.findIndex(({ type }) => type === "default");
    });
    const getKeyOfRow = (row, index) => {
      const rowKey = parent.props.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey);
      }
      return index;
    };
    const rowRender = (row, $index, treeRowData, expanded = false) => {
      const { tooltipEffect, tooltipOptions, store } = props;
      const { indent, columns } = store.states;
      const rowClasses = getRowClass(row, $index);
      let display = true;
      if (treeRowData) {
        rowClasses.push(ns.em("row", `level-${treeRowData.level}`));
        display = treeRowData.display;
      }
      const displayStyle = display ? null : {
        display: "none"
      };
      return vue.h("tr", {
        style: [displayStyle, getRowStyle(row, $index)],
        class: rowClasses,
        key: getKeyOfRow(row, $index),
        onDblclick: ($event) => handleDoubleClick($event, row),
        onClick: ($event) => handleClick($event, row),
        onContextmenu: ($event) => handleContextMenu($event, row),
        onMouseenter: () => handleMouseEnter($index),
        onMouseleave: handleMouseLeave
      }, columns.value.map((column, cellIndex) => {
        const { rowspan, colspan } = getSpan(row, column, $index, cellIndex);
        if (!rowspan || !colspan) {
          return null;
        }
        const columnData = Object.assign({}, column);
        columnData.realWidth = getColspanRealWidth(columns.value, colspan, cellIndex);
        const data = {
          store: props.store,
          _self: props.context || parent,
          column: columnData,
          row,
          $index,
          cellIndex,
          expanded
        };
        if (cellIndex === firstDefaultColumnIndex.value && treeRowData) {
          data.treeNode = {
            indent: treeRowData.level * indent.value,
            level: treeRowData.level
          };
          if (typeof treeRowData.expanded === "boolean") {
            data.treeNode.expanded = treeRowData.expanded;
            if ("loading" in treeRowData) {
              data.treeNode.loading = treeRowData.loading;
            }
            if ("noLazyChildren" in treeRowData) {
              data.treeNode.noLazyChildren = treeRowData.noLazyChildren;
            }
          }
        }
        const baseKey = `${getKeyOfRow(row, $index)},${cellIndex}`;
        const patchKey = columnData.columnKey || columnData.rawColumnKey || "";
        const tdChildren = cellChildren(cellIndex, column, data);
        const mergedTooltipOptions = column.showOverflowTooltip && merge$1({
          effect: tooltipEffect
        }, tooltipOptions, column.showOverflowTooltip);
        return vue.h("td", {
          style: getCellStyle($index, cellIndex, row, column),
          class: getCellClass($index, cellIndex, row, column, colspan - 1),
          key: `${patchKey}${baseKey}`,
          rowspan,
          colspan,
          onMouseenter: ($event) => handleCellMouseEnter($event, row, mergedTooltipOptions),
          onMouseleave: handleCellMouseLeave
        }, [tdChildren]);
      }));
    };
    const cellChildren = (cellIndex, column, data) => {
      return column.renderCell(data);
    };
    const wrappedRowRender = (row, $index) => {
      const store = props.store;
      const { isRowExpanded, assertRowKey } = store;
      const { treeData, lazyTreeNodeMap, childrenColumnName, rowKey } = store.states;
      const columns = store.states.columns.value;
      const hasExpandColumn = columns.some(({ type }) => type === "expand");
      if (hasExpandColumn) {
        const expanded = isRowExpanded(row);
        const tr = rowRender(row, $index, void 0, expanded);
        const renderExpanded = parent.renderExpanded;
        if (expanded) {
          if (!renderExpanded) {
            console.error("[Element Error]renderExpanded is required.");
            return tr;
          }
          return [
            [
              tr,
              vue.h("tr", {
                key: `expanded-row__${tr.key}`
              }, [
                vue.h("td", {
                  colspan: columns.length,
                  class: `${ns.e("cell")} ${ns.e("expanded-cell")}`
                }, [renderExpanded({ row, $index, store, expanded })])
              ])
            ]
          ];
        } else {
          return [[tr]];
        }
      } else if (Object.keys(treeData.value).length) {
        assertRowKey();
        const key = getRowIdentity(row, rowKey.value);
        let cur = treeData.value[key];
        let treeRowData = null;
        if (cur) {
          treeRowData = {
            expanded: cur.expanded,
            level: cur.level,
            display: true
          };
          if (typeof cur.lazy === "boolean") {
            if (typeof cur.loaded === "boolean" && cur.loaded) {
              treeRowData.noLazyChildren = !(cur.children && cur.children.length);
            }
            treeRowData.loading = cur.loading;
          }
        }
        const tmp = [rowRender(row, $index, treeRowData)];
        if (cur) {
          let i = 0;
          const traverse = (children, parent2) => {
            if (!(children && children.length && parent2))
              return;
            children.forEach((node) => {
              const innerTreeRowData = {
                display: parent2.display && parent2.expanded,
                level: parent2.level + 1,
                expanded: false,
                noLazyChildren: false,
                loading: false
              };
              const childKey = getRowIdentity(node, rowKey.value);
              if (childKey === void 0 || childKey === null) {
                throw new Error("For nested data item, row-key is required.");
              }
              cur = { ...treeData.value[childKey] };
              if (cur) {
                innerTreeRowData.expanded = cur.expanded;
                cur.level = cur.level || innerTreeRowData.level;
                cur.display = !!(cur.expanded && innerTreeRowData.display);
                if (typeof cur.lazy === "boolean") {
                  if (typeof cur.loaded === "boolean" && cur.loaded) {
                    innerTreeRowData.noLazyChildren = !(cur.children && cur.children.length);
                  }
                  innerTreeRowData.loading = cur.loading;
                }
              }
              i++;
              tmp.push(rowRender(node, $index + i, innerTreeRowData));
              if (cur) {
                const nodes2 = lazyTreeNodeMap.value[childKey] || node[childrenColumnName.value];
                traverse(nodes2, cur);
              }
            });
          };
          cur.display = true;
          const nodes = lazyTreeNodeMap.value[key] || row[childrenColumnName.value];
          traverse(nodes, cur);
        }
        return tmp;
      } else {
        return rowRender(row, $index, void 0);
      }
    };
    return {
      wrappedRowRender,
      tooltipContent,
      tooltipTrigger
    };
  }
  const defaultProps$2 = {
    store: {
      required: true,
      type: Object
    },
    stripe: Boolean,
    tooltipEffect: String,
    tooltipOptions: {
      type: Object
    },
    context: {
      default: () => ({}),
      type: Object
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: {
      type: String,
      default: ""
    },
    highlight: Boolean
  };
  var TableBody = vue.defineComponent({
    name: "ElTableBody",
    props: defaultProps$2,
    setup(props) {
      const instance = vue.getCurrentInstance();
      const parent = vue.inject(TABLE_INJECTION_KEY);
      const ns = useNamespace("table");
      const { wrappedRowRender, tooltipContent, tooltipTrigger } = useRender$1(props);
      const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent);
      const hoveredCellList = [];
      vue.watch(props.store.states.hoverRow, (newVal, oldVal) => {
        var _a2;
        const el = instance == null ? void 0 : instance.vnode.el;
        const rows = Array.from((el == null ? void 0 : el.children) || []).filter((e) => e == null ? void 0 : e.classList.contains(`${ns.e("row")}`));
        let rowNum = newVal;
        const childNodes = (_a2 = rows[rowNum]) == null ? void 0 : _a2.childNodes;
        if (childNodes == null ? void 0 : childNodes.length) {
          let control = 0;
          const indexes = Array.from(childNodes).reduce((acc, item, index) => {
            var _a22, _b;
            if (((_a22 = childNodes[index]) == null ? void 0 : _a22.colSpan) > 1) {
              control = (_b = childNodes[index]) == null ? void 0 : _b.colSpan;
            }
            if (item.nodeName !== "TD" && control === 0) {
              acc.push(index);
            }
            control > 0 && control--;
            return acc;
          }, []);
          indexes.forEach((rowIndex) => {
            var _a22;
            rowNum = newVal;
            while (rowNum > 0) {
              const preChildNodes = (_a22 = rows[rowNum - 1]) == null ? void 0 : _a22.childNodes;
              if (preChildNodes[rowIndex] && preChildNodes[rowIndex].nodeName === "TD" && preChildNodes[rowIndex].rowSpan > 1) {
                addClass(preChildNodes[rowIndex], "hover-cell");
                hoveredCellList.push(preChildNodes[rowIndex]);
                break;
              }
              rowNum--;
            }
          });
        } else {
          hoveredCellList.forEach((item) => removeClass(item, "hover-cell"));
          hoveredCellList.length = 0;
        }
        if (!props.store.states.isComplex.value || !isClient)
          return;
        rAF(() => {
          const oldRow = rows[oldVal];
          const newRow = rows[newVal];
          if (oldRow && !oldRow.classList.contains("hover-fixed-row")) {
            removeClass(oldRow, "hover-row");
          }
          if (newRow) {
            addClass(newRow, "hover-row");
          }
        });
      });
      vue.onUnmounted(() => {
        var _a2;
        (_a2 = removePopper) == null ? void 0 : _a2();
      });
      return {
        ns,
        onColumnsChange,
        onScrollableChange,
        wrappedRowRender,
        tooltipContent,
        tooltipTrigger
      };
    },
    render() {
      const { wrappedRowRender, store } = this;
      const data = store.states.data.value || [];
      return vue.h("tbody", { tabIndex: -1 }, [
        data.reduce((acc, row) => {
          return acc.concat(wrappedRowRender(row, acc.length));
        }, [])
      ]);
    }
  });
  function useMapState() {
    const table = vue.inject(TABLE_INJECTION_KEY);
    const store = table == null ? void 0 : table.store;
    const leftFixedLeafCount = vue.computed(() => {
      return store.states.fixedLeafColumnsLength.value;
    });
    const rightFixedLeafCount = vue.computed(() => {
      return store.states.rightFixedColumns.value.length;
    });
    const columnsCount = vue.computed(() => {
      return store.states.columns.value.length;
    });
    const leftFixedCount = vue.computed(() => {
      return store.states.fixedColumns.value.length;
    });
    const rightFixedCount = vue.computed(() => {
      return store.states.rightFixedColumns.value.length;
    });
    return {
      leftFixedLeafCount,
      rightFixedLeafCount,
      columnsCount,
      leftFixedCount,
      rightFixedCount,
      columns: store.states.columns
    };
  }
  function useStyle$1(props) {
    const { columns } = useMapState();
    const ns = useNamespace("table");
    const getCellClasses = (columns2, cellIndex) => {
      const column = columns2[cellIndex];
      const classes = [
        ns.e("cell"),
        column.id,
        column.align,
        column.labelClassName,
        ...getFixedColumnsClass(ns.b(), cellIndex, column.fixed, props.store)
      ];
      if (column.className) {
        classes.push(column.className);
      }
      if (!column.children) {
        classes.push(ns.is("leaf"));
      }
      return classes;
    };
    const getCellStyles = (column, cellIndex) => {
      const fixedStyle = getFixedColumnOffset(cellIndex, column.fixed, props.store);
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return fixedStyle;
    };
    return {
      getCellClasses,
      getCellStyles,
      columns
    };
  }
  var TableFooter = vue.defineComponent({
    name: "ElTableFooter",
    props: {
      fixed: {
        type: String,
        default: ""
      },
      store: {
        required: true,
        type: Object
      },
      summaryMethod: Function,
      sumText: String,
      border: Boolean,
      defaultSort: {
        type: Object,
        default: () => {
          return {
            prop: "",
            order: ""
          };
        }
      }
    },
    setup(props) {
      const { getCellClasses, getCellStyles, columns } = useStyle$1(props);
      const ns = useNamespace("table");
      return {
        ns,
        getCellClasses,
        getCellStyles,
        columns
      };
    },
    render() {
      const { columns, getCellStyles, getCellClasses, summaryMethod, sumText } = this;
      const data = this.store.states.data.value;
      let sums = [];
      if (summaryMethod) {
        sums = summaryMethod({
          columns,
          data
        });
      } else {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = sumText;
            return;
          }
          const values = data.map((item) => Number(item[column.property]));
          const precisions = [];
          let notNumber = true;
          values.forEach((value) => {
            if (!Number.isNaN(+value)) {
              notNumber = false;
              const decimal = `${value}`.split(".")[1];
              precisions.push(decimal ? decimal.length : 0);
            }
          });
          const precision = Math.max.apply(null, precisions);
          if (!notNumber) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!Number.isNaN(+value)) {
                return Number.parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = "";
          }
        });
      }
      return vue.h(vue.h("tfoot", [
        vue.h("tr", {}, [
          ...columns.map((column, cellIndex) => vue.h("td", {
            key: cellIndex,
            colspan: column.colSpan,
            rowspan: column.rowSpan,
            class: getCellClasses(columns, cellIndex),
            style: getCellStyles(column, cellIndex)
          }, [
            vue.h("div", {
              class: ["cell", column.labelClassName]
            }, [sums[cellIndex]])
          ]))
        ])
      ]));
    }
  });
  function useUtils(store) {
    const setCurrentRow = (row) => {
      store.commit("setCurrentRow", row);
    };
    const getSelectionRows = () => {
      return store.getSelectionRows();
    };
    const toggleRowSelection = (row, selected) => {
      store.toggleRowSelection(row, selected, false);
      store.updateAllSelected();
    };
    const clearSelection = () => {
      store.clearSelection();
    };
    const clearFilter = (columnKeys) => {
      store.clearFilter(columnKeys);
    };
    const toggleAllSelection = () => {
      store.commit("toggleAllSelection");
    };
    const toggleRowExpansion = (row, expanded) => {
      store.toggleRowExpansionAdapter(row, expanded);
    };
    const clearSort = () => {
      store.clearSort();
    };
    const sort = (prop, order) => {
      store.commit("sort", { prop, order });
    };
    return {
      setCurrentRow,
      getSelectionRows,
      toggleRowSelection,
      clearSelection,
      clearFilter,
      toggleAllSelection,
      toggleRowExpansion,
      clearSort,
      sort
    };
  }
  function useStyle(props, layout, store, table) {
    const isHidden2 = vue.ref(false);
    const renderExpanded = vue.ref(null);
    const resizeProxyVisible = vue.ref(false);
    const setDragVisible = (visible) => {
      resizeProxyVisible.value = visible;
    };
    const resizeState = vue.ref({
      width: null,
      height: null,
      headerHeight: null
    });
    const isGroup = vue.ref(false);
    const scrollbarViewStyle = {
      display: "inline-block",
      verticalAlign: "middle"
    };
    const tableWidth = vue.ref();
    const tableScrollHeight = vue.ref(0);
    const bodyScrollHeight = vue.ref(0);
    const headerScrollHeight = vue.ref(0);
    const footerScrollHeight = vue.ref(0);
    const appendScrollHeight = vue.ref(0);
    vue.watchEffect(() => {
      layout.setHeight(props.height);
    });
    vue.watchEffect(() => {
      layout.setMaxHeight(props.maxHeight);
    });
    vue.watch(() => [props.currentRowKey, store.states.rowKey], ([currentRowKey, rowKey]) => {
      if (!vue.unref(rowKey) || !vue.unref(currentRowKey))
        return;
      store.setCurrentRowKey(`${currentRowKey}`);
    }, {
      immediate: true
    });
    vue.watch(() => props.data, (data) => {
      table.store.commit("setData", data);
    }, {
      immediate: true,
      deep: true
    });
    vue.watchEffect(() => {
      if (props.expandRowKeys) {
        store.setExpandRowKeysAdapter(props.expandRowKeys);
      }
    });
    const handleMouseLeave = () => {
      table.store.commit("setHoverRow", null);
      if (table.hoverState)
        table.hoverState = null;
    };
    const handleHeaderFooterMousewheel = (event, data) => {
      const { pixelX, pixelY } = data;
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
      }
    };
    const shouldUpdateHeight = vue.computed(() => {
      return props.height || props.maxHeight || store.states.fixedColumns.value.length > 0 || store.states.rightFixedColumns.value.length > 0;
    });
    const tableBodyStyles = vue.computed(() => {
      return {
        width: layout.bodyWidth.value ? `${layout.bodyWidth.value}px` : ""
      };
    });
    const doLayout = () => {
      if (shouldUpdateHeight.value) {
        layout.updateElsHeight();
      }
      layout.updateColumnsWidth();
      requestAnimationFrame(syncPosition);
    };
    vue.onMounted(async () => {
      await vue.nextTick();
      store.updateColumns();
      bindEvents();
      requestAnimationFrame(doLayout);
      const el = table.vnode.el;
      const tableHeader = table.refs.headerWrapper;
      if (props.flexible && el && el.parentElement) {
        el.parentElement.style.minWidth = "0";
      }
      resizeState.value = {
        width: tableWidth.value = el.offsetWidth,
        height: el.offsetHeight,
        headerHeight: props.showHeader && tableHeader ? tableHeader.offsetHeight : null
      };
      store.states.columns.value.forEach((column) => {
        if (column.filteredValue && column.filteredValue.length) {
          table.store.commit("filterChange", {
            column,
            values: column.filteredValue,
            silent: true
          });
        }
      });
      table.$ready = true;
    });
    const setScrollClassByEl = (el, className) => {
      if (!el)
        return;
      const classList = Array.from(el.classList).filter((item) => !item.startsWith("is-scrolling-"));
      classList.push(layout.scrollX.value ? className : "is-scrolling-none");
      el.className = classList.join(" ");
    };
    const setScrollClass = (className) => {
      const { tableWrapper } = table.refs;
      setScrollClassByEl(tableWrapper, className);
    };
    const hasScrollClass = (className) => {
      const { tableWrapper } = table.refs;
      return !!(tableWrapper && tableWrapper.classList.contains(className));
    };
    const syncPosition = function() {
      if (!table.refs.scrollBarRef)
        return;
      if (!layout.scrollX.value) {
        const scrollingNoneClass = "is-scrolling-none";
        if (!hasScrollClass(scrollingNoneClass)) {
          setScrollClass(scrollingNoneClass);
        }
        return;
      }
      const scrollContainer = table.refs.scrollBarRef.wrapRef;
      if (!scrollContainer)
        return;
      const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer;
      const { headerWrapper, footerWrapper } = table.refs;
      if (headerWrapper)
        headerWrapper.scrollLeft = scrollLeft;
      if (footerWrapper)
        footerWrapper.scrollLeft = scrollLeft;
      const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
      if (scrollLeft >= maxScrollLeftPosition) {
        setScrollClass("is-scrolling-right");
      } else if (scrollLeft === 0) {
        setScrollClass("is-scrolling-left");
      } else {
        setScrollClass("is-scrolling-middle");
      }
    };
    const bindEvents = () => {
      if (!table.refs.scrollBarRef)
        return;
      if (table.refs.scrollBarRef.wrapRef) {
        useEventListener(table.refs.scrollBarRef.wrapRef, "scroll", syncPosition, {
          passive: true
        });
      }
      if (props.fit) {
        useResizeObserver(table.vnode.el, resizeListener);
      } else {
        useEventListener(window, "resize", resizeListener);
      }
      useResizeObserver(table.refs.bodyWrapper, () => {
        var _a2, _b;
        resizeListener();
        (_b = (_a2 = table.refs) == null ? void 0 : _a2.scrollBarRef) == null ? void 0 : _b.update();
      });
    };
    const resizeListener = () => {
      var _a2, _b, _c, _d;
      const el = table.vnode.el;
      if (!table.$ready || !el)
        return;
      let shouldUpdateLayout = false;
      const {
        width: oldWidth,
        height: oldHeight,
        headerHeight: oldHeaderHeight
      } = resizeState.value;
      const width = tableWidth.value = el.offsetWidth;
      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }
      const height = el.offsetHeight;
      if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }
      const tableHeader = props.tableLayout === "fixed" ? table.refs.headerWrapper : (_a2 = table.refs.tableHeaderRef) == null ? void 0 : _a2.$el;
      if (props.showHeader && (tableHeader == null ? void 0 : tableHeader.offsetHeight) !== oldHeaderHeight) {
        shouldUpdateLayout = true;
      }
      tableScrollHeight.value = ((_b = table.refs.tableWrapper) == null ? void 0 : _b.scrollHeight) || 0;
      headerScrollHeight.value = (tableHeader == null ? void 0 : tableHeader.scrollHeight) || 0;
      footerScrollHeight.value = ((_c = table.refs.footerWrapper) == null ? void 0 : _c.offsetHeight) || 0;
      appendScrollHeight.value = ((_d = table.refs.appendWrapper) == null ? void 0 : _d.offsetHeight) || 0;
      bodyScrollHeight.value = tableScrollHeight.value - headerScrollHeight.value - footerScrollHeight.value - appendScrollHeight.value;
      if (shouldUpdateLayout) {
        resizeState.value = {
          width,
          height,
          headerHeight: props.showHeader && (tableHeader == null ? void 0 : tableHeader.offsetHeight) || 0
        };
        doLayout();
      }
    };
    const tableSize = useFormSize();
    const bodyWidth = vue.computed(() => {
      const { bodyWidth: bodyWidth_, scrollY, gutterWidth } = layout;
      return bodyWidth_.value ? `${bodyWidth_.value - (scrollY.value ? gutterWidth : 0)}px` : "";
    });
    const tableLayout = vue.computed(() => {
      if (props.maxHeight)
        return "fixed";
      return props.tableLayout;
    });
    const emptyBlockStyle = vue.computed(() => {
      if (props.data && props.data.length)
        return null;
      let height = "100%";
      if (props.height && bodyScrollHeight.value) {
        height = `${bodyScrollHeight.value}px`;
      }
      const width = tableWidth.value;
      return {
        width: width ? `${width}px` : "",
        height
      };
    });
    const tableInnerStyle = vue.computed(() => {
      if (props.height) {
        return {
          height: !Number.isNaN(Number(props.height)) ? `${props.height}px` : props.height
        };
      }
      if (props.maxHeight) {
        return {
          maxHeight: !Number.isNaN(Number(props.maxHeight)) ? `${props.maxHeight}px` : props.maxHeight
        };
      }
      return {};
    });
    const scrollbarStyle = vue.computed(() => {
      if (props.height) {
        return {
          height: "100%"
        };
      }
      if (props.maxHeight) {
        if (!Number.isNaN(Number(props.maxHeight))) {
          return {
            maxHeight: `${props.maxHeight - headerScrollHeight.value - footerScrollHeight.value}px`
          };
        } else {
          return {
            maxHeight: `calc(${props.maxHeight} - ${headerScrollHeight.value + footerScrollHeight.value}px)`
          };
        }
      }
      return {};
    });
    const handleFixedMousewheel = (event, data) => {
      const bodyWrapper = table.refs.bodyWrapper;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
          event.preventDefault();
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5);
      } else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5);
      }
    };
    return {
      isHidden: isHidden2,
      renderExpanded,
      setDragVisible,
      isGroup,
      handleMouseLeave,
      handleHeaderFooterMousewheel,
      tableSize,
      emptyBlockStyle,
      handleFixedMousewheel,
      resizeProxyVisible,
      bodyWidth,
      resizeState,
      doLayout,
      tableBodyStyles,
      tableLayout,
      scrollbarViewStyle,
      tableInnerStyle,
      scrollbarStyle
    };
  }
  function useKeyRender(table) {
    const observer = vue.ref();
    const initWatchDom = () => {
      const el = table.vnode.el;
      const columnsWrapper = el.querySelector(".hidden-columns");
      const config = { childList: true, subtree: true };
      const updateOrderFns = table.store.states.updateOrderFns;
      observer.value = new MutationObserver(() => {
        updateOrderFns.forEach((fn2) => fn2());
      });
      observer.value.observe(columnsWrapper, config);
    };
    vue.onMounted(() => {
      initWatchDom();
    });
    vue.onUnmounted(() => {
      var _a2;
      (_a2 = observer.value) == null ? void 0 : _a2.disconnect();
    });
  }
  var defaultProps$1 = {
    data: {
      type: Array,
      default: () => []
    },
    size: useSizeProp,
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    fit: {
      type: Boolean,
      default: true
    },
    stripe: Boolean,
    border: Boolean,
    rowKey: [String, Function],
    showHeader: {
      type: Boolean,
      default: true
    },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    tooltipOptions: Object,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          hasChildren: "hasChildren",
          children: "children"
        };
      }
    },
    lazy: Boolean,
    load: Function,
    style: {
      type: Object,
      default: () => ({})
    },
    className: {
      type: String,
      default: ""
    },
    tableLayout: {
      type: String,
      default: "fixed"
    },
    scrollbarAlwaysOn: Boolean,
    flexible: Boolean,
    showOverflowTooltip: [Boolean, Object]
  };
  function hColgroup(props) {
    const isAuto = props.tableLayout === "auto";
    let columns = props.columns || [];
    if (isAuto) {
      if (columns.every((column) => column.width === void 0)) {
        columns = [];
      }
    }
    const getPropsData = (column) => {
      const propsData = {
        key: `${props.tableLayout}_${column.id}`,
        style: {},
        name: void 0
      };
      if (isAuto) {
        propsData.style = {
          width: `${column.width}px`
        };
      } else {
        propsData.name = column.id;
      }
      return propsData;
    };
    return vue.h("colgroup", {}, columns.map((column) => vue.h("col", getPropsData(column))));
  }
  hColgroup.props = ["columns", "tableLayout"];
  const useScrollbar = () => {
    const scrollBarRef = vue.ref();
    const scrollTo = (options, yCoord) => {
      const scrollbar = scrollBarRef.value;
      if (scrollbar) {
        scrollbar.scrollTo(options, yCoord);
      }
    };
    const setScrollPosition = (position, offset) => {
      const scrollbar = scrollBarRef.value;
      if (scrollbar && isNumber(offset) && ["Top", "Left"].includes(position)) {
        scrollbar[`setScroll${position}`](offset);
      }
    };
    const setScrollTop = (top) => setScrollPosition("Top", top);
    const setScrollLeft = (left) => setScrollPosition("Left", left);
    return {
      scrollBarRef,
      scrollTo,
      setScrollTop,
      setScrollLeft
    };
  };
  let tableIdSeed = 1;
  const _sfc_main$2 = vue.defineComponent({
    name: "ElTable",
    directives: {
      Mousewheel
    },
    components: {
      TableHeader,
      TableBody,
      TableFooter,
      ElScrollbar,
      hColgroup
    },
    props: defaultProps$1,
    emits: [
      "select",
      "select-all",
      "selection-change",
      "cell-mouse-enter",
      "cell-mouse-leave",
      "cell-contextmenu",
      "cell-click",
      "cell-dblclick",
      "row-click",
      "row-contextmenu",
      "row-dblclick",
      "header-click",
      "header-contextmenu",
      "sort-change",
      "filter-change",
      "current-change",
      "header-dragend",
      "expand-change"
    ],
    setup(props) {
      const { t } = useLocale();
      const ns = useNamespace("table");
      const table = vue.getCurrentInstance();
      vue.provide(TABLE_INJECTION_KEY, table);
      const store = createStore(table, props);
      table.store = store;
      const layout = new TableLayout({
        store: table.store,
        table,
        fit: props.fit,
        showHeader: props.showHeader
      });
      table.layout = layout;
      const isEmpty = vue.computed(() => (store.states.data.value || []).length === 0);
      const {
        setCurrentRow,
        getSelectionRows,
        toggleRowSelection,
        clearSelection,
        clearFilter,
        toggleAllSelection,
        toggleRowExpansion,
        clearSort,
        sort
      } = useUtils(store);
      const {
        isHidden: isHidden2,
        renderExpanded,
        setDragVisible,
        isGroup,
        handleMouseLeave,
        handleHeaderFooterMousewheel,
        tableSize,
        emptyBlockStyle,
        handleFixedMousewheel,
        resizeProxyVisible,
        bodyWidth,
        resizeState,
        doLayout,
        tableBodyStyles,
        tableLayout,
        scrollbarViewStyle,
        tableInnerStyle,
        scrollbarStyle
      } = useStyle(props, layout, store, table);
      const { scrollBarRef, scrollTo, setScrollLeft, setScrollTop } = useScrollbar();
      const debouncedUpdateLayout = debounce(doLayout, 50);
      const tableId = `${ns.namespace.value}-table_${tableIdSeed++}`;
      table.tableId = tableId;
      table.state = {
        isGroup,
        resizeState,
        doLayout,
        debouncedUpdateLayout
      };
      const computedSumText = vue.computed(() => props.sumText || t("el.table.sumText"));
      const computedEmptyText = vue.computed(() => {
        return props.emptyText || t("el.table.emptyText");
      });
      useKeyRender(table);
      return {
        ns,
        layout,
        store,
        handleHeaderFooterMousewheel,
        handleMouseLeave,
        tableId,
        tableSize,
        isHidden: isHidden2,
        isEmpty,
        renderExpanded,
        resizeProxyVisible,
        resizeState,
        isGroup,
        bodyWidth,
        tableBodyStyles,
        emptyBlockStyle,
        debouncedUpdateLayout,
        handleFixedMousewheel,
        setCurrentRow,
        getSelectionRows,
        toggleRowSelection,
        clearSelection,
        clearFilter,
        toggleAllSelection,
        toggleRowExpansion,
        clearSort,
        doLayout,
        sort,
        t,
        setDragVisible,
        context: table,
        computedSumText,
        computedEmptyText,
        tableLayout,
        scrollbarViewStyle,
        tableInnerStyle,
        scrollbarStyle,
        scrollBarRef,
        scrollTo,
        setScrollLeft,
        setScrollTop
      };
    }
  });
  const _hoisted_1$2 = ["data-prefix"];
  const _hoisted_2$2 = {
    ref: "hiddenColumns",
    class: "hidden-columns"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_hColgroup = vue.resolveComponent("hColgroup");
    const _component_table_header = vue.resolveComponent("table-header");
    const _component_table_body = vue.resolveComponent("table-body");
    const _component_table_footer = vue.resolveComponent("table-footer");
    const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
    const _directive_mousewheel = vue.resolveDirective("mousewheel");
    return vue.openBlock(), vue.createElementBlock("div", {
      ref: "tableWrapper",
      class: vue.normalizeClass([
        {
          [_ctx.ns.m("fit")]: _ctx.fit,
          [_ctx.ns.m("striped")]: _ctx.stripe,
          [_ctx.ns.m("border")]: _ctx.border || _ctx.isGroup,
          [_ctx.ns.m("hidden")]: _ctx.isHidden,
          [_ctx.ns.m("group")]: _ctx.isGroup,
          [_ctx.ns.m("fluid-height")]: _ctx.maxHeight,
          [_ctx.ns.m("scrollable-x")]: _ctx.layout.scrollX.value,
          [_ctx.ns.m("scrollable-y")]: _ctx.layout.scrollY.value,
          [_ctx.ns.m("enable-row-hover")]: !_ctx.store.states.isComplex.value,
          [_ctx.ns.m("enable-row-transition")]: (_ctx.store.states.data.value || []).length !== 0 && (_ctx.store.states.data.value || []).length < 100,
          "has-footer": _ctx.showSummary
        },
        _ctx.ns.m(_ctx.tableSize),
        _ctx.className,
        _ctx.ns.b(),
        _ctx.ns.m(`layout-${_ctx.tableLayout}`)
      ]),
      style: vue.normalizeStyle(_ctx.style),
      "data-prefix": _ctx.ns.namespace.value,
      onMouseleave: _cache[0] || (_cache[0] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args))
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(_ctx.ns.e("inner-wrapper")),
        style: vue.normalizeStyle(_ctx.tableInnerStyle)
      }, [
        vue.createElementVNode("div", _hoisted_2$2, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 512),
        _ctx.showHeader && _ctx.tableLayout === "fixed" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          ref: "headerWrapper",
          class: vue.normalizeClass(_ctx.ns.e("header-wrapper"))
        }, [
          vue.createElementVNode("table", {
            ref: "tableHeader",
            class: vue.normalizeClass(_ctx.ns.e("header")),
            style: vue.normalizeStyle(_ctx.tableBodyStyles),
            border: "0",
            cellpadding: "0",
            cellspacing: "0"
          }, [
            vue.createVNode(_component_hColgroup, {
              columns: _ctx.store.states.columns.value,
              "table-layout": _ctx.tableLayout
            }, null, 8, ["columns", "table-layout"]),
            vue.createVNode(_component_table_header, {
              ref: "tableHeaderRef",
              border: _ctx.border,
              "default-sort": _ctx.defaultSort,
              store: _ctx.store,
              onSetDragVisible: _ctx.setDragVisible
            }, null, 8, ["border", "default-sort", "store", "onSetDragVisible"])
          ], 6)
        ], 2)), [
          [_directive_mousewheel, _ctx.handleHeaderFooterMousewheel]
        ]) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("div", {
          ref: "bodyWrapper",
          class: vue.normalizeClass(_ctx.ns.e("body-wrapper"))
        }, [
          vue.createVNode(_component_el_scrollbar, {
            ref: "scrollBarRef",
            "view-style": _ctx.scrollbarViewStyle,
            "wrap-style": _ctx.scrollbarStyle,
            always: _ctx.scrollbarAlwaysOn
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("table", {
                ref: "tableBody",
                class: vue.normalizeClass(_ctx.ns.e("body")),
                cellspacing: "0",
                cellpadding: "0",
                border: "0",
                style: vue.normalizeStyle({
                  width: _ctx.bodyWidth,
                  tableLayout: _ctx.tableLayout
                })
              }, [
                vue.createVNode(_component_hColgroup, {
                  columns: _ctx.store.states.columns.value,
                  "table-layout": _ctx.tableLayout
                }, null, 8, ["columns", "table-layout"]),
                _ctx.showHeader && _ctx.tableLayout === "auto" ? (vue.openBlock(), vue.createBlock(_component_table_header, {
                  key: 0,
                  ref: "tableHeaderRef",
                  class: vue.normalizeClass(_ctx.ns.e("body-header")),
                  border: _ctx.border,
                  "default-sort": _ctx.defaultSort,
                  store: _ctx.store,
                  onSetDragVisible: _ctx.setDragVisible
                }, null, 8, ["class", "border", "default-sort", "store", "onSetDragVisible"])) : vue.createCommentVNode("v-if", true),
                vue.createVNode(_component_table_body, {
                  context: _ctx.context,
                  highlight: _ctx.highlightCurrentRow,
                  "row-class-name": _ctx.rowClassName,
                  "tooltip-effect": _ctx.tooltipEffect,
                  "tooltip-options": _ctx.tooltipOptions,
                  "row-style": _ctx.rowStyle,
                  store: _ctx.store,
                  stripe: _ctx.stripe
                }, null, 8, ["context", "highlight", "row-class-name", "tooltip-effect", "tooltip-options", "row-style", "store", "stripe"]),
                _ctx.showSummary && _ctx.tableLayout === "auto" ? (vue.openBlock(), vue.createBlock(_component_table_footer, {
                  key: 1,
                  class: vue.normalizeClass(_ctx.ns.e("body-footer")),
                  border: _ctx.border,
                  "default-sort": _ctx.defaultSort,
                  store: _ctx.store,
                  "sum-text": _ctx.computedSumText,
                  "summary-method": _ctx.summaryMethod
                }, null, 8, ["class", "border", "default-sort", "store", "sum-text", "summary-method"])) : vue.createCommentVNode("v-if", true)
              ], 6),
              _ctx.isEmpty ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                ref: "emptyBlock",
                style: vue.normalizeStyle(_ctx.emptyBlockStyle),
                class: vue.normalizeClass(_ctx.ns.e("empty-block"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(_ctx.ns.e("empty-text"))
                }, [
                  vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.computedEmptyText), 1)
                  ])
                ], 2)
              ], 6)) : vue.createCommentVNode("v-if", true),
              _ctx.$slots.append ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                ref: "appendWrapper",
                class: vue.normalizeClass(_ctx.ns.e("append-wrapper"))
              }, [
                vue.renderSlot(_ctx.$slots, "append")
              ], 2)) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["view-style", "wrap-style", "always"])
        ], 2),
        _ctx.showSummary && _ctx.tableLayout === "fixed" ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          ref: "footerWrapper",
          class: vue.normalizeClass(_ctx.ns.e("footer-wrapper"))
        }, [
          vue.createElementVNode("table", {
            class: vue.normalizeClass(_ctx.ns.e("footer")),
            cellspacing: "0",
            cellpadding: "0",
            border: "0",
            style: vue.normalizeStyle(_ctx.tableBodyStyles)
          }, [
            vue.createVNode(_component_hColgroup, {
              columns: _ctx.store.states.columns.value,
              "table-layout": _ctx.tableLayout
            }, null, 8, ["columns", "table-layout"]),
            vue.createVNode(_component_table_footer, {
              border: _ctx.border,
              "default-sort": _ctx.defaultSort,
              store: _ctx.store,
              "sum-text": _ctx.computedSumText,
              "summary-method": _ctx.summaryMethod
            }, null, 8, ["border", "default-sort", "store", "sum-text", "summary-method"])
          ], 6)
        ], 2)), [
          [vue.vShow, !_ctx.isEmpty],
          [_directive_mousewheel, _ctx.handleHeaderFooterMousewheel]
        ]) : vue.createCommentVNode("v-if", true),
        _ctx.border || _ctx.isGroup ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(_ctx.ns.e("border-left-patch"))
        }, null, 2)) : vue.createCommentVNode("v-if", true)
      ], 6),
      vue.withDirectives(vue.createElementVNode("div", {
        ref: "resizeProxy",
        class: vue.normalizeClass(_ctx.ns.e("column-resize-proxy"))
      }, null, 2), [
        [vue.vShow, _ctx.resizeProxyVisible]
      ])
    ], 46, _hoisted_1$2);
  }
  var Table = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["render", _sfc_render], ["__file", "table.vue"]]);
  const defaultClassNames = {
    selection: "table-column--selection",
    expand: "table__expand-column"
  };
  const cellStarts = {
    default: {
      order: ""
    },
    selection: {
      width: 48,
      minWidth: 48,
      realWidth: 48,
      order: ""
    },
    expand: {
      width: 48,
      minWidth: 48,
      realWidth: 48,
      order: ""
    },
    index: {
      width: 48,
      minWidth: 48,
      realWidth: 48,
      order: ""
    }
  };
  const getDefaultClassName = (type) => {
    return defaultClassNames[type] || "";
  };
  const cellForced = {
    selection: {
      renderHeader({ store, column }) {
        function isDisabled() {
          return store.states.data.value && store.states.data.value.length === 0;
        }
        return vue.h(ElCheckbox, {
          disabled: isDisabled(),
          size: store.states.tableSize.value,
          indeterminate: store.states.selection.value.length > 0 && !store.states.isAllSelected.value,
          "onUpdate:modelValue": store.toggleAllSelection,
          modelValue: store.states.isAllSelected.value,
          ariaLabel: column.label
        });
      },
      renderCell({
        row,
        column,
        store,
        $index
      }) {
        return vue.h(ElCheckbox, {
          disabled: column.selectable ? !column.selectable.call(null, row, $index) : false,
          size: store.states.tableSize.value,
          onChange: () => {
            store.commit("rowSelectedChanged", row);
          },
          onClick: (event) => event.stopPropagation(),
          modelValue: store.isSelected(row),
          ariaLabel: column.label
        });
      },
      sortable: false,
      resizable: false
    },
    index: {
      renderHeader({ column }) {
        return column.label || "#";
      },
      renderCell({
        column,
        $index
      }) {
        let i = $index + 1;
        const index = column.index;
        if (typeof index === "number") {
          i = $index + index;
        } else if (typeof index === "function") {
          i = index($index);
        }
        return vue.h("div", {}, [i]);
      },
      sortable: false
    },
    expand: {
      renderHeader({ column }) {
        return column.label || "";
      },
      renderCell({
        row,
        store,
        expanded
      }) {
        const { ns } = store;
        const classes = [ns.e("expand-icon")];
        if (expanded) {
          classes.push(ns.em("expand-icon", "expanded"));
        }
        const callback = function(e) {
          e.stopPropagation();
          store.toggleRowExpansion(row);
        };
        return vue.h("div", {
          class: classes,
          onClick: callback
        }, {
          default: () => {
            return [
              vue.h(ElIcon, null, {
                default: () => {
                  return [vue.h(arrow_right_default)];
                }
              })
            ];
          }
        });
      },
      sortable: false,
      resizable: false
    }
  };
  function defaultRenderCell({
    row,
    column,
    $index
  }) {
    var _a2;
    const property2 = column.property;
    const value = property2 && getProp(row, property2).value;
    if (column && column.formatter) {
      return column.formatter(row, column, value, $index);
    }
    return ((_a2 = value == null ? void 0 : value.toString) == null ? void 0 : _a2.call(value)) || "";
  }
  function treeCellPrefix({
    row,
    treeNode,
    store
  }, createPlaceholder = false) {
    const { ns } = store;
    if (!treeNode) {
      if (createPlaceholder) {
        return [
          vue.h("span", {
            class: ns.e("placeholder")
          })
        ];
      }
      return null;
    }
    const ele = [];
    const callback = function(e) {
      e.stopPropagation();
      if (treeNode.loading) {
        return;
      }
      store.loadOrToggle(row);
    };
    if (treeNode.indent) {
      ele.push(vue.h("span", {
        class: ns.e("indent"),
        style: { "padding-left": `${treeNode.indent}px` }
      }));
    }
    if (typeof treeNode.expanded === "boolean" && !treeNode.noLazyChildren) {
      const expandClasses = [
        ns.e("expand-icon"),
        treeNode.expanded ? ns.em("expand-icon", "expanded") : ""
      ];
      let icon = arrow_right_default;
      if (treeNode.loading) {
        icon = loading_default;
      }
      ele.push(vue.h("div", {
        class: expandClasses,
        onClick: callback
      }, {
        default: () => {
          return [
            vue.h(ElIcon, { class: { [ns.is("loading")]: treeNode.loading } }, {
              default: () => [vue.h(icon)]
            })
          ];
        }
      }));
    } else {
      ele.push(vue.h("span", {
        class: ns.e("placeholder")
      }));
    }
    return ele;
  }
  function getAllAliases(props, aliases) {
    return props.reduce((prev, cur) => {
      prev[cur] = cur;
      return prev;
    }, aliases);
  }
  function useWatcher(owner, props_) {
    const instance = vue.getCurrentInstance();
    const registerComplexWatchers = () => {
      const props = ["fixed"];
      const aliases = {
        realWidth: "width",
        realMinWidth: "minWidth"
      };
      const allAliases = getAllAliases(props, aliases);
      Object.keys(allAliases).forEach((key) => {
        const columnKey = aliases[key];
        if (hasOwn(props_, columnKey)) {
          vue.watch(() => props_[columnKey], (newVal) => {
            let value = newVal;
            if (columnKey === "width" && key === "realWidth") {
              value = parseWidth(newVal);
            }
            if (columnKey === "minWidth" && key === "realMinWidth") {
              value = parseMinWidth(newVal);
            }
            instance.columnConfig.value[columnKey] = value;
            instance.columnConfig.value[key] = value;
            const updateColumns = columnKey === "fixed";
            owner.value.store.scheduleLayout(updateColumns);
          });
        }
      });
    };
    const registerNormalWatchers = () => {
      const props = [
        "label",
        "filters",
        "filterMultiple",
        "filteredValue",
        "sortable",
        "index",
        "formatter",
        "className",
        "labelClassName",
        "filterClassName",
        "showOverflowTooltip"
      ];
      const aliases = {
        property: "prop",
        align: "realAlign",
        headerAlign: "realHeaderAlign"
      };
      const allAliases = getAllAliases(props, aliases);
      Object.keys(allAliases).forEach((key) => {
        const columnKey = aliases[key];
        if (hasOwn(props_, columnKey)) {
          vue.watch(() => props_[columnKey], (newVal) => {
            instance.columnConfig.value[key] = newVal;
          });
        }
      });
    };
    return {
      registerComplexWatchers,
      registerNormalWatchers
    };
  }
  function useRender(props, slots, owner) {
    const instance = vue.getCurrentInstance();
    const columnId = vue.ref("");
    const isSubColumn = vue.ref(false);
    const realAlign = vue.ref();
    const realHeaderAlign = vue.ref();
    const ns = useNamespace("table");
    vue.watchEffect(() => {
      realAlign.value = props.align ? `is-${props.align}` : null;
      realAlign.value;
    });
    vue.watchEffect(() => {
      realHeaderAlign.value = props.headerAlign ? `is-${props.headerAlign}` : realAlign.value;
      realHeaderAlign.value;
    });
    const columnOrTableParent = vue.computed(() => {
      let parent = instance.vnode.vParent || instance.parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.vnode.vParent || parent.parent;
      }
      return parent;
    });
    const hasTreeColumn = vue.computed(() => {
      const { store } = instance.parent;
      if (!store)
        return false;
      const { treeData } = store.states;
      const treeDataValue = treeData.value;
      return treeDataValue && Object.keys(treeDataValue).length > 0;
    });
    const realWidth = vue.ref(parseWidth(props.width));
    const realMinWidth = vue.ref(parseMinWidth(props.minWidth));
    const setColumnWidth = (column) => {
      if (realWidth.value)
        column.width = realWidth.value;
      if (realMinWidth.value) {
        column.minWidth = realMinWidth.value;
      }
      if (!realWidth.value && realMinWidth.value) {
        column.width = void 0;
      }
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = Number(column.width === void 0 ? column.minWidth : column.width);
      return column;
    };
    const setColumnForcedProps = (column) => {
      const type = column.type;
      const source = cellForced[type] || {};
      Object.keys(source).forEach((prop) => {
        const value = source[prop];
        if (prop !== "className" && value !== void 0) {
          column[prop] = value;
        }
      });
      const className = getDefaultClassName(type);
      if (className) {
        const forceClass = `${vue.unref(ns.namespace)}-${className}`;
        column.className = column.className ? `${column.className} ${forceClass}` : forceClass;
      }
      return column;
    };
    const checkSubColumn = (children) => {
      if (Array.isArray(children)) {
        children.forEach((child) => check(child));
      } else {
        check(children);
      }
      function check(item) {
        var _a2;
        if (((_a2 = item == null ? void 0 : item.type) == null ? void 0 : _a2.name) === "ElTableColumn") {
          item.vParent = instance;
        }
      }
    };
    const setColumnRenders = (column) => {
      if (props.renderHeader)
        ;
      else if (column.type !== "selection") {
        column.renderHeader = (scope) => {
          instance.columnConfig.value["label"];
          return vue.renderSlot(slots, "header", scope, () => [column.label]);
        };
      }
      let originRenderCell = column.renderCell;
      if (column.type === "expand") {
        column.renderCell = (data) => vue.h("div", {
          class: "cell"
        }, [originRenderCell(data)]);
        owner.value.renderExpanded = (data) => {
          return slots.default ? slots.default(data) : slots.default;
        };
      } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        column.renderCell = (data) => {
          let children = null;
          if (slots.default) {
            const vnodes = slots.default(data);
            children = vnodes.some((v2) => v2.type !== vue.Comment) ? vnodes : originRenderCell(data);
          } else {
            children = originRenderCell(data);
          }
          const { columns } = owner.value.store.states;
          const firstUserColumnIndex = columns.value.findIndex((item) => item.type === "default");
          const shouldCreatePlaceholder = hasTreeColumn.value && data.cellIndex === firstUserColumnIndex;
          const prefix = treeCellPrefix(data, shouldCreatePlaceholder);
          const props2 = {
            class: "cell",
            style: {}
          };
          if (column.showOverflowTooltip) {
            props2.class = `${props2.class} ${vue.unref(ns.namespace)}-tooltip`;
            props2.style = {
              width: `${(data.column.realWidth || Number(data.column.width)) - 1}px`
            };
          }
          checkSubColumn(children);
          return vue.h("div", props2, [prefix, children]);
        };
      }
      return column;
    };
    const getPropsData = (...propsKey) => {
      return propsKey.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((key) => {
            prev[key] = props[key];
          });
        }
        return prev;
      }, {});
    };
    const getColumnElIndex = (children, child) => {
      return Array.prototype.indexOf.call(children, child);
    };
    const updateColumnOrder = () => {
      owner.value.store.commit("updateColumnOrder", instance.columnConfig.value);
    };
    return {
      columnId,
      realAlign,
      isSubColumn,
      realHeaderAlign,
      columnOrTableParent,
      setColumnWidth,
      setColumnForcedProps,
      setColumnRenders,
      getPropsData,
      getColumnElIndex,
      updateColumnOrder
    };
  }
  var defaultProps = {
    type: {
      type: String,
      default: "default"
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {
      type: [String, Number],
      default: ""
    },
    minWidth: {
      type: [String, Number],
      default: ""
    },
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showOverflowTooltip: {
      type: [Boolean, Object],
      default: void 0
    },
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    filterClassName: String,
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default: () => {
        return ["ascending", "descending", null];
      },
      validator: (val) => {
        return val.every((order) => ["ascending", "descending", null].includes(order));
      }
    }
  };
  let columnIdSeed = 1;
  var ElTableColumn$1 = vue.defineComponent({
    name: "ElTableColumn",
    components: {
      ElCheckbox
    },
    props: defaultProps,
    setup(props, { slots }) {
      const instance = vue.getCurrentInstance();
      const columnConfig = vue.ref({});
      const owner = vue.computed(() => {
        let parent2 = instance.parent;
        while (parent2 && !parent2.tableId) {
          parent2 = parent2.parent;
        }
        return parent2;
      });
      const { registerNormalWatchers, registerComplexWatchers } = useWatcher(owner, props);
      const {
        columnId,
        isSubColumn,
        realHeaderAlign,
        columnOrTableParent,
        setColumnWidth,
        setColumnForcedProps,
        setColumnRenders,
        getPropsData,
        getColumnElIndex,
        realAlign,
        updateColumnOrder
      } = useRender(props, slots, owner);
      const parent = columnOrTableParent.value;
      columnId.value = `${parent.tableId || parent.columnId}_column_${columnIdSeed++}`;
      vue.onBeforeMount(() => {
        isSubColumn.value = owner.value !== parent;
        const type = props.type || "default";
        const sortable = props.sortable === "" ? true : props.sortable;
        const showOverflowTooltip = isUndefined(props.showOverflowTooltip) ? parent.props.showOverflowTooltip : props.showOverflowTooltip;
        const defaults = {
          ...cellStarts[type],
          id: columnId.value,
          type,
          property: props.prop || props.property,
          align: realAlign,
          headerAlign: realHeaderAlign,
          showOverflowTooltip,
          filterable: props.filters || props.filterMethod,
          filteredValue: [],
          filterPlacement: "",
          filterClassName: "",
          isColumnGroup: false,
          isSubColumn: false,
          filterOpened: false,
          sortable,
          index: props.index,
          rawColumnKey: instance.vnode.key
        };
        const basicProps = [
          "columnKey",
          "label",
          "className",
          "labelClassName",
          "type",
          "renderHeader",
          "formatter",
          "fixed",
          "resizable"
        ];
        const sortProps = ["sortMethod", "sortBy", "sortOrders"];
        const selectProps = ["selectable", "reserveSelection"];
        const filterProps = [
          "filterMethod",
          "filters",
          "filterMultiple",
          "filterOpened",
          "filteredValue",
          "filterPlacement",
          "filterClassName"
        ];
        let column = getPropsData(basicProps, sortProps, selectProps, filterProps);
        column = mergeOptions(defaults, column);
        const chains = compose(setColumnRenders, setColumnWidth, setColumnForcedProps);
        column = chains(column);
        columnConfig.value = column;
        registerNormalWatchers();
        registerComplexWatchers();
      });
      vue.onMounted(() => {
        var _a2;
        const parent2 = columnOrTableParent.value;
        const children = isSubColumn.value ? parent2.vnode.el.children : (_a2 = parent2.refs.hiddenColumns) == null ? void 0 : _a2.children;
        const getColumnIndex = () => getColumnElIndex(children || [], instance.vnode.el);
        columnConfig.value.getColumnIndex = getColumnIndex;
        const columnIndex = getColumnIndex();
        columnIndex > -1 && owner.value.store.commit("insertColumn", columnConfig.value, isSubColumn.value ? parent2.columnConfig.value : null, updateColumnOrder);
      });
      vue.onBeforeUnmount(() => {
        const columnIndex = columnConfig.value.getColumnIndex();
        columnIndex > -1 && owner.value.store.commit("removeColumn", columnConfig.value, isSubColumn.value ? parent.columnConfig.value : null, updateColumnOrder);
      });
      instance.columnId = columnId.value;
      instance.columnConfig = columnConfig;
      return;
    },
    render() {
      var _a2, _b, _c;
      try {
        const renderDefault = (_b = (_a2 = this.$slots).default) == null ? void 0 : _b.call(_a2, {
          row: {},
          column: {},
          $index: -1
        });
        const children = [];
        if (Array.isArray(renderDefault)) {
          for (const childNode of renderDefault) {
            if (((_c = childNode.type) == null ? void 0 : _c.name) === "ElTableColumn" || childNode.shapeFlag & 2) {
              children.push(childNode);
            } else if (childNode.type === vue.Fragment && Array.isArray(childNode.children)) {
              childNode.children.forEach((vnode2) => {
                if ((vnode2 == null ? void 0 : vnode2.patchFlag) !== 1024 && !isString(vnode2 == null ? void 0 : vnode2.children)) {
                  children.push(vnode2);
                }
              });
            }
          }
        }
        const vnode = vue.h("div", children);
        return vnode;
      } catch (e) {
        return vue.h("div", []);
      }
    }
  });
  const ElTable = withInstall(Table, {
    TableColumn: ElTableColumn$1
  });
  const ElTableColumn = withNoopInstall(ElTableColumn$1);
  const messageTypes = ["success", "info", "warning", "error"];
  const messageDefaults = mutable({
    customClass: "",
    center: false,
    dangerouslyUseHTMLString: false,
    duration: 3e3,
    icon: void 0,
    id: "",
    message: "",
    onClose: void 0,
    showClose: false,
    type: "info",
    plain: false,
    offset: 16,
    zIndex: 0,
    grouping: false,
    repeatNum: 1,
    appendTo: isClient ? document.body : void 0
  });
  const messageProps = buildProps({
    customClass: {
      type: String,
      default: messageDefaults.customClass
    },
    center: {
      type: Boolean,
      default: messageDefaults.center
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: messageDefaults.dangerouslyUseHTMLString
    },
    duration: {
      type: Number,
      default: messageDefaults.duration
    },
    icon: {
      type: iconPropType,
      default: messageDefaults.icon
    },
    id: {
      type: String,
      default: messageDefaults.id
    },
    message: {
      type: definePropType([
        String,
        Object,
        Function
      ]),
      default: messageDefaults.message
    },
    onClose: {
      type: definePropType(Function),
      default: messageDefaults.onClose
    },
    showClose: {
      type: Boolean,
      default: messageDefaults.showClose
    },
    type: {
      type: String,
      values: messageTypes,
      default: messageDefaults.type
    },
    plain: {
      type: Boolean,
      default: messageDefaults.plain
    },
    offset: {
      type: Number,
      default: messageDefaults.offset
    },
    zIndex: {
      type: Number,
      default: messageDefaults.zIndex
    },
    grouping: {
      type: Boolean,
      default: messageDefaults.grouping
    },
    repeatNum: {
      type: Number,
      default: messageDefaults.repeatNum
    }
  });
  const messageEmits = {
    destroy: () => true
  };
  const instances = vue.shallowReactive([]);
  const getInstance = (id) => {
    const idx = instances.findIndex((instance) => instance.id === id);
    const current = instances[idx];
    let prev;
    if (idx > 0) {
      prev = instances[idx - 1];
    }
    return { current, prev };
  };
  const getLastOffset = (id) => {
    const { prev } = getInstance(id);
    if (!prev)
      return 0;
    return prev.vm.exposed.bottom.value;
  };
  const getOffsetOrSpace = (id, offset) => {
    const idx = instances.findIndex((instance) => instance.id === id);
    return idx > 0 ? 16 : offset;
  };
  const _hoisted_1$1 = ["id"];
  const _hoisted_2$1 = ["innerHTML"];
  const __default__ = vue.defineComponent({
    name: "ElMessage"
  });
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: messageProps,
    emits: messageEmits,
    setup(__props, { expose }) {
      const props = __props;
      const { Close } = TypeComponents;
      const { ns, zIndex: zIndex2 } = useGlobalComponentSettings("message");
      const { currentZIndex, nextZIndex } = zIndex2;
      const messageRef = vue.ref();
      const visible = vue.ref(false);
      const height = vue.ref(0);
      let stopTimer = void 0;
      const badgeType = vue.computed(() => props.type ? props.type === "error" ? "danger" : props.type : "info");
      const typeClass = vue.computed(() => {
        const type = props.type;
        return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
      });
      const iconComponent = vue.computed(() => props.icon || TypeComponentsMap[props.type] || "");
      const lastOffset = vue.computed(() => getLastOffset(props.id));
      const offset = vue.computed(() => getOffsetOrSpace(props.id, props.offset) + lastOffset.value);
      const bottom = vue.computed(() => height.value + offset.value);
      const customStyle = vue.computed(() => ({
        top: `${offset.value}px`,
        zIndex: currentZIndex.value
      }));
      function startTimer() {
        if (props.duration === 0)
          return;
        ({ stop: stopTimer } = useTimeoutFn(() => {
          close();
        }, props.duration));
      }
      function clearTimer() {
        stopTimer == null ? void 0 : stopTimer();
      }
      function close() {
        visible.value = false;
      }
      function keydown({ code }) {
        if (code === EVENT_CODE.esc) {
          close();
        }
      }
      vue.onMounted(() => {
        startTimer();
        nextZIndex();
        visible.value = true;
      });
      vue.watch(() => props.repeatNum, () => {
        clearTimer();
        startTimer();
      });
      useEventListener(document, "keydown", keydown);
      useResizeObserver(messageRef, () => {
        height.value = messageRef.value.getBoundingClientRect().height;
      });
      expose({
        visible,
        bottom,
        close
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          onBeforeLeave: _ctx.onClose,
          onAfterLeave: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("destroy")),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              id: _ctx.id,
              ref_key: "messageRef",
              ref: messageRef,
              class: vue.normalizeClass([
                vue.unref(ns).b(),
                { [vue.unref(ns).m(_ctx.type)]: _ctx.type },
                vue.unref(ns).is("center", _ctx.center),
                vue.unref(ns).is("closable", _ctx.showClose),
                vue.unref(ns).is("plain", _ctx.plain),
                _ctx.customClass
              ]),
              style: vue.normalizeStyle(vue.unref(customStyle)),
              role: "alert",
              onMouseenter: clearTimer,
              onMouseleave: startTimer
            }, [
              _ctx.repeatNum > 1 ? (vue.openBlock(), vue.createBlock(vue.unref(ElBadge), {
                key: 0,
                value: _ctx.repeatNum,
                type: vue.unref(badgeType),
                class: vue.normalizeClass(vue.unref(ns).e("badge"))
              }, null, 8, ["value", "type", "class"])) : vue.createCommentVNode("v-if", true),
              vue.unref(iconComponent) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass([vue.unref(ns).e("icon"), vue.unref(typeClass)])
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(iconComponent))))
                ]),
                _: 1
              }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                !_ctx.dangerouslyUseHTMLString ? (vue.openBlock(), vue.createElementBlock("p", {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(ns).e("content"))
                }, vue.toDisplayString(_ctx.message), 3)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                  vue.createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "),
                  vue.createElementVNode("p", {
                    class: vue.normalizeClass(vue.unref(ns).e("content")),
                    innerHTML: _ctx.message
                  }, null, 10, _hoisted_2$1)
                ], 2112))
              ]),
              _ctx.showClose ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 2,
                class: vue.normalizeClass(vue.unref(ns).e("closeBtn")),
                onClick: vue.withModifiers(close, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(Close))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 46, _hoisted_1$1), [
              [vue.vShow, visible.value]
            ])
          ]),
          _: 3
        }, 8, ["name", "onBeforeLeave"]);
      };
    }
  });
  var MessageConstructor = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["__file", "message.vue"]]);
  let seed = 1;
  const normalizeOptions = (params) => {
    const options = !params || isString(params) || vue.isVNode(params) || isFunction$1(params) ? { message: params } : params;
    const normalized = {
      ...messageDefaults,
      ...options
    };
    if (!normalized.appendTo) {
      normalized.appendTo = document.body;
    } else if (isString(normalized.appendTo)) {
      let appendTo = document.querySelector(normalized.appendTo);
      if (!isElement(appendTo)) {
        appendTo = document.body;
      }
      normalized.appendTo = appendTo;
    }
    return normalized;
  };
  const closeMessage = (instance) => {
    const idx = instances.indexOf(instance);
    if (idx === -1)
      return;
    instances.splice(idx, 1);
    const { handler } = instance;
    handler.close();
  };
  const createMessage = ({ appendTo, ...options }, context) => {
    const id = `message_${seed++}`;
    const userOnClose = options.onClose;
    const container = document.createElement("div");
    const props = {
      ...options,
      id,
      onClose: () => {
        userOnClose == null ? void 0 : userOnClose();
        closeMessage(instance);
      },
      onDestroy: () => {
        vue.render(null, container);
      }
    };
    const vnode = vue.createVNode(MessageConstructor, props, isFunction$1(props.message) || vue.isVNode(props.message) ? {
      default: isFunction$1(props.message) ? props.message : () => props.message
    } : null);
    vnode.appContext = context || message._context;
    vue.render(vnode, container);
    appendTo.appendChild(container.firstElementChild);
    const vm = vnode.component;
    const handler = {
      close: () => {
        vm.exposed.visible.value = false;
      }
    };
    const instance = {
      id,
      vnode,
      vm,
      handler,
      props: vnode.component.props
    };
    return instance;
  };
  const message = (options = {}, context) => {
    if (!isClient)
      return { close: () => void 0 };
    if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
      return { close: () => void 0 };
    }
    const normalized = normalizeOptions(options);
    if (normalized.grouping && instances.length) {
      const instance2 = instances.find(({ vnode: vm }) => {
        var _a2;
        return ((_a2 = vm.props) == null ? void 0 : _a2.message) === normalized.message;
      });
      if (instance2) {
        instance2.props.repeatNum += 1;
        instance2.props.type = normalized.type;
        return instance2.handler;
      }
    }
    const instance = createMessage(normalized, context);
    instances.push(instance);
    return instance.handler;
  };
  messageTypes.forEach((type) => {
    message[type] = (options = {}, appContext) => {
      const normalized = normalizeOptions(options);
      return message({ ...normalized, type }, appContext);
    };
  });
  function closeAll(type) {
    for (const instance of instances) {
      if (!type || type === instance.props.type) {
        instance.handler.close();
      }
    }
  }
  message.closeAll = closeAll;
  message._context = null;
  const ElMessage = withInstallFunction(message, "$message");
  const App_vue_vue_type_style_index_0_scoped_3a4c270e_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-3a4c270e"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "group-btn-wrapper" };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("i", {
    class: "iconfont icon-data",
    title: "\u67E5\u770B\u672C\u5730\u6570\u636E"
  }, null, -1));
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const isShow = vue.ref(true);
      const total = vue.ref(0);
      const tableData = vue.ref([]);
      const x2 = vue.ref(0);
      const y = vue.ref(0);
      function countTotal(table) {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");
        const trs = tbody.querySelectorAll("tr");
        let thr = [];
        let ths = [];
        if (thead) {
          thr = thead.querySelector("tr");
          ths = thr.querySelectorAll("th");
        } else {
          thr = tbody.querySelector("tr");
          ths = thr.querySelectorAll("th");
        }
        let i = 0;
        total.value = 0;
        Array.from(ths).forEach((th, index) => {
          const text = th.innerText;
          if (text.includes("\u5DE5\u65F6")) {
            i = index;
            return;
          }
        });
        Array.from(trs).forEach((tr) => {
          if (!/共计|总计/.test(tr.innerText)) {
            const tds = tr.querySelectorAll("td");
            const text = tds[i].innerText;
            const day = text.replace(/[^0-9.]/g, "") || 0;
            console.log("day:", day);
            total.value += Number(day);
          }
        });
        return total.value;
      }
      function findTr(target) {
        let tr = target;
        while (tr.nodeName != "TR" && tr && tr.nodeName) {
          tr = tr.parentNode;
        }
        return tr;
      }
      function clipboard(text) {
        console.log("text:", text);
        GM_setClipboard(text, "text");
        const str = text.split("\n").map((v2) => {
          return `<p style="margin: 8px 0;">${v2}</p>`;
        }).join("");
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: str + "\n<p>\u590D\u5236\u6210\u529F!</p>",
          type: "success"
        });
      }
      function copy(trs) {
        let result = [];
        let title = "";
        for (const tr of trs) {
          const text = [];
          const tds = tr.querySelectorAll("td");
          let i = 0;
          for (const td of tds) {
            const tdText = td.innerText.trim();
            if (i == 0 && tdText) {
              title = tdText;
            }
            if (i == 0) {
              text.push(title);
            } else {
              text.push(tdText);
            }
            i++;
          }
          if (text[0] || text[1]) {
            result.push(text);
          }
        }
        return result;
      }
      function onCopyAll() {
        const tables = document.querySelectorAll("table");
        let result = "";
        for (const table of tables) {
          const hasDay = table.innerText.includes("\u5DE5\u65F6");
          if (hasDay) {
            const trs = table.querySelectorAll("tr");
            result += "\u603B\u8BA1:  " + countTotal(table) + "\u5929\n";
            result += copy(trs).map((v2) => v2.join("	")).join("\n");
            result += "\n-----------------------------------------\u5206\u9694\u7EBF-----------------------------------------------\n";
          }
        }
        clipboard(result);
      }
      function onShowData() {
        tableData.value = [];
        tableData.value.push({
          type: "cookie",
          key: "cookie",
          value: document.cookie
        });
        Object.keys(localStorage).forEach((key) => {
          tableData.value.push({
            type: "localStorage",
            key,
            value: localStorage.getItem(key)
          });
        });
        Object.keys(sessionStorage).forEach((key) => {
          tableData.value.push({
            type: "sessionStorage",
            key,
            value: sessionStorage.getItem(key)
          });
        });
        console.log(tableData.value);
      }
      function onCopyCurrent(row) {
        console.log(row.value);
        GM_setClipboard(row.value || "", "text");
        ElMessage({
          message: "\u590D\u5236\u6210\u529F",
          type: "success"
        });
      }
      vue.onMounted(() => {
        Array.from(document.querySelectorAll("table") || []).forEach((table) => {
          table.addEventListener("mouseover", (e) => {
            const isTrue = e.target.innerText.includes("\u5DE5\u65F6");
            isShow.value = isTrue;
            total.value = 0;
            if (isTrue) {
              x2.value = e.x;
              y.value = e.y;
              countTotal(e.target.parentNode.parentNode.parentNode.parentNode);
            }
          });
          table.addEventListener("dblclick", (e) => {
            const tr = findTr(e.target);
            const trs = tr.parentNode.parentNode.querySelectorAll("tbody tr");
            const index = Array.from(trs).findIndex((v2) => {
              return v2.innerHTML === tr.innerHTML;
            });
            let result = copy(trs);
            if (result[index]) {
              clipboard(result[index].slice(0, 2).join("-"));
            }
          });
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createVNode(vue.unref(ElPopover), {
              placement: "left",
              trigger: "click",
              onShow: onShowData,
              width: "800px"
            }, {
              reference: vue.withCtx(() => [
                _hoisted_2
              ]),
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(ElTable), {
                  data: tableData.value,
                  height: "250"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElTableColumn), {
                      property: "type",
                      label: "\u6570\u636E\u7C7B\u578B",
                      "show-overflow-tooltip": ""
                    }),
                    vue.createVNode(vue.unref(ElTableColumn), {
                      property: "key",
                      label: "\u952E",
                      "show-overflow-tooltip": ""
                    }),
                    vue.createVNode(vue.unref(ElTableColumn), {
                      property: "value",
                      label: "\u503C",
                      "show-overflow-tooltip": ""
                    }),
                    vue.createVNode(vue.unref(ElTableColumn), { align: "right" }, {
                      default: vue.withCtx((scope) => [
                        vue.createVNode(vue.unref(ElButton), {
                          onClick: ($event) => onCopyCurrent(scope.row)
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(" \u590D\u5236\u5F53\u524D\u6570\u636E ")
                          ]),
                          _: 2
                        }, 1032, ["onClick"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["data"])
              ]),
              _: 1
            }),
            vue.createElementVNode("i", {
              class: "iconfont icon-fuzhi",
              title: "\u4E00\u952E\u590D\u5236\u6240\u6709\u8868\u683C\u4FE1\u606F",
              onClick: onCopyAll
            })
          ]),
          isShow.value && total.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "show-total-box",
            style: vue.normalizeStyle({ left: x2.value + "px", top: y.value + "px" })
          }, " \u5171\u8BA1\u5DE5\u65F6: " + vue.toDisplayString(total.value), 5)) : vue.createCommentVNode("", true)
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3a4c270e"]]);
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.href = "https://unpkg.com/element-plus/dist/index.css";
  document.documentElement.appendChild(link);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
})(Vue);
