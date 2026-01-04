// ==UserScript==
// @name         migaku-duchinese-compatability-userscript
// @namespace    https://github.com/halcarleton
// @version      0.1.1
// @author       https://github.com/halcarleton
// @description  Modifies the DuChinese graded reader UI to make it compatible with the Migaku extension.
// @license      Apache-2.0
// @include      https://duchinese.net/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/517065/migaku-duchinese-compatability-userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/517065/migaku-duchinese-compatability-userscript.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var _events, _instance;
  function wait(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }
  const defaultWaitForOptions = {
    err: new Error("Exceeded time limit while waiting."),
    interval: 500,
    timeout: 5e3
  };
  async function waitFor(fn, options = {}) {
    const completeOptions = Object.assign(
      {},
      defaultWaitForOptions,
      options
    );
    let start = Date.now();
    let result = fn();
    while (!result) {
      if (Date.now() - start > completeOptions.timeout) {
        throw completeOptions.err;
      }
      await wait(completeOptions.interval);
      result = fn();
    }
    return result;
  }
  function getAllBySelector(selector, parent) {
    return [...document.querySelectorAll(selector)];
  }
  async function getNBySelector(selector, qty, options = {}, parent) {
    let localOptions = {
      ...options,
      err: options.err || new Error(`Exceeded time limit while querying selector: "${selector}"`)
    };
    const matchedElements = await waitFor(() => {
      const elements = getAllBySelector(selector);
      if (elements.length === qty) {
        return elements;
      }
      elements.length;
      return null;
    }, localOptions);
    return matchedElements;
  }
  async function getBySelector(selector, options = {}, parent) {
    const matchedElements = await getNBySelector(selector, 1, options);
    return matchedElements[0];
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const PROPS_IS_RUNES = 1 << 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const HYDRATION_START = "[";
  const HYDRATION_START_ELSE = "[!";
  const HYDRATION_END = "]";
  const HYDRATION_ERROR = {};
  const DEV = false;
  function hydration_mismatch(location) {
    {
      console.warn("hydration_mismatch");
    }
  }
  var is_array = Array.isArray;
  var array_from = Array.from;
  var object_keys = Object.keys;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
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
  const UNOWNED = 1 << 7;
  const DISCONNECTED = 1 << 8;
  const CLEAN = 1 << 9;
  const DIRTY = 1 << 10;
  const MAYBE_DIRTY = 1 << 11;
  const INERT = 1 << 12;
  const DESTROYED = 1 << 13;
  const EFFECT_RAN = 1 << 14;
  const EFFECT_TRANSPARENT = 1 << 15;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_HAS_DERIVED = 1 << 19;
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error("effect_update_depth_exceeded");
    }
  }
  function hydration_failed() {
    {
      throw new Error("hydration_failed");
    }
  }
  function props_invalid_value(key) {
    {
      throw new Error("props_invalid_value");
    }
  }
  function state_unsafe_local_read() {
    {
      throw new Error("state_unsafe_local_read");
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error("state_unsafe_mutation");
    }
  }
  function source(v) {
    return {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      version: 0
    };
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false) {
    var _a;
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (component_context !== null && component_context.l !== null) {
      ((_a = component_context.l).s ?? (_a.s = [])).push(s);
    }
    return s;
  }
  function set(source2, value) {
    if (active_reaction !== null && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 && // If the source was created locally within the current derived, then
    // we allow the mutation.
    (derived_sources === null || !derived_sources.includes(source2))) {
      state_unsafe_mutation();
    }
    return internal_set(source2, value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      source2.v = value;
      source2.version = increment_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & BRANCH_EFFECT) === 0) {
        if (new_deps !== null && new_deps.includes(source2)) {
          set_signal_status(active_effect, DIRTY);
          schedule_effect(active_effect);
        } else {
          if (untracked_writes === null) {
            set_untracked_writes([source2]);
          } else {
            untracked_writes.push(source2);
          }
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
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags = DERIVED | DIRTY;
    if (active_effect === null) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_HAS_DERIVED;
    }
    const signal = {
      children: null,
      ctx: component_context,
      deps: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      v: (
        /** @type {V} */
        null
      ),
      version: 0,
      parent: active_effect
    };
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.children ?? (derived2.children = [])).push(signal);
    }
    return signal;
  }
  function destroy_derived_children(derived2) {
    var children = derived2.children;
    if (children !== null) {
      derived2.children = null;
      for (var i = 0; i < children.length; i += 1) {
        var child2 = children[i];
        if ((child2.f & DERIVED) !== 0) {
          destroy_derived(
            /** @type {Derived} */
            child2
          );
        } else {
          destroy_effect(
            /** @type {Effect} */
            child2
          );
        }
      }
    }
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(derived2.parent);
    {
      try {
        destroy_derived_children(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.version = increment_version();
    }
  }
  function destroy_derived(signal) {
    destroy_derived_children(signal);
    remove_reactions(signal, 0);
    set_signal_status(signal, DESTROYED);
    signal.v = signal.children = signal.deps = signal.ctx = signal.reactions = null;
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
    var is_root = (type & ROOT_EFFECT) !== 0;
    var parent_effect = active_effect;
    var effect2 = {
      ctx: component_context,
      deps: null,
      deriveds: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent: is_root ? null : parent_effect,
      prev: null,
      teardown: null,
      transitions: null,
      version: 0
    };
    if (sync) {
      var previously_flushing_effect = is_flushing_effect;
      try {
        set_is_flushing_effect(true);
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e) {
        destroy_effect(effect2);
        throw e;
      } finally {
        set_is_flushing_effect(previously_flushing_effect);
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & EFFECT_HAS_DERIVED) === 0;
    if (!inert && !is_root && push2) {
      if (parent_effect !== null) {
        push_effect(effect2, parent_effect);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.children ?? (derived2.children = [])).push(effect2);
      }
    }
    return effect2;
  }
  function effect_root(fn) {
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return () => {
      destroy_effect(effect2);
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn) {
    return block(fn);
  }
  function block(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn, true);
  }
  function branch(fn, push2 = true) {
    return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown = effect2.teardown;
    if (teardown !== null) {
      const previous_reaction = active_reaction;
      set_active_reaction(null);
      try {
        teardown.call(null);
      } finally {
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_deriveds(signal) {
    var deriveds = signal.deriveds;
    if (deriveds !== null) {
      signal.deriveds = null;
      for (var i = 0; i < deriveds.length; i += 1) {
        destroy_derived(deriveds[i]);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      var next2 = effect2.next;
      destroy_effect(effect2, remove_dom);
      effect2 = next2;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next2 = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next2;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null) {
      var node = effect2.nodes_start;
      var end = effect2.nodes_end;
      while (node !== null) {
        var next2 = node === end ? null : (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_next_sibling(node)
        );
        node.remove();
        node = next2;
      }
      removed = true;
    }
    destroy_effect_deriveds(effect2);
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
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.parent = effect2.fn = effect2.nodes_start = effect2.nodes_end = null;
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next2 = effect2.next;
    if (prev !== null) prev.next = next2;
    if (next2 !== null) next2.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next2;
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
      var sibling = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if (check_dirtiness(effect2)) {
      update_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling;
    }
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let is_micro_task_queued$1 = false;
  let current_queued_micro_tasks = [];
  function process_micro_tasks() {
    is_micro_task_queued$1 = false;
    const tasks = current_queued_micro_tasks.slice();
    current_queued_micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (!is_micro_task_queued$1) {
      is_micro_task_queued$1 = true;
      queueMicrotask(process_micro_tasks);
    }
    current_queued_micro_tasks.push(fn);
  }
  function flush_tasks() {
    if (is_micro_task_queued$1) {
      process_micro_tasks();
    }
  }
  const FLUSH_MICROTASK = 0;
  const FLUSH_SYNC = 1;
  let scheduler_mode = FLUSH_MICROTASK;
  let is_micro_task_queued = false;
  let is_flushing_effect = false;
  function set_is_flushing_effect(value) {
    is_flushing_effect = value;
  }
  let queued_root_effects = [];
  let flush_count = 0;
  let active_reaction = null;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let derived_sources = null;
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let current_version = 0;
  let skip_reaction = false;
  let component_context = null;
  function increment_version() {
    return ++current_version;
  }
  function is_runes() {
    return component_context !== null && component_context.l === null;
  }
  function check_dirtiness(reaction) {
    var _a, _b;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i;
        if ((flags & DISCONNECTED) !== 0) {
          for (i = 0; i < dependencies.length; i++) {
            ((_a = dependencies[i]).reactions ?? (_a.reactions = [])).push(reaction);
          }
          reaction.f ^= DISCONNECTED;
        }
        for (i = 0; i < dependencies.length; i++) {
          var dependency = dependencies[i];
          if (check_dirtiness(
            /** @type {Derived} */
            dependency
          )) {
            update_derived(
              /** @type {Derived} */
              dependency
            );
          }
          if (is_unowned && active_effect !== null && !skip_reaction && !((_b = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _b.includes(reaction))) {
            (dependency.reactions ?? (dependency.reactions = [])).push(reaction);
          }
          if (dependency.version > reaction.version) {
            return true;
          }
        }
      }
      if (!is_unowned) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function handle_error(error, effect2, component_context2) {
    {
      throw error;
    }
  }
  function update_reaction(reaction) {
    var _a;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var prev_derived_sources = derived_sources;
    var previous_component_context = component_context;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    skip_reaction = !is_flushing_effect && (flags & UNOWNED) !== 0;
    derived_sources = null;
    component_context = reaction.ctx;
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
            ((_a = deps[i]).reactions ?? (_a.reactions = [])).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      derived_sources = prev_derived_sources;
      component_context = previous_component_context;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = reactions.indexOf(signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
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
    active_effect = effect2;
    try {
      destroy_effect_deriveds(effect2);
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown = update_reaction(effect2);
      effect2.teardown = typeof teardown === "function" ? teardown : null;
      effect2.version = current_version;
      if (DEV) ;
    } catch (error) {
      handle_error(
        /** @type {Error} */
        error
      );
    } finally {
      active_effect = previous_effect;
    }
  }
  function infinite_loop_guard() {
    if (flush_count > 1e3) {
      flush_count = 0;
      {
        effect_update_depth_exceeded();
      }
    }
    flush_count++;
  }
  function flush_queued_root_effects(root_effects) {
    var length = root_effects.length;
    if (length === 0) {
      return;
    }
    infinite_loop_guard();
    var previously_flushing_effect = is_flushing_effect;
    is_flushing_effect = true;
    try {
      for (var i = 0; i < length; i++) {
        var effect2 = root_effects[i];
        if ((effect2.f & CLEAN) === 0) {
          effect2.f ^= CLEAN;
        }
        var collected_effects = [];
        process_effects(effect2, collected_effects);
        flush_queued_effects(collected_effects);
      }
    } finally {
      is_flushing_effect = previously_flushing_effect;
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    for (var i = 0; i < length; i++) {
      var effect2 = effects[i];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && check_dirtiness(effect2)) {
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
          if (effect2.teardown === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
      }
    }
  }
  function process_deferred() {
    is_micro_task_queued = false;
    if (flush_count > 1001) {
      return;
    }
    const previous_queued_root_effects = queued_root_effects;
    queued_root_effects = [];
    flush_queued_root_effects(previous_queued_root_effects);
    if (!is_micro_task_queued) {
      flush_count = 0;
    }
  }
  function schedule_effect(signal) {
    if (scheduler_mode === FLUSH_MICROTASK) {
      if (!is_micro_task_queued) {
        is_micro_task_queued = true;
        queueMicrotask(process_deferred);
      }
    }
    var effect2 = signal;
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
  function process_effects(effect2, collected_effects) {
    var current_effect = effect2.first;
    var effects = [];
    main_loop: while (current_effect !== null) {
      var flags = current_effect.f;
      var is_branch = (flags & BRANCH_EFFECT) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      if (!is_skippable_branch && (flags & INERT) === 0) {
        if ((flags & RENDER_EFFECT) !== 0) {
          if (is_branch) {
            current_effect.f ^= CLEAN;
          } else if (check_dirtiness(current_effect)) {
            update_effect(current_effect);
          }
          var child2 = current_effect.first;
          if (child2 !== null) {
            current_effect = child2;
            continue;
          }
        } else if ((flags & EFFECT) !== 0) {
          effects.push(current_effect);
        }
      }
      var sibling = current_effect.next;
      if (sibling === null) {
        let parent = current_effect.parent;
        while (parent !== null) {
          if (effect2 === parent) {
            break main_loop;
          }
          var parent_sibling = parent.next;
          if (parent_sibling !== null) {
            current_effect = parent_sibling;
            continue main_loop;
          }
          parent = parent.parent;
        }
      }
      current_effect = sibling;
    }
    for (var i = 0; i < effects.length; i++) {
      child2 = effects[i];
      collected_effects.push(child2);
      process_effects(child2, collected_effects);
    }
  }
  function flush_sync(fn) {
    var previous_scheduler_mode = scheduler_mode;
    var previous_queued_root_effects = queued_root_effects;
    try {
      infinite_loop_guard();
      const root_effects = [];
      scheduler_mode = FLUSH_SYNC;
      queued_root_effects = root_effects;
      is_micro_task_queued = false;
      flush_queued_root_effects(previous_queued_root_effects);
      var result = fn == null ? void 0 : fn();
      flush_tasks();
      if (queued_root_effects.length > 0 || root_effects.length > 0) {
        flush_sync();
      }
      flush_count = 0;
      if (DEV) ;
      return result;
    } finally {
      scheduler_mode = previous_scheduler_mode;
      queued_root_effects = previous_queued_root_effects;
    }
  }
  function get(signal) {
    var _a;
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (is_derived && (flags & DESTROYED) !== 0) {
      var value = execute_derived(
        /** @type {Derived} */
        signal
      );
      destroy_derived(
        /** @type {Derived} */
        signal
      );
      return value;
    }
    if (active_reaction !== null) {
      if (derived_sources !== null && derived_sources.includes(signal)) {
        state_unsafe_local_read();
      }
      var deps = active_reaction.deps;
      if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
        skipped_deps++;
      } else if (new_deps === null) {
        new_deps = [signal];
      } else {
        new_deps.push(signal);
      }
      if (untracked_writes !== null && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & BRANCH_EFFECT) === 0 && untracked_writes.includes(signal)) {
        set_signal_status(active_effect, DIRTY);
        schedule_effect(active_effect);
      }
    } else if (is_derived && /** @type {Derived} */
    signal.deps === null) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      var parent = derived2.parent;
      if (parent !== null && !((_a = parent.deriveds) == null ? void 0 : _a.includes(derived2))) {
        (parent.deriveds ?? (parent.deriveds = [])).push(derived2);
      }
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    return signal.v;
  }
  function untrack(fn) {
    const previous_reaction = active_reaction;
    try {
      active_reaction = null;
      return fn();
    } finally {
      active_reaction = previous_reaction;
    }
  }
  const STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      c: null,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null
    };
    if (!runes) {
      component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: source(false)
      };
    }
  }
  function pop(component) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
      if (component !== void 0) {
        context_stack_item.x = component;
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
    return component || /** @type {T} */
    {};
  }
  var $window;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    element_prototype.__click = void 0;
    element_prototype.__className = "";
    element_prototype.__attributes = null;
    element_prototype.__styles = null;
    element_prototype.__e = void 0;
    Text.prototype.__t = void 0;
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
    if (!hydrating) {
      return /* @__PURE__ */ get_first_child(node);
    }
    var child2 = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_first_child(hydrate_node)
    );
    if (child2 === null) {
      child2 = hydrate_node.appendChild(create_text());
    } else if (is_text && child2.nodeType !== 3) {
      var text = create_text();
      child2 == null ? void 0 : child2.before(text);
      set_hydrate_node(text);
      return text;
    }
    set_hydrate_node(child2);
    return child2;
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  let hydrating = false;
  function set_hydrating(value) {
    hydrating = value;
  }
  let hydrate_node;
  function set_hydrate_node(node) {
    if (node === null) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    return hydrate_node = node;
  }
  function hydrate_next() {
    return set_hydrate_node(
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(hydrate_node)
    );
  }
  function reset(node) {
    if (!hydrating) return;
    if (/* @__PURE__ */ get_next_sibling(hydrate_node) !== null) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    hydrate_node = node;
  }
  function next(count = 1) {
    if (hydrating) {
      var i = count;
      var node = hydrate_node;
      while (i--) {
        node = /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node);
      }
      hydrate_node = node;
    }
  }
  function remove_nodes() {
    var depth = 0;
    var node = hydrate_node;
    while (true) {
      if (node.nodeType === 8) {
        var data = (
          /** @type {Comment} */
          node.data
        );
        if (data === HYDRATION_END) {
          if (depth === 0) return node;
          depth -= 1;
        } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE) {
          depth += 1;
        }
      }
      var next2 = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      node.remove();
      node = next2;
    }
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function handle_event_propagation(event) {
    var _a;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = ((_a = event.composedPath) == null ? void 0 : _a.call(event)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event.target
    );
    var path_idx = 0;
    var handled_at = event.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event.__root = handler_element;
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
    path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
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
          if (delegated !== void 0 && !/** @type {any} */
          current_target.disabled) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event, ...data]);
            } else {
              delegated.call(current_target, event);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
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
      event.__root = handler_element;
      delete event.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html) {
    var elem = document.createElement("template");
    elem.innerHTML = html;
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
  function template(content, flags) {
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (hydrating) {
        assign_nodes(hydrate_node, null);
        return hydrate_node;
      }
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        node = /** @type {Node} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node ? document.importNode(node, true) : node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function append(anchor, dom) {
    if (hydrating) {
      active_effect.nodes_end = hydrate_node;
      hydrate_next();
      return;
    }
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text.__t ?? (text.__t = text.nodeValue))) {
      text.__t = str;
      text.nodeValue = str == null ? "" : str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  function hydrate(component, options) {
    init_operations();
    options.intro = options.intro ?? false;
    const target = options.target;
    const was_hydrating = hydrating;
    const previous_hydrate_node = hydrate_node;
    try {
      var anchor = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(target)
      );
      while (anchor && (anchor.nodeType !== 8 || /** @type {Comment} */
      anchor.data !== HYDRATION_START)) {
        anchor = /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(anchor);
      }
      if (!anchor) {
        throw HYDRATION_ERROR;
      }
      set_hydrating(true);
      set_hydrate_node(
        /** @type {Comment} */
        anchor
      );
      hydrate_next();
      const instance = _mount(component, { ...options, anchor });
      if (hydrate_node === null || hydrate_node.nodeType !== 8 || /** @type {Comment} */
      hydrate_node.data !== HYDRATION_END) {
        hydration_mismatch();
        throw HYDRATION_ERROR;
      }
      set_hydrating(false);
      return (
        /**  @type {Exports} */
        instance
      );
    } catch (error) {
      if (error === HYDRATION_ERROR) {
        if (options.recover === false) {
          hydration_failed();
        }
        init_operations();
        clear_text_content(target);
        set_hydrating(false);
        return mount(component, options);
      }
      throw error;
    } finally {
      set_hydrating(was_hydrating);
      set_hydrate_node(previous_hydrate_node);
    }
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
    var component = void 0;
    var unmount2 = effect_root(() => {
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
        if (hydrating) {
          assign_nodes(
            /** @type {TemplateNode} */
            anchor_node,
            null
          );
        }
        component = Component(anchor_node, props) || {};
        if (hydrating) {
          active_effect.nodes_end = hydrate_node;
        }
        if (context) {
          pop();
        }
      });
      return () => {
        var _a;
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
        mounted_components.delete(component);
        if (anchor_node !== anchor) {
          (_a = anchor_node.parentNode) == null ? void 0 : _a.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount2);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function unmount(component) {
    const fn = mounted_components.get(component);
    if (fn) {
      fn();
    }
  }
  let current_each_item = null;
  function index(_, i) {
    return i;
  }
  function pause_effects(state, items, controlled_anchor, items_map) {
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
      link(state, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i2 = 0; i2 < length; i2++) {
        var item = items[i2];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var state = { flags, items: /* @__PURE__ */ new Map(), first: null };
    {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = hydrating ? set_hydrate_node(
        /** @type {Comment | Text} */
        /* @__PURE__ */ get_first_child(parent_node)
      ) : parent_node.appendChild(create_text());
    }
    if (hydrating) {
      hydrate_next();
    }
    var fallback = null;
    var was_empty = false;
    block(() => {
      var collection = get_collection();
      var array = is_array(collection) ? collection : collection == null ? [] : array_from(collection);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      let mismatch = false;
      if (hydrating) {
        var is_else = (
          /** @type {Comment} */
          anchor.data === HYDRATION_START_ELSE
        );
        if (is_else !== (length === 0)) {
          anchor = remove_nodes();
          set_hydrate_node(anchor);
          set_hydrating(false);
          mismatch = true;
        }
      }
      if (hydrating) {
        var prev = null;
        var item;
        for (var i = 0; i < length; i++) {
          if (hydrate_node.nodeType === 8 && /** @type {Comment} */
          hydrate_node.data === HYDRATION_END) {
            anchor = /** @type {Comment} */
            hydrate_node;
            mismatch = true;
            set_hydrating(false);
            break;
          }
          var value = array[i];
          var key = get_key(value, i);
          item = create_item(hydrate_node, state, prev, null, value, key, i, render_fn, flags);
          state.items.set(key, item);
          prev = item;
        }
        if (length > 0) {
          set_hydrate_node(remove_nodes());
        }
      }
      if (!hydrating) {
        reconcile(array, state, anchor, render_fn, flags, get_key);
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
      if (mismatch) {
        set_hydrating(true);
      }
      get_collection();
    });
    if (hydrating) {
      anchor = hydrate_node;
    }
  }
  function reconcile(array, state, anchor, render_fn, flags, get_key) {
    var length = array.length;
    var items = state.items;
    var first = state.first;
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
          state,
          prev,
          prev === null ? state.first : prev.next,
          value,
          key,
          i,
          render_fn,
          flags
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
            link(state, a.prev, b.next);
            link(state, prev, a);
            link(state, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state, item.prev, item.next);
            link(state, item, prev === null ? state.first : prev.next);
            link(state, prev, item);
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
        pause_effects(state, to_destroy, controlled_anchor, items);
      }
    }
    active_effect.first = state.first && state.first.e;
    active_effect.last = prev && prev.e;
  }
  function update_item(item, value, index2, type) {
    {
      internal_set(item.v, value);
    }
    {
      item.i = index2;
    }
  }
  function create_item(anchor, state, prev, next2, value, key, index2, render_fn, flags) {
    var previous_each_item = current_each_item;
    try {
      var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
      var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
      var v = reactive ? mutable ? /* @__PURE__ */ mutable_source(value) : source(value) : value;
      var i = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
      var item = {
        i,
        v,
        k: key,
        a: null,
        // @ts-expect-error
        e: null,
        prev,
        next: next2
      };
      current_each_item = item;
      item.e = branch(() => render_fn(anchor, v, i), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next2 && next2.e;
      if (prev === null) {
        state.first = item;
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next2 !== null) {
        next2.prev = item;
        next2.e.prev = item.e;
      }
      return item;
    } finally {
      current_each_item = previous_each_item;
    }
  }
  function move(item, next2, anchor) {
    var end = item.next ? (
      /** @type {TemplateNode} */
      item.next.e.nodes_start
    ) : anchor;
    var dest = next2 ? (
      /** @type {TemplateNode} */
      next2.e.nodes_start
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
  function link(state, prev, next2) {
    if (prev === null) {
      state.first = next2;
    } else {
      prev.next = next2;
      prev.e.next = next2 && next2.e;
    }
    if (next2 !== null) {
      next2.prev = prev;
      next2.e.prev = prev && prev.e;
    }
  }
  function append_styles(anchor, css) {
    queue_micro_task(() => {
      var root2 = anchor.getRootNode();
      var target = (
        /** @type {ShadowRoot} */
        root2.host ? (
          /** @type {ShadowRoot} */
          root2
        ) : (
          /** @type {Document} */
          root2.head ?? /** @type {Document} */
          root2.ownerDocument.head
        )
      );
      if (!target.querySelector("#" + css.hash)) {
        const style = document.createElement("style");
        style.id = css.hash;
        style.textContent = css.code;
        target.appendChild(style);
      }
    });
  }
  function set_class(dom, value) {
    var prev_class_name = dom.__className;
    var next_class_name = to_class(value);
    if (hydrating && dom.className === next_class_name) {
      dom.__className = next_class_name;
    } else if (prev_class_name !== next_class_name || hydrating && dom.className !== next_class_name) {
      if (value == null) {
        dom.removeAttribute("class");
      } else {
        dom.className = next_class_name;
      }
      dom.__className = next_class_name;
    }
  }
  function to_class(value) {
    return value == null ? "" : value;
  }
  function with_parent_branch(fn) {
    var effect2 = active_effect;
    var previous_effect = active_effect;
    while (effect2 !== null && (effect2.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      effect2 = effect2.parent;
    }
    try {
      set_active_effect(effect2);
      return fn();
    } finally {
      set_active_effect(previous_effect);
    }
  }
  function prop(props, key, flags, fallback) {
    var _a;
    var runes = (flags & PROPS_IS_RUNES) !== 0;
    var is_store_sub = false;
    var prop_value;
    {
      prop_value = /** @type {V} */
      props[key];
    }
    var setter = (_a = get_descriptor(props, key)) == null ? void 0 : _a.set;
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var fallback_used = false;
    var get_fallback = () => {
      fallback_used = true;
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
      if (setter && runes) {
        props_invalid_value();
      }
      prop_value = get_fallback();
      if (setter) setter(prop_value);
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
        fallback_used = false;
        return value;
      };
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return function(value, mutation) {
        if (arguments.length > 0) {
          if (!mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        } else {
          return getter();
        }
      };
    }
    var from_child = false;
    var was_from_child = false;
    var inner_current_value = /* @__PURE__ */ mutable_source(prop_value);
    var current_value = with_parent_branch(
      () => /* @__PURE__ */ derived(() => {
        var parent_value = getter();
        var child_value = get(inner_current_value);
        var current_derived = (
          /** @type {Derived} */
          active_reaction
        );
        if (from_child || parent_value === void 0 && (current_derived.f & DESTROYED) !== 0) {
          from_child = false;
          was_from_child = true;
          return child_value;
        }
        was_from_child = false;
        return inner_current_value.v = parent_value;
      })
    );
    return function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get(current_value) : value;
        if (!current_value.equals(new_value)) {
          from_child = true;
          set(inner_current_value, new_value);
          if (fallback_used && fallback_value !== void 0) {
            fallback_value = new_value;
          }
          untrack(() => get(current_value));
        }
        return value;
      }
      return get(current_value);
    };
  }
  function createClassComponent(options) {
    return new Svelte4Component(options);
  }
  class Svelte4Component {
    /**
     * @param {ComponentConstructorOptions & {
     *  component: any;
     * }} options
     */
    constructor(options) {
      /** @type {any} */
      __privateAdd(this, _events);
      /** @type {Record<string, any>} */
      __privateAdd(this, _instance);
      var _a;
      var sources = /* @__PURE__ */ new Map();
      var add_source = (key, value) => {
        var s = /* @__PURE__ */ mutable_source(value);
        sources.set(key, s);
        return s;
      };
      const props = new Proxy(
        { ...options.props || {}, $$events: {} },
        {
          get(target, prop2) {
            return get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
          },
          has(target, prop2) {
            get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
            return Reflect.has(target, prop2);
          },
          set(target, prop2, value) {
            set(sources.get(prop2) ?? add_source(prop2, value), value);
            return Reflect.set(target, prop2, value);
          }
        }
      );
      __privateSet(this, _instance, (options.hydrate ? hydrate : mount)(options.component, {
        target: options.target,
        props,
        context: options.context,
        intro: options.intro ?? false,
        recover: options.recover
      }));
      if (!((_a = options == null ? void 0 : options.props) == null ? void 0 : _a.$$host) || options.sync === false) {
        flush_sync();
      }
      __privateSet(this, _events, props.$$events);
      for (const key of Object.keys(__privateGet(this, _instance))) {
        if (key === "$set" || key === "$destroy" || key === "$on") continue;
        define_property(this, key, {
          get() {
            return __privateGet(this, _instance)[key];
          },
          /** @param {any} value */
          set(value) {
            __privateGet(this, _instance)[key] = value;
          },
          enumerable: true
        });
      }
      __privateGet(this, _instance).$set = /** @param {Record<string, any>} next */
      (next2) => {
        Object.assign(props, next2);
      };
      __privateGet(this, _instance).$destroy = () => {
        unmount(__privateGet(this, _instance));
      };
    }
    /** @param {Record<string, any>} props */
    $set(props) {
      __privateGet(this, _instance).$set(props);
    }
    /**
     * @param {string} event
     * @param {(...args: any[]) => any} callback
     * @returns {any}
     */
    $on(event, callback) {
      __privateGet(this, _events)[event] = __privateGet(this, _events)[event] || [];
      const cb = (...args) => callback.call(this, ...args);
      __privateGet(this, _events)[event].push(cb);
      return () => {
        __privateGet(this, _events)[event] = __privateGet(this, _events)[event].filter(
          /** @param {any} fn */
          (fn) => fn !== cb
        );
      };
    }
    $destroy() {
      __privateGet(this, _instance).$destroy();
    }
  }
  _events = new WeakMap();
  _instance = new WeakMap();
  let SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      /**
       * @param {*} $$componentCtor
       * @param {*} $$slots
       * @param {*} use_shadow_dom
       */
      constructor($$componentCtor, $$slots, use_shadow_dom) {
        super();
        /** The Svelte component constructor */
        __publicField(this, "$$ctor");
        /** Slots */
        __publicField(this, "$$s");
        /** @type {any} The Svelte component instance */
        __publicField(this, "$$c");
        /** Whether or not the custom element is connected */
        __publicField(this, "$$cn", false);
        /** @type {Record<string, any>} Component props data */
        __publicField(this, "$$d", {});
        /** `true` if currently in the process of reflecting component props back to attributes */
        __publicField(this, "$$r", false);
        /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
        __publicField(this, "$$p_d", {});
        /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
        __publicField(this, "$$l", {});
        /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
        __publicField(this, "$$l_u", /* @__PURE__ */ new Map());
        /** @type {any} The managed render effect for reflecting attributes */
        __publicField(this, "$$me");
        this.$$ctor = $$componentCtor;
        this.$$s = $$slots;
        if (use_shadow_dom) {
          this.attachShadow({ mode: "open" });
        }
      }
      /**
       * @param {string} type
       * @param {EventListenerOrEventListenerObject} listener
       * @param {boolean | AddEventListenerOptions} [options]
       */
      addEventListener(type, listener, options) {
        this.$$l[type] = this.$$l[type] || [];
        this.$$l[type].push(listener);
        if (this.$$c) {
          const unsub = this.$$c.$on(type, listener);
          this.$$l_u.set(listener, unsub);
        }
        super.addEventListener(type, listener, options);
      }
      /**
       * @param {string} type
       * @param {EventListenerOrEventListenerObject} listener
       * @param {boolean | AddEventListenerOptions} [options]
       */
      removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
        if (this.$$c) {
          const unsub = this.$$l_u.get(listener);
          if (unsub) {
            unsub();
            this.$$l_u.delete(listener);
          }
        }
      }
      async connectedCallback() {
        this.$$cn = true;
        if (!this.$$c) {
          let create_slot2 = function(name) {
            return (anchor) => {
              const slot = document.createElement("slot");
              if (name !== "default") slot.name = name;
              append(anchor, slot);
            };
          };
          await Promise.resolve();
          if (!this.$$cn || this.$$c) {
            return;
          }
          const $$slots = {};
          const existing_slots = get_custom_elements_slots(this);
          for (const name of this.$$s) {
            if (name in existing_slots) {
              if (name === "default" && !this.$$d.children) {
                this.$$d.children = create_slot2(name);
                $$slots.default = true;
              } else {
                $$slots[name] = create_slot2(name);
              }
            }
          }
          for (const attribute of this.attributes) {
            const name = this.$$g_p(attribute.name);
            if (!(name in this.$$d)) {
              this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
            }
          }
          for (const key in this.$$p_d) {
            if (!(key in this.$$d) && this[key] !== void 0) {
              this.$$d[key] = this[key];
              delete this[key];
            }
          }
          this.$$c = createClassComponent({
            component: this.$$ctor,
            target: this.shadowRoot || this,
            props: {
              ...this.$$d,
              $$slots,
              $$host: this
            }
          });
          this.$$me = effect_root(() => {
            render_effect(() => {
              var _a;
              this.$$r = true;
              for (const key of object_keys(this.$$c)) {
                if (!((_a = this.$$p_d[key]) == null ? void 0 : _a.reflect)) continue;
                this.$$d[key] = this.$$c[key];
                const attribute_value = get_custom_element_value(
                  key,
                  this.$$d[key],
                  this.$$p_d,
                  "toAttribute"
                );
                if (attribute_value == null) {
                  this.removeAttribute(this.$$p_d[key].attribute || key);
                } else {
                  this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
                }
              }
              this.$$r = false;
            });
          });
          for (const type in this.$$l) {
            for (const listener of this.$$l[type]) {
              const unsub = this.$$c.$on(type, listener);
              this.$$l_u.set(listener, unsub);
            }
          }
          this.$$l = {};
        }
      }
      // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
      // and setting attributes through setAttribute etc, this is helpful
      /**
       * @param {string} attr
       * @param {string} _oldValue
       * @param {string} newValue
       */
      attributeChangedCallback(attr, _oldValue, newValue) {
        var _a;
        if (this.$$r) return;
        attr = this.$$g_p(attr);
        this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, "toProp");
        (_a = this.$$c) == null ? void 0 : _a.$set({ [attr]: this.$$d[attr] });
      }
      disconnectedCallback() {
        this.$$cn = false;
        Promise.resolve().then(() => {
          if (!this.$$cn && this.$$c) {
            this.$$c.$destroy();
            this.$$me();
            this.$$c = void 0;
          }
        });
      }
      /**
       * @param {string} attribute_name
       */
      $$g_p(attribute_name) {
        return object_keys(this.$$p_d).find(
          (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
        ) || attribute_name;
      }
    };
  }
  function get_custom_element_value(prop2, value, props_definition, transform) {
    var _a;
    const type = (_a = props_definition[prop2]) == null ? void 0 : _a.type;
    value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
    if (!transform || !props_definition[prop2]) {
      return value;
    } else if (transform === "toAttribute") {
      switch (type) {
        case "Object":
        case "Array":
          return value == null ? null : JSON.stringify(value);
        case "Boolean":
          return value ? "" : null;
        case "Number":
          return value == null ? null : value;
        default:
          return value;
      }
    } else {
      switch (type) {
        case "Object":
        case "Array":
          return value && JSON.parse(value);
        case "Boolean":
          return value;
        case "Number":
          return value != null ? +value : value;
        default:
          return value;
      }
    }
  }
  function get_custom_elements_slots(element) {
    const result = {};
    element.childNodes.forEach((node) => {
      result[
        /** @type {Element} node */
        node.slot || "default"
      ] = true;
    });
    return result;
  }
  function create_custom_element(Component, props_definition, slots, exports, use_shadow_dom, extend) {
    let Class = class extends SvelteElement {
      constructor() {
        super(Component, slots, use_shadow_dom);
        this.$$p_d = props_definition;
      }
      static get observedAttributes() {
        return object_keys(props_definition).map(
          (key) => (props_definition[key].attribute || key).toLowerCase()
        );
      }
    };
    object_keys(props_definition).forEach((prop2) => {
      define_property(Class.prototype, prop2, {
        get() {
          return this.$$c && prop2 in this.$$c ? this.$$c[prop2] : this.$$d[prop2];
        },
        set(value) {
          var _a;
          value = get_custom_element_value(prop2, value, props_definition);
          this.$$d[prop2] = value;
          var component = this.$$c;
          if (component) {
            var setter = (_a = get_descriptor(component, prop2)) == null ? void 0 : _a.get;
            if (setter) {
              component[prop2] = value;
            } else {
              component.$set({ [prop2]: value });
            }
          }
        }
      });
    });
    exports.forEach((property) => {
      define_property(Class.prototype, property, {
        get() {
          var _a;
          return (_a = this.$$c) == null ? void 0 : _a[property];
        }
      });
    });
    Component.element = /** @type {any} */
    Class;
    return Class;
  }
  var root_1 = /* @__PURE__ */ template(`<div class="content-section svelte-dm4y8d"> </div>`);
  var root$1 = /* @__PURE__ */ template(`<div></div>`);
  const $$css$1 = {
    hash: "svelte-dm4y8d",
    code: "\n  .content-section.svelte-dm4y8d {\n    margin: 2em 0;\n  }\n"
  };
  function FormattedContent($$anchor, $$props) {
    push($$props, true);
    append_styles($$anchor, $$css$1);
    let content = prop($$props, "content", 7);
    let sections = /* @__PURE__ */ derived(() => {
      var _a;
      return ((_a = content()) == null ? void 0 : _a.split(/\n/g)) || [];
    });
    var div = root$1();
    each(div, 21, () => get(sections), index, ($$anchor2, section) => {
      var div_1 = root_1();
      var text = child(div_1, true);
      reset(div_1);
      template_effect(() => set_text(text, get(section)));
      append($$anchor2, div_1);
    });
    reset(div);
    append($$anchor, div);
    return pop({
      get content() {
        return content();
      },
      set content($$value) {
        content($$value);
        flush_sync();
      }
    });
  }
  create_custom_element(FormattedContent, { content: {} }, [], [], true);
  const lessonContentTag = "plain-text-lesson-content";
  var root = /* @__PURE__ */ template(`<div><div class="plain-text-lesson-content svelte-1vevapp"><!></div> <div class="loading-indicator svelte-1vevapp">Loading</div></div>`);
  const $$css = {
    hash: "svelte-1vevapp",
    code: "\n  .plain-text-lesson-content.svelte-1vevapp {\n    padding: 0 2em;\n    font-weight: 400;\n  }\n\n  .loading.svelte-1vevapp .plain-text-lesson-content:where(.svelte-1vevapp) {\n    display: none;\n  }\n\n  .loading-indicator.svelte-1vevapp {\n    display: none;\n  }\n\n  .loading.svelte-1vevapp .loading-indicator:where(.svelte-1vevapp) {\n    display: block\n  }\n"
  };
  function LessonContent($$anchor, $$props) {
    push($$props, true);
    append_styles($$anchor, $$css);
    let characterSet = prop($$props, "characterSet", 7), loading = prop($$props, "loading", 7), traditional = prop($$props, "traditional", 7), simplified = prop($$props, "simplified", 7);
    let content = /* @__PURE__ */ derived(() => characterSet() === "simplified" ? simplified() : traditional());
    var div = root();
    var div_1 = child(div);
    var node = child(div_1);
    FormattedContent(node, {
      get content() {
        return get(content);
      }
    });
    reset(div_1);
    next(2);
    reset(div);
    template_effect(() => set_class(div, `${(loading() ? "loading" : "") ?? ""} svelte-1vevapp`));
    append($$anchor, div);
    return pop({
      get characterSet() {
        return characterSet();
      },
      set characterSet($$value) {
        characterSet($$value);
        flush_sync();
      },
      get loading() {
        return loading();
      },
      set loading($$value) {
        loading($$value);
        flush_sync();
      },
      get traditional() {
        return traditional();
      },
      set traditional($$value) {
        traditional($$value);
        flush_sync();
      },
      get simplified() {
        return simplified();
      },
      set simplified($$value) {
        simplified($$value);
        flush_sync();
      }
    });
  }
  customElements.define("plain-text-lesson-content", create_custom_element(
    LessonContent,
    {
      characterSet: {},
      loading: {},
      traditional: {},
      simplified: {}
    },
    [],
    [],
    false
  ));
  function lessonContentFactory(props) {
    const baseElement = document.createElement(lessonContentTag);
    const element = Object.assign(
      baseElement,
      props
    );
    return element;
  }
  var CharSet = /* @__PURE__ */ ((CharSet2) => {
    CharSet2["simplified"] = "simplified";
    CharSet2["traditional"] = "traditional";
    return CharSet2;
  })(CharSet || {});
  async function getCourseNavigation() {
    const element = await getBySelector(".course-navigation");
    return { element };
  }
  async function getLessonContainer() {
    const element = await getBySelector("#du-lesson-container");
    return { element };
  }
  async function getLessonContent() {
    const element = await getBySelector(".lesson-content");
    const plainTextLessonContent = lessonContentFactory({
      characterSet: CharSet.traditional,
      simplified: "",
      traditional: "",
      loading: true
    });
    const lessonContent = {
      element,
      plainTextLessonContent
    };
    return lessonContent;
  }
  async function getLessonTextContent(lessonContent, previous) {
    const textContent = await waitFor(() => {
      const canvasEls = [...lessonContent.element.querySelectorAll("canvas")];
      const content = canvasEls.map((el) => el.textContent || "").join("").trim();
      const hasChanged = content !== previous;
      if (content.includes("Loading") || !hasChanged) {
        return "";
      }
      return content;
    });
    return textContent;
  }
  async function getLessonFooter() {
    const element = await getBySelector(".du-lesson-footer");
    return { element };
  }
  async function getPageFooter() {
    const element = await getBySelector(".du-footer-fixed-bottom");
    const characterSetToggleEl = element.querySelectorAll(".du-button-charset")[0];
    const characterSetToggle = { element: characterSetToggleEl };
    return { characterSetToggle, element };
  }
  async function getLessonElements() {
    const [
      courseNavigation,
      lessonContainer,
      lessonContent,
      lessonFooter,
      pageFooter
    ] = await Promise.all([
      getCourseNavigation(),
      getLessonContainer(),
      getLessonContent(),
      getLessonFooter(),
      getPageFooter()
    ]);
    const lessonElements = {
      courseNavigation,
      lessonContainer,
      lessonContent,
      lessonFooter,
      pageFooter
    };
    return lessonElements;
  }
  async function getSelectedCharSet(pageFooter) {
    const simplifiedIndicatorMatches = pageFooter.characterSetToggle.element.getElementsByClassName(
      "du-button-charset-sc"
    );
    return simplifiedIndicatorMatches.length ? CharSet.simplified : CharSet.traditional;
  }
  async function applyPlainTextUI(lessonElements) {
    var _a;
    const characterSet = await getSelectedCharSet(lessonElements.pageFooter);
    lessonElements.lessonContent.plainTextLessonContent.characterSet = characterSet;
    onCharSetChange((e) => {
      lessonElements.lessonContent.plainTextLessonContent.characterSet = e.charSet;
    }, lessonElements.pageFooter);
    (_a = lessonElements.lessonContent.element.parentElement) == null ? void 0 : _a.replaceChild(
      lessonElements.lessonContent.plainTextLessonContent,
      lessonElements.lessonContent.element
    );
  }
  async function onCharSetChange(fn, pageFooter) {
    pageFooter.characterSetToggle.element.addEventListener("click", async () => {
      const selectedCharSet = await getSelectedCharSet(pageFooter);
      fn({ charSet: selectedCharSet });
    });
  }
  async function onClassChange(element, callback) {
    const observer = new MutationObserver((mutations) => {
      const firstMutation = mutations[0];
      const previousClassName = (firstMutation == null ? void 0 : firstMutation.oldValue) || "";
      const nextClassName = element.className;
      callback(previousClassName, nextClassName);
    });
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true
    });
  }
  let migakuClasses = [];
  async function manageMigakuBodyClasses() {
    const body = await getBySelector("body");
    onClassChange(body, (prevClass, nextClass) => {
      new Set(
        prevClass.split(/\s+/).filter((value) => value)
      );
      const nextClassNames = new Set(
        nextClass.split(/\s+/).filter((value) => value)
      );
      if (nextClassNames.has(
        "-mgk-branch"
        /* BRANCH */
      )) {
        migakuClasses = [...nextClassNames].filter(
          (className) => className.startsWith("-mgk")
        );
      } else {
        [...migakuClasses].forEach((className) => {
          body.classList.add(className);
        });
      }
    });
  }
  function separateCharacterTypes(content) {
    const half = Math.floor(content.length / 2);
    const simplified = content.substring(0, half).trim();
    const traditional = content.substring(half + 1).trim();
    return { simplified, traditional };
  }
  class Store {
    constructor(defaultState) {
      __publicField(this, "eventTarget");
      __publicField(this, "state");
      this.state = defaultState;
      this.eventTarget = new EventTarget();
      this.eventTarget.addEventListener("setstate", (event) => {
        const updatedState = event.detail.callback(this.state);
        this.modifyState(updatedState);
      });
    }
    getState() {
      return this.state;
    }
    onStateChange(callback) {
      this.eventTarget.addEventListener("statechange", (e) => {
        const event = e;
        callback(event);
      });
    }
    setState(callback) {
      const event = new CustomEvent("setstate", {
        detail: { callback }
      });
      this.eventTarget.dispatchEvent(event);
    }
    modifyState(state) {
      const event = new CustomEvent(
        "statechange",
        {
          detail: { previous: this.state, state }
        }
      );
      this.state = state;
      this.eventTarget.dispatchEvent(event);
    }
  }
  const initialState = {
    characterSet: CharSet.traditional,
    loading: true,
    mounted: false,
    textContent: ""
  };
  async function getReferences() {
    const lessonElements = await getLessonElements();
    return { lessonElements };
  }
  async function intialize() {
    const internal = {
      async mount() {
        if (this.mounted() || this.references) {
          return;
        }
        this.references = await getReferences();
        onCharSetChange(({ charSet }) => {
          this.store.setState((state) => ({ ...state, charSet }));
        }, this.references.lessonElements.pageFooter);
        await applyPlainTextUI(this.references.lessonElements);
        this.store.setState((state) => ({ ...state, mounted: true }));
        await this.refresh();
      },
      mounted() {
        return this.store.getState().mounted;
      },
      references: null,
      async refresh() {
        if (this.mounted() && this.references) {
          this.store.setState((state) => ({ ...state, loading: true }));
          const textContent = await getLessonTextContent(
            this.references.lessonElements.lessonContent,
            this.store.getState().textContent
          );
          this.store.setState((state) => ({
            ...state,
            loading: false,
            textContent
          }));
        }
      },
      store: new Store(initialState),
      async unmount() {
        this.store.setState(() => {
          this.references = null;
          return initialState;
        });
      }
    };
    internal.store.onStateChange((event) => {
      const { previous, state } = event.detail;
      if (!state.mounted || !internal.references) return;
      if (previous.characterSet !== state.characterSet) {
        internal.references.lessonElements.lessonContent.plainTextLessonContent.characterSet = state.characterSet;
      }
      if (previous.textContent !== state.textContent) {
        const { simplified, traditional } = separateCharacterTypes(
          state.textContent
        );
        internal.references.lessonElements.lessonContent.plainTextLessonContent.simplified = simplified;
        internal.references.lessonElements.lessonContent.plainTextLessonContent.traditional = traditional;
      }
      if (previous.loading !== state.loading) {
        internal.references.lessonElements.lessonContent.plainTextLessonContent.loading = state.loading;
      }
    });
    return {
      mount: internal.mount.bind(internal),
      mounted: internal.mounted.bind(internal),
      refresh: internal.refresh.bind(internal),
      unmount: internal.unmount.bind(internal)
    };
  }
  function isLessonPage(url) {
    try {
      const urlInst = new URL(url);
      const isLessonsPath = /^\/lessons\//.test(urlInst.pathname);
      const isChapter = urlInst.searchParams.has("chapter");
      const isCourse = urlInst.searchParams.has("from");
      return isLessonsPath && (isChapter || isCourse);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async function main() {
    let currentUrl = "";
    const { mount: mount2, mounted, refresh, unmount: unmount2 } = await intialize();
    async function handleNavigate(url) {
      const isDupeNavigation = currentUrl === url;
      const toLessonPage = isLessonPage(url);
      if (isDupeNavigation) {
        return;
      }
      currentUrl = url;
      if (mounted() && toLessonPage) {
        await refresh();
      } else if (mounted() && !toLessonPage) {
        await unmount2();
      } else if (!mounted() && toLessonPage) {
        await mount2();
      }
    }
    function handleNavigateEvent(e) {
      return handleNavigate(e.destination.url);
    }
    window.addEventListener("popstate", handleNavigateEvent);
    navigation.addEventListener("navigate", handleNavigateEvent);
    manageMigakuBodyClasses();
  }
  main();

})();