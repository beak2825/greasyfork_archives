// ==UserScript==
// @name         idle-helper
// @namespace    komaedaXnagito/idle-helper
// @version      0.0.7
// @author       komaedaXnagito
// @description  自用脚本
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://gityxs.github.io/*
// @match        https://*.g8hh.com/*
// @match        https://*.g8hh.cn/*
// @match        https://*.g8hh.com.cn/*
// @match        https://g8hh.github.io/*
// @match        https://gltyx.github.io/*
// @match        https://thenonymous.github.io/*
// @match        https://g1tyx.github.io/*
// @match        https://qwqe198.github.io/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.12/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/antd@5.19.3/dist/antd.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/502096/idle-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/502096/idle-helper.meta.js
// ==/UserScript==

(i=>{if(typeof GM_addStyle=="function"){GM_addStyle(i);return}const t=document.createElement("style");t.textContent=i,document.head.append(t)})(" ._app_6qjd7_1{position:fixed;top:0;right:0;z-index:99999999}._modalWrap_6qjd7_8 *{text-align:initial;transition:initial}:where(._modalWrap_6qjd7_8 *){margin:initial;animation-iteration-count:initial;animation-timing-function:initial}._autoer_1w1hr_1{display:grid;grid-gap:12px;grid-row-gap:20px;grid-template-columns:30px 150px 100px 100px auto 100px 100px;align-items:center}._autoer_1dbwm_1{display:grid;grid-gap:12px;grid-row-gap:20px;grid-template-columns:30px 150px auto 100px;align-items:center}:where(.ant-popover *){transition-duration:initial;margin:initial;text-align:initial}:where(.ant-popover){transition-duration:initial;margin:initial;text-align:initial}:where(.ant-select-dropdown *){transition-duration:initial;margin:initial;text-align:initial}:where(.ant-select-dropdown){transition-duration:initial;margin:initial;text-align:initial} ");

