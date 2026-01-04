// ==UserScript==
// @name         更好的我来导出
// @namespace    https://shenzilong.cn/
// @version      1.0.3
// @description  从我来导出markdown 文档
// @author       崮生 admin@shenzilong.cn
// @include      https://www.wolai.com/*
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/414714/%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%88%91%E6%9D%A5%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/414714/%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%88%91%E6%9D%A5%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
// 这些代码都来自github actions 编译后的代码，不编译版本体积太大，不放心的欢迎去 https://github.com/2234839/userJS 审查代码, 

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./更好的我来导出/index.user.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js ***!
  \*********************************************************************/
/*! exports provided: ITERATE_KEY, computed, customRef, effect, enableTracking, isProxy, isReactive, isReadonly, isRef, markRaw, pauseTracking, proxyRefs, reactive, readonly, ref, resetTracking, shallowReactive, shallowReadonly, shallowRef, stop, toRaw, toRef, toRefs, track, trigger, triggerRef, unref */
/*! exports used: computed, effect, isProxy, isReactive, isRef, pauseTracking, proxyRefs, reactive, ref, resetTracking, shallowReactive, shallowReadonly, stop, toRaw, track, trigger, unref */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ITERATE_KEY */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return computed; });
/* unused harmony export customRef */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return effect; });
/* unused harmony export enableTracking */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isReactive; });
/* unused harmony export isReadonly */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isRef; });
/* unused harmony export markRaw */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return pauseTracking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return proxyRefs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return reactive; });
/* unused harmony export readonly */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return ref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return resetTracking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return shallowReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return shallowReadonly; });
/* unused harmony export shallowRef */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return toRaw; });
/* unused harmony export toRef */
/* unused harmony export toRefs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return track; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return trigger; });
/* unused harmony export triggerRef */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return unref; });
/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");


const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol(( true) ? 'iterate' : undefined);
const MAP_KEY_ITERATE_KEY = Symbol(( true) ? 'Map key iterate' : undefined);
function isEffect(fn) {
    return fn && fn._isEffect === true;
}
function effect(fn, options = _vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* EMPTY_OBJ */ "b"]) {
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
let uid = 0;
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effect.active) {
            return options.scheduler ? undefined : fn();
        }
        if (!effectStack.includes(effect)) {
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            }
            finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function cleanup(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}
function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (( true) && activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            });
        }
    }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    const effects = new Set();
    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect) {
                    effects.add(effect);
                }
            });
        }
    };
    if (type === "clear" /* CLEAR */) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add);
    }
    else if (key === 'length' && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE | Map.SET
        const shouldTriggerIteration = (type === "add" /* ADD */ &&
            (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isIntegerKey */ "r"])(key))) ||
            (type === "delete" /* DELETE */ && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target));
        if (shouldTriggerIteration ||
            (type === "set" /* SET */ && target instanceof Map)) {
            add(depsMap.get(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target) ? 'length' : ITERATE_KEY));
        }
        if (shouldTriggerIteration && target instanceof Map) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY));
        }
    }
    const run = (effect) => {
        if (( true) && effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        }
        else {
            effect();
        }
    };
    effects.forEach(run);
}

const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isSymbol */ "A"]));
const get = /*#__PURE__*/ createGetter();
const shallowGet = /*#__PURE__*/ createGetter(false, true);
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
const arrayInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    arrayInstrumentations[key] = function (...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
            track(arr, "get" /* GET */, i + '');
        }
        // we run the method using the original args first (which may be reactive)
        const res = arr[key](...args);
        if (res === -1 || res === false) {
            // if that didn't work, run it again using raw values.
            return arr[key](...args.map(toRaw));
        }
        else {
            return res;
        }
    };
});
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* RAW */ &&
            receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)) {
            return target;
        }
        const targetIsArray = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target);
        if (targetIsArray && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasOwn */ "k"])(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        const keyIsSymbol = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isSymbol */ "A"])(key);
        if (keyIsSymbol
            ? builtInSymbols.has(key)
            : key === `__proto__` || key === `__v_isRef`) {
            return res;
        }
        if (!isReadonly) {
            track(target, "get" /* GET */, key);
        }
        if (shallow) {
            return res;
        }
        if (isRef(res)) {
            // ref unwrapping - does not apply for Array + integer key.
            const shouldUnwrap = !targetIsArray || !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isIntegerKey */ "r"])(key);
            return shouldUnwrap ? res.value : res;
        }
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isObject */ "t"])(res)) {
            // Convert returned value into a proxy as well. we do the isObject check
            // here to avoid invalid value warning. Also need to lazy access readonly
            // and reactive here to avoid circular dependency.
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        const oldValue = target[key];
        if (!shallow) {
            value = toRaw(value);
            if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(target) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isIntegerKey */ "r"])(key)
            ? Number(key) < target.length
            : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasOwn */ "k"])(target, key);
        const result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, "add" /* ADD */, key, value);
            }
            else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasChanged */ "j"])(value, oldValue)) {
                trigger(target, "set" /* SET */, key, value, oldValue);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasOwn */ "k"])(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isSymbol */ "A"])(key) || !builtInSymbols.has(key)) {
        track(target, "has" /* HAS */, key);
    }
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        if ((true)) {
            console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    },
    deleteProperty(target, key) {
        if ((true)) {
            console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
    }
};
const shallowReactiveHandlers = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* extend */ "h"])({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
});
// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
const shallowReadonlyHandlers = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* extend */ "h"])({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

const toReactive = (value) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isObject */ "t"])(value) ? reactive(value) : value;
const toReadonly = (value) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isObject */ "t"])(value) ? readonly(value) : value;
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
    // #1772: readonly(reactive(Map)) should return readonly + reactive version
    // of the value
    target = target["__v_raw" /* RAW */];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        !isReadonly && track(rawTarget, "get" /* GET */, key);
    }
    !isReadonly && track(rawTarget, "get" /* GET */, rawKey);
    const { has } = getProto(rawTarget);
    const wrap = isReadonly ? toReadonly : isShallow ? toShallow : toReactive;
    if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
    }
    else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
    }
}
function has$1(key, isReadonly = false) {
    const target = this["__v_raw" /* RAW */];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
        !isReadonly && track(rawTarget, "has" /* HAS */, key);
    }
    !isReadonly && track(rawTarget, "has" /* HAS */, rawKey);
    return key === rawKey
        ? target.has(key)
        : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
    target = target["__v_raw" /* RAW */];
    !isReadonly && track(toRaw(target), "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.get(target, 'size', target);
}
function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    const result = proto.add.call(target, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, value, value);
    }
    return result;
}
function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has, get, set } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else if ((true)) {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get.call(target, key);
    const result = set.call(target, key, value);
    if (!hadKey) {
        trigger(target, "add" /* ADD */, key, value);
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasChanged */ "j"])(value, oldValue)) {
        trigger(target, "set" /* SET */, key, value, oldValue);
    }
    return result;
}
function deleteEntry(key) {
    const target = toRaw(this);
    const { has, get, delete: del } = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    }
    else if ((true)) {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get ? get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    const result = del.call(target, key);
    if (hadKey) {
        trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
    }
    return result;
}
function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = ( true)
        ? target instanceof Map
            ? new Map(target)
            : new Set(target)
        : undefined;
    // forward the operation before queueing reactions
    const result = getProto(target).clear.call(target);
    if (hadItems) {
        trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
    }
    return result;
}
function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw" /* RAW */];
        const rawTarget = toRaw(target);
        const wrap = isReadonly ? toReadonly : isShallow ? toShallow : toReactive;
        !isReadonly && track(rawTarget, "iterate" /* ITERATE */, ITERATE_KEY);
        return target.forEach((value, key) => {
            // important: make sure the callback is
            // 1. invoked with the reactive map as `this` and 3rd arg
            // 2. the value received should be a corresponding reactive/readonly.
            return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
    };
}
function createIterableMethod(method, isReadonly, isShallow) {
    return function (...args) {
        const target = this["__v_raw" /* RAW */];
        const rawTarget = toRaw(target);
        const isMap = rawTarget instanceof Map;
        const isPair = method === 'entries' || (method === Symbol.iterator && isMap);
        const isKeyOnly = method === 'keys' && isMap;
        const innerIterator = target[method](...args);
        const wrap = isReadonly ? toReadonly : isShallow ? toShallow : toReactive;
        !isReadonly &&
            track(rawTarget, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        // return a wrapped iterator which returns observed versions of the
        // values emitted from the real iterator
        return {
            // iterator protocol
            next() {
                const { value, done } = innerIterator.next();
                return done
                    ? { value, done }
                    : {
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
    return function (...args) {
        if ((true)) {
            const key = args[0] ? `on key "${args[0]}" ` : ``;
            console.warn(`${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* capitalize */ "f"])(type)} operation ${key}failed: target is readonly.`, toRaw(this));
        }
        return type === "delete" /* DELETE */ ? false : this;
    };
}
const mutableInstrumentations = {
    get(key) {
        return get$1(this, key);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
};
const shallowInstrumentations = {
    get(key) {
        return get$1(this, key, false, true);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
};
const readonlyInstrumentations = {
    get(key) {
        return get$1(this, key, true);
    },
    get size() {
        return size(this, true);
    },
    has(key) {
        return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add" /* ADD */),
    set: createReadonlyMethod("set" /* SET */),
    delete: createReadonlyMethod("delete" /* DELETE */),
    clear: createReadonlyMethod("clear" /* CLEAR */),
    forEach: createForEach(true, false)
};
const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
iteratorMethods.forEach(method => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
});
function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow
        ? shallowInstrumentations
        : isReadonly
            ? readonlyInstrumentations
            : mutableInstrumentations;
    return (target, key, receiver) => {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        else if (key === "__v_raw" /* RAW */) {
            return target;
        }
        return Reflect.get(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasOwn */ "k"])(instrumentations, key) && key in target
            ? instrumentations
            : target, key, receiver);
    };
}
const mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
        const type = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* toRawType */ "I"])(target);
        console.warn(`Reactive ${type} contains both the raw and reactive ` +
            `versions of the same object${type === `Map` ? `as keys` : ``}, ` +
            `which can lead to inconsistencies. ` +
            `Avoid differentiating between the raw and reactive versions ` +
            `of an object and only use the reactive version if possible.`);
    }
}

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
function targetTypeMap(rawType) {
    switch (rawType) {
        case 'Object':
        case 'Array':
            return 1 /* COMMON */;
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return 2 /* COLLECTION */;
        default:
            return 0 /* INVALID */;
    }
}
function getTargetType(value) {
    return value["__v_skip" /* SKIP */] || !Object.isExtensible(value)
        ? 0 /* INVALID */
        : targetTypeMap(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* toRawType */ "I"])(value));
}
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly" /* IS_READONLY */]) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
}
// Return a reactive-copy of the original object, where only the root level
// properties are reactive, and does NOT unwrap refs nor recursively convert
// returned properties.
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
}
// Return a reactive-copy of the original object, where only the root level
// properties are readonly, and does NOT unwrap refs nor recursively convert
// returned properties.
// This is used for creating the props proxy object for stateful components.
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isObject */ "t"])(target)) {
        if ((true)) {
            console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
    }
    // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object
    if (target["__v_raw" /* RAW */] &&
        !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
        return target;
    }
    // target already has corresponding Proxy
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // only a whitelist of value types can be observed.
    const targetType = getTargetType(target);
    if (targetType === 0 /* INVALID */) {
        return target;
    }
    const proxy = new Proxy(target, targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* RAW */]);
    }
    return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
}
function isReadonly(value) {
    return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
}
function markRaw(value) {
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* def */ "g"])(value, "__v_skip" /* SKIP */, true);
    return value;
}

const convert = (val) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isObject */ "t"])(val) ? reactive(val) : val;
function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
}
function ref(value) {
    return createRef(value);
}
function shallowRef(value) {
    return createRef(value, true);
}
class RefImpl {
    constructor(_rawValue, _shallow = false) {
        this._rawValue = _rawValue;
        this._shallow = _shallow;
        this.__v_isRef = true;
        this._value = _shallow ? _rawValue : convert(_rawValue);
    }
    get value() {
        track(toRaw(this), "get" /* GET */, 'value');
        return this._value;
    }
    set value(newVal) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* hasChanged */ "j"])(toRaw(newVal), this._rawValue)) {
            this._rawValue = newVal;
            this._value = this._shallow ? newVal : convert(newVal);
            trigger(toRaw(this), "set" /* SET */, 'value', newVal);
        }
    }
}
function createRef(rawValue, shallow = false) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    return new RefImpl(rawValue, shallow);
}
function triggerRef(ref) {
    trigger(ref, "set" /* SET */, 'value', ( true) ? ref.value : undefined);
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
        }
        else {
            return Reflect.set(target, key, value, receiver);
        }
    }
};
function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs)
        ? objectWithRefs
        : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
    constructor(factory) {
        this.__v_isRef = true;
        const { get, set } = factory(() => track(this, "get" /* GET */, 'value'), () => trigger(this, "set" /* SET */, 'value'));
        this._get = get;
        this._set = set;
    }
    get value() {
        return this._get();
    }
    set value(newVal) {
        this._set(newVal);
    }
}
function customRef(factory) {
    return new CustomRefImpl(factory);
}
function toRefs(object) {
    if (( true) && !isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "n"])(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
class ObjectRefImpl {
    constructor(_object, _key) {
        this._object = _object;
        this._key = _key;
        this.__v_isRef = true;
    }
    get value() {
        return this._object[this._key];
    }
    set value(newVal) {
        this._object[this._key] = newVal;
    }
}
function toRef(object, key) {
    return new ObjectRefImpl(object, key);
}

class ComputedRefImpl {
    constructor(getter, _setter, isReadonly) {
        this._setter = _setter;
        this._dirty = true;
        this.__v_isRef = true;
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(toRaw(this), "set" /* SET */, 'value');
                }
            }
        });
        this["__v_isReadonly" /* IS_READONLY */] = isReadonly;
    }
    get value() {
        if (this._dirty) {
            this._value = this.effect();
            this._dirty = false;
        }
        track(toRaw(this), "get" /* GET */, 'value');
        return this._value;
    }
    set value(newValue) {
        this._setter(newValue);
    }
}
function computed(getterOrOptions) {
    let getter;
    let setter;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isFunction */ "o"])(getterOrOptions)) {
        getter = getterOrOptions;
        setter = ( true)
            ? () => {
                console.warn('Write operation failed: computed value is readonly');
            }
            : undefined;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter, Object(_vue_shared__WEBPACK_IMPORTED_MODULE_0__[/* isFunction */ "o"])(getterOrOptions) || !getterOrOptions.set);
}




/***/ }),

/***/ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js ***!
  \*************************************************************************/
/*! exports provided: customRef, isProxy, isReactive, isReadonly, isRef, markRaw, proxyRefs, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, camelize, capitalize, toDisplayString, BaseTransition, Comment, Fragment, KeepAlive, Static, Suspense, Teleport, Text, callWithAsyncErrorHandling, callWithErrorHandling, cloneVNode, computed, createBlock, createCommentVNode, createHydrationRenderer, createRenderer, createSlots, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, devtools, getCurrentInstance, getTransitionRawChildren, h, handleError, inject, isVNode, mergeProps, nextTick, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, openBlock, popScopeId, provide, pushScopeId, queuePostFlushCb, registerRuntimeCompiler, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, ssrContextKey, ssrUtils, toHandlers, transformVNodeArgs, useSSRContext, useTransitionState, version, warn, watch, watchEffect, withCtx, withDirectives, withScopeId */
/*! exports used: BaseTransition, Fragment, callWithAsyncErrorHandling, camelize, createHydrationRenderer, createRenderer, createVNode, getCurrentInstance, getTransitionRawChildren, h, onMounted, onUpdated, reactive, resolveTransitionHooks, setDevtoolsHook, setTransitionHooks, unref, useTransitionState, warn, watchEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseTransition; });
/* unused harmony export Comment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Fragment; });
/* unused harmony export KeepAlive */
/* unused harmony export Static */
/* unused harmony export Suspense */
/* unused harmony export Teleport */
/* unused harmony export Text */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return callWithAsyncErrorHandling; });
/* unused harmony export callWithErrorHandling */
/* unused harmony export cloneVNode */
/* unused harmony export computed */
/* unused harmony export createBlock */
/* unused harmony export createCommentVNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return createHydrationRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return createRenderer; });
/* unused harmony export createSlots */
/* unused harmony export createStaticVNode */
/* unused harmony export createTextVNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return createVNode; });
/* unused harmony export defineAsyncComponent */
/* unused harmony export defineComponent */
/* unused harmony export devtools */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return getCurrentInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getTransitionRawChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return h; });
/* unused harmony export handleError */
/* unused harmony export inject */
/* unused harmony export isVNode */
/* unused harmony export mergeProps */
/* unused harmony export nextTick */
/* unused harmony export onActivated */
/* unused harmony export onBeforeMount */
/* unused harmony export onBeforeUnmount */
/* unused harmony export onBeforeUpdate */
/* unused harmony export onDeactivated */
/* unused harmony export onErrorCaptured */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return onMounted; });
/* unused harmony export onRenderTracked */
/* unused harmony export onRenderTriggered */
/* unused harmony export onUnmounted */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return onUpdated; });
/* unused harmony export openBlock */
/* unused harmony export popScopeId */
/* unused harmony export provide */
/* unused harmony export pushScopeId */
/* unused harmony export queuePostFlushCb */
/* unused harmony export registerRuntimeCompiler */
/* unused harmony export renderList */
/* unused harmony export renderSlot */
/* unused harmony export resolveComponent */
/* unused harmony export resolveDirective */
/* unused harmony export resolveDynamicComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return resolveTransitionHooks; });
/* unused harmony export setBlockTracking */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return setDevtoolsHook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return setTransitionHooks; });
/* unused harmony export ssrContextKey */
/* unused harmony export ssrUtils */
/* unused harmony export toHandlers */
/* unused harmony export transformVNodeArgs */
/* unused harmony export useSSRContext */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return useTransitionState; });
/* unused harmony export version */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return warn; });
/* unused harmony export watch */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return watchEffect; });
/* unused harmony export withCtx */
/* unused harmony export withDirectives */
/* unused harmony export withScopeId */
/* harmony import */ var _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/reactivity */ "./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "m", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "q", function() { return _vue_reactivity__WEBPACK_IMPORTED_MODULE_0__["q"]; });

/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "d", function() { return _vue_shared__WEBPACK_IMPORTED_MODULE_1__["e"]; });






const stack = [];
function pushWarningContext(vnode) {
    stack.push(vnode);
}
function popWarningContext() {
    stack.pop();
}
function warn(msg, ...args) {
    // avoid props formatting or warn handler tracking deps that might be mutated
    // during patch, leading to infinite recursion.
    Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* pauseTracking */ "f"])();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
        callWithErrorHandling(appWarnHandler, instance, 11 /* APP_WARN_HANDLER */, [
            msg + args.join(''),
            instance && instance.proxy,
            trace
                .map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`)
                .join('\n'),
            trace
        ]);
    }
    else {
        const warnArgs = [`[Vue warn]: ${msg}`, ...args];
        /* istanbul ignore if */
        if (trace.length &&
            // avoid spamming console during tests
            !false) {
            warnArgs.push(`\n`, ...formatTrace(trace));
        }
        console.warn(...warnArgs);
    }
    Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* resetTracking */ "j"])();
}
function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
        return [];
    }
    // we can't just use the stack because it will be incomplete during updates
    // that did not start from the root. Re-construct the parent chain using
    // instance parent pointers.
    const normalizedStack = [];
    while (currentVNode) {
        const last = normalizedStack[0];
        if (last && last.vnode === currentVNode) {
            last.recurseCount++;
        }
        else {
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
/* istanbul ignore next */
function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
        logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
    });
    return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
    const close = `>` + postfix;
    return vnode.props
        ? [open, ...formatProps(vnode.props), close]
        : [open + close];
}
/* istanbul ignore next */
function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach(key => {
        res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
        res.push(` ...`);
    }
    return res;
}
/* istanbul ignore next */
function formatProp(key, value, raw) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(value)) {
        value = JSON.stringify(value);
        return raw ? value : [`${key}=${value}`];
    }
    else if (typeof value === 'number' ||
        typeof value === 'boolean' ||
        value == null) {
        return raw ? value : [`${key}=${value}`];
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isRef */ "e"])(value)) {
        value = formatProp(key, Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(value.value), true);
        return raw ? value : [`${key}=Ref<`, value, `>`];
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(value)) {
        return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    }
    else {
        value = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(value);
        return raw ? value : [`${key}=`, value];
    }
}

const ErrorTypeStrings = {
    ["bc" /* BEFORE_CREATE */]: 'beforeCreate hook',
    ["c" /* CREATED */]: 'created hook',
    ["bm" /* BEFORE_MOUNT */]: 'beforeMount hook',
    ["m" /* MOUNTED */]: 'mounted hook',
    ["bu" /* BEFORE_UPDATE */]: 'beforeUpdate hook',
    ["u" /* UPDATED */]: 'updated',
    ["bum" /* BEFORE_UNMOUNT */]: 'beforeUnmount hook',
    ["um" /* UNMOUNTED */]: 'unmounted hook',
    ["a" /* ACTIVATED */]: 'activated hook',
    ["da" /* DEACTIVATED */]: 'deactivated hook',
    ["ec" /* ERROR_CAPTURED */]: 'errorCaptured hook',
    ["rtc" /* RENDER_TRACKED */]: 'renderTracked hook',
    ["rtg" /* RENDER_TRIGGERED */]: 'renderTriggered hook',
    [0 /* SETUP_FUNCTION */]: 'setup function',
    [1 /* RENDER_FUNCTION */]: 'render function',
    [2 /* WATCH_GETTER */]: 'watcher getter',
    [3 /* WATCH_CALLBACK */]: 'watcher callback',
    [4 /* WATCH_CLEANUP */]: 'watcher cleanup function',
    [5 /* NATIVE_EVENT_HANDLER */]: 'native event handler',
    [6 /* COMPONENT_EVENT_HANDLER */]: 'component event handler',
    [7 /* VNODE_HOOK */]: 'vnode hook',
    [8 /* DIRECTIVE_HOOK */]: 'directive hook',
    [9 /* TRANSITION_HOOK */]: 'transition hook',
    [10 /* APP_ERROR_HANDLER */]: 'app errorHandler',
    [11 /* APP_WARN_HANDLER */]: 'app warnHandler',
    [12 /* FUNCTION_REF */]: 'ref function',
    [13 /* ASYNC_COMPONENT_LOADER */]: 'async component loader',
    [14 /* SCHEDULER */]: 'scheduler flush. This is likely a Vue internals bug. ' +
        'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-next'
};
function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
        res = args ? fn(...args) : fn();
    }
    catch (err) {
        handleError(err, instance, type);
    }
    return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isPromise */ "v"])(res)) {
            res.catch(err => {
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
function handleError(err, instance, type) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
        let cur = instance.parent;
        // the exposed instance is the render proxy to keep it consistent with 2.x
        const exposedInstance = instance.proxy;
        // in production the hook receives only the error code
        const errorInfo = ( true) ? ErrorTypeStrings[type] : undefined;
        while (cur) {
            const errorCapturedHooks = cur.ec;
            if (errorCapturedHooks) {
                for (let i = 0; i < errorCapturedHooks.length; i++) {
                    if (errorCapturedHooks[i](err, exposedInstance, errorInfo)) {
                        return;
                    }
                }
            }
            cur = cur.parent;
        }
        // app-level handling
        const appErrorHandler = instance.appContext.config.errorHandler;
        if (appErrorHandler) {
            callWithErrorHandling(appErrorHandler, null, 10 /* APP_ERROR_HANDLER */, [err, exposedInstance, errorInfo]);
            return;
        }
    }
    logError(err, type, contextVNode);
}
function logError(err, type, contextVNode) {
    if ((true)) {
        const info = ErrorTypeStrings[type];
        if (contextVNode) {
            pushWarningContext(contextVNode);
        }
        warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
        if (contextVNode) {
            popWarningContext();
        }
        // crash in dev so it's more noticeable
        throw err;
    }
    else {}
}

let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
const RECURSION_LIMIT = 100;
function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(fn) : p;
}
function queueJob(job) {
    // the dedupe search uses the startIndex argument of Array.includes()
    // by default the search index includes the current job that is being run
    // so it cannot recursively trigger itself again.
    // if the job is a watch() callback, the search will start with a +1 index to
    // allow it recursively trigger itself - it is the user's responsibility to
    // ensure it doesn't end up in an infinite loop.
    if ((!queue.length ||
        !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) &&
        job !== currentPreFlushParentJob) {
        queue.push(job);
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
    if (i > -1) {
        queue[i] = null;
    }
}
function queueCb(cb, activeQueue, pendingQueue, index) {
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(cb)) {
        if (!activeQueue ||
            !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
            pendingQueue.push(cb);
        }
    }
    else {
        // if cb is an array, it is a component lifecycle hook which can only be
        // triggered by a job, which is already deduped in the main queue, so
        // we can skip duplicate check here to improve perf
        pendingQueue.push(...cb);
    }
    queueFlush();
}
function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
    queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
    if (pendingPreFlushCbs.length) {
        currentPreFlushParentJob = parentJob;
        activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
        pendingPreFlushCbs.length = 0;
        if ((true)) {
            seen = seen || new Map();
        }
        for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
            if ((true)) {
                checkRecursiveUpdates(seen, activePreFlushCbs[preFlushIndex]);
            }
            activePreFlushCbs[preFlushIndex]();
        }
        activePreFlushCbs = null;
        preFlushIndex = 0;
        currentPreFlushParentJob = null;
        // recursively flush until it drains
        flushPreFlushCbs(seen, parentJob);
    }
}
function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
        const deduped = [...new Set(pendingPostFlushCbs)];
        pendingPostFlushCbs.length = 0;
        // #1947 already has active queue, nested flushPostFlushCbs call
        if (activePostFlushCbs) {
            activePostFlushCbs.push(...deduped);
            return;
        }
        activePostFlushCbs = deduped;
        if ((true)) {
            seen = seen || new Map();
        }
        activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
        for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
            if ((true)) {
                checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex]);
            }
            activePostFlushCbs[postFlushIndex]();
        }
        activePostFlushCbs = null;
        postFlushIndex = 0;
    }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    if ((true)) {
        seen = seen || new Map();
    }
    flushPreFlushCbs(seen);
    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child so its render effect will have smaller
    //    priority number)
    // 2. If a component is unmounted during a parent component's update,
    //    its update can be skipped.
    // Jobs can never be null before flush starts, since they are only invalidated
    // during execution of another flushed job.
    queue.sort((a, b) => getId(a) - getId(b));
    try {
        for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
            const job = queue[flushIndex];
            if (job) {
                if ((true)) {
                    checkRecursiveUpdates(seen, job);
                }
                callWithErrorHandling(job, null, 14 /* SCHEDULER */);
            }
        }
    }
    finally {
        flushIndex = 0;
        queue.length = 0;
        flushPostFlushCbs(seen);
        isFlushing = false;
        currentFlushPromise = null;
        // some postFlushCb queued jobs!
        // keep flushing until it drains.
        if (queue.length || pendingPostFlushCbs.length) {
            flushJobs(seen);
        }
    }
}
function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
        seen.set(fn, 1);
    }
    else {
        const count = seen.get(fn);
        if (count > RECURSION_LIMIT) {
            throw new Error(`Maximum recursive updates exceeded. ` +
                `This means you have a reactive effect that is mutating its own ` +
                `dependencies and thus recursively triggering itself. Possible sources ` +
                `include component template, render function, updated hook or ` +
                `watcher source function.`);
        }
        else {
            seen.set(fn, count + 1);
        }
    }
}

let isHmrUpdating = false;
const hmrDirtyComponents = new Set();
// Expose the HMR runtime on the global object
// This makes it entirely tree-shakable without polluting the exports and makes
// it easier to be used in toolings like vue-loader
// Note: for a component to be eligible for HMR it also needs the __hmrId option
// to be set so that its instances can be registered / removed.
if ((true)) {
    const globalObject = typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
            ? self
            : typeof window !== 'undefined'
                ? window
                : {};
    globalObject.__VUE_HMR_RUNTIME__ = {
        createRecord: tryWrap(createRecord),
        rerender: tryWrap(rerender),
        reload: tryWrap(reload)
    };
}
const map = new Map();
function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
        createRecord(id);
        record = map.get(id);
    }
    record.add(instance);
}
function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).delete(instance);
}
function createRecord(id) {
    if (map.has(id)) {
        return false;
    }
    map.set(id, new Set());
    return true;
}
function rerender(id, newRender) {
    const record = map.get(id);
    if (!record)
        return;
    // Array.from creates a snapshot which avoids the set being mutated during
    // updates
    Array.from(record).forEach(instance => {
        if (newRender) {
            instance.render = newRender;
        }
        instance.renderCache = [];
        // this flag forces child components with slot content to update
        isHmrUpdating = true;
        instance.update();
        isHmrUpdating = false;
    });
}
function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
        return;
    // Array.from creates a snapshot which avoids the set being mutated during
    // updates
    Array.from(record).forEach(instance => {
        const comp = instance.type;
        if (!hmrDirtyComponents.has(comp)) {
            // 1. Update existing comp definition to match new one
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(comp, newComp);
            for (const key in comp) {
                if (!(key in newComp)) {
                    delete comp[key];
                }
            }
            // 2. Mark component dirty. This forces the renderer to replace the component
            // on patch.
            hmrDirtyComponents.add(comp);
            // 3. Make sure to unmark the component after the reload.
            queuePostFlushCb(() => {
                hmrDirtyComponents.delete(comp);
            });
        }
        if (instance.parent) {
            // 4. Force the parent instance to re-render. This will cause all updated
            // components to be unmounted and re-mounted. Queue the update so that we
            // don't end up forcing the same parent to re-render multiple times.
            queueJob(instance.parent.update);
        }
        else if (instance.appContext.reload) {
            // root instance mounted via createApp() has a reload method
            instance.appContext.reload();
        }
        else if (typeof window !== 'undefined') {
            // root instance inside tree created via raw render(). Force reload.
            window.location.reload();
        }
        else {
            console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
        }
    });
}
function tryWrap(fn) {
    return (id, arg) => {
        try {
            return fn(id, arg);
        }
        catch (e) {
            console.error(e);
            console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` +
                `Full reload required.`);
        }
    };
}

// mark the current rendering instance for asset resolution (e.g.
// resolveComponent, resolveDirective) during render
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
    currentRenderingInstance = instance;
}
// dev only flag to track whether $attrs was used during render.
// If $attrs was used during render then the warning for failed attrs
// fallthrough can be suppressed.
let accessedAttrs = false;
function markAttrsAccessed() {
    accessedAttrs = true;
}
function renderComponentRoot(instance) {
    const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx } = instance;
    let result;
    currentRenderingInstance = instance;
    if ((true)) {
        accessedAttrs = false;
    }
    try {
        let fallthroughAttrs;
        if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
            // withProxy is a proxy with a different `has` trap only for
            // runtime-compiled render functions using `with` block.
            const proxyToUse = withProxy || proxy;
            result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
            fallthroughAttrs = attrs;
        }
        else {
            // functional
            const render = Component;
            // in dev, mark attrs accessed if optional props (attrs === props)
            if (( true) && attrs === props) {
                markAttrsAccessed();
            }
            result = normalizeVNode(render.length > 1
                ? render(props, ( true)
                    ? {
                        get attrs() {
                            markAttrsAccessed();
                            return attrs;
                        },
                        slots,
                        emit
                    }
                    : undefined)
                : render(props, null /* we know it doesn't need it */));
            fallthroughAttrs = Component.props
                ? attrs
                : getFunctionalFallthrough(attrs);
        }
        // attr merging
        // in dev mode, comments are preserved, and it's possible for a template
        // to have comments along side the root element which makes it a fragment
        let root = result;
        let setRoot = undefined;
        if ((true)) {
            ;
            [root, setRoot] = getChildRoot(result);
        }
        if (Component.inheritAttrs !== false && fallthroughAttrs) {
            const keys = Object.keys(fallthroughAttrs);
            const { shapeFlag } = root;
            if (keys.length) {
                if (shapeFlag & 1 /* ELEMENT */ ||
                    shapeFlag & 6 /* COMPONENT */) {
                    if (propsOptions && keys.some(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isModelListener */ "s"])) {
                        // If a v-model listener (onUpdate:xxx) has a corresponding declared
                        // prop, it indicates this component expects to handle v-model and
                        // it should not fallthrough.
                        // related: #1543, #1643, #1989
                        fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
                    }
                    root = cloneVNode(root, fallthroughAttrs);
                }
                else if (( true) && !accessedAttrs && root.type !== Comment) {
                    const allAttrs = Object.keys(attrs);
                    const eventAttrs = [];
                    const extraAttrs = [];
                    for (let i = 0, l = allAttrs.length; i < l; i++) {
                        const key = allAttrs[i];
                        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isOn */ "u"])(key)) {
                            // ignore v-model handlers when they fail to fallthrough
                            if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isModelListener */ "s"])(key)) {
                                // remove `on`, lowercase first letter to reflect event casing
                                // accurately
                                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
                            }
                        }
                        else {
                            extraAttrs.push(key);
                        }
                    }
                    if (extraAttrs.length) {
                        warn(`Extraneous non-props attributes (` +
                            `${extraAttrs.join(', ')}) ` +
                            `were passed to component but could not be automatically inherited ` +
                            `because component renders fragment or text root nodes.`);
                    }
                    if (eventAttrs.length) {
                        warn(`Extraneous non-emits event listeners (` +
                            `${eventAttrs.join(', ')}) ` +
                            `were passed to component but could not be automatically inherited ` +
                            `because component renders fragment or text root nodes. ` +
                            `If the listener is intended to be a component custom event listener only, ` +
                            `declare it using the "emits" option.`);
                    }
                }
            }
        }
        // inherit directives
        if (vnode.dirs) {
            if (( true) && !isElementRoot(root)) {
                warn(`Runtime directive used on component with non-element root node. ` +
                    `The directives will not function as intended.`);
            }
            root.dirs = vnode.dirs;
        }
        // inherit transition data
        if (vnode.transition) {
            if (( true) && !isElementRoot(root)) {
                warn(`Component inside <Transition> renders non-element root node ` +
                    `that cannot be animated.`);
            }
            root.transition = vnode.transition;
        }
        if (( true) && setRoot) {
            setRoot(root);
        }
        else {
            result = root;
        }
    }
    catch (err) {
        handleError(err, instance, 1 /* RENDER_FUNCTION */);
        result = createVNode(Comment);
    }
    currentRenderingInstance = null;
    return result;
}
/**
 * dev only
 */
const getChildRoot = (vnode) => {
    if (vnode.type !== Fragment) {
        return [vnode, undefined];
    }
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const children = rawChildren.filter(child => {
        return !(isVNode(child) &&
            child.type === Comment &&
            child.children !== 'v-if');
    });
    if (children.length !== 1) {
        return [vnode, undefined];
    }
    const childRoot = children[0];
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
    const setRoot = (updatedRoot) => {
        rawChildren[index] = updatedRoot;
        if (dynamicIndex > -1) {
            dynamicChildren[dynamicIndex] = updatedRoot;
        }
        else if (dynamicChildren && updatedRoot.patchFlag > 0) {
            dynamicChildren.push(updatedRoot);
        }
    };
    return [normalizeVNode(childRoot), setRoot];
};
const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
        if (key === 'class' || key === 'style' || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isOn */ "u"])(key)) {
            (res || (res = {}))[key] = attrs[key];
        }
    }
    return res;
};
const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
        if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isModelListener */ "s"])(key) || !(key.slice(9) in props)) {
            res[key] = attrs[key];
        }
    }
    return res;
};
const isElementRoot = (vnode) => {
    return (vnode.shapeFlag & 6 /* COMPONENT */ ||
        vnode.shapeFlag & 1 /* ELEMENT */ ||
        vnode.type === Comment // potential v-if branch switch
    );
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    // Parent component's render function was hot-updated. Since this may have
    // caused the child component's slots content to have changed, we need to
    // force the child to update as well.
    if (( true) && (prevChildren || nextChildren) && isHmrUpdating) {
        return true;
    }
    // force child update for runtime directive or transition on component vnode.
    if (nextVNode.dirs || nextVNode.transition) {
        return true;
    }
    if (optimized && patchFlag > 0) {
        if (patchFlag & 1024 /* DYNAMIC_SLOTS */) {
            // slot content that references values that might have changed,
            // e.g. in a v-for
            return true;
        }
        if (patchFlag & 16 /* FULL_PROPS */) {
            if (!prevProps) {
                return !!nextProps;
            }
            // presence of this flag indicates props are always non-null
            return hasPropsChanged(prevProps, nextProps);
        }
        else if (patchFlag & 8 /* PROPS */) {
            const dynamicProps = nextVNode.dynamicProps;
            for (let i = 0; i < dynamicProps.length; i++) {
                const key = dynamicProps[i];
                if (nextProps[key] !== prevProps[key]) {
                    return true;
                }
            }
        }
    }
    else {
        // this path is only taken by manually written render functions
        // so presence of any children leads to a forced update
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
        return hasPropsChanged(prevProps, nextProps);
    }
    return false;
}
function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}
function updateHOCHostEl({ vnode, parent }, el // HostNode
) {
    while (parent && parent.subTree === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
    }
}

const isSuspense = (type) => type.__isSuspense;
// Suspense exposes a component-like API, and is treated like a component
// in the compiler, but internally it's a special built-in type that hooks
// directly into the renderer.
const SuspenseImpl = {
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, 
    // platform-specific impl passed from renderer
    rendererInternals) {
        if (n1 == null) {
            mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals);
        }
        else {
            patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, rendererInternals);
        }
    },
    hydrate: hydrateSuspense
};
// Force-casted public typing for h and TSX props inference
const Suspense = ( SuspenseImpl
    );
function mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals) {
    const { p: patch, o: { createElement } } = rendererInternals;
    const hiddenContainer = createElement('div');
    const suspense = (n2.suspense = createSuspenseBoundary(n2, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals));
    // start mounting the content subtree in an off-dom container
    patch(null, suspense.subTree, hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
    // now check if we have encountered any async deps
    if (suspense.deps > 0) {
        // mount the fallback tree
        patch(null, suspense.fallbackTree, container, anchor, parentComponent, null, // fallback tree will not have suspense context
        isSVG, optimized);
        n2.el = suspense.fallbackTree.el;
    }
    else {
        // Suspense has no async deps. Just resolve.
        suspense.resolve();
    }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, { p: patch }) {
    const suspense = (n2.suspense = n1.suspense);
    suspense.vnode = n2;
    const { content, fallback } = normalizeSuspenseChildren(n2);
    const oldSubTree = suspense.subTree;
    const oldFallbackTree = suspense.fallbackTree;
    if (!suspense.isResolved) {
        patch(oldSubTree, content, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
        if (suspense.deps > 0) {
            // still pending. patch the fallback tree.
            patch(oldFallbackTree, fallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
            isSVG, optimized);
            n2.el = fallback.el;
        }
        // If deps somehow becomes 0 after the patch it means the patch caused an
        // async dep component to unmount and removed its dep. It will cause the
        // suspense to resolve and we don't need to do anything here.
    }
    else {
        // just normal patch inner content as a fragment
        patch(oldSubTree, content, container, anchor, parentComponent, suspense, isSVG, optimized);
        n2.el = content.el;
    }
    suspense.subTree = content;
    suspense.fallbackTree = fallback;
}
let hasWarned = false;
function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals, isHydrating = false) {
    /* istanbul ignore if */
    if ( true && !hasWarned) {
        hasWarned = true;
        // @ts-ignore `console.info` cannot be null error
        console[console.info ? 'info' : 'log'](`<Suspense> is an experimental feature and its API will likely change.`);
    }
    const { p: patch, m: move, um: unmount, n: next, o: { parentNode } } = rendererInternals;
    const getCurrentTree = () => suspense.isResolved || suspense.isHydrating
        ? suspense.subTree
        : suspense.fallbackTree;
    const { content, fallback } = normalizeSuspenseChildren(vnode);
    const suspense = {
        vnode,
        parent,
        parentComponent,
        isSVG,
        optimized,
        container,
        hiddenContainer,
        anchor,
        deps: 0,
        subTree: content,
        fallbackTree: fallback,
        isHydrating,
        isResolved: false,
        isUnmounted: false,
        effects: [],
        resolve() {
            if ((true)) {
                if (suspense.isResolved) {
                    throw new Error(`resolveSuspense() is called on an already resolved suspense boundary.`);
                }
                if (suspense.isUnmounted) {
                    throw new Error(`resolveSuspense() is called on an already unmounted suspense boundary.`);
                }
            }
            const { vnode, subTree, fallbackTree, effects, parentComponent, container } = suspense;
            if (suspense.isHydrating) {
                suspense.isHydrating = false;
            }
            else {
                // this is initial anchor on mount
                let { anchor } = suspense;
                // unmount fallback tree
                if (fallbackTree.el) {
                    // if the fallback tree was mounted, it may have been moved
                    // as part of a parent suspense. get the latest anchor for insertion
                    anchor = next(fallbackTree);
                    unmount(fallbackTree, parentComponent, suspense, true);
                }
                // move content from off-dom container to actual container
                move(subTree, container, anchor, 0 /* ENTER */);
            }
            const el = (vnode.el = subTree.el);
            // suspense as the root node of a component...
            if (parentComponent && parentComponent.subTree === vnode) {
                parentComponent.vnode.el = el;
                updateHOCHostEl(parentComponent, el);
            }
            // check if there is a pending parent suspense
            let parent = suspense.parent;
            let hasUnresolvedAncestor = false;
            while (parent) {
                if (!parent.isResolved) {
                    // found a pending parent suspense, merge buffered post jobs
                    // into that parent
                    parent.effects.push(...effects);
                    hasUnresolvedAncestor = true;
                    break;
                }
                parent = parent.parent;
            }
            // no pending parent suspense, flush all jobs
            if (!hasUnresolvedAncestor) {
                queuePostFlushCb(effects);
            }
            suspense.isResolved = true;
            suspense.effects = [];
            // invoke @resolve event
            const onResolve = vnode.props && vnode.props.onResolve;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(onResolve)) {
                onResolve();
            }
        },
        recede() {
            suspense.isResolved = false;
            const { vnode, subTree, fallbackTree, parentComponent, container, hiddenContainer, isSVG, optimized } = suspense;
            // move content tree back to the off-dom container
            const anchor = next(subTree);
            move(subTree, hiddenContainer, null, 1 /* LEAVE */);
            // remount the fallback tree
            patch(null, fallbackTree, container, anchor, parentComponent, null, // fallback tree will not have suspense context
            isSVG, optimized);
            const el = (vnode.el = fallbackTree.el);
            // suspense as the root node of a component...
            if (parentComponent && parentComponent.subTree === vnode) {
                parentComponent.vnode.el = el;
                updateHOCHostEl(parentComponent, el);
            }
            // invoke @recede event
            const onRecede = vnode.props && vnode.props.onRecede;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(onRecede)) {
                onRecede();
            }
        },
        move(container, anchor, type) {
            move(getCurrentTree(), container, anchor, type);
            suspense.container = container;
        },
        next() {
            return next(getCurrentTree());
        },
        registerDep(instance, setupRenderEffect) {
            // suspense is already resolved, need to recede.
            // use queueJob so it's handled synchronously after patching the current
            // suspense tree
            if (suspense.isResolved) {
                queueJob(() => {
                    suspense.recede();
                });
            }
            const hydratedEl = instance.vnode.el;
            suspense.deps++;
            instance
                .asyncDep.catch(err => {
                handleError(err, instance, 0 /* SETUP_FUNCTION */);
            })
                .then(asyncSetupResult => {
                // retry when the setup() promise resolves.
                // component may have been unmounted before resolve.
                if (instance.isUnmounted || suspense.isUnmounted) {
                    return;
                }
                suspense.deps--;
                // retry from this component
                instance.asyncResolved = true;
                const { vnode } = instance;
                if ((true)) {
                    pushWarningContext(vnode);
                }
                handleSetupResult(instance, asyncSetupResult);
                if (hydratedEl) {
                    // vnode may have been replaced if an update happened before the
                    // async dep is resolved.
                    vnode.el = hydratedEl;
                }
                setupRenderEffect(instance, vnode, 
                // component may have been moved before resolve.
                // if this is not a hydration, instance.subTree will be the comment
                // placeholder.
                hydratedEl
                    ? parentNode(hydratedEl)
                    : parentNode(instance.subTree.el), 
                // anchor will not be used if this is hydration, so only need to
                // consider the comment placeholder case.
                hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
                updateHOCHostEl(instance, vnode.el);
                if ((true)) {
                    popWarningContext();
                }
                if (suspense.deps === 0) {
                    suspense.resolve();
                }
            });
        },
        unmount(parentSuspense, doRemove) {
            suspense.isUnmounted = true;
            unmount(suspense.subTree, parentComponent, parentSuspense, doRemove);
            if (!suspense.isResolved) {
                unmount(suspense.fallbackTree, parentComponent, parentSuspense, doRemove);
            }
        }
    };
    return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, optimized, rendererInternals, hydrateNode) {
    /* eslint-disable no-restricted-globals */
    const suspense = (vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement('div'), null, isSVG, optimized, rendererInternals, true /* hydrating */));
    // there are two possible scenarios for server-rendered suspense:
    // - success: ssr content should be fully resolved
    // - failure: ssr content should be the fallback branch.
    // however, on the client we don't really know if it has failed or not
    // attempt to hydrate the DOM assuming it has succeeded, but we still
    // need to construct a suspense boundary first
    const result = hydrateNode(node, suspense.subTree, parentComponent, suspense, optimized);
    if (suspense.deps === 0) {
        suspense.resolve();
    }
    return result;
    /* eslint-enable no-restricted-globals */
}
function normalizeSuspenseChildren(vnode) {
    const { shapeFlag, children } = vnode;
    if (shapeFlag & 32 /* SLOTS_CHILDREN */) {
        const { default: d, fallback } = children;
        return {
            content: normalizeVNode(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(d) ? d() : d),
            fallback: normalizeVNode(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(fallback) ? fallback() : fallback)
        };
    }
    else {
        return {
            content: normalizeVNode(children),
            fallback: normalizeVNode(null)
        };
    }
}
function queueEffectWithSuspense(fn, suspense) {
    if (suspense && !suspense.isResolved) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(fn)) {
            suspense.effects.push(...fn);
        }
        else {
            suspense.effects.push(fn);
        }
    }
    else {
        queuePostFlushCb(fn);
    }
}

let isRenderingCompiledSlot = 0;
const setCompiledSlotRendering = (n) => (isRenderingCompiledSlot += n);
/**
 * Compiler runtime helper for rendering `<slot/>`
 * @private
 */
function renderSlot(slots, name, props = {}, 
// this is not a user-facing function, so the fallback is always generated by
// the compiler and guaranteed to be a function returning an array
fallback) {
    let slot = slots[name];
    if (( true) && slot && slot.length > 1) {
        warn(`SSR-optimized slot function detected in a non-SSR-optimized render ` +
            `function. You need to mark this component with $dynamic-slots in the ` +
            `parent template.`);
        slot = () => [];
    }
    // a compiled slot disables block tracking by default to avoid manual
    // invocation interfering with template-based block tracking, but in
    // `renderSlot` we can be sure that it's template-based so we can force
    // enable it.
    isRenderingCompiledSlot++;
    const rendered = (openBlock(),
        createBlock(Fragment, { key: props.key }, slot ? slot(props) : fallback ? fallback() : [], slots._ === 1 /* STABLE */
            ? 64 /* STABLE_FRAGMENT */
            : -2 /* BAIL */));
    isRenderingCompiledSlot--;
    return rendered;
}

/**
 * Wrap a slot function to memoize current rendering instance
 * @private
 */
function withCtx(fn, ctx = currentRenderingInstance) {
    if (!ctx)
        return fn;
    const renderFnWithContext = (...args) => {
        // If a user calls a compiled slot inside a template expression (#1745), it
        // can mess up block tracking, so by default we need to push a null block to
        // avoid that. This isn't necessary if rendering a compiled `<slot>`.
        if (!isRenderingCompiledSlot) {
            openBlock(true /* null block that disables tracking */);
        }
        const owner = currentRenderingInstance;
        setCurrentRenderingInstance(ctx);
        const res = fn(...args);
        setCurrentRenderingInstance(owner);
        if (!isRenderingCompiledSlot) {
            closeBlock();
        }
        return res;
    };
    renderFnWithContext._c = true;
    return renderFnWithContext;
}

// SFC scoped style ID management.
let currentScopeId = null;
const scopeIdStack = [];
/**
 * @private
 */
function pushScopeId(id) {
    scopeIdStack.push((currentScopeId = id));
}
/**
 * @private
 */
function popScopeId() {
    scopeIdStack.pop();
    currentScopeId = scopeIdStack[scopeIdStack.length - 1] || null;
}
/**
 * @private
 */
function withScopeId(id) {
    return ((fn) => withCtx(function () {
        pushScopeId(id);
        const res = fn.apply(this, arguments);
        popScopeId();
        return res;
    }));
}

const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === '');
const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(targetSelector)) {
        if (!select) {
            ( true) &&
                warn(`Current renderer does not support string target for Teleports. ` +
                    `(missing querySelector renderer option)`);
            return null;
        }
        else {
            const target = select(targetSelector);
            if (!target) {
                ( true) &&
                    warn(`Failed to locate Teleport target with selector "${targetSelector}". ` +
                        `Note the target element must exist before the component is mounted - ` +
                        `i.e. the target cannot be rendered by the component itself, and ` +
                        `ideally should be outside of the entire Vue component tree.`);
            }
            return target;
        }
    }
    else {
        if (( true) && !targetSelector && !isTeleportDisabled(props)) {
            warn(`Invalid Teleport target: ${targetSelector}`);
        }
        return targetSelector;
    }
};
const TeleportImpl = {
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals) {
        const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
        const disabled = isTeleportDisabled(n2.props);
        const { shapeFlag, children } = n2;
        if (n1 == null) {
            // insert anchors in the main view
            const placeholder = (n2.el = ( true)
                ? createComment('teleport start')
                : undefined);
            const mainAnchor = (n2.anchor = ( true)
                ? createComment('teleport end')
                : undefined);
            insert(placeholder, container, anchor);
            insert(mainAnchor, container, anchor);
            const target = (n2.target = resolveTarget(n2.props, querySelector));
            const targetAnchor = (n2.targetAnchor = createText(''));
            if (target) {
                insert(targetAnchor, target);
            }
            else if (( true) && !disabled) {
                warn('Invalid Teleport target on mount:', target, `(${typeof target})`);
            }
            const mount = (container, anchor) => {
                // Teleport *always* has Array children. This is enforced in both the
                // compiler and vnode children normalization.
                if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
            };
            if (disabled) {
                mount(container, mainAnchor);
            }
            else if (target) {
                mount(target, targetAnchor);
            }
        }
        else {
            // update content
            n2.el = n1.el;
            const mainAnchor = (n2.anchor = n1.anchor);
            const target = (n2.target = n1.target);
            const targetAnchor = (n2.targetAnchor = n1.targetAnchor);
            const wasDisabled = isTeleportDisabled(n1.props);
            const currentContainer = wasDisabled ? container : target;
            const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
            if (n2.dynamicChildren) {
                // fast path when the teleport happens to be a block root
                patchBlockChildren(n1.dynamicChildren, n2.dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG);
                // even in block tree mode we need to make sure all root-level nodes
                // in the teleport inherit previous DOM references so that they can
                // be moved in future patches.
                if (n2.shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    const oldChildren = n1.children;
                    const children = n2.children;
                    for (let i = 0; i < children.length; i++) {
                        // only inherit for non-patched nodes (i.e. static ones)
                        if (!children[i].el) {
                            children[i].el = oldChildren[i].el;
                        }
                    }
                }
            }
            else if (!optimized) {
                patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG);
            }
            if (disabled) {
                if (!wasDisabled) {
                    // enabled -> disabled
                    // move into main container
                    moveTeleport(n2, container, mainAnchor, internals, 1 /* TOGGLE */);
                }
            }
            else {
                // target changed
                if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
                    const nextTarget = (n2.target = resolveTarget(n2.props, querySelector));
                    if (nextTarget) {
                        moveTeleport(n2, nextTarget, null, internals, 0 /* TARGET_CHANGE */);
                    }
                    else if ((true)) {
                        warn('Invalid Teleport target on update:', target, `(${typeof target})`);
                    }
                }
                else if (wasDisabled) {
                    // disabled -> enabled
                    // move into teleport target
                    moveTeleport(n2, target, targetAnchor, internals, 1 /* TOGGLE */);
                }
            }
        }
    },
    remove(vnode, { r: remove, o: { remove: hostRemove } }) {
        const { shapeFlag, children, anchor } = vnode;
        hostRemove(anchor);
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            for (let i = 0; i < children.length; i++) {
                remove(children[i]);
            }
        }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2 /* REORDER */) {
    // move target anchor if this is a target change.
    if (moveType === 0 /* TARGET_CHANGE */) {
        insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2 /* REORDER */;
    // move main view anchor if this is a re-order.
    if (isReorder) {
        insert(el, container, parentAnchor);
    }
    // if this is a re-order and teleport is enabled (content is in target)
    // do not move children. So the opposite is: only move children if this
    // is not a reorder, or the teleport is disabled
    if (!isReorder || isTeleportDisabled(props)) {
        // Teleport has either Array children or no children.
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            for (let i = 0; i < children.length; i++) {
                move(children[i], container, parentAnchor, 2 /* REORDER */);
            }
        }
    }
    // move main view anchor if this is a re-order.
    if (isReorder) {
        insert(anchor, container, parentAnchor);
    }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
    const target = (vnode.target = resolveTarget(vnode.props, querySelector));
    if (target) {
        // if multiple teleports rendered to the same target element, we need to
        // pick up from where the last teleport finished instead of the first node
        const targetNode = target._lpa || target.firstChild;
        if (vnode.shapeFlag & 16 /* ARRAY_CHILDREN */) {
            if (isTeleportDisabled(vnode.props)) {
                vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, optimized);
                vnode.targetAnchor = targetNode;
            }
            else {
                vnode.anchor = nextSibling(node);
                vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, optimized);
            }
            target._lpa =
                vnode.targetAnchor && nextSibling(vnode.targetAnchor);
        }
    }
    return vnode.anchor && nextSibling(vnode.anchor);
}
// Force-casted public typing for h and TSX props inference
const Teleport = TeleportImpl;

const COMPONENTS = 'components';
const DIRECTIVES = 'directives';
/**
 * @private
 */
function resolveComponent(name) {
    return resolveAsset(COMPONENTS, name) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
/**
 * @private
 */
function resolveDynamicComponent(component) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(component)) {
        return resolveAsset(COMPONENTS, component, false) || component;
    }
    else {
        // invalid types will fallthrough to createVNode and raise warning
        return (component || NULL_DYNAMIC_COMPONENT);
    }
}
/**
 * @private
 */
function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
}
// implementation
function resolveAsset(type, name, warnMissing = true) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
        const Component = instance.type;
        // self name has highest priority
        if (type === COMPONENTS) {
            const selfName = Component.displayName || Component.name;
            if (selfName &&
                (selfName === name ||
                    selfName === Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(name) ||
                    selfName === Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(name)))) {
                return Component;
            }
        }
        const res = 
        // local registration
        // check instance[type] first for components with mixin or extends.
        resolve(instance[type] || Component[type], name) ||
            // global registration
            resolve(instance.appContext[type], name);
        if (( true) && warnMissing && !res) {
            warn(`Failed to resolve ${type.slice(0, -1)}: ${name}`);
        }
        return res;
    }
    else if ((true)) {
        warn(`resolve${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(type.slice(0, -1))} ` +
            `can only be used in render() or setup().`);
    }
}
function resolve(registry, name) {
    return (registry &&
        (registry[name] ||
            registry[Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(name)] ||
            registry[Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(name))]));
}

const Fragment = Symbol(( true) ? 'Fragment' : undefined);
const Text = Symbol(( true) ? 'Text' : undefined);
const Comment = Symbol(( true) ? 'Comment' : undefined);
const Static = Symbol(( true) ? 'Static' : undefined);
// Since v-if and v-for are the two possible ways node structure can dynamically
// change, once we consider v-if branches and each v-for fragment a block, we
// can divide a template into nested blocks, and within each block the node
// structure would be stable. This allows us to skip most children diffing
// and only worry about the dynamic nodes (indicated by patch flags).
const blockStack = [];
let currentBlock = null;
/**
 * Open a block.
 * This must be called before `createBlock`. It cannot be part of `createBlock`
 * because the children of the block are evaluated before `createBlock` itself
 * is called. The generated code typically looks like this:
 *
 * ```js
 * function render() {
 *   return (openBlock(),createBlock('div', null, [...]))
 * }
 * ```
 * disableTracking is true when creating a v-for fragment block, since a v-for
 * fragment always diffs its children.
 *
 * @private
 */
function openBlock(disableTracking = false) {
    blockStack.push((currentBlock = disableTracking ? null : []));
}
function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
}
// Whether we should be tracking dynamic child nodes inside a block.
// Only tracks when this value is > 0
// We are not using a simple boolean because this value may need to be
// incremented/decremented by nested usage of v-once (see below)
let shouldTrack = 1;
/**
 * Block tracking sometimes needs to be disabled, for example during the
 * creation of a tree that needs to be cached by v-once. The compiler generates
 * code like this:
 *
 * ``` js
 * _cache[1] || (
 *   setBlockTracking(-1),
 *   _cache[1] = createVNode(...),
 *   setBlockTracking(1),
 *   _cache[1]
 * )
 * ```
 *
 * @private
 */
function setBlockTracking(value) {
    shouldTrack += value;
}
/**
 * Create a block root vnode. Takes the same exact arguments as `createVNode`.
 * A block root keeps track of dynamic nodes within the block in the
 * `dynamicChildren` array.
 *
 * @private
 */
function createBlock(type, props, children, patchFlag, dynamicProps) {
    const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true /* isBlock: prevent a block from tracking itself */);
    // save current block children on the block vnode
    vnode.dynamicChildren = currentBlock || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_ARR */ "a"];
    // close block
    closeBlock();
    // a block is always going to be patched, so track it as a child of its
    // parent block
    if (shouldTrack > 0 && currentBlock) {
        currentBlock.push(vnode);
    }
    return vnode;
}
function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
    if (( true) &&
        n2.shapeFlag & 6 /* COMPONENT */ &&
        hmrDirtyComponents.has(n2.type)) {
        // HMR only: if the component has been hot-updated, force a reload.
        return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
}
let vnodeArgsTransformer;
/**
 * Internal API for registering an arguments transform for createVNode
 * used for creating stubs in the test-utils
 * It is *internal* but needs to be exposed for test-utils to pick up proper
 * typings
 */
function transformVNodeArgs(transformer) {
    vnodeArgsTransformer = transformer;
}
const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(...(vnodeArgsTransformer
        ? vnodeArgsTransformer(args, currentRenderingInstance)
        : args));
};
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref }) => {
    return (ref != null
        ? Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(ref)
            ? ref
            : [currentRenderingInstance, ref]
        : null);
};
const createVNode = (( true)
    ? createVNodeWithArgsTransform
    : undefined);
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
        if (( true) && !type) {
            warn(`Invalid vnode type when creating vnode: ${type}.`);
        }
        type = Comment;
    }
    if (isVNode(type)) {
        const cloned = cloneVNode(type, props);
        if (children) {
            normalizeChildren(cloned, children);
        }
        return cloned;
    }
    // class component normalization.
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(type) && '__vccOpts' in type) {
        type = type.__vccOpts;
    }
    // class & style normalization.
    if (props) {
        // for reactive or proxy objects, we need to clone it to enable mutation.
        if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isProxy */ "c"])(props) || InternalObjectKey in props) {
            props = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, props);
        }
        let { class: klass, style } = props;
        if (klass && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(klass)) {
            props.class = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* normalizeClass */ "E"])(klass);
        }
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(style)) {
            // reactive state objects need to be cloned since they are likely to be
            // mutated
            if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isProxy */ "c"])(style) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(style)) {
                style = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, style);
            }
            props.style = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* normalizeStyle */ "F"])(style);
        }
    }
    // encode the vnode type information into a bitmap
    const shapeFlag = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(type)
        ? 1 /* ELEMENT */
        :  isSuspense(type)
            ? 128 /* SUSPENSE */
            : isTeleport(type)
                ? 64 /* TELEPORT */
                : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(type)
                    ? 4 /* STATEFUL_COMPONENT */
                    : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(type)
                        ? 2 /* FUNCTIONAL_COMPONENT */
                        : 0;
    if (( true) && shapeFlag & 4 /* STATEFUL_COMPONENT */ && Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isProxy */ "c"])(type)) {
        type = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(type);
        warn(`Vue received a Component which was made a reactive object. This can ` +
            `lead to unnecessary performance overhead, and should be avoided by ` +
            `marking the component with \`markRaw\` or using \`shallowRef\` ` +
            `instead of \`ref\`.`, `\nComponent that was made reactive: `, type);
    }
    const vnode = {
        __v_isVNode: true,
        ["__v_skip" /* SKIP */]: true,
        type,
        props,
        key: props && normalizeKey(props),
        ref: props && normalizeRef(props),
        scopeId: currentScopeId,
        children: null,
        component: null,
        suspense: null,
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
        appContext: null
    };
    // validate key
    if (( true) && vnode.key !== vnode.key) {
        warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    normalizeChildren(vnode, children);
    if (shouldTrack > 0 &&
        // avoid a block node from tracking itself
        !isBlockNode &&
        // has current parent block
        currentBlock &&
        // presence of a patch flag indicates this node needs patching on updates.
        // component nodes also should always be patched, because even if the
        // component doesn't need to update, it needs to persist the instance on to
        // the next vnode so that it can be properly unmounted later.
        (patchFlag > 0 || shapeFlag & 6 /* COMPONENT */) &&
        // the EVENTS flag is only for hydration and if it is the only flag, the
        // vnode should not be considered dynamic due to handler caching.
        patchFlag !== 32 /* HYDRATE_EVENTS */) {
        currentBlock.push(vnode);
    }
    return vnode;
}
function cloneVNode(vnode, extraProps) {
    // This is intentionally NOT using spread or extend to avoid the runtime
    // key enumeration cost.
    const { props, patchFlag } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    return {
        __v_isVNode: true,
        ["__v_skip" /* SKIP */]: true,
        type: vnode.type,
        props: mergedProps,
        key: mergedProps && normalizeKey(mergedProps),
        ref: extraProps && extraProps.ref ? normalizeRef(extraProps) : vnode.ref,
        scopeId: vnode.scopeId,
        children: vnode.children,
        target: vnode.target,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        // if the vnode is cloned with extra props, we can no longer assume its
        // existing patch flag to be reliable and need to add the FULL_PROPS flag.
        // note: perserve flag for fragments since they use the flag for children
        // fast paths only.
        patchFlag: extraProps && vnode.type !== Fragment
            ? patchFlag === -1 // hoisted node
                ? 16 /* FULL_PROPS */
                : patchFlag | 16 /* FULL_PROPS */
            : patchFlag,
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
        el: vnode.el,
        anchor: vnode.anchor
    };
}
/**
 * @private
 */
function createTextVNode(text = ' ', flag = 0) {
    return createVNode(Text, null, text, flag);
}
/**
 * @private
 */
function createStaticVNode(content, numberOfNodes) {
    // A static vnode can contain multiple stringified elements, and the number
    // of elements is necessary for hydration.
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
}
/**
 * @private
 */
function createCommentVNode(text = '', 
// when used as the v-else branch, the comment node must be created as a
// block to ensure correct updates.
asBlock = false) {
    return asBlock
        ? (openBlock(), createBlock(Comment, null, text))
        : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
    if (child == null || typeof child === 'boolean') {
        // empty placeholder
        return createVNode(Comment);
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(child)) {
        // fragment
        return createVNode(Fragment, null, child);
    }
    else if (typeof child === 'object') {
        // already vnode, this should be the most common since compiled templates
        // always produce all-vnode children arrays
        return child.el === null ? child : cloneVNode(child);
    }
    else {
        // strings and numbers
        return createVNode(Text, null, String(child));
    }
}
// optimized normalization for template-compiled render fns
function cloneIfMounted(child) {
    return child.el === null ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
        children = null;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(children)) {
        type = 16 /* ARRAY_CHILDREN */;
    }
    else if (typeof children === 'object') {
        if (shapeFlag & 1 /* ELEMENT */ || shapeFlag & 64 /* TELEPORT */) {
            // Normalize slot to plain children for plain element and Teleport
            const slot = children.default;
            if (slot) {
                // _c marker is added by withCtx() indicating this is a compiled slot
                slot._c && setCompiledSlotRendering(1);
                normalizeChildren(vnode, slot());
                slot._c && setCompiledSlotRendering(-1);
            }
            return;
        }
        else {
            type = 32 /* SLOTS_CHILDREN */;
            const slotFlag = children._;
            if (!slotFlag && !(InternalObjectKey in children)) {
                children._ctx = currentRenderingInstance;
            }
            else if (slotFlag === 3 /* FORWARDED */ && currentRenderingInstance) {
                // a child component receives forwarded slots from the parent.
                // its slot type is determined by its parent's slot type.
                if (currentRenderingInstance.vnode.patchFlag & 1024 /* DYNAMIC_SLOTS */) {
                    children._ = 2 /* DYNAMIC */;
                    vnode.patchFlag |= 1024 /* DYNAMIC_SLOTS */;
                }
                else {
                    children._ = 1 /* STABLE */;
                }
            }
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(children)) {
        children = { default: children, _ctx: currentRenderingInstance };
        type = 32 /* SLOTS_CHILDREN */;
    }
    else {
        children = String(children);
        // force teleport children to array so it can be moved around
        if (shapeFlag & 64 /* TELEPORT */) {
            type = 16 /* ARRAY_CHILDREN */;
            children = [createTextVNode(children)];
        }
        else {
            type = 8 /* TEXT_CHILDREN */;
        }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
}
function mergeProps(...args) {
    const ret = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, args[0]);
    for (let i = 1; i < args.length; i++) {
        const toMerge = args[i];
        for (const key in toMerge) {
            if (key === 'class') {
                if (ret.class !== toMerge.class) {
                    ret.class = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* normalizeClass */ "E"])([ret.class, toMerge.class]);
                }
            }
            else if (key === 'style') {
                ret.style = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* normalizeStyle */ "F"])([ret.style, toMerge.style]);
            }
            else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isOn */ "u"])(key)) {
                const existing = ret[key];
                const incoming = toMerge[key];
                if (existing !== incoming) {
                    ret[key] = existing
                        ? [].concat(existing, toMerge[key])
                        : incoming;
                }
            }
            else {
                ret[key] = toMerge[key];
            }
        }
    }
    return ret;
}

let devtools;
function setDevtoolsHook(hook) {
    devtools = hook;
}
function devtoolsInitApp(app, version) {
    // TODO queue if devtools is undefined
    if (!devtools)
        return;
    devtools.emit("app:init" /* APP_INIT */, app, version, {
        Fragment,
        Text,
        Comment,
        Static
    });
}
function devtoolsUnmountApp(app) {
    if (!devtools)
        return;
    devtools.emit("app:unmount" /* APP_UNMOUNT */, app);
}
const devtoolsComponentAdded = /*#__PURE__*/ createDevtoolsComponentHook("component:added" /* COMPONENT_ADDED */);
const devtoolsComponentUpdated = /*#__PURE__*/ createDevtoolsComponentHook("component:updated" /* COMPONENT_UPDATED */);
const devtoolsComponentRemoved = /*#__PURE__*/ createDevtoolsComponentHook("component:removed" /* COMPONENT_REMOVED */);
function createDevtoolsComponentHook(hook) {
    return (component) => {
        if (!devtools)
            return;
        devtools.emit(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : undefined);
    };
}
function devtoolsComponentEmit(component, event, params) {
    if (!devtools)
        return;
    devtools.emit("component:emit" /* COMPONENT_EMIT */, component.appContext.app, component, event, params);
}

function emit(instance, event, ...args) {
    const props = instance.vnode.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
    if ((true)) {
        const { emitsOptions, propsOptions: [propsOptions] } = instance;
        if (emitsOptions) {
            if (!(event in emitsOptions)) {
                if (!propsOptions || !(`on` + Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(event) in propsOptions)) {
                    warn(`Component emitted event "${event}" but it is neither declared in ` +
                        `the emits option nor as an "on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(event)}" prop.`);
                }
            }
            else {
                const validator = emitsOptions[event];
                if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(validator)) {
                    const isValid = validator(...args);
                    if (!isValid) {
                        warn(`Invalid event arguments: event validation failed for event "${event}".`);
                    }
                }
            }
        }
    }
    if (true) {
        devtoolsComponentEmit(instance, event, args);
    }
    let handlerName = `on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(event)}`;
    let handler = props[handlerName];
    // for v-model update:xxx events, also trigger kebab-case equivalent
    // for props passed via kebab-case
    if (!handler && event.startsWith('update:')) {
        handlerName = `on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hyphenate */ "l"])(event))}`;
        handler = props[handlerName];
    }
    if (!handler) {
        handler = props[handlerName + `Once`];
        if (!instance.emitted) {
            (instance.emitted = {})[handlerName] = true;
        }
        else if (instance.emitted[handlerName]) {
            return;
        }
    }
    if (handler) {
        callWithAsyncErrorHandling(handler, instance, 6 /* COMPONENT_EVENT_HANDLER */, args);
    }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const appId = appContext.app ? appContext.app._uid : -1;
    const cache = comp.__emits || (comp.__emits = {});
    const cached = cache[appId];
    if (cached !== undefined) {
        return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    // apply mixin/extends props
    let hasExtends = false;
    if (__VUE_OPTIONS_API__ && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(comp)) {
        const extendEmits = (raw) => {
            hasExtends = true;
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(normalized, normalizeEmitsOptions(raw, appContext, true));
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
        return (cache[appId] = null);
    }
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(raw)) {
        raw.forEach(key => (normalized[key] = null));
    }
    else {
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(normalized, raw);
    }
    return (cache[appId] = normalized);
}
// Check if an incoming prop key is a declared emit event listener.
// e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
// both considered matched listeners.
function isEmitListener(options, key) {
    if (!options || !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isOn */ "u"])(key)) {
        return false;
    }
    key = key.replace(/Once$/, '');
    return (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(options, key[2].toLowerCase() + key.slice(3)) ||
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(options, key.slice(2)));
}

function initProps(instance, rawProps, isStateful, // result of bitwise flag comparison
isSSR = false) {
    const props = {};
    const attrs = {};
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* def */ "g"])(attrs, InternalObjectKey, 1);
    setFullProps(instance, rawProps, props, attrs);
    // validation
    if ((true)) {
        validateProps(props, instance);
    }
    if (isStateful) {
        // stateful
        instance.props = isSSR ? props : Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReactive */ "k"])(props);
    }
    else {
        if (!instance.type.props) {
            // functional w/ optional props, props === attrs
            instance.props = attrs;
        }
        else {
            // functional w/ declared props
            instance.props = props;
        }
    }
    instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const { props, attrs, vnode: { patchFlag } } = instance;
    const rawCurrentProps = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(props);
    const [options] = instance.propsOptions;
    if (
    // always force full diff if hmr is enabled
    !(( true) && instance.type.__hmrId) &&
        (optimized || patchFlag > 0) &&
        !(patchFlag & 16 /* FULL_PROPS */)) {
        if (patchFlag & 8 /* PROPS */) {
            // Compiler-generated props & no keys change, just set the updated
            // the props.
            const propsToUpdate = instance.vnode.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
                const key = propsToUpdate[i];
                // PROPS flag guarantees rawProps to be non-null
                const value = rawProps[key];
                if (options) {
                    // attr / props separation was done on init and will be consistent
                    // in this code path, so just check if attrs have it.
                    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(attrs, key)) {
                        attrs[key] = value;
                    }
                    else {
                        const camelizedKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(key);
                        props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value);
                    }
                }
                else {
                    attrs[key] = value;
                }
            }
        }
    }
    else {
        // full props update.
        setFullProps(instance, rawProps, props, attrs);
        // in case of dynamic props, check if we need to delete keys from
        // the props object
        let kebabKey;
        for (const key in rawCurrentProps) {
            if (!rawProps ||
                // for camelCase
                (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(rawProps, key) &&
                    // it's possible the original props was passed in as kebab-case
                    // and converted to camelCase (#955)
                    ((kebabKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hyphenate */ "l"])(key)) === key || !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(rawProps, kebabKey)))) {
                if (options) {
                    if (rawPrevProps &&
                        // for camelCase
                        (rawPrevProps[key] !== undefined ||
                            // for kebab-case
                            rawPrevProps[kebabKey] !== undefined)) {
                        props[key] = resolvePropValue(options, rawProps || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"], key, undefined);
                    }
                }
                else {
                    delete props[key];
                }
            }
        }
        // in the case of functional component w/o props declaration, props and
        // attrs point to the same object so it should already have been updated.
        if (attrs !== rawCurrentProps) {
            for (const key in attrs) {
                if (!rawProps || !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(rawProps, key)) {
                    delete attrs[key];
                }
            }
        }
    }
    // trigger updates for $attrs in case it's used in component slots
    Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* trigger */ "p"])(instance, "set" /* SET */, '$attrs');
    if (( true) && rawProps) {
        validateProps(props, instance);
    }
}
function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    if (rawProps) {
        for (const key in rawProps) {
            const value = rawProps[key];
            // key, ref are reserved and never passed down
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isReservedProp */ "w"])(key)) {
                continue;
            }
            // prop option names are camelized during normalization, so to support
            // kebab -> camel conversion here we need to camelize the key.
            let camelKey;
            if (options && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(options, (camelKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(key)))) {
                props[camelKey] = value;
            }
            else if (!isEmitListener(instance.emitsOptions, key)) {
                // Any non-declared (either as a prop or an emitted event) props are put
                // into a separate `attrs` object for spreading. Make sure to preserve
                // original key casing
                attrs[key] = value;
            }
        }
    }
    if (needCastKeys) {
        const rawCurrentProps = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(props);
        for (let i = 0; i < needCastKeys.length; i++) {
            const key = needCastKeys[i];
            props[key] = resolvePropValue(options, rawCurrentProps, key, rawCurrentProps[key]);
        }
    }
}
function resolvePropValue(options, props, key, value) {
    const opt = options[key];
    if (opt != null) {
        const hasDefault = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(opt, 'default');
        // default values
        if (hasDefault && value === undefined) {
            const defaultValue = opt.default;
            value =
                opt.type !== Function && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(defaultValue)
                    ? defaultValue(props)
                    : defaultValue;
        }
        // boolean casting
        if (opt[0 /* shouldCast */]) {
            if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(props, key) && !hasDefault) {
                value = false;
            }
            else if (opt[1 /* shouldCastTrue */] &&
                (value === '' || value === Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hyphenate */ "l"])(key))) {
                value = true;
            }
        }
    }
    return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
    const appId = appContext.app ? appContext.app._uid : -1;
    const cache = comp.__props || (comp.__props = {});
    const cached = cache[appId];
    if (cached) {
        return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    // apply mixin/extends props
    let hasExtends = false;
    if (__VUE_OPTIONS_API__ && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(comp)) {
        const extendProps = (raw) => {
            hasExtends = true;
            const [props, keys] = normalizePropsOptions(raw, appContext, true);
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(normalized, props);
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
        return (cache[appId] = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_ARR */ "a"]);
    }
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(raw)) {
        for (let i = 0; i < raw.length; i++) {
            if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(raw[i])) {
                warn(`props must be strings when using array syntax.`, raw[i]);
            }
            const normalizedKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(raw[i]);
            if (validatePropName(normalizedKey)) {
                normalized[normalizedKey] = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
            }
        }
    }
    else if (raw) {
        if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(raw)) {
            warn(`invalid props options`, raw);
        }
        for (const key in raw) {
            const normalizedKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* camelize */ "e"])(key);
            if (validatePropName(normalizedKey)) {
                const opt = raw[key];
                const prop = (normalized[normalizedKey] =
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(opt) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(opt) ? { type: opt } : opt);
                if (prop) {
                    const booleanIndex = getTypeIndex(Boolean, prop.type);
                    const stringIndex = getTypeIndex(String, prop.type);
                    prop[0 /* shouldCast */] = booleanIndex > -1;
                    prop[1 /* shouldCastTrue */] =
                        stringIndex < 0 || booleanIndex < stringIndex;
                    // if the prop needs boolean casting or default value
                    if (booleanIndex > -1 || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(prop, 'default')) {
                        needCastKeys.push(normalizedKey);
                    }
                }
            }
        }
    }
    return (cache[appId] = [normalized, needCastKeys]);
}
// use function string name to check type constructors
// so that it works across vms / iframes.
function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : '';
}
function isSameType(a, b) {
    return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(expectedTypes)) {
        for (let i = 0, len = expectedTypes.length; i < len; i++) {
            if (isSameType(expectedTypes[i], type)) {
                return i;
            }
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
}
/**
 * dev only
 */
function validateProps(props, instance) {
    const rawValues = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(props);
    const options = instance.propsOptions[0];
    for (const key in options) {
        let opt = options[key];
        if (opt == null)
            continue;
        validateProp(key, rawValues[key], opt, !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(rawValues, key));
    }
}
/**
 * dev only
 */
function validatePropName(key) {
    if (key[0] !== '$') {
        return true;
    }
    else if ((true)) {
        warn(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
}
/**
 * dev only
 */
function validateProp(name, value, prop, isAbsent) {
    const { type, required, validator } = prop;
    // required!
    if (required && isAbsent) {
        warn('Missing required prop: "' + name + '"');
        return;
    }
    // missing but optional
    if (value == null && !prop.required) {
        return;
    }
    // type check
    if (type != null && type !== true) {
        let isValid = false;
        const types = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(type) ? type : [type];
        const expectedTypes = [];
        // value is valid as long as one of the specified types match
        for (let i = 0; i < types.length && !isValid; i++) {
            const { valid, expectedType } = assertType(value, types[i]);
            expectedTypes.push(expectedType || '');
            isValid = valid;
        }
        if (!isValid) {
            warn(getInvalidTypeMessage(name, value, expectedTypes));
            return;
        }
    }
    // custom validator
    if (validator && !validator(value)) {
        warn('Invalid prop: custom validator check failed for prop "' + name + '".');
    }
}
const isSimpleType = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* makeMap */ "D"])('String,Number,Boolean,Function,Symbol');
/**
 * dev only
 */
function assertType(value, type) {
    let valid;
    const expectedType = getType(type);
    if (isSimpleType(expectedType)) {
        const t = typeof value;
        valid = t === expectedType.toLowerCase();
        // for primitive wrapper objects
        if (!valid && t === 'object') {
            valid = value instanceof type;
        }
    }
    else if (expectedType === 'Object') {
        valid = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(value);
    }
    else if (expectedType === 'Array') {
        valid = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(value);
    }
    else {
        valid = value instanceof type;
    }
    return {
        valid,
        expectedType
    };
}
/**
 * dev only
 */
function getInvalidTypeMessage(name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}".` +
        ` Expected ${expectedTypes.map(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"]).join(', ')}`;
    const expectedType = expectedTypes[0];
    const receivedType = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* toRawType */ "I"])(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
        message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
        message += `with value ${receivedValue}.`;
    }
    return message;
}
/**
 * dev only
 */
