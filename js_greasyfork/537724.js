// ==UserScript==
// @name         牛客网工具箱
// @namespace    https://github.com/eclipher/Userscripts
// @version      1.0.0
// @author       eclipher
// @description  复制问题为Markdown，保存为Jupyter Notebook
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nowcoder.com
// @homepage     https://github.com/eclipher/Userscripts/tree/main/userscripts/nowcoder-toolkit
// @match        *://www.nowcoder.com/practice/*
// @require      https://cdn.jsdelivr.net/npm/compressorjs@1.2.1
// @require      https://cdn.jsdelivr.net/npm/turndown@7.2.0/lib/turndown.browser.umd.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/537724/%E7%89%9B%E5%AE%A2%E7%BD%91%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/537724/%E7%89%9B%E5%AE%A2%E7%BD%91%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' div.svelte-11kvm4p{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #61d345);position:relative;transform:rotate(45deg);animation:svelte-11kvm4p-circleAnimation .3s cubic-bezier(.175,.885,.32,1.275) forwards;animation-delay:.1s}div.svelte-11kvm4p:after{content:"";box-sizing:border-box;animation:svelte-11kvm4p-checkmarkAnimation .2s ease-out forwards;opacity:0;animation-delay:.2s;position:absolute;border-right:2px solid;border-bottom:2px solid;border-color:var(--secondary, #fff);bottom:6px;left:6px;height:10px;width:6px}@keyframes svelte-11kvm4p-circleAnimation{0%{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-11kvm4p-checkmarkAnimation{0%{height:0;width:0;opacity:0}40%{height:0;width:6px;opacity:1}to{opacity:1;height:10px}}div.svelte-1ee93ns{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--primary, #ff4b4b);position:relative;transform:rotate(45deg);animation:svelte-1ee93ns-circleAnimation .3s cubic-bezier(.175,.885,.32,1.275) forwards;animation-delay:.1s}div.svelte-1ee93ns:after,div.svelte-1ee93ns:before{content:"";animation:svelte-1ee93ns-firstLineAnimation .15s ease-out forwards;animation-delay:.15s;position:absolute;border-radius:3px;opacity:0;background:var(--secondary, #fff);bottom:9px;left:4px;height:2px;width:12px}div.svelte-1ee93ns:before{animation:svelte-1ee93ns-secondLineAnimation .15s ease-out forwards;animation-delay:.18s;transform:rotate(90deg)}@keyframes svelte-1ee93ns-circleAnimation{0%{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes svelte-1ee93ns-firstLineAnimation{0%{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes svelte-1ee93ns-secondLineAnimation{0%{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(90deg);opacity:1}}div.svelte-1j7dflg{width:12px;height:12px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--secondary, #e0e0e0);border-right-color:var(--primary, #616161);animation:svelte-1j7dflg-rotate 1s linear infinite}@keyframes svelte-1j7dflg-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.indicator.svelte-1kgeier{position:relative;display:flex;justify-content:center;align-items:center;min-width:20px;min-height:20px}.status.svelte-1kgeier{position:absolute}.animated.svelte-1kgeier{position:relative;transform:scale(.6);opacity:.4;min-width:20px;animation:svelte-1kgeier-enter .3s .12s cubic-bezier(.175,.885,.32,1.275) forwards}@keyframes svelte-1kgeier-enter{0%{transform:scale(.6);opacity:.4}to{transform:scale(1);opacity:1}}.message.svelte-1nauejd{display:flex;justify-content:center;margin:4px 10px;color:inherit;flex:1 1 auto;white-space:pre-line}@keyframes svelte-1c9srrs-enterAnimation{0%{transform:translate3d(0,calc(var(--factor) * -200%),0) scale(.6);opacity:.5}to{transform:translateZ(0) scale(1);opacity:1}}@keyframes svelte-1c9srrs-exitAnimation{0%{transform:translateZ(-1px) scale(1);opacity:1}to{transform:translate3d(0,calc(var(--factor) * -150%),-1px) scale(.6);opacity:0}}@keyframes svelte-1c9srrs-fadeInAnimation{0%{opacity:0}to{opacity:1}}@keyframes svelte-1c9srrs-fadeOutAnimation{0%{opacity:1}to{opacity:0}}.base.svelte-1c9srrs{display:flex;align-items:center;background:#fff;color:#363636;line-height:1.3;will-change:transform;box-shadow:0 3px 10px #0000001a,0 3px 3px #0000000d;max-width:350px;pointer-events:auto;padding:8px 10px;border-radius:8px}.transparent.svelte-1c9srrs{opacity:0}.enter.svelte-1c9srrs{animation:svelte-1c9srrs-enterAnimation .35s cubic-bezier(.21,1.02,.73,1) forwards}.exit.svelte-1c9srrs{animation:svelte-1c9srrs-exitAnimation .4s cubic-bezier(.06,.71,.55,1) forwards}.fadeIn.svelte-1c9srrs{animation:svelte-1c9srrs-fadeInAnimation .35s cubic-bezier(.21,1.02,.73,1) forwards}.fadeOut.svelte-1c9srrs{animation:svelte-1c9srrs-fadeOutAnimation .4s cubic-bezier(.06,.71,.55,1) forwards}.wrapper.svelte-v01oml{left:0;right:0;display:flex;position:absolute;transform:translateY(calc(var(--offset, 16px) * var(--factor) * 1px))}.transition.svelte-v01oml{transition:all .23s cubic-bezier(.21,1.02,.73,1)}.active.svelte-v01oml{z-index:9999}.active.svelte-v01oml>*{pointer-events:auto}.toaster.svelte-1phplh9{--default-offset: 16px;position:fixed;z-index:9999;top:var(--default-offset);left:var(--default-offset);right:var(--default-offset);bottom:var(--default-offset);pointer-events:none}div.svelte-4mbyk0{display:inline-flex;flex-wrap:wrap;gap:.4rem}button.svelte-ll0ynk,a.svelte-ll0ynk{color:#fff;background-color:var(--bg, #6c5ce7);box-shadow:0 3px 0 0 var(--shadow, #a29bfe);padding:5px 20px;font-size:.8rem;font-weight:500;border-radius:5px;transition:all ease .1s;display:inline-flex;align-items:center;gap:.25rem;-webkit-user-select:none;user-select:none}button.svelte-ll0ynk:active,a.svelte-ll0ynk:active{transform:translateY(3px);box-shadow:0 0 0 0 var(--shadow, #a29bfe)}button.svelte-ll0ynk:disabled,a.svelte-ll0ynk:disabled{pointer-events:none;opacity:50%} ');

