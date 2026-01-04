// ==UserScript==
// @name       bangumi-mpv
// @namespace  http://tampermonkey.net/
// @version    0.6.5
// @author     kahosan
// @license    MIT
// @icon       https://bgm.tv/img/favicon.ico
// @match      https://bgm.tv/subject/*
// @require    https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js
// @grant      GM_xmlhttpRequest
// @description 点击 bgm.tv 动漫页面的集数，便可通过 MPV 播放本地储存的那集动漫
// @downloadURL https://update.greasyfork.org/scripts/442194/bangumi-mpv.user.js
// @updateURL https://update.greasyfork.org/scripts/442194/bangumi-mpv.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=e,document.head.appendChild(t)})(" .tip[data-v-c3f0e0f8]{margin-top:.25rem;line-height:1.4;font-size:12px}.tip-err[data-v-c3f0e0f8]{margin-top:.25rem;line-height:1.4;font-size:12px;color:red}.tip[data-v-d7e90c14]{margin-top:.25rem;line-height:1.4}.main[data-v-1d1c372f]{position:relative}.menu-content[data-v-1d1c372f]{position:absolute;top:20;padding:10px;border-radius:4px;min-width:18rem;background-color:#eee;z-index:100}html[data-theme=dark] .menu-content[data-v-1d1c372f]{background-color:#202020}.main-button[data-v-1d1c372f]{border:none;outline:none;border-radius:2px;padding:2px 4px;cursor:pointer;font-size:14px;color:#888}.main-button[data-v-1d1c372f]:hover{opacity:.8}html[data-theme=dark] .main-button[data-v-1d1c372f]{color:#eee;background-color:#202020}html[data-theme=dark] .main-button[data-v-1d1c372f]:hover{opacity:.6}.menu-content input{background:unset!important;box-shadow:unset!important}.menu-content>*{font-size:12px!important} ");