function styleValue(value, type) {
    if (type === 'String') {
        return `"${value}"`;
    }
    else if (type === 'Number') {
        return `${Number(value)}`;
    }
    else {
        return `${value}`;
    }
}
/**
 * dev only
 */
function isExplicable(type) {
    const explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(elem => type.toLowerCase() === elem);
}
/**
 * dev only
 */
function isBoolean(...args) {
    return args.some(elem => elem.toLowerCase() === 'boolean');
}

function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
        const hooks = target[type] || (target[type] = []);
        // cache the error handling wrapper for injected hooks so the same hook
        // can be properly deduped by the scheduler. "__weh" stands for "with error
        // handling".
        const wrappedHook = hook.__weh ||
            (hook.__weh = (...args) => {
                if (target.isUnmounted) {
                    return;
                }
                // disable tracking inside all lifecycle hooks
                // since they can potentially be called inside effects.
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* pauseTracking */ "f"])();
                // Set currentInstance during hook invocation.
                // This assumes the hook does not synchronously trigger other hooks, which
                // can only be false when the user does something really funky.
                setCurrentInstance(target);
                const res = callWithAsyncErrorHandling(hook, target, type, args);
                setCurrentInstance(null);
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* resetTracking */ "j"])();
                return res;
            });
        if (prepend) {
            hooks.unshift(wrappedHook);
        }
        else {
            hooks.push(wrappedHook);
        }
        return wrappedHook;
    }
    else if ((true)) {
        const apiName = `on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(ErrorTypeStrings[type].replace(/ hook$/, ''))}`;
        warn(`${apiName} is called when there is no active component instance to be ` +
            `associated with. ` +
            `Lifecycle injection APIs can only be used during execution of setup().` +
            ( ` If you are using async setup(), make sure to register lifecycle ` +
                    `hooks before the first await statement.`
                ));
    }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => 
// post-create lifecycle registrations are noops during SSR
!isInSSRComponentSetup && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm" /* BEFORE_MOUNT */);
const onMounted = createHook("m" /* MOUNTED */);
const onBeforeUpdate = createHook("bu" /* BEFORE_UPDATE */);
const onUpdated = createHook("u" /* UPDATED */);
const onBeforeUnmount = createHook("bum" /* BEFORE_UNMOUNT */);
const onUnmounted = createHook("um" /* UNMOUNTED */);
const onRenderTriggered = createHook("rtg" /* RENDER_TRIGGERED */);
const onRenderTracked = createHook("rtc" /* RENDER_TRACKED */);
const onErrorCaptured = (hook, target = currentInstance) => {
    injectHook("ec" /* ERROR_CAPTURED */, hook, target);
};

function useTransitionState() {
    const state = {
        isMounted: false,
        isLeaving: false,
        isUnmounting: false,
        leavingVNodes: new Map()
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
const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: {
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
    },
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const state = useTransitionState();
        let prevTransitionKey;
        return () => {
            const children = slots.default && getTransitionRawChildren(slots.default(), true);
            if (!children || !children.length) {
                return;
            }
            // warn multiple elements
            if (( true) && children.length > 1) {
                warn('<transition> can only be used on a single element or component. Use ' +
                    '<transition-group> for lists.');
            }
            // there's no need to track reactivity for these props so use the raw
            // props for a bit better perf
            const rawProps = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(props);
            const { mode } = rawProps;
            // check mode
            if (( true) && mode && !['in-out', 'out-in', 'default'].includes(mode)) {
                warn(`invalid <transition> mode: ${mode}`);
            }
            // at this point children has a guaranteed length of 1.
            const child = children[0];
            if (state.isLeaving) {
                return emptyPlaceholder(child);
            }
            // in the case of <transition><keep-alive/></transition>, we need to
            // compare the type of the kept-alive children.
            const innerChild = getKeepAliveChild(child);
            if (!innerChild) {
                return emptyPlaceholder(child);
            }
            const enterHooks = (innerChild.transition = resolveTransitionHooks(innerChild, rawProps, state, instance));
            const oldChild = instance.subTree;
            const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
            let transitionKeyChanged = false;
            const { getTransitionKey } = innerChild.type;
            if (getTransitionKey) {
                const key = getTransitionKey();
                if (prevTransitionKey === undefined) {
                    prevTransitionKey = key;
                }
                else if (key !== prevTransitionKey) {
                    prevTransitionKey = key;
                    transitionKeyChanged = true;
                }
            }
            // handle mode
            if (oldInnerChild &&
                oldInnerChild.type !== Comment &&
                (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
                const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
                // update old tree's hooks in case of dynamic transition
                setTransitionHooks(oldInnerChild, leavingHooks);
                // switching between different views
                if (mode === 'out-in') {
                    state.isLeaving = true;
                    // return placeholder node and queue update when leave finishes
                    leavingHooks.afterLeave = () => {
                        state.isLeaving = false;
                        instance.update();
                    };
                    return emptyPlaceholder(child);
                }
                else if (mode === 'in-out') {
                    leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
                        const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
                        leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
                        // early removal callback
                        el._leaveCb = () => {
                            earlyRemove();
                            el._leaveCb = undefined;
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
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
        leavingVNodesCache = Object.create(null);
        leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
}
// The transition hooks are attached to the vnode as vnode.transition
// and will be called at appropriate timing in the renderer.
function resolveTransitionHooks(vnode, { appear, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled }, state, instance) {
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook = (hook, args) => {
        hook &&
            callWithAsyncErrorHandling(hook, instance, 9 /* TRANSITION_HOOK */, args);
    };
    const hooks = {
        persisted,
        beforeEnter(el) {
            let hook = onBeforeEnter;
            if (!state.isMounted) {
                if (appear) {
                    hook = onBeforeAppear || onBeforeEnter;
                }
                else {
                    return;
                }
            }
            // for same element (v-show)
            if (el._leaveCb) {
                el._leaveCb(true /* cancelled */);
            }
            // for toggled element with same key (v-if)
            const leavingVNode = leavingVNodesCache[key];
            if (leavingVNode &&
                isSameVNodeType(vnode, leavingVNode) &&
                leavingVNode.el._leaveCb) {
                // force early removal (not cancelled)
                leavingVNode.el._leaveCb();
            }
            callHook(hook, [el]);
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
                }
                else {
                    return;
                }
            }
            let called = false;
            const done = (el._enterCb = (cancelled) => {
                if (called)
                    return;
                called = true;
                if (cancelled) {
                    callHook(cancelHook, [el]);
                }
                else {
                    callHook(afterHook, [el]);
                }
                if (hooks.delayedLeave) {
                    hooks.delayedLeave();
                }
                el._enterCb = undefined;
            });
            if (hook) {
                hook(el, done);
                if (hook.length <= 1) {
                    done();
                }
            }
            else {
                done();
            }
        },
        leave(el, remove) {
            const key = String(vnode.key);
            if (el._enterCb) {
                el._enterCb(true /* cancelled */);
            }
            if (state.isUnmounting) {
                return remove();
            }
            callHook(onBeforeLeave, [el]);
            let called = false;
            const done = (el._leaveCb = (cancelled) => {
                if (called)
                    return;
                called = true;
                remove();
                if (cancelled) {
                    callHook(onLeaveCancelled, [el]);
                }
                else {
                    callHook(onAfterLeave, [el]);
                }
                el._leaveCb = undefined;
                if (leavingVNodesCache[key] === vnode) {
                    delete leavingVNodesCache[key];
                }
            });
            leavingVNodesCache[key] = vnode;
            if (onLeave) {
                onLeave(el, done);
                if (onLeave.length <= 1) {
                    done();
                }
            }
            else {
                done();
            }
        }
    };
    return hooks;
}
// the placeholder really only handles one special case: KeepAlive
// in the case of a KeepAlive in a leave phase we need to return a KeepAlive
// placeholder with empty content to avoid the KeepAlive instance from being
// unmounted.
function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
        vnode = cloneVNode(vnode);
        vnode.children = null;
        return vnode;
    }
}
function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode)
        ? vnode.children
            ? vnode.children[0]
            : undefined
        : vnode;
}
function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 /* COMPONENT */ && vnode.component) {
        setTransitionHooks(vnode.component.subTree, hooks);
    }
    else {
        vnode.transition = hooks;
    }
}
function getTransitionRawChildren(children, keepComment = false) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // handle fragment children case, e.g. v-for
        if (child.type === Fragment) {
            if (child.patchFlag & 128 /* KEYED_FRAGMENT */)
                keyedFragmentCount++;
            ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
        }
        // comment placeholders should be skipped, e.g. v-if
        else if (keepComment || child.type !== Comment) {
            ret.push(child);
        }
    }
    // #1126 if a transition children list contains multiple sub fragments, these
    // fragments will be merged into a flat children array. Since each v-for
    // fragment may contain different static bindings inside, we need to de-top
    // these children to force full diffs to ensure correct behavior.
    if (keyedFragmentCount > 1) {
        for (let i = 0; i < ret.length; i++) {
            ret[i].patchFlag = -2 /* BAIL */;
        }
    }
    return ret;
}

const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    inheritRef: true,
    props: {
        include: [String, RegExp, Array],
        exclude: [String, RegExp, Array],
        max: [String, Number]
    },
    setup(props, { slots }) {
        const cache = new Map();
        const keys = new Set();
        let current = null;
        const instance = getCurrentInstance();
        const parentSuspense = instance.suspense;
        // KeepAlive communicates with the instantiated renderer via the
        // ctx where the renderer passes in its internals,
        // and the KeepAlive instance exposes activate/deactivate implementations.
        // The whole point of this is to avoid importing KeepAlive directly in the
        // renderer to facilitate tree-shaking.
        const sharedContext = instance.ctx;
        const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
        const storageContainer = createElement('div');
        sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
            const instance = vnode.component;
            move(vnode, container, anchor, 0 /* ENTER */, parentSuspense);
            // in case props have changed
            patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, optimized);
            queuePostRenderEffect(() => {
                instance.isDeactivated = false;
                if (instance.a) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(instance.a);
                }
                const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
                if (vnodeHook) {
                    invokeVNodeHook(vnodeHook, instance.parent, vnode);
                }
            }, parentSuspense);
        };
        sharedContext.deactivate = (vnode) => {
            const instance = vnode.component;
            move(vnode, storageContainer, null, 1 /* LEAVE */, parentSuspense);
            queuePostRenderEffect(() => {
                if (instance.da) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(instance.da);
                }
                const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
                if (vnodeHook) {
                    invokeVNodeHook(vnodeHook, instance.parent, vnode);
                }
                instance.isDeactivated = true;
            }, parentSuspense);
        };
        function unmount(vnode) {
            // reset the shapeFlag so it can be properly unmounted
            resetShapeFlag(vnode);
            _unmount(vnode, instance, parentSuspense);
        }
        function pruneCache(filter) {
            cache.forEach((vnode, key) => {
                const name = getName(vnode.type);
                if (name && (!filter || !filter(name))) {
                    pruneCacheEntry(key);
                }
            });
        }
        function pruneCacheEntry(key) {
            const cached = cache.get(key);
            if (!current || cached.type !== current.type) {
                unmount(cached);
            }
            else if (current) {
                // current active instance should no longer be kept-alive.
                // we can't unmount it now but it might be later, so reset its flag now.
                resetShapeFlag(current);
            }
            cache.delete(key);
            keys.delete(key);
        }
        watch(() => [props.include, props.exclude], ([include, exclude]) => {
            include && pruneCache(name => matches(include, name));
            exclude && pruneCache(name => matches(exclude, name));
        });
        // cache sub tree in beforeMount/Update (i.e. right after the render)
        let pendingCacheKey = null;
        const cacheSubtree = () => {
            // fix #1621, the pendingCacheKey could be 0
            if (pendingCacheKey != null) {
                cache.set(pendingCacheKey, instance.subTree);
            }
        };
        onBeforeMount(cacheSubtree);
        onBeforeUpdate(cacheSubtree);
        onBeforeUnmount(() => {
            cache.forEach(cached => {
                const { subTree, suspense } = instance;
                if (cached.type === subTree.type) {
                    // current instance will be unmounted as part of keep-alive's unmount
                    resetShapeFlag(subTree);
                    // but invoke its deactivated hook here
                    const da = subTree.component.da;
                    da && queuePostRenderEffect(da, suspense);
                    return;
                }
                unmount(cached);
            });
        });
        return () => {
            pendingCacheKey = null;
            if (!slots.default) {
                return null;
            }
            const children = slots.default();
            let vnode = children[0];
            if (children.length > 1) {
                if ((true)) {
                    warn(`KeepAlive should contain exactly one component child.`);
                }
                current = null;
                return children;
            }
            else if (!isVNode(vnode) ||
                !(vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */)) {
                current = null;
                return vnode;
            }
            const comp = vnode.type;
            const name = getName(comp);
            const { include, exclude, max } = props;
            if ((include && (!name || !matches(include, name))) ||
                (exclude && name && matches(exclude, name))) {
                return (current = vnode);
            }
            const key = vnode.key == null ? comp : vnode.key;
            const cachedVNode = cache.get(key);
            // clone vnode if it's reused because we are going to mutate it
            if (vnode.el) {
                vnode = cloneVNode(vnode);
            }
            // #1513 it's possible for the returned vnode to be cloned due to attr
            // fallthrough or scopeId, so the vnode here may not be the final vnode
            // that is mounted. Instead of caching it directly, we store the pending
            // key and cache `instance.subTree` (the normalized vnode) in
            // beforeMount/beforeUpdate hooks.
            pendingCacheKey = key;
            if (cachedVNode) {
                // copy over mounted state
                vnode.el = cachedVNode.el;
                vnode.component = cachedVNode.component;
                if (vnode.transition) {
                    // recursively update transition hooks on subTree
                    setTransitionHooks(vnode, vnode.transition);
                }
                // avoid vnode being mounted as fresh
                vnode.shapeFlag |= 512 /* COMPONENT_KEPT_ALIVE */;
                // make this key the freshest
                keys.delete(key);
                keys.add(key);
            }
            else {
                keys.add(key);
                // prune oldest entry
                if (max && keys.size > parseInt(max, 10)) {
                    pruneCacheEntry(keys.values().next().value);
                }
            }
            // avoid vnode being unmounted
            vnode.shapeFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
            current = vnode;
            return vnode;
        };
    }
};
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
const KeepAlive = KeepAliveImpl;
function getName(comp) {
    return comp.displayName || comp.name;
}
function matches(pattern, name) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(pattern)) {
        return pattern.some((p) => matches(p, name));
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(pattern)) {
        return pattern.split(',').indexOf(name) > -1;
    }
    else if (pattern.test) {
        return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
}
function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a" /* ACTIVATED */, target);
}
function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da" /* DEACTIVATED */, target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
    // cache the deactivate branch check wrapper for injected hooks so the same
    // hook can be properly deduped by the scheduler. "__wdc" stands for "with
    // deactivation check".
    const wrappedHook = hook.__wdc ||
        (hook.__wdc = () => {
            // only fire the hook if the target instance is NOT in a deactivated branch.
            let current = target;
            while (current) {
                if (current.isDeactivated) {
                    return;
                }
                current = current.parent;
            }
            hook();
        });
    injectHook(type, wrappedHook, target);
    // In addition to registering it on the target instance, we walk up the parent
    // chain and register it on all ancestor instances that are keep-alive roots.
    // This avoids the need to walk the entire component tree when invoking these
    // hooks, and more importantly, avoids the need to track child components in
    // arrays.
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
    // injectHook wraps the original for error handling, so make sure to remove
    // the wrapped version.
    const injected = injectHook(type, hook, keepAliveRoot, true /* prepend */);
    onUnmounted(() => {
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* remove */ "G"])(keepAliveRoot[type], injected);
    }, target);
}
function resetShapeFlag(vnode) {
    let shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
        shapeFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
    }
    if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
        shapeFlag -= 512 /* COMPONENT_KEPT_ALIVE */;
    }
    vnode.shapeFlag = shapeFlag;
}

const isInternalKey = (key) => key[0] === '_' || key === '$stable';
const normalizeSlotValue = (value) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(value)
    ? value.map(normalizeVNode)
    : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => withCtx((props) => {
    if (( true) && currentInstance) {
        warn(`Slot "${key}" invoked outside of the render function: ` +
            `this will not track dependencies used in the slot. ` +
            `Invoke the slot function inside the render function instead.`);
    }
    return normalizeSlotValue(rawSlot(props));
}, ctx);
const normalizeObjectSlots = (rawSlots, slots) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
        if (isInternalKey(key))
            continue;
        const value = rawSlots[key];
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(value)) {
            slots[key] = normalizeSlot(key, value, ctx);
        }
        else if (value != null) {
            if ((true)) {
                warn(`Non-function value encountered for slot "${key}". ` +
                    `Prefer function slots for better performance.`);
            }
            const normalized = normalizeSlotValue(value);
            slots[key] = () => normalized;
        }
    }
};
const normalizeVNodeSlots = (instance, children) => {
    if (( true) && !isKeepAlive(instance.vnode)) {
        warn(`Non-function value encountered for default slot. ` +
            `Prefer function slots for better performance.`);
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
        const type = children._;
        if (type) {
            instance.slots = children;
            // make compiler marker non-enumerable
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* def */ "g"])(children, '_', type);
        }
        else {
            normalizeObjectSlots(children, (instance.slots = {}));
        }
    }
    else {
        instance.slots = {};
        if (children) {
            normalizeVNodeSlots(instance, children);
        }
    }
    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* def */ "g"])(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
    if (vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
        const type = children._;
        if (type) {
            // compiled slots.
            if (( true) && isHmrUpdating) {
                // Parent was HMR updated so slot content may have changed.
                // force update slots and mark instance for hmr as well
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(slots, children);
            }
            else if (type === 1 /* STABLE */) {
                // compiled AND stable.
                // no need to update, and skip stale slots removal.
                needDeletionCheck = false;
            }
            else {
                // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
                // normalization.
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(slots, children);
            }
        }
        else {
            needDeletionCheck = !children.$stable;
            normalizeObjectSlots(children, slots);
        }
        deletionComparisonTarget = children;
    }
    else if (children) {
        // non slot object children (direct value) passed to a component
        normalizeVNodeSlots(instance, children);
        deletionComparisonTarget = { default: 1 };
    }
    // delete stale slots
    if (needDeletionCheck) {
        for (const key in slots) {
            if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
                delete slots[key];
            }
        }
    }
};

/**
Runtime helper for applying directives to a vnode. Example usage:

const comp = resolveComponent('comp')
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h(comp), [
  [foo, this.x],
  [bar, this.y]
])
*/
const isBuiltInDirective = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* makeMap */ "D"])('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text');
function validateDirectiveName(name) {
    if (isBuiltInDirective(name)) {
        warn('Do not use built-in directive ids as custom directive id: ' + name);
    }
}
/**
 * Adds directives to a VNode.
 */
function withDirectives(vnode, directives) {
    const internalInstance = currentRenderingInstance;
    if (internalInstance === null) {
        ( true) && warn(`withDirectives can only be used inside render functions.`);
        return vnode;
    }
    const instance = internalInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
        let [dir, value, arg, modifiers = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"]] = directives[i];
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(dir)) {
            dir = {
                mounted: dir,
                updated: dir
            };
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
        const hook = binding.dir[name];
        if (hook) {
            callWithAsyncErrorHandling(hook, instance, 8 /* DIRECTIVE_HOOK */, [
                vnode.el,
                binding,
                vnode,
                prevVNode
            ]);
        }
    }
}

function createAppContext() {
    return {
        app: null,
        config: {
            isNativeTag: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NO */ "c"],
            performance: false,
            globalProperties: {},
            optionMergeStrategies: {},
            isCustomElement: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NO */ "c"],
            errorHandler: undefined,
            warnHandler: undefined
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null)
    };
}
let uid = 0;
function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps = null) {
        if (rootProps != null && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(rootProps)) {
            ( true) && warn(`root props passed to app.mount() must be an object.`);
            rootProps = null;
        }
        const context = createAppContext();
        const installedPlugins = new Set();
        let isMounted = false;
        const app = (context.app = {
            _uid: uid++,
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            _context: context,
            version,
            get config() {
                return context.config;
            },
            set config(v) {
                if ((true)) {
                    warn(`app.config cannot be replaced. Modify individual options instead.`);
                }
            },
            use(plugin, ...options) {
                if (installedPlugins.has(plugin)) {
                    ( true) && warn(`Plugin has already been applied to target app.`);
                }
                else if (plugin && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(plugin.install)) {
                    installedPlugins.add(plugin);
                    plugin.install(app, ...options);
                }
                else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(plugin)) {
                    installedPlugins.add(plugin);
                    plugin(app, ...options);
                }
                else if ((true)) {
                    warn(`A plugin must either be a function or an object with an "install" ` +
                        `function.`);
                }
                return app;
            },
            mixin(mixin) {
                if (__VUE_OPTIONS_API__) {
                    if (!context.mixins.includes(mixin)) {
                        context.mixins.push(mixin);
                    }
                    else if ((true)) {
                        warn('Mixin has already been applied to target app' +
                            (mixin.name ? `: ${mixin.name}` : ''));
                    }
                }
                else if ((true)) {
                    warn('Mixins are only available in builds supporting Options API');
                }
                return app;
            },
            component(name, component) {
                if ((true)) {
                    validateComponentName(name, context.config);
                }
                if (!component) {
                    return context.components[name];
                }
                if (( true) && context.components[name]) {
                    warn(`Component "${name}" has already been registered in target app.`);
                }
                context.components[name] = component;
                return app;
            },
            directive(name, directive) {
                if ((true)) {
                    validateDirectiveName(name);
                }
                if (!directive) {
                    return context.directives[name];
                }
                if (( true) && context.directives[name]) {
                    warn(`Directive "${name}" has already been registered in target app.`);
                }
                context.directives[name] = directive;
                return app;
            },
            mount(rootContainer, isHydrate) {
                if (!isMounted) {
                    const vnode = createVNode(rootComponent, rootProps);
                    // store app context on the root VNode.
                    // this will be set on the root instance on initial mount.
                    vnode.appContext = context;
                    // HMR root reload
                    if ((true)) {
                        context.reload = () => {
                            render(cloneVNode(vnode), rootContainer);
                        };
                    }
                    if (isHydrate && hydrate) {
                        hydrate(vnode, rootContainer);
                    }
                    else {
                        render(vnode, rootContainer);
                    }
                    isMounted = true;
                    app._container = rootContainer;
                    rootContainer.__vue_app__ = app;
                    if (true) {
                        devtoolsInitApp(app, version);
                    }
                    return vnode.component.proxy;
                }
                else if ((true)) {
                    warn(`App has already been mounted.\n` +
                        `If you want to remount the same app, move your app creation logic ` +
                        `into a factory function and create fresh app instances for each ` +
                        `mount - e.g. \`const createMyApp = () => createApp(App)\``);
                }
            },
            unmount() {
                if (isMounted) {
                    render(null, app._container);
                    if (true) {
                        devtoolsUnmountApp(app);
                    }
                }
                else if ((true)) {
                    warn(`Cannot unmount an app that is not mounted.`);
                }
            },
            provide(key, value) {
                if (( true) && key in context.provides) {
                    warn(`App already provides property with key "${String(key)}". ` +
                        `It will be overwritten with the new value.`);
                }
                // TypeScript doesn't allow symbols as index type
                // https://github.com/Microsoft/TypeScript/issues/24587
                context.provides[key] = value;
                return app;
            }
        });
        return app;
    };
}

let hasMismatch = false;
const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== 'foreignObject';
const isComment = (node) => node.nodeType === 8 /* COMMENT */;
// Note: hydration is DOM-specific
// But we have to place it in core due to tight coupling with core - splitting
// it out creates a ton of unnecessary complexity.
// Hydration also depends on some renderer internal logic which needs to be
// passed in via arguments.
function createHydrationFunctions(rendererInternals) {
    const { mt: mountComponent, p: patch, o: { patchProp, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
    const hydrate = (vnode, container) => {
        if (( true) && !container.hasChildNodes()) {
            warn(`Attempting to hydrate existing markup but container is empty. ` +
                `Performing full mount instead.`);
            patch(null, vnode, container);
            return;
        }
        hasMismatch = false;
        hydrateNode(container.firstChild, vnode, null, null);
        flushPostFlushCbs();
        if (hasMismatch && !false) {
            // this error should show up in production
            console.error(`Hydration completed but contains mismatches.`);
        }
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, optimized = false) => {
        const isFragmentStart = isComment(node) && node.data === '[';
        const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, isFragmentStart);
        const { type, ref, shapeFlag } = vnode;
        const domType = node.nodeType;
        vnode.el = node;
        let nextNode = null;
        switch (type) {
            case Text:
                if (domType !== 3 /* TEXT */) {
                    nextNode = onMismatch();
                }
                else {
                    if (node.data !== vnode.children) {
                        hasMismatch = true;
                        ( true) &&
                            warn(`Hydration text mismatch:` +
                                `\n- Client: ${JSON.stringify(node.data)}` +
                                `\n- Server: ${JSON.stringify(vnode.children)}`);
                        node.data = vnode.children;
                    }
                    nextNode = nextSibling(node);
                }
                break;
            case Comment:
                if (domType !== 8 /* COMMENT */ || isFragmentStart) {
                    nextNode = onMismatch();
                }
                else {
                    nextNode = nextSibling(node);
                }
                break;
            case Static:
                if (domType !== 1 /* ELEMENT */) {
                    nextNode = onMismatch();
                }
                else {
                    // determine anchor, adopt content
                    nextNode = node;
                    // if the static vnode has its content stripped during build,
                    // adopt it from the server-rendered HTML.
                    const needToAdoptContent = !vnode.children.length;
                    for (let i = 0; i < vnode.staticCount; i++) {
                        if (needToAdoptContent)
                            vnode.children += nextNode.outerHTML;
                        if (i === vnode.staticCount - 1) {
                            vnode.anchor = nextNode;
                        }
                        nextNode = nextSibling(nextNode);
                    }
                    return nextNode;
                }
                break;
            case Fragment:
                if (!isFragmentStart) {
                    nextNode = onMismatch();
                }
                else {
                    nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, optimized);
                }
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    if (domType !== 1 /* ELEMENT */ ||
                        vnode.type !== node.tagName.toLowerCase()) {
                        nextNode = onMismatch();
                    }
                    else {
                        nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, optimized);
                    }
                }
                else if (shapeFlag & 6 /* COMPONENT */) {
                    // when setting up the render effect, if the initial vnode already
                    // has .el set, the component will perform hydration instead of mount
                    // on its sub-tree.
                    const container = parentNode(node);
                    const hydrateComponent = () => {
                        mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
                    };
                    // async component
                    const loadAsync = vnode.type.__asyncLoader;
                    if (loadAsync) {
                        loadAsync().then(hydrateComponent);
                    }
                    else {
                        hydrateComponent();
                    }
                    // component may be async, so in the case of fragments we cannot rely
                    // on component's rendered output to determine the end of the fragment
                    // instead, we do a lookahead to find the end anchor node.
                    nextNode = isFragmentStart
                        ? locateClosingAsyncAnchor(node)
                        : nextSibling(node);
                }
                else if (shapeFlag & 64 /* TELEPORT */) {
                    if (domType !== 8 /* COMMENT */) {
                        nextNode = onMismatch();
                    }
                    else {
                        nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, optimized, rendererInternals, hydrateChildren);
                    }
                }
                else if ( shapeFlag & 128 /* SUSPENSE */) {
                    nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), optimized, rendererInternals, hydrateNode);
                }
                else if ((true)) {
                    warn('Invalid HostVNode type:', type, `(${typeof type})`);
                }
        }
        if (ref != null && parentComponent) {
            setRef(ref, null, parentComponent, parentSuspense, vnode);
        }
        return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, optimized) => {
        optimized = optimized || !!vnode.dynamicChildren;
        const { props, patchFlag, shapeFlag, dirs } = vnode;
        // skip props & children if this is hoisted static nodes
        if (patchFlag !== -1 /* HOISTED */) {
            if (dirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'created');
            }
            // props
            if (props) {
                if (!optimized ||
                    (patchFlag & 16 /* FULL_PROPS */ ||
                        patchFlag & 32 /* HYDRATE_EVENTS */)) {
                    for (const key in props) {
                        if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isReservedProp */ "w"])(key) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isOn */ "u"])(key)) {
                            patchProp(el, key, null, props[key]);
                        }
                    }
                }
                else if (props.onClick) {
                    // Fast path for click listeners (which is most often) to avoid
                    // iterating through props.
                    patchProp(el, 'onClick', null, props.onClick);
                }
            }
            // vnode / directive hooks
            let vnodeHooks;
            if ((vnodeHooks = props && props.onVnodeBeforeMount)) {
                invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            }
            if (dirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
            }
            if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
                queueEffectWithSuspense(() => {
                    vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
                    dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
                }, parentSuspense);
            }
            // children
            if (shapeFlag & 16 /* ARRAY_CHILDREN */ &&
                // skip if element has innerHTML / textContent
                !(props && (props.innerHTML || props.textContent))) {
                let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, optimized);
                let hasWarned = false;
                while (next) {
                    hasMismatch = true;
                    if (( true) && !hasWarned) {
                        warn(`Hydration children mismatch in <${vnode.type}>: ` +
                            `server rendered element contains more child nodes than client vdom.`);
                        hasWarned = true;
                    }
                    // The SSRed DOM contains more nodes than it should. Remove them.
                    const cur = next;
                    next = next.nextSibling;
                    remove(cur);
                }
            }
            else if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                if (el.textContent !== vnode.children) {
                    hasMismatch = true;
                    ( true) &&
                        warn(`Hydration text content mismatch in <${vnode.type}>:\n` +
                            `- Client: ${el.textContent}\n` +
                            `- Server: ${vnode.children}`);
                    el.textContent = vnode.children;
                }
            }
        }
        return el.nextSibling;
    };
    const hydrateChildren = (node, vnode, container, parentComponent, parentSuspense, optimized) => {
        optimized = optimized || !!vnode.dynamicChildren;
        const children = vnode.children;
        const l = children.length;
        let hasWarned = false;
        for (let i = 0; i < l; i++) {
            const vnode = optimized
                ? children[i]
                : (children[i] = normalizeVNode(children[i]));
            if (node) {
                node = hydrateNode(node, vnode, parentComponent, parentSuspense, optimized);
            }
            else {
                hasMismatch = true;
                if (( true) && !hasWarned) {
                    warn(`Hydration children mismatch in <${container.tagName.toLowerCase()}>: ` +
                        `server rendered element contains fewer child nodes than client vdom.`);
                    hasWarned = true;
                }
                // the SSRed DOM didn't contain enough nodes. Mount the missing ones.
                patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container));
            }
        }
        return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, optimized) => {
        const container = parentNode(node);
        const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, optimized);
        if (next && isComment(next) && next.data === ']') {
            return nextSibling((vnode.anchor = next));
        }
        else {
            // fragment didn't hydrate successfully, since we didn't get a end anchor
            // back. This should have led to node/children mismatch warnings.
            hasMismatch = true;
            // since the anchor is missing, we need to create one and insert it
            insert((vnode.anchor = createComment(`]`)), container, next);
            return next;
        }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, isFragment) => {
        hasMismatch = true;
        ( true) &&
            warn(`Hydration node mismatch:\n- Client vnode:`, vnode.type, `\n- Server rendered DOM:`, node, node.nodeType === 3 /* TEXT */
                ? `(text)`
                : isComment(node) && node.data === '['
                    ? `(start of fragment)`
                    : ``);
        vnode.el = null;
        if (isFragment) {
            // remove excessive fragment nodes
            const end = locateClosingAsyncAnchor(node);
            while (true) {
                const next = nextSibling(node);
                if (next && next !== end) {
                    remove(next);
                }
                else {
                    break;
                }
            }
        }
        const next = nextSibling(node);
        const container = parentNode(node);
        remove(node);
        patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container));
        return next;
    };
    const locateClosingAsyncAnchor = (node) => {
        let match = 0;
        while (node) {
            node = nextSibling(node);
            if (node && isComment(node)) {
                if (node.data === '[')
                    match++;
                if (node.data === ']') {
                    if (match === 0) {
                        return nextSibling(node);
                    }
                    else {
                        match--;
                    }
                }
            }
        }
        return node;
    };
    return [hydrate, hydrateNode];
}

let supported;
let perf;
function startMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
        perf.mark(`vue-${type}-${instance.uid}`);
    }
}
function endMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
        const startTag = `vue-${type}-${instance.uid}`;
        const endTag = startTag + `:end`;
        perf.mark(endTag);
        perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
    }
}
function isSupported() {
    if (supported !== undefined) {
        return supported;
    }
    /* eslint-disable no-restricted-globals */
    if (typeof window !== 'undefined' && window.performance) {
        supported = true;
        perf = window.performance;
    }
    else {
        supported = false;
    }
    /* eslint-enable no-restricted-globals */
    return supported;
}

/**
 * This is only called in esm-bundler builds.
 * It is called when a renderer is created, in `baseCreateRenderer` so that
 * importing runtime-core is side-effects free.
 *
 * istanbul-ignore-next
 */
function initFeatureFlags() {
    let needWarn = false;
    if (typeof __VUE_OPTIONS_API__ !== 'boolean') {
        needWarn = true;
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* getGlobalThis */ "i"])().__VUE_OPTIONS_API__ = true;
    }
    if (typeof __VUE_PROD_DEVTOOLS__ !== 'boolean') {
        needWarn = true;
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* getGlobalThis */ "i"])().__VUE_PROD_DEVTOOLS__ = false;
    }
    if (( true) && needWarn) {
        console.warn(`You are running the esm-bundler build of Vue. It is recommended to ` +
            `configure your bundler to explicitly replace feature flag globals ` +
            `with boolean literals to get proper tree-shaking in the final bundle. ` +
            `See http://link.vuejs.org/feature-flags for more details.`);
    }
}

const prodEffectOptions = {
    scheduler: queueJob
};
function createDevEffectOptions(instance) {
    return {
        scheduler: queueJob,
        onTrack: instance.rtc ? e => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(instance.rtc, e) : void 0,
        onTrigger: instance.rtg ? e => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(instance.rtg, e) : void 0
    };
}
const queuePostRenderEffect =  queueEffectWithSuspense
    ;
const setRef = (rawRef, oldRawRef, parentComponent, parentSuspense, vnode) => {
    let value;
    if (!vnode) {
        value = null;
    }
    else {
        if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
            value = vnode.component.proxy;
        }
        else {
            value = vnode.el;
        }
    }
    const [owner, ref] = rawRef;
    if (( true) && !owner) {
        warn(`Missing ref owner context. ref cannot be used on hoisted vnodes. ` +
            `A vnode with ref must be created inside the render function.`);
        return;
    }
    const oldRef = oldRawRef && oldRawRef[1];
    const refs = owner.refs === _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] ? (owner.refs = {}) : owner.refs;
    const setupState = owner.setupState;
    // unset old ref
    if (oldRef != null && oldRef !== ref) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(oldRef)) {
            refs[oldRef] = null;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(setupState, oldRef)) {
                setupState[oldRef] = null;
            }
        }
        else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isRef */ "e"])(oldRef)) {
            oldRef.value = null;
        }
    }
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(ref)) {
        const doSet = () => {
            refs[ref] = value;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(setupState, ref)) {
                setupState[ref] = value;
            }
        };
        // #1789: for non-null values, set them after render
        // null values means this is unmount and it should not overwrite another
        // ref with the same key
        if (value) {
            doSet.id = -1;
            queuePostRenderEffect(doSet, parentSuspense);
        }
        else {
            doSet();
        }
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isRef */ "e"])(ref)) {
        const doSet = () => {
            ref.value = value;
        };
        if (value) {
            doSet.id = -1;
            queuePostRenderEffect(doSet, parentSuspense);
        }
        else {
            doSet();
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(ref)) {
        callWithErrorHandling(ref, parentComponent, 12 /* FUNCTION_REF */, [
            value,
            refs
        ]);
    }
    else if ((true)) {
        warn('Invalid template ref type:', value, `(${typeof value})`);
    }
};
/**
 * The createRenderer function accepts two generic arguments:
 * HostNode and HostElement, corresponding to Node and Element types in the
 * host environment. For example, for runtime-dom, HostNode would be the DOM
 * `Node` interface and HostElement would be the DOM `Element` interface.
 *
 * Custom renderers can pass in the platform specific types like this:
 *
 * ``` js
 * const { render, createApp } = createRenderer<Node, Element>({
 *   patchProp,
 *   ...nodeOps
 * })
 * ```
 */
