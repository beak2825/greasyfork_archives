// ==UserScript==
// @name         挂刀观测
// @namespace    npm/vite-plugin-monkey
// @version      0.0.3
// @author       monkey
// @description  挂刀观测测
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.iflow.work/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491961/%E6%8C%82%E5%88%80%E8%A7%82%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491961/%E6%8C%82%E5%88%80%E8%A7%82%E6%B5%8B.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;display:flex;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}} ");

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var require_main_001 = __commonJS({
    "main-Cba0xYDG.js"(exports, module) {
      function tryOnScopeDispose(fn) {
        if (vue.getCurrentScope()) {
          vue.onScopeDispose(fn);
          return true;
        }
        return false;
      }
      function toValue(r) {
        return typeof r === "function" ? r() : vue.unref(r);
      }
      const isClient = typeof window !== "undefined" && typeof document !== "undefined";
      typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
      const toString$3 = Object.prototype.toString;
      const isObject$3 = (val) => toString$3.call(val) === "[object Object]";
      const noop$2 = () => {
      };
      function createFilterWrapper(filter2, fn) {
        function wrapper(...args) {
          return new Promise((resolve, reject2) => {
            Promise.resolve(filter2(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject2);
          });
        }
        return wrapper;
      }
      const bypassFilter = (invoke2) => {
        return invoke2();
      };
      function pausableFilter(extendFilter = bypassFilter) {
        const isActive = vue.ref(true);
        function pause() {
          isActive.value = false;
        }
        function resume() {
          isActive.value = true;
        }
        const eventFilter = (...args) => {
          if (isActive.value)
            extendFilter(...args);
        };
        return { isActive: vue.readonly(isActive), pause, resume, eventFilter };
      }
      function getLifeCycleTarget(target) {
        return target || vue.getCurrentInstance();
      }
      function watchWithFilter(source, cb, options = {}) {
        const {
          eventFilter = bypassFilter,
          ...watchOptions
        } = options;
        return vue.watch(
          source,
          createFilterWrapper(
            eventFilter,
            cb
          ),
          watchOptions
        );
      }
      function watchPausable(source, cb, options = {}) {
        const {
          eventFilter: filter2,
          ...watchOptions
        } = options;
        const { eventFilter, pause, resume, isActive } = pausableFilter(filter2);
        const stop = watchWithFilter(
          source,
          cb,
          {
            ...watchOptions,
            eventFilter
          }
        );
        return { stop, pause, resume, isActive };
      }
      function tryOnMounted(fn, sync = true, target) {
        const instance = getLifeCycleTarget();
        if (instance)
          vue.onMounted(fn, target);
        else if (sync)
          fn();
        else
          vue.nextTick(fn);
      }
      function unrefElement(elRef) {
        var _a;
        const plain = toValue(elRef);
        return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
      }
      const defaultWindow = isClient ? window : void 0;
      function useEventListener(...args) {
        let target;
        let events2;
        let listeners;
        let options;
        if (typeof args[0] === "string" || Array.isArray(args[0])) {
          [events2, listeners, options] = args;
          target = defaultWindow;
        } else {
          [target, events2, listeners, options] = args;
        }
        if (!target)
          return noop$2;
        if (!Array.isArray(events2))
          events2 = [events2];
        if (!Array.isArray(listeners))
          listeners = [listeners];
        const cleanups = [];
        const cleanup = () => {
          cleanups.forEach((fn) => fn());
          cleanups.length = 0;
        };
        const register = (el, event, listener, options2) => {
          el.addEventListener(event, listener, options2);
          return () => el.removeEventListener(event, listener, options2);
        };
        const stopWatch = vue.watch(
          () => [unrefElement(target), toValue(options)],
          ([el, options2]) => {
            cleanup();
            if (!el)
              return;
            const optionsClone = isObject$3(options2) ? { ...options2 } : options2;
            cleanups.push(
              ...events2.flatMap((event) => {
                return listeners.map((listener) => register(el, event, listener, optionsClone));
              })
            );
          },
          { immediate: true, flush: "post" }
        );
        const stop = () => {
          stopWatch();
          cleanup();
        };
        tryOnScopeDispose(stop);
        return stop;
      }
      const _global$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      const globalKey = "__vueuse_ssr_handlers__";
      const handlers = /* @__PURE__ */ getHandlers();
      function getHandlers() {
        if (!(globalKey in _global$1))
          _global$1[globalKey] = _global$1[globalKey] || {};
        return _global$1[globalKey];
      }
      function getSSRHandler(key, fallback) {
        return handlers[key] || fallback;
      }
      function guessSerializerType(rawInit) {
        return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
      }
      const StorageSerializers = {
        boolean: {
          read: (v) => v === "true",
          write: (v) => String(v)
        },
        object: {
          read: (v) => JSON.parse(v),
          write: (v) => JSON.stringify(v)
        },
        number: {
          read: (v) => Number.parseFloat(v),
          write: (v) => String(v)
        },
        any: {
          read: (v) => v,
          write: (v) => String(v)
        },
        string: {
          read: (v) => v,
          write: (v) => String(v)
        },
        map: {
          read: (v) => new Map(JSON.parse(v)),
          write: (v) => JSON.stringify(Array.from(v.entries()))
        },
        set: {
          read: (v) => new Set(JSON.parse(v)),
          write: (v) => JSON.stringify(Array.from(v))
        },
        date: {
          read: (v) => new Date(v),
          write: (v) => v.toISOString()
        }
      };
      const customStorageEventName = "vueuse-storage";
      function useStorage(key, defaults2, storage, options = {}) {
        var _a;
        const {
          flush = "pre",
          deep = true,
          listenToStorageChanges = true,
          writeDefaults = true,
          mergeDefaults = false,
          shallow,
          window: window2 = defaultWindow,
          eventFilter,
          onError = (e) => {
            console.error(e);
          },
          initOnMounted
        } = options;
        const data = (shallow ? vue.shallowRef : vue.ref)(typeof defaults2 === "function" ? defaults2() : defaults2);
        if (!storage) {
          try {
            storage = getSSRHandler("getDefaultStorage", () => {
              var _a2;
              return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
            })();
          } catch (e) {
            onError(e);
          }
        }
        if (!storage)
          return data;
        const rawInit = toValue(defaults2);
        const type = guessSerializerType(rawInit);
        const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
        const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
          data,
          () => write(data.value),
          { flush, deep, eventFilter }
        );
        if (window2 && listenToStorageChanges) {
          tryOnMounted(() => {
            useEventListener(window2, "storage", update2);
            useEventListener(window2, customStorageEventName, updateFromCustomEvent);
            if (initOnMounted)
              update2();
          });
        }
        if (!initOnMounted)
          update2();
        function dispatchWriteEvent(oldValue, newValue) {
          if (window2) {
            window2.dispatchEvent(new CustomEvent(customStorageEventName, {
              detail: {
                key,
                oldValue,
                newValue,
                storageArea: storage
              }
            }));
          }
        }
        function write(v) {
          try {
            const oldValue = storage.getItem(key);
            if (v == null) {
              dispatchWriteEvent(oldValue, null);
              storage.removeItem(key);
            } else {
              const serialized = serializer.write(v);
              if (oldValue !== serialized) {
                storage.setItem(key, serialized);
                dispatchWriteEvent(oldValue, serialized);
              }
            }
          } catch (e) {
            onError(e);
          }
        }
        function read(event) {
          const rawValue = event ? event.newValue : storage.getItem(key);
          if (rawValue == null) {
            if (writeDefaults && rawInit != null)
              storage.setItem(key, serializer.write(rawInit));
            return rawInit;
          } else if (!event && mergeDefaults) {
            const value = serializer.read(rawValue);
            if (typeof mergeDefaults === "function")
              return mergeDefaults(value, rawInit);
            else if (type === "object" && !Array.isArray(value))
              return { ...rawInit, ...value };
            return value;
          } else if (typeof rawValue !== "string") {
            return rawValue;
          } else {
            return serializer.read(rawValue);
          }
        }
        function update2(event) {
          if (event && event.storageArea !== storage)
            return;
          if (event && event.key == null) {
            data.value = rawInit;
            return;
          }
          if (event && event.key !== key)
            return;
          pauseWatch();
          try {
            if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
              data.value = read(event);
          } catch (e) {
            onError(e);
          } finally {
            if (event)
              vue.nextTick(resumeWatch);
            else
              resumeWatch();
          }
        }
        function updateFromCustomEvent(event) {
          update2(event.detail);
        }
        return data;
      }
      function useLocalStorage(key, initialValue, options = {}) {
        const { window: window2 = defaultWindow } = options;
        return useStorage(key, initialValue, window2 == null ? void 0 : window2.localStorage, options);
      }
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var Symbol$1 = root.Symbol;
      var objectProto$s = Object.prototype;
      var hasOwnProperty$p = objectProto$s.hasOwnProperty;
      var nativeObjectToString$3 = objectProto$s.toString;
      var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$p.call(value, symToStringTag$1), tag = value[symToStringTag$1];
        try {
          value[symToStringTag$1] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result2 = nativeObjectToString$3.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag$1] = tag;
          } else {
            delete value[symToStringTag$1];
          }
        }
        return result2;
      }
      var objectProto$r = Object.prototype;
      var nativeObjectToString$2 = objectProto$r.toString;
      function objectToString(value) {
        return nativeObjectToString$2.call(value);
      }
      var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var symbolTag$3 = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
      }
      var NAN$2 = 0 / 0;
      function baseToNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN$2;
        }
        return +value;
      }
      function arrayMap(array2, iteratee2) {
        var index = -1, length = array2 == null ? 0 : array2.length, result2 = Array(length);
        while (++index < length) {
          result2[index] = iteratee2(array2[index], index, array2);
        }
        return result2;
      }
      var isArray$2 = Array.isArray;
      var INFINITY$5 = 1 / 0;
      var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray$2(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY$5 ? "-0" : result2;
      }
      function createMathOperation(operator, defaultValue) {
        return function(value, other) {
          var result2;
          if (value === void 0 && other === void 0) {
            return defaultValue;
          }
          if (value !== void 0) {
            result2 = value;
          }
          if (other !== void 0) {
            if (result2 === void 0) {
              return other;
            }
            if (typeof value == "string" || typeof other == "string") {
              value = baseToString(value);
              other = baseToString(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }
            result2 = operator(value, other);
          }
          return result2;
        };
      }
      var add = createMathOperation(function(augend, addend) {
        return augend + addend;
      }, 0);
      const add$1 = add;
      var reWhitespace = /\s/;
      function trimmedEndIndex(string2) {
        var index = string2.length;
        while (index-- && reWhitespace.test(string2.charAt(index))) {
        }
        return index;
      }
      var reTrimStart$2 = /^\s+/;
      function baseTrim(string2) {
        return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart$2, "") : string2;
      }
      function isObject$2(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      var NAN$1 = 0 / 0;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsOctal = /^0o[0-7]+$/i;
      var freeParseInt = parseInt;
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN$1;
        }
        if (isObject$2(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject$2(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN$1 : +value;
      }
      var INFINITY$4 = 1 / 0, MAX_INTEGER = 17976931348623157e292;
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY$4 || value === -INFINITY$4) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
      function toInteger(value) {
        var result2 = toFinite(value), remainder = result2 % 1;
        return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
      }
      var FUNC_ERROR_TEXT$b = "Expected a function";
      function after(n, func2) {
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$b);
        }
        n = toInteger(n);
        return function() {
          if (--n < 1) {
            return func2.apply(this, arguments);
          }
        };
      }
      function identity(value) {
        return value;
      }
      var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
      function isFunction$2(value) {
        if (!isObject$2(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
      }
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      function isMasked(func2) {
        return !!maskSrcKey && maskSrcKey in func2;
      }
      var funcProto$2 = Function.prototype;
      var funcToString$2 = funcProto$2.toString;
      function toSource(func2) {
        if (func2 != null) {
          try {
            return funcToString$2.call(func2);
          } catch (e) {
          }
          try {
            return func2 + "";
          } catch (e) {
          }
        }
        return "";
      }
      var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var funcProto$1 = Function.prototype, objectProto$q = Object.prototype;
      var funcToString$1 = funcProto$1.toString;
      var hasOwnProperty$o = objectProto$q.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString$1.call(hasOwnProperty$o).replace(reRegExpChar$1, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject$2(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getValue(object2, key) {
        return object2 == null ? void 0 : object2[key];
      }
      function getNative(object2, key) {
        var value = getValue(object2, key);
        return baseIsNative(value) ? value : void 0;
      }
      var WeakMap = getNative(root, "WeakMap");
      var metaMap = WeakMap && new WeakMap();
      var baseSetData = !metaMap ? identity : function(func2, data) {
        metaMap.set(func2, data);
        return func2;
      };
      var objectCreate = Object.create;
      var baseCreate = /* @__PURE__ */ function() {
        function object2() {
        }
        return function(proto) {
          if (!isObject$2(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object2.prototype = proto;
          var result2 = new object2();
          object2.prototype = void 0;
          return result2;
        };
      }();
      function createCtor(Ctor) {
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor();
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
          var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
          return isObject$2(result2) ? result2 : thisBinding;
        };
      }
      var WRAP_BIND_FLAG$8 = 1;
      function createBind(func2, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG$8, Ctor = createCtor(func2);
        function wrapper() {
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func2;
          return fn.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }
      function apply(func2, thisArg, args) {
        switch (args.length) {
          case 0:
            return func2.call(thisArg);
          case 1:
            return func2.call(thisArg, args[0]);
          case 2:
            return func2.call(thisArg, args[0], args[1]);
          case 3:
            return func2.call(thisArg, args[0], args[1], args[2]);
        }
        return func2.apply(thisArg, args);
      }
      var nativeMax$g = Math.max;
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax$g(argsLength - holdersLength, 0), result2 = Array(leftLength + rangeLength), isUncurried = !isCurried;
        while (++leftIndex < leftLength) {
          result2[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result2[leftIndex++] = args[argsIndex++];
        }
        return result2;
      }
      var nativeMax$f = Math.max;
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax$f(argsLength - holdersLength, 0), result2 = Array(rangeLength + rightLength), isUncurried = !isCurried;
        while (++argsIndex < rangeLength) {
          result2[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result2[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result2;
      }
      function countHolders(array2, placeholder) {
        var length = array2.length, result2 = 0;
        while (length--) {
          if (array2[length] === placeholder) {
            ++result2;
          }
        }
        return result2;
      }
      function baseLodash() {
      }
      var MAX_ARRAY_LENGTH$6 = 4294967295;
      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH$6;
        this.__views__ = [];
      }
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;
      function noop$1() {
      }
      var getData = !metaMap ? noop$1 : function(func2) {
        return metaMap.get(func2);
      };
      var realNames = {};
      var objectProto$p = Object.prototype;
      var hasOwnProperty$n = objectProto$p.hasOwnProperty;
      function getFuncName(func2) {
        var result2 = func2.name + "", array2 = realNames[result2], length = hasOwnProperty$n.call(realNames, result2) ? array2.length : 0;
        while (length--) {
          var data = array2[length], otherFunc = data.func;
          if (otherFunc == null || otherFunc == func2) {
            return data.name;
          }
        }
        return result2;
      }
      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = void 0;
      }
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;
      function copyArray(source, array2) {
        var index = -1, length = source.length;
        array2 || (array2 = Array(length));
        while (++index < length) {
          array2[index] = source[index];
        }
        return array2;
      }
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result2.__actions__ = copyArray(wrapper.__actions__);
        result2.__index__ = wrapper.__index__;
        result2.__values__ = wrapper.__values__;
        return result2;
      }
      var objectProto$o = Object.prototype;
      var hasOwnProperty$m = objectProto$o.hasOwnProperty;
      function lodash(value) {
        if (isObjectLike(value) && !isArray$2(value) && !(value instanceof LazyWrapper)) {
          if (value instanceof LodashWrapper) {
            return value;
          }
          if (hasOwnProperty$m.call(value, "__wrapped__")) {
            return wrapperClone(value);
          }
        }
        return new LodashWrapper(value);
      }
      lodash.prototype = baseLodash.prototype;
      lodash.prototype.constructor = lodash;
      function isLaziable(func2) {
        var funcName = getFuncName(func2), other = lodash[funcName];
        if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
          return false;
        }
        if (func2 === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func2 === data[0];
      }
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var nativeNow = Date.now;
      function shortOut(func2) {
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
          return func2.apply(void 0, arguments);
        };
      }
      var setData = shortOut(baseSetData);
      var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
        details = details.join(length > 2 ? ", " : " ");
        return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      var defineProperty = function() {
        try {
          var func2 = getNative(Object, "defineProperty");
          func2({}, "", {});
          return func2;
        } catch (e) {
        }
      }();
      var baseSetToString = !defineProperty ? identity : function(func2, string2) {
        return defineProperty(func2, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string2),
          "writable": true
        });
      };
      const baseSetToString$1 = baseSetToString;
      var setToString = shortOut(baseSetToString$1);
      function arrayEach(array2, iteratee2) {
        var index = -1, length = array2 == null ? 0 : array2.length;
        while (++index < length) {
          if (iteratee2(array2[index], index, array2) === false) {
            break;
          }
        }
        return array2;
      }
      function baseFindIndex(array2, predicate, fromIndex, fromRight) {
        var length = array2.length, index = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index-- : ++index < length) {
          if (predicate(array2[index], index, array2)) {
            return index;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function strictIndexOf(array2, value, fromIndex) {
        var index = fromIndex - 1, length = array2.length;
        while (++index < length) {
          if (array2[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function baseIndexOf(array2, value, fromIndex) {
        return value === value ? strictIndexOf(array2, value, fromIndex) : baseFindIndex(array2, baseIsNaN, fromIndex);
      }
      function arrayIncludes(array2, value) {
        var length = array2 == null ? 0 : array2.length;
        return !!length && baseIndexOf(array2, value, 0) > -1;
      }
      var WRAP_BIND_FLAG$7 = 1, WRAP_BIND_KEY_FLAG$6 = 2, WRAP_CURRY_FLAG$6 = 8, WRAP_CURRY_RIGHT_FLAG$3 = 16, WRAP_PARTIAL_FLAG$6 = 32, WRAP_PARTIAL_RIGHT_FLAG$3 = 64, WRAP_ARY_FLAG$4 = 128, WRAP_REARG_FLAG$3 = 256, WRAP_FLIP_FLAG$2 = 512;
      var wrapFlags = [
        ["ary", WRAP_ARY_FLAG$4],
        ["bind", WRAP_BIND_FLAG$7],
        ["bindKey", WRAP_BIND_KEY_FLAG$6],
        ["curry", WRAP_CURRY_FLAG$6],
        ["curryRight", WRAP_CURRY_RIGHT_FLAG$3],
        ["flip", WRAP_FLIP_FLAG$2],
        ["partial", WRAP_PARTIAL_FLAG$6],
        ["partialRight", WRAP_PARTIAL_RIGHT_FLAG$3],
        ["rearg", WRAP_REARG_FLAG$3]
      ];
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function(pair) {
          var value = "_." + pair[0];
          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + "";
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }
      var WRAP_BIND_FLAG$6 = 1, WRAP_BIND_KEY_FLAG$5 = 2, WRAP_CURRY_BOUND_FLAG$1 = 4, WRAP_CURRY_FLAG$5 = 8, WRAP_PARTIAL_FLAG$5 = 32, WRAP_PARTIAL_RIGHT_FLAG$2 = 64;
      function createRecurry(func2, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG$5, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG$5 : WRAP_PARTIAL_RIGHT_FLAG$2;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$2 : WRAP_PARTIAL_FLAG$5);
        if (!(bitmask & WRAP_CURRY_BOUND_FLAG$1)) {
          bitmask &= ~(WRAP_BIND_FLAG$6 | WRAP_BIND_KEY_FLAG$5);
        }
        var newData = [
          func2,
          bitmask,
          thisArg,
          newPartials,
          newHolders,
          newPartialsRight,
          newHoldersRight,
          argPos,
          ary2,
          arity
        ];
        var result2 = wrapFunc.apply(void 0, newData);
        if (isLaziable(func2)) {
          setData(result2, newData);
        }
        result2.placeholder = placeholder;
        return setWrapToString(result2, func2, bitmask);
      }
      function getHolder(func2) {
        var object2 = func2;
        return object2.placeholder;
      }
      var MAX_SAFE_INTEGER$5 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$5 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      var nativeMin$e = Math.min;
      function reorder(array2, indexes) {
        var arrLength = array2.length, length = nativeMin$e(indexes.length, arrLength), oldArray = copyArray(array2);
        while (length--) {
          var index = indexes[length];
          array2[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
        }
        return array2;
      }
      var PLACEHOLDER$1 = "__lodash_placeholder__";
      function replaceHolders(array2, placeholder) {
        var index = -1, length = array2.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array2[index];
          if (value === placeholder || value === PLACEHOLDER$1) {
            array2[index] = PLACEHOLDER$1;
            result2[resIndex++] = index;
          }
        }
        return result2;
      }
      var WRAP_BIND_FLAG$5 = 1, WRAP_BIND_KEY_FLAG$4 = 2, WRAP_CURRY_FLAG$4 = 8, WRAP_CURRY_RIGHT_FLAG$2 = 16, WRAP_ARY_FLAG$3 = 128, WRAP_FLIP_FLAG$1 = 512;
      function createHybrid(func2, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG$3, isBind = bitmask & WRAP_BIND_FLAG$5, isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4, isCurried = bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2), isFlip = bitmask & WRAP_FLIP_FLAG$1, Ctor = isBindKey ? void 0 : createCtor(func2);
        function wrapper() {
          var length = arguments.length, args = Array(length), index = length;
          while (index--) {
            args[index] = arguments[index];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(
              func2,
              bitmask,
              createHybrid,
              wrapper.placeholder,
              thisArg,
              args,
              newHolders,
              argPos,
              ary2,
              arity - length
            );
          }
          var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func2] : func2;
          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary2 < length) {
            args.length = ary2;
          }
          if (this && this !== root && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }
          return fn.apply(thisBinding, args);
        }
        return wrapper;
      }
      function createCurry(func2, bitmask, arity) {
        var Ctor = createCtor(func2);
        function wrapper() {
          var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
          while (index--) {
            args[index] = arguments[index];
          }
          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;
          if (length < arity) {
            return createRecurry(
              func2,
              bitmask,
              createHybrid,
              wrapper.placeholder,
              void 0,
              args,
              holders,
              void 0,
              void 0,
              arity - length
            );
          }
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func2;
          return apply(fn, this, args);
        }
        return wrapper;
      }
      var WRAP_BIND_FLAG$4 = 1;
      function createPartial(func2, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG$4, Ctor = createCtor(func2);
        function wrapper() {
          var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func2;
          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn, isBind ? thisArg : this, args);
        }
        return wrapper;
      }
      var PLACEHOLDER = "__lodash_placeholder__";
      var WRAP_BIND_FLAG$3 = 1, WRAP_BIND_KEY_FLAG$3 = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG$3 = 8, WRAP_ARY_FLAG$2 = 128, WRAP_REARG_FLAG$2 = 256;
      var nativeMin$d = Math.min;
      function mergeData(data, source) {
        var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG$3 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);
        var isCombo = srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_CURRY_FLAG$3 || srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_REARG_FLAG$2 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$2) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG$3;
        if (!(isCommon || isCombo)) {
          return data;
        }
        if (srcBitmask & WRAP_BIND_FLAG$3) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG$3 ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        var value = source[3];
        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        value = source[5];
        if (value) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        value = source[7];
        if (value) {
          data[7] = value;
        }
        if (srcBitmask & WRAP_ARY_FLAG$2) {
          data[8] = data[8] == null ? source[8] : nativeMin$d(data[8], source[8]);
        }
        if (data[9] == null) {
          data[9] = source[9];
        }
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }
      var FUNC_ERROR_TEXT$a = "Expected a function";
      var WRAP_BIND_FLAG$2 = 1, WRAP_BIND_KEY_FLAG$2 = 2, WRAP_CURRY_FLAG$2 = 8, WRAP_CURRY_RIGHT_FLAG$1 = 16, WRAP_PARTIAL_FLAG$4 = 32, WRAP_PARTIAL_RIGHT_FLAG$1 = 64;
      var nativeMax$e = Math.max;
      function createWrap(func2, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2;
        if (!isBindKey && typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$a);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG$4 | WRAP_PARTIAL_RIGHT_FLAG$1);
          partials = holders = void 0;
        }
        ary2 = ary2 === void 0 ? ary2 : nativeMax$e(toInteger(ary2), 0);
        arity = arity === void 0 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;
        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$1) {
          var partialsRight = partials, holdersRight = holders;
          partials = holders = void 0;
        }
        var data = isBindKey ? void 0 : getData(func2);
        var newData = [
          func2,
          bitmask,
          thisArg,
          partials,
          holders,
          partialsRight,
          holdersRight,
          argPos,
          ary2,
          arity
        ];
        if (data) {
          mergeData(newData, data);
        }
        func2 = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func2.length : nativeMax$e(newData[9] - length, 0);
        if (!arity && bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1)) {
          bitmask &= ~(WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG$2) {
          var result2 = createBind(func2, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG$2 || bitmask == WRAP_CURRY_RIGHT_FLAG$1) {
          result2 = createCurry(func2, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG$4 || bitmask == (WRAP_BIND_FLAG$2 | WRAP_PARTIAL_FLAG$4)) && !holders.length) {
          result2 = createPartial(func2, bitmask, thisArg, partials);
        } else {
          result2 = createHybrid.apply(void 0, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result2, newData), func2, bitmask);
      }
      var WRAP_ARY_FLAG$1 = 128;
      function ary(func2, n, guard) {
        n = guard ? void 0 : n;
        n = func2 && n == null ? func2.length : n;
        return createWrap(func2, WRAP_ARY_FLAG$1, void 0, void 0, void 0, void 0, n);
      }
      function baseAssignValue(object2, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object2, key, {
            "configurable": true,
            "enumerable": true,
            "value": value,
            "writable": true
          });
        } else {
          object2[key] = value;
        }
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var objectProto$n = Object.prototype;
      var hasOwnProperty$l = objectProto$n.hasOwnProperty;
      function assignValue(object2, key, value) {
        var objValue = object2[key];
        if (!(hasOwnProperty$l.call(object2, key) && eq(objValue, value)) || value === void 0 && !(key in object2)) {
          baseAssignValue(object2, key, value);
        }
      }
      function copyObject(source, props, object2, customizer) {
        var isNew = !object2;
        object2 || (object2 = {});
        var index = -1, length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object2[key], source[key], key, object2, source) : void 0;
          if (newValue === void 0) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object2, key, newValue);
          } else {
            assignValue(object2, key, newValue);
          }
        }
        return object2;
      }
      var nativeMax$d = Math.max;
      function overRest(func2, start, transform2) {
        start = nativeMax$d(start === void 0 ? func2.length - 1 : start, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax$d(args.length - start, 0), array2 = Array(length);
          while (++index < length) {
            array2[index] = args[start + index];
          }
          index = -1;
          var otherArgs = Array(start + 1);
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = transform2(array2);
          return apply(func2, this, otherArgs);
        };
      }
      function baseRest(func2, start) {
        return setToString(overRest(func2, start, identity), func2 + "");
      }
      var MAX_SAFE_INTEGER$4 = 9007199254740991;
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$4;
      }
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction$2(value);
      }
      function isIterateeCall(value, index, object2) {
        if (!isObject$2(object2)) {
          return false;
        }
        var type = typeof index;
        if (type == "number" ? isArrayLike(object2) && isIndex(index, object2.length) : type == "string" && index in object2) {
          return eq(object2[index], value);
        }
        return false;
      }
      function createAssigner(assigner) {
        return baseRest(function(object2, sources) {
          var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
          customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? void 0 : customizer;
            length = 1;
          }
          object2 = Object(object2);
          while (++index < length) {
            var source = sources[index];
            if (source) {
              assigner(object2, source, index, customizer);
            }
          }
          return object2;
        });
      }
      var objectProto$m = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$m;
        return value === proto;
      }
      function baseTimes(n, iteratee2) {
        var index = -1, result2 = Array(n);
        while (++index < n) {
          result2[index] = iteratee2(index);
        }
        return result2;
      }
      var argsTag$3 = "[object Arguments]";
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag$3;
      }
      var objectProto$l = Object.prototype;
      var hasOwnProperty$k = objectProto$l.hasOwnProperty;
      var propertyIsEnumerable$1 = objectProto$l.propertyIsEnumerable;
      var isArguments = baseIsArguments(/* @__PURE__ */ function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$k.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
      };
      const isArguments$1 = isArguments;
      function stubFalse() {
        return false;
      }
      var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
      var Buffer$2 = moduleExports$2 ? root.Buffer : void 0;
      var nativeIsBuffer = Buffer$2 ? Buffer$2.isBuffer : void 0;
      var isBuffer$1 = nativeIsBuffer || stubFalse;
      const isBuffer$2 = isBuffer$1;
      var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$4 = "[object Boolean]", dateTag$4 = "[object Date]", errorTag$3 = "[object Error]", funcTag$1 = "[object Function]", mapTag$9 = "[object Map]", numberTag$4 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$4 = "[object RegExp]", setTag$9 = "[object Set]", stringTag$4 = "[object String]", weakMapTag$3 = "[object WeakMap]";
      var arrayBufferTag$4 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
      typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$4] = typedArrayTags[boolTag$4] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$4] = typedArrayTags[errorTag$3] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$9] = typedArrayTags[numberTag$4] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$4] = typedArrayTags[setTag$9] = typedArrayTags[stringTag$4] = typedArrayTags[weakMapTag$3] = false;
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseUnary(func2) {
        return function(value) {
          return func2(value);
        };
      }
      var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
      var freeProcess = moduleExports$1 && freeGlobal.process;
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
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      var isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      const isTypedArray$2 = isTypedArray$1;
      var objectProto$k = Object.prototype;
      var hasOwnProperty$j = objectProto$k.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray$2(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$2(value), isType = !isArr && !isArg && !isBuff && isTypedArray$2(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String) : [], length = result2.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty$j.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
          isIndex(key, length)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function overArg(func2, transform2) {
        return function(arg) {
          return func2(transform2(arg));
        };
      }
      var nativeKeys = overArg(Object.keys, Object);
      var objectProto$j = Object.prototype;
      var hasOwnProperty$i = objectProto$j.hasOwnProperty;
      function baseKeys(object2) {
        if (!isPrototype(object2)) {
          return nativeKeys(object2);
        }
        var result2 = [];
        for (var key in Object(object2)) {
          if (hasOwnProperty$i.call(object2, key) && key != "constructor") {
            result2.push(key);
          }
        }
        return result2;
      }
      function keys(object2) {
        return isArrayLike(object2) ? arrayLikeKeys(object2) : baseKeys(object2);
      }
      var objectProto$i = Object.prototype;
      var hasOwnProperty$h = objectProto$i.hasOwnProperty;
      var assign = createAssigner(function(object2, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object2);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty$h.call(source, key)) {
            assignValue(object2, key, source[key]);
          }
        }
      });
      const assign$1 = assign;
      function nativeKeysIn(object2) {
        var result2 = [];
        if (object2 != null) {
          for (var key in Object(object2)) {
            result2.push(key);
          }
        }
        return result2;
      }
      var objectProto$h = Object.prototype;
      var hasOwnProperty$g = objectProto$h.hasOwnProperty;
      function baseKeysIn(object2) {
        if (!isObject$2(object2)) {
          return nativeKeysIn(object2);
        }
        var isProto = isPrototype(object2), result2 = [];
        for (var key in object2) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty$g.call(object2, key)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function keysIn(object2) {
        return isArrayLike(object2) ? arrayLikeKeys(object2, true) : baseKeysIn(object2);
      }
      var assignIn = createAssigner(function(object2, source) {
        copyObject(source, keysIn(source), object2);
      });
      const extend$2 = assignIn;
      var assignInWith = createAssigner(function(object2, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object2, customizer);
      });
      const extendWith = assignInWith;
      var assignWith = createAssigner(function(object2, source, srcIndex, customizer) {
        copyObject(source, keys(source), object2, customizer);
      });
      const assignWith$1 = assignWith;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
      function isKey(value, object2) {
        if (isArray$2(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object2 != null && value in Object(object2);
      }
      var nativeCreate = getNative(Object, "create");
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result2 = this.has(key) && delete this.__data__[key];
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
      var objectProto$g = Object.prototype;
      var hasOwnProperty$f = objectProto$g.hasOwnProperty;
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result2 = data[key];
          return result2 === HASH_UNDEFINED$2 ? void 0 : result2;
        }
        return hasOwnProperty$f.call(data, key) ? data[key] : void 0;
      }
      var objectProto$f = Object.prototype;
      var hasOwnProperty$e = objectProto$f.hasOwnProperty;
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty$e.call(data, key);
      }
      var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
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
      function assocIndexOf(array2, key) {
        var length = array2.length;
        while (length--) {
          if (eq(array2[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      var arrayProto$5 = Array.prototype;
      var splice$2 = arrayProto$5.splice;
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice$2.call(data, index, 1);
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
      var Map$1 = getNative(root, "Map");
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map$1 || ListCache)(),
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
        var result2 = getMapData(this, key)["delete"](key);
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size2 = data.size;
        data.set(key, value);
        this.size += data.size == size2 ? 0 : 1;
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
      var FUNC_ERROR_TEXT$9 = "Expected a function";
      function memoize(func2, resolver) {
        if (typeof func2 != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$9);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result2 = func2.apply(this, args);
          memoized.cache = cache.set(key, result2) || cache;
          return result2;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      var MAX_MEMOIZE_SIZE = 500;
      function memoizeCapped(func2) {
        var result2 = memoize(func2, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result2.cache;
        return result2;
      }
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = memoizeCapped(function(string2) {
        var result2 = [];
        if (string2.charCodeAt(0) === 46) {
          result2.push("");
        }
        string2.replace(rePropName, function(match, number2, quote, subString) {
          result2.push(quote ? subString.replace(reEscapeChar, "$1") : number2 || match);
        });
        return result2;
      });
      function toString$2(value) {
        return value == null ? "" : baseToString(value);
      }
      function castPath(value, object2) {
        if (isArray$2(value)) {
          return value;
        }
        return isKey(value, object2) ? [value] : stringToPath(toString$2(value));
      }
      var INFINITY$3 = 1 / 0;
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY$3 ? "-0" : result2;
      }
      function baseGet(object2, path) {
        path = castPath(path, object2);
        var index = 0, length = path.length;
        while (object2 != null && index < length) {
          object2 = object2[toKey(path[index++])];
        }
        return index && index == length ? object2 : void 0;
      }
      function get(object2, path, defaultValue) {
        var result2 = object2 == null ? void 0 : baseGet(object2, path);
        return result2 === void 0 ? defaultValue : result2;
      }
      function baseAt(object2, paths) {
        var index = -1, length = paths.length, result2 = Array(length), skip = object2 == null;
        while (++index < length) {
          result2[index] = skip ? void 0 : get(object2, paths[index]);
        }
        return result2;
      }
      function arrayPush(array2, values2) {
        var index = -1, length = values2.length, offset = array2.length;
        while (++index < length) {
          array2[offset + index] = values2[index];
        }
        return array2;
      }
      var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
      function isFlattenable(value) {
        return isArray$2(value) || isArguments$1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function baseFlatten(array2, depth, predicate, isStrict, result2) {
        var index = -1, length = array2.length;
        predicate || (predicate = isFlattenable);
        result2 || (result2 = []);
        while (++index < length) {
          var value = array2[index];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result2);
            } else {
              arrayPush(result2, value);
            }
          } else if (!isStrict) {
            result2[result2.length] = value;
          }
        }
        return result2;
      }
      function flatten(array2) {
        var length = array2 == null ? 0 : array2.length;
        return length ? baseFlatten(array2, 1) : [];
      }
      function flatRest(func2) {
        return setToString(overRest(func2, void 0, flatten), func2 + "");
      }
      var at$1 = flatRest(baseAt);
      const at$2 = at$1;
      var getPrototype = overArg(Object.getPrototypeOf, Object);
      var objectTag$3 = "[object Object]";
      var funcProto = Function.prototype, objectProto$e = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty$d = objectProto$e.hasOwnProperty;
      var objectCtorString = funcToString.call(Object);
      function isPlainObject$1(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty$d.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      var domExcTag = "[object DOMException]", errorTag$2 = "[object Error]";
      function isError(value) {
        if (!isObjectLike(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == errorTag$2 || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject$1(value);
      }
      var attempt = baseRest(function(func2, args) {
        try {
          return apply(func2, void 0, args);
        } catch (e) {
          return isError(e) ? e : new Error(e);
        }
      });
      const attempt$1 = attempt;
      var FUNC_ERROR_TEXT$8 = "Expected a function";
      function before(n, func2) {
        var result2;
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$8);
        }
        n = toInteger(n);
        return function() {
          if (--n > 0) {
            result2 = func2.apply(this, arguments);
          }
          if (n <= 1) {
            func2 = void 0;
          }
          return result2;
        };
      }
      var WRAP_BIND_FLAG$1 = 1, WRAP_PARTIAL_FLAG$3 = 32;
      var bind$3 = baseRest(function(func2, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG$1;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind$3));
          bitmask |= WRAP_PARTIAL_FLAG$3;
        }
        return createWrap(func2, bitmask, thisArg, partials, holders);
      });
      bind$3.placeholder = {};
      const bind$4 = bind$3;
      var bindAll = flatRest(function(object2, methodNames) {
        arrayEach(methodNames, function(key) {
          key = toKey(key);
          baseAssignValue(object2, key, bind$4(object2[key], object2));
        });
        return object2;
      });
      const bindAll$1 = bindAll;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG$1 = 2, WRAP_PARTIAL_FLAG$2 = 32;
      var bindKey = baseRest(function(object2, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG$1;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG$2;
        }
        return createWrap(key, bitmask, object2, partials, holders);
      });
      bindKey.placeholder = {};
      const bindKey$1 = bindKey;
      function baseSlice(array2, start, end) {
        var index = -1, length = array2.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result2 = Array(length);
        while (++index < length) {
          result2[index] = array2[index + start];
        }
        return result2;
      }
      function castSlice(array2, start, end) {
        var length = array2.length;
        end = end === void 0 ? length : end;
        return !start && end >= length ? array2 : baseSlice(array2, start, end);
      }
      var rsAstralRange$3 = "\\ud800-\\udfff", rsComboMarksRange$4 = "\\u0300-\\u036f", reComboHalfMarksRange$4 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$4 = "\\u20d0-\\u20ff", rsComboRange$4 = rsComboMarksRange$4 + reComboHalfMarksRange$4 + rsComboSymbolsRange$4, rsVarRange$3 = "\\ufe0e\\ufe0f";
      var rsZWJ$3 = "\\u200d";
      var reHasUnicode = RegExp("[" + rsZWJ$3 + rsAstralRange$3 + rsComboRange$4 + rsVarRange$3 + "]");
      function hasUnicode(string2) {
        return reHasUnicode.test(string2);
      }
      function asciiToArray(string2) {
        return string2.split("");
      }
      var rsAstralRange$2 = "\\ud800-\\udfff", rsComboMarksRange$3 = "\\u0300-\\u036f", reComboHalfMarksRange$3 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$3 = "\\u20d0-\\u20ff", rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3, rsVarRange$2 = "\\ufe0e\\ufe0f";
      var rsAstral$1 = "[" + rsAstralRange$2 + "]", rsCombo$3 = "[" + rsComboRange$3 + "]", rsFitz$2 = "\\ud83c[\\udffb-\\udfff]", rsModifier$2 = "(?:" + rsCombo$3 + "|" + rsFitz$2 + ")", rsNonAstral$2 = "[^" + rsAstralRange$2 + "]", rsRegional$2 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$2 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ$2 = "\\u200d";
      var reOptMod$2 = rsModifier$2 + "?", rsOptVar$2 = "[" + rsVarRange$2 + "]?", rsOptJoin$2 = "(?:" + rsZWJ$2 + "(?:" + [rsNonAstral$2, rsRegional$2, rsSurrPair$2].join("|") + ")" + rsOptVar$2 + reOptMod$2 + ")*", rsSeq$2 = rsOptVar$2 + reOptMod$2 + rsOptJoin$2, rsSymbol$1 = "(?:" + [rsNonAstral$2 + rsCombo$3 + "?", rsCombo$3, rsRegional$2, rsSurrPair$2, rsAstral$1].join("|") + ")";
      var reUnicode$1 = RegExp(rsFitz$2 + "(?=" + rsFitz$2 + ")|" + rsSymbol$1 + rsSeq$2, "g");
      function unicodeToArray(string2) {
        return string2.match(reUnicode$1) || [];
      }
      function stringToArray(string2) {
        return hasUnicode(string2) ? unicodeToArray(string2) : asciiToArray(string2);
      }
      function createCaseFirst(methodName) {
        return function(string2) {
          string2 = toString$2(string2);
          var strSymbols = hasUnicode(string2) ? stringToArray(string2) : void 0;
          var chr = strSymbols ? strSymbols[0] : string2.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string2.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      var upperFirst = createCaseFirst("toUpperCase");
      const upperFirst$1 = upperFirst;
      function capitalize(string2) {
        return upperFirst$1(toString$2(string2).toLowerCase());
      }
      function arrayReduce(array2, iteratee2, accumulator, initAccum) {
        var index = -1, length = array2 == null ? 0 : array2.length;
        if (initAccum && length) {
          accumulator = array2[++index];
        }
        while (++index < length) {
          accumulator = iteratee2(accumulator, array2[index], index, array2);
        }
        return accumulator;
      }
      function basePropertyOf(object2) {
        return function(key) {
          return object2 == null ? void 0 : object2[key];
        };
      }
      var deburredLetters = {
        // Latin-1 Supplement block.
        "À": "A",
        "Á": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "A",
        "Å": "A",
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "å": "a",
        "Ç": "C",
        "ç": "c",
        "Ð": "D",
        "ð": "d",
        "È": "E",
        "É": "E",
        "Ê": "E",
        "Ë": "E",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "Ì": "I",
        "Í": "I",
        "Î": "I",
        "Ï": "I",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "Ñ": "N",
        "ñ": "n",
        "Ò": "O",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "O",
        "Ø": "O",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "ø": "o",
        "Ù": "U",
        "Ú": "U",
        "Û": "U",
        "Ü": "U",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "u",
        "Ý": "Y",
        "ý": "y",
        "ÿ": "y",
        "Æ": "Ae",
        "æ": "ae",
        "Þ": "Th",
        "þ": "th",
        "ß": "ss",
        // Latin Extended-A block.
        "Ā": "A",
        "Ă": "A",
        "Ą": "A",
        "ā": "a",
        "ă": "a",
        "ą": "a",
        "Ć": "C",
        "Ĉ": "C",
        "Ċ": "C",
        "Č": "C",
        "ć": "c",
        "ĉ": "c",
        "ċ": "c",
        "č": "c",
        "Ď": "D",
        "Đ": "D",
        "ď": "d",
        "đ": "d",
        "Ē": "E",
        "Ĕ": "E",
        "Ė": "E",
        "Ę": "E",
        "Ě": "E",
        "ē": "e",
        "ĕ": "e",
        "ė": "e",
        "ę": "e",
        "ě": "e",
        "Ĝ": "G",
        "Ğ": "G",
        "Ġ": "G",
        "Ģ": "G",
        "ĝ": "g",
        "ğ": "g",
        "ġ": "g",
        "ģ": "g",
        "Ĥ": "H",
        "Ħ": "H",
        "ĥ": "h",
        "ħ": "h",
        "Ĩ": "I",
        "Ī": "I",
        "Ĭ": "I",
        "Į": "I",
        "İ": "I",
        "ĩ": "i",
        "ī": "i",
        "ĭ": "i",
        "į": "i",
        "ı": "i",
        "Ĵ": "J",
        "ĵ": "j",
        "Ķ": "K",
        "ķ": "k",
        "ĸ": "k",
        "Ĺ": "L",
        "Ļ": "L",
        "Ľ": "L",
        "Ŀ": "L",
        "Ł": "L",
        "ĺ": "l",
        "ļ": "l",
        "ľ": "l",
        "ŀ": "l",
        "ł": "l",
        "Ń": "N",
        "Ņ": "N",
        "Ň": "N",
        "Ŋ": "N",
        "ń": "n",
        "ņ": "n",
        "ň": "n",
        "ŋ": "n",
        "Ō": "O",
        "Ŏ": "O",
        "Ő": "O",
        "ō": "o",
        "ŏ": "o",
        "ő": "o",
        "Ŕ": "R",
        "Ŗ": "R",
        "Ř": "R",
        "ŕ": "r",
        "ŗ": "r",
        "ř": "r",
        "Ś": "S",
        "Ŝ": "S",
        "Ş": "S",
        "Š": "S",
        "ś": "s",
        "ŝ": "s",
        "ş": "s",
        "š": "s",
        "Ţ": "T",
        "Ť": "T",
        "Ŧ": "T",
        "ţ": "t",
        "ť": "t",
        "ŧ": "t",
        "Ũ": "U",
        "Ū": "U",
        "Ŭ": "U",
        "Ů": "U",
        "Ű": "U",
        "Ų": "U",
        "ũ": "u",
        "ū": "u",
        "ŭ": "u",
        "ů": "u",
        "ű": "u",
        "ų": "u",
        "Ŵ": "W",
        "ŵ": "w",
        "Ŷ": "Y",
        "ŷ": "y",
        "Ÿ": "Y",
        "Ź": "Z",
        "Ż": "Z",
        "Ž": "Z",
        "ź": "z",
        "ż": "z",
        "ž": "z",
        "Ĳ": "IJ",
        "ĳ": "ij",
        "Œ": "Oe",
        "œ": "oe",
        "ŉ": "'n",
        "ſ": "s"
      };
      var deburrLetter = basePropertyOf(deburredLetters);
      const deburrLetter$1 = deburrLetter;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var rsComboMarksRange$2 = "\\u0300-\\u036f", reComboHalfMarksRange$2 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$2 = "\\u20d0-\\u20ff", rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2;
      var rsCombo$2 = "[" + rsComboRange$2 + "]";
      var reComboMark = RegExp(rsCombo$2, "g");
      function deburr(string2) {
        string2 = toString$2(string2);
        return string2 && string2.replace(reLatin, deburrLetter$1).replace(reComboMark, "");
      }
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      function asciiWords(string2) {
        return string2.match(reAsciiWord) || [];
      }
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      function hasUnicodeWord(string2) {
        return reHasUnicodeWord.test(string2);
      }
      var rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange$1 = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos$1 = "['’]", rsBreak = "[" + rsBreakRange + "]", rsCombo$1 = "[" + rsComboRange$1 + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange$1 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz$1 = "\\ud83c[\\udffb-\\udfff]", rsModifier$1 = "(?:" + rsCombo$1 + "|" + rsFitz$1 + ")", rsNonAstral$1 = "[^" + rsAstralRange$1 + "]", rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ$1 = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos$1 + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos$1 + "(?:D|LL|M|RE|S|T|VE))?", reOptMod$1 = rsModifier$1 + "?", rsOptVar$1 = "[" + rsVarRange$1 + "]?", rsOptJoin$1 = "(?:" + rsZWJ$1 + "(?:" + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsOptVar$1 + reOptMod$1 + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1, rsEmoji = "(?:" + [rsDingbat, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsSeq$1;
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      function unicodeWords(string2) {
        return string2.match(reUnicodeWord) || [];
      }
      function words(string2, pattern, guard) {
        string2 = toString$2(string2);
        pattern = guard ? void 0 : pattern;
        if (pattern === void 0) {
          return hasUnicodeWord(string2) ? unicodeWords(string2) : asciiWords(string2);
        }
        return string2.match(pattern) || [];
      }
      var rsApos = "['’]";
      var reApos = RegExp(rsApos, "g");
      function createCompounder(callback) {
        return function(string2) {
          return arrayReduce(words(deburr(string2).replace(reApos, "")), callback, "");
        };
      }
      var camelCase = createCompounder(function(result2, word, index) {
        word = word.toLowerCase();
        return result2 + (index ? capitalize(word) : word);
      });
      const camelCase$1 = camelCase;
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray$2(value) ? value : [value];
      }
      var nativeIsFinite$1 = root.isFinite, nativeMin$c = Math.min;
      function createRound(methodName) {
        var func2 = Math[methodName];
        return function(number2, precision) {
          number2 = toNumber(number2);
          precision = precision == null ? 0 : nativeMin$c(toInteger(precision), 292);
          if (precision && nativeIsFinite$1(number2)) {
            var pair = (toString$2(number2) + "e").split("e"), value = func2(pair[0] + "e" + (+pair[1] + precision));
            pair = (toString$2(value) + "e").split("e");
            return +(pair[0] + "e" + (+pair[1] - precision));
          }
          return func2(number2);
        };
      }
      var ceil = createRound("ceil");
      const ceil$1 = ceil;
      function chain(value) {
        var result2 = lodash(value);
        result2.__chain__ = true;
        return result2;
      }
      var nativeCeil$3 = Math.ceil, nativeMax$c = Math.max;
      function chunk(array2, size2, guard) {
        if (guard ? isIterateeCall(array2, size2, guard) : size2 === void 0) {
          size2 = 1;
        } else {
          size2 = nativeMax$c(toInteger(size2), 0);
        }
        var length = array2 == null ? 0 : array2.length;
        if (!length || size2 < 1) {
          return [];
        }
        var index = 0, resIndex = 0, result2 = Array(nativeCeil$3(length / size2));
        while (index < length) {
          result2[resIndex++] = baseSlice(array2, index, index += size2);
        }
        return result2;
      }
      function baseClamp(number2, lower, upper) {
        if (number2 === number2) {
          if (upper !== void 0) {
            number2 = number2 <= upper ? number2 : upper;
          }
          if (lower !== void 0) {
            number2 = number2 >= lower ? number2 : lower;
          }
        }
        return number2;
      }
      function clamp(number2, lower, upper) {
        if (upper === void 0) {
          upper = lower;
          lower = void 0;
        }
        if (upper !== void 0) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== void 0) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number2), lower, upper);
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result2 = data["delete"](key);
        this.size = data.size;
        return result2;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      var LARGE_ARRAY_SIZE$2 = 200;
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE$2 - 1) {
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
      function baseAssign(object2, source) {
        return object2 && copyObject(source, keys(source), object2);
      }
      function baseAssignIn(object2, source) {
        return object2 && copyObject(source, keysIn(source), object2);
      }
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer$1 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : void 0;
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result2);
        return result2;
      }
      function arrayFilter(array2, predicate) {
        var index = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array2[index];
          if (predicate(value, index, array2)) {
            result2[resIndex++] = value;
          }
        }
        return result2;
      }
      function stubArray() {
        return [];
      }
      var objectProto$d = Object.prototype;
      var propertyIsEnumerable = objectProto$d.propertyIsEnumerable;
      var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
      var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object2) {
        if (object2 == null) {
          return [];
        }
        object2 = Object(object2);
        return arrayFilter(nativeGetSymbols$1(object2), function(symbol) {
          return propertyIsEnumerable.call(object2, symbol);
        });
      };
      function copySymbols(source, object2) {
        return copyObject(source, getSymbols(source), object2);
      }
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object2) {
        var result2 = [];
        while (object2) {
          arrayPush(result2, getSymbols(object2));
          object2 = getPrototype(object2);
        }
        return result2;
      };
      function copySymbolsIn(source, object2) {
        return copyObject(source, getSymbolsIn(source), object2);
      }
      function baseGetAllKeys(object2, keysFunc, symbolsFunc) {
        var result2 = keysFunc(object2);
        return isArray$2(object2) ? result2 : arrayPush(result2, symbolsFunc(object2));
      }
      function getAllKeys(object2) {
        return baseGetAllKeys(object2, keys, getSymbols);
      }
      function getAllKeysIn(object2) {
        return baseGetAllKeys(object2, keysIn, getSymbolsIn);
      }
      var DataView = getNative(root, "DataView");
      var Promise$1 = getNative(root, "Promise");
      var Set$1 = getNative(root, "Set");
      var mapTag$8 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$8 = "[object Set]", weakMapTag$2 = "[object WeakMap]";
      var dataViewTag$3 = "[object DataView]";
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap);
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$8 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$8 || WeakMap && getTag(new WeakMap()) != weakMapTag$2) {
        getTag = function(value) {
          var result2 = baseGetTag(value), Ctor = result2 == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag$3;
              case mapCtorString:
                return mapTag$8;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag$8;
              case weakMapCtorString:
                return weakMapTag$2;
            }
          }
          return result2;
        };
      }
      const getTag$1 = getTag;
      var objectProto$c = Object.prototype;
      var hasOwnProperty$c = objectProto$c.hasOwnProperty;
      function initCloneArray(array2) {
        var length = array2.length, result2 = new array2.constructor(length);
        if (length && typeof array2[0] == "string" && hasOwnProperty$c.call(array2, "index")) {
          result2.index = array2.index;
          result2.input = array2.input;
        }
        return result2;
      }
      var Uint8Array$1 = root.Uint8Array;
      function cloneArrayBuffer(arrayBuffer) {
        var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array$1(result2).set(new Uint8Array$1(arrayBuffer));
        return result2;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      var reFlags$1 = /\w*$/;
      function cloneRegExp(regexp) {
        var result2 = new regexp.constructor(regexp.source, reFlags$1.exec(regexp));
        result2.lastIndex = regexp.lastIndex;
        return result2;
      }
      var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
      function cloneSymbol(symbol) {
        return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      var boolTag$3 = "[object Boolean]", dateTag$3 = "[object Date]", mapTag$7 = "[object Map]", numberTag$3 = "[object Number]", regexpTag$3 = "[object RegExp]", setTag$7 = "[object Set]", stringTag$3 = "[object String]", symbolTag$2 = "[object Symbol]";
      var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
      function initCloneByTag(object2, tag, isDeep) {
        var Ctor = object2.constructor;
        switch (tag) {
          case arrayBufferTag$3:
            return cloneArrayBuffer(object2);
          case boolTag$3:
          case dateTag$3:
            return new Ctor(+object2);
          case dataViewTag$2:
            return cloneDataView(object2, isDeep);
          case float32Tag$1:
          case float64Tag$1:
          case int8Tag$1:
          case int16Tag$1:
          case int32Tag$1:
          case uint8Tag$1:
          case uint8ClampedTag$1:
          case uint16Tag$1:
          case uint32Tag$1:
            return cloneTypedArray(object2, isDeep);
          case mapTag$7:
            return new Ctor();
          case numberTag$3:
          case stringTag$3:
            return new Ctor(object2);
          case regexpTag$3:
            return cloneRegExp(object2);
          case setTag$7:
            return new Ctor();
          case symbolTag$2:
            return cloneSymbol(object2);
        }
      }
      function initCloneObject(object2) {
        return typeof object2.constructor == "function" && !isPrototype(object2) ? baseCreate(getPrototype(object2)) : {};
      }
      var mapTag$6 = "[object Map]";
      function baseIsMap(value) {
        return isObjectLike(value) && getTag$1(value) == mapTag$6;
      }
      var nodeIsMap = nodeUtil && nodeUtil.isMap;
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      const isMap$1 = isMap;
      var setTag$6 = "[object Set]";
      function baseIsSet(value) {
        return isObjectLike(value) && getTag$1(value) == setTag$6;
      }
      var nodeIsSet = nodeUtil && nodeUtil.isSet;
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      const isSet$1 = isSet;
      var CLONE_DEEP_FLAG$7 = 1, CLONE_FLAT_FLAG$1 = 2, CLONE_SYMBOLS_FLAG$5 = 4;
      var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$2 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$5 = "[object Map]", numberTag$2 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$2 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$2 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag$1 = "[object WeakMap]";
      var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var cloneableTags = {};
      cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$5] = cloneableTags[numberTag$2] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$2] = cloneableTags[setTag$5] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag$1] = false;
      function baseClone(value, bitmask, customizer, key, object2, stack) {
        var result2, isDeep = bitmask & CLONE_DEEP_FLAG$7, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$5;
        if (customizer) {
          result2 = object2 ? customizer(value, key, object2, stack) : customizer(value);
        }
        if (result2 !== void 0) {
          return result2;
        }
        if (!isObject$2(value)) {
          return value;
        }
        var isArr = isArray$2(value);
        if (isArr) {
          result2 = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result2);
          }
        } else {
          var tag = getTag$1(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer$2(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object2) {
            result2 = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object2 ? value : {};
            }
            result2 = initCloneByTag(value, tag, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result2);
        if (isSet$1(value)) {
          value.forEach(function(subValue) {
            result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap$1(value)) {
          value.forEach(function(subValue, key2) {
            result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
        }
        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? void 0 : keysFunc(value);
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
        return result2;
      }
      var CLONE_SYMBOLS_FLAG$4 = 4;
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG$4);
      }
      var CLONE_DEEP_FLAG$6 = 1, CLONE_SYMBOLS_FLAG$3 = 4;
      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG$6 | CLONE_SYMBOLS_FLAG$3);
      }
      var CLONE_DEEP_FLAG$5 = 1, CLONE_SYMBOLS_FLAG$2 = 4;
      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : void 0;
        return baseClone(value, CLONE_DEEP_FLAG$5 | CLONE_SYMBOLS_FLAG$2, customizer);
      }
      var CLONE_SYMBOLS_FLAG$1 = 4;
      function cloneWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : void 0;
        return baseClone(value, CLONE_SYMBOLS_FLAG$1, customizer);
      }
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }
      function compact(array2) {
        var index = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array2[index];
          if (value) {
            result2[resIndex++] = value;
          }
        }
        return result2;
      }
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array(length - 1), array2 = arguments[0], index = length;
        while (index--) {
          args[index - 1] = arguments[index];
        }
        return arrayPush(isArray$2(array2) ? copyArray(array2) : [array2], baseFlatten(args, 1));
      }
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      function SetCache(values2) {
        var index = -1, length = values2 == null ? 0 : values2.length;
        this.__data__ = new MapCache();
        while (++index < length) {
          this.add(values2[index]);
        }
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function arraySome(array2, predicate) {
        var index = -1, length = array2 == null ? 0 : array2.length;
        while (++index < length) {
          if (predicate(array2[index], index, array2)) {
            return true;
          }
        }
        return false;
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
      function equalArrays(array2, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array2.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array2);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array2;
        }
        var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
        stack.set(array2, other);
        stack.set(other, array2);
        while (++index < arrLength) {
          var arrValue = array2[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array2, stack) : customizer(arrValue, othValue, index, array2, other, stack);
          }
          if (compared !== void 0) {
            if (compared) {
              continue;
            }
            result2 = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result2 = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result2 = false;
            break;
          }
        }
        stack["delete"](array2);
        stack["delete"](other);
        return result2;
      }
      function mapToArray(map2) {
        var index = -1, result2 = Array(map2.size);
        map2.forEach(function(value, key) {
          result2[++index] = [key, value];
        });
        return result2;
      }
      function setToArray(set2) {
        var index = -1, result2 = Array(set2.size);
        set2.forEach(function(value) {
          result2[++index] = value;
        });
        return result2;
      }
      var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
      var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag = "[object Error]", mapTag$4 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$4 = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
      var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
      var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function equalByTag(object2, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object2.byteLength != other.byteLength || object2.byteOffset != other.byteOffset) {
              return false;
            }
            object2 = object2.buffer;
            other = other.buffer;
          case arrayBufferTag$1:
            if (object2.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object2), new Uint8Array$1(other))) {
              return false;
            }
            return true;
          case boolTag$1:
          case dateTag$1:
          case numberTag$1:
            return eq(+object2, +other);
          case errorTag:
            return object2.name == other.name && object2.message == other.message;
          case regexpTag$1:
          case stringTag$1:
            return object2 == other + "";
          case mapTag$4:
            var convert = mapToArray;
          case setTag$4:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
            convert || (convert = setToArray);
            if (object2.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object2);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG$2;
            stack.set(object2, other);
            var result2 = equalArrays(convert(object2), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object2);
            return result2;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object2) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      var COMPARE_PARTIAL_FLAG$3 = 1;
      var objectProto$b = Object.prototype;
      var hasOwnProperty$b = objectProto$b.hasOwnProperty;
      function equalObjects(object2, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object2), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isPartial ? key in other : hasOwnProperty$b.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object2);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object2;
        }
        var result2 = true;
        stack.set(object2, other);
        stack.set(other, object2);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object2[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object2, stack) : customizer(objValue, othValue, key, object2, other, stack);
          }
          if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result2 = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result2 && !skipCtor) {
          var objCtor = object2.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object2 && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result2 = false;
          }
        }
        stack["delete"](object2);
        stack["delete"](other);
        return result2;
      }
      var COMPARE_PARTIAL_FLAG$2 = 1;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
      var objectProto$a = Object.prototype;
      var hasOwnProperty$a = objectProto$a.hasOwnProperty;
      function baseIsEqualDeep(object2, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray$2(object2), othIsArr = isArray$2(other), objTag = objIsArr ? arrayTag : getTag$1(object2), othTag = othIsArr ? arrayTag : getTag$1(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer$2(object2)) {
          if (!isBuffer$2(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray$2(object2) ? equalArrays(object2, other, bitmask, customizer, equalFunc, stack) : equalByTag(object2, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
          var objIsWrapped = objIsObj && hasOwnProperty$a.call(object2, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$a.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object2.value() : object2, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object2, other, bitmask, customizer, equalFunc, stack);
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
      function baseIsMatch(object2, source, matchData, customizer) {
        var index = matchData.length, length = index, noCustomizer = !customizer;
        if (object2 == null) {
          return !length;
        }
        object2 = Object(object2);
        while (index--) {
          var data = matchData[index];
          if (noCustomizer && data[2] ? data[1] !== object2[data[0]] : !(data[0] in object2)) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key = data[0], objValue = object2[key], srcValue = data[1];
          if (noCustomizer && data[2]) {
            if (objValue === void 0 && !(key in object2)) {
              return false;
            }
          } else {
            var stack = new Stack();
            if (customizer) {
              var result2 = customizer(objValue, srcValue, key, object2, source, stack);
            }
            if (!(result2 === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result2)) {
              return false;
            }
          }
        }
        return true;
      }
      function isStrictComparable(value) {
        return value === value && !isObject$2(value);
      }
      function getMatchData(object2) {
        var result2 = keys(object2), length = result2.length;
        while (length--) {
          var key = result2[length], value = object2[key];
          result2[length] = [key, value, isStrictComparable(value)];
        }
        return result2;
      }
      function matchesStrictComparable(key, srcValue) {
        return function(object2) {
          if (object2 == null) {
            return false;
          }
          return object2[key] === srcValue && (srcValue !== void 0 || key in Object(object2));
        };
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object2) {
          return object2 === source || baseIsMatch(object2, source, matchData);
        };
      }
      function baseHasIn(object2, key) {
        return object2 != null && key in Object(object2);
      }
      function hasPath(object2, path, hasFunc) {
        path = castPath(path, object2);
        var index = -1, length = path.length, result2 = false;
        while (++index < length) {
          var key = toKey(path[index]);
          if (!(result2 = object2 != null && hasFunc(object2, key))) {
            break;
          }
          object2 = object2[key];
        }
        if (result2 || ++index != length) {
          return result2;
        }
        length = object2 == null ? 0 : object2.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray$2(object2) || isArguments$1(object2));
      }
      function hasIn(object2, path) {
        return object2 != null && hasPath(object2, path, baseHasIn);
      }
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object2) {
          var objValue = get(object2, path);
          return objValue === void 0 && objValue === srcValue ? hasIn(object2, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseProperty(key) {
        return function(object2) {
          return object2 == null ? void 0 : object2[key];
        };
      }
      function basePropertyDeep(path) {
        return function(object2) {
          return baseGet(object2, path);
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
          return isArray$2(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      var FUNC_ERROR_TEXT$7 = "Expected a function";
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length, toIteratee = baseIteratee;
        pairs = !length ? [] : arrayMap(pairs, function(pair) {
          if (typeof pair[1] != "function") {
            throw new TypeError(FUNC_ERROR_TEXT$7);
          }
          return [toIteratee(pair[0]), pair[1]];
        });
        return baseRest(function(args) {
          var index = -1;
          while (++index < length) {
            var pair = pairs[index];
            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }
      function baseConformsTo(object2, source, props) {
        var length = props.length;
        if (object2 == null) {
          return !length;
        }
        object2 = Object(object2);
        while (length--) {
          var key = props[length], predicate = source[key], value = object2[key];
          if (value === void 0 && !(key in object2) || !predicate(value)) {
            return false;
          }
        }
        return true;
      }
      function baseConforms(source) {
        var props = keys(source);
        return function(object2) {
          return baseConformsTo(object2, source, props);
        };
      }
      var CLONE_DEEP_FLAG$4 = 1;
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG$4));
      }
      function conformsTo(object2, source) {
        return source == null || baseConformsTo(object2, source, keys(source));
      }
      function arrayAggregator(array2, setter, iteratee2, accumulator) {
        var index = -1, length = array2 == null ? 0 : array2.length;
        while (++index < length) {
          var value = array2[index];
          setter(accumulator, value, iteratee2(value), array2);
        }
        return accumulator;
      }
      function createBaseFor(fromRight) {
        return function(object2, iteratee2, keysFunc) {
          var index = -1, iterable = Object(object2), props = keysFunc(object2), length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index];
            if (iteratee2(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object2;
        };
      }
      var baseFor = createBaseFor();
      function baseForOwn(object2, iteratee2) {
        return object2 && baseFor(object2, iteratee2, keys);
      }
      function createBaseEach(eachFunc, fromRight) {
        return function(collection2, iteratee2) {
          if (collection2 == null) {
            return collection2;
          }
          if (!isArrayLike(collection2)) {
            return eachFunc(collection2, iteratee2);
          }
          var length = collection2.length, index = fromRight ? length : -1, iterable = Object(collection2);
          while (fromRight ? index-- : ++index < length) {
            if (iteratee2(iterable[index], index, iterable) === false) {
              break;
            }
          }
          return collection2;
        };
      }
      var baseEach = createBaseEach(baseForOwn);
      function baseAggregator(collection2, setter, iteratee2, accumulator) {
        baseEach(collection2, function(value, key, collection3) {
          setter(accumulator, value, iteratee2(value), collection3);
        });
        return accumulator;
      }
      function createAggregator(setter, initializer) {
        return function(collection2, iteratee2) {
          var func2 = isArray$2(collection2) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
          return func2(collection2, setter, baseIteratee(iteratee2), accumulator);
        };
      }
      var objectProto$9 = Object.prototype;
      var hasOwnProperty$9 = objectProto$9.hasOwnProperty;
      var countBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty$9.call(result2, key)) {
          ++result2[key];
        } else {
          baseAssignValue(result2, key, 1);
        }
      });
      const countBy$1 = countBy;
      function create(prototype2, properties) {
        var result2 = baseCreate(prototype2);
        return properties == null ? result2 : baseAssign(result2, properties);
      }
      var WRAP_CURRY_FLAG$1 = 8;
      function curry(func2, arity, guard) {
        arity = guard ? void 0 : arity;
        var result2 = createWrap(func2, WRAP_CURRY_FLAG$1, void 0, void 0, void 0, void 0, void 0, arity);
        result2.placeholder = curry.placeholder;
        return result2;
      }
      curry.placeholder = {};
      var WRAP_CURRY_RIGHT_FLAG = 16;
      function curryRight(func2, arity, guard) {
        arity = guard ? void 0 : arity;
        var result2 = createWrap(func2, WRAP_CURRY_RIGHT_FLAG, void 0, void 0, void 0, void 0, void 0, arity);
        result2.placeholder = curryRight.placeholder;
        return result2;
      }
      curryRight.placeholder = {};
      var now = function() {
        return root.Date.now();
      };
      const now$1 = now;
      var FUNC_ERROR_TEXT$6 = "Expected a function";
      var nativeMax$b = Math.max, nativeMin$b = Math.min;
      function debounce(func2, wait, options) {
        var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$6);
        }
        wait = toNumber(wait) || 0;
        if (isObject$2(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax$b(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = void 0;
          lastInvokeTime = time;
          result2 = func2.apply(thisArg, args);
          return result2;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result2;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin$b(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
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
          return result2;
        }
        function cancel() {
          if (timerId !== void 0) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = void 0;
        }
        function flush() {
          return timerId === void 0 ? result2 : trailingEdge(now$1());
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
          return result2;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }
      var objectProto$8 = Object.prototype;
      var hasOwnProperty$8 = objectProto$8.hasOwnProperty;
      var defaults$2 = baseRest(function(object2, sources) {
        object2 = Object(object2);
        var index = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;
          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object2[key];
            if (value === void 0 || eq(value, objectProto$8[key]) && !hasOwnProperty$8.call(object2, key)) {
              object2[key] = source[key];
            }
          }
        }
        return object2;
      });
      const defaults$3 = defaults$2;
      function assignMergeValue(object2, key, value) {
        if (value !== void 0 && !eq(object2[key], value) || value === void 0 && !(key in object2)) {
          baseAssignValue(object2, key, value);
        }
      }
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      function safeGet(object2, key) {
        if (key === "constructor" && typeof object2[key] === "function") {
          return;
        }
        if (key == "__proto__") {
          return;
        }
        return object2[key];
      }
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }
      function baseMergeDeep(object2, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object2, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object2, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + "", object2, source, stack) : void 0;
        var isCommon = newValue === void 0;
        if (isCommon) {
          var isArr = isArray$2(srcValue), isBuff = !isArr && isBuffer$2(srcValue), isTyped = !isArr && !isBuff && isTypedArray$2(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray$2(objValue)) {
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
          } else if (isPlainObject$1(srcValue) || isArguments$1(srcValue)) {
            newValue = objValue;
            if (isArguments$1(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject$2(objValue) || isFunction$2(objValue)) {
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
        assignMergeValue(object2, key, newValue);
      }
      function baseMerge(object2, source, srcIndex, customizer, stack) {
        if (object2 === source) {
          return;
        }
        baseFor(source, function(srcValue, key) {
          stack || (stack = new Stack());
          if (isObject$2(srcValue)) {
            baseMergeDeep(object2, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object2, key), srcValue, key + "", object2, source, stack) : void 0;
            if (newValue === void 0) {
              newValue = srcValue;
            }
            assignMergeValue(object2, key, newValue);
          }
        }, keysIn);
      }
      function customDefaultsMerge(objValue, srcValue, key, object2, source, stack) {
        if (isObject$2(objValue) && isObject$2(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, void 0, customDefaultsMerge, stack);
          stack["delete"](srcValue);
        }
        return objValue;
      }
      var mergeWith = createAssigner(function(object2, source, srcIndex, customizer) {
        baseMerge(object2, source, srcIndex, customizer);
      });
      const mergeWith$1 = mergeWith;
      var defaultsDeep = baseRest(function(args) {
        args.push(void 0, customDefaultsMerge);
        return apply(mergeWith$1, void 0, args);
      });
      const defaultsDeep$1 = defaultsDeep;
      var FUNC_ERROR_TEXT$5 = "Expected a function";
      function baseDelay(func2, wait, args) {
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$5);
        }
        return setTimeout(function() {
          func2.apply(void 0, args);
        }, wait);
      }
      var defer = baseRest(function(func2, args) {
        return baseDelay(func2, 1, args);
      });
      const defer$1 = defer;
      var delay = baseRest(function(func2, wait, args) {
        return baseDelay(func2, toNumber(wait) || 0, args);
      });
      const delay$1 = delay;
      function arrayIncludesWith(array2, value, comparator) {
        var index = -1, length = array2 == null ? 0 : array2.length;
        while (++index < length) {
          if (comparator(value, array2[index])) {
            return true;
          }
        }
        return false;
      }
      var LARGE_ARRAY_SIZE$1 = 200;
      function baseDifference(array2, values2, iteratee2, comparator) {
        var index = -1, includes2 = arrayIncludes, isCommon = true, length = array2.length, result2 = [], valuesLength = values2.length;
        if (!length) {
          return result2;
        }
        if (iteratee2) {
          values2 = arrayMap(values2, baseUnary(iteratee2));
        }
        if (comparator) {
          includes2 = arrayIncludesWith;
          isCommon = false;
        } else if (values2.length >= LARGE_ARRAY_SIZE$1) {
          includes2 = cacheHas;
          isCommon = false;
          values2 = new SetCache(values2);
        }
        outer:
          while (++index < length) {
            var value = array2[index], computed = iteratee2 == null ? value : iteratee2(value);
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var valuesIndex = valuesLength;
              while (valuesIndex--) {
                if (values2[valuesIndex] === computed) {
                  continue outer;
                }
              }
              result2.push(value);
            } else if (!includes2(values2, computed, comparator)) {
              result2.push(value);
            }
          }
        return result2;
      }
      var difference = baseRest(function(array2, values2) {
        return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
      });
      const difference$1 = difference;
      function last(array2) {
        var length = array2 == null ? 0 : array2.length;
        return length ? array2[length - 1] : void 0;
      }
      var differenceBy = baseRest(function(array2, values2) {
        var iteratee2 = last(values2);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = void 0;
        }
        return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true), baseIteratee(iteratee2)) : [];
      });
      const differenceBy$1 = differenceBy;
      var differenceWith = baseRest(function(array2, values2) {
        var comparator = last(values2);
        if (isArrayLikeObject(comparator)) {
          comparator = void 0;
        }
        return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true), void 0, comparator) : [];
      });
      const differenceWith$1 = differenceWith;
      var divide = createMathOperation(function(dividend, divisor) {
        return dividend / divisor;
      }, 1);
      const divide$1 = divide;
      function drop(array2, n, guard) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return [];
        }
        n = guard || n === void 0 ? 1 : toInteger(n);
        return baseSlice(array2, n < 0 ? 0 : n, length);
      }
      function dropRight(array2, n, guard) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return [];
        }
        n = guard || n === void 0 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array2, 0, n < 0 ? 0 : n);
      }
      function baseWhile(array2, predicate, isDrop, fromRight) {
        var length = array2.length, index = fromRight ? length : -1;
        while ((fromRight ? index-- : ++index < length) && predicate(array2[index], index, array2)) {
        }
        return isDrop ? baseSlice(array2, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array2, fromRight ? index + 1 : 0, fromRight ? length : index);
      }
      function dropRightWhile(array2, predicate) {
        return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate), true, true) : [];
      }
      function dropWhile(array2, predicate) {
        return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate), true) : [];
      }
      function castFunction(value) {
        return typeof value == "function" ? value : identity;
      }
      function forEach$2(collection2, iteratee2) {
        var func2 = isArray$2(collection2) ? arrayEach : baseEach;
        return func2(collection2, castFunction(iteratee2));
      }
      function arrayEachRight(array2, iteratee2) {
        var length = array2 == null ? 0 : array2.length;
        while (length--) {
          if (iteratee2(array2[length], length, array2) === false) {
            break;
          }
        }
        return array2;
      }
      var baseForRight = createBaseFor(true);
      function baseForOwnRight(object2, iteratee2) {
        return object2 && baseForRight(object2, iteratee2, keys);
      }
      var baseEachRight = createBaseEach(baseForOwnRight, true);
      const baseEachRight$1 = baseEachRight;
      function forEachRight(collection2, iteratee2) {
        var func2 = isArray$2(collection2) ? arrayEachRight : baseEachRight$1;
        return func2(collection2, castFunction(iteratee2));
      }
      function endsWith$1(string2, target, position) {
        string2 = toString$2(string2);
        target = baseToString(target);
        var length = string2.length;
        position = position === void 0 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target.length;
        return position >= 0 && string2.slice(position, end) == target;
      }
      function baseToPairs(object2, props) {
        return arrayMap(props, function(key) {
          return [key, object2[key]];
        });
      }
      function setToPairs(set2) {
        var index = -1, result2 = Array(set2.size);
        set2.forEach(function(value) {
          result2[++index] = [value, value];
        });
        return result2;
      }
      var mapTag$3 = "[object Map]", setTag$3 = "[object Set]";
      function createToPairs(keysFunc) {
        return function(object2) {
          var tag = getTag$1(object2);
          if (tag == mapTag$3) {
            return mapToArray(object2);
          }
          if (tag == setTag$3) {
            return setToPairs(object2);
          }
          return baseToPairs(object2, keysFunc(object2));
        };
      }
      var toPairs = createToPairs(keys);
      const toPairs$1 = toPairs;
      var toPairsIn = createToPairs(keysIn);
      const toPairsIn$1 = toPairsIn;
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      const escapeHtmlChar$1 = escapeHtmlChar;
      var reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      function escape(string2) {
        string2 = toString$2(string2);
        return string2 && reHasUnescapedHtml.test(string2) ? string2.replace(reUnescapedHtml, escapeHtmlChar$1) : string2;
      }
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      function escapeRegExp(string2) {
        string2 = toString$2(string2);
        return string2 && reHasRegExpChar.test(string2) ? string2.replace(reRegExpChar, "\\$&") : string2;
      }
      function arrayEvery(array2, predicate) {
        var index = -1, length = array2 == null ? 0 : array2.length;
        while (++index < length) {
          if (!predicate(array2[index], index, array2)) {
            return false;
          }
        }
        return true;
      }
      function baseEvery(collection2, predicate) {
        var result2 = true;
        baseEach(collection2, function(value, index, collection3) {
          result2 = !!predicate(value, index, collection3);
          return result2;
        });
        return result2;
      }
      function every(collection2, predicate, guard) {
        var func2 = isArray$2(collection2) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection2, predicate, guard)) {
          predicate = void 0;
        }
        return func2(collection2, baseIteratee(predicate));
      }
      var MAX_ARRAY_LENGTH$5 = 4294967295;
      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH$5) : 0;
      }
      function baseFill(array2, value, start, end) {
        var length = array2.length;
        start = toInteger(start);
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end === void 0 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start > end ? 0 : toLength(end);
        while (start < end) {
          array2[start++] = value;
        }
        return array2;
      }
      function fill(array2, value, start, end) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return [];
        }
        if (start && typeof start != "number" && isIterateeCall(array2, value, start)) {
          start = 0;
          end = length;
        }
        return baseFill(array2, value, start, end);
      }
      function baseFilter(collection2, predicate) {
        var result2 = [];
        baseEach(collection2, function(value, index, collection3) {
          if (predicate(value, index, collection3)) {
            result2.push(value);
          }
        });
        return result2;
      }
      function filter(collection2, predicate) {
        var func2 = isArray$2(collection2) ? arrayFilter : baseFilter;
        return func2(collection2, baseIteratee(predicate));
      }
      function createFind(findIndexFunc) {
        return function(collection2, predicate, fromIndex) {
          var iterable = Object(collection2);
          if (!isArrayLike(collection2)) {
            var iteratee2 = baseIteratee(predicate);
            collection2 = keys(collection2);
            predicate = function(key) {
              return iteratee2(iterable[key], key, iterable);
            };
          }
          var index = findIndexFunc(collection2, predicate, fromIndex);
          return index > -1 ? iterable[iteratee2 ? collection2[index] : index] : void 0;
        };
      }
      var nativeMax$a = Math.max;
      function findIndex(array2, predicate, fromIndex) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax$a(length + index, 0);
        }
        return baseFindIndex(array2, baseIteratee(predicate), index);
      }
      var find = createFind(findIndex);
      const find$1 = find;
      function baseFindKey(collection2, predicate, eachFunc) {
        var result2;
        eachFunc(collection2, function(value, key, collection3) {
          if (predicate(value, key, collection3)) {
            result2 = key;
            return false;
          }
        });
        return result2;
      }
      function findKey$1(object2, predicate) {
        return baseFindKey(object2, baseIteratee(predicate), baseForOwn);
      }
      var nativeMax$9 = Math.max, nativeMin$a = Math.min;
      function findLastIndex(array2, predicate, fromIndex) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return -1;
        }
        var index = length - 1;
        if (fromIndex !== void 0) {
          index = toInteger(fromIndex);
          index = fromIndex < 0 ? nativeMax$9(length + index, 0) : nativeMin$a(index, length - 1);
        }
        return baseFindIndex(array2, baseIteratee(predicate), index, true);
      }
      var findLast = createFind(findLastIndex);
      const findLast$1 = findLast;
      function findLastKey(object2, predicate) {
        return baseFindKey(object2, baseIteratee(predicate), baseForOwnRight);
      }
      function head(array2) {
        return array2 && array2.length ? array2[0] : void 0;
      }
      function baseMap(collection2, iteratee2) {
        var index = -1, result2 = isArrayLike(collection2) ? Array(collection2.length) : [];
        baseEach(collection2, function(value, key, collection3) {
          result2[++index] = iteratee2(value, key, collection3);
        });
        return result2;
      }
      function map(collection2, iteratee2) {
        var func2 = isArray$2(collection2) ? arrayMap : baseMap;
        return func2(collection2, baseIteratee(iteratee2));
      }
      function flatMap(collection2, iteratee2) {
        return baseFlatten(map(collection2, iteratee2), 1);
      }
      var INFINITY$2 = 1 / 0;
      function flatMapDeep(collection2, iteratee2) {
        return baseFlatten(map(collection2, iteratee2), INFINITY$2);
      }
      function flatMapDepth(collection2, iteratee2, depth) {
        depth = depth === void 0 ? 1 : toInteger(depth);
        return baseFlatten(map(collection2, iteratee2), depth);
      }
      var INFINITY$1 = 1 / 0;
      function flattenDeep(array2) {
        var length = array2 == null ? 0 : array2.length;
        return length ? baseFlatten(array2, INFINITY$1) : [];
      }
      function flattenDepth(array2, depth) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return [];
        }
        depth = depth === void 0 ? 1 : toInteger(depth);
        return baseFlatten(array2, depth);
      }
      var WRAP_FLIP_FLAG = 512;
      function flip(func2) {
        return createWrap(func2, WRAP_FLIP_FLAG);
      }
      var floor = createRound("floor");
      const floor$1 = floor;
      var FUNC_ERROR_TEXT$4 = "Expected a function";
      var WRAP_CURRY_FLAG = 8, WRAP_PARTIAL_FLAG$1 = 32, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG$1 = 256;
      function createFlow(fromRight) {
        return flatRest(function(funcs) {
          var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
          if (fromRight) {
            funcs.reverse();
          }
          while (index--) {
            var func2 = funcs[index];
            if (typeof func2 != "function") {
              throw new TypeError(FUNC_ERROR_TEXT$4);
            }
            if (prereq && !wrapper && getFuncName(func2) == "wrapper") {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index = wrapper ? index : length;
          while (++index < length) {
            func2 = funcs[index];
            var funcName = getFuncName(func2), data = funcName == "wrapper" ? getData(func2) : void 0;
            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG$1 | WRAP_REARG_FLAG$1) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func2.length == 1 && isLaziable(func2) ? wrapper[funcName]() : wrapper.thru(func2);
            }
          }
          return function() {
            var args = arguments, value = args[0];
            if (wrapper && args.length == 1 && isArray$2(value)) {
              return wrapper.plant(value).value();
            }
            var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
            while (++index2 < length) {
              result2 = funcs[index2].call(this, result2);
            }
            return result2;
          };
        });
      }
      var flow = createFlow();
      const flow$1 = flow;
      var flowRight = createFlow(true);
      const flowRight$1 = flowRight;
      function forIn(object2, iteratee2) {
        return object2 == null ? object2 : baseFor(object2, castFunction(iteratee2), keysIn);
      }
      function forInRight(object2, iteratee2) {
        return object2 == null ? object2 : baseForRight(object2, castFunction(iteratee2), keysIn);
      }
      function forOwn(object2, iteratee2) {
        return object2 && baseForOwn(object2, castFunction(iteratee2));
      }
      function forOwnRight(object2, iteratee2) {
        return object2 && baseForOwnRight(object2, castFunction(iteratee2));
      }
      function fromPairs(pairs) {
        var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
        while (++index < length) {
          var pair = pairs[index];
          result2[pair[0]] = pair[1];
        }
        return result2;
      }
      function baseFunctions(object2, props) {
        return arrayFilter(props, function(key) {
          return isFunction$2(object2[key]);
        });
      }
      function functions(object2) {
        return object2 == null ? [] : baseFunctions(object2, keys(object2));
      }
      function functionsIn(object2) {
        return object2 == null ? [] : baseFunctions(object2, keysIn(object2));
      }
      var objectProto$7 = Object.prototype;
      var hasOwnProperty$7 = objectProto$7.hasOwnProperty;
      var groupBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty$7.call(result2, key)) {
          result2[key].push(value);
        } else {
          baseAssignValue(result2, key, [value]);
        }
      });
      const groupBy$1 = groupBy;
      function baseGt(value, other) {
        return value > other;
      }
      function createRelationalOperation(operator) {
        return function(value, other) {
          if (!(typeof value == "string" && typeof other == "string")) {
            value = toNumber(value);
            other = toNumber(other);
          }
          return operator(value, other);
        };
      }
      var gt = createRelationalOperation(baseGt);
      const gt$1 = gt;
      var gte = createRelationalOperation(function(value, other) {
        return value >= other;
      });
      const gte$1 = gte;
      var objectProto$6 = Object.prototype;
      var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
      function baseHas(object2, key) {
        return object2 != null && hasOwnProperty$6.call(object2, key);
      }
      function has(object2, path) {
        return object2 != null && hasPath(object2, path, baseHas);
      }
      var nativeMax$8 = Math.max, nativeMin$9 = Math.min;
      function baseInRange(number2, start, end) {
        return number2 >= nativeMin$9(start, end) && number2 < nativeMax$8(start, end);
      }
      function inRange(number2, start, end) {
        start = toFinite(start);
        if (end === void 0) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        number2 = toNumber(number2);
        return baseInRange(number2, start, end);
      }
      var stringTag = "[object String]";
      function isString$2(value) {
        return typeof value == "string" || !isArray$2(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }
      function baseValues(object2, props) {
        return arrayMap(props, function(key) {
          return object2[key];
        });
      }
      function values(object2) {
        return object2 == null ? [] : baseValues(object2, keys(object2));
      }
      var nativeMax$7 = Math.max;
      function includes(collection2, value, fromIndex, guard) {
        collection2 = isArrayLike(collection2) ? collection2 : values(collection2);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection2.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax$7(length + fromIndex, 0);
        }
        return isString$2(collection2) ? fromIndex <= length && collection2.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection2, value, fromIndex) > -1;
      }
      var nativeMax$6 = Math.max;
      function indexOf(array2, value, fromIndex) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return -1;
        }
        var index = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index < 0) {
          index = nativeMax$6(length + index, 0);
        }
        return baseIndexOf(array2, value, index);
      }
      function initial(array2) {
        var length = array2 == null ? 0 : array2.length;
        return length ? baseSlice(array2, 0, -1) : [];
      }
      var nativeMin$8 = Math.min;
      function baseIntersection(arrays, iteratee2, comparator) {
        var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result2 = [];
        while (othIndex--) {
          var array2 = arrays[othIndex];
          if (othIndex && iteratee2) {
            array2 = arrayMap(array2, baseUnary(iteratee2));
          }
          maxLength = nativeMin$8(array2.length, maxLength);
          caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array2.length >= 120) ? new SetCache(othIndex && array2) : void 0;
        }
        array2 = arrays[0];
        var index = -1, seen = caches[0];
        outer:
          while (++index < length && result2.length < maxLength) {
            var value = array2[index], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
              othIndex = othLength;
              while (--othIndex) {
                var cache = caches[othIndex];
                if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                  continue outer;
                }
              }
              if (seen) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }
      var intersection = baseRest(function(arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      const intersection$1 = intersection;
      var intersectionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        if (iteratee2 === last(mapped)) {
          iteratee2 = void 0;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee2)) : [];
      });
      const intersectionBy$1 = intersectionBy;
      var intersectionWith = baseRest(function(arrays) {
        var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
        comparator = typeof comparator == "function" ? comparator : void 0;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, void 0, comparator) : [];
      });
      const intersectionWith$1 = intersectionWith;
      function baseInverter(object2, setter, iteratee2, accumulator) {
        baseForOwn(object2, function(value, key, object3) {
          setter(accumulator, iteratee2(value), key, object3);
        });
        return accumulator;
      }
      function createInverter(setter, toIteratee) {
        return function(object2, iteratee2) {
          return baseInverter(object2, setter, toIteratee(iteratee2), {});
        };
      }
      var objectProto$5 = Object.prototype;
      var nativeObjectToString$1 = objectProto$5.toString;
      var invert = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString$1.call(value);
        }
        result2[value] = key;
      }, constant(identity));
      const invert$1 = invert;
      var objectProto$4 = Object.prototype;
      var hasOwnProperty$5 = objectProto$4.hasOwnProperty;
      var nativeObjectToString = objectProto$4.toString;
      var invertBy = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString.call(value);
        }
        if (hasOwnProperty$5.call(result2, value)) {
          result2[value].push(key);
        } else {
          result2[value] = [key];
        }
      }, baseIteratee);
      const invertBy$1 = invertBy;
      function parent(object2, path) {
        return path.length < 2 ? object2 : baseGet(object2, baseSlice(path, 0, -1));
      }
      function baseInvoke(object2, path, args) {
        path = castPath(path, object2);
        object2 = parent(object2, path);
        var func2 = object2 == null ? object2 : object2[toKey(last(path))];
        return func2 == null ? void 0 : apply(func2, object2, args);
      }
      var invoke = baseRest(baseInvoke);
      const invoke$1 = invoke;
      var invokeMap = baseRest(function(collection2, path, args) {
        var index = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection2) ? Array(collection2.length) : [];
        baseEach(collection2, function(value) {
          result2[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
        });
        return result2;
      });
      const invokeMap$1 = invokeMap;
      var arrayBufferTag = "[object ArrayBuffer]";
      function baseIsArrayBuffer(value) {
        return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
      }
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
      var isArrayBuffer$2 = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
      const isArrayBuffer$3 = isArrayBuffer$2;
      var boolTag = "[object Boolean]";
      function isBoolean$1(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }
      var dateTag = "[object Date]";
      function baseIsDate(value) {
        return isObjectLike(value) && baseGetTag(value) == dateTag;
      }
      var nodeIsDate = nodeUtil && nodeUtil.isDate;
      var isDate$2 = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
      const isDate$3 = isDate$2;
      function isElement(value) {
        return isObjectLike(value) && value.nodeType === 1 && !isPlainObject$1(value);
      }
      var mapTag$2 = "[object Map]", setTag$2 = "[object Set]";
      var objectProto$3 = Object.prototype;
      var hasOwnProperty$4 = objectProto$3.hasOwnProperty;
      function isEmpty(value) {
        if (value == null) {
          return true;
        }
        if (isArrayLike(value) && (isArray$2(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer$2(value) || isTypedArray$2(value) || isArguments$1(value))) {
          return !value.length;
        }
        var tag = getTag$1(value);
        if (tag == mapTag$2 || tag == setTag$2) {
          return !value.size;
        }
        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }
        for (var key in value) {
          if (hasOwnProperty$4.call(value, key)) {
            return false;
          }
        }
        return true;
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == "function" ? customizer : void 0;
        var result2 = customizer ? customizer(value, other) : void 0;
        return result2 === void 0 ? baseIsEqual(value, other, void 0, customizer) : !!result2;
      }
      var nativeIsFinite = root.isFinite;
      function isFinite(value) {
        return typeof value == "number" && nativeIsFinite(value);
      }
      function isInteger(value) {
        return typeof value == "number" && value == toInteger(value);
      }
      function isMatch(object2, source) {
        return object2 === source || baseIsMatch(object2, source, getMatchData(source));
      }
      function isMatchWith(object2, source, customizer) {
        customizer = typeof customizer == "function" ? customizer : void 0;
        return baseIsMatch(object2, source, getMatchData(source), customizer);
      }
      var numberTag = "[object Number]";
      function isNumber$2(value) {
        return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
      }
      function isNaN(value) {
        return isNumber$2(value) && value != +value;
      }
      var isMaskable = coreJsData ? isFunction$2 : stubFalse;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error(CORE_ERROR_TEXT);
        }
        return baseIsNative(value);
      }
      function isNil(value) {
        return value == null;
      }
      function isNull(value) {
        return value === null;
      }
      var regexpTag = "[object RegExp]";
      function baseIsRegExp(value) {
        return isObjectLike(value) && baseGetTag(value) == regexpTag;
      }
      var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
      var isRegExp$1 = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
      const isRegExp$2 = isRegExp$1;
      var MAX_SAFE_INTEGER$3 = 9007199254740991;
      function isSafeInteger(value) {
        return isInteger(value) && value >= -MAX_SAFE_INTEGER$3 && value <= MAX_SAFE_INTEGER$3;
      }
      function isUndefined$2(value) {
        return value === void 0;
      }
      var weakMapTag = "[object WeakMap]";
      function isWeakMap(value) {
        return isObjectLike(value) && getTag$1(value) == weakMapTag;
      }
      var weakSetTag = "[object WeakSet]";
      function isWeakSet(value) {
        return isObjectLike(value) && baseGetTag(value) == weakSetTag;
      }
      var CLONE_DEEP_FLAG$3 = 1;
      function iteratee(func2) {
        return baseIteratee(typeof func2 == "function" ? func2 : baseClone(func2, CLONE_DEEP_FLAG$3));
      }
      var arrayProto$4 = Array.prototype;
      var nativeJoin = arrayProto$4.join;
      function join(array2, separator) {
        return array2 == null ? "" : nativeJoin.call(array2, separator);
      }
      var kebabCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? "-" : "") + word.toLowerCase();
      });
      const kebabCase$1 = kebabCase;
      var keyBy = createAggregator(function(result2, value, key) {
        baseAssignValue(result2, key, value);
      });
      const keyBy$1 = keyBy;
      function strictLastIndexOf(array2, value, fromIndex) {
        var index = fromIndex + 1;
        while (index--) {
          if (array2[index] === value) {
            return index;
          }
        }
        return index;
      }
      var nativeMax$5 = Math.max, nativeMin$7 = Math.min;
      function lastIndexOf(array2, value, fromIndex) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return -1;
        }
        var index = length;
        if (fromIndex !== void 0) {
          index = toInteger(fromIndex);
          index = index < 0 ? nativeMax$5(length + index, 0) : nativeMin$7(index, length - 1);
        }
        return value === value ? strictLastIndexOf(array2, value, index) : baseFindIndex(array2, baseIsNaN, index, true);
      }
      var lowerCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + word.toLowerCase();
      });
      const lowerCase$1 = lowerCase;
      var lowerFirst = createCaseFirst("toLowerCase");
      const lowerFirst$1 = lowerFirst;
      function baseLt(value, other) {
        return value < other;
      }
      var lt = createRelationalOperation(baseLt);
      const lt$1 = lt;
      var lte = createRelationalOperation(function(value, other) {
        return value <= other;
      });
      const lte$1 = lte;
      function mapKeys(object2, iteratee2) {
        var result2 = {};
        iteratee2 = baseIteratee(iteratee2);
        baseForOwn(object2, function(value, key, object3) {
          baseAssignValue(result2, iteratee2(value, key, object3), value);
        });
        return result2;
      }
      function mapValues(object2, iteratee2) {
        var result2 = {};
        iteratee2 = baseIteratee(iteratee2);
        baseForOwn(object2, function(value, key, object3) {
          baseAssignValue(result2, key, iteratee2(value, key, object3));
        });
        return result2;
      }
      var CLONE_DEEP_FLAG$2 = 1;
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG$2));
      }
      var CLONE_DEEP_FLAG$1 = 1;
      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG$1));
      }
      function baseExtremum(array2, iteratee2, comparator) {
        var index = -1, length = array2.length;
        while (++index < length) {
          var value = array2[index], current = iteratee2(value);
          if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current, result2 = value;
          }
        }
        return result2;
      }
      function max(array2) {
        return array2 && array2.length ? baseExtremum(array2, identity, baseGt) : void 0;
      }
      function maxBy(array2, iteratee2) {
        return array2 && array2.length ? baseExtremum(array2, baseIteratee(iteratee2), baseGt) : void 0;
      }
      function baseSum(array2, iteratee2) {
        var result2, index = -1, length = array2.length;
        while (++index < length) {
          var current = iteratee2(array2[index]);
          if (current !== void 0) {
            result2 = result2 === void 0 ? current : result2 + current;
          }
        }
        return result2;
      }
      var NAN = 0 / 0;
      function baseMean(array2, iteratee2) {
        var length = array2 == null ? 0 : array2.length;
        return length ? baseSum(array2, iteratee2) / length : NAN;
      }
      function mean(array2) {
        return baseMean(array2, identity);
      }
      function meanBy(array2, iteratee2) {
        return baseMean(array2, baseIteratee(iteratee2));
      }
      var merge$2 = createAssigner(function(object2, source, srcIndex) {
        baseMerge(object2, source, srcIndex);
      });
      const merge$3 = merge$2;
      var method = baseRest(function(path, args) {
        return function(object2) {
          return baseInvoke(object2, path, args);
        };
      });
      const method$1 = method;
      var methodOf = baseRest(function(object2, args) {
        return function(path) {
          return baseInvoke(object2, path, args);
        };
      });
      const methodOf$1 = methodOf;
      function min(array2) {
        return array2 && array2.length ? baseExtremum(array2, identity, baseLt) : void 0;
      }
      function minBy(array2, iteratee2) {
        return array2 && array2.length ? baseExtremum(array2, baseIteratee(iteratee2), baseLt) : void 0;
      }
      function mixin$1(object2, source, options) {
        var props = keys(source), methodNames = baseFunctions(source, props);
        var chain2 = !(isObject$2(options) && "chain" in options) || !!options.chain, isFunc = isFunction$2(object2);
        arrayEach(methodNames, function(methodName) {
          var func2 = source[methodName];
          object2[methodName] = func2;
          if (isFunc) {
            object2.prototype[methodName] = function() {
              var chainAll = this.__chain__;
              if (chain2 || chainAll) {
                var result2 = object2(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                actions.push({ "func": func2, "args": arguments, "thisArg": object2 });
                result2.__chain__ = chainAll;
                return result2;
              }
              return func2.apply(object2, arrayPush([this.value()], arguments));
            };
          }
        });
        return object2;
      }
      var multiply = createMathOperation(function(multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      const multiply$1 = multiply;
      var FUNC_ERROR_TEXT$3 = "Expected a function";
      function negate(predicate) {
        if (typeof predicate != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$3);
        }
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }
      function iteratorToArray(iterator) {
        var data, result2 = [];
        while (!(data = iterator.next()).done) {
          result2.push(data.value);
        }
        return result2;
      }
      var mapTag$1 = "[object Map]", setTag$1 = "[object Set]";
      var symIterator$1 = Symbol$1 ? Symbol$1.iterator : void 0;
      function toArray$1(value) {
        if (!value) {
          return [];
        }
        if (isArrayLike(value)) {
          return isString$2(value) ? stringToArray(value) : copyArray(value);
        }
        if (symIterator$1 && value[symIterator$1]) {
          return iteratorToArray(value[symIterator$1]());
        }
        var tag = getTag$1(value), func2 = tag == mapTag$1 ? mapToArray : tag == setTag$1 ? setToArray : values;
        return func2(value);
      }
      function wrapperNext() {
        if (this.__values__ === void 0) {
          this.__values__ = toArray$1(this.value());
        }
        var done = this.__index__ >= this.__values__.length, value = done ? void 0 : this.__values__[this.__index__++];
        return { "done": done, "value": value };
      }
      function baseNth(array2, n) {
        var length = array2.length;
        if (!length) {
          return;
        }
        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array2[n] : void 0;
      }
      function nth(array2, n) {
        return array2 && array2.length ? baseNth(array2, toInteger(n)) : void 0;
      }
      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function(args) {
          return baseNth(args, n);
        });
      }
      function baseUnset(object2, path) {
        path = castPath(path, object2);
        object2 = parent(object2, path);
        return object2 == null || delete object2[toKey(last(path))];
      }
      function customOmitClone(value) {
        return isPlainObject$1(value) ? void 0 : value;
      }
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var omit = flatRest(function(object2, paths) {
        var result2 = {};
        if (object2 == null) {
          return result2;
        }
        var isDeep = false;
        paths = arrayMap(paths, function(path) {
          path = castPath(path, object2);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object2, getAllKeysIn(object2), result2);
        if (isDeep) {
          result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result2, paths[length]);
        }
        return result2;
      });
      const omit$1 = omit;
      function baseSet(object2, path, value, customizer) {
        if (!isObject$2(object2)) {
          return object2;
        }
        path = castPath(path, object2);
        var index = -1, length = path.length, lastIndex = length - 1, nested = object2;
        while (nested != null && ++index < length) {
          var key = toKey(path[index]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object2;
          }
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : void 0;
            if (newValue === void 0) {
              newValue = isObject$2(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object2;
      }
      function basePickBy(object2, paths, predicate) {
        var index = -1, length = paths.length, result2 = {};
        while (++index < length) {
          var path = paths[index], value = baseGet(object2, path);
          if (predicate(value, path)) {
            baseSet(result2, castPath(path, object2), value);
          }
        }
        return result2;
      }
      function pickBy(object2, predicate) {
        if (object2 == null) {
          return {};
        }
        var props = arrayMap(getAllKeysIn(object2), function(prop) {
          return [prop];
        });
        predicate = baseIteratee(predicate);
        return basePickBy(object2, props, function(value, path) {
          return predicate(value, path[0]);
        });
      }
      function omitBy(object2, predicate) {
        return pickBy(object2, negate(baseIteratee(predicate)));
      }
      function once(func2) {
        return before(2, func2);
      }
      function baseSortBy(array2, comparer) {
        var length = array2.length;
        array2.sort(comparer);
        while (length--) {
          array2[length] = array2[length].value;
        }
        return array2;
      }
      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
          var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
          if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }
          if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
      function compareMultiple(object2, other, orders) {
        var index = -1, objCriteria = object2.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
        while (++index < length) {
          var result2 = compareAscending(objCriteria[index], othCriteria[index]);
          if (result2) {
            if (index >= ordersLength) {
              return result2;
            }
            var order = orders[index];
            return result2 * (order == "desc" ? -1 : 1);
          }
        }
        return object2.index - other.index;
      }
      function baseOrderBy(collection2, iteratees, orders) {
        if (iteratees.length) {
          iteratees = arrayMap(iteratees, function(iteratee2) {
            if (isArray$2(iteratee2)) {
              return function(value) {
                return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
              };
            }
            return iteratee2;
          });
        } else {
          iteratees = [identity];
        }
        var index = -1;
        iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
        var result2 = baseMap(collection2, function(value, key, collection3) {
          var criteria = arrayMap(iteratees, function(iteratee2) {
            return iteratee2(value);
          });
          return { "criteria": criteria, "index": ++index, "value": value };
        });
        return baseSortBy(result2, function(object2, other) {
          return compareMultiple(object2, other, orders);
        });
      }
      function orderBy(collection2, iteratees, orders, guard) {
        if (collection2 == null) {
          return [];
        }
        if (!isArray$2(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders = guard ? void 0 : orders;
        if (!isArray$2(orders)) {
          orders = orders == null ? [] : [orders];
        }
        return baseOrderBy(collection2, iteratees, orders);
      }
      function createOver(arrayFunc) {
        return flatRest(function(iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
          return baseRest(function(args) {
            var thisArg = this;
            return arrayFunc(iteratees, function(iteratee2) {
              return apply(iteratee2, thisArg, args);
            });
          });
        });
      }
      var over = createOver(arrayMap);
      const over$1 = over;
      var castRest = baseRest;
      var nativeMin$6 = Math.min;
      var overArgs = castRest(function(func2, transforms) {
        transforms = transforms.length == 1 && isArray$2(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));
        var funcsLength = transforms.length;
        return baseRest(function(args) {
          var index = -1, length = nativeMin$6(args.length, funcsLength);
          while (++index < length) {
            args[index] = transforms[index].call(this, args[index]);
          }
          return apply(func2, this, args);
        });
      });
      const overArgs$1 = overArgs;
      var overEvery = createOver(arrayEvery);
      const overEvery$1 = overEvery;
      var overSome = createOver(arraySome);
      const overSome$1 = overSome;
      var MAX_SAFE_INTEGER$2 = 9007199254740991;
      var nativeFloor$3 = Math.floor;
      function baseRepeat(string2, n) {
        var result2 = "";
        if (!string2 || n < 1 || n > MAX_SAFE_INTEGER$2) {
          return result2;
        }
        do {
          if (n % 2) {
            result2 += string2;
          }
          n = nativeFloor$3(n / 2);
          if (n) {
            string2 += string2;
          }
        } while (n);
        return result2;
      }
      var asciiSize = baseProperty("length");
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
      var rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
      var reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      function unicodeSize(string2) {
        var result2 = reUnicode.lastIndex = 0;
        while (reUnicode.test(string2)) {
          ++result2;
        }
        return result2;
      }
      function stringSize(string2) {
        return hasUnicode(string2) ? unicodeSize(string2) : asciiSize(string2);
      }
      var nativeCeil$2 = Math.ceil;
      function createPadding(length, chars) {
        chars = chars === void 0 ? " " : baseToString(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result2 = baseRepeat(chars, nativeCeil$2(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
      }
      var nativeCeil$1 = Math.ceil, nativeFloor$2 = Math.floor;
      function pad(string2, length, chars) {
        string2 = toString$2(string2);
        length = toInteger(length);
        var strLength = length ? stringSize(string2) : 0;
        if (!length || strLength >= length) {
          return string2;
        }
        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor$2(mid), chars) + string2 + createPadding(nativeCeil$1(mid), chars);
      }
      function padEnd(string2, length, chars) {
        string2 = toString$2(string2);
        length = toInteger(length);
        var strLength = length ? stringSize(string2) : 0;
        return length && strLength < length ? string2 + createPadding(length - strLength, chars) : string2;
      }
      function padStart(string2, length, chars) {
        string2 = toString$2(string2);
        length = toInteger(length);
        var strLength = length ? stringSize(string2) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string2 : string2;
      }
      var reTrimStart$1 = /^\s+/;
      var nativeParseInt = root.parseInt;
      function parseInt$1(string2, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(toString$2(string2).replace(reTrimStart$1, ""), radix || 0);
      }
      var WRAP_PARTIAL_FLAG = 32;
      var partial = baseRest(function(func2, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func2, WRAP_PARTIAL_FLAG, void 0, partials, holders);
      });
      partial.placeholder = {};
      const partial$1 = partial;
      var WRAP_PARTIAL_RIGHT_FLAG = 64;
      var partialRight = baseRest(function(func2, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func2, WRAP_PARTIAL_RIGHT_FLAG, void 0, partials, holders);
      });
      partialRight.placeholder = {};
      const partialRight$1 = partialRight;
      var partition = createAggregator(function(result2, value, key) {
        result2[key ? 0 : 1].push(value);
      }, function() {
        return [[], []];
      });
      const partition$1 = partition;
      function basePick(object2, paths) {
        return basePickBy(object2, paths, function(value, path) {
          return hasIn(object2, path);
        });
      }
      var pick = flatRest(function(object2, paths) {
        return object2 == null ? {} : basePick(object2, paths);
      });
      const pick$1 = pick;
      function wrapperPlant(value) {
        var result2, parent2 = this;
        while (parent2 instanceof baseLodash) {
          var clone2 = wrapperClone(parent2);
          clone2.__index__ = 0;
          clone2.__values__ = void 0;
          if (result2) {
            previous.__wrapped__ = clone2;
          } else {
            result2 = clone2;
          }
          var previous = clone2;
          parent2 = parent2.__wrapped__;
        }
        previous.__wrapped__ = value;
        return result2;
      }
      function propertyOf(object2) {
        return function(path) {
          return object2 == null ? void 0 : baseGet(object2, path);
        };
      }
      function baseIndexOfWith(array2, value, fromIndex, comparator) {
        var index = fromIndex - 1, length = array2.length;
        while (++index < length) {
          if (comparator(array2[index], value)) {
            return index;
          }
        }
        return -1;
      }
      var arrayProto$3 = Array.prototype;
      var splice$1 = arrayProto$3.splice;
      function basePullAll(array2, values2, iteratee2, comparator) {
        var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array2;
        if (array2 === values2) {
          values2 = copyArray(values2);
        }
        if (iteratee2) {
          seen = arrayMap(array2, baseUnary(iteratee2));
        }
        while (++index < length) {
          var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
          while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array2) {
              splice$1.call(seen, fromIndex, 1);
            }
            splice$1.call(array2, fromIndex, 1);
          }
        }
        return array2;
      }
      function pullAll(array2, values2) {
        return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2) : array2;
      }
      var pull = baseRest(pullAll);
      const pull$1 = pull;
      function pullAllBy(array2, values2, iteratee2) {
        return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2, baseIteratee(iteratee2)) : array2;
      }
      function pullAllWith(array2, values2, comparator) {
        return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2, void 0, comparator) : array2;
      }
      var arrayProto$2 = Array.prototype;
      var splice = arrayProto$2.splice;
      function basePullAt(array2, indexes) {
        var length = array2 ? indexes.length : 0, lastIndex = length - 1;
        while (length--) {
          var index = indexes[length];
          if (length == lastIndex || index !== previous) {
            var previous = index;
            if (isIndex(index)) {
              splice.call(array2, index, 1);
            } else {
              baseUnset(array2, index);
            }
          }
        }
        return array2;
      }
      var pullAt = flatRest(function(array2, indexes) {
        var length = array2 == null ? 0 : array2.length, result2 = baseAt(array2, indexes);
        basePullAt(array2, arrayMap(indexes, function(index) {
          return isIndex(index, length) ? +index : index;
        }).sort(compareAscending));
        return result2;
      });
      const pullAt$1 = pullAt;
      var nativeFloor$1 = Math.floor, nativeRandom$1 = Math.random;
      function baseRandom(lower, upper) {
        return lower + nativeFloor$1(nativeRandom$1() * (upper - lower + 1));
      }
      var freeParseFloat = parseFloat;
      var nativeMin$5 = Math.min, nativeRandom = Math.random;
      function random(lower, upper, floating) {
        if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
          upper = floating = void 0;
        }
        if (floating === void 0) {
          if (typeof upper == "boolean") {
            floating = upper;
            upper = void 0;
          } else if (typeof lower == "boolean") {
            floating = lower;
            lower = void 0;
          }
        }
        if (lower === void 0 && upper === void 0) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === void 0) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin$5(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
        }
        return baseRandom(lower, upper);
      }
      var nativeCeil = Math.ceil, nativeMax$4 = Math.max;
      function baseRange(start, end, step, fromRight) {
        var index = -1, length = nativeMax$4(nativeCeil((end - start) / (step || 1)), 0), result2 = Array(length);
        while (length--) {
          result2[fromRight ? length : ++index] = start;
          start += step;
        }
        return result2;
      }
      function createRange(fromRight) {
        return function(start, end, step) {
          if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
            end = step = void 0;
          }
          start = toFinite(start);
          if (end === void 0) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          step = step === void 0 ? start < end ? 1 : -1 : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }
      var range = createRange();
      const range$1 = range;
      var rangeRight = createRange(true);
      const rangeRight$1 = rangeRight;
      var WRAP_REARG_FLAG = 256;
      var rearg = flatRest(function(func2, indexes) {
        return createWrap(func2, WRAP_REARG_FLAG, void 0, void 0, void 0, indexes);
      });
      const rearg$1 = rearg;
      function baseReduce(collection2, iteratee2, accumulator, initAccum, eachFunc) {
        eachFunc(collection2, function(value, index, collection3) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee2(accumulator, value, index, collection3);
        });
        return accumulator;
      }
      function reduce(collection2, iteratee2, accumulator) {
        var func2 = isArray$2(collection2) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
        return func2(collection2, baseIteratee(iteratee2), accumulator, initAccum, baseEach);
      }
      function arrayReduceRight(array2, iteratee2, accumulator, initAccum) {
        var length = array2 == null ? 0 : array2.length;
        if (initAccum && length) {
          accumulator = array2[--length];
        }
        while (length--) {
          accumulator = iteratee2(accumulator, array2[length], length, array2);
        }
        return accumulator;
      }
      function reduceRight(collection2, iteratee2, accumulator) {
        var func2 = isArray$2(collection2) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
        return func2(collection2, baseIteratee(iteratee2), accumulator, initAccum, baseEachRight$1);
      }
      function reject(collection2, predicate) {
        var func2 = isArray$2(collection2) ? arrayFilter : baseFilter;
        return func2(collection2, negate(baseIteratee(predicate)));
      }
      function remove(array2, predicate) {
        var result2 = [];
        if (!(array2 && array2.length)) {
          return result2;
        }
        var index = -1, indexes = [], length = array2.length;
        predicate = baseIteratee(predicate);
        while (++index < length) {
          var value = array2[index];
          if (predicate(value, index, array2)) {
            result2.push(value);
            indexes.push(index);
          }
        }
        basePullAt(array2, indexes);
        return result2;
      }
      function repeat(string2, n, guard) {
        if (guard ? isIterateeCall(string2, n, guard) : n === void 0) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        return baseRepeat(toString$2(string2), n);
      }
      function replace() {
        var args = arguments, string2 = toString$2(args[0]);
        return args.length < 3 ? string2 : string2.replace(args[1], args[2]);
      }
      var FUNC_ERROR_TEXT$2 = "Expected a function";
      function rest(func2, start) {
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$2);
        }
        start = start === void 0 ? start : toInteger(start);
        return baseRest(func2, start);
      }
      function result(object2, path, defaultValue) {
        path = castPath(path, object2);
        var index = -1, length = path.length;
        if (!length) {
          length = 1;
          object2 = void 0;
        }
        while (++index < length) {
          var value = object2 == null ? void 0 : object2[toKey(path[index])];
          if (value === void 0) {
            index = length;
            value = defaultValue;
          }
          object2 = isFunction$2(value) ? value.call(object2) : value;
        }
        return object2;
      }
      var arrayProto$1 = Array.prototype;
      var nativeReverse = arrayProto$1.reverse;
      function reverse(array2) {
        return array2 == null ? array2 : nativeReverse.call(array2);
      }
      var round = createRound("round");
      const round$1 = round;
      function arraySample(array2) {
        var length = array2.length;
        return length ? array2[baseRandom(0, length - 1)] : void 0;
      }
      function baseSample(collection2) {
        return arraySample(values(collection2));
      }
      function sample(collection2) {
        var func2 = isArray$2(collection2) ? arraySample : baseSample;
        return func2(collection2);
      }
      function shuffleSelf(array2, size2) {
        var index = -1, length = array2.length, lastIndex = length - 1;
        size2 = size2 === void 0 ? length : size2;
        while (++index < size2) {
          var rand = baseRandom(index, lastIndex), value = array2[rand];
          array2[rand] = array2[index];
          array2[index] = value;
        }
        array2.length = size2;
        return array2;
      }
      function arraySampleSize(array2, n) {
        return shuffleSelf(copyArray(array2), baseClamp(n, 0, array2.length));
      }
      function baseSampleSize(collection2, n) {
        var array2 = values(collection2);
        return shuffleSelf(array2, baseClamp(n, 0, array2.length));
      }
      function sampleSize(collection2, n, guard) {
        if (guard ? isIterateeCall(collection2, n, guard) : n === void 0) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        var func2 = isArray$2(collection2) ? arraySampleSize : baseSampleSize;
        return func2(collection2, n);
      }
      function set(object2, path, value) {
        return object2 == null ? object2 : baseSet(object2, path, value);
      }
      function setWith(object2, path, value, customizer) {
        customizer = typeof customizer == "function" ? customizer : void 0;
        return object2 == null ? object2 : baseSet(object2, path, value, customizer);
      }
      function arrayShuffle(array2) {
        return shuffleSelf(copyArray(array2));
      }
      function baseShuffle(collection2) {
        return shuffleSelf(values(collection2));
      }
      function shuffle(collection2) {
        var func2 = isArray$2(collection2) ? arrayShuffle : baseShuffle;
        return func2(collection2);
      }
      var mapTag = "[object Map]", setTag = "[object Set]";
      function size(collection2) {
        if (collection2 == null) {
          return 0;
        }
        if (isArrayLike(collection2)) {
          return isString$2(collection2) ? stringSize(collection2) : collection2.length;
        }
        var tag = getTag$1(collection2);
        if (tag == mapTag || tag == setTag) {
          return collection2.size;
        }
        return baseKeys(collection2).length;
      }
      function slice(array2, start, end) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return [];
        }
        if (end && typeof end != "number" && isIterateeCall(array2, start, end)) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === void 0 ? length : toInteger(end);
        }
        return baseSlice(array2, start, end);
      }
      var snakeCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? "_" : "") + word.toLowerCase();
      });
      const snakeCase$1 = snakeCase;
      function baseSome(collection2, predicate) {
        var result2;
        baseEach(collection2, function(value, index, collection3) {
          result2 = predicate(value, index, collection3);
          return !result2;
        });
        return !!result2;
      }
      function some(collection2, predicate, guard) {
        var func2 = isArray$2(collection2) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection2, predicate, guard)) {
          predicate = void 0;
        }
        return func2(collection2, baseIteratee(predicate));
      }
      var sortBy = baseRest(function(collection2, iteratees) {
        if (collection2 == null) {
          return [];
        }
        var length = iteratees.length;
        if (length > 1 && isIterateeCall(collection2, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection2, baseFlatten(iteratees, 1), []);
      });
      const sortBy$1 = sortBy;
      var MAX_ARRAY_LENGTH$4 = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH$4 - 1;
      var nativeFloor = Math.floor, nativeMin$4 = Math.min;
      function baseSortedIndexBy(array2, value, iteratee2, retHighest) {
        var low = 0, high = array2 == null ? 0 : array2.length;
        if (high === 0) {
          return 0;
        }
        value = iteratee2(value);
        var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === void 0;
        while (low < high) {
          var mid = nativeFloor((low + high) / 2), computed = iteratee2(array2[mid]), othIsDefined = computed !== void 0, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin$4(high, MAX_ARRAY_INDEX);
      }
      var MAX_ARRAY_LENGTH$3 = 4294967295, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH$3 >>> 1;
      function baseSortedIndex(array2, value, retHighest) {
        var low = 0, high = array2 == null ? low : array2.length;
        if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1, computed = array2[mid];
            if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array2, value, identity, retHighest);
      }
      function sortedIndex(array2, value) {
        return baseSortedIndex(array2, value);
      }
      function sortedIndexBy(array2, value, iteratee2) {
        return baseSortedIndexBy(array2, value, baseIteratee(iteratee2));
      }
      function sortedIndexOf(array2, value) {
        var length = array2 == null ? 0 : array2.length;
        if (length) {
          var index = baseSortedIndex(array2, value);
          if (index < length && eq(array2[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function sortedLastIndex(array2, value) {
        return baseSortedIndex(array2, value, true);
      }
      function sortedLastIndexBy(array2, value, iteratee2) {
        return baseSortedIndexBy(array2, value, baseIteratee(iteratee2), true);
      }
      function sortedLastIndexOf(array2, value) {
        var length = array2 == null ? 0 : array2.length;
        if (length) {
          var index = baseSortedIndex(array2, value, true) - 1;
          if (eq(array2[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function baseSortedUniq(array2, iteratee2) {
        var index = -1, length = array2.length, resIndex = 0, result2 = [];
        while (++index < length) {
          var value = array2[index], computed = iteratee2 ? iteratee2(value) : value;
          if (!index || !eq(computed, seen)) {
            var seen = computed;
            result2[resIndex++] = value === 0 ? 0 : value;
          }
        }
        return result2;
      }
      function sortedUniq(array2) {
        return array2 && array2.length ? baseSortedUniq(array2) : [];
      }
      function sortedUniqBy(array2, iteratee2) {
        return array2 && array2.length ? baseSortedUniq(array2, baseIteratee(iteratee2)) : [];
      }
      var MAX_ARRAY_LENGTH$2 = 4294967295;
      function split(string2, separator, limit) {
        if (limit && typeof limit != "number" && isIterateeCall(string2, separator, limit)) {
          separator = limit = void 0;
        }
        limit = limit === void 0 ? MAX_ARRAY_LENGTH$2 : limit >>> 0;
        if (!limit) {
          return [];
        }
        string2 = toString$2(string2);
        if (string2 && (typeof separator == "string" || separator != null && !isRegExp$2(separator))) {
          separator = baseToString(separator);
          if (!separator && hasUnicode(string2)) {
            return castSlice(stringToArray(string2), 0, limit);
          }
        }
        return string2.split(separator, limit);
      }
      var FUNC_ERROR_TEXT$1 = "Expected a function";
      var nativeMax$3 = Math.max;
      function spread$1(func2, start) {
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$1);
        }
        start = start == null ? 0 : nativeMax$3(toInteger(start), 0);
        return baseRest(function(args) {
          var array2 = args[start], otherArgs = castSlice(args, 0, start);
          if (array2) {
            arrayPush(otherArgs, array2);
          }
          return apply(func2, this, otherArgs);
        });
      }
      var startCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + upperFirst$1(word);
      });
      const startCase$1 = startCase;
      function startsWith(string2, target, position) {
        string2 = toString$2(string2);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string2.length);
        target = baseToString(target);
        return string2.slice(position, position + target.length) == target;
      }
      function stubObject() {
        return {};
      }
      function stubString() {
        return "";
      }
      function stubTrue() {
        return true;
      }
      var subtract = createMathOperation(function(minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);
      const subtract$1 = subtract;
      function sum(array2) {
        return array2 && array2.length ? baseSum(array2, identity) : 0;
      }
      function sumBy(array2, iteratee2) {
        return array2 && array2.length ? baseSum(array2, baseIteratee(iteratee2)) : 0;
      }
      function tail(array2) {
        var length = array2 == null ? 0 : array2.length;
        return length ? baseSlice(array2, 1, length) : [];
      }
      function take(array2, n, guard) {
        if (!(array2 && array2.length)) {
          return [];
        }
        n = guard || n === void 0 ? 1 : toInteger(n);
        return baseSlice(array2, 0, n < 0 ? 0 : n);
      }
      function takeRight(array2, n, guard) {
        var length = array2 == null ? 0 : array2.length;
        if (!length) {
          return [];
        }
        n = guard || n === void 0 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array2, n < 0 ? 0 : n, length);
      }
      function takeRightWhile(array2, predicate) {
        return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate), false, true) : [];
      }
      function takeWhile(array2, predicate) {
        return array2 && array2.length ? baseWhile(array2, baseIteratee(predicate)) : [];
      }
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$3 = objectProto$2.hasOwnProperty;
      function customDefaultsAssignIn(objValue, srcValue, key, object2) {
        if (objValue === void 0 || eq(objValue, objectProto$2[key]) && !hasOwnProperty$3.call(object2, key)) {
          return srcValue;
        }
        return objValue;
      }
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }
      var reInterpolate = /<%=([\s\S]+?)%>/g;
      const reInterpolate$1 = reInterpolate;
      var reEscape = /<%-([\s\S]+?)%>/g;
      const reEscape$1 = reEscape;
      var reEvaluate = /<%([\s\S]+?)%>/g;
      const reEvaluate$1 = reEvaluate;
      var templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        "escape": reEscape$1,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        "evaluate": reEvaluate$1,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        "interpolate": reInterpolate$1,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        "variable": "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        "imports": {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          "_": { "escape": escape }
        }
      };
      const templateSettings$1 = templateSettings;
      var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var objectProto$1 = Object.prototype;
      var hasOwnProperty$2 = objectProto$1.hasOwnProperty;
      function template(string2, options, guard) {
        var settings = templateSettings$1.imports._.templateSettings || templateSettings$1;
        if (guard && isIterateeCall(string2, options, guard)) {
          options = void 0;
        }
        string2 = toString$2(string2);
        options = extendWith({}, options, settings, customDefaultsAssignIn);
        var imports = extendWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
        var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
        var reDelimiters = RegExp(
          (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate$1 ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
          "g"
        );
        var sourceURL = hasOwnProperty$2.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
        string2.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string2.slice(index, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }
          index = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = hasOwnProperty$2.call(options, "variable") && options.variable;
        if (!variable) {
          source = "with (obj) {\n" + source + "\n}\n";
        } else if (reForbiddenIdentifierChars.test(variable)) {
          throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
        source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
        var result2 = attempt$1(function() {
          return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
        });
        result2.source = source;
        if (isError(result2)) {
          throw result2;
        }
        return result2;
      }
      var FUNC_ERROR_TEXT = "Expected a function";
      function throttle(func2, wait, options) {
        var leading = true, trailing = true;
        if (typeof func2 != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (isObject$2(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce(func2, wait, {
          "leading": leading,
          "maxWait": wait,
          "trailing": trailing
        });
      }
      function thru(value, interceptor) {
        return interceptor(value);
      }
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var MAX_ARRAY_LENGTH$1 = 4294967295;
      var nativeMin$3 = Math.min;
      function times(n, iteratee2) {
        n = toInteger(n);
        if (n < 1 || n > MAX_SAFE_INTEGER$1) {
          return [];
        }
        var index = MAX_ARRAY_LENGTH$1, length = nativeMin$3(n, MAX_ARRAY_LENGTH$1);
        iteratee2 = castFunction(iteratee2);
        n -= MAX_ARRAY_LENGTH$1;
        var result2 = baseTimes(length, iteratee2);
        while (++index < n) {
          iteratee2(index);
        }
        return result2;
      }
      function wrapperToIterator() {
        return this;
      }
      function baseWrapperValue(value, actions) {
        var result2 = value;
        if (result2 instanceof LazyWrapper) {
          result2 = result2.value();
        }
        return arrayReduce(actions, function(result3, action) {
          return action.func.apply(action.thisArg, arrayPush([result3], action.args));
        }, result2);
      }
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }
      function toLower(value) {
        return toString$2(value).toLowerCase();
      }
      function toPath(value) {
        if (isArray$2(value)) {
          return arrayMap(value, toKey);
        }
        return isSymbol(value) ? [value] : copyArray(stringToPath(toString$2(value)));
      }
      var MAX_SAFE_INTEGER = 9007199254740991;
      function toSafeInteger(value) {
        return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
      }
      function toUpper(value) {
        return toString$2(value).toUpperCase();
      }
      function transform(object2, iteratee2, accumulator) {
        var isArr = isArray$2(object2), isArrLike = isArr || isBuffer$2(object2) || isTypedArray$2(object2);
        iteratee2 = baseIteratee(iteratee2);
        if (accumulator == null) {
          var Ctor = object2 && object2.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject$2(object2)) {
            accumulator = isFunction$2(Ctor) ? baseCreate(getPrototype(object2)) : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object2, function(value, index, object3) {
          return iteratee2(accumulator, value, index, object3);
        });
        return accumulator;
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;
        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1, length = strSymbols.length;
        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function trim$2(string2, chars, guard) {
        string2 = toString$2(string2);
        if (string2 && (guard || chars === void 0)) {
          return baseTrim(string2);
        }
        if (!string2 || !(chars = baseToString(chars))) {
          return string2;
        }
        var strSymbols = stringToArray(string2), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join("");
      }
      function trimEnd(string2, chars, guard) {
        string2 = toString$2(string2);
        if (string2 && (guard || chars === void 0)) {
          return string2.slice(0, trimmedEndIndex(string2) + 1);
        }
        if (!string2 || !(chars = baseToString(chars))) {
          return string2;
        }
        var strSymbols = stringToArray(string2), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join("");
      }
      var reTrimStart = /^\s+/;
      function trimStart(string2, chars, guard) {
        string2 = toString$2(string2);
        if (string2 && (guard || chars === void 0)) {
          return string2.replace(reTrimStart, "");
        }
        if (!string2 || !(chars = baseToString(chars))) {
          return string2;
        }
        var strSymbols = stringToArray(string2), start = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start).join("");
      }
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var reFlags = /\w*$/;
      function truncate(string2, options) {
        var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
        if (isObject$2(options)) {
          var separator = "separator" in options ? options.separator : separator;
          length = "length" in options ? toInteger(options.length) : length;
          omission = "omission" in options ? baseToString(options.omission) : omission;
        }
        string2 = toString$2(string2);
        var strLength = string2.length;
        if (hasUnicode(string2)) {
          var strSymbols = stringToArray(string2);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string2;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string2.slice(0, end);
        if (separator === void 0) {
          return result2 + omission;
        }
        if (strSymbols) {
          end += result2.length - end;
        }
        if (isRegExp$2(separator)) {
          if (string2.slice(end).search(separator)) {
            var match, substring = result2;
            if (!separator.global) {
              separator = RegExp(separator.source, toString$2(reFlags.exec(separator)) + "g");
            }
            separator.lastIndex = 0;
            while (match = separator.exec(substring)) {
              var newEnd = match.index;
            }
            result2 = result2.slice(0, newEnd === void 0 ? end : newEnd);
          }
        } else if (string2.indexOf(baseToString(separator), end) != end) {
          var index = result2.lastIndexOf(separator);
          if (index > -1) {
            result2 = result2.slice(0, index);
          }
        }
        return result2 + omission;
      }
      function unary(func2) {
        return ary(func2, 1);
      }
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      const unescapeHtmlChar$1 = unescapeHtmlChar;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reHasEscapedHtml = RegExp(reEscapedHtml.source);
      function unescape$1(string2) {
        string2 = toString$2(string2);
        return string2 && reHasEscapedHtml.test(string2) ? string2.replace(reEscapedHtml, unescapeHtmlChar$1) : string2;
      }
      var INFINITY = 1 / 0;
      var createSet = !(Set$1 && 1 / setToArray(new Set$1([, -0]))[1] == INFINITY) ? noop$1 : function(values2) {
        return new Set$1(values2);
      };
      var LARGE_ARRAY_SIZE = 200;
      function baseUniq(array2, iteratee2, comparator) {
        var index = -1, includes2 = arrayIncludes, length = array2.length, isCommon = true, result2 = [], seen = result2;
        if (comparator) {
          isCommon = false;
          includes2 = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set2 = iteratee2 ? null : createSet(array2);
          if (set2) {
            return setToArray(set2);
          }
          isCommon = false;
          includes2 = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee2 ? [] : result2;
        }
        outer:
          while (++index < length) {
            var value = array2[index], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var seenIndex = seen.length;
              while (seenIndex--) {
                if (seen[seenIndex] === computed) {
                  continue outer;
                }
              }
              if (iteratee2) {
                seen.push(computed);
              }
              result2.push(value);
            } else if (!includes2(seen, computed, comparator)) {
              if (seen !== result2) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      var union = baseRest(function(arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      const union$1 = union;
      var unionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = void 0;
        }
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee2));
      });
      const unionBy$1 = unionBy;
      var unionWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : void 0;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), void 0, comparator);
      });
      const unionWith$1 = unionWith;
      function uniq(array2) {
        return array2 && array2.length ? baseUniq(array2) : [];
      }
      function uniqBy(array2, iteratee2) {
        return array2 && array2.length ? baseUniq(array2, baseIteratee(iteratee2)) : [];
      }
      function uniqWith(array2, comparator) {
        comparator = typeof comparator == "function" ? comparator : void 0;
        return array2 && array2.length ? baseUniq(array2, void 0, comparator) : [];
      }
      var idCounter = 0;
      function uniqueId(prefix) {
        var id = ++idCounter;
        return toString$2(prefix) + id;
      }
      function unset(object2, path) {
        return object2 == null ? true : baseUnset(object2, path);
      }
      var nativeMax$2 = Math.max;
      function unzip(array2) {
        if (!(array2 && array2.length)) {
          return [];
        }
        var length = 0;
        array2 = arrayFilter(array2, function(group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax$2(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function(index) {
          return arrayMap(array2, baseProperty(index));
        });
      }
      function unzipWith(array2, iteratee2) {
        if (!(array2 && array2.length)) {
          return [];
        }
        var result2 = unzip(array2);
        if (iteratee2 == null) {
          return result2;
        }
        return arrayMap(result2, function(group) {
          return apply(iteratee2, void 0, group);
        });
      }
      function baseUpdate(object2, path, updater, customizer) {
        return baseSet(object2, path, updater(baseGet(object2, path)), customizer);
      }
      function update(object2, path, updater) {
        return object2 == null ? object2 : baseUpdate(object2, path, castFunction(updater));
      }
      function updateWith(object2, path, updater, customizer) {
        customizer = typeof customizer == "function" ? customizer : void 0;
        return object2 == null ? object2 : baseUpdate(object2, path, castFunction(updater), customizer);
      }
      var upperCase = createCompounder(function(result2, word, index) {
        return result2 + (index ? " " : "") + word.toUpperCase();
      });
      const upperCase$1 = upperCase;
      function valuesIn(object2) {
        return object2 == null ? [] : baseValues(object2, keysIn(object2));
      }
      var without = baseRest(function(array2, values2) {
        return isArrayLikeObject(array2) ? baseDifference(array2, values2) : [];
      });
      const without$1 = without;
      function wrap(value, wrapper) {
        return partial$1(castFunction(wrapper), value);
      }
      var wrapperAt = flatRest(function(paths) {
        var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object2) {
          return baseAt(object2, paths);
        };
        if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
          return this.thru(interceptor);
        }
        value = value.slice(start, +start + (length ? 1 : 0));
        value.__actions__.push({
          "func": thru,
          "args": [interceptor],
          "thisArg": void 0
        });
        return new LodashWrapper(value, this.__chain__).thru(function(array2) {
          if (length && !array2.length) {
            array2.push(void 0);
          }
          return array2;
        });
      });
      const at = wrapperAt;
      function wrapperChain() {
        return chain(this);
      }
      function wrapperReverse() {
        var value = this.__wrapped__;
        if (value instanceof LazyWrapper) {
          var wrapped = value;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            "func": thru,
            "args": [reverse],
            "thisArg": void 0
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }
      function baseXor(arrays, iteratee2, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index = -1, result2 = Array(length);
        while (++index < length) {
          var array2 = arrays[index], othIndex = -1;
          while (++othIndex < length) {
            if (othIndex != index) {
              result2[index] = baseDifference(result2[index] || array2, arrays[othIndex], iteratee2, comparator);
            }
          }
        }
        return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
      }
      var xor = baseRest(function(arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      const xor$1 = xor;
      var xorBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = void 0;
        }
        return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee2));
      });
      const xorBy$1 = xorBy;
      var xorWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : void 0;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), void 0, comparator);
      });
      const xorWith$1 = xorWith;
      var zip = baseRest(unzip);
      const zip$1 = zip;
      function baseZipObject(props, values2, assignFunc) {
        var index = -1, length = props.length, valsLength = values2.length, result2 = {};
        while (++index < length) {
          var value = index < valsLength ? values2[index] : void 0;
          assignFunc(result2, props[index], value);
        }
        return result2;
      }
      function zipObject(props, values2) {
        return baseZipObject(props || [], values2 || [], assignValue);
      }
      function zipObjectDeep(props, values2) {
        return baseZipObject(props || [], values2 || [], baseSet);
      }
      var zipWith = baseRest(function(arrays) {
        var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : void 0;
        iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : void 0;
        return unzipWith(arrays, iteratee2);
      });
      const zipWith$1 = zipWith;
      const array = {
        chunk,
        compact,
        concat,
        difference: difference$1,
        differenceBy: differenceBy$1,
        differenceWith: differenceWith$1,
        drop,
        dropRight,
        dropRightWhile,
        dropWhile,
        fill,
        findIndex,
        findLastIndex,
        first: head,
        flatten,
        flattenDeep,
        flattenDepth,
        fromPairs,
        head,
        indexOf,
        initial,
        intersection: intersection$1,
        intersectionBy: intersectionBy$1,
        intersectionWith: intersectionWith$1,
        join,
        last,
        lastIndexOf,
        nth,
        pull: pull$1,
        pullAll,
        pullAllBy,
        pullAllWith,
        pullAt: pullAt$1,
        remove,
        reverse,
        slice,
        sortedIndex,
        sortedIndexBy,
        sortedIndexOf,
        sortedLastIndex,
        sortedLastIndexBy,
        sortedLastIndexOf,
        sortedUniq,
        sortedUniqBy,
        tail,
        take,
        takeRight,
        takeRightWhile,
        takeWhile,
        union: union$1,
        unionBy: unionBy$1,
        unionWith: unionWith$1,
        uniq,
        uniqBy,
        uniqWith,
        unzip,
        unzipWith,
        without: without$1,
        xor: xor$1,
        xorBy: xorBy$1,
        xorWith: xorWith$1,
        zip: zip$1,
        zipObject,
        zipObjectDeep,
        zipWith: zipWith$1
      };
      const collection = {
        countBy: countBy$1,
        each: forEach$2,
        eachRight: forEachRight,
        every,
        filter,
        find: find$1,
        findLast: findLast$1,
        flatMap,
        flatMapDeep,
        flatMapDepth,
        forEach: forEach$2,
        forEachRight,
        groupBy: groupBy$1,
        includes,
        invokeMap: invokeMap$1,
        keyBy: keyBy$1,
        map,
        orderBy,
        partition: partition$1,
        reduce,
        reduceRight,
        reject,
        sample,
        sampleSize,
        shuffle,
        size,
        some,
        sortBy: sortBy$1
      };
      const date = {
        now: now$1
      };
      const func = {
        after,
        ary,
        before,
        bind: bind$4,
        bindKey: bindKey$1,
        curry,
        curryRight,
        debounce,
        defer: defer$1,
        delay: delay$1,
        flip,
        memoize,
        negate,
        once,
        overArgs: overArgs$1,
        partial: partial$1,
        partialRight: partialRight$1,
        rearg: rearg$1,
        rest,
        spread: spread$1,
        throttle,
        unary,
        wrap
      };
      const lang = {
        castArray,
        clone,
        cloneDeep,
        cloneDeepWith,
        cloneWith,
        conformsTo,
        eq,
        gt: gt$1,
        gte: gte$1,
        isArguments: isArguments$1,
        isArray: isArray$2,
        isArrayBuffer: isArrayBuffer$3,
        isArrayLike,
        isArrayLikeObject,
        isBoolean: isBoolean$1,
        isBuffer: isBuffer$2,
        isDate: isDate$3,
        isElement,
        isEmpty,
        isEqual,
        isEqualWith,
        isError,
        isFinite,
        isFunction: isFunction$2,
        isInteger,
        isLength,
        isMap: isMap$1,
        isMatch,
        isMatchWith,
        isNaN,
        isNative,
        isNil,
        isNull,
        isNumber: isNumber$2,
        isObject: isObject$2,
        isObjectLike,
        isPlainObject: isPlainObject$1,
        isRegExp: isRegExp$2,
        isSafeInteger,
        isSet: isSet$1,
        isString: isString$2,
        isSymbol,
        isTypedArray: isTypedArray$2,
        isUndefined: isUndefined$2,
        isWeakMap,
        isWeakSet,
        lt: lt$1,
        lte: lte$1,
        toArray: toArray$1,
        toFinite,
        toInteger,
        toLength,
        toNumber,
        toPlainObject,
        toSafeInteger,
        toString: toString$2
      };
      const math = {
        add: add$1,
        ceil: ceil$1,
        divide: divide$1,
        floor: floor$1,
        max,
        maxBy,
        mean,
        meanBy,
        min,
        minBy,
        multiply: multiply$1,
        round: round$1,
        subtract: subtract$1,
        sum,
        sumBy
      };
      const number = {
        clamp,
        inRange,
        random
      };
      const object = {
        assign: assign$1,
        assignIn: extend$2,
        assignInWith: extendWith,
        assignWith: assignWith$1,
        at: at$2,
        create,
        defaults: defaults$3,
        defaultsDeep: defaultsDeep$1,
        entries: toPairs$1,
        entriesIn: toPairsIn$1,
        extend: extend$2,
        extendWith,
        findKey: findKey$1,
        findLastKey,
        forIn,
        forInRight,
        forOwn,
        forOwnRight,
        functions,
        functionsIn,
        get,
        has,
        hasIn,
        invert: invert$1,
        invertBy: invertBy$1,
        invoke: invoke$1,
        keys,
        keysIn,
        mapKeys,
        mapValues,
        merge: merge$3,
        mergeWith: mergeWith$1,
        omit: omit$1,
        omitBy,
        pick: pick$1,
        pickBy,
        result,
        set,
        setWith,
        toPairs: toPairs$1,
        toPairsIn: toPairsIn$1,
        transform,
        unset,
        update,
        updateWith,
        values,
        valuesIn
      };
      const seq = {
        at,
        chain,
        commit: wrapperCommit,
        lodash,
        next: wrapperNext,
        plant: wrapperPlant,
        reverse: wrapperReverse,
        tap,
        thru,
        toIterator: wrapperToIterator,
        toJSON: wrapperValue,
        value: wrapperValue,
        valueOf: wrapperValue,
        wrapperChain
      };
      const string = {
        camelCase: camelCase$1,
        capitalize,
        deburr,
        endsWith: endsWith$1,
        escape,
        escapeRegExp,
        kebabCase: kebabCase$1,
        lowerCase: lowerCase$1,
        lowerFirst: lowerFirst$1,
        pad,
        padEnd,
        padStart,
        parseInt: parseInt$1,
        repeat,
        replace,
        snakeCase: snakeCase$1,
        split,
        startCase: startCase$1,
        startsWith,
        template,
        templateSettings: templateSettings$1,
        toLower,
        toUpper,
        trim: trim$2,
        trimEnd,
        trimStart,
        truncate,
        unescape: unescape$1,
        upperCase: upperCase$1,
        upperFirst: upperFirst$1,
        words
      };
      const util = {
        attempt: attempt$1,
        bindAll: bindAll$1,
        cond,
        conforms,
        constant,
        defaultTo,
        flow: flow$1,
        flowRight: flowRight$1,
        identity,
        iteratee,
        matches,
        matchesProperty,
        method: method$1,
        methodOf: methodOf$1,
        mixin: mixin$1,
        noop: noop$1,
        nthArg,
        over: over$1,
        overEvery: overEvery$1,
        overSome: overSome$1,
        property,
        propertyOf,
        range: range$1,
        rangeRight: rangeRight$1,
        stubArray,
        stubFalse,
        stubObject,
        stubString,
        stubTrue,
        times,
        toPath,
        uniqueId
      };
      function lazyClone() {
        var result2 = new LazyWrapper(this.__wrapped__);
        result2.__actions__ = copyArray(this.__actions__);
        result2.__dir__ = this.__dir__;
        result2.__filtered__ = this.__filtered__;
        result2.__iteratees__ = copyArray(this.__iteratees__);
        result2.__takeCount__ = this.__takeCount__;
        result2.__views__ = copyArray(this.__views__);
        return result2;
      }
      function lazyReverse() {
        if (this.__filtered__) {
          var result2 = new LazyWrapper(this);
          result2.__dir__ = -1;
          result2.__filtered__ = true;
        } else {
          result2 = this.clone();
          result2.__dir__ *= -1;
        }
        return result2;
      }
      var nativeMax$1 = Math.max, nativeMin$2 = Math.min;
      function getView(start, end, transforms) {
        var index = -1, length = transforms.length;
        while (++index < length) {
          var data = transforms[index], size2 = data.size;
          switch (data.type) {
            case "drop":
              start += size2;
              break;
            case "dropRight":
              end -= size2;
              break;
            case "take":
              end = nativeMin$2(end, start + size2);
              break;
            case "takeRight":
              start = nativeMax$1(start, end - size2);
              break;
          }
        }
        return { "start": start, "end": end };
      }
      var LAZY_FILTER_FLAG$1 = 1, LAZY_MAP_FLAG = 2;
      var nativeMin$1 = Math.min;
      function lazyValue() {
        var array2 = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray$2(array2), isRight = dir < 0, arrLength = isArr ? array2.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin$1(length, this.__takeCount__);
        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array2, this.__actions__);
        }
        var result2 = [];
        outer:
          while (length-- && resIndex < takeCount) {
            index += dir;
            var iterIndex = -1, value = array2[index];
            while (++iterIndex < iterLength) {
              var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
              if (type == LAZY_MAP_FLAG) {
                value = computed;
              } else if (!computed) {
                if (type == LAZY_FILTER_FLAG$1) {
                  continue outer;
                } else {
                  break outer;
                }
              }
            }
            result2[resIndex++] = value;
          }
        return result2;
      }
      /**
       * @license
       * Lodash (Custom Build) <https://lodash.com/>
       * Build: `lodash modularize exports="es" -o ./`
       * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
       * Released under MIT license <https://lodash.com/license>
       * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
       * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
       */
      var VERSION$1 = "4.17.21";
      var WRAP_BIND_KEY_FLAG = 2;
      var LAZY_FILTER_FLAG = 1, LAZY_WHILE_FLAG = 3;
      var MAX_ARRAY_LENGTH = 4294967295;
      var arrayProto = Array.prototype, objectProto = Object.prototype;
      var hasOwnProperty$1 = objectProto.hasOwnProperty;
      var symIterator = Symbol$1 ? Symbol$1.iterator : void 0;
      var nativeMax = Math.max, nativeMin = Math.min;
      var mixin = /* @__PURE__ */ function(func2) {
        return function(object2, source, options) {
          if (options == null) {
            var isObj = isObject$2(source), props = isObj && keys(source), methodNames = props && props.length && baseFunctions(source, props);
            if (!(methodNames ? methodNames.length : isObj)) {
              options = source;
              source = object2;
              object2 = this;
            }
          }
          return func2(object2, source, options);
        };
      }(mixin$1);
      lodash.after = func.after;
      lodash.ary = func.ary;
      lodash.assign = object.assign;
      lodash.assignIn = object.assignIn;
      lodash.assignInWith = object.assignInWith;
      lodash.assignWith = object.assignWith;
      lodash.at = object.at;
      lodash.before = func.before;
      lodash.bind = func.bind;
      lodash.bindAll = util.bindAll;
      lodash.bindKey = func.bindKey;
      lodash.castArray = lang.castArray;
      lodash.chain = seq.chain;
      lodash.chunk = array.chunk;
      lodash.compact = array.compact;
      lodash.concat = array.concat;
      lodash.cond = util.cond;
      lodash.conforms = util.conforms;
      lodash.constant = util.constant;
      lodash.countBy = collection.countBy;
      lodash.create = object.create;
      lodash.curry = func.curry;
      lodash.curryRight = func.curryRight;
      lodash.debounce = func.debounce;
      lodash.defaults = object.defaults;
      lodash.defaultsDeep = object.defaultsDeep;
      lodash.defer = func.defer;
      lodash.delay = func.delay;
      lodash.difference = array.difference;
      lodash.differenceBy = array.differenceBy;
      lodash.differenceWith = array.differenceWith;
      lodash.drop = array.drop;
      lodash.dropRight = array.dropRight;
      lodash.dropRightWhile = array.dropRightWhile;
      lodash.dropWhile = array.dropWhile;
      lodash.fill = array.fill;
      lodash.filter = collection.filter;
      lodash.flatMap = collection.flatMap;
      lodash.flatMapDeep = collection.flatMapDeep;
      lodash.flatMapDepth = collection.flatMapDepth;
      lodash.flatten = array.flatten;
      lodash.flattenDeep = array.flattenDeep;
      lodash.flattenDepth = array.flattenDepth;
      lodash.flip = func.flip;
      lodash.flow = util.flow;
      lodash.flowRight = util.flowRight;
      lodash.fromPairs = array.fromPairs;
      lodash.functions = object.functions;
      lodash.functionsIn = object.functionsIn;
      lodash.groupBy = collection.groupBy;
      lodash.initial = array.initial;
      lodash.intersection = array.intersection;
      lodash.intersectionBy = array.intersectionBy;
      lodash.intersectionWith = array.intersectionWith;
      lodash.invert = object.invert;
      lodash.invertBy = object.invertBy;
      lodash.invokeMap = collection.invokeMap;
      lodash.iteratee = util.iteratee;
      lodash.keyBy = collection.keyBy;
      lodash.keys = keys;
      lodash.keysIn = object.keysIn;
      lodash.map = collection.map;
      lodash.mapKeys = object.mapKeys;
      lodash.mapValues = object.mapValues;
      lodash.matches = util.matches;
      lodash.matchesProperty = util.matchesProperty;
      lodash.memoize = func.memoize;
      lodash.merge = object.merge;
      lodash.mergeWith = object.mergeWith;
      lodash.method = util.method;
      lodash.methodOf = util.methodOf;
      lodash.mixin = mixin;
      lodash.negate = negate;
      lodash.nthArg = util.nthArg;
      lodash.omit = object.omit;
      lodash.omitBy = object.omitBy;
      lodash.once = func.once;
      lodash.orderBy = collection.orderBy;
      lodash.over = util.over;
      lodash.overArgs = func.overArgs;
      lodash.overEvery = util.overEvery;
      lodash.overSome = util.overSome;
      lodash.partial = func.partial;
      lodash.partialRight = func.partialRight;
      lodash.partition = collection.partition;
      lodash.pick = object.pick;
      lodash.pickBy = object.pickBy;
      lodash.property = util.property;
      lodash.propertyOf = util.propertyOf;
      lodash.pull = array.pull;
      lodash.pullAll = array.pullAll;
      lodash.pullAllBy = array.pullAllBy;
      lodash.pullAllWith = array.pullAllWith;
      lodash.pullAt = array.pullAt;
      lodash.range = util.range;
      lodash.rangeRight = util.rangeRight;
      lodash.rearg = func.rearg;
      lodash.reject = collection.reject;
      lodash.remove = array.remove;
      lodash.rest = func.rest;
      lodash.reverse = array.reverse;
      lodash.sampleSize = collection.sampleSize;
      lodash.set = object.set;
      lodash.setWith = object.setWith;
      lodash.shuffle = collection.shuffle;
      lodash.slice = array.slice;
      lodash.sortBy = collection.sortBy;
      lodash.sortedUniq = array.sortedUniq;
      lodash.sortedUniqBy = array.sortedUniqBy;
      lodash.split = string.split;
      lodash.spread = func.spread;
      lodash.tail = array.tail;
      lodash.take = array.take;
      lodash.takeRight = array.takeRight;
      lodash.takeRightWhile = array.takeRightWhile;
      lodash.takeWhile = array.takeWhile;
      lodash.tap = seq.tap;
      lodash.throttle = func.throttle;
      lodash.thru = thru;
      lodash.toArray = lang.toArray;
      lodash.toPairs = object.toPairs;
      lodash.toPairsIn = object.toPairsIn;
      lodash.toPath = util.toPath;
      lodash.toPlainObject = lang.toPlainObject;
      lodash.transform = object.transform;
      lodash.unary = func.unary;
      lodash.union = array.union;
      lodash.unionBy = array.unionBy;
      lodash.unionWith = array.unionWith;
      lodash.uniq = array.uniq;
      lodash.uniqBy = array.uniqBy;
      lodash.uniqWith = array.uniqWith;
      lodash.unset = object.unset;
      lodash.unzip = array.unzip;
      lodash.unzipWith = array.unzipWith;
      lodash.update = object.update;
      lodash.updateWith = object.updateWith;
      lodash.values = object.values;
      lodash.valuesIn = object.valuesIn;
      lodash.without = array.without;
      lodash.words = string.words;
      lodash.wrap = func.wrap;
      lodash.xor = array.xor;
      lodash.xorBy = array.xorBy;
      lodash.xorWith = array.xorWith;
      lodash.zip = array.zip;
      lodash.zipObject = array.zipObject;
      lodash.zipObjectDeep = array.zipObjectDeep;
      lodash.zipWith = array.zipWith;
      lodash.entries = object.toPairs;
      lodash.entriesIn = object.toPairsIn;
      lodash.extend = object.assignIn;
      lodash.extendWith = object.assignInWith;
      mixin(lodash, lodash);
      lodash.add = math.add;
      lodash.attempt = util.attempt;
      lodash.camelCase = string.camelCase;
      lodash.capitalize = string.capitalize;
      lodash.ceil = math.ceil;
      lodash.clamp = number.clamp;
      lodash.clone = lang.clone;
      lodash.cloneDeep = lang.cloneDeep;
      lodash.cloneDeepWith = lang.cloneDeepWith;
      lodash.cloneWith = lang.cloneWith;
      lodash.conformsTo = lang.conformsTo;
      lodash.deburr = string.deburr;
      lodash.defaultTo = util.defaultTo;
      lodash.divide = math.divide;
      lodash.endsWith = string.endsWith;
      lodash.eq = lang.eq;
      lodash.escape = string.escape;
      lodash.escapeRegExp = string.escapeRegExp;
      lodash.every = collection.every;
      lodash.find = collection.find;
      lodash.findIndex = array.findIndex;
      lodash.findKey = object.findKey;
      lodash.findLast = collection.findLast;
      lodash.findLastIndex = array.findLastIndex;
      lodash.findLastKey = object.findLastKey;
      lodash.floor = math.floor;
      lodash.forEach = collection.forEach;
      lodash.forEachRight = collection.forEachRight;
      lodash.forIn = object.forIn;
      lodash.forInRight = object.forInRight;
      lodash.forOwn = object.forOwn;
      lodash.forOwnRight = object.forOwnRight;
      lodash.get = object.get;
      lodash.gt = lang.gt;
      lodash.gte = lang.gte;
      lodash.has = object.has;
      lodash.hasIn = object.hasIn;
      lodash.head = array.head;
      lodash.identity = identity;
      lodash.includes = collection.includes;
      lodash.indexOf = array.indexOf;
      lodash.inRange = number.inRange;
      lodash.invoke = object.invoke;
      lodash.isArguments = lang.isArguments;
      lodash.isArray = isArray$2;
      lodash.isArrayBuffer = lang.isArrayBuffer;
      lodash.isArrayLike = lang.isArrayLike;
      lodash.isArrayLikeObject = lang.isArrayLikeObject;
      lodash.isBoolean = lang.isBoolean;
      lodash.isBuffer = lang.isBuffer;
      lodash.isDate = lang.isDate;
      lodash.isElement = lang.isElement;
      lodash.isEmpty = lang.isEmpty;
      lodash.isEqual = lang.isEqual;
      lodash.isEqualWith = lang.isEqualWith;
      lodash.isError = lang.isError;
      lodash.isFinite = lang.isFinite;
      lodash.isFunction = lang.isFunction;
      lodash.isInteger = lang.isInteger;
      lodash.isLength = lang.isLength;
      lodash.isMap = lang.isMap;
      lodash.isMatch = lang.isMatch;
      lodash.isMatchWith = lang.isMatchWith;
      lodash.isNaN = lang.isNaN;
      lodash.isNative = lang.isNative;
      lodash.isNil = lang.isNil;
      lodash.isNull = lang.isNull;
      lodash.isNumber = lang.isNumber;
      lodash.isObject = isObject$2;
      lodash.isObjectLike = lang.isObjectLike;
      lodash.isPlainObject = lang.isPlainObject;
      lodash.isRegExp = lang.isRegExp;
      lodash.isSafeInteger = lang.isSafeInteger;
      lodash.isSet = lang.isSet;
      lodash.isString = lang.isString;
      lodash.isSymbol = lang.isSymbol;
      lodash.isTypedArray = lang.isTypedArray;
      lodash.isUndefined = lang.isUndefined;
      lodash.isWeakMap = lang.isWeakMap;
      lodash.isWeakSet = lang.isWeakSet;
      lodash.join = array.join;
      lodash.kebabCase = string.kebabCase;
      lodash.last = last;
      lodash.lastIndexOf = array.lastIndexOf;
      lodash.lowerCase = string.lowerCase;
      lodash.lowerFirst = string.lowerFirst;
      lodash.lt = lang.lt;
      lodash.lte = lang.lte;
      lodash.max = math.max;
      lodash.maxBy = math.maxBy;
      lodash.mean = math.mean;
      lodash.meanBy = math.meanBy;
      lodash.min = math.min;
      lodash.minBy = math.minBy;
      lodash.stubArray = util.stubArray;
      lodash.stubFalse = util.stubFalse;
      lodash.stubObject = util.stubObject;
      lodash.stubString = util.stubString;
      lodash.stubTrue = util.stubTrue;
      lodash.multiply = math.multiply;
      lodash.nth = array.nth;
      lodash.noop = util.noop;
      lodash.now = date.now;
      lodash.pad = string.pad;
      lodash.padEnd = string.padEnd;
      lodash.padStart = string.padStart;
      lodash.parseInt = string.parseInt;
      lodash.random = number.random;
      lodash.reduce = collection.reduce;
      lodash.reduceRight = collection.reduceRight;
      lodash.repeat = string.repeat;
      lodash.replace = string.replace;
      lodash.result = object.result;
      lodash.round = math.round;
      lodash.sample = collection.sample;
      lodash.size = collection.size;
      lodash.snakeCase = string.snakeCase;
      lodash.some = collection.some;
      lodash.sortedIndex = array.sortedIndex;
      lodash.sortedIndexBy = array.sortedIndexBy;
      lodash.sortedIndexOf = array.sortedIndexOf;
      lodash.sortedLastIndex = array.sortedLastIndex;
      lodash.sortedLastIndexBy = array.sortedLastIndexBy;
      lodash.sortedLastIndexOf = array.sortedLastIndexOf;
      lodash.startCase = string.startCase;
      lodash.startsWith = string.startsWith;
      lodash.subtract = math.subtract;
      lodash.sum = math.sum;
      lodash.sumBy = math.sumBy;
      lodash.template = string.template;
      lodash.times = util.times;
      lodash.toFinite = lang.toFinite;
      lodash.toInteger = toInteger;
      lodash.toLength = lang.toLength;
      lodash.toLower = string.toLower;
      lodash.toNumber = lang.toNumber;
      lodash.toSafeInteger = lang.toSafeInteger;
      lodash.toString = lang.toString;
      lodash.toUpper = string.toUpper;
      lodash.trim = string.trim;
      lodash.trimEnd = string.trimEnd;
      lodash.trimStart = string.trimStart;
      lodash.truncate = string.truncate;
      lodash.unescape = string.unescape;
      lodash.uniqueId = util.uniqueId;
      lodash.upperCase = string.upperCase;
      lodash.upperFirst = string.upperFirst;
      lodash.each = collection.forEach;
      lodash.eachRight = collection.forEachRight;
      lodash.first = array.head;
      mixin(lodash, function() {
        var source = {};
        baseForOwn(lodash, function(func2, methodName) {
          if (!hasOwnProperty$1.call(lodash.prototype, methodName)) {
            source[methodName] = func2;
          }
        });
        return source;
      }(), { "chain": false });
      lodash.VERSION = VERSION$1;
      (lodash.templateSettings = string.templateSettings).imports._ = lodash;
      arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
        lodash[methodName].placeholder = lodash;
      });
      arrayEach(["drop", "take"], function(methodName, index) {
        LazyWrapper.prototype[methodName] = function(n) {
          n = n === void 0 ? 1 : nativeMax(toInteger(n), 0);
          var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
          if (result2.__filtered__) {
            result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
          } else {
            result2.__views__.push({
              "size": nativeMin(n, MAX_ARRAY_LENGTH),
              "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
            });
          }
          return result2;
        };
        LazyWrapper.prototype[methodName + "Right"] = function(n) {
          return this.reverse()[methodName](n).reverse();
        };
      });
      arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
        var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
        LazyWrapper.prototype[methodName] = function(iteratee2) {
          var result2 = this.clone();
          result2.__iteratees__.push({
            "iteratee": baseIteratee(iteratee2),
            "type": type
          });
          result2.__filtered__ = result2.__filtered__ || isFilter;
          return result2;
        };
      });
      arrayEach(["head", "last"], function(methodName, index) {
        var takeName = "take" + (index ? "Right" : "");
        LazyWrapper.prototype[methodName] = function() {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(["initial", "tail"], function(methodName, index) {
        var dropName = "drop" + (index ? "" : "Right");
        LazyWrapper.prototype[methodName] = function() {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });
      LazyWrapper.prototype.compact = function() {
        return this.filter(identity);
      };
      LazyWrapper.prototype.find = function(predicate) {
        return this.filter(predicate).head();
      };
      LazyWrapper.prototype.findLast = function(predicate) {
        return this.reverse().find(predicate);
      };
      LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
        if (typeof path == "function") {
          return new LazyWrapper(this);
        }
        return this.map(function(value) {
          return baseInvoke(value, path, args);
        });
      });
      LazyWrapper.prototype.reject = function(predicate) {
        return this.filter(negate(baseIteratee(predicate)));
      };
      LazyWrapper.prototype.slice = function(start, end) {
        start = toInteger(start);
        var result2 = this;
        if (result2.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result2);
        }
        if (start < 0) {
          result2 = result2.takeRight(-start);
        } else if (start) {
          result2 = result2.drop(start);
        }
        if (end !== void 0) {
          end = toInteger(end);
          result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
        }
        return result2;
      };
      LazyWrapper.prototype.takeRightWhile = function(predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };
      LazyWrapper.prototype.toArray = function() {
        return this.take(MAX_ARRAY_LENGTH);
      };
      baseForOwn(LazyWrapper.prototype, function(func2, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
        if (!lodashFunc) {
          return;
        }
        lodash.prototype[methodName] = function() {
          var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray$2(value);
          var interceptor = function(value2) {
            var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
            return isTaker && chainAll ? result3[0] : result3;
          };
          if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result2 = func2.apply(value, args);
            result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": void 0 });
            return new LodashWrapper(result2, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func2.apply(this, args);
          }
          result2 = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
        };
      });
      arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
        var func2 = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
        lodash.prototype[methodName] = function() {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func2.apply(isArray$2(value) ? value : [], args);
          }
          return this[chainName](function(value2) {
            return func2.apply(isArray$2(value2) ? value2 : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function(func2, methodName) {
        var lodashFunc = lodash[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + "";
          if (!hasOwnProperty$1.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({ "name": methodName, "func": lodashFunc });
        }
      });
      realNames[createHybrid(void 0, WRAP_BIND_KEY_FLAG).name] = [{
        "name": "wrapper",
        "func": void 0
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash.prototype.at = seq.at;
      lodash.prototype.chain = seq.wrapperChain;
      lodash.prototype.commit = seq.commit;
      lodash.prototype.next = seq.next;
      lodash.prototype.plant = seq.plant;
      lodash.prototype.reverse = seq.reverse;
      lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = seq.value;
      lodash.prototype.first = lodash.prototype.head;
      if (symIterator) {
        lodash.prototype[symIterator] = seq.toIterator;
      }
      function bind$2(fn, thisArg) {
        return function wrap2() {
          return fn.apply(thisArg, arguments);
        };
      }
      const { toString: toString$1 } = Object.prototype;
      const { getPrototypeOf } = Object;
      const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
        const str = toString$1.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      })(/* @__PURE__ */ Object.create(null));
      const kindOfTest = (type) => {
        type = type.toLowerCase();
        return (thing) => kindOf(thing) === type;
      };
      const typeOfTest = (type) => (thing) => typeof thing === type;
      const { isArray: isArray$1 } = Array;
      const isUndefined$1 = typeOfTest("undefined");
      function isBuffer(val) {
        return val !== null && !isUndefined$1(val) && val.constructor !== null && !isUndefined$1(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
      }
      const isArrayBuffer$1 = kindOfTest("ArrayBuffer");
      function isArrayBufferView$1(val) {
        let result2;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          result2 = ArrayBuffer.isView(val);
        } else {
          result2 = val && val.buffer && isArrayBuffer$1(val.buffer);
        }
        return result2;
      }
      const isString$1 = typeOfTest("string");
      const isFunction$1 = typeOfTest("function");
      const isNumber$1 = typeOfTest("number");
      const isObject$1 = (thing) => thing !== null && typeof thing === "object";
      const isBoolean = (thing) => thing === true || thing === false;
      const isPlainObject = (val) => {
        if (kindOf(val) !== "object") {
          return false;
        }
        const prototype2 = getPrototypeOf(val);
        return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
      };
      const isDate$1 = kindOfTest("Date");
      const isFile$1 = kindOfTest("File");
      const isBlob$1 = kindOfTest("Blob");
      const isFileList = kindOfTest("FileList");
      const isStream$1 = (val) => isObject$1(val) && isFunction$1(val.pipe);
      const isFormData$1 = (thing) => {
        let kind;
        return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
        kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
      };
      const isURLSearchParams$1 = kindOfTest("URLSearchParams");
      const trim$1 = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      function forEach$1(obj, fn, { allOwnKeys = false } = {}) {
        if (obj === null || typeof obj === "undefined") {
          return;
        }
        let i;
        let l;
        if (typeof obj !== "object") {
          obj = [obj];
        }
        if (isArray$1(obj)) {
          for (i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          const keys2 = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
          const len = keys2.length;
          let key;
          for (i = 0; i < len; i++) {
            key = keys2[i];
            fn.call(null, obj[key], key, obj);
          }
        }
      }
      function findKey(obj, key) {
        key = key.toLowerCase();
        const keys2 = Object.keys(obj);
        let i = keys2.length;
        let _key;
        while (i-- > 0) {
          _key = keys2[i];
          if (key === _key.toLowerCase()) {
            return _key;
          }
        }
        return null;
      }
      const _global = (() => {
        if (typeof globalThis !== "undefined")
          return globalThis;
        return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
      })();
      const isContextDefined = (context) => !isUndefined$1(context) && context !== _global;
      function merge$1() {
        const { caseless } = isContextDefined(this) && this || {};
        const result2 = {};
        const assignValue2 = (val, key) => {
          const targetKey = caseless && findKey(result2, key) || key;
          if (isPlainObject(result2[targetKey]) && isPlainObject(val)) {
            result2[targetKey] = merge$1(result2[targetKey], val);
          } else if (isPlainObject(val)) {
            result2[targetKey] = merge$1({}, val);
          } else if (isArray$1(val)) {
            result2[targetKey] = val.slice();
          } else {
            result2[targetKey] = val;
          }
        };
        for (let i = 0, l = arguments.length; i < l; i++) {
          arguments[i] && forEach$1(arguments[i], assignValue2);
        }
        return result2;
      }
      const extend$1 = (a, b, thisArg, { allOwnKeys } = {}) => {
        forEach$1(b, (val, key) => {
          if (thisArg && isFunction$1(val)) {
            a[key] = bind$2(val, thisArg);
          } else {
            a[key] = val;
          }
        }, { allOwnKeys });
        return a;
      };
      const stripBOM = (content) => {
        if (content.charCodeAt(0) === 65279) {
          content = content.slice(1);
        }
        return content;
      };
      const inherits = (constructor, superConstructor, props, descriptors2) => {
        constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
        constructor.prototype.constructor = constructor;
        Object.defineProperty(constructor, "super", {
          value: superConstructor.prototype
        });
        props && Object.assign(constructor.prototype, props);
      };
      const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
        let props;
        let i;
        let prop;
        const merged = {};
        destObj = destObj || {};
        if (sourceObj == null)
          return destObj;
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
          sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
        } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
        return destObj;
      };
      const endsWith = (str, searchString, position) => {
        str = String(str);
        if (position === void 0 || position > str.length) {
          position = str.length;
        }
        position -= searchString.length;
        const lastIndex = str.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      };
      const toArray = (thing) => {
        if (!thing)
          return null;
        if (isArray$1(thing))
          return thing;
        let i = thing.length;
        if (!isNumber$1(i))
          return null;
        const arr = new Array(i);
        while (i-- > 0) {
          arr[i] = thing[i];
        }
        return arr;
      };
      const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
        return (thing) => {
          return TypedArray && thing instanceof TypedArray;
        };
      })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
      const forEachEntry = (obj, fn) => {
        const generator = obj && obj[Symbol.iterator];
        const iterator = generator.call(obj);
        let result2;
        while ((result2 = iterator.next()) && !result2.done) {
          const pair = result2.value;
          fn.call(obj, pair[0], pair[1]);
        }
      };
      const matchAll = (regExp, str) => {
        let matches2;
        const arr = [];
        while ((matches2 = regExp.exec(str)) !== null) {
          arr.push(matches2);
        }
        return arr;
      };
      const isHTMLForm = kindOfTest("HTMLFormElement");
      const toCamelCase = (str) => {
        return str.toLowerCase().replace(
          /[-_\s]([a-z\d])(\w*)/g,
          function replacer(m, p1, p2) {
            return p1.toUpperCase() + p2;
          }
        );
      };
      const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
      const isRegExp = kindOfTest("RegExp");
      const reduceDescriptors = (obj, reducer) => {
        const descriptors2 = Object.getOwnPropertyDescriptors(obj);
        const reducedDescriptors = {};
        forEach$1(descriptors2, (descriptor, name) => {
          let ret;
          if ((ret = reducer(descriptor, name, obj)) !== false) {
            reducedDescriptors[name] = ret || descriptor;
          }
        });
        Object.defineProperties(obj, reducedDescriptors);
      };
      const freezeMethods = (obj) => {
        reduceDescriptors(obj, (descriptor, name) => {
          if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
            return false;
          }
          const value = obj[name];
          if (!isFunction$1(value))
            return;
          descriptor.enumerable = false;
          if ("writable" in descriptor) {
            descriptor.writable = false;
            return;
          }
          if (!descriptor.set) {
            descriptor.set = () => {
              throw Error("Can not rewrite read-only method '" + name + "'");
            };
          }
        });
      };
      const toObjectSet = (arrayOrString, delimiter) => {
        const obj = {};
        const define = (arr) => {
          arr.forEach((value) => {
            obj[value] = true;
          });
        };
        isArray$1(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
        return obj;
      };
      const noop = () => {
      };
      const toFiniteNumber = (value, defaultValue) => {
        value = +value;
        return Number.isFinite(value) ? value : defaultValue;
      };
      const ALPHA = "abcdefghijklmnopqrstuvwxyz";
      const DIGIT = "0123456789";
      const ALPHABET = {
        DIGIT,
        ALPHA,
        ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
      };
      const generateString = (size2 = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
        let str = "";
        const { length } = alphabet;
        while (size2--) {
          str += alphabet[Math.random() * length | 0];
        }
        return str;
      };
      function isSpecCompliantForm(thing) {
        return !!(thing && isFunction$1(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
      }
      const toJSONObject = (obj) => {
        const stack = new Array(10);
        const visit = (source, i) => {
          if (isObject$1(source)) {
            if (stack.indexOf(source) >= 0) {
              return;
            }
            if (!("toJSON" in source)) {
              stack[i] = source;
              const target = isArray$1(source) ? [] : {};
              forEach$1(source, (value, key) => {
                const reducedValue = visit(value, i + 1);
                !isUndefined$1(reducedValue) && (target[key] = reducedValue);
              });
              stack[i] = void 0;
              return target;
            }
          }
          return source;
        };
        return visit(obj, 0);
      };
      const isAsyncFn = kindOfTest("AsyncFunction");
      const isThenable = (thing) => thing && (isObject$1(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
      const utils$6 = {
        isArray: isArray$1,
        isArrayBuffer: isArrayBuffer$1,
        isBuffer,
        isFormData: isFormData$1,
        isArrayBufferView: isArrayBufferView$1,
        isString: isString$1,
        isNumber: isNumber$1,
        isBoolean,
        isObject: isObject$1,
        isPlainObject,
        isUndefined: isUndefined$1,
        isDate: isDate$1,
        isFile: isFile$1,
        isBlob: isBlob$1,
        isRegExp,
        isFunction: isFunction$1,
        isStream: isStream$1,
        isURLSearchParams: isURLSearchParams$1,
        isTypedArray,
        isFileList,
        forEach: forEach$1,
        merge: merge$1,
        extend: extend$1,
        trim: trim$1,
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
        hasOwnProp: hasOwnProperty,
        // an alias to avoid ESLint no-prototype-builtins detection
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
      };
      function AxiosError(message, code, config, request, response) {
        Error.call(this);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        } else {
          this.stack = new Error().stack;
        }
        this.message = message;
        this.name = "AxiosError";
        code && (this.code = code);
        config && (this.config = config);
        request && (this.request = request);
        response && (this.response = response);
      }
      utils$6.inherits(AxiosError, Error, {
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
            config: utils$6.toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
          };
        }
      });
      const prototype$1 = AxiosError.prototype;
      const descriptors = {};
      [
        "ERR_BAD_OPTION_VALUE",
        "ERR_BAD_OPTION",
        "ECONNABORTED",
        "ETIMEDOUT",
        "ERR_NETWORK",
        "ERR_FR_TOO_MANY_REDIRECTS",
        "ERR_DEPRECATED",
        "ERR_BAD_RESPONSE",
        "ERR_BAD_REQUEST",
        "ERR_CANCELED",
        "ERR_NOT_SUPPORT",
        "ERR_INVALID_URL"
        // eslint-disable-next-line func-names
      ].forEach((code) => {
        descriptors[code] = { value: code };
      });
      Object.defineProperties(AxiosError, descriptors);
      Object.defineProperty(prototype$1, "isAxiosError", { value: true });
      AxiosError.from = (error, code, config, request, response, customProps) => {
        const axiosError = Object.create(prototype$1);
        utils$6.toFlatObject(error, axiosError, function filter2(obj) {
          return obj !== Error.prototype;
        }, (prop) => {
          return prop !== "isAxiosError";
        });
        AxiosError.call(axiosError, error.message, code, config, request, response);
        axiosError.cause = error;
        axiosError.name = error.name;
        customProps && Object.assign(axiosError, customProps);
        return axiosError;
      };
      const httpAdapter = null;
      function isVisitable(thing) {
        return utils$6.isPlainObject(thing) || utils$6.isArray(thing);
      }
      function removeBrackets(key) {
        return utils$6.endsWith(key, "[]") ? key.slice(0, -2) : key;
      }
      function renderKey(path, key, dots) {
        if (!path)
          return key;
        return path.concat(key).map(function each(token, i) {
          token = removeBrackets(token);
          return !dots && i ? "[" + token + "]" : token;
        }).join(dots ? "." : "");
      }
      function isFlatArray(arr) {
        return utils$6.isArray(arr) && !arr.some(isVisitable);
      }
      const predicates = utils$6.toFlatObject(utils$6, {}, null, function filter2(prop) {
        return /^is[A-Z]/.test(prop);
      });
      function toFormData(obj, formData, options) {
        if (!utils$6.isObject(obj)) {
          throw new TypeError("target must be an object");
        }
        formData = formData || new FormData();
        options = utils$6.toFlatObject(options, {
          metaTokens: true,
          dots: false,
          indexes: false
        }, false, function defined(option, source) {
          return !utils$6.isUndefined(source[option]);
        });
        const metaTokens = options.metaTokens;
        const visitor = options.visitor || defaultVisitor;
        const dots = options.dots;
        const indexes = options.indexes;
        const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
        const useBlob = _Blob && utils$6.isSpecCompliantForm(formData);
        if (!utils$6.isFunction(visitor)) {
          throw new TypeError("visitor must be a function");
        }
        function convertValue(value) {
          if (value === null)
            return "";
          if (utils$6.isDate(value)) {
            return value.toISOString();
          }
          if (!useBlob && utils$6.isBlob(value)) {
            throw new AxiosError("Blob is not supported. Use a Buffer instead.");
          }
          if (utils$6.isArrayBuffer(value) || utils$6.isTypedArray(value)) {
            return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
          }
          return value;
        }
        function defaultVisitor(value, key, path) {
          let arr = value;
          if (value && !path && typeof value === "object") {
            if (utils$6.endsWith(key, "{}")) {
              key = metaTokens ? key : key.slice(0, -2);
              value = JSON.stringify(value);
            } else if (utils$6.isArray(value) && isFlatArray(value) || (utils$6.isFileList(value) || utils$6.endsWith(key, "[]")) && (arr = utils$6.toArray(value))) {
              key = removeBrackets(key);
              arr.forEach(function each(el, index) {
                !(utils$6.isUndefined(el) || el === null) && formData.append(
                  // eslint-disable-next-line no-nested-ternary
                  indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
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
          if (utils$6.isUndefined(value))
            return;
          if (stack.indexOf(value) !== -1) {
            throw Error("Circular reference detected in " + path.join("."));
          }
          stack.push(value);
          utils$6.forEach(value, function each(el, key) {
            const result2 = !(utils$6.isUndefined(el) || el === null) && visitor.call(
              formData,
              el,
              utils$6.isString(key) ? key.trim() : key,
              path,
              exposedHelpers
            );
            if (result2 === true) {
              build(el, path ? path.concat(key) : [key]);
            }
          });
          stack.pop();
        }
        if (!utils$6.isObject(obj)) {
          throw new TypeError("data must be an object");
        }
        build(obj);
        return formData;
      }
      function encode$2(str) {
        const charMap = {
          "!": "%21",
          "'": "%27",
          "(": "%28",
          ")": "%29",
          "~": "%7E",
          "%20": "+",
          "%00": "\0"
        };
        return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
          return charMap[match];
        });
      }
      function AxiosURLSearchParams(params, options) {
        this._pairs = [];
        params && toFormData(params, this, options);
      }
      const prototype = AxiosURLSearchParams.prototype;
      prototype.append = function append(name, value) {
        this._pairs.push([name, value]);
      };
      prototype.toString = function toString2(encoder) {
        const _encode = encoder ? function(value) {
          return encoder.call(this, value, encode$2);
        } : encode$2;
        return this._pairs.map(function each(pair) {
          return _encode(pair[0]) + "=" + _encode(pair[1]);
        }, "").join("&");
      };
      function encode$1(val) {
        return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      function buildURL$2(url, params, options) {
        if (!params) {
          return url;
        }
        const _encode = options && options.encode || encode$1;
        const serializeFn = options && options.serialize;
        let serializedParams;
        if (serializeFn) {
          serializedParams = serializeFn(params, options);
        } else {
          serializedParams = utils$6.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
        }
        if (serializedParams) {
          const hashmarkIndex = url.indexOf("#");
          if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
          }
          url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }
        return url;
      }
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
          utils$6.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
              fn(h);
            }
          });
        }
      }
      const transitionalDefaults = {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      };
      const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
      const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
      const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
      const platform$1 = {
        isBrowser: true,
        classes: {
          URLSearchParams: URLSearchParams$1,
          FormData: FormData$1,
          Blob: Blob$1
        },
        protocols: ["http", "https", "file", "blob", "url", "data"]
      };
      const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
      const hasStandardBrowserEnv = ((product) => {
        return hasBrowserEnv && ["ReactNative", "NativeScript", "NS"].indexOf(product) < 0;
      })(typeof navigator !== "undefined" && navigator.product);
      const hasStandardBrowserWebWorkerEnv = (() => {
        return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
        self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
      })();
      const utils$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
        __proto__: null,
        hasBrowserEnv,
        hasStandardBrowserEnv,
        hasStandardBrowserWebWorkerEnv
      }, Symbol.toStringTag, { value: "Module" }));
      const platform = {
        ...utils$5,
        ...platform$1
      };
      function toURLEncodedForm(data, options) {
        return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
          visitor: function(value, key, path, helpers) {
            if (platform.isNode && utils$6.isBuffer(value)) {
              this.append(key, value.toString("base64"));
              return false;
            }
            return helpers.defaultVisitor.apply(this, arguments);
          }
        }, options));
      }
      function parsePropPath(name) {
        return utils$6.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
          return match[0] === "[]" ? "" : match[1] || match[0];
        });
      }
      function arrayToObject(arr) {
        const obj = {};
        const keys2 = Object.keys(arr);
        let i;
        const len = keys2.length;
        let key;
        for (i = 0; i < len; i++) {
          key = keys2[i];
          obj[key] = arr[key];
        }
        return obj;
      }
      function formDataToJSON(formData) {
        function buildPath(path, value, target, index) {
          let name = path[index++];
          if (name === "__proto__")
            return true;
          const isNumericKey = Number.isFinite(+name);
          const isLast = index >= path.length;
          name = !name && utils$6.isArray(target) ? target.length : name;
          if (isLast) {
            if (utils$6.hasOwnProp(target, name)) {
              target[name] = [target[name], value];
            } else {
              target[name] = value;
            }
            return !isNumericKey;
          }
          if (!target[name] || !utils$6.isObject(target[name])) {
            target[name] = [];
          }
          const result2 = buildPath(path, value, target[name], index);
          if (result2 && utils$6.isArray(target[name])) {
            target[name] = arrayToObject(target[name]);
          }
          return !isNumericKey;
        }
        if (utils$6.isFormData(formData) && utils$6.isFunction(formData.entries)) {
          const obj = {};
          utils$6.forEachEntry(formData, (name, value) => {
            buildPath(parsePropPath(name), value, obj, 0);
          });
          return obj;
        }
        return null;
      }
      function stringifySafely(rawValue, parser, encoder) {
        if (utils$6.isString(rawValue)) {
          try {
            (parser || JSON.parse)(rawValue);
            return utils$6.trim(rawValue);
          } catch (e) {
            if (e.name !== "SyntaxError") {
              throw e;
            }
          }
        }
        return (encoder || JSON.stringify)(rawValue);
      }
      const defaults = {
        transitional: transitionalDefaults,
        adapter: ["xhr", "http"],
        transformRequest: [function transformRequest(data, headers) {
          const contentType = headers.getContentType() || "";
          const hasJSONContentType = contentType.indexOf("application/json") > -1;
          const isObjectPayload = utils$6.isObject(data);
          if (isObjectPayload && utils$6.isHTMLForm(data)) {
            data = new FormData(data);
          }
          const isFormData2 = utils$6.isFormData(data);
          if (isFormData2) {
            return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
          }
          if (utils$6.isArrayBuffer(data) || utils$6.isBuffer(data) || utils$6.isStream(data) || utils$6.isFile(data) || utils$6.isBlob(data)) {
            return data;
          }
          if (utils$6.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils$6.isURLSearchParams(data)) {
            headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
            return data.toString();
          }
          let isFileList2;
          if (isObjectPayload) {
            if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
              return toURLEncodedForm(data, this.formSerializer).toString();
            }
            if ((isFileList2 = utils$6.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
              const _FormData = this.env && this.env.FormData;
              return toFormData(
                isFileList2 ? { "files[]": data } : data,
                _FormData && new _FormData(),
                this.formSerializer
              );
            }
          }
          if (isObjectPayload || hasJSONContentType) {
            headers.setContentType("application/json", false);
            return stringifySafely(data);
          }
          return data;
        }],
        transformResponse: [function transformResponse(data) {
          const transitional = this.transitional || defaults.transitional;
          const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
          const JSONRequested = this.responseType === "json";
          if (data && utils$6.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
            const silentJSONParsing = transitional && transitional.silentJSONParsing;
            const strictJSONParsing = !silentJSONParsing && JSONRequested;
            try {
              return JSON.parse(data);
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === "SyntaxError") {
                  throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
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
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {
          FormData: platform.classes.FormData,
          Blob: platform.classes.Blob
        },
        validateStatus: function validateStatus(status) {
          return status >= 200 && status < 300;
        },
        headers: {
          common: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": void 0
          }
        }
      };
      utils$6.forEach(["delete", "get", "head", "post", "put", "patch"], (method2) => {
        defaults.headers[method2] = {};
      });
      const defaults$1 = defaults;
      const ignoreDuplicateOf = utils$6.toObjectSet([
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "user-agent"
      ]);
      const parseHeaders$2 = (rawHeaders) => {
        const parsed = {};
        let key;
        let val;
        let i;
        rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
          i = line.indexOf(":");
          key = line.substring(0, i).trim().toLowerCase();
          val = line.substring(i + 1).trim();
          if (!key || parsed[key] && ignoreDuplicateOf[key]) {
            return;
          }
          if (key === "set-cookie") {
            if (parsed[key]) {
              parsed[key].push(val);
            } else {
              parsed[key] = [val];
            }
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        });
        return parsed;
      };
      const $internals = Symbol("internals");
      function normalizeHeader(header) {
        return header && String(header).trim().toLowerCase();
      }
      function normalizeValue(value) {
        if (value === false || value == null) {
          return value;
        }
        return utils$6.isArray(value) ? value.map(normalizeValue) : String(value);
      }
      function parseTokens(str) {
        const tokens = /* @__PURE__ */ Object.create(null);
        const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
        let match;
        while (match = tokensRE.exec(str)) {
          tokens[match[1]] = match[2];
        }
        return tokens;
      }
      const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
      function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
        if (utils$6.isFunction(filter2)) {
          return filter2.call(this, value, header);
        }
        if (isHeaderNameFilter) {
          value = header;
        }
        if (!utils$6.isString(value))
          return;
        if (utils$6.isString(filter2)) {
          return value.indexOf(filter2) !== -1;
        }
        if (utils$6.isRegExp(filter2)) {
          return filter2.test(value);
        }
      }
      function formatHeader(header) {
        return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
          return char.toUpperCase() + str;
        });
      }
      function buildAccessors(obj, header) {
        const accessorName = utils$6.toCamelCase(" " + header);
        ["get", "set", "has"].forEach((methodName) => {
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
          const self2 = this;
          function setHeader(_value, _header, _rewrite) {
            const lHeader = normalizeHeader(_header);
            if (!lHeader) {
              throw new Error("header name must be a non-empty string");
            }
            const key = utils$6.findKey(self2, lHeader);
            if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
              self2[key || _header] = normalizeValue(_value);
            }
          }
          const setHeaders = (headers, _rewrite) => utils$6.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
          if (utils$6.isPlainObject(header) || header instanceof this.constructor) {
            setHeaders(header, valueOrRewrite);
          } else if (utils$6.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
            setHeaders(parseHeaders$2(header), valueOrRewrite);
          } else {
            header != null && setHeader(valueOrRewrite, header, rewrite);
          }
          return this;
        }
        get(header, parser) {
          header = normalizeHeader(header);
          if (header) {
            const key = utils$6.findKey(this, header);
            if (key) {
              const value = this[key];
              if (!parser) {
                return value;
              }
              if (parser === true) {
                return parseTokens(value);
              }
              if (utils$6.isFunction(parser)) {
                return parser.call(this, value, key);
              }
              if (utils$6.isRegExp(parser)) {
                return parser.exec(value);
              }
              throw new TypeError("parser must be boolean|regexp|function");
            }
          }
        }
        has(header, matcher) {
          header = normalizeHeader(header);
          if (header) {
            const key = utils$6.findKey(this, header);
            return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
          }
          return false;
        }
        delete(header, matcher) {
          const self2 = this;
          let deleted = false;
          function deleteHeader(_header) {
            _header = normalizeHeader(_header);
            if (_header) {
              const key = utils$6.findKey(self2, _header);
              if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
                delete self2[key];
                deleted = true;
              }
            }
          }
          if (utils$6.isArray(header)) {
            header.forEach(deleteHeader);
          } else {
            deleteHeader(header);
          }
          return deleted;
        }
        clear(matcher) {
          const keys2 = Object.keys(this);
          let i = keys2.length;
          let deleted = false;
          while (i--) {
            const key = keys2[i];
            if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
              delete this[key];
              deleted = true;
            }
          }
          return deleted;
        }
        normalize(format) {
          const self2 = this;
          const headers = {};
          utils$6.forEach(this, (value, header) => {
            const key = utils$6.findKey(headers, header);
            if (key) {
              self2[key] = normalizeValue(value);
              delete self2[header];
              return;
            }
            const normalized = format ? formatHeader(header) : String(header).trim();
            if (normalized !== header) {
              delete self2[header];
            }
            self2[normalized] = normalizeValue(value);
            headers[normalized] = true;
          });
          return this;
        }
        concat(...targets) {
          return this.constructor.concat(this, ...targets);
        }
        toJSON(asStrings) {
          const obj = /* @__PURE__ */ Object.create(null);
          utils$6.forEach(this, (value, header) => {
            value != null && value !== false && (obj[header] = asStrings && utils$6.isArray(value) ? value.join(", ") : value);
          });
          return obj;
        }
        [Symbol.iterator]() {
          return Object.entries(this.toJSON())[Symbol.iterator]();
        }
        toString() {
          return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
        }
        get [Symbol.toStringTag]() {
          return "AxiosHeaders";
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
          const internals = this[$internals] = this[$internals] = {
            accessors: {}
          };
          const accessors = internals.accessors;
          const prototype2 = this.prototype;
          function defineAccessor(_header) {
            const lHeader = normalizeHeader(_header);
            if (!accessors[lHeader]) {
              buildAccessors(prototype2, _header);
              accessors[lHeader] = true;
            }
          }
          utils$6.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
          return this;
        }
      }
      AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
      utils$6.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
        let mapped = key[0].toUpperCase() + key.slice(1);
        return {
          get: () => value,
          set(headerValue) {
            this[mapped] = headerValue;
          }
        };
      });
      utils$6.freezeMethods(AxiosHeaders);
      const AxiosHeaders$1 = AxiosHeaders;
      function transformData(fns, response) {
        const config = this || defaults$1;
        const context = response || config;
        const headers = AxiosHeaders$1.from(context.headers);
        let data = context.data;
        utils$6.forEach(fns, function transform2(fn) {
          data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
        });
        headers.normalize();
        return data;
      }
      function isCancel(value) {
        return !!(value && value.__CANCEL__);
      }
      function CanceledError(message, config, request) {
        AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
        this.name = "CanceledError";
      }
      utils$6.inherits(CanceledError, AxiosError, {
        __CANCEL__: true
      });
      function settle$2(resolve, reject2, response) {
        const validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject2(new AxiosError(
            "Request failed with status code " + response.status,
            [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
            response.config,
            response.request,
            response
          ));
        }
      }
      const cookies$1 = platform.hasStandardBrowserEnv ? (
        // Standard browser envs support document.cookie
        {
          write(name, value, expires, path, domain, secure) {
            const cookie = [name + "=" + encodeURIComponent(value)];
            utils$6.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
            utils$6.isString(path) && cookie.push("path=" + path);
            utils$6.isString(domain) && cookie.push("domain=" + domain);
            secure === true && cookie.push("secure");
            document.cookie = cookie.join("; ");
          },
          read(name) {
            const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
          },
          remove(name) {
            this.write(name, "", Date.now() - 864e5);
          }
        }
      ) : (
        // Non-standard browser env (web workers, react-native) lack needed support.
        {
          write() {
          },
          read() {
            return null;
          },
          remove() {
          }
        }
      );
      function isAbsoluteURL(url) {
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
      }
      function combineURLs(baseURL, relativeURL) {
        return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
      }
      function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
          return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
      }
      const isURLSameOrigin$2 = platform.hasStandardBrowserEnv ? (
        // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        function standardBrowserEnv() {
          const msie = /(msie|trident)/i.test(navigator.userAgent);
          const urlParsingNode = document.createElement("a");
          let originURL;
          function resolveURL(url) {
            let href = url;
            if (msie) {
              urlParsingNode.setAttribute("href", href);
              href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute("href", href);
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
            };
          }
          originURL = resolveURL(window.location.href);
          return function isURLSameOrigin2(requestURL) {
            const parsed = utils$6.isString(requestURL) ? resolveURL(requestURL) : requestURL;
            return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
          };
        }()
      ) : (
        // Non standard browser envs (web workers, react-native) lack needed support.
        /* @__PURE__ */ function nonStandardBrowserEnv() {
          return function isURLSameOrigin2() {
            return true;
          };
        }()
      );
      function parseProtocol(url) {
        const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
        return match && match[1] || "";
      }
      function speedometer(samplesCount, min2) {
        samplesCount = samplesCount || 10;
        const bytes = new Array(samplesCount);
        const timestamps = new Array(samplesCount);
        let head2 = 0;
        let tail2 = 0;
        let firstSampleTS;
        min2 = min2 !== void 0 ? min2 : 1e3;
        return function push(chunkLength) {
          const now2 = Date.now();
          const startedAt = timestamps[tail2];
          if (!firstSampleTS) {
            firstSampleTS = now2;
          }
          bytes[head2] = chunkLength;
          timestamps[head2] = now2;
          let i = tail2;
          let bytesCount = 0;
          while (i !== head2) {
            bytesCount += bytes[i++];
            i = i % samplesCount;
          }
          head2 = (head2 + 1) % samplesCount;
          if (head2 === tail2) {
            tail2 = (tail2 + 1) % samplesCount;
          }
          if (now2 - firstSampleTS < min2) {
            return;
          }
          const passed = startedAt && now2 - startedAt;
          return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
        };
      }
      function progressEventReducer(listener, isDownloadStream) {
        let bytesNotified = 0;
        const _speedometer = speedometer(50, 250);
        return (e) => {
          const loaded = e.loaded;
          const total = e.lengthComputable ? e.total : void 0;
          const progressBytes = loaded - bytesNotified;
          const rate = _speedometer(progressBytes);
          const inRange2 = loaded <= total;
          bytesNotified = loaded;
          const data = {
            loaded,
            total,
            progress: total ? loaded / total : void 0,
            bytes: progressBytes,
            rate: rate ? rate : void 0,
            estimated: rate && total && inRange2 ? (total - loaded) / rate : void 0,
            event: e
          };
          data[isDownloadStream ? "download" : "upload"] = true;
          listener(data);
        };
      }
      const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
      const xhrAdapter = isXHRAdapterSupported && function(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject2) {
          let requestData = config.data;
          const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
          let { responseType, withXSRFToken } = config;
          let onCanceled;
          function done() {
            if (config.cancelToken) {
              config.cancelToken.unsubscribe(onCanceled);
            }
            if (config.signal) {
              config.signal.removeEventListener("abort", onCanceled);
            }
          }
          let contentType;
          if (utils$6.isFormData(requestData)) {
            if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
              requestHeaders.setContentType(false);
            } else if ((contentType = requestHeaders.getContentType()) !== false) {
              const [type, ...tokens] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
              requestHeaders.setContentType([type || "multipart/form-data", ...tokens].join("; "));
            }
          }
          let request = new XMLHttpRequest();
          if (config.auth) {
            const username = config.auth.username || "";
            const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
            requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
          }
          const fullPath = buildFullPath(config.baseURL, config.url);
          request.open(config.method.toUpperCase(), buildURL$2(fullPath, config.params, config.paramsSerializer), true);
          request.timeout = config.timeout;
          function onloadend() {
            if (!request) {
              return;
            }
            const responseHeaders = AxiosHeaders$1.from(
              "getAllResponseHeaders" in request && request.getAllResponseHeaders()
            );
            const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            const response = {
              data: responseData,
              status: request.status,
              statusText: request.statusText,
              headers: responseHeaders,
              config,
              request
            };
            settle$2(function _resolve(value) {
              resolve(value);
              done();
            }, function _reject(err) {
              reject2(err);
              done();
            }, response);
            request = null;
          }
          if ("onloadend" in request) {
            request.onloadend = onloadend;
          } else {
            request.onreadystatechange = function handleLoad() {
              if (!request || request.readyState !== 4) {
                return;
              }
              if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                return;
              }
              setTimeout(onloadend);
            };
          }
          request.onabort = function handleAbort() {
            if (!request) {
              return;
            }
            reject2(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
            request = null;
          };
          request.onerror = function handleError() {
            reject2(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
            request = null;
          };
          request.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
            const transitional = config.transitional || transitionalDefaults;
            if (config.timeoutErrorMessage) {
              timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject2(new AxiosError(
              timeoutErrorMessage,
              transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
              config,
              request
            ));
            request = null;
          };
          if (platform.hasStandardBrowserEnv) {
            withXSRFToken && utils$6.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(config));
            if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin$2(fullPath)) {
              const xsrfValue = config.xsrfHeaderName && config.xsrfCookieName && cookies$1.read(config.xsrfCookieName);
              if (xsrfValue) {
                requestHeaders.set(config.xsrfHeaderName, xsrfValue);
              }
            }
          }
          requestData === void 0 && requestHeaders.setContentType(null);
          if ("setRequestHeader" in request) {
            utils$6.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
              request.setRequestHeader(key, val);
            });
          }
          if (!utils$6.isUndefined(config.withCredentials)) {
            request.withCredentials = !!config.withCredentials;
          }
          if (responseType && responseType !== "json") {
            request.responseType = config.responseType;
          }
          if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
          }
          if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
          }
          if (config.cancelToken || config.signal) {
            onCanceled = (cancel) => {
              if (!request) {
                return;
              }
              reject2(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
              request.abort();
              request = null;
            };
            config.cancelToken && config.cancelToken.subscribe(onCanceled);
            if (config.signal) {
              config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
            }
          }
          const protocol = parseProtocol(fullPath);
          if (protocol && platform.protocols.indexOf(protocol) === -1) {
            reject2(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
            return;
          }
          request.send(requestData || null);
        });
      };
      const knownAdapters = {
        http: httpAdapter,
        xhr: xhrAdapter
      };
      utils$6.forEach(knownAdapters, (fn, value) => {
        if (fn) {
          try {
            Object.defineProperty(fn, "name", { value });
          } catch (e) {
          }
          Object.defineProperty(fn, "adapterName", { value });
        }
      });
      const renderReason = (reason) => `- ${reason}`;
      const isResolvedHandle = (adapter2) => utils$6.isFunction(adapter2) || adapter2 === null || adapter2 === false;
      const adapters = {
        getAdapter: (adapters2) => {
          adapters2 = utils$6.isArray(adapters2) ? adapters2 : [adapters2];
          const { length } = adapters2;
          let nameOrAdapter;
          let adapter2;
          const rejectedReasons = {};
          for (let i = 0; i < length; i++) {
            nameOrAdapter = adapters2[i];
            let id;
            adapter2 = nameOrAdapter;
            if (!isResolvedHandle(nameOrAdapter)) {
              adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
              if (adapter2 === void 0) {
                throw new AxiosError(`Unknown adapter '${id}'`);
              }
            }
            if (adapter2) {
              break;
            }
            rejectedReasons[id || "#" + i] = adapter2;
          }
          if (!adapter2) {
            const reasons = Object.entries(rejectedReasons).map(
              ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
            );
            let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
            throw new AxiosError(
              `There is no suitable adapter to dispatch the request ` + s,
              "ERR_NOT_SUPPORT"
            );
          }
          return adapter2;
        },
        adapters: knownAdapters
      };
      function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested();
        }
        if (config.signal && config.signal.aborted) {
          throw new CanceledError(null, config);
        }
      }
      function dispatchRequest(config) {
        throwIfCancellationRequested(config);
        config.headers = AxiosHeaders$1.from(config.headers);
        config.data = transformData.call(
          config,
          config.transformRequest
        );
        if (["post", "put", "patch"].indexOf(config.method) !== -1) {
          config.headers.setContentType("application/x-www-form-urlencoded", false);
        }
        const adapter2 = adapters.getAdapter(config.adapter || defaults$1.adapter);
        return adapter2(config).then(function onAdapterResolution(response) {
          throwIfCancellationRequested(config);
          response.data = transformData.call(
            config,
            config.transformResponse,
            response
          );
          response.headers = AxiosHeaders$1.from(response.headers);
          return response;
        }, function onAdapterRejection(reason) {
          if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            if (reason && reason.response) {
              reason.response.data = transformData.call(
                config,
                config.transformResponse,
                reason.response
              );
              reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
            }
          }
          return Promise.reject(reason);
        });
      }
      const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
      function mergeConfig(config1, config2) {
        config2 = config2 || {};
        const config = {};
        function getMergedValue(target, source, caseless) {
          if (utils$6.isPlainObject(target) && utils$6.isPlainObject(source)) {
            return utils$6.merge.call({ caseless }, target, source);
          } else if (utils$6.isPlainObject(source)) {
            return utils$6.merge({}, source);
          } else if (utils$6.isArray(source)) {
            return source.slice();
          }
          return source;
        }
        function mergeDeepProperties(a, b, caseless) {
          if (!utils$6.isUndefined(b)) {
            return getMergedValue(a, b, caseless);
          } else if (!utils$6.isUndefined(a)) {
            return getMergedValue(void 0, a, caseless);
          }
        }
        function valueFromConfig2(a, b) {
          if (!utils$6.isUndefined(b)) {
            return getMergedValue(void 0, b);
          }
        }
        function defaultToConfig2(a, b) {
          if (!utils$6.isUndefined(b)) {
            return getMergedValue(void 0, b);
          } else if (!utils$6.isUndefined(a)) {
            return getMergedValue(void 0, a);
          }
        }
        function mergeDirectKeys(a, b, prop) {
          if (prop in config2) {
            return getMergedValue(a, b);
          } else if (prop in config1) {
            return getMergedValue(void 0, a);
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
        utils$6.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
          const merge2 = mergeMap[prop] || mergeDeepProperties;
          const configValue = merge2(config1[prop], config2[prop], prop);
          utils$6.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
        });
        return config;
      }
      const VERSION = "1.6.8";
      const validators$1 = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
        validators$1[type] = function validator2(thing) {
          return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
        };
      });
      const deprecatedWarnings = {};
      validators$1.transitional = function transitional(validator2, version, message) {
        function formatMessage(opt, desc) {
          return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
        }
        return (value, opt, opts) => {
          if (validator2 === false) {
            throw new AxiosError(
              formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
              AxiosError.ERR_DEPRECATED
            );
          }
          if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            console.warn(
              formatMessage(
                opt,
                " has been deprecated since v" + version + " and will be removed in the near future"
              )
            );
          }
          return validator2 ? validator2(value, opt, opts) : true;
        };
      };
      function assertOptions(options, schema, allowUnknown) {
        if (typeof options !== "object") {
          throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
        }
        const keys2 = Object.keys(options);
        let i = keys2.length;
        while (i-- > 0) {
          const opt = keys2[i];
          const validator2 = schema[opt];
          if (validator2) {
            const value = options[opt];
            const result2 = value === void 0 || validator2(value, opt, options);
            if (result2 !== true) {
              throw new AxiosError("option " + opt + " must be " + result2, AxiosError.ERR_BAD_OPTION_VALUE);
            }
            continue;
          }
          if (allowUnknown !== true) {
            throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
          }
        }
      }
      const validator = {
        assertOptions,
        validators: validators$1
      };
      const validators = validator.validators;
      class Axios {
        constructor(instanceConfig) {
          this.defaults = instanceConfig;
          this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
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
              Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : dummy = new Error();
              const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
              if (!err.stack) {
                err.stack = stack;
              } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
                err.stack += "\n" + stack;
              }
            }
            throw err;
          }
        }
        _request(configOrUrl, config) {
          if (typeof configOrUrl === "string") {
            config = config || {};
            config.url = configOrUrl;
          } else {
            config = configOrUrl || {};
          }
          config = mergeConfig(this.defaults, config);
          const { transitional, paramsSerializer, headers } = config;
          if (transitional !== void 0) {
            validator.assertOptions(transitional, {
              silentJSONParsing: validators.transitional(validators.boolean),
              forcedJSONParsing: validators.transitional(validators.boolean),
              clarifyTimeoutError: validators.transitional(validators.boolean)
            }, false);
          }
          if (paramsSerializer != null) {
            if (utils$6.isFunction(paramsSerializer)) {
              config.paramsSerializer = {
                serialize: paramsSerializer
              };
            } else {
              validator.assertOptions(paramsSerializer, {
                encode: validators.function,
                serialize: validators.function
              }, true);
            }
          }
          config.method = (config.method || this.defaults.method || "get").toLowerCase();
          let contextHeaders = headers && utils$6.merge(
            headers.common,
            headers[config.method]
          );
          headers && utils$6.forEach(
            ["delete", "get", "head", "post", "put", "patch", "common"],
            (method2) => {
              delete headers[method2];
            }
          );
          config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
          const requestInterceptorChain = [];
          let synchronousRequestInterceptors = true;
          this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
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
            const chain2 = [dispatchRequest.bind(this), void 0];
            chain2.unshift.apply(chain2, requestInterceptorChain);
            chain2.push.apply(chain2, responseInterceptorChain);
            len = chain2.length;
            promise = Promise.resolve(config);
            while (i < len) {
              promise = promise.then(chain2[i++], chain2[i++]);
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
            promise = dispatchRequest.call(this, newConfig);
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
          config = mergeConfig(this.defaults, config);
          const fullPath = buildFullPath(config.baseURL, config.url);
          return buildURL$2(fullPath, config.params, config.paramsSerializer);
        }
      }
      utils$6.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method2) {
        Axios.prototype[method2] = function(url, config) {
          return this.request(mergeConfig(config || {}, {
            method: method2,
            url,
            data: (config || {}).data
          }));
        };
      });
      utils$6.forEach(["post", "put", "patch"], function forEachMethodWithData(method2) {
        function generateHTTPMethod(isForm) {
          return function httpMethod(url, data, config) {
            return this.request(mergeConfig(config || {}, {
              method: method2,
              headers: isForm ? {
                "Content-Type": "multipart/form-data"
              } : {},
              url,
              data
            }));
          };
        }
        Axios.prototype[method2] = generateHTTPMethod();
        Axios.prototype[method2 + "Form"] = generateHTTPMethod(true);
      });
      const Axios$1 = Axios;
      class CancelToken {
        constructor(executor) {
          if (typeof executor !== "function") {
            throw new TypeError("executor must be a function.");
          }
          let resolvePromise;
          this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
          });
          const token = this;
          this.promise.then((cancel) => {
            if (!token._listeners)
              return;
            let i = token._listeners.length;
            while (i-- > 0) {
              token._listeners[i](cancel);
            }
            token._listeners = null;
          });
          this.promise.then = (onfulfilled) => {
            let _resolve;
            const promise = new Promise((resolve) => {
              token.subscribe(resolve);
              _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject2() {
              token.unsubscribe(_resolve);
            };
            return promise;
          };
          executor(function cancel(message, config, request) {
            if (token.reason) {
              return;
            }
            token.reason = new CanceledError(message, config, request);
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
      const CancelToken$1 = CancelToken;
      function spread(callback) {
        return function wrap2(arr) {
          return callback.apply(null, arr);
        };
      }
      function isAxiosError(payload) {
        return utils$6.isObject(payload) && payload.isAxiosError === true;
      }
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
        NetworkAuthenticationRequired: 511
      };
      Object.entries(HttpStatusCode).forEach(([key, value]) => {
        HttpStatusCode[value] = key;
      });
      const HttpStatusCode$1 = HttpStatusCode;
      function createInstance(defaultConfig) {
        const context = new Axios$1(defaultConfig);
        const instance = bind$2(Axios$1.prototype.request, context);
        utils$6.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
        utils$6.extend(instance, context, null, { allOwnKeys: true });
        instance.create = function create2(instanceConfig) {
          return createInstance(mergeConfig(defaultConfig, instanceConfig));
        };
        return instance;
      }
      const axios = createInstance(defaults$1);
      axios.Axios = Axios$1;
      axios.CanceledError = CanceledError;
      axios.CancelToken = CancelToken$1;
      axios.isCancel = isCancel;
      axios.VERSION = VERSION;
      axios.toFormData = toFormData;
      axios.AxiosError = AxiosError;
      axios.Cancel = axios.CanceledError;
      axios.all = function all(promises) {
        return Promise.all(promises);
      };
      axios.spread = spread;
      axios.isAxiosError = isAxiosError;
      axios.mergeConfig = mergeConfig;
      axios.AxiosHeaders = AxiosHeaders$1;
      axios.formToJSON = (thing) => formDataToJSON(utils$6.isHTMLForm(thing) ? new FormData(thing) : thing);
      axios.getAdapter = adapters.getAdapter;
      axios.HttpStatusCode = HttpStatusCode$1;
      axios.default = axios;
      function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
      }
      function gmxhr() {
        this.type = null;
        this.url = null;
        this.async = null;
        this.username = null;
        this.password = null;
        this.status = null;
        this.headers = {};
        this.readyState = null;
      }
      gmxhr.prototype.abort = function() {
        this.readyState = 0;
      };
      gmxhr.prototype.getAllResponseHeaders = function(name) {
        if (this.readyState != 4)
          return "";
        return this.responseHeaders;
      };
      gmxhr.prototype.getResponseHeader = function(header) {
        var value = null;
        if (this.responseHeaders) {
          var regex = new RegExp("^" + header + ": (.*)$", "igm");
          var match = regex.exec(this.responseHeaders);
          var result2 = [];
          while (match != null) {
            result2.push(match[1]);
            match = regex.exec(this.responseHeaders);
          }
          if (result2.length > 0) {
            value = result2.join(", ");
          }
        }
        return value;
      };
      gmxhr.prototype.open = function(type, url, async, username, password) {
        this.type = type ? type : null;
        this.url = url ? url : null;
        this.async = async ? async : null;
        this.username = username ? username : null;
        this.password = password ? password : null;
        this.readyState = 1;
      };
      gmxhr.prototype.setRequestHeader = function(name, value) {
        this.headers[name] = value;
      };
      gmxhr.prototype.send = function(data) {
        this.data = data;
        var that = this;
        var agent = typeof GM_xmlhttpRequest === "undefined" ? GM.xmlHttpRequest : GM_xmlhttpRequest;
        agent({
          method: this.type,
          url: this.url,
          headers: this.headers,
          data: this.data,
          onload: function(rsp) {
            var responseKeys = ["readyState", "responseHeaders", "finalUrl", "status", "statusText", "response", "responseText"];
            for (var k in responseKeys) {
              if (rsp.hasOwnProperty(responseKeys[k]))
                that[responseKeys[k]] = rsp[responseKeys[k]];
            }
            that.onreadystatechange();
          },
          onerror: function(rsp) {
            var responseKeys = ["readyState", "responseHeaders", "finalUrl", "status", "statusText", "response", "responseText"];
            for (var k in responseKeys) {
              if (rsp.hasOwnProperty(responseKeys[k]))
                that[responseKeys[k]] = rsp[responseKeys[k]];
            }
            that.onreadystatechange();
          }
        });
      };
      var gmxhr_1 = gmxhr;
      var bind$1 = function bind2(fn, thisArg) {
        return function wrap2() {
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          return fn.apply(thisArg, args);
        };
      };
      var bind = bind$1;
      var toString = Object.prototype.toString;
      function isArray(val) {
        return toString.call(val) === "[object Array]";
      }
      function isArrayBuffer(val) {
        return toString.call(val) === "[object ArrayBuffer]";
      }
      function isFormData(val) {
        return typeof FormData !== "undefined" && val instanceof FormData;
      }
      function isArrayBufferView(val) {
        var result2;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          result2 = ArrayBuffer.isView(val);
        } else {
          result2 = val && val.buffer && val.buffer instanceof ArrayBuffer;
        }
        return result2;
      }
      function isString(val) {
        return typeof val === "string";
      }
      function isNumber(val) {
        return typeof val === "number";
      }
      function isUndefined(val) {
        return typeof val === "undefined";
      }
      function isObject(val) {
        return val !== null && typeof val === "object";
      }
      function isDate(val) {
        return toString.call(val) === "[object Date]";
      }
      function isFile(val) {
        return toString.call(val) === "[object File]";
      }
      function isBlob(val) {
        return toString.call(val) === "[object Blob]";
      }
      function isFunction(val) {
        return toString.call(val) === "[object Function]";
      }
      function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
      }
      function isURLSearchParams(val) {
        return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
      }
      function trim(str) {
        return str.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function isStandardBrowserEnv() {
        return typeof window !== "undefined" && typeof document !== "undefined" && typeof document.createElement === "function";
      }
      function forEach(obj, fn) {
        if (obj === null || typeof obj === "undefined") {
          return;
        }
        if (typeof obj !== "object" && !isArray(obj)) {
          obj = [obj];
        }
        if (isArray(obj)) {
          for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              fn.call(null, obj[key], key, obj);
            }
          }
        }
      }
      function merge() {
        var result2 = {};
        function assignValue2(val, key) {
          if (typeof result2[key] === "object" && typeof val === "object") {
            result2[key] = merge(result2[key], val);
          } else {
            result2[key] = val;
          }
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue2);
        }
        return result2;
      }
      function extend(a, b, thisArg) {
        forEach(b, function assignValue2(val, key) {
          if (thisArg && typeof val === "function") {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        });
        return a;
      }
      var utils$4 = {
        isArray,
        isArrayBuffer,
        isFormData,
        isArrayBufferView,
        isString,
        isNumber,
        isObject,
        isUndefined,
        isDate,
        isFile,
        isBlob,
        isFunction,
        isStream,
        isURLSearchParams,
        isStandardBrowserEnv,
        forEach,
        merge,
        extend,
        trim
      };
      var enhanceError$1 = function enhanceError2(error, config, code, response) {
        error.config = config;
        if (code) {
          error.code = code;
        }
        error.response = response;
        return error;
      };
      var enhanceError = enhanceError$1;
      var createError$2 = function createError2(message, config, code, response) {
        var error = new Error(message);
        return enhanceError(error, config, code, response);
      };
      var createError$1 = createError$2;
      var settle$1 = function settle2(resolve, reject2, response) {
        var validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject2(createError$1(
            "Request failed with status code " + response.status,
            response.config,
            null,
            response
          ));
        }
      };
      var utils$3 = utils$4;
      function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      var buildURL$1 = function buildURL2(url, params, paramsSerializer) {
        if (!params) {
          return url;
        }
        var serializedParams;
        if (paramsSerializer) {
          serializedParams = paramsSerializer(params);
        } else if (utils$3.isURLSearchParams(params)) {
          serializedParams = params.toString();
        } else {
          var parts = [];
          utils$3.forEach(params, function serialize(val, key) {
            if (val === null || typeof val === "undefined") {
              return;
            }
            if (utils$3.isArray(val)) {
              key = key + "[]";
            }
            if (!utils$3.isArray(val)) {
              val = [val];
            }
            utils$3.forEach(val, function parseValue(v) {
              if (utils$3.isDate(v)) {
                v = v.toISOString();
              } else if (utils$3.isObject(v)) {
                v = JSON.stringify(v);
              }
              parts.push(encode(key) + "=" + encode(v));
            });
          });
          serializedParams = parts.join("&");
        }
        if (serializedParams) {
          url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }
        return url;
      };
      var utils$2 = utils$4;
      var parseHeaders$1 = function parseHeaders2(headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
          return parsed;
        }
        utils$2.forEach(headers.split("\n"), function parser(line) {
          i = line.indexOf(":");
          key = utils$2.trim(line.substr(0, i)).toLowerCase();
          val = utils$2.trim(line.substr(i + 1));
          if (key) {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        });
        return parsed;
      };
      var utils$1 = utils$4;
      var isURLSameOrigin$1 = utils$1.isStandardBrowserEnv() ? (
        // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement("a");
          var originURL;
          function resolveURL(url) {
            var href = url;
            if (msie) {
              urlParsingNode.setAttribute("href", href);
              href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute("href", href);
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
            };
          }
          originURL = resolveURL(window.location.href);
          return function isURLSameOrigin2(requestURL) {
            var parsed = utils$1.isString(requestURL) ? resolveURL(requestURL) : requestURL;
            return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
          };
        }()
      ) : (
        // Non standard browser envs (web workers, react-native) lack needed support.
        /* @__PURE__ */ function nonStandardBrowserEnv() {
          return function isURLSameOrigin2() {
            return true;
          };
        }()
      );
      var btoa_1;
      var hasRequiredBtoa;
      function requireBtoa() {
        if (hasRequiredBtoa)
          return btoa_1;
        hasRequiredBtoa = 1;
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        function E() {
          this.message = "String contains an invalid character";
        }
        E.prototype = new Error();
        E.prototype.code = 5;
        E.prototype.name = "InvalidCharacterError";
        function btoa2(input) {
          var str = String(input);
          var output = "";
          for (
            var block, charCode, idx = 0, map2 = chars;
            // if the next str index does not exist:
            //   change the mapping table to "="
            //   check if d has no fractional digits
            str.charAt(idx | 0) || (map2 = "=", idx % 1);
            // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
            output += map2.charAt(63 & block >> 8 - idx % 1 * 8)
          ) {
            charCode = str.charCodeAt(idx += 3 / 4);
            if (charCode > 255) {
              throw new E();
            }
            block = block << 8 | charCode;
          }
          return output;
        }
        btoa_1 = btoa2;
        return btoa_1;
      }
      var cookies;
      var hasRequiredCookies;
      function requireCookies() {
        if (hasRequiredCookies)
          return cookies;
        hasRequiredCookies = 1;
        var utils2 = utils$4;
        cookies = utils2.isStandardBrowserEnv() ? (
          // Standard browser envs support document.cookie
          /* @__PURE__ */ function standardBrowserEnv() {
            return {
              write: function write(name, value, expires, path, domain, secure) {
                var cookie = [];
                cookie.push(name + "=" + encodeURIComponent(value));
                if (utils2.isNumber(expires)) {
                  cookie.push("expires=" + new Date(expires).toGMTString());
                }
                if (utils2.isString(path)) {
                  cookie.push("path=" + path);
                }
                if (utils2.isString(domain)) {
                  cookie.push("domain=" + domain);
                }
                if (secure === true) {
                  cookie.push("secure");
                }
                document.cookie = cookie.join("; ");
              },
              read: function read(name) {
                var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
                return match ? decodeURIComponent(match[3]) : null;
              },
              remove: function remove2(name) {
                this.write(name, "", Date.now() - 864e5);
              }
            };
          }()
        ) : (
          // Non standard browser env (web workers, react-native) lack needed support.
          /* @__PURE__ */ function nonStandardBrowserEnv() {
            return {
              write: function write() {
              },
              read: function read() {
                return null;
              },
              remove: function remove2() {
              }
            };
          }()
        );
        return cookies;
      }
      var GmXhr = gmxhr_1;
      var utils = utils$4;
      var settle = settle$1;
      var buildURL = buildURL$1;
      var parseHeaders = parseHeaders$1;
      var isURLSameOrigin = isURLSameOrigin$1;
      var createError = createError$2;
      var btoa$1 = typeof window !== "undefined" && window.btoa && window.btoa.bind(window) || requireBtoa();
      var gm = function gmAdapter(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject2) {
          var requestData = config.data;
          var requestHeaders = config.headers;
          if (utils.isFormData(requestData)) {
            delete requestHeaders["Content-Type"];
          }
          var request = new GmXhr();
          var loadEvent = "onreadystatechange";
          var xDomain = false;
          if (typeof window !== "undefined" && window.XDomainRequest && !("withCredentials" in request) && !isURLSameOrigin(config.url)) {
            request = new window.XDomainRequest();
            loadEvent = "onload";
            xDomain = true;
            request.onprogress = function handleProgress() {
            };
            request.ontimeout = function handleTimeout() {
            };
          }
          if (config.auth) {
            var username = config.auth.username || "";
            var password = config.auth.password || "";
            requestHeaders.Authorization = "Basic " + btoa$1(username + ":" + password);
          }
          request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
          request.timeout = config.timeout;
          request[loadEvent] = function handleLoad() {
            if (!request || request.readyState !== 4 && !xDomain) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
            var responseData = !config.responseType || config.responseType === "text" ? request.responseText : request.response;
            var response = {
              data: responseData,
              // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
              status: request.status === 1223 ? 204 : request.status,
              statusText: request.status === 1223 ? "No Content" : request.statusText,
              headers: responseHeaders,
              config,
              request
            };
            settle(resolve, reject2, response);
            request = null;
          };
          request.onerror = function handleError() {
            reject2(createError("Network Error", config));
            request = null;
          };
          request.ontimeout = function handleTimeout() {
            reject2(createError("timeout of " + config.timeout + "ms exceeded", config, "ECONNABORTED"));
            request = null;
          };
          if (utils.isStandardBrowserEnv()) {
            var cookies2 = requireCookies();
            var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies2.read(config.xsrfCookieName) : void 0;
            if (xsrfValue) {
              requestHeaders[config.xsrfHeaderName] = xsrfValue;
            }
          }
          if ("setRequestHeader" in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
              if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
                delete requestHeaders[key];
              } else {
                request.setRequestHeader(key, val);
              }
            });
          }
          if (config.withCredentials) {
            request.withCredentials = true;
          }
          if (config.responseType) {
            try {
              request.responseType = config.responseType;
            } catch (e) {
              if (request.responseType !== "json") {
                throw e;
              }
            }
          }
          if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", config.onDownloadProgress);
          }
          if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", config.onUploadProgress);
          }
          if (config.cancelToken) {
            config.cancelToken.promise.then(function onCanceled(cancel) {
              if (!request) {
                return;
              }
              request.abort();
              reject2(cancel);
              request = null;
            });
          }
          if (requestData === void 0) {
            requestData = null;
          }
          request.send(requestData);
        });
      };
      const adapter = /* @__PURE__ */ getDefaultExportFromCjs(gm);
      function createAxios() {
        const instance = axios.create({
          adapter
        });
        return instance;
      }
      const service = createAxios();
      const _hoisted_1 = { class: "fixed top-4 left-4" };
      const _sfc_main = /* @__PURE__ */ vue.defineComponent({
        __name: "App",
        setup(__props) {
          const watchValue = useLocalStorage("watchValue", 0.7);
          const latestMinValue = useLocalStorage("latestMinValue", 0);
          function getList() {
            const trList = Array.from(
              document.querySelectorAll(".table-container tr")
            ).slice(1);
            const result2 = trList.map((tr) => {
              const [
                order,
                name,
                日成交量,
                最低售价,
                最优寄售,
                最优求购,
                稳定求购,
                近期成交,
                交易平台,
                lalla,
                更新时间
              ] = Array.from(tr.querySelectorAll("td")).map((td) => td.innerText);
              const platformLink = encodeURI(
                Array.from(tr.querySelectorAll("td"))[8].querySelector("a").getAttribute("href")
              );
              const steamLink = encodeURI(
                Array.from(tr.querySelectorAll("td"))[9].querySelector("a").getAttribute("href")
              );
              return {
                order,
                name,
                日成交量,
                最低售价,
                最优寄售,
                最优求购,
                稳定求购,
                近期成交,
                交易平台,
                steamLink,
                更新时间,
                platformLink
              };
            });
            const minItem = lodash.minBy(result2, (item) => +item.最优求购);
            const minValue = +minItem.最优求购;
            if (latestMinValue.value === minValue) {
              return false;
            }
            latestMinValue.value = minValue;
            const matchList = result2.filter((item) => +item.最优求购 < watchValue.value);
            if (watchValue.value > minValue) {
              service.post(
                "https://open.feishu.cn/open-apis/bot/v2/hook/bfa05bbb-d266-4a90-919a-b926d2555483",
                {
                  msg_type: "interactive",
                  card: {
                    config: {
                      wide_screen_mode: true
                    },
                    elements: lodash.chain(matchList).map((item) => [
                      {
                        tag: "div",
                        text: {
                          content: `[挂刀] 饰品[${item.name}](${item.steamLink}) 最优求购比例 **${item.最优求购}**`,
                          tag: "lark_md"
                        }
                      },
                      {
                        tag: "div",
                        fields: [
                          {
                            label: "平台",
                            value: `[${item.交易平台}](${item.platformLink})`
                          },
                          {
                            label: "挂刀站",
                            value: `[iflow.work](${location.href})`
                          },
                          { label: "日成交量", value: item.日成交量 },
                          { label: "最低售价", value: item.最低售价 },
                          { label: "最优寄售", value: item.最优寄售 },
                          { label: "最优求购", value: item.最优求购 },
                          { label: "稳定求购", value: item.稳定求购 },
                          { label: "近期成交", value: item.近期成交 }
                        ].map((item2) => ({
                          is_short: true,
                          // 并排布局
                          text: {
                            tag: "lark_md",
                            content: `${item2.label}:**${item2.value}**`
                          }
                        }))
                      },
                      {
                        tag: "hr"
                      }
                    ]).flatten().initial().value(),
                    header: {
                      template: "blue",
                      title: {
                        content: "饰品信息",
                        tag: "plain_text"
                      }
                    }
                  }
                }
              ).then((res) => {
                console.log(res.data);
              });
            }
            return result2;
          }
          vue.onMounted(() => {
            getList();
            setTimeout(() => {
              document.querySelector("#applySortBtn").click();
            }, 1e3 * 30);
          });
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              vue.withDirectives(vue.createElementVNode("input", {
                class: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                type: "number",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(watchValue) ? watchValue.value = $event : null),
                placeholder: "最小最优求购"
              }, null, 512), [
                [
                  vue.vModelText,
                  vue.unref(watchValue),
                  void 0,
                  { number: true }
                ]
              ])
            ]);
          };
        }
      });
      var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
      (() => {
        var xs = Object.defineProperty;
        var ys = (e, t) => {
          for (var r in t)
            xs(e, r, { get: t[r], enumerable: true });
        };
        function re(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function Q(e) {
          let t = e.length, r = -1, n, o = "", i = e.charCodeAt(0);
          for (; ++r < t; ) {
            if (n = e.charCodeAt(r), n === 0) {
              o += "�";
              continue;
            }
            if (n === 37) {
              o += "\\%";
              continue;
            }
            if (n === 44) {
              o += "\\,";
              continue;
            }
            if (n >= 1 && n <= 31 || n === 127 || r === 0 && n >= 48 && n <= 57 || r === 1 && n >= 48 && n <= 57 && i === 45) {
              o += `\\${n.toString(16)} `;
              continue;
            }
            if (r === 0 && t === 1 && n === 45) {
              o += `\\${e.charAt(r)}`;
              continue;
            }
            if (n >= 128 || n === 45 || n === 95 || n >= 48 && n <= 57 || n >= 65 && n <= 90 || n >= 97 && n <= 122) {
              o += e.charAt(r);
              continue;
            }
            o += `\\${e.charAt(r)}`;
          }
          return o;
        }
        var Ze = Q;
        function _(e = []) {
          return Array.isArray(e) ? e : [e];
        }
        function be(e) {
          return Array.from(new Set(e));
        }
        function wn(e, t) {
          return e.reduce(
            (r, n) => (r.findIndex((i) => t(n, i)) === -1 && r.push(n), r),
            []
          );
        }
        function O(e) {
          return typeof e == "string";
        }
        function xe(e) {
          return O(e) ? e : (Array.isArray(e) ? e : Object.entries(e)).filter((t) => t[1] != null);
        }
        function $n(e) {
          return Array.isArray(e) ? e.find((t) => !Array.isArray(t) || Array.isArray(t[0])) ? e.map((t) => xe(t)) : [e] : [xe(e)];
        }
        function vs(e) {
          return e.filter(([t, r], n) => {
            if (t.startsWith("$$"))
              return false;
            for (let o = n - 1; o >= 0; o--)
              if (e[o][0] === t && e[o][1] === r)
                return false;
            return true;
          });
        }
        function ye(e) {
          return e == null ? "" : vs(e).map(([t, r]) => r != null ? `${t}:${r};` : void 0).filter(Boolean).join("");
        }
        function Je(e) {
          return e && typeof e == "object" && !Array.isArray(e);
        }
        function Or(e, t, r = false) {
          let n = e, o = t;
          if (Array.isArray(o))
            return r && Array.isArray(o) ? [...n, ...o] : [...o];
          let i = { ...n };
          return Je(n) && Je(o) && Object.keys(o).forEach((a) => {
            Je(n[a]) && Je(o[a]) || Array.isArray(n[a]) && Array.isArray(o[a]) ? i[a] = Or(n[a], o[a], r) : Object.assign(i, { [a]: o[a] });
          }), i;
        }
        function ze(e) {
          let t, r, n;
          if (Array.isArray(e)) {
            for (r = Array(t = e.length); t--; )
              r[t] = (n = e[t]) && typeof n == "object" ? ze(n) : n;
            return r;
          }
          if (Object.prototype.toString.call(e) === "[object Object]") {
            r = {};
            for (t in e)
              t === "__proto__" ? Object.defineProperty(r, t, {
                value: ze(e[t]),
                configurable: true,
                enumerable: true,
                writable: true
              }) : r[t] = (n = e[t]) && typeof n == "object" ? ze(n) : n;
            return r;
          }
          return e;
        }
        function kn(e) {
          return O(e[0]);
        }
        function Sn(e) {
          return O(e[0]);
        }
        var ws = /^\[(.+?)~?="(.*)"\]$/;
        var $s = /[\w\u00A0-\uFFFF-_:%-?]/, Ar = "$$shortcut-no-merge";
        function Cn(e) {
          return e.match(ws);
        }
        function Oe(e = "") {
          return $s.test(e);
        }
        function Rn(e) {
          return typeof e == "function" ? { match: e } : e;
        }
        function Vr(e) {
          return e.length === 3;
        }
        function Tn(e) {
          return e != null;
        }
        function En() {
        }
        var Qe = class {
          constructor() {
            __publicField(this, "_map", /* @__PURE__ */ new Map());
          }
          get(t, r) {
            let n = this._map.get(t);
            if (n)
              return n.get(r);
          }
          getFallback(t, r, n) {
            let o = this._map.get(t);
            return o || (o = /* @__PURE__ */ new Map(), this._map.set(t, o)), o.has(r) || o.set(r, n), o.get(r);
          }
          set(t, r, n) {
            let o = this._map.get(t);
            return o || (o = /* @__PURE__ */ new Map(), this._map.set(t, o)), o.set(r, n), this;
          }
          has(t, r) {
            var _a2;
            return (_a2 = this._map.get(t)) == null ? void 0 : _a2.has(r);
          }
          delete(t, r) {
            var _a2;
            return ((_a2 = this._map.get(t)) == null ? void 0 : _a2.delete(r)) || false;
          }
          deleteTop(t) {
            return this._map.delete(t);
          }
          map(t) {
            return Array.from(this._map.entries()).flatMap(
              ([r, n]) => Array.from(n.entries()).map(([o, i]) => t(i, r, o))
            );
          }
        };
        var Ae = class extends Set {
          constructor(t) {
            super(t);
            __publicField(this, "_map");
            this._map ?? (this._map = /* @__PURE__ */ new Map());
          }
          add(t) {
            return this._map ?? (this._map = /* @__PURE__ */ new Map()), this._map.set(t, (this._map.get(t) ?? 0) + 1), super.add(t);
          }
          delete(t) {
            return this._map.delete(t), super.delete(t);
          }
          clear() {
            this._map.clear(), super.clear();
          }
          getCount(t) {
            return this._map.get(t) ?? 0;
          }
          setCount(t, r) {
            return this._map.set(t, r), super.add(t);
          }
        };
        function et(e) {
          return e instanceof Ae;
        }
        var tt = {};
        function ks(e = ["-", ":"]) {
          let t = e.join("|");
          return tt[t] || (tt[t] = new RegExp(
            `((?:[!@<~\\w+:_/-]|\\[&?>?:?\\S*\\])+?)(${t})\\(((?:[~!<>\\w\\s:/\\\\,%#.$?-]|\\[.*?\\])+?)\\)(?!\\s*?=>)`,
            "gm"
          )), tt[t].lastIndex = 0, tt[t];
        }
        function Ss(e, t = ["-", ":"], r = 5) {
          let n = ks(t), o, i = e.toString(), a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
          do
            o = false, i = i.replace(n, (f, u, p, d, h) => {
              var _a2;
              if (!t.includes(p))
                return f;
              o = true, a.add(u + p);
              let x = h + u.length + p.length + 1, $ = { length: f.length, items: [] };
              s.set(h, $);
              for (let y of [...d.matchAll(/\S+/g)]) {
                let C = x + y.index, b = (_a2 = s.get(C)) == null ? void 0 : _a2.items;
                b ? s.delete(C) : b = [{ offset: C, length: y[0].length, className: y[0] }];
                for (let R of b)
                  R.className = R.className === "~" ? u : R.className.replace(/^(!?)(.*)/, `$1${u}${p}$2`), $.items.push(R);
              }
              return "$".repeat(f.length);
            }), r -= 1;
          while (o && r);
          let c;
          if (typeof e == "string") {
            c = "";
            let f = 0;
            for (let [u, p] of s)
              c += e.slice(f, u), c += p.items.map((d) => d.className).join(" "), f = u + p.length;
            c += e.slice(f);
          } else {
            c = e;
            for (let [f, u] of s)
              c.overwrite(f, f + u.length, u.items.map((p) => p.className).join(" "));
          }
          return {
            prefixes: Array.from(a),
            hasChanged: o,
            groupsByOffset: s,
            get expanded() {
              return c.toString();
            }
          };
        }
        function jn(e, t = ["-", ":"], r = 5) {
          let n = Ss(e, t, r);
          return typeof e == "string" ? n.expanded : e;
        }
        var zn = /* @__PURE__ */ new Set();
        function ne(e) {
          zn.has(e) || (console.warn("[unocss]", e), zn.add(e));
        }
        var rt = /[\\:]?[\s'"`;{}]+/g;
        function Cs(e) {
          return e.split(rt);
        }
        var nt = {
          name: "@unocss/core/extractor-split",
          order: 0,
          extract({ code: e }) {
            return Cs(e);
          }
        };
        function On() {
          return {
            events: {},
            emit(e, ...t) {
              (this.events[e] || []).forEach((r) => r(...t));
            },
            on(e, t) {
              return (this.events[e] = this.events[e] || []).push(t), () => this.events[e] = (this.events[e] || []).filter((r) => r !== t);
            }
          };
        }
        var ot = "default", it = "preflights", Rs = "shortcuts", Ts = "imports", An = { [Ts]: -200, [it]: -100, [Rs]: -10, [ot]: 0 };
        function _n(e) {
          return _(e).flatMap((t) => Array.isArray(t) ? [t] : Object.entries(t));
        }
        var Vn = "_uno_resolved";
        function Es(e) {
          var _a2;
          let t = typeof e == "function" ? e() : e;
          if (Vn in t)
            return t;
          t = { ...t }, Object.defineProperty(t, Vn, { value: true, enumerable: false });
          let r = t.shortcuts ? _n(t.shortcuts) : void 0;
          if (t.shortcuts = r, t.prefix || t.layer) {
            let n = (o) => {
              o[2] || (o[2] = {});
              let i = o[2];
              i.prefix == null && t.prefix && (i.prefix = _(t.prefix)), i.layer == null && t.layer && (i.layer = t.layer);
            };
            r == null ? void 0 : r.forEach(n), (_a2 = t.rules) == null ? void 0 : _a2.forEach(n);
          }
          return t;
        }
        function Pn(e) {
          let t = Es(e);
          if (!t.presets)
            return [t];
          let r = (t.presets || []).flatMap(_).flatMap(Pn);
          return [t, ...r];
        }
        function _r(e = {}, t = {}) {
          var _a2, _b;
          let r = Object.assign({}, t, e), n = wn(
            (r.presets || []).flatMap(_).flatMap(Pn),
            (m, w) => m.name === w.name
          ), o = [
            ...n.filter((m) => m.enforce === "pre"),
            ...n.filter((m) => !m.enforce),
            ...n.filter((m) => m.enforce === "post")
          ], i = [...o, r], a = [...i].reverse(), s = Object.assign({}, An, ...i.map((m) => m.layers));
          function c(m) {
            return be(i.flatMap((w) => _(w[m] || [])));
          }
          let f = c("extractors"), u = (_a2 = a.find((m) => m.extractorDefault !== void 0)) == null ? void 0 : _a2.extractorDefault;
          u === void 0 && (u = nt), u && !f.includes(u) && f.unshift(u), f.sort((m, w) => (m.order || 0) - (w.order || 0));
          let p = c("rules"), d = {}, h = p.length, x = p.map((m, w) => {
            var _a3;
            if (kn(m)) {
              _(((_a3 = m[2]) == null ? void 0 : _a3.prefix) || "").forEach((W) => {
                d[W + m[0]] = [w, m[1], m[2], m];
              });
              return;
            }
            return [w, ...m];
          }).filter(Boolean).reverse(), $ = js(i.map((m) => m.theme)), y = c("extendTheme");
          for (let m of y)
            $ = m($) || $;
          let C = {
            templates: be(i.flatMap((m) => {
              var _a3;
              return _((_a3 = m.autocomplete) == null ? void 0 : _a3.templates);
            })),
            extractors: i.flatMap((m) => {
              var _a3;
              return _((_a3 = m.autocomplete) == null ? void 0 : _a3.extractors);
            }).sort((m, w) => (m.order || 0) - (w.order || 0)),
            shorthands: zs(i.map((m) => {
              var _a3;
              return ((_a3 = m.autocomplete) == null ? void 0 : _a3.shorthands) || {};
            }))
          }, b = c("separators");
          b.length || (b = [":", "-"]);
          let R = {
            mergeSelectors: true,
            warn: true,
            sortLayers: (m) => m,
            ...r,
            blocklist: c("blocklist"),
            presets: o,
            envMode: r.envMode || "build",
            shortcutsLayer: r.shortcutsLayer || "shortcuts",
            layers: s,
            theme: $,
            rulesSize: h,
            rulesDynamic: x,
            rulesStaticMap: d,
            preprocess: c("preprocess"),
            postprocess: c("postprocess"),
            preflights: c("preflights"),
            autocomplete: C,
            variants: c("variants").map(Rn).sort((m, w) => (m.order || 0) - (w.order || 0)),
            shortcuts: _n(c("shortcuts")).reverse(),
            extractors: f,
            safelist: c("safelist"),
            separators: b,
            details: r.details ?? r.envMode === "dev"
          };
          for (let m of i)
            (_b = m == null ? void 0 : m.configResolved) == null ? void 0 : _b.call(m, R);
          return R;
        }
        function js(e) {
          return e.map((t) => t ? ze(t) : {}).reduce((t, r) => Or(t, r), {});
        }
        function zs(e) {
          return e.reduce((t, r) => {
            let n = {};
            for (let o in r) {
              let i = r[o];
              Array.isArray(i) ? n[o] = `(${i.join("|")})` : n[o] = i;
            }
            return { ...t, ...n };
          }, {});
        }
        var Mn = "0.58.3";
        var Pr = class {
          constructor(t = {}, r = {}) {
            __publicField(this, "version", Mn);
            __publicField(this, "_cache", /* @__PURE__ */ new Map());
            __publicField(this, "config");
            __publicField(this, "blocked", /* @__PURE__ */ new Set());
            __publicField(this, "parentOrders", /* @__PURE__ */ new Map());
            __publicField(this, "events", On());
            this.userConfig = t;
            this.defaults = r;
            this.config = _r(t, r), this.events.emit("config", this.config);
          }
          setConfig(t, r) {
            t && (r && (this.defaults = r), this.userConfig = t, this.blocked.clear(), this.parentOrders.clear(), this._cache.clear(), this.config = _r(t, this.defaults), this.events.emit("config", this.config));
          }
          async applyExtractors(t, r, n = /* @__PURE__ */ new Set()) {
            var _a2;
            let o = {
              original: t,
              code: t,
              id: r,
              extracted: n,
              envMode: this.config.envMode
            };
            for (let i of this.config.extractors) {
              let a = await ((_a2 = i.extract) == null ? void 0 : _a2.call(i, o));
              if (a)
                if (et(a) && et(n))
                  for (let s of a)
                    n.setCount(s, n.getCount(s) + a.getCount(s));
                else
                  for (let s of a)
                    n.add(s);
            }
            return n;
          }
          makeContext(t, r) {
            let n = {
              rawSelector: t,
              currentSelector: r[1],
              theme: this.config.theme,
              generator: this,
              variantHandlers: r[2],
              constructCSS: (...o) => this.constructCustomCSS(n, ...o),
              variantMatch: r
            };
            return n;
          }
          async parseToken(t, r) {
            var _a2;
            if (this.blocked.has(t))
              return;
            let n = `${t}${r ? ` ${r}` : ""}`;
            if (this._cache.has(n))
              return this._cache.get(n);
            let o = t;
            for (let f of this.config.preprocess)
              o = f(t);
            if (this.isBlocked(o)) {
              this.blocked.add(t), this._cache.set(n, null);
              return;
            }
            let i = await this.matchVariants(t, o);
            if (!i || this.isBlocked(i[1])) {
              this.blocked.add(t), this._cache.set(n, null);
              return;
            }
            let a = this.makeContext(t, [r || i[0], i[1], i[2], i[3]]);
            this.config.details && (a.variants = [...i[3]]);
            let s = await this.expandShortcut(a.currentSelector, a), c = s ? await this.stringifyShortcuts(a.variantMatch, a, s[0], s[1]) : (_a2 = await this.parseUtil(a.variantMatch, a)) == null ? void 0 : _a2.map((f) => this.stringifyUtil(f, a)).filter(Tn);
            if (c == null ? void 0 : c.length)
              return this._cache.set(n, c), c;
            this._cache.set(n, null);
          }
          async generate(t, r = {}) {
            let {
              id: n,
              scope: o,
              preflights: i = true,
              safelist: a = true,
              minify: s = false,
              extendedInfo: c = false
            } = r, f = O(t) ? await this.applyExtractors(t, n, c ? new Ae() : /* @__PURE__ */ new Set()) : Array.isArray(t) ? new Set(t) : t;
            a && this.config.safelist.forEach((m) => {
              f.has(m) || f.add(m);
            });
            let u = s ? "" : `
`, p = /* @__PURE__ */ new Set([ot]), d = c ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Map(), x = {}, $ = Array.from(f).map(async (m) => {
              var _a2;
              if (d.has(m))
                return;
              let w = await this.parseToken(m);
              if (w != null) {
                d instanceof Map ? d.set(m, { data: w, count: et(f) ? f.getCount(m) : -1 }) : d.add(m);
                for (let z of w) {
                  let W = z[3] || "", N = (_a2 = z[4]) == null ? void 0 : _a2.layer;
                  h.has(W) || h.set(W, []), h.get(W).push(z), N && p.add(N);
                }
              }
            });
            await Promise.all($), await (async () => {
              if (!i)
                return;
              let m = { generator: this, theme: this.config.theme }, w = /* @__PURE__ */ new Set([]);
              this.config.preflights.forEach(({ layer: z = it }) => {
                p.add(z), w.add(z);
              }), x = Object.fromEntries(
                await Promise.all(
                  Array.from(w).map(async (z) => {
                    let N = (await Promise.all(
                      this.config.preflights.filter((ce) => (ce.layer || it) === z).map(async (ce) => await ce.getCSS(m))
                    )).filter(Boolean).join(u);
                    return [z, N];
                  })
                )
              );
            })();
            let y = this.config.sortLayers(
              Array.from(p).sort(
                (m, w) => (this.config.layers[m] ?? 0) - (this.config.layers[w] ?? 0) || m.localeCompare(w)
              )
            ), C = {}, b = (m) => {
              if (C[m])
                return C[m];
              let w = Array.from(h).sort(
                (W, N) => {
                  var _a2;
                  return (this.parentOrders.get(W[0]) ?? 0) - (this.parentOrders.get(N[0]) ?? 0) || ((_a2 = W[0]) == null ? void 0 : _a2.localeCompare(N[0] || "")) || 0;
                }
              ).map(([W, N]) => {
                let ce = N.length, ge = N.filter((g) => {
                  var _a2;
                  return (((_a2 = g[4]) == null ? void 0 : _a2.layer) || ot) === m;
                }).sort(
                  (g, k) => {
                    var _a2, _b, _c2, _d, _e2, _f, _g;
                    return g[0] - k[0] || (((_a2 = g[4]) == null ? void 0 : _a2.sort) || 0) - (((_b = k[4]) == null ? void 0 : _b.sort) || 0) || ((_e2 = (_c2 = g[5]) == null ? void 0 : _c2.currentSelector) == null ? void 0 : _e2.localeCompare(
                      ((_d = k[5]) == null ? void 0 : _d.currentSelector) ?? ""
                    )) || ((_f = g[1]) == null ? void 0 : _f.localeCompare(k[1] || "")) || ((_g = g[2]) == null ? void 0 : _g.localeCompare(k[2] || "")) || 0;
                  }
                ).map(([, g, k, , E, , B]) => [
                  [[(g && Vs(g, o)) ?? "", (E == null ? void 0 : E.sort) ?? 0]],
                  k,
                  !!(B ?? (E == null ? void 0 : E.noMerge))
                ]);
                if (!ge.length)
                  return;
                let je = ge.reverse().map(([g, k, E], B) => {
                  if (!E && this.config.mergeSelectors)
                    for (let D = B + 1; D < ce; D++) {
                      let Z = ge[D];
                      if (Z && !Z[2] && (g && Z[0] || g == null && Z[0] == null) && Z[1] === k)
                        return g && Z[0] && Z[0].push(...g), null;
                    }
                  let K = g ? be(
                    g.sort(
                      (D, Z) => {
                        var _a2;
                        return D[1] - Z[1] || ((_a2 = D[0]) == null ? void 0 : _a2.localeCompare(Z[0] || "")) || 0;
                      }
                    ).map((D) => D[0]).filter(Boolean)
                  ) : [];
                  return K.length ? `${K.join(`,${u}`)}{${k}}` : k;
                }).filter(Boolean).reverse().join(u);
                if (!W)
                  return je;
                let Xe = W.split(" $$ ");
                return `${Xe.join("{")}{${u}${je}${u}${"}".repeat(Xe.length)}`;
              }).filter(Boolean).join(u);
              i && (w = [x[m], w].filter(Boolean).join(u));
              let z = s ? "" : `/* layer: ${m} */${u}`;
              return C[m] = w ? z + w : "";
            }, R = (m = y, w) => m.filter((z) => !(w == null ? void 0 : w.includes(z))).map((z) => b(z) || "").filter(Boolean).join(u);
            return {
              get css() {
                return R();
              },
              layers: y,
              matched: d,
              getLayers: R,
              getLayer: b
            };
          }
          async matchVariants(t, r) {
            let n = /* @__PURE__ */ new Set(), o = [], i = r || t, a = true, s = { rawSelector: t, theme: this.config.theme, generator: this };
            for (; a; ) {
              a = false;
              for (let c of this.config.variants) {
                if (!c.multiPass && n.has(c))
                  continue;
                let f = await c.match(i, s);
                if (f) {
                  if (O(f)) {
                    if (f === i)
                      continue;
                    f = { matcher: f };
                  }
                  i = f.matcher, o.unshift(f), n.add(c), a = true;
                  break;
                }
              }
              if (!a)
                break;
              if (o.length > 500)
                throw new Error(`Too many variants applied to "${t}"`);
            }
            return [t, i, o, n];
          }
          applyVariants(t, r = t[4], n = t[1]) {
            let i = r.slice().sort((f, u) => (f.order || 0) - (u.order || 0)).reduceRight(
              (f, u) => (p) => {
                var _a2, _b;
                let d = ((_a2 = u.body) == null ? void 0 : _a2.call(u, p.entries)) || p.entries, h = Array.isArray(u.parent) ? u.parent : [u.parent, void 0];
                return (u.handle ?? Ps)(
                  {
                    ...p,
                    entries: d,
                    selector: ((_b = u.selector) == null ? void 0 : _b.call(u, p.selector, d)) || p.selector,
                    parent: h[0] || p.parent,
                    parentOrder: h[1] || p.parentOrder,
                    layer: u.layer || p.layer,
                    sort: u.sort || p.sort
                  },
                  f
                );
              },
              (f) => f
            )({ prefix: "", selector: _s(n), pseudo: "", entries: t[2] }), { parent: a, parentOrder: s } = i;
            a != null && s != null && this.parentOrders.set(a, s);
            let c = {
              selector: [i.prefix, i.selector, i.pseudo].join(""),
              entries: i.entries,
              parent: a,
              layer: i.layer,
              sort: i.sort,
              noMerge: i.noMerge
            };
            for (let f of this.config.postprocess)
              f(c);
            return c;
          }
          constructCustomCSS(t, r, n) {
            let o = xe(r);
            if (O(o))
              return o;
            let {
              selector: i,
              entries: a,
              parent: s
            } = this.applyVariants([
              0,
              n || t.rawSelector,
              o,
              void 0,
              t.variantHandlers
            ]), c = `${i}{${ye(a)}}`;
            return s ? `${s}{${c}}` : c;
          }
          async parseUtil(t, r, n = false, o) {
            var _a2;
            let [i, a, s] = O(t) ? await this.matchVariants(t) : t;
            this.config.details && (r.rules = r.rules ?? []);
            let c = this.config.rulesStaticMap[a];
            if (c && c[1] && (n || !((_a2 = c[2]) == null ? void 0 : _a2.internal))) {
              this.config.details && r.rules.push(c[3]);
              let u = c[0], p = xe(c[1]), d = c[2];
              return O(p) ? [[u, p, d]] : [[u, i, p, d, s]];
            }
            r.variantHandlers = s;
            let { rulesDynamic: f } = this.config;
            for (let [u, p, d, h] of f) {
              if ((h == null ? void 0 : h.internal) && !n)
                continue;
              let x = a;
              if (h == null ? void 0 : h.prefix) {
                let b = _(h.prefix);
                if (o) {
                  let R = _(o);
                  if (!b.some((m) => R.includes(m)))
                    continue;
                } else {
                  let R = b.find((m) => a.startsWith(m));
                  if (R == null)
                    continue;
                  x = a.slice(R.length);
                }
              }
              let $ = x.match(p);
              if (!$)
                continue;
              let y = await d($, r);
              if (!y)
                continue;
              this.config.details && r.rules.push([p, d, h]);
              let C = $n(y).filter((b) => b.length);
              if (C.length)
                return C.map((b) => O(b) ? [u, b, h] : [u, i, b, h, s]);
            }
          }
          stringifyUtil(t, r) {
            if (!t)
              return;
            if (Vr(t))
              return [
                t[0],
                void 0,
                t[1],
                void 0,
                t[2],
                this.config.details ? r : void 0,
                void 0
              ];
            let {
              selector: n,
              entries: o,
              parent: i,
              layer: a,
              sort: s,
              noMerge: c
            } = this.applyVariants(t), f = ye(o);
            if (!f)
              return;
            let { layer: u, sort: p, ...d } = t[3] ?? {}, h = { ...d, layer: a ?? u, sort: s ?? p };
            return [t[0], n, f, i, h, this.config.details ? r : void 0, c];
          }
          async expandShortcut(t, r, n = 5) {
            var _a2;
            if (n === 0)
              return;
            let o = this.config.details ? (s) => {
              r.shortcuts = r.shortcuts ?? [], r.shortcuts.push(s);
            } : En, i, a;
            for (let s of this.config.shortcuts) {
              let c = t;
              if ((_a2 = s[2]) == null ? void 0 : _a2.prefix) {
                let u = _(s[2].prefix).find((p) => t.startsWith(p));
                if (u == null)
                  continue;
                c = t.slice(u.length);
              }
              if (Sn(s)) {
                if (s[0] === c) {
                  i = i || s[2], a = s[1], o(s);
                  break;
                }
              } else {
                let f = c.match(s[0]);
                if (f && (a = s[1](f, r)), a) {
                  i = i || s[2], o(s);
                  break;
                }
              }
            }
            if (O(a) && (a = jn(a.trim()).split(/\s+/g)), !a) {
              let [s, c] = O(t) ? await this.matchVariants(t) : t;
              if (s !== c) {
                let f = await this.expandShortcut(c, r, n - 1);
                f && (a = f[0].map((u) => O(u) ? s.replace(c, u) : u));
              }
            }
            if (a)
              return [
                (await Promise.all(
                  a.map(
                    async (s) => {
                      var _a3;
                      return (O(s) ? (_a3 = await this.expandShortcut(s, r, n - 1)) == null ? void 0 : _a3[0] : void 0) || [s];
                    }
                  )
                )).flat(1).filter(Boolean),
                i
              ];
          }
          async stringifyShortcuts(t, r, n, o = { layer: this.config.shortcutsLayer }) {
            var _a2;
            let i = new Qe(), a = (await Promise.all(
              be(n).map(async (u) => {
                let p = O(u) ? await this.parseUtil(u, r, true, o.prefix) : [[Number.POSITIVE_INFINITY, "{inline}", xe(u), void 0, []]];
                return !p && this.config.warn && ne(`unmatched utility "${u}" in shortcut "${t[1]}"`), p || [];
              })
            )).flat(1).filter(Boolean).sort((u, p) => u[0] - p[0]), [s, , c] = t, f = [];
            for (let u of a) {
              if (Vr(u)) {
                f.push([u[0], void 0, u[1], void 0, u[2], r, void 0]);
                continue;
              }
              let {
                selector: p,
                entries: d,
                parent: h,
                sort: x,
                noMerge: $
              } = this.applyVariants(u, [...u[4], ...c], s);
              i.getFallback(p, h, [[], u[0]])[0].push([
                d,
                !!($ ?? ((_a2 = u[3]) == null ? void 0 : _a2.noMerge)),
                x ?? 0
              ]);
            }
            return f.concat(
              i.map(([u, p], d, h) => {
                let x = (y, C, b) => {
                  let R = Math.max(...b.map((w) => w[1])), m = b.map((w) => w[0]);
                  return (y ? [m.flat(1)] : m).map((w) => {
                    let z = ye(w);
                    if (z)
                      return [p, d, z, h, { ...o, noMerge: C, sort: R }, r, void 0];
                  });
                };
                return [
                  [u.filter(([, y]) => y).map(([y, , C]) => [y, C]), true],
                  [u.filter(([, y]) => !y).map(([y, , C]) => [y, C]), false]
                ].map(([y, C]) => [
                  ...x(
                    false,
                    C,
                    y.filter(([b]) => b.some((R) => R[0] === Ar))
                  ),
                  ...x(
                    true,
                    C,
                    y.filter(([b]) => b.every((R) => R[0] !== Ar))
                  )
                ]);
              }).flat(2).filter(Boolean)
            );
          }
          isBlocked(t) {
            return !t || this.config.blocklist.some(
              (r) => typeof r == "function" ? r(t) : O(r) ? r === t : r.test(t)
            );
          }
        };
        function Un(e, t) {
          return new Pr(e, t);
        }
        var Ln = /\s\$\$\s+/g;
        function As(e) {
          return Ln.test(e);
        }
        function Vs(e, t) {
          return As(e) ? e.replace(Ln, t ? ` ${t} ` : " ") : t ? `${t} ${e}` : e;
        }
        var Fn = /^\[(.+?)(~?=)"(.*)"\]$/;
        function _s(e) {
          return Fn.test(e) ? e.replace(Fn, (t, r, n, o) => `[${Ze(r)}${n}"${Ze(o)}"]`) : `.${Ze(e)}`;
        }
        function Ps(e, t) {
          return t(e);
        }
        var Ms = /\/\/#\s*sourceMappingURL=.*\n?/g;
        function Wn(e) {
          return e.includes("sourceMappingURL=") ? e.replace(Ms, "") : e;
        }
        var Fs = /(?:[\w&:[\]-]|\[\S+=\S+\])+\[\\?['"]?\S+?['"]\]\]?[\w:-]*/g, Us = /\[(\\\W|[\w-])+:[^\s:]*?("\S+?"|'\S+?'|`\S+?`|[^\s:]+?)[^\s:]*?\)?\]/g, Ls = /^\[(\\\W|[\w-])+:['"]?\S+?['"]?\]$/;
        function Ws(e) {
          let t = [];
          for (let r of e.matchAll(Us))
            r.index !== 0 && !/^[\s'"`]/.test(e[r.index - 1] ?? "") || t.push(r[0]);
          for (let r of e.matchAll(Fs))
            t.push(r[0]);
          return e.split(rt).forEach((r) => {
            Oe(r) && !Ls.test(r) && t.push(r);
          }), t;
        }
        var Nn = {
          name: "@unocss/extractor-arbitrary-variants",
          order: 0,
          extract({ code: e }) {
            return Ws(Wn(e));
          }
        };
        var Bn = [
          {
            layer: "preflights",
            getCSS(e) {
              if (e.theme.preflightBase) {
                let t = ye(Object.entries(e.theme.preflightBase));
                return _(
                  e.theme.preflightRoot ?? ["*,::before,::after", "::backdrop"]
                ).map((n) => `${n}{${t}}`).join("");
              }
            }
          }
        ];
        var F = {
          l: ["-left"],
          r: ["-right"],
          t: ["-top"],
          b: ["-bottom"],
          s: ["-inline-start"],
          e: ["-inline-end"],
          x: ["-left", "-right"],
          y: ["-top", "-bottom"],
          "": [""],
          bs: ["-block-start"],
          be: ["-block-end"],
          is: ["-inline-start"],
          ie: ["-inline-end"],
          block: ["-block-start", "-block-end"],
          inline: ["-inline-start", "-inline-end"]
        }, Mr = {
          ...F,
          s: ["-inset-inline-start"],
          start: ["-inset-inline-start"],
          e: ["-inset-inline-end"],
          end: ["-inset-inline-end"],
          bs: ["-inset-block-start"],
          be: ["-inset-block-end"],
          is: ["-inset-inline-start"],
          ie: ["-inset-inline-end"],
          block: ["-inset-block-start", "-inset-block-end"],
          inline: ["-inset-inline-start", "-inset-inline-end"]
        }, Fr = {
          l: ["-top-left", "-bottom-left"],
          r: ["-top-right", "-bottom-right"],
          t: ["-top-left", "-top-right"],
          b: ["-bottom-left", "-bottom-right"],
          tl: ["-top-left"],
          lt: ["-top-left"],
          tr: ["-top-right"],
          rt: ["-top-right"],
          bl: ["-bottom-left"],
          lb: ["-bottom-left"],
          br: ["-bottom-right"],
          rb: ["-bottom-right"],
          "": [""],
          bs: ["-start-start", "-start-end"],
          be: ["-end-start", "-end-end"],
          s: ["-end-start", "-start-start"],
          is: ["-end-start", "-start-start"],
          e: ["-start-end", "-end-end"],
          ie: ["-start-end", "-end-end"],
          ss: ["-start-start"],
          "bs-is": ["-start-start"],
          "is-bs": ["-start-start"],
          se: ["-start-end"],
          "bs-ie": ["-start-end"],
          "ie-bs": ["-start-end"],
          es: ["-end-start"],
          "be-is": ["-end-start"],
          "is-be": ["-end-start"],
          ee: ["-end-end"],
          "be-ie": ["-end-end"],
          "ie-be": ["-end-end"]
        }, at2 = { x: ["-x"], y: ["-y"], z: ["-z"], "": ["-x", "-y"] }, Dn = [
          "top",
          "top center",
          "top left",
          "top right",
          "bottom",
          "bottom center",
          "bottom left",
          "bottom right",
          "left",
          "left center",
          "left top",
          "left bottom",
          "right",
          "right center",
          "right top",
          "right bottom",
          "center",
          "center top",
          "center bottom",
          "center left",
          "center right",
          "center center"
        ], M = Object.assign(
          {},
          ...Dn.map((e) => ({ [e.replace(/ /, "-")]: e })),
          ...Dn.map((e) => ({
            [e.replace(/\b(\w)\w+/g, "$1").replace(/ /, "")]: e
          }))
        ), S = ["inherit", "initial", "revert", "revert-layer", "unset"], Ve = /^(calc|clamp|min|max)\s*\((.+)\)(.*)/;
        function ve(e, t, r) {
          if (e === "")
            return;
          let n = e.length, o = 0, i = false, a = 0;
          for (let s = 0; s < n; s++)
            switch (e[s]) {
              case t:
                i || (i = true, a = s), o++;
                break;
              case r:
                if (--o, o < 0)
                  return;
                if (o === 0)
                  return [e.slice(a, s + 1), e.slice(s + 1), e.slice(0, a)];
                break;
            }
        }
        function oe(e, t, r, n) {
          if (e === "" || (O(n) && (n = [n]), n.length === 0))
            return;
          let o = e.length, i = 0;
          for (let a = 0; a < o; a++)
            switch (e[a]) {
              case t:
                i++;
                break;
              case r:
                if (--i < 0)
                  return;
                break;
              default:
                for (let s of n) {
                  let c = s.length;
                  if (c && s === e.slice(a, a + c) && i === 0)
                    return a === 0 || a === o - c ? void 0 : [e.slice(0, a), e.slice(a + c)];
                }
            }
          return [e, ""];
        }
        function le(e, t, r) {
          r = r ?? 10;
          let n = [], o = 0;
          for (; e !== ""; ) {
            if (++o > r)
              return;
            let i = oe(e, "(", ")", t);
            if (!i)
              return;
            let [a, s] = i;
            n.push(a), e = s;
          }
          if (n.length > 0)
            return n;
        }
        var Ur = [
          "hsl",
          "hsla",
          "hwb",
          "lab",
          "lch",
          "oklab",
          "oklch",
          "rgb",
          "rgba"
        ], In = ["%alpha", "<alpha-value>"], Ns = new RegExp(In.map((e) => re(e)).join("|"));
        function G(e = "") {
          let t = Bs(e);
          if (t == null || t === false)
            return;
          let { type: r, components: n, alpha: o } = t, i = r.toLowerCase();
          if (n.length !== 0 && !(Ur.includes(i) && ![1, 3].includes(n.length)))
            return {
              type: i,
              components: n.map((a) => typeof a == "string" ? a.trim() : a),
              alpha: typeof o == "string" ? o.trim() : o
            };
        }
        function ee(e) {
          let t = e.alpha ?? 1;
          return typeof t == "string" && In.includes(t) ? 1 : t;
        }
        function A(e, t) {
          if (typeof e == "string")
            return e.replace(Ns, `${t ?? 1}`);
          let { components: r } = e, { alpha: n, type: o } = e;
          return n = t ?? n, o = o.toLowerCase(), ["hsla", "rgba"].includes(o) ? `${o}(${r.join(", ")}${n == null ? "" : `, ${n}`})` : (n = n == null ? "" : ` / ${n}`, Ur.includes(o) ? `${o}(${r.join(" ")}${n})` : `color(${o} ${r.join(" ")}${n})`);
        }
        function Bs(e) {
          if (!e)
            return;
          let t = Ds(e);
          if (t != null || (t = Is(e), t != null) || (t = Ks(e), t != null) || (t = Hs(e), t != null) || (t = qs(e), t != null))
            return t;
        }
        function Ds(e) {
          let [, t] = e.match(/^#([\da-f]+)$/i) || [];
          if (t)
            switch (t.length) {
              case 3:
              case 4:
                let r = Array.from(t, (o) => Number.parseInt(o, 16)).map(
                  (o) => o << 4 | o
                );
                return {
                  type: "rgb",
                  components: r.slice(0, 3),
                  alpha: t.length === 3 ? void 0 : Math.round(r[3] / 255 * 100) / 100
                };
              case 6:
              case 8:
                let n = Number.parseInt(t, 16);
                return {
                  type: "rgb",
                  components: t.length === 6 ? [n >> 16 & 255, n >> 8 & 255, n & 255] : [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255],
                  alpha: t.length === 6 ? void 0 : Math.round((n & 255) / 255 * 100) / 100
                };
            }
        }
        function Is(e) {
          let t = { rebeccapurple: [102, 51, 153, 1] }[e];
          if (t != null)
            return { type: "rgb", components: t.slice(0, 3), alpha: t[3] };
        }
        function Ks(e) {
          let t = e.match(/^(rgb|rgba|hsl|hsla)\((.+)\)$/i);
          if (!t)
            return;
          let [, r, n] = t, o = le(n, ",", 5);
          if (o) {
            if ([3, 4].includes(o.length))
              return { type: r, components: o.slice(0, 3), alpha: o[3] };
            if (o.length !== 1)
              return false;
          }
        }
        var Gs = new RegExp(`^(${Ur.join("|")})\\((.+)\\)$`, "i");
        function Hs(e) {
          let t = e.match(Gs);
          if (!t)
            return;
          let [, r, n] = t, o = Kn(`${r} ${n}`);
          if (o) {
            let {
              alpha: i,
              components: [a, ...s]
            } = o;
            return { type: a, components: s, alpha: i };
          }
        }
        function qs(e) {
          let t = e.match(/^color\((.+)\)$/);
          if (!t)
            return;
          let r = Kn(t[1]);
          if (r) {
            let {
              alpha: n,
              components: [o, ...i]
            } = r;
            return { type: o, components: i, alpha: n };
          }
        }
        function Kn(e) {
          let t = le(e, " ");
          if (!t)
            return;
          let r = t.length;
          if (t[r - 2] === "/")
            return { components: t.slice(0, r - 2), alpha: t[r - 1] };
          if (t[r - 2] != null && (t[r - 2].endsWith("/") || t[r - 1].startsWith("/"))) {
            let i = t.splice(r - 2);
            t.push(i.join(" ")), --r;
          }
          let n = le(t[r - 1], "/", 2);
          if (!n)
            return;
          if (n.length === 1 || n[n.length - 1] === "")
            return { components: t };
          let o = n.pop();
          return t[r - 1] = n.join("/"), { components: t, alpha: o };
        }
        function st(e) {
          let t = function(n) {
            var _a2;
            let o = ((_a2 = this.__options) == null ? void 0 : _a2.sequence) || [];
            this.__options.sequence = [];
            for (let i of o) {
              let a = e[i](n);
              if (a != null)
                return a;
            }
          };
          function r(n, o) {
            return n.__options || (n.__options = { sequence: [] }), n.__options.sequence.push(o), n;
          }
          for (let n of Object.keys(e))
            Object.defineProperty(t, n, {
              enumerable: true,
              get() {
                return r(this, n);
              }
            });
          return t;
        }
        function I(e, t) {
          let r;
          return {
            name: e,
            match(n, o) {
              r || (r = new RegExp(
                `^${re(e)}(?:${o.generator.config.separators.join("|")})`
              ));
              let i = n.match(r);
              if (i)
                return {
                  matcher: n.slice(i[0].length),
                  handle: (a, s) => s({ ...a, ...t(a) })
                };
            },
            autocomplete: `${e}:`
          };
        }
        function U(e, t) {
          let r;
          return {
            name: e,
            match(n, o) {
              r || (r = new RegExp(
                `^${re(e)}(?:${o.generator.config.separators.join("|")})`
              ));
              let i = n.match(r);
              if (i)
                return {
                  matcher: n.slice(i[0].length),
                  handle: (a, s) => s({ ...a, parent: `${a.parent ? `${a.parent} $$ ` : ""}${t}` })
                };
            },
            autocomplete: `${e}:`
          };
        }
        function ie(e, t, r) {
          if (t.startsWith(`${e}[`)) {
            let [n, o] = ve(t.slice(e.length), "[", "]") ?? [];
            if (n && o) {
              for (let i of r)
                if (o.startsWith(i))
                  return [n, o.slice(i.length), i];
              return [n, o, ""];
            }
          }
        }
        function L(e, t, r) {
          if (t.startsWith(e)) {
            let n = ie(e, t, r);
            if (n) {
              let [o = "", i = n[1]] = L("/", n[1], r) ?? [];
              return [n[0], i, o];
            }
            for (let o of r.filter((i) => i !== "/")) {
              let i = t.indexOf(o, e.length);
              if (i !== -1) {
                let a = t.indexOf("/", e.length), s = a === -1 || i <= a;
                return [
                  t.slice(e.length, s ? i : a),
                  t.slice(i + o.length),
                  s ? "" : t.slice(a + 1, i)
                ];
              }
            }
          }
        }
        var Gn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Hn = new Uint8Array(64), Ys = new Uint8Array(128);
        for (let e = 0; e < Gn.length; e++) {
          let t = Gn.charCodeAt(e);
          Hn[e] = t, Ys[t] = e;
        }
        var Lr = typeof TextDecoder < "u" ? new TextDecoder() : typeof Buffer < "u" ? {
          decode(e) {
            return Buffer.from(
              e.buffer,
              e.byteOffset,
              e.byteLength
            ).toString();
          }
        } : {
          decode(e) {
            let t = "";
            for (let r = 0; r < e.length; r++)
              t += String.fromCharCode(e[r]);
            return t;
          }
        };
        function qn(e) {
          let t = new Int32Array(5), r = 1024 * 16, n = r - 36, o = new Uint8Array(r), i = o.subarray(0, n), a = 0, s = "";
          for (let c = 0; c < e.length; c++) {
            let f = e[c];
            if (c > 0 && (a === r && (s += Lr.decode(o), a = 0), o[a++] = 59), f.length !== 0) {
              t[0] = 0;
              for (let u = 0; u < f.length; u++) {
                let p = f[u];
                a > n && (s += Lr.decode(i), o.copyWithin(0, n, a), a -= n), u > 0 && (o[a++] = 44), a = _e(o, a, t, p, 0), p.length !== 1 && (a = _e(o, a, t, p, 1), a = _e(o, a, t, p, 2), a = _e(o, a, t, p, 3), p.length !== 4 && (a = _e(o, a, t, p, 4)));
              }
            }
          }
          return s + Lr.decode(o.subarray(0, a));
        }
        function _e(e, t, r, n, o) {
          let i = n[o], a = i - r[o];
          r[o] = i, a = a < 0 ? -a << 1 | 1 : a << 1;
          do {
            let s = a & 31;
            a >>>= 5, a > 0 && (s |= 32), e[t++] = Hn[s];
          } while (a > 0);
          return t;
        }
        var ct = class e {
          constructor(t) {
            this.bits = t instanceof e ? t.bits.slice() : [];
          }
          add(t) {
            this.bits[t >> 5] |= 1 << (t & 31);
          }
          has(t) {
            return !!(this.bits[t >> 5] & 1 << (t & 31));
          }
        }, lt2 = class e {
          constructor(t, r, n) {
            this.start = t, this.end = r, this.original = n, this.intro = "", this.outro = "", this.content = n, this.storeName = false, this.edited = false, this.previous = null, this.next = null;
          }
          appendLeft(t) {
            this.outro += t;
          }
          appendRight(t) {
            this.intro = this.intro + t;
          }
          clone() {
            let t = new e(this.start, this.end, this.original);
            return t.intro = this.intro, t.outro = this.outro, t.content = this.content, t.storeName = this.storeName, t.edited = this.edited, t;
          }
          contains(t) {
            return this.start < t && t < this.end;
          }
          eachNext(t) {
            let r = this;
            for (; r; )
              t(r), r = r.next;
          }
          eachPrevious(t) {
            let r = this;
            for (; r; )
              t(r), r = r.previous;
          }
          edit(t, r, n) {
            return this.content = t, n || (this.intro = "", this.outro = ""), this.storeName = r, this.edited = true, this;
          }
          prependLeft(t) {
            this.outro = t + this.outro;
          }
          prependRight(t) {
            this.intro = t + this.intro;
          }
          split(t) {
            let r = t - this.start, n = this.original.slice(0, r), o = this.original.slice(r);
            this.original = n;
            let i = new e(t, this.end, o);
            return i.outro = this.outro, this.outro = "", this.end = t, this.edited ? (i.edit("", false), this.content = "") : this.content = n, i.next = this.next, i.next && (i.next.previous = i), i.previous = this, this.next = i, i;
          }
          toString() {
            return this.intro + this.content + this.outro;
          }
          trimEnd(t) {
            if (this.outro = this.outro.replace(t, ""), this.outro.length)
              return true;
            let r = this.content.replace(t, "");
            if (r.length)
              return r !== this.content && (this.split(this.start + r.length).edit("", void 0, true), this.edited && this.edit(r, this.storeName, true)), true;
            if (this.edit("", void 0, true), this.intro = this.intro.replace(t, ""), this.intro.length)
              return true;
          }
          trimStart(t) {
            if (this.intro = this.intro.replace(t, ""), this.intro.length)
              return true;
            let r = this.content.replace(t, "");
            if (r.length) {
              if (r !== this.content) {
                let n = this.split(this.end - r.length);
                this.edited && n.edit(r, this.storeName, true), this.edit("", void 0, true);
              }
              return true;
            } else if (this.edit("", void 0, true), this.outro = this.outro.replace(t, ""), this.outro.length)
              return true;
          }
        };
        function Xs() {
          return typeof window < "u" && typeof window.btoa == "function" ? (e) => window.btoa(unescape(encodeURIComponent(e))) : typeof Buffer == "function" ? (e) => Buffer.from(e, "utf-8").toString("base64") : () => {
            throw new Error(
              "Unsupported environment: `window.btoa` or `Buffer` should be supported."
            );
          };
        }
        var Zs = Xs(), Wr = class {
          constructor(t) {
            this.version = 3, this.file = t.file, this.sources = t.sources, this.sourcesContent = t.sourcesContent, this.names = t.names, this.mappings = qn(t.mappings), typeof t.x_google_ignoreList < "u" && (this.x_google_ignoreList = t.x_google_ignoreList);
          }
          toString() {
            return JSON.stringify(this);
          }
          toUrl() {
            return "data:application/json;charset=utf-8;base64," + Zs(this.toString());
          }
        };
        function Js(e) {
          let t = e.split(`
`), r = t.filter((i) => /^\t+/.test(i)), n = t.filter((i) => /^ {2,}/.test(i));
          if (r.length === 0 && n.length === 0)
            return null;
          if (r.length >= n.length)
            return "	";
          let o = n.reduce((i, a) => {
            let s = /^ +/.exec(a)[0].length;
            return Math.min(s, i);
          }, 1 / 0);
          return new Array(o + 1).join(" ");
        }
        function Qs(e, t) {
          let r = e.split(/[/\\]/), n = t.split(/[/\\]/);
          for (r.pop(); r[0] === n[0]; )
            r.shift(), n.shift();
          if (r.length) {
            let o = r.length;
            for (; o--; )
              r[o] = "..";
          }
          return r.concat(n).join("/");
        }
        var ec = Object.prototype.toString;
        function tc(e) {
          return ec.call(e) === "[object Object]";
        }
        function Yn(e) {
          let t = e.split(`
`), r = [];
          for (let n = 0, o = 0; n < t.length; n++)
            r.push(o), o += t[n].length + 1;
          return function(o) {
            let i = 0, a = r.length;
            for (; i < a; ) {
              let f = i + a >> 1;
              o < r[f] ? a = f : i = f + 1;
            }
            let s = i - 1, c = o - r[s];
            return { line: s, column: c };
          };
        }
        var rc = /\w/, Nr = class {
          constructor(t) {
            this.hires = t, this.generatedCodeLine = 0, this.generatedCodeColumn = 0, this.raw = [], this.rawSegments = this.raw[this.generatedCodeLine] = [], this.pending = null;
          }
          addEdit(t, r, n, o) {
            if (r.length) {
              let i = r.indexOf(
                `
`,
                0
              ), a = -1;
              for (; i >= 0; ) {
                let c = [this.generatedCodeColumn, t, n.line, n.column];
                o >= 0 && c.push(o), this.rawSegments.push(c), this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, a = i, i = r.indexOf(
                  `
`,
                  i + 1
                );
              }
              let s = [this.generatedCodeColumn, t, n.line, n.column];
              o >= 0 && s.push(o), this.rawSegments.push(s), this.advance(r.slice(a + 1));
            } else
              this.pending && (this.rawSegments.push(this.pending), this.advance(r));
            this.pending = null;
          }
          addUneditedChunk(t, r, n, o, i) {
            let a = r.start, s = true, c = false;
            for (; a < r.end; ) {
              if (this.hires || s || i.has(a)) {
                let f = [this.generatedCodeColumn, t, o.line, o.column];
                this.hires === "boundary" ? rc.test(n[a]) ? c || (this.rawSegments.push(f), c = true) : (this.rawSegments.push(f), c = false) : this.rawSegments.push(f);
              }
              n[a] === `
` ? (o.line += 1, o.column = 0, this.generatedCodeLine += 1, this.raw[this.generatedCodeLine] = this.rawSegments = [], this.generatedCodeColumn = 0, s = true) : (o.column += 1, this.generatedCodeColumn += 1, s = false), a += 1;
            }
            this.pending = null;
          }
          advance(t) {
            if (!t)
              return;
            let r = t.split(`
`);
            if (r.length > 1) {
              for (let n = 0; n < r.length - 1; n++)
                this.generatedCodeLine++, this.raw[this.generatedCodeLine] = this.rawSegments = [];
              this.generatedCodeColumn = 0;
            }
            this.generatedCodeColumn += r[r.length - 1].length;
          }
        }, Pe = `
`, we = { insertLeft: false, insertRight: false, storeName: false }, ft = class e {
          constructor(t, r = {}) {
            let n = new lt2(0, t.length, t);
            Object.defineProperties(this, {
              original: { writable: true, value: t },
              outro: { writable: true, value: "" },
              intro: { writable: true, value: "" },
              firstChunk: { writable: true, value: n },
              lastChunk: { writable: true, value: n },
              lastSearchedChunk: { writable: true, value: n },
              byStart: { writable: true, value: {} },
              byEnd: { writable: true, value: {} },
              filename: { writable: true, value: r.filename },
              indentExclusionRanges: {
                writable: true,
                value: r.indentExclusionRanges
              },
              sourcemapLocations: { writable: true, value: new ct() },
              storedNames: { writable: true, value: {} },
              indentStr: { writable: true, value: void 0 },
              ignoreList: { writable: true, value: r.ignoreList }
            }), this.byStart[0] = n, this.byEnd[t.length] = n;
          }
          addSourcemapLocation(t) {
            this.sourcemapLocations.add(t);
          }
          append(t) {
            if (typeof t != "string")
              throw new TypeError("outro content must be a string");
            return this.outro += t, this;
          }
          appendLeft(t, r) {
            if (typeof r != "string")
              throw new TypeError("inserted content must be a string");
            this._split(t);
            let n = this.byEnd[t];
            return n ? n.appendLeft(r) : this.intro += r, this;
          }
          appendRight(t, r) {
            if (typeof r != "string")
              throw new TypeError("inserted content must be a string");
            this._split(t);
            let n = this.byStart[t];
            return n ? n.appendRight(r) : this.outro += r, this;
          }
          clone() {
            let t = new e(this.original, { filename: this.filename }), r = this.firstChunk, n = t.firstChunk = t.lastSearchedChunk = r.clone();
            for (; r; ) {
              t.byStart[n.start] = n, t.byEnd[n.end] = n;
              let o = r.next, i = o && o.clone();
              i && (n.next = i, i.previous = n, n = i), r = o;
            }
            return t.lastChunk = n, this.indentExclusionRanges && (t.indentExclusionRanges = this.indentExclusionRanges.slice()), t.sourcemapLocations = new ct(this.sourcemapLocations), t.intro = this.intro, t.outro = this.outro, t;
          }
          generateDecodedMap(t) {
            t = t || {};
            let r = 0, n = Object.keys(this.storedNames), o = new Nr(t.hires), i = Yn(this.original);
            return this.intro && o.advance(this.intro), this.firstChunk.eachNext((a) => {
              let s = i(a.start);
              a.intro.length && o.advance(a.intro), a.edited ? o.addEdit(
                r,
                a.content,
                s,
                a.storeName ? n.indexOf(a.original) : -1
              ) : o.addUneditedChunk(
                r,
                a,
                this.original,
                s,
                this.sourcemapLocations
              ), a.outro.length && o.advance(a.outro);
            }), {
              file: t.file ? t.file.split(/[/\\]/).pop() : void 0,
              sources: [t.source ? Qs(t.file || "", t.source) : t.file || ""],
              sourcesContent: t.includeContent ? [this.original] : void 0,
              names: n,
              mappings: o.raw,
              x_google_ignoreList: this.ignoreList ? [r] : void 0
            };
          }
          generateMap(t) {
            return new Wr(this.generateDecodedMap(t));
          }
          _ensureindentStr() {
            this.indentStr === void 0 && (this.indentStr = Js(this.original));
          }
          _getRawIndentString() {
            return this._ensureindentStr(), this.indentStr;
          }
          getIndentString() {
            return this._ensureindentStr(), this.indentStr === null ? "	" : this.indentStr;
          }
          indent(t, r) {
            let n = /^[^\r\n]/gm;
            if (tc(t) && (r = t, t = void 0), t === void 0 && (this._ensureindentStr(), t = this.indentStr || "	"), t === "")
              return this;
            r = r || {};
            let o = {};
            r.exclude && (typeof r.exclude[0] == "number" ? [r.exclude] : r.exclude).forEach(
              (u) => {
                for (let p = u[0]; p < u[1]; p += 1)
                  o[p] = true;
              }
            );
            let i = r.indentStart !== false, a = (f) => i ? `${t}${f}` : (i = true, f);
            this.intro = this.intro.replace(n, a);
            let s = 0, c = this.firstChunk;
            for (; c; ) {
              let f = c.end;
              if (c.edited)
                o[s] || (c.content = c.content.replace(n, a), c.content.length && (i = c.content[c.content.length - 1] === `
`));
              else
                for (s = c.start; s < f; ) {
                  if (!o[s]) {
                    let u = this.original[s];
                    u === `
` ? i = true : u !== "\r" && i && (i = false, s === c.start || (this._splitChunk(c, s), c = c.next), c.prependRight(t));
                  }
                  s += 1;
                }
              s = c.end, c = c.next;
            }
            return this.outro = this.outro.replace(n, a), this;
          }
          insert() {
            throw new Error(
              "magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)"
            );
          }
          insertLeft(t, r) {
            return we.insertLeft || (console.warn(
              "magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"
            ), we.insertLeft = true), this.appendLeft(t, r);
          }
          insertRight(t, r) {
            return we.insertRight || (console.warn(
              "magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"
            ), we.insertRight = true), this.prependRight(t, r);
          }
          move(t, r, n) {
            if (n >= t && n <= r)
              throw new Error("Cannot move a selection inside itself");
            this._split(t), this._split(r), this._split(n);
            let o = this.byStart[t], i = this.byEnd[r], a = o.previous, s = i.next, c = this.byStart[n];
            if (!c && i === this.lastChunk)
              return this;
            let f = c ? c.previous : this.lastChunk;
            return a && (a.next = s), s && (s.previous = a), f && (f.next = o), c && (c.previous = i), o.previous || (this.firstChunk = i.next), i.next || (this.lastChunk = o.previous, this.lastChunk.next = null), o.previous = f, i.next = c || null, f || (this.firstChunk = o), c || (this.lastChunk = i), this;
          }
          overwrite(t, r, n, o) {
            return o = o || {}, this.update(t, r, n, { ...o, overwrite: !o.contentOnly });
          }
          update(t, r, n, o) {
            if (typeof n != "string")
              throw new TypeError("replacement content must be a string");
            for (; t < 0; )
              t += this.original.length;
            for (; r < 0; )
              r += this.original.length;
            if (r > this.original.length)
              throw new Error("end is out of bounds");
            if (t === r)
              throw new Error(
                "Cannot overwrite a zero-length range – use appendLeft or prependRight instead"
              );
            this._split(t), this._split(r), o === true && (we.storeName || (console.warn(
              "The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"
            ), we.storeName = true), o = { storeName: true });
            let i = o !== void 0 ? o.storeName : false, a = o !== void 0 ? o.overwrite : false;
            if (i) {
              let f = this.original.slice(t, r);
              Object.defineProperty(this.storedNames, f, {
                writable: true,
                value: true,
                enumerable: true
              });
            }
            let s = this.byStart[t], c = this.byEnd[r];
            if (s) {
              let f = s;
              for (; f !== c; ) {
                if (f.next !== this.byStart[f.end])
                  throw new Error("Cannot overwrite across a split point");
                f = f.next, f.edit("", false);
              }
              s.edit(n, i, !a);
            } else {
              let f = new lt2(t, r, "").edit(n, i);
              c.next = f, f.previous = c;
            }
            return this;
          }
          prepend(t) {
            if (typeof t != "string")
              throw new TypeError("outro content must be a string");
            return this.intro = t + this.intro, this;
          }
          prependLeft(t, r) {
            if (typeof r != "string")
              throw new TypeError("inserted content must be a string");
            this._split(t);
            let n = this.byEnd[t];
            return n ? n.prependLeft(r) : this.intro = r + this.intro, this;
          }
          prependRight(t, r) {
            if (typeof r != "string")
              throw new TypeError("inserted content must be a string");
            this._split(t);
            let n = this.byStart[t];
            return n ? n.prependRight(r) : this.outro = r + this.outro, this;
          }
          remove(t, r) {
            for (; t < 0; )
              t += this.original.length;
            for (; r < 0; )
              r += this.original.length;
            if (t === r)
              return this;
            if (t < 0 || r > this.original.length)
              throw new Error("Character is out of bounds");
            if (t > r)
              throw new Error("end must be greater than start");
            this._split(t), this._split(r);
            let n = this.byStart[t];
            for (; n; )
              n.intro = "", n.outro = "", n.edit(""), n = r > n.end ? this.byStart[n.end] : null;
            return this;
          }
          lastChar() {
            if (this.outro.length)
              return this.outro[this.outro.length - 1];
            let t = this.lastChunk;
            do {
              if (t.outro.length)
                return t.outro[t.outro.length - 1];
              if (t.content.length)
                return t.content[t.content.length - 1];
              if (t.intro.length)
                return t.intro[t.intro.length - 1];
            } while (t = t.previous);
            return this.intro.length ? this.intro[this.intro.length - 1] : "";
          }
          lastLine() {
            let t = this.outro.lastIndexOf(Pe);
            if (t !== -1)
              return this.outro.substr(t + 1);
            let r = this.outro, n = this.lastChunk;
            do {
              if (n.outro.length > 0) {
                if (t = n.outro.lastIndexOf(Pe), t !== -1)
                  return n.outro.substr(t + 1) + r;
                r = n.outro + r;
              }
              if (n.content.length > 0) {
                if (t = n.content.lastIndexOf(Pe), t !== -1)
                  return n.content.substr(t + 1) + r;
                r = n.content + r;
              }
              if (n.intro.length > 0) {
                if (t = n.intro.lastIndexOf(Pe), t !== -1)
                  return n.intro.substr(t + 1) + r;
                r = n.intro + r;
              }
            } while (n = n.previous);
            return t = this.intro.lastIndexOf(Pe), t !== -1 ? this.intro.substr(t + 1) + r : this.intro + r;
          }
          slice(t = 0, r = this.original.length) {
            for (; t < 0; )
              t += this.original.length;
            for (; r < 0; )
              r += this.original.length;
            let n = "", o = this.firstChunk;
            for (; o && (o.start > t || o.end <= t); ) {
              if (o.start < r && o.end >= r)
                return n;
              o = o.next;
            }
            if (o && o.edited && o.start !== t)
              throw new Error(
                `Cannot use replaced character ${t} as slice start anchor.`
              );
            let i = o;
            for (; o; ) {
              o.intro && (i !== o || o.start === t) && (n += o.intro);
              let a = o.start < r && o.end >= r;
              if (a && o.edited && o.end !== r)
                throw new Error(
                  `Cannot use replaced character ${r} as slice end anchor.`
                );
              let s = i === o ? t - o.start : 0, c = a ? o.content.length + r - o.end : o.content.length;
              if (n += o.content.slice(s, c), o.outro && (!a || o.end === r) && (n += o.outro), a)
                break;
              o = o.next;
            }
            return n;
          }
          snip(t, r) {
            let n = this.clone();
            return n.remove(0, t), n.remove(r, n.original.length), n;
          }
          _split(t) {
            if (this.byStart[t] || this.byEnd[t])
              return;
            let r = this.lastSearchedChunk, n = t > r.end;
            for (; r; ) {
              if (r.contains(t))
                return this._splitChunk(r, t);
              r = n ? this.byStart[r.end] : this.byEnd[r.start];
            }
          }
          _splitChunk(t, r) {
            if (t.edited && t.content.length) {
              let o = Yn(this.original)(r);
              throw new Error(
                `Cannot split a chunk that has already been edited (${o.line}:${o.column} – "${t.original}")`
              );
            }
            let n = t.split(r);
            return this.byEnd[r] = t, this.byStart[r] = n, this.byEnd[n.end] = n, t === this.lastChunk && (this.lastChunk = n), this.lastSearchedChunk = t, true;
          }
          toString() {
            let t = this.intro, r = this.firstChunk;
            for (; r; )
              t += r.toString(), r = r.next;
            return t + this.outro;
          }
          isEmpty() {
            let t = this.firstChunk;
            do
              if (t.intro.length && t.intro.trim() || t.content.length && t.content.trim() || t.outro.length && t.outro.trim())
                return false;
            while (t = t.next);
            return true;
          }
          length() {
            let t = this.firstChunk, r = 0;
            do
              r += t.intro.length + t.content.length + t.outro.length;
            while (t = t.next);
            return r;
          }
          trimLines() {
            return this.trim("[\\r\\n]");
          }
          trim(t) {
            return this.trimStart(t).trimEnd(t);
          }
          trimEndAborted(t) {
            let r = new RegExp((t || "\\s") + "+$");
            if (this.outro = this.outro.replace(r, ""), this.outro.length)
              return true;
            let n = this.lastChunk;
            do {
              let o = n.end, i = n.trimEnd(r);
              if (n.end !== o && (this.lastChunk === n && (this.lastChunk = n.next), this.byEnd[n.end] = n, this.byStart[n.next.start] = n.next, this.byEnd[n.next.end] = n.next), i)
                return true;
              n = n.previous;
            } while (n);
            return false;
          }
          trimEnd(t) {
            return this.trimEndAborted(t), this;
          }
          trimStartAborted(t) {
            let r = new RegExp("^" + (t || "\\s") + "+");
            if (this.intro = this.intro.replace(r, ""), this.intro.length)
              return true;
            let n = this.firstChunk;
            do {
              let o = n.end, i = n.trimStart(r);
              if (n.end !== o && (n === this.lastChunk && (this.lastChunk = n.next), this.byEnd[n.end] = n, this.byStart[n.next.start] = n.next, this.byEnd[n.next.end] = n.next), i)
                return true;
              n = n.next;
            } while (n);
            return false;
          }
          trimStart(t) {
            return this.trimStartAborted(t), this;
          }
          hasChanged() {
            return this.original !== this.toString();
          }
          _replaceRegexp(t, r) {
            function n(i, a) {
              return typeof r == "string" ? r.replace(
                /\$(\$|&|\d+)/g,
                (s, c) => c === "$" ? "$" : c === "&" ? i[0] : +c < i.length ? i[+c] : `$${c}`
              ) : r(...i, i.index, a, i.groups);
            }
            function o(i, a) {
              let s, c = [];
              for (; s = i.exec(a); )
                c.push(s);
              return c;
            }
            if (t.global)
              o(t, this.original).forEach((a) => {
                a.index != null && this.overwrite(
                  a.index,
                  a.index + a[0].length,
                  n(a, this.original)
                );
              });
            else {
              let i = this.original.match(t);
              i && i.index != null && this.overwrite(i.index, i.index + i[0].length, n(i, this.original));
            }
            return this;
          }
          _replaceString(t, r) {
            let { original: n } = this, o = n.indexOf(t);
            return o !== -1 && this.overwrite(o, o + t.length, r), this;
          }
          replace(t, r) {
            return typeof t == "string" ? this._replaceString(t, r) : this._replaceRegexp(t, r);
          }
          _replaceAllString(t, r) {
            let { original: n } = this, o = t.length;
            for (let i = n.indexOf(t); i !== -1; i = n.indexOf(t, i + o))
              this.overwrite(i, i + o, r);
            return this;
          }
          replaceAll(t, r) {
            if (typeof t == "string")
              return this._replaceAllString(t, r);
            if (!t.global)
              throw new TypeError(
                "MagicString.prototype.replaceAll called with a non-global RegExp argument"
              );
            return this._replaceRegexp(t, r);
          }
        };
        var nc = /theme\(\s*['"]?(.*?)['"]?\s*\)/g;
        function Xn(e) {
          return e.includes("theme(") && e.includes(")");
        }
        function Zn(e, t, r = true) {
          let n = Array.from(e.toString().matchAll(nc));
          if (!n.length)
            return e;
          let o = new ft(e);
          for (let i of n) {
            let a = i[1];
            if (!a)
              throw new Error("theme() expect exact one argument, but got 0");
            let [s, c] = a.split("/"), u = s.trim().split(".").reduce((p, d) => p == null ? void 0 : p[d], t);
            if (typeof u == "string") {
              if (c) {
                let p = G(u);
                p && (u = A(p, c));
              }
              o.overwrite(i.index, i.index + i[0].length, u);
            } else if (r)
              throw new Error(`theme of "${a}" did not found`);
          }
          return o.toString();
        }
        var Ir = {};
        ys(Ir, {
          auto: () => ac,
          bracket: () => pc,
          bracketOfColor: () => dc,
          bracketOfLength: () => mc,
          bracketOfPosition: () => hc,
          cssvar: () => gc,
          degree: () => xc,
          fraction: () => uc,
          global: () => yc,
          number: () => lc,
          numberWithUnit: () => ic,
          percent: () => fc,
          position: () => wc,
          properties: () => vc,
          px: () => cc,
          rem: () => sc,
          time: () => bc
        });
        var $e = /^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i, Br = /^(-?\d*(?:\.\d+)?)$/i, Dr = /^(px)$/i, ut = /^\[(color|length|position|quoted|string):/i;
        var oc = [
          "color",
          "border-color",
          "background-color",
          "flex-grow",
          "flex",
          "flex-shrink",
          "caret-color",
          "font",
          "gap",
          "opacity",
          "visibility",
          "z-index",
          "font-weight",
          "zoom",
          "text-shadow",
          "transform",
          "box-shadow",
          "background-position",
          "left",
          "right",
          "top",
          "bottom",
          "object-position",
          "max-height",
          "min-height",
          "max-width",
          "min-width",
          "height",
          "width",
          "border-width",
          "margin",
          "padding",
          "outline-width",
          "outline-offset",
          "font-size",
          "line-height",
          "text-indent",
          "vertical-align",
          "border-spacing",
          "letter-spacing",
          "word-spacing",
          "stroke",
          "filter",
          "backdrop-filter",
          "fill",
          "mask",
          "mask-size",
          "mask-border",
          "clip-path",
          "clip",
          "border-radius"
        ];
        function H(e) {
          return e.toFixed(10).replace(/\.0+$/, "").replace(/(\.\d+?)0+$/, "$1");
        }
        function ic(e) {
          let t = e.match($e);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (n && !Number.isNaN(o))
            return `${H(o)}${n}`;
        }
        function ac(e) {
          if (e === "auto" || e === "a")
            return "auto";
        }
        function sc(e) {
          if (Dr.test(e))
            return `1${e}`;
          let t = e.match($e);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return o === 0 ? "0" : n ? `${H(o)}${n}` : `${H(o / 4)}rem`;
        }
        function cc(e) {
          if (Dr.test(e))
            return `1${e}`;
          let t = e.match($e);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return n ? `${H(o)}${n}` : `${H(o)}px`;
        }
        function lc(e) {
          if (!Br.test(e))
            return;
          let t = Number.parseFloat(e);
          if (!Number.isNaN(t))
            return H(t);
        }
        function fc(e) {
          if (e.endsWith("%") && (e = e.slice(0, -1)), !Br.test(e))
            return;
          let t = Number.parseFloat(e);
          if (!Number.isNaN(t))
            return `${H(t / 100)}`;
        }
        function uc(e) {
          if (e === "full")
            return "100%";
          let [t, r] = e.split("/"), n = Number.parseFloat(t) / Number.parseFloat(r);
          if (!Number.isNaN(n))
            return n === 0 ? "0" : `${H(n * 100)}%`;
        }
        function pt(e, t) {
          if (e && e.startsWith("[") && e.endsWith("]")) {
            let r, n, o = e.match(ut);
            if (o ? (t || (n = o[1]), r = e.slice(o[0].length, -1)) : r = e.slice(1, -1), !r || r === '=""')
              return;
            r.startsWith("--") && (r = `var(${r})`);
            let i = 0;
            for (let a of r)
              if (a === "[")
                i += 1;
              else if (a === "]" && (i -= 1, i < 0))
                return;
            if (i)
              return;
            switch (n) {
              case "string":
                return r.replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_");
              case "quoted":
                return r.replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_").replace(/(["\\])/g, "\\$1").replace(/^(.+)$/, '"$1"');
            }
            return r.replace(/(url\(.*?\))/g, (a) => a.replace(/_/g, "\\_")).replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_").replace(/(?:calc|clamp|max|min)\((.*)/g, (a) => {
              let s = [];
              return a.replace(
                /var\((--.+?)[,)]/g,
                (c, f) => (s.push(f), c.replace(f, "--un-calc"))
              ).replace(
                /(-?\d*\.?\d(?!\b-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
                "$1 $2 "
              ).replace(/--un-calc/g, () => s.shift());
            });
          }
        }
        function pc(e) {
          return pt(e);
        }
        function dc(e) {
          return pt(e, "color");
        }
        function mc(e) {
          return pt(e, "length");
        }
        function hc(e) {
          return pt(e, "position");
        }
        function gc(e) {
          if (/^\$[^\s'"`;{}]/.test(e)) {
            let [t, r] = e.slice(1).split(",");
            return `var(--${Q(t)}${r ? `, ${r}` : ""})`;
          }
        }
        function bc(e) {
          let t = e.match(/^(-?[0-9.]+)(s|ms)?$/i);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return o === 0 && !n ? "0s" : n ? `${H(o)}${n}` : `${H(o)}ms`;
        }
        function xc(e) {
          let t = e.match(/^(-?[0-9.]+)(deg|rad|grad|turn)?$/i);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return o === 0 ? "0" : n ? `${H(o)}${n}` : `${H(o)}deg`;
        }
        function yc(e) {
          if (S.includes(e))
            return e;
        }
        function vc(e) {
          if (e.split(",").every((t) => oc.includes(t)))
            return e;
        }
        function wc(e) {
          if (["top", "left", "right", "bottom", "center"].includes(e))
            return e;
        }
        var $c = st(Ir), l = $c;
        var Jn = {
          mid: "middle",
          base: "baseline",
          btm: "bottom",
          baseline: "baseline",
          top: "top",
          start: "top",
          middle: "middle",
          bottom: "bottom",
          end: "bottom",
          "text-top": "text-top",
          "text-bottom": "text-bottom",
          sub: "sub",
          super: "super",
          ...Object.fromEntries(S.map((e) => [e, e]))
        }, dt = [
          [
            /^(?:vertical|align|v)-([-\w]+%?)$/,
            ([, e]) => ({ "vertical-align": Jn[e] ?? l.numberWithUnit(e) }),
            {
              autocomplete: [
                `(vertical|align|v)-(${Object.keys(Jn).join("|")})`,
                "(vertical|align|v)-<percentage>"
              ]
            }
          ]
        ], mt = ["center", "left", "right", "justify", "start", "end"].map((e) => [
          `text-${e}`,
          { "text-align": e }
        ]);
        var eo = "$$mini-no-negative";
        function V(e) {
          return ([t, r, n], { theme: o }) => {
            var _a2;
            let i = ((_a2 = o.spacing) == null ? void 0 : _a2[n || "DEFAULT"]) ?? l.bracket.cssvar.global.auto.fraction.rem(n);
            if (i != null)
              return F[r].map((a) => [`${e}${a}`, i]);
          };
        }
        function Qn(e, t, r = "colors") {
          let n = e[r], o = -1;
          for (let i of t) {
            if (o += 1, n && typeof n != "string") {
              let a = t.slice(o).join("-").replace(/(-[a-z])/g, (s) => s.slice(1).toUpperCase());
              if (n[a])
                return n[a];
              if (n[i]) {
                n = n[i];
                continue;
              }
            }
            return;
          }
          return n;
        }
        function ht(e, t, r) {
          return Qn(e, t, r) || Qn(e, t, "colors");
        }
        function Kr(e, t) {
          let [r, n] = oe(e, "[", "]", ["/", ":"]) ?? [];
          if (r != null) {
            let o = (r.match(ut) ?? [])[1];
            if (o == null || o === t)
              return [r, n];
          }
        }
        function ke(e, t, r) {
          let n = Kr(e, "color");
          if (!n)
            return;
          let [o, i] = n, a = o.replace(/([a-z])([0-9])/g, "$1-$2").split(/-/g), [s] = a;
          if (!s)
            return;
          let c, f = l.bracketOfColor(o), u = f || o;
          if (l.numberWithUnit(u))
            return;
          if (/^#[\da-fA-F]+/.test(u) ? c = u : /^hex-[\da-fA-F]+/.test(u) ? c = `#${u.slice(4)}` : o.startsWith("$") && (c = l.cssvar(o)), c = c || f, !c) {
            let d = ht(t, [o], r);
            typeof d == "string" && (c = d);
          }
          let p = "DEFAULT";
          if (!c) {
            let d, [h] = a.slice(-1);
            /^\d+$/.test(h) ? (p = h, d = ht(t, a.slice(0, -1), r), !d || typeof d == "string" ? c = void 0 : c = d[p]) : (d = ht(t, a, r), !d && a.length <= 2 && ([, p = p] = a, d = ht(t, [s], r)), typeof d == "string" ? c = d : p && d && (c = d[p]));
          }
          return {
            opacity: i,
            name: s,
            no: p,
            color: c,
            cssColor: G(c),
            alpha: l.bracket.cssvar.percent(i ?? "")
          };
        }
        function j(e, t, r, n) {
          return ([, o], { theme: i }) => {
            let a = ke(o, i, r);
            if (!a)
              return;
            let { alpha: s, color: c, cssColor: f } = a, u = {};
            if (f)
              if (s != null)
                u[e] = A(f, s);
              else {
                let p = `--un-${t}-opacity`, d = A(f, `var(${p})`);
                d.includes(p) && (u[p] = ee(f)), u[e] = d;
              }
            else if (c)
              if (s != null)
                u[e] = A(c, s);
              else {
                let p = `--un-${t}-opacity`, d = A(c, `var(${p})`);
                d.includes(p) && (u[p] = 1), u[e] = d;
              }
            if ((n == null ? void 0 : n(u)) !== false)
              return u;
          };
        }
        function Se(e, t) {
          let r = [];
          e = _(e);
          for (let n = 0; n < e.length; n++) {
            let o = le(e[n], " ", 6);
            if (!o || o.length < 3 || G(o.at(0)))
              return e;
            let i = "";
            if (G(o.at(-1))) {
              let a = G(o.pop());
              a && (i = `, ${A(a)}`);
            }
            r.push(`${o.join(" ")} var(${t}${i})`);
          }
          return r;
        }
        function Ce(e, t, r) {
          var _a2;
          return e != null && !!((_a2 = ke(e, t, r)) == null ? void 0 : _a2.color);
        }
        function fe({ theme: e, generator: t }, r = "breakpoints") {
          let n;
          return t.userConfig && t.userConfig.theme && (n = t.userConfig.theme[r]), n || (n = e[r]), n ? Object.entries(n).sort(
            (o, i) => Number.parseInt(o[1].replace(/[a-z]+/gi, "")) - Number.parseInt(i[1].replace(/[a-z]+/gi, ""))
          ).map(([o, i]) => ({ point: o, size: i })) : void 0;
        }
        function v(e, t) {
          return S.map((r) => [`${e}-${r}`, { [t ?? e]: r }]);
        }
        function q(e) {
          return e != null && Ve.test(e);
        }
        function to(e) {
          return e[0] === "[" && e.slice(-1) === "]" && (e = e.slice(1, -1)), Ve.test(e) || $e.test(e);
        }
        var gt2 = [
          [
            /^outline-(?:width-|size-)?(.+)$/,
            ro,
            { autocomplete: "outline-(width|size)-<num>" }
          ],
          [/^outline-(?:color-)?(.+)$/, kc, { autocomplete: "outline-$colors" }],
          [
            /^outline-offset-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "outline-offset": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.global.px(e)
              };
            },
            { autocomplete: "outline-(offset)-<num>" }
          ],
          ["outline", { "outline-style": "solid" }],
          ...[
            "auto",
            "dashed",
            "dotted",
            "double",
            "hidden",
            "solid",
            "groove",
            "ridge",
            "inset",
            "outset",
            ...S
          ].map((e) => [`outline-${e}`, { "outline-style": e }]),
          [
            "outline-none",
            { outline: "2px solid transparent", "outline-offset": "2px" }
          ]
        ];
        function ro([, e], { theme: t }) {
          var _a2;
          return {
            "outline-width": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.global.px(e)
          };
        }
        function kc(e, t) {
          return q(l.bracket(e[1])) ? ro(e, t) : j("outline-color", "outline-color", "borderColor")(e, t);
        }
        var bt = [
          ["appearance-auto", { "-webkit-appearance": "auto", appearance: "auto" }],
          ["appearance-none", { "-webkit-appearance": "none", appearance: "none" }]
        ];
        function Sc(e) {
          return l.properties.auto.global(e) ?? { contents: "contents", scroll: "scroll-position" }[e];
        }
        var xt = [[/^will-change-(.+)/, ([, e]) => ({ "will-change": Sc(e) })]];
        var ue = [
          "solid",
          "dashed",
          "dotted",
          "double",
          "hidden",
          "none",
          "groove",
          "ridge",
          "inset",
          "outset",
          ...S
        ], yt = [
          [
            /^(?:border|b)()(?:-(.+))?$/,
            X,
            { autocomplete: "(border|b)-<directions>" }
          ],
          [/^(?:border|b)-([xy])(?:-(.+))?$/, X],
          [/^(?:border|b)-([rltbse])(?:-(.+))?$/, X],
          [/^(?:border|b)-(block|inline)(?:-(.+))?$/, X],
          [/^(?:border|b)-([bi][se])(?:-(.+))?$/, X],
          [
            /^(?:border|b)-()(?:width|size)-(.+)$/,
            X,
            { autocomplete: ["(border|b)-<num>", "(border|b)-<directions>-<num>"] }
          ],
          [/^(?:border|b)-([xy])-(?:width|size)-(.+)$/, X],
          [/^(?:border|b)-([rltbse])-(?:width|size)-(.+)$/, X],
          [/^(?:border|b)-(block|inline)-(?:width|size)-(.+)$/, X],
          [/^(?:border|b)-([bi][se])-(?:width|size)-(.+)$/, X],
          [
            /^(?:border|b)-()(?:color-)?(.+)$/,
            Me,
            {
              autocomplete: [
                "(border|b)-$colors",
                "(border|b)-<directions>-$colors"
              ]
            }
          ],
          [/^(?:border|b)-([xy])-(?:color-)?(.+)$/, Me],
          [/^(?:border|b)-([rltbse])-(?:color-)?(.+)$/, Me],
          [/^(?:border|b)-(block|inline)-(?:color-)?(.+)$/, Me],
          [/^(?:border|b)-([bi][se])-(?:color-)?(.+)$/, Me],
          [
            /^(?:border|b)-()op(?:acity)?-?(.+)$/,
            Fe,
            { autocomplete: "(border|b)-(op|opacity)-<percent>" }
          ],
          [/^(?:border|b)-([xy])-op(?:acity)?-?(.+)$/, Fe],
          [/^(?:border|b)-([rltbse])-op(?:acity)?-?(.+)$/, Fe],
          [/^(?:border|b)-(block|inline)-op(?:acity)?-?(.+)$/, Fe],
          [/^(?:border|b)-([bi][se])-op(?:acity)?-?(.+)$/, Fe],
          [
            /^(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/,
            Ue,
            {
              autocomplete: [
                "(border|b)-(rounded|rd)",
                "(border|b)-(rounded|rd)-<num>",
                "(rounded|rd)",
                "(rounded|rd)-<num>"
              ]
            }
          ],
          [/^(?:border-|b-)?(?:rounded|rd)-([rltbse])(?:-(.+))?$/, Ue],
          [/^(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/, Ue],
          [/^(?:border-|b-)?(?:rounded|rd)-([bise][se])(?:-(.+))?$/, Ue],
          [/^(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/, Ue],
          [
            /^(?:border|b)-(?:style-)?()(.+)$/,
            Le,
            {
              autocomplete: [
                "(border|b)-style",
                `(border|b)-(${ue.join("|")})`,
                "(border|b)-<directions>-style",
                `(border|b)-<directions>-(${ue.join("|")})`,
                `(border|b)-<directions>-style-(${ue.join("|")})`,
                `(border|b)-style-(${ue.join("|")})`
              ]
            }
          ],
          [/^(?:border|b)-([xy])-(?:style-)?(.+)$/, Le],
          [/^(?:border|b)-([rltbse])-(?:style-)?(.+)$/, Le],
          [/^(?:border|b)-(block|inline)-(?:style-)?(.+)$/, Le],
          [/^(?:border|b)-([bi][se])-(?:style-)?(.+)$/, Le]
        ];
        function no(e, t, r) {
          if (t != null)
            return { [`border${r}-color`]: A(e, t) };
          if (r === "") {
            let n = {}, o = "--un-border-opacity", i = A(e, `var(${o})`);
            return i.includes(o) && (n[o] = typeof e == "string" ? 1 : ee(e)), n["border-color"] = i, n;
          } else {
            let n = {}, o = "--un-border-opacity", i = `--un-border${r}-opacity`, a = A(e, `var(${i})`);
            return a.includes(i) && (n[o] = typeof e == "string" ? 1 : ee(e), n[i] = `var(${o})`), n[`border${r}-color`] = a, n;
          }
        }
        function Cc(e) {
          return ([, t], r) => {
            let n = ke(t, r, "borderColor");
            if (!n)
              return;
            let { alpha: o, color: i, cssColor: a } = n;
            if (a)
              return no(a, o, e);
            if (i)
              return no(i, o, e);
          };
        }
        function X([, e = "", t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.lineWidth) == null ? void 0 : _a2[t || "DEFAULT"]) ?? l.bracket.cssvar.global.px(t || "1");
          if (e in F && n != null)
            return F[e].map((o) => [`border${o}-width`, n]);
        }
        function Me([, e = "", t], r) {
          if (e in F) {
            if (q(l.bracket(t)))
              return X(["", e, t], r);
            if (Ce(t, r.theme, "borderColor"))
              return Object.assign({}, ...F[e].map((n) => Cc(n)(["", t], r.theme)));
          }
        }
        function Fe([, e = "", t]) {
          let r = l.bracket.percent.cssvar(t);
          if (e in F && r != null)
            return F[e].map((n) => [`--un-border${n}-opacity`, r]);
        }
        function Ue([, e = "", t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.borderRadius) == null ? void 0 : _a2[t || "DEFAULT"]) || l.bracket.cssvar.global.fraction.rem(t || "1");
          if (e in Fr && n != null)
            return Fr[e].map((o) => [`border${o}-radius`, n]);
        }
        function Le([, e = "", t]) {
          if (ue.includes(t) && e in F)
            return F[e].map((r) => [`border${r}-style`, t]);
        }
        var vt = [
          [
            /^op(?:acity)?-?(.+)$/,
            ([, e]) => ({ opacity: l.bracket.percent.cssvar(e) })
          ]
        ], Rc = /^\[url\(.+\)\]$/, Tc = /^\[length:.+\]$/, Ec = /^\[position:.+\]$/, wt = [
          [
            /^bg-(.+)$/,
            (...e) => {
              let t = e[0][1];
              return Rc.test(t) ? { "--un-url": l.bracket(t), "background-image": "var(--un-url)" } : Tc.test(t) && l.bracketOfLength(t) != null ? {
                "background-size": l.bracketOfLength(t).split(" ").map((r) => l.fraction.auto.px.cssvar(r) ?? r).join(" ")
              } : (to(t) || Ec.test(t)) && l.bracketOfPosition(t) != null ? {
                "background-position": l.bracketOfPosition(t).split(" ").map((r) => l.position.fraction.auto.px.cssvar(r) ?? r).join(" ")
              } : j("background-color", "bg", "backgroundColor")(...e);
            }
          ],
          [
            /^bg-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-bg-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "bg-(op|opacity)-<percent>" }
          ]
        ], oo = [[/^color-scheme-(\w+)$/, ([, e]) => ({ "color-scheme": e })]];
        var $t = [
          [
            /^@container(?:\/(\w+))?(?:-(normal))?$/,
            ([, e, t]) => (ne(
              "The container query rule is experimental and may not follow semver."
            ), { "container-type": t ?? "inline-size", "container-name": e })
          ]
        ];
        var io = ["solid", "double", "dotted", "dashed", "wavy", ...S], kt = [
          [
            /^(?:decoration-)?(underline|overline|line-through)$/,
            ([, e]) => ({ "text-decoration-line": e }),
            { autocomplete: "decoration-(underline|overline|line-through)" }
          ],
          [
            /^(?:underline|decoration)-(?:size-)?(.+)$/,
            ao,
            { autocomplete: "(underline|decoration)-<num>" }
          ],
          [
            /^(?:underline|decoration)-(auto|from-font)$/,
            ([, e]) => ({ "text-decoration-thickness": e }),
            { autocomplete: "(underline|decoration)-(auto|from-font)" }
          ],
          [
            /^(?:underline|decoration)-(.+)$/,
            jc,
            { autocomplete: "(underline|decoration)-$colors" }
          ],
          [
            /^(?:underline|decoration)-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-line-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "(underline|decoration)-(op|opacity)-<percent>" }
          ],
          [
            /^(?:underline|decoration)-offset-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "text-underline-offset": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.auto.bracket.cssvar.global.px(e)
              };
            },
            { autocomplete: "(underline|decoration)-(offset)-<num>" }
          ],
          ...io.map((e) => [`underline-${e}`, { "text-decoration-style": e }]),
          ...io.map((e) => [`decoration-${e}`, { "text-decoration-style": e }]),
          ["no-underline", { "text-decoration": "none" }],
          ["decoration-none", { "text-decoration": "none" }]
        ];
        function ao([, e], { theme: t }) {
          var _a2;
          return {
            "text-decoration-thickness": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.global.px(e)
          };
        }
        function jc(e, t) {
          if (q(l.bracket(e[1])))
            return ao(e, t);
          let r = j("text-decoration-color", "line", "borderColor")(e, t);
          if (r)
            return {
              "-webkit-text-decoration-color": r["text-decoration-color"],
              ...r
            };
        }
        var St = {
          all: "all",
          colors: [
            "color",
            "background-color",
            "border-color",
            "outline-color",
            "text-decoration-color",
            "fill",
            "stroke"
          ].join(","),
          none: "none",
          opacity: "opacity",
          shadow: "box-shadow",
          transform: "transform"
        };
        function so(e) {
          return l.properties(e) ?? St[e];
        }
        var Ct = [
          [
            /^transition(?:-([a-z-]+(?:,[a-z-]+)*))?(?:-(\d+))?$/,
            ([, e, t], { theme: r }) => {
              var _a2;
              let n = e != null ? so(e) : [
                St.colors,
                "opacity",
                "box-shadow",
                "transform",
                "filter",
                "backdrop-filter"
              ].join(",");
              if (n) {
                let o = ((_a2 = r.duration) == null ? void 0 : _a2[t || "DEFAULT"]) ?? l.time(t || "150");
                return {
                  "transition-property": n,
                  "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
                  "transition-duration": o
                };
              }
            },
            { autocomplete: `transition-(${Object.keys(St).join("|")})` }
          ],
          [
            /^(?:transition-)?duration-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "transition-duration": ((_a2 = t.duration) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.bracket.cssvar.time(e)
              };
            },
            { autocomplete: ["transition-duration-$duration", "duration-$duration"] }
          ],
          [
            /^(?:transition-)?delay-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "transition-delay": ((_a2 = t.duration) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.bracket.cssvar.time(e)
              };
            },
            { autocomplete: ["transition-delay-$duration", "delay-$duration"] }
          ],
          [
            /^(?:transition-)?ease(?:-(.+))?$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "transition-timing-function": ((_a2 = t.easing) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.bracket.cssvar(e)
              };
            },
            {
              autocomplete: [
                "transition-ease-(linear|in|out|in-out|DEFAULT)",
                "ease-(linear|in|out|in-out|DEFAULT)"
              ]
            }
          ],
          [
            /^(?:transition-)?property-(.+)$/,
            ([, e]) => ({ "transition-property": l.bracket.global(e) || so(e) }),
            {
              autocomplete: [
                `transition-property-(${[...S, ...Object.keys(St)].join("|")})`
              ]
            }
          ],
          ["transition-none", { transition: "none" }],
          ...v("transition")
        ];
        var Rt = [
          ["flex", { display: "flex" }],
          ["inline-flex", { display: "inline-flex" }],
          ["flex-inline", { display: "inline-flex" }],
          [
            /^flex-(.*)$/,
            ([, e]) => ({
              flex: l.bracket(e) != null ? l.bracket(e).split(" ").map((t) => l.cssvar.fraction(t) ?? t).join(" ") : l.cssvar.fraction(e)
            })
          ],
          ["flex-1", { flex: "1 1 0%" }],
          ["flex-auto", { flex: "1 1 auto" }],
          ["flex-initial", { flex: "0 1 auto" }],
          ["flex-none", { flex: "none" }],
          [
            /^(?:flex-)?shrink(?:-(.*))?$/,
            ([, e = ""]) => ({ "flex-shrink": l.bracket.cssvar.number(e) ?? 1 }),
            { autocomplete: ["flex-shrink-<num>", "shrink-<num>"] }
          ],
          [
            /^(?:flex-)?grow(?:-(.*))?$/,
            ([, e = ""]) => ({ "flex-grow": l.bracket.cssvar.number(e) ?? 1 }),
            { autocomplete: ["flex-grow-<num>", "grow-<num>"] }
          ],
          [
            /^(?:flex-)?basis-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "flex-basis": ((_a2 = t.spacing) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.auto.fraction.rem(e)
              };
            },
            { autocomplete: ["flex-basis-$spacing", "basis-$spacing"] }
          ],
          ["flex-row", { "flex-direction": "row" }],
          ["flex-row-reverse", { "flex-direction": "row-reverse" }],
          ["flex-col", { "flex-direction": "column" }],
          ["flex-col-reverse", { "flex-direction": "column-reverse" }],
          ["flex-wrap", { "flex-wrap": "wrap" }],
          ["flex-wrap-reverse", { "flex-wrap": "wrap-reverse" }],
          ["flex-nowrap", { "flex-wrap": "nowrap" }]
        ];
        var Tt = [
          [/^text-(.+)$/, Oc, { autocomplete: "text-$fontSize" }],
          [
            /^(?:text|font)-size-(.+)$/,
            co,
            { autocomplete: "text-size-$fontSize" }
          ],
          [/^text-(?:color-)?(.+)$/, zc, { autocomplete: "text-$colors" }],
          [
            /^(?:color|c)-(.+)$/,
            j("color", "text", "textColor"),
            { autocomplete: "(color|c)-$colors" }
          ],
          [
            /^(?:text|color|c)-(.+)$/,
            ([, e]) => S.includes(e) ? { color: e } : void 0,
            { autocomplete: `(text|color|c)-(${S.join("|")})` }
          ],
          [
            /^(?:text|color|c)-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-text-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "(text|color|c)-(op|opacity)-<percent>" }
          ],
          [
            /^(?:font|fw)-?([^-]+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "font-weight": ((_a2 = t.fontWeight) == null ? void 0 : _a2[e]) || l.bracket.global.number(e)
              };
            },
            {
              autocomplete: [
                "(font|fw)-(100|200|300|400|500|600|700|800|900)",
                "(font|fw)-$fontWeight"
              ]
            }
          ],
          [
            /^(?:font-)?(?:leading|lh|line-height)-(.+)$/,
            ([, e], { theme: t }) => ({ "line-height": Gr(e, t, "lineHeight") }),
            { autocomplete: "(leading|lh|line-height)-$lineHeight" }
          ],
          ["font-synthesis-weight", { "font-synthesis": "weight" }],
          ["font-synthesis-style", { "font-synthesis": "style" }],
          ["font-synthesis-small-caps", { "font-synthesis": "small-caps" }],
          ["font-synthesis-none", { "font-synthesis": "none" }],
          [
            /^font-synthesis-(.+)$/,
            ([, e]) => ({ "font-synthesis": l.bracket.cssvar.global(e) })
          ],
          [
            /^(?:font-)?tracking-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "letter-spacing": ((_a2 = t.letterSpacing) == null ? void 0 : _a2[e]) || l.bracket.cssvar.global.rem(e)
              };
            },
            { autocomplete: "tracking-$letterSpacing" }
          ],
          [
            /^(?:font-)?word-spacing-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "word-spacing": ((_a2 = t.wordSpacing) == null ? void 0 : _a2[e]) || l.bracket.cssvar.global.rem(e)
              };
            },
            { autocomplete: "word-spacing-$wordSpacing" }
          ],
          [
            /^font-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "font-family": ((_a2 = t.fontFamily) == null ? void 0 : _a2[e]) || l.bracket.cssvar.global(e)
              };
            },
            { autocomplete: "font-$fontFamily" }
          ]
        ], Et = [
          [
            /^tab(?:-(.+))?$/,
            ([, e]) => {
              let t = l.bracket.cssvar.global.number(e || "4");
              if (t != null)
                return { "-moz-tab-size": t, "-o-tab-size": t, "tab-size": t };
            }
          ]
        ], jt = [
          [
            /^indent(?:-(.+))?$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "text-indent": ((_a2 = t.textIndent) == null ? void 0 : _a2[e || "DEFAULT"]) || l.bracket.cssvar.global.fraction.rem(e)
              };
            },
            { autocomplete: "indent-$textIndent" }
          ]
        ], zt = [
          [
            /^text-stroke(?:-(.+))?$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "-webkit-text-stroke-width": ((_a2 = t.textStrokeWidth) == null ? void 0 : _a2[e || "DEFAULT"]) || l.bracket.cssvar.px(e)
              };
            },
            { autocomplete: "text-stroke-$textStrokeWidth" }
          ],
          [
            /^text-stroke-(.+)$/,
            j("-webkit-text-stroke-color", "text-stroke", "borderColor"),
            { autocomplete: "text-stroke-$colors" }
          ],
          [
            /^text-stroke-op(?:acity)?-?(.+)$/,
            ([, e]) => ({
              "--un-text-stroke-opacity": l.bracket.percent.cssvar(e)
            }),
            { autocomplete: "text-stroke-(op|opacity)-<percent>" }
          ]
        ], Ot = [
          [
            /^text-shadow(?:-(.+))?$/,
            ([, e], { theme: t }) => {
              var _a2;
              let r = (_a2 = t.textShadow) == null ? void 0 : _a2[e || "DEFAULT"];
              return r != null ? {
                "--un-text-shadow": Se(r, "--un-text-shadow-color").join(","),
                "text-shadow": "var(--un-text-shadow)"
              } : { "text-shadow": l.bracket.cssvar.global(e) };
            },
            { autocomplete: "text-shadow-$textShadow" }
          ],
          [
            /^text-shadow-color-(.+)$/,
            j("--un-text-shadow-color", "text-shadow", "shadowColor"),
            { autocomplete: "text-shadow-color-$colors" }
          ],
          [
            /^text-shadow-color-op(?:acity)?-?(.+)$/,
            ([, e]) => ({
              "--un-text-shadow-opacity": l.bracket.percent.cssvar(e)
            }),
            { autocomplete: "text-shadow-color-(op|opacity)-<percent>" }
          ]
        ];
        function Gr(e, t, r) {
          var _a2;
          return ((_a2 = t[r]) == null ? void 0 : _a2[e]) || l.bracket.cssvar.global.rem(e);
        }
        function co([, e], { theme: t }) {
          var _a2, _b;
          let n = ((_b = _((_a2 = t.fontSize) == null ? void 0 : _a2[e])) == null ? void 0 : _b[0]) ?? l.bracket.cssvar.global.rem(e);
          if (n != null)
            return { "font-size": n };
        }
        function zc(e, t) {
          return q(l.bracket(e[1])) ? co(e, t) : j("color", "text", "textColor")(e, t);
        }
        function Oc([, e = "base"], { theme: t }) {
          var _a2;
          let r = Kr(e, "length");
          if (!r)
            return;
          let [n, o] = r, i = _((_a2 = t.fontSize) == null ? void 0 : _a2[n]), a = o ? Gr(o, t, "lineHeight") : void 0;
          if (i == null ? void 0 : i[0]) {
            let [c, f, u] = i;
            return typeof f == "object" ? { "font-size": c, ...f } : {
              "font-size": c,
              "line-height": a ?? f ?? "1",
              "letter-spacing": u ? Gr(u, t, "letterSpacing") : void 0
            };
          }
          let s = l.bracketOfLength.rem(n);
          return a && s ? { "font-size": s, "line-height": a } : { "font-size": l.bracketOfLength.rem(e) };
        }
        var Ac = { "": "", x: "column-", y: "row-", col: "column-", row: "row-" };
        function Hr([, e = "", t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.spacing) == null ? void 0 : _a2[t]) ?? l.bracket.cssvar.global.rem(t);
          if (n != null)
            return { [`${Ac[e]}gap`]: n };
        }
        var At = [
          [
            /^(?:flex-|grid-)?gap-?()(.+)$/,
            Hr,
            { autocomplete: ["gap-$spacing", "gap-<num>"] }
          ],
          [
            /^(?:flex-|grid-)?gap-([xy])-?(.+)$/,
            Hr,
            { autocomplete: ["gap-(x|y)-$spacing", "gap-(x|y)-<num>"] }
          ],
          [
            /^(?:flex-|grid-)?gap-(col|row)-?(.+)$/,
            Hr,
            { autocomplete: ["gap-(col|row)-$spacing", "gap-(col|row)-<num>"] }
          ]
        ];
        function J(e) {
          return e.replace("col", "column");
        }
        function qr(e) {
          return e[0] === "r" ? "Row" : "Column";
        }
        function Vc(e, t, r) {
          var _a2;
          let n = (_a2 = t[`gridAuto${qr(e)}`]) == null ? void 0 : _a2[r];
          if (n != null)
            return n;
          switch (r) {
            case "min":
              return "min-content";
            case "max":
              return "max-content";
            case "fr":
              return "minmax(0,1fr)";
          }
          return l.bracket.cssvar.auto.rem(r);
        }
        var Vt = [
          ["grid", { display: "grid" }],
          ["inline-grid", { display: "inline-grid" }],
          [
            /^(?:grid-)?(row|col)-(.+)$/,
            ([, e, t], { theme: r }) => {
              var _a2;
              return {
                [`grid-${J(e)}`]: ((_a2 = r[`grid${qr(e)}`]) == null ? void 0 : _a2[t]) ?? l.bracket.cssvar.auto(t)
              };
            }
          ],
          [
            /^(?:grid-)?(row|col)-span-(.+)$/,
            ([, e, t]) => {
              if (t === "full")
                return { [`grid-${J(e)}`]: "1/-1" };
              let r = l.bracket.number(t);
              if (r != null)
                return { [`grid-${J(e)}`]: `span ${r}/span ${r}` };
            },
            { autocomplete: ["grid-(row|col)-span-<num>", "(row|col)-span-<num>"] }
          ],
          [
            /^(?:grid-)?(row|col)-start-(.+)$/,
            ([, e, t]) => ({ [`grid-${J(e)}-start`]: l.bracket.cssvar(t) ?? t })
          ],
          [
            /^(?:grid-)?(row|col)-end-(.+)$/,
            ([, e, t]) => ({ [`grid-${J(e)}-end`]: l.bracket.cssvar(t) ?? t }),
            { autocomplete: ["grid-(row|col)-(start|end)-<num>"] }
          ],
          [
            /^(?:grid-)?auto-(rows|cols)-(.+)$/,
            ([, e, t], { theme: r }) => ({ [`grid-auto-${J(e)}`]: Vc(e, r, t) }),
            { autocomplete: ["grid-auto-(rows|cols)-<num>"] }
          ],
          [
            /^(?:grid-auto-flow|auto-flow|grid-flow)-(.+)$/,
            ([, e]) => ({ "grid-auto-flow": l.bracket.cssvar(e) })
          ],
          [
            /^(?:grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)$/,
            ([, e]) => ({ "grid-auto-flow": J(e).replace("-", " ") }),
            {
              autocomplete: [
                "(grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)"
              ]
            }
          ],
          [
            /^grid-(rows|cols)-(.+)$/,
            ([, e, t], { theme: r }) => {
              var _a2;
              return {
                [`grid-template-${J(e)}`]: ((_a2 = r[`gridTemplate${qr(e)}`]) == null ? void 0 : _a2[t]) ?? l.bracket.cssvar(t)
              };
            }
          ],
          [
            /^grid-(rows|cols)-minmax-([\w.-]+)$/,
            ([, e, t]) => ({
              [`grid-template-${J(e)}`]: `repeat(auto-fill,minmax(${t},1fr))`
            })
          ],
          [
            /^grid-(rows|cols)-(\d+)$/,
            ([, e, t]) => ({
              [`grid-template-${J(e)}`]: `repeat(${t},minmax(0,1fr))`
            }),
            { autocomplete: ["grid-(rows|cols)-<num>", "grid-(rows|cols)-none"] }
          ],
          [
            /^grid-area(s)?-(.+)$/,
            ([, e, t]) => e != null ? {
              "grid-template-areas": l.cssvar(t) ?? t.split("-").map((r) => `"${l.bracket(r)}"`).join(" ")
            } : { "grid-area": l.bracket.cssvar(t) }
          ],
          ["grid-rows-none", { "grid-template-rows": "none" }],
          ["grid-cols-none", { "grid-template-columns": "none" }],
          ["grid-rows-subgrid", { "grid-template-rows": "subgrid" }],
          ["grid-cols-subgrid", { "grid-template-columns": "subgrid" }]
        ];
        var _t = ["auto", "hidden", "clip", "visible", "scroll", "overlay", ...S], Pt = [
          [
            /^(?:overflow|of)-(.+)$/,
            ([, e]) => _t.includes(e) ? { overflow: e } : void 0,
            {
              autocomplete: [
                `(overflow|of)-(${_t.join("|")})`,
                `(overflow|of)-(x|y)-(${_t.join("|")})`
              ]
            }
          ],
          [
            /^(?:overflow|of)-([xy])-(.+)$/,
            ([, e, t]) => _t.includes(t) ? { [`overflow-${e}`]: t } : void 0
          ]
        ];
        var Mt = [
          [
            /^(?:position-|pos-)?(relative|absolute|fixed|sticky)$/,
            ([, e]) => ({ position: e }),
            {
              autocomplete: [
                "(position|pos)-<position>",
                "(position|pos)-<globalKeyword>",
                "<position>"
              ]
            }
          ],
          [
            /^(?:position-|pos-)([-\w]+)$/,
            ([, e]) => S.includes(e) ? { position: e } : void 0
          ],
          [/^(?:position-|pos-)?(static)$/, ([, e]) => ({ position: e })]
        ], Ne = [
          ["justify-start", { "justify-content": "flex-start" }],
          ["justify-end", { "justify-content": "flex-end" }],
          ["justify-center", { "justify-content": "center" }],
          ["justify-between", { "justify-content": "space-between" }],
          ["justify-around", { "justify-content": "space-around" }],
          ["justify-evenly", { "justify-content": "space-evenly" }],
          ["justify-stretch", { "justify-content": "stretch" }],
          ["justify-left", { "justify-content": "left" }],
          ["justify-right", { "justify-content": "right" }],
          ...v("justify", "justify-content"),
          ["justify-items-start", { "justify-items": "start" }],
          ["justify-items-end", { "justify-items": "end" }],
          ["justify-items-center", { "justify-items": "center" }],
          ["justify-items-stretch", { "justify-items": "stretch" }],
          ...v("justify-items"),
          ["justify-self-auto", { "justify-self": "auto" }],
          ["justify-self-start", { "justify-self": "start" }],
          ["justify-self-end", { "justify-self": "end" }],
          ["justify-self-center", { "justify-self": "center" }],
          ["justify-self-stretch", { "justify-self": "stretch" }],
          ...v("justify-self")
        ], Ft = [
          [/^order-(.+)$/, ([, e]) => ({ order: l.bracket.cssvar.number(e) })],
          ["order-first", { order: "-9999" }],
          ["order-last", { order: "9999" }],
          ["order-none", { order: "0" }]
        ], Be = [
          ["content-center", { "align-content": "center" }],
          ["content-start", { "align-content": "flex-start" }],
          ["content-end", { "align-content": "flex-end" }],
          ["content-between", { "align-content": "space-between" }],
          ["content-around", { "align-content": "space-around" }],
          ["content-evenly", { "align-content": "space-evenly" }],
          ...v("content", "align-content"),
          ["items-start", { "align-items": "flex-start" }],
          ["items-end", { "align-items": "flex-end" }],
          ["items-center", { "align-items": "center" }],
          ["items-baseline", { "align-items": "baseline" }],
          ["items-stretch", { "align-items": "stretch" }],
          ...v("items", "align-items"),
          ["self-auto", { "align-self": "auto" }],
          ["self-start", { "align-self": "flex-start" }],
          ["self-end", { "align-self": "flex-end" }],
          ["self-center", { "align-self": "center" }],
          ["self-stretch", { "align-self": "stretch" }],
          ["self-baseline", { "align-self": "baseline" }],
          ...v("self", "align-self")
        ], Ut = [
          ["place-content-center", { "place-content": "center" }],
          ["place-content-start", { "place-content": "start" }],
          ["place-content-end", { "place-content": "end" }],
          ["place-content-between", { "place-content": "space-between" }],
          ["place-content-around", { "place-content": "space-around" }],
          ["place-content-evenly", { "place-content": "space-evenly" }],
          ["place-content-stretch", { "place-content": "stretch" }],
          ...v("place-content"),
          ["place-items-start", { "place-items": "start" }],
          ["place-items-end", { "place-items": "end" }],
          ["place-items-center", { "place-items": "center" }],
          ["place-items-stretch", { "place-items": "stretch" }],
          ...v("place-items"),
          ["place-self-auto", { "place-self": "auto" }],
          ["place-self-start", { "place-self": "start" }],
          ["place-self-end", { "place-self": "end" }],
          ["place-self-center", { "place-self": "center" }],
          ["place-self-stretch", { "place-self": "stretch" }],
          ...v("place-self")
        ], Lt = [...Ne, ...Be].flatMap(([e, t]) => [
          [`flex-${e}`, t],
          [`grid-${e}`, t]
        ]);
        function Yr(e, { theme: t }) {
          var _a2;
          return ((_a2 = t.spacing) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.global.auto.fraction.rem(e);
        }
        function We([, e, t], r) {
          let n = Yr(t, r);
          if (n != null && e in Mr)
            return Mr[e].map((o) => [o.slice(1), n]);
        }
        var Wt = [
          [
            /^(?:position-|pos-)?inset-(.+)$/,
            ([, e], t) => ({ inset: Yr(e, t) }),
            {
              autocomplete: [
                "(position|pos)-inset-<directions>-$spacing",
                "(position|pos)-inset-(block|inline)-$spacing",
                "(position|pos)-inset-(bs|be|is|ie)-$spacing",
                "(position|pos)-(top|left|right|bottom)-$spacing"
              ]
            }
          ],
          [/^(?:position-|pos-)?(start|end)-(.+)$/, We],
          [/^(?:position-|pos-)?inset-([xy])-(.+)$/, We],
          [/^(?:position-|pos-)?inset-([rltbse])-(.+)$/, We],
          [/^(?:position-|pos-)?inset-(block|inline)-(.+)$/, We],
          [/^(?:position-|pos-)?inset-([bi][se])-(.+)$/, We],
          [
            /^(?:position-|pos-)?(top|left|right|bottom)-(.+)$/,
            ([, e, t], r) => ({ [e]: Yr(t, r) })
          ]
        ], Nt = [
          ["float-left", { float: "left" }],
          ["float-right", { float: "right" }],
          ["float-none", { float: "none" }],
          ...v("float"),
          ["clear-left", { clear: "left" }],
          ["clear-right", { clear: "right" }],
          ["clear-both", { clear: "both" }],
          ["clear-none", { clear: "none" }],
          ...v("clear")
        ], Bt = [
          [
            /^(?:position-|pos-)?z([\d.]+)$/,
            ([, e]) => ({ "z-index": l.number(e) })
          ],
          [
            /^(?:position-|pos-)?z-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "z-index": ((_a2 = t.zIndex) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.global.auto.number(e)
              };
            },
            { autocomplete: "z-<num>" }
          ]
        ], Dt = [
          ["box-border", { "box-sizing": "border-box" }],
          ["box-content", { "box-sizing": "content-box" }],
          ...v("box", "box-sizing")
        ];
        var _c = [
          "auto",
          "default",
          "none",
          "context-menu",
          "help",
          "pointer",
          "progress",
          "wait",
          "cell",
          "crosshair",
          "text",
          "vertical-text",
          "alias",
          "copy",
          "move",
          "no-drop",
          "not-allowed",
          "grab",
          "grabbing",
          "all-scroll",
          "col-resize",
          "row-resize",
          "n-resize",
          "e-resize",
          "s-resize",
          "w-resize",
          "ne-resize",
          "nw-resize",
          "se-resize",
          "sw-resize",
          "ew-resize",
          "ns-resize",
          "nesw-resize",
          "nwse-resize",
          "zoom-in",
          "zoom-out"
        ], Pc = [
          "none",
          "strict",
          "content",
          "size",
          "inline-size",
          "layout",
          "style",
          "paint"
        ], T = " ", It = [
          ["inline", { display: "inline" }],
          ["block", { display: "block" }],
          ["inline-block", { display: "inline-block" }],
          ["contents", { display: "contents" }],
          ["flow-root", { display: "flow-root" }],
          ["list-item", { display: "list-item" }],
          ["hidden", { display: "none" }],
          [/^display-(.+)$/, ([, e]) => ({ display: l.bracket.cssvar.global(e) })]
        ], Kt = [
          ["visible", { visibility: "visible" }],
          ["invisible", { visibility: "hidden" }],
          ["backface-visible", { "backface-visibility": "visible" }],
          ["backface-hidden", { "backface-visibility": "hidden" }],
          ...v("backface", "backface-visibility")
        ], Gt = [
          [/^cursor-(.+)$/, ([, e]) => ({ cursor: l.bracket.cssvar.global(e) })],
          ..._c.map((e) => [`cursor-${e}`, { cursor: e }])
        ], Ht = [
          [
            /^contain-(.*)$/,
            ([, e]) => l.bracket(e) != null ? {
              contain: l.bracket(e).split(" ").map((t) => l.cssvar.fraction(t) ?? t).join(" ")
            } : Pc.includes(e) ? { contain: e } : void 0
          ]
        ], qt = [
          ["pointer-events-auto", { "pointer-events": "auto" }],
          ["pointer-events-none", { "pointer-events": "none" }],
          ...v("pointer-events")
        ], Yt = [
          ["resize-x", { resize: "horizontal" }],
          ["resize-y", { resize: "vertical" }],
          ["resize", { resize: "both" }],
          ["resize-none", { resize: "none" }],
          ...v("resize")
        ], Xt = [
          ["select-auto", { "-webkit-user-select": "auto", "user-select": "auto" }],
          ["select-all", { "-webkit-user-select": "all", "user-select": "all" }],
          ["select-text", { "-webkit-user-select": "text", "user-select": "text" }],
          ["select-none", { "-webkit-user-select": "none", "user-select": "none" }],
          ...v("select", "user-select")
        ], Zt = [
          [
            /^(?:whitespace-|ws-)([-\w]+)$/,
            ([, e]) => [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
              ...S
            ].includes(e) ? { "white-space": e } : void 0,
            {
              autocomplete: "(whitespace|ws)-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)"
            }
          ]
        ], Jt = [
          [
            /^intrinsic-size-(.+)$/,
            ([, e]) => ({
              "contain-intrinsic-size": l.bracket.cssvar.global.fraction.rem(e)
            }),
            { autocomplete: "intrinsic-size-<num>" }
          ],
          ["content-visibility-visible", { "content-visibility": "visible" }],
          ["content-visibility-hidden", { "content-visibility": "hidden" }],
          ["content-visibility-auto", { "content-visibility": "auto" }],
          ...v("content-visibility")
        ], Qt = [
          [/^content-(.+)$/, ([, e]) => ({ content: l.bracket.cssvar(e) })],
          ["content-empty", { content: '""' }],
          ["content-none", { content: "none" }]
        ], er = [
          ["break-normal", { "overflow-wrap": "normal", "word-break": "normal" }],
          ["break-words", { "overflow-wrap": "break-word" }],
          ["break-all", { "word-break": "break-all" }],
          ["break-keep", { "word-break": "keep-all" }],
          ["break-anywhere", { "overflow-wrap": "anywhere" }]
        ], tr = [
          ["text-wrap", { "text-wrap": "wrap" }],
          ["text-nowrap", { "text-wrap": "nowrap" }],
          ["text-balance", { "text-wrap": "balance" }],
          ["text-pretty", { "text-wrap": "pretty" }]
        ], rr = [
          [
            "truncate",
            {
              overflow: "hidden",
              "text-overflow": "ellipsis",
              "white-space": "nowrap"
            }
          ],
          [
            "text-truncate",
            {
              overflow: "hidden",
              "text-overflow": "ellipsis",
              "white-space": "nowrap"
            }
          ],
          ["text-ellipsis", { "text-overflow": "ellipsis" }],
          ["text-clip", { "text-overflow": "clip" }]
        ], nr = [
          ["case-upper", { "text-transform": "uppercase" }],
          ["case-lower", { "text-transform": "lowercase" }],
          ["case-capital", { "text-transform": "capitalize" }],
          ["case-normal", { "text-transform": "none" }],
          ...v("case", "text-transform")
        ], or = [
          ["italic", { "font-style": "italic" }],
          ["not-italic", { "font-style": "normal" }],
          ["font-italic", { "font-style": "italic" }],
          ["font-not-italic", { "font-style": "normal" }],
          ["oblique", { "font-style": "oblique" }],
          ["not-oblique", { "font-style": "normal" }],
          ["font-oblique", { "font-style": "oblique" }],
          ["font-not-oblique", { "font-style": "normal" }]
        ], ir = [
          [
            "antialiased",
            {
              "-webkit-font-smoothing": "antialiased",
              "-moz-osx-font-smoothing": "grayscale"
            }
          ],
          [
            "subpixel-antialiased",
            { "-webkit-font-smoothing": "auto", "-moz-osx-font-smoothing": "auto" }
          ]
        ];
        var ar = {
          "--un-ring-inset": T,
          "--un-ring-offset-width": "0px",
          "--un-ring-offset-color": "#fff",
          "--un-ring-width": "0px",
          "--un-ring-color": "rgb(147 197 253 / 0.5)",
          "--un-shadow": "0 0 rgb(0 0 0 / 0)"
        }, sr = [
          [
            /^ring(?:-(.+))?$/,
            ([, e], { theme: t }) => {
              var _a2;
              let r = ((_a2 = t.ringWidth) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.px(e || "1");
              if (r)
                return {
                  "--un-ring-width": r,
                  "--un-ring-offset-shadow": "var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color)",
                  "--un-ring-shadow": "var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color)",
                  "box-shadow": "var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"
                };
            },
            { autocomplete: "ring-$ringWidth" }
          ],
          [
            /^ring-(?:width-|size-)(.+)$/,
            lo,
            { autocomplete: "ring-(width|size)-$lineWidth" }
          ],
          ["ring-offset", { "--un-ring-offset-width": "1px" }],
          [
            /^ring-offset-(?:width-|size-)?(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "--un-ring-offset-width": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.px(e)
              };
            },
            { autocomplete: "ring-offset-(width|size)-$lineWidth" }
          ],
          [/^ring-(.+)$/, Mc, { autocomplete: "ring-$colors" }],
          [
            /^ring-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-ring-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "ring-(op|opacity)-<percent>" }
          ],
          [
            /^ring-offset-(.+)$/,
            j("--un-ring-offset-color", "ring-offset", "borderColor"),
            { autocomplete: "ring-offset-$colors" }
          ],
          [
            /^ring-offset-op(?:acity)?-?(.+)$/,
            ([, e]) => ({
              "--un-ring-offset-opacity": l.bracket.percent.cssvar(e)
            }),
            { autocomplete: "ring-offset-(op|opacity)-<percent>" }
          ],
          ["ring-inset", { "--un-ring-inset": "inset" }]
        ];
        function lo([, e], { theme: t }) {
          var _a2;
          return { "--un-ring-width": ((_a2 = t.ringWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.px(e) };
        }
        function Mc(e, t) {
          return q(l.bracket(e[1])) ? lo(e, t) : j("--un-ring-color", "ring", "borderColor")(e, t);
        }
        var cr = {
          "--un-ring-offset-shadow": "0 0 rgb(0 0 0 / 0)",
          "--un-ring-shadow": "0 0 rgb(0 0 0 / 0)",
          "--un-shadow-inset": T,
          "--un-shadow": "0 0 rgb(0 0 0 / 0)"
        }, lr = [
          [
            /^shadow(?:-(.+))?$/,
            (e, t) => {
              var _a2;
              let [, r] = e, { theme: n } = t, o = (_a2 = n.boxShadow) == null ? void 0 : _a2[r || "DEFAULT"], i = r ? l.bracket.cssvar(r) : void 0;
              return (o != null || i != null) && !Ce(i, n, "shadowColor") ? {
                "--un-shadow": Se(o || i, "--un-shadow-color").join(","),
                "box-shadow": "var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"
              } : j("--un-shadow-color", "shadow", "shadowColor")(e, t);
            },
            { autocomplete: ["shadow-$colors", "shadow-$boxShadow"] }
          ],
          [
            /^shadow-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-shadow-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "shadow-(op|opacity)-<percent>" }
          ],
          ["shadow-inset", { "--un-shadow-inset": "inset" }]
        ];
        var Fc = {
          h: "height",
          w: "width",
          inline: "inline-size",
          block: "block-size"
        };
        function pe(e, t) {
          return `${e || ""}${Fc[t]}`;
        }
        function fr(e, t, r, n) {
          var _a2;
          let o = pe(e, t).replace(/-(\w)/g, (a, s) => s.toUpperCase()), i = (_a2 = r[o]) == null ? void 0 : _a2[n];
          if (i != null)
            return i;
          switch (n) {
            case "fit":
            case "max":
            case "min":
              return `${n}-content`;
          }
          return l.bracket.cssvar.global.auto.fraction.rem(n);
        }
        var ur = [
          [
            /^size-(min-|max-)?(.+)$/,
            ([, e, t], { theme: r }) => ({
              [pe(e, "w")]: fr(e, "w", r, t),
              [pe(e, "h")]: fr(e, "h", r, t)
            })
          ],
          [
            /^(?:size-)?(min-|max-)?([wh])-?(.+)$/,
            ([, e, t, r], { theme: n }) => ({ [pe(e, t)]: fr(e, t, n, r) })
          ],
          [
            /^(?:size-)?(min-|max-)?(block|inline)-(.+)$/,
            ([, e, t, r], { theme: n }) => ({ [pe(e, t)]: fr(e, t, n, r) }),
            {
              autocomplete: [
                "(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
                "(block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
                "(max|min)-(w|h|block|inline)",
                "(max|min)-(w|h|block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
                "(w|h)-full",
                "(max|min)-(w|h)-full"
              ]
            }
          ],
          [
            /^(?:size-)?(min-|max-)?(h)-screen-(.+)$/,
            ([, e, t, r], n) => ({ [pe(e, t)]: fo(n, r, "verticalBreakpoints") })
          ],
          [
            /^(?:size-)?(min-|max-)?(w)-screen-(.+)$/,
            ([, e, t, r], n) => ({ [pe(e, t)]: fo(n, r) }),
            {
              autocomplete: [
                "(w|h)-screen",
                "(min|max)-(w|h)-screen",
                "h-screen-$verticalBreakpoints",
                "(min|max)-h-screen-$verticalBreakpoints",
                "w-screen-$breakpoints",
                "(min|max)-w-screen-$breakpoints"
              ]
            }
          ]
        ];
        function fo(e, t, r = "breakpoints") {
          var _a2;
          let n = fe(e, r);
          if (n)
            return (_a2 = n.find((o) => o.point === t)) == null ? void 0 : _a2.size;
        }
        function Uc(e) {
          if (/^\d+\/\d+$/.test(e))
            return e;
          switch (e) {
            case "square":
              return "1/1";
            case "video":
              return "16/9";
          }
          return l.bracket.cssvar.global.auto.number(e);
        }
        var pr = [
          [
            /^(?:size-)?aspect-(?:ratio-)?(.+)$/,
            ([, e]) => ({ "aspect-ratio": Uc(e) }),
            {
              autocomplete: [
                "aspect-(square|video|ratio)",
                "aspect-ratio-(square|video)"
              ]
            }
          ]
        ];
        var dr = [
          [
            /^pa?()-?(-?.+)$/,
            V("padding"),
            { autocomplete: ["(m|p)<num>", "(m|p)-<num>"] }
          ],
          [/^p-?xy()()$/, V("padding"), { autocomplete: "(m|p)-(xy)" }],
          [/^p-?([xy])(?:-?(-?.+))?$/, V("padding")],
          [
            /^p-?([rltbse])(?:-?(-?.+))?$/,
            V("padding"),
            { autocomplete: "(m|p)<directions>-<num>" }
          ],
          [
            /^p-(block|inline)(?:-(-?.+))?$/,
            V("padding"),
            { autocomplete: "(m|p)-(block|inline)-<num>" }
          ],
          [
            /^p-?([bi][se])(?:-?(-?.+))?$/,
            V("padding"),
            { autocomplete: "(m|p)-(bs|be|is|ie)-<num>" }
          ]
        ], mr = [
          [/^ma?()-?(-?.+)$/, V("margin")],
          [/^m-?xy()()$/, V("margin")],
          [/^m-?([xy])(?:-?(-?.+))?$/, V("margin")],
          [/^m-?([rltbse])(?:-?(-?.+))?$/, V("margin")],
          [/^m-(block|inline)(?:-(-?.+))?$/, V("margin")],
          [/^m-?([bi][se])(?:-?(-?.+))?$/, V("margin")]
        ];
        var hr = ["translate", "rotate", "scale"], de = [
          "translateX(var(--un-translate-x))",
          "translateY(var(--un-translate-y))",
          "translateZ(var(--un-translate-z))",
          "rotate(var(--un-rotate))",
          "rotateX(var(--un-rotate-x))",
          "rotateY(var(--un-rotate-y))",
          "rotateZ(var(--un-rotate-z))",
          "skewX(var(--un-skew-x))",
          "skewY(var(--un-skew-y))",
          "scaleX(var(--un-scale-x))",
          "scaleY(var(--un-scale-y))",
          "scaleZ(var(--un-scale-z))"
        ].join(" "), Lc = [
          "translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z))",
          "rotate(var(--un-rotate))",
          "rotateX(var(--un-rotate-x))",
          "rotateY(var(--un-rotate-y))",
          "rotateZ(var(--un-rotate-z))",
          "skewX(var(--un-skew-x))",
          "skewY(var(--un-skew-y))",
          "scaleX(var(--un-scale-x))",
          "scaleY(var(--un-scale-y))",
          "scaleZ(var(--un-scale-z))"
        ].join(" "), gr = {
          "--un-rotate": 0,
          "--un-rotate-x": 0,
          "--un-rotate-y": 0,
          "--un-rotate-z": 0,
          "--un-scale-x": 1,
          "--un-scale-y": 1,
          "--un-scale-z": 1,
          "--un-skew-x": 0,
          "--un-skew-y": 0,
          "--un-translate-x": 0,
          "--un-translate-y": 0,
          "--un-translate-z": 0
        }, br = [
          [
            /^(?:transform-)?origin-(.+)$/,
            ([, e]) => ({ "transform-origin": M[e] ?? l.bracket.cssvar(e) }),
            {
              autocomplete: [
                `transform-origin-(${Object.keys(M).join("|")})`,
                `origin-(${Object.keys(M).join("|")})`
              ]
            }
          ],
          [
            /^(?:transform-)?perspect(?:ive)?-(.+)$/,
            ([, e]) => {
              let t = l.bracket.cssvar.px.numberWithUnit(e);
              if (t != null)
                return { "-webkit-perspective": t, perspective: t };
            }
          ],
          [
            /^(?:transform-)?perspect(?:ive)?-origin-(.+)$/,
            ([, e]) => {
              let t = l.bracket.cssvar(e) ?? (e.length >= 3 ? M[e] : void 0);
              if (t != null)
                return { "-webkit-perspective-origin": t, "perspective-origin": t };
            }
          ],
          [/^(?:transform-)?translate-()(.+)$/, uo],
          [/^(?:transform-)?translate-([xyz])-(.+)$/, uo],
          [/^(?:transform-)?rotate-()(.+)$/, mo],
          [/^(?:transform-)?rotate-([xyz])-(.+)$/, mo],
          [/^(?:transform-)?skew-()(.+)$/, ho],
          [
            /^(?:transform-)?skew-([xy])-(.+)$/,
            ho,
            {
              autocomplete: [
                "transform-skew-(x|y)-<percent>",
                "skew-(x|y)-<percent>"
              ]
            }
          ],
          [/^(?:transform-)?scale-()(.+)$/, po],
          [
            /^(?:transform-)?scale-([xyz])-(.+)$/,
            po,
            {
              autocomplete: [
                `transform-(${hr.join("|")})-<percent>`,
                `transform-(${hr.join("|")})-(x|y|z)-<percent>`,
                `(${hr.join("|")})-<percent>`,
                `(${hr.join("|")})-(x|y|z)-<percent>`
              ]
            }
          ],
          [
            /^(?:transform-)?preserve-3d$/,
            () => ({ "transform-style": "preserve-3d" })
          ],
          [/^(?:transform-)?preserve-flat$/, () => ({ "transform-style": "flat" })],
          ["transform", { transform: de }],
          ["transform-cpu", { transform: de }],
          ["transform-gpu", { transform: Lc }],
          ["transform-none", { transform: "none" }],
          ...v("transform")
        ];
        function uo([, e, t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.spacing) == null ? void 0 : _a2[t]) ?? l.bracket.cssvar.fraction.rem(t);
          if (n != null)
            return [
              ...at2[e].map((o) => [`--un-translate${o}`, n]),
              ["transform", de]
            ];
        }
        function po([, e, t]) {
          let r = l.bracket.cssvar.fraction.percent(t);
          if (r != null)
            return [...at2[e].map((n) => [`--un-scale${n}`, r]), ["transform", de]];
        }
        function mo([, e = "", t]) {
          let r = l.bracket.cssvar.degree(t);
          if (r != null)
            return e ? { "--un-rotate": 0, [`--un-rotate-${e}`]: r, transform: de } : {
              "--un-rotate-x": 0,
              "--un-rotate-y": 0,
              "--un-rotate-z": 0,
              "--un-rotate": r,
              transform: de
            };
        }
        function ho([, e, t]) {
          let r = l.bracket.cssvar.degree(t);
          if (r != null)
            return [...at2[e].map((n) => [`--un-skew${n}`, r]), ["transform", de]];
        }
        var Wc = {
          backface: "backface-visibility",
          break: "word-break",
          case: "text-transform",
          content: "align-content",
          fw: "font-weight",
          items: "align-items",
          justify: "justify-content",
          select: "user-select",
          self: "align-self",
          vertical: "vertical-align",
          visible: "visibility",
          whitespace: "white-space",
          ws: "white-space"
        }, xr = [
          [
            /^(.+?)-(\$.+)$/,
            ([, e, t]) => {
              let r = Wc[e];
              if (r)
                return { [r]: l.cssvar(t) };
            }
          ]
        ], yr = [
          [
            /^\[(.*)\]$/,
            ([e, t], { theme: r }) => {
              if (!t.includes(":"))
                return;
              let [n, ...o] = t.split(":"), i = o.join(":");
              if (!Bc(t) && /^[a-z-]+$/.test(n) && Nc(i)) {
                let a;
                if (Xn(i) && (a = Zn(i, r)), (!a || a === i) && (a = l.bracket(`[${i}]`)), a)
                  return { [n]: a };
              }
            }
          ]
        ];
        function Nc(e) {
          let t = 0;
          function r(n) {
            for (; t < e.length; )
              if (t += 1, e[t] === n)
                return true;
            return false;
          }
          for (t = 0; t < e.length; t++) {
            let n = e[t];
            if ("\"`'".includes(n)) {
              if (!r(n))
                return false;
            } else if (n === "(") {
              if (!r(")"))
                return false;
            } else if ("[]{}:".includes(n))
              return false;
          }
          return true;
        }
        function Bc(e) {
          if (!e.includes("://"))
            return false;
          try {
            return new URL(e).host !== "";
          } catch {
            return false;
          }
        }
        var vr = [
          [
            /^(where|\?)$/,
            (e, { constructCSS: t, generator: r }) => {
              if (r.userConfig.envMode === "dev")
                return `@keyframes __un_qm{0%{box-shadow:inset 4px 4px #ff1e90, inset -4px -4px #ff1e90}100%{box-shadow:inset 8px 8px #3399ff, inset -8px -8px #3399ff}}
${t({ animation: "__un_qm 0.5s ease-in-out alternate infinite" })}`;
            }
          ]
        ];
        var wr = [
          [
            /^fill-(.+)$/,
            j("fill", "fill", "backgroundColor"),
            { autocomplete: "fill-$colors" }
          ],
          [
            /^fill-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-fill-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "fill-(op|opacity)-<percent>" }
          ],
          ["fill-none", { fill: "none" }],
          [
            /^stroke-(?:width-|size-)?(.+)$/,
            go,
            { autocomplete: ["stroke-width-$lineWidth", "stroke-size-$lineWidth"] }
          ],
          [
            /^stroke-dash-(.+)$/,
            ([, e]) => ({ "stroke-dasharray": l.bracket.cssvar.number(e) }),
            { autocomplete: "stroke-dash-<num>" }
          ],
          [
            /^stroke-offset-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "stroke-dashoffset": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.px.numberWithUnit(e)
              };
            },
            { autocomplete: "stroke-offset-$lineWidth" }
          ],
          [/^stroke-(.+)$/, Dc, { autocomplete: "stroke-$colors" }],
          [
            /^stroke-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-stroke-opacity": l.bracket.percent.cssvar(e) }),
            { autocomplete: "stroke-(op|opacity)-<percent>" }
          ],
          ["stroke-cap-square", { "stroke-linecap": "square" }],
          ["stroke-cap-round", { "stroke-linecap": "round" }],
          ["stroke-cap-auto", { "stroke-linecap": "butt" }],
          ["stroke-join-arcs", { "stroke-linejoin": "arcs" }],
          ["stroke-join-bevel", { "stroke-linejoin": "bevel" }],
          ["stroke-join-clip", { "stroke-linejoin": "miter-clip" }],
          ["stroke-join-round", { "stroke-linejoin": "round" }],
          ["stroke-join-auto", { "stroke-linejoin": "miter" }],
          ["stroke-none", { stroke: "none" }]
        ];
        function go([, e], { theme: t }) {
          var _a2;
          return {
            "stroke-width": ((_a2 = t.lineWidth) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.fraction.px.number(e)
          };
        }
        function Dc(e, t) {
          return q(l.bracket(e[1])) ? go(e, t) : j("stroke", "stroke", "borderColor")(e, t);
        }
        var bo = [
          xr,
          yr,
          dr,
          mr,
          It,
          vt,
          wt,
          oo,
          wr,
          yt,
          Jt,
          Qt,
          Tt,
          Et,
          jt,
          rr,
          kt,
          zt,
          Ot,
          nr,
          mt,
          or,
          ir,
          lr,
          sr,
          Rt,
          Vt,
          At,
          Mt,
          ur,
          pr,
          Gt,
          Kt,
          qt,
          Yt,
          dt,
          Xt,
          Zt,
          er,
          Pt,
          gt2,
          bt,
          Ft,
          Ne,
          Be,
          Ut,
          Lt,
          Wt,
          Nt,
          Bt,
          Dt,
          Ct,
          br,
          xt,
          $t,
          Ht,
          tr,
          vr
        ].flat(1);
        var Xr = {
          inherit: "inherit",
          current: "currentColor",
          transparent: "transparent",
          black: "#000",
          white: "#fff",
          rose: {
            50: "#fff1f2",
            100: "#ffe4e6",
            200: "#fecdd3",
            300: "#fda4af",
            400: "#fb7185",
            500: "#f43f5e",
            600: "#e11d48",
            700: "#be123c",
            800: "#9f1239",
            900: "#881337",
            950: "#4c0519"
          },
          pink: {
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#fbcfe8",
            300: "#f9a8d4",
            400: "#f472b6",
            500: "#ec4899",
            600: "#db2777",
            700: "#be185d",
            800: "#9d174d",
            900: "#831843",
            950: "#500724"
          },
          fuchsia: {
            50: "#fdf4ff",
            100: "#fae8ff",
            200: "#f5d0fe",
            300: "#f0abfc",
            400: "#e879f9",
            500: "#d946ef",
            600: "#c026d3",
            700: "#a21caf",
            800: "#86198f",
            900: "#701a75",
            950: "#4a044e"
          },
          purple: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87",
            950: "#3b0764"
          },
          violet: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
            950: "#2e1065"
          },
          indigo: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b"
          },
          blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            950: "#172554"
          },
          sky: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
            950: "#082f49"
          },
          cyan: {
            50: "#ecfeff",
            100: "#cffafe",
            200: "#a5f3fc",
            300: "#67e8f9",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
            800: "#155e75",
            900: "#164e63",
            950: "#083344"
          },
          teal: {
            50: "#f0fdfa",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
            950: "#042f2e"
          },
          emerald: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
            950: "#022c22"
          },
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16"
          },
          lime: {
            50: "#f7fee7",
            100: "#ecfccb",
            200: "#d9f99d",
            300: "#bef264",
            400: "#a3e635",
            500: "#84cc16",
            600: "#65a30d",
            700: "#4d7c0f",
            800: "#3f6212",
            900: "#365314",
            950: "#1a2e05"
          },
          yellow: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15",
            500: "#eab308",
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
            950: "#422006"
          },
          amber: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
            950: "#451a03"
          },
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            950: "#431407"
          },
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            950: "#450a0a"
          },
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
            950: "#030712"
          },
          slate: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617"
          },
          zinc: {
            50: "#fafafa",
            100: "#f4f4f5",
            200: "#e4e4e7",
            300: "#d4d4d8",
            400: "#a1a1aa",
            500: "#71717a",
            600: "#52525b",
            700: "#3f3f46",
            800: "#27272a",
            900: "#18181b",
            950: "#09090b"
          },
          neutral: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            950: "#0a0a0a"
          },
          stone: {
            50: "#fafaf9",
            100: "#f5f5f4",
            200: "#e7e5e4",
            300: "#d6d3d1",
            400: "#a8a29e",
            500: "#78716c",
            600: "#57534e",
            700: "#44403c",
            800: "#292524",
            900: "#1c1917",
            950: "#0c0a09"
          },
          light: {
            50: "#fdfdfd",
            100: "#fcfcfc",
            200: "#fafafa",
            300: "#f8f9fa",
            400: "#f6f6f6",
            500: "#f2f2f2",
            600: "#f1f3f5",
            700: "#e9ecef",
            800: "#dee2e6",
            900: "#dde1e3",
            950: "#d8dcdf"
          },
          dark: {
            50: "#4a4a4a",
            100: "#3c3c3c",
            200: "#323232",
            300: "#2d2d2d",
            400: "#222222",
            500: "#1f1f1f",
            600: "#1c1c1e",
            700: "#1b1b1b",
            800: "#181818",
            900: "#0f0f0f",
            950: "#080808"
          },
          get lightblue() {
            return this.sky;
          },
          get lightBlue() {
            return this.sky;
          },
          get warmgray() {
            return this.stone;
          },
          get warmGray() {
            return this.stone;
          },
          get truegray() {
            return this.neutral;
          },
          get trueGray() {
            return this.neutral;
          },
          get coolgray() {
            return this.gray;
          },
          get coolGray() {
            return this.gray;
          },
          get bluegray() {
            return this.slate;
          },
          get blueGray() {
            return this.slate;
          }
        };
        Object.values(Xr).forEach((e) => {
          typeof e != "string" && e !== void 0 && (e.DEFAULT = e.DEFAULT || e[400], Object.keys(e).forEach((t) => {
            let r = +t / 100;
            r === Math.round(r) && (e[r] = e[t]);
          }));
        });
        var xo = {
          sans: [
            "ui-sans-serif",
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            '"Noto Sans"',
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"'
          ].join(","),
          serif: [
            "ui-serif",
            "Georgia",
            "Cambria",
            '"Times New Roman"',
            "Times",
            "serif"
          ].join(","),
          mono: [
            "ui-monospace",
            "SFMono-Regular",
            "Menlo",
            "Monaco",
            "Consolas",
            '"Liberation Mono"',
            '"Courier New"',
            "monospace"
          ].join(",")
        }, yo = {
          xs: ["0.75rem", "1rem"],
          sm: ["0.875rem", "1.25rem"],
          base: ["1rem", "1.5rem"],
          lg: ["1.125rem", "1.75rem"],
          xl: ["1.25rem", "1.75rem"],
          "2xl": ["1.5rem", "2rem"],
          "3xl": ["1.875rem", "2.25rem"],
          "4xl": ["2.25rem", "2.5rem"],
          "5xl": ["3rem", "1"],
          "6xl": ["3.75rem", "1"],
          "7xl": ["4.5rem", "1"],
          "8xl": ["6rem", "1"],
          "9xl": ["8rem", "1"]
        }, vo = {
          DEFAULT: "1.5rem",
          xs: "0.5rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
          "3xl": "4rem"
        }, wo = {
          DEFAULT: "1.5rem",
          none: "0",
          sm: "thin",
          md: "medium",
          lg: "thick"
        }, $o = {
          DEFAULT: ["0 0 1px rgb(0 0 0 / 0.2)", "0 0 1px rgb(1 0 5 / 0.1)"],
          none: "0 0 rgb(0 0 0 / 0)",
          sm: "1px 1px 3px rgb(36 37 47 / 0.25)",
          md: [
            "0 1px 2px rgb(30 29 39 / 0.19)",
            "1px 2px 4px rgb(54 64 147 / 0.18)"
          ],
          lg: ["3px 3px 6px rgb(0 0 0 / 0.26)", "0 0 5px rgb(15 3 86 / 0.22)"],
          xl: [
            "1px 1px 3px rgb(0 0 0 / 0.29)",
            "2px 4px 7px rgb(73 64 125 / 0.35)"
          ]
        }, ko = {
          none: "1",
          tight: "1.25",
          snug: "1.375",
          normal: "1.5",
          relaxed: "1.625",
          loose: "2"
        }, Zr = {
          tighter: "-0.05em",
          tight: "-0.025em",
          normal: "0em",
          wide: "0.025em",
          wider: "0.05em",
          widest: "0.1em"
        }, So = {
          thin: "100",
          extralight: "200",
          light: "300",
          normal: "400",
          medium: "500",
          semibold: "600",
          bold: "700",
          extrabold: "800",
          black: "900"
        }, Co = Zr;
        var Jr = {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px"
        }, Ro = { ...Jr }, To = { DEFAULT: "1px", none: "0" }, Eo = {
          DEFAULT: "1rem",
          none: "0",
          xs: "0.75rem",
          sm: "0.875rem",
          lg: "1.125rem",
          xl: "1.25rem",
          "2xl": "1.5rem",
          "3xl": "1.875rem",
          "4xl": "2.25rem",
          "5xl": "3rem",
          "6xl": "3.75rem",
          "7xl": "4.5rem",
          "8xl": "6rem",
          "9xl": "8rem"
        }, jo = {
          DEFAULT: "150ms",
          none: "0s",
          75: "75ms",
          100: "100ms",
          150: "150ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
          700: "700ms",
          1e3: "1000ms"
        }, zo = {
          DEFAULT: "0.25rem",
          none: "0",
          sm: "0.125rem",
          md: "0.375rem",
          lg: "0.5rem",
          xl: "0.75rem",
          "2xl": "1rem",
          "3xl": "1.5rem",
          full: "9999px"
        }, Oo = {
          DEFAULT: [
            "var(--un-shadow-inset) 0 1px 3px 0 rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 1px 2px -1px rgb(0 0 0 / 0.1)"
          ],
          none: "0 0 rgb(0 0 0 / 0)",
          sm: "var(--un-shadow-inset) 0 1px 2px 0 rgb(0 0 0 / 0.05)",
          md: [
            "var(--un-shadow-inset) 0 4px 6px -1px rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 2px 4px -2px rgb(0 0 0 / 0.1)"
          ],
          lg: [
            "var(--un-shadow-inset) 0 10px 15px -3px rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 4px 6px -4px rgb(0 0 0 / 0.1)"
          ],
          xl: [
            "var(--un-shadow-inset) 0 20px 25px -5px rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 8px 10px -6px rgb(0 0 0 / 0.1)"
          ],
          "2xl": "var(--un-shadow-inset) 0 25px 50px -12px rgb(0 0 0 / 0.25)",
          inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
        }, Ao = {
          DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
          linear: "linear",
          in: "cubic-bezier(0.4, 0, 1, 1)",
          out: "cubic-bezier(0, 0, 0.2, 1)",
          "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
        }, Vo = { DEFAULT: "1px", none: "0" }, _o = { auto: "auto" }, Po = { mouse: "(hover) and (pointer: fine)" };
        var Mo = {
          DEFAULT: "8px",
          0: "0",
          sm: "4px",
          md: "12px",
          lg: "16px",
          xl: "24px",
          "2xl": "40px",
          "3xl": "64px"
        }, Fo = {
          DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
          sm: "0 1px 1px rgb(0 0 0 / 0.05)",
          md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
          lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
          xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
          "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
          none: "0 0 rgb(0 0 0 / 0)"
        };
        var De = {
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
          "2xl": "42rem",
          "3xl": "48rem",
          "4xl": "56rem",
          "5xl": "64rem",
          "6xl": "72rem",
          "7xl": "80rem",
          prose: "65ch"
        }, Qr = { auto: "auto", ...De, screen: "100vw" }, Ie = { none: "none", ...De, screen: "100vw" }, en = { auto: "auto", ...De, screen: "100vh" }, Ke = { none: "none", ...De, screen: "100vh" }, Uo = Object.fromEntries(
          Object.entries(De).map(([e, t]) => [e, `(min-width: ${t})`])
        );
        var Lo = { ...gr, ...cr, ...ar };
        var Wo = {
          width: Qr,
          height: en,
          maxWidth: Ie,
          maxHeight: Ke,
          minWidth: Ie,
          minHeight: Ke,
          inlineSize: Qr,
          blockSize: en,
          maxInlineSize: Ie,
          maxBlockSize: Ke,
          minInlineSize: Ie,
          minBlockSize: Ke,
          colors: Xr,
          fontFamily: xo,
          fontSize: yo,
          fontWeight: So,
          breakpoints: Jr,
          verticalBreakpoints: Ro,
          borderRadius: zo,
          lineHeight: ko,
          letterSpacing: Zr,
          wordSpacing: Co,
          boxShadow: Oo,
          textIndent: vo,
          textShadow: $o,
          textStrokeWidth: wo,
          blur: Mo,
          dropShadow: Fo,
          easing: Ao,
          lineWidth: To,
          spacing: Eo,
          duration: jo,
          ringWidth: Vo,
          preflightBase: Lo,
          containers: Uo,
          zIndex: _o,
          media: Po
        };
        var No = {
          name: "aria",
          match(e, t) {
            var _a2;
            let r = L("aria-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n) ?? ((_a2 = t.theme.aria) == null ? void 0 : _a2[n]) ?? "";
              if (i)
                return { matcher: o, selector: (a) => `${a}[aria-${i}]` };
            }
          }
        };
        function Bo(e) {
          var _a2;
          let t = ((_a2 = e.match(/^-?[0-9]+\.?[0-9]*/)) == null ? void 0 : _a2[0]) || "", r = e.slice(t.length);
          if (r === "px") {
            let n = Number.parseFloat(t) - 0.1;
            return Number.isNaN(n) ? e : `${n}${r}`;
          }
          return `calc(${e} - 0.1px)`;
        }
        function Do() {
          let e = {};
          return {
            name: "breakpoints",
            match(t, r) {
              let n = (fe(r) ?? []).map(({ point: o, size: i }, a) => [o, i, a]);
              for (let [o, i, a] of n) {
                e[o] || (e[o] = new RegExp(
                  `^((?:([al]t-|[<~]|max-))?${o}(?:${r.generator.config.separators.join("|")}))`
                ));
                let s = t.match(e[o]);
                if (!s)
                  continue;
                let [, c] = s, f = t.slice(c.length);
                if (f === "container")
                  continue;
                let u = c.startsWith("lt-") || c.startsWith("<") || c.startsWith("max-"), p = c.startsWith("at-") || c.startsWith("~"), d = 1e3;
                return u ? (d -= a + 1, {
                  matcher: f,
                  handle: (h, x) => x({
                    ...h,
                    parent: `${h.parent ? `${h.parent} $$ ` : ""}@media (max-width: ${Bo(i)})`,
                    parentOrder: d
                  })
                }) : (d += a + 1, p && a < n.length - 1 ? {
                  matcher: f,
                  handle: (h, x) => x({
                    ...h,
                    parent: `${h.parent ? `${h.parent} $$ ` : ""}@media (min-width: ${i}) and (max-width: ${Bo(n[a + 1][1])})`,
                    parentOrder: d
                  })
                } : {
                  matcher: f,
                  handle: (h, x) => x({
                    ...h,
                    parent: `${h.parent ? `${h.parent} $$ ` : ""}@media (min-width: ${i})`,
                    parentOrder: d
                  })
                });
              }
            },
            multiPass: true,
            autocomplete: "(at-|lt-|max-|)$breakpoints:"
          };
        }
        function Ge(e, t) {
          return {
            name: `combinator:${e}`,
            match(r, n) {
              if (!r.startsWith(e))
                return;
              let o = n.generator.config.separators, i = ie(`${e}-`, r, o);
              if (!i) {
                for (let s of o)
                  if (r.startsWith(`${e}${s}`)) {
                    i = ["", r.slice(e.length + s.length)];
                    break;
                  }
                if (!i)
                  return;
              }
              let a = l.bracket(i[0]) ?? "";
              return a === "" && (a = "*"), { matcher: i[1], selector: (s) => `${s}${t}${a}` };
            },
            multiPass: true
          };
        }
        var Io = [
          Ge("all", " "),
          Ge("children", ">"),
          Ge("next", "+"),
          Ge("sibling", "+"),
          Ge("siblings", "~")
        ];
        var Ko = {
          name: "@",
          match(e, t) {
            var _a2;
            if (e.startsWith("@container"))
              return;
            let r = L("@", e, t.generator.config.separators);
            if (r) {
              let [n, o, i] = r, a = l.bracket(n), s;
              if (a) {
                let c = l.numberWithUnit(a);
                c && (s = `(min-width: ${c})`);
              } else
                s = ((_a2 = t.theme.containers) == null ? void 0 : _a2[n]) ?? "";
              if (s)
                return ne(
                  "The container query variant is experimental and may not follow semver."
                ), {
                  matcher: o,
                  handle: (c, f) => f({
                    ...c,
                    parent: `${c.parent ? `${c.parent} $$ ` : ""}@container${i ? ` ${i} ` : " "}${s}`
                  })
                };
            }
          },
          multiPass: true
        };
        function Go(e = {}) {
          if ((e == null ? void 0 : e.dark) === "class" || typeof e.dark == "object") {
            let { dark: t = ".dark", light: r = ".light" } = typeof e.dark == "string" ? {} : e.dark;
            return [
              I("dark", (n) => ({ prefix: `${t} $$ ${n.prefix}` })),
              I("light", (n) => ({ prefix: `${r} $$ ${n.prefix}` }))
            ];
          }
          return [
            U("dark", "@media (prefers-color-scheme: dark)"),
            U("light", "@media (prefers-color-scheme: light)")
          ];
        }
        var Ho = {
          name: "data",
          match(e, t) {
            var _a2;
            let r = L("data-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n) ?? ((_a2 = t.theme.data) == null ? void 0 : _a2[n]) ?? "";
              if (i)
                return { matcher: o, selector: (a) => `${a}[data-${i}]` };
            }
          }
        };
        function $r(e) {
          return {
            name: `${e}-data`,
            match(t, r) {
              var _a2;
              let n = L(`${e}-data-`, t, r.generator.config.separators);
              if (n) {
                let [o, i] = n, a = l.bracket(o) ?? ((_a2 = r.theme.data) == null ? void 0 : _a2[o]) ?? "";
                if (a)
                  return { matcher: `${e}-[[data-${a}]]:${i}` };
              }
            }
          };
        }
        var qo = [$r("group"), $r("peer"), $r("parent"), $r("previous")];
        var Yo = [
          I("rtl", (e) => ({ prefix: `[dir="rtl"] $$ ${e.prefix}` })),
          I("ltr", (e) => ({ prefix: `[dir="ltr"] $$ ${e.prefix}` }))
        ];
        var Xo = {
          name: "selector",
          match(e, t) {
            let r = ie("selector-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n);
              if (i)
                return { matcher: o, selector: () => i };
            }
          }
        }, Zo = {
          name: "layer",
          match(e, t) {
            let r = L("layer-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n) ?? n;
              if (i)
                return {
                  matcher: o,
                  handle: (a, s) => s({
                    ...a,
                    parent: `${a.parent ? `${a.parent} $$ ` : ""}@layer ${i}`
                  })
                };
            }
          }
        }, Jo = {
          name: "uno-layer",
          match(e, t) {
            let r = L("uno-layer-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n) ?? n;
              if (i)
                return { matcher: o, layer: i };
            }
          }
        }, Qo = {
          name: "scope",
          match(e, t) {
            let r = ie("scope-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n);
              if (i)
                return { matcher: o, selector: (a) => `${i} $$ ${a}` };
            }
          }
        }, ei = {
          name: "variables",
          match(e, t) {
            if (!e.startsWith("["))
              return;
            let [r, n] = ve(e, "[", "]") ?? [];
            if (!(r && n))
              return;
            let o;
            for (let s of t.generator.config.separators)
              if (n.startsWith(s)) {
                o = n.slice(s.length);
                break;
              }
            if (o == null)
              return;
            let i = l.bracket(r) ?? "", a = i.startsWith("@");
            if (a || i.includes("&"))
              return {
                matcher: o,
                handle(s, c) {
                  let f = a ? { parent: `${s.parent ? `${s.parent} $$ ` : ""}${i}` } : { selector: i.replace(/&/g, s.selector) };
                  return c({ ...s, ...f });
                }
              };
          },
          multiPass: true
        };
        var ti = /^-?[0-9.]+(?:[a-z]+|%)?$/, ri = /-?[0-9.]+(?:[a-z]+|%)?/, Ic = [/\b(opacity|color|flex|backdrop-filter|^filter|transform)\b/];
        function Kc(e) {
          let t = e.match(Ve);
          if (t) {
            let [r, n] = oe(`(${t[2]})${t[3]}`, "(", ")", " ") ?? [];
            if (r)
              return `calc(${t[1]}${r} * -1)${n ? ` ${n}` : ""}`;
          }
        }
        var Gc = /\b(hue-rotate)\s*(\(.*)/;
        function Hc(e) {
          let t = e.match(Gc);
          if (t) {
            let [r, n] = oe(t[2], "(", ")", " ") ?? [];
            if (r) {
              let o = ti.test(r.slice(1, -1)) ? r.replace(ri, (i) => i.startsWith("-") ? i.slice(1) : `-${i}`) : `(calc(${r} * -1))`;
              return `${t[1]}${o}${n ? ` ${n}` : ""}`;
            }
          }
        }
        var ni = {
          name: "negative",
          match(e) {
            if (e.startsWith("-"))
              return {
                matcher: e.slice(1),
                body: (t) => {
                  if (t.find((n) => n[0] === eo))
                    return;
                  let r = false;
                  return t.forEach((n) => {
                    var _a2;
                    let o = (_a2 = n[1]) == null ? void 0 : _a2.toString();
                    if (!o || o === "0" || Ic.some((s) => s.test(n[0])))
                      return;
                    let i = Kc(o);
                    if (i) {
                      n[1] = i, r = true;
                      return;
                    }
                    let a = Hc(o);
                    if (a) {
                      n[1] = a, r = true;
                      return;
                    }
                    ti.test(o) && (n[1] = o.replace(
                      ri,
                      (s) => s.startsWith("-") ? s.slice(1) : `-${s}`
                    ), r = true);
                  }), r ? t : [];
                }
              };
          }
        };
        function oi() {
          let e;
          return {
            name: "important",
            match(t, r) {
              e || (e = new RegExp(
                `^(important(?:${r.generator.config.separators.join("|")})|!)`
              ));
              let n, o = t.match(e);
              if (o ? n = t.slice(o[0].length) : t.endsWith("!") && (n = t.slice(0, -1)), n)
                return {
                  matcher: n,
                  body: (i) => (i.forEach((a) => {
                    a[1] && (a[1] += " !important");
                  }), i)
                };
            }
          };
        }
        var ii = U("print", "@media print"), ai = {
          name: "media",
          match(e, t) {
            var _a2;
            let r = L("media-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n) ?? "";
              if (i === "" && (i = ((_a2 = t.theme.media) == null ? void 0 : _a2[n]) ?? ""), i)
                return {
                  matcher: o,
                  handle: (a, s) => s({
                    ...a,
                    parent: `${a.parent ? `${a.parent} $$ ` : ""}@media ${i}`
                  })
                };
            }
          },
          multiPass: true
        };
        var si = {
          name: "supports",
          match(e, t) {
            var _a2;
            let r = L("supports-", e, t.generator.config.separators);
            if (r) {
              let [n, o] = r, i = l.bracket(n) ?? "";
              if (i === "" && (i = ((_a2 = t.theme.supports) == null ? void 0 : _a2[n]) ?? ""), i)
                return {
                  matcher: o,
                  handle: (a, s) => s({
                    ...a,
                    parent: `${a.parent ? `${a.parent} $$ ` : ""}@supports ${i}`
                  })
                };
            }
          },
          multiPass: true
        };
        var Re = Object.fromEntries(
          [
            ["first-letter", "::first-letter"],
            ["first-line", "::first-line"],
            "any-link",
            "link",
            "visited",
            "target",
            ["open", "[open]"],
            "default",
            "checked",
            "indeterminate",
            "placeholder-shown",
            "autofill",
            "optional",
            "required",
            "valid",
            "invalid",
            "user-valid",
            "user-invalid",
            "in-range",
            "out-of-range",
            "read-only",
            "read-write",
            "empty",
            "focus-within",
            "hover",
            "focus",
            "focus-visible",
            "active",
            "enabled",
            "disabled",
            "root",
            "empty",
            ["even-of-type", ":nth-of-type(even)"],
            ["even", ":nth-child(even)"],
            ["odd-of-type", ":nth-of-type(odd)"],
            ["odd", ":nth-child(odd)"],
            "first-of-type",
            ["first", ":first-child"],
            "last-of-type",
            ["last", ":last-child"],
            "only-child",
            "only-of-type",
            ["backdrop-element", "::backdrop"],
            ["placeholder", "::placeholder"],
            ["before", "::before"],
            ["after", "::after"],
            ["selection", "::selection"],
            ["marker", "::marker"],
            ["file", "::file-selector-button"]
          ].map((e) => Array.isArray(e) ? e : [e, `:${e}`])
        ), fi = Object.keys(Re), Te = Object.fromEntries(
          [["backdrop", "::backdrop"]].map(
            (e) => Array.isArray(e) ? e : [e, `:${e}`]
          )
        ), ui = Object.keys(Te), qc = ["not", "is", "where", "has"], tn = Object.entries(Re).filter(([, e]) => !e.startsWith("::")).map(([e]) => e).sort((e, t) => t.length - e.length).join("|"), rn = Object.entries(Te).filter(([, e]) => !e.startsWith("::")).map(([e]) => e).sort((e, t) => t.length - e.length).join("|"), me = qc.join("|");
        function Yc(e, t, r) {
          let n = new RegExp(`^(${re(t)}:)(\\S+)${re(r)}\\1`), o, i, a, s, c = (p) => {
            var _a2;
            let d = ie(`${e}-`, p, []);
            if (!d)
              return;
            let [h, x] = d, $ = l.bracket(h);
            if ($ == null)
              return;
            let y = ((_a2 = x.split(o, 1)) == null ? void 0 : _a2[0]) ?? "", C = `${t}${Q(y)}`;
            return [
              y,
              p.slice(p.length - (x.length - y.length - 1)),
              $.includes("&") ? $.replace(/&/g, C) : `${C}${$}`
            ];
          }, f = (p) => {
            let d = p.match(i) || p.match(a);
            if (!d)
              return;
            let [h, x, $] = d, y = d[3] ?? "", C = Re[$] || Te[$] || `:${$}`;
            return x && (C = `:${x}(${C})`), [y, p.slice(h.length), `${t}${Q(y)}${C}`, $];
          }, u = (p) => {
            let d = p.match(s);
            if (!d)
              return;
            let [h, x, $] = d, y = d[3] ?? "", C = `:${x}(${$})`;
            return [y, p.slice(h.length), `${t}${Q(y)}${C}`];
          };
          return {
            name: `pseudo:${e}`,
            match(p, d) {
              if (o && i && a || (o = new RegExp(`(?:${d.generator.config.separators.join("|")})`), i = new RegExp(
                `^${e}-(?:(?:(${me})-)?(${tn}))(?:(/\\w+))?(?:${d.generator.config.separators.join("|")})`
              ), a = new RegExp(
                `^${e}-(?:(?:(${me})-)?(${rn}))(?:(/\\w+))?(?:${d.generator.config.separators.filter((b) => b !== "-").join("|")})`
              ), s = new RegExp(
                `^${e}-(?:(${me})-)?\\[(.+)\\](?:(/\\w+))?(?:${d.generator.config.separators.filter((b) => b !== "-").join("|")})`
              )), !p.startsWith(e))
                return;
              let h = c(p) || f(p) || u(p);
              if (!h)
                return;
              let [x, $, y, C = ""] = h;
              return x !== "" && ne(
                "The labeled variant is experimental and may not follow semver."
              ), {
                matcher: $,
                handle: (b, R) => R({
                  ...b,
                  prefix: `${y}${r}${b.prefix}`.replace(n, "$1$2:"),
                  sort: fi.indexOf(C) ?? ui.indexOf(C)
                })
              };
            },
            multiPass: true
          };
        }
        var Xc = [
          "::-webkit-resizer",
          "::-webkit-scrollbar",
          "::-webkit-scrollbar-button",
          "::-webkit-scrollbar-corner",
          "::-webkit-scrollbar-thumb",
          "::-webkit-scrollbar-track",
          "::-webkit-scrollbar-track-piece",
          "::file-selector-button"
        ], ci = Object.entries(Re).map(([e]) => e).sort((e, t) => t.length - e.length).join("|"), li = Object.entries(Te).map(([e]) => e).sort((e, t) => t.length - e.length).join("|");
        function pi() {
          let e, t;
          return {
            name: "pseudo",
            match(r, n) {
              e && e || (e = new RegExp(
                `^(${ci})(?:${n.generator.config.separators.join("|")})`
              ), t = new RegExp(
                `^(${li})(?:${n.generator.config.separators.filter((i) => i !== "-").join("|")})`
              ));
              let o = r.match(e) || r.match(t);
              if (o) {
                let i = Re[o[1]] || Te[o[1]] || `:${o[1]}`, a = fi.indexOf(o[1]);
                return a === -1 && (a = ui.indexOf(o[1])), a === -1 && (a = void 0), {
                  matcher: r.slice(o[0].length),
                  handle: (s, c) => {
                    let f = i.startsWith("::") && !Xc.includes(i) ? { pseudo: `${s.pseudo}${i}` } : { selector: `${s.selector}${i}` };
                    return c({ ...s, ...f, sort: a, noMerge: true });
                  }
                };
              }
            },
            multiPass: true,
            autocomplete: `(${ci}|${li}):`
          };
        }
        function di() {
          let e, t, r;
          return {
            match(n, o) {
              e && t || (e = new RegExp(
                `^(${me})-(${tn})(?:${o.generator.config.separators.join("|")})`
              ), t = new RegExp(
                `^(${me})-(${rn})(?:${o.generator.config.separators.filter((a) => a !== "-").join("|")})`
              ), r = new RegExp(
                `^(${me})-(\\[.+\\])(?:${o.generator.config.separators.filter((a) => a !== "-").join("|")})`
              ));
              let i = n.match(e) || n.match(t) || n.match(r);
              if (i) {
                let a = i[1], c = ve(i[2], "[", "]") ? l.bracket(i[2]) : Re[i[2]] || Te[i[2]] || `:${i[2]}`;
                return {
                  matcher: n.slice(i[0].length),
                  selector: (f) => `${f}:${a}(${c})`
                };
              }
            },
            multiPass: true,
            autocomplete: `(${me})-(${tn}|${rn}):`
          };
        }
        function mi(e = {}) {
          let t = !!(e == null ? void 0 : e.attributifyPseudo), r = (e == null ? void 0 : e.prefix) ?? "";
          r = (Array.isArray(r) ? r : [r]).filter(Boolean)[0] ?? "";
          let n = (o, i) => Yc(o, t ? `[${r}${o}=""]` : `.${r}${o}`, i);
          return [
            n("group", " "),
            n("peer", "~"),
            n("parent", ">"),
            n("previous", "+")
          ];
        }
        var Zc = /(part-\[(.+)]:)(.+)/, hi = {
          match(e) {
            let t = e.match(Zc);
            if (t) {
              let r = `part(${t[2]})`;
              return {
                matcher: e.slice(t[1].length),
                selector: (n) => `${n}::${r}`
              };
            }
          },
          multiPass: true
        };
        function kr(e) {
          return [
            No,
            Ho,
            Zo,
            Xo,
            Jo,
            ni,
            oi(),
            si,
            ii,
            ai,
            Do(),
            ...Io,
            pi(),
            di(),
            ...mi(e),
            hi,
            ...Go(e),
            ...Yo,
            Qo,
            Ko,
            ei,
            ...qo
          ];
        }
        var gi = {
          position: ["relative", "absolute", "fixed", "sticky", "static"],
          globalKeyword: S
        };
        var bi = (e = {}) => (e.dark = e.dark ?? "class", e.attributifyPseudo = e.attributifyPseudo ?? false, e.preflight = e.preflight ?? true, e.variablePrefix = e.variablePrefix ?? "un-", {
          name: "@unocss/preset-mini",
          theme: Wo,
          rules: bo,
          variants: kr(e),
          options: e,
          prefix: e.prefix,
          postprocess: Jc(e.variablePrefix),
          preflights: e.preflight ? Qc(Bn, e.variablePrefix) : [],
          extractorDefault: e.arbitraryVariants === false ? void 0 : Nn,
          autocomplete: { shorthands: gi }
        });
        function Jc(e) {
          if (e !== "un-")
            return (t) => {
              t.entries.forEach((r) => {
                r[0] = r[0].replace(/^--un-/, `--${e}`), typeof r[1] == "string" && (r[1] = r[1].replace(/var\(--un-/g, `var(--${e}`));
              });
            };
        }
        function Qc(e, t) {
          return t !== "un-" ? e.map((r) => ({
            ...r,
            getCSS: async (n) => {
              let o = await r.getCSS(n);
              if (o)
                return o.replace(/--un-/g, `--${t}`);
            }
          })) : e;
        }
        var xi = [
          [
            /^(?:animate-)?keyframes-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2, _b;
              let r = (_b = (_a2 = t.animation) == null ? void 0 : _a2.keyframes) == null ? void 0 : _b[e];
              if (r)
                return [`@keyframes ${e}${r}`, { animation: e }];
            },
            {
              autocomplete: [
                "animate-keyframes-$animation.keyframes",
                "keyframes-$animation.keyframes"
              ]
            }
          ],
          [
            /^animate-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2, _b, _c2, _d, _e2, _f, _g, _h, _i2, _j;
              let r = (_b = (_a2 = t.animation) == null ? void 0 : _a2.keyframes) == null ? void 0 : _b[e];
              if (r) {
                let n = ((_d = (_c2 = t.animation) == null ? void 0 : _c2.durations) == null ? void 0 : _d[e]) ?? "1s", o = ((_f = (_e2 = t.animation) == null ? void 0 : _e2.timingFns) == null ? void 0 : _f[e]) ?? "linear", i = ((_h = (_g = t.animation) == null ? void 0 : _g.counts) == null ? void 0 : _h[e]) ?? 1, a = (_j = (_i2 = t.animation) == null ? void 0 : _i2.properties) == null ? void 0 : _j[e];
                return [
                  `@keyframes ${e}${r}`,
                  { animation: `${e} ${n} ${o} ${i}`, ...a }
                ];
              }
              return { animation: l.bracket.cssvar(e) };
            },
            { autocomplete: "animate-$animation.keyframes" }
          ],
          [
            /^animate-name-(.+)/,
            ([, e]) => ({ "animation-name": l.bracket.cssvar(e) ?? e })
          ],
          [
            /^animate-duration-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "animation-duration": ((_a2 = t.duration) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.bracket.cssvar.time(e)
              };
            },
            { autocomplete: ["animate-duration", "animate-duration-$duration"] }
          ],
          [
            /^animate-delay-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "animation-delay": ((_a2 = t.duration) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.bracket.cssvar.time(e)
              };
            },
            { autocomplete: ["animate-delay", "animate-delay-$duration"] }
          ],
          [
            /^animate-ease(?:-(.+))?$/,
            ([, e], { theme: t }) => {
              var _a2;
              return {
                "animation-timing-function": ((_a2 = t.easing) == null ? void 0 : _a2[e || "DEFAULT"]) ?? l.bracket.cssvar(e)
              };
            },
            { autocomplete: ["animate-ease", "animate-ease-$easing"] }
          ],
          [
            /^animate-(fill-mode-|fill-|mode-)?(.+)$/,
            ([, e, t]) => ["none", "forwards", "backwards", "both", e ? S : []].includes(t) ? { "animation-fill-mode": t } : void 0,
            {
              autocomplete: [
                "animate-(fill|mode|fill-mode)",
                "animate-(fill|mode|fill-mode)-(none|forwards|backwards|both|inherit|initial|revert|revert-layer|unset)",
                "animate-(none|forwards|backwards|both|inherit|initial|revert|revert-layer|unset)"
              ]
            }
          ],
          [
            /^animate-(direction-)?(.+)$/,
            ([, e, t]) => [
              "normal",
              "reverse",
              "alternate",
              "alternate-reverse",
              e ? S : []
            ].includes(t) ? { "animation-direction": t } : void 0,
            {
              autocomplete: [
                "animate-direction",
                "animate-direction-(normal|reverse|alternate|alternate-reverse|inherit|initial|revert|revert-layer|unset)",
                "animate-(normal|reverse|alternate|alternate-reverse|inherit|initial|revert|revert-layer|unset)"
              ]
            }
          ],
          [
            /^animate-(?:iteration-count-|iteration-|count-)(.+)$/,
            ([, e]) => ({
              "animation-iteration-count": l.bracket.cssvar(e) ?? e.replace(/\-/g, ",")
            }),
            {
              autocomplete: [
                "animate-(iteration|count|iteration-count)",
                "animate-(iteration|count|iteration-count)-<num>"
              ]
            }
          ],
          [
            /^animate-(play-state-|play-|state-)?(.+)$/,
            ([, e, t]) => ["paused", "running", e ? S : []].includes(t) ? { "animation-play-state": t } : void 0,
            {
              autocomplete: [
                "animate-(play|state|play-state)",
                "animate-(play|state|play-state)-(paused|running|inherit|initial|revert|revert-layer|unset)",
                "animate-(paused|running|inherit|initial|revert|revert-layer|unset)"
              ]
            }
          ],
          ["animate-none", { animation: "none" }],
          ...v("animate", "animation")
        ];
        function yi(e) {
          return e ? A(e, 0) : "rgb(255 255 255 / 0)";
        }
        function el(e, t, r, n) {
          return t ? n != null ? A(t, n) : A(t, `var(--un-${e}-opacity, ${ee(t)})`) : A(r, n);
        }
        function nn() {
          return ([, e, t], { theme: r }) => {
            let n = ke(t, r, "backgroundColor");
            if (!n)
              return;
            let { alpha: o, color: i, cssColor: a } = n;
            if (!i)
              return;
            let s = el(e, a, i, o);
            switch (e) {
              case "from":
                return {
                  "--un-gradient-from-position": "0%",
                  "--un-gradient-from": `${s} var(--un-gradient-from-position)`,
                  "--un-gradient-to-position": "100%",
                  "--un-gradient-to": `${yi(a)} var(--un-gradient-to-position)`,
                  "--un-gradient-stops": "var(--un-gradient-from), var(--un-gradient-to)"
                };
              case "via":
                return {
                  "--un-gradient-via-position": "50%",
                  "--un-gradient-to": yi(a),
                  "--un-gradient-stops": `var(--un-gradient-from), ${s} var(--un-gradient-via-position), var(--un-gradient-to)`
                };
              case "to":
                return {
                  "--un-gradient-to-position": "100%",
                  "--un-gradient-to": `${s} var(--un-gradient-to-position)`
                };
            }
          };
        }
        function tl() {
          return ([, e, t]) => ({
            [`--un-gradient-${e}-position`]: `${Number(l.bracket.cssvar.percent(t)) * 100}%`
          });
        }
        var vi = [
          [
            /^bg-gradient-(.+)$/,
            ([, e]) => ({ "--un-gradient": l.bracket(e) }),
            {
              autocomplete: [
                "bg-gradient",
                "bg-gradient-(from|to|via)",
                "bg-gradient-(from|to|via)-$colors",
                "bg-gradient-(from|to|via)-(op|opacity)",
                "bg-gradient-(from|to|via)-(op|opacity)-<percent>"
              ]
            }
          ],
          [
            /^(?:bg-gradient-)?stops-(\[.+\])$/,
            ([, e]) => ({ "--un-gradient-stops": l.bracket(e) })
          ],
          [/^(?:bg-gradient-)?(from)-(.+)$/, nn()],
          [/^(?:bg-gradient-)?(via)-(.+)$/, nn()],
          [/^(?:bg-gradient-)?(to)-(.+)$/, nn()],
          [
            /^(?:bg-gradient-)?(from|via|to)-op(?:acity)?-?(.+)$/,
            ([, e, t]) => ({ [`--un-${e}-opacity`]: l.bracket.percent(t) })
          ],
          [/^(from|via|to)-([\d\.]+)%$/, tl()],
          [
            /^bg-gradient-((?:repeating-)?(?:linear|radial|conic))$/,
            ([, e]) => ({
              "background-image": `${e}-gradient(var(--un-gradient, var(--un-gradient-stops, rgb(255 255 255 / 0))))`
            }),
            {
              autocomplete: [
                "bg-gradient-repeating",
                "bg-gradient-(linear|radial|conic)",
                "bg-gradient-repeating-(linear|radial|conic)"
              ]
            }
          ],
          [
            /^bg-gradient-to-([rltb]{1,2})$/,
            ([, e]) => {
              if (e in M)
                return {
                  "--un-gradient-shape": `to ${M[e]}`,
                  "--un-gradient": "var(--un-gradient-shape), var(--un-gradient-stops)",
                  "background-image": "linear-gradient(var(--un-gradient))"
                };
            },
            {
              autocomplete: `bg-gradient-to-(${Object.keys(M).filter(
              (e) => e.length <= 2 && Array.from(e).every((t) => "rltb".includes(t))
            ).join("|")})`
            }
          ],
          [
            /^(?:bg-gradient-)?shape-(.+)$/,
            ([, e]) => {
              let t = e in M ? `to ${M[e]}` : l.bracket(e);
              if (t != null)
                return {
                  "--un-gradient-shape": t,
                  "--un-gradient": "var(--un-gradient-shape), var(--un-gradient-stops)"
                };
            },
            {
              autocomplete: [
                "bg-gradient-shape",
                `bg-gradient-shape-(${Object.keys(M).join("|")})`,
                `shape-(${Object.keys(M).join("|")})`
              ]
            }
          ],
          ["bg-none", { "background-image": "none" }],
          ["box-decoration-slice", { "box-decoration-break": "slice" }],
          ["box-decoration-clone", { "box-decoration-break": "clone" }],
          ...v("box-decoration", "box-decoration-break"),
          ["bg-auto", { "background-size": "auto" }],
          ["bg-cover", { "background-size": "cover" }],
          ["bg-contain", { "background-size": "contain" }],
          ["bg-fixed", { "background-attachment": "fixed" }],
          ["bg-local", { "background-attachment": "local" }],
          ["bg-scroll", { "background-attachment": "scroll" }],
          [
            "bg-clip-border",
            {
              "-webkit-background-clip": "border-box",
              "background-clip": "border-box"
            }
          ],
          [
            "bg-clip-content",
            {
              "-webkit-background-clip": "content-box",
              "background-clip": "content-box"
            }
          ],
          [
            "bg-clip-padding",
            {
              "-webkit-background-clip": "padding-box",
              "background-clip": "padding-box"
            }
          ],
          [
            "bg-clip-text",
            { "-webkit-background-clip": "text", "background-clip": "text" }
          ],
          ...S.map((e) => [
            `bg-clip-${e}`,
            { "-webkit-background-clip": e, "background-clip": e }
          ]),
          [/^bg-([-\w]{3,})$/, ([, e]) => ({ "background-position": M[e] })],
          ["bg-repeat", { "background-repeat": "repeat" }],
          ["bg-no-repeat", { "background-repeat": "no-repeat" }],
          ["bg-repeat-x", { "background-repeat": "repeat-x" }],
          ["bg-repeat-y", { "background-repeat": "repeat-y" }],
          ["bg-repeat-round", { "background-repeat": "round" }],
          ["bg-repeat-space", { "background-repeat": "space" }],
          ...v("bg-repeat", "background-repeat"),
          ["bg-origin-border", { "background-origin": "border-box" }],
          ["bg-origin-padding", { "background-origin": "padding-box" }],
          ["bg-origin-content", { "background-origin": "content-box" }],
          ...v("bg-origin", "background-origin")
        ];
        var on = {
          disc: "disc",
          circle: "circle",
          square: "square",
          decimal: "decimal",
          "zero-decimal": "decimal-leading-zero",
          greek: "lower-greek",
          roman: "lower-roman",
          "upper-roman": "upper-roman",
          alpha: "lower-alpha",
          "upper-alpha": "upper-alpha",
          latin: "lower-latin",
          "upper-latin": "upper-latin"
        }, wi = [
          [
            /^list-(.+?)(?:-(outside|inside))?$/,
            ([, e, t]) => {
              let r = on[e];
              if (r)
                return t ? { "list-style-position": t, "list-style-type": r } : { "list-style-type": r };
            },
            {
              autocomplete: [
                `list-(${Object.keys(on).join("|")})`,
                `list-(${Object.keys(on).join("|")})-(outside|inside)`
              ]
            }
          ],
          ["list-outside", { "list-style-position": "outside" }],
          ["list-inside", { "list-style-position": "inside" }],
          ["list-none", { "list-style-type": "none" }],
          [
            /^list-image-(.+)$/,
            ([, e]) => {
              if (/^\[url\(.+\)\]$/.test(e))
                return { "list-style-image": l.bracket(e) };
            }
          ],
          ["list-image-none", { "list-style-image": "none" }],
          ...v("list", "list-style-type")
        ], $i = [
          [
            /^accent-(.+)$/,
            j("accent-color", "accent", "accentColor"),
            { autocomplete: "accent-$colors" }
          ],
          [
            /^accent-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-accent-opacity": l.bracket.percent(e) }),
            {
              autocomplete: [
                "accent-(op|opacity)",
                "accent-(op|opacity)-<percent>"
              ]
            }
          ]
        ], ki = [
          [
            /^caret-(.+)$/,
            j("caret-color", "caret", "textColor"),
            { autocomplete: "caret-$colors" }
          ],
          [
            /^caret-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-caret-opacity": l.bracket.percent(e) }),
            {
              autocomplete: ["caret-(op|opacity)", "caret-(op|opacity)-<percent>"]
            }
          ]
        ], Si = [
          ["image-render-auto", { "image-rendering": "auto" }],
          ["image-render-edge", { "image-rendering": "crisp-edges" }],
          [
            "image-render-pixel",
            [
              ["-ms-interpolation-mode", "nearest-neighbor"],
              ["image-rendering", "-webkit-optimize-contrast"],
              ["image-rendering", "-moz-crisp-edges"],
              ["image-rendering", "-o-pixelated"],
              ["image-rendering", "pixelated"]
            ]
          ]
        ], Ci = [
          ["overscroll-auto", { "overscroll-behavior": "auto" }],
          ["overscroll-contain", { "overscroll-behavior": "contain" }],
          ["overscroll-none", { "overscroll-behavior": "none" }],
          ...v("overscroll", "overscroll-behavior"),
          ["overscroll-x-auto", { "overscroll-behavior-x": "auto" }],
          ["overscroll-x-contain", { "overscroll-behavior-x": "contain" }],
          ["overscroll-x-none", { "overscroll-behavior-x": "none" }],
          ...v("overscroll-x", "overscroll-behavior-x"),
          ["overscroll-y-auto", { "overscroll-behavior-y": "auto" }],
          ["overscroll-y-contain", { "overscroll-behavior-y": "contain" }],
          ["overscroll-y-none", { "overscroll-behavior-y": "none" }],
          ...v("overscroll-y", "overscroll-behavior-y")
        ], Ri = [
          ["scroll-auto", { "scroll-behavior": "auto" }],
          ["scroll-smooth", { "scroll-behavior": "smooth" }],
          ...v("scroll", "scroll-behavior")
        ];
        var Ti = [
          [
            /^columns-(.+)$/,
            ([, e]) => ({ columns: l.bracket.global.number.auto.numberWithUnit(e) }),
            { autocomplete: "columns-<num>" }
          ],
          ["break-before-auto", { "break-before": "auto" }],
          ["break-before-avoid", { "break-before": "avoid" }],
          ["break-before-all", { "break-before": "all" }],
          ["break-before-avoid-page", { "break-before": "avoid-page" }],
          ["break-before-page", { "break-before": "page" }],
          ["break-before-left", { "break-before": "left" }],
          ["break-before-right", { "break-before": "right" }],
          ["break-before-column", { "break-before": "column" }],
          ...v("break-before"),
          ["break-inside-auto", { "break-inside": "auto" }],
          ["break-inside-avoid", { "break-inside": "avoid" }],
          ["break-inside-avoid-page", { "break-inside": "avoid-page" }],
          ["break-inside-avoid-column", { "break-inside": "avoid-column" }],
          ...v("break-inside"),
          ["break-after-auto", { "break-after": "auto" }],
          ["break-after-avoid", { "break-after": "avoid" }],
          ["break-after-all", { "break-after": "all" }],
          ["break-after-avoid-page", { "break-after": "avoid-page" }],
          ["break-after-page", { "break-after": "page" }],
          ["break-after-left", { "break-after": "left" }],
          ["break-after-right", { "break-after": "right" }],
          ["break-after-column", { "break-after": "column" }],
          ...v("break-after")
        ];
        var rl = /@media \(min-width: (.+)\)/, Ei = [
          [
            /^__container$/,
            (e, t) => {
              var _a2, _b, _c2, _d, _e2, _f, _g;
              let { theme: r, variantHandlers: n } = t, o = (_a2 = r.container) == null ? void 0 : _a2.padding, i;
              O(o) ? i = o : i = o == null ? void 0 : o.DEFAULT;
              let a = (_b = r.container) == null ? void 0 : _b.maxWidth, s;
              for (let f of n) {
                let u = (_d = (_c2 = f.handle) == null ? void 0 : _c2.call(f, {}, (p) => p)) == null ? void 0 : _d.parent;
                if (O(u)) {
                  let p = (_e2 = u.match(rl)) == null ? void 0 : _e2[1];
                  if (p) {
                    let h = (_f = (fe(t) ?? []).find((x) => x.size === p)) == null ? void 0 : _f.point;
                    a ? h && (s = a == null ? void 0 : a[h]) : s = p, h && !O(o) && (i = (o == null ? void 0 : o[h]) ?? i);
                  }
                }
              }
              let c = { "max-width": s };
              return n.length || (c.width = "100%"), ((_g = r.container) == null ? void 0 : _g.center) && (c["margin-left"] = "auto", c["margin-right"] = "auto"), o && (c["padding-left"] = i, c["padding-right"] = i), c;
            },
            { internal: true }
          ]
        ], ji = [
          [
            /^(?:(\w+)[:-])?container$/,
            ([, e], t) => {
              let r = (fe(t) ?? []).map((o) => o.point);
              if (e) {
                if (!r.includes(e))
                  return;
                r = r.slice(r.indexOf(e));
              }
              let n = r.map((o) => `${o}:__container`);
              return e || n.unshift("__container"), n;
            }
          ]
        ];
        var zi = {
          "--un-blur": T,
          "--un-brightness": T,
          "--un-contrast": T,
          "--un-drop-shadow": T,
          "--un-grayscale": T,
          "--un-hue-rotate": T,
          "--un-invert": T,
          "--un-saturate": T,
          "--un-sepia": T
        }, Sr = "var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)", Oi = {
          "--un-backdrop-blur": T,
          "--un-backdrop-brightness": T,
          "--un-backdrop-contrast": T,
          "--un-backdrop-grayscale": T,
          "--un-backdrop-hue-rotate": T,
          "--un-backdrop-invert": T,
          "--un-backdrop-opacity": T,
          "--un-backdrop-saturate": T,
          "--un-backdrop-sepia": T
        }, Cr = "var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)";
        function an(e) {
          let t = l.bracket.cssvar(e || "");
          if (t != null || (t = e ? l.percent(e) : "1", t != null && Number.parseFloat(t) <= 1))
            return t;
        }
        function te(e, t) {
          return ([, r, n], { theme: o }) => {
            let i = t(n, o) ?? (n === "none" ? "0" : "");
            if (i !== "")
              return r ? {
                [`--un-${r}${e}`]: `${e}(${i})`,
                "-webkit-backdrop-filter": Cr,
                "backdrop-filter": Cr
              } : { [`--un-${e}`]: `${e}(${i})`, filter: Sr };
          };
        }
        function nl([, e], { theme: t }) {
          var _a2;
          let r = (_a2 = t.dropShadow) == null ? void 0 : _a2[e || "DEFAULT"];
          if (r != null)
            return {
              "--un-drop-shadow": `drop-shadow(${Se(r, "--un-drop-shadow-color").join(") drop-shadow(")})`,
              filter: Sr
            };
          if (r = l.bracket.cssvar(e), r != null)
            return { "--un-drop-shadow": `drop-shadow(${r})`, filter: Sr };
        }
        var Ai = [
          [
            /^(?:(backdrop-)|filter-)?blur(?:-(.+))?$/,
            te("blur", (e, t) => {
              var _a2;
              return ((_a2 = t.blur) == null ? void 0 : _a2[e || "DEFAULT"]) || l.bracket.cssvar.px(e);
            }),
            {
              autocomplete: [
                "(backdrop|filter)-blur-$blur",
                "blur-$blur",
                "filter-blur"
              ]
            }
          ],
          [
            /^(?:(backdrop-)|filter-)?brightness-(.+)$/,
            te("brightness", (e) => l.bracket.cssvar.percent(e)),
            {
              autocomplete: [
                "(backdrop|filter)-brightness-<percent>",
                "brightness-<percent>"
              ]
            }
          ],
          [
            /^(?:(backdrop-)|filter-)?contrast-(.+)$/,
            te("contrast", (e) => l.bracket.cssvar.percent(e)),
            {
              autocomplete: [
                "(backdrop|filter)-contrast-<percent>",
                "contrast-<percent>"
              ]
            }
          ],
          [
            /^(?:filter-)?drop-shadow(?:-(.+))?$/,
            nl,
            {
              autocomplete: [
                "filter-drop",
                "filter-drop-shadow",
                "filter-drop-shadow-color",
                "drop-shadow",
                "drop-shadow-color",
                "filter-drop-shadow-$dropShadow",
                "drop-shadow-$dropShadow",
                "filter-drop-shadow-color-$colors",
                "drop-shadow-color-$colors",
                "filter-drop-shadow-color-(op|opacity)",
                "drop-shadow-color-(op|opacity)",
                "filter-drop-shadow-color-(op|opacity)-<percent>",
                "drop-shadow-color-(op|opacity)-<percent>"
              ]
            }
          ],
          [
            /^(?:filter-)?drop-shadow-color-(.+)$/,
            j("--un-drop-shadow-color", "drop-shadow", "shadowColor")
          ],
          [
            /^(?:filter-)?drop-shadow-color-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-drop-shadow-opacity": l.bracket.percent(e) })
          ],
          [
            /^(?:(backdrop-)|filter-)?grayscale(?:-(.+))?$/,
            te("grayscale", an),
            {
              autocomplete: [
                "(backdrop|filter)-grayscale",
                "(backdrop|filter)-grayscale-<percent>",
                "grayscale-<percent>"
              ]
            }
          ],
          [
            /^(?:(backdrop-)|filter-)?hue-rotate-(.+)$/,
            te("hue-rotate", (e) => l.bracket.cssvar.degree(e))
          ],
          [
            /^(?:(backdrop-)|filter-)?invert(?:-(.+))?$/,
            te("invert", an),
            {
              autocomplete: [
                "(backdrop|filter)-invert",
                "(backdrop|filter)-invert-<percent>",
                "invert-<percent>"
              ]
            }
          ],
          [
            /^(backdrop-)op(?:acity)-(.+)$/,
            te("opacity", (e) => l.bracket.cssvar.percent(e)),
            {
              autocomplete: [
                "backdrop-(op|opacity)",
                "backdrop-(op|opacity)-<percent>"
              ]
            }
          ],
          [
            /^(?:(backdrop-)|filter-)?saturate-(.+)$/,
            te("saturate", (e) => l.bracket.cssvar.percent(e)),
            {
              autocomplete: [
                "(backdrop|filter)-saturate",
                "(backdrop|filter)-saturate-<percent>",
                "saturate-<percent>"
              ]
            }
          ],
          [
            /^(?:(backdrop-)|filter-)?sepia(?:-(.+))?$/,
            te("sepia", an),
            {
              autocomplete: [
                "(backdrop|filter)-sepia",
                "(backdrop|filter)-sepia-<percent>",
                "sepia-<percent>"
              ]
            }
          ],
          ["filter", { filter: Sr }],
          [
            "backdrop-filter",
            { "-webkit-backdrop-filter": Cr, "backdrop-filter": Cr }
          ],
          ["filter-none", { filter: "none" }],
          [
            "backdrop-filter-none",
            { "-webkit-backdrop-filter": "none", "backdrop-filter": "none" }
          ],
          ...S.map((e) => [`filter-${e}`, { filter: e }]),
          ...S.map((e) => [
            `backdrop-filter-${e}`,
            { "-webkit-backdrop-filter": e, "backdrop-filter": e }
          ])
        ];
        var _i = [
          [
            /^space-([xy])-(-?.+)$/,
            Vi,
            {
              autocomplete: [
                "space-(x|y|block|inline)",
                "space-(x|y|block|inline)-reverse",
                "space-(x|y|block|inline)-$spacing"
              ]
            }
          ],
          [/^space-([xy])-reverse$/, ([, e]) => ({ [`--un-space-${e}-reverse`]: 1 })],
          [/^space-(block|inline)-(-?.+)$/, Vi],
          [
            /^space-(block|inline)-reverse$/,
            ([, e]) => ({ [`--un-space-${e}-reverse`]: 1 })
          ]
        ];
        function Vi([, e, t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.spacing) == null ? void 0 : _a2[t || "DEFAULT"]) ?? l.bracket.cssvar.auto.fraction.rem(t || "1");
          if (n != null) {
            n === "0" && (n = "0px");
            let o = F[e].map((i) => {
              let a = `margin${i}`, s = i.endsWith("right") || i.endsWith("bottom") ? `calc(${n} * var(--un-space-${e}-reverse))` : `calc(${n} * calc(1 - var(--un-space-${e}-reverse)))`;
              return [a, s];
            });
            if (o)
              return [[`--un-space-${e}-reverse`, 0], ...o];
          }
        }
        var Pi = [
          ["uppercase", { "text-transform": "uppercase" }],
          ["lowercase", { "text-transform": "lowercase" }],
          ["capitalize", { "text-transform": "capitalize" }],
          ["normal-case", { "text-transform": "none" }]
        ], Mi = [
          ...["manual", "auto", "none", ...S].map((e) => [
            `hyphens-${e}`,
            { "-webkit-hyphens": e, "-ms-hyphens": e, hyphens: e }
          ])
        ], Fi = [
          ["write-vertical-right", { "writing-mode": "vertical-rl" }],
          ["write-vertical-left", { "writing-mode": "vertical-lr" }],
          ["write-normal", { "writing-mode": "horizontal-tb" }],
          ...v("write", "writing-mode")
        ], Ui = [
          ["write-orient-mixed", { "text-orientation": "mixed" }],
          ["write-orient-sideways", { "text-orientation": "sideways" }],
          ["write-orient-upright", { "text-orientation": "upright" }],
          ...v("write-orient", "text-orientation")
        ], Li = [
          [
            "sr-only",
            {
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: "0",
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              "white-space": "nowrap",
              "border-width": 0
            }
          ],
          [
            "not-sr-only",
            {
              position: "static",
              width: "auto",
              height: "auto",
              padding: "0",
              margin: "0",
              overflow: "visible",
              clip: "auto",
              "white-space": "normal"
            }
          ]
        ], Wi = [
          ["isolate", { isolation: "isolate" }],
          ["isolate-auto", { isolation: "auto" }],
          ["isolation-auto", { isolation: "auto" }]
        ], Ni = [
          ["object-cover", { "object-fit": "cover" }],
          ["object-contain", { "object-fit": "contain" }],
          ["object-fill", { "object-fit": "fill" }],
          ["object-scale-down", { "object-fit": "scale-down" }],
          ["object-none", { "object-fit": "none" }],
          [
            /^object-(.+)$/,
            ([, e]) => {
              if (M[e])
                return { "object-position": M[e] };
              if (l.bracketOfPosition(e) != null)
                return {
                  "object-position": l.bracketOfPosition(e).split(" ").map((t) => l.position.fraction.auto.px.cssvar(t) ?? t).join(" ")
                };
            },
            { autocomplete: `object-(${Object.keys(M).join("|")})` }
          ]
        ], Bi = [
          ["bg-blend-multiply", { "background-blend-mode": "multiply" }],
          ["bg-blend-screen", { "background-blend-mode": "screen" }],
          ["bg-blend-overlay", { "background-blend-mode": "overlay" }],
          ["bg-blend-darken", { "background-blend-mode": "darken" }],
          ["bg-blend-lighten", { "background-blend-mode": "lighten" }],
          ["bg-blend-color-dodge", { "background-blend-mode": "color-dodge" }],
          ["bg-blend-color-burn", { "background-blend-mode": "color-burn" }],
          ["bg-blend-hard-light", { "background-blend-mode": "hard-light" }],
          ["bg-blend-soft-light", { "background-blend-mode": "soft-light" }],
          ["bg-blend-difference", { "background-blend-mode": "difference" }],
          ["bg-blend-exclusion", { "background-blend-mode": "exclusion" }],
          ["bg-blend-hue", { "background-blend-mode": "hue" }],
          ["bg-blend-saturation", { "background-blend-mode": "saturation" }],
          ["bg-blend-color", { "background-blend-mode": "color" }],
          ["bg-blend-luminosity", { "background-blend-mode": "luminosity" }],
          ["bg-blend-normal", { "background-blend-mode": "normal" }],
          ...v("bg-blend", "background-blend")
        ], Di = [
          ["mix-blend-multiply", { "mix-blend-mode": "multiply" }],
          ["mix-blend-screen", { "mix-blend-mode": "screen" }],
          ["mix-blend-overlay", { "mix-blend-mode": "overlay" }],
          ["mix-blend-darken", { "mix-blend-mode": "darken" }],
          ["mix-blend-lighten", { "mix-blend-mode": "lighten" }],
          ["mix-blend-color-dodge", { "mix-blend-mode": "color-dodge" }],
          ["mix-blend-color-burn", { "mix-blend-mode": "color-burn" }],
          ["mix-blend-hard-light", { "mix-blend-mode": "hard-light" }],
          ["mix-blend-soft-light", { "mix-blend-mode": "soft-light" }],
          ["mix-blend-difference", { "mix-blend-mode": "difference" }],
          ["mix-blend-exclusion", { "mix-blend-mode": "exclusion" }],
          ["mix-blend-hue", { "mix-blend-mode": "hue" }],
          ["mix-blend-saturation", { "mix-blend-mode": "saturation" }],
          ["mix-blend-color", { "mix-blend-mode": "color" }],
          ["mix-blend-luminosity", { "mix-blend-mode": "luminosity" }],
          ["mix-blend-plus-lighter", { "mix-blend-mode": "plus-lighter" }],
          ["mix-blend-normal", { "mix-blend-mode": "normal" }],
          ...v("mix-blend")
        ], Ii = [
          ["min-h-dvh", { "min-height": "100dvh" }],
          ["min-h-svh", { "min-height": "100svh" }],
          ["min-h-lvh", { "min-height": "100lvh" }],
          ["h-dvh", { height: "100dvh" }],
          ["h-svh", { height: "100svh" }],
          ["h-lvh", { height: "100lvh" }],
          ["max-h-dvh", { "max-height": "100dvh" }],
          ["max-h-svh", { "max-height": "100svh" }],
          ["max-h-lvh", { "max-height": "100lvh" }]
        ];
        var Gi = { "--un-border-spacing-x": 0, "--un-border-spacing-y": 0 }, Ki = "var(--un-border-spacing-x) var(--un-border-spacing-y)", Hi = [
          ["inline-table", { display: "inline-table" }],
          ["table", { display: "table" }],
          ["table-caption", { display: "table-caption" }],
          ["table-cell", { display: "table-cell" }],
          ["table-column", { display: "table-column" }],
          ["table-column-group", { display: "table-column-group" }],
          ["table-footer-group", { display: "table-footer-group" }],
          ["table-header-group", { display: "table-header-group" }],
          ["table-row", { display: "table-row" }],
          ["table-row-group", { display: "table-row-group" }],
          ["border-collapse", { "border-collapse": "collapse" }],
          ["border-separate", { "border-collapse": "separate" }],
          [
            /^border-spacing-(.+)$/,
            ([, e], { theme: t }) => {
              var _a2;
              let r = ((_a2 = t.spacing) == null ? void 0 : _a2[e]) ?? l.bracket.cssvar.global.auto.fraction.rem(e);
              if (r != null)
                return {
                  "--un-border-spacing-x": r,
                  "--un-border-spacing-y": r,
                  "border-spacing": Ki
                };
            },
            { autocomplete: ["border-spacing", "border-spacing-$spacing"] }
          ],
          [
            /^border-spacing-([xy])-(.+)$/,
            ([, e, t], { theme: r }) => {
              var _a2;
              let n = ((_a2 = r.spacing) == null ? void 0 : _a2[t]) ?? l.bracket.cssvar.global.auto.fraction.rem(t);
              if (n != null)
                return { [`--un-border-spacing-${e}`]: n, "border-spacing": Ki };
            },
            {
              autocomplete: [
                "border-spacing-(x|y)",
                "border-spacing-(x|y)-$spacing"
              ]
            }
          ],
          ["caption-top", { "caption-side": "top" }],
          ["caption-bottom", { "caption-side": "bottom" }],
          ["table-auto", { "table-layout": "auto" }],
          ["table-fixed", { "table-layout": "fixed" }],
          ["table-empty-cells-visible", { "empty-cells": "show" }],
          ["table-empty-cells-hidden", { "empty-cells": "hide" }]
        ];
        var ol = {
          "bg-blend": "background-blend-mode",
          "bg-clip": "-webkit-background-clip",
          "bg-gradient": "linear-gradient",
          "bg-image": "background-image",
          "bg-origin": "background-origin",
          "bg-position": "background-position",
          "bg-repeat": "background-repeat",
          "bg-size": "background-size",
          "mix-blend": "mix-blend-mode",
          object: "object-fit",
          "object-position": "object-position",
          write: "writing-mode",
          "write-orient": "text-orientation"
        }, qi = [
          [
            /^(.+?)-(\$.+)$/,
            ([, e, t]) => {
              let r = ol[e];
              if (r)
                return { [r]: l.cssvar(t) };
            }
          ]
        ];
        var Yi = [
          [
            /^divide-?([xy])$/,
            Rr,
            {
              autocomplete: [
                "divide-(x|y|block|inline)",
                "divide-(x|y|block|inline)-reverse",
                "divide-(x|y|block|inline)-$lineWidth"
              ]
            }
          ],
          [/^divide-?([xy])-?(-?.+)$/, Rr],
          [
            /^divide-?([xy])-reverse$/,
            ([, e]) => ({ [`--un-divide-${e}-reverse`]: 1 })
          ],
          [/^divide-(block|inline)$/, Rr],
          [/^divide-(block|inline)-(-?.+)$/, Rr],
          [
            /^divide-(block|inline)-reverse$/,
            ([, e]) => ({ [`--un-divide-${e}-reverse`]: 1 })
          ],
          [
            /^divide-(.+)$/,
            j("border-color", "divide", "borderColor"),
            { autocomplete: "divide-$colors" }
          ],
          [
            /^divide-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-divide-opacity": l.bracket.percent(e) }),
            {
              autocomplete: ["divide-(op|opacity)", "divide-(op|opacity)-<percent>"]
            }
          ],
          ...ue.map((e) => [`divide-${e}`, { "border-style": e }])
        ];
        function Rr([, e, t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.lineWidth) == null ? void 0 : _a2[t || "DEFAULT"]) ?? l.bracket.cssvar.px(t || "1");
          if (n != null) {
            n === "0" && (n = "0px");
            let o = F[e].map((i) => {
              let a = `border${i}-width`, s = i.endsWith("right") || i.endsWith("bottom") ? `calc(${n} * var(--un-divide-${e}-reverse))` : `calc(${n} * calc(1 - var(--un-divide-${e}-reverse)))`;
              return [a, s];
            });
            if (o)
              return [[`--un-divide-${e}-reverse`, 0], ...o];
          }
        }
        var Xi = [
          [
            /^line-clamp-(\d+)$/,
            ([, e]) => ({
              overflow: "hidden",
              display: "-webkit-box",
              "-webkit-box-orient": "vertical",
              "-webkit-line-clamp": e,
              "line-clamp": e
            }),
            { autocomplete: ["line-clamp", "line-clamp-<num>"] }
          ],
          ...["none", ...S].map((e) => [
            `line-clamp-${e}`,
            {
              overflow: "visible",
              display: "block",
              "-webkit-box-orient": "horizontal",
              "-webkit-line-clamp": e,
              "line-clamp": e
            }
          ])
        ];
        var Zi = {
          "--un-ordinal": T,
          "--un-slashed-zero": T,
          "--un-numeric-figure": T,
          "--un-numeric-spacing": T,
          "--un-numeric-fraction": T
        };
        function ae(e) {
          return {
            ...e,
            "font-variant-numeric": "var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)"
          };
        }
        var Ji = [
          [
            /^ordinal$/,
            () => ae({ "--un-ordinal": "ordinal" }),
            { autocomplete: "ordinal" }
          ],
          [
            /^slashed-zero$/,
            () => ae({ "--un-slashed-zero": "slashed-zero" }),
            { autocomplete: "slashed-zero" }
          ],
          [
            /^lining-nums$/,
            () => ae({ "--un-numeric-figure": "lining-nums" }),
            { autocomplete: "lining-nums" }
          ],
          [
            /^oldstyle-nums$/,
            () => ae({ "--un-numeric-figure": "oldstyle-nums" }),
            { autocomplete: "oldstyle-nums" }
          ],
          [
            /^proportional-nums$/,
            () => ae({ "--un-numeric-spacing": "proportional-nums" }),
            { autocomplete: "proportional-nums" }
          ],
          [
            /^tabular-nums$/,
            () => ae({ "--un-numeric-spacing": "tabular-nums" }),
            { autocomplete: "tabular-nums" }
          ],
          [
            /^diagonal-fractions$/,
            () => ae({ "--un-numeric-fraction": "diagonal-fractions" }),
            { autocomplete: "diagonal-fractions" }
          ],
          [
            /^stacked-fractions$/,
            () => ae({ "--un-numeric-fraction": "stacked-fractions" }),
            { autocomplete: "stacked-fractions" }
          ],
          ["normal-nums", { "font-variant-numeric": "normal" }]
        ];
        var Qi = { "--un-pan-x": T, "--un-pan-y": T, "--un-pinch-zoom": T }, sn = "var(--un-pan-x) var(--un-pan-y) var(--un-pinch-zoom)", ea = [
          [
            /^touch-pan-(x|left|right)$/,
            ([, e]) => ({ "--un-pan-x": `pan-${e}`, "touch-action": sn }),
            { autocomplete: ["touch-pan", "touch-pan-(x|left|right|y|up|down)"] }
          ],
          [
            /^touch-pan-(y|up|down)$/,
            ([, e]) => ({ "--un-pan-y": `pan-${e}`, "touch-action": sn })
          ],
          [
            "touch-pinch-zoom",
            { "--un-pinch-zoom": "pinch-zoom", "touch-action": sn }
          ],
          ["touch-auto", { "touch-action": "auto" }],
          ["touch-manipulation", { "touch-action": "manipulation" }],
          ["touch-none", { "touch-action": "none" }],
          ...v("touch", "touch-action")
        ];
        var ta = { "--un-scroll-snap-strictness": "proximity" }, ra = [
          [
            /^snap-(x|y)$/,
            ([, e]) => ({
              "scroll-snap-type": `${e} var(--un-scroll-snap-strictness)`
            }),
            { autocomplete: "snap-(x|y|both)" }
          ],
          [
            /^snap-both$/,
            () => ({ "scroll-snap-type": "both var(--un-scroll-snap-strictness)" })
          ],
          ["snap-mandatory", { "--un-scroll-snap-strictness": "mandatory" }],
          ["snap-proximity", { "--un-scroll-snap-strictness": "proximity" }],
          ["snap-none", { "scroll-snap-type": "none" }],
          ["snap-start", { "scroll-snap-align": "start" }],
          ["snap-end", { "scroll-snap-align": "end" }],
          ["snap-center", { "scroll-snap-align": "center" }],
          ["snap-align-none", { "scroll-snap-align": "none" }],
          ["snap-normal", { "scroll-snap-stop": "normal" }],
          ["snap-always", { "scroll-snap-stop": "always" }],
          [
            /^scroll-ma?()-?(-?.+)$/,
            V("scroll-margin"),
            {
              autocomplete: [
                "scroll-(m|p|ma|pa|block|inline)",
                "scroll-(m|p|ma|pa|block|inline)-$spacing",
                "scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)",
                "scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)-$spacing"
              ]
            }
          ],
          [/^scroll-m-?([xy])-?(-?.+)$/, V("scroll-margin")],
          [/^scroll-m-?([rltb])-?(-?.+)$/, V("scroll-margin")],
          [/^scroll-m-(block|inline)-(-?.+)$/, V("scroll-margin")],
          [/^scroll-m-?([bi][se])-?(-?.+)$/, V("scroll-margin")],
          [/^scroll-pa?()-?(-?.+)$/, V("scroll-padding")],
          [/^scroll-p-?([xy])-?(-?.+)$/, V("scroll-padding")],
          [/^scroll-p-?([rltb])-?(-?.+)$/, V("scroll-padding")],
          [/^scroll-p-(block|inline)-(-?.+)$/, V("scroll-padding")],
          [/^scroll-p-?([bi][se])-?(-?.+)$/, V("scroll-padding")]
        ];
        var na = [
          [
            /^\$ placeholder-(.+)$/,
            j("color", "placeholder", "accentColor"),
            { autocomplete: "placeholder-$colors" }
          ],
          [
            /^\$ placeholder-op(?:acity)?-?(.+)$/,
            ([, e]) => ({ "--un-placeholder-opacity": l.bracket.percent(e) }),
            {
              autocomplete: [
                "placeholder-(op|opacity)",
                "placeholder-(op|opacity)-<percent>"
              ]
            }
          ]
        ];
        var oa = [
          [/^view-transition-([\w_-]+)$/, ([, e]) => ({ "view-transition-name": e })]
        ];
        var ia = [
          xr,
          qi,
          yr,
          Ei,
          Ht,
          Li,
          qt,
          Kt,
          Mt,
          Wt,
          Xi,
          Wi,
          Bt,
          Ft,
          Vt,
          Nt,
          mr,
          Dt,
          It,
          pr,
          ur,
          Rt,
          Hi,
          br,
          xi,
          Gt,
          ea,
          Xt,
          Yt,
          ra,
          wi,
          bt,
          Ti,
          Ut,
          Be,
          Ne,
          At,
          Lt,
          _i,
          Yi,
          Pt,
          Ci,
          Ri,
          rr,
          Zt,
          er,
          yt,
          wt,
          vi,
          wr,
          Ni,
          dr,
          mt,
          jt,
          tr,
          dt,
          Tt,
          nr,
          Pi,
          or,
          Ji,
          kt,
          ir,
          Et,
          zt,
          Ot,
          Mi,
          Fi,
          Ui,
          ki,
          $i,
          vt,
          Bi,
          Di,
          lr,
          gt2,
          sr,
          Si,
          Ai,
          Ct,
          xt,
          Jt,
          Qt,
          na,
          $t,
          oa,
          Ii,
          vr
        ].flat(1);
        var aa = [...ji];
        var cn = {
          inherit: "inherit",
          current: "currentColor",
          transparent: "transparent",
          black: "#000",
          white: "#fff",
          rose: {
            50: "#fff1f2",
            100: "#ffe4e6",
            200: "#fecdd3",
            300: "#fda4af",
            400: "#fb7185",
            500: "#f43f5e",
            600: "#e11d48",
            700: "#be123c",
            800: "#9f1239",
            900: "#881337",
            950: "#4c0519"
          },
          pink: {
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#fbcfe8",
            300: "#f9a8d4",
            400: "#f472b6",
            500: "#ec4899",
            600: "#db2777",
            700: "#be185d",
            800: "#9d174d",
            900: "#831843",
            950: "#500724"
          },
          fuchsia: {
            50: "#fdf4ff",
            100: "#fae8ff",
            200: "#f5d0fe",
            300: "#f0abfc",
            400: "#e879f9",
            500: "#d946ef",
            600: "#c026d3",
            700: "#a21caf",
            800: "#86198f",
            900: "#701a75",
            950: "#4a044e"
          },
          purple: {
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87",
            950: "#3b0764"
          },
          violet: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
            950: "#2e1065"
          },
          indigo: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1e1b4b"
          },
          blue: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            950: "#172554"
          },
          sky: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
            950: "#082f49"
          },
          cyan: {
            50: "#ecfeff",
            100: "#cffafe",
            200: "#a5f3fc",
            300: "#67e8f9",
            400: "#22d3ee",
            500: "#06b6d4",
            600: "#0891b2",
            700: "#0e7490",
            800: "#155e75",
            900: "#164e63",
            950: "#083344"
          },
          teal: {
            50: "#f0fdfa",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
            950: "#042f2e"
          },
          emerald: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
            950: "#022c22"
          },
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16"
          },
          lime: {
            50: "#f7fee7",
            100: "#ecfccb",
            200: "#d9f99d",
            300: "#bef264",
            400: "#a3e635",
            500: "#84cc16",
            600: "#65a30d",
            700: "#4d7c0f",
            800: "#3f6212",
            900: "#365314",
            950: "#1a2e05"
          },
          yellow: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15",
            500: "#eab308",
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
            950: "#422006"
          },
          amber: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
            950: "#451a03"
          },
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            950: "#431407"
          },
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            950: "#450a0a"
          },
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
            950: "#030712"
          },
          slate: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617"
          },
          zinc: {
            50: "#fafafa",
            100: "#f4f4f5",
            200: "#e4e4e7",
            300: "#d4d4d8",
            400: "#a1a1aa",
            500: "#71717a",
            600: "#52525b",
            700: "#3f3f46",
            800: "#27272a",
            900: "#18181b",
            950: "#09090b"
          },
          neutral: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            950: "#0a0a0a"
          },
          stone: {
            50: "#fafaf9",
            100: "#f5f5f4",
            200: "#e7e5e4",
            300: "#d6d3d1",
            400: "#a8a29e",
            500: "#78716c",
            600: "#57534e",
            700: "#44403c",
            800: "#292524",
            900: "#1c1917",
            950: "#0c0a09"
          },
          light: {
            50: "#fdfdfd",
            100: "#fcfcfc",
            200: "#fafafa",
            300: "#f8f9fa",
            400: "#f6f6f6",
            500: "#f2f2f2",
            600: "#f1f3f5",
            700: "#e9ecef",
            800: "#dee2e6",
            900: "#dde1e3",
            950: "#d8dcdf"
          },
          dark: {
            50: "#4a4a4a",
            100: "#3c3c3c",
            200: "#323232",
            300: "#2d2d2d",
            400: "#222222",
            500: "#1f1f1f",
            600: "#1c1c1e",
            700: "#1b1b1b",
            800: "#181818",
            900: "#0f0f0f",
            950: "#080808"
          },
          get lightblue() {
            return this.sky;
          },
          get lightBlue() {
            return this.sky;
          },
          get warmgray() {
            return this.stone;
          },
          get warmGray() {
            return this.stone;
          },
          get truegray() {
            return this.neutral;
          },
          get trueGray() {
            return this.neutral;
          },
          get coolgray() {
            return this.gray;
          },
          get coolGray() {
            return this.gray;
          },
          get bluegray() {
            return this.slate;
          },
          get blueGray() {
            return this.slate;
          }
        };
        Object.values(cn).forEach((e) => {
          typeof e != "string" && e !== void 0 && (e.DEFAULT = e.DEFAULT || e[400], Object.keys(e).forEach((t) => {
            let r = +t / 100;
            r === Math.round(r) && (e[r] = e[t]);
          }));
        });
        var Er = { x: ["-x"], y: ["-y"], z: ["-z"], "": ["-x", "-y"] }, sa = [
          "top",
          "top center",
          "top left",
          "top right",
          "bottom",
          "bottom center",
          "bottom left",
          "bottom right",
          "left",
          "left center",
          "left top",
          "left bottom",
          "right",
          "right center",
          "right top",
          "right bottom",
          "center",
          "center top",
          "center bottom",
          "center left",
          "center right",
          "center center"
        ], He = Object.assign(
          {},
          ...sa.map((e) => ({ [e.replace(/ /, "-")]: e })),
          ...sa.map((e) => ({
            [e.replace(/\b(\w)\w+/g, "$1").replace(/ /, "")]: e
          }))
        ), ln = ["inherit", "initial", "revert", "revert-layer", "unset"], fn = /^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i, la = /^(-?\d*(?:\.\d+)?)$/i, fa = /^(px)$/i, ua = /^\[(color|length|position|quoted|string):/i, sl = [
          "color",
          "border-color",
          "background-color",
          "flex-grow",
          "flex",
          "flex-shrink",
          "caret-color",
          "font",
          "gap",
          "opacity",
          "visibility",
          "z-index",
          "font-weight",
          "zoom",
          "text-shadow",
          "transform",
          "box-shadow",
          "background-position",
          "left",
          "right",
          "top",
          "bottom",
          "object-position",
          "max-height",
          "min-height",
          "max-width",
          "min-width",
          "height",
          "width",
          "border-width",
          "margin",
          "padding",
          "outline-width",
          "outline-offset",
          "font-size",
          "line-height",
          "text-indent",
          "vertical-align",
          "border-spacing",
          "letter-spacing",
          "word-spacing",
          "stroke",
          "filter",
          "backdrop-filter",
          "fill",
          "mask",
          "mask-size",
          "mask-border",
          "clip-path",
          "clip",
          "border-radius"
        ];
        function Y(e) {
          return e.toFixed(10).replace(/\.0+$/, "").replace(/(\.\d+?)0+$/, "$1");
        }
        function cl(e) {
          let t = e.match(fn);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (n && !Number.isNaN(o))
            return `${Y(o)}${n}`;
        }
        function ll(e) {
          if (e === "auto" || e === "a")
            return "auto";
        }
        function fl(e) {
          if (fa.test(e))
            return `1${e}`;
          let t = e.match(fn);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return o === 0 ? "0" : n ? `${Y(o)}${n}` : `${Y(o / 4)}rem`;
        }
        function ul(e) {
          if (fa.test(e))
            return `1${e}`;
          let t = e.match(fn);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return n ? `${Y(o)}${n}` : `${Y(o)}px`;
        }
        function pl(e) {
          if (!la.test(e))
            return;
          let t = Number.parseFloat(e);
          if (!Number.isNaN(t))
            return Y(t);
        }
        function dl(e) {
          if (e.endsWith("%") && (e = e.slice(0, -1)), !la.test(e))
            return;
          let t = Number.parseFloat(e);
          if (!Number.isNaN(t))
            return `${Y(t / 100)}`;
        }
        function ml(e) {
          if (e === "full")
            return "100%";
          let [t, r] = e.split("/"), n = Number.parseFloat(t) / Number.parseFloat(r);
          if (!Number.isNaN(n))
            return n === 0 ? "0" : `${Y(n * 100)}%`;
        }
        function jr(e, t) {
          if (e && e.startsWith("[") && e.endsWith("]")) {
            let r, n, o = e.match(ua);
            if (o ? (t || (n = o[1]), r = e.slice(o[0].length, -1)) : r = e.slice(1, -1), !r || r === '=""')
              return;
            r.startsWith("--") && (r = `var(${r})`);
            let i = 0;
            for (let a of r)
              if (a === "[")
                i += 1;
              else if (a === "]" && (i -= 1, i < 0))
                return;
            if (i)
              return;
            switch (n) {
              case "string":
                return r.replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_");
              case "quoted":
                return r.replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_").replace(/(["\\])/g, "\\$1").replace(/^(.+)$/, '"$1"');
            }
            return r.replace(/(url\(.*?\))/g, (a) => a.replace(/_/g, "\\_")).replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_").replace(/(?:calc|clamp|max|min)\((.*)/g, (a) => {
              let s = [];
              return a.replace(
                /var\((--.+?)[,)]/g,
                (c, f) => (s.push(f), c.replace(f, "--un-calc"))
              ).replace(
                /(-?\d*\.?\d(?!\b-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
                "$1 $2 "
              ).replace(/--un-calc/g, () => s.shift());
            });
          }
        }
        function hl(e) {
          return jr(e);
        }
        function gl(e) {
          return jr(e, "color");
        }
        function bl(e) {
          return jr(e, "length");
        }
        function xl(e) {
          return jr(e, "position");
        }
        function yl(e) {
          if (/^\$[^\s'"`;{}]/.test(e)) {
            let [t, r] = e.slice(1).split(",");
            return `var(--${Q(t)}${r ? `, ${r}` : ""})`;
          }
        }
        function vl(e) {
          let t = e.match(/^(-?[0-9.]+)(s|ms)?$/i);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return o === 0 && !n ? "0s" : n ? `${Y(o)}${n}` : `${Y(o)}ms`;
        }
        function wl(e) {
          let t = e.match(/^(-?[0-9.]+)(deg|rad|grad|turn)?$/i);
          if (!t)
            return;
          let [, r, n] = t, o = Number.parseFloat(r);
          if (!Number.isNaN(o))
            return o === 0 ? "0" : n ? `${Y(o)}${n}` : `${Y(o)}deg`;
        }
        function $l(e) {
          if (ln.includes(e))
            return e;
        }
        function kl(e) {
          if (e.split(",").every((t) => sl.includes(t)))
            return e;
        }
        function Sl(e) {
          if (["top", "left", "right", "bottom", "center"].includes(e))
            return e;
        }
        var Cl = {
          __proto__: null,
          auto: ll,
          bracket: hl,
          bracketOfColor: gl,
          bracketOfLength: bl,
          bracketOfPosition: xl,
          cssvar: yl,
          degree: wl,
          fraction: ml,
          global: $l,
          number: pl,
          numberWithUnit: cl,
          percent: dl,
          position: Sl,
          properties: kl,
          px: ul,
          rem: fl,
          time: vl
        }, Rl = st(Cl), P = Rl;
        function se(e, t) {
          return ln.map((r) => [`${e}-${r}`, { [t ?? e]: r }]);
        }
        var ba = " ";
        var xa = {
          "--un-ring-inset": ba,
          "--un-ring-offset-width": "0px",
          "--un-ring-offset-color": "#fff",
          "--un-ring-width": "0px",
          "--un-ring-color": "rgb(147 197 253 / 0.5)",
          "--un-shadow": "0 0 rgb(0 0 0 / 0)"
        };
        var va = {
          "--un-ring-offset-shadow": "0 0 rgb(0 0 0 / 0)",
          "--un-ring-shadow": "0 0 rgb(0 0 0 / 0)",
          "--un-shadow-inset": ba,
          "--un-shadow": "0 0 rgb(0 0 0 / 0)"
        };
        var zr = ["translate", "rotate", "scale"], he = [
          "translateX(var(--un-translate-x))",
          "translateY(var(--un-translate-y))",
          "translateZ(var(--un-translate-z))",
          "rotate(var(--un-rotate))",
          "rotateX(var(--un-rotate-x))",
          "rotateY(var(--un-rotate-y))",
          "rotateZ(var(--un-rotate-z))",
          "skewX(var(--un-skew-x))",
          "skewY(var(--un-skew-y))",
          "scaleX(var(--un-scale-x))",
          "scaleY(var(--un-scale-y))",
          "scaleZ(var(--un-scale-z))"
        ].join(" "), Ol = [
          "translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z))",
          "rotate(var(--un-rotate))",
          "rotateX(var(--un-rotate-x))",
          "rotateY(var(--un-rotate-y))",
          "rotateZ(var(--un-rotate-z))",
          "skewX(var(--un-skew-x))",
          "skewY(var(--un-skew-y))",
          "scaleX(var(--un-scale-x))",
          "scaleY(var(--un-scale-y))",
          "scaleZ(var(--un-scale-z))"
        ].join(" "), wa = {
          "--un-rotate": 0,
          "--un-rotate-x": 0,
          "--un-rotate-y": 0,
          "--un-rotate-z": 0,
          "--un-scale-x": 1,
          "--un-scale-y": 1,
          "--un-scale-z": 1,
          "--un-skew-x": 0,
          "--un-skew-y": 0,
          "--un-translate-x": 0,
          "--un-translate-y": 0,
          "--un-translate-z": 0
        };
        [
          [
            /^(?:transform-)?origin-(.+)$/,
            ([, e]) => ({ "transform-origin": He[e] ?? P.bracket.cssvar(e) }),
            {
              autocomplete: [
                `transform-origin-(${Object.keys(He).join("|")})`,
                `origin-(${Object.keys(He).join("|")})`
              ]
            }
          ],
          [
            /^(?:transform-)?perspect(?:ive)?-(.+)$/,
            ([, e]) => {
              let t = P.bracket.cssvar.px.numberWithUnit(e);
              if (t != null)
                return { "-webkit-perspective": t, perspective: t };
            }
          ],
          [
            /^(?:transform-)?perspect(?:ive)?-origin-(.+)$/,
            ([, e]) => {
              let t = P.bracket.cssvar(e) ?? (e.length >= 3 ? He[e] : void 0);
              if (t != null)
                return { "-webkit-perspective-origin": t, "perspective-origin": t };
            }
          ],
          [/^(?:transform-)?translate-()(.+)$/, da],
          [/^(?:transform-)?translate-([xyz])-(.+)$/, da],
          [/^(?:transform-)?rotate-()(.+)$/, ha],
          [/^(?:transform-)?rotate-([xyz])-(.+)$/, ha],
          [/^(?:transform-)?skew-()(.+)$/, ga],
          [
            /^(?:transform-)?skew-([xy])-(.+)$/,
            ga,
            {
              autocomplete: [
                "transform-skew-(x|y)-<percent>",
                "skew-(x|y)-<percent>"
              ]
            }
          ],
          [/^(?:transform-)?scale-()(.+)$/, ma],
          [
            /^(?:transform-)?scale-([xyz])-(.+)$/,
            ma,
            {
              autocomplete: [
                `transform-(${zr.join("|")})-<percent>`,
                `transform-(${zr.join("|")})-(x|y|z)-<percent>`,
                `(${zr.join("|")})-<percent>`,
                `(${zr.join("|")})-(x|y|z)-<percent>`
              ]
            }
          ],
          [
            /^(?:transform-)?preserve-3d$/,
            () => ({ "transform-style": "preserve-3d" })
          ],
          [/^(?:transform-)?preserve-flat$/, () => ({ "transform-style": "flat" })],
          ["transform", { transform: he }],
          ["transform-cpu", { transform: he }],
          ["transform-gpu", { transform: Ol }],
          ["transform-none", { transform: "none" }],
          ...se("transform")
        ];
        function da([, e, t], { theme: r }) {
          var _a2;
          let n = ((_a2 = r.spacing) == null ? void 0 : _a2[t]) ?? P.bracket.cssvar.fraction.rem(t);
          if (n != null)
            return [
              ...Er[e].map((o) => [`--un-translate${o}`, n]),
              ["transform", he]
            ];
        }
        function ma([, e, t]) {
          let r = P.bracket.cssvar.fraction.percent(t);
          if (r != null)
            return [...Er[e].map((n) => [`--un-scale${n}`, r]), ["transform", he]];
        }
        function ha([, e = "", t]) {
          let r = P.bracket.cssvar.degree(t);
          if (r != null)
            return e ? { "--un-rotate": 0, [`--un-rotate-${e}`]: r, transform: he } : {
              "--un-rotate-x": 0,
              "--un-rotate-y": 0,
              "--un-rotate-z": 0,
              "--un-rotate": r,
              transform: he
            };
        }
        function ga([, e, t]) {
          let r = P.bracket.cssvar.degree(t);
          if (r != null)
            return [...Er[e].map((n) => [`--un-skew${n}`, r]), ["transform", he]];
        }
        var $a = {
          sans: [
            "ui-sans-serif",
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            '"Noto Sans"',
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"'
          ].join(","),
          serif: [
            "ui-serif",
            "Georgia",
            "Cambria",
            '"Times New Roman"',
            "Times",
            "serif"
          ].join(","),
          mono: [
            "ui-monospace",
            "SFMono-Regular",
            "Menlo",
            "Monaco",
            "Consolas",
            '"Liberation Mono"',
            '"Courier New"',
            "monospace"
          ].join(",")
        }, ka = {
          xs: ["0.75rem", "1rem"],
          sm: ["0.875rem", "1.25rem"],
          base: ["1rem", "1.5rem"],
          lg: ["1.125rem", "1.75rem"],
          xl: ["1.25rem", "1.75rem"],
          "2xl": ["1.5rem", "2rem"],
          "3xl": ["1.875rem", "2.25rem"],
          "4xl": ["2.25rem", "2.5rem"],
          "5xl": ["3rem", "1"],
          "6xl": ["3.75rem", "1"],
          "7xl": ["4.5rem", "1"],
          "8xl": ["6rem", "1"],
          "9xl": ["8rem", "1"]
        }, Sa = {
          DEFAULT: "1.5rem",
          xs: "0.5rem",
          sm: "1rem",
          md: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
          "3xl": "4rem"
        }, Ca = {
          DEFAULT: "1.5rem",
          none: "0",
          sm: "thin",
          md: "medium",
          lg: "thick"
        }, Ra = {
          DEFAULT: ["0 0 1px rgb(0 0 0 / 0.2)", "0 0 1px rgb(1 0 5 / 0.1)"],
          none: "0 0 rgb(0 0 0 / 0)",
          sm: "1px 1px 3px rgb(36 37 47 / 0.25)",
          md: [
            "0 1px 2px rgb(30 29 39 / 0.19)",
            "1px 2px 4px rgb(54 64 147 / 0.18)"
          ],
          lg: ["3px 3px 6px rgb(0 0 0 / 0.26)", "0 0 5px rgb(15 3 86 / 0.22)"],
          xl: [
            "1px 1px 3px rgb(0 0 0 / 0.29)",
            "2px 4px 7px rgb(73 64 125 / 0.35)"
          ]
        }, Ta = {
          none: "1",
          tight: "1.25",
          snug: "1.375",
          normal: "1.5",
          relaxed: "1.625",
          loose: "2"
        }, mn = {
          tighter: "-0.05em",
          tight: "-0.025em",
          normal: "0em",
          wide: "0.025em",
          wider: "0.05em",
          widest: "0.1em"
        }, Ea = {
          thin: "100",
          extralight: "200",
          light: "300",
          normal: "400",
          medium: "500",
          semibold: "600",
          bold: "700",
          extrabold: "800",
          black: "900"
        }, ja = mn, hn = {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px"
        }, za = { ...hn }, Oa = { DEFAULT: "1px", none: "0" }, Aa = {
          DEFAULT: "1rem",
          none: "0",
          xs: "0.75rem",
          sm: "0.875rem",
          lg: "1.125rem",
          xl: "1.25rem",
          "2xl": "1.5rem",
          "3xl": "1.875rem",
          "4xl": "2.25rem",
          "5xl": "3rem",
          "6xl": "3.75rem",
          "7xl": "4.5rem",
          "8xl": "6rem",
          "9xl": "8rem"
        }, Va = {
          DEFAULT: "150ms",
          none: "0s",
          75: "75ms",
          100: "100ms",
          150: "150ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
          700: "700ms",
          1e3: "1000ms"
        }, _a = {
          DEFAULT: "0.25rem",
          none: "0",
          sm: "0.125rem",
          md: "0.375rem",
          lg: "0.5rem",
          xl: "0.75rem",
          "2xl": "1rem",
          "3xl": "1.5rem",
          full: "9999px"
        }, Pa = {
          DEFAULT: [
            "var(--un-shadow-inset) 0 1px 3px 0 rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 1px 2px -1px rgb(0 0 0 / 0.1)"
          ],
          none: "0 0 rgb(0 0 0 / 0)",
          sm: "var(--un-shadow-inset) 0 1px 2px 0 rgb(0 0 0 / 0.05)",
          md: [
            "var(--un-shadow-inset) 0 4px 6px -1px rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 2px 4px -2px rgb(0 0 0 / 0.1)"
          ],
          lg: [
            "var(--un-shadow-inset) 0 10px 15px -3px rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 4px 6px -4px rgb(0 0 0 / 0.1)"
          ],
          xl: [
            "var(--un-shadow-inset) 0 20px 25px -5px rgb(0 0 0 / 0.1)",
            "var(--un-shadow-inset) 0 8px 10px -6px rgb(0 0 0 / 0.1)"
          ],
          "2xl": "var(--un-shadow-inset) 0 25px 50px -12px rgb(0 0 0 / 0.25)",
          inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
        }, Ma = {
          DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
          linear: "linear",
          in: "cubic-bezier(0.4, 0, 1, 1)",
          out: "cubic-bezier(0, 0, 0.2, 1)",
          "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
        }, Fa = { DEFAULT: "1px", none: "0" }, Ua = { auto: "auto" }, La = { mouse: "(hover) and (pointer: fine)" }, Wa = {
          DEFAULT: "8px",
          0: "0",
          sm: "4px",
          md: "12px",
          lg: "16px",
          xl: "24px",
          "2xl": "40px",
          "3xl": "64px"
        }, Na = {
          DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
          sm: "0 1px 1px rgb(0 0 0 / 0.05)",
          md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
          lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
          xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
          "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
          none: "0 0 rgb(0 0 0 / 0)"
        }, Ee = {
          xs: "20rem",
          sm: "24rem",
          md: "28rem",
          lg: "32rem",
          xl: "36rem",
          "2xl": "42rem",
          "3xl": "48rem",
          "4xl": "56rem",
          "5xl": "64rem",
          "6xl": "72rem",
          "7xl": "80rem",
          prose: "65ch"
        }, pn = { auto: "auto", ...Ee, screen: "100vw" }, qe = { none: "none", ...Ee, screen: "100vw" }, dn = { auto: "auto", ...Ee, screen: "100vh" }, Ye = { none: "none", ...Ee, screen: "100vh" }, Ba = Object.fromEntries(
          Object.entries(Ee).map(([e, t]) => [e, `(min-width: ${t})`])
        ), Da = { ...wa, ...va, ...xa }, gn = {
          width: pn,
          height: dn,
          maxWidth: qe,
          maxHeight: Ye,
          minWidth: qe,
          minHeight: Ye,
          inlineSize: pn,
          blockSize: dn,
          maxInlineSize: qe,
          maxBlockSize: Ye,
          minInlineSize: qe,
          minBlockSize: Ye,
          colors: cn,
          fontFamily: $a,
          fontSize: ka,
          fontWeight: Ea,
          breakpoints: hn,
          verticalBreakpoints: za,
          borderRadius: _a,
          lineHeight: Ta,
          letterSpacing: mn,
          wordSpacing: ja,
          boxShadow: Pa,
          textIndent: Sa,
          textShadow: Ra,
          textStrokeWidth: Ca,
          blur: Wa,
          dropShadow: Na,
          easing: Ma,
          lineWidth: Oa,
          spacing: Aa,
          duration: Va,
          ringWidth: Fa,
          preflightBase: Da,
          containers: Ba,
          zIndex: Ua,
          media: La
        };
        var Ia = {
          ...gn,
          aria: {
            busy: 'busy="true"',
            checked: 'checked="true"',
            disabled: 'disabled="true"',
            expanded: 'expanded="true"',
            hidden: 'hidden="true"',
            pressed: 'pressed="true"',
            readonly: 'readonly="true"',
            required: 'required="true"',
            selected: 'selected="true"'
          },
          animation: {
            keyframes: {
              pulse: "{0%, 100% {opacity:1} 50% {opacity:.5}}",
              bounce: "{0%, 100% {transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)} 50% {transform:translateY(0);animation-timing-function:cubic-bezier(0,0,0.2,1)}}",
              spin: "{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
              ping: "{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}",
              "bounce-alt": "{from,20%,53%,80%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0,0)}40%,43%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-30px,0)}70%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}",
              flash: "{from,50%,to{opacity:1}25%,75%{opacity:0}}",
              "pulse-alt": "{from{transform:scale3d(1,1,1)}50%{transform:scale3d(1.05,1.05,1.05)}to{transform:scale3d(1,1,1)}}",
              "rubber-band": "{from{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,0.75,1)}40%{transform:scale3d(0.75,1.25,1)}50%{transform:scale3d(1.15,0.85,1)}65%{transform:scale3d(0.95,1.05,1)}75%{transform:scale3d(1.05,0.95,1)}to{transform:scale3d(1,1,1)}}",
              "shake-x": "{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}20%,40%,60%,80%{transform:translate3d(10px,0,0)}}",
              "shake-y": "{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(0,-10px,0)}20%,40%,60%,80%{transform:translate3d(0,10px,0)}}",
              "head-shake": "{0%{transform:translateX(0)}6.5%{transform:translateX(-6px) rotateY(-9deg)}18.5%{transform:translateX(5px) rotateY(7deg)}31.5%{transform:translateX(-3px) rotateY(-5deg)}43.5%{transform:translateX(2px) rotateY(3deg)}50%{transform:translateX(0)}}",
              swing: "{20%{transform:rotate3d(0,0,1,15deg)}40%{transform:rotate3d(0,0,1,-10deg)}60%{transform:rotate3d(0,0,1,5deg)}80%{transform:rotate3d(0,0,1,-5deg)}to{transform:rotate3d(0,0,1,0deg)}}",
              tada: "{from{transform:scale3d(1,1,1)}10%,20%{transform:scale3d(0.9,0.9,0.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}to{transform:scale3d(1,1,1)}}",
              wobble: "{from{transform:translate3d(0,0,0)}15%{transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}to{transform:translate3d(0,0,0)}}",
              jello: "{from,11.1%,to{transform:translate3d(0,0,0)}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg)skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}}",
              "heart-beat": "{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}",
              hinge: "{0%{transform-origin:top left;animation-timing-function:ease-in-out}20%,60%{transform:rotate3d(0,0,1,80deg);transform-origin:top left;animation-timing-function:ease-in-out}40%,80%{transform:rotate3d(0,0,1,60deg);transform-origin:top left;animation-timing-function:ease-in-out}to{transform:translate3d(0,700px,0);opacity:0}}",
              "jack-in-the-box": "{from{opacity:0;transform-origin:center bottom;transform:scale(0.1) rotate(30deg)}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{transform:scale(1)}}",
              "light-speed-in-left": "{from{opacity:0;transform:translate3d(-100%,0,0) skewX(-30deg)}60%{opacity:1;transform:skewX(20deg)}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}",
              "light-speed-in-right": "{from{opacity:0;transform:translate3d(100%,0,0) skewX(-30deg)}60%{opacity:1;transform:skewX(20deg)}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}",
              "light-speed-out-left": "{from{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0) skewX(30deg)}}",
              "light-speed-out-right": "{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) skewX(30deg)}}",
              flip: "{from{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,0) rotate3d(0,1,0,-360deg);animation-timing-function:ease-out}40%{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);animation-timing-function:ease-out}50%{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);animation-timing-function:ease-in}80%{transform:perspective(400px) scale3d(0.95,0.95,0.95) translate3d(0,0,0) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}to{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,0) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}}",
              "flip-in-x": "{from{transform:perspective(400px) rotate3d(1,0,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(1,0,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(1,0,0,-5deg)}to{transform:perspective(400px)}}",
              "flip-in-y": "{from{transform:perspective(400px) rotate3d(0,1,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(0,1,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(0,1,0,-5deg)}to{transform:perspective(400px)}}",
              "flip-out-x": "{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}to{transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}",
              "flip-out-y": "{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}to{transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}",
              "rotate-in": "{from{transform-origin:center;transform:rotate3d(0,0,1,-200deg);opacity:0}to{transform-origin:center;transform:translate3d(0,0,0);opacity:1}}",
              "rotate-in-down-left": "{from{transform-origin:left bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}to{transform-origin:left bottom;transform:translate3d(0,0,0);opacity:1}}",
              "rotate-in-down-right": "{from{transform-origin:right bottom;transform:rotate3d(0,0,1,45deg);opacity:0}to{transform-origin:right bottom;transform:translate3d(0,0,0);opacity:1}}",
              "rotate-in-up-left": "{from{transform-origin:left top;transform:rotate3d(0,0,1,45deg);opacity:0}to{transform-origin:left top;transform:translate3d(0,0,0);opacity:1}}",
              "rotate-in-up-right": "{from{transform-origin:right bottom;transform:rotate3d(0,0,1,-90deg);opacity:0}to{transform-origin:right bottom;transform:translate3d(0,0,0);opacity:1}}",
              "rotate-out": "{from{transform-origin:center;opacity:1}to{transform-origin:center;transform:rotate3d(0,0,1,200deg);opacity:0}}",
              "rotate-out-down-left": "{from{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,45deg);opacity:0}}",
              "rotate-out-down-right": "{from{transform-origin:right bottom;opacity:1}to{transform-origin:right bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}}",
              "rotate-out-up-left": "{from{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}}",
              "rotate-out-up-right": "{from{transform-origin:right bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,90deg);opacity:0}}",
              "roll-in": "{from{opacity:0;transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "roll-out": "{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}",
              "zoom-in": "{from{opacity:0;transform:scale3d(0.3,0.3,0.3)}50%{opacity:1}}",
              "zoom-in-down": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
              "zoom-in-left": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(-1000px,0,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(10px,0,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
              "zoom-in-right": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(1000px,0,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(-10px,0,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
              "zoom-in-up": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,1000px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
              "zoom-out": "{from{opacity:1}50%{opacity:0;transform:scale3d(0.3,0.3,0.3)}to{opacity:0}}",
              "zoom-out-down": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
              "zoom-out-left": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(42px,0,0)}to{opacity:0;transform:scale(0.1) translate3d(-2000px,0,0);transform-origin:left center}}",
              "zoom-out-right": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(-42px,0,0)}to{opacity:0;transform:scale(0.1) translate3d(2000px,0,0);transform-origin:right center}}",
              "zoom-out-up": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,-2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
              "bounce-in": "{from,20%,40%,60%,80%,to{animation-timing-function:ease-in-out}0%{opacity:0;transform:scale3d(0.3,0.3,0.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(0.9,0.9,0.9)}60%{transform:scale3d(1.03,1.03,1.03);opacity:1}80%{transform:scale3d(0.97,0.97,0.97)}to{opacity:1;transform:scale3d(1,1,1)}}",
              "bounce-in-down": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:translate3d(0,0,0)}}",
              "bounce-in-left": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:translate3d(0,0,0)}}",
              "bounce-in-right": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:translate3d(0,0,0)}}",
              "bounce-in-up": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translate3d(0,0,0)}}",
              "bounce-out": "{20%{transform:scale3d(0.9,0.9,0.9)}50%,55%{opacity:1;transform:scale3d(1.1,1.1,1.1)}to{opacity:0;transform:scale3d(0.3,0.3,0.3)}}",
              "bounce-out-down": "{20%{transform:translate3d(0,10px,0)}40%,45%{opacity:1;transform:translate3d(0,-20px,0)}to{opacity:0;transform:translate3d(0,2000px,0)}}",
              "bounce-out-left": "{20%{opacity:1;transform:translate3d(20px,0,0)}to{opacity:0;transform:translate3d(-2000px,0,0)}}",
              "bounce-out-right": "{20%{opacity:1;transform:translate3d(-20px,0,0)}to{opacity:0;transform:translate3d(2000px,0,0)}}",
              "bounce-out-up": "{20%{transform:translate3d(0,-10px,0)}40%,45%{opacity:1;transform:translate3d(0,20px,0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}",
              "slide-in-down": "{from{transform:translate3d(0,-100%,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
              "slide-in-left": "{from{transform:translate3d(-100%,0,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
              "slide-in-right": "{from{transform:translate3d(100%,0,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
              "slide-in-up": "{from{transform:translate3d(0,100%,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
              "slide-out-down": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,100%,0)}}",
              "slide-out-left": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(-100%,0,0)}}",
              "slide-out-right": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(100%,0,0)}}",
              "slide-out-up": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,-100%,0)}}",
              "fade-in": "{from{opacity:0}to{opacity:1}}",
              "fade-in-down": "{from{opacity:0;transform:translate3d(0,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-down-big": "{from{opacity:0;transform:translate3d(0,-2000px,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-left": "{from{opacity:0;transform:translate3d(-100%,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-left-big": "{from{opacity:0;transform:translate3d(-2000px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-right": "{from{opacity:0;transform:translate3d(100%,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-right-big": "{from{opacity:0;transform:translate3d(2000px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-up": "{from{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-up-big": "{from{opacity:0;transform:translate3d(0,2000px,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-top-left": "{from{opacity:0;transform:translate3d(-100%,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-top-right": "{from{opacity:0;transform:translate3d(100%,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-bottom-left": "{from{opacity:0;transform:translate3d(-100%,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-in-bottom-right": "{from{opacity:0;transform:translate3d(100%,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
              "fade-out": "{from{opacity:1}to{opacity:0}}",
              "fade-out-down": "{from{opacity:1}to{opacity:0;transform:translate3d(0,100%,0)}}",
              "fade-out-down-big": "{from{opacity:1}to{opacity:0;transform:translate3d(0,2000px,0)}}",
              "fade-out-left": "{from{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0)}}",
              "fade-out-left-big": "{from{opacity:1}to{opacity:0;transform:translate3d(-2000px,0,0)}}",
              "fade-out-right": "{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0)}}",
              "fade-out-right-big": "{from{opacity:1}to{opacity:0;transform:translate3d(2000px,0,0)}}",
              "fade-out-up": "{from{opacity:1}to{opacity:0;transform:translate3d(0,-100%,0)}}",
              "fade-out-up-big": "{from{opacity:1}to{opacity:0;transform:translate3d(0,-2000px,0)}}",
              "fade-out-top-left": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-100%,-100%,0)}}",
              "fade-out-top-right": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(100%,-100%,0)}}",
              "fade-out-bottom-left": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-100%,100%,0)}}",
              "fade-out-bottom-right": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(100%,100%,0)}}",
              "back-in-up": "{0%{opacity:0.7;transform:translateY(1200px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
              "back-in-down": "{0%{opacity:0.7;transform:translateY(-1200px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
              "back-in-right": "{0%{opacity:0.7;transform:translateX(2000px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
              "back-in-left": "{0%{opacity:0.7;transform:translateX(-2000px) scale(0.7)}80%{opacity:0.7;transform:translateX(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
              "back-out-up": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateY(-700px) scale(0.7)}}",
              "back-out-down": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateY(700px) scale(0.7)}}",
              "back-out-right": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateX(2000px) scale(0.7)}}",
              "back-out-left": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateX(-2000px) scale(0.7)}100%{opacity:0.7;transform:translateY(-700px) scale(0.7)}}"
            },
            durations: {
              pulse: "2s",
              "heart-beat": "1.3s",
              "bounce-in": "0.75s",
              "bounce-out": "0.75s",
              "flip-out-x": "0.75s",
              "flip-out-y": "0.75s",
              hinge: "2s"
            },
            timingFns: {
              pulse: "cubic-bezier(0.4,0,.6,1)",
              ping: "cubic-bezier(0,0,.2,1)",
              "head-shake": "ease-in-out",
              "heart-beat": "ease-in-out",
              "pulse-alt": "ease-in-out",
              "light-speed-in-left": "ease-out",
              "light-speed-in-right": "ease-out",
              "light-speed-out-left": "ease-in",
              "light-speed-out-right": "ease-in"
            },
            properties: {
              "bounce-alt": { "transform-origin": "center bottom" },
              jello: { "transform-origin": "center" },
              swing: { "transform-origin": "top center" },
              flip: { "backface-visibility": "visible" },
              "flip-in-x": { "backface-visibility": "visible !important" },
              "flip-in-y": { "backface-visibility": "visible !important" },
              "flip-out-x": { "backface-visibility": "visible !important" },
              "flip-out-y": { "backface-visibility": "visible !important" },
              "rotate-in": { "transform-origin": "center" },
              "rotate-in-down-left": { "transform-origin": "left bottom" },
              "rotate-in-down-right": { "transform-origin": "right bottom" },
              "rotate-in-up-left": { "transform-origin": "left bottom" },
              "rotate-in-up-right": { "transform-origin": "right bottom" },
              "rotate-out": { "transform-origin": "center" },
              "rotate-out-down-left": { "transform-origin": "left bottom" },
              "rotate-out-down-right": { "transform-origin": "right bottom" },
              "rotate-out-up-left": { "transform-origin": "left bottom" },
              "rotate-out-up-right": { "transform-origin": "right bottom" },
              hinge: { "transform-origin": "top left" },
              "zoom-out-down": { "transform-origin": "center bottom" },
              "zoom-out-left": { "transform-origin": "left center" },
              "zoom-out-right": { "transform-origin": "right center" },
              "zoom-out-up": { "transform-origin": "center bottom" }
            },
            counts: {
              spin: "infinite",
              ping: "infinite",
              pulse: "infinite",
              "pulse-alt": "infinite",
              bounce: "infinite",
              "bounce-alt": "infinite"
            }
          },
          media: {
            portrait: "(orientation: portrait)",
            landscape: "(orientation: landscape)",
            os_dark: "(prefers-color-scheme: dark)",
            os_light: "(prefers-color-scheme: light)",
            motion_ok: "(prefers-reduced-motion: no-preference)",
            motion_not_ok: "(prefers-reduced-motion: reduce)",
            high_contrast: "(prefers-contrast: high)",
            low_contrast: "(prefers-contrast: low)",
            opacity_ok: "(prefers-reduced-transparency: no-preference)",
            opacity_not_ok: "(prefers-reduced-transparency: reduce)",
            use_data_ok: "(prefers-reduced-data: no-preference)",
            use_data_not_ok: "(prefers-reduced-data: reduce)",
            touch: "(hover: none) and (pointer: coarse)",
            stylus: "(hover: none) and (pointer: fine)",
            pointer: "(hover) and (pointer: coarse)",
            mouse: "(hover) and (pointer: fine)",
            hd_color: "(dynamic-range: high)"
          },
          supports: { grid: "(display: grid)" },
          preflightBase: {
            ...gr,
            ...Qi,
            ...ta,
            ...Zi,
            ...Gi,
            ...cr,
            ...ar,
            ...zi,
            ...Oi
          }
        };
        var Ka = [I("svg", (e) => ({ selector: `${e.selector} svg` }))];
        var Ga = [
          I(".dark", (e) => ({ prefix: `.dark $$ ${e.prefix}` })),
          I(".light", (e) => ({ prefix: `.light $$ ${e.prefix}` })),
          U("@dark", "@media (prefers-color-scheme: dark)"),
          U("@light", "@media (prefers-color-scheme: light)")
        ];
        var Ha = [
          U("contrast-more", "@media (prefers-contrast: more)"),
          U("contrast-less", "@media (prefers-contrast: less)")
        ], qa = [
          U("motion-reduce", "@media (prefers-reduced-motion: reduce)"),
          U("motion-safe", "@media (prefers-reduced-motion: no-preference)")
        ], Ya = [
          U("landscape", "@media (orientation: landscape)"),
          U("portrait", "@media (orientation: portrait)")
        ];
        var Xa = (e) => {
          if (!e.startsWith("_") && (/space-([xy])-(-?.+)$/.test(e) || /divide-/.test(e)))
            return {
              matcher: e,
              selector: (t) => {
                let r = ">:not([hidden])~:not([hidden])";
                return t.includes(r) ? t : `${t}${r}`;
              }
            };
        }, Za = [
          I("@hover", (e) => ({
            parent: `${e.parent ? `${e.parent} $$ ` : ""}@media (hover: hover) and (pointer: fine)`,
            selector: `${e.selector || ""}:hover`
          }))
        ];
        var Ja = (e, { theme: t }) => {
          let r = e.match(/^(.*)\b(placeholder-)(.+)$/);
          if (r) {
            let [, n = "", o, i] = r;
            if (Ce(i, t, "accentColor") || Al(i))
              return { matcher: `${n}placeholder-$ ${o}${i}` };
          }
        };
        function Al(e) {
          let t = e.match(/^op(?:acity)?-?(.+)$/);
          return t && t[1] != null ? l.bracket.percent(t[1]) != null : false;
        }
        function Qa(e) {
          return [Ja, Xa, ...kr(e), ...Ha, ...Ya, ...qa, ...Ka, ...Ga, ...Za];
        }
        var es = (e = {}) => ({
          ...bi(e),
          name: "@unocss/preset-wind",
          theme: Ia,
          rules: ia,
          shortcuts: aa,
          variants: Qa(e)
        });
        function ts(e, t, r) {
          return `calc(${t} + (${e} - ${t}) * ${r} / 100)`;
        }
        function rs(e, t, r) {
          let n = [e, t], o = [];
          for (let a = 0; a < 2; ++a) {
            let s = typeof n[a] == "string" ? G(n[a]) : n[a];
            if (!s || !["rgb", "rgba"].includes(s.type))
              return;
            o.push(s);
          }
          let i = [];
          for (let a = 0; a < 3; ++a)
            i.push(ts(o[0].components[a], o[1].components[a], r));
          return {
            type: "rgb",
            components: i,
            alpha: ts(o[0].alpha ?? 1, o[1].alpha ?? 1, r)
          };
        }
        function ns(e, t) {
          return rs("#fff", e, t);
        }
        function os(e, t) {
          return rs("#000", e, t);
        }
        function Vl(e, t) {
          let r = Number.parseFloat(`${t}`);
          if (!Number.isNaN(r))
            return r > 0 ? os(e, t) : ns(e, -r);
        }
        var _l = { tint: ns, shade: os, shift: Vl };
        function is() {
          let e;
          return {
            name: "mix",
            match(t, r) {
              e || (e = new RegExp(
                `^mix-(tint|shade|shift)-(-?\\d{1,3})(?:${r.generator.config.separators.join("|")})`
              ));
              let n = t.match(e);
              if (n)
                return {
                  matcher: t.slice(n[0].length),
                  body: (o) => (o.forEach((i) => {
                    if (i[1]) {
                      let a = G(`${i[1]}`);
                      if (a) {
                        let s = _l[n[1]](a, n[2]);
                        s && (i[1] = A(s));
                      }
                    }
                  }), o)
                };
            }
          };
        }
        var Pl = (e = {}) => {
          let t = es(e);
          return {
            ...t,
            name: "@unocss/preset-uno",
            variants: [...t.variants, is()]
          };
        }, as = Pl;
        var bn = /^(?!.*\[(?:[^:]+):(?:.+)\]$)((?:.+:)?!?)?(.*)$/;
        function ss(e = {}) {
          let t = e.prefix ?? "un-", r = e.prefixedOnly ?? false, n = e.trueToNonValued ?? false, o;
          return {
            name: "attributify",
            match(i, { generator: a }) {
              var _a2, _b;
              let s = Cn(i);
              if (!s)
                return;
              let c = s[1];
              if (c.startsWith(t))
                c = c.slice(t.length);
              else if (r)
                return;
              let f = s[2], [, u = "", p = f] = f.match(bn) || [];
              if (p === "~" || n && p === "true" || !p)
                return `${u}${c}`;
              if (o == null) {
                let d = (_b = (_a2 = a == null ? void 0 : a.config) == null ? void 0 : _a2.separators) == null ? void 0 : _b.join("|");
                d ? o = new RegExp(`^(.*\\](?:${d}))(\\[[^\\]]+?\\])$`) : o = false;
              }
              if (o) {
                let [, d, h] = f.match(o) || [];
                if (h)
                  return `${d}${u}${c}-${h}`;
              }
              return `${u}${c}-${p}`;
            }
          };
        }
        var Ml = /(<\w[\w:\.$-]*\s)((?:'[^>]*?'|"[^>]*?"|`[^>]*?`|\{[^>]*?\}|[^>]*?)*)/g, Fl = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-]+)(?:=("[^"]*|'[^']*))?/g, cs = /[\s'"`;>]+/;
        function ls(e) {
          return {
            name: "attributify",
            extract: ({ content: t, cursor: r }) => {
              let n = t.matchAll(Ml), o, i = 0;
              for (let b of n) {
                let [, R, m] = b, w = b.index + R.length;
                if (r > w && r <= w + m.length) {
                  i = w, o = m;
                  break;
                }
              }
              if (!o)
                return null;
              let a = o.matchAll(Fl), s = 0, c, f;
              for (let b of a) {
                let [R, m, w] = b, z = i + b.index;
                if (r > z && r <= z + R.length) {
                  s = z, c = m, f = w == null ? void 0 : w.slice(1);
                  break;
                }
              }
              if (!c || c === "class" || c === "className" || c === ":class")
                return null;
              let u = !!(e == null ? void 0 : e.prefix) && c.startsWith(e.prefix);
              if ((e == null ? void 0 : e.prefixedOnly) && !u)
                return null;
              let p = u ? c.slice(e.prefix.length) : c;
              if (f === void 0)
                return {
                  extracted: p,
                  resolveReplacement(b) {
                    let R = u ? e.prefix.length : 0;
                    return { start: s + R, end: s + c.length, replacement: b };
                  }
                };
              let d = s + c.length + 2, h = cs.exec(f), x = 0, $;
              for (; h; ) {
                let [b] = h;
                if (r > d + x && r <= d + x + h.index) {
                  $ = f.slice(x, x + h.index);
                  break;
                }
                x += h.index + b.length, h = cs.exec(f.slice(x));
              }
              $ === void 0 && ($ = f.slice(x));
              let [, y = "", C] = $.match(bn) || [];
              return {
                extracted: `${y}${p}-${C}`,
                transformSuggestions(b) {
                  return b.filter((R) => R.startsWith(`${y}${p}-`)).map((R) => y + R.slice(y.length + p.length + 1));
                },
                resolveReplacement(b) {
                  return {
                    start: x + d,
                    end: x + d + $.length,
                    replacement: y + b.slice(y.length + p.length + 1)
                  };
                }
              };
            }
          };
        }
        var Ul = ["v-bind:", ":"], fs = /[\s'"`;]+/g, xn = /<[^>\s]*\s((?:'.*?'|".*?"|`.*?`|\{.*?\}|[^>]*?)*)/g, Ll = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:!%-.~<]+)=?(?:["]([^"]*)["]|[']([^']*)[']|[{]([^}]*)[}])?/gms, yn = ["placeholder", "fill", "opacity", "stroke-opacity"];
        function us(e) {
          let t = (e == null ? void 0 : e.ignoreAttributes) ?? yn, r = (e == null ? void 0 : e.nonValuedAttribute) ?? true, n = (e == null ? void 0 : e.trueToNonValued) ?? false;
          return {
            name: "@unocss/preset-attributify/extractor",
            extract({ code: o }) {
              return Array.from(o.matchAll(xn)).flatMap((i) => Array.from((i[1] || "").matchAll(Ll))).flatMap(([, i, ...a]) => {
                let s = a.filter(Boolean).join("");
                if (t.includes(i))
                  return [];
                for (let c of Ul)
                  if (i.startsWith(c)) {
                    i = i.slice(c.length);
                    break;
                  }
                if (!s) {
                  if (Oe(i) && r !== false) {
                    let c = [`[${i}=""]`];
                    return n && c.push(`[${i}="true"]`), c;
                  }
                  return [];
                }
                return ["class", "className"].includes(i) ? s.split(fs).filter(Oe) : xn.test(s) ? (xn.lastIndex = 0, this.extract({ code: s })) : (e == null ? void 0 : e.prefixedOnly) && e.prefix && !i.startsWith(e.prefix) ? [] : s.split(fs).filter((c) => !!c && c !== ":").map((c) => `[${i}~="${c}"]`);
              });
            }
          };
        }
        var Wl = (e = {}) => {
          e.strict = e.strict ?? false, e.prefix = e.prefix ?? "un-", e.prefixedOnly = e.prefixedOnly ?? false, e.nonValuedAttribute = e.nonValuedAttribute ?? true, e.ignoreAttributes = e.ignoreAttributes ?? yn;
          let t = [ss(e)], r = [us(e)], n = [ls(e)];
          return {
            name: "@unocss/preset-attributify",
            enforce: "post",
            variants: t,
            extractors: r,
            options: e,
            autocomplete: { extractors: n },
            extractorDefault: e.strict ? false : void 0
          };
        }, ps = Wl;
        function Nl(e) {
          return e.replace(/-(\w)/g, (t, r) => r ? r.toUpperCase() : "");
        }
        function ds(e) {
          return e.charAt(0).toUpperCase() + e.slice(1);
        }
        function ms(e) {
          return e.replace(/(?:^|\B)([A-Z])/g, "-$1").toLowerCase();
        }
        var hs = ["Webkit", "Moz", "ms"];
        function gs(e) {
          let t = {};
          function r(n) {
            let o = t[n];
            if (o)
              return o;
            let i = Nl(n);
            if (i !== "filter" && i in e)
              return t[n] = ms(i);
            i = ds(i);
            for (let a = 0; a < hs.length; a++) {
              let s = `${hs[a]}${i}`;
              if (s in e)
                return t[n] = ms(ds(s));
            }
            return n;
          }
          return ({ entries: n }) => n.forEach((o) => {
            o[0].startsWith("--") || (o[0] = r(o[0]));
          });
        }
        function bs(e) {
          return e.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<");
        }
        function vn(e = {}) {
          var _a2, _b, _c2;
          if (typeof window > "u") {
            console.warn(
              "@unocss/runtime been used in non-browser environment, skipped."
            );
            return;
          }
          let t = window, r = window.document, n = () => r.documentElement, o = t.__unocss || {}, i = Object.assign({}, e, o.runtime), a = i.defaults || {}, s = i.cloakAttribute ?? "un-cloak";
          i.autoPrefix && (a.postprocess = _(a.postprocess)).unshift(
            gs(r.createElement("div").style)
          ), (_a2 = i.configResolved) == null ? void 0 : _a2.call(i, o, a);
          let c = Un(o, a), f = (g) => i.inject ? i.inject(g) : n().prepend(g), u = () => i.rootElement ? i.rootElement() : r.body, p = /* @__PURE__ */ new Map(), d = true, h = /* @__PURE__ */ new Set(), x, $, y = [], C = () => new Promise((g) => {
            y.push(g), $ != null && clearTimeout($), $ = setTimeout(
              () => m().then(() => {
                let k = y;
                y = [], k.forEach((E) => E());
              }),
              0
            );
          });
          function b(g) {
            if (g.nodeType !== 1)
              return;
            let k = g;
            k.hasAttribute(s) && k.removeAttribute(s), k.querySelectorAll(`[${s}]`).forEach((E) => {
              E.removeAttribute(s);
            });
          }
          function R(g, k) {
            let E = p.get(g);
            if (!E)
              if (E = r.createElement("style"), E.setAttribute("data-unocss-runtime-layer", g), p.set(g, E), k == null)
                f(E);
              else {
                let B = R(k), K = B.parentNode;
                K ? K.insertBefore(E, B.nextSibling) : f(E);
              }
            return E;
          }
          async function m() {
            let g = await c.generate(h);
            return g.layers.reduce(
              (k, E) => (R(E, k).innerHTML = g.getLayer(E) ?? "", E),
              void 0
            ), h = g.matched, { ...g, getStyleElement: (k) => p.get(k), getStyleElements: () => p };
          }
          async function w(g) {
            let k = h.size;
            await c.applyExtractors(g, void 0, h), k !== h.size && await C();
          }
          async function z(g = u()) {
            let k = g && g.outerHTML;
            k && (await w(`${k} ${bs(k)}`), b(n()), b(g));
          }
          let W = new MutationObserver((g) => {
            d || g.forEach(async (k) => {
              if (k.target.nodeType !== 1)
                return;
              let E = k.target;
              for (let B of p)
                if (E === B[1])
                  return;
              if (k.type === "childList")
                k.addedNodes.forEach(async (B) => {
                  if (B.nodeType !== 1)
                    return;
                  let K = B;
                  x && !x(K) || (await w(K.outerHTML), b(K));
                });
              else {
                if (x && !x(E))
                  return;
                if (k.attributeName !== s) {
                  let B = Array.from(E.attributes).map((D) => D.value ? `${D.name}="${D.value}"` : D.name).join(" "), K = `<${E.tagName.toLowerCase()} ${B}>`;
                  await w(K);
                }
                E.hasAttribute(s) && E.removeAttribute(s);
              }
            });
          }), N = false;
          function ce() {
            var _a3, _b2;
            if (N)
              return;
            let g = ((_a3 = i.observer) == null ? void 0 : _a3.target) ? i.observer.target() : u();
            g && (W.observe(g, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: (_b2 = i.observer) == null ? void 0 : _b2.attributeFilter
            }), N = true);
          }
          function ge() {
            i.bypassDefined && Bl(c.blocked), z(), ce();
          }
          function je() {
            r.readyState === "loading" ? t.addEventListener("DOMContentLoaded", ge) : ge();
          }
          let Xe = t.__unocss_runtime = t.__unocss_runtime = {
            version: c.version,
            uno: c,
            async extract(g) {
              O(g) || (g.forEach((k) => h.add(k)), g = ""), await w(g);
            },
            extractAll: z,
            inspect(g) {
              x = g;
            },
            toggleObserver(g) {
              g === void 0 ? d = !d : d = !!g, !N && !d && je();
            },
            update: m,
            presets: ((_b = t.__unocss_runtime) == null ? void 0 : _b.presets) ?? {}
          };
          ((_c2 = i.ready) == null ? void 0 : _c2.call(i, Xe)) !== false && (d = false, je());
        }
        function Bl(e = /* @__PURE__ */ new Set()) {
          for (let t = 0; t < document.styleSheets.length; t++) {
            let r = document.styleSheets[t], n;
            try {
              if (n = r.cssRules || r.rules, !n)
                continue;
              Array.from(n).flatMap((o) => {
                var _a2;
                return ((_a2 = o.selectorText) == null ? void 0 : _a2.split(/,/g)) || [];
              }).forEach((o) => {
                o && (o = o.trim(), o.startsWith(".") && (o = o.slice(1)), e.add(o));
              });
            } catch {
              continue;
            }
          }
          return e;
        }
        vn({ defaults: { presets: [as(), ps()] } });
      })();
      window.GM_xmlhttpRequest = _GM_xmlhttpRequest;
      vue.createApp(_sfc_main).mount(
        (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      );
    }
  });
  require_main_001();

})(Vue);