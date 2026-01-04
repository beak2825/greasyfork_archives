// ==UserScript==
// @name         WELearn网课助手
// @namespace    https://github.com/SSmJaE/WELearnHelper
// @version      1.1.0
// @author       SSmJaE
// @description  显示WE Learn随行课堂题目答案；支持班级测试；自动答题；刷时长；基于生成式AI(ChatGPT)的答案生成
// @license      GPL-3.0
// @icon         https://vitejs.dev/logo.svg
// @homepage     https://www.github.com/SSmJaE/
// @match        *://course.sflep.com/*
// @match        *://welearn.sflep.com/*
// @match        *://wetest.sflep.com/*
// @match        *://courseappserver.sflep.com/*
// @match        *://centercourseware.sflep.com/*
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @connect      localhost
// @connect      47.100.166.53
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/398601/WELearn%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398601/WELearn%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(e=>{const i=document.createElement("style");i.dataset.source="vite-plugin-monkey",i.innerText=e,document.head.appendChild(i)})(' .i-icon{display:inline-block;color:inherit;font-style:normal;line-height:0;text-align:center;text-transform:none;vertical-align:-.125em;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.i-icon-spin svg{animation:i-icon-spin 1s infinite linear}.i-icon-rtl{transform:scaleX(-1)}@keyframes i-icon-spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes i-icon-spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}[data-simplebar]{position:relative;flex-direction:column;flex-wrap:wrap;justify-content:flex-start;align-content:flex-start;align-items:flex-start}.simplebar-wrapper{overflow:hidden;width:inherit;height:inherit;max-width:inherit;max-height:inherit}.simplebar-mask{direction:inherit;position:absolute;overflow:hidden;padding:0;margin:0;left:0;top:0;bottom:0;right:0;width:auto!important;height:auto!important;z-index:0}.simplebar-offset{direction:inherit!important;box-sizing:inherit!important;resize:none!important;position:absolute;top:0;left:0;bottom:0;right:0;padding:0;margin:0;-webkit-overflow-scrolling:touch}.simplebar-content-wrapper{direction:inherit;box-sizing:border-box!important;position:relative;display:block;height:100%;width:auto;max-width:100%;max-height:100%;overflow:auto;scrollbar-width:none;-ms-overflow-style:none}.simplebar-content-wrapper::-webkit-scrollbar,.simplebar-hide-scrollbar::-webkit-scrollbar{display:none;width:0;height:0}.simplebar-content:after,.simplebar-content:before{content:" ";display:table}.simplebar-placeholder{max-height:100%;max-width:100%;width:100%;pointer-events:none}.simplebar-height-auto-observer-wrapper{box-sizing:inherit!important;height:100%;width:100%;max-width:1px;position:relative;float:left;max-height:1px;overflow:hidden;z-index:-1;padding:0;margin:0;pointer-events:none;flex-grow:inherit;flex-shrink:0;flex-basis:0}.simplebar-height-auto-observer{box-sizing:inherit;display:block;opacity:0;position:absolute;top:0;left:0;height:1000%;width:1000%;min-height:1px;min-width:1px;overflow:hidden;pointer-events:none;z-index:-1}.simplebar-track{z-index:1;position:absolute;right:0;bottom:0;pointer-events:none;overflow:hidden}[data-simplebar].simplebar-dragging,[data-simplebar].simplebar-dragging .simplebar-content{pointer-events:none;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[data-simplebar].simplebar-dragging .simplebar-track{pointer-events:all}.simplebar-scrollbar{position:absolute;left:0;right:0;min-height:10px}.simplebar-scrollbar:before{position:absolute;content:"";background:#000;border-radius:7px;left:2px;right:2px;opacity:0;transition:opacity .2s .5s linear}.simplebar-scrollbar.simplebar-visible:before{opacity:.5;transition-delay:0s;transition-duration:0s}.simplebar-track.simplebar-vertical{top:0;width:11px}.simplebar-scrollbar:before{top:2px;bottom:2px;left:2px;right:2px}.simplebar-track.simplebar-horizontal{left:0;height:11px}.simplebar-track.simplebar-horizontal .simplebar-scrollbar{right:auto;left:0;top:0;bottom:0;min-height:0;min-width:10px;width:auto}[data-simplebar-direction=rtl] .simplebar-track.simplebar-vertical{right:auto;left:0}.simplebar-dummy-scrollbar-size{direction:rtl;position:fixed;opacity:0;visibility:hidden;height:500px;width:500px;overflow-y:hidden;overflow-x:scroll;-ms-overflow-style:scrollbar!important}.simplebar-dummy-scrollbar-size>div{width:200%;height:200%;margin:10px 0}.simplebar-hide-scrollbar{position:fixed;left:0;visibility:hidden;overflow-y:scroll;scrollbar-width:none;-ms-overflow-style:none} ');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(React$1, require$$2) {
  var _a, _b, _c, _d;
  "use strict";
  function _interopNamespaceDefault(e2) {
    const n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e2) {
      for (const k2 in e2) {
        if (k2 !== "default") {
          const d2 = Object.getOwnPropertyDescriptor(e2, k2);
          Object.defineProperty(n2, k2, d2.get ? d2 : {
            enumerable: true,
            get: () => e2[k2]
          });
        }
      }
    }
    n2.default = e2;
    return Object.freeze(n2);
  }
  const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React$1);
  const require$$2__namespace = /* @__PURE__ */ _interopNamespaceDefault(require$$2);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  function getAugmentedNamespace(n2) {
    if (n2.__esModule)
      return n2;
    var f2 = n2.default;
    if (typeof f2 == "function") {
      var a2 = function a3() {
        if (this instanceof a3) {
          var args = [null];
          args.push.apply(args, arguments);
          var Ctor = Function.bind.apply(f2, args);
          return new Ctor();
        }
        return f2.apply(this, arguments);
      };
      a2.prototype = f2.prototype;
    } else
      a2 = {};
    Object.defineProperty(a2, "__esModule", { value: true });
    Object.keys(n2).forEach(function(k2) {
      var d2 = Object.getOwnPropertyDescriptor(n2, k2);
      Object.defineProperty(a2, k2, d2.get ? d2 : {
        enumerable: true,
        get: function() {
          return n2[k2];
        }
      });
    });
    return a2;
  }
  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports() {
      return jsxRuntimeExports;
    },
    set exports(v2) {
      jsxRuntimeExports = v2;
    }
  };
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
  var f$6 = React$1, k$6 = Symbol.for("react.element"), l$8 = Symbol.for("react.fragment"), m$7 = Object.prototype.hasOwnProperty, n$6 = f$6.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$7 = { key: true, ref: true, __self: true, __source: true };
  function q$4(c2, a2, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a2.key && (e2 = "" + a2.key);
    void 0 !== a2.ref && (h2 = a2.ref);
    for (b2 in a2)
      m$7.call(a2, b2) && !p$7.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
    if (c2 && c2.defaultProps)
      for (b2 in a2 = c2.defaultProps, a2)
        void 0 === d2[b2] && (d2[b2] = a2[b2]);
    return { $$typeof: k$6, type: c2, key: e2, ref: h2, props: d2, _owner: n$6.current };
  }
  reactJsxRuntime_production_min.Fragment = l$8;
  reactJsxRuntime_production_min.jsx = q$4;
  reactJsxRuntime_production_min.jsxs = q$4;
  (function(module) {
    {
      module.exports = reactJsxRuntime_production_min;
    }
  })(jsxRuntime);
  const Fragment = jsxRuntimeExports.Fragment;
  const jsx = jsxRuntimeExports.jsx;
  const jsxs = jsxRuntimeExports.jsxs;
  const e$3 = Symbol(), t$3 = Symbol(), r$6 = "a", n$5 = "w";
  let o$2 = (e2, t2) => new Proxy(e2, t2);
  const s$2 = Object.getPrototypeOf, c$7 = /* @__PURE__ */ new WeakMap(), l$7 = (e2) => e2 && (c$7.has(e2) ? c$7.get(e2) : s$2(e2) === Object.prototype || s$2(e2) === Array.prototype), f$5 = (e2) => "object" == typeof e2 && null !== e2, i$3 = (e2) => {
    if (Array.isArray(e2))
      return Array.from(e2);
    const t2 = Object.getOwnPropertyDescriptors(e2);
    return Object.values(t2).forEach((e3) => {
      e3.configurable = true;
    }), Object.create(s$2(e2), t2);
  }, u$6 = (e2) => e2[t$3] || e2, a$2 = (s2, c2, f2, p2) => {
    if (!l$7(s2))
      return s2;
    let g2 = p2 && p2.get(s2);
    if (!g2) {
      const e2 = u$6(s2);
      g2 = ((e3) => Object.values(Object.getOwnPropertyDescriptors(e3)).some((e4) => !e4.configurable && !e4.writable))(e2) ? [e2, i$3(e2)] : [e2], null == p2 || p2.set(s2, g2);
    }
    const [y2, h2] = g2;
    let w2 = f2 && f2.get(y2);
    return w2 && w2[1].f === !!h2 || (w2 = ((o2, s3) => {
      const c3 = { f: s3 };
      let l2 = false;
      const f3 = (e2, t2) => {
        if (!l2) {
          let s4 = c3[r$6].get(o2);
          if (s4 || (s4 = {}, c3[r$6].set(o2, s4)), e2 === n$5)
            s4[n$5] = true;
          else {
            let r2 = s4[e2];
            r2 || (r2 = /* @__PURE__ */ new Set(), s4[e2] = r2), r2.add(t2);
          }
        }
      }, i2 = { get: (e2, n2) => n2 === t$3 ? o2 : (f3("k", n2), a$2(Reflect.get(e2, n2), c3[r$6], c3.c)), has: (t2, n2) => n2 === e$3 ? (l2 = true, c3[r$6].delete(o2), true) : (f3("h", n2), Reflect.has(t2, n2)), getOwnPropertyDescriptor: (e2, t2) => (f3("o", t2), Reflect.getOwnPropertyDescriptor(e2, t2)), ownKeys: (e2) => (f3(n$5), Reflect.ownKeys(e2)) };
      return s3 && (i2.set = i2.deleteProperty = () => false), [i2, c3];
    })(y2, !!h2), w2[1].p = o$2(h2 || y2, w2[0]), f2 && f2.set(y2, w2)), w2[1][r$6] = c2, w2[1].c = f2, w2[1].p;
  }, p$6 = (e2, t2, r2, o2) => {
    if (Object.is(e2, t2))
      return false;
    if (!f$5(e2) || !f$5(t2))
      return true;
    const s2 = r2.get(u$6(e2));
    if (!s2)
      return true;
    if (o2) {
      const r3 = o2.get(e2);
      if (r3 && r3.n === t2)
        return r3.g;
      o2.set(e2, { n: t2, g: false });
    }
    let c2 = null;
    try {
      for (const r3 of s2.h || [])
        if (c2 = Reflect.has(e2, r3) !== Reflect.has(t2, r3), c2)
          return c2;
      if (true === s2[n$5]) {
        if (c2 = ((e3, t3) => {
          const r3 = Reflect.ownKeys(e3), n2 = Reflect.ownKeys(t3);
          return r3.length !== n2.length || r3.some((e4, t4) => e4 !== n2[t4]);
        })(e2, t2), c2)
          return c2;
      } else
        for (const r3 of s2.o || [])
          if (c2 = !!Reflect.getOwnPropertyDescriptor(e2, r3) != !!Reflect.getOwnPropertyDescriptor(t2, r3), c2)
            return c2;
      for (const n2 of s2.k || [])
        if (c2 = p$6(e2[n2], t2[n2], r2, o2), c2)
          return c2;
      return null === c2 && (c2 = true), c2;
    } finally {
      o2 && o2.set(e2, { n: t2, g: c2 });
    }
  }, y$7 = (e2) => l$7(e2) && e2[t$3] || null, h$8 = (e2, t2 = true) => {
    c$7.set(e2, t2);
  }, w$4 = (e2, t2, r2) => {
    const o2 = [], s2 = /* @__PURE__ */ new WeakSet(), c2 = (e3, l2) => {
      if (s2.has(e3))
        return;
      f$5(e3) && s2.add(e3);
      const i2 = f$5(e3) && t2.get(u$6(e3));
      if (i2) {
        var a2, p2;
        if (null == (a2 = i2.h) || a2.forEach((e4) => {
          const t3 = `:has(${String(e4)})`;
          o2.push(l2 ? [...l2, t3] : [t3]);
        }), true === i2[n$5]) {
          const e4 = ":ownKeys";
          o2.push(l2 ? [...l2, e4] : [e4]);
        } else {
          var g2;
          null == (g2 = i2.o) || g2.forEach((e4) => {
            const t3 = `:hasOwn(${String(e4)})`;
            o2.push(l2 ? [...l2, t3] : [t3]);
          });
        }
        null == (p2 = i2.k) || p2.forEach((t3) => {
          r2 && !("value" in (Object.getOwnPropertyDescriptor(e3, t3) || {})) || c2(e3[t3], l2 ? [...l2, t3] : [t3]);
        });
      } else
        l2 && o2.push(l2);
    };
    return c2(e2), o2;
  };
  const isObject$6 = (x2) => typeof x2 === "object" && x2 !== null;
  const proxyStateMap = /* @__PURE__ */ new WeakMap();
  const refSet = /* @__PURE__ */ new WeakSet();
  const buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x2) => isObject$6(x2) && !refSet.has(x2) && (Array.isArray(x2) || !(Symbol.iterator in x2)) && !(x2 instanceof WeakMap) && !(x2 instanceof WeakSet) && !(x2 instanceof Error) && !(x2 instanceof Number) && !(x2 instanceof Date) && !(x2 instanceof String) && !(x2 instanceof RegExp) && !(x2 instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
    switch (promise.status) {
      case "fulfilled":
        return promise.value;
      case "rejected":
        throw promise.reason;
      default:
        throw promise;
    }
  }, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
    const cache = snapCache.get(target);
    if ((cache == null ? void 0 : cache[0]) === version) {
      return cache[1];
    }
    const snap2 = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    h$8(snap2, true);
    snapCache.set(target, [version, snap2]);
    Reflect.ownKeys(target).forEach((key) => {
      if (Object.getOwnPropertyDescriptor(snap2, key)) {
        return;
      }
      const value = Reflect.get(target, key);
      const desc = {
        value,
        enumerable: true,
        // This is intentional to avoid copying with proxy-compare.
        // It's still non-writable, so it avoids assigning a value.
        configurable: true
      };
      if (refSet.has(value)) {
        h$8(value, false);
      } else if (value instanceof Promise) {
        delete desc.value;
        desc.get = () => handlePromise(value);
      } else if (proxyStateMap.has(value)) {
        const [target2, ensureVersion] = proxyStateMap.get(
          value
        );
        desc.value = createSnapshot(
          target2,
          ensureVersion(),
          handlePromise
        );
      }
      Object.defineProperty(snap2, key, desc);
    });
    return snap2;
  }, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction = (initialObject) => {
    if (!isObject$6(initialObject)) {
      throw new Error("object required");
    }
    const found = proxyCache.get(initialObject);
    if (found) {
      return found;
    }
    let version = versionHolder[0];
    const listeners = /* @__PURE__ */ new Set();
    const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
      if (version !== nextVersion) {
        version = nextVersion;
        listeners.forEach((listener) => listener(op, nextVersion));
      }
    };
    let checkVersion = versionHolder[1];
    const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
      if (checkVersion !== nextCheckVersion && !listeners.size) {
        checkVersion = nextCheckVersion;
        propProxyStates.forEach(([propProxyState]) => {
          const propVersion = propProxyState[1](nextCheckVersion);
          if (propVersion > version) {
            version = propVersion;
          }
        });
      }
      return version;
    };
    const createPropListener = (prop) => (op, nextVersion) => {
      const newOp = [...op];
      newOp[1] = [prop, ...newOp[1]];
      notifyUpdate(newOp, nextVersion);
    };
    const propProxyStates = /* @__PURE__ */ new Map();
    const addPropListener = (prop, propProxyState) => {
      if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && propProxyStates.has(prop)) {
        throw new Error("prop listener already exists");
      }
      if (listeners.size) {
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      } else {
        propProxyStates.set(prop, [propProxyState]);
      }
    };
    const removePropListener = (prop) => {
      var _a2;
      const entry = propProxyStates.get(prop);
      if (entry) {
        propProxyStates.delete(prop);
        (_a2 = entry[1]) == null ? void 0 : _a2.call(entry);
      }
    };
    const addListener = (listener) => {
      listeners.add(listener);
      if (listeners.size === 1) {
        propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
          if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && prevRemove) {
            throw new Error("remove already exists");
          }
          const remove = propProxyState[3](createPropListener(prop));
          propProxyStates.set(prop, [propProxyState, remove]);
        });
      }
      const removeListener = () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          propProxyStates.forEach(([propProxyState, remove], prop) => {
            if (remove) {
              remove();
              propProxyStates.set(prop, [propProxyState]);
            }
          });
        }
      };
      return removeListener;
    };
    const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
    const handler = {
      deleteProperty(target, prop) {
        const prevValue = Reflect.get(target, prop);
        removePropListener(prop);
        const deleted = Reflect.deleteProperty(target, prop);
        if (deleted) {
          notifyUpdate(["delete", [prop], prevValue]);
        }
        return deleted;
      },
      set(target, prop, value, receiver) {
        const hasPrevValue = Reflect.has(target, prop);
        const prevValue = Reflect.get(target, prop, receiver);
        if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
          return true;
        }
        removePropListener(prop);
        if (isObject$6(value)) {
          value = y$7(value) || value;
        }
        let nextValue = value;
        if (value instanceof Promise) {
          value.then((v2) => {
            value.status = "fulfilled";
            value.value = v2;
            notifyUpdate(["resolve", [prop], v2]);
          }).catch((e2) => {
            value.status = "rejected";
            value.reason = e2;
            notifyUpdate(["reject", [prop], e2]);
          });
        } else {
          if (!proxyStateMap.has(value) && canProxy(value)) {
            nextValue = proxyFunction(value);
          }
          const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
          if (childProxyState) {
            addPropListener(prop, childProxyState);
          }
        }
        Reflect.set(target, prop, nextValue, receiver);
        notifyUpdate(["set", [prop], value, prevValue]);
        return true;
      }
    };
    const proxyObject = newProxy(baseObject, handler);
    proxyCache.set(initialObject, proxyObject);
    const proxyState = [
      baseObject,
      ensureVersion,
      createSnapshot,
      addListener
    ];
    proxyStateMap.set(proxyObject, proxyState);
    Reflect.ownKeys(initialObject).forEach((key) => {
      const desc = Object.getOwnPropertyDescriptor(
        initialObject,
        key
      );
      if ("value" in desc) {
        proxyObject[key] = initialObject[key];
        delete desc.value;
        delete desc.writable;
      }
      Object.defineProperty(baseObject, key, desc);
    });
    return proxyObject;
  }) => [
    // public functions
    proxyFunction,
    // shared state
    proxyStateMap,
    refSet,
    // internal things
    objectIs,
    newProxy,
    canProxy,
    defaultHandlePromise,
    snapCache,
    createSnapshot,
    proxyCache,
    versionHolder
  ];
  const [defaultProxyFunction] = buildProxyFunction();
  function proxy(initialObject = {}) {
    return defaultProxyFunction(initialObject);
  }
  function subscribe(proxyObject, callback, notifyInSync) {
    const proxyState = proxyStateMap.get(proxyObject);
    if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && !proxyState) {
      console.warn("Please use proxy object");
    }
    let promise;
    const ops = [];
    const addListener = proxyState[3];
    let isListenerActive = false;
    const listener = (op) => {
      ops.push(op);
      if (notifyInSync) {
        callback(ops.splice(0));
        return;
      }
      if (!promise) {
        promise = Promise.resolve().then(() => {
          promise = void 0;
          if (isListenerActive) {
            callback(ops.splice(0));
          }
        });
      }
    };
    const removeListener = addListener(listener);
    isListenerActive = true;
    return () => {
      isListenerActive = false;
      removeListener();
    };
  }
  function snapshot(proxyObject, handlePromise) {
    const proxyState = proxyStateMap.get(proxyObject);
    if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && !proxyState) {
      console.warn("Please use proxy object");
    }
    const [target, ensureVersion, createSnapshot] = proxyState;
    return createSnapshot(target, ensureVersion(), handlePromise);
  }
  var shimExports = {};
  var shim = {
    get exports() {
      return shimExports;
    },
    set exports(v2) {
      shimExports = v2;
    }
  };
  var useSyncExternalStoreShim_production_min = {};
  /**
   * @license React
   * use-sync-external-store-shim.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var e$2 = React$1;
  function h$7(a2, b2) {
    return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
  }
  var k$5 = "function" === typeof Object.is ? Object.is : h$7, l$6 = e$2.useState, m$6 = e$2.useEffect, n$4 = e$2.useLayoutEffect, p$5 = e$2.useDebugValue;
  function q$3(a2, b2) {
    var d2 = b2(), f2 = l$6({ inst: { value: d2, getSnapshot: b2 } }), c2 = f2[0].inst, g2 = f2[1];
    n$4(function() {
      c2.value = d2;
      c2.getSnapshot = b2;
      r$5(c2) && g2({ inst: c2 });
    }, [a2, d2, b2]);
    m$6(function() {
      r$5(c2) && g2({ inst: c2 });
      return a2(function() {
        r$5(c2) && g2({ inst: c2 });
      });
    }, [a2]);
    p$5(d2);
    return d2;
  }
  function r$5(a2) {
    var b2 = a2.getSnapshot;
    a2 = a2.value;
    try {
      var d2 = b2();
      return !k$5(a2, d2);
    } catch (f2) {
      return true;
    }
  }
  function t$2(a2, b2) {
    return b2();
  }
  var u$5 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t$2 : q$3;
  useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e$2.useSyncExternalStore ? e$2.useSyncExternalStore : u$5;
  (function(module) {
    {
      module.exports = useSyncExternalStoreShim_production_min;
    }
  })(shim);
  const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(shimExports);
  const { use } = React$1;
  const { useSyncExternalStore } = useSyncExternalStoreExports;
  const useAffectedDebugValue = (state, affected) => {
    const pathList = React$1.useRef();
    React$1.useEffect(() => {
      pathList.current = w$4(state, affected, true);
    });
    React$1.useDebugValue(pathList.current);
  };
  const targetCache = /* @__PURE__ */ new WeakMap();
  function useSnapshot(proxyObject, options) {
    const notifyInSync = options == null ? void 0 : options.sync;
    const lastSnapshot = React$1.useRef();
    const lastAffected = React$1.useRef();
    let inRender = true;
    const currSnapshot = useSyncExternalStore(
      React$1.useCallback(
        (callback) => {
          const unsub = subscribe(proxyObject, callback, notifyInSync);
          callback();
          return unsub;
        },
        [proxyObject, notifyInSync]
      ),
      () => {
        const nextSnapshot = snapshot(proxyObject, use);
        try {
          if (!inRender && lastSnapshot.current && lastAffected.current && !p$6(
            lastSnapshot.current,
            nextSnapshot,
            lastAffected.current,
            /* @__PURE__ */ new WeakMap()
          )) {
            return lastSnapshot.current;
          }
        } catch (e2) {
        }
        return nextSnapshot;
      },
      () => snapshot(proxyObject, use)
    );
    inRender = false;
    const currAffected = /* @__PURE__ */ new WeakMap();
    React$1.useEffect(() => {
      lastSnapshot.current = currSnapshot;
      lastAffected.current = currAffected;
    });
    if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production") {
      useAffectedDebugValue(currSnapshot, currAffected);
    }
    const proxyCache = React$1.useMemo(() => /* @__PURE__ */ new WeakMap(), []);
    return a$2(
      currSnapshot,
      currAffected,
      proxyCache,
      targetCache
    );
  }
  const DEVTOOLS = Symbol();
  function devtools(proxyObject, options) {
    if (typeof options === "string") {
      console.warn(
        "string name option is deprecated, use { name }. https://github.com/pmndrs/valtio/pull/400"
      );
      options = { name: options };
    }
    const { enabled, name = "" } = options || {};
    let extension;
    try {
      extension = (enabled != null ? enabled : ({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production") && window.__REDUX_DEVTOOLS_EXTENSION__;
    } catch {
    }
    if (!extension) {
      if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && enabled) {
        console.warn("[Warning] Please install/enable Redux devtools extension");
      }
      return;
    }
    let isTimeTraveling = false;
    const devtools2 = extension.connect({ name });
    const unsub1 = subscribe(proxyObject, (ops) => {
      const action = ops.filter(([_2, path]) => path[0] !== DEVTOOLS).map(([op, path]) => `${op}:${path.map(String).join(".")}`).join(", ");
      if (!action) {
        return;
      }
      if (isTimeTraveling) {
        isTimeTraveling = false;
      } else {
        const snapWithoutDevtools = Object.assign({}, snapshot(proxyObject));
        delete snapWithoutDevtools[DEVTOOLS];
        devtools2.send(
          {
            type: action,
            updatedAt: (/* @__PURE__ */ new Date()).toLocaleString()
          },
          snapWithoutDevtools
        );
      }
    });
    const unsub2 = devtools2.subscribe((message) => {
      var _a2, _b2, _c2, _d2, _e2, _f;
      if (message.type === "ACTION" && message.payload) {
        try {
          Object.assign(proxyObject, JSON.parse(message.payload));
        } catch (e2) {
          console.error(
            "please dispatch a serializable value that JSON.parse() and proxy() support\n",
            e2
          );
        }
      }
      if (message.type === "DISPATCH" && message.state) {
        if (((_a2 = message.payload) == null ? void 0 : _a2.type) === "JUMP_TO_ACTION" || ((_b2 = message.payload) == null ? void 0 : _b2.type) === "JUMP_TO_STATE") {
          isTimeTraveling = true;
          const state = JSON.parse(message.state);
          Object.assign(proxyObject, state);
        }
        proxyObject[DEVTOOLS] = message;
      } else if (message.type === "DISPATCH" && ((_c2 = message.payload) == null ? void 0 : _c2.type) === "COMMIT") {
        devtools2.init(snapshot(proxyObject));
      } else if (message.type === "DISPATCH" && ((_d2 = message.payload) == null ? void 0 : _d2.type) === "IMPORT_STATE") {
        const actions = (_e2 = message.payload.nextLiftedState) == null ? void 0 : _e2.actionsById;
        const computedStates = ((_f = message.payload.nextLiftedState) == null ? void 0 : _f.computedStates) || [];
        isTimeTraveling = true;
        computedStates.forEach(({ state }, index2) => {
          const action = actions[index2] || "No action found";
          Object.assign(proxyObject, state);
          if (index2 === 0) {
            devtools2.init(snapshot(proxyObject));
          } else {
            devtools2.send(action, snapshot(proxyObject));
          }
        });
      }
    });
    devtools2.init(snapshot(proxyObject));
    return () => {
      unsub1();
      unsub2 == null ? void 0 : unsub2();
    };
  }
  function scrollDown() {
    setTimeout(() => {
      var _a2;
      logger.debug("scroll down");
      (_a2 = document.querySelector("#log-panel-log-container .simplebar-content-wrapper")) == null ? void 0 : _a2.scrollBy(0, 1e3);
    }, 10);
  }
  class Logger {
    constructor(maxSize = 100, shiftOffset = 10) {
      __publicField(this, "maxSize");
      __publicField(this, "shiftOffset");
      this.maxSize = maxSize;
      this.shiftOffset = shiftOffset;
    }
    get logs() {
      return store.logs;
    }
    addLog(log2) {
      store.logs.push(log2);
      if (store.userSettings.autoScrollDown) {
        scrollDown();
      }
    }
    log(option) {
      this.addLog({
        ...option,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        id: option.id ?? `${Math.random()}`
      });
    }
    info({ id, content, extra, action }) {
      return this.log({ type: "info", id, content, extra, action });
    }
    question({ id, content, extra, action }) {
      return this.log({ type: "question", id, content, extra, action });
    }
    error({ id, content, extra, action }) {
      return this.log({ type: "error", id, content, extra, action });
    }
    hr() {
      this.info({ content: "即将切换题型" });
    }
    debug(...content) {
      console.log(`[eocs-helper]`, ...content);
    }
  }
  const logger = new Logger();
  var freeGlobal$3 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$3;
  var freeGlobal$2 = _freeGlobal;
  var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
  var root$b = freeGlobal$2 || freeSelf$1 || Function("return this")();
  var _root = root$b;
  var root$a = _root;
  var Symbol$6 = root$a.Symbol;
  var _Symbol = Symbol$6;
  var Symbol$5 = _Symbol;
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
  var nativeObjectToString$3 = objectProto$5.toString;
  var symToStringTag$3 = Symbol$5 ? Symbol$5.toStringTag : void 0;
  function getRawTag$2(value) {
    var isOwn = hasOwnProperty$3.call(value, symToStringTag$3), tag = value[symToStringTag$3];
    try {
      value[symToStringTag$3] = void 0;
      var unmasked = true;
    } catch (e2) {
    }
    var result = nativeObjectToString$3.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$3] = tag;
      } else {
        delete value[symToStringTag$3];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$2;
  var objectProto$4 = Object.prototype;
  var nativeObjectToString$2 = objectProto$4.toString;
  function objectToString$2(value) {
    return nativeObjectToString$2.call(value);
  }
  var _objectToString = objectToString$2;
  var Symbol$4 = _Symbol, getRawTag$1 = _getRawTag, objectToString$1 = _objectToString;
  var nullTag$1 = "[object Null]", undefinedTag$1 = "[object Undefined]";
  var symToStringTag$2 = Symbol$4 ? Symbol$4.toStringTag : void 0;
  function baseGetTag$5(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag$1 : nullTag$1;
    }
    return symToStringTag$2 && symToStringTag$2 in Object(value) ? getRawTag$1(value) : objectToString$1(value);
  }
  var _baseGetTag = baseGetTag$5;
  function isObject$5(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$5;
  var baseGetTag$4 = _baseGetTag, isObject$4 = isObject_1;
  var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction$3(value) {
    if (!isObject$4(value)) {
      return false;
    }
    var tag = baseGetTag$4(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var isFunction_1 = isFunction$3;
  var root$9 = _root;
  var coreJsData$1 = root$9["__core-js_shared__"];
  var _coreJsData = coreJsData$1;
  var coreJsData = _coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked$1(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var _isMasked = isMasked$1;
  var funcProto$1 = Function.prototype;
  var funcToString$1 = funcProto$1.toString;
  function toSource$2(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e2) {
      }
      try {
        return func + "";
      } catch (e2) {
      }
    }
    return "";
  }
  var _toSource = toSource$2;
  var isFunction$2 = isFunction_1, isMasked = _isMasked, isObject$3 = isObject_1, toSource$1 = _toSource;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto = Function.prototype, objectProto$3 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative$1(value) {
    if (!isObject$3(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction$2(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource$1(value));
  }
  var _baseIsNative = baseIsNative$1;
  function getValue$2(object, key) {
    return object == null ? void 0 : object[key];
  }
  var _getValue = getValue$2;
  var baseIsNative = _baseIsNative, getValue$1 = _getValue;
  function getNative$6(object, key) {
    var value = getValue$1(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var _getNative = getNative$6;
  var getNative$5 = _getNative, root$8 = _root;
  var Map$2 = getNative$5(root$8, "Map");
  var _Map = Map$2;
  var getNative$4 = _getNative;
  getNative$4(Object, "create");
  var root$7 = _root;
  root$7.Uint8Array;
  var Symbol$3 = _Symbol;
  var symbolProto = Symbol$3 ? Symbol$3.prototype : void 0;
  symbolProto ? symbolProto.valueOf : void 0;
  function isObjectLike$4(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$4;
  var baseGetTag$3 = _baseGetTag, isObjectLike$3 = isObjectLike_1;
  var argsTag = "[object Arguments]";
  function baseIsArguments$1(value) {
    return isObjectLike$3(value) && baseGetTag$3(value) == argsTag;
  }
  var _baseIsArguments = baseIsArguments$1;
  var baseIsArguments = _baseIsArguments, isObjectLike$2 = isObjectLike_1;
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike$2(value) && hasOwnProperty$1.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isBufferExports = {};
  var isBuffer = {
    get exports() {
      return isBufferExports;
    },
    set exports(v2) {
      isBufferExports = v2;
    }
  };
  function stubFalse() {
    return false;
  }
  var stubFalse_1 = stubFalse;
  (function(module, exports) {
    var root2 = _root, stubFalse2 = stubFalse_1;
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root2.Buffer : void 0;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var isBuffer2 = nativeIsBuffer || stubFalse2;
    module.exports = isBuffer2;
  })(isBuffer, isBufferExports);
  var _nodeUtilExports = {};
  var _nodeUtil = {
    get exports() {
      return _nodeUtilExports;
    },
    set exports(v2) {
      _nodeUtilExports = v2;
    }
  };
  (function(module, exports) {
    var freeGlobal2 = _freeGlobal;
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal2.process;
    var nodeUtil2 = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e2) {
      }
    }();
    module.exports = nodeUtil2;
  })(_nodeUtil, _nodeUtilExports);
  var nodeUtil = _nodeUtilExports;
  nodeUtil && nodeUtil.isTypedArray;
  var getNative$3 = _getNative, root$6 = _root;
  var DataView$1 = getNative$3(root$6, "DataView");
  var _DataView = DataView$1;
  var getNative$2 = _getNative, root$5 = _root;
  var Promise$2 = getNative$2(root$5, "Promise");
  var _Promise = Promise$2;
  var getNative$1 = _getNative, root$4 = _root;
  var Set$2 = getNative$1(root$4, "Set");
  var _Set = Set$2;
  var getNative = _getNative, root$3 = _root;
  var WeakMap$2 = getNative(root$3, "WeakMap");
  var _WeakMap = WeakMap$2;
  var DataView = _DataView, Map$1 = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap$1 = _WeakMap, baseGetTag$2 = _baseGetTag, toSource = _toSource;
  var mapTag = "[object Map]", objectTag = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
  var dataViewTag = "[object DataView]";
  var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
  var getTag = baseGetTag$2;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map$1 && getTag(new Map$1()) != mapTag || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag) {
    getTag = function(value) {
      var result = baseGetTag$2(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function injectJs(source) {
    const parent = document;
    const scriptElement = parent.createElement("script");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.src = source;
    scriptElement.className = "injected-js";
    parent.documentElement.appendChild(scriptElement);
    return scriptElement;
  }
  injectJs((_a = chrome.runtime) == null ? void 0 : _a.getURL("index.js"));
  const EXTENSION_NAME = "eocs-helper";
  const sessions = /* @__PURE__ */ new Map();
  async function fromContentToInject(messageEvent) {
    const message = messageEvent.data;
    if (!message.extensionName || message.extensionName !== EXTENSION_NAME) {
      return;
    }
    if (!(message.sessionSource === "content" && message.sessionTarget === "inject")) {
      return;
    }
    const callback = sessions.get(message.sessionId);
    try {
      callback && await callback(message);
    } catch (error) {
      console.error(error);
    } finally {
      sessions.delete(message.sessionId);
    }
  }
  window.addEventListener("message", fromContentToInject, false);
  let hasInitializeSetValue = false;
  let GM_setValue$1;
  async function initializeSetValue() {
    {
      GM_setValue$1 = await Promise.resolve().then(() => index).then((module) => module.GM_setValue);
    }
  }
  async function setValue(key, value) {
    if (!hasInitializeSetValue) {
      await initializeSetValue();
      hasInitializeSetValue = true;
    }
    {
      await GM_setValue$1(key, JSON.stringify(value));
    }
  }
  let hasInitializeGetValue = false;
  let GM_getValue$1;
  async function initializeGetValue() {
    {
      GM_getValue$1 = await Promise.resolve().then(() => index).then((module) => module.GM_getValue);
    }
  }
  async function getValue(key, defaultValue) {
    if (!hasInitializeGetValue) {
      await initializeGetValue();
      hasInitializeGetValue = true;
    }
    let returnValue = void 0;
    {
      const temp = await GM_getValue$1(key, defaultValue);
      try {
        returnValue = JSON.parse(temp);
      } catch (error) {
        returnValue = temp;
      }
    }
    return returnValue;
  }
  class Store {
    constructor() {
      __publicField(this, "visibility", {
        log: true,
        config: false,
        floating: false
      });
      __publicField(this, "position", {
        floating: {
          x: 0,
          y: 0
        },
        log: {
          x: 0,
          y: 0
        }
      });
      __publicField(this, "tabIndex", 0);
      __publicField(this, "userSettings", {});
      __publicField(this, "sectionSettings", []);
      __publicField(this, "logs", []);
    }
    setVisibility(key, value) {
      this.visibility[key] = value;
    }
    setPosition(key, value) {
      this.position[key] = value;
    }
    setTabIndex(index2) {
      this.tabIndex = index2;
    }
    /** 因为subscribe了这个key，如果直接替换(=)，会导致subscribe失效 */
    setUserSettings(userSettings) {
      for (const [key, value] of Object.entries(userSettings || {})) {
        this.userSettings[key] = value;
      }
    }
    /**
     * 通过集成了所有插件设置的设置中心，设置USER_SETTINGS的默认值
     */
    setDefaultValues() {
      for (const section of this.sectionSettings) {
        for (const generic of section.settings) {
          if (this.userSettings[generic.id] === void 0) {
            this.userSettings[generic.id] = generic.default;
          }
        }
      }
    }
    /** 恢复默认值 */
    resetDefaultValues() {
      for (const section of this.sectionSettings) {
        for (const generic of section.settings) {
          this.userSettings[generic.id] = generic.default;
        }
      }
    }
    clearLogs(remain) {
      if (remain) {
        this.logs = this.logs.slice(0, remain);
      } else {
        this.logs = [];
      }
    }
    getRecordById(id) {
      return this.logs.find((record) => record.id === id);
    }
    // 不知道是不是因为是proxy，所以这个方法不起作用
    // updateRecord(record: Pick<IRecord, "id"> & Partial<IRecord>) {
    //     const index = this.logs.findIndex((log) => log.id === record.id);
    //     if (index !== -1) {
    //         logger.debug("in updateRecord", record)
    //         this.logs[index] = { ...this.logs[index], ...record };
    //     }
    // }
  }
  const store = proxy(new Store());
  const useStore = () => useSnapshot(store);
  devtools(store, {
    name: "store"
  });
  subscribe(store.userSettings, async () => {
    await setValue("userSettings", store.userSettings);
    logger.debug("userSettings已持久化");
  });
  const CONSTANT = {
    QUERY_INTERVAL: 2e3,
    DEBUG_MODE: false
  };
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const apiServer = "http://47.100.166.53/api";
  const homepage = "https://www.github.com/SSmJaE/";
  const projects = {
    welearn: {
      title: "随行课堂网课助手",
      name: "WELearn网课助手",
      version: "1.1.0",
      matches: [
        "*://course.sflep.com/*",
        "*://welearn.sflep.com/*",
        "*://wetest.sflep.com/*",
        "*://courseappserver.sflep.com/*",
        "*://centercourseware.sflep.com/*"
      ],
      namespace: "https://github.com/SSmJaE/WELearnHelper",
      description: "显示WE Learn随行课堂题目答案；支持班级测试；自动答题；刷时长；基于生成式AI(ChatGPT)的答案生成",
      connect: [
        "localhost",
        "47.100.166.53"
      ]
    },
    tsinghua: {
      title: "清华社网课助手",
      name: "TsinghuaELTHelper",
      version: "0.1.0",
      matches: [],
      namespace: "https://github.com/SSmJaE/TsinghuaELTHelper",
      description: "显示清华社网课题目答案",
      connect: [
        "localhost",
        "47.100.166.53"
      ]
    }
  };
  const metadata = {
    apiServer,
    homepage,
    projects
  };
  const token$1 = "%[a-f0-9]{2}";
  const singleMatcher = new RegExp("(" + token$1 + ")|([^%]+?)", "gi");
  const multiMatcher = new RegExp("(" + token$1 + ")+", "gi");
  function decodeComponents(components, split) {
    try {
      return [decodeURIComponent(components.join(""))];
    } catch {
    }
    if (components.length === 1) {
      return components;
    }
    split = split || 1;
    const left = components.slice(0, split);
    const right = components.slice(split);
    return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }
  function decode$1(input) {
    try {
      return decodeURIComponent(input);
    } catch {
      let tokens = input.match(singleMatcher) || [];
      for (let i2 = 1; i2 < tokens.length; i2++) {
        input = decodeComponents(tokens, i2).join("");
        tokens = input.match(singleMatcher) || [];
      }
      return input;
    }
  }
  function customDecodeURIComponent(input) {
    const replaceMap = {
      "%FE%FF": "��",
      "%FF%FE": "��"
    };
    let match2 = multiMatcher.exec(input);
    while (match2) {
      try {
        replaceMap[match2[0]] = decodeURIComponent(match2[0]);
      } catch {
        const result = decode$1(match2[0]);
        if (result !== match2[0]) {
          replaceMap[match2[0]] = result;
        }
      }
      match2 = multiMatcher.exec(input);
    }
    replaceMap["%C2"] = "�";
    const entries = Object.keys(replaceMap);
    for (const key of entries) {
      input = input.replace(new RegExp(key, "g"), replaceMap[key]);
    }
    return input;
  }
  function decodeUriComponent(encodedURI) {
    if (typeof encodedURI !== "string") {
      throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
    }
    try {
      return decodeURIComponent(encodedURI);
    } catch {
      return customDecodeURIComponent(encodedURI);
    }
  }
  function splitOnFirst(string, separator) {
    if (!(typeof string === "string" && typeof separator === "string")) {
      throw new TypeError("Expected the arguments to be of type `string`");
    }
    if (string === "" || separator === "") {
      return [];
    }
    const separatorIndex = string.indexOf(separator);
    if (separatorIndex === -1) {
      return [];
    }
    return [
      string.slice(0, separatorIndex),
      string.slice(separatorIndex + separator.length)
    ];
  }
  function includeKeys(object, predicate) {
    const result = {};
    if (Array.isArray(predicate)) {
      for (const key of predicate) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor == null ? void 0 : descriptor.enumerable) {
          Object.defineProperty(result, key, descriptor);
        }
      }
    } else {
      for (const key of Reflect.ownKeys(object)) {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);
        if (descriptor.enumerable) {
          const value = object[key];
          if (predicate(key, value, object)) {
            Object.defineProperty(result, key, descriptor);
          }
        }
      }
    }
    return result;
  }
  const isNullOrUndefined = (value) => value === null || value === void 0;
  const strictUriEncode = (string) => encodeURIComponent(string).replace(/[!'()*]/g, (x2) => `%${x2.charCodeAt(0).toString(16).toUpperCase()}`);
  const encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
  function encoderForArrayFormat(options) {
    switch (options.arrayFormat) {
      case "index": {
        return (key) => (result, value) => {
          const index2 = result.length;
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              [encode(key, options), "[", index2, "]"].join("")
            ];
          }
          return [
            ...result,
            [encode(key, options), "[", encode(index2, options), "]=", encode(value, options)].join("")
          ];
        };
      }
      case "bracket": {
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              [encode(key, options), "[]"].join("")
            ];
          }
          return [
            ...result,
            [encode(key, options), "[]=", encode(value, options)].join("")
          ];
        };
      }
      case "colon-list-separator": {
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              [encode(key, options), ":list="].join("")
            ];
          }
          return [
            ...result,
            [encode(key, options), ":list=", encode(value, options)].join("")
          ];
        };
      }
      case "comma":
      case "separator":
      case "bracket-separator": {
        const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          value = value === null ? "" : value;
          if (result.length === 0) {
            return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
          }
          return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
        };
      }
      default: {
        return (key) => (result, value) => {
          if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
            return result;
          }
          if (value === null) {
            return [
              ...result,
              encode(key, options)
            ];
          }
          return [
            ...result,
            [encode(key, options), "=", encode(value, options)].join("")
          ];
        };
      }
    }
  }
  function parserForArrayFormat(options) {
    let result;
    switch (options.arrayFormat) {
      case "index": {
        return (key, value, accumulator) => {
          result = /\[(\d*)]$/.exec(key);
          key = key.replace(/\[\d*]$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === void 0) {
            accumulator[key] = {};
          }
          accumulator[key][result[1]] = value;
        };
      }
      case "bracket": {
        return (key, value, accumulator) => {
          result = /(\[])$/.exec(key);
          key = key.replace(/\[]$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === void 0) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [...accumulator[key], value];
        };
      }
      case "colon-list-separator": {
        return (key, value, accumulator) => {
          result = /(:list)$/.exec(key);
          key = key.replace(/:list$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === void 0) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [...accumulator[key], value];
        };
      }
      case "comma":
      case "separator": {
        return (key, value, accumulator) => {
          const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
          const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
          value = isEncodedArray ? decode(value, options) : value;
          const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
          accumulator[key] = newValue;
        };
      }
      case "bracket-separator": {
        return (key, value, accumulator) => {
          const isArray = /(\[])$/.test(key);
          key = key.replace(/\[]$/, "");
          if (!isArray) {
            accumulator[key] = value ? decode(value, options) : value;
            return;
          }
          const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
          if (accumulator[key] === void 0) {
            accumulator[key] = arrayValue;
            return;
          }
          accumulator[key] = [...accumulator[key], ...arrayValue];
        };
      }
      default: {
        return (key, value, accumulator) => {
          if (accumulator[key] === void 0) {
            accumulator[key] = value;
            return;
          }
          accumulator[key] = [...[accumulator[key]].flat(), value];
        };
      }
    }
  }
  function validateArrayFormatSeparator(value) {
    if (typeof value !== "string" || value.length !== 1) {
      throw new TypeError("arrayFormatSeparator must be single character string");
    }
  }
  function encode(value, options) {
    if (options.encode) {
      return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
    }
    return value;
  }
  function decode(value, options) {
    if (options.decode) {
      return decodeUriComponent(value);
    }
    return value;
  }
  function keysSorter(input) {
    if (Array.isArray(input)) {
      return input.sort();
    }
    if (typeof input === "object") {
      return keysSorter(Object.keys(input)).sort((a2, b2) => Number(a2) - Number(b2)).map((key) => input[key]);
    }
    return input;
  }
  function removeHash(input) {
    const hashStart = input.indexOf("#");
    if (hashStart !== -1) {
      input = input.slice(0, hashStart);
    }
    return input;
  }
  function getHash(url) {
    let hash2 = "";
    const hashStart = url.indexOf("#");
    if (hashStart !== -1) {
      hash2 = url.slice(hashStart);
    }
    return hash2;
  }
  function parseValue(value, options) {
    if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
      value = Number(value);
    } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
      value = value.toLowerCase() === "true";
    }
    return value;
  }
  function extract(input) {
    input = removeHash(input);
    const queryStart = input.indexOf("?");
    if (queryStart === -1) {
      return "";
    }
    return input.slice(queryStart + 1);
  }
  function parse$1(query, options) {
    options = {
      decode: true,
      sort: true,
      arrayFormat: "none",
      arrayFormatSeparator: ",",
      parseNumbers: false,
      parseBooleans: false,
      ...options
    };
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    const formatter = parserForArrayFormat(options);
    const returnValue = /* @__PURE__ */ Object.create(null);
    if (typeof query !== "string") {
      return returnValue;
    }
    query = query.trim().replace(/^[?#&]/, "");
    if (!query) {
      return returnValue;
    }
    for (const parameter of query.split("&")) {
      if (parameter === "") {
        continue;
      }
      const parameter_ = options.decode ? parameter.replace(/\+/g, " ") : parameter;
      let [key, value] = splitOnFirst(parameter_, "=");
      if (key === void 0) {
        key = parameter_;
      }
      value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
      formatter(decode(key, options), value, returnValue);
    }
    for (const [key, value] of Object.entries(returnValue)) {
      if (typeof value === "object" && value !== null) {
        for (const [key2, value2] of Object.entries(value)) {
          value[key2] = parseValue(value2, options);
        }
      } else {
        returnValue[key] = parseValue(value, options);
      }
    }
    if (options.sort === false) {
      return returnValue;
    }
    return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
      const value = returnValue[key];
      if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
        result[key] = keysSorter(value);
      } else {
        result[key] = value;
      }
      return result;
    }, /* @__PURE__ */ Object.create(null));
  }
  function stringify$1(object, options) {
    if (!object) {
      return "";
    }
    options = {
      encode: true,
      strict: true,
      arrayFormat: "none",
      arrayFormatSeparator: ",",
      ...options
    };
    validateArrayFormatSeparator(options.arrayFormatSeparator);
    const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
    const formatter = encoderForArrayFormat(options);
    const objectCopy = {};
    for (const [key, value] of Object.entries(object)) {
      if (!shouldFilter(key)) {
        objectCopy[key] = value;
      }
    }
    const keys = Object.keys(objectCopy);
    if (options.sort !== false) {
      keys.sort(options.sort);
    }
    return keys.map((key) => {
      const value = object[key];
      if (value === void 0) {
        return "";
      }
      if (value === null) {
        return encode(key, options);
      }
      if (Array.isArray(value)) {
        if (value.length === 0 && options.arrayFormat === "bracket-separator") {
          return encode(key, options) + "[]";
        }
        return value.reduce(formatter(key), []).join("&");
      }
      return encode(key, options) + "=" + encode(value, options);
    }).filter((x2) => x2.length > 0).join("&");
  }
  function parseUrl(url, options) {
    var _a2;
    options = {
      decode: true,
      ...options
    };
    let [url_, hash2] = splitOnFirst(url, "#");
    if (url_ === void 0) {
      url_ = url;
    }
    return {
      url: ((_a2 = url_ == null ? void 0 : url_.split("?")) == null ? void 0 : _a2[0]) ?? "",
      query: parse$1(extract(url), options),
      ...options && options.parseFragmentIdentifier && hash2 ? { fragmentIdentifier: decode(hash2, options) } : {}
    };
  }
  function stringifyUrl(object, options) {
    options = {
      encode: true,
      strict: true,
      [encodeFragmentIdentifier]: true,
      ...options
    };
    const url = removeHash(object.url).split("?")[0] || "";
    const queryFromUrl = extract(object.url);
    const query = {
      ...parse$1(queryFromUrl, { sort: false }),
      ...object.query
    };
    let queryString2 = stringify$1(query, options);
    if (queryString2) {
      queryString2 = `?${queryString2}`;
    }
    let hash2 = getHash(object.url);
    if (object.fragmentIdentifier) {
      const urlObjectForFragmentEncode = new URL(url);
      urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
      hash2 = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
    }
    return `${url}${queryString2}${hash2}`;
  }
  function pick(input, filter, options) {
    options = {
      parseFragmentIdentifier: true,
      [encodeFragmentIdentifier]: false,
      ...options
    };
    const { url, query, fragmentIdentifier } = parseUrl(input, options);
    return stringifyUrl({
      url,
      query: includeKeys(query, filter),
      fragmentIdentifier
    }, options);
  }
  function exclude(input, filter, options) {
    const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
    return pick(input, exclusionFilter, options);
  }
  const queryString = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    exclude,
    extract,
    parse: parse$1,
    parseUrl,
    pick,
    stringify: stringify$1,
    stringifyUrl
  }, Symbol.toStringTag, { value: "Module" }));
  function getFullUrl(url, query = {}) {
    for (const [, value] of Object.entries(query)) {
      if (typeof value === "object")
        throw new Error("query params不应为嵌套对象，拍平或者手动序列化子对象");
    }
    return queryString.stringifyUrl({
      url: url.startsWith("/") ? `${metadata.apiServer}/${"welearn"}${url}` : url,
      query
    });
  }
  let hasInitializeXhr = false;
  let GM_xmlhttpRequest$1;
  async function initializeXhr() {
    {
      GM_xmlhttpRequest$1 = await Promise.resolve().then(() => index).then((module) => module.GM_xmlhttpRequest);
    }
  }
  function requestForUserscript(url, { method, headers = {}, query, body } = {
    method: "GET",
    headers: {},
    body: void 0,
    query: void 0
  }) {
    return new Promise(async (resolve, reject) => {
      if (!hasInitializeXhr) {
        await initializeXhr();
        hasInitializeXhr = true;
      }
      GM_xmlhttpRequest$1({
        url: getFullUrl(url, query),
        method,
        // GM_xmlhttpRequest需要手动设置Content-Type，不然默认是text/plain，后端无法识别
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          ...headers
        },
        data: typeof body === "object" ? JSON.stringify(body) : body,
        timeout: 5e3,
        responseType: "json",
        // @ts-ignore
        onload(response) {
          const { status: statusCode } = response;
          if (statusCode >= 200 && statusCode <= 300) {
            resolve({
              text: () => new Promise((resolve2) => resolve2(response.responseText)),
              json: () => new Promise((resolve2) => resolve2(response.response))
            });
          } else {
            reject(response);
          }
        },
        // @ts-ignore
        onabort: (response) => reject(response),
        // @ts-ignore
        onerror: (response) => reject(response),
        // @ts-ignore
        ontimeout: (response) => reject(response)
      });
    });
  }
  const implement = requestForUserscript;
  class Request extends Function {
    constructor() {
      super("...args", "return this.__self__.__call__(...args)");
      __publicField(this, "__self__");
      const self2 = this.bind(this);
      this.__self__ = self2;
      return self2;
    }
    __call__(url, init = { method: "GET" }) {
      return implement(url, init);
    }
    post(url, init = {}) {
      return implement(url, { ...init, method: "POST" });
    }
    delete(url, init = {}) {
      return implement(url, { ...init, method: "DELETE" });
    }
    put(url, init = {}) {
      return implement(url, { ...init, method: "PUT" });
    }
    patch(url, init = {}) {
      return implement(url, { ...init, method: "PATCH" });
    }
    get(url, init = {}) {
      return implement(url, { ...init, method: "GET" });
    }
    head(url, init = {}) {
      return implement(url, { ...init, method: "HEAD" });
    }
    options(url, init = {}) {
      return implement(url, { ...init, method: "OPTIONS" });
    }
  }
  const request = new Request();
  function backendErrorToString(errorDetail) {
    return errorDetail ? `异常id : ${errorDetail.id}
具体信息 : ${errorDetail.message}` : void 0;
  }
  function requestErrorHandler(message = "请求异常，稍后再试") {
    return function(target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        const result = originalMethod.apply(this, args);
        result.catch((error) => {
          logger.error(
            {
              content: {
                message
              },
              extra: error.message
            }
          );
        });
        return result;
      };
      return descriptor;
    };
  }
  function perSession(storageKey) {
    return function(target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        const hasChecked = sessionStorage.getItem(storageKey);
        if (!hasChecked) {
          const result = originalMethod.apply(this, args);
          logger.debug(`${storageKey}未执行过，开始执行`);
          sessionStorage.setItem(storageKey, (/* @__PURE__ */ new Date()).toISOString());
          return result;
        } else {
          logger.debug(`${storageKey}已执行过，放弃执行`);
          return Promise.resolve();
        }
      };
      return descriptor;
    };
  }
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
      if (decorator = decorators[i2])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp2(target, key, result);
    return result;
  };
  class WELearnAPI {
    static async checkVersion() {
      const response = await request.post("/version/", {
        body: {
          version: metadata.projects.welearn.version
        }
      });
      const returnJson = await response.json();
      if (returnJson.status === false) {
        throw new Error(backendErrorToString(returnJson.error));
      } else {
        for (const message of returnJson.data) {
          logger.info({ content: message });
        }
        await setValue("VERSION_INFO", returnJson.data);
      }
    }
    static async queryByTaskId({
      typical,
      is_school_test,
      tt_id,
      sheet_id,
      stt_id
    }) {
      const response = await request.post("/query/", {
        body: {
          query_type: 0,
          typical,
          is_school_test,
          tt_id,
          sheet_id,
          stt_id
        }
      });
      return await response.json();
    }
    static async queryByQuestionId(questionId) {
      const response = await request.post("/query/", {
        body: {
          query_type: 1,
          question_id: questionId
        }
      });
      const returnJson = await response.json();
      if (returnJson.status === false) {
        throw new Error(backendErrorToString(returnJson.error));
      } else {
        return returnJson.data;
      }
    }
    static async queryByDomString(domString) {
      const response = await request.post("/query/", {
        body: {
          query_type: 2,
          dom_string: domString
        }
      });
      const returnJson = await response.json();
      if (returnJson.status === false) {
        throw new Error(backendErrorToString(returnJson.error));
      } else {
        return returnJson.data;
      }
    }
    static async collectAll({
      task_id,
      dom_string,
      part_index,
      typical,
      is_school_test,
      tt_id,
      sheet_id,
      stt_id
    }) {
      const response = await request.post("/collect/", {
        body: {
          task_id,
          dom_string,
          part_index,
          typical,
          is_school_test,
          tt_id,
          sheet_id,
          stt_id
        }
      });
      const returnJson = await response.json();
      if (returnJson.status === false) {
        throw new Error(backendErrorToString(returnJson.error));
      } else {
        logger.info({
          content: "当前页面答案收录成功，可以切换至下一页面，手动点击查询按钮上传，或者上传其它练习的答案"
        });
      }
    }
    static async upload(byUser = false) {
      const response = await request.post("/upload/", {
        body: {
          url: location.href,
          cookie: document.cookie
        }
      });
      const returnJson = await response.json();
      if (byUser) {
        if (returnJson.status) {
          logger.info({ content: "成功上传练习" });
        } else {
          logger.error({
            content: {
              message: "练习上传失败"
            }
          });
          logger.debug(returnJson.error);
        }
      }
    }
    static async getCourseCatalog() {
      const response = await request.post("/catalog/");
      const returnJson = await response.json();
      if (returnJson.status === false) {
        throw new Error(backendErrorToString(returnJson.error));
      } else {
        logger.info({ content: "成功获取了最新的课程目录" });
        return returnJson.data;
      }
    }
  }
  __decorateClass([
    requestErrorHandler("脚本版本查询异常"),
    perSession("LAST_CHECK_DATE")
  ], WELearnAPI, "checkVersion", 1);
  __decorateClass([
    requestErrorHandler("答案查询失败")
  ], WELearnAPI, "queryByTaskId", 1);
  __decorateClass([
    requestErrorHandler("答案查询失败")
  ], WELearnAPI, "queryByQuestionId", 1);
  __decorateClass([
    requestErrorHandler("答案查询失败")
  ], WELearnAPI, "queryByDomString", 1);
  __decorateClass([
    requestErrorHandler("答案收录失败")
  ], WELearnAPI, "collectAll", 1);
  __decorateClass([
    perSession("HAS_UPLOAD")
  ], WELearnAPI, "upload", 1);
  __decorateClass([
    requestErrorHandler("课程目录获取失败"),
    perSession("HAS_GET_COURSE_CATALOG")
  ], WELearnAPI, "getCourseCatalog", 1);
  function isFinished() {
    return !document.querySelector("#spSubmit");
  }
  function getTaskId() {
    let isSchoolTest = false;
    let taskId = null;
    try {
      if (location.href.includes("schooltest")) {
        isSchoolTest = true;
        taskId = /schooltestid=(\d*)/.exec(location.href)[1];
      } else {
        taskId = /testId=(\d*)/.exec(location.href)[1];
      }
    } catch {
      logger.debug("testId获取失败");
    }
    return {
      isSchoolTest,
      taskId
    };
  }
  function getPartIndex() {
    for (const [index2, element] of document.querySelectorAll("#ulParts > li").entries()) {
      if (element.classList.contains("active")) {
        return index2 + 1;
      }
    }
    {
      throw new Error("无法获取PartIndex");
    }
  }
  function getQuestionIndex(questionItemDiv) {
    const indexOfQuestions = [];
    for (const element of questionItemDiv.querySelectorAll('span[id^="question_"]')) {
      const index2 = /question_(\d*)/.exec(element.id)[1];
      indexOfQuestions.push(index2);
    }
    return indexOfQuestions;
  }
  async function querySingleQuestion(questionItemDiv) {
    const domString = questionItemDiv.outerHTML;
    const questionWithAnswers = await WELearnAPI.queryByDomString(domString);
    for (const [index2, questionWithAnswer] of questionWithAnswers.entries()) {
      let questionIndex = "_";
      let questionIndexString = "_";
      try {
        questionIndex = getQuestionIndex(questionItemDiv)[index2] || "_";
        questionIndexString = String(questionIndex).padStart(2, "0");
      } catch (error) {
      }
      const isListening = !!questionItemDiv.querySelector('a[href^="javascript:PlaySound"]');
      const replayButton = {
        children: "播放音频",
        onClick: () => {
          const mainAudio = questionItemDiv.querySelector('a[id*="btnPlay"]');
          const questionId = /btnPlay_(.*)/.exec(mainAudio.id)[1];
          let mainAudioFile = null;
          const match2 = /"(.*?.mp3)"/.exec(mainAudio.getAttribute("href"));
          if (match2) {
            mainAudioFile = match2[1];
          } else {
            mainAudioFile = mainAudio.getAttribute("data-soundsrc");
          }
          logger.debug(mainAudioFile, questionId);
          PlaySound(mainAudioFile, questionId);
        }
      };
      logger.question({
        content: {
          order: `${questionIndexString}`,
          info: {
            content: questionWithAnswer.answer_text ? "标答" : questionWithAnswer.answer_text_gpt ? "GPT" : "无答案"
          },
          answerText: questionWithAnswer.answer_text || questionWithAnswer.answer_text_gpt || "尚未收录答案",
          raw: {
            element: questionItemDiv
          },
          solve: {
            couldSolve: false,
            hasSolved: false,
            solveThis: (answerText) => {
            }
          }
        },
        action: isListening ? [replayButton] : void 0
      });
      await sleep(CONSTANT.QUERY_INTERVAL);
    }
  }
  async function getAnswers() {
    store.clearLogs(1);
    const { isSchoolTest, taskId } = getTaskId();
    if (isFinished()) {
      try {
        const domString = document.querySelector(".tab-content").outerHTML;
        const questionItemDivNodes = document.querySelectorAll(".itemDiv");
        const html_string = document.head.innerHTML;
        const tt_id = /ttid\s*:\s*(-?\d*)/.exec(html_string);
        const sheet_id = /sheetid\s*:\s*(-?\d*)/.exec(html_string);
        const stt_id = /sttid\s*:\s*(-?\d*)/.exec(html_string);
        await WELearnAPI.collectAll({
          dom_string: domString,
          typical: !!questionItemDivNodes.length,
          is_school_test: isSchoolTest,
          part_index: getPartIndex() || null,
          task_id: taskId,
          tt_id: tt_id ? tt_id[1] : null,
          sheet_id: sheet_id ? sheet_id[1] : null,
          stt_id: stt_id ? stt_id[1] : null
        });
      } catch (e2) {
        logger.debug(e2);
      }
    } else {
      const questionItemDivNodes = document.querySelectorAll(".itemDiv");
      for (const [index2, questionItemDiv] of questionItemDivNodes.entries()) {
        try {
          await querySingleQuestion(questionItemDiv);
        } catch (error) {
          logger.debug(error);
        }
      }
    }
  }
  function hackPlaySound() {
    (unsafeWindow || window).PlaySound = (src2, id) => {
      if (soundPlayer) {
        soundPlayer.stop();
        try {
          jwplayer("soundplayer").remove();
        } catch (e2) {
        }
      }
      currentSoundId = id;
      const soundfile = testEnv.resPath + "sound/" + src2;
      soundPlayer = jwplayer("soundplayer").setup({
        flashplayer: "script/jwplayer.flash.swf?c=" + Math.random(),
        file: soundfile,
        height: 0,
        width: 0,
        primary: "html5"
      });
      soundPlayer.play();
    };
  }
  let isPageReady = false;
  let elapsedTime = 0;
  const MAX_WAIT_TIME = 1e4;
  function checkPageReady() {
    const element = document.querySelector("#spTimer");
    if (element) {
      isPageReady = true;
    }
  }
  async function watcher() {
    while (elapsedTime < MAX_WAIT_TIME) {
      if (isPageReady) {
        break;
      }
      await sleep(200);
      elapsedTime += 200;
      checkPageReady();
    }
    logger.debug(`页面加载完成，耗时${elapsedTime}ms`);
    notify$1();
  }
  function notify$1() {
    logger.debug("页面加载完成，开始检测完成情况");
    const finished = isFinished();
    const recordId = `${Math.random()}`;
    logger.info({
      id: recordId,
      content: (finished ? "检测到当前位于解析页面，点击本条消息右侧的上传按钮，以收录答案" : "检测到当前位于测试页面，点击本条消息右侧的查询按钮，以开始查询") + `<br />❗❗❗即使有多个part，也只需要点击一次，会自动按顺序${finished ? "上传" : "查询"}所有part的题目`,
      extra: void 0,
      action: [
        {
          children: `${finished ? "上传" : "查询"}答案`,
          disabled: 5e3,
          onClick() {
            getAnswers();
          }
        }
      ]
    });
    if (store.userSettings.infiniteListening) {
      hackPlaySound();
      logger.debug("已开启无限听力");
    }
  }
  if (location.href.includes(".sflep.com/test/") || location.href.includes("wetest.sflep.com/Test")) {
    (async () => {
      await watcher();
    })();
  }
  if (location.href.includes(".sflep.com/student/course_info.aspx?")) {
    WELearnAPI.upload();
  }
  const MANIFEST = [
    "https://centercourseware.sflep.com/new century college english secedition integration 2/unit_01/course/texta.html#c09175d4-f281-488f-83fe-87c6bcf2a2b6?nocache=0.6378400703106109",
    "new century college english secedition integration 1",
    //新世纪大学英语系列教材（第二版）综合教程第一册
    "new century college english secedition integration 2",
    //新世纪大学英语系列教材（第二版）综合教程第二册
    "new century college english secedition integration 3",
    //新世纪大学英语系列教材（第二版）综合教程第三册
    "new century college english secedition integration 4",
    //新世纪大学英语系列教材（第二版）综合教程第四册
    "https://centercourseware.sflep.com/an integrated skills course (2nd edition) 2 for vocational college english/unit_02/course/listening.html#f248a182-7d3b-4112-86e8-8fca2706c690?nocache=0.3470470678074564",
    "an integrated skills course (2nd edition) 1 for vocational college english",
    //新标准高职实用综合教程（第2版）第一册
    "an integrated skills course (2nd edition) 2 for vocational college english",
    //新标准高职实用综合教程（第2版）第二册
    "an integrated skills course (2nd edition) 3 for vocational college english",
    //新标准高职实用综合教程（第2版）第三册
    "an integrated skills course (2nd edition) 4 for vocational college english",
    //新标准高职实用综合教程（第2版）第四册
    "https://centercourseware.sflep.com/an integrated skills course 2/unit_07/course/comprehension.html#e2f3d085-ca82-4d79-b31a-1bfe83529d88?nocache=0.5703432807157427",
    "an integrated skills course 1",
    //新标准高职公共英语系列教材：实用综合教程（精编版）上
    "an integrated skills course 2"
    //新标准高职公共英语系列教材：实用综合教程（精编版）下
  ];
  const DATA_SOLUTION = [
    "https://centercourseware.sflep.com/new progressive college english integrated course 3/unit_01/main10.html?3-1-6&nocache=0.8570993802491391",
    "new progressive college english integrated course 1",
    //全新版大学进阶英语：综合1
    "new progressive college english integrated course 2",
    //全新版大学进阶英语：综合2
    "new progressive college english integrated course 3",
    //全新版大学进阶英语：综合3
    "new progressive college english integrated course 4",
    //全新版大学进阶英语：综合4
    "//centercourseware.sflep.com/new progressive college english integrated course 1-sz/unit_01/main6.html?1-1-6&nocache=0.08870107701951402",
    "new progressive college english integrated course 1-sz",
    "new progressive college english integrated course 2-sz",
    "new progressive college english integrated course 3-sz",
    "new progressive college english integrated course 4-sz",
    "https://centercourseware.sflep.com/new target college english integrated course 2/unit_05/main.html?2-5-10&nocache=0.7739324146362139",
    "new target college english integrated course 1",
    //新目标大学英语《综合教程》 第一册；这个是所有页面混杂在一个大页面里的那个
    "new target college english integrated course 2",
    //新目标大学英语《综合教程》 第二册
    "new target college english integrated course 3",
    //新目标大学英语《综合教程》 第三册
    "new target college english integrated course 4",
    //新目标大学英语《综合教程》 第四册
    "New Target College English_V2_Integrated Course 1",
    "New Target College English_V2_Integrated Course 2",
    "New Target College English_V2_Integrated Course 3",
    "New Target College English_V2_Integrated Course 4",
    "New Advanced College English Grammar Course",
    "New Advanced College English-Integrated Course 1",
    // todo 每切换一次，都会重新请求catalog，但还是同一个session
    "New Advanced College English-Integrated Course 2",
    // 所以如果只是后端添加catalog，只有第一个页面有效
    "New Advanced College English-Integrated Course 3",
    "New Advanced College English-Integrated Course 4"
  ];
  const ET = [
    "https://centercourseware.sflep.com/inspire%202/data/1/2-1-2.html",
    "inspire 1",
    //全新版大学进阶英语：视听说教程1
    "inspire 2",
    //全新版大学进阶英语：视听说教程2
    "inspire 3",
    //全新版大学进阶英语：视听说教程3
    "inspire 4",
    //全新版大学进阶英语：视听说教程4
    "https://centercourseware.sflep.com/New College English Viewing Listening Speaking 3/index.html#/1/1-1-1?nocache=0.2182374709016317",
    "New College English Viewing Listening Speaking 1",
    //全新版大学英语《视听说教程》1
    "New College English Viewing Listening Speaking 2",
    //全新版大学英语《视听说教程》2
    "New College English Viewing Listening Speaking 3",
    //全新版大学英语《视听说教程》3
    "New College English Viewing Listening Speaking 4",
    //全新版大学英语《视听说教程》4
    "https://centercourseware.sflep.com/New Target College English Video Course 1/index.html#/u1/TO/1-1?nocache=0.2502474772719703",
    //新目标大学英语视听说教程1
    "New Target College English Video Course 1",
    //新目标大学英语视听说教程1
    "New Target College English Video Course 2",
    //新目标大学英语视听说教程2
    "New Target College English Video Course 3",
    //新目标大学英语视听说教程3
    "New Target College English Video Course 4",
    //新目标大学英语视听说教程4
    "New Target College English_V2_Video Course 1",
    //新目标大学英语视听说教程1
    "New Target College English_V2_Video Course 2",
    //新目标大学英语视听说教程1
    "New Target College English_V2_Video Course 3",
    //新目标大学英语视听说教程1
    "New Target College English_V2_Video Course 4",
    //新目标大学英语视听说教程1
    "https://centercourseware.sflep.com/new century college english video thirdedition 1/index.html#/2/1-1-1?nocache=0.3053014048019431",
    "new century college english video thirdedition 1",
    //新世纪大学英语系列教材（第二版）视听说教程（3rd Edition）1
    "new century college english video thirdedition 2",
    //新世纪大学英语系列教材（第二版）视听说教程（3rd Edition）2
    "new century college english video thirdedition 3",
    //新世纪大学英语系列教材（第二版）视听说教程（3rd Edition）3
    "new century college english video thirdedition 4"
    //新世纪大学英语系列教材（第二版）视听说教程（3rd Edition）4
  ];
  const READING = [
    "https://centercourseware.sflep.com/new century extensive reading course for english majors 2/web.html?courseurl=210_01_05_01&nocache=0.2702018071769088",
    "new century extensive reading course for english majors 1",
    //新世纪英语专业（修订版）泛读教程（第2版）第一册
    "new century extensive reading course for english majors 2",
    //新世纪英语专业（修订版）泛读教程（第2版）第二册
    "new century extensive reading course for english majors 3",
    //新世纪英语专业（修订版）泛读教程（第2版）第三册
    "new century extensive reading course for english majors 4"
    //新世纪英语专业（修订版）泛读教程（第2版）第四册
  ];
  const APP = [
    "https://centercourseware.sflep.com/Progressive English for Vocational Colleges Integrated Course 2/unit_01/main2.html?2-1-w1&nocache=0.2290241426227977",
    "Progressive English for Vocational Colleges Integrated Course 2",
    //高职国际进阶英语综合教程2
    "https://centercourseware.sflep.com/Progressive English for Vocational Colleges A Viewing Listening and Speaking Course 2/unit_01/main2.html?2-1-la_1&nocache=0.450784809471354",
    "Progressive English for Vocational Colleges A Viewing Listening and Speaking Course 2",
    //高职国际进阶英语视听说教程2
    "https://centercourseware.sflep.com/A Viewing Listening and Speaking Course 2/unit_01/main8.html?2-1-7&nocache=0.8280064535686702",
    "A Viewing Listening and Speaking Course 2"
    //新标准高职公共英语系列教材 实用视听说教程（精编版）
  ];
  const ANSWER_TYPES = [
    "et-tof",
    //判断题
    "et-blank",
    //问答题+填空题
    "et-select",
    //下拉选择题
    "et-choice",
    //选择题(二选一，多选)
    "et-matching",
    //连线题
    "et-reference",
    //口语参考
    "et-sort"
  ];
  function parseEt(dom) {
    let realAnswers = [];
    for (const answerType of ANSWER_TYPES) {
      let answers = dom.querySelectorAll(answerType);
      logger.debug(answers);
      let index2 = 1;
      for (const element of answers) {
        const answer = parseAnswer$3(element);
        if (answer) {
          answer.index = index2;
          logger.debug(answer);
          realAnswers.push(answer);
          index2++;
        }
      }
    }
    return realAnswers;
  }
  function parseAnswer$3(element) {
    let tag = element.tagName.toLowerCase();
    let answerText = "";
    switch (tag) {
      case "et-tof":
        answerText = element.getAttribute("key");
        break;
      case "et-blank":
        if (isRepeat(element))
          return;
        answerText = element.textContent.split("|")[0];
        if (element.hasAttribute("block"))
          tag = "et-textarea";
        break;
      case "et-select":
        answerText = element.getAttribute("key");
        try {
          if (!answerText.length)
            answerText = element.firstElementChild.textContent;
        } catch (error) {
          answerText = "Answers will vary.";
        }
        break;
      case "et-choice":
        if (isRepeat(element)) {
          if (element.hasAttribute("inline")) {
            return;
          }
        }
        answerText = element.getAttribute("key");
        break;
      case "et-matching":
        if (isRepeat(element))
          return;
        answerText = element.getAttribute("key").split(",").join("\n	<br/>");
        break;
      case "et-reference":
        if (!store.userSettings.showReference)
          return;
        answerText = element.innerHTML;
        break;
      case "et-sort":
        answerText = element.getAttribute("key");
        break;
    }
    return {
      text: answerText,
      type: tag,
      element
    };
  }
  function isRepeat(answerNode) {
    let parentElement = answerNode, parentTag;
    let webFlag = 0;
    let mobileFlag = 0;
    try {
      for (let i2 = 0; i2 < 9; i2++) {
        if (i2 !== 0) {
          parentElement = parentElement.parentElement;
        }
        parentTag = parentElement.tagName;
        if (parentTag == "ET-MOBILE-ONLY")
          mobileFlag++;
        if (parentTag == "ET-WEB-ONLY")
          webFlag++;
      }
    } catch (error) {
    } finally {
      if (webFlag && mobileFlag) {
        if (webFlag > 1) {
          return true;
        } else {
          return false;
        }
      } else if (webFlag) {
        return true;
      } else {
        return false;
      }
    }
  }
  function ready_in(element) {
    $(element).trigger("click").trigger("focus").trigger("keydown").trigger("input");
  }
  function event_trigger(element) {
    $(element).trigger("keyup").trigger("change").trigger("blur");
    try {
      angular.element(element).triggerHandler("hover");
      angular.element(element).triggerHandler("keyup");
      angular.element(element).triggerHandler("blur");
    } catch (error) {
    }
  }
  async function solveEt(answers) {
    const tofOnPaper = document.querySelectorAll("et-tof span.controls span");
    let tofOrder = 0;
    const blankOnPaper = document.querySelectorAll("et-blank span.blank");
    const textareaOnPaper = document.querySelectorAll(
      'et-blank textarea[ng-model="blank.value"]'
    );
    let blankOrder = 0;
    let textareaOrder = 0;
    const selectOnPaper = document.querySelectorAll("et-select div");
    let selectOrder = 0;
    const optionOnPaper = document.querySelectorAll("et-choice li");
    const optionSpanOnPaper = document.querySelectorAll("et-choice span");
    let liOrder = 0;
    let spanOrder = 0;
    let optionOrder = 0;
    for (const answer of answers) {
      await sleep(store.userSettings.solveInterval);
      switch (answer.type) {
        case "et-tof":
          let tofOption = void 0;
          switch (answer.text) {
            case "t":
            case "T":
              tofOption = 2 * tofOrder;
              break;
            case "f":
            case "F":
              tofOption = 2 * tofOrder + 1;
              break;
            default:
              throw new Error("tof解答出错");
          }
          tofOnPaper[tofOption].click();
          tofOrder++;
          break;
        case "et-blank":
          ready_in(blankOnPaper[blankOrder]);
          blankOnPaper[blankOrder].textContent = answer.text;
          event_trigger(blankOnPaper[blankOrder]);
          blankOrder++;
          break;
        case "et-textarea":
          if (answer.text.length) {
            ready_in(textareaOnPaper[textareaOrder]);
            textareaOnPaper[textareaOrder].textContent = answer.text;
            textareaOnPaper[textareaOrder].value = answer.text;
            event_trigger(textareaOnPaper[textareaOrder]);
          }
          textareaOrder++;
          break;
        case "et-select":
          const watchedElement = selectOnPaper[selectOrder].querySelector("select");
          watchedElement.value = `choice${answer.text}`;
          watchedElement.dispatchEvent(new Event("change"));
          selectOrder++;
          break;
        case "et-choice":
          let targetOption, options, optionCount;
          let spanFlag = false;
          try {
            options = answer.text.split(",");
          } catch (error) {
            options = ["1"];
          }
          logger.debug(options);
          if (!(optionCount = answer.element.querySelectorAll("li").length)) {
            optionCount = answer.element.querySelectorAll("span").length;
            if (optionCount) {
              spanFlag = true;
              optionOrder = spanOrder;
            } else {
              optionCount = 4;
            }
          } else {
            optionOrder = liOrder;
          }
          for (let option of options) {
            if (isNaN(parseInt(option))) {
              targetOption = optionCount * optionOrder + option.toUpperCase().charCodeAt() - 65;
            } else {
              targetOption = optionCount * optionOrder + parseInt(option) - 1;
            }
            logger.debug(
              `题号${optionOrder} span${spanOrder} 选项${targetOption} 选项数${optionCount}`
            );
            if (spanFlag && optionCount) {
              try {
                optionSpanOnPaper[targetOption].click();
              } catch (error) {
                optionOnPaper[targetOption].click();
              }
            } else {
              optionOnPaper[targetOption].click();
            }
          }
          if (spanFlag) {
            spanOrder++;
          } else {
            liOrder++;
          }
          optionOrder++;
          break;
        case "et-matching":
          for (let matchingOrder = 0; matchingOrder < answer.element.getAttribute("key").split(",").length; matchingOrder++) {
            await sleep(store.userSettings.solveInterval);
            let targetCircle = answer.element.getAttribute("key").split(",")[matchingOrder].split("-")[1] - 1;
            let x1 = leftCircles[matchingOrder].getAttribute("cx");
            let y1 = leftCircles[matchingOrder].getAttribute("cy");
            let x2 = rightCircles[targetCircle].getAttribute("cx");
            let y2 = rightCircles[targetCircle].getAttribute("cy");
            lineElements[matchingOrder].innerHTML = `
                    <line 
                        ng-class="{incorrect:!matching.isKey($parent.$index,b)}"
                        ng-click="matching.removeLine($parent.$index, b)" 
                        ng-repeat="b in cb track by $index" 
                        ng-attr-x1="{{matching.circles.xA}}"
                        ng-attr-x2="{{matching.circles.xB}}" 
                        ng-attr-y1="{{matching.circles.A[$parent.$index]}}" 
                        ng-attr-y2="{{matching.circles.B[b]}}"
                        x1="${x1}" 
                        x2="${x2}" 
                        y1="${y1}" 
                        y2="${y2}" 
                        class=""
                    ></line>`;
          }
          break;
      }
    }
  }
  function parseManifest(dom) {
    let realAnswers = [];
    let answers = dom.querySelectorAll("correctResponse value");
    logger.debug(answers);
    let index2 = 1;
    for (const element of answers) {
      const answerArray = parseAnswer$2(element, dom);
      for (const answer of answerArray) {
        if (answer) {
          answer.index = index2;
          logger.debug(answer);
          realAnswers.push(answer);
        }
        index2++;
      }
    }
    return realAnswers;
  }
  function parseAnswer$2(element, dom) {
    let answerText = "";
    let answerType = "";
    let returnAnswers = [];
    let identifier2 = element.textContent;
    if (identifier2.length == 36) {
      answerType = "choice";
      let selector = `[identifier="${identifier2}"]`;
      try {
        answerText = dom.querySelector(selector).textContent;
      } catch (error) {
        answerText = element.textContent;
      }
      returnAnswers.push({
        text: answerText,
        type: answerType,
        element,
        identifier: identifier2
      });
    } else if (identifier2.length > 200) {
      let identifiers = identifier2.split(",");
      for (const identifier22 of identifiers) {
        let selector = `[identifier="${identifier22}"]`;
        answerText = dom.querySelector(selector).textContent;
        returnAnswers.push({
          text: answerText,
          type: "choice",
          element,
          identifier: identifier22
        });
      }
    } else {
      answerText = element.textContent;
      answerType = answerText == "(Open.)" ? "textarea" : "blank";
      returnAnswers.push({
        text: answerText,
        type: answerType,
        element
      });
    }
    return returnAnswers;
  }
  async function solveManifest(answers) {
    let inputPatternOnPaper = document.querySelectorAll(
      '.pattern input[type="text"]'
    );
    let inputOrder = 0;
    let optionLabelOnPaper = document.querySelectorAll("label[for]");
    for (const answer of answers) {
      await sleep(store.userSettings.solveInterval);
      switch (answer.type) {
        case "blank":
          for (const inputAnswer of answer.text.split(",")) {
            try {
              inputPatternOnPaper[inputOrder].value = inputAnswer;
            } catch (error) {
              document.querySelector(".pattern textarea").textContent = inputAnswer;
            } finally {
              inputOrder++;
            }
          }
          break;
        case "textarea":
          document.querySelector(".pattern textarea").value = store.userSettings.defaultBlankAnswer;
          break;
        case "choice":
          for (const label of optionLabelOnPaper) {
            if (label.getAttribute("for").split("_")[1] == answer.identifier) {
              label.click();
              try {
                let labelHeight = label.getBoundingClientRect().top;
                document.querySelector("#divTest").scrollTo(0, labelHeight - 50);
              } catch (error) {
              }
            }
          }
          break;
      }
    }
  }
  let wordTestTimer;
  function parseWordTest() {
    clearInterval(wordTestTimer);
    wordTestTimer = setInterval(() => {
      try {
        store.clearLogs();
        let answer = document.querySelector(
          'ul[id^="wordTest"][style=""] > li:last-child'
        ).textContent;
      } catch (error) {
      }
    }, 2e3);
  }
  function parseDataSolution() {
    let realAnswers = [];
    let answers = document.querySelectorAll("[data-solution]");
    logger.debug(answers);
    let index2 = 1;
    for (const element of answers) {
      const answer = parseAnswer$1(element);
      if (answer) {
        answer.index = index2;
        logger.debug(answer);
        realAnswers.push(answer);
      }
      index2++;
    }
    return realAnswers;
  }
  function parseAnswer$1(element) {
    let answerText = element.getAttribute("data-solution");
    let answerType = "";
    if (answerText) {
      answerType = "blank";
    } else {
      try {
        answerText = element.firstElementChild.textContent;
        if (!answerText)
          answerText = element.textContent;
      } catch (error) {
        answerText = element.textContent;
      }
      answerType = "choice";
    }
    return {
      text: answerText,
      type: answerType,
      element
    };
  }
  async function solveDataSolution(answers) {
    const inputOnPaper = document.querySelectorAll("input[data-itemtype]");
    let inputOrder = 0;
    for (const answer of answers) {
      await sleep(store.userSettings.solveInterval);
      switch (answer.type) {
        case "blank":
          inputOnPaper[inputOrder].value = answer.text;
          inputOrder++;
          break;
        case "choice":
          answer.element.click();
          break;
      }
    }
  }
  function parseReading(dom) {
    let realAnswers = [];
    let answers = dom.querySelectorAll("correctResponse value");
    logger.debug(answers);
    let index2 = 1;
    for (const element of answers) {
      const answer = parseAnswer(element, dom);
      if (answer) {
        answer.index = index2;
        logger.debug(answer);
        realAnswers.push(answer);
      }
      index2++;
    }
    return realAnswers;
  }
  function parseAnswer(element, dom) {
    let answerText = element.textContent;
    let answerType = "";
    if (answerText.length == 36) {
      answerType = "choice";
      let selector = `[identifier="${answerText}"]`;
      element = dom.querySelector(selector);
      answerText = /CDATA\[(.*)\]\]/.exec(element.innerHTML)[1].trim();
    } else if (answerText.length == 73) {
      answerType = "matching";
    } else {
      answerType = "blank";
    }
    return {
      text: answerText,
      type: answerType,
      element
    };
  }
  async function initialCourseCatalog() {
    const catalog = await WELearnAPI.getCourseCatalog();
    logger.debug({ catalog });
    if (catalog === void 0)
      return;
    const { dataSolution, et: et2, manifest, reading, app } = catalog;
    MANIFEST.push(...manifest);
    DATA_SOLUTION.push(...dataSolution);
    ET.push(...et2);
    READING.push(...reading);
    APP.push(...app);
    logger.debug({
      MANIFEST,
      DATA_SOLUTION,
      ET,
      READING,
      APP
    });
  }
  const PARSER = new DOMParser();
  async function queryData(answerUrl) {
    const response = await fetch(answerUrl);
    const text = await response.text();
    let htmlDom = PARSER.parseFromString(text, "text/html");
    logger.debug(htmlDom);
    return htmlDom;
  }
  async function queryManifest(manifestUrl, identifier2, courseInfo) {
    const response = await fetch(manifestUrl);
    const text = await response.text();
    let selector = `resource[identifier="${identifier2}"] file`;
    let resource = PARSER.parseFromString(text, "text/html").querySelector(selector).getAttribute("href");
    let answerUrl = `https://centercourseware.sflep.com/${courseInfo}/${resource}`;
    return queryData(answerUrl);
  }
  async function outputAnswers(answers) {
    for (const answer of answers) {
      if (store.userSettings.autoSolve)
        ;
      logger.question({
        content: {
          order: `${String(answer.index).padStart(2, "0")}`,
          info: {
            content: "标答"
          },
          answerText: answer.text,
          raw: {
            element: answer.element
          },
          solve: {
            couldSolve: true,
            hasSolved: true,
            solveThis: async () => {
              logger.debug("solve this");
            }
          }
        }
      });
      answer.element.tagName;
      await sleep(CONSTANT.QUERY_INTERVAL);
    }
  }
  async function determineCourseType(iframeUrl) {
    let courseInfo = /com\/(.*?)\//.exec(iframeUrl)[1];
    courseInfo = decodeURI(courseInfo);
    logger.debug(courseInfo);
    let identifier2 = void 0;
    try {
      identifier2 = /#(.*)\?/.exec(iframeUrl)[1];
    } catch (error) {
    }
    let manifestUrl = `https://centercourseware.sflep.com/${courseInfo}/resource/manifest.xml`;
    let answerUrl = `https://centercourseware.sflep.com/${courseInfo}/data${identifier2}.html`;
    let dom;
    let answers = [];
    let hasAnswer = false;
    if (MANIFEST.includes(courseInfo)) {
      dom = await queryManifest(manifestUrl, identifier2, courseInfo);
      answers = parseManifest(dom);
      if (document.querySelector('div[id^="word"]'))
        parseWordTest();
      if (store.userSettings.autoSolve)
        solveManifest(answers);
    } else if (ET.includes(courseInfo)) {
      dom = await queryData(answerUrl);
      answers = parseEt(dom);
      if (store.userSettings.autoSolve)
        solveEt(answers);
    } else if (DATA_SOLUTION.includes(courseInfo)) {
      setTimeout(() => {
        answers = parseDataSolution();
        logger.debug(answers);
        if (answers.length) {
          outputAnswers(answers);
          if (store.userSettings.autoSolve)
            solveDataSolution(answers);
        } else {
          if (!hasAnswer) {
            logger.info({ content: "此页面已适配，无答案" });
          }
        }
      }, 2e3);
    } else if (READING.includes(courseInfo)) {
      let answerUrl2 = location.href.split("&")[0].replace("web.html?courseurl=", "data/") + ".xml";
      dom = await queryData(answerUrl2);
      answers = parseReading(dom);
    } else {
      logger.info({ content: `未适配的课程类型，请在Github反馈` });
      logger.info({ content: `${courseInfo}` });
      logger.info({ content: `注意页面上是否有二维码，且注明需在app中使用，这种题型只能用app` });
      logger.debug("未处理的课程类型");
      logger.debug(courseInfo);
      logger.debug(identifier2);
    }
    logger.debug(answers);
    if (answers.length) {
      hasAnswer = true;
      outputAnswers(answers);
    }
  }
  if (location.href.includes("centercourseware.sflep.com")) {
    let watcher2 = function() {
      let currentUrl = location.href;
      logger.debug(currentUrl);
      if (currentUrl != bufferUrl) {
        store.clearLogs();
        determineCourseType(currentUrl);
      }
      bufferUrl = currentUrl;
    };
    let bufferUrl = "";
    setInterval(watcher2, 200);
    initialCourseCatalog();
  }
  function generateRandomInterval() {
    let rate = 1;
    const { randomRefresh, refreshIntervalMin, refreshIntervalMax } = store.userSettings;
    if (randomRefresh) {
      rate = Math.random();
      let currentRate = refreshIntervalMin / refreshIntervalMax;
      if (rate < currentRate)
        rate = currentRate;
    }
    return rate;
  }
  function nextChapter() {
    const topWindow = top;
    const jumpButtons = topWindow.document.querySelectorAll('a[onclick^="SelectSCO"]');
    const currentButton = topWindow.document.querySelector("li.courseware_current a");
    if (currentButton == jumpButtons[jumpButtons.length - 1]) {
      if (store.userSettings.loopRefresh) {
        jumpButtons[1].click();
      }
    } else {
      NextSCO();
    }
  }
  async function notify() {
    let status = await getValue("hasInformed", false);
    if (!status) {
      await setValue("hasInformed", true);
    }
  }
  function recur() {
    setTimeout(() => {
      nextChapter();
      recur();
    }, store.userSettings.refreshIntervalMax * generateRandomInterval() * 60 * 1e3);
  }
  async function autoRefresh() {
    if (store.userSettings.autoRefresh) {
      recur();
      notify();
    }
  }
  if (location.href.includes(".sflep.com/student/StudyCourse.aspx?") || location.href.includes(".sflep.com/Course/TryCourse.aspx?")) {
    autoRefresh();
  }
  WELearnAPI.checkVersion();
  const index$3 = "";
  var createRoot;
  var m$5 = require$$2;
  {
    createRoot = m$5.createRoot;
    m$5.hydrateRoot;
  }
  const WELearnExerciseSettings = [
    {
      title: "练习",
      settings: [
        {
          id: "showReference",
          name: "显示参考",
          default: true,
          valueType: "boolean",
          description: "是否显示听力、口语参考(适用视听说)"
        },
        {
          id: "autoSolve",
          name: "自动答题",
          default: false,
          valueType: "boolean",
          description: "自动答题开关"
        },
        {
          id: "solveInterval",
          name: "答题间隔",
          default: 1e3,
          valueType: "number",
          description: "单位毫秒；自动答题间隔"
        },
        {
          id: "defaultBlankAnswer",
          name: "默认填空",
          default: "Default answer.",
          valueType: "string",
          description: "填空题没有固定|正确答案时，填入的默认值"
        }
      ]
    }
  ];
  const WELearnExamSettings = [
    {
      title: "考试",
      settings: [
        {
          id: "infiniteListening",
          name: "无限听力",
          default: true,
          valueType: "boolean",
          description: "允许无限次播放听力音频"
        }
      ]
    }
  ];
  const WELearnTimeSettings = [
    {
      title: "时长相关",
      settings: [
        {
          id: "autoRefresh",
          name: "自动挂机",
          // type: "switch",
          default: false,
          valueType: "boolean",
          description: "是否定时切换下一页，仅用于刷时长"
        },
        {
          id: "loopRefresh",
          name: "循环挂机",
          // type: "switch",
          default: false,
          valueType: "boolean",
          description: "一遍刷完，是否跳转到开头；自动跳过封锁章节"
        },
        {
          id: "randomRefresh",
          name: "随机延时",
          // type: "switch",
          default: false,
          valueType: "boolean",
          description: "关闭将以上限为切换时长，开启将取上下限区间内随机时长"
        },
        {
          id: "refreshIntervalMin",
          name: "切换下限",
          default: 5,
          valueType: "number",
          description: "单位分钟；we learn允许一个页面最多挂30分钟，所以不要大于30"
        },
        {
          id: "refreshIntervalMax",
          name: "切换上限",
          default: 10,
          valueType: "number",
          description: "单位分钟"
        }
      ]
    }
  ];
  const commonSettings = [
    {
      title: "用户",
      settings: [
        {
          id: "userAccount",
          name: "身份令牌",
          default: "default",
          valueType: "string",
          description: "随意设定，累计每个人贡献的题目数量"
        },
        {
          id: "userPoints",
          name: "累计积分",
          readonly: true,
          default: 0,
          valueType: "number",
          description: "上传答案获取，暂无用处"
        }
        // {
        //     //离线模式应该不是让用户手动选择的，而是连接服务器失败之后自动操作的，作为备用方案
        //     id: "targetApi",
        //     name: "接口选择",
        //     type: "selection",
        //     default: 1,
        //     description: "默认使用哪个查题接口",
        // },
      ]
    },
    {
      title: "UI相关",
      settings: [
        {
          id: "autoScrollDown",
          name: "自动下滑",
          default: true,
          valueType: "boolean",
          description: "有新消息时，窗口是否自动下滑到新消息处"
        },
        {
          id: "enableTyping",
          name: "打字效果",
          default: true,
          valueType: "boolean",
          description: "如果电脑配置比较低，启用打字效果时，可能会出现打字动画自身的卡顿或者打字动画导致的整个页面的卡顿；这种情况下，建议关闭"
        }
      ]
    }
  ];
  function mergeSettings(...arrayOfSectionSettings) {
    const sectionSettings = [];
    for (const sections of arrayOfSectionSettings) {
      for (const section of sections) {
        if (!sectionSettings.some((exist) => exist.title == section.title))
          sectionSettings.push({ title: section.title, settings: [] });
        let index2;
        for (let i2 = 0; i2 < sectionSettings.length; i2++) {
          if (sectionSettings[i2].title == section.title) {
            index2 = i2;
          }
        }
        if (typeof index2 == "undefined")
          throw Error("error during get index ");
        for (const generic of section.settings) {
          const settings = sectionSettings[index2].settings;
          if (!settings.some((setting) => setting.id == generic.id))
            sectionSettings[index2].settings.push(generic);
        }
      }
    }
    return sectionSettings;
  }
  async function initialUserSettings() {
    const sectionSettings = mergeSettings(
      WELearnExamSettings,
      WELearnExerciseSettings,
      WELearnTimeSettings,
      commonSettings
    );
    store.sectionSettings = sectionSettings;
    store.setUserSettings(await getValue("userSettings", {}));
    logger.debug("设置已读取", { ...store.userSettings });
    if (Object.keys(store.userSettings).length === 0) {
      store.setDefaultValues();
      logger.debug("设置为空，已初始化", { ...store.userSettings });
    }
  }
  function sheetForTag(tag) {
    if (tag.sheet) {
      return tag.sheet;
    }
    for (var i2 = 0; i2 < document.styleSheets.length; i2++) {
      if (document.styleSheets[i2].ownerNode === tag) {
        return document.styleSheets[i2];
      }
    }
  }
  function createStyleElement(options) {
    var tag = document.createElement("style");
    tag.setAttribute("data-emotion", options.key);
    if (options.nonce !== void 0) {
      tag.setAttribute("nonce", options.nonce);
    }
    tag.appendChild(document.createTextNode(""));
    tag.setAttribute("data-s", "");
    return tag;
  }
  var StyleSheet = /* @__PURE__ */ function() {
    function StyleSheet2(options) {
      var _this = this;
      this._insertTag = function(tag) {
        var before;
        if (_this.tags.length === 0) {
          if (_this.insertionPoint) {
            before = _this.insertionPoint.nextSibling;
          } else if (_this.prepend) {
            before = _this.container.firstChild;
          } else {
            before = _this.before;
          }
        } else {
          before = _this.tags[_this.tags.length - 1].nextSibling;
        }
        _this.container.insertBefore(tag, before);
        _this.tags.push(tag);
      };
      this.isSpeedy = options.speedy === void 0 ? true : options.speedy;
      this.tags = [];
      this.ctr = 0;
      this.nonce = options.nonce;
      this.key = options.key;
      this.container = options.container;
      this.prepend = options.prepend;
      this.insertionPoint = options.insertionPoint;
      this.before = null;
    }
    var _proto = StyleSheet2.prototype;
    _proto.hydrate = function hydrate(nodes) {
      nodes.forEach(this._insertTag);
    };
    _proto.insert = function insert(rule) {
      if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
        this._insertTag(createStyleElement(this));
      }
      var tag = this.tags[this.tags.length - 1];
      if (this.isSpeedy) {
        var sheet = sheetForTag(tag);
        try {
          sheet.insertRule(rule, sheet.cssRules.length);
        } catch (e2) {
        }
      } else {
        tag.appendChild(document.createTextNode(rule));
      }
      this.ctr++;
    };
    _proto.flush = function flush() {
      this.tags.forEach(function(tag) {
        return tag.parentNode && tag.parentNode.removeChild(tag);
      });
      this.tags = [];
      this.ctr = 0;
    };
    return StyleSheet2;
  }();
  var MS = "-ms-";
  var MOZ = "-moz-";
  var WEBKIT = "-webkit-";
  var COMMENT = "comm";
  var RULESET = "rule";
  var DECLARATION = "decl";
  var IMPORT = "@import";
  var KEYFRAMES = "@keyframes";
  var abs = Math.abs;
  var from = String.fromCharCode;
  var assign = Object.assign;
  function hash(value, length2) {
    return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
  }
  function trim(value) {
    return value.trim();
  }
  function match(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search) {
    return value.indexOf(search);
  }
  function charat(value, index2) {
    return value.charCodeAt(index2) | 0;
  }
  function substr(value, begin, end) {
    return value.slice(begin, end);
  }
  function strlen(value) {
    return value.length;
  }
  function sizeof(value) {
    return value.length;
  }
  function append(value, array) {
    return array.push(value), value;
  }
  function combine(array, callback) {
    return array.map(callback).join("");
  }
  var line = 1;
  var column = 1;
  var length = 0;
  var position = 0;
  var character = 0;
  var characters = "";
  function node(value, root2, parent, type, props, children, length2) {
    return { value, root: root2, parent, type, props, children, line, column, length: length2, return: "" };
  }
  function copy(root2, props) {
    return assign(node("", null, null, "", null, null, 0), root2, { length: -root2.length }, props);
  }
  function char() {
    return character;
  }
  function prev() {
    character = position > 0 ? charat(characters, --position) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position < length ? charat(characters, position++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek() {
    return charat(characters, position);
  }
  function caret() {
    return position;
  }
  function slice(begin, end) {
    return substr(characters, begin, end);
  }
  function token(type) {
    switch (type) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function alloc(value) {
    return line = column = 1, length = strlen(characters = value), position = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index2, count2) {
    while (--count2 && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index2, caret() + (count2 < 6 && peek() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        case type:
          return position;
        case 34:
        case 39:
          if (type !== 34 && type !== 39)
            delimiter(character);
          break;
        case 40:
          if (type === 41)
            delimiter(type);
          break;
        case 92:
          next();
          break;
      }
    return position;
  }
  function commenter(type, index2) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek() === 47)
        break;
    return "/*" + slice(index2, position - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index2) {
    while (!token(peek()))
      next();
    return slice(index2, position);
  }
  function compile(value) {
    return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse(value, root2, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index2 = 0;
    var offset = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference = rule;
    var characters2 = type;
    while (scanning)
      switch (previous = character2, character2 = next()) {
        case 40:
          if (previous != 108 && charat(characters2, length2 - 1) == 58) {
            if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
              ampersand = -1;
            break;
          }
        case 34:
        case 39:
        case 91:
          characters2 += delimit(character2);
          break;
        case 9:
        case 10:
        case 13:
        case 32:
          characters2 += whitespace(previous);
          break;
        case 92:
          characters2 += escaping(caret() - 1, 7);
          continue;
        case 47:
          switch (peek()) {
            case 42:
            case 47:
              append(comment(commenter(next(), caret()), root2, parent), declarations);
              break;
            default:
              characters2 += "/";
          }
          break;
        case 123 * variable:
          points[index2++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset:
              if (property > 0 && strlen(characters2) - length2)
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference = ruleset(characters2, root2, parent, index2, offset, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset === 0)
                  parse(characters2, root2, reference, reference, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    case 100:
                    case 109:
                    case 115:
                      parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                  }
          }
          index2 = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        case 58:
          length2 = 1 + strlen(characters2), property = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            case 38:
              ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index2++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root2, parent, index2, offset, rules, points, type, props, children, length2) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i2 = 0, j2 = 0, k2 = 0; i2 < index2; ++i2)
      for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j2 = points[i2])), z2 = value; x2 < size; ++x2)
        if (z2 = trim(j2 > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
          props[k2++] = z2;
    return node(value, root2, parent, offset === 0 ? RULESET : type, props, children, length2);
  }
  function comment(value, root2, parent) {
    return node(value, root2, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
  }
  function declaration(value, root2, parent, length2) {
    return node(value, root2, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
  }
  function serialize(children, callback) {
    var output = "";
    var length2 = sizeof(children);
    for (var i2 = 0; i2 < length2; i2++)
      output += callback(children[i2], i2, children, callback) || "";
    return output;
  }
  function stringify(element, index2, children, callback) {
    switch (element.type) {
      case IMPORT:
      case DECLARATION:
        return element.return = element.return || element.value;
      case COMMENT:
        return "";
      case KEYFRAMES:
        return element.return = element.value + "{" + serialize(element.children, callback) + "}";
      case RULESET:
        element.value = element.props.join(",");
    }
    return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
  }
  function middleware(collection) {
    var length2 = sizeof(collection);
    return function(element, index2, children, callback) {
      var output = "";
      for (var i2 = 0; i2 < length2; i2++)
        output += collection[i2](element, index2, children, callback) || "";
      return output;
    };
  }
  function rulesheet(callback) {
    return function(element) {
      if (!element.root) {
        if (element = element.return)
          callback(element);
      }
    };
  }
  var weakMemoize = function weakMemoize2(func) {
    var cache = /* @__PURE__ */ new WeakMap();
    return function(arg) {
      if (cache.has(arg)) {
        return cache.get(arg);
      }
      var ret = func(arg);
      cache.set(arg, ret);
      return ret;
    };
  };
  function memoize$1(fn) {
    var cache = /* @__PURE__ */ Object.create(null);
    return function(arg) {
      if (cache[arg] === void 0)
        cache[arg] = fn(arg);
      return cache[arg];
    };
  }
  var identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index2) {
    var previous = 0;
    var character2 = 0;
    while (true) {
      previous = character2;
      character2 = peek();
      if (previous === 38 && character2 === 12) {
        points[index2] = 1;
      }
      if (token(character2)) {
        break;
      }
      next();
    }
    return slice(begin, position);
  };
  var toRules = function toRules2(parsed, points) {
    var index2 = -1;
    var character2 = 44;
    do {
      switch (token(character2)) {
        case 0:
          if (character2 === 38 && peek() === 12) {
            points[index2] = 1;
          }
          parsed[index2] += identifierWithPointTracking(position - 1, points, index2);
          break;
        case 2:
          parsed[index2] += delimit(character2);
          break;
        case 4:
          if (character2 === 44) {
            parsed[++index2] = peek() === 58 ? "&\f" : "";
            points[index2] = parsed[index2].length;
            break;
          }
        default:
          parsed[index2] += from(character2);
      }
    } while (character2 = next());
    return parsed;
  };
  var getRules = function getRules2(value, points) {
    return dealloc(toRules(alloc(value), points));
  };
  var fixedElements = /* @__PURE__ */ new WeakMap();
  var compat = function compat2(element) {
    if (element.type !== "rule" || !element.parent || // positive .length indicates that this rule contains pseudo
    // negative .length indicates that this rule has been already prefixed
    element.length < 1) {
      return;
    }
    var value = element.value, parent = element.parent;
    var isImplicitRule = element.column === parent.column && element.line === parent.line;
    while (parent.type !== "rule") {
      parent = parent.parent;
      if (!parent)
        return;
    }
    if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
      return;
    }
    if (isImplicitRule) {
      return;
    }
    fixedElements.set(element, true);
    var points = [];
    var rules = getRules(value, points);
    var parentRules = parent.props;
    for (var i2 = 0, k2 = 0; i2 < rules.length; i2++) {
      for (var j2 = 0; j2 < parentRules.length; j2++, k2++) {
        element.props[k2] = points[i2] ? rules[i2].replace(/&\f/g, parentRules[j2]) : parentRules[j2] + " " + rules[i2];
      }
    }
  };
  var removeLabel = function removeLabel2(element) {
    if (element.type === "decl") {
      var value = element.value;
      if (
        // charcode for l
        value.charCodeAt(0) === 108 && // charcode for b
        value.charCodeAt(2) === 98
      ) {
        element["return"] = "";
        element.value = "";
      }
    }
  };
  function prefix(value, length2) {
    switch (hash(value, length2)) {
      case 5103:
        return WEBKIT + "print-" + value + value;
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return WEBKIT + value + value;
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return WEBKIT + value + MOZ + value + MS + value + value;
      case 6828:
      case 4268:
        return WEBKIT + value + MS + value + value;
      case 6165:
        return WEBKIT + value + MS + "flex-" + value + value;
      case 5187:
        return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
      case 5443:
        return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
      case 4675:
        return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
      case 5548:
        return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
      case 5292:
        return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
      case 6060:
        return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
      case 4554:
        return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
      case 6187:
        return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
      case 5495:
      case 3959:
        return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
      case 4968:
        return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
      case 8116:
      case 7059:
      case 5753:
      case 5535:
      case 5445:
      case 5701:
      case 4933:
      case 4677:
      case 5533:
      case 5789:
      case 5021:
      case 4765:
        if (strlen(value) - 1 - length2 > 6)
          switch (charat(value, length2 + 1)) {
            case 109:
              if (charat(value, length2 + 4) !== 45)
                break;
            case 102:
              return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
            case 115:
              return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
          }
        break;
      case 4949:
        if (charat(value, length2 + 1) !== 115)
          break;
      case 6444:
        switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
          case 107:
            return replace(value, ":", ":" + WEBKIT) + value;
          case 101:
            return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        }
        break;
      case 5936:
        switch (charat(value, length2 + 11)) {
          case 114:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
          case 108:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
          case 45:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
        }
        return WEBKIT + value + MS + value + value;
    }
    return value;
  }
  var prefixer = function prefixer2(element, index2, children, callback) {
    if (element.length > -1) {
      if (!element["return"])
        switch (element.type) {
          case DECLARATION:
            element["return"] = prefix(element.value, element.length);
            break;
          case KEYFRAMES:
            return serialize([copy(element, {
              value: replace(element.value, "@", "@" + WEBKIT)
            })], callback);
          case RULESET:
            if (element.length)
              return combine(element.props, function(value) {
                switch (match(value, /(::plac\w+|:read-\w+)/)) {
                  case ":read-only":
                  case ":read-write":
                    return serialize([copy(element, {
                      props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")]
                    })], callback);
                  case "::placeholder":
                    return serialize([copy(element, {
                      props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")]
                    }), copy(element, {
                      props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")]
                    }), copy(element, {
                      props: [replace(value, /:(plac\w+)/, MS + "input-$1")]
                    })], callback);
                }
                return "";
              });
        }
    }
  };
  var defaultStylisPlugins = [prefixer];
  var createCache = function createCache2(options) {
    var key = options.key;
    if (key === "css") {
      var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(ssrStyles, function(node2) {
        var dataEmotionAttribute = node2.getAttribute("data-emotion");
        if (dataEmotionAttribute.indexOf(" ") === -1) {
          return;
        }
        document.head.appendChild(node2);
        node2.setAttribute("data-s", "");
      });
    }
    var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
    var inserted = {};
    var container;
    var nodesToHydrate = [];
    {
      container = options.container || document.head;
      Array.prototype.forEach.call(
        // this means we will ignore elements which don't have a space in them which
        // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
        document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
        function(node2) {
          var attrib = node2.getAttribute("data-emotion").split(" ");
          for (var i2 = 1; i2 < attrib.length; i2++) {
            inserted[attrib[i2]] = true;
          }
          nodesToHydrate.push(node2);
        }
      );
    }
    var _insert;
    var omnipresentPlugins = [compat, removeLabel];
    {
      var currentSheet;
      var finalizingPlugins = [stringify, rulesheet(function(rule) {
        currentSheet.insert(rule);
      })];
      var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
      var stylis = function stylis2(styles2) {
        return serialize(compile(styles2), serializer);
      };
      _insert = function insert(selector, serialized, sheet, shouldCache) {
        currentSheet = sheet;
        stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
        if (shouldCache) {
          cache.inserted[serialized.name] = true;
        }
      };
    }
    var cache = {
      key,
      sheet: new StyleSheet({
        key,
        container,
        nonce: options.nonce,
        speedy: options.speedy,
        prepend: options.prepend,
        insertionPoint: options.insertionPoint
      }),
      nonce: options.nonce,
      inserted,
      registered: {},
      insert: _insert
    };
    cache.sheet.hydrate(nodesToHydrate);
    return cache;
  };
  function _extends$1() {
    _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends$1.apply(this, arguments);
  }
  var reactIsExports = {};
  var reactIs$1 = {
    get exports() {
      return reactIsExports;
    },
    set exports(v2) {
      reactIsExports = v2;
    }
  };
  var reactIs_production_min = {};
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b$5 = "function" === typeof Symbol && Symbol.for, c$6 = b$5 ? Symbol.for("react.element") : 60103, d$4 = b$5 ? Symbol.for("react.portal") : 60106, e$1 = b$5 ? Symbol.for("react.fragment") : 60107, f$4 = b$5 ? Symbol.for("react.strict_mode") : 60108, g$4 = b$5 ? Symbol.for("react.profiler") : 60114, h$6 = b$5 ? Symbol.for("react.provider") : 60109, k$4 = b$5 ? Symbol.for("react.context") : 60110, l$5 = b$5 ? Symbol.for("react.async_mode") : 60111, m$4 = b$5 ? Symbol.for("react.concurrent_mode") : 60111, n$3 = b$5 ? Symbol.for("react.forward_ref") : 60112, p$4 = b$5 ? Symbol.for("react.suspense") : 60113, q$2 = b$5 ? Symbol.for("react.suspense_list") : 60120, r$4 = b$5 ? Symbol.for("react.memo") : 60115, t$1 = b$5 ? Symbol.for("react.lazy") : 60116, v$4 = b$5 ? Symbol.for("react.block") : 60121, w$3 = b$5 ? Symbol.for("react.fundamental") : 60117, x$5 = b$5 ? Symbol.for("react.responder") : 60118, y$6 = b$5 ? Symbol.for("react.scope") : 60119;
  function z$3(a2) {
    if ("object" === typeof a2 && null !== a2) {
      var u2 = a2.$$typeof;
      switch (u2) {
        case c$6:
          switch (a2 = a2.type, a2) {
            case l$5:
            case m$4:
            case e$1:
            case g$4:
            case f$4:
            case p$4:
              return a2;
            default:
              switch (a2 = a2 && a2.$$typeof, a2) {
                case k$4:
                case n$3:
                case t$1:
                case r$4:
                case h$6:
                  return a2;
                default:
                  return u2;
              }
          }
        case d$4:
          return u2;
      }
    }
  }
  function A$2(a2) {
    return z$3(a2) === m$4;
  }
  reactIs_production_min.AsyncMode = l$5;
  reactIs_production_min.ConcurrentMode = m$4;
  reactIs_production_min.ContextConsumer = k$4;
  reactIs_production_min.ContextProvider = h$6;
  reactIs_production_min.Element = c$6;
  reactIs_production_min.ForwardRef = n$3;
  reactIs_production_min.Fragment = e$1;
  reactIs_production_min.Lazy = t$1;
  reactIs_production_min.Memo = r$4;
  reactIs_production_min.Portal = d$4;
  reactIs_production_min.Profiler = g$4;
  reactIs_production_min.StrictMode = f$4;
  reactIs_production_min.Suspense = p$4;
  reactIs_production_min.isAsyncMode = function(a2) {
    return A$2(a2) || z$3(a2) === l$5;
  };
  reactIs_production_min.isConcurrentMode = A$2;
  reactIs_production_min.isContextConsumer = function(a2) {
    return z$3(a2) === k$4;
  };
  reactIs_production_min.isContextProvider = function(a2) {
    return z$3(a2) === h$6;
  };
  reactIs_production_min.isElement = function(a2) {
    return "object" === typeof a2 && null !== a2 && a2.$$typeof === c$6;
  };
  reactIs_production_min.isForwardRef = function(a2) {
    return z$3(a2) === n$3;
  };
  reactIs_production_min.isFragment = function(a2) {
    return z$3(a2) === e$1;
  };
  reactIs_production_min.isLazy = function(a2) {
    return z$3(a2) === t$1;
  };
  reactIs_production_min.isMemo = function(a2) {
    return z$3(a2) === r$4;
  };
  reactIs_production_min.isPortal = function(a2) {
    return z$3(a2) === d$4;
  };
  reactIs_production_min.isProfiler = function(a2) {
    return z$3(a2) === g$4;
  };
  reactIs_production_min.isStrictMode = function(a2) {
    return z$3(a2) === f$4;
  };
  reactIs_production_min.isSuspense = function(a2) {
    return z$3(a2) === p$4;
  };
  reactIs_production_min.isValidElementType = function(a2) {
    return "string" === typeof a2 || "function" === typeof a2 || a2 === e$1 || a2 === m$4 || a2 === g$4 || a2 === f$4 || a2 === p$4 || a2 === q$2 || "object" === typeof a2 && null !== a2 && (a2.$$typeof === t$1 || a2.$$typeof === r$4 || a2.$$typeof === h$6 || a2.$$typeof === k$4 || a2.$$typeof === n$3 || a2.$$typeof === w$3 || a2.$$typeof === x$5 || a2.$$typeof === y$6 || a2.$$typeof === v$4);
  };
  reactIs_production_min.typeOf = z$3;
  (function(module) {
    {
      module.exports = reactIs_production_min;
    }
  })(reactIs$1);
  var reactIs = reactIsExports;
  var FORWARD_REF_STATICS = {
    "$$typeof": true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    "$$typeof": true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
  var isBrowser = true;
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = "";
    classNames.split(" ").forEach(function(className) {
      if (registered[className] !== void 0) {
        registeredStyles.push(registered[className] + ";");
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var registerStyles = function registerStyles2(cache, serialized, isStringTag) {
    var className = cache.key + "-" + serialized.name;
    if (
      // we only need to add the styles to the registered cache if the
      // class name could be used further down
      // the tree but if it's a string tag, we know it won't
      // so we don't have to add it to registered cache.
      // this improves memory usage since we can avoid storing the whole style string
      (isStringTag === false || // we need to always store it if we're in compat mode and
      // in node since emotion-server relies on whether a style is in
      // the registered cache to know whether a style is global or not
      // also, note that this check will be dead code eliminated in the browser
      isBrowser === false) && cache.registered[className] === void 0
    ) {
      cache.registered[className] = serialized.styles;
    }
  };
  var insertStyles = function insertStyles2(cache, serialized, isStringTag) {
    registerStyles(cache, serialized, isStringTag);
    var className = cache.key + "-" + serialized.name;
    if (cache.inserted[serialized.name] === void 0) {
      var current = serialized;
      do {
        cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
        current = current.next;
      } while (current !== void 0);
    }
  };
  function murmur2(str) {
    var h2 = 0;
    var k2, i2 = 0, len = str.length;
    for (; len >= 4; ++i2, len -= 4) {
      k2 = str.charCodeAt(i2) & 255 | (str.charCodeAt(++i2) & 255) << 8 | (str.charCodeAt(++i2) & 255) << 16 | (str.charCodeAt(++i2) & 255) << 24;
      k2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
      k2 ^= /* k >>> r: */
      k2 >>> 24;
      h2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
      (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h2 ^= (str.charCodeAt(i2 + 2) & 255) << 16;
      case 2:
        h2 ^= (str.charCodeAt(i2 + 1) & 255) << 8;
      case 1:
        h2 ^= str.charCodeAt(i2) & 255;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    h2 ^= h2 >>> 13;
    h2 = /* Math.imul(h, m): */
    (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
  }
  var unitlessKeys = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };
  var hyphenateRegex = /[A-Z]|^ms/g;
  var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
  var isCustomProperty = function isCustomProperty2(property) {
    return property.charCodeAt(1) === 45;
  };
  var isProcessableValue = function isProcessableValue2(value) {
    return value != null && typeof value !== "boolean";
  };
  var processStyleName = /* @__PURE__ */ memoize$1(function(styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
  });
  var processStyleValue = function processStyleValue2(key, value) {
    switch (key) {
      case "animation":
      case "animationName": {
        if (typeof value === "string") {
          return value.replace(animationRegex, function(match2, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
    }
    if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) {
      return value + "px";
    }
    return value;
  };
  var noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
  function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    if (interpolation.__emotion_styles !== void 0) {
      return interpolation;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }
        if (interpolation.styles !== void 0) {
          var next2 = interpolation.next;
          if (next2 !== void 0) {
            while (next2 !== void 0) {
              cursor = {
                name: next2.name,
                styles: next2.styles,
                next: cursor
              };
              next2 = next2.next;
            }
          }
          var styles2 = interpolation.styles + ";";
          return styles2;
        }
        return createStringFromObject(mergedProps, registered, interpolation);
      }
      case "function": {
        if (mergedProps !== void 0) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        }
        break;
      }
    }
    if (registered == null) {
      return interpolation;
    }
    var cached = registered[interpolation];
    return cached !== void 0 ? cached : interpolation;
  }
  function createStringFromObject(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i2 = 0; i2 < obj.length; i2++) {
        string += handleInterpolation(mergedProps, registered, obj[i2]) + ";";
      }
    } else {
      for (var _key in obj) {
        var value = obj[_key];
        if (typeof value !== "object") {
          if (registered != null && registered[value] !== void 0) {
            string += _key + "{" + registered[value] + "}";
          } else if (isProcessableValue(value)) {
            string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
          }
        } else {
          if (_key === "NO_COMPONENT_SELECTOR" && false) {
            throw new Error(noComponentSelectorMessage);
          }
          if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value);
            switch (_key) {
              case "animation":
              case "animationName": {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += _key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
  var cursor;
  var serializeStyles = function serializeStyles2(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
      return args[0];
    }
    var stringMode = true;
    var styles2 = "";
    cursor = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles2 += handleInterpolation(mergedProps, registered, strings);
    } else {
      styles2 += strings[0];
    }
    for (var i2 = 1; i2 < args.length; i2++) {
      styles2 += handleInterpolation(mergedProps, registered, args[i2]);
      if (stringMode) {
        styles2 += strings[i2];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles2)) !== null) {
      identifierName += "-" + // $FlowFixMe we know it's not null
      match2[1];
    }
    var name = murmur2(styles2) + identifierName;
    return {
      name,
      styles: styles2,
      next: cursor
    };
  };
  var syncFallback = function syncFallback2(create) {
    return create();
  };
  var useInsertionEffect$1 = React__namespace["useInsertionEffect"] ? React__namespace["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect$1 || syncFallback;
  var useInsertionEffectWithLayoutFallback = useInsertionEffect$1 || React$1.useLayoutEffect;
  var EmotionCacheContext = /* @__PURE__ */ React$1.createContext(
    // we're doing this to avoid preconstruct's dead code elimination in this one case
    // because this module is primarily intended for the browser and node
    // but it's also required in react native and similar environments sometimes
    // and we could have a special build just for that
    // but this is much easier and the native packages
    // might use a different theme context in the future anyway
    typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
      key: "css"
    }) : null
  );
  EmotionCacheContext.Provider;
  var withEmotionCache = function withEmotionCache2(func) {
    return /* @__PURE__ */ React$1.forwardRef(function(props, ref) {
      var cache = React$1.useContext(EmotionCacheContext);
      return func(props, cache, ref);
    });
  };
  var ThemeContext = /* @__PURE__ */ React$1.createContext({});
  var useTheme = function useTheme2() {
    return React$1.useContext(ThemeContext);
  };
  var getTheme = function getTheme2(outerTheme, theme2) {
    if (typeof theme2 === "function") {
      var mergedTheme = theme2(outerTheme);
      return mergedTheme;
    }
    return _extends$1({}, outerTheme, theme2);
  };
  var createCacheWithTheme = /* @__PURE__ */ weakMemoize(function(outerTheme) {
    return weakMemoize(function(theme2) {
      return getTheme(outerTheme, theme2);
    });
  });
  var ThemeProvider = function ThemeProvider2(props) {
    var theme2 = React$1.useContext(ThemeContext);
    if (props.theme !== theme2) {
      theme2 = createCacheWithTheme(theme2)(props.theme);
    }
    return /* @__PURE__ */ React$1.createElement(ThemeContext.Provider, {
      value: theme2
    }, props.children);
  };
  var Global = /* @__PURE__ */ withEmotionCache(function(props, cache) {
    var styles2 = props.styles;
    var serialized = serializeStyles([styles2], void 0, React$1.useContext(ThemeContext));
    var sheetRef = React$1.useRef();
    useInsertionEffectWithLayoutFallback(function() {
      var key = cache.key + "-global";
      var sheet = new cache.sheet.constructor({
        key,
        nonce: cache.sheet.nonce,
        container: cache.sheet.container,
        speedy: cache.sheet.isSpeedy
      });
      var rehydrating = false;
      var node2 = document.querySelector('style[data-emotion="' + key + " " + serialized.name + '"]');
      if (cache.sheet.tags.length) {
        sheet.before = cache.sheet.tags[0];
      }
      if (node2 !== null) {
        rehydrating = true;
        node2.setAttribute("data-emotion", key);
        sheet.hydrate([node2]);
      }
      sheetRef.current = [sheet, rehydrating];
      return function() {
        sheet.flush();
      };
    }, [cache]);
    useInsertionEffectWithLayoutFallback(function() {
      var sheetRefCurrent = sheetRef.current;
      var sheet = sheetRefCurrent[0], rehydrating = sheetRefCurrent[1];
      if (rehydrating) {
        sheetRefCurrent[1] = false;
        return;
      }
      if (serialized.next !== void 0) {
        insertStyles(cache, serialized.next, true);
      }
      if (sheet.tags.length) {
        var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
        sheet.before = element;
        sheet.flush();
      }
      cache.insert("", serialized, sheet, false);
    }, [cache, serialized.name]);
    return null;
  });
  function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return serializeStyles(args);
  }
  class ErrorBoundary extends React$1.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    componentDidCatch(error, info) {
      console.error(error, info.componentStack);
    }
    render() {
      if (this.state.hasError) {
        return this.props.fallback;
      }
      return this.props.children;
    }
  }
  var cjsExports = {};
  var cjs = {
    get exports() {
      return cjsExports;
    },
    set exports(v2) {
      cjsExports = v2;
    }
  };
  var Draggable$2 = {};
  var propTypesExports = {};
  var propTypes = {
    get exports() {
      return propTypesExports;
    },
    set exports(v2) {
      propTypesExports = v2;
    }
  };
  var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
  var ReactPropTypesSecret = ReactPropTypesSecret_1;
  function emptyFunction() {
  }
  function emptyFunctionWithReset() {
  }
  emptyFunctionWithReset.resetWarningCache = emptyFunction;
  var factoryWithThrowingShims = function() {
    function shim2(props, propName, componentName, location2, propFullName, secret) {
      if (secret === ReactPropTypesSecret) {
        return;
      }
      var err = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      err.name = "Invariant Violation";
      throw err;
    }
    shim2.isRequired = shim2;
    function getShim() {
      return shim2;
    }
    var ReactPropTypes = {
      array: shim2,
      bigint: shim2,
      bool: shim2,
      func: shim2,
      number: shim2,
      object: shim2,
      string: shim2,
      symbol: shim2,
      any: shim2,
      arrayOf: getShim,
      element: shim2,
      elementType: shim2,
      instanceOf: getShim,
      node: shim2,
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
  function r$3(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2)
      n2 += e2;
    else if ("object" == typeof e2)
      if (Array.isArray(e2))
        for (t2 = 0; t2 < e2.length; t2++)
          e2[t2] && (f2 = r$3(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
      else
        for (t2 in e2)
          e2[t2] && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function clsx() {
    for (var e2, t2, f2 = 0, n2 = ""; f2 < arguments.length; )
      (e2 = arguments[f2++]) && (t2 = r$3(e2)) && (n2 && (n2 += " "), n2 += t2);
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
  shims.isFunction = isFunction$1;
  shims.isNum = isNum;
  function findInArray(array, callback) {
    for (var i2 = 0, length2 = array.length; i2 < length2; i2++) {
      if (callback.apply(callback, [array[i2], i2, array]))
        return array[i2];
    }
  }
  function isFunction$1(func) {
    return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
  }
  function isNum(num) {
    return typeof num === "number" && !isNaN(num);
  }
  function int(a2) {
    return parseInt(a2, 10);
  }
  function dontSetMe(props, propName, componentName) {
    if (props[propName]) {
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
  var prefixes = ["Moz", "Webkit", "O", "ms"];
  function getPrefix() {
    var _window$document, _window$document$docu;
    var prop = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
    if (typeof window === "undefined")
      return "";
    var style = (_window$document = window.document) === null || _window$document === void 0 ? void 0 : (_window$document$docu = _window$document.documentElement) === null || _window$document$docu === void 0 ? void 0 : _window$document$docu.style;
    if (!style)
      return "";
    if (prop in style)
      return "";
    for (var i2 = 0; i2 < prefixes.length; i2++) {
      if (browserPrefixToKey(prop, prefixes[i2]) in style)
        return prefixes[i2];
    }
    return "";
  }
  function browserPrefixToKey(prop, prefix2) {
    return prefix2 ? "".concat(prefix2).concat(kebabToTitleCase(prop)) : prop;
  }
  function browserPrefixToStyle(prop, prefix2) {
    return prefix2 ? "-".concat(prefix2.toLowerCase(), "-").concat(prop) : prop;
  }
  function kebabToTitleCase(str) {
    var out = "";
    var shouldCapitalize = true;
    for (var i2 = 0; i2 < str.length; i2++) {
      if (shouldCapitalize) {
        out += str[i2].toUpperCase();
        shouldCapitalize = false;
      } else if (str[i2] === "-") {
        shouldCapitalize = true;
      } else {
        out += str[i2];
      }
    }
    return out;
  }
  var _default = getPrefix();
  getPrefix$1.default = _default;
  function _typeof$1(obj) {
    "@babel/helpers - typeof";
    return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof$1(obj);
  }
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
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache$1 = function _getRequireWildcardCache2(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard$1(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || _typeof$1(obj) !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache$1(nodeInterop);
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$1(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys$1(Object(source), true).forEach(function(key) {
        _defineProperty$2(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty$2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var matchesSelectorFunc = "";
  function matchesSelector(el, selector) {
    if (!matchesSelectorFunc) {
      matchesSelectorFunc = (0, _shims$2.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(method) {
        return (0, _shims$2.isFunction)(el[method]);
      });
    }
    if (!(0, _shims$2.isFunction)(el[matchesSelectorFunc]))
      return false;
    return el[matchesSelectorFunc](selector);
  }
  function matchesSelectorAndParentsTo(el, selector, baseNode) {
    var node2 = el;
    do {
      if (matchesSelector(node2, selector))
        return true;
      if (node2 === baseNode)
        return false;
      node2 = node2.parentNode;
    } while (node2);
    return false;
  }
  function addEvent(el, event, handler, inputOptions) {
    if (!el)
      return;
    var options = _objectSpread$1({
      capture: true
    }, inputOptions);
    if (el.addEventListener) {
      el.addEventListener(event, handler, options);
    } else if (el.attachEvent) {
      el.attachEvent("on" + event, handler);
    } else {
      el["on" + event] = handler;
    }
  }
  function removeEvent(el, event, handler, inputOptions) {
    if (!el)
      return;
    var options = _objectSpread$1({
      capture: true
    }, inputOptions);
    if (el.removeEventListener) {
      el.removeEventListener(event, handler, options);
    } else if (el.detachEvent) {
      el.detachEvent("on" + event, handler);
    } else {
      el["on" + event] = null;
    }
  }
  function outerHeight(node2) {
    var height = node2.clientHeight;
    var computedStyle = node2.ownerDocument.defaultView.getComputedStyle(node2);
    height += (0, _shims$2.int)(computedStyle.borderTopWidth);
    height += (0, _shims$2.int)(computedStyle.borderBottomWidth);
    return height;
  }
  function outerWidth(node2) {
    var width = node2.clientWidth;
    var computedStyle = node2.ownerDocument.defaultView.getComputedStyle(node2);
    width += (0, _shims$2.int)(computedStyle.borderLeftWidth);
    width += (0, _shims$2.int)(computedStyle.borderRightWidth);
    return width;
  }
  function innerHeight(node2) {
    var height = node2.clientHeight;
    var computedStyle = node2.ownerDocument.defaultView.getComputedStyle(node2);
    height -= (0, _shims$2.int)(computedStyle.paddingTop);
    height -= (0, _shims$2.int)(computedStyle.paddingBottom);
    return height;
  }
  function innerWidth(node2) {
    var width = node2.clientWidth;
    var computedStyle = node2.ownerDocument.defaultView.getComputedStyle(node2);
    width -= (0, _shims$2.int)(computedStyle.paddingLeft);
    width -= (0, _shims$2.int)(computedStyle.paddingRight);
    return width;
  }
  function offsetXYFromParent(evt, offsetParent, scale) {
    var isBody = offsetParent === offsetParent.ownerDocument.body;
    var offsetParentRect = isBody ? {
      left: 0,
      top: 0
    } : offsetParent.getBoundingClientRect();
    var x2 = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
    var y2 = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
    return {
      x: x2,
      y: y2
    };
  }
  function createCSSTransform(controlPos, positionOffset) {
    var translation = getTranslation(controlPos, positionOffset, "px");
    return _defineProperty$2({}, (0, _getPrefix.browserPrefixToKey)("transform", _getPrefix.default), translation);
  }
  function createSVGTransform(controlPos, positionOffset) {
    var translation = getTranslation(controlPos, positionOffset, "");
    return translation;
  }
  function getTranslation(_ref2, positionOffset, unitSuffix) {
    var x2 = _ref2.x, y2 = _ref2.y;
    var translation = "translate(".concat(x2).concat(unitSuffix, ",").concat(y2).concat(unitSuffix, ")");
    if (positionOffset) {
      var defaultX = "".concat(typeof positionOffset.x === "string" ? positionOffset.x : positionOffset.x + unitSuffix);
      var defaultY = "".concat(typeof positionOffset.y === "string" ? positionOffset.y : positionOffset.y + unitSuffix);
      translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
    }
    return translation;
  }
  function getTouch(e2, identifier2) {
    return e2.targetTouches && (0, _shims$2.findInArray)(e2.targetTouches, function(t2) {
      return identifier2 === t2.identifier;
    }) || e2.changedTouches && (0, _shims$2.findInArray)(e2.changedTouches, function(t2) {
      return identifier2 === t2.identifier;
    });
  }
  function getTouchIdentifier(e2) {
    if (e2.targetTouches && e2.targetTouches[0])
      return e2.targetTouches[0].identifier;
    if (e2.changedTouches && e2.changedTouches[0])
      return e2.changedTouches[0].identifier;
  }
  function addUserSelectStyles(doc) {
    if (!doc)
      return;
    var styleEl = doc.getElementById("react-draggable-style-el");
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.type = "text/css";
      styleEl.id = "react-draggable-style-el";
      styleEl.innerHTML = ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n";
      styleEl.innerHTML += ".react-draggable-transparent-selection *::selection {all: inherit;}\n";
      doc.getElementsByTagName("head")[0].appendChild(styleEl);
    }
    if (doc.body)
      addClassName(doc.body, "react-draggable-transparent-selection");
  }
  function removeUserSelectStyles(doc) {
    if (!doc)
      return;
    try {
      if (doc.body)
        removeClassName(doc.body, "react-draggable-transparent-selection");
      if (doc.selection) {
        doc.selection.empty();
      } else {
        var selection = (doc.defaultView || window).getSelection();
        if (selection && selection.type !== "Caret") {
          selection.removeAllRanges();
        }
      }
    } catch (e2) {
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
  function getBoundPosition(draggable, x2, y2) {
    if (!draggable.props.bounds)
      return [x2, y2];
    var bounds = draggable.props.bounds;
    bounds = typeof bounds === "string" ? bounds : cloneBounds(bounds);
    var node2 = findDOMNode(draggable);
    if (typeof bounds === "string") {
      var ownerDocument = node2.ownerDocument;
      var ownerWindow = ownerDocument.defaultView;
      var boundNode;
      if (bounds === "parent") {
        boundNode = node2.parentNode;
      } else {
        boundNode = ownerDocument.querySelector(bounds);
      }
      if (!(boundNode instanceof ownerWindow.HTMLElement)) {
        throw new Error('Bounds selector "' + bounds + '" could not find an element.');
      }
      var boundNodeEl = boundNode;
      var nodeStyle = ownerWindow.getComputedStyle(node2);
      var boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
      bounds = {
        left: -node2.offsetLeft + (0, _shims$1.int)(boundNodeStyle.paddingLeft) + (0, _shims$1.int)(nodeStyle.marginLeft),
        top: -node2.offsetTop + (0, _shims$1.int)(boundNodeStyle.paddingTop) + (0, _shims$1.int)(nodeStyle.marginTop),
        right: (0, _domFns$1.innerWidth)(boundNodeEl) - (0, _domFns$1.outerWidth)(node2) - node2.offsetLeft + (0, _shims$1.int)(boundNodeStyle.paddingRight) - (0, _shims$1.int)(nodeStyle.marginRight),
        bottom: (0, _domFns$1.innerHeight)(boundNodeEl) - (0, _domFns$1.outerHeight)(node2) - node2.offsetTop + (0, _shims$1.int)(boundNodeStyle.paddingBottom) - (0, _shims$1.int)(nodeStyle.marginBottom)
      };
    }
    if ((0, _shims$1.isNum)(bounds.right))
      x2 = Math.min(x2, bounds.right);
    if ((0, _shims$1.isNum)(bounds.bottom))
      y2 = Math.min(y2, bounds.bottom);
    if ((0, _shims$1.isNum)(bounds.left))
      x2 = Math.max(x2, bounds.left);
    if ((0, _shims$1.isNum)(bounds.top))
      y2 = Math.max(y2, bounds.top);
    return [x2, y2];
  }
  function snapToGrid(grid, pendingX, pendingY) {
    var x2 = Math.round(pendingX / grid[0]) * grid[0];
    var y2 = Math.round(pendingY / grid[1]) * grid[1];
    return [x2, y2];
  }
  function canDragX(draggable) {
    return draggable.props.axis === "both" || draggable.props.axis === "x";
  }
  function canDragY(draggable) {
    return draggable.props.axis === "both" || draggable.props.axis === "y";
  }
  function getControlPosition(e2, touchIdentifier, draggableCore) {
    var touchObj = typeof touchIdentifier === "number" ? (0, _domFns$1.getTouch)(e2, touchIdentifier) : null;
    if (typeof touchIdentifier === "number" && !touchObj)
      return null;
    var node2 = findDOMNode(draggableCore);
    var offsetParent = draggableCore.props.offsetParent || node2.offsetParent || node2.ownerDocument.body;
    return (0, _domFns$1.offsetXYFromParent)(touchObj || e2, offsetParent, draggableCore.props.scale);
  }
  function createCoreData(draggable, x2, y2) {
    var state = draggable.state;
    var isStart = !(0, _shims$1.isNum)(state.lastX);
    var node2 = findDOMNode(draggable);
    if (isStart) {
      return {
        node: node2,
        deltaX: 0,
        deltaY: 0,
        lastX: x2,
        lastY: y2,
        x: x2,
        y: y2
      };
    } else {
      return {
        node: node2,
        deltaX: x2 - state.lastX,
        deltaY: y2 - state.lastY,
        lastX: state.lastX,
        lastY: state.lastY,
        x: x2,
        y: y2
      };
    }
  }
  function createDraggableData(draggable, coreData) {
    var scale = draggable.props.scale;
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
    var node2 = draggable.findDOMNode();
    if (!node2) {
      throw new Error("<DraggableCore>: Unmounted during event!");
    }
    return node2;
  }
  var DraggableCore$2 = {};
  var log$1 = {};
  Object.defineProperty(log$1, "__esModule", {
    value: true
  });
  log$1.default = log;
  function log() {
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
  }
  Object.defineProperty(DraggableCore$2, "__esModule", {
    value: true
  });
  DraggableCore$2.default = void 0;
  var React2 = _interopRequireWildcard(React$1);
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
    if (typeof WeakMap !== "function")
      return null;
    var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
    var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
      return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
  }
  function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
      return obj;
    }
    if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
      return { default: obj };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
  function _slicedToArray(arr, i2) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o2, minLen) {
    if (!o2)
      return;
    if (typeof o2 === "string")
      return _arrayLikeToArray(o2, minLen);
    var n2 = Object.prototype.toString.call(o2).slice(8, -1);
    if (n2 === "Object" && o2.constructor)
      n2 = o2.constructor.name;
    if (n2 === "Map" || n2 === "Set")
      return Array.from(o2);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
      return _arrayLikeToArray(o2, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
      arr2[i2] = arr[i2];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i2) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n2 = true;
    var _d2 = false;
    var _s, _e2;
    try {
      for (_i = _i.call(arr); !(_n2 = (_s = _i.next()).done); _n2 = true) {
        _arr.push(_s.value);
        if (i2 && _arr.length === i2)
          break;
      }
    } catch (err) {
      _d2 = true;
      _e2 = err;
    } finally {
      try {
        if (!_n2 && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d2)
          throw _e2;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i2 = 0; i2 < props.length; i2++) {
      var descriptor = props[i2];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
    Object.defineProperty(subClass, "prototype", { writable: false });
    if (superClass)
      _setPrototypeOf(subClass, superClass);
  }
  function _setPrototypeOf(o2, p2) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p3) {
      o3.__proto__ = p3;
      return o3;
    };
    return _setPrototypeOf(o2, p2);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _possibleConstructorReturn(self2, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self2);
  }
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e2) {
      return false;
    }
  }
  function _getPrototypeOf(o2) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
      return o3.__proto__ || Object.getPrototypeOf(o3);
    };
    return _getPrototypeOf(o2);
  }
  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var eventsFor = {
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
  var dragEventFor = eventsFor.mouse;
  var DraggableCore$1 = /* @__PURE__ */ function(_React$Component) {
    _inherits(DraggableCore2, _React$Component);
    var _super = _createSuper(DraggableCore2);
    function DraggableCore2() {
      var _this;
      _classCallCheck(this, DraggableCore2);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _super.call.apply(_super, [this].concat(args));
      _defineProperty$1(_assertThisInitialized(_this), "state", {
        dragging: false,
        // Used while dragging to determine deltas.
        lastX: NaN,
        lastY: NaN,
        touchIdentifier: null
      });
      _defineProperty$1(_assertThisInitialized(_this), "mounted", false);
      _defineProperty$1(_assertThisInitialized(_this), "handleDragStart", function(e2) {
        _this.props.onMouseDown(e2);
        if (!_this.props.allowAnyClick && typeof e2.button === "number" && e2.button !== 0)
          return false;
        var thisNode = _this.findDOMNode();
        if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
          throw new Error("<DraggableCore> not mounted on DragStart!");
        }
        var ownerDocument = thisNode.ownerDocument;
        if (_this.props.disabled || !(e2.target instanceof ownerDocument.defaultView.Node) || _this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e2.target, _this.props.handle, thisNode) || _this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e2.target, _this.props.cancel, thisNode)) {
          return;
        }
        if (e2.type === "touchstart")
          e2.preventDefault();
        var touchIdentifier = (0, _domFns.getTouchIdentifier)(e2);
        _this.setState({
          touchIdentifier
        });
        var position2 = (0, _positionFns.getControlPosition)(e2, touchIdentifier, _assertThisInitialized(_this));
        if (position2 == null)
          return;
        var x2 = position2.x, y2 = position2.y;
        var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x2, y2);
        (0, _log.default)("DraggableCore: handleDragStart: %j", coreEvent);
        (0, _log.default)("calling", _this.props.onStart);
        var shouldUpdate = _this.props.onStart(e2, coreEvent);
        if (shouldUpdate === false || _this.mounted === false)
          return;
        if (_this.props.enableUserSelectHack)
          (0, _domFns.addUserSelectStyles)(ownerDocument);
        _this.setState({
          dragging: true,
          lastX: x2,
          lastY: y2
        });
        (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, _this.handleDrag);
        (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, _this.handleDragStop);
      });
      _defineProperty$1(_assertThisInitialized(_this), "handleDrag", function(e2) {
        var position2 = (0, _positionFns.getControlPosition)(e2, _this.state.touchIdentifier, _assertThisInitialized(_this));
        if (position2 == null)
          return;
        var x2 = position2.x, y2 = position2.y;
        if (Array.isArray(_this.props.grid)) {
          var deltaX = x2 - _this.state.lastX, deltaY = y2 - _this.state.lastY;
          var _snapToGrid = (0, _positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);
          var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);
          deltaX = _snapToGrid2[0];
          deltaY = _snapToGrid2[1];
          if (!deltaX && !deltaY)
            return;
          x2 = _this.state.lastX + deltaX, y2 = _this.state.lastY + deltaY;
        }
        var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x2, y2);
        (0, _log.default)("DraggableCore: handleDrag: %j", coreEvent);
        var shouldUpdate = _this.props.onDrag(e2, coreEvent);
        if (shouldUpdate === false || _this.mounted === false) {
          try {
            _this.handleDragStop(new MouseEvent("mouseup"));
          } catch (err) {
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            _this.handleDragStop(event);
          }
          return;
        }
        _this.setState({
          lastX: x2,
          lastY: y2
        });
      });
      _defineProperty$1(_assertThisInitialized(_this), "handleDragStop", function(e2) {
        if (!_this.state.dragging)
          return;
        var position2 = (0, _positionFns.getControlPosition)(e2, _this.state.touchIdentifier, _assertThisInitialized(_this));
        if (position2 == null)
          return;
        var x2 = position2.x, y2 = position2.y;
        if (Array.isArray(_this.props.grid)) {
          var deltaX = x2 - _this.state.lastX || 0;
          var deltaY = y2 - _this.state.lastY || 0;
          var _snapToGrid3 = (0, _positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);
          var _snapToGrid4 = _slicedToArray(_snapToGrid3, 2);
          deltaX = _snapToGrid4[0];
          deltaY = _snapToGrid4[1];
          x2 = _this.state.lastX + deltaX, y2 = _this.state.lastY + deltaY;
        }
        var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x2, y2);
        var shouldContinue = _this.props.onStop(e2, coreEvent);
        if (shouldContinue === false || _this.mounted === false)
          return false;
        var thisNode = _this.findDOMNode();
        if (thisNode) {
          if (_this.props.enableUserSelectHack)
            (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
        }
        (0, _log.default)("DraggableCore: handleDragStop: %j", coreEvent);
        _this.setState({
          dragging: false,
          lastX: NaN,
          lastY: NaN
        });
        if (thisNode) {
          (0, _log.default)("DraggableCore: Removing handlers");
          (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, _this.handleDrag);
          (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, _this.handleDragStop);
        }
      });
      _defineProperty$1(_assertThisInitialized(_this), "onMouseDown", function(e2) {
        dragEventFor = eventsFor.mouse;
        return _this.handleDragStart(e2);
      });
      _defineProperty$1(_assertThisInitialized(_this), "onMouseUp", function(e2) {
        dragEventFor = eventsFor.mouse;
        return _this.handleDragStop(e2);
      });
      _defineProperty$1(_assertThisInitialized(_this), "onTouchStart", function(e2) {
        dragEventFor = eventsFor.touch;
        return _this.handleDragStart(e2);
      });
      _defineProperty$1(_assertThisInitialized(_this), "onTouchEnd", function(e2) {
        dragEventFor = eventsFor.touch;
        return _this.handleDragStop(e2);
      });
      return _this;
    }
    _createClass(DraggableCore2, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.mounted = true;
        var thisNode = this.findDOMNode();
        if (thisNode) {
          (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
            passive: false
          });
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.mounted = false;
        var thisNode = this.findDOMNode();
        if (thisNode) {
          var ownerDocument = thisNode.ownerDocument;
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
          (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
          (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
            passive: false
          });
          if (this.props.enableUserSelectHack)
            (0, _domFns.removeUserSelectStyles)(ownerDocument);
        }
      }
      // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
      // the underlying DOM node ourselves. See the README for more information.
    }, {
      key: "findDOMNode",
      value: function findDOMNode2() {
        var _this$props, _this$props2, _this$props2$nodeRef;
        return (_this$props = this.props) !== null && _this$props !== void 0 && _this$props.nodeRef ? (_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : (_this$props2$nodeRef = _this$props2.nodeRef) === null || _this$props2$nodeRef === void 0 ? void 0 : _this$props2$nodeRef.current : _reactDom.default.findDOMNode(this);
      }
    }, {
      key: "render",
      value: function render() {
        return /* @__PURE__ */ React2.cloneElement(React2.Children.only(this.props.children), {
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
    }]);
    return DraggableCore2;
  }(React2.Component);
  DraggableCore$2.default = DraggableCore$1;
  _defineProperty$1(DraggableCore$1, "displayName", "DraggableCore");
  _defineProperty$1(DraggableCore$1, "propTypes", {
    /**
     * `allowAnyClick` allows dragging using any mouse button.
     * By default, we only accept the left button.
     *
     * Defaults to `false`.
     */
    allowAnyClick: _propTypes.default.bool,
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
    offsetParent: function offsetParent(props, propName) {
      if (props[propName] && props[propName].nodeType !== 1) {
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
  _defineProperty$1(DraggableCore$1, "defaultProps", {
    allowAnyClick: false,
    // by default only accept left click
    disabled: false,
    enableUserSelectHack: true,
    onStart: function onStart() {
    },
    onDrag: function onDrag() {
    },
    onStop: function onStop() {
    },
    onMouseDown: function onMouseDown() {
    },
    scale: 1
  });
  (function(exports) {
    function _typeof2(obj) {
      "@babel/helpers - typeof";
      return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
        return typeof obj2;
      } : function(obj2) {
        return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      }, _typeof2(obj);
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "DraggableCore", {
      enumerable: true,
      get: function get() {
        return _DraggableCore.default;
      }
    });
    exports.default = void 0;
    var React3 = _interopRequireWildcard2(React$1);
    var _propTypes2 = _interopRequireDefault2(propTypesExports);
    var _reactDom2 = _interopRequireDefault2(require$$2);
    var _clsx2 = _interopRequireDefault2(require$$3);
    var _domFns2 = domFns;
    var _positionFns2 = positionFns;
    var _shims2 = shims;
    var _DraggableCore = _interopRequireDefault2(DraggableCore$2);
    var _log2 = _interopRequireDefault2(log$1);
    var _excluded2 = ["axis", "bounds", "children", "defaultPosition", "defaultClassName", "defaultClassNameDragging", "defaultClassNameDragged", "position", "positionOffset", "scale"];
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _getRequireWildcardCache2(nodeInterop) {
      if (typeof WeakMap !== "function")
        return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache2 = function _getRequireWildcardCache3(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      })(nodeInterop);
    }
    function _interopRequireWildcard2(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
        return { default: obj };
      }
      var cache = _getRequireWildcardCache2(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    function _extends2() {
      _extends2 = Object.assign || function(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends2.apply(this, arguments);
    }
    function _objectWithoutProperties2(source, excluded) {
      if (source == null)
        return {};
      var target = _objectWithoutPropertiesLoose2(source, excluded);
      var key, i2;
      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
          key = sourceSymbolKeys[i2];
          if (excluded.indexOf(key) >= 0)
            continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
          target[key] = source[key];
        }
      }
      return target;
    }
    function _objectWithoutPropertiesLoose2(source, excluded) {
      if (source == null)
        return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i2;
      for (i2 = 0; i2 < sourceKeys.length; i2++) {
        key = sourceKeys[i2];
        if (excluded.indexOf(key) >= 0)
          continue;
        target[key] = source[key];
      }
      return target;
    }
    function ownKeys2(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = null != arguments[i2] ? arguments[i2] : {};
        i2 % 2 ? ownKeys2(Object(source), true).forEach(function(key) {
          _defineProperty2(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys2(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _slicedToArray2(arr, i2) {
      return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i2) || _unsupportedIterableToArray2(arr, i2) || _nonIterableRest2();
    }
    function _nonIterableRest2() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray2(o2, minLen) {
      if (!o2)
        return;
      if (typeof o2 === "string")
        return _arrayLikeToArray2(o2, minLen);
      var n2 = Object.prototype.toString.call(o2).slice(8, -1);
      if (n2 === "Object" && o2.constructor)
        n2 = o2.constructor.name;
      if (n2 === "Map" || n2 === "Set")
        return Array.from(o2);
      if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
        return _arrayLikeToArray2(o2, minLen);
    }
    function _arrayLikeToArray2(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
        arr2[i2] = arr[i2];
      }
      return arr2;
    }
    function _iterableToArrayLimit2(arr, i2) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null)
        return;
      var _arr = [];
      var _n2 = true;
      var _d2 = false;
      var _s, _e2;
      try {
        for (_i = _i.call(arr); !(_n2 = (_s = _i.next()).done); _n2 = true) {
          _arr.push(_s.value);
          if (i2 && _arr.length === i2)
            break;
        }
      } catch (err) {
        _d2 = true;
        _e2 = err;
      } finally {
        try {
          if (!_n2 && _i["return"] != null)
            _i["return"]();
        } finally {
          if (_d2)
            throw _e2;
        }
      }
      return _arr;
    }
    function _arrayWithHoles2(arr) {
      if (Array.isArray(arr))
        return arr;
    }
    function _classCallCheck2(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties2(target, props) {
      for (var i2 = 0; i2 < props.length; i2++) {
        var descriptor = props[i2];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass2(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties2(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties2(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _inherits2(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      Object.defineProperty(subClass, "prototype", { writable: false });
      if (superClass)
        _setPrototypeOf2(subClass, superClass);
    }
    function _setPrototypeOf2(o2, p2) {
      _setPrototypeOf2 = Object.setPrototypeOf || function _setPrototypeOf3(o3, p3) {
        o3.__proto__ = p3;
        return o3;
      };
      return _setPrototypeOf2(o2, p2);
    }
    function _createSuper2(Derived) {
      var hasNativeReflectConstruct = _isNativeReflectConstruct2();
      return function _createSuperInternal() {
        var Super = _getPrototypeOf2(Derived), result;
        if (hasNativeReflectConstruct) {
          var NewTarget = _getPrototypeOf2(this).constructor;
          result = Reflect.construct(Super, arguments, NewTarget);
        } else {
          result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn2(this, result);
      };
    }
    function _possibleConstructorReturn2(self2, call) {
      if (call && (_typeof2(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return _assertThisInitialized2(self2);
    }
    function _assertThisInitialized2(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _isNativeReflectConstruct2() {
      if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy === "function")
        return true;
      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
      } catch (e2) {
        return false;
      }
    }
    function _getPrototypeOf2(o2) {
      _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf3(o3) {
        return o3.__proto__ || Object.getPrototypeOf(o3);
      };
      return _getPrototypeOf2(o2);
    }
    function _defineProperty2(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var Draggable2 = /* @__PURE__ */ function(_React$Component) {
      _inherits2(Draggable3, _React$Component);
      var _super = _createSuper2(Draggable3);
      function Draggable3(props) {
        var _this;
        _classCallCheck2(this, Draggable3);
        _this = _super.call(this, props);
        _defineProperty2(_assertThisInitialized2(_this), "onDragStart", function(e2, coreData) {
          (0, _log2.default)("Draggable: onDragStart: %j", coreData);
          var shouldStart = _this.props.onStart(e2, (0, _positionFns2.createDraggableData)(_assertThisInitialized2(_this), coreData));
          if (shouldStart === false)
            return false;
          _this.setState({
            dragging: true,
            dragged: true
          });
        });
        _defineProperty2(_assertThisInitialized2(_this), "onDrag", function(e2, coreData) {
          if (!_this.state.dragging)
            return false;
          (0, _log2.default)("Draggable: onDrag: %j", coreData);
          var uiData = (0, _positionFns2.createDraggableData)(_assertThisInitialized2(_this), coreData);
          var newState = {
            x: uiData.x,
            y: uiData.y
          };
          if (_this.props.bounds) {
            var x2 = newState.x, y2 = newState.y;
            newState.x += _this.state.slackX;
            newState.y += _this.state.slackY;
            var _getBoundPosition = (0, _positionFns2.getBoundPosition)(_assertThisInitialized2(_this), newState.x, newState.y), _getBoundPosition2 = _slicedToArray2(_getBoundPosition, 2), newStateX = _getBoundPosition2[0], newStateY = _getBoundPosition2[1];
            newState.x = newStateX;
            newState.y = newStateY;
            newState.slackX = _this.state.slackX + (x2 - newState.x);
            newState.slackY = _this.state.slackY + (y2 - newState.y);
            uiData.x = newState.x;
            uiData.y = newState.y;
            uiData.deltaX = newState.x - _this.state.x;
            uiData.deltaY = newState.y - _this.state.y;
          }
          var shouldUpdate = _this.props.onDrag(e2, uiData);
          if (shouldUpdate === false)
            return false;
          _this.setState(newState);
        });
        _defineProperty2(_assertThisInitialized2(_this), "onDragStop", function(e2, coreData) {
          if (!_this.state.dragging)
            return false;
          var shouldContinue = _this.props.onStop(e2, (0, _positionFns2.createDraggableData)(_assertThisInitialized2(_this), coreData));
          if (shouldContinue === false)
            return false;
          (0, _log2.default)("Draggable: onDragStop: %j", coreData);
          var newState = {
            dragging: false,
            slackX: 0,
            slackY: 0
          };
          var controlled = Boolean(_this.props.position);
          if (controlled) {
            var _this$props$position = _this.props.position, x2 = _this$props$position.x, y2 = _this$props$position.y;
            newState.x = x2;
            newState.y = y2;
          }
          _this.setState(newState);
        });
        _this.state = {
          // Whether or not we are currently dragging.
          dragging: false,
          // Whether or not we have been dragged before.
          dragged: false,
          // Current transform x and y.
          x: props.position ? props.position.x : props.defaultPosition.x,
          y: props.position ? props.position.y : props.defaultPosition.y,
          prevPropsPosition: _objectSpread2({}, props.position),
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: false
        };
        if (props.position && !(props.onDrag || props.onStop)) {
          console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
        }
        return _this;
      }
      _createClass2(Draggable3, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          if (typeof window.SVGElement !== "undefined" && this.findDOMNode() instanceof window.SVGElement) {
            this.setState({
              isElementSVG: true
            });
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.setState({
            dragging: false
          });
        }
        // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
        // the underlying DOM node ourselves. See the README for more information.
      }, {
        key: "findDOMNode",
        value: function findDOMNode2() {
          var _this$props$nodeRef$c, _this$props, _this$props$nodeRef;
          return (_this$props$nodeRef$c = (_this$props = this.props) === null || _this$props === void 0 ? void 0 : (_this$props$nodeRef = _this$props.nodeRef) === null || _this$props$nodeRef === void 0 ? void 0 : _this$props$nodeRef.current) !== null && _this$props$nodeRef$c !== void 0 ? _this$props$nodeRef$c : _reactDom2.default.findDOMNode(this);
        }
      }, {
        key: "render",
        value: function render() {
          var _clsx;
          var _this$props2 = this.props;
          _this$props2.axis;
          _this$props2.bounds;
          var children = _this$props2.children, defaultPosition = _this$props2.defaultPosition, defaultClassName = _this$props2.defaultClassName, defaultClassNameDragging = _this$props2.defaultClassNameDragging, defaultClassNameDragged = _this$props2.defaultClassNameDragged, position2 = _this$props2.position, positionOffset = _this$props2.positionOffset;
          _this$props2.scale;
          var draggableCoreProps = _objectWithoutProperties2(_this$props2, _excluded2);
          var style = {};
          var svgTransform = null;
          var controlled = Boolean(position2);
          var draggable = !controlled || this.state.dragging;
          var validPosition = position2 || defaultPosition;
          var transformOpts = {
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
          var className = (0, _clsx2.default)(children.props.className || "", defaultClassName, (_clsx = {}, _defineProperty2(_clsx, defaultClassNameDragging, this.state.dragging), _defineProperty2(_clsx, defaultClassNameDragged, this.state.dragged), _clsx));
          return /* @__PURE__ */ React3.createElement(_DraggableCore.default, _extends2({}, draggableCoreProps, {
            onStart: this.onDragStart,
            onDrag: this.onDrag,
            onStop: this.onDragStop
          }), /* @__PURE__ */ React3.cloneElement(React3.Children.only(children), {
            className,
            style: _objectSpread2(_objectSpread2({}, children.props.style), style),
            transform: svgTransform
          }));
        }
      }], [{
        key: "getDerivedStateFromProps",
        value: (
          // React 16.3+
          // Arity (props, state)
          function getDerivedStateFromProps(_ref, _ref2) {
            var position2 = _ref.position;
            var prevPropsPosition = _ref2.prevPropsPosition;
            if (position2 && (!prevPropsPosition || position2.x !== prevPropsPosition.x || position2.y !== prevPropsPosition.y)) {
              (0, _log2.default)("Draggable: getDerivedStateFromProps %j", {
                position: position2,
                prevPropsPosition
              });
              return {
                x: position2.x,
                y: position2.y,
                prevPropsPosition: _objectSpread2({}, position2)
              };
            }
            return null;
          }
        )
      }]);
      return Draggable3;
    }(React3.Component);
    exports.default = Draggable2;
    _defineProperty2(Draggable2, "displayName", "Draggable");
    _defineProperty2(Draggable2, "propTypes", _objectSpread2(_objectSpread2({}, _DraggableCore.default.propTypes), {}, {
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
    }));
    _defineProperty2(Draggable2, "defaultProps", _objectSpread2(_objectSpread2({}, _DraggableCore.default.defaultProps), {}, {
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
    }));
  })(Draggable$2);
  var _require = Draggable$2, Draggable$1 = _require.default, DraggableCore = _require.DraggableCore;
  cjs.exports = Draggable$1;
  cjsExports.default = Draggable$1;
  cjsExports.DraggableCore = DraggableCore;
  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
  var isPropValid = /* @__PURE__ */ memoize$1(
    function(prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
    }
    /* Z+1 */
  );
  var testOmitPropsOnStringTag = isPropValid;
  var testOmitPropsOnComponent = function testOmitPropsOnComponent2(key) {
    return key !== "theme";
  };
  var getDefaultShouldForwardProp = function getDefaultShouldForwardProp2(tag) {
    return typeof tag === "string" && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
  };
  var composeShouldForwardProps = function composeShouldForwardProps2(tag, options, isReal) {
    var shouldForwardProp;
    if (options) {
      var optionsShouldForwardProp = options.shouldForwardProp;
      shouldForwardProp = tag.__emotion_forwardProp && optionsShouldForwardProp ? function(propName) {
        return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
      } : optionsShouldForwardProp;
    }
    if (typeof shouldForwardProp !== "function" && isReal) {
      shouldForwardProp = tag.__emotion_forwardProp;
    }
    return shouldForwardProp;
  };
  var Insertion = function Insertion2(_ref) {
    var cache = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
    registerStyles(cache, serialized, isStringTag);
    useInsertionEffectAlwaysWithSyncFallback(function() {
      return insertStyles(cache, serialized, isStringTag);
    });
    return null;
  };
  var createStyled = function createStyled2(tag, options) {
    var isReal = tag.__emotion_real === tag;
    var baseTag = isReal && tag.__emotion_base || tag;
    var identifierName;
    var targetClassName;
    if (options !== void 0) {
      identifierName = options.label;
      targetClassName = options.target;
    }
    var shouldForwardProp = composeShouldForwardProps(tag, options, isReal);
    var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
    var shouldUseAs = !defaultShouldForwardProp("as");
    return function() {
      var args = arguments;
      var styles2 = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
      if (identifierName !== void 0) {
        styles2.push("label:" + identifierName + ";");
      }
      if (args[0] == null || args[0].raw === void 0) {
        styles2.push.apply(styles2, args);
      } else {
        styles2.push(args[0][0]);
        var len = args.length;
        var i2 = 1;
        for (; i2 < len; i2++) {
          styles2.push(args[i2], args[0][i2]);
        }
      }
      var Styled = withEmotionCache(function(props, cache, ref) {
        var FinalTag = shouldUseAs && props.as || baseTag;
        var className = "";
        var classInterpolations = [];
        var mergedProps = props;
        if (props.theme == null) {
          mergedProps = {};
          for (var key in props) {
            mergedProps[key] = props[key];
          }
          mergedProps.theme = React$1.useContext(ThemeContext);
        }
        if (typeof props.className === "string") {
          className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
        } else if (props.className != null) {
          className = props.className + " ";
        }
        var serialized = serializeStyles(styles2.concat(classInterpolations), cache.registered, mergedProps);
        className += cache.key + "-" + serialized.name;
        if (targetClassName !== void 0) {
          className += " " + targetClassName;
        }
        var finalShouldForwardProp = shouldUseAs && shouldForwardProp === void 0 ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
        var newProps = {};
        for (var _key in props) {
          if (shouldUseAs && _key === "as")
            continue;
          if (
            // $FlowFixMe
            finalShouldForwardProp(_key)
          ) {
            newProps[_key] = props[_key];
          }
        }
        newProps.className = className;
        newProps.ref = ref;
        return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(Insertion, {
          cache,
          serialized,
          isStringTag: typeof FinalTag === "string"
        }), /* @__PURE__ */ React$1.createElement(FinalTag, newProps));
      });
      Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
      Styled.defaultProps = tag.defaultProps;
      Styled.__emotion_real = Styled;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_styles = styles2;
      Styled.__emotion_forwardProp = shouldForwardProp;
      Object.defineProperty(Styled, "toString", {
        value: function value() {
          if (targetClassName === void 0 && false) {
            return "NO_COMPONENT_SELECTOR";
          }
          return "." + targetClassName;
        }
      });
      Styled.withComponent = function(nextTag, nextOptions) {
        return createStyled2(nextTag, _extends$1({}, options, nextOptions, {
          shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
        })).apply(void 0, styles2);
      };
      return Styled;
    };
  };
  var tags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    // SVG
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan"
  ];
  var newStyled = createStyled.bind();
  tags.forEach(function(tagName) {
    newStyled[tagName] = newStyled(tagName);
  });
  var _excluded = ["size", "strokeWidth", "strokeLinecap", "strokeLinejoin", "theme", "fill", "className", "spin"];
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i2;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
        key = sourceSymbolKeys[i2];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i2;
    for (i2 = 0; i2 < sourceKeys.length; i2++) {
      key = sourceKeys[i2];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var DEFAULT_ICON_CONFIGS = {
    size: "1em",
    strokeWidth: 4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    rtl: false,
    theme: "outline",
    colors: {
      outline: {
        fill: "#333",
        background: "transparent"
      },
      filled: {
        fill: "#333",
        background: "#FFF"
      },
      twoTone: {
        fill: "#333",
        twoTone: "#2F88FF"
      },
      multiColor: {
        outStrokeColor: "#333",
        outFillColor: "#2F88FF",
        innerStrokeColor: "#FFF",
        innerFillColor: "#43CCF8"
      }
    },
    prefix: "i"
  };
  function guid() {
    return "icon-" + ((1 + Math.random()) * 4294967296 | 0).toString(16).substring(1);
  }
  function IconConverter(id, icon, config) {
    var fill = typeof icon.fill === "string" ? [icon.fill] : icon.fill || [];
    var colors = [];
    var theme2 = icon.theme || config.theme;
    switch (theme2) {
      case "outline":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("none");
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("none");
        break;
      case "filled":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("#FFF");
        colors.push("#FFF");
        break;
      case "two-tone":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.twoTone.twoTone);
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.twoTone.twoTone);
        break;
      case "multi-color":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.multiColor.outFillColor);
        colors.push(typeof fill[2] === "string" ? fill[2] : config.colors.multiColor.innerStrokeColor);
        colors.push(typeof fill[3] === "string" ? fill[3] : config.colors.multiColor.innerFillColor);
        break;
    }
    return {
      size: icon.size || config.size,
      strokeWidth: icon.strokeWidth || config.strokeWidth,
      strokeLinecap: icon.strokeLinecap || config.strokeLinecap,
      strokeLinejoin: icon.strokeLinejoin || config.strokeLinejoin,
      colors,
      id
    };
  }
  var IconContext = /* @__PURE__ */ React$1.createContext(DEFAULT_ICON_CONFIGS);
  IconContext.Provider;
  function IconWrapper(name, rtl, render) {
    return function(props) {
      var size = props.size, strokeWidth = props.strokeWidth, strokeLinecap = props.strokeLinecap, strokeLinejoin = props.strokeLinejoin, theme2 = props.theme, fill = props.fill, className = props.className, spin = props.spin, extra = _objectWithoutProperties(props, _excluded);
      var ICON_CONFIGS = React$1.useContext(IconContext);
      var id = React$1.useMemo(guid, []);
      var svgProps = IconConverter(id, {
        size,
        strokeWidth,
        strokeLinecap,
        strokeLinejoin,
        theme: theme2,
        fill
      }, ICON_CONFIGS);
      var cls = [ICON_CONFIGS.prefix + "-icon"];
      cls.push(ICON_CONFIGS.prefix + "-icon-" + name);
      if (rtl && ICON_CONFIGS.rtl) {
        cls.push(ICON_CONFIGS.prefix + "-icon-rtl");
      }
      if (spin) {
        cls.push(ICON_CONFIGS.prefix + "-icon-spin");
      }
      if (className) {
        cls.push(className);
      }
      return /* @__PURE__ */ React$1.createElement("span", _objectSpread(_objectSpread({}, extra), {}, {
        className: cls.join(" ")
      }), render(svgProps));
    };
  }
  const Close = IconWrapper("close", false, function(props) {
    return /* @__PURE__ */ React$1.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React$1.createElement("path", {
      d: "M8 8L40 40",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M8 40L40 8",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  var f$3 = l$4(), n$2 = (e2) => c$5(e2, f$3), m$3 = l$4();
  n$2.write = (e2) => c$5(e2, m$3);
  var d$3 = l$4();
  n$2.onStart = (e2) => c$5(e2, d$3);
  var h$5 = l$4();
  n$2.onFrame = (e2) => c$5(e2, h$5);
  var p$3 = l$4();
  n$2.onFinish = (e2) => c$5(e2, p$3);
  var i$2 = [];
  n$2.setTimeout = (e2, t2) => {
    let a2 = n$2.now() + t2, o2 = () => {
      let F2 = i$2.findIndex((z2) => z2.cancel == o2);
      ~F2 && i$2.splice(F2, 1), u$4 -= ~F2 ? 1 : 0;
    }, s2 = { time: a2, handler: e2, cancel: o2 };
    return i$2.splice(w$2(a2), 0, s2), u$4 += 1, v$3(), s2;
  };
  var w$2 = (e2) => ~(~i$2.findIndex((t2) => t2.time > e2) || ~i$2.length);
  n$2.cancel = (e2) => {
    d$3.delete(e2), h$5.delete(e2), p$3.delete(e2), f$3.delete(e2), m$3.delete(e2);
  };
  n$2.sync = (e2) => {
    T$1 = true, n$2.batchedUpdates(e2), T$1 = false;
  };
  n$2.throttle = (e2) => {
    let t2;
    function a2() {
      try {
        e2(...t2);
      } finally {
        t2 = null;
      }
    }
    function o2(...s2) {
      t2 = s2, n$2.onStart(a2);
    }
    return o2.handler = e2, o2.cancel = () => {
      d$3.delete(a2), t2 = null;
    }, o2;
  };
  var y$5 = typeof window < "u" ? window.requestAnimationFrame : () => {
  };
  n$2.use = (e2) => y$5 = e2;
  n$2.now = typeof performance < "u" ? () => performance.now() : Date.now;
  n$2.batchedUpdates = (e2) => e2();
  n$2.catch = console.error;
  n$2.frameLoop = "always";
  n$2.advance = () => {
    n$2.frameLoop !== "demand" ? console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand") : x$4();
  };
  var r$2 = -1, u$4 = 0, T$1 = false;
  function c$5(e2, t2) {
    T$1 ? (t2.delete(e2), e2(0)) : (t2.add(e2), v$3());
  }
  function v$3() {
    r$2 < 0 && (r$2 = 0, n$2.frameLoop !== "demand" && y$5(b$4));
  }
  function R$1() {
    r$2 = -1;
  }
  function b$4() {
    ~r$2 && (y$5(b$4), n$2.batchedUpdates(x$4));
  }
  function x$4() {
    let e2 = r$2;
    r$2 = n$2.now();
    let t2 = w$2(r$2);
    if (t2 && (Q$2(i$2.splice(0, t2), (a2) => a2.handler()), u$4 -= t2), !u$4) {
      R$1();
      return;
    }
    d$3.flush(), f$3.flush(e2 ? Math.min(64, r$2 - e2) : 16.667), h$5.flush(), m$3.flush(), p$3.flush();
  }
  function l$4() {
    let e2 = /* @__PURE__ */ new Set(), t2 = e2;
    return { add(a2) {
      u$4 += t2 == e2 && !e2.has(a2) ? 1 : 0, e2.add(a2);
    }, delete(a2) {
      return u$4 -= t2 == e2 && e2.has(a2) ? 1 : 0, e2.delete(a2);
    }, flush(a2) {
      t2.size && (e2 = /* @__PURE__ */ new Set(), u$4 -= t2.size, Q$2(t2, (o2) => o2(a2) && e2.add(o2)), u$4 += e2.size, t2 = e2);
    } };
  }
  function Q$2(e2, t2) {
    e2.forEach((a2) => {
      try {
        t2(a2);
      } catch (o2) {
        n$2.catch(o2);
      }
    });
  }
  var ze$1 = Object.defineProperty;
  var Le$2 = (e2, t2) => {
    for (var r2 in t2)
      ze$1(e2, r2, { get: t2[r2], enumerable: true });
  };
  var p$2 = {};
  Le$2(p$2, { assign: () => U, colors: () => c$4, createStringInterpolator: () => k$3, skipAnimation: () => ee, to: () => J$1, willAdvance: () => S$1 });
  function Y() {
  }
  var mt$1 = (e2, t2, r2) => Object.defineProperty(e2, t2, { value: r2, writable: true, configurable: true }), l$3 = { arr: Array.isArray, obj: (e2) => !!e2 && e2.constructor.name === "Object", fun: (e2) => typeof e2 == "function", str: (e2) => typeof e2 == "string", num: (e2) => typeof e2 == "number", und: (e2) => e2 === void 0 };
  function bt$1(e2, t2) {
    if (l$3.arr(e2)) {
      if (!l$3.arr(t2) || e2.length !== t2.length)
        return false;
      for (let r2 = 0; r2 < e2.length; r2++)
        if (e2[r2] !== t2[r2])
          return false;
      return true;
    }
    return e2 === t2;
  }
  var Ve = (e2, t2) => e2.forEach(t2);
  function xt(e2, t2, r2) {
    if (l$3.arr(e2)) {
      for (let n2 = 0; n2 < e2.length; n2++)
        t2.call(r2, e2[n2], `${n2}`);
      return;
    }
    for (let n2 in e2)
      e2.hasOwnProperty(n2) && t2.call(r2, e2[n2], n2);
  }
  var ht$1 = (e2) => l$3.und(e2) ? [] : l$3.arr(e2) ? e2 : [e2];
  function Pe$1(e2, t2) {
    if (e2.size) {
      let r2 = Array.from(e2);
      e2.clear(), Ve(r2, t2);
    }
  }
  var yt$1 = (e2, ...t2) => Pe$1(e2, (r2) => r2(...t2)), h$4 = () => typeof window > "u" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
  var k$3, J$1, c$4 = null, ee = false, S$1 = Y, U = (e2) => {
    e2.to && (J$1 = e2.to), e2.now && (n$2.now = e2.now), e2.colors !== void 0 && (c$4 = e2.colors), e2.skipAnimation != null && (ee = e2.skipAnimation), e2.createStringInterpolator && (k$3 = e2.createStringInterpolator), e2.requestAnimationFrame && n$2.use(e2.requestAnimationFrame), e2.batchedUpdates && (n$2.batchedUpdates = e2.batchedUpdates), e2.willAdvance && (S$1 = e2.willAdvance), e2.frameLoop && (n$2.frameLoop = e2.frameLoop);
  };
  var E$2 = /* @__PURE__ */ new Set(), u$3 = [], H$2 = [], A$1 = 0, qe$1 = { get idle() {
    return !E$2.size && !u$3.length;
  }, start(e2) {
    A$1 > e2.priority ? (E$2.add(e2), n$2.onStart($e)) : (te$1(e2), n$2(B));
  }, advance: B, sort(e2) {
    if (A$1)
      n$2.onFrame(() => qe$1.sort(e2));
    else {
      let t2 = u$3.indexOf(e2);
      ~t2 && (u$3.splice(t2, 1), re(e2));
    }
  }, clear() {
    u$3 = [], E$2.clear();
  } };
  function $e() {
    E$2.forEach(te$1), E$2.clear(), n$2(B);
  }
  function te$1(e2) {
    u$3.includes(e2) || re(e2);
  }
  function re(e2) {
    u$3.splice(Ge$1(u$3, (t2) => t2.priority > e2.priority), 0, e2);
  }
  function B(e2) {
    let t2 = H$2;
    for (let r2 = 0; r2 < u$3.length; r2++) {
      let n2 = u$3[r2];
      A$1 = n2.priority, n2.idle || (S$1(n2), n2.advance(e2), n2.idle || t2.push(n2));
    }
    return A$1 = 0, H$2 = u$3, H$2.length = 0, u$3 = t2, u$3.length > 0;
  }
  function Ge$1(e2, t2) {
    let r2 = e2.findIndex(t2);
    return r2 < 0 ? e2.length : r2;
  }
  var ne$2 = (e2, t2, r2) => Math.min(Math.max(r2, e2), t2);
  var It = { transparent: 0, aliceblue: 4042850303, antiquewhite: 4209760255, aqua: 16777215, aquamarine: 2147472639, azure: 4043309055, beige: 4126530815, bisque: 4293182719, black: 255, blanchedalmond: 4293643775, blue: 65535, blueviolet: 2318131967, brown: 2771004159, burlywood: 3736635391, burntsienna: 3934150143, cadetblue: 1604231423, chartreuse: 2147418367, chocolate: 3530104575, coral: 4286533887, cornflowerblue: 1687547391, cornsilk: 4294499583, crimson: 3692313855, cyan: 16777215, darkblue: 35839, darkcyan: 9145343, darkgoldenrod: 3095792639, darkgray: 2846468607, darkgreen: 6553855, darkgrey: 2846468607, darkkhaki: 3182914559, darkmagenta: 2332068863, darkolivegreen: 1433087999, darkorange: 4287365375, darkorchid: 2570243327, darkred: 2332033279, darksalmon: 3918953215, darkseagreen: 2411499519, darkslateblue: 1211993087, darkslategray: 793726975, darkslategrey: 793726975, darkturquoise: 13554175, darkviolet: 2483082239, deeppink: 4279538687, deepskyblue: 12582911, dimgray: 1768516095, dimgrey: 1768516095, dodgerblue: 512819199, firebrick: 2988581631, floralwhite: 4294635775, forestgreen: 579543807, fuchsia: 4278255615, gainsboro: 3705462015, ghostwhite: 4177068031, gold: 4292280575, goldenrod: 3668254975, gray: 2155905279, green: 8388863, greenyellow: 2919182335, grey: 2155905279, honeydew: 4043305215, hotpink: 4285117695, indianred: 3445382399, indigo: 1258324735, ivory: 4294963455, khaki: 4041641215, lavender: 3873897215, lavenderblush: 4293981695, lawngreen: 2096890111, lemonchiffon: 4294626815, lightblue: 2916673279, lightcoral: 4034953471, lightcyan: 3774873599, lightgoldenrodyellow: 4210742015, lightgray: 3553874943, lightgreen: 2431553791, lightgrey: 3553874943, lightpink: 4290167295, lightsalmon: 4288707327, lightseagreen: 548580095, lightskyblue: 2278488831, lightslategray: 2005441023, lightslategrey: 2005441023, lightsteelblue: 2965692159, lightyellow: 4294959359, lime: 16711935, limegreen: 852308735, linen: 4210091775, magenta: 4278255615, maroon: 2147483903, mediumaquamarine: 1724754687, mediumblue: 52735, mediumorchid: 3126187007, mediumpurple: 2473647103, mediumseagreen: 1018393087, mediumslateblue: 2070474495, mediumspringgreen: 16423679, mediumturquoise: 1221709055, mediumvioletred: 3340076543, midnightblue: 421097727, mintcream: 4127193855, mistyrose: 4293190143, moccasin: 4293178879, navajowhite: 4292783615, navy: 33023, oldlace: 4260751103, olive: 2155872511, olivedrab: 1804477439, orange: 4289003775, orangered: 4282712319, orchid: 3664828159, palegoldenrod: 4008225535, palegreen: 2566625535, paleturquoise: 2951671551, palevioletred: 3681588223, papayawhip: 4293907967, peachpuff: 4292524543, peru: 3448061951, pink: 4290825215, plum: 3718307327, powderblue: 2967529215, purple: 2147516671, rebeccapurple: 1714657791, red: 4278190335, rosybrown: 3163525119, royalblue: 1097458175, saddlebrown: 2336560127, salmon: 4202722047, sandybrown: 4104413439, seagreen: 780883967, seashell: 4294307583, sienna: 2689740287, silver: 3233857791, skyblue: 2278484991, slateblue: 1784335871, slategray: 1887473919, slategrey: 1887473919, snow: 4294638335, springgreen: 16744447, steelblue: 1182971135, tan: 3535047935, teal: 8421631, thistle: 3636451583, tomato: 4284696575, turquoise: 1088475391, violet: 4001558271, wheat: 4125012991, white: 4294967295, whitesmoke: 4126537215, yellow: 4294902015, yellowgreen: 2597139199 };
  var d$2 = "[-+]?\\d*\\.?\\d+", M = d$2 + "%";
  function C$2(...e2) {
    return "\\(\\s*(" + e2.join(")\\s*,\\s*(") + ")\\s*\\)";
  }
  var oe$1 = new RegExp("rgb" + C$2(d$2, d$2, d$2)), fe$1 = new RegExp("rgba" + C$2(d$2, d$2, d$2, d$2)), ae$1 = new RegExp("hsl" + C$2(d$2, M, M)), ie = new RegExp("hsla" + C$2(d$2, M, M, d$2)), se$1 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, ue$1 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, le$1 = /^#([0-9a-fA-F]{6})$/, ce = /^#([0-9a-fA-F]{8})$/;
  function be$1(e2) {
    let t2;
    return typeof e2 == "number" ? e2 >>> 0 === e2 && e2 >= 0 && e2 <= 4294967295 ? e2 : null : (t2 = le$1.exec(e2)) ? parseInt(t2[1] + "ff", 16) >>> 0 : c$4 && c$4[e2] !== void 0 ? c$4[e2] : (t2 = oe$1.exec(e2)) ? (y$4(t2[1]) << 24 | y$4(t2[2]) << 16 | y$4(t2[3]) << 8 | 255) >>> 0 : (t2 = fe$1.exec(e2)) ? (y$4(t2[1]) << 24 | y$4(t2[2]) << 16 | y$4(t2[3]) << 8 | me$1(t2[4])) >>> 0 : (t2 = se$1.exec(e2)) ? parseInt(t2[1] + t2[1] + t2[2] + t2[2] + t2[3] + t2[3] + "ff", 16) >>> 0 : (t2 = ce.exec(e2)) ? parseInt(t2[1], 16) >>> 0 : (t2 = ue$1.exec(e2)) ? parseInt(t2[1] + t2[1] + t2[2] + t2[2] + t2[3] + t2[3] + t2[4] + t2[4], 16) >>> 0 : (t2 = ae$1.exec(e2)) ? (de$1(pe(t2[1]), z$2(t2[2]), z$2(t2[3])) | 255) >>> 0 : (t2 = ie.exec(e2)) ? (de$1(pe(t2[1]), z$2(t2[2]), z$2(t2[3])) | me$1(t2[4])) >>> 0 : null;
  }
  function j$1(e2, t2, r2) {
    return r2 < 0 && (r2 += 1), r2 > 1 && (r2 -= 1), r2 < 1 / 6 ? e2 + (t2 - e2) * 6 * r2 : r2 < 1 / 2 ? t2 : r2 < 2 / 3 ? e2 + (t2 - e2) * (2 / 3 - r2) * 6 : e2;
  }
  function de$1(e2, t2, r2) {
    let n2 = r2 < 0.5 ? r2 * (1 + t2) : r2 + t2 - r2 * t2, f2 = 2 * r2 - n2, o2 = j$1(f2, n2, e2 + 1 / 3), i2 = j$1(f2, n2, e2), s2 = j$1(f2, n2, e2 - 1 / 3);
    return Math.round(o2 * 255) << 24 | Math.round(i2 * 255) << 16 | Math.round(s2 * 255) << 8;
  }
  function y$4(e2) {
    let t2 = parseInt(e2, 10);
    return t2 < 0 ? 0 : t2 > 255 ? 255 : t2;
  }
  function pe(e2) {
    return (parseFloat(e2) % 360 + 360) % 360 / 360;
  }
  function me$1(e2) {
    let t2 = parseFloat(e2);
    return t2 < 0 ? 0 : t2 > 1 ? 255 : Math.round(t2 * 255);
  }
  function z$2(e2) {
    let t2 = parseFloat(e2);
    return t2 < 0 ? 0 : t2 > 100 ? 1 : t2 / 100;
  }
  function D$3(e2) {
    let t2 = be$1(e2);
    if (t2 === null)
      return e2;
    t2 = t2 || 0;
    let r2 = (t2 & 4278190080) >>> 24, n2 = (t2 & 16711680) >>> 16, f2 = (t2 & 65280) >>> 8, o2 = (t2 & 255) / 255;
    return `rgba(${r2}, ${n2}, ${f2}, ${o2})`;
  }
  var W$2 = (e2, t2, r2) => {
    if (l$3.fun(e2))
      return e2;
    if (l$3.arr(e2))
      return W$2({ range: e2, output: t2, extrapolate: r2 });
    if (l$3.str(e2.output[0]))
      return k$3(e2);
    let n2 = e2, f2 = n2.output, o2 = n2.range || [0, 1], i2 = n2.extrapolateLeft || n2.extrapolate || "extend", s2 = n2.extrapolateRight || n2.extrapolate || "extend", x2 = n2.easing || ((a2) => a2);
    return (a2) => {
      let F2 = He$1(a2, o2);
      return Ue$1(a2, o2[F2], o2[F2 + 1], f2[F2], f2[F2 + 1], x2, i2, s2, n2.map);
    };
  };
  function Ue$1(e2, t2, r2, n2, f2, o2, i2, s2, x2) {
    let a2 = x2 ? x2(e2) : e2;
    if (a2 < t2) {
      if (i2 === "identity")
        return a2;
      i2 === "clamp" && (a2 = t2);
    }
    if (a2 > r2) {
      if (s2 === "identity")
        return a2;
      s2 === "clamp" && (a2 = r2);
    }
    return n2 === f2 ? n2 : t2 === r2 ? e2 <= t2 ? n2 : f2 : (t2 === -1 / 0 ? a2 = -a2 : r2 === 1 / 0 ? a2 = a2 - t2 : a2 = (a2 - t2) / (r2 - t2), a2 = o2(a2), n2 === -1 / 0 ? a2 = -a2 : f2 === 1 / 0 ? a2 = a2 + n2 : a2 = a2 * (f2 - n2) + n2, a2);
  }
  function He$1(e2, t2) {
    for (var r2 = 1; r2 < t2.length - 1 && !(t2[r2] >= e2); ++r2)
      ;
    return r2 - 1;
  }
  var Be = (e2, t2 = "end") => (r2) => {
    r2 = t2 === "end" ? Math.min(r2, 0.999) : Math.max(r2, 1e-3);
    let n2 = r2 * e2, f2 = t2 === "end" ? Math.floor(n2) : Math.ceil(n2);
    return ne$2(0, 1, f2 / e2);
  }, P = 1.70158, L$3 = P * 1.525, xe$1 = P + 1, he$1 = 2 * Math.PI / 3, ye$1 = 2 * Math.PI / 4.5, V$2 = (e2) => e2 < 1 / 2.75 ? 7.5625 * e2 * e2 : e2 < 2 / 2.75 ? 7.5625 * (e2 -= 1.5 / 2.75) * e2 + 0.75 : e2 < 2.5 / 2.75 ? 7.5625 * (e2 -= 2.25 / 2.75) * e2 + 0.9375 : 7.5625 * (e2 -= 2.625 / 2.75) * e2 + 0.984375, Lt$1 = { linear: (e2) => e2, easeInQuad: (e2) => e2 * e2, easeOutQuad: (e2) => 1 - (1 - e2) * (1 - e2), easeInOutQuad: (e2) => e2 < 0.5 ? 2 * e2 * e2 : 1 - Math.pow(-2 * e2 + 2, 2) / 2, easeInCubic: (e2) => e2 * e2 * e2, easeOutCubic: (e2) => 1 - Math.pow(1 - e2, 3), easeInOutCubic: (e2) => e2 < 0.5 ? 4 * e2 * e2 * e2 : 1 - Math.pow(-2 * e2 + 2, 3) / 2, easeInQuart: (e2) => e2 * e2 * e2 * e2, easeOutQuart: (e2) => 1 - Math.pow(1 - e2, 4), easeInOutQuart: (e2) => e2 < 0.5 ? 8 * e2 * e2 * e2 * e2 : 1 - Math.pow(-2 * e2 + 2, 4) / 2, easeInQuint: (e2) => e2 * e2 * e2 * e2 * e2, easeOutQuint: (e2) => 1 - Math.pow(1 - e2, 5), easeInOutQuint: (e2) => e2 < 0.5 ? 16 * e2 * e2 * e2 * e2 * e2 : 1 - Math.pow(-2 * e2 + 2, 5) / 2, easeInSine: (e2) => 1 - Math.cos(e2 * Math.PI / 2), easeOutSine: (e2) => Math.sin(e2 * Math.PI / 2), easeInOutSine: (e2) => -(Math.cos(Math.PI * e2) - 1) / 2, easeInExpo: (e2) => e2 === 0 ? 0 : Math.pow(2, 10 * e2 - 10), easeOutExpo: (e2) => e2 === 1 ? 1 : 1 - Math.pow(2, -10 * e2), easeInOutExpo: (e2) => e2 === 0 ? 0 : e2 === 1 ? 1 : e2 < 0.5 ? Math.pow(2, 20 * e2 - 10) / 2 : (2 - Math.pow(2, -20 * e2 + 10)) / 2, easeInCirc: (e2) => 1 - Math.sqrt(1 - Math.pow(e2, 2)), easeOutCirc: (e2) => Math.sqrt(1 - Math.pow(e2 - 1, 2)), easeInOutCirc: (e2) => e2 < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * e2, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * e2 + 2, 2)) + 1) / 2, easeInBack: (e2) => xe$1 * e2 * e2 * e2 - P * e2 * e2, easeOutBack: (e2) => 1 + xe$1 * Math.pow(e2 - 1, 3) + P * Math.pow(e2 - 1, 2), easeInOutBack: (e2) => e2 < 0.5 ? Math.pow(2 * e2, 2) * ((L$3 + 1) * 2 * e2 - L$3) / 2 : (Math.pow(2 * e2 - 2, 2) * ((L$3 + 1) * (e2 * 2 - 2) + L$3) + 2) / 2, easeInElastic: (e2) => e2 === 0 ? 0 : e2 === 1 ? 1 : -Math.pow(2, 10 * e2 - 10) * Math.sin((e2 * 10 - 10.75) * he$1), easeOutElastic: (e2) => e2 === 0 ? 0 : e2 === 1 ? 1 : Math.pow(2, -10 * e2) * Math.sin((e2 * 10 - 0.75) * he$1) + 1, easeInOutElastic: (e2) => e2 === 0 ? 0 : e2 === 1 ? 1 : e2 < 0.5 ? -(Math.pow(2, 20 * e2 - 10) * Math.sin((20 * e2 - 11.125) * ye$1)) / 2 : Math.pow(2, -20 * e2 + 10) * Math.sin((20 * e2 - 11.125) * ye$1) / 2 + 1, easeInBounce: (e2) => 1 - V$2(1 - e2), easeOutBounce: V$2, easeInOutBounce: (e2) => e2 < 0.5 ? (1 - V$2(1 - 2 * e2)) / 2 : (1 + V$2(2 * e2 - 1)) / 2, steps: Be };
  var g$3 = Symbol.for("FluidValue.get"), m$2 = Symbol.for("FluidValue.observers");
  var Pt = (e2) => Boolean(e2 && e2[g$3]), ve = (e2) => e2 && e2[g$3] ? e2[g$3]() : e2, qt = (e2) => e2[m$2] || null;
  function je(e2, t2) {
    e2.eventObserved ? e2.eventObserved(t2) : e2(t2);
  }
  function $t(e2, t2) {
    let r2 = e2[m$2];
    r2 && r2.forEach((n2) => {
      je(n2, t2);
    });
  }
  var ge = (_d = class {
    constructor(t2) {
      __publicField(this, _b);
      __publicField(this, _c);
      if (!t2 && !(t2 = this.get))
        throw Error("Unknown getter");
      De$1(this, t2);
    }
  }, _b = g$3, _c = m$2, _d), De$1 = (e2, t2) => Ee$1(e2, g$3, t2);
  function Gt$1(e2, t2) {
    if (e2[g$3]) {
      let r2 = e2[m$2];
      r2 || Ee$1(e2, m$2, r2 = /* @__PURE__ */ new Set()), r2.has(t2) || (r2.add(t2), e2.observerAdded && e2.observerAdded(r2.size, t2));
    }
    return t2;
  }
  function Qt(e2, t2) {
    let r2 = e2[m$2];
    if (r2 && r2.has(t2)) {
      let n2 = r2.size - 1;
      n2 ? r2.delete(t2) : e2[m$2] = null, e2.observerRemoved && e2.observerRemoved(n2, t2);
    }
  }
  var Ee$1 = (e2, t2, r2) => Object.defineProperty(e2, t2, { value: r2, writable: true, configurable: true });
  var O$1 = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, Oe = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi, K = new RegExp(`(${O$1.source})(%|[a-z]+)`, "i"), we$1 = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi, b$3 = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
  var N = (e2) => {
    let [t2, r2] = We(e2);
    if (!t2 || h$4())
      return e2;
    let n2 = window.getComputedStyle(document.documentElement).getPropertyValue(t2);
    if (n2)
      return n2.trim();
    if (r2 && r2.startsWith("--")) {
      let f2 = window.getComputedStyle(document.documentElement).getPropertyValue(r2);
      return f2 || e2;
    } else {
      if (r2 && b$3.test(r2))
        return N(r2);
      if (r2)
        return r2;
    }
    return e2;
  }, We = (e2) => {
    let t2 = b$3.exec(e2);
    if (!t2)
      return [,];
    let [, r2, n2] = t2;
    return [r2, n2];
  };
  var _$1, Ke$1 = (e2, t2, r2, n2, f2) => `rgba(${Math.round(t2)}, ${Math.round(r2)}, ${Math.round(n2)}, ${f2})`, Xt = (e2) => {
    _$1 || (_$1 = c$4 ? new RegExp(`(${Object.keys(c$4).join("|")})(?!\\w)`, "g") : /^\b$/);
    let t2 = e2.output.map((o2) => ve(o2).replace(b$3, N).replace(Oe, D$3).replace(_$1, D$3)), r2 = t2.map((o2) => o2.match(O$1).map(Number)), f2 = r2[0].map((o2, i2) => r2.map((s2) => {
      if (!(i2 in s2))
        throw Error('The arity of each "output" value must be equal');
      return s2[i2];
    })).map((o2) => W$2({ ...e2, output: o2 }));
    return (o2) => {
      var _a2;
      let i2 = !K.test(t2[0]) && ((_a2 = t2.find((x2) => K.test(x2))) == null ? void 0 : _a2.replace(O$1, "")), s2 = 0;
      return t2[0].replace(O$1, () => `${f2[s2++](o2)}${i2 || ""}`).replace(we$1, Ke$1);
    };
  };
  var Z = "react-spring: ", Te = (e2) => {
    let t2 = e2, r2 = false;
    if (typeof t2 != "function")
      throw new TypeError(`${Z}once requires a function parameter`);
    return (...n2) => {
      r2 || (t2(...n2), r2 = true);
    };
  }, Ne$1 = Te(console.warn);
  function Jt() {
    Ne$1(`${Z}The "interpolate" function is deprecated in v9 (use "to" instead)`);
  }
  var _e$1 = Te(console.warn);
  function er$1() {
    _e$1(`${Z}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
  }
  function or(e2) {
    return l$3.str(e2) && (e2[0] == "#" || /\d/.test(e2) || !h$4() && b$3.test(e2) || e2 in (c$4 || {}));
  }
  var Q$1 = h$4() ? React$1.useEffect : React$1.useLayoutEffect;
  var Ce$1 = () => {
    let e2 = React$1.useRef(false);
    return Q$1(() => (e2.current = true, () => {
      e2.current = false;
    }), []), e2;
  };
  function Mr() {
    let e2 = React$1.useState()[1], t2 = Ce$1();
    return () => {
      t2.current && e2(Math.random());
    };
  }
  function Lr(e2, t2) {
    let [r2] = React$1.useState(() => ({ inputs: t2, result: e2() })), n2 = React$1.useRef(), f2 = n2.current, o2 = f2;
    return o2 ? Boolean(t2 && o2.inputs && it$2(t2, o2.inputs)) || (o2 = { inputs: t2, result: e2() }) : o2 = r2, React$1.useEffect(() => {
      n2.current = o2, f2 == r2 && (r2.inputs = r2.result = void 0);
    }, [o2]), o2.result;
  }
  function it$2(e2, t2) {
    if (e2.length !== t2.length)
      return false;
    for (let r2 = 0; r2 < e2.length; r2++)
      if (e2[r2] !== t2[r2])
        return false;
    return true;
  }
  var $r = (e2) => React$1.useEffect(e2, ut), ut = [];
  function Ur(e2) {
    let t2 = React$1.useRef();
    return React$1.useEffect(() => {
      t2.current = e2;
    }), t2.current;
  }
  var h$3 = Symbol.for("Animated:node"), v$2 = (e2) => !!e2 && e2[h$3] === e2, k$2 = (e2) => e2 && e2[h$3], D$2 = (e2, t2) => mt$1(e2, h$3, t2), F$2 = (e2) => e2 && e2[h$3] && e2[h$3].getPayload(), c$3 = class c {
    constructor() {
      __publicField(this, "payload");
      D$2(this, this);
    }
    getPayload() {
      return this.payload || [];
    }
  };
  var l$2 = class l extends c$3 {
    constructor(r2) {
      super();
      __publicField(this, "done", true);
      __publicField(this, "elapsedTime");
      __publicField(this, "lastPosition");
      __publicField(this, "lastVelocity");
      __publicField(this, "v0");
      __publicField(this, "durationProgress", 0);
      this._value = r2;
      l$3.num(this._value) && (this.lastPosition = this._value);
    }
    static create(r2) {
      return new l$2(r2);
    }
    getPayload() {
      return [this];
    }
    getValue() {
      return this._value;
    }
    setValue(r2, n2) {
      return l$3.num(r2) && (this.lastPosition = r2, n2 && (r2 = Math.round(r2 / n2) * n2, this.done && (this.lastPosition = r2))), this._value === r2 ? false : (this._value = r2, true);
    }
    reset() {
      let { done: r2 } = this;
      this.done = false, l$3.num(this._value) && (this.elapsedTime = 0, this.durationProgress = 0, this.lastPosition = this._value, r2 && (this.lastVelocity = null), this.v0 = null);
    }
  };
  var d$1 = class d extends l$2 {
    constructor(t2) {
      super(0);
      __publicField(this, "_string", null);
      __publicField(this, "_toString");
      this._toString = W$2({ output: [t2, t2] });
    }
    static create(t2) {
      return new d$1(t2);
    }
    getValue() {
      let t2 = this._string;
      return t2 ?? (this._string = this._toString(this._value));
    }
    setValue(t2) {
      if (l$3.str(t2)) {
        if (t2 == this._string)
          return false;
        this._string = t2, this._value = 1;
      } else if (super.setValue(t2))
        this._string = null;
      else
        return false;
      return true;
    }
    reset(t2) {
      t2 && (this._toString = W$2({ output: [this.getValue(), t2] })), this._value = 0, super.reset();
    }
  };
  var f$2 = { dependencies: null };
  var u$2 = class u extends c$3 {
    constructor(r2) {
      super();
      this.source = r2;
      this.setValue(r2);
    }
    getValue(r2) {
      let n2 = {};
      return xt(this.source, (a2, i2) => {
        v$2(a2) ? n2[i2] = a2.getValue(r2) : Pt(a2) ? n2[i2] = ve(a2) : r2 || (n2[i2] = a2);
      }), n2;
    }
    setValue(r2) {
      this.source = r2, this.payload = this._makePayload(r2);
    }
    reset() {
      this.payload && Ve(this.payload, (r2) => r2.reset());
    }
    _makePayload(r2) {
      if (r2) {
        let n2 = /* @__PURE__ */ new Set();
        return xt(r2, this._addToPayload, n2), Array.from(n2);
      }
    }
    _addToPayload(r2) {
      f$2.dependencies && Pt(r2) && f$2.dependencies.add(r2);
      let n2 = F$2(r2);
      n2 && Ve(n2, (a2) => this.add(a2));
    }
  };
  var y$3 = class y extends u$2 {
    constructor(t2) {
      super(t2);
    }
    static create(t2) {
      return new y$3(t2);
    }
    getValue() {
      return this.source.map((t2) => t2.getValue());
    }
    setValue(t2) {
      let r2 = this.getPayload();
      return t2.length == r2.length ? r2.map((n2, a2) => n2.setValue(t2[a2])).some(Boolean) : (super.setValue(t2.map(z$1)), true);
    }
  };
  function z$1(e2) {
    return (or(e2) ? d$1 : l$2).create(e2);
  }
  function Le$1(e2) {
    let t2 = k$2(e2);
    return t2 ? t2.constructor : l$3.arr(e2) ? y$3 : or(e2) ? d$1 : l$2;
  }
  var x$3 = (e2, t2) => {
    let r2 = !l$3.fun(e2) || e2.prototype && e2.prototype.isReactComponent;
    return React$1.forwardRef((n2, a2) => {
      let i2 = React$1.useRef(null), o2 = r2 && React$1.useCallback((s2) => {
        i2.current = ae(a2, s2);
      }, [a2]), [m2, T2] = ne$1(n2, t2), W2 = Mr(), P2 = () => {
        let s2 = i2.current;
        if (r2 && !s2)
          return;
        (s2 ? t2.applyAnimatedValues(s2, m2.getValue(true)) : false) === false && W2();
      }, _2 = new b$2(P2, T2), p2 = React$1.useRef();
      Q$1(() => (p2.current = _2, Ve(T2, (s2) => Gt$1(s2, _2)), () => {
        p2.current && (Ve(p2.current.deps, (s2) => Qt(s2, p2.current)), n$2.cancel(p2.current.update));
      })), React$1.useEffect(P2, []), $r(() => () => {
        let s2 = p2.current;
        Ve(s2.deps, (S2) => Qt(S2, s2));
      });
      let $2 = t2.getComponentProps(m2.getValue());
      return React__namespace.createElement(e2, { ...$2, ref: o2 });
    });
  }, b$2 = class b {
    constructor(t2, r2) {
      this.update = t2;
      this.deps = r2;
    }
    eventObserved(t2) {
      t2.type == "change" && n$2.write(this.update);
    }
  };
  function ne$1(e2, t2) {
    let r2 = /* @__PURE__ */ new Set();
    return f$2.dependencies = r2, e2.style && (e2 = { ...e2, style: t2.createAnimatedStyle(e2.style) }), e2 = new u$2(e2), f$2.dependencies = null, [e2, r2];
  }
  function ae(e2, t2) {
    return e2 && (l$3.fun(e2) ? e2(t2) : e2.current = t2), t2;
  }
  var j = Symbol.for("AnimatedComponent"), Ke = (e2, { applyAnimatedValues: t2 = () => false, createAnimatedStyle: r2 = (a2) => new u$2(a2), getComponentProps: n2 = (a2) => a2 } = {}) => {
    let a2 = { applyAnimatedValues: t2, createAnimatedStyle: r2, getComponentProps: n2 }, i2 = (o2) => {
      let m2 = I$2(o2) || "Anonymous";
      return l$3.str(o2) ? o2 = i2[o2] || (i2[o2] = x$3(o2, a2)) : o2 = o2[j] || (o2[j] = x$3(o2, a2)), o2.displayName = `Animated(${m2})`, o2;
    };
    return xt(e2, (o2, m2) => {
      l$3.arr(e2) && (m2 = I$2(o2)), i2[m2] = i2(o2);
    }), { animated: i2 };
  }, I$2 = (e2) => l$3.str(e2) ? e2 : e2 && l$3.str(e2.displayName) ? e2.displayName : l$3.fun(e2) && e2.name || null;
  function I$1(t2, ...e2) {
    return l$3.fun(t2) ? t2(...e2) : t2;
  }
  var te = (t2, e2) => t2 === true || !!(e2 && t2 && (l$3.fun(t2) ? t2(e2) : ht$1(t2).includes(e2))), et = (t2, e2) => l$3.obj(t2) ? e2 && t2[e2] : t2;
  var ke = (t2, e2) => t2.default === true ? t2[e2] : t2.default ? t2.default[e2] : void 0, nn = (t2) => t2, ne = (t2, e2 = nn) => {
    let n2 = rn;
    t2.default && t2.default !== true && (t2 = t2.default, n2 = Object.keys(t2));
    let r2 = {};
    for (let o2 of n2) {
      let s2 = e2(t2[o2], o2);
      l$3.und(s2) || (r2[o2] = s2);
    }
    return r2;
  }, rn = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"], on = { config: 1, from: 1, to: 1, ref: 1, loop: 1, reset: 1, pause: 1, cancel: 1, reverse: 1, immediate: 1, default: 1, delay: 1, onProps: 1, onStart: 1, onChange: 1, onPause: 1, onResume: 1, onRest: 1, onResolve: 1, items: 1, trail: 1, sort: 1, expires: 1, initial: 1, enter: 1, update: 1, leave: 1, children: 1, onDestroyed: 1, keys: 1, callId: 1, parentId: 1 };
  function sn(t2) {
    let e2 = {}, n2 = 0;
    if (xt(t2, (r2, o2) => {
      on[o2] || (e2[o2] = r2, n2++);
    }), n2)
      return e2;
  }
  function de(t2) {
    let e2 = sn(t2);
    if (e2) {
      let n2 = { to: e2 };
      return xt(t2, (r2, o2) => o2 in e2 || (n2[o2] = r2)), n2;
    }
    return { ...t2 };
  }
  function me(t2) {
    return t2 = ve(t2), l$3.arr(t2) ? t2.map(me) : or(t2) ? p$2.createStringInterpolator({ range: [0, 1], output: [t2, t2] })(1) : t2;
  }
  function Ue(t2) {
    for (let e2 in t2)
      return true;
    return false;
  }
  function Ee(t2) {
    return l$3.fun(t2) || l$3.arr(t2) && l$3.obj(t2[0]);
  }
  function xe(t2, e2) {
    var _a2;
    (_a2 = t2.ref) == null ? void 0 : _a2.delete(t2), e2 == null ? void 0 : e2.delete(t2);
  }
  function he(t2, e2) {
    var _a2;
    e2 && t2.ref !== e2 && ((_a2 = t2.ref) == null ? void 0 : _a2.delete(t2), e2.add(t2), t2.ref = e2);
  }
  var mt = { default: { tension: 170, friction: 26 }, gentle: { tension: 120, friction: 14 }, wobbly: { tension: 180, friction: 12 }, stiff: { tension: 210, friction: 20 }, slow: { tension: 280, friction: 60 }, molasses: { tension: 280, friction: 120 } };
  var tt = { ...mt.default, mass: 1, damping: 1, easing: Lt$1.linear, clamp: false }, we = class {
    constructor() {
      __publicField(this, "tension");
      __publicField(this, "friction");
      __publicField(this, "frequency");
      __publicField(this, "damping");
      __publicField(this, "mass");
      __publicField(this, "velocity", 0);
      __publicField(this, "restVelocity");
      __publicField(this, "precision");
      __publicField(this, "progress");
      __publicField(this, "duration");
      __publicField(this, "easing");
      __publicField(this, "clamp");
      __publicField(this, "bounce");
      __publicField(this, "decay");
      __publicField(this, "round");
      Object.assign(this, tt);
    }
  };
  function gt(t2, e2, n2) {
    n2 && (n2 = { ...n2 }, ht(n2, e2), e2 = { ...n2, ...e2 }), ht(t2, e2), Object.assign(t2, e2);
    for (let a2 in tt)
      t2[a2] == null && (t2[a2] = tt[a2]);
    let { mass: r2, frequency: o2, damping: s2 } = t2;
    return l$3.und(o2) || (o2 < 0.01 && (o2 = 0.01), s2 < 0 && (s2 = 0), t2.tension = Math.pow(2 * Math.PI / o2, 2) * r2, t2.friction = 4 * Math.PI * s2 * r2 / o2), t2;
  }
  function ht(t2, e2) {
    if (!l$3.und(e2.decay))
      t2.duration = void 0;
    else {
      let n2 = !l$3.und(e2.tension) || !l$3.und(e2.friction);
      (n2 || !l$3.und(e2.frequency) || !l$3.und(e2.damping) || !l$3.und(e2.mass)) && (t2.duration = void 0, t2.decay = void 0), n2 && (t2.frequency = void 0);
    }
  }
  var yt = [], Le = class {
    constructor() {
      __publicField(this, "changed", false);
      __publicField(this, "values", yt);
      __publicField(this, "toValues", null);
      __publicField(this, "fromValues", yt);
      __publicField(this, "to");
      __publicField(this, "from");
      __publicField(this, "config", new we());
      __publicField(this, "immediate", false);
    }
  };
  function Me(t2, { key: e2, props: n2, defaultProps: r2, state: o2, actions: s2 }) {
    return new Promise((a2, i2) => {
      let u2, p2, f2 = te(n2.cancel ?? (r2 == null ? void 0 : r2.cancel), e2);
      if (f2)
        b2();
      else {
        l$3.und(n2.pause) || (o2.paused = te(n2.pause, e2));
        let c2 = r2 == null ? void 0 : r2.pause;
        c2 !== true && (c2 = o2.paused || te(c2, e2)), u2 = I$1(n2.delay || 0, e2), c2 ? (o2.resumeQueue.add(m2), s2.pause()) : (s2.resume(), m2());
      }
      function d2() {
        o2.resumeQueue.add(m2), o2.timeouts.delete(p2), p2.cancel(), u2 = p2.time - n$2.now();
      }
      function m2() {
        u2 > 0 && !p$2.skipAnimation ? (o2.delayed = true, p2 = n$2.setTimeout(b2, u2), o2.pauseQueue.add(d2), o2.timeouts.add(p2)) : b2();
      }
      function b2() {
        o2.delayed && (o2.delayed = false), o2.pauseQueue.delete(d2), o2.timeouts.delete(p2), t2 <= (o2.cancelId || 0) && (f2 = true);
        try {
          s2.start({ ...n2, callId: t2, cancel: f2 }, a2);
        } catch (c2) {
          i2(c2);
        }
      }
    });
  }
  var be = (t2, e2) => e2.length == 1 ? e2[0] : e2.some((n2) => n2.cancelled) ? q$1(t2.get()) : e2.every((n2) => n2.noop) ? nt(t2.get()) : E$1(t2.get(), e2.every((n2) => n2.finished)), nt = (t2) => ({ value: t2, noop: true, finished: true, cancelled: false }), E$1 = (t2, e2, n2 = false) => ({ value: t2, finished: e2, cancelled: n2 }), q$1 = (t2) => ({ value: t2, cancelled: true, finished: false });
  function De(t2, e2, n2, r2) {
    let { callId: o2, parentId: s2, onRest: a2 } = e2, { asyncTo: i2, promise: u2 } = n2;
    return !s2 && t2 === i2 && !e2.reset ? u2 : n2.promise = (async () => {
      n2.asyncId = o2, n2.asyncTo = t2;
      let p2 = ne(e2, (l2, h2) => h2 === "onRest" ? void 0 : l2), f2, d2, m2 = new Promise((l2, h2) => (f2 = l2, d2 = h2)), b2 = (l2) => {
        let h2 = o2 <= (n2.cancelId || 0) && q$1(r2) || o2 !== n2.asyncId && E$1(r2, false);
        if (h2)
          throw l2.result = h2, d2(l2), l2;
      }, c2 = (l2, h2) => {
        let g2 = new Ae(), x2 = new Ne();
        return (async () => {
          if (p$2.skipAnimation)
            throw oe(n2), x2.result = E$1(r2, false), d2(x2), x2;
          b2(g2);
          let S2 = l$3.obj(l2) ? { ...l2 } : { ...h2, to: l2 };
          S2.parentId = o2, xt(p2, (V2, _2) => {
            l$3.und(S2[_2]) && (S2[_2] = V2);
          });
          let A2 = await r2.start(S2);
          return b2(g2), n2.paused && await new Promise((V2) => {
            n2.resumeQueue.add(V2);
          }), A2;
        })();
      }, P2;
      if (p$2.skipAnimation)
        return oe(n2), E$1(r2, false);
      try {
        let l2;
        l$3.arr(t2) ? l2 = (async (h2) => {
          for (let g2 of h2)
            await c2(g2);
        })(t2) : l2 = Promise.resolve(t2(c2, r2.stop.bind(r2))), await Promise.all([l2.then(f2), m2]), P2 = E$1(r2.get(), true, false);
      } catch (l2) {
        if (l2 instanceof Ae)
          P2 = l2.result;
        else if (l2 instanceof Ne)
          P2 = l2.result;
        else
          throw l2;
      } finally {
        o2 == n2.asyncId && (n2.asyncId = s2, n2.asyncTo = s2 ? i2 : void 0, n2.promise = s2 ? u2 : void 0);
      }
      return l$3.fun(a2) && n$2.batchedUpdates(() => {
        a2(P2, r2, r2.item);
      }), P2;
    })();
  }
  function oe(t2, e2) {
    Pe$1(t2.timeouts, (n2) => n2.cancel()), t2.pauseQueue.clear(), t2.resumeQueue.clear(), t2.asyncId = t2.asyncTo = t2.promise = void 0, e2 && (t2.cancelId = e2);
  }
  var Ae = class extends Error {
    constructor() {
      super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.");
      __publicField(this, "result");
    }
  }, Ne = class extends Error {
    constructor() {
      super("SkipAnimationSignal");
      __publicField(this, "result");
    }
  };
  var Re = (t2) => t2 instanceof X, Sn = 1, X = class extends ge {
    constructor() {
      super(...arguments);
      __publicField(this, "id", Sn++);
      __publicField(this, "_priority", 0);
    }
    get priority() {
      return this._priority;
    }
    set priority(e2) {
      this._priority != e2 && (this._priority = e2, this._onPriorityChange(e2));
    }
    get() {
      let e2 = k$2(this);
      return e2 && e2.getValue();
    }
    to(...e2) {
      return p$2.to(this, e2);
    }
    interpolate(...e2) {
      return Jt(), p$2.to(this, e2);
    }
    toJSON() {
      return this.get();
    }
    observerAdded(e2) {
      e2 == 1 && this._attach();
    }
    observerRemoved(e2) {
      e2 == 0 && this._detach();
    }
    _attach() {
    }
    _detach() {
    }
    _onChange(e2, n2 = false) {
      $t(this, { type: "change", parent: this, value: e2, idle: n2 });
    }
    _onPriorityChange(e2) {
      this.idle || qe$1.sort(this), $t(this, { type: "priority", parent: this, priority: e2 });
    }
  };
  var se = Symbol.for("SpringPhase"), bt = 1, rt = 2, ot = 4, qe = (t2) => (t2[se] & bt) > 0, Q = (t2) => (t2[se] & rt) > 0, ye = (t2) => (t2[se] & ot) > 0, st = (t2, e2) => e2 ? t2[se] |= rt | bt : t2[se] &= ~rt, it$1 = (t2, e2) => e2 ? t2[se] |= ot : t2[se] &= ~ot;
  var ue = class extends X {
    constructor(e2, n2) {
      super();
      __publicField(this, "key");
      __publicField(this, "animation", new Le());
      __publicField(this, "queue");
      __publicField(this, "defaultProps", {});
      __publicField(this, "_state", { paused: false, delayed: false, pauseQueue: /* @__PURE__ */ new Set(), resumeQueue: /* @__PURE__ */ new Set(), timeouts: /* @__PURE__ */ new Set() });
      __publicField(this, "_pendingCalls", /* @__PURE__ */ new Set());
      __publicField(this, "_lastCallId", 0);
      __publicField(this, "_lastToId", 0);
      __publicField(this, "_memoizedDuration", 0);
      if (!l$3.und(e2) || !l$3.und(n2)) {
        let r2 = l$3.obj(e2) ? { ...e2 } : { ...n2, from: e2 };
        l$3.und(r2.default) && (r2.default = true), this.start(r2);
      }
    }
    get idle() {
      return !(Q(this) || this._state.asyncTo) || ye(this);
    }
    get goal() {
      return ve(this.animation.to);
    }
    get velocity() {
      let e2 = k$2(this);
      return e2 instanceof l$2 ? e2.lastVelocity || 0 : e2.getPayload().map((n2) => n2.lastVelocity || 0);
    }
    get hasAnimated() {
      return qe(this);
    }
    get isAnimating() {
      return Q(this);
    }
    get isPaused() {
      return ye(this);
    }
    get isDelayed() {
      return this._state.delayed;
    }
    advance(e2) {
      let n2 = true, r2 = false, o2 = this.animation, { config: s2, toValues: a2 } = o2, i2 = F$2(o2.to);
      !i2 && Pt(o2.to) && (a2 = ht$1(ve(o2.to))), o2.values.forEach((f2, d2) => {
        if (f2.done)
          return;
        let m2 = f2.constructor == d$1 ? 1 : i2 ? i2[d2].lastPosition : a2[d2], b2 = o2.immediate, c2 = m2;
        if (!b2) {
          if (c2 = f2.lastPosition, s2.tension <= 0) {
            f2.done = true;
            return;
          }
          let P2 = f2.elapsedTime += e2, l2 = o2.fromValues[d2], h2 = f2.v0 != null ? f2.v0 : f2.v0 = l$3.arr(s2.velocity) ? s2.velocity[d2] : s2.velocity, g2, x2 = s2.precision || (l2 == m2 ? 5e-3 : Math.min(1, Math.abs(m2 - l2) * 1e-3));
          if (l$3.und(s2.duration))
            if (s2.decay) {
              let S2 = s2.decay === true ? 0.998 : s2.decay, A2 = Math.exp(-(1 - S2) * P2);
              c2 = l2 + h2 / (1 - S2) * (1 - A2), b2 = Math.abs(f2.lastPosition - c2) <= x2, g2 = h2 * A2;
            } else {
              g2 = f2.lastVelocity == null ? h2 : f2.lastVelocity;
              let S2 = s2.restVelocity || x2 / 10, A2 = s2.clamp ? 0 : s2.bounce, V2 = !l$3.und(A2), _2 = l2 == m2 ? f2.v0 > 0 : l2 < m2, v2, w2 = false, C2 = 1, $2 = Math.ceil(e2 / C2);
              for (let L2 = 0; L2 < $2 && (v2 = Math.abs(g2) > S2, !(!v2 && (b2 = Math.abs(m2 - c2) <= x2, b2))); ++L2) {
                V2 && (w2 = c2 == m2 || c2 > m2 == _2, w2 && (g2 = -g2 * A2, c2 = m2));
                let N2 = -s2.tension * 1e-6 * (c2 - m2), y2 = -s2.friction * 1e-3 * g2, T2 = (N2 + y2) / s2.mass;
                g2 = g2 + T2 * C2, c2 = c2 + g2 * C2;
              }
            }
          else {
            let S2 = 1;
            s2.duration > 0 && (this._memoizedDuration !== s2.duration && (this._memoizedDuration = s2.duration, f2.durationProgress > 0 && (f2.elapsedTime = s2.duration * f2.durationProgress, P2 = f2.elapsedTime += e2)), S2 = (s2.progress || 0) + P2 / this._memoizedDuration, S2 = S2 > 1 ? 1 : S2 < 0 ? 0 : S2, f2.durationProgress = S2), c2 = l2 + s2.easing(S2) * (m2 - l2), g2 = (c2 - f2.lastPosition) / e2, b2 = S2 == 1;
          }
          f2.lastVelocity = g2, Number.isNaN(c2) && (console.warn("Got NaN while animating:", this), b2 = true);
        }
        i2 && !i2[d2].done && (b2 = false), b2 ? f2.done = true : n2 = false, f2.setValue(c2, s2.round) && (r2 = true);
      });
      let u2 = k$2(this), p2 = u2.getValue();
      if (n2) {
        let f2 = ve(o2.to);
        (p2 !== f2 || r2) && !s2.decay ? (u2.setValue(f2), this._onChange(f2)) : r2 && s2.decay && this._onChange(p2), this._stop();
      } else
        r2 && this._onChange(p2);
    }
    set(e2) {
      return n$2.batchedUpdates(() => {
        this._stop(), this._focus(e2), this._set(e2);
      }), this;
    }
    pause() {
      this._update({ pause: true });
    }
    resume() {
      this._update({ pause: false });
    }
    finish() {
      if (Q(this)) {
        let { to: e2, config: n2 } = this.animation;
        n$2.batchedUpdates(() => {
          this._onStart(), n2.decay || this._set(e2, false), this._stop();
        });
      }
      return this;
    }
    update(e2) {
      return (this.queue || (this.queue = [])).push(e2), this;
    }
    start(e2, n2) {
      let r2;
      return l$3.und(e2) ? (r2 = this.queue || [], this.queue = []) : r2 = [l$3.obj(e2) ? e2 : { ...n2, to: e2 }], Promise.all(r2.map((o2) => this._update(o2))).then((o2) => be(this, o2));
    }
    stop(e2) {
      let { to: n2 } = this.animation;
      return this._focus(this.get()), oe(this._state, e2 && this._lastCallId), n$2.batchedUpdates(() => this._stop(n2, e2)), this;
    }
    reset() {
      this._update({ reset: true });
    }
    eventObserved(e2) {
      e2.type == "change" ? this._start() : e2.type == "priority" && (this.priority = e2.priority + 1);
    }
    _prepareNode(e2) {
      let n2 = this.key || "", { to: r2, from: o2 } = e2;
      r2 = l$3.obj(r2) ? r2[n2] : r2, (r2 == null || Ee(r2)) && (r2 = void 0), o2 = l$3.obj(o2) ? o2[n2] : o2, o2 == null && (o2 = void 0);
      let s2 = { to: r2, from: o2 };
      return qe(this) || (e2.reverse && ([r2, o2] = [o2, r2]), o2 = ve(o2), l$3.und(o2) ? k$2(this) || this._set(r2) : this._set(o2)), s2;
    }
    _update({ ...e2 }, n2) {
      let { key: r2, defaultProps: o2 } = this;
      e2.default && Object.assign(o2, ne(e2, (i2, u2) => /^on/.test(u2) ? et(i2, r2) : i2)), _t(this, e2, "onProps"), Ie(this, "onProps", e2, this);
      let s2 = this._prepareNode(e2);
      if (Object.isFrozen(this))
        throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
      let a2 = this._state;
      return Me(++this._lastCallId, { key: r2, props: e2, defaultProps: o2, state: a2, actions: { pause: () => {
        ye(this) || (it$1(this, true), yt$1(a2.pauseQueue), Ie(this, "onPause", E$1(this, Ce(this, this.animation.to)), this));
      }, resume: () => {
        ye(this) && (it$1(this, false), Q(this) && this._resume(), yt$1(a2.resumeQueue), Ie(this, "onResume", E$1(this, Ce(this, this.animation.to)), this));
      }, start: this._merge.bind(this, s2) } }).then((i2) => {
        if (e2.loop && i2.finished && !(n2 && i2.noop)) {
          let u2 = at(e2);
          if (u2)
            return this._update(u2, true);
        }
        return i2;
      });
    }
    _merge(e2, n2, r2) {
      if (n2.cancel)
        return this.stop(true), r2(q$1(this));
      let o2 = !l$3.und(e2.to), s2 = !l$3.und(e2.from);
      if (o2 || s2)
        if (n2.callId > this._lastToId)
          this._lastToId = n2.callId;
        else
          return r2(q$1(this));
      let { key: a2, defaultProps: i2, animation: u2 } = this, { to: p2, from: f2 } = u2, { to: d2 = p2, from: m2 = f2 } = e2;
      s2 && !o2 && (!n2.default || l$3.und(d2)) && (d2 = m2), n2.reverse && ([d2, m2] = [m2, d2]);
      let b2 = !bt$1(m2, f2);
      b2 && (u2.from = m2), m2 = ve(m2);
      let c2 = !bt$1(d2, p2);
      c2 && this._focus(d2);
      let P2 = Ee(n2.to), { config: l2 } = u2, { decay: h2, velocity: g2 } = l2;
      (o2 || s2) && (l2.velocity = 0), n2.config && !P2 && gt(l2, I$1(n2.config, a2), n2.config !== i2.config ? I$1(i2.config, a2) : void 0);
      let x2 = k$2(this);
      if (!x2 || l$3.und(d2))
        return r2(E$1(this, true));
      let S2 = l$3.und(n2.reset) ? s2 && !n2.default : !l$3.und(m2) && te(n2.reset, a2), A2 = S2 ? m2 : this.get(), V2 = me(d2), _2 = l$3.num(V2) || l$3.arr(V2) || or(V2), v2 = !P2 && (!_2 || te(i2.immediate || n2.immediate, a2));
      if (c2) {
        let L2 = Le$1(d2);
        if (L2 !== x2.constructor)
          if (v2)
            x2 = this._set(V2);
          else
            throw Error(`Cannot animate between ${x2.constructor.name} and ${L2.name}, as the "to" prop suggests`);
      }
      let w2 = x2.constructor, C2 = Pt(d2), $2 = false;
      if (!C2) {
        let L2 = S2 || !qe(this) && b2;
        (c2 || L2) && ($2 = bt$1(me(A2), V2), C2 = !$2), (!bt$1(u2.immediate, v2) && !v2 || !bt$1(l2.decay, h2) || !bt$1(l2.velocity, g2)) && (C2 = true);
      }
      if ($2 && Q(this) && (u2.changed && !S2 ? C2 = true : C2 || this._stop(p2)), !P2 && ((C2 || Pt(p2)) && (u2.values = x2.getPayload(), u2.toValues = Pt(d2) ? null : w2 == d$1 ? [1] : ht$1(V2)), u2.immediate != v2 && (u2.immediate = v2, !v2 && !S2 && this._set(p2)), C2)) {
        let { onRest: L2 } = u2;
        Ve(_n, (y2) => _t(this, n2, y2));
        let N2 = E$1(this, Ce(this, p2));
        yt$1(this._pendingCalls, N2), this._pendingCalls.add(r2), u2.changed && n$2.batchedUpdates(() => {
          var _a2;
          u2.changed = !S2, L2 == null ? void 0 : L2(N2, this), S2 ? I$1(i2.onRest, N2) : (_a2 = u2.onStart) == null ? void 0 : _a2.call(u2, N2, this);
        });
      }
      S2 && this._set(A2), P2 ? r2(De(n2.to, n2, this._state, this)) : C2 ? this._start() : Q(this) && !c2 ? this._pendingCalls.add(r2) : r2(nt(A2));
    }
    _focus(e2) {
      let n2 = this.animation;
      e2 !== n2.to && (qt(this) && this._detach(), n2.to = e2, qt(this) && this._attach());
    }
    _attach() {
      let e2 = 0, { to: n2 } = this.animation;
      Pt(n2) && (Gt$1(n2, this), Re(n2) && (e2 = n2.priority + 1)), this.priority = e2;
    }
    _detach() {
      let { to: e2 } = this.animation;
      Pt(e2) && Qt(e2, this);
    }
    _set(e2, n2 = true) {
      let r2 = ve(e2);
      if (!l$3.und(r2)) {
        let o2 = k$2(this);
        if (!o2 || !bt$1(r2, o2.getValue())) {
          let s2 = Le$1(r2);
          !o2 || o2.constructor != s2 ? D$2(this, s2.create(r2)) : o2.setValue(r2), o2 && n$2.batchedUpdates(() => {
            this._onChange(r2, n2);
          });
        }
      }
      return k$2(this);
    }
    _onStart() {
      let e2 = this.animation;
      e2.changed || (e2.changed = true, Ie(this, "onStart", E$1(this, Ce(this, e2.to)), this));
    }
    _onChange(e2, n2) {
      n2 || (this._onStart(), I$1(this.animation.onChange, e2, this)), I$1(this.defaultProps.onChange, e2, this), super._onChange(e2, n2);
    }
    _start() {
      let e2 = this.animation;
      k$2(this).reset(ve(e2.to)), e2.immediate || (e2.fromValues = e2.values.map((n2) => n2.lastPosition)), Q(this) || (st(this, true), ye(this) || this._resume());
    }
    _resume() {
      p$2.skipAnimation ? this.finish() : qe$1.start(this);
    }
    _stop(e2, n2) {
      if (Q(this)) {
        st(this, false);
        let r2 = this.animation;
        Ve(r2.values, (s2) => {
          s2.done = true;
        }), r2.toValues && (r2.onChange = r2.onPause = r2.onResume = void 0), $t(this, { type: "idle", parent: this });
        let o2 = n2 ? q$1(this.get()) : E$1(this.get(), Ce(this, e2 ?? r2.to));
        yt$1(this._pendingCalls, o2), r2.changed && (r2.changed = false, Ie(this, "onRest", o2, this));
      }
    }
  };
  function Ce(t2, e2) {
    let n2 = me(e2), r2 = me(t2.get());
    return bt$1(r2, n2);
  }
  function at(t2, e2 = t2.loop, n2 = t2.to) {
    let r2 = I$1(e2);
    if (r2) {
      let o2 = r2 !== true && de(r2), s2 = (o2 || t2).reverse, a2 = !o2 || o2.reset;
      return Pe({ ...t2, loop: e2, default: false, pause: void 0, to: !s2 || Ee(n2) ? n2 : void 0, from: a2 ? t2.from : void 0, reset: a2, ...o2 });
    }
  }
  function Pe(t2) {
    let { to: e2, from: n2 } = t2 = de(t2), r2 = /* @__PURE__ */ new Set();
    return l$3.obj(e2) && Vt(e2, r2), l$3.obj(n2) && Vt(n2, r2), t2.keys = r2.size ? Array.from(r2) : null, t2;
  }
  function Ot(t2) {
    let e2 = Pe(t2);
    return l$3.und(e2.default) && (e2.default = ne(e2)), e2;
  }
  function Vt(t2, e2) {
    xt(t2, (n2, r2) => n2 != null && e2.add(r2));
  }
  var _n = ["onStart", "onRest", "onChange", "onPause", "onResume"];
  function _t(t2, e2, n2) {
    t2.animation[n2] = e2[n2] !== ke(e2, n2) ? et(e2[n2], t2.key) : void 0;
  }
  function Ie(t2, e2, ...n2) {
    var _a2, _b2, _c2, _d2;
    (_b2 = (_a2 = t2.animation)[e2]) == null ? void 0 : _b2.call(_a2, ...n2), (_d2 = (_c2 = t2.defaultProps)[e2]) == null ? void 0 : _d2.call(_c2, ...n2);
  }
  var Fn = ["onStart", "onChange", "onRest"], kn = 1, le = class {
    constructor(e2, n2) {
      __publicField(this, "id", kn++);
      __publicField(this, "springs", {});
      __publicField(this, "queue", []);
      __publicField(this, "ref");
      __publicField(this, "_flush");
      __publicField(this, "_initialProps");
      __publicField(this, "_lastAsyncId", 0);
      __publicField(this, "_active", /* @__PURE__ */ new Set());
      __publicField(this, "_changed", /* @__PURE__ */ new Set());
      __publicField(this, "_started", false);
      __publicField(this, "_item");
      __publicField(this, "_state", { paused: false, pauseQueue: /* @__PURE__ */ new Set(), resumeQueue: /* @__PURE__ */ new Set(), timeouts: /* @__PURE__ */ new Set() });
      __publicField(this, "_events", { onStart: /* @__PURE__ */ new Map(), onChange: /* @__PURE__ */ new Map(), onRest: /* @__PURE__ */ new Map() });
      this._onFrame = this._onFrame.bind(this), n2 && (this._flush = n2), e2 && this.start({ default: true, ...e2 });
    }
    get idle() {
      return !this._state.asyncTo && Object.values(this.springs).every((e2) => e2.idle && !e2.isDelayed && !e2.isPaused);
    }
    get item() {
      return this._item;
    }
    set item(e2) {
      this._item = e2;
    }
    get() {
      let e2 = {};
      return this.each((n2, r2) => e2[r2] = n2.get()), e2;
    }
    set(e2) {
      for (let n2 in e2) {
        let r2 = e2[n2];
        l$3.und(r2) || this.springs[n2].set(r2);
      }
    }
    update(e2) {
      return e2 && this.queue.push(Pe(e2)), this;
    }
    start(e2) {
      let { queue: n2 } = this;
      return e2 ? n2 = ht$1(e2).map(Pe) : this.queue = [], this._flush ? this._flush(this, n2) : (jt(this, n2), ze(this, n2));
    }
    stop(e2, n2) {
      if (e2 !== !!e2 && (n2 = e2), n2) {
        let r2 = this.springs;
        Ve(ht$1(n2), (o2) => r2[o2].stop(!!e2));
      } else
        oe(this._state, this._lastAsyncId), this.each((r2) => r2.stop(!!e2));
      return this;
    }
    pause(e2) {
      if (l$3.und(e2))
        this.start({ pause: true });
      else {
        let n2 = this.springs;
        Ve(ht$1(e2), (r2) => n2[r2].pause());
      }
      return this;
    }
    resume(e2) {
      if (l$3.und(e2))
        this.start({ pause: false });
      else {
        let n2 = this.springs;
        Ve(ht$1(e2), (r2) => n2[r2].resume());
      }
      return this;
    }
    each(e2) {
      xt(this.springs, e2);
    }
    _onFrame() {
      let { onStart: e2, onChange: n2, onRest: r2 } = this._events, o2 = this._active.size > 0, s2 = this._changed.size > 0;
      (o2 && !this._started || s2 && !this._started) && (this._started = true, Pe$1(e2, ([u2, p2]) => {
        p2.value = this.get(), u2(p2, this, this._item);
      }));
      let a2 = !o2 && this._started, i2 = s2 || a2 && r2.size ? this.get() : null;
      s2 && n2.size && Pe$1(n2, ([u2, p2]) => {
        p2.value = i2, u2(p2, this, this._item);
      }), a2 && (this._started = false, Pe$1(r2, ([u2, p2]) => {
        p2.value = i2, u2(p2, this, this._item);
      }));
    }
    eventObserved(e2) {
      if (e2.type == "change")
        this._changed.add(e2.parent), e2.idle || this._active.add(e2.parent);
      else if (e2.type == "idle")
        this._active.delete(e2.parent);
      else
        return;
      n$2.onFrame(this._onFrame);
    }
  };
  function ze(t2, e2) {
    return Promise.all(e2.map((n2) => wt(t2, n2))).then((n2) => be(t2, n2));
  }
  async function wt(t2, e2, n2) {
    let { keys: r2, to: o2, from: s2, loop: a2, onRest: i2, onResolve: u2 } = e2, p2 = l$3.obj(e2.default) && e2.default;
    a2 && (e2.loop = false), o2 === false && (e2.to = null), s2 === false && (e2.from = null);
    let f2 = l$3.arr(o2) || l$3.fun(o2) ? o2 : void 0;
    f2 ? (e2.to = void 0, e2.onRest = void 0, p2 && (p2.onRest = void 0)) : Ve(Fn, (P2) => {
      let l2 = e2[P2];
      if (l$3.fun(l2)) {
        let h2 = t2._events[P2];
        e2[P2] = ({ finished: g2, cancelled: x2 }) => {
          let S2 = h2.get(l2);
          S2 ? (g2 || (S2.finished = false), x2 && (S2.cancelled = true)) : h2.set(l2, { value: null, finished: g2 || false, cancelled: x2 || false });
        }, p2 && (p2[P2] = e2[P2]);
      }
    });
    let d2 = t2._state;
    e2.pause === !d2.paused ? (d2.paused = e2.pause, yt$1(e2.pause ? d2.pauseQueue : d2.resumeQueue)) : d2.paused && (e2.pause = true);
    let m2 = (r2 || Object.keys(t2.springs)).map((P2) => t2.springs[P2].start(e2)), b2 = e2.cancel === true || ke(e2, "cancel") === true;
    (f2 || b2 && d2.asyncId) && m2.push(Me(++t2._lastAsyncId, { props: e2, state: d2, actions: { pause: Y, resume: Y, start(P2, l2) {
      b2 ? (oe(d2, t2._lastAsyncId), l2(q$1(t2))) : (P2.onRest = i2, l2(De(f2, P2, d2, t2)));
    } } })), d2.paused && await new Promise((P2) => {
      d2.resumeQueue.add(P2);
    });
    let c2 = be(t2, await Promise.all(m2));
    if (a2 && c2.finished && !(n2 && c2.noop)) {
      let P2 = at(e2, a2, o2);
      if (P2)
        return jt(t2, [P2]), wt(t2, P2, true);
    }
    return u2 && n$2.batchedUpdates(() => u2(c2, t2, t2.item)), c2;
  }
  function _e(t2, e2) {
    let n2 = { ...t2.springs };
    return e2 && Ve(ht$1(e2), (r2) => {
      l$3.und(r2.keys) && (r2 = Pe(r2)), l$3.obj(r2.to) || (r2 = { ...r2, to: void 0 }), Mt(n2, r2, (o2) => Lt(o2));
    }), pt(t2, n2), n2;
  }
  function pt(t2, e2) {
    xt(e2, (n2, r2) => {
      t2.springs[r2] || (t2.springs[r2] = n2, Gt$1(n2, t2));
    });
  }
  function Lt(t2, e2) {
    let n2 = new ue();
    return n2.key = t2, e2 && Gt$1(n2, e2), n2;
  }
  function Mt(t2, e2, n2) {
    e2.keys && Ve(e2.keys, (r2) => {
      (t2[r2] || (t2[r2] = n2(r2)))._prepareNode(e2);
    });
  }
  function jt(t2, e2) {
    Ve(e2, (n2) => {
      Mt(t2.springs, n2, (r2) => Lt(r2, t2));
    });
  }
  var H$1 = ({ children: t2, ...e2 }) => {
    let n2 = React$1.useContext(Ge), r2 = e2.pause || !!n2.pause, o2 = e2.immediate || !!n2.immediate;
    e2 = Lr(() => ({ pause: r2, immediate: o2 }), [r2, o2]);
    let { Provider: s2 } = Ge;
    return React__namespace.createElement(s2, { value: e2 }, t2);
  }, Ge = wn(H$1, {});
  H$1.Provider = Ge.Provider;
  H$1.Consumer = Ge.Consumer;
  function wn(t2, e2) {
    return Object.assign(t2, React__namespace.createContext(e2)), t2.Provider._context = t2, t2.Consumer._context = t2, t2;
  }
  var fe = () => {
    let t2 = [], e2 = function(r2) {
      er$1();
      let o2 = [];
      return Ve(t2, (s2, a2) => {
        if (l$3.und(r2))
          o2.push(s2.start());
        else {
          let i2 = n2(r2, s2, a2);
          i2 && o2.push(s2.start(i2));
        }
      }), o2;
    };
    e2.current = t2, e2.add = function(r2) {
      t2.includes(r2) || t2.push(r2);
    }, e2.delete = function(r2) {
      let o2 = t2.indexOf(r2);
      ~o2 && t2.splice(o2, 1);
    }, e2.pause = function() {
      return Ve(t2, (r2) => r2.pause(...arguments)), this;
    }, e2.resume = function() {
      return Ve(t2, (r2) => r2.resume(...arguments)), this;
    }, e2.set = function(r2) {
      Ve(t2, (o2, s2) => {
        let a2 = l$3.fun(r2) ? r2(s2, o2) : r2;
        a2 && o2.set(a2);
      });
    }, e2.start = function(r2) {
      let o2 = [];
      return Ve(t2, (s2, a2) => {
        if (l$3.und(r2))
          o2.push(s2.start());
        else {
          let i2 = this._getProps(r2, s2, a2);
          i2 && o2.push(s2.start(i2));
        }
      }), o2;
    }, e2.stop = function() {
      return Ve(t2, (r2) => r2.stop(...arguments)), this;
    }, e2.update = function(r2) {
      return Ve(t2, (o2, s2) => o2.update(this._getProps(r2, o2, s2))), this;
    };
    let n2 = function(r2, o2, s2) {
      return l$3.fun(r2) ? r2(s2, o2) : r2;
    };
    return e2._getProps = n2, e2;
  };
  function He(t2, e2, n2) {
    let r2 = l$3.fun(e2) && e2;
    r2 && !n2 && (n2 = []);
    let o2 = React$1.useMemo(() => r2 || arguments.length == 3 ? fe() : void 0, []), s2 = React$1.useRef(0), a2 = Mr(), i2 = React$1.useMemo(() => ({ ctrls: [], queue: [], flush(h2, g2) {
      let x2 = _e(h2, g2);
      return s2.current > 0 && !i2.queue.length && !Object.keys(x2).some((A2) => !h2.springs[A2]) ? ze(h2, g2) : new Promise((A2) => {
        pt(h2, x2), i2.queue.push(() => {
          A2(ze(h2, g2));
        }), a2();
      });
    } }), []), u2 = React$1.useRef([...i2.ctrls]), p2 = [], f2 = Ur(t2) || 0;
    React$1.useMemo(() => {
      Ve(u2.current.slice(t2, f2), (h2) => {
        xe(h2, o2), h2.stop(true);
      }), u2.current.length = t2, d2(f2, t2);
    }, [t2]), React$1.useMemo(() => {
      d2(0, Math.min(f2, t2));
    }, n2);
    function d2(h2, g2) {
      for (let x2 = h2; x2 < g2; x2++) {
        let S2 = u2.current[x2] || (u2.current[x2] = new le(null, i2.flush)), A2 = r2 ? r2(x2, S2) : e2[x2];
        A2 && (p2[x2] = Ot(A2));
      }
    }
    let m2 = u2.current.map((h2, g2) => _e(h2, p2[g2])), b2 = React$1.useContext(H$1), c2 = Ur(b2), P2 = b2 !== c2 && Ue(b2);
    Q$1(() => {
      s2.current++, i2.ctrls = u2.current;
      let { queue: h2 } = i2;
      h2.length && (i2.queue = [], Ve(h2, (g2) => g2())), Ve(u2.current, (g2, x2) => {
        o2 == null ? void 0 : o2.add(g2), P2 && g2.start({ default: b2 });
        let S2 = p2[x2];
        S2 && (he(g2, S2.ref), g2.ref ? g2.queue.push(S2) : g2.start(S2));
      });
    }), $r(() => () => {
      Ve(i2.ctrls, (h2) => h2.stop(true));
    });
    let l2 = m2.map((h2) => ({ ...h2 }));
    return o2 ? [l2, o2] : l2;
  }
  function J(t2, e2) {
    let n2 = l$3.fun(t2), [[r2], o2] = He(1, n2 ? t2 : [t2], n2 ? e2 || [] : e2);
    return n2 || arguments.length == 2 ? [r2, o2] : r2;
  }
  var Gn = () => fe(), Xo = () => React$1.useState(Gn)[0];
  function Gt(t2, e2, n2) {
    let r2 = l$3.fun(e2) && e2, { reset: o2, sort: s2, trail: a2 = 0, expires: i2 = true, exitBeforeEnter: u2 = false, onDestroyed: p2, ref: f2, config: d2 } = r2 ? r2() : e2, m2 = React$1.useMemo(() => r2 || arguments.length == 3 ? fe() : void 0, []), b2 = ht$1(t2), c2 = [], P2 = React$1.useRef(null), l2 = o2 ? null : P2.current;
    Q$1(() => {
      P2.current = c2;
    }), $r(() => (Ve(c2, (y2) => {
      m2 == null ? void 0 : m2.add(y2.ctrl), y2.ctrl.ref = m2;
    }), () => {
      Ve(P2.current, (y2) => {
        y2.expired && clearTimeout(y2.expirationId), xe(y2.ctrl, m2), y2.ctrl.stop(true);
      });
    }));
    let h2 = tr(b2, r2 ? r2() : e2, l2), g2 = o2 && P2.current || [];
    Q$1(() => Ve(g2, ({ ctrl: y2, item: T2, key: F2 }) => {
      xe(y2, m2), I$1(p2, T2, F2);
    }));
    let x2 = [];
    if (l2 && Ve(l2, (y2, T2) => {
      y2.expired ? (clearTimeout(y2.expirationId), g2.push(y2)) : (T2 = x2[T2] = h2.indexOf(y2.key), ~T2 && (c2[T2] = y2));
    }), Ve(b2, (y2, T2) => {
      c2[T2] || (c2[T2] = { key: h2[T2], item: y2, phase: "mount", ctrl: new le() }, c2[T2].ctrl.item = y2);
    }), x2.length) {
      let y2 = -1, { leave: T2 } = r2 ? r2() : e2;
      Ve(x2, (F2, k2) => {
        let O2 = l2[k2];
        ~F2 ? (y2 = c2.indexOf(O2), c2[y2] = { ...O2, item: b2[F2] }) : T2 && c2.splice(++y2, 0, O2);
      });
    }
    l$3.fun(s2) && c2.sort((y2, T2) => s2(y2.item, T2.item));
    let S2 = -a2, A2 = Mr(), V2 = ne(e2), _2 = /* @__PURE__ */ new Map(), v2 = React$1.useRef(/* @__PURE__ */ new Map()), w2 = React$1.useRef(false);
    Ve(c2, (y2, T2) => {
      let F2 = y2.key, k2 = y2.phase, O2 = r2 ? r2() : e2, U2, D2, Jt2 = I$1(O2.delay || 0, F2);
      if (k2 == "mount")
        U2 = O2.enter, D2 = "enter";
      else {
        let M2 = h2.indexOf(F2) < 0;
        if (k2 != "leave")
          if (M2)
            U2 = O2.leave, D2 = "leave";
          else if (U2 = O2.update)
            D2 = "update";
          else
            return;
        else if (!M2)
          U2 = O2.enter, D2 = "enter";
        else
          return;
      }
      if (U2 = I$1(U2, y2.item, T2), U2 = l$3.obj(U2) ? de(U2) : { to: U2 }, !U2.config) {
        let M2 = d2 || V2.config;
        U2.config = I$1(M2, y2.item, T2, D2);
      }
      S2 += a2;
      let Z2 = { ...V2, delay: Jt2 + S2, ref: f2, immediate: O2.immediate, reset: false, ...U2 };
      if (D2 == "enter" && l$3.und(Z2.from)) {
        let M2 = r2 ? r2() : e2, Te2 = l$3.und(M2.initial) || l2 ? M2.from : M2.initial;
        Z2.from = I$1(Te2, y2.item, T2);
      }
      let { onResolve: Wt } = Z2;
      Z2.onResolve = (M2) => {
        I$1(Wt, M2);
        let Te2 = P2.current, B2 = Te2.find((Fe) => Fe.key === F2);
        if (!!B2 && !(M2.cancelled && B2.phase != "update") && B2.ctrl.idle) {
          let Fe = Te2.every((ee2) => ee2.ctrl.idle);
          if (B2.phase == "leave") {
            let ee2 = I$1(i2, B2.item);
            if (ee2 !== false) {
              let Ze = ee2 === true ? 0 : ee2;
              if (B2.expired = true, !Fe && Ze > 0) {
                Ze <= 2147483647 && (B2.expirationId = setTimeout(A2, Ze));
                return;
              }
            }
          }
          Fe && Te2.some((ee2) => ee2.expired) && (v2.current.delete(B2), u2 && (w2.current = true), A2());
        }
      };
      let ft = _e(y2.ctrl, Z2);
      D2 === "leave" && u2 ? v2.current.set(y2, { phase: D2, springs: ft, payload: Z2 }) : _2.set(y2, { phase: D2, springs: ft, payload: Z2 });
    });
    let C2 = React$1.useContext(H$1), $2 = Ur(C2), L2 = C2 !== $2 && Ue(C2);
    Q$1(() => {
      L2 && Ve(c2, (y2) => {
        y2.ctrl.start({ default: C2 });
      });
    }, [C2]), Ve(_2, (y2, T2) => {
      if (v2.current.size) {
        let F2 = c2.findIndex((k2) => k2.key === T2.key);
        c2.splice(F2, 1);
      }
    }), Q$1(() => {
      Ve(v2.current.size ? v2.current : _2, ({ phase: y2, payload: T2 }, F2) => {
        let { ctrl: k2 } = F2;
        F2.phase = y2, m2 == null ? void 0 : m2.add(k2), L2 && y2 == "enter" && k2.start({ default: C2 }), T2 && (he(k2, T2.ref), (k2.ref || m2) && !w2.current ? k2.update(T2) : (k2.start(T2), w2.current && (w2.current = false)));
      });
    }, o2 ? void 0 : n2);
    let N2 = (y2) => React__namespace.createElement(React__namespace.Fragment, null, c2.map((T2, F2) => {
      let { springs: k2 } = _2.get(T2) || T2.ctrl, O2 = y2({ ...k2 }, T2.item, T2, F2);
      return O2 && O2.type ? React__namespace.createElement(O2.type, { ...O2.props, key: l$3.str(T2.key) || l$3.num(T2.key) ? T2.key : T2.ctrl.id, ref: O2.ref }) : O2;
    }));
    return m2 ? [N2, m2] : N2;
  }
  var er = 1;
  function tr(t2, { key: e2, keys: n2 = e2 }, r2) {
    if (n2 === null) {
      let o2 = /* @__PURE__ */ new Set();
      return t2.map((s2) => {
        let a2 = r2 && r2.find((i2) => i2.item === s2 && i2.phase !== "leave" && !o2.has(i2));
        return a2 ? (o2.add(a2), a2.key) : er++;
      });
    }
    return l$3.und(n2) ? t2 : l$3.fun(n2) ? t2.map(n2) : ht$1(n2);
  }
  var W$1 = class W extends X {
    constructor(n2, r2) {
      super();
      __publicField(this, "key");
      __publicField(this, "idle", true);
      __publicField(this, "calc");
      __publicField(this, "_active", /* @__PURE__ */ new Set());
      this.source = n2;
      this.calc = W$2(...r2);
      let o2 = this._get(), s2 = Le$1(o2);
      D$2(this, s2.create(o2));
    }
    advance(n2) {
      let r2 = this._get(), o2 = this.get();
      bt$1(r2, o2) || (k$2(this).setValue(r2), this._onChange(r2, this.idle)), !this.idle && Yt(this._active) && ct(this);
    }
    _get() {
      let n2 = l$3.arr(this.source) ? this.source.map(ve) : ht$1(ve(this.source));
      return this.calc(...n2);
    }
    _start() {
      this.idle && !Yt(this._active) && (this.idle = false, Ve(F$2(this), (n2) => {
        n2.done = false;
      }), p$2.skipAnimation ? (n$2.batchedUpdates(() => this.advance()), ct(this)) : qe$1.start(this));
    }
    _attach() {
      let n2 = 1;
      Ve(ht$1(this.source), (r2) => {
        Pt(r2) && Gt$1(r2, this), Re(r2) && (r2.idle || this._active.add(r2), n2 = Math.max(n2, r2.priority + 1));
      }), this.priority = n2, this._start();
    }
    _detach() {
      Ve(ht$1(this.source), (n2) => {
        Pt(n2) && Qt(n2, this);
      }), this._active.clear(), ct(this);
    }
    eventObserved(n2) {
      n2.type == "change" ? n2.idle ? this.advance() : (this._active.add(n2.parent), this._start()) : n2.type == "idle" ? this._active.delete(n2.parent) : n2.type == "priority" && (this.priority = ht$1(this.source).reduce((r2, o2) => Math.max(r2, (Re(o2) ? o2.priority : 0) + 1), 0));
    }
  };
  function vr(t2) {
    return t2.idle !== false;
  }
  function Yt(t2) {
    return !t2.size || Array.from(t2).every(vr);
  }
  function ct(t2) {
    t2.idle || (t2.idle = true, Ve(F$2(t2), (e2) => {
      e2.done = true;
    }), $t(t2, { type: "idle", parent: t2 }));
  }
  p$2.assign({ createStringInterpolator: Xt, to: (t2, e2) => new W$1(t2, e2) });
  var k$1 = /^--/;
  function I(t2, e2) {
    return e2 == null || typeof e2 == "boolean" || e2 === "" ? "" : typeof e2 == "number" && e2 !== 0 && !k$1.test(t2) && !(c$2.hasOwnProperty(t2) && c$2[t2]) ? e2 + "px" : ("" + e2).trim();
  }
  var v$1 = {};
  function V$1(t2, e2) {
    if (!t2.nodeType || !t2.setAttribute)
      return false;
    let r2 = t2.nodeName === "filter" || t2.parentNode && t2.parentNode.nodeName === "filter", { style: i2, children: s2, scrollTop: u2, scrollLeft: l2, viewBox: a2, ...n2 } = e2, d2 = Object.values(n2), m2 = Object.keys(n2).map((o2) => r2 || t2.hasAttribute(o2) ? o2 : v$1[o2] || (v$1[o2] = o2.replace(/([A-Z])/g, (p2) => "-" + p2.toLowerCase())));
    s2 !== void 0 && (t2.textContent = s2);
    for (let o2 in i2)
      if (i2.hasOwnProperty(o2)) {
        let p2 = I(o2, i2[o2]);
        k$1.test(o2) ? t2.style.setProperty(o2, p2) : t2.style[o2] = p2;
      }
    m2.forEach((o2, p2) => {
      t2.setAttribute(o2, d2[p2]);
    }), u2 !== void 0 && (t2.scrollTop = u2), l2 !== void 0 && (t2.scrollLeft = l2), a2 !== void 0 && t2.setAttribute("viewBox", a2);
  }
  var c$2 = { animationIterationCount: true, borderImageOutset: true, borderImageSlice: true, borderImageWidth: true, boxFlex: true, boxFlexGroup: true, boxOrdinalGroup: true, columnCount: true, columns: true, flex: true, flexGrow: true, flexPositive: true, flexShrink: true, flexNegative: true, flexOrder: true, gridRow: true, gridRowEnd: true, gridRowSpan: true, gridRowStart: true, gridColumn: true, gridColumnEnd: true, gridColumnSpan: true, gridColumnStart: true, fontWeight: true, lineClamp: true, lineHeight: true, opacity: true, order: true, orphans: true, tabSize: true, widows: true, zIndex: true, zoom: true, fillOpacity: true, floodOpacity: true, stopOpacity: true, strokeDasharray: true, strokeDashoffset: true, strokeMiterlimit: true, strokeOpacity: true, strokeWidth: true }, F$1 = (t2, e2) => t2 + e2.charAt(0).toUpperCase() + e2.substring(1), L$2 = ["Webkit", "Ms", "Moz", "O"];
  c$2 = Object.keys(c$2).reduce((t2, e2) => (L$2.forEach((r2) => t2[F$1(r2, e2)] = t2[e2]), t2), c$2);
  var _ = /^(matrix|translate|scale|rotate|skew)/, $$1 = /^(translate)/, G = /^(rotate|skew)/, y$2 = (t2, e2) => l$3.num(t2) && t2 !== 0 ? t2 + e2 : t2, h$2 = (t2, e2) => l$3.arr(t2) ? t2.every((r2) => h$2(r2, e2)) : l$3.num(t2) ? t2 === e2 : parseFloat(t2) === e2, g$2 = class g extends u$2 {
    constructor({ x: e2, y: r2, z: i2, ...s2 }) {
      let u2 = [], l2 = [];
      (e2 || r2 || i2) && (u2.push([e2 || 0, r2 || 0, i2 || 0]), l2.push((a2) => [`translate3d(${a2.map((n2) => y$2(n2, "px")).join(",")})`, h$2(a2, 0)])), xt(s2, (a2, n2) => {
        if (n2 === "transform")
          u2.push([a2 || ""]), l2.push((d2) => [d2, d2 === ""]);
        else if (_.test(n2)) {
          if (delete s2[n2], l$3.und(a2))
            return;
          let d2 = $$1.test(n2) ? "px" : G.test(n2) ? "deg" : "";
          u2.push(ht$1(a2)), l2.push(n2 === "rotate3d" ? ([m2, o2, p2, O2]) => [`rotate3d(${m2},${o2},${p2},${y$2(O2, d2)})`, h$2(O2, 0)] : (m2) => [`${n2}(${m2.map((o2) => y$2(o2, d2)).join(",")})`, h$2(m2, n2.startsWith("scale") ? 1 : 0)]);
        }
      }), u2.length && (s2.transform = new x$2(u2, l2)), super(s2);
    }
  }, x$2 = class x extends ge {
    constructor(r2, i2) {
      super();
      __publicField(this, "_value", null);
      this.inputs = r2;
      this.transforms = i2;
    }
    get() {
      return this._value || (this._value = this._get());
    }
    _get() {
      let r2 = "", i2 = true;
      return Ve(this.inputs, (s2, u2) => {
        let l2 = ve(s2[0]), [a2, n2] = this.transforms[u2](l$3.arr(l2) ? l2 : s2.map(ve));
        r2 += " " + a2, i2 = i2 && n2;
      }), i2 ? "none" : r2;
    }
    observerAdded(r2) {
      r2 == 1 && Ve(this.inputs, (i2) => Ve(i2, (s2) => Pt(s2) && Gt$1(s2, this)));
    }
    observerRemoved(r2) {
      r2 == 0 && Ve(this.inputs, (i2) => Ve(i2, (s2) => Pt(s2) && Qt(s2, this)));
    }
    eventObserved(r2) {
      r2.type == "change" && (this._value = null), $t(this, r2);
    }
  };
  var C$1 = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"];
  p$2.assign({ batchedUpdates: require$$2.unstable_batchedUpdates, createStringInterpolator: Xt, colors: It });
  var q = Ke(C$1, { applyAnimatedValues: V$1, createAnimatedStyle: (t2) => new g$2(t2), getComponentProps: ({ scrollTop: t2, scrollLeft: e2, ...r2 }) => r2 }), it = q.animated;
  const MenuBar = newStyled.div(
    {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      userSelect: "none",
      padding: "8px 8px",
      position: "relative",
      height: 50,
      fontFamily: "华文新魏"
    },
    ({ isDragging }) => ({
      cursor: isDragging ? "grabbing" : "grab"
    })
  );
  const MenuButton = newStyled.div(
    {
      fontSize: 24,
      fontFamily: "华文新魏",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    ({ theme: theme2, disabled }) => ({
      // color: theme.colors.active,
      "&:hover": {
        transform: disabled ? void 0 : "scale(1.2) rotate(30deg)",
        transition: disabled ? void 0 : "transform 500ms"
      }
    })
  );
  function t(t2) {
    return t2.split("-")[1];
  }
  function e(t2) {
    return "y" === t2 ? "height" : "width";
  }
  function n$1(t2) {
    return t2.split("-")[0];
  }
  function o$1(t2) {
    return ["top", "bottom"].includes(n$1(t2)) ? "x" : "y";
  }
  function i$1(i2, r2, a2) {
    let { reference: l2, floating: s2 } = i2;
    const c2 = l2.x + l2.width / 2 - s2.width / 2, f2 = l2.y + l2.height / 2 - s2.height / 2, m2 = o$1(r2), u2 = e(m2), g2 = l2[u2] / 2 - s2[u2] / 2, d2 = "x" === m2;
    let p2;
    switch (n$1(r2)) {
      case "top":
        p2 = { x: c2, y: l2.y - s2.height };
        break;
      case "bottom":
        p2 = { x: c2, y: l2.y + l2.height };
        break;
      case "right":
        p2 = { x: l2.x + l2.width, y: f2 };
        break;
      case "left":
        p2 = { x: l2.x - s2.width, y: f2 };
        break;
      default:
        p2 = { x: l2.x, y: l2.y };
    }
    switch (t(r2)) {
      case "start":
        p2[m2] -= g2 * (a2 && d2 ? -1 : 1);
        break;
      case "end":
        p2[m2] += g2 * (a2 && d2 ? -1 : 1);
    }
    return p2;
  }
  const r$1 = async (t2, e2, n2) => {
    const { placement: o2 = "bottom", strategy: r2 = "absolute", middleware: a2 = [], platform: l2 } = n2, s2 = a2.filter(Boolean), c2 = await (null == l2.isRTL ? void 0 : l2.isRTL(e2));
    let f2 = await l2.getElementRects({ reference: t2, floating: e2, strategy: r2 }), { x: m2, y: u2 } = i$1(f2, o2, c2), g2 = o2, d2 = {}, p2 = 0;
    for (let n3 = 0; n3 < s2.length; n3++) {
      const { name: a3, fn: h2 } = s2[n3], { x: y2, y: x2, data: w2, reset: v2 } = await h2({ x: m2, y: u2, initialPlacement: o2, placement: g2, strategy: r2, middlewareData: d2, rects: f2, platform: l2, elements: { reference: t2, floating: e2 } });
      m2 = null != y2 ? y2 : m2, u2 = null != x2 ? x2 : u2, d2 = { ...d2, [a3]: { ...d2[a3], ...w2 } }, v2 && p2 <= 50 && (p2++, "object" == typeof v2 && (v2.placement && (g2 = v2.placement), v2.rects && (f2 = true === v2.rects ? await l2.getElementRects({ reference: t2, floating: e2, strategy: r2 }) : v2.rects), { x: m2, y: u2 } = i$1(f2, g2, c2)), n3 = -1);
    }
    return { x: m2, y: u2, placement: g2, strategy: r2, middlewareData: d2 };
  };
  function a$1(t2) {
    return "number" != typeof t2 ? function(t3) {
      return { top: 0, right: 0, bottom: 0, left: 0, ...t3 };
    }(t2) : { top: t2, right: t2, bottom: t2, left: t2 };
  }
  function l$1(t2) {
    return { ...t2, top: t2.y, left: t2.x, right: t2.x + t2.width, bottom: t2.y + t2.height };
  }
  async function s$1(t2, e2) {
    var n2;
    void 0 === e2 && (e2 = {});
    const { x: o2, y: i2, platform: r2, rects: s2, elements: c2, strategy: f2 } = t2, { boundary: m2 = "clippingAncestors", rootBoundary: u2 = "viewport", elementContext: g2 = "floating", altBoundary: d2 = false, padding: p2 = 0 } = e2, h2 = a$1(p2), y2 = c2[d2 ? "floating" === g2 ? "reference" : "floating" : g2], x2 = l$1(await r2.getClippingRect({ element: null == (n2 = await (null == r2.isElement ? void 0 : r2.isElement(y2))) || n2 ? y2 : y2.contextElement || await (null == r2.getDocumentElement ? void 0 : r2.getDocumentElement(c2.floating)), boundary: m2, rootBoundary: u2, strategy: f2 })), w2 = "floating" === g2 ? { ...s2.floating, x: o2, y: i2 } : s2.reference, v2 = await (null == r2.getOffsetParent ? void 0 : r2.getOffsetParent(c2.floating)), b2 = await (null == r2.isElement ? void 0 : r2.isElement(v2)) && await (null == r2.getScale ? void 0 : r2.getScale(v2)) || { x: 1, y: 1 }, A2 = l$1(r2.convertOffsetParentRelativeRectToViewportRelativeRect ? await r2.convertOffsetParentRelativeRectToViewportRelativeRect({ rect: w2, offsetParent: v2, strategy: f2 }) : w2);
    return { top: (x2.top - A2.top + h2.top) / b2.y, bottom: (A2.bottom - x2.bottom + h2.bottom) / b2.y, left: (x2.left - A2.left + h2.left) / b2.x, right: (A2.right - x2.right + h2.right) / b2.x };
  }
  const c$1 = Math.min, f$1 = Math.max;
  function m$1(t2, e2, n2) {
    return f$1(t2, c$1(e2, n2));
  }
  const u$1 = (n2) => ({ name: "arrow", options: n2, async fn(i2) {
    const { element: r2, padding: l2 = 0 } = n2 || {}, { x: s2, y: c2, placement: f2, rects: u2, platform: g2, elements: d2 } = i2;
    if (null == r2)
      return {};
    const p2 = a$1(l2), h2 = { x: s2, y: c2 }, y2 = o$1(f2), x2 = e(y2), w2 = await g2.getDimensions(r2), v2 = "y" === y2, b2 = v2 ? "top" : "left", A2 = v2 ? "bottom" : "right", R2 = v2 ? "clientHeight" : "clientWidth", P2 = u2.reference[x2] + u2.reference[y2] - h2[y2] - u2.floating[x2], E2 = h2[y2] - u2.reference[y2], T2 = await (null == g2.getOffsetParent ? void 0 : g2.getOffsetParent(r2));
    let D2 = T2 ? T2[R2] : 0;
    D2 && await (null == g2.isElement ? void 0 : g2.isElement(T2)) || (D2 = d2.floating[R2] || u2.floating[x2]);
    const L2 = P2 / 2 - E2 / 2, k2 = p2[b2], O2 = D2 - w2[x2] - p2[A2], B2 = D2 / 2 - w2[x2] / 2 + L2, C2 = m$1(k2, B2, O2), H2 = null != t(f2) && B2 != C2 && u2.reference[x2] / 2 - (B2 < k2 ? p2[b2] : p2[A2]) - w2[x2] / 2 < 0;
    return { [y2]: h2[y2] - (H2 ? B2 < k2 ? k2 - B2 : O2 - B2 : 0), data: { [y2]: C2, centerOffset: B2 - C2 } };
  } }), g$1 = ["top", "right", "bottom", "left"];
  g$1.reduce((t2, e2) => t2.concat(e2, e2 + "-start", e2 + "-end"), []);
  const p$1 = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function h$1(t2) {
    return t2.replace(/left|right|bottom|top/g, (t3) => p$1[t3]);
  }
  function y$1(n2, i2, r2) {
    void 0 === r2 && (r2 = false);
    const a2 = t(n2), l2 = o$1(n2), s2 = e(l2);
    let c2 = "x" === l2 ? a2 === (r2 ? "end" : "start") ? "right" : "left" : "start" === a2 ? "bottom" : "top";
    return i2.reference[s2] > i2.floating[s2] && (c2 = h$1(c2)), { main: c2, cross: h$1(c2) };
  }
  const x$1 = { start: "end", end: "start" };
  function w$1(t2) {
    return t2.replace(/start|end/g, (t3) => x$1[t3]);
  }
  const b$1 = function(e2) {
    return void 0 === e2 && (e2 = {}), { name: "flip", options: e2, async fn(o2) {
      var i2;
      const { placement: r2, middlewareData: a2, rects: l2, initialPlacement: c2, platform: f2, elements: m2 } = o2, { mainAxis: u2 = true, crossAxis: g2 = true, fallbackPlacements: d2, fallbackStrategy: p2 = "bestFit", fallbackAxisSideDirection: x2 = "none", flipAlignment: v2 = true, ...b2 } = e2, A2 = n$1(r2), R2 = n$1(c2) === c2, P2 = await (null == f2.isRTL ? void 0 : f2.isRTL(m2.floating)), E2 = d2 || (R2 || !v2 ? [h$1(c2)] : function(t2) {
        const e3 = h$1(t2);
        return [w$1(t2), e3, w$1(e3)];
      }(c2));
      d2 || "none" === x2 || E2.push(...function(e3, o3, i3, r3) {
        const a3 = t(e3);
        let l3 = function(t2, e4, n2) {
          const o4 = ["left", "right"], i4 = ["right", "left"], r4 = ["top", "bottom"], a4 = ["bottom", "top"];
          switch (t2) {
            case "top":
            case "bottom":
              return n2 ? e4 ? i4 : o4 : e4 ? o4 : i4;
            case "left":
            case "right":
              return e4 ? r4 : a4;
            default:
              return [];
          }
        }(n$1(e3), "start" === i3, r3);
        return a3 && (l3 = l3.map((t2) => t2 + "-" + a3), o3 && (l3 = l3.concat(l3.map(w$1)))), l3;
      }(c2, v2, x2, P2));
      const T2 = [c2, ...E2], D2 = await s$1(o2, b2), L2 = [];
      let k2 = (null == (i2 = a2.flip) ? void 0 : i2.overflows) || [];
      if (u2 && L2.push(D2[A2]), g2) {
        const { main: t2, cross: e3 } = y$1(r2, l2, P2);
        L2.push(D2[t2], D2[e3]);
      }
      if (k2 = [...k2, { placement: r2, overflows: L2 }], !L2.every((t2) => t2 <= 0)) {
        var O2, B2;
        const t2 = ((null == (O2 = a2.flip) ? void 0 : O2.index) || 0) + 1, e3 = T2[t2];
        if (e3)
          return { data: { index: t2, overflows: k2 }, reset: { placement: e3 } };
        let n2 = null == (B2 = k2.filter((t3) => t3.overflows[0] <= 0).sort((t3, e4) => t3.overflows[1] - e4.overflows[1])[0]) ? void 0 : B2.placement;
        if (!n2)
          switch (p2) {
            case "bestFit": {
              var C2;
              const t3 = null == (C2 = k2.map((t4) => [t4.placement, t4.overflows.filter((t5) => t5 > 0).reduce((t5, e4) => t5 + e4, 0)]).sort((t4, e4) => t4[1] - e4[1])[0]) ? void 0 : C2[0];
              t3 && (n2 = t3);
              break;
            }
            case "initialPlacement":
              n2 = c2;
          }
        if (r2 !== n2)
          return { reset: { placement: n2 } };
      }
      return {};
    } };
  };
  const D$1 = function(e2) {
    return void 0 === e2 && (e2 = 0), { name: "offset", options: e2, async fn(i2) {
      const { x: r2, y: a2 } = i2, l2 = await async function(e3, i3) {
        const { placement: r3, platform: a3, elements: l3 } = e3, s2 = await (null == a3.isRTL ? void 0 : a3.isRTL(l3.floating)), c2 = n$1(r3), f2 = t(r3), m2 = "x" === o$1(r3), u2 = ["left", "top"].includes(c2) ? -1 : 1, g2 = s2 && m2 ? -1 : 1, d2 = "function" == typeof i3 ? i3(e3) : i3;
        let { mainAxis: p2, crossAxis: h2, alignmentAxis: y2 } = "number" == typeof d2 ? { mainAxis: d2, crossAxis: 0, alignmentAxis: null } : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...d2 };
        return f2 && "number" == typeof y2 && (h2 = "end" === f2 ? -1 * y2 : y2), m2 ? { x: h2 * g2, y: p2 * u2 } : { x: p2 * u2, y: h2 * g2 };
      }(i2, e2);
      return { x: r2 + l2.x, y: a2 + l2.y, data: l2 };
    } };
  };
  function L$1(t2) {
    return "x" === t2 ? "y" : "x";
  }
  const k = function(t2) {
    return void 0 === t2 && (t2 = {}), { name: "shift", options: t2, async fn(e2) {
      const { x: i2, y: r2, placement: a2 } = e2, { mainAxis: l2 = true, crossAxis: c2 = false, limiter: f2 = { fn: (t3) => {
        let { x: e3, y: n2 } = t3;
        return { x: e3, y: n2 };
      } }, ...u2 } = t2, g2 = { x: i2, y: r2 }, d2 = await s$1(e2, u2), p2 = o$1(n$1(a2)), h2 = L$1(p2);
      let y2 = g2[p2], x2 = g2[h2];
      if (l2) {
        const t3 = "y" === p2 ? "bottom" : "right";
        y2 = m$1(y2 + d2["y" === p2 ? "top" : "left"], y2, y2 - d2[t3]);
      }
      if (c2) {
        const t3 = "y" === h2 ? "bottom" : "right";
        x2 = m$1(x2 + d2["y" === h2 ? "top" : "left"], x2, x2 - d2[t3]);
      }
      const w2 = f2.fn({ ...e2, [p2]: y2, [h2]: x2 });
      return { ...w2, data: { x: w2.x - i2, y: w2.y - r2 } };
    } };
  };
  function n(t2) {
    var e2;
    return (null == (e2 = t2.ownerDocument) ? void 0 : e2.defaultView) || window;
  }
  function o(t2) {
    return n(t2).getComputedStyle(t2);
  }
  function i(t2) {
    return t2 instanceof n(t2).Node;
  }
  function r(t2) {
    return i(t2) ? (t2.nodeName || "").toLowerCase() : "";
  }
  let l;
  function c() {
    if (l)
      return l;
    const t2 = navigator.userAgentData;
    return t2 && Array.isArray(t2.brands) ? (l = t2.brands.map((t3) => t3.brand + "/" + t3.version).join(" "), l) : navigator.userAgent;
  }
  function s(t2) {
    return t2 instanceof n(t2).HTMLElement;
  }
  function f(t2) {
    return t2 instanceof n(t2).Element;
  }
  function u(t2) {
    if ("undefined" == typeof ShadowRoot)
      return false;
    return t2 instanceof n(t2).ShadowRoot || t2 instanceof ShadowRoot;
  }
  function a(t2) {
    const { overflow: e2, overflowX: n2, overflowY: i2, display: r2 } = o(t2);
    return /auto|scroll|overlay|hidden|clip/.test(e2 + i2 + n2) && !["inline", "contents"].includes(r2);
  }
  function d(t2) {
    return ["table", "td", "th"].includes(r(t2));
  }
  function h(t2) {
    const e2 = /firefox/i.test(c()), n2 = o(t2), i2 = n2.backdropFilter || n2.WebkitBackdropFilter;
    return "none" !== n2.transform || "none" !== n2.perspective || !!i2 && "none" !== i2 || e2 && "filter" === n2.willChange || e2 && !!n2.filter && "none" !== n2.filter || ["transform", "perspective"].some((t3) => n2.willChange.includes(t3)) || ["paint", "layout", "strict", "content"].some((t3) => {
      const e3 = n2.contain;
      return null != e3 && e3.includes(t3);
    });
  }
  function p() {
    return /^((?!chrome|android).)*safari/i.test(c());
  }
  function g(t2) {
    return ["html", "body", "#document"].includes(r(t2));
  }
  const m = Math.min, y = Math.max, x = Math.round;
  function w(t2) {
    const e2 = o(t2);
    let n2 = parseFloat(e2.width), i2 = parseFloat(e2.height);
    const r2 = s(t2), l2 = r2 ? t2.offsetWidth : n2, c2 = r2 ? t2.offsetHeight : i2, f2 = x(n2) !== l2 || x(i2) !== c2;
    return f2 && (n2 = l2, i2 = c2), { width: n2, height: i2, fallback: f2 };
  }
  function v(t2) {
    return f(t2) ? t2 : t2.contextElement;
  }
  const b = { x: 1, y: 1 };
  function L(t2) {
    const e2 = v(t2);
    if (!s(e2))
      return b;
    const n2 = e2.getBoundingClientRect(), { width: o2, height: i2, fallback: r2 } = w(e2);
    let l2 = (r2 ? x(n2.width) : n2.width) / o2, c2 = (r2 ? x(n2.height) : n2.height) / i2;
    return l2 && Number.isFinite(l2) || (l2 = 1), c2 && Number.isFinite(c2) || (c2 = 1), { x: l2, y: c2 };
  }
  function E(e2, o2, i2, r2) {
    var l2, c2;
    void 0 === o2 && (o2 = false), void 0 === i2 && (i2 = false);
    const s2 = e2.getBoundingClientRect(), u2 = v(e2);
    let a2 = b;
    o2 && (r2 ? f(r2) && (a2 = L(r2)) : a2 = L(e2));
    const d2 = u2 ? n(u2) : window, h2 = p() && i2;
    let g2 = (s2.left + (h2 && (null == (l2 = d2.visualViewport) ? void 0 : l2.offsetLeft) || 0)) / a2.x, m2 = (s2.top + (h2 && (null == (c2 = d2.visualViewport) ? void 0 : c2.offsetTop) || 0)) / a2.y, y2 = s2.width / a2.x, x2 = s2.height / a2.y;
    if (u2) {
      const t2 = n(u2), e3 = r2 && f(r2) ? n(r2) : r2;
      let o3 = t2.frameElement;
      for (; o3 && r2 && e3 !== t2; ) {
        const t3 = L(o3), e4 = o3.getBoundingClientRect(), i3 = getComputedStyle(o3);
        e4.x += (o3.clientLeft + parseFloat(i3.paddingLeft)) * t3.x, e4.y += (o3.clientTop + parseFloat(i3.paddingTop)) * t3.y, g2 *= t3.x, m2 *= t3.y, y2 *= t3.x, x2 *= t3.y, g2 += e4.x, m2 += e4.y, o3 = n(o3).frameElement;
      }
    }
    return l$1({ width: y2, height: x2, x: g2, y: m2 });
  }
  function T(t2) {
    return ((i(t2) ? t2.ownerDocument : t2.document) || window.document).documentElement;
  }
  function R(t2) {
    return f(t2) ? { scrollLeft: t2.scrollLeft, scrollTop: t2.scrollTop } : { scrollLeft: t2.pageXOffset, scrollTop: t2.pageYOffset };
  }
  function C(t2) {
    return E(T(t2)).left + R(t2).scrollLeft;
  }
  function F(t2) {
    if ("html" === r(t2))
      return t2;
    const e2 = t2.assignedSlot || t2.parentNode || u(t2) && t2.host || T(t2);
    return u(e2) ? e2.host : e2;
  }
  function W(t2) {
    const e2 = F(t2);
    return g(e2) ? e2.ownerDocument.body : s(e2) && a(e2) ? e2 : W(e2);
  }
  function D(t2, e2) {
    var o2;
    void 0 === e2 && (e2 = []);
    const i2 = W(t2), r2 = i2 === (null == (o2 = t2.ownerDocument) ? void 0 : o2.body), l2 = n(i2);
    return r2 ? e2.concat(l2, l2.visualViewport || [], a(i2) ? i2 : []) : e2.concat(i2, D(i2));
  }
  function S(e2, i2, r2) {
    let l2;
    if ("viewport" === i2)
      l2 = function(t2, e3) {
        const o2 = n(t2), i3 = T(t2), r3 = o2.visualViewport;
        let l3 = i3.clientWidth, c3 = i3.clientHeight, s2 = 0, f2 = 0;
        if (r3) {
          l3 = r3.width, c3 = r3.height;
          const t3 = p();
          (!t3 || t3 && "fixed" === e3) && (s2 = r3.offsetLeft, f2 = r3.offsetTop);
        }
        return { width: l3, height: c3, x: s2, y: f2 };
      }(e2, r2);
    else if ("document" === i2)
      l2 = function(t2) {
        const e3 = T(t2), n2 = R(t2), i3 = t2.ownerDocument.body, r3 = y(e3.scrollWidth, e3.clientWidth, i3.scrollWidth, i3.clientWidth), l3 = y(e3.scrollHeight, e3.clientHeight, i3.scrollHeight, i3.clientHeight);
        let c3 = -n2.scrollLeft + C(t2);
        const s2 = -n2.scrollTop;
        return "rtl" === o(i3).direction && (c3 += y(e3.clientWidth, i3.clientWidth) - r3), { width: r3, height: l3, x: c3, y: s2 };
      }(T(e2));
    else if (f(i2))
      l2 = function(t2, e3) {
        const n2 = E(t2, true, "fixed" === e3), o2 = n2.top + t2.clientTop, i3 = n2.left + t2.clientLeft, r3 = s(t2) ? L(t2) : { x: 1, y: 1 };
        return { width: t2.clientWidth * r3.x, height: t2.clientHeight * r3.y, x: i3 * r3.x, y: o2 * r3.y };
      }(i2, r2);
    else {
      const t2 = { ...i2 };
      if (p()) {
        var c2, u2;
        const o2 = n(e2);
        t2.x -= (null == (c2 = o2.visualViewport) ? void 0 : c2.offsetLeft) || 0, t2.y -= (null == (u2 = o2.visualViewport) ? void 0 : u2.offsetTop) || 0;
      }
      l2 = t2;
    }
    return l$1(l2);
  }
  function A(t2, e2) {
    return s(t2) && "fixed" !== o(t2).position ? e2 ? e2(t2) : t2.offsetParent : null;
  }
  function H(t2, e2) {
    const i2 = n(t2);
    if (!s(t2))
      return i2;
    let l2 = A(t2, e2);
    for (; l2 && d(l2) && "static" === o(l2).position; )
      l2 = A(l2, e2);
    return l2 && ("html" === r(l2) || "body" === r(l2) && "static" === o(l2).position && !h(l2)) ? i2 : l2 || function(t3) {
      let e3 = F(t3);
      for (; s(e3) && !g(e3); ) {
        if (h(e3))
          return e3;
        e3 = F(e3);
      }
      return null;
    }(t2) || i2;
  }
  function V(t2, e2, n2) {
    const o2 = s(e2), i2 = T(e2), l2 = E(t2, true, "fixed" === n2, e2);
    let c2 = { scrollLeft: 0, scrollTop: 0 };
    const f2 = { x: 0, y: 0 };
    if (o2 || !o2 && "fixed" !== n2)
      if (("body" !== r(e2) || a(i2)) && (c2 = R(e2)), s(e2)) {
        const t3 = E(e2, true);
        f2.x = t3.x + e2.clientLeft, f2.y = t3.y + e2.clientTop;
      } else
        i2 && (f2.x = C(i2));
    return { x: l2.left + c2.scrollLeft - f2.x, y: l2.top + c2.scrollTop - f2.y, width: l2.width, height: l2.height };
  }
  const O = { getClippingRect: function(t2) {
    let { element: e2, boundary: n2, rootBoundary: i2, strategy: l2 } = t2;
    const c2 = "clippingAncestors" === n2 ? function(t3, e3) {
      const n3 = e3.get(t3);
      if (n3)
        return n3;
      let i3 = D(t3).filter((t4) => f(t4) && "body" !== r(t4)), l3 = null;
      const c3 = "fixed" === o(t3).position;
      let s3 = c3 ? F(t3) : t3;
      for (; f(s3) && !g(s3); ) {
        const t4 = o(s3), e4 = h(s3);
        "fixed" === t4.position ? l3 = null : (c3 ? e4 || l3 : e4 || "static" !== t4.position || !l3 || !["absolute", "fixed"].includes(l3.position)) ? l3 = t4 : i3 = i3.filter((t5) => t5 !== s3), s3 = F(s3);
      }
      return e3.set(t3, i3), i3;
    }(e2, this._c) : [].concat(n2), s2 = [...c2, i2], u2 = s2[0], a2 = s2.reduce((t3, n3) => {
      const o2 = S(e2, n3, l2);
      return t3.top = y(o2.top, t3.top), t3.right = m(o2.right, t3.right), t3.bottom = m(o2.bottom, t3.bottom), t3.left = y(o2.left, t3.left), t3;
    }, S(e2, u2, l2));
    return { width: a2.right - a2.left, height: a2.bottom - a2.top, x: a2.left, y: a2.top };
  }, convertOffsetParentRelativeRectToViewportRelativeRect: function(t2) {
    let { rect: e2, offsetParent: n2, strategy: o2 } = t2;
    const i2 = s(n2), l2 = T(n2);
    if (n2 === l2)
      return e2;
    let c2 = { scrollLeft: 0, scrollTop: 0 }, f2 = { x: 1, y: 1 };
    const u2 = { x: 0, y: 0 };
    if ((i2 || !i2 && "fixed" !== o2) && (("body" !== r(n2) || a(l2)) && (c2 = R(n2)), s(n2))) {
      const t3 = E(n2);
      f2 = L(n2), u2.x = t3.x + n2.clientLeft, u2.y = t3.y + n2.clientTop;
    }
    return { width: e2.width * f2.x, height: e2.height * f2.y, x: e2.x * f2.x - c2.scrollLeft * f2.x + u2.x, y: e2.y * f2.y - c2.scrollTop * f2.y + u2.y };
  }, isElement: f, getDimensions: function(t2) {
    return w(t2);
  }, getOffsetParent: H, getDocumentElement: T, getScale: L, async getElementRects(t2) {
    let { reference: e2, floating: n2, strategy: o2 } = t2;
    const i2 = this.getOffsetParent || H, r2 = this.getDimensions;
    return { reference: V(e2, await i2(n2), o2), floating: { x: 0, y: 0, ...await r2(n2) } };
  }, getClientRects: (t2) => Array.from(t2.getClientRects()), isRTL: (t2) => "rtl" === o(t2).direction };
  const z = (t2, n2, o2) => {
    const i2 = /* @__PURE__ */ new Map(), r2 = { platform: O, ...o2 }, l2 = { ...r2.platform, _c: i2 };
    return r$1(t2, n2, { ...r2, platform: l2 });
  };
  const arrow = (options) => {
    const {
      element,
      padding
    } = options;
    function isRef(value) {
      return Object.prototype.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options,
      fn(args) {
        if (isRef(element)) {
          if (element.current != null) {
            return u$1({
              element: element.current,
              padding
            }).fn(args);
          }
          return {};
        } else if (element) {
          return u$1({
            element,
            padding
          }).fn(args);
        }
        return {};
      }
    };
  };
  var index$2 = typeof document !== "undefined" ? React$1.useLayoutEffect : React$1.useEffect;
  function deepEqual(a2, b2) {
    if (a2 === b2) {
      return true;
    }
    if (typeof a2 !== typeof b2) {
      return false;
    }
    if (typeof a2 === "function" && a2.toString() === b2.toString()) {
      return true;
    }
    let length2, i2, keys;
    if (a2 && b2 && typeof a2 == "object") {
      if (Array.isArray(a2)) {
        length2 = a2.length;
        if (length2 != b2.length)
          return false;
        for (i2 = length2; i2-- !== 0; ) {
          if (!deepEqual(a2[i2], b2[i2])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a2);
      length2 = keys.length;
      if (length2 !== Object.keys(b2).length) {
        return false;
      }
      for (i2 = length2; i2-- !== 0; ) {
        if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) {
          return false;
        }
      }
      for (i2 = length2; i2-- !== 0; ) {
        const key = keys[i2];
        if (key === "_owner" && a2.$$typeof) {
          continue;
        }
        if (!deepEqual(a2[key], b2[key])) {
          return false;
        }
      }
      return true;
    }
    return a2 !== a2 && b2 !== b2;
  }
  function useLatestRef$1(value) {
    const ref = React__namespace.useRef(value);
    index$2(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating$1(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware: middleware2 = [],
      platform,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = React__namespace.useState({
      x: null,
      y: null,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React__namespace.useState(middleware2);
    if (!deepEqual(latestMiddleware, middleware2)) {
      setLatestMiddleware(middleware2);
    }
    const referenceRef = React__namespace.useRef(null);
    const floatingRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef(data);
    const whileElementsMountedRef = useLatestRef$1(whileElementsMounted);
    const platformRef = useLatestRef$1(platform);
    const [reference, _setReference] = React__namespace.useState(null);
    const [floating, _setFloating] = React__namespace.useState(null);
    const setReference = React__namespace.useCallback((node2) => {
      if (referenceRef.current !== node2) {
        referenceRef.current = node2;
        _setReference(node2);
      }
    }, []);
    const setFloating = React__namespace.useCallback((node2) => {
      if (floatingRef.current !== node2) {
        floatingRef.current = node2;
        _setFloating(node2);
      }
    }, []);
    const update = React__namespace.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      z(referenceRef.current, floatingRef.current, config).then((data2) => {
        const fullData = {
          ...data2,
          isPositioned: true
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          require$$2__namespace.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef]);
    index$2(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React__namespace.useRef(false);
    index$2(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index$2(() => {
      if (reference && floating) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(reference, floating, update);
        } else {
          update();
        }
      }
    }, [reference, floating, update, whileElementsMountedRef]);
    const refs = React__namespace.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React__namespace.useMemo(() => ({
      reference,
      floating
    }), [reference, floating]);
    return React__namespace.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      reference: setReference,
      floating: setFloating
    }), [data, update, refs, elements, setReference, setFloating]);
  }
  /*!
  * tabbable 6.1.1
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  */
  var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
  var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
  var NoElement = typeof Element === "undefined";
  var matches = NoElement ? function() {
  } : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
    var _element$getRootNode;
    return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
  } : function(element) {
    return element === null || element === void 0 ? void 0 : element.ownerDocument;
  };
  var isInert = function isInert2(node2, lookUp) {
    var _node$getAttribute;
    if (lookUp === void 0) {
      lookUp = true;
    }
    var inertAtt = node2 === null || node2 === void 0 ? void 0 : (_node$getAttribute = node2.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node2, "inert");
    var inert = inertAtt === "" || inertAtt === "true";
    var result = inert || lookUp && node2 && isInert2(node2.parentNode);
    return result;
  };
  var isContentEditable = function isContentEditable2(node2) {
    var _node$getAttribute2;
    var attValue = node2 === null || node2 === void 0 ? void 0 : (_node$getAttribute2 = node2.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node2, "contenteditable");
    return attValue === "" || attValue === "true";
  };
  var getCandidates = function getCandidates2(el, includeContainer, filter) {
    if (isInert(el)) {
      return [];
    }
    var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
    if (includeContainer && matches.call(el, candidateSelector)) {
      candidates.unshift(el);
    }
    candidates = candidates.filter(filter);
    return candidates;
  };
  var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
    var candidates = [];
    var elementsToCheck = Array.from(elements);
    while (elementsToCheck.length) {
      var element = elementsToCheck.shift();
      if (isInert(element, false)) {
        continue;
      }
      if (element.tagName === "SLOT") {
        var assigned = element.assignedElements();
        var content = assigned.length ? assigned : element.children;
        var nestedCandidates = getCandidatesIteratively2(content, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: nestedCandidates
          });
        }
      } else {
        var validCandidate = matches.call(element, candidateSelector);
        if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
          candidates.push(element);
        }
        var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
        typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
        var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
        if (shadowRoot && validShadowRoot) {
          var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
          if (options.flatten) {
            candidates.push.apply(candidates, _nestedCandidates);
          } else {
            candidates.push({
              scopeParent: element,
              candidates: _nestedCandidates
            });
          }
        } else {
          elementsToCheck.unshift.apply(elementsToCheck, element.children);
        }
      }
    }
    return candidates;
  };
  var getTabindex = function getTabindex2(node2, isScope) {
    if (node2.tabIndex < 0) {
      if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node2.tagName) || isContentEditable(node2)) && isNaN(parseInt(node2.getAttribute("tabindex"), 10))) {
        return 0;
      }
    }
    return node2.tabIndex;
  };
  var sortOrderedTabbables = function sortOrderedTabbables2(a2, b2) {
    return a2.tabIndex === b2.tabIndex ? a2.documentOrder - b2.documentOrder : a2.tabIndex - b2.tabIndex;
  };
  var isInput = function isInput2(node2) {
    return node2.tagName === "INPUT";
  };
  var isHiddenInput = function isHiddenInput2(node2) {
    return isInput(node2) && node2.type === "hidden";
  };
  var isDetailsWithSummary = function isDetailsWithSummary2(node2) {
    var r2 = node2.tagName === "DETAILS" && Array.prototype.slice.apply(node2.children).some(function(child) {
      return child.tagName === "SUMMARY";
    });
    return r2;
  };
  var getCheckedRadio = function getCheckedRadio2(nodes, form) {
    for (var i2 = 0; i2 < nodes.length; i2++) {
      if (nodes[i2].checked && nodes[i2].form === form) {
        return nodes[i2];
      }
    }
  };
  var isTabbableRadio = function isTabbableRadio2(node2) {
    if (!node2.name) {
      return true;
    }
    var radioScope = node2.form || getRootNode(node2);
    var queryRadios = function queryRadios2(name) {
      return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
    };
    var radioSet;
    if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
      radioSet = queryRadios(window.CSS.escape(node2.name));
    } else {
      try {
        radioSet = queryRadios(node2.name);
      } catch (err) {
        console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
        return false;
      }
    }
    var checked = getCheckedRadio(radioSet, node2.form);
    return !checked || checked === node2;
  };
  var isRadio = function isRadio2(node2) {
    return isInput(node2) && node2.type === "radio";
  };
  var isNonTabbableRadio = function isNonTabbableRadio2(node2) {
    return isRadio(node2) && !isTabbableRadio(node2);
  };
  var isNodeAttached = function isNodeAttached2(node2) {
    var _nodeRoot;
    var nodeRoot = node2 && getRootNode(node2);
    var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
    var attached = false;
    if (nodeRoot && nodeRoot !== node2) {
      var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
      attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node2 !== null && node2 !== void 0 && (_node$ownerDocument = node2.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node2));
      while (!attached && nodeRootHost) {
        var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
        nodeRoot = getRootNode(nodeRootHost);
        nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
        attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
      }
    }
    return attached;
  };
  var isZeroArea = function isZeroArea2(node2) {
    var _node$getBoundingClie = node2.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
    return width === 0 && height === 0;
  };
  var isHidden = function isHidden2(node2, _ref) {
    var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
    if (getComputedStyle(node2).visibility === "hidden") {
      return true;
    }
    var isDirectSummary = matches.call(node2, "details>summary:first-of-type");
    var nodeUnderDetails = isDirectSummary ? node2.parentElement : node2;
    if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
      return true;
    }
    if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
      if (typeof getShadowRoot === "function") {
        var originalNode = node2;
        while (node2) {
          var parentElement = node2.parentElement;
          var rootNode = getRootNode(node2);
          if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
            return isZeroArea(node2);
          } else if (node2.assignedSlot) {
            node2 = node2.assignedSlot;
          } else if (!parentElement && rootNode !== node2.ownerDocument) {
            node2 = rootNode.host;
          } else {
            node2 = parentElement;
          }
        }
        node2 = originalNode;
      }
      if (isNodeAttached(node2)) {
        return !node2.getClientRects().length;
      }
      if (displayCheck !== "legacy-full") {
        return true;
      }
    } else if (displayCheck === "non-zero-area") {
      return isZeroArea(node2);
    }
    return false;
  };
  var isDisabledFromFieldset = function isDisabledFromFieldset2(node2) {
    if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node2.tagName)) {
      var parentNode = node2.parentElement;
      while (parentNode) {
        if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
          for (var i2 = 0; i2 < parentNode.children.length; i2++) {
            var child = parentNode.children.item(i2);
            if (child.tagName === "LEGEND") {
              return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node2);
            }
          }
          return true;
        }
        parentNode = parentNode.parentElement;
      }
    }
    return false;
  };
  var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node2) {
    if (node2.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
    //  because we're limited in the type of selectors we can use in JSDom (see related
    //  note related to `candidateSelectors`)
    isInert(node2) || isHiddenInput(node2) || isHidden(node2, options) || // For a details element with a summary, the summary element gets the focus
    isDetailsWithSummary(node2) || isDisabledFromFieldset(node2)) {
      return false;
    }
    return true;
  };
  var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node2) {
    if (isNonTabbableRadio(node2) || getTabindex(node2) < 0 || !isNodeMatchingSelectorFocusable(options, node2)) {
      return false;
    }
    return true;
  };
  var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
    var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
    if (isNaN(tabIndex) || tabIndex >= 0) {
      return true;
    }
    return false;
  };
  var sortByOrder = function sortByOrder2(candidates) {
    var regularTabbables = [];
    var orderedTabbables = [];
    candidates.forEach(function(item, i2) {
      var isScope = !!item.scopeParent;
      var element = isScope ? item.scopeParent : item;
      var candidateTabindex = getTabindex(element, isScope);
      var elements = isScope ? sortByOrder2(item.candidates) : element;
      if (candidateTabindex === 0) {
        isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
      } else {
        orderedTabbables.push({
          documentOrder: i2,
          tabIndex: candidateTabindex,
          item,
          isScope,
          content: elements
        });
      }
    });
    return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
      sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
      return acc;
    }, []).concat(regularTabbables);
  };
  var tabbable = function tabbable2(el, options) {
    options = options || {};
    var candidates;
    if (options.getShadowRoot) {
      candidates = getCandidatesIteratively([el], options.includeContainer, {
        filter: isNodeMatchingSelectorTabbable.bind(null, options),
        flatten: false,
        getShadowRoot: options.getShadowRoot,
        shadowRootFilter: isValidShadowRootTabbable
      });
    } else {
      candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
    }
    return sortByOrder(candidates);
  };
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  const FloatingArrow = /* @__PURE__ */ React__namespace.forwardRef(function FloatingArrow2(_ref, ref) {
    var _rest$style;
    let {
      context: {
        placement,
        elements: {
          floating
        },
        middlewareData: {
          arrow: arrow2
        }
      },
      width = 14,
      height = 7,
      tipRadius = 0,
      strokeWidth = 0,
      staticOffset,
      stroke,
      d: d2,
      ...rest
    } = _ref;
    const svgX = width / 2 * (tipRadius / -8 + 1);
    const svgY = height / 2 * tipRadius / 4;
    const [side, alignment] = placement.split("-");
    const isRTL = floating ? O.isRTL(floating) : false;
    const isCustomShape = !!d2;
    const isVerticalSide = side === "top" || side === "bottom";
    const yOffsetProp = staticOffset && alignment === "end" ? "bottom" : "top";
    let xOffsetProp = staticOffset && alignment === "end" ? "right" : "left";
    if (staticOffset && isRTL) {
      xOffsetProp = alignment === "end" ? "left" : "right";
    }
    const arrowX = (arrow2 == null ? void 0 : arrow2.x) != null ? staticOffset || arrow2.x : "";
    const arrowY = (arrow2 == null ? void 0 : arrow2.y) != null ? staticOffset || arrow2.y : "";
    const dValue = d2 || "M0,0" + (" H" + width) + (" L" + (width - svgX) + "," + (height - svgY)) + (" Q" + width / 2 + "," + height + " " + svgX + "," + (height - svgY)) + " Z";
    const rotation = {
      top: isCustomShape ? "rotate(180deg)" : "",
      left: isCustomShape ? "rotate(90deg)" : "rotate(-90deg)",
      bottom: isCustomShape ? "" : "rotate(180deg)",
      right: isCustomShape ? "rotate(-90deg)" : "rotate(90deg)"
    }[side];
    return /* @__PURE__ */ React__namespace.createElement("svg", _extends({}, rest, {
      // @ts-ignore
      suppressHydrationWarning: true,
      "aria-hidden": true,
      ref,
      width: isCustomShape ? width : width + (isVerticalSide ? strokeWidth : 0),
      height: width,
      viewBox: isCustomShape ? "0 0 " + width + " " + width : "0 0 " + width + " " + (width + (!isVerticalSide ? strokeWidth : 0)),
      style: {
        ...rest.style,
        position: "absolute",
        pointerEvents: "none",
        [xOffsetProp]: arrowX != null ? arrowX : "",
        [yOffsetProp]: arrowY != null ? arrowY : "",
        [side]: "100%",
        transform: "" + rotation + ((_rest$style = rest.style) != null && _rest$style.transform ? " " + rest.style.transform : "")
      }
    }), strokeWidth > 0 && /* @__PURE__ */ React__namespace.createElement("path", {
      fill: "none",
      stroke,
      strokeWidth: strokeWidth + (d2 ? 0 : 1),
      d: dValue
    }), /* @__PURE__ */ React__namespace.createElement("path", {
      stroke: strokeWidth && !d2 ? rest.fill : "none",
      d: dValue
    }));
  });
  var index$1 = typeof document !== "undefined" ? React$1.useLayoutEffect : React$1.useEffect;
  let serverHandoffComplete = false;
  let count = 0;
  const genId = () => "floating-ui-" + count++;
  function useFloatingId() {
    const [id, setId] = React__namespace.useState(() => serverHandoffComplete ? genId() : void 0);
    index$1(() => {
      if (id == null) {
        setId(genId());
      }
    }, []);
    React__namespace.useEffect(() => {
      if (!serverHandoffComplete) {
        serverHandoffComplete = true;
      }
    }, []);
    return id;
  }
  const useReactId = React__namespace[/* @__PURE__ */ "useId".toString()];
  const useId = useReactId || useFloatingId;
  function createPubSub() {
    const map = /* @__PURE__ */ new Map();
    return {
      emit(event, data) {
        var _map$get;
        (_map$get = map.get(event)) == null ? void 0 : _map$get.forEach((handler) => handler(data));
      },
      on(event, listener) {
        map.set(event, [...map.get(event) || [], listener]);
      },
      off(event, listener) {
        map.set(event, (map.get(event) || []).filter((l2) => l2 !== listener));
      }
    };
  }
  const FloatingNodeContext = /* @__PURE__ */ React__namespace.createContext(null);
  const FloatingTreeContext = /* @__PURE__ */ React__namespace.createContext(null);
  const useFloatingParentNodeId = () => {
    var _React$useContext;
    return ((_React$useContext = React__namespace.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
  };
  const useFloatingTree = () => React__namespace.useContext(FloatingTreeContext);
  function getDocument(node2) {
    return (node2 == null ? void 0 : node2.ownerDocument) || document;
  }
  function getPlatform() {
    const uaData = navigator.userAgentData;
    if (uaData != null && uaData.platform) {
      return uaData.platform;
    }
    return navigator.platform;
  }
  function getWindow(value) {
    return getDocument(value).defaultView || window;
  }
  function isElement(value) {
    return value ? value instanceof getWindow(value).Element : false;
  }
  function isShadowRoot(node2) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    const OwnElement = getWindow(node2).ShadowRoot;
    return node2 instanceof OwnElement || node2 instanceof ShadowRoot;
  }
  function isSafari() {
    return /apple/i.test(navigator.vendor);
  }
  function isMac() {
    return getPlatform().toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
  }
  function isMouseLikePointerType(pointerType, strict) {
    const values = ["mouse", "pen"];
    if (!strict) {
      values.push("", void 0);
    }
    return values.includes(pointerType);
  }
  function useLatestRef(value) {
    const ref = React$1.useRef(value);
    index$1(() => {
      ref.current = value;
    });
    return ref;
  }
  const safePolygonIdentifier = "data-floating-ui-safe-polygon";
  function getDelay(value, prop, pointerType) {
    if (pointerType && !isMouseLikePointerType(pointerType)) {
      return 0;
    }
    if (typeof value === "number") {
      return value;
    }
    return value == null ? void 0 : value[prop];
  }
  const useHover = function(context, _temp) {
    let {
      enabled = true,
      delay = 0,
      handleClose = null,
      mouseOnly = false,
      restMs = 0,
      move = true
    } = _temp === void 0 ? {} : _temp;
    const {
      open,
      onOpenChange,
      dataRef,
      events,
      elements: {
        domReference,
        floating
      },
      refs
    } = context;
    const tree = useFloatingTree();
    const parentId = useFloatingParentNodeId();
    const handleCloseRef = useLatestRef(handleClose);
    const delayRef = useLatestRef(delay);
    const pointerTypeRef = React__namespace.useRef();
    const timeoutRef = React__namespace.useRef();
    const handlerRef = React__namespace.useRef();
    const restTimeoutRef = React__namespace.useRef();
    const blockMouseMoveRef = React__namespace.useRef(true);
    const performedPointerEventsMutationRef = React__namespace.useRef(false);
    const unbindMouseMoveRef = React__namespace.useRef(() => {
    });
    const isHoverOpen = React__namespace.useCallback(() => {
      var _dataRef$current$open;
      const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
      return (type == null ? void 0 : type.includes("mouse")) && type !== "mousedown";
    }, [dataRef]);
    React__namespace.useEffect(() => {
      if (!enabled) {
        return;
      }
      function onDismiss() {
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        blockMouseMoveRef.current = true;
      }
      events.on("dismiss", onDismiss);
      return () => {
        events.off("dismiss", onDismiss);
      };
    }, [enabled, events]);
    React__namespace.useEffect(() => {
      if (!enabled || !handleCloseRef.current || !open) {
        return;
      }
      function onLeave() {
        if (isHoverOpen()) {
          onOpenChange(false);
        }
      }
      const html = getDocument(floating).documentElement;
      html.addEventListener("mouseleave", onLeave);
      return () => {
        html.removeEventListener("mouseleave", onLeave);
      };
    }, [floating, open, onOpenChange, enabled, handleCloseRef, dataRef, isHoverOpen]);
    const closeWithDelay = React__namespace.useCallback(function(runElseBranch) {
      if (runElseBranch === void 0) {
        runElseBranch = true;
      }
      const closeDelay = getDelay(delayRef.current, "close", pointerTypeRef.current);
      if (closeDelay && !handlerRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => onOpenChange(false), closeDelay);
      } else if (runElseBranch) {
        clearTimeout(timeoutRef.current);
        onOpenChange(false);
      }
    }, [delayRef, onOpenChange]);
    const cleanupMouseMoveHandler = React__namespace.useCallback(() => {
      unbindMouseMoveRef.current();
      handlerRef.current = void 0;
    }, []);
    const clearPointerEvents = React__namespace.useCallback(() => {
      if (performedPointerEventsMutationRef.current) {
        const body = getDocument(refs.floating.current).body;
        body.style.pointerEvents = "";
        body.removeAttribute(safePolygonIdentifier);
        performedPointerEventsMutationRef.current = false;
      }
    }, [refs]);
    React__namespace.useEffect(() => {
      if (!enabled) {
        return;
      }
      function isClickLikeOpenEvent() {
        return dataRef.current.openEvent ? ["click", "mousedown"].includes(dataRef.current.openEvent.type) : false;
      }
      function onMouseEnter(event) {
        clearTimeout(timeoutRef.current);
        blockMouseMoveRef.current = false;
        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current) || restMs > 0 && getDelay(delayRef.current, "open") === 0) {
          return;
        }
        dataRef.current.openEvent = event;
        const openDelay = getDelay(delayRef.current, "open", pointerTypeRef.current);
        if (openDelay) {
          timeoutRef.current = setTimeout(() => {
            onOpenChange(true);
          }, openDelay);
        } else {
          onOpenChange(true);
        }
      }
      function onMouseLeave(event) {
        if (isClickLikeOpenEvent()) {
          return;
        }
        unbindMouseMoveRef.current();
        const doc = getDocument(floating);
        clearTimeout(restTimeoutRef.current);
        if (handleCloseRef.current) {
          if (!open) {
            clearTimeout(timeoutRef.current);
          }
          handlerRef.current = handleCloseRef.current({
            ...context,
            tree,
            x: event.clientX,
            y: event.clientY,
            onClose() {
              clearPointerEvents();
              cleanupMouseMoveHandler();
              closeWithDelay();
            }
          });
          const handler = handlerRef.current;
          doc.addEventListener("mousemove", handler);
          unbindMouseMoveRef.current = () => {
            doc.removeEventListener("mousemove", handler);
          };
          return;
        }
        closeWithDelay();
      }
      function onScrollMouseLeave(event) {
        if (isClickLikeOpenEvent()) {
          return;
        }
        handleCloseRef.current == null ? void 0 : handleCloseRef.current({
          ...context,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            closeWithDelay();
          }
        })(event);
      }
      if (isElement(domReference)) {
        const ref = domReference;
        open && ref.addEventListener("mouseleave", onScrollMouseLeave);
        floating == null ? void 0 : floating.addEventListener("mouseleave", onScrollMouseLeave);
        move && ref.addEventListener("mousemove", onMouseEnter, {
          once: true
        });
        ref.addEventListener("mouseenter", onMouseEnter);
        ref.addEventListener("mouseleave", onMouseLeave);
        return () => {
          open && ref.removeEventListener("mouseleave", onScrollMouseLeave);
          floating == null ? void 0 : floating.removeEventListener("mouseleave", onScrollMouseLeave);
          move && ref.removeEventListener("mousemove", onMouseEnter);
          ref.removeEventListener("mouseenter", onMouseEnter);
          ref.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    }, [domReference, floating, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, tree, delayRef, handleCloseRef, dataRef]);
    index$1(() => {
      var _handleCloseRef$curre;
      if (!enabled) {
        return;
      }
      if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
        const body = getDocument(floating).body;
        body.setAttribute(safePolygonIdentifier, "");
        body.style.pointerEvents = "none";
        performedPointerEventsMutationRef.current = true;
        if (isElement(domReference) && floating) {
          var _tree$nodesRef$curren, _tree$nodesRef$curren2;
          const ref = domReference;
          const parentFloating = tree == null ? void 0 : (_tree$nodesRef$curren = tree.nodesRef.current.find((node2) => node2.id === parentId)) == null ? void 0 : (_tree$nodesRef$curren2 = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren2.elements.floating;
          if (parentFloating) {
            parentFloating.style.pointerEvents = "";
          }
          ref.style.pointerEvents = "auto";
          floating.style.pointerEvents = "auto";
          return () => {
            ref.style.pointerEvents = "";
            floating.style.pointerEvents = "";
          };
        }
      }
    }, [enabled, open, parentId, floating, domReference, tree, handleCloseRef, dataRef, isHoverOpen]);
    index$1(() => {
      if (!open) {
        pointerTypeRef.current = void 0;
        cleanupMouseMoveHandler();
        clearPointerEvents();
      }
    }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
    React__namespace.useEffect(() => {
      return () => {
        cleanupMouseMoveHandler();
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        clearPointerEvents();
      };
    }, [enabled, cleanupMouseMoveHandler, clearPointerEvents]);
    return React__namespace.useMemo(() => {
      if (!enabled) {
        return {};
      }
      function setPointerRef(event) {
        pointerTypeRef.current = event.pointerType;
      }
      return {
        reference: {
          onPointerDown: setPointerRef,
          onPointerEnter: setPointerRef,
          onMouseMove() {
            if (open || restMs === 0) {
              return;
            }
            clearTimeout(restTimeoutRef.current);
            restTimeoutRef.current = setTimeout(() => {
              if (!blockMouseMoveRef.current) {
                onOpenChange(true);
              }
            }, restMs);
          }
        },
        floating: {
          onMouseEnter() {
            clearTimeout(timeoutRef.current);
          },
          onMouseLeave() {
            events.emit("dismiss", {
              type: "mouseLeave",
              data: {
                returnFocus: false
              }
            });
            closeWithDelay(false);
          }
        }
      };
    }, [events, enabled, restMs, open, onOpenChange, closeWithDelay]);
  };
  function activeElement$1(doc) {
    let activeElement2 = doc.activeElement;
    while (((_activeElement = activeElement2) == null ? void 0 : (_activeElement$shadow = _activeElement.shadowRoot) == null ? void 0 : _activeElement$shadow.activeElement) != null) {
      var _activeElement, _activeElement$shadow;
      activeElement2 = activeElement2.shadowRoot.activeElement;
    }
    return activeElement2;
  }
  function contains(parent, child) {
    if (!parent || !child) {
      return false;
    }
    const rootNode = child.getRootNode && child.getRootNode();
    if (parent.contains(child)) {
      return true;
    } else if (rootNode && isShadowRoot(rootNode)) {
      let next2 = child;
      do {
        if (next2 && parent === next2) {
          return true;
        }
        next2 = next2.parentNode || next2.host;
      } while (next2);
    }
    return false;
  }
  const getTabbableOptions = () => ({
    getShadowRoot: true,
    displayCheck: (
      // JSDOM does not support the `tabbable` library. To solve this we can
      // check if `ResizeObserver` is a real function (not polyfilled), which
      // determines if the current environment is JSDOM-like.
      typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
    )
  });
  function getTabbableIn(container, direction) {
    const allTabbable = tabbable(container, getTabbableOptions());
    if (direction === "prev") {
      allTabbable.reverse();
    }
    const activeIndex = allTabbable.indexOf(activeElement$1(getDocument(container)));
    const nextTabbableElements = allTabbable.slice(activeIndex + 1);
    return nextTabbableElements[0];
  }
  function getNextTabbable() {
    return getTabbableIn(document.body, "next");
  }
  function getPreviousTabbable() {
    return getTabbableIn(document.body, "prev");
  }
  function isOutsideEvent(event, container) {
    const containerElement = container || event.currentTarget;
    const relatedTarget = event.relatedTarget;
    return !relatedTarget || !contains(containerElement, relatedTarget);
  }
  function disableFocusInside(container) {
    const tabbableElements = tabbable(container, getTabbableOptions());
    tabbableElements.forEach((element) => {
      element.dataset.tabindex = element.getAttribute("tabindex") || "";
      element.setAttribute("tabindex", "-1");
    });
  }
  function enableFocusInside(container) {
    const elements = container.querySelectorAll("[data-tabindex]");
    elements.forEach((element) => {
      const tabindex = element.dataset.tabindex;
      delete element.dataset.tabindex;
      if (tabindex) {
        element.setAttribute("tabindex", tabindex);
      } else {
        element.removeAttribute("tabindex");
      }
    });
  }
  const useInsertionEffect = React__namespace[/* @__PURE__ */ "useInsertionEffect".toString()];
  const useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());
  function useEvent(callback) {
    const ref = React__namespace.useRef(() => {
    });
    useSafeInsertionEffect(() => {
      ref.current = callback;
    });
    return React__namespace.useCallback(function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return ref.current == null ? void 0 : ref.current(...args);
    }, []);
  }
  const HIDDEN_STYLES = {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "fixed",
    whiteSpace: "nowrap",
    width: "1px",
    top: 0,
    left: 0
  };
  let activeElement;
  let timeoutId;
  function setActiveElementOnTab(event) {
    if (event.key === "Tab") {
      activeElement = event.target;
      clearTimeout(timeoutId);
    }
  }
  function isTabFocus(event) {
    const result = activeElement === event.relatedTarget;
    activeElement = event.relatedTarget;
    clearTimeout(timeoutId);
    return result;
  }
  const FocusGuard = /* @__PURE__ */ React__namespace.forwardRef(function FocusGuard2(props, ref) {
    const onFocus = useEvent(props.onFocus);
    const [role, setRole] = React__namespace.useState();
    index$1(() => {
      if (isSafari()) {
        setRole("button");
      }
      document.addEventListener("keydown", setActiveElementOnTab);
      return () => {
        document.removeEventListener("keydown", setActiveElementOnTab);
      };
    }, []);
    return /* @__PURE__ */ React__namespace.createElement("span", _extends({}, props, {
      ref,
      tabIndex: 0,
      role,
      "aria-hidden": role ? void 0 : true,
      "data-floating-ui-focus-guard": "",
      style: HIDDEN_STYLES,
      onFocus: (event) => {
        if (isSafari() && isMac() && !isTabFocus(event)) {
          event.persist();
          timeoutId = window.setTimeout(() => {
            onFocus(event);
          }, 50);
        } else {
          onFocus(event);
        }
      }
    }));
  });
  const PortalContext = /* @__PURE__ */ React__namespace.createContext(null);
  const useFloatingPortalNode = function(_temp) {
    let {
      id,
      enabled = true
    } = _temp === void 0 ? {} : _temp;
    const [portalEl, setPortalEl] = React__namespace.useState(null);
    const uniqueId = useId();
    const portalContext = usePortalContext();
    index$1(() => {
      if (!enabled) {
        return;
      }
      const rootNode = id ? document.getElementById(id) : null;
      if (rootNode) {
        rootNode.setAttribute("data-floating-ui-portal", "");
        setPortalEl(rootNode);
      } else {
        const newPortalEl = document.createElement("div");
        if (id !== "") {
          newPortalEl.id = id || uniqueId;
        }
        newPortalEl.setAttribute("data-floating-ui-portal", "");
        setPortalEl(newPortalEl);
        const container = (portalContext == null ? void 0 : portalContext.portalNode) || document.body;
        container.appendChild(newPortalEl);
        return () => {
          container.removeChild(newPortalEl);
        };
      }
    }, [id, portalContext, uniqueId, enabled]);
    return portalEl;
  };
  const FloatingPortal = (_ref) => {
    let {
      children,
      id,
      root: root2 = null,
      preserveTabOrder = true
    } = _ref;
    const portalNode = useFloatingPortalNode({
      id,
      enabled: !root2
    });
    const [focusManagerState, setFocusManagerState] = React__namespace.useState(null);
    const beforeOutsideRef = React__namespace.useRef(null);
    const afterOutsideRef = React__namespace.useRef(null);
    const beforeInsideRef = React__namespace.useRef(null);
    const afterInsideRef = React__namespace.useRef(null);
    const shouldRenderGuards = (
      // The FocusManager and therefore floating element are currently open/
      // rendered.
      !!focusManagerState && // Guards are only for non-modal focus management.
      !focusManagerState.modal && !!(root2 || portalNode) && preserveTabOrder
    );
    React__namespace.useEffect(() => {
      if (!portalNode || !preserveTabOrder || focusManagerState != null && focusManagerState.modal) {
        return;
      }
      function onFocus(event) {
        if (portalNode && isOutsideEvent(event)) {
          const focusing = event.type === "focusin";
          const manageFocus = focusing ? enableFocusInside : disableFocusInside;
          manageFocus(portalNode);
        }
      }
      portalNode.addEventListener("focusin", onFocus, true);
      portalNode.addEventListener("focusout", onFocus, true);
      return () => {
        portalNode.removeEventListener("focusin", onFocus, true);
        portalNode.removeEventListener("focusout", onFocus, true);
      };
    }, [portalNode, preserveTabOrder, focusManagerState == null ? void 0 : focusManagerState.modal]);
    return /* @__PURE__ */ React__namespace.createElement(PortalContext.Provider, {
      value: React__namespace.useMemo(() => ({
        preserveTabOrder,
        beforeOutsideRef,
        afterOutsideRef,
        beforeInsideRef,
        afterInsideRef,
        portalNode,
        setFocusManagerState
      }), [preserveTabOrder, portalNode])
    }, shouldRenderGuards && portalNode && /* @__PURE__ */ React__namespace.createElement(FocusGuard, {
      "data-type": "outside",
      ref: beforeOutsideRef,
      onFocus: (event) => {
        if (isOutsideEvent(event, portalNode)) {
          var _beforeInsideRef$curr;
          (_beforeInsideRef$curr = beforeInsideRef.current) == null ? void 0 : _beforeInsideRef$curr.focus();
        } else {
          const prevTabbable = getPreviousTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
          prevTabbable == null ? void 0 : prevTabbable.focus();
        }
      }
    }), shouldRenderGuards && portalNode && /* @__PURE__ */ React__namespace.createElement("span", {
      "aria-owns": portalNode.id,
      style: HIDDEN_STYLES
    }), root2 ? /* @__PURE__ */ require$$2.createPortal(children, root2) : portalNode ? /* @__PURE__ */ require$$2.createPortal(children, portalNode) : null, shouldRenderGuards && portalNode && /* @__PURE__ */ React__namespace.createElement(FocusGuard, {
      "data-type": "outside",
      ref: afterOutsideRef,
      onFocus: (event) => {
        if (isOutsideEvent(event, portalNode)) {
          var _afterInsideRef$curre;
          (_afterInsideRef$curre = afterInsideRef.current) == null ? void 0 : _afterInsideRef$curre.focus();
        } else {
          const nextTabbable = getNextTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
          nextTabbable == null ? void 0 : nextTabbable.focus();
          (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) && (focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false));
        }
      }
    }));
  };
  const usePortalContext = () => React__namespace.useContext(PortalContext);
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      open = false,
      onOpenChange: unstable_onOpenChange,
      nodeId
    } = options;
    const position2 = useFloating$1(options);
    const tree = useFloatingTree();
    const domReferenceRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef({});
    const events = React__namespace.useState(() => createPubSub())[0];
    const [domReference, setDomReference] = React__namespace.useState(null);
    const setPositionReference = React__namespace.useCallback((node2) => {
      const positionReference = isElement(node2) ? {
        getBoundingClientRect: () => node2.getBoundingClientRect(),
        contextElement: node2
      } : node2;
      position2.refs.setReference(positionReference);
    }, [position2.refs]);
    const setReference = React__namespace.useCallback((node2) => {
      if (isElement(node2) || node2 === null) {
        domReferenceRef.current = node2;
        setDomReference(node2);
      }
      if (isElement(position2.refs.reference.current) || position2.refs.reference.current === null || // Don't allow setting virtual elements using the old technique back to
      // `null` to support `positionReference` + an unstable `reference`
      // callback ref.
      node2 !== null && !isElement(node2)) {
        position2.refs.setReference(node2);
      }
    }, [position2.refs]);
    const refs = React__namespace.useMemo(() => ({
      ...position2.refs,
      setReference,
      setPositionReference,
      domReference: domReferenceRef
    }), [position2.refs, setReference, setPositionReference]);
    const elements = React__namespace.useMemo(() => ({
      ...position2.elements,
      domReference
    }), [position2.elements, domReference]);
    const onOpenChange = useEvent(unstable_onOpenChange);
    const context = React__namespace.useMemo(() => ({
      ...position2,
      refs,
      elements,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange
    }), [position2, nodeId, events, open, onOpenChange, refs, elements]);
    index$1(() => {
      const node2 = tree == null ? void 0 : tree.nodesRef.current.find((node3) => node3.id === nodeId);
      if (node2) {
        node2.context = context;
      }
    });
    return React__namespace.useMemo(() => ({
      ...position2,
      context,
      refs,
      reference: setReference,
      positionReference: setPositionReference
    }), [position2, refs, context, setReference, setPositionReference]);
  }
  function mergeProps(userProps, propsList, elementKey) {
    const map = /* @__PURE__ */ new Map();
    return {
      ...elementKey === "floating" && {
        tabIndex: -1
      },
      ...userProps,
      ...propsList.map((value) => value ? value[elementKey] : null).concat(userProps).reduce((acc, props) => {
        if (!props) {
          return acc;
        }
        Object.entries(props).forEach((_ref) => {
          let [key, value] = _ref;
          if (key.indexOf("on") === 0) {
            if (!map.has(key)) {
              map.set(key, []);
            }
            if (typeof value === "function") {
              var _map$get;
              (_map$get = map.get(key)) == null ? void 0 : _map$get.push(value);
              acc[key] = function() {
                var _map$get2;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.forEach((fn) => fn(...args));
              };
            }
          } else {
            acc[key] = value;
          }
        });
        return acc;
      }, {})
    };
  }
  const useInteractions = function(propsList) {
    if (propsList === void 0) {
      propsList = [];
    }
    const deps = propsList;
    const getReferenceProps = React__namespace.useCallback(
      (userProps) => mergeProps(userProps, propsList, "reference"),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      deps
    );
    const getFloatingProps = React__namespace.useCallback(
      (userProps) => mergeProps(userProps, propsList, "floating"),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      deps
    );
    const getItemProps = React__namespace.useCallback(
      (userProps) => mergeProps(userProps, propsList, "item"),
      // Granularly check for `item` changes, because the `getItemProps` getter
      // should be as referentially stable as possible since it may be passed as
      // a prop to many components. All `item` key values must therefore be
      // memoized.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      propsList.map((key) => key == null ? void 0 : key.item)
    );
    return React__namespace.useMemo(() => ({
      getReferenceProps,
      getFloatingProps,
      getItemProps
    }), [getReferenceProps, getFloatingProps, getItemProps]);
  };
  function PopOver({
    children,
    content,
    placement = "top-start",
    disabled = false,
    offsetPixel = 8,
    backgroundColor = "rgba(104, 101, 101, 0.89)",
    delay = false,
    openDelay = false,
    border = false
  }) {
    useTheme();
    const [isOpen, setIsOpen] = React$1.useState(false);
    const arrowRef = React$1.useRef(null);
    const { x: x2, y: y2, strategy, refs, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement,
      middleware: [
        D$1(offsetPixel),
        b$1(),
        k(),
        arrow({
          element: arrowRef
        })
      ]
    });
    const hover = useHover(context, {
      delay: {
        open: openDelay ? 500 : void 0,
        close: delay ? 250 : void 0
      }
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: refs.setReference,
          ...getReferenceProps(),
          children
        },
        `PopOver-content-${content}`
      ),
      /* @__PURE__ */ jsx(FloatingPortal, { children: isOpen && !disabled && /* @__PURE__ */ jsxs(
        "div",
        {
          ref: refs.setFloating,
          style: {
            position: strategy,
            top: y2 ?? 0,
            left: x2 ?? 0,
            backgroundColor,
            // display: "flex",
            // backgroundColor: theme.colors.secondary,
            // width: "max-content",
            maxWidth: "400px",
            color: "white",
            border: border ? "2px solid black" : void 0,
            borderRadius: 4,
            fontSize: 20,
            padding: 8,
            zIndex: 9999,
            fontFamily: "华文新魏",
            lineHeight: "normal",
            whiteSpace: "pre-wrap"
          },
          ...getFloatingProps(),
          children: [
            /* @__PURE__ */ jsx(
              FloatingArrow,
              {
                ref: arrowRef,
                context,
                fill: "rgba(104, 101, 101, 0.89)"
              }
            ),
            content
          ]
        },
        `PopOver-tooltip-${content}`
      ) })
    ] });
  }
  function __read(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2)
      return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done)
        ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"]))
          m2.call(i2);
      } finally {
        if (e2)
          throw e2.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (pack || arguments.length === 2)
      for (var i2 = 0, l2 = from2.length, ar; i2 < l2; i2++) {
        if (ar || !(i2 in from2)) {
          if (!ar)
            ar = Array.prototype.slice.call(from2, 0, i2);
          ar[i2] = from2[i2];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  var isFunction = function(value) {
    return typeof value === "function";
  };
  var isDev = false;
  const isDev$1 = isDev;
  function useLatest(value) {
    var ref = React$1.useRef(value);
    ref.current = value;
    return ref;
  }
  var useUnmount = function(fn) {
    if (isDev$1) {
      if (!isFunction(fn)) {
        console.error("useUnmount expected parameter is a function, got ".concat(typeof fn));
      }
    }
    var fnRef = useLatest(fn);
    React$1.useEffect(function() {
      return function() {
        fnRef.current();
      };
    }, []);
  };
  const useUnmount$1 = useUnmount;
  var root$2 = _root;
  var now$3 = function() {
    return root$2.Date.now();
  };
  var now_1 = now$3;
  var reWhitespace$1 = /\s/;
  function trimmedEndIndex$2(string) {
    var index2 = string.length;
    while (index2-- && reWhitespace$1.test(string.charAt(index2))) {
    }
    return index2;
  }
  var _trimmedEndIndex = trimmedEndIndex$2;
  var trimmedEndIndex$1 = _trimmedEndIndex;
  var reTrimStart$1 = /^\s+/;
  function baseTrim$2(string) {
    return string ? string.slice(0, trimmedEndIndex$1(string) + 1).replace(reTrimStart$1, "") : string;
  }
  var _baseTrim = baseTrim$2;
  var baseGetTag$1 = _baseGetTag, isObjectLike$1 = isObjectLike_1;
  var symbolTag$1 = "[object Symbol]";
  function isSymbol$2(value) {
    return typeof value == "symbol" || isObjectLike$1(value) && baseGetTag$1(value) == symbolTag$1;
  }
  var isSymbol_1 = isSymbol$2;
  var baseTrim$1 = _baseTrim, isObject$2 = isObject_1, isSymbol$1 = isSymbol_1;
  var NAN$1 = 0 / 0;
  var reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary$1 = /^0b[01]+$/i;
  var reIsOctal$1 = /^0o[0-7]+$/i;
  var freeParseInt$1 = parseInt;
  function toNumber$2(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol$1(value)) {
      return NAN$1;
    }
    if (isObject$2(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$2(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim$1(value);
    var isBinary = reIsBinary$1.test(value);
    return isBinary || reIsOctal$1.test(value) ? freeParseInt$1(value.slice(2), isBinary ? 2 : 8) : reIsBadHex$1.test(value) ? NAN$1 : +value;
  }
  var toNumber_1 = toNumber$2;
  var isObject$1 = isObject_1, now$2 = now_1, toNumber$1 = toNumber_1;
  var FUNC_ERROR_TEXT$2 = "Expected a function";
  var nativeMax$1 = Math.max, nativeMin$1 = Math.min;
  function debounce$1(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$2);
    }
    wait = toNumber$1(wait) || 0;
    if (isObject$1(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax$1(toNumber$1(options.maxWait) || 0, wait) : maxWait;
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
      return maxing ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now$2();
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
      return timerId === void 0 ? result : trailingEdge(now$2());
    }
    function debounced() {
      var time = now$2(), isInvoking = shouldInvoke(time);
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
  var useMount = function(fn) {
    if (isDev$1) {
      if (!isFunction(fn)) {
        console.error('useMount: parameter `fn` expected to be a function, but got "'.concat(typeof fn, '".'));
      }
    }
    React$1.useEffect(function() {
      fn === null || fn === void 0 ? void 0 : fn();
    }, []);
  };
  const useMount$1 = useMount;
  function useDebounceFn(fn, options) {
    var _a2;
    if (isDev$1) {
      if (!isFunction(fn)) {
        console.error("useDebounceFn expected parameter is a function, got ".concat(typeof fn));
      }
    }
    var fnRef = useLatest(fn);
    var wait = (_a2 = options === null || options === void 0 ? void 0 : options.wait) !== null && _a2 !== void 0 ? _a2 : 1e3;
    var debounced = React$1.useMemo(function() {
      return debounce_1(function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return fnRef.current.apply(fnRef, __spreadArray([], __read(args), false));
      }, wait, options);
    }, []);
    useUnmount$1(function() {
      debounced.cancel();
    });
    return {
      run: debounced,
      cancel: debounced.cancel,
      flush: debounced.flush
    };
  }
  const SwitchLabel = newStyled.label`
    /* 限定label标签属性，也就是checkbox的包装器 */

    position: relative;
    display: inline-block;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    border-radius: 38px;
    /* vertical-align: middle; */

    /* 不显示checkbox本身，通过点击外部的label实现点击input的效果 */
    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* 未选中，滑条效果 */
    #slider {
        position: absolute;
        z-index: 11;
        /* cursor: pointer; */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: 0.4s;
        border-radius: 38px;
        background-color: rgb(234, 234, 234);
    }

    #switch {
        position: absolute;
        z-index: 12;
        height: ${(props) => props.height - 2}px;
        width: ${(props) => props.height - 2}px;
        left: 1px;
        bottom: 1px;
        background-color: white;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 0 rgba(0, 0, 0, 0.08);
        border-radius: 50%;
        border-radius: 38px;
    }

    /* 未选中，点击时滑条效果 */
    input:not(:checked):active ~ #slider {
        background-color: rgb(187, 187, 187);
    }

    /* 未选中，点击时滑块效果 */
    /* input:active + #switch {
        animation-name: widen_to_right;
        animation-duration: 0.4s;
        animation-fill-mode: forwards;
    } */

    /* 滑块点击右移效果 */
    input:checked + #switch {
        animation-name: slide_to_right;
        animation-duration: 0.2s;
        animation-fill-mode: forwards;
    }

    /* 选中时，滑条效果 */
    input:checked ~ #slider {
        background-color: ${(props) => props.theme.colors.active};
    }

    /* 已选中，点击时滑块效果 */
    /* input:checked:active + #switch {
        animation-name: widen_to_left;
        animation-duration: 0.4s;
        animation-fill-mode: forwards;
    } */

    /* 滑块点击左移效果 */
    input:not(:checked):not(:active) + #switch {
        animation-name: slide_to_left;
        animation-duration: 0.2s;
        animation-fill-mode: forwards;
    }

    @keyframes widen_to_right {
        0% {
            left: 1px;
            width: ${(props) => props.height}px;
        }

        100% {
            left: 1px;
            width: ${(props) => (props.height - 2) / 2 * 3}px;
        }
    }

    @keyframes slide_to_right {
        0% {
            left: 1px;
            width: ${(props) => (props.height - 2) / 2 * 3}px;
        }

        100% {
            /* + 1是因为，滑块的直径是height-2，要达到right : 1的效果，就是左起 直径+1 */
            left: ${(props) => props.height + 1}px;
            width: ${(props) => props.height - 2}px;
        }
    }

    @keyframes widen_to_left {
        0% {
            left: ${(props) => props.height + 1}px;
            width: ${(props) => props.height - 2}px;
        }

        100% {
            left: ${(props) => props.width - 1 - (props.height - 2) / 2 * 3}px;
            width: ${(props) => (props.height - 2) / 2 * 3}px;
        }
    }

    @keyframes slide_to_left {
        0% {
            left: ${(props) => props.width - 1 - (props.height - 2) / 2 * 3}px;
            width: ${(props) => (props.height - 2) / 2 * 3}px;
        }

        100% {
            left: 1px;
            width: ${(props) => props.height - 2}px;
        }
    }
`;
  function Switch({
    checked = false,
    onChange = () => {
    },
    disabled = false,
    // width = 50,
    height = 25,
    id = ""
  }) {
    return /* @__PURE__ */ jsxs(SwitchLabel, { className: "my-switch", width: height * 2, height, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          id,
          type: "checkbox",
          checked,
          onChange: (e2) => {
            onChange(e2.target.checked);
          },
          disabled
        }
      ),
      /* @__PURE__ */ jsx("span", { id: "switch" }),
      /* @__PURE__ */ jsx("span", { id: "slider" })
    ] });
  }
  function ConfigControl({
    genericSetting: { id, valueType, readonly }
  }) {
    const [statusText, setStatusText] = React$1.useState("");
    const [spring, api] = J(() => ({
      config: {
        ...mt.wobbly
      }
    }));
    const { userSettings } = useStore();
    const value = userSettings[id];
    const [localValue, setLocalValue] = React$1.useState(value);
    const { run: onChangeDebounced } = useDebounceFn(
      (newValue) => {
        if (newValue === value)
          return;
        store.userSettings[id] = newValue;
        setStatusText("保存成功");
        setTimeout(() => {
          setStatusText("");
        }, 1e3);
      },
      {
        wait: 1e3
      }
    );
    React$1.useEffect(() => {
      api.start({
        right: statusText ? "0%" : "-100%",
        opacity: statusText ? 1 : 0
      });
    }, [statusText]);
    React$1.useEffect(() => {
      setLocalValue(value);
    }, [value]);
    React$1.useEffect(() => {
      onChangeDebounced(localValue);
    }, [localValue]);
    let element;
    switch (valueType) {
      case "string":
        element = /* @__PURE__ */ jsx(
          "textarea",
          {
            value: localValue,
            onBlur: (e2) => setLocalValue(e2.target.value),
            onChange: (e2) => setLocalValue(e2.target.value),
            disabled: readonly,
            style: {
              resize: "none",
              height: 40,
              fontSize: 16,
              lineHeight: "normal"
            }
          }
        );
        break;
      case "number":
        element = /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: localValue,
            onBlur: (e2) => setLocalValue(e2.target.value),
            onChange: (e2) => setLocalValue(e2.target.value),
            style: {
              width: 60,
              textAlign: "center"
            },
            disabled: readonly
          }
        );
        break;
      case "boolean":
        element = /* @__PURE__ */ jsx(
          Switch,
          {
            height: 22,
            checked: localValue,
            onChange: setLocalValue,
            disabled: readonly
          }
        );
        break;
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          lineHeight: "normal",
          display: "flex",
          alignItems: "center",
          position: "relative"
        },
        children: [
          /* @__PURE__ */ jsx(
            it.div,
            {
              style: {
                position: "relative",
                marginRight: 4,
                ...spring
              },
              children: statusText
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                maxWidth: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: element
            }
          )
        ]
      }
    );
  }
  function ConfigSection({ settings }) {
    useTheme();
    return /* @__PURE__ */ jsx(Fragment, { children: settings.map((setting, index2) => {
      return /* @__PURE__ */ jsxs(
        ConfigItem,
        {
          style: {
            marginTop: index2 === 0 ? 0 : 8
          },
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  fontSize: 20,
                  marginBottom: 8,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  lineHeight: "normal"
                },
                children: [
                  setting.name,
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        maxHeight: 40,
                        display: "flex",
                        alignItems: "center",
                        lineHeight: "normal"
                      },
                      children: /* @__PURE__ */ jsx(ConfigControl, { genericSetting: setting })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  fontSize: 16,
                  // color: theme.colors.secondary,
                  color: "rgb(161, 156, 156)",
                  lineHeight: "normal"
                },
                children: setting.description
              }
            )
          ]
        },
        `${String(setting.id)}-${setting.name}`
      );
    }) });
  }
  const TabHeader = newStyled.div({
    height: 30,
    fontSize: 20,
    cursor: "pointer",
    border: "1px solid black",
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "华文新魏",
    lineHeight: "normal"
  });
  function TabContainer({ panel }) {
    const { tabIndex } = useStore();
    const theme2 = useTheme();
    const [hoverTab, setHoverTab] = React$1.useState(null);
    const transRef = Xo();
    const [direction, setDirection] = React$1.useState(true);
    const transition = Gt(tabIndex, {
      ref: transRef,
      from: {
        transform: `translate(0,${direction ? 100 : -100}%)`,
        scale: 0.8,
        position: "absolute",
        opacity: 0
        // 如果旧元素的item只有2，新元素的item有4，加上淡出效果，看起来舒服点，就不折腾zIndex和backgroundColor了
      },
      enter: {
        transform: "translate(0,0%)",
        scale: 1,
        position: "relative",
        opacity: 1
      },
      leave: {
        transform: `translate(0,${direction ? -100 : 100}%)`,
        scale: 0.8,
        position: "absolute",
        opacity: 0
      },
      config: {
        ...mt.wobbly
      }
    });
    React$1.useEffect(() => {
      transRef.start();
    }, [tabIndex]);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "flex",
          flexGrow: 1,
          flexDirection: "row",
          position: "relative"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                minWidth: 100,
                margin: "8px 0px 8px 8px"
              },
              children: panel.map((p2, index2) => /* @__PURE__ */ jsx(
                TabHeader,
                {
                  onClick: () => {
                    store.setTabIndex(index2);
                    setDirection(index2 > tabIndex);
                  },
                  onMouseEnter: () => {
                    setHoverTab(index2);
                  },
                  onMouseLeave: () => {
                    setHoverTab(null);
                  },
                  style: {
                    backgroundColor: tabIndex === index2 ? theme2.colors.active : hoverTab === index2 ? theme2.colors.secondary : "white",
                    color: tabIndex === index2 ? "white" : "black",
                    marginTop: index2 === 0 ? 0 : 8,
                    lineHeight: "normal",
                    fontFamily: "华文新魏"
                  },
                  children: p2.label
                },
                `${p2.label}-${index2}-header`
              ))
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                margin: 8
              },
              children: transition((style, index2) => /* @__PURE__ */ jsx(
                it.div,
                {
                  style: {
                    width: "100%",
                    flexGrow: 1,
                    lineHeight: "normal",
                    fontFamily: "华文新魏",
                    ...style
                  },
                  children: panel[index2].content
                },
                `${panel[index2].label}-${index2}-content}`
              ))
            }
          )
        ]
      }
    );
  }
  const ConfigItem = newStyled.div(
    {
      position: "relative",
      border: "1px solid black",
      padding: 8,
      // margin: 4,
      borderRadius: 4
    },
    ({ theme: theme2 }) => ({
      "&:hover": {
        boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.75)"
        // backgroundColor: theme.colors.secondary,
      }
    })
  );
  const ConfigPanelContainer = newStyled(it.div)(
    {
      flexDirection: "column",
      width: 600,
      position: "fixed",
      top: 100,
      right: 100,
      zIndex: 101,
      background: "rgba(255, 255, 255, 0.95)",
      border: "black 2px solid",
      borderRadius: 10,
      boxShadow: "0 11px 15px -7px rgba(0, 0, 0, 0.2),0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)"
    },
    ({}) => ({})
  );
  function ConfigPanel() {
    const { sectionSettings, visibility } = useStore();
    const theme2 = useTheme();
    const panel = React$1.useMemo(() => {
      return sectionSettings.map((sectionSetting, index2) => ({
        label: sectionSetting.title,
        content: /* @__PURE__ */ jsx(ConfigSection, { settings: sectionSetting.settings })
      }));
    }, [sectionSettings]);
    const [isDragging, setIsDragging] = React$1.useState(false);
    const [spring, api] = J(
      () => ({
        opacity: visibility.config ? 1 : 0,
        scale: visibility.config ? 1 : 0,
        config: {
          ...mt.wobbly
        },
        onRest: () => {
          if (!visibility.config) {
            setDisplay(false);
          }
        }
      }),
      [visibility.config]
    );
    const [display, setDisplay] = React$1.useState(false);
    React$1.useEffect(() => {
      if (visibility.config) {
        setDisplay(true);
      }
    }, [visibility.config]);
    return /* @__PURE__ */ jsx(
      cjsExports,
      {
        handle: "#config-panel-menu-bar",
        cancel: "#config-panel-close-button",
        bounds: "body",
        onStart: () => {
          setIsDragging(true);
        },
        onStop: () => {
          setIsDragging(false);
        },
        children: /* @__PURE__ */ jsxs(
          ConfigPanelContainer,
          {
            id: "config-panel",
            style: {
              display: display ? "flex" : "none",
              ...spring
            },
            children: [
              /* @__PURE__ */ jsxs(
                MenuBar,
                {
                  id: "config-panel-menu-bar",
                  isDragging,
                  style: {
                    borderBottom: "2px solid black"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          fontSize: 24
                        },
                        children: "设置面板"
                      }
                    ),
                    /* @__PURE__ */ jsx(PopOver, { content: "关闭设置面板", children: /* @__PURE__ */ jsx(
                      MenuButton,
                      {
                        id: "config-panel-close-button",
                        style: {
                          lineHeight: "normal"
                        },
                        onClick: () => {
                          store.setVisibility("config", false);
                        },
                        children: /* @__PURE__ */ jsx(
                          Close,
                          {
                            theme: "filled",
                            size: "28",
                            fill: theme2.colors.error,
                            strokeWidth: 7
                          }
                        )
                      }
                    ) }, "config-panel-close-button")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(TabContainer, { panel })
            ]
          }
        )
      }
    );
  }
  function FloatingBall() {
    const {
      visibility,
      position: { floating, log: log2 }
    } = useStore();
    const [isDragging, setIsDragging] = React$1.useState(false);
    const inhaleColor = "limegreen";
    const exhaleColor = "rgba(84, 223, 130, 0.75)";
    const [spring, api] = J(() => ({
      from: {
        boxShadow: `0px 0px 5px 0px ${exhaleColor} inset`
      },
      to: [
        {
          boxShadow: `0px 0px 25px 0px ${inhaleColor} inset`
        },
        {
          boxShadow: `0px 0px 5px 0px ${exhaleColor} inset`
        }
      ],
      config: {
        // ...config.wobbly,
        duration: 3e3
      },
      loop: true
    }));
    return /* @__PURE__ */ jsx(
      cjsExports,
      {
        handle: "#floating-ball",
        bounds: "body",
        onStart: () => {
          setIsDragging(true);
        },
        onStop: (e2, data) => {
          setIsDragging(false);
        },
        children: /* @__PURE__ */ jsx(
          it.div,
          {
            id: "floating-ball",
            style: {
              position: "fixed",
              top: 100,
              right: 100,
              zIndex: 101,
              background: "rgba(255, 255, 255, 0.95)",
              // border: "black 2px solid",
              borderRadius: "50%",
              width: 70,
              height: 70,
              display: visibility.floating ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
              cursor: isDragging ? "grabbing" : "grab",
              /* animation: `${breathing} s linear infinite`, */
              ...visibility.floating ? spring : {}
              // 避免动画在隐藏时执行
            },
            onDoubleClick: () => {
              store.setVisibility("floating", false);
              store.setVisibility("log", true);
            },
            children: /* @__PURE__ */ jsx(
              PopOver,
              {
                content: "双击悬浮球可以显示日志面板",
                disabled: isDragging,
                placement: "top",
                offsetPixel: 24,
                children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      width: "100%",
                      height: "100%"
                    },
                    children: "悬浮球"
                  }
                )
              }
            )
          }
        )
      }
    );
  }
  const simplebar_min = "";
  var __extends$2 = globalThis && globalThis.__extends || function() {
    var extendStatics2 = function(d2, b2) {
      extendStatics2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
        d3.__proto__ = b3;
      } || function(d3, b3) {
        for (var p2 in b3)
          if (Object.prototype.hasOwnProperty.call(b3, p2))
            d3[p2] = b3[p2];
      };
      return extendStatics2(d2, b2);
    };
    return function(d2, b2) {
      extendStatics2(d2, b2);
      function __() {
        this.constructor = d2;
      }
      d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
    };
  }();
  var __assign$4 = globalThis && globalThis.__assign || function() {
    __assign$4 = Object.assign || function(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign$4.apply(this, arguments);
  };
  var styles = {
    top: {
      width: "100%",
      height: "10px",
      top: "-5px",
      left: "0px",
      cursor: "row-resize"
    },
    right: {
      width: "10px",
      height: "100%",
      top: "0px",
      right: "-5px",
      cursor: "col-resize"
    },
    bottom: {
      width: "100%",
      height: "10px",
      bottom: "-5px",
      left: "0px",
      cursor: "row-resize"
    },
    left: {
      width: "10px",
      height: "100%",
      top: "0px",
      left: "-5px",
      cursor: "col-resize"
    },
    topRight: {
      width: "20px",
      height: "20px",
      position: "absolute",
      right: "-10px",
      top: "-10px",
      cursor: "ne-resize"
    },
    bottomRight: {
      width: "20px",
      height: "20px",
      position: "absolute",
      right: "-10px",
      bottom: "-10px",
      cursor: "se-resize"
    },
    bottomLeft: {
      width: "20px",
      height: "20px",
      position: "absolute",
      left: "-10px",
      bottom: "-10px",
      cursor: "sw-resize"
    },
    topLeft: {
      width: "20px",
      height: "20px",
      position: "absolute",
      left: "-10px",
      top: "-10px",
      cursor: "nw-resize"
    }
  };
  var Resizer = (
    /** @class */
    function(_super) {
      __extends$2(Resizer2, _super);
      function Resizer2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMouseDown = function(e2) {
          _this.props.onResizeStart(e2, _this.props.direction);
        };
        _this.onTouchStart = function(e2) {
          _this.props.onResizeStart(e2, _this.props.direction);
        };
        return _this;
      }
      Resizer2.prototype.render = function() {
        return React__namespace.createElement("div", { className: this.props.className || "", style: __assign$4(__assign$4({ position: "absolute", userSelect: "none" }, styles[this.props.direction]), this.props.replaceStyles || {}), onMouseDown: this.onMouseDown, onTouchStart: this.onTouchStart }, this.props.children);
      };
      return Resizer2;
    }(React__namespace.PureComponent)
  );
  var srcExports = {};
  var src = {
    get exports() {
      return srcExports;
    },
    set exports(v2) {
      srcExports = v2;
    }
  };
  function memoize(fn, options) {
    var cache = options && options.cache ? options.cache : cacheDefault;
    var serializer = options && options.serializer ? options.serializer : serializerDefault;
    var strategy = options && options.strategy ? options.strategy : strategyDefault;
    return strategy(fn, {
      cache,
      serializer
    });
  }
  function isPrimitive(value) {
    return value == null || typeof value === "number" || typeof value === "boolean";
  }
  function monadic(fn, cache, serializer, arg) {
    var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
      computedValue = fn.call(this, arg);
      cache.set(cacheKey, computedValue);
    }
    return computedValue;
  }
  function variadic(fn, cache, serializer) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cacheKey = serializer(args);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === "undefined") {
      computedValue = fn.apply(this, args);
      cache.set(cacheKey, computedValue);
    }
    return computedValue;
  }
  function assemble(fn, context, strategy, cache, serialize2) {
    return strategy.bind(
      context,
      fn,
      cache,
      serialize2
    );
  }
  function strategyDefault(fn, options) {
    var strategy = fn.length === 1 ? monadic : variadic;
    return assemble(
      fn,
      this,
      strategy,
      options.cache.create(),
      options.serializer
    );
  }
  function strategyVariadic(fn, options) {
    var strategy = variadic;
    return assemble(
      fn,
      this,
      strategy,
      options.cache.create(),
      options.serializer
    );
  }
  function strategyMonadic(fn, options) {
    var strategy = monadic;
    return assemble(
      fn,
      this,
      strategy,
      options.cache.create(),
      options.serializer
    );
  }
  function serializerDefault() {
    return JSON.stringify(arguments);
  }
  function ObjectWithoutPrototypeCache() {
    this.cache = /* @__PURE__ */ Object.create(null);
  }
  ObjectWithoutPrototypeCache.prototype.has = function(key) {
    return key in this.cache;
  };
  ObjectWithoutPrototypeCache.prototype.get = function(key) {
    return this.cache[key];
  };
  ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
    this.cache[key] = value;
  };
  var cacheDefault = {
    create: function create() {
      return new ObjectWithoutPrototypeCache();
    }
  };
  src.exports = memoize;
  srcExports.strategies = {
    variadic: strategyVariadic,
    monadic: strategyMonadic
  };
  var __extends$1 = globalThis && globalThis.__extends || function() {
    var extendStatics2 = function(d2, b2) {
      extendStatics2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
        d3.__proto__ = b3;
      } || function(d3, b3) {
        for (var p2 in b3)
          if (Object.prototype.hasOwnProperty.call(b3, p2))
            d3[p2] = b3[p2];
      };
      return extendStatics2(d2, b2);
    };
    return function(d2, b2) {
      extendStatics2(d2, b2);
      function __() {
        this.constructor = d2;
      }
      d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
    };
  }();
  var __assign$3 = globalThis && globalThis.__assign || function() {
    __assign$3 = Object.assign || function(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign$3.apply(this, arguments);
  };
  var DEFAULT_SIZE = {
    width: "auto",
    height: "auto"
  };
  var clamp = srcExports(function(n2, min, max) {
    return Math.max(Math.min(n2, max), min);
  });
  var snap = srcExports(function(n2, size) {
    return Math.round(n2 / size) * size;
  });
  var hasDirection = srcExports(function(dir, target) {
    return new RegExp(dir, "i").test(target);
  });
  var isTouchEvent = function(event) {
    return Boolean(event.touches && event.touches.length);
  };
  var isMouseEvent = function(event) {
    return Boolean((event.clientX || event.clientX === 0) && (event.clientY || event.clientY === 0));
  };
  var findClosestSnap = srcExports(function(n2, snapArray, snapGap) {
    if (snapGap === void 0) {
      snapGap = 0;
    }
    var closestGapIndex = snapArray.reduce(function(prev2, curr, index2) {
      return Math.abs(curr - n2) < Math.abs(snapArray[prev2] - n2) ? index2 : prev2;
    }, 0);
    var gap = Math.abs(snapArray[closestGapIndex] - n2);
    return snapGap === 0 || gap < snapGap ? snapArray[closestGapIndex] : n2;
  });
  var endsWith = srcExports(function(str, searchStr) {
    return str.substr(str.length - searchStr.length, searchStr.length) === searchStr;
  });
  var getStringSize = srcExports(function(n2) {
    n2 = n2.toString();
    if (n2 === "auto") {
      return n2;
    }
    if (endsWith(n2, "px")) {
      return n2;
    }
    if (endsWith(n2, "%")) {
      return n2;
    }
    if (endsWith(n2, "vh")) {
      return n2;
    }
    if (endsWith(n2, "vw")) {
      return n2;
    }
    if (endsWith(n2, "vmax")) {
      return n2;
    }
    if (endsWith(n2, "vmin")) {
      return n2;
    }
    return n2 + "px";
  });
  var getPixelSize = function(size, parentSize, innerWidth2, innerHeight2) {
    if (size && typeof size === "string") {
      if (endsWith(size, "px")) {
        return Number(size.replace("px", ""));
      }
      if (endsWith(size, "%")) {
        var ratio = Number(size.replace("%", "")) / 100;
        return parentSize * ratio;
      }
      if (endsWith(size, "vw")) {
        var ratio = Number(size.replace("vw", "")) / 100;
        return innerWidth2 * ratio;
      }
      if (endsWith(size, "vh")) {
        var ratio = Number(size.replace("vh", "")) / 100;
        return innerHeight2 * ratio;
      }
    }
    return size;
  };
  var calculateNewMax = srcExports(function(parentSize, innerWidth2, innerHeight2, maxWidth, maxHeight, minWidth, minHeight) {
    maxWidth = getPixelSize(maxWidth, parentSize.width, innerWidth2, innerHeight2);
    maxHeight = getPixelSize(maxHeight, parentSize.height, innerWidth2, innerHeight2);
    minWidth = getPixelSize(minWidth, parentSize.width, innerWidth2, innerHeight2);
    minHeight = getPixelSize(minHeight, parentSize.height, innerWidth2, innerHeight2);
    return {
      maxWidth: typeof maxWidth === "undefined" ? void 0 : Number(maxWidth),
      maxHeight: typeof maxHeight === "undefined" ? void 0 : Number(maxHeight),
      minWidth: typeof minWidth === "undefined" ? void 0 : Number(minWidth),
      minHeight: typeof minHeight === "undefined" ? void 0 : Number(minHeight)
    };
  });
  var definedProps = [
    "as",
    "style",
    "className",
    "grid",
    "snap",
    "bounds",
    "boundsByDirection",
    "size",
    "defaultSize",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "lockAspectRatio",
    "lockAspectRatioExtraWidth",
    "lockAspectRatioExtraHeight",
    "enable",
    "handleStyles",
    "handleClasses",
    "handleWrapperStyle",
    "handleWrapperClass",
    "children",
    "onResizeStart",
    "onResize",
    "onResizeStop",
    "handleComponent",
    "scale",
    "resizeRatio",
    "snapGap"
  ];
  var baseClassName = "__resizable_base__";
  var Resizable = (
    /** @class */
    function(_super) {
      __extends$1(Resizable2, _super);
      function Resizable2(props) {
        var _this = _super.call(this, props) || this;
        _this.ratio = 1;
        _this.resizable = null;
        _this.parentLeft = 0;
        _this.parentTop = 0;
        _this.resizableLeft = 0;
        _this.resizableRight = 0;
        _this.resizableTop = 0;
        _this.resizableBottom = 0;
        _this.targetLeft = 0;
        _this.targetTop = 0;
        _this.appendBase = function() {
          if (!_this.resizable || !_this.window) {
            return null;
          }
          var parent = _this.parentNode;
          if (!parent) {
            return null;
          }
          var element = _this.window.document.createElement("div");
          element.style.width = "100%";
          element.style.height = "100%";
          element.style.position = "absolute";
          element.style.transform = "scale(0, 0)";
          element.style.left = "0";
          element.style.flex = "0 0 100%";
          if (element.classList) {
            element.classList.add(baseClassName);
          } else {
            element.className += baseClassName;
          }
          parent.appendChild(element);
          return element;
        };
        _this.removeBase = function(base) {
          var parent = _this.parentNode;
          if (!parent) {
            return;
          }
          parent.removeChild(base);
        };
        _this.ref = function(c2) {
          if (c2) {
            _this.resizable = c2;
          }
        };
        _this.state = {
          isResizing: false,
          width: typeof (_this.propsSize && _this.propsSize.width) === "undefined" ? "auto" : _this.propsSize && _this.propsSize.width,
          height: typeof (_this.propsSize && _this.propsSize.height) === "undefined" ? "auto" : _this.propsSize && _this.propsSize.height,
          direction: "right",
          original: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          },
          backgroundStyle: {
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0)",
            cursor: "auto",
            opacity: 0,
            position: "fixed",
            zIndex: 9999,
            top: "0",
            left: "0",
            bottom: "0",
            right: "0"
          },
          flexBasis: void 0
        };
        _this.onResizeStart = _this.onResizeStart.bind(_this);
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        return _this;
      }
      Object.defineProperty(Resizable2.prototype, "parentNode", {
        get: function() {
          if (!this.resizable) {
            return null;
          }
          return this.resizable.parentNode;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Resizable2.prototype, "window", {
        get: function() {
          if (!this.resizable) {
            return null;
          }
          if (!this.resizable.ownerDocument) {
            return null;
          }
          return this.resizable.ownerDocument.defaultView;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Resizable2.prototype, "propsSize", {
        get: function() {
          return this.props.size || this.props.defaultSize || DEFAULT_SIZE;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Resizable2.prototype, "size", {
        get: function() {
          var width = 0;
          var height = 0;
          if (this.resizable && this.window) {
            var orgWidth = this.resizable.offsetWidth;
            var orgHeight = this.resizable.offsetHeight;
            var orgPosition = this.resizable.style.position;
            if (orgPosition !== "relative") {
              this.resizable.style.position = "relative";
            }
            width = this.resizable.style.width !== "auto" ? this.resizable.offsetWidth : orgWidth;
            height = this.resizable.style.height !== "auto" ? this.resizable.offsetHeight : orgHeight;
            this.resizable.style.position = orgPosition;
          }
          return { width, height };
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Resizable2.prototype, "sizeStyle", {
        get: function() {
          var _this = this;
          var size = this.props.size;
          var getSize = function(key) {
            if (typeof _this.state[key] === "undefined" || _this.state[key] === "auto") {
              return "auto";
            }
            if (_this.propsSize && _this.propsSize[key] && endsWith(_this.propsSize[key].toString(), "%")) {
              if (endsWith(_this.state[key].toString(), "%")) {
                return _this.state[key].toString();
              }
              var parentSize = _this.getParentSize();
              var value = Number(_this.state[key].toString().replace("px", ""));
              var percent = value / parentSize[key] * 100;
              return percent + "%";
            }
            return getStringSize(_this.state[key]);
          };
          var width = size && typeof size.width !== "undefined" && !this.state.isResizing ? getStringSize(size.width) : getSize("width");
          var height = size && typeof size.height !== "undefined" && !this.state.isResizing ? getStringSize(size.height) : getSize("height");
          return { width, height };
        },
        enumerable: false,
        configurable: true
      });
      Resizable2.prototype.getParentSize = function() {
        if (!this.parentNode) {
          if (!this.window) {
            return { width: 0, height: 0 };
          }
          return { width: this.window.innerWidth, height: this.window.innerHeight };
        }
        var base = this.appendBase();
        if (!base) {
          return { width: 0, height: 0 };
        }
        var wrapChanged = false;
        var wrap = this.parentNode.style.flexWrap;
        if (wrap !== "wrap") {
          wrapChanged = true;
          this.parentNode.style.flexWrap = "wrap";
        }
        base.style.position = "relative";
        base.style.minWidth = "100%";
        base.style.minHeight = "100%";
        var size = {
          width: base.offsetWidth,
          height: base.offsetHeight
        };
        if (wrapChanged) {
          this.parentNode.style.flexWrap = wrap;
        }
        this.removeBase(base);
        return size;
      };
      Resizable2.prototype.bindEvents = function() {
        if (this.window) {
          this.window.addEventListener("mouseup", this.onMouseUp);
          this.window.addEventListener("mousemove", this.onMouseMove);
          this.window.addEventListener("mouseleave", this.onMouseUp);
          this.window.addEventListener("touchmove", this.onMouseMove, {
            capture: true,
            passive: false
          });
          this.window.addEventListener("touchend", this.onMouseUp);
        }
      };
      Resizable2.prototype.unbindEvents = function() {
        if (this.window) {
          this.window.removeEventListener("mouseup", this.onMouseUp);
          this.window.removeEventListener("mousemove", this.onMouseMove);
          this.window.removeEventListener("mouseleave", this.onMouseUp);
          this.window.removeEventListener("touchmove", this.onMouseMove, true);
          this.window.removeEventListener("touchend", this.onMouseUp);
        }
      };
      Resizable2.prototype.componentDidMount = function() {
        if (!this.resizable || !this.window) {
          return;
        }
        var computedStyle = this.window.getComputedStyle(this.resizable);
        this.setState({
          width: this.state.width || this.size.width,
          height: this.state.height || this.size.height,
          flexBasis: computedStyle.flexBasis !== "auto" ? computedStyle.flexBasis : void 0
        });
      };
      Resizable2.prototype.componentWillUnmount = function() {
        if (this.window) {
          this.unbindEvents();
        }
      };
      Resizable2.prototype.createSizeForCssProperty = function(newSize, kind) {
        var propsSize = this.propsSize && this.propsSize[kind];
        return this.state[kind] === "auto" && this.state.original[kind] === newSize && (typeof propsSize === "undefined" || propsSize === "auto") ? "auto" : newSize;
      };
      Resizable2.prototype.calculateNewMaxFromBoundary = function(maxWidth, maxHeight) {
        var boundsByDirection = this.props.boundsByDirection;
        var direction = this.state.direction;
        var widthByDirection = boundsByDirection && hasDirection("left", direction);
        var heightByDirection = boundsByDirection && hasDirection("top", direction);
        var boundWidth;
        var boundHeight;
        if (this.props.bounds === "parent") {
          var parent_1 = this.parentNode;
          if (parent_1) {
            boundWidth = widthByDirection ? this.resizableRight - this.parentLeft : parent_1.offsetWidth + (this.parentLeft - this.resizableLeft);
            boundHeight = heightByDirection ? this.resizableBottom - this.parentTop : parent_1.offsetHeight + (this.parentTop - this.resizableTop);
          }
        } else if (this.props.bounds === "window") {
          if (this.window) {
            boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
            boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
          }
        } else if (this.props.bounds) {
          boundWidth = widthByDirection ? this.resizableRight - this.targetLeft : this.props.bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
          boundHeight = heightByDirection ? this.resizableBottom - this.targetTop : this.props.bounds.offsetHeight + (this.targetTop - this.resizableTop);
        }
        if (boundWidth && Number.isFinite(boundWidth)) {
          maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
        }
        if (boundHeight && Number.isFinite(boundHeight)) {
          maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
        }
        return { maxWidth, maxHeight };
      };
      Resizable2.prototype.calculateNewSizeFromDirection = function(clientX, clientY) {
        var scale = this.props.scale || 1;
        var resizeRatio = this.props.resizeRatio || 1;
        var _a2 = this.state, direction = _a2.direction, original = _a2.original;
        var _b2 = this.props, lockAspectRatio = _b2.lockAspectRatio, lockAspectRatioExtraHeight = _b2.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _b2.lockAspectRatioExtraWidth;
        var newWidth = original.width;
        var newHeight = original.height;
        var extraHeight = lockAspectRatioExtraHeight || 0;
        var extraWidth = lockAspectRatioExtraWidth || 0;
        if (hasDirection("right", direction)) {
          newWidth = original.width + (clientX - original.x) * resizeRatio / scale;
          if (lockAspectRatio) {
            newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
          }
        }
        if (hasDirection("left", direction)) {
          newWidth = original.width - (clientX - original.x) * resizeRatio / scale;
          if (lockAspectRatio) {
            newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
          }
        }
        if (hasDirection("bottom", direction)) {
          newHeight = original.height + (clientY - original.y) * resizeRatio / scale;
          if (lockAspectRatio) {
            newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
          }
        }
        if (hasDirection("top", direction)) {
          newHeight = original.height - (clientY - original.y) * resizeRatio / scale;
          if (lockAspectRatio) {
            newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
          }
        }
        return { newWidth, newHeight };
      };
      Resizable2.prototype.calculateNewSizeFromAspectRatio = function(newWidth, newHeight, max, min) {
        var _a2 = this.props, lockAspectRatio = _a2.lockAspectRatio, lockAspectRatioExtraHeight = _a2.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _a2.lockAspectRatioExtraWidth;
        var computedMinWidth = typeof min.width === "undefined" ? 10 : min.width;
        var computedMaxWidth = typeof max.width === "undefined" || max.width < 0 ? newWidth : max.width;
        var computedMinHeight = typeof min.height === "undefined" ? 10 : min.height;
        var computedMaxHeight = typeof max.height === "undefined" || max.height < 0 ? newHeight : max.height;
        var extraHeight = lockAspectRatioExtraHeight || 0;
        var extraWidth = lockAspectRatioExtraWidth || 0;
        if (lockAspectRatio) {
          var extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
          var extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
          var extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
          var extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
          var lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
          var lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
          var lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
          var lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
          newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
          newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
        } else {
          newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
          newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
        }
        return { newWidth, newHeight };
      };
      Resizable2.prototype.setBoundingClientRect = function() {
        if (this.props.bounds === "parent") {
          var parent_2 = this.parentNode;
          if (parent_2) {
            var parentRect = parent_2.getBoundingClientRect();
            this.parentLeft = parentRect.left;
            this.parentTop = parentRect.top;
          }
        }
        if (this.props.bounds && typeof this.props.bounds !== "string") {
          var targetRect = this.props.bounds.getBoundingClientRect();
          this.targetLeft = targetRect.left;
          this.targetTop = targetRect.top;
        }
        if (this.resizable) {
          var _a2 = this.resizable.getBoundingClientRect(), left = _a2.left, top_1 = _a2.top, right = _a2.right, bottom = _a2.bottom;
          this.resizableLeft = left;
          this.resizableRight = right;
          this.resizableTop = top_1;
          this.resizableBottom = bottom;
        }
      };
      Resizable2.prototype.onResizeStart = function(event, direction) {
        if (!this.resizable || !this.window) {
          return;
        }
        var clientX = 0;
        var clientY = 0;
        if (event.nativeEvent && isMouseEvent(event.nativeEvent)) {
          clientX = event.nativeEvent.clientX;
          clientY = event.nativeEvent.clientY;
        } else if (event.nativeEvent && isTouchEvent(event.nativeEvent)) {
          clientX = event.nativeEvent.touches[0].clientX;
          clientY = event.nativeEvent.touches[0].clientY;
        }
        if (this.props.onResizeStart) {
          if (this.resizable) {
            var startResize = this.props.onResizeStart(event, direction, this.resizable);
            if (startResize === false) {
              return;
            }
          }
        }
        if (this.props.size) {
          if (typeof this.props.size.height !== "undefined" && this.props.size.height !== this.state.height) {
            this.setState({ height: this.props.size.height });
          }
          if (typeof this.props.size.width !== "undefined" && this.props.size.width !== this.state.width) {
            this.setState({ width: this.props.size.width });
          }
        }
        this.ratio = typeof this.props.lockAspectRatio === "number" ? this.props.lockAspectRatio : this.size.width / this.size.height;
        var flexBasis;
        var computedStyle = this.window.getComputedStyle(this.resizable);
        if (computedStyle.flexBasis !== "auto") {
          var parent_3 = this.parentNode;
          if (parent_3) {
            var dir = this.window.getComputedStyle(parent_3).flexDirection;
            this.flexDir = dir.startsWith("row") ? "row" : "column";
            flexBasis = computedStyle.flexBasis;
          }
        }
        this.setBoundingClientRect();
        this.bindEvents();
        var state = {
          original: {
            x: clientX,
            y: clientY,
            width: this.size.width,
            height: this.size.height
          },
          isResizing: true,
          backgroundStyle: __assign$3(__assign$3({}, this.state.backgroundStyle), { cursor: this.window.getComputedStyle(event.target).cursor || "auto" }),
          direction,
          flexBasis
        };
        this.setState(state);
      };
      Resizable2.prototype.onMouseMove = function(event) {
        if (!this.state.isResizing || !this.resizable || !this.window) {
          return;
        }
        if (this.window.TouchEvent && isTouchEvent(event)) {
          try {
            event.preventDefault();
            event.stopPropagation();
          } catch (e2) {
          }
        }
        var _a2 = this.props, maxWidth = _a2.maxWidth, maxHeight = _a2.maxHeight, minWidth = _a2.minWidth, minHeight = _a2.minHeight;
        var clientX = isTouchEvent(event) ? event.touches[0].clientX : event.clientX;
        var clientY = isTouchEvent(event) ? event.touches[0].clientY : event.clientY;
        var _b2 = this.state, direction = _b2.direction, original = _b2.original, width = _b2.width, height = _b2.height;
        var parentSize = this.getParentSize();
        var max = calculateNewMax(parentSize, this.window.innerWidth, this.window.innerHeight, maxWidth, maxHeight, minWidth, minHeight);
        maxWidth = max.maxWidth;
        maxHeight = max.maxHeight;
        minWidth = max.minWidth;
        minHeight = max.minHeight;
        var _c2 = this.calculateNewSizeFromDirection(clientX, clientY), newHeight = _c2.newHeight, newWidth = _c2.newWidth;
        var boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);
        if (this.props.snap && this.props.snap.x) {
          newWidth = findClosestSnap(newWidth, this.props.snap.x, this.props.snapGap);
        }
        if (this.props.snap && this.props.snap.y) {
          newHeight = findClosestSnap(newHeight, this.props.snap.y, this.props.snapGap);
        }
        var newSize = this.calculateNewSizeFromAspectRatio(newWidth, newHeight, { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight }, { width: minWidth, height: minHeight });
        newWidth = newSize.newWidth;
        newHeight = newSize.newHeight;
        if (this.props.grid) {
          var newGridWidth = snap(newWidth, this.props.grid[0]);
          var newGridHeight = snap(newHeight, this.props.grid[1]);
          var gap = this.props.snapGap || 0;
          newWidth = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
          newHeight = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
        }
        var delta = {
          width: newWidth - original.width,
          height: newHeight - original.height
        };
        if (width && typeof width === "string") {
          if (endsWith(width, "%")) {
            var percent = newWidth / parentSize.width * 100;
            newWidth = percent + "%";
          } else if (endsWith(width, "vw")) {
            var vw = newWidth / this.window.innerWidth * 100;
            newWidth = vw + "vw";
          } else if (endsWith(width, "vh")) {
            var vh = newWidth / this.window.innerHeight * 100;
            newWidth = vh + "vh";
          }
        }
        if (height && typeof height === "string") {
          if (endsWith(height, "%")) {
            var percent = newHeight / parentSize.height * 100;
            newHeight = percent + "%";
          } else if (endsWith(height, "vw")) {
            var vw = newHeight / this.window.innerWidth * 100;
            newHeight = vw + "vw";
          } else if (endsWith(height, "vh")) {
            var vh = newHeight / this.window.innerHeight * 100;
            newHeight = vh + "vh";
          }
        }
        var newState = {
          width: this.createSizeForCssProperty(newWidth, "width"),
          height: this.createSizeForCssProperty(newHeight, "height")
        };
        if (this.flexDir === "row") {
          newState.flexBasis = newState.width;
        } else if (this.flexDir === "column") {
          newState.flexBasis = newState.height;
        }
        this.setState(newState);
        if (this.props.onResize) {
          this.props.onResize(event, direction, this.resizable, delta);
        }
      };
      Resizable2.prototype.onMouseUp = function(event) {
        var _a2 = this.state, isResizing = _a2.isResizing, direction = _a2.direction, original = _a2.original;
        if (!isResizing || !this.resizable) {
          return;
        }
        var delta = {
          width: this.size.width - original.width,
          height: this.size.height - original.height
        };
        if (this.props.onResizeStop) {
          this.props.onResizeStop(event, direction, this.resizable, delta);
        }
        if (this.props.size) {
          this.setState(this.props.size);
        }
        this.unbindEvents();
        this.setState({
          isResizing: false,
          backgroundStyle: __assign$3(__assign$3({}, this.state.backgroundStyle), { cursor: "auto" })
        });
      };
      Resizable2.prototype.updateSize = function(size) {
        this.setState({ width: size.width, height: size.height });
      };
      Resizable2.prototype.renderResizer = function() {
        var _this = this;
        var _a2 = this.props, enable = _a2.enable, handleStyles = _a2.handleStyles, handleClasses = _a2.handleClasses, handleWrapperStyle = _a2.handleWrapperStyle, handleWrapperClass = _a2.handleWrapperClass, handleComponent = _a2.handleComponent;
        if (!enable) {
          return null;
        }
        var resizers = Object.keys(enable).map(function(dir) {
          if (enable[dir] !== false) {
            return React__namespace.createElement(Resizer, { key: dir, direction: dir, onResizeStart: _this.onResizeStart, replaceStyles: handleStyles && handleStyles[dir], className: handleClasses && handleClasses[dir] }, handleComponent && handleComponent[dir] ? handleComponent[dir] : null);
          }
          return null;
        });
        return React__namespace.createElement("div", { className: handleWrapperClass, style: handleWrapperStyle }, resizers);
      };
      Resizable2.prototype.render = function() {
        var _this = this;
        var extendsProps = Object.keys(this.props).reduce(function(acc, key) {
          if (definedProps.indexOf(key) !== -1) {
            return acc;
          }
          acc[key] = _this.props[key];
          return acc;
        }, {});
        var style = __assign$3(__assign$3(__assign$3({ position: "relative", userSelect: this.state.isResizing ? "none" : "auto" }, this.props.style), this.sizeStyle), { maxWidth: this.props.maxWidth, maxHeight: this.props.maxHeight, minWidth: this.props.minWidth, minHeight: this.props.minHeight, boxSizing: "border-box", flexShrink: 0 });
        if (this.state.flexBasis) {
          style.flexBasis = this.state.flexBasis;
        }
        var Wrapper = this.props.as || "div";
        return React__namespace.createElement(
          Wrapper,
          __assign$3({ ref: this.ref, style, className: this.props.className }, extendsProps),
          this.state.isResizing && React__namespace.createElement("div", { style: this.state.backgroundStyle }),
          this.props.children,
          this.renderResizer()
        );
      };
      Resizable2.defaultProps = {
        as: "div",
        onResizeStart: function() {
        },
        onResize: function() {
        },
        onResizeStop: function() {
        },
        enable: {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        },
        style: {},
        grid: [1, 1],
        lockAspectRatio: false,
        lockAspectRatioExtraWidth: 0,
        lockAspectRatioExtraHeight: 0,
        scale: 1,
        resizeRatio: 1,
        snapGap: 0
      };
      return Resizable2;
    }(React__namespace.PureComponent)
  );
  /*! *****************************************************************************
  	Copyright (c) Microsoft Corporation. All rights reserved.
  	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  	this file except in compliance with the License. You may obtain a copy of the
  	License at http://www.apache.org/licenses/LICENSE-2.0
  
  	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  	MERCHANTABLITY OR NON-INFRINGEMENT.
  
  	See the Apache Version 2.0 License for specific language governing permissions
  	and limitations under the License.
  	***************************************************************************** */
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p2 in b3)
        if (b3.hasOwnProperty(p2))
          d3[p2] = b3[p2];
    };
    return extendStatics(d2, b2);
  };
  function __extends(d2, b2) {
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  }
  var __assign$2 = function() {
    __assign$2 = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign$2.apply(this, arguments);
  };
  function __rest$1(s2, e2) {
    var t2 = {};
    for (var p2 in s2)
      if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
        t2[p2] = s2[p2];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
        if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
          t2[p2[i2]] = s2[p2[i2]];
      }
    return t2;
  }
  var Draggable = cjsExports;
  var resizableStyle = {
    width: "auto",
    height: "auto",
    display: "inline-block",
    position: "absolute",
    top: 0,
    left: 0
  };
  var getEnableResizingByFlag = function(flag) {
    return {
      bottom: flag,
      bottomLeft: flag,
      bottomRight: flag,
      left: flag,
      right: flag,
      top: flag,
      topLeft: flag,
      topRight: flag
    };
  };
  var Rnd = (
    /** @class */
    function(_super) {
      __extends(Rnd2, _super);
      function Rnd2(props) {
        var _this = _super.call(this, props) || this;
        _this.resizingPosition = { x: 0, y: 0 };
        _this.offsetFromParent = { left: 0, top: 0 };
        _this.resizableElement = { current: null };
        _this.originalPosition = { x: 0, y: 0 };
        _this.refDraggable = function(c2) {
          if (!c2)
            return;
          _this.draggable = c2;
        };
        _this.refResizable = function(c2) {
          if (!c2)
            return;
          _this.resizable = c2;
          _this.resizableElement.current = c2.resizable;
        };
        _this.state = {
          resizing: false,
          bounds: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
          maxWidth: props.maxWidth,
          maxHeight: props.maxHeight
        };
        _this.onResizeStart = _this.onResizeStart.bind(_this);
        _this.onResize = _this.onResize.bind(_this);
        _this.onResizeStop = _this.onResizeStop.bind(_this);
        _this.onDragStart = _this.onDragStart.bind(_this);
        _this.onDrag = _this.onDrag.bind(_this);
        _this.onDragStop = _this.onDragStop.bind(_this);
        _this.getMaxSizesFromProps = _this.getMaxSizesFromProps.bind(_this);
        return _this;
      }
      Rnd2.prototype.componentDidMount = function() {
        this.updateOffsetFromParent();
        var _a2 = this.offsetFromParent, left = _a2.left, top2 = _a2.top;
        var _b2 = this.getDraggablePosition(), x2 = _b2.x, y2 = _b2.y;
        this.draggable.setState({
          x: x2 - left,
          y: y2 - top2
        });
        this.forceUpdate();
      };
      Rnd2.prototype.getDraggablePosition = function() {
        var _a2 = this.draggable.state, x2 = _a2.x, y2 = _a2.y;
        return { x: x2, y: y2 };
      };
      Rnd2.prototype.getParent = function() {
        return this.resizable && this.resizable.parentNode;
      };
      Rnd2.prototype.getParentSize = function() {
        return this.resizable.getParentSize();
      };
      Rnd2.prototype.getMaxSizesFromProps = function() {
        var maxWidth = typeof this.props.maxWidth === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxWidth;
        var maxHeight = typeof this.props.maxHeight === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxHeight;
        return { maxWidth, maxHeight };
      };
      Rnd2.prototype.getSelfElement = function() {
        return this.resizable && this.resizable.resizable;
      };
      Rnd2.prototype.getOffsetHeight = function(boundary) {
        var scale = this.props.scale;
        switch (this.props.bounds) {
          case "window":
            return window.innerHeight / scale;
          case "body":
            return document.body.offsetHeight / scale;
          default:
            return boundary.offsetHeight;
        }
      };
      Rnd2.prototype.getOffsetWidth = function(boundary) {
        var scale = this.props.scale;
        switch (this.props.bounds) {
          case "window":
            return window.innerWidth / scale;
          case "body":
            return document.body.offsetWidth / scale;
          default:
            return boundary.offsetWidth;
        }
      };
      Rnd2.prototype.onDragStart = function(e2, data) {
        if (this.props.onDragStart) {
          this.props.onDragStart(e2, data);
        }
        var pos = this.getDraggablePosition();
        this.originalPosition = pos;
        if (!this.props.bounds)
          return;
        var parent = this.getParent();
        var scale = this.props.scale;
        var boundary;
        if (this.props.bounds === "parent") {
          boundary = parent;
        } else if (this.props.bounds === "body") {
          var parentRect_1 = parent.getBoundingClientRect();
          var parentLeft_1 = parentRect_1.left;
          var parentTop_1 = parentRect_1.top;
          var bodyRect = document.body.getBoundingClientRect();
          var left_1 = -(parentLeft_1 - parent.offsetLeft * scale - bodyRect.left) / scale;
          var top_1 = -(parentTop_1 - parent.offsetTop * scale - bodyRect.top) / scale;
          var right = (document.body.offsetWidth - this.resizable.size.width * scale) / scale + left_1;
          var bottom = (document.body.offsetHeight - this.resizable.size.height * scale) / scale + top_1;
          return this.setState({ bounds: { top: top_1, right, bottom, left: left_1 } });
        } else if (this.props.bounds === "window") {
          if (!this.resizable)
            return;
          var parentRect_2 = parent.getBoundingClientRect();
          var parentLeft_2 = parentRect_2.left;
          var parentTop_2 = parentRect_2.top;
          var left_2 = -(parentLeft_2 - parent.offsetLeft * scale) / scale;
          var top_2 = -(parentTop_2 - parent.offsetTop * scale) / scale;
          var right = (window.innerWidth - this.resizable.size.width * scale) / scale + left_2;
          var bottom = (window.innerHeight - this.resizable.size.height * scale) / scale + top_2;
          return this.setState({ bounds: { top: top_2, right, bottom, left: left_2 } });
        } else if (typeof this.props.bounds === "string") {
          boundary = document.querySelector(this.props.bounds);
        } else if (this.props.bounds instanceof HTMLElement) {
          boundary = this.props.bounds;
        }
        if (!(boundary instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
          return;
        }
        var boundaryRect = boundary.getBoundingClientRect();
        var boundaryLeft = boundaryRect.left;
        var boundaryTop = boundaryRect.top;
        var parentRect = parent.getBoundingClientRect();
        var parentLeft = parentRect.left;
        var parentTop = parentRect.top;
        var left = (boundaryLeft - parentLeft) / scale;
        var top2 = boundaryTop - parentTop;
        if (!this.resizable)
          return;
        this.updateOffsetFromParent();
        var offset = this.offsetFromParent;
        this.setState({
          bounds: {
            top: top2 - offset.top,
            right: left + (boundary.offsetWidth - this.resizable.size.width) - offset.left / scale,
            bottom: top2 + (boundary.offsetHeight - this.resizable.size.height) - offset.top,
            left: left - offset.left / scale
          }
        });
      };
      Rnd2.prototype.onDrag = function(e2, data) {
        if (!this.props.onDrag)
          return;
        var _a2 = this.offsetFromParent, left = _a2.left, top2 = _a2.top;
        if (!this.props.dragAxis || this.props.dragAxis === "both") {
          return this.props.onDrag(e2, __assign$2(__assign$2({}, data), { x: data.x - left, y: data.y - top2 }));
        } else if (this.props.dragAxis === "x") {
          return this.props.onDrag(e2, __assign$2(__assign$2({}, data), { x: data.x + left, y: this.originalPosition.y + top2, deltaY: 0 }));
        } else if (this.props.dragAxis === "y") {
          return this.props.onDrag(e2, __assign$2(__assign$2({}, data), { x: this.originalPosition.x + left, y: data.y + top2, deltaX: 0 }));
        }
      };
      Rnd2.prototype.onDragStop = function(e2, data) {
        if (!this.props.onDragStop)
          return;
        var _a2 = this.offsetFromParent, left = _a2.left, top2 = _a2.top;
        if (!this.props.dragAxis || this.props.dragAxis === "both") {
          return this.props.onDragStop(e2, __assign$2(__assign$2({}, data), { x: data.x + left, y: data.y + top2 }));
        } else if (this.props.dragAxis === "x") {
          return this.props.onDragStop(e2, __assign$2(__assign$2({}, data), { x: data.x + left, y: this.originalPosition.y + top2, deltaY: 0 }));
        } else if (this.props.dragAxis === "y") {
          return this.props.onDragStop(e2, __assign$2(__assign$2({}, data), { x: this.originalPosition.x + left, y: data.y + top2, deltaX: 0 }));
        }
      };
      Rnd2.prototype.onResizeStart = function(e2, dir, elementRef) {
        e2.stopPropagation();
        this.setState({
          resizing: true
        });
        var scale = this.props.scale;
        var offset = this.offsetFromParent;
        var pos = this.getDraggablePosition();
        this.resizingPosition = { x: pos.x + offset.left, y: pos.y + offset.top };
        this.originalPosition = pos;
        if (this.props.bounds) {
          var parent_1 = this.getParent();
          var boundary = void 0;
          if (this.props.bounds === "parent") {
            boundary = parent_1;
          } else if (this.props.bounds === "body") {
            boundary = document.body;
          } else if (this.props.bounds === "window") {
            boundary = window;
          } else if (typeof this.props.bounds === "string") {
            boundary = document.querySelector(this.props.bounds);
          } else if (this.props.bounds instanceof HTMLElement) {
            boundary = this.props.bounds;
          }
          var self_1 = this.getSelfElement();
          if (self_1 instanceof Element && (boundary instanceof HTMLElement || boundary === window) && parent_1 instanceof HTMLElement) {
            var _a2 = this.getMaxSizesFromProps(), maxWidth = _a2.maxWidth, maxHeight = _a2.maxHeight;
            var parentSize = this.getParentSize();
            if (maxWidth && typeof maxWidth === "string") {
              if (maxWidth.endsWith("%")) {
                var ratio = Number(maxWidth.replace("%", "")) / 100;
                maxWidth = parentSize.width * ratio;
              } else if (maxWidth.endsWith("px")) {
                maxWidth = Number(maxWidth.replace("px", ""));
              }
            }
            if (maxHeight && typeof maxHeight === "string") {
              if (maxHeight.endsWith("%")) {
                var ratio = Number(maxHeight.replace("%", "")) / 100;
                maxHeight = parentSize.width * ratio;
              } else if (maxHeight.endsWith("px")) {
                maxHeight = Number(maxHeight.replace("px", ""));
              }
            }
            var selfRect = self_1.getBoundingClientRect();
            var selfLeft = selfRect.left;
            var selfTop = selfRect.top;
            var boundaryRect = this.props.bounds === "window" ? { left: 0, top: 0 } : boundary.getBoundingClientRect();
            var boundaryLeft = boundaryRect.left;
            var boundaryTop = boundaryRect.top;
            var offsetWidth = this.getOffsetWidth(boundary);
            var offsetHeight = this.getOffsetHeight(boundary);
            var hasLeft = dir.toLowerCase().endsWith("left");
            var hasRight = dir.toLowerCase().endsWith("right");
            var hasTop = dir.startsWith("top");
            var hasBottom = dir.startsWith("bottom");
            if ((hasLeft || hasTop) && this.resizable) {
              var max = (selfLeft - boundaryLeft) / scale + this.resizable.size.width;
              this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
            }
            if (hasRight || this.props.lockAspectRatio && !hasLeft && !hasTop) {
              var max = offsetWidth + (boundaryLeft - selfLeft) / scale;
              this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
            }
            if ((hasTop || hasLeft) && this.resizable) {
              var max = (selfTop - boundaryTop) / scale + this.resizable.size.height;
              this.setState({
                maxHeight: max > Number(maxHeight) ? maxHeight : max
              });
            }
            if (hasBottom || this.props.lockAspectRatio && !hasTop && !hasLeft) {
              var max = offsetHeight + (boundaryTop - selfTop) / scale;
              this.setState({
                maxHeight: max > Number(maxHeight) ? maxHeight : max
              });
            }
          }
        } else {
          this.setState({
            maxWidth: this.props.maxWidth,
            maxHeight: this.props.maxHeight
          });
        }
        if (this.props.onResizeStart) {
          this.props.onResizeStart(e2, dir, elementRef);
        }
      };
      Rnd2.prototype.onResize = function(e2, direction, elementRef, delta) {
        var newPos = { x: this.originalPosition.x, y: this.originalPosition.y };
        var left = -delta.width;
        var top2 = -delta.height;
        var directions = ["top", "left", "topLeft", "bottomLeft", "topRight"];
        if (directions.indexOf(direction) !== -1) {
          if (direction === "bottomLeft") {
            newPos.x += left;
          } else if (direction === "topRight") {
            newPos.y += top2;
          } else {
            newPos.x += left;
            newPos.y += top2;
          }
        }
        if (newPos.x !== this.draggable.state.x || newPos.y !== this.draggable.state.y) {
          this.draggable.setState(newPos);
        }
        this.updateOffsetFromParent();
        var offset = this.offsetFromParent;
        var x2 = this.getDraggablePosition().x + offset.left;
        var y2 = this.getDraggablePosition().y + offset.top;
        this.resizingPosition = { x: x2, y: y2 };
        if (!this.props.onResize)
          return;
        this.props.onResize(e2, direction, elementRef, delta, {
          x: x2,
          y: y2
        });
      };
      Rnd2.prototype.onResizeStop = function(e2, direction, elementRef, delta) {
        this.setState({
          resizing: false
        });
        var _a2 = this.getMaxSizesFromProps(), maxWidth = _a2.maxWidth, maxHeight = _a2.maxHeight;
        this.setState({ maxWidth, maxHeight });
        if (this.props.onResizeStop) {
          this.props.onResizeStop(e2, direction, elementRef, delta, this.resizingPosition);
        }
      };
      Rnd2.prototype.updateSize = function(size) {
        if (!this.resizable)
          return;
        this.resizable.updateSize({ width: size.width, height: size.height });
      };
      Rnd2.prototype.updatePosition = function(position2) {
        this.draggable.setState(position2);
      };
      Rnd2.prototype.updateOffsetFromParent = function() {
        var scale = this.props.scale;
        var parent = this.getParent();
        var self2 = this.getSelfElement();
        if (!parent || self2 === null) {
          return {
            top: 0,
            left: 0
          };
        }
        var parentRect = parent.getBoundingClientRect();
        var parentLeft = parentRect.left;
        var parentTop = parentRect.top;
        var selfRect = self2.getBoundingClientRect();
        var position2 = this.getDraggablePosition();
        var scrollLeft = parent.scrollLeft;
        var scrollTop = parent.scrollTop;
        this.offsetFromParent = {
          left: selfRect.left - parentLeft + scrollLeft - position2.x * scale,
          top: selfRect.top - parentTop + scrollTop - position2.y * scale
        };
      };
      Rnd2.prototype.render = function() {
        var _a2 = this.props, disableDragging = _a2.disableDragging, style = _a2.style, dragHandleClassName = _a2.dragHandleClassName, position2 = _a2.position, onMouseDown = _a2.onMouseDown, onMouseUp = _a2.onMouseUp, dragAxis = _a2.dragAxis, dragGrid = _a2.dragGrid, bounds = _a2.bounds, enableUserSelectHack = _a2.enableUserSelectHack, cancel = _a2.cancel, children = _a2.children;
        _a2.onResizeStart;
        _a2.onResize;
        _a2.onResizeStop;
        _a2.onDragStart;
        _a2.onDrag;
        _a2.onDragStop;
        var resizeHandleStyles = _a2.resizeHandleStyles, resizeHandleClasses = _a2.resizeHandleClasses, resizeHandleComponent = _a2.resizeHandleComponent, enableResizing = _a2.enableResizing, resizeGrid = _a2.resizeGrid, resizeHandleWrapperClass = _a2.resizeHandleWrapperClass, resizeHandleWrapperStyle = _a2.resizeHandleWrapperStyle, scale = _a2.scale, allowAnyClick = _a2.allowAnyClick, resizableProps = __rest$1(_a2, ["disableDragging", "style", "dragHandleClassName", "position", "onMouseDown", "onMouseUp", "dragAxis", "dragGrid", "bounds", "enableUserSelectHack", "cancel", "children", "onResizeStart", "onResize", "onResizeStop", "onDragStart", "onDrag", "onDragStop", "resizeHandleStyles", "resizeHandleClasses", "resizeHandleComponent", "enableResizing", "resizeGrid", "resizeHandleWrapperClass", "resizeHandleWrapperStyle", "scale", "allowAnyClick"]);
        var defaultValue = this.props.default ? __assign$2({}, this.props.default) : void 0;
        delete resizableProps.default;
        var cursorStyle = disableDragging || dragHandleClassName ? { cursor: "auto" } : { cursor: "move" };
        var innerStyle = __assign$2(__assign$2(__assign$2({}, resizableStyle), cursorStyle), style);
        var _b2 = this.offsetFromParent, left = _b2.left, top2 = _b2.top;
        var draggablePosition;
        if (position2) {
          draggablePosition = {
            x: position2.x - left,
            y: position2.y - top2
          };
        }
        var pos = this.state.resizing ? void 0 : draggablePosition;
        var dragAxisOrUndefined = this.state.resizing ? "both" : dragAxis;
        return React$1.createElement(
          Draggable,
          { ref: this.refDraggable, handle: dragHandleClassName ? ".".concat(dragHandleClassName) : void 0, defaultPosition: defaultValue, onMouseDown, onMouseUp, onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop, axis: dragAxisOrUndefined, disabled: disableDragging, grid: dragGrid, bounds: bounds ? this.state.bounds : void 0, position: pos, enableUserSelectHack, cancel, scale, allowAnyClick, nodeRef: this.resizableElement },
          React$1.createElement(Resizable, __assign$2({}, resizableProps, { ref: this.refResizable, defaultSize: defaultValue, size: this.props.size, enable: typeof enableResizing === "boolean" ? getEnableResizingByFlag(enableResizing) : enableResizing, onResizeStart: this.onResizeStart, onResize: this.onResize, onResizeStop: this.onResizeStop, style: innerStyle, minWidth: this.props.minWidth, minHeight: this.props.minHeight, maxWidth: this.state.resizing ? this.state.maxWidth : this.props.maxWidth, maxHeight: this.state.resizing ? this.state.maxHeight : this.props.maxHeight, grid: resizeGrid, handleWrapperClass: resizeHandleWrapperClass, handleWrapperStyle: resizeHandleWrapperStyle, lockAspectRatio: this.props.lockAspectRatio, lockAspectRatioExtraWidth: this.props.lockAspectRatioExtraWidth, lockAspectRatioExtraHeight: this.props.lockAspectRatioExtraHeight, handleStyles: resizeHandleStyles, handleClasses: resizeHandleClasses, handleComponent: resizeHandleComponent, scale: this.props.scale }), children)
        );
      };
      Rnd2.defaultProps = {
        maxWidth: Number.MAX_SAFE_INTEGER,
        maxHeight: Number.MAX_SAFE_INTEGER,
        scale: 1,
        onResizeStart: function() {
        },
        onResize: function() {
        },
        onResizeStop: function() {
        },
        onDragStart: function() {
        },
        onDrag: function() {
        },
        onDragStop: function() {
        }
      };
      return Rnd2;
    }(React$1.PureComponent)
  );
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  const freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  const root$1 = root;
  var Symbol$1 = root$1.Symbol;
  const Symbol$2 = Symbol$1;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e2) {
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
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
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
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index2 = string.length;
    while (index2-- && reWhitespace.test(string.charAt(index2))) {
    }
    return index2;
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
  var now = function() {
    return root$1.Date.now();
  };
  const now$1 = now;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
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
  var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  var canUseDom = canUseDOM;
  var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign$1.apply(this, arguments);
  };
  var cachedScrollbarWidth = null;
  var cachedDevicePixelRatio = null;
  if (canUseDom) {
    window.addEventListener("resize", function() {
      if (cachedDevicePixelRatio !== window.devicePixelRatio) {
        cachedDevicePixelRatio = window.devicePixelRatio;
        cachedScrollbarWidth = null;
      }
    });
  }
  function scrollbarWidth() {
    if (cachedScrollbarWidth === null) {
      if (typeof document === "undefined") {
        cachedScrollbarWidth = 0;
        return cachedScrollbarWidth;
      }
      var body = document.body;
      var box = document.createElement("div");
      box.classList.add("simplebar-hide-scrollbar");
      body.appendChild(box);
      var width = box.getBoundingClientRect().right;
      body.removeChild(box);
      cachedScrollbarWidth = width;
    }
    return cachedScrollbarWidth;
  }
  function getElementWindow$1(element) {
    if (!element || !element.ownerDocument || !element.ownerDocument.defaultView) {
      return window;
    }
    return element.ownerDocument.defaultView;
  }
  function getElementDocument$1(element) {
    if (!element || !element.ownerDocument) {
      return document;
    }
    return element.ownerDocument;
  }
  var getOptions$1 = function(obj) {
    var initialObj = {};
    var options = Array.prototype.reduce.call(obj, function(acc, attribute) {
      var option = attribute.name.match(/data-simplebar-(.+)/);
      if (option) {
        var key = option[1].replace(/\W+(.)/g, function(_2, chr) {
          return chr.toUpperCase();
        });
        switch (attribute.value) {
          case "true":
            acc[key] = true;
            break;
          case "false":
            acc[key] = false;
            break;
          case void 0:
            acc[key] = true;
            break;
          default:
            acc[key] = attribute.value;
        }
      }
      return acc;
    }, initialObj);
    return options;
  };
  function addClasses$1(el, classes) {
    var _a2;
    if (!el)
      return;
    (_a2 = el.classList).add.apply(_a2, classes.split(" "));
  }
  function removeClasses$1(el, classes) {
    if (!el)
      return;
    classes.split(" ").forEach(function(className) {
      el.classList.remove(className);
    });
  }
  function classNamesToQuery$1(classNames) {
    return ".".concat(classNames.split(" ").join("."));
  }
  var helpers = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    getElementWindow: getElementWindow$1,
    getElementDocument: getElementDocument$1,
    getOptions: getOptions$1,
    addClasses: addClasses$1,
    removeClasses: removeClasses$1,
    classNamesToQuery: classNamesToQuery$1
  });
  var getElementWindow = getElementWindow$1, getElementDocument = getElementDocument$1, getOptions = getOptions$1, addClasses = addClasses$1, removeClasses = removeClasses$1, classNamesToQuery = classNamesToQuery$1;
  var SimpleBarCore = (
    /** @class */
    function() {
      function SimpleBarCore2(element, options) {
        if (options === void 0) {
          options = {};
        }
        var _this = this;
        this.removePreventClickId = null;
        this.minScrollbarWidth = 20;
        this.stopScrollDelay = 175;
        this.isScrolling = false;
        this.isMouseEntering = false;
        this.scrollXTicking = false;
        this.scrollYTicking = false;
        this.wrapperEl = null;
        this.contentWrapperEl = null;
        this.contentEl = null;
        this.offsetEl = null;
        this.maskEl = null;
        this.placeholderEl = null;
        this.heightAutoObserverWrapperEl = null;
        this.heightAutoObserverEl = null;
        this.rtlHelpers = null;
        this.scrollbarWidth = 0;
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.elStyles = null;
        this.isRtl = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.onMouseMove = function() {
        };
        this.onWindowResize = function() {
        };
        this.onStopScrolling = function() {
        };
        this.onMouseEntered = function() {
        };
        this.onScroll = function() {
          var elWindow = getElementWindow(_this.el);
          if (!_this.scrollXTicking) {
            elWindow.requestAnimationFrame(_this.scrollX);
            _this.scrollXTicking = true;
          }
          if (!_this.scrollYTicking) {
            elWindow.requestAnimationFrame(_this.scrollY);
            _this.scrollYTicking = true;
          }
          if (!_this.isScrolling) {
            _this.isScrolling = true;
            addClasses(_this.el, _this.classNames.scrolling);
          }
          _this.showScrollbar("x");
          _this.showScrollbar("y");
          _this.onStopScrolling();
        };
        this.scrollX = function() {
          if (_this.axis.x.isOverflowing) {
            _this.positionScrollbar("x");
          }
          _this.scrollXTicking = false;
        };
        this.scrollY = function() {
          if (_this.axis.y.isOverflowing) {
            _this.positionScrollbar("y");
          }
          _this.scrollYTicking = false;
        };
        this._onStopScrolling = function() {
          removeClasses(_this.el, _this.classNames.scrolling);
          if (_this.options.autoHide) {
            _this.hideScrollbar("x");
            _this.hideScrollbar("y");
          }
          _this.isScrolling = false;
        };
        this.onMouseEnter = function() {
          if (!_this.isMouseEntering) {
            addClasses(_this.el, _this.classNames.mouseEntered);
            _this.showScrollbar("x");
            _this.showScrollbar("y");
            _this.isMouseEntering = true;
          }
          _this.onMouseEntered();
        };
        this._onMouseEntered = function() {
          removeClasses(_this.el, _this.classNames.mouseEntered);
          if (_this.options.autoHide) {
            _this.hideScrollbar("x");
            _this.hideScrollbar("y");
          }
          _this.isMouseEntering = false;
        };
        this._onMouseMove = function(e2) {
          _this.mouseX = e2.clientX;
          _this.mouseY = e2.clientY;
          if (_this.axis.x.isOverflowing || _this.axis.x.forceVisible) {
            _this.onMouseMoveForAxis("x");
          }
          if (_this.axis.y.isOverflowing || _this.axis.y.forceVisible) {
            _this.onMouseMoveForAxis("y");
          }
        };
        this.onMouseLeave = function() {
          _this.onMouseMove.cancel();
          if (_this.axis.x.isOverflowing || _this.axis.x.forceVisible) {
            _this.onMouseLeaveForAxis("x");
          }
          if (_this.axis.y.isOverflowing || _this.axis.y.forceVisible) {
            _this.onMouseLeaveForAxis("y");
          }
          _this.mouseX = -1;
          _this.mouseY = -1;
        };
        this._onWindowResize = function() {
          _this.scrollbarWidth = _this.getScrollbarWidth();
          _this.hideNativeScrollbar();
        };
        this.onPointerEvent = function(e2) {
          if (!_this.axis.x.track.el || !_this.axis.y.track.el || !_this.axis.x.scrollbar.el || !_this.axis.y.scrollbar.el)
            return;
          var isWithinTrackXBounds, isWithinTrackYBounds;
          _this.axis.x.track.rect = _this.axis.x.track.el.getBoundingClientRect();
          _this.axis.y.track.rect = _this.axis.y.track.el.getBoundingClientRect();
          if (_this.axis.x.isOverflowing || _this.axis.x.forceVisible) {
            isWithinTrackXBounds = _this.isWithinBounds(_this.axis.x.track.rect);
          }
          if (_this.axis.y.isOverflowing || _this.axis.y.forceVisible) {
            isWithinTrackYBounds = _this.isWithinBounds(_this.axis.y.track.rect);
          }
          if (isWithinTrackXBounds || isWithinTrackYBounds) {
            e2.stopPropagation();
            if (e2.type === "pointerdown" && e2.pointerType !== "touch") {
              if (isWithinTrackXBounds) {
                _this.axis.x.scrollbar.rect = _this.axis.x.scrollbar.el.getBoundingClientRect();
                if (_this.isWithinBounds(_this.axis.x.scrollbar.rect)) {
                  _this.onDragStart(e2, "x");
                } else {
                  _this.onTrackClick(e2, "x");
                }
              }
              if (isWithinTrackYBounds) {
                _this.axis.y.scrollbar.rect = _this.axis.y.scrollbar.el.getBoundingClientRect();
                if (_this.isWithinBounds(_this.axis.y.scrollbar.rect)) {
                  _this.onDragStart(e2, "y");
                } else {
                  _this.onTrackClick(e2, "y");
                }
              }
            }
          }
        };
        this.drag = function(e2) {
          var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _j, _k, _l;
          if (!_this.draggedAxis || !_this.contentWrapperEl)
            return;
          var eventOffset;
          var track = _this.axis[_this.draggedAxis].track;
          var trackSize = (_b2 = (_a2 = track.rect) === null || _a2 === void 0 ? void 0 : _a2[_this.axis[_this.draggedAxis].sizeAttr]) !== null && _b2 !== void 0 ? _b2 : 0;
          var scrollbar = _this.axis[_this.draggedAxis].scrollbar;
          var contentSize = (_d2 = (_c2 = _this.contentWrapperEl) === null || _c2 === void 0 ? void 0 : _c2[_this.axis[_this.draggedAxis].scrollSizeAttr]) !== null && _d2 !== void 0 ? _d2 : 0;
          var hostSize = parseInt((_f = (_e2 = _this.elStyles) === null || _e2 === void 0 ? void 0 : _e2[_this.axis[_this.draggedAxis].sizeAttr]) !== null && _f !== void 0 ? _f : "0px", 10);
          e2.preventDefault();
          e2.stopPropagation();
          if (_this.draggedAxis === "y") {
            eventOffset = e2.pageY;
          } else {
            eventOffset = e2.pageX;
          }
          var dragPos = eventOffset - ((_h = (_g = track.rect) === null || _g === void 0 ? void 0 : _g[_this.axis[_this.draggedAxis].offsetAttr]) !== null && _h !== void 0 ? _h : 0) - _this.axis[_this.draggedAxis].dragOffset;
          dragPos = _this.isRtl ? ((_k = (_j = track.rect) === null || _j === void 0 ? void 0 : _j[_this.axis[_this.draggedAxis].sizeAttr]) !== null && _k !== void 0 ? _k : 0) - scrollbar.size - dragPos : dragPos;
          var dragPerc = dragPos / (trackSize - scrollbar.size);
          var scrollPos = dragPerc * (contentSize - hostSize);
          if (_this.draggedAxis === "x" && _this.isRtl) {
            scrollPos = ((_l = SimpleBarCore2.getRtlHelpers()) === null || _l === void 0 ? void 0 : _l.isScrollingToNegative) ? -scrollPos : scrollPos;
          }
          _this.contentWrapperEl[_this.axis[_this.draggedAxis].scrollOffsetAttr] = scrollPos;
        };
        this.onEndDrag = function(e2) {
          var elDocument = getElementDocument(_this.el);
          var elWindow = getElementWindow(_this.el);
          e2.preventDefault();
          e2.stopPropagation();
          removeClasses(_this.el, _this.classNames.dragging);
          elDocument.removeEventListener("mousemove", _this.drag, true);
          elDocument.removeEventListener("mouseup", _this.onEndDrag, true);
          _this.removePreventClickId = elWindow.setTimeout(function() {
            elDocument.removeEventListener("click", _this.preventClick, true);
            elDocument.removeEventListener("dblclick", _this.preventClick, true);
            _this.removePreventClickId = null;
          });
        };
        this.preventClick = function(e2) {
          e2.preventDefault();
          e2.stopPropagation();
        };
        this.el = element;
        this.options = __assign$1(__assign$1({}, SimpleBarCore2.defaultOptions), options);
        this.classNames = __assign$1(__assign$1({}, SimpleBarCore2.defaultOptions.classNames), options.classNames);
        this.axis = {
          x: {
            scrollOffsetAttr: "scrollLeft",
            sizeAttr: "width",
            scrollSizeAttr: "scrollWidth",
            offsetSizeAttr: "offsetWidth",
            offsetAttr: "left",
            overflowAttr: "overflowX",
            dragOffset: 0,
            isOverflowing: true,
            forceVisible: false,
            track: { size: null, el: null, rect: null, isVisible: false },
            scrollbar: { size: null, el: null, rect: null, isVisible: false }
          },
          y: {
            scrollOffsetAttr: "scrollTop",
            sizeAttr: "height",
            scrollSizeAttr: "scrollHeight",
            offsetSizeAttr: "offsetHeight",
            offsetAttr: "top",
            overflowAttr: "overflowY",
            dragOffset: 0,
            isOverflowing: true,
            forceVisible: false,
            track: { size: null, el: null, rect: null, isVisible: false },
            scrollbar: { size: null, el: null, rect: null, isVisible: false }
          }
        };
        if (typeof this.el !== "object" || !this.el.nodeName) {
          throw new Error("Argument passed to SimpleBar must be an HTML element instead of ".concat(this.el));
        }
        this.onMouseMove = throttle(this._onMouseMove, 64);
        this.onWindowResize = debounce(this._onWindowResize, 64, { leading: true });
        this.onStopScrolling = debounce(this._onStopScrolling, this.stopScrollDelay);
        this.onMouseEntered = debounce(this._onMouseEntered, this.stopScrollDelay);
        this.init();
      }
      SimpleBarCore2.getRtlHelpers = function() {
        if (SimpleBarCore2.rtlHelpers) {
          return SimpleBarCore2.rtlHelpers;
        }
        var dummyDiv = document.createElement("div");
        dummyDiv.innerHTML = '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
        var scrollbarDummyEl = dummyDiv.firstElementChild;
        var dummyChild = scrollbarDummyEl === null || scrollbarDummyEl === void 0 ? void 0 : scrollbarDummyEl.firstElementChild;
        if (!dummyChild)
          return null;
        document.body.appendChild(scrollbarDummyEl);
        scrollbarDummyEl.scrollLeft = 0;
        var dummyContainerOffset = SimpleBarCore2.getOffset(scrollbarDummyEl);
        var dummyChildOffset = SimpleBarCore2.getOffset(dummyChild);
        scrollbarDummyEl.scrollLeft = -999;
        var dummyChildOffsetAfterScroll = SimpleBarCore2.getOffset(dummyChild);
        document.body.removeChild(scrollbarDummyEl);
        SimpleBarCore2.rtlHelpers = {
          // determines if the scrolling is responding with negative values
          isScrollOriginAtZero: dummyContainerOffset.left !== dummyChildOffset.left,
          // determines if the origin scrollbar position is inverted or not (positioned on left or right)
          isScrollingToNegative: dummyChildOffset.left !== dummyChildOffsetAfterScroll.left
        };
        return SimpleBarCore2.rtlHelpers;
      };
      SimpleBarCore2.prototype.getScrollbarWidth = function() {
        try {
          if (this.contentWrapperEl && getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display === "none" || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style) {
            return 0;
          } else {
            return scrollbarWidth();
          }
        } catch (e2) {
          return scrollbarWidth();
        }
      };
      SimpleBarCore2.getOffset = function(el) {
        var rect = el.getBoundingClientRect();
        var elDocument = getElementDocument(el);
        var elWindow = getElementWindow(el);
        return {
          top: rect.top + (elWindow.pageYOffset || elDocument.documentElement.scrollTop),
          left: rect.left + (elWindow.pageXOffset || elDocument.documentElement.scrollLeft)
        };
      };
      SimpleBarCore2.prototype.init = function() {
        if (canUseDom) {
          this.initDOM();
          this.rtlHelpers = SimpleBarCore2.getRtlHelpers();
          this.scrollbarWidth = this.getScrollbarWidth();
          this.recalculate();
          this.initListeners();
        }
      };
      SimpleBarCore2.prototype.initDOM = function() {
        var _a2, _b2;
        this.wrapperEl = this.el.querySelector(classNamesToQuery(this.classNames.wrapper));
        this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector(classNamesToQuery(this.classNames.contentWrapper));
        this.contentEl = this.options.contentNode || this.el.querySelector(classNamesToQuery(this.classNames.contentEl));
        this.offsetEl = this.el.querySelector(classNamesToQuery(this.classNames.offset));
        this.maskEl = this.el.querySelector(classNamesToQuery(this.classNames.mask));
        this.placeholderEl = this.findChild(this.wrapperEl, classNamesToQuery(this.classNames.placeholder));
        this.heightAutoObserverWrapperEl = this.el.querySelector(classNamesToQuery(this.classNames.heightAutoObserverWrapperEl));
        this.heightAutoObserverEl = this.el.querySelector(classNamesToQuery(this.classNames.heightAutoObserverEl));
        this.axis.x.track.el = this.findChild(this.el, "".concat(classNamesToQuery(this.classNames.track)).concat(classNamesToQuery(this.classNames.horizontal)));
        this.axis.y.track.el = this.findChild(this.el, "".concat(classNamesToQuery(this.classNames.track)).concat(classNamesToQuery(this.classNames.vertical)));
        this.axis.x.scrollbar.el = ((_a2 = this.axis.x.track.el) === null || _a2 === void 0 ? void 0 : _a2.querySelector(classNamesToQuery(this.classNames.scrollbar))) || null;
        this.axis.y.scrollbar.el = ((_b2 = this.axis.y.track.el) === null || _b2 === void 0 ? void 0 : _b2.querySelector(classNamesToQuery(this.classNames.scrollbar))) || null;
        if (!this.options.autoHide) {
          addClasses(this.axis.x.scrollbar.el, this.classNames.visible);
          addClasses(this.axis.y.scrollbar.el, this.classNames.visible);
        }
      };
      SimpleBarCore2.prototype.initListeners = function() {
        var _this = this;
        var _a2;
        var elWindow = getElementWindow(this.el);
        this.el.addEventListener("mouseenter", this.onMouseEnter);
        this.el.addEventListener("pointerdown", this.onPointerEvent, true);
        this.el.addEventListener("mousemove", this.onMouseMove);
        this.el.addEventListener("mouseleave", this.onMouseLeave);
        (_a2 = this.contentWrapperEl) === null || _a2 === void 0 ? void 0 : _a2.addEventListener("scroll", this.onScroll);
        elWindow.addEventListener("resize", this.onWindowResize);
        if (!this.contentEl)
          return;
        if (window.ResizeObserver) {
          var resizeObserverStarted_1 = false;
          var resizeObserver = elWindow.ResizeObserver || ResizeObserver;
          this.resizeObserver = new resizeObserver(function() {
            if (!resizeObserverStarted_1)
              return;
            elWindow.requestAnimationFrame(function() {
              _this.recalculate();
            });
          });
          this.resizeObserver.observe(this.el);
          this.resizeObserver.observe(this.contentEl);
          elWindow.requestAnimationFrame(function() {
            resizeObserverStarted_1 = true;
          });
        }
        this.mutationObserver = new elWindow.MutationObserver(function() {
          elWindow.requestAnimationFrame(function() {
            _this.recalculate();
          });
        });
        this.mutationObserver.observe(this.contentEl, {
          childList: true,
          subtree: true,
          characterData: true
        });
      };
      SimpleBarCore2.prototype.recalculate = function() {
        if (!this.heightAutoObserverEl || !this.contentEl || !this.contentWrapperEl || !this.wrapperEl || !this.placeholderEl)
          return;
        var elWindow = getElementWindow(this.el);
        this.elStyles = elWindow.getComputedStyle(this.el);
        this.isRtl = this.elStyles.direction === "rtl";
        var contentElOffsetWidth = this.contentEl.offsetWidth;
        var isHeightAuto = this.heightAutoObserverEl.offsetHeight <= 1;
        var isWidthAuto = this.heightAutoObserverEl.offsetWidth <= 1 || contentElOffsetWidth > 0;
        var contentWrapperElOffsetWidth = this.contentWrapperEl.offsetWidth;
        var elOverflowX = this.elStyles.overflowX;
        var elOverflowY = this.elStyles.overflowY;
        this.contentEl.style.padding = "".concat(this.elStyles.paddingTop, " ").concat(this.elStyles.paddingRight, " ").concat(this.elStyles.paddingBottom, " ").concat(this.elStyles.paddingLeft);
        this.wrapperEl.style.margin = "-".concat(this.elStyles.paddingTop, " -").concat(this.elStyles.paddingRight, " -").concat(this.elStyles.paddingBottom, " -").concat(this.elStyles.paddingLeft);
        var contentElScrollHeight = this.contentEl.scrollHeight;
        var contentElScrollWidth = this.contentEl.scrollWidth;
        this.contentWrapperEl.style.height = isHeightAuto ? "auto" : "100%";
        this.placeholderEl.style.width = isWidthAuto ? "".concat(contentElOffsetWidth || contentElScrollWidth, "px") : "auto";
        this.placeholderEl.style.height = "".concat(contentElScrollHeight, "px");
        var contentWrapperElOffsetHeight = this.contentWrapperEl.offsetHeight;
        this.axis.x.isOverflowing = contentElOffsetWidth !== 0 && contentElScrollWidth > contentElOffsetWidth;
        this.axis.y.isOverflowing = contentElScrollHeight > contentWrapperElOffsetHeight;
        this.axis.x.isOverflowing = elOverflowX === "hidden" ? false : this.axis.x.isOverflowing;
        this.axis.y.isOverflowing = elOverflowY === "hidden" ? false : this.axis.y.isOverflowing;
        this.axis.x.forceVisible = this.options.forceVisible === "x" || this.options.forceVisible === true;
        this.axis.y.forceVisible = this.options.forceVisible === "y" || this.options.forceVisible === true;
        this.hideNativeScrollbar();
        var offsetForXScrollbar = this.axis.x.isOverflowing ? this.scrollbarWidth : 0;
        var offsetForYScrollbar = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
        this.axis.x.isOverflowing = this.axis.x.isOverflowing && contentElScrollWidth > contentWrapperElOffsetWidth - offsetForYScrollbar;
        this.axis.y.isOverflowing = this.axis.y.isOverflowing && contentElScrollHeight > contentWrapperElOffsetHeight - offsetForXScrollbar;
        this.axis.x.scrollbar.size = this.getScrollbarSize("x");
        this.axis.y.scrollbar.size = this.getScrollbarSize("y");
        if (this.axis.x.scrollbar.el)
          this.axis.x.scrollbar.el.style.width = "".concat(this.axis.x.scrollbar.size, "px");
        if (this.axis.y.scrollbar.el)
          this.axis.y.scrollbar.el.style.height = "".concat(this.axis.y.scrollbar.size, "px");
        this.positionScrollbar("x");
        this.positionScrollbar("y");
        this.toggleTrackVisibility("x");
        this.toggleTrackVisibility("y");
      };
      SimpleBarCore2.prototype.getScrollbarSize = function(axis) {
        var _a2, _b2;
        if (axis === void 0) {
          axis = "y";
        }
        if (!this.axis[axis].isOverflowing || !this.contentEl) {
          return 0;
        }
        var contentSize = this.contentEl[this.axis[axis].scrollSizeAttr];
        var trackSize = (_b2 = (_a2 = this.axis[axis].track.el) === null || _a2 === void 0 ? void 0 : _a2[this.axis[axis].offsetSizeAttr]) !== null && _b2 !== void 0 ? _b2 : 0;
        var scrollbarRatio = trackSize / contentSize;
        var scrollbarSize;
        scrollbarSize = Math.max(~~(scrollbarRatio * trackSize), this.options.scrollbarMinSize);
        if (this.options.scrollbarMaxSize) {
          scrollbarSize = Math.min(scrollbarSize, this.options.scrollbarMaxSize);
        }
        return scrollbarSize;
      };
      SimpleBarCore2.prototype.positionScrollbar = function(axis) {
        var _a2, _b2, _c2;
        if (axis === void 0) {
          axis = "y";
        }
        var scrollbar = this.axis[axis].scrollbar;
        if (!this.axis[axis].isOverflowing || !this.contentWrapperEl || !scrollbar.el || !this.elStyles) {
          return;
        }
        var contentSize = this.contentWrapperEl[this.axis[axis].scrollSizeAttr];
        var trackSize = ((_a2 = this.axis[axis].track.el) === null || _a2 === void 0 ? void 0 : _a2[this.axis[axis].offsetSizeAttr]) || 0;
        var hostSize = parseInt(this.elStyles[this.axis[axis].sizeAttr], 10);
        var scrollOffset = this.contentWrapperEl[this.axis[axis].scrollOffsetAttr];
        scrollOffset = axis === "x" && this.isRtl && ((_b2 = SimpleBarCore2.getRtlHelpers()) === null || _b2 === void 0 ? void 0 : _b2.isScrollOriginAtZero) ? -scrollOffset : scrollOffset;
        if (axis === "x" && this.isRtl) {
          scrollOffset = ((_c2 = SimpleBarCore2.getRtlHelpers()) === null || _c2 === void 0 ? void 0 : _c2.isScrollingToNegative) ? scrollOffset : -scrollOffset;
        }
        var scrollPourcent = scrollOffset / (contentSize - hostSize);
        var handleOffset = ~~((trackSize - scrollbar.size) * scrollPourcent);
        handleOffset = axis === "x" && this.isRtl ? -handleOffset + (trackSize - scrollbar.size) : handleOffset;
        scrollbar.el.style.transform = axis === "x" ? "translate3d(".concat(handleOffset, "px, 0, 0)") : "translate3d(0, ".concat(handleOffset, "px, 0)");
      };
      SimpleBarCore2.prototype.toggleTrackVisibility = function(axis) {
        if (axis === void 0) {
          axis = "y";
        }
        var track = this.axis[axis].track.el;
        var scrollbar = this.axis[axis].scrollbar.el;
        if (!track || !scrollbar || !this.contentWrapperEl)
          return;
        if (this.axis[axis].isOverflowing || this.axis[axis].forceVisible) {
          track.style.visibility = "visible";
          this.contentWrapperEl.style[this.axis[axis].overflowAttr] = "scroll";
          this.el.classList.add("".concat(this.classNames.scrollable, "-").concat(axis));
        } else {
          track.style.visibility = "hidden";
          this.contentWrapperEl.style[this.axis[axis].overflowAttr] = "hidden";
          this.el.classList.remove("".concat(this.classNames.scrollable, "-").concat(axis));
        }
        if (this.axis[axis].isOverflowing) {
          scrollbar.style.display = "block";
        } else {
          scrollbar.style.display = "none";
        }
      };
      SimpleBarCore2.prototype.showScrollbar = function(axis) {
        if (axis === void 0) {
          axis = "y";
        }
        if (this.axis[axis].isOverflowing && !this.axis[axis].scrollbar.isVisible) {
          addClasses(this.axis[axis].scrollbar.el, this.classNames.visible);
          this.axis[axis].scrollbar.isVisible = true;
        }
      };
      SimpleBarCore2.prototype.hideScrollbar = function(axis) {
        if (axis === void 0) {
          axis = "y";
        }
        if (this.axis[axis].isOverflowing && this.axis[axis].scrollbar.isVisible) {
          removeClasses(this.axis[axis].scrollbar.el, this.classNames.visible);
          this.axis[axis].scrollbar.isVisible = false;
        }
      };
      SimpleBarCore2.prototype.hideNativeScrollbar = function() {
        if (!this.offsetEl)
          return;
        this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px";
        this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px";
      };
      SimpleBarCore2.prototype.onMouseMoveForAxis = function(axis) {
        if (axis === void 0) {
          axis = "y";
        }
        var currentAxis = this.axis[axis];
        if (!currentAxis.track.el || !currentAxis.scrollbar.el)
          return;
        currentAxis.track.rect = currentAxis.track.el.getBoundingClientRect();
        currentAxis.scrollbar.rect = currentAxis.scrollbar.el.getBoundingClientRect();
        if (this.isWithinBounds(currentAxis.track.rect)) {
          this.showScrollbar(axis);
          addClasses(currentAxis.track.el, this.classNames.hover);
          if (this.isWithinBounds(currentAxis.scrollbar.rect)) {
            addClasses(currentAxis.scrollbar.el, this.classNames.hover);
          } else {
            removeClasses(currentAxis.scrollbar.el, this.classNames.hover);
          }
        } else {
          removeClasses(currentAxis.track.el, this.classNames.hover);
          if (this.options.autoHide) {
            this.hideScrollbar(axis);
          }
        }
      };
      SimpleBarCore2.prototype.onMouseLeaveForAxis = function(axis) {
        if (axis === void 0) {
          axis = "y";
        }
        removeClasses(this.axis[axis].track.el, this.classNames.hover);
        removeClasses(this.axis[axis].scrollbar.el, this.classNames.hover);
        if (this.options.autoHide) {
          this.hideScrollbar(axis);
        }
      };
      SimpleBarCore2.prototype.onDragStart = function(e2, axis) {
        var _a2;
        if (axis === void 0) {
          axis = "y";
        }
        var elDocument = getElementDocument(this.el);
        var elWindow = getElementWindow(this.el);
        var scrollbar = this.axis[axis].scrollbar;
        var eventOffset = axis === "y" ? e2.pageY : e2.pageX;
        this.axis[axis].dragOffset = eventOffset - (((_a2 = scrollbar.rect) === null || _a2 === void 0 ? void 0 : _a2[this.axis[axis].offsetAttr]) || 0);
        this.draggedAxis = axis;
        addClasses(this.el, this.classNames.dragging);
        elDocument.addEventListener("mousemove", this.drag, true);
        elDocument.addEventListener("mouseup", this.onEndDrag, true);
        if (this.removePreventClickId === null) {
          elDocument.addEventListener("click", this.preventClick, true);
          elDocument.addEventListener("dblclick", this.preventClick, true);
        } else {
          elWindow.clearTimeout(this.removePreventClickId);
          this.removePreventClickId = null;
        }
      };
      SimpleBarCore2.prototype.onTrackClick = function(e2, axis) {
        var _this = this;
        var _a2, _b2, _c2, _d2;
        if (axis === void 0) {
          axis = "y";
        }
        var currentAxis = this.axis[axis];
        if (!this.options.clickOnTrack || !currentAxis.scrollbar.el || !this.contentWrapperEl)
          return;
        e2.preventDefault();
        var elWindow = getElementWindow(this.el);
        this.axis[axis].scrollbar.rect = currentAxis.scrollbar.el.getBoundingClientRect();
        var scrollbar = this.axis[axis].scrollbar;
        var scrollbarOffset = (_b2 = (_a2 = scrollbar.rect) === null || _a2 === void 0 ? void 0 : _a2[this.axis[axis].offsetAttr]) !== null && _b2 !== void 0 ? _b2 : 0;
        var hostSize = parseInt((_d2 = (_c2 = this.elStyles) === null || _c2 === void 0 ? void 0 : _c2[this.axis[axis].sizeAttr]) !== null && _d2 !== void 0 ? _d2 : "0px", 10);
        var scrolled = this.contentWrapperEl[this.axis[axis].scrollOffsetAttr];
        var t2 = axis === "y" ? this.mouseY - scrollbarOffset : this.mouseX - scrollbarOffset;
        var dir = t2 < 0 ? -1 : 1;
        var scrollSize = dir === -1 ? scrolled - hostSize : scrolled + hostSize;
        var speed = 40;
        var scrollTo = function() {
          if (!_this.contentWrapperEl)
            return;
          if (dir === -1) {
            if (scrolled > scrollSize) {
              scrolled -= speed;
              _this.contentWrapperEl[_this.axis[axis].scrollOffsetAttr] = scrolled;
              elWindow.requestAnimationFrame(scrollTo);
            }
          } else {
            if (scrolled < scrollSize) {
              scrolled += speed;
              _this.contentWrapperEl[_this.axis[axis].scrollOffsetAttr] = scrolled;
              elWindow.requestAnimationFrame(scrollTo);
            }
          }
        };
        scrollTo();
      };
      SimpleBarCore2.prototype.getContentElement = function() {
        return this.contentEl;
      };
      SimpleBarCore2.prototype.getScrollElement = function() {
        return this.contentWrapperEl;
      };
      SimpleBarCore2.prototype.removeListeners = function() {
        var elWindow = getElementWindow(this.el);
        this.el.removeEventListener("mouseenter", this.onMouseEnter);
        this.el.removeEventListener("pointerdown", this.onPointerEvent, true);
        this.el.removeEventListener("mousemove", this.onMouseMove);
        this.el.removeEventListener("mouseleave", this.onMouseLeave);
        if (this.contentWrapperEl) {
          this.contentWrapperEl.removeEventListener("scroll", this.onScroll);
        }
        elWindow.removeEventListener("resize", this.onWindowResize);
        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
        }
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }
        this.onMouseMove.cancel();
        this.onWindowResize.cancel();
        this.onStopScrolling.cancel();
        this.onMouseEntered.cancel();
      };
      SimpleBarCore2.prototype.unMount = function() {
        this.removeListeners();
      };
      SimpleBarCore2.prototype.isWithinBounds = function(bbox) {
        return this.mouseX >= bbox.left && this.mouseX <= bbox.left + bbox.width && this.mouseY >= bbox.top && this.mouseY <= bbox.top + bbox.height;
      };
      SimpleBarCore2.prototype.findChild = function(el, query) {
        var matches2 = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        return Array.prototype.filter.call(el.children, function(child) {
          return matches2.call(child, query);
        })[0];
      };
      SimpleBarCore2.rtlHelpers = null;
      SimpleBarCore2.defaultOptions = {
        forceVisible: false,
        clickOnTrack: true,
        scrollbarMinSize: 25,
        scrollbarMaxSize: 0,
        ariaLabel: "scrollable content",
        classNames: {
          contentEl: "simplebar-content",
          contentWrapper: "simplebar-content-wrapper",
          offset: "simplebar-offset",
          mask: "simplebar-mask",
          wrapper: "simplebar-wrapper",
          placeholder: "simplebar-placeholder",
          scrollbar: "simplebar-scrollbar",
          track: "simplebar-track",
          heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
          heightAutoObserverEl: "simplebar-height-auto-observer",
          visible: "simplebar-visible",
          horizontal: "simplebar-horizontal",
          vertical: "simplebar-vertical",
          hover: "simplebar-hover",
          dragging: "simplebar-dragging",
          scrolling: "simplebar-scrolling",
          scrollable: "simplebar-scrollable",
          mouseEntered: "simplebar-mouse-entered"
        },
        scrollableNode: null,
        contentNode: null,
        autoHide: true
      };
      SimpleBarCore2.getOptions = getOptions;
      SimpleBarCore2.helpers = helpers;
      return SimpleBarCore2;
    }()
  );
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s2, e2) {
    var t2 = {};
    for (var p2 in s2)
      if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
        t2[p2] = s2[p2];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
        if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
          t2[p2[i2]] = s2[p2[i2]];
      }
    return t2;
  }
  var SimpleBar = React__namespace.forwardRef(function(_a2, ref) {
    var children = _a2.children, _b2 = _a2.scrollableNodeProps, scrollableNodeProps = _b2 === void 0 ? {} : _b2, otherProps = __rest(_a2, ["children", "scrollableNodeProps"]);
    var elRef = React__namespace.useRef();
    var scrollableNodeRef = React__namespace.useRef();
    var contentNodeRef = React__namespace.useRef();
    var options = {};
    var rest = {};
    Object.keys(otherProps).forEach(function(key) {
      if (Object.prototype.hasOwnProperty.call(SimpleBarCore.defaultOptions, key)) {
        options[key] = otherProps[key];
      } else {
        rest[key] = otherProps[key];
      }
    });
    var classNames = __assign(__assign({}, SimpleBarCore.defaultOptions.classNames), options.classNames);
    var scrollableNodeFullProps = __assign(__assign({}, scrollableNodeProps), { className: "".concat(classNames.contentWrapper).concat(scrollableNodeProps.className ? " ".concat(scrollableNodeProps.className) : ""), tabIndex: 0, role: "region", "aria-label": options.ariaLabel || SimpleBarCore.defaultOptions.ariaLabel });
    React__namespace.useEffect(function() {
      var instance;
      scrollableNodeRef.current = scrollableNodeFullProps.ref ? scrollableNodeFullProps.ref.current : scrollableNodeRef.current;
      if (elRef.current) {
        instance = new SimpleBarCore(elRef.current, __assign(__assign(__assign({}, options), scrollableNodeRef.current && {
          scrollableNode: scrollableNodeRef.current
        }), contentNodeRef.current && {
          contentNode: contentNodeRef.current
        }));
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      }
      return function() {
        instance === null || instance === void 0 ? void 0 : instance.unMount();
        instance = null;
        if (typeof ref === "function") {
          ref(null);
        }
      };
    }, []);
    return React__namespace.createElement(
      "div",
      __assign({ "data-simplebar": "init", ref: elRef }, rest),
      React__namespace.createElement(
        "div",
        { className: classNames.wrapper },
        React__namespace.createElement(
          "div",
          { className: classNames.heightAutoObserverWrapperEl },
          React__namespace.createElement("div", { className: classNames.heightAutoObserverEl })
        ),
        React__namespace.createElement(
          "div",
          { className: classNames.mask },
          React__namespace.createElement("div", { className: classNames.offset }, typeof children === "function" ? children({
            scrollableNodeRef,
            scrollableNodeProps: __assign(__assign({}, scrollableNodeFullProps), { ref: scrollableNodeRef }),
            contentNodeRef,
            contentNodeProps: {
              className: classNames.contentEl,
              ref: contentNodeRef
            }
          }) : React__namespace.createElement(
            "div",
            __assign({}, scrollableNodeFullProps),
            React__namespace.createElement("div", { className: classNames.contentEl }, children)
          ))
        ),
        React__namespace.createElement("div", { className: classNames.placeholder })
      ),
      React__namespace.createElement(
        "div",
        { className: "".concat(classNames.track, " simplebar-horizontal") },
        React__namespace.createElement("div", { className: classNames.scrollbar })
      ),
      React__namespace.createElement(
        "div",
        { className: "".concat(classNames.track, " simplebar-vertical") },
        React__namespace.createElement("div", { className: classNames.scrollbar })
      )
    );
  });
  SimpleBar.displayName = "SimpleBar";
  const Info = IconWrapper("info", true, function(props) {
    return /* @__PURE__ */ React$1.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React$1.createElement("path", {
      d: "M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React$1.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z",
      fill: props.colors[2]
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M24.5 34V20H23.5H22.5",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M21 34H28",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const SettingTwo = IconWrapper("setting-two", false, function(props) {
    return /* @__PURE__ */ React$1.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React$1.createElement("path", {
      d: "M18.2838 43.1713C14.9327 42.1736 11.9498 40.3213 9.58787 37.867C10.469 36.8227 11 35.4734 11 34.0001C11 30.6864 8.31371 28.0001 5 28.0001C4.79955 28.0001 4.60139 28.01 4.40599 28.0292C4.13979 26.7277 4 25.3803 4 24.0001C4 21.9095 4.32077 19.8938 4.91579 17.9995C4.94381 17.9999 4.97188 18.0001 5 18.0001C8.31371 18.0001 11 15.3138 11 12.0001C11 11.0488 10.7786 10.1493 10.3846 9.35011C12.6975 7.1995 15.5205 5.59002 18.6521 4.72314C19.6444 6.66819 21.6667 8.00013 24 8.00013C26.3333 8.00013 28.3556 6.66819 29.3479 4.72314C32.4795 5.59002 35.3025 7.1995 37.6154 9.35011C37.2214 10.1493 37 11.0488 37 12.0001C37 15.3138 39.6863 18.0001 43 18.0001C43.0281 18.0001 43.0562 17.9999 43.0842 17.9995C43.6792 19.8938 44 21.9095 44 24.0001C44 25.3803 43.8602 26.7277 43.594 28.0292C43.3986 28.01 43.2005 28.0001 43 28.0001C39.6863 28.0001 37 30.6864 37 34.0001C37 35.4734 37.531 36.8227 38.4121 37.867C36.0502 40.3213 33.0673 42.1736 29.7162 43.1713C28.9428 40.752 26.676 39.0001 24 39.0001C21.324 39.0001 19.0572 40.752 18.2838 43.1713Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M24 31C27.866 31 31 27.866 31 24C31 20.134 27.866 17 24 17C20.134 17 17 20.134 17 24C17 27.866 20.134 31 24 31Z",
      fill: props.colors[3],
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const GithubOne = IconWrapper("github-one", true, function(props) {
    return /* @__PURE__ */ React$1.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React$1.createElement("path", {
      d: "M29.3444 30.4765C31.7481 29.977 33.9292 29.1108 35.6247 27.8391C38.5202 25.6676 40 22.3136 40 18.9999C40 16.6752 39.1187 14.505 37.5929 12.6668C36.7427 11.6425 39.2295 3.99989 37.02 5.02919C34.8105 6.05848 31.5708 8.33679 29.8726 7.83398C28.0545 7.29565 26.0733 6.99989 24 6.99989C22.1992 6.99989 20.4679 7.22301 18.8526 7.6344C16.5046 8.23237 14.2591 5.99989 12 5.02919C9.74086 4.05848 10.9736 11.9632 10.3026 12.7944C8.84119 14.6051 8 16.7288 8 18.9999C8 22.3136 9.79086 25.6676 12.6863 27.8391C14.6151 29.2857 17.034 30.2076 19.7401 30.6619",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M19.7397 30.6619C18.5812 31.937 18.002 33.1478 18.002 34.2944C18.002 35.441 18.002 38.3464 18.002 43.0106",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M29.3446 30.4766C30.4423 31.9174 30.9912 33.211 30.9912 34.3576C30.9912 35.5042 30.9912 38.3885 30.9912 43.0107",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap
    }), /* @__PURE__ */ React$1.createElement("path", {
      d: "M6 31.2155C6.89887 31.3254 7.56554 31.7387 8 32.4554C8.65169 33.5303 11.0742 37.518 13.8251 37.518C15.6591 37.518 17.0515 37.518 18.0024 37.518",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap
    }));
  });
  const ButtonContainer = newStyled.span(
    {
      display: "inline-block",
      padding: "0px 4px",
      userSelect: "none",
      boxShadow: "0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
      borderRadius: 4,
      marginLeft: 4,
      border: "1px solid transparent",
      lineHeight: "24px",
      fontFamily: "华文新魏"
    },
    ({ theme: theme2, disabled }) => ({
      "&:hover": {
        backgroundColor: disabled ? "white" : theme2.colors.active,
        // 统一UI风格
        color: disabled ? "grey" : "white"
      },
      backgroundColor: "white",
      color: disabled ? "grey" : "black"
    })
  );
  function Button({
    onClick,
    children,
    disabled,
    style,
    onMouseEnter,
    onMouseLeave
  }) {
    const [isButtonDisabled, setIsButtonDisabled] = React$1.useState(
      typeof disabled === "number" ? false : !!disabled
    );
    return /* @__PURE__ */ jsx(
      ButtonContainer,
      {
        style: {
          cursor: isButtonDisabled ? "not-allowed" : "pointer",
          ...style
        },
        disabled: isButtonDisabled,
        onClick: () => {
          onClick && onClick();
          if (typeof disabled === "number") {
            setIsButtonDisabled(true);
            setTimeout(() => {
              setIsButtonDisabled(false);
            }, disabled);
          }
        },
        onMouseEnter,
        onMouseLeave,
        children
      }
    );
  }
  const InlineTag = newStyled(it.span)({
    marginRight: 4,
    // border: "1px dashed black",
    borderRadius: 4,
    padding: "2px 4px",
    // lineHeight: "24px",
    // lineHeight: "1.5em",
    height: "24px",
    position: "relative",
    userSelect: "none"
  });
  function useSlideIn() {
    const spring = J({
      from: { opacity: 1, left: "-100%" },
      to: { opacity: 1, left: "0%" },
      config: {
        ...mt.gentle
      }
    });
    return spring;
  }
  const InfoRecordContainer = newStyled(it.span)(
    {
      lineHeight: "24px",
      position: "relative"
    },
    ({ theme: theme2 }) => ({
      a: {
        color: theme2.colors.active,
        fontStyle: "italic",
        backgroundColor: theme2.colors.activeSecondary,
        borderRadius: 4,
        padding: "0px 4px"
      },
      "a:hover": {
        // borderBottom: `${theme.colors.active} 2px solid`,
        pointer: "cursor"
        // transform: "scale(1.1)",
        // transition: "transform 500ms",
      }
    })
  );
  function InfoRecord({ record }) {
    const spring = useSlideIn();
    const theme2 = useTheme();
    const [isHover, setHover] = React$1.useState(false);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          position: "relative",
          lineHeight: "normal"
        },
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        children: [
          /* @__PURE__ */ jsx(
            InlineTag,
            {
              style: {
                backgroundColor: theme2.colors.active,
                color: "white",
                ...spring
              },
              children: "提示"
            }
          ),
          /* @__PURE__ */ jsx(
            InfoRecordContainer,
            {
              style: {
                ...spring
              },
              dangerouslySetInnerHTML: {
                __html: `${record.content}`
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                bottom: 0,
                right: 0,
                display: isHover ? "flex" : "none"
              },
              children: record.action && record.action.map(({ children, ...restProps }, index2) => /* @__PURE__ */ jsx(Button, { ...restProps, children }, index2))
            }
          )
        ]
      }
    );
  }
  const ScaleIt = newStyled.div({
    "&:hover": {
      transform: "scale(1.2)",
      transition: "transform 500ms",
      cursor: "pointer"
    }
  });
  const About = React$1.memo(function() {
    const theme2 = useTheme();
    const [versionInfo, setVersionInfo] = React$1.useState([]);
    React$1.useEffect(() => {
      getValue("VERSION_INFO", []).then((messages) => {
        setVersionInfo(messages);
        logger.debug("成功设置about页面的版本信息");
      });
    }, []);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          // border: "2px solid black",
          width: 380,
          color: "black",
          // height: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        },
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                margin: "8px 0px"
              },
              children: [
                /* @__PURE__ */ jsx(ScaleIt, { children: /* @__PURE__ */ jsx(GithubOne, { theme: "filled", size: "24", fill: theme2.colors.active }) }),
                /* @__PURE__ */ jsx(Button, { disabled: true, children: "使用引导" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            "版本 ",
            /* @__PURE__ */ jsx("span", { style: { marginLeft: 24 }, children: metadata.projects.welearn.version })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                margin: "8px 0px"
              },
              children: [
                "Made with ❤️ by",
                /* @__PURE__ */ jsx(
                  ScaleIt,
                  {
                    style: {
                      display: "inline-block",
                      color: theme2.colors.active,
                      fontSize: 20,
                      marginLeft: 8
                    },
                    onClick: () => {
                      window.open("https://github.com/SSmJaE", "_blank");
                    },
                    children: "SSmJaE"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "100%",
                borderTop: "2px solid black",
                marginTop: 8
              },
              children: versionInfo.length !== 0 && versionInfo.map((message) => /* @__PURE__ */ jsx(
                InfoRecordContainer,
                {
                  style: {
                    display: "block",
                    marginBottom: 4
                  },
                  dangerouslySetInnerHTML: {
                    __html: `${message}`
                  }
                }
              ))
            }
          )
        ]
      }
    );
  });
  function ErrorRecord({ record }) {
    const spring = useSlideIn();
    const theme2 = useTheme();
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          position: "relative",
          lineHeight: "24px"
        },
        children: [
          /* @__PURE__ */ jsx(
            InlineTag,
            {
              style: {
                backgroundColor: theme2.colors.error,
                color: "white",
                ...spring
              },
              children: "异常"
            }
          ),
          /* @__PURE__ */ jsx(
            it.span,
            {
              style: {
                lineHeight: "24px",
                position: "relative",
                ...spring
              },
              children: record.content.message
            }
          )
        ]
      }
    );
  }
  const TypingAnimationContainer = newStyled.span`
    line-height: normal;
    /* font-family: monospace; */
    /* 有中文的话，尤其是中英文混杂的情况，用不用monospace都一样了 */

    background: linear-gradient(#000000 0 0) 0 0
        ${(props) => props.showCursor ? ", linear-gradient(-90deg, #000000 10px, #0000 0) 10px 0" : void 0};
    background-clip: text ${(props) => props.showCursor ? ", padding-box" : void 0};
    color: transparent;

    background-size: calc(${(props) => props.count} * 2ch) 200%;
    background-repeat: no-repeat;

    @keyframes typing {
        from {
            background-size: 0 200%;
        }
    }

    @keyframes cursor {
        50% {
            background-position: 0 -100%;
        }
    }

    animation: typing ${(props) => props.duration * 2}ms linear 1 alternate;
    animation-timing-function: steps(${(props) => props.count * 2});
`;
  function TypingAnimation({
    content,
    startDelay = 600,
    interval = 25
  }) {
    const [shouldDisplay, setShouldDisplay] = React$1.useState(false);
    const [showCursor, setShowCursor] = React$1.useState(false);
    const duration = content.length * interval;
    useMount$1(() => {
      setTimeout(() => {
        setShouldDisplay(true);
        setShowCursor(true);
        setTimeout(() => {
          setShowCursor(false);
        }, duration + 250);
      }, startDelay);
    });
    return shouldDisplay ? /* @__PURE__ */ jsx(
      TypingAnimationContainer,
      {
        count: content.length,
        duration,
        showCursor,
        children: content
      }
    ) : /* @__PURE__ */ jsx(Fragment, {});
  }
  function SolveButton({ content: { solve, answerText } }) {
    const [isHovering, setIsHovering] = React$1.useState(false);
    const buttonText = "无法解答";
    return /* @__PURE__ */ jsx(
      Button,
      {
        disabled: true,
        onClick: () => {
          solve.solveThis(answerText);
        },
        onMouseEnter: () => {
          setIsHovering(true);
        },
        onMouseLeave: () => {
          setIsHovering(false);
        },
        children: buttonText
      }
    );
  }
  function CopyButton({ answerText }) {
    const [buttonText, setButtonText] = React$1.useState("复制答案");
    return /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => {
          navigator.clipboard.writeText(answerText);
          const copyFrom = document.createElement("textarea");
          copyFrom.textContent = answerText;
          document.body.appendChild(copyFrom);
          copyFrom.select();
          document.execCommand("copy");
          copyFrom.blur();
          document.body.removeChild(copyFrom);
          setButtonText("已复制👌");
          setTimeout(() => {
            setButtonText("复制答案");
          }, 1e3);
        },
        children: buttonText
      }
    );
  }
  function QuestionRecord({ record }) {
    const [isHover, setHover] = React$1.useState(false);
    const theme2 = useTheme();
    const spring = useSlideIn();
    return /* @__PURE__ */ jsxs(
      it.div,
      {
        onMouseEnter: () => {
          setHover(true);
        },
        onMouseLeave: () => {
          setHover(false);
        },
        style: {
          position: "relative",
          lineHeight: "24px"
          // ...(store.userSettings.enableTyping ? spring : {}),
        },
        children: [
          /* @__PURE__ */ jsx(
            InlineTag,
            {
              style: {
                ...spring,
                backgroundColor: theme2.colors.active,
                color: "white",
                fontFamily: "monospace"
              },
              children: record.content.order
            }
          ),
          /* @__PURE__ */ jsx(
            InlineTag,
            {
              style: {
                ...spring,
                // backgroundColor: "limegreen", // "red" "yellow"
                backgroundColor: record.content.info.color ? record.content.info.color : theme2.answerTypeColorMapping[record.content.info.content] ?? "gray",
                color: "white",
                fontFamily: "华文新魏"
              },
              children: record.content.info.content
            }
          ),
          store.userSettings.enableTyping ? /* @__PURE__ */ jsx(
            TypingAnimation,
            {
              content: record.content.answerText,
              startDelay: 600,
              interval: 35
            }
          ) : /* @__PURE__ */ jsx(
            it.span,
            {
              style: {
                ...spring,
                position: "relative"
              },
              children: record.content.answerText
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                position: "absolute",
                bottom: 0,
                right: 0,
                display: isHover ? "flex" : "none"
                // zIndex: ,
              },
              children: [
                record.action && record.action.map(({ children, ...restProps }, index2) => /* @__PURE__ */ jsx(Button, { ...restProps, children }, index2)),
                /* @__PURE__ */ jsx(SolveButton, { content: record.content }),
                /* @__PURE__ */ jsx(CopyButton, { answerText: record.content.answerText })
              ]
            }
          )
        ]
      }
    );
  }
  function getAppTitle() {
    var _a2;
    {
      return (_a2 = metadata.projects["welearn"]) == null ? void 0 : _a2.title;
    }
  }
  function dispatchRecord(record) {
    let recordDisplay;
    switch (record.type) {
      case "info":
        recordDisplay = /* @__PURE__ */ jsx(InfoRecord, { record });
        break;
      case "question":
        recordDisplay = /* @__PURE__ */ jsx(QuestionRecord, { record });
        break;
      case "error":
        recordDisplay = /* @__PURE__ */ jsx(ErrorRecord, { record });
        break;
      default:
        recordDisplay = /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              lineHeight: "24px"
            },
            children: JSON.stringify(record)
          }
        );
        break;
    }
    return recordDisplay;
  }
  const RecordContainer = newStyled.div(
    {
      border: "black 1px solid",
      borderRadius: 4,
      fontSize: 16,
      padding: 4
    },
    ({ theme: theme2 }) => ({
      "&:hover": {
        background: theme2.colors.secondary
      }
    })
  );
  function LogPanel() {
    const {
      visibility,
      logs
      // position: { floating, log },
    } = useStore();
    const appTitle = React$1.useMemo(() => getAppTitle(), []);
    const [isDragging, setIsDragging] = React$1.useState(false);
    const theme2 = useTheme();
    const [spring, api] = J(
      () => ({
        opacity: visibility.log ? 1 : 0,
        scale: visibility.log ? 1 : 0,
        // translate: visibility.log ? 0 : `${floating.y - log.y}px`,
        // transform: visibility.log ? "translateX(200px)" : `translateX(${floating.x - log.x}px)`,
        // x: visibility.log ? 100 : floating.x,
        // y: visibility.log ? 100 : floating.y,
        config: {
          ...mt.wobbly
        },
        onRest: () => {
          if (!visibility.log) {
            setDisplay(false);
          }
        }
      }),
      [visibility.log]
    );
    const [display, setDisplay] = React$1.useState(false);
    React$1.useEffect(() => {
      if (visibility.log) {
        setDisplay(true);
      }
    }, [visibility.log]);
    return /* @__PURE__ */ jsx(
      Rnd,
      {
        default: {
          x: 100,
          y: 100,
          width: 600,
          height: 100
        },
        minWidth: 350,
        maxWidth: 600,
        minHeight: 100,
        maxHeight: 600,
        bounds: "window",
        cancel: "#log-panel-menu-buttons",
        dragHandleClassName: "log-panel-menu-bar",
        onDragStart: () => {
          setIsDragging(true);
        },
        onDragStop: () => {
          setIsDragging(false);
        },
        resizeGrid: [20, 20],
        enableResizing: {
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        },
        children: /* @__PURE__ */ jsxs(
          it.div,
          {
            style: {
              zIndex: 99,
              width: "100%",
              maxHeight: 600,
              background: "rgba(255, 255, 255, 0.95)",
              border: "black 2px solid",
              borderRadius: 10,
              boxShadow: "0 11px 15px -7px rgba(0, 0, 0, 0.2),0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)",
              display: display ? "flex" : "none",
              flexDirection: "column",
              lineHeight: "24px !important",
              ...spring
            },
            children: [
              /* @__PURE__ */ jsxs(
                MenuBar,
                {
                  id: "log-panel-menu-bar",
                  className: "log-panel-menu-bar",
                  isDragging,
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          fontSize: 24
                        },
                        children: appTitle
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        id: "log-panel-menu-buttons",
                        style: {
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            PopOver,
                            {
                              content: /* @__PURE__ */ jsx(About, {}),
                              openDelay: true,
                              delay: true,
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              placement: "right",
                              border: true,
                              children: /* @__PURE__ */ jsx(MenuButton, { children: /* @__PURE__ */ jsx(
                                Info,
                                {
                                  theme: "filled",
                                  size: "28",
                                  fill: theme2.colors.active,
                                  strokeWidth: 5
                                }
                              ) })
                            },
                            "about"
                          ),
                          /* @__PURE__ */ jsx(
                            PopOver,
                            {
                              content: `${visibility.config ? "关闭" : "打开"}设置面板`,
                              children: /* @__PURE__ */ jsx(
                                MenuButton,
                                {
                                  onClick: () => {
                                    store.setVisibility("config", !visibility.config);
                                  },
                                  style: {
                                    lineHeight: "normal",
                                    marginLeft: 4
                                  },
                                  children: /* @__PURE__ */ jsx(
                                    SettingTwo,
                                    {
                                      theme: "multi-color",
                                      size: "28",
                                      fill: ["#333", "#E6E6E6", "#000000", "#ffffff"],
                                      strokeWidth: 3
                                    }
                                  )
                                }
                              )
                            },
                            "config"
                          ),
                          /* @__PURE__ */ jsx(PopOver, { content: "最小化当前窗口", children: /* @__PURE__ */ jsx(
                            MenuButton,
                            {
                              onClick: () => {
                                store.setVisibility("log", false);
                                store.setVisibility("floating", true);
                              },
                              style: {
                                lineHeight: "normal",
                                marginLeft: 4
                              },
                              children: /* @__PURE__ */ jsx(
                                Close,
                                {
                                  theme: "filled",
                                  size: "28",
                                  fill: theme2.colors.error,
                                  strokeWidth: 7
                                }
                              )
                            }
                          ) }, "minimize")
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                SimpleBar,
                {
                  id: "log-panel-log-container",
                  style: {
                    borderTop: "black 2px solid",
                    padding: "4px 8px",
                    flexGrow: 1,
                    maxHeight: 500
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      Global,
                      {
                        styles: {
                          ".simplebar-track.simplebar-vertical": {
                            width: "9px !important"
                          }
                        }
                      }
                    ),
                    logs.map((record, index2) => {
                      return (
                        // hasExtra => !disabled，避免页面上的PopOver过多，略微优化一下性能
                        /* @__PURE__ */ jsx(
                          PopOver,
                          {
                            content: record.extra,
                            placement: "right",
                            disabled: record.extra === void 0,
                            delay: record.type === "error",
                            children: /* @__PURE__ */ jsx(
                              RecordContainer,
                              {
                                style: {
                                  marginTop: index2 === 0 ? 0 : 4,
                                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                                  textAlign: "start",
                                  // font-family: 华文新魏 !important;
                                  lineHeight: "normal !important"
                                  // 某些页面，会修改lineHeight，所以手动重置回来
                                },
                                children: dispatchRecord(record)
                              },
                              record.timestamp
                            )
                          },
                          record.timestamp
                        )
                      );
                    })
                  ]
                }
              )
            ]
          }
        )
      }
    );
  }
  const theme = {
    colors: {
      primary: "rgb(255, 255, 255)",
      // 60%
      secondary: "rgb(230, 230, 230)",
      // 30%
      active: "#2196f3",
      // 10%
      activeSecondary: "rgb(231, 243, 255)",
      error: "rgb(231, 71, 93)"
    },
    answerTypeColorMapping: {
      GPT: "orange",
      标答: "limegreen",
      无答案: "rgb(231, 71, 93)"
    }
  };
  function App() {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        Global,
        {
          styles: css`
                    #eocs-helper {
                        all: initial;
                        font-family: 华文新魏 !important;
                        line-height: normal !important;
                        /* 页面可能很长，所以这里使用 fixed 定位 */
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 99;
                    }
                `
        }
      ),
      /* @__PURE__ */ jsx(ThemeProvider, { theme, children: /* @__PURE__ */ jsxs(ErrorBoundary, { children: [
        /* @__PURE__ */ jsx(LogPanel, {}),
        /* @__PURE__ */ jsx(ConfigPanel, {}),
        /* @__PURE__ */ jsx(FloatingBall, {})
      ] }) })
    ] });
  }
  const EXTENSION_ID = "eocs-helper";
  const availableUrls = [
    ".sflep.com/student/course_info.aspx?",
    //基准页面
    "centercourseware.sflep.com",
    //练习答题页面，子页面
    ".sflep.com/test/",
    //考试答题页面
    "wetest.sflep.com/Test"
    // 新url，内容未变
  ];
  function initialize() {
    let isAvailable = false;
    for (const url of availableUrls) {
      if (location.href.includes(url)) {
        isAvailable = true;
        break;
      }
    }
    if (!isAvailable) {
      logger.debug("not in eocs page");
      return;
    }
    if (document.querySelector(`#${EXTENSION_ID}`)) {
      logger.debug("already initialized");
      return;
    }
    createRoot(
      (() => {
        const app = document.createElement("div");
        app.id = EXTENSION_ID;
        document.body.append(app);
        return app;
      })()
    ).render(
      /* @__PURE__ */ jsx(React$1.StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
    );
  }
  (async function() {
    await initialUserSettings();
    initialize();
  })();
  var monkeyWindow = window;
  var GM = /* @__PURE__ */ (() => monkeyWindow.GM)();
  var unsafeWindow$1 = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_info = /* @__PURE__ */ (() => monkeyWindow.GM_info)();
  var GM_cookie = /* @__PURE__ */ (() => monkeyWindow.GM_cookie)();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_deleteValue = /* @__PURE__ */ (() => monkeyWindow.GM_deleteValue)();
  var GM_listValues = /* @__PURE__ */ (() => monkeyWindow.GM_listValues)();
  var GM_addValueChangeListener = /* @__PURE__ */ (() => monkeyWindow.GM_addValueChangeListener)();
  var GM_removeValueChangeListener = /* @__PURE__ */ (() => monkeyWindow.GM_removeValueChangeListener)();
  var GM_getResourceText = /* @__PURE__ */ (() => monkeyWindow.GM_getResourceText)();
  var GM_getResourceURL = /* @__PURE__ */ (() => monkeyWindow.GM_getResourceURL)();
  var GM_addElement = /* @__PURE__ */ (() => monkeyWindow.GM_addElement)();
  var GM_addStyle = /* @__PURE__ */ (() => monkeyWindow.GM_addStyle)();
  var GM_openInTab = /* @__PURE__ */ (() => monkeyWindow.GM_openInTab)();
  var GM_registerMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_registerMenuCommand)();
  var GM_unregisterMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_unregisterMenuCommand)();
  var GM_notification = /* @__PURE__ */ (() => monkeyWindow.GM_notification)();
  var GM_xmlhttpRequest = /* @__PURE__ */ (() => monkeyWindow.GM_xmlhttpRequest)();
  var GM_setClipboard = /* @__PURE__ */ (() => monkeyWindow.GM_setClipboard)();
  var GM_download = /* @__PURE__ */ (() => monkeyWindow.GM_download)();
  var GM_log = /* @__PURE__ */ (() => monkeyWindow.GM_log)();
  var GM_getTab = /* @__PURE__ */ (() => monkeyWindow.GM_getTab)();
  var GM_saveTab = /* @__PURE__ */ (() => monkeyWindow.GM_saveTab)();
  var GM_getTabs = /* @__PURE__ */ (() => monkeyWindow.GM_getTabs)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    GM,
    GM_addElement,
    GM_addStyle,
    GM_addValueChangeListener,
    GM_cookie,
    GM_deleteValue,
    GM_download,
    GM_getResourceText,
    GM_getResourceURL,
    GM_getTab,
    GM_getTabs,
    GM_getValue,
    GM_info,
    GM_listValues,
    GM_log,
    GM_notification,
    GM_openInTab,
    GM_registerMenuCommand,
    GM_removeValueChangeListener,
    GM_saveTab,
    GM_setClipboard,
    GM_setValue,
    GM_unregisterMenuCommand,
    GM_xmlhttpRequest,
    monkeyWindow,
    unsafeWindow: unsafeWindow$1
  }, Symbol.toStringTag, { value: "Module" }));
})(React, ReactDOM);