function createRenderer(options) {
    return baseCreateRenderer(options);
}
// Separate API for creating hydration-enabled renderer.
// Hydration logic is only used when calling this function, making it
// tree-shakable.
function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
}
// implementation
function baseCreateRenderer(options, createHydrationFns) {
    // compile-time feature flags check
    {
        initFeatureFlags();
    }
    const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, forcePatchProp: hostForcePatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"], cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
    // Note: functions inside this closure should use `const xxx = () => {}`
    // style in order to prevent being inlined by minifiers.
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
        // patching & not same type, unmount old tree
        if (n1 && !isSameVNodeType(n1, n2)) {
            anchor = getNextHostNode(n1);
            unmount(n1, parentComponent, parentSuspense, true);
            n1 = null;
        }
        if (n2.patchFlag === -2 /* BAIL */) {
            optimized = false;
            n2.dynamicChildren = null;
        }
        const { type, ref, shapeFlag } = n2;
        switch (type) {
            case Text:
                processText(n1, n2, container, anchor);
                break;
            case Comment:
                processCommentNode(n1, n2, container, anchor);
                break;
            case Static:
                if (n1 == null) {
                    mountStaticNode(n2, container, anchor, isSVG);
                }
                else if ((true)) {
                    patchStaticNode(n1, n2, container, isSVG);
                }
                break;
            case Fragment:
                processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
                else if (shapeFlag & 6 /* COMPONENT */) {
                    processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
                else if (shapeFlag & 64 /* TELEPORT */) {
                    type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
                }
                else if ( shapeFlag & 128 /* SUSPENSE */) {
                    type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
                }
                else if ((true)) {
                    warn('Invalid VNode type:', type, `(${typeof type})`);
                }
        }
        // set ref
        if (ref != null && parentComponent) {
            setRef(ref, n1 && n1.ref, parentComponent, parentSuspense, n2);
        }
    };
    const processText = (n1, n2, container, anchor) => {
        if (n1 == null) {
            hostInsert((n2.el = hostCreateText(n2.children)), container, anchor);
        }
        else {
            const el = (n2.el = n1.el);
            if (n2.children !== n1.children) {
                hostSetText(el, n2.children);
            }
        }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
        if (n1 == null) {
            hostInsert((n2.el = hostCreateComment(n2.children || '')), container, anchor);
        }
        else {
            // there's no support for dynamic comments
            n2.el = n1.el;
        }
    };
    const mountStaticNode = (n2, container, anchor, isSVG) => {
        [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
    };
    /**
     * Dev / HMR only
     */
    const patchStaticNode = (n1, n2, container, isSVG) => {
        // static nodes are only patched during dev for HMR
        if (n2.children !== n1.children) {
            const anchor = hostNextSibling(n1.anchor);
            // remove existing
            removeStaticNode(n1);
            [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
        }
        else {
            n2.el = n1.el;
            n2.anchor = n1.anchor;
        }
    };
    /**
     * Dev / HMR only
     */
    const moveStaticNode = (vnode, container, anchor) => {
        let cur = vnode.el;
        const end = vnode.anchor;
        while (cur && cur !== end) {
            const next = hostNextSibling(cur);
            hostInsert(cur, container, anchor);
            cur = next;
        }
        hostInsert(end, container, anchor);
    };
    /**
     * Dev / HMR only
     */
    const removeStaticNode = (vnode) => {
        let cur = vnode.el;
        while (cur && cur !== vnode.anchor) {
            const next = hostNextSibling(cur);
            hostRemove(cur);
            cur = next;
        }
        hostRemove(vnode.anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        isSVG = isSVG || n2.type === 'svg';
        if (n1 == null) {
            mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
        else {
            patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized);
        }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        let el;
        let vnodeHook;
        const { type, props, shapeFlag, transition, scopeId, patchFlag, dirs } = vnode;
        if (false /* HOISTED */) {}
        else {
            el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is);
            // mount children first, since some props may rely on child content
            // being already rendered, e.g. `<select value>`
            if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                hostSetElementText(el, vnode.children);
            }
            else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', optimized || !!vnode.dynamicChildren);
            }
            if (dirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'created');
            }
            // props
            if (props) {
                for (const key in props) {
                    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isReservedProp */ "w"])(key)) {
                        hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                    }
                }
                if ((vnodeHook = props.onVnodeBeforeMount)) {
                    invokeVNodeHook(vnodeHook, parentComponent, vnode);
                }
            }
            // scopeId
            setScopeId(el, scopeId, vnode, parentComponent);
            // if (scopeId) {
            //   hostSetScopeId(el, scopeId)
            // }
            // if (parentComponent) {
            //   const treeOwnerId = parentComponent.type.__scopeId
            //   // vnode's own scopeId and the current patched component's scopeId is
            //   // different - this is a slot content node.
            //   if (treeOwnerId && treeOwnerId !== scopeId) {
            //     hostSetScopeId(el, treeOwnerId + '-s')
            //   }
            //   const parentScopeId =
            //     vnode === parentComponent.subTree && parentComponent.vnode.scopeId
            //   if (parentScopeId) {
            //     hostSetScopeId(el, parentScopeId)
            //     if (parentComponent.parent) {
            //       const treeOwnerId = parentComponent.parent.type.__scopeId
            //       // vnode's own scopeId and the current patched component's scopeId is
            //       // different - this is a slot content node.
            //       if (treeOwnerId && treeOwnerId !== parentScopeId) {
            //         hostSetScopeId(el, treeOwnerId + '-s')
            //       }
            //     }
            //   }
            // }
        }
        if (true) {
            Object.defineProperty(el, '__vnode', {
                value: vnode,
                enumerable: false
            });
            Object.defineProperty(el, '__vueParentComponent', {
                value: parentComponent,
                enumerable: false
            });
        }
        if (dirs) {
            invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
        }
        // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved
        // #1689 For inside suspense + suspense resolved case, just call it
        const needCallTransitionHooks = (!parentSuspense || (parentSuspense && parentSuspense.isResolved)) &&
            transition &&
            !transition.persisted;
        if (needCallTransitionHooks) {
            transition.beforeEnter(el);
        }
        hostInsert(el, container, anchor);
        if ((vnodeHook = props && props.onVnodeMounted) ||
            needCallTransitionHooks ||
            dirs) {
            queuePostRenderEffect(() => {
                vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
                needCallTransitionHooks && transition.enter(el);
                dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
            }, parentSuspense);
        }
    };
    const setScopeId = (el, scopeId, vnode, parentComponent) => {
        if (scopeId) {
            hostSetScopeId(el, scopeId);
        }
        if (parentComponent) {
            const treeOwnerId = parentComponent.type.__scopeId;
            // vnode's own scopeId and the current patched component's scopeId is
            // different - this is a slot content node.
            if (treeOwnerId && treeOwnerId !== scopeId) {
                hostSetScopeId(el, treeOwnerId + '-s');
            }
            if (vnode === parentComponent.subTree) {
                setScopeId(el, parentComponent.vnode.scopeId, parentComponent.vnode, parentComponent.parent);
            }
        }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, start = 0) => {
        for (let i = start; i < children.length; i++) {
            const child = (children[i] = optimized
                ? cloneIfMounted(children[i])
                : normalizeVNode(children[i]));
            patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
        const el = (n2.el = n1.el);
        let { patchFlag, dynamicChildren, dirs } = n2;
        // #1426 take the old vnode's patch flag into account since user may clone a
        // compiler-generated vnode, which de-opts to FULL_PROPS
        patchFlag |= n1.patchFlag & 16 /* FULL_PROPS */;
        const oldProps = n1.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
        const newProps = n2.props || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
        let vnodeHook;
        if ((vnodeHook = newProps.onVnodeBeforeUpdate)) {
            invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        }
        if (dirs) {
            invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
        }
        if (( true) && isHmrUpdating) {
            // HMR updated, force full diff
            patchFlag = 0;
            optimized = false;
            dynamicChildren = null;
        }
        if (patchFlag > 0) {
            // the presence of a patchFlag means this element's render code was
            // generated by the compiler and can take the fast path.
            // in this path old node and new node are guaranteed to have the same shape
            // (i.e. at the exact same position in the source template)
            if (patchFlag & 16 /* FULL_PROPS */) {
                // element props contain dynamic keys, full diff needed
                patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
            }
            else {
                // class
                // this flag is matched when the element has dynamic class bindings.
                if (patchFlag & 2 /* CLASS */) {
                    if (oldProps.class !== newProps.class) {
                        hostPatchProp(el, 'class', null, newProps.class, isSVG);
                    }
                }
                // style
                // this flag is matched when the element has dynamic style bindings
                if (patchFlag & 4 /* STYLE */) {
                    hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
                }
                // props
                // This flag is matched when the element has dynamic prop/attr bindings
                // other than class and style. The keys of dynamic prop/attrs are saved for
                // faster iteration.
                // Note dynamic keys like :[foo]="bar" will cause this optimization to
                // bail out and go through a full diff because we need to unset the old key
                if (patchFlag & 8 /* PROPS */) {
                    // if the flag is present then dynamicProps must be non-null
                    const propsToUpdate = n2.dynamicProps;
                    for (let i = 0; i < propsToUpdate.length; i++) {
                        const key = propsToUpdate[i];
                        const prev = oldProps[key];
                        const next = newProps[key];
                        if (next !== prev ||
                            (hostForcePatchProp && hostForcePatchProp(el, key))) {
                            hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
                        }
                    }
                }
            }
            // text
            // This flag is matched when the element has only dynamic text children.
            if (patchFlag & 1 /* TEXT */) {
                if (n1.children !== n2.children) {
                    hostSetElementText(el, n2.children);
                }
            }
        }
        else if (!optimized && dynamicChildren == null) {
            // unoptimized, full diff
            patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        }
        const areChildrenSVG = isSVG && n2.type !== 'foreignObject';
        if (dynamicChildren) {
            patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG);
            if (( true) && parentComponent && parentComponent.type.__hmrId) {
                traverseStaticChildren(n1, n2);
            }
        }
        else if (!optimized) {
            // full diff
            patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG);
        }
        if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
            queuePostRenderEffect(() => {
                vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
                dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
            }, parentSuspense);
        }
    };
    // The fast path for blocks.
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG) => {
        for (let i = 0; i < newChildren.length; i++) {
            const oldVNode = oldChildren[i];
            const newVNode = newChildren[i];
            // Determine the container (parent element) for the patch.
            const container = 
            // - In the case of a Fragment, we need to provide the actual parent
            // of the Fragment itself so it can move its children.
            oldVNode.type === Fragment ||
                // - In the case of different nodes, there is going to be a replacement
                // which also requires the correct parent container
                !isSameVNodeType(oldVNode, newVNode) ||
                // - In the case of a component, it could contain anything.
                oldVNode.shapeFlag & 6 /* COMPONENT */ ||
                oldVNode.shapeFlag & 64 /* TELEPORT */
                ? hostParentNode(oldVNode.el)
                : // In other cases, the parent container is not actually used so we
                    // just pass the block element here to avoid a DOM parentNode call.
                    fallbackContainer;
            patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, true);
        }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isReservedProp */ "w"])(key))
                    continue;
                const next = newProps[key];
                const prev = oldProps[key];
                if (next !== prev ||
                    (hostForcePatchProp && hostForcePatchProp(el, key))) {
                    hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                }
            }
            if (oldProps !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"]) {
                for (const key in oldProps) {
                    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isReservedProp */ "w"])(key) && !(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                    }
                }
            }
        }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        const fragmentStartAnchor = (n2.el = n1 ? n1.el : hostCreateText(''));
        const fragmentEndAnchor = (n2.anchor = n1 ? n1.anchor : hostCreateText(''));
        let { patchFlag, dynamicChildren } = n2;
        if (patchFlag > 0) {
            optimized = true;
        }
        if (( true) && isHmrUpdating) {
            // HMR updated, force full diff
            patchFlag = 0;
            optimized = false;
            dynamicChildren = null;
        }
        if (n1 == null) {
            hostInsert(fragmentStartAnchor, container, anchor);
            hostInsert(fragmentEndAnchor, container, anchor);
            // a fragment can only have array children
            // since they are either generated by the compiler, or implicitly created
            // from arrays.
            mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
        }
        else {
            if (patchFlag > 0 &&
                patchFlag & 64 /* STABLE_FRAGMENT */ &&
                dynamicChildren) {
                // a stable fragment (template root or <template v-for>) doesn't need to
                // patch children order, but it may contain dynamicChildren.
                patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG);
                if (( true) && parentComponent && parentComponent.type.__hmrId) {
                    traverseStaticChildren(n1, n2);
                }
            }
            else {
                // keyed / unkeyed, or manual fragments.
                // for keyed & unkeyed, since they are compiler generated from v-for,
                // each child is guaranteed to be a block so the fragment will never
                // have dynamicChildren.
                patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
            }
        }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        if (n1 == null) {
            if (n2.shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
                parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
            }
            else {
                mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
            }
        }
        else {
            updateComponent(n1, n2, optimized);
        }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense));
        if (( true) && instance.type.__hmrId) {
            registerHMR(instance);
        }
        if ((true)) {
            pushWarningContext(initialVNode);
            startMeasure(instance, `mount`);
        }
        // inject renderer internals for keepAlive
        if (isKeepAlive(initialVNode)) {
            instance.ctx.renderer = internals;
        }
        // resolve props and slots for setup context
        if ((true)) {
            startMeasure(instance, `init`);
        }
        setupComponent(instance);
        if ((true)) {
            endMeasure(instance, `init`);
        }
        // setup() is async. This component relies on async logic to be resolved
        // before proceeding
        if ( instance.asyncDep) {
            if (!parentSuspense) {
                if ((true))
                    warn('async setup() is used without a suspense boundary!');
                return;
            }
            parentSuspense.registerDep(instance, setupRenderEffect);
            // Give it a placeholder if this is not hydration
            if (!initialVNode.el) {
                const placeholder = (instance.subTree = createVNode(Comment));
                processCommentNode(null, placeholder, container, anchor);
            }
            return;
        }
        setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
        if ((true)) {
            popWarningContext();
            endMeasure(instance, `mount`);
        }
    };
    const updateComponent = (n1, n2, optimized) => {
        const instance = (n2.component = n1.component);
        if (shouldUpdateComponent(n1, n2, optimized)) {
            if (
                instance.asyncDep &&
                !instance.asyncResolved) {
                // async & still pending - just update props and slots
                // since the component's reactive effect for render isn't set-up yet
                if ((true)) {
                    pushWarningContext(n2);
                }
                updateComponentPreRender(instance, n2, optimized);
                if ((true)) {
                    popWarningContext();
                }
                return;
            }
            else {
                // normal update
                instance.next = n2;
                // in case the child component is also queued, remove it to avoid
                // double updating the same child component in the same flush.
                invalidateJob(instance.update);
                // instance.update is the reactive effect runner.
                instance.update();
            }
        }
        else {
            // no update needed. just copy over properties
            n2.component = n1.component;
            n2.el = n1.el;
            instance.vnode = n2;
        }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
        // create reactive effect for rendering
        instance.update = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* effect */ "b"])(function componentEffect() {
            if (!instance.isMounted) {
                let vnodeHook;
                const { el, props } = initialVNode;
                const { bm, m, parent } = instance;
                // beforeMount hook
                if (bm) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(bm);
                }
                // onVnodeBeforeMount
                if ((vnodeHook = props && props.onVnodeBeforeMount)) {
                    invokeVNodeHook(vnodeHook, parent, initialVNode);
                }
                // render
                if ((true)) {
                    startMeasure(instance, `render`);
                }
                const subTree = (instance.subTree = renderComponentRoot(instance));
                if ((true)) {
                    endMeasure(instance, `render`);
                }
                if (el && hydrateNode) {
                    if ((true)) {
                        startMeasure(instance, `hydrate`);
                    }
                    // vnode has adopted host node - perform hydration instead of mount.
                    hydrateNode(initialVNode.el, subTree, instance, parentSuspense);
                    if ((true)) {
                        endMeasure(instance, `hydrate`);
                    }
                }
                else {
                    if ((true)) {
                        startMeasure(instance, `patch`);
                    }
                    patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
                    if ((true)) {
                        endMeasure(instance, `patch`);
                    }
                    initialVNode.el = subTree.el;
                }
                // mounted hook
                if (m) {
                    queuePostRenderEffect(m, parentSuspense);
                }
                // onVnodeMounted
                if ((vnodeHook = props && props.onVnodeMounted)) {
                    queuePostRenderEffect(() => {
                        invokeVNodeHook(vnodeHook, parent, initialVNode);
                    }, parentSuspense);
                }
                // activated hook for keep-alive roots.
                // #1742 activated hook must be accessed after first render
                // since the hook may be injected by a child keep-alive
                const { a } = instance;
                if (a &&
                    initialVNode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
                    queuePostRenderEffect(a, parentSuspense);
                }
                instance.isMounted = true;
            }
            else {
                // updateComponent
                // This is triggered by mutation of component's own state (next: null)
                // OR parent calling processComponent (next: VNode)
                let { next, bu, u, parent, vnode } = instance;
                let originNext = next;
                let vnodeHook;
                if ((true)) {
                    pushWarningContext(next || instance.vnode);
                }
                if (next) {
                    updateComponentPreRender(instance, next, optimized);
                }
                else {
                    next = vnode;
                }
                next.el = vnode.el;
                // beforeUpdate hook
                if (bu) {
                    Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(bu);
                }
                // onVnodeBeforeUpdate
                if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
                    invokeVNodeHook(vnodeHook, parent, next, vnode);
                }
                // render
                if ((true)) {
                    startMeasure(instance, `render`);
                }
                const nextTree = renderComponentRoot(instance);
                if ((true)) {
                    endMeasure(instance, `render`);
                }
                const prevTree = instance.subTree;
                instance.subTree = nextTree;
                // reset refs
                // only needed if previous patch had refs
                if (instance.refs !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"]) {
                    instance.refs = {};
                }
                if ((true)) {
                    startMeasure(instance, `patch`);
                }
                patch(prevTree, nextTree, 
                // parent may have changed if it's in a teleport
                hostParentNode(prevTree.el), 
                // anchor may have changed if it's in a fragment
                getNextHostNode(prevTree), instance, parentSuspense, isSVG);
                if ((true)) {
                    endMeasure(instance, `patch`);
                }
                next.el = nextTree.el;
                if (originNext === null) {
                    // self-triggered update. In case of HOC, update parent component
                    // vnode el. HOC is indicated by parent instance's subTree pointing
                    // to child component's vnode
                    updateHOCHostEl(instance, nextTree.el);
                }
                // updated hook
                if (u) {
                    queuePostRenderEffect(u, parentSuspense);
                }
                // onVnodeUpdated
                if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
                    queuePostRenderEffect(() => {
                        invokeVNodeHook(vnodeHook, parent, next, vnode);
                    }, parentSuspense);
                }
                if (true) {
                    devtoolsComponentUpdated(instance);
                }
                if ((true)) {
                    popWarningContext();
                }
            }
        }, ( true) ? createDevEffectOptions(instance) : undefined);
        instance.update.allowRecurse = true;
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
        nextVNode.component = instance;
        const prevProps = instance.vnode.props;
        instance.vnode = nextVNode;
        instance.next = null;
        updateProps(instance, nextVNode.props, prevProps, optimized);
        updateSlots(instance, nextVNode.children);
        // props update may have triggered pre-flush watchers.
        // flush them before the render update.
        flushPreFlushCbs(undefined, instance.update);
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
        const c1 = n1 && n1.children;
        const prevShapeFlag = n1 ? n1.shapeFlag : 0;
        const c2 = n2.children;
        const { patchFlag, shapeFlag } = n2;
        // fast path
        if (patchFlag > 0) {
            if (patchFlag & 128 /* KEYED_FRAGMENT */) {
                // this could be either fully-keyed or mixed (some keyed some not)
                // presence of patchFlag means children are guaranteed to be arrays
                patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                return;
            }
            else if (patchFlag & 256 /* UNKEYED_FRAGMENT */) {
                // unkeyed
                patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                return;
            }
        }
        // children has 3 possibilities: text, array or no children.
        if (shapeFlag & 8 /* TEXT_CHILDREN */) {
            // text children fast path
            if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                unmountChildren(c1, parentComponent, parentSuspense);
            }
            if (c2 !== c1) {
                hostSetElementText(container, c2);
            }
        }
        else {
            if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                // prev children was array
                if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    // two arrays, cannot assume anything, do full diff
                    patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
                else {
                    // no new children, just unmount old
                    unmountChildren(c1, parentComponent, parentSuspense, true);
                }
            }
            else {
                // prev children was text OR null
                // new children is array OR null
                if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
                    hostSetElementText(container, '');
                }
                // mount new if array
                if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                    mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                }
            }
        }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
        c1 = c1 || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_ARR */ "a"];
        c2 = c2 || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_ARR */ "a"];
        const oldLength = c1.length;
        const newLength = c2.length;
        const commonLength = Math.min(oldLength, newLength);
        let i;
        for (i = 0; i < commonLength; i++) {
            const nextChild = (c2[i] = optimized
                ? cloneIfMounted(c2[i])
                : normalizeVNode(c2[i]));
            patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, optimized);
        }
        if (oldLength > newLength) {
            // remove old
            unmountChildren(c1, parentComponent, parentSuspense, true, commonLength);
        }
        else {
            // mount new
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, commonLength);
        }
    };
    // can be all-keyed or mixed
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1; // prev ending index
        let e2 = l2 - 1; // next ending index
        // 1. sync from start
        // (a b) c
        // (a b) d e
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = (c2[i] = optimized
                ? cloneIfMounted(c2[i])
                : normalizeVNode(c2[i]));
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
            }
            else {
                break;
            }
            i++;
        }
        // 2. sync from end
        // a (b c)
        // d e (b c)
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = (c2[e2] = optimized
                ? cloneIfMounted(c2[e2])
                : normalizeVNode(c2[e2]));
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
            }
            else {
                break;
            }
            e1--;
            e2--;
        }
        // 3. common sequence + mount
        // (a b)
        // (a b) c
        // i = 2, e1 = 1, e2 = 2
        // (a b)
        // c (a b)
        // i = 0, e1 = -1, e2 = 0
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
                while (i <= e2) {
                    patch(null, (c2[i] = optimized
                        ? cloneIfMounted(c2[i])
                        : normalizeVNode(c2[i])), container, anchor, parentComponent, parentSuspense, isSVG);
                    i++;
                }
            }
        }
        // 4. common sequence + unmount
        // (a b) c
        // (a b)
        // i = 2, e1 = 2, e2 = 1
        // a (b c)
        // (b c)
        // i = 0, e1 = 0, e2 = -1
        else if (i > e2) {
            while (i <= e1) {
                unmount(c1[i], parentComponent, parentSuspense, true);
                i++;
            }
        }
        // 5. unknown sequence
        // [i ... e1 + 1]: a b [c d e] f g
        // [i ... e2 + 1]: a b [e d c h] f g
        // i = 2, e1 = 4, e2 = 5
        else {
            const s1 = i; // prev starting index
            const s2 = i; // next starting index
            // 5.1 build key:index map for newChildren
            const keyToNewIndexMap = new Map();
            for (i = s2; i <= e2; i++) {
                const nextChild = (c2[i] = optimized
                    ? cloneIfMounted(c2[i])
                    : normalizeVNode(c2[i]));
                if (nextChild.key != null) {
                    if (( true) && keyToNewIndexMap.has(nextChild.key)) {
                        warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
                    }
                    keyToNewIndexMap.set(nextChild.key, i);
                }
            }
            // 5.2 loop through old children left to be patched and try to patch
            // matching nodes & remove nodes that are no longer present
            let j;
            let patched = 0;
            const toBePatched = e2 - s2 + 1;
            let moved = false;
            // used to track whether any node has moved
            let maxNewIndexSoFar = 0;
            // works as Map<newIndex, oldIndex>
            // Note that oldIndex is offset by +1
            // and oldIndex = 0 is a special value indicating the new node has
            // no corresponding old node.
            // used for determining longest stable subsequence
            const newIndexToOldIndexMap = new Array(toBePatched);
            for (i = 0; i < toBePatched; i++)
                newIndexToOldIndexMap[i] = 0;
            for (i = s1; i <= e1; i++) {
                const prevChild = c1[i];
                if (patched >= toBePatched) {
                    // all new children have been patched so this can only be a removal
                    unmount(prevChild, parentComponent, parentSuspense, true);
                    continue;
                }
                let newIndex;
                if (prevChild.key != null) {
                    newIndex = keyToNewIndexMap.get(prevChild.key);
                }
                else {
                    // key-less node, try to locate a key-less node of the same type
                    for (j = s2; j <= e2; j++) {
                        if (newIndexToOldIndexMap[j - s2] === 0 &&
                            isSameVNodeType(prevChild, c2[j])) {
                            newIndex = j;
                            break;
                        }
                    }
                }
                if (newIndex === undefined) {
                    unmount(prevChild, parentComponent, parentSuspense, true);
                }
                else {
                    newIndexToOldIndexMap[newIndex - s2] = i + 1;
                    if (newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex;
                    }
                    else {
                        moved = true;
                    }
                    patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, optimized);
                    patched++;
                }
            }
            // 5.3 move and mount
            // generate longest stable subsequence only when nodes have moved
            const increasingNewIndexSequence = moved
                ? getSequence(newIndexToOldIndexMap)
                : _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_ARR */ "a"];
            j = increasingNewIndexSequence.length - 1;
            // looping backwards so that we can use last patched node as anchor
            for (i = toBePatched - 1; i >= 0; i--) {
                const nextIndex = s2 + i;
                const nextChild = c2[nextIndex];
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
                if (newIndexToOldIndexMap[i] === 0) {
                    // mount new
                    patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG);
                }
                else if (moved) {
                    // move if:
                    // There is no stable subsequence (e.g. a reverse)
                    // OR current node is not among the stable sequence
                    if (j < 0 || i !== increasingNewIndexSequence[j]) {
                        move(nextChild, container, anchor, 2 /* REORDER */);
                    }
                    else {
                        j--;
                    }
                }
            }
        }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
        const { el, type, transition, children, shapeFlag } = vnode;
        if (shapeFlag & 6 /* COMPONENT */) {
            move(vnode.component.subTree, container, anchor, moveType);
            return;
        }
        if ( shapeFlag & 128 /* SUSPENSE */) {
            vnode.suspense.move(container, anchor, moveType);
            return;
        }
        if (shapeFlag & 64 /* TELEPORT */) {
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
        // static node move can only happen when force updating HMR
        if (( true) && type === Static) {
            moveStaticNode(vnode, container, anchor);
            return;
        }
        // single nodes
        const needTransition = moveType !== 2 /* REORDER */ &&
            shapeFlag & 1 /* ELEMENT */ &&
            transition;
        if (needTransition) {
            if (moveType === 0 /* ENTER */) {
                transition.beforeEnter(el);
                hostInsert(el, container, anchor);
                queuePostRenderEffect(() => transition.enter(el), parentSuspense);
            }
            else {
                const { leave, delayLeave, afterLeave } = transition;
                const remove = () => hostInsert(el, container, anchor);
                const performLeave = () => {
                    leave(el, () => {
                        remove();
                        afterLeave && afterLeave();
                    });
                };
                if (delayLeave) {
                    delayLeave(el, remove, performLeave);
                }
                else {
                    performLeave();
                }
            }
        }
        else {
            hostInsert(el, container, anchor);
        }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false) => {
        const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
        // unset ref
        if (ref != null && parentComponent) {
            setRef(ref, null, parentComponent, parentSuspense, null);
        }
        if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
            parentComponent.ctx.deactivate(vnode);
            return;
        }
        const shouldInvokeDirs = shapeFlag & 1 /* ELEMENT */ && dirs;
        let vnodeHook;
        if ((vnodeHook = props && props.onVnodeBeforeUnmount)) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
        if (shapeFlag & 6 /* COMPONENT */) {
            unmountComponent(vnode.component, parentSuspense, doRemove);
        }
        else {
            if ( shapeFlag & 128 /* SUSPENSE */) {
                vnode.suspense.unmount(parentSuspense, doRemove);
                return;
            }
            if (shouldInvokeDirs) {
                invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
            }
            if (dynamicChildren &&
                // #1153: fast path should not be taken for non-stable (v-for) fragments
                (type !== Fragment ||
                    (patchFlag > 0 && patchFlag & 64 /* STABLE_FRAGMENT */))) {
                // fast path for block nodes: only need to unmount dynamic children.
                unmountChildren(dynamicChildren, parentComponent, parentSuspense);
            }
            else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                unmountChildren(children, parentComponent, parentSuspense);
            }
            // an unmounted teleport should always remove its children
            if (shapeFlag & 64 /* TELEPORT */) {
                vnode.type.remove(vnode, internals);
            }
            if (doRemove) {
                remove(vnode);
            }
        }
        if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
            queuePostRenderEffect(() => {
                vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
                shouldInvokeDirs &&
                    invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
            }, parentSuspense);
        }
    };
    const remove = vnode => {
        const { type, el, anchor, transition } = vnode;
        if (type === Fragment) {
            removeFragment(el, anchor);
            return;
        }
        if (( true) && type === Static) {
            removeStaticNode(vnode);
            return;
        }
        const performRemove = () => {
            hostRemove(el);
            if (transition && !transition.persisted && transition.afterLeave) {
                transition.afterLeave();
            }
        };
        if (vnode.shapeFlag & 1 /* ELEMENT */ &&
            transition &&
            !transition.persisted) {
            const { leave, delayLeave } = transition;
            const performLeave = () => leave(el, performRemove);
            if (delayLeave) {
                delayLeave(vnode.el, performRemove, performLeave);
            }
            else {
                performLeave();
            }
        }
        else {
            performRemove();
        }
    };
    const removeFragment = (cur, end) => {
        // For fragments, directly remove all contained DOM nodes.
        // (fragment child nodes cannot have transition)
        let next;
        while (cur !== end) {
            next = hostNextSibling(cur);
            hostRemove(cur);
            cur = next;
        }
        hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
        if (( true) && instance.type.__hmrId) {
            unregisterHMR(instance);
        }
        const { bum, effects, update, subTree, um } = instance;
        // beforeUnmount hook
        if (bum) {
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(bum);
        }
        if (effects) {
            for (let i = 0; i < effects.length; i++) {
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* stop */ "m"])(effects[i]);
            }
        }
        // update may be null if a component is unmounted before its async
        // setup has resolved.
        if (update) {
            Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* stop */ "m"])(update);
            unmount(subTree, instance, parentSuspense, doRemove);
        }
        // unmounted hook
        if (um) {
            queuePostRenderEffect(um, parentSuspense);
        }
        queuePostRenderEffect(() => {
            instance.isUnmounted = true;
        }, parentSuspense);
        // A component with async dep inside a pending suspense is unmounted before
        // its async dep resolves. This should remove the dep from the suspense, and
        // cause the suspense to resolve immediately if that was the last dep.
        if (
            parentSuspense &&
            !parentSuspense.isResolved &&
            !parentSuspense.isUnmounted &&
            instance.asyncDep &&
            !instance.asyncResolved) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0) {
                parentSuspense.resolve();
            }
        }
        if (true) {
            devtoolsComponentRemoved(instance);
        }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, start = 0) => {
        for (let i = start; i < children.length; i++) {
            unmount(children[i], parentComponent, parentSuspense, doRemove);
        }
    };
    const getNextHostNode = vnode => {
        if (vnode.shapeFlag & 6 /* COMPONENT */) {
            return getNextHostNode(vnode.component.subTree);
        }
        if ( vnode.shapeFlag & 128 /* SUSPENSE */) {
            return vnode.suspense.next();
        }
        return hostNextSibling((vnode.anchor || vnode.el));
    };
    /**
     * #1156
     * When a component is HMR-enabled, we need to make sure that all static nodes
     * inside a block also inherit the DOM element from the previous tree so that
     * HMR updates (which are full updates) can retrieve the element for patching.
     *
     * Dev only.
     */
    const traverseStaticChildren = (n1, n2) => {
        const ch1 = n1.children;
        const ch2 = n2.children;
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(ch1) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(ch2)) {
            for (let i = 0; i < ch1.length; i++) {
                // this is only called in the optimized path so array children are
                // guaranteed to be vnodes
                const c1 = ch1[i];
                const c2 = (ch2[i] = cloneIfMounted(ch2[i]));
                if (c2.shapeFlag & 1 /* ELEMENT */ && !c2.dynamicChildren) {
                    if (c2.patchFlag <= 0 || c2.patchFlag === 32 /* HYDRATE_EVENTS */) {
                        c2.el = c1.el;
                    }
                    traverseStaticChildren(c1, c2);
                }
            }
        }
    };
    const render = (vnode, container) => {
        if (vnode == null) {
            if (container._vnode) {
                unmount(container._vnode, null, null, true);
            }
        }
        else {
            patch(container._vnode || null, vnode, container);
        }
        flushPostFlushCbs();
        container._vnode = vnode;
    };
    const internals = {
        p: patch,
        um: unmount,
        m: move,
        r: remove,
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
        [hydrate, hydrateNode] = createHydrationFns(internals);
    }
    return {
        render,
        hydrate,
        createApp: createAppAPI(render, hydrate)
    };
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7 /* VNODE_HOOK */, [
        vnode,
        prevVNode
    ]);
}
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = ((u + v) / 2) | 0;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

// Simple effect.
function watchEffect(effect, options) {
    return doWatch(effect, null, options);
}
// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {};
// implementation
function watch(source, cb, options) {
    if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(cb)) {
        warn(`\`watch(fn, options?)\` signature has been moved to a separate API. ` +
            `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
            `supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"], instance = currentInstance) {
    if (( true) && !cb) {
        if (immediate !== undefined) {
            warn(`watch() "immediate" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
        if (deep !== undefined) {
            warn(`watch() "deep" option is only respected when using the ` +
                `watch(source, callback, options?) signature.`);
        }
    }
    const warnInvalidSource = (s) => {
        warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` +
            `a reactive object, or an array of these types.`);
    };
    let getter;
    const isRefSource = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isRef */ "e"])(source);
    if (isRefSource) {
        getter = () => source.value;
    }
    else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isReactive */ "d"])(source)) {
        getter = () => source;
        deep = true;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(source)) {
        getter = () => source.map(s => {
            if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isRef */ "e"])(s)) {
                return s.value;
            }
            else if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isReactive */ "d"])(s)) {
                return traverse(s);
            }
            else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(s)) {
                return callWithErrorHandling(s, instance, 2 /* WATCH_GETTER */);
            }
            else {
                ( true) && warnInvalidSource(s);
            }
        });
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(source)) {
        if (cb) {
            // getter with cb
            getter = () => callWithErrorHandling(source, instance, 2 /* WATCH_GETTER */);
        }
        else {
            // no cb -> simple effect
            getter = () => {
                if (instance && instance.isUnmounted) {
                    return;
                }
                if (cleanup) {
                    cleanup();
                }
                return callWithErrorHandling(source, instance, 3 /* WATCH_CALLBACK */, [onInvalidate]);
            };
        }
    }
    else {
        getter = _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"];
        ( true) && warnInvalidSource(source);
    }
    if (cb && deep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
    }
    let cleanup;
    const onInvalidate = (fn) => {
        cleanup = runner.options.onStop = () => {
            callWithErrorHandling(fn, instance, 4 /* WATCH_CLEANUP */);
        };
    };
    let oldValue = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(source) ? [] : INITIAL_WATCHER_VALUE;
    const job = () => {
        if (!runner.active) {
            return;
        }
        if (cb) {
            // watch(source, cb)
            const newValue = runner();
            if (deep || isRefSource || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasChanged */ "j"])(newValue, oldValue)) {
                // cleanup before running cb again
                if (cleanup) {
                    cleanup();
                }
                callWithAsyncErrorHandling(cb, instance, 3 /* WATCH_CALLBACK */, [
                    newValue,
                    // pass undefined as the old value when it's changed for the first time
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onInvalidate
                ]);
                oldValue = newValue;
            }
        }
        else {
            // watchEffect
            runner();
        }
    };
    // important: mark the job as a watcher callback so that scheduler knows it
    // it is allowed to self-trigger (#1727)
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === 'sync') {
        scheduler = job;
    }
    else if (flush === 'pre') {
        // ensure it's queued before component updates (which have positive ids)
        job.id = -1;
        scheduler = () => {
            if (!instance || instance.isMounted) {
                queuePreFlushCb(job);
            }
            else {
                // with 'pre' option, the first call must happen before
                // the component is mounted so it is called synchronously.
                job();
            }
        };
    }
    else {
        scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    }
    const runner = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* effect */ "b"])(getter, {
        lazy: true,
        onTrack,
        onTrigger,
        scheduler
    });
    recordInstanceBoundEffect(runner);
    // initial run
    if (cb) {
        if (immediate) {
            job();
        }
        else {
            oldValue = runner();
        }
    }
    else {
        runner();
    }
    return () => {
        Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* stop */ "m"])(runner);
        if (instance) {
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* remove */ "G"])(instance.effects, runner);
        }
    };
}
// this.$watch
function instanceWatch(source, cb, options) {
    const publicThis = this.proxy;
    const getter = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(source)
        ? () => publicThis[source]
        : source.bind(publicThis);
    return doWatch(getter, cb.bind(publicThis), options, this);
}
function traverse(value, seen = new Set()) {
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(value) || seen.has(value)) {
        return value;
    }
    seen.add(value);
    if (Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* isRef */ "e"])(value)) {
        traverse(value.value, seen);
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(value)) {
        for (let i = 0; i < value.length; i++) {
            traverse(value[i], seen);
        }
    }
    else if (value instanceof Map) {
        value.forEach((v, key) => {
            // to register mutation dep for existing keys
            traverse(value.get(key), seen);
        });
    }
    else if (value instanceof Set) {
        value.forEach(v => {
            traverse(v, seen);
        });
    }
    else {
        for (const key in value) {
            traverse(value[key], seen);
        }
    }
    return value;
}

