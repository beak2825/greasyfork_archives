// ==UserScript==
// @name         askHelper答题助手
// @namespace    aiask/askHelper
// @version      1.1.16
// @author       aiask
// @description  全平台问答助手，一键获取整个页面的试题答案，目前支持【超星学习通、知到智慧树、国开、广开、江开、上开、芯位教育、云慕学苑、职教云、川农在线、长江雨课堂(半兼容)、安徽继续教育平台、青书学堂】，更多平台开发中...
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAHVQTFRFR3BMgICBQD8/QUVHQ0ZIRUhKX2FiQD8/Tk1NP0VJPzs7Pz8/QD4+UE9QQD8/PVlnQD8/M6vj////n5+fN5C60NDQSl9qOXWSZL/qTFNXzOr4QWl8yMjItLS02traOIOnNZzN6OfnlJeZ9/f3PYGgpdrzmdXxgSBJqQAAABB0Uk5TAP5E6vys+7/Q0RhsfPFV/OwFarYAAAEESURBVHjapdHrboMgGIBhUHBaD/sAlTE8VOt2/5c4GlBMRZOl7w8j+kQQ0FaVwbG48IDq+piMPcgkO1bD/8DXvhD4/fb9ePDuGiqa2krV7pO1AxSLYIl2ABoeTLSvYMBi4N0sphOAlVaqg1aTPggmZYYaFvNMBYGQz6G6m2vbhEBvF81MxALFTDpbQQd3ZhvBgxqiFfBEO/CJ7ZxkNPcUbWBwn5DJw4KSsJHcHPCTLLDuQxpLkiMLbAIWJs1wBRVkyAFXT7Sa+AYQjTywNfOD74DNA18I9Ifjpg7Es/3Jj5eKyIEcBgNwhk5L8XMPonMQQcfNhBfRpIfbFbiRskCX5enFyz/07TSN9vGxKwAAAABJRU5ErkJggg==
// @match        *://*.asklib.com/*
// @match        *://*.chaoxing.com/*
// @match        *://*.hlju.edu.cn/*
// @match        *://lms.ouchn.cn/*
// @match        *://xczxzdbf.moodle.qwbx.ouchn.cn/*
// @match        *://tongyi.aliyun.com/qianwen/*
// @match        *://chatglm.cn/*
// @match        *://*.zhihuishu.com/*
// @match        *://course.ougd.cn/*
// @match        *://moodle.syxy.ouchn.cn/*
// @match        *://moodle.qwbx.ouchn.cn/*
// @match        *://elearning.bjou.edu.cn/*
// @match        *://whkpc.hnqtyq.cn:5678/*
// @match        *://study.ouchn.cn/*
// @match        *://www.51xinwei.com/*
// @match        *://*.w-ling.cn/*
// @match        *://xuexi.jsou.cn/*
// @match        *://*.edu-edu.com/*
// @match        *://xuexi.jsou.cn/*
// @match        *://spoc-exam.icve.com.cn/*
// @match        *://*.icve.com.cn/*
// @match        *://zice.cnzx.info/*
// @match        *://any.cnzx.info:81/*
// @match        *://www.icourse163.org/*
// @match        *://*.yuketang.cn/*
// @match        *://*.shou.org.cn/*
// @match        *://main.ahjxjy.cn/*
// @match        *://exam.chinaedu.net/*
// @match        *://degree.qingshuxuetang.com/*
// @match        *://cce.org.uooconline.com/*
// @resource     ttf          https://www.forestpolice.org/ttf/2.0/table.json
// @resource     ttf2         https://cdn.jsdmirror.com/gh/chengbianruan/staticfile/1.json
// @connect      127.0.0.1
// @connect      icodef.com
// @connect      muketool.com
// @connect      wk66.top
// @connect      82.157.105.20
// @connect      tikuhai.com
// @connect      zhihuishu.com
// @connect      yuketang.cn
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @antifeature  payment  第三方接口存在付费项
// @downloadURL https://update.greasyfork.org/scripts/499925/askHelper%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499925/askHelper%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const i=document.createElement("style");i.textContent=e,document.head.append(i)})(" button[data-v-36b56b47]{margin:10px}.aah_plat span[data-v-36b56b47]{margin:5px}.el-row{margin-bottom:20px}.el-row:last-child{margin-bottom:0}.el-col{border-radius:4px}.grid-content{border-radius:4px;min-height:36px}.aah_btn{width:100%}.aah_title img{max-width:100%;height:auto;overflow:hidden}.aah_title{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;margin-bottom:10px}.aah_active{box-shadow:0 0 5px #0af}.aah_password input{--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color, var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%;margin:auto}.el-input__inner{border:none!important;margin:auto;--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color, var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%}.aah_bomHet50{padding:13px 0 13px 10px}.aah_bomHet50 span{display:inline-block;line-height:24px;padding-left:14px;color:#a8a8b3}.aah_bomHet50 span i{display:inline-block;width:10px;height:10px;border:1px solid #DBDFE9;border-radius:2px;vertical-align:middle;margin-right:4px;margin-top:-2px}.aah_bomHet50 .dq i{background-color:#ecf5ff;box-shadow:0 0 5px #0af}.aah_bomHet50 .yp i{background-color:#f0f9eb;border-color:#409eff}.aah_bomHet50 .wp i{background-color:#fef0f0;border-color:#f56c6c}#AiAskApp .aah_wrapper>div{pointer-events:none}#AiAskApp .aah_wrapper>div>div{pointer-events:none}.el-dialog{pointer-events:auto}@media (max-width: 600px){#AiAskApp .el-scrollbar,#AiAskApp .el-scrollbar__wrap{max-height:50vh!important}}@media (min-width: 601px){#AiAskApp .el-scrollbar,#AiAskApp .el-scrollbar__wrap{max-height:700px!important}}.minimized-dialog img{pointer-events:auto;width:50px!important;z-index:999;position:fixed;bottom:0;right:0}.aah_breadcrumb{margin-bottom:20px} ");