(function(vue) {
  "use strict";
  var isVue2 = false;
  /*!
    * pinia v2.1.3
    * (c) 2023 Eduardo San Martin Morote
    * @license MIT
    */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = Symbol();
  function isPlainObject$1(o) {
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
          toBeInstalled.forEach((plugin2) => _p.push(plugin2));
          toBeInstalled = [];
        }
      },
      use(plugin2) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin2);
        } else {
          _p.push(plugin2);
        }
        return this;
      },
      _p,
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
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
      if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol();
  function shouldHydrate(obj) {
    return !isPlainObject$1(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
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
    } : noop$1;
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
    const setupStore = pinia._e.run(() => {
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
            pinia.state.value[$id][key] = prop;
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
      pinia = pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
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
  function getPreciseEventTarget(event) {
    return event.composedPath()[0] || null;
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
  function call(funcs, ...args) {
    if (Array.isArray(funcs)) {
      funcs.forEach((func) => call(func, ...args));
    } else
      return funcs(...args);
  }
  function warn$1(location, message) {
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
      if (!vue.isVNode(child)) {
        return true;
      }
      if (child.type === vue.Comment) {
        return false;
      }
      if (child.type === vue.Fragment && !ensureValidVNode(child.children)) {
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
  const Wrapper = vue.defineComponent({
    render() {
      var _a2, _b;
      return (_b = (_a2 = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a2);
    }
  });
  function color2Class(color) {
    return color.replace(/#|\(|\)|,|\s/g, "_");
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
      if (!selector) {
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
    var h = 0;
    var k, i = 0, len2 = str.length;
    for (; len2 >= 4; ++i, len2 -= 4) {
      k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
      k ^= k >>> 24;
      h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    switch (len2) {
      case 3:
        h ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h ^= str.charCodeAt(i) & 255;
        h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    h ^= h >>> 13;
    h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
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
        const ctx = instance.context;
        ctx.bem = {};
        ctx.bem.b = null;
        ctx.bem.els = null;
      }
    };
    function b(arg) {
      let memorizedB;
      let memorizedE;
      return {
        before(ctx) {
          memorizedB = ctx.bem.b;
          memorizedE = ctx.bem.els;
          ctx.bem.els = null;
        },
        after(ctx) {
          ctx.bem.b = memorizedB;
          ctx.bem.els = memorizedE;
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
        before(ctx) {
          memorizedE = ctx.bem.els;
        },
        after(ctx) {
          ctx.bem.els = memorizedE;
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
  function createKey(prefix2, suffix2) {
    return prefix2 + (suffix2 === "default" ? "" : suffix2.replace(/^[a-z]/, (startChar) => startChar.toUpperCase()));
  }
  createKey("abc", "def");
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
  const { c, find } = cssr;
  const { cB, cE, cM, cNotM } = plugin;
  function insideModal(style2) {
    return c(({ props: { bPrefix } }) => `${bPrefix || prefix}modal, ${bPrefix || prefix}drawer`, [style2]);
  }
  function insidePopover(style2) {
    return c(({ props: { bPrefix } }) => `${bPrefix || prefix}popover`, [style2]);
  }
  const isBrowser$1 = typeof document !== "undefined" && typeof window !== "undefined";
  function useMemo(getterOrOptions) {
    const computedValueRef = vue.computed(getterOrOptions);
    const valueRef = vue.ref(computedValueRef.value);
    vue.watch(computedValueRef, (value) => {
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
      `[evtd/create-trap-handler]: name \`${name}\` is invalid. This could be a bug of evtd.`
    );
    return {};
  }
  function ensureTrapHandlers(name, el, handler) {
    const handlers2 = traps[name];
    let elHandlers = handlers2.get(el);
    if (elHandlers === void 0) {
      handlers2.set(el, elHandlers = /* @__PURE__ */ new WeakMap());
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
      var _a2;
      return (_a2 = currentTargets.get(this)) !== null && _a2 !== void 0 ? _a2 : null;
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
            const handlers2 = captureElToHandlers.get(target2);
            if (handlers2 !== void 0) {
              currentTargets.set(e, target2);
              for (const handler of handlers2) {
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
            const handlers2 = bubbleElToHandlers.get(target2);
            if (handlers2 !== void 0) {
              currentTargets.set(e, target2);
              for (const handler of handlers2) {
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
        const handlers2 = typeToWindowEventHandlers[type];
        if (handlers2 === void 0)
          return;
        handlers2.forEach((handler) => handler(e));
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
        const handlers2 = elToHandlers.get(el);
        if (handlers2 !== void 0) {
          if (handlers2.has(handler))
            return true;
        }
      }
      return false;
    }
    function windowEventHandlerExist(type, handler) {
      const handlers2 = typeToWindowEventHandlers[type];
      if (handlers2 !== void 0) {
        if (handlers2.has(handler)) {
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
      const handlers2 = ensureHandlers(elToHandlers, el);
      if (!handlers2.has(mergedHandler))
        handlers2.add(mergedHandler);
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
      const handlers2 = ensureHandlers(elToHandlers, el);
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
      if (handlers2.has(handler))
        handlers2.delete(handler);
      if (handlers2.size === 0) {
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
    vue.watch(controlledStateRef, (value) => {
      if (value !== void 0) {
        uncontrolledStateRef.value = value;
      }
    });
    return vue.computed(() => {
      if (controlledStateRef.value === void 0) {
        return uncontrolledStateRef.value;
      }
      return controlledStateRef.value;
    });
  }
  function isMounted() {
    const isMounted2 = vue.ref(false);
    vue.onMounted(() => {
      isMounted2.value = true;
    });
    return vue.readonly(isMounted2);
  }
  const isIos = (typeof window === "undefined" ? false : /iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
  function useIsIos() {
    return isIos;
  }
  const ssrContextKey = Symbol("@css-render/vue3-ssr");
  function createStyleString(id, style2) {
    return `<style cssr-id="${id}">
${style2}
</style>`;
  }
  function ssrAdapter(id, style2) {
    const ssrContext = vue.inject(ssrContextKey, null);
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
    const context = vue.inject(ssrContextKey, null);
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
  var ResizeObserverSize = function() {
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
      var _a2 = this, x = _a2.x, y = _a2.y, top = _a2.top, right = _a2.right, bottom = _a2.bottom, left = _a2.left, width = _a2.width, height = _a2.height;
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
      var _a2 = target.getBBox(), width = _a2.width, height = _a2.height;
      return !width && !height;
    }
    var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
    return !(offsetWidth || offsetHeight || target.getClientRects().length);
  };
  var isElement = function(obj) {
    var _a2;
    if (obj instanceof Element) {
      return true;
    }
    var scope = (_a2 = obj === null || obj === void 0 ? void 0 : obj.ownerDocument) === null || _a2 === void 0 ? void 0 : _a2.defaultView;
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
    var _a2 = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a2.borderBoxSize, contentBoxSize = _a2.contentBoxSize, devicePixelContentBoxSize = _a2.devicePixelContentBoxSize;
    switch (observedBox) {
      case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
        return devicePixelContentBoxSize;
      case ResizeObserverBoxOptions.BORDER_BOX:
        return borderBoxSize;
      default:
        return contentBoxSize;
    }
  };
  var ResizeObserverEntry = function() {
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
  var process = function() {
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
          elementsHaveResized = process();
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
  var ResizeObserverDetail = function() {
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
  const VResizeObserver = vue.defineComponent({
    name: "ResizeObserver",
    props: {
      onResize: Function
    },
    setup(props) {
      let registered = false;
      const proxy = vue.getCurrentInstance().proxy;
      function handleResize(entry) {
        const { onResize } = props;
        if (onResize !== void 0)
          onResize(entry);
      }
      vue.onMounted(() => {
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
      vue.onBeforeUnmount(() => {
        if (registered) {
          resizeObserverManager.unregisterHandler(proxy.$el.nextElementSibling);
        }
      });
    },
    render() {
      return vue.renderSlot(this.$slots, "default");
    }
  });
  function useReactivated(callback) {
    const isDeactivatedRef = { isDeactivated: false };
    let activateStateInitialized = false;
    vue.onActivated(() => {
      isDeactivatedRef.isDeactivated = false;
      if (!activateStateInitialized) {
        activateStateInitialized = true;
        return;
      }
      callback();
    });
    vue.onDeactivated(() => {
      isDeactivatedRef.isDeactivated = true;
      if (!activateStateInitialized) {
        activateStateInitialized = true;
      }
    });
    return isDeactivatedRef;
  }
  const formItemInjectionKey = createInjectionKey("n-form-item");
  function useFormItem(props, { defaultSize = "medium", mergedSize, mergedDisabled } = {}) {
    const NFormItem = vue.inject(formItemInjectionKey, null);
    vue.provide(formItemInjectionKey, null);
    const mergedSizeRef = vue.computed(mergedSize ? () => mergedSize(NFormItem) : () => {
      const { size: size2 } = props;
      if (size2)
        return size2;
      if (NFormItem) {
        const { mergedSize: mergedSize2 } = NFormItem;
        if (mergedSize2.value !== void 0) {
          return mergedSize2.value;
        }
      }
      return defaultSize;
    });
    const mergedDisabledRef = vue.computed(mergedDisabled ? () => mergedDisabled(NFormItem) : () => {
      const { disabled } = props;
      if (disabled !== void 0) {
        return disabled;
      }
      if (NFormItem) {
        return NFormItem.disabled.value;
      }
      return false;
    });
    const mergedStatusRef = vue.computed(() => {
      const { status } = props;
      if (status)
        return status;
      return NFormItem === null || NFormItem === void 0 ? void 0 : NFormItem.mergedValidationStatus.value;
    });
    vue.onBeforeUnmount(() => {
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
  const freeGlobal$1 = freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal$1 || freeSelf || Function("return this")();
  const root$1 = root;
  var Symbol$1 = root$1.Symbol;
  const Symbol$2 = Symbol$1;
  var objectProto$a = Object.prototype;
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$a.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
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
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var isArray = Array.isArray;
  const isArray$1 = isArray;
  var INFINITY = 1 / 0;
  var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
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
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  function identity$1(value) {
    return value;
  }
  var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction$1(value) {
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
    var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
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
  var baseSetToString = !defineProperty$1 ? identity$1 : function(func, string) {
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
    return setToString$1(overRest(func, start, identity$1), func + "");
  }
  var MAX_SAFE_INTEGER = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction$1(value);
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
  var isArguments = baseIsArguments(function() {
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
  var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;
  const isBuffer$1 = isBuffer;
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
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$4.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
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
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  var objectProto$2 = Object.prototype;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate$1) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? void 0 : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : void 0;
  }
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$1.call(data, key);
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED : value;
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
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  const getPrototype$1 = getPrototype;
  var objectTag = "[object Object]";
  var funcProto = Function.prototype, objectProto = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype$1(value);
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
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }
  function asciiToArray(string) {
    return string.split("");
  }
  var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsVarRange = "\\ufe0e\\ufe0f";
  var rsAstral = "[" + rsAstralRange + "]", rsCombo = "[" + rsComboRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ = "\\u200d";
  var reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
  var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }
  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }
  function createCaseFirst(methodName) {
    return function(string) {
      string = toString(string);
      var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
      var chr = strSymbols ? strSymbols[0] : string.charAt(0);
      var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
      return chr[methodName]() + trailing;
    };
  }
  var upperFirst = createCaseFirst("toUpperCase");
  const upperFirst$1 = upperFirst;
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
        } else if (!isObject(objValue) || isFunction$1(objValue)) {
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
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });
  const merge$1 = merge;
  const commonVariables$m = {
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
  } = commonVariables$m;
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
  function useTheme(resolveId, mountId, style2, defaultTheme, props, clsPrefixRef) {
    const ssrAdapter2 = useSsrAdapter();
    const NConfigProvider2 = vue.inject(configProviderInjectionKey, null);
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
        if (!(NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.preflightStyleDisabled)) {
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
        vue.onBeforeMount(mountStyle);
      }
    }
    const mergedThemeRef = vue.computed(() => {
      var _a2;
      const { theme: { common: selfCommon, self: self2, peers = {} } = {}, themeOverrides: selfOverrides = {}, builtinThemeOverrides: builtinOverrides = {} } = props;
      const { common: selfCommonOverrides, peers: peersOverrides } = selfOverrides;
      const { common: globalCommon = void 0, [resolveId]: { common: globalSelfCommon = void 0, self: globalSelf = void 0, peers: globalPeers = {} } = {} } = (NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedThemeRef.value) || {};
      const { common: globalCommonOverrides = void 0, [resolveId]: globalSelfOverrides = {} } = (NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedThemeOverridesRef.value) || {};
      const { common: globalSelfCommonOverrides, peers: globalPeersOverrides = {} } = globalSelfOverrides;
      const mergedCommon = merge$1({}, selfCommon || globalSelfCommon || globalCommon || defaultTheme.common, globalCommonOverrides, globalSelfCommonOverrides, selfCommonOverrides);
      const mergedSelf = merge$1(
        (_a2 = self2 || globalSelf || defaultTheme.self) === null || _a2 === void 0 ? void 0 : _a2(mergedCommon),
        builtinOverrides,
        globalSelfOverrides,
        selfOverrides
      );
      return {
        common: mergedCommon,
        self: mergedSelf,
        peers: merge$1({}, defaultTheme.peers, globalPeers, peers),
        peerOverrides: merge$1({}, builtinOverrides.peers, globalPeersOverrides, peersOverrides)
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
    const NConfigProvider2 = vue.inject(configProviderInjectionKey, null);
    return {
      inlineThemeDisabled: NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.inlineThemeDisabled,
      mergedRtlRef: NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedRtlRef,
      mergedComponentPropsRef: NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedComponentPropsRef,
      mergedBreakpointsRef: NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedBreakpointsRef,
      mergedBorderedRef: vue.computed(() => {
        var _a2, _b;
        const { bordered } = props;
        if (bordered !== void 0)
          return bordered;
        return (_b = (_a2 = NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedBorderedRef.value) !== null && _a2 !== void 0 ? _a2 : options.defaultBordered) !== null && _b !== void 0 ? _b : true;
      }),
      mergedClsPrefixRef: vue.computed(() => {
        const clsPrefix = NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedClsPrefixRef.value;
        return clsPrefix || defaultClsPrefix;
      }),
      namespaceRef: vue.computed(() => NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedNamespaceRef.value)
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
      now: "Now"
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
      tipPrevious: "Previous picture (\u2190)",
      tipNext: "Next picture (\u2192)",
      tipCounterclockwise: "Counterclockwise",
      tipClockwise: "Clockwise",
      tipZoomOut: "Zoom out",
      tipZoomIn: "Zoom in",
      tipClose: "Close (Esc)",
      tipOriginalSize: "Zoom to original size"
    }
  };
  const enUS$1 = enUS;
  function buildFormatLongFn(args) {
    return function() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var width = options.width ? String(options.width) : args.defaultWidth;
      var format = args.formats[width] || args.formats[args.defaultWidth];
      return format;
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
    return function(string) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var width = options.width;
      var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
      var matchResult = string.match(matchPattern);
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
      var rest = string.slice(matchedString.length);
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
    return function(string) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var matchResult = string.match(args.matchPattern);
      if (!matchResult)
        return null;
      var matchedString = matchResult[0];
      var parseResult = string.match(args.parsePattern);
      if (!parseResult)
        return null;
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;
      var rest = string.slice(matchedString.length);
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
    const { mergedLocaleRef, mergedDateLocaleRef } = vue.inject(configProviderInjectionKey, null) || {};
    const localeRef = vue.computed(() => {
      var _a2, _b;
      return (_b = (_a2 = mergedLocaleRef === null || mergedLocaleRef === void 0 ? void 0 : mergedLocaleRef.value) === null || _a2 === void 0 ? void 0 : _a2[ns]) !== null && _b !== void 0 ? _b : enUS$1[ns];
    });
    const dateLocaleRef = vue.computed(() => {
      var _a2;
      return (_a2 = mergedDateLocaleRef === null || mergedDateLocaleRef === void 0 ? void 0 : mergedDateLocaleRef.value) !== null && _a2 !== void 0 ? _a2 : dateEnUS;
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
    const NConfigProvider2 = vue.inject(configProviderInjectionKey, null);
    const mountStyle = () => {
      const clsPrefix = clsPrefixRef === null || clsPrefixRef === void 0 ? void 0 : clsPrefixRef.value;
      style2.mount({
        id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
        },
        ssr: ssrAdapter2
      });
      if (!(NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.preflightStyleDisabled)) {
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
      vue.onBeforeMount(mountStyle);
    }
  }
  function useThemeClass(componentName, hashRef, cssVarsRef, props) {
    var _a2;
    if (!cssVarsRef)
      throwError("useThemeClass", "cssVarsRef is not passed");
    const mergedThemeHashRef = (_a2 = vue.inject(configProviderInjectionKey, null)) === null || _a2 === void 0 ? void 0 : _a2.mergedThemeHashRef;
    const themeClassRef = vue.ref("");
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
      const { themeOverrides, builtinThemeOverrides } = props;
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
    vue.watchEffect(() => {
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
    const componentRtlStateRef = vue.computed(() => {
      const { value: rtlState } = rtlStateRef;
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
      vue.watchEffect(() => {
        const { value: clsPrefix } = clsPrefixRef;
        const id = `${clsPrefix}${mountId}Rtl`;
        if (exists(id, ssrAdapter2))
          return;
        const { value: componentRtlState } = componentRtlStateRef;
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
      vue.onBeforeMount(mountStyle);
    }
    return componentRtlStateRef;
  }
  function replaceable(name, icon) {
    return vue.defineComponent({
      name: upperFirst$1(name),
      setup() {
        var _a2;
        const mergedIconsRef = (_a2 = vue.inject(configProviderInjectionKey, null)) === null || _a2 === void 0 ? void 0 : _a2.mergedIconsRef;
        return () => {
          var _a3;
          const iconOverride = (_a3 = mergedIconsRef === null || mergedIconsRef === void 0 ? void 0 : mergedIconsRef.value) === null || _a3 === void 0 ? void 0 : _a3[name];
          return iconOverride ? iconOverride() : icon;
        };
      }
    });
  }
  const ErrorIcon = replaceable("close", vue.h(
    "svg",
    { viewBox: "0 0 12 12", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true },
    vue.h(
      "g",
      { stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
      vue.h(
        "g",
        { fill: "currentColor", "fill-rule": "nonzero" },
        vue.h("path", { d: "M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z" })
      )
    )
  ));
  const EyeIcon = vue.defineComponent({
    name: "Eye",
    render() {
      return vue.h(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
        vue.h("path", { d: "M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z", fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "32" }),
        vue.h("circle", { cx: "256", cy: "256", r: "80", fill: "none", stroke: "currentColor", "stroke-miterlimit": "10", "stroke-width": "32" })
      );
    }
  });
  const EyeOffIcon = vue.defineComponent({
    name: "EyeOff",
    render() {
      return vue.h(
        "svg",
        { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
        vue.h("path", { d: "M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448z", fill: "currentColor" }),
        vue.h("path", { d: "M255.66 384c-41.49 0-81.5-12.28-118.92-36.5c-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 0 0 .14-2.94L93.5 161.38a2 2 0 0 0-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0 0 75.8-12.58a2 2 0 0 0 .77-3.31l-21.58-21.58a4 4 0 0 0-3.83-1a204.8 204.8 0 0 1-51.16 6.47z", fill: "currentColor" }),
        vue.h("path", { d: "M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 0 0-74.89 12.83a2 2 0 0 0-.75 3.31l21.55 21.55a4 4 0 0 0 3.88 1a192.82 192.82 0 0 1 50.21-6.69c40.69 0 80.58 12.43 118.55 37c34.71 22.4 65.74 53.88 89.76 91a.13.13 0 0 1 0 .16a310.72 310.72 0 0 1-64.12 72.73a2 2 0 0 0-.15 2.95l19.9 19.89a2 2 0 0 0 2.7.13a343.49 343.49 0 0 0 68.64-78.48a32.2 32.2 0 0 0-.1-34.78z", fill: "currentColor" }),
        vue.h("path", { d: "M256 160a95.88 95.88 0 0 0-21.37 2.4a2 2 0 0 0-1 3.38l112.59 112.56a2 2 0 0 0 3.38-1A96 96 0 0 0 256 160z", fill: "currentColor" }),
        vue.h("path", { d: "M165.78 233.66a2 2 0 0 0-3.38 1a96 96 0 0 0 115 115a2 2 0 0 0 1-3.38z", fill: "currentColor" })
      );
    }
  });
  const ChevronDownIcon = vue.defineComponent({
    name: "ChevronDown",
    render() {
      return vue.h(
        "svg",
        { viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        vue.h("path", { d: "M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z", fill: "currentColor" })
      );
    }
  });
  const ClearIcon = replaceable("clear", vue.h(
    "svg",
    { viewBox: "0 0 16 16", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
    vue.h(
      "g",
      { stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
      vue.h(
        "g",
        { fill: "currentColor", "fill-rule": "nonzero" },
        vue.h("path", { d: "M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M6.5343055,5.83859116 C6.33943736,5.70359511 6.07001296,5.72288026 5.89644661,5.89644661 L5.89644661,5.89644661 L5.83859116,5.9656945 C5.70359511,6.16056264 5.72288026,6.42998704 5.89644661,6.60355339 L5.89644661,6.60355339 L7.293,8 L5.89644661,9.39644661 L5.83859116,9.4656945 C5.70359511,9.66056264 5.72288026,9.92998704 5.89644661,10.1035534 L5.89644661,10.1035534 L5.9656945,10.1614088 C6.16056264,10.2964049 6.42998704,10.2771197 6.60355339,10.1035534 L6.60355339,10.1035534 L8,8.707 L9.39644661,10.1035534 L9.4656945,10.1614088 C9.66056264,10.2964049 9.92998704,10.2771197 10.1035534,10.1035534 L10.1035534,10.1035534 L10.1614088,10.0343055 C10.2964049,9.83943736 10.2771197,9.57001296 10.1035534,9.39644661 L10.1035534,9.39644661 L8.707,8 L10.1035534,6.60355339 L10.1614088,6.5343055 C10.2964049,6.33943736 10.2771197,6.07001296 10.1035534,5.89644661 L10.1035534,5.89644661 L10.0343055,5.83859116 C9.83943736,5.70359511 9.57001296,5.72288026 9.39644661,5.89644661 L9.39644661,5.89644661 L8,7.293 L6.60355339,5.89644661 Z" })
      )
    )
  ));
  const NIconSwitchTransition = vue.defineComponent({
    name: "BaseIconSwitchTransition",
    setup(_, { slots }) {
      const isMountedRef = isMounted();
      return () => vue.h(vue.Transition, { name: "icon-switch-transition", appear: isMountedRef.value }, slots);
    }
  });
  const NFadeInExpandTransition = vue.defineComponent({
    name: "FadeInExpandTransition",
    props: {
      appear: Boolean,
      group: Boolean,
      mode: String,
      onLeave: Function,
      onAfterLeave: Function,
      onAfterEnter: Function,
      width: Boolean,
      reverse: Boolean
    },
    setup(props, { slots }) {
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
        const { onLeave } = props;
        if (onLeave)
          onLeave();
      }
      function handleAfterLeave(el) {
        if (props.width) {
          el.style.maxWidth = "";
        } else {
          el.style.maxHeight = "";
        }
        const { onAfterLeave } = props;
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
        var _a2;
        if (props.width) {
          el.style.maxWidth = "";
        } else {
          if (!props.reverse) {
            el.style.maxHeight = "";
          }
        }
        (_a2 = props.onAfterEnter) === null || _a2 === void 0 ? void 0 : _a2.call(props);
      }
      return () => {
        const { group, width, appear, mode } = props;
        const type = group ? vue.TransitionGroup : vue.Transition;
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
        return vue.h(type, resolvedProps, slots);
      };
    }
  });
  const style$a = cB("base-icon", `
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
  const NBaseIcon = vue.defineComponent({
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
      useStyle("-base-icon", style$a, vue.toRef(props, "clsPrefix"));
    },
    render() {
      return vue.h("i", { class: `${this.clsPrefix}-base-icon`, onClick: this.onClick, onMousedown: this.onMousedown, onMouseup: this.onMouseup, role: this.role, "aria-label": this.ariaLabel, "aria-hidden": this.ariaHidden, "aria-disabled": this.ariaDisabled }, this.$slots);
    }
  });
  const style$9 = cB("base-close", `
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
  const NBaseClose = vue.defineComponent({
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
      useStyle("-base-close", style$9, vue.toRef(props, "clsPrefix"));
      return () => {
        const { clsPrefix, disabled, absolute, round, isButtonTag } = props;
        const Tag = isButtonTag ? "button" : "div";
        return vue.h(
          Tag,
          { type: isButtonTag ? "button" : void 0, tabindex: disabled || !props.focusable ? -1 : 0, "aria-disabled": disabled, "aria-label": "close", role: isButtonTag ? void 0 : "button", disabled, class: [
            `${clsPrefix}-base-close`,
            absolute && `${clsPrefix}-base-close--absolute`,
            disabled && `${clsPrefix}-base-close--disabled`,
            round && `${clsPrefix}-base-close--round`
          ], onMousedown: (e) => {
            if (!props.focusable) {
              e.preventDefault();
            }
          }, onClick: props.onClick },
          vue.h(NBaseIcon, { clsPrefix }, {
            default: () => vue.h(ErrorIcon, null)
          })
        );
      };
    }
  });
  const {
    cubicBezierEaseInOut: cubicBezierEaseInOut$2
  } = commonVariables$m;
  function iconSwitchTransition({
    originalTransform = "",
    left = 0,
    top = 0,
    transition = `all .3s ${cubicBezierEaseInOut$2} !important`
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
  const style$8 = c([c("@keyframes loading-container-rotate", `
 to {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }
 `), c("@keyframes loading-layer-rotate", `
 12.5% {
 -webkit-transform: rotate(135deg);
 transform: rotate(135deg);
 }
 25% {
 -webkit-transform: rotate(270deg);
 transform: rotate(270deg);
 }
 37.5% {
 -webkit-transform: rotate(405deg);
 transform: rotate(405deg);
 }
 50% {
 -webkit-transform: rotate(540deg);
 transform: rotate(540deg);
 }
 62.5% {
 -webkit-transform: rotate(675deg);
 transform: rotate(675deg);
 }
 75% {
 -webkit-transform: rotate(810deg);
 transform: rotate(810deg);
 }
 87.5% {
 -webkit-transform: rotate(945deg);
 transform: rotate(945deg);
 }
 100% {
 -webkit-transform: rotate(1080deg);
 transform: rotate(1080deg);
 } 
 `), c("@keyframes loading-left-spin", `
 from {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 50% {
 -webkit-transform: rotate(130deg);
 transform: rotate(130deg);
 }
 to {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 `), c("@keyframes loading-right-spin", `
 from {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 50% {
 -webkit-transform: rotate(-130deg);
 transform: rotate(-130deg);
 }
 to {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 `), cB("base-loading", `
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `, [cE("transition-wrapper", `
 position: absolute;
 width: 100%;
 height: 100%;
 `, [iconSwitchTransition()]), cE("container", `
 display: inline-flex;
 position: relative;
 direction: ltr;
 line-height: 0;
 animation: loading-container-rotate 1568.2352941176ms linear infinite;
 font-size: 0;
 letter-spacing: 0;
 white-space: nowrap;
 opacity: 1;
 width: 100%;
 height: 100%;
 `, [cE("svg", `
 stroke: var(--n-text-color);
 fill: transparent;
 position: absolute;
 height: 100%;
 overflow: hidden;
 `), cE("container-layer", `
 position: absolute;
 width: 100%;
 height: 100%;
 animation: loading-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 `, [cE("container-layer-left", `
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `, [cE("svg", `
 animation: loading-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 width: 200%;
 `)]), cE("container-layer-patch", `
 position: absolute;
 top: 0;
 left: 47.5%;
 box-sizing: border-box;
 width: 5%;
 height: 100%;
 overflow: hidden;
 `, [cE("svg", `
 left: -900%;
 width: 2000%;
 transform: rotate(180deg);
 `)]), cE("container-layer-right", `
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `, [cE("svg", `
 animation: loading-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 left: -100%;
 width: 200%;
 `)])])]), cE("placeholder", `
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `, [iconSwitchTransition({
    left: "50%",
    top: "50%",
    originalTransform: "translateX(-50%) translateY(-50%)"
  })])])]);
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
  const NBaseLoading = vue.defineComponent({
    name: "BaseLoading",
    props: Object.assign({ clsPrefix: {
      type: String,
      required: true
    }, show: {
      type: Boolean,
      default: true
    }, scale: {
      type: Number,
      default: 1
    }, radius: {
      type: Number,
      default: 100
    } }, exposedLoadingProps),
    setup(props) {
      useStyle("-base-loading", style$8, vue.toRef(props, "clsPrefix"));
    },
    render() {
      const { clsPrefix, radius, strokeWidth, stroke, scale } = this;
      const scaledRadius = radius / scale;
      return vue.h(
        "div",
        { class: `${clsPrefix}-base-loading`, role: "img", "aria-label": "loading" },
        vue.h(NIconSwitchTransition, null, {
          default: () => this.show ? vue.h(
            "div",
            { key: "icon", class: `${clsPrefix}-base-loading__transition-wrapper` },
            vue.h(
              "div",
              { class: `${clsPrefix}-base-loading__container` },
              vue.h(
                "div",
                { class: `${clsPrefix}-base-loading__container-layer` },
                vue.h(
                  "div",
                  { class: `${clsPrefix}-base-loading__container-layer-left` },
                  vue.h(
                    "svg",
                    { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } },
                    vue.h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius })
                  )
                ),
                vue.h(
                  "div",
                  { class: `${clsPrefix}-base-loading__container-layer-patch` },
                  vue.h(
                    "svg",
                    { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } },
                    vue.h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius })
                  )
                ),
                vue.h(
                  "div",
                  { class: `${clsPrefix}-base-loading__container-layer-right` },
                  vue.h(
                    "svg",
                    { class: `${clsPrefix}-base-loading__svg`, viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`, xmlns: "http://www.w3.org/2000/svg", style: { color: stroke } },
                    vue.h("circle", { fill: "none", stroke: "currentColor", "stroke-width": strokeWidth, "stroke-linecap": "round", cx: scaledRadius, cy: scaledRadius, r: radius - strokeWidth / 2, "stroke-dasharray": 4.91 * radius, "stroke-dashoffset": 2.46 * radius })
                  )
                )
              )
            )
          ) : vue.h("div", { key: "placeholder", class: `${clsPrefix}-base-loading__placeholder` }, this.$slots)
        })
      );
    }
  });
  const base$1 = {
    neutralBase: "#000",
    neutralInvertBase: "#fff",
    neutralTextBase: "#fff",
    neutralPopover: "rgb(72, 72, 78)",
    neutralCard: "rgb(24, 24, 28)",
    neutralModal: "rgb(44, 44, 50)",
    neutralBody: "rgb(16, 16, 20)",
    alpha1: "0.9",
    alpha2: "0.82",
    alpha3: "0.52",
    alpha4: "0.38",
    alpha5: "0.28",
    alphaClose: "0.52",
    alphaDisabled: "0.38",
    alphaDisabledInput: "0.06",
    alphaPending: "0.09",
    alphaTablePending: "0.06",
    alphaTableStriped: "0.05",
    alphaPressed: "0.05",
    alphaAvatar: "0.18",
    alphaRail: "0.2",
    alphaProgressRail: "0.12",
    alphaBorder: "0.24",
    alphaDivider: "0.09",
    alphaInput: "0.1",
    alphaAction: "0.06",
    alphaTab: "0.04",
    alphaScrollbar: "0.2",
    alphaScrollbarHover: "0.3",
    alphaCode: "0.12",
    alphaTag: "0.2",
    primaryHover: "#7fe7c4",
    primaryDefault: "#63e2b7",
    primaryActive: "#5acea7",
    primarySuppl: "rgb(42, 148, 125)",
    infoHover: "#8acbec",
    infoDefault: "#70c0e8",
    infoActive: "#66afd3",
    infoSuppl: "rgb(56, 137, 197)",
    errorHover: "#e98b8b",
    errorDefault: "#e88080",
    errorActive: "#e57272",
    errorSuppl: "rgb(208, 58, 82)",
    warningHover: "#f5d599",
    warningDefault: "#f2c97d",
    warningActive: "#e6c260",
    warningSuppl: "rgb(240, 138, 0)",
    successHover: "#7fe7c4",
    successDefault: "#63e2b7",
    successActive: "#5acea7",
    successSuppl: "rgb(42, 148, 125)"
  };
  const baseBackgroundRgb$1 = rgba(base$1.neutralBase);
  const baseInvertBackgroundRgb$1 = rgba(base$1.neutralInvertBase);
  const overlayPrefix$1 = "rgba(" + baseInvertBackgroundRgb$1.slice(0, 3).join(", ") + ", ";
  function overlay$1(alpha) {
    return overlayPrefix$1 + String(alpha) + ")";
  }
  function neutral$1(alpha) {
    const overlayRgba = Array.from(baseInvertBackgroundRgb$1);
    overlayRgba[3] = Number(alpha);
    return composite(baseBackgroundRgb$1, overlayRgba);
  }
  const derived$1 = Object.assign(Object.assign({ name: "common" }, commonVariables$m), {
    baseColor: base$1.neutralBase,
    primaryColor: base$1.primaryDefault,
    primaryColorHover: base$1.primaryHover,
    primaryColorPressed: base$1.primaryActive,
    primaryColorSuppl: base$1.primarySuppl,
    infoColor: base$1.infoDefault,
    infoColorHover: base$1.infoHover,
    infoColorPressed: base$1.infoActive,
    infoColorSuppl: base$1.infoSuppl,
    successColor: base$1.successDefault,
    successColorHover: base$1.successHover,
    successColorPressed: base$1.successActive,
    successColorSuppl: base$1.successSuppl,
    warningColor: base$1.warningDefault,
    warningColorHover: base$1.warningHover,
    warningColorPressed: base$1.warningActive,
    warningColorSuppl: base$1.warningSuppl,
    errorColor: base$1.errorDefault,
    errorColorHover: base$1.errorHover,
    errorColorPressed: base$1.errorActive,
    errorColorSuppl: base$1.errorSuppl,
    textColorBase: base$1.neutralTextBase,
    textColor1: overlay$1(base$1.alpha1),
    textColor2: overlay$1(base$1.alpha2),
    textColor3: overlay$1(base$1.alpha3),
    textColorDisabled: overlay$1(base$1.alpha4),
    placeholderColor: overlay$1(base$1.alpha4),
    placeholderColorDisabled: overlay$1(base$1.alpha5),
    iconColor: overlay$1(base$1.alpha4),
    iconColorDisabled: overlay$1(base$1.alpha5),
    iconColorHover: overlay$1(Number(base$1.alpha4) * 1.25),
    iconColorPressed: overlay$1(Number(base$1.alpha4) * 0.8),
    opacity1: base$1.alpha1,
    opacity2: base$1.alpha2,
    opacity3: base$1.alpha3,
    opacity4: base$1.alpha4,
    opacity5: base$1.alpha5,
    dividerColor: overlay$1(base$1.alphaDivider),
    borderColor: overlay$1(base$1.alphaBorder),
    closeIconColorHover: overlay$1(Number(base$1.alphaClose)),
    closeIconColor: overlay$1(Number(base$1.alphaClose)),
    closeIconColorPressed: overlay$1(Number(base$1.alphaClose)),
    closeColorHover: "rgba(255, 255, 255, .12)",
    closeColorPressed: "rgba(255, 255, 255, .08)",
    clearColor: overlay$1(base$1.alpha4),
    clearColorHover: scaleColor(overlay$1(base$1.alpha4), { alpha: 1.25 }),
    clearColorPressed: scaleColor(overlay$1(base$1.alpha4), { alpha: 0.8 }),
    scrollbarColor: overlay$1(base$1.alphaScrollbar),
    scrollbarColorHover: overlay$1(base$1.alphaScrollbarHover),
    scrollbarWidth: "5px",
    scrollbarHeight: "5px",
    scrollbarBorderRadius: "5px",
    progressRailColor: overlay$1(base$1.alphaProgressRail),
    railColor: overlay$1(base$1.alphaRail),
    popoverColor: base$1.neutralPopover,
    tableColor: base$1.neutralCard,
    cardColor: base$1.neutralCard,
    modalColor: base$1.neutralModal,
    bodyColor: base$1.neutralBody,
    tagColor: neutral$1(base$1.alphaTag),
    avatarColor: overlay$1(base$1.alphaAvatar),
    invertedColor: base$1.neutralBase,
    inputColor: overlay$1(base$1.alphaInput),
    codeColor: overlay$1(base$1.alphaCode),
    tabColor: overlay$1(base$1.alphaTab),
    actionColor: overlay$1(base$1.alphaAction),
    tableHeaderColor: overlay$1(base$1.alphaAction),
    hoverColor: overlay$1(base$1.alphaPending),
    tableColorHover: overlay$1(base$1.alphaTablePending),
    tableColorStriped: overlay$1(base$1.alphaTableStriped),
    pressedColor: overlay$1(base$1.alphaPressed),
    opacityDisabled: base$1.alphaDisabled,
    inputColorDisabled: overlay$1(base$1.alphaDisabledInput),
    buttonColor2: "rgba(255, 255, 255, .08)",
    buttonColor2Hover: "rgba(255, 255, 255, .12)",
    buttonColor2Pressed: "rgba(255, 255, 255, .08)",
    boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)",
    boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10)",
    boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
  });
  const commonDark = derived$1;
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
    alpha5: "0.18",
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
    primaryHover: "#36ad6a",
    primaryDefault: "#18a058",
    primaryActive: "#0c7a43",
    primarySuppl: "#36ad6a",
    infoHover: "#4098fc",
    infoDefault: "#2080f0",
    infoActive: "#1060c9",
    infoSuppl: "#4098fc",
    errorHover: "#de576d",
    errorDefault: "#d03050",
    errorActive: "#ab1f3f",
    errorSuppl: "#de576d",
    warningHover: "#fcb040",
    warningDefault: "#f0a020",
    warningActive: "#c97c10",
    warningSuppl: "#fcb040",
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
  const derived = Object.assign(Object.assign({ name: "common" }, commonVariables$m), {
    baseColor: base.neutralBase,
    primaryColor: base.primaryDefault,
    primaryColorHover: base.primaryHover,
    primaryColorPressed: base.primaryActive,
    primaryColorSuppl: base.primarySuppl,
    infoColor: base.infoDefault,
    infoColorHover: base.infoHover,
    infoColorPressed: base.infoActive,
    infoColorSuppl: base.infoSuppl,
    successColor: base.successDefault,
    successColorHover: base.successHover,
    successColorPressed: base.successActive,
    successColorSuppl: base.successSuppl,
    warningColor: base.warningDefault,
    warningColorHover: base.warningHover,
    warningColorPressed: base.warningActive,
    warningColorSuppl: base.warningSuppl,
    errorColor: base.errorDefault,
    errorColorHover: base.errorHover,
    errorColorPressed: base.errorActive,
    errorColorSuppl: base.errorSuppl,
    textColorBase: base.neutralTextBase,
    textColor1: "rgb(31, 34, 37)",
    textColor2: "rgb(51, 54, 57)",
    textColor3: "rgb(118, 124, 130)",
    textColorDisabled: neutral(base.alpha4),
    placeholderColor: neutral(base.alpha4),
    placeholderColorDisabled: neutral(base.alpha5),
    iconColor: neutral(base.alpha4),
    iconColorHover: scaleColor(neutral(base.alpha4), { lightness: 0.75 }),
    iconColorPressed: scaleColor(neutral(base.alpha4), { lightness: 0.9 }),
    iconColorDisabled: neutral(base.alpha5),
    opacity1: base.alpha1,
    opacity2: base.alpha2,
    opacity3: base.alpha3,
    opacity4: base.alpha4,
    opacity5: base.alpha5,
    dividerColor: "rgb(239, 239, 245)",
    borderColor: "rgb(224, 224, 230)",
    closeIconColor: neutral(Number(base.alphaClose)),
    closeIconColorHover: neutral(Number(base.alphaClose)),
    closeIconColorPressed: neutral(Number(base.alphaClose)),
    closeColorHover: "rgba(0, 0, 0, .09)",
    closeColorPressed: "rgba(0, 0, 0, .13)",
    clearColor: neutral(base.alpha4),
    clearColorHover: scaleColor(neutral(base.alpha4), { lightness: 0.75 }),
    clearColorPressed: scaleColor(neutral(base.alpha4), { lightness: 0.9 }),
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
    tableColorHover: "rgba(0, 0, 100, 0.03)",
    tableColorStriped: "rgba(0, 0, 100, 0.02)",
    pressedColor: "rgb(237, 237, 239)",
    opacityDisabled: base.alphaDisabled,
    inputColorDisabled: "rgb(250, 250, 252)",
    buttonColor2: "rgba(46, 51, 56, .05)",
    buttonColor2Hover: "rgba(46, 51, 56, .09)",
    buttonColor2Pressed: "rgba(46, 51, 56, .13)",
    boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
    boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
    boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
  });
  const commonLight = derived;
  const commonVars$c = {
    iconSizeSmall: "34px",
    iconSizeMedium: "40px",
    iconSizeLarge: "46px",
    iconSizeHuge: "52px"
  };
  const self$Q = (vars) => {
    const { textColorDisabled, iconColor, textColor2, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge } = vars;
    return Object.assign(Object.assign({}, commonVars$c), {
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      fontSizeHuge,
      textColor: textColorDisabled,
      iconColor,
      extraTextColor: textColor2
    });
  };
  const emptyLight = {
    name: "Empty",
    common: commonLight,
    self: self$Q
  };
  const emptyLight$1 = emptyLight;
  const emptyDark = {
    name: "Empty",
    common: commonDark,
    self: self$Q
  };
  const emptyDark$1 = emptyDark;
  const self$P = (vars) => {
    const { scrollbarColor, scrollbarColorHover } = vars;
    return {
      color: scrollbarColor,
      colorHover: scrollbarColorHover
    };
  };
  const scrollbarLight = {
    name: "Scrollbar",
    common: commonLight,
    self: self$P
  };
  const scrollbarLight$1 = scrollbarLight;
  const scrollbarDark = {
    name: "Scrollbar",
    common: commonDark,
    self: self$P
  };
  const scrollbarDark$1 = scrollbarDark;
  const {
    cubicBezierEaseInOut: cubicBezierEaseInOut$1
  } = commonVariables$m;
  function fadeInTransition({
    name = "fade-in",
    enterDuration = "0.2s",
    leaveDuration = "0.2s",
    enterCubicBezier = cubicBezierEaseInOut$1,
    leaveCubicBezier = cubicBezierEaseInOut$1
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
  const style$7 = cB("scrollbar", `
 overflow: hidden;
 position: relative;
 z-index: auto;
 height: 100%;
 width: 100%;
`, [c(">", [cB("scrollbar-container", `
 width: 100%;
 overflow: scroll;
 height: 100%;
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
 `)])]), cM("disabled", [c(">", [cE("scrollbar", {
    pointerEvents: "none"
  })])]), c(">", [cE("scrollbar", `
 position: absolute;
 cursor: pointer;
 pointer-events: all;
 background-color: var(--n-scrollbar-color);
 transition: background-color .2s var(--n-scrollbar-bezier);
 `, [fadeInTransition(), c("&:hover", {
    backgroundColor: "var(--n-scrollbar-color-hover)"
  })])])])])]);
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
    container: Function,
    content: Function,
    containerClass: String,
    containerStyle: [String, Object],
    contentClass: String,
    contentStyle: [String, Object],
    horizontalRailStyle: [String, Object],
    verticalRailStyle: [String, Object],
    onScroll: Function,
    onWheel: Function,
    onResize: Function,
    internalOnUpdateScrollLeft: Function,
    internalHoistYRail: Boolean
  });
  const Scrollbar = vue.defineComponent({
    name: "Scrollbar",
    props: scrollbarProps,
    inheritAttrs: false,
    setup(props) {
      const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = useConfig(props);
      const rtlEnabledRef = useRtl("Scrollbar", mergedRtlRef, mergedClsPrefixRef);
      const wrapperRef = vue.ref(null);
      const containerRef = vue.ref(null);
      const contentRef = vue.ref(null);
      const yRailRef = vue.ref(null);
      const xRailRef = vue.ref(null);
      const contentHeightRef = vue.ref(null);
      const contentWidthRef = vue.ref(null);
      const containerHeightRef = vue.ref(null);
      const containerWidthRef = vue.ref(null);
      const yRailSizeRef = vue.ref(null);
      const xRailSizeRef = vue.ref(null);
      const containerScrollTopRef = vue.ref(0);
      const containerScrollLeftRef = vue.ref(0);
      const isShowXBarRef = vue.ref(false);
      const isShowYBarRef = vue.ref(false);
      let yBarPressed = false;
      let xBarPressed = false;
      let xBarVanishTimerId;
      let yBarVanishTimerId;
      let memoYTop = 0;
      let memoXLeft = 0;
      let memoMouseX = 0;
      let memoMouseY = 0;
      const isIos2 = useIsIos();
      const yBarSizeRef = vue.computed(() => {
        const { value: containerHeight } = containerHeightRef;
        const { value: contentHeight } = contentHeightRef;
        const { value: yRailSize } = yRailSizeRef;
        if (containerHeight === null || contentHeight === null || yRailSize === null) {
          return 0;
        } else {
          return Math.min(containerHeight, yRailSize * containerHeight / contentHeight + props.size * 1.5);
        }
      });
      const yBarSizePxRef = vue.computed(() => {
        return `${yBarSizeRef.value}px`;
      });
      const xBarSizeRef = vue.computed(() => {
        const { value: containerWidth } = containerWidthRef;
        const { value: contentWidth } = contentWidthRef;
        const { value: xRailSize } = xRailSizeRef;
        if (containerWidth === null || contentWidth === null || xRailSize === null) {
          return 0;
        } else {
          return xRailSize * containerWidth / contentWidth + props.size * 1.5;
        }
      });
      const xBarSizePxRef = vue.computed(() => {
        return `${xBarSizeRef.value}px`;
      });
      const yBarTopRef = vue.computed(() => {
        const { value: containerHeight } = containerHeightRef;
        const { value: containerScrollTop } = containerScrollTopRef;
        const { value: contentHeight } = contentHeightRef;
        const { value: yRailSize } = yRailSizeRef;
        if (containerHeight === null || contentHeight === null || yRailSize === null) {
          return 0;
        } else {
          const heightDiff = contentHeight - containerHeight;
          if (!heightDiff)
            return 0;
          return containerScrollTop / heightDiff * (yRailSize - yBarSizeRef.value);
        }
      });
      const yBarTopPxRef = vue.computed(() => {
        return `${yBarTopRef.value}px`;
      });
      const xBarLeftRef = vue.computed(() => {
        const { value: containerWidth } = containerWidthRef;
        const { value: containerScrollLeft } = containerScrollLeftRef;
        const { value: contentWidth } = contentWidthRef;
        const { value: xRailSize } = xRailSizeRef;
        if (containerWidth === null || contentWidth === null || xRailSize === null) {
          return 0;
        } else {
          const widthDiff = contentWidth - containerWidth;
          if (!widthDiff)
            return 0;
          return containerScrollLeft / widthDiff * (xRailSize - xBarSizeRef.value);
        }
      });
      const xBarLeftPxRef = vue.computed(() => {
        return `${xBarLeftRef.value}px`;
      });
      const needYBarRef = vue.computed(() => {
        const { value: containerHeight } = containerHeightRef;
        const { value: contentHeight } = contentHeightRef;
        return containerHeight !== null && contentHeight !== null && contentHeight > containerHeight;
      });
      const needXBarRef = vue.computed(() => {
        const { value: containerWidth } = containerWidthRef;
        const { value: contentWidth } = contentWidthRef;
        return containerWidth !== null && contentWidth !== null && contentWidth > containerWidth;
      });
      const mergedShowXBarRef = vue.computed(() => {
        const { trigger: trigger2 } = props;
        return trigger2 === "none" || isShowXBarRef.value;
      });
      const mergedShowYBarRef = vue.computed(() => {
        const { trigger: trigger2 } = props;
        return trigger2 === "none" || isShowYBarRef.value;
      });
      const mergedContainerRef = vue.computed(() => {
        const { container } = props;
        if (container)
          return container();
        return containerRef.value;
      });
      const mergedContentRef = vue.computed(() => {
        const { content } = props;
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
        const { onResize } = props;
        if (onResize)
          onResize(e);
        sync();
      };
      const scrollTo = (options, y) => {
        if (!props.scrollable)
          return;
        if (typeof options === "number") {
          scrollToPosition(y !== null && y !== void 0 ? y : 0, options, 0, false, "auto");
          return;
        }
        const { left, top, index, elSize, position, behavior, el, debounce = true } = options;
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
        const { value: container } = mergedContainerRef;
        if (!container)
          return;
        if (typeof options === "object") {
          container.scrollBy(options);
        } else {
          container.scrollBy(options, y || 0);
        }
      };
      function scrollToPosition(left, top, elSize, debounce, behavior) {
        const { value: container } = mergedContainerRef;
        if (!container)
          return;
        if (debounce) {
          const { scrollTop, offsetHeight } = container;
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
        const { onScroll } = props;
        if (onScroll)
          onScroll(e);
        syncScrollState();
      }
      function syncScrollState() {
        const { value: container } = mergedContainerRef;
        if (container) {
          containerScrollTopRef.value = container.scrollTop;
          containerScrollLeftRef.value = container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
        }
      }
      function syncPositionState() {
        const { value: content } = mergedContentRef;
        if (content) {
          contentHeightRef.value = content.offsetHeight;
          contentWidthRef.value = content.offsetWidth;
        }
        const { value: container } = mergedContainerRef;
        if (container) {
          containerHeightRef.value = container.offsetHeight;
          containerWidthRef.value = container.offsetWidth;
        }
        const { value: xRailEl } = xRailRef;
        const { value: yRailEl } = yRailRef;
        if (xRailEl) {
          xRailSizeRef.value = xRailEl.offsetWidth;
        }
        if (yRailEl) {
          yRailSizeRef.value = yRailEl.offsetHeight;
        }
      }
      function syncUnifiedContainer() {
        const { value: container } = mergedContainerRef;
        if (container) {
          containerScrollTopRef.value = container.scrollTop;
          containerScrollLeftRef.value = container.scrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
          containerHeightRef.value = container.offsetHeight;
          containerWidthRef.value = container.offsetWidth;
          contentHeightRef.value = container.scrollHeight;
          contentWidthRef.value = container.scrollWidth;
        }
        const { value: xRailEl } = xRailRef;
        const { value: yRailEl } = yRailRef;
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
        var _a2;
        return !((_a2 = wrapperRef.value) === null || _a2 === void 0 ? void 0 : _a2.contains(getPreciseEventTarget(e)));
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
        const { value: containerWidth } = containerWidthRef;
        const { value: contentWidth } = contentWidthRef;
        const { value: xBarSize } = xBarSizeRef;
        if (containerWidth === null || contentWidth === null)
          return;
        const dX = (rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? window.innerWidth - e.clientX - memoMouseX : e.clientX - memoMouseX;
        const dScrollLeft = dX * (contentWidth - containerWidth) / (containerWidth - xBarSize);
        const toScrollLeftUpperBound = contentWidth - containerWidth;
        let toScrollLeft = memoXLeft + dScrollLeft;
        toScrollLeft = Math.min(toScrollLeftUpperBound, toScrollLeft);
        toScrollLeft = Math.max(toScrollLeft, 0);
        const { value: container } = mergedContainerRef;
        if (container) {
          container.scrollLeft = toScrollLeft * ((rtlEnabledRef === null || rtlEnabledRef === void 0 ? void 0 : rtlEnabledRef.value) ? -1 : 1);
          const { internalOnUpdateScrollLeft } = props;
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
        const { value: containerHeight } = containerHeightRef;
        const { value: contentHeight } = contentHeightRef;
        const { value: yBarSize } = yBarSizeRef;
        if (containerHeight === null || contentHeight === null)
          return;
        const dY = e.clientY - memoMouseY;
        const dScrollTop = dY * (contentHeight - containerHeight) / (containerHeight - yBarSize);
        const toScrollTopUpperBound = contentHeight - containerHeight;
        let toScrollTop = memoYTop + dScrollTop;
        toScrollTop = Math.min(toScrollTopUpperBound, toScrollTop);
        toScrollTop = Math.max(toScrollTop, 0);
        const { value: container } = mergedContainerRef;
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
      vue.watchEffect(() => {
        const { value: needXBar } = needXBarRef;
        const { value: needYBar } = needYBarRef;
        const { value: mergedClsPrefix } = mergedClsPrefixRef;
        const { value: xRailEl } = xRailRef;
        const { value: yRailEl } = yRailRef;
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
      vue.onMounted(() => {
        if (props.container)
          return;
        sync();
      });
      vue.onBeforeUnmount(() => {
        if (xBarVanishTimerId !== void 0) {
          window.clearTimeout(xBarVanishTimerId);
        }
        if (yBarVanishTimerId !== void 0) {
          window.clearTimeout(yBarVanishTimerId);
        }
        off("mousemove", window, handleYScrollMouseMove, true);
        off("mouseup", window, handleYScrollMouseUp, true);
      });
      const themeRef = useTheme("Scrollbar", "-scrollbar", style$7, scrollbarLight$1, props, mergedClsPrefixRef);
      const cssVarsRef = vue.computed(() => {
        const { common: { cubicBezierEaseInOut: cubicBezierEaseInOut2, scrollbarBorderRadius, scrollbarHeight, scrollbarWidth }, self: { color, colorHover } } = themeRef.value;
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
      var _a2;
      const { $slots, mergedClsPrefix, triggerDisplayManually, rtlEnabled, internalHoistYRail } = this;
      if (!this.scrollable)
        return (_a2 = $slots.default) === null || _a2 === void 0 ? void 0 : _a2.call($slots);
      const triggerIsNone = this.trigger === "none";
      const createYRail = () => {
        return vue.h("div", { ref: "yRailRef", class: [
          `${mergedClsPrefix}-scrollbar-rail`,
          `${mergedClsPrefix}-scrollbar-rail--vertical`
        ], "data-scrollbar-rail": true, style: this.verticalRailStyle, "aria-hidden": true }, vue.h(triggerIsNone ? Wrapper : vue.Transition, triggerIsNone ? null : { name: "fade-in-transition" }, {
          default: () => this.needYBar && this.isShowYBar && !this.isIos ? vue.h("div", { class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`, style: {
            height: this.yBarSizePx,
            top: this.yBarTopPx
          }, onMousedown: this.handleYScrollMouseDown }) : null
        }));
      };
      const createChildren = () => {
        var _a3, _b;
        (_a3 = this.onRender) === null || _a3 === void 0 ? void 0 : _a3.call(this);
        return vue.h("div", vue.mergeProps(this.$attrs, {
          role: "none",
          ref: "wrapperRef",
          class: [
            `${mergedClsPrefix}-scrollbar`,
            this.themeClass,
            rtlEnabled && `${mergedClsPrefix}-scrollbar--rtl`
          ],
          style: this.cssVars,
          onMouseenter: triggerDisplayManually ? void 0 : this.handleMouseEnterWrapper,
          onMouseleave: triggerDisplayManually ? void 0 : this.handleMouseLeaveWrapper
        }), [
          this.container ? (_b = $slots.default) === null || _b === void 0 ? void 0 : _b.call($slots) : vue.h(
            "div",
            { role: "none", ref: "containerRef", class: [
              `${mergedClsPrefix}-scrollbar-container`,
              this.containerClass
            ], style: this.containerStyle, onScroll: this.handleScroll, onWheel: this.onWheel },
            vue.h(VResizeObserver, { onResize: this.handleContentResize }, {
              default: () => vue.h("div", { ref: "contentRef", role: "none", style: [
                {
                  width: this.xScrollable ? "fit-content" : null
                },
                this.contentStyle
              ], class: [
                `${mergedClsPrefix}-scrollbar-content`,
                this.contentClass
              ] }, $slots)
            })
          ),
          internalHoistYRail ? null : createYRail(),
          this.xScrollable && vue.h("div", { ref: "xRailRef", class: [
            `${mergedClsPrefix}-scrollbar-rail`,
            `${mergedClsPrefix}-scrollbar-rail--horizontal`
          ], style: this.horizontalRailStyle, "data-scrollbar-rail": true, "aria-hidden": true }, vue.h(triggerIsNone ? Wrapper : vue.Transition, triggerIsNone ? null : { name: "fade-in-transition" }, {
            default: () => this.needXBar && this.isShowXBar && !this.isIos ? vue.h("div", { class: `${mergedClsPrefix}-scrollbar-rail__scrollbar`, style: {
              width: this.xBarSizePx,
              right: rtlEnabled ? this.xBarLeftPx : void 0,
              left: rtlEnabled ? void 0 : this.xBarLeftPx
            }, onMousedown: this.handleXScrollMouseDown }) : null
          }))
        ]);
      };
      const scrollbarNode = this.container ? createChildren() : vue.h(VResizeObserver, { onResize: this.handleContainerResize }, {
        default: createChildren
      });
      if (internalHoistYRail) {
        return vue.h(
          vue.Fragment,
          null,
          scrollbarNode,
          createYRail()
        );
      } else {
        return scrollbarNode;
      }
    }
  });
  const NScrollbar = Scrollbar;
  const commonVariables$l = {
    height: "calc(var(--n-option-height) * 7.6)",
    paddingSmall: "4px 0",
    paddingMedium: "4px 0",
    paddingLarge: "4px 0",
    paddingHuge: "4px 0",
    optionPaddingSmall: "0 12px",
    optionPaddingMedium: "0 12px",
    optionPaddingLarge: "0 12px",
    optionPaddingHuge: "0 12px",
    loadingSize: "18px"
  };
  const self$O = (vars) => {
    const { borderRadius, popoverColor, textColor3, dividerColor, textColor2, primaryColorPressed, textColorDisabled, primaryColor, opacityDisabled, hoverColor, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge, heightSmall, heightMedium, heightLarge, heightHuge } = vars;
    return Object.assign(Object.assign({}, commonVariables$l), { optionFontSizeSmall: fontSizeSmall, optionFontSizeMedium: fontSizeMedium, optionFontSizeLarge: fontSizeLarge, optionFontSizeHuge: fontSizeHuge, optionHeightSmall: heightSmall, optionHeightMedium: heightMedium, optionHeightLarge: heightLarge, optionHeightHuge: heightHuge, borderRadius, color: popoverColor, groupHeaderTextColor: textColor3, actionDividerColor: dividerColor, optionTextColor: textColor2, optionTextColorPressed: primaryColorPressed, optionTextColorDisabled: textColorDisabled, optionTextColorActive: primaryColor, optionOpacityDisabled: opacityDisabled, optionCheckColor: primaryColor, optionColorPending: hoverColor, optionColorActive: "rgba(0, 0, 0, 0)", optionColorActivePending: hoverColor, actionTextColor: textColor2, loadingColor: primaryColor });
  };
  const internalSelectMenuDark = {
    name: "InternalSelectMenu",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1,
      Empty: emptyDark$1
    },
    self: self$O
  };
  const internalSelectMenuDark$1 = internalSelectMenuDark;
  const style$6 = cB("base-wave", `
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`);
  const NBaseWave = vue.defineComponent({
    name: "BaseWave",
    props: {
      clsPrefix: {
        type: String,
        required: true
      }
    },
    setup(props) {
      useStyle("-base-wave", style$6, vue.toRef(props, "clsPrefix"));
      const selfRef = vue.ref(null);
      const activeRef = vue.ref(false);
      let animationTimerId = null;
      vue.onBeforeUnmount(() => {
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
          void vue.nextTick(() => {
            var _a2;
            void ((_a2 = selfRef.value) === null || _a2 === void 0 ? void 0 : _a2.offsetHeight);
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
      const { clsPrefix } = this;
      return vue.h("div", { ref: "selfRef", "aria-hidden": true, class: [
        `${clsPrefix}-base-wave`,
        this.active && `${clsPrefix}-base-wave--active`
      ] });
    }
  });
  const commonVariables$k = {
    space: "6px",
    spaceArrow: "10px",
    arrowOffset: "10px",
    arrowOffsetVertical: "10px",
    arrowHeight: "6px",
    padding: "8px 14px"
  };
  const self$N = (vars) => {
    const { boxShadow2, popoverColor, textColor2, borderRadius, fontSize: fontSize2, dividerColor } = vars;
    return Object.assign(Object.assign({}, commonVariables$k), {
      fontSize: fontSize2,
      borderRadius,
      color: popoverColor,
      dividerColor,
      textColor: textColor2,
      boxShadow: boxShadow2
    });
  };
  const popoverDark = {
    name: "Popover",
    common: commonDark,
    self: self$N
  };
  const popoverDark$1 = popoverDark;
  const commonVariables$j = {
    closeIconSizeTiny: "12px",
    closeIconSizeSmall: "12px",
    closeIconSizeMedium: "14px",
    closeIconSizeLarge: "14px",
    closeSizeTiny: "16px",
    closeSizeSmall: "16px",
    closeSizeMedium: "18px",
    closeSizeLarge: "18px",
    padding: "0 7px",
    closeMargin: "0 0 0 4px",
    closeMarginRtl: "0 4px 0 0"
  };
  const tagDark = {
    name: "Tag",
    common: commonDark,
    self(vars) {
      const { textColor2, primaryColorHover, primaryColorPressed, primaryColor, infoColor, successColor, warningColor, errorColor, baseColor, borderColor, tagColor, opacityDisabled, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, borderRadiusSmall: borderRadius, fontSizeMini, fontSizeTiny, fontSizeSmall, fontSizeMedium, heightMini, heightTiny, heightSmall, heightMedium, buttonColor2Hover, buttonColor2Pressed, fontWeightStrong } = vars;
      return Object.assign(Object.assign({}, commonVariables$j), {
        closeBorderRadius: borderRadius,
        heightTiny: heightMini,
        heightSmall: heightTiny,
        heightMedium: heightSmall,
        heightLarge: heightMedium,
        borderRadius,
        opacityDisabled,
        fontSizeTiny: fontSizeMini,
        fontSizeSmall: fontSizeTiny,
        fontSizeMedium: fontSizeSmall,
        fontSizeLarge: fontSizeMedium,
        fontWeightStrong,
        textColorCheckable: textColor2,
        textColorHoverCheckable: textColor2,
        textColorPressedCheckable: textColor2,
        textColorChecked: baseColor,
        colorCheckable: "#0000",
        colorHoverCheckable: buttonColor2Hover,
        colorPressedCheckable: buttonColor2Pressed,
        colorChecked: primaryColor,
        colorCheckedHover: primaryColorHover,
        colorCheckedPressed: primaryColorPressed,
        border: `1px solid ${borderColor}`,
        textColor: textColor2,
        color: tagColor,
        colorBordered: "#0000",
        closeIconColor,
        closeIconColorHover,
        closeIconColorPressed,
        closeColorHover,
        closeColorPressed,
        borderPrimary: `1px solid ${changeColor(primaryColor, { alpha: 0.3 })}`,
        textColorPrimary: primaryColor,
        colorPrimary: changeColor(primaryColor, { alpha: 0.16 }),
        colorBorderedPrimary: "#0000",
        closeIconColorPrimary: scaleColor(primaryColor, { lightness: 0.7 }),
        closeIconColorHoverPrimary: scaleColor(primaryColor, { lightness: 0.7 }),
        closeIconColorPressedPrimary: scaleColor(primaryColor, {
          lightness: 0.7
        }),
        closeColorHoverPrimary: changeColor(primaryColor, { alpha: 0.16 }),
        closeColorPressedPrimary: changeColor(primaryColor, { alpha: 0.12 }),
        borderInfo: `1px solid ${changeColor(infoColor, { alpha: 0.3 })}`,
        textColorInfo: infoColor,
        colorInfo: changeColor(infoColor, { alpha: 0.16 }),
        colorBorderedInfo: "#0000",
        closeIconColorInfo: scaleColor(infoColor, { alpha: 0.7 }),
        closeIconColorHoverInfo: scaleColor(infoColor, { alpha: 0.7 }),
        closeIconColorPressedInfo: scaleColor(infoColor, { alpha: 0.7 }),
        closeColorHoverInfo: changeColor(infoColor, { alpha: 0.16 }),
        closeColorPressedInfo: changeColor(infoColor, { alpha: 0.12 }),
        borderSuccess: `1px solid ${changeColor(successColor, { alpha: 0.3 })}`,
        textColorSuccess: successColor,
        colorSuccess: changeColor(successColor, { alpha: 0.16 }),
        colorBorderedSuccess: "#0000",
        closeIconColorSuccess: scaleColor(successColor, { alpha: 0.7 }),
        closeIconColorHoverSuccess: scaleColor(successColor, { alpha: 0.7 }),
        closeIconColorPressedSuccess: scaleColor(successColor, { alpha: 0.7 }),
        closeColorHoverSuccess: changeColor(successColor, { alpha: 0.16 }),
        closeColorPressedSuccess: changeColor(successColor, { alpha: 0.12 }),
        borderWarning: `1px solid ${changeColor(warningColor, { alpha: 0.3 })}`,
        textColorWarning: warningColor,
        colorWarning: changeColor(warningColor, { alpha: 0.16 }),
        colorBorderedWarning: "#0000",
        closeIconColorWarning: scaleColor(warningColor, { alpha: 0.7 }),
        closeIconColorHoverWarning: scaleColor(warningColor, { alpha: 0.7 }),
        closeIconColorPressedWarning: scaleColor(warningColor, { alpha: 0.7 }),
        closeColorHoverWarning: changeColor(warningColor, { alpha: 0.16 }),
        closeColorPressedWarning: changeColor(warningColor, { alpha: 0.11 }),
        borderError: `1px solid ${changeColor(errorColor, { alpha: 0.3 })}`,
        textColorError: errorColor,
        colorError: changeColor(errorColor, { alpha: 0.16 }),
        colorBorderedError: "#0000",
        closeIconColorError: scaleColor(errorColor, { alpha: 0.7 }),
        closeIconColorHoverError: scaleColor(errorColor, { alpha: 0.7 }),
        closeIconColorPressedError: scaleColor(errorColor, { alpha: 0.7 }),
        closeColorHoverError: changeColor(errorColor, { alpha: 0.16 }),
        closeColorPressedError: changeColor(errorColor, { alpha: 0.12 })
      });
    }
  };
  const tagDark$1 = tagDark;
  const self$M = (vars) => {
    const { textColor2, primaryColorHover, primaryColorPressed, primaryColor, infoColor, successColor, warningColor, errorColor, baseColor, borderColor, opacityDisabled, tagColor, closeIconColor, closeIconColorHover, closeIconColorPressed, borderRadiusSmall: borderRadius, fontSizeMini, fontSizeTiny, fontSizeSmall, fontSizeMedium, heightMini, heightTiny, heightSmall, heightMedium, closeColorHover, closeColorPressed, buttonColor2Hover, buttonColor2Pressed, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, commonVariables$j), {
      closeBorderRadius: borderRadius,
      heightTiny: heightMini,
      heightSmall: heightTiny,
      heightMedium: heightSmall,
      heightLarge: heightMedium,
      borderRadius,
      opacityDisabled,
      fontSizeTiny: fontSizeMini,
      fontSizeSmall: fontSizeTiny,
      fontSizeMedium: fontSizeSmall,
      fontSizeLarge: fontSizeMedium,
      fontWeightStrong,
      textColorCheckable: textColor2,
      textColorHoverCheckable: textColor2,
      textColorPressedCheckable: textColor2,
      textColorChecked: baseColor,
      colorCheckable: "#0000",
      colorHoverCheckable: buttonColor2Hover,
      colorPressedCheckable: buttonColor2Pressed,
      colorChecked: primaryColor,
      colorCheckedHover: primaryColorHover,
      colorCheckedPressed: primaryColorPressed,
      border: `1px solid ${borderColor}`,
      textColor: textColor2,
      color: tagColor,
      colorBordered: "rgb(250, 250, 252)",
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHover,
      closeColorPressed,
      borderPrimary: `1px solid ${changeColor(primaryColor, { alpha: 0.3 })}`,
      textColorPrimary: primaryColor,
      colorPrimary: changeColor(primaryColor, { alpha: 0.12 }),
      colorBorderedPrimary: changeColor(primaryColor, { alpha: 0.1 }),
      closeIconColorPrimary: primaryColor,
      closeIconColorHoverPrimary: primaryColor,
      closeIconColorPressedPrimary: primaryColor,
      closeColorHoverPrimary: changeColor(primaryColor, { alpha: 0.12 }),
      closeColorPressedPrimary: changeColor(primaryColor, { alpha: 0.18 }),
      borderInfo: `1px solid ${changeColor(infoColor, { alpha: 0.3 })}`,
      textColorInfo: infoColor,
      colorInfo: changeColor(infoColor, { alpha: 0.12 }),
      colorBorderedInfo: changeColor(infoColor, { alpha: 0.1 }),
      closeIconColorInfo: infoColor,
      closeIconColorHoverInfo: infoColor,
      closeIconColorPressedInfo: infoColor,
      closeColorHoverInfo: changeColor(infoColor, { alpha: 0.12 }),
      closeColorPressedInfo: changeColor(infoColor, { alpha: 0.18 }),
      borderSuccess: `1px solid ${changeColor(successColor, { alpha: 0.3 })}`,
      textColorSuccess: successColor,
      colorSuccess: changeColor(successColor, { alpha: 0.12 }),
      colorBorderedSuccess: changeColor(successColor, { alpha: 0.1 }),
      closeIconColorSuccess: successColor,
      closeIconColorHoverSuccess: successColor,
      closeIconColorPressedSuccess: successColor,
      closeColorHoverSuccess: changeColor(successColor, { alpha: 0.12 }),
      closeColorPressedSuccess: changeColor(successColor, { alpha: 0.18 }),
      borderWarning: `1px solid ${changeColor(warningColor, { alpha: 0.35 })}`,
      textColorWarning: warningColor,
      colorWarning: changeColor(warningColor, { alpha: 0.15 }),
      colorBorderedWarning: changeColor(warningColor, { alpha: 0.12 }),
      closeIconColorWarning: warningColor,
      closeIconColorHoverWarning: warningColor,
      closeIconColorPressedWarning: warningColor,
      closeColorHoverWarning: changeColor(warningColor, { alpha: 0.12 }),
      closeColorPressedWarning: changeColor(warningColor, { alpha: 0.18 }),
      borderError: `1px solid ${changeColor(errorColor, { alpha: 0.23 })}`,
      textColorError: errorColor,
      colorError: changeColor(errorColor, { alpha: 0.1 }),
      colorBorderedError: changeColor(errorColor, { alpha: 0.08 }),
      closeIconColorError: errorColor,
      closeIconColorHoverError: errorColor,
      closeIconColorPressedError: errorColor,
      closeColorHoverError: changeColor(errorColor, { alpha: 0.12 }),
      closeColorPressedError: changeColor(errorColor, { alpha: 0.18 })
    });
  };
  const tagLight = {
    name: "Tag",
    common: commonLight,
    self: self$M
  };
  const tagLight$1 = tagLight;
  const commonProps = {
    color: Object,
    type: {
      type: String,
      default: "default"
    },
    round: Boolean,
    size: {
      type: String,
      default: "medium"
    },
    closable: Boolean,
    disabled: {
      type: Boolean,
      default: void 0
    }
  };
  const style$5 = cB("tag", `
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`, [cM("strong", `
 font-weight: var(--n-font-weight-strong);
 `), cE("border", `
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `), cE("icon", `
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `), cE("avatar", `
 display: flex;
 margin: 0 6px 0 0;
 `), cE("close", `
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `), cM("round", `
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `, [cE("icon", `
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `), cE("avatar", `
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `), cM("closable", `
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]), cM("icon, avatar", [cM("round", `
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]), cM("disabled", `
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `), cM("checkable", `
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `, [cNotM("disabled", [c("&:hover", "background-color: var(--n-color-hover-checkable);", [cNotM("checked", "color: var(--n-text-color-hover-checkable);")]), c("&:active", "background-color: var(--n-color-pressed-checkable);", [cNotM("checked", "color: var(--n-text-color-pressed-checkable);")])]), cM("checked", `
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `, [cNotM("disabled", [c("&:hover", "background-color: var(--n-color-checked-hover);"), c("&:active", "background-color: var(--n-color-checked-pressed);")])])])]);
  const tagProps = Object.assign(Object.assign(Object.assign({}, useTheme.props), commonProps), {
    bordered: {
      type: Boolean,
      default: void 0
    },
    checked: Boolean,
    checkable: Boolean,
    strong: Boolean,
    triggerClickOnClose: Boolean,
    onClose: [Array, Function],
    onMouseenter: Function,
    onMouseleave: Function,
    "onUpdate:checked": Function,
    onUpdateChecked: Function,
    internalCloseFocusable: {
      type: Boolean,
      default: true
    },
    internalCloseIsButtonTag: {
      type: Boolean,
      default: true
    },
    onCheckedChange: Function
  });
  const tagInjectionKey = createInjectionKey("n-tag");
  const NTag = vue.defineComponent({
    name: "Tag",
    props: tagProps,
    setup(props) {
      const contentRef = vue.ref(null);
      const { mergedBorderedRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = useConfig(props);
      const themeRef = useTheme("Tag", "-tag", style$5, tagLight$1, props, mergedClsPrefixRef);
      vue.provide(tagInjectionKey, {
        roundRef: vue.toRef(props, "round")
      });
      function handleClick(e) {
        if (!props.disabled) {
          if (props.checkable) {
            const { checked, onCheckedChange, onUpdateChecked, "onUpdate:checked": _onUpdateChecked } = props;
            if (onUpdateChecked)
              onUpdateChecked(!checked);
            if (_onUpdateChecked)
              _onUpdateChecked(!checked);
            if (onCheckedChange)
              onCheckedChange(!checked);
          }
        }
      }
      function handleCloseClick(e) {
        if (!props.triggerClickOnClose) {
          e.stopPropagation();
        }
        if (!props.disabled) {
          const { onClose } = props;
          if (onClose)
            call(onClose, e);
        }
      }
      const tagPublicMethods = {
        setTextContent(textContent) {
          const { value } = contentRef;
          if (value)
            value.textContent = textContent;
        }
      };
      const rtlEnabledRef = useRtl("Tag", mergedRtlRef, mergedClsPrefixRef);
      const cssVarsRef = vue.computed(() => {
        const { type, size: size2, color: { color, textColor } = {} } = props;
        const { common: { cubicBezierEaseInOut: cubicBezierEaseInOut2 }, self: { padding, closeMargin, closeMarginRtl, borderRadius, opacityDisabled, textColorCheckable, textColorHoverCheckable, textColorPressedCheckable, textColorChecked, colorCheckable, colorHoverCheckable, colorPressedCheckable, colorChecked, colorCheckedHover, colorCheckedPressed, closeBorderRadius, fontWeightStrong, [createKey("colorBordered", type)]: colorBordered, [createKey("closeSize", size2)]: closeSize, [createKey("closeIconSize", size2)]: closeIconSize, [createKey("fontSize", size2)]: fontSize2, [createKey("height", size2)]: height, [createKey("color", type)]: typedColor, [createKey("textColor", type)]: typeTextColor, [createKey("border", type)]: border, [createKey("closeIconColor", type)]: closeIconColor, [createKey("closeIconColorHover", type)]: closeIconColorHover, [createKey("closeIconColorPressed", type)]: closeIconColorPressed, [createKey("closeColorHover", type)]: closeColorHover, [createKey("closeColorPressed", type)]: closeColorPressed } } = themeRef.value;
        return {
          "--n-font-weight-strong": fontWeightStrong,
          "--n-avatar-size-override": `calc(${height} - 8px)`,
          "--n-bezier": cubicBezierEaseInOut2,
          "--n-border-radius": borderRadius,
          "--n-border": border,
          "--n-close-icon-size": closeIconSize,
          "--n-close-color-pressed": closeColorPressed,
          "--n-close-color-hover": closeColorHover,
          "--n-close-border-radius": closeBorderRadius,
          "--n-close-icon-color": closeIconColor,
          "--n-close-icon-color-hover": closeIconColorHover,
          "--n-close-icon-color-pressed": closeIconColorPressed,
          "--n-close-icon-color-disabled": closeIconColor,
          "--n-close-margin": closeMargin,
          "--n-close-margin-rtl": closeMarginRtl,
          "--n-close-size": closeSize,
          "--n-color": color || (mergedBorderedRef.value ? colorBordered : typedColor),
          "--n-color-checkable": colorCheckable,
          "--n-color-checked": colorChecked,
          "--n-color-checked-hover": colorCheckedHover,
          "--n-color-checked-pressed": colorCheckedPressed,
          "--n-color-hover-checkable": colorHoverCheckable,
          "--n-color-pressed-checkable": colorPressedCheckable,
          "--n-font-size": fontSize2,
          "--n-height": height,
          "--n-opacity-disabled": opacityDisabled,
          "--n-padding": padding,
          "--n-text-color": textColor || typeTextColor,
          "--n-text-color-checkable": textColorCheckable,
          "--n-text-color-checked": textColorChecked,
          "--n-text-color-hover-checkable": textColorHoverCheckable,
          "--n-text-color-pressed-checkable": textColorPressedCheckable
        };
      });
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("tag", vue.computed(() => {
        let hash = "";
        const { type, size: size2, color: { color, textColor } = {} } = props;
        hash += type[0];
        hash += size2[0];
        if (color) {
          hash += `a${color2Class(color)}`;
        }
        if (textColor) {
          hash += `b${color2Class(textColor)}`;
        }
        if (mergedBorderedRef.value) {
          hash += "c";
        }
        return hash;
      }), cssVarsRef, props) : void 0;
      return Object.assign(Object.assign({}, tagPublicMethods), {
        rtlEnabled: rtlEnabledRef,
        mergedClsPrefix: mergedClsPrefixRef,
        contentRef,
        mergedBordered: mergedBorderedRef,
        handleClick,
        handleCloseClick,
        cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
        themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
        onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
      });
    },
    render() {
      var _a2, _b;
      const { mergedClsPrefix, rtlEnabled, closable, color: { borderColor } = {}, round, onRender, $slots } = this;
      onRender === null || onRender === void 0 ? void 0 : onRender();
      const avatarNode = resolveWrappedSlot($slots.avatar, (children) => children && vue.h("div", { class: `${mergedClsPrefix}-tag__avatar` }, children));
      const iconNode = resolveWrappedSlot($slots.icon, (children) => children && vue.h("div", { class: `${mergedClsPrefix}-tag__icon` }, children));
      return vue.h(
        "div",
        { class: [
          `${mergedClsPrefix}-tag`,
          this.themeClass,
          {
            [`${mergedClsPrefix}-tag--rtl`]: rtlEnabled,
            [`${mergedClsPrefix}-tag--strong`]: this.strong,
            [`${mergedClsPrefix}-tag--disabled`]: this.disabled,
            [`${mergedClsPrefix}-tag--checkable`]: this.checkable,
            [`${mergedClsPrefix}-tag--checked`]: this.checkable && this.checked,
            [`${mergedClsPrefix}-tag--round`]: round,
            [`${mergedClsPrefix}-tag--avatar`]: avatarNode,
            [`${mergedClsPrefix}-tag--icon`]: iconNode,
            [`${mergedClsPrefix}-tag--closable`]: closable
          }
        ], style: this.cssVars, onClick: this.handleClick, onMouseenter: this.onMouseenter, onMouseleave: this.onMouseleave },
        iconNode || avatarNode,
        vue.h("span", { class: `${mergedClsPrefix}-tag__content`, ref: "contentRef" }, (_b = (_a2 = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a2)),
        !this.checkable && closable ? vue.h(NBaseClose, { clsPrefix: mergedClsPrefix, class: `${mergedClsPrefix}-tag__close`, disabled: this.disabled, onClick: this.handleCloseClick, focusable: this.internalCloseFocusable, round, isButtonTag: this.internalCloseIsButtonTag, absolute: true }) : null,
        !this.checkable && this.mergedBordered ? vue.h("div", { class: `${mergedClsPrefix}-tag__border`, style: { borderColor } }) : null
      );
    }
  });
  const style$4 = cB("base-clear", `
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
  const NBaseClear = vue.defineComponent({
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
      useStyle("-base-clear", style$4, vue.toRef(props, "clsPrefix"));
      return {
        handleMouseDown(e) {
          e.preventDefault();
        }
      };
    },
    render() {
      const { clsPrefix } = this;
      return vue.h(
        "div",
        { class: `${clsPrefix}-base-clear` },
        vue.h(NIconSwitchTransition, null, {
          default: () => {
            var _a2, _b;
            return this.show ? vue.h("div", { key: "dismiss", class: `${clsPrefix}-base-clear__clear`, onClick: this.onClear, onMousedown: this.handleMouseDown, "data-clear": true }, resolveSlot(this.$slots.icon, () => [
              vue.h(NBaseIcon, { clsPrefix }, {
                default: () => vue.h(ClearIcon, null)
              })
            ])) : vue.h("div", { key: "icon", class: `${clsPrefix}-base-clear__placeholder` }, (_b = (_a2 = this.$slots).placeholder) === null || _b === void 0 ? void 0 : _b.call(_a2));
          }
        })
      );
    }
  });
  const NBaseSuffix = vue.defineComponent({
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
    setup(props, { slots }) {
      return () => {
        const { clsPrefix } = props;
        return vue.h(NBaseLoading, { clsPrefix, class: `${clsPrefix}-base-suffix`, strokeWidth: 24, scale: 0.85, show: props.loading }, {
          default: () => props.showArrow ? vue.h(NBaseClear, { clsPrefix, show: props.showClear, onClear: props.onClear }, {
            placeholder: () => vue.h(NBaseIcon, { clsPrefix, class: `${clsPrefix}-base-suffix__arrow` }, {
              default: () => resolveSlot(slots.default, () => [
                vue.h(ChevronDownIcon, null)
              ])
            })
          }) : null
        });
      };
    }
  });
  const commonVars$b = {
    paddingSingle: "0 26px 0 12px",
    paddingMultiple: "3px 26px 0 12px",
    clearSize: "16px",
    arrowSize: "16px"
  };
  const internalSelectionDark = {
    name: "InternalSelection",
    common: commonDark,
    peers: {
      Popover: popoverDark$1
    },
    self(vars) {
      const { borderRadius, textColor2, textColorDisabled, inputColor, inputColorDisabled, primaryColor, primaryColorHover, warningColor, warningColorHover, errorColor, errorColorHover, iconColor, iconColorDisabled, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge } = vars;
      return Object.assign(Object.assign({}, commonVars$b), {
        fontSizeTiny,
        fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        heightTiny,
        heightSmall,
        heightMedium,
        heightLarge,
        borderRadius,
        textColor: textColor2,
        textColorDisabled,
        placeholderColor,
        placeholderColorDisabled,
        color: inputColor,
        colorDisabled: inputColorDisabled,
        colorActive: changeColor(primaryColor, { alpha: 0.1 }),
        border: "1px solid #0000",
        borderHover: `1px solid ${primaryColorHover}`,
        borderActive: `1px solid ${primaryColor}`,
        borderFocus: `1px solid ${primaryColorHover}`,
        boxShadowHover: "none",
        boxShadowActive: `0 0 8px 0 ${changeColor(primaryColor, {
          alpha: 0.4
        })}`,
        boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, {
          alpha: 0.4
        })}`,
        caretColor: primaryColor,
        arrowColor: iconColor,
        arrowColorDisabled: iconColorDisabled,
        loadingColor: primaryColor,
        borderWarning: `1px solid ${warningColor}`,
        borderHoverWarning: `1px solid ${warningColorHover}`,
        borderActiveWarning: `1px solid ${warningColor}`,
        borderFocusWarning: `1px solid ${warningColorHover}`,
        boxShadowHoverWarning: "none",
        boxShadowActiveWarning: `0 0 8px 0 ${changeColor(warningColor, {
          alpha: 0.4
        })}`,
        boxShadowFocusWarning: `0 0 8px 0 ${changeColor(warningColor, {
          alpha: 0.4
        })}`,
        colorActiveWarning: changeColor(warningColor, { alpha: 0.1 }),
        caretColorWarning: warningColor,
        borderError: `1px solid ${errorColor}`,
        borderHoverError: `1px solid ${errorColorHover}`,
        borderActiveError: `1px solid ${errorColor}`,
        borderFocusError: `1px solid ${errorColorHover}`,
        boxShadowHoverError: "none",
        boxShadowActiveError: `0 0 8px 0 ${changeColor(errorColor, {
          alpha: 0.4
        })}`,
        boxShadowFocusError: `0 0 8px 0 ${changeColor(errorColor, {
          alpha: 0.4
        })}`,
        colorActiveError: changeColor(errorColor, { alpha: 0.1 }),
        caretColorError: errorColor,
        clearColor,
        clearColorHover,
        clearColorPressed
      });
    }
  };
  const internalSelectionDark$1 = internalSelectionDark;
  const {
    cubicBezierEaseInOut
  } = commonVariables$m;
  function fadeInWidthExpandTransition({
    duration = ".2s",
    delay = ".1s"
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
 opacity ${duration} ${cubicBezierEaseInOut},
 max-width ${duration} ${cubicBezierEaseInOut} ${delay},
 margin-left ${duration} ${cubicBezierEaseInOut} ${delay},
 margin-right ${duration} ${cubicBezierEaseInOut} ${delay};
 `), c("&.fade-in-width-expand-transition-enter-active", `
 overflow: hidden;
 transition:
 opacity ${duration} ${cubicBezierEaseInOut} ${delay},
 max-width ${duration} ${cubicBezierEaseInOut},
 margin-left ${duration} ${cubicBezierEaseInOut},
 margin-right ${duration} ${cubicBezierEaseInOut};
 `)];
  }
  const commonVars$a = {
    iconMargin: "11px 8px 0 12px",
    iconMarginRtl: "11px 12px 0 8px",
    iconSize: "24px",
    closeIconSize: "16px",
    closeSize: "20px",
    closeMargin: "13px 14px 0 0",
    closeMarginRtl: "13px 0 0 14px",
    padding: "13px"
  };
  const alertDark = {
    name: "Alert",
    common: commonDark,
    self(vars) {
      const { lineHeight: lineHeight2, borderRadius, fontWeightStrong, dividerColor, inputColor, textColor1, textColor2, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, infoColorSuppl, successColorSuppl, warningColorSuppl, errorColorSuppl, fontSize: fontSize2 } = vars;
      return Object.assign(Object.assign({}, commonVars$a), {
        fontSize: fontSize2,
        lineHeight: lineHeight2,
        titleFontWeight: fontWeightStrong,
        borderRadius,
        border: `1px solid ${dividerColor}`,
        color: inputColor,
        titleTextColor: textColor1,
        iconColor: textColor2,
        contentTextColor: textColor2,
        closeBorderRadius: borderRadius,
        closeColorHover,
        closeColorPressed,
        closeIconColor,
        closeIconColorHover,
        closeIconColorPressed,
        borderInfo: `1px solid ${changeColor(infoColorSuppl, { alpha: 0.35 })}`,
        colorInfo: changeColor(infoColorSuppl, { alpha: 0.25 }),
        titleTextColorInfo: textColor1,
        iconColorInfo: infoColorSuppl,
        contentTextColorInfo: textColor2,
        closeColorHoverInfo: closeColorHover,
        closeColorPressedInfo: closeColorPressed,
        closeIconColorInfo: closeIconColor,
        closeIconColorHoverInfo: closeIconColorHover,
        closeIconColorPressedInfo: closeIconColorPressed,
        borderSuccess: `1px solid ${changeColor(successColorSuppl, {
          alpha: 0.35
        })}`,
        colorSuccess: changeColor(successColorSuppl, { alpha: 0.25 }),
        titleTextColorSuccess: textColor1,
        iconColorSuccess: successColorSuppl,
        contentTextColorSuccess: textColor2,
        closeColorHoverSuccess: closeColorHover,
        closeColorPressedSuccess: closeColorPressed,
        closeIconColorSuccess: closeIconColor,
        closeIconColorHoverSuccess: closeIconColorHover,
        closeIconColorPressedSuccess: closeIconColorPressed,
        borderWarning: `1px solid ${changeColor(warningColorSuppl, {
          alpha: 0.35
        })}`,
        colorWarning: changeColor(warningColorSuppl, { alpha: 0.25 }),
        titleTextColorWarning: textColor1,
        iconColorWarning: warningColorSuppl,
        contentTextColorWarning: textColor2,
        closeColorHoverWarning: closeColorHover,
        closeColorPressedWarning: closeColorPressed,
        closeIconColorWarning: closeIconColor,
        closeIconColorHoverWarning: closeIconColorHover,
        closeIconColorPressedWarning: closeIconColorPressed,
        borderError: `1px solid ${changeColor(errorColorSuppl, { alpha: 0.35 })}`,
        colorError: changeColor(errorColorSuppl, { alpha: 0.25 }),
        titleTextColorError: textColor1,
        iconColorError: errorColorSuppl,
        contentTextColorError: textColor2,
        closeColorHoverError: closeColorHover,
        closeColorPressedError: closeColorPressed,
        closeIconColorError: closeIconColor,
        closeIconColorHoverError: closeIconColorHover,
        closeIconColorPressedError: closeIconColorPressed
      });
    }
  };
  const alertDark$1 = alertDark;
  const commonVars$9 = {
    linkFontSize: "13px",
    linkPadding: "0 0 0 16px",
    railWidth: "4px"
  };
  const self$L = (vars) => {
    const { borderRadius, railColor, primaryColor, primaryColorHover, primaryColorPressed, textColor2 } = vars;
    return Object.assign(Object.assign({}, commonVars$9), {
      borderRadius,
      railColor,
      railColorActive: primaryColor,
      linkColor: changeColor(primaryColor, { alpha: 0.15 }),
      linkTextColor: textColor2,
      linkTextColorHover: primaryColorHover,
      linkTextColorPressed: primaryColorPressed,
      linkTextColorActive: primaryColor
    });
  };
  const anchorDark = {
    name: "Anchor",
    common: commonDark,
    self: self$L
  };
  const anchorDark$1 = anchorDark;
  const isChrome = isBrowser$1 && "chrome" in window;
  isBrowser$1 && navigator.userAgent.includes("Firefox");
  const isSafari = isBrowser$1 && navigator.userAgent.includes("Safari") && !isChrome;
  const commonVariables$i = {
    paddingTiny: "0 8px",
    paddingSmall: "0 10px",
    paddingMedium: "0 12px",
    paddingLarge: "0 14px",
    clearSize: "16px"
  };
  const inputDark = {
    name: "Input",
    common: commonDark,
    self(vars) {
      const { textColor2, textColor3, textColorDisabled, primaryColor, primaryColorHover, inputColor, inputColorDisabled, warningColor, warningColorHover, errorColor, errorColorHover, borderRadius, lineHeight: lineHeight2, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, iconColor, iconColorDisabled, iconColorHover, iconColorPressed } = vars;
      return Object.assign(Object.assign({}, commonVariables$i), {
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
        groupLabelColor: inputColor,
        textColor: textColor2,
        textColorDisabled,
        textDecorationColor: textColor2,
        groupLabelTextColor: textColor2,
        caretColor: primaryColor,
        placeholderColor,
        placeholderColorDisabled,
        color: inputColor,
        colorDisabled: inputColorDisabled,
        colorFocus: changeColor(primaryColor, { alpha: 0.1 }),
        groupLabelBorder: "1px solid #0000",
        border: "1px solid #0000",
        borderHover: `1px solid ${primaryColorHover}`,
        borderDisabled: "1px solid #0000",
        borderFocus: `1px solid ${primaryColorHover}`,
        boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, { alpha: 0.3 })}`,
        loadingColor: primaryColor,
        loadingColorWarning: warningColor,
        borderWarning: `1px solid ${warningColor}`,
        borderHoverWarning: `1px solid ${warningColorHover}`,
        colorFocusWarning: changeColor(warningColor, { alpha: 0.1 }),
        borderFocusWarning: `1px solid ${warningColorHover}`,
        boxShadowFocusWarning: `0 0 8px 0 ${changeColor(warningColor, {
          alpha: 0.3
        })}`,
        caretColorWarning: warningColor,
        loadingColorError: errorColor,
        borderError: `1px solid ${errorColor}`,
        borderHoverError: `1px solid ${errorColorHover}`,
        colorFocusError: changeColor(errorColor, { alpha: 0.1 }),
        borderFocusError: `1px solid ${errorColorHover}`,
        boxShadowFocusError: `0 0 8px 0 ${changeColor(errorColor, {
          alpha: 0.3
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
    }
  };
  const inputDark$1 = inputDark;
  const self$K = (vars) => {
    const { textColor2, textColor3, textColorDisabled, primaryColor, primaryColorHover, inputColor, inputColorDisabled, borderColor, warningColor, warningColorHover, errorColor, errorColorHover, borderRadius, lineHeight: lineHeight2, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightTiny, heightSmall, heightMedium, heightLarge, actionColor, clearColor, clearColorHover, clearColorPressed, placeholderColor, placeholderColorDisabled, iconColor, iconColorDisabled, iconColorHover, iconColorPressed } = vars;
    return Object.assign(Object.assign({}, commonVariables$i), {
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
      boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, { alpha: 0.2 })}`,
      loadingColor: primaryColor,
      loadingColorWarning: warningColor,
      borderWarning: `1px solid ${warningColor}`,
      borderHoverWarning: `1px solid ${warningColorHover}`,
      colorFocusWarning: inputColor,
      borderFocusWarning: `1px solid ${warningColorHover}`,
      boxShadowFocusWarning: `0 0 0 2px ${changeColor(warningColor, {
        alpha: 0.2
      })}`,
      caretColorWarning: warningColor,
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
    self: self$K
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
    const selectionRef = vue.ref(null);
    function recordCursor() {
      const { value: input } = inputElRef;
      if (!(input === null || input === void 0 ? void 0 : input.focus)) {
        reset();
        return;
      }
      const { selectionStart, selectionEnd, value } = input;
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
      var _a2;
      const { value: selection } = selectionRef;
      const { value: inputEl } = inputElRef;
      if (!selection || !inputEl) {
        return;
      }
      const { value } = inputEl;
      const { start, beforeText, afterText } = selection;
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
      (_a2 = inputEl.setSelectionRange) === null || _a2 === void 0 ? void 0 : _a2.call(inputEl, startPos, startPos);
    }
    function reset() {
      selectionRef.value = null;
    }
    vue.watch(inputElRef, reset);
    return {
      recordCursor,
      restoreCursor
    };
  }
  const WordCount = vue.defineComponent({
    name: "InputWordCount",
    setup(_, { slots }) {
      const { mergedValueRef, maxlengthRef, mergedClsPrefixRef, countGraphemesRef } = vue.inject(inputInjectionKey);
      const wordCountRef = vue.computed(() => {
        const { value: mergedValue } = mergedValueRef;
        if (mergedValue === null || Array.isArray(mergedValue))
          return 0;
        return (countGraphemesRef.value || len)(mergedValue);
      });
      return () => {
        const { value: maxlength } = maxlengthRef;
        const { value: mergedValue } = mergedValueRef;
        return vue.h("span", { class: `${mergedClsPrefixRef.value}-input-word-count` }, resolveSlotWithProps(slots.default, {
          value: mergedValue === null || Array.isArray(mergedValue) ? "" : mergedValue
        }, () => [
          maxlength === void 0 ? wordCountRef.value : `${wordCountRef.value} / ${maxlength}`
        ]));
      };
    }
  });
  const style$3 = cB("input", `
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
 `, [c("+", [cE("placeholder", `
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
 `), cE("textarea-mirror", `
 width: 100%;
 pointer-events: none;
 overflow: hidden;
 visibility: hidden;
 position: static;
 white-space: pre-wrap;
 overflow-wrap: break-word;
 `)]),
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
    onKeyup: Function,
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
    internalLoadingBeforeSuffix: Boolean,
    showPasswordToggle: Boolean
  });
  const NInput = vue.defineComponent({
    name: "Input",
    props: inputProps,
    setup(props) {
      const { mergedClsPrefixRef, mergedBorderedRef, inlineThemeDisabled, mergedRtlRef } = useConfig(props);
      const themeRef = useTheme("Input", "-input", style$3, inputLight$1, props, mergedClsPrefixRef);
      if (isSafari) {
        useStyle("-input-safari", safariStyle, mergedClsPrefixRef);
      }
      const wrapperElRef = vue.ref(null);
      const textareaElRef = vue.ref(null);
      const textareaMirrorElRef = vue.ref(null);
      const inputMirrorElRef = vue.ref(null);
      const inputElRef = vue.ref(null);
      const inputEl2Ref = vue.ref(null);
      const currentFocusedInputRef = vue.ref(null);
      const focusedInputCursorControl = useCursor(currentFocusedInputRef);
      const textareaScrollbarInstRef = vue.ref(null);
      const { localeRef } = useLocale("Input");
      const uncontrolledValueRef = vue.ref(props.defaultValue);
      const controlledValueRef = vue.toRef(props, "value");
      const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
      const formItem = useFormItem(props);
      const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
      const focusedRef = vue.ref(false);
      const hoverRef = vue.ref(false);
      const isComposingRef = vue.ref(false);
      const activatedRef = vue.ref(false);
      let syncSource = null;
      const mergedPlaceholderRef = vue.computed(() => {
        const { placeholder, pair } = props;
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
      const showPlaceholder1Ref = vue.computed(() => {
        const { value: isComposing } = isComposingRef;
        const { value: mergedValue } = mergedValueRef;
        const { value: mergedPlaceholder } = mergedPlaceholderRef;
        return !isComposing && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[0])) && mergedPlaceholder[0];
      });
      const showPlaceholder2Ref = vue.computed(() => {
        const { value: isComposing } = isComposingRef;
        const { value: mergedValue } = mergedValueRef;
        const { value: mergedPlaceholder } = mergedPlaceholderRef;
        return !isComposing && mergedPlaceholder[1] && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[1]));
      });
      const mergedFocusRef = useMemo(() => {
        return props.internalForceFocus || focusedRef.value;
      });
      const showClearButton = useMemo(() => {
        if (mergedDisabledRef.value || props.readonly || !props.clearable || !mergedFocusRef.value && !hoverRef.value) {
          return false;
        }
        const { value: mergedValue } = mergedValueRef;
        const { value: mergedFocus } = mergedFocusRef;
        if (props.pair) {
          return !!(Array.isArray(mergedValue) && (mergedValue[0] || mergedValue[1])) && (hoverRef.value || mergedFocus);
        } else {
          return !!mergedValue && (hoverRef.value || mergedFocus);
        }
      });
      const mergedShowPasswordOnRef = vue.computed(() => {
        const { showPasswordOn } = props;
        if (showPasswordOn) {
          return showPasswordOn;
        }
        if (props.showPasswordToggle)
          return "click";
        return void 0;
      });
      const passwordVisibleRef = vue.ref(false);
      const textDecorationStyleRef = vue.computed(() => {
        const { textDecoration } = props;
        if (!textDecoration)
          return ["", ""];
        if (Array.isArray(textDecoration)) {
          return textDecoration.map((v) => ({
            textDecoration: v
          }));
        }
        return [
          {
            textDecoration
          }
        ];
      });
      const textAreaScrollContainerWidthRef = vue.ref(void 0);
      const updateTextAreaStyle = () => {
        var _a2, _b;
        if (props.type === "textarea") {
          const { autosize } = props;
          if (autosize) {
            textAreaScrollContainerWidthRef.value = (_b = (_a2 = textareaScrollbarInstRef.value) === null || _a2 === void 0 ? void 0 : _a2.$el) === null || _b === void 0 ? void 0 : _b.offsetWidth;
          }
          if (!textareaElRef.value)
            return;
          if (typeof autosize === "boolean")
            return;
          const { paddingTop: stylePaddingTop, paddingBottom: stylePaddingBottom, lineHeight: styleLineHeight } = window.getComputedStyle(textareaElRef.value);
          const paddingTop = Number(stylePaddingTop.slice(0, -2));
          const paddingBottom = Number(stylePaddingBottom.slice(0, -2));
          const lineHeight2 = Number(styleLineHeight.slice(0, -2));
          const { value: textareaMirrorEl } = textareaMirrorElRef;
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
      const maxlengthRef = vue.computed(() => {
        const { maxlength } = props;
        return maxlength === void 0 ? void 0 : Number(maxlength);
      });
      vue.onMounted(() => {
        const { value } = mergedValueRef;
        if (!Array.isArray(value)) {
          syncMirror(value);
        }
      });
      const vm = vue.getCurrentInstance().proxy;
      function doUpdateValue(value) {
        const { onUpdateValue, "onUpdate:value": _onUpdateValue, onInput } = props;
        const { nTriggerFormInput } = formItem;
        if (onUpdateValue)
          call(onUpdateValue, value);
        if (_onUpdateValue)
          call(_onUpdateValue, value);
        if (onInput)
          call(onInput, value);
        uncontrolledValueRef.value = value;
        nTriggerFormInput();
      }
      function doChange(value) {
        const { onChange } = props;
        const { nTriggerFormChange } = formItem;
        if (onChange)
          call(onChange, value);
        uncontrolledValueRef.value = value;
        nTriggerFormChange();
      }
      function doBlur(e) {
        const { onBlur } = props;
        const { nTriggerFormBlur } = formItem;
        if (onBlur)
          call(onBlur, e);
        nTriggerFormBlur();
      }
      function doFocus(e) {
        const { onFocus } = props;
        const { nTriggerFormFocus } = formItem;
        if (onFocus)
          call(onFocus, e);
        nTriggerFormFocus();
      }
      function doClear(e) {
        const { onClear } = props;
        if (onClear)
          call(onClear, e);
      }
      function doUpdateValueBlur(e) {
        const { onInputBlur } = props;
        if (onInputBlur)
          call(onInputBlur, e);
      }
      function doUpdateValueFocus(e) {
        const { onInputFocus } = props;
        if (onInputFocus)
          call(onInputFocus, e);
      }
      function doDeactivate() {
        const { onDeactivate } = props;
        if (onDeactivate)
          call(onDeactivate);
      }
      function doActivate() {
        const { onActivate } = props;
        if (onActivate)
          call(onActivate);
      }
      function doClick(e) {
        const { onClick } = props;
        if (onClick)
          call(onClick, e);
      }
      function doWrapperFocus(e) {
        const { onWrapperFocus } = props;
        if (onWrapperFocus)
          call(onWrapperFocus, e);
      }
      function doWrapperBlur(e) {
        const { onWrapperBlur } = props;
        if (onWrapperBlur)
          call(onWrapperBlur, e);
      }
      function handleCompositionStart() {
        isComposingRef.value = true;
      }
      function handleCompositionEnd(e) {
        isComposingRef.value = false;
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
          isComposingRef.value = false;
        }
        if (props.type === "textarea") {
          const { value: textareaScrollbarInst } = textareaScrollbarInstRef;
          if (textareaScrollbarInst) {
            textareaScrollbarInst.syncUnifiedContainer();
          }
        }
        syncSource = targetValue;
        if (isComposingRef.value)
          return;
        focusedInputCursorControl.recordCursor();
        const isIncomingValueValid = allowInput(targetValue);
        if (isIncomingValueValid) {
          if (!props.pair) {
            event === "input" ? doUpdateValue(targetValue) : doChange(targetValue);
          } else {
            let { value } = mergedValueRef;
            if (!Array.isArray(value)) {
              value = ["", ""];
            } else {
              value = [value[0], value[1]];
            }
            value[index] = targetValue;
            event === "input" ? doUpdateValue(value) : doChange(value);
          }
        }
        vm.$forceUpdate();
        if (!isIncomingValueValid) {
          void vue.nextTick(focusedInputCursorControl.restoreCursor);
        }
      }
      function allowInput(value) {
        const { countGraphemes, maxlength, minlength } = props;
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
        const { allowInput: allowInput2 } = props;
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
        if (props.pair) {
          doUpdateValue(["", ""]);
          doChange(["", ""]);
        } else {
          doUpdateValue("");
          doChange("");
        }
      }
      function handleMouseDown(e) {
        const { onMousedown } = props;
        if (onMousedown)
          onMousedown(e);
        const { tagName } = e.target;
        if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
          if (props.resizable) {
            const { value: wrapperEl } = wrapperElRef;
            if (wrapperEl) {
              const { left, top, width, height } = wrapperEl.getBoundingClientRect();
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
        var _a2;
        hoverRef.value = true;
        if (props.type === "textarea") {
          (_a2 = textareaScrollbarInstRef.value) === null || _a2 === void 0 ? void 0 : _a2.handleMouseEnterWrapper();
        }
      }
      function handleMouseLeave() {
        var _a2;
        hoverRef.value = false;
        if (props.type === "textarea") {
          (_a2 = textareaScrollbarInstRef.value) === null || _a2 === void 0 ? void 0 : _a2.handleMouseLeaveWrapper();
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
      function handleWrapperKeydown(e) {
        var _a2;
        (_a2 = props.onKeydown) === null || _a2 === void 0 ? void 0 : _a2.call(props, e);
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
        var _a2, _b;
        if (props.passivelyActivated) {
          const { value: focused } = activatedRef;
          if (focused) {
            if (props.internalDeactivateOnEnter) {
              handleWrapperKeydownEsc();
            }
            return;
          }
          e.preventDefault();
          if (props.type === "textarea") {
            (_a2 = textareaElRef.value) === null || _a2 === void 0 ? void 0 : _a2.focus();
          } else {
            (_b = inputElRef.value) === null || _b === void 0 ? void 0 : _b.focus();
          }
        }
      }
      function handleWrapperKeydownEsc() {
        if (props.passivelyActivated) {
          activatedRef.value = false;
          void vue.nextTick(() => {
            var _a2;
            (_a2 = wrapperElRef.value) === null || _a2 === void 0 ? void 0 : _a2.focus();
          });
        }
      }
      function focus() {
        var _a2, _b, _c;
        if (mergedDisabledRef.value)
          return;
        if (props.passivelyActivated) {
          (_a2 = wrapperElRef.value) === null || _a2 === void 0 ? void 0 : _a2.focus();
        } else {
          (_b = textareaElRef.value) === null || _b === void 0 ? void 0 : _b.focus();
          (_c = inputElRef.value) === null || _c === void 0 ? void 0 : _c.focus();
        }
      }
      function blur() {
        var _a2;
        if ((_a2 = wrapperElRef.value) === null || _a2 === void 0 ? void 0 : _a2.contains(document.activeElement)) {
          document.activeElement.blur();
        }
      }
      function select() {
        var _a2, _b;
        (_a2 = textareaElRef.value) === null || _a2 === void 0 ? void 0 : _a2.select();
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
        const { value: wrapperEl } = wrapperElRef;
        if ((wrapperEl === null || wrapperEl === void 0 ? void 0 : wrapperEl.contains(document.activeElement)) && wrapperEl !== document.activeElement) {
          handleWrapperKeydownEsc();
        }
      }
      function scrollTo(options) {
        if (props.type === "textarea") {
          const { value: textareaEl } = textareaElRef;
          textareaEl === null || textareaEl === void 0 ? void 0 : textareaEl.scrollTo(options);
        } else {
          const { value: inputEl } = inputElRef;
          inputEl === null || inputEl === void 0 ? void 0 : inputEl.scrollTo(options);
        }
      }
      function syncMirror(value) {
        const { type, pair, autosize } = props;
        if (!pair && autosize) {
          if (type === "textarea") {
            const { value: textareaMirrorEl } = textareaMirrorElRef;
            if (textareaMirrorEl) {
              textareaMirrorEl.textContent = (value !== null && value !== void 0 ? value : "") + "\r\n";
            }
          } else {
            const { value: inputMirrorEl } = inputMirrorElRef;
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
      const placeholderStyleRef = vue.ref({
        top: "0"
      });
      function handleTextAreaScroll(e) {
        var _a2;
        const { scrollTop } = e.target;
        placeholderStyleRef.value.top = `${-scrollTop}px`;
        (_a2 = textareaScrollbarInstRef.value) === null || _a2 === void 0 ? void 0 : _a2.syncUnifiedContainer();
      }
      let stopWatchMergedValue1 = null;
      vue.watchEffect(() => {
        const { autosize, type } = props;
        if (autosize && type === "textarea") {
          stopWatchMergedValue1 = vue.watch(mergedValueRef, (value) => {
            if (!Array.isArray(value) && value !== syncSource) {
              syncMirror(value);
            }
          });
        } else {
          stopWatchMergedValue1 === null || stopWatchMergedValue1 === void 0 ? void 0 : stopWatchMergedValue1();
        }
      });
      let stopWatchMergedValue2 = null;
      vue.watchEffect(() => {
        if (props.type === "textarea") {
          stopWatchMergedValue2 = vue.watch(mergedValueRef, (value) => {
            var _a2;
            if (!Array.isArray(value) && value !== syncSource) {
              (_a2 = textareaScrollbarInstRef.value) === null || _a2 === void 0 ? void 0 : _a2.syncUnifiedContainer();
            }
          });
        } else {
          stopWatchMergedValue2 === null || stopWatchMergedValue2 === void 0 ? void 0 : stopWatchMergedValue2();
        }
      });
      vue.provide(inputInjectionKey, {
        mergedValueRef,
        maxlengthRef,
        mergedClsPrefixRef,
        countGraphemesRef: vue.toRef(props, "countGraphemes")
      });
      const exposedProps = {
        wrapperElRef,
        inputElRef,
        textareaElRef,
        isCompositing: isComposingRef,
        focus,
        blur,
        select,
        deactivate,
        activate,
        scrollTo
      };
      const rtlEnabledRef = useRtl("Input", mergedRtlRef, mergedClsPrefixRef);
      const cssVarsRef = vue.computed(() => {
        const { value: size2 } = mergedSizeRef;
        const { common: { cubicBezierEaseInOut: cubicBezierEaseInOut2 }, self: { color, borderRadius, textColor, caretColor, caretColorError, caretColorWarning, textDecorationColor, border, borderDisabled, borderHover, borderFocus, placeholderColor, placeholderColorDisabled, lineHeightTextarea, colorDisabled, colorFocus, textColorDisabled, boxShadowFocus, iconSize, colorFocusWarning, boxShadowFocusWarning, borderWarning, borderFocusWarning, borderHoverWarning, colorFocusError, boxShadowFocusError, borderError, borderFocusError, borderHoverError, clearSize, clearColor, clearColorHover, clearColorPressed, iconColor, iconColorDisabled, suffixTextColor, countTextColor, countTextColorDisabled, iconColorHover, iconColorPressed, loadingColor, loadingColorError, loadingColorWarning, [createKey("padding", size2)]: padding, [createKey("fontSize", size2)]: fontSize2, [createKey("height", size2)]: height } } = themeRef.value;
        const { left: paddingLeft, right: paddingRight } = getMargin(padding);
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
          "--n-caret-color-warning": caretColorWarning,
          "--n-color-focus-warning": colorFocusWarning,
          "--n-box-shadow-focus-warning": boxShadowFocusWarning,
          "--n-border-warning": borderWarning,
          "--n-border-focus-warning": borderFocusWarning,
          "--n-border-hover-warning": borderHoverWarning,
          "--n-loading-color-warning": loadingColorWarning,
          "--n-caret-color-error": caretColorError,
          "--n-color-focus-error": colorFocusError,
          "--n-box-shadow-focus-error": boxShadowFocusError,
          "--n-border-error": borderError,
          "--n-border-focus-error": borderFocusError,
          "--n-border-hover-error": borderHoverError,
          "--n-loading-color-error": loadingColorError,
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
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("input", vue.computed(() => {
        const { value: size2 } = mergedSizeRef;
        return size2[0];
      }), cssVarsRef, props) : void 0;
      return Object.assign(Object.assign({}, exposedProps), {
        wrapperElRef,
        inputElRef,
        inputMirrorElRef,
        inputEl2Ref,
        textareaElRef,
        textareaMirrorElRef,
        textareaScrollbarInstRef,
        rtlEnabled: rtlEnabledRef,
        uncontrolledValue: uncontrolledValueRef,
        mergedValue: mergedValueRef,
        passwordVisible: passwordVisibleRef,
        mergedPlaceholder: mergedPlaceholderRef,
        showPlaceholder1: showPlaceholder1Ref,
        showPlaceholder2: showPlaceholder2Ref,
        mergedFocus: mergedFocusRef,
        isComposing: isComposingRef,
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
      var _a2, _b;
      const { mergedClsPrefix, mergedStatus, themeClass, type, countGraphemes, onRender } = this;
      const $slots = this.$slots;
      onRender === null || onRender === void 0 ? void 0 : onRender();
      return vue.h(
        "div",
        { ref: "wrapperElRef", class: [
          `${mergedClsPrefix}-input`,
          themeClass,
          mergedStatus && `${mergedClsPrefix}-input--${mergedStatus}-status`,
          {
            [`${mergedClsPrefix}-input--rtl`]: this.rtlEnabled,
            [`${mergedClsPrefix}-input--disabled`]: this.mergedDisabled,
            [`${mergedClsPrefix}-input--textarea`]: type === "textarea",
            [`${mergedClsPrefix}-input--resizable`]: this.resizable && !this.autosize,
            [`${mergedClsPrefix}-input--autosize`]: this.autosize,
            [`${mergedClsPrefix}-input--round`]: this.round && !(type === "textarea"),
            [`${mergedClsPrefix}-input--pair`]: this.pair,
            [`${mergedClsPrefix}-input--focus`]: this.mergedFocus,
            [`${mergedClsPrefix}-input--stateful`]: this.stateful
          }
        ], style: this.cssVars, tabindex: !this.mergedDisabled && this.passivelyActivated && !this.activated ? 0 : void 0, onFocus: this.handleWrapperFocus, onBlur: this.handleWrapperBlur, onClick: this.handleClick, onMousedown: this.handleMouseDown, onMouseenter: this.handleMouseEnter, onMouseleave: this.handleMouseLeave, onCompositionstart: this.handleCompositionStart, onCompositionend: this.handleCompositionEnd, onKeyup: this.onKeyup, onKeydown: this.handleWrapperKeydown },
        vue.h(
          "div",
          { class: `${mergedClsPrefix}-input-wrapper` },
          resolveWrappedSlot($slots.prefix, (children) => children && vue.h("div", { class: `${mergedClsPrefix}-input__prefix` }, children)),
          type === "textarea" ? vue.h(NScrollbar, { ref: "textareaScrollbarInstRef", class: `${mergedClsPrefix}-input__textarea`, container: this.getTextareaScrollContainer, triggerDisplayManually: true, useUnifiedContainer: true, internalHoistYRail: true }, {
            default: () => {
              var _a3, _b2;
              const { textAreaScrollContainerWidth } = this;
              const scrollContainerWidthStyle = {
                width: this.autosize && textAreaScrollContainerWidth && `${textAreaScrollContainerWidth}px`
              };
              return vue.h(
                vue.Fragment,
                null,
                vue.h("textarea", Object.assign({}, this.inputProps, { ref: "textareaElRef", class: [
                  `${mergedClsPrefix}-input__textarea-el`,
                  (_a3 = this.inputProps) === null || _a3 === void 0 ? void 0 : _a3.class
                ], autofocus: this.autofocus, rows: Number(this.rows), placeholder: this.placeholder, value: this.mergedValue, disabled: this.mergedDisabled, maxlength: countGraphemes ? void 0 : this.maxlength, minlength: countGraphemes ? void 0 : this.minlength, readonly: this.readonly, tabindex: this.passivelyActivated && !this.activated ? -1 : void 0, style: [
                  this.textDecorationStyle[0],
                  (_b2 = this.inputProps) === null || _b2 === void 0 ? void 0 : _b2.style,
                  scrollContainerWidthStyle
                ], onBlur: this.handleInputBlur, onFocus: (e) => {
                  this.handleInputFocus(e, 2);
                }, onInput: this.handleInput, onChange: this.handleChange, onScroll: this.handleTextAreaScroll })),
                this.showPlaceholder1 ? vue.h("div", { class: `${mergedClsPrefix}-input__placeholder`, style: [
                  this.placeholderStyle,
                  scrollContainerWidthStyle
                ], key: "placeholder" }, this.mergedPlaceholder[0]) : null,
                this.autosize ? vue.h(VResizeObserver, { onResize: this.handleTextAreaMirrorResize }, {
                  default: () => vue.h("div", { ref: "textareaMirrorElRef", class: `${mergedClsPrefix}-input__textarea-mirror`, key: "mirror" })
                }) : null
              );
            }
          }) : vue.h(
            "div",
            { class: `${mergedClsPrefix}-input__input` },
            vue.h("input", Object.assign({ type: type === "password" && this.mergedShowPasswordOn && this.passwordVisible ? "text" : type }, this.inputProps, { ref: "inputElRef", class: [
              `${mergedClsPrefix}-input__input-el`,
              (_a2 = this.inputProps) === null || _a2 === void 0 ? void 0 : _a2.class
            ], style: [
              this.textDecorationStyle[0],
              (_b = this.inputProps) === null || _b === void 0 ? void 0 : _b.style
            ], tabindex: this.passivelyActivated && !this.activated ? -1 : void 0, placeholder: this.mergedPlaceholder[0], disabled: this.mergedDisabled, maxlength: countGraphemes ? void 0 : this.maxlength, minlength: countGraphemes ? void 0 : this.minlength, value: Array.isArray(this.mergedValue) ? this.mergedValue[0] : this.mergedValue, readonly: this.readonly, autofocus: this.autofocus, size: this.attrSize, onBlur: this.handleInputBlur, onFocus: (e) => {
              this.handleInputFocus(e, 0);
            }, onInput: (e) => {
              this.handleInput(e, 0);
            }, onChange: (e) => {
              this.handleChange(e, 0);
            } })),
            this.showPlaceholder1 ? vue.h(
              "div",
              { class: `${mergedClsPrefix}-input__placeholder` },
              vue.h("span", null, this.mergedPlaceholder[0])
            ) : null,
            this.autosize ? vue.h("div", { class: `${mergedClsPrefix}-input__input-mirror`, key: "mirror", ref: "inputMirrorElRef" }, "\xA0") : null
          ),
          !this.pair && resolveWrappedSlot($slots.suffix, (children) => {
            return children || this.clearable || this.showCount || this.mergedShowPasswordOn || this.loading !== void 0 ? vue.h("div", { class: `${mergedClsPrefix}-input__suffix` }, [
              resolveWrappedSlot($slots["clear-icon-placeholder"], (children2) => {
                return (this.clearable || children2) && vue.h(NBaseClear, { clsPrefix: mergedClsPrefix, show: this.showClearButton, onClear: this.handleClear }, {
                  placeholder: () => children2,
                  icon: () => {
                    var _a3, _b2;
                    return (_b2 = (_a3 = this.$slots)["clear-icon"]) === null || _b2 === void 0 ? void 0 : _b2.call(_a3);
                  }
                });
              }),
              !this.internalLoadingBeforeSuffix ? children : null,
              this.loading !== void 0 ? vue.h(NBaseSuffix, { clsPrefix: mergedClsPrefix, loading: this.loading, showArrow: false, showClear: false, style: this.cssVars }) : null,
              this.internalLoadingBeforeSuffix ? children : null,
              this.showCount && this.type !== "textarea" ? vue.h(WordCount, null, {
                default: (props) => {
                  var _a3;
                  return (_a3 = $slots.count) === null || _a3 === void 0 ? void 0 : _a3.call($slots, props);
                }
              }) : null,
              this.mergedShowPasswordOn && this.type === "password" ? vue.h("div", { class: `${mergedClsPrefix}-input__eye`, onMousedown: this.handlePasswordToggleMousedown, onClick: this.handlePasswordToggleClick }, this.passwordVisible ? resolveSlot($slots["password-visible-icon"], () => [
                vue.h(NBaseIcon, { clsPrefix: mergedClsPrefix }, { default: () => vue.h(EyeIcon, null) })
              ]) : resolveSlot($slots["password-invisible-icon"], () => [
                vue.h(NBaseIcon, { clsPrefix: mergedClsPrefix }, { default: () => vue.h(EyeOffIcon, null) })
              ])) : null
            ]) : null;
          })
        ),
        this.pair ? vue.h("span", { class: `${mergedClsPrefix}-input__separator` }, resolveSlot($slots.separator, () => [this.separator])) : null,
        this.pair ? vue.h(
          "div",
          { class: `${mergedClsPrefix}-input-wrapper` },
          vue.h(
            "div",
            { class: `${mergedClsPrefix}-input__input` },
            vue.h("input", { ref: "inputEl2Ref", type: this.type, class: `${mergedClsPrefix}-input__input-el`, tabindex: this.passivelyActivated && !this.activated ? -1 : void 0, placeholder: this.mergedPlaceholder[1], disabled: this.mergedDisabled, maxlength: countGraphemes ? void 0 : this.maxlength, minlength: countGraphemes ? void 0 : this.minlength, value: Array.isArray(this.mergedValue) ? this.mergedValue[1] : void 0, readonly: this.readonly, style: this.textDecorationStyle[1], onBlur: this.handleInputBlur, onFocus: (e) => {
              this.handleInputFocus(e, 1);
            }, onInput: (e) => {
              this.handleInput(e, 1);
            }, onChange: (e) => {
              this.handleChange(e, 1);
            } }),
            this.showPlaceholder2 ? vue.h(
              "div",
              { class: `${mergedClsPrefix}-input__placeholder` },
              vue.h("span", null, this.mergedPlaceholder[1])
            ) : null
          ),
          resolveWrappedSlot($slots.suffix, (children) => {
            return (this.clearable || children) && vue.h("div", { class: `${mergedClsPrefix}-input__suffix` }, [
              this.clearable && vue.h(NBaseClear, { clsPrefix: mergedClsPrefix, show: this.showClearButton, onClear: this.handleClear }, {
                icon: () => {
                  var _a3;
                  return (_a3 = $slots["clear-icon"]) === null || _a3 === void 0 ? void 0 : _a3.call($slots);
                },
                placeholder: () => {
                  var _a3;
                  return (_a3 = $slots["clear-icon-placeholder"]) === null || _a3 === void 0 ? void 0 : _a3.call($slots);
                }
              }),
              children
            ]);
          })
        ) : null,
        this.mergedBordered ? vue.h("div", { class: `${mergedClsPrefix}-input__border` }) : null,
        this.mergedBordered ? vue.h("div", { class: `${mergedClsPrefix}-input__state-border` }) : null,
        this.showCount && type === "textarea" ? vue.h(WordCount, null, {
          default: (props) => {
            var _a3;
            const { renderCount } = this;
            if (renderCount) {
              return renderCount(props);
            }
            return (_a3 = $slots.count) === null || _a3 === void 0 ? void 0 : _a3.call($slots, props);
          }
        }) : null
      );
    }
  });
  const style$2 = cB("input-group", `
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
  const NInputGroup = vue.defineComponent({
    name: "InputGroup",
    props: inputGroupProps,
    setup(props) {
      const { mergedClsPrefixRef } = useConfig(props);
      useStyle("-input-group", style$2, mergedClsPrefixRef);
      return {
        mergedClsPrefix: mergedClsPrefixRef
      };
    },
    render() {
      const { mergedClsPrefix } = this;
      return vue.h("div", { class: `${mergedClsPrefix}-input-group` }, this.$slots);
    }
  });
  function self$J(vars) {
    const { boxShadow2 } = vars;
    return {
      menuBoxShadow: boxShadow2
    };
  }
  const autoCompleteDark = {
    name: "AutoComplete",
    common: commonDark,
    peers: {
      InternalSelectMenu: internalSelectMenuDark$1,
      Input: inputDark$1
    },
    self: self$J
  };
  const autoCompleteDark$1 = autoCompleteDark;
  const self$I = (vars) => {
    const { borderRadius, avatarColor, cardColor, fontSize: fontSize2, heightTiny, heightSmall, heightMedium, heightLarge, heightHuge, modalColor, popoverColor } = vars;
    return {
      borderRadius,
      fontSize: fontSize2,
      border: `2px solid ${cardColor}`,
      heightTiny,
      heightSmall,
      heightMedium,
      heightLarge,
      heightHuge,
      color: composite(cardColor, avatarColor),
      colorModal: composite(modalColor, avatarColor),
      colorPopover: composite(popoverColor, avatarColor)
    };
  };
  const avatarDark = {
    name: "Avatar",
    common: commonDark,
    self: self$I
  };
  const avatarDark$1 = avatarDark;
  const self$H = () => {
    return {
      gap: "-12px"
    };
  };
  const avatarGroupDark = {
    name: "AvatarGroup",
    common: commonDark,
    peers: {
      Avatar: avatarDark$1
    },
    self: self$H
  };
  const avatarGroupDark$1 = avatarGroupDark;
  const commonVariables$h = {
    width: "44px",
    height: "44px",
    borderRadius: "22px",
    iconSize: "26px"
  };
  const backTopDark = {
    name: "BackTop",
    common: commonDark,
    self(vars) {
      const { popoverColor, textColor2, primaryColorHover, primaryColorPressed } = vars;
      return Object.assign(Object.assign({}, commonVariables$h), { color: popoverColor, textColor: textColor2, iconColor: textColor2, iconColorHover: primaryColorHover, iconColorPressed: primaryColorPressed, boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)", boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)", boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)" });
    }
  };
  const backTopDark$1 = backTopDark;
  const badgeDark = {
    name: "Badge",
    common: commonDark,
    self(vars) {
      const { errorColorSuppl, infoColorSuppl, successColorSuppl, warningColorSuppl, fontFamily: fontFamily2 } = vars;
      return {
        color: errorColorSuppl,
        colorInfo: infoColorSuppl,
        colorSuccess: successColorSuppl,
        colorError: errorColorSuppl,
        colorWarning: warningColorSuppl,
        fontSize: "12px",
        fontFamily: fontFamily2
      };
    }
  };
  const badgeDark$1 = badgeDark;
  const commonVariables$g = {
    fontWeightActive: "400"
  };
  const self$G = (vars) => {
    const { fontSize: fontSize2, textColor3, textColor2, borderRadius, buttonColor2Hover, buttonColor2Pressed } = vars;
    return Object.assign(Object.assign({}, commonVariables$g), { fontSize: fontSize2, itemLineHeight: "1.25", itemTextColor: textColor3, itemTextColorHover: textColor2, itemTextColorPressed: textColor2, itemTextColorActive: textColor2, itemBorderRadius: borderRadius, itemColorHover: buttonColor2Hover, itemColorPressed: buttonColor2Pressed, separatorColor: textColor3 });
  };
  const breadcrumbDark = {
    name: "Breadcrumb",
    common: commonDark,
    self: self$G
  };
  const breadcrumbDark$1 = breadcrumbDark;
  function createHoverColor(rgb) {
    return composite(rgb, [255, 255, 255, 0.16]);
  }
  function createPressedColor(rgb) {
    return composite(rgb, [0, 0, 0, 0.12]);
  }
  const buttonGroupInjectionKey = createInjectionKey("n-button-group");
  const commonVariables$f = {
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
  const self$F = (vars) => {
    const { heightTiny, heightSmall, heightMedium, heightLarge, borderRadius, fontSizeTiny, fontSizeSmall, fontSizeMedium, fontSizeLarge, opacityDisabled, textColor2, textColor3, primaryColorHover, primaryColorPressed, borderColor, primaryColor, baseColor, infoColor, infoColorHover, infoColorPressed, successColor, successColorHover, successColorPressed, warningColor, warningColorHover, warningColorPressed, errorColor, errorColorHover, errorColorPressed, fontWeight, buttonColor2, buttonColor2Hover, buttonColor2Pressed, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, commonVariables$f), {
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
      colorOpacitySecondary: "0.16",
      colorOpacitySecondaryHover: "0.22",
      colorOpacitySecondaryPressed: "0.28",
      colorSecondary: buttonColor2,
      colorSecondaryHover: buttonColor2Hover,
      colorSecondaryPressed: buttonColor2Pressed,
      colorTertiary: buttonColor2,
      colorTertiaryHover: buttonColor2Hover,
      colorTertiaryPressed: buttonColor2Pressed,
      colorQuaternary: "#0000",
      colorQuaternaryHover: buttonColor2Hover,
      colorQuaternaryPressed: buttonColor2Pressed,
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
    self: self$F
  };
  const buttonLight$1 = buttonLight;
  const buttonDark = {
    name: "Button",
    common: commonDark,
    self(vars) {
      const commonSelf = self$F(vars);
      commonSelf.waveOpacity = "0.8";
      commonSelf.colorOpacitySecondary = "0.16";
      commonSelf.colorOpacitySecondaryHover = "0.2";
      commonSelf.colorOpacitySecondaryPressed = "0.12";
      return commonSelf;
    }
  };
  const buttonDark$1 = buttonDark;
  const style$1 = c([cB("button", `
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
  const buttonProps = Object.assign(Object.assign({}, useTheme.props), { color: String, textColor: String, text: Boolean, block: Boolean, loading: Boolean, disabled: Boolean, circle: Boolean, size: String, ghost: Boolean, round: Boolean, secondary: Boolean, tertiary: Boolean, quaternary: Boolean, strong: Boolean, focusable: {
    type: Boolean,
    default: true
  }, keyboard: {
    type: Boolean,
    default: true
  }, tag: {
    type: String,
    default: "button"
  }, type: {
    type: String,
    default: "default"
  }, dashed: Boolean, renderIcon: Function, iconPlacement: {
    type: String,
    default: "left"
  }, attrType: {
    type: String,
    default: "button"
  }, bordered: {
    type: Boolean,
    default: true
  }, onClick: [Function, Array], nativeFocusBehavior: {
    type: Boolean,
    default: !isSafari
  } });
  const Button = vue.defineComponent({
    name: "Button",
    props: buttonProps,
    setup(props) {
      const selfElRef = vue.ref(null);
      const waveElRef = vue.ref(null);
      const enterPressedRef = vue.ref(false);
      const showBorderRef = useMemo(() => {
        return !props.quaternary && !props.tertiary && !props.secondary && !props.text && (!props.color || props.ghost || props.dashed) && props.bordered;
      });
      const NButtonGroup = vue.inject(buttonGroupInjectionKey, {});
      const { mergedSizeRef } = useFormItem({}, {
        defaultSize: "medium",
        mergedSize: (NFormItem) => {
          const { size: size2 } = props;
          if (size2)
            return size2;
          const { size: buttonGroupSize } = NButtonGroup;
          if (buttonGroupSize)
            return buttonGroupSize;
          const { mergedSize: formItemSize } = NFormItem || {};
          if (formItemSize) {
            return formItemSize.value;
          }
          return "medium";
        }
      });
      const mergedFocusableRef = vue.computed(() => {
        return props.focusable && !props.disabled;
      });
      const handleMousedown = (e) => {
        var _a2;
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
          (_a2 = selfElRef.value) === null || _a2 === void 0 ? void 0 : _a2.focus({ preventScroll: true });
        }
      };
      const handleClick = (e) => {
        var _a2;
        if (!props.disabled && !props.loading) {
          const { onClick } = props;
          if (onClick)
            call(onClick, e);
          if (!props.text) {
            (_a2 = waveElRef.value) === null || _a2 === void 0 ? void 0 : _a2.play();
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
      const { inlineThemeDisabled, mergedClsPrefixRef, mergedRtlRef } = useConfig(props);
      const themeRef = useTheme("Button", "-button", style$1, buttonLight$1, props, mergedClsPrefixRef);
      const rtlEnabledRef = useRtl("Button", mergedRtlRef, mergedClsPrefixRef);
      const cssVarsRef = vue.computed(() => {
        const theme = themeRef.value;
        const { common: { cubicBezierEaseInOut: cubicBezierEaseInOut2, cubicBezierEaseOut }, self: self2 } = theme;
        const { rippleDuration, opacityDisabled, fontWeight, fontWeightStrong } = self2;
        const size2 = mergedSizeRef.value;
        const { dashed, type, ghost, text, color, round, circle, textColor, secondary, tertiary, quaternary, strong } = props;
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
        const { [createKey("height", size2)]: height, [createKey("fontSize", size2)]: fontSize2, [createKey("padding", size2)]: padding, [createKey("paddingRound", size2)]: paddingRound, [createKey("iconSize", size2)]: iconSize, [createKey("borderRadius", size2)]: borderRadius, [createKey("iconMargin", size2)]: iconMargin, waveOpacity } = self2;
        const sizeProps = {
          "--n-width": circle && !text ? height : "initial",
          "--n-height": text ? "initial" : height,
          "--n-font-size": fontSize2,
          "--n-padding": circle ? "initial" : text ? "initial" : round ? paddingRound : padding,
          "--n-icon-size": iconSize,
          "--n-icon-margin": iconMargin,
          "--n-border-radius": text ? "initial" : circle || round ? height : borderRadius
        };
        return Object.assign(Object.assign(Object.assign(Object.assign({ "--n-bezier": cubicBezierEaseInOut2, "--n-bezier-ease-out": cubicBezierEaseOut, "--n-ripple-duration": rippleDuration, "--n-opacity-disabled": opacityDisabled, "--n-wave-opacity": waveOpacity }, fontProps), colorProps), borderProps), sizeProps);
      });
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("button", vue.computed(() => {
        let hash = "";
        const { dashed, type, ghost, text, color, round, circle, textColor, secondary, tertiary, quaternary, strong } = props;
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
        const { value: size2 } = mergedSizeRef;
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
        customColorCssVars: vue.computed(() => {
          const { color } = props;
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
      const { mergedClsPrefix, tag: Component, onRender } = this;
      onRender === null || onRender === void 0 ? void 0 : onRender();
      const children = resolveWrappedSlot(this.$slots.default, (children2) => children2 && vue.h("span", { class: `${mergedClsPrefix}-button__content` }, children2));
      return vue.h(
        Component,
        { ref: "selfElRef", class: [
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
        ], tabindex: this.mergedFocusable ? 0 : -1, type: this.attrType, style: this.cssVars, disabled: this.disabled, onClick: this.handleClick, onBlur: this.handleBlur, onMousedown: this.handleMousedown, onKeyup: this.handleKeyup, onKeydown: this.handleKeydown },
        this.iconPlacement === "right" && children,
        vue.h(NFadeInExpandTransition, { width: true }, {
          default: () => resolveWrappedSlot(this.$slots.icon, (children2) => (this.loading || this.renderIcon || children2) && vue.h(
            "span",
            { class: `${mergedClsPrefix}-button__icon`, style: {
              margin: isSlotEmpty(this.$slots.default) ? "0" : ""
            } },
            vue.h(NIconSwitchTransition, null, {
              default: () => this.loading ? vue.h(NBaseLoading, { clsPrefix: mergedClsPrefix, key: "loading", class: `${mergedClsPrefix}-icon-slot`, strokeWidth: 20 }) : vue.h("div", { key: "icon", class: `${mergedClsPrefix}-icon-slot`, role: "none" }, this.renderIcon ? this.renderIcon() : children2)
            })
          ))
        }),
        this.iconPlacement === "left" && children,
        !this.text ? vue.h(NBaseWave, { ref: "waveElRef", clsPrefix: mergedClsPrefix }) : null,
        this.showBorder ? vue.h("div", { "aria-hidden": true, class: `${mergedClsPrefix}-button__border`, style: this.customColorCssVars }) : null,
        this.showBorder ? vue.h("div", { "aria-hidden": true, class: `${mergedClsPrefix}-button__state-border`, style: this.customColorCssVars }) : null
      );
    }
  });
  const NButton = Button;
  const commonVariables$e = {
    titleFontSize: "22px"
  };
  const self$E = (vars) => {
    const { borderRadius, fontSize: fontSize2, lineHeight: lineHeight2, textColor2, textColor1, textColorDisabled, dividerColor, fontWeightStrong, primaryColor, baseColor, hoverColor, cardColor, modalColor, popoverColor } = vars;
    return Object.assign(Object.assign({}, commonVariables$e), {
      borderRadius,
      borderColor: composite(cardColor, dividerColor),
      borderColorModal: composite(modalColor, dividerColor),
      borderColorPopover: composite(popoverColor, dividerColor),
      textColor: textColor2,
      titleFontWeight: fontWeightStrong,
      titleTextColor: textColor1,
      dayTextColor: textColorDisabled,
      fontSize: fontSize2,
      lineHeight: lineHeight2,
      dateColorCurrent: primaryColor,
      dateTextColorCurrent: baseColor,
      cellColorHover: composite(cardColor, hoverColor),
      cellColorHoverModal: composite(modalColor, hoverColor),
      cellColorHoverPopover: composite(popoverColor, hoverColor),
      cellColor: cardColor,
      cellColorModal: modalColor,
      cellColorPopover: popoverColor,
      barColor: primaryColor
    });
  };
  const calendarDark = {
    name: "Calendar",
    common: commonDark,
    peers: {
      Button: buttonDark$1
    },
    self: self$E
  };
  const calendarDark$1 = calendarDark;
  const self$D = (vars) => {
    const { fontSize: fontSize2, boxShadow2, popoverColor, textColor2, borderRadius, borderColor, heightSmall, heightMedium, heightLarge, fontSizeSmall, fontSizeMedium, fontSizeLarge, dividerColor } = vars;
    return {
      panelFontSize: fontSize2,
      boxShadow: boxShadow2,
      color: popoverColor,
      textColor: textColor2,
      borderRadius,
      border: `1px solid ${borderColor}`,
      heightSmall,
      heightMedium,
      heightLarge,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      dividerColor
    };
  };
  const colorPickerDark = {
    name: "ColorPicker",
    common: commonDark,
    peers: {
      Input: inputDark$1,
      Button: buttonDark$1
    },
    self: self$D
  };
  const colorPickerDark$1 = colorPickerDark;
  const commonVariables$d = {
    paddingSmall: "12px 16px 12px",
    paddingMedium: "19px 24px 20px",
    paddingLarge: "23px 32px 24px",
    paddingHuge: "27px 40px 28px",
    titleFontSizeSmall: "16px",
    titleFontSizeMedium: "18px",
    titleFontSizeLarge: "18px",
    titleFontSizeHuge: "18px",
    closeIconSize: "18px",
    closeSize: "22px"
  };
  const self$C = (vars) => {
    const { primaryColor, borderRadius, lineHeight: lineHeight2, fontSize: fontSize2, cardColor, textColor2, textColor1, dividerColor, fontWeightStrong, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, modalColor, boxShadow1, popoverColor, actionColor } = vars;
    return Object.assign(Object.assign({}, commonVariables$d), {
      lineHeight: lineHeight2,
      color: cardColor,
      colorModal: modalColor,
      colorPopover: popoverColor,
      colorTarget: primaryColor,
      colorEmbedded: actionColor,
      colorEmbeddedModal: actionColor,
      colorEmbeddedPopover: actionColor,
      textColor: textColor2,
      titleTextColor: textColor1,
      borderColor: dividerColor,
      actionColor,
      titleFontWeight: fontWeightStrong,
      closeColorHover,
      closeColorPressed,
      closeBorderRadius: borderRadius,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      fontSizeSmall: fontSize2,
      fontSizeMedium: fontSize2,
      fontSizeLarge: fontSize2,
      fontSizeHuge: fontSize2,
      boxShadow: boxShadow1,
      borderRadius
    });
  };
  const cardDark = {
    name: "Card",
    common: commonDark,
    self(vars) {
      const commonSelf = self$C(vars);
      const { cardColor, modalColor, popoverColor } = vars;
      commonSelf.colorEmbedded = cardColor;
      commonSelf.colorEmbeddedModal = modalColor;
      commonSelf.colorEmbeddedPopover = popoverColor;
      return commonSelf;
    }
  };
  const cardDark$1 = cardDark;
  const self$B = (vars) => {
    return {
      dotSize: "8px",
      dotColor: "rgba(255, 255, 255, .3)",
      dotColorActive: "rgba(255, 255, 255, 1)",
      dotColorFocus: "rgba(255, 255, 255, .5)",
      dotLineWidth: "16px",
      dotLineWidthActive: "24px",
      arrowColor: "#eee"
    };
  };
  const carouselDark = {
    name: "Carousel",
    common: commonDark,
    self: self$B
  };
  const carouselDark$1 = carouselDark;
  const commonVariables$c = {
    sizeSmall: "14px",
    sizeMedium: "16px",
    sizeLarge: "18px",
    labelPadding: "0 8px",
    labelFontWeight: "400"
  };
  const self$A = (vars) => {
    const { baseColor, inputColorDisabled, cardColor, modalColor, popoverColor, textColorDisabled, borderColor, primaryColor, textColor2, fontSizeSmall, fontSizeMedium, fontSizeLarge, borderRadiusSmall, lineHeight: lineHeight2 } = vars;
    return Object.assign(Object.assign({}, commonVariables$c), {
      labelLineHeight: lineHeight2,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      borderRadius: borderRadiusSmall,
      color: baseColor,
      colorChecked: primaryColor,
      colorDisabled: inputColorDisabled,
      colorDisabledChecked: inputColorDisabled,
      colorTableHeader: cardColor,
      colorTableHeaderModal: modalColor,
      colorTableHeaderPopover: popoverColor,
      checkMarkColor: baseColor,
      checkMarkColorDisabled: textColorDisabled,
      checkMarkColorDisabledChecked: textColorDisabled,
      border: `1px solid ${borderColor}`,
      borderDisabled: `1px solid ${borderColor}`,
      borderDisabledChecked: `1px solid ${borderColor}`,
      borderChecked: `1px solid ${primaryColor}`,
      borderFocus: `1px solid ${primaryColor}`,
      boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, { alpha: 0.3 })}`,
      textColor: textColor2,
      textColorDisabled
    });
  };
  const checkboxLight = {
    name: "Checkbox",
    common: commonLight,
    self: self$A
  };
  const checkboxLight$1 = checkboxLight;
  const checkboxDark = {
    name: "Checkbox",
    common: commonDark,
    self(vars) {
      const { cardColor } = vars;
      const commonSelf = self$A(vars);
      commonSelf.color = "#0000";
      commonSelf.checkMarkColor = cardColor;
      return commonSelf;
    }
  };
  const checkboxDark$1 = checkboxDark;
  const self$z = (vars) => {
    const { borderRadius, boxShadow2, popoverColor, textColor2, textColor3, primaryColor, textColorDisabled, dividerColor, hoverColor, fontSizeMedium, heightMedium } = vars;
    return {
      menuBorderRadius: borderRadius,
      menuColor: popoverColor,
      menuBoxShadow: boxShadow2,
      menuDividerColor: dividerColor,
      menuHeight: "calc(var(--n-option-height) * 6.6)",
      optionArrowColor: textColor3,
      optionHeight: heightMedium,
      optionFontSize: fontSizeMedium,
      optionColorHover: hoverColor,
      optionTextColor: textColor2,
      optionTextColorActive: primaryColor,
      optionTextColorDisabled: textColorDisabled,
      optionCheckMarkColor: primaryColor,
      loadingColor: primaryColor,
      columnWidth: "180px"
    };
  };
  const cascaderDark = {
    name: "Cascader",
    common: commonDark,
    peers: {
      InternalSelectMenu: internalSelectMenuDark$1,
      InternalSelection: internalSelectionDark$1,
      Scrollbar: scrollbarDark$1,
      Checkbox: checkboxDark$1,
      Empty: emptyLight$1
    },
    self: self$z
  };
  const cascaderDark$1 = cascaderDark;
  const CheckMark = vue.h(
    "svg",
    { viewBox: "0 0 64 64", class: "check-icon" },
    vue.h("path", { d: "M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z" })
  );
  const LineMark = vue.h(
    "svg",
    { viewBox: "0 0 100 100", class: "line-icon" },
    vue.h("path", { d: "M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z" })
  );
  const checkboxGroupInjectionKey = createInjectionKey("n-checkbox-group");
  const checkboxGroupProps = {
    min: Number,
    max: Number,
    size: String,
    value: Array,
    defaultValue: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    "onUpdate:value": [Function, Array],
    onUpdateValue: [Function, Array],
    onChange: [Function, Array]
  };
  const NCheckboxGroup = vue.defineComponent({
    name: "CheckboxGroup",
    props: checkboxGroupProps,
    setup(props) {
      const { mergedClsPrefixRef } = useConfig(props);
      const formItem = useFormItem(props);
      const { mergedSizeRef, mergedDisabledRef } = formItem;
      const uncontrolledValueRef = vue.ref(props.defaultValue);
      const controlledValueRef = vue.computed(() => props.value);
      const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
      const checkedCount = vue.computed(() => {
        var _a2;
        return ((_a2 = mergedValueRef.value) === null || _a2 === void 0 ? void 0 : _a2.length) || 0;
      });
      const valueSetRef = vue.computed(() => {
        if (Array.isArray(mergedValueRef.value)) {
          return new Set(mergedValueRef.value);
        }
        return /* @__PURE__ */ new Set();
      });
      function toggleCheckbox(checked, checkboxValue) {
        const { nTriggerFormInput, nTriggerFormChange } = formItem;
        const { onChange, "onUpdate:value": _onUpdateValue, onUpdateValue } = props;
        if (Array.isArray(mergedValueRef.value)) {
          const groupValue = Array.from(mergedValueRef.value);
          const index = groupValue.findIndex((value) => value === checkboxValue);
          if (checked) {
            if (!~index) {
              groupValue.push(checkboxValue);
              if (onUpdateValue) {
                call(onUpdateValue, groupValue, {
                  actionType: "check",
                  value: checkboxValue
                });
              }
              if (_onUpdateValue) {
                call(_onUpdateValue, groupValue, {
                  actionType: "check",
                  value: checkboxValue
                });
              }
              nTriggerFormInput();
              nTriggerFormChange();
              uncontrolledValueRef.value = groupValue;
              if (onChange)
                call(onChange, groupValue);
            }
          } else {
            if (~index) {
              groupValue.splice(index, 1);
              if (onUpdateValue) {
                call(onUpdateValue, groupValue, {
                  actionType: "uncheck",
                  value: checkboxValue
                });
              }
              if (_onUpdateValue) {
                call(_onUpdateValue, groupValue, {
                  actionType: "uncheck",
                  value: checkboxValue
                });
              }
              if (onChange)
                call(onChange, groupValue);
              uncontrolledValueRef.value = groupValue;
              nTriggerFormInput();
              nTriggerFormChange();
            }
          }
        } else {
          if (checked) {
            if (onUpdateValue) {
              call(onUpdateValue, [checkboxValue], {
                actionType: "check",
                value: checkboxValue
              });
            }
            if (_onUpdateValue) {
              call(_onUpdateValue, [checkboxValue], {
                actionType: "check",
                value: checkboxValue
              });
            }
            if (onChange)
              call(onChange, [checkboxValue]);
            uncontrolledValueRef.value = [checkboxValue];
            nTriggerFormInput();
            nTriggerFormChange();
          } else {
            if (onUpdateValue) {
              call(onUpdateValue, [], {
                actionType: "uncheck",
                value: checkboxValue
              });
            }
            if (_onUpdateValue) {
              call(_onUpdateValue, [], {
                actionType: "uncheck",
                value: checkboxValue
              });
            }
            if (onChange)
              call(onChange, []);
            uncontrolledValueRef.value = [];
            nTriggerFormInput();
            nTriggerFormChange();
          }
        }
      }
      vue.provide(checkboxGroupInjectionKey, {
        checkedCountRef: checkedCount,
        maxRef: vue.toRef(props, "max"),
        minRef: vue.toRef(props, "min"),
        valueSetRef,
        disabledRef: mergedDisabledRef,
        mergedSizeRef,
        toggleCheckbox
      });
      return {
        mergedClsPrefix: mergedClsPrefixRef
      };
    },
    render() {
      return vue.h("div", { class: `${this.mergedClsPrefix}-checkbox-group`, role: "group" }, this.$slots);
    }
  });
  const style = c([
    cB("checkbox", `
 line-height: var(--n-label-line-height);
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 --n-merged-color-table: var(--n-color-table);
 `, [c("&:hover", [cB("checkbox-box", [cE("border", {
      border: "var(--n-border-checked)"
    })])]), c("&:focus:not(:active)", [cB("checkbox-box", [cE("border", `
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]), cM("inside-table", [cB("checkbox-box", `
 background-color: var(--n-merged-color-table);
 `)]), cM("checked", [cB("checkbox-box", `
 background-color: var(--n-color-checked);
 `, [cB("checkbox-icon", [
      c(".check-icon", `
 opacity: 1;
 transform: scale(1);
 `)
    ])])]), cM("indeterminate", [cB("checkbox-box", [cB("checkbox-icon", [c(".check-icon", `
 opacity: 0;
 transform: scale(.5);
 `), c(".line-icon", `
 opacity: 1;
 transform: scale(1);
 `)])])]), cM("checked, indeterminate", [c("&:focus:not(:active)", [cB("checkbox-box", [cE("border", `
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]), cB("checkbox-box", `
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `, [cE("border", {
      border: "var(--n-border-checked)"
    })])]), cM("disabled", {
      cursor: "not-allowed"
    }, [cM("checked", [cB("checkbox-box", `
 background-color: var(--n-color-disabled-checked);
 `, [cE("border", {
      border: "var(--n-border-disabled-checked)"
    }), cB("checkbox-icon", [c(".check-icon, .line-icon", {
      fill: "var(--n-check-mark-color-disabled-checked)"
    })])])]), cB("checkbox-box", `
 background-color: var(--n-color-disabled);
 `, [cE("border", {
      border: "var(--n-border-disabled)"
    }), cB("checkbox-icon", [c(".check-icon, .line-icon", {
      fill: "var(--n-check-mark-color-disabled)"
    })])]), cE("label", {
      color: "var(--n-text-color-disabled)"
    })]), cB("checkbox-box-wrapper", `
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `), cB("checkbox-box", `
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `, [cE("border", `
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `), cB("checkbox-icon", `
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `, [c(".check-icon, .line-icon", `
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `), iconSwitchTransition({
      left: "1px",
      top: "1px"
    })])]), cE("label", `
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `, [c("&:empty", {
      display: "none"
    })])]),
    insideModal(cB("checkbox", `
 --n-merged-color-table: var(--n-color-table-modal);
 `)),
    insidePopover(cB("checkbox", `
 --n-merged-color-table: var(--n-color-table-popover);
 `))
  ]);
  const checkboxProps = Object.assign(Object.assign({}, useTheme.props), {
    size: String,
    checked: {
      type: [Boolean, String, Number],
      default: void 0
    },
    defaultChecked: {
      type: [Boolean, String, Number],
      default: false
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: void 0
    },
    indeterminate: Boolean,
    label: String,
    focusable: {
      type: Boolean,
      default: true
    },
    checkedValue: {
      type: [Boolean, String, Number],
      default: true
    },
    uncheckedValue: {
      type: [Boolean, String, Number],
      default: false
    },
    "onUpdate:checked": [Function, Array],
    onUpdateChecked: [Function, Array],
    privateInsideTable: Boolean,
    onChange: [Function, Array]
  });
  const NCheckbox = vue.defineComponent({
    name: "Checkbox",
    props: checkboxProps,
    setup(props) {
      const selfRef = vue.ref(null);
      const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = useConfig(props);
      const formItem = useFormItem(props, {
        mergedSize(NFormItem) {
          const { size: size2 } = props;
          if (size2 !== void 0)
            return size2;
          if (NCheckboxGroup2) {
            const { value: mergedSize } = NCheckboxGroup2.mergedSizeRef;
            if (mergedSize !== void 0) {
              return mergedSize;
            }
          }
          if (NFormItem) {
            const { mergedSize } = NFormItem;
            if (mergedSize !== void 0)
              return mergedSize.value;
          }
          return "medium";
        },
        mergedDisabled(NFormItem) {
          const { disabled } = props;
          if (disabled !== void 0)
            return disabled;
          if (NCheckboxGroup2) {
            if (NCheckboxGroup2.disabledRef.value)
              return true;
            const { maxRef: { value: max }, checkedCountRef } = NCheckboxGroup2;
            if (max !== void 0 && checkedCountRef.value >= max && !renderedCheckedRef.value) {
              return true;
            }
            const { minRef: { value: min } } = NCheckboxGroup2;
            if (min !== void 0 && checkedCountRef.value <= min && renderedCheckedRef.value) {
              return true;
            }
          }
          if (NFormItem) {
            return NFormItem.disabled.value;
          }
          return false;
        }
      });
      const { mergedDisabledRef, mergedSizeRef } = formItem;
      const NCheckboxGroup2 = vue.inject(checkboxGroupInjectionKey, null);
      const uncontrolledCheckedRef = vue.ref(props.defaultChecked);
      const controlledCheckedRef = vue.toRef(props, "checked");
      const mergedCheckedRef = useMergedState(controlledCheckedRef, uncontrolledCheckedRef);
      const renderedCheckedRef = useMemo(() => {
        if (NCheckboxGroup2) {
          const groupValueSet = NCheckboxGroup2.valueSetRef.value;
          if (groupValueSet && props.value !== void 0) {
            return groupValueSet.has(props.value);
          }
          return false;
        } else {
          return mergedCheckedRef.value === props.checkedValue;
        }
      });
      const themeRef = useTheme("Checkbox", "-checkbox", style, checkboxLight$1, props, mergedClsPrefixRef);
      function toggle(e) {
        if (NCheckboxGroup2 && props.value !== void 0) {
          NCheckboxGroup2.toggleCheckbox(!renderedCheckedRef.value, props.value);
        } else {
          const { onChange, "onUpdate:checked": _onUpdateCheck, onUpdateChecked } = props;
          const { nTriggerFormInput, nTriggerFormChange } = formItem;
          const nextChecked = renderedCheckedRef.value ? props.uncheckedValue : props.checkedValue;
          if (_onUpdateCheck) {
            call(_onUpdateCheck, nextChecked, e);
          }
          if (onUpdateChecked) {
            call(onUpdateChecked, nextChecked, e);
          }
          if (onChange)
            call(onChange, nextChecked, e);
          nTriggerFormInput();
          nTriggerFormChange();
          uncontrolledCheckedRef.value = nextChecked;
        }
      }
      function handleClick(e) {
        if (!mergedDisabledRef.value) {
          toggle(e);
        }
      }
      function handleKeyUp(e) {
        if (mergedDisabledRef.value)
          return;
        switch (e.key) {
          case " ":
          case "Enter":
            toggle(e);
        }
      }
      function handleKeyDown(e) {
        switch (e.key) {
          case " ":
            e.preventDefault();
        }
      }
      const exposedMethods = {
        focus: () => {
          var _a2;
          (_a2 = selfRef.value) === null || _a2 === void 0 ? void 0 : _a2.focus();
        },
        blur: () => {
          var _a2;
          (_a2 = selfRef.value) === null || _a2 === void 0 ? void 0 : _a2.blur();
        }
      };
      const rtlEnabledRef = useRtl("Checkbox", mergedRtlRef, mergedClsPrefixRef);
      const cssVarsRef = vue.computed(() => {
        const { value: mergedSize } = mergedSizeRef;
        const { common: { cubicBezierEaseInOut: cubicBezierEaseInOut2 }, self: { borderRadius, color, colorChecked, colorDisabled, colorTableHeader, colorTableHeaderModal, colorTableHeaderPopover, checkMarkColor, checkMarkColorDisabled, border, borderFocus, borderDisabled, borderChecked, boxShadowFocus, textColor, textColorDisabled, checkMarkColorDisabledChecked, colorDisabledChecked, borderDisabledChecked, labelPadding, labelLineHeight, labelFontWeight, [createKey("fontSize", mergedSize)]: fontSize2, [createKey("size", mergedSize)]: size2 } } = themeRef.value;
        return {
          "--n-label-line-height": labelLineHeight,
          "--n-label-font-weight": labelFontWeight,
          "--n-size": size2,
          "--n-bezier": cubicBezierEaseInOut2,
          "--n-border-radius": borderRadius,
          "--n-border": border,
          "--n-border-checked": borderChecked,
          "--n-border-focus": borderFocus,
          "--n-border-disabled": borderDisabled,
          "--n-border-disabled-checked": borderDisabledChecked,
          "--n-box-shadow-focus": boxShadowFocus,
          "--n-color": color,
          "--n-color-checked": colorChecked,
          "--n-color-table": colorTableHeader,
          "--n-color-table-modal": colorTableHeaderModal,
          "--n-color-table-popover": colorTableHeaderPopover,
          "--n-color-disabled": colorDisabled,
          "--n-color-disabled-checked": colorDisabledChecked,
          "--n-text-color": textColor,
          "--n-text-color-disabled": textColorDisabled,
          "--n-check-mark-color": checkMarkColor,
          "--n-check-mark-color-disabled": checkMarkColorDisabled,
          "--n-check-mark-color-disabled-checked": checkMarkColorDisabledChecked,
          "--n-font-size": fontSize2,
          "--n-label-padding": labelPadding
        };
      });
      const themeClassHandle = inlineThemeDisabled ? useThemeClass("checkbox", vue.computed(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
      return Object.assign(formItem, exposedMethods, {
        rtlEnabled: rtlEnabledRef,
        selfRef,
        mergedClsPrefix: mergedClsPrefixRef,
        mergedDisabled: mergedDisabledRef,
        renderedChecked: renderedCheckedRef,
        mergedTheme: themeRef,
        labelId: createId(),
        handleClick,
        handleKeyUp,
        handleKeyDown,
        cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
        themeClass: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.themeClass,
        onRender: themeClassHandle === null || themeClassHandle === void 0 ? void 0 : themeClassHandle.onRender
      });
    },
    render() {
      var _a2;
      const { $slots, renderedChecked, mergedDisabled, indeterminate, privateInsideTable, cssVars, labelId, label, mergedClsPrefix, focusable, handleKeyUp, handleKeyDown, handleClick } = this;
      (_a2 = this.onRender) === null || _a2 === void 0 ? void 0 : _a2.call(this);
      return vue.h(
        "div",
        { ref: "selfRef", class: [
          `${mergedClsPrefix}-checkbox`,
          this.themeClass,
          this.rtlEnabled && `${mergedClsPrefix}-checkbox--rtl`,
          renderedChecked && `${mergedClsPrefix}-checkbox--checked`,
          mergedDisabled && `${mergedClsPrefix}-checkbox--disabled`,
          indeterminate && `${mergedClsPrefix}-checkbox--indeterminate`,
          privateInsideTable && `${mergedClsPrefix}-checkbox--inside-table`
        ], tabindex: mergedDisabled || !focusable ? void 0 : 0, role: "checkbox", "aria-checked": indeterminate ? "mixed" : renderedChecked, "aria-labelledby": labelId, style: cssVars, onKeyup: handleKeyUp, onKeydown: handleKeyDown, onClick: handleClick, onMousedown: () => {
          on("selectstart", window, (e) => {
            e.preventDefault();
          }, {
            once: true
          });
        } },
        vue.h(
          "div",
          { class: `${mergedClsPrefix}-checkbox-box-wrapper` },
          "\xA0",
          vue.h(
            "div",
            { class: `${mergedClsPrefix}-checkbox-box` },
            vue.h(NIconSwitchTransition, null, {
              default: () => this.indeterminate ? vue.h("div", { key: "indeterminate", class: `${mergedClsPrefix}-checkbox-icon` }, LineMark) : vue.h("div", { key: "check", class: `${mergedClsPrefix}-checkbox-icon` }, CheckMark)
            }),
            vue.h("div", { class: `${mergedClsPrefix}-checkbox-box__border` })
          )
        ),
        label !== null || $slots.default ? vue.h("span", { class: `${mergedClsPrefix}-checkbox__label`, id: labelId }, $slots.default ? $slots.default() : label) : null
      );
    }
  });
  const codeDark = {
    name: "Code",
    common: commonDark,
    self(vars) {
      const { textColor2, fontSize: fontSize2, fontWeightStrong, textColor3 } = vars;
      return {
        textColor: textColor2,
        fontSize: fontSize2,
        fontWeightStrong,
        "mono-3": "#5c6370",
        "hue-1": "#56b6c2",
        "hue-2": "#61aeee",
        "hue-3": "#c678dd",
        "hue-4": "#98c379",
        "hue-5": "#e06c75",
        "hue-5-2": "#be5046",
        "hue-6": "#d19a66",
        "hue-6-2": "#e6c07b",
        lineNumberTextColor: textColor3
      };
    }
  };
  const codeDark$1 = codeDark;
  const self$y = (vars) => {
    const { fontWeight, textColor1, textColor2, textColorDisabled, dividerColor, fontSize: fontSize2 } = vars;
    return {
      titleFontSize: fontSize2,
      titleFontWeight: fontWeight,
      dividerColor,
      titleTextColor: textColor1,
      titleTextColorDisabled: textColorDisabled,
      fontSize: fontSize2,
      textColor: textColor2,
      arrowColor: textColor2,
      arrowColorDisabled: textColorDisabled,
      itemMargin: "16px 0 0 0",
      titlePadding: "16px 0 0 0"
    };
  };
  const collapseDark = {
    name: "Collapse",
    common: commonDark,
    self: self$y
  };
  const collapseDark$1 = collapseDark;
  const self$x = (vars) => {
    const { cubicBezierEaseInOut: cubicBezierEaseInOut2 } = vars;
    return {
      bezier: cubicBezierEaseInOut2
    };
  };
  const collapseTransitionDark = {
    name: "CollapseTransition",
    common: commonDark,
    self: self$x
  };
  const collapseTransitionDark$1 = collapseTransitionDark;
  const configProviderProps = {
    abstract: Boolean,
    bordered: {
      type: Boolean,
      default: void 0
    },
    clsPrefix: String,
    locale: Object,
    dateLocale: Object,
    namespace: String,
    rtl: Array,
    tag: {
      type: String,
      default: "div"
    },
    hljs: Object,
    katex: Object,
    theme: Object,
    themeOverrides: Object,
    componentOptions: Object,
    icons: Object,
    breakpoints: Object,
    preflightStyleDisabled: Boolean,
    inlineThemeDisabled: {
      type: Boolean,
      default: void 0
    },
    as: {
      type: String,
      validator: () => {
        warn$1("config-provider", "`as` is deprecated, please use `tag` instead.");
        return true;
      },
      default: void 0
    }
  };
  const NConfigProvider = vue.defineComponent({
    name: "ConfigProvider",
    alias: ["App"],
    props: configProviderProps,
    setup(props) {
      const NConfigProvider2 = vue.inject(configProviderInjectionKey, null);
      const mergedThemeRef = vue.computed(() => {
        const { theme } = props;
        if (theme === null)
          return void 0;
        const inheritedTheme = NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedThemeRef.value;
        return theme === void 0 ? inheritedTheme : inheritedTheme === void 0 ? theme : Object.assign({}, inheritedTheme, theme);
      });
      const mergedThemeOverridesRef = vue.computed(() => {
        const { themeOverrides } = props;
        if (themeOverrides === null)
          return void 0;
        if (themeOverrides === void 0) {
          return NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedThemeOverridesRef.value;
        } else {
          const inheritedThemeOverrides = NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedThemeOverridesRef.value;
          if (inheritedThemeOverrides === void 0) {
            return themeOverrides;
          } else {
            return merge$1({}, inheritedThemeOverrides, themeOverrides);
          }
        }
      });
      const mergedNamespaceRef = useMemo(() => {
        const { namespace: namespace2 } = props;
        return namespace2 === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedNamespaceRef.value : namespace2;
      });
      const mergedBorderedRef = useMemo(() => {
        const { bordered } = props;
        return bordered === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedBorderedRef.value : bordered;
      });
      const mergedIconsRef = vue.computed(() => {
        const { icons } = props;
        return icons === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedIconsRef.value : icons;
      });
      const mergedComponentPropsRef = vue.computed(() => {
        const { componentOptions } = props;
        if (componentOptions !== void 0)
          return componentOptions;
        return NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedComponentPropsRef.value;
      });
      const mergedClsPrefixRef = vue.computed(() => {
        const { clsPrefix } = props;
        if (clsPrefix !== void 0)
          return clsPrefix;
        return NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedClsPrefixRef.value;
      });
      const mergedRtlRef = vue.computed(() => {
        var _a2;
        const { rtl } = props;
        if (rtl === void 0) {
          return NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedRtlRef.value;
        }
        const rtlEnabledState = {};
        for (const rtlInfo of rtl) {
          rtlEnabledState[rtlInfo.name] = vue.markRaw(rtlInfo);
          (_a2 = rtlInfo.peers) === null || _a2 === void 0 ? void 0 : _a2.forEach((peerRtlInfo) => {
            if (!(peerRtlInfo.name in rtlEnabledState)) {
              rtlEnabledState[peerRtlInfo.name] = vue.markRaw(peerRtlInfo);
            }
          });
        }
        return rtlEnabledState;
      });
      const mergedBreakpointsRef = vue.computed(() => {
        return props.breakpoints || (NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedBreakpointsRef.value);
      });
      const inlineThemeDisabled = props.inlineThemeDisabled || (NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.inlineThemeDisabled);
      const preflightStyleDisabled = props.preflightStyleDisabled || (NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.preflightStyleDisabled);
      const mergedThemeHashRef = vue.computed(() => {
        const { value: theme } = mergedThemeRef;
        const { value: mergedThemeOverrides } = mergedThemeOverridesRef;
        const hasThemeOverrides = mergedThemeOverrides && Object.keys(mergedThemeOverrides).length !== 0;
        const themeName = theme === null || theme === void 0 ? void 0 : theme.name;
        if (themeName) {
          if (hasThemeOverrides) {
            return `${themeName}-${murmur2(JSON.stringify(mergedThemeOverridesRef.value))}`;
          }
          return themeName;
        } else {
          if (hasThemeOverrides) {
            return murmur2(JSON.stringify(mergedThemeOverridesRef.value));
          }
          return "";
        }
      });
      vue.provide(configProviderInjectionKey, {
        mergedThemeHashRef,
        mergedBreakpointsRef,
        mergedRtlRef,
        mergedIconsRef,
        mergedComponentPropsRef,
        mergedBorderedRef,
        mergedNamespaceRef,
        mergedClsPrefixRef,
        mergedLocaleRef: vue.computed(() => {
          const { locale: locale2 } = props;
          if (locale2 === null)
            return void 0;
          return locale2 === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedLocaleRef.value : locale2;
        }),
        mergedDateLocaleRef: vue.computed(() => {
          const { dateLocale } = props;
          if (dateLocale === null)
            return void 0;
          return dateLocale === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedDateLocaleRef.value : dateLocale;
        }),
        mergedHljsRef: vue.computed(() => {
          const { hljs } = props;
          return hljs === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedHljsRef.value : hljs;
        }),
        mergedKatexRef: vue.computed(() => {
          const { katex } = props;
          return katex === void 0 ? NConfigProvider2 === null || NConfigProvider2 === void 0 ? void 0 : NConfigProvider2.mergedKatexRef.value : katex;
        }),
        mergedThemeRef,
        mergedThemeOverridesRef,
        inlineThemeDisabled: inlineThemeDisabled || false,
        preflightStyleDisabled: preflightStyleDisabled || false
      });
      return {
        mergedClsPrefix: mergedClsPrefixRef,
        mergedBordered: mergedBorderedRef,
        mergedNamespace: mergedNamespaceRef,
        mergedTheme: mergedThemeRef,
        mergedThemeOverrides: mergedThemeOverridesRef
      };
    },
    render() {
      var _a2, _b, _c, _d;
      return !this.abstract ? vue.h(this.as || this.tag, {
        class: `${this.mergedClsPrefix || defaultClsPrefix}-config-provider`
      }, (_b = (_a2 = this.$slots).default) === null || _b === void 0 ? void 0 : _b.call(_a2)) : (_d = (_c = this.$slots).default) === null || _d === void 0 ? void 0 : _d.call(_c);
    }
  });
  const popselect = {
    name: "Popselect",
    common: commonDark,
    peers: {
      Popover: popoverDark$1,
      InternalSelectMenu: internalSelectMenuDark$1
    }
  };
  const popselectDark = popselect;
  function self$w(vars) {
    const { boxShadow2 } = vars;
    return {
      menuBoxShadow: boxShadow2
    };
  }
  const selectDark = {
    name: "Select",
    common: commonDark,
    peers: {
      InternalSelection: internalSelectionDark$1,
      InternalSelectMenu: internalSelectMenuDark$1
    },
    self: self$w
  };
  const selectDark$1 = selectDark;
  const commonVariables$b = {
    itemPaddingSmall: "0 4px",
    itemMarginSmall: "0 0 0 8px",
    itemMarginSmallRtl: "0 8px 0 0",
    itemPaddingMedium: "0 4px",
    itemMarginMedium: "0 0 0 8px",
    itemMarginMediumRtl: "0 8px 0 0",
    itemPaddingLarge: "0 4px",
    itemMarginLarge: "0 0 0 8px",
    itemMarginLargeRtl: "0 8px 0 0",
    buttonIconSizeSmall: "14px",
    buttonIconSizeMedium: "16px",
    buttonIconSizeLarge: "18px",
    inputWidthSmall: "60px",
    selectWidthSmall: "unset",
    inputMarginSmall: "0 0 0 8px",
    inputMarginSmallRtl: "0 8px 0 0",
    selectMarginSmall: "0 0 0 8px",
    prefixMarginSmall: "0 8px 0 0",
    suffixMarginSmall: "0 0 0 8px",
    inputWidthMedium: "60px",
    selectWidthMedium: "unset",
    inputMarginMedium: "0 0 0 8px",
    inputMarginMediumRtl: "0 8px 0 0",
    selectMarginMedium: "0 0 0 8px",
    prefixMarginMedium: "0 8px 0 0",
    suffixMarginMedium: "0 0 0 8px",
    inputWidthLarge: "60px",
    selectWidthLarge: "unset",
    inputMarginLarge: "0 0 0 8px",
    inputMarginLargeRtl: "0 8px 0 0",
    selectMarginLarge: "0 0 0 8px",
    prefixMarginLarge: "0 8px 0 0",
    suffixMarginLarge: "0 0 0 8px"
  };
  const self$v = (vars) => {
    const {
      textColor2,
      primaryColor,
      primaryColorHover,
      primaryColorPressed,
      inputColorDisabled,
      textColorDisabled,
      borderColor,
      borderRadius,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      heightTiny,
      heightSmall,
      heightMedium
    } = vars;
    return Object.assign(Object.assign({}, commonVariables$b), { buttonColor: "#0000", buttonColorHover: "#0000", buttonColorPressed: "#0000", buttonBorder: `1px solid ${borderColor}`, buttonBorderHover: `1px solid ${borderColor}`, buttonBorderPressed: `1px solid ${borderColor}`, buttonIconColor: textColor2, buttonIconColorHover: textColor2, buttonIconColorPressed: textColor2, itemTextColor: textColor2, itemTextColorHover: primaryColorHover, itemTextColorPressed: primaryColorPressed, itemTextColorActive: primaryColor, itemTextColorDisabled: textColorDisabled, itemColor: "#0000", itemColorHover: "#0000", itemColorPressed: "#0000", itemColorActive: "#0000", itemColorActiveHover: "#0000", itemColorDisabled: inputColorDisabled, itemBorder: "1px solid #0000", itemBorderHover: "1px solid #0000", itemBorderPressed: "1px solid #0000", itemBorderActive: `1px solid ${primaryColor}`, itemBorderDisabled: `1px solid ${borderColor}`, itemBorderRadius: borderRadius, itemSizeSmall: heightTiny, itemSizeMedium: heightSmall, itemSizeLarge: heightMedium, itemFontSizeSmall: fontSizeTiny, itemFontSizeMedium: fontSizeSmall, itemFontSizeLarge: fontSizeMedium, jumperFontSizeSmall: fontSizeTiny, jumperFontSizeMedium: fontSizeSmall, jumperFontSizeLarge: fontSizeMedium, jumperTextColor: textColor2, jumperTextColorDisabled: textColorDisabled });
  };
  const paginationDark = {
    name: "Pagination",
    common: commonDark,
    peers: {
      Select: selectDark$1,
      Input: inputDark$1,
      Popselect: popselectDark
    },
    self(vars) {
      const { primaryColor, opacity3 } = vars;
      const borderColorActive = changeColor(primaryColor, {
        alpha: Number(opacity3)
      });
      const commonSelf = self$v(vars);
      commonSelf.itemBorderActive = `1px solid ${borderColorActive}`;
      commonSelf.itemBorderDisabled = "1px solid #0000";
      return commonSelf;
    }
  };
  const paginationDark$1 = paginationDark;
  const commonVars$8 = {
    padding: "8px 14px"
  };
  const tooltipDark = {
    name: "Tooltip",
    common: commonDark,
    peers: {
      Popover: popoverDark$1
    },
    self(vars) {
      const { borderRadius, boxShadow2, popoverColor, textColor2 } = vars;
      return Object.assign(Object.assign({}, commonVars$8), { borderRadius, boxShadow: boxShadow2, color: popoverColor, textColor: textColor2 });
    }
  };
  const tooltipDark$1 = tooltipDark;
  const ellipsisDark = {
    name: "Ellipsis",
    common: commonDark,
    peers: {
      Tooltip: tooltipDark$1
    }
  };
  const ellipsisDark$1 = ellipsisDark;
  const commonVariables$a = {
    radioSizeSmall: "14px",
    radioSizeMedium: "16px",
    radioSizeLarge: "18px",
    labelPadding: "0 8px",
    labelFontWeight: "400"
  };
  const radioDark = {
    name: "Radio",
    common: commonDark,
    self(vars) {
      const { borderColor, primaryColor, baseColor, textColorDisabled, inputColorDisabled, textColor2, opacityDisabled, borderRadius, fontSizeSmall, fontSizeMedium, fontSizeLarge, heightSmall, heightMedium, heightLarge, lineHeight: lineHeight2 } = vars;
      return Object.assign(Object.assign({}, commonVariables$a), {
        labelLineHeight: lineHeight2,
        buttonHeightSmall: heightSmall,
        buttonHeightMedium: heightMedium,
        buttonHeightLarge: heightLarge,
        fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        boxShadow: `inset 0 0 0 1px ${borderColor}`,
        boxShadowActive: `inset 0 0 0 1px ${primaryColor}`,
        boxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${changeColor(primaryColor, { alpha: 0.3 })}`,
        boxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
        boxShadowDisabled: `inset 0 0 0 1px ${borderColor}`,
        color: "#0000",
        colorDisabled: inputColorDisabled,
        colorActive: "#0000",
        textColor: textColor2,
        textColorDisabled,
        dotColorActive: primaryColor,
        dotColorDisabled: borderColor,
        buttonBorderColor: borderColor,
        buttonBorderColorActive: primaryColor,
        buttonBorderColorHover: primaryColor,
        buttonColor: "#0000",
        buttonColorActive: primaryColor,
        buttonTextColor: textColor2,
        buttonTextColorActive: baseColor,
        buttonTextColorHover: primaryColor,
        opacityDisabled,
        buttonBoxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${changeColor(primaryColor, { alpha: 0.3 })}`,
        buttonBoxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
        buttonBoxShadow: "inset 0 0 0 1px #0000",
        buttonBorderRadius: borderRadius
      });
    }
  };
  const radioDark$1 = radioDark;
  const commonVariables$9 = {
    padding: "4px 0",
    optionIconSizeSmall: "14px",
    optionIconSizeMedium: "16px",
    optionIconSizeLarge: "16px",
    optionIconSizeHuge: "18px",
    optionSuffixWidthSmall: "14px",
    optionSuffixWidthMedium: "14px",
    optionSuffixWidthLarge: "16px",
    optionSuffixWidthHuge: "16px",
    optionIconSuffixWidthSmall: "32px",
    optionIconSuffixWidthMedium: "32px",
    optionIconSuffixWidthLarge: "36px",
    optionIconSuffixWidthHuge: "36px",
    optionPrefixWidthSmall: "14px",
    optionPrefixWidthMedium: "14px",
    optionPrefixWidthLarge: "16px",
    optionPrefixWidthHuge: "16px",
    optionIconPrefixWidthSmall: "36px",
    optionIconPrefixWidthMedium: "36px",
    optionIconPrefixWidthLarge: "40px",
    optionIconPrefixWidthHuge: "40px"
  };
  const self$u = (vars) => {
    const { primaryColor, textColor2, dividerColor, hoverColor, popoverColor, invertedColor, borderRadius, fontSizeSmall, fontSizeMedium, fontSizeLarge, fontSizeHuge, heightSmall, heightMedium, heightLarge, heightHuge, textColor3, opacityDisabled } = vars;
    return Object.assign(Object.assign({}, commonVariables$9), {
      optionHeightSmall: heightSmall,
      optionHeightMedium: heightMedium,
      optionHeightLarge: heightLarge,
      optionHeightHuge: heightHuge,
      borderRadius,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      fontSizeHuge,
      optionTextColor: textColor2,
      optionTextColorHover: textColor2,
      optionTextColorActive: primaryColor,
      optionTextColorChildActive: primaryColor,
      color: popoverColor,
      dividerColor,
      suffixColor: textColor2,
      prefixColor: textColor2,
      optionColorHover: hoverColor,
      optionColorActive: changeColor(primaryColor, { alpha: 0.1 }),
      groupHeaderTextColor: textColor3,
      optionTextColorInverted: "#BBB",
      optionTextColorHoverInverted: "#FFF",
      optionTextColorActiveInverted: "#FFF",
      optionTextColorChildActiveInverted: "#FFF",
      colorInverted: invertedColor,
      dividerColorInverted: "#BBB",
      suffixColorInverted: "#BBB",
      prefixColorInverted: "#BBB",
      optionColorHoverInverted: primaryColor,
      optionColorActiveInverted: primaryColor,
      groupHeaderTextColorInverted: "#AAA",
      optionOpacityDisabled: opacityDisabled
    });
  };
  const dropdownDark = {
    name: "Dropdown",
    common: commonDark,
    peers: {
      Popover: popoverDark$1
    },
    self(vars) {
      const { primaryColorSuppl, primaryColor, popoverColor } = vars;
      const commonSelf = self$u(vars);
      commonSelf.colorInverted = popoverColor;
      commonSelf.optionColorActive = changeColor(primaryColor, { alpha: 0.15 });
      commonSelf.optionColorActiveInverted = primaryColorSuppl;
      commonSelf.optionColorHoverInverted = primaryColorSuppl;
      return commonSelf;
    }
  };
  const dropdownDark$1 = dropdownDark;
  const commonVariables$8 = {
    thPaddingSmall: "8px",
    thPaddingMedium: "12px",
    thPaddingLarge: "12px",
    tdPaddingSmall: "8px",
    tdPaddingMedium: "12px",
    tdPaddingLarge: "12px",
    sorterSize: "15px",
    resizableContainerSize: "8px",
    resizableSize: "2px",
    filterSize: "15px",
    paginationMargin: "12px 0 0 0",
    emptyPadding: "48px 0",
    actionPadding: "8px 12px",
    actionButtonMargin: "0 8px 0 0"
  };
  const self$t = (vars) => {
    const { cardColor, modalColor, popoverColor, textColor2, textColor1, tableHeaderColor, tableColorHover, iconColor, primaryColor, fontWeightStrong, borderRadius, lineHeight: lineHeight2, fontSizeSmall, fontSizeMedium, fontSizeLarge, dividerColor, heightSmall, opacityDisabled, tableColorStriped } = vars;
    return Object.assign(Object.assign({}, commonVariables$8), {
      actionDividerColor: dividerColor,
      lineHeight: lineHeight2,
      borderRadius,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      borderColor: composite(cardColor, dividerColor),
      tdColorHover: composite(cardColor, tableColorHover),
      tdColorStriped: composite(cardColor, tableColorStriped),
      thColor: composite(cardColor, tableHeaderColor),
      thColorHover: composite(composite(cardColor, tableHeaderColor), tableColorHover),
      tdColor: cardColor,
      tdTextColor: textColor2,
      thTextColor: textColor1,
      thFontWeight: fontWeightStrong,
      thButtonColorHover: tableColorHover,
      thIconColor: iconColor,
      thIconColorActive: primaryColor,
      borderColorModal: composite(modalColor, dividerColor),
      tdColorHoverModal: composite(modalColor, tableColorHover),
      tdColorStripedModal: composite(modalColor, tableColorStriped),
      thColorModal: composite(modalColor, tableHeaderColor),
      thColorHoverModal: composite(composite(modalColor, tableHeaderColor), tableColorHover),
      tdColorModal: modalColor,
      borderColorPopover: composite(popoverColor, dividerColor),
      tdColorHoverPopover: composite(popoverColor, tableColorHover),
      tdColorStripedPopover: composite(popoverColor, tableColorStriped),
      thColorPopover: composite(popoverColor, tableHeaderColor),
      thColorHoverPopover: composite(composite(popoverColor, tableHeaderColor), tableColorHover),
      tdColorPopover: popoverColor,
      boxShadowBefore: "inset -12px 0 8px -12px rgba(0, 0, 0, .18)",
      boxShadowAfter: "inset 12px 0 8px -12px rgba(0, 0, 0, .18)",
      loadingColor: primaryColor,
      loadingSize: heightSmall,
      opacityLoading: opacityDisabled
    });
  };
  const dataTableDark = {
    name: "DataTable",
    common: commonDark,
    peers: {
      Button: buttonDark$1,
      Checkbox: checkboxDark$1,
      Radio: radioDark$1,
      Pagination: paginationDark$1,
      Scrollbar: scrollbarDark$1,
      Empty: emptyDark$1,
      Popover: popoverDark$1,
      Ellipsis: ellipsisDark$1,
      Dropdown: dropdownDark$1
    },
    self(vars) {
      const commonSelf = self$t(vars);
      commonSelf.boxShadowAfter = "inset 12px 0 8px -12px rgba(0, 0, 0, .36)";
      commonSelf.boxShadowBefore = "inset -12px 0 8px -12px rgba(0, 0, 0, .36)";
      return commonSelf;
    }
  };
  const dataTableDark$1 = dataTableDark;
  const self$s = (vars) => {
    const { textColorBase, opacity1, opacity2, opacity3, opacity4, opacity5 } = vars;
    return {
      color: textColorBase,
      opacity1Depth: opacity1,
      opacity2Depth: opacity2,
      opacity3Depth: opacity3,
      opacity4Depth: opacity4,
      opacity5Depth: opacity5
    };
  };
  const iconDark$1 = {
    name: "Icon",
    common: commonDark,
    self: self$s
  };
  const iconDark$2 = iconDark$1;
  const commonVars$7 = {
    itemFontSize: "12px",
    itemHeight: "36px",
    itemWidth: "52px",
    panelActionPadding: "8px 0"
  };
  const self$r = (vars) => {
    const { popoverColor, textColor2, primaryColor, hoverColor, dividerColor, opacityDisabled, boxShadow2, borderRadius, iconColor, iconColorDisabled } = vars;
    return Object.assign(Object.assign({}, commonVars$7), {
      panelColor: popoverColor,
      panelBoxShadow: boxShadow2,
      panelDividerColor: dividerColor,
      itemTextColor: textColor2,
      itemTextColorActive: primaryColor,
      itemColorHover: hoverColor,
      itemOpacityDisabled: opacityDisabled,
      itemBorderRadius: borderRadius,
      borderRadius,
      iconColor,
      iconColorDisabled
    });
  };
  const timePickerDark = {
    name: "TimePicker",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1,
      Button: buttonDark$1,
      Input: inputDark$1
    },
    self: self$r
  };
  const timePickerDark$1 = timePickerDark;
  const commonVars$6 = {
    itemSize: "24px",
    itemCellWidth: "38px",
    itemCellHeight: "32px",
    scrollItemWidth: "80px",
    scrollItemHeight: "40px",
    panelExtraFooterPadding: "8px 12px",
    panelActionPadding: "8px 12px",
    calendarTitlePadding: "0",
    calendarTitleHeight: "28px",
    arrowSize: "14px",
    panelHeaderPadding: "8px 12px",
    calendarDaysHeight: "32px",
    calendarTitleGridTempateColumns: "28px 28px 1fr 28px 28px",
    calendarLeftPaddingDate: "6px 12px 4px 12px",
    calendarLeftPaddingDatetime: "4px 12px",
    calendarLeftPaddingDaterange: "6px 12px 4px 12px",
    calendarLeftPaddingDatetimerange: "4px 12px",
    calendarLeftPaddingMonth: "0",
    calendarLeftPaddingYear: "0",
    calendarLeftPaddingQuarter: "0",
    calendarLeftPaddingMonthrange: "0",
    calendarLeftPaddingQuarterrange: "0",
    calendarLeftPaddingYearrange: "0",
    calendarRightPaddingDate: "6px 12px 4px 12px",
    calendarRightPaddingDatetime: "4px 12px",
    calendarRightPaddingDaterange: "6px 12px 4px 12px",
    calendarRightPaddingDatetimerange: "4px 12px",
    calendarRightPaddingMonth: "0",
    calendarRightPaddingYear: "0",
    calendarRightPaddingQuarter: "0",
    calendarRightPaddingMonthrange: "0",
    calendarRightPaddingQuarterrange: "0",
    calendarRightPaddingYearrange: "0"
  };
  const self$q = (vars) => {
    const { hoverColor, fontSize: fontSize2, textColor2, textColorDisabled, popoverColor, primaryColor, borderRadiusSmall, iconColor, iconColorDisabled, textColor1, dividerColor, boxShadow2, borderRadius, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, commonVars$6), {
      itemFontSize: fontSize2,
      calendarDaysFontSize: fontSize2,
      calendarTitleFontSize: fontSize2,
      itemTextColor: textColor2,
      itemTextColorDisabled: textColorDisabled,
      itemTextColorActive: popoverColor,
      itemTextColorCurrent: primaryColor,
      itemColorIncluded: changeColor(primaryColor, { alpha: 0.1 }),
      itemColorHover: hoverColor,
      itemColorDisabled: hoverColor,
      itemColorActive: primaryColor,
      itemBorderRadius: borderRadiusSmall,
      panelColor: popoverColor,
      panelTextColor: textColor2,
      arrowColor: iconColor,
      calendarTitleTextColor: textColor1,
      calendarTitleColorHover: hoverColor,
      calendarDaysTextColor: textColor2,
      panelHeaderDividerColor: dividerColor,
      calendarDaysDividerColor: dividerColor,
      calendarDividerColor: dividerColor,
      panelActionDividerColor: dividerColor,
      panelBoxShadow: boxShadow2,
      panelBorderRadius: borderRadius,
      calendarTitleFontWeight: fontWeightStrong,
      scrollItemBorderRadius: borderRadius,
      iconColor,
      iconColorDisabled
    });
  };
  const datePickerDark = {
    name: "DatePicker",
    common: commonDark,
    peers: {
      Input: inputDark$1,
      Button: buttonDark$1,
      TimePicker: timePickerDark$1,
      Scrollbar: scrollbarDark$1
    },
    self(vars) {
      const { popoverColor, hoverColor, primaryColor } = vars;
      const commonSelf = self$q(vars);
      commonSelf.itemColorDisabled = composite(popoverColor, hoverColor);
      commonSelf.itemColorIncluded = changeColor(primaryColor, { alpha: 0.15 });
      commonSelf.itemColorHover = composite(popoverColor, hoverColor);
      return commonSelf;
    }
  };
  const datePickerDark$1 = datePickerDark;
  const commonVariables$7 = {
    thPaddingBorderedSmall: "8px 12px",
    thPaddingBorderedMedium: "12px 16px",
    thPaddingBorderedLarge: "16px 24px",
    thPaddingSmall: "0",
    thPaddingMedium: "0",
    thPaddingLarge: "0",
    tdPaddingBorderedSmall: "8px 12px",
    tdPaddingBorderedMedium: "12px 16px",
    tdPaddingBorderedLarge: "16px 24px",
    tdPaddingSmall: "0 0 8px 0",
    tdPaddingMedium: "0 0 12px 0",
    tdPaddingLarge: "0 0 16px 0"
  };
  const self$p = (vars) => {
    const { tableHeaderColor, textColor2, textColor1, cardColor, modalColor, popoverColor, dividerColor, borderRadius, fontWeightStrong, lineHeight: lineHeight2, fontSizeSmall, fontSizeMedium, fontSizeLarge } = vars;
    return Object.assign(Object.assign({}, commonVariables$7), {
      lineHeight: lineHeight2,
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      titleTextColor: textColor1,
      thColor: composite(cardColor, tableHeaderColor),
      thColorModal: composite(modalColor, tableHeaderColor),
      thColorPopover: composite(popoverColor, tableHeaderColor),
      thTextColor: textColor1,
      thFontWeight: fontWeightStrong,
      tdTextColor: textColor2,
      tdColor: cardColor,
      tdColorModal: modalColor,
      tdColorPopover: popoverColor,
      borderColor: composite(cardColor, dividerColor),
      borderColorModal: composite(modalColor, dividerColor),
      borderColorPopover: composite(popoverColor, dividerColor),
      borderRadius
    });
  };
  const descriptionsDark = {
    name: "Descriptions",
    common: commonDark,
    self: self$p
  };
  const descriptionsDark$1 = descriptionsDark;
  const commonVars$5 = {
    titleFontSize: "18px",
    padding: "16px 28px 20px 28px",
    iconSize: "28px",
    actionSpace: "12px",
    contentMargin: "8px 0 16px 0",
    iconMargin: "0 4px 0 0",
    iconMarginIconTop: "4px 0 8px 0",
    closeSize: "22px",
    closeIconSize: "18px",
    closeMargin: "20px 26px 0 0",
    closeMarginIconTop: "10px 16px 0 0"
  };
  const self$o = (vars) => {
    const { textColor1, textColor2, modalColor, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, infoColor, successColor, warningColor, errorColor, primaryColor, dividerColor, borderRadius, fontWeightStrong, lineHeight: lineHeight2, fontSize: fontSize2 } = vars;
    return Object.assign(Object.assign({}, commonVars$5), {
      fontSize: fontSize2,
      lineHeight: lineHeight2,
      border: `1px solid ${dividerColor}`,
      titleTextColor: textColor1,
      textColor: textColor2,
      color: modalColor,
      closeColorHover,
      closeColorPressed,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeBorderRadius: borderRadius,
      iconColor: primaryColor,
      iconColorInfo: infoColor,
      iconColorSuccess: successColor,
      iconColorWarning: warningColor,
      iconColorError: errorColor,
      borderRadius,
      titleFontWeight: fontWeightStrong
    });
  };
  const dialogDark = {
    name: "Dialog",
    common: commonDark,
    peers: {
      Button: buttonDark$1
    },
    self: self$o
  };
  const dialogDark$1 = dialogDark;
  const self$n = (vars) => {
    const { modalColor, textColor2, boxShadow3 } = vars;
    return {
      color: modalColor,
      textColor: textColor2,
      boxShadow: boxShadow3
    };
  };
  const modalDark = {
    name: "Modal",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1,
      Dialog: dialogDark$1,
      Card: cardDark$1
    },
    self: self$n
  };
  const modalDark$1 = modalDark;
  const self$m = (vars) => {
    const { textColor1, dividerColor, fontWeightStrong } = vars;
    return {
      textColor: textColor1,
      color: dividerColor,
      fontWeight: fontWeightStrong
    };
  };
  const dividerDark = {
    name: "Divider",
    common: commonDark,
    self: self$m
  };
  const dividerDark$1 = dividerDark;
  const self$l = (vars) => {
    const { modalColor, textColor1, textColor2, boxShadow3, lineHeight: lineHeight2, fontWeightStrong, dividerColor, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, borderRadius, primaryColorHover } = vars;
    return {
      bodyPadding: "16px 24px",
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
  const drawerDark = {
    name: "Drawer",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1
    },
    self: self$l
  };
  const drawerDark$1 = drawerDark;
  const commonVariables$6 = {
    actionMargin: "0 0 0 20px",
    actionMarginRtl: "0 20px 0 0"
  };
  const dynamicInputDark = {
    name: "DynamicInput",
    common: commonDark,
    peers: {
      Input: inputDark$1,
      Button: buttonDark$1
    },
    self() {
      return commonVariables$6;
    }
  };
  const dynamicInputDark$1 = dynamicInputDark;
  const commonVars$4 = {
    gapSmall: "4px 8px",
    gapMedium: "8px 12px",
    gapLarge: "12px 16px"
  };
  const spaceDark = {
    name: "Space",
    self() {
      return commonVars$4;
    }
  };
  const spaceDark$1 = spaceDark;
  const dynamicTagsDark = {
    name: "DynamicTags",
    common: commonDark,
    peers: {
      Input: inputDark$1,
      Button: buttonDark$1,
      Tag: tagDark$1,
      Space: spaceDark$1
    },
    self() {
      return {
        inputWidth: "64px"
      };
    }
  };
  const dynamicTagsDark$1 = dynamicTagsDark;
  const elementDark = {
    name: "Element",
    common: commonDark
  };
  const elementDark$1 = elementDark;
  const commonVariables$5 = {
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
  const self$k = (vars) => {
    const { heightSmall, heightMedium, heightLarge, textColor1, errorColor, warningColor, lineHeight: lineHeight2, textColor3 } = vars;
    return Object.assign(Object.assign({}, commonVariables$5), { blankHeightSmall: heightSmall, blankHeightMedium: heightMedium, blankHeightLarge: heightLarge, lineHeight: lineHeight2, labelTextColor: textColor1, asteriskColor: errorColor, feedbackTextColorError: errorColor, feedbackTextColorWarning: warningColor, feedbackTextColor: textColor3 });
  };
  const formItemDark = {
    name: "Form",
    common: commonDark,
    self: self$k
  };
  const formDark = formItemDark;
  const gradientTextDark = {
    name: "GradientText",
    common: commonDark,
    self(vars) {
      const { primaryColor, successColor, warningColor, errorColor, infoColor, primaryColorSuppl, successColorSuppl, warningColorSuppl, errorColorSuppl, infoColorSuppl, fontWeightStrong } = vars;
      return {
        fontWeight: fontWeightStrong,
        rotate: "252deg",
        colorStartPrimary: primaryColor,
        colorEndPrimary: primaryColorSuppl,
        colorStartInfo: infoColor,
        colorEndInfo: infoColorSuppl,
        colorStartWarning: warningColor,
        colorEndWarning: warningColorSuppl,
        colorStartError: errorColor,
        colorEndError: errorColorSuppl,
        colorStartSuccess: successColor,
        colorEndSuccess: successColorSuppl
      };
    }
  };
  const gradientTextDark$1 = gradientTextDark;
  const self$j = (vars) => {
    const { primaryColor, baseColor } = vars;
    return {
      color: primaryColor,
      iconColor: baseColor
    };
  };
  const iconDark = {
    name: "IconWrapper",
    common: commonDark,
    self: self$j
  };
  const iconWrapperDark = iconDark;
  const commonVars$3 = {
    closeMargin: "16px 12px",
    closeSize: "20px",
    closeIconSize: "16px",
    width: "365px",
    padding: "16px",
    titleFontSize: "16px",
    metaFontSize: "12px",
    descriptionFontSize: "12px"
  };
  const self$i = (vars) => {
    const { textColor2, successColor, infoColor, warningColor, errorColor, popoverColor, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, textColor1, textColor3, borderRadius, fontWeightStrong, boxShadow2, lineHeight: lineHeight2, fontSize: fontSize2 } = vars;
    return Object.assign(Object.assign({}, commonVars$3), {
      borderRadius,
      lineHeight: lineHeight2,
      fontSize: fontSize2,
      headerFontWeight: fontWeightStrong,
      iconColor: textColor2,
      iconColorSuccess: successColor,
      iconColorInfo: infoColor,
      iconColorWarning: warningColor,
      iconColorError: errorColor,
      color: popoverColor,
      textColor: textColor2,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeBorderRadius: borderRadius,
      closeColorHover,
      closeColorPressed,
      headerTextColor: textColor1,
      descriptionTextColor: textColor3,
      actionTextColor: textColor2,
      boxShadow: boxShadow2
    });
  };
  const notificationDark = {
    name: "Notification",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1
    },
    self: self$i
  };
  const notificationDark$1 = notificationDark;
  const commonVariables$4 = {
    margin: "0 0 8px 0",
    padding: "10px 20px",
    maxWidth: "720px",
    minWidth: "420px",
    iconMargin: "0 10px 0 0",
    closeMargin: "0 0 0 10px",
    closeSize: "20px",
    closeIconSize: "16px",
    iconSize: "20px",
    fontSize: "14px"
  };
  const self$h = (vars) => {
    const { textColor2, closeIconColor, closeIconColorHover, closeIconColorPressed, infoColor, successColor, errorColor, warningColor, popoverColor, boxShadow2, primaryColor, lineHeight: lineHeight2, borderRadius, closeColorHover, closeColorPressed } = vars;
    return Object.assign(Object.assign({}, commonVariables$4), {
      closeBorderRadius: borderRadius,
      textColor: textColor2,
      textColorInfo: textColor2,
      textColorSuccess: textColor2,
      textColorError: textColor2,
      textColorWarning: textColor2,
      textColorLoading: textColor2,
      color: popoverColor,
      colorInfo: popoverColor,
      colorSuccess: popoverColor,
      colorError: popoverColor,
      colorWarning: popoverColor,
      colorLoading: popoverColor,
      boxShadow: boxShadow2,
      boxShadowInfo: boxShadow2,
      boxShadowSuccess: boxShadow2,
      boxShadowError: boxShadow2,
      boxShadowWarning: boxShadow2,
      boxShadowLoading: boxShadow2,
      iconColor: textColor2,
      iconColorInfo: infoColor,
      iconColorSuccess: successColor,
      iconColorWarning: warningColor,
      iconColorError: errorColor,
      iconColorLoading: primaryColor,
      closeColorHover,
      closeColorPressed,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHoverInfo: closeColorHover,
      closeColorPressedInfo: closeColorPressed,
      closeIconColorInfo: closeIconColor,
      closeIconColorHoverInfo: closeIconColorHover,
      closeIconColorPressedInfo: closeIconColorPressed,
      closeColorHoverSuccess: closeColorHover,
      closeColorPressedSuccess: closeColorPressed,
      closeIconColorSuccess: closeIconColor,
      closeIconColorHoverSuccess: closeIconColorHover,
      closeIconColorPressedSuccess: closeIconColorPressed,
      closeColorHoverError: closeColorHover,
      closeColorPressedError: closeColorPressed,
      closeIconColorError: closeIconColor,
      closeIconColorHoverError: closeIconColorHover,
      closeIconColorPressedError: closeIconColorPressed,
      closeColorHoverWarning: closeColorHover,
      closeColorPressedWarning: closeColorPressed,
      closeIconColorWarning: closeIconColor,
      closeIconColorHoverWarning: closeIconColorHover,
      closeIconColorPressedWarning: closeIconColorPressed,
      closeColorHoverLoading: closeColorHover,
      closeColorPressedLoading: closeColorPressed,
      closeIconColorLoading: closeIconColor,
      closeIconColorHoverLoading: closeIconColorHover,
      closeIconColorPressedLoading: closeIconColorPressed,
      loadingColor: primaryColor,
      lineHeight: lineHeight2,
      borderRadius
    });
  };
  const messageDark = {
    name: "Message",
    common: commonDark,
    self: self$h
  };
  const messageDark$1 = messageDark;
  const buttonGroupDark = {
    name: "ButtonGroup",
    common: commonDark
  };
  const buttonGroupDark$1 = buttonGroupDark;
  const inputNumberDark = {
    name: "InputNumber",
    common: commonDark,
    peers: {
      Button: buttonDark$1,
      Input: inputDark$1
    },
    self(vars) {
      const { textColorDisabled } = vars;
      return {
        iconColorDisabled: textColorDisabled
      };
    }
  };
  const inputNumberDark$1 = inputNumberDark;
  const layoutDark = {
    name: "Layout",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1
    },
    self(vars) {
      const { textColor2, bodyColor, popoverColor, cardColor, dividerColor, scrollbarColor, scrollbarColorHover } = vars;
      return {
        textColor: textColor2,
        textColorInverted: textColor2,
        color: bodyColor,
        colorEmbedded: bodyColor,
        headerColor: cardColor,
        headerColorInverted: cardColor,
        footerColor: cardColor,
        footerColorInverted: cardColor,
        headerBorderColor: dividerColor,
        headerBorderColorInverted: dividerColor,
        footerBorderColor: dividerColor,
        footerBorderColorInverted: dividerColor,
        siderBorderColor: dividerColor,
        siderBorderColorInverted: dividerColor,
        siderColor: cardColor,
        siderColorInverted: cardColor,
        siderToggleButtonBorder: "1px solid transparent",
        siderToggleButtonColor: popoverColor,
        siderToggleButtonIconColor: textColor2,
        siderToggleButtonIconColorInverted: textColor2,
        siderToggleBarColor: composite(bodyColor, scrollbarColor),
        siderToggleBarColorHover: composite(bodyColor, scrollbarColorHover),
        __invertScrollbar: "false"
      };
    }
  };
  const layoutDark$1 = layoutDark;
  const self$g = (vars) => {
    const { textColor2, cardColor, modalColor, popoverColor, dividerColor, borderRadius, fontSize: fontSize2, hoverColor } = vars;
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
  const listDark$1 = {
    name: "List",
    common: commonDark,
    self: self$g
  };
  const listDark$2 = listDark$1;
  const loadingBarDark = {
    name: "LoadingBar",
    common: commonDark,
    self(vars) {
      const { primaryColor } = vars;
      return {
        colorError: "red",
        colorLoading: primaryColor,
        height: "2px"
      };
    }
  };
  const loadingBarDark$1 = loadingBarDark;
  const logDark = {
    name: "Log",
    common: commonDark,
    peers: {
      Scrollbar: scrollbarDark$1,
      Code: codeDark$1
    },
    self(vars) {
      const { textColor2, inputColor, fontSize: fontSize2, primaryColor } = vars;
      return {
        loaderFontSize: fontSize2,
        loaderTextColor: textColor2,
        loaderColor: inputColor,
        loaderBorder: "1px solid #0000",
        loadingColor: primaryColor
      };
    }
  };
  const logDark$1 = logDark;
  const listDark = {
    name: "Mention",
    common: commonDark,
    peers: {
      InternalSelectMenu: internalSelectMenuDark$1,
      Input: inputDark$1
    },
    self(vars) {
      const { boxShadow2 } = vars;
      return {
        menuBoxShadow: boxShadow2
      };
    }
  };
  const mentionDark = listDark;
  function createPartialInvertedVars(color, activeItemColor, activeTextColor, groupTextColor) {
    return {
      itemColorHoverInverted: "#0000",
      itemColorActiveInverted: activeItemColor,
      itemColorActiveHoverInverted: activeItemColor,
      itemColorActiveCollapsedInverted: activeItemColor,
      itemTextColorInverted: color,
      itemTextColorHoverInverted: activeTextColor,
      itemTextColorChildActiveInverted: activeTextColor,
      itemTextColorChildActiveHoverInverted: activeTextColor,
      itemTextColorActiveInverted: activeTextColor,
      itemTextColorActiveHoverInverted: activeTextColor,
      itemTextColorHorizontalInverted: color,
      itemTextColorHoverHorizontalInverted: activeTextColor,
      itemTextColorChildActiveHorizontalInverted: activeTextColor,
      itemTextColorChildActiveHoverHorizontalInverted: activeTextColor,
      itemTextColorActiveHorizontalInverted: activeTextColor,
      itemTextColorActiveHoverHorizontalInverted: activeTextColor,
      itemIconColorInverted: color,
      itemIconColorHoverInverted: activeTextColor,
      itemIconColorActiveInverted: activeTextColor,
      itemIconColorActiveHoverInverted: activeTextColor,
      itemIconColorChildActiveInverted: activeTextColor,
      itemIconColorChildActiveHoverInverted: activeTextColor,
      itemIconColorCollapsedInverted: color,
      itemIconColorHorizontalInverted: color,
      itemIconColorHoverHorizontalInverted: activeTextColor,
      itemIconColorActiveHorizontalInverted: activeTextColor,
      itemIconColorActiveHoverHorizontalInverted: activeTextColor,
      itemIconColorChildActiveHorizontalInverted: activeTextColor,
      itemIconColorChildActiveHoverHorizontalInverted: activeTextColor,
      arrowColorInverted: color,
      arrowColorHoverInverted: activeTextColor,
      arrowColorActiveInverted: activeTextColor,
      arrowColorActiveHoverInverted: activeTextColor,
      arrowColorChildActiveInverted: activeTextColor,
      arrowColorChildActiveHoverInverted: activeTextColor,
      groupTextColorInverted: groupTextColor
    };
  }
  const self$f = (vars) => {
    const { borderRadius, textColor3, primaryColor, textColor2, textColor1, fontSize: fontSize2, dividerColor, hoverColor, primaryColorHover } = vars;
    return Object.assign({
      borderRadius,
      color: "#0000",
      groupTextColor: textColor3,
      itemColorHover: hoverColor,
      itemColorActive: changeColor(primaryColor, { alpha: 0.1 }),
      itemColorActiveHover: changeColor(primaryColor, { alpha: 0.1 }),
      itemColorActiveCollapsed: changeColor(primaryColor, { alpha: 0.1 }),
      itemTextColor: textColor2,
      itemTextColorHover: textColor2,
      itemTextColorActive: primaryColor,
      itemTextColorActiveHover: primaryColor,
      itemTextColorChildActive: primaryColor,
      itemTextColorChildActiveHover: primaryColor,
      itemTextColorHorizontal: textColor2,
      itemTextColorHoverHorizontal: primaryColorHover,
      itemTextColorActiveHorizontal: primaryColor,
      itemTextColorActiveHoverHorizontal: primaryColor,
      itemTextColorChildActiveHorizontal: primaryColor,
      itemTextColorChildActiveHoverHorizontal: primaryColor,
      itemIconColor: textColor1,
      itemIconColorHover: textColor1,
      itemIconColorActive: primaryColor,
      itemIconColorActiveHover: primaryColor,
      itemIconColorChildActive: primaryColor,
      itemIconColorChildActiveHover: primaryColor,
      itemIconColorCollapsed: textColor1,
      itemIconColorHorizontal: textColor1,
      itemIconColorHoverHorizontal: primaryColorHover,
      itemIconColorActiveHorizontal: primaryColor,
      itemIconColorActiveHoverHorizontal: primaryColor,
      itemIconColorChildActiveHorizontal: primaryColor,
      itemIconColorChildActiveHoverHorizontal: primaryColor,
      itemHeight: "42px",
      arrowColor: textColor2,
      arrowColorHover: textColor2,
      arrowColorActive: primaryColor,
      arrowColorActiveHover: primaryColor,
      arrowColorChildActive: primaryColor,
      arrowColorChildActiveHover: primaryColor,
      colorInverted: "#0000",
      borderColorHorizontal: "#0000",
      fontSize: fontSize2,
      dividerColor
    }, createPartialInvertedVars("#BBB", primaryColor, "#FFF", "#AAA"));
  };
  const menuDark = {
    name: "Menu",
    common: commonDark,
    peers: {
      Tooltip: tooltipDark$1,
      Dropdown: dropdownDark$1
    },
    self(vars) {
      const { primaryColor, primaryColorSuppl } = vars;
      const commonSelf = self$f(vars);
      commonSelf.itemColorActive = changeColor(primaryColor, { alpha: 0.15 });
      commonSelf.itemColorActiveHover = changeColor(primaryColor, { alpha: 0.15 });
      commonSelf.itemColorActiveCollapsed = changeColor(primaryColor, {
        alpha: 0.15
      });
      commonSelf.itemColorActiveInverted = primaryColorSuppl;
      commonSelf.itemColorActiveHoverInverted = primaryColorSuppl;
      commonSelf.itemColorActiveCollapsedInverted = primaryColorSuppl;
      return commonSelf;
    }
  };
  const menuDark$1 = menuDark;
  const common = {
    titleFontSize: "18px",
    backSize: "22px"
  };
  function self$e(vars) {
    const { textColor1, textColor2, textColor3, fontSize: fontSize2, fontWeightStrong, primaryColorHover, primaryColorPressed } = vars;
    return Object.assign(Object.assign({}, common), { titleFontWeight: fontWeightStrong, fontSize: fontSize2, titleTextColor: textColor1, backColor: textColor2, backColorHover: primaryColorHover, backColorPressed: primaryColorPressed, subtitleTextColor: textColor3 });
  }
  const pageHeaderDark = {
    name: "PageHeader",
    common: commonDark,
    self: self$e
  };
  const commonVars$2 = {
    iconSize: "22px"
  };
  const self$d = (vars) => {
    const { fontSize: fontSize2, warningColor } = vars;
    return Object.assign(Object.assign({}, commonVars$2), { fontSize: fontSize2, iconColor: warningColor });
  };
  const popconfirmDark = {
    name: "Popconfirm",
    common: commonDark,
    peers: {
      Button: buttonDark$1,
      Popover: popoverDark$1
    },
    self: self$d
  };
  const popconfirmDark$1 = popconfirmDark;
  const self$c = (vars) => {
    const { infoColor, successColor, warningColor, errorColor, textColor2, progressRailColor, fontSize: fontSize2, fontWeight } = vars;
    return {
      fontSize: fontSize2,
      fontSizeCircle: "28px",
      fontWeightCircle: fontWeight,
      railColor: progressRailColor,
      railHeight: "8px",
      iconSizeCircle: "36px",
      iconSizeLine: "18px",
      iconColor: infoColor,
      iconColorInfo: infoColor,
      iconColorSuccess: successColor,
      iconColorWarning: warningColor,
      iconColorError: errorColor,
      textColorCircle: textColor2,
      textColorLineInner: "rgb(255, 255, 255)",
      textColorLineOuter: textColor2,
      fillColor: infoColor,
      fillColorInfo: infoColor,
      fillColorSuccess: successColor,
      fillColorWarning: warningColor,
      fillColorError: errorColor,
      lineBgProcessing: "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"
    };
  };
  const progressDark = {
    name: "Progress",
    common: commonDark,
    self(vars) {
      const commonSelf = self$c(vars);
      commonSelf.textColorLineInner = "rgb(0, 0, 0)";
      commonSelf.lineBgProcessing = "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)";
      return commonSelf;
    }
  };
  const progressDark$1 = progressDark;
  const rateDark = {
    name: "Rate",
    common: commonDark,
    self(vars) {
      const { railColor } = vars;
      return {
        itemColor: railColor,
        itemColorActive: "#CCAA33",
        itemSize: "20px",
        sizeSmall: "16px",
        sizeMedium: "20px",
        sizeLarge: "24px"
      };
    }
  };
  const rateDark$1 = rateDark;
  const commonVariables$3 = {
    titleFontSizeSmall: "26px",
    titleFontSizeMedium: "32px",
    titleFontSizeLarge: "40px",
    titleFontSizeHuge: "48px",
    fontSizeSmall: "14px",
    fontSizeMedium: "14px",
    fontSizeLarge: "15px",
    fontSizeHuge: "16px",
    iconSizeSmall: "64px",
    iconSizeMedium: "80px",
    iconSizeLarge: "100px",
    iconSizeHuge: "125px",
    iconColor418: void 0,
    iconColor404: void 0,
    iconColor403: void 0,
    iconColor500: void 0
  };
  const self$b = (vars) => {
    const { textColor2, textColor1, errorColor, successColor, infoColor, warningColor, lineHeight: lineHeight2, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, commonVariables$3), { lineHeight: lineHeight2, titleFontWeight: fontWeightStrong, titleTextColor: textColor1, textColor: textColor2, iconColorError: errorColor, iconColorSuccess: successColor, iconColorInfo: infoColor, iconColorWarning: warningColor });
  };
  const resultDark = {
    name: "Result",
    common: commonDark,
    self: self$b
  };
  const resultDark$1 = resultDark;
  const sizeVariables$3 = {
    railHeight: "4px",
    railWidthVertical: "4px",
    handleSize: "18px",
    dotHeight: "8px",
    dotWidth: "8px",
    dotBorderRadius: "4px"
  };
  const sliderDark = {
    name: "Slider",
    common: commonDark,
    self(vars) {
      const boxShadow = "0 2px 8px 0 rgba(0, 0, 0, 0.12)";
      const { railColor, modalColor, primaryColorSuppl, popoverColor, textColor2, cardColor, borderRadius, fontSize: fontSize2, opacityDisabled } = vars;
      return Object.assign(Object.assign({}, sizeVariables$3), { fontSize: fontSize2, markFontSize: fontSize2, railColor, railColorHover: railColor, fillColor: primaryColorSuppl, fillColorHover: primaryColorSuppl, opacityDisabled, handleColor: "#FFF", dotColor: cardColor, dotColorModal: modalColor, dotColorPopover: popoverColor, handleBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)", handleBoxShadowHover: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)", handleBoxShadowActive: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)", handleBoxShadowFocus: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)", indicatorColor: popoverColor, indicatorBoxShadow: boxShadow, indicatorTextColor: textColor2, indicatorBorderRadius: borderRadius, dotBorder: `2px solid ${railColor}`, dotBorderActive: `2px solid ${primaryColorSuppl}`, dotBoxShadow: "" });
    }
  };
  const sliderDark$1 = sliderDark;
  const self$a = (vars) => {
    const { opacityDisabled, heightTiny, heightSmall, heightMedium, heightLarge, heightHuge, primaryColor, fontSize: fontSize2 } = vars;
    return {
      fontSize: fontSize2,
      textColor: primaryColor,
      sizeTiny: heightTiny,
      sizeSmall: heightSmall,
      sizeMedium: heightMedium,
      sizeLarge: heightLarge,
      sizeHuge: heightHuge,
      color: primaryColor,
      opacitySpinning: opacityDisabled
    };
  };
  const spinDark = {
    name: "Spin",
    common: commonDark,
    self: self$a
  };
  const spinDark$1 = spinDark;
  const self$9 = (vars) => {
    const { textColor2, textColor3, fontSize: fontSize2, fontWeight } = vars;
    return {
      labelFontSize: fontSize2,
      labelFontWeight: fontWeight,
      valueFontWeight: fontWeight,
      valueFontSize: "24px",
      labelTextColor: textColor3,
      valuePrefixTextColor: textColor2,
      valueSuffixTextColor: textColor2,
      valueTextColor: textColor2
    };
  };
  const statisticDark = {
    name: "Statistic",
    common: commonDark,
    self: self$9
  };
  const statisticDark$1 = statisticDark;
  const commonVariables$2 = {
    stepHeaderFontSizeSmall: "14px",
    stepHeaderFontSizeMedium: "16px",
    indicatorIndexFontSizeSmall: "14px",
    indicatorIndexFontSizeMedium: "16px",
    indicatorSizeSmall: "22px",
    indicatorSizeMedium: "28px",
    indicatorIconSizeSmall: "14px",
    indicatorIconSizeMedium: "18px"
  };
  const self$8 = (vars) => {
    const { fontWeightStrong, baseColor, textColorDisabled, primaryColor, errorColor, textColor1, textColor2 } = vars;
    return Object.assign(Object.assign({}, commonVariables$2), { stepHeaderFontWeight: fontWeightStrong, indicatorTextColorProcess: baseColor, indicatorTextColorWait: textColorDisabled, indicatorTextColorFinish: primaryColor, indicatorTextColorError: errorColor, indicatorBorderColorProcess: primaryColor, indicatorBorderColorWait: textColorDisabled, indicatorBorderColorFinish: primaryColor, indicatorBorderColorError: errorColor, indicatorColorProcess: primaryColor, indicatorColorWait: "#0000", indicatorColorFinish: "#0000", indicatorColorError: "#0000", splitorColorProcess: textColorDisabled, splitorColorWait: textColorDisabled, splitorColorFinish: primaryColor, splitorColorError: textColorDisabled, headerTextColorProcess: textColor1, headerTextColorWait: textColorDisabled, headerTextColorFinish: textColorDisabled, headerTextColorError: errorColor, descriptionTextColorProcess: textColor2, descriptionTextColorWait: textColorDisabled, descriptionTextColorFinish: textColorDisabled, descriptionTextColorError: errorColor });
  };
  const stepsDark = {
    name: "Steps",
    common: commonDark,
    self: self$8
  };
  const stepsDark$1 = stepsDark;
  const commonVars$1 = {
    buttonHeightSmall: "14px",
    buttonHeightMedium: "18px",
    buttonHeightLarge: "22px",
    buttonWidthSmall: "14px",
    buttonWidthMedium: "18px",
    buttonWidthLarge: "22px",
    buttonWidthPressedSmall: "20px",
    buttonWidthPressedMedium: "24px",
    buttonWidthPressedLarge: "28px",
    railHeightSmall: "18px",
    railHeightMedium: "22px",
    railHeightLarge: "26px",
    railWidthSmall: "32px",
    railWidthMedium: "40px",
    railWidthLarge: "48px"
  };
  const switchDark = {
    name: "Switch",
    common: commonDark,
    self(vars) {
      const { primaryColorSuppl, opacityDisabled, borderRadius, primaryColor, textColor2, baseColor } = vars;
      const railOverlayColor = "rgba(255, 255, 255, .20)";
      return Object.assign(Object.assign({}, commonVars$1), { iconColor: baseColor, textColor: textColor2, loadingColor: primaryColorSuppl, opacityDisabled, railColor: railOverlayColor, railColorActive: primaryColorSuppl, buttonBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)", buttonColor: "#FFF", railBorderRadiusSmall: borderRadius, railBorderRadiusMedium: borderRadius, railBorderRadiusLarge: borderRadius, buttonBorderRadiusSmall: borderRadius, buttonBorderRadiusMedium: borderRadius, buttonBorderRadiusLarge: borderRadius, boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, { alpha: 0.3 })}` });
    }
  };
  const switchDark$1 = switchDark;
  const sizeVariables$2 = {
    thPaddingSmall: "6px",
    thPaddingMedium: "12px",
    thPaddingLarge: "12px",
    tdPaddingSmall: "6px",
    tdPaddingMedium: "12px",
    tdPaddingLarge: "12px"
  };
  const self$7 = (vars) => {
    const { dividerColor, cardColor, modalColor, popoverColor, tableHeaderColor, tableColorStriped, textColor1, textColor2, borderRadius, fontWeightStrong, lineHeight: lineHeight2, fontSizeSmall, fontSizeMedium, fontSizeLarge } = vars;
    return Object.assign(Object.assign({}, sizeVariables$2), {
      fontSizeSmall,
      fontSizeMedium,
      fontSizeLarge,
      lineHeight: lineHeight2,
      borderRadius,
      borderColor: composite(cardColor, dividerColor),
      borderColorModal: composite(modalColor, dividerColor),
      borderColorPopover: composite(popoverColor, dividerColor),
      tdColor: cardColor,
      tdColorModal: modalColor,
      tdColorPopover: popoverColor,
      tdColorStriped: composite(cardColor, tableColorStriped),
      tdColorStripedModal: composite(modalColor, tableColorStriped),
      tdColorStripedPopover: composite(popoverColor, tableColorStriped),
      thColor: composite(cardColor, tableHeaderColor),
      thColorModal: composite(modalColor, tableHeaderColor),
      thColorPopover: composite(popoverColor, tableHeaderColor),
      thTextColor: textColor1,
      tdTextColor: textColor2,
      thFontWeight: fontWeightStrong
    });
  };
  const tableDark = {
    name: "Table",
    common: commonDark,
    self: self$7
  };
  const tableDark$1 = tableDark;
  const sizeVariables$1 = {
    tabFontSizeSmall: "14px",
    tabFontSizeMedium: "14px",
    tabFontSizeLarge: "16px",
    tabGapSmallLine: "36px",
    tabGapMediumLine: "36px",
    tabGapLargeLine: "36px",
    tabGapSmallLineVertical: "8px",
    tabGapMediumLineVertical: "8px",
    tabGapLargeLineVertical: "8px",
    tabPaddingSmallLine: "6px 0",
    tabPaddingMediumLine: "10px 0",
    tabPaddingLargeLine: "14px 0",
    tabPaddingVerticalSmallLine: "6px 12px",
    tabPaddingVerticalMediumLine: "8px 16px",
    tabPaddingVerticalLargeLine: "10px 20px",
    tabGapSmallBar: "36px",
    tabGapMediumBar: "36px",
    tabGapLargeBar: "36px",
    tabGapSmallBarVertical: "8px",
    tabGapMediumBarVertical: "8px",
    tabGapLargeBarVertical: "8px",
    tabPaddingSmallBar: "4px 0",
    tabPaddingMediumBar: "6px 0",
    tabPaddingLargeBar: "10px 0",
    tabPaddingVerticalSmallBar: "6px 12px",
    tabPaddingVerticalMediumBar: "8px 16px",
    tabPaddingVerticalLargeBar: "10px 20px",
    tabGapSmallCard: "4px",
    tabGapMediumCard: "4px",
    tabGapLargeCard: "4px",
    tabGapSmallCardVertical: "4px",
    tabGapMediumCardVertical: "4px",
    tabGapLargeCardVertical: "4px",
    tabPaddingSmallCard: "8px 16px",
    tabPaddingMediumCard: "10px 20px",
    tabPaddingLargeCard: "12px 24px",
    tabPaddingSmallSegment: "4px 0",
    tabPaddingMediumSegment: "6px 0",
    tabPaddingLargeSegment: "8px 0",
    tabPaddingVerticalLargeSegment: "0 8px",
    tabPaddingVerticalSmallCard: "8px 12px",
    tabPaddingVerticalMediumCard: "10px 16px",
    tabPaddingVerticalLargeCard: "12px 20px",
    tabPaddingVerticalSmallSegment: "0 4px",
    tabPaddingVerticalMediumSegment: "0 6px",
    tabGapSmallSegment: "0",
    tabGapMediumSegment: "0",
    tabGapLargeSegment: "0",
    tabGapSmallSegmentVertical: "0",
    tabGapMediumSegmentVertical: "0",
    tabGapLargeSegmentVertical: "0",
    panePaddingSmall: "8px 0 0 0",
    panePaddingMedium: "12px 0 0 0",
    panePaddingLarge: "16px 0 0 0",
    closeSize: "18px",
    closeIconSize: "14px"
  };
  const self$6 = (vars) => {
    const { textColor2, primaryColor, textColorDisabled, closeIconColor, closeIconColorHover, closeIconColorPressed, closeColorHover, closeColorPressed, tabColor, baseColor, dividerColor, fontWeight, textColor1, borderRadius, fontSize: fontSize2, fontWeightStrong } = vars;
    return Object.assign(Object.assign({}, sizeVariables$1), {
      colorSegment: tabColor,
      tabFontSizeCard: fontSize2,
      tabTextColorLine: textColor1,
      tabTextColorActiveLine: primaryColor,
      tabTextColorHoverLine: primaryColor,
      tabTextColorDisabledLine: textColorDisabled,
      tabTextColorSegment: textColor1,
      tabTextColorActiveSegment: textColor2,
      tabTextColorHoverSegment: textColor2,
      tabTextColorDisabledSegment: textColorDisabled,
      tabTextColorBar: textColor1,
      tabTextColorActiveBar: primaryColor,
      tabTextColorHoverBar: primaryColor,
      tabTextColorDisabledBar: textColorDisabled,
      tabTextColorCard: textColor1,
      tabTextColorHoverCard: textColor1,
      tabTextColorActiveCard: primaryColor,
      tabTextColorDisabledCard: textColorDisabled,
      barColor: primaryColor,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHover,
      closeColorPressed,
      closeBorderRadius: borderRadius,
      tabColor,
      tabColorSegment: baseColor,
      tabBorderColor: dividerColor,
      tabFontWeightActive: fontWeight,
      tabFontWeight: fontWeight,
      tabBorderRadius: borderRadius,
      paneTextColor: textColor2,
      fontWeightStrong
    });
  };
  const tabsDark = {
    name: "Tabs",
    common: commonDark,
    self(vars) {
      const commonSelf = self$6(vars);
      const { inputColor } = vars;
      commonSelf.colorSegment = inputColor;
      commonSelf.tabColorSegment = inputColor;
      return commonSelf;
    }
  };
  const tabsDark$1 = tabsDark;
  const self$5 = (vars) => {
    const { textColor1, textColor2, fontWeightStrong, fontSize: fontSize2 } = vars;
    return {
      fontSize: fontSize2,
      titleTextColor: textColor1,
      textColor: textColor2,
      titleFontWeight: fontWeightStrong
    };
  };
  const thingDark = {
    name: "Thing",
    common: commonDark,
    self: self$5
  };
  const thingDark$1 = thingDark;
  const sizeVariables = {
    titleMarginMedium: "0 0 6px 0",
    titleMarginLarge: "-2px 0 6px 0",
    titleFontSizeMedium: "14px",
    titleFontSizeLarge: "16px",
    iconSizeMedium: "14px",
    iconSizeLarge: "14px"
  };
  const timelineDark = {
    name: "Timeline",
    common: commonDark,
    self(vars) {
      const { textColor3, infoColorSuppl, errorColorSuppl, successColorSuppl, warningColorSuppl, textColor1, textColor2, railColor, fontWeightStrong, fontSize: fontSize2 } = vars;
      return Object.assign(Object.assign({}, sizeVariables), { contentFontSize: fontSize2, titleFontWeight: fontWeightStrong, circleBorder: `2px solid ${textColor3}`, circleBorderInfo: `2px solid ${infoColorSuppl}`, circleBorderError: `2px solid ${errorColorSuppl}`, circleBorderSuccess: `2px solid ${successColorSuppl}`, circleBorderWarning: `2px solid ${warningColorSuppl}`, iconColor: textColor3, iconColorInfo: infoColorSuppl, iconColorError: errorColorSuppl, iconColorSuccess: successColorSuppl, iconColorWarning: warningColorSuppl, titleTextColor: textColor1, contentTextColor: textColor2, metaTextColor: textColor3, lineColor: railColor });
    }
  };
  const timelineDark$1 = timelineDark;
  const commonVariables$1 = {
    extraFontSizeSmall: "12px",
    extraFontSizeMedium: "12px",
    extraFontSizeLarge: "14px",
    titleFontSizeSmall: "14px",
    titleFontSizeMedium: "16px",
    titleFontSizeLarge: "16px",
    closeSize: "20px",
    closeIconSize: "16px",
    headerHeightSmall: "44px",
    headerHeightMedium: "44px",
    headerHeightLarge: "50px"
  };
  const transferDark$1 = {
    name: "Transfer",
    common: commonDark,
    peers: {
      Checkbox: checkboxDark$1,
      Scrollbar: scrollbarDark$1,
      Input: inputDark$1,
      Empty: emptyDark$1,
      Button: buttonDark$1
    },
    self(vars) {
      const { fontWeight, fontSizeLarge, fontSizeMedium, fontSizeSmall, heightLarge, heightMedium, borderRadius, inputColor, tableHeaderColor, textColor1, textColorDisabled, textColor2, textColor3, hoverColor, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, dividerColor } = vars;
      return Object.assign(Object.assign({}, commonVariables$1), {
        itemHeightSmall: heightMedium,
        itemHeightMedium: heightMedium,
        itemHeightLarge: heightLarge,
        fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        borderRadius,
        dividerColor,
        borderColor: "#0000",
        listColor: inputColor,
        headerColor: tableHeaderColor,
        titleTextColor: textColor1,
        titleTextColorDisabled: textColorDisabled,
        extraTextColor: textColor3,
        extraTextColorDisabled: textColorDisabled,
        itemTextColor: textColor2,
        itemTextColorDisabled: textColorDisabled,
        itemColorPending: hoverColor,
        titleFontWeight: fontWeight,
        closeColorHover,
        closeColorPressed,
        closeIconColor,
        closeIconColorHover,
        closeIconColorPressed
      });
    }
  };
  const transferDark$2 = transferDark$1;
  const self$4 = (vars) => {
    const { borderRadiusSmall, hoverColor, pressedColor, primaryColor, textColor3, textColor2, textColorDisabled, fontSize: fontSize2 } = vars;
    return {
      fontSize: fontSize2,
      nodeBorderRadius: borderRadiusSmall,
      nodeColorHover: hoverColor,
      nodeColorPressed: pressedColor,
      nodeColorActive: changeColor(primaryColor, { alpha: 0.1 }),
      arrowColor: textColor3,
      nodeTextColor: textColor2,
      nodeTextColorDisabled: textColorDisabled,
      loadingColor: primaryColor,
      dropMarkColor: primaryColor
    };
  };
  const treeDark = {
    name: "Tree",
    common: commonDark,
    peers: {
      Checkbox: checkboxDark$1,
      Scrollbar: scrollbarDark$1,
      Empty: emptyDark$1
    },
    self(vars) {
      const { primaryColor } = vars;
      const commonSelf = self$4(vars);
      commonSelf.nodeColorActive = changeColor(primaryColor, { alpha: 0.15 });
      return commonSelf;
    }
  };
  const treeDark$1 = treeDark;
  const treeSelectDark = {
    name: "TreeSelect",
    common: commonDark,
    peers: {
      Tree: treeDark$1,
      Empty: emptyDark$1,
      InternalSelection: internalSelectionDark$1
    }
  };
  const treeSelectDark$1 = treeSelectDark;
  const commonVars = {
    headerFontSize1: "30px",
    headerFontSize2: "22px",
    headerFontSize3: "18px",
    headerFontSize4: "16px",
    headerFontSize5: "16px",
    headerFontSize6: "16px",
    headerMargin1: "28px 0 20px 0",
    headerMargin2: "28px 0 20px 0",
    headerMargin3: "28px 0 20px 0",
    headerMargin4: "28px 0 18px 0",
    headerMargin5: "28px 0 18px 0",
    headerMargin6: "28px 0 18px 0",
    headerPrefixWidth1: "16px",
    headerPrefixWidth2: "16px",
    headerPrefixWidth3: "12px",
    headerPrefixWidth4: "12px",
    headerPrefixWidth5: "12px",
    headerPrefixWidth6: "12px",
    headerBarWidth1: "4px",
    headerBarWidth2: "4px",
    headerBarWidth3: "3px",
    headerBarWidth4: "3px",
    headerBarWidth5: "3px",
    headerBarWidth6: "3px",
    pMargin: "16px 0 16px 0",
    liMargin: ".25em 0 0 0",
    olPadding: "0 0 0 2em",
    ulPadding: "0 0 0 2em"
  };
  const self$3 = (vars) => {
    const { primaryColor, textColor2, borderColor, lineHeight: lineHeight2, fontSize: fontSize2, borderRadiusSmall, dividerColor, fontWeightStrong, textColor1, textColor3, infoColor, warningColor, errorColor, successColor, codeColor } = vars;
    return Object.assign(Object.assign({}, commonVars), { aTextColor: primaryColor, blockquoteTextColor: textColor2, blockquotePrefixColor: borderColor, blockquoteLineHeight: lineHeight2, blockquoteFontSize: fontSize2, codeBorderRadius: borderRadiusSmall, liTextColor: textColor2, liLineHeight: lineHeight2, liFontSize: fontSize2, hrColor: dividerColor, headerFontWeight: fontWeightStrong, headerTextColor: textColor1, pTextColor: textColor2, pTextColor1Depth: textColor1, pTextColor2Depth: textColor2, pTextColor3Depth: textColor3, pLineHeight: lineHeight2, pFontSize: fontSize2, headerBarColor: primaryColor, headerBarColorPrimary: primaryColor, headerBarColorInfo: infoColor, headerBarColorError: errorColor, headerBarColorWarning: warningColor, headerBarColorSuccess: successColor, textColor: textColor2, textColor1Depth: textColor1, textColor2Depth: textColor2, textColor3Depth: textColor3, textColorPrimary: primaryColor, textColorInfo: infoColor, textColorSuccess: successColor, textColorWarning: warningColor, textColorError: errorColor, codeTextColor: textColor2, codeColor, codeBorder: "1px solid #0000" });
  };
  const typographyDark = {
    name: "Typography",
    common: commonDark,
    self: self$3
  };
  const typographyDark$1 = typographyDark;
  const self$2 = (vars) => {
    const { iconColor, primaryColor, errorColor, textColor2, successColor, opacityDisabled, actionColor, borderColor, hoverColor, lineHeight: lineHeight2, borderRadius, fontSize: fontSize2 } = vars;
    return {
      fontSize: fontSize2,
      lineHeight: lineHeight2,
      borderRadius,
      draggerColor: actionColor,
      draggerBorder: `1px dashed ${borderColor}`,
      draggerBorderHover: `1px dashed ${primaryColor}`,
      itemColorHover: hoverColor,
      itemColorHoverError: changeColor(errorColor, {
        alpha: 0.06
      }),
      itemTextColor: textColor2,
      itemTextColorError: errorColor,
      itemTextColorSuccess: successColor,
      itemIconColor: iconColor,
      itemDisabledOpacity: opacityDisabled,
      itemBorderImageCardError: `1px solid ${errorColor}`,
      itemBorderImageCard: `1px solid ${borderColor}`
    };
  };
  const uploadDark = {
    name: "Upload",
    common: commonDark,
    peers: {
      Button: buttonDark$1,
      Progress: progressDark$1
    },
    self(vars) {
      const { errorColor } = vars;
      const commonSelf = self$2(vars);
      commonSelf.itemColorHoverError = changeColor(errorColor, {
        alpha: 0.09
      });
      return commonSelf;
    }
  };
  const uploadDark$1 = uploadDark;
  const watermarkDark = {
    name: "Watermark",
    common: commonDark,
    self(vars) {
      const { fontFamily: fontFamily2 } = vars;
      return {
        fontFamily: fontFamily2
      };
    }
  };
  const watermarkDark$1 = watermarkDark;
  const rowDark = {
    name: "Row",
    common: commonDark
  };
  const rowDark$1 = rowDark;
  const imageDark = {
    name: "Image",
    common: commonDark,
    peers: {
      Tooltip: tooltipDark$1
    },
    self: (vars) => {
      const { textColor2 } = vars;
      return {
        toolbarIconColor: textColor2,
        toolbarColor: "rgba(0, 0, 0, .35)",
        toolbarBoxShadow: "none",
        toolbarBorderRadius: "24px"
      };
    }
  };
  const commonVariables = {
    extraFontSize: "12px",
    width: "440px"
  };
  const transferDark = {
    name: "Transfer",
    common: commonDark,
    peers: {
      Checkbox: checkboxDark$1,
      Scrollbar: scrollbarDark$1,
      Input: inputDark$1,
      Empty: emptyDark$1,
      Button: buttonDark$1
    },
    self(vars) {
      const { iconColorDisabled, iconColor, fontWeight, fontSizeLarge, fontSizeMedium, fontSizeSmall, heightLarge, heightMedium, heightSmall, borderRadius, inputColor, tableHeaderColor, textColor1, textColorDisabled, textColor2, hoverColor } = vars;
      return Object.assign(Object.assign({}, commonVariables), {
        itemHeightSmall: heightSmall,
        itemHeightMedium: heightMedium,
        itemHeightLarge: heightLarge,
        fontSizeSmall,
        fontSizeMedium,
        fontSizeLarge,
        borderRadius,
        borderColor: "#0000",
        listColor: inputColor,
        headerColor: tableHeaderColor,
        titleTextColor: textColor1,
        titleTextColorDisabled: textColorDisabled,
        extraTextColor: textColor2,
        filterDividerColor: "#0000",
        itemTextColor: textColor2,
        itemTextColorDisabled: textColorDisabled,
        itemColorPending: hoverColor,
        titleFontWeight: fontWeight,
        iconColor,
        iconColorDisabled
      });
    }
  };
  const legacyTransferDark = transferDark;
  const skeletonDark = {
    name: "Skeleton",
    common: commonDark,
    self(vars) {
      const { heightSmall, heightMedium, heightLarge, borderRadius } = vars;
      return {
        color: "rgba(255, 255, 255, 0.12)",
        colorEnd: "rgba(255, 255, 255, 0.18)",
        borderRadius,
        heightSmall,
        heightMedium,
        heightLarge
      };
    }
  };
  const self$1 = () => ({});
  const equationDark = {
    name: "Equation",
    common: commonDark,
    self: self$1
  };
  const equationDark$1 = equationDark;
  const darkTheme = {
    name: "dark",
    common: commonDark,
    Alert: alertDark$1,
    Anchor: anchorDark$1,
    AutoComplete: autoCompleteDark$1,
    Avatar: avatarDark$1,
    AvatarGroup: avatarGroupDark$1,
    BackTop: backTopDark$1,
    Badge: badgeDark$1,
    Breadcrumb: breadcrumbDark$1,
    Button: buttonDark$1,
    ButtonGroup: buttonGroupDark$1,
    Calendar: calendarDark$1,
    Card: cardDark$1,
    Carousel: carouselDark$1,
    Cascader: cascaderDark$1,
    Checkbox: checkboxDark$1,
    Code: codeDark$1,
    Collapse: collapseDark$1,
    CollapseTransition: collapseTransitionDark$1,
    ColorPicker: colorPickerDark$1,
    DataTable: dataTableDark$1,
    DatePicker: datePickerDark$1,
    Descriptions: descriptionsDark$1,
    Dialog: dialogDark$1,
    Divider: dividerDark$1,
    Drawer: drawerDark$1,
    Dropdown: dropdownDark$1,
    DynamicInput: dynamicInputDark$1,
    DynamicTags: dynamicTagsDark$1,
    Element: elementDark$1,
    Empty: emptyDark$1,
    Ellipsis: ellipsisDark$1,
    Equation: equationDark$1,
    Form: formDark,
    GradientText: gradientTextDark$1,
    Icon: iconDark$2,
    IconWrapper: iconWrapperDark,
    Image: imageDark,
    Input: inputDark$1,
    InputNumber: inputNumberDark$1,
    LegacyTransfer: legacyTransferDark,
    Layout: layoutDark$1,
    List: listDark$2,
    LoadingBar: loadingBarDark$1,
    Log: logDark$1,
    Menu: menuDark$1,
    Mention: mentionDark,
    Message: messageDark$1,
    Modal: modalDark$1,
    Notification: notificationDark$1,
    PageHeader: pageHeaderDark,
    Pagination: paginationDark$1,
    Popconfirm: popconfirmDark$1,
    Popover: popoverDark$1,
    Popselect: popselectDark,
    Progress: progressDark$1,
    Radio: radioDark$1,
    Rate: rateDark$1,
    Result: resultDark$1,
    Row: rowDark$1,
    Scrollbar: scrollbarDark$1,
    Select: selectDark$1,
    Skeleton: skeletonDark,
    Slider: sliderDark$1,
    Space: spaceDark$1,
    Spin: spinDark$1,
    Statistic: statisticDark$1,
    Steps: stepsDark$1,
    Switch: switchDark$1,
    Table: tableDark$1,
    Tabs: tabsDark$1,
    Tag: tagDark$1,
    Thing: thingDark$1,
    TimePicker: timePickerDark$1,
    Timeline: timelineDark$1,
    Tooltip: tooltipDark$1,
    Transfer: transferDark$2,
    Tree: treeDark$1,
    TreeSelect: treeSelectDark$1,
    Typography: typographyDark$1,
    Upload: uploadDark$1,
    Watermark: watermarkDark$1
  };
  var _a;
  const isClient = typeof window !== "undefined";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const noop = () => {
  };
  isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  const bypassFilter = (invoke) => {
    return invoke();
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
  function identity(arg) {
    return arg;
  }
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
  var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
  var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
  var __objRest$5 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$6)
      for (var prop of __getOwnPropSymbols$6(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function watchWithFilter(source, cb, options = {}) {
    const _a2 = options, {
      eventFilter = bypassFilter
    } = _a2, watchOptions = __objRest$5(_a2, [
      "eventFilter"
    ]);
    return vue.watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
  }
  var __defProp$2 = Object.defineProperty;
  var __defProps$2 = Object.defineProperties;
  var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
  var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
  var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$2 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    if (__getOwnPropSymbols$2)
      for (var prop of __getOwnPropSymbols$2(b)) {
        if (__propIsEnum$2.call(b, prop))
          __defNormalProp$2(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
  var __objRest$1 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$2)
      for (var prop of __getOwnPropSymbols$2(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function watchPausable(source, cb, options = {}) {
    const _a2 = options, {
      eventFilter: filter
    } = _a2, watchOptions = __objRest$1(_a2, [
      "eventFilter"
    ]);
    const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
    const stop = watchWithFilter(source, cb, __spreadProps$2(__spreadValues$2({}, watchOptions), {
      eventFilter
    }));
    return { stop, pause, resume, isActive };
  }
  function unrefElement(elRef) {
    var _a2;
    const plain = resolveUnref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  isClient ? window.document : void 0;
  isClient ? window.navigator : void 0;
  isClient ? window.location : void 0;
  function useEventListener(...args) {
    let target;
    let events2;
    let listeners;
    let options;
    if (isString(args[0]) || Array.isArray(args[0])) {
      [events2, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events2, listeners, options] = args;
    }
    if (!target)
      return noop;
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
    const stopWatch = vue.watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(...events2.flatMap((event) => {
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
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  const handlers = _global[globalKey];
  function getSSRHandler(key, fallback) {
    return handlers[key] || fallback;
  }
  function guessSerializerType(rawInit) {
    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
  }
  var __defProp$k = Object.defineProperty;
  var __getOwnPropSymbols$m = Object.getOwnPropertySymbols;
  var __hasOwnProp$m = Object.prototype.hasOwnProperty;
  var __propIsEnum$m = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$k = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$m.call(b, prop))
        __defNormalProp$k(a, prop, b[prop]);
    if (__getOwnPropSymbols$m)
      for (var prop of __getOwnPropSymbols$m(b)) {
        if (__propIsEnum$m.call(b, prop))
          __defNormalProp$k(a, prop, b[prop]);
      }
    return a;
  };
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
  function useStorage(key, defaults, storage, options = {}) {
    var _a2;
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
      }
    } = options;
    const data = (shallow ? vue.shallowRef : vue.ref)(defaults);
    if (!storage) {
      try {
        storage = getSSRHandler("getDefaultStorage", () => {
          var _a22;
          return (_a22 = defaultWindow) == null ? void 0 : _a22.localStorage;
        })();
      } catch (e) {
        onError(e);
      }
    }
    if (!storage)
      return data;
    const rawInit = resolveUnref(defaults);
    const type = guessSerializerType(rawInit);
    const serializer = (_a2 = options.serializer) != null ? _a2 : StorageSerializers[type];
    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, () => write(data.value), { flush, deep, eventFilter });
    if (window2 && listenToStorageChanges) {
      useEventListener(window2, "storage", update);
      useEventListener(window2, customStorageEventName, updateFromCustomEvent);
    }
    update();
    return data;
    function write(v) {
      try {
        if (v == null) {
          storage.removeItem(key);
        } else {
          const serialized = serializer.write(v);
          const oldValue = storage.getItem(key);
          if (oldValue !== serialized) {
            storage.setItem(key, serialized);
            if (window2) {
              window2.dispatchEvent(new CustomEvent(customStorageEventName, {
                detail: {
                  key,
                  oldValue,
                  newValue: serialized,
                  storageArea: storage
                }
              }));
            }
          }
        }
      } catch (e) {
        onError(e);
      }
    }
    function read(event) {
      const rawValue = event ? event.newValue : storage.getItem(key);
      if (rawValue == null) {
        if (writeDefaults && rawInit !== null)
          storage.setItem(key, serializer.write(rawInit));
        return rawInit;
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue);
        if (isFunction(mergeDefaults))
          return mergeDefaults(value, rawInit);
        else if (type === "object" && !Array.isArray(value))
          return __spreadValues$k(__spreadValues$k({}, rawInit), value);
        return value;
      } else if (typeof rawValue !== "string") {
        return rawValue;
      } else {
        return serializer.read(rawValue);
      }
    }
    function updateFromCustomEvent(event) {
      update(event.detail);
    }
    function update(event) {
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
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
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
    linear: identity
  }, _TransitionPresets);
  const useIinaStore = defineStore("iina", () => {
    const iina = useStorage("open-with-iina", false);
    const getIina = () => {
      return iina.value;
    };
    const toggleIina = () => {
      iina.value = !iina.value;
    };
    return {
      getIina,
      toggleIina
    };
  });
  const useServerUrlStore = defineStore("serverUrl", () => {
    const serverUrl = useStorage("server-url", []);
    const setServerUrl = (value) => {
      serverUrl.value = value;
    };
    const getServerUrl = () => {
      return serverUrl.value;
    };
    const removeServerUrl = (targatUrl) => {
      serverUrl.value = serverUrl.value.filter((url) => url !== targatUrl);
    };
    return {
      setServerUrl,
      getServerUrl,
      removeServerUrl
    };
  });
  const useLocalAliasStore = defineStore("localAlias", () => {
    var _a2;
    const doc = document.URL;
    const reg = /subject\/\d+/;
    const alias = useStorage(((_a2 = doc.match(reg)) == null ? void 0 : _a2[0]) || "", null);
    const setAlias = (value) => {
      alias.value = value;
    };
    const getAlias = () => {
      return alias.value;
    };
    return {
      setAlias,
      getAlias
    };
  });
  function suffixCheck(suffix2) {
    return suffix2.endsWith("/") ? suffix2 : `${suffix2}/`;
  }
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-c3f0e0f8"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tip" }, " \u6BD4\u5982\u8FD9\u4E2A\u9875\u9762\u4E0A\u52A8\u6F2B\u7684\u4E2D\u6587\u540D\u662F\u300C\u5B64\u72EC\u6447\u6EDA!\u300D, \u800C\u4F60\u7684\u76EE\u5F55\u91CC\u7684\u540D\u79F0\u662F \u300C\u5B64\u72EC\u6447\u6EDA\u300D\u6CA1\u6709\uFF01\uFF0C\u5C31\u53EF\u4EE5\u628A \u5B64\u72EC\u6447\u6EDA \u586B\u8FDB\u53BB\u3002 \u9700\u8981\u6307\u5B9A\u4E00\u4E0B\u662F\u54EA\u4E2A\u76EE\u5F55\u3002 ", -1));
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "LocalAlias",
    setup(__props) {
      const { setAlias, getAlias } = useLocalAliasStore();
      const inputText = vue.ref("");
      const { getServerUrl } = useServerUrlStore();
      const selectServerUrl = vue.ref(null);
      const tipIsShow = vue.ref(false);
      const handleAddAlias = () => {
        var _a2;
        if (((_a2 = selectServerUrl.value) == null ? void 0 : _a2.length) === 0)
          selectServerUrl.value = null;
        if (!selectServerUrl.value || !inputText.value) {
          tipIsShow.value = true;
          return;
        }
        if (inputText.value) {
          const alias = selectServerUrl.value + inputText.value.trim();
          setAlias(suffixCheck(alias));
          tipIsShow.value = false;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(NInputGroup), { size: "small" }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(NInput), {
                value: inputText.value,
                "onUpdate:value": _cache[0] || (_cache[0] = ($event) => inputText.value = $event),
                size: "small",
                placeholder: "\u672C\u5730\u76EE\u5F55\u522B\u540D...",
                onKeyup: vue.withKeys(handleAddAlias, ["enter"])
              }, null, 8, ["value", "onKeyup"]),
              vue.createVNode(vue.unref(NButton), {
                type: "tertiary",
                size: "small",
                onClick: handleAddAlias
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" \u6DFB\u52A0 ")
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.unref(getAlias)() ? (vue.openBlock(), vue.createBlock(vue.unref(NTag), {
            key: 0,
            closable: "",
            onClose: _cache[1] || (_cache[1] = ($event) => vue.unref(setAlias)(null))
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(vue.unref(getAlias)()), 1)
            ]),
            _: 1
          })) : vue.createCommentVNode("", true),
          vue.createVNode(vue.unref(NCheckboxGroup), {
            value: selectServerUrl.value,
            "onUpdate:value": _cache[2] || (_cache[2] = ($event) => selectServerUrl.value = $event),
            max: 1
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(getServerUrl)(), (serverUrl) => {
                return vue.openBlock(), vue.createBlock(vue.unref(NCheckbox), {
                  key: serverUrl,
                  value: serverUrl
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(serverUrl), 1)
                  ]),
                  _: 2
                }, 1032, ["value"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["value"]),
          _hoisted_1$2,
          vue.withDirectives(vue.createElementVNode("div", { class: "tip-err" }, vue.toDisplayString(inputText.value ? selectServerUrl.value ? null : "\u8BF7\u9009\u62E9\u4E00\u4E2A\u670D\u52A1\u5668" : "\u8BF7\u8F93\u5165\u4E00\u4E2A\u672C\u5730\u76EE\u5F55\u522B\u540D"), 513), [
            [vue.vShow, tipIsShow.value]
          ])
        ], 64);
      };
    }
  });
  const LocalAlias_vue_vue_type_style_index_0_scoped_c3f0e0f8_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const LocalAlias = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c3f0e0f8"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-d7e90c14"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "tip" }, " nginx \u6587\u4EF6\u670D\u52A1\u5668\u7684\u5730\u5740\uFF0C\u53EF\u4EE5\u6DFB\u52A0\u591A\u4E2A ", -1));
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "ServerUrl",
    setup(__props) {
      const serverUrl = vue.ref("");
      const { getServerUrl, setServerUrl, removeServerUrl } = useServerUrlStore();
      const handleAddServerUrl = (url) => {
        if (url === "")
          return;
        const prefix2 = url.startsWith("https://") ? "" : url.startsWith("http://") ? "" : "http://";
        const serverUrl2 = (prefix2 + suffixCheck(url)).replaceAll(" ", "");
        setServerUrl([...getServerUrl(), serverUrl2]);
      };
      const handleRemoveServerUrl = (targetUrl) => {
        removeServerUrl(targetUrl);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(NInputGroup), null, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(NInput), {
                value: serverUrl.value,
                "onUpdate:value": _cache[0] || (_cache[0] = ($event) => serverUrl.value = $event),
                size: "small",
                placeholder: "\u670D\u52A1\u5668\u5730\u5740...",
                onKeyup: _cache[1] || (_cache[1] = vue.withKeys(($event) => handleAddServerUrl(serverUrl.value), ["enter"]))
              }, null, 8, ["value"]),
              vue.createVNode(vue.unref(NButton), {
                type: "tertiary",
                size: "small",
                onClick: _cache[2] || (_cache[2] = ($event) => handleAddServerUrl(serverUrl.value))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" \u6DFB\u52A0 ")
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(getServerUrl)(), (url) => {
            return vue.openBlock(), vue.createElementBlock("div", { key: url }, [
              vue.createVNode(vue.unref(NTag), {
                closable: "",
                onClose: ($event) => handleRemoveServerUrl(url)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(url), 1)
                ]),
                _: 2
              }, 1032, ["onClose"])
            ]);
          }), 128)),
          _hoisted_1$1
        ], 64);
      };
    }
  });
  const ServerUrl_vue_vue_type_style_index_0_scoped_d7e90c14_lang = "";
  const ServerUrl = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d7e90c14"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "MpvMenu",
    setup(__props) {
      const { getIina, toggleIina } = useIinaStore();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(ServerUrl),
          vue.createVNode(LocalAlias),
          vue.createVNode(vue.unref(NButton), {
            size: "small",
            onClick: vue.unref(toggleIina)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(vue.unref(getIina)() ? "\u5173\u95ED\u4F7F\u7528 IINA \u64AD\u653E" : "\u4F7F\u7528 IINA \u64AD\u653E"), 1)
            ]),
            _: 1
          }, 8, ["onClick"])
        ], 64);
      };
    }
  });
  function useReset(fn) {
    const episodeUlEle = document.querySelector(".prg_list");
    if (!episodeUlEle) {
      console.error("\u5267\u96C6 html \u6807\u7B7E\u91CD\u7F6E\u4E8B\u4EF6\u5931\u8D25");
      return;
    }
    for (const episodeLiEle of episodeUlEle.children) {
      const epATag = episodeLiEle.children[0];
      epATag.href = "javascript:void(0)";
      epATag.addEventListener("click", function() {
        fn(this);
      });
    }
  }
  const matchVideoReg = new RegExp('(?<=href=")([^"]*(mp4|mkv|mov|flv))');
  const matchSubFolderReg = new RegExp('(?<=href=")(?!(\\/|\\.\\/|\\.\\.\\/))([^"]*\\/)', "g");
  var monkeyWindow = window;
  var GM_xmlhttpRequest = /* @__PURE__ */ (() => monkeyWindow.GM_xmlhttpRequest)();
  function useAjax(options) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...options,
        onload(res) {
          resolve(res);
        },
        onerror(err) {
          reject(err);
        }
      });
    });
  }
  async function useGetAnimeList(urls) {
    const animeList = {};
    for (const url of urls) {
      try {
        const res = await useAjax({ url });
        const indexDom = res.responseXML;
        if (indexDom) {
          indexDom.querySelectorAll("a").forEach((item) => {
            var _a2;
            if (animeList[url] === void 0)
              animeList[url] = [];
            animeList[url].push(((_a2 = item.textContent) == null ? void 0 : _a2.slice(0, -1)) || "");
          });
        }
      } catch (error) {
        alert("\u8BF7\u6C42\u670D\u52A1\u5668\u9519\u8BEF\uFF0C\u8BE6\u60C5\u5728 console");
        console.error("useGetAnimeList", error);
        throw new Error("ajax error");
      }
    }
    return animeList;
  }
  function useGetAnimeName() {
    var _a2, _b, _c;
    return (_c = (_b = (_a2 = document.querySelector("#infobox")) == null ? void 0 : _a2.children[0]) == null ? void 0 : _b.textContent) == null ? void 0 : _c.slice(5);
  }
  async function useGetAnimePathUrl(alias) {
    const { getServerUrl } = useServerUrlStore();
    const curAnimeName = useGetAnimeName();
    if (alias !== void 0 && alias !== null)
      return alias;
    const animeList = await useGetAnimeList(getServerUrl());
    for (const [serverUrl, animeNameList] of Object.entries(animeList)) {
      for (const anime of animeNameList) {
        if (anime === curAnimeName) {
          const animePathUrl = serverUrl + suffixCheck(curAnimeName);
          return animePathUrl;
        }
      }
    }
  }
  async function useGetAnimeFileUrl(baseUrl, epId) {
    const url = new URL(`${epId}/`, baseUrl).href;
    const movieUrl = await handleSubFolder(url);
    return movieUrl;
  }
  async function handleSubFolder(url) {
    var _a2;
    try {
      const dom = (await useAjax({ url })).responseText;
      const movieUrl = (_a2 = dom.match(matchVideoReg)) == null ? void 0 : _a2[0];
      if (movieUrl)
        return new URL(movieUrl, url).href;
      const subFolderList = dom.match(matchSubFolderReg);
      if (subFolderList) {
        for (const subFolder of subFolderList) {
          if (subFolder)
            return await handleSubFolder(new URL(subFolder, url).href);
        }
      }
    } catch (error) {
      console.error("handleSubFolder", error);
    }
  }
  async function useOpenMpv(event) {
    const { getAlias } = useLocalAliasStore();
    const animePathUrl = await useGetAnimePathUrl(getAlias());
    if (animePathUrl === void 0) {
      console.error(`\u5BFB\u627E\u672C\u5730\u6587\u4EF6\u8DEF\u5F84\u5931\u8D25, animePathUrl: ${animePathUrl}`);
      alert("\u5BFB\u627E\u672C\u5730\u6587\u4EF6\u8DEF\u5F84\u5931\u8D25, \u786E\u5B9A\u670D\u52A1\u5668\u7684\u6587\u4EF6\u5939\u4E2D\u662F\u5426\u5B58\u5728\u8BE5\u756A\u5267\u3002\n\u4E5F\u53EF\u4EE5\u5C1D\u8BD5\u4F7F\u7528\u76EE\u5F55\u522B\u540D");
      return;
    }
    const epId = event.textContent;
    const markId = event.id.slice(4);
    if (epId === null) {
      console.error("\u83B7\u53D6 epId \u5931\u8D25");
      return;
    } else if (markId === void 0) {
      console.error("\u83B7\u53D6 markId \u5931\u8D25");
      return;
    }
    const movieUrl = await useGetAnimeFileUrl(animePathUrl, +epId);
    if (movieUrl === void 0) {
      alert(`\u89C6\u9891\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C\u68C0\u67E5\u4E00\u4E0B\u662F\u5426\u5B58\u5728\u7B2C ${epId} \u96C6\uFF1F`);
      console.error("baseURL", animePathUrl, "epId", epId, "\u5267\u96C6\u7684\u6587\u4EF6\u5939\u5982\u679C\u662F 0x (01 02) \u8FD9\u6837\u7684\u5F62\u5F0F\uFF0C\u9700\u8981\u628A 0 \u53BB\u6389");
      return;
    }
    openMpv(movieUrl, markId, epId);
  }
  function openMpv(url, markId, epId) {
    const { getIina } = useIinaStore();
    const iframe = document.createElement("iframe");
    const safeUrl = btoa(url).replace(/\//g, "_").replace(/\+/g, "-");
    if (getIina())
      iframe.src = `iina://weblink?url=${url}`;
    else
      iframe.src = `mpv://play/${safeUrl}`;
    document.body.appendChild(iframe);
    markEpIsSeen(markId, epId || "");
  }
  function markEpIsSeen(markId, epId) {
    const button = document.querySelector(`#Watched_${markId}`);
    button == null ? void 0 : button.click();
    console.info(`\u7B2C ${epId} \u96C6\u6807\u8BB0\u4E3A\u5DF2\u770B`);
  }
  const _hoisted_1 = { class: "main" };
  const _hoisted_2 = {
    key: 0,
    class: "menu-content"
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const menuVisible = vue.ref(false);
      const toggleMenuVisible = () => {
        menuVisible.value = !menuVisible.value;
      };
      useReset(useOpenMpv);
      const node = document.documentElement;
      const getCurrentMode = () => node.getAttribute("data-theme") === "dark";
      const isDarkMode = vue.ref(getCurrentMode());
      const observerCallback = (mutationList, observer2) => {
        mutationList.forEach((mutation) => {
          if (mutation.type === "attributes")
            isDarkMode.value = getCurrentMode();
        });
      };
      const observer = new MutationObserver(observerCallback);
      vue.onMounted(() => {
        observer.observe(node, { attributes: true });
      });
      vue.onUnmounted(() => {
        observer.disconnect();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(NConfigProvider), {
          theme: isDarkMode.value ? vue.unref(darkTheme) : null
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1, [
              vue.createElementVNode("button", {
                class: "main-button",
                onClick: toggleMenuVisible
              }, " MPV \u8BBE\u7F6E "),
              menuVisible.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
                vue.createVNode(_sfc_main$1)
              ])) : vue.createCommentVNode("", true)
            ])
          ]),
          _: 1
        }, 8, ["theme"]);
      };
    }
  });
  const App_vue_vue_type_style_index_0_scoped_1d1c372f_lang = "";
  const App_vue_vue_type_style_index_1_lang = "";
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1d1c372f"]]);
  function main() {
    const parent = document.querySelector(".navTabs");
    const children = document.createElement("li");
    parent == null ? void 0 : parent.append(children);
    return children;
  }
  vue.createApp(App).use(createPinia()).mount(main());
})(Vue);