function provide(key, value) {
    if (!currentInstance) {
        if ((true)) {
            warn(`provide() can only be used inside setup().`);
        }
    }
    else {
        let provides = currentInstance.provides;
        // by default an instance inherits its parent's provides object
        // but when it needs to provide values of its own, it creates its
        // own provides object using parent provides object as prototype.
        // this way in `inject` we can simply look up injections from direct
        // parent and let the prototype chain do the work.
        const parentProvides = currentInstance.parent && currentInstance.parent.provides;
        if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        // TS doesn't allow symbol as index type
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    const instance = currentInstance || currentRenderingInstance;
    if (instance) {
        const provides = instance.provides;
        if (key in provides) {
            // TS doesn't allow symbol as index type
            return provides[key];
        }
        else if (arguments.length > 1) {
            return defaultValue;
        }
        else if ((true)) {
            warn(`injection "${String(key)}" not found.`);
        }
    }
    else if ((true)) {
        warn(`inject() can only be used inside setup() or functional components.`);
    }
}

function createDuplicateChecker() {
    const cache = Object.create(null);
    return (type, key) => {
        if (cache[key]) {
            warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
        }
        else {
            cache[key] = type;
        }
    };
}
let isInBeforeCreate = false;
function applyOptions(instance, options, deferredData = [], deferredWatch = [], asMixin = false) {
    const { 
    // composition
    mixins, extends: extendsOptions, 
    // state
    data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, 
    // assets
    components, directives, 
    // lifecycle
    beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeUnmount, unmounted, render, renderTracked, renderTriggered, errorCaptured } = options;
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    const globalMixins = instance.appContext.mixins;
    if (asMixin && render && instance.render === _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]) {
        instance.render = render;
    }
    // applyOptions is called non-as-mixin once per instance
    if (!asMixin) {
        isInBeforeCreate = true;
        callSyncHook('beforeCreate', options, publicThis, globalMixins);
        isInBeforeCreate = false;
        // global mixins are applied first
        applyMixins(instance, globalMixins, deferredData, deferredWatch);
    }
    // extending a base component...
    if (extendsOptions) {
        applyOptions(instance, extendsOptions, deferredData, deferredWatch, true);
    }
    // local mixins
    if (mixins) {
        applyMixins(instance, mixins, deferredData, deferredWatch);
    }
    const checkDuplicateProperties = ( true) ? createDuplicateChecker() : undefined;
    if ((true)) {
        const [propsOptions] = instance.propsOptions;
        if (propsOptions) {
            for (const key in propsOptions) {
                checkDuplicateProperties("Props" /* PROPS */, key);
            }
        }
    }
    // options initialization order (to be consistent with Vue 2):
    // - props (already done outside of this function)
    // - inject
    // - methods
    // - data (deferred since it relies on `this` access)
    // - computed
    // - watch (deferred since it relies on `this` access)
    if (injectOptions) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(injectOptions)) {
            for (let i = 0; i < injectOptions.length; i++) {
                const key = injectOptions[i];
                ctx[key] = inject(key);
                if ((true)) {
                    checkDuplicateProperties("Inject" /* INJECT */, key);
                }
            }
        }
        else {
            for (const key in injectOptions) {
                const opt = injectOptions[key];
                if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(opt)) {
                    ctx[key] = inject(opt.from, opt.default);
                }
                else {
                    ctx[key] = inject(opt);
                }
                if ((true)) {
                    checkDuplicateProperties("Inject" /* INJECT */, key);
                }
            }
        }
    }
    if (methods) {
        for (const key in methods) {
            const methodHandler = methods[key];
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(methodHandler)) {
                ctx[key] = methodHandler.bind(publicThis);
                if ((true)) {
                    checkDuplicateProperties("Methods" /* METHODS */, key);
                }
            }
            else if ((true)) {
                warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
                    `Did you reference the function correctly?`);
            }
        }
    }
    if (!asMixin) {
        if (deferredData.length) {
            deferredData.forEach(dataFn => resolveData(instance, dataFn, publicThis));
        }
        if (dataOptions) {
            resolveData(instance, dataOptions, publicThis);
        }
        if ((true)) {
            const rawData = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(instance.data);
            for (const key in rawData) {
                checkDuplicateProperties("Data" /* DATA */, key);
                // expose data on ctx during dev
                if (key[0] !== '$' && key[0] !== '_') {
                    Object.defineProperty(ctx, key, {
                        configurable: true,
                        enumerable: true,
                        get: () => rawData[key],
                        set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]
                    });
                }
            }
        }
    }
    else if (dataOptions) {
        deferredData.push(dataOptions);
    }
    if (computedOptions) {
        for (const key in computedOptions) {
            const opt = computedOptions[key];
            const get = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(opt)
                ? opt.bind(publicThis, publicThis)
                : Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(opt.get)
                    ? opt.get.bind(publicThis, publicThis)
                    : _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"];
            if (( true) && get === _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]) {
                warn(`Computed property "${key}" has no getter.`);
            }
            const set = !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(opt) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(opt.set)
                ? opt.set.bind(publicThis)
                : ( true)
                    ? () => {
                        warn(`Write operation failed: computed property "${key}" is readonly.`);
                    }
                    : undefined;
            const c = computed({
                get,
                set
            });
            Object.defineProperty(ctx, key, {
                enumerable: true,
                configurable: true,
                get: () => c.value,
                set: v => (c.value = v)
            });
            if ((true)) {
                checkDuplicateProperties("Computed" /* COMPUTED */, key);
            }
        }
    }
    if (watchOptions) {
        deferredWatch.push(watchOptions);
    }
    if (!asMixin && deferredWatch.length) {
        deferredWatch.forEach(watchOptions => {
            for (const key in watchOptions) {
                createWatcher(watchOptions[key], ctx, publicThis, key);
            }
        });
    }
    if (provideOptions) {
        const provides = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(provideOptions)
            ? provideOptions.call(publicThis)
            : provideOptions;
        for (const key in provides) {
            provide(key, provides[key]);
        }
    }
    // asset options.
    // To reduce memory usage, only components with mixins or extends will have
    // resolved asset registry attached to instance.
    if (asMixin) {
        if (components) {
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(instance.components ||
                (instance.components = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, instance.type.components)), components);
        }
        if (directives) {
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(instance.directives ||
                (instance.directives = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, instance.type.directives)), directives);
        }
    }
    // lifecycle options
    if (!asMixin) {
        callSyncHook('created', options, publicThis, globalMixins);
    }
    if (beforeMount) {
        onBeforeMount(beforeMount.bind(publicThis));
    }
    if (mounted) {
        onMounted(mounted.bind(publicThis));
    }
    if (beforeUpdate) {
        onBeforeUpdate(beforeUpdate.bind(publicThis));
    }
    if (updated) {
        onUpdated(updated.bind(publicThis));
    }
    if (activated) {
        onActivated(activated.bind(publicThis));
    }
    if (deactivated) {
        onDeactivated(deactivated.bind(publicThis));
    }
    if (errorCaptured) {
        onErrorCaptured(errorCaptured.bind(publicThis));
    }
    if (renderTracked) {
        onRenderTracked(renderTracked.bind(publicThis));
    }
    if (renderTriggered) {
        onRenderTriggered(renderTriggered.bind(publicThis));
    }
    if (beforeUnmount) {
        onBeforeUnmount(beforeUnmount.bind(publicThis));
    }
    if (unmounted) {
        onUnmounted(unmounted.bind(publicThis));
    }
}
function callSyncHook(name, options, ctx, globalMixins) {
    callHookFromMixins(name, globalMixins, ctx);
    const { extends: base, mixins } = options;
    if (base) {
        callHookFromExtends(name, base, ctx);
    }
    if (mixins) {
        callHookFromMixins(name, mixins, ctx);
    }
    const selfHook = options[name];
    if (selfHook) {
        selfHook.call(ctx);
    }
}
function callHookFromExtends(name, base, ctx) {
    if (base.extends) {
        callHookFromExtends(name, base.extends, ctx);
    }
    const baseHook = base[name];
    if (baseHook) {
        baseHook.call(ctx);
    }
}
function callHookFromMixins(name, mixins, ctx) {
    for (let i = 0; i < mixins.length; i++) {
        const chainedMixins = mixins[i].mixins;
        if (chainedMixins) {
            callHookFromMixins(name, chainedMixins, ctx);
        }
        const fn = mixins[i][name];
        if (fn) {
            fn.call(ctx);
        }
    }
}
function applyMixins(instance, mixins, deferredData, deferredWatch) {
    for (let i = 0; i < mixins.length; i++) {
        applyOptions(instance, mixins[i], deferredData, deferredWatch, true);
    }
}
function resolveData(instance, dataFn, publicThis) {
    if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(dataFn)) {
        warn(`The data option must be a function. ` +
            `Plain object usage is no longer supported.`);
    }
    const data = dataFn.call(publicThis, publicThis);
    if (( true) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isPromise */ "v"])(data)) {
        warn(`data() returned a Promise - note data() cannot be async; If you ` +
            `intend to perform data fetching before component renders, use ` +
            `async setup() + <Suspense>.`);
    }
    if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(data)) {
        ( true) && warn(`data() should return an object.`);
    }
    else if (instance.data === _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"]) {
        instance.data = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* reactive */ "h"])(data);
    }
    else {
        // existing data: this is a mixin or extends.
        Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(instance.data, data);
    }
}
function createWatcher(raw, ctx, publicThis, key) {
    const getter = () => publicThis[key];
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(raw)) {
        const handler = ctx[raw];
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(handler)) {
            watch(getter, handler);
        }
        else if ((true)) {
            warn(`Invalid watch handler specified by key "${raw}"`, handler);
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(raw)) {
        watch(getter, raw.bind(publicThis));
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(raw)) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(raw)) {
            raw.forEach(r => createWatcher(r, ctx, publicThis, key));
        }
        else {
            const handler = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(raw.handler)
                ? raw.handler.bind(publicThis)
                : ctx[raw.handler];
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(handler)) {
                watch(getter, handler, raw);
            }
            else if ((true)) {
                warn(`Invalid watch handler specified by key "${raw.handler}"`, handler);
            }
        }
    }
    else if ((true)) {
        warn(`Invalid watch option: "${key}"`);
    }
}
function resolveMergedOptions(instance) {
    const raw = instance.type;
    const { __merged, mixins, extends: extendsOptions } = raw;
    if (__merged)
        return __merged;
    const globalMixins = instance.appContext.mixins;
    if (!globalMixins.length && !mixins && !extendsOptions)
        return raw;
    const options = {};
    mergeOptions(options, raw, instance);
    globalMixins.forEach(m => mergeOptions(options, m, instance));
    return (raw.__merged = options);
}
function mergeOptions(to, from, instance) {
    const strats = instance.appContext.config.optionMergeStrategies;
    for (const key in from) {
        if (strats && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(strats, key)) {
            to[key] = strats[key](to[key], from[key], instance.proxy, key);
        }
        else if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(to, key)) {
            to[key] = from[key];
        }
    }
    const { mixins, extends: extendsOptions } = from;
    extendsOptions && mergeOptions(to, extendsOptions, instance);
    mixins &&
        mixins.forEach((m) => mergeOptions(to, m, instance));
}

const publicPropertiesMap = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(Object.create(null), {
    $: i => i,
    $el: i => i.vnode.el,
    $data: i => i.data,
    $props: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReadonly */ "l"])(i.props) : undefined),
    $attrs: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReadonly */ "l"])(i.attrs) : undefined),
    $slots: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReadonly */ "l"])(i.slots) : undefined),
    $refs: i => (( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReadonly */ "l"])(i.refs) : undefined),
    $parent: i => i.parent && i.parent.proxy,
    $root: i => i.root && i.root.proxy,
    $emit: i => i.emit,
    $options: i => (__VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type),
    $forceUpdate: i => () => queueJob(i.update),
    $nextTick: () => nextTick,
    $watch: i => (__VUE_OPTIONS_API__ ? instanceWatch.bind(i) : _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"])
});
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
        // let @vue/reactivity know it should never observe Vue public instances.
        if (key === "__v_skip" /* SKIP */) {
            return true;
        }
        // data / props / ctx
        // This getter gets called for every property access on the render context
        // during render and is a major hotspot. The most expensive part of this
        // is the multiple hasOwn() calls. It's much faster to do a simple property
        // access on a plain object, so we use an accessCache object (with null
        // prototype) to memoize what access type a key corresponds to.
        let normalizedProps;
        if (key[0] !== '$') {
            const n = accessCache[key];
            if (n !== undefined) {
                switch (n) {
                    case 0 /* SETUP */:
                        return setupState[key];
                    case 1 /* DATA */:
                        return data[key];
                    case 3 /* CONTEXT */:
                        return ctx[key];
                    case 2 /* PROPS */:
                        return props[key];
                    // default: just fallthrough
                }
            }
            else if (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(setupState, key)) {
                accessCache[key] = 0 /* SETUP */;
                return setupState[key];
            }
            else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(data, key)) {
                accessCache[key] = 1 /* DATA */;
                return data[key];
            }
            else if (
            // only cache other properties when instance has declared (thus stable)
            // props
            (normalizedProps = instance.propsOptions[0]) &&
                Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(normalizedProps, key)) {
                accessCache[key] = 2 /* PROPS */;
                return props[key];
            }
            else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(ctx, key)) {
                accessCache[key] = 3 /* CONTEXT */;
                return ctx[key];
            }
            else if (!__VUE_OPTIONS_API__ || !isInBeforeCreate) {
                accessCache[key] = 4 /* OTHER */;
            }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        // public $xxx properties
        if (publicGetter) {
            if (key === '$attrs') {
                Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* track */ "o"])(instance, "get" /* GET */, key);
                ( true) && markAttrsAccessed();
            }
            return publicGetter(instance);
        }
        else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) &&
            (cssModule = cssModule[key])) {
            return cssModule;
        }
        else if (ctx !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(ctx, key)) {
            // user may set custom properties to `this` that start with `$`
            accessCache[key] = 3 /* CONTEXT */;
            return ctx[key];
        }
        else if (
        // global properties
        ((globalProperties = appContext.config.globalProperties),
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(globalProperties, key))) {
            return globalProperties[key];
        }
        else if (( true) &&
            currentRenderingInstance &&
            (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(key) ||
                // #1091 avoid internal isRef/isVNode checks on component instance leading
                // to infinite warning loop
                key.indexOf('__v') !== 0)) {
            if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && key[0] === '$' && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(data, key)) {
                warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved ` +
                    `character and is not proxied on the render context.`);
            }
            else {
                warn(`Property ${JSON.stringify(key)} was accessed during render ` +
                    `but is not defined on instance.`);
            }
        }
    },
    set({ _: instance }, key, value) {
        const { data, setupState, ctx } = instance;
        if (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(setupState, key)) {
            setupState[key] = value;
        }
        else if (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(data, key)) {
            data[key] = value;
        }
        else if (key in instance.props) {
            ( true) &&
                warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
            return false;
        }
        if (key[0] === '$' && key.slice(1) in instance) {
            ( true) &&
                warn(`Attempting to mutate public property "${key}". ` +
                    `Properties starting with $ are reserved and readonly.`, instance);
            return false;
        }
        else {
            if (( true) && key in instance.appContext.config.globalProperties) {
                Object.defineProperty(ctx, key, {
                    enumerable: true,
                    configurable: true,
                    value
                });
            }
            else {
                ctx[key] = value;
            }
        }
        return true;
    },
    has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
        let normalizedProps;
        return (accessCache[key] !== undefined ||
            (data !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(data, key)) ||
            (setupState !== _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"] && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(setupState, key)) ||
            ((normalizedProps = propsOptions[0]) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(normalizedProps, key)) ||
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(ctx, key) ||
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(publicPropertiesMap, key) ||
            Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hasOwn */ "k"])(appContext.config.globalProperties, key));
    }
};
if (true) {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
        warn(`Avoid app logic that relies on enumerating keys on a component instance. ` +
            `The keys will be empty in production mode to avoid performance overhead.`);
        return Reflect.ownKeys(target);
    };
}
const RuntimeCompiledPublicInstanceProxyHandlers = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, PublicInstanceProxyHandlers, {
    get(target, key) {
        // fast path for unscopables when using `with` block
        if (key === Symbol.unscopables) {
            return;
        }
        return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
        const has = key[0] !== '_' && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isGloballyWhitelisted */ "p"])(key);
        if (( true) && !has && PublicInstanceProxyHandlers.has(_, key)) {
            warn(`Property ${JSON.stringify(key)} should not start with _ which is a reserved prefix for Vue internals.`);
        }
        return has;
    }
});
// In dev mode, the proxy target exposes the same properties as seen on `this`
// for easier console inspection. In prod mode it will be an empty object so
// these properties definitions can be skipped.
function createRenderContext(instance) {
    const target = {};
    // expose internal instance for proxy handlers
    Object.defineProperty(target, `_`, {
        configurable: true,
        enumerable: false,
        get: () => instance
    });
    // expose public properties
    Object.keys(publicPropertiesMap).forEach(key => {
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: false,
            get: () => publicPropertiesMap[key](instance),
            // intercepted by the proxy so no need for implementation,
            // but needed to prevent set errors
            set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]
        });
    });
    // expose global properties
    const { globalProperties } = instance.appContext.config;
    Object.keys(globalProperties).forEach(key => {
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: false,
            get: () => globalProperties[key],
            set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]
        });
    });
    return target;
}
// dev only
function exposePropsOnRenderContext(instance) {
    const { ctx, propsOptions: [propsOptions] } = instance;
    if (propsOptions) {
        Object.keys(propsOptions).forEach(key => {
            Object.defineProperty(ctx, key, {
                enumerable: true,
                configurable: true,
                get: () => instance.props[key],
                set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]
            });
        });
    }
}
// dev only
function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* toRaw */ "n"])(setupState)).forEach(key => {
        Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => setupState[key],
            set: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]
        });
    });
}

const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    // inherit parent app context - or - if root, adopt from root vnode
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
        uid: uid$1++,
        vnode,
        type,
        parent,
        appContext,
        root: null,
        next: null,
        subTree: null,
        update: null,
        render: null,
        proxy: null,
        withProxy: null,
        effects: null,
        provides: parent ? parent.provides : Object.create(appContext.provides),
        accessCache: null,
        renderCache: [],
        // local resovled assets
        components: null,
        directives: null,
        // resolved props and emits options
        propsOptions: normalizePropsOptions(type, appContext),
        emitsOptions: normalizeEmitsOptions(type, appContext),
        // emit
        emit: null,
        emitted: null,
        // state
        ctx: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        data: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        props: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        attrs: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        slots: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        refs: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        setupState: _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"],
        setupContext: null,
        // suspense related
        suspense,
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
        ec: null
    };
    if ((true)) {
        instance.ctx = createRenderContext(instance);
    }
    else {}
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (true) {
        devtoolsComponentAdded(instance);
    }
    return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
    currentInstance = instance;
};
const isBuiltInTag = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* makeMap */ "D"])('slot,component');
function validateComponentName(name, config) {
    const appIsNativeTag = config.isNativeTag || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NO */ "c"];
    if (isBuiltInTag(name) || appIsNativeTag(name)) {
        warn('Do not use built-in or reserved HTML elements as component id: ' + name);
    }
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
    isInSSRComponentSetup = isSSR;
    const { props, children, shapeFlag } = instance.vnode;
    const isStateful = shapeFlag & 4 /* STATEFUL_COMPONENT */;
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful
        ? setupStatefulComponent(instance, isSSR)
        : undefined;
    isInSSRComponentSetup = false;
    return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    if ((true)) {
        if (Component.name) {
            validateComponentName(Component.name, instance.appContext.config);
        }
        if (Component.components) {
            const names = Object.keys(Component.components);
            for (let i = 0; i < names.length; i++) {
                validateComponentName(names[i], instance.appContext.config);
            }
        }
        if (Component.directives) {
            const names = Object.keys(Component.directives);
            for (let i = 0; i < names.length; i++) {
                validateDirectiveName(names[i]);
            }
        }
    }
    // 0. create render proxy property access cache
    instance.accessCache = {};
    // 1. create public instance / render proxy
    // also mark it raw so it's never observed
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    if ((true)) {
        exposePropsOnRenderContext(instance);
    }
    // 2. call setup()
    const { setup } = Component;
    if (setup) {
        const setupContext = (instance.setupContext =
            setup.length > 1 ? createSetupContext(instance) : null);
        currentInstance = instance;
        Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* pauseTracking */ "f"])();
        const setupResult = callWithErrorHandling(setup, instance, 0 /* SETUP_FUNCTION */, [( true) ? Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReadonly */ "l"])(instance.props) : undefined, setupContext]);
        Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* resetTracking */ "j"])();
        currentInstance = null;
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isPromise */ "v"])(setupResult)) {
            if (isSSR) {
                // return the promise so server-renderer can wait on it
                return setupResult.then((resolvedResult) => {
                    handleSetupResult(instance, resolvedResult);
                });
            }
            else {
                // async setup returned Promise.
                // bail here and wait for re-entry.
                instance.asyncDep = setupResult;
            }
        }
        else {
            handleSetupResult(instance, setupResult);
        }
    }
    else {
        finishComponentSetup(instance);
    }
}
function handleSetupResult(instance, setupResult, isSSR) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(setupResult)) {
        // setup returned an inline render function
        instance.render = setupResult;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(setupResult)) {
        if (( true) && isVNode(setupResult)) {
            warn(`setup() should not return VNodes directly - ` +
                `return a render function instead.`);
        }
        // setup returned bindings.
        // assuming a render function compiled from template is present.
        if (true) {
            instance.devtoolsRawSetupState = setupResult;
        }
        instance.setupState = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* proxyRefs */ "g"])(setupResult);
        if ((true)) {
            exposeSetupStateOnRenderContext(instance);
        }
    }
    else if (( true) && setupResult !== undefined) {
        warn(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
    }
    finishComponentSetup(instance);
}
let compile;
/**
 * For runtime-dom to register the compiler.
 * Note the exported method uses any to avoid d.ts relying on the compiler types.
 */
function registerRuntimeCompiler(_compile) {
    compile = _compile;
}
function finishComponentSetup(instance, isSSR) {
    const Component = instance.type;
    // template / render function normalization
    if (!instance.render) {
        // could be set from setup()
        if (compile && Component.template && !Component.render) {
            if ((true)) {
                startMeasure(instance, `compile`);
            }
            Component.render = compile(Component.template, {
                isCustomElement: instance.appContext.config.isCustomElement,
                delimiters: Component.delimiters
            });
            if ((true)) {
                endMeasure(instance, `compile`);
            }
        }
        instance.render = (Component.render || _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]);
        // for runtime-compiled render functions using `with` blocks, the render
        // proxy used needs a different `has` handler which is more performant and
        // also only allows a whitelist of globals to fallthrough.
        if (instance.render._rc) {
            instance.withProxy = new Proxy(instance.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
        }
    }
    // support for 2.x options
    if (__VUE_OPTIONS_API__) {
        currentInstance = instance;
        applyOptions(instance, Component);
        currentInstance = null;
    }
    // warn missing template/render
    if (( true) && !Component.render && instance.render === _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* NOOP */ "d"]) {
        /* istanbul ignore if */
        if (!compile && Component.template) {
            warn(`Component provided template option but ` +
                `runtime compilation is not supported in this build of Vue.` +
                ( ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                    ) /* should not happen */);
        }
        else {
            warn(`Component is missing template or render function.`);
        }
    }
}
const attrHandlers = {
    get: (target, key) => {
        if ((true)) {
            markAttrsAccessed();
        }
        return target[key];
    },
    set: () => {
        warn(`setupContext.attrs is readonly.`);
        return false;
    },
    deleteProperty: () => {
        warn(`setupContext.attrs is readonly.`);
        return false;
    }
};
function createSetupContext(instance) {
    if ((true)) {
        // We use getters in dev in case libs like test-utils overwrite instance
        // properties (overwrites should not be done in prod)
        return Object.freeze({
            get attrs() {
                return new Proxy(instance.attrs, attrHandlers);
            },
            get slots() {
                return Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* shallowReadonly */ "l"])(instance.slots);
            },
            get emit() {
                return (event, ...args) => instance.emit(event, ...args);
            }
        });
    }
    else {}
}
// record effects created during a component's setup() so that they can be
// stopped when the component unmounts
function recordInstanceBoundEffect(effect) {
    if (currentInstance) {
        (currentInstance.effects || (currentInstance.effects = [])).push(effect);
    }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
/* istanbul ignore next */
function formatComponentName(instance, Component, isRoot = false) {
    let name = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(Component)
        ? Component.displayName || Component.name
        : Component.name;
    if (!name && Component.__file) {
        const match = Component.__file.match(/([^/\\]+)\.vue$/);
        if (match) {
            name = match[1];
        }
    }
    if (!name && instance && instance.parent) {
        // try to infer the name based on reverse resolution
        const inferFromRegistry = (registry) => {
            for (const key in registry) {
                if (registry[key] === Component) {
                    return key;
                }
            }
        };
        name =
            inferFromRegistry(instance.components ||
                instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}

function computed(getterOrOptions) {
    const c = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* computed */ "a"])(getterOrOptions);
    recordInstanceBoundEffect(c.effect);
    return c;
}

// implementation, close to no-op
function defineComponent(options) {
    return Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(options) ? { setup: options, name: options.name } : options;
}

function defineAsyncComponent(source) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(source)) {
        source = { loader: source };
    }
    const { loader, loadingComponent: loadingComponent, errorComponent: errorComponent, delay = 200, timeout, // undefined = never times out
    suspensible = true, onError: userOnError } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
        retries++;
        pendingRequest = null;
        return load();
    };
    const load = () => {
        let thisRequest;
        return (pendingRequest ||
            (thisRequest = pendingRequest = loader()
                .catch(err => {
                err = err instanceof Error ? err : new Error(String(err));
                if (userOnError) {
                    return new Promise((resolve, reject) => {
                        const userRetry = () => resolve(retry());
                        const userFail = () => reject(err);
                        userOnError(err, userRetry, userFail, retries + 1);
                    });
                }
                else {
                    throw err;
                }
            })
                .then((comp) => {
                if (thisRequest !== pendingRequest && pendingRequest) {
                    return pendingRequest;
                }
                if (( true) && !comp) {
                    warn(`Async component loader resolved to undefined. ` +
                        `If you are using retry(), make sure to return its return value.`);
                }
                // interop module default
                if (comp &&
                    (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
                    comp = comp.default;
                }
                if (( true) && comp && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(comp) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(comp)) {
                    throw new Error(`Invalid async component load result: ${comp}`);
                }
                resolvedComp = comp;
                return comp;
            })));
    };
    return defineComponent({
        __asyncLoader: load,
        name: 'AsyncComponentWrapper',
        setup() {
            const instance = currentInstance;
            // already resolved
            if (resolvedComp) {
                return () => createInnerComp(resolvedComp, instance);
            }
            const onError = (err) => {
                pendingRequest = null;
                handleError(err, instance, 13 /* ASYNC_COMPONENT_LOADER */);
            };
            // suspense-controlled or SSR.
            if (( suspensible && instance.suspense) ||
                (false )) {
                return load()
                    .then(comp => {
                    return () => createInnerComp(comp, instance);
                })
                    .catch(err => {
                    onError(err);
                    return () => errorComponent
                        ? createVNode(errorComponent, {
                            error: err
                        })
                        : null;
                });
            }
            const loaded = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* ref */ "i"])(false);
            const error = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* ref */ "i"])();
            const delayed = Object(_vue_reactivity__WEBPACK_IMPORTED_MODULE_0__[/* ref */ "i"])(!!delay);
            if (delay) {
                setTimeout(() => {
                    delayed.value = false;
                }, delay);
            }
            if (timeout != null) {
                setTimeout(() => {
                    if (!loaded.value) {
                        const err = new Error(`Async component timed out after ${timeout}ms.`);
                        onError(err);
                        error.value = err;
                    }
                }, timeout);
            }
            load()
                .then(() => {
                loaded.value = true;
            })
                .catch(err => {
                onError(err);
                error.value = err;
            });
            return () => {
                if (loaded.value && resolvedComp) {
                    return createInnerComp(resolvedComp, instance);
                }
                else if (error.value && errorComponent) {
                    return createVNode(errorComponent, {
                        error: error.value
                    });
                }
                else if (loadingComponent && !delayed.value) {
                    return createVNode(loadingComponent);
                }
            };
        }
    });
}
function createInnerComp(comp, { vnode: { props, children } }) {
    return createVNode(comp, props, children);
}

// Actual implementation
function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(propsOrChildren) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(propsOrChildren)) {
            // single vnode without props
            if (isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren]);
            }
            // props without children
            return createVNode(type, propsOrChildren);
        }
        else {
            // omit props
            return createVNode(type, null, propsOrChildren);
        }
    }
    else {
        if (l > 3) {
            children = Array.prototype.slice.call(arguments, 2);
        }
        else if (l === 3 && isVNode(children)) {
            children = [children];
        }
        return createVNode(type, propsOrChildren, children);
    }
}

const ssrContextKey = Symbol(( true) ? `ssrContext` : undefined);
const useSSRContext = () => {
    {
        const ctx = inject(ssrContextKey);
        if (!ctx) {
            warn(`Server rendering context not provided. Make sure to only call ` +
                `useSsrContext() conditionally in the server build.`);
        }
        return ctx;
    }
};

/**
 * Actual implementation
 */
function renderList(source, renderItem) {
    let ret;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(source) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(source)) {
        ret = new Array(source.length);
        for (let i = 0, l = source.length; i < l; i++) {
            ret[i] = renderItem(source[i], i);
        }
    }
    else if (typeof source === 'number') {
        ret = new Array(source);
        for (let i = 0; i < source; i++) {
            ret[i] = renderItem(i + 1, i);
        }
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(source)) {
        if (source[Symbol.iterator]) {
            ret = Array.from(source, renderItem);
        }
        else {
            const keys = Object.keys(source);
            ret = new Array(keys.length);
            for (let i = 0, l = keys.length; i < l; i++) {
                const key = keys[i];
                ret[i] = renderItem(source[key], key, i);
            }
        }
    }
    else {
        ret = [];
    }
    return ret;
}

/**
 * For prefixing keys in v-on="obj" with "on"
 * @private
 */
function toHandlers(obj) {
    const ret = {};
    if (( true) && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(obj)) {
        warn(`v-on with no argument expects an object value.`);
        return ret;
    }
    for (const key in obj) {
        ret[`on${Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(key)}`] = obj[key];
    }
    return ret;
}

/**
 * Compiler runtime helper for creating dynamic slots object
 * @private
 */
function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
        const slot = dynamicSlots[i];
        // array of dynamic slot generated by <template v-for="..." #[...]>
        if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(slot)) {
            for (let j = 0; j < slot.length; j++) {
                slots[slot[j].name] = slot[j].fn;
            }
        }
        else if (slot) {
            // conditional single slot generated by <template v-if="..." #foo>
            slots[slot.name] = slot.fn;
        }
    }
    return slots;
}

// Core API ------------------------------------------------------------------
const version = "3.0.0-rc.10";
/**
 * SSR utils for \@vue/server-renderer. Only exposed in cjs builds.
 * @internal
 */
const ssrUtils = ( null);



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js ***!
  \***********************************************************************/
/*! exports provided: customRef, isProxy, isReactive, isReadonly, isRef, markRaw, proxyRefs, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, camelize, capitalize, toDisplayString, BaseTransition, Comment, Fragment, KeepAlive, Static, Suspense, Teleport, Text, callWithAsyncErrorHandling, callWithErrorHandling, cloneVNode, computed, createBlock, createCommentVNode, createHydrationRenderer, createRenderer, createSlots, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, devtools, getCurrentInstance, getTransitionRawChildren, h, handleError, inject, isVNode, mergeProps, nextTick, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, openBlock, popScopeId, provide, pushScopeId, queuePostFlushCb, registerRuntimeCompiler, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, ssrContextKey, ssrUtils, toHandlers, transformVNodeArgs, useSSRContext, useTransitionState, version, warn, watch, watchEffect, withCtx, withDirectives, withScopeId, Transition, TransitionGroup, createApp, createSSRApp, hydrate, render, useCssModule, useCssVars, vModelCheckbox, vModelDynamic, vModelRadio, vModelSelect, vModelText, vShow, withKeys, withModifiers */
/*! exports used: reactive, setDevtoolsHook, warn, watchEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Transition */
/* unused harmony export TransitionGroup */
/* unused harmony export createApp */
/* unused harmony export createSSRApp */
/* unused harmony export hydrate */
/* unused harmony export render */
/* unused harmony export useCssModule */
/* unused harmony export useCssVars */
/* unused harmony export vModelCheckbox */
/* unused harmony export vModelDynamic */
/* unused harmony export vModelRadio */
/* unused harmony export vModelSelect */
/* unused harmony export vModelText */
/* unused harmony export vShow */
/* unused harmony export withKeys */
/* unused harmony export withModifiers */
/* harmony import */ var _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-core */ "./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["m"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["o"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "c", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["s"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "d", function() { return _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__["t"]; });

/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");




const svgNS = 'http://www.w3.org/2000/svg';
const doc = (typeof document !== 'undefined' ? document : null);
let tempContainer;
let tempSVGContainer;
const nodeOps = {
    insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null);
    },
    remove: child => {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    createElement: (tag, isSVG, is) => isSVG
        ? doc.createElementNS(svgNS, tag)
        : doc.createElement(tag, is ? { is } : undefined),
    createText: text => doc.createTextNode(text),
    createComment: text => doc.createComment(text),
    setText: (node, text) => {
        node.nodeValue = text;
    },
    setElementText: (el, text) => {
        el.textContent = text;
    },
    parentNode: node => node.parentNode,
    nextSibling: node => node.nextSibling,
    querySelector: selector => doc.querySelector(selector),
    setScopeId(el, id) {
        el.setAttribute(id, '');
    },
    cloneNode(el) {
        return el.cloneNode(true);
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, isSVG) {
        const temp = isSVG
            ? tempSVGContainer ||
                (tempSVGContainer = doc.createElementNS(svgNS, 'svg'))
            : tempContainer || (tempContainer = doc.createElement('div'));
        temp.innerHTML = content;
        const first = temp.firstChild;
        let node = first;
        let last = node;
        while (node) {
            last = node;
            nodeOps.insert(node, parent, anchor);
            node = temp.firstChild;
        }
        return [first, last];
    }
};

// compiler should normalize class + :class bindings on the same element
// into a single binding ['staticClass', dynamic]
function patchClass(el, value, isSVG) {
    if (value == null) {
        value = '';
    }
    if (isSVG) {
        el.setAttribute('class', value);
    }
    else {
        // directly setting className should be faster than setAttribute in theory
        // if this is an element during a transition, take the temporary transition
        // classes into account.
        const transitionClasses = el._vtc;
        if (transitionClasses) {
            value = (value
                ? [value, ...transitionClasses]
                : [...transitionClasses]).join(' ');
        }
        el.className = value;
    }
}

function patchStyle(el, prev, next) {
    const style = el.style;
    if (!next) {
        el.removeAttribute('style');
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(next)) {
        if (prev !== next) {
            style.cssText = next;
        }
    }
    else {
        for (const key in next) {
            setStyle(style, key, next[key]);
        }
        if (prev && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(prev)) {
            for (const key in prev) {
                if (next[key] == null) {
                    setStyle(style, key, '');
                }
            }
        }
    }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(val)) {
        val.forEach(v => setStyle(style, name, v));
    }
    else {
        if (name.startsWith('--')) {
            // custom property definition
            style.setProperty(name, val);
        }
        else {
            const prefixed = autoPrefix(style, name);
            if (importantRE.test(val)) {
                // !important
                style.setProperty(Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hyphenate */ "l"])(prefixed), val.replace(importantRE, ''), 'important');
            }
            else {
                style[prefixed] = val;
            }
        }
    }
}
const prefixes = ['Webkit', 'Moz', 'ms'];
const prefixCache = {};
function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
        return cached;
    }
    let name = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* camelize */ "d"])(rawName);
    if (name !== 'filter' && name in style) {
        return (prefixCache[rawName] = name);
    }
    name = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* capitalize */ "f"])(name);
    for (let i = 0; i < prefixes.length; i++) {
        const prefixed = prefixes[i] + name;
        if (prefixed in style) {
            return (prefixCache[rawName] = prefixed);
        }
    }
    return rawName;
}

const xlinkNS = 'http://www.w3.org/1999/xlink';
function patchAttr(el, key, value, isSVG) {
    if (isSVG && key.startsWith('xlink:')) {
        if (value == null) {
            el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
        }
        else {
            el.setAttributeNS(xlinkNS, key, value);
        }
    }
    else {
        // note we are only checking boolean attributes that don't have a
        // corresponding dom prop of the same name here.
        const isBoolean = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isSpecialBooleanAttr */ "y"])(key);
        if (value == null || (isBoolean && value === false)) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, isBoolean ? '' : value);
        }
    }
}

// __UNSAFE__
// functions. The user is responsible for using them with only trusted content.
function patchDOMProp(el, key, value, 
// the following args are passed only due to potential innerHTML/textContent
// overriding existing VNodes, in which case the old tree must be properly
// unmounted.
prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === 'innerHTML' || key === 'textContent') {
        if (prevChildren) {
            unmountChildren(prevChildren, parentComponent, parentSuspense);
        }
        el[key] = value == null ? '' : value;
        return;
    }
    if (key === 'value' && el.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified.
        el._value = value;
        const newValue = value == null ? '' : value;
        if (el.value !== newValue) {
            el.value = newValue;
        }
        return;
    }
    if (value === '' && typeof el[key] === 'boolean') {
        // e.g. <select multiple> compiles to { multiple: '' }
        el[key] = true;
    }
    else if (value == null && typeof el[key] === 'string') {
        // e.g. <div :id="null">
        el[key] = '';
        el.removeAttribute(key);
    }
    else {
        // some properties perform value validation and throw
        try {
            el[key] = value;
        }
        catch (e) {
            if ((true)) {
                Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`Failed setting prop "${key}" on <${el.tagName.toLowerCase()}>: ` +
                    `value ${value} is invalid.`, e);
            }
        }
    }
}

// Async edge case fix requires storing an event listener's attach timestamp.
let _getNow = Date.now;
// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
if (typeof document !== 'undefined' &&
    _getNow() > document.createEvent('Event').timeStamp) {
    // if the low-res timestamp which is bigger than the event timestamp
    // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listeners as well.
    _getNow = () => performance.now();
}
// To avoid the overhead of repeatedly calling performance.now(), we cache
// and use the same timestamp for all event listeners attached in the same tick.
let cachedNow = 0;
const p = Promise.resolve();
const reset = () => {
    cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), (cachedNow = _getNow()));
function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    // vei = vue event invokers
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
        // patch
        existingInvoker.value = nextValue;
    }
    else {
        const [name, options] = parseName(rawName);
        if (nextValue) {
            // add
            const invoker = (invokers[rawName] = createInvoker(nextValue, instance));
            addEventListener(el, name, invoker, options);
        }
        else if (existingInvoker) {
            // remove
            removeEventListener(el, name, existingInvoker, options);
            invokers[rawName] = undefined;
        }
    }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
        options = {};
        let m;
        while ((m = name.match(optionsModifierRE))) {
            name = name.slice(0, name.length - m[0].length);
            options[m[0].toLowerCase()] = true;
        }
    }
    return [name.slice(2).toLowerCase(), options];
}
function createInvoker(initialValue, instance) {
    const invoker = (e) => {
        // async edge case #6566: inner click event triggers patch, event handler
        // attached to outer element during patch, and triggered again. This
        // happens because browsers fire microtask ticks between event propagation.
        // the solution is simple: we save the timestamp when a handler is attached,
        // and the handler would only fire if the event passed to it was fired
        // AFTER it was attached.
        const timeStamp = e.timeStamp || _getNow();
        if (timeStamp >= invoker.attached - 1) {
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* callWithAsyncErrorHandling */ "c"])(patchStopImmediatePropagation(e, invoker.value), instance, 5 /* NATIVE_EVENT_HANDLER */, [e]);
        }
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
}
function patchStopImmediatePropagation(e, value) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(value)) {
        const originalStop = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
            originalStop.call(e);
            e._stopped = true;
        };
        return value.map(fn => (e) => !e._stopped && fn(e));
    }
    else {
        return value;
    }
}

const nativeOnRE = /^on[a-z]/;
const forcePatchProp = (_, key) => key === 'value';
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    switch (key) {
        // special
        case 'class':
            patchClass(el, nextValue, isSVG);
            break;
        case 'style':
            patchStyle(el, prevValue, nextValue);
            break;
        default:
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isOn */ "u"])(key)) {
                // ignore v-model listeners
                if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isModelListener */ "s"])(key)) {
                    patchEvent(el, key, prevValue, nextValue, parentComponent);
                }
            }
            else if (shouldSetAsProp(el, key, nextValue, isSVG)) {
                patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
            }
            else {
                // special case for <input v-model type="checkbox"> with
                // :true-value & :false-value
                // store value as dom properties since non-string values will be
                // stringified.
                if (key === 'true-value') {
                    el._trueValue = nextValue;
                }
                else if (key === 'false-value') {
                    el._falseValue = nextValue;
                }
                patchAttr(el, key, nextValue, isSVG);
            }
            break;
    }
};
function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
        // most keys must be set as attribute on svg elements to work
        // ...except innerHTML
        if (key === 'innerHTML') {
            return true;
        }
        // or native onclick with function values
        if (key in el && nativeOnRE.test(key) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(value)) {
            return true;
        }
        return false;
    }
    // spellcheck and draggable are numerated attrs, however their
    // corresponding DOM properties are actually booleans - this leads to
    // setting it with a string "false" value leading it to be coerced to
    // `true`, so we need to always treat them as attributes.
    // Note that `contentEditable` doesn't have this problem: its DOM
    // property is also enumerated string values.
    if (key === 'spellcheck' || key === 'draggable') {
        return false;
    }
    // #1787 form as an attribute must be a string, while it accepts an Element as
    // a prop
    if (key === 'form' && typeof value === 'string') {
        return false;
    }
    // #1526 <input list> must be set as attribute
    if (key === 'list' && el.tagName === 'INPUT') {
        return false;
    }
    // native onclick with string value, must be set as attribute
    if (nativeOnRE.test(key) && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(value)) {
        return false;
    }
    return key in el;
}

function useCssModule(name = '$style') {
    /* istanbul ignore else */
    {
        const instance = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* getCurrentInstance */ "h"])();
        if (!instance) {
            ( true) && Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`useCssModule must be called inside setup()`);
            return _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
        }
        const modules = instance.type.__cssModules;
        if (!modules) {
            ( true) && Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`Current instance does not have CSS modules injected.`);
            return _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
        }
        const mod = modules[name];
        if (!mod) {
            ( true) &&
                Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`Current instance does not have CSS module named "${name}".`);
            return _vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* EMPTY_OBJ */ "b"];
        }
        return mod;
    }
}

function useCssVars(getter, scoped = false) {
    const instance = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* getCurrentInstance */ "h"])();
    /* istanbul ignore next */
    if (!instance) {
        ( true) &&
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`useCssVars is called without current active component instance.`);
        return;
    }
    const prefix = scoped && instance.type.__scopeId
        ? `${instance.type.__scopeId.replace(/^data-v-/, '')}-`
        : ``;
    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* onMounted */ "k"])(() => {
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* watchEffect */ "t"])(() => {
            setVarsOnVNode(instance.subTree, getter(instance.proxy), prefix);
        });
    });
}
function setVarsOnVNode(vnode, vars, prefix) {
    if ( vnode.shapeFlag & 128 /* SUSPENSE */) {
        const { isResolved, isHydrating, fallbackTree, subTree } = vnode.suspense;
        if (isResolved || isHydrating) {
            vnode = subTree;
        }
        else {
            vnode.suspense.effects.push(() => {
                setVarsOnVNode(subTree, vars, prefix);
            });
            vnode = fallbackTree;
        }
    }
    // drill down HOCs until it's a non-component vnode
    while (vnode.component) {
        vnode = vnode.component.subTree;
    }
    if (vnode.shapeFlag & 1 /* ELEMENT */ && vnode.el) {
        const style = vnode.el.style;
        for (const key in vars) {
            style.setProperty(`--${prefix}${key}`, Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* unref */ "q"])(vars[key]));
        }
    }
    else if (vnode.type === _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* Fragment */ "b"]) {
        vnode.children.forEach(c => setVarsOnVNode(c, vars, prefix));
    }
}

const TRANSITION = 'transition';
const ANIMATION = 'animation';
// DOM Transition is a higher-order-component based on the platform-agnostic
// base Transition component, with DOM-specific logic.
const Transition = (props, { slots }) => Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* h */ "j"])(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* BaseTransition */ "a"], resolveTransitionProps(props), slots);
Transition.displayName = 'Transition';
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
const TransitionPropsValidators = (Transition.props = /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* BaseTransition */ "a"].props, DOMTransitionPropsValidators));
function resolveTransitionProps(rawProps) {
    let { name = 'v', type, css = true, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
    const baseProps = {};
    for (const key in rawProps) {
        if (!(key in DOMTransitionPropsValidators)) {
            baseProps[key] = rawProps[key];
        }
    }
    if (!css) {
        return baseProps;
    }
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
    const finishEnter = (el, isAppear, done) => {
        removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
        removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
        done && done();
    };
    const finishLeave = (el, done) => {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
        done && done();
    };
    const makeEnterHook = (isAppear) => {
        return (el, done) => {
            const hook = isAppear ? onAppear : onEnter;
            const resolve = () => finishEnter(el, isAppear, done);
            hook && hook(el, resolve);
            nextFrame(() => {
                removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
                addTransitionClass(el, isAppear ? appearToClass : enterToClass);
                if (!(hook && hook.length > 1)) {
                    if (enterDuration) {
                        setTimeout(resolve, enterDuration);
                    }
                    else {
                        whenTransitionEnds(el, type, resolve);
                    }
                }
            });
        };
    };
    return Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])(baseProps, {
        onBeforeEnter(el) {
            onBeforeEnter && onBeforeEnter(el);
            addTransitionClass(el, enterActiveClass);
            addTransitionClass(el, enterFromClass);
        },
        onBeforeAppear(el) {
            onBeforeAppear && onBeforeAppear(el);
            addTransitionClass(el, appearActiveClass);
            addTransitionClass(el, appearFromClass);
        },
        onEnter: makeEnterHook(false),
        onAppear: makeEnterHook(true),
        onLeave(el, done) {
            const resolve = () => finishLeave(el, done);
            addTransitionClass(el, leaveActiveClass);
            addTransitionClass(el, leaveFromClass);
            nextFrame(() => {
                removeTransitionClass(el, leaveFromClass);
                addTransitionClass(el, leaveToClass);
                if (!(onLeave && onLeave.length > 1)) {
                    if (leaveDuration) {
                        setTimeout(resolve, leaveDuration);
                    }
                    else {
                        whenTransitionEnds(el, type, resolve);
                    }
                }
            });
            onLeave && onLeave(el, resolve);
        },
        onEnterCancelled(el) {
            finishEnter(el, false);
            onEnterCancelled && onEnterCancelled(el);
        },
        onAppearCancelled(el) {
            finishEnter(el, true);
            onAppearCancelled && onAppearCancelled(el);
        },
        onLeaveCancelled(el) {
            finishLeave(el);
            onLeaveCancelled && onLeaveCancelled(el);
        }
    });
}
function normalizeDuration(duration) {
    if (duration == null) {
        return null;
    }
    else if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "t"])(duration)) {
        return [NumberOf(duration.enter), NumberOf(duration.leave)];
    }
    else {
        const n = NumberOf(duration);
        return [n, n];
    }
}
function NumberOf(val) {
    const res = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* toNumber */ "H"])(val);
    if ((true))
        validateDuration(res);
    return res;
}
function validateDuration(val) {
    if (typeof val !== 'number') {
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`<transition> explicit duration is not a valid number - ` +
            `got ${JSON.stringify(val)}.`);
    }
    else if (isNaN(val)) {
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`<transition> explicit duration is NaN - ` +
            'the duration expression might be incorrect.');
    }
}
function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach(c => c && el.classList.add(c));
    (el._vtc ||
        (el._vtc = new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach(c => c && el.classList.remove(c));
    const { _vtc } = el;
    if (_vtc) {
        _vtc.delete(cls);
        if (!_vtc.size) {
            el._vtc = undefined;
        }
    }
}
function nextFrame(cb) {
    requestAnimationFrame(() => {
        requestAnimationFrame(cb);
    });
}
function whenTransitionEnds(el, expectedType, cb) {
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
        return cb();
    }
    const endEvent = type + 'end';
    let ended = 0;
    const end = () => {
        el.removeEventListener(endEvent, onEnd);
        cb();
    };
    const onEnd = (e) => {
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
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
    // JSDOM may return undefined for transition properties
    const getStyleProperties = (key) => (styles[key] || '').split(', ');
    const transitionDelays = getStyleProperties(TRANSITION + 'Delay');
    const transitionDurations = getStyleProperties(TRANSITION + 'Duration');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(ANIMATION + 'Delay');
    const animationDurations = getStyleProperties(ANIMATION + 'Duration');
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    }
    else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type =
            timeout > 0
                ? transitionTimeout > animationTimeout
                    ? TRANSITION
                    : ANIMATION
                : null;
        propCount = type
            ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
            : 0;
    }
    const hasTransform = type === TRANSITION &&
        /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property']);
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
// Old versions of Chromium (below 61.0.3163.100) formats floating pointer
// numbers in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down
// (i.e. acting as a floor function) causing unexpected behaviors
function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function toRaw(observed) {
    return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
}

const positionMap = new WeakMap();
const newPositionMap = new WeakMap();
const TransitionGroupImpl = {
    name: 'TransitionGroup',
    props: /*#__PURE__*/ Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({}, TransitionPropsValidators, {
        tag: String,
        moveClass: String
    }),
    setup(props, { slots }) {
        const instance = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* getCurrentInstance */ "h"])();
        const state = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* useTransitionState */ "r"])();
        let prevChildren;
        let children;
        Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* onUpdated */ "l"])(() => {
            // children is guaranteed to exist after initial render
            if (!prevChildren.length) {
                return;
            }
            const moveClass = props.moveClass || `${props.name || 'v'}-move`;
            if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
                return;
            }
            // we divide the work into three loops to avoid mixing DOM reads and writes
            // in each iteration - which helps prevent layout thrashing.
            prevChildren.forEach(callPendingCbs);
            prevChildren.forEach(recordPosition);
            const movedChildren = prevChildren.filter(applyTranslation);
            // force reflow to put everything in position
            forceReflow();
            movedChildren.forEach(c => {
                const el = c.el;
                const style = el.style;
                addTransitionClass(el, moveClass);
                style.transform = style.webkitTransform = style.transitionDuration = '';
                const cb = (el._moveCb = (e) => {
                    if (e && e.target !== el) {
                        return;
                    }
                    if (!e || /transform$/.test(e.propertyName)) {
                        el.removeEventListener('transitionend', cb);
                        el._moveCb = null;
                        removeTransitionClass(el, moveClass);
                    }
                });
                el.addEventListener('transitionend', cb);
            });
        });
        return () => {
            const rawProps = toRaw(props);
            const cssTransitionProps = resolveTransitionProps(rawProps);
            const tag = rawProps.tag || _vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* Fragment */ "b"];
            prevChildren = children;
            children = slots.default ? Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* getTransitionRawChildren */ "i"])(slots.default()) : [];
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.key != null) {
                    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* setTransitionHooks */ "p"])(child, Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* resolveTransitionHooks */ "n"])(child, cssTransitionProps, state, instance));
                }
                else if ((true)) {
                    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`<TransitionGroup> children must be keyed.`);
                }
            }
            if (prevChildren) {
                for (let i = 0; i < prevChildren.length; i++) {
                    const child = prevChildren[i];
                    Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* setTransitionHooks */ "p"])(child, Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* resolveTransitionHooks */ "n"])(child, cssTransitionProps, state, instance));
                    positionMap.set(child, child.el.getBoundingClientRect());
                }
            }
            return Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* createVNode */ "g"])(tag, null, children);
        };
    }
};
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
    const el = c.el;
    if (el._moveCb) {
        el._moveCb();
    }
    if (el._enterCb) {
        el._enterCb();
    }
}
function recordPosition(c) {
    newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
    const oldPos = positionMap.get(c);
    const newPos = newPositionMap.get(c);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
        const s = c.el.style;
        s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
        s.transitionDuration = '0s';
        return c;
    }
}
// this is put in a dedicated function to avoid the line from being treeshaken
function forceReflow() {
    return document.body.offsetHeight;
}
function hasCSSTransform(el, root, moveClass) {
    // Detect whether an element with the move class applied has
    // CSS transitions. Since the element may be inside an entering
    // transition at this very moment, we make a clone of it and remove
    // all other transition classes applied to ensure only the move class
    // is applied.
    const clone = el.cloneNode();
    if (el._vtc) {
        el._vtc.forEach(cls => {
            cls.split(/\s+/).forEach(c => c && clone.classList.remove(c));
        });
    }
    moveClass.split(/\s+/).forEach(c => c && clone.classList.add(c));
    clone.style.display = 'none';
    const container = (root.nodeType === 1
        ? root
        : root.parentNode);
    container.appendChild(clone);
    const { hasTransform } = getTransitionInfo(clone);
    container.removeChild(clone);
    return hasTransform;
}

const getModelAssigner = (vnode) => {
    const fn = vnode.props['onUpdate:modelValue'];
    return Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(fn) ? value => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* invokeArrayFns */ "m"])(fn, value) : fn;
};
function onCompositionStart(e) {
    e.target.composing = true;
}
function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
        target.composing = false;
        trigger(target, 'input');
    }
}
function trigger(el, type) {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
}
// We are exporting the v-model runtime directly as vnode hooks so that it can
// be tree-shaken in case v-model is never used.
const vModelText = {
    created(el, { value, modifiers: { lazy, trim, number } }, vnode) {
        el.value = value == null ? '' : value;
        el._assign = getModelAssigner(vnode);
        const castToNumber = number || el.type === 'number';
        addEventListener(el, lazy ? 'change' : 'input', e => {
            if (e.target.composing)
                return;
            let domValue = el.value;
            if (trim) {
                domValue = domValue.trim();
            }
            else if (castToNumber) {
                domValue = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* toNumber */ "H"])(domValue);
            }
            el._assign(domValue);
        });
        if (trim) {
            addEventListener(el, 'change', () => {
                el.value = el.value.trim();
            });
        }
        if (!lazy) {
            addEventListener(el, 'compositionstart', onCompositionStart);
            addEventListener(el, 'compositionend', onCompositionEnd);
            // Safari < 10.2 & UIWebView doesn't fire compositionend when
            // switching focus before confirming composition choice
            // this also fixes the issue where some browsers e.g. iOS Chrome
            // fires "change" instead of "input" on autocomplete.
            addEventListener(el, 'change', onCompositionEnd);
        }
    },
    beforeUpdate(el, { value, modifiers: { trim, number } }, vnode) {
        el._assign = getModelAssigner(vnode);
        if (document.activeElement === el) {
            if (trim && el.value.trim() === value) {
                return;
            }
            if ((number || el.type === 'number') && Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* toNumber */ "H"])(el.value) === value) {
                return;
            }
        }
        const newValue = value == null ? '' : value;
        if (el.value !== newValue) {
            el.value = newValue;
        }
    }
};
const vModelCheckbox = {
    created(el, binding, vnode) {
        setChecked(el, binding, vnode);
        el._assign = getModelAssigner(vnode);
        addEventListener(el, 'change', () => {
            const modelValue = el._modelValue;
            const elementValue = getValue(el);
            const checked = el.checked;
            const assign = el._assign;
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(modelValue)) {
                const index = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseIndexOf */ "C"])(modelValue, elementValue);
                const found = index !== -1;
                if (checked && !found) {
                    assign(modelValue.concat(elementValue));
                }
                else if (!checked && found) {
                    const filtered = [...modelValue];
                    filtered.splice(index, 1);
                    assign(filtered);
                }
            }
            else {
                assign(getCheckboxValue(el, checked));
            }
        });
    },
    beforeUpdate(el, binding, vnode) {
        el._assign = getModelAssigner(vnode);
        setChecked(el, binding, vnode);
    }
};
function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(value)) {
        el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseIndexOf */ "C"])(value, vnode.props.value) > -1;
    }
    else if (value !== oldValue) {
        el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseEqual */ "B"])(value, getCheckboxValue(el, true));
    }
}
const vModelRadio = {
    created(el, { value }, vnode) {
        el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseEqual */ "B"])(value, vnode.props.value);
        el._assign = getModelAssigner(vnode);
        addEventListener(el, 'change', () => {
            el._assign(getValue(el));
        });
    },
    beforeUpdate(el, { value, oldValue }, vnode) {
        el._assign = getModelAssigner(vnode);
        if (value !== oldValue) {
            el.checked = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseEqual */ "B"])(value, vnode.props.value);
        }
    }
};
const vModelSelect = {
    created(el, binding, vnode) {
        addEventListener(el, 'change', () => {
            const selectedVal = Array.prototype.filter
                .call(el.options, (o) => o.selected)
                .map(getValue);
            el._assign(el.multiple ? selectedVal : selectedVal[0]);
        });
        el._assign = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
        setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
        el._assign = getModelAssigner(vnode);
    },
    updated(el, { value }) {
        setSelected(el, value);
    }
};
function setSelected(el, value) {
    const isMultiple = el.multiple;
    if (isMultiple && !Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "n"])(value)) {
        ( true) &&
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`<select multiple v-model> expects an Array value for its binding, ` +
                `but got ${Object.prototype.toString.call(value).slice(8, -1)}.`);
        return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
        const option = el.options[i];
        const optionValue = getValue(option);
        if (isMultiple) {
            option.selected = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseIndexOf */ "C"])(value, optionValue) > -1;
        }
        else {
            if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* looseEqual */ "B"])(getValue(option), value)) {
                el.selectedIndex = i;
                return;
            }
        }
    }
    if (!isMultiple) {
        el.selectedIndex = -1;
    }
}
// retrieve raw value set via :value bindings
function getValue(el) {
    return '_value' in el ? el._value : el.value;
}
// retrieve raw value for true-value and false-value set via :true-value or :false-value bindings
function getCheckboxValue(el, checked) {
    const key = checked ? '_trueValue' : '_falseValue';
    return key in el ? el[key] : checked;
}
const vModelDynamic = {
    created(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, 'created');
    },
    mounted(el, binding, vnode) {
        callModelHook(el, binding, vnode, null, 'mounted');
    },
    beforeUpdate(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate');
    },
    updated(el, binding, vnode, prevVNode) {
        callModelHook(el, binding, vnode, prevVNode, 'updated');
    }
};
function callModelHook(el, binding, vnode, prevVNode, hook) {
    let modelToUse;
    switch (el.tagName) {
        case 'SELECT':
            modelToUse = vModelSelect;
            break;
        case 'TEXTAREA':
            modelToUse = vModelText;
            break;
        default:
            switch (vnode.props && vnode.props.type) {
                case 'checkbox':
                    modelToUse = vModelCheckbox;
                    break;
                case 'radio':
                    modelToUse = vModelRadio;
                    break;
                default:
                    modelToUse = vModelText;
            }
    }
    const fn = modelToUse[hook];
    fn && fn(el, binding, vnode, prevVNode);
}

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
const modifierGuards = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some(m => e[`${m}Key`] && !modifiers.includes(m))
};
/**
 * @private
 */
const withModifiers = (fn, modifiers) => {
    return (event, ...args) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = modifierGuards[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return fn(event, ...args);
    };
};
// Kept for 2.x compat.
// Note: IE11 compat for `spacebar` and `del` is removed for now.
const keyNames = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace'
};
/**
 * @private
 */
const withKeys = (fn, modifiers) => {
    return (event) => {
        if (!('key' in event))
            return;
        const eventKey = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* hyphenate */ "l"])(event.key);
        if (
        // None of the provided key modifiers match the current event key
        !modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
            return;
        }
        return fn(event);
    };
};

const vShow = {
    beforeMount(el, { value }, { transition }) {
        el._vod = el.style.display === 'none' ? '' : el.style.display;
        if (transition && value) {
            transition.beforeEnter(el);
        }
        else {
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
            }
            else {
                transition.leave(el, () => {
                    setDisplay(el, false);
                });
            }
        }
        else {
            setDisplay(el, value);
        }
    },
    beforeUnmount(el, { value }) {
        setDisplay(el, value);
    }
};
function setDisplay(el, value) {
    el.style.display = value ? el._vod : 'none';
}

const rendererOptions = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* extend */ "h"])({ patchProp, forcePatchProp }, nodeOps);
// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
let renderer;
let enabledHydration = false;
function ensureRenderer() {
    return renderer || (renderer = Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* createRenderer */ "f"])(rendererOptions));
}
function ensureHydrationRenderer() {
    renderer = enabledHydration
        ? renderer
        : Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* createHydrationRenderer */ "e"])(rendererOptions);
    enabledHydration = true;
    return renderer;
}
// use explicit type casts here to avoid import() calls in rolled-up d.ts
const render = ((...args) => {
    ensureRenderer().render(...args);
});
const hydrate = ((...args) => {
    ensureHydrationRenderer().hydrate(...args);
});
const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    if ((true)) {
        injectNativeTagCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (!container)
            return;
        const component = app._component;
        if (!Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "o"])(component) && !component.render && !component.template) {
            component.template = container.innerHTML;
        }
        // clear content before mounting
        container.innerHTML = '';
        const proxy = mount(container);
        container.removeAttribute('v-cloak');
        container.setAttribute('data-v-app', '');
        return proxy;
    };
    return app;
});
const createSSRApp = ((...args) => {
    const app = ensureHydrationRenderer().createApp(...args);
    if ((true)) {
        injectNativeTagCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
        const container = normalizeContainer(containerOrSelector);
        if (container) {
            return mount(container, true);
        }
    };
    return app;
});
function injectNativeTagCheck(app) {
    // Inject `isNativeTag`
    // this is used for component name validation (dev only)
    Object.defineProperty(app.config, 'isNativeTag', {
        value: (tag) => Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isHTMLTag */ "q"])(tag) || Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isSVGTag */ "x"])(tag),
        writable: false
    });
}
function normalizeContainer(container) {
    if (Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "z"])(container)) {
        const res = document.querySelector(container);
        if (( true) && !res) {
            Object(_vue_runtime_core__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "s"])(`Failed to mount app: mount target selector returned null.`);
        }
        return res;
    }
    return container;
}




/***/ }),

/***/ "./node_modules/@vue/shared/dist/shared.esm-bundler.js":
/*!*************************************************************!*\
  !*** ./node_modules/@vue/shared/dist/shared.esm-bundler.js ***!
  \*************************************************************/
/*! exports provided: EMPTY_ARR, EMPTY_OBJ, NO, NOOP, PatchFlagNames, babelParserDefaultPlugins, camelize, capitalize, def, escapeHtml, escapeHtmlComment, extend, generateCodeFrame, getGlobalThis, hasChanged, hasOwn, hyphenate, invokeArrayFns, isArray, isBooleanAttr, isDate, isFunction, isGloballyWhitelisted, isHTMLTag, isIntegerKey, isKnownAttr, isModelListener, isNoUnitNumericStyleProp, isObject, isOn, isPlainObject, isPromise, isReservedProp, isSSRSafeAttrName, isSVGTag, isSpecialBooleanAttr, isString, isSymbol, isVoidTag, looseEqual, looseIndexOf, makeMap, normalizeClass, normalizeStyle, objectToString, parseStringStyle, propsToAttrMap, remove, stringifyStyle, toDisplayString, toNumber, toRawType, toTypeString */
/*! exports used: EMPTY_ARR, EMPTY_OBJ, NO, NOOP, camelize, capitalize, def, extend, getGlobalThis, hasChanged, hasOwn, hyphenate, invokeArrayFns, isArray, isFunction, isGloballyWhitelisted, isHTMLTag, isIntegerKey, isModelListener, isObject, isOn, isPromise, isReservedProp, isSVGTag, isSpecialBooleanAttr, isString, isSymbol, looseEqual, looseIndexOf, makeMap, normalizeClass, normalizeStyle, remove, toNumber, toRawType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EMPTY_ARR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EMPTY_OBJ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return NO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return NOOP; });
/* unused harmony export PatchFlagNames */
/* unused harmony export babelParserDefaultPlugins */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return camelize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return def; });
/* unused harmony export escapeHtml */
/* unused harmony export escapeHtmlComment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return extend; });
/* unused harmony export generateCodeFrame */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getGlobalThis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return hasChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return hasOwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return hyphenate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return invokeArrayFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return isArray; });
/* unused harmony export isBooleanAttr */
/* unused harmony export isDate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return isFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return isGloballyWhitelisted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return isHTMLTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return isIntegerKey; });
/* unused harmony export isKnownAttr */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return isModelListener; });
/* unused harmony export isNoUnitNumericStyleProp */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return isOn; });
/* unused harmony export isPlainObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return isPromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return isReservedProp; });
/* unused harmony export isSSRSafeAttrName */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return isSVGTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return isSpecialBooleanAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return isSymbol; });
/* unused harmony export isVoidTag */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return looseEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return looseIndexOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return makeMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return normalizeClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return normalizeStyle; });
/* unused harmony export objectToString */
/* unused harmony export parseStringStyle */
/* unused harmony export propsToAttrMap */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return remove; });
/* unused harmony export stringifyStyle */
/* unused harmony export toDisplayString */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return toNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return toRawType; });
/* unused harmony export toTypeString */
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

// Patch flags are optimization hints generated by the compiler.
// when a block with dynamicChildren is encountered during diff, the algorithm
// enters "optimized mode". In this mode, we know that the vdom is produced by
// a render function generated by the compiler, so the algorithm only needs to
// handle updates explicitly marked by these patch flags.
// dev only flag -> name mapping
const PatchFlagNames = {
    [1 /* TEXT */]: `TEXT`,
    [2 /* CLASS */]: `CLASS`,
    [4 /* STYLE */]: `STYLE`,
    [8 /* PROPS */]: `PROPS`,
    [16 /* FULL_PROPS */]: `FULL_PROPS`,
    [32 /* HYDRATE_EVENTS */]: `HYDRATE_EVENTS`,
    [64 /* STABLE_FRAGMENT */]: `STABLE_FRAGMENT`,
    [128 /* KEYED_FRAGMENT */]: `KEYED_FRAGMENT`,
    [256 /* UNKEYED_FRAGMENT */]: `UNKEYED_FRAGMENT`,
    [1024 /* DYNAMIC_SLOTS */]: `DYNAMIC_SLOTS`,
    [512 /* NEED_PATCH */]: `NEED_PATCH`,
    [-1 /* HOISTED */]: `HOISTED`,
    [-2 /* BAIL */]: `BAIL`
};

const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
    'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
    'Object,Boolean,String,RegExp,Map,Set,JSON,Intl';
const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED);

const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + 1;
        if (count >= start) {
            for (let j = i - range; j <= i + range || end > count; j++) {
                if (j < 0 || j >= lines.length)
                    continue;
                const line = j + 1;
                res.push(`${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
                const lineLength = lines[j].length;
                if (j === i) {
                    // push underline
                    const pad = start - (count - lineLength) + 1;
                    const length = Math.max(1, end > count ? lineLength - pad : end - start);
                    res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
                }
                else if (j > i) {
                    if (end > count) {
                        const length = Math.max(Math.min(end - count, lineLength), 1);
                        res.push(`   |  ` + '^'.repeat(length));
                    }
                    count += lineLength + 1;
                }
            }
            break;
        }
    }
    return res.join('\n');
}