(function (vue, ElementPlus, $, markdownit, hljs) {
  'use strict';

  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var isVue2 = false;
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key2) => target.set(key2, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key2 in patchToApply) {
      if (!patchToApply.hasOwnProperty(key2))
        continue;
      const subPatch = patchToApply[key2];
      const targetValue = target[key2];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key2) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key2] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key2] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia.state.value[$id] = {};
      }
    }
    vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(partialStore);
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
    for (const key2 in setupStore) {
      const prop = setupStore[key2];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key2];
            } else {
              mergeReactiveObjects(prop, initialState[key2]);
            }
          }
          {
            pinia.state.value[$id][key2] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = wrapAction(key2, prop);
        {
          setupStore[key2] = actionValue;
        }
        optionsForPlugin.actions[key2] = prop;
      } else
        ;
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
      }
      const store = pinia._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const prefix = "AiAsk_";
  class Cache {
    /**
     * 封装缓存
     * @param key 缓存key
     * @param value 缓存值
     * @param expire 过期时间
     * 
     * @returns 缓存值
     */
    static set(key2, value, expire = 0) {
      key2 = prefix + key2;
      if (expire > 0) {
        _GM_setValue(key2, {
          value,
          expire: (/* @__PURE__ */ new Date()).getTime() + expire * 1e3
        });
      } else {
        _GM_setValue(key2, {
          value,
          expire: 0
        });
      }
      return _GM_getValue(key2);
    }
    /**
     * 获取缓存
     * @param key 缓存key
     * 
     * @returns 缓存值
     */
    static get(key2, defaultVal = null) {
      key2 = prefix + key2;
      let cache = _GM_getValue(key2);
      if (cache && cache.expire > 0 && cache.expire < (/* @__PURE__ */ new Date()).getTime()) {
        _GM_setValue(key2, null);
        return defaultVal;
      }
      return cache ? cache.value : defaultVal;
    }
    /**
     * 前缀匹配
     */
    static match(key2) {
      key2 = prefix + key2;
      let allKeys = _GM_listValues();
      return allKeys.filter((k) => {
        return k.startsWith(key2);
      });
    }
    /**
     * 前缀匹配，获取值
     */
    static matchGet(key2) {
      key2 = prefix + key2;
      let allKeys = _GM_listValues();
      let res = [];
      allKeys.forEach((k) => {
        if (k.startsWith(key2)) {
          res.push(_GM_getValue(k, {
            value: null,
            expire: 0
          }).value);
        }
      });
      return res;
    }
    /**
     * 删除缓存
     * @param key 缓存key
     */
    static remove(key2) {
      key2 = prefix + key2;
      _GM_deleteValue(key2);
    }
    /**
     * 清空缓存
     */
    static clear() {
      let allKeys = _GM_listValues();
      allKeys.forEach((key2) => {
        if (key2.startsWith(prefix)) {
          _GM_deleteValue(key2);
        }
      });
    }
    /**
     * 前缀匹配删除
     */
    static matchRemove(key2) {
      key2 = prefix + key2;
      let allKeys = _GM_listValues();
      allKeys.forEach((k) => {
        if (k.startsWith(key2)) {
          _GM_deleteValue(k);
        }
      });
    }
  }
  /*! @license DOMPurify 3.0.11 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.0.11/LICENSE */
  const {
    entries,
    setPrototypeOf,
    isFrozen,
    getPrototypeOf,
    getOwnPropertyDescriptor
  } = Object;
  let {
    freeze,
    seal,
    create
  } = Object;
  let {
    apply,
    construct
  } = typeof Reflect !== "undefined" && Reflect;
  if (!freeze) {
    freeze = function freeze2(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal2(x) {
      return x;
    };
  }
  if (!apply) {
    apply = function apply2(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }
  if (!construct) {
    construct = function construct2(Func, args) {
      return new Func(...args);
    };
  }
  const arrayForEach = unapply(Array.prototype.forEach);
  const arrayPop = unapply(Array.prototype.pop);
  const arrayPush = unapply(Array.prototype.push);
  const stringToLowerCase = unapply(String.prototype.toLowerCase);
  const stringToString = unapply(String.prototype.toString);
  const stringMatch = unapply(String.prototype.match);
  const stringReplace = unapply(String.prototype.replace);
  const stringIndexOf = unapply(String.prototype.indexOf);
  const stringTrim = unapply(String.prototype.trim);
  const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  const regExpTest = unapply(RegExp.prototype.test);
  const typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(func) {
    return function() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return construct(func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const [property, value] of entries(object)) {
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (Array.isArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  const text = freeze(["#text"]);
  const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]);
  const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
  const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
  const TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
  const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
  const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  const IS_ALLOWED_URI = seal(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    // eslint-disable-line no-useless-escape
  );
  const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  const ATTR_WHITESPACE = seal(
    /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
    // eslint-disable-line no-control-regex
  );
  const DOCTYPE_NAME = seal(/^html$/i);
  const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_ALLOWED_URI,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE,
    DOCTYPE_NAME,
    CUSTOM_ELEMENT
  });
  const getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.0.11";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== 9) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let {
      document: document2
    } = window2;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    const {
      DocumentFragment,
      HTMLTemplateElement,
      Node,
      Element,
      NodeFilter,
      NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
      HTMLFormElement,
      DOMParser: DOMParser2,
      trustedTypes
    } = window2;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    const {
      implementation,
      createNodeIterator,
      createDocumentFragment,
      getElementsByTagName
    } = document2;
    const {
      importNode
    } = originalDocument;
    let hooks = {};
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const {
      MUSTACHE_EXPR: MUSTACHE_EXPR2,
      ERB_EXPR: ERB_EXPR2,
      TMPLIT_EXPR: TMPLIT_EXPR2,
      DATA_ATTR: DATA_ATTR2,
      ARIA_ATTR: ARIA_ATTR2,
      IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
      ATTR_WHITESPACE: ATTR_WHITESPACE2,
      CUSTOM_ELEMENT: CUSTOM_ELEMENT2
    } = EXPRESSIONS;
    let {
      IS_ALLOWED_URI: IS_ALLOWED_URI$1
    } = EXPRESSIONS;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(
        clone(DEFAULT_URI_SAFE_ATTRIBUTES),
        // eslint-disable-line indent
        cfg.ADD_URI_SAFE_ATTR,
        // eslint-disable-line indent
        transformCaseFunc
        // eslint-disable-line indent
      ) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(
        clone(DEFAULT_DATA_URI_TAGS),
        // eslint-disable-line indent
        cfg.ADD_DATA_URI_TAGS,
        // eslint-disable-line indent
        transformCaseFunc
        // eslint-disable-line indent
      ) : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
      FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
      CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        emptyHTML = trustedTypesPolicy.createHTML("");
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        }
        if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
          emptyHTML = trustedTypesPolicy.createHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
    const HTML_INTEGRATION_POINTS = addToSet({}, ["foreignobject", "desc", "title", "annotation-xml"]);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "svg";
        }
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }
        return Boolean(ALL_SVG_TAGS[tagName]);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "math";
        }
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
        }
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        node.parentNode.removeChild(node);
      } catch (_) {
        node.remove();
      }
    };
    const _removeAttribute = function _removeAttribute2(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }
      node.removeAttribute(name);
      if (name === "is" && !ALLOWED_ATTR[name]) {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(node);
          } catch (_) {
          }
        } else {
          try {
            node.setAttribute(name, "");
          } catch (_) {
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      return createNodeIterator.call(
        root.ownerDocument || root,
        root,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
        null
      );
    };
    const _isClobbered = function _isClobbered2(elm) {
      return elm instanceof HTMLFormElement && (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string" || typeof elm.insertBefore !== "function" || typeof elm.hasChildNodes !== "function");
    };
    const _isNode = function _isNode2(object) {
      return typeof Node === "function" && object instanceof Node;
    };
    const _executeHook = function _executeHook2(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }
      arrayForEach(hooks[entryPoint], (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode) {
      let content = null;
      _executeHook("beforeSanitizeElements", currentNode, null);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(currentNode.nodeName);
      _executeHook("uponSanitizeElement", currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode.nodeType === 7) {
        _forceRemove(currentNode);
        return true;
      }
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
            return false;
          }
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
            return false;
          }
        }
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          const parentNode = getParentNode(currentNode) || currentNode.parentNode;
          const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
          if (childNodes && parentNode) {
            const childCount = childNodes.length;
            for (let i = childCount - 1; i >= 0; --i) {
              parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
            }
          }
        }
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        content = currentNode.textContent;
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          content = stringReplace(content, expr, " ");
        });
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHook("afterSanitizeElements", currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName))
        ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName))
        ;
      else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        )
          ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName])
        ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, "")))
        ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag])
        ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, "")))
        ;
      else if (value) {
        return false;
      } else
        ;
      return true;
    };
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHook("beforeSanitizeAttributes", currentNode, null);
      const {
        attributes
      } = currentNode;
      if (!attributes) {
        return;
      }
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      let l = attributes.length;
      while (l--) {
        const attr = attributes[l];
        const {
          name,
          namespaceURI,
          value: attrValue
        } = attr;
        const lcName = transformCaseFunc(name);
        let value = name === "value" ? attrValue : stringTrim(attrValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        _removeAttribute(name, currentNode);
        if (!hookEvent.keepAttr) {
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
            value = stringReplace(value, expr, " ");
          });
        }
        const lcTag = transformCaseFunc(currentNode.nodeName);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
          if (namespaceURI)
            ;
          else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case "TrustedHTML": {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
              case "TrustedScriptURL": {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
            }
          }
        }
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          arrayPop(DOMPurify.removed);
        } catch (_) {
        }
      }
      _executeHook("afterSanitizeAttributes", currentNode, null);
    };
    const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHook("beforeSanitizeShadowDOM", fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHook("uponSanitizeShadowNode", shadowNode, null);
        if (_sanitizeElements(shadowNode)) {
          continue;
        }
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        _sanitizeAttributes(shadowNode);
      }
      _executeHook("afterSanitizeShadowDOM", fragment, null);
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        if (typeof dirty.toString === "function") {
          dirty = dirty.toString();
          if (typeof dirty !== "string") {
            throw typeErrorCreate("dirty is not a string, aborting");
          }
        } else {
          throw typeErrorCreate("toString is not a function");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      DOMPurify.removed = [];
      if (typeof dirty === "string") {
        IN_PLACE = false;
      }
      if (IN_PLACE) {
        if (dirty.nodeName) {
          const tagName = transformCaseFunc(dirty.nodeName);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
      } else if (dirty instanceof Node) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
      while (currentNode = nodeIterator.nextNode()) {
        if (_sanitizeElements(currentNode)) {
          continue;
        }
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
        _sanitizeAttributes(currentNode);
      }
      if (IN_PLACE) {
        return dirty;
      }
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          serializedHTML = stringReplace(serializedHTML, expr, " ");
        });
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint) {
      if (hooks[entryPoint]) {
        return arrayPop(hooks[entryPoint]);
      }
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };
    DOMPurify.removeAllHooks = function() {
      hooks = {};
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n) {
    if (n.__esModule)
      return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var md5 = { exports: {} };
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$1 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  /**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.8.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2023
   * @license MIT
   */
  (function(module) {
    (function() {
      var INPUT_ERROR = "input is invalid type";
      var FINALIZE_ERROR = "finalize already called";
      var WINDOW = typeof window === "object";
      var root = WINDOW ? window : {};
      if (root.JS_MD5_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
      if (NODE_JS) {
        root = commonjsGlobal;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && true && module.exports;
      var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [128, 32768, 8388608, -2147483648];
      var SHIFT = [0, 8, 16, 24];
      var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
      var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      var blocks = [], buffer8;
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        buffer8 = new Uint8Array(buffer);
        blocks = new Uint32Array(buffer);
      }
      var isArray = Array.isArray;
      if (root.JS_MD5_NO_NODE_JS || !isArray) {
        isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      var isView = ArrayBuffer.isView;
      if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
        isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var formatMessage = function(message) {
        var type = typeof message;
        if (type === "string") {
          return [message, true];
        }
        if (type !== "object" || message === null) {
          throw new Error(INPUT_ERROR);
        }
        if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          return [new Uint8Array(message), false];
        }
        if (!isArray(message) && !isView(message)) {
          throw new Error(INPUT_ERROR);
        }
        return [message, false];
      };
      var createOutputMethod = function(outputType) {
        return function(message) {
          return new Md5(true).update(message)[outputType]();
        };
      };
      var createMethod = function() {
        var method = createOutputMethod("hex");
        if (NODE_JS) {
          method = nodeWrap(method);
        }
        method.create = function() {
          return new Md5();
        };
        method.update = function(message) {
          return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type);
        }
        return method;
      };
      var nodeWrap = function(method) {
        var crypto = require$$1;
        var Buffer = require$$1.Buffer;
        var bufferFrom;
        if (Buffer.from && !root.JS_MD5_NO_BUFFER_FROM) {
          bufferFrom = Buffer.from;
        } else {
          bufferFrom = function(message) {
            return new Buffer(message);
          };
        }
        var nodeMethod = function(message) {
          if (typeof message === "string") {
            return crypto.createHash("md5").update(message, "utf8").digest("hex");
          } else {
            if (message === null || message === void 0) {
              throw new Error(INPUT_ERROR);
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            }
          }
          if (isArray(message) || isView(message) || message.constructor === Buffer) {
            return crypto.createHash("md5").update(bufferFrom(message)).digest("hex");
          } else {
            return method(message);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType) {
        return function(key2, message) {
          return new HmacMd5(key2, true).update(message)[outputType]();
        };
      };
      var createHmacMethod = function() {
        var method = createHmacOutputMethod("hex");
        method.create = function(key2) {
          return new HmacMd5(key2);
        };
        method.update = function(key2, message) {
          return method.create(key2).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type);
        }
        return method;
      };
      function Md5(sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
          this.buffer8 = buffer8;
        } else {
          if (ARRAY_BUFFER) {
            var buffer2 = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(buffer2);
            this.blocks = new Uint32Array(buffer2);
          } else {
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
        }
        this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
      }
      Md5.prototype.update = function(message) {
        if (this.finalized) {
          throw new Error(FINALIZE_ERROR);
        }
        var result = formatMessage(message);
        message = result[0];
        var isString = result[1];
        var code, index = 0, i, length = message.length, blocks2 = this.blocks;
        var buffer82 = this.buffer8;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = blocks2[16];
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (isString) {
            if (ARRAY_BUFFER) {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  buffer82[i++] = code;
                } else if (code < 2048) {
                  buffer82[i++] = 192 | code >>> 6;
                  buffer82[i++] = 128 | code & 63;
                } else if (code < 55296 || code >= 57344) {
                  buffer82[i++] = 224 | code >>> 12;
                  buffer82[i++] = 128 | code >>> 6 & 63;
                  buffer82[i++] = 128 | code & 63;
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  buffer82[i++] = 240 | code >>> 18;
                  buffer82[i++] = 128 | code >>> 12 & 63;
                  buffer82[i++] = 128 | code >>> 6 & 63;
                  buffer82[i++] = 128 | code & 63;
                }
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 2048) {
                  blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                }
              }
            }
          } else {
            if (ARRAY_BUFFER) {
              for (i = this.start; index < length && i < 64; ++index) {
                buffer82[i++] = message[index];
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Md5.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.bytes << 3;
        blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
        this.hash();
      };
      Md5.prototype.hash = function() {
        var a, b, c, d, bc, da, blocks2 = this.blocks;
        if (this.first) {
          a = blocks2[0] - 680876937;
          a = (a << 7 | a >>> 25) - 271733879 << 0;
          d = (-1732584194 ^ a & 2004318071) + blocks2[1] - 117830708;
          d = (d << 12 | d >>> 20) + a << 0;
          c = (-271733879 ^ d & (a ^ -271733879)) + blocks2[2] - 1126478375;
          c = (c << 17 | c >>> 15) + d << 0;
          b = (a ^ c & (d ^ a)) + blocks2[3] - 1316259209;
          b = (b << 22 | b >>> 10) + c << 0;
        } else {
          a = this.h0;
          b = this.h1;
          c = this.h2;
          d = this.h3;
          a += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks2[1] - 389564586;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks2[2] + 606105819;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks2[3] - 1044525330;
          b = (b << 22 | b >>> 10) + c << 0;
        }
        a += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[5] + 1200080426;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[6] - 1473231341;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[7] - 45705983;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[9] - 1958414417;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[10] - 42063;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[11] - 1990404162;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[13] - 40341101;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[14] - 1502002290;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[15] + 1236535329;
        b = (b << 22 | b >>> 10) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[6] - 1069501632;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[11] + 643717713;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[0] - 373897302;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[10] + 38016083;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[15] - 660478335;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[4] - 405537848;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[14] - 1019803690;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[3] - 187363961;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[8] + 1163531501;
        b = (b << 20 | b >>> 12) + c << 0;
        a += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
        a = (a << 5 | a >>> 27) + b << 0;
        d += (b ^ c & (a ^ b)) + blocks2[2] - 51403784;
        d = (d << 9 | d >>> 23) + a << 0;
        c += (a ^ b & (d ^ a)) + blocks2[7] + 1735328473;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a & (c ^ d)) + blocks2[12] - 1926607734;
        b = (b << 20 | b >>> 12) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[5] - 378558;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[8] - 2022574463;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[11] + 1839030562;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[14] - 35309556;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[1] - 1530992060;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[4] + 1272893353;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[7] - 155497632;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[10] - 1094730640;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[13] + 681279174;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[0] - 358537222;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[3] - 722521979;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[6] + 76029189;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a += (bc ^ d) + blocks2[9] - 640364487;
        a = (a << 4 | a >>> 28) + b << 0;
        d += (bc ^ a) + blocks2[12] - 421815835;
        d = (d << 11 | d >>> 21) + a << 0;
        da = d ^ a;
        c += (da ^ b) + blocks2[15] + 530742520;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[2] - 995338651;
        b = (b << 23 | b >>> 9) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[0] - 198630844;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[7] + 1126891415;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[14] - 1416354905;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[5] - 57434055;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[3] - 1894986606;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[10] - 1051523;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[1] - 2054922799;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[15] - 30611744;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[6] - 1560198380;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[13] + 1309151649;
        b = (b << 21 | b >>> 11) + c << 0;
        a += (c ^ (b | ~d)) + blocks2[4] - 145523070;
        a = (a << 6 | a >>> 26) + b << 0;
        d += (b ^ (a | ~c)) + blocks2[11] - 1120210379;
        d = (d << 10 | d >>> 22) + a << 0;
        c += (a ^ (d | ~b)) + blocks2[2] + 718787259;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a)) + blocks2[9] - 343485551;
        b = (b << 21 | b >>> 11) + c << 0;
        if (this.first) {
          this.h0 = a + 1732584193 << 0;
          this.h1 = b - 271733879 << 0;
          this.h2 = c - 1732584194 << 0;
          this.h3 = d + 271733878 << 0;
          this.first = false;
        } else {
          this.h0 = this.h0 + a << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
        }
      };
      Md5.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
        return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
      };
      Md5.prototype.toString = Md5.prototype.hex;
      Md5.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
        return [
          h0 & 255,
          h0 >>> 8 & 255,
          h0 >>> 16 & 255,
          h0 >>> 24 & 255,
          h1 & 255,
          h1 >>> 8 & 255,
          h1 >>> 16 & 255,
          h1 >>> 24 & 255,
          h2 & 255,
          h2 >>> 8 & 255,
          h2 >>> 16 & 255,
          h2 >>> 24 & 255,
          h3 & 255,
          h3 >>> 8 & 255,
          h3 >>> 16 & 255,
          h3 >>> 24 & 255
        ];
      };
      Md5.prototype.array = Md5.prototype.digest;
      Md5.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer2 = new ArrayBuffer(16);
        var blocks2 = new Uint32Array(buffer2);
        blocks2[0] = this.h0;
        blocks2[1] = this.h1;
        blocks2[2] = this.h2;
        blocks2[3] = this.h3;
        return buffer2;
      };
      Md5.prototype.buffer = Md5.prototype.arrayBuffer;
      Md5.prototype.base64 = function() {
        var v1, v2, v3, base64Str = "", bytes = this.array();
        for (var i = 0; i < 15; ) {
          v1 = bytes[i++];
          v2 = bytes[i++];
          v3 = bytes[i++];
          base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
        }
        v1 = bytes[i];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
        return base64Str;
      };
      function HmacMd5(key2, sharedMemory) {
        var i, result = formatMessage(key2);
        key2 = result[0];
        if (result[1]) {
          var bytes = [], length = key2.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key2.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key2.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key2 = bytes;
        }
        if (key2.length > 64) {
          key2 = new Md5(true).update(key2).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key2[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Md5.call(this, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacMd5.prototype = new Md5();
      HmacMd5.prototype.finalize = function() {
        Md5.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Md5.call(this, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Md5.prototype.finalize.call(this);
        }
      };
      var exports = createMethod();
      exports.md5 = exports;
      exports.md5.hmac = createHmacMethod();
      if (COMMON_JS) {
        module.exports = exports;
      } else {
        root.md5 = exports;
      }
    })();
  })(md5);
  var md5Exports = md5.exports;
  const scriptInfo$1 = _GM_info;
  const key = randomString(9) + "_";
  function request(url, method, data = void 0, headers = void 0, timeout = 1e4) {
    if (method === "GET" && data) {
      url += `?${new URLSearchParams(data).toString()}`;
    }
    if (method === "POST") {
      const t = get_t(data);
      headers = {
        ...headers,
        "aka": t
      };
    }
    const finalHeaders = {
      "User-Agent": _unsafeWindow.navigator.userAgent,
      "Content-Type": "application/json",
      "referer": location.href,
      "v": scriptInfo$1.script.version,
      ...headers
    };
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      _GM_xmlhttpRequest({
        method,
        url,
        headers: finalHeaders,
        data: method !== "GET" ? JSON.stringify(data) : void 0,
        timeout,
        onload: function(response) {
          const endTime = Date.now();
          const duration = endTime - startTime;
          resolve([response, duration]);
        },
        ontimeout: () => reject(new Error("接口请求超时")),
        onerror: (error) => {
          reject(error);
        }
      });
    });
  }
  function requestFetch(url, method, data, headers, timeout = 5e3) {
    const finalHeaders = {
      "User-Agent": _unsafeWindow.navigator.userAgent,
      "Content-Type": method === "POST" ? "application/json" : "text/plain;charset=UTF-8",
      ...headers
    };
    return new Promise((resolve, reject) => {
      fetch(url, {
        method,
        headers: finalHeaders,
        body: method === "POST" ? JSON.stringify(data) : void 0
      }).then((response) => resolve(response.text())).catch(function(error) {
        reject(error);
      });
    });
  }
  function headi() {
    let z = Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".");
    return {
      "X-Forwarded-For": z,
      "X-Real-IP": z
    };
  }
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  function removeHtml(htmlStr) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = htmlStr;
    htmlStr = textArea.value;
    htmlStr = htmlStr.replace(/[\t\r\xa0]/g, " ");
    htmlStr = htmlStr.replace(/[\u2000-\u200a]/g, " ");
    htmlStr = htmlStr.replace(/<br\s*\/?>/g, "\n");
    htmlStr = htmlStr.replace(/<(\/)?(p|div).*?>/g, "\n");
    htmlStr = htmlStr.replace(/ {2,}/g, " ");
    htmlStr = htmlStr.replace(/\n{2,}/g, "\n");
    htmlStr = purify.sanitize(htmlStr, { ALLOWED_TAGS: ["img", "br", "sub", "sup", "table", "caption", "thead", "tfoot", "tbody", "tr", "th", "td", "strong"], ALLOWED_ATTR: ["src", "href"], ALLOW_DATA_ATTR: false });
    return htmlStr.trim();
  }
  function removeHtml1(htmlStr, replacen = true) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = htmlStr;
    htmlStr = textArea.value;
    htmlStr = htmlStr.replace(/[\t\r\xa0]/g, " ");
    htmlStr = htmlStr.replace(/[\u2000-\u200a]/g, " ");
    htmlStr = htmlStr.replace(/<br\s*\/?>/g, "\n");
    if (replacen) {
      htmlStr = htmlStr.replace(/<(\/)?(p|div).*?>/g, "\n");
    }
    htmlStr = htmlStr.replace(/ {2,}/g, " ");
    htmlStr = htmlStr.replace(/\n{2,}/g, "\n");
    htmlStr = htmlStr.replace(/<xmp.*?>/g, "<pre>");
    htmlStr = htmlStr.replace(/<\/xmp>/g, "</pre>");
    htmlStr = purify.sanitize(htmlStr, { ALLOWED_TAGS: ["img", "br", "sub", "sup"], ALLOWED_ATTR: ["src", "href"], ALLOW_DATA_ATTR: false, KEEP_CONTENT: true });
    let imgReg = /<img.*?src="(.*?)".*?>/g;
    let imgArr = htmlStr.match(imgReg);
    if (imgArr) {
      imgArr.forEach((item) => {
        let src = item.match(/src="(.*?)"/);
        if (src) {
          if (src[1].indexOf("http") == -1 && !src[1].includes("data:image")) {
            if (src[1].startsWith("/")) {
              htmlStr = htmlStr.replace(src[1], location.origin + src[1]);
            } else {
              htmlStr = htmlStr.replace(src[1], location.origin + "/" + src[1]);
            }
          }
        }
      });
    }
    return htmlStr.trim();
  }
  function titleClean(title) {
    return title.replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "").replace(/^\d+\./, "").trim();
  }
  function typeChange(typeNumber) {
    let types = {
      "单选题": "0",
      "多选题": "1",
      "填空题": "2",
      "判断题": "3",
      "简答题": "4",
      "问答题": "4",
      "名词解释": "5",
      "论述题": "6",
      "计算题": "7",
      "分录题": "9",
      "资料题": "10",
      "连线题": "11",
      "匹配题": "11",
      "排序题": "13",
      "完型填空": "14",
      "完形填空题": "14",
      "阅读理解": "15",
      "程序题": "17",
      "口语题": "18",
      "听力题": "19",
      "共用选项题": "20",
      "测评题": "21",
      "钟表题": "23",
      "选词填空": "24",
      "选做题": "25",
      "其它": "8"
    };
    return types[typeNumber] ?? "8";
  }
  function typeChange2(typeNumber) {
    let types = {
      "0": "单选题",
      "1": "多选题",
      "2": "填空题",
      "3": "判断题",
      "4": "简答题",
      "5": "名词解释",
      "6": "论述题",
      "7": "计算题",
      "9": "分录题",
      "10": "资料题",
      "11": "连线题",
      "13": "排序题",
      "14": "完型填空",
      "15": "阅读理解",
      "17": "程序题",
      "18": "口语题",
      "19": "听力题",
      "20": "共用选项题",
      "21": "测评题",
      "23": "钟表题",
      "24": "选词填空",
      "25": "选做题",
      "8": "其它"
    };
    return types[typeNumber] ?? "其他";
  }
  function answerFormat(answer) {
    if (answer instanceof Array) {
      answer = answer.filter(function(item) {
        return item !== null;
      });
      for (let i = 0; i < answer.length; i++) {
        answer[i] = removeHtml(answer[i]);
      }
    } else if (typeof answer === "string") {
      answer = titleClean(answer);
    }
    return answer;
  }
  function removeSpace(str) {
    if (/^[+-]?\d+(\.\d+)?$/.test(str)) {
      return str;
    }
    return str.replace(/[\s\p{P}]/gu, "");
  }
  function matchAnswer(answer, options) {
    if (answer == "" || answer == null || answer == void 0) {
      return [];
    }
    answer = answer.map((item) => removeHtml1(item));
    options = options.map((item) => removeHtml1(item));
    answer = answerFormat(answer);
    let isMatch = options.every((item) => {
      return /[\u4e00-\u9fa5a-zA-Z0-9]/.test(item);
    });
    if (isMatch) {
      answer = answer.map((item) => removeSpace(item));
      options = options.map((item) => removeSpace(item));
    }
    var matchArr = [];
    for (var i = 0; i < answer.length; i++) {
      for (var j = 0; j < options.length; j++) {
        if (answer[i] == options[j]) {
          matchArr.push(j);
        }
      }
    }
    return matchArr;
  }
  function recoverConsole() {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;
  }
  function qc(item) {
    $(item).find(".answerBg, .textDIV, .eidtDiv").each(function() {
      ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
    });
    $(item).find(".answerBg, .textDIV, .eidtDiv").find("textarea").each(function() {
      _unsafeWindow.UE.getEditor($(this).attr("name")).ready(function() {
        this.setContent("");
      });
    });
    $(item).find(":radio, :checkbox").prop("checked", false);
    $(item).find("textarea").each(function() {
      _unsafeWindow.UE.getEditor($(this).attr("name")).ready(function() {
        this.setContent("");
      });
    });
  }
  function qc1(item) {
    $(item).find(".before-after,.before-after-checkbox, .textDIV, .eidtDiv").each(function() {
      ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
    });
    $(item).find(".before-after, .textDIV, .eidtDiv").find("textarea").each(function() {
      _unsafeWindow.UE.getEditor($(this).attr("name")).ready(function() {
        this.setContent("");
      });
    });
    $(item).find(":radio, :checkbox").prop("checked", false);
    $(item).find("textarea").each(function() {
      _unsafeWindow.UE.getEditor($(this).attr("name")).ready(function() {
        this.setContent("");
      });
    });
  }
  const allowCopy = () => {
    document.body.oncopy = null;
    document.body.oncut = null;
    document.body.onpaste = null;
    document.body.onselectstart = null;
    document.body.ondragstart = null;
    const style = document.createElement("style");
    style.innerHTML = `
      * {
          -webkit-user-select: auto !important;
          -moz-user-select: auto !important;
          -o-user-select: auto !important;
          user-select: auto !important;
      }
  `;
    document.head.appendChild(style);
  };
  function isTrue(text2) {
    return Boolean(String(text2).match(/(正确|是|对|√|T|ri|true)/));
  }
  function isFalse(text2) {
    return Boolean(String(text2).match(/(错误|否|错|×|F|wr|false)/));
  }
  function msg(content, type = "info") {
    try {
      ElementPlus.ElNotification({
        // @ts-ignore
        title: `${scriptInfo$1.script.name} v${scriptInfo$1.script.version}`,
        // 设置通知标题，使用模板字符串拼接脚本信息
        message: content,
        // 设置通知内容
        type,
        // 设置通知类型，默认为 "info"
        dangerouslyUseHTMLString: true
        // 允许使用 HTML 字符串
      });
    } catch (e) {
    }
  }
  const formatDate = (dateString) => {
    let date = new Date(dateString);
    return date.toISOString().replace("T", " ").substring(0, 19);
  };
  const updateCheck = () => {
    const app = wapp().app;
    if (!app.app.checkUpdate) {
      return Promise.resolve(null);
    }
    let updateCache = Cache.get("lastCheckTime");
    if (updateCache && (/* @__PURE__ */ new Date()).getTime() - updateCache < 1e3 * 60) {
      return Promise.resolve(null);
    }
    try {
      let scriptId = app.script.updateURL.match(/scripts\/(\d+)/)[1];
      if (!scriptId) {
        return Promise.resolve(null);
      }
      let url = `https://greasyfork.org/zh-CN/scripts/${scriptId}.json`;
      return new Promise((resolve, reject) => {
        requestFetch(url, "GET", {}, {}).then((res) => {
          res = JSON.parse(res);
          log("更新检测", res, "info");
          if (res.version > scriptInfo$1.script.version) {
            msg(`检测到新版本<span style="color:red">${res.version}</span>,请及时更新<br>更新时间:${formatDate(res.code_updated_at)}<br><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/${scriptId}">>>点我快捷跳转更新<<</a>`, "warning");
          }
          Cache.set("lastCheckTime", (/* @__PURE__ */ new Date()).getTime());
        }).catch(
          (error) => {
            console.error("更新检测失败", error);
            resolve(null);
          }
        );
      });
    } catch {
      console.error("更新检测失败");
      return Promise.resolve(null);
    }
  };
  const updateCheck1 = () => {
    const app = wapp().app;
    let scriptId = app.script.updateURL.match(/scripts\/(\d+)/)[1];
    if (!scriptId) {
      return Promise.resolve(null);
    }
    let url = `https://greasyfork.org/zh-CN/scripts/${scriptId}.json`;
    return new Promise((resolve, reject) => {
      requestFetch(url, "GET", {}, {}).then((res) => {
        res = JSON.parse(res);
        if (res.version > scriptInfo$1.script.version) {
          msg(`检测到新版本<span style="color:red">${res.version}</span>,请及时更新<br>更新时间:${formatDate(res.code_updated_at)}<br><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/${scriptId}">>>点我快捷跳转更新<<</a>`, "warning");
        } else {
          msg(`当前版本为最新版本`, "success");
        }
        Cache.set("lastCheckTime", (/* @__PURE__ */ new Date()).getTime());
      }).catch(
        (error) => {
          console.error("更新检测失败", error);
          resolve(null);
        }
      );
    });
  };
  function randomString(len) {
    let str = "";
    for (; str.length < len; str += Math.random().toString(36).substr(2))
      ;
    return str.substr(0, len);
  }
  function wapp() {
    const app = _unsafeWindow[key];
    return app;
  }
  const waitUntil = (condition, interval = 100) => {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (condition()) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  };
  const questionHash = (type, question, options, optionsSort = true) => {
    let option = Array.from(options);
    if (optionsSort) {
      option.sort();
    }
    const optionsStr = option.join("");
    const hash2 = md5Exports.md5(`${type}${question}${optionsStr}`);
    return hash2;
  };
  const env = (dev, prod) => {
    return prod;
  };
  function get_t(data) {
    const { sign, t, ...rest } = data;
    const keys = Object.keys(rest).sort();
    const str = keys.map((key2) => {
      let value = rest[key2];
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      return `${key2}=${value}`;
    }).join("&");
    return md5Exports.md5(str);
  }
  function removeStartChar(options) {
    return options.map((item, inx) => {
      let chr = String.fromCharCode(65 + inx) + ".";
      return item.replace(new RegExp(`^${chr}`), "").trim();
    });
  }
  function log(...args) {
  }
  function getUrl() {
    return location.href;
  }
  function isExist(selector) {
    return $(selector).length > 0;
  }
  class Answer {
    constructor() {
    }
    /**
     * @description: 接口打分，是否有答案，是否匹配
     */
    static score(answer) {
    }
    /**
     * @description: 批量获取所有答案
     */
    static async getAllAnswers(questionList) {
      const promises = [
        this.getAnswer3(questionList),
        this.getAnswer1(questionList)
      ];
      return Promise.all(promises);
    }
    /**
     * @description: 批量获取答案
     */
    static async getAnswers(questionList) {
      const promises = [
        this.getAnswer3(questionList)
      ];
      return Promise.all(promises);
    }
    /**
     * @description: 批量获取答案(免费接口)
     */
    static async getAnswersFree(questionList) {
      const promises = [
        this.getMainAnswer(questionList),
        this.getAnswer1(questionList)
      ];
      return Promise.all(promises);
    }
    /**
     * @description: 内置接口1 一之题库
     */
    static async getAnswer1(questionData) {
      let headers = headi();
      return new Promise((resolve) => {
        request("http://cx.icodef.com/wyn-nb?v=4", "POST", {
          question: questionData.question
        }, headers).then((res) => {
          let duration = res[1];
          try {
            res = JSON.parse(res[0].responseText);
          } catch (error) {
            resolve({ form: "免费题库", answer: null, error, duration });
          }
          let answer = "";
          if (res.code === 1) {
            let data = res.data.replace(/javascript:void\(0\);/g, "").trim().replace(/\n/g, "");
            const keywords = ["叛逆", "公众号", "李恒雅", "一之"];
            if (keywords.every((keyword) => !data.includes(keyword))) {
              answer = data.split("#");
            }
          }
          resolve({ form: "免费题库", answer, duration });
        }).catch((error) => {
          resolve({ form: "免费题库", answer: void 0, msg: error, duration: 5e3 });
        });
      });
    }
    static async getAnswer2(questionData) {
      return new Promise((resolve) => {
        if (![0, 1, 2].includes(parseInt(questionData.type))) {
          resolve({
            form: "muketool",
            answer: "",
            duration: "不支持的题型"
          });
          return;
        }
        request("https://api.muketool.com/cx/v2/query", "POST", {
          question: questionData.question,
          type: parseInt(questionData.type)
        }, {}).then((res) => {
          let duration = res[1];
          res = JSON.parse(res[0].responseText);
          resolve({
            form: "muketool",
            answer: res.code === 1 ? res.data.split("#") : "",
            duration
          });
        }).catch(() => {
          resolve({
            form: "muketool",
            answer: ""
          });
        });
      });
    }
    static async getAnswer3(questionData) {
      const headers = {
        "Content-Type": "application/json",
        "referer": location.href,
        "v": scriptInfo.version,
        "s": scriptInfo.author
      };
      const data = {
        question: questionData.question,
        // 选项数组
        options: questionData.options.map((item) => item),
        type: questionData.type,
        questionData: questionData.html.innerHTML,
        workType: questionData.workType,
        key: appCache.key ?? ""
      };
      return new Promise((resolve) => {
        request("https://api.tikuhai.com/search", "POST", data, headers).then((res) => {
          let duration = res[1];
          res = JSON.parse(res[0].responseText);
          if (res.code === 200) {
            resolve({
              form: "付费题库",
              answer: res.data.answer,
              duration,
              msg: res.msg
            });
          } else {
            resolve({
              form: "付费题库",
              answer: "",
              duration,
              msg: res.msg
            });
          }
        }).catch((error) => {
          resolve({
            form: "付费题库",
            answer: "",
            error,
            duration: 10,
            msg: "请求失败"
          });
        });
      });
    }
    /**
     * @description: 将答案缓存在本地
     */
    static cacheAnswer(questionData) {
      const data = {
        type: questionData.type,
        question: questionData.question,
        options: questionData.options,
        answer: questionData.answer
      };
      const hash2 = questionHash(data.type, data.question, data.options);
      Cache.set("ques_" + hash2, data);
    }
    /**
     * @description: 从本地缓存获取答案
     */
    static async getCacheAnswer(questionData) {
      const hash2 = questionHash(questionData.type, questionData.question, questionData.options);
      let data = Cache.get("ques_" + hash2);
      if (data) {
        return {
          form: "本地缓存",
          answer: data.answer,
          duration: 10
        };
      }
      return {
        form: "本地缓存",
        answer: "",
        duration: 10,
        msg: "未找到缓存"
      };
    }
    /**
     * @description: 从自建题库获取答案
     */
    static getMainAnswer(questionData) {
      const data = {
        type: questionData.type,
        question: questionData.question,
        options: questionData.options.map((item) => item),
        html: questionData.html.innerHTML,
        workType: questionData.workType,
        pageType: questionData.pageType
      };
      const url = env("http://127.0.0.1:9966/api/search", "https://aiask.wk66.top/api/search");
      return new Promise((resolve) => {
        request(url, "POST", data, {}).then((res) => {
          let duration = res[1];
          res = JSON.parse(res[0].responseText);
          if (res.code === 200) {
            resolve({
              form: "爱问答题库",
              answer: res.data.answer,
              duration,
              msg: res.msg
            });
          } else {
            resolve({
              form: "爱问答题库",
              answer: "",
              duration,
              msg: res.msg
            });
          }
        }).catch((error) => {
          resolve({
            form: "爱问答题库",
            answer: "",
            error,
            duration: 10,
            msg: "请求失败"
          });
        });
      });
    }
    /**
     * @description: 同步题库
     */
    static async syncQuestionList(data) {
      return new Promise((resolve) => {
        const url = env("http://127.0.0.1:9966/api/sync", "https://aiask.wk66.top/api/sync");
        request(url, "POST", data, {}).then((res) => {
          log(res[0].responseText);
          resolve(res[0].responseText);
        }).catch((error) => {
          resolve(error);
        });
      });
    }
  }
  const parsePack = (str) => {
    const pattern = /data:\s*({.*?})\s*\n/g;
    const result = [];
    let match;
    while ((match = pattern.exec(str)) !== null) {
      const jsonStr = match[1];
      try {
        const json = JSON.parse(jsonStr);
        result.push(json);
      } catch (e) {
      }
    }
    return result;
  };
  const aiAsk = async (message, callback, isfinish) => {
    let config = getApp();
    let url = config.gpt[0].api;
    let data = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "请只需要回答我的问题不要有多余的话，如果你不知道请返回【我不会】" },
        {
          "role": "user",
          "content": message
        }
      ],
      "stream": true
    });
    let headers = {
      "Accept": "application/json",
      "Authorization": `Bearer ${config.gpt[0].key}`,
      "Content-Type": "application/json"
    };
    return new Promise((resolve, reject) => {
      if (!config.gpt[0].key) {
        callback(`AI响应异常，可能是没有获取KEY,请按下方步骤操作  
            1. 打开[智普清言](https://chatglm.cn/main/alltoolsdetail)  
            2. 登录后随便发一条消息即可  
            3. 返回答题页刷新页面  `);
        return resolve("暂无KEY");
      }
      _GM_xmlhttpRequest({
        method: "POST",
        url,
        data,
        headers,
        responseType: "stream",
        onloadstart: async (r) => {
          let finish = false;
          const reader = r.response.getReader();
          const decoder = new TextDecoder();
          while (!finish) {
            const { done, value } = await reader.read();
            if (done) {
              finish = true;
              isfinish();
              break;
            }
            const jsonArray = parsePack(decoder.decode(value));
            jsonArray.forEach((json) => {
              if (!json.choices || json.choices.length === 0) {
                return;
              }
              const text2 = json.choices[0].delta.content;
              if (text2 === void 0 || text2 === "") {
                return;
              }
              callback(text2);
            });
          }
        }
      });
    });
  };
  const yunmuxueyuan = [
    {
      type: "hook",
      name: "云幕学苑hook",
      match: location.host.includes("w-ling.cn"),
      main: (data) => {
        _unsafeWindow.mainClass = $(".backup >a").attr("href");
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== $(".backup >a").attr("href")) {
            _unsafeWindow.mainClass = $(".backup >a").attr("href");
            if (_unsafeWindow.mainClass === "homework-detail-container") {
              await waitUntil(function() {
                return $(".selectDan").length !== 0;
              });
            }
            vuePageChange();
            observer.disconnect();
          }
        });
        if ($("#app").length >= 1) {
          observer.observe($("#app")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    {
      type: "save",
      name: "云幕学苑收录",
      match: () => location.host.includes("w-ling.cn") && location.href.includes("practiceRecord"),
      question: {
        html: ".selectDan >div >div",
        question: ".title",
        options: ".selectItem label .tagbq",
        type: ".question-box .tag",
        workType: "yunmuxueyuan",
        pageType: "yunmuxueyuan"
      },
      init: async () => {
      },
      answerHook: (item) => {
        const type = $(item.html).parent().find("h3").text().split("、")[1];
        item.question = item.question.replace(/^\d+、/, "");
        item.question = item.question.replace(/\(\d+分\)$/, "");
        let answer = $(item.html).find(".anaylize > span:eq(0)").text().replace("作答正确：", "");
        if (answer === "") {
          answer = $(item.html).find(".falsanaly > span:eq(1)").text().replace("正确答案：", "");
        }
        switch (type) {
          case "单选题":
          case "多选题":
            answer = answer.split("");
            item.answer = answer.map((xx) => {
              return item.options[xx.charCodeAt(0) - 65];
            });
            if (item.answer.length === 0) {
              return;
            }
            item.answer.length > 1 ? item.type = "1" : item.type = "0";
            break;
          case "判断题":
            item.type = "3";
            if (answer == "T") {
              item.answer = ["正确"];
            }
            if (answer == "F") {
              item.answer = ["错误"];
            }
            break;
          case "填空题":
            item.answer = $(item.html).find(".riganswer > span").first().nextAll("span").map((inx, element) => {
              return removeHtml1($(element).text());
            }).get();
            item.type = "2";
            break;
        }
        return item;
      }
    },
    {
      type: "ask",
      name: "云幕学苑",
      tips: "云幕学苑仅支持选择判断，其他题型待适配",
      match: () => location.host.includes("w-ling.cn") && location.href.includes("practicePaper"),
      question: {
        html: ".selectDan >div >div",
        question: ".title",
        options: ".selectItem label .tagbq",
        type: ".question-box .tag",
        workType: "yunmuxueyuan",
        pageType: "yunmuxueyuan"
      },
      init: async () => {
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        item.question = item.question.replace(/^\d+、/, "");
        item.question = item.question.replace(/\(\d+分\)$/, "");
        const type = $(item.html).parent().find("h4").text().split("、")[1];
        switch (type) {
          case "单选题":
            item.type = "0";
            break;
          case "多选题":
            item.type = "1";
            break;
          case "判断题":
            item.type = "3";
            item.$options = $(item.html).find(".selectItem label");
            item.options = item.$options.map((inx, element) => {
              return removeHtml1($(element).text());
            }).get();
            log(item.$options);
            break;
          case "填空题":
            item.type = "2";
            break;
        }
        return item;
      },
      setAnswer: (item) => {
        switch (item.type) {
          case "3":
            break;
          case "2":
            $(item.html).find(".tiankong input").each((inx, element) => {
              let vueL = $(element).parent()[0].__vue__;
              $(element).val(item.answer[inx]);
              const event2 = new Event("input");
              element.dispatchEvent(event2);
              vueL.$emit("change", item.answer[inx]);
            });
            return false;
        }
        return true;
      },
      finish: (item) => {
      }
    }
  ];
  var Typr = {};
  Typr.parse = function(buff) {
    var bin = Typr._bin;
    var data = new Uint8Array(buff);
    var offset = 0;
    bin.readFixed(data, offset);
    offset += 4;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var tags = ["cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG "];
    var obj = { _data: data };
    var tabs = {};
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      var length = bin.readUint(data, offset);
      offset += 4;
      tabs[tag] = { offset: toffset, length };
    }
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (tabs[t])
        obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
    }
    return obj;
  };
  Typr._tabOffset = function(data, tab) {
    var bin = Typr._bin;
    var numTables = bin.readUshort(data, 4);
    var offset = 12;
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      if (tag == tab)
        return toffset;
    }
    return 0;
  };
  Typr._bin = { readFixed: function(data, o) {
    return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
  }, readF2dot14: function(data, o) {
    var num = Typr._bin.readShort(data, o);
    return num / 16384;
  }, readInt: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p + 3];
    a[1] = buff[p + 2];
    a[2] = buff[p + 1];
    a[3] = buff[p];
    return Typr._bin.t.int32[0];
  }, readInt8: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p];
    return Typr._bin.t.int8[0];
  }, readShort: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[1] = buff[p];
    a[0] = buff[p + 1];
    return Typr._bin.t.int16[0];
  }, readUshort: function(buff, p) {
    return buff[p] << 8 | buff[p + 1];
  }, readUshorts: function(buff, p, len) {
    var arr = [];
    for (var i = 0; i < len; i++)
      arr.push(Typr._bin.readUshort(buff, p + i * 2));
    return arr;
  }, readUint: function(buff, p) {
    var a = Typr._bin.t.uint8;
    a[3] = buff[p];
    a[2] = buff[p + 1];
    a[1] = buff[p + 2];
    a[0] = buff[p + 3];
    return Typr._bin.t.uint32[0];
  }, readUint64: function(buff, p) {
    return Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4);
  }, readASCII: function(buff, p, l) {
    var s = "";
    for (var i = 0; i < l; i++)
      s += String.fromCharCode(buff[p + i]);
    return s;
  }, readUnicode: function(buff, p, l) {
    var s = "";
    for (var i = 0; i < l; i++) {
      var c = buff[p++] << 8 | buff[p++];
      s += String.fromCharCode(c);
    }
    return s;
  }, _tdec: window["TextDecoder"] ? new window["TextDecoder"]() : null, readUTF8: function(buff, p, l) {
    var tdec = Typr._bin._tdec;
    if (tdec && p == 0 && l == buff.length)
      return tdec["decode"](buff);
    return Typr._bin.readASCII(buff, p, l);
  }, readBytes: function(buff, p, l) {
    var arr = [];
    for (var i = 0; i < l; i++)
      arr.push(buff[p + i]);
    return arr;
  }, readASCIIArray: function(buff, p, l) {
    var s = [];
    for (var i = 0; i < l; i++)
      s.push(String.fromCharCode(buff[p + i]));
    return s;
  } };
  Typr._bin.t = { buff: new ArrayBuffer(8) };
  Typr._bin.t.int8 = new Int8Array(Typr._bin.t.buff);
  Typr._bin.t.uint8 = new Uint8Array(Typr._bin.t.buff);
  Typr._bin.t.int16 = new Int16Array(Typr._bin.t.buff);
  Typr._bin.t.uint16 = new Uint16Array(Typr._bin.t.buff);
  Typr._bin.t.int32 = new Int32Array(Typr._bin.t.buff);
  Typr._bin.t.uint32 = new Uint32Array(Typr._bin.t.buff);
  Typr._lctf = {};
  Typr._lctf.parse = function(data, offset, length, font, subt) {
    var bin = Typr._bin;
    var obj = {};
    var offset0 = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    offset += 2;
    obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
    obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
    obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
    return obj;
  };
  Typr._lctf.readLookupList = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  };
  Typr._lctf.readLookupTable = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = { tabs: [] };
    obj.ltype = bin.readUshort(data, offset);
    offset += 2;
    obj.flag = bin.readUshort(data, offset);
    offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, obj.ltype, offset0 + noff);
      obj.tabs.push(tab);
    }
    return obj;
  };
  Typr._lctf.numOfOnes = function(n) {
    var num = 0;
    for (var i = 0; i < 32; i++)
      if ((n >>> i & 1) != 0)
        num++;
    return num;
  };
  Typr._lctf.readClassDef = function(data, offset) {
    var bin = Typr._bin;
    var obj = [];
    var format = bin.readUshort(data, offset);
    offset += 2;
    if (format == 1) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++) {
        obj.push(startGlyph + i);
        obj.push(startGlyph + i);
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    if (format == 2) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    return obj;
  };
  Typr._lctf.getInterval = function(tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start = tab[i], end = tab[i + 1];
      tab[i + 2];
      if (start <= val && val <= end)
        return i;
    }
    return -1;
  };
  Typr._lctf.readValueRecord = function(data, offset, valFmt) {
    var bin = Typr._bin;
    var arr = [];
    arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 1 ? 2 : 0;
    arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 2 ? 2 : 0;
    arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 4 ? 2 : 0;
    arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 8 ? 2 : 0;
    return arr;
  };
  Typr._lctf.readCoverage = function(data, offset) {
    var bin = Typr._bin;
    var cvg = {};
    cvg.fmt = bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1)
      cvg.tab = bin.readUshorts(data, offset, count);
    if (cvg.fmt == 2)
      cvg.tab = bin.readUshorts(data, offset, count * 3);
    return cvg;
  };
  Typr._lctf.coverageIndex = function(cvg, val) {
    var tab = cvg.tab;
    if (cvg.fmt == 1)
      return tab.indexOf(val);
    if (cvg.fmt == 2) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (ind != -1)
        return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  };
  Typr._lctf.readFeatureList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj.push({ tag: tag.trim(), tab: Typr._lctf.readFeatureTable(data, offset0 + noff) });
    }
    return obj;
  };
  Typr._lctf.readFeatureTable = function(data, offset) {
    var bin = Typr._bin;
    bin.readUshort(data, offset);
    offset += 2;
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    var indices = [];
    for (var i = 0; i < lookupCount; i++)
      indices.push(bin.readUshort(data, offset + 2 * i));
    return indices;
  };
  Typr._lctf.readScriptList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  };
  Typr._lctf.readScriptTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = bin.readUshort(data, offset);
    offset += 2;
    obj.default = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  };
  Typr._lctf.readLangSysTable = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    obj.reqFeature = bin.readUshort(data, offset);
    offset += 2;
    var featureCount = bin.readUshort(data, offset);
    offset += 2;
    obj.features = bin.readUshorts(data, offset, featureCount);
    return obj;
  };
  Typr.CFF = {};
  Typr.CFF.parse = function(data, offset, length) {
    var bin = Typr._bin;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    var names = [];
    for (var i = 0; i < ninds.length - 1; i++)
      names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (var i = 0; i < tdinds.length - 1; i++)
      topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0];
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (var i = 0; i < sinds.length - 1; i++)
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    offset += sinds[sinds.length - 1];
    Typr.CFF.readSubrs(data, offset, topdict);
    if (topdict.CharStrings) {
      offset = topdict.CharStrings;
      var sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (var i = 0; i < sinds.length - 1; i++)
        cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    if (topdict.Encoding)
      topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
    if (topdict.charset)
      topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
    if (topdict.Private) {
      offset = topdict.Private[1];
      topdict.Private = Typr.CFF.readDict(data, offset, offset + topdict.Private[0]);
      if (topdict.Private.Subrs)
        Typr.CFF.readSubrs(data, offset + topdict.Private.Subrs, topdict.Private);
    }
    var obj = {};
    for (var p in topdict) {
      if (["FamilyName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1)
        obj[p] = strings[topdict[p] - 426 + 35];
      else
        obj[p] = topdict[p];
    }
    return obj;
  };
  Typr.CFF.readSubrs = function(data, offset, obj) {
    var bin = Typr._bin;
    var gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    if (nSubrs < 1240)
      bias = 107;
    else if (nSubrs < 33900)
      bias = 1131;
    else
      bias = 32768;
    obj.Bias = bias;
    obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++)
      obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  };
  Typr.CFF.tableSE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0];
  Typr.CFF.glyphByUnicode = function(cff, code) {
    for (var i = 0; i < cff.charset.length; i++)
      if (cff.charset[i] == code)
        return i;
    return -1;
  };
  Typr.CFF.glyphBySE = function(cff, charcode) {
    if (charcode < 0 || charcode > 255)
      return -1;
    return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  };
  Typr.CFF.readEncoding = function(data, offset, num) {
    Typr._bin;
    var array = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      var nCodes = data[offset];
      offset++;
      for (var i = 0; i < nCodes; i++)
        array.push(data[offset + i]);
    } else
      throw "error: unknown encoding format: " + format;
    return array;
  };
  Typr.CFF.readCharset = function(data, offset, num) {
    var bin = Typr._bin;
    var charset = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format == 1 || format == 2) {
      while (charset.length < num) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        if (format == 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (var i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else
      throw "error: format: " + format;
    return charset;
  };
  Typr.CFF.readIndex = function(data, offset, inds) {
    var bin = Typr._bin;
    var count = bin.readUshort(data, offset);
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1)
      for (var i = 0; i < count + 1; i++)
        inds.push(data[offset + i]);
    else if (offsize == 2)
      for (var i = 0; i < count + 1; i++)
        inds.push(bin.readUshort(data, offset + i * 2));
    else if (offsize == 3)
      for (var i = 0; i < count + 1; i++)
        inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
    else if (count != 0)
      throw "unsupported offset size: " + offsize + ", count: " + count;
    offset += (count + 1) * offsize;
    return offset - 1;
  };
  Typr.CFF.getCharString = function(data, offset, o) {
    var bin = Typr._bin;
    var b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2];
    data[offset + 3];
    data[offset + 4];
    var vs = 1;
    var op = null, val = null;
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }
    o.val = val != null ? val : "o" + op;
    o.size = vs;
  };
  Typr.CFF.readCharString = function(data, offset, length) {
    var end = offset + length;
    var bin = Typr._bin;
    var arr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var op = null, val = null;
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 == 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 == 19 || b0 == 20) {
        op = b0;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
      }
      arr.push(val != null ? val : "o" + op);
      offset += vs;
    }
    return arr;
  };
  Typr.CFF.readDict = function(data, offset, end) {
    var bin = Typr._bin;
    var dict = {};
    var carr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var key2 = null, val = null;
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 == 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
        throw "unknown number";
      }
      if (b0 == 30) {
        var nibs = [];
        vs = 1;
        while (true) {
          var b = data[offset + vs];
          vs++;
          var nib0 = b >> 4, nib1 = b & 15;
          if (nib0 != 15)
            nibs.push(nib0);
          if (nib1 != 15)
            nibs.push(nib1);
          if (nib1 == 15)
            break;
        }
        var s = "";
        var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
        for (var i = 0; i < nibs.length; i++)
          s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        var keys = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"];
        key2 = keys[b0];
        vs = 1;
        if (b0 == 12) {
          var keys = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"];
          key2 = keys[b1];
          vs = 2;
        }
      }
      if (key2 != null) {
        dict[key2] = carr.length == 1 ? carr[0] : carr;
        carr = [];
      } else
        carr.push(val);
      offset += vs;
    }
    return dict;
  };
  Typr.cmap = {};
  Typr.cmap.parse = function(data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID;
      var tind = offs.indexOf(noffset);
      if (tind == -1) {
        tind = obj.tables.length;
        var subt;
        offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        if (format == 0)
          subt = Typr.cmap.parse0(data, noffset);
        else if (format == 4)
          subt = Typr.cmap.parse4(data, noffset);
        else if (format == 6)
          subt = Typr.cmap.parse6(data, noffset);
        else if (format == 12)
          subt = Typr.cmap.parse12(data, noffset);
        else
          console.log("unknown format: " + format, platformID, encodingID, noffset);
        obj.tables.push(subt);
      }
      if (obj[id] != null)
        throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  };
  Typr.cmap.parse0 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++)
      obj.map.push(data[offset + i]);
    return obj;
  };
  Typr.cmap.parse4 = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset);
    offset += 2;
    obj.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    obj.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    obj.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
      obj.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse6 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.firstCode = bin.readUshort(data, offset);
    offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse12 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    offset += 2;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + i * 12;
      var startCharCode = bin.readUint(data, off + 0);
      var endCharCode = bin.readUint(data, off + 4);
      var startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
  };
  Typr.glyf = {};
  Typr.glyf.parse = function(data, offset, length, font) {
    var obj = [];
    for (var g = 0; g < font.maxp.numGlyphs; g++)
      obj.push(null);
    return obj;
  };
  Typr.glyf._parseGlyf = function(font, g) {
    var bin = Typr._bin;
    var data = font._data;
    var offset = Typr._tabOffset(data, "glyf") + font.loca[g];
    if (font.loca[g] == font.loca[g + 1])
      return null;
    var gl = {};
    gl.noc = bin.readShort(data, offset);
    offset += 2;
    gl.xMin = bin.readShort(data, offset);
    offset += 2;
    gl.yMin = bin.readShort(data, offset);
    offset += 2;
    gl.xMax = bin.readShort(data, offset);
    offset += 2;
    gl.yMax = bin.readShort(data, offset);
    offset += 2;
    if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
      return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++) {
        gl.endPts.push(bin.readUshort(data, offset));
        offset += 2;
      }
      var instructionLength = bin.readUshort(data, offset);
      offset += 2;
      if (data.length - offset < instructionLength)
        return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength);
      offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (var i = 0; i < crdnum; i++) {
        var flag = data[offset];
        offset++;
        gl.flags.push(flag);
        if ((flag & 8) != 0) {
          var rep = data[offset];
          offset++;
          for (var j = 0; j < rep; j++) {
            gl.flags.push(flag);
            i++;
          }
        }
      }
      gl.xs = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
        if (i8) {
          gl.xs.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.xs.push(0);
          else {
            gl.xs.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      gl.ys = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
        if (i8) {
          gl.ys.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.ys.push(0);
          else {
            gl.ys.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      var x = 0, y = 0;
      for (var i = 0; i < crdnum; i++) {
        x += gl.xs[i];
        y += gl.ys[i];
        gl.xs[i] = x;
        gl.ys[i] = y;
      }
    } else {
      var ARG_1_AND_2_ARE_WORDS = 1 << 0;
      var ARGS_ARE_XY_VALUES = 1 << 1;
      var WE_HAVE_A_SCALE = 1 << 3;
      var MORE_COMPONENTS = 1 << 5;
      var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
      var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
      var WE_HAVE_INSTRUCTIONS = 1 << 8;
      gl.parts = [];
      var flags;
      do {
        flags = bin.readUshort(data, offset);
        offset += 2;
        var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
        gl.parts.push(part);
        part.glyphIndex = bin.readUshort(data, offset);
        offset += 2;
        if (flags & ARG_1_AND_2_ARE_WORDS) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          var arg1 = bin.readInt8(data, offset);
          offset++;
          var arg2 = bin.readInt8(data, offset);
          offset++;
        }
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1;
          part.m.ty = arg2;
        } else {
          part.p1 = arg1;
          part.p2 = arg2;
        }
        if (flags & WE_HAVE_A_SCALE) {
          part.m.a = part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.b = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.c = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        }
      } while (flags & MORE_COMPONENTS);
      if (flags & WE_HAVE_INSTRUCTIONS) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2;
        gl.instr = [];
        for (var i = 0; i < numInstr; i++) {
          gl.instr.push(data[offset]);
          offset++;
        }
      }
    }
    return gl;
  };
  Typr.GPOS = {};
  Typr.GPOS.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  };
  Typr.GPOS.subt = function(data, ltype, offset) {
    if (ltype != 2)
      return null;
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.format = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    tab.valFmt1 = bin.readUshort(data, offset);
    offset += 2;
    tab.valFmt2 = bin.readUshort(data, offset);
    offset += 2;
    var ones1 = Typr._lctf.numOfOnes(tab.valFmt1);
    var ones2 = Typr._lctf.numOfOnes(tab.valFmt2);
    if (tab.format == 1) {
      tab.pairsets = [];
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        var psoff = bin.readUshort(data, offset);
        offset += 2;
        psoff += offset0;
        var pvcount = bin.readUshort(data, psoff);
        psoff += 2;
        var arr = [];
        for (var j = 0; j < pvcount; j++) {
          var gid2 = bin.readUshort(data, psoff);
          psoff += 2;
          var value1, value2;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt1);
            psoff += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt2);
            psoff += ones2 * 2;
          }
          arr.push({ gid2, val1: value1, val2: value2 });
        }
        tab.pairsets.push(arr);
      }
    }
    if (tab.format == 2) {
      var classDef1 = bin.readUshort(data, offset);
      offset += 2;
      var classDef2 = bin.readUshort(data, offset);
      offset += 2;
      var class1Count = bin.readUshort(data, offset);
      offset += 2;
      var class2Count = bin.readUshort(data, offset);
      offset += 2;
      tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
      tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
      tab.matrix = [];
      for (var i = 0; i < class1Count; i++) {
        var row = [];
        for (var j = 0; j < class2Count; j++) {
          var value1 = null, value2 = null;
          if (tab.valFmt1 != 0) {
            value1 = Typr._lctf.readValueRecord(data, offset, tab.valFmt1);
            offset += ones1 * 2;
          }
          if (tab.valFmt2 != 0) {
            value2 = Typr._lctf.readValueRecord(data, offset, tab.valFmt2);
            offset += ones2 * 2;
          }
          row.push({ val1: value1, val2: value2 });
        }
        tab.matrix.push(row);
      }
    }
    return tab;
  };
  Typr.GSUB = {};
  Typr.GSUB.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  };
  Typr.GSUB.subt = function(data, ltype, offset) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    if (ltype != 1 && ltype != 4 && ltype != 5)
      return null;
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2;
    tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    if (ltype == 1) {
      if (tab.fmt == 1) {
        tab.delta = bin.readShort(data, offset);
        offset += 2;
      } else if (tab.fmt == 2) {
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.newg = bin.readUshorts(data, offset, cnt);
        offset += tab.newg.length * 2;
      }
    } else if (ltype == 4) {
      tab.vals = [];
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2;
        tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (ltype == 5) {
      if (tab.fmt == 2) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2;
        tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2;
          tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      } else
        console.log("unknown table format", tab.fmt);
    }
    return tab;
  };
  Typr.GSUB.readSubClassSet = function(data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [];
    var cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readSubClassRule = function(data, offset) {
    var rUs = Typr._bin.readUshort, rule2 = {};
    var gcount = rUs(data, offset);
    offset += 2;
    var scount = rUs(data, offset);
    offset += 2;
    rule2.input = [];
    for (var i = 0; i < gcount - 1; i++) {
      rule2.input.push(rUs(data, offset));
      offset += 2;
    }
    rule2.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
    return rule2;
  };
  Typr.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
    var rUs = Typr._bin.readUshort;
    var out = [];
    for (var i = 0; i < cnt; i++) {
      out.push(rUs(data, offset), rUs(data, offset + 2));
      offset += 4;
    }
    return out;
  };
  Typr.GSUB.readChainSubClassSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readChainSubClassRule = function(data, offset) {
    var bin = Typr._bin, rule2 = {};
    var pps = ["backtrack", "input", "lookahead"];
    for (var pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      if (pi == 1)
        cnt--;
      rule2[pps[pi]] = bin.readUshorts(data, offset, cnt);
      offset += rule2[pps[pi]].length * 2;
    }
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    rule2.subst = bin.readUshorts(data, offset, cnt * 2);
    offset += rule2.subst.length * 2;
    return rule2;
  };
  Typr.GSUB.readLigatureSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readLigature = function(data, offset) {
    var bin = Typr._bin, lig = { chain: [] };
    lig.nglyph = bin.readUshort(data, offset);
    offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
      lig.chain.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return lig;
  };
  Typr.head = {};
  Typr.head.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    obj.flags = bin.readUshort(data, offset);
    offset += 2;
    obj.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    obj.created = bin.readUint64(data, offset);
    offset += 8;
    obj.modified = bin.readUint64(data, offset);
    offset += 8;
    obj.xMin = bin.readShort(data, offset);
    offset += 2;
    obj.yMin = bin.readShort(data, offset);
    offset += 2;
    obj.xMax = bin.readShort(data, offset);
    offset += 2;
    obj.yMax = bin.readShort(data, offset);
    offset += 2;
    obj.macStyle = bin.readUshort(data, offset);
    offset += 2;
    obj.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    obj.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    obj.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    obj.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hhea = {};
  Typr.hhea.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.ascender = bin.readShort(data, offset);
    offset += 2;
    obj.descender = bin.readShort(data, offset);
    offset += 2;
    obj.lineGap = bin.readShort(data, offset);
    offset += 2;
    obj.advanceWidthMax = bin.readUshort(data, offset);
    offset += 2;
    obj.minLeftSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.minRightSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.xMaxExtent = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRise = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRun = bin.readShort(data, offset);
    offset += 2;
    obj.caretOffset = bin.readShort(data, offset);
    offset += 2;
    offset += 4 * 2;
    obj.metricDataFormat = bin.readShort(data, offset);
    offset += 2;
    obj.numberOfHMetrics = bin.readUshort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hmtx = {};
  Typr.hmtx.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = bin.readUshort(data, offset);
        offset += 2;
        lsb = bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  };
  Typr.kern = {};
  Typr.kern.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var version = bin.readUshort(data, offset);
    offset += 2;
    if (version == 1)
      return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.parseV1 = function(data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset);
    offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      bin.readUint(data, offset);
      offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.readFormat0 = function(data, offset, map) {
    var bin = Typr._bin;
    var pleft = -1;
    var nPairs = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < nPairs; j++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2;
      if (left != pleft) {
        map.glyph1.push(left);
        map.rval.push({ glyph2: [], vals: [] });
      }
      var rval = map.rval[map.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  };
  Typr.loca = {};
  Typr.loca.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (ver == 1)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  };
  Typr.maxp = {};
  Typr.maxp.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    var ver = bin.readUint(data, offset);
    offset += 4;
    obj.numGlyphs = bin.readUshort(data, offset);
    offset += 2;
    if (ver == 65536) {
      obj.maxPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositePoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositeContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxZones = bin.readUshort(data, offset);
      offset += 2;
      obj.maxTwilightPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStorage = bin.readUshort(data, offset);
      offset += 2;
      obj.maxFunctionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxInstructionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStackElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxSizeOfInstructions = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentDepth = bin.readUshort(data, offset);
      offset += 2;
    }
    return obj;
  };
  Typr.name = {};
  Typr.name.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var plat = "p" + platformID;
      if (obj[plat] == null)
        obj[plat] = {};
      var names = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"];
      var cname = names[nameID];
      var soff = offset0 + count * 12 + noffset;
      var str;
      if (platformID == 0)
        str = bin.readUnicode(data, soff, length / 2);
      else if (platformID == 3 && encodingID == 0)
        str = bin.readUnicode(data, soff, length / 2);
      else if (encodingID == 0)
        str = bin.readASCII(data, soff, length);
      else if (encodingID == 1)
        str = bin.readUnicode(data, soff, length / 2);
      else if (encodingID == 3)
        str = bin.readUnicode(data, soff, length / 2);
      else if (platformID == 1) {
        str = bin.readASCII(data, soff, length);
        console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
      } else
        throw "unknown encoding " + encodingID + ", platformID: " + platformID;
      obj[plat][cname] = str;
      obj[plat]._lang = languageID;
    }
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 1033)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 3084)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null)
        return obj[p];
    var tname;
    for (var p in obj) {
      tname = p;
      break;
    }
    console.log("returning name table with languageID " + obj[tname]._lang);
    return obj[tname];
  };
  Typr["OS/2"] = {};
  Typr["OS/2"].parse = function(data, offset, length) {
    var bin = Typr._bin;
    var ver = bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0)
      Typr["OS/2"].version0(data, offset, obj);
    else if (ver == 1)
      Typr["OS/2"].version1(data, offset, obj);
    else if (ver == 2 || ver == 3 || ver == 4)
      Typr["OS/2"].version2(data, offset, obj);
    else if (ver == 5)
      Typr["OS/2"].version5(data, offset, obj);
    else
      throw "unknown OS/2 table version: " + ver;
    return obj;
  };
  Typr["OS/2"].version0 = function(data, offset, obj) {
    var bin = Typr._bin;
    obj.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    obj.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    obj.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    obj.fsType = bin.readUshort(data, offset);
    offset += 2;
    obj.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    obj.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    obj.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
    offset += 4;
    obj.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    obj.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    obj.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    obj.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version1 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version0(data, offset, obj);
    obj.ulCodePageRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = bin.readUint(data, offset);
    offset += 4;
    return offset;
  };
  Typr["OS/2"].version2 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version1(data, offset, obj);
    obj.sxHeight = bin.readShort(data, offset);
    offset += 2;
    obj.sCapHeight = bin.readShort(data, offset);
    offset += 2;
    obj.usDefault = bin.readUshort(data, offset);
    offset += 2;
    obj.usBreak = bin.readUshort(data, offset);
    offset += 2;
    obj.usMaxContext = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version5 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version2(data, offset, obj);
    obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr.post = {};
  Typr.post.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    obj.version = bin.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = bin.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = bin.readShort(data, offset);
    offset += 2;
    obj.underlineThickness = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.SVG = {};
  Typr.SVG.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = { entries: [] };
    var offset0 = offset;
    bin.readUshort(data, offset);
    offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      var svg2 = bin.readUTF8(sbuf, 0, sbuf.length);
      for (var f = startGlyphID; f <= endGlyphID; f++) {
        obj.entries[f] = svg2;
      }
    }
    return obj;
  };
  Typr.SVG.toPath = function(str) {
    var pth = { cmds: [], crds: [] };
    if (str == null)
      return pth;
    var prsr = new DOMParser();
    var doc = prsr["parseFromString"](str, "image/svg+xml");
    var svg2 = doc.firstChild;
    while (svg2.tagName != "svg")
      svg2 = svg2.nextSibling;
    var vb = svg2.getAttribute("viewBox");
    if (vb)
      vb = vb.trim().split(" ").map(parseFloat);
    else
      vb = [0, 0, 1e3, 1e3];
    Typr.SVG._toPath(svg2.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y = pth.crds[i + 1];
      x -= vb[0];
      y -= vb[1];
      y = -y;
      pth.crds[i] = x;
      pth.crds[i + 1] = y;
    }
    return pth;
  };
  Typr.SVG._toPath = function(nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName;
      var cfl = nd.getAttribute("fill");
      if (cfl == null)
        cfl = fill;
      if (tn == "g")
        Typr.SVG._toPath(nd.children, pth, cfl);
      else if (tn == "path") {
        pth.cmds.push(cfl ? cfl : "#000000");
        var d = nd.getAttribute("d");
        var toks = Typr.SVG._tokens(d);
        Typr.SVG._toksToPath(toks, pth);
        pth.cmds.push("X");
      } else if (tn == "defs")
        ;
      else
        console.log(tn, nd);
    }
  };
  Typr.SVG._tokens = function(d) {
    var ts = [], off = 0, rn = false, cn = "";
    while (off < d.length) {
      var cc = d.charCodeAt(off), ch = d.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
      if (rn) {
        if (ch == "-") {
          ts.push(parseFloat(cn));
          cn = ch;
        } else if (isNum)
          cn += ch;
        else {
          ts.push(parseFloat(cn));
          if (ch != "," && ch != " ")
            ts.push(ch);
          rn = false;
        }
      } else {
        if (isNum) {
          cn = ch;
          rn = true;
        } else if (ch != "," && ch != " ")
          ts.push(ch);
      }
    }
    if (rn)
      ts.push(parseFloat(cn));
    return ts;
  };
  Typr.SVG._toksToPath = function(ts, pth) {
    var i = 0, x = 0, y = 0, ox = 0, oy = 0;
    var pc = { M: 2, L: 2, H: 1, V: 1, S: 4, C: 6 };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
      var cmd = ts[i];
      i++;
      if (cmd == "z") {
        cmds.push("Z");
        x = ox;
        y = oy;
      } else {
        var cmu = cmd.toUpperCase();
        var ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps);
        for (var j = 0; j < reps; j++) {
          var xi = 0, yi = 0;
          if (cmd != cmu) {
            xi = x;
            yi = y;
          }
          if (cmu == "M") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("M");
            crds.push(x, y);
            ox = x;
            oy = y;
          } else if (cmu == "L") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "H") {
            x = xi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "V") {
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "C") {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else if (cmu == "S") {
            var co = Math.max(crds.length - 4, 0);
            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
            var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else
            console.log("Unknown SVG command " + cmd);
        }
      }
    }
  };
  Typr.SVG._reps = function(ts, off, ps) {
    var i = off;
    while (i < ts.length) {
      if (typeof ts[i] == "string")
        break;
      i += ps;
    }
    return (i - off) / ps;
  };
  if (Typr == null)
    Typr = {};
  if (Typr.U == null)
    Typr.U = {};
  Typr.U.codeToGlyph = function(font, code) {
    var cmap = font.cmap;
    var tind = -1;
    if (cmap.p0e4 != null)
      tind = cmap.p0e4;
    else if (cmap.p3e1 != null)
      tind = cmap.p3e1;
    else if (cmap.p1e0 != null)
      tind = cmap.p1e0;
    if (tind == -1)
      throw "no familiar platform and encoding!";
    var tab = cmap.tables[tind];
    if (tab.format == 0) {
      if (code >= tab.map.length)
        return 0;
      return tab.map[code];
    } else if (tab.format == 4) {
      var sind = -1;
      for (var i = 0; i < tab.endCount.length; i++)
        if (code <= tab.endCount[i]) {
          sind = i;
          break;
        }
      if (sind == -1)
        return 0;
      if (tab.startCount[sind] > code)
        return 0;
      var gli = 0;
      if (tab.idRangeOffset[sind] != 0)
        gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
      else
        gli = code + tab.idDelta[sind];
      return gli & 65535;
    } else if (tab.format == 12) {
      if (code > tab.groups[tab.groups.length - 1][1])
        return 0;
      for (var i = 0; i < tab.groups.length; i++) {
        var grp = tab.groups[i];
        if (grp[0] <= code && code <= grp[1])
          return grp[2] + (code - grp[0]);
      }
      return 0;
    } else
      throw "unknown cmap table format " + tab.format;
  };
  Typr.U.glyphToPath = function(font, gid) {
    var path = { cmds: [], crds: [] };
    if (font.SVG && font.SVG.entries[gid]) {
      var p = font.SVG.entries[gid];
      if (p == null)
        return path;
      if (typeof p == "string") {
        p = Typr.SVG.toPath(p);
        font.SVG.entries[gid] = p;
      }
      return p;
    } else if (font.CFF) {
      var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state, font.CFF, path);
    } else if (font.glyf) {
      Typr.U._drawGlyf(gid, font, path);
    }
    return path;
  };
  Typr.U._drawGlyf = function(gid, font, path) {
    var gl = font.glyf[gid];
    if (gl == null)
      gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1)
        Typr.U._simpleGlyph(gl, path);
      else
        Typr.U._compoGlyph(gl, font, path);
    }
  };
  Typr.U._simpleGlyph = function(gl, p) {
    for (var c = 0; c < gl.noc; c++) {
      var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
      var il = gl.endPts[c];
      for (var i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1;
        var nx = i == il ? i0 : i + 1;
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;
        var x = gl.xs[i], y = gl.ys[i];
        if (i == i0) {
          if (onCurve) {
            if (prOnCurve)
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            else {
              Typr.U.P.moveTo(p, x, y);
              continue;
            }
          } else {
            if (prOnCurve)
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            else
              Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
          }
        }
        if (onCurve) {
          if (prOnCurve)
            Typr.U.P.lineTo(p, x, y);
        } else {
          if (nxOnCurve)
            Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
          else
            Typr.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
        }
      }
      Typr.U.P.closePath(p);
    }
  };
  Typr.U._compoGlyph = function(gl, font, p) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = { cmds: [], crds: [] };
      var prt = gl.parts[j];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      var m = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p.crds.push(x * m.a + y * m.b + m.tx);
        p.crds.push(x * m.c + y * m.d + m.ty);
      }
      for (var i = 0; i < path.cmds.length; i++)
        p.cmds.push(path.cmds[i]);
    }
  };
  Typr.U._getGlyphClass = function(g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return intr == -1 ? 0 : cd[intr + 2];
  };
  Typr.U.getPairAdjustment = function(font, g1, g2) {
    if (font.GPOS) {
      var ltab = null;
      for (var i = 0; i < font.GPOS.featureList.length; i++) {
        var fl = font.GPOS.featureList[i];
        if (fl.tag == "kern") {
          for (var j = 0; j < fl.tab.length; j++)
            if (font.GPOS.lookupList[fl.tab[j]].ltype == 2)
              ltab = font.GPOS.lookupList[fl.tab[j]];
        }
      }
      if (ltab) {
        for (var i = 0; i < ltab.tabs.length; i++) {
          var tab = ltab.tabs[i];
          var ind = Typr._lctf.coverageIndex(tab.coverage, g1);
          if (ind == -1)
            continue;
          var adj;
          if (tab.format == 1) {
            var right = tab.pairsets[ind];
            for (var j = 0; j < right.length; j++)
              if (right[j].gid2 == g2)
                adj = right[j];
            if (adj == null)
              continue;
          } else if (tab.format == 2) {
            var c1 = Typr.U._getGlyphClass(g1, tab.classDef1);
            var c2 = Typr.U._getGlyphClass(g2, tab.classDef2);
            var adj = tab.matrix[c1][c2];
          }
          return adj.val1[2];
        }
      }
    }
    if (font.kern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (ind1 != -1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (ind2 != -1)
          return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  };
  Typr.U.stringToGlyphs = function(font, str) {
    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc > 65535)
        i++;
      gls.push(Typr.U.codeToGlyph(font, cc));
    }
    var gsub = font["GSUB"];
    if (gsub == null)
      return gls;
    var llist = gsub.lookupList, flist = gsub.featureList;
    var wsep = '\n	" ,.:;!?()  ،';
    var R = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
    var L = "ꡲ્૗";
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
      var srgt = ci == gls.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
      if (!slft && R.indexOf(str[ci - 1]) != -1)
        slft = true;
      if (!srgt && R.indexOf(str[ci]) != -1)
        srgt = true;
      if (!srgt && L.indexOf(str[ci + 1]) != -1)
        srgt = true;
      if (!slft && L.indexOf(str[ci]) != -1)
        slft = true;
      var feat = null;
      if (slft)
        feat = srgt ? "isol" : "init";
      else
        feat = srgt ? "fina" : "medi";
      for (var fi = 0; fi < flist.length; fi++) {
        if (flist[fi].tag != feat)
          continue;
        for (var ti = 0; ti < flist[fi].tab.length; ti++) {
          var tab = llist[flist[fi].tab[ti]];
          if (tab.ltype != 1)
            continue;
          Typr.U._applyType1(gls, ci, tab);
        }
      }
    }
    var cligs = ["rlig", "liga", "mset"];
    for (var ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci];
      var rlim = Math.min(3, gls.length - ci - 1);
      for (var fi = 0; fi < flist.length; fi++) {
        var fl = flist[fi];
        if (cligs.indexOf(fl.tag) == -1)
          continue;
        for (var ti = 0; ti < fl.tab.length; ti++) {
          var tab = llist[fl.tab[ti]];
          for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null)
              continue;
            var ind = Typr._lctf.coverageIndex(tab.tabs[j].coverage, gl);
            if (ind == -1)
              continue;
            if (tab.ltype == 4) {
              var vals = tab.tabs[j].vals[ind];
              for (var k = 0; k < vals.length; k++) {
                var lig = vals[k], rl = lig.chain.length;
                if (rl > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < rl; l++)
                  if (lig.chain[l] != gls[ci + (1 + l)])
                    good = false;
                if (!good)
                  continue;
                gls[ci] = lig.nglyph;
                for (var l = 0; l < rl; l++)
                  gls[ci + l + 1] = -1;
              }
            } else if (tab.ltype == 5) {
              var ltab = tab.tabs[j];
              if (ltab.fmt != 2)
                continue;
              var cind = Typr._lctf.getInterval(ltab.cDef, gl);
              var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
              for (var i = 0; i < scs.length; i++) {
                var sc = scs[i], inp = sc.input;
                if (inp.length > rlim)
                  continue;
                var good = true;
                for (var l = 0; l < inp.length; l++) {
                  var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                  if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                    good = false;
                    break;
                  }
                }
                if (!good)
                  continue;
                var lrs = sc.substLookupRecords;
                for (var k = 0; k < lrs.length; k += 2) {
                  lrs[k];
                  lrs[k + 1];
                }
              }
            }
          }
        }
      }
    }
    return gls;
  };
  Typr.U._applyType1 = function(gls, ci, tab) {
    var gl = gls[ci];
    for (var j = 0; j < tab.tabs.length; j++) {
      var ttab = tab.tabs[j];
      var ind = Typr._lctf.coverageIndex(ttab.coverage, gl);
      if (ind == -1)
        continue;
      if (ttab.fmt == 1)
        gls[ci] = gls[ci] + ttab.delta;
      else
        gls[ci] = ttab.newg[ind];
    }
  };
  Typr.U.glyphsToPath = function(font, gls, clr) {
    var tpath = { cmds: [], crds: [] };
    var x = 0;
    for (var i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (gid == -1)
        continue;
      var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
      var path = Typr.U.glyphToPath(font, gid);
      for (var j = 0; j < path.crds.length; j += 2) {
        tpath.crds.push(path.crds[j] + x);
        tpath.crds.push(path.crds[j + 1]);
      }
      if (clr)
        tpath.cmds.push(clr);
      for (var j = 0; j < path.cmds.length; j++)
        tpath.cmds.push(path.cmds[j]);
      if (clr)
        tpath.cmds.push("X");
      x += font.hmtx.aWidth[gid];
      if (i < gls.length - 1)
        x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
    return tpath;
  };
  Typr.U.pathToSVG = function(path, prec) {
    if (prec == null)
      prec = 5;
    var out = [], co = 0, lmap = { M: 2, L: 2, Q: 4, C: 6 };
    for (var i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      out.push(cmd);
      while (co < cn) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  };
  Typr.U.pathToContext = function(path, ctx) {
    var c = 0, crds = path.crds;
    for (var j = 0; j < path.cmds.length; j++) {
      var cmd = path.cmds[j];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      } else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      } else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      } else if (cmd == "Z") {
        ctx.closePath();
      } else if (cmd == "X") {
        ctx.fill();
      }
    }
  };
  Typr.U.P = {};
  Typr.U.P.moveTo = function(p, x, y) {
    p.cmds.push("M");
    p.crds.push(x, y);
  };
  Typr.U.P.lineTo = function(p, x, y) {
    p.cmds.push("L");
    p.crds.push(x, y);
  };
  Typr.U.P.curveTo = function(p, a, b, c, d, e, f) {
    p.cmds.push("C");
    p.crds.push(a, b, c, d, e, f);
  };
  Typr.U.P.qcurveTo = function(p, a, b, c, d) {
    p.cmds.push("Q");
    p.crds.push(a, b, c, d);
  };
  Typr.U.P.closePath = function(p) {
    p.cmds.push("Z");
  };
  Typr.U._drawCFF = function(cmds, state, font, p) {
    var stack = state.stack;
    var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
    var i = 0;
    var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var o = { val: 0, size: 0 };
    while (i < cmds.length) {
      Typr.CFF.getCharString(cmds, i, o);
      var v = o.val;
      i += o.size;
      if (v == "o1" || v == "o18") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o3" || v == "o23") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        if (open)
          Typr.U.P.closePath(p);
        y += stack.pop();
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o6" || v == "o7") {
        var count = stack.length;
        var isX = v == "o6";
        for (var j = 0; j < count; j++) {
          var sval = stack.shift();
          if (isX)
            x += sval;
          else
            y += sval;
          isX = !isX;
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o8" || v == "o24") {
        var count = stack.length;
        var index = 0;
        while (index + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 6;
        }
        if (v == "o24") {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o11")
        break;
      else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
        if (v == "o1234") {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = y;
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1235") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          y = c4y + stack.shift();
          stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1236") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1237") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
            x = c4x + stack.shift();
          } else {
            y = c4y + stack.shift();
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
      } else if (v == "o14") {
        if (stack.length > 0 && !haveWidth) {
          width = stack.shift() + font.nominalWidthX;
          haveWidth = true;
        }
        if (stack.length == 4) {
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();
          var bind = Typr.CFF.glyphBySE(font, bchar);
          var aind = Typr.CFF.glyphBySE(font, achar);
          Typr.U._drawCFF(font.CharStrings[bind], state, font, p);
          state.x = adx;
          state.y = ady;
          Typr.U._drawCFF(font.CharStrings[aind], state, font, p);
        }
        if (open) {
          Typr.U.P.closePath(p);
          open = false;
        }
      } else if (v == "o19" || v == "o20") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
        i += nStems + 7 >> 3;
      } else if (v == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        y += stack.pop();
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + font.Private.nominalWidthX;
          haveWidth = true;
        }
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
      } else if (v == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o27") {
        if (stack.length % 2) {
          y += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y;
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o10" || v == "o29") {
        var obj = v == "o10" ? font.Private : font;
        if (stack.length == 0) {
          console.log("error: empty stack");
        } else {
          var ind = stack.pop();
          var subr = obj.Subrs[ind + obj.Bias];
          state.x = x;
          state.y = y;
          state.nStems = nStems;
          state.haveWidth = haveWidth;
          state.width = width;
          state.open = open;
          Typr.U._drawCFF(subr, state, font, p);
          x = state.x;
          y = state.y;
          nStems = state.nStems;
          haveWidth = state.haveWidth;
          width = state.width;
          open = state.open;
        }
      } else if (v == "o30" || v == "o31") {
        var count, count1 = stack.length;
        var index = 0;
        var alternate = v == "o31";
        count = count1 & ~2;
        index += count1 - count;
        while (index < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count - index == 5) {
              x = c2x + stack.shift();
              index++;
            } else
              x = c2x;
            alternate = false;
          } else {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index == 5) {
              y = c2y + stack.shift();
              index++;
            } else
              y = c2y;
            alternate = true;
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 4;
        }
      } else if ((v + "").charAt(0) == "o") {
        console.log("Unknown operation: " + v, cmds);
        throw v;
      } else
        stack.push(v);
    }
    state.x = x;
    state.y = y;
    state.nStems = nStems;
    state.haveWidth = haveWidth;
    state.width = width;
    state.open = open;
  };
  var typr_js = Typr;
  const Typr$1 = /* @__PURE__ */ getDefaultExportFromCjs(typr_js);
  const decode = () => {
    var _a;
    const styleElements = _unsafeWindow.document.querySelectorAll("style");
    let tipElement = null;
    styleElements.forEach((styleElement) => {
      var _a2;
      if (((_a2 = styleElement.textContent) == null ? void 0 : _a2.indexOf("font-cxsecret")) !== -1) {
        tipElement = styleElement;
      }
    });
    if (!tipElement)
      return;
    const fontMatch = (_a = tipElement.textContent) == null ? void 0 : _a.match(/base64,([\w\W]+?)'/);
    if (!fontMatch)
      return;
    const fontData = base64ToUint8Array(fontMatch[1]);
    const font = Typr$1.parse(fontData);
    const table = JSON.parse(_GM_getResourceText("ttf"));
    let text2 = {};
    for (let i = 19968; i < 40870; i++) {
      let t = Typr$1.U.codeToGlyph(font, i);
      if (!t)
        continue;
      t = Typr$1.U.glyphToPath(font, t);
      t = md5Exports.md5(JSON.stringify(t)).slice(24);
      text2[i] = table[t];
    }
    const fontElements = _unsafeWindow.document.querySelectorAll(".font-cxsecret");
    fontElements.forEach((fontElement) => {
      let html2 = fontElement.innerHTML;
      Object.keys(text2).forEach((key2) => {
        const regex = new RegExp(String.fromCharCode(key2), "g");
        html2 = html2.replace(regex, String.fromCharCode(text2[key2]));
      });
      fontElement.innerHTML = html2;
      fontElement.classList.remove("font-cxsecret");
    });
  };
  const base64ToUint8Array = (base64) => {
    const decodedData = atob(base64);
    const array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      array[i] = decodedData.charCodeAt(i);
    }
    return array;
  };
  const chaoxing = [
    {
      type: "save",
      name: "学习通作业收录旧",
      match: () => location.href.includes("work/view") || location.href.includes("test/reVersionPaperMarkContentNew"),
      question: {
        html: ".questionLi",
        question: "h3.mark_name",
        options: "ul.mark_letter.colorDeep > li",
        type: ".colorShallow",
        workType: "zj",
        pageType: "cx"
      },
      answerHook: (item) => {
        let quesType = removeHtml1($(item.html).find('span[class="colorShallow"]').html());
        if (quesType === "") {
          return null;
        }
        let matchResult = quesType.match(/^\((.+?)\)/);
        if (matchResult !== null) {
          item.type = matchResult[1].split(",")[0];
        } else {
          return null;
        }
        item.question = item.question.split(quesType)[1].trim();
        item.options = removeStartChar(item.options);
        let isT = $(item.html).find(".marking_dui").length > 0;
        let answer;
        switch (item.type) {
          case "单选题":
          case "多选题":
            item.type = item.type === "单选题" ? "0" : "1";
            item.answer = $(item.html).find(".mark_answer>div>span.colorGreen:eq(0)").text().replace("正确答案:", "").trim().split("").map((xx) => {
              return item.options[xx.charCodeAt(0) - 65];
            });
            item.answer = item.answer.filter((item2) => item2 !== "");
            if (item.answer.length === 0 && isT) {
              item.answer = $(item.html).find(".mark_answer>div>span.colorDeep:eq(0)").text().replace("我的答案:", "").trim().split("").map((xx) => {
                return item.options[xx.charCodeAt(0) - 65];
              });
              item.answer = item.answer.filter((item2) => item2 !== "");
            }
            break;
          case "判断题":
            item.type = "3";
            item.options = [];
            item.answer = $(item.html).find(".mark_answer>div>span.colorGreen:eq(0)").text().trim().split("").map((answer2) => {
              if (answer2.includes("正确") || answer2.includes("对") || answer2.includes("√")) {
                return "正确";
              } else if (answer2.includes("错误") || answer2.includes("错") || answer2.includes("×")) {
                return "错误";
              } else {
                return null;
              }
            }).filter((item2) => item2 !== null);
            item.answer = item.answer.filter((item2) => item2 !== "");
            if (item.answer.length === 0) {
              answer = removeHtml1($(item.html).find(".mark_answer>div>span.colorDeep:eq(0)").html());
              let [marking_dui, marking_cuo] = [".marking_dui", ".marking_cuo"].map((selector) => $(item.html).find(selector).length);
              if (marking_dui + marking_cuo === 0) {
                return null;
              }
              if (answer.includes("正确") || answer.includes("对") || answer.includes("√")) {
                item.answer = ["正确"];
              } else if (answer.includes("错误") || answer.includes("错") || answer.includes("×")) {
                item.answer = ["错误"];
              } else {
                return null;
              }
              if (marking_dui === 0 && marking_cuo !== 0) {
                item.answer = item.answer[0] === "正确" ? "错误" : "正确";
              }
            }
            break;
          case "简答题":
            item.type = "4";
            item.answer = removeHtml1($(item.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("正确答案：", "").trim();
            if (item.answer.length < 10) {
              return null;
            } else {
              item.answer = [item.answer];
            }
            break;
          case "填空题":
            item.type = "2";
            item.answer = $(item.html).find(".mark_answer>div>.colorGreen:eq(0)>dd").map((index, element) => {
              return removeHtml1($(element).html()).replace(`(${index + 1})`, "").trim();
            }).get();
            break;
          default:
            return null;
        }
        return item;
      }
    },
    {
      type: "save",
      name: "学习通作业收录新",
      match: () => location.href.includes("work/selectWorkQuestionYiPiYue") && location.href.includes("mooc2=1"),
      question: {
        html: ".TiMu",
        question: ".Zy_TItle .clearfix",
        options: "ul.Zy_ulTop li",
        type: ".newZy_TItle",
        workType: "zj",
        pageType: "cx"
      },
      answerHook: (item) => {
        item.type = $(item.html).find(".newZy_TItle").text().replace(/【|】/g, "").trim();
        let isT = $(item.html).find(".marking_dui").length > 0;
        removeHtml1($(item.html).find(".Py_addpy:eq(0)").html());
        let answer;
        switch (item.type) {
          case "单选题":
          case "多选题":
            item.type = item.type === "单选题" ? "0" : "1";
            item.options = $(item.html).find("ul.Zy_ulTop li").map((index, element) => {
              let inx = $(element).find("i.fl").text().trim();
              let optionText = removeHtml1($(element).html());
              if (inx === "") {
                return optionText.trim();
              }
              return optionText.split(inx)[1].trim();
            }).get();
            item.answer = $(item.html).find(".correctAnswer >.fl.answerCon").text().trim().split("").map((xx) => {
              return item.options[xx.charCodeAt(0) - 65];
            });
            if (item.answer.length === 0 && isT) {
              item.answer = $(item.html).find(".myAnswer > .fl.answerCon").text().trim().split("").map((xx) => {
                return item.options[xx.charCodeAt(0) - 65];
              });
            }
            break;
          case "判断题":
            item.type = "3";
            item.answer = $(item.html).find(".correctAnswer > .fl.answerCon").text().trim().split("").map((answer2) => {
              if (answer2.includes("正确") || answer2.includes("对") || answer2.includes("√")) {
                return "正确";
              } else if (answer2.includes("错误") || answer2.includes("错") || answer2.includes("×")) {
                return "错误";
              } else {
                return null;
              }
            }).filter((item2) => item2 !== null);
            if (item.answer.length === 0) {
              answer = removeHtml1($(item.html).find(".fl.answerCon").html());
              let [marking_dui, marking_cuo] = [".marking_dui", ".marking_cuo"].map((selector) => $(item.html).find(selector).length);
              if (marking_dui + marking_cuo === 0) {
                return null;
              }
              if (answer.includes("正确") || answer.includes("对") || answer.includes("√")) {
                item.answer = ["正确"];
              } else if (answer.includes("错误") || answer.includes("错") || answer.includes("×")) {
                item.answer = ["错误"];
              } else {
                return null;
              }
              if (marking_dui === 0 && marking_cuo !== 0) {
                item.answer = item.answer[0] === "正确" ? "错误" : "正确";
              }
            }
            break;
          case "分录题":
            item.type = "9";
            item.answer = $(item.html).find(".correctAnswerBx>.correctAnswer>p:not(.clear)").map((index, element) => {
              return removeHtml1($(element).html());
            }).get().filter((item2) => item2 !== "");
            if (item.answer.length != $(item.html).find(".CorrectOrNot").length) {
              if ($(item.html).find(".marking_cuo").length > 0) {
                return null;
              }
              item.answer = $(item.html).find(".myAnswerBx>.myAnswer>p:not(.clear)").map((index, element) => {
                return removeHtml1($(element).html());
              }).get().filter((item2) => item2 !== "");
              if (item.answer.length != $(item.html).find(".CorrectOrNot").length) {
                return null;
              }
            }
            log(item.answer, "warn");
            break;
          case "连线题":
            item.type = "11";
            let left = $(item.html).find("ul.firstUlList>li:not(.groupTitile)").map((index, element) => {
              let $clone = $(element).clone();
              $clone.find(".fl").remove();
              return removeHtml1($clone.html());
            }).get();
            let right = $(item.html).find("ul.secondUlList>li:not(.groupTitile)").map((index, element) => {
              let $clone = $(element).clone();
              $clone.find(".fl").remove();
              return removeHtml1($clone.html());
            }).get();
            answer = $(item.html).find(".correctAnswer >.fl.answerCon >.collectAnswer").map((index, element) => {
              return removeHtml1($(element).text());
            }).get();
            item.options = [left, right];
            let ans = {};
            answer.forEach((item2) => {
              let [l, r] = item2.split("-");
              if (l.charCodeAt(0) >= 65) {
                l = (l.charCodeAt(0) - 65).toString();
              } else if (/^\d+$/.test(l)) {
                l = (parseInt(l) - 1).toString();
              }
              if (r.charCodeAt(0) >= 65) {
                r = (r.charCodeAt(0) - 65).toString();
              } else if (/^\d+$/.test(r)) {
                r = (parseInt(r) - 1).toString();
              }
              ans[left[l]] = right[r];
            });
            item.answer = ans;
            log(left, right, item.answer, "warn");
            break;
          default:
            log("暂未适配当前题型", item.type, "error");
            return null;
        }
        return item;
      }
    },
    {
      type: "ask",
      name: "学习通新版作业",
      match: /\/mooc2\/work\/dowork/i.test(location.pathname),
      question: {
        html: ".questionLi",
        question: "h3",
        options: "ul:eq(0) li .after, .answer_p",
        type: "input[name^=answertype]:eq(0)",
        workType: "zy",
        pageType: "cx"
      },
      questionHook: (item) => {
        const type = removeHtml1($(item.html).find(".colorShallow").html());
        item.question = item.question.split(type)[1].trim();
        item.$options = $(item.html).find(".answerBg");
        return item;
      },
      setAnswerHook: (item) => {
        qc(item.html);
        qc1(item.html);
      }
    },
    {
      type: "ask",
      name: "学习通新版考试",
      match: /exam\/preview/i.test(location.pathname) || /exam\/test\/reVersionTestStartNew/i.test(location.pathname),
      question: {
        html: ".questionLi",
        question: "h3",
        options: "ul:eq(0) li .after, .answer_p",
        type: "input[name^=type]:not([name=type])",
        workType: "ks",
        pageType: "cx"
      },
      questionHook: (item) => {
        const type = removeHtml1($(item.html).find(".colorShallow").html());
        item.question = item.question.split(type)[1].trim();
        item.$options = $(item.html).find(".answerBg");
        return item;
      },
      setAnswerHook: (item) => {
        qc(item.html);
        qc1(item.html);
      },
      next: () => {
        $('.nextDiv .jb_btn:contains("下一题")').click();
      }
    },
    {
      type: "ask",
      name: "学习通旧版作业",
      match: /work\/doHomeWorkNew/i.test(location.pathname) && location.href.includes("mooc2=1") == false,
      init: () => {
        decode();
      },
      question: {
        html: ".TiMu",
        question: ".clearfix.fontLabel",
        options: "ul:eq(0) li .after",
        type: "input[name^=answertype]:eq(0), .answer_p",
        workType: "zy",
        pageType: "cx"
      },
      questionHook: (item) => {
        item.$options = $(item.html).find(".fl.before");
        switch (item.type) {
          case "3":
            item.options = $(item.html).find("ul:eq(0) li").map((index, element) => {
              if ($(element).find(".ri").length > 0) {
                return "正确";
              }
              if ($(element).find(".wr").length > 0) {
                return "错误";
              }
              if (isTrue($(element).attr("aria-label"))) {
                return "正确";
              }
              if (isFalse($(element).attr("aria-label"))) {
                return "错误";
              }
            }).get();
            item.$options = $(item.html).find("input[type=radio]");
            break;
          case "11":
            let left = $(item.html).find("ul.firstUlList>li:not(.groupTitile)").map((index, element) => {
              let $clone = $(element).clone();
              $clone.find(".fl").remove();
              return removeHtml1($clone.html());
            }).get();
            let right = $(item.html).find("ul.secondUlList>li:not(.groupTitile)").map((index, element) => {
              let $clone = $(element).clone();
              $clone.find(".fl").remove();
              return removeHtml1($clone.html());
            }).get();
            item.options = [left, right];
            item.$options = $(item.html).find("ul.thirdUlList>li:not(.groupTitile)");
            break;
        }
        return item;
      },
      setAnswerHook: (item) => {
        qc(item.html);
        qc1(item.html);
      },
      setAnswer: (item) => {
        log(item.ques.options, "warn");
        switch (item.type) {
          case "11":
            item.ques.$options.each((index, element) => {
              let left = item.ques.options[0];
              let right = item.ques.options[1];
              let chose = item.answer[left[index]];
              let index1 = right.indexOf(chose);
              chose = String.fromCharCode(index1 + 65);
              $(element).find("select>option").each((inx, ele) => {
                log($(ele).val() == chose, "warn");
                $(ele).val() == chose && $(ele).prop("selected", true);
              });
            });
            log(item.answer, "success");
            return false;
          default:
            return true;
        }
      }
    },
    {
      type: "ask",
      name: "学习通新版章节",
      match: /work\/doHomeWorkNew/i.test(location.pathname) && location.href.includes("mooc2=1"),
      init: () => {
        decode();
      },
      question: {
        html: ".TiMu",
        question: ".clearfix.fontLabel",
        options: "ul:eq(0) li .after, .answer_p",
        type: "input[name^=answertype]:eq(0)",
        workType: "zj",
        pageType: "cx"
      },
      questionHook: (item) => {
        switch (item.type) {
          case "3":
            item.options = $(item.html).find("ul:eq(0) li").map((index, element) => {
              if ($(element).find(".num_option").attr("data") === "true") {
                return "正确";
              }
              if ($(element).find(".num_option").attr("data") === "false") {
                return "错误";
              }
            }).get();
            break;
          case "11":
            let left = $(item.html).find("ul.firstUlList>li:not(.groupTitile)").map((index, element) => {
              let $clone = $(element).clone();
              $clone.find(".fl").remove();
              return removeHtml1($clone.html());
            }).get();
            let right = $(item.html).find("ul.secondUlList>li:not(.groupTitile)").map((index, element) => {
              let $clone = $(element).clone();
              $clone.find(".fl").remove();
              return removeHtml1($clone.html());
            }).get();
            item.options = [left, right];
            item.$options = $(item.html).find("ul.thirdUlList>li:not(.groupTitile)");
            break;
          default:
            log("暂未适配当前题型", item.type, "error");
        }
        return item;
      },
      setAnswerHook: (item) => {
        qc(item.html);
        qc1(item.html);
      },
      setAnswer: (item) => {
        log(item.ques.options, "warn");
        switch (item.type) {
          case "11":
            item.ques.$options.each((index, element) => {
              let left = item.ques.options[0];
              let right = item.ques.options[1];
              let chose = item.answer[left[index]];
              let index1 = right.indexOf(chose);
              chose = String.fromCharCode(index1 + 65);
              let $chosen = _unsafeWindow.$(element).find(".dept_select");
              $chosen.chosen().val(chose).trigger("chosen:updated");
            });
            log(item.answer, "success");
            return false;
          default:
            return true;
        }
      }
    }
  ];
  const zhsimgList = {
    "ef16b0304b00ce71fd40a6ec2ee77005": "ACDFGHIJ",
    "735b46e223cfc7bad9b86c9937c75234": "BDEFG",
    "24ec8818a8cc7ef047261e702dac5815": "ABCDEFGHIJ",
    "196888b3dcb1e1bfff5881cb653ba923": "BDEFGH",
    "b935cd024690d61b8fba0484a66108f0": "ABCDEGH",
    "2015082c8ae5776bfd6939c5b987bde8": "BEF",
    "95018628ad8e26805393ebbb913f5655": "AF",
    "9cbff65dc6a768716f51443d6086a1c3": "BDG",
    "b8f6dedb0bf830a10b66369b1c602088": "CFG",
    "1ad38a724dc5bac06ce6d1c63b0184cf": "ACDEFGI",
    "6ba30ef9d51b4c81a126ff6d17ee4fb2": "AEFHIJ",
    "78a0d910c07fde12bafafda0f23c8b31": "CEH",
    "9ae999623635bc09942f1d0eb59e6837": "BH",
    "7d6006b8e10d9dffbe1fa0570757caa7": "DH",
    "86eba22e064f8fe7223621469d91c696": "ACDF",
    "4e585ee0c6ac7c985615389285c830ef": "BCF",
    "5ff23de904db9fb6485cddb667995cd7": "ABCDEFGHI",
    "fc402dcdbd1751096532c45785acbbbe": "DF",
    "ece41fab3f00663e05f8f58eb73d24dd": "ABCDEFGH",
    "784388b61ba6bc8106194478e383908a": "CDFIJ",
    "e735470377881c422d187ce9bb7f4f24": "ACDEG",
    "6a721d0773b4945fbe8f550da3850005": "ABCDEFI",
    "cfcabe2eeaeef886169447086ac23b96": "AEG",
    "c38f5ab64c8b82df3bb66f8f9831097b": "AEF",
    "b684fb365965c6b3488eeedcae114384": "ADEF",
    "1c402ceeda5ea92b80fe8b5b5bcbdc4d": "ACF",
    "ce75bbb9a8b72f97de5a8bb03ee95df7": "J",
    "e21ba3c8d7f8bbb66e4af7a9182d87a5": "ACGI",
    "445adaca0de2f938fe7bacf8140eef36": "ABF",
    "4f14c1e0a1eccde02ee4f0a77eaa78cd": "BCEF",
    "e78e28ee7040cdf3894293cd2eeade9b": "H",
    "ee5a026e9664d3d75f0471b9bc826c98": "EF",
    "904d82937a49e762ec1fa7c53574bb39": "ADF",
    "2ee96820a6a35990bff61a607953274c": "BDDF",
    "dc13afaff7b568f31d96c0ff8b5998b8": "ABEF",
    "13c11253a2bb72c3726d318163662263": "ABCF",
    "ca8b276d3213cfda5e6406c0930dfdb5": "CDF",
    "0d38524f7ca472260864ef7b79b11591": "ABCDG",
    "0e9bfd8011be1eddfcf97102f9e21ab6": "DEF",
    "ca88100d2fd190136cdcb3ffe1648820": "DG",
    "2d8c02e62a414df727f2bd36d4231c68": "ABCFG",
    "099b9f86638886c7ca57401d4360165c": "ABCDEFG",
    "7a0a8f7222c07c8c24c4a6d201105ecc": "ACEF",
    "181f54c34d485b426b900e2c777a831c": "AEFHI",
    "993215603eb31c60f31aa261267790e8": "ABCEF",
    "fcae686eac9b3de629da73618ea6cdc0": "ABCDF",
    "8b6271d28906b0a6a765ea1c37c31ff9": "ABDF",
    "5dfd875662f18654b374acd37e6c3790": "CF",
    "e8b47f587340890e698ccb14ef1f39c4": "CDEF",
    "de2c87983e695e599c1a2f6836277a4f": "ABDEF",
    "14189c3fbb519be795b7fbe6e182debf": "A",
    "94f5aa9777f0f1fb7d53e669691d8bde": "AB",
    "3be90a70f03362711cf62e97751dfabe": "ABC",
    "b9691b2259745815096c074d5cc27514": "ABCD",
    "16374490395999a162f0652a32d13b8b": "ABCDE",
    "8b2a7f5a361969be6a905da99af21b44": "ABCDEF",
    "e12185b3db81b9ec20d0402632e83f74": "ACDEF",
    "83bd97c6c3ac69318ad965f7776a51b4": "ABCE",
    "80e9325ef9406e82b8202de25fd80cbb": "ABD",
    "7d2f8e1fc8dabca4d9baca38bf413732": "ABDE",
    "e329dd6e7aecd220d271ba06a87c1d4f": "ABE",
    "8d234f3f7209a68f21d4e2b8f367d0b3": "AC",
    "6ecb31b10f3e3a751f8d2caacbdc850d": "ACD",
    "034b452c93b9be10f437a385608d8c0f": "ACDE",
    "79b887d55f7fbe5f8f1e29537c4099b7": "ACE",
    "d23fcd2143ca2071fc33f912cf1c28e4": "AD",
    "32e93bed7ac49065a1af9639795f4b47": "ADE",
    "81e4110d9047c39ea1444a178b7cd33d": "AE",
    "fc9eb0edae6ae531956f368178f287e1": "B",
    "998251adc1952f413e9b2b8d2b3cad37": "BC",
    "47e6f17113fb5d7fa896270917aafb99": "BCD",
    "26fee236555e7629f11308452c47b032": "BCDE",
    "d22d3cc146b96cf9d049da3decb8060e": "BCDEF",
    "a90e4a238e95a9ef750a1e0844b6730b": "BCDG",
    "a4bfbd439f12870ac2294ac4f59c2ade": "BCE",
    "d7e98cd9fa6c9fc480ebcba65bbd5ed7": "BD",
    "859f062ed997fc06bebde9c00669d29d": "BDE",
    "1ad8f209d08633c3cee74a4f48862c4f": "BDEF",
    "8d34b7e5f05d2d9188a6d40a0f882cb0": "BDF",
    "fe4bf0dc5ee6f3e858034bacfbd8c657": "BE",
    "73223444a1f6ae044cc12664cfed422a": "C",
    "e5abe969bb50ce2495a7591f32d67cc3": "CD",
    "a897c5097bbbf5f66ad491c083a897f2": "CDE",
    "b01f11bd3ef4311b47cef1a032dde5c2": "CE",
    "ed3febdc9d4c5ca73f1066f3b6040d5a": "D",
    "6a1137dfc861563b83e2579024ce929f": "DE",
    "2e256e5ceb7a86e50fe2c93f622d30ac": "E",
    "ddeacacae3b5f3ceb9ae1638d1585271": "EG",
    "19be069faa48362663d092896fa7d4d4": "F",
    "52113efae9e75eacdb3529fefb168982": "G"
  };
  const hash = "MvvI6LxWDXiULHdxgGkpyKNBYNmLKocPqUjTId7M/47jQn5akrEAL5Swv7HX3T/Vuz4UsU552qp7eR55UX6gZ/lLhdOioo6BgRBPmreHZHO0vfYlJ9dN3LHD/k8FaebO3R9e684JIdjJBRT2VhgHozJDp5qRO3/WpeK25qruy2U=";
  async function getZhsQuestionData(data) {
    const url = "https://studentexam-api.zhihuishu.com/studentExam/gateway/t/v1/student/lookHomework";
    const str = _unsafeWindow.yxyz(data, hash);
    return request(url, "POST", {
      secretStr: str
    }, {
      "Content-Type": "application/x-www-form-urlencoded"
    });
  }
  const zhihuishu = [
    {
      type: "ask",
      name: "智慧树章节",
      tips: "智慧树必须开自动跳转，否则答案可能无法保存导致低分！",
      match: location.href.includes("zhihuishu.com") && (!location.href.includes("checkHomework") && location.host.includes("zhihuishu") && (location.pathname === "/stuExamWeb.html" || location.href.includes("/webExamList/dohomework/") || location.href.includes("/webExamList/doexamination/"))),
      question: {
        html: ".examPaper_subject",
        question: ".subject_describe.dynamic-fonts:eq(0) div:eq(0)",
        options: ".subject_node .nodeLab .label.clearfix .node_detail",
        type: ".subject_type span:first-child",
        workType: "zhs",
        pageType: "zhs"
      },
      init: async () => {
        await waitUntil(function() {
          return !$(".yidun_popup").hasClass("yidun_popup--light") && _unsafeWindow.zhsques;
        });
        const ques = _unsafeWindow.zhsques.examBase.workExamParts.map((item) => item.questionDtos).flat();
        let searchstr = {
          examId: location.hash.split("/")[5],
          optionSortInfo: ques.map((item) => {
            return {
              optionsIdStr: item.questionOptions.map((item2) => item2.id).join(","),
              questionId: item.id
            };
          }),
          recruitId: location.hash.split("/")[3]
        };
        getZhsQuestionData(searchstr).then((res) => {
          log("----------------", res[0].responseText, "error");
        });
      },
      next: () => {
        $(".switch-btn-box button:eq(1)").click();
      },
      questionHook: (item, inx) => {
        const ques = _unsafeWindow.zhsques.examBase.workExamParts.map((item2) => item2.questionDtos).flat();
        const quesData = ques[inx];
        item.type = typeChange(quesData.questionType.name);
        item.question = removeHtml1(quesData.name);
        item.options = quesData.questionOptions.map((item2) => removeHtml1(item2.content));
        return item;
      }
    },
    {
      type: "save",
      name: "智慧树作业收录",
      match: location.href.includes("zhihuishu.com") && (location.href.includes("checkHomework") && location.host.includes("zhihuishu") && (location.pathname === "/stuExamWeb.html" || location.href.includes("/webExamList/checkHomework/"))),
      question: {
        html: ".questionType",
        question: ".subject_describe",
        options: ".examquestions-answer",
        type: ".newZy_TItle",
        workType: "zhs",
        pageType: "zhs"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".questionType").length > 0 && _unsafeWindow.zhsques && _unsafeWindow.zhsimgAnswer;
        });
      },
      answerHook: (item) => {
        let tid = $(item.html).find(".examPaper_subject").attr("data-questionid");
        const quesData = _unsafeWindow.zhsimgAnswer;
        const quesList = _unsafeWindow.zhsques.examBase.workExamParts.map((item2) => item2.questionDtos).flat();
        let data = quesList.find((item2) => item2.id == tid);
        data.answer = quesData[data.id];
        item.question = removeHtml1(data.name);
        item.type = typeChange(data.questionType.name);
        item.options = data.questionOptions.map((item2) => removeHtml1(item2.content));
        item.answer = data.answer.split("").map((code) => {
          return item.options[code.charCodeAt(0) - 65];
        });
        if (item.type == "3") {
          item.options = [];
          item.answer = isTrue(item.answer[0]) ? ["正确"] : isFalse(item.answer[0]) ? ["错误"] : [];
        }
        return item;
      }
    }
  ];
  const xinwei = [
    {
      type: "hook",
      name: "芯位教育hook",
      match: location.host === "www.51xinwei.com",
      main: (data) => {
        _unsafeWindow.mainClass = $(".el-main > div:eq(0)").attr("class");
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== $(".el-main > div:eq(0)").attr("class")) {
            _unsafeWindow.mainClass = $(".el-main > div:eq(0)").attr("class");
            if (_unsafeWindow.mainClass === "homework-detail-container") {
              await waitUntil(function() {
                return $(".el-loading-mask").length === 0;
              });
            }
            vuePageChange();
            observer.disconnect();
          }
          for (let mutation of mutations) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
              if (mutation.target.textContent && (mutation.target.textContent.includes("下一题") || mutation.target.textContent.includes("上一题"))) {
                observer.disconnect();
                vuePageChange();
              }
            }
          }
        });
        if ($("#app").length >= 1) {
          observer.observe($("#app")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    {
      type: "ask",
      name: "芯位教育作业",
      tips: "芯位教育仅支持选择判断，其他题型待适配",
      match: () => location.host === "www.51xinwei.com" && /student\/#\/courseInfo\/[A-Za-z0-9]+\/homework/i.test(location.href),
      question: {
        html: ".content-area > div.content",
        question: ".content",
        options: ".el-radio-group label .label,.el-checkbox-group label .label",
        type: ".question-box .tag",
        workType: "xinwei",
        pageType: "xinwei"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".question-box").length !== 0;
        });
      },
      next: () => {
        $('.toggle-box > button:contains("下一题")').click();
      },
      ischecked: (item) => {
        return item.parent().parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        const type = $(item.html).find(".question-box .tag").text();
        switch (type) {
          case "单选":
            item.type = "0";
            break;
          case "多选":
            item.type = "1";
            break;
          case "判断":
            item.type = "3";
            break;
        }
        return item;
      }
    },
    // 芯位教育收录
    {
      type: "save",
      name: "芯位教育",
      match: () => location.host === "www.51xinwei.com" && location.href.includes("/homeworkDetailPage"),
      question: {
        html: ".question-content-body",
        question: ".topic-title",
        options: ".el-radio-group label .label,.el-checkbox-group label .label",
        type: ".question-box .tag",
        workType: "xinwei",
        pageType: "xinwei"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".question-content-body").length !== 0;
        });
      },
      answerHook: (item) => {
        const type = $(item.html).find(".question-box .tag").text();
        let answer = $(item.html).find(".answer-area > span:eq(1)").text();
        switch (type) {
          case "单选":
          case "多选":
            answer = answer.split(",");
            item.answer = answer.map((xx) => {
              return item.options[xx.charCodeAt(0) - 65];
            });
            if (item.answer.length === 0) {
              return;
            }
            item.type = type === "单选" ? "0" : "1";
            break;
          case "判断":
            item.type = "3";
            if (answer == "T") {
              item.answer = ["正确"];
            }
            if (answer == "F") {
              item.answer = ["错误"];
            }
            break;
        }
        return item;
      }
    }
  ];
  const chatglm = [
    {
      type: "hook",
      name: "智普清言token获取",
      match: /chatglm.cn\/main\//i.test(location.href),
      main: (data) => {
        const app = data.app;
        const cookies = document.cookie.split(";");
        let chatglm_refresh_token = "";
        cookies.forEach((cookie) => {
          if (/chatglm_refresh_token/i.test(cookie)) {
            chatglm_refresh_token = cookie.split("=")[1];
          }
        });
        if (chatglm_refresh_token) {
          app.app.gpt.forEach((item) => {
            if (item.name === "GLM") {
              item.key = chatglm_refresh_token;
            }
          });
          app.setConfig(app.app);
          msg("智普清言token获取成功");
        }
      }
    }
  ];
  const typeMap = {
    "single_selection": "单选题",
    "multiple_selection": "多选题",
    "true_or_false": "判断题",
    "fill_in_blank": "填空题",
    "short_answer": "简答题",
    "text": "文本",
    "analysis": "综合题",
    "matching": "匹配题",
    "random": "随机题",
    "cloze": "完形填空题"
  };
  const guokai = [
    {
      type: "hook",
      name: "国开hook",
      match: location.host.includes("ouchn.cn"),
      main: (data) => {
        _unsafeWindow.mainClass = getUrl();
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== getUrl()) {
            _unsafeWindow.mainClass = getUrl();
            if (_unsafeWindow.mainClass === "homework-detail-container") {
              await waitUntil(function() {
                return $(".selectDan").length !== 0;
              });
            }
            vuePageChange();
            observer.disconnect();
          }
        });
        if ($("body").length >= 1) {
          observer.observe($("body")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    // 国开答案收录
    {
      type: "save",
      name: "国开答案收录旧",
      match: /\/exam\/([0-9]+)\/subjects#\/submission\/([0-9]+)/i.test(location.href),
      question: {
        html: "li.subject",
        question: ".summary-title .subject-description",
        options: ".subject-options li .option-content",
        type: ".subject-point > span:eq(0)",
        workType: "guokai",
        pageType: "guokai"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".loading-gif").hasClass("ng-hide");
        });
      },
      answerHook: (item) => {
        const scope = _unsafeWindow.angular.element(item.html).scope();
        const subject = scope.subject;
        if (subject.type === "text") {
          return;
        }
        let haveAnswer = false;
        const point = parseFloat(subject.point);
        const score = parseFloat(subject.score);
        const isT = point !== 0 && point === score;
        let ques = $(`<div>${subject.description}</div>`).clone();
        ques.find("span.__blank__").remove();
        item.question = removeHtml1(ques.html());
        item.options = subject.options.map((item1) => {
          return removeHtml1(item1.content);
        });
        item.type = typeChange(typeMap[subject.type]);
        if (subject.correctOptions && subject.correctOptions.length > 0) {
          item.answer = subject.correctOptions.map((item1) => {
            return removeHtml1(item1.content);
          });
          haveAnswer = true;
        }
        if (subject.correct_answers && subject.correct_answers.length > 0) {
          item.answer = subject.correct_answers.map((item1) => {
            return item1.content;
          });
          haveAnswer = true;
        }
        if (!haveAnswer && !isT && subject.type !== "true_or_false") {
          return;
        }
        switch (subject.type) {
          case "single_selection":
          case "multiple_selection":
          case "true_or_false":
            if (!haveAnswer) {
              item.answer = subject.options.filter((item2) => item2.isChosen).map((item2) => removeHtml1(item2.content));
              if (item.answer.length === 0)
                return;
              if (subject.type === "true_or_false") {
                const answer = item.answer[0];
                item.options = [];
                const isCorrect = isTrue(answer) ? "正确" : isFalse(answer) ? "错误" : "";
                if (isCorrect) {
                  item.answer = [isT ? isCorrect : isCorrect === "正确" ? "错误" : "正确"];
                } else {
                  item.answer = [];
                }
              }
            } else {
              if (subject.type === "true_or_false") {
                const answer = item.answer[0];
                item.options = [];
                const isCorrect = isTrue(answer) ? "正确" : isFalse(answer) ? "错误" : "";
                if (isCorrect) {
                  item.answer = [isCorrect];
                }
              }
            }
            break;
          case "analysis":
            break;
          case "cloze":
            item.options = subject.sub_subjects.map((item1) => {
              return item1.options.map((item2) => {
                return removeHtml1(item2.content);
              });
            }).get();
            break;
          case "fill_in_blank":
            if (!haveAnswer) {
              item.answer = subject.answers.map((item1) => {
                return item1.content;
              });
            }
            break;
        }
        return item;
      }
    },
    // 广开答案收录
    {
      type: "save",
      name: "广开答案收录",
      match: /mod\/quiz\/review\.php/i.test(location.pathname) && ["moodle.syxy.ouchn.cn", "xczxzdbf.moodle.qwbx.ouchn.cn", "elearning.bjou.edu.cn", "whkpc.hnqtyq.cn:5678", "course.ougd.cn", "study.ouchn.cn"].includes(location.host),
      question: {
        html: ".que",
        question: ".qtext",
        options: ".answer > div",
        type: "",
        answer: ".rightanswer",
        workType: "guokai",
        pageType: "guokai"
      },
      init: async () => {
        $(".specificfeedback").remove();
      },
      next: async () => {
        !$(".qn_buttons > a").last().hasClass("thispage") && $(".arrow_text").click();
      },
      answerHook: (item) => {
        const quesStatus = $(item.html).find(".info .state").text();
        item.type = $(item.html).attr("class").split(" ")[1];
        $(item.html).find(".qtext .accesshide").remove();
        item.question = removeHtml1($(item.html).find(".qtext").html());
        switch (item.type) {
          case "truefalse":
            item.type = "3";
            item.$options = $(item.html).find("input[type=radio]");
            item.options = $(item.html).find(".answer > div").map((index, element) => {
              let optionText = removeHtml1($(element).html());
              return optionText.trim();
            }).get();
            item.answer = [];
            item.answer = $(item.html).find(".answer > div").map((index, element) => {
              if (item.$options.eq(index).prop("checked")) {
                return item.options[index];
              } else {
                return "";
              }
            }).get();
            item.answer = item.answer.filter((item2) => item2 !== "");
            if (item.answer.length === 0) {
              item.temp = removeHtml1($(item.html).find(".rightanswer").html()).replace("正确答案是", "").trim();
              item.answer = [item.temp];
            } else {
              if (!quesStatus.includes("正确")) {
                item.answer = item.options.filter((zzz) => !zzz.includes(item.answer[0]));
              }
            }
            isTrue(item.answer[0]) ? item.answer = ["正确"] : isFalse(item.answer[0]) ? item.answer = ["错误"] : item.answer = [];
            item.options = [];
            break;
          case "multichoice":
          case "multichoiceset":
            item.type = "1";
            item.$options = $(item.html).find("input[type=checkbox]");
            if (item.$options.length === 0) {
              item.type = "0";
              item.$options = $(item.html).find("input[type=radio]");
            }
            item.options = $(item.html).find(".answer > div").map((index, element) => {
              let inx = $(element).find(".answernumber").text().trim();
              let optionText = removeHtml1($(element).html());
              if (inx === "") {
                return optionText.trim();
              }
              return optionText.split(inx)[1].trim();
            }).get();
            if (quesStatus.includes("正确") && !quesStatus.includes("部分正确")) {
              item.answer = [];
              item.answer = $(item.html).find(".answer > div").map((index, element) => {
                let inx = $(element).find(".answernumber").text().trim();
                let optionText = removeHtml1($(element).html());
                if (item.$options.eq(index).prop("checked") && $(element).find(".text-success").length > 0) {
                  if (inx === "") {
                    return optionText.trim();
                  }
                  return optionText.split(inx)[1].trim();
                } else {
                  return "";
                }
              }).get();
              item.answer = item.answer.filter((item2) => item2 !== "");
            } else {
              item.temp = removeHtml1($(item.html).find(".rightanswer").html(), false).replace("正确答案是：", "").trim();
              const optionsBase = item.options.slice(0);
              optionsBase.sort((a, b) => {
                return b.length - a.length;
              });
              item.answer = optionsBase.map((item1) => {
                if (item.temp.includes(item1)) {
                  item.temp = item.temp.replace(item1, "");
                  return item1;
                } else {
                  return "";
                }
              });
              item.answer = item.answer.filter((item2) => item2 !== "");
              if (item.answer.length > 1)
                ;
            }
            break;
          case "shortanswer":
            item.type = "4";
            item.$options = $(item.html).find("input[type=text]");
            break;
          case "match":
            item.type = "24";
            item.match = $(".answer tr td.text").map((index, element) => {
              return removeHtml1($(element).html());
            }).get();
            item.$options = $(".answer tr td.control select");
            item.selects = $(".answer tr td.control select").map((index, element) => {
              let option = $(element).find("option").map((index2, element2) => {
                let value = $(element2).val();
                let text2 = $(element2).text();
                return {
                  value,
                  text: text2
                };
              }).get();
              return [option];
            }).get();
            break;
          case "description":
            return;
        }
        return item;
      }
    },
    {
      type: "ask",
      name: "广开形考",
      tips: "广开仅支持基础题型，特殊题型请手动完成",
      match: /mod\/quiz\/attempt\.php/i.test(location.pathname) && ["moodle.syxy.ouchn.cn", "xczxzdbf.moodle.qwbx.ouchn.cn", "elearning.bjou.edu.cn", "whkpc.hnqtyq.cn:5678", "course.ougd.cn", "study.ouchn.cn"].includes(location.host),
      question: {
        html: ".que",
        question: ".qtext",
        options: ".answer > div",
        type: "",
        workType: "guangkai",
        pageType: "guangkai"
      },
      ischecked: (item) => {
        return Boolean(item.prop("checked"));
      },
      questionHook: (item) => {
        item.type = $(item.html).attr("class").split(" ")[1];
        $(item.html).find(".qtext .accesshide").remove();
        item.question = removeHtml1($(item.html).find(".qtext").html());
        switch (item.type) {
          case "truefalse":
            item.type = "3";
            item.$options = $(item.html).find("input[type=radio]");
            item.options = [];
            break;
          case "multichoice":
          case "multichoiceset":
            item.type = "1";
            item.$options = $(item.html).find("input[type=checkbox]");
            if (item.$options.length === 0) {
              item.type = "0";
              item.$options = $(item.html).find("input[type=radio]");
            }
            item.options = $(item.html).find(".answer > div").map((index, element) => {
              let inx = $(element).find(".answernumber").text().trim();
              let optionText = removeHtml1($(element).html());
              if (inx === "") {
                return optionText.trim();
              }
              return optionText.split(inx)[1].trim();
            }).get();
            break;
          case "shortanswer":
            item.type = "4";
            item.$options = $(item.html).find("input[type=text]");
            break;
          case "match":
            item.type = "24";
            item.match = $(".answer tr td.text").map((index, element) => {
              return removeHtml1($(element).html());
            }).get();
            item.$options = $(".answer tr td.control select");
            item.selects = $(".answer tr td.control select").map((index, element) => {
              let option = $(element).find("option").map((index2, element2) => {
                let value = $(element2).val();
                let text2 = $(element2).text();
                return {
                  value,
                  text: text2
                };
              }).get();
              return [option];
            }).get();
          case "essay":
            item.type = "4";
            item.$options = $(item.html).find("iframe");
            break;
          case "description":
            return;
        }
        return item;
      },
      setAnswer: (item) => {
        switch (item.type) {
          case "4":
            $(item.html).find("input.form-control").each(function(index, element) {
              $(element).val(item.answer[index]);
            });
            $(item.html).find("iframe:eq(0)").contents().find("body").html(item.answer[0]);
            return false;
          case "3":
            item.ques.$options.each((index, element) => {
              const pdtext = $(element).parent().find("label").text();
              if (typeof item.answer === "object") {
                item.answer = item.answer[0];
              }
              if (isTrue(item.answer) && isTrue(pdtext)) {
                $(element).click();
                return false;
              } else if (isFalse(item.answer) && isFalse(pdtext)) {
                $(element).click();
                return false;
              }
              return true;
            });
          default:
            return true;
        }
      },
      finish: (item) => {
        $(".submitbtns .btn-primary").click();
      }
    },
    {
      type: "ask",
      name: "国开专题测验",
      match: location.host === "lms.ouchn.cn" && /\/exam\/([0-9]+)\/subjects/i.test(location.pathname) && !/\/exam\/([0-9]+)\/subjects#\/submission\/([0-9]+)/i.test(location.href),
      question: {
        html: "li.subject",
        question: ".summary-title .subject-description",
        options: ".subject-options li .option-content",
        type: ".summary-sub-title span:eq(0)",
        workType: "guokai",
        pageType: "guokai"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".loading-gif").hasClass("ng-hide") && $(".hd .examinee .submit-label").eq(0).text() === "";
        });
      },
      ischecked: (item) => {
        return Boolean(item.parent().find("input").eq(-1).prop("checked"));
      },
      questionHook: (item) => {
        const scope = _unsafeWindow.angular.element(item.html).scope();
        const subject = scope.subject;
        if (subject.type === "text") {
          return;
        }
        item.type = typeChange(typeMap[subject.type]);
        let ques = $(`<div>${subject.description}</div>`).clone();
        ques.find("span.__blank__").remove();
        item.question = removeHtml1(ques.html());
        subject.options = subject.options.sort((a, b) => {
          return a.sort - b.sort;
        });
        item.options = subject.options.map((item1) => {
          return removeHtml1(item1.content);
        });
        log(item.type, subject.type);
        switch (subject.type) {
          case "cloze":
            item.options = subject.sub_subjects.map((item1) => {
              return item1.options.map((item2) => {
                return removeHtml1(item2.content);
              });
            });
            item.$options = $(item.html).find("select");
          case "true_or_false":
            item.options = [];
        }
        item.subject = subject;
        item.scope = scope;
        return item;
      },
      setAnswer: (item) => {
        log(item.ques, "success");
        switch (item.type) {
          case "2":
            log($(item.html).find(".___answer"), "success");
            $(item.html).find(".___answer").each((index, element) => {
              $(element).html(item.answer[index]);
              item.ques.scope.subject.answers[index].content = item.answer[index];
              item.ques.scope.onChangeSubmission(item.ques.subject);
            });
            return false;
          case "4":
            $(item.html).find(".simditor-body.needsclick>p").each(function(index, element) {
              $(element).html(item.answer[index]);
              item.ques.subject.answered_content = item.answer[index];
            });
            item.ques.scope.onChangeSubmission(item.ques.subject);
            return false;
          case "14":
            item.ques.subject.sub_subjects.forEach((sub_subject, index) => {
              let an = item.answer[index];
              sub_subject.options.forEach((option, index1) => {
                if (option.content === an) {
                  sub_subject.answeredOption = String(option.id);
                  item.ques.scope.onChangeSubmission(sub_subject);
                  $(item.html).find(`input[value="${option.id}"]`).click();
                  $(item.html).find(`button:eq(${index})>span:eq(1)`).text(an);
                }
              });
            });
            return false;
        }
        return true;
      }
    },
    {
      type: "save",
      name: "上海开放收录",
      match: () => location.host === "l.shou.org.cn" && location.href.includes("assignment/history.aspx?homeWorkId"),
      question: {
        html: ".e-q-body",
        question: ".ErichText",
        options: "ul>li>.ErichText",
        type: ".question-box .tag",
        workType: "shou",
        pageType: "shou"
      },
      init: async () => {
      },
      answerHook: (item) => {
        item.$options = $(item.html).find("ul>li");
        let an = $(item.html).find("ul>li.checked").map((index, element) => {
          return removeHtml1($(element).find(".ErichText").html());
        }).get();
        const isT = $(item.html).find(".e-q-right").length > 0;
        item.answer = an.filter((item2) => item2 !== "");
        const ckAnswer = $(item.html).find(".e-ans-ref .e-ans-r").map((index, element) => {
          return removeHtml1($(element).html());
        }).get();
        let ans = ckAnswer.map((item1) => {
          let index = item1.charCodeAt() - 65;
          return item.options[index];
        }).filter((item1) => item1 !== "" && item1 !== void 0);
        switch ($(item.html).attr("data-questiontype")) {
          case "2":
            item.type = "1";
            break;
          case "1":
            item.type = "0";
            break;
          case "3":
            item.type = "3";
            item.answer = $(item.html).find("ul>li.checked").map((index, element) => {
              return removeHtml1($(element).html());
            }).get();
            item.options = [];
            isTrue(item.answer[0]) ? item.answer = ["正确"] : isFalse(item.answer[0]) ? item.answer = ["错误"] : item.answer = [];
            break;
          case "11":
            item.type = "19";
            const quesList = $(item.html).find("form").map((index, element) => {
              return {
                type: "0",
                question: removeHtml1($(element).find(".e-q-q .ErichText").html()),
                options: $(element).find("ul li .ErichText").map((index2, element2) => {
                  return removeHtml1($(element2).html());
                }).get()
              };
            }).get();
            ans = ans.length > 0 ? isTrue(ans[0]) ? ["正确"] : isFalse(ans[0]) ? ["错误"] : [] : [];
            item.options = quesList;
          default:
            log("暂未适配当前题型", $(item.html).attr("data-questiontype"), "error");
            return;
        }
        if (ans.length > 0) {
          item.answer = ans;
          return item;
        }
        if (!isT && item.type === "3" && item.answer.length > 0) {
          item.answer = isTrue(item.answer[0]) ? ["错误"] : isFalse(item.answer[0]) ? ["正确"] : [];
        } else if (!isT) {
          return;
        }
        return item;
      }
    },
    {
      type: "ask",
      name: "上海开放作业",
      tips: "上海开放大学目前仅支持选择判断题，其他题型请手动完成",
      match: () => location.host === "l.shou.org.cn" && location.href.includes("assignment/preview.aspx?homeWorkId"),
      question: {
        html: ".e-q-body",
        question: ".ErichText",
        options: "ul>li>.ErichText",
        type: ".question-box .tag",
        workType: "shou",
        pageType: "shou"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".e-q-body").length !== 0;
        });
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        switch ($(item.html).attr("data-questiontype")) {
          case "2":
            item.type = "1";
            break;
          case "1":
            item.type = "0";
            break;
          case "3":
            item.type = "3";
            item.$options = $(item.html).find("ul>li");
            break;
          default:
            log("暂未适配当前题型", $(item.html).attr("data-questiontype"), "error");
            return;
        }
        return item;
      },
      setAnswer: (item) => {
        return true;
      },
      finish: (item) => {
      }
    }
  ];
  const chengjiaoyun = [
    {
      type: "ask",
      name: "成教云考试",
      tips: "成教云适配中",
      match: () => location.href.includes("exam/student/exam2/doexam"),
      question: {
        html: $(".ui-paper-iframe").contents().find(".ui-question"),
        question: ".ui-question-content-wrapper",
        options: ".ui-question-options li .ui-question-content-wrapper",
        type: ".ui-question-group-title",
        workType: "chengjiaoyun",
        pageType: "chengjiaoyun"
      },
      init: async () => {
        await waitUntil(function() {
          let exists = $(".ui-paper-iframe").contents().find(".ui-question-group-title").length > 0;
          return exists;
        });
      },
      next: () => {
        $("#next-btn").click();
      },
      ischecked: (item) => {
        return item.hasClass("ui-option-selected");
      },
      questionHook: (item) => {
        let type = $(item.html).parent().find(".ui-question-group-title").text().split(".")[1].trim();
        item.$options = $(item.html).find(".ui-question-options li>span");
        switch (type) {
          case "单选题":
            item.type = "0";
            break;
          case "多选题":
            item.type = "1";
            break;
          case "判断题":
            item.type = "2";
            break;
        }
        return item;
      },
      finish: (item) => {
      }
    }
  ];
  const jsou = [
    {
      type: "hook",
      name: "hook",
      match: () => location.host === "xuexi.jsou.cn" && location.href.includes("newHomework/showHomeworkByStatus") && location.href.includes("checked=true"),
      main: (data) => {
        _unsafeWindow.mainClass = $("#homeworkHistory").find(".active").attr("id");
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== $("#homeworkHistory").find(".active").attr("id")) {
            _unsafeWindow.mainClass = $("#homeworkHistory").find(".active").attr("id");
            await waitUntil(function() {
              return $(".layui-layer-shade").length === 0;
            });
            vuePageChange();
            observer.disconnect();
          }
          for (let mutation of mutations) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
              if (mutation.target.textContent && (mutation.target.textContent.includes("下一题") || mutation.target.textContent.includes("上一题"))) {
                observer.disconnect();
                vuePageChange();
              }
            }
          }
        });
        if ($("body").length >= 1) {
          observer.observe($("body")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    {
      type: "ask",
      name: "江苏开放大学答题",
      tips: "江开适配中，目前仅支持选择、判断题、填空题，其他题型请反馈账号给作者",
      match: () => location.host === "xuexi.jsou.cn" && location.href.includes("/showHomeworkByStatus") && location.href.includes("checked=false"),
      question: {
        html: ".insert",
        question: ".window-title",
        options: ".questionId-option li > div:not(.numberCover)",
        type: ".questionDiv >div:eq(0)",
        workType: "jsou",
        pageType: "jsou"
      },
      init: async () => {
        document.addEventListener("copy", function(event2) {
          event2.stopImmediatePropagation();
          layer.msg("复制成功", { icon: 4 });
          event2.clipboardData.setData("text/plain", window.getSelection().toString());
        });
        document.addEventListener("paste", () => {
          event.stopImmediatePropagation();
          let paste = (event.clipboardData || window.clipboardData).getData("text");
          layer.msg("粘贴成功", { icon: 4 });
          document.execCommand("insertText", false, paste);
        });
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        item.type = $(item.html).find(".questionDiv >div:eq(1)").text().trim();
        item.type = typeChange(item.type);
        item.$options = $(item.html).find(".questionId-option li .numberCover");
        return item;
      },
      setAnswer: (item) => {
        switch (item.type) {
          case "2":
            item.$options = $(item.html).find(".questionTitle input");
            if (item.$options.length == item.answer.length) {
              item.$options.each((index, element) => {
                $(element).val(item.answer[index]);
              });
              return false;
            }
        }
        return true;
      },
      finish: (item) => {
      }
    },
    // 江开收录
    {
      type: "save",
      name: "江苏开放大学收录",
      match: () => location.host === "xuexi.jsou.cn" && location.href.includes("newHomework/showHomeworkByStatus") && location.href.includes("checked=true"),
      question: {
        html: ".insert",
        question: ".window-title",
        options: "#questionId-option li > div:not(.numberCover)",
        type: ".questionDiv >div:eq(0)",
        workType: "jsou",
        pageType: "jsou"
      },
      init: async () => {
      },
      answerHook: (item) => {
        item.type = $(item.html).find(".questionDiv >div:eq(1)").text();
        let score = $(item.html).find(".questionDiv >div").text().match(/分值(\d+)分/)[1];
        let score2 = $(item.html).find(".questionDiv >div").text().match(/得分：(\d+)/)[1];
        item.type = typeChange(item.type);
        let isT = score == score2 && score2 !== 0;
        if (!isT && item.type != 3) {
          return;
        }
        switch (item.type) {
          case "0":
          case "1":
          case "3":
            item.answer = $(item.html).find(".answer .correctAnswer").text().trim().split("；").map((xx) => {
              return item.options[xx.charCodeAt(0) - 65];
            });
            item.answer = item.answer.filter((x) => x);
            if (item.answer.length == 0) {
              item.answer = $(item.html).find(".answer .studentAnswer").text().trim().split("；").map((xx) => {
                return item.options[xx.charCodeAt(0) - 65];
              });
            }
            item.answer = item.answer.filter((x) => x);
            if (item.type == 3) {
              item.options = [];
              let answer = item.answer[0];
              if (isFalse(answer))
                item.answer = "错误";
              else if (isTrue(answer))
                item.answer = "正确";
              else
                return;
              if (["正确", "错误"].includes(item.answer) && !isT) {
                item.answer = item.answer === "正确" ? "错误" : "正确";
              }
            }
            break;
          case "2":
            item.options = [];
            item.answer = $(item.html).find(".answer .correctAnswer").text().trim().split("；");
            item.answer = item.answer.filter((x) => x);
            if (item.answer.length == 0) {
              item.answer = $(item.html).find(".answer .studentAnswer").text().trim().split("；");
            }
            item.answer = item.answer.filter((x) => x);
            break;
          default:
            return;
        }
        return item;
      }
    }
  ];
  const zhijiaoyun = [
    {
      type: "hook",
      name: "hook",
      match: location.host === "spoc-exam.icve.com.cn",
      main: (data) => {
        _unsafeWindow.mainClass = $(".q_content").first().attr("id");
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== $(".q_content").first().attr("id")) {
            _unsafeWindow.mainClass = $(".q_content").first().attr("id");
            if (_unsafeWindow.mainClass === "homework-detail-container") {
              await waitUntil(function() {
                return $(".q_content").length !== 0;
              });
            }
            vuePageChange();
            observer.disconnect();
          }
          for (let mutation of mutations) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
              if (mutation.target.textContent && (mutation.target.textContent.includes("下一题") || mutation.target.textContent.includes("上一题"))) {
                observer.disconnect();
                vuePageChange();
              }
            }
          }
        });
        if ($("#examPage").length >= 1) {
          observer.observe($("#examPage")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    {
      type: "hook",
      name: "hook",
      match: location.host === "zjy2.icve.com.cn",
      main: (data) => {
        $(".minimized-dialog img").css({
          "z-index": "999999"
        });
        _unsafeWindow.mainClass = $(".r.rFu>div:eq(0)").first().attr("class");
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== $(".r.rFu>div:eq(0)").first().attr("class")) {
            _unsafeWindow.mainClass = $(".r.rFu>div:eq(0)").first().attr("class");
            if (_unsafeWindow.mainClass === "homework-detail-container") {
              await waitUntil(function() {
                return $(".q_content").length !== 0;
              });
            }
            vuePageChange();
            observer.disconnect();
          }
        });
        if ($("#app").length >= 1) {
          observer.observe($("#app")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    {
      type: "ask",
      name: "职教云作业",
      tips: "职教云只支持选择、判断题，其他题型请反馈给作者",
      match: () => location.href.includes("examflow_index.action"),
      question: {
        html: ".q_content",
        question: ".divQuestionTitle",
        options: ".questionOptions > div",
        type: ".question-box .tag",
        workType: "zhijiaoyun",
        pageType: "zhijiaoyun"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".q_content").length !== 0;
        });
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        var _a, _b;
        item.question = removeHtml1($(item.html).find(".divQuestionTitle").html());
        let qid = $(item.html).find("[name='quesId']").attr("id");
        let type = (_b = (_a = document.getElementById(`questionId[${qid}]`)) == null ? void 0 : _a.getAttribute("answertype")) == null ? void 0 : _b.trim();
        let inx = $(item.html).find("span[name^='questionIndex']").text().trim() + "、";
        let score = $(item.html).find(".q_score").text().trim();
        item.question = item.question.replace(inx, "").replace(score, "").trim();
        switch (type) {
          case "单项选择题":
          case "单选题":
          case "singlechoice":
            item.type = "0";
            break;
          case "多项选择题":
          case "多选题":
          case "multichoice":
            item.type = "1";
            break;
          case "判断题":
          case "bijudgement":
            item.type = "3";
            break;
          case "fillblank":
            item.type = "2";
            item.question = removeHtml1($(item.html).find("[name='fillblankTitle']").html());
            break;
        }
        item.options = $(item.html).find(".questionOptions>div").map((_inx, item2) => {
          let inx2 = $(item2).find(".option_index").text().trim();
          return removeHtml1($(item2).html()).replace(inx2, "").trim();
        }).get();
        item.$options = $(item.html).find(".questionOptions>div input");
        return item;
      },
      setAnswer: (item) => {
        switch (item.type) {
          case "2":
            $(item.html).find(".fillblank_input > input").each((inx, xx) => {
              $(xx).val(item.answer[inx]);
            });
            return false;
        }
        return true;
      },
      finish: (item) => {
        $(".paging_next").click();
      }
    },
    {
      type: "save",
      name: "收录",
      match: () => location.href.includes("examrecord_recordDetail.action"),
      question: {
        html: ".page_content.ques_content",
        question: ".divQuestionTitle",
        options: ".questionOptions>div.q_option_readonly",
        type: ".question-box .tag",
        workType: "zhijiaoyun",
        pageType: "zhijiaoyun"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".page_content.ques_content").length !== 0;
        });
      },
      answerHook: (item) => {
        const isT = $(item.html).find(".exam.icon_examright").length;
        const qid = $(item.html).find("input[name='quesId']:not([id='']").attr("id");
        const type = $(`input#qId${qid}`).attr("qtype");
        const inx = $(item.html).find("span[name^='questionIndex']").text().trim() + "、";
        const score = $(item.html).find(".q_score").text().trim();
        item.question = item.question.replace(inx, "").replace(score, "").trim();
        item.options = $(item.html).find(".questionOptions>div.q_option_readonly").map((_inx, xx) => {
          let opInx = $(xx).find("span[name='optionIndexName']").text().trim();
          return removeHtml1($(xx).html()).replace(opInx, "").trim();
        }).get();
        switch (type) {
          case "单项选择题":
          case "单选题":
          case "singlechoice":
            item.type = "0";
            break;
          case "多项选择题":
          case "多选题":
          case "multichoice":
            item.type = "1";
            break;
          case "判断题":
          case "bijudgement":
            item.type = "3";
            break;
          case "fillblank":
            item.type = "2";
            item.question = removeHtml1($(item.html).find(".answerOption>span:eq(0)").html());
            break;
        }
        if (isT == 0 && item.type !== "3") {
          return;
        }
        switch (item.type) {
          case "0":
          case "1":
            item.answer = $(item.html).find('.exam_stu_answer span[name="stuAnswer"]').text().trim().split("").map((xx) => {
              return item.options[xx.charCodeAt(0) - 65];
            });
            break;
          case "2":
            item.answer = $(item.html).find("span.fillblank_answer").map((inx2, xx) => {
              return removeHtml1($(xx).html());
            }).get();
            if (item.answer.length !== isT) {
              item.answer = [];
              return;
            }
            break;
          case "3":
            item.options = [];
            let answer = $(item.html).find('.exam_stu_answer span[name="stuAnswer"]').text().trim();
            if (["正确", "错误"].includes(answer)) {
              if (isT) {
                item.answer = [answer];
              } else {
                item.answer = [answer === "正确" ? "错误" : "正确"];
              }
            }
            break;
        }
        return item;
      }
    }
  ];
  const cnzx = [
    {
      type: "ask",
      name: "川农在线答题",
      tips: "川农在线仅支持选择判断题，其他题型请反馈",
      match: () => (location.host === "any.cnzx.info:81" || location.host === "zice.cnzx.info") && location.href.includes("KaoShi/ShiTiYe.aspx"),
      question: {
        html: "li.question",
        question: ".wenti >p.stem",
        options: ".wenti > ol > li",
        type: ".question_head > span:eq(0)",
        workType: "cnzx",
        pageType: "cnzx"
      },
      init: async () => {
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.find("input").prop("checked");
      },
      questionHook: (item) => {
        item.$options = $(item.html).find(".wenti > ol > li input");
        if (item.options.length !== 0) {
          item.type = item.$options.eq(0).attr("type") === "radio" ? "0" : "1";
          if (item.options.length === 2 && item.options.includes("正确") && item.options.includes("错误")) {
            item.type = "3";
            item.options = [];
          }
        }
        return item;
      },
      setAnswer(item) {
        switch (item.type) {
          case "3":
            $(item.html).find(".wenti > ol > li").each((i, element) => {
              if (isTrue(item.answer) && isTrue(removeHtml1($(element).html()))) {
                item.ques.$options.eq(i).click();
              }
              if (isFalse(item.answer) && isFalse(removeHtml1($(element).html()))) {
                item.ques.$options.eq(i).click();
              }
            });
            return false;
        }
        return true;
      },
      finish: (item) => {
        $("li.paginationjs-next.J-paginationjs-next").click();
      }
    },
    {
      type: "save",
      name: "收录",
      match: () => location.host === "zice.cnzx.info" && location.href.includes("ZaiXianLianXi.aspx"),
      question: {
        html: ".ShiTi>.ShiTiMiaoShu",
        question: ".ShiTiMiaoShu",
        options: ".el-radio-group label .label,.el-checkbox-group label .label",
        type: ".question-box .tag",
        workType: "cnzx",
        pageType: "cnzx"
      },
      init: async () => {
      },
      answerHook: (item) => {
        log($(item.html).text());
        item.question = removeHtml1(titleClean(removeHtml1($(item.html).html())));
        let type = $("ul.TiXing>li.DangQianTiXing:eq(0)>a").text();
        let answer = [];
        let option = $(item.html).next();
        item.options = removeStartChar(option.find("ul li").map((_i, e) => {
          if ($(e).hasClass("DaAn1")) {
            answer.push(_i);
          }
          return titleClean(removeHtml1($(e).html()));
        }).get());
        item.answer = answer.map((i) => {
          return item.options[i];
        });
        switch (type) {
          case "单选题":
          case "词汇与结构":
          case "交际用语":
            item.type = "0";
            break;
          case "多选题":
            item.type = "1";
            break;
          case "判断题":
            item.type = "3";
            item.options = [];
            item.answer = isTrue(item.answer[0]) ? ["正确"] : isFalse(item.answer[0]) ? ["错误"] : [];
            break;
        }
        return item;
      }
    }
  ];
  const yktDecode = (table, table1, text2) => {
    let reg = /<span class="xuetangx-com-encrypted-font">(.+?)<\/span>/g;
    let fontList = text2.match(reg);
    if (fontList) {
      fontList.forEach((font) => {
        reg = /<span class="xuetangx-com-encrypted-font">(.+?)<\/span>/;
        let fontStr = reg.exec(font);
        if (fontStr && fontStr.length > 1) {
          let zz = fontStr[1];
          let zz1 = zz.split("").map((item) => {
            return table[table1[item]];
          }).join("");
          text2 = text2.replace(fontStr[0], zz1);
        }
      });
    }
    return text2;
  };
  const ttfDownload = async (url) => {
    return new Promise((resolve) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "arraybuffer",
        onload: function(response) {
          let tables = {};
          const font = Typr$1.parse(response.response);
          for (let i = 19968; i <= 40959 + 1; i++) {
            let char = String.fromCharCode(i);
            let glyphIndex = Typr$1.U.codeToGlyph(font, i);
            const path = Typr$1.U.glyphToPath(font, glyphIndex);
            let hash2 = md5Exports.md5(JSON.stringify(path));
            tables[char] = hash2;
          }
          resolve(tables);
        },
        onerror: function(error) {
          resolve({});
        }
      });
    });
  };
  const ykt = [
    {
      type: "hook",
      name: "hook",
      match: location.host.includes("yuketang.cn"),
      main: (data) => {
        _unsafeWindow.mainClass = $("#app")[0].__vue__.$route.name;
        log(_unsafeWindow.mainClass, "success");
        let observer = new MutationObserver(async (mutations) => {
          if (_unsafeWindow.mainClass !== $("#app")[0].__vue__.$route.name) {
            _unsafeWindow.mainClass = $("#app")[0].__vue__.$route.name;
            vuePageChange();
            observer.disconnect();
          }
        });
        if ($("#app").length >= 1) {
          observer.observe($("#app")[0], {
            subtree: true,
            attributes: true,
            childList: true
          });
        }
      }
    },
    {
      type: "ask",
      name: "雨课堂考试",
      tips: "雨课堂暂时未开发完，仅支持选择判断",
      match: () => location.host.includes("yuketang.cn") && location.href.includes("/exam/"),
      question: {
        html: ".exercise-item",
        question: ".content",
        options: ".el-checkbox__label,.el-radio__label",
        type: ".question-box .tag",
        workType: "xinwei",
        pageType: "xinwei"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".exercise-item").length !== 0;
        });
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        const ques = item.html.__vue__.item;
        item.type = typeChange(ques.TypeText);
        item.question = titleClean(removeHtml1(ques.Body)).trim();
        const options = {};
        ques.Options && ques.Options.forEach((item1) => {
          options[item1.key] = removeHtml1(item1.value);
        });
        item.options = ques.Options.sort((a, b) => {
          return a.key.charCodeAt(0) - b.key.charCodeAt(0);
        }).map((item1) => {
          return removeHtml1(item1.value);
        });
        switch (item.type) {
          case "0":
          case "1":
            break;
          case "2":
            item.options = [];
            break;
          case "3":
            item.options = [];
            break;
        }
        return item;
      },
      setAnswer: (item) => {
        switch (item.type) {
          case "3":
            item.ques.$options.get().forEach((element) => {
              isFalse(item.answer) && $(element).find(".el-icon-close").length > 0 && element.click();
              isTrue(item.answer) && $(element).find(".el-icon-check").length > 0 && element.click();
            });
            return false;
        }
        return true;
      },
      finish: (item) => {
      }
    },
    {
      type: "ask",
      name: "雨课堂作业",
      tips: "雨课堂仅兼容选择判断，其他题型请反馈给作者。雨课堂作业请务必开启自动切换，否则无法自动答题或导致答题错乱",
      match: () => location.host.includes("yuketang.cn") && location.href.includes("cloud/student/exercise"),
      question: {
        html: ".subject-item.J_order",
        question: ".content",
        options: ".el-radio__label",
        type: ".question-box .tag",
        workType: "yuketang",
        pageType: "yuketang"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".el-icon-loading").length == 0 && $(".container-problem").length > 0 && $(".container-problem")[0].__vue__ && $(".container-problem")[0].__vue__.exerciseList;
        });
        const yktQues = $(".container-problem")[0].__vue__.exerciseList;
        if (!yktQues) {
          msg("未找到题目");
          return;
        }
        msg("正在下载字体包，请耐心等待");
        _unsafeWindow.ttfTable = await ttfDownload(yktQues.font);
        _unsafeWindow.problems = yktQues.problems;
      },
      // 跳转指定
      toquestion: (index) => {
        $(`.aside-body ul>li:eq(${index}) .subject-item`).click();
      },
      // 下一题
      next: () => {
        $('.el-button.el-button--text:contains("下一题")').click();
      },
      ischecked: (item) => {
        return item.hasClass("is-checked");
      },
      questionHook: (item, index) => {
        if ($(".el-button.el-button--info.is-disabled.is-plain").length > 0) {
          return;
        }
        const problem = _unsafeWindow.problems[index];
        const ttfTable = _unsafeWindow.ttfTable;
        const content = problem.content;
        problem.user;
        const table = JSON.parse(_GM_getResourceText("ttf2"));
        item.question = titleClean(removeHtml1(yktDecode(table, ttfTable, content.Body))).trim();
        item.type = typeChange(content.TypeText);
        item.$options = () => {
          return $(".item-body ul>li>label");
        };
        const options = {};
        if (content.Options) {
          content.Options.map((item1) => {
            options[item1.key] = removeHtml1(yktDecode(table, ttfTable, item1.value));
          });
          item.options = content.Options.sort(
            (a, b) => {
              return a.key.charCodeAt(0) - b.key.charCodeAt(0);
            }
          ).map((item1) => {
            return removeHtml1(yktDecode(table, ttfTable, item1.value));
          });
        }
        switch (item.type) {
          case "0":
          case "1":
            break;
          case "2":
            item.question = removeHtml1(item.question.replace(/\[填空\d\]/g, ""));
            break;
          case "3":
            item.options = [];
            break;
          default:
            log("未知题型", item.type, "error");
            break;
        }
        return item;
      },
      setAnswerHook: (item) => {
      },
      setAnswer: (item) => {
        switch (item.type) {
          case "3":
            $(".item-body ul>li").get().forEach((element) => {
              isFalse(item.answer) && $(element).find('use[*|href="#icon--tiankongticuowu"]').length > 0 && $(element).find("label").click();
              isTrue(item.answer) && $(element).find('use[*|href="#icon--tiankongtizhengque"]').length > 0 && $(element).find("label").click();
            });
            return false;
        }
        return true;
      },
      finish: (item) => {
      }
    },
    {
      type: "save",
      name: "考试收录",
      match: () => location.host.includes("yuketang.cn") && location.href.includes("/result/"),
      question: {
        html: ".subject-item > .result_item",
        question: "h4.clearfix.exam-font",
        options: "ul.list-unstyled li",
        type: ".item-type",
        workType: "yuketang",
        pageType: "yuketang"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".subject-item").length;
        });
      },
      answerHook: (item, index) => {
        const ques = item.html.__vue__.item;
        item.type = typeChange(ques.TypeText);
        const options = {};
        if (ques.Options) {
          ques.Options.forEach((item1) => {
            options[item1.key] = removeHtml1(item1.value);
          });
          item.options = ques.Options.sort((a, b) => {
            return a.key.charCodeAt(0) - b.key.charCodeAt(0);
          }).map((item1) => {
            return removeHtml1(item1.value);
          });
        }
        item.question = titleClean(removeHtml1(ques.Body)).trim();
        switch (item.type) {
          case "0":
          case "1":
            if (typeof ques.Answer === "string") {
              item.answer = ques.Answer.split("").map((item2) => {
                return options[item2];
              });
            } else if (typeof ques.Answer === "object") {
              item.answer = ques.Answer.map((item2) => {
                return options[item2];
              });
            }
            break;
          case "2":
            log(ques.Blanks, "error");
            item.answer = ques.Blanks.map((aa) => {
              return removeHtml1(aa.Answers[0]);
            });
            break;
          case "3":
            item.options = [];
            isTrue(ques.Answer[0]) ? item.answer = ["正确"] : isFalse(ques.Answer[0]) ? item.answer = ["错误"] : item.answer = [];
            break;
        }
        return item;
      }
    },
    {
      type: "save",
      name: "作业收录",
      match: () => location.host.includes("yuketang.cn") && location.href.includes("cloud/student/exercise"),
      question: {
        html: ".dot",
        question: "h4.clearfix.exam-font",
        options: "ul.list-unstyled li",
        type: ".item-type",
        workType: "yuketang",
        pageType: "yuketang"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".el-icon-loading").length == 0 && $(".container-problem").length > 0 && $(".container-problem")[0].__vue__ && $(".container-problem")[0].__vue__.exerciseList;
        });
        await waitUntil(function() {
          return $(".el-button.el-button--info.is-disabled.is-plain").length != 0;
        });
        const yktQues = $(".container-problem")[0].__vue__.exerciseList;
        if (!yktQues) {
          msg("未找到题目");
          return;
        }
        msg("正在下载字体包，请耐心等待");
        _unsafeWindow.ttfTable = await ttfDownload(yktQues.font);
        _unsafeWindow.problems = yktQues.problems;
        log($(".container-problem")[0].__vue__.exerciseList, "success");
      },
      answerHook: (item, index) => {
        const problem = _unsafeWindow.problems[index];
        const ttfTable = _unsafeWindow.ttfTable;
        const content = problem.content;
        const user = problem.user;
        const table = JSON.parse(_GM_getResourceText("ttf2"));
        item.question = titleClean(removeHtml1(yktDecode(table, ttfTable, content.Body))).trim();
        item.type = typeChange(content.TypeText);
        const options = {};
        if (content.Options) {
          content.Options.map((item1) => {
            options[item1.key] = removeHtml1(yktDecode(table, ttfTable, item1.value));
          });
          item.options = content.Options.sort(
            (a, b) => {
              return a.key.charCodeAt(0) - b.key.charCodeAt(0);
            }
          ).map((item1) => {
            return removeHtml1(yktDecode(table, ttfTable, item1.value));
          });
        }
        switch (item.type) {
          case "0":
          case "1":
            if (typeof user.answer === "string") {
              item.answer = user.answer.split("").map((item2) => {
                return options[item2];
              });
            } else if (typeof user.answer === "object") {
              item.answer = user.answer.map((item2) => {
                return options[item2];
              });
            }
            break;
          case "2":
            item.question = removeHtml1(item.question.replace(/\[填空\d\]/g, ""));
            item.answer = content.Blanks.map((xx) => {
              return removeHtml1(xx[0]);
            });
            item.answer = item.answer.filter((item2) => {
              return item2 !== "undefined";
            });
            if (item.answer.length != content.blank_count) {
              log("填空题数量不对", item.answer, "error");
              item.answer = [];
              log(user.answers, "error");
              item.answer = Object.values(user.answers).map((xx) => {
                return removeHtml1(xx[0]);
              });
            }
            break;
          case "3":
            item.options = [];
            isTrue(user.answer[0]) ? item.answer = ["正确"] : isFalse(user.answer[0]) ? item.answer = ["错误"] : item.answer = [];
            break;
        }
        return item;
      }
    }
  ];
  const ahjxjy = [
    {
      type: "ask",
      name: "安徽继续教育答题",
      tips: "该平台仅支持单选、多选、判断题型，其他题型暂不支持",
      match: () => location.host === "main.ahjxjy.cn" && (location.href.includes("study/html/content/studying/?courseOpenId=") || location.href.includes("study/html/content/sxsk/?courseOpenId=")),
      question: {
        html: ".e-q-body>.e-q",
        question: ".ErichText",
        options: "ul>li>.ErichText",
        type: ".question-box .tag",
        workType: "ahjxjy",
        pageType: "ahjxjy"
      },
      init: async () => {
        await waitUntil(function() {
          log(isExist(".e-save"));
          return isExist(".e-q-body>.e-q") && isExist(".e-save");
        });
        if (!isExist(".photo-time")) {
          return false;
        }
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().parent().hasClass("is-checked");
      },
      questionHook: (item) => {
        item.type = $(item.html).parent().parent().attr("id").trim();
        switch (item.type) {
          case "2":
            item.type = "1";
            break;
          case "1":
            item.type = "0";
            break;
          case "3":
            item.type = "3";
            item.$options = $(item.html).find("ul>li");
            break;
          default:
            log("暂未适配当前题型", item.type, "error");
            return;
        }
        return item;
      },
      setAnswer: (item) => {
        return true;
      },
      finish: (item) => {
      }
    },
    {
      type: "save",
      name: "安徽继续教育收录",
      tips: "该平台仅支持单选、多选、判断题型，其他题型暂不支持",
      match: () => location.host === "main.ahjxjy.cn" && (location.href.includes("study/html/content/studying/?courseOpenId=") || location.href.includes("study/html/content/sxsk/?courseOpenId=")),
      question: {
        html: ".e-q-body>.e-q",
        question: ".ErichText",
        options: "ul>li>.ErichText",
        type: ".question-box .tag",
        workType: "ahjxjy",
        pageType: "ahjxjy"
      },
      init: async () => {
        await waitUntil(function() {
          log(isExist(".e-save"));
          return isExist(".e-q-body>.e-q") && isExist(".e-save");
        });
        if (!isExist(".totalscore")) {
          return false;
        }
      },
      answerHook: (item) => {
        item.type = $(item.html).parent().parent().attr("id").trim();
        item.$options = $(item.html).find("ul>li");
        let an = $(item.html).find("ul>li.checked").map((index, element) => {
          return removeHtml1($(element).find(".ErichText").html());
        }).get();
        const isT = $(item.html).find(".e-q-right").length > 0;
        item.answer = an.filter((item2) => item2 !== "");
        let ckAnswer = $(item.html).find(".e-ans-ref .e-ans-r").map((index, element) => {
          return removeHtml1($(element).html());
        }).get();
        if (ckAnswer.length === 1 && ckAnswer[0].length > 1) {
          ckAnswer = ckAnswer[0].split("、");
        }
        let ans = ckAnswer.map((item1) => {
          let index = item1.charCodeAt() - 65;
          return item.options[index];
        }).filter((item1) => item1 !== "" && item1 !== void 0);
        switch (item.type) {
          case "2":
            item.type = "1";
            break;
          case "1":
            item.type = "0";
            break;
          case "3":
            item.type = "3";
            item.answer = $(item.html).find("ul>li.checked").map((index, element) => {
              return removeHtml1($(element).html());
            }).get();
            item.options = [];
            isTrue(item.answer[0]) ? item.answer = ["正确"] : isFalse(item.answer[0]) ? item.answer = ["错误"] : item.answer = [];
            break;
          case "11":
            item.type = "19";
            const quesList = $(item.html).find("form").map((index, element) => {
              return {
                type: "0",
                question: removeHtml1($(element).find(".e-q-q .ErichText").html()),
                options: $(element).find("ul li .ErichText").map((index2, element2) => {
                  return removeHtml1($(element2).html());
                }).get()
              };
            }).get();
            ans = ans.length > 0 ? isTrue(ans[0]) ? ["正确"] : isFalse(ans[0]) ? ["错误"] : [] : [];
            item.options = quesList;
          default:
            log("暂未适配当前题型", item.type, "error");
            return;
        }
        if (ans.length > 0) {
          item.answer = ans;
          return item;
        }
        if (!isT && item.type === "3" && item.answer.length > 0) {
          item.answer = isTrue(item.answer[0]) ? ["错误"] : isFalse(item.answer[0]) ? ["正确"] : [];
        } else if (!isT) {
          return;
        }
        return item;
      }
    }
  ];
  const qingshu = [
    {
      type: "save",
      name: "青书作业答题收录",
      match: () => location.host === "degree.qingshuxuetang.com" && (location.href.includes("/dhlg/Student/ExercisePaper?courseId=") || location.href.includes("dhlg/Student/ViewQuiz?quizId=")),
      question: {
        html: ".question-detail-container",
        question: ".question-detail-description",
        options: ".question-detail-options .question-detail-option .option-description-preview",
        type: ".question-detail-type-desc",
        workType: "qingshu",
        pageType: "qingshu"
      },
      init: async () => {
        await waitUntil(function() {
          return isExist(".question-detail-container") && _unsafeWindow.qsques;
        });
      },
      answerHook: (item, index) => {
        const ques = _unsafeWindow.qsques[index];
        item.question = removeHtml1(ques.description);
        item.options = ques.options ? ques.options.map((v) => {
          return removeHtml1(v.description);
        }) : [];
        item.type = typeChange(ques.typeDesc);
        switch (item.type) {
          case "0":
          case "1":
            item.answer = ques.solution.split("").map((v) => {
              return item.options[v.charCodeAt(0) - 65];
            });
            break;
          default:
            return;
        }
        return item;
      }
    },
    {
      type: "ask",
      name: "青书学堂作业答题",
      tips: "青书学堂仅支持选择、判断等题型，其他题型请反馈给作者",
      match: () => location.host === "degree.qingshuxuetang.com" && location.href.includes("/dhlg/Student/ExercisePaper?courseId="),
      question: {
        html: ".question-detail-container",
        question: ".question-detail-description",
        options: ".question-detail-options .question-detail-option .option-description",
        type: ".question-detail-type-desc",
        workType: "qingshu",
        pageType: "qingshu"
      },
      init: async () => {
        await waitUntil(function() {
          return isExist(".question-detail-container") && _unsafeWindow.qsques;
        });
      },
      next: () => {
      },
      ischecked: (item) => {
        return item.parent().find("input").prop("checked");
      },
      toquestion: (index) => {
        log($(`.answered.group_item:eq(${index})`));
        $(`.answered.group_item:eq(${index})`).click();
      },
      questionHook: (item, index) => {
        const ques = _unsafeWindow.qsques[index];
        item.question = removeHtml1(ques.description);
        item.options = ques.options ? ques.options.map((v) => {
          return removeHtml1(v.description);
        }) : [];
        item.type = typeChange(ques.typeDesc);
        return item;
      },
      setAnswer: (item) => {
        return true;
      },
      finish: (item) => {
      }
    }
  ];
  const uooc = [
    {
      type: "save",
      name: "优课在线收录",
      match: () => location.host === "cce.org.uooconline.com" && (location.href.includes("/exam/paper") || location.href.includes("/exam/")),
      question: {
        html: ".queContainer",
        question: ".topic-title",
        options: ".el-radio-group label .label,.el-checkbox-group label .label",
        type: ".question-box .tag",
        workType: "xinwei",
        pageType: "xinwei"
      },
      init: async () => {
        await waitUntil(function() {
          return $(".queContainer").length !== 0;
        });
      },
      answerHook: (item) => {
        const ques = _unsafeWindow.angular.element(item.html).scope().question;
        item.type = typeChange(ques.type_text);
        item.question = ques.question;
        item.options = ques.options_app.map((item2) => item2.value);
        item.answer = ques.answer.map((ans) => {
          return ques.options[ans];
        });
        switch (item.type) {
          case "3":
            item.options = [];
            item.answer = isTrue(item.answer[0]) ? ["正确"] : isFalse(item.answer[0]) ? ["错误"] : [];
            break;
        }
        return item;
      }
    }
  ];
  const _ruleList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    ahjxjy,
    chaoxing,
    chatglm,
    chengjiaoyun,
    cnzx,
    guokai,
    jsou,
    qingshu,
    uooc,
    xinwei,
    ykt,
    yunmuxueyuan,
    zhihuishu,
    zhijiaoyun
  }, Symbol.toStringTag, { value: "Module" }));
  const rule = [];
  for (const key2 in _ruleList) {
    rule.push(..._ruleList[key2]);
  }
  const parseRuleHook = (rule2) => {
    rule2.filter((item) => item.match && item.hook).forEach((item) => {
      item.hook();
    });
  };
  const parseRule = async (rule2) => {
    await waitUntil(() => _unsafeWindow[key] !== void 0);
    const matchedRule = rule2.filter((item) => {
      if (typeof item.match === "function") {
        return item.match();
      }
      return item.match;
    });
    if (!matchedRule.length) {
      console.log("没有匹配到规则", "error");
      return;
    }
    const app = wapp();
    for (const item of matchedRule) {
      console.log(`匹配到规则：${item.name}`, "success");
      if (item.init) {
        let init = await item.init();
        if (typeof init == "boolean" && init === false) {
          continue;
        }
      }
      if (item.type === "hook")
        item.main(app);
      if (item.type === "ask")
        askParser(item, app);
      if (item.type === "save")
        saveParser(item, app);
    }
  };
  const saveParser = (rule2, data) => {
    const app = data.app;
    const ask = data.ask;
    ask.rule = rule2;
    rule2.tips && (ask.tips = rule2.tips);
    const quesList = questionSaveParser(rule2.question, rule2.answerHook || null).filter((item) => {
      if (item == null || item.answer.length === 0 || item.answer === "") {
        return false;
      }
      return true;
    });
    ask.saveQuestionData = quesList;
    quesList.forEach((item) => {
      if (item.answer.length !== 0) {
        Answer.cacheAnswer(item);
      }
    });
    const postData = {
      "questionList": quesList,
      "pageType": rule2.question.pageType
    };
    app.setPage("question");
    quesList.length && Answer.syncQuestionList(postData);
    msg(`题库收录完成，共缓存${quesList.length}道题目`, "success");
    rule2.next && rule2.next();
  };
  const askParser = (rule2, data) => {
    const app = data.app;
    const ask = data.ask;
    ask.rule = rule2;
    rule2.tips && (ask.tips = rule2.tips);
    app.app.showFloat = true;
    app.setPage("ask");
    ask.clearQuestion();
    const quesList = questionParser(rule2.question, rule2.questionHook || null);
    quesList.forEach((item) => {
      ask.addQuestion(item);
    });
    ask.autoAnswer && ask.toggleStart();
  };
  const questionSaveParser = (item, hook) => {
    const quesLIst = $(item.html).map((index, element) => {
      const questionText = removeHtml1($(element).find(item.question).html());
      const options = $(element).find(item.options).map((index2, element2) => {
        return removeHtml1($(element2).html());
      }).get();
      const questionTypeId = $(element).find(item.type).val();
      const html2 = $(element)[0];
      let questionData = {
        question: titleClean(questionText ?? ""),
        options,
        $options: $(element).find(item.options),
        $answer: $(element).find(item.answer),
        answer: [],
        type: questionTypeId,
        html: html2
      };
      hook && (questionData = hook(questionData, index));
      if (questionData == void 0 || questionData == null) {
        return null;
      }
      return {
        question: questionData.question,
        options: questionData.options,
        answer: questionData.answer,
        type: questionData.type
      };
    });
    return quesLIst.get();
  };
  const questionParser = (item, hook) => {
    const quesLIst = $(item.html).map((index, element) => {
      const questionText = removeHtml1($(element).find(item.question).html());
      const options = $(element).find(item.options).map((index2, element2) => {
        return removeHtml1($(element2).html());
      }).get();
      const questionTypeId = $(element).find(item.type).val();
      const workType = item.workType;
      const html2 = $(element)[0];
      let questionData = {
        question: titleClean(questionText ?? ""),
        options,
        $options: $(element).find(item.options),
        type: questionTypeId,
        html: html2,
        workType,
        pageType: item.pageType
      };
      hook && (questionData = hook(questionData, index));
      return questionData;
    });
    return quesLIst.get();
  };
  const defaultSetAnswer = async (type, answer, ques, rule2) => {
    var _a;
    switch (type) {
      case "xx":
        for (let i = 0; i < ques.$options.length; i++) {
          if (answer.includes(i)) {
            if (rule2.ischecked && rule2.ischecked(ques.$options.eq(i))) {
              continue;
            }
            ques.$options.eq(i).click();
            await sleep(Math.floor(Math.random() * 300 + 200));
          } else if (rule2.ischecked && rule2.ischecked(ques.$options.eq(i))) {
            ques.$options.eq(i).click();
            await sleep(Math.floor(Math.random() * 300 + 200));
          }
        }
        break;
      case "pd":
        let bold = answer;
        if (ques.options.length == 0) {
          ques.$options.each((index, element) => {
            if (isTrue(bold) && isTrue(removeHtml1($(element).html()))) {
              $(element).click();
            }
            if (isFalse(bold) && isFalse(removeHtml1($(element).html()))) {
              $(element).click();
            }
          });
        } else {
          ques.$options.each((index, element) => {
            if (isTrue(bold) && isTrue(ques.options[index])) {
              $(element).click();
            }
            if (isFalse(bold) && isFalse(ques.options[index])) {
              $(element).click();
            }
          });
        }
        break;
      case "jd":
        $(ques.html).find("textarea").each(function(index) {
          _unsafeWindow.UE.getEditor($(this).attr("name")).ready(function() {
            this.setContent(answer[index].replace(/第.空:/g, ""));
          });
        });
        (_a = $(ques.html).find(".savebtndiv>a")) == null ? void 0 : _a.click();
        break;
    }
  };
  const ApiAnswerMatch = (res, ques) => {
    const data = wapp();
    const ask = data.ask;
    let blankNum = 0;
    let answer;
    let setHook = true;
    let type = ques.type, html2 = ques.html;
    let matchArr = [];
    let answerData = [
      "",
      matchArr,
      ques,
      ask.rule
    ];
    if (ques.$options && typeof ques.$options === "function") {
      ques.$options = ques.$options();
    }
    switch (type) {
      case "0":
      case "1":
        for (let i = 0; i < res.length; i++) {
          let answer2 = res[i].answer;
          let matchArr2 = matchAnswer(answer2, ques.options);
          res[i].match = matchArr2;
        }
        matchArr = res.filter((item) => item.match.length > 0);
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        if (matchArr.length > 1) {
          let isSame = matchArr.every((item) => item.match.length === matchArr[0].match.length);
          if (!isSame) {
            let max = matchArr[0];
            for (let i = 1; i < matchArr.length; i++) {
              if (matchArr[i].match.length > max.match.length) {
                max = matchArr[i];
              }
            }
            matchArr = [max];
          }
        }
        let selectM = matchArr[0].match;
        answerData[0] = "xx";
        answerData[1] = selectM;
        break;
      case "3":
        matchArr = res.map((item) => {
          let answer2 = item.answer;
          if (typeof answer2 === "object") {
            answer2 = answer2[0];
          }
          if (isTrue(answer2)) {
            item.answer = "正确";
          } else if (isFalse(answer2)) {
            item.answer = "错误";
          } else {
            item.answer = "";
          }
          return item;
        });
        matchArr = res.filter((item) => item.answer !== "");
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        answerData[0] = "pd";
        answerData[1] = matchArr[0].answer;
        break;
      case "2":
      case "9":
      case "4":
      case "5":
      case "6":
      case "7":
        blankNum = $(html2).find("textarea").length;
        matchArr = res.filter((item) => item.answer.length > 0);
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        answer = matchArr[0].answer;
        if (typeof answer === "string") {
          answer = [answer];
        }
        matchArr = matchArr.filter((item) => (typeof item.answer === "string" ? 1 : item.answer.length) === blankNum);
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        answerData[0] = "jd";
        answerData[1] = answer;
        break;
      case "14":
        blankNum = ques.$options.length;
        matchArr = res.filter((item) => item.answer.length > 0 && item.answer.length === blankNum);
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        answer = matchArr[0].answer;
        matchArr = matchArr.filter((item) => (typeof item.answer === "string" ? 1 : item.answer.length) === blankNum);
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        answerData[0] = "wxtk";
        answerData[1] = answer;
        break;
      case "11":
        matchArr = res.filter((item) => {
          return typeof item.answer === "object";
        });
        if (matchArr.length === 0) {
          return {
            res,
            haveAnswer: false
          };
        }
        answer = matchArr[0].answer;
        answerData[0] = "lx";
        answerData[1] = answer;
        break;
      default:
        return {
          res,
          haveAnswer: false
        };
    }
    if (ask.rule.setAnswerHook && typeof ask.rule.setAnswerHook === "function") {
      ask.rule.setAnswerHook({
        type,
        answer: answerData[1],
        html: ques.html,
        ques
      });
    }
    if (ask.rule.setAnswer && typeof ask.rule.setAnswer === "function") {
      setHook = ask.rule.setAnswer({
        type,
        answer: answerData[1],
        html: html2,
        ques,
        rule: ask.rule
      });
    }
    if (setHook) {
      defaultSetAnswer(answerData[0], answerData[1], ques, ask.rule);
    }
    return {
      res,
      // 采用答案
      form: matchArr ? matchArr[0] : [],
      haveAnswer: true
    };
  };
  const randomAnswerMatch = (res, ques) => {
    const data = wapp();
    const ask = data.ask;
    let setHook = true;
    let type = ques.type, html2 = ques.html;
    let answerData = [
      "",
      [],
      ques,
      ask.rule
    ];
    switch (type) {
      case "0":
      case "1":
        let selectM = [Math.floor(Math.random() * ques.options.length)];
        answerData[0] = "xx";
        answerData[1] = selectM;
        break;
      case "3":
        let bold = Math.random() > 0.5 ? "正确" : "错误";
        answerData[0] = "pd";
        answerData[1] = bold;
        break;
      default:
        return;
    }
    if (ask.rule.setAnswerHook && typeof ask.rule.setAnswerHook === "function") {
      ask.rule.setAnswerHook({
        type,
        answer: answerData[1],
        html: ques.html,
        ques
      });
    }
    if (ask.rule.setAnswer && typeof ask.rule.setAnswer === "function") {
      setHook = ask.rule.setAnswer({
        type,
        answer: answerData[1],
        html: html2,
        ques,
        rule: ask.rule
      });
    }
    if (setHook) {
      defaultSetAnswer(answerData[0], answerData[1], ques, ask.rule);
    }
    return;
  };
  const vuePageChange = async () => {
    if (_unsafeWindow.vuePageChangeLock)
      return;
    _unsafeWindow.vuePageChangeLock = true;
    const data = wapp();
    const app = data.app;
    const ask = data.ask;
    ask.questionInx = 0;
    app.app.showFloat = false;
    app.setPage("home");
    ask.clearQuestion();
    await parseRule(rule);
    _unsafeWindow.vuePageChangeLock = false;
  };
  const comHook = () => {
    Function.prototype.__constructor_back = Function.prototype.constructor;
    Function.prototype.constructor = function() {
      if (arguments && typeof arguments[0] === "string") {
        if ("debugger" === arguments[0]) {
          return;
        }
      }
      return Function.prototype.__constructor_back.apply(this, arguments);
    };
    const get_href = () => {
      return location.href;
    };
    let baseSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
      this.addEventListener("readystatechange", function() {
        switch (true) {
          case /onlineexamh5new.zhihuishu.com/i.test(get_href()):
            if (this.readyState === 4 && (this.response.includes("workExamParts") || this.response.includes("lookHomework"))) {
              const data = JSON.parse(this.response);
              _unsafeWindow.zhsques = data.rt;
            }
            if (this.readyState === 4 && this.responseURL.includes("getAnswerImgInfo")) {
              let ques = {};
              const data = JSON.parse(this.response).rt;
              for (let key2 in JSON.parse(this.response).rt) {
                ques[key2] = zhsimgList[md5Exports.md5(data[key2])];
              }
              _unsafeWindow.zhsimgAnswer = ques;
            }
            break;
          case /icve.com.cn/i.test(location.host):
            log(this.responseURL);
            if (this.readyState === 4 && this.responseURL && this.responseURL.includes("examRecordPaperList")) {
              log(JSON.parse(this.response), "success");
            }
            break;
          case /yuketang.cn/i.test(get_href()):
            break;
          case /degree.qingshuxuetang.com/i.test(get_href()):
            if (this.readyState === 4 && this.responseURL.includes("dhlg/Student/DetailData")) {
              const data = JSON.parse(this.response);
              _unsafeWindow.qsques = data.data.paperDetail.questions;
              log(data.data.paperDetail.questions, "success");
            }
            break;
          case /cce.org.uooconline.com/i.test(get_href()):
            if (this.readyState === 4 && this.responseURL.includes("/exam/view?cid=")) {
              const data = JSON.parse(this.response);
              _unsafeWindow.cceques = data.data.questions;
              log(data.data.questions, "success");
            }
            break;
        }
      }, false);
      return baseSend.apply(this, arguments);
    };
    if (/onlineexamh5new.zhihuishu.com/i.test(get_href())) {
      const baseyxyz = _unsafeWindow.yxyz;
      _unsafeWindow.yxyz = function(a, b) {
        !_unsafeWindow.yxyzpush && (_unsafeWindow.yxyzpush = []);
        let data = baseyxyz(a, b);
        _unsafeWindow.yxyzpush.push({ ...a, data });
        return data;
      };
    }
    if (/icve.com.cn/i.test(get_href())) {
      const baseOpen = _unsafeWindow.open;
      _unsafeWindow.open = function() {
        arguments[2] = "";
        return baseOpen.apply(this, arguments);
      };
    }
  };
  const appConfig = {
    debug: true,
    // 第三方接口
    searchApi: [],
    // 默认显示悬浮窗
    showFloat: false,
    // 右下角看板
    showBoard: true,
    // 检测更新
    checkUpdate: true,
    // key
    key: "",
    gpt: [
      {
        "name": "GLM",
        "desc": "智普清言4.0",
        "api": "http://82.157.105.20:8002/v1/chat/completions",
        "key": ""
      }
    ]
  };
  const appCache = Cache.get("app") || appConfig;
  Object.keys(appConfig).forEach((key2) => {
    if (appCache[key2] === void 0) {
      appCache[key2] = appConfig[key2];
    }
    setApp(appCache);
  });
  function getApp() {
    return Cache.get("app") || appConfig;
  }
  function setApp(config) {
    Cache.set("app", config);
  }
  const scriptInfo = _GM_info.script;
  const ConfigInput = {
    "base": [
      {
        "type": "switch",
        "label": "显示悬浮窗",
        "name": "showFloat",
        "value": appCache.showFloat,
        "desc": "打开页面时是否显示悬浮窗",
        "options": []
      },
      {
        "type": "switch",
        "label": "看板小图标",
        "name": "showBoard",
        "value": appCache.showBoard,
        "desc": "打开页面时是否显示右下角看板",
        "options": []
      },
      {
        "type": "switch",
        "label": "检测更新",
        "name": "checkUpdate",
        "value": appCache.checkUpdate,
        "desc": "打开页面时是否检测更新",
        "options": []
      }
    ]
  };
  const useAppStore = defineStore("app", {
    state: () => ({
      app: appCache,
      script: scriptInfo,
      page: "home",
      ConfigInput
    }),
    actions: {
      setConfig(config) {
        this.app = config;
        Cache.set("app", config);
      },
      // 修改页面
      setPage(page) {
        this.page = page;
      }
    }
  });
  const useAskStore = defineStore("ask", {
    state: () => ({
      questionList: [],
      questionInx: 0,
      // 当前索引
      inx: 0,
      // 定时器
      Interval: 0,
      // 开启答题
      start: false,
      // 跳过已答题
      skipFinish: Cache.get("skipFinish", false),
      // 自动跳转
      autoNext: Cache.get("autoNext", false),
      // 默认开启自动答题
      autoAnswer: Cache.get("autoAnswer", true),
      // 免费题库优先
      freeFirst: Cache.get("freeFirst", true),
      // 无答案随机答题
      randomAnswer: Cache.get("randomAnswer", false),
      // 运行锁
      lock: false,
      // 统计题库
      formMap: {},
      // 问答类型
      type: "cx",
      // 加载状态
      loading: false,
      // 默认msg
      tips: "本脚本仅供学习研究，请勿用于非法用途",
      // 答题延迟
      delay: 1e3,
      saveQuestionData: []
    }),
    actions: {
      addQuestion(questionData) {
        this.questionList.push({
          ...questionData,
          answer: [],
          status: 0,
          aiMsg: ""
        });
      },
      // 清空问题列表
      clearQuestion() {
        this.questionList = [];
      },
      getQuestion() {
        return this.questionList[this.questionInx];
      },
      nextQuestion() {
        if (this.questionInx === this.questionList.length - 1) {
          clearInterval(this.Interval);
          this.start = false;
          return;
        }
        this.questionInx++;
      },
      prevQuestion() {
        if (this.questionInx === 0) {
          return;
        }
        this.questionInx--;
      },
      // 切换到指定问题
      toQuestion(inx) {
        this.questionInx = inx;
        let ques = this.questionList[inx];
        this.rule.toquestion && this.rule.toquestion(inx);
        ques.html.scrollIntoView({ block: "center" });
        if (_unsafeWindow.self !== _unsafeWindow.top) {
          let el = document.querySelector(".el-dialog");
          if (el) {
            el.style.transform = "none";
            let rect = ques.html.getBoundingClientRect();
            el.style.top = `${rect.top - 700}px`;
            if (inx === 0) {
              el.style.top = "0px";
            }
            if (inx === this.questionList.length - 1) {
              if (document.documentElement.scrollHeight > 2e3) {
                el.style.top = `${rect.top - 900}px`;
              }
            }
          }
        }
        ques.html.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.15)";
        setTimeout(() => {
          ques.html.style.boxShadow = "";
        }, 500);
      },
      // 修改题目状态
      setQuestionStatus(inx, status) {
        if (this.questionList[inx] && this.questionList[inx].status != void 0) {
          this.questionList[inx].status = status;
        }
      },
      // 切换答题状态
      async toggleStart() {
        if (this.lock)
          return;
        this.start = !this.start;
        if (!this.start)
          return;
        this.lock = true;
        for (let i = this.questionInx; i < this.questionList.length && this.start; i++) {
          if (this.skipFinish && this.questionList[i].status === 1) {
            continue;
          }
          this.questionInx = i;
          let ques = this.questionList[i];
          if (ques.type === "8") {
            this.setQuestionStatus(i, 2);
            continue;
          }
          await this.reAnswer(i);
          await sleep(this.delay + Math.random() * 1e3);
          this.rule.toquestion && this.rule.toquestion(this.questionInx + 1);
          this.autoNext && this.rule.next && this.rule.next();
        }
        this.autoNext && this.rule.finish && this.rule.finish({
          "question": this.questionList
        });
        this.start = false;
        this.lock = false;
        this.formMap = {};
        this.questionList.forEach((item) => {
          var _a;
          if ((_a = item.form) == null ? void 0 : _a.form) {
            let key2 = item.form.form;
            if (key2) {
              this.formMap[key2] = this.formMap[key2] ? this.formMap[key2] + 1 : 1;
            }
          } else {
            this.formMap["无答案"] = this.formMap["无答案"] ? this.formMap["无答案"] + 1 : 1;
          }
        });
      },
      // 重答指定题
      async reAnswer(inx) {
        let ques = this.questionList[inx];
        this.loading = true;
        let res = await Answer.getCacheAnswer(ques);
        let m = ApiAnswerMatch([res], ques);
        if (!m.haveAnswer) {
          if (this.freeFirst) {
            res = await Answer.getAnswersFree(ques);
            m = ApiAnswerMatch(res, ques);
            if (!m.haveAnswer) {
              let res1 = await Answer.getAnswers(ques);
              res1 = res.concat(res1);
              m = ApiAnswerMatch(res1, ques);
            }
          } else {
            res = await Answer.getAllAnswers(ques);
            m = ApiAnswerMatch(res, ques);
          }
        }
        ques.answer = m.res;
        ques.form = m.form;
        if (!m.haveAnswer) {
          this.randomAnswer && randomAnswerMatch(res, ques);
          this.setQuestionStatus(inx, 2);
        } else {
          this.setQuestionStatus(inx, 1);
        }
        this.loading = false;
      },
      // ai答题
      async aiAnswer(inx) {
        const errorMsg = `AI响应异常，可能是没有获取KEY,请按下方步骤操作  
            1. 打开[智普清言](https://chatglm.cn/main/alltoolsdetail)  
            2. 登录后随便发一条消息即可  
            3. 返回答题页刷新页面  `;
        let ques = this.questionList[inx];
        this.loading = true;
        let text2 = "";
        ques.aiMsg = "";
        text2 += `[${typeChange2(ques.type)}]${ques.question}
`;
        ques.options.forEach((item, inx2) => {
          text2 += `${item}
`;
        });
        switch (ques.type) {
          case "24":
            ques.match.forEach((item, inx2) => {
              text2 += `第一列${item}
`;
            });
            ques.selects[0].forEach((item, inx2) => {
              text2 += `第二列${item.text}
`;
            });
            break;
        }
        await aiAsk(text2, (msg2) => {
          ques.aiMsg += msg2;
          if (ques.aiMsg.length > 0) {
            this.loading = false;
          }
        }, () => {
          this.loading = false;
          if (ques.aiMsg.length <= 0) {
            ques.aiMsg = errorMsg;
          }
        });
      },
      pause() {
        this.start = false;
      },
      restart() {
        this.questionInx = 0;
        this.start = true;
        this.toggleStart();
      }
    },
    getters: {
      // 当前问题
      current() {
        return this.questionList[this.questionInx];
      },
      currentAiMd() {
        const md = markdownit({
          highlight: function(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return '<pre><code class="hljs">' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + "</code></pre>";
              } catch (__) {
              }
            }
            return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>";
          }
        });
        return md.render(this.questionList[this.questionInx].aiMsg);
      }
    }
  });
  const ApiCache = Cache.get("apiList", []);
  const DefApi = {
    name: "",
    url: "",
    method: "GET",
    params: [],
    response: [],
    request: [],
    headers: []
  };
  const DefParam = {
    name: "",
    value: "",
    type: "sys"
  };
  const testQuestionData = {
    "question": "急性吗啡中毒的拮抗剂是:",
    "options": ["纳酪酮", "曲马朵", "尼莫地平", "阿托品", "肾上腺素"],
    "type": "0",
    "questionData": "",
    "workType": "ks"
  };
  const useApiStore = defineStore("api", {
    state: () => ({
      apiList: ApiCache,
      // 当前编辑的接口
      currentApi: DefApi,
      currentParam: DefParam
    }),
    actions: {
      // 删除接口
      deleteApi(index) {
        this.apiList.splice(index, 1);
        Cache.set("apiList", this.apiList);
      },
      // 添加接口
      addApi() {
        this.apiList.push(this.currentApi);
        Cache.set("apiList", this.apiList);
      },
      // 更新接口
      updateApi(index, api) {
        this.apiList[index] = api;
        Cache.set("apiList", this.apiList);
      },
      // 添加参数
      addParam() {
        this.currentApi.params.push({
          name: this.currentParam.name,
          value: this.currentParam.value,
          type: this.currentParam.type
        });
        this.currentParam = DefParam;
      },
      // 删除参数
      deleteParam(index) {
        this.currentApi.params.splice(index, 1);
      },
      // 恢复默认
      reset() {
        this.currentApi = DefApi;
        this.currentParam = DefParam;
      },
      // 编辑接口
      editApi(index) {
        this.currentApi = this.apiList[index];
      },
      // 编辑参数
      editParam(index) {
        this.currentParam = this.currentApi.params[index];
      },
      // 测试API
      testApi(index) {
        let api = this.apiList[index];
        let data = {};
        api.params.forEach((item) => {
          switch (item.value) {
            case "$question":
              data[item.name] = testQuestionData.question;
              break;
            case "$options":
              data[item.name] = testQuestionData.options;
              break;
            case "$typeid":
              data[item.name] = testQuestionData.type;
              break;
            case "$questionData":
              data[item.name] = testQuestionData.questionData;
              break;
            case "$workType":
              data[item.name] = testQuestionData.workType;
              break;
            case "$timestamp":
              data[item.name] = (/* @__PURE__ */ new Date()).getTime();
              break;
            case "$random":
              data[item.name] = Math.random();
              break;
            default:
              data[item.name] = item.value;
          }
        });
        return requestFetch(api.url, api.method, data, {});
      }
    },
    getters: {}
  });
  const mini = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20t='1702363595473'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='9984'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='200'%20height='200'%3e%3cpath%20d='M253.360825%201024l-115.279176-58.836014v-53.205773c-64.888522-68.266667-62.917938-94.728797%2014.075602-153.424055-23.506254-17.594502-63.762474%202.674364-77.275052-36.315051%2047.434777-42.930584%2070.378007-101.062818%2087.972509-162.010172a326.694708%20326.694708%200%200%201%20208.037388-226.617182c4.644948-89.380069%2086.84646-143.430378%20178.478626-112.604811l-35.611272%2090.36536c105.144742%207.319313%20192.413471%2045.041924%20256.316701%20123.302268%2040.537732%2015.483162%2038.84866-34.766735%2069.251959-40.819244l11.964261%2058.27299%2050.390653-27.306667c28.151203%2018.72055-5.207973%2031.951615-10.415945%2052.220482%2014.779381%2020.12811%2028.995739%2040.537732%2044.4789%2060.243573a142.867354%20142.867354%200%200%201%2028.995739%20114.153128c-12.527285%2077.838076-30.262543%20154.831615-41.100756%20233.091958a1276.938557%201276.938557%200%200%200-5.207972%20139.48921h-21.113402l-89.239313-70.378007%209.993677-10.415945-17.735258%2036.878076L731.931271%20959.956014l-39.411683%2023.787766-42.226804-21.113402c-28.151203%2014.075601-52.501993%2036.03354-86.564949%2027.306667l-9.008385-37.863368H332.747216l-26.602886%2071.926323z%20m-9.993677-380.041237l-0.844536%200.985292%20126.680412%2019.705842%2010.838213%2010.978969c-29.277251%2032.373883-19.846598%2074.178419-29.699519%20110.493471L384.404674%20816.38488l-35.189004%2094.869553a412.274364%20412.274364%200%200%200%20233.514227%202.11134l9.712165-26.602886%2012.808797%2015.905429-11.823505%2050.672165%205.348728%204.644949c16.749966-11.682749%2033.218419-24.210034%2050.812921-34.62598a84.453608%2084.453608%200%200%201%2026.039863-5.348728l7.460069%2033.922199L731.931271%20928.145155l52.924262%2014.075601c-1.829828-43.212096-2.955876-80.934708-5.911753-118.516564%200-4.92646-9.852921-9.289897-15.060893-14.075601l-5.630241-23.224742%2014.075601-100.922062h18.72055l3.237389-1.266804c-11.964261%20106.411546%208.023093%20202.266392%2087.127972%20281.512027%208.726873-48.842337%2016.60921-93.321237%2024.632302-137.659381%207.460069-40.96%2015.060893-81.92%2022.520963-122.88%2010.556701-48.420069%2025.476838-97.262405-10.978969-140.756014L886.762887%20602.435739c0-16.468454%201.126048-33.077663%201.126048-49.546117%200-70.378007-53.205773-104.722474-115.982956-76.289759a232.951203%20232.951203%200%200%201-32.936907%209.430652c16.046186-32.373883-3.5189-52.924261-25.476838-70.378006a292.209485%20292.209485%200%200%200-209.304193-70.378007c-11.401237%200.70378-22.802474%200-40.25622%200l45.182681-104.581718c-40.396976%2010.978969-74.037663%2014.779381-94.728798%2045.464192s14.920137%2045.88646%2020.831891%2069.674227C325.005636%20360.194639%20232.528935%20436.343643%20198.606735%20548.948454l-70.378006%20172.707628%2049.123848%203.518901%205.630241%2054.191065c32.514639-26.039863%2026.039863-61.08811%2030.262543-92.898969h17.876014v58.413746l30.966323%206.33402c1.40756-6.615533%202.392852-11.682749%203.659656-16.468453%209.149141-34.625979-19.705842-59.117526-22.380206-91.491409zM205.50378%20822.859656l-6.474777%2020.83189-25.336082%2084.453609c1.548316%208.867629%200%2023.224742%205.067216%2025.476838%2032.373883%2016.046186%2065.733058%2029.277251%20104.159451%2045.745705%2021.113402-65.451546%2063.621718-114.434639%2069.53347-180.871478C315.152715%20802.309278%20281.512027%20786.966873%20247.730584%20774.158076c-17.031478-6.756289-36.315052-10.978969-35.048247%2019.002061z%20m121.753952-38.848659l10.556701-90.224605-48.138557-6.193265v78.964124z%20m-168.907217%2096.980893l23.083987-73.474639c-28.151203-10.415945-47.575533-9.289897-56.302406%2015.483161s2.674364%2042.789828%2032.936907%2057.991478z'%20fill='%23353947'%20p-id='9985'%3e%3c/path%3e%3cpath%20d='M198.606735%20548.948454c33.922199-112.604811%20126.680412-188.472302%20235.907079-192.272715-5.911753-23.787766-41.100756-39.55244-20.83189-69.674227s54.331821-34.485223%2094.728798-45.464192l-45.182681%20104.581718h40.25622a292.209485%20292.209485%200%200%201%20209.304193%2070.378007c21.957938%2017.735258%2042.226804%2038.285636%2025.476838%2070.378007l0.985292-0.985293c-30.966323%2026.743643-32.796151%2059.399038-19.846598%2095.151066l25.195327%2040.96-40.819244-6.193265-103.174158-14.075601-62.214158-93.039725-31.670104%2050.672165c-19.42433-5.630241-26.602887%200.844536-20.691134%2020.691134L464.494845%20579.210997a165.669828%20165.669828%200%200%200-100.077525-17.172234l-10.415945-86.564949L316.560275%20506.721649l-44.338144%2042.226805z%20m255.190653-62.917939l-10.556701-10.556701c-17.172234-17.031478-35.048247-15.060893-47.29402%203.378145s-4.785704%2036.73732%2012.105017%2050.249897c20.12811%2016.046186%2034.907491%209.712165%2045.745704-11.541993%2014.216357-10.838213%2015.201649-21.394914%200-31.81086z'%20fill='%23F5F5F6'%20p-id='9986'%20data-spm-anchor-id='a313x.search_index.0.i5.dc0f3a810XA6r8'%20class='selected'%3e%3c/path%3e%3cpath%20d='M592.442062%20886.762887l-9.712165%2026.602886a412.274364%20412.274364%200%200%201-233.514227-2.11134l35.189004-94.869553-34.062956-30.544055c9.852921-36.315052%200-78.119588%2029.699519-110.493471a198.184467%20198.184467%200%200%200%20105.426254-94.869553c16.327698%202.392852%2026.039863-1.689072%2020.691134-20.691134l31.670104-4.926461L600.887423%20633.402062c0%207.882337-1.970584%2018.01677%201.970584%2023.083986%2030.966323%2038.707904%2023.787766%2080.934708%2014.075601%20123.865292-8.586117%2036.03354-16.468454%2071.363299-24.491546%20106.411547zM442.818419%20663.523849c0%2014.075601-2.81512%2023.64701%200%2026.884398%2020.268866%2020.691134%2020.83189%2045.604948%2019.565086%2071.926323a96.840137%2096.840137%200%200%200%203.237388%2031.107079c5.911753%2020.409622%2012.668041%2041.382268%2038.426392%2044.056633A48.560825%2048.560825%200%200%200%20557.393814%20802.309278a696.601512%20696.601512%200%200%200%2018.579794-80.371683c6.052509-6.474777%2035.470515-2.533608%2018.157526-36.596564z'%20fill='%23F5F5F6'%20p-id='9987'%3e%3c/path%3e%3cpath%20d='M600.605911%20602.013471l103.174158%2014.075601%2040.819244%205.348729c37.863368%209.993677%2022.94323%2041.241512%2026.46213%2065.170034l-14.075601%20100.922062-49.827629%2078.119588-21.394914%2031.529347-10.134433%2021.394914a84.453608%2084.453608%200%200%200-26.039863%205.348728c-17.594502%2010.415945-34.062955%2022.94323-50.812921%2034.62598v-5.207973h-5.067216l11.823505-50.672165c16.046186-61.932646%2032.936907-123.724536%2047.716289-185.938694%205.348729-22.661718-25.476838-68.266667-51.938969-82.62378zM927.300619%20706.735945c-7.460069%2040.96-15.060893%2081.92-22.520963%20122.88-8.023093%2044.338144-15.90543%2088.817045-24.632302%20137.659381-79.10488-79.386392-98.52921-175.241237-87.127973-281.512027z'%20fill='%23B3DCF8'%20p-id='9988'%3e%3c/path%3e%3cpath%20d='M199.029003%20843.691546l6.474777-20.83189h45.604949c2.11134-39.270928-20.972646-30.262543-38.426392-30.121787-1.548316-29.981031%2018.01677-25.758351%2035.048247-18.579793%2034.062955%2013.231065%2067.422131%2028.151203%20104.722474%2044.4789-5.911753%2066.436838-48.420069%20115.419931-69.53347%20180.871478-38.426392-16.186942-71.926323-29.418007-104.159451-45.182681-4.785704-2.252096-3.5189-16.60921-5.067216-25.476838h33.499931l26.321375-70.378007z'%20fill='%2387BC85'%20p-id='9989'%3e%3c/path%3e%3cpath%20d='M738.265292%20486.030515a232.951203%20232.951203%200%200%200%2032.936907-9.430652c62.777182-28.151203%20116.405223%206.615533%20115.982956%2076.289759%200%2016.468454-0.70378%2033.077663-1.126048%2049.546117l1.126048-0.985292-12.105018-2.674365-21.53567%2016.749966-29.981031%208.304605A86.564948%2086.564948%200%200%201%20731.931271%20564.572371c2.392852-26.462131%204.644948-52.924261%207.037801-79.527148z%20m113.730859%2061.79189l-61.369622-52.501993c-3.941168%2035.752027-6.615533%2059.821306-10.275189%2093.180481z'%20fill='%23F5F5F6'%20p-id='9990'%20data-spm-anchor-id='a313x.search_index.0.i3.dc0f3a810XA6r8'%20class=''%3e%3c/path%3e%3cpath%20d='M198.606735%20548.948454h73.615396c-28.151203%2042.226804-74.178419%2076.852784-59.117526%20137.659381-4.22268%2031.810859%202.252096%2066.859107-30.262543%2092.898969l-6.052509-54.472577-49.123849-3.518901z'%20fill='%23AED4EF'%20p-id='9991'%3e%3c/path%3e%3cpath%20d='M927.300619%20706.735945l-134.281238-21.113402-3.237388%201.266804%206.897045-37.863368%2027.025154-7.74158%2031.247835-8.867629%2029.840275-20.691134%202.392853-10.275189-0.422268%200.985292%2030.262543-36.73732c35.752027%2043.77512%2020.83189%2092.617457%2010.275189%20141.037526zM369.625292%20663.946117l-126.680412-19.705842a171.300069%20171.300069%200%200%201%2016.749965-41.100756c21.817182-29.277251%2046.167973-56.302405%2069.533471-84.453608%203.237388%209.149141%206.756289%2018.157526%209.571409%2027.306666q15.623918%2049.123849%2030.966323%2098.52921z'%20fill='%23F5F5F6'%20p-id='9992'%3e%3c/path%3e%3cpath%20d='M763.179107%20810.473127c5.207973%204.644948%2014.075601%209.008385%2015.060893%2014.075602%202.955876%2037.581856%204.081924%2075.304467%205.911753%20118.516563l-52.924262-14.075601-47.9978%2023.787766-7.600825-34.766735c14.075601-1.970584%2020.550378-7.882337%2010.978969-21.817182%2021.394914%2011.682749%2023.787766-9.993677%2033.359175-19.002062z'%20fill='%23AED4EF'%20p-id='9993'%3e%3c/path%3e%3cpath%20d='M601.168935%20634.105842c26.462131%2014.075601%2057.287698%2059.962062%2051.938969%2082.62378-14.075601%2062.214158-31.670103%20124.006048-47.716289%20185.938694L592.442062%20886.762887c8.023093-35.329759%2015.90543-70.378007%2024.35079-105.989279%2010.134433-42.930584%2017.31299-85.157388-14.075601-123.865292-3.5189-4.785704-0.985292-14.920137-1.548316-22.802474zM328.806048%20518.404399c-23.365498%2028.151203-47.716289%2055.457869-69.533471%2084.453608a171.300069%20171.300069%200%200%200-16.749965%2041.100756l0.844536-0.985292-12.386529%2043.07134h-17.876014C198.043711%20625.660481%20243.507904%20591.175258%20272.222131%20548.948454l44.338144-42.226805z'%20fill='%23484F5E'%20p-id='9994'%3e%3c/path%3e%3cpath%20d='M327.257732%20784.010997l-37.581856-17.453746v-78.964124l48.138557%206.193265z'%20fill='%23D55375'%20p-id='9995'%3e%3c/path%3e%3cpath%20d='M823.704192%20641.284399l-27.025154%207.74158-6.897045%2037.863368h-18.72055c-3.5189-23.928522%2011.401237-55.176357-26.46213-65.170034l-25.195327-40.96%2012.527285-16.186942a86.564948%2086.564948%200%200%200%2091.350653%2059.258282zM369.625292%20663.946117v-19.846598l12.245773-12.949553c8.445361%201.266804%2020.409622%206.897045%2024.773059%203.237388%2020.550378-17.031478%2038.989416-36.455808%2058.132233-55.176357l20.972646%201.548316A198.184467%20198.184467%200%200%201%20380.041237%20675.628866z'%20fill='%23484F5E'%20p-id='9996'%3e%3c/path%3e%3cpath%20d='M199.029003%20843.691546l34.485224%2014.075602-26.321375%2070.378007h-33.499931z'%20fill='%23CAE7AF'%20p-id='9997'%3e%3c/path%3e%3cpath%20d='M230.980619%20686.326323l12.386529-43.07134c2.674364%2031.670103%2031.529347%2056.302405%2022.23945%2091.350653-1.266804%204.785704-2.252096%209.852921-3.659656%2016.468453l-30.966323-6.33402z'%20fill='%23F5F5F6'%20p-id='9998'%3e%3c/path%3e%3cpath%20d='M763.179107%20810.473127l-44.056633%2067.703643-11.964261-12.527285%2050.390653-78.4011z'%20fill='%23484F5E'%20p-id='9999'%3e%3c/path%3e%3cpath%20d='M212.682337%20792.737869c17.453746%200%2040.537732-9.149141%2038.426392%2030.121787H205.50378z'%20fill='%23CDEAB1'%20p-id='10000'%3e%3c/path%3e%3cpath%20d='M598.916838%20957.98543l-5.348728-4.644949h5.067216z'%20fill='%23484F5E'%20p-id='10001'%3e%3c/path%3e%3cpath%20d='M464.494845%20579.210997c-19.142818%2018.72055-37.581856%2038.14488-58.132233%2055.176357-4.363436%203.659656-16.327698-1.970584-24.773059-3.237388l-17.172233-69.111203A165.669828%20165.669828%200%200%201%20464.494845%20579.210997z'%20fill='%23AED4EF'%20p-id='10002'%3e%3c/path%3e%3cpath%20d='M364.41732%20562.038763l17.172233%2069.111203-12.245773%2012.949553q-15.342405-49.123849-30.966323-98.52921c-2.81512-9.149141-6.334021-18.157526-9.571409-27.306666l-12.245773-11.541994%2037.4411-30.966323z'%20fill='%23353947'%20p-id='10003'%3e%3c/path%3e%3cpath%20d='M600.605911%20602.013471v31.670103l-62.214158-79.245636-31.670104%204.926461%2031.388592-50.390653z'%20fill='%23484F5E'%20p-id='10004'%3e%3c/path%3e%3cpath%20d='M453.797388%20517.278351c-10.838213%2021.254158-25.617595%2028.151203-45.745704%2011.541993-16.890722-14.075601-24.632302-31.529347-12.105017-50.249897s30.121787-20.409622%2047.29402-3.378145c-23.506254%200.985292-34.766735%2011.541993-29.136495%2039.411684l39.693196%203.096633z'%20fill='%23AED4EF'%20p-id='10005'%3e%3c/path%3e%3cpath%20d='M731.931271%20564.572371l-12.808797%2015.623918c-12.949553-35.752027-11.119725-68.407423%2019.846598-95.151066-2.11134%2026.602887-4.363436%2053.065017-7.037801%2079.527148z'%20fill='%23353947'%20p-id='10006'%3e%3c/path%3e%3cpath%20d='M506.721649%20559.786667c5.348729%2019.002062-4.363436%2023.083986-20.691134%2020.691134-6.193265-19.846598%200.985292-26.321375%2020.691134-20.691134z'%20fill='%23484F5E'%20p-id='10007'%3e%3c/path%3e%3cpath%20d='M453.797388%20485.749003c15.201649%2010.415945%2014.075601%2020.972646%200%2031.529348v-31.81086zM443.240687%20475.192302l10.556701%2010.556701-10.556701-10.556701z'%20fill='%23AED4EF'%20p-id='10008'%3e%3c/path%3e%3cpath%20d='M442.818419%20663.523849l151.312715%2022.098694c17.31299%2034.062955-12.105017%2030.121787-18.157526%2036.596564A696.601512%20696.601512%200%200%201%20557.393814%20802.309278a48.560825%2048.560825%200%200%201-52.783505%2034.907492c-25.758351-2.674364-32.514639-23.64701-38.426391-44.056633a96.840137%2096.840137%200%200%201-3.237389-31.107079c1.266804-26.321375%200-51.235189-19.565086-71.926323-3.378144-2.955876-0.563024-12.386529-0.563024-26.602886z%20m66.296083%20153.987079c41.523024-26.462131%2042.226804-60.38433%2034.766735-98.52921l-55.317113-10.275189c-0.422268%2038.707904-15.201649%2075.163711%2020.550378%20108.804399zM707.158213%20865.649485l11.964261%2012.527285c-9.571409%209.008385-11.964261%2030.684811-33.359175%2019.002062z'%20fill='%23353947'%20p-id='10009'%3e%3c/path%3e%3cpath%20d='M686.185567%20896.756564c9.571409%2014.075601%202.955876%2019.846598-10.978969%2021.817182zM851.996151%20547.822405l-71.644811%2040.678488c3.659656-33.359175%206.334021-57.428454%2010.275189-93.180481z'%20fill='%23353947'%20p-id='10010'%3e%3c/path%3e%3cpath%20d='M884.792302%20611.725636l-29.840275%2020.691134-1.40756-16.890722%2021.53567-16.749966z'%20fill='%23484F5E'%20p-id='10011'%20data-spm-anchor-id='a313x.search_index.0.i4.dc0f3a810XA6r8'%20class='selected'%3e%3c/path%3e%3cpath%20d='M853.544467%20615.526048l1.40756%2016.890722-31.247835%208.867629v-17.453746zM884.792302%20611.725636l-9.712165-12.949554%2012.105018%202.674365z'%20fill='%23353947'%20p-id='10012'%3e%3c/path%3e%3cpath%20d='M443.522199%20474.91079l10.556701%2010.556701v31.951616l-39.693196-3.096633c-6.193265-27.869691%205.630241-38.426392%2029.136495-39.411684z'%20fill='%23F5F5F6'%20p-id='10013'%3e%3c/path%3e%3cpath%20d='M509.114502%20817.510928c-35.752027-33.640687-20.972646-70.378007-20.550378-108.804399l55.317113%2010.275189c7.882337%2038.14488%206.756289%2072.067079-34.766735%2098.52921z'%20fill='%23E25679'%20p-id='10014'%3e%3c/path%3e%3c/svg%3e";
  const _withScopeId = (n) => (vue.pushScopeId("data-v-36b56b47"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "本脚本仅供学习交流，请勿用作任何非法用途。", -1));
  const _hoisted_2$3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "如果有其他平台需要答题功能，请反馈给作者，会根据需求量酌情增加", -1));
  const _hoisted_3$3 = { class: "aah_plat" };
  const _hoisted_4$3 = { key: 0 };
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "Home",
    setup(__props) {
      const appStore = useAppStore();
      scriptInfo$1.script.downloadURL ?? "#";
      const debug = vue.ref(true);
      return (_ctx, _cache) => {
        const _component_el_alert = vue.resolveComponent("el-alert");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createBlock(_component_el_row, null, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_el_col, { span: 24 }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_alert, {
                  type: "info",
                  closable: false
                }, {
                  title: vue.withCtx(() => [
                    _hoisted_1$5,
                    _hoisted_2$3
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_divider, null, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("功能列表")
                  ]),
                  _: 1
                }),
                vue.createElementVNode("div", _hoisted_3$3, [
                  vue.createVNode(_component_el_tag, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("多平台答案检索")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_tag, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("AI辅助答题")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_tag, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("解除复制限制")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_tag, null, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("更多功能待添加..")
                    ]),
                    _: 1
                  })
                ]),
                debug.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$3, [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    plain: "",
                    onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(appStore).setPage("Base"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("基础配置")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    plain: "",
                    onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(appStore).setPage("api"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("题库配置")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    plain: "",
                    onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(appStore).setPage("ask"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("答题页")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    plain: "",
                    onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(appStore).setPage("question"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("本地题库")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    plain: "",
                    onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(appStore).setPage("ai"))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("AI")
                    ]),
                    _: 1
                  })
                ])) : vue.createCommentVNode("", true),
                vue.createVNode(_component_el_divider, null, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("版本信息")
                  ]),
                  _: 1
                }),
                vue.createElementVNode("div", null, [
                  vue.createElementVNode("p", null, [
                    vue.createTextVNode("当前版本号: "),
                    vue.createVNode(_component_el_tag, { type: "primary" }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(scriptInfo$1).script.version), 1)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_button, {
                      size: "small",
                      type: "primary",
                      onClick: vue.unref(updateCheck1)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("检测更新")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  vue.createElementVNode("p", null, [
                    vue.createVNode(_component_el_text, {
                      class: "mx-1",
                      type: "info"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("PS：保持最新版本可以减少BUG的出现哦~")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key2, val] of props) {
      target[key2] = val;
    }
    return target;
  };
  const Home = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-36b56b47"]]);
  const _sfc_main$6 = {};
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("h1", null, "这是一个公告");
  }
  const Note = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$1]]);
  const _hoisted_1$4 = { style: { "margin": "10px" } };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "Base",
    setup(__props) {
      const appStore = useAppStore();
      vue.watch(appStore.app, (newVal) => {
        appStore.setConfig(newVal);
      });
      vue.watch(appStore.ConfigInput, (newVal) => {
        for (let key2 in newVal) {
          for (let key1 in newVal[key2]) {
            let item = newVal[key2][key1];
            appStore.app[item.name] = item.value;
          }
        }
        appStore.setConfig(appStore.app);
      });
      const ConfigInput2 = appStore.ConfigInput;
      return (_ctx, _cache) => {
        const _component_el_alert = vue.resolveComponent("el-alert");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_input_number = vue.resolveComponent("el-input-number");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_checkbox_group = vue.resolveComponent("el-checkbox-group");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_alert, {
            title: "配置修改后会自动保存，直接刷新页面即可",
            type: "info",
            closable: false,
            "show-icon": ""
          }),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ConfigInput2).base, (item1) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
              vue.createVNode(_component_el_row, {
                class: "row-bg",
                justify: "space-between",
                align: "middle"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, { span: 6 }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(item1.label), 1)
                    ]),
                    _: 2
                  }, 1024),
                  vue.createVNode(_component_el_col, {
                    span: 18,
                    style: { "text-align": "right" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        class: "grid-content ep-bg-purple-light",
                        effect: "dark",
                        content: item1.desc || "",
                        placement: "top"
                      }, {
                        default: vue.withCtx(() => [
                          item1.type === "switch" ? (vue.openBlock(), vue.createBlock(_component_el_switch, {
                            key: 0,
                            modelValue: item1.value,
                            "onUpdate:modelValue": ($event) => item1.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : item1.type === "input" ? (vue.openBlock(), vue.createBlock(_component_el_input, {
                            key: 1,
                            modelValue: item1.value,
                            "onUpdate:modelValue": ($event) => item1.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : item1.type === "number" ? (vue.openBlock(), vue.createBlock(_component_el_input_number, {
                            key: 2,
                            modelValue: item1.value,
                            "onUpdate:modelValue": ($event) => item1.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : item1.type === "select" ? (vue.openBlock(), vue.createBlock(_component_el_select, {
                            key: 3,
                            modelValue: item1.value,
                            "onUpdate:modelValue": ($event) => item1.value = $event,
                            placeholder: "请选择"
                          }, {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item1.options, (item2) => {
                                return vue.openBlock(), vue.createBlock(_component_el_option, {
                                  key: item2.value,
                                  label: item2.label,
                                  value: item2.value
                                }, null, 8, ["label", "value"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["modelValue", "onUpdate:modelValue"])) : item1.type === "checkbox" ? (vue.openBlock(), vue.createBlock(_component_el_checkbox_group, {
                            key: 4,
                            modelValue: item1.value,
                            "onUpdate:modelValue": ($event) => item1.value = $event
                          }, {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item1.options, (item2) => {
                                return vue.openBlock(), vue.createBlock(_component_el_checkbox, {
                                  key: item2.value,
                                  label: item2.value,
                                  name: item2.value
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(vue.toDisplayString(item2.label), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["label", "name"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["modelValue", "onUpdate:modelValue"])) : vue.createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1032, ["content"])
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1024)
            ]);
          }), 256))
        ], 64);
      };
    }
  });
  function makeShadow(el, option) {
    return makeShadowRaw(el, el.childNodes, option);
  }
  function makeShadowRaw(rootEl, childNodes, { mode = "open", delegatesFocus = false } = { mode: "open" }) {
    try {
      const oldroot = rootEl.shadowRoot;
      if (oldroot != null) {
        console.error("[shadow] Attach shadow multiple times", rootEl, childNodes, oldroot);
        return;
      } else {
        const shadow_root = rootEl.attachShadow({ mode, delegatesFocus });
        if (childNodes)
          putDomIntoShadow(shadow_root, childNodes);
        return shadow_root;
      }
    } catch (e) {
      console.error("[shadow] make shadow-root failed", rootEl, childNodes);
      console.error(e);
    }
  }
  function putDomIntoShadow(shadow_root, childNodes) {
    const fragment = document.createDocumentFragment();
    for (const node of childNodes) {
      fragment.appendChild(node);
    }
    shadow_root.appendChild(fragment);
  }
  const virtual_root = document.createDocumentFragment();
  const ShadowStyle = vue.defineComponent({
    props: {
      media: String,
      nonce: String
    },
    setup(props, { slots }) {
      return () => {
        var _a;
        return vue.h("style", { media: props.media, nonce: props.nonce }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
  });
  const ShadowRoot = withType()(vue.defineComponent({
    props: {
      mode: {
        type: String,
        default: "open"
      },
      delegatesFocus: {
        type: Boolean,
        default: false
      },
      abstract: {
        type: Boolean,
        default: false
      },
      tag: {
        type: String,
        default: "div"
      },
      adoptedStyleSheets: {
        type: Array
      }
    },
    emits: ["error"],
    setup(props, { slots, expose, emit }) {
      const abstract = vue.ref(false);
      const el = vue.ref();
      const teleport_el = vue.ref();
      const shadow_root = vue.ref();
      const teleport_target = vue.computed(() => shadow_root.value ?? virtual_root);
      const ex = vue.reactive({
        shadow_root
      });
      expose(ex);
      vue.onBeforeMount(() => {
        abstract.value = props.abstract;
      });
      vue.onMounted(() => {
        var _a;
        try {
          if (abstract.value) {
            if (teleport_el.value.parentElement.shadowRoot) {
              shadow_root.value = teleport_el.value.parentElement.shadowRoot;
            } else {
              shadow_root.value = makeShadowRaw(teleport_el.value.parentElement, void 0, {
                mode: props.mode,
                delegatesFocus: props.delegatesFocus
              });
            }
          } else {
            shadow_root.value = makeShadowRaw(el.value, void 0, { mode: props.mode, delegatesFocus: props.delegatesFocus });
          }
          (_a = shadow_root.value) == null ? void 0 : _a.styleSheets;
        } catch (e) {
          console.error(e);
          emit("error", e);
        }
      });
      vue.watch([shadow_root, () => props.adoptedStyleSheets], ([shadow_root2, adoptedStyleSheets]) => {
        if (!shadow_root2 || !adoptedStyleSheets)
          return;
        try {
          ;
          shadow_root2.adoptedStyleSheets = adoptedStyleSheets;
        } catch (e) {
          console.error(e);
          emit("error", e);
        }
      });
      return () => {
        var _a;
        const child_part = vue.h(vue.Teleport, { ref: teleport_el, to: teleport_target.value }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
        if (abstract.value)
          return child_part;
        return vue.h(props.tag, { ref: el }, child_part);
      };
    },
    install,
    Style: ShadowStyle
  }));
  function withType() {
    return (obj) => obj;
  }
  function install(app) {
    app.component("shadow-root", ShadowRoot);
    app.directive("shadow", {
      beforeMount(el) {
        console.warn("[VueShadowDom] Deprecated v-shadow directive, use <shadow-root> component");
        makeShadow(el);
      }
    });
  }
  var shadow = { ShadowRoot, ShadowStyle, shadow_root: ShadowRoot, shadow_style: ShadowStyle, install };
  const _hoisted_1$3 = /* @__PURE__ */ vue.createElementVNode("div", { class: "aah_bomHet50" }, [
    /* @__PURE__ */ vue.createElementVNode("span", { class: "dq" }, [
      /* @__PURE__ */ vue.createElementVNode("i"),
      /* @__PURE__ */ vue.createTextVNode("当前题目")
    ]),
    /* @__PURE__ */ vue.createElementVNode("span", { class: "yp" }, [
      /* @__PURE__ */ vue.createElementVNode("i"),
      /* @__PURE__ */ vue.createTextVNode("已作答")
    ]),
    /* @__PURE__ */ vue.createElementVNode("span", { class: "wp" }, [
      /* @__PURE__ */ vue.createElementVNode("i"),
      /* @__PURE__ */ vue.createTextVNode("无答案")
    ]),
    /* @__PURE__ */ vue.createElementVNode("span", { class: "zp" }, [
      /* @__PURE__ */ vue.createElementVNode("i"),
      /* @__PURE__ */ vue.createTextVNode("未作答")
    ])
  ], -1);
  const _hoisted_2$2 = ["innerHTML"];
  const _hoisted_3$2 = ["innerHTML"];
  const _hoisted_4$2 = { key: 0 };
  const _hoisted_5$2 = { style: { "width": "100%" } };
  const _hoisted_6$2 = ["innerHTML"];
  const _hoisted_7 = ["value"];
  const _hoisted_8 = {
    key: 1,
    style: { "color": "green" }
  };
  const _hoisted_9 = {
    key: 2,
    style: { "color": "red" }
  };
  const _hoisted_10 = { key: 0 };
  const _hoisted_11 = { key: 1 };
  const _hoisted_12 = ["innerHTML"];
  const _hoisted_13 = { key: 0 };
  const _hoisted_14 = ["innerHTML"];
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "Ask",
    setup(__props) {
      const ask = useAskStore();
      const app = useAppStore();
      const getOptionIndex = (inx) => {
        return String.fromCharCode(65 + inx);
      };
      vue.watch(app.app, (newVal) => {
        app.setConfig(newVal);
      });
      const watchAutoNext = () => {
        Cache.set("autoNext", ask.autoNext);
      };
      const watchSkipFinish = () => {
        Cache.set("skipFinish", ask.skipFinish);
      };
      const watchAutoAnswer = () => {
        Cache.set("autoAnswer", ask.autoAnswer);
      };
      const watchFreeFirst = () => {
        Cache.set("freeFirst", ask.freeFirst);
      };
      const watchRandomAnswer = () => {
        Cache.set("randomAnswer", ask.randomAnswer);
      };
      return (_ctx, _cache) => {
        const _component_el_alert = vue.resolveComponent("el-alert");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_tag = vue.resolveComponent("el-tag");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_empty = vue.resolveComponent("el-empty");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_alert, {
            style: { "margin-bottom": "10px" },
            title: vue.unref(ask).tips,
            type: "info",
            closable: false
          }, null, 8, ["title"]),
          vue.unref(ask).current ? (vue.openBlock(), vue.createBlock(_component_el_row, { key: 0 }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_col, { span: 12 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(ask).start ? vue.unref(ask).pause() : vue.unref(ask).toggleStart()),
                    size: "small",
                    class: "aah_btn",
                    type: "primary",
                    plain: ""
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(vue.unref(ask).start ? "暂停答题" : "开始答题"), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, { span: 12 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(ask).restart()),
                    size: "small",
                    class: "aah_btn",
                    type: "primary",
                    plain: ""
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("重新答题")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, { span: 24 }, {
                default: vue.withCtx(() => [
                  _hoisted_1$3
                ]),
                _: 1
              }),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ask).questionList, (val, inx) => {
                return vue.openBlock(), vue.createBlock(_component_el_col, { span: 3 }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(_component_el_button, {
                      class: vue.normalizeClass(inx == vue.unref(ask).questionInx ? "aah_active" : ""),
                      style: { "width": "30px", "margin-bottom": "4px" },
                      key: inx,
                      onClick: ($event) => vue.unref(ask).toQuestion(inx),
                      size: "small",
                      type: val.status == 1 ? "primary" : val.status == 2 ? "danger" : "",
                      plain: ""
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(inx + 1), 1)
                      ]),
                      _: 2
                    }, 1032, ["class", "onClick", "type"]))
                  ]),
                  _: 2
                }, 1024);
              }), 256)),
              vue.createVNode(_component_el_col, { span: 24 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form, { "label-width": "auto" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_checkbox, {
                        onChange: watchSkipFinish,
                        modelValue: vue.unref(ask).skipFinish,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(ask).skipFinish = $event),
                        label: "跳过已作答"
                      }, null, 8, ["modelValue"]),
                      vue.createVNode(_component_el_checkbox, {
                        onChange: watchAutoAnswer,
                        modelValue: vue.unref(ask).autoAnswer,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(ask).autoAnswer = $event),
                        label: "自动答题"
                      }, null, 8, ["modelValue"]),
                      vue.createVNode(_component_el_checkbox, {
                        onChange: watchAutoNext,
                        modelValue: vue.unref(ask).autoNext,
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(ask).autoNext = $event),
                        label: "自动跳转"
                      }, null, 8, ["modelValue"]),
                      vue.createVNode(_component_el_checkbox, {
                        onChange: watchFreeFirst,
                        modelValue: vue.unref(ask).freeFirst,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(ask).freeFirst = $event),
                        label: "免费题库优先"
                      }, null, 8, ["modelValue"]),
                      vue.createVNode(_component_el_checkbox, {
                        onChange: watchRandomAnswer,
                        modelValue: vue.unref(ask).randomAnswer,
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(ask).randomAnswer = $event),
                        label: "无答案随机答题"
                      }, null, 8, ["modelValue"]),
                      vue.createVNode(_component_el_form_item, { label: "秘钥" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            class: "aah_password",
                            placeholder: "请输入你购买的秘钥",
                            modelValue: vue.unref(app).app.key,
                            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(app).app.key = $event),
                            "show-password": ""
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.unref(ask).formMap ? (vue.openBlock(), vue.createBlock(_component_el_col, {
                key: 0,
                span: 24
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ask).formMap, (val, key2) => {
                    return vue.openBlock(), vue.createBlock(_component_el_tag, {
                      key: key2,
                      style: { "margin-right": "10px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(key2) + ":" + vue.toDisplayString(val) + " 次", 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_divider, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[8] || (_cache[8] = ($event) => vue.unref(ask).reAnswer(vue.unref(ask).questionInx)),
                    style: { "color": "red", "font-size": "10px" },
                    link: ""
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("重答")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_divider, { direction: "vertical" }),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[9] || (_cache[9] = ($event) => vue.unref(ask).aiAnswer(vue.unref(ask).questionInx)),
                    style: { "color": "red", "font-size": "10px" },
                    link: ""
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("AI答题")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, { span: 24 }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("div", {
                    class: "aah_title",
                    innerHTML: "[" + vue.unref(typeChange2)(vue.unref(ask).current.type ?? "") + "]" + vue.unref(ask).current.question
                  }, null, 8, _hoisted_2$2),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ask).current.options, (val, inx) => {
                    return vue.openBlock(), vue.createElementBlock("p", {
                      style: vue.normalizeStyle(vue.unref(ask).current.form && vue.unref(ask).current.form.match && vue.unref(ask).current.form.match.includes(inx) ? "color:green;" : ""),
                      class: "aah_options",
                      innerHTML: getOptionIndex(inx) + ". " + val
                    }, null, 12, _hoisted_3$2);
                  }), 256)),
                  vue.unref(ask).current.type == "24" ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_4$2, [
                    vue.createVNode(vue.unref(ShadowRoot), null, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("table", _hoisted_5$2, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ask).current.match, (val, inx) => {
                            return vue.openBlock(), vue.createElementBlock("tr", null, [
                              vue.createElementVNode("td", { innerHTML: val }, null, 8, _hoisted_6$2),
                              vue.createElementVNode("td", null, [
                                vue.createElementVNode("select", null, [
                                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ask).current.selects[inx], (item) => {
                                    return vue.openBlock(), vue.createElementBlock("option", {
                                      value: item.value
                                    }, vue.toDisplayString(item.text), 9, _hoisted_7);
                                  }), 256))
                                ])
                              ])
                            ]);
                          }), 256))
                        ])
                      ]),
                      _: 1
                    })
                  ])) : vue.createCommentVNode("", true),
                  vue.unref(ask).current.form ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_8, " 采用【" + vue.toDisplayString(vue.unref(ask).current.form.form) + "】的答案 ", 1)) : vue.createCommentVNode("", true),
                  vue.unref(ask).current.type == "8" ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_9, " 当前题型暂不支持，请反馈给作者吧 ")) : vue.createCommentVNode("", true)
                ]),
                _: 1
              }),
              vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_col, {
                span: 24,
                "element-loading-text": "正在搜索中"
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ask).current.answer, (item) => {
                    return vue.openBlock(), vue.createElementBlock("div", null, [
                      vue.createVNode(_component_el_divider, null, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(`${item.form}(${item.duration}ms)`), 1)
                        ]),
                        _: 2
                      }, 1024),
                      typeof item.answer === "object" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.answer, (ans) => {
                          return vue.openBlock(), vue.createElementBlock("p", null, [
                            vue.createVNode(_component_el_input, {
                              value: ans,
                              readonly: "",
                              style: { "width": "100%" }
                            }, null, 8, ["value"])
                          ]);
                        }), 256))
                      ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
                        vue.createElementVNode("div", {
                          innerHTML: item.answer ? item.answer : item.msg ?? "暂无答案"
                        }, null, 8, _hoisted_12)
                      ]))
                    ]);
                  }), 256)),
                  vue.unref(ask).current.aiMsg ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
                    vue.createVNode(_component_el_divider, null, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("AI回答(仅供参考)")
                      ]),
                      _: 1
                    }),
                    vue.createElementVNode("div", {
                      innerHTML: vue.unref(ask).currentAiMd
                    }, null, 8, _hoisted_14)
                  ])) : vue.createCommentVNode("", true)
                ]),
                _: 1
              })), [
                [_directive_loading, vue.unref(ask).loading]
              ])
            ]),
            _: 1
          })) : (vue.openBlock(), vue.createBlock(_component_el_empty, {
            key: 1,
            description: "暂无题目数据"
          }))
        ], 64);
      };
    }
  });
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "Api",
    setup(__props) {
      const apiStore = useApiStore();
      const deleteRow = (index) => {
        apiStore.deleteApi(index);
      };
      const paramVisible = vue.ref(false);
      const addParam = () => {
        if (apiStore.currentParam.name == "") {
          ElementPlus.ElNotification({
            title: "参数效验不通过",
            message: "参数名不能为空",
            type: "error"
          });
          return;
        }
        if (apiStore.currentParam.value == "") {
          ElementPlus.ElNotification({
            title: "参数效验不通过",
            message: "参数值不能为空",
            type: "error"
          });
          return;
        }
        const index = apiStore.currentApi.params.findIndex((item) => item.name == apiStore.currentParam.name);
        if (index != -1) {
          apiStore.currentApi.params[index] = apiStore.currentParam;
          ElementPlus.ElNotification({
            title: "更新成功",
            message: "参数已更新",
            type: "success"
          });
          paramVisible.value = false;
          return;
        }
        apiStore.addParam();
        paramVisible.value = false;
      };
      const addApi = () => {
        if (apiStore.currentApi.name == "") {
          ElementPlus.ElNotification({
            title: "参数效验不通过",
            message: "接口名不能为空",
            type: "error"
          });
          return;
        }
        if (apiStore.currentApi.url == "") {
          ElementPlus.ElNotification({
            title: "参数效验不通过",
            message: "接口地址不能为空",
            type: "error"
          });
          return;
        }
        if (apiStore.currentApi.params.length == 0) {
          ElementPlus.ElNotification({
            title: "参数效验不通过",
            message: "参数不能为空",
            type: "error"
          });
          return;
        }
        const index = apiStore.apiList.findIndex((item) => item.name == apiStore.currentApi.name);
        if (index != -1) {
          apiStore.updateApi(index, apiStore.currentApi);
          ElementPlus.ElNotification({
            title: "更新成功",
            message: "接口已更新",
            type: "success"
          });
        }
        apiStore.addApi();
        apiStore.reset();
      };
      const editApi = (index) => {
        apiStore.editApi(index);
      };
      const editParam = (index) => {
        apiStore.editParam(index);
        paramVisible.value = true;
      };
      const testApi = (index) => {
        apiStore.testApi(index).then((res) => {
        }).catch((err) => {
          ElementPlus.ElNotification({
            title: "请求失败",
            message: err,
            type: "error"
          });
        });
      };
      return (_ctx, _cache) => {
        const _component_el_alert = vue.resolveComponent("el-alert");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_alert, {
            title: "当前功能开发中，若您有急需添加的API可以先反馈给作者",
            type: "error"
          }),
          vue.createVNode(_component_el_dialog, {
            modelValue: paramVisible.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => paramVisible.value = $event),
            title: "添加参数",
            style: { "width": "400px" }
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form, {
                model: vue.unref(apiStore).currentParam,
                "label-width": "auto"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form_item, { label: "参数名" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: vue.unref(apiStore).currentParam.name,
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(apiStore).currentParam.name = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "参数类型" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_select, {
                        modelValue: vue.unref(apiStore).currentParam.type,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(apiStore).currentParam.type = $event),
                        placeholder: "请选择"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_option, {
                            label: "内置参数",
                            value: "sys"
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "自定义参数",
                            value: "diy"
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "参数值" }, {
                    default: vue.withCtx(() => [
                      vue.unref(apiStore).currentParam.type == "diy" ? (vue.openBlock(), vue.createBlock(_component_el_input, {
                        key: 0,
                        modelValue: vue.unref(apiStore).currentParam.value,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(apiStore).currentParam.value = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])) : (vue.openBlock(), vue.createBlock(_component_el_select, {
                        key: 1,
                        modelValue: vue.unref(apiStore).currentParam.value,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(apiStore).currentParam.value = $event),
                        placeholder: "请选择"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_option, {
                            label: "题型(字符串)",
                            value: "$type"
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "题型(数字)",
                            value: "$typeid"
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "题干(题目)",
                            value: "$question"
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "选项",
                            value: "$options"
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "时间戳",
                            value: "$timestamp"
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "随机数",
                            value: "$random"
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue"]))
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_button, {
                        onClick: addParam,
                        plain: "",
                        style: { "width": "100%" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("添加")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_table, {
            data: vue.unref(apiStore).apiList,
            style: { "width": "100%", "margin-bottom": "10px" },
            "empty-text": "暂无数据"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table_column, {
                prop: "name",
                label: "接口名",
                width: "120"
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "url",
                label: "接口地址",
                width: "120"
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "method",
                label: "请求方式",
                width: "120"
              }),
              vue.createVNode(_component_el_table_column, {
                fixed: "right",
                label: "操作",
                width: "120"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createVNode(_component_el_button, {
                    link: "",
                    type: "primary",
                    size: "small",
                    onClick: vue.withModifiers(($event) => deleteRow(scope.$index), ["prevent"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" 删除 ")
                    ]),
                    _: 2
                  }, 1032, ["onClick"]),
                  vue.createVNode(_component_el_button, {
                    link: "",
                    type: "primary",
                    size: "small",
                    onClick: vue.withModifiers(($event) => editApi(scope.$index), ["prevent"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" 编辑 ")
                    ]),
                    _: 2
                  }, 1032, ["onClick"]),
                  vue.createVNode(_component_el_button, {
                    link: "",
                    type: "primary",
                    size: "small",
                    onClick: vue.withModifiers(($event) => testApi(scope.$index), ["prevent"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" 测试 ")
                    ]),
                    _: 2
                  }, 1032, ["onClick"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["data"]),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_col, { span: 24 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form, {
                    model: vue.unref(apiStore).currentApi,
                    "label-width": "80px"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_form_item, { label: "接口名" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: vue.unref(apiStore).currentApi.name,
                            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(apiStore).currentApi.name = $event),
                            placeholder: "请输入接口名"
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_form_item, { label: "接口地址" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: vue.unref(apiStore).currentApi.url,
                            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(apiStore).currentApi.url = $event),
                            placeholder: "请输入接口地址"
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_form_item, { label: "请求方式" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_select, {
                            modelValue: vue.unref(apiStore).currentApi.method,
                            "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(apiStore).currentApi.method = $event),
                            placeholder: "请选择"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_option, {
                                label: "GET",
                                value: "GET"
                              }),
                              vue.createVNode(_component_el_option, {
                                label: "POST",
                                value: "POST"
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_form_item, { label: "请求参数" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_table, {
                            data: vue.unref(apiStore).currentApi.params,
                            style: { "width": "100%" },
                            "empty-text": "暂无参数"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_table_column, {
                                prop: "name",
                                label: "参数名",
                                width: "120"
                              }),
                              vue.createVNode(_component_el_table_column, {
                                prop: "value",
                                label: "参数值",
                                width: "120"
                              }),
                              vue.createVNode(_component_el_table_column, {
                                fixed: "right",
                                label: "操作",
                                width: "120"
                              }, {
                                default: vue.withCtx((scope) => [
                                  vue.createVNode(_component_el_button, {
                                    link: "",
                                    type: "primary",
                                    size: "small",
                                    onClick: vue.withModifiers(($event) => vue.unref(apiStore).deleteParam(scope.$index), ["prevent"])
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(" 删除 ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"]),
                                  vue.createVNode(_component_el_button, {
                                    link: "",
                                    type: "primary",
                                    size: "small",
                                    onClick: vue.withModifiers(($event) => editParam(scope.$index), ["prevent"])
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(" 编辑 ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["data"]),
                          vue.createVNode(_component_el_button, {
                            type: "primary",
                            onClick: _cache[8] || (_cache[8] = ($event) => paramVisible.value = true),
                            text: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("添加参数")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_form_item, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            type: "primary",
                            onClick: addApi,
                            plain: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("添加")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["model"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const _sfc_main$2 = {};
  const _hoisted_1$2 = {
    src: "https://chatglm.cn/miniapp/home",
    width: "100%",
    height: "600px",
    frameborder: "0",
    style: { "border": "none", "overflow": "hidden" }
  };
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("iframe", _hoisted_1$2);
  }
  const Ai = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
  const _hoisted_1$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_2$1 = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _hoisted_3$1 = /* @__PURE__ */ vue.createElementVNode("p", { style: { "color": "red" } }, "且并非所有网站都支持，需要作者适配，若您的平台不支持可以反馈给作者", -1);
  const _hoisted_4$1 = ["innerHTML"];
  const _hoisted_5$1 = ["innerHTML"];
  const _hoisted_6$1 = ["innerHTML"];
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Question",
    setup(__props) {
      let showBtn = vue.ref(0);
      window.addEventListener("keydown", (e) => {
        if (e.key === "`") {
          showBtn.value++;
        }
      });
      const ask = useAskStore();
      const questionkey = Cache.match("ques_");
      const clearCache = () => {
        Cache.matchRemove("ques_");
        msg("清除成功", "success");
      };
      const exportCsv = () => {
        const header = ["题型", "题目", "选项", "答案"];
        const data = ask.saveQuestionData.map((item) => [typeChange2(item.type), item.question, item.options.join("###"), item.answer.join("###")]);
        const csv = [header, ...data].map((item) => item.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "question.csv";
        const title = document.title;
        const random = Math.random().toString(36).slice(-8);
        a.download = `${title}的试题导出${random}.csv`;
        a.click();
      };
      const exportCsv1 = () => {
        const header = ["题型", "题目", "选项", "答案"];
        const questionList = Cache.matchGet("ques_") || [];
        console.log(questionList);
        const data = questionList.map((item) => [typeChange2(item.type), item.question, item.options.join("###"), item.answer.join("###")]);
        const csv = [header, ...data].map((item) => item.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "question.csv";
        a.click();
      };
      const changeT = (item) => {
        return typeChange2(item.type);
      };
      return (_ctx, _cache) => {
        const _component_el_alert = vue.resolveComponent("el-alert");
        const _component_el_statistic = vue.resolveComponent("el-statistic");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_popconfirm = vue.resolveComponent("el-popconfirm");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_watermark = vue.resolveComponent("el-watermark");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_alert, {
            type: "info",
            closable: false
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 本脚本支持将存在答案的题目收录到本地，以供后续答题检索，可减少接口请求次数，以及提高答案正确率"),
              _hoisted_1$1,
              vue.createTextVNode(" 在支持重复答题且答完题显示答案的情况下可以无需使用接口搜索答案"),
              _hoisted_2$1,
              _hoisted_3$1
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_watermark, { content: ["爱问答助手", "AiAskHelper"] }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_row, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, { span: 24 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_statistic, {
                        title: "缓存题目数量",
                        value: vue.unref(questionkey).length
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_popconfirm, {
                title: "确定要清空本地缓存吗？",
                "confirm-button-text": "确定",
                "cancel-button-text": "取消",
                onConfirm: clearCache,
                "hide-after": 0
              }, {
                reference: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, { type: "danger" }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("清除缓存")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.unref(showBtn) > 10 ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                key: 0,
                type: "primary",
                onClick: exportCsv
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("导出当前")
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.unref(showBtn) > 10 ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                key: 1,
                type: "primary",
                onClick: exportCsv1
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("导出所有")
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_table, {
                data: vue.unref(ask).saveQuestionData,
                style: { "width": "100%" },
                "empty-text": "当前页暂无数据"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    prop: "type",
                    label: "题型",
                    formatter: changeT
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "question",
                    label: "题目"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createElementVNode("div", {
                        innerHTML: scope.row.question
                      }, null, 8, _hoisted_4$1)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "options",
                    label: "选项"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createElementVNode("div", {
                        innerHTML: scope.row.options.join("<br/>")
                      }, null, 8, _hoisted_5$1)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "answer",
                    label: "答案"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createElementVNode("div", {
                        innerHTML: scope.row.answer.join("<br/>")
                      }, null, 8, _hoisted_6$1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["data"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const _hoisted_1 = { class: "aah_wrapper" };
  const _hoisted_2 = ["src"];
  const _hoisted_3 = ["id"];
  const _hoisted_4 = {
    key: 0,
    class: "aah_breadcrumb"
  };
  const _hoisted_5 = /* @__PURE__ */ vue.createElementVNode("strong", null, "home", -1);
  const _hoisted_6 = ["src"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const appStore = useAppStore();
      const askStore = useAskStore();
      _unsafeWindow[key] = { "app": appStore, "ask": askStore };
      document.onkeydown = function(e) {
        if (e.ctrlKey && e.key == "p") {
          appStore.app.showFloat = !appStore.app.showFloat;
        }
      };
      const logs = () => {
        msg("日志组件开发中....");
      };
      updateCheck();
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_breadcrumb_item = vue.resolveComponent("el-breadcrumb-item");
        const _component_el_breadcrumb = vue.resolveComponent("el-breadcrumb");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_component_el_dialog, {
            modelValue: vue.unref(appStore).app.showFloat,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(appStore).app.showFloat = $event),
            title: "爱问答助手",
            draggable: "",
            overflow: "",
            "show-close": true,
            modal: false,
            "close-on-click-modal": false,
            style: vue.normalizeStyle(vue.unref(appStore).page === "ai" ? "width: 70vh;" : "width: 400px;")
          }, {
            header: vue.withCtx(({ close, titleId, titleClass }) => [
              vue.createElementVNode("img", {
                src: vue.unref(scriptInfo$1).script.icon,
                alt: "icon",
                style: { "width": "20px", "height": "20px", "margin-right": "10px", "vertical-align": "middle" }
              }, null, 8, _hoisted_2),
              vue.createElementVNode("span", {
                id: titleId,
                class: vue.normalizeClass(titleClass)
              }, vue.toDisplayString(`${vue.unref(scriptInfo$1).script.name} - ${vue.unref(scriptInfo$1).script.version}`), 11, _hoisted_3),
              vue.createTextVNode("   "),
              vue.createVNode(_component_el_button, {
                onClick: logs,
                link: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("log")
                ]),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_scrollbar, { "max-height": "55vh" }, {
                default: vue.withCtx(() => [
                  vue.unref(appStore).page != "home" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
                    vue.createVNode(_component_el_breadcrumb, { separator: "/" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_breadcrumb_item, {
                          onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(appStore).setPage("home"))
                        }, {
                          default: vue.withCtx(() => [
                            _hoisted_5
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_breadcrumb_item, null, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(vue.toDisplayString(vue.unref(appStore).page), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])) : vue.createCommentVNode("", true),
                  vue.unref(appStore).page == "home" ? (vue.openBlock(), vue.createBlock(Home, { key: 1 })) : vue.unref(appStore).page == "note" ? (vue.openBlock(), vue.createBlock(Note, { key: 2 })) : vue.unref(appStore).page == "Base" ? (vue.openBlock(), vue.createBlock(_sfc_main$5, { key: 3 })) : vue.unref(appStore).page == "ask" ? (vue.openBlock(), vue.createBlock(_sfc_main$4, { key: 4 })) : vue.unref(appStore).page == "api" ? (vue.openBlock(), vue.createBlock(_sfc_main$3, { key: 5 })) : vue.unref(appStore).page == "ai" ? (vue.openBlock(), vue.createBlock(Ai, { key: 6 })) : vue.unref(appStore).page == "question" ? (vue.openBlock(), vue.createBlock(_sfc_main$1, { key: 7 })) : vue.createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue", "style"]),
          vue.withDirectives(vue.createElementVNode("div", {
            class: "minimized-dialog",
            onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(appStore).app.showFloat = true)
          }, [
            vue.createElementVNode("div", {
              onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(appStore).app.showFloat = true)
            }, [
              vue.createElementVNode("img", {
                width: "104vh",
                src: vue.unref(mini),
                onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(appStore).app.showFloat = true)
              }, null, 8, _hoisted_6)
            ])
          ], 512), [
            [vue.vShow, !vue.unref(appStore).app.showFloat]
          ])
        ]);
      };
    }
  });
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("ElementPlus");
  const LoadVue = () => {
    const pinia = createPinia();
    const app = vue.createApp(_sfc_main);
    app.use(ElementPlus);
    app.use(pinia);
    app.use(shadow);
    app.mount(
      (() => {
        const app2 = document.createElement("div");
        app2.id = "AiAskApp";
        document.body.append(app2);
        return app2;
      })()
    );
  };
  comHook();
  parseRuleHook(rule);
  const run = async () => {
    allowCopy();
    if (!console.log || console.log.toString().length < 13 || console.log.toString().indexOf("native code") === -1) {
      recoverConsole();
    }
    const not_match_url = [/\/work\/doHomeWorkNew/i, /selectWorkQuestionYiPiYue/i, /uooconline.com/i];
    if (_unsafeWindow !== _unsafeWindow.top && !not_match_url.some((item) => item.test(location.href))) {
      return;
    }
    LoadVue();
    parseRule(rule);
  };
  let loop = setInterval(() => {
    if (document.readyState === "complete") {
      run();
      clearInterval(loop);
    }
  }, 100);

})(Vue, ElementPlus, $, markdownit, hljs);