// ==UserScript==
// @name         审评助手3
// @namespace    https://ypjg.ahsyjj.cn
// @version      6.3.0915
// @author       nsyouran
// @description  审评助手+待办+已办+查询+笔记
// @icon         https://mpa.ah.gov.cn/_res/favicon.ico
// @match        https://ypjg.ahsyjj.cn:3510/spd/
// @match        https://ypjg.ahsyjj.cn:3510/spd/#
// @match        https://ypjg.ahsyjj.cn:3510/fileManager/preview*
// @match        https://ypjg.ahsyjj.cn:3510/qyd/secondYlqxsx/*
// @match        https://ypjg.ahsyjj.cn:3510/spd/cbxx/getUser*
// @match        https://www.cmde.org.cn/flfg/zdyz/zdyzwbk/index*
// @match        https://www.cmde.org.cn/splt/ltgxwt/*
// @match        http://app.nifdc.org.cn/biaogzx/qxqwk.do*
// @match        http://zhjg.ahsyjj.cn:3610/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.min.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://unpkg.com/v-clipboard@3.0.0-next.1/dist/v-clipboard.umd.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.6/index.full.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.6/locale/zh-cn.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus-icons-vue/2.1.0/index.iife.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/docxtemplater/3.37.11/docxtemplater.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js
// @require      https://unpkg.com/pizzip@3.1.4/dist/pizzip.min.js
// @require      https://unpkg.com/pizzip@3.1.4/dist/pizzip-utils.min.js
// @resource     element-plus-css  https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.6/index.min.css
// @resource     unicloudjs        https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/378b6425-25ef-4ad3-85fb-c72cd76915f9.js
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        unsafeWindow
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/440104/%E5%AE%A1%E8%AF%84%E5%8A%A9%E6%89%8B3.user.js
// @updateURL https://update.greasyfork.org/scripts/440104/%E5%AE%A1%E8%AF%84%E5%8A%A9%E6%89%8B3.meta.js
// ==/UserScript==

