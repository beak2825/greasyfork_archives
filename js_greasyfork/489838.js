// ==UserScript==
// @name               Claude Prompt Enhancer
// @name:en            Claude Prompt Enhancer
// @name:zh-CN         Claude 提示词增强
// @name:zh-TW         Claude 提示詞增強
// @namespace          https://github.com/FishHawk
// @version            2024.03.23
// @author             FishHawk
// @description        Use predefined prompts by custom command
// @description:en     Use predefined prompts by custom command
// @description:zh-CN  通过自定义命令使用预定义的提示
// @description:zh-TW  通過自定義命令使用預定義的提示
// @license            GPL-3.0
// @icon               data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cmVjdCBmaWxsPSIjQ0M5QjdBIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEwNC4xODciIHJ5PSIxMDUuMDQyIi8+PHBhdGggZmlsbD0iIzFGMUYxRSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMzE4LjY2MyAxNDkuNzg3aC00My4zNjhsNzguOTUyIDIxMi40MjMgNDMuMzY4LjAwNC03OC45NTItMjEyLjQyN3ptLTEyNS4zMjYgMGwtNzguOTUyIDIxMi40MjdoNDQuMjU1bDE1LjkzMi00NC42MDggODIuODQ2LS4wMDQgMTYuMTA3IDQ0LjYxMmg0NC4yNTVsLTc5LjEyNi0yMTIuNDI3aC00NS4zMTd6bS00LjI1MSAxMjguMzQxbDI2LjkxLTc0LjcwMSAyNy4wODMgNzQuNzAxaC01My45OTN6Ii8+PC9zdmc+
// @homepageURL        https://github.com/FishHawk/claude-predefined-prompt
// @supportURL         https://github.com/FishHawk/claude-predefined-prompt/issues
// @match              https://claude.ai/chat*
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/489838/Claude%20Prompt%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/489838/Claude%20Prompt%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-BtNbQLZx.js"(exports, module) {
      /**
      * @vue/shared v3.4.21
      * (c) 2018-present Yuxi (Evan) You and Vue contributors
      * @license MIT
      **/
      function makeMap(str, expectsLowerCase) {
        const set2 = new Set(str.split(","));
        return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
      }
      const EMPTY_OBJ = {};
      const EMPTY_ARR = [];
      const NOOP = () => {
      };
      const NO = () => false;
      const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
      (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
      const isModelListener = (key) => key.startsWith("onUpdate:");
      const extend = Object.assign;
      const remove = (arr, el) => {
        const i = arr.indexOf(el);
        if (i > -1) {
          arr.splice(i, 1);
        }
      };
      const hasOwnProperty$a = Object.prototype.hasOwnProperty;
      const hasOwn = (val, key) => hasOwnProperty$a.call(val, key);
      const isArray$1 = Array.isArray;
      const isMap = (val) => toTypeString(val) === "[object Map]";
      const isSet = (val) => toTypeString(val) === "[object Set]";
      const isFunction$1 = (val) => typeof val === "function";
      const isString = (val) => typeof val === "string";
      const isSymbol$1 = (val) => typeof val === "symbol";
      const isObject$1 = (val) => val !== null && typeof val === "object";
      const isPromise = (val) => {
        return (isObject$1(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
      };
      const objectToString$1 = Object.prototype.toString;
      const toTypeString = (value) => objectToString$1.call(value);
      const toRawType = (value) => {
        return toTypeString(value).slice(8, -1);
      };
      const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
      const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
      const isReservedProp = /* @__PURE__ */ makeMap(
        // the leading comma is intentional so empty string "" is also included
        ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
      );
      const cacheStringFunction = (fn) => {
        const cache2 = /* @__PURE__ */ Object.create(null);
        return (str) => {
          const hit = cache2[str];
          return hit || (cache2[str] = fn(str));
        };
      };
      const camelizeRE = /-(\w)/g;
      const camelize = cacheStringFunction((str) => {
        return str.replace(camelizeRE, (_, c2) => c2 ? c2.toUpperCase() : "");
      });
      const hyphenateRE = /\B([A-Z])/g;
      const hyphenate = cacheStringFunction(
        (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
      );
      const capitalize = cacheStringFunction((str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      });
      const toHandlerKey = cacheStringFunction((str) => {
        const s = str ? `on${capitalize(str)}` : ``;
        return s;
      });
      const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
      const invokeArrayFns = (fns, arg) => {
        for (let i = 0; i < fns.length; i++) {
          fns[i](arg);
        }
      };
      const def = (obj, key, value) => {
        Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: false,
          value
        });
      };
      const looseToNumber = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? val : n;
      };
      const toNumber = (val) => {
        const n = isString(val) ? Number(val) : NaN;
        return isNaN(n) ? val : n;
      };
      let _globalThis;
      const getGlobalThis = () => {
        return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      };
      function normalizeStyle(value) {
        if (isArray$1(value)) {
          const res = {};
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
            if (normalized) {
              for (const key in normalized) {
                res[key] = normalized[key];
              }
            }
          }
          return res;
        } else if (isString(value) || isObject$1(value)) {
          return value;
        }
      }
      const listDelimiterRE = /;(?![^(]*\))/g;
      const propertyDelimiterRE = /:([^]+)/;
      const styleCommentRE = /\/\*[^]*?\*\//g;
      function parseStringStyle(cssText) {
        const ret = {};
        cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
          if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
          }
        });
        return ret;
      }
      function normalizeClass(value) {
        let res = "";
        if (isString(value)) {
          res = value;
        } else if (isArray$1(value)) {
          for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
              res += normalized + " ";
            }
          }
        } else if (isObject$1(value)) {
          for (const name in value) {
            if (value[name]) {
              res += name + " ";
            }
          }
        }
        return res.trim();
      }
      const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
      const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
      function includeBooleanAttr(value) {
        return !!value || value === "";
      }
      const toDisplayString = (val) => {
        return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString$1 || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
      };
      const replacer = (_key, val) => {
        if (val && val.__v_isRef) {
          return replacer(_key, val.value);
        } else if (isMap(val)) {
          return {
            [`Map(${val.size})`]: [...val.entries()].reduce(
              (entries, [key, val2], i) => {
                entries[stringifySymbol(key, i) + " =>"] = val2;
                return entries;
              },
              {}
            )
          };
        } else if (isSet(val)) {
          return {
            [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
          };
        } else if (isSymbol$1(val)) {
          return stringifySymbol(val);
        } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
          return String(val);
        }
        return val;
      };
      const stringifySymbol = (v, i = "") => {
        var _a;
        return isSymbol$1(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
      };
      /**
      * @vue/reactivity v3.4.21
      * (c) 2018-present Yuxi (Evan) You and Vue contributors
      * @license MIT
      **/
      let activeEffectScope;
      class EffectScope {
        constructor(detached = false) {
          this.detached = detached;
          this._active = true;
          this.effects = [];
          this.cleanups = [];
          this.parent = activeEffectScope;
          if (!detached && activeEffectScope) {
            this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
              this
            ) - 1;
          }
        }
        get active() {
          return this._active;
        }
        run(fn) {
          if (this._active) {
            const currentEffectScope = activeEffectScope;
            try {
              activeEffectScope = this;
              return fn();
            } finally {
              activeEffectScope = currentEffectScope;
            }
          }
        }
        /**
         * This should only be called on non-detached scopes
         * @internal
         */
        on() {
          activeEffectScope = this;
        }
        /**
         * This should only be called on non-detached scopes
         * @internal
         */
        off() {
          activeEffectScope = this.parent;
        }
        stop(fromParent) {
          if (this._active) {
            let i, l;
            for (i = 0, l = this.effects.length; i < l; i++) {
              this.effects[i].stop();
            }
            for (i = 0, l = this.cleanups.length; i < l; i++) {
              this.cleanups[i]();
            }
            if (this.scopes) {
              for (i = 0, l = this.scopes.length; i < l; i++) {
                this.scopes[i].stop(true);
              }
            }
            if (!this.detached && this.parent && !fromParent) {
              const last = this.parent.scopes.pop();
              if (last && last !== this) {
                this.parent.scopes[this.index] = last;
                last.index = this.index;
              }
            }
            this.parent = void 0;
            this._active = false;
          }
        }
      }
      function recordEffectScope(effect2, scope = activeEffectScope) {
        if (scope && scope.active) {
          scope.effects.push(effect2);
        }
      }
      function getCurrentScope() {
        return activeEffectScope;
      }
      let activeEffect;
      class ReactiveEffect {
        constructor(fn, trigger2, scheduler2, scope) {
          this.fn = fn;
          this.trigger = trigger2;
          this.scheduler = scheduler2;
          this.active = true;
          this.deps = [];
          this._dirtyLevel = 4;
          this._trackId = 0;
          this._runnings = 0;
          this._shouldSchedule = false;
          this._depsLength = 0;
          recordEffectScope(this, scope);
        }
        get dirty() {
          if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
            this._dirtyLevel = 1;
            pauseTracking();
            for (let i = 0; i < this._depsLength; i++) {
              const dep = this.deps[i];
              if (dep.computed) {
                triggerComputed(dep.computed);
                if (this._dirtyLevel >= 4) {
                  break;
                }
              }
            }
            if (this._dirtyLevel === 1) {
              this._dirtyLevel = 0;
            }
            resetTracking();
          }
          return this._dirtyLevel >= 4;
        }
        set dirty(v) {
          this._dirtyLevel = v ? 4 : 0;
        }
        run() {
          this._dirtyLevel = 0;
          if (!this.active) {
            return this.fn();
          }
          let lastShouldTrack = shouldTrack;
          let lastEffect = activeEffect;
          try {
            shouldTrack = true;
            activeEffect = this;
            this._runnings++;
            preCleanupEffect(this);
            return this.fn();
          } finally {
            postCleanupEffect(this);
            this._runnings--;
            activeEffect = lastEffect;
            shouldTrack = lastShouldTrack;
          }
        }
        stop() {
          var _a;
          if (this.active) {
            preCleanupEffect(this);
            postCleanupEffect(this);
            (_a = this.onStop) == null ? void 0 : _a.call(this);
            this.active = false;
          }
        }
      }
      function triggerComputed(computed2) {
        return computed2.value;
      }
      function preCleanupEffect(effect2) {
        effect2._trackId++;
        effect2._depsLength = 0;
      }
      function postCleanupEffect(effect2) {
        if (effect2.deps.length > effect2._depsLength) {
          for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
            cleanupDepEffect(effect2.deps[i], effect2);
          }
          effect2.deps.length = effect2._depsLength;
        }
      }
      function cleanupDepEffect(dep, effect2) {
        const trackId = dep.get(effect2);
        if (trackId !== void 0 && effect2._trackId !== trackId) {
          dep.delete(effect2);
          if (dep.size === 0) {
            dep.cleanup();
          }
        }
      }
      let shouldTrack = true;
      let pauseScheduleStack = 0;
      const trackStack = [];
      function pauseTracking() {
        trackStack.push(shouldTrack);
        shouldTrack = false;
      }
      function resetTracking() {
        const last = trackStack.pop();
        shouldTrack = last === void 0 ? true : last;
      }
      function pauseScheduling() {
        pauseScheduleStack++;
      }
      function resetScheduling() {
        pauseScheduleStack--;
        while (!pauseScheduleStack && queueEffectSchedulers.length) {
          queueEffectSchedulers.shift()();
        }
      }
      function trackEffect(effect2, dep, debuggerEventExtraInfo) {
        if (dep.get(effect2) !== effect2._trackId) {
          dep.set(effect2, effect2._trackId);
          const oldDep = effect2.deps[effect2._depsLength];
          if (oldDep !== dep) {
            if (oldDep) {
              cleanupDepEffect(oldDep, effect2);
            }
            effect2.deps[effect2._depsLength++] = dep;
          } else {
            effect2._depsLength++;
          }
        }
      }
      const queueEffectSchedulers = [];
      function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
        pauseScheduling();
        for (const effect2 of dep.keys()) {
          let tracking;
          if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
            effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
            effect2._dirtyLevel = dirtyLevel;
          }
          if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
            effect2.trigger();
            if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
              effect2._shouldSchedule = false;
              if (effect2.scheduler) {
                queueEffectSchedulers.push(effect2.scheduler);
              }
            }
          }
        }
        resetScheduling();
      }
      const createDep = (cleanup, computed2) => {
        const dep = /* @__PURE__ */ new Map();
        dep.cleanup = cleanup;
        dep.computed = computed2;
        return dep;
      };
      const targetMap = /* @__PURE__ */ new WeakMap();
      const ITERATE_KEY = Symbol("");
      const MAP_KEY_ITERATE_KEY = Symbol("");
      function track(target, type, key) {
        if (shouldTrack && activeEffect) {
          let depsMap = targetMap.get(target);
          if (!depsMap) {
            targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
          }
          let dep = depsMap.get(key);
          if (!dep) {
            depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
          }
          trackEffect(
            activeEffect,
            dep
          );
        }
      }
      function trigger$1(target, type, key, newValue, oldValue, oldTarget) {
        const depsMap = targetMap.get(target);
        if (!depsMap) {
          return;
        }
        let deps = [];
        if (type === "clear") {
          deps = [...depsMap.values()];
        } else if (key === "length" && isArray$1(target)) {
          const newLength = Number(newValue);
          depsMap.forEach((dep, key2) => {
            if (key2 === "length" || !isSymbol$1(key2) && key2 >= newLength) {
              deps.push(dep);
            }
          });
        } else {
          if (key !== void 0) {
            deps.push(depsMap.get(key));
          }
          switch (type) {
            case "add":
              if (!isArray$1(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                  deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              } else if (isIntegerKey(key)) {
                deps.push(depsMap.get("length"));
              }
              break;
            case "delete":
              if (!isArray$1(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                  deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
              }
              break;
            case "set":
              if (isMap(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
              }
              break;
          }
        }
        pauseScheduling();
        for (const dep of deps) {
          if (dep) {
            triggerEffects(
              dep,
              4
            );
          }
        }
        resetScheduling();
      }
      function getDepFromReactive(object, key) {
        var _a;
        return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
      }
      const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
      const builtInSymbols = new Set(
        /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol$1)
      );
      const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
      function createArrayInstrumentations() {
        const instrumentations = {};
        ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
          instrumentations[key] = function(...args) {
            const arr = toRaw(this);
            for (let i = 0, l = this.length; i < l; i++) {
              track(arr, "get", i + "");
            }
            const res = arr[key](...args);
            if (res === -1 || res === false) {
              return arr[key](...args.map(toRaw));
            } else {
              return res;
            }
          };
        });
        ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
          instrumentations[key] = function(...args) {
            pauseTracking();
            pauseScheduling();
            const res = toRaw(this)[key].apply(this, args);
            resetScheduling();
            resetTracking();
            return res;
          };
        });
        return instrumentations;
      }
      function hasOwnProperty$9(key) {
        const obj = toRaw(this);
        track(obj, "has", key);
        return obj.hasOwnProperty(key);
      }
      class BaseReactiveHandler {
        constructor(_isReadonly = false, _isShallow = false) {
          this._isReadonly = _isReadonly;
          this._isShallow = _isShallow;
        }
        get(target, key, receiver) {
          const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
          if (key === "__v_isReactive") {
            return !isReadonly2;
          } else if (key === "__v_isReadonly") {
            return isReadonly2;
          } else if (key === "__v_isShallow") {
            return isShallow2;
          } else if (key === "__v_raw") {
            if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
            // this means the reciever is a user proxy of the reactive proxy
            Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
              return target;
            }
            return;
          }
          const targetIsArray = isArray$1(target);
          if (!isReadonly2) {
            if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
              return Reflect.get(arrayInstrumentations, key, receiver);
            }
            if (key === "hasOwnProperty") {
              return hasOwnProperty$9;
            }
          }
          const res = Reflect.get(target, key, receiver);
          if (isSymbol$1(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
          }
          if (!isReadonly2) {
            track(target, "get", key);
          }
          if (isShallow2) {
            return res;
          }
          if (isRef(res)) {
            return targetIsArray && isIntegerKey(key) ? res : res.value;
          }
          if (isObject$1(res)) {
            return isReadonly2 ? readonly(res) : reactive(res);
          }
          return res;
        }
      }
      class MutableReactiveHandler extends BaseReactiveHandler {
        constructor(isShallow2 = false) {
          super(false, isShallow2);
        }
        set(target, key, value, receiver) {
          let oldValue = target[key];
          if (!this._isShallow) {
            const isOldValueReadonly = isReadonly(oldValue);
            if (!isShallow(value) && !isReadonly(value)) {
              oldValue = toRaw(oldValue);
              value = toRaw(value);
            }
            if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
              if (isOldValueReadonly) {
                return false;
              } else {
                oldValue.value = value;
                return true;
              }
            }
          }
          const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
          const result = Reflect.set(target, key, value, receiver);
          if (target === toRaw(receiver)) {
            if (!hadKey) {
              trigger$1(target, "add", key, value);
            } else if (hasChanged(value, oldValue)) {
              trigger$1(target, "set", key, value);
            }
          }
          return result;
        }
        deleteProperty(target, key) {
          const hadKey = hasOwn(target, key);
          target[key];
          const result = Reflect.deleteProperty(target, key);
          if (result && hadKey) {
            trigger$1(target, "delete", key, void 0);
          }
          return result;
        }
        has(target, key) {
          const result = Reflect.has(target, key);
          if (!isSymbol$1(key) || !builtInSymbols.has(key)) {
            track(target, "has", key);
          }
          return result;
        }
        ownKeys(target) {
          track(
            target,
            "iterate",
            isArray$1(target) ? "length" : ITERATE_KEY
          );
          return Reflect.ownKeys(target);
        }
      }
      class ReadonlyReactiveHandler extends BaseReactiveHandler {
        constructor(isShallow2 = false) {
          super(true, isShallow2);
        }
        set(target, key) {
          return true;
        }
        deleteProperty(target, key) {
          return true;
        }
      }
      const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
      const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
      const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
        true
      );
      const toShallow = (value) => value;
      const getProto = (v) => Reflect.getPrototypeOf(v);
      function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
        target = target["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!isReadonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has: has2 } = getProto(rawTarget);
        const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
        if (has2.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has2.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      }
      function has(key, isReadonly2 = false) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!isReadonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      }
      function size$1(target, isReadonly2 = false) {
        target = target["__v_raw"];
        !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return Reflect.get(target, "size", target);
      }
      function add(value) {
        value = toRaw(value);
        const target = toRaw(this);
        const proto = getProto(target);
        const hadKey = proto.has.call(target, value);
        if (!hadKey) {
          target.add(value);
          trigger$1(target, "add", value, value);
        }
        return this;
      }
      function set(key, value) {
        value = toRaw(value);
        const target = toRaw(this);
        const { has: has2, get: get2 } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has2.call(target, key);
        }
        const oldValue = get2.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger$1(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger$1(target, "set", key, value);
        }
        return this;
      }
      function deleteEntry(key) {
        const target = toRaw(this);
        const { has: has2, get: get2 } = getProto(target);
        let hadKey = has2.call(target, key);
        if (!hadKey) {
          key = toRaw(key);
          hadKey = has2.call(target, key);
        }
        get2 ? get2.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger$1(target, "delete", key, void 0);
        }
        return result;
      }
      function clear() {
        const target = toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger$1(target, "clear", void 0, void 0);
        }
        return result;
      }
      function createForEach(isReadonly2, isShallow2) {
        return function forEach(callback, thisArg) {
          const observed = this;
          const target = observed["__v_raw"];
          const rawTarget = toRaw(target);
          const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
          !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
          return target.forEach((value, key) => {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
          });
        };
      }
      function createIterableMethod(method, isReadonly2, isShallow2) {
        return function(...args) {
          const target = this["__v_raw"];
          const rawTarget = toRaw(target);
          const targetIsMap = isMap(rawTarget);
          const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
          const isKeyOnly = method === "keys" && targetIsMap;
          const innerIterator = target[method](...args);
          const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
          !isReadonly2 && track(
            rawTarget,
            "iterate",
            isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
          );
          return {
            // iterator protocol
            next() {
              const { value, done } = innerIterator.next();
              return done ? { value, done } : {
                value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                done
              };
            },
            // iterable protocol
            [Symbol.iterator]() {
              return this;
            }
          };
        };
      }
      function createReadonlyMethod(type) {
        return function(...args) {
          return type === "delete" ? false : type === "clear" ? void 0 : this;
        };
      }
      function createInstrumentations() {
        const mutableInstrumentations2 = {
          get(key) {
            return get$1(this, key);
          },
          get size() {
            return size$1(this);
          },
          has,
          add,
          set,
          delete: deleteEntry,
          clear,
          forEach: createForEach(false, false)
        };
        const shallowInstrumentations2 = {
          get(key) {
            return get$1(this, key, false, true);
          },
          get size() {
            return size$1(this);
          },
          has,
          add,
          set,
          delete: deleteEntry,
          clear,
          forEach: createForEach(false, true)
        };
        const readonlyInstrumentations2 = {
          get(key) {
            return get$1(this, key, true);
          },
          get size() {
            return size$1(this, true);
          },
          has(key) {
            return has.call(this, key, true);
          },
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear"),
          forEach: createForEach(true, false)
        };
        const shallowReadonlyInstrumentations2 = {
          get(key) {
            return get$1(this, key, true, true);
          },
          get size() {
            return size$1(this, true);
          },
          has(key) {
            return has.call(this, key, true);
          },
          add: createReadonlyMethod("add"),
          set: createReadonlyMethod("set"),
          delete: createReadonlyMethod("delete"),
          clear: createReadonlyMethod("clear"),
          forEach: createForEach(true, true)
        };
        const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
        iteratorMethods.forEach((method) => {
          mutableInstrumentations2[method] = createIterableMethod(
            method,
            false,
            false
          );
          readonlyInstrumentations2[method] = createIterableMethod(
            method,
            true,
            false
          );
          shallowInstrumentations2[method] = createIterableMethod(
            method,
            false,
            true
          );
          shallowReadonlyInstrumentations2[method] = createIterableMethod(
            method,
            true,
            true
          );
        });
        return [
          mutableInstrumentations2,
          readonlyInstrumentations2,
          shallowInstrumentations2,
          shallowReadonlyInstrumentations2
        ];
      }
      const [
        mutableInstrumentations,
        readonlyInstrumentations,
        shallowInstrumentations,
        shallowReadonlyInstrumentations
      ] = /* @__PURE__ */ createInstrumentations();
      function createInstrumentationGetter(isReadonly2, shallow) {
        const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
        return (target, key, receiver) => {
          if (key === "__v_isReactive") {
            return !isReadonly2;
          } else if (key === "__v_isReadonly") {
            return isReadonly2;
          } else if (key === "__v_raw") {
            return target;
          }
          return Reflect.get(
            hasOwn(instrumentations, key) && key in target ? instrumentations : target,
            key,
            receiver
          );
        };
      }
      const mutableCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(false, false)
      };
      const shallowCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(false, true)
      };
      const readonlyCollectionHandlers = {
        get: /* @__PURE__ */ createInstrumentationGetter(true, false)
      };
      const reactiveMap = /* @__PURE__ */ new WeakMap();
      const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
      const readonlyMap = /* @__PURE__ */ new WeakMap();
      const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
      function targetTypeMap(rawType) {
        switch (rawType) {
          case "Object":
          case "Array":
            return 1;
          case "Map":
          case "Set":
          case "WeakMap":
          case "WeakSet":
            return 2;
          default:
            return 0;
        }
      }
      function getTargetType(value) {
        return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
      }
      function reactive(target) {
        if (isReadonly(target)) {
          return target;
        }
        return createReactiveObject(
          target,
          false,
          mutableHandlers,
          mutableCollectionHandlers,
          reactiveMap
        );
      }
      function shallowReactive(target) {
        return createReactiveObject(
          target,
          false,
          shallowReactiveHandlers,
          shallowCollectionHandlers,
          shallowReactiveMap
        );
      }
      function readonly(target) {
        return createReactiveObject(
          target,
          true,
          readonlyHandlers,
          readonlyCollectionHandlers,
          readonlyMap
        );
      }
      function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
        if (!isObject$1(target)) {
          return target;
        }
        if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
          return target;
        }
        const existingProxy = proxyMap.get(target);
        if (existingProxy) {
          return existingProxy;
        }
        const targetType = getTargetType(target);
        if (targetType === 0) {
          return target;
        }
        const proxy = new Proxy(
          target,
          targetType === 2 ? collectionHandlers : baseHandlers
        );
        proxyMap.set(target, proxy);
        return proxy;
      }
      function isReactive(value) {
        if (isReadonly(value)) {
          return isReactive(value["__v_raw"]);
        }
        return !!(value && value["__v_isReactive"]);
      }
      function isReadonly(value) {
        return !!(value && value["__v_isReadonly"]);
      }
      function isShallow(value) {
        return !!(value && value["__v_isShallow"]);
      }
      function isProxy(value) {
        return isReactive(value) || isReadonly(value);
      }
      function toRaw(observed) {
        const raw = observed && observed["__v_raw"];
        return raw ? toRaw(raw) : observed;
      }
      function markRaw(value) {
        if (Object.isExtensible(value)) {
          def(value, "__v_skip", true);
        }
        return value;
      }
      const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
      const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
      class ComputedRefImpl {
        constructor(getter, _setter, isReadonly2, isSSR) {
          this.getter = getter;
          this._setter = _setter;
          this.dep = void 0;
          this.__v_isRef = true;
          this["__v_isReadonly"] = false;
          this.effect = new ReactiveEffect(
            () => getter(this._value),
            () => triggerRefValue(
              this,
              this.effect._dirtyLevel === 2 ? 2 : 3
            )
          );
          this.effect.computed = this;
          this.effect.active = this._cacheable = !isSSR;
          this["__v_isReadonly"] = isReadonly2;
        }
        get value() {
          const self2 = toRaw(this);
          if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
            triggerRefValue(self2, 4);
          }
          trackRefValue(self2);
          if (self2.effect._dirtyLevel >= 2) {
            triggerRefValue(self2, 2);
          }
          return self2._value;
        }
        set value(newValue) {
          this._setter(newValue);
        }
        // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
        get _dirty() {
          return this.effect.dirty;
        }
        set _dirty(v) {
          this.effect.dirty = v;
        }
        // #endregion
      }
      function computed$1(getterOrOptions, debugOptions, isSSR = false) {
        let getter;
        let setter;
        const onlyGetter = isFunction$1(getterOrOptions);
        if (onlyGetter) {
          getter = getterOrOptions;
          setter = NOOP;
        } else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
        }
        const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
        return cRef;
      }
      function trackRefValue(ref2) {
        var _a;
        if (shouldTrack && activeEffect) {
          ref2 = toRaw(ref2);
          trackEffect(
            activeEffect,
            (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
              () => ref2.dep = void 0,
              ref2 instanceof ComputedRefImpl ? ref2 : void 0
            )
          );
        }
      }
      function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
        ref2 = toRaw(ref2);
        const dep = ref2.dep;
        if (dep) {
          triggerEffects(
            dep,
            dirtyLevel
          );
        }
      }
      function isRef(r) {
        return !!(r && r.__v_isRef === true);
      }
      function ref(value) {
        return createRef(value, false);
      }
      function shallowRef(value) {
        return createRef(value, true);
      }
      function createRef(rawValue, shallow) {
        if (isRef(rawValue)) {
          return rawValue;
        }
        return new RefImpl(rawValue, shallow);
      }
      class RefImpl {
        constructor(value, __v_isShallow) {
          this.__v_isShallow = __v_isShallow;
          this.dep = void 0;
          this.__v_isRef = true;
          this._rawValue = __v_isShallow ? value : toRaw(value);
          this._value = __v_isShallow ? value : toReactive(value);
        }
        get value() {
          trackRefValue(this);
          return this._value;
        }
        set value(newVal) {
          const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
          newVal = useDirectValue ? newVal : toRaw(newVal);
          if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal;
            this._value = useDirectValue ? newVal : toReactive(newVal);
            triggerRefValue(this, 4);
          }
        }
      }
      function unref(ref2) {
        return isRef(ref2) ? ref2.value : ref2;
      }
      const shallowUnwrapHandlers = {
        get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
        set: (target, key, value, receiver) => {
          const oldValue = target[key];
          if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
          } else {
            return Reflect.set(target, key, value, receiver);
          }
        }
      };
      function proxyRefs(objectWithRefs) {
        return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
      }
      class ObjectRefImpl {
        constructor(_object, _key, _defaultValue) {
          this._object = _object;
          this._key = _key;
          this._defaultValue = _defaultValue;
          this.__v_isRef = true;
        }
        get value() {
          const val = this._object[this._key];
          return val === void 0 ? this._defaultValue : val;
        }
        set value(newVal) {
          this._object[this._key] = newVal;
        }
        get dep() {
          return getDepFromReactive(toRaw(this._object), this._key);
        }
      }
      class GetterRefImpl {
        constructor(_getter) {
          this._getter = _getter;
          this.__v_isRef = true;
          this.__v_isReadonly = true;
        }
        get value() {
          return this._getter();
        }
      }
      function toRef(source, key, defaultValue) {
        if (isRef(source)) {
          return source;
        } else if (isFunction$1(source)) {
          return new GetterRefImpl(source);
        } else if (isObject$1(source) && arguments.length > 1) {
          return propertyToRef(source, key, defaultValue);
        } else {
          return ref(source);
        }
      }
      function propertyToRef(source, key, defaultValue) {
        const val = source[key];
        return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
      }
      /**
      * @vue/runtime-core v3.4.21
      * (c) 2018-present Yuxi (Evan) You and Vue contributors
      * @license MIT
      **/
      const stack$1 = [];
      function warn$1$1(msg2, ...args) {
        pauseTracking();
        const instance = stack$1.length ? stack$1[stack$1.length - 1].component : null;
        const appWarnHandler = instance && instance.appContext.config.warnHandler;
        const trace = getComponentTrace();
        if (appWarnHandler) {
          callWithErrorHandling(
            appWarnHandler,
            instance,
            11,
            [
              msg2 + args.map((a) => {
                var _a, _b;
                return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
              }).join(""),
              instance && instance.proxy,
              trace.map(
                ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
              ).join("\n"),
              trace
            ]
          );
        } else {
          const warnArgs = [`[Vue warn]: ${msg2}`, ...args];
          if (trace.length && // avoid spamming console during tests
          true) {
            warnArgs.push(`
`, ...formatTrace(trace));
          }
          console.warn(...warnArgs);
        }
        resetTracking();
      }
      function getComponentTrace() {
        let currentVNode = stack$1[stack$1.length - 1];
        if (!currentVNode) {
          return [];
        }
        const normalizedStack = [];
        while (currentVNode) {
          const last = normalizedStack[0];
          if (last && last.vnode === currentVNode) {
            last.recurseCount++;
          } else {
            normalizedStack.push({
              vnode: currentVNode,
              recurseCount: 0
            });
          }
          const parentInstance = currentVNode.component && currentVNode.component.parent;
          currentVNode = parentInstance && parentInstance.vnode;
        }
        return normalizedStack;
      }
      function formatTrace(trace) {
        const logs = [];
        trace.forEach((entry, i) => {
          logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
        });
        return logs;
      }
      function formatTraceEntry({ vnode, recurseCount }) {
        const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
        const isRoot = vnode.component ? vnode.component.parent == null : false;
        const open = ` at <${formatComponentName(
        vnode.component,
        vnode.type,
        isRoot
      )}`;
        const close = `>` + postfix;
        return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
      }
      function formatProps(props) {
        const res = [];
        const keys = Object.keys(props);
        keys.slice(0, 3).forEach((key) => {
          res.push(...formatProp(key, props[key]));
        });
        if (keys.length > 3) {
          res.push(` ...`);
        }
        return res;
      }
      function formatProp(key, value, raw) {
        if (isString(value)) {
          value = JSON.stringify(value);
          return raw ? value : [`${key}=${value}`];
        } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
          return raw ? value : [`${key}=${value}`];
        } else if (isRef(value)) {
          value = formatProp(key, toRaw(value.value), true);
          return raw ? value : [`${key}=Ref<`, value, `>`];
        } else if (isFunction$1(value)) {
          return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
        } else {
          value = toRaw(value);
          return raw ? value : [`${key}=`, value];
        }
      }
      function callWithErrorHandling(fn, instance, type, args) {
        try {
          return args ? fn(...args) : fn();
        } catch (err) {
          handleError(err, instance, type);
        }
      }
      function callWithAsyncErrorHandling(fn, instance, type, args) {
        if (isFunction$1(fn)) {
          const res = callWithErrorHandling(fn, instance, type, args);
          if (res && isPromise(res)) {
            res.catch((err) => {
              handleError(err, instance, type);
            });
          }
          return res;
        }
        const values = [];
        for (let i = 0; i < fn.length; i++) {
          values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
        }
        return values;
      }
      function handleError(err, instance, type, throwInDev = true) {
        const contextVNode = instance ? instance.vnode : null;
        if (instance) {
          let cur = instance.parent;
          const exposedInstance = instance.proxy;
          const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
          while (cur) {
            const errorCapturedHooks = cur.ec;
            if (errorCapturedHooks) {
              for (let i = 0; i < errorCapturedHooks.length; i++) {
                if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
                  return;
                }
              }
            }
            cur = cur.parent;
          }
          const appErrorHandler = instance.appContext.config.errorHandler;
          if (appErrorHandler) {
            callWithErrorHandling(
              appErrorHandler,
              null,
              10,
              [err, exposedInstance, errorInfo]
            );
            return;
          }
        }
        logError(err, type, contextVNode, throwInDev);
      }
      function logError(err, type, contextVNode, throwInDev = true) {
        {
          console.error(err);
        }
      }
      let isFlushing = false;
      let isFlushPending = false;
      const queue = [];
      let flushIndex = 0;
      const pendingPostFlushCbs = [];
      let activePostFlushCbs = null;
      let postFlushIndex = 0;
      const resolvedPromise = /* @__PURE__ */ Promise.resolve();
      let currentFlushPromise = null;
      function nextTick(fn) {
        const p2 = currentFlushPromise || resolvedPromise;
        return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
      }
      function findInsertionIndex(id) {
        let start = flushIndex + 1;
        let end = queue.length;
        while (start < end) {
          const middle = start + end >>> 1;
          const middleJob = queue[middle];
          const middleJobId = getId(middleJob);
          if (middleJobId < id || middleJobId === id && middleJob.pre) {
            start = middle + 1;
          } else {
            end = middle;
          }
        }
        return start;
      }
      function queueJob(job) {
        if (!queue.length || !queue.includes(
          job,
          isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
        )) {
          if (job.id == null) {
            queue.push(job);
          } else {
            queue.splice(findInsertionIndex(job.id), 0, job);
          }
          queueFlush();
        }
      }
      function queueFlush() {
        if (!isFlushing && !isFlushPending) {
          isFlushPending = true;
          currentFlushPromise = resolvedPromise.then(flushJobs);
        }
      }
      function invalidateJob(job) {
        const i = queue.indexOf(job);
        if (i > flushIndex) {
          queue.splice(i, 1);
        }
      }
      function queuePostFlushCb(cb) {
        if (!isArray$1(cb)) {
          if (!activePostFlushCbs || !activePostFlushCbs.includes(
            cb,
            cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
          )) {
            pendingPostFlushCbs.push(cb);
          }
        } else {
          pendingPostFlushCbs.push(...cb);
        }
        queueFlush();
      }
      function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
        for (; i < queue.length; i++) {
          const cb = queue[i];
          if (cb && cb.pre) {
            if (instance && cb.id !== instance.uid) {
              continue;
            }
            queue.splice(i, 1);
            i--;
            cb();
          }
        }
      }
      function flushPostFlushCbs(seen) {
        if (pendingPostFlushCbs.length) {
          const deduped = [...new Set(pendingPostFlushCbs)].sort(
            (a, b) => getId(a) - getId(b)
          );
          pendingPostFlushCbs.length = 0;
          if (activePostFlushCbs) {
            activePostFlushCbs.push(...deduped);
            return;
          }
          activePostFlushCbs = deduped;
          for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
            activePostFlushCbs[postFlushIndex]();
          }
          activePostFlushCbs = null;
          postFlushIndex = 0;
        }
      }
      const getId = (job) => job.id == null ? Infinity : job.id;
      const comparator = (a, b) => {
        const diff = getId(a) - getId(b);
        if (diff === 0) {
          if (a.pre && !b.pre)
            return -1;
          if (b.pre && !a.pre)
            return 1;
        }
        return diff;
      };
      function flushJobs(seen) {
        isFlushPending = false;
        isFlushing = true;
        queue.sort(comparator);
        try {
          for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
            const job = queue[flushIndex];
            if (job && job.active !== false) {
              if (false)
                ;
              callWithErrorHandling(job, null, 14);
            }
          }
        } finally {
          flushIndex = 0;
          queue.length = 0;
          flushPostFlushCbs();
          isFlushing = false;
          currentFlushPromise = null;
          if (queue.length || pendingPostFlushCbs.length) {
            flushJobs();
          }
        }
      }
      function emit(instance, event, ...rawArgs) {
        if (instance.isUnmounted)
          return;
        const props = instance.vnode.props || EMPTY_OBJ;
        let args = rawArgs;
        const isModelListener2 = event.startsWith("update:");
        const modelArg = isModelListener2 && event.slice(7);
        if (modelArg && modelArg in props) {
          const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
          const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
          if (trim) {
            args = rawArgs.map((a) => isString(a) ? a.trim() : a);
          }
          if (number) {
            args = rawArgs.map(looseToNumber);
          }
        }
        let handlerName;
        let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
        props[handlerName = toHandlerKey(camelize(event))];
        if (!handler && isModelListener2) {
          handler = props[handlerName = toHandlerKey(hyphenate(event))];
        }
        if (handler) {
          callWithAsyncErrorHandling(
            handler,
            instance,
            6,
            args
          );
        }
        const onceHandler = props[handlerName + `Once`];
        if (onceHandler) {
          if (!instance.emitted) {
            instance.emitted = {};
          } else if (instance.emitted[handlerName]) {
            return;
          }
          instance.emitted[handlerName] = true;
          callWithAsyncErrorHandling(
            onceHandler,
            instance,
            6,
            args
          );
        }
      }
      function normalizeEmitsOptions(comp, appContext, asMixin = false) {
        const cache2 = appContext.emitsCache;
        const cached = cache2.get(comp);
        if (cached !== void 0) {
          return cached;
        }
        const raw = comp.emits;
        let normalized = {};
        let hasExtends = false;
        if (!isFunction$1(comp)) {
          const extendEmits = (raw2) => {
            const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
            if (normalizedFromExtend) {
              hasExtends = true;
              extend(normalized, normalizedFromExtend);
            }
          };
          if (!asMixin && appContext.mixins.length) {
            appContext.mixins.forEach(extendEmits);
          }
          if (comp.extends) {
            extendEmits(comp.extends);
          }
          if (comp.mixins) {
            comp.mixins.forEach(extendEmits);
          }
        }
        if (!raw && !hasExtends) {
          if (isObject$1(comp)) {
            cache2.set(comp, null);
          }
          return null;
        }
        if (isArray$1(raw)) {
          raw.forEach((key) => normalized[key] = null);
        } else {
          extend(normalized, raw);
        }
        if (isObject$1(comp)) {
          cache2.set(comp, normalized);
        }
        return normalized;
      }
      function isEmitListener(options, key) {
        if (!options || !isOn(key)) {
          return false;
        }
        key = key.slice(2).replace(/Once$/, "");
        return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
      }
      let currentRenderingInstance = null;
      let currentScopeId = null;
      function setCurrentRenderingInstance(instance) {
        const prev = currentRenderingInstance;
        currentRenderingInstance = instance;
        currentScopeId = instance && instance.type.__scopeId || null;
        return prev;
      }
      function withCtx(fn, ctx2 = currentRenderingInstance, isNonScopedSlot) {
        if (!ctx2)
          return fn;
        if (fn._n) {
          return fn;
        }
        const renderFnWithContext = (...args) => {
          if (renderFnWithContext._d) {
            setBlockTracking(-1);
          }
          const prevInstance = setCurrentRenderingInstance(ctx2);
          let res;
          try {
            res = fn(...args);
          } finally {
            setCurrentRenderingInstance(prevInstance);
            if (renderFnWithContext._d) {
              setBlockTracking(1);
            }
          }
          return res;
        };
        renderFnWithContext._n = true;
        renderFnWithContext._c = true;
        renderFnWithContext._d = true;
        return renderFnWithContext;
      }
      function markAttrsAccessed() {
      }
      function renderComponentRoot(instance) {
        const {
          type: Component,
          vnode,
          proxy,
          withProxy,
          props,
          propsOptions: [propsOptions],
          slots,
          attrs,
          emit: emit2,
          render: render2,
          renderCache,
          data,
          setupState,
          ctx: ctx2,
          inheritAttrs
        } = instance;
        let result;
        let fallthroughAttrs;
        const prev = setCurrentRenderingInstance(instance);
        try {
          if (vnode.shapeFlag & 4) {
            const proxyToUse = withProxy || proxy;
            const thisProxy = false ? new Proxy(proxyToUse, {
              get(target, key, receiver) {
                warn$1$1(
                  `Property '${String(
                  key
                )}' was accessed via 'this'. Avoid using 'this' in templates.`
                );
                return Reflect.get(target, key, receiver);
              }
            }) : proxyToUse;
            result = normalizeVNode(
              render2.call(
                thisProxy,
                proxyToUse,
                renderCache,
                props,
                setupState,
                data,
                ctx2
              )
            );
            fallthroughAttrs = attrs;
          } else {
            const render22 = Component;
            if (false)
              ;
            result = normalizeVNode(
              render22.length > 1 ? render22(
                props,
                false ? {
                  get attrs() {
                    markAttrsAccessed();
                    return attrs;
                  },
                  slots,
                  emit: emit2
                } : { attrs, slots, emit: emit2 }
              ) : render22(
                props,
                null
                /* we know it doesn't need it */
              )
            );
            fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
          }
        } catch (err) {
          blockStack.length = 0;
          handleError(err, instance, 1);
          result = createVNode(Comment);
        }
        let root2 = result;
        if (fallthroughAttrs && inheritAttrs !== false) {
          const keys = Object.keys(fallthroughAttrs);
          const { shapeFlag } = root2;
          if (keys.length) {
            if (shapeFlag & (1 | 6)) {
              if (propsOptions && keys.some(isModelListener)) {
                fallthroughAttrs = filterModelListeners(
                  fallthroughAttrs,
                  propsOptions
                );
              }
              root2 = cloneVNode(root2, fallthroughAttrs);
            }
          }
        }
        if (vnode.dirs) {
          root2 = cloneVNode(root2);
          root2.dirs = root2.dirs ? root2.dirs.concat(vnode.dirs) : vnode.dirs;
        }
        if (vnode.transition) {
          root2.transition = vnode.transition;
        }
        {
          result = root2;
        }
        setCurrentRenderingInstance(prev);
        return result;
      }
      const getFunctionalFallthrough = (attrs) => {
        let res;
        for (const key in attrs) {
          if (key === "class" || key === "style" || isOn(key)) {
            (res || (res = {}))[key] = attrs[key];
          }
        }
        return res;
      };
      const filterModelListeners = (attrs, props) => {
        const res = {};
        for (const key in attrs) {
          if (!isModelListener(key) || !(key.slice(9) in props)) {
            res[key] = attrs[key];
          }
        }
        return res;
      };
      function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
        const { props: prevProps, children: prevChildren, component } = prevVNode;
        const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
        const emits = component.emitsOptions;
        if (nextVNode.dirs || nextVNode.transition) {
          return true;
        }
        if (optimized && patchFlag >= 0) {
          if (patchFlag & 1024) {
            return true;
          }
          if (patchFlag & 16) {
            if (!prevProps) {
              return !!nextProps;
            }
            return hasPropsChanged(prevProps, nextProps, emits);
          } else if (patchFlag & 8) {
            const dynamicProps = nextVNode.dynamicProps;
            for (let i = 0; i < dynamicProps.length; i++) {
              const key = dynamicProps[i];
              if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
                return true;
              }
            }
          }
        } else {
          if (prevChildren || nextChildren) {
            if (!nextChildren || !nextChildren.$stable) {
              return true;
            }
          }
          if (prevProps === nextProps) {
            return false;
          }
          if (!prevProps) {
            return !!nextProps;
          }
          if (!nextProps) {
            return true;
          }
          return hasPropsChanged(prevProps, nextProps, emits);
        }
        return false;
      }
      function hasPropsChanged(prevProps, nextProps, emitsOptions) {
        const nextKeys = Object.keys(nextProps);
        if (nextKeys.length !== Object.keys(prevProps).length) {
          return true;
        }
        for (let i = 0; i < nextKeys.length; i++) {
          const key = nextKeys[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
            return true;
          }
        }
        return false;
      }
      function updateHOCHostEl({ vnode, parent }, el) {
        while (parent) {
          const root2 = parent.subTree;
          if (root2.suspense && root2.suspense.activeBranch === vnode) {
            root2.el = vnode.el;
          }
          if (root2 === vnode) {
            (vnode = parent.vnode).el = el;
            parent = parent.parent;
          } else {
            break;
          }
        }
      }
      const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
      const isSuspense = (type) => type.__isSuspense;
      function queueEffectWithSuspense(fn, suspense) {
        if (suspense && suspense.pendingBranch) {
          if (isArray$1(fn)) {
            suspense.effects.push(...fn);
          } else {
            suspense.effects.push(fn);
          }
        } else {
          queuePostFlushCb(fn);
        }
      }
      const ssrContextKey$1 = Symbol.for("v-scx");
      const useSSRContext = () => {
        {
          const ctx2 = inject(ssrContextKey$1);
          return ctx2;
        }
      };
      function watchEffect(effect2, options) {
        return doWatch(effect2, null, options);
      }
      const INITIAL_WATCHER_VALUE = {};
      function watch(source, cb, options) {
        return doWatch(source, cb, options);
      }
      function doWatch(source, cb, {
        immediate,
        deep,
        flush,
        once,
        onTrack,
        onTrigger
      } = EMPTY_OBJ) {
        if (cb && once) {
          const _cb = cb;
          cb = (...args) => {
            _cb(...args);
            unwatch();
          };
        }
        const instance = currentInstance;
        const reactiveGetter = (source2) => deep === true ? source2 : (
          // for deep: false, only traverse root-level properties
          traverse(source2, deep === false ? 1 : void 0)
        );
        let getter;
        let forceTrigger = false;
        let isMultiSource = false;
        if (isRef(source)) {
          getter = () => source.value;
          forceTrigger = isShallow(source);
        } else if (isReactive(source)) {
          getter = () => reactiveGetter(source);
          forceTrigger = true;
        } else if (isArray$1(source)) {
          isMultiSource = true;
          forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
          getter = () => source.map((s) => {
            if (isRef(s)) {
              return s.value;
            } else if (isReactive(s)) {
              return reactiveGetter(s);
            } else if (isFunction$1(s)) {
              return callWithErrorHandling(s, instance, 2);
            } else
              ;
          });
        } else if (isFunction$1(source)) {
          if (cb) {
            getter = () => callWithErrorHandling(source, instance, 2);
          } else {
            getter = () => {
              if (cleanup) {
                cleanup();
              }
              return callWithAsyncErrorHandling(
                source,
                instance,
                3,
                [onCleanup]
              );
            };
          }
        } else {
          getter = NOOP;
        }
        if (cb && deep) {
          const baseGetter = getter;
          getter = () => traverse(baseGetter());
        }
        let cleanup;
        let onCleanup = (fn) => {
          cleanup = effect2.onStop = () => {
            callWithErrorHandling(fn, instance, 4);
            cleanup = effect2.onStop = void 0;
          };
        };
        let ssrCleanup;
        if (isInSSRComponentSetup) {
          onCleanup = NOOP;
          if (!cb) {
            getter();
          } else if (immediate) {
            callWithAsyncErrorHandling(cb, instance, 3, [
              getter(),
              isMultiSource ? [] : void 0,
              onCleanup
            ]);
          }
          if (flush === "sync") {
            const ctx2 = useSSRContext();
            ssrCleanup = ctx2.__watcherHandles || (ctx2.__watcherHandles = []);
          } else {
            return NOOP;
          }
        }
        let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
        const job = () => {
          if (!effect2.active || !effect2.dirty) {
            return;
          }
          if (cb) {
            const newValue = effect2.run();
            if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
              if (cleanup) {
                cleanup();
              }
              callWithAsyncErrorHandling(cb, instance, 3, [
                newValue,
                // pass undefined as the old value when it's changed for the first time
                oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
                onCleanup
              ]);
              oldValue = newValue;
            }
          } else {
            effect2.run();
          }
        };
        job.allowRecurse = !!cb;
        let scheduler2;
        if (flush === "sync") {
          scheduler2 = job;
        } else if (flush === "post") {
          scheduler2 = () => queuePostRenderEffect(job, instance && instance.suspense);
        } else {
          job.pre = true;
          if (instance)
            job.id = instance.uid;
          scheduler2 = () => queueJob(job);
        }
        const effect2 = new ReactiveEffect(getter, NOOP, scheduler2);
        const scope = getCurrentScope();
        const unwatch = () => {
          effect2.stop();
          if (scope) {
            remove(scope.effects, effect2);
          }
        };
        if (cb) {
          if (immediate) {
            job();
          } else {
            oldValue = effect2.run();
          }
        } else if (flush === "post") {
          queuePostRenderEffect(
            effect2.run.bind(effect2),
            instance && instance.suspense
          );
        } else {
          effect2.run();
        }
        if (ssrCleanup)
          ssrCleanup.push(unwatch);
        return unwatch;
      }
      function instanceWatch(source, value, options) {
        const publicThis = this.proxy;
        const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
        let cb;
        if (isFunction$1(value)) {
          cb = value;
        } else {
          cb = value.handler;
          options = value;
        }
        const reset = setCurrentInstance(this);
        const res = doWatch(getter, cb.bind(publicThis), options);
        reset();
        return res;
      }
      function createPathGetter(ctx2, path) {
        const segments = path.split(".");
        return () => {
          let cur = ctx2;
          for (let i = 0; i < segments.length && cur; i++) {
            cur = cur[segments[i]];
          }
          return cur;
        };
      }
      function traverse(value, depth, currentDepth = 0, seen) {
        if (!isObject$1(value) || value["__v_skip"]) {
          return value;
        }
        if (depth && depth > 0) {
          if (currentDepth >= depth) {
            return value;
          }
          currentDepth++;
        }
        seen = seen || /* @__PURE__ */ new Set();
        if (seen.has(value)) {
          return value;
        }
        seen.add(value);
        if (isRef(value)) {
          traverse(value.value, depth, currentDepth, seen);
        } else if (isArray$1(value)) {
          for (let i = 0; i < value.length; i++) {
            traverse(value[i], depth, currentDepth, seen);
          }
        } else if (isSet(value) || isMap(value)) {
          value.forEach((v) => {
            traverse(v, depth, currentDepth, seen);
          });
        } else if (isPlainObject$1(value)) {
          for (const key in value) {
            traverse(value[key], depth, currentDepth, seen);
          }
        }
        return value;
      }
      function withDirectives(vnode, directives) {
        if (currentRenderingInstance === null) {
          return vnode;
        }
        const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
        const bindings = vnode.dirs || (vnode.dirs = []);
        for (let i = 0; i < directives.length; i++) {
          let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
          if (dir) {
            if (isFunction$1(dir)) {
              dir = {
                mounted: dir,
                updated: dir
              };
            }
            if (dir.deep) {
              traverse(value);
            }
            bindings.push({
              dir,
              instance,
              value,
              oldValue: void 0,
              arg,
              modifiers
            });
          }
        }
        return vnode;
      }
      function invokeDirectiveHook(vnode, prevVNode, instance, name) {
        const bindings = vnode.dirs;
        const oldBindings = prevVNode && prevVNode.dirs;
        for (let i = 0; i < bindings.length; i++) {
          const binding = bindings[i];
          if (oldBindings) {
            binding.oldValue = oldBindings[i].value;
          }
          let hook = binding.dir[name];
          if (hook) {
            pauseTracking();
            callWithAsyncErrorHandling(hook, instance, 8, [
              vnode.el,
              binding,
              vnode,
              prevVNode
            ]);
            resetTracking();
          }
        }
      }
      const leaveCbKey = Symbol("_leaveCb");
      const enterCbKey$1 = Symbol("_enterCb");
      function useTransitionState() {
        const state = {
          isMounted: false,
          isLeaving: false,
          isUnmounting: false,
          leavingVNodes: /* @__PURE__ */ new Map()
        };
        onMounted(() => {
          state.isMounted = true;
        });
        onBeforeUnmount(() => {
          state.isUnmounting = true;
        });
        return state;
      }
      const TransitionHookValidator = [Function, Array];
      const BaseTransitionPropsValidators = {
        mode: String,
        appear: Boolean,
        persisted: Boolean,
        // enter
        onBeforeEnter: TransitionHookValidator,
        onEnter: TransitionHookValidator,
        onAfterEnter: TransitionHookValidator,
        onEnterCancelled: TransitionHookValidator,
        // leave
        onBeforeLeave: TransitionHookValidator,
        onLeave: TransitionHookValidator,
        onAfterLeave: TransitionHookValidator,
        onLeaveCancelled: TransitionHookValidator,
        // appear
        onBeforeAppear: TransitionHookValidator,
        onAppear: TransitionHookValidator,
        onAfterAppear: TransitionHookValidator,
        onAppearCancelled: TransitionHookValidator
      };
      const BaseTransitionImpl = {
        name: `BaseTransition`,
        props: BaseTransitionPropsValidators,
        setup(props, { slots }) {
          const instance = getCurrentInstance();
          const state = useTransitionState();
          return () => {
            const children = slots.default && getTransitionRawChildren(slots.default(), true);
            if (!children || !children.length) {
              return;
            }
            let child = children[0];
            if (children.length > 1) {
              for (const c2 of children) {
                if (c2.type !== Comment) {
                  child = c2;
                  break;
                }
              }
            }
            const rawProps = toRaw(props);
            const { mode } = rawProps;
            if (state.isLeaving) {
              return emptyPlaceholder(child);
            }
            const innerChild = getKeepAliveChild(child);
            if (!innerChild) {
              return emptyPlaceholder(child);
            }
            const enterHooks = resolveTransitionHooks(
              innerChild,
              rawProps,
              state,
              instance
            );
            setTransitionHooks(innerChild, enterHooks);
            const oldChild = instance.subTree;
            const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
            if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(innerChild, oldInnerChild)) {
              const leavingHooks = resolveTransitionHooks(
                oldInnerChild,
                rawProps,
                state,
                instance
              );
              setTransitionHooks(oldInnerChild, leavingHooks);
              if (mode === "out-in") {
                state.isLeaving = true;
                leavingHooks.afterLeave = () => {
                  state.isLeaving = false;
                  if (instance.update.active !== false) {
                    instance.effect.dirty = true;
                    instance.update();
                  }
                };
                return emptyPlaceholder(child);
              } else if (mode === "in-out" && innerChild.type !== Comment) {
                leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
                  const leavingVNodesCache = getLeavingNodesForType(
                    state,
                    oldInnerChild
                  );
                  leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
                  el[leaveCbKey] = () => {
                    earlyRemove();
                    el[leaveCbKey] = void 0;
                    delete enterHooks.delayedLeave;
                  };
                  enterHooks.delayedLeave = delayedLeave;
                };
              }
            }
            return child;
          };
        }
      };
      const BaseTransition = BaseTransitionImpl;
      function getLeavingNodesForType(state, vnode) {
        const { leavingVNodes } = state;
        let leavingVNodesCache = leavingVNodes.get(vnode.type);
        if (!leavingVNodesCache) {
          leavingVNodesCache = /* @__PURE__ */ Object.create(null);
          leavingVNodes.set(vnode.type, leavingVNodesCache);
        }
        return leavingVNodesCache;
      }
      function resolveTransitionHooks(vnode, props, state, instance) {
        const {
          appear,
          mode,
          persisted = false,
          onBeforeEnter,
          onEnter,
          onAfterEnter,
          onEnterCancelled,
          onBeforeLeave,
          onLeave,
          onAfterLeave,
          onLeaveCancelled,
          onBeforeAppear,
          onAppear,
          onAfterAppear,
          onAppearCancelled
        } = props;
        const key = String(vnode.key);
        const leavingVNodesCache = getLeavingNodesForType(state, vnode);
        const callHook2 = (hook, args) => {
          hook && callWithAsyncErrorHandling(
            hook,
            instance,
            9,
            args
          );
        };
        const callAsyncHook = (hook, args) => {
          const done = args[1];
          callHook2(hook, args);
          if (isArray$1(hook)) {
            if (hook.every((hook2) => hook2.length <= 1))
              done();
          } else if (hook.length <= 1) {
            done();
          }
        };
        const hooks = {
          mode,
          persisted,
          beforeEnter(el) {
            let hook = onBeforeEnter;
            if (!state.isMounted) {
              if (appear) {
                hook = onBeforeAppear || onBeforeEnter;
              } else {
                return;
              }
            }
            if (el[leaveCbKey]) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            const leavingVNode = leavingVNodesCache[key];
            if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
              leavingVNode.el[leaveCbKey]();
            }
            callHook2(hook, [el]);
          },
          enter(el) {
            let hook = onEnter;
            let afterHook = onAfterEnter;
            let cancelHook = onEnterCancelled;
            if (!state.isMounted) {
              if (appear) {
                hook = onAppear || onEnter;
                afterHook = onAfterAppear || onAfterEnter;
                cancelHook = onAppearCancelled || onEnterCancelled;
              } else {
                return;
              }
            }
            let called = false;
            const done = el[enterCbKey$1] = (cancelled) => {
              if (called)
                return;
              called = true;
              if (cancelled) {
                callHook2(cancelHook, [el]);
              } else {
                callHook2(afterHook, [el]);
              }
              if (hooks.delayedLeave) {
                hooks.delayedLeave();
              }
              el[enterCbKey$1] = void 0;
            };
            if (hook) {
              callAsyncHook(hook, [el, done]);
            } else {
              done();
            }
          },
          leave(el, remove2) {
            const key2 = String(vnode.key);
            if (el[enterCbKey$1]) {
              el[enterCbKey$1](
                true
                /* cancelled */
              );
            }
            if (state.isUnmounting) {
              return remove2();
            }
            callHook2(onBeforeLeave, [el]);
            let called = false;
            const done = el[leaveCbKey] = (cancelled) => {
              if (called)
                return;
              called = true;
              remove2();
              if (cancelled) {
                callHook2(onLeaveCancelled, [el]);
              } else {
                callHook2(onAfterLeave, [el]);
              }
              el[leaveCbKey] = void 0;
              if (leavingVNodesCache[key2] === vnode) {
                delete leavingVNodesCache[key2];
              }
            };
            leavingVNodesCache[key2] = vnode;
            if (onLeave) {
              callAsyncHook(onLeave, [el, done]);
            } else {
              done();
            }
          },
          clone(vnode2) {
            return resolveTransitionHooks(vnode2, props, state, instance);
          }
        };
        return hooks;
      }
      function emptyPlaceholder(vnode) {
        if (isKeepAlive(vnode)) {
          vnode = cloneVNode(vnode);
          vnode.children = null;
          return vnode;
        }
      }
      function getKeepAliveChild(vnode) {
        return isKeepAlive(vnode) ? (
          // #7121 ensure get the child component subtree in case
          // it's been replaced during HMR
          vnode.children ? vnode.children[0] : void 0
        ) : vnode;
      }
      function setTransitionHooks(vnode, hooks) {
        if (vnode.shapeFlag & 6 && vnode.component) {
          setTransitionHooks(vnode.component.subTree, hooks);
        } else if (vnode.shapeFlag & 128) {
          vnode.ssContent.transition = hooks.clone(vnode.ssContent);
          vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
        } else {
          vnode.transition = hooks;
        }
      }
      function getTransitionRawChildren(children, keepComment = false, parentKey) {
        let ret = [];
        let keyedFragmentCount = 0;
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
          if (child.type === Fragment) {
            if (child.patchFlag & 128)
              keyedFragmentCount++;
            ret = ret.concat(
              getTransitionRawChildren(child.children, keepComment, key)
            );
          } else if (keepComment || child.type !== Comment) {
            ret.push(key != null ? cloneVNode(child, { key }) : child);
          }
        }
        if (keyedFragmentCount > 1) {
          for (let i = 0; i < ret.length; i++) {
            ret[i].patchFlag = -2;
          }
        }
        return ret;
      }
      /*! #__NO_SIDE_EFFECTS__ */
      // @__NO_SIDE_EFFECTS__
      function defineComponent(options, extraOptions) {
        return isFunction$1(options) ? (
          // #8326: extend call and options.name access are considered side-effects
          // by Rollup, so we have to wrap it in a pure-annotated IIFE.
          /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
        ) : options;
      }
      const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
      const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
      function onActivated(hook, target) {
        registerKeepAliveHook(hook, "a", target);
      }
      function onDeactivated(hook, target) {
        registerKeepAliveHook(hook, "da", target);
      }
      function registerKeepAliveHook(hook, type, target = currentInstance) {
        const wrappedHook = hook.__wdc || (hook.__wdc = () => {
          let current = target;
          while (current) {
            if (current.isDeactivated) {
              return;
            }
            current = current.parent;
          }
          return hook();
        });
        injectHook(type, wrappedHook, target);
        if (target) {
          let current = target.parent;
          while (current && current.parent) {
            if (isKeepAlive(current.parent.vnode)) {
              injectToKeepAliveRoot(wrappedHook, type, target, current);
            }
            current = current.parent;
          }
        }
      }
      function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
        const injected = injectHook(
          type,
          hook,
          keepAliveRoot,
          true
          /* prepend */
        );
        onUnmounted(() => {
          remove(keepAliveRoot[type], injected);
        }, target);
      }
      function injectHook(type, hook, target = currentInstance, prepend = false) {
        if (target) {
          const hooks = target[type] || (target[type] = []);
          const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
            if (target.isUnmounted) {
              return;
            }
            pauseTracking();
            const reset = setCurrentInstance(target);
            const res = callWithAsyncErrorHandling(hook, target, type, args);
            reset();
            resetTracking();
            return res;
          });
          if (prepend) {
            hooks.unshift(wrappedHook);
          } else {
            hooks.push(wrappedHook);
          }
          return wrappedHook;
        }
      }
      const createHook = (lifecycle) => (hook, target = currentInstance) => (
        // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
        (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
      );
      const onBeforeMount = createHook("bm");
      const onMounted = createHook("m");
      const onBeforeUpdate = createHook("bu");
      const onUpdated = createHook("u");
      const onBeforeUnmount = createHook("bum");
      const onUnmounted = createHook("um");
      const onServerPrefetch = createHook("sp");
      const onRenderTriggered = createHook(
        "rtg"
      );
      const onRenderTracked = createHook(
        "rtc"
      );
      function onErrorCaptured(hook, target = currentInstance) {
        injectHook("ec", hook, target);
      }
      function renderList(source, renderItem, cache2, index) {
        let ret;
        const cached = cache2 && cache2[index];
        if (isArray$1(source) || isString(source)) {
          ret = new Array(source.length);
          for (let i = 0, l = source.length; i < l; i++) {
            ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
          }
        } else if (typeof source === "number") {
          ret = new Array(source);
          for (let i = 0; i < source; i++) {
            ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
          }
        } else if (isObject$1(source)) {
          if (source[Symbol.iterator]) {
            ret = Array.from(
              source,
              (item, i) => renderItem(item, i, void 0, cached && cached[i])
            );
          } else {
            const keys = Object.keys(source);
            ret = new Array(keys.length);
            for (let i = 0, l = keys.length; i < l; i++) {
              const key = keys[i];
              ret[i] = renderItem(source[key], key, i, cached && cached[i]);
            }
          }
        } else {
          ret = [];
        }
        if (cache2) {
          cache2[index] = ret;
        }
        return ret;
      }
      function renderSlot(slots, name, props = {}, fallback, noSlotted) {
        if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
          if (name !== "default")
            props.name = name;
          return createVNode("slot", props, fallback && fallback());
        }
        let slot = slots[name];
        if (slot && slot._c) {
          slot._d = false;
        }
        openBlock();
        const validSlotContent = slot && ensureValidVNode$1(slot(props));
        const rendered = createBlock(
          Fragment,
          {
            key: props.key || // slot content array of a dynamic conditional slot may have a branch
            // key attached in the `createSlots` helper, respect that
            validSlotContent && validSlotContent.key || `_${name}`
          },
          validSlotContent || (fallback ? fallback() : []),
          validSlotContent && slots._ === 1 ? 64 : -2
        );
        if (!noSlotted && rendered.scopeId) {
          rendered.slotScopeIds = [rendered.scopeId + "-s"];
        }
        if (slot && slot._c) {
          slot._d = true;
        }
        return rendered;
      }
      function ensureValidVNode$1(vnodes) {
        return vnodes.some((child) => {
          if (!isVNode(child))
            return true;
          if (child.type === Comment)
            return false;
          if (child.type === Fragment && !ensureValidVNode$1(child.children))
            return false;
          return true;
        }) ? vnodes : null;
      }
      const getPublicInstance = (i) => {
        if (!i)
          return null;
        if (isStatefulComponent(i))
          return getExposeProxy(i) || i.proxy;
        return getPublicInstance(i.parent);
      };
      const publicPropertiesMap = (
        // Move PURE marker to new line to workaround compiler discarding it
        // due to type annotation
        /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
          $: (i) => i,
          $el: (i) => i.vnode.el,
          $data: (i) => i.data,
          $props: (i) => i.props,
          $attrs: (i) => i.attrs,
          $slots: (i) => i.slots,
          $refs: (i) => i.refs,
          $parent: (i) => getPublicInstance(i.parent),
          $root: (i) => getPublicInstance(i.root),
          $emit: (i) => i.emit,
          $options: (i) => resolveMergedOptions(i),
          $forceUpdate: (i) => i.f || (i.f = () => {
            i.effect.dirty = true;
            queueJob(i.update);
          }),
          $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
          $watch: (i) => instanceWatch.bind(i)
        })
      );
      const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
      const PublicInstanceProxyHandlers = {
        get({ _: instance }, key) {
          const { ctx: ctx2, setupState, data, props, accessCache, type, appContext } = instance;
          let normalizedProps;
          if (key[0] !== "$") {
            const n = accessCache[key];
            if (n !== void 0) {
              switch (n) {
                case 1:
                  return setupState[key];
                case 2:
                  return data[key];
                case 4:
                  return ctx2[key];
                case 3:
                  return props[key];
              }
            } else if (hasSetupBinding(setupState, key)) {
              accessCache[key] = 1;
              return setupState[key];
            } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
              accessCache[key] = 2;
              return data[key];
            } else if (
              // only cache other properties when instance has declared (thus stable)
              // props
              (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
            ) {
              accessCache[key] = 3;
              return props[key];
            } else if (ctx2 !== EMPTY_OBJ && hasOwn(ctx2, key)) {
              accessCache[key] = 4;
              return ctx2[key];
            } else if (shouldCacheAccess) {
              accessCache[key] = 0;
            }
          }
          const publicGetter = publicPropertiesMap[key];
          let cssModule, globalProperties;
          if (publicGetter) {
            if (key === "$attrs") {
              track(instance, "get", key);
            }
            return publicGetter(instance);
          } else if (
            // css module (injected by vue-loader)
            (cssModule = type.__cssModules) && (cssModule = cssModule[key])
          ) {
            return cssModule;
          } else if (ctx2 !== EMPTY_OBJ && hasOwn(ctx2, key)) {
            accessCache[key] = 4;
            return ctx2[key];
          } else if (
            // global properties
            globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
          ) {
            {
              return globalProperties[key];
            }
          } else
            ;
        },
        set({ _: instance }, key, value) {
          const { data, setupState, ctx: ctx2 } = instance;
          if (hasSetupBinding(setupState, key)) {
            setupState[key] = value;
            return true;
          } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
            data[key] = value;
            return true;
          } else if (hasOwn(instance.props, key)) {
            return false;
          }
          if (key[0] === "$" && key.slice(1) in instance) {
            return false;
          } else {
            {
              ctx2[key] = value;
            }
          }
          return true;
        },
        has({
          _: { data, setupState, accessCache, ctx: ctx2, appContext, propsOptions }
        }, key) {
          let normalizedProps;
          return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx2, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
        },
        defineProperty(target, key, descriptor) {
          if (descriptor.get != null) {
            target._.accessCache[key] = 0;
          } else if (hasOwn(descriptor, "value")) {
            this.set(target, key, descriptor.value, null);
          }
          return Reflect.defineProperty(target, key, descriptor);
        }
      };
      function normalizePropsOrEmits(props) {
        return isArray$1(props) ? props.reduce(
          (normalized, p2) => (normalized[p2] = null, normalized),
          {}
        ) : props;
      }
      let shouldCacheAccess = true;
      function applyOptions(instance) {
        const options = resolveMergedOptions(instance);
        const publicThis = instance.proxy;
        const ctx2 = instance.ctx;
        shouldCacheAccess = false;
        if (options.beforeCreate) {
          callHook$1(options.beforeCreate, instance, "bc");
        }
        const {
          // state
          data: dataOptions,
          computed: computedOptions,
          methods,
          watch: watchOptions,
          provide: provideOptions,
          inject: injectOptions,
          // lifecycle
          created,
          beforeMount,
          mounted,
          beforeUpdate,
          updated,
          activated,
          deactivated,
          beforeDestroy,
          beforeUnmount,
          destroyed,
          unmounted,
          render: render2,
          renderTracked,
          renderTriggered,
          errorCaptured,
          serverPrefetch,
          // public API
          expose,
          inheritAttrs,
          // assets
          components,
          directives,
          filters
        } = options;
        const checkDuplicateProperties = null;
        if (injectOptions) {
          resolveInjections(injectOptions, ctx2, checkDuplicateProperties);
        }
        if (methods) {
          for (const key in methods) {
            const methodHandler = methods[key];
            if (isFunction$1(methodHandler)) {
              {
                ctx2[key] = methodHandler.bind(publicThis);
              }
            }
          }
        }
        if (dataOptions) {
          const data = dataOptions.call(publicThis, publicThis);
          if (!isObject$1(data))
            ;
          else {
            instance.data = reactive(data);
          }
        }
        shouldCacheAccess = true;
        if (computedOptions) {
          for (const key in computedOptions) {
            const opt = computedOptions[key];
            const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
            const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
            const c2 = computed({
              get: get2,
              set: set2
            });
            Object.defineProperty(ctx2, key, {
              enumerable: true,
              configurable: true,
              get: () => c2.value,
              set: (v) => c2.value = v
            });
          }
        }
        if (watchOptions) {
          for (const key in watchOptions) {
            createWatcher(watchOptions[key], ctx2, publicThis, key);
          }
        }
        if (provideOptions) {
          const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
          Reflect.ownKeys(provides).forEach((key) => {
            provide(key, provides[key]);
          });
        }
        if (created) {
          callHook$1(created, instance, "c");
        }
        function registerLifecycleHook(register, hook) {
          if (isArray$1(hook)) {
            hook.forEach((_hook) => register(_hook.bind(publicThis)));
          } else if (hook) {
            register(hook.bind(publicThis));
          }
        }
        registerLifecycleHook(onBeforeMount, beforeMount);
        registerLifecycleHook(onMounted, mounted);
        registerLifecycleHook(onBeforeUpdate, beforeUpdate);
        registerLifecycleHook(onUpdated, updated);
        registerLifecycleHook(onActivated, activated);
        registerLifecycleHook(onDeactivated, deactivated);
        registerLifecycleHook(onErrorCaptured, errorCaptured);
        registerLifecycleHook(onRenderTracked, renderTracked);
        registerLifecycleHook(onRenderTriggered, renderTriggered);
        registerLifecycleHook(onBeforeUnmount, beforeUnmount);
        registerLifecycleHook(onUnmounted, unmounted);
        registerLifecycleHook(onServerPrefetch, serverPrefetch);
        if (isArray$1(expose)) {
          if (expose.length) {
            const exposed = instance.exposed || (instance.exposed = {});
            expose.forEach((key) => {
              Object.defineProperty(exposed, key, {
                get: () => publicThis[key],
                set: (val) => publicThis[key] = val
              });
            });
          } else if (!instance.exposed) {
            instance.exposed = {};
          }
        }
        if (render2 && instance.render === NOOP) {
          instance.render = render2;
        }
        if (inheritAttrs != null) {
          instance.inheritAttrs = inheritAttrs;
        }
        if (components)
          instance.components = components;
        if (directives)
          instance.directives = directives;
      }
      function resolveInjections(injectOptions, ctx2, checkDuplicateProperties = NOOP) {
        if (isArray$1(injectOptions)) {
          injectOptions = normalizeInject(injectOptions);
        }
        for (const key in injectOptions) {
          const opt = injectOptions[key];
          let injected;
          if (isObject$1(opt)) {
            if ("default" in opt) {
              injected = inject(
                opt.from || key,
                opt.default,
                true
              );
            } else {
              injected = inject(opt.from || key);
            }
          } else {
            injected = inject(opt);
          }
          if (isRef(injected)) {
            Object.defineProperty(ctx2, key, {
              enumerable: true,
              configurable: true,
              get: () => injected.value,
              set: (v) => injected.value = v
            });
          } else {
            ctx2[key] = injected;
          }
        }
      }
      function callHook$1(hook, instance, type) {
        callWithAsyncErrorHandling(
          isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
          instance,
          type
        );
      }
      function createWatcher(raw, ctx2, publicThis, key) {
        const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
        if (isString(raw)) {
          const handler = ctx2[raw];
          if (isFunction$1(handler)) {
            watch(getter, handler);
          }
        } else if (isFunction$1(raw)) {
          watch(getter, raw.bind(publicThis));
        } else if (isObject$1(raw)) {
          if (isArray$1(raw)) {
            raw.forEach((r) => createWatcher(r, ctx2, publicThis, key));
          } else {
            const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx2[raw.handler];
            if (isFunction$1(handler)) {
              watch(getter, handler, raw);
            }
          }
        } else
          ;
      }
      function resolveMergedOptions(instance) {
        const base2 = instance.type;
        const { mixins, extends: extendsOptions } = base2;
        const {
          mixins: globalMixins,
          optionsCache: cache2,
          config: { optionMergeStrategies }
        } = instance.appContext;
        const cached = cache2.get(base2);
        let resolved;
        if (cached) {
          resolved = cached;
        } else if (!globalMixins.length && !mixins && !extendsOptions) {
          {
            resolved = base2;
          }
        } else {
          resolved = {};
          if (globalMixins.length) {
            globalMixins.forEach(
              (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
            );
          }
          mergeOptions(resolved, base2, optionMergeStrategies);
        }
        if (isObject$1(base2)) {
          cache2.set(base2, resolved);
        }
        return resolved;
      }
      function mergeOptions(to, from, strats, asMixin = false) {
        const { mixins, extends: extendsOptions } = from;
        if (extendsOptions) {
          mergeOptions(to, extendsOptions, strats, true);
        }
        if (mixins) {
          mixins.forEach(
            (m) => mergeOptions(to, m, strats, true)
          );
        }
        for (const key in from) {
          if (asMixin && key === "expose")
            ;
          else {
            const strat = internalOptionMergeStrats[key] || strats && strats[key];
            to[key] = strat ? strat(to[key], from[key]) : from[key];
          }
        }
        return to;
      }
      const internalOptionMergeStrats = {
        data: mergeDataFn,
        props: mergeEmitsOrPropsOptions,
        emits: mergeEmitsOrPropsOptions,
        // objects
        methods: mergeObjectOptions,
        computed: mergeObjectOptions,
        // lifecycle
        beforeCreate: mergeAsArray,
        created: mergeAsArray,
        beforeMount: mergeAsArray,
        mounted: mergeAsArray,
        beforeUpdate: mergeAsArray,
        updated: mergeAsArray,
        beforeDestroy: mergeAsArray,
        beforeUnmount: mergeAsArray,
        destroyed: mergeAsArray,
        unmounted: mergeAsArray,
        activated: mergeAsArray,
        deactivated: mergeAsArray,
        errorCaptured: mergeAsArray,
        serverPrefetch: mergeAsArray,
        // assets
        components: mergeObjectOptions,
        directives: mergeObjectOptions,
        // watch
        watch: mergeWatchOptions,
        // provide / inject
        provide: mergeDataFn,
        inject: mergeInject
      };
      function mergeDataFn(to, from) {
        if (!from) {
          return to;
        }
        if (!to) {
          return from;
        }
        return function mergedDataFn() {
          return extend(
            isFunction$1(to) ? to.call(this, this) : to,
            isFunction$1(from) ? from.call(this, this) : from
          );
        };
      }
      function mergeInject(to, from) {
        return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
      }
      function normalizeInject(raw) {
        if (isArray$1(raw)) {
          const res = {};
          for (let i = 0; i < raw.length; i++) {
            res[raw[i]] = raw[i];
          }
          return res;
        }
        return raw;
      }
      function mergeAsArray(to, from) {
        return to ? [...new Set([].concat(to, from))] : from;
      }
      function mergeObjectOptions(to, from) {
        return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
      }
      function mergeEmitsOrPropsOptions(to, from) {
        if (to) {
          if (isArray$1(to) && isArray$1(from)) {
            return [.../* @__PURE__ */ new Set([...to, ...from])];
          }
          return extend(
            /* @__PURE__ */ Object.create(null),
            normalizePropsOrEmits(to),
            normalizePropsOrEmits(from != null ? from : {})
          );
        } else {
          return from;
        }
      }
      function mergeWatchOptions(to, from) {
        if (!to)
          return from;
        if (!from)
          return to;
        const merged = extend(/* @__PURE__ */ Object.create(null), to);
        for (const key in from) {
          merged[key] = mergeAsArray(to[key], from[key]);
        }
        return merged;
      }
      function createAppContext() {
        return {
          app: null,
          config: {
            isNativeTag: NO,
            performance: false,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: void 0,
            warnHandler: void 0,
            compilerOptions: {}
          },
          mixins: [],
          components: {},
          directives: {},
          provides: /* @__PURE__ */ Object.create(null),
          optionsCache: /* @__PURE__ */ new WeakMap(),
          propsCache: /* @__PURE__ */ new WeakMap(),
          emitsCache: /* @__PURE__ */ new WeakMap()
        };
      }
      let uid$1 = 0;
      function createAppAPI(render2, hydrate) {
        return function createApp2(rootComponent, rootProps = null) {
          if (!isFunction$1(rootComponent)) {
            rootComponent = extend({}, rootComponent);
          }
          if (rootProps != null && !isObject$1(rootProps)) {
            rootProps = null;
          }
          const context = createAppContext();
          const installedPlugins = /* @__PURE__ */ new WeakSet();
          let isMounted2 = false;
          const app = context.app = {
            _uid: uid$1++,
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            _context: context,
            _instance: null,
            version,
            get config() {
              return context.config;
            },
            set config(v) {
            },
            use(plugin2, ...options) {
              if (installedPlugins.has(plugin2))
                ;
              else if (plugin2 && isFunction$1(plugin2.install)) {
                installedPlugins.add(plugin2);
                plugin2.install(app, ...options);
              } else if (isFunction$1(plugin2)) {
                installedPlugins.add(plugin2);
                plugin2(app, ...options);
              } else
                ;
              return app;
            },
            mixin(mixin) {
              {
                if (!context.mixins.includes(mixin)) {
                  context.mixins.push(mixin);
                }
              }
              return app;
            },
            component(name, component) {
              if (!component) {
                return context.components[name];
              }
              context.components[name] = component;
              return app;
            },
            directive(name, directive) {
              if (!directive) {
                return context.directives[name];
              }
              context.directives[name] = directive;
              return app;
            },
            mount(rootContainer, isHydrate, namespace2) {
              if (!isMounted2) {
                const vnode = createVNode(rootComponent, rootProps);
                vnode.appContext = context;
                if (namespace2 === true) {
                  namespace2 = "svg";
                } else if (namespace2 === false) {
                  namespace2 = void 0;
                }
                if (isHydrate && hydrate) {
                  hydrate(vnode, rootContainer);
                } else {
                  render2(vnode, rootContainer, namespace2);
                }
                isMounted2 = true;
                app._container = rootContainer;
                rootContainer.__vue_app__ = app;
                return getExposeProxy(vnode.component) || vnode.component.proxy;
              }
            },
            unmount() {
              if (isMounted2) {
                render2(null, app._container);
                delete app._container.__vue_app__;
              }
            },
            provide(key, value) {
              context.provides[key] = value;
              return app;
            },
            runWithContext(fn) {
              const lastApp = currentApp;
              currentApp = app;
              try {
                return fn();
              } finally {
                currentApp = lastApp;
              }
            }
          };
          return app;
        };
      }
      let currentApp = null;
      function provide(key, value) {
        if (!currentInstance)
          ;
        else {
          let provides = currentInstance.provides;
          const parentProvides = currentInstance.parent && currentInstance.parent.provides;
          if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides);
          }
          provides[key] = value;
        }
      }
      function inject(key, defaultValue, treatDefaultAsFactory = false) {
        const instance = currentInstance || currentRenderingInstance;
        if (instance || currentApp) {
          const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
          if (provides && key in provides) {
            return provides[key];
          } else if (arguments.length > 1) {
            return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
          } else
            ;
        }
      }
      function initProps(instance, rawProps, isStateful, isSSR = false) {
        const props = {};
        const attrs = {};
        def(attrs, InternalObjectKey, 1);
        instance.propsDefaults = /* @__PURE__ */ Object.create(null);
        setFullProps(instance, rawProps, props, attrs);
        for (const key in instance.propsOptions[0]) {
          if (!(key in props)) {
            props[key] = void 0;
          }
        }
        if (isStateful) {
          instance.props = isSSR ? props : shallowReactive(props);
        } else {
          if (!instance.type.props) {
            instance.props = attrs;
          } else {
            instance.props = props;
          }
        }
        instance.attrs = attrs;
      }
      function updateProps(instance, rawProps, rawPrevProps, optimized) {
        const {
          props,
          attrs,
          vnode: { patchFlag }
        } = instance;
        const rawCurrentProps = toRaw(props);
        const [options] = instance.propsOptions;
        let hasAttrsChanged = false;
        if (
          // always force full diff in dev
          // - #1942 if hmr is enabled with sfc component
          // - vite#872 non-sfc component used by sfc component
          (optimized || patchFlag > 0) && !(patchFlag & 16)
        ) {
          if (patchFlag & 8) {
            const propsToUpdate = instance.vnode.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              let key = propsToUpdate[i];
              if (isEmitListener(instance.emitsOptions, key)) {
                continue;
              }
              const value = rawProps[key];
              if (options) {
                if (hasOwn(attrs, key)) {
                  if (value !== attrs[key]) {
                    attrs[key] = value;
                    hasAttrsChanged = true;
                  }
                } else {
                  const camelizedKey = camelize(key);
                  props[camelizedKey] = resolvePropValue(
                    options,
                    rawCurrentProps,
                    camelizedKey,
                    value,
                    instance,
                    false
                  );
                }
              } else {
                if (value !== attrs[key]) {
                  attrs[key] = value;
                  hasAttrsChanged = true;
                }
              }
            }
          }
        } else {
          if (setFullProps(instance, rawProps, props, attrs)) {
            hasAttrsChanged = true;
          }
          let kebabKey;
          for (const key in rawCurrentProps) {
            if (!rawProps || // for camelCase
            !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
            // and converted to camelCase (#955)
            ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
              if (options) {
                if (rawPrevProps && // for camelCase
                (rawPrevProps[key] !== void 0 || // for kebab-case
                rawPrevProps[kebabKey] !== void 0)) {
                  props[key] = resolvePropValue(
                    options,
                    rawCurrentProps,
                    key,
                    void 0,
                    instance,
                    true
                  );
                }
              } else {
                delete props[key];
              }
            }
          }
          if (attrs !== rawCurrentProps) {
            for (const key in attrs) {
              if (!rawProps || !hasOwn(rawProps, key) && true) {
                delete attrs[key];
                hasAttrsChanged = true;
              }
            }
          }
        }
        if (hasAttrsChanged) {
          trigger$1(instance, "set", "$attrs");
        }
      }
      function setFullProps(instance, rawProps, props, attrs) {
        const [options, needCastKeys] = instance.propsOptions;
        let hasAttrsChanged = false;
        let rawCastValues;
        if (rawProps) {
          for (let key in rawProps) {
            if (isReservedProp(key)) {
              continue;
            }
            const value = rawProps[key];
            let camelKey;
            if (options && hasOwn(options, camelKey = camelize(key))) {
              if (!needCastKeys || !needCastKeys.includes(camelKey)) {
                props[camelKey] = value;
              } else {
                (rawCastValues || (rawCastValues = {}))[camelKey] = value;
              }
            } else if (!isEmitListener(instance.emitsOptions, key)) {
              if (!(key in attrs) || value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            }
          }
        }
        if (needCastKeys) {
          const rawCurrentProps = toRaw(props);
          const castValues = rawCastValues || EMPTY_OBJ;
          for (let i = 0; i < needCastKeys.length; i++) {
            const key = needCastKeys[i];
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              castValues[key],
              instance,
              !hasOwn(castValues, key)
            );
          }
        }
        return hasAttrsChanged;
      }
      function resolvePropValue(options, props, key, value, instance, isAbsent) {
        const opt = options[key];
        if (opt != null) {
          const hasDefault = hasOwn(opt, "default");
          if (hasDefault && value === void 0) {
            const defaultValue = opt.default;
            if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
              const { propsDefaults } = instance;
              if (key in propsDefaults) {
                value = propsDefaults[key];
              } else {
                const reset = setCurrentInstance(instance);
                value = propsDefaults[key] = defaultValue.call(
                  null,
                  props
                );
                reset();
              }
            } else {
              value = defaultValue;
            }
          }
          if (opt[
            0
            /* shouldCast */
          ]) {
            if (isAbsent && !hasDefault) {
              value = false;
            } else if (opt[
              1
              /* shouldCastTrue */
            ] && (value === "" || value === hyphenate(key))) {
              value = true;
            }
          }
        }
        return value;
      }
      function normalizePropsOptions(comp, appContext, asMixin = false) {
        const cache2 = appContext.propsCache;
        const cached = cache2.get(comp);
        if (cached) {
          return cached;
        }
        const raw = comp.props;
        const normalized = {};
        const needCastKeys = [];
        let hasExtends = false;
        if (!isFunction$1(comp)) {
          const extendProps = (raw2) => {
            hasExtends = true;
            const [props, keys] = normalizePropsOptions(raw2, appContext, true);
            extend(normalized, props);
            if (keys)
              needCastKeys.push(...keys);
          };
          if (!asMixin && appContext.mixins.length) {
            appContext.mixins.forEach(extendProps);
          }
          if (comp.extends) {
            extendProps(comp.extends);
          }
          if (comp.mixins) {
            comp.mixins.forEach(extendProps);
          }
        }
        if (!raw && !hasExtends) {
          if (isObject$1(comp)) {
            cache2.set(comp, EMPTY_ARR);
          }
          return EMPTY_ARR;
        }
        if (isArray$1(raw)) {
          for (let i = 0; i < raw.length; i++) {
            const normalizedKey = camelize(raw[i]);
            if (validatePropName(normalizedKey)) {
              normalized[normalizedKey] = EMPTY_OBJ;
            }
          }
        } else if (raw) {
          for (const key in raw) {
            const normalizedKey = camelize(key);
            if (validatePropName(normalizedKey)) {
              const opt = raw[key];
              const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
              if (prop) {
                const booleanIndex = getTypeIndex(Boolean, prop.type);
                const stringIndex = getTypeIndex(String, prop.type);
                prop[
                  0
                  /* shouldCast */
                ] = booleanIndex > -1;
                prop[
                  1
                  /* shouldCastTrue */
                ] = stringIndex < 0 || booleanIndex < stringIndex;
                if (booleanIndex > -1 || hasOwn(prop, "default")) {
                  needCastKeys.push(normalizedKey);
                }
              }
            }
          }
        }
        const res = [normalized, needCastKeys];
        if (isObject$1(comp)) {
          cache2.set(comp, res);
        }
        return res;
      }
      function validatePropName(key) {
        if (key[0] !== "$" && !isReservedProp(key)) {
          return true;
        }
        return false;
      }
      function getType(ctor) {
        if (ctor === null) {
          return "null";
        }
        if (typeof ctor === "function") {
          return ctor.name || "";
        } else if (typeof ctor === "object") {
          const name = ctor.constructor && ctor.constructor.name;
          return name || "";
        }
        return "";
      }
      function isSameType(a, b) {
        return getType(a) === getType(b);
      }
      function getTypeIndex(type, expectedTypes) {
        if (isArray$1(expectedTypes)) {
          return expectedTypes.findIndex((t) => isSameType(t, type));
        } else if (isFunction$1(expectedTypes)) {
          return isSameType(expectedTypes, type) ? 0 : -1;
        }
        return -1;
      }
      const isInternalKey = (key) => key[0] === "_" || key === "$stable";
      const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
      const normalizeSlot = (key, rawSlot, ctx2) => {
        if (rawSlot._n) {
          return rawSlot;
        }
        const normalized = withCtx((...args) => {
          if (false)
            ;
          return normalizeSlotValue(rawSlot(...args));
        }, ctx2);
        normalized._c = false;
        return normalized;
      };
      const normalizeObjectSlots = (rawSlots, slots, instance) => {
        const ctx2 = rawSlots._ctx;
        for (const key in rawSlots) {
          if (isInternalKey(key))
            continue;
          const value = rawSlots[key];
          if (isFunction$1(value)) {
            slots[key] = normalizeSlot(key, value, ctx2);
          } else if (value != null) {
            const normalized = normalizeSlotValue(value);
            slots[key] = () => normalized;
          }
        }
      };
      const normalizeVNodeSlots = (instance, children) => {
        const normalized = normalizeSlotValue(children);
        instance.slots.default = () => normalized;
      };
      const initSlots = (instance, children) => {
        if (instance.vnode.shapeFlag & 32) {
          const type = children._;
          if (type) {
            instance.slots = toRaw(children);
            def(children, "_", type);
          } else {
            normalizeObjectSlots(
              children,
              instance.slots = {}
            );
          }
        } else {
          instance.slots = {};
          if (children) {
            normalizeVNodeSlots(instance, children);
          }
        }
        def(instance.slots, InternalObjectKey, 1);
      };
      const updateSlots = (instance, children, optimized) => {
        const { vnode, slots } = instance;
        let needDeletionCheck = true;
        let deletionComparisonTarget = EMPTY_OBJ;
        if (vnode.shapeFlag & 32) {
          const type = children._;
          if (type) {
            if (optimized && type === 1) {
              needDeletionCheck = false;
            } else {
              extend(slots, children);
              if (!optimized && type === 1) {
                delete slots._;
              }
            }
          } else {
            needDeletionCheck = !children.$stable;
            normalizeObjectSlots(children, slots);
          }
          deletionComparisonTarget = children;
        } else if (children) {
          normalizeVNodeSlots(instance, children);
          deletionComparisonTarget = { default: 1 };
        }
        if (needDeletionCheck) {
          for (const key in slots) {
            if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
              delete slots[key];
            }
          }
        }
      };
      function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
        if (isArray$1(rawRef)) {
          rawRef.forEach(
            (r, i) => setRef(
              r,
              oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
              parentSuspense,
              vnode,
              isUnmount
            )
          );
          return;
        }
        if (isAsyncWrapper(vnode) && !isUnmount) {
          return;
        }
        const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
        const value = isUnmount ? null : refValue;
        const { i: owner, r: ref3 } = rawRef;
        const oldRef = oldRawRef && oldRawRef.r;
        const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
        const setupState = owner.setupState;
        if (oldRef != null && oldRef !== ref3) {
          if (isString(oldRef)) {
            refs[oldRef] = null;
            if (hasOwn(setupState, oldRef)) {
              setupState[oldRef] = null;
            }
          } else if (isRef(oldRef)) {
            oldRef.value = null;
          }
        }
        if (isFunction$1(ref3)) {
          callWithErrorHandling(ref3, owner, 12, [value, refs]);
        } else {
          const _isString = isString(ref3);
          const _isRef = isRef(ref3);
          if (_isString || _isRef) {
            const doSet = () => {
              if (rawRef.f) {
                const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
                if (isUnmount) {
                  isArray$1(existing) && remove(existing, refValue);
                } else {
                  if (!isArray$1(existing)) {
                    if (_isString) {
                      refs[ref3] = [refValue];
                      if (hasOwn(setupState, ref3)) {
                        setupState[ref3] = refs[ref3];
                      }
                    } else {
                      ref3.value = [refValue];
                      if (rawRef.k)
                        refs[rawRef.k] = ref3.value;
                    }
                  } else if (!existing.includes(refValue)) {
                    existing.push(refValue);
                  }
                }
              } else if (_isString) {
                refs[ref3] = value;
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = value;
                }
              } else if (_isRef) {
                ref3.value = value;
                if (rawRef.k)
                  refs[rawRef.k] = value;
              } else
                ;
            };
            if (value) {
              doSet.id = -1;
              queuePostRenderEffect(doSet, parentSuspense);
            } else {
              doSet();
            }
          }
        }
      }
      const queuePostRenderEffect = queueEffectWithSuspense;
      function createRenderer(options) {
        return baseCreateRenderer(options);
      }
      function baseCreateRenderer(options, createHydrationFns) {
        const target = getGlobalThis();
        target.__VUE__ = true;
        const {
          insert: hostInsert,
          remove: hostRemove,
          patchProp: hostPatchProp,
          createElement: hostCreateElement,
          createText: hostCreateText,
          createComment: hostCreateComment,
          setText: hostSetText,
          setElementText: hostSetElementText,
          parentNode: hostParentNode,
          nextSibling: hostNextSibling,
          setScopeId: hostSetScopeId = NOOP,
          insertStaticContent: hostInsertStaticContent
        } = options;
        const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace2 = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
          if (n1 === n2) {
            return;
          }
          if (n1 && !isSameVNodeType(n1, n2)) {
            anchor = getNextHostNode(n1);
            unmount2(n1, parentComponent, parentSuspense, true);
            n1 = null;
          }
          if (n2.patchFlag === -2) {
            optimized = false;
            n2.dynamicChildren = null;
          }
          const { type, ref: ref3, shapeFlag } = n2;
          switch (type) {
            case Text:
              processText(n1, n2, container, anchor);
              break;
            case Comment:
              processCommentNode(n1, n2, container, anchor);
              break;
            case Static:
              if (n1 == null) {
                mountStaticNode(n2, container, anchor, namespace2);
              }
              break;
            case Fragment:
              processFragment(
                n1,
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                optimized
              );
              break;
            default:
              if (shapeFlag & 1) {
                processElement(
                  n1,
                  n2,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
              } else if (shapeFlag & 6) {
                processComponent(
                  n1,
                  n2,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
              } else if (shapeFlag & 64) {
                type.process(
                  n1,
                  n2,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized,
                  internals
                );
              } else if (shapeFlag & 128) {
                type.process(
                  n1,
                  n2,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized,
                  internals
                );
              } else
                ;
          }
          if (ref3 != null && parentComponent) {
            setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
          }
        };
        const processText = (n1, n2, container, anchor) => {
          if (n1 == null) {
            hostInsert(
              n2.el = hostCreateText(n2.children),
              container,
              anchor
            );
          } else {
            const el = n2.el = n1.el;
            if (n2.children !== n1.children) {
              hostSetText(el, n2.children);
            }
          }
        };
        const processCommentNode = (n1, n2, container, anchor) => {
          if (n1 == null) {
            hostInsert(
              n2.el = hostCreateComment(n2.children || ""),
              container,
              anchor
            );
          } else {
            n2.el = n1.el;
          }
        };
        const mountStaticNode = (n2, container, anchor, namespace2) => {
          [n2.el, n2.anchor] = hostInsertStaticContent(
            n2.children,
            container,
            anchor,
            namespace2,
            n2.el,
            n2.anchor
          );
        };
        const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
          let next;
          while (el && el !== anchor) {
            next = hostNextSibling(el);
            hostInsert(el, container, nextSibling);
            el = next;
          }
          hostInsert(anchor, container, nextSibling);
        };
        const removeStaticNode = ({ el, anchor }) => {
          let next;
          while (el && el !== anchor) {
            next = hostNextSibling(el);
            hostRemove(el);
            el = next;
          }
          hostRemove(anchor);
        };
        const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          if (n2.type === "svg") {
            namespace2 = "svg";
          } else if (n2.type === "math") {
            namespace2 = "mathml";
          }
          if (n1 == null) {
            mountElement(
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          } else {
            patchElement(
              n1,
              n2,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          }
        };
        const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          let el;
          let vnodeHook;
          const { props, shapeFlag, transition, dirs } = vnode;
          el = vnode.el = hostCreateElement(
            vnode.type,
            namespace2,
            props && props.is,
            props
          );
          if (shapeFlag & 8) {
            hostSetElementText(el, vnode.children);
          } else if (shapeFlag & 16) {
            mountChildren(
              vnode.children,
              el,
              null,
              parentComponent,
              parentSuspense,
              resolveChildrenNamespace(vnode, namespace2),
              slotScopeIds,
              optimized
            );
          }
          if (dirs) {
            invokeDirectiveHook(vnode, null, parentComponent, "created");
          }
          setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
          if (props) {
            for (const key in props) {
              if (key !== "value" && !isReservedProp(key)) {
                hostPatchProp(
                  el,
                  key,
                  null,
                  props[key],
                  namespace2,
                  vnode.children,
                  parentComponent,
                  parentSuspense,
                  unmountChildren
                );
              }
            }
            if ("value" in props) {
              hostPatchProp(el, "value", null, props.value, namespace2);
            }
            if (vnodeHook = props.onVnodeBeforeMount) {
              invokeVNodeHook(vnodeHook, parentComponent, vnode);
            }
          }
          if (dirs) {
            invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
          }
          const needCallTransitionHooks = needTransition(parentSuspense, transition);
          if (needCallTransitionHooks) {
            transition.beforeEnter(el);
          }
          hostInsert(el, container, anchor);
          if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
            queuePostRenderEffect(() => {
              vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
              needCallTransitionHooks && transition.enter(el);
              dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
            }, parentSuspense);
          }
        };
        const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
          if (scopeId) {
            hostSetScopeId(el, scopeId);
          }
          if (slotScopeIds) {
            for (let i = 0; i < slotScopeIds.length; i++) {
              hostSetScopeId(el, slotScopeIds[i]);
            }
          }
          if (parentComponent) {
            let subTree = parentComponent.subTree;
            if (vnode === subTree) {
              const parentVNode = parentComponent.vnode;
              setScopeId(
                el,
                parentVNode,
                parentVNode.scopeId,
                parentVNode.slotScopeIds,
                parentComponent.parent
              );
            }
          }
        };
        const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized, start = 0) => {
          for (let i = start; i < children.length; i++) {
            const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
            patch(
              null,
              child,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          }
        };
        const patchElement = (n1, n2, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          const el = n2.el = n1.el;
          let { patchFlag, dynamicChildren, dirs } = n2;
          patchFlag |= n1.patchFlag & 16;
          const oldProps = n1.props || EMPTY_OBJ;
          const newProps = n2.props || EMPTY_OBJ;
          let vnodeHook;
          parentComponent && toggleRecurse(parentComponent, false);
          if (vnodeHook = newProps.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          }
          if (dirs) {
            invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
          }
          parentComponent && toggleRecurse(parentComponent, true);
          if (dynamicChildren) {
            patchBlockChildren(
              n1.dynamicChildren,
              dynamicChildren,
              el,
              parentComponent,
              parentSuspense,
              resolveChildrenNamespace(n2, namespace2),
              slotScopeIds
            );
          } else if (!optimized) {
            patchChildren(
              n1,
              n2,
              el,
              null,
              parentComponent,
              parentSuspense,
              resolveChildrenNamespace(n2, namespace2),
              slotScopeIds,
              false
            );
          }
          if (patchFlag > 0) {
            if (patchFlag & 16) {
              patchProps(
                el,
                n2,
                oldProps,
                newProps,
                parentComponent,
                parentSuspense,
                namespace2
              );
            } else {
              if (patchFlag & 2) {
                if (oldProps.class !== newProps.class) {
                  hostPatchProp(el, "class", null, newProps.class, namespace2);
                }
              }
              if (patchFlag & 4) {
                hostPatchProp(el, "style", oldProps.style, newProps.style, namespace2);
              }
              if (patchFlag & 8) {
                const propsToUpdate = n2.dynamicProps;
                for (let i = 0; i < propsToUpdate.length; i++) {
                  const key = propsToUpdate[i];
                  const prev = oldProps[key];
                  const next = newProps[key];
                  if (next !== prev || key === "value") {
                    hostPatchProp(
                      el,
                      key,
                      prev,
                      next,
                      namespace2,
                      n1.children,
                      parentComponent,
                      parentSuspense,
                      unmountChildren
                    );
                  }
                }
              }
            }
            if (patchFlag & 1) {
              if (n1.children !== n2.children) {
                hostSetElementText(el, n2.children);
              }
            }
          } else if (!optimized && dynamicChildren == null) {
            patchProps(
              el,
              n2,
              oldProps,
              newProps,
              parentComponent,
              parentSuspense,
              namespace2
            );
          }
          if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
            queuePostRenderEffect(() => {
              vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
              dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
            }, parentSuspense);
          }
        };
        const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace2, slotScopeIds) => {
          for (let i = 0; i < newChildren.length; i++) {
            const oldVNode = oldChildren[i];
            const newVNode = newChildren[i];
            const container = (
              // oldVNode may be an errored async setup() component inside Suspense
              // which will not have a mounted element
              oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
              // of the Fragment itself so it can move its children.
              (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
              // which also requires the correct parent container
              !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
              oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
                // In other cases, the parent container is not actually used so we
                // just pass the block element here to avoid a DOM parentNode call.
                fallbackContainer
              )
            );
            patch(
              oldVNode,
              newVNode,
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              true
            );
          }
        };
        const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace2) => {
          if (oldProps !== newProps) {
            if (oldProps !== EMPTY_OBJ) {
              for (const key in oldProps) {
                if (!isReservedProp(key) && !(key in newProps)) {
                  hostPatchProp(
                    el,
                    key,
                    oldProps[key],
                    null,
                    namespace2,
                    vnode.children,
                    parentComponent,
                    parentSuspense,
                    unmountChildren
                  );
                }
              }
            }
            for (const key in newProps) {
              if (isReservedProp(key))
                continue;
              const next = newProps[key];
              const prev = oldProps[key];
              if (next !== prev && key !== "value") {
                hostPatchProp(
                  el,
                  key,
                  prev,
                  next,
                  namespace2,
                  vnode.children,
                  parentComponent,
                  parentSuspense,
                  unmountChildren
                );
              }
            }
            if ("value" in newProps) {
              hostPatchProp(el, "value", oldProps.value, newProps.value, namespace2);
            }
          }
        };
        const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
          const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
          let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
          if (fragmentSlotScopeIds) {
            slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
          }
          if (n1 == null) {
            hostInsert(fragmentStartAnchor, container, anchor);
            hostInsert(fragmentEndAnchor, container, anchor);
            mountChildren(
              // #10007
              // such fragment like `<></>` will be compiled into
              // a fragment which doesn't have a children.
              // In this case fallback to an empty array
              n2.children || [],
              container,
              fragmentEndAnchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          } else {
            if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
            // of renderSlot() with no valid children
            n1.dynamicChildren) {
              patchBlockChildren(
                n1.dynamicChildren,
                dynamicChildren,
                container,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds
              );
              if (
                // #2080 if the stable fragment has a key, it's a <template v-for> that may
                //  get moved around. Make sure all root level vnodes inherit el.
                // #2134 or if it's a component root, it may also get moved around
                // as the component is being moved.
                n2.key != null || parentComponent && n2 === parentComponent.subTree
              ) {
                traverseStaticChildren(
                  n1,
                  n2,
                  true
                  /* shallow */
                );
              }
            } else {
              patchChildren(
                n1,
                n2,
                container,
                fragmentEndAnchor,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                optimized
              );
            }
          }
        };
        const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          n2.slotScopeIds = slotScopeIds;
          if (n1 == null) {
            if (n2.shapeFlag & 512) {
              parentComponent.ctx.activate(
                n2,
                container,
                anchor,
                namespace2,
                optimized
              );
            } else {
              mountComponent(
                n2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace2,
                optimized
              );
            }
          } else {
            updateComponent(n1, n2, optimized);
          }
        };
        const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace2, optimized) => {
          const instance = initialVNode.component = createComponentInstance(
            initialVNode,
            parentComponent,
            parentSuspense
          );
          if (isKeepAlive(initialVNode)) {
            instance.ctx.renderer = internals;
          }
          {
            setupComponent(instance);
          }
          if (instance.asyncDep) {
            parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
            if (!initialVNode.el) {
              const placeholder = instance.subTree = createVNode(Comment);
              processCommentNode(null, placeholder, container, anchor);
            }
          } else {
            setupRenderEffect(
              instance,
              initialVNode,
              container,
              anchor,
              parentSuspense,
              namespace2,
              optimized
            );
          }
        };
        const updateComponent = (n1, n2, optimized) => {
          const instance = n2.component = n1.component;
          if (shouldUpdateComponent(n1, n2, optimized)) {
            if (instance.asyncDep && !instance.asyncResolved) {
              updateComponentPreRender(instance, n2, optimized);
              return;
            } else {
              instance.next = n2;
              invalidateJob(instance.update);
              instance.effect.dirty = true;
              instance.update();
            }
          } else {
            n2.el = n1.el;
            instance.vnode = n2;
          }
        };
        const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace2, optimized) => {
          const componentUpdateFn = () => {
            if (!instance.isMounted) {
              let vnodeHook;
              const { el, props } = initialVNode;
              const { bm, m, parent } = instance;
              const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
              toggleRecurse(instance, false);
              if (bm) {
                invokeArrayFns(bm);
              }
              if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
                invokeVNodeHook(vnodeHook, parent, initialVNode);
              }
              toggleRecurse(instance, true);
              if (el && hydrateNode) {
                const hydrateSubTree = () => {
                  instance.subTree = renderComponentRoot(instance);
                  hydrateNode(
                    el,
                    instance.subTree,
                    instance,
                    parentSuspense,
                    null
                  );
                };
                if (isAsyncWrapperVNode) {
                  initialVNode.type.__asyncLoader().then(
                    // note: we are moving the render call into an async callback,
                    // which means it won't track dependencies - but it's ok because
                    // a server-rendered async wrapper is already in resolved state
                    // and it will never need to change.
                    () => !instance.isUnmounted && hydrateSubTree()
                  );
                } else {
                  hydrateSubTree();
                }
              } else {
                const subTree = instance.subTree = renderComponentRoot(instance);
                patch(
                  null,
                  subTree,
                  container,
                  anchor,
                  instance,
                  parentSuspense,
                  namespace2
                );
                initialVNode.el = subTree.el;
              }
              if (m) {
                queuePostRenderEffect(m, parentSuspense);
              }
              if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
                const scopedInitialVNode = initialVNode;
                queuePostRenderEffect(
                  () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
                  parentSuspense
                );
              }
              if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
                instance.a && queuePostRenderEffect(instance.a, parentSuspense);
              }
              instance.isMounted = true;
              initialVNode = container = anchor = null;
            } else {
              let { next, bu, u, parent, vnode } = instance;
              {
                const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
                if (nonHydratedAsyncRoot) {
                  if (next) {
                    next.el = vnode.el;
                    updateComponentPreRender(instance, next, optimized);
                  }
                  nonHydratedAsyncRoot.asyncDep.then(() => {
                    if (!instance.isUnmounted) {
                      componentUpdateFn();
                    }
                  });
                  return;
                }
              }
              let originNext = next;
              let vnodeHook;
              toggleRecurse(instance, false);
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              } else {
                next = vnode;
              }
              if (bu) {
                invokeArrayFns(bu);
              }
              if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
                invokeVNodeHook(vnodeHook, parent, next, vnode);
              }
              toggleRecurse(instance, true);
              const nextTree = renderComponentRoot(instance);
              const prevTree = instance.subTree;
              instance.subTree = nextTree;
              patch(
                prevTree,
                nextTree,
                // parent may have changed if it's in a teleport
                hostParentNode(prevTree.el),
                // anchor may have changed if it's in a fragment
                getNextHostNode(prevTree),
                instance,
                parentSuspense,
                namespace2
              );
              next.el = nextTree.el;
              if (originNext === null) {
                updateHOCHostEl(instance, nextTree.el);
              }
              if (u) {
                queuePostRenderEffect(u, parentSuspense);
              }
              if (vnodeHook = next.props && next.props.onVnodeUpdated) {
                queuePostRenderEffect(
                  () => invokeVNodeHook(vnodeHook, parent, next, vnode),
                  parentSuspense
                );
              }
            }
          };
          const effect2 = instance.effect = new ReactiveEffect(
            componentUpdateFn,
            NOOP,
            () => queueJob(update),
            instance.scope
            // track it in component's effect scope
          );
          const update = instance.update = () => {
            if (effect2.dirty) {
              effect2.run();
            }
          };
          update.id = instance.uid;
          toggleRecurse(instance, true);
          update();
        };
        const updateComponentPreRender = (instance, nextVNode, optimized) => {
          nextVNode.component = instance;
          const prevProps = instance.vnode.props;
          instance.vnode = nextVNode;
          instance.next = null;
          updateProps(instance, nextVNode.props, prevProps, optimized);
          updateSlots(instance, nextVNode.children, optimized);
          pauseTracking();
          flushPreFlushCbs(instance);
          resetTracking();
        };
        const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized = false) => {
          const c1 = n1 && n1.children;
          const prevShapeFlag = n1 ? n1.shapeFlag : 0;
          const c2 = n2.children;
          const { patchFlag, shapeFlag } = n2;
          if (patchFlag > 0) {
            if (patchFlag & 128) {
              patchKeyedChildren(
                c1,
                c2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                optimized
              );
              return;
            } else if (patchFlag & 256) {
              patchUnkeyedChildren(
                c1,
                c2,
                container,
                anchor,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                optimized
              );
              return;
            }
          }
          if (shapeFlag & 8) {
            if (prevShapeFlag & 16) {
              unmountChildren(c1, parentComponent, parentSuspense);
            }
            if (c2 !== c1) {
              hostSetElementText(container, c2);
            }
          } else {
            if (prevShapeFlag & 16) {
              if (shapeFlag & 16) {
                patchKeyedChildren(
                  c1,
                  c2,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
              } else {
                unmountChildren(c1, parentComponent, parentSuspense, true);
              }
            } else {
              if (prevShapeFlag & 8) {
                hostSetElementText(container, "");
              }
              if (shapeFlag & 16) {
                mountChildren(
                  c2,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
              }
            }
          }
        };
        const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          c1 = c1 || EMPTY_ARR;
          c2 = c2 || EMPTY_ARR;
          const oldLength = c1.length;
          const newLength = c2.length;
          const commonLength = Math.min(oldLength, newLength);
          let i;
          for (i = 0; i < commonLength; i++) {
            const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
            patch(
              c1[i],
              nextChild,
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized
            );
          }
          if (oldLength > newLength) {
            unmountChildren(
              c1,
              parentComponent,
              parentSuspense,
              true,
              false,
              commonLength
            );
          } else {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace2,
              slotScopeIds,
              optimized,
              commonLength
            );
          }
        };
        const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized) => {
          let i = 0;
          const l2 = c2.length;
          let e1 = c1.length - 1;
          let e2 = l2 - 1;
          while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
            if (isSameVNodeType(n1, n2)) {
              patch(
                n1,
                n2,
                container,
                null,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                optimized
              );
            } else {
              break;
            }
            i++;
          }
          while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
            if (isSameVNodeType(n1, n2)) {
              patch(
                n1,
                n2,
                container,
                null,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                optimized
              );
            } else {
              break;
            }
            e1--;
            e2--;
          }
          if (i > e1) {
            if (i <= e2) {
              const nextPos = e2 + 1;
              const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
              while (i <= e2) {
                patch(
                  null,
                  c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
                i++;
              }
            }
          } else if (i > e2) {
            while (i <= e1) {
              unmount2(c1[i], parentComponent, parentSuspense, true);
              i++;
            }
          } else {
            const s1 = i;
            const s2 = i;
            const keyToNewIndexMap = /* @__PURE__ */ new Map();
            for (i = s2; i <= e2; i++) {
              const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
              if (nextChild.key != null) {
                keyToNewIndexMap.set(nextChild.key, i);
              }
            }
            let j;
            let patched = 0;
            const toBePatched = e2 - s2 + 1;
            let moved = false;
            let maxNewIndexSoFar = 0;
            const newIndexToOldIndexMap = new Array(toBePatched);
            for (i = 0; i < toBePatched; i++)
              newIndexToOldIndexMap[i] = 0;
            for (i = s1; i <= e1; i++) {
              const prevChild = c1[i];
              if (patched >= toBePatched) {
                unmount2(prevChild, parentComponent, parentSuspense, true);
                continue;
              }
              let newIndex;
              if (prevChild.key != null) {
                newIndex = keyToNewIndexMap.get(prevChild.key);
              } else {
                for (j = s2; j <= e2; j++) {
                  if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                    newIndex = j;
                    break;
                  }
                }
              }
              if (newIndex === void 0) {
                unmount2(prevChild, parentComponent, parentSuspense, true);
              } else {
                newIndexToOldIndexMap[newIndex - s2] = i + 1;
                if (newIndex >= maxNewIndexSoFar) {
                  maxNewIndexSoFar = newIndex;
                } else {
                  moved = true;
                }
                patch(
                  prevChild,
                  c2[newIndex],
                  container,
                  null,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
                patched++;
              }
            }
            const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
            j = increasingNewIndexSequence.length - 1;
            for (i = toBePatched - 1; i >= 0; i--) {
              const nextIndex = s2 + i;
              const nextChild = c2[nextIndex];
              const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
              if (newIndexToOldIndexMap[i] === 0) {
                patch(
                  null,
                  nextChild,
                  container,
                  anchor,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
              } else if (moved) {
                if (j < 0 || i !== increasingNewIndexSequence[j]) {
                  move(nextChild, container, anchor, 2);
                } else {
                  j--;
                }
              }
            }
          }
        };
        const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
          const { el, type, transition, children, shapeFlag } = vnode;
          if (shapeFlag & 6) {
            move(vnode.component.subTree, container, anchor, moveType);
            return;
          }
          if (shapeFlag & 128) {
            vnode.suspense.move(container, anchor, moveType);
            return;
          }
          if (shapeFlag & 64) {
            type.move(vnode, container, anchor, internals);
            return;
          }
          if (type === Fragment) {
            hostInsert(el, container, anchor);
            for (let i = 0; i < children.length; i++) {
              move(children[i], container, anchor, moveType);
            }
            hostInsert(vnode.anchor, container, anchor);
            return;
          }
          if (type === Static) {
            moveStaticNode(vnode, container, anchor);
            return;
          }
          const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
          if (needTransition2) {
            if (moveType === 0) {
              transition.beforeEnter(el);
              hostInsert(el, container, anchor);
              queuePostRenderEffect(() => transition.enter(el), parentSuspense);
            } else {
              const { leave, delayLeave, afterLeave } = transition;
              const remove22 = () => hostInsert(el, container, anchor);
              const performLeave = () => {
                leave(el, () => {
                  remove22();
                  afterLeave && afterLeave();
                });
              };
              if (delayLeave) {
                delayLeave(el, remove22, performLeave);
              } else {
                performLeave();
              }
            }
          } else {
            hostInsert(el, container, anchor);
          }
        };
        const unmount2 = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
          const {
            type,
            props,
            ref: ref3,
            children,
            dynamicChildren,
            shapeFlag,
            patchFlag,
            dirs
          } = vnode;
          if (ref3 != null) {
            setRef(ref3, null, parentSuspense, vnode, true);
          }
          if (shapeFlag & 256) {
            parentComponent.ctx.deactivate(vnode);
            return;
          }
          const shouldInvokeDirs = shapeFlag & 1 && dirs;
          const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
          let vnodeHook;
          if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
          if (shapeFlag & 6) {
            unmountComponent(vnode.component, parentSuspense, doRemove);
          } else {
            if (shapeFlag & 128) {
              vnode.suspense.unmount(parentSuspense, doRemove);
              return;
            }
            if (shouldInvokeDirs) {
              invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
            }
            if (shapeFlag & 64) {
              vnode.type.remove(
                vnode,
                parentComponent,
                parentSuspense,
                optimized,
                internals,
                doRemove
              );
            } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
            (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
              unmountChildren(
                dynamicChildren,
                parentComponent,
                parentSuspense,
                false,
                true
              );
            } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
              unmountChildren(children, parentComponent, parentSuspense);
            }
            if (doRemove) {
              remove2(vnode);
            }
          }
          if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
            queuePostRenderEffect(() => {
              vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
              shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
            }, parentSuspense);
          }
        };
        const remove2 = (vnode) => {
          const { type, el, anchor, transition } = vnode;
          if (type === Fragment) {
            {
              removeFragment(el, anchor);
            }
            return;
          }
          if (type === Static) {
            removeStaticNode(vnode);
            return;
          }
          const performRemove = () => {
            hostRemove(el);
            if (transition && !transition.persisted && transition.afterLeave) {
              transition.afterLeave();
            }
          };
          if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
            const { leave, delayLeave } = transition;
            const performLeave = () => leave(el, performRemove);
            if (delayLeave) {
              delayLeave(vnode.el, performRemove, performLeave);
            } else {
              performLeave();
            }
          } else {
            performRemove();
          }
        };
        const removeFragment = (cur, end) => {
          let next;
          while (cur !== end) {
            next = hostNextSibling(cur);
            hostRemove(cur);
            cur = next;
          }
          hostRemove(end);
        };
        const unmountComponent = (instance, parentSuspense, doRemove) => {
          const { bum, scope, update, subTree, um } = instance;
          if (bum) {
            invokeArrayFns(bum);
          }
          scope.stop();
          if (update) {
            update.active = false;
            unmount2(subTree, instance, parentSuspense, doRemove);
          }
          if (um) {
            queuePostRenderEffect(um, parentSuspense);
          }
          queuePostRenderEffect(() => {
            instance.isUnmounted = true;
          }, parentSuspense);
          if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0) {
              parentSuspense.resolve();
            }
          }
        };
        const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
          for (let i = start; i < children.length; i++) {
            unmount2(children[i], parentComponent, parentSuspense, doRemove, optimized);
          }
        };
        const getNextHostNode = (vnode) => {
          if (vnode.shapeFlag & 6) {
            return getNextHostNode(vnode.component.subTree);
          }
          if (vnode.shapeFlag & 128) {
            return vnode.suspense.next();
          }
          return hostNextSibling(vnode.anchor || vnode.el);
        };
        let isFlushing2 = false;
        const render2 = (vnode, container, namespace2) => {
          if (vnode == null) {
            if (container._vnode) {
              unmount2(container._vnode, null, null, true);
            }
          } else {
            patch(
              container._vnode || null,
              vnode,
              container,
              null,
              null,
              null,
              namespace2
            );
          }
          if (!isFlushing2) {
            isFlushing2 = true;
            flushPreFlushCbs();
            flushPostFlushCbs();
            isFlushing2 = false;
          }
          container._vnode = vnode;
        };
        const internals = {
          p: patch,
          um: unmount2,
          m: move,
          r: remove2,
          mt: mountComponent,
          mc: mountChildren,
          pc: patchChildren,
          pbc: patchBlockChildren,
          n: getNextHostNode,
          o: options
        };
        let hydrate;
        let hydrateNode;
        if (createHydrationFns) {
          [hydrate, hydrateNode] = createHydrationFns(
            internals
          );
        }
        return {
          render: render2,
          hydrate,
          createApp: createAppAPI(render2, hydrate)
        };
      }
      function resolveChildrenNamespace({ type, props }, currentNamespace) {
        return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
      }
      function toggleRecurse({ effect: effect2, update }, allowed) {
        effect2.allowRecurse = update.allowRecurse = allowed;
      }
      function needTransition(parentSuspense, transition) {
        return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
      }
      function traverseStaticChildren(n1, n2, shallow = false) {
        const ch1 = n1.children;
        const ch2 = n2.children;
        if (isArray$1(ch1) && isArray$1(ch2)) {
          for (let i = 0; i < ch1.length; i++) {
            const c1 = ch1[i];
            let c2 = ch2[i];
            if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
              if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
                c2 = ch2[i] = cloneIfMounted(ch2[i]);
                c2.el = c1.el;
              }
              if (!shallow)
                traverseStaticChildren(c1, c2);
            }
            if (c2.type === Text) {
              c2.el = c1.el;
            }
          }
        }
      }
      function getSequence(arr) {
        const p2 = arr.slice();
        const result = [0];
        let i, j, u, v, c2;
        const len2 = arr.length;
        for (i = 0; i < len2; i++) {
          const arrI = arr[i];
          if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
              p2[i] = j;
              result.push(i);
              continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
              c2 = u + v >> 1;
              if (arr[result[c2]] < arrI) {
                u = c2 + 1;
              } else {
                v = c2;
              }
            }
            if (arrI < arr[result[u]]) {
              if (u > 0) {
                p2[i] = result[u - 1];
              }
              result[u] = i;
            }
          }
        }
        u = result.length;
        v = result[u - 1];
        while (u-- > 0) {
          result[u] = v;
          v = p2[v];
        }
        return result;
      }
      function locateNonHydratedAsyncRoot(instance) {
        const subComponent = instance.subTree.component;
        if (subComponent) {
          if (subComponent.asyncDep && !subComponent.asyncResolved) {
            return subComponent;
          } else {
            return locateNonHydratedAsyncRoot(subComponent);
          }
        }
      }
      const isTeleport = (type) => type.__isTeleport;
      const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
      const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
      const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
      const resolveTarget = (props, select) => {
        const targetSelector = props && props.to;
        if (isString(targetSelector)) {
          if (!select) {
            return null;
          } else {
            const target = select(targetSelector);
            return target;
          }
        } else {
          return targetSelector;
        }
      };
      const TeleportImpl = {
        name: "Teleport",
        __isTeleport: true,
        process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace2, slotScopeIds, optimized, internals) {
          const {
            mc: mountChildren,
            pc: patchChildren,
            pbc: patchBlockChildren,
            o: { insert, querySelector, createText, createComment }
          } = internals;
          const disabled = isTeleportDisabled(n2.props);
          let { shapeFlag, children, dynamicChildren } = n2;
          if (n1 == null) {
            const placeholder = n2.el = createText("");
            const mainAnchor = n2.anchor = createText("");
            insert(placeholder, container, anchor);
            insert(mainAnchor, container, anchor);
            const target = n2.target = resolveTarget(n2.props, querySelector);
            const targetAnchor = n2.targetAnchor = createText("");
            if (target) {
              insert(targetAnchor, target);
              if (namespace2 === "svg" || isTargetSVG(target)) {
                namespace2 = "svg";
              } else if (namespace2 === "mathml" || isTargetMathML(target)) {
                namespace2 = "mathml";
              }
            }
            const mount2 = (container2, anchor2) => {
              if (shapeFlag & 16) {
                mountChildren(
                  children,
                  container2,
                  anchor2,
                  parentComponent,
                  parentSuspense,
                  namespace2,
                  slotScopeIds,
                  optimized
                );
              }
            };
            if (disabled) {
              mount2(container, mainAnchor);
            } else if (target) {
              mount2(target, targetAnchor);
            }
          } else {
            n2.el = n1.el;
            const mainAnchor = n2.anchor = n1.anchor;
            const target = n2.target = n1.target;
            const targetAnchor = n2.targetAnchor = n1.targetAnchor;
            const wasDisabled = isTeleportDisabled(n1.props);
            const currentContainer = wasDisabled ? container : target;
            const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
            if (namespace2 === "svg" || isTargetSVG(target)) {
              namespace2 = "svg";
            } else if (namespace2 === "mathml" || isTargetMathML(target)) {
              namespace2 = "mathml";
            }
            if (dynamicChildren) {
              patchBlockChildren(
                n1.dynamicChildren,
                dynamicChildren,
                currentContainer,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds
              );
              traverseStaticChildren(n1, n2, true);
            } else if (!optimized) {
              patchChildren(
                n1,
                n2,
                currentContainer,
                currentAnchor,
                parentComponent,
                parentSuspense,
                namespace2,
                slotScopeIds,
                false
              );
            }
            if (disabled) {
              if (!wasDisabled) {
                moveTeleport(
                  n2,
                  container,
                  mainAnchor,
                  internals,
                  1
                );
              } else {
                if (n2.props && n1.props && n2.props.to !== n1.props.to) {
                  n2.props.to = n1.props.to;
                }
              }
            } else {
              if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
                const nextTarget = n2.target = resolveTarget(
                  n2.props,
                  querySelector
                );
                if (nextTarget) {
                  moveTeleport(
                    n2,
                    nextTarget,
                    null,
                    internals,
                    0
                  );
                }
              } else if (wasDisabled) {
                moveTeleport(
                  n2,
                  target,
                  targetAnchor,
                  internals,
                  1
                );
              }
            }
          }
          updateCssVars(n2);
        },
        remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount2, o: { remove: hostRemove } }, doRemove) {
          const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
          if (target) {
            hostRemove(targetAnchor);
          }
          doRemove && hostRemove(anchor);
          if (shapeFlag & 16) {
            const shouldRemove = doRemove || !isTeleportDisabled(props);
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              unmount2(
                child,
                parentComponent,
                parentSuspense,
                shouldRemove,
                !!child.dynamicChildren
              );
            }
          }
        },
        move: moveTeleport,
        hydrate: hydrateTeleport
      };
      function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
        if (moveType === 0) {
          insert(vnode.targetAnchor, container, parentAnchor);
        }
        const { el, anchor, shapeFlag, children, props } = vnode;
        const isReorder = moveType === 2;
        if (isReorder) {
          insert(el, container, parentAnchor);
        }
        if (!isReorder || isTeleportDisabled(props)) {
          if (shapeFlag & 16) {
            for (let i = 0; i < children.length; i++) {
              move(
                children[i],
                container,
                parentAnchor,
                2
              );
            }
          }
        }
        if (isReorder) {
          insert(anchor, container, parentAnchor);
        }
      }
      function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
        o: { nextSibling, parentNode, querySelector }
      }, hydrateChildren) {
        const target = vnode.target = resolveTarget(
          vnode.props,
          querySelector
        );
        if (target) {
          const targetNode = target._lpa || target.firstChild;
          if (vnode.shapeFlag & 16) {
            if (isTeleportDisabled(vnode.props)) {
              vnode.anchor = hydrateChildren(
                nextSibling(node),
                vnode,
                parentNode(node),
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized
              );
              vnode.targetAnchor = targetNode;
            } else {
              vnode.anchor = nextSibling(node);
              let targetAnchor = targetNode;
              while (targetAnchor) {
                targetAnchor = nextSibling(targetAnchor);
                if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
                  vnode.targetAnchor = targetAnchor;
                  target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
                  break;
                }
              }
              hydrateChildren(
                targetNode,
                vnode,
                target,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized
              );
            }
          }
          updateCssVars(vnode);
        }
        return vnode.anchor && nextSibling(vnode.anchor);
      }
      const Teleport = TeleportImpl;
      function updateCssVars(vnode) {
        const ctx2 = vnode.ctx;
        if (ctx2 && ctx2.ut) {
          let node = vnode.children[0].el;
          while (node && node !== vnode.targetAnchor) {
            if (node.nodeType === 1)
              node.setAttribute("data-v-owner", ctx2.uid);
            node = node.nextSibling;
          }
          ctx2.ut();
        }
      }
      const Fragment = Symbol.for("v-fgt");
      const Text = Symbol.for("v-txt");
      const Comment = Symbol.for("v-cmt");
      const Static = Symbol.for("v-stc");
      const blockStack = [];
      let currentBlock = null;
      function openBlock(disableTracking = false) {
        blockStack.push(currentBlock = disableTracking ? null : []);
      }
      function closeBlock() {
        blockStack.pop();
        currentBlock = blockStack[blockStack.length - 1] || null;
      }
      let isBlockTreeEnabled = 1;
      function setBlockTracking(value) {
        isBlockTreeEnabled += value;
      }
      function setupBlock(vnode) {
        vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
        closeBlock();
        if (isBlockTreeEnabled > 0 && currentBlock) {
          currentBlock.push(vnode);
        }
        return vnode;
      }
      function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
        return setupBlock(
          createBaseVNode(
            type,
            props,
            children,
            patchFlag,
            dynamicProps,
            shapeFlag,
            true
          )
        );
      }
      function createBlock(type, props, children, patchFlag, dynamicProps) {
        return setupBlock(
          createVNode(
            type,
            props,
            children,
            patchFlag,
            dynamicProps,
            true
          )
        );
      }
      function isVNode(value) {
        return value ? value.__v_isVNode === true : false;
      }
      function isSameVNodeType(n1, n2) {
        return n1.type === n2.type && n1.key === n2.key;
      }
      const InternalObjectKey = `__vInternal`;
      const normalizeKey = ({ key }) => key != null ? key : null;
      const normalizeRef = ({
        ref: ref3,
        ref_key,
        ref_for
      }) => {
        if (typeof ref3 === "number") {
          ref3 = "" + ref3;
        }
        return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction$1(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
      };
      function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
        const vnode = {
          __v_isVNode: true,
          __v_skip: true,
          type,
          props,
          key: props && normalizeKey(props),
          ref: props && normalizeRef(props),
          scopeId: currentScopeId,
          slotScopeIds: null,
          children,
          component: null,
          suspense: null,
          ssContent: null,
          ssFallback: null,
          dirs: null,
          transition: null,
          el: null,
          anchor: null,
          target: null,
          targetAnchor: null,
          staticCount: 0,
          shapeFlag,
          patchFlag,
          dynamicProps,
          dynamicChildren: null,
          appContext: null,
          ctx: currentRenderingInstance
        };
        if (needFullChildrenNormalization) {
          normalizeChildren(vnode, children);
          if (shapeFlag & 128) {
            type.normalize(vnode);
          }
        } else if (children) {
          vnode.shapeFlag |= isString(children) ? 8 : 16;
        }
        if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
        !isBlockNode && // has current parent block
        currentBlock && // presence of a patch flag indicates this node needs patching on updates.
        // component nodes also should always be patched, because even if the
        // component doesn't need to update, it needs to persist the instance on to
        // the next vnode so that it can be properly unmounted later.
        (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
        // vnode should not be considered dynamic due to handler caching.
        vnode.patchFlag !== 32) {
          currentBlock.push(vnode);
        }
        return vnode;
      }
      const createVNode = _createVNode;
      function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
        if (!type || type === NULL_DYNAMIC_COMPONENT) {
          type = Comment;
        }
        if (isVNode(type)) {
          const cloned = cloneVNode(
            type,
            props,
            true
            /* mergeRef: true */
          );
          if (children) {
            normalizeChildren(cloned, children);
          }
          if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
            if (cloned.shapeFlag & 6) {
              currentBlock[currentBlock.indexOf(type)] = cloned;
            } else {
              currentBlock.push(cloned);
            }
          }
          cloned.patchFlag |= -2;
          return cloned;
        }
        if (isClassComponent(type)) {
          type = type.__vccOpts;
        }
        if (props) {
          props = guardReactiveProps(props);
          let { class: klass, style: style2 } = props;
          if (klass && !isString(klass)) {
            props.class = normalizeClass(klass);
          }
          if (isObject$1(style2)) {
            if (isProxy(style2) && !isArray$1(style2)) {
              style2 = extend({}, style2);
            }
            props.style = normalizeStyle(style2);
          }
        }
        const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
        return createBaseVNode(
          type,
          props,
          children,
          patchFlag,
          dynamicProps,
          shapeFlag,
          isBlockNode,
          true
        );
      }
      function guardReactiveProps(props) {
        if (!props)
          return null;
        return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
      }
      function cloneVNode(vnode, extraProps, mergeRef = false) {
        const { props, ref: ref3, patchFlag, children } = vnode;
        const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
        const cloned = {
          __v_isVNode: true,
          __v_skip: true,
          type: vnode.type,
          props: mergedProps,
          key: mergedProps && normalizeKey(mergedProps),
          ref: extraProps && extraProps.ref ? (
            // #2078 in the case of <component :is="vnode" ref="extra"/>
            // if the vnode itself already has a ref, cloneVNode will need to merge
            // the refs so the single vnode can be set on multiple refs
            mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
          ) : ref3,
          scopeId: vnode.scopeId,
          slotScopeIds: vnode.slotScopeIds,
          children,
          target: vnode.target,
          targetAnchor: vnode.targetAnchor,
          staticCount: vnode.staticCount,
          shapeFlag: vnode.shapeFlag,
          // if the vnode is cloned with extra props, we can no longer assume its
          // existing patch flag to be reliable and need to add the FULL_PROPS flag.
          // note: preserve flag for fragments since they use the flag for children
          // fast paths only.
          patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
          dynamicProps: vnode.dynamicProps,
          dynamicChildren: vnode.dynamicChildren,
          appContext: vnode.appContext,
          dirs: vnode.dirs,
          transition: vnode.transition,
          // These should technically only be non-null on mounted VNodes. However,
          // they *should* be copied for kept-alive vnodes. So we just always copy
          // them since them being non-null during a mount doesn't affect the logic as
          // they will simply be overwritten.
          component: vnode.component,
          suspense: vnode.suspense,
          ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
          ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
          el: vnode.el,
          anchor: vnode.anchor,
          ctx: vnode.ctx,
          ce: vnode.ce
        };
        return cloned;
      }
      function createTextVNode(text = " ", flag = 0) {
        return createVNode(Text, null, text, flag);
      }
      function createStaticVNode(content, numberOfNodes) {
        const vnode = createVNode(Static, null, content);
        vnode.staticCount = numberOfNodes;
        return vnode;
      }
      function normalizeVNode(child) {
        if (child == null || typeof child === "boolean") {
          return createVNode(Comment);
        } else if (isArray$1(child)) {
          return createVNode(
            Fragment,
            null,
            // #3666, avoid reference pollution when reusing vnode
            child.slice()
          );
        } else if (typeof child === "object") {
          return cloneIfMounted(child);
        } else {
          return createVNode(Text, null, String(child));
        }
      }
      function cloneIfMounted(child) {
        return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
      }
      function normalizeChildren(vnode, children) {
        let type = 0;
        const { shapeFlag } = vnode;
        if (children == null) {
          children = null;
        } else if (isArray$1(children)) {
          type = 16;
        } else if (typeof children === "object") {
          if (shapeFlag & (1 | 64)) {
            const slot = children.default;
            if (slot) {
              slot._c && (slot._d = false);
              normalizeChildren(vnode, slot());
              slot._c && (slot._d = true);
            }
            return;
          } else {
            type = 32;
            const slotFlag = children._;
            if (!slotFlag && !(InternalObjectKey in children)) {
              children._ctx = currentRenderingInstance;
            } else if (slotFlag === 3 && currentRenderingInstance) {
              if (currentRenderingInstance.slots._ === 1) {
                children._ = 1;
              } else {
                children._ = 2;
                vnode.patchFlag |= 1024;
              }
            }
          }
        } else if (isFunction$1(children)) {
          children = { default: children, _ctx: currentRenderingInstance };
          type = 32;
        } else {
          children = String(children);
          if (shapeFlag & 64) {
            type = 16;
            children = [createTextVNode(children)];
          } else {
            type = 8;
          }
        }
        vnode.children = children;
        vnode.shapeFlag |= type;
      }
      function mergeProps(...args) {
        const ret = {};
        for (let i = 0; i < args.length; i++) {
          const toMerge = args[i];
          for (const key in toMerge) {
            if (key === "class") {
              if (ret.class !== toMerge.class) {
                ret.class = normalizeClass([ret.class, toMerge.class]);
              }
            } else if (key === "style") {
              ret.style = normalizeStyle([ret.style, toMerge.style]);
            } else if (isOn(key)) {
              const existing = ret[key];
              const incoming = toMerge[key];
              if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
                ret[key] = existing ? [].concat(existing, incoming) : incoming;
              }
            } else if (key !== "") {
              ret[key] = toMerge[key];
            }
          }
        }
        return ret;
      }
      function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
        callWithAsyncErrorHandling(hook, instance, 7, [
          vnode,
          prevVNode
        ]);
      }
      const emptyAppContext = createAppContext();
      let uid = 0;
      function createComponentInstance(vnode, parent, suspense) {
        const type = vnode.type;
        const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
        const instance = {
          uid: uid++,
          vnode,
          type,
          parent,
          appContext,
          root: null,
          // to be immediately set
          next: null,
          subTree: null,
          // will be set synchronously right after creation
          effect: null,
          update: null,
          // will be set synchronously right after creation
          scope: new EffectScope(
            true
            /* detached */
          ),
          render: null,
          proxy: null,
          exposed: null,
          exposeProxy: null,
          withProxy: null,
          provides: parent ? parent.provides : Object.create(appContext.provides),
          accessCache: null,
          renderCache: [],
          // local resolved assets
          components: null,
          directives: null,
          // resolved props and emits options
          propsOptions: normalizePropsOptions(type, appContext),
          emitsOptions: normalizeEmitsOptions(type, appContext),
          // emit
          emit: null,
          // to be set immediately
          emitted: null,
          // props default value
          propsDefaults: EMPTY_OBJ,
          // inheritAttrs
          inheritAttrs: type.inheritAttrs,
          // state
          ctx: EMPTY_OBJ,
          data: EMPTY_OBJ,
          props: EMPTY_OBJ,
          attrs: EMPTY_OBJ,
          slots: EMPTY_OBJ,
          refs: EMPTY_OBJ,
          setupState: EMPTY_OBJ,
          setupContext: null,
          attrsProxy: null,
          slotsProxy: null,
          // suspense related
          suspense,
          suspenseId: suspense ? suspense.pendingId : 0,
          asyncDep: null,
          asyncResolved: false,
          // lifecycle hooks
          // not using enums here because it results in computed properties
          isMounted: false,
          isUnmounted: false,
          isDeactivated: false,
          bc: null,
          c: null,
          bm: null,
          m: null,
          bu: null,
          u: null,
          um: null,
          bum: null,
          da: null,
          a: null,
          rtg: null,
          rtc: null,
          ec: null,
          sp: null
        };
        {
          instance.ctx = { _: instance };
        }
        instance.root = parent ? parent.root : instance;
        instance.emit = emit.bind(null, instance);
        if (vnode.ce) {
          vnode.ce(instance);
        }
        return instance;
      }
      let currentInstance = null;
      const getCurrentInstance = () => currentInstance || currentRenderingInstance;
      let internalSetCurrentInstance;
      let setInSSRSetupState;
      {
        const g = getGlobalThis();
        const registerGlobalSetter = (key, setter) => {
          let setters;
          if (!(setters = g[key]))
            setters = g[key] = [];
          setters.push(setter);
          return (v) => {
            if (setters.length > 1)
              setters.forEach((set2) => set2(v));
            else
              setters[0](v);
          };
        };
        internalSetCurrentInstance = registerGlobalSetter(
          `__VUE_INSTANCE_SETTERS__`,
          (v) => currentInstance = v
        );
        setInSSRSetupState = registerGlobalSetter(
          `__VUE_SSR_SETTERS__`,
          (v) => isInSSRComponentSetup = v
        );
      }
      const setCurrentInstance = (instance) => {
        const prev = currentInstance;
        internalSetCurrentInstance(instance);
        instance.scope.on();
        return () => {
          instance.scope.off();
          internalSetCurrentInstance(prev);
        };
      };
      const unsetCurrentInstance = () => {
        currentInstance && currentInstance.scope.off();
        internalSetCurrentInstance(null);
      };
      function isStatefulComponent(instance) {
        return instance.vnode.shapeFlag & 4;
      }
      let isInSSRComponentSetup = false;
      function setupComponent(instance, isSSR = false) {
        isSSR && setInSSRSetupState(isSSR);
        const { props, children } = instance.vnode;
        const isStateful = isStatefulComponent(instance);
        initProps(instance, props, isStateful, isSSR);
        initSlots(instance, children);
        const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
        isSSR && setInSSRSetupState(false);
        return setupResult;
      }
      function setupStatefulComponent(instance, isSSR) {
        const Component = instance.type;
        instance.accessCache = /* @__PURE__ */ Object.create(null);
        instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
        const { setup } = Component;
        if (setup) {
          const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
          const reset = setCurrentInstance(instance);
          pauseTracking();
          const setupResult = callWithErrorHandling(
            setup,
            instance,
            0,
            [
              instance.props,
              setupContext
            ]
          );
          resetTracking();
          reset();
          if (isPromise(setupResult)) {
            setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
            if (isSSR) {
              return setupResult.then((resolvedResult) => {
                handleSetupResult(instance, resolvedResult, isSSR);
              }).catch((e) => {
                handleError(e, instance, 0);
              });
            } else {
              instance.asyncDep = setupResult;
            }
          } else {
            handleSetupResult(instance, setupResult, isSSR);
          }
        } else {
          finishComponentSetup(instance, isSSR);
        }
      }
      function handleSetupResult(instance, setupResult, isSSR) {
        if (isFunction$1(setupResult)) {
          if (instance.type.__ssrInlineRender) {
            instance.ssrRender = setupResult;
          } else {
            instance.render = setupResult;
          }
        } else if (isObject$1(setupResult)) {
          instance.setupState = proxyRefs(setupResult);
        } else
          ;
        finishComponentSetup(instance, isSSR);
      }
      let compile;
      function finishComponentSetup(instance, isSSR, skipOptions) {
        const Component = instance.type;
        if (!instance.render) {
          if (!isSSR && compile && !Component.render) {
            const template = Component.template || resolveMergedOptions(instance).template;
            if (template) {
              const { isCustomElement, compilerOptions } = instance.appContext.config;
              const { delimiters, compilerOptions: componentCompilerOptions } = Component;
              const finalCompilerOptions = extend(
                extend(
                  {
                    isCustomElement,
                    delimiters
                  },
                  compilerOptions
                ),
                componentCompilerOptions
              );
              Component.render = compile(template, finalCompilerOptions);
            }
          }
          instance.render = Component.render || NOOP;
        }
        {
          const reset = setCurrentInstance(instance);
          pauseTracking();
          try {
            applyOptions(instance);
          } finally {
            resetTracking();
            reset();
          }
        }
      }
      function getAttrsProxy(instance) {
        return instance.attrsProxy || (instance.attrsProxy = new Proxy(
          instance.attrs,
          {
            get(target, key) {
              track(instance, "get", "$attrs");
              return target[key];
            }
          }
        ));
      }
      function createSetupContext(instance) {
        const expose = (exposed) => {
          instance.exposed = exposed || {};
        };
        {
          return {
            get attrs() {
              return getAttrsProxy(instance);
            },
            slots: instance.slots,
            emit: instance.emit,
            expose
          };
        }
      }
      function getExposeProxy(instance) {
        if (instance.exposed) {
          return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
            get(target, key) {
              if (key in target) {
                return target[key];
              } else if (key in publicPropertiesMap) {
                return publicPropertiesMap[key](instance);
              }
            },
            has(target, key) {
              return key in target || key in publicPropertiesMap;
            }
          }));
        }
      }
      const classifyRE = /(?:^|[-_])(\w)/g;
      const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
      function getComponentName(Component, includeInferred = true) {
        return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
      }
      function formatComponentName(instance, Component, isRoot = false) {
        let name = getComponentName(Component);
        if (!name && Component.__file) {
          const match2 = Component.__file.match(/([^/\\]+)\.\w+$/);
          if (match2) {
            name = match2[1];
          }
        }
        if (!name && instance && instance.parent) {
          const inferFromRegistry = (registry) => {
            for (const key in registry) {
              if (registry[key] === Component) {
                return key;
              }
            }
          };
          name = inferFromRegistry(
            instance.components || instance.parent.type.components
          ) || inferFromRegistry(instance.appContext.components);
        }
        return name ? classify(name) : isRoot ? `App` : `Anonymous`;
      }
      function isClassComponent(value) {
        return isFunction$1(value) && "__vccOpts" in value;
      }
      const computed = (getterOrOptions, debugOptions) => {
        const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
        return c2;
      };
      function h(type, propsOrChildren, children) {
        const l = arguments.length;
        if (l === 2) {
          if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
            if (isVNode(propsOrChildren)) {
              return createVNode(type, null, [propsOrChildren]);
            }
            return createVNode(type, propsOrChildren);
          } else {
            return createVNode(type, null, propsOrChildren);
          }
        } else {
          if (l > 3) {
            children = Array.prototype.slice.call(arguments, 2);
          } else if (l === 3 && isVNode(children)) {
            children = [children];
          }
          return createVNode(type, propsOrChildren, children);
        }
      }
      const version = "3.4.21";
      /**
      * @vue/runtime-dom v3.4.21
      * (c) 2018-present Yuxi (Evan) You and Vue contributors
      * @license MIT
      **/
      const svgNS = "http://www.w3.org/2000/svg";
      const mathmlNS = "http://www.w3.org/1998/Math/MathML";
      const doc = typeof document !== "undefined" ? document : null;
      const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
      const nodeOps = {
        insert: (child, parent, anchor) => {
          parent.insertBefore(child, anchor || null);
        },
        remove: (child) => {
          const parent = child.parentNode;
          if (parent) {
            parent.removeChild(child);
          }
        },
        createElement: (tag, namespace2, is, props) => {
          const el = namespace2 === "svg" ? doc.createElementNS(svgNS, tag) : namespace2 === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is ? { is } : void 0);
          if (tag === "select" && props && props.multiple != null) {
            el.setAttribute("multiple", props.multiple);
          }
          return el;
        },
        createText: (text) => doc.createTextNode(text),
        createComment: (text) => doc.createComment(text),
        setText: (node, text) => {
          node.nodeValue = text;
        },
        setElementText: (el, text) => {
          el.textContent = text;
        },
        parentNode: (node) => node.parentNode,
        nextSibling: (node) => node.nextSibling,
        querySelector: (selector) => doc.querySelector(selector),
        setScopeId(el, id) {
          el.setAttribute(id, "");
        },
        // __UNSAFE__
        // Reason: innerHTML.
        // Static content here can only come from compiled templates.
        // As long as the user only uses trusted templates, this is safe.
        insertStaticContent(content, parent, anchor, namespace2, start, end) {
          const before = anchor ? anchor.previousSibling : parent.lastChild;
          if (start && (start === end || start.nextSibling)) {
            while (true) {
              parent.insertBefore(start.cloneNode(true), anchor);
              if (start === end || !(start = start.nextSibling))
                break;
            }
          } else {
            templateContainer.innerHTML = namespace2 === "svg" ? `<svg>${content}</svg>` : namespace2 === "mathml" ? `<math>${content}</math>` : content;
            const template = templateContainer.content;
            if (namespace2 === "svg" || namespace2 === "mathml") {
              const wrapper = template.firstChild;
              while (wrapper.firstChild) {
                template.appendChild(wrapper.firstChild);
              }
              template.removeChild(wrapper);
            }
            parent.insertBefore(template, anchor);
          }
          return [
            // first
            before ? before.nextSibling : parent.firstChild,
            // last
            anchor ? anchor.previousSibling : parent.lastChild
          ];
        }
      };
      const TRANSITION = "transition";
      const ANIMATION = "animation";
      const vtcKey = Symbol("_vtc");
      const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
      Transition.displayName = "Transition";
      const DOMTransitionPropsValidators = {
        name: String,
        type: String,
        css: {
          type: Boolean,
          default: true
        },
        duration: [String, Number, Object],
        enterFromClass: String,
        enterActiveClass: String,
        enterToClass: String,
        appearFromClass: String,
        appearActiveClass: String,
        appearToClass: String,
        leaveFromClass: String,
        leaveActiveClass: String,
        leaveToClass: String
      };
      const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend(
        {},
        BaseTransitionPropsValidators,
        DOMTransitionPropsValidators
      );
      const callHook = (hook, args = []) => {
        if (isArray$1(hook)) {
          hook.forEach((h2) => h2(...args));
        } else if (hook) {
          hook(...args);
        }
      };
      const hasExplicitCallback = (hook) => {
        return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
      };
      function resolveTransitionProps(rawProps) {
        const baseProps = {};
        for (const key in rawProps) {
          if (!(key in DOMTransitionPropsValidators)) {
            baseProps[key] = rawProps[key];
          }
        }
        if (rawProps.css === false) {
          return baseProps;
        }
        const {
          name = "v",
          type,
          duration: duration2,
          enterFromClass = `${name}-enter-from`,
          enterActiveClass = `${name}-enter-active`,
          enterToClass = `${name}-enter-to`,
          appearFromClass = enterFromClass,
          appearActiveClass = enterActiveClass,
          appearToClass = enterToClass,
          leaveFromClass = `${name}-leave-from`,
          leaveActiveClass = `${name}-leave-active`,
          leaveToClass = `${name}-leave-to`
        } = rawProps;
        const durations = normalizeDuration(duration2);
        const enterDuration = durations && durations[0];
        const leaveDuration = durations && durations[1];
        const {
          onBeforeEnter,
          onEnter,
          onEnterCancelled,
          onLeave,
          onLeaveCancelled,
          onBeforeAppear = onBeforeEnter,
          onAppear = onEnter,
          onAppearCancelled = onEnterCancelled
        } = baseProps;
        const finishEnter = (el, isAppear, done) => {
          removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
          removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
          done && done();
        };
        const finishLeave = (el, done) => {
          el._isLeaving = false;
          removeTransitionClass(el, leaveFromClass);
          removeTransitionClass(el, leaveToClass);
          removeTransitionClass(el, leaveActiveClass);
          done && done();
        };
        const makeEnterHook = (isAppear) => {
          return (el, done) => {
            const hook = isAppear ? onAppear : onEnter;
            const resolve = () => finishEnter(el, isAppear, done);
            callHook(hook, [el, resolve]);
            nextFrame(() => {
              removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
              addTransitionClass(el, isAppear ? appearToClass : enterToClass);
              if (!hasExplicitCallback(hook)) {
                whenTransitionEnds(el, type, enterDuration, resolve);
              }
            });
          };
        };
        return extend(baseProps, {
          onBeforeEnter(el) {
            callHook(onBeforeEnter, [el]);
            addTransitionClass(el, enterFromClass);
            addTransitionClass(el, enterActiveClass);
          },
          onBeforeAppear(el) {
            callHook(onBeforeAppear, [el]);
            addTransitionClass(el, appearFromClass);
            addTransitionClass(el, appearActiveClass);
          },
          onEnter: makeEnterHook(false),
          onAppear: makeEnterHook(true),
          onLeave(el, done) {
            el._isLeaving = true;
            const resolve = () => finishLeave(el, done);
            addTransitionClass(el, leaveFromClass);
            forceReflow();
            addTransitionClass(el, leaveActiveClass);
            nextFrame(() => {
              if (!el._isLeaving) {
                return;
              }
              removeTransitionClass(el, leaveFromClass);
              addTransitionClass(el, leaveToClass);
              if (!hasExplicitCallback(onLeave)) {
                whenTransitionEnds(el, type, leaveDuration, resolve);
              }
            });
            callHook(onLeave, [el, resolve]);
          },
          onEnterCancelled(el) {
            finishEnter(el, false);
            callHook(onEnterCancelled, [el]);
          },
          onAppearCancelled(el) {
            finishEnter(el, true);
            callHook(onAppearCancelled, [el]);
          },
          onLeaveCancelled(el) {
            finishLeave(el);
            callHook(onLeaveCancelled, [el]);
          }
        });
      }
      function normalizeDuration(duration2) {
        if (duration2 == null) {
          return null;
        } else if (isObject$1(duration2)) {
          return [NumberOf(duration2.enter), NumberOf(duration2.leave)];
        } else {
          const n = NumberOf(duration2);
          return [n, n];
        }
      }
      function NumberOf(val) {
        const res = toNumber(val);
        return res;
      }
      function addTransitionClass(el, cls) {
        cls.split(/\s+/).forEach((c2) => c2 && el.classList.add(c2));
        (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
      }
      function removeTransitionClass(el, cls) {
        cls.split(/\s+/).forEach((c2) => c2 && el.classList.remove(c2));
        const _vtc = el[vtcKey];
        if (_vtc) {
          _vtc.delete(cls);
          if (!_vtc.size) {
            el[vtcKey] = void 0;
          }
        }
      }
      function nextFrame(cb) {
        requestAnimationFrame(() => {
          requestAnimationFrame(cb);
        });
      }
      let endId = 0;
      function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
        const id = el._endId = ++endId;
        const resolveIfNotStale = () => {
          if (id === el._endId) {
            resolve();
          }
        };
        if (explicitTimeout) {
          return setTimeout(resolveIfNotStale, explicitTimeout);
        }
        const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
        if (!type) {
          return resolve();
        }
        const endEvent = type + "end";
        let ended = 0;
        const end = () => {
          el.removeEventListener(endEvent, onEnd);
          resolveIfNotStale();
        };
        const onEnd = (e) => {
          if (e.target === el && ++ended >= propCount) {
            end();
          }
        };
        setTimeout(() => {
          if (ended < propCount) {
            end();
          }
        }, timeout + 1);
        el.addEventListener(endEvent, onEnd);
      }
      function getTransitionInfo(el, expectedType) {
        const styles = window.getComputedStyle(el);
        const getStyleProperties = (key) => (styles[key] || "").split(", ");
        const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
        const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
        const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
        const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
        const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
        const animationTimeout = getTimeout(animationDelays, animationDurations);
        let type = null;
        let timeout = 0;
        let propCount = 0;
        if (expectedType === TRANSITION) {
          if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
          }
        } else if (expectedType === ANIMATION) {
          if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
          }
        } else {
          timeout = Math.max(transitionTimeout, animationTimeout);
          type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
          propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
        }
        const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
          getStyleProperties(`${TRANSITION}Property`).toString()
        );
        return {
          type,
          timeout,
          propCount,
          hasTransform
        };
      }
      function getTimeout(delays, durations) {
        while (delays.length < durations.length) {
          delays = delays.concat(delays);
        }
        return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
      }
      function toMs(s) {
        if (s === "auto")
          return 0;
        return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
      }
      function forceReflow() {
        return document.body.offsetHeight;
      }
      function patchClass(el, value, isSVG2) {
        const transitionClasses = el[vtcKey];
        if (transitionClasses) {
          value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
        }
        if (value == null) {
          el.removeAttribute("class");
        } else if (isSVG2) {
          el.setAttribute("class", value);
        } else {
          el.className = value;
        }
      }
      const vShowOriginalDisplay = Symbol("_vod");
      const vShowHidden = Symbol("_vsh");
      const vShow = {
        beforeMount(el, { value }, { transition }) {
          el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
          if (transition && value) {
            transition.beforeEnter(el);
          } else {
            setDisplay(el, value);
          }
        },
        mounted(el, { value }, { transition }) {
          if (transition && value) {
            transition.enter(el);
          }
        },
        updated(el, { value, oldValue }, { transition }) {
          if (!value === !oldValue)
            return;
          if (transition) {
            if (value) {
              transition.beforeEnter(el);
              setDisplay(el, true);
              transition.enter(el);
            } else {
              transition.leave(el, () => {
                setDisplay(el, false);
              });
            }
          } else {
            setDisplay(el, value);
          }
        },
        beforeUnmount(el, { value }) {
          setDisplay(el, value);
        }
      };
      function setDisplay(el, value) {
        el.style.display = value ? el[vShowOriginalDisplay] : "none";
        el[vShowHidden] = !value;
      }
      const CSS_VAR_TEXT = Symbol("");
      const displayRE = /(^|;)\s*display\s*:/;
      function patchStyle(el, prev, next) {
        const style2 = el.style;
        const isCssString = isString(next);
        let hasControlledDisplay = false;
        if (next && !isCssString) {
          if (prev) {
            if (!isString(prev)) {
              for (const key in prev) {
                if (next[key] == null) {
                  setStyle(style2, key, "");
                }
              }
            } else {
              for (const prevStyle of prev.split(";")) {
                const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
                if (next[key] == null) {
                  setStyle(style2, key, "");
                }
              }
            }
          }
          for (const key in next) {
            if (key === "display") {
              hasControlledDisplay = true;
            }
            setStyle(style2, key, next[key]);
          }
        } else {
          if (isCssString) {
            if (prev !== next) {
              const cssVarText = style2[CSS_VAR_TEXT];
              if (cssVarText) {
                next += ";" + cssVarText;
              }
              style2.cssText = next;
              hasControlledDisplay = displayRE.test(next);
            }
          } else if (prev) {
            el.removeAttribute("style");
          }
        }
        if (vShowOriginalDisplay in el) {
          el[vShowOriginalDisplay] = hasControlledDisplay ? style2.display : "";
          if (el[vShowHidden]) {
            style2.display = "none";
          }
        }
      }
      const importantRE = /\s*!important$/;
      function setStyle(style2, name, val) {
        if (isArray$1(val)) {
          val.forEach((v) => setStyle(style2, name, v));
        } else {
          if (val == null)
            val = "";
          if (name.startsWith("--")) {
            style2.setProperty(name, val);
          } else {
            const prefixed = autoPrefix(style2, name);
            if (importantRE.test(val)) {
              style2.setProperty(
                hyphenate(prefixed),
                val.replace(importantRE, ""),
                "important"
              );
            } else {
              style2[prefixed] = val;
            }
          }
        }
      }
      const prefixes = ["Webkit", "Moz", "ms"];
      const prefixCache = {};
      function autoPrefix(style2, rawName) {
        const cached = prefixCache[rawName];
        if (cached) {
          return cached;
        }
        let name = camelize(rawName);
        if (name !== "filter" && name in style2) {
          return prefixCache[rawName] = name;
        }
        name = capitalize(name);
        for (let i = 0; i < prefixes.length; i++) {
          const prefixed = prefixes[i] + name;
          if (prefixed in style2) {
            return prefixCache[rawName] = prefixed;
          }
        }
        return rawName;
      }
      const xlinkNS = "http://www.w3.org/1999/xlink";
      function patchAttr(el, key, value, isSVG2, instance) {
        if (isSVG2 && key.startsWith("xlink:")) {
          if (value == null) {
            el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
          } else {
            el.setAttributeNS(xlinkNS, key, value);
          }
        } else {
          const isBoolean = isSpecialBooleanAttr(key);
          if (value == null || isBoolean && !includeBooleanAttr(value)) {
            el.removeAttribute(key);
          } else {
            el.setAttribute(key, isBoolean ? "" : value);
          }
        }
      }
      function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
        if (key === "innerHTML" || key === "textContent") {
          if (prevChildren) {
            unmountChildren(prevChildren, parentComponent, parentSuspense);
          }
          el[key] = value == null ? "" : value;
          return;
        }
        const tag = el.tagName;
        if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
        !tag.includes("-")) {
          const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
          const newValue = value == null ? "" : value;
          if (oldValue !== newValue || !("_value" in el)) {
            el.value = newValue;
          }
          if (value == null) {
            el.removeAttribute(key);
          }
          el._value = value;
          return;
        }
        let needRemove = false;
        if (value === "" || value == null) {
          const type = typeof el[key];
          if (type === "boolean") {
            value = includeBooleanAttr(value);
          } else if (value == null && type === "string") {
            value = "";
            needRemove = true;
          } else if (type === "number") {
            value = 0;
            needRemove = true;
          }
        }
        try {
          el[key] = value;
        } catch (e) {
        }
        needRemove && el.removeAttribute(key);
      }
      function addEventListener(el, event, handler, options) {
        el.addEventListener(event, handler, options);
      }
      function removeEventListener(el, event, handler, options) {
        el.removeEventListener(event, handler, options);
      }
      const veiKey = Symbol("_vei");
      function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
        const invokers = el[veiKey] || (el[veiKey] = {});
        const existingInvoker = invokers[rawName];
        if (nextValue && existingInvoker) {
          existingInvoker.value = nextValue;
        } else {
          const [name, options] = parseName(rawName);
          if (nextValue) {
            const invoker = invokers[rawName] = createInvoker(nextValue, instance);
            addEventListener(el, name, invoker, options);
          } else if (existingInvoker) {
            removeEventListener(el, name, existingInvoker, options);
            invokers[rawName] = void 0;
          }
        }
      }
      const optionsModifierRE = /(?:Once|Passive|Capture)$/;
      function parseName(name) {
        let options;
        if (optionsModifierRE.test(name)) {
          options = {};
          let m;
          while (m = name.match(optionsModifierRE)) {
            name = name.slice(0, name.length - m[0].length);
            options[m[0].toLowerCase()] = true;
          }
        }
        const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
        return [event, options];
      }
      let cachedNow = 0;
      const p = /* @__PURE__ */ Promise.resolve();
      const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
      function createInvoker(initialValue, instance) {
        const invoker = (e) => {
          if (!e._vts) {
            e._vts = Date.now();
          } else if (e._vts <= invoker.attached) {
            return;
          }
          callWithAsyncErrorHandling(
            patchStopImmediatePropagation(e, invoker.value),
            instance,
            5,
            [e]
          );
        };
        invoker.value = initialValue;
        invoker.attached = getNow();
        return invoker;
      }
      function patchStopImmediatePropagation(e, value) {
        if (isArray$1(value)) {
          const originalStop = e.stopImmediatePropagation;
          e.stopImmediatePropagation = () => {
            originalStop.call(e);
            e._stopped = true;
          };
          return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
        } else {
          return value;
        }
      }
      const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
      key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
      const patchProp = (el, key, prevValue, nextValue, namespace2, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
        const isSVG2 = namespace2 === "svg";
        if (key === "class") {
          patchClass(el, nextValue, isSVG2);
        } else if (key === "style") {
          patchStyle(el, prevValue, nextValue);
        } else if (isOn(key)) {
          if (!isModelListener(key)) {
            patchEvent(el, key, prevValue, nextValue, parentComponent);
          }
        } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG2)) {
          patchDOMProp(
            el,
            key,
            nextValue,
            prevChildren,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        } else {
          if (key === "true-value") {
            el._trueValue = nextValue;
          } else if (key === "false-value") {
            el._falseValue = nextValue;
          }
          patchAttr(el, key, nextValue, isSVG2);
        }
      };
      function shouldSetAsProp(el, key, value, isSVG2) {
        if (isSVG2) {
          if (key === "innerHTML" || key === "textContent") {
            return true;
          }
          if (key in el && isNativeOn(key) && isFunction$1(value)) {
            return true;
          }
          return false;
        }
        if (key === "spellcheck" || key === "draggable" || key === "translate") {
          return false;
        }
        if (key === "form") {
          return false;
        }
        if (key === "list" && el.tagName === "INPUT") {
          return false;
        }
        if (key === "type" && el.tagName === "TEXTAREA") {
          return false;
        }
        if (key === "width" || key === "height") {
          const tag = el.tagName;
          if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
            return false;
          }
        }
        if (isNativeOn(key) && isString(value)) {
          return false;
        }
        return key in el;
      }
      const positionMap = /* @__PURE__ */ new WeakMap();
      const newPositionMap = /* @__PURE__ */ new WeakMap();
      const moveCbKey = Symbol("_moveCb");
      const enterCbKey = Symbol("_enterCb");
      const TransitionGroupImpl = {
        name: "TransitionGroup",
        props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
          tag: String,
          moveClass: String
        }),
        setup(props, { slots }) {
          const instance = getCurrentInstance();
          const state = useTransitionState();
          let prevChildren;
          let children;
          onUpdated(() => {
            if (!prevChildren.length) {
              return;
            }
            const moveClass = props.moveClass || `${props.name || "v"}-move`;
            if (!hasCSSTransform(
              prevChildren[0].el,
              instance.vnode.el,
              moveClass
            )) {
              return;
            }
            prevChildren.forEach(callPendingCbs);
            prevChildren.forEach(recordPosition);
            const movedChildren = prevChildren.filter(applyTranslation);
            forceReflow();
            movedChildren.forEach((c2) => {
              const el = c2.el;
              const style2 = el.style;
              addTransitionClass(el, moveClass);
              style2.transform = style2.webkitTransform = style2.transitionDuration = "";
              const cb = el[moveCbKey] = (e) => {
                if (e && e.target !== el) {
                  return;
                }
                if (!e || /transform$/.test(e.propertyName)) {
                  el.removeEventListener("transitionend", cb);
                  el[moveCbKey] = null;
                  removeTransitionClass(el, moveClass);
                }
              };
              el.addEventListener("transitionend", cb);
            });
          });
          return () => {
            const rawProps = toRaw(props);
            const cssTransitionProps = resolveTransitionProps(rawProps);
            let tag = rawProps.tag || Fragment;
            prevChildren = children;
            children = slots.default ? getTransitionRawChildren(slots.default()) : [];
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              if (child.key != null) {
                setTransitionHooks(
                  child,
                  resolveTransitionHooks(child, cssTransitionProps, state, instance)
                );
              }
            }
            if (prevChildren) {
              for (let i = 0; i < prevChildren.length; i++) {
                const child = prevChildren[i];
                setTransitionHooks(
                  child,
                  resolveTransitionHooks(child, cssTransitionProps, state, instance)
                );
                positionMap.set(child, child.el.getBoundingClientRect());
              }
            }
            return createVNode(tag, null, children);
          };
        }
      };
      const removeMode = (props) => delete props.mode;
      /* @__PURE__ */ removeMode(TransitionGroupImpl.props);
      const TransitionGroup = TransitionGroupImpl;
      function callPendingCbs(c2) {
        const el = c2.el;
        if (el[moveCbKey]) {
          el[moveCbKey]();
        }
        if (el[enterCbKey]) {
          el[enterCbKey]();
        }
      }
      function recordPosition(c2) {
        newPositionMap.set(c2, c2.el.getBoundingClientRect());
      }
      function applyTranslation(c2) {
        const oldPos = positionMap.get(c2);
        const newPos = newPositionMap.get(c2);
        const dx = oldPos.left - newPos.left;
        const dy = oldPos.top - newPos.top;
        if (dx || dy) {
          const s = c2.el.style;
          s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
          s.transitionDuration = "0s";
          return c2;
        }
      }
      function hasCSSTransform(el, root2, moveClass) {
        const clone = el.cloneNode();
        const _vtc = el[vtcKey];
        if (_vtc) {
          _vtc.forEach((cls) => {
            cls.split(/\s+/).forEach((c2) => c2 && clone.classList.remove(c2));
          });
        }
        moveClass.split(/\s+/).forEach((c2) => c2 && clone.classList.add(c2));
        clone.style.display = "none";
        const container = root2.nodeType === 1 ? root2 : root2.parentNode;
        container.appendChild(clone);
        const { hasTransform } = getTransitionInfo(clone);
        container.removeChild(clone);
        return hasTransform;
      }
      const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
      let renderer;
      function ensureRenderer() {
        return renderer || (renderer = createRenderer(rendererOptions));
      }
      const createApp = (...args) => {
        const app = ensureRenderer().createApp(...args);
        const { mount: mount2 } = app;
        app.mount = (containerOrSelector) => {
          const container = normalizeContainer(containerOrSelector);
          if (!container)
            return;
          const component = app._component;
          if (!isFunction$1(component) && !component.render && !component.template) {
            component.template = container.innerHTML;
          }
          container.innerHTML = "";
          const proxy = mount2(container, false, resolveRootNamespace(container));
          if (container instanceof Element) {
            container.removeAttribute("v-cloak");
            container.setAttribute("data-v-app", "");
          }
          return proxy;
        };
        return app;
      };
      function resolveRootNamespace(container) {
        if (container instanceof SVGElement) {
          return "svg";
        }
        if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
          return "mathml";
        }
      }
      function normalizeContainer(container) {
        if (isString(container)) {
          const res = document.querySelector(container);
          return res;
        }
        return container;
      }
      function getPreciseEventTarget(event) {
        return event.composedPath()[0] || null;
      }
      function depx(value) {
        if (typeof value === "string") {
          if (value.endsWith("px")) {
            return Number(value.slice(0, value.length - 2));
          }
          return Number(value);
        }
        return value;
      }
      function getMargin(value, position) {
        const parts = value.trim().split(/\s+/g);
        const margin = {
          top: parts[0]
        };
        switch (parts.length) {
          case 1:
            margin.right = parts[0];
            margin.bottom = parts[0];
            margin.left = parts[0];
            break;
          case 2:
            margin.right = parts[1];
            margin.left = parts[1];
            margin.bottom = parts[0];
            break;
          case 3:
            margin.right = parts[1];
            margin.bottom = parts[2];
            margin.left = parts[1];
            break;
          case 4:
            margin.right = parts[1];
            margin.bottom = parts[2];
            margin.left = parts[3];
            break;
          default:
            throw new Error("[seemly/getMargin]:" + value + " is not a valid value.");
        }
        if (position === void 0)
          return margin;
        return margin[position];
      }
      function getGap(value, orient) {
        const [rowGap, colGap] = value.split(" ");
        if (!orient)
          return {
            row: rowGap,
            col: colGap || rowGap
          };
        return orient === "row" ? rowGap : colGap;
      }
      const colors = {
        black: "#000",
        silver: "#C0C0C0",
        gray: "#808080",
        white: "#FFF",
        maroon: "#800000",
        red: "#F00",
        purple: "#800080",
        fuchsia: "#F0F",
        green: "#008000",
        lime: "#0F0",
        olive: "#808000",
        yellow: "#FF0",
        navy: "#000080",
        blue: "#00F",
        teal: "#008080",
        aqua: "#0FF",
        transparent: "#0000"
      };
      const prefix$1 = "^\\s*";
      const suffix = "\\s*$";
      const float = "\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))\\s*";
      const hex = "([0-9A-Fa-f])";
      const dhex = "([0-9A-Fa-f]{2})";
      const rgbRegex = new RegExp(`${prefix$1}rgb\\s*\\(${float},${float},${float}\\)${suffix}`);
      const rgbaRegex = new RegExp(`${prefix$1}rgba\\s*\\(${float},${float},${float},${float}\\)${suffix}`);
      const sHexRegex = new RegExp(`${prefix$1}#${hex}${hex}${hex}${suffix}`);
      const hexRegex = new RegExp(`${prefix$1}#${dhex}${dhex}${dhex}${suffix}`);
      const sHexaRegex = new RegExp(`${prefix$1}#${hex}${hex}${hex}${hex}${suffix}`);
      const hexaRegex = new RegExp(`${prefix$1}#${dhex}${dhex}${dhex}${dhex}${suffix}`);
      function parseHex(value) {
        return parseInt(value, 16);
      }
      function rgba(color) {
        try {
          let i;
          if (i = hexRegex.exec(color)) {
            return [parseHex(i[1]), parseHex(i[2]), parseHex(i[3]), 1];
          } else if (i = rgbRegex.exec(color)) {
            return [roundChannel(i[1]), roundChannel(i[5]), roundChannel(i[9]), 1];
          } else if (i = rgbaRegex.exec(color)) {
            return [
              roundChannel(i[1]),
              roundChannel(i[5]),
              roundChannel(i[9]),
              roundAlpha(i[13])
            ];
          } else if (i = sHexRegex.exec(color)) {
            return [
              parseHex(i[1] + i[1]),
              parseHex(i[2] + i[2]),
              parseHex(i[3] + i[3]),
              1
            ];
          } else if (i = hexaRegex.exec(color)) {
            return [
              parseHex(i[1]),
              parseHex(i[2]),
              parseHex(i[3]),
              roundAlpha(parseHex(i[4]) / 255)
            ];
          } else if (i = sHexaRegex.exec(color)) {
            return [
              parseHex(i[1] + i[1]),
              parseHex(i[2] + i[2]),
              parseHex(i[3] + i[3]),
              roundAlpha(parseHex(i[4] + i[4]) / 255)
            ];
          } else if (color in colors) {
            return rgba(colors[color]);
          }
          throw new Error(`[seemly/rgba]: Invalid color value ${color}.`);
        } catch (e) {
          throw e;
        }
      }
      function normalizeAlpha(alphaValue) {
        return alphaValue > 1 ? 1 : alphaValue < 0 ? 0 : alphaValue;
      }
      function stringifyRgba(r, g, b, a) {
        return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, ${normalizeAlpha(a)})`;
      }
      function compositeChannel(v1, a1, v2, a2, a) {
        return roundChannel((v1 * a1 * (1 - a2) + v2 * a2) / a);
      }
      function composite(background, overlay2) {
        if (!Array.isArray(background))
          background = rgba(background);
        if (!Array.isArray(overlay2))
          overlay2 = rgba(overlay2);
        const a1 = background[3];
        const a2 = overlay2[3];
        const alpha = roundAlpha(a1 + a2 - a1 * a2);
        return stringifyRgba(compositeChannel(background[0], a1, overlay2[0], a2, alpha), compositeChannel(background[1], a1, overlay2[1], a2, alpha), compositeChannel(background[2], a1, overlay2[2], a2, alpha), alpha);
      }
      function changeColor(base2, options) {
        const [r, g, b, a = 1] = Array.isArray(base2) ? base2 : rgba(base2);
        if (options.alpha) {
          return stringifyRgba(r, g, b, options.alpha);
        }
        return stringifyRgba(r, g, b, a);
      }
      function scaleColor(base2, options) {
        const [r, g, b, a = 1] = Array.isArray(base2) ? base2 : rgba(base2);
        const { lightness = 1, alpha = 1 } = options;
        return toRgbaString([r * lightness, g * lightness, b * lightness, a * alpha]);
      }
      function roundAlpha(value) {
        const v = Math.round(Number(value) * 100) / 100;
        if (v > 1)
          return 1;
        if (v < 0)
          return 0;
        return v;
      }
      function roundChannel(value) {
        const v = Math.round(Number(value));
        if (v > 255)
          return 255;
        if (v < 0)
          return 0;
        return v;
      }
      function toRgbaString(base2) {
        const [r, g, b] = base2;
        if (3 in base2) {
          return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, ${roundAlpha(base2[3])})`;
        }
        return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, 1)`;
      }
      function createId(length = 8) {
        return Math.random().toString(16).slice(2, 2 + length);
      }
      function getSlot$1(instance, slotName = "default", fallback = []) {
        const slots = instance.$slots;
        const slot = slots[slotName];
        if (slot === void 0)
          return fallback;
        return slot();
      }
      function flatten(vNodes, filterCommentNode = true, result = []) {
        vNodes.forEach((vNode) => {
          if (vNode === null)
            return;
          if (typeof vNode !== "object") {
            if (typeof vNode === "string" || typeof vNode === "number") {
              result.push(createTextVNode(String(vNode)));
            }
            return;
          }
          if (Array.isArray(vNode)) {
            flatten(vNode, filterCommentNode, result);
            return;
          }
          if (vNode.type === Fragment) {
            if (vNode.children === null)
              return;
            if (Array.isArray(vNode.children)) {
              flatten(vNode.children, filterCommentNode, result);
            }
          } else {
            if (vNode.type === Comment && filterCommentNode)
              return;
            result.push(vNode);
          }
        });
        return result;
      }
      function call(funcs, ...args) {
        if (Array.isArray(funcs)) {
          funcs.forEach((func) => call(func, ...args));
        } else
          return funcs(...args);
      }
      function keysOf(obj) {
        return Object.keys(obj);
      }
      function warn$2(location, message) {
        console.error(`[naive/${location}]: ${message}`);
      }
      function throwError(location, message) {
        throw new Error(`[naive/${location}]: ${message}`);
      }
      function createInjectionKey(key) {
        return key;
      }
      function ensureValidVNode(vnodes) {
        return vnodes.some((child) => {
          if (!isVNode(child)) {
            return true;
          }
          if (child.type === Comment) {
            return false;
          }
          if (child.type === Fragment && !ensureValidVNode(child.children)) {
            return false;
          }
          return true;
        }) ? vnodes : null;
      }
      function resolveSlot(slot, fallback) {
        return slot && ensureValidVNode(slot()) || fallback();
      }
      function resolveSlotWithProps(slot, props, fallback) {
        return slot && ensureValidVNode(slot(props)) || fallback(props);
      }
      function resolveWrappedSlot(slot, wrapper) {
        const children = slot && ensureValidVNode(slot());
        return wrapper(children || null);
      }
      function isSlotEmpty(slot) {
        return !(slot && ensureValidVNode(slot()));
      }
      const Wrapper = /* @__PURE__ */ defineComponent({
        render() {
          var _a, _b;
          return (_b = (_a = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
      });
      const pureNumberRegex = /^(\d|\.)+$/;
      const numberRegex = /(\d|\.)+/;
      function formatLength(length, {
        c: c2 = 1,
        offset = 0,
        attachPx = true
      } = {}) {
        if (typeof length === "number") {
          const result = (length + offset) * c2;
          if (result === 0)
            return "0";
          return `${result}px`;
        } else if (typeof length === "string") {
          if (pureNumberRegex.test(length)) {
            const result = (Number(length) + offset) * c2;
            if (attachPx) {
              if (result === 0)
                return "0";
              return `${result}px`;
            } else {
              return `${result}`;
            }
          } else {
            const result = numberRegex.exec(length);
            if (!result)
              return length;
            return length.replace(numberRegex, String((Number(result[0]) + offset) * c2));
          }
        }
        return length;
      }
      function color2Class(color) {
        return color.replace(/#|\(|\)|,|\s|\./g, "_");
      }
      function ampCount(selector) {
        let cnt = 0;
        for (let i = 0; i < selector.length; ++i) {
          if (selector[i] === "&")
            ++cnt;
        }
        return cnt;
      }
      const separatorRegex = /\s*,(?![^(]*\))\s*/g;
      const extraSpaceRegex = /\s+/g;
      function resolveSelectorWithAmp(amp, selector) {
        const nextAmp = [];
        selector.split(separatorRegex).forEach((partialSelector) => {
          let round = ampCount(partialSelector);
          if (!round) {
            amp.forEach((partialAmp) => {
              nextAmp.push(
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                (partialAmp && partialAmp + " ") + partialSelector
              );
            });
            return;
          } else if (round === 1) {
            amp.forEach((partialAmp) => {
              nextAmp.push(partialSelector.replace("&", partialAmp));
            });
            return;
          }
          let partialNextAmp = [
            partialSelector
          ];
          while (round--) {
            const nextPartialNextAmp = [];
            partialNextAmp.forEach((selectorItr) => {
              amp.forEach((partialAmp) => {
                nextPartialNextAmp.push(selectorItr.replace("&", partialAmp));
              });
            });
            partialNextAmp = nextPartialNextAmp;
          }
          partialNextAmp.forEach((part) => nextAmp.push(part));
        });
        return nextAmp;
      }
      function resolveSelector(amp, selector) {
        const nextAmp = [];
        selector.split(separatorRegex).forEach((partialSelector) => {
          amp.forEach((partialAmp) => {
            nextAmp.push((partialAmp && partialAmp + " ") + partialSelector);
          });
        });
        return nextAmp;
      }
      function parseSelectorPath(selectorPaths) {
        let amp = [""];
        selectorPaths.forEach((selector) => {
          selector = selector && selector.trim();
          if (
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            !selector
          ) {
            return;
          }
          if (selector.includes("&")) {
            amp = resolveSelectorWithAmp(amp, selector);
          } else {
            amp = resolveSelector(amp, selector);
          }
        });
        return amp.join(", ").replace(extraSpaceRegex, " ");
      }
      function removeElement(el) {
        if (!el)
          return;
        const parentElement = el.parentElement;
        if (parentElement)
          parentElement.removeChild(el);
      }
      function queryElement(id) {
        return document.querySelector(`style[cssr-id="${id}"]`);
      }
      function createElement(id) {
        const el = document.createElement("style");
        el.setAttribute("cssr-id", id);
        return el;
      }
      function isMediaOrSupports(selector) {
        if (!selector)
          return false;
        return /^\s*@(s|m)/.test(selector);
      }
      const kebabRegex = /[A-Z]/g;
      function kebabCase(pattern) {
        return pattern.replace(kebabRegex, (match2) => "-" + match2.toLowerCase());
      }
      function unwrapProperty(prop, indent = "  ") {
        if (typeof prop === "object" && prop !== null) {
          return " {\n" + Object.entries(prop).map((v) => {
            return indent + `  ${kebabCase(v[0])}: ${v[1]};`;
          }).join("\n") + "\n" + indent + "}";
        }
        return `: ${prop};`;
      }
      function unwrapProperties(props, instance, params) {
        if (typeof props === "function") {
          return props({
            context: instance.context,
            props: params
          });
        }
        return props;
      }
      function createStyle(selector, props, instance, params) {
        if (!props)
          return "";
        const unwrappedProps = unwrapProperties(props, instance, params);
        if (!unwrappedProps)
          return "";
        if (typeof unwrappedProps === "string") {
          return `${selector} {
${unwrappedProps}
}`;
        }
        const propertyNames = Object.keys(unwrappedProps);
        if (propertyNames.length === 0) {
          if (instance.config.keepEmptyBlock)
            return selector + " {\n}";
          return "";
        }
        const statements = selector ? [
          selector + " {"
        ] : [];
        propertyNames.forEach((propertyName) => {
          const property = unwrappedProps[propertyName];
          if (propertyName === "raw") {
            statements.push("\n" + property + "\n");
            return;
          }
          propertyName = kebabCase(propertyName);
          if (property !== null && property !== void 0) {
            statements.push(`  ${propertyName}${unwrapProperty(property)}`);
          }
        });
        if (selector) {
          statements.push("}");
        }
        return statements.join("\n");
      }
      function loopCNodeListWithCallback(children, options, callback) {
        if (!children)
          return;
        children.forEach((child) => {
          if (Array.isArray(child)) {
            loopCNodeListWithCallback(child, options, callback);
          } else if (typeof child === "function") {
            const grandChildren = child(options);
            if (Array.isArray(grandChildren)) {
              loopCNodeListWithCallback(grandChildren, options, callback);
            } else if (grandChildren) {
              callback(grandChildren);
            }
          } else if (child) {
            callback(child);
          }
        });
      }
      function traverseCNode(node, selectorPaths, styles, instance, params, styleSheet) {
        const $ = node.$;
        let blockSelector = "";
        if (!$ || typeof $ === "string") {
          if (isMediaOrSupports($)) {
            blockSelector = $;
          } else {
            selectorPaths.push($);
          }
        } else if (typeof $ === "function") {
          const selector2 = $({
            context: instance.context,
            props: params
          });
          if (isMediaOrSupports(selector2)) {
            blockSelector = selector2;
          } else {
            selectorPaths.push(selector2);
          }
        } else {
          if ($.before)
            $.before(instance.context);
          if (!$.$ || typeof $.$ === "string") {
            if (isMediaOrSupports($.$)) {
              blockSelector = $.$;
            } else {
              selectorPaths.push($.$);
            }
          } else if ($.$) {
            const selector2 = $.$({
              context: instance.context,
              props: params
            });
            if (isMediaOrSupports(selector2)) {
              blockSelector = selector2;
            } else {
              selectorPaths.push(selector2);
            }
          }
        }
        const selector = parseSelectorPath(selectorPaths);
        const style2 = createStyle(selector, node.props, instance, params);
        if (blockSelector) {
          styles.push(`${blockSelector} {`);
          if (styleSheet && style2) {
            styleSheet.insertRule(`${blockSelector} {
${style2}
}
`);
          }
        } else {
          if (styleSheet && style2) {
            styleSheet.insertRule(style2);
          }
          if (!styleSheet && style2.length)
            styles.push(style2);
        }
        if (node.children) {
          loopCNodeListWithCallback(node.children, {
            context: instance.context,
            props: params
          }, (childNode) => {
            if (typeof childNode === "string") {
              const style3 = createStyle(selector, { raw: childNode }, instance, params);
              if (styleSheet) {
                styleSheet.insertRule(style3);
              } else {
                styles.push(style3);
              }
            } else {
              traverseCNode(childNode, selectorPaths, styles, instance, params, styleSheet);
            }
          });
        }
        selectorPaths.pop();
        if (blockSelector) {
          styles.push("}");
        }
        if ($ && $.after)
          $.after(instance.context);
      }
      function render(node, instance, props, insertRule = false) {
        const styles = [];
        traverseCNode(node, [], styles, instance, props, insertRule ? node.instance.__styleSheet : void 0);
        if (insertRule)
          return "";
        return styles.join("\n\n");
      }
      function murmur2(str) {
        var h2 = 0;
        var k, i = 0, len2 = str.length;
        for (; len2 >= 4; ++i, len2 -= 4) {
          k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
          k = /* Math.imul(k, m): */
          (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
          k ^= /* k >>> r: */
          k >>> 24;
          h2 = /* Math.imul(k, m): */
          (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
          (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
        }
        switch (len2) {
          case 3:
            h2 ^= (str.charCodeAt(i + 2) & 255) << 16;
          case 2:
            h2 ^= (str.charCodeAt(i + 1) & 255) << 8;
          case 1:
            h2 ^= str.charCodeAt(i) & 255;
            h2 = /* Math.imul(h, m): */
            (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
        }
        h2 ^= h2 >>> 13;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
        return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
      }
      if (typeof window !== "undefined") {
        window.__cssrContext = {};
      }
      function unmount(intance, node, id) {
        const { els } = node;
        if (id === void 0) {
          els.forEach(removeElement);
          node.els = [];
        } else {
          const target = queryElement(id);
          if (target && els.includes(target)) {
            removeElement(target);
            node.els = els.filter((el) => el !== target);
          }
        }
      }
      function addElementToList(els, target) {
        els.push(target);
      }
      function mount(instance, node, id, props, head, silent, force, anchorMetaName, ssrAdapter2) {
        if (silent && !ssrAdapter2) {
          if (id === void 0) {
            console.error("[css-render/mount]: `id` is required in `silent` mode.");
            return;
          }
          const cssrContext = window.__cssrContext;
          if (!cssrContext[id]) {
            cssrContext[id] = true;
            render(node, instance, props, silent);
          }
          return;
        }
        let style2;
        if (id === void 0) {
          style2 = node.render(props);
          id = murmur2(style2);
        }
        if (ssrAdapter2) {
          ssrAdapter2.adapter(id, style2 !== null && style2 !== void 0 ? style2 : node.render(props));
          return;
        }
        const queriedTarget = queryElement(id);
        if (queriedTarget !== null && !force) {
          return queriedTarget;
        }
        const target = queriedTarget !== null && queriedTarget !== void 0 ? queriedTarget : createElement(id);
        if (style2 === void 0)
          style2 = node.render(props);
        target.textContent = style2;
        if (queriedTarget !== null)
          return queriedTarget;
        if (anchorMetaName) {
          const anchorMetaEl = document.head.querySelector(`meta[name="${anchorMetaName}"]`);
          if (anchorMetaEl) {
            document.head.insertBefore(target, anchorMetaEl);
            addElementToList(node.els, target);
            return target;
          }
        }
        if (head) {
          document.head.insertBefore(target, document.head.querySelector("style, link"));
        } else {
          document.head.appendChild(target);
        }
        addElementToList(node.els, target);
        return target;
      }
      function wrappedRender(props) {
        return render(this, this.instance, props);
      }
      function wrappedMount(options = {}) {
        const { id, ssr, props, head = false, silent = false, force = false, anchorMetaName } = options;
        const targetElement = mount(this.instance, this, id, props, head, silent, force, anchorMetaName, ssr);
        return targetElement;
      }
      function wrappedUnmount(options = {}) {
        const { id } = options;
        unmount(this.instance, this, id);
      }
      const createCNode = function(instance, $, props, children) {
        return {
          instance,
          $,
          props,
          children,
          els: [],
          render: wrappedRender,
          mount: wrappedMount,
          unmount: wrappedUnmount
        };
      };
      const c$1 = function(instance, $, props, children) {
        if (Array.isArray($)) {
          return createCNode(instance, { $: null }, null, $);
        } else if (Array.isArray(props)) {
          return createCNode(instance, $, null, props);
        } else if (Array.isArray(children)) {
          return createCNode(instance, $, props, children);
        } else {
          return createCNode(instance, $, props, null);
        }
      };
      function CssRender(config = {}) {
        let styleSheet = null;
        const cssr2 = {
          c: (...args) => c$1(cssr2, ...args),
          use: (plugin2, ...args) => plugin2.install(cssr2, ...args),
          find: queryElement,
          context: {},
          config,
          get __styleSheet() {
            if (!styleSheet) {
              const style2 = document.createElement("style");
              document.head.appendChild(style2);
              styleSheet = document.styleSheets[document.styleSheets.length - 1];
              return styleSheet;
            }
            return styleSheet;
          }
        };
        return cssr2;
      }
      function exists(id, ssr) {
        if (id === void 0)
          return false;
        if (ssr) {
          const { context: { ids } } = ssr;
          return ids.has(id);
        }
        return queryElement(id) !== null;
      }
      function plugin$1(options) {
        let _bPrefix = ".";
        let _ePrefix = "__";
        let _mPrefix = "--";
        let c2;
        if (options) {
          let t = options.blockPrefix;
          if (t) {
            _bPrefix = t;
          }
          t = options.elementPrefix;
          if (t) {
            _ePrefix = t;
          }
          t = options.modifierPrefix;
          if (t) {
            _mPrefix = t;
          }
        }
        const _plugin = {
          install(instance) {
            c2 = instance.c;
            const ctx2 = instance.context;
            ctx2.bem = {};
            ctx2.bem.b = null;
            ctx2.bem.els = null;
          }
        };
        function b(arg) {
          let memorizedB;
          let memorizedE;
          return {
            before(ctx2) {
              memorizedB = ctx2.bem.b;
              memorizedE = ctx2.bem.els;
              ctx2.bem.els = null;
            },
            after(ctx2) {
              ctx2.bem.b = memorizedB;
              ctx2.bem.els = memorizedE;
            },
            $({ context, props }) {
              arg = typeof arg === "string" ? arg : arg({ context, props });
              context.bem.b = arg;
              return `${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}`;
            }
          };
        }
        function e(arg) {
          let memorizedE;
          return {
            before(ctx2) {
              memorizedE = ctx2.bem.els;
            },
            after(ctx2) {
              ctx2.bem.els = memorizedE;
            },
            $({ context, props }) {
              arg = typeof arg === "string" ? arg : arg({ context, props });
              context.bem.els = arg.split(",").map((v) => v.trim());
              return context.bem.els.map((el) => `${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}${_ePrefix}${el}`).join(", ");
            }
          };
        }
        function m(arg) {
          return {
            $({ context, props }) {
              arg = typeof arg === "string" ? arg : arg({ context, props });
              const modifiers = arg.split(",").map((v) => v.trim());
              function elementToSelector(el) {
                return modifiers.map((modifier) => `&${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}${el !== void 0 ? `${_ePrefix}${el}` : ""}${_mPrefix}${modifier}`).join(", ");
              }
              const els = context.bem.els;
              if (els !== null) {
                return elementToSelector(els[0]);
              } else {
                return elementToSelector();
              }
            }
          };
        }
        function notM(arg) {
          return {
            $({ context, props }) {
              arg = typeof arg === "string" ? arg : arg({ context, props });
              const els = context.bem.els;
              return `&:not(${(props === null || props === void 0 ? void 0 : props.bPrefix) || _bPrefix}${context.bem.b}${els !== null && els.length > 0 ? `${_ePrefix}${els[0]}` : ""}${_mPrefix}${arg})`;
            }
          };
        }
        const cB2 = (...args) => c2(b(args[0]), args[1], args[2]);
        const cE2 = (...args) => c2(e(args[0]), args[1], args[2]);
        const cM2 = (...args) => c2(m(args[0]), args[1], args[2]);
        const cNotM2 = (...args) => c2(notM(args[0]), args[1], args[2]);
        Object.assign(_plugin, {
          cB: cB2,
          cE: cE2,
          cM: cM2,
          cNotM: cNotM2
        });
        return _plugin;
      }
      const namespace = "n";
      const prefix = `.${namespace}-`;
      const elementPrefix = "__";
      const modifierPrefix = "--";
      const cssr = CssRender();
      const plugin = plugin$1({
        blockPrefix: prefix,
        elementPrefix,
        modifierPrefix
      });
      cssr.use(plugin);
      const {
        c,
        find
      } = cssr;
      const {
        cB,
        cE,
        cM,
        cNotM
      } = plugin;
      function insideModal(style2) {
        return c(({
          props: {
            bPrefix
          }
        }) => `${bPrefix || prefix}modal, ${bPrefix || prefix}drawer`, [style2]);
      }
      function insidePopover(style2) {
        return c(({
          props: {
            bPrefix
          }
        }) => `${bPrefix || prefix}popover`, [style2]);
      }
      function createKey(prefix2, suffix2) {
        return prefix2 + (suffix2 === "default" ? "" : suffix2.replace(/^[a-z]/, (startChar) => startChar.toUpperCase()));
      }
      const isBrowser$1 = typeof document !== "undefined" && typeof window !== "undefined";
      const eventSet = /* @__PURE__ */ new WeakSet();
      function eventEffectNotPerformed(event) {
        return !eventSet.has(event);
      }
      function useInjectionInstanceCollection(injectionName, collectionKey, registerKeyRef) {
        var _a;
        const injection = inject(injectionName, null);
        if (injection === null)
          return;
        const vm = (_a = getCurrentInstance()) === null || _a === void 0 ? void 0 : _a.proxy;
        watch(registerKeyRef, registerInstance);
        registerInstance(registerKeyRef.value);
        onBeforeUnmount(() => {
          registerInstance(void 0, registerKeyRef.value);
        });
        function registerInstance(key, oldKey) {
          if (!injection)
            return;
          const collection = injection[collectionKey];
          if (oldKey !== void 0)
            removeInstance(collection, oldKey);
          if (key !== void 0)
            addInstance(collection, key);
        }
        function removeInstance(collection, key) {
          if (!collection[key])
            collection[key] = [];
          collection[key].splice(collection[key].findIndex((instance) => instance === vm), 1);
        }
        function addInstance(collection, key) {
          if (!collection[key])
            collection[key] = [];
          if (!~collection[key].findIndex((instance) => instance === vm)) {
            collection[key].push(vm);
          }
        }
      }
      function useFalseUntilTruthy(originalRef) {
        const currentRef = ref(!!originalRef.value);
        if (currentRef.value)
          return readonly(currentRef);
        const stop = watch(originalRef, (value) => {
          if (value) {
            currentRef.value = true;
            stop();
          }
        });
        return readonly(currentRef);
      }
      function useMemo(getterOrOptions) {
        const computedValueRef = computed(getterOrOptions);
        const valueRef = ref(computedValueRef.value);
        watch(computedValueRef, (value) => {
          valueRef.value = value;
        });
        if (typeof getterOrOptions === "function") {
          return valueRef;
        } else {
          return {
            __v_isRef: true,
            get value() {
              return valueRef.value;
            },
            set value(v) {
              getterOrOptions.set(v);
            }
          };
        }
      }
      function getEventTarget(e) {
        const path = e.composedPath();
        return path[0];
      }
      const traps = {
        mousemoveoutside: /* @__PURE__ */ new WeakMap(),
        clickoutside: /* @__PURE__ */ new WeakMap()
      };
      function createTrapHandler(name, el, originalHandler) {
        if (name === "mousemoveoutside") {
          const moveHandler = (e) => {
            if (el.contains(getEventTarget(e)))
              return;
            originalHandler(e);
          };
          return {
            mousemove: moveHandler,
            touchstart: moveHandler
          };
        } else if (name === "clickoutside") {
          let mouseDownOutside = false;
          const downHandler = (e) => {
            mouseDownOutside = !el.contains(getEventTarget(e));
          };
          const upHanlder = (e) => {
            if (!mouseDownOutside)
              return;
            if (el.contains(getEventTarget(e)))
              return;
            originalHandler(e);
          };
          return {
            mousedown: downHandler,
            mouseup: upHanlder,
            touchstart: downHandler,
            touchend: upHanlder
          };
        }
        console.error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `[evtd/create-trap-handler]: name \`${name}\` is invalid. This could be a bug of evtd.`
        );
        return {};
      }
      function ensureTrapHandlers(name, el, handler) {
        const handlers = traps[name];
        let elHandlers = handlers.get(el);
        if (elHandlers === void 0) {
          handlers.set(el, elHandlers = /* @__PURE__ */ new WeakMap());
        }
        let trapHandler = elHandlers.get(handler);
        if (trapHandler === void 0) {
          elHandlers.set(handler, trapHandler = createTrapHandler(name, el, handler));
        }
        return trapHandler;
      }
      function trapOn(name, el, handler, options) {
        if (name === "mousemoveoutside" || name === "clickoutside") {
          const trapHandlers = ensureTrapHandlers(name, el, handler);
          Object.keys(trapHandlers).forEach((key) => {
            on(key, document, trapHandlers[key], options);
          });
          return true;
        }
        return false;
      }
      function trapOff(name, el, handler, options) {
        if (name === "mousemoveoutside" || name === "clickoutside") {
          const trapHandlers = ensureTrapHandlers(name, el, handler);
          Object.keys(trapHandlers).forEach((key) => {
            off(key, document, trapHandlers[key], options);
          });
          return true;
        }
        return false;
      }
      function createDelegate() {
        if (typeof window === "undefined") {
          return {
            on: () => {
            },
            off: () => {
            }
          };
        }
        const propagationStopped = /* @__PURE__ */ new WeakMap();
        const immediatePropagationStopped = /* @__PURE__ */ new WeakMap();
        function trackPropagation() {
          propagationStopped.set(this, true);
        }
        function trackImmediate() {
          propagationStopped.set(this, true);
          immediatePropagationStopped.set(this, true);
        }
        function spy(event, propName, fn) {
          const source = event[propName];
          event[propName] = function() {
            fn.apply(event, arguments);
            return source.apply(event, arguments);
          };
          return event;
        }
        function unspy(event, propName) {
          event[propName] = Event.prototype[propName];
        }
        const currentTargets = /* @__PURE__ */ new WeakMap();
        const currentTargetDescriptor = Object.getOwnPropertyDescriptor(Event.prototype, "currentTarget");
        function getCurrentTarget() {
          var _a;
          return (_a = currentTargets.get(this)) !== null && _a !== void 0 ? _a : null;
        }
        function defineCurrentTarget(event, getter) {
          if (currentTargetDescriptor === void 0)
            return;
          Object.defineProperty(event, "currentTarget", {
            configurable: true,
            enumerable: true,
            get: getter !== null && getter !== void 0 ? getter : currentTargetDescriptor.get
          });
        }
        const phaseToTypeToElToHandlers = {
          bubble: {},
          capture: {}
        };
        const typeToWindowEventHandlers = {};
        function createUnifiedHandler() {
          const delegeteHandler = function(e) {
            const { type, eventPhase, bubbles } = e;
            const target = getEventTarget(e);
            if (eventPhase === 2)
              return;
            const phase = eventPhase === 1 ? "capture" : "bubble";
            let cursor = target;
            const path = [];
            while (true) {
              if (cursor === null)
                cursor = window;
              path.push(cursor);
              if (cursor === window) {
                break;
              }
              cursor = cursor.parentNode || null;
            }
            const captureElToHandlers = phaseToTypeToElToHandlers.capture[type];
            const bubbleElToHandlers = phaseToTypeToElToHandlers.bubble[type];
            spy(e, "stopPropagation", trackPropagation);
            spy(e, "stopImmediatePropagation", trackImmediate);
            defineCurrentTarget(e, getCurrentTarget);
            if (phase === "capture") {
              if (captureElToHandlers === void 0)
                return;
              for (let i = path.length - 1; i >= 0; --i) {
                if (propagationStopped.has(e))
                  break;
                const target2 = path[i];
                const handlers = captureElToHandlers.get(target2);
                if (handlers !== void 0) {
                  currentTargets.set(e, target2);
                  for (const handler of handlers) {
                    if (immediatePropagationStopped.has(e))
                      break;
                    handler(e);
                  }
                }
                if (i === 0 && !bubbles && bubbleElToHandlers !== void 0) {
                  const bubbleHandlers = bubbleElToHandlers.get(target2);
                  if (bubbleHandlers !== void 0) {
                    for (const handler of bubbleHandlers) {
                      if (immediatePropagationStopped.has(e))
                        break;
                      handler(e);
                    }
                  }
                }
              }
            } else if (phase === "bubble") {
              if (bubbleElToHandlers === void 0)
                return;
              for (let i = 0; i < path.length; ++i) {
                if (propagationStopped.has(e))
                  break;
                const target2 = path[i];
                const handlers = bubbleElToHandlers.get(target2);
                if (handlers !== void 0) {
                  currentTargets.set(e, target2);
                  for (const handler of handlers) {
                    if (immediatePropagationStopped.has(e))
                      break;
                    handler(e);
                  }
                }
              }
            }
            unspy(e, "stopPropagation");
            unspy(e, "stopImmediatePropagation");
            defineCurrentTarget(e);
          };
          delegeteHandler.displayName = "evtdUnifiedHandler";
          return delegeteHandler;
        }
        function createUnifiedWindowEventHandler() {
          const delegateHandler = function(e) {
            const { type, eventPhase } = e;
            if (eventPhase !== 2)
              return;
            const handlers = typeToWindowEventHandlers[type];
            if (handlers === void 0)
              return;
            handlers.forEach((handler) => handler(e));
          };
          delegateHandler.displayName = "evtdUnifiedWindowEventHandler";
          return delegateHandler;
        }
        const unifiedHandler = createUnifiedHandler();
        const unfiendWindowEventHandler = createUnifiedWindowEventHandler();
        function ensureElToHandlers(phase, type) {
          const phaseHandlers = phaseToTypeToElToHandlers[phase];
          if (phaseHandlers[type] === void 0) {
            phaseHandlers[type] = /* @__PURE__ */ new Map();
            window.addEventListener(type, unifiedHandler, phase === "capture");
          }
          return phaseHandlers[type];
        }
        function ensureWindowEventHandlers(type) {
          const windowEventHandlers = typeToWindowEventHandlers[type];
          if (windowEventHandlers === void 0) {
            typeToWindowEventHandlers[type] = /* @__PURE__ */ new Set();
            window.addEventListener(type, unfiendWindowEventHandler);
          }
          return typeToWindowEventHandlers[type];
        }
        function ensureHandlers(elToHandlers, el) {
          let elHandlers = elToHandlers.get(el);
          if (elHandlers === void 0) {
            elToHandlers.set(el, elHandlers = /* @__PURE__ */ new Set());
          }
          return elHandlers;
        }
        function handlerExist(el, phase, type, handler) {
          const elToHandlers = phaseToTypeToElToHandlers[phase][type];
          if (elToHandlers !== void 0) {
            const handlers = elToHandlers.get(el);
            if (handlers !== void 0) {
              if (handlers.has(handler))
                return true;
            }
          }
          return false;
        }
        function windowEventHandlerExist(type, handler) {
          const handlers = typeToWindowEventHandlers[type];
          if (handlers !== void 0) {
            if (handlers.has(handler)) {
              return true;
            }
          }
          return false;
        }
        function on2(type, el, handler, options) {
          let mergedHandler;
          if (typeof options === "object" && options.once === true) {
            mergedHandler = (e) => {
              off2(type, el, mergedHandler, options);
              handler(e);
            };
          } else {
            mergedHandler = handler;
          }
          const trapped = trapOn(type, el, mergedHandler, options);
          if (trapped)
            return;
          const phase = options === true || typeof options === "object" && options.capture === true ? "capture" : "bubble";
          const elToHandlers = ensureElToHandlers(phase, type);
          const handlers = ensureHandlers(elToHandlers, el);
          if (!handlers.has(mergedHandler))
            handlers.add(mergedHandler);
          if (el === window) {
            const windowEventHandlers = ensureWindowEventHandlers(type);
            if (!windowEventHandlers.has(mergedHandler)) {
              windowEventHandlers.add(mergedHandler);
            }
          }
        }
        function off2(type, el, handler, options) {
          const trapped = trapOff(type, el, handler, options);
          if (trapped)
            return;
          const capture = options === true || typeof options === "object" && options.capture === true;
          const phase = capture ? "capture" : "bubble";
          const elToHandlers = ensureElToHandlers(phase, type);
          const handlers = ensureHandlers(elToHandlers, el);
          if (el === window) {
            const mirrorPhase = capture ? "bubble" : "capture";
            if (!handlerExist(el, mirrorPhase, type, handler) && windowEventHandlerExist(type, handler)) {
              const windowEventHandlers = typeToWindowEventHandlers[type];
              windowEventHandlers.delete(handler);
              if (windowEventHandlers.size === 0) {
                window.removeEventListener(type, unfiendWindowEventHandler);
                typeToWindowEventHandlers[type] = void 0;
              }
            }
          }
          if (handlers.has(handler))
            handlers.delete(handler);
          if (handlers.size === 0) {
            elToHandlers.delete(el);
          }
          if (elToHandlers.size === 0) {
            window.removeEventListener(type, unifiedHandler, phase === "capture");
            phaseToTypeToElToHandlers[phase][type] = void 0;
          }
        }
        return {
          on: on2,
          off: off2
        };
      }
      const { on, off } = createDelegate();
      function useMergedState(controlledStateRef, uncontrolledStateRef) {
        watch(controlledStateRef, (value) => {
          if (value !== void 0) {
            uncontrolledStateRef.value = value;
          }
        });
        return computed(() => {
          if (controlledStateRef.value === void 0) {
            return uncontrolledStateRef.value;
          }
          return controlledStateRef.value;
        });
      }
      function isMounted() {
        const isMounted2 = ref(false);
        onMounted(() => {
          isMounted2.value = true;
        });
        return readonly(isMounted2);
      }
      const isIos = (typeof window === "undefined" ? false : /iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !window.MSStream;
      function useIsIos() {
        return isIos;
      }
      const modalBodyInjectionKey = createInjectionKey("n-modal-body");
      const drawerBodyInjectionKey = createInjectionKey("n-drawer-body");
      const drawerInjectionKey = createInjectionKey("n-drawer");
      const popoverBodyInjectionKey = createInjectionKey("n-popover-body");
      function getSlot(scope, slots, slotName = "default") {
        const slot = slots[slotName];
        if (slot === void 0) {
          throw new Error(`[vueuc/${scope}]: slot[${slotName}] is empty.`);
        }
        return slot();
      }
      const ctxKey = "@@coContext";
      const clickoutside = {
        mounted(el, { value, modifiers }) {
          el[ctxKey] = {
            handler: void 0
          };
          if (typeof value === "function") {
            el[ctxKey].handler = value;
            on("clickoutside", el, value, {
              capture: modifiers.capture
            });
          }
        },
        updated(el, { value, modifiers }) {
          const ctx2 = el[ctxKey];
          if (typeof value === "function") {
            if (ctx2.handler) {
              if (ctx2.handler !== value) {
                off("clickoutside", el, ctx2.handler, {
                  capture: modifiers.capture
                });
                ctx2.handler = value;
                on("clickoutside", el, value, {
                  capture: modifiers.capture
                });
              }
            } else {
              el[ctxKey].handler = value;
              on("clickoutside", el, value, {
                capture: modifiers.capture
              });
            }
          } else {
            if (ctx2.handler) {
              off("clickoutside", el, ctx2.handler, {
                capture: modifiers.capture
              });
              ctx2.handler = void 0;
            }
          }
        },
        unmounted(el, { modifiers }) {
          const { handler } = el[ctxKey];
          if (handler) {
            off("clickoutside", el, handler, {
              capture: modifiers.capture
            });
          }
          el[ctxKey].handler = void 0;
        }
      };
      const clickoutside$1 = clickoutside;
      function warn$1(location, message) {
        console.error(`[vdirs/${location}]: ${message}`);
      }
      class ZIndexManager {
        constructor() {
          this.elementZIndex = /* @__PURE__ */ new Map();
          this.nextZIndex = 2e3;
        }
        get elementCount() {
          return this.elementZIndex.size;
        }
        ensureZIndex(el, zIndex) {
          const { elementZIndex } = this;
          if (zIndex !== void 0) {
            el.style.zIndex = `${zIndex}`;
            elementZIndex.delete(el);
            return;
          }
          const { nextZIndex } = this;
          if (elementZIndex.has(el)) {
            const currentZIndex = elementZIndex.get(el);
            if (currentZIndex + 1 === this.nextZIndex)
              return;
          }
          el.style.zIndex = `${nextZIndex}`;
          elementZIndex.set(el, nextZIndex);
          this.nextZIndex = nextZIndex + 1;
          this.squashState();
        }
        unregister(el, zIndex) {
          const { elementZIndex } = this;
          if (elementZIndex.has(el)) {
            elementZIndex.delete(el);
          } else if (zIndex === void 0) {
            warn$1("z-index-manager/unregister-element", "Element not found when unregistering.");
          }
          this.squashState();
        }
        squashState() {
          const { elementCount } = this;
          if (!elementCount) {
            this.nextZIndex = 2e3;
          }
          if (this.nextZIndex - elementCount > 2500)
            this.rearrange();
        }
        rearrange() {
          const elementZIndexPair = Array.from(this.elementZIndex.entries());
          elementZIndexPair.sort((pair1, pair2) => {
            return pair1[1] - pair2[1];
          });
          this.nextZIndex = 2e3;
          elementZIndexPair.forEach((pair) => {
            const el = pair[0];
            const zIndex = this.nextZIndex++;
            if (`${zIndex}` !== el.style.zIndex)
              el.style.zIndex = `${zIndex}`;
          });
        }
      }
      const zIndexManager = new ZIndexManager();
      const ctx = "@@ziContext";
      const zindexable = {
        mounted(el, bindings) {
          const { value = {} } = bindings;
          const { zIndex, enabled } = value;
          el[ctx] = {
            enabled: !!enabled,
            initialized: false
          };
          if (enabled) {
            zIndexManager.ensureZIndex(el, zIndex);
            el[ctx].initialized = true;
          }
        },
        updated(el, bindings) {
          const { value = {} } = bindings;
          const { zIndex, enabled } = value;
          const cachedEnabled = el[ctx].enabled;
          if (enabled && !cachedEnabled) {
            zIndexManager.ensureZIndex(el, zIndex);
            el[ctx].initialized = true;
          }
          el[ctx].enabled = !!enabled;
        },
        unmounted(el, bindings) {
          if (!el[ctx].initialized)
            return;
          const { value = {} } = bindings;
          const { zIndex } = value;
          zIndexManager.unregister(el, zIndex);
        }
      };
      const zindexable$1 = zindexable;
      const ssrContextKey = Symbol("@css-render/vue3-ssr");
      function createStyleString(id, style2) {
        return `<style cssr-id="${id}">
${style2}
</style>`;
      }
      function ssrAdapter(id, style2) {
        const ssrContext = inject(ssrContextKey, null);
        if (ssrContext === null) {
          console.error("[css-render/vue3-ssr]: no ssr context found.");
          return;
        }
        const { styles, ids } = ssrContext;
        if (ids.has(id))
          return;
        if (styles !== null) {
          ids.add(id);
          styles.push(createStyleString(id, style2));
        }
      }
      const isBrowser = typeof document !== "undefined";
      function useSsrAdapter() {
        if (isBrowser)
          return void 0;
        const context = inject(ssrContextKey, null);
        if (context === null)
          return void 0;
        return {
          adapter: ssrAdapter,
          context
        };
      }
      function warn(location, message) {
        console.error(`[vueuc/${location}]: ${message}`);
      }
      function resolveTo(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector();
      }
      const LazyTeleport = /* @__PURE__ */ defineComponent({
        name: "LazyTeleport",
        props: {
          to: {
            type: [String, Object],
            default: void 0
          },
          disabled: Boolean,
          show: {
            type: Boolean,
            required: true
          }
        },
        setup(props) {
          return {
            showTeleport: useFalseUntilTruthy(toRef(props, "show")),
            mergedTo: computed(() => {
              const { to } = props;
              return to !== null && to !== void 0 ? to : "body";
            })
          };
        },
        render() {
          return this.showTeleport ? this.disabled ? getSlot("lazy-teleport", this.$slots) : h(Teleport, {
            disabled: this.disabled,
            to: this.mergedTo
          }, getSlot("lazy-teleport", this.$slots)) : null;
        }
      });
      var resizeObservers = [];
      var hasActiveObservations = function() {
        return resizeObservers.some(function(ro) {
          return ro.activeTargets.length > 0;
        });
      };
      var hasSkippedObservations = function() {
        return resizeObservers.some(function(ro) {
          return ro.skippedTargets.length > 0;
        });
      };
      var msg = "ResizeObserver loop completed with undelivered notifications.";
      var deliverResizeLoopError = function() {
        var event;
        if (typeof ErrorEvent === "function") {
          event = new ErrorEvent("error", {
            message: msg
          });
        } else {
          event = document.createEvent("Event");
          event.initEvent("error", false, false);
          event.message = msg;
        }
        window.dispatchEvent(event);
      };
      var ResizeObserverBoxOptions;
      (function(ResizeObserverBoxOptions2) {
        ResizeObserverBoxOptions2["BORDER_BOX"] = "border-box";
        ResizeObserverBoxOptions2["CONTENT_BOX"] = "content-box";
        ResizeObserverBoxOptions2["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
      })(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));
      var freeze = function(obj) {
        return Object.freeze(obj);
      };
      var ResizeObserverSize = /* @__PURE__ */ function() {
        function ResizeObserverSize2(inlineSize, blockSize) {
          this.inlineSize = inlineSize;
          this.blockSize = blockSize;
          freeze(this);
        }
        return ResizeObserverSize2;
      }();
      var DOMRectReadOnly = function() {
        function DOMRectReadOnly2(x, y, width, height) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.top = this.y;
          this.left = this.x;
          this.bottom = this.top + this.height;
          this.right = this.left + this.width;
          return freeze(this);
        }
        DOMRectReadOnly2.prototype.toJSON = function() {
          var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
          return { x, y, top, right, bottom, left, width, height };
        };
        DOMRectReadOnly2.fromRect = function(rectangle) {
          return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        };
        return DOMRectReadOnly2;
      }();
      var isSVG = function(target) {
        return target instanceof SVGElement && "getBBox" in target;
      };
      var isHidden = function(target) {
        if (isSVG(target)) {
          var _a = target.getBBox(), width = _a.width, height = _a.height;
          return !width && !height;
        }
        var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
        return !(offsetWidth || offsetHeight || target.getClientRects().length);
      };
      var isElement = function(obj) {
        var _a;
        if (obj instanceof Element) {
          return true;
        }
        var scope = (_a = obj === null || obj === void 0 ? void 0 : obj.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
        return !!(scope && obj instanceof scope.Element);
      };
      var isReplacedElement = function(target) {
        switch (target.tagName) {
          case "INPUT":
            if (target.type !== "image") {
              break;
            }
          case "VIDEO":
          case "AUDIO":
          case "EMBED":
          case "OBJECT":
          case "CANVAS":
          case "IFRAME":
          case "IMG":
            return true;
        }
        return false;
      };
      var global$1 = typeof window !== "undefined" ? window : {};
      var cache = /* @__PURE__ */ new WeakMap();
      var scrollRegexp = /auto|scroll/;
      var verticalRegexp = /^tb|vertical/;
      var IE = /msie|trident/i.test(global$1.navigator && global$1.navigator.userAgent);
      var parseDimension = function(pixel) {
        return parseFloat(pixel || "0");
      };
      var size = function(inlineSize, blockSize, switchSizes) {
        if (inlineSize === void 0) {
          inlineSize = 0;
        }
        if (blockSize === void 0) {
          blockSize = 0;
        }
        if (switchSizes === void 0) {
          switchSizes = false;
        }
        return new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
      };
      var zeroBoxes = freeze({
        devicePixelContentBoxSize: size(),
        borderBoxSize: size(),
        contentBoxSize: size(),
        contentRect: new DOMRectReadOnly(0, 0, 0, 0)
      });
      var calculateBoxSizes = function(target, forceRecalculation) {
        if (forceRecalculation === void 0) {
          forceRecalculation = false;
        }
        if (cache.has(target) && !forceRecalculation) {
          return cache.get(target);
        }
        if (isHidden(target)) {
          cache.set(target, zeroBoxes);
          return zeroBoxes;
        }
        var cs = getComputedStyle(target);
        var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
        var removePadding = !IE && cs.boxSizing === "border-box";
        var switchSizes = verticalRegexp.test(cs.writingMode || "");
        var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || "");
        var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || "");
        var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
        var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
        var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
        var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
        var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
        var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
        var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
        var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
        var horizontalPadding = paddingLeft + paddingRight;
        var verticalPadding = paddingTop + paddingBottom;
        var horizontalBorderArea = borderLeft + borderRight;
        var verticalBorderArea = borderTop + borderBottom;
        var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
        var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
        var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
        var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
        var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
        var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
        var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
        var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
        var boxes = freeze({
          devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
          borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
          contentBoxSize: size(contentWidth, contentHeight, switchSizes),
          contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
        });
        cache.set(target, boxes);
        return boxes;
      };
      var calculateBoxSize = function(target, observedBox, forceRecalculation) {
        var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
        switch (observedBox) {
          case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
            return devicePixelContentBoxSize;
          case ResizeObserverBoxOptions.BORDER_BOX:
            return borderBoxSize;
          default:
            return contentBoxSize;
        }
      };
      var ResizeObserverEntry = /* @__PURE__ */ function() {
        function ResizeObserverEntry2(target) {
          var boxes = calculateBoxSizes(target);
          this.target = target;
          this.contentRect = boxes.contentRect;
          this.borderBoxSize = freeze([boxes.borderBoxSize]);
          this.contentBoxSize = freeze([boxes.contentBoxSize]);
          this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
        }
        return ResizeObserverEntry2;
      }();
      var calculateDepthForNode = function(node) {
        if (isHidden(node)) {
          return Infinity;
        }
        var depth = 0;
        var parent = node.parentNode;
        while (parent) {
          depth += 1;
          parent = parent.parentNode;
        }
        return depth;
      };
      var broadcastActiveObservations = function() {
        var shallowestDepth = Infinity;
        var callbacks2 = [];
        resizeObservers.forEach(function processObserver(ro) {
          if (ro.activeTargets.length === 0) {
            return;
          }
          var entries = [];
          ro.activeTargets.forEach(function processTarget(ot) {
            var entry = new ResizeObserverEntry(ot.target);
            var targetDepth = calculateDepthForNode(ot.target);
            entries.push(entry);
            ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
            if (targetDepth < shallowestDepth) {
              shallowestDepth = targetDepth;
            }
          });
          callbacks2.push(function resizeObserverCallback() {
            ro.callback.call(ro.observer, entries, ro.observer);
          });
          ro.activeTargets.splice(0, ro.activeTargets.length);
        });
        for (var _i = 0, callbacks_1 = callbacks2; _i < callbacks_1.length; _i++) {
          var callback = callbacks_1[_i];
          callback();
        }
        return shallowestDepth;
      };
      var gatherActiveObservationsAtDepth = function(depth) {
        resizeObservers.forEach(function processObserver(ro) {
          ro.activeTargets.splice(0, ro.activeTargets.length);
          ro.skippedTargets.splice(0, ro.skippedTargets.length);
          ro.observationTargets.forEach(function processTarget(ot) {
            if (ot.isActive()) {
              if (calculateDepthForNode(ot.target) > depth) {
                ro.activeTargets.push(ot);
              } else {
                ro.skippedTargets.push(ot);
              }
            }
          });
        });
      };
      var process$1 = function() {
        var depth = 0;
        gatherActiveObservationsAtDepth(depth);
        while (hasActiveObservations()) {
          depth = broadcastActiveObservations();
          gatherActiveObservationsAtDepth(depth);
        }
        if (hasSkippedObservations()) {
          deliverResizeLoopError();
        }
        return depth > 0;
      };
      var trigger;
      var callbacks = [];
      var notify = function() {
        return callbacks.splice(0).forEach(function(cb) {
          return cb();
        });
      };
      var queueMicroTask = function(callback) {
        if (!trigger) {
          var toggle_1 = 0;
          var el_1 = document.createTextNode("");
          var config = { characterData: true };
          new MutationObserver(function() {
            return notify();
          }).observe(el_1, config);
          trigger = function() {
            el_1.textContent = "".concat(toggle_1 ? toggle_1-- : toggle_1++);
          };
        }
        callbacks.push(callback);
        trigger();
      };
      var queueResizeObserver = function(cb) {
        queueMicroTask(function ResizeObserver2() {
          requestAnimationFrame(cb);
        });
      };
      var watching = 0;
      var isWatching = function() {
        return !!watching;
      };
      var CATCH_PERIOD = 250;
      var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
      var events = [
        "resize",
        "load",
        "transitionend",
        "animationend",
        "animationstart",
        "animationiteration",
        "keyup",
        "keydown",
        "mouseup",
        "mousedown",
        "mouseover",
        "mouseout",
        "blur",
        "focus"
      ];
      var time = function(timeout) {
        if (timeout === void 0) {
          timeout = 0;
        }
        return Date.now() + timeout;
      };
      var scheduled = false;
      var Scheduler = function() {
        function Scheduler2() {
          var _this = this;
          this.stopped = true;
          this.listener = function() {
            return _this.schedule();
          };
        }
        Scheduler2.prototype.run = function(timeout) {
          var _this = this;
          if (timeout === void 0) {
            timeout = CATCH_PERIOD;
          }
          if (scheduled) {
            return;
          }
          scheduled = true;
          var until = time(timeout);
          queueResizeObserver(function() {
            var elementsHaveResized = false;
            try {
              elementsHaveResized = process$1();
            } finally {
              scheduled = false;
              timeout = until - time();
              if (!isWatching()) {
                return;
              }
              if (elementsHaveResized) {
                _this.run(1e3);
              } else if (timeout > 0) {
                _this.run(timeout);
              } else {
                _this.start();
              }
            }
          });
        };
        Scheduler2.prototype.schedule = function() {
          this.stop();
          this.run();
        };
        Scheduler2.prototype.observe = function() {
          var _this = this;
          var cb = function() {
            return _this.observer && _this.observer.observe(document.body, observerConfig);
          };
          document.body ? cb() : global$1.addEventListener("DOMContentLoaded", cb);
        };
        Scheduler2.prototype.start = function() {
          var _this = this;
          if (this.stopped) {
            this.stopped = false;
            this.observer = new MutationObserver(this.listener);
            this.observe();
            events.forEach(function(name) {
              return global$1.addEventListener(name, _this.listener, true);
            });
          }
        };
        Scheduler2.prototype.stop = function() {
          var _this = this;
          if (!this.stopped) {
            this.observer && this.observer.disconnect();
            events.forEach(function(name) {
              return global$1.removeEventListener(name, _this.listener, true);
            });
            this.stopped = true;
          }
        };
        return Scheduler2;
      }();
      var scheduler = new Scheduler();
      var updateCount = function(n) {
        !watching && n > 0 && scheduler.start();
        watching += n;
        !watching && scheduler.stop();
      };
      var skipNotifyOnElement = function(target) {
        return !isSVG(target) && !isReplacedElement(target) && getComputedStyle(target).display === "inline";
      };
      var ResizeObservation = function() {
        function ResizeObservation2(target, observedBox) {
          this.target = target;
          this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
          this.lastReportedSize = {
            inlineSize: 0,
            blockSize: 0
          };
        }
        ResizeObservation2.prototype.isActive = function() {
          var size2 = calculateBoxSize(this.target, this.observedBox, true);
          if (skipNotifyOnElement(this.target)) {
            this.lastReportedSize = size2;
          }
          if (this.lastReportedSize.inlineSize !== size2.inlineSize || this.lastReportedSize.blockSize !== size2.blockSize) {
            return true;
          }
          return false;
        };
        return ResizeObservation2;
      }();
      var ResizeObserverDetail = /* @__PURE__ */ function() {
        function ResizeObserverDetail2(resizeObserver, callback) {
          this.activeTargets = [];
          this.skippedTargets = [];
          this.observationTargets = [];
          this.observer = resizeObserver;
          this.callback = callback;
        }
        return ResizeObserverDetail2;
      }();
      var observerMap = /* @__PURE__ */ new WeakMap();
      var getObservationIndex = function(observationTargets, target) {
        for (var i = 0; i < observationTargets.length; i += 1) {
          if (observationTargets[i].target === target) {
            return i;
          }
        }
        return -1;
      };
      var ResizeObserverController = function() {
        function ResizeObserverController2() {
        }
        ResizeObserverController2.connect = function(resizeObserver, callback) {
          var detail = new ResizeObserverDetail(resizeObserver, callback);
          observerMap.set(resizeObserver, detail);
        };
        ResizeObserverController2.observe = function(resizeObserver, target, options) {
          var detail = observerMap.get(resizeObserver);
          var firstObservation = detail.observationTargets.length === 0;
          if (getObservationIndex(detail.observationTargets, target) < 0) {
            firstObservation && resizeObservers.push(detail);
            detail.observationTargets.push(new ResizeObservation(target, options && options.box));
            updateCount(1);
            scheduler.schedule();
          }
        };
        ResizeObserverController2.unobserve = function(resizeObserver, target) {
          var detail = observerMap.get(resizeObserver);
          var index = getObservationIndex(detail.observationTargets, target);
          var lastObservation = detail.observationTargets.length === 1;
          if (index >= 0) {
            lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
            detail.observationTargets.splice(index, 1);
            updateCount(-1);
          }
        };
        ResizeObserverController2.disconnect = function(resizeObserver) {
          var _this = this;
          var detail = observerMap.get(resizeObserver);
          detail.observationTargets.slice().forEach(function(ot) {
            return _this.unobserve(resizeObserver, ot.target);
          });
          detail.activeTargets.splice(0, detail.activeTargets.length);
        };
        return ResizeObserverController2;
      }();
      var ResizeObserver = function() {
        function ResizeObserver2(callback) {
          if (arguments.length === 0) {
            throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
          }
          if (typeof callback !== "function") {
            throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
          }
          ResizeObserverController.connect(this, callback);
        }
        ResizeObserver2.prototype.observe = function(target, options) {
          if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
          }
          if (!isElement(target)) {
            throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
          }
          ResizeObserverController.observe(this, target, options);
        };
        ResizeObserver2.prototype.unobserve = function(target) {
          if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
          }
          if (!isElement(target)) {
            throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
          }
          ResizeObserverController.unobserve(this, target);
        };
        ResizeObserver2.prototype.disconnect = function() {
          ResizeObserverController.disconnect(this);
        };
        ResizeObserver2.toString = function() {
          return "function ResizeObserver () { [polyfill code] }";
        };
        return ResizeObserver2;
      }();
      class ResizeObserverDelegate {
        constructor() {
          this.handleResize = this.handleResize.bind(this);
          this.observer = new (typeof window !== "undefined" && window.ResizeObserver || ResizeObserver)(this.handleResize);
          this.elHandlersMap = /* @__PURE__ */ new Map();
        }
        handleResize(entries) {
          for (const entry of entries) {
            const handler = this.elHandlersMap.get(entry.target);
            if (handler !== void 0) {
              handler(entry);
            }
          }
        }
        registerHandler(el, handler) {
          this.elHandlersMap.set(el, handler);
          this.observer.observe(el);
        }
        unregisterHandler(el) {
          if (!this.elHandlersMap.has(el)) {
            return;
          }
          this.elHandlersMap.delete(el);
          this.observer.unobserve(el);
        }
      }
      const resizeObserverManager = new ResizeObserverDelegate();
      const VResizeObserver = /* @__PURE__ */ defineComponent({
        name: "ResizeObserver",
        props: {
          onResize: Function
        },
        setup(props) {
          let registered = false;
          const proxy = getCurrentInstance().proxy;
          function handleResize(entry) {
            const { onResize } = props;
            if (onResize !== void 0)
              onResize(entry);
          }
          onMounted(() => {
            const el = proxy.$el;
            if (el === void 0) {
              warn("resize-observer", "$el does not exist.");
              return;
            }
            if (el.nextElementSibling !== el.nextSibling) {
              if (el.nodeType === 3 && el.nodeValue !== "") {
                warn("resize-observer", "$el can not be observed (it may be a text node).");
                return;
              }
            }
            if (el.nextElementSibling !== null) {
              resizeObserverManager.registerHandler(el.nextElementSibling, handleResize);
              registered = true;
            }
          });
          onBeforeUnmount(() => {
            if (registered) {
              resizeObserverManager.unregisterHandler(proxy.$el.nextElementSibling);
            }
          });
        },
        render() {
          return renderSlot(this.$slots, "default");
        }
      });
      function isHTMLElement(node) {
        return node instanceof HTMLElement;
      }
      function focusFirstDescendant(node) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (isHTMLElement(child)) {
            if (attemptFocus(child) || focusFirstDescendant(child)) {
              return true;
            }
          }
        }
        return false;
      }
      function focusLastDescendant(element) {
        for (let i = element.childNodes.length - 1; i >= 0; i--) {
          const child = element.childNodes[i];
          if (isHTMLElement(child)) {
            if (attemptFocus(child) || focusLastDescendant(child)) {
              return true;
            }
          }
        }
        return false;
      }
      function attemptFocus(element) {
        if (!isFocusable(element)) {
          return false;
        }
        try {
          element.focus({ preventScroll: true });
        } catch (e) {
        }
        return document.activeElement === element;
      }
      function isFocusable(element) {
        if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) {
          return true;
        }
        if (element.getAttribute("disabled")) {
          return false;
        }
        switch (element.nodeName) {
          case "A":
            return !!element.href && element.rel !== "ignore";
          case "INPUT":
            return element.type !== "hidden" && element.type !== "file";
          case "BUTTON":
          case "SELECT":
          case "TEXTAREA":
            return true;
          default:
            return false;
        }
      }
      let stack = [];
      const FocusTrap = /* @__PURE__ */ defineComponent({
        name: "FocusTrap",
        props: {
          disabled: Boolean,
          active: Boolean,
          autoFocus: {
            type: Boolean,
            default: true
          },
          onEsc: Function,
          initialFocusTo: String,
          finalFocusTo: String,
          returnFocusOnDeactivated: {
            type: Boolean,
            default: true
          }
        },
        setup(props) {
          const id = createId();
          const focusableStartRef = ref(null);
          const focusableEndRef = ref(null);
          let activated = false;
          let ignoreInternalFocusChange = false;
          const lastFocusedElement = typeof document === "undefined" ? null : document.activeElement;
          function isCurrentActive() {
            const currentActiveId = stack[stack.length - 1];
            return currentActiveId === id;
          }
          function handleDocumentKeydown(e) {
            var _a;
            if (e.code === "Escape") {
              if (isCurrentActive()) {
                (_a = props.onEsc) === null || _a === void 0 ? void 0 : _a.call(props, e);
              }
            }
          }
          onMounted(() => {
            watch(() => props.active, (value) => {
              if (value) {
                activate();
                on("keydown", document, handleDocumentKeydown);
              } else {
                off("keydown", document, handleDocumentKeydown);
                if (activated) {
                  deactivate();
                }
              }
            }, {
              immediate: true
            });
          });
          onBeforeUnmount(() => {
            off("keydown", document, handleDocumentKeydown);
            if (activated)
              deactivate();
          });
          function handleDocumentFocus(e) {
            if (ignoreInternalFocusChange)
              return;
            if (isCurrentActive()) {
              const mainEl = getMainEl();
              if (mainEl === null)
                return;
              if (mainEl.contains(getPreciseEventTarget(e)))
                return;
              resetFocusTo("first");
            }
          }
          function getMainEl() {
            const focusableStartEl = focusableStartRef.value;
            if (focusableStartEl === null)
              return null;
            let mainEl = focusableStartEl;
            while (true) {
              mainEl = mainEl.nextSibling;
              if (mainEl === null)
                break;
              if (mainEl instanceof Element && mainEl.tagName === "DIV") {
                break;
              }
            }
            return mainEl;
          }
          function activate() {
            var _a;
            if (props.disabled)
              return;
            stack.push(id);
            if (props.autoFocus) {
              const { initialFocusTo } = props;
              if (initialFocusTo === void 0) {
                resetFocusTo("first");
              } else {
                (_a = resolveTo(initialFocusTo)) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
              }
            }
            activated = true;
            document.addEventListener("focus", handleDocumentFocus, true);
          }
          function deactivate() {
            var _a;
            if (props.disabled)
              return;
            document.removeEventListener("focus", handleDocumentFocus, true);
            stack = stack.filter((idInStack) => idInStack !== id);
            if (isCurrentActive())
              return;
            const { finalFocusTo } = props;
            if (finalFocusTo !== void 0) {
              (_a = resolveTo(finalFocusTo)) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
            } else if (props.returnFocusOnDeactivated) {
              if (lastFocusedElement instanceof HTMLElement) {
                ignoreInternalFocusChange = true;
                lastFocusedElement.focus({ preventScroll: true });
                ignoreInternalFocusChange = false;
              }
            }
          }
          function resetFocusTo(target) {
            if (!isCurrentActive())
              return;
            if (props.active) {
              const focusableStartEl = focusableStartRef.value;
              const focusableEndEl = focusableEndRef.value;
              if (focusableStartEl !== null && focusableEndEl !== null) {
                const mainEl = getMainEl();
                if (mainEl == null || mainEl === focusableEndEl) {
                  ignoreInternalFocusChange = true;
                  focusableStartEl.focus({ preventScroll: true });
                  ignoreInternalFocusChange = false;
                  return;
                }
                ignoreInternalFocusChange = true;
                const focused = target === "first" ? focusFirstDescendant(mainEl) : focusLastDescendant(mainEl);
                ignoreInternalFocusChange = false;
                if (!focused) {
                  ignoreInternalFocusChange = true;
                  focusableStartEl.focus({ preventScroll: true });
                  ignoreInternalFocusChange = false;
                }
              }
            }
          }
          function handleStartFocus(e) {
            if (ignoreInternalFocusChange)
              return;
            const mainEl = getMainEl();
            if (mainEl === null)
              return;
            if (e.relatedTarget !== null && mainEl.contains(e.relatedTarget)) {
              resetFocusTo("last");
            } else {
              resetFocusTo("first");
            }
          }
          function handleEndFocus(e) {
            if (ignoreInternalFocusChange)
              return;
            if (e.relatedTarget !== null && e.relatedTarget === focusableStartRef.value) {
              resetFocusTo("last");
            } else {
              resetFocusTo("first");
            }
          }
          return {
            focusableStartRef,
            focusableEndRef,
            focusableStyle: "position: absolute; height: 0; width: 0;",
            handleStartFocus,
            handleEndFocus
          };
        },
        render() {
          const { default: defaultSlot } = this.$slots;
          if (defaultSlot === void 0)
            return null;
          if (this.disabled)
            return defaultSlot();
          const { active, focusableStyle } = this;
          return h(Fragment, null, [
            h("div", {
              "aria-hidden": "true",
              tabindex: active ? "0" : "-1",
              ref: "focusableStartRef",
              style: focusableStyle,
              onFocus: this.handleStartFocus
            }),
            defaultSlot(),
            h("div", {
              "aria-hidden": "true",
              style: focusableStyle,
              ref: "focusableEndRef",
              tabindex: active ? "0" : "-1",
              onFocus: this.handleEndFocus
            })
          ]);
        }
      });
      let lockCount = 0;
      let originalMarginRight = "";
      let originalOverflow = "";
      let originalOverflowX = "";
      let originalOverflowY = "";
      const lockHtmlScrollRightCompensationRef = ref("0px");
      function useLockHtmlScroll(lockRef) {
        if (typeof document === "undefined")
          return;
        const el = document.documentElement;
        let watchStopHandle;
        let activated = false;
        const unlock = () => {
          el.style.marginRight = originalMarginRight;
          el.style.overflow = originalOverflow;
          el.style.overflowX = originalOverflowX;
          el.style.overflowY = originalOverflowY;
          lockHtmlScrollRightCompensationRef.value = "0px";
        };
        onMounted(() => {
          watchStopHandle = watch(lockRef, (value) => {
            if (value) {
              if (!lockCount) {
                const scrollbarWidth = window.innerWidth - el.offsetWidth;
                if (scrollbarWidth > 0) {
                  originalMarginRight = el.style.marginRight;
                  el.style.marginRight = `${scrollbarWidth}px`;
                  lockHtmlScrollRightCompensationRef.value = `${scrollbarWidth}px`;
                }
                originalOverflow = el.style.overflow;
                originalOverflowX = el.style.overflowX;
                originalOverflowY = el.style.overflowY;
                el.style.overflow = "hidden";
                el.style.overflowX = "hidden";
                el.style.overflowY = "hidden";
              }
              activated = true;
              lockCount++;
            } else {
              lockCount--;
              if (!lockCount) {
                unlock();
              }
              activated = false;
            }
          }, {
            immediate: true
          });
        });
        onBeforeUnmount(() => {
          watchStopHandle === null || watchStopHandle === void 0 ? void 0 : watchStopHandle();
          if (activated) {
            lockCount--;
            if (!lockCount) {
              unlock();
            }
            activated = false;
          }
        });
      }
      const isComposingRef = ref(false);
      const compositionStartHandler = () => {
        isComposingRef.value = true;
      };
      const compositionEndHandler = () => {
        isComposingRef.value = false;
      };
      let mountedCount = 0;
      const useIsComposing = () => {
        if (isBrowser$1) {
          onBeforeMount(() => {
            if (!mountedCount) {
              window.addEventListener("compositionstart", compositionStartHandler);
              window.addEventListener("compositionend", compositionEndHandler);
            }
            mountedCount++;
          });
          onBeforeUnmount(() => {
            if (mountedCount <= 1) {
              window.removeEventListener("compositionstart", compositionStartHandler);
              window.removeEventListener("compositionend", compositionEndHandler);
              mountedCount = 0;
            } else {
              mountedCount--;
            }
          });
        }
        return isComposingRef;
      };
      function useReactivated(callback) {
        const isDeactivatedRef = {
          isDeactivated: false
        };
        let activateStateInitialized = false;
        onActivated(() => {
          isDeactivatedRef.isDeactivated = false;
          if (!activateStateInitialized) {
            activateStateInitialized = true;
            return;
          }
          callback();
        });
        onDeactivated(() => {
          isDeactivatedRef.isDeactivated = true;
          if (!activateStateInitialized) {
            activateStateInitialized = true;
          }
        });
        return isDeactivatedRef;
      }
      const formItemInjectionKey = createInjectionKey("n-form-item");
      function useFormItem(props, {
        defaultSize = "medium",
        mergedSize,
        mergedDisabled
      } = {}) {
        const NFormItem = inject(formItemInjectionKey, null);
        provide(formItemInjectionKey, null);
        const mergedSizeRef = computed(mergedSize ? () => mergedSize(NFormItem) : () => {
          const {
            size: size2
          } = props;
          if (size2)
            return size2;
          if (NFormItem) {
            const {
              mergedSize: mergedSize2
            } = NFormItem;
            if (mergedSize2.value !== void 0) {
              return mergedSize2.value;
            }
          }
          return defaultSize;
        });
        const mergedDisabledRef = computed(mergedDisabled ? () => mergedDisabled(NFormItem) : () => {
          const {
            disabled
          } = props;
          if (disabled !== void 0) {
            return disabled;
          }
          if (NFormItem) {
            return NFormItem.disabled.value;
          }
          return false;
        });
        const mergedStatusRef = computed(() => {
          const {
            status
          } = props;
          if (status)
            return status;
          return NFormItem === null || NFormItem === void 0 ? void 0 : NFormItem.mergedValidationStatus.value;
        });
        onBeforeUnmount(() => {
          if (NFormItem) {
            NFormItem.restoreValidation();
          }
        });
        return {
          mergedSizeRef,
          mergedDisabledRef,
          mergedStatusRef,
          nTriggerFormBlur() {
            if (NFormItem) {
              NFormItem.handleContentBlur();
            }
          },
          nTriggerFormChange() {
            if (NFormItem) {
              NFormItem.handleContentChange();
            }
          },
          nTriggerFormFocus() {
            if (NFormItem) {
              NFormItem.handleContentFocus();
            }
          },
          nTriggerFormInput() {
            if (NFormItem) {
              NFormItem.handleContentInput();
            }
          }
        };
      }
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var Symbol$1 = root.Symbol;
      var objectProto$a = Object.prototype;
      var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
      var nativeObjectToString$1 = objectProto$a.toString;
      var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$8.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
      var objectProto$9 = Object.prototype;
      var nativeObjectToString = objectProto$9.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
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
      var symbolTag = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      var isArray = Array.isArray;
      var INFINITY$1 = 1 / 0;
      var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
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
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid2 = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid2 ? "Symbol(src)_1." + uid2 : "";
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
      var funcProto$1 = Function.prototype, objectProto$8 = Object.prototype;
      var funcToString$1 = funcProto$1.toString;
      var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString$1.call(hasOwnProperty$7).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getValue$1(object, key) {
        return object == null ? void 0 : object[key];
      }
      function getNative(object, key) {
        var value = getValue$1(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      var objectCreate = Object.create;
      var baseCreate = /* @__PURE__ */ function() {
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
      var baseSetToString = !defineProperty ? identity : function(func, string2) {
        return defineProperty(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string2),
          "writable": true
        });
      };
      const baseSetToString$1 = baseSetToString;
      var setToString = shortOut(baseSetToString$1);
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
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
      var objectProto$7 = Object.prototype;
      var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
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
      var nativeMax = Math.max;
      function overRest(func, start, transform) {
        start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
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
        return setToString(overRest(func, start, identity), func + "");
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
      var objectProto$6 = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$6;
        return value === proto;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      var argsTag$1 = "[object Arguments]";
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag$1;
      }
      var objectProto$5 = Object.prototype;
      var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
      var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
      var isArguments = baseIsArguments(/* @__PURE__ */ function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$5.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      const isArguments$1 = isArguments;
      function stubFalse() {
        return false;
      }
      var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
      var Buffer$1 = moduleExports$2 ? root.Buffer : void 0;
      var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
      var isBuffer = nativeIsBuffer || stubFalse;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag$1 = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
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
      var freeProcess = moduleExports$1 && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types2 = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
          if (types2) {
            return types2;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      var objectProto$4 = Object.prototype;
      var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty$4.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
          isIndex(key, length)))) {
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
      function nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }
        return result;
      }
      var objectProto$3 = Object.prototype;
      var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty$3.call(object, key)))) {
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
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      var nativeCreate = getNative(Object, "create");
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }
      var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED$1 ? void 0 : result;
        }
        return hasOwnProperty$2.call(data, key) ? data[key] : void 0;
      }
      var objectProto$1 = Object.prototype;
      var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty$1.call(data, key);
      }
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
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
      function getMapData(map, key) {
        var data = map.__data__;
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
      var FUNC_ERROR_TEXT = "Expected a function";
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
          if (cache2.has(key)) {
            return cache2.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache2.set(key, result) || cache2;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      var MAX_MEMOIZE_SIZE = 500;
      function memoizeCapped(func) {
        var result = memoize(func, function(key) {
          if (cache2.size === MAX_MEMOIZE_SIZE) {
            cache2.clear();
          }
          return key;
        });
        var cache2 = result.cache;
        return result;
      }
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = memoizeCapped(function(string2) {
        var result = [];
        if (string2.charCodeAt(0) === 46) {
          result.push("");
        }
        string2.replace(rePropName, function(match2, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
        });
        return result;
      });
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
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
      var getPrototype = overArg(Object.getPrototypeOf, Object);
      var objectTag = "[object Object]";
      var funcProto = Function.prototype, objectProto = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var objectCtorString = funcToString.call(Object);
      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      function baseSlice(array, start, end) {
        var index = -1, length = array.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result = Array(length);
        while (++index < length) {
          result[index] = array[index + start];
        }
        return result;
      }
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === void 0 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }
      var rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1, rsVarRange$1 = "\\ufe0e\\ufe0f";
      var rsZWJ$1 = "\\u200d";
      var reHasUnicode = RegExp("[" + rsZWJ$1 + rsAstralRange$1 + rsComboRange$1 + rsVarRange$1 + "]");
      function hasUnicode(string2) {
        return reHasUnicode.test(string2);
      }
      function asciiToArray(string2) {
        return string2.split("");
      }
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
      var rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
      var reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      function unicodeToArray(string2) {
        return string2.match(reUnicode) || [];
      }
      function stringToArray(string2) {
        return hasUnicode(string2) ? unicodeToArray(string2) : asciiToArray(string2);
      }
      function createCaseFirst(methodName) {
        return function(string2) {
          string2 = toString(string2);
          var strSymbols = hasUnicode(string2) ? stringToArray(string2) : void 0;
          var chr = strSymbols ? strSymbols[0] : string2.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string2.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      var upperFirst = createCaseFirst("toUpperCase");
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
          if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
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
      var Buffer2 = moduleExports ? root.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result);
        return result;
      }
      var Uint8Array2 = root.Uint8Array;
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
        return result;
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
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
      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack2) {
        var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack2.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack2) : void 0;
        var isCommon = newValue === void 0;
        if (isCommon) {
          var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
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
          stack2.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack2);
          stack2["delete"](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }
      function baseMerge(object, source, srcIndex, customizer, stack2) {
        if (object === source) {
          return;
        }
        baseFor(source, function(srcValue, key) {
          stack2 || (stack2 = new Stack());
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack2);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack2) : void 0;
            if (newValue === void 0) {
              newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      const commonVariables$3 = {
        fontFamily: 'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fontFamilyMono: "v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace",
        fontWeight: "400",
        fontWeightStrong: "500",
        cubicBezierEaseInOut: "cubic-bezier(.4, 0, .2, 1)",
        cubicBezierEaseOut: "cubic-bezier(0, 0, .2, 1)",
        cubicBezierEaseIn: "cubic-bezier(.4, 0, 1, 1)",
        borderRadius: "3px",
        borderRadiusSmall: "2px",
        fontSize: "14px",
        fontSizeMini: "12px",
        fontSizeTiny: "12px",
        fontSizeSmall: "14px",
        fontSizeMedium: "14px",
        fontSizeLarge: "15px",
        fontSizeHuge: "16px",
        lineHeight: "1.6",
        heightMini: "16px",
        // private now, it's too small
        heightTiny: "22px",
        heightSmall: "28px",
        heightMedium: "34px",
        heightLarge: "40px",
        heightHuge: "46px"
      };
      const {
        fontSize,
        fontFamily,
        lineHeight
      } = commonVariables$3;
      const globalStyle = c("body", `
 margin: 0;
 font-size: ${fontSize};
 font-family: ${fontFamily};
 line-height: ${lineHeight};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [c("input", `
 font-family: inherit;
 font-size: inherit;
 `)]);
      const configProviderInjectionKey = createInjectionKey("n-config-provider");
      const cssrAnchorMetaName = "naive-ui-style";
      function createTheme(theme) {
        return theme;
      }
      function useTheme(resolveId, mountId, style2, defaultTheme, props, clsPrefixRef) {
        const ssrAdapter2 = useSsrAdapter();
        const NConfigProvider = inject(configProviderInjectionKey, null);
        if (style2) {
          const mountStyle = () => {
            const clsPrefix = clsPrefixRef === null || clsPrefixRef === void 0 ? void 0 : clsPrefixRef.value;
            style2.mount({
              id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
              head: true,
              props: {
                bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
              },
              anchorMetaName: cssrAnchorMetaName,
              ssr: ssrAdapter2
            });
            if (!(NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.preflightStyleDisabled)) {
              globalStyle.mount({
                id: "n-global",
                head: true,
                anchorMetaName: cssrAnchorMetaName,
                ssr: ssrAdapter2
              });
            }
          };
          if (ssrAdapter2) {
            mountStyle();
          } else {
            onBeforeMount(mountStyle);
          }
        }
        const mergedThemeRef = computed(() => {
          var _a;
          const {
            theme: {
              common: selfCommon,
              self: self2,
              peers = {}
            } = {},
            themeOverrides: selfOverrides = {},
            builtinThemeOverrides: builtinOverrides = {}
          } = props;
          const {
            common: selfCommonOverrides,
            peers: peersOverrides
          } = selfOverrides;
          const {
            common: globalCommon = void 0,
            [resolveId]: {
              common: globalSelfCommon = void 0,
              self: globalSelf = void 0,
              peers: globalPeers = {}
            } = {}
          } = (NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedThemeRef.value) || {};
          const {
            common: globalCommonOverrides = void 0,
            [resolveId]: globalSelfOverrides = {}
          } = (NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedThemeOverridesRef.value) || {};
          const {
            common: globalSelfCommonOverrides,
            peers: globalPeersOverrides = {}
          } = globalSelfOverrides;
          const mergedCommon = merge({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
          const mergedSelf = merge(
            // {}, executed every time, no need for empty obj
            (_a = self2 || globalSelf || defaultTheme.self) === null || _a === void 0 ? void 0 : _a(mergedCommon),
            builtinOverrides,
            globalSelfOverrides,
            selfOverrides
          );
          return {
            common: mergedCommon,
            self: mergedSelf,
            peers: merge({}, defaultTheme.peers, globalPeers, peers),
            peerOverrides: merge({}, builtinOverrides.peers, globalPeersOverrides, peersOverrides)
          };
        });
        return mergedThemeRef;
      }
      useTheme.props = {
        theme: Object,
        themeOverrides: Object,
        builtinThemeOverrides: Object
      };
      const defaultClsPrefix = "n";
      function useConfig(props = {}, options = {
        defaultBordered: true
      }) {
        const NConfigProvider = inject(configProviderInjectionKey, null);
        return {
          // NConfigProvider,
          inlineThemeDisabled: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.inlineThemeDisabled,
          mergedRtlRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedRtlRef,
          mergedComponentPropsRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedComponentPropsRef,
          mergedBreakpointsRef: NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedBreakpointsRef,
          mergedBorderedRef: computed(() => {
            var _a, _b;
            const {
              bordered
            } = props;
            if (bordered !== void 0)
              return bordered;
            return (_b = (_a = NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedBorderedRef.value) !== null && _a !== void 0 ? _a : options.defaultBordered) !== null && _b !== void 0 ? _b : true;
          }),
          mergedClsPrefixRef: NConfigProvider ? NConfigProvider.mergedClsPrefixRef : shallowRef(defaultClsPrefix),
          namespaceRef: computed(() => NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.mergedNamespaceRef.value)
        };
      }
      const enUS = {
        name: "en-US",
        global: {
          undo: "Undo",
          redo: "Redo",
          confirm: "Confirm",
          clear: "Clear"
        },
        Popconfirm: {
          positiveText: "Confirm",
          negativeText: "Cancel"
        },
        Cascader: {
          placeholder: "Please Select",
          loading: "Loading",
          loadingRequiredMessage: (label) => `Please load all ${label}'s descendants before checking it.`
        },
        Time: {
          dateFormat: "yyyy-MM-dd",
          dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
        },
        DatePicker: {
          yearFormat: "yyyy",
          monthFormat: "MMM",
          dayFormat: "eeeeee",
          yearTypeFormat: "yyyy",
          monthTypeFormat: "yyyy-MM",
          dateFormat: "yyyy-MM-dd",
          dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
          quarterFormat: "yyyy-qqq",
          weekFormat: "yyyy-w",
          clear: "Clear",
          now: "Now",
          confirm: "Confirm",
          selectTime: "Select Time",
          selectDate: "Select Date",
          datePlaceholder: "Select Date",
          datetimePlaceholder: "Select Date and Time",
          monthPlaceholder: "Select Month",
          yearPlaceholder: "Select Year",
          quarterPlaceholder: "Select Quarter",
          weekPlaceholder: "Select Week",
          startDatePlaceholder: "Start Date",
          endDatePlaceholder: "End Date",
          startDatetimePlaceholder: "Start Date and Time",
          endDatetimePlaceholder: "End Date and Time",
          startMonthPlaceholder: "Start Month",
          endMonthPlaceholder: "End Month",
          monthBeforeYear: true,
          firstDayOfWeek: 6,
          today: "Today"
        },
        DataTable: {
          checkTableAll: "Select all in the table",
          uncheckTableAll: "Unselect all in the table",
          confirm: "Confirm",
          clear: "Clear"
        },
        LegacyTransfer: {
          sourceTitle: "Source",
          targetTitle: "Target"
        },
        Transfer: {
          selectAll: "Select all",
          unselectAll: "Unselect all",
          clearAll: "Clear",
          total: (num) => `Total ${num} items`,
          selected: (num) => `${num} items selected`
        },
        Empty: {
          description: "No Data"
        },
        Select: {
          placeholder: "Please Select"
        },
        TimePicker: {
          placeholder: "Select Time",
          positiveText: "OK",
          negativeText: "Cancel",
          now: "Now",
          clear: "Clear"
        },
        Pagination: {
          goto: "Goto",
          selectionSuffix: "page"
        },
        DynamicTags: {
          add: "Add"
        },
        Log: {
          loading: "Loading"
        },
        Input: {
          placeholder: "Please Input"
        },
        InputNumber: {
          placeholder: "Please Input"
        },
        DynamicInput: {
          create: "Create"
        },
        ThemeEditor: {
          title: "Theme Editor",
          clearAllVars: "Clear All Variables",
          clearSearch: "Clear Search",
          filterCompName: "Filter Component Name",
          filterVarName: "Filter Variable Name",
          import: "Import",
          export: "Export",
          restore: "Reset to Default"
        },
        Image: {
          tipPrevious: "Previous picture (←)",
          tipNext: "Next picture (→)",
          tipCounterclockwise: "Counterclockwise",
          tipClockwise: "Clockwise",
          tipZoomOut: "Zoom out",
          tipZoomIn: "Zoom in",
          tipDownload: "Download",
          tipClose: "Close (Esc)",
          // TODO: translation
          tipOriginalSize: "Zoom to original size"
        }
      };
      const enUS$1 = enUS;
      function buildFormatLongFn(args) {
        return function() {
          var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          var width = options.width ? String(options.width) : args.defaultWidth;
          var format2 = args.formats[width] || args.formats[args.defaultWidth];
          return format2;
        };
      }
      function buildLocalizeFn(args) {
        return function(dirtyIndex, options) {
          var context = options !== null && options !== void 0 && options.context ? String(options.context) : "standalone";
          var valuesArray;
          if (context === "formatting" && args.formattingValues) {
            var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
            var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
            valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
          } else {
            var _defaultWidth = args.defaultWidth;
            var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
            valuesArray = args.values[_width] || args.values[_defaultWidth];
          }
          var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
          return valuesArray[index];
        };
      }
      function buildMatchFn(args) {
        return function(string2) {
          var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var width = options.width;
          var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
          var matchResult = string2.match(matchPattern);
          if (!matchResult) {
            return null;
          }
          var matchedString = matchResult[0];
          var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
          var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
            return pattern.test(matchedString);
          }) : findKey(parsePatterns, function(pattern) {
            return pattern.test(matchedString);
          });
          var value;
          value = args.valueCallback ? args.valueCallback(key) : key;
          value = options.valueCallback ? options.valueCallback(value) : value;
          var rest = string2.slice(matchedString.length);
          return {
            value,
            rest
          };
        };
      }
      function findKey(object, predicate) {
        for (var key in object) {
          if (object.hasOwnProperty(key) && predicate(object[key])) {
            return key;
          }
        }
        return void 0;
      }
      function findIndex(array, predicate) {
        for (var key = 0; key < array.length; key++) {
          if (predicate(array[key])) {
            return key;
          }
        }
        return void 0;
      }
      function buildMatchPatternFn(args) {
        return function(string2) {
          var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var matchResult = string2.match(args.matchPattern);
          if (!matchResult)
            return null;
          var matchedString = matchResult[0];
          var parseResult = string2.match(args.parsePattern);
          if (!parseResult)
            return null;
          var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
          value = options.valueCallback ? options.valueCallback(value) : value;
          var rest = string2.slice(matchedString.length);
          return {
            value,
            rest
          };
        };
      }
      var formatDistanceLocale = {
        lessThanXSeconds: {
          one: "less than a second",
          other: "less than {{count}} seconds"
        },
        xSeconds: {
          one: "1 second",
          other: "{{count}} seconds"
        },
        halfAMinute: "half a minute",
        lessThanXMinutes: {
          one: "less than a minute",
          other: "less than {{count}} minutes"
        },
        xMinutes: {
          one: "1 minute",
          other: "{{count}} minutes"
        },
        aboutXHours: {
          one: "about 1 hour",
          other: "about {{count}} hours"
        },
        xHours: {
          one: "1 hour",
          other: "{{count}} hours"
        },
        xDays: {
          one: "1 day",
          other: "{{count}} days"
        },
        aboutXWeeks: {
          one: "about 1 week",
          other: "about {{count}} weeks"
        },
        xWeeks: {
          one: "1 week",
          other: "{{count}} weeks"
        },
        aboutXMonths: {
          one: "about 1 month",
          other: "about {{count}} months"
        },
        xMonths: {
          one: "1 month",
          other: "{{count}} months"
        },
        aboutXYears: {
          one: "about 1 year",
          other: "about {{count}} years"
        },
        xYears: {
          one: "1 year",
          other: "{{count}} years"
        },
        overXYears: {
          one: "over 1 year",
          other: "over {{count}} years"
        },
        almostXYears: {
          one: "almost 1 year",
          other: "almost {{count}} years"
        }
      };
      var formatDistance = function formatDistance2(token, count, options) {
        var result;
        var tokenValue = formatDistanceLocale[token];
        if (typeof tokenValue === "string") {
          result = tokenValue;
        } else if (count === 1) {
          result = tokenValue.one;
        } else {
          result = tokenValue.other.replace("{{count}}", count.toString());
        }
        if (options !== null && options !== void 0 && options.addSuffix) {
          if (options.comparison && options.comparison > 0) {
            return "in " + result;
          } else {
            return result + " ago";
          }
        }
        return result;
      };
      const formatDistance$1 = formatDistance;
      var dateFormats = {
        full: "EEEE, MMMM do, y",
        long: "MMMM do, y",
        medium: "MMM d, y",
        short: "MM/dd/yyyy"
      };
      var timeFormats = {
        full: "h:mm:ss a zzzz",
        long: "h:mm:ss a z",
        medium: "h:mm:ss a",
        short: "h:mm a"
      };
      var dateTimeFormats = {
        full: "{{date}} 'at' {{time}}",
        long: "{{date}} 'at' {{time}}",
        medium: "{{date}}, {{time}}",
        short: "{{date}}, {{time}}"
      };
      var formatLong = {
        date: buildFormatLongFn({
          formats: dateFormats,
          defaultWidth: "full"
        }),
        time: buildFormatLongFn({
          formats: timeFormats,
          defaultWidth: "full"
        }),
        dateTime: buildFormatLongFn({
          formats: dateTimeFormats,
          defaultWidth: "full"
        })
      };
      const formatLong$1 = formatLong;
      var formatRelativeLocale = {
        lastWeek: "'last' eeee 'at' p",
        yesterday: "'yesterday at' p",
        today: "'today at' p",
        tomorrow: "'tomorrow at' p",
        nextWeek: "eeee 'at' p",
        other: "P"
      };
      var formatRelative = function formatRelative2(token, _date, _baseDate, _options) {
        return formatRelativeLocale[token];
      };
      const formatRelative$1 = formatRelative;
      var eraValues = {
        narrow: ["B", "A"],
        abbreviated: ["BC", "AD"],
        wide: ["Before Christ", "Anno Domini"]
      };
      var quarterValues = {
        narrow: ["1", "2", "3", "4"],
        abbreviated: ["Q1", "Q2", "Q3", "Q4"],
        wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
      };
      var monthValues = {
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      };
      var dayValues = {
        narrow: ["S", "M", "T", "W", "T", "F", "S"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      };
      var dayPeriodValues = {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night"
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night"
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "morning",
          afternoon: "afternoon",
          evening: "evening",
          night: "night"
        }
      };
      var formattingDayPeriodValues = {
        narrow: {
          am: "a",
          pm: "p",
          midnight: "mi",
          noon: "n",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night"
        },
        abbreviated: {
          am: "AM",
          pm: "PM",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night"
        },
        wide: {
          am: "a.m.",
          pm: "p.m.",
          midnight: "midnight",
          noon: "noon",
          morning: "in the morning",
          afternoon: "in the afternoon",
          evening: "in the evening",
          night: "at night"
        }
      };
      var ordinalNumber = function ordinalNumber2(dirtyNumber, _options) {
        var number = Number(dirtyNumber);
        var rem100 = number % 100;
        if (rem100 > 20 || rem100 < 10) {
          switch (rem100 % 10) {
            case 1:
              return number + "st";
            case 2:
              return number + "nd";
            case 3:
              return number + "rd";
          }
        }
        return number + "th";
      };
      var localize = {
        ordinalNumber,
        era: buildLocalizeFn({
          values: eraValues,
          defaultWidth: "wide"
        }),
        quarter: buildLocalizeFn({
          values: quarterValues,
          defaultWidth: "wide",
          argumentCallback: function argumentCallback(quarter) {
            return quarter - 1;
          }
        }),
        month: buildLocalizeFn({
          values: monthValues,
          defaultWidth: "wide"
        }),
        day: buildLocalizeFn({
          values: dayValues,
          defaultWidth: "wide"
        }),
        dayPeriod: buildLocalizeFn({
          values: dayPeriodValues,
          defaultWidth: "wide",
          formattingValues: formattingDayPeriodValues,
          defaultFormattingWidth: "wide"
        })
      };
      const localize$1 = localize;
      var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
      var parseOrdinalNumberPattern = /\d+/i;
      var matchEraPatterns = {
        narrow: /^(b|a)/i,
        abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
        wide: /^(before christ|before common era|anno domini|common era)/i
      };
      var parseEraPatterns = {
        any: [/^b/i, /^(a|c)/i]
      };
      var matchQuarterPatterns = {
        narrow: /^[1234]/i,
        abbreviated: /^q[1234]/i,
        wide: /^[1234](th|st|nd|rd)? quarter/i
      };
      var parseQuarterPatterns = {
        any: [/1/i, /2/i, /3/i, /4/i]
      };
      var matchMonthPatterns = {
        narrow: /^[jfmasond]/i,
        abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
        wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
      };
      var parseMonthPatterns = {
        narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
        any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
      };
      var matchDayPatterns = {
        narrow: /^[smtwf]/i,
        short: /^(su|mo|tu|we|th|fr|sa)/i,
        abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
        wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
      };
      var parseDayPatterns = {
        narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
        any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
      };
      var matchDayPeriodPatterns = {
        narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
        any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
      };
      var parseDayPeriodPatterns = {
        any: {
          am: /^a/i,
          pm: /^p/i,
          midnight: /^mi/i,
          noon: /^no/i,
          morning: /morning/i,
          afternoon: /afternoon/i,
          evening: /evening/i,
          night: /night/i
        }
      };
      var match = {
        ordinalNumber: buildMatchPatternFn({
          matchPattern: matchOrdinalNumberPattern,
          parsePattern: parseOrdinalNumberPattern,
          valueCallback: function valueCallback(value) {
            return parseInt(value, 10);
          }
        }),
        era: buildMatchFn({
          matchPatterns: matchEraPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseEraPatterns,
          defaultParseWidth: "any"
        }),
        quarter: buildMatchFn({
          matchPatterns: matchQuarterPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseQuarterPatterns,
          defaultParseWidth: "any",
          valueCallback: function valueCallback(index) {
            return index + 1;
          }
        }),
        month: buildMatchFn({
          matchPatterns: matchMonthPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseMonthPatterns,
          defaultParseWidth: "any"
        }),
        day: buildMatchFn({
          matchPatterns: matchDayPatterns,
          defaultMatchWidth: "wide",
          parsePatterns: parseDayPatterns,
          defaultParseWidth: "any"
        }),
        dayPeriod: buildMatchFn({
          matchPatterns: matchDayPeriodPatterns,
          defaultMatchWidth: "any",
          parsePatterns: parseDayPeriodPatterns,
          defaultParseWidth: "any"
        })
      };
      const match$1 = match;
      var locale = {
        code: "en-US",
        formatDistance: formatDistance$1,
        formatLong: formatLong$1,
        formatRelative: formatRelative$1,
        localize: localize$1,
        match: match$1,
        options: {
          weekStartsOn: 0,
          firstWeekContainsDate: 1
        }
      };
      const defaultLocale = locale;
      const dateEnUs = {
        name: "en-US",
        locale: defaultLocale
      };
      const dateEnUS = dateEnUs;
      function useLocale(ns) {
        const {
          mergedLocaleRef,
          mergedDateLocaleRef
        } = inject(configProviderInjectionKey, null) || {};
        const localeRef = computed(() => {
          var _a, _b;
          return (_b = (_a = mergedLocaleRef === null || mergedLocaleRef === void 0 ? void 0 : mergedLocaleRef.value) === null || _a === void 0 ? void 0 : _a[ns]) !== null && _b !== void 0 ? _b : enUS$1[ns];
        });
        const dateLocaleRef = computed(() => {
          var _a;
          return (_a = mergedDateLocaleRef === null || mergedDateLocaleRef === void 0 ? void 0 : mergedDateLocaleRef.value) !== null && _a !== void 0 ? _a : dateEnUS;
        });
        return {
          dateLocaleRef,
          localeRef
        };
      }
      function useStyle(mountId, style2, clsPrefixRef) {
        if (!style2) {
          return;
        }
        const ssrAdapter2 = useSsrAdapter();
        const NConfigProvider = inject(configProviderInjectionKey, null);
        const mountStyle = () => {
          const clsPrefix = clsPrefixRef.value;
          style2.mount({
            id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
            head: true,
            anchorMetaName: cssrAnchorMetaName,
            props: {
              bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
            },
            ssr: ssrAdapter2
          });
          if (!(NConfigProvider === null || NConfigProvider === void 0 ? void 0 : NConfigProvider.preflightStyleDisabled)) {
            globalStyle.mount({
              id: "n-global",
              head: true,
              anchorMetaName: cssrAnchorMetaName,
              ssr: ssrAdapter2
            });
          }
        };
        if (ssrAdapter2) {
          mountStyle();
        } else {
          onBeforeMount(mountStyle);
        }
      }
      function useThemeClass(componentName, hashRef, cssVarsRef, props) {
        var _a;
        if (!cssVarsRef)
          throwError("useThemeClass", "cssVarsRef is not passed");
        const mergedThemeHashRef = (_a = inject(configProviderInjectionKey, null)) === null || _a === void 0 ? void 0 : _a.mergedThemeHashRef;
        const themeClassRef = ref("");
        const ssrAdapter2 = useSsrAdapter();
        let renderCallback;
        const hashClassPrefix = `__${componentName}`;
        const mountStyle = () => {
          let finalThemeHash = hashClassPrefix;
          const hashValue = hashRef ? hashRef.value : void 0;
          const themeHash = mergedThemeHashRef === null || mergedThemeHashRef === void 0 ? void 0 : mergedThemeHashRef.value;
          if (themeHash)
            finalThemeHash += "-" + themeHash;
          if (hashValue)
            finalThemeHash += "-" + hashValue;
          const {
            themeOverrides,
            builtinThemeOverrides
          } = props;
          if (themeOverrides) {
            finalThemeHash += "-" + murmur2(JSON.stringify(themeOverrides));
          }
          if (builtinThemeOverrides) {
            finalThemeHash += "-" + murmur2(JSON.stringify(builtinThemeOverrides));
          }
          themeClassRef.value = finalThemeHash;
          renderCallback = () => {
            const cssVars = cssVarsRef.value;
            let style2 = "";
            for (const key in cssVars) {
              style2 += `${key}: ${cssVars[key]};`;
            }
            c(`.${finalThemeHash}`, style2).mount({
              id: finalThemeHash,
              ssr: ssrAdapter2
            });
            renderCallback = void 0;
          };
        };
        watchEffect(() => {
          mountStyle();
        });
        return {
          themeClass: themeClassRef,
          onRender: () => {
            renderCallback === null || renderCallback === void 0 ? void 0 : renderCallback();
          }
        };
      }
      function useRtl(mountId, rtlStateRef, clsPrefixRef) {
        if (!rtlStateRef)
          return void 0;
        const ssrAdapter2 = useSsrAdapter();
        const componentRtlStateRef = computed(() => {
          const {
            value: rtlState
          } = rtlStateRef;
          if (!rtlState) {
            return void 0;
          }
          const componentRtlState = rtlState[mountId];
          if (!componentRtlState) {
            return void 0;
          }
          return componentRtlState;
        });
        const mountStyle = () => {
          watchEffect(() => {
            const {
              value: clsPrefix
            } = clsPrefixRef;
            const id = `${clsPrefix}${mountId}Rtl`;
            if (exists(id, ssrAdapter2))
              return;
            const {
              value: componentRtlState
            } = componentRtlStateRef;
            if (!componentRtlState)
              return;
            componentRtlState.style.mount({
              id,
              head: true,
              anchorMetaName: cssrAnchorMetaName,
              props: {
                bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
              },
              ssr: ssrAdapter2
            });
          });
        };
        if (ssrAdapter2) {
          mountStyle();
        } else {
          onBeforeMount(mountStyle);
        }
        return componentRtlStateRef;
      }
      function replaceable(name, icon) {
        return /* @__PURE__ */ defineComponent({
          name: upperFirst(name),
          setup() {
            var _a;
            const mergedIconsRef = (_a = inject(configProviderInjectionKey, null)) === null || _a === void 0 ? void 0 : _a.mergedIconsRef;
            return () => {
              var _a2;
              const iconOverride = (_a2 = mergedIconsRef === null || mergedIconsRef === void 0 ? void 0 : mergedIconsRef.value) === null || _a2 === void 0 ? void 0 : _a2[name];
              return iconOverride ? iconOverride() : icon;
            };
          }
        });
      }
      const ErrorIcon = replaceable("close", h("svg", {
        viewBox: "0 0 12 12",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "aria-hidden": true
      }, h("g", {
        stroke: "none",
        "stroke-width": "1",
        fill: "none",
        "fill-rule": "evenodd"
      }, h("g", {
        fill: "currentColor",
        "fill-rule": "nonzero"
      }, h("path", {
        d: "M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z"
      })))));
      const EyeIcon = /* @__PURE__ */ defineComponent({
        name: "Eye",
        render() {
          return h("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 512 512"
          }, h("path", {
            d: "M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z",
            fill: "none",
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "32"
          }), h("circle", {
            cx: "256",
            cy: "256",
            r: "80",
            fill: "none",
            stroke: "currentColor",
            "stroke-miterlimit": "10",
            "stroke-width": "32"
          }));
        }
      });
      const EyeOffIcon = /* @__PURE__ */ defineComponent({
        name: "EyeOff",
        render() {
          return h("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 512 512"
          }, h("path", {
            d: "M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448z",
            fill: "currentColor"
          }), h("path", {
            d: "M255.66 384c-41.49 0-81.5-12.28-118.92-36.5c-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 0 0 .14-2.94L93.5 161.38a2 2 0 0 0-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0 0 75.8-12.58a2 2 0 0 0 .77-3.31l-21.58-21.58a4 4 0 0 0-3.83-1a204.8 204.8 0 0 1-51.16 6.47z",
            fill: "currentColor"
          }), h("path", {
            d: "M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 0 0-74.89 12.83a2 2 0 0 0-.75 3.31l21.55 21.55a4 4 0 0 0 3.88 1a192.82 192.82 0 0 1 50.21-6.69c40.69 0 80.58 12.43 118.55 37c34.71 22.4 65.74 53.88 89.76 91a.13.13 0 0 1 0 .16a310.72 310.72 0 0 1-64.12 72.73a2 2 0 0 0-.15 2.95l19.9 19.89a2 2 0 0 0 2.7.13a343.49 343.49 0 0 0 68.64-78.48a32.2 32.2 0 0 0-.1-34.78z",
            fill: "currentColor"
          }), h("path", {
            d: "M256 160a95.88 95.88 0 0 0-21.37 2.4a2 2 0 0 0-1 3.38l112.59 112.56a2 2 0 0 0 3.38-1A96 96 0 0 0 256 160z",
            fill: "currentColor"
          }), h("path", {
            d: "M165.78 233.66a2 2 0 0 0-3.38 1a96 96 0 0 0 115 115a2 2 0 0 0 1-3.38z",
            fill: "currentColor"
          }));
        }
      });
      const ChevronDownIcon = /* @__PURE__ */ defineComponent({
        name: "ChevronDown",
        render() {
          return h("svg", {
            viewBox: "0 0 16 16",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
          }, h("path", {
            d: "M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z",
            fill: "currentColor"
          }));
        }
      });
      const ClearIcon = replaceable("clear", h("svg", {
        viewBox: "0 0 16 16",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg"
      }, h("g", {
        stroke: "none",
        "stroke-width": "1",
        fill: "none",
        "fill-rule": "evenodd"
      }, h("g", {
        fill: "currentColor",
        "fill-rule": "nonzero"
      }, h("path", {
        d: "M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M6.5343055,5.83859116 C6.33943736,5.70359511 6.07001296,5.72288026 5.89644661,5.89644661 L5.89644661,5.89644661 L5.83859116,5.9656945 C5.70359511,6.16056264 5.72288026,6.42998704 5.89644661,6.60355339 L5.89644661,6.60355339 L7.293,8 L5.89644661,9.39644661 L5.83859116,9.4656945 C5.70359511,9.66056264 5.72288026,9.92998704 5.89644661,10.1035534 L5.89644661,10.1035534 L5.9656945,10.1614088 C6.16056264,10.2964049 6.42998704,10.2771197 6.60355339,10.1035534 L6.60355339,10.1035534 L8,8.707 L9.39644661,10.1035534 L9.4656945,10.1614088 C9.66056264,10.2964049 9.92998704,10.2771197 10.1035534,10.1035534 L10.1035534,10.1035534 L10.1614088,10.0343055 C10.2964049,9.83943736 10.2771197,9.57001296 10.1035534,9.39644661 L10.1035534,9.39644661 L8.707,8 L10.1035534,6.60355339 L10.1614088,6.5343055 C10.2964049,6.33943736 10.2771197,6.07001296 10.1035534,5.89644661 L10.1035534,5.89644661 L10.0343055,5.83859116 C9.83943736,5.70359511 9.57001296,5.72288026 9.39644661,5.89644661 L9.39644661,5.89644661 L8,7.293 L6.60355339,5.89644661 Z"
      })))));
      const NIconSwitchTransition = /* @__PURE__ */ defineComponent({
        name: "BaseIconSwitchTransition",
        setup(_, {
          slots
        }) {
          const isMountedRef = isMounted();
          return () => h(Transition, {
            name: "icon-switch-transition",
            appear: isMountedRef.value
          }, slots);
        }
      });
      const NFadeInExpandTransition = /* @__PURE__ */ defineComponent({
        name: "FadeInExpandTransition",
        props: {
          appear: Boolean,
          group: Boolean,
          mode: String,
          onLeave: Function,
          onAfterLeave: Function,
          onAfterEnter: Function,
          width: Boolean,
          // reverse mode is only used in tree
          // it make it from expanded to collapsed after mounted
          reverse: Boolean
        },
        setup(props, {
          slots
        }) {
          function handleBeforeLeave(el) {
            if (props.width) {
              el.style.maxWidth = `${el.offsetWidth}px`;
            } else {
              el.style.maxHeight = `${el.offsetHeight}px`;
            }
            void el.offsetWidth;
          }
          function handleLeave(el) {
            if (props.width) {
              el.style.maxWidth = "0";
            } else {
              el.style.maxHeight = "0";
            }
            void el.offsetWidth;
            const {
              onLeave
            } = props;
            if (onLeave)
              onLeave();
          }
          function handleAfterLeave(el) {
            if (props.width) {
              el.style.maxWidth = "";
            } else {
              el.style.maxHeight = "";
            }
            const {
              onAfterLeave
            } = props;
            if (onAfterLeave)
              onAfterLeave();
          }
          function handleEnter(el) {
            el.style.transition = "none";
            if (props.width) {
              const memorizedWidth = el.offsetWidth;
              el.style.maxWidth = "0";
              void el.offsetWidth;
              el.style.transition = "";
              el.style.maxWidth = `${memorizedWidth}px`;
            } else {
              if (props.reverse) {
                el.style.maxHeight = `${el.offsetHeight}px`;
                void el.offsetHeight;
                el.style.transition = "";
                el.style.maxHeight = "0";
              } else {
                const memorizedHeight = el.offsetHeight;
                el.style.maxHeight = "0";
                void el.offsetWidth;
                el.style.transition = "";
                el.style.maxHeight = `${memorizedHeight}px`;
              }
            }
            void el.offsetWidth;
          }
          function handleAfterEnter(el) {
            var _a;
            if (props.width) {
              el.style.maxWidth = "";
            } else {
              if (!props.reverse) {
                el.style.maxHeight = "";
              }
            }
            (_a = props.onAfterEnter) === null || _a === void 0 ? void 0 : _a.call(props);
          }
          return () => {
            const {
              group,
              width,
              appear,
              mode
            } = props;
            const type = group ? TransitionGroup : Transition;
            const resolvedProps = {
              name: width ? "fade-in-width-expand-transition" : "fade-in-height-expand-transition",
              appear,
              onEnter: handleEnter,
              onAfterEnter: handleAfterEnter,
              onBeforeLeave: handleBeforeLeave,
              onLeave: handleLeave,
              onAfterLeave: handleAfterLeave
            };
            if (!group) {
              resolvedProps.mode = mode;
            }
            return h(type, resolvedProps, slots);
          };
        }
      });
      const style$f = cB("base-icon", `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`, [c("svg", `
 height: 1em;
 width: 1em;
 `)]);
      const NBaseIcon = /* @__PURE__ */ defineComponent({
        name: "BaseIcon",
        props: {
          role: String,
          ariaLabel: String,
          ariaDisabled: {
            type: Boolean,
            default: void 0
          },
          ariaHidden: {
            type: Boolean,
            default: void 0
          },
          clsPrefix: {
            type: String,
            required: true
          },
          onClick: Function,
          onMousedown: Function,
          onMouseup: Function
        },
        setup(props) {
          useStyle("-base-icon", style$f, toRef(props, "clsPrefix"));
        },
        render() {
          return h("i", {
            class: `${this.clsPrefix}-base-icon`,
            onClick: this.onClick,
            onMousedown: this.onMousedown,
            onMouseup: this.onMouseup,
            role: this.role,
            "aria-label": this.ariaLabel,
            "aria-hidden": this.ariaHidden,
            "aria-disabled": this.ariaDisabled
          }, this.$slots);
        }
      });
      const style$e = cB("base-close", `
 display: flex;
 align-items: center;
 justify-content: center;
 cursor: pointer;
 background-color: transparent;
 color: var(--n-close-icon-color);
 border-radius: var(--n-close-border-radius);
 height: var(--n-close-size);
 width: var(--n-close-size);
 font-size: var(--n-close-icon-size);
 outline: none;
 border: none;
 position: relative;
 padding: 0;
`, [cM("absolute", `
 height: var(--n-close-icon-size);
 width: var(--n-close-icon-size);
 `), c("&::before", `
 content: "";
 position: absolute;
 width: var(--n-close-size);
 height: var(--n-close-size);
 left: 50%;
 top: 50%;
 transform: translateY(-50%) translateX(-50%);
 transition: inherit;
 border-radius: inherit;
 `), cNotM("disabled", [c("&:hover", `
 color: var(--n-close-icon-color-hover);
 `), c("&:hover::before", `
 background-color: var(--n-close-color-hover);
 `), c("&:focus::before", `
 background-color: var(--n-close-color-hover);
 `), c("&:active", `
 color: var(--n-close-icon-color-pressed);
 `), c("&:active::before", `
 background-color: var(--n-close-color-pressed);
 `)]), cM("disabled", `
 cursor: not-allowed;
 color: var(--n-close-icon-color-disabled);
 background-color: transparent;
 `), cM("round", [c("&::before", `
 border-radius: 50%;
 `)])]);
      const NBaseClose = /* @__PURE__ */ defineComponent({
        name: "BaseClose",
        props: {
          isButtonTag: {
            type: Boolean,
            default: true
          },
          clsPrefix: {
            type: String,
            required: true
          },
          disabled: {
            type: Boolean,
            default: void 0
          },
          focusable: {
            type: Boolean,
            default: true
          },
          round: Boolean,
          onClick: Function,
          absolute: Boolean
        },
        setup(props) {
          useStyle("-base-close", style$e, toRef(props, "clsPrefix"));
          return () => {
            const {
              clsPrefix,
              disabled,
              absolute,
              round,
              isButtonTag
            } = props;
            const Tag = isButtonTag ? "button" : "div";
            return h(Tag, {
              type: isButtonTag ? "button" : void 0,
              tabindex: disabled || !props.focusable ? -1 : 0,
              "aria-disabled": disabled,
              "aria-label": "close",
              role: isButtonTag ? void 0 : "button",
              disabled,
              class: [`${clsPrefix}-base-close`, absolute && `${clsPrefix}-base-close--absolute`, disabled && `${clsPrefix}-base-close--disabled`, round && `${clsPrefix}-base-close--round`],
              onMousedown: (e) => {
                if (!props.focusable) {
                  e.preventDefault();
                }
              },
              onClick: props.onClick
            }, h(NBaseIcon, {
              clsPrefix
            }, {
              default: () => h(ErrorIcon, null)
            }));
          };
        }
      });
      const {
        cubicBezierEaseInOut: cubicBezierEaseInOut$3
      } = commonVariables$3;
      function iconSwitchTransition({
        originalTransform = "",
        left = 0,
        top = 0,
        transition = `all .3s ${cubicBezierEaseInOut$3} !important`
      } = {}) {
        return [c("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
          transform: originalTransform + " scale(0.75)",
          left,
          top,
          opacity: 0
        }), c("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
          transform: `scale(1) ${originalTransform}`,
          left,
          top,
          opacity: 1
        }), c("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
          transformOrigin: "center",
          position: "absolute",
          left,
          top,
          transition
        })];
      }
      const style$d = c([c("@keyframes rotator", `
 0% {
 -webkit-transform: rotate(0deg);
 transform: rotate(0deg);
 }
 100% {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }`), cB("base-loading", `
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `, [cE("transition-wrapper", `
 position: absolute;
 width: 100%;
 height: 100%;
 `, [iconSwitchTransition()]), cE("placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
        left: "50%",
        top: "50%",
        originalTransform: "translateX(-50%) translateY(-50%)"
      })]), cE("container", `
 animation: rotator 3s linear infinite both;
 `, [cE("icon", `
 height: 1em;
 width: 1em;
 `)])])]);
      const duration = "1.6s";
      const exposedLoadingProps = {
        strokeWidth: {
          type: Number,
          default: 28
        },
        stroke: {
          type: String,
          default: void 0
        }
      };
      const NBaseLoading = /* @__PURE__ */ defineComponent({
        name: "BaseLoading",
        props: Object.assign({
          clsPrefix: {
            type: String,
            required: true
          },
          show: {
            type: Boolean,
            default: true
          },
          scale: {
            type: Number,
            default: 1
          },
          radius: {
            type: Number,
            default: 100
          }
        }, exposedLoadingProps),
        setup(props) {
          useStyle("-base-loading", style$d, toRef(props, "clsPrefix"));
        },
        render() {
          const {
            clsPrefix,
            radius,
            strokeWidth,
            stroke,
            scale
          } = this;
          const scaledRadius = radius / scale;
          return h("div", {
            class: `${clsPrefix}-base-loading`,
            role: "img",
            "aria-label": "loading"
          }, h(NIconSwitchTransition, null, {
            default: () => this.show ? h("div", {
              key: "icon",
              class: `${clsPrefix}-base-loading__transition-wrapper`
            }, h("div", {
              class: `${clsPrefix}-base-loading__container`
            }, h("svg", {
              class: `${clsPrefix}-base-loading__icon`,
              viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`,
              xmlns: "http://www.w3.org/2000/svg",
              style: {
                color: stroke
              }
            }, h("g", null, h("animateTransform", {
              attributeName: "transform",
              type: "rotate",
              values: `0 ${scaledRadius} ${scaledRadius};270 ${scaledRadius} ${scaledRadius}`,
              begin: "0s",
              dur: duration,
              fill: "freeze",
              repeatCount: "indefinite"
            }), h("circle", {
              class: `${clsPrefix}-base-loading__icon`,
              fill: "none",
              stroke: "currentColor",
              "stroke-width": strokeWidth,
              "stroke-linecap": "round",
              cx: scaledRadius,
              cy: scaledRadius,
              r: radius - strokeWidth / 2,
              "stroke-dasharray": 5.67 * radius,
              "stroke-dashoffset": 18.48 * radius
            }, h("animateTransform", {
              attributeName: "transform",
              type: "rotate",
              values: `0 ${scaledRadius} ${scaledRadius};135 ${scaledRadius} ${scaledRadius};450 ${scaledRadius} ${scaledRadius}`,
              begin: "0s",
              dur: duration,
              fill: "freeze",
              repeatCount: "indefinite"
            }), h("animate", {
              attributeName: "stroke-dashoffset",
              values: `${5.67 * radius};${1.42 * radius};${5.67 * radius}`,
              begin: "0s",
              dur: duration,
              fill: "freeze",
              repeatCount: "indefinite"
            })))))) : h("div", {
              key: "placeholder",
              class: `${clsPrefix}-base-loading__placeholder`
            }, this.$slots)
          }));
        }
      });
      const base = {
        neutralBase: "#FFF",
        neutralInvertBase: "#000",
        neutralTextBase: "#000",
        neutralPopover: "#fff",
        neutralCard: "#fff",
        neutralModal: "#fff",
        neutralBody: "#fff",
        alpha1: "0.82",
        alpha2: "0.72",
        alpha3: "0.38",
        alpha4: "0.24",
        // disabled text, placeholder, icon
        alpha5: "0.18",
        // disabled placeholder
        alphaClose: "0.6",
        alphaDisabled: "0.5",
        alphaDisabledInput: "0.02",
        alphaPending: "0.05",
        alphaTablePending: "0.02",
        alphaPressed: "0.07",
        alphaAvatar: "0.2",
        alphaRail: "0.14",
        alphaProgressRail: ".08",
        alphaBorder: "0.12",
        alphaDivider: "0.06",
        alphaInput: "0",
        alphaAction: "0.02",
        alphaTab: "0.04",
        alphaScrollbar: "0.25",
        alphaScrollbarHover: "0.4",
        alphaCode: "0.05",
        alphaTag: "0.02",
        // primary
        primaryHover: "#36ad6a",
        primaryDefault: "#18a058",
        primaryActive: "#0c7a43",
        primarySuppl: "#36ad6a",
        // info
        infoHover: "#4098fc",
        infoDefault: "#2080f0",
        infoActive: "#1060c9",
        infoSuppl: "#4098fc",
        // error
        errorHover: "#de576d",
        errorDefault: "#d03050",
        errorActive: "#ab1f3f",
        errorSuppl: "#de576d",
        // warning
        warningHover: "#fcb040",
        warningDefault: "#f0a020",
        warningActive: "#c97c10",
        warningSuppl: "#fcb040",
        // success
        successHover: "#36ad6a",
        successDefault: "#18a058",
        successActive: "#0c7a43",
        successSuppl: "#36ad6a"
      };
      const baseBackgroundRgb = rgba(base.neutralBase);
      const baseInvertBackgroundRgb = rgba(base.neutralInvertBase);
      const overlayPrefix = "rgba(" + baseInvertBackgroundRgb.slice(0, 3).join(", ") + ", ";
      function overlay(alpha) {
        return overlayPrefix + String(alpha) + ")";
      }
      function neutral(alpha) {
        const overlayRgba = Array.from(baseInvertBackgroundRgb);
        overlayRgba[3] = Number(alpha);
        return composite(baseBackgroundRgb, overlayRgba);
      }
      const derived = Object.assign(Object.assign({
        name: "common"
      }, commonVariables$3), {
        baseColor: base.neutralBase,
        // primary color
        primaryColor: base.primaryDefault,
        primaryColorHover: base.primaryHover,
        primaryColorPressed: base.primaryActive,
        primaryColorSuppl: base.primarySuppl,
        // info color
        infoColor: base.infoDefault,
        infoColorHover: base.infoHover,
        infoColorPressed: base.infoActive,
        infoColorSuppl: base.infoSuppl,
        // success color
        successColor: base.successDefault,
        successColorHover: base.successHover,
        successColorPressed: base.successActive,
        successColorSuppl: base.successSuppl,
        // warning color
        warningColor: base.warningDefault,
        warningColorHover: base.warningHover,
        warningColorPressed: base.warningActive,
        warningColorSuppl: base.warningSuppl,
        // error color
        errorColor: base.errorDefault,
        errorColorHover: base.errorHover,
        errorColorPressed: base.errorActive,
        errorColorSuppl: base.errorSuppl,
        // text color
        textColorBase: base.neutralTextBase,
        textColor1: "rgb(31, 34, 37)",
        textColor2: "rgb(51, 54, 57)",
        textColor3: "rgb(118, 124, 130)",
        // textColor4: neutral(base.alpha4), // disabled, placeholder, icon
        // textColor5: neutral(base.alpha5),
        textColorDisabled: neutral(base.alpha4),
        placeholderColor: neutral(base.alpha4),
        placeholderColorDisabled: neutral(base.alpha5),
        iconColor: neutral(base.alpha4),
        iconColorHover: scaleColor(neutral(base.alpha4), {
          lightness: 0.75
        }),
        iconColorPressed: scaleColor(neutral(base.alpha4), {
          lightness: 0.9
        }),
        iconColorDisabled: neutral(base.alpha5),
        opacity1: base.alpha1,
        opacity2: base.alpha2,
        opacity3: base.alpha3,
        opacity4: base.alpha4,
        opacity5: base.alpha5,
        dividerColor: "rgb(239, 239, 245)",
        borderColor: "rgb(224, 224, 230)",
        // close
        closeIconColor: neutral(Number(base.alphaClose)),
        closeIconColorHover: neutral(Number(base.alphaClose)),
        closeIconColorPressed: neutral(Number(base.alphaClose)),
        closeColorHover: "rgba(0, 0, 0, .09)",
        closeColorPressed: "rgba(0, 0, 0, .13)",
        // clear
        clearColor: neutral(base.alpha4),
        clearColorHover: scaleColor(neutral(base.alpha4), {
          lightness: 0.75
        }),
        clearColorPressed: scaleColor(neutral(base.alpha4), {
          lightness: 0.9
        }),
        scrollbarColor: overlay(base.alphaScrollbar),
        scrollbarColorHover: overlay(base.alphaScrollbarHover),
        scrollbarWidth: "5px",
        scrollbarHeight: "5px",
        scrollbarBorderRadius: "5px",
        progressRailColor: neutral(base.alphaProgressRail),
        railColor: "rgb(219, 219, 223)",
        popoverColor: base.neutralPopover,
        tableColor: base.neutralCard,
        cardColor: base.neutralCard,
        modalColor: base.neutralModal,
        bodyColor: base.neutralBody,
        tagColor: "#eee",
        avatarColor: neutral(base.alphaAvatar),
        invertedColor: "rgb(0, 20, 40)",
        inputColor: neutral(base.alphaInput),
        codeColor: "rgb(244, 244, 248)",
        tabColor: "rgb(247, 247, 250)",
        actionColor: "rgb(250, 250, 252)",
        tableHeaderColor: "rgb(250, 250, 252)",
        hoverColor: "rgb(243, 243, 245)",
        // use color with alpha since it can be nested with header filter & sorter effect
        tableColorHover: "rgba(0, 0, 100, 0.03)",
        tableColorStriped: "rgba(0, 0, 100, 0.02)",
        pressedColor: "rgb(237, 237, 239)",
        opacityDisabled: base.alphaDisabled,
        inputColorDisabled: "rgb(250, 250, 252)",
        // secondary button color
        // can also be used in tertiary button & quaternary button
        buttonColor2: "rgba(46, 51, 56, .05)",
        buttonColor2Hover: "rgba(46, 51, 56, .09)",
        buttonColor2Pressed: "rgba(46, 51, 56, .13)",
        boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
        boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
        boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
      });
      const commonLight = derived;
      const self$9 = (vars) => {
        const {
          scrollbarColor,
          scrollbarColorHover
        } = vars;
        return {
          color: scrollbarColor,
          colorHover: scrollbarColorHover
        };
      };
      const scrollbarLight = {
        name: "Scrollbar",
        common: commonLight,
        self: self$9
      };
      const scrollbarLight$1 = scrollbarLight;
      const {
        cubicBezierEaseInOut: cubicBezierEaseInOut$2
      } = commonVariables$3;
      function fadeInTransition({
        name = "fade-in",
        enterDuration = "0.2s",
        leaveDuration = "0.2s",
        enterCubicBezier = cubicBezierEaseInOut$2,
        leaveCubicBezier = cubicBezierEaseInOut$2
      } = {}) {
        return [c(`&.${name}-transition-enter-active`, {
          transition: `all ${enterDuration} ${enterCubicBezier}!important`
        }), c(`&.${name}-transition-leave-active`, {
          transition: `all ${leaveDuration} ${leaveCubicBezier}!important`
        }), c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
          opacity: 0
        }), c(`&.${name}-transition-leave-from, &.${name}-transition-enter-to`, {
          opacity: 1
        })];
      }
      const style$c = cB("scrollbar", `
 overflow: hidden;
 position: relative;
 z-index: auto;
 height: 100%;
 width: 100%;
`, [c(">", [cB("scrollbar-container", `
 width: 100%;
 overflow: scroll;
 height: 100%;
 min-height: inherit;
 max-height: inherit;
 scrollbar-width: none;
 `, [c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 width: 0;
 height: 0;
 display: none;
 `), c(">", [cB("scrollbar-content", `
 box-sizing: border-box;
 min-width: 100%;
 `)])])]), c(">, +", [cB("scrollbar-rail", `
 position: absolute;
 pointer-events: none;
 user-select: none;
 -webkit-user-select: none;
 `, [cM("horizontal", `
 left: 2px;
 right: 2px;
 bottom: 4px;
 height: var(--n-scrollbar-height);
 `, [c(">", [cE("scrollbar", `
 height: var(--n-scrollbar-height);
 border-radius: var(--n-scrollbar-border-radius);
 right: 0;
 `)])]), cM("vertical", `
 right: 4px;
 top: 2px;
 bottom: 2px;
 width: var(--n-scrollbar-width);
 `, [c(">", [cE("scrollbar", `
 width: var(--n-scrollbar-width);
 border-radius: var(--n-scrollbar-border-radius);
 bottom: 0;
 `)])]), cM("disabled", [c(">", [cE("scrollbar", "pointer-events: none;")])]), c(">", [cE("scrollbar", `
 z-index: 1;
 position: absolute;
 cursor: pointer;
 pointer-events: all;
 background-color: var(--n-scrollbar-color);
 transition: background-color .2s var(--n-scrollbar-bezier);
 `, [fadeInTransition(), c("&:hover", "background-color: var(--n-scrollbar-color-hover);")])])])])]);
      const scrollbarProps = Object.assign(Object.assign({}, useTheme.props), {
        size: {
          type: Number,
          default: 5
        },
        duration: {
          type: Number,
          default: 0
        },
        scrollable: {
          type: Boolean,
          default: true
        },
        xScrollable: Boolean,
        trigger: {
          type: String,
          default: "hover"
        },
        useUnifiedContainer: Boolean,
        triggerDisplayManually: Boolean,
        // If container is set, resize observer won't not attached
        container: Function,
        content: Function,
        containerClass: String,
        containerStyle: [String, Object],
        contentClass: [String, Array],
        contentStyle: [String, Object],
        horizontalRailStyle: [String, Object],
        verticalRailStyle: [String, Object],
        onScroll: Function,
        onWheel: Function,
        onResize: Function,
        internalOnUpdateScrollLeft: Function,
        internalHoistYRail: Boolean
      });
      const Scrollbar = /* @__PURE__ */ defineComponent({
        name: "Scrollbar",
        props: scrollbarProps,
        inheritAttrs: false,
        setup(props) {
          const {
            mergedClsPrefixRef,
            inlineThemeDisabled,
            mergedRtlRef
          } = useConfig(props);
          const rtlEnabledRef = useRtl("Scrollbar", mergedRtlRef, mergedClsPrefixRef);
          const wrapperRef = ref(null);
          const containerRef = ref(null);
          const contentRef = ref(null);
          const yRailRef = ref(null);
          const xRailRef = ref(null);
          const contentHeightRef = ref(null);
          const contentWidthRef = ref(null);
          const containerHeightRef = ref(null);
          const containerWidthRef = ref(null);
          const yRailSizeRef = ref(null);
          const xRailSizeRef = ref(null);
          const containerScrollTopRef = ref(0);
          const containerScrollLeftRef = ref(0);
          const isShowXBarRef = ref(false);
          const isShowYBarRef = ref(false);
          let yBarPressed = false;
          let xBarPressed = false;
          let xBarVanishTimerId;
          let yBarVanishTimerId;
          let memoYTop = 0;
          let memoXLeft = 0;
          let memoMouseX = 0;
          let memoMouseY = 0;
          const isIos2 = useIsIos();
          const yBarSizeRef = computed(() => {
            const {
              value: containerHeight
            } = containerHeightRef;
            const {
              value: contentHeight
            } = contentHeightRef;
            const {
              value: yRailSize
            } = yRailSizeRef;
            if (containerHeight === null || contentHeight === null || yRailSize === null) {
              return 0;
            } else {
              return Math.min(containerHeight, yRailSize * containerHeight / contentHeight + props.size * 1.5);
            }
          });
          const yBarSizePxRef = computed(() => {
            return `${yBarSizeRef.value}px`;
          });
          const xBarSizeRef = computed(() => {
            const {
              value: containerWidth
            } = containerWidthRef;
            const {
              value: contentWidth
            } = contentWidthRef;
            const {
              value: xRailSize
            } = xRailSizeRef;
            if (containerWidth === null || contentWidth === null || xRailSize === null) {
              return 0;
            } else {
              return xRailSize * containerWidth / contentWidth + props.size * 1.5;
            }
          });
          const xBarSizePxRef = computed(() => {
            return `${xBarSizeRef.value}px`;
          });
          const yBarTopRef = computed(() => {
            const {
              value: containerHeight
            } = containerHeightRef;
            const {
              value: containerScrollTop
            } = containerScrollTopRef;
            const {
              value: contentHeight
            } = contentHeightRef;
            const {
              value: yRailSize
            } = yRailSizeRef;
            if (containerHeight === null || contentHeight === null || yRailSize === null) {
              return 0;
            } else {
              const heightDiff = contentHeight - containerHeight;
              if (!heightDiff)
                return 0;
              return containerScrollTop / heightDiff * (yRailSize - yBarSizeRef.value);
            }
          });
          const yBarTopPxRef = computed(() => {
            return `${yBarTopRef.value}px`;
          });
          const xBarLeftRef = computed(() => {
            const {
              value: containerWidth
            } = containerWidthRef;
            const {
              value: containerScrollLeft
            } = containerScrollLeftRef;
            const {
              value: contentWidth
            } = contentWidthRef;
            const {
              value: xRailSize
            } = xRailSizeRef;
            if (containerWidth === null || contentWidth === null || xRailSize === null) {
              return 0;
            } else {
              const widthDiff = contentWidth - containerWidth;
              if (!widthDiff)
                return 0;
              return containerScrollLeft / widthDiff * (xRailSize - xBarSizeRef.value);
            }
          });
          const xBarLeftPxRef = computed(() => {
            return `${xBarLeftRef.value}px`;
          });
          const needYBarRef = computed(() => {
            const {
              value: containerHeight
            } = containerHeightRef;
            const {
              value: contentHeight
            } = contentHeightRef;
            return containerHeight !== null && contentHeight !== null && contentHeight > containerHeight;
          });
          const needXBarRef = computed(() => {
            const {
              value: containerWidth
            } = containerWidthRef;
            const {
              value: contentWidth
            } = contentWidthRef;
            return containerWidth !== null && contentWidth !== null && contentWidth > containerWidth;
          });
          const mergedShowXBarRef = computed(() => {
            const {
              trigger: trigger2
            } = props;
            return trigger2 === "none" || isShowXBarRef.value;
          });
          const mergedShowYBarRef = computed(() => {
            const {
              trigger: trigger2
            } = props;
            return trigger2 === "none" || isShowYBarRef.value;
          });
          const mergedContainerRef = computed(() => {
            const {
              container
            } = props;
            if (container)
              return container();
            return containerRef.value;
          });
          const mergedContentRef = computed(() => {
            const {
              content
            } = props;
            if (content)
              return content();
            return contentRef.value;
          });
          const activateState = useReactivated(() => {
            if (!props.container) {
              scrollTo({
                top: containerScrollTopRef.value,
                left: containerScrollLeftRef.value
              });
            }
          });
          const handleContentResize = () => {
            if (activateState.isDeactivated)
              return;
            sync();
          };
          const handleContainerResize = (e) => {
            if (activateState.isDeactivated)
              return;
            const {
              onResize
            } = props;
            if (onResize)
              onResize(e);
            sync();
          };
          const scrollTo = (options, y) => {
            if (!props.scrollable)
              return;
            if (typeof options === "number") {
              scrollToPosition(options, y !== null && y !== void 0 ? y : 0, 0, false, "auto");
              return;
            }
            const {
              left,
              top,
              index,
              elSize,
              position,
              behavior,
              el,
              debounce = true
            } = options;
            if (left !== void 0 || top !== void 0) {
              scrollToPosition(left !== null && left !== void 0 ? left : 0, top !== null && top !== void 0 ? top : 0, 0, false, behavior);
            }
            if (el !== void 0) {
              scrollToPosition(0, el.offsetTop, el.offsetHeight, debounce, behavior);
            } else if (index !== void 0 && elSize !== void 0) {
              scrollToPosition(0, index * elSize, elSize, debounce, behavior);
            } else if (position === "bottom") {
              scrollToPosition(0, Number.MAX_SAFE_INTEGER, 0, false, behavior);
            } else if (position === "top") {
              scrollToPosition(0, 0, 0, false, behavior);
            }
          };
          const scrollBy = (options, y) => {
            if (!props.scrollable)
              return;
            const {
              value: container
            } = mergedContainerRef;
            if (!container)
              return;
            if (typeof options === "object") {
              container.scrollBy(options);
            } else {
              container.scrollBy(options, y || 0);
            }
          };
          function scrollToPosition(left, top, elSize, debounce, behavior) {
            const {
              value: container
            } = mergedContainerRef;
            if (!container)
              return;
            if (debounce) {
              const {
                scrollTop,
                offsetHeight
              } = container;
              if (top > scrollTop) {
                if (top + elSize <= scrollTop + offsetHeight)
                  ;
                else {
                  container.scrollTo({
                    left,
                    top: top + elSize - offsetHeight,
                    behavior
                  });
                }
                return;
              }
            }
            container.scrollTo({
              left,
              top,
              behavior
            });
          }
          function handleMouseEnterWrapper() {
            showXBar();
            showYBar();
            sync();
          }
          function handleMouseLeaveWrapper() {
            hideBar();
          }
          function hideBar() {
            hideYBar();
            hideXBar();
          }
          function hideYBar() {
            if (yBarVanishTimerId !== void 0) {
              window.clearTimeout(yBarVanishTimerId);
            }
            yBarVanishTimerId = window.setTimeout(() => {
              isShowYBarRef.value = false;
            }, props.duration);
          }
          function hideXBar() {
            if (xBarVanishTimerId !== void 0) {
              window.clearTimeout(xBarVanishTimerId);
            }
            xBarVanishTimerId = window.setTimeout(() => {
              isShowXBarRef.value = false;
            }, props.duration);
          }
          function showXBar() {
            if (xBarVanishTimerId !== void 0) {
              window.clearTimeout(xBarVanishTimerId);
            }
            isShowXBarRef.value = true;
          }
          function showYBar() {
            if (yBarVanishTimerId !== void 0) {
              window.clearTimeout(yBarVanishTimerId);
            }
            isShowYBarRef.value = true;
          }
          function handleScroll(e) {
            const {
              onScroll
            } = props;
            if (onScroll)
              onScroll(e);
            syncScrollState();
          }
          function syncScrollState() {
            const {
              value: container
            } = mergedContainerRef;
            if (container) {
              containerScrollTopRef.value = container.scrollTop;
              containerScrollLeftRef.value = container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
            }
          }
          function syncPositionState() {
            const {
              value: content
            } = mergedContentRef;
            if (content) {
              contentHeightRef.value = content.offsetHeight;
              contentWidthRef.value = content.offsetWidth;
            }
            const {
              value: container
            } = mergedContainerRef;
            if (container) {
              containerHeightRef.value = container.offsetHeight;
              containerWidthRef.value = container.offsetWidth;
            }
            const {
              value: xRailEl
            } = xRailRef;
            const {
              value: yRailEl
            } = yRailRef;
            if (xRailEl) {
              xRailSizeRef.value = xRailEl.offsetWidth;
            }
            if (yRailEl) {
              yRailSizeRef.value = yRailEl.offsetHeight;
            }
          }
          function syncUnifiedContainer() {
            const {
              value: container
            } = mergedContainerRef;
            if (container) {
              containerScrollTopRef.value = container.scrollTop;
              containerScrollLeftRef.value = container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
              containerHeightRef.value = container.offsetHeight;
              containerWidthRef.value = container.offsetWidth;
              contentHeightRef.value = container.scrollHeight;
              contentWidthRef.value = container.scrollWidth;
            }
            const {
              value: xRailEl
            } = xRailRef;
            const {
              value: yRailEl
            } = yRailRef;
            if (xRailEl) {
              xRailSizeRef.value = xRailEl.offsetWidth;
            }
            if (yRailEl) {
              yRailSizeRef.value = yRailEl.offsetHeight;
            }
          }
          function sync() {
            if (!props.scrollable)
              return;
            if (props.useUnifiedContainer) {
              syncUnifiedContainer();
            } else {
              syncPositionState();
              syncScrollState();
            }
          }
          function isMouseUpAway(e) {
            var _a;
            return !((_a = wrapperRef.value) === null || _a === void 0 ? void 0 : _a.contains(getPreciseEventTarget(e)));
          }
          function handleXScrollMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();
            xBarPressed = true;
            on("mousemove", window, handleXScrollMouseMove, true);
            on("mouseup", window, handleXScrollMouseUp, true);
            memoXLeft = containerScrollLeftRef.value;
            memoMouseX = (rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? window.innerWidth - e.clientX : e.clientX;
          }
          function handleXScrollMouseMove(e) {
            if (!xBarPressed)
              return;
            if (xBarVanishTimerId !== void 0) {
              window.clearTimeout(xBarVanishTimerId);
            }
            if (yBarVanishTimerId !== void 0) {
              window.clearTimeout(yBarVanishTimerId);
            }
            const {
              value: containerWidth
            } = containerWidthRef;
            const {
              value: contentWidth
            } = contentWidthRef;
            const {
              value: xBarSize
            } = xBarSizeRef;
            if (containerWidth === null || contentWidth === null)
              return;
            const dX = (rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? window.innerWidth - e.clientX - memoMouseX : e.clientX - memoMouseX;
            const dScrollLeft = dX * (contentWidth - containerWidth) / (containerWidth - xBarSize);
            const toScrollLeftUpperBound = contentWidth - containerWidth;
            let toScrollLeft = memoXLeft + dScrollLeft;
            toScrollLeft = Math.min(toScrollLeftUpperBound, toScrollLeft);
            toScrollLeft = Math.max(toScrollLeft, 0);
            const {
              value: container
            } = mergedContainerRef;
            if (container) {
              container.scrollLeft = toScrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
              const {
                internalOnUpdateScrollLeft
              } = props;
              if (internalOnUpdateScrollLeft)
                internalOnUpdateScrollLeft(toScrollLeft);
            }
          }
          function handleXScrollMouseUp(e) {
            e.preventDefault();
            e.stopPropagation();
            off("mousemove", window, handleXScrollMouseMove, true);
            off("mouseup", window, handleXScrollMouseUp, true);
            xBarPressed = false;
            sync();
            if (isMouseUpAway(e)) {
              hideBar();
            }
          }
          function handleYScrollMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();
            yBarPressed = true;
            on("mousemove", window, handleYScrollMouseMove, true);
            on("mouseup", window, handleYScrollMouseUp, true);
            memoYTop = containerScrollTopRef.value;
            memoMouseY = e.clientY;
          }
          function handleYScrollMouseMove(e) {
            if (!yBarPressed)
              return;
            if (xBarVanishTimerId !== void 0) {
              window.clearTimeout(xBarVanishTimerId);
            }
            if (yBarVanishTimerId !== void 0) {
              window.clearTimeout(yBarVanishTimerId);
            }
            const {
              value: containerHeight
            } = containerHeightRef;
            const {
              value: contentHeight
            } = contentHeightRef;
            const {
              value: yBarSize
            } = yBarSizeRef;
            if (containerHeight === null || contentHeight === null)
              return;
            const dY = e.clientY - memoMouseY;
            const dScrollTop = dY * (contentHeight - containerHeight) / (containerHeight - yBarSize);
            const toScrollTopUpperBound = contentHeight - containerHeight;
            let toScrollTop = memoYTop + dScrollTop;
            toScrollTop = Math.min(toScrollTopUpperBound, toScrollTop);
            toScrollTop = Math.max(toScrollTop, 0);
            const {
              value: container
            } = mergedContainerRef;
            if (container) {
              container.scrollTop = toScrollTop;
            }
          }
          function handleYScrollMouseUp(e) {
            e.preventDefault();
            e.stopPropagation();
            off("mousemove", window, handleYScrollMouseMove, true);
            off("mouseup", window, handleYScrollMouseUp, true);
            yBarPressed = false;
            sync();
            if (isMouseUpAway(e)) {
              hideBar();
            }
          }
          watchEffect(() => {
            const {
              value: needXBar
            } = needXBarRef;
            const {
              value: needYBar
            } = needYBarRef;
            const {
              value: mergedClsPrefix
            } = mergedClsPrefixRef;
            const {
              value: xRailEl
            } = xRailRef;
            const {
              value: yRailEl
            } = yRailRef;
            if (xRailEl) {
              if (!needXBar) {
                xRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);
              } else {
                xRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
              }
            }
            if (yRailEl) {
              if (!needYBar) {
                yRailEl.classList.add(`${mergedClsPrefix}-scrollbar-rail--disabled`);
              } else {
                yRailEl.classList.remove(`${mergedClsPrefix}-scrollbar-rail--disabled`);
              }
            }
          });
          onMounted(() => {
            if (props.container)
              return;
            sync();
          });
          onBeforeUnmount(() => {
            if (xBarVanishTimerId !== void 0) {
              window.clearTimeout(xBarVanishTimerId);
            }
            if (yBarVanishTimerId !== void 0) {
              window.clearTimeout(yBarVanishTimerId);
            }
            off("mousemove", window, handleYScrollMouseMove, true);
            off("mouseup", window, handleYScrollMouseUp, true);
          });
          const themeRef = useTheme("Scrollbar", "-scrollbar", style$c, scrollbarLight$1, props, mergedClsPrefixRef);
          const cssVarsRef = computed(() => {
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2,
                scrollbarBorderRadius,
                scrollbarHeight,
                scrollbarWidth
              },
              self: {
                color,
                colorHover
              }
            } = themeRef.value;
            return {
              "--n-scrollbar-bezier": cubicBezierEaseInOut2,
              "--n-scrollbar-color": color,
              "--n-scrollbar-color-hover": colorHover,
              "--n-scrollbar-border-radius": scrollbarBorderRadius,
              "--n-scrollbar-width": scrollbarWidth,
              "--n-scrollbar-height": scrollbarHeight
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("scrollbar", void 0, cssVarsRef, props) : void 0;
          const exposedMethods = {
            scrollTo,
            scrollBy,
            sync,
            syncUnifiedContainer,
            handleMouseEnterWrapper,
            handleMouseLeaveWrapper
          };
          return Object.assign(Object.assign({}, exposedMethods), {
            mergedClsPrefix: mergedClsPrefixRef,
            rtlEnabled: rtlEnabledRef,
            containerScrollTop: containerScrollTopRef,
            wrapperRef,
            containerRef,
            contentRef,
            yRailRef,
            xRailRef,
            needYBar: needYBarRef,
            needXBar: needXBarRef,
            yBarSizePx: yBarSizePxRef,
            xBarSizePx: xBarSizePxRef,
            yBarTopPx: yBarTopPxRef,
            xBarLeftPx: xBarLeftPxRef,
            isShowXBar: mergedShowXBarRef,
            isShowYBar: mergedShowYBarRef,
            isIos: isIos2,
            handleScroll,
            handleContentResize,
            handleContainerResize,
            handleYScrollMouseDown,
            handleXScrollMouseDown,
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          });
        },
        render() {
          var _a;
          const {
            $slots,
            mergedClsPrefix,
            triggerDisplayManually,
            rtlEnabled,
            internalHoistYRail
          } = this;
          if (!this.scrollable)
            return (_a = $slots.default) === null || _a === void 0 ? void 0 : _a.call($slots);
          const triggerIsNone = this.trigger === "none";
          const createYRail = (className, style2) => {
            return h("div", {
              ref: "yRailRef",
              class: [`${mergedClsPrefix}-scrollbar-rail`, `${mergedClsPrefix}-scrollbar-rail--vertical`, className],
              "data-scrollbar-rail": true,
              style: [style2 || "", this.verticalRailStyle],
              "aria-hidden": true
            }, h(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              triggerIsNone ? Wrapper : Transition,
              triggerIsNone ? null : {
                name: "fade-in-transition"
              },
              {
                default: () => this.needYBar && this.isShowYBar && !this.isIos ? h("div", {
                  class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`,
                  style: {
                    height: this.yBarSizePx,
                    top: this.yBarTopPx
                  },
                  onMousedown: this.handleYScrollMouseDown
                }) : null
              }
            ));
          };
          const createChildren = () => {
            var _a2, _b;
            (_a2 = this.onRender) === null || _a2 === void 0 ? void 0 : _a2.call(this);
            return h("div", mergeProps(this.$attrs, {
              role: "none",
              ref: "wrapperRef",
              class: [`${mergedClsPrefix}-scrollbar`, this.themeClass, rtlEnabled && `${mergedClsPrefix}-scrollbar--rtl`],
              style: this.cssVars,
              onMouseenter: triggerDisplayManually ? void 0 : this.handleMouseEnterWrapper,
              onMouseleave: triggerDisplayManually ? void 0 : this.handleMouseLeaveWrapper
            }), [this.container ? (_b = $slots.default) === null || _b === void 0 ? void 0 : _b.call($slots) : h("div", {
              role: "none",
              ref: "containerRef",
              class: [`${mergedClsPrefix}-scrollbar-container`, this.containerClass],
              style: this.containerStyle,
              onScroll: this.handleScroll,
              onWheel: this.onWheel
            }, h(VResizeObserver, {
              onResize: this.handleContentResize
            }, {
              default: () => h("div", {
                ref: "contentRef",
                role: "none",
                style: [{
                  width: this.xScrollable ? "fit-content" : null
                }, this.contentStyle],
                class: [`${mergedClsPrefix}-scrollbar-content`, this.contentClass]
              }, $slots)
            })), internalHoistYRail ? null : createYRail(void 0, void 0), this.xScrollable && h("div", {
              ref: "xRailRef",
              class: [`${mergedClsPrefix}-scrollbar-rail`, `${mergedClsPrefix}-scrollbar-rail--horizontal`],
              style: this.horizontalRailStyle,
              "data-scrollbar-rail": true,
              "aria-hidden": true
            }, h(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              triggerIsNone ? Wrapper : Transition,
              triggerIsNone ? null : {
                name: "fade-in-transition"
              },
              {
                default: () => this.needXBar && this.isShowXBar && !this.isIos ? h("div", {
                  class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`,
                  style: {
                    width: this.xBarSizePx,
                    right: rtlEnabled ? this.xBarLeftPx : void 0,
                    left: rtlEnabled ? void 0 : this.xBarLeftPx
                  },
                  onMousedown: this.handleXScrollMouseDown
                }) : null
              }
            ))]);
          };
          const scrollbarNode = this.container ? createChildren() : h(VResizeObserver, {
            onResize: this.handleContainerResize
          }, {
            default: createChildren
          });
          if (internalHoistYRail) {
            return h(Fragment, null, scrollbarNode, createYRail(this.themeClass, this.cssVars));
          } else {
            return scrollbarNode;
          }
        }
      });
      const NScrollbar = Scrollbar;
      const style$b = cB("base-wave", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`);
      const NBaseWave = /* @__PURE__ */ defineComponent({
        name: "BaseWave",
        props: {
          clsPrefix: {
            type: String,
            required: true
          }
        },
        setup(props) {
          useStyle("-base-wave", style$b, toRef(props, "clsPrefix"));
          const selfRef = ref(null);
          const activeRef = ref(false);
          let animationTimerId = null;
          onBeforeUnmount(() => {
            if (animationTimerId !== null) {
              window.clearTimeout(animationTimerId);
            }
          });
          return {
            active: activeRef,
            selfRef,
            play() {
              if (animationTimerId !== null) {
                window.clearTimeout(animationTimerId);
                activeRef.value = false;
                animationTimerId = null;
              }
              void nextTick(() => {
                var _a;
                void ((_a = selfRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight);
                activeRef.value = true;
                animationTimerId = window.setTimeout(() => {
                  activeRef.value = false;
                  animationTimerId = null;
                }, 1e3);
              });
            }
          };
        },
        render() {
          const {
            clsPrefix
          } = this;
          return h("div", {
            ref: "selfRef",
            "aria-hidden": true,
            class: [`${clsPrefix}-base-wave`, this.active && `${clsPrefix}-base-wave--active`]
          });
        }
      });
      const style$a = cB("base-clear", `
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`, [c(">", [cE("clear", `
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `, [c("&:hover", `
 color: var(--n-clear-color-hover)!important;
 `), c("&:active", `
 color: var(--n-clear-color-pressed)!important;
 `)]), cE("placeholder", `
 display: flex;
 `), cE("clear, placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
        originalTransform: "translateX(-50%) translateY(-50%)",
        left: "50%",
        top: "50%"
      })])])]);
      const NBaseClear = /* @__PURE__ */ defineComponent({
        name: "BaseClear",
        props: {
          clsPrefix: {
            type: String,
            required: true
          },
          show: Boolean,
          onClear: Function
        },
        setup(props) {
          useStyle("-base-clear", style$a, toRef(props, "clsPrefix"));
          return {
            handleMouseDown(e) {
              e.preventDefault();
            }
          };
        },
        render() {
          const {
            clsPrefix
          } = this;
          return h("div", {
            class: `${clsPrefix}-base-clear`
          }, h(NIconSwitchTransition, null, {
            default: () => {
              var _a, _b;
              return this.show ? h("div", {
                key: "dismiss",
                class: `${clsPrefix}-base-clear__clear`,
                onClick: this.onClear,
                onMousedown: this.handleMouseDown,
                "data-clear": true
              }, resolveSlot(this.$slots.icon, () => [h(NBaseIcon, {
                clsPrefix
              }, {
                default: () => h(ClearIcon, null)
              })])) : h("div", {
                key: "icon",
                class: `${clsPrefix}-base-clear__placeholder`
              }, (_b = (_a = this.$slots).placeholder) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
          }));
        }
      });
      const NBaseSuffix = /* @__PURE__ */ defineComponent({
        name: "InternalSelectionSuffix",
        props: {
          clsPrefix: {
            type: String,
            required: true
          },
          showArrow: {
            type: Boolean,
            default: void 0
          },
          showClear: {
            type: Boolean,
            default: void 0
          },
          loading: {
            type: Boolean,
            default: false
          },
          onClear: Function
        },
        setup(props, {
          slots
        }) {
          return () => {
            const {
              clsPrefix
            } = props;
            return h(NBaseLoading, {
              clsPrefix,
              class: `${clsPrefix}-base-suffix`,
              strokeWidth: 24,
              scale: 0.85,
              show: props.loading
            }, {
              default: () => props.showArrow ? h(NBaseClear, {
                clsPrefix,
                show: props.showClear,
                onClear: props.onClear
              }, {
                placeholder: () => h(NBaseIcon, {
                  clsPrefix,
                  class: `${clsPrefix}-base-suffix__arrow`
                }, {
                  default: () => resolveSlot(slots.default, () => [h(ChevronDownIcon, null)])
                })
              }) : null
            });
          };
        }
      });
      const {
        cubicBezierEaseInOut: cubicBezierEaseInOut$1
      } = commonVariables$3;
      function fadeInWidthExpandTransition({
        duration: duration2 = ".2s",
        delay: delay2 = ".1s"
      } = {}) {
        return [c("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to", {
          opacity: 1
        }), c("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from", `
 opacity: 0!important;
 margin-left: 0!important;
 margin-right: 0!important;
 `), c("&.fade-in-width-expand-transition-leave-active", `
 overflow: hidden;
 transition:
 opacity ${duration2} ${cubicBezierEaseInOut$1},
 max-width ${duration2} ${cubicBezierEaseInOut$1} ${delay2},
 margin-left ${duration2} ${cubicBezierEaseInOut$1} ${delay2},
 margin-right ${duration2} ${cubicBezierEaseInOut$1} ${delay2};
 `), c("&.fade-in-width-expand-transition-enter-active", `
 overflow: hidden;
 transition:
 opacity ${duration2} ${cubicBezierEaseInOut$1} ${delay2},
 max-width ${duration2} ${cubicBezierEaseInOut$1},
 margin-left ${duration2} ${cubicBezierEaseInOut$1},
 margin-right ${duration2} ${cubicBezierEaseInOut$1};
 `)];
      }
      const isChrome = isBrowser$1 && "chrome" in window;
      isBrowser$1 && navigator.userAgent.includes("Firefox");
      const isSafari = isBrowser$1 && navigator.userAgent.includes("Safari") && !isChrome;
      const commonVariables$2 = {
        paddingTiny: "0 8px",
        paddingSmall: "0 10px",
        paddingMedium: "0 12px",
        paddingLarge: "0 14px",
        clearSize: "16px"
      };
      const self$8 = (vars) => {
        const {
          textColor2,
          textColor3,
          textColorDisabled,
          primaryColor,
          primaryColorHover,
          inputColor,
          inputColorDisabled,
          borderColor,
          warningColor,
          warningColorHover,
          errorColor,
          errorColorHover,
          borderRadius,
          lineHeight: lineHeight2,
          fontSizeTiny,
          fontSizeSmall,
          fontSizeMedium,
          fontSizeLarge,
          heightTiny,
          heightSmall,
          heightMedium,
          heightLarge,
          actionColor,
          clearColor,
          clearColorHover,
          clearColorPressed,
          placeholderColor,
          placeholderColorDisabled,
          iconColor,
          iconColorDisabled,
          iconColorHover,
          iconColorPressed
        } = vars;
        return Object.assign(Object.assign({}, commonVariables$2), {
          countTextColorDisabled: textColorDisabled,
          countTextColor: textColor3,
          heightTiny,
          heightSmall,
          heightMedium,
          heightLarge,
          fontSizeTiny,
          fontSizeSmall,
          fontSizeMedium,
          fontSizeLarge,
          lineHeight: lineHeight2,
          lineHeightTextarea: lineHeight2,
          borderRadius,
          iconSize: "16px",
          groupLabelColor: actionColor,
          groupLabelTextColor: textColor2,
          textColor: textColor2,
          textColorDisabled,
          textDecorationColor: textColor2,
          caretColor: primaryColor,
          placeholderColor,
          placeholderColorDisabled,
          color: inputColor,
          colorDisabled: inputColorDisabled,
          colorFocus: inputColor,
          groupLabelBorder: `1px solid ${borderColor}`,
          border: `1px solid ${borderColor}`,
          borderHover: `1px solid ${primaryColorHover}`,
          borderDisabled: `1px solid ${borderColor}`,
          borderFocus: `1px solid ${primaryColorHover}`,
          boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
          alpha: 0.2
        })}`,
          loadingColor: primaryColor,
          // warning
          loadingColorWarning: warningColor,
          borderWarning: `1px solid ${warningColor}`,
          borderHoverWarning: `1px solid ${warningColorHover}`,
          colorFocusWarning: inputColor,
          borderFocusWarning: `1px solid ${warningColorHover}`,
          boxShadowFocusWarning: `0 0 0 2px ${changeColor(warningColor, {
          alpha: 0.2
        })}`,
          caretColorWarning: warningColor,
          // error
          loadingColorError: errorColor,
          borderError: `1px solid ${errorColor}`,
          borderHoverError: `1px solid ${errorColorHover}`,
          colorFocusError: inputColor,
          borderFocusError: `1px solid ${errorColorHover}`,
          boxShadowFocusError: `0 0 0 2px ${changeColor(errorColor, {
          alpha: 0.2
        })}`,
          caretColorError: errorColor,
          clearColor,
          clearColorHover,
          clearColorPressed,
          iconColor,
          iconColorDisabled,
          iconColorHover,
          iconColorPressed,
          suffixTextColor: textColor2
        });
      };
      const inputLight = {
        name: "Input",
        common: commonLight,
        self: self$8
      };
      const inputLight$1 = inputLight;
      const inputInjectionKey = createInjectionKey("n-input");
      function len(s) {
        let count = 0;
        for (const _ of s) {
          count++;
        }
        return count;
      }
      function isEmptyInputValue(value) {
        return value === "" || value == null;
      }
      function useCursor(inputElRef) {
        const selectionRef = ref(null);
        function recordCursor() {
          const {
            value: input
          } = inputElRef;
          if (!(input === null || input === void 0 ? void 0 : input.focus)) {
            reset();
            return;
          }
          const {
            selectionStart,
            selectionEnd,
            value
          } = input;
          if (selectionStart == null || selectionEnd == null) {
            reset();
            return;
          }
          selectionRef.value = {
            start: selectionStart,
            end: selectionEnd,
            beforeText: value.slice(0, selectionStart),
            afterText: value.slice(selectionEnd)
          };
        }
        function restoreCursor() {
          var _a;
          const {
            value: selection
          } = selectionRef;
          const {
            value: inputEl
          } = inputElRef;
          if (!selection || !inputEl) {
            return;
          }
          const {
            value
          } = inputEl;
          const {
            start,
            beforeText,
            afterText
          } = selection;
          let startPos = value.length;
          if (value.endsWith(afterText)) {
            startPos = value.length - afterText.length;
          } else if (value.startsWith(beforeText)) {
            startPos = beforeText.length;
          } else {
            const beforeLastChar = beforeText[start - 1];
            const newIndex = value.indexOf(beforeLastChar, start - 1);
            if (newIndex !== -1) {
              startPos = newIndex + 1;
            }
          }
          (_a = inputEl.setSelectionRange) === null || _a === void 0 ? void 0 : _a.call(inputEl, startPos, startPos);
        }
        function reset() {
          selectionRef.value = null;
        }
        watch(inputElRef, reset);
        return {
          recordCursor,
          restoreCursor
        };
      }
      const WordCount = /* @__PURE__ */ defineComponent({
        name: "InputWordCount",
        setup(_, {
          slots
        }) {
          const {
            mergedValueRef,
            maxlengthRef,
            mergedClsPrefixRef,
            countGraphemesRef
          } = (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            inject(inputInjectionKey)
          );
          const wordCountRef = computed(() => {
            const {
              value: mergedValue
            } = mergedValueRef;
            if (mergedValue === null || Array.isArray(mergedValue))
              return 0;
            return (countGraphemesRef.value || len)(mergedValue);
          });
          return () => {
            const {
              value: maxlength
            } = maxlengthRef;
            const {
              value: mergedValue
            } = mergedValueRef;
            return h("span", {
              class: `${mergedClsPrefixRef.value}-input-word-count`
            }, resolveSlotWithProps(slots.default, {
              value: mergedValue === null || Array.isArray(mergedValue) ? "" : mergedValue
            }, () => [maxlength === void 0 ? wordCountRef.value : `${wordCountRef.value} / ${maxlength}`]));
          };
        }
      });
      const style$9 = cB("input", `
 max-width: 100%;
 cursor: text;
 line-height: 1.5;
 z-index: auto;
 outline: none;
 box-sizing: border-box;
 position: relative;
 display: inline-flex;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color .3s var(--n-bezier);
 font-size: var(--n-font-size);
 --n-padding-vertical: calc((var(--n-height) - 1.5 * var(--n-font-size)) / 2);
`, [
        // common
        cE("input, textarea", `
 overflow: hidden;
 flex-grow: 1;
 position: relative;
 `),
        cE("input-el, textarea-el, input-mirror, textarea-mirror, separator, placeholder", `
 box-sizing: border-box;
 font-size: inherit;
 line-height: 1.5;
 font-family: inherit;
 border: none;
 outline: none;
 background-color: #0000;
 text-align: inherit;
 transition:
 -webkit-text-fill-color .3s var(--n-bezier),
 caret-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier);
 `),
        cE("input-el, textarea-el", `
 -webkit-appearance: none;
 scrollbar-width: none;
 width: 100%;
 min-width: 0;
 text-decoration-color: var(--n-text-decoration-color);
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 background-color: transparent;
 `, [c("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", `
 width: 0;
 height: 0;
 display: none;
 `), c("&::placeholder", `
 color: #0000;
 -webkit-text-fill-color: transparent !important;
 `), c("&:-webkit-autofill ~", [cE("placeholder", "display: none;")])]),
        cM("round", [cNotM("textarea", "border-radius: calc(var(--n-height) / 2);")]),
        cE("placeholder", `
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 overflow: hidden;
 color: var(--n-placeholder-color);
 `, [c("span", `
 width: 100%;
 display: inline-block;
 `)]),
        cM("textarea", [cE("placeholder", "overflow: visible;")]),
        cNotM("autosize", "width: 100%;"),
        cM("autosize", [cE("textarea-el, input-el", `
 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 `)]),
        // input
        cB("input-wrapper", `
 overflow: hidden;
 display: inline-flex;
 flex-grow: 1;
 position: relative;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 `),
        cE("input-mirror", `
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre;
 pointer-events: none;
 `),
        cE("input-el", `
 padding: 0;
 height: var(--n-height);
 line-height: var(--n-height);
 `, [c("&[type=password]::-ms-reveal", "display: none;"), c("+", [cE("placeholder", `
 display: flex;
 align-items: center; 
 `)])]),
        cNotM("textarea", [cE("placeholder", "white-space: nowrap;")]),
        cE("eye", `
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `),
        // textarea
        cM("textarea", "width: 100%;", [cB("input-word-count", `
 position: absolute;
 right: var(--n-padding-right);
 bottom: var(--n-padding-vertical);
 `), cM("resizable", [cB("input-wrapper", `
 resize: vertical;
 min-height: var(--n-height);
 `)]), cE("textarea-el, textarea-mirror, placeholder", `
 height: 100%;
 padding-left: 0;
 padding-right: 0;
 padding-top: var(--n-padding-vertical);
 padding-bottom: var(--n-padding-vertical);
 word-break: break-word;
 display: inline-block;
 vertical-align: bottom;
 box-sizing: border-box;
 line-height: var(--n-line-height-textarea);
 margin: 0;
 resize: none;
 white-space: pre-wrap;
 scroll-padding-block-end: var(--n-padding-vertical);
 `), cE("textarea-mirror", `
 width: 100%;
 pointer-events: none;
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre-wrap;
 overflow-wrap: break-word;
 `)]),
        // pair
        cM("pair", [cE("input-el, placeholder", "text-align: center;"), cE("separator", `
 display: flex;
 align-items: center;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 white-space: nowrap;
 `, [cB("icon", `
 color: var(--n-icon-color);
 `), cB("base-icon", `
 color: var(--n-icon-color);
 `)])]),
        cM("disabled", `
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `, [cE("border", "border: var(--n-border-disabled);"), cE("input-el, textarea-el", `
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 text-decoration-color: var(--n-text-color-disabled);
 `), cE("placeholder", "color: var(--n-placeholder-color-disabled);"), cE("separator", "color: var(--n-text-color-disabled);", [cB("icon", `
 color: var(--n-icon-color-disabled);
 `), cB("base-icon", `
 color: var(--n-icon-color-disabled);
 `)]), cB("input-word-count", `
 color: var(--n-count-text-color-disabled);
 `), cE("suffix, prefix", "color: var(--n-text-color-disabled);", [cB("icon", `
 color: var(--n-icon-color-disabled);
 `), cB("internal-icon", `
 color: var(--n-icon-color-disabled);
 `)])]),
        cNotM("disabled", [cE("eye", `
 color: var(--n-icon-color);
 cursor: pointer;
 `, [c("&:hover", `
 color: var(--n-icon-color-hover);
 `), c("&:active", `
 color: var(--n-icon-color-pressed);
 `)]), c("&:hover", [cE("state-border", "border: var(--n-border-hover);")]), cM("focus", "background-color: var(--n-color-focus);", [cE("state-border", `
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),
        cE("border, state-border", `
 box-sizing: border-box;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: inherit;
 border: var(--n-border);
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),
        cE("state-border", `
 border-color: #0000;
 z-index: 1;
 `),
        cE("prefix", "margin-right: 4px;"),
        cE("suffix", `
 margin-left: 4px;
 `),
        cE("suffix, prefix", `
 transition: color .3s var(--n-bezier);
 flex-wrap: nowrap;
 flex-shrink: 0;
 line-height: var(--n-height);
 white-space: nowrap;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 color: var(--n-suffix-text-color);
 `, [cB("base-loading", `
 font-size: var(--n-icon-size);
 margin: 0 2px;
 color: var(--n-loading-color);
 `), cB("base-clear", `
 font-size: var(--n-icon-size);
 `, [cE("placeholder", [cB("base-icon", `
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)])]), c(">", [cB("icon", `
 transition: color .3s var(--n-bezier);
 color: var(--n-icon-color);
 font-size: var(--n-icon-size);
 `)]), cB("base-icon", `
 font-size: var(--n-icon-size);
 `)]),
        cB("input-word-count", `
 pointer-events: none;
 line-height: 1.5;
 font-size: .85em;
 color: var(--n-count-text-color);
 transition: color .3s var(--n-bezier);
 margin-left: 4px;
 font-variant: tabular-nums;
 `),
        ["warning", "error"].map((status) => cM(`${status}-status`, [cNotM("disabled", [cB("base-loading", `
 color: var(--n-loading-color-${status})
 `), cE("input-el, textarea-el", `
 caret-color: var(--n-caret-color-${status});
 `), cE("state-border", `
 border: var(--n-border-${status});
 `), c("&:hover", [cE("state-border", `
 border: var(--n-border-hover-${status});
 `)]), c("&:focus", `
 background-color: var(--n-color-focus-${status});
 `, [cE("state-border", `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)]), cM("focus", `
 background-color: var(--n-color-focus-${status});
 `, [cE("state-border", `
 box-shadow: var(--n-box-shadow-focus-${status});
 border: var(--n-border-focus-${status});
 `)])])]))
      ]);
      const safariStyle = cB("input", [cM("disabled", [cE("input-el, textarea-el", `
 -webkit-text-fill-color: var(--n-text-color-disabled);
 `)])]);
      const inputProps = Object.assign(Object.assign({}, useTheme.props), {
        bordered: {
          type: Boolean,
          default: void 0
        },
        type: {
          type: String,
          default: "text"
        },
        placeholder: [Array, String],
        defaultValue: {
          type: [String, Array],
          default: null
        },
        value: [String, Array],
        disabled: {
          type: Boolean,
          default: void 0
        },
        size: String,
        rows: {
          type: [Number, String],
          default: 3
        },
        round: Boolean,
        minlength: [String, Number],
        maxlength: [String, Number],
        clearable: Boolean,
        autosize: {
          type: [Boolean, Object],
          default: false
        },
        pair: Boolean,
        separator: String,
        readonly: {
          type: [String, Boolean],
          default: false
        },
        passivelyActivated: Boolean,
        showPasswordOn: String,
        stateful: {
          type: Boolean,
          default: true
        },
        autofocus: Boolean,
        inputProps: Object,
        resizable: {
          type: Boolean,
          default: true
        },
        showCount: Boolean,
        loading: {
          type: Boolean,
          default: void 0
        },
        allowInput: Function,
        renderCount: Function,
        onMousedown: Function,
        onKeydown: Function,
        onKeyup: [Function, Array],
        onInput: [Function, Array],
        onFocus: [Function, Array],
        onBlur: [Function, Array],
        onClick: [Function, Array],
        onChange: [Function, Array],
        onClear: [Function, Array],
        countGraphemes: Function,
        status: String,
        "onUpdate:value": [Function, Array],
        onUpdateValue: [Function, Array],
        /** private */
        textDecoration: [String, Array],
        attrSize: {
          type: Number,
          default: 20
        },
        onInputBlur: [Function, Array],
        onInputFocus: [Function, Array],
        onDeactivate: [Function, Array],
        onActivate: [Function, Array],
        onWrapperFocus: [Function, Array],
        onWrapperBlur: [Function, Array],
        internalDeactivateOnEnter: Boolean,
        internalForceFocus: Boolean,
        internalLoadingBeforeSuffix: {
          type: Boolean,
          default: true
        },
        /** deprecated */
        showPasswordToggle: Boolean
      });
      const __unplugin_components_1 = /* @__PURE__ */ defineComponent({
        name: "Input",
        props: inputProps,
        setup(props) {
          const {
            mergedClsPrefixRef,
            mergedBorderedRef,
            inlineThemeDisabled,
            mergedRtlRef
          } = useConfig(props);
          const themeRef = useTheme("Input", "-input", style$9, inputLight$1, props, mergedClsPrefixRef);
          if (isSafari) {
            useStyle("-input-safari", safariStyle, mergedClsPrefixRef);
          }
          const wrapperElRef = ref(null);
          const textareaElRef = ref(null);
          const textareaMirrorElRef = ref(null);
          const inputMirrorElRef = ref(null);
          const inputElRef = ref(null);
          const inputEl2Ref = ref(null);
          const currentFocusedInputRef = ref(null);
          const focusedInputCursorControl = useCursor(currentFocusedInputRef);
          const textareaScrollbarInstRef = ref(null);
          const {
            localeRef
          } = useLocale("Input");
          const uncontrolledValueRef = ref(props.defaultValue);
          const controlledValueRef = toRef(props, "value");
          const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
          const formItem = useFormItem(props);
          const {
            mergedSizeRef,
            mergedDisabledRef,
            mergedStatusRef
          } = formItem;
          const focusedRef = ref(false);
          const hoverRef = ref(false);
          const isComposingRef2 = ref(false);
          const activatedRef = ref(false);
          let syncSource = null;
          const mergedPlaceholderRef = computed(() => {
            const {
              placeholder,
              pair
            } = props;
            if (pair) {
              if (Array.isArray(placeholder)) {
                return placeholder;
              } else if (placeholder === void 0) {
                return ["", ""];
              }
              return [placeholder, placeholder];
            } else if (placeholder === void 0) {
              return [localeRef.value.placeholder];
            } else {
              return [placeholder];
            }
          });
          const showPlaceholder1Ref = computed(() => {
            const {
              value: isComposing
            } = isComposingRef2;
            const {
              value: mergedValue
            } = mergedValueRef;
            const {
              value: mergedPlaceholder
            } = mergedPlaceholderRef;
            return !isComposing && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[0])) && mergedPlaceholder[0];
          });
          const showPlaceholder2Ref = computed(() => {
            const {
              value: isComposing
            } = isComposingRef2;
            const {
              value: mergedValue
            } = mergedValueRef;
            const {
              value: mergedPlaceholder
            } = mergedPlaceholderRef;
            return !isComposing && mergedPlaceholder[1] && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[1]));
          });
          const mergedFocusRef = useMemo(() => {
            return props.internalForceFocus || focusedRef.value;
          });
          const showClearButton = useMemo(() => {
            if (mergedDisabledRef.value || props.readonly || !props.clearable || !mergedFocusRef.value && !hoverRef.value) {
              return false;
            }
            const {
              value: mergedValue
            } = mergedValueRef;
            const {
              value: mergedFocus
            } = mergedFocusRef;
            if (props.pair) {
              return !!(Array.isArray(mergedValue) && (mergedValue[0] || mergedValue[1])) && (hoverRef.value || mergedFocus);
            } else {
              return !!mergedValue && (hoverRef.value || mergedFocus);
            }
          });
          const mergedShowPasswordOnRef = computed(() => {
            const {
              showPasswordOn
            } = props;
            if (showPasswordOn) {
              return showPasswordOn;
            }
            if (props.showPasswordToggle)
              return "click";
            return void 0;
          });
          const passwordVisibleRef = ref(false);
          const textDecorationStyleRef = computed(() => {
            const {
              textDecoration
            } = props;
            if (!textDecoration)
              return ["", ""];
            if (Array.isArray(textDecoration)) {
              return textDecoration.map((v) => ({
                textDecoration: v
              }));
            }
            return [{
              textDecoration
            }];
          });
          const textAreaScrollContainerWidthRef = ref(void 0);
          const updateTextAreaStyle = () => {
            var _a, _b;
            if (props.type === "textarea") {
              const {
                autosize
              } = props;
              if (autosize) {
                textAreaScrollContainerWidthRef.value = (_b = (_a = textareaScrollbarInstRef.value) === null || _a === void 0 ? void 0 : _a.$el) === null || _b === void 0 ? void 0 : _b.offsetWidth;
              }
              if (!textareaElRef.value)
                return;
              if (typeof autosize === "boolean")
                return;
              const {
                paddingTop: stylePaddingTop,
                paddingBottom: stylePaddingBottom,
                lineHeight: styleLineHeight
              } = window.getComputedStyle(textareaElRef.value);
              const paddingTop = Number(stylePaddingTop.slice(0, -2));
              const paddingBottom = Number(stylePaddingBottom.slice(0, -2));
              const lineHeight2 = Number(styleLineHeight.slice(0, -2));
              const {
                value: textareaMirrorEl
              } = textareaMirrorElRef;
              if (!textareaMirrorEl)
                return;
              if (autosize.minRows) {
                const minRows = Math.max(autosize.minRows, 1);
                const styleMinHeight = `${paddingTop + paddingBottom + lineHeight2 * minRows}px`;
                textareaMirrorEl.style.minHeight = styleMinHeight;
              }
              if (autosize.maxRows) {
                const styleMaxHeight = `${paddingTop + paddingBottom + lineHeight2 * autosize.maxRows}px`;
                textareaMirrorEl.style.maxHeight = styleMaxHeight;
              }
            }
          };
          const maxlengthRef = computed(() => {
            const {
              maxlength
            } = props;
            return maxlength === void 0 ? void 0 : Number(maxlength);
          });
          onMounted(() => {
            const {
              value
            } = mergedValueRef;
            if (!Array.isArray(value)) {
              syncMirror(value);
            }
          });
          const vm = getCurrentInstance().proxy;
          function doUpdateValue(value, meta) {
            const {
              onUpdateValue,
              "onUpdate:value": _onUpdateValue,
              onInput
            } = props;
            const {
              nTriggerFormInput
            } = formItem;
            if (onUpdateValue)
              call(onUpdateValue, value, meta);
            if (_onUpdateValue)
              call(_onUpdateValue, value, meta);
            if (onInput)
              call(onInput, value, meta);
            uncontrolledValueRef.value = value;
            nTriggerFormInput();
          }
          function doChange(value, meta) {
            const {
              onChange
            } = props;
            const {
              nTriggerFormChange
            } = formItem;
            if (onChange)
              call(onChange, value, meta);
            uncontrolledValueRef.value = value;
            nTriggerFormChange();
          }
          function doBlur(e) {
            const {
              onBlur
            } = props;
            const {
              nTriggerFormBlur
            } = formItem;
            if (onBlur)
              call(onBlur, e);
            nTriggerFormBlur();
          }
          function doFocus(e) {
            const {
              onFocus
            } = props;
            const {
              nTriggerFormFocus
            } = formItem;
            if (onFocus)
              call(onFocus, e);
            nTriggerFormFocus();
          }
          function doClear(e) {
            const {
              onClear
            } = props;
            if (onClear)
              call(onClear, e);
          }
          function doUpdateValueBlur(e) {
            const {
              onInputBlur
            } = props;
            if (onInputBlur)
              call(onInputBlur, e);
          }
          function doUpdateValueFocus(e) {
            const {
              onInputFocus
            } = props;
            if (onInputFocus)
              call(onInputFocus, e);
          }
          function doDeactivate() {
            const {
              onDeactivate
            } = props;
            if (onDeactivate)
              call(onDeactivate);
          }
          function doActivate() {
            const {
              onActivate
            } = props;
            if (onActivate)
              call(onActivate);
          }
          function doClick(e) {
            const {
              onClick
            } = props;
            if (onClick)
              call(onClick, e);
          }
          function doWrapperFocus(e) {
            const {
              onWrapperFocus
            } = props;
            if (onWrapperFocus)
              call(onWrapperFocus, e);
          }
          function doWrapperBlur(e) {
            const {
              onWrapperBlur
            } = props;
            if (onWrapperBlur)
              call(onWrapperBlur, e);
          }
          function handleCompositionStart() {
            isComposingRef2.value = true;
          }
          function handleCompositionEnd(e) {
            isComposingRef2.value = false;
            if (e.target === inputEl2Ref.value) {
              handleInput(e, 1);
            } else {
              handleInput(e, 0);
            }
          }
          function handleInput(e, index = 0, event = "input") {
            const targetValue = e.target.value;
            syncMirror(targetValue);
            if (e instanceof InputEvent && !e.isComposing) {
              isComposingRef2.value = false;
            }
            if (props.type === "textarea") {
              const {
                value: textareaScrollbarInst
              } = textareaScrollbarInstRef;
              if (textareaScrollbarInst) {
                textareaScrollbarInst.syncUnifiedContainer();
              }
            }
            syncSource = targetValue;
            if (isComposingRef2.value)
              return;
            focusedInputCursorControl.recordCursor();
            const isIncomingValueValid = allowInput(targetValue);
            if (isIncomingValueValid) {
              if (!props.pair) {
                event === "input" ? doUpdateValue(targetValue, {
                  source: index
                }) : doChange(targetValue, {
                  source: index
                });
              } else {
                let {
                  value
                } = mergedValueRef;
                if (!Array.isArray(value)) {
                  value = ["", ""];
                } else {
                  value = [value[0], value[1]];
                }
                value[index] = targetValue;
                event === "input" ? doUpdateValue(value, {
                  source: index
                }) : doChange(value, {
                  source: index
                });
              }
            }
            vm.$forceUpdate();
            if (!isIncomingValueValid) {
              void nextTick(focusedInputCursorControl.restoreCursor);
            }
          }
          function allowInput(value) {
            const {
              countGraphemes,
              maxlength,
              minlength
            } = props;
            if (countGraphemes) {
              let graphemesCount;
              if (maxlength !== void 0) {
                if (graphemesCount === void 0) {
                  graphemesCount = countGraphemes(value);
                }
                if (graphemesCount > Number(maxlength))
                  return false;
              }
              if (minlength !== void 0) {
                if (graphemesCount === void 0) {
                  graphemesCount = countGraphemes(value);
                }
                if (graphemesCount < Number(maxlength))
                  return false;
              }
            }
            const {
              allowInput: allowInput2
            } = props;
            if (typeof allowInput2 === "function") {
              return allowInput2(value);
            }
            return true;
          }
          function handleInputBlur(e) {
            doUpdateValueBlur(e);
            if (e.relatedTarget === wrapperElRef.value) {
              doDeactivate();
            }
            if (!(e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value))) {
              activatedRef.value = false;
            }
            dealWithEvent(e, "blur");
            currentFocusedInputRef.value = null;
          }
          function handleInputFocus(e, index) {
            doUpdateValueFocus(e);
            focusedRef.value = true;
            activatedRef.value = true;
            doActivate();
            dealWithEvent(e, "focus");
            if (index === 0) {
              currentFocusedInputRef.value = inputElRef.value;
            } else if (index === 1) {
              currentFocusedInputRef.value = inputEl2Ref.value;
            } else if (index === 2) {
              currentFocusedInputRef.value = textareaElRef.value;
            }
          }
          function handleWrapperBlur(e) {
            if (props.passivelyActivated) {
              doWrapperBlur(e);
              dealWithEvent(e, "blur");
            }
          }
          function handleWrapperFocus(e) {
            if (props.passivelyActivated) {
              focusedRef.value = true;
              doWrapperFocus(e);
              dealWithEvent(e, "focus");
            }
          }
          function dealWithEvent(e, type) {
            if (e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value || e.relatedTarget === wrapperElRef.value))
              ;
            else {
              if (type === "focus") {
                doFocus(e);
                focusedRef.value = true;
              } else if (type === "blur") {
                doBlur(e);
                focusedRef.value = false;
              }
            }
          }
          function handleChange(e, index) {
            handleInput(e, index, "change");
          }
          function handleClick(e) {
            doClick(e);
          }
          function handleClear(e) {
            doClear(e);
            clearValue();
          }
          function clearValue() {
            if (props.pair) {
              doUpdateValue(["", ""], {
                source: "clear"
              });
              doChange(["", ""], {
                source: "clear"
              });
            } else {
              doUpdateValue("", {
                source: "clear"
              });
              doChange("", {
                source: "clear"
              });
            }
          }
          function handleMouseDown(e) {
            const {
              onMousedown
            } = props;
            if (onMousedown)
              onMousedown(e);
            const {
              tagName
            } = e.target;
            if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
              if (props.resizable) {
                const {
                  value: wrapperEl
                } = wrapperElRef;
                if (wrapperEl) {
                  const {
                    left,
                    top,
                    width,
                    height
                  } = wrapperEl.getBoundingClientRect();
                  const resizeHandleSize = 14;
                  if (left + width - resizeHandleSize < e.clientX && e.clientX < left + width && top + height - resizeHandleSize < e.clientY && e.clientY < top + height) {
                    return;
                  }
                }
              }
              e.preventDefault();
              if (!focusedRef.value) {
                focus();
              }
            }
          }
          function handleMouseEnter() {
            var _a;
            hoverRef.value = true;
            if (props.type === "textarea") {
              (_a = textareaScrollbarInstRef.value) === null || _a === void 0 ? void 0 : _a.handleMouseEnterWrapper();
            }
          }
          function handleMouseLeave() {
            var _a;
            hoverRef.value = false;
            if (props.type === "textarea") {
              (_a = textareaScrollbarInstRef.value) === null || _a === void 0 ? void 0 : _a.handleMouseLeaveWrapper();
            }
          }
          function handlePasswordToggleClick() {
            if (mergedDisabledRef.value)
              return;
            if (mergedShowPasswordOnRef.value !== "click")
              return;
            passwordVisibleRef.value = !passwordVisibleRef.value;
          }
          function handlePasswordToggleMousedown(e) {
            if (mergedDisabledRef.value)
              return;
            e.preventDefault();
            const preventDefaultOnce = (e2) => {
              e2.preventDefault();
              off("mouseup", document, preventDefaultOnce);
            };
            on("mouseup", document, preventDefaultOnce);
            if (mergedShowPasswordOnRef.value !== "mousedown")
              return;
            passwordVisibleRef.value = true;
            const hidePassword = () => {
              passwordVisibleRef.value = false;
              off("mouseup", document, hidePassword);
            };
            on("mouseup", document, hidePassword);
          }
          function handleWrapperKeyup(e) {
            if (props.onKeyup)
              call(props.onKeyup, e);
          }
          function handleWrapperKeydown(e) {
            if (props.onKeydown)
              call(props.onKeydown, e);
            switch (e.key) {
              case "Escape":
                handleWrapperKeydownEsc();
                break;
              case "Enter":
                handleWrapperKeydownEnter(e);
                break;
            }
          }
          function handleWrapperKeydownEnter(e) {
            var _a, _b;
            if (props.passivelyActivated) {
              const {
                value: focused
              } = activatedRef;
              if (focused) {
                if (props.internalDeactivateOnEnter) {
                  handleWrapperKeydownEsc();
                }
                return;
              }
              e.preventDefault();
              if (props.type === "textarea") {
                (_a = textareaElRef.value) === null || _a === void 0 ? void 0 : _a.focus();
              } else {
                (_b = inputElRef.value) === null || _b === void 0 ? void 0 : _b.focus();
              }
            }
          }
          function handleWrapperKeydownEsc() {
            if (props.passivelyActivated) {
              activatedRef.value = false;
              void nextTick(() => {
                var _a;
                (_a = wrapperElRef.value) === null || _a === void 0 ? void 0 : _a.focus();
              });
            }
          }
          function focus() {
            var _a, _b, _c;
            if (mergedDisabledRef.value)
              return;
            if (props.passivelyActivated) {
              (_a = wrapperElRef.value) === null || _a === void 0 ? void 0 : _a.focus();
            } else {
              (_b = textareaElRef.value) === null || _b === void 0 ? void 0 : _b.focus();
              (_c = inputElRef.value) === null || _c === void 0 ? void 0 : _c.focus();
            }
          }
          function blur() {
            var _a;
            if ((_a = wrapperElRef.value) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement)) {
              document.activeElement.blur();
            }
          }
          function select() {
            var _a, _b;
            (_a = textareaElRef.value) === null || _a === void 0 ? void 0 : _a.select();
            (_b = inputElRef.value) === null || _b === void 0 ? void 0 : _b.select();
          }
          function activate() {
            if (mergedDisabledRef.value)
              return;
            if (textareaElRef.value)
              textareaElRef.value.focus();
            else if (inputElRef.value)
              inputElRef.value.focus();
          }
          function deactivate() {
            const {
              value: wrapperEl
            } = wrapperElRef;
            if ((wrapperEl === null || wrapperEl === void 0 ? void 0 : wrapperEl.contains(document.activeElement)) && wrapperEl !== document.activeElement) {
              handleWrapperKeydownEsc();
            }
          }
          function scrollTo(options) {
            if (props.type === "textarea") {
              const {
                value: textareaEl
              } = textareaElRef;
              textareaEl === null || textareaEl === void 0 ? void 0 : textareaEl.scrollTo(options);
            } else {
              const {
                value: inputEl
              } = inputElRef;
              inputEl === null || inputEl === void 0 ? void 0 : inputEl.scrollTo(options);
            }
          }
          function syncMirror(value) {
            const {
              type,
              pair,
              autosize
            } = props;
            if (!pair && autosize) {
              if (type === "textarea") {
                const {
                  value: textareaMirrorEl
                } = textareaMirrorElRef;
                if (textareaMirrorEl) {
                  textareaMirrorEl.textContent = (value !== null && value !== void 0 ? value : "") + "\r\n";
                }
              } else {
                const {
                  value: inputMirrorEl
                } = inputMirrorElRef;
                if (inputMirrorEl) {
                  if (value) {
                    inputMirrorEl.textContent = value;
                  } else {
                    inputMirrorEl.innerHTML = "&nbsp;";
                  }
                }
              }
            }
          }
          function handleTextAreaMirrorResize() {
            updateTextAreaStyle();
          }
          const placeholderStyleRef = ref({
            top: "0"
          });
          function handleTextAreaScroll(e) {
            var _a;
            const {
              scrollTop
            } = e.target;
            placeholderStyleRef.value.top = `${-scrollTop}px`;
            (_a = textareaScrollbarInstRef.value) === null || _a === void 0 ? void 0 : _a.syncUnifiedContainer();
          }
          let stopWatchMergedValue1 = null;
          watchEffect(() => {
            const {
              autosize,
              type
            } = props;
            if (autosize && type === "textarea") {
              stopWatchMergedValue1 = watch(mergedValueRef, (value) => {
                if (!Array.isArray(value) && value !== syncSource) {
                  syncMirror(value);
                }
              });
            } else {
              stopWatchMergedValue1 === null || stopWatchMergedValue1 === void 0 ? void 0 : stopWatchMergedValue1();
            }
          });
          let stopWatchMergedValue2 = null;
          watchEffect(() => {
            if (props.type === "textarea") {
              stopWatchMergedValue2 = watch(mergedValueRef, (value) => {
                var _a;
                if (!Array.isArray(value) && value !== syncSource) {
                  (_a = textareaScrollbarInstRef.value) === null || _a === void 0 ? void 0 : _a.syncUnifiedContainer();
                }
              });
            } else {
              stopWatchMergedValue2 === null || stopWatchMergedValue2 === void 0 ? void 0 : stopWatchMergedValue2();
            }
          });
          provide(inputInjectionKey, {
            mergedValueRef,
            maxlengthRef,
            mergedClsPrefixRef,
            countGraphemesRef: toRef(props, "countGraphemes")
          });
          const exposedProps = {
            wrapperElRef,
            inputElRef,
            textareaElRef,
            isCompositing: isComposingRef2,
            clear: clearValue,
            focus,
            blur,
            select,
            deactivate,
            activate,
            scrollTo
          };
          const rtlEnabledRef = useRtl("Input", mergedRtlRef, mergedClsPrefixRef);
          const cssVarsRef = computed(() => {
            const {
              value: size2
            } = mergedSizeRef;
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2
              },
              self: {
                color,
                borderRadius,
                textColor,
                caretColor,
                caretColorError,
                caretColorWarning,
                textDecorationColor,
                border,
                borderDisabled,
                borderHover,
                borderFocus,
                placeholderColor,
                placeholderColorDisabled,
                lineHeightTextarea,
                colorDisabled,
                colorFocus,
                textColorDisabled,
                boxShadowFocus,
                iconSize,
                colorFocusWarning,
                boxShadowFocusWarning,
                borderWarning,
                borderFocusWarning,
                borderHoverWarning,
                colorFocusError,
                boxShadowFocusError,
                borderError,
                borderFocusError,
                borderHoverError,
                clearSize,
                clearColor,
                clearColorHover,
                clearColorPressed,
                iconColor,
                iconColorDisabled,
                suffixTextColor,
                countTextColor,
                countTextColorDisabled,
                iconColorHover,
                iconColorPressed,
                loadingColor,
                loadingColorError,
                loadingColorWarning,
                [createKey("padding", size2)]: padding,
                [createKey("fontSize", size2)]: fontSize2,
                [createKey("height", size2)]: height
              }
            } = themeRef.value;
            const {
              left: paddingLeft,
              right: paddingRight
            } = getMargin(padding);
            return {
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-count-text-color": countTextColor,
              "--n-count-text-color-disabled": countTextColorDisabled,
              "--n-color": color,
              "--n-font-size": fontSize2,
              "--n-border-radius": borderRadius,
              "--n-height": height,
              "--n-padding-left": paddingLeft,
              "--n-padding-right": paddingRight,
              "--n-text-color": textColor,
              "--n-caret-color": caretColor,
              "--n-text-decoration-color": textDecorationColor,
              "--n-border": border,
              "--n-border-disabled": borderDisabled,
              "--n-border-hover": borderHover,
              "--n-border-focus": borderFocus,
              "--n-placeholder-color": placeholderColor,
              "--n-placeholder-color-disabled": placeholderColorDisabled,
              "--n-icon-size": iconSize,
              "--n-line-height-textarea": lineHeightTextarea,
              "--n-color-disabled": colorDisabled,
              "--n-color-focus": colorFocus,
              "--n-text-color-disabled": textColorDisabled,
              "--n-box-shadow-focus": boxShadowFocus,
              "--n-loading-color": loadingColor,
              // form warning
              "--n-caret-color-warning": caretColorWarning,
              "--n-color-focus-warning": colorFocusWarning,
              "--n-box-shadow-focus-warning": boxShadowFocusWarning,
              "--n-border-warning": borderWarning,
              "--n-border-focus-warning": borderFocusWarning,
              "--n-border-hover-warning": borderHoverWarning,
              "--n-loading-color-warning": loadingColorWarning,
              // form error
              "--n-caret-color-error": caretColorError,
              "--n-color-focus-error": colorFocusError,
              "--n-box-shadow-focus-error": boxShadowFocusError,
              "--n-border-error": borderError,
              "--n-border-focus-error": borderFocusError,
              "--n-border-hover-error": borderHoverError,
              "--n-loading-color-error": loadingColorError,
              // clear-button
              "--n-clear-color": clearColor,
              "--n-clear-size": clearSize,
              "--n-clear-color-hover": clearColorHover,
              "--n-clear-color-pressed": clearColorPressed,
              "--n-icon-color": iconColor,
              "--n-icon-color-hover": iconColorHover,
              "--n-icon-color-pressed": iconColorPressed,
              "--n-icon-color-disabled": iconColorDisabled,
              "--n-suffix-text-color": suffixTextColor
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("input", computed(() => {
            const {
              value: size2
            } = mergedSizeRef;
            return size2[0];
          }), cssVarsRef, props) : void 0;
          return Object.assign(Object.assign({}, exposedProps), {
            // DOM ref
            wrapperElRef,
            inputElRef,
            inputMirrorElRef,
            inputEl2Ref,
            textareaElRef,
            textareaMirrorElRef,
            textareaScrollbarInstRef,
            // value
            rtlEnabled: rtlEnabledRef,
            uncontrolledValue: uncontrolledValueRef,
            mergedValue: mergedValueRef,
            passwordVisible: passwordVisibleRef,
            mergedPlaceholder: mergedPlaceholderRef,
            showPlaceholder1: showPlaceholder1Ref,
            showPlaceholder2: showPlaceholder2Ref,
            mergedFocus: mergedFocusRef,
            isComposing: isComposingRef2,
            activated: activatedRef,
            showClearButton,
            mergedSize: mergedSizeRef,
            mergedDisabled: mergedDisabledRef,
            textDecorationStyle: textDecorationStyleRef,
            mergedClsPrefix: mergedClsPrefixRef,
            mergedBordered: mergedBorderedRef,
            mergedShowPasswordOn: mergedShowPasswordOnRef,
            placeholderStyle: placeholderStyleRef,
            mergedStatus: mergedStatusRef,
            textAreaScrollContainerWidth: textAreaScrollContainerWidthRef,
            // methods
            handleTextAreaScroll,
            handleCompositionStart,
            handleCompositionEnd,
            handleInput,
            handleInputBlur,
            handleInputFocus,
            handleWrapperBlur,
            handleWrapperFocus,
            handleMouseEnter,
            handleMouseLeave,
            handleMouseDown,
            handleChange,
            handleClick,
            handleClear,
            handlePasswordToggleClick,
            handlePasswordToggleMousedown,
            handleWrapperKeydown,
            handleWrapperKeyup,
            handleTextAreaMirrorResize,
            getTextareaScrollContainer: () => {
              return textareaElRef.value;
            },
            mergedTheme: themeRef,
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          });
        },
        render() {
          var _a, _b;
          const {
            mergedClsPrefix,
            mergedStatus,
            themeClass,
            type,
            countGraphemes,
            onRender
          } = this;
          const $slots = this.$slots;
          onRender === null || onRender === void 0 ? void 0 : onRender();
          return h("div", {
            ref: "wrapperElRef",
            class: [`${mergedClsPrefix}-input`, themeClass, mergedStatus && `${mergedClsPrefix}-input--${mergedStatus}-status`, {
              [`${mergedClsPrefix}-input--rtl`]: this.rtlEnabled,
              [`${mergedClsPrefix}-input--disabled`]: this.mergedDisabled,
              [`${mergedClsPrefix}-input--textarea`]: type === "textarea",
              [`${mergedClsPrefix}-input--resizable`]: this.resizable && !this.autosize,
              [`${mergedClsPrefix}-input--autosize`]: this.autosize,
              [`${mergedClsPrefix}-input--round`]: this.round && !(type === "textarea"),
              [`${mergedClsPrefix}-input--pair`]: this.pair,
              [`${mergedClsPrefix}-input--focus`]: this.mergedFocus,
              [`${mergedClsPrefix}-input--stateful`]: this.stateful
            }],
            style: this.cssVars,
            tabindex: !this.mergedDisabled && this.passivelyActivated && !this.activated ? 0 : void 0,
            onFocus: this.handleWrapperFocus,
            onBlur: this.handleWrapperBlur,
            onClick: this.handleClick,
            onMousedown: this.handleMouseDown,
            onMouseenter: this.handleMouseEnter,
            onMouseleave: this.handleMouseLeave,
            onCompositionstart: this.handleCompositionStart,
            onCompositionend: this.handleCompositionEnd,
            onKeyup: this.handleWrapperKeyup,
            onKeydown: this.handleWrapperKeydown
          }, h("div", {
            class: `${mergedClsPrefix}-input-wrapper`
          }, resolveWrappedSlot($slots.prefix, (children) => children && h("div", {
            class: `${mergedClsPrefix}-input__prefix`
          }, children)), type === "textarea" ? h(NScrollbar, {
            ref: "textareaScrollbarInstRef",
            class: `${mergedClsPrefix}-input__textarea`,
            container: this.getTextareaScrollContainer,
            triggerDisplayManually: true,
            useUnifiedContainer: true,
            internalHoistYRail: true
          }, {
            default: () => {
              var _a2, _b2;
              const {
                textAreaScrollContainerWidth
              } = this;
              const scrollContainerWidthStyle = {
                width: this.autosize && textAreaScrollContainerWidth && `${textAreaScrollContainerWidth}px`
              };
              return h(Fragment, null, h("textarea", Object.assign({}, this.inputProps, {
                ref: "textareaElRef",
                class: [`${mergedClsPrefix}-input__textarea-el`, (_a2 = this.inputProps) === null || _a2 === void 0 ? void 0 : _a2.class],
                autofocus: this.autofocus,
                rows: Number(this.rows),
                placeholder: this.placeholder,
                value: this.mergedValue,
                disabled: this.mergedDisabled,
                maxlength: countGraphemes ? void 0 : this.maxlength,
                minlength: countGraphemes ? void 0 : this.minlength,
                readonly: this.readonly,
                tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
                style: [this.textDecorationStyle[0], (_b2 = this.inputProps) === null || _b2 === void 0 ? void 0 : _b2.style, scrollContainerWidthStyle],
                onBlur: this.handleInputBlur,
                onFocus: (e) => {
                  this.handleInputFocus(e, 2);
                },
                onInput: this.handleInput,
                onChange: this.handleChange,
                onScroll: this.handleTextAreaScroll
              })), this.showPlaceholder1 ? h("div", {
                class: `${mergedClsPrefix}-input__placeholder`,
                style: [this.placeholderStyle, scrollContainerWidthStyle],
                key: "placeholder"
              }, this.mergedPlaceholder[0]) : null, this.autosize ? h(VResizeObserver, {
                onResize: this.handleTextAreaMirrorResize
              }, {
                default: () => h("div", {
                  ref: "textareaMirrorElRef",
                  class: `${mergedClsPrefix}-input__textarea-mirror`,
                  key: "mirror"
                })
              }) : null);
            }
          }) : h("div", {
            class: `${mergedClsPrefix}-input__input`
          }, h("input", Object.assign({
            type: type === "password" && this.mergedShowPasswordOn && this.passwordVisible ? "text" : type
          }, this.inputProps, {
            ref: "inputElRef",
            class: [`${mergedClsPrefix}-input__input-el`, (_a = this.inputProps) === null || _a === void 0 ? void 0 : _a.class],
            style: [this.textDecorationStyle[0], (_b = this.inputProps) === null || _b === void 0 ? void 0 : _b.style],
            tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
            placeholder: this.mergedPlaceholder[0],
            disabled: this.mergedDisabled,
            maxlength: countGraphemes ? void 0 : this.maxlength,
            minlength: countGraphemes ? void 0 : this.minlength,
            value: Array.isArray(this.mergedValue) ? this.mergedValue[0] : this.mergedValue,
            readonly: this.readonly,
            autofocus: this.autofocus,
            size: this.attrSize,
            onBlur: this.handleInputBlur,
            onFocus: (e) => {
              this.handleInputFocus(e, 0);
            },
            onInput: (e) => {
              this.handleInput(e, 0);
            },
            onChange: (e) => {
              this.handleChange(e, 0);
            }
          })), this.showPlaceholder1 ? h("div", {
            class: `${mergedClsPrefix}-input__placeholder`
          }, h("span", null, this.mergedPlaceholder[0])) : null, this.autosize ? h("div", {
            class: `${mergedClsPrefix}-input__input-mirror`,
            key: "mirror",
            ref: "inputMirrorElRef"
          }, " ") : null), !this.pair && resolveWrappedSlot($slots.suffix, (children) => {
            return children || this.clearable || this.showCount || this.mergedShowPasswordOn || this.loading !== void 0 ? h("div", {
              class: `${mergedClsPrefix}-input__suffix`
            }, [resolveWrappedSlot($slots["clear-icon-placeholder"], (children2) => {
              return (this.clearable || children2) && h(NBaseClear, {
                clsPrefix: mergedClsPrefix,
                show: this.showClearButton,
                onClear: this.handleClear
              }, {
                placeholder: () => children2,
                icon: () => {
                  var _a2, _b2;
                  return (_b2 = (_a2 = this.$slots)["clear-icon"]) === null || _b2 === void 0 ? void 0 : _b2.call(_a2);
                }
              });
            }), !this.internalLoadingBeforeSuffix ? children : null, this.loading !== void 0 ? h(NBaseSuffix, {
              clsPrefix: mergedClsPrefix,
              loading: this.loading,
              showArrow: false,
              showClear: false,
              style: this.cssVars
            }) : null, this.internalLoadingBeforeSuffix ? children : null, this.showCount && this.type !== "textarea" ? h(WordCount, null, {
              default: (props) => {
                var _a2;
                return (_a2 = $slots.count) === null || _a2 === void 0 ? void 0 : _a2.call($slots, props);
              }
            }) : null, this.mergedShowPasswordOn && this.type === "password" ? h("div", {
              class: `${mergedClsPrefix}-input__eye`,
              onMousedown: this.handlePasswordToggleMousedown,
              onClick: this.handlePasswordToggleClick
            }, this.passwordVisible ? resolveSlot($slots["password-visible-icon"], () => [h(NBaseIcon, {
              clsPrefix: mergedClsPrefix
            }, {
              default: () => h(EyeIcon, null)
            })]) : resolveSlot($slots["password-invisible-icon"], () => [h(NBaseIcon, {
              clsPrefix: mergedClsPrefix
            }, {
              default: () => h(EyeOffIcon, null)
            })])) : null]) : null;
          })), this.pair ? h("span", {
            class: `${mergedClsPrefix}-input__separator`
          }, resolveSlot($slots.separator, () => [this.separator])) : null, this.pair ? h("div", {
            class: `${mergedClsPrefix}-input-wrapper`
          }, h("div", {
            class: `${mergedClsPrefix}-input__input`
          }, h("input", {
            ref: "inputEl2Ref",
            type: this.type,
            class: `${mergedClsPrefix}-input__input-el`,
            tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
            placeholder: this.mergedPlaceholder[1],
            disabled: this.mergedDisabled,
            maxlength: countGraphemes ? void 0 : this.maxlength,
            minlength: countGraphemes ? void 0 : this.minlength,
            value: Array.isArray(this.mergedValue) ? this.mergedValue[1] : void 0,
            readonly: this.readonly,
            style: this.textDecorationStyle[1],
            onBlur: this.handleInputBlur,
            onFocus: (e) => {
              this.handleInputFocus(e, 1);
            },
            onInput: (e) => {
              this.handleInput(e, 1);
            },
            onChange: (e) => {
              this.handleChange(e, 1);
            }
          }), this.showPlaceholder2 ? h("div", {
            class: `${mergedClsPrefix}-input__placeholder`
          }, h("span", null, this.mergedPlaceholder[1])) : null), resolveWrappedSlot($slots.suffix, (children) => {
            return (this.clearable || children) && h("div", {
              class: `${mergedClsPrefix}-input__suffix`
            }, [this.clearable && h(NBaseClear, {
              clsPrefix: mergedClsPrefix,
              show: this.showClearButton,
              onClear: this.handleClear
            }, {
              icon: () => {
                var _a2;
                return (_a2 = $slots["clear-icon"]) === null || _a2 === void 0 ? void 0 : _a2.call($slots);
              },
              placeholder: () => {
                var _a2;
                return (_a2 = $slots["clear-icon-placeholder"]) === null || _a2 === void 0 ? void 0 : _a2.call($slots);
              }
            }), children]);
          })) : null, this.mergedBordered ? h("div", {
            class: `${mergedClsPrefix}-input__border`
          }) : null, this.mergedBordered ? h("div", {
            class: `${mergedClsPrefix}-input__state-border`
          }) : null, this.showCount && type === "textarea" ? h(WordCount, null, {
            default: (props) => {
              var _a2;
              const {
                renderCount
              } = this;
              if (renderCount) {
                return renderCount(props);
              }
              return (_a2 = $slots.count) === null || _a2 === void 0 ? void 0 : _a2.call($slots, props);
            }
          }) : null);
        }
      });
      const style$8 = cB("input-group", `
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`, [c(">", [cB("input", [c("&:not(:last-child)", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), c("&:not(:first-child)", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]), cB("button", [c("&:not(:last-child)", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `, [cE("state-border, border", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]), c("&:not(:first-child)", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `, [cE("state-border, border", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]), c("*", [c("&:not(:last-child)", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `, [c(">", [cB("input", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), cB("base-selection", [cB("base-selection-label", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), cB("base-selection-tags", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `), cE("box-shadow, border, state-border", `
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]), c("&:not(:first-child)", `
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `, [c(">", [cB("input", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `), cB("base-selection", [cB("base-selection-label", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `), cB("base-selection-tags", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `), cE("box-shadow, border, state-border", `
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]);
      const inputGroupProps = {};
      const __unplugin_components_2 = /* @__PURE__ */ defineComponent({
        name: "InputGroup",
        props: inputGroupProps,
        setup(props) {
          const {
            mergedClsPrefixRef
          } = useConfig(props);
          useStyle("-input-group", style$8, mergedClsPrefixRef);
          return {
            mergedClsPrefix: mergedClsPrefixRef
          };
        },
        render() {
          const {
            mergedClsPrefix
          } = this;
          return h("div", {
            class: `${mergedClsPrefix}-input-group`
          }, this.$slots);
        }
      });
      const style$7 = cB("input-group-label", `
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 box-sizing: border-box;
 padding: 0 12px;
 display: inline-block;
 border-radius: var(--n-border-radius);
 background-color: var(--n-group-label-color);
 color: var(--n-group-label-text-color);
 font-size: var(--n-font-size);
 line-height: var(--n-height);
 height: var(--n-height);
 flex-shrink: 0;
 white-space: nowrap;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`, [cE("border", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-group-label-border);
 transition: border-color .3s var(--n-bezier);
 `)]);
      const inputGroupLabelProps = Object.assign(Object.assign({}, useTheme.props), {
        size: {
          type: String,
          default: "medium"
        },
        bordered: {
          type: Boolean,
          default: void 0
        }
      });
      const __unplugin_components_0 = /* @__PURE__ */ defineComponent({
        name: "InputGroupLabel",
        props: inputGroupLabelProps,
        setup(props) {
          const {
            mergedBorderedRef,
            mergedClsPrefixRef,
            inlineThemeDisabled
          } = useConfig(props);
          const themeRef = useTheme("Input", "-input-group-label", style$7, inputLight$1, props, mergedClsPrefixRef);
          const cssVarsRef = computed(() => {
            const {
              size: size2
            } = props;
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2
              },
              self: {
                groupLabelColor,
                borderRadius,
                groupLabelTextColor,
                lineHeight: lineHeight2,
                groupLabelBorder,
                [createKey("fontSize", size2)]: fontSize2,
                [createKey("height", size2)]: height
              }
            } = themeRef.value;
            return {
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-group-label-color": groupLabelColor,
              "--n-group-label-border": groupLabelBorder,
              "--n-border-radius": borderRadius,
              "--n-group-label-text-color": groupLabelTextColor,
              "--n-font-size": fontSize2,
              "--n-line-height": lineHeight2,
              "--n-height": height
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("input-group-label", computed(() => props.size[0]), cssVarsRef, props) : void 0;
          return {
            mergedClsPrefix: mergedClsPrefixRef,
            mergedBordered: mergedBorderedRef,
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          };
        },
        render() {
          var _a, _b, _c;
          const {
            mergedClsPrefix
          } = this;
          (_a = this.onRender) === null || _a === void 0 ? void 0 : _a.call(this);
          return h("div", {
            class: [`${mergedClsPrefix}-input-group-label`, this.themeClass],
            style: this.cssVars
          }, (_c = (_b = this.$slots).default) === null || _c === void 0 ? void 0 : _c.call(_b), this.mergedBordered ? h("div", {
            class: `${mergedClsPrefix}-input-group-label__border`
          }) : null);
        }
      });
      function createHoverColor(rgb) {
        return composite(rgb, [255, 255, 255, 0.16]);
      }
      function createPressedColor(rgb) {
        return composite(rgb, [0, 0, 0, 0.12]);
      }
      const buttonGroupInjectionKey = createInjectionKey("n-button-group");
      const commonVariables$1 = {
        paddingTiny: "0 6px",
        paddingSmall: "0 10px",
        paddingMedium: "0 14px",
        paddingLarge: "0 18px",
        paddingRoundTiny: "0 10px",
        paddingRoundSmall: "0 14px",
        paddingRoundMedium: "0 18px",
        paddingRoundLarge: "0 22px",
        iconMarginTiny: "6px",
        iconMarginSmall: "6px",
        iconMarginMedium: "6px",
        iconMarginLarge: "6px",
        iconSizeTiny: "14px",
        iconSizeSmall: "18px",
        iconSizeMedium: "18px",
        iconSizeLarge: "20px",
        rippleDuration: ".6s"
      };
      const self$7 = (vars) => {
        const {
          heightTiny,
          heightSmall,
          heightMedium,
          heightLarge,
          borderRadius,
          fontSizeTiny,
          fontSizeSmall,
          fontSizeMedium,
          fontSizeLarge,
          opacityDisabled,
          textColor2,
          textColor3,
          primaryColorHover,
          primaryColorPressed,
          borderColor,
          primaryColor,
          baseColor,
          infoColor,
          infoColorHover,
          infoColorPressed,
          successColor,
          successColorHover,
          successColorPressed,
          warningColor,
          warningColorHover,
          warningColorPressed,
          errorColor,
          errorColorHover,
          errorColorPressed,
          fontWeight,
          buttonColor2,
          buttonColor2Hover,
          buttonColor2Pressed,
          fontWeightStrong
        } = vars;
        return Object.assign(Object.assign({}, commonVariables$1), {
          heightTiny,
          heightSmall,
          heightMedium,
          heightLarge,
          borderRadiusTiny: borderRadius,
          borderRadiusSmall: borderRadius,
          borderRadiusMedium: borderRadius,
          borderRadiusLarge: borderRadius,
          fontSizeTiny,
          fontSizeSmall,
          fontSizeMedium,
          fontSizeLarge,
          opacityDisabled,
          // secondary
          colorOpacitySecondary: "0.16",
          colorOpacitySecondaryHover: "0.22",
          colorOpacitySecondaryPressed: "0.28",
          colorSecondary: buttonColor2,
          colorSecondaryHover: buttonColor2Hover,
          colorSecondaryPressed: buttonColor2Pressed,
          // tertiary
          colorTertiary: buttonColor2,
          colorTertiaryHover: buttonColor2Hover,
          colorTertiaryPressed: buttonColor2Pressed,
          // quaternary
          colorQuaternary: "#0000",
          colorQuaternaryHover: buttonColor2Hover,
          colorQuaternaryPressed: buttonColor2Pressed,
          // default type
          color: "#0000",
          colorHover: "#0000",
          colorPressed: "#0000",
          colorFocus: "#0000",
          colorDisabled: "#0000",
          textColor: textColor2,
          textColorTertiary: textColor3,
          textColorHover: primaryColorHover,
          textColorPressed: primaryColorPressed,
          textColorFocus: primaryColorHover,
          textColorDisabled: textColor2,
          textColorText: textColor2,
          textColorTextHover: primaryColorHover,
          textColorTextPressed: primaryColorPressed,
          textColorTextFocus: primaryColorHover,
          textColorTextDisabled: textColor2,
          textColorGhost: textColor2,
          textColorGhostHover: primaryColorHover,
          textColorGhostPressed: primaryColorPressed,
          textColorGhostFocus: primaryColorHover,
          textColorGhostDisabled: textColor2,
          border: `1px solid ${borderColor}`,
          borderHover: `1px solid ${primaryColorHover}`,
          borderPressed: `1px solid ${primaryColorPressed}`,
          borderFocus: `1px solid ${primaryColorHover}`,
          borderDisabled: `1px solid ${borderColor}`,
          rippleColor: primaryColor,
          // primary
          colorPrimary: primaryColor,
          colorHoverPrimary: primaryColorHover,
          colorPressedPrimary: primaryColorPressed,
          colorFocusPrimary: primaryColorHover,
          colorDisabledPrimary: primaryColor,
          textColorPrimary: baseColor,
          textColorHoverPrimary: baseColor,
          textColorPressedPrimary: baseColor,
          textColorFocusPrimary: baseColor,
          textColorDisabledPrimary: baseColor,
          textColorTextPrimary: primaryColor,
          textColorTextHoverPrimary: primaryColorHover,
          textColorTextPressedPrimary: primaryColorPressed,
          textColorTextFocusPrimary: primaryColorHover,
          textColorTextDisabledPrimary: textColor2,
          textColorGhostPrimary: primaryColor,
          textColorGhostHoverPrimary: primaryColorHover,
          textColorGhostPressedPrimary: primaryColorPressed,
          textColorGhostFocusPrimary: primaryColorHover,
          textColorGhostDisabledPrimary: primaryColor,
          borderPrimary: `1px solid ${primaryColor}`,
          borderHoverPrimary: `1px solid ${primaryColorHover}`,
          borderPressedPrimary: `1px solid ${primaryColorPressed}`,
          borderFocusPrimary: `1px solid ${primaryColorHover}`,
          borderDisabledPrimary: `1px solid ${primaryColor}`,
          rippleColorPrimary: primaryColor,
          // info
          colorInfo: infoColor,
          colorHoverInfo: infoColorHover,
          colorPressedInfo: infoColorPressed,
          colorFocusInfo: infoColorHover,
          colorDisabledInfo: infoColor,
          textColorInfo: baseColor,
          textColorHoverInfo: baseColor,
          textColorPressedInfo: baseColor,
          textColorFocusInfo: baseColor,
          textColorDisabledInfo: baseColor,
          textColorTextInfo: infoColor,
          textColorTextHoverInfo: infoColorHover,
          textColorTextPressedInfo: infoColorPressed,
          textColorTextFocusInfo: infoColorHover,
          textColorTextDisabledInfo: textColor2,
          textColorGhostInfo: infoColor,
          textColorGhostHoverInfo: infoColorHover,
          textColorGhostPressedInfo: infoColorPressed,
          textColorGhostFocusInfo: infoColorHover,
          textColorGhostDisabledInfo: infoColor,
          borderInfo: `1px solid ${infoColor}`,
          borderHoverInfo: `1px solid ${infoColorHover}`,
          borderPressedInfo: `1px solid ${infoColorPressed}`,
          borderFocusInfo: `1px solid ${infoColorHover}`,
          borderDisabledInfo: `1px solid ${infoColor}`,
          rippleColorInfo: infoColor,
          // success
          colorSuccess: successColor,
          colorHoverSuccess: successColorHover,
          colorPressedSuccess: successColorPressed,
          colorFocusSuccess: successColorHover,
          colorDisabledSuccess: successColor,
          textColorSuccess: baseColor,
          textColorHoverSuccess: baseColor,
          textColorPressedSuccess: baseColor,
          textColorFocusSuccess: baseColor,
          textColorDisabledSuccess: baseColor,
          textColorTextSuccess: successColor,
          textColorTextHoverSuccess: successColorHover,
          textColorTextPressedSuccess: successColorPressed,
          textColorTextFocusSuccess: successColorHover,
          textColorTextDisabledSuccess: textColor2,
          textColorGhostSuccess: successColor,
          textColorGhostHoverSuccess: successColorHover,
          textColorGhostPressedSuccess: successColorPressed,
          textColorGhostFocusSuccess: successColorHover,
          textColorGhostDisabledSuccess: successColor,
          borderSuccess: `1px solid ${successColor}`,
          borderHoverSuccess: `1px solid ${successColorHover}`,
          borderPressedSuccess: `1px solid ${successColorPressed}`,
          borderFocusSuccess: `1px solid ${successColorHover}`,
          borderDisabledSuccess: `1px solid ${successColor}`,
          rippleColorSuccess: successColor,
          // warning
          colorWarning: warningColor,
          colorHoverWarning: warningColorHover,
          colorPressedWarning: warningColorPressed,
          colorFocusWarning: warningColorHover,
          colorDisabledWarning: warningColor,
          textColorWarning: baseColor,
          textColorHoverWarning: baseColor,
          textColorPressedWarning: baseColor,
          textColorFocusWarning: baseColor,
          textColorDisabledWarning: baseColor,
          textColorTextWarning: warningColor,
          textColorTextHoverWarning: warningColorHover,
          textColorTextPressedWarning: warningColorPressed,
          textColorTextFocusWarning: warningColorHover,
          textColorTextDisabledWarning: textColor2,
          textColorGhostWarning: warningColor,
          textColorGhostHoverWarning: warningColorHover,
          textColorGhostPressedWarning: warningColorPressed,
          textColorGhostFocusWarning: warningColorHover,
          textColorGhostDisabledWarning: warningColor,
          borderWarning: `1px solid ${warningColor}`,
          borderHoverWarning: `1px solid ${warningColorHover}`,
          borderPressedWarning: `1px solid ${warningColorPressed}`,
          borderFocusWarning: `1px solid ${warningColorHover}`,
          borderDisabledWarning: `1px solid ${warningColor}`,
          rippleColorWarning: warningColor,
          // error
          colorError: errorColor,
          colorHoverError: errorColorHover,
          colorPressedError: errorColorPressed,
          colorFocusError: errorColorHover,
          colorDisabledError: errorColor,
          textColorError: baseColor,
          textColorHoverError: baseColor,
          textColorPressedError: baseColor,
          textColorFocusError: baseColor,
          textColorDisabledError: baseColor,
          textColorTextError: errorColor,
          textColorTextHoverError: errorColorHover,
          textColorTextPressedError: errorColorPressed,
          textColorTextFocusError: errorColorHover,
          textColorTextDisabledError: textColor2,
          textColorGhostError: errorColor,
          textColorGhostHoverError: errorColorHover,
          textColorGhostPressedError: errorColorPressed,
          textColorGhostFocusError: errorColorHover,
          textColorGhostDisabledError: errorColor,
          borderError: `1px solid ${errorColor}`,
          borderHoverError: `1px solid ${errorColorHover}`,
          borderPressedError: `1px solid ${errorColorPressed}`,
          borderFocusError: `1px solid ${errorColorHover}`,
          borderDisabledError: `1px solid ${errorColor}`,
          rippleColorError: errorColor,
          waveOpacity: "0.6",
          fontWeight,
          fontWeightStrong
        });
      };
      const buttonLight = {
        name: "Button",
        common: commonLight,
        self: self$7
      };
      const buttonLight$1 = buttonLight;
      const style$6 = c([cB("button", `
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [cM("color", [cE("border", {
        borderColor: "var(--n-border-color)"
      }), cM("disabled", [cE("border", {
        borderColor: "var(--n-border-color-disabled)"
      })]), cNotM("disabled", [c("&:focus", [cE("state-border", {
        borderColor: "var(--n-border-color-focus)"
      })]), c("&:hover", [cE("state-border", {
        borderColor: "var(--n-border-color-hover)"
      })]), c("&:active", [cE("state-border", {
        borderColor: "var(--n-border-color-pressed)"
      })]), cM("pressed", [cE("state-border", {
        borderColor: "var(--n-border-color-pressed)"
      })])])]), cM("disabled", {
        backgroundColor: "var(--n-color-disabled)",
        color: "var(--n-text-color-disabled)"
      }, [cE("border", {
        border: "var(--n-border-disabled)"
      })]), cNotM("disabled", [c("&:focus", {
        backgroundColor: "var(--n-color-focus)",
        color: "var(--n-text-color-focus)"
      }, [cE("state-border", {
        border: "var(--n-border-focus)"
      })]), c("&:hover", {
        backgroundColor: "var(--n-color-hover)",
        color: "var(--n-text-color-hover)"
      }, [cE("state-border", {
        border: "var(--n-border-hover)"
      })]), c("&:active", {
        backgroundColor: "var(--n-color-pressed)",
        color: "var(--n-text-color-pressed)"
      }, [cE("state-border", {
        border: "var(--n-border-pressed)"
      })]), cM("pressed", {
        backgroundColor: "var(--n-color-pressed)",
        color: "var(--n-text-color-pressed)"
      }, [cE("state-border", {
        border: "var(--n-border-pressed)"
      })])]), cM("loading", "cursor: wait;"), cB("base-wave", `
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `, [cM("active", {
        zIndex: 1,
        animationName: "button-wave-spread, button-wave-opacity"
      })]), isBrowser$1 && "MozBoxSizing" in document.createElement("div").style ? c("&::moz-focus-inner", {
        border: 0
      }) : null, cE("border, state-border", `
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `), cE("border", {
        border: "var(--n-border)"
      }), cE("state-border", {
        border: "var(--n-border)",
        borderColor: "#0000",
        zIndex: 1
      }), cE("icon", `
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `, [cB("icon-slot", `
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `, [iconSwitchTransition({
        top: "50%",
        originalTransform: "translateY(-50%)"
      })]), fadeInWidthExpandTransition()]), cE("content", `
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `, [c("~", [cE("icon", {
        margin: "var(--n-icon-margin)",
        marginRight: 0
      })])]), cM("block", `
 display: flex;
 width: 100%;
 `), cM("dashed", [cE("border, state-border", {
        borderStyle: "dashed !important"
      })]), cM("disabled", {
        cursor: "not-allowed",
        opacity: "var(--n-opacity-disabled)"
      })]), c("@keyframes button-wave-spread", {
        from: {
          boxShadow: "0 0 0.5px 0 var(--n-ripple-color)"
        },
        to: {
          // don't use exact 5px since chrome will display the animation with glitches
          boxShadow: "0 0 0.5px 4.5px var(--n-ripple-color)"
        }
      }), c("@keyframes button-wave-opacity", {
        from: {
          opacity: "var(--n-wave-opacity)"
        },
        to: {
          opacity: 0
        }
      })]);
      const buttonProps = Object.assign(Object.assign({}, useTheme.props), {
        color: String,
        textColor: String,
        text: Boolean,
        block: Boolean,
        loading: Boolean,
        disabled: Boolean,
        circle: Boolean,
        size: String,
        ghost: Boolean,
        round: Boolean,
        secondary: Boolean,
        tertiary: Boolean,
        quaternary: Boolean,
        strong: Boolean,
        focusable: {
          type: Boolean,
          default: true
        },
        keyboard: {
          type: Boolean,
          default: true
        },
        tag: {
          type: String,
          default: "button"
        },
        type: {
          type: String,
          default: "default"
        },
        dashed: Boolean,
        renderIcon: Function,
        iconPlacement: {
          type: String,
          default: "left"
        },
        attrType: {
          type: String,
          default: "button"
        },
        bordered: {
          type: Boolean,
          default: true
        },
        onClick: [Function, Array],
        nativeFocusBehavior: {
          type: Boolean,
          default: !isSafari
        }
      });
      const Button = /* @__PURE__ */ defineComponent({
        name: "Button",
        props: buttonProps,
        setup(props) {
          const selfElRef = ref(null);
          const waveElRef = ref(null);
          const enterPressedRef = ref(false);
          const showBorderRef = useMemo(() => {
            return !props.quaternary && !props.tertiary && !props.secondary && !props.text && (!props.color || props.ghost || props.dashed) && props.bordered;
          });
          const NButtonGroup = inject(buttonGroupInjectionKey, {});
          const {
            mergedSizeRef
          } = useFormItem({}, {
            defaultSize: "medium",
            mergedSize: (NFormItem) => {
              const {
                size: size2
              } = props;
              if (size2)
                return size2;
              const {
                size: buttonGroupSize
              } = NButtonGroup;
              if (buttonGroupSize)
                return buttonGroupSize;
              const {
                mergedSize: formItemSize2
              } = NFormItem || {};
              if (formItemSize2) {
                return formItemSize2.value;
              }
              return "medium";
            }
          });
          const mergedFocusableRef = computed(() => {
            return props.focusable && !props.disabled;
          });
          const handleMousedown = (e) => {
            var _a;
            if (!mergedFocusableRef.value) {
              e.preventDefault();
            }
            if (props.nativeFocusBehavior) {
              return;
            }
            e.preventDefault();
            if (props.disabled) {
              return;
            }
            if (mergedFocusableRef.value) {
              (_a = selfElRef.value) === null || _a === void 0 ? void 0 : _a.focus({
                preventScroll: true
              });
            }
          };
          const handleClick = (e) => {
            var _a;
            if (!props.disabled && !props.loading) {
              const {
                onClick
              } = props;
              if (onClick)
                call(onClick, e);
              if (!props.text) {
                (_a = waveElRef.value) === null || _a === void 0 ? void 0 : _a.play();
              }
            }
          };
          const handleKeyup = (e) => {
            switch (e.key) {
              case "Enter":
                if (!props.keyboard) {
                  return;
                }
                enterPressedRef.value = false;
            }
          };
          const handleKeydown = (e) => {
            switch (e.key) {
              case "Enter":
                if (!props.keyboard || props.loading) {
                  e.preventDefault();
                  return;
                }
                enterPressedRef.value = true;
            }
          };
          const handleBlur = () => {
            enterPressedRef.value = false;
          };
          const {
            inlineThemeDisabled,
            mergedClsPrefixRef,
            mergedRtlRef
          } = useConfig(props);
          const themeRef = useTheme("Button", "-button", style$6, buttonLight$1, props, mergedClsPrefixRef);
          const rtlEnabledRef = useRtl("Button", mergedRtlRef, mergedClsPrefixRef);
          const cssVarsRef = computed(() => {
            const theme = themeRef.value;
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2,
                cubicBezierEaseOut: cubicBezierEaseOut2
              },
              self: self2
            } = theme;
            const {
              rippleDuration,
              opacityDisabled,
              fontWeight,
              fontWeightStrong
            } = self2;
            const size2 = mergedSizeRef.value;
            const {
              dashed,
              type,
              ghost,
              text,
              color,
              round,
              circle,
              textColor,
              secondary,
              tertiary,
              quaternary,
              strong
            } = props;
            const fontProps = {
              "font-weight": strong ? fontWeightStrong : fontWeight
            };
            let colorProps = {
              "--n-color": "initial",
              "--n-color-hover": "initial",
              "--n-color-pressed": "initial",
              "--n-color-focus": "initial",
              "--n-color-disabled": "initial",
              "--n-ripple-color": "initial",
              "--n-text-color": "initial",
              "--n-text-color-hover": "initial",
              "--n-text-color-pressed": "initial",
              "--n-text-color-focus": "initial",
              "--n-text-color-disabled": "initial"
            };
            const typeIsTertiary = type === "tertiary";
            const typeIsDefault = type === "default";
            const mergedType = typeIsTertiary ? "default" : type;
            if (text) {
              const propTextColor = textColor || color;
              const mergedTextColor = propTextColor || self2[createKey("textColorText", mergedType)];
              colorProps = {
                "--n-color": "#0000",
                "--n-color-hover": "#0000",
                "--n-color-pressed": "#0000",
                "--n-color-focus": "#0000",
                "--n-color-disabled": "#0000",
                "--n-ripple-color": "#0000",
                "--n-text-color": mergedTextColor,
                "--n-text-color-hover": propTextColor ? createHoverColor(propTextColor) : self2[createKey("textColorTextHover", mergedType)],
                "--n-text-color-pressed": propTextColor ? createPressedColor(propTextColor) : self2[createKey("textColorTextPressed", mergedType)],
                "--n-text-color-focus": propTextColor ? createHoverColor(propTextColor) : self2[createKey("textColorTextHover", mergedType)],
                "--n-text-color-disabled": propTextColor || self2[createKey("textColorTextDisabled", mergedType)]
              };
            } else if (ghost || dashed) {
              const mergedTextColor = textColor || color;
              colorProps = {
                "--n-color": "#0000",
                "--n-color-hover": "#0000",
                "--n-color-pressed": "#0000",
                "--n-color-focus": "#0000",
                "--n-color-disabled": "#0000",
                "--n-ripple-color": color || self2[createKey("rippleColor", mergedType)],
                "--n-text-color": mergedTextColor || self2[createKey("textColorGhost", mergedType)],
                "--n-text-color-hover": mergedTextColor ? createHoverColor(mergedTextColor) : self2[createKey("textColorGhostHover", mergedType)],
                "--n-text-color-pressed": mergedTextColor ? createPressedColor(mergedTextColor) : self2[createKey("textColorGhostPressed", mergedType)],
                "--n-text-color-focus": mergedTextColor ? createHoverColor(mergedTextColor) : self2[createKey("textColorGhostHover", mergedType)],
                "--n-text-color-disabled": mergedTextColor || self2[createKey("textColorGhostDisabled", mergedType)]
              };
            } else if (secondary) {
              const typeTextColor = typeIsDefault ? self2.textColor : typeIsTertiary ? self2.textColorTertiary : self2[createKey("color", mergedType)];
              const mergedTextColor = color || typeTextColor;
              const isColoredType = type !== "default" && type !== "tertiary";
              colorProps = {
                "--n-color": isColoredType ? changeColor(mergedTextColor, {
                  alpha: Number(self2.colorOpacitySecondary)
                }) : self2.colorSecondary,
                "--n-color-hover": isColoredType ? changeColor(mergedTextColor, {
                  alpha: Number(self2.colorOpacitySecondaryHover)
                }) : self2.colorSecondaryHover,
                "--n-color-pressed": isColoredType ? changeColor(mergedTextColor, {
                  alpha: Number(self2.colorOpacitySecondaryPressed)
                }) : self2.colorSecondaryPressed,
                "--n-color-focus": isColoredType ? changeColor(mergedTextColor, {
                  alpha: Number(self2.colorOpacitySecondaryHover)
                }) : self2.colorSecondaryHover,
                "--n-color-disabled": self2.colorSecondary,
                "--n-ripple-color": "#0000",
                "--n-text-color": mergedTextColor,
                "--n-text-color-hover": mergedTextColor,
                "--n-text-color-pressed": mergedTextColor,
                "--n-text-color-focus": mergedTextColor,
                "--n-text-color-disabled": mergedTextColor
              };
            } else if (tertiary || quaternary) {
              const typeColor = typeIsDefault ? self2.textColor : typeIsTertiary ? self2.textColorTertiary : self2[createKey("color", mergedType)];
              const mergedColor = color || typeColor;
              if (tertiary) {
                colorProps["--n-color"] = self2.colorTertiary;
                colorProps["--n-color-hover"] = self2.colorTertiaryHover;
                colorProps["--n-color-pressed"] = self2.colorTertiaryPressed;
                colorProps["--n-color-focus"] = self2.colorSecondaryHover;
                colorProps["--n-color-disabled"] = self2.colorTertiary;
              } else {
                colorProps["--n-color"] = self2.colorQuaternary;
                colorProps["--n-color-hover"] = self2.colorQuaternaryHover;
                colorProps["--n-color-pressed"] = self2.colorQuaternaryPressed;
                colorProps["--n-color-focus"] = self2.colorQuaternaryHover;
                colorProps["--n-color-disabled"] = self2.colorQuaternary;
              }
              colorProps["--n-ripple-color"] = "#0000";
              colorProps["--n-text-color"] = mergedColor;
              colorProps["--n-text-color-hover"] = mergedColor;
              colorProps["--n-text-color-pressed"] = mergedColor;
              colorProps["--n-text-color-focus"] = mergedColor;
              colorProps["--n-text-color-disabled"] = mergedColor;
            } else {
              colorProps = {
                "--n-color": color || self2[createKey("color", mergedType)],
                "--n-color-hover": color ? createHoverColor(color) : self2[createKey("colorHover", mergedType)],
                "--n-color-pressed": color ? createPressedColor(color) : self2[createKey("colorPressed", mergedType)],
                "--n-color-focus": color ? createHoverColor(color) : self2[createKey("colorFocus", mergedType)],
                "--n-color-disabled": color || self2[createKey("colorDisabled", mergedType)],
                "--n-ripple-color": color || self2[createKey("rippleColor", mergedType)],
                "--n-text-color": textColor || (color ? self2.textColorPrimary : typeIsTertiary ? self2.textColorTertiary : self2[createKey("textColor", mergedType)]),
                "--n-text-color-hover": textColor || (color ? self2.textColorHoverPrimary : self2[createKey("textColorHover", mergedType)]),
                "--n-text-color-pressed": textColor || (color ? self2.textColorPressedPrimary : self2[createKey("textColorPressed", mergedType)]),
                "--n-text-color-focus": textColor || (color ? self2.textColorFocusPrimary : self2[createKey("textColorFocus", mergedType)]),
                "--n-text-color-disabled": textColor || (color ? self2.textColorDisabledPrimary : self2[createKey("textColorDisabled", mergedType)])
              };
            }
            let borderProps = {
              "--n-border": "initial",
              "--n-border-hover": "initial",
              "--n-border-pressed": "initial",
              "--n-border-focus": "initial",
              "--n-border-disabled": "initial"
            };
            if (text) {
              borderProps = {
                "--n-border": "none",
                "--n-border-hover": "none",
                "--n-border-pressed": "none",
                "--n-border-focus": "none",
                "--n-border-disabled": "none"
              };
            } else {
              borderProps = {
                "--n-border": self2[createKey("border", mergedType)],
                "--n-border-hover": self2[createKey("borderHover", mergedType)],
                "--n-border-pressed": self2[createKey("borderPressed", mergedType)],
                "--n-border-focus": self2[createKey("borderFocus", mergedType)],
                "--n-border-disabled": self2[createKey("borderDisabled", mergedType)]
              };
            }
            const {
              [createKey("height", size2)]: height,
              [createKey("fontSize", size2)]: fontSize2,
              [createKey("padding", size2)]: padding,
              [createKey("paddingRound", size2)]: paddingRound,
              [createKey("iconSize", size2)]: iconSize,
              [createKey("borderRadius", size2)]: borderRadius,
              [createKey("iconMargin", size2)]: iconMargin,
              waveOpacity
            } = self2;
            const sizeProps = {
              "--n-width": circle && !text ? height : "initial",
              "--n-height": text ? "initial" : height,
              "--n-font-size": fontSize2,
              "--n-padding": circle ? "initial" : text ? "initial" : round ? paddingRound : padding,
              "--n-icon-size": iconSize,
              "--n-icon-margin": iconMargin,
              "--n-border-radius": text ? "initial" : circle || round ? height : borderRadius
            };
            return Object.assign(Object.assign(Object.assign(Object.assign({
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-bezier-ease-out": cubicBezierEaseOut2,
              "--n-ripple-duration": rippleDuration,
              "--n-opacity-disabled": opacityDisabled,
              "--n-wave-opacity": waveOpacity
            }, fontProps), colorProps), borderProps), sizeProps);
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("button", computed(() => {
            let hash = "";
            const {
              dashed,
              type,
              ghost,
              text,
              color,
              round,
              circle,
              textColor,
              secondary,
              tertiary,
              quaternary,
              strong
            } = props;
            if (dashed)
              hash += "a";
            if (ghost)
              hash += "b";
            if (text)
              hash += "c";
            if (round)
              hash += "d";
            if (circle)
              hash += "e";
            if (secondary)
              hash += "f";
            if (tertiary)
              hash += "g";
            if (quaternary)
              hash += "h";
            if (strong)
              hash += "i";
            if (color)
              hash += "j" + color2Class(color);
            if (textColor)
              hash += "k" + color2Class(textColor);
            const {
              value: size2
            } = mergedSizeRef;
            hash += "l" + size2[0];
            hash += "m" + type[0];
            return hash;
          }), cssVarsRef, props) : void 0;
          return {
            selfElRef,
            waveElRef,
            mergedClsPrefix: mergedClsPrefixRef,
            mergedFocusable: mergedFocusableRef,
            mergedSize: mergedSizeRef,
            showBorder: showBorderRef,
            enterPressed: enterPressedRef,
            rtlEnabled: rtlEnabledRef,
            handleMousedown,
            handleKeydown,
            handleBlur,
            handleKeyup,
            handleClick,
            customColorCssVars: computed(() => {
              const {
                color
              } = props;
              if (!color)
                return null;
              const hoverColor = createHoverColor(color);
              return {
                "--n-border-color": color,
                "--n-border-color-hover": hoverColor,
                "--n-border-color-pressed": createPressedColor(color),
                "--n-border-color-focus": hoverColor,
                "--n-border-color-disabled": color
              };
            }),
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          };
        },
        render() {
          const {
            mergedClsPrefix,
            tag: Component,
            onRender
          } = this;
          onRender === null || onRender === void 0 ? void 0 : onRender();
          const children = resolveWrappedSlot(this.$slots.default, (children2) => children2 && h("span", {
            class: `${mergedClsPrefix}-button__content`
          }, children2));
          return h(Component, {
            ref: "selfElRef",
            class: [
              this.themeClass,
              `${mergedClsPrefix}-button`,
              `${mergedClsPrefix}-button--${this.type}-type`,
              `${mergedClsPrefix}-button--${this.mergedSize}-type`,
              this.rtlEnabled && `${mergedClsPrefix}-button--rtl`,
              this.disabled && `${mergedClsPrefix}-button--disabled`,
              this.block && `${mergedClsPrefix}-button--block`,
              this.enterPressed && `${mergedClsPrefix}-button--pressed`,
              !this.text && this.dashed && `${mergedClsPrefix}-button--dashed`,
              this.color && `${mergedClsPrefix}-button--color`,
              this.secondary && `${mergedClsPrefix}-button--secondary`,
              this.loading && `${mergedClsPrefix}-button--loading`,
              this.ghost && `${mergedClsPrefix}-button--ghost`
              // required for button group border collapse
            ],
            tabindex: this.mergedFocusable ? 0 : -1,
            type: this.attrType,
            style: this.cssVars,
            disabled: this.disabled,
            onClick: this.handleClick,
            onBlur: this.handleBlur,
            onMousedown: this.handleMousedown,
            onKeyup: this.handleKeyup,
            onKeydown: this.handleKeydown
          }, this.iconPlacement === "right" && children, h(NFadeInExpandTransition, {
            width: true
          }, {
            default: () => resolveWrappedSlot(this.$slots.icon, (children2) => (this.loading || this.renderIcon || children2) && h("span", {
              class: `${mergedClsPrefix}-button__icon`,
              style: {
                margin: isSlotEmpty(this.$slots.default) ? "0" : ""
              }
            }, h(NIconSwitchTransition, null, {
              default: () => this.loading ? h(NBaseLoading, {
                clsPrefix: mergedClsPrefix,
                key: "loading",
                class: `${mergedClsPrefix}-icon-slot`,
                strokeWidth: 20
              }) : h("div", {
                key: "icon",
                class: `${mergedClsPrefix}-icon-slot`,
                role: "none"
              }, this.renderIcon ? this.renderIcon() : children2)
            })))
          }), this.iconPlacement === "left" && children, !this.text ? h(NBaseWave, {
            ref: "waveElRef",
            clsPrefix: mergedClsPrefix
          }) : null, this.showBorder ? h("div", {
            "aria-hidden": true,
            class: `${mergedClsPrefix}-button__border`,
            style: this.customColorCssVars
          }) : null, this.showBorder ? h("div", {
            "aria-hidden": true,
            class: `${mergedClsPrefix}-button__state-border`,
            style: this.customColorCssVars
          }) : null);
        }
      });
      const __unplugin_components_5 = Button;
      const self$6 = (vars) => {
        const {
          textColorBase,
          opacity1,
          opacity2,
          opacity3,
          opacity4,
          opacity5
        } = vars;
        return {
          color: textColorBase,
          opacity1Depth: opacity1,
          opacity2Depth: opacity2,
          opacity3Depth: opacity3,
          opacity4Depth: opacity4,
          opacity5Depth: opacity5
        };
      };
      const iconLight = {
        name: "Icon",
        common: commonLight,
        self: self$6
      };
      const iconLight$1 = iconLight;
      const style$5 = cB("icon", `
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
 transform: translateZ(0);
`, [cM("color-transition", {
        transition: "color .3s var(--n-bezier)"
      }), cM("depth", {
        color: "var(--n-color)"
      }, [c("svg", {
        opacity: "var(--n-opacity)",
        transition: "opacity .3s var(--n-bezier)"
      })]), c("svg", {
        height: "1em",
        width: "1em"
      })]);
      const iconProps = Object.assign(Object.assign({}, useTheme.props), {
        depth: [String, Number],
        size: [Number, String],
        color: String,
        component: Object
      });
      const NIcon = /* @__PURE__ */ defineComponent({
        _n_icon__: true,
        name: "Icon",
        inheritAttrs: false,
        props: iconProps,
        setup(props) {
          const {
            mergedClsPrefixRef,
            inlineThemeDisabled
          } = useConfig(props);
          const themeRef = useTheme("Icon", "-icon", style$5, iconLight$1, props, mergedClsPrefixRef);
          const cssVarsRef = computed(() => {
            const {
              depth
            } = props;
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2
              },
              self: self2
            } = themeRef.value;
            if (depth !== void 0) {
              const {
                color,
                [`opacity${depth}Depth`]: opacity
              } = self2;
              return {
                "--n-bezier": cubicBezierEaseInOut2,
                "--n-color": color,
                "--n-opacity": opacity
              };
            }
            return {
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-color": "",
              "--n-opacity": ""
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("icon", computed(() => `${props.depth || "d"}`), cssVarsRef, props) : void 0;
          return {
            mergedClsPrefix: mergedClsPrefixRef,
            mergedStyle: computed(() => {
              const {
                size: size2,
                color
              } = props;
              return {
                fontSize: formatLength(size2),
                color
              };
            }),
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          };
        },
        render() {
          var _a;
          const {
            $parent,
            depth,
            mergedClsPrefix,
            component,
            onRender,
            themeClass
          } = this;
          if ((_a = $parent === null || $parent === void 0 ? void 0 : $parent.$options) === null || _a === void 0 ? void 0 : _a._n_icon__) {
            warn$2("icon", "don't wrap `n-icon` inside `n-icon`");
          }
          onRender === null || onRender === void 0 ? void 0 : onRender();
          return h("i", mergeProps(this.$attrs, {
            role: "img",
            class: [`${mergedClsPrefix}-icon`, themeClass, {
              [`${mergedClsPrefix}-icon--depth`]: depth,
              [`${mergedClsPrefix}-icon--color-transition`]: depth !== void 0
            }],
            style: [this.cssVars, this.mergedStyle]
          }), component ? h(component) : this.$slots);
        }
      });
      const self$5 = (vars) => {
        const {
          textColor1,
          dividerColor,
          fontWeightStrong
        } = vars;
        return {
          textColor: textColor1,
          color: dividerColor,
          fontWeight: fontWeightStrong
        };
      };
      const dividerLight = {
        name: "Divider",
        common: commonLight,
        self: self$5
      };
      const dividerLight$1 = dividerLight;
      const style$4 = cB("divider", `
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`, [cNotM("vertical", `
 margin-top: 24px;
 margin-bottom: 24px;
 `, [cNotM("no-title", `
 display: flex;
 align-items: center;
 `)]), cE("title", `
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `), cM("title-position-left", [cE("line", [cM("left", {
        width: "28px"
      })])]), cM("title-position-right", [cE("line", [cM("right", {
        width: "28px"
      })])]), cM("dashed", [cE("line", `
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]), cM("vertical", `
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `), cE("line", `
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `), cNotM("dashed", [cE("line", {
        backgroundColor: "var(--n-color)"
      })]), cM("dashed", [cE("line", {
        borderColor: "var(--n-color)"
      })]), cM("vertical", {
        backgroundColor: "var(--n-color)"
      })]);
      const dividerProps = Object.assign(Object.assign({}, useTheme.props), {
        titlePlacement: {
          type: String,
          default: "center"
        },
        dashed: Boolean,
        vertical: Boolean
      });
      const __unplugin_components_6 = /* @__PURE__ */ defineComponent({
        name: "Divider",
        props: dividerProps,
        setup(props) {
          const {
            mergedClsPrefixRef,
            inlineThemeDisabled
          } = useConfig(props);
          const themeRef = useTheme("Divider", "-divider", style$4, dividerLight$1, props, mergedClsPrefixRef);
          const cssVarsRef = computed(() => {
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2
              },
              self: {
                color,
                textColor,
                fontWeight
              }
            } = themeRef.value;
            return {
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-color": color,
              "--n-text-color": textColor,
              "--n-font-weight": fontWeight
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("divider", void 0, cssVarsRef, props) : void 0;
          return {
            mergedClsPrefix: mergedClsPrefixRef,
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          };
        },
        render() {
          var _a;
          const {
            $slots,
            titlePlacement,
            vertical,
            dashed,
            cssVars,
            mergedClsPrefix
          } = this;
          (_a = this.onRender) === null || _a === void 0 ? void 0 : _a.call(this);
          return h("div", {
            role: "separator",
            class: [`${mergedClsPrefix}-divider`, this.themeClass, {
              [`${mergedClsPrefix}-divider--vertical`]: vertical,
              [`${mergedClsPrefix}-divider--no-title`]: !$slots.default,
              [`${mergedClsPrefix}-divider--dashed`]: dashed,
              [`${mergedClsPrefix}-divider--title-position-${titlePlacement}`]: $slots.default && titlePlacement
            }],
            style: cssVars
          }, !vertical ? h("div", {
            class: `${mergedClsPrefix}-divider__line ${mergedClsPrefix}-divider__line--left`
          }) : null, !vertical && $slots.default ? h(Fragment, null, h("div", {
            class: `${mergedClsPrefix}-divider__title`
          }, this.$slots), h("div", {
            class: `${mergedClsPrefix}-divider__line ${mergedClsPrefix}-divider__line--right`
          })) : null);
        }
      });
      const self$4 = (vars) => {
        const {
          modalColor,
          textColor1,
          textColor2,
          boxShadow3,
          lineHeight: lineHeight2,
          fontWeightStrong,
          dividerColor,
          closeColorHover,
          closeColorPressed,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          borderRadius,
          primaryColorHover
        } = vars;
        return {
          bodyPadding: "16px 24px",
          borderRadius,
          headerPadding: "16px 24px",
          footerPadding: "16px 24px",
          color: modalColor,
          textColor: textColor2,
          titleTextColor: textColor1,
          titleFontSize: "18px",
          titleFontWeight: fontWeightStrong,
          boxShadow: boxShadow3,
          lineHeight: lineHeight2,
          headerBorderBottom: `1px solid ${dividerColor}`,
          footerBorderTop: `1px solid ${dividerColor}`,
          closeIconColor,
          closeIconColorHover,
          closeIconColorPressed,
          closeSize: "22px",
          closeIconSize: "18px",
          closeColorHover,
          closeColorPressed,
          closeBorderRadius: borderRadius,
          resizableTriggerColorHover: primaryColorHover
        };
      };
      const drawerLight = createTheme({
        name: "Drawer",
        common: commonLight,
        peers: {
          Scrollbar: scrollbarLight$1
        },
        self: self$4
      });
      const drawerLight$1 = drawerLight;
      const NDrawerBodyWrapper = /* @__PURE__ */ defineComponent({
        name: "NDrawerContent",
        inheritAttrs: false,
        props: {
          blockScroll: Boolean,
          show: {
            type: Boolean,
            default: void 0
          },
          displayDirective: {
            type: String,
            required: true
          },
          placement: {
            type: String,
            required: true
          },
          contentClass: String,
          contentStyle: [Object, String],
          nativeScrollbar: {
            type: Boolean,
            required: true
          },
          scrollbarProps: Object,
          trapFocus: {
            type: Boolean,
            default: true
          },
          autoFocus: {
            type: Boolean,
            default: true
          },
          showMask: {
            type: [Boolean, String],
            required: true
          },
          maxWidth: Number,
          maxHeight: Number,
          minWidth: Number,
          minHeight: Number,
          resizable: Boolean,
          onClickoutside: Function,
          onAfterLeave: Function,
          onAfterEnter: Function,
          onEsc: Function
        },
        setup(props) {
          const displayedRef = ref(!!props.show);
          const bodyRef = ref(null);
          const NDrawer = inject(drawerInjectionKey);
          let startPosition = 0;
          let memoizedBodyStyleCursor = "";
          let hoverTimerId = null;
          const isHoverOnResizeTriggerRef = ref(false);
          const isDraggingRef = ref(false);
          const isVertical = computed(() => {
            return props.placement === "top" || props.placement === "bottom";
          });
          const {
            mergedClsPrefixRef,
            mergedRtlRef
          } = useConfig(props);
          const rtlEnabledRef = useRtl("Drawer", mergedRtlRef, mergedClsPrefixRef);
          const handleMousedownResizeTrigger = (e) => {
            isDraggingRef.value = true;
            startPosition = isVertical.value ? e.clientY : e.clientX;
            memoizedBodyStyleCursor = document.body.style.cursor;
            document.body.style.cursor = isVertical.value ? "ns-resize" : "ew-resize";
            document.body.addEventListener("mousemove", handleBodyMousemove);
            document.body.addEventListener("mouseleave", handleBodyMouseleave);
            document.body.addEventListener("mouseup", handleBodyMouseup);
          };
          const handleMouseenterResizeTrigger = () => {
            if (hoverTimerId !== null) {
              window.clearTimeout(hoverTimerId);
              hoverTimerId = null;
            }
            if (isDraggingRef.value) {
              isHoverOnResizeTriggerRef.value = true;
            } else {
              hoverTimerId = window.setTimeout(() => {
                isHoverOnResizeTriggerRef.value = true;
              }, 300);
            }
          };
          const handleMouseleaveResizeTrigger = () => {
            if (hoverTimerId !== null) {
              window.clearTimeout(hoverTimerId);
              hoverTimerId = null;
            }
            isHoverOnResizeTriggerRef.value = false;
          };
          const {
            doUpdateHeight,
            doUpdateWidth
          } = NDrawer;
          const regulateWidth = (size2) => {
            const {
              maxWidth
            } = props;
            if (maxWidth && size2 > maxWidth)
              return maxWidth;
            const {
              minWidth
            } = props;
            if (minWidth && size2 < minWidth)
              return minWidth;
            return size2;
          };
          const regulateHeight = (size2) => {
            const {
              maxHeight
            } = props;
            if (maxHeight && size2 > maxHeight)
              return maxHeight;
            const {
              minHeight
            } = props;
            if (minHeight && size2 < minHeight)
              return minHeight;
            return size2;
          };
          const handleBodyMousemove = (e) => {
            var _a, _b;
            if (isDraggingRef.value) {
              if (isVertical.value) {
                let height = ((_a = bodyRef.value) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
                const increment = startPosition - e.clientY;
                height += props.placement === "bottom" ? increment : -increment;
                height = regulateHeight(height);
                doUpdateHeight(height);
                startPosition = e.clientY;
              } else {
                let width = ((_b = bodyRef.value) === null || _b === void 0 ? void 0 : _b.offsetWidth) || 0;
                const increment = startPosition - e.clientX;
                width += props.placement === "right" ? increment : -increment;
                width = regulateWidth(width);
                doUpdateWidth(width);
                startPosition = e.clientX;
              }
            }
          };
          const handleBodyMouseup = () => {
            if (isDraggingRef.value) {
              startPosition = 0;
              isDraggingRef.value = false;
              document.body.style.cursor = memoizedBodyStyleCursor;
              document.body.removeEventListener("mousemove", handleBodyMousemove);
              document.body.removeEventListener("mouseup", handleBodyMouseup);
              document.body.removeEventListener("mouseleave", handleBodyMouseleave);
            }
          };
          const handleBodyMouseleave = handleBodyMouseup;
          watchEffect(() => {
            if (props.show)
              displayedRef.value = true;
          });
          watch(() => props.show, (value) => {
            if (!value) {
              handleBodyMouseup();
            }
          });
          onBeforeUnmount(() => {
            handleBodyMouseup();
          });
          const bodyDirectivesRef = computed(() => {
            const {
              show
            } = props;
            const directives = [[vShow, show]];
            if (!props.showMask) {
              directives.push([clickoutside$1, props.onClickoutside, void 0, {
                capture: true
              }]);
            }
            return directives;
          });
          function handleAfterLeave() {
            var _a;
            displayedRef.value = false;
            (_a = props.onAfterLeave) === null || _a === void 0 ? void 0 : _a.call(props);
          }
          useLockHtmlScroll(computed(() => props.blockScroll && displayedRef.value));
          provide(drawerBodyInjectionKey, bodyRef);
          provide(popoverBodyInjectionKey, null);
          provide(modalBodyInjectionKey, null);
          return {
            bodyRef,
            rtlEnabled: rtlEnabledRef,
            mergedClsPrefix: NDrawer.mergedClsPrefixRef,
            isMounted: NDrawer.isMountedRef,
            mergedTheme: NDrawer.mergedThemeRef,
            displayed: displayedRef,
            transitionName: computed(() => {
              return {
                right: "slide-in-from-right-transition",
                left: "slide-in-from-left-transition",
                top: "slide-in-from-top-transition",
                bottom: "slide-in-from-bottom-transition"
              }[props.placement];
            }),
            handleAfterLeave,
            bodyDirectives: bodyDirectivesRef,
            handleMousedownResizeTrigger,
            handleMouseenterResizeTrigger,
            handleMouseleaveResizeTrigger,
            isDragging: isDraggingRef,
            isHoverOnResizeTrigger: isHoverOnResizeTriggerRef
          };
        },
        render() {
          const {
            $slots,
            mergedClsPrefix
          } = this;
          return this.displayDirective === "show" || this.displayed || this.show ? withDirectives(
            /* Keep the wrapper dom. Make sure the drawer has a host.
            Nor the detached content will disappear without transition */
            h("div", {
              role: "none"
            }, h(FocusTrap, {
              disabled: !this.showMask || !this.trapFocus,
              active: this.show,
              autoFocus: this.autoFocus,
              onEsc: this.onEsc
            }, {
              default: () => h(Transition, {
                name: this.transitionName,
                appear: this.isMounted,
                onAfterEnter: this.onAfterEnter,
                onAfterLeave: this.handleAfterLeave
              }, {
                default: () => withDirectives(h("div", mergeProps(this.$attrs, {
                  role: "dialog",
                  ref: "bodyRef",
                  "aria-modal": "true",
                  class: [
                    `${mergedClsPrefix}-drawer`,
                    this.rtlEnabled && `${mergedClsPrefix}-drawer--rtl`,
                    `${mergedClsPrefix}-drawer--${this.placement}-placement`,
                    /**
                     * When the mouse is pressed to resize the drawer,
                     * disable text selection
                     */
                    this.isDragging && `${mergedClsPrefix}-drawer--unselectable`,
                    this.nativeScrollbar && `${mergedClsPrefix}-drawer--native-scrollbar`
                  ]
                }), [this.resizable ? h("div", {
                  class: [`${mergedClsPrefix}-drawer__resize-trigger`, (this.isDragging || this.isHoverOnResizeTrigger) && `${mergedClsPrefix}-drawer__resize-trigger--hover`],
                  onMouseenter: this.handleMouseenterResizeTrigger,
                  onMouseleave: this.handleMouseleaveResizeTrigger,
                  onMousedown: this.handleMousedownResizeTrigger
                }) : null, this.nativeScrollbar ? h("div", {
                  class: [`${mergedClsPrefix}-drawer-content-wrapper`, this.contentClass],
                  style: this.contentStyle,
                  role: "none"
                }, $slots) : h(NScrollbar, Object.assign({}, this.scrollbarProps, {
                  contentStyle: this.contentStyle,
                  contentClass: [`${mergedClsPrefix}-drawer-content-wrapper`, this.contentClass],
                  theme: this.mergedTheme.peers.Scrollbar,
                  themeOverrides: this.mergedTheme.peerOverrides.Scrollbar
                }), $slots)]), this.bodyDirectives)
              })
            })),
            [[vShow, this.displayDirective === "if" || this.displayed || this.show]]
          ) : null;
        }
      });
      const {
        cubicBezierEaseIn: cubicBezierEaseIn$3,
        cubicBezierEaseOut: cubicBezierEaseOut$3
      } = commonVariables$3;
      function slideInFromRightTransition({
        duration: duration2 = "0.3s",
        leaveDuration = "0.2s",
        name = "slide-in-from-right"
      } = {}) {
        return [c(`&.${name}-transition-leave-active`, {
          transition: `transform ${leaveDuration} ${cubicBezierEaseIn$3}`
        }), c(`&.${name}-transition-enter-active`, {
          transition: `transform ${duration2} ${cubicBezierEaseOut$3}`
        }), c(`&.${name}-transition-enter-to`, {
          transform: "translateX(0)"
        }), c(`&.${name}-transition-enter-from`, {
          transform: "translateX(100%)"
        }), c(`&.${name}-transition-leave-from`, {
          transform: "translateX(0)"
        }), c(`&.${name}-transition-leave-to`, {
          transform: "translateX(100%)"
        })];
      }
      const {
        cubicBezierEaseIn: cubicBezierEaseIn$2,
        cubicBezierEaseOut: cubicBezierEaseOut$2
      } = commonVariables$3;
      function slideInFromLeftTransition({
        duration: duration2 = "0.3s",
        leaveDuration = "0.2s",
        name = "slide-in-from-left"
      } = {}) {
        return [c(`&.${name}-transition-leave-active`, {
          transition: `transform ${leaveDuration} ${cubicBezierEaseIn$2}`
        }), c(`&.${name}-transition-enter-active`, {
          transition: `transform ${duration2} ${cubicBezierEaseOut$2}`
        }), c(`&.${name}-transition-enter-to`, {
          transform: "translateX(0)"
        }), c(`&.${name}-transition-enter-from`, {
          transform: "translateX(-100%)"
        }), c(`&.${name}-transition-leave-from`, {
          transform: "translateX(0)"
        }), c(`&.${name}-transition-leave-to`, {
          transform: "translateX(-100%)"
        })];
      }
      const {
        cubicBezierEaseIn: cubicBezierEaseIn$1,
        cubicBezierEaseOut: cubicBezierEaseOut$1
      } = commonVariables$3;
      function slideInFromTopTransition({
        duration: duration2 = "0.3s",
        leaveDuration = "0.2s",
        name = "slide-in-from-top"
      } = {}) {
        return [c(`&.${name}-transition-leave-active`, {
          transition: `transform ${leaveDuration} ${cubicBezierEaseIn$1}`
        }), c(`&.${name}-transition-enter-active`, {
          transition: `transform ${duration2} ${cubicBezierEaseOut$1}`
        }), c(`&.${name}-transition-enter-to`, {
          transform: "translateY(0)"
        }), c(`&.${name}-transition-enter-from`, {
          transform: "translateY(-100%)"
        }), c(`&.${name}-transition-leave-from`, {
          transform: "translateY(0)"
        }), c(`&.${name}-transition-leave-to`, {
          transform: "translateY(-100%)"
        })];
      }
      const {
        cubicBezierEaseIn,
        cubicBezierEaseOut
      } = commonVariables$3;
      function slideInFromBottomTransition({
        duration: duration2 = "0.3s",
        leaveDuration = "0.2s",
        name = "slide-in-from-bottom"
      } = {}) {
        return [c(`&.${name}-transition-leave-active`, {
          transition: `transform ${leaveDuration} ${cubicBezierEaseIn}`
        }), c(`&.${name}-transition-enter-active`, {
          transition: `transform ${duration2} ${cubicBezierEaseOut}`
        }), c(`&.${name}-transition-enter-to`, {
          transform: "translateY(0)"
        }), c(`&.${name}-transition-enter-from`, {
          transform: "translateY(100%)"
        }), c(`&.${name}-transition-leave-from`, {
          transform: "translateY(0)"
        }), c(`&.${name}-transition-leave-to`, {
          transform: "translateY(100%)"
        })];
      }
      const style$3 = c([cB("drawer", `
 word-break: break-word;
 line-height: var(--n-line-height);
 position: absolute;
 pointer-events: all;
 box-shadow: var(--n-box-shadow);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 background-color: var(--n-color);
 color: var(--n-text-color);
 box-sizing: border-box;
 `, [slideInFromRightTransition(), slideInFromLeftTransition(), slideInFromTopTransition(), slideInFromBottomTransition(), cM("unselectable", `
 user-select: none; 
 -webkit-user-select: none;
 `), cM("native-scrollbar", [cB("drawer-content-wrapper", `
 overflow: auto;
 height: 100%;
 `)]), cE("resize-trigger", `
 position: absolute;
 background-color: #0000;
 transition: background-color .3s var(--n-bezier);
 `, [cM("hover", `
 background-color: var(--n-resize-trigger-color-hover);
 `)]), cB("drawer-content-wrapper", `
 box-sizing: border-box;
 `), cB("drawer-content", `
 height: 100%;
 display: flex;
 flex-direction: column;
 `, [cM("native-scrollbar", [cB("drawer-body-content-wrapper", `
 height: 100%;
 overflow: auto;
 `)]), cB("drawer-body", `
 flex: 1 0 0;
 overflow: hidden;
 `), cB("drawer-body-content-wrapper", `
 box-sizing: border-box;
 padding: var(--n-body-padding);
 `), cB("drawer-header", `
 font-weight: var(--n-title-font-weight);
 line-height: 1;
 font-size: var(--n-title-font-size);
 color: var(--n-title-text-color);
 padding: var(--n-header-padding);
 transition: border .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-divider-color);
 border-bottom: var(--n-header-border-bottom);
 display: flex;
 justify-content: space-between;
 align-items: center;
 `, [cE("close", `
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]), cB("drawer-footer", `
 display: flex;
 justify-content: flex-end;
 border-top: var(--n-footer-border-top);
 transition: border .3s var(--n-bezier);
 padding: var(--n-footer-padding);
 `)]), cM("right-placement", `
 top: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-bottom-left-radius: var(--n-border-radius);
 `, [cE("resize-trigger", `
 width: 3px;
 height: 100%;
 top: 0;
 left: 0;
 transform: translateX(-1.5px);
 cursor: ew-resize;
 `)]), cM("left-placement", `
 top: 0;
 bottom: 0;
 left: 0;
 border-top-right-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `, [cE("resize-trigger", `
 width: 3px;
 height: 100%;
 top: 0;
 right: 0;
 transform: translateX(1.5px);
 cursor: ew-resize;
 `)]), cM("top-placement", `
 top: 0;
 left: 0;
 right: 0;
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `, [cE("resize-trigger", `
 width: 100%;
 height: 3px;
 bottom: 0;
 left: 0;
 transform: translateY(1.5px);
 cursor: ns-resize;
 `)]), cM("bottom-placement", `
 left: 0;
 bottom: 0;
 right: 0;
 border-top-left-radius: var(--n-border-radius);
 border-top-right-radius: var(--n-border-radius);
 `, [cE("resize-trigger", `
 width: 100%;
 height: 3px;
 top: 0;
 left: 0;
 transform: translateY(-1.5px);
 cursor: ns-resize;
 `)])]), c("body", [c(">", [cB("drawer-container", `
 position: fixed;
 `)])]), cB("drawer-container", `
 position: relative;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 `, [c("> *", `
 pointer-events: all;
 `)]), cB("drawer-mask", `
 background-color: rgba(0, 0, 0, .3);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `, [cM("invisible", `
 background-color: rgba(0, 0, 0, 0)
 `), fadeInTransition({
        enterDuration: "0.2s",
        leaveDuration: "0.2s",
        enterCubicBezier: "var(--n-bezier-in)",
        leaveCubicBezier: "var(--n-bezier-out)"
      })])]);
      const drawerProps = Object.assign(Object.assign({}, useTheme.props), {
        show: Boolean,
        width: [Number, String],
        height: [Number, String],
        placement: {
          type: String,
          default: "right"
        },
        maskClosable: {
          type: Boolean,
          default: true
        },
        showMask: {
          type: [Boolean, String],
          default: true
        },
        to: [String, Object],
        displayDirective: {
          type: String,
          default: "if"
        },
        nativeScrollbar: {
          type: Boolean,
          default: true
        },
        zIndex: Number,
        onMaskClick: Function,
        scrollbarProps: Object,
        contentClass: String,
        contentStyle: [Object, String],
        trapFocus: {
          type: Boolean,
          default: true
        },
        onEsc: Function,
        autoFocus: {
          type: Boolean,
          default: true
        },
        closeOnEsc: {
          type: Boolean,
          default: true
        },
        blockScroll: {
          type: Boolean,
          default: true
        },
        maxWidth: Number,
        maxHeight: Number,
        minWidth: Number,
        minHeight: Number,
        resizable: Boolean,
        defaultWidth: {
          type: [Number, String],
          default: 251
        },
        defaultHeight: {
          type: [Number, String],
          default: 251
        },
        onUpdateWidth: [Function, Array],
        onUpdateHeight: [Function, Array],
        "onUpdate:width": [Function, Array],
        "onUpdate:height": [Function, Array],
        "onUpdate:show": [Function, Array],
        onUpdateShow: [Function, Array],
        onAfterEnter: Function,
        onAfterLeave: Function,
        /** @deprecated */
        drawerStyle: [String, Object],
        drawerClass: String,
        target: null,
        onShow: Function,
        onHide: Function
      });
      const __unplugin_components_12 = /* @__PURE__ */ defineComponent({
        name: "Drawer",
        inheritAttrs: false,
        props: drawerProps,
        setup(props) {
          const {
            mergedClsPrefixRef,
            namespaceRef,
            inlineThemeDisabled
          } = useConfig(props);
          const isMountedRef = isMounted();
          const themeRef = useTheme("Drawer", "-drawer", style$3, drawerLight$1, props, mergedClsPrefixRef);
          const uncontrolledWidthRef = ref(props.defaultWidth);
          const uncontrolledHeightRef = ref(props.defaultHeight);
          const mergedWidthRef = useMergedState(toRef(props, "width"), uncontrolledWidthRef);
          const mergedHeightRef = useMergedState(toRef(props, "height"), uncontrolledHeightRef);
          const styleWidthRef = computed(() => {
            const {
              placement
            } = props;
            if (placement === "top" || placement === "bottom")
              return "";
            return formatLength(mergedWidthRef.value);
          });
          const styleHeightRef = computed(() => {
            const {
              placement
            } = props;
            if (placement === "left" || placement === "right")
              return "";
            return formatLength(mergedHeightRef.value);
          });
          const doUpdateWidth = (value) => {
            const {
              onUpdateWidth,
              "onUpdate:width": _onUpdateWidth
            } = props;
            if (onUpdateWidth)
              call(onUpdateWidth, value);
            if (_onUpdateWidth)
              call(_onUpdateWidth, value);
            uncontrolledWidthRef.value = value;
          };
          const doUpdateHeight = (value) => {
            const {
              onUpdateHeight,
              "onUpdate:width": _onUpdateHeight
            } = props;
            if (onUpdateHeight)
              call(onUpdateHeight, value);
            if (_onUpdateHeight)
              call(_onUpdateHeight, value);
            uncontrolledHeightRef.value = value;
          };
          const mergedBodyStyleRef = computed(() => {
            return [{
              width: styleWidthRef.value,
              height: styleHeightRef.value
            }, props.drawerStyle || ""];
          });
          function handleMaskClick(e) {
            const {
              onMaskClick,
              maskClosable
            } = props;
            if (maskClosable) {
              doUpdateShow(false);
            }
            if (onMaskClick)
              onMaskClick(e);
          }
          function handleOutsideClick(e) {
            handleMaskClick(e);
          }
          const isComposingRef2 = useIsComposing();
          function handleEsc(e) {
            var _a;
            (_a = props.onEsc) === null || _a === void 0 ? void 0 : _a.call(props);
            if (props.show && props.closeOnEsc && eventEffectNotPerformed(e)) {
              !isComposingRef2.value && doUpdateShow(false);
            }
          }
          function doUpdateShow(show) {
            const {
              onHide,
              onUpdateShow,
              "onUpdate:show": _onUpdateShow
            } = props;
            if (onUpdateShow)
              call(onUpdateShow, show);
            if (_onUpdateShow)
              call(_onUpdateShow, show);
            if (onHide && !show)
              call(onHide, show);
          }
          provide(drawerInjectionKey, {
            isMountedRef,
            mergedThemeRef: themeRef,
            mergedClsPrefixRef,
            doUpdateShow,
            doUpdateHeight,
            doUpdateWidth
          });
          const cssVarsRef = computed(() => {
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2,
                cubicBezierEaseIn: cubicBezierEaseIn2,
                cubicBezierEaseOut: cubicBezierEaseOut2
              },
              self: {
                color,
                textColor,
                boxShadow,
                lineHeight: lineHeight2,
                headerPadding,
                footerPadding,
                borderRadius,
                bodyPadding,
                titleFontSize,
                titleTextColor,
                titleFontWeight,
                headerBorderBottom,
                footerBorderTop,
                closeIconColor,
                closeIconColorHover,
                closeIconColorPressed,
                closeColorHover,
                closeColorPressed,
                closeIconSize,
                closeSize,
                closeBorderRadius,
                resizableTriggerColorHover
              }
            } = themeRef.value;
            return {
              "--n-line-height": lineHeight2,
              "--n-color": color,
              "--n-border-radius": borderRadius,
              "--n-text-color": textColor,
              "--n-box-shadow": boxShadow,
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-bezier-out": cubicBezierEaseOut2,
              "--n-bezier-in": cubicBezierEaseIn2,
              "--n-header-padding": headerPadding,
              "--n-body-padding": bodyPadding,
              "--n-footer-padding": footerPadding,
              "--n-title-text-color": titleTextColor,
              "--n-title-font-size": titleFontSize,
              "--n-title-font-weight": titleFontWeight,
              "--n-header-border-bottom": headerBorderBottom,
              "--n-footer-border-top": footerBorderTop,
              "--n-close-icon-color": closeIconColor,
              "--n-close-icon-color-hover": closeIconColorHover,
              "--n-close-icon-color-pressed": closeIconColorPressed,
              "--n-close-size": closeSize,
              "--n-close-color-hover": closeColorHover,
              "--n-close-color-pressed": closeColorPressed,
              "--n-close-icon-size": closeIconSize,
              "--n-close-border-radius": closeBorderRadius,
              "--n-resize-trigger-color-hover": resizableTriggerColorHover
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("drawer", void 0, cssVarsRef, props) : void 0;
          return {
            mergedClsPrefix: mergedClsPrefixRef,
            namespace: namespaceRef,
            mergedBodyStyle: mergedBodyStyleRef,
            handleOutsideClick,
            handleMaskClick,
            handleEsc,
            mergedTheme: themeRef,
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender,
            isMounted: isMountedRef
          };
        },
        render() {
          const {
            mergedClsPrefix
          } = this;
          return h(LazyTeleport, {
            to: this.to,
            show: this.show
          }, {
            default: () => {
              var _a;
              (_a = this.onRender) === null || _a === void 0 ? void 0 : _a.call(this);
              return withDirectives(h("div", {
                class: [`${mergedClsPrefix}-drawer-container`, this.namespace, this.themeClass],
                style: this.cssVars,
                role: "none"
              }, this.showMask ? h(Transition, {
                name: "fade-in-transition",
                appear: this.isMounted
              }, {
                default: () => this.show ? h("div", {
                  "aria-hidden": true,
                  class: [`${mergedClsPrefix}-drawer-mask`, this.showMask === "transparent" && `${mergedClsPrefix}-drawer-mask--invisible`],
                  onClick: this.handleMaskClick
                }) : null
              }) : null, h(NDrawerBodyWrapper, Object.assign({}, this.$attrs, {
                class: [this.drawerClass, this.$attrs.class],
                style: [this.mergedBodyStyle, this.$attrs.style],
                blockScroll: this.blockScroll,
                contentStyle: this.contentStyle,
                contentClass: this.contentClass,
                placement: this.placement,
                scrollbarProps: this.scrollbarProps,
                show: this.show,
                displayDirective: this.displayDirective,
                nativeScrollbar: this.nativeScrollbar,
                onAfterEnter: this.onAfterEnter,
                onAfterLeave: this.onAfterLeave,
                trapFocus: this.trapFocus,
                autoFocus: this.autoFocus,
                resizable: this.resizable,
                maxHeight: this.maxHeight,
                minHeight: this.minHeight,
                maxWidth: this.maxWidth,
                minWidth: this.minWidth,
                showMask: this.showMask,
                onEsc: this.handleEsc,
                onClickoutside: this.handleOutsideClick
              }), this.$slots)), [[zindexable$1, {
                zIndex: this.zIndex,
                enabled: this.show
              }]]);
            }
          });
        }
      });
      const drawerContentProps = {
        title: String,
        headerClass: String,
        headerStyle: [Object, String],
        footerClass: String,
        footerStyle: [Object, String],
        bodyClass: String,
        bodyStyle: [Object, String],
        bodyContentClass: String,
        bodyContentStyle: [Object, String],
        nativeScrollbar: {
          type: Boolean,
          default: true
        },
        scrollbarProps: Object,
        closable: Boolean
      };
      const __unplugin_components_11 = /* @__PURE__ */ defineComponent({
        name: "DrawerContent",
        props: drawerContentProps,
        setup() {
          const NDrawer = inject(drawerInjectionKey, null);
          if (!NDrawer) {
            throwError("drawer-content", "`n-drawer-content` must be placed inside `n-drawer`.");
          }
          const {
            doUpdateShow
          } = NDrawer;
          function handleCloseClick() {
            doUpdateShow(false);
          }
          return {
            handleCloseClick,
            mergedTheme: NDrawer.mergedThemeRef,
            mergedClsPrefix: NDrawer.mergedClsPrefixRef
          };
        },
        render() {
          const {
            title,
            mergedClsPrefix,
            nativeScrollbar,
            mergedTheme,
            bodyClass,
            bodyStyle,
            bodyContentClass,
            bodyContentStyle,
            headerClass,
            headerStyle,
            footerClass,
            footerStyle,
            scrollbarProps: scrollbarProps2,
            closable,
            $slots
          } = this;
          return h("div", {
            role: "none",
            class: [`${mergedClsPrefix}-drawer-content`, nativeScrollbar && `${mergedClsPrefix}-drawer-content--native-scrollbar`]
          }, $slots.header || title || closable ? h("div", {
            class: [`${mergedClsPrefix}-drawer-header`, headerClass],
            style: headerStyle,
            role: "none"
          }, h("div", {
            class: `${mergedClsPrefix}-drawer-header__main`,
            role: "heading",
            "aria-level": "1"
          }, $slots.header !== void 0 ? $slots.header() : title), closable && h(NBaseClose, {
            onClick: this.handleCloseClick,
            clsPrefix: mergedClsPrefix,
            class: `${mergedClsPrefix}-drawer-header__close`,
            absolute: true
          })) : null, nativeScrollbar ? h("div", {
            class: [`${mergedClsPrefix}-drawer-body`, bodyClass],
            style: bodyStyle,
            role: "none"
          }, h("div", {
            class: [`${mergedClsPrefix}-drawer-body-content-wrapper`, bodyContentClass],
            style: bodyContentStyle,
            role: "none"
          }, $slots)) : h(NScrollbar, Object.assign({
            themeOverrides: mergedTheme.peerOverrides.Scrollbar,
            theme: mergedTheme.peers.Scrollbar
          }, scrollbarProps2, {
            class: `${mergedClsPrefix}-drawer-body`,
            contentClass: [`${mergedClsPrefix}-drawer-body-content-wrapper`, bodyContentClass],
            contentStyle: bodyContentStyle
          }), $slots), $slots.footer ? h("div", {
            class: [`${mergedClsPrefix}-drawer-footer`, footerClass],
            style: footerStyle,
            role: "none"
          }, $slots.footer()) : null);
        }
      });
      const commonVars = {
        gapSmall: "4px 8px",
        gapMedium: "8px 12px",
        gapLarge: "12px 16px"
      };
      const self$3 = () => {
        return commonVars;
      };
      const flexLight = {
        name: "Flex",
        self: self$3
      };
      const flexLight$1 = flexLight;
      const flexProps = Object.assign(Object.assign({}, useTheme.props), {
        align: String,
        justify: {
          type: String,
          default: "start"
        },
        inline: Boolean,
        vertical: Boolean,
        reverse: Boolean,
        size: {
          type: [String, Number, Array],
          default: "medium"
        },
        wrap: {
          type: Boolean,
          default: true
        }
      });
      const __unplugin_components_8 = /* @__PURE__ */ defineComponent({
        name: "Flex",
        props: flexProps,
        setup(props) {
          const {
            mergedClsPrefixRef,
            mergedRtlRef
          } = useConfig(props);
          const themeRef = useTheme("Flex", "-flex", void 0, flexLight$1, props, mergedClsPrefixRef);
          const rtlEnabledRef = useRtl("Flex", mergedRtlRef, mergedClsPrefixRef);
          return {
            rtlEnabled: rtlEnabledRef,
            mergedClsPrefix: mergedClsPrefixRef,
            margin: computed(() => {
              const {
                size: size2
              } = props;
              if (Array.isArray(size2)) {
                return {
                  horizontal: size2[0],
                  vertical: size2[1]
                };
              }
              if (typeof size2 === "number") {
                return {
                  horizontal: size2,
                  vertical: size2
                };
              }
              const {
                self: {
                  [createKey("gap", size2)]: gap
                }
              } = themeRef.value;
              const {
                row,
                col
              } = getGap(gap);
              return {
                horizontal: depx(col),
                vertical: depx(row)
              };
            })
          };
        },
        render() {
          const {
            vertical,
            reverse,
            align,
            inline,
            justify,
            margin,
            wrap,
            mergedClsPrefix,
            rtlEnabled
          } = this;
          const children = flatten(getSlot$1(this), false);
          if (!children.length)
            return null;
          return h("div", {
            role: "none",
            class: [`${mergedClsPrefix}-flex`, rtlEnabled && `${mergedClsPrefix}-flex--rtl`],
            style: {
              display: inline ? "inline-flex" : "flex",
              flexDirection: (() => {
                if (vertical && !reverse)
                  return "column";
                if (vertical && reverse)
                  return "column-reverse";
                if (!vertical && reverse)
                  return "row-reverse";
                else
                  return "row";
              })(),
              justifyContent: justify,
              flexWrap: !wrap || vertical ? "nowrap" : "wrap",
              alignItems: align,
              gap: `${margin.vertical}px ${margin.horizontal}px`
            }
          }, children);
        }
      });
      const commonVariables = {
        feedbackPadding: "4px 0 0 2px",
        feedbackHeightSmall: "24px",
        feedbackHeightMedium: "24px",
        feedbackHeightLarge: "26px",
        feedbackFontSizeSmall: "13px",
        feedbackFontSizeMedium: "14px",
        feedbackFontSizeLarge: "14px",
        labelFontSizeLeftSmall: "14px",
        labelFontSizeLeftMedium: "14px",
        labelFontSizeLeftLarge: "15px",
        labelFontSizeTopSmall: "13px",
        labelFontSizeTopMedium: "14px",
        labelFontSizeTopLarge: "14px",
        labelHeightSmall: "24px",
        labelHeightMedium: "26px",
        labelHeightLarge: "28px",
        labelPaddingVertical: "0 0 6px 2px",
        labelPaddingHorizontal: "0 12px 0 0",
        labelTextAlignVertical: "left",
        labelTextAlignHorizontal: "right",
        labelFontWeight: "400"
      };
      const self$2 = (vars) => {
        const {
          heightSmall,
          heightMedium,
          heightLarge,
          textColor1,
          errorColor,
          warningColor,
          lineHeight: lineHeight2,
          textColor3
        } = vars;
        return Object.assign(Object.assign({}, commonVariables), {
          blankHeightSmall: heightSmall,
          blankHeightMedium: heightMedium,
          blankHeightLarge: heightLarge,
          lineHeight: lineHeight2,
          labelTextColor: textColor1,
          asteriskColor: errorColor,
          feedbackTextColorError: errorColor,
          feedbackTextColorWarning: warningColor,
          feedbackTextColor: textColor3
        });
      };
      const formLight = {
        name: "Form",
        common: commonLight,
        self: self$2
      };
      const formLight$1 = formLight;
      const style$2 = cB("form", [cM("inline", `
 width: 100%;
 display: inline-flex;
 align-items: flex-start;
 align-content: space-around;
 `, [cB("form-item", {
        width: "auto",
        marginRight: "18px"
      }, [c("&:last-child", {
        marginRight: 0
      })])])]);
      const formInjectionKey = createInjectionKey("n-form");
      const formItemInstsInjectionKey = createInjectionKey("n-form-item-insts");
      var __awaiter$1 = function(thisArg, _arguments, P, generator) {
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
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      const formProps = Object.assign(Object.assign({}, useTheme.props), {
        inline: Boolean,
        labelWidth: [Number, String],
        labelAlign: String,
        labelPlacement: {
          type: String,
          default: "top"
        },
        model: {
          type: Object,
          default: () => {
          }
        },
        rules: Object,
        disabled: Boolean,
        size: String,
        showRequireMark: {
          type: Boolean,
          default: void 0
        },
        requireMarkPlacement: String,
        showFeedback: {
          type: Boolean,
          default: true
        },
        onSubmit: {
          type: Function,
          default: (e) => {
            e.preventDefault();
          }
        },
        showLabel: {
          type: Boolean,
          default: void 0
        },
        validateMessages: Object
      });
      const __unplugin_components_4 = /* @__PURE__ */ defineComponent({
        name: "Form",
        props: formProps,
        setup(props) {
          const {
            mergedClsPrefixRef
          } = useConfig(props);
          useTheme("Form", "-form", style$2, formLight$1, props, mergedClsPrefixRef);
          const formItems = {};
          const maxChildLabelWidthRef = ref(void 0);
          const deriveMaxChildLabelWidth = (currentWidth) => {
            const currentMaxChildLabelWidth = maxChildLabelWidthRef.value;
            if (currentMaxChildLabelWidth === void 0 || currentWidth >= currentMaxChildLabelWidth) {
              maxChildLabelWidthRef.value = currentWidth;
            }
          };
          function validate(validateCallback, shouldRuleBeApplied = () => true) {
            return __awaiter$1(this, void 0, void 0, function* () {
              return yield new Promise((resolve, reject) => {
                const formItemValidationPromises = [];
                for (const key of keysOf(formItems)) {
                  const formItemInstances = formItems[key];
                  for (const formItemInstance of formItemInstances) {
                    if (formItemInstance.path) {
                      formItemValidationPromises.push(formItemInstance.internalValidate(null, shouldRuleBeApplied));
                    }
                  }
                }
                void Promise.all(formItemValidationPromises).then((results) => {
                  const formInvalid = results.some((result) => !result.valid);
                  const errors = [];
                  const warnings = [];
                  results.forEach((result) => {
                    var _a, _b;
                    if ((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length) {
                      errors.push(result.errors);
                    }
                    if ((_b = result.warnings) === null || _b === void 0 ? void 0 : _b.length) {
                      warnings.push(result.warnings);
                    }
                  });
                  if (validateCallback) {
                    validateCallback(errors.length ? errors : void 0, {
                      warnings: warnings.length ? warnings : void 0
                    });
                  }
                  if (formInvalid) {
                    reject(errors.length ? errors : void 0);
                  } else {
                    resolve({
                      warnings: warnings.length ? warnings : void 0
                    });
                  }
                });
              });
            });
          }
          function restoreValidation() {
            for (const key of keysOf(formItems)) {
              const formItemInstances = formItems[key];
              for (const formItemInstance of formItemInstances) {
                formItemInstance.restoreValidation();
              }
            }
          }
          provide(formInjectionKey, {
            props,
            maxChildLabelWidthRef,
            deriveMaxChildLabelWidth
          });
          provide(formItemInstsInjectionKey, {
            formItems
          });
          const formExposedMethod = {
            validate,
            restoreValidation
          };
          return Object.assign(formExposedMethod, {
            mergedClsPrefix: mergedClsPrefixRef
          });
        },
        render() {
          const {
            mergedClsPrefix
          } = this;
          return h("form", {
            class: [`${mergedClsPrefix}-form`, this.inline && `${mergedClsPrefix}-form--inline`],
            onSubmit: this.onSubmit
          }, this.$slots);
        }
      });
      var define_process_env_default = {};
      function _extends() {
        _extends = Object.assign ? Object.assign.bind() : function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
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
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        _setPrototypeOf(subClass, superClass);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _setPrototypeOf(o, p2) {
        _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p22) {
          o2.__proto__ = p22;
          return o2;
        };
        return _setPrototypeOf(o, p2);
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
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) {
          _construct = Reflect.construct.bind();
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2))
            return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2))
              return _cache.get(Class2);
            _cache.set(Class2, Wrapper2);
          }
          function Wrapper2() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper2.prototype = Object.create(Class2.prototype, {
            constructor: {
              value: Wrapper2,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
          return _setPrototypeOf(Wrapper2, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      var formatRegExp = /%[sdj%]/g;
      var warning = function warning2() {
      };
      if (typeof process !== "undefined" && define_process_env_default && false) {
        warning = function warning3(type4, errors) {
          if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
            if (errors.every(function(e) {
              return typeof e === "string";
            })) {
              console.warn(type4, errors);
            }
          }
        };
      }
      function convertFieldsError(errors) {
        if (!errors || !errors.length)
          return null;
        var fields = {};
        errors.forEach(function(error) {
          var field = error.field;
          fields[field] = fields[field] || [];
          fields[field].push(error);
        });
        return fields;
      }
      function format(template) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var i = 0;
        var len2 = args.length;
        if (typeof template === "function") {
          return template.apply(null, args);
        }
        if (typeof template === "string") {
          var str = template.replace(formatRegExp, function(x) {
            if (x === "%%") {
              return "%";
            }
            if (i >= len2) {
              return x;
            }
            switch (x) {
              case "%s":
                return String(args[i++]);
              case "%d":
                return Number(args[i++]);
              case "%j":
                try {
                  return JSON.stringify(args[i++]);
                } catch (_) {
                  return "[Circular]";
                }
                break;
              default:
                return x;
            }
          });
          return str;
        }
        return template;
      }
      function isNativeStringType(type4) {
        return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
      }
      function isEmptyValue(value, type4) {
        if (value === void 0 || value === null) {
          return true;
        }
        if (type4 === "array" && Array.isArray(value) && !value.length) {
          return true;
        }
        if (isNativeStringType(type4) && typeof value === "string" && !value) {
          return true;
        }
        return false;
      }
      function asyncParallelArray(arr, func, callback) {
        var results = [];
        var total = 0;
        var arrLength = arr.length;
        function count(errors) {
          results.push.apply(results, errors || []);
          total++;
          if (total === arrLength) {
            callback(results);
          }
        }
        arr.forEach(function(a) {
          func(a, count);
        });
      }
      function asyncSerialArray(arr, func, callback) {
        var index = 0;
        var arrLength = arr.length;
        function next(errors) {
          if (errors && errors.length) {
            callback(errors);
            return;
          }
          var original = index;
          index = index + 1;
          if (original < arrLength) {
            func(arr[original], next);
          } else {
            callback([]);
          }
        }
        next([]);
      }
      function flattenObjArr(objArr) {
        var ret = [];
        Object.keys(objArr).forEach(function(k) {
          ret.push.apply(ret, objArr[k] || []);
        });
        return ret;
      }
      var AsyncValidationError = /* @__PURE__ */ function(_Error) {
        _inheritsLoose(AsyncValidationError2, _Error);
        function AsyncValidationError2(errors, fields) {
          var _this;
          _this = _Error.call(this, "Async Validation Error") || this;
          _this.errors = errors;
          _this.fields = fields;
          return _this;
        }
        return AsyncValidationError2;
      }(/* @__PURE__ */ _wrapNativeSuper(Error));
      function asyncMap(objArr, option, func, callback, source) {
        if (option.first) {
          var _pending = new Promise(function(resolve, reject) {
            var next = function next2(errors) {
              callback(errors);
              return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
            };
            var flattenArr = flattenObjArr(objArr);
            asyncSerialArray(flattenArr, func, next);
          });
          _pending["catch"](function(e) {
            return e;
          });
          return _pending;
        }
        var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
        var objArrKeys = Object.keys(objArr);
        var objArrLength = objArrKeys.length;
        var total = 0;
        var results = [];
        var pending = new Promise(function(resolve, reject) {
          var next = function next2(errors) {
            results.push.apply(results, errors);
            total++;
            if (total === objArrLength) {
              callback(results);
              return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
            }
          };
          if (!objArrKeys.length) {
            callback(results);
            resolve(source);
          }
          objArrKeys.forEach(function(key) {
            var arr = objArr[key];
            if (firstFields.indexOf(key) !== -1) {
              asyncSerialArray(arr, func, next);
            } else {
              asyncParallelArray(arr, func, next);
            }
          });
        });
        pending["catch"](function(e) {
          return e;
        });
        return pending;
      }
      function isErrorObj(obj) {
        return !!(obj && obj.message !== void 0);
      }
      function getValue(value, path) {
        var v = value;
        for (var i = 0; i < path.length; i++) {
          if (v == void 0) {
            return v;
          }
          v = v[path[i]];
        }
        return v;
      }
      function complementError(rule, source) {
        return function(oe) {
          var fieldValue;
          if (rule.fullFields) {
            fieldValue = getValue(source, rule.fullFields);
          } else {
            fieldValue = source[oe.field || rule.fullField];
          }
          if (isErrorObj(oe)) {
            oe.field = oe.field || rule.fullField;
            oe.fieldValue = fieldValue;
            return oe;
          }
          return {
            message: typeof oe === "function" ? oe() : oe,
            fieldValue,
            field: oe.field || rule.fullField
          };
        };
      }
      function deepMerge(target, source) {
        if (source) {
          for (var s in source) {
            if (source.hasOwnProperty(s)) {
              var value = source[s];
              if (typeof value === "object" && typeof target[s] === "object") {
                target[s] = _extends({}, target[s], value);
              } else {
                target[s] = value;
              }
            }
          }
        }
        return target;
      }
      var required$1 = function required(rule, value, source, errors, options, type4) {
        if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
          errors.push(format(options.messages.required, rule.fullField));
        }
      };
      var whitespace = function whitespace2(rule, value, source, errors, options) {
        if (/^\s+$/.test(value) || value === "") {
          errors.push(format(options.messages.whitespace, rule.fullField));
        }
      };
      var urlReg;
      var getUrlRegex = function() {
        if (urlReg) {
          return urlReg;
        }
        var word = "[a-fA-F\\d:]";
        var b = function b2(options) {
          return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
        };
        var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
        var v6seg = "[a-fA-F\\d]{1,4}";
        var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
        var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
        var v4exact = new RegExp("^" + v4 + "$");
        var v6exact = new RegExp("^" + v6 + "$");
        var ip = function ip2(options) {
          return options && options.exact ? v46Exact : new RegExp("(?:" + b(options) + v4 + b(options) + ")|(?:" + b(options) + v6 + b(options) + ")", "g");
        };
        ip.v4 = function(options) {
          return options && options.exact ? v4exact : new RegExp("" + b(options) + v4 + b(options), "g");
        };
        ip.v6 = function(options) {
          return options && options.exact ? v6exact : new RegExp("" + b(options) + v6 + b(options), "g");
        };
        var protocol = "(?:(?:[a-z]+:)?//)";
        var auth = "(?:\\S+(?::\\S*)?@)?";
        var ipv4 = ip.v4().source;
        var ipv6 = ip.v6().source;
        var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
        var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
        var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
        var port = "(?::\\d{2,5})?";
        var path = '(?:[/?#][^\\s"]*)?';
        var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
        urlReg = new RegExp("(?:^" + regex + "$)", "i");
        return urlReg;
      };
      var pattern$2 = {
        // http://emailregex.com/
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
        // url: new RegExp(
        //   '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
        //   'i',
        // ),
        hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
      };
      var types = {
        integer: function integer(value) {
          return types.number(value) && parseInt(value, 10) === value;
        },
        "float": function float2(value) {
          return types.number(value) && !types.integer(value);
        },
        array: function array(value) {
          return Array.isArray(value);
        },
        regexp: function regexp(value) {
          if (value instanceof RegExp) {
            return true;
          }
          try {
            return !!new RegExp(value);
          } catch (e) {
            return false;
          }
        },
        date: function date(value) {
          return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
        },
        number: function number(value) {
          if (isNaN(value)) {
            return false;
          }
          return typeof value === "number";
        },
        object: function object(value) {
          return typeof value === "object" && !types.array(value);
        },
        method: function method(value) {
          return typeof value === "function";
        },
        email: function email(value) {
          return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
        },
        url: function url(value) {
          return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
        },
        hex: function hex2(value) {
          return typeof value === "string" && !!value.match(pattern$2.hex);
        }
      };
      var type$1 = function type(rule, value, source, errors, options) {
        if (rule.required && value === void 0) {
          required$1(rule, value, source, errors, options);
          return;
        }
        var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
        var ruleType = rule.type;
        if (custom.indexOf(ruleType) > -1) {
          if (!types[ruleType](value)) {
            errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
          }
        } else if (ruleType && typeof value !== rule.type) {
          errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
        }
      };
      var range = function range2(rule, value, source, errors, options) {
        var len2 = typeof rule.len === "number";
        var min = typeof rule.min === "number";
        var max = typeof rule.max === "number";
        var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
        var val = value;
        var key = null;
        var num = typeof value === "number";
        var str = typeof value === "string";
        var arr = Array.isArray(value);
        if (num) {
          key = "number";
        } else if (str) {
          key = "string";
        } else if (arr) {
          key = "array";
        }
        if (!key) {
          return false;
        }
        if (arr) {
          val = value.length;
        }
        if (str) {
          val = value.replace(spRegexp, "_").length;
        }
        if (len2) {
          if (val !== rule.len) {
            errors.push(format(options.messages[key].len, rule.fullField, rule.len));
          }
        } else if (min && !max && val < rule.min) {
          errors.push(format(options.messages[key].min, rule.fullField, rule.min));
        } else if (max && !min && val > rule.max) {
          errors.push(format(options.messages[key].max, rule.fullField, rule.max));
        } else if (min && max && (val < rule.min || val > rule.max)) {
          errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
        }
      };
      var ENUM$1 = "enum";
      var enumerable$1 = function enumerable(rule, value, source, errors, options) {
        rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
        if (rule[ENUM$1].indexOf(value) === -1) {
          errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
        }
      };
      var pattern$1 = function pattern(rule, value, source, errors, options) {
        if (rule.pattern) {
          if (rule.pattern instanceof RegExp) {
            rule.pattern.lastIndex = 0;
            if (!rule.pattern.test(value)) {
              errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
            }
          } else if (typeof rule.pattern === "string") {
            var _pattern = new RegExp(rule.pattern);
            if (!_pattern.test(value)) {
              errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
            }
          }
        }
      };
      var rules = {
        required: required$1,
        whitespace,
        type: type$1,
        range,
        "enum": enumerable$1,
        pattern: pattern$1
      };
      var string = function string2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "string") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, "string");
          if (!isEmptyValue(value, "string")) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
            rules.pattern(rule, value, source, errors, options);
            if (rule.whitespace === true) {
              rules.whitespace(rule, value, source, errors, options);
            }
          }
        }
        callback(errors);
      };
      var method2 = function method3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var number2 = function number3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (value === "") {
            value = void 0;
          }
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var _boolean = function _boolean2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var regexp2 = function regexp3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value)) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var integer2 = function integer3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var floatFn = function floatFn2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var array2 = function array3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if ((value === void 0 || value === null) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, "array");
          if (value !== void 0 && value !== null) {
            rules.type(rule, value, source, errors, options);
            rules.range(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var object2 = function object3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var ENUM = "enum";
      var enumerable2 = function enumerable3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (value !== void 0) {
            rules[ENUM](rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var pattern2 = function pattern3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "string") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value, "string")) {
            rules.pattern(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var date2 = function date3(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, "date") && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
          if (!isEmptyValue(value, "date")) {
            var dateObject;
            if (value instanceof Date) {
              dateObject = value;
            } else {
              dateObject = new Date(value);
            }
            rules.type(rule, dateObject, source, errors, options);
            if (dateObject) {
              rules.range(rule, dateObject.getTime(), source, errors, options);
            }
          }
        }
        callback(errors);
      };
      var required2 = function required3(rule, value, callback, source, options) {
        var errors = [];
        var type4 = Array.isArray(value) ? "array" : typeof value;
        rules.required(rule, value, source, errors, options, type4);
        callback(errors);
      };
      var type2 = function type3(rule, value, callback, source, options) {
        var ruleType = rule.type;
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value, ruleType) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options, ruleType);
          if (!isEmptyValue(value, ruleType)) {
            rules.type(rule, value, source, errors, options);
          }
        }
        callback(errors);
      };
      var any = function any2(rule, value, callback, source, options) {
        var errors = [];
        var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
        if (validate) {
          if (isEmptyValue(value) && !rule.required) {
            return callback();
          }
          rules.required(rule, value, source, errors, options);
        }
        callback(errors);
      };
      var validators = {
        string,
        method: method2,
        number: number2,
        "boolean": _boolean,
        regexp: regexp2,
        integer: integer2,
        "float": floatFn,
        array: array2,
        object: object2,
        "enum": enumerable2,
        pattern: pattern2,
        date: date2,
        url: type2,
        hex: type2,
        email: type2,
        required: required2,
        any
      };
      function newMessages() {
        return {
          "default": "Validation error on field %s",
          required: "%s is required",
          "enum": "%s must be one of %s",
          whitespace: "%s cannot be empty",
          date: {
            format: "%s date %s is invalid for format %s",
            parse: "%s date could not be parsed, %s is invalid ",
            invalid: "%s date %s is invalid"
          },
          types: {
            string: "%s is not a %s",
            method: "%s is not a %s (function)",
            array: "%s is not an %s",
            object: "%s is not an %s",
            number: "%s is not a %s",
            date: "%s is not a %s",
            "boolean": "%s is not a %s",
            integer: "%s is not an %s",
            "float": "%s is not a %s",
            regexp: "%s is not a valid %s",
            email: "%s is not a valid %s",
            url: "%s is not a valid %s",
            hex: "%s is not a valid %s"
          },
          string: {
            len: "%s must be exactly %s characters",
            min: "%s must be at least %s characters",
            max: "%s cannot be longer than %s characters",
            range: "%s must be between %s and %s characters"
          },
          number: {
            len: "%s must equal %s",
            min: "%s cannot be less than %s",
            max: "%s cannot be greater than %s",
            range: "%s must be between %s and %s"
          },
          array: {
            len: "%s must be exactly %s in length",
            min: "%s cannot be less than %s in length",
            max: "%s cannot be greater than %s in length",
            range: "%s must be between %s and %s in length"
          },
          pattern: {
            mismatch: "%s value %s does not match pattern %s"
          },
          clone: function clone() {
            var cloned = JSON.parse(JSON.stringify(this));
            cloned.clone = this.clone;
            return cloned;
          }
        };
      }
      var messages = newMessages();
      var Schema = /* @__PURE__ */ function() {
        function Schema2(descriptor) {
          this.rules = null;
          this._messages = messages;
          this.define(descriptor);
        }
        var _proto = Schema2.prototype;
        _proto.define = function define(rules2) {
          var _this = this;
          if (!rules2) {
            throw new Error("Cannot configure a schema with no rules");
          }
          if (typeof rules2 !== "object" || Array.isArray(rules2)) {
            throw new Error("Rules must be an object");
          }
          this.rules = {};
          Object.keys(rules2).forEach(function(name) {
            var item = rules2[name];
            _this.rules[name] = Array.isArray(item) ? item : [item];
          });
        };
        _proto.messages = function messages2(_messages) {
          if (_messages) {
            this._messages = deepMerge(newMessages(), _messages);
          }
          return this._messages;
        };
        _proto.validate = function validate(source_, o, oc) {
          var _this2 = this;
          if (o === void 0) {
            o = {};
          }
          if (oc === void 0) {
            oc = function oc2() {
            };
          }
          var source = source_;
          var options = o;
          var callback = oc;
          if (typeof options === "function") {
            callback = options;
            options = {};
          }
          if (!this.rules || Object.keys(this.rules).length === 0) {
            if (callback) {
              callback(null, source);
            }
            return Promise.resolve(source);
          }
          function complete(results) {
            var errors = [];
            var fields = {};
            function add2(e) {
              if (Array.isArray(e)) {
                var _errors;
                errors = (_errors = errors).concat.apply(_errors, e);
              } else {
                errors.push(e);
              }
            }
            for (var i = 0; i < results.length; i++) {
              add2(results[i]);
            }
            if (!errors.length) {
              callback(null, source);
            } else {
              fields = convertFieldsError(errors);
              callback(errors, fields);
            }
          }
          if (options.messages) {
            var messages$1 = this.messages();
            if (messages$1 === messages) {
              messages$1 = newMessages();
            }
            deepMerge(messages$1, options.messages);
            options.messages = messages$1;
          } else {
            options.messages = this.messages();
          }
          var series = {};
          var keys = options.keys || Object.keys(this.rules);
          keys.forEach(function(z) {
            var arr = _this2.rules[z];
            var value = source[z];
            arr.forEach(function(r) {
              var rule = r;
              if (typeof rule.transform === "function") {
                if (source === source_) {
                  source = _extends({}, source);
                }
                value = source[z] = rule.transform(value);
              }
              if (typeof rule === "function") {
                rule = {
                  validator: rule
                };
              } else {
                rule = _extends({}, rule);
              }
              rule.validator = _this2.getValidationMethod(rule);
              if (!rule.validator) {
                return;
              }
              rule.field = z;
              rule.fullField = rule.fullField || z;
              rule.type = _this2.getType(rule);
              series[z] = series[z] || [];
              series[z].push({
                rule,
                value,
                source,
                field: z
              });
            });
          });
          var errorFields = {};
          return asyncMap(series, options, function(data, doIt) {
            var rule = data.rule;
            var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
            deep = deep && (rule.required || !rule.required && data.value);
            rule.field = data.field;
            function addFullField(key, schema) {
              return _extends({}, schema, {
                fullField: rule.fullField + "." + key,
                fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
              });
            }
            function cb(e) {
              if (e === void 0) {
                e = [];
              }
              var errorList = Array.isArray(e) ? e : [e];
              if (!options.suppressWarning && errorList.length) {
                Schema2.warning("async-validator:", errorList);
              }
              if (errorList.length && rule.message !== void 0) {
                errorList = [].concat(rule.message);
              }
              var filledErrors = errorList.map(complementError(rule, source));
              if (options.first && filledErrors.length) {
                errorFields[rule.field] = 1;
                return doIt(filledErrors);
              }
              if (!deep) {
                doIt(filledErrors);
              } else {
                if (rule.required && !data.value) {
                  if (rule.message !== void 0) {
                    filledErrors = [].concat(rule.message).map(complementError(rule, source));
                  } else if (options.error) {
                    filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
                  }
                  return doIt(filledErrors);
                }
                var fieldsSchema = {};
                if (rule.defaultField) {
                  Object.keys(data.value).map(function(key) {
                    fieldsSchema[key] = rule.defaultField;
                  });
                }
                fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
                var paredFieldsSchema = {};
                Object.keys(fieldsSchema).forEach(function(field) {
                  var fieldSchema = fieldsSchema[field];
                  var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
                  paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
                });
                var schema = new Schema2(paredFieldsSchema);
                schema.messages(options.messages);
                if (data.rule.options) {
                  data.rule.options.messages = options.messages;
                  data.rule.options.error = options.error;
                }
                schema.validate(data.value, data.rule.options || options, function(errs) {
                  var finalErrors = [];
                  if (filledErrors && filledErrors.length) {
                    finalErrors.push.apply(finalErrors, filledErrors);
                  }
                  if (errs && errs.length) {
                    finalErrors.push.apply(finalErrors, errs);
                  }
                  doIt(finalErrors.length ? finalErrors : null);
                });
              }
            }
            var res;
            if (rule.asyncValidator) {
              res = rule.asyncValidator(rule, data.value, cb, data.source, options);
            } else if (rule.validator) {
              try {
                res = rule.validator(rule, data.value, cb, data.source, options);
              } catch (error) {
                console.error == null ? void 0 : console.error(error);
                if (!options.suppressValidatorError) {
                  setTimeout(function() {
                    throw error;
                  }, 0);
                }
                cb(error.message);
              }
              if (res === true) {
                cb();
              } else if (res === false) {
                cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
              } else if (res instanceof Array) {
                cb(res);
              } else if (res instanceof Error) {
                cb(res.message);
              }
            }
            if (res && res.then) {
              res.then(function() {
                return cb();
              }, function(e) {
                return cb(e);
              });
            }
          }, function(results) {
            complete(results);
          }, source);
        };
        _proto.getType = function getType2(rule) {
          if (rule.type === void 0 && rule.pattern instanceof RegExp) {
            rule.type = "pattern";
          }
          if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
            throw new Error(format("Unknown rule type %s", rule.type));
          }
          return rule.type || "string";
        };
        _proto.getValidationMethod = function getValidationMethod(rule) {
          if (typeof rule.validator === "function") {
            return rule.validator;
          }
          var keys = Object.keys(rule);
          var messageIndex = keys.indexOf("message");
          if (messageIndex !== -1) {
            keys.splice(messageIndex, 1);
          }
          if (keys.length === 1 && keys[0] === "required") {
            return validators.required;
          }
          return validators[this.getType(rule)] || void 0;
        };
        return Schema2;
      }();
      Schema.register = function register(type4, validator) {
        if (typeof validator !== "function") {
          throw new Error("Cannot register a validator by type, validator is not a function");
        }
        validators[type4] = validator;
      };
      Schema.warning = warning;
      Schema.messages = messages;
      Schema.validators = validators;
      function formItemSize(props) {
        const NForm = inject(formInjectionKey, null);
        return {
          mergedSize: computed(() => {
            if (props.size !== void 0)
              return props.size;
            if ((NForm === null || NForm === void 0 ? void 0 : NForm.props.size) !== void 0)
              return NForm.props.size;
            return "medium";
          })
        };
      }
      function formItemMisc(props) {
        const NForm = inject(formInjectionKey, null);
        const mergedLabelPlacementRef = computed(() => {
          const {
            labelPlacement
          } = props;
          if (labelPlacement !== void 0)
            return labelPlacement;
          if (NForm === null || NForm === void 0 ? void 0 : NForm.props.labelPlacement)
            return NForm.props.labelPlacement;
          return "top";
        });
        const isAutoLabelWidthRef = computed(() => {
          return mergedLabelPlacementRef.value === "left" && (props.labelWidth === "auto" || (NForm === null || NForm === void 0 ? void 0 : NForm.props.labelWidth) === "auto");
        });
        const mergedLabelWidthRef = computed(() => {
          if (mergedLabelPlacementRef.value === "top")
            return;
          const {
            labelWidth
          } = props;
          if (labelWidth !== void 0 && labelWidth !== "auto") {
            return formatLength(labelWidth);
          }
          if (isAutoLabelWidthRef.value) {
            const autoComputedWidth = NForm === null || NForm === void 0 ? void 0 : NForm.maxChildLabelWidthRef.value;
            if (autoComputedWidth !== void 0) {
              return formatLength(autoComputedWidth);
            } else {
              return void 0;
            }
          }
          if ((NForm === null || NForm === void 0 ? void 0 : NForm.props.labelWidth) !== void 0) {
            return formatLength(NForm.props.labelWidth);
          }
          return void 0;
        });
        const mergedLabelAlignRef = computed(() => {
          const {
            labelAlign
          } = props;
          if (labelAlign)
            return labelAlign;
          if (NForm === null || NForm === void 0 ? void 0 : NForm.props.labelAlign)
            return NForm.props.labelAlign;
          return void 0;
        });
        const mergedLabelStyleRef = computed(() => {
          var _a;
          return [(_a = props.labelProps) === null || _a === void 0 ? void 0 : _a.style, props.labelStyle, {
            width: mergedLabelWidthRef.value
          }];
        });
        const mergedShowRequireMarkRef = computed(() => {
          const {
            showRequireMark
          } = props;
          if (showRequireMark !== void 0)
            return showRequireMark;
          return NForm === null || NForm === void 0 ? void 0 : NForm.props.showRequireMark;
        });
        const mergedRequireMarkPlacementRef = computed(() => {
          const {
            requireMarkPlacement
          } = props;
          if (requireMarkPlacement !== void 0)
            return requireMarkPlacement;
          return (NForm === null || NForm === void 0 ? void 0 : NForm.props.requireMarkPlacement) || "right";
        });
        const validationErroredRef = ref(false);
        const validationWarnedRef = ref(false);
        const mergedValidationStatusRef = computed(() => {
          const {
            validationStatus
          } = props;
          if (validationStatus !== void 0)
            return validationStatus;
          if (validationErroredRef.value)
            return "error";
          if (validationWarnedRef.value)
            return "warning";
          return void 0;
        });
        const mergedShowFeedbackRef = computed(() => {
          const {
            showFeedback
          } = props;
          if (showFeedback !== void 0)
            return showFeedback;
          if ((NForm === null || NForm === void 0 ? void 0 : NForm.props.showFeedback) !== void 0)
            return NForm.props.showFeedback;
          return true;
        });
        const mergedShowLabelRef = computed(() => {
          const {
            showLabel
          } = props;
          if (showLabel !== void 0)
            return showLabel;
          if ((NForm === null || NForm === void 0 ? void 0 : NForm.props.showLabel) !== void 0)
            return NForm.props.showLabel;
          return true;
        });
        return {
          validationErrored: validationErroredRef,
          validationWarned: validationWarnedRef,
          mergedLabelStyle: mergedLabelStyleRef,
          mergedLabelPlacement: mergedLabelPlacementRef,
          mergedLabelAlign: mergedLabelAlignRef,
          mergedShowRequireMark: mergedShowRequireMarkRef,
          mergedRequireMarkPlacement: mergedRequireMarkPlacementRef,
          mergedValidationStatus: mergedValidationStatusRef,
          mergedShowFeedback: mergedShowFeedbackRef,
          mergedShowLabel: mergedShowLabelRef,
          isAutoLabelWidth: isAutoLabelWidthRef
        };
      }
      function formItemRule(props) {
        const NForm = inject(formInjectionKey, null);
        const compatibleRulePathRef = computed(() => {
          const {
            rulePath
          } = props;
          if (rulePath !== void 0)
            return rulePath;
          const {
            path
          } = props;
          if (path !== void 0)
            return path;
          return void 0;
        });
        const mergedRulesRef = computed(() => {
          const rules2 = [];
          const {
            rule
          } = props;
          if (rule !== void 0) {
            if (Array.isArray(rule))
              rules2.push(...rule);
            else
              rules2.push(rule);
          }
          if (NForm) {
            const {
              rules: formRules
            } = NForm.props;
            const {
              value: rulePath
            } = compatibleRulePathRef;
            if (formRules !== void 0 && rulePath !== void 0) {
              const formRule = get(formRules, rulePath);
              if (formRule !== void 0) {
                if (Array.isArray(formRule)) {
                  rules2.push(...formRule);
                } else {
                  rules2.push(formRule);
                }
              }
            }
          }
          return rules2;
        });
        const hasRequiredRuleRef = computed(() => {
          return mergedRulesRef.value.some((rule) => rule.required);
        });
        const mergedRequiredRef = computed(() => {
          return hasRequiredRuleRef.value || props.required;
        });
        return {
          mergedRules: mergedRulesRef,
          mergedRequired: mergedRequiredRef
        };
      }
      const {
        cubicBezierEaseInOut
      } = commonVariables$3;
      function fadeDownTransition({
        name = "fade-down",
        fromOffset = "-4px",
        enterDuration = ".3s",
        leaveDuration = ".3s",
        enterCubicBezier = cubicBezierEaseInOut,
        leaveCubicBezier = cubicBezierEaseInOut
      } = {}) {
        return [c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
          opacity: 0,
          transform: `translateY(${fromOffset})`
        }), c(`&.${name}-transition-enter-to, &.${name}-transition-leave-from`, {
          opacity: 1,
          transform: "translateY(0)"
        }), c(`&.${name}-transition-leave-active`, {
          transition: `opacity ${leaveDuration} ${leaveCubicBezier}, transform ${leaveDuration} ${leaveCubicBezier}`
        }), c(`&.${name}-transition-enter-active`, {
          transition: `opacity ${enterDuration} ${enterCubicBezier}, transform ${enterDuration} ${enterCubicBezier}`
        })];
      }
      const style$1 = cB("form-item", `
 display: grid;
 line-height: var(--n-line-height);
`, [cB("form-item-label", `
 grid-area: label;
 align-items: center;
 line-height: 1.25;
 text-align: var(--n-label-text-align);
 font-size: var(--n-label-font-size);
 min-height: var(--n-label-height);
 padding: var(--n-label-padding);
 color: var(--n-label-text-color);
 transition: color .3s var(--n-bezier);
 box-sizing: border-box;
 font-weight: var(--n-label-font-weight);
 `, [cE("asterisk", `
 white-space: nowrap;
 user-select: none;
 -webkit-user-select: none;
 color: var(--n-asterisk-color);
 transition: color .3s var(--n-bezier);
 `), cE("asterisk-placeholder", `
 grid-area: mark;
 user-select: none;
 -webkit-user-select: none;
 visibility: hidden; 
 `)]), cB("form-item-blank", `
 grid-area: blank;
 min-height: var(--n-blank-height);
 `), cM("auto-label-width", [cB("form-item-label", "white-space: nowrap;")]), cM("left-labelled", `
 grid-template-areas:
 "label blank"
 "label feedback";
 grid-template-columns: auto minmax(0, 1fr);
 grid-template-rows: auto 1fr;
 align-items: flex-start;
 `, [cB("form-item-label", `
 display: grid;
 grid-template-columns: 1fr auto;
 min-height: var(--n-blank-height);
 height: auto;
 box-sizing: border-box;
 flex-shrink: 0;
 flex-grow: 0;
 `, [cM("reverse-columns-space", `
 grid-template-columns: auto 1fr;
 `), cM("left-mark", `
 grid-template-areas:
 "mark text"
 ". text";
 `), cM("right-mark", `
 grid-template-areas: 
 "text mark"
 "text .";
 `), cM("right-hanging-mark", `
 grid-template-areas: 
 "text mark"
 "text .";
 `), cE("text", `
 grid-area: text; 
 `), cE("asterisk", `
 grid-area: mark; 
 align-self: end;
 `)])]), cM("top-labelled", `
 grid-template-areas:
 "label"
 "blank"
 "feedback";
 grid-template-rows: minmax(var(--n-label-height), auto) 1fr;
 grid-template-columns: minmax(0, 100%);
 `, [cM("no-label", `
 grid-template-areas:
 "blank"
 "feedback";
 grid-template-rows: 1fr;
 `), cB("form-item-label", `
 display: flex;
 align-items: flex-start;
 justify-content: var(--n-label-text-align);
 `)]), cB("form-item-blank", `
 box-sizing: border-box;
 display: flex;
 align-items: center;
 position: relative;
 `), cB("form-item-feedback-wrapper", `
 grid-area: feedback;
 box-sizing: border-box;
 min-height: var(--n-feedback-height);
 font-size: var(--n-feedback-font-size);
 line-height: 1.25;
 transform-origin: top left;
 `, [c("&:not(:empty)", `
 padding: var(--n-feedback-padding);
 `), cB("form-item-feedback", {
        transition: "color .3s var(--n-bezier)",
        color: "var(--n-feedback-text-color)"
      }, [cM("warning", {
        color: "var(--n-feedback-text-color-warning)"
      }), cM("error", {
        color: "var(--n-feedback-text-color-error)"
      }), fadeDownTransition({
        fromOffset: "-3px",
        enterDuration: ".3s",
        leaveDuration: ".2s"
      })])])]);
      var __awaiter = function(thisArg, _arguments, P, generator) {
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
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      const formItemProps = Object.assign(Object.assign({}, useTheme.props), {
        label: String,
        labelWidth: [Number, String],
        labelStyle: [String, Object],
        labelAlign: String,
        labelPlacement: String,
        path: String,
        first: Boolean,
        rulePath: String,
        required: Boolean,
        showRequireMark: {
          type: Boolean,
          default: void 0
        },
        requireMarkPlacement: String,
        showFeedback: {
          type: Boolean,
          default: void 0
        },
        rule: [Object, Array],
        size: String,
        ignorePathChange: Boolean,
        validationStatus: String,
        feedback: String,
        showLabel: {
          type: Boolean,
          default: void 0
        },
        labelProps: Object
      });
      function wrapValidator(validator, async) {
        return (...args) => {
          try {
            const validateResult = validator(...args);
            if (!async && (typeof validateResult === "boolean" || validateResult instanceof Error || Array.isArray(validateResult)) || // Error[]
            (validateResult === null || validateResult === void 0 ? void 0 : validateResult.then)) {
              return validateResult;
            } else if (validateResult === void 0) {
              return true;
            } else {
              warn$2("form-item/validate", `You return a ${typeof validateResult} typed value in the validator method, which is not recommended. Please use ` + (async ? "`Promise`" : "`boolean`, `Error` or `Promise`") + " typed value instead.");
              return true;
            }
          } catch (err) {
            warn$2("form-item/validate", "An error is catched in the validation, so the validation won't be done. Your callback in `validate` method of `n-form` or `n-form-item` won't be called in this validation.");
            console.error(err);
            return void 0;
          }
        };
      }
      const __unplugin_components_3 = /* @__PURE__ */ defineComponent({
        name: "FormItem",
        props: formItemProps,
        setup(props) {
          useInjectionInstanceCollection(formItemInstsInjectionKey, "formItems", toRef(props, "path"));
          const {
            mergedClsPrefixRef,
            inlineThemeDisabled
          } = useConfig(props);
          const NForm = inject(formInjectionKey, null);
          const formItemSizeRefs = formItemSize(props);
          const formItemMiscRefs = formItemMisc(props);
          const {
            validationErrored: validationErroredRef,
            validationWarned: validationWarnedRef
          } = formItemMiscRefs;
          const {
            mergedRequired: mergedRequiredRef,
            mergedRules: mergedRulesRef
          } = formItemRule(props);
          const {
            mergedSize: mergedSizeRef
          } = formItemSizeRefs;
          const {
            mergedLabelPlacement: labelPlacementRef,
            mergedLabelAlign: labelTextAlignRef,
            mergedRequireMarkPlacement: mergedRequireMarkPlacementRef
          } = formItemMiscRefs;
          const renderExplainsRef = ref([]);
          const feedbackIdRef = ref(createId());
          const mergedDisabledRef = NForm ? toRef(NForm.props, "disabled") : ref(false);
          const themeRef = useTheme("Form", "-form-item", style$1, formLight$1, props, mergedClsPrefixRef);
          watch(toRef(props, "path"), () => {
            if (props.ignorePathChange)
              return;
            restoreValidation();
          });
          function restoreValidation() {
            renderExplainsRef.value = [];
            validationErroredRef.value = false;
            validationWarnedRef.value = false;
            if (props.feedback) {
              feedbackIdRef.value = createId();
            }
          }
          function handleContentBlur() {
            void internalValidate("blur");
          }
          function handleContentChange() {
            void internalValidate("change");
          }
          function handleContentFocus() {
            void internalValidate("focus");
          }
          function handleContentInput() {
            void internalValidate("input");
          }
          function validate(options, callback) {
            return __awaiter(this, void 0, void 0, function* () {
              let trigger2;
              let validateCallback;
              let shouldRuleBeApplied;
              let asyncValidatorOptions;
              if (typeof options === "string") {
                trigger2 = options;
                validateCallback = callback;
              } else if (options !== null && typeof options === "object") {
                trigger2 = options.trigger;
                validateCallback = options.callback;
                shouldRuleBeApplied = options.shouldRuleBeApplied;
                asyncValidatorOptions = options.options;
              }
              return yield new Promise((resolve, reject) => {
                void internalValidate(trigger2, shouldRuleBeApplied, asyncValidatorOptions).then(({
                  valid,
                  errors,
                  warnings
                }) => {
                  if (valid) {
                    if (validateCallback) {
                      validateCallback(void 0, {
                        warnings
                      });
                    }
                    resolve({
                      warnings
                    });
                  } else {
                    if (validateCallback) {
                      validateCallback(errors, {
                        warnings
                      });
                    }
                    reject(errors);
                  }
                });
              });
            });
          }
          const internalValidate = (trigger2 = null, shouldRuleBeApplied = () => true, options = {
            suppressWarning: true
          }) => __awaiter(this, void 0, void 0, function* () {
            const {
              path
            } = props;
            if (!options) {
              options = {};
            } else {
              if (!options.first)
                options.first = props.first;
            }
            const {
              value: rules2
            } = mergedRulesRef;
            const value = NForm ? get(NForm.props.model, path || "") : void 0;
            const messageRenderers = {};
            const originalMessageRendersMessage = {};
            const activeRules = (!trigger2 ? rules2 : rules2.filter((rule) => {
              if (Array.isArray(rule.trigger)) {
                return rule.trigger.includes(trigger2);
              } else {
                return rule.trigger === trigger2;
              }
            })).filter(shouldRuleBeApplied).map((rule, i) => {
              const shallowClonedRule = Object.assign({}, rule);
              if (shallowClonedRule.validator) {
                shallowClonedRule.validator = wrapValidator(shallowClonedRule.validator, false);
              }
              if (shallowClonedRule.asyncValidator) {
                shallowClonedRule.asyncValidator = wrapValidator(shallowClonedRule.asyncValidator, true);
              }
              if (shallowClonedRule.renderMessage) {
                const rendererKey = `__renderMessage__${i}`;
                originalMessageRendersMessage[rendererKey] = shallowClonedRule.message;
                shallowClonedRule.message = rendererKey;
                messageRenderers[rendererKey] = shallowClonedRule.renderMessage;
              }
              return shallowClonedRule;
            });
            const activeErrorRules = activeRules.filter((r) => r.level !== "warning");
            const activeWarningRules = activeRules.filter((r) => r.level === "warning");
            const mergedPath = path !== null && path !== void 0 ? path : "__n_no_path__";
            const validator = new Schema({
              [mergedPath]: activeErrorRules
            });
            const warningValidator = new Schema({
              [mergedPath]: activeWarningRules
            });
            const {
              validateMessages
            } = (NForm === null || NForm === void 0 ? void 0 : NForm.props) || {};
            if (validateMessages) {
              validator.messages(validateMessages);
              warningValidator.messages(validateMessages);
            }
            const renderMessages = (errors) => {
              renderExplainsRef.value = errors.map((error) => {
                const transformedMessage = (error === null || error === void 0 ? void 0 : error.message) || "";
                return {
                  key: transformedMessage,
                  render: () => {
                    if (transformedMessage.startsWith("__renderMessage__")) {
                      return messageRenderers[transformedMessage]();
                    }
                    return transformedMessage;
                  }
                };
              });
              errors.forEach((error) => {
                var _a;
                if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.startsWith("__renderMessage__")) {
                  error.message = originalMessageRendersMessage[error.message];
                }
              });
            };
            const validationResult = {
              valid: true,
              errors: void 0,
              warnings: void 0
            };
            if (activeErrorRules.length) {
              const errors = yield new Promise((resolve) => {
                void validator.validate({
                  [mergedPath]: value
                }, options, resolve);
              });
              if (errors === null || errors === void 0 ? void 0 : errors.length) {
                validationErroredRef.value = true;
                validationResult.valid = false;
                validationResult.errors = errors;
                renderMessages(errors);
              }
            }
            if (activeWarningRules.length && !validationResult.errors) {
              const warnings = yield new Promise((resolve) => {
                void warningValidator.validate({
                  [mergedPath]: value
                }, options, resolve);
              });
              if (warnings === null || warnings === void 0 ? void 0 : warnings.length) {
                renderMessages(warnings);
                validationWarnedRef.value = true;
                validationResult.warnings = warnings;
              }
            }
            if (activeErrorRules.length + activeWarningRules.length > 0 && !validationResult.errors && !validationResult.warnings) {
              restoreValidation();
            }
            return validationResult;
          });
          provide(formItemInjectionKey, {
            path: toRef(props, "path"),
            disabled: mergedDisabledRef,
            mergedSize: formItemSizeRefs.mergedSize,
            mergedValidationStatus: formItemMiscRefs.mergedValidationStatus,
            restoreValidation,
            handleContentBlur,
            handleContentChange,
            handleContentFocus,
            handleContentInput
          });
          const exposedRef = {
            validate,
            restoreValidation,
            internalValidate
          };
          const labelElementRef = ref(null);
          onMounted(() => {
            if (!formItemMiscRefs.isAutoLabelWidth.value)
              return;
            const labelElement = labelElementRef.value;
            if (labelElement !== null) {
              const memoizedWhitespace = labelElement.style.whiteSpace;
              labelElement.style.whiteSpace = "nowrap";
              labelElement.style.width = "";
              NForm === null || NForm === void 0 ? void 0 : NForm.deriveMaxChildLabelWidth(Number(getComputedStyle(labelElement).width.slice(0, -2)));
              labelElement.style.whiteSpace = memoizedWhitespace;
            }
          });
          const cssVarsRef = computed(() => {
            var _a;
            const {
              value: size2
            } = mergedSizeRef;
            const {
              value: labelPlacement
            } = labelPlacementRef;
            const direction = labelPlacement === "top" ? "vertical" : "horizontal";
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2
              },
              self: {
                labelTextColor,
                asteriskColor,
                lineHeight: lineHeight2,
                feedbackTextColor,
                feedbackTextColorWarning,
                feedbackTextColorError,
                feedbackPadding,
                labelFontWeight,
                [createKey("labelHeight", size2)]: labelHeight,
                [createKey("blankHeight", size2)]: blankHeight,
                [createKey("feedbackFontSize", size2)]: feedbackFontSize,
                [createKey("feedbackHeight", size2)]: feedbackHeight,
                [createKey("labelPadding", direction)]: labelPadding,
                [createKey("labelTextAlign", direction)]: labelTextAlign,
                [createKey(createKey("labelFontSize", labelPlacement), size2)]: labelFontSize
              }
            } = themeRef.value;
            let mergedLabelTextAlign = (_a = labelTextAlignRef.value) !== null && _a !== void 0 ? _a : labelTextAlign;
            if (labelPlacement === "top") {
              mergedLabelTextAlign = mergedLabelTextAlign === "right" ? "flex-end" : "flex-start";
            }
            const cssVars = {
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-line-height": lineHeight2,
              "--n-blank-height": blankHeight,
              "--n-label-font-size": labelFontSize,
              "--n-label-text-align": mergedLabelTextAlign,
              "--n-label-height": labelHeight,
              "--n-label-padding": labelPadding,
              "--n-label-font-weight": labelFontWeight,
              "--n-asterisk-color": asteriskColor,
              "--n-label-text-color": labelTextColor,
              "--n-feedback-padding": feedbackPadding,
              "--n-feedback-font-size": feedbackFontSize,
              "--n-feedback-height": feedbackHeight,
              "--n-feedback-text-color": feedbackTextColor,
              "--n-feedback-text-color-warning": feedbackTextColorWarning,
              "--n-feedback-text-color-error": feedbackTextColorError
            };
            return cssVars;
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("form-item", computed(() => {
            var _a;
            return `${mergedSizeRef.value[0]}${labelPlacementRef.value[0]}${((_a = labelTextAlignRef.value) === null || _a === void 0 ? void 0 : _a[0]) || ""}`;
          }), cssVarsRef, props) : void 0;
          const reverseColSpaceRef = computed(() => {
            return labelPlacementRef.value === "left" && mergedRequireMarkPlacementRef.value === "left" && labelTextAlignRef.value === "left";
          });
          return Object.assign(Object.assign(Object.assign(Object.assign({
            labelElementRef,
            mergedClsPrefix: mergedClsPrefixRef,
            mergedRequired: mergedRequiredRef,
            feedbackId: feedbackIdRef,
            renderExplains: renderExplainsRef,
            reverseColSpace: reverseColSpaceRef
          }, formItemMiscRefs), formItemSizeRefs), exposedRef), {
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          });
        },
        render() {
          const {
            $slots,
            mergedClsPrefix,
            mergedShowLabel,
            mergedShowRequireMark,
            mergedRequireMarkPlacement,
            onRender
          } = this;
          const renderedShowRequireMark = mergedShowRequireMark !== void 0 ? mergedShowRequireMark : this.mergedRequired;
          onRender === null || onRender === void 0 ? void 0 : onRender();
          const renderLabel = () => {
            const labelText = this.$slots.label ? this.$slots.label() : this.label;
            if (!labelText)
              return null;
            const textNode = h("span", {
              class: `${mergedClsPrefix}-form-item-label__text`
            }, labelText);
            const markNode = renderedShowRequireMark ? h("span", {
              class: `${mergedClsPrefix}-form-item-label__asterisk`
            }, mergedRequireMarkPlacement !== "left" ? " *" : "* ") : mergedRequireMarkPlacement === "right-hanging" && h("span", {
              class: `${mergedClsPrefix}-form-item-label__asterisk-placeholder`
            }, " *");
            const {
              labelProps
            } = this;
            return h("label", Object.assign({}, labelProps, {
              class: [labelProps === null || labelProps === void 0 ? void 0 : labelProps.class, `${mergedClsPrefix}-form-item-label`, `${mergedClsPrefix}-form-item-label--${mergedRequireMarkPlacement}-mark`, this.reverseColSpace && `${mergedClsPrefix}-form-item-label--reverse-columns-space`],
              style: this.mergedLabelStyle,
              ref: "labelElementRef"
            }), mergedRequireMarkPlacement === "left" ? [markNode, textNode] : [textNode, markNode]);
          };
          return h("div", {
            class: [`${mergedClsPrefix}-form-item`, this.themeClass, `${mergedClsPrefix}-form-item--${this.mergedSize}-size`, `${mergedClsPrefix}-form-item--${this.mergedLabelPlacement}-labelled`, this.isAutoLabelWidth && `${mergedClsPrefix}-form-item--auto-label-width`, !mergedShowLabel && `${mergedClsPrefix}-form-item--no-label`],
            style: this.cssVars
          }, mergedShowLabel && renderLabel(), h("div", {
            class: [`${mergedClsPrefix}-form-item-blank`, this.mergedValidationStatus && `${mergedClsPrefix}-form-item-blank--${this.mergedValidationStatus}`]
          }, $slots), this.mergedShowFeedback ? h("div", {
            key: this.feedbackId,
            class: `${mergedClsPrefix}-form-item-feedback-wrapper`
          }, h(Transition, {
            name: "fade-down-transition",
            mode: "out-in"
          }, {
            default: () => {
              const {
                mergedValidationStatus
              } = this;
              return resolveWrappedSlot($slots.feedback, (children) => {
                var _a;
                const {
                  feedback
                } = this;
                const feedbackNodes = children || feedback ? h("div", {
                  key: "__feedback__",
                  class: `${mergedClsPrefix}-form-item-feedback__line`
                }, children || feedback) : this.renderExplains.length ? (_a = this.renderExplains) === null || _a === void 0 ? void 0 : _a.map(({
                  key,
                  render: render2
                }) => h("div", {
                  key,
                  class: `${mergedClsPrefix}-form-item-feedback__line`
                }, render2())) : null;
                return feedbackNodes ? mergedValidationStatus === "warning" ? h("div", {
                  key: "controlled-warning",
                  class: `${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--warning`
                }, feedbackNodes) : mergedValidationStatus === "error" ? h("div", {
                  key: "controlled-error",
                  class: `${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--error`
                }, feedbackNodes) : mergedValidationStatus === "success" ? h("div", {
                  key: "controlled-success",
                  class: `${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--success`
                }, feedbackNodes) : h("div", {
                  key: "controlled-default",
                  class: `${mergedClsPrefix}-form-item-feedback`
                }, feedbackNodes) : null;
              });
            }
          })) : null);
        }
      });
      const self$1 = (vars) => {
        const {
          textColor2,
          cardColor,
          modalColor,
          popoverColor,
          dividerColor,
          borderRadius,
          fontSize: fontSize2,
          hoverColor
        } = vars;
        return {
          textColor: textColor2,
          color: cardColor,
          colorHover: hoverColor,
          colorModal: modalColor,
          colorHoverModal: composite(modalColor, hoverColor),
          colorPopover: popoverColor,
          colorHoverPopover: composite(popoverColor, hoverColor),
          borderColor: dividerColor,
          borderColorModal: composite(modalColor, dividerColor),
          borderColorPopover: composite(popoverColor, dividerColor),
          borderRadius,
          fontSize: fontSize2
        };
      };
      const listLight = {
        name: "List",
        common: commonLight,
        self: self$1
      };
      const listLight$1 = listLight;
      const style = c([cB("list", `
 --n-merged-border-color: var(--n-border-color);
 --n-merged-color: var(--n-color);
 --n-merged-color-hover: var(--n-color-hover);
 margin: 0;
 font-size: var(--n-font-size);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 padding: 0;
 list-style-type: none;
 color: var(--n-text-color);
 background-color: var(--n-merged-color);
 `, [cM("show-divider", [cB("list-item", [c("&:not(:last-child)", [cE("divider", `
 background-color: var(--n-merged-border-color);
 `)])])]), cM("clickable", [cB("list-item", `
 cursor: pointer;
 `)]), cM("bordered", `
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `), cM("hoverable", [cB("list-item", `
 border-radius: var(--n-border-radius);
 `, [c("&:hover", `
 background-color: var(--n-merged-color-hover);
 `, [cE("divider", `
 background-color: transparent;
 `)])])]), cM("bordered, hoverable", [cB("list-item", `
 padding: 12px 20px;
 `), cE("header, footer", `
 padding: 12px 20px;
 `)]), cE("header, footer", `
 padding: 12px 0;
 box-sizing: border-box;
 transition: border-color .3s var(--n-bezier);
 `, [c("&:not(:last-child)", `
 border-bottom: 1px solid var(--n-merged-border-color);
 `)]), cB("list-item", `
 position: relative;
 padding: 12px 0; 
 box-sizing: border-box;
 display: flex;
 flex-wrap: nowrap;
 align-items: center;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `, [cE("prefix", `
 margin-right: 20px;
 flex: 0;
 `), cE("suffix", `
 margin-left: 20px;
 flex: 0;
 `), cE("main", `
 flex: 1;
 `), cE("divider", `
 height: 1px;
 position: absolute;
 bottom: 0;
 left: 0;
 right: 0;
 background-color: transparent;
 transition: background-color .3s var(--n-bezier);
 pointer-events: none;
 `)])]), insideModal(cB("list", `
 --n-merged-color-hover: var(--n-color-hover-modal);
 --n-merged-color: var(--n-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `)), insidePopover(cB("list", `
 --n-merged-color-hover: var(--n-color-hover-popover);
 --n-merged-color: var(--n-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `))]);
      const listProps = Object.assign(Object.assign({}, useTheme.props), {
        size: {
          type: String,
          default: "medium"
        },
        bordered: Boolean,
        clickable: Boolean,
        hoverable: Boolean,
        showDivider: {
          type: Boolean,
          default: true
        }
      });
      const listInjectionKey = createInjectionKey("n-list");
      const __unplugin_components_10 = /* @__PURE__ */ defineComponent({
        name: "List",
        props: listProps,
        setup(props) {
          const {
            mergedClsPrefixRef,
            inlineThemeDisabled,
            mergedRtlRef
          } = useConfig(props);
          const rtlEnabledRef = useRtl("List", mergedRtlRef, mergedClsPrefixRef);
          const themeRef = useTheme("List", "-list", style, listLight$1, props, mergedClsPrefixRef);
          provide(listInjectionKey, {
            showDividerRef: toRef(props, "showDivider"),
            mergedClsPrefixRef
          });
          const cssVarsRef = computed(() => {
            const {
              common: {
                cubicBezierEaseInOut: cubicBezierEaseInOut2
              },
              self: {
                fontSize: fontSize2,
                textColor,
                color,
                colorModal,
                colorPopover,
                borderColor,
                borderColorModal,
                borderColorPopover,
                borderRadius,
                colorHover,
                colorHoverModal,
                colorHoverPopover
              }
            } = themeRef.value;
            return {
              "--n-font-size": fontSize2,
              "--n-bezier": cubicBezierEaseInOut2,
              "--n-text-color": textColor,
              "--n-color": color,
              "--n-border-radius": borderRadius,
              "--n-border-color": borderColor,
              "--n-border-color-modal": borderColorModal,
              "--n-border-color-popover": borderColorPopover,
              "--n-color-modal": colorModal,
              "--n-color-popover": colorPopover,
              "--n-color-hover": colorHover,
              "--n-color-hover-modal": colorHoverModal,
              "--n-color-hover-popover": colorHoverPopover
            };
          });
          const themeClassHandle = inlineThemeDisabled ? useThemeClass("list", void 0, cssVarsRef, props) : void 0;
          return {
            mergedClsPrefix: mergedClsPrefixRef,
            rtlEnabled: rtlEnabledRef,
            cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
            themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
            onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
          };
        },
        render() {
          var _a;
          const {
            $slots,
            mergedClsPrefix,
            onRender
          } = this;
          onRender === null || onRender === void 0 ? void 0 : onRender();
          return h("ul", {
            class: [`${mergedClsPrefix}-list`, this.rtlEnabled && `${mergedClsPrefix}-list--rtl`, this.bordered && `${mergedClsPrefix}-list--bordered`, this.showDivider && `${mergedClsPrefix}-list--show-divider`, this.hoverable && `${mergedClsPrefix}-list--hoverable`, this.clickable && `${mergedClsPrefix}-list--clickable`, this.themeClass],
            style: this.cssVars
          }, $slots.header ? h("div", {
            class: `${mergedClsPrefix}-list__header`
          }, $slots.header()) : null, (_a = $slots.default) === null || _a === void 0 ? void 0 : _a.call($slots), $slots.footer ? h("div", {
            class: `${mergedClsPrefix}-list__footer`
          }, $slots.footer()) : null);
        }
      });
      const __unplugin_components_9 = /* @__PURE__ */ defineComponent({
        name: "ListItem",
        setup() {
          const listInjection = inject(listInjectionKey, null);
          if (!listInjection) {
            throwError("list-item", "`n-list-item` must be placed in `n-list`.");
          }
          return {
            showDivider: listInjection.showDividerRef,
            mergedClsPrefix: listInjection.mergedClsPrefixRef
          };
        },
        render() {
          const {
            $slots,
            mergedClsPrefix
          } = this;
          return h("li", {
            class: `${mergedClsPrefix}-list-item`
          }, $slots.prefix ? h("div", {
            class: `${mergedClsPrefix}-list-item__prefix`
          }, $slots.prefix()) : null, $slots.default ? h("div", {
            class: `${mergedClsPrefix}-list-item__main`
          }, $slots) : null, $slots.suffix ? h("div", {
            class: `${mergedClsPrefix}-list-item__suffix`
          }, $slots.suffix()) : null, this.showDivider && h("div", {
            class: `${mergedClsPrefix}-list-item__divider`
          }));
        }
      });
      const _hoisted_1$2 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        viewBox: "0 0 512 512"
      };
      const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode(
        "path",
        {
          d: "M262.29 192.31a64 64 0 1 0 57.4 57.4a64.13 64.13 0 0 0-57.4-57.4zM416.39 256a154.34 154.34 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.48 164.48 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22a155.3 155.3 0 0 1-21.46-12.57a16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.48 164.48 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22a155.3 155.3 0 0 1 21.46 12.57a16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47z",
          fill: "none",
          stroke: "currentColor",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "32"
        },
        null,
        -1
        /* HOISTED */
      );
      const _hoisted_3 = [_hoisted_2$1];
      const SettingsOutline = /* @__PURE__ */ defineComponent({
        name: "SettingsOutline",
        render: function render2(_ctx, _cache) {
          return openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_3);
        }
      });
      const _hoisted_1$1 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        viewBox: "0 0 512 512"
      };
      const _hoisted_2 = /* @__PURE__ */ createStaticVNode('<path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" fill="currentColor"></path><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M184 176l8 224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M328 176l-8 224"></path>', 6);
      const _hoisted_8 = [_hoisted_2];
      const TrashOutline = /* @__PURE__ */ defineComponent({
        name: "TrashOutline",
        render: function render2(_ctx, _cache) {
          return openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_8);
        }
      });
      var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
      var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
      const defaultStore = {
        promptCommands: [
          {
            command: "test",
            prompt: "Describe a world where gravity doesn't exist."
          }
        ]
      };
      const getStore = () => _GM_getValue("store", defaultStore);
      const setStore = (store2) => _GM_setValue("store", store2);
      let store = getStore();
      const getPromptCommands = () => store.promptCommands;
      const setPromptCommands = (commands) => {
        store.promptCommands = commands;
        setStore(store);
      };
      const Store = {
        getPromptCommands,
        setPromptCommands
      };
      const _hoisted_1 = { style: { "white-space": "pre-wrap" } };
      const _sfc_main$1 = /* @__PURE__ */ defineComponent({
        __name: "CommandEditor",
        setup(__props) {
          const promptCommands = ref([...Store.getPromptCommands()]);
          const formRef = ref();
          const model = ref({ command: "", prompt: "" });
          const rules2 = {
            command: [
              {
                required: true,
                validator(_rule, value) {
                  value = value.trim();
                  if (value[0] === "/") {
                    value = value.substring(1);
                  }
                  if (value.length === 0) {
                    return new Error("Command should not be empty");
                  } else if (value.includes(" ")) {
                    return new Error("Command should not contain space");
                  } else if (promptCommands.value.findIndex((it) => it.command === value) !== -1) {
                    return new Error("Command already exist");
                  }
                  return true;
                },
                trigger: ["input", "blur"]
              }
            ],
            prompt: [
              {
                required: true,
                validator(_rule, value) {
                  value = value.trim();
                  if (value.length === 0) {
                    return new Error("Prompt should not be empty");
                  }
                  return true;
                },
                trigger: ["input", "blur"]
              }
            ]
          };
          const addCommand = async (command, prompt) => {
            var _a;
            await ((_a = formRef.value) == null ? void 0 : _a.validate());
            command = command.trim();
            if (command[0] === "/") {
              command = command.substring(1);
            }
            prompt = prompt.trimStart();
            promptCommands.value.push({ command, prompt });
            Store.setPromptCommands(promptCommands.value);
          };
          const deleteCommand = (command) => {
            promptCommands.value = promptCommands.value.filter(
              (it) => it.command !== command
            );
            Store.setPromptCommands(promptCommands.value);
          };
          return (_ctx, _cache) => {
            const _component_n_input_group_label = __unplugin_components_0;
            const _component_n_input = __unplugin_components_1;
            const _component_n_input_group = __unplugin_components_2;
            const _component_n_form_item = __unplugin_components_3;
            const _component_n_form = __unplugin_components_4;
            const _component_n_button = __unplugin_components_5;
            const _component_n_divider = __unplugin_components_6;
            const _component_n_icon = NIcon;
            const _component_n_flex = __unplugin_components_8;
            const _component_n_list_item = __unplugin_components_9;
            const _component_n_list = __unplugin_components_10;
            const _component_n_drawer_content = __unplugin_components_11;
            const _component_n_drawer = __unplugin_components_12;
            return openBlock(), createBlock(_component_n_drawer, {
              width: 500,
              placement: "right",
              "auto-focus": false
            }, {
              default: withCtx(() => [
                createVNode(_component_n_drawer_content, { title: "Prompt Commands" }, {
                  default: withCtx(() => [
                    createVNode(_component_n_form, {
                      ref_key: "formRef",
                      ref: formRef,
                      model: unref(model),
                      rules: rules2,
                      "show-label": false
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_n_form_item, { path: "command" }, {
                          default: withCtx(() => [
                            createVNode(_component_n_input_group, null, {
                              default: withCtx(() => [
                                createVNode(_component_n_input_group_label, null, {
                                  default: withCtx(() => [
                                    createTextVNode("/")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_n_input, {
                                  value: unref(model).command,
                                  "onUpdate:value": _cache[0] || (_cache[0] = ($event) => unref(model).command = $event),
                                  placeholder: "Command",
                                  "input-props": { spellcheck: false }
                                }, null, 8, ["value"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_n_form_item, { path: "prompt" }, {
                          default: withCtx(() => [
                            createVNode(_component_n_input, {
                              value: unref(model).prompt,
                              "onUpdate:value": _cache[1] || (_cache[1] = ($event) => unref(model).prompt = $event),
                              placeholder: "Prompt",
                              "input-props": { spellcheck: false },
                              type: "textarea",
                              autosize: "",
                              "show-count": ""
                            }, null, 8, ["value"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["model"]),
                    createBaseVNode("div", null, [
                      createVNode(_component_n_button, {
                        onClick: _cache[2] || (_cache[2] = ($event) => addCommand(unref(model).command, unref(model).prompt))
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Add ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_component_n_divider),
                    createVNode(_component_n_list, null, {
                      default: withCtx(() => [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(promptCommands), (pc) => {
                          return openBlock(), createBlock(_component_n_list_item, null, {
                            default: withCtx(() => [
                              createVNode(_component_n_flex, { justify: "space-between" }, {
                                default: withCtx(() => [
                                  createBaseVNode("b", null, "/" + toDisplayString(pc.command), 1),
                                  createVNode(_component_n_button, {
                                    secondary: "",
                                    type: "error",
                                    size: "small",
                                    onClick: ($event) => deleteCommand(pc.command)
                                  }, {
                                    icon: withCtx(() => [
                                      createVNode(_component_n_icon, { component: unref(TrashOutline) }, null, 8, ["component"])
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])
                                ]),
                                _: 2
                              }, 1024),
                              createBaseVNode("span", _hoisted_1, toDisplayString(pc.prompt), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 256))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            });
          };
        }
      });
      const _sfc_main = /* @__PURE__ */ defineComponent({
        __name: "App",
        setup(__props) {
          const showCommandEditor = ref(false);
          const registClickHandle = () => {
            const root2 = document.getElementById("cpe-b");
            if (!root2)
              return;
            root2.onclick = () => {
              showCommandEditor.value = !showCommandEditor.value;
            };
          };
          registClickHandle();
          return (_ctx, _cache) => {
            const _component_n_icon = NIcon;
            return openBlock(), createElementBlock(Fragment, null, [
              createVNode(_component_n_icon, {
                component: unref(SettingsOutline),
                size: 20
              }, null, 8, ["component"]),
              createVNode(_sfc_main$1, {
                show: unref(showCommandEditor),
                "onUpdate:show": _cache[0] || (_cache[0] = ($event) => isRef(showCommandEditor) ? showCommandEditor.value = $event : null)
              }, null, 8, ["show"])
            ], 64);
          };
        }
      });
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      const repeat = async (interval, callback) => {
        while (true) {
          await delay(interval);
          await callback();
        }
      };
      const observeUserInput = async () => {
        let content = "";
        return repeat(200, () => {
          const input = document.querySelector("div[enterkeyhint='enter']");
          if (input !== null) {
            const newContent = input.textContent;
            if (newContent !== null && newContent !== content) {
              content = newContent;
              for (const pc of Store.getPromptCommands()) {
                if (content.trimStart() === `/${pc.command} `) {
                  applyCommand(input, pc.prompt);
                  break;
                }
              }
            }
          }
        });
      };
      const applyCommand = (input, prompt) => {
        input.innerHTML = prompt.split("\n").map((it) => `<p>${it}</p>`).join("\n");
        const sel = window.getSelection();
        if (sel !== null) {
          sel.removeAllRanges();
          const range2 = document.createRange();
          range2.selectNodeContents(input);
          range2.collapse(false);
          sel.addRange(range2);
        }
      };
      const CommandService = {
        observeUserInput
      };
      CommandService.observeUserInput();
      const apps = {};
      const mountApp = (id, app) => {
        var _a;
        (_a = apps[id]) == null ? void 0 : _a.unmount();
        apps[id] = app;
        return app.mount("#" + id);
      };
      const addButtonToHeader = () => {
        var _a, _b, _c;
        const id = "cpe-b";
        if (document.getElementById(id))
          return;
        const target = (_c = (_b = (_a = document.getElementsByClassName("fixed top-2.5 z-10").item(0)) == null ? void 0 : _a.getElementsByTagName("button")) == null ? void 0 : _b.item(0)) == null ? void 0 : _c.parentElement;
        if (!target)
          return;
        const classes = "inline-flex items-center justify-center relative ring-offset-2 ring-offset-bg-300 ring-accent-main-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none text-text-200 transition-all font-styrene active:bg-bg-400 hover:bg-bg-300 hover:text-text-100 h-11 w-11 rounded-[0.6rem] active:scale-95 !rounded-full relative".split(
          " "
        );
        const button = document.createElement("button");
        button.classList.add(...classes);
        button.setAttribute("id", id);
        if (target.children.length >= 2) {
          target.append(button);
        } else {
          target.prepend(button);
        }
        const app = createApp(_sfc_main);
        mountApp(id, app);
      };
      repeat(1e3, () => {
        addButtonToHeader();
      });
    }
  });
  require_main_001();

})();