(function (require$$0, require$$2, antd, dayjs) {
  'use strict';

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n2) {
    if (n2.__esModule) return n2;
    var f2 = n2.default;
    if (typeof f2 == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f2, arguments, this.constructor);
        }
        return f2.apply(this, arguments);
      };
      a.prototype = f2.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n2).forEach(function(k2) {
      var d = Object.getOwnPropertyDescriptor(n2, k2);
      Object.defineProperty(a, k2, d.get ? d : {
        enumerable: true,
        get: function() {
          return n2[k2];
        }
      });
    });
    return a;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m = require$$2;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const app = "_app_6qjd7_1";
  const modalWrap = "_modalWrap_6qjd7_8";
  const styles$2 = {
    app,
    modalWrap
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var createUpdateEffect = function(hook) {
    return function(effect, deps) {
      var isMounted = require$$0.useRef(false);
      hook(function() {
        return function() {
          isMounted.current = false;
        };
      }, []);
      hook(function() {
        if (!isMounted.current) {
          isMounted.current = true;
        } else {
          return effect();
        }
      }, deps);
    };
  };
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
        s = arguments[i];
        for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2)) t[p2] = s[p2];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
      t[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
        if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
          t[p2[i]] = s[p2[i]];
      }
    return t;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f2, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n2) {
      return function(v) {
        return step([n2, v]);
      };
    }
    function step(op) {
      if (f2) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f2 = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f2 = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o[s], i = 0;
    if (m2) return m2.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n2) {
    var m2 = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m2) return o;
    var i = m2.call(o), r2, ar = [], e;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i.next()).done) ar.push(r2.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i["return"])) m2.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (arguments.length === 2) for (var i = 0, l2 = from.length, ar; i < l2; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message2) {
    var e = new Error(message2);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  var isFunction$1 = function(value) {
    return typeof value === "function";
  };
  var isString = function(value) {
    return typeof value === "string";
  };
  var isNumber = function(value) {
    return typeof value === "number";
  };
  function useMemoizedFn(fn) {
    var fnRef = require$$0.useRef(fn);
    fnRef.current = require$$0.useMemo(function() {
      return fn;
    }, [fn]);
    var memoizedFn = require$$0.useRef();
    if (!memoizedFn.current) {
      memoizedFn.current = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return fnRef.current.apply(this, args);
      };
    }
    return memoizedFn.current;
  }
  const useUpdateEffect = createUpdateEffect(require$$0.useEffect);
  var useAutoRunPlugin = function(fetchInstance, _a) {
    var manual = _a.manual, _b = _a.ready, ready = _b === void 0 ? true : _b, _c = _a.defaultParams, defaultParams = _c === void 0 ? [] : _c, _d = _a.refreshDeps, refreshDeps = _d === void 0 ? [] : _d, refreshDepsAction = _a.refreshDepsAction;
    var hasAutoRun = require$$0.useRef(false);
    hasAutoRun.current = false;
    useUpdateEffect(function() {
      if (!manual && ready) {
        hasAutoRun.current = true;
        fetchInstance.run.apply(fetchInstance, __spreadArray([], __read(defaultParams), false));
      }
    }, [ready]);
    useUpdateEffect(function() {
      if (hasAutoRun.current) {
        return;
      }
      if (!manual) {
        hasAutoRun.current = true;
        if (refreshDepsAction) {
          refreshDepsAction();
        } else {
          fetchInstance.refresh();
        }
      }
    }, __spreadArray([], __read(refreshDeps), false));
    return {
      onBefore: function() {
        if (!ready) {
          return {
            stopNow: true
          };
        }
      }
    };
  };
  useAutoRunPlugin.onInit = function(_a) {
    var _b = _a.ready, ready = _b === void 0 ? true : _b, manual = _a.manual;
    return {
      loading: !manual && ready
    };
  };
  function depsAreSame(oldDeps, deps) {
    if (oldDeps === deps) return true;
    for (var i = 0; i < oldDeps.length; i++) {
      if (!Object.is(oldDeps[i], deps[i])) return false;
    }
    return true;
  }
  function useCreation(factory, deps) {
    var current = require$$0.useRef({
      deps,
      obj: void 0,
      initialized: false
    }).current;
    if (current.initialized === false || !depsAreSame(current.deps, deps)) {
      current.deps = deps;
      current.obj = factory();
      current.initialized = true;
    }
    return current.obj;
  }
  function useLatest$1(value) {
    var ref = require$$0.useRef(value);
    ref.current = value;
    return ref;
  }
  var useUnmount = function(fn) {
    var fnRef = useLatest$1(fn);
    require$$0.useEffect(function() {
      return function() {
        fnRef.current();
      };
    }, []);
  };
  var cache = /* @__PURE__ */ new Map();
  var setCache = function(key2, cacheTime, cachedData) {
    var currentCache = cache.get(key2);
    if (currentCache === null || currentCache === void 0 ? void 0 : currentCache.timer) {
      clearTimeout(currentCache.timer);
    }
    var timer = void 0;
    if (cacheTime > -1) {
      timer = setTimeout(function() {
        cache.delete(key2);
      }, cacheTime);
    }
    cache.set(key2, __assign(__assign({}, cachedData), {
      timer
    }));
  };
  var getCache = function(key2) {
    return cache.get(key2);
  };
  var cachePromise = /* @__PURE__ */ new Map();
  var getCachePromise = function(cacheKey) {
    return cachePromise.get(cacheKey);
  };
  var setCachePromise = function(cacheKey, promise) {
    cachePromise.set(cacheKey, promise);
    promise.then(function(res) {
      cachePromise.delete(cacheKey);
      return res;
    }).catch(function() {
      cachePromise.delete(cacheKey);
    });
  };
  var listeners$2 = {};
  var trigger = function(key2, data) {
    if (listeners$2[key2]) {
      listeners$2[key2].forEach(function(item) {
        return item(data);
      });
    }
  };
  var subscribe$2 = function(key2, listener) {
    if (!listeners$2[key2]) {
      listeners$2[key2] = [];
    }
    listeners$2[key2].push(listener);
    return function unsubscribe() {
      var index = listeners$2[key2].indexOf(listener);
      listeners$2[key2].splice(index, 1);
    };
  };
  var useCachePlugin = function(fetchInstance, _a) {
    var cacheKey = _a.cacheKey, _b = _a.cacheTime, cacheTime = _b === void 0 ? 5 * 60 * 1e3 : _b, _c = _a.staleTime, staleTime = _c === void 0 ? 0 : _c, customSetCache = _a.setCache, customGetCache = _a.getCache;
    var unSubscribeRef = require$$0.useRef();
    var currentPromiseRef = require$$0.useRef();
    var _setCache = function(key2, cachedData) {
      if (customSetCache) {
        customSetCache(cachedData);
      } else {
        setCache(key2, cacheTime, cachedData);
      }
      trigger(key2, cachedData.data);
    };
    var _getCache = function(key2, params) {
      if (params === void 0) {
        params = [];
      }
      if (customGetCache) {
        return customGetCache(params);
      }
      return getCache(key2);
    };
    useCreation(function() {
      if (!cacheKey) {
        return;
      }
      var cacheData = _getCache(cacheKey);
      if (cacheData && Object.hasOwnProperty.call(cacheData, "data")) {
        fetchInstance.state.data = cacheData.data;
        fetchInstance.state.params = cacheData.params;
        if (staleTime === -1 || (/* @__PURE__ */ new Date()).getTime() - cacheData.time <= staleTime) {
          fetchInstance.state.loading = false;
        }
      }
      unSubscribeRef.current = subscribe$2(cacheKey, function(data) {
        fetchInstance.setState({
          data
        });
      });
    }, []);
    useUnmount(function() {
      var _a2;
      (_a2 = unSubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unSubscribeRef);
    });
    if (!cacheKey) {
      return {};
    }
    return {
      onBefore: function(params) {
        var cacheData = _getCache(cacheKey, params);
        if (!cacheData || !Object.hasOwnProperty.call(cacheData, "data")) {
          return {};
        }
        if (staleTime === -1 || (/* @__PURE__ */ new Date()).getTime() - cacheData.time <= staleTime) {
          return {
            loading: false,
            data: cacheData === null || cacheData === void 0 ? void 0 : cacheData.data,
            error: void 0,
            returnNow: true
          };
        } else {
          return {
            data: cacheData === null || cacheData === void 0 ? void 0 : cacheData.data,
            error: void 0
          };
        }
      },
      onRequest: function(service, args) {
        var servicePromise = getCachePromise(cacheKey);
        if (servicePromise && servicePromise !== currentPromiseRef.current) {
          return {
            servicePromise
          };
        }
        servicePromise = service.apply(void 0, __spreadArray([], __read(args), false));
        currentPromiseRef.current = servicePromise;
        setCachePromise(cacheKey, servicePromise);
        return {
          servicePromise
        };
      },
      onSuccess: function(data, params) {
        var _a2;
        if (cacheKey) {
          (_a2 = unSubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unSubscribeRef);
          _setCache(cacheKey, {
            data,
            params,
            time: (/* @__PURE__ */ new Date()).getTime()
          });
          unSubscribeRef.current = subscribe$2(cacheKey, function(d) {
            fetchInstance.setState({
              data: d
            });
          });
        }
      },
      onMutate: function(data) {
        var _a2;
        if (cacheKey) {
          (_a2 = unSubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unSubscribeRef);
          _setCache(cacheKey, {
            data,
            params: fetchInstance.state.params,
            time: (/* @__PURE__ */ new Date()).getTime()
          });
          unSubscribeRef.current = subscribe$2(cacheKey, function(d) {
            fetchInstance.setState({
              data: d
            });
          });
        }
      }
    };
  };
  function isObject$3(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$3;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$2 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$2;
  var root$1 = _root;
  var now$1 = function() {
    return root$1.Date.now();
  };
  var now_1 = now$1;
  var reWhitespace = /\s/;
  function trimmedEndIndex$1(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var _trimmedEndIndex = trimmedEndIndex$1;
  var trimmedEndIndex = _trimmedEndIndex;
  var reTrimStart = /^\s+/;
  function baseTrim$1(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  var _baseTrim = baseTrim$1;
  var root = _root;
  var Symbol$3 = root.Symbol;
  var _Symbol = Symbol$3;
  var Symbol$2 = _Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
  var _getRawTag = getRawTag$1;
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$1;
  var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag$1(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  var _baseGetTag = baseGetTag$1;
  function isObjectLike$2(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$2;
  var baseGetTag = _baseGetTag, isObjectLike$1 = isObjectLike_1;
  var symbolTag = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike$1(value) && baseGetTag(value) == symbolTag;
  }
  var isSymbol_1 = isSymbol$1;
  var baseTrim = _baseTrim, isObject$2 = isObject_1, isSymbol = isSymbol_1;
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber$1(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
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
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_1 = toNumber$1;
  var isObject$1 = isObject_1, now = now_1, toNumber = toNumber_1;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce$1(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    wait = toNumber(wait) || 0;
    if (isObject$1(options)) {
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
      var time = now();
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
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
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
  var debounce_1 = debounce$1;
  const debounce$2 = /* @__PURE__ */ getDefaultExportFromCjs(debounce_1);
  var useDebouncePlugin = function(fetchInstance, _a) {
    var debounceWait = _a.debounceWait, debounceLeading = _a.debounceLeading, debounceTrailing = _a.debounceTrailing, debounceMaxWait = _a.debounceMaxWait;
    var debouncedRef = require$$0.useRef();
    var options = require$$0.useMemo(function() {
      var ret = {};
      if (debounceLeading !== void 0) {
        ret.leading = debounceLeading;
      }
      if (debounceTrailing !== void 0) {
        ret.trailing = debounceTrailing;
      }
      if (debounceMaxWait !== void 0) {
        ret.maxWait = debounceMaxWait;
      }
      return ret;
    }, [debounceLeading, debounceTrailing, debounceMaxWait]);
    require$$0.useEffect(function() {
      if (debounceWait) {
        var _originRunAsync_1 = fetchInstance.runAsync.bind(fetchInstance);
        debouncedRef.current = debounce$2(function(callback) {
          callback();
        }, debounceWait, options);
        fetchInstance.runAsync = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new Promise(function(resolve, reject) {
            var _a2;
            (_a2 = debouncedRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(debouncedRef, function() {
              _originRunAsync_1.apply(void 0, __spreadArray([], __read(args), false)).then(resolve).catch(reject);
            });
          });
        };
        return function() {
          var _a2;
          (_a2 = debouncedRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
          fetchInstance.runAsync = _originRunAsync_1;
        };
      }
    }, [debounceWait, options]);
    if (!debounceWait) {
      return {};
    }
    return {
      onCancel: function() {
        var _a2;
        (_a2 = debouncedRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
      }
    };
  };
  var useLoadingDelayPlugin = function(fetchInstance, _a) {
    var loadingDelay = _a.loadingDelay, ready = _a.ready;
    var timerRef = require$$0.useRef();
    if (!loadingDelay) {
      return {};
    }
    var cancelTimeout = function() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    return {
      onBefore: function() {
        cancelTimeout();
        if (ready !== false) {
          timerRef.current = setTimeout(function() {
            fetchInstance.setState({
              loading: true
            });
          }, loadingDelay);
        }
        return {
          loading: false
        };
      },
      onFinally: function() {
        cancelTimeout();
      },
      onCancel: function() {
        cancelTimeout();
      }
    };
  };
  var isBrowser = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  function isDocumentVisible() {
    if (isBrowser) {
      return document.visibilityState !== "hidden";
    }
    return true;
  }
  var listeners$1 = [];
  function subscribe$1(listener) {
    listeners$1.push(listener);
    return function unsubscribe() {
      var index = listeners$1.indexOf(listener);
      listeners$1.splice(index, 1);
    };
  }
  if (isBrowser) {
    var revalidate$1 = function() {
      if (!isDocumentVisible()) return;
      for (var i = 0; i < listeners$1.length; i++) {
        var listener = listeners$1[i];
        listener();
      }
    };
    window.addEventListener("visibilitychange", revalidate$1, false);
  }
  var usePollingPlugin = function(fetchInstance, _a) {
    var pollingInterval = _a.pollingInterval, _b = _a.pollingWhenHidden, pollingWhenHidden = _b === void 0 ? true : _b, _c = _a.pollingErrorRetryCount, pollingErrorRetryCount = _c === void 0 ? -1 : _c;
    var timerRef = require$$0.useRef();
    var unsubscribeRef = require$$0.useRef();
    var countRef = require$$0.useRef(0);
    var stopPolling = function() {
      var _a2;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      (_a2 = unsubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unsubscribeRef);
    };
    useUpdateEffect(function() {
      if (!pollingInterval) {
        stopPolling();
      }
    }, [pollingInterval]);
    if (!pollingInterval) {
      return {};
    }
    return {
      onBefore: function() {
        stopPolling();
      },
      onError: function() {
        countRef.current += 1;
      },
      onSuccess: function() {
        countRef.current = 0;
      },
      onFinally: function() {
        if (pollingErrorRetryCount === -1 || // When an error occurs, the request is not repeated after pollingErrorRetryCount retries
        pollingErrorRetryCount !== -1 && countRef.current <= pollingErrorRetryCount) {
          timerRef.current = setTimeout(function() {
            if (!pollingWhenHidden && !isDocumentVisible()) {
              unsubscribeRef.current = subscribe$1(function() {
                fetchInstance.refresh();
              });
            } else {
              fetchInstance.refresh();
            }
          }, pollingInterval);
        } else {
          countRef.current = 0;
        }
      },
      onCancel: function() {
        stopPolling();
      }
    };
  };
  function limit(fn, timespan) {
    var pending = false;
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (pending) return;
      pending = true;
      fn.apply(void 0, __spreadArray([], __read(args), false));
      setTimeout(function() {
        pending = false;
      }, timespan);
    };
  }
  function isOnline() {
    if (isBrowser && typeof navigator.onLine !== "undefined") {
      return navigator.onLine;
    }
    return true;
  }
  var listeners = [];
  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
  if (isBrowser) {
    var revalidate = function() {
      if (!isDocumentVisible() || !isOnline()) return;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }
    };
    window.addEventListener("visibilitychange", revalidate, false);
    window.addEventListener("focus", revalidate, false);
  }
  var useRefreshOnWindowFocusPlugin = function(fetchInstance, _a) {
    var refreshOnWindowFocus = _a.refreshOnWindowFocus, _b = _a.focusTimespan, focusTimespan = _b === void 0 ? 5e3 : _b;
    var unsubscribeRef = require$$0.useRef();
    var stopSubscribe = function() {
      var _a2;
      (_a2 = unsubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unsubscribeRef);
    };
    require$$0.useEffect(function() {
      if (refreshOnWindowFocus) {
        var limitRefresh_1 = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan);
        unsubscribeRef.current = subscribe(function() {
          limitRefresh_1();
        });
      }
      return function() {
        stopSubscribe();
      };
    }, [refreshOnWindowFocus, focusTimespan]);
    useUnmount(function() {
      stopSubscribe();
    });
    return {};
  };
  var useRetryPlugin = function(fetchInstance, _a) {
    var retryInterval = _a.retryInterval, retryCount = _a.retryCount;
    var timerRef = require$$0.useRef();
    var countRef = require$$0.useRef(0);
    var triggerByRetry = require$$0.useRef(false);
    if (!retryCount) {
      return {};
    }
    return {
      onBefore: function() {
        if (!triggerByRetry.current) {
          countRef.current = 0;
        }
        triggerByRetry.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      },
      onSuccess: function() {
        countRef.current = 0;
      },
      onError: function() {
        countRef.current += 1;
        if (retryCount === -1 || countRef.current <= retryCount) {
          var timeout = retryInterval !== null && retryInterval !== void 0 ? retryInterval : Math.min(1e3 * Math.pow(2, countRef.current), 3e4);
          timerRef.current = setTimeout(function() {
            triggerByRetry.current = true;
            fetchInstance.refresh();
          }, timeout);
        } else {
          countRef.current = 0;
        }
      },
      onCancel: function() {
        countRef.current = 0;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    };
  };
  var debounce = debounce_1, isObject = isObject_1;
  var FUNC_ERROR_TEXT = "Expected a function";
  function throttle(func, wait, options) {
    var leading = true, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = "leading" in options ? !!options.leading : leading;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      "leading": leading,
      "maxWait": wait,
      "trailing": trailing
    });
  }
  var throttle_1 = throttle;
  const throttle$1 = /* @__PURE__ */ getDefaultExportFromCjs(throttle_1);
  var useThrottlePlugin = function(fetchInstance, _a) {
    var throttleWait = _a.throttleWait, throttleLeading = _a.throttleLeading, throttleTrailing = _a.throttleTrailing;
    var throttledRef = require$$0.useRef();
    var options = {};
    if (throttleLeading !== void 0) {
      options.leading = throttleLeading;
    }
    if (throttleTrailing !== void 0) {
      options.trailing = throttleTrailing;
    }
    require$$0.useEffect(function() {
      if (throttleWait) {
        var _originRunAsync_1 = fetchInstance.runAsync.bind(fetchInstance);
        throttledRef.current = throttle$1(function(callback) {
          callback();
        }, throttleWait, options);
        fetchInstance.runAsync = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new Promise(function(resolve, reject) {
            var _a2;
            (_a2 = throttledRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(throttledRef, function() {
              _originRunAsync_1.apply(void 0, __spreadArray([], __read(args), false)).then(resolve).catch(reject);
            });
          });
        };
        return function() {
          var _a2;
          fetchInstance.runAsync = _originRunAsync_1;
          (_a2 = throttledRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
        };
      }
    }, [throttleWait, throttleLeading, throttleTrailing]);
    if (!throttleWait) {
      return {};
    }
    return {
      onCancel: function() {
        var _a2;
        (_a2 = throttledRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
      }
    };
  };
  var useMount = function(fn) {
    require$$0.useEffect(function() {
      fn === null || fn === void 0 ? void 0 : fn();
    }, []);
  };
  var useUpdate = function() {
    var _a = __read(require$$0.useState({}), 2), setState = _a[1];
    return require$$0.useCallback(function() {
      return setState({});
    }, []);
  };
  var Fetch = (
    /** @class */
    function() {
      function Fetch2(serviceRef, options, subscribe2, initState) {
        if (initState === void 0) {
          initState = {};
        }
        this.serviceRef = serviceRef;
        this.options = options;
        this.subscribe = subscribe2;
        this.initState = initState;
        this.count = 0;
        this.state = {
          loading: false,
          params: void 0,
          data: void 0,
          error: void 0
        };
        this.state = __assign(__assign(__assign({}, this.state), {
          loading: !options.manual
        }), initState);
      }
      Fetch2.prototype.setState = function(s) {
        if (s === void 0) {
          s = {};
        }
        this.state = __assign(__assign({}, this.state), s);
        this.subscribe();
      };
      Fetch2.prototype.runPluginHandler = function(event) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          rest[_i - 1] = arguments[_i];
        }
        var r2 = this.pluginImpls.map(function(i) {
          var _a;
          return (_a = i[event]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([i], __read(rest), false));
        }).filter(Boolean);
        return Object.assign.apply(Object, __spreadArray([{}], __read(r2), false));
      };
      Fetch2.prototype.runAsync = function() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function() {
          var currentCount, _l, _m, stopNow, _o, returnNow, state, servicePromise, res, error_1;
          var _p;
          return __generator(this, function(_q) {
            switch (_q.label) {
              case 0:
                this.count += 1;
                currentCount = this.count;
                _l = this.runPluginHandler("onBefore", params), _m = _l.stopNow, stopNow = _m === void 0 ? false : _m, _o = _l.returnNow, returnNow = _o === void 0 ? false : _o, state = __rest(_l, ["stopNow", "returnNow"]);
                if (stopNow) {
                  return [2, new Promise(function() {
                  })];
                }
                this.setState(__assign({
                  loading: true,
                  params
                }, state));
                if (returnNow) {
                  return [2, Promise.resolve(state.data)];
                }
                (_b = (_a = this.options).onBefore) === null || _b === void 0 ? void 0 : _b.call(_a, params);
                _q.label = 1;
              case 1:
                _q.trys.push([1, 3, , 4]);
                servicePromise = this.runPluginHandler("onRequest", this.serviceRef.current, params).servicePromise;
                if (!servicePromise) {
                  servicePromise = (_p = this.serviceRef).current.apply(_p, __spreadArray([], __read(params), false));
                }
                return [4, servicePromise];
              case 2:
                res = _q.sent();
                if (currentCount !== this.count) {
                  return [2, new Promise(function() {
                  })];
                }
                this.setState({
                  data: res,
                  error: void 0,
                  loading: false
                });
                (_d = (_c = this.options).onSuccess) === null || _d === void 0 ? void 0 : _d.call(_c, res, params);
                this.runPluginHandler("onSuccess", res, params);
                (_f = (_e = this.options).onFinally) === null || _f === void 0 ? void 0 : _f.call(_e, params, res, void 0);
                if (currentCount === this.count) {
                  this.runPluginHandler("onFinally", params, res, void 0);
                }
                return [2, res];
              case 3:
                error_1 = _q.sent();
                if (currentCount !== this.count) {
                  return [2, new Promise(function() {
                  })];
                }
                this.setState({
                  error: error_1,
                  loading: false
                });
                (_h = (_g = this.options).onError) === null || _h === void 0 ? void 0 : _h.call(_g, error_1, params);
                this.runPluginHandler("onError", error_1, params);
                (_k = (_j = this.options).onFinally) === null || _k === void 0 ? void 0 : _k.call(_j, params, void 0, error_1);
                if (currentCount === this.count) {
                  this.runPluginHandler("onFinally", params, void 0, error_1);
                }
                throw error_1;
              case 4:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Fetch2.prototype.run = function() {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        this.runAsync.apply(this, __spreadArray([], __read(params), false)).catch(function(error) {
          if (!_this.options.onError) {
            console.error(error);
          }
        });
      };
      Fetch2.prototype.cancel = function() {
        this.count += 1;
        this.setState({
          loading: false
        });
        this.runPluginHandler("onCancel");
      };
      Fetch2.prototype.refresh = function() {
        this.run.apply(this, __spreadArray([], __read(this.state.params || []), false));
      };
      Fetch2.prototype.refreshAsync = function() {
        return this.runAsync.apply(this, __spreadArray([], __read(this.state.params || []), false));
      };
      Fetch2.prototype.mutate = function(data) {
        var targetData = isFunction$1(data) ? data(this.state.data) : data;
        this.runPluginHandler("onMutate", targetData);
        this.setState({
          data: targetData
        });
      };
      return Fetch2;
    }()
  );
  function useRequestImplement(service, options, plugins) {
    if (options === void 0) {
      options = {};
    }
    if (plugins === void 0) {
      plugins = [];
    }
    var _a = options.manual, manual = _a === void 0 ? false : _a, rest = __rest(options, ["manual"]);
    var fetchOptions = __assign({
      manual
    }, rest);
    var serviceRef = useLatest$1(service);
    var update = useUpdate();
    var fetchInstance = useCreation(function() {
      var initState = plugins.map(function(p2) {
        var _a2;
        return (_a2 = p2 === null || p2 === void 0 ? void 0 : p2.onInit) === null || _a2 === void 0 ? void 0 : _a2.call(p2, fetchOptions);
      }).filter(Boolean);
      return new Fetch(serviceRef, fetchOptions, update, Object.assign.apply(Object, __spreadArray([{}], __read(initState), false)));
    }, []);
    fetchInstance.options = fetchOptions;
    fetchInstance.pluginImpls = plugins.map(function(p2) {
      return p2(fetchInstance, fetchOptions);
    });
    useMount(function() {
      if (!manual) {
        var params = fetchInstance.state.params || options.defaultParams || [];
        fetchInstance.run.apply(fetchInstance, __spreadArray([], __read(params), false));
      }
    });
    useUnmount(function() {
      fetchInstance.cancel();
    });
    return {
      loading: fetchInstance.state.loading,
      data: fetchInstance.state.data,
      error: fetchInstance.state.error,
      params: fetchInstance.state.params || [],
      cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
      refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
      refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
      run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
      runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
      mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance))
    };
  }
  function useRequest(service, options, plugins) {
    return useRequestImplement(service, options, __spreadArray(__spreadArray([], __read([]), false), [useDebouncePlugin, useLoadingDelayPlugin, usePollingPlugin, useRefreshOnWindowFocusPlugin, useThrottlePlugin, useAutoRunPlugin, useCachePlugin, useRetryPlugin], false));
  }
  function getTargetElement(target, defaultElement) {
    if (!isBrowser) {
      return void 0;
    }
    if (!target) {
      return defaultElement;
    }
    var targetElement;
    if (isFunction$1(target)) {
      targetElement = target();
    } else if ("current" in target) {
      targetElement = target.current;
    } else {
      targetElement = target;
    }
    return targetElement;
  }
  var createEffectWithTarget = function(useEffectType) {
    var useEffectWithTarget2 = function(effect, deps, target) {
      var hasInitRef = require$$0.useRef(false);
      var lastElementRef = require$$0.useRef([]);
      var lastDepsRef = require$$0.useRef([]);
      var unLoadRef = require$$0.useRef();
      useEffectType(function() {
        var _a;
        var targets = Array.isArray(target) ? target : [target];
        var els = targets.map(function(item) {
          return getTargetElement(item);
        });
        if (!hasInitRef.current) {
          hasInitRef.current = true;
          lastElementRef.current = els;
          lastDepsRef.current = deps;
          unLoadRef.current = effect();
          return;
        }
        if (els.length !== lastElementRef.current.length || !depsAreSame(lastElementRef.current, els) || !depsAreSame(lastDepsRef.current, deps)) {
          (_a = unLoadRef.current) === null || _a === void 0 ? void 0 : _a.call(unLoadRef);
          lastElementRef.current = els;
          lastDepsRef.current = deps;
          unLoadRef.current = effect();
        }
      });
      useUnmount(function() {
        var _a;
        (_a = unLoadRef.current) === null || _a === void 0 ? void 0 : _a.call(unLoadRef);
        hasInitRef.current = false;
      });
    };
    return useEffectWithTarget2;
  };
  var useEffectWithTarget = createEffectWithTarget(require$$0.useEffect);
  var hasElementType = typeof Element !== "undefined";
  var hasMap = typeof Map === "function";
  var hasSet = typeof Set === "function";
  var hasArrayBuffer = typeof ArrayBuffer === "function" && !!ArrayBuffer.isView;
  function equal(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor) return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0; )
          if (!equal(a[i], b[i])) return false;
        return true;
      }
      var it;
      if (hasMap && a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!b.has(i.value[0])) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!equal(i.value[1], b.get(i.value[0]))) return false;
        return true;
      }
      if (hasSet && a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!b.has(i.value[0])) return false;
        return true;
      }
      if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0; )
          if (a[i] !== b[i]) return false;
        return true;
      }
      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf && typeof a.valueOf === "function" && typeof b.valueOf === "function") return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString && typeof a.toString === "function" && typeof b.toString === "function") return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
      if (hasElementType && a instanceof Element) return false;
      for (i = length; i-- !== 0; ) {
        if ((keys[i] === "_owner" || keys[i] === "__v" || keys[i] === "__o") && a.$$typeof) {
          continue;
        }
        if (!equal(a[keys[i]], b[keys[i]])) return false;
      }
      return true;
    }
    return a !== a && b !== b;
  }
  var reactFastCompare = function isEqual2(a, b) {
    try {
      return equal(a, b);
    } catch (error) {
      if ((error.message || "").match(/stack|recursion/i)) {
        console.warn("react-fast-compare cannot handle circular refs");
        return false;
      }
      throw error;
    }
  };
  const isEqual = /* @__PURE__ */ getDefaultExportFromCjs(reactFastCompare);
  var depsEqual = function(aDeps, bDeps) {
    if (aDeps === void 0) {
      aDeps = [];
    }
    if (bDeps === void 0) {
      bDeps = [];
    }
    return isEqual(aDeps, bDeps);
  };
  var useInterval = function(fn, delay, options) {
    if (options === void 0) {
      options = {};
    }
    var timerCallback = useMemoizedFn(fn);
    var timerRef = require$$0.useRef(null);
    var clear = require$$0.useCallback(function() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, []);
    require$$0.useEffect(function() {
      if (!isNumber(delay) || delay < 0) {
        return;
      }
      if (options.immediate) {
        timerCallback();
      }
      timerRef.current = setInterval(timerCallback, delay);
      return clear;
    }, [delay, options.immediate]);
    return clear;
  };
  var useDeepCompareEffectWithTarget = function(effect, deps, target) {
    var ref = require$$0.useRef();
    var signalRef = require$$0.useRef(0);
    if (!depsEqual(deps, ref.current)) {
      ref.current = deps;
      signalRef.current += 1;
    }
    useEffectWithTarget(effect, [signalRef.current], target);
  };
  var isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(typeof navigator !== "undefined" ? navigator === null || navigator === void 0 ? void 0 : navigator.platform : "");
  var aliasKeyCodeMap = {
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    pausebreak: 19,
    capslock: 20,
    esc: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    leftarrow: 37,
    uparrow: 38,
    rightarrow: 39,
    downarrow: 40,
    insert: 45,
    delete: 46,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    leftwindowkey: 91,
    rightwindowkey: 92,
    meta: isAppleDevice ? [91, 93] : [91, 92],
    selectkey: 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    decimalpoint: 110,
    divide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    equalsign: 187,
    comma: 188,
    dash: 189,
    period: 190,
    forwardslash: 191,
    graveaccent: 192,
    openbracket: 219,
    backslash: 220,
    closebracket: 221,
    singlequote: 222
  };
  var modifierKey = {
    ctrl: function(event) {
      return event.ctrlKey;
    },
    shift: function(event) {
      return event.shiftKey;
    },
    alt: function(event) {
      return event.altKey;
    },
    meta: function(event) {
      if (event.type === "keyup") {
        return aliasKeyCodeMap.meta.includes(event.keyCode);
      }
      return event.metaKey;
    }
  };
  function isValidKeyType(value) {
    return isString(value) || isNumber(value);
  }
  function countKeyByEvent(event) {
    var countOfModifier = Object.keys(modifierKey).reduce(function(total, key2) {
      if (modifierKey[key2](event)) {
        return total + 1;
      }
      return total;
    }, 0);
    return [16, 17, 18, 91, 92].includes(event.keyCode) ? countOfModifier : countOfModifier + 1;
  }
  function genFilterKey(event, keyFilter, exactMatch) {
    var e_1, _a;
    if (!event.key) {
      return false;
    }
    if (isNumber(keyFilter)) {
      return event.keyCode === keyFilter ? keyFilter : false;
    }
    var genArr = keyFilter.split(".");
    var genLen = 0;
    try {
      for (var genArr_1 = __values(genArr), genArr_1_1 = genArr_1.next(); !genArr_1_1.done; genArr_1_1 = genArr_1.next()) {
        var key2 = genArr_1_1.value;
        var genModifier = modifierKey[key2];
        var aliasKeyCode = aliasKeyCodeMap[key2.toLowerCase()];
        if (genModifier && genModifier(event) || aliasKeyCode && aliasKeyCode === event.keyCode) {
          genLen++;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (genArr_1_1 && !genArr_1_1.done && (_a = genArr_1.return)) _a.call(genArr_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    if (exactMatch) {
      return genLen === genArr.length && countKeyByEvent(event) === genArr.length ? keyFilter : false;
    }
    return genLen === genArr.length ? keyFilter : false;
  }
  function genKeyFormatter(keyFilter, exactMatch) {
    if (isFunction$1(keyFilter)) {
      return keyFilter;
    }
    if (isValidKeyType(keyFilter)) {
      return function(event) {
        return genFilterKey(event, keyFilter, exactMatch);
      };
    }
    if (Array.isArray(keyFilter)) {
      return function(event) {
        return keyFilter.find(function(item) {
          return genFilterKey(event, item, exactMatch);
        });
      };
    }
    return function() {
      return Boolean(keyFilter);
    };
  }
  var defaultEvents = ["keydown"];
  function useKeyPress(keyFilter, eventHandler, option) {
    var _a = option || {}, _b = _a.events, events = _b === void 0 ? defaultEvents : _b, target = _a.target, _c = _a.exactMatch, exactMatch = _c === void 0 ? false : _c, _d = _a.useCapture, useCapture = _d === void 0 ? false : _d;
    var eventHandlerRef = useLatest$1(eventHandler);
    var keyFilterRef = useLatest$1(keyFilter);
    useDeepCompareEffectWithTarget(function() {
      var e_2, _a2;
      var _b2;
      var el = getTargetElement(target, window);
      if (!el) {
        return;
      }
      var callbackHandler = function(event) {
        var _a3;
        var genGuard = genKeyFormatter(keyFilterRef.current, exactMatch);
        var keyGuard = genGuard(event);
        var firedKey = isValidKeyType(keyGuard) ? keyGuard : event.key;
        if (keyGuard) {
          return (_a3 = eventHandlerRef.current) === null || _a3 === void 0 ? void 0 : _a3.call(eventHandlerRef, event, firedKey);
        }
      };
      try {
        for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
          var eventName = events_1_1.value;
          (_b2 = el === null || el === void 0 ? void 0 : el.addEventListener) === null || _b2 === void 0 ? void 0 : _b2.call(el, eventName, callbackHandler, useCapture);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (events_1_1 && !events_1_1.done && (_a2 = events_1.return)) _a2.call(events_1);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
      return function() {
        var e_3, _a3;
        var _b3;
        try {
          for (var events_2 = __values(events), events_2_1 = events_2.next(); !events_2_1.done; events_2_1 = events_2.next()) {
            var eventName2 = events_2_1.value;
            (_b3 = el === null || el === void 0 ? void 0 : el.removeEventListener) === null || _b3 === void 0 ? void 0 : _b3.call(el, eventName2, callbackHandler, useCapture);
          }
        } catch (e_3_1) {
          e_3 = {
            error: e_3_1
          };
        } finally {
          try {
            if (events_2_1 && !events_2_1.done && (_a3 = events_2.return)) _a3.call(events_2);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
      };
    }, [events], target);
  }
  function useLatest(value) {
    const ref = require$$0.useRef(value);
    ref.current = value;
    return ref;
  }
  function useGmState(key2, defaultValue) {
    const [state, setState] = require$$0.useState(() => {
      if (typeof defaultValue === "function") {
        return _GM_getValue(key2, defaultValue());
      } else {
        return _GM_getValue(key2, defaultValue);
      }
    });
    const latest = useLatest(state);
    const hookedSetState = require$$0.useCallback((value) => {
      if (typeof value === "function") {
        const newValue = value(latest.current);
        _GM_setValue(key2, newValue);
        setState(newValue);
      } else {
        _GM_setValue(key2, value);
        setState(value);
      }
    }, [setState]);
    return [state, hookedSetState];
  }
  const proxyMap = /* @__PURE__ */ new WeakMap();
  const rawMap = /* @__PURE__ */ new WeakMap();
  function observer(initialVal, cb) {
    const existingProxy = proxyMap.get(initialVal);
    if (existingProxy) {
      return existingProxy;
    }
    if (rawMap.has(initialVal)) {
      return initialVal;
    }
    const proxy = new Proxy(initialVal, {
      get(target, key2, receiver) {
        const res = Reflect.get(target, key2, receiver);
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key2);
        if (!(descriptor == null ? void 0 : descriptor.configurable) && !(descriptor == null ? void 0 : descriptor.writable)) {
          return res;
        }
        return isPlainObject(res) || Array.isArray(res) ? observer(res, cb) : res;
      },
      set(target, key2, val) {
        const ret = Reflect.set(target, key2, val);
        cb();
        return ret;
      },
      deleteProperty(target, key2) {
        const ret = Reflect.deleteProperty(target, key2);
        cb();
        return ret;
      }
    });
    proxyMap.set(initialVal, proxy);
    rawMap.set(proxy, initialVal);
    return proxy;
  }
  function isObjectLike(value) {
    return typeof value === "object" && value !== null;
  }
  function getTag(value) {
    if (value == null) {
      return value === void 0 ? "[object Undefined]" : "[object Null]";
    }
    return toString.call(value);
  }
  function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) !== "[object Object]") {
      return false;
    }
    if (Object.getPrototypeOf(value) === null) {
      return true;
    }
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
  }
  function useGmReactiveState(key2, defaultValue) {
    const initValue = require$$0.useMemo(() => {
      if (typeof defaultValue === "function") {
        return _GM_getValue(key2, defaultValue());
      } else {
        return _GM_getValue(key2, defaultValue);
      }
    }, []);
    const update = useUpdate();
    const stateRef = require$$0.useRef(initValue);
    const state = useCreation(() => {
      return observer(stateRef.current, () => {
        update();
        _GM_setValue(key2, stateRef.current);
      });
    }, []);
    return state;
  }
  const GM_KEY = {
    hotKey: () => {
      return location.href + "#hotKeys";
    },
    moduleTreeAuto: () => {
      return location.href + "#autoer";
    },
    timer: () => {
      return location.href + "#timer";
    }
  };
  function TimerList() {
    const [timerList, setTimerList] = useGmState(GM_KEY.timer(), []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { direction: "vertical", children: [
      timerList.map((timer, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Timer,
          {
            onDelete: () => {
              timerList.splice(index, 1);
              setTimerList([...timerList]);
            },
            timer,
            refresh: () => {
              setTimerList([...timerList]);
            }
          },
          timer.id
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          onClick: () => {
            setTimerList([
              ...timerList,
              {
                id: `${Math.random() * 1e5 | 0}-${Math.random() * 1e5 | 0}-${Math.random() * 1e5 | 0}`,
                delay: void 0,
                code: "",
                enabled: false,
                name: "未命名定时器"
              }
            ]);
          },
          children: "新增定时器"
        }
      ) })
    ] });
  }
  function Timer(props) {
    const [editable, setEditable] = require$$0.useState(false);
    const [code, setCode] = require$$0.useState("");
    useInterval(() => {
      if (props.timer.enabled) {
        eval(props.timer.code);
      }
    }, props.timer.enabled ? props.timer.delay : void 0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Flex, { gap: 12, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "100px"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Checkbox,
            {
              checked: props.timer.enabled,
              onChange: (e) => {
                props.timer.enabled = e.target.checked;
                props.refresh();
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "100px"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Input,
            {
              value: props.timer.name,
              onChange: (e) => {
                props.timer.name = e.target.value;
                props.refresh();
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "300px"
          },
          children: !editable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              children: props.timer.code
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Input.TextArea,
            {
              value: code,
              onChange: (e) => setCode(e.target.value)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "100px"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.InputNumber,
            {
              value: props.timer.delay,
              onChange: (e) => {
                props.timer.delay = e ?? void 0;
                props.refresh();
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "150px"
          },
          children: !editable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Button,
              {
                type: "text",
                onClick: () => {
                  setCode(props.timer.code);
                  setEditable(true);
                },
                children: "编辑"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "text", danger: true, onClick: props.onDelete, children: "删除" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Button,
              {
                onClick: () => {
                  props.timer.code = code;
                  setEditable(false);
                  props.refresh();
                },
                type: "text",
                children: "保存"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Button,
              {
                onClick: () => {
                  setEditable(false);
                },
                type: "text",
                children: "取消"
              }
            )
          ] })
        }
      )
    ] });
  }
  var cjs = { exports: {} };
  var Draggable$2 = {};
  var propTypes = { exports: {} };
  var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
  var ReactPropTypesSecret = ReactPropTypesSecret_1;
  function emptyFunction() {
  }
  function emptyFunctionWithReset() {
  }
  emptyFunctionWithReset.resetWarningCache = emptyFunction;
  var factoryWithThrowingShims = function() {
    function shim(props2, propName, componentName, location2, propFullName, secret) {
      if (secret === ReactPropTypesSecret) {
        return;
      }
      var err = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      err.name = "Invariant Violation";
      throw err;
    }
    shim.isRequired = shim;
    function getShim() {
      return shim;
    }
    var ReactPropTypes = {
      array: shim,
      bigint: shim,
      bool: shim,
      func: shim,
      number: shim,
      object: shim,
      string: shim,
      symbol: shim,
      any: shim,
      arrayOf: getShim,
      element: shim,
      elementType: shim,
      instanceOf: getShim,
      node: shim,
      objectOf: getShim,
      oneOf: getShim,
      oneOfType: getShim,
      shape: getShim,
      exact: getShim,
      checkPropTypes: emptyFunctionWithReset,
      resetWarningCache: emptyFunction
    };
    ReactPropTypes.PropTypes = ReactPropTypes;
    return ReactPropTypes;
  };
  {
    propTypes.exports = factoryWithThrowingShims();
  }
  var propTypesExports = propTypes.exports;
  function r(e) {
    var t, f2, n2 = "";
    if ("string" == typeof e || "number" == typeof e) n2 += e;
    else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f2 = r(e[t])) && (n2 && (n2 += " "), n2 += f2);
    else for (t in e) e[t] && (n2 && (n2 += " "), n2 += t);
    return n2;
  }
  function clsx() {
    for (var e, t, f2 = 0, n2 = ""; f2 < arguments.length; ) (e = arguments[f2++]) && (t = r(e)) && (n2 && (n2 += " "), n2 += t);
    return n2;
  }
  const clsx_m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    clsx,
    default: clsx
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$3 = /* @__PURE__ */ getAugmentedNamespace(clsx_m);
  var domFns = {};
  var shims = {};
  Object.defineProperty(shims, "__esModule", {
    value: true
  });
  shims.dontSetMe = dontSetMe;
  shims.findInArray = findInArray;
  shims.int = int;
  shims.isFunction = isFunction;
  shims.isNum = isNum;
  function findInArray(array, callback) {
    for (let i = 0, length = array.length; i < length; i++) {
      if (callback.apply(callback, [array[i], i, array])) return array[i];
    }
  }
  function isFunction(func) {
    return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
  }
  function isNum(num) {
    return typeof num === "number" && !isNaN(num);
  }
  function int(a) {
    return parseInt(a, 10);
  }
  function dontSetMe(props2, propName, componentName) {
    if (props2[propName]) {
      return new Error("Invalid prop ".concat(propName, " passed to ").concat(componentName, " - do not set this, set it on the child."));
    }
  }
  var getPrefix$1 = {};
  Object.defineProperty(getPrefix$1, "__esModule", {
    value: true
  });
  getPrefix$1.browserPrefixToKey = browserPrefixToKey;
  getPrefix$1.browserPrefixToStyle = browserPrefixToStyle;
  getPrefix$1.default = void 0;
  getPrefix$1.getPrefix = getPrefix;
  const prefixes = ["Moz", "Webkit", "O", "ms"];
  function getPrefix() {
    var _window$document;
    let prop = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
    if (typeof window === "undefined") return "";
    const style = (_window$document = window.document) === null || _window$document === void 0 || (_window$document = _window$document.documentElement) === null || _window$document === void 0 ? void 0 : _window$document.style;
    if (!style) return "";
    if (prop in style) return "";
    for (let i = 0; i < prefixes.length; i++) {
      if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
    }
    return "";
  }
  function browserPrefixToKey(prop, prefix) {
    return prefix ? "".concat(prefix).concat(kebabToTitleCase(prop)) : prop;
  }
  function browserPrefixToStyle(prop, prefix) {
    return prefix ? "-".concat(prefix.toLowerCase(), "-").concat(prop) : prop;
  }
  function kebabToTitleCase(str) {
    let out = "";
    let shouldCapitalize = true;
    for (let i = 0; i < str.length; i++) {
      if (shouldCapitalize) {
        out += str[i].toUpperCase();
        shouldCapitalize = false;
      } else if (str[i] === "-") {
        shouldCapitalize = true;
      } else {
        out += str[i];
      }
    }
    return out;
  }
  getPrefix$1.default = getPrefix();
  Object.defineProperty(domFns, "__esModule", {
    value: true
  });
  domFns.addClassName = addClassName;
  domFns.addEvent = addEvent;
  domFns.addUserSelectStyles = addUserSelectStyles;
  domFns.createCSSTransform = createCSSTransform;
  domFns.createSVGTransform = createSVGTransform;
  domFns.getTouch = getTouch;
  domFns.getTouchIdentifier = getTouchIdentifier;
  domFns.getTranslation = getTranslation;
  domFns.innerHeight = innerHeight;
  domFns.innerWidth = innerWidth;
  domFns.matchesSelector = matchesSelector;
  domFns.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
  domFns.offsetXYFromParent = offsetXYFromParent;
  domFns.outerHeight = outerHeight;
  domFns.outerWidth = outerWidth;
  domFns.removeClassName = removeClassName;
  domFns.removeEvent = removeEvent;
  domFns.removeUserSelectStyles = removeUserSelectStyles;
  var _shims$2 = shims;
  var _getPrefix = _interopRequireWildcard$1(getPrefix$1);
  function _getRequireWildcardCache$1(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache$1 = function(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard$1(obj, nodeInterop) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache2 = _getRequireWildcardCache$1(nodeInterop);
    if (cache2 && cache2.has(obj)) {
      return cache2.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key2 in obj) {
      if (key2 !== "default" && Object.prototype.hasOwnProperty.call(obj, key2)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key2) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key2, desc);
        } else {
          newObj[key2] = obj[key2];
        }
      }
    }
    newObj.default = obj;
    if (cache2) {
      cache2.set(obj, newObj);
    }
    return newObj;
  }
  let matchesSelectorFunc = "";
  function matchesSelector(el, selector) {
    if (!matchesSelectorFunc) {
      matchesSelectorFunc = (0, _shims$2.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(method) {
        return (0, _shims$2.isFunction)(el[method]);
      });
    }
    if (!(0, _shims$2.isFunction)(el[matchesSelectorFunc])) return false;
    return el[matchesSelectorFunc](selector);
  }
  function matchesSelectorAndParentsTo(el, selector, baseNode) {
    let node = el;
    do {
      if (matchesSelector(node, selector)) return true;
      if (node === baseNode) return false;
      node = node.parentNode;
    } while (node);
    return false;
  }
  function addEvent(el, event, handler, inputOptions) {
    if (!el) return;
    const options = {
      capture: true,
      ...inputOptions
    };
    if (el.addEventListener) {
      el.addEventListener(event, handler, options);
    } else if (el.attachEvent) {
      el.attachEvent("on" + event, handler);
    } else {
      el["on" + event] = handler;
    }
  }
  function removeEvent(el, event, handler, inputOptions) {
    if (!el) return;
    const options = {
      capture: true,
      ...inputOptions
    };
    if (el.removeEventListener) {
      el.removeEventListener(event, handler, options);
    } else if (el.detachEvent) {
      el.detachEvent("on" + event, handler);
    } else {
      el["on" + event] = null;
    }
  }
  function outerHeight(node) {
    let height = node.clientHeight;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    height += (0, _shims$2.int)(computedStyle.borderTopWidth);
    height += (0, _shims$2.int)(computedStyle.borderBottomWidth);
    return height;
  }
  function outerWidth(node) {
    let width = node.clientWidth;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    width += (0, _shims$2.int)(computedStyle.borderLeftWidth);
    width += (0, _shims$2.int)(computedStyle.borderRightWidth);
    return width;
  }
  function innerHeight(node) {
    let height = node.clientHeight;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    height -= (0, _shims$2.int)(computedStyle.paddingTop);
    height -= (0, _shims$2.int)(computedStyle.paddingBottom);
    return height;
  }
  function innerWidth(node) {
    let width = node.clientWidth;
    const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
    width -= (0, _shims$2.int)(computedStyle.paddingLeft);
    width -= (0, _shims$2.int)(computedStyle.paddingRight);
    return width;
  }
  function offsetXYFromParent(evt, offsetParent, scale) {
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody ? {
      left: 0,
      top: 0
    } : offsetParent.getBoundingClientRect();
    const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
    const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
    return {
      x,
      y
    };
  }
  function createCSSTransform(controlPos, positionOffset) {
    const translation = getTranslation(controlPos, positionOffset, "px");
    return {
      [(0, _getPrefix.browserPrefixToKey)("transform", _getPrefix.default)]: translation
    };
  }
  function createSVGTransform(controlPos, positionOffset) {
    const translation = getTranslation(controlPos, positionOffset, "");
    return translation;
  }
  function getTranslation(_ref, positionOffset, unitSuffix) {
    let {
      x,
      y
    } = _ref;
    let translation = "translate(".concat(x).concat(unitSuffix, ",").concat(y).concat(unitSuffix, ")");
    if (positionOffset) {
      const defaultX = "".concat(typeof positionOffset.x === "string" ? positionOffset.x : positionOffset.x + unitSuffix);
      const defaultY = "".concat(typeof positionOffset.y === "string" ? positionOffset.y : positionOffset.y + unitSuffix);
      translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
    }
    return translation;
  }
  function getTouch(e, identifier) {
    return e.targetTouches && (0, _shims$2.findInArray)(e.targetTouches, (t) => identifier === t.identifier) || e.changedTouches && (0, _shims$2.findInArray)(e.changedTouches, (t) => identifier === t.identifier);
  }
  function getTouchIdentifier(e) {
    if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
    if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
  }
  function addUserSelectStyles(doc) {
    if (!doc) return;
    let styleEl = doc.getElementById("react-draggable-style-el");
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.type = "text/css";
      styleEl.id = "react-draggable-style-el";
      styleEl.innerHTML = ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n";
      styleEl.innerHTML += ".react-draggable-transparent-selection *::selection {all: inherit;}\n";
      doc.getElementsByTagName("head")[0].appendChild(styleEl);
    }
    if (doc.body) addClassName(doc.body, "react-draggable-transparent-selection");
  }
  function removeUserSelectStyles(doc) {
    if (!doc) return;
    try {
      if (doc.body) removeClassName(doc.body, "react-draggable-transparent-selection");
      if (doc.selection) {
        doc.selection.empty();
      } else {
        const selection = (doc.defaultView || window).getSelection();
        if (selection && selection.type !== "Caret") {
          selection.removeAllRanges();
        }
      }
    } catch (e) {
    }
  }
  function addClassName(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
        el.className += " ".concat(className);
      }
    }
  }
  function removeClassName(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), "g"), "");
    }
  }
  var positionFns = {};
  Object.defineProperty(positionFns, "__esModule", {
    value: true
  });
  positionFns.canDragX = canDragX;
  positionFns.canDragY = canDragY;
  positionFns.createCoreData = createCoreData;
  positionFns.createDraggableData = createDraggableData;
  positionFns.getBoundPosition = getBoundPosition;
  positionFns.getControlPosition = getControlPosition;
  positionFns.snapToGrid = snapToGrid;
  var _shims$1 = shims;
  var _domFns$1 = domFns;
  function getBoundPosition(draggable, x, y) {
    if (!draggable.props.bounds) return [x, y];
    let {
      bounds
    } = draggable.props;
    bounds = typeof bounds === "string" ? bounds : cloneBounds(bounds);
    const node = findDOMNode(draggable);
    if (typeof bounds === "string") {
      const {
        ownerDocument
      } = node;
      const ownerWindow = ownerDocument.defaultView;
      let boundNode;
      if (bounds === "parent") {
        boundNode = node.parentNode;
      } else {
        boundNode = ownerDocument.querySelector(bounds);
      }
      if (!(boundNode instanceof ownerWindow.HTMLElement)) {
        throw new Error('Bounds selector "' + bounds + '" could not find an element.');
      }
      const boundNodeEl = boundNode;
      const nodeStyle = ownerWindow.getComputedStyle(node);
      const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
      bounds = {
        left: -node.offsetLeft + (0, _shims$1.int)(boundNodeStyle.paddingLeft) + (0, _shims$1.int)(nodeStyle.marginLeft),
        top: -node.offsetTop + (0, _shims$1.int)(boundNodeStyle.paddingTop) + (0, _shims$1.int)(nodeStyle.marginTop),
        right: (0, _domFns$1.innerWidth)(boundNodeEl) - (0, _domFns$1.outerWidth)(node) - node.offsetLeft + (0, _shims$1.int)(boundNodeStyle.paddingRight) - (0, _shims$1.int)(nodeStyle.marginRight),
        bottom: (0, _domFns$1.innerHeight)(boundNodeEl) - (0, _domFns$1.outerHeight)(node) - node.offsetTop + (0, _shims$1.int)(boundNodeStyle.paddingBottom) - (0, _shims$1.int)(nodeStyle.marginBottom)
      };
    }
    if ((0, _shims$1.isNum)(bounds.right)) x = Math.min(x, bounds.right);
    if ((0, _shims$1.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom);
    if ((0, _shims$1.isNum)(bounds.left)) x = Math.max(x, bounds.left);
    if ((0, _shims$1.isNum)(bounds.top)) y = Math.max(y, bounds.top);
    return [x, y];
  }
  function snapToGrid(grid, pendingX, pendingY) {
    const x = Math.round(pendingX / grid[0]) * grid[0];
    const y = Math.round(pendingY / grid[1]) * grid[1];
    return [x, y];
  }
  function canDragX(draggable) {
    return draggable.props.axis === "both" || draggable.props.axis === "x";
  }
  function canDragY(draggable) {
    return draggable.props.axis === "both" || draggable.props.axis === "y";
  }
  function getControlPosition(e, touchIdentifier, draggableCore) {
    const touchObj = typeof touchIdentifier === "number" ? (0, _domFns$1.getTouch)(e, touchIdentifier) : null;
    if (typeof touchIdentifier === "number" && !touchObj) return null;
    const node = findDOMNode(draggableCore);
    const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
    return (0, _domFns$1.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
  }
  function createCoreData(draggable, x, y) {
    const isStart = !(0, _shims$1.isNum)(draggable.lastX);
    const node = findDOMNode(draggable);
    if (isStart) {
      return {
        node,
        deltaX: 0,
        deltaY: 0,
        lastX: x,
        lastY: y,
        x,
        y
      };
    } else {
      return {
        node,
        deltaX: x - draggable.lastX,
        deltaY: y - draggable.lastY,
        lastX: draggable.lastX,
        lastY: draggable.lastY,
        x,
        y
      };
    }
  }
  function createDraggableData(draggable, coreData) {
    const scale = draggable.props.scale;
    return {
      node: coreData.node,
      x: draggable.state.x + coreData.deltaX / scale,
      y: draggable.state.y + coreData.deltaY / scale,
      deltaX: coreData.deltaX / scale,
      deltaY: coreData.deltaY / scale,
      lastX: draggable.state.x,
      lastY: draggable.state.y
    };
  }
  function cloneBounds(bounds) {
    return {
      left: bounds.left,
      top: bounds.top,
      right: bounds.right,
      bottom: bounds.bottom
    };
  }
  function findDOMNode(draggable) {
    const node = draggable.findDOMNode();
    if (!node) {
      throw new Error("<DraggableCore>: Unmounted during event!");
    }
    return node;
  }
  var DraggableCore$2 = {};
  var log$1 = {};
  Object.defineProperty(log$1, "__esModule", {
    value: true
  });
  log$1.default = log;
  function log() {
  }
  Object.defineProperty(DraggableCore$2, "__esModule", {
    value: true
  });
  DraggableCore$2.default = void 0;
  var React = _interopRequireWildcard(require$$0);
  var _propTypes = _interopRequireDefault(propTypesExports);
  var _reactDom = _interopRequireDefault(require$$2);
  var _domFns = domFns;
  var _positionFns = positionFns;
  var _shims = shims;
  var _log = _interopRequireDefault(log$1);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj, nodeInterop) {
    if (obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache2 = _getRequireWildcardCache(nodeInterop);
    if (cache2 && cache2.has(obj)) {
      return cache2.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key2 in obj) {
      if (key2 !== "default" && Object.prototype.hasOwnProperty.call(obj, key2)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key2) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key2, desc);
        } else {
          newObj[key2] = obj[key2];
        }
      }
    }
    newObj.default = obj;
    if (cache2) {
      cache2.set(obj, newObj);
    }
    return newObj;
  }
  function _defineProperty(obj, key2, value) {
    key2 = _toPropertyKey(key2);
    if (key2 in obj) {
      Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key2] = value;
    }
    return obj;
  }
  function _toPropertyKey(arg) {
    var key2 = _toPrimitive(arg, "string");
    return typeof key2 === "symbol" ? key2 : String(key2);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  const eventsFor = {
    touch: {
      start: "touchstart",
      move: "touchmove",
      stop: "touchend"
    },
    mouse: {
      start: "mousedown",
      move: "mousemove",
      stop: "mouseup"
    }
  };
  let dragEventFor = eventsFor.mouse;
  let DraggableCore$1 = class DraggableCore2 extends React.Component {
    constructor() {
      super(...arguments);
      _defineProperty(this, "dragging", false);
      _defineProperty(this, "lastX", NaN);
      _defineProperty(this, "lastY", NaN);
      _defineProperty(this, "touchIdentifier", null);
      _defineProperty(this, "mounted", false);
      _defineProperty(this, "handleDragStart", (e) => {
        this.props.onMouseDown(e);
        if (!this.props.allowAnyClick && typeof e.button === "number" && e.button !== 0) return false;
        const thisNode = this.findDOMNode();
        if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
          throw new Error("<DraggableCore> not mounted on DragStart!");
        }
        const {
          ownerDocument
        } = thisNode;
        if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) {
          return;
        }
        if (e.type === "touchstart") e.preventDefault();
        const touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
        this.touchIdentifier = touchIdentifier;
        const position = (0, _positionFns.getControlPosition)(e, touchIdentifier, this);
        if (position == null) return;
        const {
          x,
          y
        } = position;
        const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
        (0, _log.default)("DraggableCore: handleDragStart: %j", coreEvent);
        (0, _log.default)("calling", this.props.onStart);
        const shouldUpdate = this.props.onStart(e, coreEvent);
        if (shouldUpdate === false || this.mounted === false) return;
        if (this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument);
        this.dragging = true;
        this.lastX = x;
        this.lastY = y;
        (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
        (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
      });
      _defineProperty(this, "handleDrag", (e) => {
        const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
        if (position == null) return;
        let {
          x,
          y
        } = position;
        if (Array.isArray(this.props.grid)) {
          let deltaX = x - this.lastX, deltaY = y - this.lastY;
          [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
          if (!deltaX && !deltaY) return;
          x = this.lastX + deltaX, y = this.lastY + deltaY;
        }
        const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
        (0, _log.default)("DraggableCore: handleDrag: %j", coreEvent);
        const shouldUpdate = this.props.onDrag(e, coreEvent);
        if (shouldUpdate === false || this.mounted === false) {
          try {
            this.handleDragStop(new MouseEvent("mouseup"));
          } catch (err) {
            const event = document.createEvent("MouseEvents");
            event.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.handleDragStop(event);
          }
          return;
        }
        this.lastX = x;
        this.lastY = y;
      });
      _defineProperty(this, "handleDragStop", (e) => {
        if (!this.dragging) return;
        const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
        if (position == null) return;
        let {
          x,
          y
        } = position;
        if (Array.isArray(this.props.grid)) {
          let deltaX = x - this.lastX || 0;
          let deltaY = y - this.lastY || 0;
          [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
          x = this.lastX + deltaX, y = this.lastY + deltaY;
        }
        const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
        const shouldContinue = this.props.onStop(e, coreEvent);
        if (shouldContinue === false || this.mounted === false) return false;
        const thisNode = this.findDOMNode();
        if (thisNode) {
          if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
        }
        (0, _log.default)("DraggableCore: handleDragStop: %j", coreEvent);
        this.dragging = false;
        this.lastX = NaN;
        this.lastY = NaN;
        if (thisNode) {
          (0, _log.default)("DraggableCore: Removing handlers");
          (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
          (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
        }
      });
      _defineProperty(this, "onMouseDown", (e) => {
        dragEventFor = eventsFor.mouse;
        return this.handleDragStart(e);
      });
      _defineProperty(this, "onMouseUp", (e) => {
        dragEventFor = eventsFor.mouse;
        return this.handleDragStop(e);
      });
      _defineProperty(this, "onTouchStart", (e) => {
        dragEventFor = eventsFor.touch;
        return this.handleDragStart(e);
      });
      _defineProperty(this, "onTouchEnd", (e) => {
        dragEventFor = eventsFor.touch;
        return this.handleDragStop(e);
      });
    }
    componentDidMount() {
      this.mounted = true;
      const thisNode = this.findDOMNode();
      if (thisNode) {
        (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
          passive: false
        });
      }
    }
    componentWillUnmount() {
      this.mounted = false;
      const thisNode = this.findDOMNode();
      if (thisNode) {
        const {
          ownerDocument
        } = thisNode;
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
        (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
        (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
          passive: false
        });
        if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument);
      }
    }
    // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.
    findDOMNode() {
      var _this$props, _this$props2;
      return (_this$props = this.props) !== null && _this$props !== void 0 && _this$props.nodeRef ? (_this$props2 = this.props) === null || _this$props2 === void 0 || (_this$props2 = _this$props2.nodeRef) === null || _this$props2 === void 0 ? void 0 : _this$props2.current : _reactDom.default.findDOMNode(this);
    }
    render() {
      return /* @__PURE__ */ React.cloneElement(React.Children.only(this.props.children), {
        // Note: mouseMove handler is attached to document so it will still function
        // when the user drags quickly and leaves the bounds of the element.
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        // onTouchStart is added on `componentDidMount` so they can be added with
        // {passive: false}, which allows it to cancel. See
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        onTouchEnd: this.onTouchEnd
      });
    }
  };
  DraggableCore$2.default = DraggableCore$1;
  _defineProperty(DraggableCore$1, "displayName", "DraggableCore");
  _defineProperty(DraggableCore$1, "propTypes", {
    /**
     * `allowAnyClick` allows dragging using any mouse button.
     * By default, we only accept the left button.
     *
     * Defaults to `false`.
     */
    allowAnyClick: _propTypes.default.bool,
    children: _propTypes.default.node.isRequired,
    /**
     * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
     * with the exception of `onMouseDown`, will not fire.
     */
    disabled: _propTypes.default.bool,
    /**
     * By default, we add 'user-select:none' attributes to the document body
     * to prevent ugly text selection during drag. If this is causing problems
     * for your app, set this to `false`.
     */
    enableUserSelectHack: _propTypes.default.bool,
    /**
     * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
     * instead of using the parent node.
     */
    offsetParent: function(props2, propName) {
      if (props2[propName] && props2[propName].nodeType !== 1) {
        throw new Error("Draggable's offsetParent must be a DOM Node.");
      }
    },
    /**
     * `grid` specifies the x and y that dragging should snap to.
     */
    grid: _propTypes.default.arrayOf(_propTypes.default.number),
    /**
     * `handle` specifies a selector to be used as the handle that initiates drag.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *         return (
     *            <Draggable handle=".handle">
     *              <div>
     *                  <div className="handle">Click me to drag</div>
     *                  <div>This is some other content</div>
     *              </div>
     *           </Draggable>
     *         );
     *       }
     *   });
     * ```
     */
    handle: _propTypes.default.string,
    /**
     * `cancel` specifies a selector to be used to prevent drag initialization.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *           return(
     *               <Draggable cancel=".cancel">
     *                   <div>
     *                     <div className="cancel">You can't drag from here</div>
     *                     <div>Dragging here works fine</div>
     *                   </div>
     *               </Draggable>
     *           );
     *       }
     *   });
     * ```
     */
    cancel: _propTypes.default.string,
    /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
     * Unfortunately, in order for <Draggable> to work properly, we need raw access
     * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
     * as in this example:
     *
     * function MyComponent() {
     *   const nodeRef = React.useRef(null);
     *   return (
     *     <Draggable nodeRef={nodeRef}>
     *       <div ref={nodeRef}>Example Target</div>
     *     </Draggable>
     *   );
     * }
     *
     * This can be used for arbitrarily nested components, so long as the ref ends up
     * pointing to the actual child DOM node and not a custom component.
     */
    nodeRef: _propTypes.default.object,
    /**
     * Called when dragging starts.
     * If this function returns the boolean false, dragging will be canceled.
     */
    onStart: _propTypes.default.func,
    /**
     * Called while dragging.
     * If this function returns the boolean false, dragging will be canceled.
     */
    onDrag: _propTypes.default.func,
    /**
     * Called when dragging stops.
     * If this function returns the boolean false, the drag will remain active.
     */
    onStop: _propTypes.default.func,
    /**
     * A workaround option which can be passed if onMouseDown needs to be accessed,
     * since it'll always be blocked (as there is internal use of onMouseDown)
     */
    onMouseDown: _propTypes.default.func,
    /**
     * `scale`, if set, applies scaling while dragging an element
     */
    scale: _propTypes.default.number,
    /**
     * These properties should be defined on the child, not here.
     */
    className: _shims.dontSetMe,
    style: _shims.dontSetMe,
    transform: _shims.dontSetMe
  });
  _defineProperty(DraggableCore$1, "defaultProps", {
    allowAnyClick: false,
    // by default only accept left click
    disabled: false,
    enableUserSelectHack: true,
    onStart: function() {
    },
    onDrag: function() {
    },
    onStop: function() {
    },
    onMouseDown: function() {
    },
    scale: 1
  });
  (function(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "DraggableCore", {
      enumerable: true,
      get: function() {
        return _DraggableCore.default;
      }
    });
    exports.default = void 0;
    var React2 = _interopRequireWildcard2(require$$0);
    var _propTypes2 = _interopRequireDefault2(propTypesExports);
    var _reactDom2 = _interopRequireDefault2(require$$2);
    var _clsx = _interopRequireDefault2(require$$3);
    var _domFns2 = domFns;
    var _positionFns2 = positionFns;
    var _shims2 = shims;
    var _DraggableCore = _interopRequireDefault2(DraggableCore$2);
    var _log2 = _interopRequireDefault2(log$1);
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache2(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache2 = function(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard2(obj, nodeInterop) {
      if (obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache2 = _getRequireWildcardCache2(nodeInterop);
      if (cache2 && cache2.has(obj)) {
        return cache2.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key2 in obj) {
        if (key2 !== "default" && Object.prototype.hasOwnProperty.call(obj, key2)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key2) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key2, desc);
          } else {
            newObj[key2] = obj[key2];
          }
        }
      }
      newObj.default = obj;
      if (cache2) {
        cache2.set(obj, newObj);
      }
      return newObj;
    }
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key2 in source) {
            if (Object.prototype.hasOwnProperty.call(source, key2)) {
              target[key2] = source[key2];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _defineProperty2(obj, key2, value) {
      key2 = _toPropertyKey2(key2);
      if (key2 in obj) {
        Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key2] = value;
      }
      return obj;
    }
    function _toPropertyKey2(arg) {
      var key2 = _toPrimitive2(arg, "string");
      return typeof key2 === "symbol" ? key2 : String(key2);
    }
    function _toPrimitive2(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    class Draggable2 extends React2.Component {
      // React 16.3+
      // Arity (props, state)
      static getDerivedStateFromProps(_ref, _ref2) {
        let {
          position
        } = _ref;
        let {
          prevPropsPosition
        } = _ref2;
        if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
          (0, _log2.default)("Draggable: getDerivedStateFromProps %j", {
            position,
            prevPropsPosition
          });
          return {
            x: position.x,
            y: position.y,
            prevPropsPosition: {
              ...position
            }
          };
        }
        return null;
      }
      constructor(props2) {
        super(props2);
        _defineProperty2(this, "onDragStart", (e, coreData) => {
          (0, _log2.default)("Draggable: onDragStart: %j", coreData);
          const shouldStart = this.props.onStart(e, (0, _positionFns2.createDraggableData)(this, coreData));
          if (shouldStart === false) return false;
          this.setState({
            dragging: true,
            dragged: true
          });
        });
        _defineProperty2(this, "onDrag", (e, coreData) => {
          if (!this.state.dragging) return false;
          (0, _log2.default)("Draggable: onDrag: %j", coreData);
          const uiData = (0, _positionFns2.createDraggableData)(this, coreData);
          const newState = {
            x: uiData.x,
            y: uiData.y,
            slackX: 0,
            slackY: 0
          };
          if (this.props.bounds) {
            const {
              x,
              y
            } = newState;
            newState.x += this.state.slackX;
            newState.y += this.state.slackY;
            const [newStateX, newStateY] = (0, _positionFns2.getBoundPosition)(this, newState.x, newState.y);
            newState.x = newStateX;
            newState.y = newStateY;
            newState.slackX = this.state.slackX + (x - newState.x);
            newState.slackY = this.state.slackY + (y - newState.y);
            uiData.x = newState.x;
            uiData.y = newState.y;
            uiData.deltaX = newState.x - this.state.x;
            uiData.deltaY = newState.y - this.state.y;
          }
          const shouldUpdate = this.props.onDrag(e, uiData);
          if (shouldUpdate === false) return false;
          this.setState(newState);
        });
        _defineProperty2(this, "onDragStop", (e, coreData) => {
          if (!this.state.dragging) return false;
          const shouldContinue = this.props.onStop(e, (0, _positionFns2.createDraggableData)(this, coreData));
          if (shouldContinue === false) return false;
          (0, _log2.default)("Draggable: onDragStop: %j", coreData);
          const newState = {
            dragging: false,
            slackX: 0,
            slackY: 0
          };
          const controlled = Boolean(this.props.position);
          if (controlled) {
            const {
              x,
              y
            } = this.props.position;
            newState.x = x;
            newState.y = y;
          }
          this.setState(newState);
        });
        this.state = {
          // Whether or not we are currently dragging.
          dragging: false,
          // Whether or not we have been dragged before.
          dragged: false,
          // Current transform x and y.
          x: props2.position ? props2.position.x : props2.defaultPosition.x,
          y: props2.position ? props2.position.y : props2.defaultPosition.y,
          prevPropsPosition: {
            ...props2.position
          },
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: false
        };
        if (props2.position && !(props2.onDrag || props2.onStop)) {
          console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
        }
      }
      componentDidMount() {
        if (typeof window.SVGElement !== "undefined" && this.findDOMNode() instanceof window.SVGElement) {
          this.setState({
            isElementSVG: true
          });
        }
      }
      componentWillUnmount() {
        this.setState({
          dragging: false
        });
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
      findDOMNode() {
        var _this$props$nodeRef$c, _this$props;
        return (_this$props$nodeRef$c = (_this$props = this.props) === null || _this$props === void 0 || (_this$props = _this$props.nodeRef) === null || _this$props === void 0 ? void 0 : _this$props.current) !== null && _this$props$nodeRef$c !== void 0 ? _this$props$nodeRef$c : _reactDom2.default.findDOMNode(this);
      }
      render() {
        const {
          axis,
          bounds,
          children,
          defaultPosition,
          defaultClassName,
          defaultClassNameDragging,
          defaultClassNameDragged,
          position,
          positionOffset,
          scale,
          ...draggableCoreProps
        } = this.props;
        let style = {};
        let svgTransform = null;
        const controlled = Boolean(position);
        const draggable = !controlled || this.state.dragging;
        const validPosition = position || defaultPosition;
        const transformOpts = {
          // Set left if horizontal drag is enabled
          x: (0, _positionFns2.canDragX)(this) && draggable ? this.state.x : validPosition.x,
          // Set top if vertical drag is enabled
          y: (0, _positionFns2.canDragY)(this) && draggable ? this.state.y : validPosition.y
        };
        if (this.state.isElementSVG) {
          svgTransform = (0, _domFns2.createSVGTransform)(transformOpts, positionOffset);
        } else {
          style = (0, _domFns2.createCSSTransform)(transformOpts, positionOffset);
        }
        const className = (0, _clsx.default)(children.props.className || "", defaultClassName, {
          [defaultClassNameDragging]: this.state.dragging,
          [defaultClassNameDragged]: this.state.dragged
        });
        return /* @__PURE__ */ React2.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
          onStart: this.onDragStart,
          onDrag: this.onDrag,
          onStop: this.onDragStop
        }), /* @__PURE__ */ React2.cloneElement(React2.Children.only(children), {
          className,
          style: {
            ...children.props.style,
            ...style
          },
          transform: svgTransform
        }));
      }
    }
    exports.default = Draggable2;
    _defineProperty2(Draggable2, "displayName", "Draggable");
    _defineProperty2(Draggable2, "propTypes", {
      // Accepts all props <DraggableCore> accepts.
      ..._DraggableCore.default.propTypes,
      /**
       * `axis` determines which axis the draggable can move.
       *
       *  Note that all callbacks will still return data as normal. This only
       *  controls flushing to the DOM.
       *
       * 'both' allows movement horizontally and vertically.
       * 'x' limits movement to horizontal axis.
       * 'y' limits movement to vertical axis.
       * 'none' limits all movement.
       *
       * Defaults to 'both'.
       */
      axis: _propTypes2.default.oneOf(["both", "x", "y", "none"]),
      /**
       * `bounds` determines the range of movement available to the element.
       * Available values are:
       *
       * 'parent' restricts movement within the Draggable's parent node.
       *
       * Alternatively, pass an object with the following properties, all of which are optional:
       *
       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
       *
       * All values are in px.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable bounds={{right: 300, bottom: 300}}>
       *              <div>Content</div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      bounds: _propTypes2.default.oneOfType([_propTypes2.default.shape({
        left: _propTypes2.default.number,
        right: _propTypes2.default.number,
        top: _propTypes2.default.number,
        bottom: _propTypes2.default.number
      }), _propTypes2.default.string, _propTypes2.default.oneOf([false])]),
      defaultClassName: _propTypes2.default.string,
      defaultClassNameDragging: _propTypes2.default.string,
      defaultClassNameDragged: _propTypes2.default.string,
      /**
       * `defaultPosition` specifies the x and y that the dragged item should start at
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable defaultPosition={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      defaultPosition: _propTypes2.default.shape({
        x: _propTypes2.default.number,
        y: _propTypes2.default.number
      }),
      positionOffset: _propTypes2.default.shape({
        x: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
        y: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
      }),
      /**
       * `position`, if present, defines the current position of the element.
       *
       *  This is similar to how form elements in React work - if no `position` is supplied, the component
       *  is uncontrolled.
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable position={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      position: _propTypes2.default.shape({
        x: _propTypes2.default.number,
        y: _propTypes2.default.number
      }),
      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims2.dontSetMe,
      style: _shims2.dontSetMe,
      transform: _shims2.dontSetMe
    });
    _defineProperty2(Draggable2, "defaultProps", {
      ..._DraggableCore.default.defaultProps,
      axis: "both",
      bounds: false,
      defaultClassName: "react-draggable",
      defaultClassNameDragging: "react-draggable-dragging",
      defaultClassNameDragged: "react-draggable-dragged",
      defaultPosition: {
        x: 0,
        y: 0
      },
      scale: 1
    });
  })(Draggable$2);
  const {
    default: Draggable,
    DraggableCore
  } = Draggable$2;
  cjs.exports = Draggable;
  cjs.exports.default = Draggable;
  cjs.exports.DraggableCore = DraggableCore;
  var cjsExports = cjs.exports;
  const Draggable$1 = /* @__PURE__ */ getDefaultExportFromCjs(cjsExports);
  async function computeSHA256Hash(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  function CloudSave() {
    const [messageApi, contextHolder] = antd.message.useMessage();
    const [host, setHost] = useGmState("cloudSaveHost", "");
    const [key2, setKey] = useGmState("cloudSaveKey", "");
    const [localSaveData, setLocalSaveData] = useGmState("cloudSaveLocalData", void 0);
    const [edit2, setEdit2] = require$$0.useState(false);
    const [editValue, setEditValue] = require$$0.useState("");
    const getPath = () => {
      return location.href.replace(location.search, "");
    };
    const [form] = antd.Form.useForm();
    async function getCloudSaveData() {
      if (!host) {
        messageApi.error("请填写云存档域名");
        return Promise.reject(new Error("请填写云存档域名"));
      }
      if (!key2) {
        messageApi.error("请填写云存档秘钥");
        return Promise.reject(new Error("请填写云存档秘钥"));
      }
      const timestamp = `${Date.now()}`;
      const auth = await computeSHA256Hash(key2 + "-" + timestamp);
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "GET",
          url: host + "/api/cloud_save/get?path=" + getPath(),
          headers: {
            "auth": auth,
            "timestamp": timestamp
          },
          responseType: "json",
          onload(response) {
            console.log("get", response, response.response);
            resolve(response.response);
          }
        });
      });
    }
    require$$0.useEffect(() => {
      if (host && key2) {
        doGetCloudSave();
      }
    }, []);
    const {
      data: cloudSaveData,
      run: doGetCloudSave,
      runAsync: doGetCloudSaveAsync
    } = useRequest(getCloudSaveData, {
      manual: true
    });
    const {
      runAsync: doUploadCloudSave
    } = useRequest(async () => {
      if (!host) {
        messageApi.error("请填写云存档域名");
        return Promise.reject(new Error("请填写云存档域名"));
      }
      if (!key2) {
        messageApi.error("请填写云存档秘钥");
        return Promise.reject(new Error("请填写云存档秘钥"));
      }
      if (!localSaveData) {
        messageApi.error("请先维护本地存档");
        return Promise.reject(new Error("请先维护本地存档"));
      }
      if (!localSaveData.data) {
        messageApi.error("请先维护本地存档");
        return Promise.reject(new Error("请先维护本地存档"));
      }
      const timestamp = `${Date.now()}`;
      const auth = await computeSHA256Hash(key2 + "-" + timestamp);
      const data = {
        path: getPath(),
        version: localSaveData.version || void 0,
        data: localSaveData.data
      };
      if (!data.version) {
        delete data.version;
      }
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "PUT",
          url: host + "/api/cloud_save/save",
          data: JSON.stringify(data),
          headers: {
            "auth": auth,
            "timestamp": timestamp
          },
          responseType: "json",
          onload(response) {
            console.log("upload", response, response.response);
            if (response.status !== 200) {
              reject(new Error(response.statusText));
            }
            resolve(response.response);
          }
        });
      });
    }, {
      manual: true,
      onSuccess(result) {
        if (result) {
          messageApi.success("同步成功");
          doGetCloudSaveAsync().then((x) => {
            if (x) {
              setLocalSaveData({
                data: x.data,
                version: x.version,
                saveTime: x.saveTime,
                path: "",
                ip: x.ip
              });
            }
          });
        }
      },
      onError(e) {
        messageApi.error("同步失败" + e.message);
      }
    });
    function renderContent(data, isLocal) {
      if (edit2 && isLocal) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Input.TextArea,
            {
              value: editValue,
              onChange: (e) => {
                setEditValue(e.target.value);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                onClick: () => {
                  setLocalSaveData({
                    data: editValue,
                    saveTime: Date.now(),
                    path: getPath(),
                    ip: "本机",
                    version: ""
                  });
                  setEdit2(false);
                },
                children: "保存"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { children: "取消" })
          ] })
        ] });
      }
      if (!data) {
        if (isLocal) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "无存档信息,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { onClick: () => setEdit2(true), children: "填写存档信息" })
          ] });
        } else if (data === void 0) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "未加载云存档信息" });
        } else {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "无存档信息" });
        }
      } else {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "保存时间:",
            dayjs(data == null ? void 0 : data.saveTime).format("YYYY-MM-DD HH:mm:ss")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "版本:",
            data == null ? void 0 : data.version
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "IP:",
            data == null ? void 0 : data.ip
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "存档内容:",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  onClick: () => {
                    if (data == null ? void 0 : data.data) {
                      _GM_setClipboard(data == null ? void 0 : data.data, "text/plain");
                    }
                  },
                  children: "点击复制"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Popconfirm,
                {
                  title: "确认一键导入吗？",
                  zIndex: 999999,
                  onConfirm: () => {
                    if (_unsafeWindow.importSave) {
                      _unsafeWindow.importSave(data == null ? void 0 : data.data);
                    }
                  },
                  okText: "导入！",
                  cancelText: "算了",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { children: "模组树一键导入" })
                }
              )
            ] })
          ] })
        ] });
      }
    }
    function uploadCloud() {
      if (!localSaveData) {
        return;
      }
      return doUploadCloudSave();
    }
    function saveFromCloud() {
      if (!cloudSaveData) {
        return;
      }
      setLocalSaveData({
        data: cloudSaveData.data,
        version: cloudSaveData.version,
        saveTime: cloudSaveData.saveTime,
        path: "",
        ip: cloudSaveData.ip
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      contextHolder,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        antd.Form,
        {
          layout: "inline",
          form,
          style: { maxWidth: "none" },
          initialValues: {
            host,
            key: key2
          },
          onValuesChange: (v) => {
            if ("host" in v) {
              setHost(v.host);
            }
            if ("key" in v) {
              setKey(v.key);
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "云存档域名", name: "host", children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Input, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { label: "秘钥", name: "key", children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Input.Password, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => doGetCloudSave(), children: "获取云存档" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Form.Item, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { children: "同步到云存档" }) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Row, { gutter: 16, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          antd.Card,
          {
            title: "本地存档",
            extra: localSaveData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  onClick: () => {
                    if (_unsafeWindow.save && _unsafeWindow.exportSave) {
                      _unsafeWindow.save();
                      let str = btoa(JSON.stringify(_unsafeWindow.player));
                      setLocalSaveData({
                        data: str,
                        saveTime: Date.now(),
                        path: getPath(),
                        ip: "本机",
                        version: ""
                      });
                    }
                  },
                  children: "模组树一键上传"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  onClick: () => {
                    setEdit2(true);
                  },
                  children: "上传新存档"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                antd.Popconfirm,
                {
                  zIndex: 999999,
                  title: "确认同步至云存档吗？",
                  onConfirm: uploadCloud,
                  okText: "确认",
                  cancelText: "取消",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { children: "同步至云" })
                }
              )
            ] }) : null,
            children: renderContent(localSaveData, true)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Col, { span: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          antd.Card,
          {
            title: "云存档",
            extra: cloudSaveData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Popconfirm,
              {
                zIndex: 999999,
                title: "确认使用云存档吗？本地存档将会丢失",
                onConfirm: saveFromCloud,
                okText: "确认",
                cancelText: "取消",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { children: "从云同步" })
              }
            ) : null,
            children: renderContent(cloudSaveData)
          }
        ) })
      ] }) })
    ] });
  }
  function TimeJump() {
    const [customSecond, setCustomSecond] = require$$0.useState(0);
    const diff = require$$0.useMemo(() => {
      const s = customSecond % 60;
      const m2 = (customSecond / 60 | 0) % 60;
      const h = (customSecond / 3600 | 0) % 24;
      const d = customSecond / 3600 / 24 | 0;
      const list = [];
      if (d) list.push(`${d}天`);
      if (h) list.push(`${h}小时`);
      if (m2) list.push(`${m2}分钟`);
      if (s) list.push(`${s}秒`);
      return list.join(" ");
    }, [customSecond]);
    function handle(s) {
      if (_unsafeWindow.save && _unsafeWindow.player && _unsafeWindow.importSave) {
        _unsafeWindow.save();
        const player = JSON.parse(JSON.stringify(_unsafeWindow.player));
        player.time -= s * 1e3;
        _unsafeWindow.importSave(btoa(JSON.stringify(player)));
      }
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { direction: "vertical", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handle(10 * 60), children: "10分钟" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handle(60 * 60), children: "1小时" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handle(24 * 60 * 60), children: "1天" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: () => handle(7 * 24 * 60 * 60), children: "1周" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.InputNumber, { value: customSecond, onChange: (v) => setCustomSecond(v ?? 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: diff }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { disabled: !customSecond, onClick: () => handle(customSecond), children: "走" })
      ] })
    ] });
  }
  const autoer$1 = "_autoer_1w1hr_1";
  const styles$1 = {
    autoer: autoer$1
  };
  function ModuleTreeAuto() {
    const autoers = useGmReactiveState(GM_KEY.moduleTreeAuto(), []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.autoer, children: autoers.map((au, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Autoer,
          {
            autoOp: au,
            onClickRemove: () => {
              autoers.splice(index, 1);
            }
          },
          au.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          onClick: () => autoers.push({
            opt: void 0,
            layer: void 0,
            target: [],
            delay: void 0,
            enable: false,
            id: `${Math.random() * 1e5 | 0}-${Math.random() * 1e5 | 0}-${Math.random() * 1e5 | 0}`
          }),
          children: "加一个"
        }
      ) })
    ] });
  }
  function call(f2) {
    if (typeof f2 === "function") {
      return f2();
    } else {
      return f2;
    }
  }
  function Autoer({
    autoOp,
    onClickRemove: onClickRemove2
  }) {
    const layers = _unsafeWindow.layers ? Object.keys(_unsafeWindow.layers).map((key2) => {
      return {
        label: `${call(_unsafeWindow.layers[key2].symbol)} (${_unsafeWindow.layers[key2].name})`,
        value: key2
      };
    }) : [];
    const {
      layer,
      opt,
      target,
      delay,
      enable: enable2
    } = autoOp;
    useInterval(() => {
      if (!enable2) {
        return;
      }
      if (!target.length || !layer || !opt) {
        return;
      }
      if (opt === "buyables" && _unsafeWindow.buyBuyable) {
        target.forEach((t) => {
          _unsafeWindow.buyBuyable(layer, t);
        });
      } else if (opt === "upgrades" && _unsafeWindow.buyUpgrade) {
        target.forEach((t) => {
          _unsafeWindow.buyUpgrade(layer, t);
        });
      } else if (opt === "upgrades" && _unsafeWindow.buyUpg) {
        target.forEach((t) => {
          _unsafeWindow.buyUpg(layer, t);
        });
      } else if (opt === "clickables" && _unsafeWindow.clickClickable) {
        target.forEach((t) => {
          _unsafeWindow.clickClickable(layer, t);
        });
      }
    }, enable2 ? delay : void 0);
    const opts = require$$0.useMemo(() => {
      if (!layer) {
        return [];
      }
      const t = _unsafeWindow.layers[layer];
      const result = [];
      if (t && t.buyables) {
        result.push({
          label: "可购买项",
          value: "buyables"
        });
      }
      if (t && t.upgrades) {
        result.push({
          label: "升级",
          value: "upgrades"
        });
      }
      if (t && t.clickables) {
        result.push({
          label: "点击",
          value: "clickables"
        });
      }
      return result;
    }, [layer]);
    const targets = require$$0.useMemo(() => {
      var _a;
      if (!layer || !opt) {
        return [];
      }
      const map = (_a = _unsafeWindow.layers[layer]) == null ? void 0 : _a[opt];
      if (!map) {
        return [];
      }
      const x = Object.keys(map).filter((x2) => !(x2 === "rows" || x2 === "cols" || x2 === "layer")).sort((x1, x2) => {
        const r1 = x1.substring(0, x1.length - 1);
        const r2 = x2.substring(0, x2.length - 1);
        return +r1 - +r2;
      }).map((key2) => {
        if (typeof map[key2].title === "function") {
          return {
            label: map[key2].title(),
            value: key2
          };
        } else if (typeof map[key2].display === "function") {
          return {
            label: map[key2].display(),
            value: key2
          };
        } else {
          return {
            label: map[key2].title,
            value: key2
          };
        }
      });
      if (map.rows && map.cols) {
        const result = [];
        for (let i = 1; (i - 1) * map.cols < x.length; i++) {
          const offset = (i - 1) * map.cols;
          result.push(x.slice(offset, offset + map.cols));
        }
        return result;
      }
      return [x];
    }, [layer, opt]);
    const checkAll = require$$0.useMemo(() => {
      const total = targets.map((t) => t.length).reduce((a, b) => a + b, 0);
      return total === autoOp.target.length && total > 0;
    }, [targets, autoOp.target]);
    const indeterminate = autoOp.target.length > 0 && !checkAll;
    const onCheckAllChange = (e) => {
      if (e.target.checked) {
        autoOp.target = targets.flat().map((x) => x.value);
      } else {
        autoOp.target = [];
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Checkbox,
        {
          checked: enable2,
          onChange: (e) => {
            autoOp.enable = e.target.checked;
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Select,
        {
          style: { minWidth: "150px" },
          showSearch: true,
          optionFilterProp: "label",
          options: layers,
          value: layer,
          onChange: (v) => {
            autoOp.target = [];
            autoOp.opt = void 0;
            autoOp.layer = v;
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Select,
        {
          style: { minWidth: "100px" },
          options: opts,
          value: opt,
          onChange: (v) => {
            autoOp.opt = v;
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Checkbox, { indeterminate, onChange: onCheckAllChange, checked: checkAll, children: "全选" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Checkbox.Group, { style: { alignSelf: "center" }, value: autoOp.target, onChange: (e) => autoOp.target = e, children: /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Space, { direction: "vertical", children: targets.map((r2, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Space, { children: r2.map((item) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Checkbox, { value: item.value, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              dangerouslySetInnerHTML: { __html: item.label }
            }
          ) }, item.value);
        }) }, index);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.InputNumber, { value: delay, onChange: (v) => autoOp.delay = v ?? void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: onClickRemove2, type: "text", danger: true, children: "移除" })
    ] });
  }
  const autoer = "_autoer_1dbwm_1";
  const styles = {
    autoer
  };
  function HotKeys() {
    const hotKeys = useGmReactiveState(GM_KEY.hotKey(), []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.autoer, children: hotKeys.map((au, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          HotKey,
          {
            hotKey: au,
            onClickRemove: () => {
              hotKeys.splice(index, 1);
            }
          },
          au.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Button,
        {
          onClick: () => hotKeys.push({
            key: "",
            code: "",
            enable: false,
            id: `${Math.random() * 1e5 | 0}-${Math.random() * 1e5 | 0}-${Math.random() * 1e5 | 0}`
          }),
          children: "加一个"
        }
      ) })
    ] });
  }
  function HotKey({
    hotKey,
    onClickRemove
  }) {
    const [editCode, setEditCode] = require$$0.useState("");
    const [edit, setEdit] = require$$0.useState(false);
    const {
      key,
      code,
      enable
    } = hotKey;
    console.log(key, code);
    useKeyPress(key ? key.split(",").filter((x) => x) : [], () => {
      if (enable && code) {
        eval(code);
      }
    }, {
      exactMatch: true
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.Checkbox,
        {
          checked: enable,
          onChange: (e) => {
            hotKey.enable = e.target.checked;
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Input, { value: hotKey.key, onChange: (e) => hotKey.key = e.target.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "300px"
          },
          children: !edit ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              children: hotKey.code
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            antd.Input.TextArea,
            {
              value: editCode,
              onChange: (e) => setEditCode(e.target.value)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: "150px"
          },
          children: !edit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Button,
              {
                type: "text",
                onClick: () => {
                  setEditCode(hotKey.code);
                  setEdit(true);
                },
                children: "编辑"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "text", danger: true, onClick: onClickRemove, children: "删除" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Button,
              {
                onClick: () => {
                  hotKey.code = editCode;
                  setEdit(false);
                },
                type: "text",
                children: "保存"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              antd.Button,
              {
                onClick: () => {
                  setEdit(false);
                },
                type: "text",
                children: "取消"
              }
            )
          ] })
        }
      )
    ] });
  }
  function Config() {
    const [messageApi, messageContext] = antd.message.useMessage();
    function onClickExport() {
      const auto = GM_KEY.moduleTreeAuto();
      const timer = GM_KEY.timer();
      const hotKey2 = GM_KEY.hotKey();
      const obj = {
        timer: _GM_getValue(timer),
        auto: _GM_getValue(auto),
        hotKey: _GM_getValue(hotKey2)
      };
      _GM_setClipboard(btoa(encodeURIComponent(JSON.stringify(obj))), "text/plain");
      messageApi.success("配置导出成功");
    }
    function onClickImport() {
      const p2 = prompt("请黏贴配置");
      if (!p2) {
        return;
      }
      const obj = JSON.parse(decodeURIComponent(atob(p2)));
      const auto = GM_KEY.moduleTreeAuto();
      const timer = GM_KEY.timer();
      const hotKey2 = GM_KEY.hotKey();
      _GM_setValue(auto, obj.auto);
      _GM_setValue(timer, obj.timer);
      _GM_setValue(hotKey2, obj.hotKey);
      location.reload();
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(antd.Space, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: onClickExport, children: "导出配置" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { onClick: onClickImport, children: "导入配置" }),
      messageContext
    ] });
  }
  function MyModal(props2) {
    const [disabled, setDisabled] = require$$0.useState(true);
    const [bounds, setBounds] = useGmState("dialogPos", { left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = require$$0.useRef(null);
    const onStart = (_event, uiData) => {
      var _a;
      const { clientWidth, clientHeight } = _unsafeWindow.document.documentElement;
      const targetRect = (_a = draggleRef.current) == null ? void 0 : _a.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y)
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      antd.Modal,
      {
        wrapClassName: styles$2.modalWrap,
        width: "fit-content",
        title: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: "100%",
              cursor: "move"
            },
            onMouseOver: () => {
              if (disabled) {
                setDisabled(false);
              }
            },
            onMouseOut: () => {
              setDisabled(true);
            },
            onFocus: () => {
            },
            onBlur: () => {
            },
            children: "Idle Helper"
          }
        ),
        mask: false,
        open: props2.visible,
        onClose: props2.onClose,
        onCancel: props2.onClose,
        footer: false,
        modalRender: (modal) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Draggable$1,
          {
            disabled,
            bounds,
            nodeRef: draggleRef,
            onStart: (event, uiData) => onStart(event, uiData),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: draggleRef, children: modal })
          }
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          antd.Tabs,
          {
            defaultActiveKey: "timer",
            items: [
              {
                label: "定时器",
                key: "timer",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimerList, {})
              },
              {
                label: "云存档",
                key: "cloudSave",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudSave, {})
              },
              {
                label: "TimeJump(模组树)",
                key: "timeJump",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimeJump, {})
              },
              {
                label: "模组树自动化",
                key: "moduleTreeAutoer",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleTreeAuto, {})
              },
              {
                label: "快捷键注册",
                key: "hotKey",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(HotKeys, {})
              },
              {
                label: "配置导出",
                key: "config",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Config, {})
              }
            ]
          }
        )
      }
    );
  }
  function App() {
    const [visible, setVisible] = require$$0.useState(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(antd.Button, { type: "primary", size: "small", className: styles$2.app, onClick: () => setVisible(true), children: "Idle Helper" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        antd.ConfigProvider,
        {
          theme: {
            token: {
              zIndexBase: 999e3,
              zIndexPopupBase: 999999
            }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(MyModal, { visible, onClose: () => setVisible(false) })
        }
      )
    ] });
  }
  client.createRoot(
    (() => {
      const app2 = document.createElement("div");
      app2.id = "idle-helper";
      document.body.append(app2);
      return app2;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );

})(React, ReactDOM, antd, dayjs);