(function (TurndownService, Compressor) {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var _listeners, _observer, _options, _ResizeObserverSingleton_instances, getObserver_fn, _a, _cells, _metadata, _nbformat, _nbformat_minor;
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  function is_function(thing) {
    return typeof thing === "function";
  }
  const noop = () => {
  };
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const UNOWNED = 1 << 8;
  const DISCONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const HEAD_EFFECT = 1 << 19;
  const EFFECT_HAS_DERIVED = 1 << 20;
  const EFFECT_IS_UPDATING = 1 << 21;
  const STATE_SYMBOL = Symbol("$state");
  const LEGACY_PROPS = Symbol("legacy props");
  const LOADING_ATTR_SYMBOL = Symbol("");
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  const ATTACHMENT_KEY = "@attach";
  function lifecycle_outside_component(name) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    var ctx = component_context = {
      p: component_context,
      c: null,
      d: false,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null
    };
    if (legacy_mode_flag && !runes) {
      component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: source(false)
      };
    }
    teardown(() => {
      ctx.d = true;
    });
  }
  function pop(component2) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
      if (component2 !== void 0) {
        context_stack_item.x = component2;
      }
      const component_effects = context_stack_item.e;
      if (component_effects !== null) {
        var previous_effect = active_effect;
        var previous_reaction = active_reaction;
        context_stack_item.e = null;
        try {
          for (var i = 0; i < component_effects.length; i++) {
            var component_effect = component_effects[i];
            set_active_effect(component_effect.effect);
            set_active_reaction(component_effect.reaction);
            effect(component_effect.fn);
          }
        } finally {
          set_active_effect(previous_effect);
          set_active_reaction(previous_reaction);
        }
      }
      component_context = context_stack_item.p;
      context_stack_item.m = true;
    }
    return component2 || /** @type {T} */
    {};
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = /* @__PURE__ */ state(0);
    var reaction = active_reaction;
    var with_parent = (fn) => {
      var previous_reaction = active_reaction;
      set_active_reaction(reaction);
      var result = fn();
      set_active_reaction(previous_reaction);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            s = with_parent(() => /* @__PURE__ */ state(descriptor.value));
            sources.set(prop2, s);
          } else {
            set(
              s,
              with_parent(() => proxy(descriptor.value))
            );
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target) {
              sources.set(
                prop2,
                with_parent(() => /* @__PURE__ */ state(UNINITIALIZED))
              );
              update_version(version);
            }
          } else {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n < ls.v) {
                set(ls, n);
              }
            }
            set(s, UNINITIALIZED);
            update_version(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target;
          if (s === void 0 && (!exists || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            s = with_parent(() => /* @__PURE__ */ state(proxy(exists ? target[prop2] : UNINITIALIZED)));
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v2 = get$1(s);
            return v2 === UNINITIALIZED ? void 0 : v2;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop2);
            if (s) descriptor.value = get$1(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s !== void 0 || active_effect !== null && (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            if (s === void 0) {
              s = with_parent(() => /* @__PURE__ */ state(has ? proxy(target[prop2]) : UNINITIALIZED));
              sources.set(prop2, s);
            }
            var value2 = get$1(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var _a2;
          var s = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable)) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(
                s,
                with_parent(() => proxy(value2))
              );
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            set(
              s,
              with_parent(() => proxy(value2))
            );
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            update_version(version);
          }
          return true;
        },
        ownKeys(target) {
          get$1(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function update_version(signal, d = 1) {
    set(signal, signal.v + d);
  }
  function get_proxied_value(value) {
    try {
      if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
        return value[STATE_SYMBOL];
      }
    } catch {
    }
    return value;
  }
  function is(a, b) {
    return Object.is(get_proxied_value(a), get_proxied_value(b));
  }
  // @__NO_SIDE_EFFECTS__
  function derived$1(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
      /** @type {Derived} */
      active_reaction
    ) : null;
    if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_HAS_DERIVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        null
      ),
      wv: 0,
      parent: parent_derived ?? active_effect
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived$1(fn);
    push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived$1(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (
          /** @type {Effect} */
          parent
        );
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) return;
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
  }
  const old_values = /* @__PURE__ */ new Map();
  function source(v2, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v: v2,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v2, stack) {
    const s = source(v2);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false) {
    var _a2;
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (legacy_mode_flag && component_context !== null && component_context.l !== null) {
      ((_a2 = component_context.l).s ?? (_a2.s = [])).push(s);
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && !untracking && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 && !(reaction_sources == null ? void 0 : reaction_sources.includes(source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
            /** @type {Derived} */
            source2
          );
        }
        set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
    return value;
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags = reaction.f;
      if ((flags & DIRTY) !== 0) continue;
      if (!runes && reaction === active_effect) continue;
      set_signal_status(reaction, status);
      if ((flags & (CLEAN | UNOWNED)) !== 0) {
        if ((flags & DERIVED) !== 0) {
          mark_reactions(
            /** @type {Derived} */
            reaction,
            MAYBE_DIRTY
          );
        } else {
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  function select_multiple_invalid_value() {
    {
      console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
    }
  }
  let hydrating = false;
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return first_child_getter.call(node);
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first = (
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment
        )
      );
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn, sync, push2 = true) {
    var parent = active_effect;
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & (EFFECT_HAS_DERIVED | BOUNDARY_EFFECT)) === 0;
    if (!inert && push2) {
      if (parent !== null) {
        push_effect(effect2, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ?? (derived2.effects = [])).push(effect2);
      }
    }
    return effect2;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var defer = active_effect !== null && (active_effect.f & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.m;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push({
        fn,
        effect: active_effect,
        reaction: active_reaction
      });
    } else {
      var signal = effect(fn);
      return signal;
    }
  }
  function user_pre_effect(fn) {
    validate_effect();
    return render_effect(fn);
  }
  function component_root(fn) {
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn, thunks = [], d = derived$1) {
    const deriveds = thunks.map(d);
    const effect2 = () => fn(...deriveds.map(get$1));
    return block(effect2);
  }
  function block(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn, true);
  }
  function branch(fn, push2 = true) {
    return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null) {
      remove_effect_dom(
        effect2.nodes_start,
        /** @type {TemplateNode} */
        effect2.nodes_end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect2);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      effect2.f ^= CLEAN;
    }
    if (check_dirtiness(effect2)) {
      set_signal_status(effect2, DIRTY);
      schedule_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0) {
      queueMicrotask(run_micro_tasks);
    }
    micro_tasks.push(fn);
  }
  let is_throwing_error = false;
  let is_flushing = false;
  let last_scheduled_effect = null;
  let is_updating_effect = false;
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let queued_root_effects = [];
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let reaction_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && active_reaction.f & EFFECT_IS_UPDATING) {
      if (reaction_sources === null) {
        reaction_sources = [value];
      } else {
        reaction_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function check_dirtiness(reaction) {
    var _a2;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i;
        var dependency;
        var is_disconnected = (flags & DISCONNECTED) !== 0;
        var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if (is_disconnected || is_unowned_connected) {
          var derived2 = (
            /** @type {Derived} */
            reaction
          );
          var parent = derived2.parent;
          for (i = 0; i < length; i++) {
            dependency = dependencies[i];
            if (is_disconnected || !((_a2 = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _a2.includes(derived2))) {
              (dependency.reactions ?? (dependency.reactions = [])).push(derived2);
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (check_dirtiness(
            /** @type {Derived} */
            dependency
          )) {
            update_derived(
              /** @type {Derived} */
              dependency
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || active_effect !== null && !skip_reaction) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function propagate_error(error, effect2) {
    var current = effect2;
    while (current !== null) {
      if ((current.f & BOUNDARY_EFFECT) !== 0) {
        try {
          current.fn(error);
          return;
        } catch {
          current.f ^= BOUNDARY_EFFECT;
        }
      }
      current = current.parent;
    }
    is_throwing_error = false;
    throw error;
  }
  function should_rethrow_error(effect2) {
    return (effect2.f & DESTROYED) === 0 && (effect2.parent === null || (effect2.parent.f & BOUNDARY_EFFECT) === 0);
  }
  function handle_error(error, effect2, previous_effect, component_context2) {
    if (is_throwing_error) {
      if (previous_effect === null) {
        is_throwing_error = false;
      }
      if (should_rethrow_error(effect2)) {
        throw error;
      }
      return;
    }
    if (previous_effect !== null) {
      is_throwing_error = true;
    }
    propagate_error(error, effect2);
    if (should_rethrow_error(effect2)) {
      throw error;
    }
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if (reaction_sources == null ? void 0 : reaction_sources.includes(signal)) continue;
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var previous_reaction_sources = reaction_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
    active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    reaction_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    read_version++;
    reaction.f |= EFFECT_IS_UPDATING;
    try {
      var result = (
        /** @type {Function} */
        (0, reaction.fn)()
      );
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!skip_reaction) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      reaction_sources = previous_reaction_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      reaction.f ^= EFFECT_IS_UPDATING;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index = index_of.call(reactions, signal);
      if (index !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !new_deps.includes(dependency))) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
        /** @type {Derived} **/
        dependency
      );
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var previous_component_context = component_context;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      var deps = effect2.deps;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && deps !== null) ;
      if (DEV) ;
    } catch (error) {
      handle_error(error, effect2, previous_effect, previous_component_context || effect2.ctx);
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      if (last_scheduled_effect !== null) {
        {
          handle_error(error, last_scheduled_effect, null);
        }
      } else {
        throw error;
      }
    }
  }
  function flush_queued_root_effects() {
    var was_updating_effect = is_updating_effect;
    try {
      var flush_count = 0;
      is_updating_effect = true;
      while (queued_root_effects.length > 0) {
        if (flush_count++ > 1e3) {
          infinite_loop_guard();
        }
        var root_effects = queued_root_effects;
        var length = root_effects.length;
        queued_root_effects = [];
        for (var i = 0; i < length; i++) {
          var collected_effects = process_effects(root_effects[i]);
          flush_queued_effects(collected_effects);
        }
        old_values.clear();
      }
    } finally {
      is_flushing = false;
      is_updating_effect = was_updating_effect;
      last_scheduled_effect = null;
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    for (var i = 0; i < length; i++) {
      var effect2 = effects[i];
      if ((effect2.f & (DESTROYED | INERT)) === 0) {
        try {
          if (check_dirtiness(effect2)) {
            update_effect(effect2);
            if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
              if (effect2.teardown === null) {
                unlink_effect(effect2);
              } else {
                effect2.fn = null;
              }
            }
          }
        } catch (error) {
          handle_error(error, effect2, null, effect2.ctx);
        }
      }
    }
  }
  function schedule_effect(signal) {
    if (!is_flushing) {
      is_flushing = true;
      queueMicrotask(flush_queued_root_effects);
    }
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  function process_effects(root2) {
    var effects = [];
    var effect2 = root2;
    while (effect2 !== null) {
      var flags = effect2.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      if (!is_skippable_branch && (flags & INERT) === 0) {
        if ((flags & EFFECT) !== 0) {
          effects.push(effect2);
        } else if (is_branch) {
          effect2.f ^= CLEAN;
        } else {
          try {
            if (check_dirtiness(effect2)) {
              update_effect(effect2);
            }
          } catch (error) {
            handle_error(error, effect2, null, effect2.ctx);
          }
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      var parent = effect2.parent;
      effect2 = effect2.next;
      while (effect2 === null && parent !== null) {
        effect2 = parent.next;
        parent = parent.parent;
      }
    }
    return effects;
  }
  function get$1(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      if (!(reaction_sources == null ? void 0 : reaction_sources.includes(signal))) {
        var deps = active_reaction.deps;
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      }
    } else if (is_derived && /** @type {Derived} */
    signal.deps === null && /** @type {Derived} */
    signal.effects === null) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    return signal.v;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop2 = value[key];
        if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
          deep_read(prop2);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
    !(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e2) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e2) {
            }
          }
        }
      }
    }
  }
  function is_capture_event(name) {
    return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
  }
  const DELEGATED_EVENTS = [
    "beforeinput",
    "click",
    "change",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart"
  ];
  function is_delegated(event_name) {
    return DELEGATED_EVENTS.includes(event_name);
  }
  const ATTRIBUTE_ALIASES = {
    // no `class: 'className'` because we handle that separately
    formnovalidate: "formNoValidate",
    ismap: "isMap",
    nomodule: "noModule",
    playsinline: "playsInline",
    readonly: "readOnly",
    defaultvalue: "defaultValue",
    defaultchecked: "defaultChecked",
    srcobject: "srcObject",
    novalidate: "noValidate",
    allowfullscreen: "allowFullscreen",
    disablepictureinpicture: "disablePictureInPicture",
    disableremoteplayback: "disableRemotePlayback"
  };
  function normalize_attribute(name) {
    name = name.toLowerCase();
    return ATTRIBUTE_ALIASES[name] ?? name;
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  function autofocus(dom, value) {
    if (value) {
      const body = document.body;
      dom.autofocus = true;
      queue_micro_task(() => {
        if (document.activeElement === body) {
          dom.focus();
        }
      });
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return without_reactive_context(() => {
          return handler == null ? void 0 : handler.call(this, event2);
        });
      }
    }
    if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
      queue_micro_task(() => {
        dom.addEventListener(event_name, target_handler, options);
      });
    } else {
      dom.addEventListener(event_name, target_handler, options);
    }
    return target_handler;
  }
  function event(event_name, dom, handler, capture, passive) {
    var options = { capture, passive };
    var target_handler = create_event(event_name, dom, handler, options);
    if (dom === document.body || // @ts-ignore
    dom === window || // @ts-ignore
    dom === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
    dom instanceof HTMLMediaElement) {
      teardown(() => {
        dom.removeEventListener(event_name, target_handler, options);
      });
    }
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  function handle_event_propagation(event2) {
    var _a2;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = ((_a2 = event2.composedPath) == null ? void 0 : _a2.call(event2)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event2.target
    );
    var path_idx = 0;
    var handled_at = event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event2.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event2.target === current_target)) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event2, ...data]);
            } else {
              delegated.call(current_target, event2);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event2.__root = handler_element;
      delete event2.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html) {
    var elem = document.createElement("template");
    elem.innerHTML = html.replaceAll("<!>", "<!---->");
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {Node} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_namespace(content, flags, ns = "svg") {
    var has_start = !content.startsWith("<!>");
    var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
    var node;
    return () => {
      if (!node) {
        var fragment = (
          /** @type {DocumentFragment} */
          create_fragment_from_html(wrapped)
        );
        var root2 = (
          /** @type {Element} */
          /* @__PURE__ */ get_first_child(fragment)
        );
        {
          node = /** @type {Element} */
          /* @__PURE__ */ get_first_child(root2);
        }
      }
      var clone = (
        /** @type {TemplateNode} */
        node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  // @__NO_SIDE_EFFECTS__
  function from_svg(content, flags) {
    return /* @__PURE__ */ from_namespace(content, flags, "svg");
  }
  function text(value = "") {
    {
      var t = create_text(value + "");
      assign_nodes(t, t);
      return t;
    }
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  function set_text(text2, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text2.__t ?? (text2.__t = text2.nodeValue))) {
      text2.__t = str;
      text2.nodeValue = str + "";
    }
  }
  function mount(component2, options) {
    return _mount(component2, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component2 = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component2 = Component(anchor_node, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n = (
            /** @type {number} */
            document_listeners.get(event_name)
          );
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null ? void 0 : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component2, unmount);
    return component2;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function if_block(node, fn, [root_index, hydrate_index] = [0, 0]) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = UNINITIALIZED;
    var flags = root_index > 0 ? EFFECT_TRANSPARENT : 0;
    var has_branch = false;
    const set_branch = (fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    };
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      if (condition) {
        if (consequent_effect) {
          resume_effect(consequent_effect);
        } else if (fn2) {
          consequent_effect = branch(() => fn2(anchor));
        }
        if (alternate_effect) {
          pause_effect(alternate_effect, () => {
            alternate_effect = null;
          });
        }
      } else {
        if (alternate_effect) {
          resume_effect(alternate_effect);
        } else if (fn2) {
          alternate_effect = branch(() => fn2(anchor, [root_index + 1, hydrate_index]));
        }
        if (consequent_effect) {
          pause_effect(consequent_effect, () => {
            consequent_effect = null;
          });
        }
      }
    };
    block(() => {
      has_branch = false;
      fn(set_branch);
      if (!has_branch) {
        update_branch(null, null);
      }
    }, flags);
  }
  function pause_effects(state2, items, controlled_anchor, items_map) {
    var transitions = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
      pause_children(items[i].e, transitions, true);
    }
    var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor
      );
      items_map.clear();
      link(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state2, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var was_empty = false;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    block(() => {
      var array = get$1(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      {
        reconcile(array, state2, anchor, render_fn, flags, get_key, get_collection);
      }
      if (fallback_fn !== null) {
        if (length === 0) {
          if (fallback) {
            resume_effect(fallback);
          } else {
            fallback = branch(() => fallback_fn(anchor));
          }
        } else if (fallback !== null) {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
      get$1(each_array);
    });
  }
  function reconcile(array, state2, anchor, render_fn, flags, get_key, get_collection) {
    var length = array.length;
    var items = state2.items;
    var first = state2.first;
    var current = first;
    var seen;
    var prev = null;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var item;
    var i;
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      item = items.get(key);
      if (item === void 0) {
        var child_anchor = current ? (
          /** @type {TemplateNode} */
          current.e.nodes_start
        ) : anchor;
        prev = create_item(
          child_anchor,
          state2,
          prev,
          prev === null ? state2.first : prev.next,
          value,
          key,
          i,
          render_fn,
          flags,
          get_collection
        );
        items.set(key, prev);
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
      {
        update_item(item, value, i);
      }
      if ((item.e.f & INERT) !== 0) {
        resume_effect(item.e);
      }
      if (item !== current) {
        if (seen !== void 0 && seen.has(item)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state2, item.prev, item.next);
            link(state2, item, prev === null ? state2.first : prev.next);
            link(state2, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key) {
          if ((current.e.f & INERT) === 0) {
            (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          }
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
        item = current;
      }
      matched.push(item);
      prev = item;
      current = item.next;
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = seen === void 0 ? [] : array_from(seen);
      while (current !== null) {
        if ((current.e.f & INERT) === 0) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = length === 0 ? anchor : null;
        pause_effects(state2, to_destroy, controlled_anchor, items);
      }
    }
    active_effect.first = state2.first && state2.first.e;
    active_effect.last = prev && prev.e;
  }
  function update_item(item, value, index, type) {
    {
      internal_set(item.v, value);
    }
    {
      item.i = index;
    }
  }
  function create_item(anchor, state2, prev, next, value, key, index, render_fn, flags, get_collection) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v2 = reactive ? mutable ? /* @__PURE__ */ mutable_source(value) : source(value) : value;
    var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index : source(index);
    var item = {
      i,
      v: v2,
      k: key,
      a: null,
      // @ts-expect-error
      e: null,
      prev,
      next
    };
    try {
      item.e = branch(() => render_fn(anchor, v2, i, get_collection), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        state2.first = item;
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next !== null) {
        next.prev = item;
        next.e.prev = item.e;
      }
      return item;
    } finally {
    }
  }
  function move(item, next, anchor) {
    var end = item.next ? (
      /** @type {TemplateNode} */
      item.next.e.nodes_start
    ) : anchor;
    var dest = next ? (
      /** @type {TemplateNode} */
      next.e.nodes_start
    ) : anchor;
    var node = (
      /** @type {TemplateNode} */
      item.e.nodes_start
    );
    while (node !== end) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function snippet(node, get_snippet, ...args) {
    var anchor = node;
    var snippet2 = noop;
    var snippet_effect;
    block(() => {
      if (snippet2 === (snippet2 = get_snippet())) return;
      if (snippet_effect) {
        destroy_effect(snippet_effect);
        snippet_effect = null;
      }
      snippet_effect = branch(() => (
        /** @type {SnippetFn} */
        snippet2(anchor, ...args)
      ));
    }, EFFECT_TRANSPARENT);
  }
  function component(node, get_component, render_fn) {
    var anchor = node;
    var component2;
    var effect2;
    block(() => {
      if (component2 === (component2 = get_component())) return;
      if (effect2) {
        pause_effect(effect2);
        effect2 = null;
      }
      if (component2) {
        effect2 = branch(() => render_fn(anchor, component2));
      }
    }, EFFECT_TRANSPARENT);
  }
  function attach(node, get_fn) {
    var fn = void 0;
    var e2;
    block(() => {
      if (fn !== (fn = get_fn())) {
        if (e2) {
          destroy_effect(e2);
          e2 = null;
        }
        if (fn) {
          e2 = branch(() => {
            effect(() => (
              /** @type {(node: Element) => void} */
              fn(node)
            ));
          });
        }
      }
    });
  }
  function r(e2) {
    var t, f, n = "";
    if ("string" == typeof e2 || "number" == typeof e2) n += e2;
    else if ("object" == typeof e2) if (Array.isArray(e2)) {
      var o = e2.length;
      for (t = 0; t < o; t++) e2[t] && (f = r(e2[t])) && (n && (n += " "), n += f);
    } else for (f in e2) e2[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx$1() {
    for (var e2, t, f = 0, n = "", o = arguments.length; f < o; f++) (e2 = arguments[f]) && (t = r(e2)) && (n && (n += " "), n += t);
    return n;
  }
  function clsx(value) {
    if (typeof value === "object") {
      return clsx$1(value);
    } else {
      return value ?? "";
    }
  }
  const whitespace = [..." 	\n\r\f \v\uFEFF"];
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash) {
      classname = classname ? classname + " " + hash : hash;
    }
    if (directives) {
      for (var key in directives) {
        if (directives[key]) {
          classname = classname ? classname + " " + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a = 0;
          while ((a = classname.indexOf(key, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function append_styles(styles, important = false) {
    var separator = important ? " !important;" : ";";
    var css = "";
    for (var key in styles) {
      var value = styles[key];
      if (value != null && value !== "") {
        css += " " + key + ": " + value + separator;
      }
    }
    return css;
  }
  function to_css_name(name) {
    if (name[0] !== "-" || name[1] !== "-") {
      return name.toLowerCase();
    }
    return name;
  }
  function to_style(value, styles) {
    if (styles) {
      var new_style = "";
      var normal_styles;
      var important_styles;
      if (Array.isArray(styles)) {
        normal_styles = styles[0];
        important_styles = styles[1];
      } else {
        normal_styles = styles;
      }
      if (value) {
        value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
        var in_str = false;
        var in_apo = 0;
        var in_comment = false;
        var reserved_names = [];
        if (normal_styles) {
          reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
        }
        if (important_styles) {
          reserved_names.push(...Object.keys(important_styles).map(to_css_name));
        }
        var start_index = 0;
        var name_index = -1;
        const len = value.length;
        for (var i = 0; i < len; i++) {
          var c = value[i];
          if (in_comment) {
            if (c === "/" && value[i - 1] === "*") {
              in_comment = false;
            }
          } else if (in_str) {
            if (in_str === c) {
              in_str = false;
            }
          } else if (c === "/" && value[i + 1] === "*") {
            in_comment = true;
          } else if (c === '"' || c === "'") {
            in_str = c;
          } else if (c === "(") {
            in_apo++;
          } else if (c === ")") {
            in_apo--;
          }
          if (!in_comment && in_str === false && in_apo === 0) {
            if (c === ":" && name_index === -1) {
              name_index = i;
            } else if (c === ";" || i === len - 1) {
              if (name_index !== -1) {
                var name = to_css_name(value.substring(start_index, name_index).trim());
                if (!reserved_names.includes(name)) {
                  if (c !== ";") {
                    i++;
                  }
                  var property = value.substring(start_index, i).trim();
                  new_style += " " + property + ";";
                }
              }
              start_index = i + 1;
              name_index = -1;
            }
          }
        }
      }
      if (normal_styles) {
        new_style += append_styles(normal_styles);
      }
      if (important_styles) {
        new_style += append_styles(important_styles, true);
      }
      new_style = new_style.trim();
      return new_style === "" ? null : new_style;
    }
    return value == null ? null : String(value);
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else if (is_html) {
          dom.className = next_class_name;
        } else {
          dom.setAttribute("class", next_class_name);
        }
      }
      dom.__className = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key in next_classes) {
        var is_present = !!next_classes[key];
        if (prev_classes == null || is_present !== !!prev_classes[key]) {
          dom.classList.toggle(key, is_present);
        }
      }
    }
    return next_classes;
  }
  function update_styles(dom, prev = {}, next, priority) {
    for (var key in next) {
      var value = next[key];
      if (prev[key] !== value) {
        if (next[key] == null) {
          dom.style.removeProperty(key);
        } else {
          dom.style.setProperty(key, value, priority);
        }
      }
    }
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = dom.__style;
    if (prev !== value) {
      var next_style_attr = to_style(value, next_styles);
      {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom.__style = value;
    } else if (next_styles) {
      if (Array.isArray(next_styles)) {
        update_styles(dom, prev_styles == null ? void 0 : prev_styles[0], next_styles[0]);
        update_styles(dom, prev_styles == null ? void 0 : prev_styles[1], next_styles[1], "important");
      } else {
        update_styles(dom, prev_styles, next_styles);
      }
    }
    return next_styles;
  }
  function select_option(select, value, mounting) {
    if (select.multiple) {
      if (value == void 0) {
        return;
      }
      if (!is_array(value)) {
        return select_multiple_invalid_value();
      }
      for (var option of select.options) {
        option.selected = value.includes(get_option_value(option));
      }
      return;
    }
    for (option of select.options) {
      var option_value = get_option_value(option);
      if (is(option_value, value)) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function init_select(select, get_value) {
    let mounting = true;
    effect(() => {
      if (get_value) {
        select_option(select, untrack(get_value), mounting);
      }
      mounting = false;
      var observer = new MutationObserver(() => {
        var value = select.__value;
        select_option(select, value);
      });
      observer.observe(select, {
        // Listen to option element changes
        childList: true,
        subtree: true,
        // because of <optgroup>
        // Listen to option element value attribute changes
        // (doesn't get notified of select value changes,
        // because that property is not reflected as an attribute)
        attributes: true,
        attributeFilter: ["value"]
      });
      return () => {
        observer.disconnect();
      };
    });
  }
  function get_option_value(option) {
    if ("__value" in option) {
      return option.__value;
    } else {
      return option.value;
    }
  }
  const CLASS = Symbol("class");
  const STYLE = Symbol("style");
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_selected(element, selected) {
    if (selected) {
      if (!element.hasAttribute("selected")) {
        element.setAttribute("selected", "");
      }
    } else {
      element.removeAttribute("selected");
    }
  }
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function set_attributes(element, prev, next, css_hash, skip_warning = false) {
    var attributes = get_attributes(element);
    var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
    var preserve_attribute_case = !attributes[IS_HTML];
    var current = prev || {};
    var is_option_element = element.tagName === "OPTION";
    for (var key in prev) {
      if (!(key in next)) {
        next[key] = null;
      }
    }
    if (next.class) {
      next.class = clsx(next.class);
    } else if (css_hash || next[CLASS]) {
      next.class = null;
    }
    if (next[STYLE]) {
      next.style ?? (next.style = null);
    }
    var setters = get_setters(element);
    for (const key2 in next) {
      let value = next[key2];
      if (is_option_element && key2 === "value" && value == null) {
        element.value = element.__value = "";
        current[key2] = value;
        continue;
      }
      if (key2 === "class") {
        var is_html = element.namespaceURI === "http://www.w3.org/1999/xhtml";
        set_class(element, is_html, value, css_hash, prev == null ? void 0 : prev[CLASS], next[CLASS]);
        current[key2] = value;
        current[CLASS] = next[CLASS];
        continue;
      }
      if (key2 === "style") {
        set_style(element, value, prev == null ? void 0 : prev[STYLE], next[STYLE]);
        current[key2] = value;
        current[STYLE] = next[STYLE];
        continue;
      }
      var prev_value = current[key2];
      if (value === prev_value) continue;
      current[key2] = value;
      var prefix = key2[0] + key2[1];
      if (prefix === "$$") continue;
      if (prefix === "on") {
        const opts = {};
        const event_handle_key = "$$" + key2;
        let event_name = key2.slice(2);
        var delegated = is_delegated(event_name);
        if (is_capture_event(event_name)) {
          event_name = event_name.slice(0, -7);
          opts.capture = true;
        }
        if (!delegated && prev_value) {
          if (value != null) continue;
          element.removeEventListener(event_name, current[event_handle_key], opts);
          current[event_handle_key] = null;
        }
        if (value != null) {
          if (!delegated) {
            let handle = function(evt) {
              current[key2].call(this, evt);
            };
            current[event_handle_key] = create_event(event_name, element, handle, opts);
          } else {
            element[`__${event_name}`] = value;
            delegate([event_name]);
          }
        } else if (delegated) {
          element[`__${event_name}`] = void 0;
        }
      } else if (key2 === "style") {
        set_attribute(element, key2, value);
      } else if (key2 === "autofocus") {
        autofocus(
          /** @type {HTMLElement} */
          element,
          Boolean(value)
        );
      } else if (!is_custom_element && (key2 === "__value" || key2 === "value" && value != null)) {
        element.value = element.__value = value;
      } else if (key2 === "selected" && is_option_element) {
        set_selected(
          /** @type {HTMLOptionElement} */
          element,
          value
        );
      } else {
        var name = key2;
        if (!preserve_attribute_case) {
          name = normalize_attribute(name);
        }
        var is_default = name === "defaultValue" || name === "defaultChecked";
        if (value == null && !is_custom_element && !is_default) {
          attributes[key2] = null;
          if (name === "value" || name === "checked") {
            let input = (
              /** @type {HTMLInputElement} */
              element
            );
            const use_default = prev === void 0;
            if (name === "value") {
              let previous = input.defaultValue;
              input.removeAttribute(name);
              input.defaultValue = previous;
              input.value = input.__value = use_default ? previous : null;
            } else {
              let previous = input.defaultChecked;
              input.removeAttribute(name);
              input.defaultChecked = previous;
              input.checked = use_default ? previous : false;
            }
          } else {
            element.removeAttribute(key2);
          }
        } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
          element[name] = value;
        } else if (typeof value !== "function") {
          set_attribute(element, name, value);
        }
      }
    }
    return current;
  }
  function attribute_effect(element, fn, thunks = [], css_hash, skip_warning = false, d = derived$1) {
    const deriveds = thunks.map(d);
    var prev = void 0;
    var effects = {};
    var is_select = element.nodeName === "SELECT";
    var inited = false;
    block(() => {
      var next = fn(...deriveds.map(get$1));
      set_attributes(element, prev, next, css_hash, skip_warning);
      if (inited && is_select) {
        select_option(
          /** @type {HTMLSelectElement} */
          element,
          next.value,
          false
        );
      }
      for (let symbol of Object.getOwnPropertySymbols(effects)) {
        if (!next[symbol]) destroy_effect(effects[symbol]);
      }
      for (let symbol of Object.getOwnPropertySymbols(next)) {
        var n = next[symbol];
        if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
          if (effects[symbol]) destroy_effect(effects[symbol]);
          effects[symbol] = branch(() => attach(element, () => n));
        }
      }
      prev = next;
    });
    if (is_select) {
      init_select(
        /** @type {HTMLSelectElement} */
        element,
        () => (
          /** @type {Record<string | symbol, any>} */
          prev.value
        )
      );
    }
    inited = true;
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ?? (element.__attributes = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function bind_prop(props, prop2, value) {
    var desc = get_descriptor(props, prop2);
    if (desc && desc.set) {
      props[prop2] = value;
      teardown(() => {
        props[prop2] = null;
      });
    }
  }
  const _ResizeObserverSingleton = class _ResizeObserverSingleton {
    /** @param {ResizeObserverOptions} options */
    constructor(options) {
      __privateAdd(this, _ResizeObserverSingleton_instances);
      /** */
      __privateAdd(this, _listeners, /* @__PURE__ */ new WeakMap());
      /** @type {ResizeObserver | undefined} */
      __privateAdd(this, _observer);
      /** @type {ResizeObserverOptions} */
      __privateAdd(this, _options);
      __privateSet(this, _options, options);
    }
    /**
     * @param {Element} element
     * @param {(entry: ResizeObserverEntry) => any} listener
     */
    observe(element, listener) {
      var listeners = __privateGet(this, _listeners).get(element) || /* @__PURE__ */ new Set();
      listeners.add(listener);
      __privateGet(this, _listeners).set(element, listeners);
      __privateMethod(this, _ResizeObserverSingleton_instances, getObserver_fn).call(this).observe(element, __privateGet(this, _options));
      return () => {
        var listeners2 = __privateGet(this, _listeners).get(element);
        listeners2.delete(listener);
        if (listeners2.size === 0) {
          __privateGet(this, _listeners).delete(element);
          __privateGet(this, _observer).unobserve(element);
        }
      };
    }
  };
  _listeners = new WeakMap();
  _observer = new WeakMap();
  _options = new WeakMap();
  _ResizeObserverSingleton_instances = new WeakSet();
  getObserver_fn = function() {
    return __privateGet(this, _observer) ?? __privateSet(this, _observer, new ResizeObserver(
      /** @param {any} entries */
      (entries) => {
        for (var entry of entries) {
          _ResizeObserverSingleton.entries.set(entry.target, entry);
          for (var listener of __privateGet(this, _listeners).get(entry.target) || []) {
            listener(entry);
          }
        }
      }
    ));
  };
  /** @static */
  __publicField(_ResizeObserverSingleton, "entries", /* @__PURE__ */ new WeakMap());
  let ResizeObserverSingleton = _ResizeObserverSingleton;
  var resize_observer_border_box = /* @__PURE__ */ new ResizeObserverSingleton({
    box: "border-box"
  });
  function bind_element_size(element, type, set2) {
    var unsub = resize_observer_border_box.observe(element, () => set2(element[type]));
    effect(() => {
      untrack(() => set2(element[type]));
      return unsub;
    });
  }
  function init(immutable = false) {
    const context = (
      /** @type {ComponentContextLegacy} */
      component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version = 0;
      let prev = (
        /** @type {Record<string, any>} */
        {}
      );
      const d = /* @__PURE__ */ derived$1(() => {
        let changed = false;
        const props2 = context.s;
        for (const key in props2) {
          if (props2[key] !== prev[key]) {
            prev[key] = props2[key];
            changed = true;
          }
        }
        if (changed) version++;
        return version;
      });
      props = () => get$1(d);
    }
    if (callbacks.b.length) {
      user_pre_effect(() => {
        observe_all(context, props);
        run_all(callbacks.b);
      });
    }
    user_effect(() => {
      const fns = untrack(() => callbacks.m.map(run));
      return () => {
        for (const fn of fns) {
          if (typeof fn === "function") {
            fn();
          }
        }
      };
    });
    if (callbacks.a.length) {
      user_effect(() => {
        observe_all(context, props);
        run_all(callbacks.a);
      });
    }
  }
  function observe_all(context, props) {
    if (context.l.s) {
      for (const signal of context.l.s) get$1(signal);
    }
    props();
  }
  function subscribe_to_store(store, run2, invalidate) {
    if (store == null) {
      run2(void 0);
      if (invalidate) invalidate(void 0);
      return noop;
    }
    const unsub = untrack(
      () => store.subscribe(
        run2,
        // @ts-expect-error
        invalidate
      )
    );
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  const subscriber_queue = [];
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe
    };
  }
  function writable(value, start = noop) {
    let stop = null;
    const subscribers = /* @__PURE__ */ new Set();
    function set2(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
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
    function update2(fn) {
      set2(fn(
        /** @type {T} */
        value
      ));
    }
    function subscribe(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set2, update2) || noop;
      }
      run2(
        /** @type {T} */
        value
      );
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set: set2, update: update2, subscribe };
  }
  function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    if (!stores_array.every(Boolean)) {
      throw new Error("derived() expects stores as input, got a falsy value");
    }
    const auto = fn.length < 2;
    return readable(initial_value, (set2, update2) => {
      let started = false;
      const values = [];
      let pending = 0;
      let cleanup = noop;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup();
        const result = fn(single ? values[0] : values, set2, update2);
        if (auto) {
          set2(result);
        } else {
          cleanup = typeof result === "function" ? result : noop;
        }
      };
      const unsubscribers = stores_array.map(
        (store, i) => subscribe_to_store(
          store,
          (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (started) {
              sync();
            }
          },
          () => {
            pending |= 1 << i;
          }
        )
      );
      started = true;
      sync();
      return function stop() {
        run_all(unsubscribers);
        cleanup();
        started = false;
      };
    });
  }
  function get(store) {
    let value;
    subscribe_to_store(store, (_) => value = _)();
    return value;
  }
  let IS_UNMOUNTED = Symbol();
  function store_get(store, store_name, stores) {
    const entry = stores[store_name] ?? (stores[store_name] = {
      store: null,
      source: /* @__PURE__ */ mutable_source(void 0),
      unsubscribe: noop
    });
    if (entry.store !== store && !(IS_UNMOUNTED in stores)) {
      entry.unsubscribe();
      entry.store = store ?? null;
      if (store == null) {
        entry.source.v = void 0;
        entry.unsubscribe = noop;
      } else {
        var is_synchronous_callback = true;
        entry.unsubscribe = subscribe_to_store(store, (v2) => {
          if (is_synchronous_callback) {
            entry.source.v = v2;
          } else {
            set(entry.source, v2);
          }
        });
        is_synchronous_callback = false;
      }
    }
    if (store && IS_UNMOUNTED in stores) {
      return get(store);
    }
    return get$1(entry.source);
  }
  function setup_stores() {
    const stores = {};
    function cleanup() {
      teardown(() => {
        for (var store_name in stores) {
          const ref = stores[store_name];
          ref.unsubscribe();
        }
        define_property(stores, IS_UNMOUNTED, {
          enumerable: false,
          value: true
        });
      });
    }
    return [stores, cleanup];
  }
  const rest_props_handler = {
    get(target, key) {
      if (target.exclude.includes(key)) return;
      return target.props[key];
    },
    set(target, key) {
      return false;
    },
    getOwnPropertyDescriptor(target, key) {
      if (target.exclude.includes(key)) return;
      if (key in target.props) {
        return {
          enumerable: true,
          configurable: true,
          value: target.props[key]
        };
      }
    },
    has(target, key) {
      if (target.exclude.includes(key)) return false;
      return key in target.props;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
    }
  };
  // @__NO_SIDE_EFFECTS__
  function rest_props(props, exclude, name) {
    return new Proxy(
      { props, exclude },
      rest_props_handler
    );
  }
  const spread_props_handler = {
    get(target, key) {
      let i = target.props.length;
      while (i--) {
        let p = target.props[i];
        if (is_function(p)) p = p();
        if (typeof p === "object" && p !== null && key in p) return p[key];
      }
    },
    set(target, key, value) {
      let i = target.props.length;
      while (i--) {
        let p = target.props[i];
        if (is_function(p)) p = p();
        const desc = get_descriptor(p, key);
        if (desc && desc.set) {
          desc.set(value);
          return true;
        }
      }
      return false;
    },
    getOwnPropertyDescriptor(target, key) {
      let i = target.props.length;
      while (i--) {
        let p = target.props[i];
        if (is_function(p)) p = p();
        if (typeof p === "object" && p !== null && key in p) {
          const descriptor = get_descriptor(p, key);
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true;
          }
          return descriptor;
        }
      }
    },
    has(target, key) {
      if (key === STATE_SYMBOL || key === LEGACY_PROPS) return false;
      for (let p of target.props) {
        if (is_function(p)) p = p();
        if (p != null && key in p) return true;
      }
      return false;
    },
    ownKeys(target) {
      const keys = [];
      for (let p of target.props) {
        if (is_function(p)) p = p();
        if (!p) continue;
        for (const key in p) {
          if (!keys.includes(key)) keys.push(key);
        }
        for (const key of Object.getOwnPropertySymbols(p)) {
          if (!keys.includes(key)) keys.push(key);
        }
      }
      return keys;
    }
  };
  function spread_props(...props) {
    return new Proxy({ props }, spread_props_handler);
  }
  function prop(props, key, flags, fallback) {
    var prop_value;
    {
      prop_value = /** @type {V} */
      props[key];
    }
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var get_fallback = () => {
      if (fallback_dirty) {
        fallback_dirty = false;
        {
          fallback_value = /** @type {V} */
          fallback;
        }
      }
      return fallback_value;
    };
    if (prop_value === void 0 && fallback !== void 0) {
      prop_value = get_fallback();
    }
    var getter;
    {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    }
    {
      return getter;
    }
  }
  function onMount(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    if (legacy_mode_flag && component_context.l !== null) {
      init_update_callbacks(component_context).m.push(fn);
    } else {
      user_effect(() => {
        const cleanup = untrack(fn);
        if (typeof cleanup === "function") return (
          /** @type {() => void} */
          cleanup
        );
      });
    }
  }
  function onDestroy(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    onMount(() => () => untrack(fn));
  }
  function init_update_callbacks(context) {
    var l = (
      /** @type {ComponentContextLegacy} */
      context.l
    );
    return l.u ?? (l.u = { a: [], b: [], m: [] });
  }
  function writableDerived(origins, derive, reflect, initial) {
    var childDerivedSetter, originValues, blockNextDerive = false;
    var reflectOldValues = reflect.length >= 2;
    var wrappedDerive = (got, set2, update3) => {
      childDerivedSetter = set2;
      if (reflectOldValues) {
        originValues = got;
      }
      if (!blockNextDerive) {
        let returned = derive(got, set2, update3);
        if (derive.length < 2) {
          set2(returned);
        } else {
          return returned;
        }
      }
      blockNextDerive = false;
    };
    var childDerived = derived(origins, wrappedDerive, initial);
    var singleOrigin = !Array.isArray(origins);
    function doReflect(reflecting) {
      var setWith = reflect(reflecting, originValues);
      if (singleOrigin) {
        blockNextDerive = true;
        origins.set(setWith);
      } else {
        setWith.forEach((value, i) => {
          blockNextDerive = true;
          origins[i].set(value);
        });
      }
      blockNextDerive = false;
    }
    var tryingSet = false;
    function update2(fn) {
      var isUpdated, mutatedBySubscriptions, oldValue, newValue;
      if (tryingSet) {
        newValue = fn(get(childDerived));
        childDerivedSetter(newValue);
        return;
      }
      var unsubscribe = childDerived.subscribe((value) => {
        if (!tryingSet) {
          oldValue = value;
        } else if (!isUpdated) {
          isUpdated = true;
        } else {
          mutatedBySubscriptions = true;
        }
      });
      newValue = fn(oldValue);
      tryingSet = true;
      childDerivedSetter(newValue);
      unsubscribe();
      tryingSet = false;
      if (mutatedBySubscriptions) {
        newValue = get(childDerived);
      }
      if (isUpdated) {
        doReflect(newValue);
      }
    }
    return {
      subscribe: childDerived.subscribe,
      set(value) {
        update2(() => value);
      },
      update: update2
    };
  }
  const TOAST_LIMIT = 20;
  const toasts = writable([]);
  const pausedAt = writable(null);
  const toastTimeouts = /* @__PURE__ */ new Map();
  const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId)) {
      return;
    }
    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId);
      remove(toastId);
    }, 1e3);
    toastTimeouts.set(toastId, timeout);
  };
  const clearFromRemoveQueue = (toastId) => {
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
      clearTimeout(timeout);
    }
  };
  function update(toast2, clearTimeout2 = true) {
    if (clearTimeout2 && toast2.id) {
      clearFromRemoveQueue(toast2.id);
    }
    toasts.update(($toasts) => $toasts.map((t) => t.id === toast2.id ? { ...t, ...toast2 } : t));
  }
  function add(toast2) {
    toasts.update(($toasts) => [toast2, ...$toasts].slice(0, TOAST_LIMIT));
  }
  function upsert(toast2) {
    if (get(toasts).find((t) => t.id === toast2.id)) {
      update(toast2);
    } else {
      add(toast2);
    }
  }
  function dismiss(toastId) {
    toasts.update(($toasts) => {
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        $toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return $toasts.map((t) => t.id === toastId || toastId === void 0 ? { ...t, visible: false } : t);
    });
  }
  function remove(toastId) {
    toasts.update(($toasts) => {
      if (toastId === void 0) {
        return [];
      }
      return $toasts.filter((t) => t.id !== toastId);
    });
  }
  function startPause(time) {
    pausedAt.set(time);
  }
  function endPause(time) {
    let diff;
    pausedAt.update(($pausedAt) => {
      diff = time - ($pausedAt || 0);
      return null;
    });
    toasts.update(($toasts) => $toasts.map((t) => ({
      ...t,
      pauseDuration: t.pauseDuration + diff
    })));
  }
  const defaultTimeouts = {
    blank: 4e3,
    error: 4e3,
    success: 2e3,
    loading: Infinity,
    custom: 4e3
  };
  function useToasterStore(toastOptions = {}) {
    const mergedToasts = writableDerived(toasts, ($toasts) => $toasts.map((t) => {
      var _a2, _b;
      return {
        ...toastOptions,
        ...toastOptions[t.type],
        ...t,
        duration: t.duration || ((_a2 = toastOptions[t.type]) == null ? void 0 : _a2.duration) || (toastOptions == null ? void 0 : toastOptions.duration) || defaultTimeouts[t.type],
        style: [toastOptions.style, (_b = toastOptions[t.type]) == null ? void 0 : _b.style, t.style].join(";")
      };
    }), ($toasts) => $toasts);
    return {
      toasts: mergedToasts,
      pausedAt
    };
  }
  const isFunction = (valOrFunction) => typeof valOrFunction === "function";
  const resolveValue = (valOrFunction, arg) => isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction;
  const genId = /* @__PURE__ */ (() => {
    let count = 0;
    return () => {
      count += 1;
      return count.toString();
    };
  })();
  const prefersReducedMotion = /* @__PURE__ */ (() => {
    let shouldReduceMotion;
    return () => {
      if (shouldReduceMotion === void 0 && typeof window !== "undefined") {
        const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
        shouldReduceMotion = !mediaQuery || mediaQuery.matches;
      }
      return shouldReduceMotion;
    };
  })();
  const createToast = (message, type = "blank", opts) => ({
    createdAt: Date.now(),
    visible: true,
    type,
    ariaProps: {
      role: "status",
      "aria-live": "polite"
    },
    message,
    pauseDuration: 0,
    icon: opts == null ? void 0 : opts.icon,
    duration: opts == null ? void 0 : opts.duration,
    iconTheme: opts == null ? void 0 : opts.iconTheme,
    position: opts == null ? void 0 : opts.position,
    props: opts == null ? void 0 : opts.props,
    id: (opts == null ? void 0 : opts.id) || genId()
  });
  const createHandler = (type) => (message, options) => {
    const toast2 = createToast(message, type, options);
    upsert(toast2);
    return toast2.id;
  };
  const toast = (message, opts) => createHandler("blank")(message, opts);
  toast.error = createHandler("error");
  toast.success = createHandler("success");
  toast.loading = createHandler("loading");
  toast.custom = createHandler("custom");
  toast.dismiss = (toastId) => {
    dismiss(toastId);
  };
  toast.remove = (toastId) => remove(toastId);
  toast.promise = (promise, msgs, opts) => {
    const id = toast.loading(msgs.loading, { ...opts, ...opts == null ? void 0 : opts.loading });
    promise.then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
        ...opts == null ? void 0 : opts.success
      });
      return p;
    }).catch((e2) => {
      toast.error(resolveValue(msgs.error, e2), {
        id,
        ...opts,
        ...opts == null ? void 0 : opts.error
      });
    });
    return promise;
  };
  function calculateOffset(toast2, $toasts, opts) {
    const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
    const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast2.position || defaultPosition) && t.height);
    const toastIndex = relevantToasts.findIndex((t) => t.id === toast2.id);
    const toastsBefore = relevantToasts.filter((toast3, i) => i < toastIndex && toast3.visible).length;
    const offset = relevantToasts.filter((t) => t.visible).slice(...reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]).reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
    return offset;
  }
  const handlers = {
    startPause() {
      startPause(Date.now());
    },
    endPause() {
      endPause(Date.now());
    },
    updateHeight: (toastId, height) => {
      update({ id: toastId, height }, false);
    },
    calculateOffset
  };
  function useToaster(toastOptions) {
    const { toasts: toasts2, pausedAt: pausedAt2 } = useToasterStore(toastOptions);
    const timeouts = /* @__PURE__ */ new Map();
    let _pausedAt;
    const unsubscribes = [
      pausedAt2.subscribe(($pausedAt) => {
        if ($pausedAt) {
          for (const [, timeoutId] of timeouts) {
            clearTimeout(timeoutId);
          }
          timeouts.clear();
        }
        _pausedAt = $pausedAt;
      }),
      toasts2.subscribe(($toasts) => {
        if (_pausedAt) {
          return;
        }
        const now = Date.now();
        for (const t of $toasts) {
          if (timeouts.has(t.id)) {
            continue;
          }
          if (t.duration === Infinity) {
            continue;
          }
          const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt);
          if (durationLeft < 0) {
            if (t.visible) {
              toast.dismiss(t.id);
            }
            return null;
          }
          timeouts.set(t.id, setTimeout(() => toast.dismiss(t.id), durationLeft));
        }
      })
    ];
    onDestroy(() => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
    });
    return { toasts: toasts2, handlers };
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((_a = window.__svelte ?? (window.__svelte = {})).v ?? (_a.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
  }
  var root$7 = /* @__PURE__ */ from_html(`<div class="svelte-11kvm4p"></div>`);
  function CheckmarkIcon($$anchor, $$props) {
    let primary = prop($$props, "primary", 3, "#61d345"), secondary = prop($$props, "secondary", 3, "#fff");
    var div = root$7();
    let styles;
    template_effect(() => styles = set_style(div, "", styles, {
      "--primary": primary(),
      "--secondary": secondary()
    }));
    append($$anchor, div);
  }
  var root$6 = /* @__PURE__ */ from_html(`<div class="svelte-1ee93ns"></div>`);
  function ErrorIcon($$anchor, $$props) {
    let primary = prop($$props, "primary", 3, "#ff4b4b"), secondary = prop($$props, "secondary", 3, "#fff");
    var div = root$6();
    let styles;
    template_effect(() => styles = set_style(div, "", styles, {
      "--primary": primary(),
      "--secondary": secondary()
    }));
    append($$anchor, div);
  }
  var root$5 = /* @__PURE__ */ from_html(`<div class="svelte-1j7dflg"></div>`);
  function LoaderIcon($$anchor, $$props) {
    let primary = prop($$props, "primary", 3, "#616161"), secondary = prop($$props, "secondary", 3, "#e0e0e0");
    var div = root$5();
    let styles;
    template_effect(() => styles = set_style(div, "", styles, {
      "--primary": primary(),
      "--secondary": secondary()
    }));
    append($$anchor, div);
  }
  var root_1$2 = /* @__PURE__ */ from_html(`<div class="animated svelte-1kgeier"> </div>`);
  var root_6$1 = /* @__PURE__ */ from_html(`<div class="status svelte-1kgeier"><!></div>`);
  var root_5 = /* @__PURE__ */ from_html(`<div class="indicator svelte-1kgeier"><!> <!></div>`);
  function ToastIcon($$anchor, $$props) {
    let type = /* @__PURE__ */ user_derived(() => $$props.toast.type), icon = /* @__PURE__ */ user_derived(() => $$props.toast.icon), iconTheme = /* @__PURE__ */ user_derived(() => $$props.toast.iconTheme);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$2();
        var text2 = child(div);
        template_effect(() => set_text(text2, get$1(icon)));
        append($$anchor2, div);
      };
      var alternate = ($$anchor2, $$elseif) => {
        {
          var consequent_1 = ($$anchor3) => {
            var fragment_1 = comment();
            const IconComponent = /* @__PURE__ */ user_derived(() => get$1(icon));
            var node_1 = first_child(fragment_1);
            component(node_1, () => get$1(IconComponent), ($$anchor4, $$component) => {
              $$component($$anchor4, {});
            });
            append($$anchor3, fragment_1);
          };
          var alternate_1 = ($$anchor3, $$elseif2) => {
            {
              var consequent_4 = ($$anchor4) => {
                var div_1 = root_5();
                var node_2 = child(div_1);
                LoaderIcon(node_2, spread_props(() => get$1(iconTheme)));
                var node_3 = sibling(node_2, 2);
                {
                  var consequent_3 = ($$anchor5) => {
                    var div_2 = root_6$1();
                    var node_4 = child(div_2);
                    {
                      var consequent_2 = ($$anchor6) => {
                        ErrorIcon($$anchor6, spread_props(() => get$1(iconTheme)));
                      };
                      var alternate_2 = ($$anchor6) => {
                        CheckmarkIcon($$anchor6, spread_props(() => get$1(iconTheme)));
                      };
                      if_block(node_4, ($$render) => {
                        if (get$1(type) === "error") $$render(consequent_2);
                        else $$render(alternate_2, false);
                      });
                    }
                    append($$anchor5, div_2);
                  };
                  if_block(node_3, ($$render) => {
                    if (get$1(type) !== "loading") $$render(consequent_3);
                  });
                }
                append($$anchor4, div_1);
              };
              if_block(
                $$anchor3,
                ($$render) => {
                  if (get$1(type) !== "blank") $$render(consequent_4);
                },
                $$elseif2
              );
            }
          };
          if_block(
            $$anchor2,
            ($$render) => {
              if (typeof get$1(icon) !== "undefined") $$render(consequent_1);
              else $$render(alternate_1, false);
            },
            $$elseif
          );
        }
      };
      if_block(node, ($$render) => {
        if (typeof get$1(icon) === "string") $$render(consequent);
        else $$render(alternate, false);
      });
    }
    append($$anchor, fragment);
  }
  var root$4 = /* @__PURE__ */ from_html(`<div><!></div>`);
  function ToastMessage($$anchor, $$props) {
    push($$props, true);
    var div = root$4();
    attribute_effect(div, () => ({ class: "message", ...$$props.toast.ariaProps }), void 0, "svelte-1nauejd");
    var node = child(div);
    {
      var consequent = ($$anchor2) => {
        var text$1 = text();
        template_effect(() => set_text(text$1, $$props.toast.message));
        append($$anchor2, text$1);
      };
      var alternate = ($$anchor2) => {
        var fragment_1 = comment();
        const Message = /* @__PURE__ */ user_derived(() => $$props.toast.message);
        var node_1 = first_child(fragment_1);
        component(node_1, () => get$1(Message), ($$anchor3, $$component) => {
          $$component($$anchor3, spread_props(
            {
              get toast() {
                return $$props.toast;
              }
            },
            () => $$props.toast.props
          ));
        });
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if (typeof $$props.toast.message === "string") $$render(consequent);
        else $$render(alternate, false);
      });
    }
    append($$anchor, div);
    pop();
  }
  var root_6 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  var root$3 = /* @__PURE__ */ from_html(`<div><!></div>`);
  function ToastBar($$anchor, $$props) {
    push($$props, true);
    let position = prop($$props, "position", 3, void 0), style = prop($$props, "style", 3, ""), Component = prop($$props, "Component", 3, void 0);
    let factor = /* @__PURE__ */ user_derived(() => {
      const top = ($$props.toast.position || position() || "top-center").includes("top");
      return top ? 1 : -1;
    });
    let animation = /* @__PURE__ */ user_derived(() => {
      const [enter, exit] = prefersReducedMotion() ? ["fadeIn", "fadeOut"] : ["enter", "exit"];
      return $$props.toast.visible ? enter : exit;
    });
    var div = root$3();
    let styles;
    var node = child(div);
    {
      var consequent = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        component(node_1, Component, ($$anchor3, $$component) => {
          {
            const icon = ($$anchor4) => {
              ToastIcon($$anchor4, {
                get toast() {
                  return $$props.toast;
                }
              });
            };
            const message = ($$anchor4) => {
              ToastMessage($$anchor4, {
                get toast() {
                  return $$props.toast;
                }
              });
            };
            $$component($$anchor3, {
              icon,
              message,
              $$slots: { icon: true, message: true }
            });
          }
        });
        append($$anchor2, fragment);
      };
      var alternate = ($$anchor2, $$elseif) => {
        {
          var consequent_1 = ($$anchor3) => {
            var fragment_3 = comment();
            var node_2 = first_child(fragment_3);
            snippet(node_2, () => $$props.children, () => ({
              ToastIcon,
              ToastMessage,
              toast: $$props.toast
            }));
            append($$anchor3, fragment_3);
          };
          var alternate_1 = ($$anchor3) => {
            var fragment_4 = root_6();
            var node_3 = first_child(fragment_4);
            ToastIcon(node_3, {
              get toast() {
                return $$props.toast;
              }
            });
            var node_4 = sibling(node_3, 2);
            ToastMessage(node_4, {
              get toast() {
                return $$props.toast;
              }
            });
            append($$anchor3, fragment_4);
          };
          if_block(
            $$anchor2,
            ($$render) => {
              if ($$props.children) $$render(consequent_1);
              else $$render(alternate_1, false);
            },
            $$elseif
          );
        }
      };
      if_block(node, ($$render) => {
        if (Component()) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    template_effect(() => {
      set_class(div, 1, `base ${($$props.toast.height ? get$1(animation) : "transparent") ?? ""} ${($$props.toast.className || "") ?? ""}`, "svelte-1c9srrs");
      styles = set_style(div, `${style() ?? ""}; ${$$props.toast.style ?? ""}`, styles, { "--factor": get$1(factor) });
    });
    append($$anchor, div);
    pop();
  }
  var root$2 = /* @__PURE__ */ from_html(`<div><!></div>`);
  function ToastWrapper($$anchor, $$props) {
    push($$props, true);
    let clientHeight = /* @__PURE__ */ state(void 0);
    onMount(() => {
      if (get$1(clientHeight) === void 0) return;
      $$props.setHeight(get$1(clientHeight));
    });
    let top = /* @__PURE__ */ user_derived(() => {
      var _a2;
      return ((_a2 = $$props.toast.position) == null ? void 0 : _a2.includes("top")) ? 0 : null;
    });
    let bottom = /* @__PURE__ */ user_derived(() => {
      var _a2;
      return ((_a2 = $$props.toast.position) == null ? void 0 : _a2.includes("bottom")) ? 0 : null;
    });
    let factor = /* @__PURE__ */ user_derived(() => {
      var _a2;
      return ((_a2 = $$props.toast.position) == null ? void 0 : _a2.includes("top")) ? 1 : -1;
    });
    let justifyContent = /* @__PURE__ */ user_derived(() => {
      var _a2, _b, _c;
      return ((_a2 = $$props.toast.position) == null ? void 0 : _a2.includes("center")) && "center" || (((_b = $$props.toast.position) == null ? void 0 : _b.includes("right")) || ((_c = $$props.toast.position) == null ? void 0 : _c.includes("end"))) && "flex-end" || null;
    });
    var div = root$2();
    let classes;
    let styles;
    var node = child(div);
    {
      var consequent = ($$anchor2) => {
        ToastMessage($$anchor2, {
          get toast() {
            return $$props.toast;
          }
        });
      };
      var alternate = ($$anchor2, $$elseif) => {
        {
          var consequent_1 = ($$anchor3) => {
            var fragment_1 = comment();
            var node_1 = first_child(fragment_1);
            snippet(node_1, () => $$props.children, () => ({ toast: $$props.toast }));
            append($$anchor3, fragment_1);
          };
          var alternate_1 = ($$anchor3) => {
            ToastBar($$anchor3, {
              get toast() {
                return $$props.toast;
              },
              get position() {
                return $$props.toast.position;
              }
            });
          };
          if_block(
            $$anchor2,
            ($$render) => {
              if ($$props.children) $$render(consequent_1);
              else $$render(alternate_1, false);
            },
            $$elseif
          );
        }
      };
      if_block(node, ($$render) => {
        if ($$props.toast.type === "custom") $$render(consequent);
        else $$render(alternate, false);
      });
    }
    template_effect(
      ($0) => {
        classes = set_class(div, 1, "wrapper svelte-v01oml", null, classes, $0);
        styles = set_style(div, "", styles, {
          "--factor": get$1(factor),
          "--offset": $$props.toast.offset,
          top: get$1(top),
          bottom: get$1(bottom),
          "justify-content": get$1(justifyContent)
        });
      },
      [
        () => ({
          active: $$props.toast.visible,
          transition: !prefersReducedMotion()
        })
      ]
    );
    bind_element_size(div, "clientHeight", ($$value) => set(clientHeight, $$value));
    append($$anchor, div);
    pop();
  }
  var root$1 = /* @__PURE__ */ from_html(`<div role="alert"></div>`);
  function Toaster($$anchor, $$props) {
    push($$props, true);
    const [$$stores, $$cleanup] = setup_stores();
    const $toasts = () => store_get(toasts2, "$toasts", $$stores);
    let reverseOrder = prop($$props, "reverseOrder", 3, false), position = prop($$props, "position", 3, "top-center"), toastOptions = prop($$props, "toastOptions", 3, void 0), gutter = prop($$props, "gutter", 3, 8), containerStyle = prop($$props, "containerStyle", 3, void 0), containerClassName = prop($$props, "containerClassName", 3, void 0);
    const { toasts: toasts2, handlers: handlers2 } = useToaster(toastOptions());
    let _toasts = /* @__PURE__ */ user_derived(() => $toasts().map((toast2) => ({
      ...toast2,
      position: toast2.position || position(),
      offset: handlers2.calculateOffset(toast2, $toasts(), {
        reverseOrder: reverseOrder(),
        gutter: gutter(),
        defaultPosition: position()
      })
    })));
    var div = root$1();
    each(div, 21, () => get$1(_toasts), (toast2) => toast2.id, ($$anchor2, toast2) => {
      ToastWrapper($$anchor2, {
        get toast() {
          return get$1(toast2);
        },
        setHeight: (height) => handlers2.updateHeight(get$1(toast2).id, height)
      });
    });
    template_effect(() => {
      set_class(div, 1, `toaster ${(containerClassName() || "") ?? ""}`, "svelte-1phplh9");
      set_style(div, containerStyle());
    });
    event("mouseenter", div, function(...$$args) {
      var _a2;
      (_a2 = handlers2.startPause) == null ? void 0 : _a2.apply(this, $$args);
    });
    event("mouseleave", div, function(...$$args) {
      var _a2;
      (_a2 = handlers2.endPause) == null ? void 0 : _a2.apply(this, $$args);
    });
    append($$anchor, div);
    pop();
    $$cleanup();
  }
  const messageToastTypes = ["error", "success", "loading", "info"];
  function createToastWithPrefix(prefix) {
    function addPrefix(message) {
      if (typeof message === "string") {
        return `${prefix}${message}`;
      }
      return message;
    }
    return new Proxy(toast, {
      // Handle direct function calls: toast('message')
      apply(target, thisArg, args) {
        if (args.length > 0) {
          args[0] = addPrefix(args[0]);
        }
        return Reflect.apply(target, thisArg, args);
      },
      get(target, prop2, receiver) {
        const originalProp = Reflect.get(target, prop2, receiver);
        if (typeof originalProp === "function" && messageToastTypes.includes(prop2.toString())) {
          return (...args) => {
            if (args.length > 0 && typeof args[0] === "string") {
              args[0] = addPrefix(args[0]);
            }
            return originalProp.apply(this, args);
          };
        }
        if (prop2 === "promise") {
          return (...args) => {
            const [promise, data] = args;
            if (!data) return originalProp;
            const prefixedData = {
              ...data,
              loading: typeof data.loading === "string" ? addPrefix(data.loading) : data.loading,
              success: typeof data.success === "string" ? addPrefix(data.success) : data.success,
              error: typeof data.error === "string" ? addPrefix(data.error) : data.error
            };
            return originalProp.call(this, promise, prefixedData);
          };
        }
        return originalProp;
      }
    });
  }
  const CONFIG = {
    APP_NAME: "Nowcoder Toolkit"
  };
  createToastWithPrefix(CONFIG.APP_NAME + ": ");
  class TimeoutError extends Error {
    constructor(item, timeout) {
      super();
      __publicField(this, "name", this.constructor.name);
      this.message = `"${item}" not found within timeout (${timeout}ms)`;
    }
  }
  function find(finderFn, {
    subject = document,
    observerOption = {
      childList: true,
      subtree: true
    },
    timeout = 5e3,
    itemName = "Item"
  }) {
    return new Promise((resolve, reject) => {
      const item = finderFn();
      if (item) return resolve(item);
      let timeoutId;
      const observer = new MutationObserver(() => {
        const item2 = finderFn();
        if (item2) {
          observer.disconnect();
          clearTimeout(timeoutId);
          return resolve(item2);
        }
      });
      observer.observe(subject, observerOption);
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          observer.disconnect();
          const error = new TimeoutError(itemName, timeout);
          console.error(error);
          return reject(error);
        }, timeout);
      }
    });
  }
  async function findElement(selector, {
    parent = document,
    timeout = 500,
    additionalRule
  } = {}) {
    const element = await find(
      () => {
        const el = parent.querySelector(selector);
        if (additionalRule && el) {
          return additionalRule(el) ? el : null;
        } else {
          return el;
        }
      },
      {
        subject: parent,
        timeout,
        itemName: `Element ${selector}`
      }
    );
    return element;
  }
  enable_legacy_mode_flag();
  var root = /* @__PURE__ */ from_html(`<div><!></div>`);
  function ButtonGroup($$anchor, $$props) {
    let props = /* @__PURE__ */ rest_props($$props, [
      "$$slots",
      "$$events",
      "$$legacy",
      "children"
    ]);
    var div = root();
    attribute_effect(div, () => ({ ...props }), void 0, "svelte-4mbyk0");
    var node = child(div);
    snippet(node, () => $$props.children);
    append($$anchor, div);
  }
  var turndownPluginGfm_cjs = {};
  var hasRequiredTurndownPluginGfm_cjs;
  function requireTurndownPluginGfm_cjs() {
    if (hasRequiredTurndownPluginGfm_cjs) return turndownPluginGfm_cjs;
    hasRequiredTurndownPluginGfm_cjs = 1;
    Object.defineProperty(turndownPluginGfm_cjs, "__esModule", { value: true });
    var highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;
    function highlightedCodeBlock(turndownService) {
      turndownService.addRule("highlightedCodeBlock", {
        filter: function(node) {
          var firstChild = node.firstChild;
          return node.nodeName === "DIV" && highlightRegExp.test(node.className) && firstChild && firstChild.nodeName === "PRE";
        },
        replacement: function(content, node, options) {
          var className = node.className || "";
          var language = (className.match(highlightRegExp) || [null, ""])[1];
          return "\n\n" + options.fence + language + "\n" + node.firstChild.textContent + "\n" + options.fence + "\n\n";
        }
      });
    }
    function strikethrough(turndownService) {
      turndownService.addRule("strikethrough", {
        filter: ["del", "s", "strike"],
        replacement: function(content) {
          return "~~" + content + "~~";
        }
      });
    }
    var indexOf = Array.prototype.indexOf;
    var every = Array.prototype.every;
    var rules = {};
    var alignMap = { left: ":---", right: "---:", center: ":---:" };
    let isCodeBlock_ = null;
    let options_ = null;
    const tableShouldBeSkippedCache_ = /* @__PURE__ */ new WeakMap();
    function getAlignment(node) {
      return node ? (node.getAttribute("align") || node.style.textAlign || "").toLowerCase() : "";
    }
    function getBorder(alignment) {
      return alignment ? alignMap[alignment] : "---";
    }
    function getColumnAlignment(table, columnIndex) {
      var votes = {
        left: 0,
        right: 0,
        center: 0,
        "": 0
      };
      var align = "";
      for (var i = 0; i < table.rows.length; ++i) {
        var row = table.rows[i];
        if (columnIndex < row.childNodes.length) {
          var cellAlignment = getAlignment(row.childNodes[columnIndex]);
          ++votes[cellAlignment];
          if (votes[cellAlignment] > votes[align]) {
            align = cellAlignment;
          }
        }
      }
      return align;
    }
    rules.tableCell = {
      filter: ["th", "td"],
      replacement: function(content, node) {
        if (tableShouldBeSkipped(nodeParentTable(node))) return content;
        return cell(content, node);
      }
    };
    rules.tableRow = {
      filter: "tr",
      replacement: function(content, node) {
        const parentTable = nodeParentTable(node);
        if (tableShouldBeSkipped(parentTable)) return content;
        var borderCells = "";
        if (isHeadingRow(node)) {
          const colCount = tableColCount(parentTable);
          for (var i = 0; i < colCount; i++) {
            const childNode = i < node.childNodes.length ? node.childNodes[i] : null;
            var border = getBorder(getColumnAlignment(parentTable, i));
            borderCells += cell(border, childNode, i);
          }
        }
        return "\n" + content + (borderCells ? "\n" + borderCells : "");
      }
    };
    rules.table = {
      filter: function(node, options) {
        return node.nodeName === "TABLE";
      },
      replacement: function(content, node) {
        if (tableShouldBeHtml(node, options_)) {
          let html = node.outerHTML;
          let divParent = nodeParentDiv(node);
          if (divParent === null || !divParent.classList.contains("joplin-table-wrapper")) {
            return `

<div class="joplin-table-wrapper">${html}</div>

`;
          } else {
            return html;
          }
        } else {
          if (tableShouldBeSkipped(node)) return content;
          content = content.replace(/\n+/g, "\n");
          var secondLine = content.trim().split("\n");
          if (secondLine.length >= 2) secondLine = secondLine[1];
          var secondLineIsDivider = /\| :?---/.test(secondLine);
          var columnCount = tableColCount(node);
          var emptyHeader = "";
          if (columnCount && !secondLineIsDivider) {
            emptyHeader = "|" + "     |".repeat(columnCount) + "\n|";
            for (var columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
              emptyHeader += " " + getBorder(getColumnAlignment(node, columnIndex)) + " |";
            }
          }
          const captionContent = node.caption ? node.caption.textContent || "" : "";
          const caption = captionContent ? `${captionContent}

` : "";
          const tableContent = `${emptyHeader}${content}`.trimStart();
          return `

${caption}${tableContent}

`;
        }
      }
    };
    rules.tableCaption = {
      filter: ["caption"],
      replacement: () => ""
    };
    rules.tableColgroup = {
      filter: ["colgroup", "col"],
      replacement: () => ""
    };
    rules.tableSection = {
      filter: ["thead", "tbody", "tfoot"],
      replacement: function(content) {
        return content;
      }
    };
    function isHeadingRow(tr) {
      var parentNode = tr.parentNode;
      return parentNode.nodeName === "THEAD" || parentNode.firstChild === tr && (parentNode.nodeName === "TABLE" || isFirstTbody(parentNode)) && every.call(tr.childNodes, function(n) {
        return n.nodeName === "TH";
      });
    }
    function isFirstTbody(element) {
      var previousSibling = element.previousSibling;
      return element.nodeName === "TBODY" && (!previousSibling || previousSibling.nodeName === "THEAD" && /^\s*$/i.test(previousSibling.textContent));
    }
    function cell(content, node = null, index = null) {
      if (index === null) index = indexOf.call(node.parentNode.childNodes, node);
      var prefix = " ";
      if (index === 0) prefix = "| ";
      let filteredContent = content.trim().replace(/\n\r/g, "<br>").replace(/\n/g, "<br>");
      filteredContent = filteredContent.replace(/\|+/g, "\\|");
      while (filteredContent.length < 3) filteredContent += " ";
      if (node) filteredContent = handleColSpan(filteredContent, node, " ");
      return prefix + filteredContent + " |";
    }
    function nodeContainsTable(node) {
      if (!node.childNodes) return false;
      for (let i = 0; i < node.childNodes.length; i++) {
        const child2 = node.childNodes[i];
        if (child2.nodeName === "TABLE") return true;
        if (nodeContainsTable(child2)) return true;
      }
      return false;
    }
    const nodeContains = (node, types) => {
      if (!node.childNodes) return false;
      for (let i = 0; i < node.childNodes.length; i++) {
        const child2 = node.childNodes[i];
        if (types === "code" && isCodeBlock_ && isCodeBlock_(child2)) return true;
        if (types.includes(child2.nodeName)) return true;
        if (nodeContains(child2, types)) return true;
      }
      return false;
    };
    const tableShouldBeHtml = (tableNode, options) => {
      const possibleTags = [
        "UL",
        "OL",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "HR",
        "BLOCKQUOTE"
      ];
      if (options.preserveNestedTables) possibleTags.push("TABLE");
      return nodeContains(tableNode, "code") || nodeContains(tableNode, possibleTags);
    };
    function tableShouldBeSkipped(tableNode) {
      const cached = tableShouldBeSkippedCache_.get(tableNode);
      if (cached !== void 0) return cached;
      const result = tableShouldBeSkipped_(tableNode);
      tableShouldBeSkippedCache_.set(tableNode, result);
      return result;
    }
    function tableShouldBeSkipped_(tableNode) {
      if (!tableNode) return true;
      if (!tableNode.rows) return true;
      if (tableNode.rows.length === 1 && tableNode.rows[0].childNodes.length <= 1) return true;
      if (nodeContainsTable(tableNode)) return true;
      return false;
    }
    function nodeParentDiv(node) {
      let parent = node.parentNode;
      while (parent.nodeName !== "DIV") {
        parent = parent.parentNode;
        if (!parent) return null;
      }
      return parent;
    }
    function nodeParentTable(node) {
      let parent = node.parentNode;
      while (parent.nodeName !== "TABLE") {
        parent = parent.parentNode;
        if (!parent) return null;
      }
      return parent;
    }
    function handleColSpan(content, node, emptyChar) {
      const colspan = node.getAttribute("colspan") || 1;
      for (let i = 1; i < colspan; i++) {
        content += " | " + emptyChar.repeat(3);
      }
      return content;
    }
    function tableColCount(node) {
      let maxColCount = 0;
      for (let i = 0; i < node.rows.length; i++) {
        const row = node.rows[i];
        const colCount = row.childNodes.length;
        if (colCount > maxColCount) maxColCount = colCount;
      }
      return maxColCount;
    }
    function tables(turndownService) {
      isCodeBlock_ = turndownService.isCodeBlock;
      options_ = turndownService.options;
      turndownService.keep(function(node) {
        if (node.nodeName === "TABLE" && tableShouldBeHtml(node, turndownService.options)) return true;
        return false;
      });
      for (var key in rules) turndownService.addRule(key, rules[key]);
    }
    function taskListItems(turndownService) {
      turndownService.addRule("taskListItems", {
        filter: function(node) {
          return node.type === "checkbox" && node.parentNode.nodeName === "LI";
        },
        replacement: function(content, node) {
          return (node.checked ? "[x]" : "[ ]") + " ";
        }
      });
    }
    function gfm(turndownService) {
      turndownService.use([
        highlightedCodeBlock,
        strikethrough,
        tables,
        taskListItems
      ]);
    }
    turndownPluginGfm_cjs.gfm = gfm;
    turndownPluginGfm_cjs.highlightedCodeBlock = highlightedCodeBlock;
    turndownPluginGfm_cjs.strikethrough = strikethrough;
    turndownPluginGfm_cjs.tables = tables;
    turndownPluginGfm_cjs.taskListItems = taskListItems;
    return turndownPluginGfm_cjs;
  }
  var turndownPluginGfm_cjsExports = requireTurndownPluginGfm_cjs();
  var M = "__monkeyWindow-" + (() => {
    try {
      return new URL((_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href)).origin;
    } catch {
      return location.origin;
    }
  })(), y = document[M] ?? window, g = y.GM, v = y.GM_xmlhttpRequest;
  function k(l) {
    var e2;
    const t = new Headers(), a = l.replace(/\r?\n[\t ]+/g, " ");
    for (const d of a.split(/\r?\n/)) {
      const i = d.split(":"), o = (e2 = i.shift()) == null ? void 0 : e2.trim();
      if (o) {
        const r2 = i.join(":").trim();
        try {
          t.append(o, r2);
        } catch (c) {
          console.warn(`Response ${c.message}`);
        }
      }
    }
    return t;
  }
  const H = async (l, t) => {
    const a = v || g.xmlHttpRequest;
    if (typeof a != "function")
      throw new DOMException(
        "GM_xmlhttpRequest or GM.xmlHttpRequest is not granted.",
        "NotFoundError"
      );
    const e2 = new Request(l, t);
    if (e2.signal.aborted)
      throw new DOMException("Network request aborted.", "AbortError");
    const d = await e2.blob(), i = Object.fromEntries(e2.headers);
    return new Headers(void 0).forEach((o, r2) => {
      i[r2] = o;
    }), new Promise((o, r2) => {
      let c = false;
      const R = new Promise((n) => {
        const { abort: h } = a({
          method: e2.method.toUpperCase(),
          url: e2.url || location.href,
          headers: i,
          data: d.size ? d : void 0,
          redirect: e2.redirect,
          binary: true,
          nocache: e2.cache === "no-store",
          revalidate: e2.cache === "reload",
          timeout: 3e5,
          responseType: a.RESPONSE_TYPE_STREAM ?? "blob",
          overrideMimeType: e2.headers.get("Content-Type") ?? void 0,
          anonymous: e2.credentials === "omit",
          onload: ({ response: s }) => {
            if (c) {
              n(null);
              return;
            }
            n(s);
          },
          async onreadystatechange({
            readyState: s,
            responseHeaders: p,
            status: b,
            statusText: q,
            finalUrl: w,
            response: E
          }) {
            if (s === XMLHttpRequest.DONE)
              e2.signal.removeEventListener("abort", h);
            else if (s !== XMLHttpRequest.HEADERS_RECEIVED)
              return;
            if (c) {
              n(null);
              return;
            }
            const u = k(p), f = e2.url !== w, m = new Response(
              E instanceof ReadableStream ? E : await R,
              {
                headers: u,
                status: b,
                statusText: q
              }
            );
            Object.defineProperties(m, {
              url: {
                value: w
              },
              type: {
                value: "basic"
              },
              ...m.redirected !== f ? {
                redirected: {
                  value: f
                }
              } : {},
              // https://fetch.spec.whatwg.org/#forbidden-response-header-name
              ...u.has("set-cookie") || u.has("set-cookie2") ? {
                headers: {
                  value: u
                }
              } : {}
            }), o(m), c = true;
          },
          onerror: ({ statusText: s, error: p }) => {
            r2(
              new TypeError(s || p || "Network request failed.")
            ), n(null);
          },
          ontimeout() {
            r2(new TypeError("Network request timeout.")), n(null);
          },
          onabort() {
            r2(new DOMException("Network request aborted.", "AbortError")), n(null);
          }
        });
        e2.signal.addEventListener("abort", h);
      });
    });
  };
  async function compressImage(image) {
    return new Promise((resolve, reject) => {
      new Compressor(image, {
        success: resolve,
        error: reject
      });
    });
  }
  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  async function convertSrcToDataURL(src) {
    if (src.startsWith("data:")) {
      return src;
    }
    try {
      const response = await H(src);
      let blob = await response.blob();
      const incompressableTypes = ["image/gif", "image/svg+xml"];
      if (!incompressableTypes.includes(blob.type)) {
        blob = await compressImage(blob);
      }
      const dataURL = await blobToDataURL(blob);
      return dataURL;
    } catch (err) {
      console.error(`Failed to convert image: ${src}`, err);
      throw err;
    }
  }
  const imageCache = /* @__PURE__ */ new Map();
  async function prefetchImages(node) {
    const images = Array.from(node.querySelectorAll("img"));
    const fetchPromises = images.map(async ({ src }) => {
      if (imageCache.has(src)) return;
      const dataURL = await convertSrcToDataURL(src);
      imageCache.set(src, dataURL);
    });
    await Promise.all(fetchPromises);
  }
  function createTurndownService() {
    const turndown2 = new TurndownService({
      emDelimiter: "*",
      bulletListMarker: "-"
    });
    turndown2.addRule("pre", {
      filter: ["pre"],
      replacement: (_content, node) => {
        var _a2;
        return "\n```txt\n" + ((_a2 = node.textContent) == null ? void 0 : _a2.trim()) + "\n```\n";
      }
    });
    turndown2.addRule("superscript", {
      filter: ["sup"],
      replacement: (content) => "^" + content
    });
    turndown2.addRule("paragraph", {
      filter: ["p"],
      replacement: (content) => "\n\n" + content + "\n\n"
    });
    turndown2.addRule("convert-img-src-to-base64", {
      filter: ["img"],
      replacement: (_content, node) => {
        const { src, alt } = node;
        const dataURL = imageCache.get(src);
        if (dataURL) {
          return `![${alt}](${dataURL})`;
        }
        return `![${alt}](${src})`;
      }
    });
    turndown2.use(turndownPluginGfm_cjsExports.tables);
    return turndown2;
  }
  async function htmlToMd(node, {
    turndownService = createTurndownService(),
    convertImage = true
  } = {}) {
    if (convertImage) await prefetchImages(node);
    const md = turndownService.turndown(node);
    if (convertImage) imageCache.clear();
    return md;
  }
  const turndown = createTurndownService();
  function processKatexSpan(span) {
    var _a2;
    const latexEl = span.querySelector("annotation");
    const tex = latexEl == null ? void 0 : latexEl.textContent;
    if (!tex) {
      return span.textContent ?? "";
    }
    switch (tex) {
      case `\\hspace{15pt}`:
        return "";
      // remove useless first line indent
      case `\\hspace{23pt}\\bullet\\,`:
        return "- ";
    }
    if (((_a2 = span.parentElement) == null ? void 0 : _a2.nodeName) === "CENTER") {
      return `$$${tex}$$`;
    } else {
      return `$${tex}$`;
    }
  }
  turndown.addRule("parse-tex", {
    filter: (node) => node.nodeName === "SPAN" && node.matches(".katex"),
    replacement: (_content, node) => {
      return processKatexSpan(node);
    }
  });
  turndown.addRule("parse-pre-with-tex", {
    filter: (node) => node.nodeName === "PRE" && node.childElementCount > 0,
    replacement: (_content, node) => {
      const text2 = [...node.childNodes].map((node2) => {
        if (node2.nodeName === "SPAN" && node2.matches(".katex")) {
          const spantext = processKatexSpan(node2);
          return spantext;
        } else if (node2.nodeName === "BR") {
          return "\n\n";
        } else {
          return node2.textContent ?? "";
        }
      }).join("");
      return text2;
    }
  });
  turndown.remove("button");
  async function scrapeDescription(node) {
    return await htmlToMd(node, {
      turndownService: turndown
    });
  }
  function e(o) {
    return o instanceof Promise;
  }
  const loaderIcon = ($$anchor) => {
    var svg = root_1$1();
    append($$anchor, svg);
  };
  var root_1$1 = /* @__PURE__ */ from_svg(`<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"></path></svg>`);
  var root_2 = /* @__PURE__ */ from_html(`<a><!></a>`);
  var root_3 = /* @__PURE__ */ from_html(`<button><!> <!></button>`);
  function Button($$anchor, $$props) {
    push($$props, true);
    let variant = prop($$props, "variant", 3, "purple"), type = prop($$props, "type", 3, "button"), restProps = /* @__PURE__ */ rest_props($$props, [
      "$$slots",
      "$$events",
      "$$legacy",
      "onclick",
      "children",
      "variant",
      "type",
      "href"
    ]);
    const variants = {
      purple: "--bg: #6c5ce7; --shadow: #a29bfe",
      green: "--bg: #1ba13e; --shadow: #42de6e",
      orange: "--bg: #ffa116; --shadow: #fedd9b"
    };
    let loading = /* @__PURE__ */ state(false);
    async function handleOnClick(e$1) {
      if (!$$props.onclick) return;
      const returnValue = $$props.onclick(e$1);
      if (e(returnValue)) {
        set(loading, true);
        await returnValue;
        set(loading, false);
      }
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var a = root_2();
        attribute_effect(
          a,
          () => ({
            style: variants[variant()],
            href: $$props.href,
            target: "_blank",
            ...restProps
          }),
          void 0,
          "svelte-ll0ynk"
        );
        var node_1 = child(a);
        snippet(node_1, () => $$props.children ?? noop);
        append($$anchor2, a);
      };
      var alternate = ($$anchor2) => {
        var button = root_3();
        attribute_effect(
          button,
          () => ({
            style: variants[variant()],
            type: type(),
            disabled: get$1(loading),
            onclick: handleOnClick,
            ...restProps
          }),
          void 0,
          "svelte-ll0ynk"
        );
        var node_2 = child(button);
        {
          var consequent_1 = ($$anchor3) => {
            loaderIcon($$anchor3);
          };
          if_block(node_2, ($$render) => {
            if (get$1(loading)) $$render(consequent_1);
          });
        }
        var node_3 = sibling(node_2, 2);
        snippet(node_3, () => $$props.children ?? noop);
        append($$anchor2, button);
      };
      if_block(node, ($$render) => {
        if ($$props.href) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  async function copyText(text2) {
    try {
      await navigator.clipboard.writeText(text2);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      }
      throw err;
    }
  }
  async function getDescription() {
    const sectionBoxEl = await findElement("div.section-box");
    const descEl = sectionBoxEl == null ? void 0 : sectionBoxEl.parentElement;
    if (!descEl) throw new Error("no description found");
    return scrapeDescription(descEl);
  }
  function Copy_description($$anchor, $$props) {
    push($$props, false);
    async function copyDescription() {
      const desc = await getDescription();
      copyText(desc);
    }
    init();
    Button($$anchor, {
      variant: "green",
      onclick: copyDescription,
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text("复制描述");
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    bind_prop($$props, "copyDescription", copyDescription);
    return pop({ copyDescription });
  }
  function downloadFile(blob, filename, extension) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + "." + extension;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  class NotebookBuilder {
    constructor() {
      __privateAdd(this, _cells, []);
      __privateAdd(this, _metadata, {});
      __privateAdd(this, _nbformat, 5);
      __privateAdd(this, _nbformat_minor, 10);
    }
    addMarkdown(content) {
      const md = {
        cell_type: "markdown",
        metadata: {},
        source: content
      };
      __privateGet(this, _cells).push(md);
      return this;
    }
    /** Add a level one heading. There should be only one title in a document. */
    addTitle(title, url) {
      this.addMarkdown(`# [${title}](${url})`);
      return this;
    }
    addSection(heading, content) {
      this.addMarkdown(`## ${heading}

 ${content ?? ""}`);
      return this;
    }
    /** Add a horizontal rule (`<hr>` in html) or line that visually separates content */
    addHorizontalRule() {
      this.addMarkdown("---\n\n");
      return this;
    }
    addCode(content) {
      const code = {
        cell_type: "code",
        metadata: {},
        source: content,
        execution_count: null,
        outputs: []
      };
      __privateGet(this, _cells).push(code);
      return this;
    }
    setLanguage(language) {
      __privateGet(this, _metadata).language_info = {
        name: language
      };
      return this;
    }
    build() {
      return {
        metadata: __privateGet(this, _metadata),
        nbformat: __privateGet(this, _nbformat),
        nbformat_minor: __privateGet(this, _nbformat_minor),
        cells: __privateGet(this, _cells)
      };
    }
    download(filename) {
      const notebook = this.build();
      const blob = new Blob([JSON.stringify(notebook)], {
        type: "application/x-ipynb+json"
      });
      downloadFile(blob, filename, "ipynb");
    }
  }
  _cells = new WeakMap();
  _metadata = new WeakMap();
  _nbformat = new WeakMap();
  _nbformat_minor = new WeakMap();
  function Save_as_jupyter($$anchor, $$props) {
    push($$props, false);
    async function saveAsJupyter() {
      var _a2, _b;
      const builder = new NotebookBuilder();
      const titleEl = await findElement("div.question-title");
      const title = (_b = (_a2 = titleEl.textContent) == null ? void 0 : _a2.match(/[^\s\\n]+/g)) == null ? void 0 : _b.join(" ");
      if (!title) {
        throw new Error("Fail to retrieve title");
      }
      const url = window.location.href;
      builder.addTitle(title, url);
      const description = await getDescription();
      builder.addMarkdown(description);
      builder.addHorizontalRule();
      builder.addSection("解答");
      const codeDownloadAnchor = await findElement(".monaco-toolbar a[aria-label='Download']");
      const response = await fetch(codeDownloadAnchor.href);
      const code = await response.text();
      builder.addCode(code);
      const monaco = await findElement("#monaco");
      const language = monaco.getAttribute("data-mode-id") ?? "python";
      builder.setLanguage(language);
      builder.download(title);
    }
    init();
    Button($$anchor, {
      variant: "orange",
      onclick: saveAsJupyter,
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text("保存为 Jupyter Notebook");
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  var root_1 = /* @__PURE__ */ from_html(`<!> <!>`, 1);
  function ProblemButtons($$anchor) {
    ButtonGroup($$anchor, {
      style: "padding: 0px 10px 10px",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1();
        var node = first_child(fragment_1);
        Copy_description(node, {});
        var node_1 = sibling(node, 2);
        Save_as_jupyter(node_1, {});
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true }
    });
  }
  async function main() {
    const problemEl = await findElement(".ta-question");
    const container = document.createElement("div");
    container.style.cssText = "display: contents;";
    problemEl.prepend(container);
    mount(ProblemButtons, {
      target: container
    });
  }
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function correctAddEventListener() {
    var _a2, _b;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.documentElement.appendChild(iframe);
    const cleanListener = (_a2 = iframe.contentWindow) == null ? void 0 : _a2.EventTarget.prototype.addEventListener;
    (_b = iframe.parentNode) == null ? void 0 : _b.removeChild(iframe);
    if (cleanListener) {
      _unsafeWindow.EventTarget.prototype.addEventListener = cleanListener;
    }
  }
  mount(Toaster, {
    target: document.body,
    props: { position: "top-center" }
  });
  correctAddEventListener();
  main();

})(TurndownService, Compressor);