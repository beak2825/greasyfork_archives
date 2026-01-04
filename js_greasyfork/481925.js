// ==UserScript==
// @name         91 Plus
// @namespace    https://github.com/DonkeyBear
// @version      1.9.1
// @author       DonkeyBear
// @description  自由轉調、輕鬆練歌，打造 91 譜的最佳體驗！
// @icon         https://www.91pu.com.tw/icons/favicon-32x32.png
// @match        *://www.91pu.com.tw/m/*
// @match        *://www.91pu.com.tw/song/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/zipson@0.2.12/dist/zipson.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/vexchords@1.2.0/dist/vexchords.dev.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/481925/91%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/481925/91%20Plus.meta.js
// ==/UserScript==

(function (vue, vexchords, zipson, html2canvas) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" .bi[data-v-a9f332df]{color:var(--c22eb872);font-size:var(--v70824f1d);-webkit-text-stroke:var(--v59c28e54) var(--c22eb872);line-height:0}.bi[data-v-a9f332df]:before{transition:text-shadow .2s}.bi[active=true][data-v-a9f332df]:before{text-shadow:0 0 .5rem color-mix(in srgb,var(--theme-color) 50%,white)}.chord-container .chord-name[data-v-128703be]{font-size:.5rem;font-weight:900;color:#666;text-align:center}.chord-container .chord-chart[data-v-128703be]{margin:-.6rem 0 -.25rem}html[data-v-ed81246a]{--toolbar-bg-color: color-mix(in srgb, var(--theme-color) 65%, transparent);--toolbar-border-color: color-mix(in srgb, var(--theme-color) 50%, rgba(255, 255, 255, .1))}.slide-and-fade-enter-active[data-v-ed81246a],.slide-and-fade-leave-active[data-v-ed81246a]{transition:all .2s}.slide-and-fade-enter-from[data-v-ed81246a],.slide-and-fade-leave-to[data-v-ed81246a]{transform:translateY(10%);opacity:0}.plus91-popup[data-v-ed81246a]{position:absolute;left:0;right:0;bottom:100%;background:#fafafa;border:1px solid lightgray;padding:1rem 2rem;border-radius:1rem;margin:.5rem 1rem;max-height:50vh;overflow-y:scroll}.plus91-popup[data-v-ed81246a]::-webkit-scrollbar{display:none}.plus91-popup[data-v-ed81246a]{padding-left:1rem;padding-right:1rem}#plus91-chord-popup .banner[data-v-858a1989]{display:flex;align-items:center;background:color-mix(in srgb,var(--toolbar-bg-color) 25%,transparent);color:color-mix(in srgb,var(--toolbar-bg-color) 50%,black);border-radius:.5rem;padding:.5rem .75rem;margin-bottom:.25rem}#plus91-chord-popup .banner section[data-v-858a1989]{flex-grow:1;margin-left:.5rem}#plus91-chord-popup .chord-popup-container[data-v-858a1989]{display:grid;grid-template-columns:repeat(6,1fr);column-gap:.5rem;padding-top:.4rem}#plus91-chord-popup.banner-only .banner[data-v-858a1989]{margin-bottom:0;background:#f6d26640;color:color-mix(in srgb,#f6d266 50%,black 35%)}#plus91-chord-popup.banner-only .chord-popup-container[data-v-858a1989]{padding-top:0}.toolbar-icon[data-v-cbf0cf0b]{cursor:pointer;padding:.25rem .75rem;display:flex;flex-direction:column;align-items:center;gap:.15rem}.toolbar-icon-text[data-v-cbf0cf0b]{color:color-mix(in srgb,var(--v08ff4922) 70%,var(--toolbar-bg-color));font-size:.5rem;letter-spacing:.15rem;margin-right:-.15rem}.adjust-widget[data-v-0178875e]{display:flex}.adjust-widget .adjust-button[data-v-0178875e]{border:0;border-radius:.25rem;background:transparent}.adjust-widget .adjust-button[data-v-0178875e]:hover{background:#00000006}.adjust-widget .adjust-button[data-v-0178875e]:not(:disabled){cursor:pointer}.adjust-widget .adjust-button[data-v-0178875e]:disabled{opacity:.25}.adjust-widget .adjust-button.adjust-button-middle[data-v-0178875e]{flex-grow:1;color:var(--v5e7bf01c);font-size:calc(var(--v1bd9a428) * .75);font-weight:700}.adjust-widget .adjust-button.adjust-button-left[data-v-0178875e]{padding-right:1rem}.adjust-widget .adjust-button.adjust-button-right[data-v-0178875e]{padding-left:1rem}.hotkey-item[data-v-851f225f]{display:flex;justify-content:space-between;align-items:center;padding:0 .25rem;border-radius:.25rem;height:1.4rem}.hotkey-item[data-v-851f225f]:nth-child(odd){background:#00000006}.desc.title[data-v-851f225f]{font-size:.55rem;color:#999}.hotkeys[data-v-851f225f]{display:flex}.hr[data-v-851f225f]{display:flex;flex-grow:1;border-top:1px solid lightgray;margin-left:.25rem}kbd[data-v-851f225f]{font-size:.6rem;border:solid lightgray;border-width:1px .1rem .15rem;border-radius:.2rem;padding:0 .2rem;letter-spacing:-.025rem;color:#666;margin-left:.15rem}#plus91-hotkey-popup .hotkey-popup-container[data-v-07402c98]{display:flex;color:#444}#plus91-hotkey-popup section[data-v-07402c98]{flex-grow:1;width:50%;margin:-.1rem 0}#plus91-hotkey-popup section.left-part[data-v-07402c98]{border-right:1px solid lightgray;margin-left:-.5rem;padding-right:.5rem}#plus91-hotkey-popup section.right-part[data-v-07402c98]{padding-left:.5rem;margin-right:-.5rem}#plus91-hotkey-popup kbd[data-v-07402c98]{font-size:.65rem;border:solid lightgray;border-width:1px .1rem .15rem;border-radius:.2rem;padding:0 .2rem;letter-spacing:-.025rem;color:#666}.icon-button[data-v-cb0cf859]{display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:0 .6rem .4rem;border-radius:.25rem}.icon-button[data-v-cb0cf859]:hover{background:#00000006}.icon-button .button-text[data-v-cb0cf859]{font-size:.5rem;color:var(--v12c3e3a5)}#plus91-menu-popup .menu-popup-container[data-v-f8df8357]{display:flex;justify-content:space-around}.color-switcher-container[data-v-9499f72a]{display:flex}.color-switcher-container .color-switcher-option[data-v-9499f72a]{display:flex;align-items:center;justify-content:center;width:1.25em;height:1em;cursor:pointer;border-style:solid;border-width:0;border-top-width:1px;border-bottom-width:1px}.color-switcher-container .color-switcher-option[data-v-9499f72a]:first-child{border-radius:50rem 0 0 50rem;border-left-width:1px;width:1.3em}.color-switcher-container .color-switcher-option[data-v-9499f72a]:last-child{border-radius:0 50rem 50rem 0;border-right-width:1px;width:1.3em}.toggle-switch[data-v-1cf8e431]{display:inline-flex;cursor:pointer}.switch-track[data-v-1cf8e431]{position:relative;width:2.25em;height:1.25em;background:#ccc;border-radius:50rem;transition:background .3s}.switch-track.active[data-v-1cf8e431]{background:#1e90ff}.switch-track.active .switch-thumb[data-v-1cf8e431]{transform:translate(100%)}.switch-thumb[data-v-1cf8e431]{position:absolute;top:.125em;left:.125em;width:1em;height:1em;background:#fff;border-radius:50%;transition:transform .3s}#plus91-settings-popup .bi[data-v-3259211c]{color:#a9a9a9;margin-right:.25em;font-size:1em}#plus91-settings-popup .setting-item[data-v-3259211c]{display:flex;align-items:center;justify-content:space-between;padding:.5rem 1rem;border-radius:.5rem;color:#000c;cursor:pointer}#plus91-settings-popup .setting-item[data-v-3259211c]:hover{background:#0000000d}#plus91-sheet-popup .transpose-range-container[data-v-18539399]{margin-top:1rem}#plus91-sheet-popup .transpose-range-container input[type=range][data-v-18539399]{width:100%}#plus91-sheet-popup .instrument-select-container[data-v-18539399]{display:flex;border:1px solid lightgray;border-radius:.25rem;margin-top:1rem;background:#fff}#plus91-sheet-popup .instrument-select-container .instrument-select-button[data-v-18539399]{width:33.3333333333%;border:0;border-right:1px solid lightgray;background:transparent;color:#666;padding:.5rem;font-size:.65rem;font-weight:700;cursor:pointer!important}#plus91-sheet-popup .instrument-select-container .instrument-select-button[data-v-18539399]:last-child{border:0;border-radius:0 .25rem .25rem 0}#plus91-sheet-popup .instrument-select-container .instrument-select-button[data-v-18539399]:first-child{border-radius:.25rem 0 0 .25rem}#plus91-sheet-popup .instrument-select-container .instrument-select-button[data-v-18539399]:hover{background:#f5f5f5}html[data-v-c2303173]{--toolbar-bg-color: color-mix(in srgb, var(--theme-color) 65%, transparent);--toolbar-border-color: color-mix(in srgb, var(--theme-color) 50%, rgba(255, 255, 255, .1))}.slide-enter-active[data-v-c2303173],.slide-leave-active[data-v-c2303173]{transition:transform .2s}.slide-enter-from[data-v-c2303173],.slide-leave-to[data-v-c2303173]{transform:translateY(100%)}#plus91-footer[data-v-c2303173]{z-index:1000;display:flex;justify-content:center;position:fixed;left:0;right:0;bottom:0}.footer-container[data-v-c2303173]{width:min(100vw,768px);background-color:var(--toolbar-bg-color);background-image:linear-gradient(transparent,color-mix(in srgb,var(--toolbar-bg-color) 99%,white) 250%);background-blend-mode:multiply;transition:background-color .3s ease,border-color .3s ease;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);padding:.25rem .75rem;display:flex;justify-content:space-between;align-items:center}@media (min-width: 768px){.footer-container[data-v-c2303173]{border-radius:1rem 1rem 0 0}}.footer-container[data-v-c2303173]{padding-bottom:.75rem;border-top:1px solid var(--toolbar-border-color)}html[data-v-c3427f68]{--toolbar-bg-color: color-mix(in srgb, var(--theme-color) 65%, transparent);--toolbar-border-color: color-mix(in srgb, var(--theme-color) 50%, rgba(255, 255, 255, .1))}.slide-enter-active[data-v-c3427f68],.slide-leave-active[data-v-c3427f68]{transition:transform .2s}.slide-enter-from[data-v-c3427f68],.slide-leave-to[data-v-c3427f68]{transform:translateY(-100%)}#plus91-header[data-v-c3427f68]{z-index:1000;display:flex;justify-content:center;position:fixed;left:0;right:0;top:0}.header-container[data-v-c3427f68]{width:min(100vw,768px);background-color:var(--toolbar-bg-color);background-image:linear-gradient(transparent,color-mix(in srgb,var(--toolbar-bg-color) 99%,white) 250%);background-blend-mode:multiply;transition:background-color .3s ease,border-color .3s ease;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);padding:.25rem .75rem;display:flex;justify-content:space-between;align-items:center}@media (min-width: 768px){.header-container[data-v-c3427f68]{border-radius:0 0 1rem 1rem}}.header-container[data-v-c3427f68]{border-bottom:1px solid var(--toolbar-border-color)}.header-container form[data-v-c3427f68],.header-container .search-container[data-v-c3427f68]{display:flex;flex:1;height:100%}.header-container .search-container[data-v-c3427f68]{position:relative}.header-container .search-container .clear-input[data-v-c3427f68]{position:absolute;right:0;top:50%;transform:translateY(-50%)}.header-container input[data-v-c3427f68]{flex:1;border-radius:50rem;border:0;font-size:.8rem;font-weight:700;padding-left:1.25rem;padding-right:1.25rem;background:#fffa;color:#0009;opacity:.5;transition:all .2s}.header-container input[data-v-c3427f68]:focus-visible{outline:0;opacity:1}html[data-v-111379c3]{--toolbar-bg-color: color-mix(in srgb, var(--theme-color) 65%, transparent);--toolbar-border-color: color-mix(in srgb, var(--theme-color) 50%, rgba(255, 255, 255, .1))}.fade-enter-active[data-v-111379c3],.fade-leave-active[data-v-111379c3]{transition:opacity .2s}.fade-enter-from[data-v-111379c3],.fade-leave-to[data-v-111379c3]{opacity:0}#dark-mode-overlay[data-v-111379c3]{position:fixed;inset:0;z-index:800;-webkit-backdrop-filter:invert(1) hue-rotate(145deg) saturate(.75);backdrop-filter:invert(1) hue-rotate(145deg) saturate(.75);pointer-events:none} ");

  /*!
   * pinia v3.0.3
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = (
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
        pinia2._a = app;
        app.provide(piniaSymbol, pinia2);
        app.config.globalProperties.$pinia = pinia2;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      },
      use(plugin) {
        if (!this._a) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,

_a: null,
      _e: scope,
      _s: new Map(),
      state
    });
    return pinia2;
  }
  const noop$1 = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
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
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
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
Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
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
        pinia2.state.value[id] = state ? state() : {};
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
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      pinia2.state.value[$id] = {};
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
noop$1
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    const action = (fn, name = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name;
        return fn;
      }
      const wrappedAction = function() {
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
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
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
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia2,
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
    const setupStore = runWithContext(() => pinia2._e.run(() => (scope = vue.effectScope()).run(() => setup({ action }))));
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
          pinia2.state.value[$id][key] = prop;
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        setupStore[key] = actionValue;
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    assign(store, setupStore);
    assign(vue.toRaw(store), setupStore);
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

function defineStore(id, setup, setupOptions) {
    let options;
    const isSetupStore = typeof setup === "function";
    options = isSetupStore ? setupOptions : setup;
    function useStore2(pinia2, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia2 =

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
    useStore2.$id = id;
    return useStore2;
  }
  const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
  const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
  function jsonParseTransform(key, value) {
    if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
      warnKeyDropped(key);
      return;
    }
    return value;
  }
  function warnKeyDropped(key) {
    console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
  }
  function destr(value, options = {}) {
    if (typeof value !== "string") {
      return value;
    }
    if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
      return value.slice(1, -1);
    }
    const _value = value.trim();
    if (_value.length <= 9) {
      switch (_value.toLowerCase()) {
        case "true": {
          return true;
        }
        case "false": {
          return false;
        }
        case "undefined": {
          return void 0;
        }
        case "null": {
          return null;
        }
        case "nan": {
          return Number.NaN;
        }
        case "infinity": {
          return Number.POSITIVE_INFINITY;
        }
        case "-infinity": {
          return Number.NEGATIVE_INFINITY;
        }
      }
    }
    if (!JsonSigRx.test(value)) {
      if (options.strict) {
        throw new SyntaxError("[destr] Invalid JSON");
      }
      return value;
    }
    try {
      if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
        if (options.strict) {
          throw new Error("[destr] Possible prototype pollution");
        }
        return JSON.parse(value, jsonParseTransform);
      }
      return JSON.parse(value);
    } catch (error) {
      if (options.strict) {
        throw error;
      }
      return value;
    }
  }
  function get(obj, path) {
    if (obj == null)
      return void 0;
    let value = obj;
    for (let i = 0; i < path.length; i++) {
      if (value == null || value[path[i]] == null)
        return void 0;
      value = value[path[i]];
    }
    return value;
  }
  function set(obj, value, path) {
    if (path.length === 0)
      return value;
    const idx = path[0];
    if (path.length > 1) {
      value = set(
        typeof obj !== "object" || obj === null || !Object.prototype.hasOwnProperty.call(obj, idx) ? Number.isInteger(Number(path[1])) ? [] : {} : obj[idx],
        value,
        Array.prototype.slice.call(path, 1)
      );
    }
    if (Number.isInteger(Number(idx)) && Array.isArray(obj))
      return obj.slice()[idx];
    return Object.assign({}, obj, { [idx]: value });
  }
  function unset(obj, path) {
    if (obj == null || path.length === 0)
      return obj;
    if (path.length === 1) {
      if (obj == null)
        return obj;
      if (Number.isInteger(path[0]) && Array.isArray(obj))
        return Array.prototype.slice.call(obj, 0).splice(path[0], 1);
      const result = {};
      for (const p in obj)
        result[p] = obj[p];
      delete result[path[0]];
      return result;
    }
    if (obj[path[0]] == null) {
      if (Number.isInteger(path[0]) && Array.isArray(obj))
        return Array.prototype.concat.call([], obj);
      const result = {};
      for (const p in obj)
        result[p] = obj[p];
      return result;
    }
    return set(
      obj,
      unset(
        obj[path[0]],
        Array.prototype.slice.call(path, 1)
      ),
      [path[0]]
    );
  }
  function deepPickUnsafe(obj, paths) {
    return paths.map((p) => p.split(".")).map((p) => [p, get(obj, p)]).filter((t) => t[1] !== void 0).reduce((acc, cur) => set(acc, cur[1], cur[0]), {});
  }
  function deepOmitUnsafe(obj, paths) {
    return paths.map((p) => p.split(".")).reduce((acc, cur) => unset(acc, cur), obj);
  }
  function hydrateStore(store, {
    storage,
    serializer,
    key,
    debug,
    pick,
    omit,
    beforeHydrate,
    afterHydrate
  }, context, runHooks = true) {
    try {
      if (runHooks)
        beforeHydrate?.(context);
      const fromStorage = storage.getItem(key);
      if (fromStorage) {
        const deserialized = serializer.deserialize(fromStorage);
        const picked = pick ? deepPickUnsafe(deserialized, pick) : deserialized;
        const omitted = omit ? deepOmitUnsafe(picked, omit) : picked;
        store.$patch(omitted);
      }
      if (runHooks)
        afterHydrate?.(context);
    } catch (error) {
      if (debug)
        console.error("[pinia-plugin-persistedstate]", error);
    }
  }
  function persistState(state, {
    storage,
    serializer,
    key,
    debug,
    pick,
    omit
  }) {
    try {
      const picked = pick ? deepPickUnsafe(state, pick) : state;
      const omitted = omit ? deepOmitUnsafe(picked, omit) : picked;
      const toStorage = serializer.serialize(omitted);
      storage.setItem(key, toStorage);
    } catch (error) {
      if (debug)
        console.error("[pinia-plugin-persistedstate]", error);
    }
  }
  function createPersistence(context, optionsParser, auto) {
    const { pinia: pinia2, store, options: { persist = auto } } = context;
    if (!persist)
      return;
    if (!(store.$id in pinia2.state.value)) {
      const originalStore = pinia2._s.get(store.$id.replace("__hot:", ""));
      if (originalStore)
        void Promise.resolve().then(() => originalStore.$persist());
      return;
    }
    const persistenceOptions = Array.isArray(persist) ? persist : persist === true ? [{}] : [persist];
    const persistences = persistenceOptions.map(optionsParser);
    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach((p) => {
        hydrateStore(store, p, context, runHooks);
      });
    };
    store.$persist = () => {
      persistences.forEach((p) => {
        persistState(store.$state, p);
      });
    };
    persistences.forEach((p) => {
      hydrateStore(store, p, context);
      store.$subscribe(
        (_mutation, state) => persistState(state, p),
        { detached: true }
      );
    });
  }
  function createPersistedState(options = {}) {
    return function(context) {
      createPersistence(
        context,
        (p) => ({
          key: (options.key ? options.key : (x) => x)(p.key ?? context.store.$id),
          debug: p.debug ?? options.debug ?? false,
          serializer: p.serializer ?? options.serializer ?? {
            serialize: (data) => JSON.stringify(data),
            deserialize: (data) => destr(data)
          },
          storage: p.storage ?? options.storage ?? window.localStorage,
          beforeHydrate: p.beforeHydrate,
          afterHydrate: p.afterHydrate,
          pick: p.pick,
          omit: p.omit
        }),
        options.auto ?? false
      );
    };
  }
  var index_default = createPersistedState();
  function computedWithControl(source, fn, options = {}) {
    let v = void 0;
    let track;
    let trigger;
    let dirty = true;
    const update = () => {
      dirty = true;
      trigger();
    };
    vue.watch(source, update, {
      flush: "sync",
      ...options
    });
    const get$1 = typeof fn === "function" ? fn : fn.get;
    const set$1 = typeof fn === "function" ? void 0 : fn.set;
    const result = vue.customRef((_track, _trigger) => {
      track = _track;
      trigger = _trigger;
      return {
        get() {
          if (dirty) {
            v = get$1(v);
            dirty = false;
          }
          track();
          return v;
        },
        set(v$1) {
          set$1 === null || set$1 === void 0 || set$1(v$1);
        }
      };
    });
    result.trigger = update;
    return result;
  }
  function tryOnScopeDispose(fn, failSilently) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn, failSilently);
      return true;
    }
    return false;
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const notNullish = (val) => val != null;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function toArray(value) {
    return Array.isArray(value) ? value : [value];
  }
  function getLifeCycleTarget(target) {
    return vue.getCurrentInstance();
  }
  function tryOnMounted(fn, sync = true, target) {
    if (getLifeCycleTarget()) vue.onMounted(fn, target);
    else if (sync) fn();
    else vue.nextTick(fn);
  }
  function tryOnUnmounted(fn, target) {
    if (getLifeCycleTarget()) vue.onUnmounted(fn, target);
  }
  function watchImmediate(source, cb, options) {
    return vue.watch(source, cb, {
      ...options,
      immediate: true
    });
  }
  const defaultWindow = isClient ? window : void 0;
  const defaultDocument = isClient ? window.document : void 0;
  function unrefElement(elRef) {
    var _$el;
    const plain = vue.toValue(elRef);
    return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
  }
  function useEventListener(...args) {
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options) => {
      el.addEventListener(event, listener, options);
      return () => el.removeEventListener(event, listener, options);
    };
    const firstParamTargets = vue.computed(() => {
      const test = toArray(vue.toValue(args[0])).filter((e) => e != null);
      return test.every((e) => typeof e !== "string") ? test : void 0;
    });
    const stopWatch = watchImmediate(() => {
      var _firstParamTargets$va, _firstParamTargets$va2;
      return [
        (_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
        toArray(vue.toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray(vue.unref(firstParamTargets.value ? args[2] : args[1])),
        vue.toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    }, ([raw_targets, raw_events, raw_listeners, raw_options]) => {
      cleanup();
      if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
      const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
      cleanups.push(...raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone)))));
    }, { flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(cleanup);
    return stop;
  }
  function onClickOutside(target, handler, options = {}) {
    const { window: window$1 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
    if (!window$1) return controls ? {
      stop: noop,
      cancel: noop,
      trigger: noop
    } : noop;
    let shouldListen = true;
    const shouldIgnore = (event) => {
      return vue.toValue(ignore).some((target$1) => {
        if (typeof target$1 === "string") return Array.from(window$1.document.querySelectorAll(target$1)).some((el) => el === event.target || event.composedPath().includes(el));
        else {
          const el = unrefElement(target$1);
          return el && (event.target === el || event.composedPath().includes(el));
        }
      });
    };
    function hasMultipleRoots(target$1) {
      const vm = vue.toValue(target$1);
      return vm && vm.$.subTree.shapeFlag === 16;
    }
    function checkMultipleRoots(target$1, event) {
      const vm = vue.toValue(target$1);
      const children = vm.$.subTree && vm.$.subTree.children;
      if (children == null || !Array.isArray(children)) return false;
      return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
    }
    const listener = (event) => {
      const el = unrefElement(target);
      if (event.target == null) return;
      if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event)) return;
      if (!el || el === event.target || event.composedPath().includes(el)) return;
      if ("detail" in event && event.detail === 0) shouldListen = !shouldIgnore(event);
      if (!shouldListen) {
        shouldListen = true;
        return;
      }
      handler(event);
    };
    let isProcessingClick = false;
    const cleanup = [
      useEventListener(window$1, "click", (event) => {
        if (!isProcessingClick) {
          isProcessingClick = true;
          setTimeout(() => {
            isProcessingClick = false;
          }, 0);
          listener(event);
        }
      }, {
        passive: true,
        capture
      }),
      useEventListener(window$1, "pointerdown", (e) => {
        const el = unrefElement(target);
        shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
      }, { passive: true }),
      detectIframe && useEventListener(window$1, "blur", (event) => {
        setTimeout(() => {
          var _window$document$acti;
          const el = unrefElement(target);
          if (((_window$document$acti = window$1.document.activeElement) === null || _window$document$acti === void 0 ? void 0 : _window$document$acti.tagName) === "IFRAME" && !(el === null || el === void 0 ? void 0 : el.contains(window$1.document.activeElement))) handler(event);
        }, 0);
      }, { passive: true })
    ].filter(Boolean);
    const stop = () => cleanup.forEach((fn) => fn());
    if (controls) return {
      stop,
      cancel: () => {
        shouldListen = false;
      },
      trigger: (event) => {
        shouldListen = true;
        listener(event);
        shouldListen = false;
      }
    };
    return stop;
  }
function useMounted() {
    const isMounted = vue.shallowRef(false);
    const instance = vue.getCurrentInstance();
    if (instance) vue.onMounted(() => {
      isMounted.value = true;
    }, instance);
    return isMounted;
  }
function useSupported(callback) {
    const isMounted = useMounted();
    return vue.computed(() => {
      isMounted.value;
      return Boolean(callback());
    });
  }
  function useMutationObserver(target, callback, options = {}) {
    const { window: window$1 = defaultWindow, ...mutationOptions } = options;
    let observer;
    const isSupported = useSupported(() => window$1 && "MutationObserver" in window$1);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(vue.computed(() => {
      const items = toArray(vue.toValue(target)).map(unrefElement).filter(notNullish);
      return new Set(items);
    }), (newTargets) => {
      cleanup();
      if (isSupported.value && newTargets.size) {
        observer = new MutationObserver(callback);
        newTargets.forEach((el) => observer.observe(el, mutationOptions));
      }
    }, {
      immediate: true,
      flush: "post"
    });
    const takeRecords = () => {
      return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
    };
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop,
      takeRecords
    };
  }
  function onElementRemoval(target, callback, options = {}) {
    const { window: window$1 = defaultWindow, document: document$1 = window$1 === null || window$1 === void 0 ? void 0 : window$1.document, flush = "sync" } = options;
    if (!window$1 || !document$1) return noop;
    let stopFn;
    const cleanupAndUpdate = (fn) => {
      stopFn === null || stopFn === void 0 || stopFn();
      stopFn = fn;
    };
    const stopWatch = vue.watchEffect(() => {
      const el = unrefElement(target);
      if (el) {
        const { stop } = useMutationObserver(document$1, (mutationsList) => {
          if (mutationsList.map((mutation) => [...mutation.removedNodes]).flat().some((node) => node === el || node.contains(el))) callback(mutationsList);
        }, {
          window: window$1,
          childList: true,
          subtree: true
        });
        cleanupAndUpdate(stop);
      }
    }, { flush });
    const stopHandle = () => {
      stopWatch();
      cleanupAndUpdate();
    };
    tryOnScopeDispose(stopHandle);
    return stopHandle;
  }
  function createKeyPredicate(keyFilter) {
    if (typeof keyFilter === "function") return keyFilter;
    else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
    else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
    return () => true;
  }
  function onKeyStroke(...args) {
    let key;
    let handler;
    let options = {};
    if (args.length === 3) {
      key = args[0];
      handler = args[1];
      options = args[2];
    } else if (args.length === 2) if (typeof args[1] === "object") {
      key = true;
      handler = args[0];
      options = args[1];
    } else {
      key = args[0];
      handler = args[1];
    }
    else {
      key = true;
      handler = args[0];
    }
    const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
    const predicate = createKeyPredicate(key);
    const listener = (e) => {
      if (e.repeat && vue.toValue(dedupe)) return;
      if (predicate(e)) handler(e);
    };
    return useEventListener(target, eventName, listener, passive);
  }
function useActiveElement(options = {}) {
    var _options$document;
    const { window: window$1 = defaultWindow, deep = true, triggerOnRemoval = false } = options;
    const document$1 = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : window$1 === null || window$1 === void 0 ? void 0 : window$1.document;
    const getDeepActiveElement = () => {
      let element = document$1 === null || document$1 === void 0 ? void 0 : document$1.activeElement;
      if (deep) {
        var _element$shadowRoot;
        while (element === null || element === void 0 ? void 0 : element.shadowRoot) element = element === null || element === void 0 || (_element$shadowRoot = element.shadowRoot) === null || _element$shadowRoot === void 0 ? void 0 : _element$shadowRoot.activeElement;
      }
      return element;
    };
    const activeElement = vue.shallowRef();
    const trigger = () => {
      activeElement.value = getDeepActiveElement();
    };
    if (window$1) {
      const listenerOptions = {
        capture: true,
        passive: true
      };
      useEventListener(window$1, "blur", (event) => {
        if (event.relatedTarget !== null) return;
        trigger();
      }, listenerOptions);
      useEventListener(window$1, "focus", trigger, listenerOptions);
    }
    if (triggerOnRemoval) onElementRemoval(activeElement, trigger, { document: document$1 });
    trigger();
    return activeElement;
  }
  function useCssVar(prop, target, options = {}) {
    const { window: window$1 = defaultWindow, initialValue, observe = false } = options;
    const variable = vue.shallowRef(initialValue);
    const elRef = vue.computed(() => {
      var _window$document;
      return unrefElement(target) || (window$1 === null || window$1 === void 0 || (_window$document = window$1.document) === null || _window$document === void 0 ? void 0 : _window$document.documentElement);
    });
    function updateCssVar() {
      const key = vue.toValue(prop);
      const el = vue.toValue(elRef);
      if (el && window$1 && key) {
        var _window$getComputedSt;
        variable.value = ((_window$getComputedSt = window$1.getComputedStyle(el).getPropertyValue(key)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.trim()) || variable.value || initialValue;
      }
    }
    if (observe) useMutationObserver(elRef, updateCssVar, {
      attributeFilter: ["style", "class"],
      window: window$1
    });
    vue.watch([elRef, () => vue.toValue(prop)], (_, old) => {
      if (old[0] && old[1]) old[0].style.removeProperty(old[1]);
      updateCssVar();
    }, { immediate: true });
    vue.watch([variable, elRef], ([val, el]) => {
      const raw_prop = vue.toValue(prop);
      if ((el === null || el === void 0 ? void 0 : el.style) && raw_prop) if (val == null) el.style.removeProperty(raw_prop);
      else el.style.setProperty(raw_prop, val);
    }, { immediate: true });
    return variable;
  }
  function useCurrentElement(rootComponent) {
    const vm = vue.getCurrentInstance();
    const currentElement = computedWithControl(() => null, () => vm.proxy.$el);
    vue.onUpdated(currentElement.trigger);
    vue.onMounted(currentElement.trigger);
    return currentElement;
  }
  function useParentElement(element = useCurrentElement()) {
    const parentElement = vue.shallowRef();
    const update = () => {
      const el = unrefElement(element);
      if (el) parentElement.value = el.parentElement;
    };
    tryOnMounted(update);
    vue.watch(() => vue.toValue(element), update);
    return parentElement;
  }
  function useScriptTag(src, onLoaded = noop, options = {}) {
    const { immediate = true, manual = false, type = "text/javascript", async = true, crossOrigin, referrerPolicy, noModule, defer, document: document$1 = defaultDocument, attrs = {}, nonce = void 0 } = options;
    const scriptTag = vue.shallowRef(null);
    let _promise = null;
    const loadScript = (waitForScriptLoad) => new Promise((resolve, reject) => {
      const resolveWithElement = (el$1) => {
        scriptTag.value = el$1;
        resolve(el$1);
        return el$1;
      };
      if (!document$1) {
        resolve(false);
        return;
      }
      let shouldAppend = false;
      let el = document$1.querySelector(`script[src="${vue.toValue(src)}"]`);
      if (!el) {
        el = document$1.createElement("script");
        el.type = type;
        el.async = async;
        el.src = vue.toValue(src);
        if (defer) el.defer = defer;
        if (crossOrigin) el.crossOrigin = crossOrigin;
        if (noModule) el.noModule = noModule;
        if (referrerPolicy) el.referrerPolicy = referrerPolicy;
        if (nonce) el.nonce = nonce;
        Object.entries(attrs).forEach(([name, value]) => el === null || el === void 0 ? void 0 : el.setAttribute(name, value));
        shouldAppend = true;
      } else if (el.hasAttribute("data-loaded")) resolveWithElement(el);
      const listenerOptions = { passive: true };
      useEventListener(el, "error", (event) => reject(event), listenerOptions);
      useEventListener(el, "abort", (event) => reject(event), listenerOptions);
      useEventListener(el, "load", () => {
        el.setAttribute("data-loaded", "true");
        onLoaded(el);
        resolveWithElement(el);
      }, listenerOptions);
      if (shouldAppend) el = document$1.head.appendChild(el);
      if (!waitForScriptLoad) resolveWithElement(el);
    });
    const load = (waitForScriptLoad = true) => {
      if (!_promise) _promise = loadScript(waitForScriptLoad);
      return _promise;
    };
    const unload = () => {
      if (!document$1) return;
      _promise = null;
      if (scriptTag.value) scriptTag.value = null;
      const el = document$1.querySelector(`script[src="${vue.toValue(src)}"]`);
      if (el) document$1.head.removeChild(el);
    };
    if (immediate && !manual) tryOnMounted(load);
    if (!manual) tryOnUnmounted(unload);
    return {
      scriptTag,
      load,
      unload
    };
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$i = ["active"];
  const _sfc_main$j = {
    __name: "BootstrapIcon",
    props: {
      icon: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: "whitesmoke"
      },
      size: {
        type: String,
        default: "1rem"
      },
      stroke: {
        type: String,
        default: "0"
      },
      active: {
        type: Boolean,
        default: false
      }
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "c22eb872": __props.color,
        "v70824f1d": __props.size,
        "v59c28e54": __props.stroke
      }));
      const props = __props;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("i", {
          class: vue.normalizeClass(`bi bi-${props.icon}`),
          active: props.active
        }, null, 10, _hoisted_1$i);
      };
    }
  };
  const BootstrapIcon = _export_sfc(_sfc_main$j, [["__scopeId", "data-v-a9f332df"]]);
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  class ChordSheetDocument {
    constructor() {
      this.el = {
        mtitle: document.getElementById("mtitle"),
        tkinfo: document.querySelector(".tkinfo"),
        capoSelect: document.querySelector(".capo .select"),
        tinfo: document.querySelector(".tinfo"),
        tone_z: document.getElementById("tone_z")
      };
    }
    getId() {
      const urlParams = new URLSearchParams(window.location.search);
      return Number(urlParams.get("id"));
    }
    getTitle() {
      return this.el.mtitle.textContent.trim();
    }
    getKey() {
      const match = this.el.tkinfo?.textContent.match(new RegExp("(?<=原調：)\\w*"));
      return match ? match[0].trim() : "";
    }
    getPlay() {
      const match = this.el.capoSelect?.textContent.split(/\s*\/\s*/);
      return match ? match[1].trim() : "";
    }
    getCapo() {
      const match = this.el.capoSelect?.textContent.split(/\s*\/\s*/);
      return match ? Number(match[0]) : 0;
    }
    getSinger() {
      const match = this.el.tinfo?.textContent.match(new RegExp("(?<=演唱：).*(?=\\n|$)"));
      return match ? match[0].trim() : "";
    }
    getComposer() {
      const match = this.el.tinfo?.textContent.match(new RegExp("(?<=曲：).*?(?=詞：|$)"));
      return match ? match[0].trim() : "";
    }
    getLyricist() {
      const match = this.el.tinfo?.textContent.match(new RegExp("(?<=詞：).*?(?=曲：|$)"));
      return match ? match[0].trim() : "";
    }
    getBpm() {
      const match = this.el.tkinfo?.textContent.match(/\d+/);
      return match ? Number(match[0]) : 0;
    }
    getSheetText() {
      const formattedChordSheet = this.el.tone_z.textContent.replaceAll(/\s+?\n/g, "\n").replaceAll("\n\n", "\n").trim().replaceAll(/\s+/g, (match) => {
        return `{%${match.length}%}`;
      });
      return formattedChordSheet;
    }
  }
  class Chord {
    static sharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    static flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
constructor(chordString) {
      this.chordString = chordString;
    }
transpose(delta) {
      this.chordString = this.chordString.replaceAll(/[A-G][#b]?/g, (note) => {
        const isSharp = Chord.sharps.includes(note);
        const scale = isSharp ? Chord.sharps : Chord.flats;
        const noteIndex = scale.indexOf(note);
        const transposedIndex = (noteIndex + delta + 12) % 12;
        const transposedNote = scale[transposedIndex];
        return transposedNote;
      });
      return this;
    }
switchModifier() {
      this.chordString = this.chordString.replaceAll(/[A-G][#b]/g, (note) => {
        const scale = note.includes("#") ? Chord.sharps : Chord.flats;
        const newScale = note.includes("#") ? Chord.flats : Chord.sharps;
        const noteIndex = scale.indexOf(note);
        return newScale[noteIndex];
      });
      return this;
    }
useSharpModifier() {
      this.chordString = this.chordString.replaceAll(/[A-G]b/g, (note) => {
        const noteIndex = Chord.flats.indexOf(note);
        return Chord.sharps[noteIndex];
      });
      return this;
    }
useFlatModifier() {
      this.chordString = this.chordString.replaceAll(/[A-G]#/g, (note) => {
        const noteIndex = Chord.sharps.indexOf(note);
        return Chord.flats[noteIndex];
      });
      return this;
    }