/**
 * On the client we only need to offer special cases for boolean attributes that
 * have different names from their corresponding dom properties:
 * - itemscope -> N/A
 * - allowfullscreen -> allowFullscreen
 * - formnovalidate -> formNoValidate
 * - ismap -> isMap
 * - nomodule -> noModule
 * - novalidate -> noValidate
 * - readonly -> readOnly
 */
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs);
/**
 * The full list is needed during SSR to produce the correct initial markup.
 */
const isBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs +
    `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`);
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
    if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
    }
    const isUnsafe = unsafeAttrCharRE.test(name);
    if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
    }
    return (attrValidationCache[name] = !isUnsafe);
}
const propsToAttrMap = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
};
/**
 * CSS properties that accept plain numbers
 */
const isNoUnitNumericStyleProp = /*#__PURE__*/ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,` +
    `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` +
    `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` +
    `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` +
    `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` +
    `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` +
    // SVG
    `fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` +
    `stroke-miterlimit,stroke-opacity,stroke-width`);
/**
 * Known attributes, this is used for stringification of runtime static nodes
 * so that we don't stringify bindings that cannot be set from HTML.
 * Don't also forget to allow `data-*` and `aria-*`!
 * Generated from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
const isKnownAttr = /*#__PURE__*/ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,` +
    `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` +
    `border,buffered,capture,challenge,charset,checked,cite,class,code,` +
    `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` +
    `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` +
    `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` +
    `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` +
    `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` +
    `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` +
    `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` +
    `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` +
    `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` +
    `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` +
    `start,step,style,summary,tabindex,target,title,translate,type,usemap,` +
    `value,width,wrap`);

function normalizeStyle(value) {
    if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
            if (normalized) {
                for (const key in normalized) {
                    res[key] = normalized[key];
                }
            }
        }
        return res;
    }
    else if (isObject(value)) {
        return value;
    }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach(item => {
        if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return ret;
}
function stringifyStyle(styles) {
    let ret = '';
    if (!styles) {
        return ret;
    }
    for (const key in styles) {
        const value = styles[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) ||
            (typeof value === 'number' && isNoUnitNumericStyleProp(normalizedKey))) {
            // only render valid values
            ret += `${normalizedKey}:${value};`;
        }
    }
    return ret;
}
function normalizeClass(value) {
    let res = '';
    if (isString(value)) {
        res = value;
    }
    else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            res += normalizeClass(value[i]) + ' ';
        }
    }
    else if (isObject(value)) {
        for (const name in value) {
            if (value[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}

// These tag configs are shared between compiler-dom and runtime-dom, so they
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
    'header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,' +
    'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
    'data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,' +
    'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
    'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
    'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
    'option,output,progress,select,textarea,details,dialog,menu,' +
    'summary,template,blockquote,iframe,tfoot';
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
    'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
    'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
    'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
    'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
    'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
    'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
    'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
    'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
    'text,textPath,title,tspan,unknown,use,view';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
const isSVGTag = /*#__PURE__*/ makeMap(SVG_TAGS);
const isVoidTag = /*#__PURE__*/ makeMap(VOID_TAGS);

const escapeRE = /["'&<>]/;
function escapeHtml(string) {
    const str = '' + string;
    const match = escapeRE.exec(str);
    if (!match) {
        return str;
    }
    let html = '';
    let escaped;
    let index;
    let lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escaped = '&quot;';
                break;
            case 38: // &
                escaped = '&amp;';
                break;
            case 39: // '
                escaped = '&#39;';
                break;
            case 60: // <
                escaped = '&lt;';
                break;
            case 62: // >
                escaped = '&gt;';
                break;
            default:
                continue;
        }
        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
    }
    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
// https://www.w3.org/TR/html52/syntax.html#comments
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
    return src.replace(commentStripRE, '');
}

function looseCompareArrays(a, b) {
    if (a.length !== b.length)
        return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
    }
    return equal;
}
function looseEqual(a, b) {
    if (a === b)
        return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject(a);
    bValidType = isObject(b);
    if (aValidType || bValidType) {
        /* istanbul ignore if: this if will probably never be called */
        if (!aValidType || !bValidType) {
            return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
            return false;
        }
        for (const key in a) {
            const aHasKey = a.hasOwnProperty(key);
            const bHasKey = b.hasOwnProperty(key);
            if ((aHasKey && !bHasKey) ||
                (!aHasKey && bHasKey) ||
                !looseEqual(a[key], b[key])) {
                return false;
            }
        }
    }
    return String(a) === String(b);
}
function looseIndexOf(arr, val) {
    return arr.findIndex(item => looseEqual(item, val));
}

/**
 * For converting {{ interpolation }} values to displayed strings.
 * @private
 */
const toDisplayString = (val) => {
    return val == null
        ? ''
        : isObject(val)
            ? JSON.stringify(val, replacer, 2)
            : String(val);
};
const replacer = (_key, val) => {
    if (val instanceof Map) {
        return {
            [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
                entries[`${key} =>`] = val;
                return entries;
            }, {})
        };
    }
    else if (val instanceof Set) {
        return {
            [`Set(${val.size})`]: [...val.values()]
        };
    }
    else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
    }
    return val;
};

/**
 * List of @babel/parser plugins that are used for template expression
 * transforms and SFC script transforms. By default we enable proposals slated
 * for ES2020. This will need to be updated as the spec moves forward.
 * Full list at https://babeljs.io/docs/en/next/babel-parser#plugins
 */
const babelParserDefaultPlugins = [
    'bigInt',
    'optionalChaining',
    'nullishCoalescingOperator'
];
const EMPTY_OBJ = ( true)
    ? Object.freeze({})
    : undefined;
const EMPTY_ARR = [];
const NOOP = () => { };
/**
 * Always return false.
 */
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith('onUpdate:');
const extend = Object.assign;
const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === '[object Object]';
const isIntegerKey = (key) => isString(key) && key[0] !== '-' && '' + parseInt(key, 10) === key;
const isReservedProp = /*#__PURE__*/ makeMap('key,ref,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted');
const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
};
const camelizeRE = /-(\w)/g;
/**
 * @private
 */
const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});
const hyphenateRE = /\B([A-Z])/g;
/**
 * @private
 */
const hyphenate = cacheStringFunction((str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * @private
 */
const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
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
const toNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
    return (_globalThis ||
        (_globalThis =
            typeof globalThis !== 'undefined'
                ? globalThis
                : typeof self !== 'undefined'
                    ? self
                    : typeof window !== 'undefined'
                        ? window
                        : typeof global !== 'undefined'
                            ? global
                            : {}));
};



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ajax-hook/index.js":
/*!*****************************************!*\
  !*** ./node_modules/ajax-hook/index.js ***!
  \*****************************************/
/*! exports provided: hook, unHook, proxy, unProxy */
/*! exports used: proxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _src_xhr_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/xhr-hook */ "./node_modules/ajax-hook/src/xhr-hook.js");
/* harmony import */ var _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/xhr-proxy */ "./node_modules/ajax-hook/src/xhr-proxy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 **/





/***/ }),

/***/ "./node_modules/ajax-hook/src/xhr-hook.js":
/*!************************************************!*\
  !*** ./node_modules/ajax-hook/src/xhr-hook.js ***!
  \************************************************/
/*! exports provided: configEvent, hook, unHook */
/*! exports used: configEvent, hook, unHook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return configEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return hook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unHook; });
/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

// Save original XMLHttpRequest as _rxhr
var realXhr = "_rxhr"

function configEvent(event, xhrProxy) {
    var e = {};
    for (var attr in event) e[attr] = event[attr];
    // xhrProxy instead
    e.target = e.currentTarget = xhrProxy
    return e;
}

function hook(proxy) {
    // Avoid double hookAjax
    window[realXhr] = window[realXhr] || XMLHttpRequest

    XMLHttpRequest = function () {
        var xhr = new window[realXhr];
        // We shouldn't hookAjax XMLHttpRequest.prototype because we can't
        // guarantee that all attributes are on the prototype。
        // Instead, hooking XMLHttpRequest instance can avoid this problem.
        for (var attr in xhr) {
            var type = "";
            try {
                type = typeof xhr[attr] // May cause exception on some browser
            } catch (e) {
            }
            if (type === "function") {
                // hookAjax methods of xhr, such as `open`、`send` ...
                this[attr] = hookFunction(attr);
            } else {
                Object.defineProperty(this, attr, {
                    get: getterFactory(attr),
                    set: setterFactory(attr),
                    enumerable: true
                })
            }
        }
        var that = this;
        xhr.getProxy = function () {
            return that
        }
        this.xhr = xhr;
    }

    // Generate getter for attributes of xhr
    function getterFactory(attr) {
        return function () {
            var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
            var attrGetterHook = (proxy[attr] || {})["getter"]
            return attrGetterHook && attrGetterHook(v, this) || v
        }
    }

    // Generate setter for attributes of xhr; by this we have an opportunity
    // to hookAjax event callbacks （eg: `onload`） of xhr;
    function setterFactory(attr) {
        return function (v) {
            var xhr = this.xhr;
            var that = this;
            var hook = proxy[attr];
            // hookAjax  event callbacks such as `onload`、`onreadystatechange`...
            if (attr.substring(0, 2) === 'on') {
                that[attr + "_"] = v;
                xhr[attr] = function (e) {
                    e = configEvent(e, that)
                    var ret = proxy[attr] && proxy[attr].call(that, xhr, e)
                    ret || v.call(that, e);
                }
            } else {
                //If the attribute isn't writable, generate proxy attribute
                var attrSetterHook = (hook || {})["setter"];
                v = attrSetterHook && attrSetterHook(v, that) || v
                this[attr + "_"] = v;
                try {
                    // Not all attributes of xhr are writable(setter may undefined).
                    xhr[attr] = v;
                } catch (e) {
                }
            }
        }
    }

    // Hook methods of xhr.
    function hookFunction(fun) {
        return function () {
            var args = [].slice.call(arguments)
            if (proxy[fun]) {
                var ret = proxy[fun].call(this, args, this.xhr)
                // If the proxy return value exists, return it directly,
                // otherwise call the function of xhr.
                if (ret) return ret;
            }
            return this.xhr[fun].apply(this.xhr, args);
        }
    }

    // Return the real XMLHttpRequest
    return window[realXhr];
}

function unHook() {
    if (window[realXhr]) XMLHttpRequest = window[realXhr];
    window[realXhr] = undefined;
}




/***/ }),

/***/ "./node_modules/ajax-hook/src/xhr-proxy.js":
/*!*************************************************!*\
  !*** ./node_modules/ajax-hook/src/xhr-proxy.js ***!
  \*************************************************/
/*! exports provided: proxy, unProxy */
/*! exports used: proxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return proxy; });
/* unused harmony export unProxy */
/* harmony import */ var _xhr_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xhr-hook */ "./node_modules/ajax-hook/src/xhr-hook.js");
/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */



var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];
var eventLoad = events[0],
    eventLoadEnd = events[1],
    eventTimeout = events[2],
    eventError = events[3],
    eventReadyStateChange = events[4],
    eventAbort = events[5];


var singleton,
    prototype = 'prototype';


function proxy(proxy) {
    if (singleton) throw "Proxy already exists";
    return singleton = new Proxy(proxy);
}

function unProxy() {
    singleton = null
    Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* unHook */ "c"])()
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement('a'));
}

function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = 'on' + name + '_';
    var event = Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* configEvent */ "a"])({type: name}, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if(typeof(Event) === 'function') {
        evt = new Event(name,{bubbles: false});
    } else {
        // https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11
        evt = document.createEvent('Event');
        evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
}


function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
}

Handler[prototype] = Object.create({
    resolve: function resolve(response) {
        var xhrProxy = this.xhrProxy;
        var xhr = this.xhr;
        xhrProxy.readyState = 4;
        xhr.resHeader = response.headers;
        xhrProxy.response = xhrProxy.responseText = response.response;
        xhrProxy.statusText = response.statusText;
        xhrProxy.status = response.status;
        triggerListener(xhr, eventReadyStateChange);
        triggerListener(xhr, eventLoad);
        triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
        this.xhrProxy.status = 0;
        triggerListener(this.xhr, error.type);
        triggerListener(this.xhr, eventLoadEnd);
    }
});

function makeHandler(next) {
    function sub(xhr) {
        Handler.call(this, xhr);
    }

    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
}

var RequestHandler = makeHandler(function (rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
        xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
});

var ResponseHandler = makeHandler(function (response) {
    this.resolve(response);
});

var ErrorHandler = makeHandler(function (error) {
    this.reject(error);
});

