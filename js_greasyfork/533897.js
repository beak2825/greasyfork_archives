// ==UserScript==
// @name               图片批量下载器，送网盘资源
// @name:zh-CN         图片批量下载器，送网盘资源
// @name:zh-TW         圖片批量下載器，送網盤資源
// @namespace          jasonzk
// @version            1.0.6
// @author             JasonZK
// @description        一个简单好用的图片批量下载工具，帮助你快速下载网页上的图片。支持图片预览。安装后赠送DeepSeek资料大礼包，网盘自取，不定期赠送各种网盘资源。
// @description:zh-CN  一个简单好用的图片批量下载工具，帮助你快速下载网页上的图片。支持图片预览。安装后赠送DeepSeek资料大礼包，网盘自取，不定期赠送各种网盘资源。
// @description:zh-TW  一個簡單好用的圖片批量下載工具，幫助你快速下載網頁上的圖片。支持圖片預覽。安裝後贈送DeepSeek資料大禮包，網盤自取，不定期贈送各種網盤資源。
// @license            None
// @icon               data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PgogIDxwb2x5bGluZSBwb2ludHM9IjggMTIgMTIgMTYgMTYgMTIiPjwvcG9seWxpbmU+CiAgPGxpbmUgeDE9IjEyIiB5MT0iOCIgeDI9IjEyIiB5Mj0iMTYiPjwvbGluZT4KPC9zdmc+Cg==
// @match              *://*/*
// @require            https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// @connect            localhost
// @connect            localhost:3001
// @connect            127.0.0.1
// @connect            127.0.0.1:3001
// @connect            api2.jasonzk.com
// @grant              GM_addStyle
// @grant              GM_download
// @grant              GM_info
// @grant              GM_openInTab
// @grant              GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533897/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%8C%E9%80%81%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/533897/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%8C%E9%80%81%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function (fflate) {
  'use strict';

  var _a;
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
    return typeof thing === 'function';
  }
  const noop = () => {};
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
  const LEGACY_DERIVED_PROP = 1 << 17;
  const HEAD_EFFECT = 1 << 19;
  const EFFECT_HAS_DERIVED = 1 << 20;
  const EFFECT_IS_UPDATING = 1 << 21;
  const STATE_SYMBOL = Symbol('$state');
  const LOADING_ATTR_SYMBOL = Symbol('');
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b ||
          (a !== null && typeof a === 'object') ||
          typeof a === 'function';
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
  const TRANSITION_GLOBAL = 1 << 2;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = 'http://www.w3.org/1999/xhtml';
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
    var ctx = (component_context = {
      p: component_context,
      c: null,
      d: false,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null,
    });
    if (legacy_mode_flag && !runes) {
      component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: source(false),
      };
    }
    teardown(() => {
      ctx.d = true;
    });
  }
  function pop(component) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
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
    return (
      /** @type {T} */
      {}
    );
  }
  function is_runes() {
    return (
      !legacy_mode_flag ||
      (component_context !== null && component_context.l === null)
    );
  }
  function proxy(value) {
    if (typeof value !== 'object' || value === null || STATE_SYMBOL in value) {
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
      sources.set(
        'length',
        /* @__PURE__ */ state(
          /** @type {any[]} */
          value.length,
        ),
      );
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop, descriptor) {
          if (
            !('value' in descriptor) ||
            descriptor.configurable === false ||
            descriptor.enumerable === false ||
            descriptor.writable === false
          ) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop);
          if (s === void 0) {
            s = with_parent(() => /* @__PURE__ */ state(descriptor.value));
            sources.set(prop, s);
          } else {
            set(
              s,
              with_parent(() => proxy(descriptor.value)),
            );
          }
          return true;
        },
        deleteProperty(target, prop) {
          var s = sources.get(prop);
          if (s === void 0) {
            if (prop in target) {
              sources.set(
                prop,
                with_parent(() => /* @__PURE__ */ state(UNINITIALIZED)),
              );
            }
          } else {
            if (is_proxied_array && typeof prop === 'string') {
              var ls =
                /** @type {Source<number>} */
                sources.get('length');
              var n = Number(prop);
              if (Number.isInteger(n) && n < ls.v) {
                set(ls, n);
              }
            }
            set(s, UNINITIALIZED);
            update_version(version);
          }
          return true;
        },
        get(target, prop, receiver) {
          var _a2;
          if (prop === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop);
          var exists = prop in target;
          if (
            s === void 0 &&
            (!exists ||
              ((_a2 = get_descriptor(target, prop)) == null
                ? void 0
                : _a2.writable))
          ) {
            s = with_parent(() =>
              /* @__PURE__ */ state(
                proxy(exists ? target[prop] : UNINITIALIZED),
              ),
            );
            sources.set(prop, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target, prop, receiver);
        },
        getOwnPropertyDescriptor(target, prop) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
          if (descriptor && 'value' in descriptor) {
            var s = sources.get(prop);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true,
              };
            }
          }
          return descriptor;
        },
        has(target, prop) {
          var _a2;
          if (prop === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop);
          var has =
            (s !== void 0 && s.v !== UNINITIALIZED) ||
            Reflect.has(target, prop);
          if (
            s !== void 0 ||
            (active_effect !== null &&
              (!has ||
                ((_a2 = get_descriptor(target, prop)) == null
                  ? void 0
                  : _a2.writable)))
          ) {
            if (s === void 0) {
              s = with_parent(() =>
                /* @__PURE__ */ state(
                  has ? proxy(target[prop]) : UNINITIALIZED,
                ),
              );
              sources.set(prop, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop, value2, receiver) {
          var _a2;
          var s = sources.get(prop);
          var has = prop in target;
          if (is_proxied_array && prop === 'length') {
            for (
              var i = value2;
              i < /** @type {Source<number>} */ s.v;
              i += 1
            ) {
              var other_s = sources.get(i + '');
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() =>
                  /* @__PURE__ */ state(UNINITIALIZED),
                );
                sources.set(i + '', other_s);
              }
            }
          }
          if (s === void 0) {
            if (
              !has ||
              ((_a2 = get_descriptor(target, prop)) == null
                ? void 0
                : _a2.writable)
            ) {
              s = with_parent(() => /* @__PURE__ */ state(void 0));
              set(
                s,
                with_parent(() => proxy(value2)),
              );
              sources.set(prop, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            set(
              s,
              with_parent(() => proxy(value2)),
            );
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop === 'string') {
              var ls =
                /** @type {Source<number>} */
                sources.get('length');
              var n = Number(prop);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            update_version(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
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
        },
      },
    );
  }
  function update_version(signal, d = 1) {
    set(signal, signal.v + d);
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived =
      active_reaction !== null && (active_reaction.f & DERIVED) !== 0
        ? /** @type {Derived} */
          active_reaction
        : null;
    if (
      active_effect === null ||
      (parent_derived !== null && (parent_derived.f & UNOWNED) !== 0)
    ) {
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
      v:
        /** @type {V} */
        null,
      wv: 0,
      parent: parent_derived ?? active_effect,
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
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
          effects[i],
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
    var status =
      (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null
        ? MAYBE_DIRTY
        : CLEAN;
    set_signal_status(derived2, status);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
  }
  const old_values = /* @__PURE__ */ new Map();
  function source(v, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0,
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack) {
    const s = source(v);
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
    if (
      legacy_mode_flag &&
      component_context !== null &&
      component_context.l !== null
    ) {
      ((_a2 = component_context.l).s ?? (_a2.s = [])).push(s);
    }
    return s;
  }
  function mutate(source2, value) {
    set(
      source2,
      untrack(() => get(source2)),
    );
    return value;
  }
  function set(source2, value, should_proxy = false) {
    if (
      active_reaction !== null &&
      !untracking &&
      is_runes() &&
      (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 &&
      !(reaction_sources == null ? void 0 : reaction_sources.includes(source2))
    ) {
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
      source2.wv = increment_write_version();
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
            /** @type {Derived} */
            source2,
          );
        }
        set_signal_status(
          source2,
          (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY,
        );
      }
      mark_reactions(source2, DIRTY);
      if (
        is_runes() &&
        active_effect !== null &&
        (active_effect.f & CLEAN) !== 0 &&
        (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0
      ) {
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
            MAYBE_DIRTY,
          );
        } else {
          schedule_effect(
            /** @type {Effect} */
            reaction,
          );
        }
      }
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
    first_child_getter = get_descriptor(node_prototype, 'firstChild').get;
    next_sibling_getter = get_descriptor(node_prototype, 'nextSibling').get;
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
  function create_text(value = '') {
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
      var first =
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment,
        );
      if (first instanceof Comment && first.data === '')
        return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling =
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = '';
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (
      active_reaction !== null &&
      (active_reaction.f & UNOWNED) !== 0 &&
      active_effect === null
    ) {
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
      wv: 0,
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e) {
        destroy_effect(effect2);
        throw e;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert =
      sync &&
      effect2.deps === null &&
      effect2.first === null &&
      effect2.nodes_start === null &&
      effect2.teardown === null &&
      (effect2.f & (EFFECT_HAS_DERIVED | BOUNDARY_EFFECT)) === 0;
    if (!inert && push2) {
      if (parent !== null) {
        push_effect(effect2, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 =
          /** @type {Derived} */
          active_reaction;
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
    var defer =
      active_effect !== null &&
      (active_effect.f & BRANCH_EFFECT) !== 0 &&
      component_context !== null &&
      !component_context.m;
    if (defer) {
      var context =
        /** @type {ComponentContext} */
        component_context;
      (context.e ?? (context.e = [])).push({
        fn,
        effect: active_effect,
        reaction: active_reaction,
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
  function legacy_pre_effect(deps, fn) {
    var context =
      /** @type {ComponentContextLegacy} */
      component_context;
    var token = { effect: null, ran: false };
    context.l.r1.push(token);
    token.effect = render_effect(() => {
      deps();
      if (token.ran) return;
      token.ran = true;
      set(context.l.r2, true);
      untrack(fn);
    });
  }
  function legacy_pre_effect_reset() {
    var context =
      /** @type {ComponentContextLegacy} */
      component_context;
    render_effect(() => {
      if (!get(context.l.r2)) return;
      for (var token of context.l.r1) {
        var effect2 = token.effect;
        if ((effect2.f & CLEAN) !== 0) {
          set_signal_status(effect2, MAYBE_DIRTY);
        }
        if (check_dirtiness(effect2)) {
          update_effect(effect2);
        }
        token.ran = false;
      }
      context.l.r2.v = false;
    });
  }
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn, thunks = [], d = derived) {
    const deriveds = thunks.map(d);
    const effect2 = () => fn(...deriveds.map(get));
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
    if (
      (remove_dom || (effect2.f & HEAD_EFFECT) !== 0) &&
      effect2.nodes_start !== null
    ) {
      var node = effect2.nodes_start;
      var end = effect2.nodes_end;
      while (node !== null) {
        var next =
          node === end
            ? null
            : /** @type {TemplateNode} */
              /* @__PURE__ */ get_next_sibling(node);
        node.remove();
        node = next;
      }
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition2 of transitions) {
        transition2.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next =
      effect2.prev =
      effect2.teardown =
      effect2.ctx =
      effect2.deps =
      effect2.fn =
      effect2.nodes_start =
      effect2.nodes_end =
        null;
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
      for (var transition2 of transitions) {
        transition2.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition2 of effect2.transitions) {
        if (transition2.is_global || local) {
          transitions.push(transition2);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent =
        (child2.f & EFFECT_TRANSPARENT) !== 0 ||
        (child2.f & BRANCH_EFFECT) !== 0;
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
      var transparent =
        (child2.f & EFFECT_TRANSPARENT) !== 0 ||
        (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition2 of effect2.transitions) {
        if (transition2.is_global || local) {
          transition2.in();
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
  function set_reaction_sources(sources) {
    reaction_sources = sources;
  }
  function push_reaction_value(value) {
    if (active_reaction !== null && active_reaction.f & EFFECT_IS_UPDATING) {
      if (reaction_sources === null) {
        set_reaction_sources([value]);
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
  let captured_signals = null;
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
        var is_unowned_connected =
          is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if (is_disconnected || is_unowned_connected) {
          var derived2 =
            /** @type {Derived} */
            reaction;
          var parent = derived2.parent;
          for (i = 0; i < length; i++) {
            dependency = dependencies[i];
            if (
              is_disconnected ||
              !((_a2 = dependency == null ? void 0 : dependency.reactions) ==
              null
                ? void 0
                : _a2.includes(derived2))
            ) {
              (dependency.reactions ?? (dependency.reactions = [])).push(
                derived2,
              );
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (
            is_unowned_connected &&
            parent !== null &&
            (parent.f & UNOWNED) === 0
          ) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i = 0; i < length; i++) {
          dependency = dependencies[i];
          if (
            check_dirtiness(
              /** @type {Derived} */
              dependency,
            )
          ) {
            update_derived(
              /** @type {Derived} */
              dependency,
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || (active_effect !== null && !skip_reaction)) {
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
    return (
      (effect2.f & DESTROYED) === 0 &&
      (effect2.parent === null || (effect2.parent.f & BOUNDARY_EFFECT) === 0)
    );
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
    {
      propagate_error(error, effect2);
      return;
    }
  }
  function schedule_possible_effect_self_invalidation(
    signal,
    effect2,
    root2 = true,
  ) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if (reaction_sources == null ? void 0 : reaction_sources.includes(signal))
        continue;
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false,
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction,
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
    new_deps = /** @type {null | Value[]} */ null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction =
      (flags & UNOWNED) !== 0 &&
      (untracking || !is_updating_effect || active_reaction === null);
    active_reaction =
      (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    reaction_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    read_version++;
    reaction.f |= EFFECT_IS_UPDATING;
    try {
      var result =
        /** @type {Function} */
        (0, reaction.fn)();
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
      if (
        is_runes() &&
        untracked_writes !== null &&
        !untracking &&
        deps !== null &&
        (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0
      ) {
        for (i = 0; i < /** @type {Source[]} */ untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction,
          );
        }
      }
      if (previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(
              .../** @type {Source[]} */
              untracked_writes,
            );
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
    if (
      reactions === null &&
      (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
      // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
      // allows us to skip the expensive work of disconnecting and immediately reconnecting it
      (new_deps === null || !new_deps.includes(dependency))
    ) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
        /** @type {Derived} **/
        dependency,
      );
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0,
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
      effect2.teardown = typeof teardown2 === 'function' ? teardown2 : null;
      effect2.wv = write_version;
      var deps = effect2.deps;
      var dep;
      if (
        DEV &&
        tracing_mode_flag &&
        (effect2.f & DIRTY) !== 0 &&
        deps !== null
      );
      if (DEV);
    } catch (error) {
      handle_error(
        error,
        effect2,
        previous_effect,
        previous_component_context || effect2.ctx,
      );
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
            if (
              effect2.deps === null &&
              effect2.first === null &&
              effect2.nodes_start === null
            ) {
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
    var effect2 = (last_scheduled_effect = signal);
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
          var previous_active_reaction = active_reaction;
          try {
            active_reaction = effect2;
            if (check_dirtiness(effect2)) {
              update_effect(effect2);
            }
          } catch (error) {
            handle_error(error, effect2, null, effect2.ctx);
          } finally {
            active_reaction = previous_active_reaction;
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
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (captured_signals !== null) {
      captured_signals.add(signal);
    }
    if (active_reaction !== null && !untracking) {
      if (
        !(reaction_sources == null ? void 0 : reaction_sources.includes(signal))
      ) {
        var deps = active_reaction.deps;
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (
            new_deps === null &&
            deps !== null &&
            deps[skipped_deps] === signal
          ) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      }
    } else if (
      is_derived &&
      /** @type {Derived} */
      signal.deps === null &&
      /** @type {Derived} */
      signal.effects === null
    ) {
      var derived2 =
        /** @type {Derived} */
        signal;
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */ signal;
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    return signal.v;
  }
  function capture_signals(fn) {
    var previous_captured_signals = captured_signals;
    captured_signals = /* @__PURE__ */ new Set();
    var captured = captured_signals;
    var signal;
    try {
      untrack(fn);
      if (previous_captured_signals !== null) {
        for (signal of captured_signals) {
          previous_captured_signals.add(signal);
        }
      }
    } finally {
      captured_signals = previous_captured_signals;
    }
    return captured;
  }
  function invalidate_inner_signals(fn) {
    var captured = capture_signals(() => untrack(fn));
    for (var signal of captured) {
      if ((signal.f & LEGACY_DERIVED_PROP) !== 0) {
        /** @type {Derived} */
        for (const dep of signal.deps || []) {
          if ((dep.f & DERIVED) === 0) {
            internal_set(dep, dep.v);
          }
        }
      } else {
        internal_set(signal, signal.v);
      }
    }
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
    signal.f = (signal.f & STATUS_MASK) | status;
  }
  function deep_read_state(value) {
    if (typeof value !== 'object' || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop = value[key];
        if (typeof prop === 'object' && prop && STATE_SYMBOL in prop) {
          deep_read(prop);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (
      typeof value === 'object' &&
      value !== null && // We don't want to traverse DOM elements
      !(value instanceof EventTarget) &&
      !visited.has(value)
    ) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e) {}
      }
      const proto = get_prototype_of(value);
      if (
        proto !== Object.prototype &&
        proto !== Array.prototype &&
        proto !== Map.prototype &&
        proto !== Set.prototype &&
        proto !== Date.prototype
      ) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e) {}
          }
        }
      }
    }
  }
  const PASSIVE_EVENTS = ['touchstart', 'touchmove'];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        'reset',
        (evt) => {
          Promise.resolve().then(() => {
            var _a2;
            if (!evt.defaultPrevented) {
              /**@type {HTMLFormElement} */
              for (const e of evt.target.elements) {
                (_a2 = e.__on_r) == null ? void 0 : _a2.call(e);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true },
      );
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
  function listen_to_event_and_reset_event(
    element,
    event2,
    handler,
    on_reset = handler,
  ) {
    element.addEventListener(event2, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
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
    if (
      event_name.startsWith('pointer') ||
      event_name.startsWith('touch') ||
      event_name === 'wheel'
    ) {
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
    if (dom === document.body || dom === window || dom === document) {
      teardown(() => {
        dom.removeEventListener(event_name, target_handler, options);
      });
    }
  }
  function handle_event_propagation(event2) {
    var _a2;
    var handler_element = this;
    var owner_document =
      /** @type {Node} */
      handler_element.ownerDocument;
    var event_name = event2.type;
    var path =
      ((_a2 = event2.composedPath) == null ? void 0 : _a2.call(event2)) || [];
    var current_target =
      /** @type {null | Element} */
      path[0] || event2.target;
    var path_idx = 0;
    var handled_at = event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (
        at_idx !== -1 &&
        (handler_element === document ||
          handler_element === /** @type {any} */ window)
      ) {
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
    current_target = /** @type {Element} */ path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, 'currentTarget', {
      configurable: true,
      get() {
        return current_target || owner_document;
      },
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element =
          current_target.assignedSlot ||
          current_target.parentNode ||
          /** @type {any} */
          current_target.host ||
          null;
        try {
          var delegated = current_target['__' + event_name];
          if (
            delegated != null &&
            (!(/** @type {any} */ current_target.disabled) || // DOM could've been updated already by the time this is reached, so we check this as well
              // -> the target could not have been disabled because it emits the event in the first place
              event2.target === current_target)
          ) {
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
        if (
          event2.cancelBubble ||
          parent_element === handler_element ||
          parent_element === null
        ) {
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
    var elem = document.createElement('template');
    elem.innerHTML = html;
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 =
      /** @type {Effect} */
      active_effect;
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function template(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith('<!>');
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : '<!>' + content);
        if (!is_fragment)
          node = /** @type {Node} */ /* @__PURE__ */ get_first_child(node);
      }
      var clone =
        /** @type {TemplateNode} */
        use_import_node || is_firefox
          ? document.importNode(node, true)
          : node.cloneNode(true);
      if (is_fragment) {
        var start =
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone);
        var end =
          /** @type {TemplateNode} */
          clone.lastChild;
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment('');
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
      dom,
    );
  }
  let should_intro = true;
  function set_text(text, value) {
    var str =
      value == null ? '' : typeof value === 'object' ? value + '' : value;
    if (str !== (text.__t ?? (text.__t = text.nodeValue))) {
      text.__t = str;
      text.nodeValue = str + '';
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(
    Component,
    { target, anchor, props = {}, events, context, intro = true },
  ) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, {
          passive,
        });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, {
            passive,
          });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx =
            /** @type {ComponentContext} */
            component_context;
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        should_intro = intro;
        component = Component(anchor_node, props) || {};
        should_intro = true;
        if (context) {
          pop();
        }
      });
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n =
            /** @type {number} */
            document_listeners.get(event_name);
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null
            ? void 0
            : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
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
          alternate_effect = branch(() =>
            fn2(anchor, [root_index + 1, hydrate_index]),
          );
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
    var is_controlled =
      length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node =
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode;
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor,
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
  function each(
    node,
    flags,
    get_collection,
    get_key,
    render_fn,
    fallback_fn = null,
  ) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var fallback = null;
    var was_empty = false;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection)
        ? collection
        : collection == null
          ? []
          : array_from(collection);
    });
    block(() => {
      var array = get(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      {
        reconcile(
          array,
          state2,
          anchor,
          render_fn,
          flags,
          get_key,
          get_collection,
        );
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
      get(each_array);
    });
  }
  function reconcile(
    array,
    state2,
    anchor,
    render_fn,
    flags,
    get_key,
    get_collection,
  ) {
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
        var child_anchor = current
          ? /** @type {TemplateNode} */
            current.e.nodes_start
          : anchor;
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
          get_collection,
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
        var controlled_anchor = null;
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
      internal_set(
        /** @type {Value<number>} */
        item.i,
        index,
      );
    }
  }
  function create_item(
    anchor,
    state2,
    prev,
    next,
    value,
    key,
    index,
    render_fn,
    flags,
    get_collection,
  ) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v = reactive
      ? mutable
        ? /* @__PURE__ */ mutable_source(value)
        : source(value)
      : value;
    var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index : source(index);
    var item = {
      i,
      v,
      k: key,
      a: null,
      // @ts-expect-error
      e: null,
      prev,
      next,
    };
    try {
      item.e = branch(() => render_fn(anchor, v, i, get_collection), hydrating);
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
    var end = item.next
      ? /** @type {TemplateNode} */
        item.next.e.nodes_start
      : anchor;
    var dest = next
      ? /** @type {TemplateNode} */
        next.e.nodes_start
      : anchor;
    var node =
      /** @type {TemplateNode} */
      item.e.nodes_start;
    while (node !== end) {
      var next_node =
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node);
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
  const whitespace = [...' 	\n\r\f \v\uFEFF'];
  function to_class(value, hash, directives) {
    var classname = value == null ? '' : '' + value;
    if (directives) {
      for (var key in directives) {
        if (directives[key]) {
          classname = classname ? classname + ' ' + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a = 0;
          while ((a = classname.indexOf(key, a)) >= 0) {
            var b = a + len;
            if (
              (a === 0 || whitespace.includes(classname[a - 1])) &&
              (b === classname.length || whitespace.includes(classname[b]))
            ) {
              classname =
                (a === 0 ? '' : classname.substring(0, a)) +
                classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === '' ? null : classname;
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute('class');
        } else {
          dom.className = next_class_name;
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
  const IS_CUSTOM_ELEMENT = Symbol('is custom element');
  const IS_HTML = Symbol('is html');
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === 'loading') {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (
      typeof value !== 'string' &&
      get_setters(element).includes(attribute)
    ) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ??
      (element.__attributes = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes('-'),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML,
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, (setters = []));
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
  const now = () => performance.now();
  const raf = {
    // don't access requestAnimationFrame eagerly outside method
    // this allows basic testing of user code without JSDOM
    // bunder will eval and remove ternary when the user's app is built
    tick:
      /** @param {any} _ */
      (_) => requestAnimationFrame(_),
    now: () => now(),
    tasks: /* @__PURE__ */ new Set(),
  };
  function run_tasks() {
    const now2 = raf.now();
    raf.tasks.forEach((task) => {
      if (!task.c(now2)) {
        raf.tasks.delete(task);
        task.f();
      }
    });
    if (raf.tasks.size !== 0) {
      raf.tick(run_tasks);
    }
  }
  function loop(callback) {
    let task;
    if (raf.tasks.size === 0) {
      raf.tick(run_tasks);
    }
    return {
      promise: new Promise((fulfill) => {
        raf.tasks.add((task = { c: callback, f: fulfill }));
      }),
      abort() {
        raf.tasks.delete(task);
      },
    };
  }
  function dispatch_event(element, type) {
    without_reactive_context(() => {
      element.dispatchEvent(new CustomEvent(type));
    });
  }
  function css_property_to_camelcase(style) {
    if (style === 'float') return 'cssFloat';
    if (style === 'offset') return 'cssOffset';
    if (style.startsWith('--')) return style;
    const parts = style.split('-');
    if (parts.length === 1) return parts[0];
    return (
      parts[0] +
      parts
        .slice(1)
        .map(
          /** @param {any} word */
          (word) => word[0].toUpperCase() + word.slice(1),
        )
        .join('')
    );
  }
  function css_to_keyframe(css) {
    const keyframe = {};
    const parts = css.split(';');
    for (const part of parts) {
      const [property, value] = part.split(':');
      if (!property || value === void 0) break;
      const formatted_property = css_property_to_camelcase(property.trim());
      keyframe[formatted_property] = value.trim();
    }
    return keyframe;
  }
  const linear$1 = (t) => t;
  function transition(flags, element, get_fn, get_params) {
    var is_global = (flags & TRANSITION_GLOBAL) !== 0;
    var direction = 'both';
    var current_options;
    var inert = element.inert;
    var overflow = element.style.overflow;
    var intro;
    var outro;
    function get_options() {
      var previous_reaction = active_reaction;
      var previous_effect = active_effect;
      set_active_reaction(null);
      set_active_effect(null);
      try {
        return (
          current_options ??
          (current_options = get_fn()(
            element,
            (get_params == null ? void 0 : get_params()) ?? /** @type {P} */ {},
            {
              direction,
            },
          ))
        );
      } finally {
        set_active_reaction(previous_reaction);
        set_active_effect(previous_effect);
      }
    }
    var transition2 = {
      is_global,
      in() {
        element.inert = inert;
        dispatch_event(element, 'introstart');
        intro = animate(element, get_options(), outro, 1, () => {
          dispatch_event(element, 'introend');
          intro == null ? void 0 : intro.abort();
          intro = current_options = void 0;
          element.style.overflow = overflow;
        });
      },
      out(fn) {
        element.inert = true;
        dispatch_event(element, 'outrostart');
        outro = animate(element, get_options(), intro, 0, () => {
          dispatch_event(element, 'outroend');
          fn == null ? void 0 : fn();
        });
      },
      stop: () => {
        intro == null ? void 0 : intro.abort();
        outro == null ? void 0 : outro.abort();
      },
    };
    var e =
      /** @type {Effect} */
      active_effect;
    (e.transitions ?? (e.transitions = [])).push(transition2);
    if (should_intro) {
      var run2 = is_global;
      if (!run2) {
        var block2 =
          /** @type {Effect | null} */
          e.parent;
        while (block2 && (block2.f & EFFECT_TRANSPARENT) !== 0) {
          while ((block2 = block2.parent)) {
            if ((block2.f & BLOCK_EFFECT) !== 0) break;
          }
        }
        run2 = !block2 || (block2.f & EFFECT_RAN) !== 0;
      }
      if (run2) {
        effect(() => {
          untrack(() => transition2.in());
        });
      }
    }
  }
  function animate(element, options, counterpart, t2, on_finish) {
    var is_intro = t2 === 1;
    if (is_function(options)) {
      var a;
      var aborted = false;
      queue_micro_task(() => {
        if (aborted) return;
        var o = options({ direction: is_intro ? 'in' : 'out' });
        a = animate(element, o, counterpart, t2, on_finish);
      });
      return {
        abort: () => {
          aborted = true;
          a == null ? void 0 : a.abort();
        },
        deactivate: () => a.deactivate(),
        reset: () => a.reset(),
        t: () => a.t(),
      };
    }
    counterpart == null ? void 0 : counterpart.deactivate();
    if (!(options == null ? void 0 : options.duration)) {
      on_finish();
      return {
        abort: noop,
        deactivate: noop,
        reset: noop,
        t: () => t2,
      };
    }
    const { delay = 0, css, tick, easing = linear$1 } = options;
    var keyframes = [];
    if (is_intro && counterpart === void 0) {
      if (tick) {
        tick(0, 1);
      }
      if (css) {
        var styles = css_to_keyframe(css(0, 1));
        keyframes.push(styles, styles);
      }
    }
    var get_t = () => 1 - t2;
    var animation = element.animate(keyframes, { duration: delay });
    animation.onfinish = () => {
      var t1 = (counterpart == null ? void 0 : counterpart.t()) ?? 1 - t2;
      counterpart == null ? void 0 : counterpart.abort();
      var delta = t2 - t1;
      var duration =
        /** @type {number} */
        options.duration * Math.abs(delta);
      var keyframes2 = [];
      if (duration > 0) {
        var needs_overflow_hidden = false;
        if (css) {
          var n = Math.ceil(duration / (1e3 / 60));
          for (var i = 0; i <= n; i += 1) {
            var t = t1 + delta * easing(i / n);
            var styles2 = css_to_keyframe(css(t, 1 - t));
            keyframes2.push(styles2);
            needs_overflow_hidden ||
              (needs_overflow_hidden = styles2.overflow === 'hidden');
          }
        }
        if (needs_overflow_hidden) {
          element.style.overflow = 'hidden';
        }
        get_t = () => {
          var time =
            /** @type {number} */
            /** @type {globalThis.Animation} */
            animation.currentTime;
          return t1 + delta * easing(time / duration);
        };
        if (tick) {
          loop(() => {
            if (animation.playState !== 'running') return false;
            var t3 = get_t();
            tick(t3, 1 - t3);
            return true;
          });
        }
      }
      animation = element.animate(keyframes2, { duration, fill: 'forwards' });
      animation.onfinish = () => {
        get_t = () => t2;
        tick == null ? void 0 : tick(t2, 1 - t2);
        on_finish();
      };
    };
    return {
      abort: () => {
        if (animation) {
          animation.cancel();
          animation.effect = null;
          animation.onfinish = noop;
        }
      },
      deactivate: () => {
        on_finish = noop;
      },
      reset: () => {
        if (t2 === 0) {
          tick == null ? void 0 : tick(1, 0);
        }
      },
      t: () => get_t(),
    };
  }
  function bind_checked(input, get2, set2 = get2) {
    listen_to_event_and_reset_event(input, 'change', (is_reset) => {
      var value = is_reset ? input.defaultChecked : input.checked;
      set2(value);
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the update value from the input instead.
      // If defaultChecked is set, then checked == defaultChecked
      untrack(get2) == null
    ) {
      set2(input.checked);
    }
    render_effect(() => {
      var value = get2();
      input.checked = Boolean(value);
    });
  }
  function is_bound_this(bound_value, element_or_component) {
    return (
      bound_value === element_or_component ||
      (bound_value == null ? void 0 : bound_value[STATE_SYMBOL]) ===
        element_or_component
    );
  }
  function bind_this(element_or_component = {}, update, get_value, get_parts) {
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = [];
        untrack(() => {
          if (element_or_component !== get_value(...parts)) {
            update(element_or_component, ...parts);
            if (
              old_parts &&
              is_bound_this(get_value(...old_parts), element_or_component)
            ) {
              update(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        queue_micro_task(() => {
          if (
            parts &&
            is_bound_this(get_value(...parts), element_or_component)
          ) {
            update(null, ...parts);
          }
        });
      };
    });
    return element_or_component;
  }
  function bind_property(property, event_name, element, set2, get2) {
    var handler = () => {
      set2(element[property]);
    };
    element.addEventListener(event_name, handler);
    if (get2) {
      render_effect(() => {
        element[property] = get2();
      });
    } else {
      handler();
    }
    if (
      element === document.body ||
      element === window ||
      element === document
    ) {
      teardown(() => {
        element.removeEventListener(event_name, handler);
      });
    }
  }
  function stopPropagation(fn) {
    return function (...args) {
      var event2 =
        /** @type {Event} */
        args[0];
      event2.stopPropagation();
      return fn == null ? void 0 : fn.apply(this, args);
    };
  }
  function preventDefault(fn) {
    return function (...args) {
      var event2 =
        /** @type {Event} */
        args[0];
      event2.preventDefault();
      return fn == null ? void 0 : fn.apply(this, args);
    };
  }
  function init(immutable = false) {
    const context =
      /** @type {ComponentContextLegacy} */
      component_context;
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version = 0;
      let prev =
        /** @type {Record<string, any>} */
        {};
      const d = /* @__PURE__ */ derived(() => {
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
      props = () => get(d);
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
          if (typeof fn === 'function') {
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
      for (const signal of context.l.s) get(signal);
    }
    props();
  }
  function bubble_event($$props, event2) {
    var _a2;
    var events =
      /** @type {Record<string, Function[] | Function>} */
      (_a2 = $$props.$$events) == null ? void 0 : _a2[event2.type];
    var callbacks = is_array(events)
      ? events.slice()
      : events == null
        ? []
        : [events];
    for (var fn of callbacks) {
      fn.call(this, event2);
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
        if (typeof cleanup === 'function')
          return (
            /** @type {() => void} */
            cleanup
          );
      });
    }
  }
  function init_update_callbacks(context) {
    var l =
      /** @type {ComponentContextLegacy} */
      context.l;
    return l.u ?? (l.u = { a: [], b: [], m: [] });
  }
  const PUBLIC_VERSION = '5';
  if (typeof window !== 'undefined') {
    (
      (_a = window.__svelte ?? (window.__svelte = {})).v ??
      (_a.v = /* @__PURE__ */ new Set())
    ).add(PUBLIC_VERSION);
  }
  enable_legacy_mode_flag();
  var _GM_addStyle = /* @__PURE__ */ (() =>
    typeof GM_addStyle != 'undefined' ? GM_addStyle : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() =>
    typeof GM_openInTab != 'undefined' ? GM_openInTab : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() =>
    typeof GM_xmlhttpRequest != 'undefined' ? GM_xmlhttpRequest : void 0)();
  const baseUrl = 'https://api2.jasonzk.com';
  const getAds = `${baseUrl}/ads/list`;
  const touchWeibo = `${baseUrl}/redirect/weibo`;
  const API = {
    getAds,
    touchWeibo,
  };
  async function openNewTab(url, active = true, rel = 'https://www.weibo.com') {
    if (_GM_openInTab) {
      _GM_openInTab(url, { active });
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = rel ?? 'noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  var root_2$1 = /* @__PURE__ */ template(`<div> </div>`);
  var root_1$1 = /* @__PURE__ */ template(
    `<div class="img-downloader-ad-container"><!></div>`,
  );
  function TextAd($$anchor, $$props) {
    push($$props, false);
    let currentIndex = /* @__PURE__ */ mutable_source(0);
    let isAnimating = /* @__PURE__ */ mutable_source(true);
    let container = /* @__PURE__ */ mutable_source();
    let show = /* @__PURE__ */ mutable_source(true);
    let ads = /* @__PURE__ */ mutable_source([]);
    async function fetchAds() {
      try {
        const response = await new Promise((resolve, reject) => {
          _GM_xmlhttpRequest({
            method: 'GET',
            url: API.getAds,
            headers: { Accept: 'application/json' },
            onload: resolve,
            onerror: reject,
          });
        });
        if (response.status === 200) {
          const json = JSON.parse(response.responseText);
          const data = json.data;
          set(show, data.show);
          set(ads, data.list);
        }
      } catch (error) {
        console.error('Failed to fetch ads:', error);
      }
    }
    function nextAd() {
      set(isAnimating, true);
      set(currentIndex, (get(currentIndex) + 1) % get(ads).length);
    }
    function onAnimationEnd() {
      set(isAnimating, false);
      setTimeout(() => {
        if (get(ads).length > 1) {
          nextAd();
        }
      }, 5e3);
    }
    function handleClick() {
      if (get(ads)[get(currentIndex)]) {
        _GM_xmlhttpRequest({
          method: 'GET',
          url: `${API.touchWeibo}?url=${encodeURIComponent(get(ads)[get(currentIndex)].link)}`,
          headers: { Accept: 'application/json' },
        });
        openNewTab(get(ads)[get(currentIndex)].link);
      }
    }
    onMount(() => {
      _GM_addStyle(`
      .img-downloader-ad-container {
        width: 100%;
        height: 24px;
        overflow: hidden;
        background: #f8f9fa;
        border-radius: 4px;
        margin: 8px 0;
        cursor: pointer;
        text-align: center;
      }

      .img-downloader-roll-text {
        display: inline-block;
        color: #666;
        font-size: 13px;
        padding: 4px 8px;
        white-space: nowrap;
      }

      .img-downloader-roll-text.animating {
        animation: imgDownloaderMarquee 8s linear;
      }

      .img-downloader-roll-text:hover {
        color: #0d6efd;
        text-decoration: underline;
      }

      @keyframes imgDownloaderMarquee {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `);
      fetchAds();
    });
    init();
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_1 = ($$anchor2) => {
        var div = root_1$1();
        var node_1 = child(div);
        {
          var consequent = ($$anchor3) => {
            var div_1 = root_2$1();
            let classes;
            var text = child(div_1);
            template_effect(
              ($0) => {
                classes = set_class(
                  div_1,
                  1,
                  'img-downloader-roll-text',
                  null,
                  classes,
                  $0,
                );
                set_text(text, get(ads)[get(currentIndex)].text);
              },
              [() => ({ animating: get(isAnimating) })],
              derived_safe_equal,
            );
            event('animationend', div_1, onAnimationEnd);
            event('click', div_1, handleClick);
            append($$anchor3, div_1);
          };
          if_block(node_1, ($$render) => {
            if (get(ads)[get(currentIndex)]) $$render(consequent);
          });
        }
        bind_this(
          div,
          ($$value) => set(container, $$value),
          () => get(container),
        );
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(show) && get(ads).length > 0) $$render(consequent_1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  const linear = (x) => x;
  function fade(node, { delay = 0, duration = 400, easing = linear } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`,
    };
  }
  var root_1 = /* @__PURE__ */ template(
    `<div class="image-preview-overlay"><div class="image-preview-content"><button class="preview-close-button" title="关闭预览">✖</button> <img alt="Image Preview"></div></div>`,
  );
  var root_3 = /* @__PURE__ */ template(
    `<div class="select-all-container"><input type="checkbox" id="select-all"> <label for="select-all"> </label></div>`,
  );
  var root_6 = /* @__PURE__ */ template(
    `<img alt="Thumbnail" class="thumbnail" loading="lazy" style="cursor: pointer;">`,
  );
  var root_5 = /* @__PURE__ */ template(
    `<label class="image-item"><input type="checkbox"> <!> <span class="image-url"> </span></label>`,
  );
  var root_8 = /* @__PURE__ */ template(
    `<p style="padding: 5px;">未找到图片或尚未查找。</p>`,
  );
  var root_9 = /* @__PURE__ */ template(`<p>正在查找...</p>`);
  var root_2 = /* @__PURE__ */ template(
    `<div id="image-downloader-panel" style="right: 20px; bottom: 20px"><h3><span>图片下载器</span> <div><button class="toggle-thumbs-button"> </button> <button class="close-button" title="关闭面板">✖</button></div></h3> <!> <div class="panel-controls"><button class="primary-button">查找图片</button></div> <!> <div class="image-list"><!> <!></div> <button class="download-button">下载选中图片</button> <div class="status-bar"> </div></div>`,
  );
  var root_10 = /* @__PURE__ */ template(
    `<button class="image-downloader-toggle-btn" title="打开图片下载器 (Alt + H 隐藏/Alt + S 显示)"><div class="close-icon" title="隐藏按钮 (Alt + S 可重新显示)">×</div> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>`,
  );
  var root = /* @__PURE__ */ template(`<!> <!> <!>`, 1);
  function App($$anchor, $$props) {
    push($$props, false);
    const allSelected = /* @__PURE__ */ mutable_source();
    const indeterminate = /* @__PURE__ */ mutable_source();
    let images = /* @__PURE__ */ mutable_source([]);
    let status = /* @__PURE__ */ mutable_source('点击“查找图片”开始');
    let loading = /* @__PURE__ */ mutable_source(false);
    let panelVisible = /* @__PURE__ */ mutable_source(false);
    let showThumbnails = /* @__PURE__ */ mutable_source(true);
    let buttonVisible = /* @__PURE__ */ mutable_source(true);
    let previewVisible = /* @__PURE__ */ mutable_source(false);
    let previewImageUrl = /* @__PURE__ */ mutable_source('');
    let panelElement = /* @__PURE__ */ mutable_source();
    let isDragging = /* @__PURE__ */ mutable_source(false);
    let startX, startY, initialRight, initialBottom;
    function handleMouseDown(event2) {
      var _a2;
      if (
        (_a2 = event2.target) == null
          ? void 0
          : _a2.closest('button, input, label, img')
      ) {
        return;
      }
      set(isDragging, true);
      startX = event2.clientX;
      startY = event2.clientY;
      const rect = get(panelElement).getBoundingClientRect();
      initialRight = window.innerWidth - rect.right;
      initialBottom = window.innerHeight - rect.bottom;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    function handleMouseMove(event2) {
      if (!get(isDragging)) return;
      const dx = startX - event2.clientX;
      const dy = startY - event2.clientY;
      mutate(
        panelElement,
        (get(panelElement).style.right = `${initialRight + dx}px`),
      );
      mutate(
        panelElement,
        (get(panelElement).style.bottom = `${initialBottom + dy}px`),
      );
    }
    function handleMouseUp() {
      if (!get(isDragging)) return;
      set(isDragging, false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    function findImages() {
      set(loading, true);
      set(status, '正在查找页面图片...');
      set(images, []);
      const foundUrls = /* @__PURE__ */ new Set();
      document.querySelectorAll('img').forEach((img) => {
        if (img.src && img.naturalWidth > 50 && img.naturalHeight > 50) {
          foundUrls.add(img.src);
        }
        const dataSrc =
          img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (dataSrc) {
          foundUrls.add(new URL(dataSrc, window.location.href).href);
        }
      });
      document.querySelectorAll('*').forEach((el) => {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none' && bgImage.startsWith('url("')) {
          const urlMatch = bgImage.match(/url\("?(.+?)"?\)/);
          if (urlMatch && urlMatch[1]) {
            foundUrls.add(new URL(urlMatch[1], window.location.href).href);
          }
        }
      });
      set(
        images,
        Array.from(foundUrls).map((url, index) => ({
          url,
          selected: true,
          name: `image_${index + 1}.${getExtension(url)}`,
        })),
      );
      set(status, `找到 ${get(images).length} 张图片`);
      set(loading, false);
    }
    function getExtension(url) {
      var _a2;
      try {
        const pathname = new URL(url).pathname;
        const parts = pathname.split('.');
        if (parts.length > 1) {
          let ext =
            ((_a2 = parts.pop()) == null ? void 0 : _a2.toLowerCase()) || 'jpg';
          ext = ext.split('?')[0];
          if (
            ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)
          ) {
            return ext;
          }
        }
      } catch (e) {}
      return 'jpg';
    }
    function openPreview(imageUrl) {
      set(previewImageUrl, imageUrl);
      set(previewVisible, true);
    }
    async function downloadSelected() {
      const selectedImages = get(images).filter((img) => img.selected);
      if (selectedImages.length === 0) {
        set(status, '请至少选择一张图片');
        return;
      }
      set(loading, true);
      set(status, `准备下载 ${selectedImages.length} 张图片...`);
      let processedCount = 0;
      const filePromises = selectedImages.map((img, index) => {
        return new Promise((resolve, reject) => {
          console.log(
            `[Image Downloader] 开始请求: ${img.name} (${index + 1}/${selectedImages.length})`,
          );
          fetch(img.url, {
            method: 'GET',
            mode: 'cors',
            // Explicitly set CORS mode, though 'no-cors' might be needed sometimes (with limitations)
          })
            .then(async (response) => {
              if (response.ok) {
                try {
                  const blob = await response.blob();
                  const buffer = await blob.arrayBuffer();
                  const uint8Array = new Uint8Array(buffer);
                  console.log(
                    `[Image Downloader] 下载成功并转换为 Uint8Array: ${img.name}`,
                  );
                  processedCount++;
                  set(
                    status,
                    `处理中 ${processedCount}/${selectedImages.length}... (成功: ${img.name})`,
                  );
                  resolve({ name: img.name, data: uint8Array });
                } catch (conversionError) {
                  console.error(
                    `[Image Downloader] Blob 转 Uint8Array 失败: ${img.name}`,
                    conversionError,
                  );
                  processedCount++;
                  set(
                    status,
                    `处理中 ${processedCount}/${selectedImages.length}... (转换失败: ${img.name})`,
                  );
                  reject(new Error(`Blob conversion failed for ${img.name}`));
                }
              } else {
                console.warn(
                  `[Image Downloader] Fetch 失败: ${img.url} (状态: ${response.status} ${response.statusText})`,
                );
                processedCount++;
                set(
                  status,
                  `处理中 ${processedCount}/${selectedImages.length}... (Fetch 失败 ${response.status}: ${img.name})`,
                );
                reject(
                  new Error(
                    `Fetch failed for ${img.name} with status ${response.status}`,
                  ),
                );
              }
            })
            .catch((err) => {
              console.error(
                `[Image Downloader] Fetch 网络错误/CORS: ${img.url}`,
                err,
              );
              processedCount++;
              set(
                status,
                `处理中 ${processedCount}/${selectedImages.length}... (网络/CORS 错误: ${img.name})`,
              );
              reject(
                new Error(
                  `Fetch network/CORS error for ${img.name}: ${err.message}`,
                ),
              );
            });
        });
      });
      set(status, `等待 ${selectedImages.length} 张图片处理完成...`);
      const results = await Promise.allSettled(filePromises);
      const successfulFiles = {};
      let downloadedCount = 0;
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          successfulFiles[result.value.name] = result.value.data;
          downloadedCount++;
        } else {
          console.warn('[Image Downloader] 一个文件处理失败:', result.reason);
        }
      });
      if (downloadedCount === 0) {
        set(status, '没有图片成功下载或处理。');
        set(loading, false);
        return;
      }
      set(status, `已成功处理 ${downloadedCount} 张图片，正在生成 ZIP 文件...`);
      console.log(
        '[Image Downloader] 文件处理完成，准备使用 fflate 生成 ZIP...',
      );
      try {
        fflate.zip(successfulFiles, { level: 1 }, (err, data) => {
          if (err) {
            console.error('[Image Downloader] fflate ZIP 生成错误:', err);
            set(status, `生成 ZIP 文件时出错: ${err.message}`);
            set(loading, false);
            return;
          }
          console.log('[Image Downloader] fflate ZIP 文件生成完毕.');
          const content = new Blob([data], { type: 'application/zip' });
          console.log('[Image Downloader] Blob size:', content.size);
          set(status, 'ZIP 文件生成完毕，准备下载...');
          const timestamp = /* @__PURE__ */ new Date()
            .toISOString()
            .replace(/[:.]/g, '-');
          const filename = `images_${document.title}_${timestamp}.zip`;
          const objectURL = URL.createObjectURL(content);
          console.log(`[Image Downloader] 准备使用 <a> 标签下载 ${filename}`);
          try {
            const a = document.createElement('a');
            a.href = objectURL;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log(`[Image Downloader] <a> 标签点击触发: ${filename}`);
            set(status, `已下载 ${downloadedCount} 张图片到 ${filename}`);
            set(loading, false);
            setTimeout(() => URL.revokeObjectURL(objectURL), 100);
          } catch (downloadError) {
            console.error(
              '[Image Downloader] <a> 标签下载错误:',
              downloadError,
            );
            set(
              status,
              `下载 ZIP 文件时出错: ${downloadError instanceof Error ? downloadError.message : '未知错误'}`,
            );
            set(loading, false);
            URL.revokeObjectURL(objectURL);
          }
        });
      } catch (outerError) {
        console.error(
          '[Image Downloader] 处理文件或调用 zip 时发生意外错误:',
          outerError,
        );
        set(
          status,
          `处理文件时发生错误: ${outerError instanceof Error ? outerError.message : '未知错误'}`,
        );
        set(loading, false);
      }
    }
    function toggleSelectAll(event2) {
      const target = event2.target;
      const checked = target.checked;
      set(
        images,
        get(images).map((img) => ({ ...img, selected: checked })),
      );
    }
    function handleThumbnailError(event2) {
      const imgElement = event2.target;
      imgElement.style.display = 'none';
    }
    function handleKeyPress(event2) {
      if (event2.altKey) {
        if (event2.key.toLowerCase() === 's') {
          set(buttonVisible, true);
        } else if (event2.key.toLowerCase() === 'h') {
          set(buttonVisible, false);
        }
      }
    }
    onMount(() => {
      document.addEventListener('keydown', handleKeyPress);
      _GM_addStyle(`
      #image-downloader-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        background-color: white;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 380px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        color: #2c3e50;
        cursor: grab;
      }
      #image-downloader-panel.dragging {
        cursor: grabbing;
      }
      #image-downloader-panel h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #303133;
      }
      #image-downloader-panel .panel-controls {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      #image-downloader-panel .panel-controls button,
      #image-downloader-panel .primary-button,
      #image-downloader-panel .download-button {
        background-color: #409eff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      #image-downloader-panel .panel-controls button:hover:not(:disabled),
      #image-downloader-panel .primary-button:hover:not(:disabled),
      #image-downloader-panel .download-button:hover:not(:disabled) {
        background-color: #66b1ff;
      }
      #image-downloader-panel .panel-controls button:disabled,
      #image-downloader-panel .primary-button:disabled,
      #image-downloader-panel .download-button:disabled {
        background-color: #c0c4cc;
        cursor: not-allowed;
      }
      #image-downloader-panel .image-list {
        background-color: #fafafa;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 12px;
        max-height: 400px;
        overflow-y: auto;
      }
      #image-downloader-panel .select-all-container {
        margin-bottom: 8px;
        font-size: 14px;
        color: #606266;
      }
      #image-downloader-panel .status-bar {
        font-size: 13px;
        color: #909399;
        margin-top: 8px;
        min-height: 20px;
      }
      #image-downloader-panel .close-button,
      #image-downloader-panel .toggle-thumbs-button {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #909399;
        padding: 4px;
        margin-left: 8px;
        transition: color 0.2s;
      }
      #image-downloader-panel .close-button:hover,
      #image-downloader-panel .toggle-thumbs-button:hover {
        color: #606266;
      }
      #image-downloader-panel .image-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background-color 0.1s ease-in-out;
      }
      #image-downloader-panel .image-item:hover {
        background-color: #f0f0f0;
      }
      #image-downloader-panel .image-item:last-child {
        border-bottom: none;
      }
      #image-downloader-panel .image-item input[type='checkbox'] {
        margin-right: 10px !important;
        flex-shrink: 0 !important;
        pointer-events: none !important;
        display: inline-block !important;
        opacity: 1 !important;
        visibility: visible !important;
        width: auto !important;
        height: auto !important;
        appearance: checkbox !important;
        position: static !important;
      }
      #image-downloader-panel .image-item img.thumbnail {
        width: 40px;
        height: 40px;
        object-fit: cover;
        margin-right: 10px;
        border: 1px solid #eee;
        flex-shrink: 0;
      }
      #image-downloader-panel .image-item .image-url {
        word-break: break-all;
        font-size: 12px;
        color: #495057;
        flex-grow: 1;
      }
      .image-downloader-toggle-btn {
        position: fixed; /* Changed from relative to fixed */
        bottom: 20px;
        right: 20px;
        z-index: 99998;
        width: 50px;
        height: 50px;
        background-color: #409eff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        line-height: 1;
        transition: background-color 0.2s;
      }

      .image-downloader-toggle-btn:hover {
        background-color: #66b1ff;
      }
      
      .image-downloader-toggle-btn .close-icon {
        position: absolute;
        top: -6px;
        left: -6px;
        width: 16px;
        height: 16px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
        cursor: pointer;
        z-index: 100000;
      }

      .image-downloader-toggle-btn:hover .close-icon {
        opacity: 1;
      }

      .image-downloader-toggle-btn .close-icon:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }

      /* Preview Modal Styles */
      .image-preview-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100000; /* Ensure it's above everything */
        cursor: pointer;
      }

      .image-preview-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background-color: #fff; /* Optional: add background if needed */
        padding: 10px; /* Add some padding around the image */
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        cursor: default; /* Reset cursor for the content area */
        display: flex; /* Use flex to help center potentially smaller images */
        justify-content: center;
        align-items: center;
      }

      .image-preview-content img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain; /* Scale image while preserving aspect ratio */
      }

      .preview-close-button {
        position: absolute;
        top: -15px; /* Position outside the top-right corner */
        right: -15px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-size: 16px;
        line-height: 30px; /* Center the '✖' */
        text-align: center;
        cursor: pointer;
        z-index: 100001;
        transition: background-color 0.2s;
      }
      .preview-close-button:hover {
        background-color: rgba(0, 0, 0, 0.9);
      }

      /* Adjust thumbnail cursor */
      #image-downloader-panel .image-item img.thumbnail,
      #image-downloader-panel .image-item .image-url {
          cursor: pointer; /* Ensure pointer cursor */
      }
    `);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    });
    legacy_pre_effect(
      () => get(images),
      () => {
        set(
          allSelected,
          get(images).length > 0 && get(images).every((img) => img.selected),
        );
      },
    );
    legacy_pre_effect(
      () => (get(images), get(allSelected)),
      () => {
        set(
          indeterminate,
          get(images).length > 0 &&
            !get(allSelected) &&
            get(images).some((img) => img.selected),
        );
      },
    );
    legacy_pre_effect_reset();
    init();
    var fragment = root();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1();
        var div_1 = child(div);
        var button = child(div_1);
        var img_1 = sibling(button, 2);
        template_effect(() =>
          set_attribute(img_1, 'src', get(previewImageUrl)),
        );
        event('click', button, () => set(previewVisible, false));
        event(
          'click',
          div_1,
          stopPropagation(function ($$arg) {
            bubble_event.call(this, $$props, $$arg);
          }),
        );
        event('click', div, () => set(previewVisible, false));
        transition(
          3,
          div,
          () => fade,
          () => ({ duration: 150 }),
        );
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(previewVisible)) $$render(consequent);
      });
    }
    var node_1 = sibling(node, 2);
    {
      var consequent_6 = ($$anchor2) => {
        var div_2 = root_2();
        let classes;
        var h3 = child(div_2);
        var div_3 = sibling(child(h3), 2);
        var button_1 = child(div_3);
        var text = child(button_1);
        var button_2 = sibling(button_1, 2);
        var node_2 = sibling(h3, 2);
        TextAd(node_2, {});
        var div_4 = sibling(node_2, 2);
        var button_3 = child(div_4);
        var node_3 = sibling(div_4, 2);
        {
          var consequent_1 = ($$anchor3) => {
            var div_5 = root_3();
            var input = child(div_5);
            var label = sibling(input, 2);
            var text_1 = child(label);
            template_effect(
              ($0) => {
                input.disabled = get(loading);
                set_text(
                  text_1,
                  `全选/取消全选 (${$0 ?? ''}/${get(images).length ?? ''})`,
                );
              },
              [() => get(images).filter((img) => img.selected).length],
              derived_safe_equal,
            );
            bind_checked(
              input,
              () => get(allSelected),
              ($$value) => set(allSelected, $$value),
            );
            bind_property(
              'indeterminate',
              'change',
              input,
              ($$value) => set(indeterminate, $$value),
              () => get(indeterminate),
            );
            event('change', input, toggleSelectAll);
            append($$anchor3, div_5);
          };
          if_block(node_3, ($$render) => {
            if (get(images).length > 0) $$render(consequent_1);
          });
        }
        var div_6 = sibling(node_3, 2);
        var node_4 = child(div_6);
        {
          var consequent_3 = ($$anchor3) => {
            var fragment_1 = comment();
            var node_5 = first_child(fragment_1);
            each(
              node_5,
              3,
              () => get(images),
              (img) => img.url,
              ($$anchor4, img, i) => {
                var label_1 = root_5();
                var input_1 = child(label_1);
                var node_6 = sibling(input_1, 2);
                {
                  var consequent_2 = ($$anchor5) => {
                    var img_2 = root_6();
                    template_effect(() =>
                      set_attribute(img_2, 'src', get(img).url),
                    );
                    event('error', img_2, handleThumbnailError);
                    event(
                      'click',
                      img_2,
                      preventDefault(() => openPreview(get(img).url)),
                    );
                    append($$anchor5, img_2);
                  };
                  if_block(node_6, ($$render) => {
                    if (get(showThumbnails)) $$render(consequent_2);
                  });
                }
                var span = sibling(node_6, 2);
                var text_2 = child(span);
                template_effect(() => {
                  set_attribute(input_1, 'id', `img-${get(i)}`);
                  input_1.disabled = get(loading);
                  set_text(text_2, get(img).name);
                });
                bind_checked(
                  input_1,
                  () => get(img).selected,
                  ($$value) => (
                    (get(img).selected = $$value),
                    invalidate_inner_signals(() => get(images))
                  ),
                );
                append($$anchor4, label_1);
              },
            );
            append($$anchor3, fragment_1);
          };
          var alternate = ($$anchor3, $$elseif) => {
            {
              var consequent_4 = ($$anchor4) => {
                var p = root_8();
                append($$anchor4, p);
              };
              if_block(
                $$anchor3,
                ($$render) => {
                  if (!get(loading)) $$render(consequent_4);
                },
                $$elseif,
              );
            }
          };
          if_block(node_4, ($$render) => {
            if (get(images).length > 0) $$render(consequent_3);
            else $$render(alternate, false);
          });
        }
        var node_7 = sibling(node_4, 2);
        {
          var consequent_5 = ($$anchor3) => {
            var p_1 = root_9();
            append($$anchor3, p_1);
          };
          if_block(node_7, ($$render) => {
            if (get(loading) && get(images).length === 0)
              $$render(consequent_5);
          });
        }
        var button_4 = sibling(div_6, 2);
        var div_7 = sibling(button_4, 2);
        var text_3 = child(div_7);
        bind_this(
          div_2,
          ($$value) => set(panelElement, $$value),
          () => get(panelElement),
        );
        template_effect(
          ($0, $1) => {
            classes = set_class(div_2, 1, '', null, classes, $0);
            set_attribute(
              button_1,
              'title',
              get(showThumbnails) ? '隐藏缩略图' : '显示缩略图',
            );
            set_text(text, get(showThumbnails) ? '🖼️' : '🚫');
            button_3.disabled = get(loading);
            button_4.disabled = $1;
            set_text(text_3, get(status));
          },
          [
            () => ({ dragging: get(isDragging) }),
            () =>
              get(loading) ||
              get(images).filter((img) => img.selected).length === 0,
          ],
          derived_safe_equal,
        );
        event('click', button_1, () =>
          set(showThumbnails, !get(showThumbnails)),
        );
        event('click', button_2, () => set(panelVisible, false));
        event('click', button_3, findImages);
        event('click', button_4, downloadSelected);
        event('mousedown', div_2, handleMouseDown);
        append($$anchor2, div_2);
      };
      if_block(node_1, ($$render) => {
        if (get(panelVisible)) $$render(consequent_6);
      });
    }
    var node_8 = sibling(node_1, 2);
    {
      var consequent_7 = ($$anchor2) => {
        var button_5 = root_10();
        var div_8 = child(button_5);
        event(
          'click',
          div_8,
          stopPropagation(() => set(buttonVisible, false)),
        );
        event('click', button_5, () => set(panelVisible, true));
        append($$anchor2, button_5);
      };
      if_block(node_8, ($$render) => {
        if (!get(panelVisible) && get(buttonVisible)) $$render(consequent_7);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  mount(App, {
    target: (() => {
      const app2 = document.createElement('div');
      document.body.append(app2);
      return app2;
    })(),
  });
})(fflate);