(a=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=a,document.head.appendChild(e)})(" *,*:before,*:after{box-sizing:border-box}*::-webkit-scrollbar{width:8px}*::-webkit-scrollbar-thumb{background-color:#c8c8c8;border-radius:8px}textarea{font-family:Avenir,Helvetica,Arial,sans-serif}.el-table__row.clybc{background-color:#ff0!important}.el-popper{max-width:500px}.el-drawer__body{padding:0}.el-tabs__content{padding:0!important}.super-setting-left{display:flex;flex-direction:row;width:calc(100% - 550px)}.search[data-v-b12734fb]{padding:10px 10px 0}.btn[data-v-ef2adb40]{position:absolute;background:transparent;border:none;transform:translate(70px,-70px)}.list[data-v-10bff05b]{display:flex;flex-direction:column;padding:10px 10px 0}.list .table[data-v-10bff05b]{flex-grow:1}.list .foot[data-v-10bff05b]{flex-shrink:0;border:1px solid green;height:100px}.copyable[data-v-10bff05b],.clickable[data-v-10bff05b]{cursor:pointer}.clickable[data-v-10bff05b]{color:#00f}.clickable[data-v-10bff05b]:hover{color:red}.mytodo[data-v-2beb296a]{height:500px;display:flex;flex-direction:column}.mytodo .zxwd[data-v-2beb296a]{padding:0 40px}.mytodo .zxwd .link[data-v-2beb296a]{margin:0 5px;border:1px solid #c8c8c8;border-radius:5px;padding:3px 10px}.mytodo .search[data-v-2beb296a]{flex-shrink:0}.mytodo .list[data-v-2beb296a]{flex-grow:1;overflow:hidden}.search[data-v-4a89fadc]{padding:10px 10px 0}.mydone[data-v-f6a49a64]{height:500px;display:flex;flex-direction:column}.mydone .search[data-v-f6a49a64]{flex-shrink:0}.mydone .list[data-v-f6a49a64]{flex-grow:1;overflow:hidden}.pagiNation[data-v-f6a49a64]{padding:10px 10px 20px}.search[data-v-a8011036]{padding:10px 10px 0}.mysearch[data-v-7d784908]{height:500px;display:flex;flex-direction:column}.mysearch .search[data-v-7d784908]{flex-shrink:0}.mysearch .list[data-v-7d784908]{flex-grow:1;overflow:hidden}.pagiNation[data-v-7d784908]{padding:10px 10px 20px}.zhucesearch[data-v-073385ba]{height:500px;display:flex;flex-direction:column}.zhucesearch .search[data-v-073385ba]{flex-shrink:0}.zhucesearch .list[data-v-073385ba]{flex-grow:1;overflow:hidden}.pagiNation[data-v-073385ba]{padding:10px 10px 20px}.zhucesearch[data-v-ec2999ee]{height:500px;display:flex;flex-direction:column}.zhucesearch .search[data-v-ec2999ee]{flex-shrink:0}.zhucesearch .list[data-v-ec2999ee]{flex-grow:1;overflow:hidden}.pagiNation[data-v-ec2999ee]{padding:10px 10px 20px}.sphelper[data-v-7be852cd]{height:50px;width:50px;display:flex;justify-content:center;align-items:center;cursor:pointer}.sphelper[data-v-7be852cd]:hover{color:#e6a23c}.sphelper-block[data-v-7be852cd]{padding:10px;height:100%;display:flex;flex-direction:column}.search[data-v-7be852cd]{display:flex;flex-direction:row}.tabs[data-v-7be852cd]{width:100%;flex-grow:1;overflow-y:hidden}.search-btn[data-v-7be852cd]{margin-left:10px}.tab-content[data-v-7be852cd]{padding:10px;min-height:100px;max-height:800px;overflow-y:auto}.tab-content a[data-v-7be852cd]{text-decoration:none;color:#2980b9}.count[data-v-7be852cd]{background-color:red;color:#fff;margin-left:5px;font-style:normal;padding:0 8px;border-radius:10px}.baidu[data-v-7be852cd]{display:inline-block;background-image:url(https://www.baidu.com/favicon.ico);background-repeat:no-repeat;background-position:center;background-size:contain;width:2em;height:1em;transform:translateY(2px)}.form[data-v-db106125]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-db106125]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-db106125]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-1419a489]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-1419a489]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-1419a489]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-c2a14f89]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-c2a14f89]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-c2a14f89]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-e4bc44c5]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-e4bc44c5]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-e4bc44c5]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-74615f82]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-74615f82]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-74615f82]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-2610d8c3]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-2610d8c3]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-2610d8c3]{flex-shrink:0;text-align:right;padding:20px}.form[data-v-1bd68b7f]{height:100vh;display:flex;flex-direction:column}.form .block[data-v-1bd68b7f]{flex-grow:1;overflow-y:scroll;padding:20px}.form .btns[data-v-1bd68b7f]{flex-shrink:0;text-align:right;padding:20px}#spnote[data-v-e25ebe5f]{position:fixed;z-index:99;top:0;bottom:0;left:0;right:0;display:flex;flex-direction:row;background-color:#fff}#spnote .left[data-v-e25ebe5f],#spnote .right[data-v-e25ebe5f]{flex-shrink:0;display:flex;flex-direction:row}#spnote .left .body[data-v-e25ebe5f],#spnote .right .body[data-v-e25ebe5f]{flex-grow:1;width:300px}#spnote .left .cbtn[data-v-e25ebe5f],#spnote .right .cbtn[data-v-e25ebe5f]{display:flex;justify-content:center;align-items:center;cursor:pointer;user-select:none;width:20px;background-color:#e8e8e8}#spnote .left .cbtn[data-v-e25ebe5f]:hover,#spnote .right .cbtn[data-v-e25ebe5f]:hover{background-color:#c8c8c8}#spnote .middle[data-v-e25ebe5f]{flex-grow:1}.middle[data-v-e25ebe5f]{border:1px solid #c8c8c8;display:flex;flex-direction:column}.middle .tools[data-v-e25ebe5f]{flex-shrink:0;border-bottom:1px solid #c8c8c8;padding:10px}.middle .tools .classify[data-v-e25ebe5f]{width:300px;margin-right:12px}.middle .iframe[data-v-e25ebe5f]{flex-grow:1;border:1px solid #c8c8c8;display:flex;position:relative}.middle .iframe .diff-btn[data-v-e25ebe5f]{border-radius:3px;position:absolute;display:flex;justify-content:center;align-items:center;cursor:pointer}.middle .iframe .diff-btn[data-v-e25ebe5f]:hover{background-color:#e8e8e8}.middle .iframe .diff-btn.row[data-v-e25ebe5f]{left:170px;top:4px;width:43px;height:33px}.middle .iframe .diff-btn.column[data-v-e25ebe5f]{top:-1px;left:210px;width:33px;height:43px;transform:rotate(90deg)}.left .body[data-v-e25ebe5f]{overflow-y:auto}.left .body .item[data-v-e25ebe5f]{line-height:20px;border-bottom:1px solid #c8c8c8;padding:5px 10px}.left .body .item[data-v-e25ebe5f]:hover{background-color:#c8c8c8;color:#409eff}.left .body .item span[data-v-e25ebe5f]{cursor:pointer;user-select:none}.left .body .item .icon[data-v-e25ebe5f]{cursor:pointer;user-select:none;width:1.5em;height:1.5em;transform:translateY(1px)}.left .body .item.active[data-v-e25ebe5f]{background-color:#e8e8e8;color:#409eff}.left .body .item.null[data-v-e25ebe5f]{color:gray}.left .body .his .item[data-v-e25ebe5f]{padding-left:40px}.right .body[data-v-e25ebe5f]{display:flex;flex-direction:column}.right .body .baseinfo[data-v-e25ebe5f]{margin:10px;border:1px solid #c8c8c8;border-radius:5px;padding:10px;flex-shrink:0}.right .body .comment[data-v-e25ebe5f]{margin:0 10px;border:none;flex-shrink:0}.right .body .comment-his[data-v-e25ebe5f]{flex-grow:1;overflow-y:auto;padding:10px}.comment-his .item[data-v-e25ebe5f]{border:1px solid #c8c8c8;border-radius:5px;padding:10px;margin-bottom:10px;cursor:pointer;white-space:pre-wrap}.comment-his .item[data-v-e25ebe5f]:hover,.comment-his .item.active[data-v-e25ebe5f]{background-color:#e8e8e8}.copyable[data-v-e25ebe5f]{cursor:pointer;user-select:none}.mask[data-v-1aa0d606]{position:absolute;top:0;bottom:0;left:0;right:0;background-color:#00000080;display:flex;justify-content:center;align-items:center}.block[data-v-1aa0d606]{width:400px;border-radius:10px;background-color:#fff;overflow:hidden}.block .header[data-v-1aa0d606]{padding:10px;font-weight:700;border-bottom:1px solid #ccc;display:flex;flex-direction:row}.block .header .title[data-v-1aa0d606]{flex-grow:1;display:flex;align-items:center}.block .header .close[data-v-1aa0d606]{flex-shrink:0;color:red;display:flex;justify-content:center;align-items:center}.block .content[data-v-1aa0d606]{padding:10px;max-height:300px;overflow-y:auto}.block .content .title[data-v-1aa0d606]{font-weight:700}.block .content .detail[data-v-1aa0d606]{padding-left:20px}.block .footer[data-v-1aa0d606]{text-align:right;padding:5px 10px;font-size:.9em;color:gray}.vesion-block[data-v-eaf9bc64]{height:50px;display:flex;flex-direction:row;align-items:center}.vesion-block .icon[data-v-eaf9bc64]{transform:translateY(3px);cursor:pointer;user-select:none}.vesion-block .links[data-v-eaf9bc64]{margin-right:10px}.vesion-block .links .link[data-v-eaf9bc64]{margin-left:5px;color:#fff}.search[data-v-cf9d4bcb]{padding:10px 10px 0}.qualityAnalysis[data-v-c9a0e360]{height:500px;display:flex;flex-direction:column}.qualityAnalysis .search[data-v-c9a0e360]{flex-shrink:0}.qualityAnalysis .list[data-v-c9a0e360]{flex-grow:1;overflow:hidden}.pagiNation[data-v-c9a0e360]{padding:10px 10px 20px}.qualityAnalysis[data-v-7c29e1fe]{height:500px;display:flex;flex-direction:column}.qualityAnalysis .search[data-v-7c29e1fe]{flex-shrink:0;padding-top:10px}.qualityAnalysis .list[data-v-7c29e1fe]{flex-grow:1;overflow:hidden}.pans[data-v-7c29e1fe]{display:flex;flex-direction:row;min-height:300px}.pans .divider[data-v-7c29e1fe]{margin-left:10px}.pans .pan[data-v-7c29e1fe]{flex-grow:1;flex-shrink:0;width:calc(33.33% - 20px);border:1px solid #c8c8c8;border-radius:5px;margin:10px}.pans .pan .title[data-v-7c29e1fe]{font-weight:700;font-size:1.3em;border-bottom:1px solid #c8c8c8;margin-bottom:10px;padding:3px 10px}.pans .pan .rows[data-v-7c29e1fe]{border:1px solid #e8e8e8;margin:4px 10px;padding:3px;display:flex;flex-direction:row}.pans .pan .rows .key[data-v-7c29e1fe]{margin-right:10px;flex-grow:1;text-align:right}.pans .pan .rows .value[data-v-7c29e1fe]{width:40%;flex-shrink:0}.dispense[data-v-9efd8f69]{height:500px;display:flex;flex-direction:column}.dispense .head[data-v-9efd8f69]{padding:10px 20px 0}.dispense .list[data-v-9efd8f69]{flex-grow:1;overflow:hidden}.QualityCheck[data-v-fb22c896]{height:500px;display:flex;flex-direction:column}.QualityCheck .head[data-v-fb22c896]{padding:10px 20px 0}.QualityCheck .list[data-v-fb22c896]{flex-grow:1;overflow:hidden}.Inconformity[data-v-4302ac1f]{height:500px;display:flex;flex-direction:column}.Inconformity .search[data-v-4302ac1f]{flex-shrink:0}.Inconformity .list[data-v-4302ac1f]{flex-grow:1;overflow:hidden}.Inconformity .list .table[data-v-4302ac1f]{height:100%}.pagiNation[data-v-4302ac1f]{padding:10px 10px 20px}.tool-standard[data-v-3c30e436]{padding:20px} ");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(vue, ElementPlus, ElementPlusIconsVue, ElementPlusLocaleZhCn, Clipboard, $$3, XLSX, PizZip, PizZipUtils, DocxTemplater, saveAs) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const ElementPlusIconsVue__namespace = /* @__PURE__ */ _interopNamespaceDefault(ElementPlusIconsVue);
  const XLSX__namespace = /* @__PURE__ */ _interopNamespaceDefault(XLSX);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus-css");
  var isVue2 = false;
  /*!
    * pinia v2.1.4
    * (c) 2023 Eduardo San Martin Morote
    * @license MIT
    */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
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
    const pinia2 = vue.markRaw({
      install(app) {
        setActivePinia(pinia2);
        {
          pinia2._a = app;
          app.provide(piniaSymbol, pinia2);
          app.config.globalProperties.$pinia = pinia2;
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
    return pinia2;
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
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
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
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        {
          pinia2.state.value[id] = state ? state() : {};
        }
      }
      const localState = vue.toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
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
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      {
        pinia2.state.value[$id] = {};
      }
    }
    vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
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
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
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
      pinia2._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia2);
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
      _p: pinia2,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia2.state.value[$id], (state) => {
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
    pinia2._s.set($id, store);
    const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
    const setupStore = pinia2._e.run(() => {
      scope = vue.effectScope();
      return runWithContext(() => scope.run(setup));
    });
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia2.state.value[$id][key] = prop;
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        optionsForPlugin.actions[key] = prop;
      } else
        ;
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => pinia2.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia2._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
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
    function useStore(pinia2, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia2 || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia2)
        setActivePinia(pinia2);
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
      }
      const store = pinia2._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function storeToRefs(store) {
    {
      store = vue.toRaw(store);
      const refs = {};
      for (const key in store) {
        const value = store[key];
        if (vue.isRef(value) || vue.isReactive(value)) {
          refs[key] = // ---
          vue.toRef(store, key);
        }
      }
      return refs;
    }
  }
  const pinia = createPinia();
  const userStore = defineStore("user", () => {
    const defUserInfo = {
      userId: "",
      name: "",
      deptName: "",
      deptId: ""
    };
    const user2 = vue.ref(
      JSON.parse(localStorage.getItem("userInfo") || JSON.stringify(defUserInfo))
    );
    vue.watch(user2.value, () => {
      localStorage.setItem("userInfo", JSON.stringify(user2.value));
    }, {
      deep: true
    });
    return { user: user2 };
  });
  const style = "";
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_info = /* @__PURE__ */ (() => monkeyWindow.GM_info)();
  var GM_getResourceText$1 = /* @__PURE__ */ (() => monkeyWindow.GM_getResourceText)();
  eval(GM_getResourceText$1("unicloudjs"));
  const db = uniCloud.database();
  const $$2 = db.command.aggregate;
  const _ = db.command;
  const DB = {
    async getJbrInfo(ids) {
      const res = await db.collection("sp-record").aggregate().match({
        xksbxxid: _.in(ids)
      }).limit(500).end();
      const infos = {};
      for (const i of res.result.data) {
        infos[i.xksbxxid] = i;
      }
      return infos;
    },
    async getShenpRecordCloud(xksbxxid) {
      let res = await db.collection("shenpRecord").where({
        xksbxxid
      }).get();
      return res.result.data;
    },
    async setShenpRecordCloud(data) {
      let res = await db.collection("shenpRecord").where({
        xksbxxid: data.xksbxxid
      }).get();
      let doc = res.result.data[0];
      let rtn;
      if (doc) {
        rtn = db.collection("shenpRecord").doc(doc._id).update(data);
      } else {
        rtn = db.collection("shenpRecord").add(data);
      }
      return rtn;
    },
    async setSPJLCloud(data) {
      let res = await db.collection("sp-record").where({
        xksbxxid: data.xksbxxid
      }).get();
      let doc = res.result.data[0];
      let rtn;
      if (doc) {
        rtn = db.collection("sp-record").doc(doc._id).update(data);
      } else {
        rtn = db.collection("sp-record").add(data);
      }
      return rtn;
    },
    getNoteList(id) {
      return new Promise((resolve, reject) => {
        db.collection("notes").aggregate().match({
          xksbxxid: id
        }).sort({ index: 1 }).limit(500).end().then((res) => {
          resolve(res.result.data);
        });
      });
    },
    saveNote(note) {
      const {
        _id,
        xksbxxid: id,
        fileId,
        data,
        index
      } = note;
      if (_id)
        return db.collection("notes").where({
          xksbxxid: id,
          fileId
        }).update({
          index,
          data,
          fileId,
          xksbxxid: id
        });
      else
        return db.collection("notes").add({
          index,
          data,
          fileId,
          xksbxxid: id
        });
    },
    queryClassification(value) {
      return new Promise(async (resolve, reject) => {
        let reg = new RegExp(`.*?${value}.*?`, "i");
        let { result: { data: classification } } = await db.collection("classification").where(_.or(
          {
            code: reg
          },
          {
            description: reg
          },
          {
            intend: reg
          },
          {
            examples: reg
          }
        )).limit(50).get();
        let { result: { data: noclinical } } = await db.collection("noclinical").where(_.or(
          {
            name: reg
          },
          {
            description: reg
          },
          {
            code: reg
          }
        )).limit(50).get();
        let { result: { data: standard } } = await db.collection("standard").where(_.or(
          {
            name: reg
          },
          {
            range: reg
          },
          {
            code: reg
          }
        )).limit(50).get();
        let { result: { data: principle } } = await db.collection("principle").where(_.or(
          {
            name: reg
          }
        )).limit(50).get();
        principle = principle.filter((item) => {
          item.url = item.url.replace(/images\/(.*?)&/, ($0, $1, $2) => {
            return $0.replace($1, encodeURIComponent($1));
          });
          return true;
        });
        resolve({
          classification,
          noclinical,
          standard,
          principle
        });
      });
    },
    getPrincipleInfo() {
      return new Promise(async (resolve, reject) => {
        let lastUpdate = "", total = 0;
        await db.collection("principle").where({ lastUpdate: _.exists(true) }).orderBy("lastUpdate", "desc").limit(1).get().then((res) => {
          lastUpdate = new Date(res.result.data[0].lastUpdate).toLocaleString();
        });
        await db.collection("principle").count().then((res) => {
          total = res.result.total;
        });
        resolve({
          lastUpdate,
          total
        });
      });
    },
    getStandardInfo() {
      return new Promise(async (resolve, reject) => {
        let lastUpdate = "", total = 0;
        await db.collection("standard").where({ lastUpdate: _.exists(true) }).orderBy("lastUpdate", "desc").limit(1).get().then((res) => {
          lastUpdate = new Date(res.result.data[0].lastUpdate).toLocaleString();
        });
        await db.collection("standard").count().then((res) => {
          total = res.result.total;
        });
        resolve({
          lastUpdate,
          total
        });
      });
    },
    getStandard(limit = 500, skip = 0) {
      return new Promise(async (resolve, reject) => {
        db.collection("standard").limit(limit).skip(skip).get().then((res) => {
          resolve(res.result.data);
        });
      });
    },
    addStandard(data) {
      return db.collection("standard").add(data);
    },
    getClassCode(value = "", cb) {
      const reg = new RegExp(`.*?${value.trim()}.*?`, "i");
      return db.collection("classification").where(_.or(
        { code: reg },
        {
          description: reg
        },
        {
          intend: reg
        },
        {
          examples: reg
        }
      )).limit(20).get().then((res) => {
        console.log(res.result.data);
        cb && cb(res.result.data);
      });
    },
    async saveBfhx(data) {
      let res = await db.collection("bfhx").where({
        xksbxxid: data.xksbxxid
      }).get();
      let doc = res.result.data[0];
      let rtn;
      if (doc) {
        rtn = db.collection("bfhx").doc(doc._id).update(data);
      } else {
        data.date = /* @__PURE__ */ new Date();
        rtn = db.collection("bfhx").add(data);
      }
      return rtn;
    },
    getBfhxByIds(ids) {
      return new Promise(async (resolve, reject) => {
        const length = ids.length;
        const step = 500;
        const times = Math.ceil(length / step);
        let rtn = [];
        for (let i = 0; i < times; i++) {
          await db.collection("bfhx").aggregate().match({
            xksbxxid: _.in(ids.slice(i * step, (i + 1) * step))
          }).end().then((res) => {
            rtn = rtn.concat(res.result.data);
          });
        }
        resolve(rtn);
        this.getBfhxLastDate();
      });
    },
    async getBfhxLastDate() {
      let res = await db.collection("bfhx").where({}).orderBy("date", "desc").limit(1).get();
      return new Date(res.result.data[0].date);
    },
    getAllStandard() {
      return new Promise(async (resolve, reject) => {
        let total = 0;
        await db.collection("standard").count().then((res) => {
          total = res.result.total;
        });
        const size = 500;
        const pages = Math.ceil(total / size);
        let data = [];
        for (let i = 0; i < pages; i++) {
          let tmp = await this.getStandard(size, i * size);
          data = data.concat(tmp);
        }
        resolve(data);
      });
    }
  };
  const { user: user$1 } = storeToRefs(userStore(pinia));
  const baseUrl = "https://ypjg.ahsyjj.cn:3510/";
  function get(url) {
    return new Promise((resolve, reject) => {
      $$3.ajax({
        url: baseUrl + url,
        type: "get",
        success(res) {
          resolve(res);
        },
        error(err) {
          reject(err);
        }
      });
    });
  }
  function post(param) {
    return new Promise((resolve, reject) => {
      $$3.ajax({
        url: baseUrl + param.url,
        type: "post",
        contentType: param.contentType || "application/x-www-form-urlencoded",
        dataType: param.dataType || "json",
        data: param.data,
        success(res) {
          resolve(res);
        },
        error(err) {
          reject(err);
        }
      });
    });
  }
  function _getXkdbListplus(data) {
    return post({
      url: "spd/xkba/getXkdbListplus.do",
      data: {
        ...{
          sbr: "",
          ajbh: "",
          sbrzjhm: "",
          sxmc: "",
          hjmc: "",
          sbsjq: "",
          sbsjz: "",
          zxhjmc: "",
          clbc: "0",
          page: 1,
          rows: 1e3
        },
        ...data
      }
    });
  }
  function _getXkybListplus(data) {
    return post({
      url: "spd/xkba/getXkybListplus.do",
      data: {
        ...{
          sbr: "",
          ajbh: "",
          sbrzjhm: "",
          sxmc: "",
          hjmc: "",
          slrqq: "",
          slrqz: "",
          cnbjrqq: "",
          cnbjrqz: "",
          sfzz: "",
          zxhjmc: "",
          page: 1,
          rows: 1e3
        },
        ...data
      }
    });
  }
  function _tjpage(data) {
    data.bjrqq && (data.bjrqq = new Date(data.bjrqq).toISOString().substring(0, 10));
    data.bjrqz && (data.bjrqz = new Date(data.bjrqz).toISOString().substring(0, 10));
    data.slrqq && (data.slrqq = new Date(data.slrqq).toISOString().substring(0, 10));
    data.slrqz && (data.slrqz = new Date(data.slrqz).toISOString().substring(0, 10));
    return post({
      url: "spd/tj/tjpage.do",
      data: {
        ...{
          sbr: "",
          sbrzjhm: "",
          sxmc: "",
          jdswh: "",
          ajbh: "",
          unitCode: "342100",
          slrqq: "",
          slrqz: "",
          sbsjq: "2020-04-20",
          sbsjz: "",
          bjrqq: "",
          bjrqz: "",
          hjmc: "",
          sbzt: "",
          xklbzldm: "",
          dwzsysx: "",
          dwhjsysx: "",
          zdhysftg: "",
          bljg: "",
          sfzdhy: "",
          sfcngz: "",
          cpmc: "",
          sfgq: "",
          gqzt: "",
          xzqhdm: "34",
          page: 1,
          rows: 1e3
        },
        ...data
      }
    });
  }
  function shenpiRecord(id, savedb = false) {
    return new Promise((resolve, reject) => {
      post({
        url: "spd/shenp/shenpiRecord.do",
        data: {
          licStateCode: "10",
          xksbxxid: id
        }
      }).then((res) => {
        if (savedb) {
          DB.setShenpRecordCloud({
            xksbxxid: id,
            records: res.items
          });
        }
        resolve(res);
      });
    });
  }
  function findJsp(id, activityinstid) {
    return get("spd/xkba/findJsp.do?id=" + id + "&activityinstid=" + activityinstid);
  }
  async function parseShenpiRecord(id) {
    const { items: records } = await shenpiRecord(id);
    let spy = "", jcy = "", youxian = false, spfb = "";
    for (const i of records) {
      if (i.blrxm == "周冬" && i.spyj.match(/请(.{2,4})办理/)) {
        spy = i.spyj;
      }
      if (i.blrxm == "吴文华" && i.spyj && i.spyj.match(/请(.{2,4})办理/)) {
        jcy = i.spyj;
      }
      if (i.bmmc == "许可注册处" && i.spyj && i.spyj.match(/优先/)) {
        youxian = i.spyj;
      }
    }
    for (const i of records) {
      if (spy.match(i.blrxm) && i.spjg == "材料补充" && i.spyj) {
        spfb += " || " + i.spyj;
      }
    }
    if (!spfb)
      spfb = "无";
    const res = { spy, jcy, youxian, spfb, xksbxxid: id };
    await DB.setSPJLCloud(res);
    return res;
  }
  async function getDjym(id) {
    return post({
      url: "spd/shenp/getDjym.do",
      dataType: "text",
      data: {
        xksbxxid: id
      }
    });
  }
  async function getCaseHTML(id) {
    const djym = await getDjym(id);
    return get(`qyd/${djym}?xkbaSbxx.xksbxxid=${id}&xkbaSxxx.djym=matter/register&applyOptType=view`);
  }
  async function getCPMC(id) {
    const html = await getCaseHTML(id);
    let sxmc = /class="split-title-shenbao">(.*?)</.exec(html)[1];
    let sbr = /name="xkbaSbxx.sbr".*?value="(.*?)"/.exec(html)[1];
    let match_cpmc = /id="cpmc"[\s\S]*?value="(.*?)"/.exec(html);
    let cpmc = match_cpmc ? match_cpmc[1] : "";
    let _regCode = /id="ylqxzczh"[\s\S]*?value="(.*?)"/.exec(html);
    let regCode = _regCode ? _regCode[1] : "";
    let match_classCode = /id="flbm(huixian)?"[\s\S]*?value="(.*?)"/.exec(html);
    let classCode = match_classCode ? match_classCode[2] : "";
    let _scdz = /input id="scdz(null)?"[\s\S]*?value="(.*?)"/.exec(html);
    let scdz;
    if (!_scdz) {
      let match_scdz = /textarea id="scdz(null)?"[\s\S]*?>(.*?)</.exec(html);
      scdz = match_scdz ? match_scdz[2] : "";
    } else {
      scdz = _scdz[2];
    }
    let match_ggxh = /id="(xh|bz)gg"[\s\S]*?>(.*?)</.exec(html);
    let ggxh = match_ggxh ? match_ggxh[2] : "";
    let rtn = { xksbxxid: id, cpmc, regCode, classCode, scdz, ggxh, sxmc, sbr };
    return rtn;
  }
  async function _addMoreInfo(res) {
    let xksbxxids = [], unicodes = [];
    const _records = res.records.sort((a, b) => {
      return +new Date(a.slrq) - +new Date(b.slrq);
    });
    const records = [];
    for (const i of _records) {
      let unistr = i.xksbxxid;
      if (user$1.value.name.trim() !== "周冬")
        unistr += i.activityInstId;
      let idx = unicodes.indexOf(unistr);
      if (idx === -1) {
        unicodes.push(unistr);
        xksbxxids.push(i.xksbxxid);
        records.push(i);
      } else {
        console.warn("---", i.ajbh, _records[idx].ajbh, i.hjmc, _records[idx].hjmc, _records[idx].cpmc, _records[idx].sbr, _records[idx].activityInstId);
      }
    }
    let jbrInfos = await DB.getJbrInfo(xksbxxids);
    const list_gq_bh = [];
    const list_gq_wbh = [];
    const list_wgq = [];
    let jbr_list = [];
    const { deptName } = await xkbasys.getUser();
    for (const i of records) {
      if (jbrInfos[i.xksbxxid] === void 0) {
        jbrInfos[i.xksbxxid] = await parseShenpiRecord(i.xksbxxid);
      } else {
        if (i.sxmc.indexOf("首次") !== -1 && (!jbrInfos[i.xksbxxid].spy || !jbrInfos[i.xksbxxid].jcy)) {
          if (!jbrInfos[i.xksbxxid].spy && deptName === "注册审评部" && (i.hjmc.indexOf("注册审评") !== -1 || i.hjmc.indexOf("业务部门经办人综合评定") !== -1)) {
            jbrInfos[i.xksbxxid] = await parseShenpiRecord(i.xksbxxid);
          }
          if (!jbrInfos[i.xksbxxid].jcy && deptName === "医疗器械检查部" && i.hjmc.indexOf("器械检查") !== -1) {
            jbrInfos[i.xksbxxid] = await parseShenpiRecord(i.xksbxxid);
          }
        }
      }
      if (i.sxmc.indexOf("生产许可证") === -1 && (i.cpmc.trim() === "" && (jbrInfos[i.xksbxxid].cpmc === void 0 || jbrInfos[i.xksbxxid].cpmc === "") || !jbrInfos[i.xksbxxid].scdz && i.sxmc.indexOf("首次") === -1)) {
        let tmp = await getCPMC(i.xksbxxid);
        jbrInfos[i.xksbxxid].cpmc = tmp.cpmc;
        jbrInfos[i.xksbxxid].scdz = tmp.scdz;
        delete jbrInfos[i.xksbxxid]._id;
        DB.setSPJLCloud(jbrInfos[i.xksbxxid]);
      }
      const item = {
        ...i,
        ...jbrInfos[i.xksbxxid]
      };
      if (i.gqzt === "1") {
        if (i.hjmc == "注册审评部技术审评" || i.hjmc == "业务部门经办人综合评定") {
          list_gq_bh.push(item);
        } else {
          list_gq_wbh.push(item);
        }
      } else {
        list_wgq.push(item);
      }
      if (item.spy)
        jbr_list.push(item.spy.match(/请(.*?)办理/)[1]);
      if (item.jcy)
        jbr_list.push(item.jcy.match(/请(.*?)办理/)[1]);
    }
    res.records = list_gq_bh.concat(list_gq_wbh).concat(list_wgq);
    res.jbrList = Array.from(new Set(jbr_list)).map((i) => {
      return {
        value: i,
        label: i
      };
    });
    res.jbrList.push({
      value: "",
      label: "全部"
    });
    return res;
  }
  function findShenBanInfo(id) {
    return post({
      url: "spd/shenp/findShenBanInfo.do",
      data: {
        id,
        hjid: id
      }
    });
  }
  const xkbasys = {
    getShenpiRecord(xksbxxid, isBj = false) {
      return new Promise(async (resolve, reject) => {
        let res = await DB.getShenpRecordCloud(xksbxxid);
        if (!res.length || isBj && !["处长审批", "分管局领导", "制证", "送达", "签收", "已办结"].includes(res[0].records[0].blhj)) {
          shenpiRecord(xksbxxid, true).then((ress) => {
            resolve(ress.items);
          });
        } else {
          resolve(res[0].records);
        }
      });
    },
    shenpiRecord,
    getCPMC,
    _getXkdbListplus,
    getXkdbListplus(data, loadingText) {
      return new Promise(async (resolve, reject) => {
        console.warn(user$1.value);
        let result = {};
        if (user$1.value.name.trim() === "周冬") {
          let qx_res = await _tjpage({
            ...data,
            sxmc: "第二类医疗器械",
            sbzt: "3"
          });
          let ivd_res = await _tjpage({
            ...data,
            sxmc: "第二类体外诊断试剂",
            sbzt: "3"
          });
          result = {
            ...qx_res,
            records: qx_res.items.concat(ivd_res.items),
            total: qx_res.recordCount + ivd_res.recordCount
          };
        } else {
          ElementPlus.ElMessage.info("加载我的待办...");
          loadingText.value = "加载我的待办...";
          let db_res = await _getXkdbListplus(data);
          ElementPlus.ElMessage.info("加载我的已办...");
          loadingText.value = "加载我的已办...";
          let yb_res = await _getXkybListplus({
            ...data,
            zxhjmc: "企业整改材料补充"
          });
          result = {
            ...db_res,
            records: db_res.records.concat(yb_res.records),
            total: db_res.total + yb_res.total
          };
        }
        ElementPlus.ElMessage.info("加载经办人信息...");
        loadingText.value = "加载经办人信息...";
        const res = await _addMoreInfo(result);
        resolve(res);
      });
    },
    getXkybListplus(data) {
      return new Promise(async (resolve, reject) => {
        let res = await _getXkybListplus(data);
        res = await _addMoreInfo(res);
        res.records = res.records.filter((i) => {
          return i.gqzt !== "1";
        }).sort((a, b) => {
          return +new Date(b.slrq) - +new Date(a.slrq);
        });
        resolve(res);
      });
    },
    tjpage(data) {
      return _tjpage(data);
    },
    getCaseInfo(id) {
      return new Promise(async (resolve, reject) => {
        const info = await findShenBanInfo(id);
        getCaseHTML(id).then((html) => {
          let cpmc = /id="cpmc"[\s\S]*?value="(.*?)"/.exec(html)[1];
          let _regCode = /id="ylqxzczh"[\s\S]*?value="(.*?)"/.exec(html);
          let regCode = _regCode ? _regCode[1] : "";
          let classCode = /id="flbm(huixian)?"[\s\S]*?value="(.*?)"/.exec(html)[2];
          let _scdz = /input id="scdz(null)?"[\s\S]*?value="(.*?)"/.exec(html);
          let scdz;
          if (!_scdz) {
            scdz = /textarea id="scdz(null)?"[\s\S]*?>(.*?)</.exec(html)[2];
          } else {
            scdz = _scdz[2];
          }
          let ggxh = /id="(xh|bz)gg"[\s\S]*?>(.*?)</.exec(html)[2];
          resolve({
            xksbxxid: id,
            cpmc,
            regCode,
            classCode,
            scdz,
            ggxh,
            ajbh: info.ajbh,
            sbr: info.sbr,
            sxmc: info.sxmc,
            slrq: info.slrq.substring(0, 10)
          });
        });
      });
    },
    getUser() {
      return post({
        url: "spd/cbxx/getUser"
      });
    },
    todo(id, hjmc, activityinstid) {
      if (user$1.value.name !== "孙森" && false)
        ElMessageBox.alert("插件维护中，请转至原”业务办理“节点办理", "提示");
      else {
        console.warn(id, hjmc, activityinstid);
        findJsp(id, activityinstid).then((res) => {
          console.warn(res.jspLocation);
          const win2 = unsafeWindow;
          if (win2.Frame && win2.Frame.openNewMainTab) {
            const options = {
              title: hjmc,
              url: res.jspLocation + "?xksbxxid=" + id + "&activityinstid=" + activityinstid,
              closable: true
            };
            win2.Frame.openNewMainTab(options);
          } else {
            window.open(
              baseUrl + "spd/" + res.jspLocation + "?xksbxxid=" + id + "&activityinstid=" + activityinstid
            );
          }
        });
      }
    },
    sqclmlXkbaList(id) {
      return new Promise((resolve, reject) => {
        let sqclmlXkbaList = JSON.parse(localStorage.getItem("sqclmlXkbaList")) || {};
        if (sqclmlXkbaList[id])
          resolve(sqclmlXkbaList);
        else {
          post({
            url: "spd/shenp/ShenBaoShenCha.do",
            data: {
              xksbxxid: id,
              zxbb: 1,
              licStateCode: 10
            }
          }).then((res) => {
            sqclmlXkbaList[id] = { list: res.items };
            localStorage.setItem("sqclmlXkbaList", JSON.stringify(sqclmlXkbaList));
            resolve(sqclmlXkbaList);
          });
        }
      });
    },
    async getToken(key) {
      return new Promise((resolve, reject) => {
        const url = baseUrl + `qyd/fileManager/preview.do?key=${key}`;
        $$3.ajax({
          url,
          success: (res) => {
            let token = /token=(.*?)"/.exec(res)[1];
            resolve(token);
          }
        });
      });
    },
    findSPRZInfo(id) {
      return new Promise((resolve, reject) => {
        const url = `spd/shenp/findSPRZInfo.do`;
        post({
          url,
          data: {
            xksbxxid: id
          }
        }).then((res) => {
          resolve(res);
        });
      });
    },
    getBfhxPage(id, page = 1, rows = 100) {
      return post({
        url: "spd/sprz/getBfhxPage.do",
        data: {
          xksbxxid: id,
          page,
          rows
        }
      });
    },
    getWorkday(data) {
      return new Promise((resolve, reject) => {
        $$3.ajax({
          url: "https://m.wannianli.tianqi.com/jisuanqi/workday",
          type: "post",
          contentType: "application/x-www-form-urlencoded",
          dataType: "json",
          data,
          success(res) {
            resolve(res);
          },
          error(err) {
            reject(err);
          }
        });
      });
    }
  };
  const _hoisted_1$r = { class: "search" };
  const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
    __name: "MyTodoSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      }
    },
    emits: ["change", "syncChange"],
    setup(__props, { expose: __expose, emit }) {
      const props = __props;
      const more = vue.ref(false);
      const form = vue.ref({});
      __expose({ form });
      function submit() {
        if (form.value.sbsjq) {
          form.value.sbsjq = form.value.sbsjq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjz) {
          form.value.sbsjz = form.value.sbsjz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      function zxBlhjChange(e) {
        if (e.indexOf("质量") !== -1) {
          form.value.jbr = "";
          emit("syncChange", form.value);
        }
      }
      function onJbrChange(e) {
        form.value.zxhjmc = "";
        emit("syncChange", form);
      }
      vue.onMounted(() => {
        xkbasys.getUser().then((res) => {
          form.value.jbr = res.name;
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$r, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "中心办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zxhjmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.zxhjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" },
                    onChange: zxBlhjChange
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部",
                        value: "质量部"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部审核",
                        value: "质量部审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部上报",
                        value: "质量部上报"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人分办",
                        value: "器械检查部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人方案制定",
                        value: "器械检查部经办人方案制定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人检查综合评定",
                        value: "器械检查部经办人检查综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审核",
                        value: "器械检查部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改",
                        value: "企业整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人分办",
                        value: "注册审评部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人分办",
                        value: "业务部门负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人综合评定",
                        value: "业务部门经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审批",
                        value: "业务部门负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心副主任（分管）核定",
                        value: "中心副主任（分管）核定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审批",
                        value: "器械检查部负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部技术审评",
                        value: "注册审评部技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审核",
                        value: "业务部门负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部经办人综合评定",
                        value: "注册审评部经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改材料补充",
                        value: "企业整改材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人资料审查",
                        value: "器械检查部经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人审核",
                        value: "注册审评部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人资料审查",
                        value: "业务部门经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人方案制定",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "业务部门经办人方案制定"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "经办人",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.jbr,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.jbr = $event),
                    onChange: onJbrChange,
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.jbrList, (item) => {
                        return vue.openBlock(), vue.createBlock(_component_el_option, {
                          key: item.value,
                          label: item.label,
                          value: item.value
                        }, null, 8, ["label", "value"]);
                      }), 128))
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[6] || (_cache[6] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 3
              })
            ]),
            _: 3
          }),
          more.value ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "待受理",
                        value: "待受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已受理",
                        value: "已受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.cpmc = $event),
                    onInput: _cache[9] || (_cache[9] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "是否材料补充",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.clbc,
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.clbc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "申请时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjq,
                            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.sbsjq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjz,
                            "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.sbsjz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const MyTodoSearch_vue_vue_type_style_index_0_scoped_b12734fb_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const MyTodoSearch = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-b12734fb"]]);
  const _hoisted_1$q = { class: "btn" };
  const _hoisted_2$g = ["src"];
  const _sfc_main$v = /* @__PURE__ */ vue.defineComponent({
    __name: "CaseRecords",
    setup(__props, { expose: __expose }) {
      const show = vue.ref(false);
      const id = vue.ref("");
      __expose({ show, id });
      const src = vue.computed(() => {
        return baseUrl + `spd/pj/spjl?xksbxxid=${id.value}`;
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: show.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => show.value = $event),
          title: "办理记录",
          width: "1280px"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$q, [
              vue.createVNode(_component_el_button, {
                size: "small",
                icon: vue.unref(ElementPlusIconsVue.Refresh),
                onClick: _cache[0] || (_cache[0] = ($event) => id.value = id.value + "&t=" + (/* @__PURE__ */ new Date()).getTime())
              }, null, 8, ["icon"])
            ]),
            vue.createElementVNode("iframe", {
              frameborder: "0",
              src: src.value,
              style: { "display": "block", "border": "0", "width": "100%", "height": "600px" }
            }, null, 8, _hoisted_2$g)
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const CaseRecords_vue_vue_type_style_index_0_scoped_ef2adb40_lang = "";
  const CaseRecords = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-ef2adb40"]]);
  const _hoisted_1$p = /* @__PURE__ */ vue.createElementVNode("br", null, null, -1);
  const _sfc_main$u = /* @__PURE__ */ vue.defineComponent({
    __name: "CaseSxmc",
    props: {
      sxmc: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      const head = vue.ref("");
      const body = vue.ref("");
      const tail = vue.ref("");
      const tagTypes = {
        "首次注册": "success",
        "变更注册": "danger",
        "延续注册": "warning",
        "说明书变更": "info"
      };
      let regexp = "(.*?)(";
      for (const key in tagTypes) {
        regexp += key + "|";
      }
      regexp = regexp.substring(0, regexp.length - 1);
      regexp += ")(.*?)";
      vue.watch(props, () => {
        const match = props.sxmc.match(RegExp(regexp));
        if (match) {
          head.value = match[1];
          body.value = match[2];
          tail.value = match[3];
        } else {
          head.value = props.sxmc;
          body.value = "";
          tail.value = "";
        }
      }, {
        immediate: true
      });
      return (_ctx, _cache) => {
        const _component_el_tag = vue.resolveComponent("el-tag");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createTextVNode(vue.toDisplayString(head.value) + " ", 1),
          body.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            _hoisted_1$p,
            vue.createVNode(_component_el_tag, {
              type: tagTypes[body.value]
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(body.value), 1)
              ]),
              _: 1
            }, 8, ["type"])
          ], 64)) : vue.createCommentVNode("", true),
          vue.createTextVNode(" " + vue.toDisplayString(tail.value), 1)
        ], 64);
      };
    }
  });
  async function copy(text) {
    if (!text)
      return;
    await Clipboard.Clipboard.copy(text);
    ElementPlus.ElMessage.success("已复制：" + text);
  }
  function formatExcelDate(numb, format = "-") {
    if (!numb) {
      return "";
    }
    let time = new Date(
      (/* @__PURE__ */ new Date("1900-1-1")).getTime() + (numb - 1) * 3600 * 24 * 1e3
    );
    const year = time.getFullYear() + "";
    const month = time.getMonth() + 1 + "";
    const date = time.getDate();
    if (format && format.length === 1) {
      return year + format + (+month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
    }
    return year + (+month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date);
  }
  function dateFormat(date) {
    return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
  }
  const _hoisted_1$o = { class: "list" };
  const _hoisted_2$f = ["onClick"];
  const _hoisted_3$e = { key: 0 };
  const _hoisted_4$d = { key: 1 };
  const _hoisted_5$c = ["onClick"];
  const _hoisted_6$5 = ["onClick"];
  const _hoisted_7$4 = ["onClick"];
  const _hoisted_8$4 = ["onClick"];
  const _hoisted_9$4 = ["onClick"];
  const _hoisted_10$4 = ["onClick"];
  const _hoisted_11$4 = { key: 0 };
  const _hoisted_12$4 = { key: 1 };
  const _hoisted_13$4 = ["onClick"];
  const _hoisted_14$4 = ["onClick"];
  const _hoisted_15$4 = {
    key: 0,
    style: { "display": "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center" }
  };
  const _hoisted_16$4 = { key: 0 };
  const _hoisted_17$3 = { key: 1 };
  const _hoisted_18$3 = ["onClick"];
  const _hoisted_19$2 = {
    key: 0,
    class: "foot"
  };
  const _sfc_main$t = /* @__PURE__ */ vue.defineComponent({
    __name: "CaseList",
    props: {
      data: {
        type: Array,
        default: []
      },
      page: {
        type: Boolean,
        default: true
      },
      filter: {
        type: Array,
        default: []
      }
    },
    setup(__props) {
      const props = __props;
      const { user: user2 } = userStore();
      const filter = vue.computed(() => {
        const f = {};
        for (const i of props.filter) {
          f[i] = true;
        }
        return f;
      });
      const recordsRef = vue.ref();
      function bljl(id) {
        recordsRef.value.id = id;
        recordsRef.value.show = true;
      }
      function rowClassName(p) {
        return p.row.gqzt === "1" && (p.row.hjmc == "注册审评部技术审评" || p.row.hjmc == "业务部门经办人综合评定") ? "clybc" : "";
      }
      function handle(row) {
        quickView(row);
        xkbasys.todo(row.xksbxxid, row.hjmc, row.activityInstId);
      }
      let quickViewLoading = vue.ref({});
      function quickView(row) {
        const { xksbxxid: id } = row;
        if (quickViewLoading.value[id])
          return;
        quickViewLoading.value[id] = true;
        xkbasys.sqclmlXkbaList(id).then(async (res) => {
          if (!res[id].baseinfo) {
            res[id].baseinfo = row;
            localStorage.setItem("sqclmlXkbaList", JSON.stringify(res));
            console.warn(JSON.parse(JSON.stringify(res)));
          }
          let key = encodeURIComponent(res[id].list[0].fileId);
          let token = await xkbasys.getToken(key);
          window.open(
            baseUrl + `fileManager/preview?key=${key}&token=${token}&contents=local&id=${row.xksbxxid}`,
            "_blank"
          );
          quickViewLoading.value[id] = false;
        });
      }
      return (_ctx, _cache) => {
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_CopyDocument = vue.resolveComponent("CopyDocument");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_Warning = vue.resolveComponent("Warning");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_VideoPause = vue.resolveComponent("VideoPause");
        const _component_el_table = vue.resolveComponent("el-table");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$o, [
          vue.createVNode(_component_el_table, {
            class: "table",
            "row-class-name": rowClassName,
            data: props.data,
            border: "",
            size: "small"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table_column, {
                type: "index",
                index: (i) => i + 1,
                align: "center"
              }, null, 8, ["index"]),
              vue.createVNode(_component_el_table_column, {
                prop: "sbr",
                label: "企业名称"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.sbr)
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.sbr), 1)
                  ], 8, _hoisted_2$f)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "xzqhmc",
                label: "区域",
                width: "80"
              }),
              vue.createVNode(_component_el_table_column, {
                label: "联系人/电话",
                width: "110"
              }, {
                default: vue.withCtx((scope) => [
                  scope.row.wtdlr ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$e, [
                    vue.createElementVNode("div", null, vue.toDisplayString(scope.row.wtdlr), 1),
                    vue.createElementVNode("div", null, vue.toDisplayString(scope.row.wtdlrlxdh), 1)
                  ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$d, [
                    vue.createElementVNode("div", null, [
                      vue.createTextVNode(vue.toDisplayString(scope.row.lxdlr) + " ", 1),
                      vue.createVNode(_component_el_icon, { color: "#e6a23c" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_Warning)
                        ]),
                        _: 1
                      })
                    ]),
                    vue.createElementVNode("div", null, vue.toDisplayString(scope.row.lxdlrsjhm), 1)
                  ]))
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "ajbh",
                label: "受理编号",
                width: "105"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.ajbh)
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.ajbh), 1)
                  ], 8, _hoisted_5$c)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "sxmc",
                label: "事项名称"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "clickable",
                    onClick: ($event) => vue.unref(xkbasys).todo(scope.row.xksbxxid, scope.row.hjmc, scope.row.activityInstId)
                  }, [
                    vue.createVNode(_sfc_main$u, {
                      sxmc: scope.row.sxmc
                    }, null, 8, ["sxmc"])
                  ], 8, _hoisted_6$5)
                ]),
                _: 1
              }),
              vue.unref(user2).deptName === "质量管理部" ? (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                key: 0,
                prop: "cpmc",
                label: "产品名称"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.cpmc.trim() ? scope.row.cpmc.replace(/[(品种:)\(\)]/g, "") : "xxxxxxxx")
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.cpmc.trim() ? scope.row.cpmc.replace(/[(品种:)\(\)]/g, "") : "xxxxxxxx"), 1)
                  ], 8, _hoisted_7$4)
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.unref(user2).deptName !== "质量管理部" ? (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                key: 1,
                prop: "cpmc",
                label: "产品名称",
                width: "80"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "clickable",
                    onClick: ($event) => quickView(scope.row)
                  }, [
                    vue.withDirectives(vue.createVNode(_component_el_icon, { class: "is-loading" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_Loading)
                      ]),
                      _: 2
                    }, 1536), [
                      [vue.vShow, vue.unref(quickViewLoading)[scope.row.xksbxxid]]
                    ]),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.cpmc.trim() ? scope.row.cpmc.replace(/[(品种:)\(\)]/g, "") : "xxxxxxxx"), 1)
                  ], 8, _hoisted_8$4)
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.unref(user2).deptName === "质量管理部" ? (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                key: 2,
                prop: "cpmc",
                label: "操作",
                width: "80"
              }, {
                default: vue.withCtx((scope) => [
                  scope.row.hjmc.trim() === "质量部审核" ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: "clickable",
                    onClick: ($event) => handle(scope.row)
                  }, [
                    vue.withDirectives(vue.createVNode(_component_el_icon, { class: "is-loading" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_Loading)
                      ]),
                      _: 2
                    }, 1536), [
                      [vue.vShow, vue.unref(quickViewLoading)[scope.row.xksbxxid]]
                    ]),
                    vue.createTextVNode(" 审核 ")
                  ], 8, _hoisted_9$4)) : (vue.openBlock(), vue.createElementBlock("div", {
                    key: 1,
                    class: "clickable",
                    onClick: ($event) => quickView(scope.row)
                  }, [
                    vue.withDirectives(vue.createVNode(_component_el_icon, { class: "is-loading" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_Loading)
                      ]),
                      _: 2
                    }, 1536), [
                      [vue.vShow, vue.unref(quickViewLoading)[scope.row.xksbxxid]]
                    ]),
                    vue.createTextVNode(" 申报资料 ")
                  ], 8, _hoisted_10$4))
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              !filter.value.jbr ? (vue.openBlock(), vue.createBlock(_component_el_table_column, {
                key: 3,
                label: "经办人",
                width: "120"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", null, [
                    scope.row.spy ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$4, vue.toDisplayString(scope.row.spy) + " ", 1)) : vue.createCommentVNode("", true),
                    scope.row.jcy ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$4, vue.toDisplayString(scope.row.jcy) + " ", 1)) : vue.createCommentVNode("", true)
                  ])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_table_column, {
                prop: "slrq",
                label: "申报时间",
                width: "100",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.slrq.substring(0, 10))
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.sbsj ? scope.row.sbsj.substring(0, 10) : ""), 1)
                  ], 8, _hoisted_13$4)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "slrq",
                label: "受理时间",
                width: "100",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "copyable",
                    onClick: ($event) => vue.unref(copy)(scope.row.slrq.substring(0, 10))
                  }, [
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(scope.row.slrq ? scope.row.slrq.substring(0, 10) : ""), 1)
                  ], 8, _hoisted_14$4)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                label: "承诺时间",
                width: "100",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  scope.row.gqzt == "1" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$4, [
                    vue.createElementVNode("div", null, [
                      vue.createVNode(_component_el_icon, {
                        color: "#7bd153",
                        size: "24"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_VideoPause)
                        ]),
                        _: 1
                      })
                    ]),
                    scope.row.hjmc == "注册审评部技术审评" || scope.row.hjmc == "业务部门经办人综合评定" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16$4, "材料已补充")) : vue.createCommentVNode("", true)
                  ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_17$3, vue.toDisplayString(scope.row.cnbjrq ? scope.row.cnbjrq.substring(0, 10) : ""), 1))
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "hjmc",
                label: "当前环节",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", {
                    class: "clickable",
                    onClick: ($event) => bljl(scope.row.xksbxxid)
                  }, vue.toDisplayString(scope.row.hjmc), 9, _hoisted_18$3)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "hjsysx",
                label: "总剩余时限",
                width: "56",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", null, vue.toDisplayString(scope.row.hjsysx ? scope.row.hjsysx.replace(/日(.*?)$/g, "日") : ""), 1)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "zsysx",
                label: "中心总时",
                width: "50",
                align: "center"
              }, {
                default: vue.withCtx((scope) => [
                  vue.createElementVNode("div", null, vue.toDisplayString(scope.row.zsysx ? scope.row.zsysx.replace(/日(.*?)$/g, "日") : ""), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["data"]),
          props.page ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19$2, "foot")) : vue.createCommentVNode("", true),
          vue.createVNode(CaseRecords, {
            ref_key: "recordsRef",
            ref: recordsRef
          }, null, 512)
        ]);
      };
    }
  });
  const CaseList_vue_vue_type_style_index_0_scoped_10bff05b_lang = "";
  const CaseList = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-10bff05b"]]);
  const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
    __name: "MyTodo",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _todoList;
      const todoList = vue.ref([]);
      const jbrList = vue.ref([{ label: "全部", value: "" }]);
      const searchRef = vue.ref();
      function getList() {
        loading.value = true;
        xkbasys.getXkdbListplus({
          ...searchRef.value.form
          // rows: 10, page: 10
        }, loadingText).then((res) => {
          console.warn(res.records);
          _todoList = res.records;
          jbrList.value = res.jbrList || [{ label: "全部", value: "" }];
          statistic.value = initStatistic();
          onSyncSearch();
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch(form) {
        const { jbr, sbr, ajbh, cpmc, zxhjmc } = searchRef.value.form;
        todoList.value = _todoList.filter((i) => {
          let flag = (i.jcy + i.spy).indexOf(jbr) !== -1;
          flag && (flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true);
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          flag && (flag = cpmc ? i.cpmc.indexOf(cpmc) !== -1 : true);
          flag && (flag = zxhjmc ? i.hjmc.indexOf(zxhjmc) !== -1 : true);
          return flag;
        });
      }
      const showStatistic = vue.ref(false);
      const statistic = vue.ref();
      const initStatistic = () => {
        let statistic2 = {};
        for (const i of _todoList) {
          if (i.spy == "")
            continue;
          let spy = i.spy.match(/请(.*?)办理/)[1];
          let _sxmc = i.sxmc.match(/.{2}注册/);
          let sxmc = _sxmc ? _sxmc[0] : i.sxmc.match(/说明书变更/)[0];
          if (!statistic2[spy])
            statistic2[spy] = {
              [sxmc]: 0
            };
          if (!statistic2[spy][sxmc])
            statistic2[spy][sxmc] = 0;
          statistic2[spy][sxmc]++;
        }
        let tmp = [];
        let total = 0;
        for (const i in statistic2) {
          let t = 0;
          for (const j in statistic2[i]) {
            t += statistic2[i][j];
          }
          total += t;
          tmp.push({
            审评员: i,
            ...statistic2[i],
            小计: t
          });
        }
        tmp = tmp.sort((a, b) => b.小计 - a.小计);
        tmp.push({ 审评员: "总计", 小计: total });
        return tmp;
      };
      vue.onMounted(() => {
        height.value = window.$(".mytodo").parent().parent()[0].clientHeight;
        getList();
      });
      const doExport = function() {
        console.warn("do export", userStore().user.name);
        let list = _todoList.filter((item) => item.spy.indexOf(userStore().user.name) !== -1);
        console.warn(list);
        const data = [];
        for (const item of list) {
          data.push({
            案件编号: item.ajbh,
            企业名称: item.sbr,
            受理日期: item.slrq.substring(0, 10),
            事项名称: item.sxmc,
            产品名称: item.cpmc
          });
        }
        if (data.length === 0)
          return;
        const ws = XLSX__namespace.utils.json_to_sheet(data);
        const wb = XLSX__namespace.utils.book_new();
        XLSX__namespace.utils.book_append_sheet(wb, ws, "我的待办");
        XLSX__namespace.writeFile(
          wb,
          `我的待办-${(/* @__PURE__ */ new Date()).toISOString().substring(0, 10)}.xlsx`
        );
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "mytodo",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MyTodoSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            jbrList: jbrList.value,
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, { onClick: doExport }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("导出")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[0] || (_cache[0] = ($event) => showStatistic.value = true),
                icon: vue.unref(ElementPlusIconsVue.PieChart)
              }, null, 8, ["icon"])
            ]),
            _: 1
          }, 8, ["jbrList"]),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: todoList.value,
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createVNode(_component_el_dialog, {
            modelValue: showStatistic.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showStatistic.value = $event),
            title: "统计",
            width: "800px"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table, { data: statistic.value }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    prop: "审评员",
                    label: "审评员"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "首次注册",
                    label: "首次注册"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "变更注册",
                    label: "变更注册"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "延续注册",
                    label: "延续注册"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "说明书变更",
                    label: "说明书变更"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    align: "right",
                    prop: "小计",
                    label: "小计"
                  })
                ]),
                _: 1
              }, 8, ["data"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 4);
      };
    }
  });
  const MyTodo_vue_vue_type_style_index_0_scoped_2beb296a_lang = "";
  const MyTodoVue = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-2beb296a"]]);
  const _hoisted_1$n = { class: "search" };
  const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
    __name: "MyDoneSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      }
    },
    emits: ["change", "syncChange"],
    setup(__props, { expose: __expose, emit }) {
      const more = vue.ref(false);
      const form = vue.ref({});
      __expose({ form });
      function submit() {
        if (form.value.slrqq) {
          form.value.slrqq = form.value.slrqq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.slrqz) {
          form.value.slrqz = form.value.slrqz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.cnbjrqq) {
          form.value.cnbjrqq = form.value.cnbjrqq.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.cnbjrqz) {
          form.value.cnbjrqz = form.value.cnbjrqz.toLocaleString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$n, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.cpmc = $event),
                    onChange: _cache[5] || (_cache[5] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[6] || (_cache[6] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          more.value ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "受理",
                        value: "受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补齐补正",
                        value: "补齐补正"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补充材料",
                        value: "补充材料"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "整改",
                        value: "整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "签收",
                        value: "签收"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "流程结束",
                        value: "流程结束"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "中心办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zxhjmc,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.zxhjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人方案制定",
                        value: "器械检查部经办人方案制定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人检查综合评定",
                        value: "器械检查部经办人检查综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心主任签批",
                        value: "中心主任签批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审核",
                        value: "器械检查部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改",
                        value: "企业整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人分办",
                        value: "注册审评部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人分办",
                        value: "业务部门负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人综合评定",
                        value: "业务部门经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审批",
                        value: "业务部门负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部接收分发",
                        value: "质量部接收分发"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人分办",
                        value: "器械检查部负责人分办"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部审核",
                        value: "质量部审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "中心副主任（分管）核定",
                        value: "中心副主任（分管）核定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部负责人审批",
                        value: "器械检查部负责人审批"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部技术审评",
                        value: "注册审评部技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门负责人审核",
                        value: "业务部门负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "质量部上报省局",
                        value: "质量部上报省局"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部经办人综合评定",
                        value: "注册审评部经办人综合评定"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业整改材料补充",
                        value: "企业整改材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "器械检查部经办人资料审查",
                        value: "器械检查部经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注册审评部负责人审核",
                        value: "注册审评部负责人审核"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人资料审查",
                        value: "业务部门经办人资料审查"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "业务部门经办人方案制定",
                        value: "企业材料补充"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "企业材料补充",
                        value: "业务部门经办人方案制定"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "制证状态",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfzz,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.sfzz = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已制证",
                        value: "is null"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "未制证",
                        value: "is not null"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqq,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.slrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqz,
                            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.slrqz = $event)
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
              vue.createVNode(_component_el_form_item, {
                label: "承诺时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.cnbjrqq,
                            "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.cnbjrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.cnbjrqz,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.cnbjrqz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const MyDoneSearch_vue_vue_type_style_index_0_scoped_4a89fadc_lang = "";
  const MyDoneSearch = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-4a89fadc"]]);
  const _hoisted_1$m = { class: "pagiNation" };
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    __name: "MyDone",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _doneList = [];
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 50
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        loading.value = true;
        xkbasys.getXkybListplus({
          ...searchRef.value.form,
          rows: pageInfo.value.size,
          page: pageInfo.value.page
        }).then((res) => {
          pageTotal.value = res.total;
          _doneList = res.records;
          onSyncSearch();
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch() {
        doneList.value = _doneList.filter((i) => {
          const { sbr, ajbh } = searchRef.value.form;
          let flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true;
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          return flag;
        });
      }
      vue.onMounted(() => {
        height.value = window.$(".mydone").parent().parent()[0].clientHeight;
        getList();
      });
      return (_ctx, _cache) => {
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "mydone",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MyDoneSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, null, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$m, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes",
              total: pageTotal.value,
              "page-sizes": [50, 100, 200, 500],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const MyDone_vue_vue_type_style_index_0_scoped_f6a49a64_lang = "";
  const MyDoneVue = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-f6a49a64"]]);
  const _withScopeId$7 = (n) => (vue.pushScopeId("data-v-a8011036"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$l = { class: "search" };
  const _hoisted_2$e = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_3$d = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$c = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_5$b = /* @__PURE__ */ _withScopeId$7(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    __name: "MySearchSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      }
    },
    emits: ["change", "syncChange"],
    setup(__props, { expose: __expose, emit }) {
      const more = vue.ref(false);
      const form = vue.ref({
        unitCode: "342100",
        sbsjq: "2020-04-20"
      });
      __expose({ form });
      function submit() {
        if (form.value.slrqq && typeof form.value.slrqq === "object") {
          form.value.slrqq = form.value.slrqq.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.slrqz && typeof form.value.slrqz === "object") {
          form.value.slrqz = form.value.slrqz.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjq && typeof form.value.sbsjq === "object") {
          form.value.sbsjq = form.value.sbsjq.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjz && typeof form.value.sbsjz === "object") {
          form.value.sbsjz = form.value.sbsjz.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.bjrqq && typeof form.value.bjrqq === "object") {
          form.value.bjrqq = form.value.bjrqq.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.bjrqz && typeof form.value.bjrqz === "object") {
          form.value.bjrqz = form.value.bjrqz.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$l, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "事项名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sxmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.sxmc = $event),
                    onChange: _cache[5] || (_cache[5] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.cpmc = $event),
                    onChange: _cache[7] || (_cache[7] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[8] || (_cache[8] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 3
              })
            ]),
            _: 3
          }),
          more.value ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "申请时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjq,
                            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.sbsjq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjz,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.sbsjz = $event)
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
              vue.createVNode(_component_el_form_item, {
                label: "申报状态",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sbzt,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.sbzt = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "待受理",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "办理中",
                        value: "3"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已办结",
                        value: "2"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "受理",
                        value: "受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补齐补正",
                        value: "补齐补正"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补充材料",
                        value: "补充材料"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "整改",
                        value: "整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "签收",
                        value: "签收"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "流程结束",
                        value: "流程结束"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_2$e,
              vue.createVNode(_component_el_form_item, {
                label: "受理时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqq,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.slrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqz,
                            "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.slrqz = $event)
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
              vue.createVNode(_component_el_form_item, {
                label: "业务类型",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.xklbzldm,
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.xklbzldm = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "新办/核发",
                        value: "01"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "变更",
                        value: "02"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "延续",
                        value: "03"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补办",
                        value: "04"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注销/撤销",
                        value: "05"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "换证",
                        value: "11"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "换发",
                        value: "12"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "决定书文号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.jdswh,
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.value.jdswh = $event),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_3$d,
              vue.createVNode(_component_el_form_item, {
                label: "办结时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.bjrqq,
                            "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.value.bjrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.bjrqz,
                            "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.value.bjrqz = $event)
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
              vue.createVNode(_component_el_form_item, {
                label: "办理结果",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.bljg,
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.value.bljg = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "不予受理",
                        value: "3"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "不予许可（备案）",
                        value: "2"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "准予许可（备案）",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "承诺告知",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfcngz,
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.value.sfcngz = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "0"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_4$c,
              vue.createVNode(_component_el_form_item, {
                label: "自动核验",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfzdhy,
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.value.sfzdhy = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "99"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "88"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "核验通过",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zdhysftg,
                    "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.value.zdhysftg = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "是否挂起",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfgq,
                    "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => form.value.sfgq = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已挂起",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "未挂起",
                        value: "0"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "正在挂起",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.gqzt,
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => form.value.gqzt = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "挂起结束",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "挂起中",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              _hoisted_5$b,
              vue.createVNode(_component_el_form_item, {
                label: "办理单位",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.unitCode,
                    "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => form.value.unitCode = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "药品审评查验中心",
                        value: "342100"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, {
                label: "所属地区",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.xzqhdm,
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => form.value.xzqhdm = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "安徽省",
                        value: "34"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "合肥市",
                        value: "3401"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const MySearchSearch_vue_vue_type_style_index_0_scoped_a8011036_lang = "";
  const MySearchSearch = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-a8011036"]]);
  const _hoisted_1$k = { class: "pagiNation" };
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    __name: "MySearch",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _doneList = [];
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 20
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        loading.value = true;
        xkbasys.tjpage({
          ...searchRef.value.form,
          rows: pageInfo.value.size,
          page: pageInfo.value.page
        }).then((res) => {
          console.warn(res);
          pageTotal.value = res.recordCount;
          doneList.value = res.items;
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch() {
        doneList.value = _doneList.filter((i) => {
          const { sbr, ajbh } = searchRef.value.form;
          let flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true;
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          return flag;
        });
      }
      vue.onMounted(() => {
        height.value = window.$(".mysearch").parent().parent()[0].clientHeight;
      });
      return (_ctx, _cache) => {
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "mysearch",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MySearchSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, null, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            filter: ["jbr"],
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$k, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes, total",
              total: pageTotal.value,
              "page-sizes": [20, 50, 100, 200, 500],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const MySearch_vue_vue_type_style_index_0_scoped_7d784908_lang = "";
  const MySearchVue = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-7d784908"]]);
  const _hoisted_1$j = { class: "pagiNation" };
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    __name: "ZucheSearch",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _doneList = [];
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 1e4
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        let sxmc = searchRef.value.form.sxmc;
        loading.value = true;
        Promise.all([
          xkbasys.tjpage({
            ...searchRef.value.form,
            // slrqq: '2023-01-01',
            sxmc: sxmc ? sxmc : "第二类医疗器械",
            // sbzt: '2',
            rows: pageInfo.value.size,
            page: pageInfo.value.page
          }),
          xkbasys.tjpage({
            ...searchRef.value.form,
            // slrqq: '2023-01-01',
            sxmc: sxmc ? sxmc : "第二类体外诊断试剂",
            // sbzt: '2',
            rows: pageInfo.value.size,
            page: pageInfo.value.page
          })
        ]).then((res) => {
          pageTotal.value = res[0].recordCount + res[1].recordCount;
          doneList.value = res[0].items.concat(res[1].items).sort((a, b) => {
            return a.slrq - b.slrq;
          });
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch() {
        doneList.value = _doneList.filter((i) => {
          const { sbr, ajbh } = searchRef.value.form;
          let flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true;
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          return flag;
        });
      }
      vue.onMounted(() => {
        height.value = window.$(".zhucesearch").parent().parent()[0].clientHeight;
      });
      const exportloading = vue.ref(false);
      const doExport = async function() {
        console.warn("do export ");
        exportloading.value = true;
        let list = [];
        let ids = [];
        for (const i of doneList.value) {
          if (!ids.includes(i.xksbxxid)) {
            ids.push(i.xksbxxid);
            list.push(i);
          }
        }
        let jbrInfo = {};
        let step = 100;
        let len = Math.ceil(ids.length / step);
        for (let i = 0; i < len; i++) {
          let _ids = ids.slice(i * step, (i + 1) * step);
          let res = await db.collection("sp-record").aggregate().match({ xksbxxid: _.in(_ids) }).limit(5e3).end();
          for (const j of res.result.data) {
            jbrInfo[j.xksbxxid] = j;
          }
        }
        const data = [];
        list = list.sort((a, b) => {
          return +new Date(a.slrq) - +new Date(b.slrq);
        });
        for (const item of list) {
          const cpmc = item.cpmc.trim();
          const d = {
            企业名称: item.sbr,
            案件编号: "'" + item.ajbh,
            // 所属区域: item.xzqhmc,
            事项名称: item.sxmc,
            产品名称: cpmc ? cpmc.match(/^\(品种:(.*?)\)$/)[1] : "",
            受理日期: item.slrq.substring(0, 10)
          };
          if (jbrInfo[item.xksbxxid]) {
            d["审评员"] = jbrInfo[item.xksbxxid].spy ? jbrInfo[item.xksbxxid].spy.match(/请(.*?)办理/)[1] : "";
            d["检查员"] = jbrInfo[item.xksbxxid].jcy ? jbrInfo[item.xksbxxid].jcy.match(/请(.*?)办理/)[1] : "";
          }
          if (item.sbzt === "2") {
            d["是否发补"] = "否";
            let records = await xkbasys.getShenpiRecord(item.xksbxxid, true);
            for (const rc of records) {
              if (rc.spjg && rc.spjg.trim() === "材料补充") {
                d["是否发补"] = "是";
                d["发补时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
                if (!d["发补意见"])
                  d["发补意见"] = "";
                d["发补意见"] += rc.spyj + " || ";
              }
              if (!d["综合评定时间"] && (rc.blhj === "注册审评部经办人综合评定" || rc.blhj === "业务部门经办人综合评定")) {
                d["综合评定时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
              if (!d["质量审核时间"] && rc.blhj === "质量部审核") {
                d["质量审核时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
              if (!d["质量上报时间"] && rc.blhj === "质量部上报省局") {
                d["质量上报时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
            }
            for (const rc of records) {
              if (d["是否发补"] === "是" && !d["补回时间"] && rc.blrxm === item.sbr) {
                d["补回时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
            }
            if (item.bljg === "1") {
              d["办理结果"] = "通过";
            } else {
              d["办理结果"] = "不通过";
            }
          }
          d["备注"] = "";
          data.push(d);
        }
        console.warn(data);
        if (data.length === 0)
          return;
        const ws = XLSX__namespace.utils.json_to_sheet(data);
        const wb = XLSX__namespace.utils.book_new();
        XLSX__namespace.utils.book_append_sheet(wb, ws, "我的待办");
        XLSX__namespace.writeFile(
          wb,
          `办件查询-${(/* @__PURE__ */ new Date()).toISOString().substring(0, 10)}.xlsx`
        );
        exportloading.value = false;
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "zhucesearch",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MySearchSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_button, { onClick: doExport }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("导出")
                ]),
                _: 1
              })), [
                [_directive_loading, exportloading.value]
              ])
            ]),
            _: 1
          }, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            filter: ["jbr"],
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$j, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes, total",
              total: pageTotal.value,
              "page-sizes": [1, 20, 100, 500, 5e3],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const ZucheSearch_vue_vue_type_style_index_0_scoped_073385ba_lang = "";
  const ZhuceSearchVue = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-073385ba"]]);
  const _hoisted_1$i = { class: "pagiNation" };
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "JianchaSearch",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      let _doneList = [];
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 1e3
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        loading.value = true;
        Promise.all([
          xkbasys.tjpage({
            ...searchRef.value.form,
            slrqq: "2022-01-01",
            sxmc: "第二类、第三类",
            // ajbh: '3400002023080302197',
            sbzt: "2",
            rows: pageInfo.value.size,
            page: pageInfo.value.page
          })
        ]).then((res) => {
          pageTotal.value = res[0].recordCount;
          doneList.value = res[0].items.sort((a, b) => {
            return a.slrq - b.slrq;
          });
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      function onSyncSearch() {
        doneList.value = _doneList.filter((i) => {
          const { sbr, ajbh } = searchRef.value.form;
          let flag = sbr ? i.sbr.indexOf(sbr) !== -1 : true;
          flag && (flag = ajbh ? i.ajbh.indexOf(ajbh) !== -1 : true);
          return flag;
        });
      }
      vue.onMounted(() => {
        height.value = window.$(".zhucesearch").parent().parent()[0].clientHeight;
      });
      const exportloading = vue.ref(false);
      const doExport = async function() {
        console.warn("do export ");
        exportloading.value = true;
        let list = [];
        let ids = [];
        for (const i of doneList.value) {
          if (!ids.includes(i.xksbxxid)) {
            ids.push(i.xksbxxid);
            list.push(i);
          }
        }
        const data = [];
        list = list.sort((a, b) => {
          return +new Date(a.slrq) - +new Date(b.slrq);
        });
        for (const item of list) {
          const d = {
            企业名称: item.sbr,
            案件编号: "'" + item.ajbh,
            // 所属区域: item.xzqhmc,
            事项名称: item.sxmc,
            受理日期: item.slrq.substring(0, 10)
          };
          if (item.sbzt === "2") {
            d["是否整改"] = "否";
            let records = await xkbasys.getShenpiRecord(item.xksbxxid, true);
            console.warn(item.sbr, item.ajbh, records);
            for (let i = records.length - 1; i >= 0; i--) {
              const rc = records[i];
              if (!d["质量部接收时间"] && rc.blhj === "质量部接收分发") {
                d["质量部接收时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
              if (d["是否整改"] === "否" && rc.spjg === "整改") {
                d["是否整改"] = "是";
                d["整改开始时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
              if (rc.blhj === "业务部门负责人分办") {
                console.warn(rc);
                d["经办人"] = rc.spyj.replace(/\n/g, "").match(/请(.*?)办理/)[1];
              }
            }
            for (let i = 0; i < records.length; i++) {
              const rc = records[i];
              if (!d["质量部上报时间"] && rc.blhj === "质量部上报省局") {
                d["质量部上报时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
              console.warn(rc.blrxm, item.sbr);
              if (d["是否整改"] === "是" && !d["整改结束时间"] && rc.blrxm === item.sbr) {
                d["整改结束时间"] = rc.createTime.replace(/\//g, "-").substring(0, 10);
              }
            }
            if (item.bljg === "1") {
              d["办理结果"] = "通过";
            } else {
              d["办理结果"] = "不通过";
            }
          }
          data.push(d);
        }
        console.warn(data);
        exportloading.value = false;
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "zhucesearch",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(MySearchSearch, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onSyncChange: onSyncSearch
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_button, { onClick: doExport }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("导出")
                ]),
                _: 1
              })), [
                [_directive_loading, exportloading.value]
              ])
            ]),
            _: 1
          }, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            filter: ["jbr"],
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$i, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes, total",
              total: pageTotal.value,
              "page-sizes": [1, 20, 100, 500, 5e3],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const JianchaSearch_vue_vue_type_style_index_0_scoped_ec2999ee_lang = "";
  const JianchaSearchVue = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-ec2999ee"]]);
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    __name: "HightLight",
    props: {
      reg: {
        type: String,
        default: ""
      },
      str: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      const el = vue.ref();
      vue.watch(props, () => {
        hightLight();
      });
      vue.onMounted(() => {
        hightLight();
      });
      function hightLight() {
        el.value.innerHTML = props.str.replace(RegExp(props.reg, "g"), (str) => {
          return `<span style='color: red'>${str}</span>`;
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          ref_key: "el",
          ref: el
        }, null, 512);
      };
    }
  });
  const _hoisted_1$h = { class: "sphelper-block" };
  const _hoisted_2$d = { class: "search" };
  const _hoisted_3$c = { class: "count" };
  const _hoisted_4$b = { class: "tab-content" };
  const _hoisted_5$a = ["href"];
  const _hoisted_6$4 = { class: "count" };
  const _hoisted_7$3 = { class: "tab-content" };
  const _hoisted_8$3 = ["href"];
  const _hoisted_9$3 = { class: "count" };
  const _hoisted_10$3 = { class: "tab-content" };
  const _hoisted_11$3 = { style: { "color": "gray", "font-size": "0.8em", "margin-left": "1em" } };
  const _hoisted_12$3 = ["href"];
  const _hoisted_13$3 = ["href"];
  const _hoisted_14$3 = { class: "count" };
  const _hoisted_15$3 = { class: "tab-content" };
  const _hoisted_16$3 = { style: { "color": "gray", "font-size": "0.8em", "margin-left": "1em" } };
  const _hoisted_17$2 = ["href"];
  const _hoisted_18$2 = ["href"];
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    __name: "SpHelper",
    props: {
      iscomp: {
        type: Boolean,
        default: false
      }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const show = vue.ref(false);
      __expose({ show });
      const direction = vue.ref(true);
      const input = vue.ref();
      const loading = vue.ref(false);
      const value = vue.ref("");
      const reg = vue.ref("");
      function onSearch() {
        console.log(value.value);
        loading.value = true;
        DB.queryClassification(value.value).then((res) => {
          console.log(res);
          result.value = res;
          reg.value = value.value;
          loading.value = false;
        });
      }
      const activeTab = vue.ref("first");
      const result = vue.ref({
        classification: [],
        noclinical: [],
        principle: [],
        standard: []
      });
      const principle = vue.ref({
        lastUpdate: "",
        total: 0
      });
      const standard = vue.ref({
        lastUpdate: "",
        total: 0
      });
      const classifyHis = vue.ref([]);
      let init = false;
      vue.watchEffect(() => {
        if (show.value === true && !init) {
          DB.getPrincipleInfo().then((res) => {
            principle.value = res;
          });
          DB.getStandardInfo().then((res) => {
            standard.value = res;
          });
          {
            db.collection("classification").aggregate().group({
              _id: "$source",
              source_url: $$2.first("$source_url")
            }).sort({
              _id: 1
            }).end().then((res) => {
              console.warn(res.result.data);
              classifyHis.value = res.result.data;
            });
          }
          init = true;
        }
      });
      vue.onMounted(async () => {
      });
      const standardUpdateLoading = vue.ref(false);
      const standardUpdateData = vue.ref([]);
      const fileTemp = vue.ref();
      function chooseLocalStandard(e) {
        const templateFile = e.target.files[0];
        console.warn(templateFile);
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(templateFile);
        fileReader.onload = (e2) => {
          const sheet = XLSX__namespace.read(e2.target.result, {
            type: "binary",
            codepage: 936
          }).Sheets[`器械目录表`];
          console.warn(sheet);
          let tmp = sheet["!ref"].match(/(\D+)(\d+):(\D+)(\d+)/);
          let rowStart = 2;
          let rowEnd = +tmp[4] * 1;
          (tmp[3] + "").charCodeAt(0);
          let data = [];
          for (let i = rowStart; i <= rowEnd; i++) {
            let row = {};
            row.code = sheet[`B${i}`] ? sheet[`B${i}`].v : "";
            row.name = sheet[`C${i}`] ? sheet[`C${i}`].v : "";
            row.prop = sheet[`D${i}`] ? sheet[`D${i}`].v : "";
            row.pubDate = formatExcelDate(
              sheet[`E${i}`] ? sheet[`E${i}`].v : ""
            );
            row.implementDate = formatExcelDate(
              sheet[`F${i}`] ? sheet[`F${i}`].v : ""
            );
            row.useNationName = sheet[`H${i}`] ? sheet[`H${i}`].v : "";
            row.useNationLevel = sheet[`I${i}`] ? sheet[`I${i}`].v : "";
            row.useNationClass = sheet[`J${i}`] ? sheet[`J${i}`].v : "";
            row.class = sheet[`K${i}`] ? sheet[`K${i}`].v : "";
            row.state = sheet[`L${i}`] ? sheet[`L${i}`].v : "";
            row.range = sheet[`M${i}`] ? sheet[`M${i}`].v : "";
            row.belongName = sheet[`N${i}`] ? sheet[`N${i}`].v : "";
            row.belongCode = sheet[`P${i}`] ? sheet[`P${i}`].v : "";
            row.ccs = sheet[`Q${i}`] ? sheet[`Q${i}`].v : "";
            row.ics = sheet[`R${i}`] ? sheet[`R${i}`].v : "";
            row.replaceCode = sheet[`S${i}`] ? sheet[`S${i}`].v : "";
            row.cbCode = sheet[`T${i}`] ? sheet[`T${i}`].v : "";
            row.uid = row.code + row.pubDate;
            row.lastUpdate = /* @__PURE__ */ new Date();
            data.push(row);
          }
          console.warn(data);
          standardUpdateData.value = data;
          standardUpdateLoading.value = false;
        };
      }
      async function standardUpload() {
        if (!standardUpdateData.value[0])
          return;
        standardUpdateLoading.value = true;
        let total = standard.value.total;
        let pageSize = 500;
        let pages = Math.ceil(total / pageSize);
        let cloudData = [];
        console.warn(total, pageSize, pages);
        for (let i = 0; i < pages; i++) {
          let tmp = await DB.getStandard(pageSize, i * pageSize);
          cloudData = cloudData.concat(tmp);
        }
        let cloudObj = {};
        for (const i of cloudData) {
          cloudObj[i.uid] = i;
        }
        console.warn(cloudObj);
        for (const i of standardUpdateData.value) {
          if (!cloudObj[i.uid]) {
            await DB.addStandard(i);
            console.warn(i);
          }
        }
        standardUpdateLoading.value = false;
        standardUpdateData.value = [];
        DB.getStandardInfo().then((res) => {
          standard.value = res;
        });
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_arrow_right = vue.resolveComponent("arrow-right");
        const _component_arrow_left = vue.resolveComponent("arrow-left");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_card = vue.resolveComponent("el-card");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_tab_pane = vue.resolveComponent("el-tab-pane");
        const _component_UploadFilled = vue.resolveComponent("UploadFilled");
        const _component_QuestionFilled = vue.resolveComponent("QuestionFilled");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_tabs = vue.resolveComponent("el-tabs");
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        const _component_Search = vue.resolveComponent("Search");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_drawer, {
            modelValue: show.value,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => show.value = $event),
            size: "600",
            "append-to-body": "",
            direction: direction.value ? "ltr" : "rtl",
            "with-header": false
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$h, [
                vue.createElementVNode("div", _hoisted_2$d, [
                  vue.createVNode(_component_el_input, {
                    ref_key: "input",
                    ref: input,
                    class: "search-input",
                    size: "default",
                    clearable: "",
                    modelValue: value.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
                    onChange: onSearch,
                    placeholder: "分类/免临床/指导原则/标准"
                  }, null, 8, ["modelValue"]),
                  vue.createVNode(_component_el_button, {
                    class: "search-btn",
                    size: "default",
                    type: "primary",
                    onClick: onSearch
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("搜索")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_button, {
                    class: "search-btn",
                    size: "default",
                    onClick: _cache[1] || (_cache[1] = ($event) => direction.value = !direction.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          direction.value ? (vue.openBlock(), vue.createBlock(_component_arrow_right, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_arrow_left, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_tabs, {
                  class: "tabs",
                  style: { "margin-top": "10px" },
                  modelValue: activeTab.value,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => activeTab.value = $event),
                  type: "border-card"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_tab_pane, {
                      label: "分类",
                      name: "first"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createVNode(_component_el_link, {
                          underline: false,
                          icon: vue.unref(ElementPlusIconsVue.Tools),
                          target: "_blank",
                          href: "https://www.zhixie.info/"
                        }, null, 8, ["icon"]),
                        vue.createTextVNode("分类 "),
                        vue.createElementVNode("i", _hoisted_3$c, vue.toDisplayString(result.value.classification.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_4$b, [
                          result.value.classification.length === 0 ? (vue.openBlock(), vue.createBlock(_component_el_card, { key: 0 }, {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(classifyHis.value, (link) => {
                                return vue.openBlock(), vue.createElementBlock("div", null, [
                                  vue.createVNode(_component_el_link, {
                                    target: "_blank",
                                    href: link.source_url
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(link._id), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]);
                              }), 256))
                            ]),
                            _: 1
                          })) : vue.createCommentVNode("", true),
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.classification, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                !item.comment ? (vue.openBlock(), vue.createBlock(_component_el_row, {
                                  key: 0,
                                  style: { "font-weight": "bolder" }
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$l, {
                                      reg: reg.value,
                                      str: item.management_code + " " + item.code + (item.code === "6840" ? " 体外诊断试剂" : " （" + item.catalogue_name + (item.onelevel_name ? " - " + item.onelevel_name : "") + (item.twolevel_name ? " - " + item.twolevel_name : "") + "）")
                                    }, null, 8, ["reg", "str"])
                                  ]),
                                  _: 2
                                }, 1024)) : (vue.openBlock(), vue.createBlock(_component_el_row, {
                                  key: 1,
                                  style: { "font-weight": "bolder" }
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(vue.toDisplayString(item.comment), 1)
                                  ]),
                                  _: 2
                                }, 1024)),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("描 述：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$l, {
                                          reg: reg.value,
                                          str: item.description
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("用 途：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$l, {
                                          reg: reg.value,
                                          str: item.intend
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("举 例：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$l, {
                                          reg: reg.value,
                                          str: item.examples
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("a", {
                                      style: { "font-size": "12px" },
                                      target: "_blank",
                                      href: item.source_url
                                    }, vue.toDisplayString(item.source), 9, _hoisted_5$a)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_tab_pane, {
                      label: "免临床",
                      name: "second"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createTextVNode(" 免临床 "),
                        vue.createElementVNode("i", _hoisted_6$4, vue.toDisplayString(result.value.noclinical.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_7$3, [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.noclinical, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$l, {
                                      reg: reg.value,
                                      str: item.management_code + " " + item.code + " （" + item.name + "）"
                                    }, null, 8, ["reg", "str"])
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("描 述：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$l, {
                                          reg: reg.value,
                                          str: item.description
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      style: { "font-size": "12px" },
                                      href: item.source_url
                                    }, vue.toDisplayString(item.source), 9, _hoisted_8$3)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_tab_pane, {
                      label: "指导原则",
                      name: "third"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createVNode(_component_el_link, {
                          underline: false,
                          icon: vue.unref(ElementPlusIconsVue.Tools),
                          target: "_blank",
                          href: "https://www.cmde.org.cn/flfg/zdyz/zdyzwbk/index.html"
                        }, null, 8, ["icon"]),
                        vue.createTextVNode("指导原则 "),
                        vue.createElementVNode("i", _hoisted_9$3, vue.toDisplayString(result.value.principle.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_10$3, [
                          vue.createElementVNode("span", _hoisted_11$3, "最后更新于：" + vue.toDisplayString(principle.value.lastUpdate) + "，总计：" + vue.toDisplayString(principle.value.total), 1),
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.principle, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      href: item.url
                                    }, [
                                      vue.createVNode(_sfc_main$l, {
                                        reg: reg.value,
                                        str: item.name
                                      }, null, 8, ["reg", "str"])
                                    ], 8, _hoisted_12$3),
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      href: "https://www.baidu.com/s?wd=" + item.name,
                                      class: "baidu"
                                    }, null, 8, _hoisted_13$3)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, { style: { "color": "gray", "font-size": "12px" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(vue.toDisplayString(item.pubDate), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_tab_pane, {
                      label: "标准",
                      name: "fourth"
                    }, {
                      label: vue.withCtx(() => [
                        vue.createVNode(_component_el_link, {
                          underline: false,
                          icon: vue.unref(ElementPlusIconsVue.Tools),
                          target: "_blank",
                          href: "http://app.nifdc.org.cn/biaogzx/qxqwk.do"
                        }, null, 8, ["icon"]),
                        vue.createTextVNode("标准 "),
                        vue.createElementVNode("i", _hoisted_14$3, vue.toDisplayString(result.value.standard.length), 1)
                      ]),
                      default: vue.withCtx(() => [
                        vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_15$3, [
                          vue.createElementVNode("span", _hoisted_16$3, [
                            vue.createTextVNode(" 最后更新于：" + vue.toDisplayString(standard.value.lastUpdate) + "，总计：" + vue.toDisplayString(standard.value.total) + " ", 1),
                            vue.createVNode(_component_el_link, {
                              underline: false,
                              style: { "float": "right", "font-size": "1.2em" },
                              onClick: _cache[2] || (_cache[2] = ($event) => {
                                fileTemp.value.click();
                                standardUpdateLoading.value = true;
                              })
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_icon, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_UploadFilled)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.createVNode(_component_el_link, { underline: false }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_tooltip, {
                                  class: "item",
                                  effect: "dark",
                                  content: "1.中检院导出全部；2.另存为xls文件；3.上传xls",
                                  placement: "bottom"
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_icon, null, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_component_QuestionFilled)
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            vue.withDirectives(vue.createElementVNode("input", {
                              type: "file",
                              ref_key: "fileTemp",
                              ref: fileTemp,
                              accept: ".xls",
                              onChange: _cache[3] || (_cache[3] = ($event) => chooseLocalStandard($event))
                            }, null, 544), [
                              [vue.vShow, false]
                            ])
                          ]),
                          standardUpdateData.value[0] ? (vue.openBlock(), vue.createBlock(_component_el_card, {
                            key: 0,
                            style: { "margin-bottom": "10px", "font-size": "14px", "background": "gray" }
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(" 例： "),
                                  vue.createVNode(_sfc_main$l, {
                                    reg: reg.value,
                                    str: standardUpdateData.value[100].code + " " + standardUpdateData.value[100].name
                                  }, null, 8, ["reg", "str"]),
                                  vue.createElementVNode("a", {
                                    target: "_blank",
                                    href: "https://www.baidu.com/s?wd=" + standardUpdateData.value[100].code + " " + standardUpdateData.value[100].name,
                                    class: "baidu"
                                  }, null, 8, _hoisted_17$2)
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("使用范围：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 20 }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_sfc_main$l, {
                                        reg: reg.value,
                                        str: standardUpdateData.value[100].range
                                      }, null, 8, ["reg", "str"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("实施时间：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].implementDate), 1)
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("标准状态：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].state), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, null, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("发布时间：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].pubDate), 1)
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 4 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("代替标准：")
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_el_col, { span: 8 }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode(vue.toDisplayString(standardUpdateData.value[100].replaceCode), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_el_row, { style: { "text-align": "right", "padding-top": "10px" } }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_el_button, {
                                    size: "small",
                                    type: "primary",
                                    onClick: standardUpload
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createTextVNode("确认上传" + vue.toDisplayString(standardUpdateData.value.length ? " (" + standardUpdateData.value.length + ")" : ""), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : vue.createCommentVNode("", true),
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(result.value.standard, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_el_card, {
                              key: item._id,
                              style: { "margin-bottom": "10px", "font-size": "14px" }
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_el_row, { style: { "font-weight": "bolder" } }, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_sfc_main$l, {
                                      reg: reg.value,
                                      str: item.code + " " + item.name
                                    }, null, 8, ["reg", "str"]),
                                    vue.createElementVNode("a", {
                                      target: "_blank",
                                      href: "https://www.baidu.com/s?wd=" + item.code + " " + item.name,
                                      class: "baidu"
                                    }, null, 8, _hoisted_18$2)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("使用范围：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 20 }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_sfc_main$l, {
                                          reg: reg.value,
                                          str: item.range
                                        }, null, 8, ["reg", "str"])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("实施时间：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.implementDate), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("标准状态：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.state), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                vue.createVNode(_component_el_row, null, {
                                  default: vue.withCtx(() => [
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("发布时间：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.pubDate), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    vue.createVNode(_component_el_col, { span: 4 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode("代替标准：")
                                      ]),
                                      _: 1
                                    }),
                                    vue.createVNode(_component_el_col, { span: 8 }, {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(vue.toDisplayString(item.replaceCode), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])), [
                          [_directive_loading, standardUpdateLoading.value]
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])), [
                  [_directive_loading, loading.value]
                ])
              ])
            ]),
            _: 1
          }, 8, ["modelValue", "direction"]),
          !props.iscomp ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "sphelper",
            onClick: _cache[6] || (_cache[6] = ($event) => show.value = true)
          }, [
            vue.createVNode(_component_el_icon, { size: "30" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_Search)
              ]),
              _: 1
            })
          ])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const SpHelper_vue_vue_type_style_index_0_scoped_7be852cd_lang = "";
  const SpHelperVue = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-7be852cd"]]);
  const docPreview = (param) => {
    return new Promise((resolve, reject) => {
      const url = param.tempUrl;
      PizZipUtils.getBinaryContent(url, async (error, content) => {
        const zip = new PizZip(content);
        const doc = new DocxTemplater(zip, { linebreaks: true }).render(
          param.data
        );
        const out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        if (param.saveName) {
          await saveAs(out, param.saveName);
          setTimeout(() => {
            resolve(true);
          }, 3e3);
        } else {
          resolve(out);
        }
      });
    });
  };
  const _hoisted_1$g = { class: "form" };
  const _hoisted_2$c = { class: "block" };
  const _hoisted_3$b = { class: "btns" };
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    __name: "PageClbc",
    setup(__props) {
      const loading = vue.ref(true);
      const form = vue.ref({
        sbr: "",
        sxmc: "",
        ajbh: "",
        cpmc: ""
      });
      const today = vue.ref(/* @__PURE__ */ new Date());
      const bznr = vue.ref("    ****");
      const user2 = vue.ref("");
      const telephone = vue.ref(localStorage.getItem("telephone") || "");
      const telChange = () => {
        localStorage.setItem("telephone", telephone.value);
      };
      const doDocPreview = () => {
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/fa8b2335-91c0-49bf-9588-fcb3b0376526.docx`,
          data: {
            sbr: form.value.sbr,
            cpmc: form.value.cpmc,
            ajbh: form.value.ajbh,
            sxmc: form.value.sxmc,
            bznr: bznr.value,
            date: dateFormat(today.value),
            user: user2.value,
            telephone: telephone.value
          },
          saveName: `补正通知-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          form.value = res;
          loading.value = false;
        });
        xkbasys.getUser().then((res) => {
          user2.value = res.name;
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$g, [
          vue.createElementVNode("div", _hoisted_2$c, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, {
                  label: "事项名称",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "受理编号",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "企业名称",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "产品名称",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "补正内容",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 12 },
                      modelValue: bznr.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => bznr.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "通知日期",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_date_picker, {
                      modelValue: today.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => today.value = $event),
                      format: "YYYY-MM-DD",
                      type: "date",
                      placeholder: "选择日期"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: " 联系人",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: user2.value,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => user2.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "联系电话",
                  "label-width": "5em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: telephone.value,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => telephone.value = $event),
                      onChange: telChange
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          vue.createElementVNode("div", _hoisted_3$b, [
            vue.createVNode(_component_el_button, {
              size: "default",
              type: "primary",
              onClick: doDocPreview
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("生成并下载")
              ]),
              _: 1
            })
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PageClbc_vue_vue_type_style_index_0_scoped_db106125_lang = "";
  const PageClbc = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-db106125"]]);
  const _withScopeId$6 = (n) => (vue.pushScopeId("data-v-1419a489"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$f = { class: "form" };
  const _hoisted_2$b = { class: "block" };
  const _hoisted_3$a = /* @__PURE__ */ _withScopeId$6(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$a = { style: { "padding": "0 1em" } };
  const _hoisted_5$9 = { class: "btns" };
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    __name: "PageHyjy",
    setup(__props) {
      const loading = vue.ref(true);
      const form = vue.ref({});
      const user2 = vue.ref("");
      const today = vue.ref(/* @__PURE__ */ new Date());
      const hsnr = vue.ref("");
      const hsnrSelector = vue.ref([
        {
          description: "产品首次注册",
          checked: false
        },
        {
          description: "重大变更注册",
          checked: false
        },
        {
          description: "简易发补",
          checked: false
        },
        {
          description: "涉及审评要求不明确、难以准确把握审评尺度的医疗器械",
          checked: false
        },
        {
          description: "其他适用于会审会决定的医疗器械",
          checked: false
        }
      ]);
      const hsnrChange = () => {
        let tmp = "";
        for (const i of hsnrSelector.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + "\n";
        }
        hsnr.value = tmp.substring(0, tmp.length - 1);
      };
      const hsjy = vue.ref("");
      const doDocPreview = () => {
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/deed5ac4-c31b-44fa-95a4-6fa3e48a8bda.docx`,
          data: {
            sbr: form.value.sbr,
            cpmc: form.value.cpmc,
            ajbh: form.value.ajbh,
            sxmc: form.value.sxmc,
            ggxh: form.value.ggxh,
            date: dateFormat(today.value),
            hsnr: hsnr.value,
            hsjy: hsjy.value,
            user: user2.value
          },
          saveName: `会审纪要-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          form.value = res;
          loading.value = false;
        });
        xkbasys.getUser().then((res) => {
          user2.value = res.name;
        });
        hsnrChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$f, [
          vue.createElementVNode("div", _hoisted_2$b, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "事项名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "受理编号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "企业名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "会议时间" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_date_picker, {
                      modelValue: today.value,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => today.value = $event),
                      type: "date",
                      placeholder: "选择日期",
                      format: "YYYY-MM-DD"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "规格型号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: "",
                      modelValue: form.value.ggxh,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.ggxh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "会审内容" }, {
                  default: vue.withCtx(() => [
                    _hoisted_3$a,
                    vue.createElementVNode("div", _hoisted_4$a, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(hsnrSelector.value, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                          vue.createVNode(_component_el_checkbox, {
                            label: item.description,
                            modelValue: item.checked,
                            "onUpdate:modelValue": ($event) => item.checked = $event,
                            onChange: hsnrChange
                          }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                        ]);
                      }), 128))
                    ])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "会审纪要" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 10 },
                      modelValue: hsjy.value,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => hsjy.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          vue.createElementVNode("div", _hoisted_5$9, [
            vue.createVNode(_component_el_button, {
              size: "default",
              type: "primary",
              onClick: doDocPreview
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("生成并下载")
              ]),
              _: 1
            })
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PageHyjy_vue_vue_type_style_index_0_scoped_1419a489_lang = "";
  const PageHyjy = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-1419a489"]]);
  const _withScopeId$5 = (n) => (vue.pushScopeId("data-v-c2a14f89"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$e = { class: "form" };
  const _hoisted_2$a = { class: "block" };
  const _hoisted_3$9 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$9 = { style: { "padding": "0 1em" } };
  const _hoisted_5$8 = { class: "btns" };
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    __name: "PageHcqd",
    setup(__props) {
      const loading = vue.ref(true);
      const form = vue.ref({});
      const user2 = vue.ref("");
      const zcxs = vue.ref("");
      const zcxsSelector = vue.ref([
        {
          description: "首次注册申请",
          checked: true
        },
        {
          description: "变更注册申请",
          checked: false
        }
      ]);
      const zcxsChange = () => {
        let tmp = "";
        for (const i of zcxsSelector.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + "          ";
        }
        zcxs.value = tmp.substring(0, tmp.length - 1);
      };
      const zdhswt = vue.ref("无");
      const qtwt = vue.ref("无");
      const doDocPreview = () => {
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/34c74e05-bcc4-4ca7-8b65-6944651e3a1c.docx`,
          data: {
            sbr: form.value.sbr,
            cpmc: form.value.cpmc,
            ajbh: form.value.ajbh,
            zcxs: zcxs.value,
            zdhswt: zdhswt.value,
            qtwt: qtwt.value
          },
          saveName: `重点关注清单-${form.value.sbr}-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          form.value = res;
          loading.value = false;
        });
        xkbasys.getUser().then((res) => {
          user2.value = res.name;
        });
        zcxsChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$e, [
          vue.createElementVNode("div", _hoisted_2$a, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "事项名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sxmc,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sxmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "受理编号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.ajbh,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.ajbh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "企业名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "注册形式" }, {
                  default: vue.withCtx(() => [
                    _hoisted_3$9,
                    vue.createElementVNode("div", _hoisted_4$9, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(zcxsSelector.value, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                          vue.createVNode(_component_el_checkbox, {
                            label: item.description,
                            modelValue: item.checked,
                            "onUpdate:modelValue": ($event) => item.checked = $event,
                            onChange: zcxsChange
                          }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                        ]);
                      }), 128))
                    ])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "重点问题" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 5 },
                      modelValue: zdhswt.value,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => zdhswt.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "其他问题" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 5 },
                      modelValue: qtwt.value,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => qtwt.value = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          vue.createElementVNode("div", _hoisted_5$8, [
            vue.createVNode(_component_el_button, {
              size: "default",
              type: "primary",
              onClick: doDocPreview
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("生成并下载")
              ]),
              _: 1
            })
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PageHcqd_vue_vue_type_style_index_0_scoped_c2a14f89_lang = "";
  const PageHcqd = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-c2a14f89"]]);
  const _withScopeId$4 = (n) => (vue.pushScopeId("data-v-e4bc44c5"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$d = { style: { "padding": "0 1em" } };
  const _hoisted_2$9 = { style: { "padding": "0 1em" } };
  const _hoisted_3$8 = { style: { "padding": "0 1em" } };
  const _hoisted_4$8 = { style: { "margin-left": "15px" } };
  const _hoisted_5$7 = { style: { "margin-left": "15px" } };
  const _hoisted_6$3 = { style: { "margin-left": "15px" } };
  const _hoisted_7$2 = { style: { "margin-left": "15px" } };
  const _hoisted_8$2 = { style: { "margin-left": "15px" } };
  const _hoisted_9$2 = { style: { "margin-left": "15px" } };
  const _hoisted_10$2 = { style: { "margin-left": "15px" } };
  const _hoisted_11$2 = { style: { "margin-left": "15px" } };
  const _hoisted_12$2 = { style: { "margin-left": "15px" } };
  const _hoisted_13$2 = { style: { "padding": "0 1em" } };
  const _hoisted_14$2 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_15$2 = { style: { "padding": "0 1em" } };
  const _hoisted_16$2 = { style: { "padding": "0 1em" } };
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbgBG",
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    setup(__props) {
      const props = __props;
      const loading = vue.ref(false);
      const form = vue.ref({});
      vue.watch(props, () => {
        form.value = { ...form.value, ...props.form };
      });
      const applyChangeInfo = vue.ref([
        { description: "变更产品名称", checked: false },
        { description: "变更产品技术要求", checked: false },
        { description: "变更产品型号规格", checked: false },
        { description: "变更产品结构及组成", checked: false },
        { description: "变更产品适用范围", checked: false },
        { description: "变更注册证中“其他内容”", checked: false },
        { description: "变更其他内容", checked: false }
      ]);
      const applyInfoChange = () => {
        let tmp = "";
        for (const i of applyChangeInfo.value) {
          if (i.checked)
            tmp += i.description + "、";
        }
        form.value.applyChangeInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const teckCheckContentInit = () => {
        form.value.teckCheckContent = `该产品为${form.value.classify}医疗器械，分类编码${form.value.classCode} ${form.value.className}，注册证号：${form.value.regCode}。本次申请变更注册，${form.value.applyChangeInfoStr}。`;
      };
      const realChangeInfo = vue.ref([
        { description: "变更产品名称", checked: false },
        { description: "变更产品技术要求", checked: false },
        { description: "变更产品型号规格", checked: false },
        { description: "变更产品结构及组成", checked: false },
        { description: "变更产品适用范围", checked: false },
        { description: "变更注册证中“其他内容”", checked: false },
        { description: "变更其他内容", checked: false }
      ]);
      const realInfoChange = () => {
        let tmp = "";
        let j = 0;
        for (const i of realChangeInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
          if (j == 2 || j == 4)
            tmp += "\n";
          j++;
        }
        form.value.realChangeInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const changeType = vue.ref([
        { description: "产品设计变化", checked: false },
        { description: "原材料变化", checked: false },
        { description: "生产工艺变化", checked: false },
        { description: "适用范围变化", checked: false },
        { description: "其余变化", checked: false }
      ]);
      const typeChange = () => {
        let tmp = "";
        let j = 0;
        for (const i of changeType.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
          if (j == 1)
            tmp += "\n";
          j++;
        }
        form.value.changeTypeStr = tmp.substring(0, tmp.length - 1);
      };
      const proveInfo = vue.ref([
        { description: "不适用强制性标准说明", checked: false },
        { description: "产品风险管理资料", checked: false },
        { description: "产品检验报告", checked: false },
        { description: "研究资料", checked: false },
        { description: "临床评价资料", checked: false },
        { description: "产品说明书变化对比表", checked: false },
        { description: "变更前和变更后的产品技术要求", checked: false },
        { description: "变更前和变更后的产品说明书", checked: false },
        { description: "证明产品安全有效的其他资料", checked: false }
      ]);
      const proveInfoChange = () => {
        let tmp = "";
        let j = 0;
        for (const i of proveInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
          if (j == 1 || j == 4 || j == 6)
            tmp += "\n";
          j++;
        }
        form.value.proveInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const attachInfo = vue.ref([
        { description: "产品名称变化对比表", checked: false },
        { description: "产品技术要求变化对比表", checked: false },
        { description: "产品型号规格变化对比表", checked: false },
        { description: "产品结构及组成变化对比表", checked: false },
        { description: "产品适用范围变化对比表", checked: false },
        { description: "注册证中“其他内容”变化对比表", checked: false },
        { description: "其他内容变化对比表", checked: false }
      ]);
      const attachInfoChange = () => {
        let tmp = "";
        for (const i of attachInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + "\n";
        }
        form.value.attachInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const conclusionInfo = vue.ref([
        { description: "符合技术审评要求，建议准予注册。", checked: true },
        {
          description: "申请资料不符合技术审评要求，建议不予注册。\n具体理由和依据：",
          checked: false
        },
        { description: "同意企业申请，建议准予撤回。", checked: false }
      ]);
      const conclusionInfoChange = (index) => {
        let tmp = "";
        let j = 0;
        for (const i of conclusionInfo.value) {
          if (index == j)
            tmp += "■";
          else
            tmp += "□";
          if (index == j && 1 == j)
            tmp += i.description + form.value.conclusionReason + "\n";
          else
            tmp += i.description + "\n";
          tmp += "\n";
          j++;
        }
        form.value.conclusionInfoStr = tmp.substring(0, tmp.length - 2);
      };
      function isOrNot(b, trueStr, falseStr) {
        return b ? trueStr ? trueStr : "■是 □否" : falseStr ? falseStr : "□是 ■否";
      }
      const doDocPreview = () => {
        loading.value = true;
        const value = form.value;
        const data = {
          sbr: value.sbr,
          cpmc: value.cpmc,
          ajbh: value.ajbh,
          slrq: value.slrq,
          ggxh: value.ggxh,
          scdz: value.scdz,
          teckCheckContent: value.teckCheckContent,
          realChangeInfoStr: value.realChangeInfoStr,
          changeTypeStr: value.changeTypeStr,
          isSystemCheckStr: isOrNot(value.isSystemCheck),
          isSystemCheckPassedStr: value.isSystemCheck ? isOrNot(
            value.isSystemCheckPassed,
            "■通过核查 □未通过核查",
            "□通过核查 ■未通过核查"
          ) : "□通过核查 □未通过核查",
          isPatchedStr: isOrNot(value.isPatched),
          patchContent: value.patchContent,
          patchDate: !value.isPatched ? "" : value.patchDate.toISOString().substring(0, 10),
          isPatchPassedStr: value.isPatched ? isOrNot(value.isPatchPassed) : "□是 □否",
          isUseForceStandardStr: isOrNot(value.isUseForceStandard),
          isTechRequireChangeStr: isOrNot(realChangeInfo.value[1].checked),
          isInstructionChangeStr: isOrNot(value.isInstructionChange),
          isSelfTestReportStr: isOrNot(
            value.isSelfTestReport,
            "■注册人出具的自检报告 □委托有资质的医疗器械检验机构出具的检验报告",
            "□注册人出具的自检报告 ■委托有资质的医疗器械检验机构出具的检验报告"
          ),
          isNoClinicalStr: isOrNot(value.isNoClinical),
          isEquivalentStr: isOrNot(value.isEquivalent),
          proveInfoStr: value.proveInfoStr,
          beforChangeContent: value.beforChangeContent,
          afterChangeContent: value.afterChangeContent,
          attachInfoStr: value.attachInfoStr,
          conclusionInfoStr: value.conclusionInfoStr
        };
        console.log(data);
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/74645f5a-d807-4634-a6c8-2b52109f8619.docx`,
          data,
          saveName: `第二类医疗器械注册技术审评报告-${form.value.cpmc}.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        form.value = {
          className: "",
          teckCheckContent: "****",
          applyChangeInfoStr: "",
          realChangeInfoStr: "",
          changeTypeStr: "",
          isSystemCheck: false,
          isSystemCheckPassed: true,
          isPatched: true,
          patchContent: "见材料补充环节意见。",
          patchDate: /* @__PURE__ */ new Date(),
          isPatchPassed: true,
          isUseForceStandard: false,
          isInstructionChange: false,
          isSelfTestReport: false,
          isNoClinical: true,
          isEquivalent: false,
          proveInfoStr: "",
          beforChangeContent: "",
          afterChangeContent: "",
          attachInfoStr: "",
          conclusion: 0,
          conclusionInfoStr: "",
          conclusionReason: "",
          ...props.form
        };
        conclusionInfoChange(0);
        attachInfoChange();
        typeChange();
        proveInfoChange();
        realInfoChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form_item, { label: "注册证号" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                modelValue: form.value.regCode,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.regCode = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "申请变更信息" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$d, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(applyChangeInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: applyInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "技术审查内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.teckCheckContent,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.teckCheckContent = $event)
              }, null, 8, ["modelValue"]),
              vue.createElementVNode("span", {
                onClick: teckCheckContentInit,
                style: { "color": "gray", "font-size": "0.8em", "cursor": "pointer" }
              }, "自动生成")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "实际变更情况" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2$9, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(realChangeInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: realInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变更涉及的变化类型" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3$8, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(changeType.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: typeChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "是否需要针对变化部分进行质量管理体系核查" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4$8, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.isSystemCheck = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.isSystemCheck = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "质量管理体系核查结果" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5$7, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("通过核查")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("未通过核查")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.isSystemCheck]
          ]),
          vue.createVNode(_component_el_form_item, { label: "是否存在注册申报资料发补情况" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_6$3, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.isPatched = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.isPatched = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 0,
            label: "需一次性补正的内容"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.patchContent,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.patchContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 1,
            label: "补正材料收审时间"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_date_picker, {
                modelValue: form.value.patchDate,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.patchDate = $event),
                type: "date",
                placeholder: "选择日期",
                format: "YYYY-MM-DD"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 2,
            label: "补正后注册申报资料是否规范"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_7$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.isPatchPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.isPatchPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_form_item, { label: "申报产品是否适用强制性标准" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_8$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isUseForceStandard,
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.isUseForceStandard = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isUseForceStandard,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.isUseForceStandard = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品说明书是否发生变化" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_9$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isInstructionChange,
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.isInstructionChange = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isInstructionChange,
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.isInstructionChange = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品检验报告提交形式" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_10$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSelfTestReport,
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.value.isSelfTestReport = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("注册人出具的自检报告")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSelfTestReport,
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.value.isSelfTestReport = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("委托有资质的医疗器械检验机构出具的检验报告")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品是否免于临床评价" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_11$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isNoClinical,
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.value.isNoClinical = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isNoClinical,
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.value.isNoClinical = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变化部分是否有可能影响产品安全、有效及申报产品与《免于进行临床评价医疗器械目录》所述产品等同性论证" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_12$2, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isEquivalent,
                  "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.value.isEquivalent = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isEquivalent,
                  "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.value.isEquivalent = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "证明资料" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_13$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(proveInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: proveInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变更前内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.beforChangeContent,
                "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.value.beforChangeContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "变更后内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.afterChangeContent,
                "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => form.value.afterChangeContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "附页" }, {
            default: vue.withCtx(() => [
              _hoisted_14$2,
              vue.createElementVNode("div", _hoisted_15$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(attachInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: attachInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "技术审评意见 " }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_16$2, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(conclusionInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_radio, {
                      label: index,
                      modelValue: form.value.conclusion,
                      "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => form.value.conclusion = $event),
                      onChange: conclusionInfoChange
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["label", "modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "具体理由和依据" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.conclusionReason,
                "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => form.value.conclusionReason = $event),
                onInput: _cache[26] || (_cache[26] = ($event) => conclusionInfoChange(form.value.conclusion))
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.conclusion === 1]
          ]),
          vue.createVNode(_component_el_form_item, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                disabled: loading.value,
                size: "default",
                type: "primary",
                onClick: doDocPreview
              }, {
                default: vue.withCtx(() => [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass(loading.value ? "is-loading" : "")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("", true),
                  vue.createTextVNode(" 生成并下载 ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const PagePdbgBG_vue_vue_type_style_index_0_scoped_e4bc44c5_lang = "";
  const PagePdbgBG = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-e4bc44c5"]]);
  const _hoisted_1$c = { style: { "padding-left": "15px" } };
  const _hoisted_2$8 = { style: { "padding-left": "15px" } };
  const _hoisted_3$7 = { style: { "padding-left": "15px" } };
  const _hoisted_4$7 = { style: { "padding": "0 1em" } };
  const _hoisted_5$6 = { style: { "padding": "0 1em" } };
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbgYX",
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    setup(__props) {
      const props = __props;
      const loading = vue.ref(false);
      const form = vue.ref({});
      vue.watch(props, () => {
        form.value = { ...form.value, ...props.form };
      });
      const teckCheckContentInit = () => {
        form.value.teckCheckContent = `该产品为${form.value.classify}医疗器械，分类编码${form.value.classCode} ${form.value.className}，注册证号：${form.value.regCode}。`;
      };
      const proveInfo = vue.ref([
        { description: "变更注册文件及其附件的复印件", checked: false },
        { description: "依据变更注册文件修改的产品技术要求", checked: false },
        { description: "无需办理变更注册或者无需变化即可符合新的医疗器械强制性标准的情况说明和相关证明资料", checked: false }
      ]);
      const proveInfoChange = () => {
        let tmp = "";
        for (const i of proveInfo.value) {
          if (i.checked)
            tmp += "■";
          else
            tmp += "□";
          tmp += i.description + " ";
        }
        form.value.proveInfoStr = tmp.substring(0, tmp.length - 1);
      };
      const conclusionInfo = vue.ref([
        { description: "符合技术审评要求，建议准予注册。", checked: true },
        {
          description: "申请资料不符合技术审评要求，建议不予注册。\n具体理由和依据：",
          checked: false
        },
        { description: "同意企业申请，建议准予撤回。", checked: false }
      ]);
      const conclusionInfoChange = (index) => {
        let tmp = "";
        let j = 0;
        for (const i of conclusionInfo.value) {
          if (index == j)
            tmp += "■";
          else
            tmp += "□";
          if (index == j && 1 == j)
            tmp += i.description + form.value.conclusionReason + "\n";
          else
            tmp += i.description + "\n";
          tmp += "\n";
          j++;
        }
        form.value.conclusionInfoStr = tmp.substring(0, tmp.length - 2);
      };
      function isOrNot(b, trueStr, falseStr) {
        return b ? trueStr ? trueStr : "■是 □否" : falseStr ? falseStr : "□是 ■否";
      }
      const doDocPreview = () => {
        loading.value = true;
        const value = form.value;
        const data = {
          sbr: value.sbr,
          cpmc: value.cpmc,
          ajbh: value.ajbh,
          slrq: value.slrq,
          ggxh: value.ggxh,
          scdz: value.scdz,
          teckCheckContent: value.teckCheckContent,
          changeHistory: value.changeHistory,
          isPatchedStr: isOrNot(value.isPatched),
          patchContent: value.patchContent,
          patchDate: !value.isPatched ? "" : value.patchDate.toISOString().substring(0, 10),
          isPatchPassedStr: value.isPatched ? isOrNot(value.isPatchPassed) : "□是 □否",
          proveInfoStr: value.proveInfoStr,
          conclusionInfoStr: value.conclusionInfoStr,
          isForceStandardUpdateStr: isOrNot(value.isForceStandardUpdate),
          isChangedForStandardStr: isOrNot(value.isChangedForStandard),
          isTeckChangeStr: isOrNot(value.isTeckChange)
        };
        console.log(data);
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/027f947f-0093-457c-bd3b-4671f3f245cb.docx`,
          data,
          saveName: `第二类医疗器械注册技术审评报告-${form.value.cpmc}-.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        form.value = {
          className: "",
          teckCheckContent: "****",
          changeHistory: "",
          isPatched: true,
          patchContent: "见材料补充环节意见。",
          patchDate: /* @__PURE__ */ new Date(),
          isPatchPassed: true,
          proveInfoStr: "",
          conclusion: 0,
          conclusionInfoStr: "",
          conclusionReason: "",
          isForceStandardUpdate: false,
          isChangedForStandard: false,
          isTeckChange: false,
          ...props.form
        };
        conclusionInfoChange(0);
        proveInfoChange();
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form_item, { label: "技术审查内容" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.teckCheckContent,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.teckCheckContent = $event)
              }, null, 8, ["modelValue"]),
              vue.createElementVNode("span", {
                onClick: teckCheckContentInit,
                style: { "color": "gray", "font-size": "0.8em", "cursor": "pointer" }
              }, "自动生成")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "本周期内变更历史" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.changeHistory,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.changeHistory = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "是否存在注册申报资料发补情况" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatched,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.isPatched = $event),
                label: true
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("是")
                ]),
                _: 1
              }, 8, ["modelValue"]),
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatched,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.isPatched = $event),
                label: false
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("否")
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          }),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 0,
            label: "需一次性补正的内容"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.patchContent,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.patchContent = $event)
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 1,
            label: "补正材料收审时间"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_date_picker, {
                modelValue: form.value.patchDate,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.patchDate = $event),
                type: "date",
                placeholder: "选择日期",
                format: "YYYY-MM-DD"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 2,
            label: "补正后注册申报资料是否规范"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatchPassed,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.isPatchPassed = $event),
                label: true
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("是")
                ]),
                _: 1
              }, 8, ["modelValue"]),
              vue.createVNode(_component_el_radio, {
                modelValue: form.value.isPatchPassed,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.isPatchPassed = $event),
                label: false
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("否")
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_form_item, { label: "注册证效期内是否有新的医疗器械强制性标准发布实施" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$c, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isForceStandardUpdate,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.isForceStandardUpdate = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isForceStandardUpdate,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.isForceStandardUpdate = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "是否为符合新的医疗器械强制性标准办理变更注册" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2$8, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isChangedForStandard,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.isChangedForStandard = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isChangedForStandard,
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.isChangedForStandard = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "产品技术要求是否发生变更" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3$7, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isTeckChange,
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.isTeckChange = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isTeckChange,
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.isTeckChange = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "证明资料" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4$7, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(proveInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("span", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_checkbox, {
                      label: item.description,
                      modelValue: item.checked,
                      "onUpdate:modelValue": ($event) => item.checked = $event,
                      onChange: proveInfoChange
                    }, null, 8, ["label", "modelValue", "onUpdate:modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_form_item, { label: "技术审评意见 " }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5$6, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(conclusionInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_radio, {
                      label: index,
                      modelValue: form.value.conclusion,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.conclusion = $event),
                      onChange: conclusionInfoChange
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["label", "modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "具体理由和依据" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.conclusionReason,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.conclusionReason = $event),
                onInput: _cache[16] || (_cache[16] = ($event) => conclusionInfoChange(form.value.conclusion))
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.conclusion === 1]
          ]),
          vue.createVNode(_component_el_form_item, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                disabled: loading.value,
                size: "default",
                type: "primary",
                onClick: doDocPreview
              }, {
                default: vue.withCtx(() => [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass(loading.value ? "is-loading" : "")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("", true),
                  vue.createTextVNode(" 生成并下载 ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const PagePdbgYX_vue_vue_type_style_index_0_scoped_74615f82_lang = "";
  const PagePdbgYX = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-74615f82"]]);
  const _hoisted_1$b = { style: { "margin-left": "15px" } };
  const _hoisted_2$7 = { style: { "margin-left": "15px" } };
  const _hoisted_3$6 = { style: { "margin-left": "15px" } };
  const _hoisted_4$6 = { style: { "margin-left": "15px" } };
  const _hoisted_5$5 = { style: { "padding": "0 1em" } };
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbgSC",
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    setup(__props) {
      const props = __props;
      const loading = vue.ref(false);
      const form = vue.ref({});
      vue.watch(props, () => {
        form.value = { ...form.value, ...props.form };
      });
      const conclusionInfo = vue.ref([
        { description: "符合技术审评要求，建议准予注册。", checked: true },
        {
          description: "申请资料不符合技术审评要求，建议不予注册。\n具体理由和依据：",
          checked: false
        },
        { description: "同意企业申请，建议准予撤回。", checked: false }
      ]);
      const conclusionInfoChange = (index) => {
        let tmp = "";
        let j = 0;
        for (const i of conclusionInfo.value) {
          if (index == j)
            tmp += "■";
          else
            tmp += "□";
          if (index == j && 1 == j)
            tmp += i.description + form.value.conclusionReason + "\n";
          else
            tmp += i.description + "\n";
          tmp += "\n";
          j++;
        }
        form.value.conclusionInfoStr = tmp.substring(0, tmp.length - 2);
      };
      function isOrNot(b, trueStr, falseStr) {
        return b ? trueStr ? trueStr : "■是 □否" : falseStr ? falseStr : "□是 ■否";
      }
      const doDocPreview = () => {
        const value = form.value;
        const data = {
          sbr: value.sbr,
          cpmc: value.cpmc,
          ajbh: value.ajbh,
          slrq: value.slrq,
          ggxh: value.ggxh,
          scdz: value.scdz,
          isSystemCheckStr: isOrNot(value.isSystemCheck),
          isSystemCheckPassedStr: !value.isSystemCheck ? isOrNot(
            value.isSystemCheckPassed,
            "■通过核查 □整改后通过",
            "□通过核查 □整改后通过"
          ) : "□通过核查 □整改后通过",
          isPatchedStr: isOrNot(value.isPatched),
          patchDate: !value.isPatched ? "" : value.patchDate.toISOString().substring(0, 10),
          isPatchPassedStr: value.isPatched ? isOrNot(value.isPatchPassed) : "□是 □否",
          conclusionInfoStr: value.conclusionInfoStr
        };
        console.log(data);
        loading.value = true;
        docPreview({
          tempUrl: `https://mp-20c58cb4-52ce-439c-b7aa-5e9b8e8d61f7.cdn.bspapp.com/cloudstorage/5e429e48-dd47-4403-9531-f1237103e809.docx`,
          data,
          saveName: `第二类医疗器械注册技术审评报告-${form.value.cpmc}-.docx`
        }).then(() => {
          loading.value = false;
        });
      };
      vue.onMounted(() => {
        form.value = {
          isSystemCheck: false,
          isSystemCheckPassed: true,
          isPatched: true,
          patchDate: /* @__PURE__ */ new Date(),
          isPatchPassed: true,
          conclusion: 0,
          conclusionInfoStr: "",
          conclusionReason: "",
          ...props.form
        };
        conclusionInfoChange(0);
      });
      return (_ctx, _cache) => {
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_Loading = vue.resolveComponent("Loading");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_form_item, { label: "是否免于现场检查" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1$b, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.isSystemCheck = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheck,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.isSystemCheck = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "质量管理体系核查结果" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2$7, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("通过核查")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isSystemCheckPassed,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.isSystemCheckPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("整改后通过")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, !form.value.isSystemCheck]
          ]),
          vue.createVNode(_component_el_form_item, { label: "是否存在注册申报资料发补情况" }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3$6, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.isPatched = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatched,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.isPatched = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 0,
            label: "补正材料收审时间"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_date_picker, {
                modelValue: form.value.patchDate,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.patchDate = $event),
                type: "date",
                placeholder: "选择日期",
                format: "YYYY-MM-DD"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          form.value.isPatched ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
            key: 1,
            label: "补正后注册申报资料是否规范"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_4$6, [
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.isPatchPassed = $event),
                  label: true
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("是")
                  ]),
                  _: 1
                }, 8, ["modelValue"]),
                vue.createVNode(_component_el_radio, {
                  modelValue: form.value.isPatchPassed,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.isPatchPassed = $event),
                  label: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("否")
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_form_item, { label: "技术审评意见 " }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_5$5, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(conclusionInfo.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "margin-right": "15px" },
                    key: index
                  }, [
                    vue.createVNode(_component_el_radio, {
                      label: index,
                      modelValue: form.value.conclusion,
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.conclusion = $event),
                      onChange: conclusionInfoChange
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["label", "modelValue"])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_form_item, { label: "具体理由和依据" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_input, {
                type: "textarea",
                autosize: "",
                modelValue: form.value.conclusionReason,
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.conclusionReason = $event),
                onInput: _cache[11] || (_cache[11] = ($event) => conclusionInfoChange(form.value.conclusion))
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }, 512), [
            [vue.vShow, form.value.conclusion === 1]
          ]),
          vue.createVNode(_component_el_form_item, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_button, {
                disabled: loading.value,
                size: "default",
                type: "primary",
                onClick: doDocPreview
              }, {
                default: vue.withCtx(() => [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
                    key: 0,
                    class: vue.normalizeClass(loading.value ? "is-loading" : "")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("", true),
                  vue.createTextVNode(" 生成并下载 ")
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const PagePdbgSC_vue_vue_type_style_index_0_scoped_2610d8c3_lang = "";
  const PagePdbgSC = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-2610d8c3"]]);
  const _withScopeId$3 = (n) => (vue.pushScopeId("data-v-1bd68b7f"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$a = { class: "form" };
  const _hoisted_2$6 = { class: "block" };
  const _hoisted_3$5 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$5 = { class: "code" };
  const _hoisted_5$4 = {
    class: "name",
    style: { "color": "gray", "font-size": "0.8em" }
  };
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "PagePdbg",
    setup(__props) {
      const loading = vue.ref(true);
      const sxmc = vue.ref("");
      const form = vue.ref({
        classify: "无源"
      });
      const classCodeSelect = (e) => {
        form.value.classCode = e.code;
        form.value.className = e.twolevel_name;
      };
      vue.onMounted(() => {
        const id = window.location.href.match(/id=(.*?)$/)[1];
        xkbasys.getCaseInfo(id).then((res) => {
          console.warn(res);
          if (res.sxmc.indexOf("首次") !== -1) {
            sxmc.value = "sc";
          } else if (res.sxmc.indexOf("延续") !== -1) {
            sxmc.value = "yx";
          } else if (res.sxmc.indexOf("变更") !== -1) {
            sxmc.value = "bg";
          }
          form.value = { ...form.value, ...res };
          console.log(form.value);
          loading.value = false;
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_radio = vue.resolveComponent("el-radio");
        const _component_el_autocomplete = vue.resolveComponent("el-autocomplete");
        const _component_el_form = vue.resolveComponent("el-form");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$a, [
          vue.createElementVNode("div", _hoisted_2$6, [
            vue.createVNode(_component_el_form, {
              size: "default",
              model: form.value,
              "label-position": "top"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "企业名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.sbr,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "生产地址" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.scdz,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.value.scdz = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.cpmc,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.cpmc = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "规格型号" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: "",
                      modelValue: form.value.ggxh,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.value.ggxh = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "产品大类" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_radio, {
                      modelValue: form.value.classify,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.classify = $event),
                      label: "有源"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("有源")
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    vue.createVNode(_component_el_radio, {
                      modelValue: form.value.classify,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.value.classify = $event),
                      label: "无源"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("无源")
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    vue.createVNode(_component_el_radio, {
                      modelValue: form.value.classify,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.classify = $event),
                      label: "IVD"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("IVD")
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "分类编码" }, {
                  default: vue.withCtx(() => [
                    _hoisted_3$5,
                    vue.createVNode(_component_el_autocomplete, {
                      style: { "width": "100%" },
                      modelValue: form.value.classCode,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.value.classCode = $event),
                      "fetch-suggestions": vue.unref(DB).getClassCode,
                      onSelect: classCodeSelect,
                      "trigger-on-focus": false
                    }, {
                      default: vue.withCtx(({ item }) => [
                        vue.createElementVNode("div", _hoisted_4$5, vue.toDisplayString(item.code), 1),
                        vue.createElementVNode("div", _hoisted_5$4, vue.toDisplayString(item.catalogue_name) + "-" + vue.toDisplayString(item.onelevel_name) + "-" + vue.toDisplayString(item.twolevel_name), 1)
                      ]),
                      _: 1
                    }, 8, ["modelValue", "fetch-suggestions"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "分类名称" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.value.className,
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.value.className = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                sxmc.value === "bg" ? (vue.openBlock(), vue.createBlock(PagePdbgBG, {
                  key: 0,
                  form: form.value
                }, null, 8, ["form"])) : vue.createCommentVNode("", true),
                sxmc.value === "yx" ? (vue.openBlock(), vue.createBlock(PagePdbgYX, {
                  key: 1,
                  form: form.value
                }, null, 8, ["form"])) : vue.createCommentVNode("", true),
                sxmc.value === "sc" ? (vue.openBlock(), vue.createBlock(PagePdbgSC, {
                  key: 2,
                  form: form.value
                }, null, 8, ["form"])) : vue.createCommentVNode("", true)
              ]),
              _: 1
            }, 8, ["model"])
          ])
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const PagePdbg_vue_vue_type_style_index_0_scoped_1bd68b7f_lang = "";
  const PagePdbg = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-1bd68b7f"]]);
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "PageManager",
    props: {
      page: {
        type: String,
        default: ""
      }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const show = vue.ref(false);
      __expose({ show });
      return (_ctx, _cache) => {
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        return vue.openBlock(), vue.createBlock(_component_el_drawer, {
          modelValue: show.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => show.value = $event),
          size: "680",
          direction: "ltr",
          "with-header": false
        }, {
          default: vue.withCtx(() => [
            props.page === "clbc" ? (vue.openBlock(), vue.createBlock(PageClbc, { key: 0 })) : vue.createCommentVNode("", true),
            props.page === "hyjy" ? (vue.openBlock(), vue.createBlock(PageHyjy, { key: 1 })) : vue.createCommentVNode("", true),
            props.page === "hcqd" ? (vue.openBlock(), vue.createBlock(PageHcqd, { key: 2 })) : vue.createCommentVNode("", true),
            props.page === "pdbg" ? (vue.openBlock(), vue.createBlock(PagePdbg, { key: 3 })) : vue.createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const _withScopeId$2 = (n) => (vue.pushScopeId("data-v-e25ebe5f"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$9 = { id: "spnote" };
  const _hoisted_2$5 = { class: "left" };
  const _hoisted_3$4 = ["onClick"];
  const _hoisted_4$4 = {
    key: 0,
    class: "his"
  };
  const _hoisted_5$3 = ["onClick"];
  const _hoisted_6$2 = { class: "middle" };
  const _hoisted_7$1 = { class: "tools" };
  const _hoisted_8$1 = ["src"];
  const _hoisted_9$1 = ["src"];
  const _hoisted_10$1 = {
    class: "tools",
    style: { "text-align": "right" }
  };
  const _hoisted_11$1 = { class: "right" };
  const _hoisted_12$1 = {
    key: 0,
    class: "baseinfo"
  };
  const _hoisted_13$1 = { style: { "font-weight": "bold" } };
  const _hoisted_14$1 = { key: 0 };
  const _hoisted_15$1 = { key: 1 };
  const _hoisted_16$1 = { class: "comment" };
  const _hoisted_17$1 = {
    key: 0,
    style: { "text-align": "right" }
  };
  const _hoisted_18$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", { style: { "color": "gray" } }, " 保存中... ", -1));
  const _hoisted_19$1 = { class: "comment-his" };
  const _hoisted_20$1 = ["onClick"];
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "SpNote",
    setup(__props) {
      const fileId = vue.ref("");
      const token = vue.ref("");
      const id = vue.ref("");
      const iframe = vue.ref();
      const showDiff = vue.ref(false);
      const diffDirection = vue.ref("row");
      const classSearch = vue.ref("");
      const caseRecords = vue.ref();
      function openCaseRecords() {
        caseRecords.value.id = id.value;
        caseRecords.value.show = true;
      }
      const spHelper = vue.ref();
      function openSpHelper() {
        spHelper.value.show = true;
      }
      vue.watch(fileId, () => {
        var _a;
        (_a = contents.value.list) == null ? void 0 : _a.map((i) => {
          if (i.fileId === fileId.value) {
            document.title = i.clmlmc;
          }
        });
      });
      const contents = vue.ref({});
      const collapse = vue.reactive({
        left: true,
        right: true,
        leftLoading: false,
        rightLoading: false
      });
      const noteSaving = vue.ref(false);
      let noteChanged = false;
      const notes = vue.ref();
      const note = vue.computed(() => {
        const baseNote = vue.ref({
          data: { comment: "" },
          xksbxxid: id.value,
          fileId: fileId.value,
          index: 0
        });
        if (contents.value.list) {
          let index = 0;
          contents.value.list.map((v, i) => {
            if (v.fileId === fileId.value) {
              index = i;
            }
          });
          baseNote.value.index = index;
        }
        if (!notes.value) {
          return baseNote.value;
        }
        let rtn;
        notes.value.map((i) => {
          if (i.fileId === fileId.value) {
            rtn = i;
          }
        });
        return rtn ? rtn : baseNote.value;
      });
      let n_timer;
      function commentInput(value) {
        noteChanged = true;
        if (n_timer)
          clearTimeout(n_timer);
        n_timer = setTimeout(() => {
          saveNote();
        }, 60 * 1e3);
      }
      function saveNote() {
        if (!noteChanged)
          return;
        if (n_timer)
          clearTimeout(n_timer);
        noteChanged = false;
        noteSaving.value = true;
        DB.saveNote(note.value).then((res) => {
          console.warn(res.result.updated);
          if (res.result.updated === void 0)
            initNotes();
          noteSaving.value = false;
        });
      }
      vue.onMounted(() => {
        var _a;
        initData();
        initContents();
        initNotes();
        (_a = iframe.value) == null ? void 0 : _a.addEventListener("load", async () => {
          const win2 = iframe.value.contentWindow;
          if (win2.document.body.innerHTML.indexOf("票据失效，请重新登录系统！") !== -1) {
            ElementPlus.ElMessageBox.confirm("票据失效，是否重新加载？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "关闭",
              type: "warning"
            }).then(async () => {
              const token2 = await xkbasys.getToken(fileId.value);
              console.log(token2);
              window.location.href = baseUrl + `fileManager/preview?key=${fileId.value}&token=${token2}&contents=local&id=${id.value}`;
            }).catch(() => {
              window.close();
            });
          }
        });
      });
      async function initNotes() {
        DB.getNoteList(id.value).then((res) => {
          console.warn(res);
          notes.value = res;
        });
      }
      function initContents() {
        collapse.leftLoading = true;
        xkbasys.sqclmlXkbaList(id.value).then((res) => {
          var _a;
          console.warn(res[id.value]);
          contents.value = res[id.value];
          (_a = contents.value.list) == null ? void 0 : _a.map((i) => {
            if (i.fileId === null)
              i.clmlmc += "(未上传)";
            i.fileId = encodeURIComponent(i.fileId);
            if (i.fileId === fileId.value) {
              document.title = i.clmlmc;
            }
            i.fileList.map((j) => {
              j.fileId = encodeURIComponent(j.fileId);
            });
          });
          contents.value.baseinfo.cpmc = contents.value.baseinfo.cpmc.replace(/[(品种:)\(\)]/g, "");
          collapse.leftLoading = false;
        });
      }
      function initData() {
        const href = window.location.href;
        const query = {};
        href.split("?")[1].split("&").forEach((q) => {
          const t = q.split("=");
          query[t[0]] = t[1];
        });
        fileId.value = query.key;
        token.value = query.token;
        id.value = query.id;
      }
      const tools = [
        {
          title: "智械",
          url: "https://www.zhixie.info/"
        },
        {
          title: "道客",
          url: "https://www.doc88.com/"
        },
        {
          title: "行标",
          url: "http://app.nifdc.org.cn/biaogzx/qxqwk.do"
        },
        {
          title: "国标",
          url: "http://openstd.samr.gov.cn/bzgk/gb/index"
        },
        {
          title: "国家局",
          url: "https://www.nmpa.gov.cn/datasearch/search-result.html"
        },
        {
          title: "百度",
          url: "https://www.baidu.com"
        },
        {
          title: "有道",
          url: "https://fanyi.youdao.com/"
        }
      ];
      function open(url) {
        window.open(url);
      }
      const pageManager = vue.ref();
      const page = vue.ref("");
      return (_ctx, _cache) => {
        const _component_Link = vue.resolveComponent("Link");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowLeft = vue.resolveComponent("ArrowLeft");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_reading = vue.resolveComponent("reading");
        const _component_CopyDocument = vue.resolveComponent("CopyDocument");
        const _component_UserFilled = vue.resolveComponent("UserFilled");
        const _component_Loading = vue.resolveComponent("Loading");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$9, [
          vue.createElementVNode("div", _hoisted_2$5, [
            vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              class: "body",
              style: vue.normalizeStyle(`width: ${collapse.left ? 300 : 0}px`)
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(contents.value.list, (c) => {
                return vue.openBlock(), vue.createElementBlock("div", null, [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["item", c.fileId !== "null" ? c.fileId === fileId.value ? "active" : "" : "null"])
                  }, [
                    vue.createVNode(_component_el_link, {
                      underline: false,
                      target: "_blank",
                      href: "?key=" + c.fileId + "&token=" + token.value + "&id=" + id.value
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_icon, { class: "icon" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_Link)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 2
                    }, 1032, ["href"]),
                    vue.createElementVNode("span", {
                      onClick: ($event) => c.fileId !== "null" && (fileId.value = c.fileId)
                    }, vue.toDisplayString(c.clmlmc), 9, _hoisted_3$4)
                  ], 2),
                  c.fileList.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$4, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(c.fileList, (h, i) => {
                      return vue.openBlock(), vue.createElementBlock("div", null, [
                        vue.createElementVNode("div", {
                          class: vue.normalizeClass(["item", h.fileId === fileId.value ? "active" : ""])
                        }, [
                          vue.createElementVNode("span", {
                            onClick: ($event) => fileId.value = h.fileId
                          }, [
                            vue.createVNode(_component_el_tooltip, {
                              content: h.scyj
                            }, {
                              default: vue.withCtx(() => [
                                vue.createTextVNode(" 历史上传：" + vue.toDisplayString(h.fileName), 1)
                              ]),
                              _: 2
                            }, 1032, ["content"])
                          ], 8, _hoisted_5$3)
                        ], 2)
                      ]);
                    }), 256))
                  ])) : vue.createCommentVNode("", true)
                ]);
              }), 256))
            ], 4)), [
              [_directive_loading, collapse.leftLoading]
            ]),
            vue.createElementVNode("div", {
              class: "cbtn",
              onClick: _cache[0] || (_cache[0] = ($event) => collapse.left = !collapse.left)
            }, [
              !collapse.left ? (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 0 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowRight)
                ]),
                _: 1
              })) : (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 1 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowLeft)
                ]),
                _: 1
              }))
            ])
          ]),
          vue.createElementVNode("div", _hoisted_6$2, [
            vue.createElementVNode("div", _hoisted_7$1, [
              vue.createVNode(_component_el_input, {
                class: "classify",
                onClick: openSpHelper,
                modelValue: classSearch.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => classSearch.value = $event),
                "prefix-icon": vue.unref(ElementPlusIconsVue.Search),
                placeholder: "分类 / 免临床 / 标准 / 指导原则",
                clearable: ""
              }, null, 8, ["modelValue", "prefix-icon"]),
              vue.createVNode(_component_el_button, { onClick: openCaseRecords }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("办理记录")
                ]),
                _: 1
              }),
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(tools, (t) => {
                return vue.createVNode(_component_el_button, {
                  onClick: ($event) => open(t.url)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(t.title), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"]);
              }), 64))
            ]),
            vue.createElementVNode("div", {
              class: "iframe",
              style: vue.normalizeStyle(`flex-direction: ${diffDirection.value};`)
            }, [
              vue.createElementVNode("div", {
                class: "diff-btn row",
                onClick: _cache[2] || (_cache[2] = ($event) => {
                  diffDirection.value == "row" || !showDiff.value ? showDiff.value = !showDiff.value : "";
                  diffDirection.value = "row";
                })
              }, [
                vue.createVNode(_component_el_icon, { size: "15" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_reading)
                  ]),
                  _: 1
                })
              ]),
              vue.createElementVNode("div", {
                class: "diff-btn column",
                onClick: _cache[3] || (_cache[3] = ($event) => {
                  diffDirection.value == "column" || !showDiff.value ? showDiff.value = !showDiff.value : "";
                  diffDirection.value = "column";
                })
              }, [
                vue.createVNode(_component_el_icon, { size: "15" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_reading)
                  ]),
                  _: 1
                })
              ]),
              vue.createElementVNode("iframe", {
                width: "100%",
                height: "100%",
                ref_key: "iframe",
                ref: iframe,
                src: "/fileManager/fileresource.pdf?key=" + fileId.value + "&token=" + token.value + "&id=" + id.value,
                frameborder: "no",
                border: "0"
              }, null, 8, _hoisted_8$1),
              showDiff.value ? (vue.openBlock(), vue.createElementBlock("iframe", {
                key: 0,
                width: "100%",
                height: "100%",
                src: "/fileManager/fileresource.pdf?key=" + fileId.value + "&token=" + token.value + "&id=" + id.value,
                frameborder: "no",
                border: "0"
              }, null, 8, _hoisted_9$1)) : vue.createCommentVNode("", true)
            ], 4),
            vue.createElementVNode("div", _hoisted_10$1, [
              vue.createVNode(_component_el_button, {
                onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(xkbasys).todo(contents.value.baseinfo.xksbxxid, contents.value.baseinfo.hjmc, contents.value.baseinfo.activityInstId))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("业务办理")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[5] || (_cache[5] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "clbc";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("材料补充")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[6] || (_cache[6] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "hyjy";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("会议纪要")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[7] || (_cache[7] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "hcqd";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("核查清单")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[8] || (_cache[8] = ($event) => {
                  pageManager.value.show = true;
                  page.value = "pdbg";
                })
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("评定报告")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                onClick: _cache[9] || (_cache[9] = ($event) => vue.unref(copy)(
                  `${contents.value.baseinfo.sbr}-${contents.value.baseinfo.cpmc}-${contents.value.baseinfo.ajbh}`
                ))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("生成目录")
                ]),
                _: 1
              })
            ])
          ]),
          vue.createElementVNode("div", _hoisted_11$1, [
            vue.createElementVNode("div", {
              class: "cbtn",
              onClick: _cache[10] || (_cache[10] = ($event) => collapse.right = !collapse.right)
            }, [
              collapse.right ? (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 0 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowRight)
                ]),
                _: 1
              })) : (vue.openBlock(), vue.createBlock(_component_el_icon, { key: 1 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_ArrowLeft)
                ]),
                _: 1
              }))
            ]),
            vue.createElementVNode("div", {
              class: "body",
              style: vue.normalizeStyle(`width: ${collapse.right ? 500 : 0}px`)
            }, [
              contents.value.baseinfo ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$1, [
                vue.createElementVNode("div", _hoisted_13$1, [
                  vue.createTextVNode(vue.toDisplayString(contents.value.baseinfo.sxmc) + " ", 1),
                  vue.createElementVNode("span", {
                    class: "copyable",
                    onClick: _cache[11] || (_cache[11] = ($event) => vue.unref(copy)(contents.value.baseinfo.ajbh))
                  }, [
                    vue.createTextVNode(" （ "),
                    vue.createVNode(_component_el_icon, null, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_CopyDocument)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(contents.value.baseinfo.ajbh) + " ） ", 1)
                  ])
                ]),
                vue.createElementVNode("div", {
                  class: "copyable",
                  onClick: _cache[12] || (_cache[12] = ($event) => vue.unref(copy)(contents.value.baseinfo.sbr))
                }, vue.toDisplayString(contents.value.baseinfo.sbr), 1),
                vue.createElementVNode("div", {
                  class: "copyable",
                  onClick: _cache[13] || (_cache[13] = ($event) => vue.unref(copy)(contents.value.baseinfo.scdz))
                }, vue.toDisplayString(contents.value.baseinfo.scdz), 1),
                vue.createElementVNode("div", {
                  class: "copyable",
                  onClick: _cache[14] || (_cache[14] = ($event) => vue.unref(copy)(contents.value.baseinfo.cpmc))
                }, vue.toDisplayString(contents.value.baseinfo.cpmc), 1),
                vue.createElementVNode("div", null, [
                  contents.value.baseinfo.wtdlr ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_14$1, vue.toDisplayString(contents.value.baseinfo.wtdlr) + " " + vue.toDisplayString(contents.value.baseinfo.wtdlrlxdh), 1)) : vue.createCommentVNode("", true),
                  contents.value.baseinfo.wtdlr !== contents.value.baseinfo.lxdlr ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_15$1, [
                    vue.createVNode(_component_el_icon, { style: { "transform": "translateY(2px)" } }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_UserFilled)
                      ]),
                      _: 1
                    }),
                    vue.createTextVNode(" " + vue.toDisplayString(contents.value.baseinfo.lxdlr) + " " + vue.toDisplayString(contents.value.baseinfo.lxdlrsjhm), 1)
                  ])) : vue.createCommentVNode("", true)
                ])
              ])) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", _hoisted_16$1, [
                vue.createVNode(_component_el_input, {
                  disabled: noteSaving.value,
                  onBlur: saveNote,
                  onInput: _cache[15] || (_cache[15] = ($event) => commentInput()),
                  modelValue: note.value.data.comment,
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => note.value.data.comment = $event),
                  rows: 8,
                  type: "textarea"
                }, null, 8, ["disabled", "modelValue"]),
                noteSaving.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17$1, [
                  vue.createVNode(_component_el_icon, { class: "is-loading" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_Loading)
                    ]),
                    _: 1
                  }),
                  _hoisted_18$1
                ])) : vue.createCommentVNode("", true)
              ]),
              vue.createElementVNode("div", _hoisted_19$1, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(notes.value, (n) => {
                  return vue.openBlock(), vue.createElementBlock("div", null, [
                    n.data.comment ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: vue.normalizeClass(["item", fileId.value === n.fileId ? "active" : ""]),
                      onClick: ($event) => fileId.value = n.fileId
                    }, vue.toDisplayString(n.data.comment), 11, _hoisted_20$1)) : vue.createCommentVNode("", true)
                  ]);
                }), 256))
              ])
            ], 4)
          ]),
          vue.createVNode(CaseRecords, {
            ref_key: "caseRecords",
            ref: caseRecords
          }, null, 512),
          vue.createVNode(SpHelperVue, {
            ref_key: "spHelper",
            ref: spHelper,
            iscomp: true
          }, null, 512),
          vue.createVNode(_sfc_main$c, {
            ref_key: "pageManager",
            ref: pageManager,
            page: page.value
          }, null, 8, ["page"])
        ]);
      };
    }
  });
  const SpNote_vue_vue_type_style_index_0_scoped_e25ebe5f_lang = "";
  const SpNoteVue = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-e25ebe5f"]]);
  const _hoisted_1$8 = {
    key: 0,
    class: "mask"
  };
  const _hoisted_2$4 = { class: "block" };
  const _hoisted_3$3 = { class: "header" };
  const _hoisted_4$3 = { class: "title" };
  const _hoisted_5$2 = /* @__PURE__ */ vue.createStaticVNode('<div class="content" data-v-1aa0d606><div class="title" data-v-1aa0d606>【2023-09-15】</div><div class="detail" data-v-1aa0d606><div data-v-1aa0d606>1. 新增 检查查询 功能</div><div data-v-1aa0d606>2. 新增 质量审核 功能</div><div data-v-1aa0d606>3. 修复 办件查询 按事项名称查询</div></div><div class="title" data-v-1aa0d606>【2023-09-04】</div><div class="detail" data-v-1aa0d606><div data-v-1aa0d606>1. 新增 注册查询 功能</div><div data-v-1aa0d606>2. 新增 业务分发 功能</div><div data-v-1aa0d606>3. 新增 我的待办-导出 功能</div><div data-v-1aa0d606>4. 修复 我的待办-业务办理</div></div></div>', 1);
  const _hoisted_6$1 = { class: "footer" };
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "Notice",
    setup(__props) {
      const { user: user2 } = storeToRefs(userStore(pinia));
      const show = vue.ref(true);
      vue.onMounted(() => {
        let ov = localStorage.getItem("version");
        if (ov && ov === GM_info.script.version) {
          show.value = false;
        } else {
          db.collection("user").where({ userId: user2.value.userId }).get().then((r) => {
            const data = {
              userId: user2.value.userId,
              name: user2.value.name,
              deptName: user2.value.deptName,
              date: /* @__PURE__ */ new Date(),
              version: GM_info.script.version
            };
            if (r.result.data.length > 0) {
              db.collection("user").where({ userId: user2.value.userId }).update(data);
            } else {
              db.collection("user").add(data);
            }
          });
        }
      });
      const close = () => {
        show.value = false;
        localStorage.setItem("version", GM_info.script.version);
      };
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        return show.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$8, [
          vue.createElementVNode("div", _hoisted_2$4, [
            vue.createElementVNode("div", _hoisted_3$3, [
              vue.createElementVNode("div", _hoisted_4$3, vue.toDisplayString(vue.unref(GM_info).script.description), 1),
              vue.createElementVNode("div", {
                class: "close",
                onClick: close
              }, [
                vue.createVNode(_component_el_icon, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElementPlusIconsVue.Close))
                  ]),
                  _: 1
                })
              ])
            ]),
            _hoisted_5$2,
            vue.createElementVNode("div", _hoisted_6$1, " 插件版本：" + vue.toDisplayString(vue.unref(GM_info).script.version), 1)
          ])
        ])) : vue.createCommentVNode("", true);
      };
    }
  });
  const Notice_vue_vue_type_style_index_0_scoped_1aa0d606_lang = "";
  const NoticeVue = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-1aa0d606"]]);
  const _hoisted_1$7 = { class: "vesion-block" };
  const _hoisted_2$3 = {
    key: 0,
    class: "links"
  };
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "Version",
    setup(__props) {
      const { user: user2 } = storeToRefs(userStore(pinia));
      const loading = vue.ref(true);
      const getAllusers = () => {
        db.collection("user").get().then((res) => {
          allUsers.value = res.result.data;
          loading.value = false;
        });
      };
      const showAllVersions = vue.ref(false);
      const allUsers = vue.ref([]);
      const gotoMonkey = () => {
        showAllVersions.value = true;
        getAllusers();
      };
      const deleteUser = function(id) {
        loading.value = true;
        db.collection("user").doc(id).remove().then((res) => {
          getAllusers();
        });
      };
      return (_ctx, _cache) => {
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
          vue.unref(user2).name === "孙森" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$3, [
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DUVVuQ3NldFFWUkxh?tab=BB08J2&u=b44a8fcc52544ae5af322d49839f0975"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("百名专家进药企")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DU3RrVkpibGhrTWdQ?tab=BB08J2&u=85c2629ff7fd4714bc9e3401d4b7b23c"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("不合格登记")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DU2FjelVsYm1ST3Fk?tab=BB08J2&u=85c2629ff7fd4714bc9e3401d4b7b23c"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("省局退回登记")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DWkFlRUZlTHZxSFly?groupUin=qVPTAf1U6KaM%252F0jVCz8LAg%253D%253D&ADUIN=627796844&ADSESSION=1683168625&ADTAG=CLIENT.QQ.5687_.0&ADPUBNO=27284&jumpuin=627796844&tab=BB08J2&u=b44a8fcc52544ae5af322d49839f0975"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("器械检查登记")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DUUhkeXRtZ3pJYkZy?tab=BB08J2&u=b44a8fcc52544ae5af322d49839f0975"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("设计开发")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DSWZaaVdMRWRMTnhB?tab=000001"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("2023汇总")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_link, {
              target: "_blank",
              class: "link",
              href: "https://docs.qq.com/sheet/DSWVDcWp1VmFKeVNR?tab=t354ic"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("2022汇总")
              ]),
              _: 1
            })
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", null, [
            vue.createVNode(_component_el_tooltip, {
              content: vue.unref(GM_info).script.version
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_icon, {
                  size: "24",
                  class: "icon",
                  onClick: gotoMonkey
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElementPlusIconsVue.InfoFilled))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["content"])
          ]),
          vue.createVNode(_component_el_dialog, {
            "append-to-body": "",
            title: "版本使用情况",
            modelValue: showAllVersions.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showAllVersions.value = $event),
            width: "600px"
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_table, {
                data: allUsers.value,
                size: "small",
                height: "400"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    prop: "name",
                    label: "用户名",
                    width: "80"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "deptName",
                    label: "部门",
                    width: "120"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "version",
                    label: "版本",
                    width: "100"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    prop: "date",
                    label: "日期"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "操作",
                    width: "60"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_button, {
                        size: "small",
                        type: "danger",
                        onClick: ($event) => deleteUser(scope.row._id)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_icon, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(vue.unref(ElementPlusIconsVue.Delete))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["data"])), [
                [_directive_loading, loading.value]
              ])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  });
  const Version_vue_vue_type_style_index_0_scoped_eaf9bc64_lang = "";
  const VersionVue = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-eaf9bc64"]]);
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-cf9d4bcb"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$6 = { class: "search" };
  const _hoisted_2$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseSearch",
    props: {
      jbrList: {
        type: Array,
        default: []
      },
      filter: {
        type: Object,
        default: {}
      },
      more: {
        type: Boolean,
        default: false
      }
    },
    emits: ["change", "syncChange", "export"],
    setup(__props, { expose: __expose, emit }) {
      const props = __props;
      const more = vue.ref(false);
      const form = vue.ref({
        unitCode: "342100",
        sbsjq: "2020-04-20"
      });
      __expose({ form });
      function submit() {
        if (form.value.slrqq && typeof form.value.slrqq === "object") {
          form.value.slrqq = form.value.slrqq.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.slrqz && typeof form.value.slrqz === "object") {
          form.value.slrqz = form.value.slrqz.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjq && typeof form.value.sbsjq === "object") {
          form.value.sbsjq = form.value.sbsjq.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.sbsjz && typeof form.value.sbsjz === "object") {
          form.value.sbsjz = form.value.sbsjz.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.bjrqq && typeof form.value.bjrqq === "object") {
          form.value.bjrqq = form.value.bjrqq.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        if (form.value.bjrqz && typeof form.value.bjrqz === "object") {
          form.value.bjrqz = form.value.bjrqz.toISOString().substring(0, 10).replace(/\//g, "-");
        }
        emit("change", form.value);
      }
      function _export() {
        emit("export");
      }
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_ArrowRight = vue.resolveComponent("ArrowRight");
        const _component_ArrowDown = vue.resolveComponent("ArrowDown");
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createVNode(_component_el_form, {
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              props.filter.sbr !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 0,
                label: "企业名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sbr,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.value.sbr = $event),
                    onInput: _cache[1] || (_cache[1] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.ajbh !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 1,
                label: "受理编号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.ajbh,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.value.ajbh = $event),
                    onInput: _cache[3] || (_cache[3] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.sxmc !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 2,
                label: "事项名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.sxmc,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.value.sxmc = $event),
                    onChange: _cache[5] || (_cache[5] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.cpmc !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 3,
                label: "产品名称",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.cpmc,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.value.cpmc = $event),
                    onChange: _cache[7] || (_cache[7] = ($event) => emit("syncChange", form.value)),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: submit
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("筛选")
                    ]),
                    _: 1
                  }),
                  props.filter.export ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                    key: 0,
                    type: "primary",
                    onClick: _export
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("导出")
                    ]),
                    _: 1
                  })) : vue.createCommentVNode("", true),
                  vue.createVNode(_component_el_button, {
                    onClick: _cache[8] || (_cache[8] = ($event) => more.value = !more.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_icon, null, {
                        default: vue.withCtx(() => [
                          !more.value ? (vue.openBlock(), vue.createBlock(_component_ArrowRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_ArrowDown, { key: 1 }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          props.more ? (vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            inline: true,
            size: "default"
          }, {
            default: vue.withCtx(() => [
              props.filter.sbsj !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 0,
                label: "申请时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjq,
                            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.value.sbsjq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.sbsjz,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.value.sbsjz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.sbzt !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 1,
                label: "申报状态",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sbzt,
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.value.sbzt = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "待受理",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "办理中",
                        value: "3"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已办结",
                        value: "2"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.hjmc !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 2,
                label: "办理环节",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.hjmc,
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.value.hjmc = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "请选择",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "受理",
                        value: "受理"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审查中",
                        value: "审查中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "审批中",
                        value: "审批中"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补齐补正",
                        value: "补齐补正"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补充材料",
                        value: "补充材料"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "整改",
                        value: "整改"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "制证",
                        value: "制证"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "技术审评",
                        value: "技术审评"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "送达",
                        value: "送达"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "签收",
                        value: "签收"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "流程结束",
                        value: "流程结束"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              _hoisted_2$2,
              props.filter.slrq !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 3,
                label: "受理时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqq,
                            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.value.slrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.slrqz,
                            "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.value.slrqz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.xklbzldm !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 4,
                label: "业务类型",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.xklbzldm,
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.value.xklbzldm = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "新办/核发",
                        value: "01"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "变更",
                        value: "02"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "延续",
                        value: "03"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "补办",
                        value: "04"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "注销/撤销",
                        value: "05"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "换证",
                        value: "11"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "换发",
                        value: "12"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.jdswh !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 5,
                label: "决定书文号",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    clearable: "",
                    modelValue: form.value.jdswh,
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.value.jdswh = $event),
                    style: { "width": "150px" }
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              _hoisted_3$2,
              props.filter.bjrq !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 6,
                label: "办结时间",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.bjrqq,
                            "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.value.bjrqq = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        style: { "text-align": "center" },
                        span: 2
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 11 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_date_picker, {
                            style: { "width": "150px" },
                            type: "date",
                            placeholder: "选择日期",
                            modelValue: form.value.bjrqz,
                            "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.value.bjrqz = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.bljg !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 7,
                label: "办理结果",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.bljg,
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.value.bljg = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "不予受理",
                        value: "3"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "不予许可（备案）",
                        value: "2"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "准予许可（备案）",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.sfcngz !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 8,
                label: "承诺告知",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfcngz,
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.value.sfcngz = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "0"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              _hoisted_4$2,
              props.filter.sfzdhy !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 9,
                label: "自动核验",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfzdhy,
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.value.sfzdhy = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "99"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "88"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.zdhysftg !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 10,
                label: "核验通过",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.zdhysftg,
                    "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.value.zdhysftg = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "是",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "否",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.sfgq !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 11,
                label: "是否挂起",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.sfgq,
                    "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => form.value.sfgq = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "已挂起",
                        value: "1"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "未挂起",
                        value: "0"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.gqzt !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 12,
                label: "正在挂起",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.gqzt,
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => form.value.gqzt = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "挂起结束",
                        value: "0"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "挂起中",
                        value: "1"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              _hoisted_5$1,
              props.filter.unitCode !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 13,
                label: "办理单位",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.unitCode,
                    "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => form.value.unitCode = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "全部",
                        value: ""
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "药品审评查验中心",
                        value: "342100"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true),
              props.filter.xzqhdm !== false ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                key: 14,
                label: "所属地区",
                "label-width": "7em"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_select, {
                    modelValue: form.value.xzqhdm,
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => form.value.xzqhdm = $event),
                    placeholder: "请选择",
                    style: { "width": "150px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_option, {
                        label: "安徽省",
                        value: "34"
                      }),
                      vue.createVNode(_component_el_option, {
                        label: "合肥市",
                        value: "3401"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              })) : vue.createCommentVNode("", true)
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const BaseSearch_vue_vue_type_style_index_0_scoped_cf9d4bcb_lang = "";
  const BaseSearch = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-cf9d4bcb"]]);
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "QualityAnalysisSearch",
    emits: ["change"],
    setup(__props, { expose: __expose, emit }) {
      const filter = vue.reactive({
        // sbr: false,
        // ajbh: false,
        // sbzt: false,
        hjmc: false,
        sbsj: false,
        xklbzldm: false,
        jdswh: false,
        sfcngz: false,
        sfzdhy: false,
        zdhysftg: false,
        sfgq: false,
        gqzt: false,
        unitCode: false,
        xzqhdm: false
      });
      const formRef = vue.ref();
      const form = vue.ref({
        unitCode: "342100",
        sbsjq: "2020-04-20"
      });
      __expose({ form });
      function change(_form) {
        form.value = _form;
        emit("change", form.value);
      }
      vue.onMounted(() => {
        formRef.value.form.bjrqz = /* @__PURE__ */ new Date();
        formRef.value.form.sbzt = "2";
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(BaseSearch, {
          onChange: change,
          filter,
          ref_key: "formRef",
          ref: formRef
        }, null, 8, ["filter"]);
      };
    }
  });
  const _hoisted_1$5 = { class: "pagiNation" };
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "QualityAnalysis",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      const doneList = vue.ref([]);
      const searchRef = vue.ref();
      const pageInfo = vue.ref({
        page: 1,
        size: 20
      });
      const pageTotal = vue.ref(0);
      vue.watch(pageInfo.value, () => {
        getList();
      });
      function getList() {
        loading.value = true;
        xkbasys.tjpage({
          ...searchRef.value.form,
          rows: pageInfo.value.size,
          page: pageInfo.value.page
        }).then((res) => {
          console.warn(res);
          pageTotal.value = res.recordCount;
          doneList.value = res.items;
        }).finally(() => {
          loading.value = false;
        });
      }
      function onSearch(form) {
        getList();
      }
      vue.onMounted(() => {
        height.value = $(".qualityAnalysis").parent().parent()[0].clientHeight;
        getList();
      });
      return (_ctx, _cache) => {
        const _component_el_pagination = vue.resolveComponent("el-pagination");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "qualityAnalysis",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(_sfc_main$7, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch
          }, null, 512),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: doneList.value,
            filter: ["jbr"],
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$5, [
            vue.createVNode(_component_el_pagination, {
              small: "",
              background: "",
              layout: "prev, pager, next,sizes, total",
              total: pageTotal.value,
              "page-sizes": [20, 50, 100, 200, 500],
              "page-size": pageInfo.value.size,
              "onUpdate:pageSize": _cache[0] || (_cache[0] = ($event) => pageInfo.value.size = $event),
              "current-page": pageInfo.value.page,
              "onUpdate:currentPage": _cache[1] || (_cache[1] = ($event) => pageInfo.value.page = $event)
            }, null, 8, ["total", "page-size", "current-page"])
          ])
        ], 4);
      };
    }
  });
  const QualityAnalysis_vue_vue_type_style_index_0_scoped_c9a0e360_lang = "";
  const QualityAnalysisVue = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-c9a0e360"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-7c29e1fe"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$4 = { class: "search" };
  const _hoisted_2$1 = { class: "pans" };
  const _hoisted_3$1 = {
    key: 0,
    class: "pan"
  };
  const _hoisted_4$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "接收", -1));
  const _hoisted_5 = {
    key: 0,
    class: "divider"
  };
  const _hoisted_6 = {
    key: 1,
    class: "divider"
  };
  const _hoisted_7 = {
    key: 2,
    class: "divider"
  };
  const _hoisted_8 = {
    key: 3,
    class: "divider"
  };
  const _hoisted_9 = { class: "rows" };
  const _hoisted_10 = { class: "key" };
  const _hoisted_11 = { class: "value" };
  const _hoisted_12 = {
    key: 4,
    class: "rows"
  };
  const _hoisted_13 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "key" }, "器械注册：首/变/延/书", -1));
  const _hoisted_14 = { class: "value" };
  const _hoisted_15 = {
    key: 1,
    class: "pan"
  };
  const _hoisted_16 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "办结【总数/不通过数/撤回数】", -1));
  const _hoisted_17 = {
    key: 0,
    class: "divider"
  };
  const _hoisted_18 = {
    key: 1,
    class: "divider"
  };
  const _hoisted_19 = {
    key: 2,
    class: "divider"
  };
  const _hoisted_20 = {
    key: 3,
    class: "divider"
  };
  const _hoisted_21 = { class: "rows" };
  const _hoisted_22 = { class: "key" };
  const _hoisted_23 = { class: "value" };
  const _hoisted_24 = {
    key: 4,
    class: "rows"
  };
  const _hoisted_25 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "key" }, "器械注册：首/变/延/书", -1));
  const _hoisted_26 = { class: "value" };
  const _hoisted_27 = {
    key: 2,
    class: "pan"
  };
  const _hoisted_28 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "title" }, "在办【总数（2022在办数）】", -1));
  const _hoisted_29 = {
    key: 0,
    class: "divider"
  };
  const _hoisted_30 = {
    key: 1,
    class: "divider"
  };
  const _hoisted_31 = {
    key: 2,
    class: "divider"
  };
  const _hoisted_32 = {
    key: 3,
    class: "divider"
  };
  const _hoisted_33 = { class: "rows" };
  const _hoisted_34 = { class: "key" };
  const _hoisted_35 = { class: "value" };
  const _hoisted_36 = {
    key: 4,
    class: "rows"
  };
  const _hoisted_37 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "key" }, "器械注册：首/变/延/书", -1));
  const _hoisted_38 = { class: "value" };
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "QualityCount",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const pageInfo = vue.ref({
        page: 1,
        size: 2e4
      });
      const today = /* @__PURE__ */ new Date();
      const countDate = vue.ref({
        // q: '2023-04-20',
        q: new Date(today.setDate(today.getDate() - 7)),
        // z: '2023-05-24',
        z: /* @__PURE__ */ new Date()
      });
      const recevieData = vue.ref([]);
      const sendData = vue.ref([]);
      const onlineData = vue.ref([]);
      function getList() {
        loading.value = true;
        const q = typeof countDate.value.q === "object" ? countDate.value.q.toISOString().substring(0, 10) : countDate.value.q;
        const z = typeof countDate.value.z === "object" ? countDate.value.z.toISOString().substring(0, 10) : countDate.value.z;
        Promise.all([
          xkbasys.tjpage({
            slrqq: q,
            slrqz: z,
            rows: pageInfo.value.size,
            page: pageInfo.value.page
          }),
          xkbasys.tjpage({
            bjrqq: q,
            bjrqz: z,
            rows: pageInfo.value.size,
            page: pageInfo.value.page
          }),
          xkbasys.tjpage({
            sbzt: "3",
            rows: pageInfo.value.size,
            page: pageInfo.value.page
          })
        ]).then(async (res) => {
          async function doooo(items, comment) {
            let rep = [];
            items = items.filter((i) => {
              if (rep.includes(i.ajbh))
                return false;
              else {
                rep.push(i.ajbh);
                return true;
              }
            });
            const maps = [
              // { name: '药品再注册', reg: ['药品再注册-常年生产的品种'], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '恢复生产', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '药品上市后变更备案', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "医疗机构制剂注册", reg: ["医疗机构制剂再注册审批", "医疗机构制剂注册审批", "医疗机构制剂补充申请审批"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '中药配方颗粒上市备案', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "品种变更药品生产场地", reg: ["品种变更药品生产场地"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              {
                name: "医疗器械注册*",
                reg: [
                  "第二类医疗器械变更注册",
                  "第二类医疗器械产品首次注册",
                  "第二类医疗器械产品延续注册",
                  "第二类体外诊断试剂变更注册",
                  "第二类体外诊断试剂产品首次注册",
                  "第二类体外诊断试剂产品延续注册",
                  "安徽省第二类医疗器械说明书变更",
                  "第二类医疗器械注册变更(许可事项)",
                  "第二类体外诊断试剂注册变更(许可事项)"
                ],
                num: 0,
                btgNum: 0,
                numLast: 0,
                chNum: 0,
                scNum: 0,
                yxNum: 0,
                bgNum: 0,
                smsNum: 0
              },
              { name: "药品生产许可", reg: ["放射性药品生产企业审批", "麻醉药品和精神药品生产审批", "药品生产许可证核发(换证)", "药品生产许可证核发", "药品生产企业迁址新建，申请《药品生产许可证》变更", "药品生产企业新增生产范围审批，申请《药品生产许可证》变更", "药品生产企业在原厂址、就原生产范围改建、新建生产车间审批", "药品生产企业变更生产范围（我省企业接受外省药品上市许可持有人委托生产的情形）审批", "药品生产企业变更生产范围和生产地址审批", "药品委托生产（委托方为我省企业）的审批-首次核发", "药品委托生产（委托方为我省企业）的审批-延续", "药品委托生产（受托方为我省企业，委托方为外省企业）的审批", "放射性药品生产企业变更", "药品生产许可证核发", "药品生产企业变更生产范围和生产地址审批", "药品生产企业变更生产范围（我省企业接受外省药品上市许可持有人委托生产的情形）审批", "我省持有人变更生产企业（包括变更受托生产企业、增加受托生产企业、持有人自行生产变更为委托生产等）审批"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "医疗机构制剂许可", reg: ["医疗机构制剂许可证配制地址变更", "医疗机构制剂许可证配制范围变更", "医疗机构制剂许可证核发(换证)", "医疗机构使用放射性药品许可"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "化妆品生产许可", reg: ["化妆品生产许可证延续", "化妆品生产许可证核发", "化妆品生产许可证变更（许可事项）", "化妆品生产许可证变更（需要技术审评或现场检查）"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '化妆品备案', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "出口欧盟原料药", reg: ["出口欧盟原料药证明文件的出具"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '药品GMP符合性', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '药品生产监督', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "药品经营许可", reg: ["体外诊断试剂（按药品管理）批发企业验收审批（与体外诊断试剂（按药品管理）批发企业筹建同时申报）", "体外诊断试剂（按药品管理）批发企业验收审批（与体外诊断试剂（按药品管理）批发企业筹建同时申报）", "体外诊断试剂（按药品管理）批发企业验收审批（与体外诊断试剂（按药品管理）批发企业筹建同时申报", "药品经营许可证换证(整体搬迁)", "药品经营许可证换证", "药品经营许可证变更经营范围（增加精神药品（限第二类））", "药品经营许可证变更经营范围（增加精神药品（限第二类）、生物制品（限体外诊断试剂））", "药品经营许可证变更仓库地址或增加仓库（整体搬迁）", "药品经营许可证变更仓库地址或增加仓库", "药品批发企业验收（与药品批发企业筹建同时申报）", "药品经营许可证变更经营范围（增加精神药品（限第二类））", "药品经营许可证变更仓库地址或增加仓库", "药品经营许可证换证", "药品经营许可证变更经营范围（增加精神药品（限第二类）、生物制品（限体外诊断试剂））", "药品经营许可证变更仓库地址或增加仓库（整体搬迁）"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '药品流通常规检查', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '药械GCP机构监督检查', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              // { name: '医疗器械GCP项目数据核查', reg: [], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "器械生产许可", reg: ["第二类、第三类医疗器械生产许可证核发", "第二类、第三类医疗器械生产许可证延续", "第二类、第三类医疗器械生产许可证许可事项变更（增加生产范围或生产地址非文字性变更）", "第二类、第三类医疗器械生产许可证许可事项变更（增加生产产品或生产地址非文字性变更）"], num: 0, btgNum: 0, numLast: 0, chNum: 0 },
              { name: "二类体系核查", reg: ["", "", "", ""], num: 0, btgNum: 0, numLast: 0, chNum: 0 }
            ];
            let n_match = {};
            for (const i of items) {
              const sxmc = i.sxmc.trim();
              let m = false;
              for (let j = 0; j < maps.length; j++) {
                const e = maps[j];
                if (e.reg.includes(sxmc) && i.slrq) {
                  e.num++;
                  m = true;
                  if (e.name === "医疗器械注册*") {
                    if (["第二类体外诊断试剂产品首次注册", "第二类医疗器械产品首次注册"].includes(sxmc)) {
                      e.scNum++;
                      maps[maps.length - 1].num++;
                      if (+i.slrq.substring(0, 4) === (/* @__PURE__ */ new Date()).getFullYear() - 1)
                        maps[maps.length - 1].numLast++;
                    } else if (["第二类医疗器械产品延续注册", "第二类体外诊断试剂产品延续注册"].includes(sxmc)) {
                      e.yxNum++;
                    } else if (["第二类医疗器械变更注册", "第二类体外诊断试剂变更注册", "第二类医疗器械注册变更(许可事项)", "第二类体外诊断试剂注册变更(许可事项)"].includes(sxmc)) {
                      e.bgNum++;
                    } else if (["安徽省第二类医疗器械说明书变更"].includes(sxmc)) {
                      e.smsNum++;
                    }
                  }
                  if (comment === "办结") {
                    if (i.bljg !== "1") {
                      let spyj = "";
                      let r = await xkbasys.getShenpiRecord(i.xksbxxid);
                      if (["注册审评部", "医疗器械检查部"].includes(r[0].bmmc)) {
                        r = (await xkbasys.shenpiRecord(i.xksbxxid)).items;
                        DB.setShenpRecordCloud({
                          xksbxxid: i.xksbxxid,
                          records: r
                        });
                      }
                      for (const y of r) {
                        spyj += y.spyj;
                      }
                      if (spyj.includes("撤回") || spyj.includes("取消")) {
                        e.chNum++;
                      } else {
                        e.btgNum++;
                      }
                    }
                  } else if (comment === "在办") {
                    if (+i.slrq.substring(0, 4) === (/* @__PURE__ */ new Date()).getFullYear() - 1)
                      e.numLast++;
                  }
                }
              }
              if (!m && i.slrq) {
                if (!n_match[sxmc])
                  n_match[sxmc] = 1;
                else
                  n_match[sxmc]++;
              }
            }
            console.warn(comment, n_match);
            return maps;
          }
          recevieData.value = await doooo(res[0].items, "接收");
          sendData.value = await doooo(res[1].items, "办结");
          onlineData.value = await doooo(res[2].items, "在办");
          const tmp = {};
          for (const i of res[0].items.concat(res[1].items).concat(res[1].items)) {
            const sxmc = i.sxmc.trim();
            if (tmp[sxmc]) {
              tmp[sxmc]++;
            } else {
              tmp[sxmc] = 1;
            }
          }
          console.warn(tmp);
        }).finally(() => {
          loading.value = false;
        });
      }
      vue.onMounted(() => {
        height.value = $(".qualityAnalysis").parent().parent()[0].clientHeight;
      });
      return (_ctx, _cache) => {
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "qualityAnalysis",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createElementVNode("div", _hoisted_1$4, [
            vue.createVNode(_component_el_form, {
              inline: true,
              size: "default"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, {
                  label: "统计时间",
                  "label-width": "7em"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_row, { style: { "width": "330px" } }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_col, { span: 11 }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_date_picker, {
                              style: { "width": "150px" },
                              type: "date",
                              placeholder: "选择日期",
                              modelValue: countDate.value.q,
                              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => countDate.value.q = $event)
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_col, {
                          style: { "text-align": "center" },
                          span: 2
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("-")
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_col, { span: 11 }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_date_picker, {
                              style: { "width": "150px" },
                              type: "date",
                              placeholder: "选择日期",
                              modelValue: countDate.value.z,
                              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => countDate.value.z = $event)
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
                vue.createVNode(_component_el_form_item, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_button, {
                      type: "primary",
                      onClick: getList
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("统计")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, [
            recevieData.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$1, [
              _hoisted_4$1,
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(recevieData.value, (v, k) => {
                return vue.openBlock(), vue.createElementBlock("div", null, [
                  k === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, " 注册审评部门 ")) : vue.createCommentVNode("", true),
                  k === 3 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, " 药化生产部 ")) : vue.createCommentVNode("", true),
                  k === 7 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, " 药品流通部 ")) : vue.createCommentVNode("", true),
                  k === 8 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, " 器械检查部 ")) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_9, [
                    vue.createElementVNode("div", _hoisted_10, vue.toDisplayString(v.name), 1),
                    vue.createElementVNode("div", _hoisted_11, vue.toDisplayString(v.num), 1)
                  ]),
                  k === 2 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
                    _hoisted_13,
                    vue.createElementVNode("div", _hoisted_14, vue.toDisplayString(v.scNum) + " / " + vue.toDisplayString(v.bgNum) + " / " + vue.toDisplayString(v.yxNum) + " / " + vue.toDisplayString(v.smsNum), 1)
                  ])) : vue.createCommentVNode("", true)
                ]);
              }), 256))
            ])) : vue.createCommentVNode("", true),
            sendData.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15, [
              _hoisted_16,
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(sendData.value, (v, k) => {
                return vue.openBlock(), vue.createElementBlock("div", null, [
                  k === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17, " 注册审评部门 ")) : vue.createCommentVNode("", true),
                  k === 3 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18, " 药化生产部 ")) : vue.createCommentVNode("", true),
                  k === 7 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19, " 药品流通部 ")) : vue.createCommentVNode("", true),
                  k === 8 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_20, " 器械检查部 ")) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_21, [
                    vue.createElementVNode("div", _hoisted_22, vue.toDisplayString(v.name), 1),
                    vue.createElementVNode("div", _hoisted_23, vue.toDisplayString(v.num) + " / " + vue.toDisplayString(v.btgNum) + " / " + vue.toDisplayString(v.chNum), 1)
                  ]),
                  k === 2 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_24, [
                    _hoisted_25,
                    vue.createElementVNode("div", _hoisted_26, vue.toDisplayString(v.scNum) + " / " + vue.toDisplayString(v.bgNum) + " / " + vue.toDisplayString(v.yxNum) + " / " + vue.toDisplayString(v.smsNum), 1)
                  ])) : vue.createCommentVNode("", true)
                ]);
              }), 256))
            ])) : vue.createCommentVNode("", true),
            onlineData.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_27, [
              _hoisted_28,
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(onlineData.value, (v, k) => {
                return vue.openBlock(), vue.createElementBlock("div", null, [
                  k === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_29, " 注册审评部门 ")) : vue.createCommentVNode("", true),
                  k === 3 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_30, " 药化生产部 ")) : vue.createCommentVNode("", true),
                  k === 7 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_31, " 药品流通部 ")) : vue.createCommentVNode("", true),
                  k === 8 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_32, " 器械检查部 ")) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_33, [
                    vue.createElementVNode("div", _hoisted_34, vue.toDisplayString(v.name), 1),
                    vue.createElementVNode("div", _hoisted_35, vue.toDisplayString(v.num) + " ( " + vue.toDisplayString(v.numLast) + " ) ", 1)
                  ]),
                  k === 2 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_36, [
                    _hoisted_37,
                    vue.createElementVNode("div", _hoisted_38, vue.toDisplayString(v.scNum) + " / " + vue.toDisplayString(v.bgNum) + " / " + vue.toDisplayString(v.yxNum) + " / " + vue.toDisplayString(v.smsNum), 1)
                  ])) : vue.createCommentVNode("", true)
                ]);
              }), 256))
            ])) : vue.createCommentVNode("", true)
          ])), [
            [_directive_loading, loading.value]
          ])
        ], 4);
      };
    }
  });
  const QualityCount_vue_vue_type_style_index_0_scoped_7c29e1fe_lang = "";
  const QualityCountVue = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-7c29e1fe"]]);
  const _hoisted_1$3 = { class: "head" };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "Dispense",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      const todoList = vue.ref([]);
      let timeout;
      let fingerprint = "";
      function getList() {
        loading.value = true;
        Promise.all([
          xkbasys._getXkdbListplus({
            zxhjmc: "质量部接收分发"
          }),
          xkbasys._getXkdbListplus({
            zxhjmc: "质量部上报省局"
          })
        ]).then((res) => {
          console.warn(res);
          const dispenseData = res[0].records.concat(res[1].records).sort((a, b) => {
            return +new Date(a.slrq) - +new Date(b.slrq);
          });
          let _fingerprint = "";
          for (const i of dispenseData) {
            _fingerprint += i.ajbh;
          }
          if (dispenseData.length !== 0 && _fingerprint !== fingerprint) {
            ElementPlus.ElMessageBox.alert("您有新的办件待分发或上报");
            Notification.requestPermission().then((res2) => {
              new Notification("您有新的办件待分发或上报", {
                dir: "ltr",
                lang: "zh-CN"
              });
            });
          }
          fingerprint = _fingerprint;
          todoList.value = dispenseData;
        }).finally(() => {
          loading.value = false;
          clearTimeout(timeout);
          timeout = setTimeout(getList, 6 * 60 * 1e3);
        });
      }
      vue.onMounted(() => {
        height.value = window.$(".dispense").parent().parent()[0].clientHeight;
        getList();
      });
      vue.onUnmounted(() => {
        console.warn("unmount...");
        clearTimeout(timeout);
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "dispense",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createElementVNode("div", _hoisted_1$3, [
            vue.createVNode(_component_el_button, {
              type: "primary",
              onClick: getList
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("刷新")
              ]),
              _: 1
            })
          ]),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: todoList.value,
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ])
        ], 4);
      };
    }
  });
  const Dispense_vue_vue_type_style_index_0_scoped_9efd8f69_lang = "";
  const DispenseVue = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-9efd8f69"]]);
  const _hoisted_1$2 = { class: "head" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "QualityCheck",
    setup(__props) {
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      const todoList = vue.ref([]);
      let timeout;
      let fingerprint = "";
      function getList() {
        loading.value = true;
        Promise.all([
          xkbasys._getXkdbListplus({
            zxhjmc: "质量部审核"
          })
        ]).then((res) => {
          console.warn(res);
          const data = res[0].records.sort((a, b) => {
            return +new Date(a.slrq) - +new Date(b.slrq);
          });
          let _fingerprint = "";
          for (const i of data) {
            _fingerprint += i.ajbh;
          }
          if (data.length !== 0 && _fingerprint !== fingerprint) {
            ElementPlus.ElMessageBox.alert("您有新的办件待审核");
            Notification.requestPermission().then((res2) => {
              new Notification("您有新的办件待审核", {
                dir: "ltr",
                lang: "zh-CN"
              });
            });
          }
          fingerprint = _fingerprint;
          todoList.value = data;
        }).finally(() => {
          loading.value = false;
          clearTimeout(timeout);
          timeout = setTimeout(getList, 10 * 60 * 1e3);
        });
      }
      vue.onMounted(() => {
        height.value = window.$(".QualityCheck").parent().parent()[0].clientHeight;
        getList();
      });
      vue.onUnmounted(() => {
        console.warn("unmount...");
        clearTimeout(timeout);
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "QualityCheck",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createElementVNode("div", _hoisted_1$2, [
            vue.createVNode(_component_el_button, {
              type: "primary",
              onClick: getList
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("刷新")
              ]),
              _: 1
            })
          ]),
          vue.withDirectives(vue.createVNode(CaseList, {
            class: "list",
            data: todoList.value,
            page: false,
            "element-loading-text": loadingText.value
          }, null, 8, ["data", "element-loading-text"]), [
            [_directive_loading, loading.value]
          ])
        ], 4);
      };
    }
  });
  const QualityCheck_vue_vue_type_style_index_0_scoped_fb22c896_lang = "";
  const QualityCheckVue = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-fb22c896"]]);
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "InconformitySearch",
    emits: ["change", "export"],
    setup(__props, { expose: __expose, emit }) {
      const filter = vue.reactive({
        // sbr: false,
        // ajbh: false,
        // sxmc: false,
        export: true,
        cpmc: false,
        sbzt: false,
        hjmc: false,
        sbsj: false,
        xklbzldm: false,
        jdswh: false,
        sfcngz: false,
        sfzdhy: false,
        zdhysftg: false,
        sfgq: false,
        gqzt: false,
        unitCode: false,
        xzqhdm: false
      });
      const formRef = vue.ref();
      const form = vue.ref({
        unitCode: "342100",
        sbsjq: "2020-04-20"
      });
      __expose({ form });
      function change(_form) {
        form.value = _form;
        emit("change", form.value);
      }
      vue.onMounted(async () => {
        const today = /* @__PURE__ */ new Date();
        const slrqq = new Date(today.setMonth(today.getMonth() - 3));
        formRef.value.form.slrqq = slrqq;
        formRef.value.form.slrqz = /* @__PURE__ */ new Date();
        formRef.value.form.sbzt = "2";
      });
      function _export() {
        emit("export");
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(BaseSearch, {
          onChange: change,
          filter,
          ref_key: "formRef",
          ref: formRef,
          onExport: _export
        }, null, 8, ["filter"]);
      };
    }
  });
  const _hoisted_1$1 = ["element-loading-text"];
  const _hoisted_2 = { class: "copyable" };
  const _hoisted_3 = { class: "clickable" };
  const _hoisted_4 = { class: "copyable" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Inconformity",
    setup(__props) {
      const searchRef = vue.ref();
      const height = vue.ref(500);
      const loading = vue.ref(false);
      const loadingText = vue.ref("拼命加载中...");
      const bfhxList = vue.ref([]);
      function onSearch() {
        getList();
      }
      function getList() {
        loading.value = true;
        xkbasys.tjpage({
          ...searchRef.value.form,
          sbzt: "2",
          unitCode: "342100",
          rows: 2e4,
          page: 1
        }).then(async (res) => {
          const bfhxIds = [];
          for (const i of res.items) {
            bfhxIds.push(i.xksbxxid);
          }
          const cloudBfhx = await DB.getBfhxByIds(bfhxIds);
          const cloudBfhxIds = [];
          for (const i of cloudBfhx) {
            cloudBfhxIds.push(i.xksbxxid);
          }
          for (let i = 0; i < res.items.length; i++) {
            const item = res.items[i];
            if (cloudBfhxIds.includes(item.xksbxxid))
              continue;
            await xkbasys.getBfhxPage(item.xksbxxid).then(async ({ items: list }) => {
              if (list.length) {
                const obj = {
                  xksbxxid: item.xksbxxid,
                  sbr: item.sbr,
                  cpmc: item.cpmc.trim(),
                  sxmc: item.sxmc,
                  jcry: "",
                  jcsj: "",
                  bfhx: list
                };
                const info = await xkbasys.findSPRZInfo(item.xksbxxid);
                obj.jcry = info.jcry;
                obj.jcsj = info.jcsj;
                await DB.saveBfhx(obj).then((res2) => {
                });
                cloudBfhx.push(obj);
              }
            });
          }
          console.warn(cloudBfhx);
          bfhxList.value = cloudBfhx;
        }).finally(() => {
          loading.value = false;
        });
      }
      vue.onMounted(() => {
        height.value = $(".Inconformity").parent().parent()[0].clientHeight;
      });
      function _export() {
        console.warn("export...");
        if (bfhxList.value.length === 0)
          return;
        const data = [];
        for (const i of bfhxList.value) {
          for (const j of i.bfhx) {
            data.push({
              "企业名称": i.sbr,
              "产品名称": i.cpmc.replace(/[(品种:)\(\)]/g, ""),
              "事项名称": i.sxmc,
              "检查员": i.jcry,
              "检查时间": i.jcsj,
              "缺陷类型": j.bfhxlx,
              "缺陷描述": j.bfhxms,
              "条款号": j.tkh,
              "条款内容": j.tknr,
              "总条款数": i.bfhx.length
            });
          }
        }
        const ws = XLSX__namespace.utils.json_to_sheet(data);
        const wb = XLSX__namespace.utils.book_new();
        XLSX__namespace.utils.book_append_sheet(wb, ws, "不符合项列表");
        XLSX__namespace.writeFile(wb, "不符合项列表.xlsx");
      }
      return (_ctx, _cache) => {
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "Inconformity",
          style: vue.normalizeStyle(`height: ${height.value}px`)
        }, [
          vue.createVNode(_sfc_main$2, {
            ref_key: "searchRef",
            ref: searchRef,
            class: "search",
            onChange: onSearch,
            onExport: _export
          }, null, 512),
          vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            class: "list",
            "element-loading-text": loadingText.value
          }, [
            vue.createVNode(_component_el_table, {
              class: "table",
              data: bfhxList.value,
              border: "",
              size: "small"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_table_column, { type: "expand" }, {
                  default: vue.withCtx((scope) => [
                    vue.createVNode(_component_el_table, {
                      data: scope.row.bfhx,
                      style: { "padding-left": "100px" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_table_column, {
                          prop: "bfhxlx",
                          label: "缺陷类型",
                          width: "100px"
                        }),
                        vue.createVNode(_component_el_table_column, {
                          prop: "bfhxms",
                          label: "描述"
                        }),
                        vue.createVNode(_component_el_table_column, {
                          prop: "tkh",
                          label: "条款号",
                          width: "100px"
                        }),
                        vue.createVNode(_component_el_table_column, {
                          prop: "tknr",
                          label: "条款内容"
                        })
                      ]),
                      _: 2
                    }, 1032, ["data"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_table_column, {
                  prop: "sbr",
                  label: "企业名称"
                }, {
                  default: vue.withCtx((scope) => [
                    vue.createElementVNode("div", _hoisted_2, vue.toDisplayString(scope.row.sbr), 1)
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_table_column, {
                  prop: "sxmc",
                  label: "事项名称"
                }, {
                  default: vue.withCtx((scope) => [
                    vue.createElementVNode("div", _hoisted_3, vue.toDisplayString(scope.row.sxmc), 1)
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_table_column, {
                  prop: "cpmc",
                  label: "产品名称",
                  width: "200"
                }, {
                  default: vue.withCtx((scope) => [
                    vue.createElementVNode("div", _hoisted_4, vue.toDisplayString(scope.row.cpmc.trim() ? scope.row.cpmc.replace(/[(品种:)\(\)]/g, "") : "xxxxxxxx"), 1)
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_table_column, {
                  label: "检查员",
                  width: "180"
                }, {
                  default: vue.withCtx((scope) => [
                    vue.createTextVNode(vue.toDisplayString(scope.row.jcry), 1)
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_table_column, {
                  prop: "slrq",
                  label: "检查时间",
                  width: "125"
                }, {
                  default: vue.withCtx((scope) => [
                    vue.createTextVNode(vue.toDisplayString(scope.row.jcsj), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["data"])
          ], 8, _hoisted_1$1)), [
            [_directive_loading, loading.value]
          ])
        ], 4);
      };
    }
  });
  const Inconformity_vue_vue_type_style_index_0_scoped_4302ac1f_lang = "";
  const Inconformity = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4302ac1f"]]);
  const _hoisted_1 = { class: "tool-standard" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "StandardUpdate",
    setup(__props) {
      function getStandardXLS() {
        return new Promise((resolve, reject) => {
          $$3.ajax({
            type: "get",
            url: "http://app.nifdc.org.cn/biaogzx/qxqwk.do?formAction=excel",
            success(data) {
              resolve(data);
            }
          });
        });
      }
      function check() {
        return new Promise(async (resolve, reject) => {
          let xls = await getStandardXLS();
          console.warn(xls);
          return;
        });
      }
      const loading = vue.ref(false);
      const update = () => {
        loading.value = true;
        check().then(() => {
          loading.value = false;
          ElementPlus.ElMessage.success("更新成功");
        });
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_component_el_button, {
            type: "primary",
            onClick: update
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("更新")
            ]),
            _: 1
          })
        ])), [
          [_directive_loading, loading.value]
        ]);
      };
    }
  });
  const StandardUpdate_vue_vue_type_style_index_0_scoped_3c30e436_lang = "";
  const StandardUpdateVue = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c30e436"]]);
  const gxwtExport = async () => {
    const href = window.location.href;
    console.warn(href);
    const gray = document.querySelector(".gray");
    console.log(gray);
    const totalPage = (gray == null ? void 0 : gray.innerHTML.match(/共(.*?)页/)[1]) || 0;
    console.log(totalPage);
    const data = [];
    for (let i = 0; i < totalPage; i++) {
      const url = `https://www.cmde.org.cn/splt/ltgxwt/index${i == 0 ? "" : "_" + i}.html`;
      console.log(url);
      await getHtml(url).then(async (html) => {
        const list = $(html).find(".list ul li");
        for (let i2 = 0; i2 < list.length; i2++) {
          const ele = list[i2];
          const $a = $($(ele).children()[1]);
          const title = $a.attr("title");
          const url2 = $a.attr("href").replace("../..", "https://www.cmde.org.cn/");
          const date = $(ele).children()[2].innerHTML.replace(/[\(\)]/g, "");
          console.log(title, url2, date);
          await getHtml(url2).then((html2) => {
            const content = html2.match(/"ContentStart"\/>(.*?)<meta name="ContentEnd"/s);
            const str = content[1].replace(/<.*?>/g, "").trim();
            data.push({
              "共性问题": title,
              "器审中心答复": str,
              "答复时间": date
            });
          });
        }
      });
    }
    console.log(data);
    const ws = XLSX__namespace.utils.json_to_sheet(data);
    const wb = {
      SheetNames: ["答疑"],
      Sheets: {
        "答疑": ws
      }
    };
    XLSX__namespace.write(wb, { bookType: "xlsx", bookSST: true, type: "base64" });
    XLSX__namespace.writeFile(wb, "器审中心答疑.xlsx");
  };
  function getHtml(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "get",
        url,
        success(html) {
          resolve(html);
        }
      });
    });
  }
  const { user } = storeToRefs(userStore(pinia));
  const win = unsafeWindow;
  const $$1 = win.$;
  const Frame = win.Frame;
  class Router {
    constructor() {
      __publicField(this, "ctx", {
        url: ""
      });
      __publicField(this, "debug", false);
      __publicField(this, "middleware", []);
      this.ctx.url = window.location.href;
    }
    log(...args) {
      if (this.debug)
        console.warn(...args);
    }
    use(url, cb) {
      this.log("use", url, cb);
      this.middleware.push({ match: url, cb });
      return this;
    }
    async get(urls, cb) {
      this.log("get", urls, cb);
      if (!Array.isArray(urls)) {
        urls = [urls];
      }
      let match = false;
      for (const url of urls) {
        if (this.ctx.url.startsWith(url)) {
          match = true;
          break;
        }
      }
      if (!match)
        return this;
      this.log("middle run ...", this.middleware);
      for (const i of this.middleware) {
        for (const j of urls) {
          if (j.startsWith(i.match)) {
            await new Promise((resolve, reject) => {
              i.cb(this.ctx, resolve);
            });
            break;
          }
        }
      }
      cb(this.ctx);
      return this;
    }
  }
  const router = new Router();
  router.use(baseUrl + "spd/", (ctx, next) => {
    $$1("#cbxx").css("position", "absolute");
    const pluginName = "业务办理+";
    let sideBarAccordion = $$1("#sideBarAccordion").accordion("getPanel", pluginName);
    if (sideBarAccordion !== null)
      return;
    $$1("#sideBarAccordion").accordion("add", {
      title: pluginName,
      content: $$1(`<div id="plugin_sm" class="easyui-tree sidemenu-tree tree"></div>`),
      selected: true
    });
    sideBarAccordion = $$1("#sideBarAccordion").accordion("getPanel", pluginName);
    sideBarAccordion.parent().children()[0].append($$1('<div class="panel-icon icon icon-plus"></div>')[0]);
    const tree = $$1("#plugin_sm").tree();
    ctx.sidemenu = {
      add(title, onClick) {
        let { data, onClick: _onClick } = tree.tree("options");
        if (data === null)
          data = [];
        data.push({
          text: title,
          children: []
        });
        tree.tree({
          data,
          onClick(node) {
            if (node.text === title) {
              onClick(node);
            } else {
              _onClick && _onClick(node);
            }
          }
        });
      }
    };
    function spHelperInit() {
      let helper_entry = $$1(".sphelper");
      if (helper_entry.length)
        return;
      helper_entry = $$1(
        /*html*/
        `
        <div class="sphelper">
        </div>
      `
      );
      $$1(".super-setting-left").append(helper_entry);
      mount(helper_entry, SpHelperVue);
    }
    spHelperInit();
    xkbasys.getUser().then((res) => {
      user.value = ctx.userInfo = {
        userId: res.userId,
        name: res.name,
        deptName: res.deptName,
        deptId: res.deptId
      };
      function version() {
        let version_entry = $$1(".version");
        if (version_entry.length)
          return;
        version_entry = $$1(
          /*html*/
          `
          <div class="void" style="flex-grow: 1;"></div>
          <div class="version" style="height: 50px;">
          </div>
        `
        );
        $$1(".super-setting-left").append(version_entry);
        mount(version_entry, VersionVue);
      }
      function notice() {
        let notice_entry = $$1(".notice_entry");
        if (notice_entry.length)
          return;
        notice_entry = $$1(
          /*html*/
          `
          <div class="notice_entry">
          </div>
        `
        );
        $$1("body").append(notice_entry);
        mount(notice_entry, NoticeVue);
      }
      version();
      notice();
      next();
    });
  }).get([
    baseUrl + "spd/",
    baseUrl + "spd/#"
  ], (ctx) => {
    if (user.value.deptName === "质量管理部") {
      const dispenseCountText = "业务分发+";
      ctx.sidemenu.add(dispenseCountText, () => {
        console.warn(dispenseCountText);
        premount(dispenseCountText, DispenseVue);
      });
      const QualityCheckVueText = "质量审核+";
      ctx.sidemenu.add(QualityCheckVueText, () => {
        console.warn(QualityCheckVueText);
        premount(QualityCheckVueText, QualityCheckVue);
      });
    }
    const myTodoText = "我的待办+", myDoneText = "我的已办+", bjSearchText = "办件查询+";
    ctx.sidemenu.add(myTodoText, () => {
      console.warn(myTodoText);
      premount(myTodoText, MyTodoVue);
    });
    ctx.sidemenu.add(myDoneText, () => {
      console.warn(myDoneText);
      premount(myDoneText, MyDoneVue);
    });
    ctx.sidemenu.add(bjSearchText, () => {
      console.warn(bjSearchText);
      premount(bjSearchText, MySearchVue);
    });
    const zucheSearchText = "注册查询+";
    ctx.sidemenu.add(zucheSearchText, () => {
      console.warn(zucheSearchText);
      premount(zucheSearchText, ZhuceSearchVue);
    });
    const JianchaSearchText = "检查查询+";
    ctx.sidemenu.add(JianchaSearchText, () => {
      console.warn(JianchaSearchText);
      premount(JianchaSearchText, JianchaSearchVue);
    });
    function premount(title, component) {
      Frame.openNewMainTab({ title });
      const tab = $$1("#maintab").tabs("getTab", title);
      tab.find("iframe").remove();
      mount(tab, component);
    }
    if (user.value.deptName === "质量管理部") {
      const qualityCountText = "质量统计+";
      ctx.sidemenu.add(qualityCountText, () => {
        console.warn(qualityCountText);
        premount(qualityCountText, QualityCountVue);
      });
      const qualityAnalysisText = "质量分析+";
      ctx.sidemenu.add(qualityAnalysisText, () => {
        console.warn(qualityAnalysisText);
        premount(qualityAnalysisText, QualityAnalysisVue);
      });
      const inconformityText = "检查不符合分析";
      ctx.sidemenu.add(inconformityText, () => {
        console.warn(inconformityText);
        premount(inconformityText, Inconformity);
      });
    }
    if (user.value.name === "孙森") {
      const standardText = "标准更新+";
      ctx.sidemenu.add(standardText, () => {
        console.warn(standardText);
        premount(standardText, StandardUpdateVue);
      });
    }
  });
  router.get(baseUrl + "fileManager/preview", (ctx) => {
    console.warn("笔记", window.location.href);
    if (document.querySelector("#spnote"))
      return;
    if (window.location.href.indexOf("id=") === -1)
      return;
    mount(document.body, SpNoteVue);
  });
  router.get("https://www.cmde.org.cn/splt/ltgxwt", (ctx) => {
    var _a, _b;
    console.warn("共性问题");
    const exportLi = $$1(`<li class="columnPageTitle" style="cursor: pointer;">导出</li>`);
    (_b = (_a = document.querySelector(".columnPageTitle")) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.appendChild(exportLi[0]);
    exportLi.click(async () => {
      exportLi.html("导出中，请务重复点击...");
      await gxwtExport();
      exportLi.html("导出成功");
      exportLi.unbind();
    });
  });
  function mount(root, component) {
    const app = vue.createApp(component);
    for (const [key, component2] of Object.entries(ElementPlusIconsVue__namespace)) {
      app.component(key, component2);
    }
    app.use(pinia).use(ElementPlus, { locale: ElementPlusLocaleZhCn }).use(Clipboard).mount((() => {
      const div = document.createElement("div");
      root.append(div);
      return div;
    })());
  }
})(Vue, ElementPlus, ElementPlusIconsVue, ElementPlusLocaleZhCn, this["v-clipboard"], $, XLSX, PizZip, PizZipUtils, docxtemplater, saveAs);