function Proxy(proxy) {
    var onRequest = proxy.onRequest,
        onResponse = proxy.onResponse,
        onError = proxy.onError;

    function handleResponse(xhr, xhrProxy) {
        var handler = new ResponseHandler(xhr);
        if (!onResponse) return handler.resolve();
        var ret = {
            response: xhrProxy.response,
            status: xhrProxy.status,
            statusText: xhrProxy.statusText,
            config: xhr.config,
            headers: xhr.resHeader || xhr.getAllResponseHeaders().split('\r\n').reduce(function (ob, str) {
                if (str === "") return ob;
                var m = str.split(":");
                ob[m.shift()] = trim(m.join(':'));
                return ob;
            }, {})
        };
        onResponse(ret, handler);
    }

    function onerror(xhr, xhrProxy, e) {
        var handler = new ErrorHandler(xhr);
        var error = {config: xhr.config, error: e};
        if (onError) {
            onError(error, handler);
        } else {
            handler.next(error);
        }
    }

    function preventXhrProxyCallback() {
        return true;
    }

    function errorCallback(xhr, e) {
        onerror(xhr, this, e);
        return true;
    }

    function stateChangeCallback(xhr, xhrProxy) {
        if (xhr.readyState === 4 && xhr.status !== 0) {
            handleResponse(xhr, xhrProxy);
        } else if (xhr.readyState !== 4) {
            triggerListener(xhr, eventReadyStateChange);
        }
        return true;
    }

    return Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* hook */ "b"])({
        onload: preventXhrProxyCallback,
        onloadend: preventXhrProxyCallback,
        onerror: errorCallback,
        ontimeout: errorCallback,
        onabort: errorCallback,
        onreadystatechange: function (xhr) {
            return stateChangeCallback(xhr, this);
        },
        open: function open(args, xhr) {
            var _this = this;
            var config = xhr.config = {headers: {}};
            config.method = args[0];
            config.url = args[1];
            config.async = args[2];
            config.user = args[3];
            config.password = args[4];
            config.xhr = xhr;
            var evName = 'on' + eventReadyStateChange;
            if (!xhr[evName]) {
                xhr[evName] = function () {
                    return stateChangeCallback(xhr, _this);
                };
            }

            var defaultErrorHandler = function defaultErrorHandler(e) {
                onerror(xhr, _this, Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* configEvent */ "a"])(e, _this));
            };
            [eventError, eventTimeout, eventAbort].forEach(function (e) {
                var event = 'on' + e;
                if (!xhr[event]) xhr[event] = defaultErrorHandler;
            });

            // 如果有请求拦截器，则在调用onRequest后再打开链接。因为onRequest最佳调用时机是在send前，
            // 所以我们在send拦截函数中再手动调用open，因此返回true阻止xhr.open调用。
            //
            // 如果没有请求拦截器，则不用阻断xhr.open调用
            if (onRequest) return true;
        },
        send: function (args, xhr) {
            var config = xhr.config
            config.withCredentials=xhr.withCredentials
            config.body = args[0];
            if (onRequest) {
                // In 'onRequest', we may call XHR's event handler, such as `xhr.onload`.
                // However, XHR's event handler may not be set until xhr.send is called in
                // the user's code, so we use `setTimeout` to avoid this situation
                var req = function () {
                    onRequest(config, new RequestHandler(xhr));
                }
                config.async === false ? req() : setTimeout(req)
                return true;
            }
        },
        setRequestHeader: function (args, xhr) {
            // Collect request headers
            xhr.config.headers[args[0].toLowerCase()] = args[1];
            return true;
        },
        addEventListener: function (args, xhr) {
            var _this = this;
            if (events.indexOf(args[0]) !== -1) {
                var handler = args[1];
                getEventTarget(xhr).addEventListener(args[0], function (e) {
                    var event = Object(_xhr_hook__WEBPACK_IMPORTED_MODULE_0__[/* configEvent */ "a"])(e, _this);
                    event.type = args[0];
                    event.isTrusted = true;
                    handler.call(_this, event);
                });
                return true;
            }
        },
        getAllResponseHeaders: function (_, xhr) {
            var headers = xhr.resHeader
            if (headers) {
                var header = "";
                for (var key in headers) {
                    header += key + ': ' + headers[key] + '\r\n';
                }
                return header;
            }
        },
        getResponseHeader: function (args, xhr) {
            var headers = xhr.resHeader
            if (headers) {
                return headers[(args[0] || '').toLowerCase()];
            }
        }
    });
}






/***/ }),

/***/ "./node_modules/svelte/internal/index.mjs":
/*!************************************************!*\
  !*** ./node_modules/svelte/internal/index.mjs ***!
  \************************************************/
/*! exports provided: HtmlTag, SvelteComponent, SvelteComponentDev, SvelteElement, action_destroyer, add_attribute, add_classes, add_flush_callback, add_location, add_render_callback, add_resize_listener, add_transform, afterUpdate, append, append_dev, assign, attr, attr_dev, beforeUpdate, bind, binding_callbacks, blank_object, bubble, check_outros, children, claim_component, claim_element, claim_space, claim_text, clear_loops, component_subscribe, compute_rest_props, compute_slots, createEventDispatcher, create_animation, create_bidirectional_transition, create_component, create_in_transition, create_out_transition, create_slot, create_ssr_component, current_component, custom_event, dataset_dev, debug, destroy_block, destroy_component, destroy_each, detach, detach_after_dev, detach_before_dev, detach_between_dev, detach_dev, dirty_components, dispatch_dev, each, element, element_is, empty, escape, escaped, exclude_internal_props, fix_and_destroy_block, fix_and_outro_and_destroy_block, fix_position, flush, getContext, get_binding_group_value, get_current_component, get_slot_changes, get_slot_context, get_spread_object, get_spread_update, get_store_value, globals, group_outros, handle_promise, has_prop, identity, init, insert, insert_dev, intros, invalid_attribute_name_character, is_client, is_crossorigin, is_empty, is_function, is_promise, listen, listen_dev, loop, loop_guard, missing_component, mount_component, noop, not_equal, now, null_to_empty, object_without_properties, onDestroy, onMount, once, outro_and_destroy_block, prevent_default, prop_dev, query_selector_all, raf, run, run_all, safe_not_equal, schedule_update, select_multiple_value, select_option, select_options, select_value, self, setContext, set_attributes, set_current_component, set_custom_element_data, set_data, set_data_dev, set_input_type, set_input_value, set_now, set_raf, set_store_value, set_style, set_svg_attributes, space, spread, stop_propagation, subscribe, svg_element, text, tick, time_ranges_to_array, to_number, toggle_class, transition_in, transition_out, update_keyed_each, update_slot, validate_component, validate_each_argument, validate_each_keys, validate_slots, validate_store, xlink_attr */
/*! exports used: HtmlTag, SvelteComponent, add_flush_callback, add_render_callback, add_transform, append, assign, attr, bind, binding_callbacks, check_outros, component_subscribe, createEventDispatcher, create_animation, create_bidirectional_transition, create_component, destroy_block, destroy_component, destroy_each, detach, element, fix_and_outro_and_destroy_block, fix_position, get_store_value, group_outros, identity, init, insert, is_function, listen, mount_component, noop, run_all, safe_not_equal, set_data, set_input_value, set_style, space, subscribe, text, transition_in, transition_out, update_keyed_each */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HtmlTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SvelteComponent; });
/* unused harmony export SvelteComponentDev */
/* unused harmony export SvelteElement */
/* unused harmony export action_destroyer */
/* unused harmony export add_attribute */
/* unused harmony export add_classes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return add_flush_callback; });
/* unused harmony export add_location */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return add_render_callback; });
/* unused harmony export add_resize_listener */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return add_transform; });
/* unused harmony export afterUpdate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return append; });
/* unused harmony export append_dev */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return attr; });
/* unused harmony export attr_dev */
/* unused harmony export beforeUpdate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return binding_callbacks; });
/* unused harmony export blank_object */
/* unused harmony export bubble */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return check_outros; });
/* unused harmony export children */
/* unused harmony export claim_component */
/* unused harmony export claim_element */
/* unused harmony export claim_space */
/* unused harmony export claim_text */
/* unused harmony export clear_loops */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return component_subscribe; });
/* unused harmony export compute_rest_props */
/* unused harmony export compute_slots */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return createEventDispatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return create_animation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return create_bidirectional_transition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return create_component; });
/* unused harmony export create_in_transition */
/* unused harmony export create_out_transition */
/* unused harmony export create_slot */
/* unused harmony export create_ssr_component */
/* unused harmony export current_component */
/* unused harmony export custom_event */
/* unused harmony export dataset_dev */
/* unused harmony export debug */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return destroy_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return destroy_each; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return detach; });
/* unused harmony export detach_after_dev */
/* unused harmony export detach_before_dev */
/* unused harmony export detach_between_dev */
/* unused harmony export detach_dev */
/* unused harmony export dirty_components */
/* unused harmony export dispatch_dev */
/* unused harmony export each */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return element; });
/* unused harmony export element_is */
/* unused harmony export empty */
/* unused harmony export escape */
/* unused harmony export escaped */
/* unused harmony export exclude_internal_props */
/* unused harmony export fix_and_destroy_block */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return fix_and_outro_and_destroy_block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return fix_position; });
/* unused harmony export flush */
/* unused harmony export getContext */
/* unused harmony export get_binding_group_value */
/* unused harmony export get_current_component */
/* unused harmony export get_slot_changes */
/* unused harmony export get_slot_context */
/* unused harmony export get_spread_object */
/* unused harmony export get_spread_update */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return get_store_value; });
/* unused harmony export globals */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return group_outros; });
/* unused harmony export handle_promise */
/* unused harmony export has_prop */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return insert; });
/* unused harmony export insert_dev */
/* unused harmony export intros */
/* unused harmony export invalid_attribute_name_character */
/* unused harmony export is_client */
/* unused harmony export is_crossorigin */
/* unused harmony export is_empty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return is_function; });
/* unused harmony export is_promise */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return listen; });
/* unused harmony export listen_dev */
/* unused harmony export loop */
/* unused harmony export loop_guard */
/* unused harmony export missing_component */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return mount_component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return noop; });
/* unused harmony export not_equal */
/* unused harmony export now */
/* unused harmony export null_to_empty */
/* unused harmony export object_without_properties */
/* unused harmony export onDestroy */
/* unused harmony export onMount */
/* unused harmony export once */
/* unused harmony export outro_and_destroy_block */
/* unused harmony export prevent_default */
/* unused harmony export prop_dev */
/* unused harmony export query_selector_all */
/* unused harmony export raf */
/* unused harmony export run */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return run_all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return safe_not_equal; });
/* unused harmony export schedule_update */
/* unused harmony export select_multiple_value */
/* unused harmony export select_option */
/* unused harmony export select_options */
/* unused harmony export select_value */
/* unused harmony export self */
/* unused harmony export setContext */
/* unused harmony export set_attributes */
/* unused harmony export set_current_component */
/* unused harmony export set_custom_element_data */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return set_data; });
/* unused harmony export set_data_dev */
/* unused harmony export set_input_type */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "J", function() { return set_input_value; });
/* unused harmony export set_now */
/* unused harmony export set_raf */
/* unused harmony export set_store_value */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "K", function() { return set_style; });
/* unused harmony export set_svg_attributes */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "L", function() { return space; });
/* unused harmony export spread */
/* unused harmony export stop_propagation */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "M", function() { return subscribe; });
/* unused harmony export svg_element */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "N", function() { return text; });
/* unused harmony export tick */
/* unused harmony export time_ranges_to_array */
/* unused harmony export to_number */
/* unused harmony export toggle_class */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "O", function() { return transition_in; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "P", function() { return transition_out; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Q", function() { return update_keyed_each; });
/* unused harmony export update_slot */
/* unused harmony export validate_component */
/* unused harmony export validate_each_argument */
/* unused harmony export validate_each_keys */
/* unused harmony export validate_slots */
/* unused harmony export validate_store */
/* unused harmony export xlink_attr */
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function is_promise(value) {
    return value && typeof value === 'object' && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function not_equal(a, b) {
    return a != a ? b == b : a !== b;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
        result[key] = true;
    }
    return result;
}
function once(fn) {
    let ran = false;
    return function (...args) {
        if (ran)
            return;
        ran = true;
        fn.call(this, ...args);
    };
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}
const has_prop = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;
// used internally for testing
function set_now(fn) {
    now = fn;
}
function set_raf(fn) {
    raf = fn;
}

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * For testing purposes only!
 */
function clear_loops() {
    tasks.clear();
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function element_is(name, is) {
    return document.createElement(name, { is });
}
function object_without_properties(obj, exclude) {
    const target = {};
    for (const k in obj) {
        if (has_prop(obj, k)
            // @ts-ignore
            && exclude.indexOf(k) === -1) {
            // @ts-ignore
            target[k] = obj[k];
        }
    }
    return target;
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function self(fn) {
    return function (event) {
        // @ts-ignore
        if (event.target === this)
            fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
}
function set_custom_element_data(node, prop, value) {
    if (prop in node) {
        node[prop] = value;
    }
    else {
        attr(node, prop, value);
    }
}
function xlink_attr(node, attribute, value) {
    node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
}
function get_binding_group_value(group, __value, checked) {
    const value = new Set();
    for (let i = 0; i < group.length; i += 1) {
        if (group[i].checked)
            value.add(group[i].__value);
    }
    if (!checked) {
        value.delete(__value);
    }
    return Array.from(value);
}
function to_number(value) {
    return value === '' ? null : +value;
}
function time_ranges_to_array(ranges) {
    const array = [];
    for (let i = 0; i < ranges.length; i += 1) {
        array.push({ start: ranges.start(i), end: ranges.end(i) });
    }
    return array;
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            const remove = [];
            while (j < node.attributes.length) {
                const attribute = node.attributes[j++];
                if (!attributes[attribute.name]) {
                    remove.push(attribute.name);
                }
            }
            for (let k = 0; k < remove.length; k++) {
                node.removeAttribute(remove[k]);
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_input_type(input, type) {
    try {
        input.type = type;
    }
    catch (e) {
        // do nothing
    }
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
}
function select_options(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        option.selected = ~value.indexOf(option.__value);
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function select_multiple_value(select) {
    return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
        `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function query_selector_all(selector, parent = document.body) {
    return Array.from(parent.querySelectorAll(selector));
}
class HtmlTag {
    constructor(anchor = null) {
        this.a = anchor;
        this.e = this.n = null;
    }
    m(html, target, anchor = null) {
        if (!this.e) {
            this.e = element(target.nodeName);
            this.t = target;
            this.h(html);
        }
        this.i(anchor);
    }
    h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    i(anchor) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(this.t, this.n[i], anchor);
        }
    }
    p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

function create_animation(node, from, fn, params) {
    if (!from)
        return noop;
    const to = node.getBoundingClientRect();
    if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
        return noop;
    const { delay = 0, duration = 300, easing = identity, 
    // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
    start: start_time = now() + delay, 
    // @ts-ignore todo:
    end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
    let running = true;
    let started = false;
    let name;
    function start() {
        if (css) {
            name = create_rule(node, 0, 1, duration, delay, easing, css);
        }
        if (!delay) {
            started = true;
        }
    }
    function stop() {
        if (css)
            delete_rule(node, name);
        running = false;
    }
    loop(now => {
        if (!started && now >= start_time) {
            started = true;
        }
        if (started && now >= end) {
            tick(1, 0);
            stop();
        }
        if (!running) {
            return false;
        }
        if (started) {
            const p = now - start_time;
            const t = 0 + 1 * easing(p / duration);
            tick(t, 1 - t);
        }
        return true;
    });
    start();
    tick(0, 1);
    return stop;
}
function fix_position(node) {
    const style = getComputedStyle(node);
    if (style.position !== 'absolute' && style.position !== 'fixed') {
        const { width, height } = style;
        const a = node.getBoundingClientRect();
        node.style.position = 'absolute';
        node.style.width = width;
        node.style.height = height;
        add_transform(node, a);
    }
}
function add_transform(node, a) {
    const b = node.getBoundingClientRect();
    if (a.left !== b.left || a.top !== b.top) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function beforeUpdate(fn) {
    get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const intros = { enabled: false };
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            info.blocks[i] = null;
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            if (!info.hasCatch) {
                throw error;
            }
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function fix_and_destroy_block(block, lookup) {
    block.f();
    destroy_block(block, lookup);
}
function fix_and_outro_and_destroy_block(block, lookup) {
    block.f();
    outro_and_destroy_block(block, lookup);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error(`Cannot have duplicate keys in a keyed each`);
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += " " + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += " " + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
function debug(file, line, column, values) {
    console.log(`{@debug} ${file ? file + ' ' : ''}(${line}:${column})`); // eslint-disable-line no-console
    console.log(values); // eslint-disable-line no-console
    return '';
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
    return classes ? ` class="${classes}"` : ``;
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function detach_between_dev(before, after) {
    while (before.nextSibling && before.nextSibling !== after) {
        detach_dev(before.nextSibling);
    }
}
function detach_before_dev(after) {
    while (after.previousSibling) {
        detach_dev(after.previousSibling);
    }
}
function detach_after_dev(before) {
    while (before.nextSibling) {
        detach_dev(before.nextSibling);
    }
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
function dataset_dev(node, property, value) {
    node.dataset[property] = value;
    dispatch_dev("SvelteDOMSetDataset", { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}
function loop_guard(timeout) {
    const start = Date.now();
    return () => {
        if (Date.now() - start > timeout) {
            throw new Error(`Infinite loop detected`);
        }
    };
}



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/svelte/store/index.mjs":
/*!*********************************************!*\
  !*** ./node_modules/svelte/store/index.mjs ***!
  \*********************************************/
/*! exports provided: get, derived, readable, writable */
/*! exports used: derived, get, writable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return derived; });
/* unused harmony export readable */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return writable; });
/* harmony import */ var _internal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal */ "./node_modules/svelte/internal/index.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _internal__WEBPACK_IMPORTED_MODULE_0__["x"]; });




const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = _internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"]) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (Object(_internal__WEBPACK_IMPORTED_MODULE_0__[/* safe_not_equal */ "H"])(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = _internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"]) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || _internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"];
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = _internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"];
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = Object(_internal__WEBPACK_IMPORTED_MODULE_0__[/* is_function */ "C"])(result) ? result : _internal__WEBPACK_IMPORTED_MODULE_0__[/* noop */ "F"];
            }
        };
        const unsubscribers = stores_array.map((store, i) => Object(_internal__WEBPACK_IMPORTED_MODULE_0__[/* subscribe */ "M"])(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            Object(_internal__WEBPACK_IMPORTED_MODULE_0__[/* run_all */ "G"])(unsubscribers);
            cleanup();
        };
    });
}




/***/ }),

/***/ "./node_modules/vue/dist/vue.runtime.esm-bundler.js":
/*!**********************************************************!*\
  !*** ./node_modules/vue/dist/vue.runtime.esm-bundler.js ***!
  \**********************************************************/
/*! exports provided: customRef, isProxy, isReactive, isReadonly, isRef, markRaw, proxyRefs, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerRef, unref, camelize, capitalize, toDisplayString, BaseTransition, Comment, Fragment, KeepAlive, Static, Suspense, Teleport, Text, callWithAsyncErrorHandling, callWithErrorHandling, cloneVNode, computed, createBlock, createCommentVNode, createHydrationRenderer, createRenderer, createSlots, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, devtools, getCurrentInstance, getTransitionRawChildren, h, handleError, inject, isVNode, mergeProps, nextTick, onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, openBlock, popScopeId, provide, pushScopeId, queuePostFlushCb, registerRuntimeCompiler, renderList, renderSlot, resolveComponent, resolveDirective, resolveDynamicComponent, resolveTransitionHooks, setBlockTracking, setDevtoolsHook, setTransitionHooks, ssrContextKey, ssrUtils, toHandlers, transformVNodeArgs, useSSRContext, useTransitionState, version, warn, watch, watchEffect, withCtx, withDirectives, withScopeId, Transition, TransitionGroup, createApp, createSSRApp, hydrate, render, useCssModule, useCssVars, vModelCheckbox, vModelDynamic, vModelRadio, vModelSelect, vModelText, vShow, withKeys, withModifiers, compile */
/*! exports used: reactive, watchEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export compile */
/* harmony import */ var _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vue/runtime-dom */ "./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__["d"]; });

/* harmony import */ var _vue_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vue/shared */ "./node_modules/@vue/shared/dist/shared.esm-bundler.js");




function initDev() {
    const target = Object(_vue_shared__WEBPACK_IMPORTED_MODULE_1__[/* getGlobalThis */ "i"])();
    target.__VUE__ = true;
    Object(_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__[/* setDevtoolsHook */ "b"])(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);
    {
        console.info(`You are running a development build of Vue.\n` +
            `Make sure to use the production build (*.prod.js) when deploying for production.`);
    }
}

// This entry exports the runtime only, and is built as
( true) && initDev();
const compile = () => {
    if ((true)) {
        Object(_vue_runtime_dom__WEBPACK_IMPORTED_MODULE_0__[/* warn */ "c"])(`Runtime compilation is not supported in this build of Vue.` +
            ( ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
                ) /* should not happen */);
    }
};




/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./util/dom/element.ts":
/*!*****************************!*\
  !*** ./util/dom/element.ts ***!
  \*****************************/
/*! exports provided: 检测元素状态, getSelectors */
/*! exports used: 检测元素状态 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return 检测元素状态; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../网页笔记/util */ "./网页笔记/util.ts");
function 检测元素状态(selector, 出现 = () => {}, 变化 = () => {}, 消失 = () => {}) {
  let status = false;
  let html = "";
  setInterval(() => {
    const el = document.querySelector(selector);

    if (status && el && el.innerHTML !== html) {
      html = el.innerHTML;
      变化(el);
    }

    if (el && !status) {
      status = true;
      出现(el);
    } else if (!el && status) {
      status = false;
      消失();
    }
  }, 100);
}


/***/ }),

/***/ "./util/dom/剪贴板.ts":
/*!*************************!*\
  !*** ./util/dom/剪贴板.ts ***!
  \*************************/
/*! exports provided: copy */
/*! exports used: copy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return copy; });
const copy = str => {
  // 第一种
  return navigator.clipboard.writeText(str);
};

/***/ }),

/***/ "./更好的我来导出/index.user.ts":
/*!*******************************!*\
  !*** ./更好的我来导出/index.user.ts ***!
  \*******************************/
/*! exports provided: 我来md导出 */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "我来md导出", function() { return 我来md导出; });
/* harmony import */ var ajax_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ajax-hook */ "./node_modules/ajax-hook/index.js");
/* harmony import */ var _util_dom_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/dom/element */ "./util/dom/element.ts");
/* harmony import */ var _util_dom___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/dom/剪贴板 */ "./util/dom/剪贴板.ts");
// ==UserScript==
// @name         更好的我来导出
// @namespace    https://shenzilong.cn/
// @version      1.0.3
// @description  从我来导出markdown 文档
// @author       崮生 admin@shenzilong.cn
// @include      https://www.wolai.com/*
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// ==/UserScript==



const _n = "\n\n"; // const _n = "\n";

var 我来md导出;

(function (我来md导出) {
  async function toMarkdown(p) {
    let mdText = "";
    const blocks = Object.keys(p.data.block).map(k => p.data.block[k]).map(el => el.value);
    console.log("[blocks]", blocks);
    const page = findPage(blocks);

    if (!page) {
      throw "没有寻找到page块";
    }

    mdText += await nodeToMarkdown(page, p);
    return mdText;
  }

  我来md导出.toMarkdown = toMarkdown;

  function findPage(p) {
    return p.find(el => el.type === "page");
  }
  /** 存储所有节点解析器 */


  const nodeParers = [];
  /** 对 子节点和父节点的关系 进行处理，因为不同父子节点的组织方式可能不一样 */

  const sub_nodeParers = [];

  function registerNodeParer(...parers) {
    nodeParers.push(...parers);
  }

  我来md导出.registerNodeParer = registerNodeParer;

  function registerSubNodeParer(...parers) {
    sub_nodeParers.push(...parers);
  }

  我来md导出.registerSubNodeParer = registerSubNodeParer;

  async function nodeToMarkdown(p, pageChunkRes) {
    const parer = nodeParers.find(el => el.check(p, pageChunkRes));

    if (parer) {
      const md_str = await parer.parer(p, pageChunkRes);

      if (p.sub_nodes.length) {
        const sub_node_parer = sub_nodeParers.find(el => el.check(p, pageChunkRes));

        if (sub_node_parer) {
          return await sub_node_parer.parer(md_str, p, pageChunkRes);
        } else {
          console.log(`[没有对应的结构解析器 ${p.type}]`, p);
        }
      }

      return md_str;
    } else {
      console.log(`[没有对应的解析器 ${p.type}]`, p);
      return `--- 没有对应的解析器 -> ${p.type} ---`;
    }
  }

  我来md导出.nodeToMarkdown = nodeToMarkdown;
  /** 对块的title属性进行解析 */

  function NodeTitleToMarkdown(p) {
    if (!p) {
      return "";
    }

    return p.map(el => {
      const text = el[0];

      if (el.length === 1) {
        return text;
      } else {
        const 修饰 = el[1];

        if (修饰.length === 0) {
          /** 无修饰啥也不做 */
        }

        let _text = text;

        for (const mode of 修饰) {
          if (mode[0] === "Link") {
            _text = `[${_text}](${mode[1]})`;
          } else if (mode[0] === "BiLink"
          /** 我来内部链接 */
          ) {
              const workspace_url = getWorkUrl();
              _text = `[${_text}](${workspace_url}${mode[2]})`;
            } else if (mode[0] === "<>"
          /** 行内代码块 */
          ) {
              _text = `\`${_text}\``;
            } else if (mode[0] === "B"
          /** 粗体 */
          ) {
              _text = `**${_text}**`;
            } else if (mode[0] === "h"
          /** 字体以及背景颜色 */
          ) {
              /** 这里在某些选项下可以选择开启转换 */
              _text = _text;
            } else if (mode[0] === "i"
          /** 斜体 */
          ) {
              _text = `*${_text}*`;
            } else if (mode[0] === "U"
          /** 下划线 */
          ) {
              /** 这里在某些选项下可以选择开启转换 */
              _text = `${_text}`;
            } else if (mode[0] === "S"
          /** 删除线 */
          ) {
              _text = `~~${_text}~~`;
            } else if (mode[0] === "Equation"
          /** 公式 */
          ) {
              _text = `$${_text}$`;
            } else {
            /** 这里mode的类型应当始终为 never */
            mode;
            _text = `<未知类型 ${mode[0]}>`;
            console.log(`<未知类型 ${mode[0]}>`, mode, 修饰, el);
          }
        }

        return _text;
      }
    }).join("");
  }

  我来md导出.NodeTitleToMarkdown = NodeTitleToMarkdown;
  /** 当前打开页面的工作空间链接 */

  function getWorkUrl() {
    return location.href.match(/.*?wolai\.com\/.*?\//)[0];
  }

  我来md导出.getWorkUrl = getWorkUrl;
})(我来md导出 || (我来md导出 = {}));

const NodeTitleToMarkdown = 我来md导出.NodeTitleToMarkdown;
我来md导出.registerNodeParer({
  check: p => p.type === "quote",

  async parer(p) {
    return `> ${NodeTitleToMarkdown(p.attributes.title)}`;
  }

},
/** 对各级标题进行处理
 *  对bullList节点进行处理 */
(() => {
  const header = {
    bullList: "-",
    header: "#",
    midHeader: "##",
    subHeader: "###",
    tinyHeader: "####"
  };
  return {
    check: p => header.hasOwnProperty(p.type),

    async parer(p) {
      const t = header[p.type];
      return `${t} ${NodeTitleToMarkdown(p.attributes.title)}`;
    }

  };
})(),
/** 数字列表的解析 */
{
  check: p => p.type === "enumList",

  async parer(p, pageChunkRes) {
    let l = 0;
    const brothers = sub_nodeToNode(pageChunkRes.data.block[p.parent_id].value, pageChunkRes);
    let i = brothers.findIndex(el => el.id === p.id);

    while (i >= 0 && brothers[i].type === "enumList") {
      i -= 1;
      l += 1;
    } // const l = pageChunkRes.data.block[p.parent_id].value.sub_nodes.findIndex((id) => id === p.id) + 1;


    return `${l}. ${NodeTitleToMarkdown(p.attributes.title)}`;
  }

},
/** 折叠列表的解析 */
{
  check: p => p.type === "toggleList",

  async parer(p, pageChunkRes) {
    return NodeTitleToMarkdown(p.attributes.title);
  }

},
/** 对书签的解析， **这里到时候应该要调成可控的** */
{
  check: p => p.type === "bookmark",

  async parer(p) {
    var _rich$thumbnail;

    const rich = p.attributes.rich_media[0];
    const description = rich.description || "";
    const thumbnail =
    /** 和我来一样有描述信息才显示缩略图 */
    description && (rich === null || rich === void 0 ? void 0 : (_rich$thumbnail = rich.thumbnail) === null || _rich$thumbnail === void 0 ? void 0 : _rich$thumbnail.length) ? `![](${rich.thumbnail[0].href}){:height="60px" width="60px"}` : "";
    return `> [![](${rich.icons[0].href}){:height="30px" width="30px"} 崮生 一些随笔](${p.attributes.source} "${description}") ${description} ${thumbnail}`;
  }

},
/** 对嵌入内容的解析， **这里到时候应该要调成可控的** */
{
  check: p => ["embed", "bilibiliVideo", "tencentVideo", "youkuVideo", "youtubeVideo"].includes(p.type),

  async parer(p) {
    return `<iframe src="${p.attributes.embedLink}"></iframe>`;
  }

},
/** 对着重文字的解析 */
{
  check: p => ["callout"].includes(p.type),

  async parer(p) {
    return `<em>${我来md导出.NodeTitleToMarkdown(p.attributes.title)}</em>`;
  }

},
/** 分割线 */
{
  check: p => ["divider"].includes(p.type),

  async parer(p) {
    return `---`;
  }

},
/** 文件 */
{
  check: p => ["file"].includes(p.type),

  async parer(p) {
    /** TODO 这里需要获取签名才能访问 */
    const src = `https://secure-static.wolai.com/${encodeURIComponent(p.attributes.file[0])}`;
    return `[file:${p.attributes.alias[0]}](${src}})`;
  }

},
/** 公式 */
{
  check: p => ["blockEquation"].includes(p.type),

  async parer(p) {
    return `$$\n${p.attributes.title.join("\n")}\n$$`;
  }

},
/** 模板按钮 */
{
  check: p => ["templateButton"].includes(p.type),

  async parer(p) {
    /** TODO 暂不解析模板按钮 */
    return ``;
  }

},
/** 表格解析器 */
{
  check: p => ["simpleTable"].includes(p.type),

  async parer(p) {
    /** TODO 暂不解析模板按钮 */
    const cells = JSON.parse(p.attributes.cells);
    let md_str = "";
    /** 遍历行 */

    for (let i = 0; i < cells[0].column.length; i++) {
      if (i === 1) {
        /** 标题栏的分隔 */
        md_str += "|" + cells.map(el => "-").join("|") + "|\n";
      }

      md_str += "|";
      /** 遍历列 */

      for (let j = 0; j < cells.length; j++) {
        /** 当前遍历到的元素 */
        const cur = cells[j].column[i];
        md_str += 我来md导出.NodeTitleToMarkdown(cur.attributes.title) + "|";
      }

      md_str += "\n";
    }

    return md_str;
  }

}, {
  check: p => p.type === "text",

  async parer(p) {
    return `${NodeTitleToMarkdown(p.attributes.title)}`;
  }

}, {
  check: p => p.type === "row" || p.type === "column",

  async parer(p, pageChunkRes) {
    const sub_nodes = p.sub_nodes.map(id => pageChunkRes.data.block[id]);
    let mdText = ``;

    for (const el of sub_nodes) {
      mdText += (await 我来md导出.nodeToMarkdown(el.value, pageChunkRes)) + _n;
    }

    return mdText;
  }

}, {
  check: p => p.type === "code",

  async parer(p, pageChunkRes) {
    return `\`\`\`${p.attributes.language}\n${NodeTitleToMarkdown(p.attributes.title)}\n\`\`\``;
  }

}, {
  check: p => p.type === "image",

  async parer(p, pageChunkRes) {
    /** 此处需要在浏览器内才能正常运行 */
    const src = document.querySelector(`#id-${p.id} img`).getAttribute("src");
    return `![${NodeTitleToMarkdown(p.attributes.title)}](${src})`; // TODO 描述应该要去获取到
  }

}, {
  check: p => p.type === "page",

  async parer(p, pageChunkRes) {
    const workspace_url = 我来md导出.getWorkUrl();

    if (p.id === Object.keys(pageChunkRes.data.block)[0]) {
      /** 顶层块 也就是当前页面块 */
      return `# [${NodeTitleToMarkdown(p.attributes.title)}](${workspace_url}${p.id})`;
    } else {
      /** 页面内引用其他页面的块 */
      return `[${NodeTitleToMarkdown(p.attributes.title)}](${workspace_url}${p.id})`;
    }
  }

}, {
  check: p => p.type === "todoList",

  async parer(p, pageChunkRes) {
    return `[${p.attributes.checked === "yes" ? "x" : " "}] ${NodeTitleToMarkdown(p.attributes.title)}`;
  }

});

function sub_nodeToNode(p, pageChunkRes) {
  return p.sub_nodes.map(id => pageChunkRes.data.block[id].value);
}

我来md导出.registerSubNodeParer(
/** 对页面下面的一级节点进行处理 */
{
  check: p => p.type === "page",

  async parer(md_str, p, pageChunkRes) {
    return md_str + "\n\n" + (await Promise.all(sub_nodeToNode(p, pageChunkRes).map(p => 我来md导出.nodeToMarkdown(p, pageChunkRes)))).join("\n\n");
  }

},
/** 对列表类的层级进行处理 */
{
  check: p => ["bullList", "enumList", "todoList"].includes(p.type),

  async parer(md_str, p, pageChunkRes) {
    /** 获取一个节点有多少父级 */
    function getNodeNumberOfLayers(p, pageChunkRes) {
      let l = 0;
      let cur = p;

      while ((_cur = cur) === null || _cur === void 0 ? void 0 : _cur.parent_id) {
        var _cur, _pageChunkRes$data$bl, _cur2;

        l++;
        cur = (_pageChunkRes$data$bl = pageChunkRes.data.block[cur.parent_id]) === null || _pageChunkRes$data$bl === void 0 ? void 0 : _pageChunkRes$data$bl.value;

        if (((_cur2 = cur) === null || _cur2 === void 0 ? void 0 : _cur2.type) === "toggleList") {
          /** 不是相同的结构了，层级关系算到这里位置，更外层的层级关系交给该结构自行处理 */
          l++;
          /** 因为上面算了页面，这里将 toggleList 当做和页面一样看待 */

          break;
        }
      }
      /** 不算页面这一级 */


      return l - 1;
    }

    const l = getNodeNumberOfLayers(p, pageChunkRes) - 1; // console.log(l,p,md_str);

    const md_str_List = (await Promise.all(sub_nodeToNode(p, pageChunkRes).map(p => 我来md导出.nodeToMarkdown(p, pageChunkRes)))).map(md_str => `${"".padEnd(
    /** 列表内的是当前节点的子节点而l是当前节点的层级，所以这里要+1 */
    l + 1, "\t")}${md_str}`);
    return `${md_str}${md_str_List.length ? "\n" + md_str_List.join("\n") : ""}`;
  }

},
/** 对折叠列表类的层级进行处理 */
{
  check: p => ["toggleList"].includes(p.type),

  async parer(md_str, p, pageChunkRes) {
    const md_str_List = await Promise.all(sub_nodeToNode(p, pageChunkRes).map(p => 我来md导出.nodeToMarkdown(p, pageChunkRes)));
    return `<details>
      <summary>${md_str}</summary>
${md_str_List.join(_n)}
  </details>`;
  }

});
let curData = null;
Object(ajax_hook__WEBPACK_IMPORTED_MODULE_0__[/* proxy */ "a"])({
  //请求发起前进入
  onRequest: (config, handler) => {
    // console.log("[💚开始请求]", config.url);
    // config.url = urlHandler(config.url);

    /** 关闭 withCredentials 避免触发跨域 */
    // config.withCredentials = false;
    handler.next(config);
  },
  //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  onError: (err, handler) => {
    handler.next(err);
  },
  //请求成功后进入
  onResponse: (response, handler) => {
    handler.next(response);

    if (response.config.url.endsWith("transaction/getPageChunks")) {
      curData = response.response;
    }
  }
});
Object(_util_dom_element__WEBPACK_IMPORTED_MODULE_1__[/* 检测元素状态 */ "a"])('div.oqjLp:nth-child(3) > div:nth-child(1)', el => {
  console.log("[  el]", el);
  const btn = el.nextElementSibling;
  const newBtn = btn.cloneNode(true);
  btn.parentElement.appendChild(newBtn);
  newBtn.querySelectorAll("span")[1].textContent = `[✨] 导出Markdown`;
  newBtn.addEventListener("click", async () => {
    if (curData === null) {
      return alert("没有获取到当前页面数据，您可以尝试刷新重试。");
    }

    const res = JSON.parse(curData);
    const md = await 我来md导出.toMarkdown(res);
    const blob = new Blob([md], {
      type: "text/plain;charset=utf-8"
    });
    const downloadUrl = URL.createObjectURL(blob);
    console.log(`[markdown:${downloadUrl}]\n----\n`, md);
    console.log("[copy(md)]", Object(_util_dom___WEBPACK_IMPORTED_MODULE_2__[/* copy */ "a"])(md));
    alert("复制成功");
  });
});
/** 替换 windows 上的 xml 对象 */
//@ts-ignore

unsafeWindow.XMLHttpRequest = XMLHttpRequest;

/***/ }),

/***/ "./网页笔记/config.ts":
/*!************************!*\
  !*** ./网页笔记/config.ts ***!
  \************************/
/*! exports provided: isDev, config, elementEdit, AllStoreName, default */
/*! exports used: AllStoreName, default, elementEdit, isDev */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isDev; });
/* unused harmony export config */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return elementEdit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AllStoreName; });
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store/index.mjs");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
/* harmony import */ var _ui_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/message */ "./网页笔记/ui/message.ts");



/** 是不是开发环境 */

const isDev = window.__llej__userjs__dev__ === true;
const config = Object(vue__WEBPACK_IMPORTED_MODULE_1__[/* reactive */ "a"])({
  state: 0,

  /** 是否开启编辑 */
  elementEdit: isDev,

  /** 服务器地址 */
  serverIp: "https://shenzilong.cn/note/",

  /** 页面的url */
  locationUrl: decodeURIComponent(location.origin + location.pathname),

  /** 存储登录凭证的 */
  loginCredentials: "loginCredentials"
});
const elementEdit = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* writable */ "c"])(config.elementEdit, set => {
  Object(vue__WEBPACK_IMPORTED_MODULE_1__[/* watchEffect */ "b"])(() => {
    set(config.elementEdit);
  });
});
elementEdit.subscribe(value => {
  config.elementEdit = value;
  console.log('[value]', value);
});
Object(vue__WEBPACK_IMPORTED_MODULE_1__[/* watchEffect */ "b"])(() => {
  console.log('[config.elementEdit]', config.elementEdit);
  new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
    msg: `${config.elementEdit ? "开启" : "关闭"}编辑模式`
  }).autoHide();
});
/** 存储命令栈的地方 */

const AllStoreName = "_storeName_llej_" + config.locationUrl;
/* harmony default export */ __webpack_exports__["b"] = (config);

/***/ }),

/***/ "./网页笔记/fun/ajax.ts":
/*!**************************!*\
  !*** ./网页笔记/fun/ajax.ts ***!
  \**************************/
/*! exports provided: au_getJSON, _login, remote_register, remote_getStore, remote_setStore, remote_getAllStore */
/*! exports used: _login, remote_getStore, remote_register, remote_setStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export au_getJSON */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return remote_register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return remote_getStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return remote_setStore; });
/* unused harmony export remote_getAllStore */
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./网页笔记/config.ts");
/* harmony import */ var _lib_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/store */ "./网页笔记/lib/store.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./网页笔记/util.ts");



/** 用来识别身份的key */