toString() {
      return this.chordString;
    }
toFormattedString() {
      return this.chordString.replaceAll(
        /[#b]/g,
`<sup>$&</sup>`
      );
    }
  }
  class ChordSheetElement {
constructor(chordSheetElement) {
      this.chordSheetElement = chordSheetElement;
    }
static transposeSheet(delta) {
      $("#tone_z .tf").each(function() {
        const chord = new Chord($(this).text());
        const newChordHTML = chord.transpose(-delta).toFormattedString();
        $(this).html(newChordHTML);
      });
    }
formatUnderlines() {
      const underlineEl = this.chordSheetElement.querySelectorAll("u");
      const doubleUnderlineEl = this.chordSheetElement.querySelectorAll("abbr");
      underlineEl.forEach((el) => {
        el.textContent = `{_${el.textContent}_}`;
      });
      doubleUnderlineEl.forEach((el) => {
        el.textContent = `{=${el.textContent}=}`;
      });
      return this;
    }
#unformat(nodeList) {
      nodeList.forEach((el) => {
        el.innerHTML = el.textContent.replaceAll(/\{_|\{=|=\}|_\}/g, "").replaceAll(
          /[a-z0-9#/]+/gi,
`<span class="tf">$&</span>`
        );
      });
    }
unformatUnderlines() {
      const underlineEl = this.chordSheetElement.querySelectorAll("u");
      const doubleUnderlineEl = this.chordSheetElement.querySelectorAll("abbr");
      this.#unformat(underlineEl);
      this.#unformat(doubleUnderlineEl);
      return this;
    }
  }
  function redirect() {
    const currentUrl = window.location.href;
    if (/\/song\//.test(currentUrl)) {
      const sheetId = currentUrl.match(new RegExp("(?<=\\/)\\d+(?=\\.)"))[0];
      const newUrl = `https://www.91pu.com.tw/m/tone.shtml?id=${sheetId}`;
      window.location.replace(newUrl);
    }
  }
  function getQueryParams() {
    const url = new URL(window.location.href);
    const params = {
      transpose: +url.searchParams.get("transpose"),
      darkMode: !!url.searchParams.get("darkmode")
    };
    return params;
  }
  function changeTitle() {
    const newTitle = $("#mtitle").text().trim();
    document.title = `${newTitle} | 91+`;
  }
  function archiveChordSheet() {
    const sheet = document.getElementById("tone_z");
    const chordSheetDocument = new ChordSheetDocument();
    try {
      const chordSheetElement = new ChordSheetElement(sheet);
      chordSheetElement.formatUnderlines();
      const formBody = {
        id: chordSheetDocument.getId(),
        title: chordSheetDocument.getTitle(),
        key: chordSheetDocument.getKey(),
        play: chordSheetDocument.getPlay(),
        capo: chordSheetDocument.getCapo(),
        singer: chordSheetDocument.getSinger(),
        composer: chordSheetDocument.getComposer(),
        lyricist: chordSheetDocument.getLyricist(),
        bpm: chordSheetDocument.getBpm(),
        sheet_text: chordSheetDocument.getSheetText()
      };
      chordSheetElement.unformatUnderlines();
      fetch("https://91-plus-plus-api.fly.dev/archive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formBody)
      }).then((response) => {
        console.log("[91 Plus] 雲端樂譜備份成功：", response);
      }).catch((error) => {
        console.error("[91 Plus] 雲端樂譜備份失敗：", error);
      });
    } catch {
      console.warn("[91 Plus] 樂譜解析失敗，無法備份");
      fetch(
        `https://91-plus-plus-api.fly.dev/report?id=${chordSheetDocument.getId()}`
      );
    }
  }
  function onSheetDomReady(callback) {
    return new MutationObserver((_records, observer) => {
      const isMutationDone = !!document.querySelector("#tone_z").childElementCount;
      if (isMutationDone) {
        observer.disconnect();
        callback();
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  function switchInstrument(instrument) {
    switch (instrument) {
      case "guitar": {
        $(".schord").trigger("click");
        break;
      }
      case "ukulele": {
        $(".ukschord").trigger("click");
        break;
      }
      default: {
        $(".nsChord").trigger("click");
        break;
      }
    }
  }
  function getChordShapes() {
    const thisWindow = _unsafeWindow ?? window;
    const chordShapes = thisWindow?.chord_shapes ?? {};
    return chordShapes;
  }
  function getChordList() {
    const chordList = [];
    $("#tone_z .tf").each(function() {
      const chordName = $(this).text().trim();
      if (chordName) {
        chordList.push(chordName);
      }
    });
    return [...new Set(chordList)];
  }
  function convertChordName(chordName) {
    const root = chordName.match(/^[A-G]#?/)[0];
    const rest = chordName.replace(/^[A-G]#?/, "");
    return `${rest} ${root}`;
  }
  const _hoisted_1$h = {
    key: 0,
    class: "chord-container"
  };
  const _hoisted_2$b = { class: "chord-name" };
  const _hoisted_3$6 = ["chord-name"];
  const _sfc_main$i = {
    __name: "ChordChart",
    props: {
      chord: String
    },
    setup(__props) {
      const props = __props;
      const chordRef = vue.useTemplateRef("chord");
      const chordShapes = getChordShapes();
      const isChordExist = vue.ref(true);
      vue.onMounted(() => {
        const formattedChordKey = convertChordName(props.chord);
        const chordShape = chordShapes[formattedChordKey];
        if (!chordShape) {
          return isChordExist.value = false;
        }
        const chordObject = {
          ...chordShape,

barres: chordShape.bars?.map((barre) => {
            return {
              ...barre,
              fromString: barre.from_string,
              toString: barre.to_string
            };
          }),
          chord: chordShape.chord.map(([stringNum, fretNum]) => {
            const raw = [stringNum, fretNum];
            if (Number.isNaN(+fretNum)) {
              return raw;
            }
            let newFretNum = fretNum;
            newFretNum += chordShape.position || 0;
            newFretNum -= chordShape.position_text || 0;
            return [stringNum, newFretNum];
          })
        };
        vue.nextTick(() => {
          const width = chordRef.value.clientWidth;
          const chordBoxSelector = `.chord-chart[chord-name="${props.chord}"]`;
          const chordBox = new vexchords.ChordBox(chordBoxSelector, {
            width,
            height: width * 1.25,
            circleRadius: 5,
            numStrings: 6,
            numFrets: 5,
            showTuning: false,
            defaultColor: "#444",
            bgColor: "transparent"
          });
          chordBox.draw(chordObject);
        });
      });
      return (_ctx, _cache) => {
        return isChordExist.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$h, [
          vue.createElementVNode("div", _hoisted_2$b, vue.toDisplayString(props.chord), 1),
          vue.createElementVNode("div", {
            ref: "chord",
            class: "chord-chart",
            "chord-name": props.chord
          }, null, 8, _hoisted_3$6)
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const ChordChart = _export_sfc(_sfc_main$i, [["__scopeId", "data-v-128703be"]]);
  const _hoisted_1$g = { class: "plus91-popup" };
  const _sfc_main$h = {
    __name: "PopupBase",
    props: {
      "modelValue": {},
      "modelModifiers": {}
    },
    emits: ["update:modelValue"],
    setup(__props) {
      const modelValue = vue.useModel(__props, "modelValue");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, { name: "slide-and-fade" }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", _hoisted_1$g, [
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ], 512), [
              [vue.vShow, modelValue.value]
            ])
          ]),
          _: 3
        });
      };
    }
  };
  const PopupBase = _export_sfc(_sfc_main$h, [["__scopeId", "data-v-ed81246a"]]);
  class MonkeyStorage {
static getStorageType() {
      if (_GM_getValue && _GM_setValue) {
        return "Greasemonkey";
      } else {
        return "LocalStorage";
      }
    }
static getItem(key) {
      const storageType = this.getStorageType();
      switch (storageType) {
        case "Greasemonkey":
          return _GM_getValue(key, null);
        case "LocalStorage":
          return localStorage.getItem(key);
        default:
          return null;
      }
    }
static setItem(key, value) {
      const storageType = this.getStorageType();
      switch (storageType) {
        case "Greasemonkey":
          _GM_setValue(key, value);
          break;
        case "LocalStorage":
          localStorage.setItem(key, value);
          break;
      }
    }
  }
  const useStore = defineStore("store", {
    state() {
      return {


isDarkMode: false,
        isToolbarsShow: false,
        isPopupShow: {
          sheet: false,
          chord: false,
          font: false,
          settings: false,
          menu: false,
hotkey: false
        },


agreeToArchiveSheet: true,
        isDevMode: false,
        themeColor: "#4b96a9",


transpose: 0,
originalCapo: 0,
originalKey: "",
fontSizeDelta: 0,
originalFontSize: 0,
originalLineHeight: 0
      };
    },
    persist: {
      key: "plus91-preferences",
      storage: MonkeyStorage,
      deserialize: zipson.parse,
      serialize: zipson.stringify,
      pick: ["isDarkMode", "agreeToArchiveSheet", "isDevMode", "themeColor"],
      beforeHydrate() {
        console.log("[91Plus] 讀取偏好設置中");
      },
      afterHydrate() {
        console.log("[91Plus] 偏好設置讀取完畢");
      },
      debug: true
    },
    getters: {
      currentCapo() {
        return this.originalCapo + this.transpose;
      },
      currentKey() {
        return new Chord(this.originalKey).transpose(-this.transpose).toFormattedString();
      }
    },
    actions: {
      toggleToolbars() {
        if (this.isToolbarsShow) {
          this.closePopups();
        } else {
          this.isPopupShow.sheet = true;
        }
        this.isToolbarsShow = !this.isToolbarsShow;
      },
      closePopups() {
        for (const popup in this.isPopupShow) {
          this.isPopupShow[popup] = false;
        }
      },
togglePopup(name) {
        for (const popup in this.isPopupShow) {
          if (popup === name) {
            this.isPopupShow[popup] = !this.isPopupShow[popup];
          } else {
            this.isPopupShow[popup] = false;
          }
        }
      },
      plusTranspose(numberToPlus) {
        let newTranspose = this.transpose + numberToPlus;
        const newCapo = this.originalCapo + newTranspose;
        if (newCapo === 12 || newCapo === -12) {
          newTranspose = -this.originalCapo;
        }
        this.transpose = newTranspose;
      }
    }
  });
  const _hoisted_1$f = { class: "banner" };
  const _hoisted_2$a = { class: "chord-popup-container" };
  const _sfc_main$g = {
    __name: "ChordPopup",
    setup(__props) {
      const store = useStore();
      const bannerText = vue.ref("");
      const bannerTextList = [
        "此處的和弦圖示僅供參考！由於技術問題，目前尚無法準確繪製，尤其在把位較常出現錯誤，請注意。",
        "在 91 譜中沒有資料的和弦是畫不出來的呦！"
      ];
      function refreshBanner() {
        const randomIndex = Math.floor(Math.random() * bannerTextList.length);
        bannerText.value = bannerTextList[randomIndex];
      }
      const chordList = vue.ref([]);
      vue.watch(store.isPopupShow, () => {
        if (!store.isPopupShow.chord) {
          return;
        }
        refreshBanner();
        chordList.value = getChordList();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(PopupBase, {
          id: "plus91-chord-popup",
          modelValue: vue.unref(store).isPopupShow.chord,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(store).isPopupShow.chord = $event),
          class: vue.normalizeClass({ "banner-only": !chordList.value.length })
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$f, [
              vue.createVNode(BootstrapIcon, {
                icon: "info-circle-fill",
                color: "inherit",
                size: "inherit"
              }),
              vue.createElementVNode("section", null, vue.toDisplayString(bannerText.value), 1)
            ]),
            vue.createElementVNode("div", _hoisted_2$a, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(chordList.value, (chord) => {
                return vue.openBlock(), vue.createBlock(ChordChart, {
                  key: chord,
                  chord
                }, null, 8, ["chord"]);
              }), 128))
            ])
          ]),
          _: 1
        }, 8, ["modelValue", "class"]);
      };
    }
  };
  const ChordPopup = _export_sfc(_sfc_main$g, [["__scopeId", "data-v-858a1989"]]);
  const _hoisted_1$e = { class: "toolbar-icon" };
  const _hoisted_2$9 = {
    key: 0,
    class: "toolbar-icon-text"
  };
  const _sfc_main$f = {
    __name: "ToolbarIcon",
    props: {
      icon: {
        type: String,
        required: true
      },
      text: {
        type: String,
        default: ""
      },
      stroke: {
        type: String,
        default: "0"
      },
      active: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: "whitesmoke"
      }
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "v08ff4922": __props.color
      }));
      const props = __props;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$e, [
          vue.createVNode(BootstrapIcon, {
            size: "1.3rem",
            icon: props.icon,
            color: props.color,
            stroke: props.stroke,
            active: props.active
          }, null, 8, ["icon", "color", "stroke", "active"]),
          props.text ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$9, vue.toDisplayString(props.text), 1)) : vue.createCommentVNode("", true)
        ]);
      };
    }
  };
  const ToolbarIcon = _export_sfc(_sfc_main$f, [["__scopeId", "data-v-cbf0cf0b"]]);
  const _hoisted_1$d = { class: "adjust-widget" };
  const _hoisted_2$8 = ["disabled"];
  const _hoisted_3$5 = ["disabled"];
  const _hoisted_4$2 = ["disabled"];
  const _sfc_main$e = {
    __name: "AdjustWidget",
    props: {
      iconLeft: {
        type: String,
        default: "caret-left-fill"
      },
      iconRight: {
        type: String,
        default: "caret-right-fill"
      },
      disabledLeft: {
        type: Boolean,
        default: false
      },
      disabledMiddle: {
        type: Boolean,
        default: false
      },
      disabledRight: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: "#444"
      },
      size: {
        type: String,
        default: "1.25rem"
      },
      onclickLeft: Function,
      onclickMiddle: Function,
      onclickRight: Function
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "v5e7bf01c": __props.color,
        "v1bd9a428": __props.size
      }));
      const props = __props;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$d, [
          vue.createElementVNode("button", {
            class: "adjust-button adjust-button-left",
            disabled: props.disabledLeft,
            onClick: _cache[0] || (_cache[0] = (...args) => props.onclickLeft && props.onclickLeft(...args))
          }, [
            vue.createVNode(BootstrapIcon, {
              icon: props.iconLeft,
              color: props.color,
              size: props.size
            }, null, 8, ["icon", "color", "size"])
          ], 8, _hoisted_2$8),
          vue.createElementVNode("button", {
            class: "adjust-button adjust-button-middle",
            disabled: props.disabledMiddle,
            onClick: _cache[1] || (_cache[1] = (...args) => props.onclickMiddle && props.onclickMiddle(...args))
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ], 8, _hoisted_3$5),
          vue.createElementVNode("button", {
            class: "adjust-button adjust-button-right",
            disabled: props.disabledRight,
            onClick: _cache[2] || (_cache[2] = (...args) => props.onclickRight && props.onclickRight(...args))
          }, [
            vue.createVNode(BootstrapIcon, {
              icon: props.iconRight,
              color: props.color,
              size: props.size
            }, null, 8, ["icon", "color", "size"])
          ], 8, _hoisted_4$2)
        ]);
      };
    }
  };
  const AdjustWidget = _export_sfc(_sfc_main$e, [["__scopeId", "data-v-0178875e"]]);
  const _hoisted_1$c = { class: "font-popup-container" };
  const _sfc_main$d = {
    __name: "FontSizePopup",
    setup(__props) {
      const store = useStore();
      const getFontSize = vue.computed(() => store.originalFontSize + store.fontSizeDelta);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(PopupBase, {
          id: "plus91-font-popup",
          modelValue: vue.unref(store).isPopupShow.font,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(store).isPopupShow.font = $event)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$c, [
              vue.createVNode(AdjustWidget, {
                "onclick-left": () => {
                  vue.unref(store).fontSizeDelta--;
                },
                "onclick-middle": () => {
                  vue.unref(store).fontSizeDelta = 0;
                },
                "onclick-right": () => {
                  vue.unref(store).fontSizeDelta++;
                },
                "disabled-left": getFontSize.value <= 8,
                "disabled-right": getFontSize.value >= 30
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(getFontSize.value) + "px ", 1)
                ]),
                _: 1
              }, 8, ["onclick-left", "onclick-middle", "onclick-right", "disabled-left", "disabled-right"])
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const hotkeysLeft = [{ "hotkey": "空白鍵", "desc": "開啟 / 關閉功能選單" }, { "hotkey": "ESC", "desc": "關閉功能選單" }, { "hotkey": "/", "desc": "切換至搜尋框" }];
  const hotkeysRight = [{ "hotkey": "", "desc": "移調選單開啟時" }, { "hotkey": "← →", "desc": "移調" }, { "hotkey": "↓", "desc": "移回初始調" }, { "hotkey": "", "desc": "在搜尋框內" }, { "hotkey": "Enter", "desc": "搜尋" }, { "hotkey": "ESC", "desc": "跳出搜尋框" }];
  const hotkeyData = {
    hotkeysLeft,
    hotkeysRight
  };
  const _hoisted_1$b = { class: "hotkey-item" };
  const _hoisted_2$7 = {
    key: 0,
    class: "hotkeys"
  };
  const _hoisted_3$4 = {
    key: 1,
    class: "hr"
  };
  const _sfc_main$c = {
    __name: "HotkeyItem",
    props: {
      hotkey: {
        type: String,
        required: false
      },
      desc: String
    },
    setup(__props) {
      const props = __props;
      const hotkeyList = props.hotkey.split(" ");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["desc", { title: !__props.hotkey }])
          }, vue.toDisplayString(__props.desc), 3),
          __props.hotkey ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$7, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(hotkeyList), (key) => {
              return vue.openBlock(), vue.createElementBlock("kbd", {
                key: `${key}_${__props.hotkey}_${__props.desc}`
              }, vue.toDisplayString(key), 1);
            }), 128))
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$4))
        ]);
      };
    }
  };
  const HotkeyItem = _export_sfc(_sfc_main$c, [["__scopeId", "data-v-851f225f"]]);
  const _hoisted_1$a = { class: "hotkey-popup-container" };
  const _hoisted_2$6 = { class: "left-part" };
  const _hoisted_3$3 = { class: "right-part" };
  const _sfc_main$b = {
    __name: "HotkeyPopup",
    setup(__props) {
      const store = useStore();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(PopupBase, {
          id: "plus91-hotkey-popup",
          modelValue: vue.unref(store).isPopupShow.hotkey,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(store).isPopupShow.hotkey = $event)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$a, [
              vue.createElementVNode("section", _hoisted_2$6, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(hotkeyData).hotkeysLeft, (item, index) => {
                  return vue.openBlock(), vue.createBlock(HotkeyItem, {
                    key: `${item.hotkey}_${item.desc}_${index}`,
                    hotkey: item.hotkey,
                    desc: item.desc
                  }, null, 8, ["hotkey", "desc"]);
                }), 128))
              ]),
              vue.createElementVNode("section", _hoisted_3$3, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(hotkeyData).hotkeysRight, (item, index) => {
                  return vue.openBlock(), vue.createBlock(HotkeyItem, {
                    key: `${item.hotkey}_${item.desc}_${index}`,
                    hotkey: item.hotkey,
                    desc: item.desc
                  }, null, 8, ["hotkey", "desc"]);
                }), 128))
              ])
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const HotkeyPopup = _export_sfc(_sfc_main$b, [["__scopeId", "data-v-07402c98"]]);
  const _hoisted_1$9 = { class: "icon-button" };
  const _hoisted_2$5 = { class: "button-text" };
  const _sfc_main$a = {
    __name: "MenuButton",
    props: {
      icon: String,
      name: String,
      color: String
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "v12c3e3a5": __props.color
      }));
      const props = __props;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$9, [
          vue.createVNode(ToolbarIcon, {
            icon: props.icon,
            color: props.color
          }, null, 8, ["icon", "color"]),
          vue.createElementVNode("div", _hoisted_2$5, vue.toDisplayString(props.name), 1)
        ]);
      };
    }
  };
  const MenuButton = _export_sfc(_sfc_main$a, [["__scopeId", "data-v-cb0cf859"]]);
  const _hoisted_1$8 = { class: "menu-popup-container" };
  const BUTTON_COLOR = "#555";
  const _sfc_main$9 = {
    __name: "MenuPopup",
    setup(__props) {
      const store = useStore();
      async function captureAsImage() {
        const content = document.querySelector("section.content");
        const canvas = await html2canvas(content);
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 1e4);
      }
      function searchOnYoutube() {
        const chordSheetDocument = new ChordSheetDocument();
        const title = chordSheetDocument.getTitle();
        const artist = chordSheetDocument.getSinger();
        const url = `https://www.youtube.com/results?search_query=${title}+${artist}`;
        window.open(url, "_blank").focus();
      }
      function goToGithubPage() {
        const url = "https://github.com/DonkeyBear/91Plus/blob/main/README.md";
        window.open(url, "_blank").focus();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(PopupBase, {
          id: "plus91-menu-popup",
          modelValue: vue.unref(store).isPopupShow.menu,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(store).isPopupShow.menu = $event)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$8, [
              vue.createVNode(MenuButton, {
                icon: "keyboard",
                name: "快捷鍵",
                color: BUTTON_COLOR,
                onClick: _cache[0] || (_cache[0] = () => {
                  vue.unref(store).togglePopup("hotkey");
                })
              }),
              vue.createVNode(MenuButton, {
                icon: "file-earmark-image",
                name: "擷取為圖片",
                color: BUTTON_COLOR,
                onClick: captureAsImage
              }),
              vue.createVNode(MenuButton, {
                icon: "youtube",
                name: "搜尋 YouTube",
                color: BUTTON_COLOR,
                onClick: searchOnYoutube
              }),
              vue.createVNode(MenuButton, {
                icon: "github",
                name: "關於 91 Plus",
                color: BUTTON_COLOR,
                onClick: goToGithubPage
              })
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const MenuPopup = _export_sfc(_sfc_main$9, [["__scopeId", "data-v-f8df8357"]]);
  const colors = [
    "#4b96a9",
    "#a2b538",
    "#e181bf",
    "#6c59bb"
  ];
  const _hoisted_1$7 = { class: "color-switcher-container" };
  const _hoisted_2$4 = ["onClick"];
  const _sfc_main$8 = {
    __name: "ColorSwitcher",
    props: vue.mergeModels({
      options: {
        type: Array,
        required: true,
        validator: (options) => {
          return options.every((opt) => typeof opt === "string");
        }
      }
    }, {
      "modelValue": {},
      "modelModifiers": {}
    }),
    emits: ["update:modelValue"],
    setup(__props) {
      const props = __props;
      const modelValue = vue.useModel(__props, "modelValue");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.options, (option) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: option,
              class: "color-switcher-option",
              style: vue.normalizeStyle({
                background: `color-mix(in srgb, ${option} 75%, white)`,
                borderColor: `color-mix(in srgb, ${option} 80%, white)`
              }),
              onClick: () => modelValue.value = option
            }, [
              modelValue.value === option ? (vue.openBlock(), vue.createBlock(BootstrapIcon, {
                key: 0,
                icon: "check",
                color: `color-mix(in srgb, ${option} 25%, white)`
              }, null, 8, ["color"])) : vue.createCommentVNode("", true)
            ], 12, _hoisted_2$4);
          }), 128))
        ]);
      };
    }
  };
  const ColorSwitcher = _export_sfc(_sfc_main$8, [["__scopeId", "data-v-9499f72a"]]);
  const _hoisted_1$6 = { class: "toggle-switch" };
  const _sfc_main$7 = {
    __name: "ToggleSwitch",
    props: {
      "modelValue": {
        type: Boolean,
        default: false
      },
      "modelModifiers": {}
    },
    emits: ["update:modelValue"],
    setup(__props) {
      const modelValue = vue.useModel(__props, "modelValue");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("label", _hoisted_1$6, [
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modelValue.value = $event),
            type: "checkbox",
            hidden: ""
          }, null, 512), [
            [vue.vModelCheckbox, modelValue.value]
          ]),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["switch-track", { active: modelValue.value }])
          }, [..._cache[1] || (_cache[1] = [
            vue.createElementVNode("div", { class: "switch-thumb" }, null, -1)
          ])], 2)
        ]);
      };
    }
  };
  const ToggleSwitch = _export_sfc(_sfc_main$7, [["__scopeId", "data-v-1cf8e431"]]);
  const _hoisted_1$5 = { class: "settings-popup-container" };
  const _hoisted_2$3 = { class: "setting-item" };
  const _hoisted_3$2 = { class: "setting-item" };
  const _hoisted_4$1 = { class: "setting-item" };
  const _hoisted_5$1 = { class: "setting-item" };
  const _sfc_main$6 = {
    __name: "SettingsPopup",
    setup(__props) {
      const store = useStore();
      const themeColor = useCssVar("--theme-color", document.documentElement);
      vue.watch(() => store.themeColor, (newColor) => {
        themeColor.value = newColor;
      }, { immediate: true });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(PopupBase, {
          id: "plus91-settings-popup",
          modelValue: vue.unref(store).isPopupShow.settings,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(store).isPopupShow.settings = $event)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$5, [
              vue.createElementVNode("div", _hoisted_2$3, [
                vue.createElementVNode("div", null, [
                  vue.createVNode(BootstrapIcon, { icon: "palette" }),
                  _cache[5] || (_cache[5] = vue.createTextVNode(" 主題色 ", -1))
                ]),
                vue.createVNode(ColorSwitcher, {
                  modelValue: vue.unref(store).themeColor,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(store).themeColor = $event),
                  options: vue.unref(colors)
                }, null, 8, ["modelValue", "options"])
              ]),
              vue.createElementVNode("label", _hoisted_3$2, [
                vue.createElementVNode("div", null, [
                  vue.createVNode(BootstrapIcon, { icon: "moon" }),
                  _cache[6] || (_cache[6] = vue.createTextVNode(" 深色模式 ", -1))
                ]),
                vue.createVNode(ToggleSwitch, {
                  modelValue: vue.unref(store).isDarkMode,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(store).isDarkMode = $event)
                }, null, 8, ["modelValue"])
              ]),
              vue.createElementVNode("label", _hoisted_4$1, [
                vue.createElementVNode("div", null, [
                  vue.createVNode(BootstrapIcon, { icon: "cloudy" }),
                  _cache[7] || (_cache[7] = vue.createTextVNode(" 協助測試雲端樂譜 ", -1))
                ]),
                vue.createVNode(ToggleSwitch, {
                  modelValue: vue.unref(store).agreeToArchiveSheet,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(store).agreeToArchiveSheet = $event)
                }, null, 8, ["modelValue"])
              ]),
              vue.createElementVNode("label", _hoisted_5$1, [
                vue.createElementVNode("div", null, [
                  vue.createVNode(BootstrapIcon, { icon: "code-slash" }),
                  _cache[8] || (_cache[8] = vue.createTextVNode(" 開發者模式 ", -1))
                ]),
                vue.createVNode(ToggleSwitch, {
                  modelValue: vue.unref(store).isDevMode,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(store).isDevMode = $event)
                }, null, 8, ["modelValue"])
              ])
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const SettingsPopup = _export_sfc(_sfc_main$6, [["__scopeId", "data-v-3259211c"]]);
  const _hoisted_1$4 = { class: "sheet-popup-container" };
  const _hoisted_2$2 = { class: "text-capo" };
  const _hoisted_3$1 = ["innerHTML"];
  const _hoisted_4 = { class: "transpose-range-container" };
  const _hoisted_5 = ["value"];
  const _hoisted_6 = { class: "instrument-select-container" };
  const _sfc_main$5 = {
    __name: "SheetPopup",
    setup(__props) {
      const store = useStore();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(PopupBase, {
          id: "plus91-sheet-popup",
          modelValue: vue.unref(store).isPopupShow.sheet,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(store).isPopupShow.sheet = $event)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$4, [
              vue.createVNode(AdjustWidget, {
                "onclick-left": () => {
                  vue.unref(store).plusTranspose(-1);
                },
                "onclick-middle": () => {
                  vue.unref(store).transpose = 0;
                },
                "onclick-right": () => {
                  vue.unref(store).plusTranspose(1);
                }
              }, {
                default: vue.withCtx(() => [
                  _cache[5] || (_cache[5] = vue.createTextVNode(" CAPO：", -1)),
                  vue.createElementVNode("span", _hoisted_2$2, vue.toDisplayString(vue.unref(store).currentCapo), 1),
                  _cache[6] || (_cache[6] = vue.createTextVNode(" (", -1)),
                  vue.createElementVNode("span", {
                    class: "text-key",
                    innerHTML: vue.unref(store).currentKey
                  }, null, 8, _hoisted_3$1),
                  _cache[7] || (_cache[7] = vue.createTextVNode(") ", -1))
                ]),
                _: 1
              }, 8, ["onclick-left", "onclick-middle", "onclick-right"]),
              vue.createElementVNode("div", _hoisted_4, [
                vue.createElementVNode("input", {
                  type: "range",
                  min: "-11",
                  max: "11",
                  value: vue.unref(store).currentCapo,
                  onInput: _cache[0] || (_cache[0] = ($event) => {
                    vue.unref(store).transpose = $event.target.value - vue.unref(store).originalCapo;
                  })
                }, null, 40, _hoisted_5)
              ]),
              vue.createElementVNode("div", _hoisted_6, [
                vue.createElementVNode("button", {
                  class: "instrument-select-button",
                  onClick: _cache[1] || (_cache[1] = () => {
                    vue.unref(switchInstrument)("");
                  })
                }, " 無 "),
                vue.createElementVNode("button", {
                  class: "instrument-select-button",
                  onClick: _cache[2] || (_cache[2] = () => {
                    vue.unref(switchInstrument)("guitar");
                  })
                }, " 吉他 "),
                vue.createElementVNode("button", {
                  class: "instrument-select-button",
                  onClick: _cache[3] || (_cache[3] = () => {
                    vue.unref(switchInstrument)("ukulele");
                  })
                }, " 烏克莉莉 ")
              ])
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const SheetPopup = _export_sfc(_sfc_main$5, [["__scopeId", "data-v-18539399"]]);
  const _hoisted_1$3 = { id: "plus91-footer" };
  const _hoisted_2$1 = { class: "footer-container" };
  const _sfc_main$4 = {
    __name: "AppFooter",
    props: {
      active: Boolean
    },
    setup(__props) {
      const props = __props;
      const store = useStore();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, { name: "slide" }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", _hoisted_1$3, [
              vue.createElementVNode("div", _hoisted_2$1, [
                vue.createVNode(ToolbarIcon, {
                  icon: "music-note-beamed",
                  text: "譜面",
                  stroke: ".05rem",
                  active: vue.unref(store).isPopupShow.sheet,
                  onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(store).togglePopup("sheet"))
                }, null, 8, ["active"]),
                vue.createVNode(ToolbarIcon, {
                  icon: "table",
                  text: "和弦",
                  active: vue.unref(store).isPopupShow.chord,
                  onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(store).togglePopup("chord"))
                }, null, 8, ["active"]),
                vue.createVNode(ToolbarIcon, {
                  icon: "type",
                  text: "字型",
                  stroke: ".05rem",
                  active: vue.unref(store).isPopupShow.font,
                  onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(store).togglePopup("font"))
                }, null, 8, ["active"]),
                vue.createVNode(ToolbarIcon, {
                  icon: "gear-wide-connected",
                  text: "設定",
                  active: vue.unref(store).isPopupShow.settings,
                  onClick: _cache[3] || (_cache[3] = ($event) => vue.unref(store).togglePopup("settings"))
                }, null, 8, ["active"]),
                vue.createVNode(ToolbarIcon, {
                  icon: "list",
                  text: "其他",
                  stroke: ".05rem",
                  active: vue.unref(store).isPopupShow.menu,
                  onClick: _cache[4] || (_cache[4] = ($event) => vue.unref(store).togglePopup("menu"))
                }, null, 8, ["active"]),
                vue.createVNode(SheetPopup),
                vue.createVNode(ChordPopup),
                vue.createVNode(_sfc_main$d),
                vue.createVNode(SettingsPopup),
                vue.createVNode(MenuPopup),
                vue.createVNode(HotkeyPopup)
              ])
            ], 512), [
              [vue.vShow, props.active]
            ])
          ]),
          _: 1
        });
      };
    }
  };
  const AppFooter = _export_sfc(_sfc_main$4, [["__scopeId", "data-v-c2303173"]]);
  const _hoisted_1$2 = { id: "plus91-header" };
  const _hoisted_2 = { class: "header-container" };
  const _hoisted_3 = { class: "search-container" };
  const _sfc_main$3 = {
    __name: "AppHeader",
    props: {
      active: Boolean
    },
    setup(__props) {
      const props = __props;
      const isSearchInputFocused = vue.ref(false);
      const searchText = vue.ref("");
      function search() {
        if (!searchText.value) {
          return;
        }
        const url = `https://www.91pu.com.tw/plus/search.php?keyword=${searchText.value}`;
        window.open(url, "_blank").focus();
      }
      function backToPreviousPage() {
        history.back();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, { name: "slide" }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", _hoisted_1$2, [
              vue.createElementVNode("div", _hoisted_2, [
                vue.createVNode(ToolbarIcon, {
                  icon: "chevron-left",
                  stroke: ".04rem",
                  onClick: backToPreviousPage
                }),
                vue.createElementVNode("form", {
                  onSubmit: vue.withModifiers(search, ["prevent"])
                }, [
                  vue.createElementVNode("div", _hoisted_3, [
                    vue.withDirectives(vue.createElementVNode("input", {
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchText.value = $event),
                      type: "text",
                      placeholder: "搜尋樂譜 —— 91 Plus",
                      onKeydown: _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers((event) => {
                        event.target.blur();
                      }, ["stop"]), ["esc"])),
                      onFocus: _cache[2] || (_cache[2] = ($event) => isSearchInputFocused.value = true),
                      onBlur: _cache[3] || (_cache[3] = ($event) => isSearchInputFocused.value = false)
                    }, null, 544), [
                      [
                        vue.vModelText,
                        searchText.value,
                        void 0,
                        { trim: true }
                      ]
                    ]),
                    searchText.value ? (vue.openBlock(), vue.createBlock(ToolbarIcon, {
                      key: 0,
                      class: "clear-input",
                      icon: "x",
                      color: isSearchInputFocused.value ? "#0007" : "#fffa",
                      onClick: _cache[4] || (_cache[4] = () => {
                        searchText.value = "";
                      })
                    }, null, 8, ["color"])) : vue.createCommentVNode("", true)
                  ])
                ], 32),
                vue.createVNode(ToolbarIcon, {
                  icon: "search",
                  stroke: ".03rem",
                  onClick: search
                })
              ])
            ], 512), [
              [vue.vShow, props.active]
            ])
          ]),
          _: 1
        });
      };
    }
  };
  const AppHeader = _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c3427f68"]]);
  const _hoisted_1$1 = { id: "dark-mode-overlay" };
  const _sfc_main$2 = {
    __name: "DarkModeOverlay",
    props: {
      active: Boolean
    },
    setup(__props) {
      const props = __props;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, { name: "fade" }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", _hoisted_1$1, null, 512), [
              [vue.vShow, props.active]
            ])
          ]),
          _: 1
        });
      };
    }
  };
  const DarkModeOverlay = _export_sfc(_sfc_main$2, [["__scopeId", "data-v-111379c3"]]);
  const _hoisted_1 = { ref: "eruda-container" };
  const _sfc_main$1 = {
    __name: "ErudaContainer",
    setup(__props) {
      const store = useStore();
      const thisWindow = _unsafeWindow ?? window;
      const erudaContainer = vue.useTemplateRef("eruda-container");
      function initEruda() {
        const erudaEl = document.createElement("div");
        erudaContainer.value.appendChild(erudaEl);
        thisWindow.eruda.init({ container: erudaEl });
        thisWindow.eruda.get("snippets").clear();
        thisWindow.eruda.get("snippets").add("儲存模式", () => {
          console.log(`[91 Plus] 儲存模式：${MonkeyStorage.getStorageType()}`);
        }, "在控制台顯示目前的儲存模式");
      }
      function handleEruda(isDevMode) {
        if (isDevMode) {
          if (!thisWindow.eruda) {
            useScriptTag("https://cdn.jsdelivr.net/npm/eruda/eruda.min.js", initEruda);
          } else {
            initEruda();
          }
        } else {
          thisWindow.eruda?.destroy();
        }
      }
      watchImmediate(() => store.isDevMode, handleEruda);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, null, 512);
      };
    }
  };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const store = useStore();
      const parent = useParentElement();
      onClickOutside(parent, store.toggleToolbars);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(AppHeader, {
            active: vue.unref(store).isToolbarsShow
          }, null, 8, ["active"]),
          vue.createVNode(AppFooter, {
            active: vue.unref(store).isToolbarsShow
          }, null, 8, ["active"]),
          vue.createVNode(DarkModeOverlay, {
            active: vue.unref(store).isDarkMode
          }, null, 8, ["active"]),
          vue.createVNode(_sfc_main$1)
        ], 64);
      };
    }
  };
  class StoreHandler {
#store;
    constructor() {
      this.#store = useStore();
    }
initStateFromDom() {
      const capoSelected = $(".capo .select").eq(0).text().trim();
      const originalCapo = +capoSelected.split(/\s*\/\s*/)[0];
      const originalKey = capoSelected.split(/\s*\/\s*/)[1];
      this.#store.originalCapo = originalCapo;
      this.#store.originalKey = originalKey;
      const fontSize = +$("#tone_z").css("font-size").match(/^\d+/)[0];
      const lineHeight = +$("#tone_z > p").css("line-height").match(/^\d+/)[0];
      this.#store.originalFontSize = fontSize;
      this.#store.originalLineHeight = lineHeight;
      const params = getQueryParams();
      if (params.transpose) {
        this.#store.transpose = params.transpose;
      }
    }
initWatchers() {
      this.#watchTranspose();
      this.#watchFontSize();
    }
#watchTranspose() {
      vue.watch(() => this.#store.transpose, (newValue, oldValue) => {
        ChordSheetElement.transposeSheet((newValue - oldValue) % 12);
      });
    }
    #watchFontSize() {
      vue.watch(() => this.#store.fontSizeDelta, (newValue) => {
        const oFontSize = this.#store.originalFontSize;
        const oLineHeight = this.#store.originalLineHeight;
        $("#tone_z").css("font-size", `${oFontSize + newValue}px`);
        $("#tone_z > p").css("line-height", `${oLineHeight + newValue}px`);
      });
    }
    initKeyBindings() {
      const activeElement = useActiveElement();
      function isInputFocused() {
        return activeElement.value?.tagName === "INPUT" || activeElement.value?.tagName === "TEXTAREA";
      }
      function whenInputNotFocused(func) {
        return () => {
          if (!isInputFocused()) {
            func();
          }
        };
      }
      onKeyStroke(" ", whenInputNotFocused(() => {
        this.#store.toggleToolbars();
      }));
      onKeyStroke("/", whenInputNotFocused(() => {
        if (!this.#store.isToolbarsShow) {
          this.#store.toggleToolbars();
          this.#store.closePopups();
        }
        setTimeout(() => {
          $("#plus91-header input")?.get(0)?.focus();
        });
      }));
      onKeyStroke("Escape", whenInputNotFocused(() => {
        if (this.#store.isToolbarsShow) {
          this.#store.toggleToolbars();
        }
      }));
      onKeyStroke("ArrowLeft", whenInputNotFocused(() => {
        if (this.#store.isPopupShow.sheet) {
          this.#store.plusTranspose(-1);
        }
      }));
      onKeyStroke("ArrowRight", whenInputNotFocused(() => {
        if (this.#store.isPopupShow.sheet) {
          this.#store.plusTranspose(1);
        }
      }));
      onKeyStroke("ArrowDown", whenInputNotFocused(() => {
        if (this.#store.isPopupShow.sheet) {
          this.#store.transpose = 0;
        }
      }));
    }
  }
  function init() {
    redirect();
    const storeHandler = new StoreHandler();
    storeHandler.initWatchers();
    storeHandler.initKeyBindings();
    onSheetDomReady(() => {
      changeTitle();
      storeHandler.initStateFromDom();
      const store = useStore();
      if (store.agreeToArchiveSheet) {
        archiveChordSheet();
      }
    });
  }
  const cdnsScss = '@import"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css";';
  importCSS(cdnsScss);
  const variablesScss = "html{--toolbar-bg-color: color-mix(in srgb, var(--theme-color) 65%, transparent);--toolbar-border-color: color-mix(in srgb, var(--theme-color) 50%, rgba(255, 255, 255, .1))}";
  importCSS(variablesScss);
  const stylesScss = "html{--toolbar-bg-color: color-mix(in srgb, var(--theme-color) 65%, transparent);--toolbar-border-color: color-mix(in srgb, var(--theme-color) 50%, rgba(255, 255, 255, .1))}html{background:#fafafa url(/templets/pu/images/tone-bg.gif)}#vue-91plus{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}.tfunc2{margin:10px}#mtitle{font-family:system-ui}input[type=range],input[type=range]::-webkit-slider-thumb,input[type=range]::-webkit-slider-runnable-track{-webkit-appearance:none;box-shadow:none}input[type=range]::-webkit-slider-thumb,input[type=range]::-webkit-slider-runnable-track{border:1px solid rgba(68,68,68,.25)}input[type=range]::-webkit-slider-thumb{background:#60748d}#viptoneWindow.window,#bottomad,.update_vip_bar,.wmask,header,footer,.autoscroll,.backplace,.set .keys,.set .plays,.set .clear,.setint .hr:nth-child(4),.setint .hr:nth-child(5),.setint .hr:nth-child(6),.adsbygoogle,[class^=AD2M],[id^=adGeek]{display:none!important}";
  importCSS(stylesScss);
  const pinia = createPinia();
  pinia.use(index_default);
  vue.createApp(_sfc_main).use(pinia).mount(
    (() => {
      const app = document.createElement("div");
      app.id = "vue-91plus";
      document.body.append(app);
      return app;
    })()
  );
  init();

})(Vue, vexchords, zipson, html2canvas);