let key = '';
/** 附带登录信息的ajax */

async function au_getJSON(url, data) {
  if (data === undefined) data = {};
  data.key = key ? key : await Object(_lib_store__WEBPACK_IMPORTED_MODULE_1__[/* getLocalItem */ "b"])(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].loginCredentials);
  return Object(_util__WEBPACK_IMPORTED_MODULE_2__[/* getJSon */ "c"])(url, data);
}
/** 登录 */

async function _login(par) {
  const res = await Object(_util__WEBPACK_IMPORTED_MODULE_2__[/* getJSon */ "c"])(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].serverIp + 'login', par);
  if (res.body && res.body.length > 0) key = res.body;
  Object(_lib_store__WEBPACK_IMPORTED_MODULE_1__[/* setLocalItem */ "c"])(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].loginCredentials, key);
  return res;
}
/** 注册 */

async function remote_register(par) {
  return await Object(_util__WEBPACK_IMPORTED_MODULE_2__[/* getJSon */ "c"])(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].serverIp + 'register', par);
}
/** 获取存储库 */

async function remote_getStore(par) {
  return await au_getJSON(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].serverIp + 'getStore', par);
}
/** 设置存储库 */

async function remote_setStore(par) {
  return await au_getJSON(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].serverIp + 'setStore', par);
}
/** 获取存储库 */

async function remote_getAllStore() {
  return await au_getJSON(_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].serverIp + 'getAllStore');
}

/***/ }),

/***/ "./网页笔记/fun/command.ts":
/*!*****************************!*\
  !*** ./网页笔记/fun/command.ts ***!
  \*****************************/
/*! exports provided: Command, deleteSelect, editSelect, closeEditSelect, addNote, Highlighted, CommandControl */
/*! exports used: CommandControl, Highlighted, addNote, closeEditSelect, deleteSelect, editSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Command */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return deleteSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return editSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return closeEditSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return addNote; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Highlighted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommandControl; });
/* harmony import */ var _ui_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ui/message */ "./网页笔记/ui/message.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./网页笔记/util.ts");
/* harmony import */ var _state_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state/store */ "./网页笔记/state/store.ts");
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store/index.mjs");
/* harmony import */ var _state_highlighted_style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state/highlighted_style */ "./网页笔记/state/highlighted_style.ts");
/* harmony import */ var _lib_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/store */ "./网页笔记/lib/store.ts");






/** 每一个命令都应该实现的东西 */

class Command {
  constructor(
  /** 命令执行的元素 */
  select) {
    this.selectEL = select;
  }
  /** 执行这个命令 */


  do() {
    return this;
  }
  /** 撤销这个命令 */


  undo() {
    return this;
  }
  /** 重新执行命令 */


  redo() {
    return this.do();
  }
  /** 将命令变成可以转化为json字符串的对象 */


  toJSON() {
    return {
      selectEL: Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* getSelectors */ "d"])(this.selectEL),
      constructor: this.__proto__.constructor.name
    };
  }
  /** 用于可以使用 toJSON 生成的数据重建功能效果 */


  static 重建(obj) {
    return new this(document.querySelector(obj.selectEL));
  }
  /** 加载commandJSON转变为命令,通过泛型来构造对象的方式 */


  static load(obj, CLASS) {
    return CLASS.重建(obj);
  }

}
/** 删除一个元素 */

class deleteSelect extends Command {
  do() {
    this.selectEL_display = this.selectEL.style.display;
    this.selectEL.style.display = "none";
    return this;
  }

  undo() {
    this.selectEL.style.display = this.selectEL_display;
    return this;
  }

}
/** 使元素可编辑 */

class editSelect extends Command {
  do() {
    this.selectEL_contentEditable = this.selectEL.contentEditable;
    this.selectEL.contentEditable = "true";
    return this;
  }

  undo() {
    this.selectEL.contentEditable = this.selectEL_contentEditable;
    return this;
  }

}
/** 使元素不可编辑 */

class closeEditSelect extends Command {
  do() {
    this.selectEL_contentEditable = this.selectEL.contentEditable;
    this.selectEL.contentEditable = "false";
    return this;
  }

  undo() {
    this.selectEL.contentEditable = this.selectEL_contentEditable;
    return this;
  }

}
/** 新增一个笔记 */

class addNote extends Command {
  do() {
    this.selectEL;
    _state_store__WEBPACK_IMPORTED_MODULE_2__[/* note_list_store */ "a"].update(list => {
      list.push({
        point: this.selectEL,
        content: "6666666"
      });
      return list;
    });
    return this;
  }

  undo() {
    return this;
  }

  redo() {
    return this;
  }

}
/** 高亮功能 */

class Highlighted extends Command {
  constructor(styleText) {
    super();
    this.styleText = styleText;
    /** css 类名 */

    this.className = `llej-page_notes-style-${_lib_store__WEBPACK_IMPORTED_MODULE_5__[/* curStore */ "a"].Highlighted_count++}`;
  }

  do() {
    _state_highlighted_style__WEBPACK_IMPORTED_MODULE_4__[/* styleList */ "a"].update(r => {
      return [...r, this.getRawStyleText()];
    });
    return this;
  }

  getRawStyleText() {
    return `
    .${this.className}{
      ${this.styleText}
    }
    `;
  }

  undo() {
    _state_highlighted_style__WEBPACK_IMPORTED_MODULE_4__[/* styleList */ "a"].update(r => {
      return r.filter(el => el !== this.getRawStyleText());
    });
    return this;
  }

  static 重建(obj) {
    const r = new this(obj.styleText);
    r.className = obj.className;
    return r;
  }

  toJSON() {
    return {
      selectEL: "",
      className: this.className,
      styleText: this.styleText,
      constructor: this.__proto__.constructor.name
    };
  }

}
/** 命令控制器 */

const CommandControl = {
  commandStack: [],
  backOutStack: [],

  pushCommand(command) {
    return this.commandStack.push(command);
  },

  run(command) {
    try {
      this.backOutStack.splice(0, this.backOutStack.length);
      return this.pushCommand(command.do());
    } catch (error) {
      console.error("命令执行失败", command);
    }

    return -1;
  },

  backOut() {
    if (this.commandStack.length === 0) {
      _ui_message__WEBPACK_IMPORTED_MODULE_0__[/* Message */ "a"].getMessage({
        msg: "命令栈已空，无法进行撤销"
      }).autoHide();
      return;
    }

    const command = this.commandStack.pop();
    return this.backOutStack.push(command.undo());
  },

  reform() {
    if (this.backOutStack.length === 0) {
      _ui_message__WEBPACK_IMPORTED_MODULE_0__[/* Message */ "a"].getMessage({
        msg: "撤销栈已空，无法进行重做"
      }).autoHide();
      return;
    }

    const command = this.backOutStack.pop();
    return this.commandStack.push(command.redo());
  },

  /** 从json重建命令栈 */
  loadCommandJSON(obj) {
    Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* log */ "e"])("-执行命令-", obj.constructor);
    if (obj.constructor === "deleteSelect") return Command.load(obj, deleteSelect);
    if (obj.constructor === "editSelect") return Command.load(obj, editSelect);
    if (obj.constructor === "closeEditSelect") return Command.load(obj, closeEditSelect);
    if (obj.constructor === "addNote") return Command.load(obj, addNote);
    if (obj.constructor === "Highlighted") return Command.load(obj, Highlighted);
  },

  getCommandStackJSON() {
    return JSON.stringify(this.commandStack);
  },

  loadCommandJsonAndRun(commandJSON) {
    commandJSON.map(this.loadCommandJSON).forEach(command => this.run(command));
    return true;
  }

};

/***/ }),

/***/ "./网页笔记/fun/fun.ts":
/*!*************************!*\
  !*** ./网页笔记/fun/fun.ts ***!
  \*************************/
/*! exports provided: fun, KeyMap, saveChanges, loadChanges, outline, on_mouse, on_keydown, on_input, switchState */
/*! exports used: loadChanges, on_input, on_keydown, on_mouse, saveChanges */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export fun */
/* unused harmony export KeyMap */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return saveChanges; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return loadChanges; });
/* unused harmony export outline */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return on_mouse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return on_keydown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return on_input; });
/* unused harmony export switchState */
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./网页笔记/config.ts");
/* harmony import */ var _lib_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/store */ "./网页笔记/lib/store.ts");
/* harmony import */ var _ui_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/message */ "./网页笔记/ui/message.ts");
/* harmony import */ var _ajax__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ajax */ "./网页笔记/fun/ajax.ts");
/* harmony import */ var _command__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./command */ "./网页笔记/fun/command.ts");
/* harmony import */ var _state_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state/index */ "./网页笔记/state/index.ts");
/* harmony import */ var _ui_warning__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/warning */ "./网页笔记/ui/warning.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../util */ "./网页笔记/util.ts");








/** ════════════════════════🏳‍🌈 提供给用户使用的功能 🏳‍🌈════════════════════════
 *
 ** ════════════════════════🚧 提供给用户使用的功能 🚧════════════════════════ */

const fun = {
  /** 使元素可编辑 */
  editElement() {
    if (_state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"].innerHTML.length > 10 * 1000) return new _ui_warning__WEBPACK_IMPORTED_MODULE_6__[/* Warning */ "a"]({
      msg: "该元素内容过大，请选择更确定的文本元素。"
    }).autoHide();
    _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].run(new _command__WEBPACK_IMPORTED_MODULE_4__[/* editSelect */ "f"](_state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"]));
  },

  /** 删除元素 */
  deleteElement() {
    _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].run(new _command__WEBPACK_IMPORTED_MODULE_4__[/* deleteSelect */ "e"](_state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"]));
  },

  /** 复制title */
  copyTitle() {
    _util__WEBPACK_IMPORTED_MODULE_7__[/* default */ "b"].copyTitle(_state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"]);
  },

  /** 关闭可编辑 */
  closeEdit() {
    _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].run(new _command__WEBPACK_IMPORTED_MODULE_4__[/* closeEditSelect */ "d"](_state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"]));
  },

  /** 撤销 */
  backOut() {
    _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].backOut();
  },

  /** 重做 */
  undo() {
    _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].reform();
  },

  /** 新增笔记 */
  addNote() {
    _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].run(new _command__WEBPACK_IMPORTED_MODULE_4__[/* addNote */ "c"](_state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"]));
  },

  /** 保存所有的修改 */
  saveChanges() {
    saveChanges(_state_index__WEBPACK_IMPORTED_MODULE_5__[/* editElement */ "b"]);
    new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
      msg: "保存成功"
    }).autoHide();
  },

  /** 将修改上传到云端 */
  async uploadThe() {
    Object(_ajax__WEBPACK_IMPORTED_MODULE_3__[/* remote_setStore */ "d"])({
      url: _config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].locationUrl,
      store: await saveChanges(_state_index__WEBPACK_IMPORTED_MODULE_5__[/* editElement */ "b"])
    }).then(r => {
      new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
        msg: "云端存储:" + r.message
      }).autoHide();
    });
  },

  /** 从云端下载修改 */
  downloadThe() {
    new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
      msg: "正在读取云端存储"
    }).autoHide();
    Object(_ajax__WEBPACK_IMPORTED_MODULE_3__[/* remote_getStore */ "b"])({
      url: _config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].locationUrl
    }).then(r => {
      if (r.body === undefined || r.body.length === 0) return new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
        msg: "云端存储:" + r.message
      }).autoHide();
      const allStore = JSON.parse(r.body[0].store);
      loadChanges(allStore);
      new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
        msg: "云端存储:" + r.message
      }).autoHide();
    });
  },

  /** 注册 */
  register() {
    register();
  },

  /** 登录 */
  login() {
    login();
  }

};
/** 按键和函数的映射关系 */

const KeyMap = {
  KeyQ: [fun.editElement],
  KeyD: [fun.deleteElement],
  KeyC: [fun.copyTitle],
  KeyW: [fun.closeEdit],
  KeyZ: [fun.backOut],
  KeyY: [fun.undo],
  KeyN: [fun.addNote],
  KeyS: [fun.saveChanges],
  KeyO: [fun.uploadThe],
  KeyP: [fun.downloadThe, fun.saveChanges],
  KeyK: [fun.register],
  KeyL: [fun.login],
  F2: [],
  KeyM: []
};
/** 编辑模式下才能运行 */

function editRun(list) {
  return list.map(f => async () => {
    if (_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].elementEdit === false) {
      Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* log */ "e"])("没有开启编辑功能");
    } else {
      return await f();
    }
  });
}
/** 保存修改 */


async function saveChanges(editElement) {
  const data = {
    element_List: {},
    CommandStack: _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].commandStack
  };
  /** 获取修改过的元素的html */

  editElement.forEach(el => {
    const selectors = Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* getSelectors */ "d"])(el);
    data.element_List[selectors] = el.innerHTML;
  });
  const data_str = JSON.stringify(Object.assign(_lib_store__WEBPACK_IMPORTED_MODULE_1__[/* curStore */ "a"], data));
  await Object(_lib_store__WEBPACK_IMPORTED_MODULE_1__[/* setLocalItem */ "c"])(_config__WEBPACK_IMPORTED_MODULE_0__[/* AllStoreName */ "a"], JSON.stringify(data));
  return data_str;
}
/** 加载修改 */

async function loadChanges(allStore) {
  /** 将修改过的 html 写回去 */
  for (const selectors in allStore.element_List) {
    const html = allStore.element_List[selectors];
    const el = document.querySelector(selectors);

    if (el === null) {
      console.error(`${selectors} 的元素无法找到，无法重写`);
    } else {
      _state_index__WEBPACK_IMPORTED_MODULE_5__[/* editElement */ "b"].add(el);
      el.innerHTML = html;
      Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* log */ "e"])("-重写-", el);
    }
  }
  /** 重新执行命令栈 */


  _command__WEBPACK_IMPORTED_MODULE_4__[/* CommandControl */ "a"].loadCommandJsonAndRun(allStore.CommandStack);
}

function login() {
  const title = ">>>网页笔记<<<\n";
  const user = prompt(title + "请输入用户名");
  if (user === null) return;
  const secret_key = prompt(title + "请输入密钥。");
  if (secret_key === null) return;

  Object(_ajax__WEBPACK_IMPORTED_MODULE_3__[/* _login */ "a"])({
    user,
    secret_key
  }).then(r => {
    new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
      msg: r.message
    }).autoHide();
  });
}

function register() {
  const title = ">>>网页笔记<<<\n";
  const user = prompt(title + "请输入用户名");
  if (user === null) return;
  const secret_key = prompt(title + "请输入密钥。要记住哦，没有提供找回功能");
  if (secret_key === null) return;
  Object(_ajax__WEBPACK_IMPORTED_MODULE_3__[/* remote_register */ "c"])({
    user,
    secret_key
  }).then(r => {
    new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
      msg: r.message
    }).autoHide();
  });
}
/** 轮廓线,用以显示当前元素 */


function outline(el) {
  el.classList.add("user_js_llej_outline");
  setTimeout(reduction, 400);

  function reduction() {
    if (el == _state_index__WEBPACK_IMPORTED_MODULE_5__[/* currentElement */ "a"]) {
      outline(el);
      /** 鼠标还在这个元素上，再等会 */

      return;
    }

    el.classList.remove("user_js_llej_outline");
  }
}
/** 监听鼠标移动 */

function on_mouse(event) {
  if (event.target instanceof HTMLElement) {
    Object(_state_index__WEBPACK_IMPORTED_MODULE_5__[/* setPath */ "c"])(Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* nodePath */ "f"])(event.target));

    if (_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].elementEdit) {
      outline(event.target);
    }
  }
}
/** 监测按键事件 */

async function on_keydown(event) {
  const code = event.code;

  if (code in KeyMap) {
    if (isEditing()) {
      return new _ui_message__WEBPACK_IMPORTED_MODULE_2__[/* Message */ "a"]({
        msg: "有元素获得焦点，视为正在输入文本，不执行指令"
      }).autoHide();
    } else {
      if (code === "F2" || code === "KeyM") {
        /** 切换编辑模式 */
        return switchState();
      } else if (_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].elementEdit === false) {
        Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* log */ "e"])("没有开启编辑功能");
      } else {
        /** 执行按键绑定的函数 */
        const func_list = KeyMap[code];
        Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* log */ "e"])(`[按下了] ${code},执行了: ${func_list.map(f => f.name).join(" ")}`);

        for await (const f of func_list) {
          await f();
        }
      }
    }
  } else {
    Object(_util__WEBPACK_IMPORTED_MODULE_7__[/* log */ "e"])("未注册该按键处理程序 " + code);
  }

  function isEditing() {
    return document.querySelector(":focus") ||
    /** 如果目标元素是自定义组件的话上面这个还检测不了，需要检测 shadow 中是否存在焦点 */
    //@ts-expect-error
    event.target.shadowRoot && event.target.shadowRoot.querySelector(":focus");
  }
}
/** 编辑事件 */

function on_input(event) {
  if (event.target instanceof HTMLElement) {
    const el = event.target;
    if (el.innerHTML.length > 10 * 1000) new _ui_warning__WEBPACK_IMPORTED_MODULE_6__[/* Warning */ "a"]({
      msg: "该元素html内容过大，将不会保存这里的修改，请选择更确定的文本元素。"
    }).autoHide();else _state_index__WEBPACK_IMPORTED_MODULE_5__[/* editElement */ "b"].add(el);
  }
}
/** 切换状态 */

function switchState() {
  return _config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].elementEdit = !_config__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].elementEdit;
}

/***/ }),

/***/ "./网页笔记/lib/store.ts":
/*!***************************!*\
  !*** ./网页笔记/lib/store.ts ***!
  \***************************/
/*! exports provided: setLocalItem, getLocalItem, curStore */
/*! exports used: curStore, getLocalItem, setLocalItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setLocalItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getLocalItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return curStore; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm-bundler.js");
/* harmony import */ var _fun_fun__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fun/fun */ "./网页笔记/fun/fun.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./网页笔记/config.ts");



/** 设置一条本地存储 */

async function setLocalItem(name, value) {
  //为了在非油猴环境下存储依旧能起一部分的作用
  if (typeof unsafeWindow !== "undefined") {
    return await GM.setValue(name, value);
  } else {
    return await localStorage.setItem(name, String(value));
  }
}
/** 读取一条本地存储 */

async function getLocalItem(
/** 键名 */
name,
/** 没有的时候的默认值 */
defaultValue) {
  if (typeof unsafeWindow !== "undefined") {
    const res = await GM.getValue(name, defaultValue);
    return res;
  } else {
    //为了在非油猴环境下存储依旧能起一部分的作用
    const value = localStorage.getItem(name);
    if (value === null) return await defaultValue;
    return await value;
  }
}
const curStore = Object(vue__WEBPACK_IMPORTED_MODULE_0__[/* reactive */ "a"])({
  CommandStack: [],
  element_List: {},

  /** 用于记录高亮 id 避免新高亮出现重复 */
  Highlighted_count: 0
});
getLocalItem(_config__WEBPACK_IMPORTED_MODULE_2__[/* AllStoreName */ "a"], "{}").then(s => {
  Object.assign(curStore, JSON.parse(s));
  /** 自动加载本地暂存更改 */

  (async () => {
    console.log(curStore);

    if (document.readyState === "complete") {
      Object(_fun_fun__WEBPACK_IMPORTED_MODULE_1__[/* loadChanges */ "a"])(curStore);
    } else {
      window.addEventListener("load", function () {
        Object(_fun_fun__WEBPACK_IMPORTED_MODULE_1__[/* loadChanges */ "a"])(curStore);
      });
    }
  })();
});

/***/ }),

/***/ "./网页笔记/state/highlighted_style.ts":
/*!*****************************************!*\
  !*** ./网页笔记/state/highlighted_style.ts ***!
  \*****************************************/
/*! exports provided: styleList, styleText */
/*! exports used: styleList, styleText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return styleList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return styleText; });
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store/index.mjs");

const styleList = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* writable */ "c"])([]);
/** 根据 styleList 计算出来的 css 片段 */

const styleText = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* derived */ "a"])(styleList, $styleList => {
  return `<style>
  ${Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* get */ "b"])(styleList).join("\n")}
  </style>`;
});

/***/ }),

/***/ "./网页笔记/state/index.ts":
/*!*****************************!*\
  !*** ./网页笔记/state/index.ts ***!
  \*****************************/
/*! exports provided: currentElement, path, setPath, editElement */
/*! exports used: currentElement, editElement, setPath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return currentElement; });
/* unused harmony export path */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return editElement; });
/* harmony import */ var _remote_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./remote.state */ "./网页笔记/state/remote.state.ts");
/** 当前被选中的元素 */

let currentElement;
let path;
/** 修改当前指向的元素和路径 */

function setPath(elList) {
  path = elList;
  currentElement = elList[0];
}
/** 标记被修改后的元素(被污染了的元素)，以便保存修改的内容 */

const editElement = new Set(); // const globalSettingRef = fireStore.doc("setting/global");
// globalSettingRef.onSnapshot({
//   next(r) {
//     console.log("[    r]", r.data());
//   },
// });
// globalSettingRef.update({
//   test: 3,
// });
// globalSettingRef
//   //   .doc("samples/sandwichData")
//   .get()
//   .then((r) => {});

/***/ }),

/***/ "./网页笔记/state/remote.state.ts":
/*!************************************!*\
  !*** ./网页笔记/state/remote.state.ts ***!
  \************************************/
/*! exports provided: fireStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export fireStore */
// // Firebase App (the core Firebase SDK) is always required and
// // must be listed before other Firebase SDKs
// import * as firebase from "firebase/app";
// // Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";
// firebase.initializeApp({
//   apiKey: "AIzaSyCXy6_GwVogqPwZyJj-KPXIb-JfQaW-MTY",
//   authDomain: "llej-2e851.firebaseapp.com",
//   databaseURL: "https://llej-2e851.firebaseio.com",
//   projectId: "llej-2e851",
//   storageBucket: "llej-2e851.appspot.com",
//   messagingSenderId: "419799122852",
//   appId: "1:419799122852:web:36ddb23180314a8b987731",
//   measurementId: "G-SN42ESZX78",
// });
const fireStore = {}; // /** 监听用户状态改变 */
// // firebase.auth().onAuthStateChanged(function (user) {
// //   if (user) {
// //     console.log("[登录成功]", user.email);
// //   }
// // });
// // firebase
// //   .auth()
// //   .signInWithEmailAndPassword("admin@shenzilong.cn", "987456321")
// //   .catch(function (error) {
// //     // Handle Errors here.
// //     var errorCode = error.code;
// //     var errorMessage = error.message;
// //     // ...
// //   });

/***/ }),

/***/ "./网页笔记/state/store.ts":
/*!*****************************!*\
  !*** ./网页笔记/state/store.ts ***!
  \*****************************/
/*! exports provided: note_list_store, settingStore */
/*! exports used: note_list_store, settingStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return note_list_store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return settingStore; });
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store/index.mjs");
/* harmony import */ var _lib_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/store */ "./网页笔记/lib/store.ts");


/** 用来显示笔记的地方 */

const note_list_store = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* writable */ "c"])([]);
const defaultSetting = {
  a: 3,
  swatches: {
    textColor: {
      default: "#333",
      list: ["#EB5757", "#F2C94C", "#9B51E0", "#E0E0E0", "#2F80ED", "#2F80ED", "#828282", "#27AE60", "#27AE60", "#EB5757", "#56CCF2", "#F2994A", "#4F4F4F", "#219653", "#BB6BD9", "#F2F2F2", "#2D9CDB", "#2D9CDB", "#BDBDBD", "#6FCF97", "#6FCF97"]
    },
    bgColor: {
      default: "#EB5757",
      list: ["#EB5757", "#F2C94C", "#9B51E0", "#E0E0E0", "#2F80ED", "#2F80ED", "#828282", "#27AE60", "#27AE60", "#EB5757", "#56CCF2", "#F2994A", "#4F4F4F", "#219653", "#BB6BD9", "#F2F2F2", "#2D9CDB", "#2D9CDB", "#BDBDBD", "#6FCF97", "#6FCF97"]
    },
    underlineColor: {
      default: "#EB5757",
      list: ["#EB5757", "#F2C94C", "#9B51E0", "#E0E0E0", "#2F80ED", "#2F80ED", "#828282", "#27AE60", "#27AE60", "#EB5757", "#56CCF2", "#F2994A", "#4F4F4F", "#219653", "#BB6BD9", "#F2F2F2", "#2D9CDB", "#2D9CDB", "#BDBDBD", "#6FCF97", "#6FCF97"]
    }
  }
};

class PageNotesStore {
  constructor(storePath) {
    this.storePath = storePath;
    this.store = {};
    this._writable = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* writable */ "c"])({});
    this.initializing = Object(_lib_store__WEBPACK_IMPORTED_MODULE_1__[/* getLocalItem */ "b"])(storePath, JSON.stringify(defaultSetting)).then(r => {
      this.store = JSON.parse(r);

      this._writable.set(this.store);

      this._writable.subscribe(r => {
        this.store = r;
        this.save(r);
      });

      return;
    });
  }

  async getStore() {
    await this.initializing;
    return this.store;
  }

  save(r) {
    Object(_lib_store__WEBPACK_IMPORTED_MODULE_1__[/* setLocalItem */ "c"])(this.storePath, JSON.stringify(r));
  }

  getWritable() {
    return this._writable;
  }

  async get(k) {
    return (await this.getStore())[k];
  }

  async set(k, value) {
    const s = await this.getStore();
    s[k] = value;

    this._writable.set(s);

    this.save(s);
  }

}
/** 设置相关的存储 */


const settingStore = new PageNotesStore("__setting__");

/***/ }),

/***/ "./网页笔记/ui/message.ts":
/*!****************************!*\
  !*** ./网页笔记/ui/message.ts ***!
  \****************************/
/*! exports provided: messageList, Message */
/*! exports used: Message, messageList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return messageList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store/index.mjs");

/** 目前在呈现的消息列表 */

const messageList = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* writable */ "c"])([]);
/** 消息的基类 扩展类记得重写 thatMessage 以免公用出现bug */

class Message {
  constructor(par) {
    this.par = par;
    /** 用来指向不同的类，以便扩展这个类的类的old_message不被公用 */

    this.autoHideTime = 1000 * 3;
  }
  /** 展示el */


  show() {
    messageList.update(r => [...r, this]);
    return this;
  }
  /** 隐藏el */


  hide() {
    messageList.update(r => r.filter(el => this !== el));
    return this;
  }
  /** 展示el  autoHideTime 毫秒后隐藏*/


  autoHide() {
    this.show();
    setTimeout(() => {
      this.hide();
    }, this.autoHideTime);
    return this;
  }
  /** 获取一个Message对象 */


  static getMessage(par) {
    return new Message(par);
  }

}

/***/ }),

/***/ "./网页笔记/ui/style.ts":
/*!**************************!*\
  !*** ./网页笔记/ui/style.ts ***!
  \**************************/
/*! exports provided: Style */
/*! exports used: Style */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Style; });
class Style {}
Style.message = `
    border: 1px solid black;
    background-color: white;
    position: fixed;
    top: 20px;
    left: 30px;
    animation: llej_myfirst 5s;
    z-index:800;
    `;
Style.warning = `
    border: 1px solid black;
    background-color: red;
    position: fixed;
    top: 20px;
    left: 30px;
    z-index:800;
    `;
Style.note = `
    border: 1px solid black;
    background-color: #c6c5ba;
    position: sticky;
    top: 20px;
    left: 30px;
    width: auto;
    height: auto;
    z-index:800;
    `;
/** 注入动画 */

const keyframes = document.createElement('style');
keyframes.innerHTML = `
@keyframes llej_myfirst
{
    from { background: red;color:white; }
    to { background: yellow;color:black; }
}
`;
document.head.appendChild(keyframes);

/***/ }),

/***/ "./网页笔记/ui/warning.ts":
/*!****************************!*\
  !*** ./网页笔记/ui/warning.ts ***!
  \****************************/
/*! exports provided: Warning */
/*! exports used: Warning */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Warning; });
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message */ "./网页笔记/ui/message.ts");
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style */ "./网页笔记/ui/style.ts");


class Warning extends _message__WEBPACK_IMPORTED_MODULE_0__[/* Message */ "a"] {
  constructor({
    msg
  }) {
    super({
      msg,
      style: _style__WEBPACK_IMPORTED_MODULE_1__[/* Style */ "a"].warning
    });
  }

}

/***/ }),

/***/ "./网页笔记/util.ts":
/*!**********************!*\
  !*** ./网页笔记/util.ts ***!
  \**********************/
/*! exports provided: copyTitle, default, getSelectors, getIndex, nodePath, getJSon, ajax_get, log, SelectionEvent, getWindow */
/*! exports used: SelectionEvent, default, getJSon, getSelectors, log, nodePath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export copyTitle */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getSelectors; });
/* unused harmony export getIndex */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return nodePath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getJSon; });
/* unused harmony export ajax_get */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectionEvent; });
/* unused harmony export getWindow */
/* harmony import */ var svelte_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svelte/store */ "./node_modules/svelte/store/index.mjs");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./网页笔记/config.ts");
/* harmony import */ var _fun_command__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fun/command */ "./网页笔记/fun/command.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./state */ "./网页笔记/state/index.ts");




/** 用于复制文本的input   */

const input_copy = document.createElement("textarea");
input_copy.id = "__";
input_copy.style.display = "none"; //不能设置为none因为会导致没有可访问性

input_copy.setAttribute("style", `
        position: absolute;
        top: -9999px;
        left: -9999px;`);
document.body.appendChild(input_copy);
/** 复制一个元素的titil 或者一段字符串到剪贴板 */

function copyTitle(el) {
  let title;
  if (typeof el === "string") title = el;else title = el.getAttribute("title");
  input_copy.setAttribute("readonly", "readonly");
  input_copy.setAttribute("value", title);
  input_copy.value = title;
  input_copy.select();
  input_copy.setSelectionRange(0, 9999);
  document.execCommand("copy");
}
/** 工具类 */

/* harmony default export */ __webpack_exports__["b"] = ({
  copyTitle
});
/** 获取一个元素的选择器 */

function getSelectors(el) {
  /** 通过path路径来确定元素 */
  let pathSelectors = nodePath(el).reverse().map(el => {
    return el.nodeName + `:nth-child(${getIndex(el)})`;
  }).join(">");
  /** 通过id以及class来确定元素 */

  let id_className = "";
  const id = el.id;
  if (id) id_className += `#${id}`;
  Array.from(el.classList)
  /** 排除自定义类名 */
  .filter(el => el.includes("_llej_")).forEach(className => {
    id_className += `.${className}`;
  });
  /** nth-child 选择 看它是第几个元素 */

  const index = getIndex(el);
  /** 最终构造出来的选择器 */

  return `${pathSelectors}${id_className}:nth-child(${index})`;
}
/** 获取元素它在第几位 */

function getIndex(el) {
  if (el.nodeName === "HTML") return 1;

  if (el.parentElement === null) {
    return 1;
  }

  return 1 + Array.from(el.parentElement.children).findIndex(child => child === el);
}
/** 获取一个元素的所有父节点到html为止  */

function nodePath(...path) {
  while (path[path.length - 1].parentElement != null) {
    path.push(path[path.length - 1].parentElement);
  }
  /** 只需要是HTMLElement的 */


  const HTMLElementPath = path.filter(el => el instanceof HTMLElement);
  return HTMLElementPath;
}
async function getJSon(url, data) {
  const str = await ajax_get(url, data);
  const res = JSON.parse(str);
  console.log(url, data, res);
  return res;
}
/** 油猴的ajaxget */

function ajax_get(url, data) {
  if (data) url += "?" + jsonToURLpar(data);
  if (window.hasOwnProperty("GM") && window.hasOwnProperty("GM")) return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      onload: function (response) {
        resolve(response.responseText);
      },
      onerror: reject
    });
  });else return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
      resolve(xhr.responseText);
    });
    xhr.addEventListener("error", reject);
    xhr.open("get", url);
    xhr.send();
  });
}
/** json 转 urlpar 只能转一层 */

function jsonToURLpar(json) {
  return Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
  }).join("&");
}
/** 开发时的调试log */


function log(...arg) {
  if (_config__WEBPACK_IMPORTED_MODULE_1__[/* isDev */ "d"]) console.log(`[dev] `, ...arg);
}
/** 用户选中事件 */

var SelectionEvent;

(function (SelectionEvent) {
  /** 表示用户选中的对象，唯一的。不用每次去获取 */
  const s = window.getSelection();
  /** 是否处于 range 的选中状态 */

  SelectionEvent.isRange = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* writable */ "c"])(false);
  /** 选区开始位置的元素的 rect */

  SelectionEvent.anchorRect = Object(svelte_store__WEBPACK_IMPORTED_MODULE_0__[/* derived */ "a"])(SelectionEvent.isRange, $isRange => {
    if (!$isRange) return;
    const node = s.anchorNode;
    const el = node instanceof Element ? node : node.parentElement;
    const rect = el.getBoundingClientRect();
    return rect;
  });

  function 高亮(options = {}) {
    const h = new _fun_command__WEBPACK_IMPORTED_MODULE_2__[/* Highlighted */ "b"](options.style);
    _fun_command__WEBPACK_IMPORTED_MODULE_2__[/* CommandControl */ "a"].run(h);
    const className = h.className;
    const tagName = "span";
    let 选中的所有节点 = [];

    if (
    /** 跨元素了 */
    s.anchorNode !== s.focusNode) {
      const startRange = s.getRangeAt(0);
      const endRange = s.getRangeAt(s.rangeCount - 1);
      let startNode = startRange.startContainer;
      let endNode = endRange.endContainer;
      let cur = startNode;

      if (cur instanceof Text) {
        const s = startRange;
        const t2 = cur.splitText(s.startOffset);
        const t3 = t2.nextSibling;
        const wrap = document.createElement(tagName);
        wrap.appendChild(t2);
        cur.parentNode.insertBefore(wrap, t3);
      }

      cur = endNode;

      if (cur instanceof Text) {
        const s = endRange;
        const t2 = cur.splitText(s.endOffset);
        const wrap = document.createElement(tagName);
        wrap.appendChild(cur);
        t2.parentNode.insertBefore(wrap, t2);
        endNode = t2;
      }

      选中的所有节点 = getIntermediateNodes(startNode, endNode);
    } else {
      /** 单元素类 */
      const cur = s.anchorNode;

      if (cur instanceof Text) {
        const t2 = cur.splitText(s.anchorOffset);
        const t3 = t2.splitText(s.focusOffset);
        选中的所有节点.push(t2);
      } else {
        选中的所有节点.push(cur);
      }
    }

    console.log("选中的所有节点", 选中的所有节点);
    选中的所有节点.forEach(node => {
      let el;

      if (node instanceof Element) {
        el = node;
      } else {
        /** 对纯文本节点进行包装，因为纯文本节点无法附加样式等属性 */
        const wrap = document.createElement(tagName);
        const t2 = node.nextSibling;
        const parent = node.parentNode;
        wrap.appendChild(node);
        parent.insertBefore(wrap, t2);
        el = wrap;
      }

      el.classList.add(className);
    });
    /** 这些元素被添加了类名，甚至被包裹了一层。属于被污染的元素,直接标记他们的父亲 */

    const 共存层 = getIntermediateNodes.寻找共存层(...选中的所有节点); // console.log("[共存层]", 共存层);

    let parent = 共存层[0].parentElement;
    /** 避免标记的是不够大的元素，实际上也是因为寻找元素的方法不够好否则也用不着这个 */

    while (parent.className.includes("llej-page_notes-style")) {
      parent = parent.parentElement;
    }

    _state__WEBPACK_IMPORTED_MODULE_3__[/* editElement */ "b"].add(parent);
  }

  SelectionEvent.高亮 = 高亮;
  document.addEventListener("selectionchange", () => {
    SelectionEvent.isRange.set(s.type === "Range");
  });
})(SelectionEvent || (SelectionEvent = {}));

function getIntermediateNodes(a, b) {
  return getIntermediateNodes.获取两元素之间的元素(a, b);
}

(function (getIntermediateNodes) {
  function 寻找共存层(...args) {
    if (args.length === 1) {
      return args;
    }

    const parentList = args.map(el => 获取父链路(el).reverse()).sort((a, b) => {
      return a.length - b.length;
    });
    const 最短链路 = parentList[0];

    for (let i = 0; i < 最短链路.length; i++) {
      const element = 最短链路[i];
      const 此层是否全相似 = parentList.map(el => el[i]).every(el => el === element);

      if (此层是否全相似 === false) {
        return Array.from(最短链路[i - 1].childNodes);
      }
    }
  }

  getIntermediateNodes.寻找共存层 = 寻找共存层;
  /** 越接近node的元素越在前面 */

  function 获取父链路(node) {
    const list = [];
    list.push(node);
    let cur = node;

    while (cur.parentNode) {
      list.push(cur.parentNode);
      cur = cur.parentNode;
    }

    return list;
  }

  getIntermediateNodes.获取父链路 = 获取父链路;

  function 后面的兄弟元素(node) {
    const list = [];
    let cur = node;

    while (cur.nextSibling) {
      list.push(cur.nextSibling);
      cur = cur.nextSibling;
    }

    return list;
  }

  getIntermediateNodes.后面的兄弟元素 = 后面的兄弟元素;

  function 前面的兄弟元素(node) {
    const list = [];
    let cur = node;

    while (cur.previousSibling) {
      list.push(cur.previousSibling);
      cur = cur.previousSibling;
    }

    return list;
  }

  getIntermediateNodes.前面的兄弟元素 = 前面的兄弟元素;

  function 获取两元素之间的元素(a, b) {
    const list = [];
    const aParentList = 获取父链路(a).reverse();
    const bParentList = 获取父链路(b).reverse();
    /** 找出 a 与 b 在共存层的父元素 */

    const 短链路 = aParentList.length > bParentList.length ? bParentList : aParentList;
    let n1 = 短链路[0];
    let n2 = 短链路[0];

    for (let i = 0; i < 短链路.length; i++) {
      n1 = aParentList[i];
      n2 = bParentList[i];

      if (n1 !== n2) {
        break;
      }
    }
    /** 获取共存层中间的元素 */


    let cur = n1.nextSibling;

    while (cur !== n2 && cur.nextSibling !== null) {
      list.push(cur);
      cur = cur.nextSibling;
    }
    /** 判断 a 是否在 b前面 */


    cur = n1;
    let n1在前 = false;

    while (cur.nextSibling) {
      if (n2 === cur) {
        n1在前 = true;
        break;
      }

      cur = cur.nextSibling;
    }

    const [pre, next] = n1在前 ? [a, b] : [b, a];
    const 共存层 = 寻找共存层(a, b);
    cur = pre;

    while (!共存层.includes(cur)) {
      list.push(...后面的兄弟元素(cur));
      cur = cur.parentNode;
    }

    cur = next;

    while (!共存层.includes(cur)) {
      list.push(...前面的兄弟元素(cur));
      cur = cur.parentNode;
    }

    return list;
  }

  getIntermediateNodes.获取两元素之间的元素 = 获取两元素之间的元素;
})(getIntermediateNodes || (getIntermediateNodes = {}));

function getWindow() {
  return typeof unsafeWindow === "undefined" ? window : unsafeWindow;
}

/***/ })

/******/ });
//# sourceMappingURL=更好的我来导出.user.js.map