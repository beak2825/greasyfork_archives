// ==UserScript==
// @name         Bilibili Music Extractor
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  从B站上提取带封面的音乐
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/festival/*
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js
// @require      https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/extras/named-register.min.js
// @require      data:application/javascript,%3B(typeof%20System!%3D'undefined')%26%26(System%3Dnew%20System.constructor())%3B
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426128/Bilibili%20Music%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/426128/Bilibili%20Music%20Extractor.meta.js
// ==/UserScript==


System.register("./__entry.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

      importCSS(" .ActionButton.svelte-j4psvl{background:none;background-color:transparent;color:var(--bme-color-dark-text);border:var(--bme-border-width-medium) solid var(--bme-color-primary);cursor:pointer;text-align:center;padding:var(--bme-spacing-xsmall) var(--bme-spacing-small);transition:all .25s ease;box-sizing:border-box}.ActionButton--primary.svelte-j4psvl{border-color:transparent;background-color:var(--bme-color-primary);color:var(--bme-color-light-text)}.ActionButton--secondary.svelte-j4psvl{border-color:transparent;background-color:var(--bme-color-secondary);color:var(--bme-color-light-text)}.ActionButton.svelte-j4psvl:hover{filter:brightness(110%)}.ActionButton.svelte-j4psvl:active{filter:brightness(90%)}.ActionButton.svelte-j4psvl:disabled{background-color:var(--bme-color-disabled);cursor:not-allowed;filter:none;color:var(--bme-color-dark-text)}.AudioRangeSelector.svelte-xbq2f9{position:absolute;top:0;bottom:0;left:var(--bme-spacing-medium);right:var(--bme-spacing-medium);box-sizing:border-box}.AudioRangeSelector__PlayContainer.svelte-xbq2f9{position:absolute;top:var(--bme-spacing-xsmall)}.AudioRangeSelector__Handle.svelte-xbq2f9{position:absolute;top:0;bottom:var(--bme-spacing-medium);width:2px;border-radius:var(--bme-border-radius-small);background-color:var(--bme-color-inactive);cursor:grab}.AudioRangeSelector__PlayHandle.svelte-xbq2f9{background-color:var(--bme-color-secondary);z-index:10}.AudioRangeSelector__Handle.svelte-xbq2f9:active{cursor:grabbing}.AudioRangeSelector__SelectedRange.svelte-xbq2f9{position:absolute;top:0;bottom:var(--bme-spacing-medium);background-color:var(--bme-color-inactive);opacity:.25;pointer-events:none}.AudioRangeSelector__HandleValue.svelte-xbq2f9{position:absolute;width:var(--bme-spacing-xlarge);top:calc(100% - var(--bme-spacing-medium));box-sizing:border-box;text-align:center;transition:top .1s ease;background:none;border:solid var(--bme-border-width-small) var(--bme-color-inactive);background-color:#ffffffb3}.AudioWaveform.svelte-ib2xuc{display:flex;align-items:center;justify-content:space-evenly;overflow:hidden;width:100%;height:100%;box-sizing:border-box;position:relative}.AudioWaveform__Sample.svelte-ib2xuc{width:0px;flex-shrink:0;border-radius:1px;border:1px solid var(--bme-color-primary);background-color:var(--bme-color-primary)}.AudioWaveform__MiddleLine.svelte-ib2xuc{position:absolute;top:50%;left:0;right:0;height:1px;background-color:var(--bme-color-primary);opacity:.25;z-index:-1}.Container.svelte-1fap42e{position:absolute;top:0;left:calc(var(--bme-spacing-large) * -1);transition:all .25s ease;width:var(--bme-spacing-large);height:var(--bme-spacing-large);border-radius:var(--bme-border-radius-large);opacity:.5;z-index:var(--bme-z-index);overflow:hidden}.Container.svelte-1fap42e:hover{opacity:1}.Container--open.svelte-1fap42e{width:40rem;height:auto;background-color:#fff;box-shadow:0 0 6px #dcdcdc;opacity:1}.Container--dragging.svelte-1fap42e{transition:none;cursor:grabbing}.Cover.svelte-1470o3e{width:100%;margin-bottom:var(--bme-spacing-small)}.Cover__title.svelte-1470o3e{line-height:1.5;margin:0 var(--bme-spacing-small);padding:0;color:var(--bme-color-primary)}.Cover__image.svelte-1470o3e{width:100%;object-fit:contain}.icon.svelte-vtxwtm{flex-shrink:0}.Header.svelte-zne36e{display:flex;align-items:center;justify-content:space-between}.icon-button.svelte-zne36e{background:none;border:0;cursor:pointer}.drag-handle.svelte-zne36e{cursor:grab}.drag-handle.svelte-zne36e:active{cursor:grabbing}.InfoItem.svelte-1qbx53k{width:100%;margin-bottom:var(--bme-spacing-small);display:grid;grid-template-columns:3rem 1fr;align-items:center;flex-wrap:nowrap;gap:var(--bme-spacing-xsmall);padding:0 var(--bme-spacing-small);box-sizing:border-box}.InfoItem__title.svelte-1qbx53k{box-sizing:border-box;display:inline}.InfoItem__input.svelte-1qbx53k{flex:1;background:none;border:0;border-bottom:solid 1px var(--bme-color-primary);padding:var(--bme-spacing-xsmall)}.Step.svelte-1nopq0p{display:flex;align-items:stretch;width:100%;height:100%;gap:var(--bme-spacing-small)}.Step__Content.svelte-1nopq0p{flex:1}.StepsContainer.svelte-2ce4eo{box-sizing:border-box;width:100%;overflow:hidden;display:flex;flex-wrap:nowrap}.StepContainer__StepContent.svelte-2ce4eo{position:relative;flex-basis:100%;flex-shrink:0;transition:left .25s ease}.ActionsContainer.svelte-1n46o8q{height:100%;display:flex;flex-direction:column;align-items:stretch;gap:var(--bme-spacing-xsmall);padding:0 var(--bme-spacing-small) var(--bme-spacing-small) 0;flex-wrap:nowrap;overflow:auto;box-sizing:border-box}.ActionsContainer__MainAction.svelte-1n46o8q{flex:1;display:flex;align-items:stretch}.ActionsError.svelte-1n46o8q{flex:1;color:var(--bme-color-error)}.AudioWaveformContainer.svelte-1n46o8q{width:100%;height:calc(100% - var(--bme-spacing-small));padding:0 var(--bme-spacing-medium) var(--bme-spacing-medium) var(--bme-spacing-medium);overflow:hidden;box-sizing:border-box;position:relative} ");

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
      const noop = () => {
      };
      function run_all(arr) {
        for (var i = 0; i < arr.length; i++) {
          arr[i]();
        }
      }
      function deferred() {
        var resolve;
        var reject;
        var promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
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
      const INSPECT_EFFECT = 1 << 17;
      const HEAD_EFFECT = 1 << 18;
      const EFFECT_PRESERVED = 1 << 19;
      const USER_EFFECT = 1 << 20;
      const REACTION_IS_UPDATING = 1 << 21;
      const ASYNC = 1 << 22;
      const ERROR_VALUE = 1 << 23;
      const STATE_SYMBOL = Symbol("$state");
      const LEGACY_PROPS = Symbol("legacy props");
      const LOADING_ATTR_SYMBOL = Symbol("");
      const STALE_REACTION = new class StaleReactionError extends Error {
        name = "StaleReactionError";
        message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
      }();
      function async_derived_orphan() {
        {
          throw new Error(`https://svelte.dev/e/async_derived_orphan`);
        }
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
      function props_invalid_value(key) {
        {
          throw new Error(`https://svelte.dev/e/props_invalid_value`);
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
      function svelte_boundary_reset_onerror() {
        {
          throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
        }
      }
      const EACH_ITEM_REACTIVE = 1;
      const EACH_INDEX_REACTIVE = 1 << 1;
      const EACH_IS_CONTROLLED = 1 << 2;
      const EACH_IS_ANIMATED = 1 << 3;
      const EACH_ITEM_IMMUTABLE = 1 << 4;
      const PROPS_IS_IMMUTABLE = 1;
      const PROPS_IS_UPDATED = 1 << 2;
      const PROPS_IS_BINDABLE = 1 << 3;
      const PROPS_IS_LAZY_INITIAL = 1 << 4;
      const TEMPLATE_FRAGMENT = 1;
      const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
      const UNINITIALIZED = Symbol();
      const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
      const ATTACHMENT_KEY = "@attach";
      function svelte_boundary_reset_noop() {
        {
          console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
        }
      }
      let hydrating = false;
      function equals(value) {
        return value === this.v;
      }
      function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
      }
      function safe_equals(value) {
        return !safe_not_equal(value, this.v);
      }
      let tracing_mode_flag = false;
      let component_context = null;
      function set_component_context(context) {
        component_context = context;
      }
      function push(props, runes = false, fn) {
        component_context = {
          p: component_context,
          c: null,
          e: null,
          s: props,
          x: null,
          l: null
        };
      }
      function pop(component) {
        var context = (
component_context
        );
        var effects = context.e;
        if (effects !== null) {
          context.e = null;
          for (var fn of effects) {
            create_user_effect(fn);
          }
        }
        component_context = context.p;
        return (
{}
        );
      }
      function is_runes() {
        return true;
      }
      let micro_tasks = [];
      let idle_tasks = [];
      function run_micro_tasks() {
        var tasks = micro_tasks;
        micro_tasks = [];
        run_all(tasks);
      }
      function run_idle_tasks() {
        var tasks = idle_tasks;
        idle_tasks = [];
        run_all(tasks);
      }
      function has_pending_tasks() {
        return micro_tasks.length > 0 || idle_tasks.length > 0;
      }
      function queue_micro_task(fn) {
        if (micro_tasks.length === 0 && !is_flushing_sync) {
          var tasks = micro_tasks;
          queueMicrotask(() => {
            if (tasks === micro_tasks) run_micro_tasks();
          });
        }
        micro_tasks.push(fn);
      }
      function flush_tasks() {
        if (micro_tasks.length > 0) {
          run_micro_tasks();
        }
        if (idle_tasks.length > 0) {
          run_idle_tasks();
        }
      }
      const adjustments = new WeakMap();
      function handle_error(error) {
        var effect2 = active_effect;
        if (effect2 === null) {
          active_reaction.f |= ERROR_VALUE;
          return error;
        }
        if ((effect2.f & EFFECT_RAN) === 0) {
          if ((effect2.f & BOUNDARY_EFFECT) === 0) {
            if (!effect2.parent && error instanceof Error) {
              apply_adjustments(error);
            }
            throw error;
          }
          effect2.b.error(error);
        } else {
          invoke_error_boundary(error, effect2);
        }
      }
      function invoke_error_boundary(error, effect2) {
        while (effect2 !== null) {
          if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
            try {
              effect2.b.error(error);
              return;
            } catch (e) {
              error = e;
            }
          }
          effect2 = effect2.parent;
        }
        if (error instanceof Error) {
          apply_adjustments(error);
        }
        throw error;
      }
      function apply_adjustments(error) {
        const adjusted = adjustments.get(error);
        if (adjusted) {
          define_property(error, "message", {
            value: adjusted.message
          });
          define_property(error, "stack", {
            value: adjusted.stack
          });
        }
      }
      const batches = new Set();
      let current_batch = null;
      let previous_batch = null;
      let effect_pending_updates = new Set();
      let queued_root_effects = [];
      let last_scheduled_effect = null;
      let is_flushing = false;
      let is_flushing_sync = false;
      class Batch {
current = new Map();
#previous = new Map();
#callbacks = new Set();
#pending = 0;
#deferred = null;
#neutered = false;
#async_effects = [];
#boundary_async_effects = [];
#render_effects = [];
#effects = [];
#block_effects = [];
#dirty_effects = [];
#maybe_dirty_effects = [];
skipped_effects = new Set();
process(root_effects) {
          queued_root_effects = [];
          previous_batch = null;
          for (const root2 of root_effects) {
            this.#traverse_effect_tree(root2);
          }
          if (this.#async_effects.length === 0 && this.#pending === 0) {
            this.#commit();
            var render_effects = this.#render_effects;
            var effects = this.#effects;
            this.#render_effects = [];
            this.#effects = [];
            this.#block_effects = [];
            previous_batch = current_batch;
            current_batch = null;
            flush_queued_effects(render_effects);
            flush_queued_effects(effects);
            if (current_batch === null) {
              current_batch = this;
            } else {
              batches.delete(this);
            }
            this.#deferred?.resolve();
          } else {
            this.#defer_effects(this.#render_effects);
            this.#defer_effects(this.#effects);
            this.#defer_effects(this.#block_effects);
          }
          for (const effect2 of this.#async_effects) {
            update_effect(effect2);
          }
          for (const effect2 of this.#boundary_async_effects) {
            update_effect(effect2);
          }
          this.#async_effects = [];
          this.#boundary_async_effects = [];
        }
#traverse_effect_tree(root2) {
          root2.f ^= CLEAN;
          var effect2 = root2.first;
          while (effect2 !== null) {
            var flags2 = effect2.f;
            var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
            var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
            var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.skipped_effects.has(effect2);
            if (!skip && effect2.fn !== null) {
              if (is_branch) {
                effect2.f ^= CLEAN;
              } else if ((flags2 & EFFECT) !== 0) {
                this.#effects.push(effect2);
              } else if ((flags2 & CLEAN) === 0) {
                if ((flags2 & ASYNC) !== 0) {
                  var effects = effect2.b?.is_pending() ? this.#boundary_async_effects : this.#async_effects;
                  effects.push(effect2);
                } else if (is_dirty(effect2)) {
                  if ((effect2.f & BLOCK_EFFECT) !== 0) this.#block_effects.push(effect2);
                  update_effect(effect2);
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
        }
#defer_effects(effects) {
          for (const e of effects) {
            const target = (e.f & DIRTY) !== 0 ? this.#dirty_effects : this.#maybe_dirty_effects;
            target.push(e);
            set_signal_status(e, CLEAN);
          }
          effects.length = 0;
        }
capture(source2, value) {
          if (!this.#previous.has(source2)) {
            this.#previous.set(source2, value);
          }
          this.current.set(source2, source2.v);
        }
        activate() {
          current_batch = this;
        }
        deactivate() {
          current_batch = null;
          previous_batch = null;
          for (const update of effect_pending_updates) {
            effect_pending_updates.delete(update);
            update();
            if (current_batch !== null) {
              break;
            }
          }
        }
        neuter() {
          this.#neutered = true;
        }
        flush() {
          if (queued_root_effects.length > 0) {
            flush_effects();
          } else {
            this.#commit();
          }
          if (current_batch !== this) {
            return;
          }
          if (this.#pending === 0) {
            batches.delete(this);
          }
          this.deactivate();
        }
#commit() {
          if (!this.#neutered) {
            for (const fn of this.#callbacks) {
              fn();
            }
          }
          this.#callbacks.clear();
        }
        increment() {
          this.#pending += 1;
        }
        decrement() {
          this.#pending -= 1;
          if (this.#pending === 0) {
            for (const e of this.#dirty_effects) {
              set_signal_status(e, DIRTY);
              schedule_effect(e);
            }
            for (const e of this.#maybe_dirty_effects) {
              set_signal_status(e, MAYBE_DIRTY);
              schedule_effect(e);
            }
            this.#render_effects = [];
            this.#effects = [];
            this.flush();
          } else {
            this.deactivate();
          }
        }
add_callback(fn) {
          this.#callbacks.add(fn);
        }
        settled() {
          return (this.#deferred ??= deferred()).promise;
        }
        static ensure() {
          if (current_batch === null) {
            const batch = current_batch = new Batch();
            batches.add(current_batch);
            if (!is_flushing_sync) {
              Batch.enqueue(() => {
                if (current_batch !== batch) {
                  return;
                }
                batch.flush();
              });
            }
          }
          return current_batch;
        }
static enqueue(task) {
          queue_micro_task(task);
        }
      }
      function flushSync(fn) {
        var was_flushing_sync = is_flushing_sync;
        is_flushing_sync = true;
        try {
          var result;
          if (fn) ;
          while (true) {
            flush_tasks();
            if (queued_root_effects.length === 0 && !has_pending_tasks()) {
              current_batch?.flush();
              if (queued_root_effects.length === 0) {
                last_scheduled_effect = null;
                return (
result
                );
              }
            }
            flush_effects();
          }
        } finally {
          is_flushing_sync = was_flushing_sync;
        }
      }
      function flush_effects() {
        var was_updating_effect = is_updating_effect;
        is_flushing = true;
        try {
          var flush_count = 0;
          set_is_updating_effect(true);
          while (queued_root_effects.length > 0) {
            var batch = Batch.ensure();
            if (flush_count++ > 1e3) {
              var updates, entry;
              if (DEV) ;
              infinite_loop_guard();
            }
            batch.process(queued_root_effects);
            old_values.clear();
          }
        } finally {
          is_flushing = false;
          set_is_updating_effect(was_updating_effect);
          last_scheduled_effect = null;
        }
      }
      function infinite_loop_guard() {
        try {
          effect_update_depth_exceeded();
        } catch (error) {
          invoke_error_boundary(error, last_scheduled_effect);
        }
      }
      let eager_block_effects = null;
      function flush_queued_effects(effects) {
        var length = effects.length;
        if (length === 0) return;
        var i = 0;
        while (i < length) {
          var effect2 = effects[i++];
          if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
            eager_block_effects = [];
            update_effect(effect2);
            if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
              if (effect2.teardown === null && effect2.ac === null) {
                unlink_effect(effect2);
              } else {
                effect2.fn = null;
              }
            }
            if (eager_block_effects?.length > 0) {
              old_values.clear();
              for (const e of eager_block_effects) {
                update_effect(e);
              }
              eager_block_effects = [];
            }
          }
        }
        eager_block_effects = null;
      }
      function schedule_effect(signal) {
        var effect2 = last_scheduled_effect = signal;
        while (effect2.parent !== null) {
          effect2 = effect2.parent;
          var flags2 = effect2.f;
          if (is_flushing && effect2 === active_effect && (flags2 & BLOCK_EFFECT) !== 0) {
            return;
          }
          if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
            if ((flags2 & CLEAN) === 0) return;
            effect2.f ^= CLEAN;
          }
        }
        queued_root_effects.push(effect2);
      }
      function createSubscriber(start) {
        let subscribers = 0;
        let version = source(0);
        let stop;
        return () => {
          if (effect_tracking()) {
            get(version);
            render_effect(() => {
              if (subscribers === 0) {
                stop = untrack(() => start(() => increment(version)));
              }
              subscribers += 1;
              return () => {
                queue_micro_task(() => {
                  subscribers -= 1;
                  if (subscribers === 0) {
                    stop?.();
                    stop = void 0;
                    increment(version);
                  }
                });
              };
            });
          }
        };
      }
      var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED | BOUNDARY_EFFECT;
      function boundary(node, props, children) {
        new Boundary(node, props, children);
      }
      class Boundary {
parent;
        #pending = false;
#anchor;
#hydrate_open = null;
#props;
#children;
#effect;
#main_effect = null;
#pending_effect = null;
#failed_effect = null;
#offscreen_fragment = null;
        #local_pending_count = 0;
        #pending_count = 0;
        #is_creating_fallback = false;
#effect_pending = null;
        #effect_pending_update = () => {
          if (this.#effect_pending) {
            internal_set(this.#effect_pending, this.#local_pending_count);
          }
        };
        #effect_pending_subscriber = createSubscriber(() => {
          this.#effect_pending = source(this.#local_pending_count);
          return () => {
            this.#effect_pending = null;
          };
        });
constructor(node, props, children) {
          this.#anchor = node;
          this.#props = props;
          this.#children = children;
          this.parent =
active_effect.b;
          this.#pending = !!this.#props.pending;
          this.#effect = block(() => {
            active_effect.b = this;
            {
              try {
                this.#main_effect = branch(() => children(this.#anchor));
              } catch (error) {
                this.error(error);
              }
              if (this.#pending_count > 0) {
                this.#show_pending_snippet();
              } else {
                this.#pending = false;
              }
            }
          }, flags);
        }
        #hydrate_resolved_content() {
          try {
            this.#main_effect = branch(() => this.#children(this.#anchor));
          } catch (error) {
            this.error(error);
          }
          this.#pending = false;
        }
        #hydrate_pending_content() {
          const pending = this.#props.pending;
          if (!pending) {
            return;
          }
          this.#pending_effect = branch(() => pending(this.#anchor));
          Batch.enqueue(() => {
            this.#main_effect = this.#run(() => {
              Batch.ensure();
              return branch(() => this.#children(this.#anchor));
            });
            if (this.#pending_count > 0) {
              this.#show_pending_snippet();
            } else {
              pause_effect(
this.#pending_effect,
                () => {
                  this.#pending_effect = null;
                }
              );
              this.#pending = false;
            }
          });
        }
is_pending() {
          return this.#pending || !!this.parent && this.parent.is_pending();
        }
        has_pending_snippet() {
          return !!this.#props.pending;
        }
#run(fn) {
          var previous_effect = active_effect;
          var previous_reaction = active_reaction;
          var previous_ctx = component_context;
          set_active_effect(this.#effect);
          set_active_reaction(this.#effect);
          set_component_context(this.#effect.ctx);
          try {
            return fn();
          } catch (e) {
            handle_error(e);
            return null;
          } finally {
            set_active_effect(previous_effect);
            set_active_reaction(previous_reaction);
            set_component_context(previous_ctx);
          }
        }
        #show_pending_snippet() {
          const pending = (
this.#props.pending
          );
          if (this.#main_effect !== null) {
            this.#offscreen_fragment = document.createDocumentFragment();
            move_effect(this.#main_effect, this.#offscreen_fragment);
          }
          if (this.#pending_effect === null) {
            this.#pending_effect = branch(() => pending(this.#anchor));
          }
        }
#update_pending_count(d) {
          if (!this.has_pending_snippet()) {
            if (this.parent) {
              this.parent.#update_pending_count(d);
            }
            return;
          }
          this.#pending_count += d;
          if (this.#pending_count === 0) {
            this.#pending = false;
            if (this.#pending_effect) {
              pause_effect(this.#pending_effect, () => {
                this.#pending_effect = null;
              });
            }
            if (this.#offscreen_fragment) {
              this.#anchor.before(this.#offscreen_fragment);
              this.#offscreen_fragment = null;
            }
          }
        }
update_pending_count(d) {
          this.#update_pending_count(d);
          this.#local_pending_count += d;
          effect_pending_updates.add(this.#effect_pending_update);
        }
        get_effect_pending() {
          this.#effect_pending_subscriber();
          return get(
this.#effect_pending
          );
        }
error(error) {
          var onerror = this.#props.onerror;
          let failed = this.#props.failed;
          if (this.#is_creating_fallback || !onerror && !failed) {
            throw error;
          }
          if (this.#main_effect) {
            destroy_effect(this.#main_effect);
            this.#main_effect = null;
          }
          if (this.#pending_effect) {
            destroy_effect(this.#pending_effect);
            this.#pending_effect = null;
          }
          if (this.#failed_effect) {
            destroy_effect(this.#failed_effect);
            this.#failed_effect = null;
          }
          var did_reset = false;
          var calling_on_error = false;
          const reset = () => {
            if (did_reset) {
              svelte_boundary_reset_noop();
              return;
            }
            did_reset = true;
            if (calling_on_error) {
              svelte_boundary_reset_onerror();
            }
            Batch.ensure();
            this.#local_pending_count = 0;
            if (this.#failed_effect !== null) {
              pause_effect(this.#failed_effect, () => {
                this.#failed_effect = null;
              });
            }
            this.#pending = this.has_pending_snippet();
            this.#main_effect = this.#run(() => {
              this.#is_creating_fallback = false;
              return branch(() => this.#children(this.#anchor));
            });
            if (this.#pending_count > 0) {
              this.#show_pending_snippet();
            } else {
              this.#pending = false;
            }
          };
          var previous_reaction = active_reaction;
          try {
            set_active_reaction(null);
            calling_on_error = true;
            onerror?.(error, reset);
            calling_on_error = false;
          } catch (error2) {
            invoke_error_boundary(error2, this.#effect && this.#effect.parent);
          } finally {
            set_active_reaction(previous_reaction);
          }
          if (failed) {
            queue_micro_task(() => {
              this.#failed_effect = this.#run(() => {
                this.#is_creating_fallback = true;
                try {
                  return branch(() => {
                    failed(
                      this.#anchor,
                      () => error,
                      () => reset
                    );
                  });
                } catch (error2) {
                  invoke_error_boundary(
                    error2,
this.#effect.parent
                  );
                  return null;
                } finally {
                  this.#is_creating_fallback = false;
                }
              });
            });
          }
        }
      }
      function move_effect(effect2, fragment) {
        var node = effect2.nodes_start;
        var end = effect2.nodes_end;
        while (node !== null) {
          var next = node === end ? null : (

get_next_sibling(node)
          );
          fragment.append(node);
          node = next;
        }
      }
      function flatten(sync, async, fn) {
        const d = derived;
        if (async.length === 0) {
          fn(sync.map(d));
          return;
        }
        var batch = current_batch;
        var parent = (
active_effect
        );
        var restore = capture();
        Promise.all(async.map((expression) => async_derived(expression))).then((result) => {
          batch?.activate();
          restore();
          try {
            fn([...sync.map(d), ...result]);
          } catch (error) {
            if ((parent.f & DESTROYED) === 0) {
              invoke_error_boundary(error, parent);
            }
          }
          batch?.deactivate();
          unset_context();
        }).catch((error) => {
          invoke_error_boundary(error, parent);
        });
      }
      function capture() {
        var previous_effect = active_effect;
        var previous_reaction = active_reaction;
        var previous_component_context = component_context;
        var previous_batch2 = current_batch;
        return function restore() {
          set_active_effect(previous_effect);
          set_active_reaction(previous_reaction);
          set_component_context(previous_component_context);
          previous_batch2?.activate();
        };
      }
      function unset_context() {
        set_active_effect(null);
        set_active_reaction(null);
        set_component_context(null);
      }
function derived(fn) {
        var flags2 = DERIVED | DIRTY;
        var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
active_reaction
        ) : null;
        if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
          flags2 |= UNOWNED;
        } else {
          active_effect.f |= EFFECT_PRESERVED;
        }
        const signal = {
          ctx: component_context,
          deps: null,
          effects: null,
          equals,
          f: flags2,
          fn,
          reactions: null,
          rv: 0,
          v: (
UNINITIALIZED
          ),
          wv: 0,
          parent: parent_derived ?? active_effect,
          ac: null
        };
        return signal;
      }
function async_derived(fn, location2) {
        let parent = (
active_effect
        );
        if (parent === null) {
          async_derived_orphan();
        }
        var boundary2 = (
parent.b
        );
        var promise = (

void 0
        );
        var signal = source(
UNINITIALIZED
        );
        var prev = null;
        var should_suspend = !active_reaction;
        async_effect(() => {
          try {
            var p = fn();
            if (prev) Promise.resolve(p).catch(() => {
            });
          } catch (error) {
            p = Promise.reject(error);
          }
          var r2 = () => p;
          promise = prev?.then(r2, r2) ?? Promise.resolve(p);
          prev = promise;
          var batch = (
current_batch
          );
          var pending = boundary2.is_pending();
          if (should_suspend) {
            boundary2.update_pending_count(1);
            if (!pending) batch.increment();
          }
          const handler = (value, error = void 0) => {
            prev = null;
            if (!pending) batch.activate();
            if (error) {
              if (error !== STALE_REACTION) {
                signal.f |= ERROR_VALUE;
                internal_set(signal, error);
              }
            } else {
              if ((signal.f & ERROR_VALUE) !== 0) {
                signal.f ^= ERROR_VALUE;
              }
              internal_set(signal, value);
            }
            if (should_suspend) {
              boundary2.update_pending_count(-1);
              if (!pending) batch.decrement();
            }
            unset_context();
          };
          promise.then(handler, (e) => handler(null, e || "unknown"));
          if (batch) {
            return () => {
              queueMicrotask(() => batch.neuter());
            };
          }
        });
        return new Promise((fulfil) => {
          function next(p) {
            function go() {
              if (p === promise) {
                fulfil(signal);
              } else {
                next(promise);
              }
            }
            p.then(go, go);
          }
          next(promise);
        });
      }
function user_derived(fn) {
        const d = derived(fn);
        push_reaction_value(d);
        return d;
      }
function derived_safe_equal(fn) {
        const signal = derived(fn);
        signal.equals = safe_equals;
        return signal;
      }
      function destroy_derived_effects(derived2) {
        var effects = derived2.effects;
        if (effects !== null) {
          derived2.effects = null;
          for (var i = 0; i < effects.length; i += 1) {
            destroy_effect(
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
        if (is_destroying_effect) {
          return;
        }
        {
          var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
          set_signal_status(derived2, status);
        }
      }
      const old_values = new Map();
      function source(v, stack) {
        var signal = {
          f: 0,
v,
          reactions: null,
          equals,
          rv: 0,
          wv: 0
        };
        return signal;
      }
function state(v, stack) {
        const s = source(v);
        push_reaction_value(s);
        return s;
      }
function mutable_source(initial_value, immutable = false, trackable = true) {
        const s = source(initial_value);
        if (!immutable) {
          s.equals = safe_equals;
        }
        return s;
      }
      function set(source2, value, should_proxy = false) {
        if (active_reaction !== null &&

(!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
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
          var batch = Batch.ensure();
          batch.capture(source2, old_value);
          if ((source2.f & DERIVED) !== 0) {
            if ((source2.f & DIRTY) !== 0) {
              execute_derived(
source2
              );
            }
            set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
          }
          source2.wv = increment_write_version();
          mark_reactions(source2, DIRTY);
          if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
            if (untracked_writes === null) {
              set_untracked_writes([source2]);
            } else {
              untracked_writes.push(source2);
            }
          }
        }
        return value;
      }
      function increment(source2) {
        set(source2, source2.v + 1);
      }
      function mark_reactions(signal, status) {
        var reactions = signal.reactions;
        if (reactions === null) return;
        var length = reactions.length;
        for (var i = 0; i < length; i++) {
          var reaction = reactions[i];
          var flags2 = reaction.f;
          var not_dirty = (flags2 & DIRTY) === 0;
          if (not_dirty) {
            set_signal_status(reaction, status);
          }
          if ((flags2 & DERIVED) !== 0) {
            mark_reactions(
reaction,
              MAYBE_DIRTY
            );
          } else if (not_dirty) {
            if ((flags2 & BLOCK_EFFECT) !== 0) {
              if (eager_block_effects !== null) {
                eager_block_effects.push(
reaction
                );
              }
            }
            schedule_effect(
reaction
            );
          }
        }
      }
      function proxy(value) {
        if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
          return value;
        }
        const prototype = get_prototype_of(value);
        if (prototype !== object_prototype && prototype !== array_prototype) {
          return value;
        }
        var sources = new Map();
        var is_proxied_array = is_array(value);
        var version = state(0);
        var parent_version = update_version;
        var with_parent = (fn) => {
          if (update_version === parent_version) {
            return fn();
          }
          var reaction = active_reaction;
          var version2 = update_version;
          set_active_reaction(null);
          set_update_version(parent_version);
          var result = fn();
          set_active_reaction(reaction);
          set_update_version(version2);
          return result;
        };
        if (is_proxied_array) {
          sources.set("length", state(
value.length
          ));
        }
        return new Proxy(
value,
          {
            defineProperty(_, prop2, descriptor) {
              if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
                state_descriptors_fixed();
              }
              var s = sources.get(prop2);
              if (s === void 0) {
                s = with_parent(() => {
                  var s2 = state(descriptor.value);
                  sources.set(prop2, s2);
                  return s2;
                });
              } else {
                set(s, descriptor.value, true);
              }
              return true;
            },
            deleteProperty(target, prop2) {
              var s = sources.get(prop2);
              if (s === void 0) {
                if (prop2 in target) {
                  const s2 = with_parent(() => state(UNINITIALIZED));
                  sources.set(prop2, s2);
                  increment(version);
                }
              } else {
                set(s, UNINITIALIZED);
                increment(version);
              }
              return true;
            },
            get(target, prop2, receiver) {
              if (prop2 === STATE_SYMBOL) {
                return value;
              }
              var s = sources.get(prop2);
              var exists = prop2 in target;
              if (s === void 0 && (!exists || get_descriptor(target, prop2)?.writable)) {
                s = with_parent(() => {
                  var p = proxy(exists ? target[prop2] : UNINITIALIZED);
                  var s2 = state(p);
                  return s2;
                });
                sources.set(prop2, s);
              }
              if (s !== void 0) {
                var v = get(s);
                return v === UNINITIALIZED ? void 0 : v;
              }
              return Reflect.get(target, prop2, receiver);
            },
            getOwnPropertyDescriptor(target, prop2) {
              var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
              if (descriptor && "value" in descriptor) {
                var s = sources.get(prop2);
                if (s) descriptor.value = get(s);
              } else if (descriptor === void 0) {
                var source2 = sources.get(prop2);
                var value2 = source2?.v;
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
              if (prop2 === STATE_SYMBOL) {
                return true;
              }
              var s = sources.get(prop2);
              var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
              if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop2)?.writable)) {
                if (s === void 0) {
                  s = with_parent(() => {
                    var p = has ? proxy(target[prop2]) : UNINITIALIZED;
                    var s2 = state(p);
                    return s2;
                  });
                  sources.set(prop2, s);
                }
                var value2 = get(s);
                if (value2 === UNINITIALIZED) {
                  return false;
                }
              }
              return has;
            },
            set(target, prop2, value2, receiver) {
              var s = sources.get(prop2);
              var has = prop2 in target;
              if (is_proxied_array && prop2 === "length") {
                for (var i = value2; i <
s.v; i += 1) {
                  var other_s = sources.get(i + "");
                  if (other_s !== void 0) {
                    set(other_s, UNINITIALIZED);
                  } else if (i in target) {
                    other_s = with_parent(() => state(UNINITIALIZED));
                    sources.set(i + "", other_s);
                  }
                }
              }
              if (s === void 0) {
                if (!has || get_descriptor(target, prop2)?.writable) {
                  s = with_parent(() => state(void 0));
                  set(s, proxy(value2));
                  sources.set(prop2, s);
                }
              } else {
                has = s.v !== UNINITIALIZED;
                var p = with_parent(() => proxy(value2));
                set(s, p);
              }
              var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
              if (descriptor?.set) {
                descriptor.set.call(receiver, value2);
              }
              if (!has) {
                if (is_proxied_array && typeof prop2 === "string") {
                  var ls = (
sources.get("length")
                  );
                  var n = Number(prop2);
                  if (Number.isInteger(n) && n >= ls.v) {
                    set(ls, n + 1);
                  }
                }
                increment(version);
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
            }
          }
        );
      }
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
function get_first_child(node) {
        return first_child_getter.call(node);
      }
function get_next_sibling(node) {
        return next_sibling_getter.call(node);
      }
      function child(node, is_text) {
        {
          return get_first_child(node);
        }
      }
      function first_child(fragment, is_text = false) {
        {
          var first = (

get_first_child(
fragment
            )
          );
          if (first instanceof Comment && first.data === "") return get_next_sibling(first);
          return first;
        }
      }
      function sibling(node, count = 1, is_text = false) {
        let next_sibling = node;
        while (count--) {
          next_sibling =

get_next_sibling(next_sibling);
        }
        {
          return next_sibling;
        }
      }
      function clear_text_content(node) {
        node.textContent = "";
      }
      let listening_to_form_reset = false;
      function add_form_reset_listener() {
        if (!listening_to_form_reset) {
          listening_to_form_reset = true;
          document.addEventListener(
            "reset",
            (evt) => {
              Promise.resolve().then(() => {
                if (!evt.defaultPrevented) {
                  for (
                    const e of
evt.target.elements
                  ) {
                    e.__on_r?.();
                  }
                }
              });
            },
{ capture: true }
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
      function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
        element.addEventListener(event, () => without_reactive_context(handler));
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
        if (parent !== null && (parent.f & INERT) !== 0) {
          type |= INERT;
        }
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
          b: parent && parent.b,
          prev: null,
          teardown: null,
          transitions: null,
          wv: 0,
          ac: null
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
        if (push2) {
          var e = effect2;
          if (sync && e.deps === null && e.teardown === null && e.nodes_start === null && e.first === e.last &&
(e.f & EFFECT_PRESERVED) === 0) {
            e = e.first;
          }
          if (e !== null) {
            e.parent = parent;
            if (parent !== null) {
              push_effect(e, parent);
            }
            if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
              var derived2 = (
active_reaction
              );
              (derived2.effects ??= []).push(e);
            }
          }
        }
        return effect2;
      }
      function effect_tracking() {
        return active_reaction !== null && !untracking;
      }
      function user_effect(fn) {
        validate_effect();
        var flags2 = (
active_effect.f
        );
        var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & EFFECT_RAN) === 0;
        if (defer) {
          var context = (
component_context
          );
          (context.e ??= []).push(fn);
        } else {
          return create_user_effect(fn);
        }
      }
      function create_user_effect(fn) {
        return create_effect(EFFECT | USER_EFFECT, fn, false);
      }
      function component_root(fn) {
        Batch.ensure();
        const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
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
      function async_effect(fn) {
        return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
      }
      function render_effect(fn, flags2 = 0) {
        return create_effect(RENDER_EFFECT | flags2, fn, true);
      }
      function template_effect(fn, sync = [], async = []) {
        flatten(sync, async, (values) => {
          create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
        });
      }
      function block(fn, flags2 = 0) {
        var effect2 = create_effect(BLOCK_EFFECT | flags2, fn, true);
        return effect2;
      }
      function branch(fn, push2 = true) {
        return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true, push2);
      }
      function execute_effect_teardown(effect2) {
        var teardown = effect2.teardown;
        if (teardown !== null) {
          const previously_destroying_effect = is_destroying_effect;
          const previous_reaction = active_reaction;
          set_is_destroying_effect(true);
          set_active_reaction(null);
          try {
            teardown.call(null);
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
          const controller = effect2.ac;
          if (controller !== null) {
            without_reactive_context(() => {
              controller.abort(STALE_REACTION);
            });
          }
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
        if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null && effect2.nodes_end !== null) {
          remove_effect_dom(
            effect2.nodes_start,
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
        effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = effect2.ac = null;
      }
      function remove_effect_dom(node, end) {
        while (node !== null) {
          var next = node === end ? null : (

get_next_sibling(node)
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
      let is_updating_effect = false;
      function set_is_updating_effect(value) {
        is_updating_effect = value;
      }
      let is_destroying_effect = false;
      function set_is_destroying_effect(value) {
        is_destroying_effect = value;
      }
      let active_reaction = null;
      let untracking = false;
      function set_active_reaction(reaction) {
        active_reaction = reaction;
      }
      let active_effect = null;
      function set_active_effect(effect2) {
        active_effect = effect2;
      }
      let current_sources = null;
      function push_reaction_value(value) {
        if (active_reaction !== null && true) {
          if (current_sources === null) {
            current_sources = [value];
          } else {
            current_sources.push(value);
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
      let update_version = read_version;
      function set_update_version(value) {
        update_version = value;
      }
      let skip_reaction = false;
      function increment_write_version() {
        return ++write_version;
      }
      function is_dirty(reaction) {
        var flags2 = reaction.f;
        if ((flags2 & DIRTY) !== 0) {
          return true;
        }
        if ((flags2 & MAYBE_DIRTY) !== 0) {
          var dependencies = reaction.deps;
          var is_unowned = (flags2 & UNOWNED) !== 0;
          if (dependencies !== null) {
            var i;
            var dependency;
            var is_disconnected = (flags2 & DISCONNECTED) !== 0;
            var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
            var length = dependencies.length;
            if ((is_disconnected || is_unowned_connected) && (active_effect === null || (active_effect.f & DESTROYED) === 0)) {
              var derived2 = (
reaction
              );
              var parent = derived2.parent;
              for (i = 0; i < length; i++) {
                dependency = dependencies[i];
                if (is_disconnected || !dependency?.reactions?.includes(derived2)) {
                  (dependency.reactions ??= []).push(derived2);
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
              if (is_dirty(
dependency
              )) {
                update_derived(
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
      function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
        var reactions = signal.reactions;
        if (reactions === null) return;
        if (current_sources?.includes(signal)) {
          return;
        }
        for (var i = 0; i < reactions.length; i++) {
          var reaction = reactions[i];
          if ((reaction.f & DERIVED) !== 0) {
            schedule_possible_effect_self_invalidation(
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
reaction
            );
          }
        }
      }
      function update_reaction(reaction) {
        var previous_deps = new_deps;
        var previous_skipped_deps = skipped_deps;
        var previous_untracked_writes = untracked_writes;
        var previous_reaction = active_reaction;
        var previous_skip_reaction = skip_reaction;
        var previous_sources = current_sources;
        var previous_component_context = component_context;
        var previous_untracking = untracking;
        var previous_update_version = update_version;
        var flags2 = reaction.f;
        new_deps =
null;
        skipped_deps = 0;
        untracked_writes = null;
        skip_reaction = (flags2 & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
        active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
        current_sources = null;
        set_component_context(reaction.ctx);
        untracking = false;
        update_version = ++read_version;
        if (reaction.ac !== null) {
          without_reactive_context(() => {
            reaction.ac.abort(STALE_REACTION);
          });
          reaction.ac = null;
        }
        try {
          reaction.f |= REACTION_IS_UPDATING;
          var fn = (
reaction.fn
          );
          var result = fn();
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
            if (!skip_reaction ||
(flags2 & DERIVED) !== 0 &&
reaction.reactions !== null) {
              for (i = skipped_deps; i < deps.length; i++) {
                (deps[i].reactions ??= []).push(reaction);
              }
            }
          } else if (deps !== null && skipped_deps < deps.length) {
            remove_reactions(reaction, skipped_deps);
            deps.length = skipped_deps;
          }
          if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
            for (i = 0; i <
untracked_writes.length; i++) {
              schedule_possible_effect_self_invalidation(
                untracked_writes[i],
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
                previous_untracked_writes.push(...
untracked_writes);
              }
            }
          }
          if ((reaction.f & ERROR_VALUE) !== 0) {
            reaction.f ^= ERROR_VALUE;
          }
          return result;
        } catch (error) {
          return handle_error(error);
        } finally {
          reaction.f ^= REACTION_IS_UPDATING;
          new_deps = previous_deps;
          skipped_deps = previous_skipped_deps;
          untracked_writes = previous_untracked_writes;
          active_reaction = previous_reaction;
          skip_reaction = previous_skip_reaction;
          current_sources = previous_sources;
          set_component_context(previous_component_context);
          untracking = previous_untracking;
          update_version = previous_update_version;
        }
      }
      function remove_reaction(signal, dependency) {
        let reactions = dependency.reactions;
        if (reactions !== null) {
          var index2 = index_of.call(reactions, signal);
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
        if (reactions === null && (dependency.f & DERIVED) !== 0 &&


(new_deps === null || !new_deps.includes(dependency))) {
          set_signal_status(dependency, MAYBE_DIRTY);
          if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
            dependency.f ^= DISCONNECTED;
          }
          destroy_derived_effects(
dependency
          );
          remove_reactions(
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
        var flags2 = effect2.f;
        if ((flags2 & DESTROYED) !== 0) {
          return;
        }
        set_signal_status(effect2, CLEAN);
        var previous_effect = active_effect;
        var was_updating_effect = is_updating_effect;
        active_effect = effect2;
        is_updating_effect = true;
        try {
          if ((flags2 & BLOCK_EFFECT) !== 0) {
            destroy_block_effect_children(effect2);
          } else {
            destroy_effect_children(effect2);
          }
          execute_effect_teardown(effect2);
          var teardown = update_reaction(effect2);
          effect2.teardown = typeof teardown === "function" ? teardown : null;
          effect2.wv = write_version;
          var dep;
          if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
        } finally {
          is_updating_effect = was_updating_effect;
          active_effect = previous_effect;
        }
      }
      async function tick() {
        await Promise.resolve();
        flushSync();
      }
      function get(signal) {
        var flags2 = signal.f;
        var is_derived = (flags2 & DERIVED) !== 0;
        if (active_reaction !== null && !untracking) {
          var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
          if (!destroyed && !current_sources?.includes(signal)) {
            var deps = active_reaction.deps;
            if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
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
            } else {
              (active_reaction.deps ??= []).push(signal);
              var reactions = signal.reactions;
              if (reactions === null) {
                signal.reactions = [active_reaction];
              } else if (!reactions.includes(active_reaction)) {
                reactions.push(active_reaction);
              }
            }
          }
        } else if (is_derived &&
signal.deps === null &&
signal.effects === null) {
          var derived2 = (
signal
          );
          var parent = derived2.parent;
          if (parent !== null && (parent.f & UNOWNED) === 0) {
            derived2.f ^= UNOWNED;
          }
        }
        if (is_destroying_effect) {
          if (old_values.has(signal)) {
            return old_values.get(signal);
          }
          if (is_derived) {
            derived2 =
signal;
            var value = derived2.v;
            if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
              value = execute_derived(derived2);
            }
            old_values.set(derived2, value);
            return value;
          }
        } else if (is_derived) {
          derived2 =
signal;
          if (is_dirty(derived2)) {
            update_derived(derived2);
          }
        }
        if ((signal.f & ERROR_VALUE) !== 0) {
          throw signal.v;
        }
        return signal.v;
      }
      function depends_on_old_values(derived2) {
        if (derived2.v === UNINITIALIZED) return true;
        if (derived2.deps === null) return false;
        for (const dep of derived2.deps) {
          if (old_values.has(dep)) {
            return true;
          }
          if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
dep
          )) {
            return true;
          }
        }
        return false;
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
      function createAttachmentKey() {
        return Symbol(ATTACHMENT_KEY);
      }
      const PASSIVE_EVENTS = ["touchstart", "touchmove"];
      function is_passive_event(name) {
        return PASSIVE_EVENTS.includes(name);
      }
      const all_registered_events = new Set();
      const root_event_handles = new Set();
      function delegate(events) {
        for (var i = 0; i < events.length; i++) {
          all_registered_events.add(events[i]);
        }
        for (var fn of root_event_handles) {
          fn(events);
        }
      }
      let last_propagated_event = null;
      function handle_event_propagation(event) {
        var handler_element = this;
        var owner_document = (
handler_element.ownerDocument
        );
        var event_name = event.type;
        var path = event.composedPath?.() || [];
        var current_target = (
path[0] || event.target
        );
        last_propagated_event = event;
        var path_idx = 0;
        var handled_at = last_propagated_event === event && event.__root;
        if (handled_at) {
          var at_idx = path.indexOf(handled_at);
          if (at_idx !== -1 && (handler_element === document || handler_element ===
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
        current_target =
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
            var parent_element = current_target.assignedSlot || current_target.parentNode ||
current_target.host || null;
            try {
              var delegated = current_target["__" + event_name];
              if (delegated != null && (!
current_target.disabled ||

event.target === current_target)) {
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
        elem.innerHTML = html.replaceAll("<!>", "<!---->");
        return elem.content;
      }
      function assign_nodes(start, end) {
        var effect2 = (
active_effect
        );
        if (effect2.nodes_start === null) {
          effect2.nodes_start = start;
          effect2.nodes_end = end;
        }
      }
function from_html(content, flags2) {
        var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
        var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
        var node;
        var has_start = !content.startsWith("<!>");
        return () => {
          if (node === void 0) {
            node = create_fragment_from_html(has_start ? content : "<!>" + content);
            if (!is_fragment) node =

get_first_child(node);
          }
          var clone = (
use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
          );
          if (is_fragment) {
            var start = (

get_first_child(clone)
            );
            var end = (
clone.lastChild
            );
            assign_nodes(start, end);
          } else {
            assign_nodes(clone, clone);
          }
          return clone;
        };
      }
function from_namespace(content, flags2, ns = "svg") {
        var has_start = !content.startsWith("<!>");
        var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
        var node;
        return () => {
          if (!node) {
            var fragment = (
create_fragment_from_html(wrapped)
            );
            var root2 = (

get_first_child(fragment)
            );
            {
              node =

get_first_child(root2);
            }
          }
          var clone = (
node.cloneNode(true)
          );
          {
            assign_nodes(clone, clone);
          }
          return clone;
        };
      }
function from_svg(content, flags2) {
        return from_namespace(content, flags2, "svg");
      }
      function append(anchor, dom) {
        if (anchor === null) {
          return;
        }
        anchor.before(
dom
        );
      }
      function set_text(text, value) {
        var str = value == null ? "" : typeof value === "object" ? value + "" : value;
        if (str !== (text.__t ??= text.nodeValue)) {
          text.__t = str;
          text.nodeValue = str + "";
        }
      }
      function mount(component, options) {
        return _mount(component, options);
      }
      const document_listeners = new Map();
      function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
        init_operations();
        var registered_events = new Set();
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
        var unmount = component_root(() => {
          var anchor_node = anchor ?? target.appendChild(create_text());
          boundary(
anchor_node,
            {
              pending: () => {
              }
            },
            (anchor_node2) => {
              if (context) {
                push({});
                var ctx = (
component_context
                );
                ctx.c = context;
              }
              if (events) {
                props.$$events = events;
              }
              component = Component(anchor_node2, props) || {};
              if (context) {
                pop();
              }
            }
          );
          return () => {
            for (var event_name of registered_events) {
              target.removeEventListener(event_name, handle_event_propagation);
              var n = (
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
              anchor_node.parentNode?.removeChild(anchor_node);
            }
          };
        });
        mounted_components.set(component, unmount);
        return component;
      }
      let mounted_components = new WeakMap();
      function if_block(node, fn, elseif = false) {
        var anchor = node;
        var consequent_effect = null;
        var alternate_effect = null;
        var condition = UNINITIALIZED;
        var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
        var has_branch = false;
        const set_branch = (fn2, flag = true) => {
          has_branch = true;
          update_branch(flag, fn2);
        };
        function commit() {
          var active = condition ? consequent_effect : alternate_effect;
          var inactive = condition ? alternate_effect : consequent_effect;
          if (active) {
            resume_effect(active);
          }
          if (inactive) {
            pause_effect(inactive, () => {
              if (condition) {
                alternate_effect = null;
              } else {
                consequent_effect = null;
              }
            });
          }
        }
        const update_branch = (new_condition, fn2) => {
          if (condition === (condition = new_condition)) return;
          var target = anchor;
          if (condition) {
            consequent_effect ??= fn2 && branch(() => fn2(target));
          } else {
            alternate_effect ??= fn2 && branch(() => fn2(target));
          }
          {
            commit();
          }
        };
        block(() => {
          has_branch = false;
          fn(set_branch);
          if (!has_branch) {
            update_branch(null, null);
          }
        }, flags2);
      }
      function index(_, i) {
        return i;
      }
      function pause_effects(state2, items, controlled_anchor) {
        var items_map = state2.items;
        var transitions = [];
        var length = items.length;
        for (var i = 0; i < length; i++) {
          pause_children(items[i].e, transitions, true);
        }
        var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
        if (is_controlled) {
          var parent_node = (

controlled_anchor.parentNode
          );
          clear_text_content(parent_node);
          parent_node.append(
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
      function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
        var anchor = node;
        var state2 = { flags: flags2, items: new Map(), first: null };
        var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
        if (is_controlled) {
          var parent_node = (
node
          );
          anchor = parent_node.appendChild(create_text());
        }
        var fallback = null;
        var was_empty = false;
        var offscreen_items = new Map();
        var each_array = derived_safe_equal(() => {
          var collection = get_collection();
          return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
        });
        var array;
        var each_effect;
        function commit() {
          reconcile(
            each_effect,
            array,
            state2,
            offscreen_items,
            anchor,
            render_fn,
            flags2,
            get_key,
            get_collection
          );
          if (fallback_fn !== null) {
            if (array.length === 0) {
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
        }
        block(() => {
          each_effect ??=
active_effect;
          array =
get(each_array);
          var length = array.length;
          if (was_empty && length === 0) {
            return;
          }
          was_empty = length === 0;
          {
            {
              commit();
            }
          }
          get(each_array);
        });
      }
      function reconcile(each_effect, array, state2, offscreen_items, anchor, render_fn, flags2, get_key, get_collection) {
        var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
        var should_update = (flags2 & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
        var length = array.length;
        var items = state2.items;
        var first = state2.first;
        var current = first;
        var seen2;
        var prev = null;
        var to_animate;
        var matched = [];
        var stashed = [];
        var value;
        var key;
        var item;
        var i;
        if (is_animated) {
          for (i = 0; i < length; i += 1) {
            value = array[i];
            key = get_key(value, i);
            item = items.get(key);
            if (item !== void 0) {
              item.a?.measure();
              (to_animate ??= new Set()).add(item);
            }
          }
        }
        for (i = 0; i < length; i += 1) {
          value = array[i];
          key = get_key(value, i);
          item = items.get(key);
          if (item === void 0) {
            var pending = offscreen_items.get(key);
            if (pending !== void 0) {
              offscreen_items.delete(key);
              items.set(key, pending);
              var next = prev ? prev.next : current;
              link(state2, prev, pending);
              link(state2, pending, next);
              move(pending, next, anchor);
              prev = pending;
            } else {
              var child_anchor = current ? (
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
                flags2,
                get_collection
              );
            }
            items.set(key, prev);
            matched = [];
            stashed = [];
            current = prev.next;
            continue;
          }
          if (should_update) {
            update_item(item, value, i, flags2);
          }
          if ((item.e.f & INERT) !== 0) {
            resume_effect(item.e);
            if (is_animated) {
              item.a?.unfix();
              (to_animate ??= new Set()).delete(item);
            }
          }
          if (item !== current) {
            if (seen2 !== void 0 && seen2.has(item)) {
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
                  seen2.delete(stashed[j]);
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
                seen2.delete(item);
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
                (seen2 ??= new Set()).add(current);
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
        if (current !== null || seen2 !== void 0) {
          var to_destroy = seen2 === void 0 ? [] : array_from(seen2);
          while (current !== null) {
            if ((current.e.f & INERT) === 0) {
              to_destroy.push(current);
            }
            current = current.next;
          }
          var destroy_length = to_destroy.length;
          if (destroy_length > 0) {
            var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
            if (is_animated) {
              for (i = 0; i < destroy_length; i += 1) {
                to_destroy[i].a?.measure();
              }
              for (i = 0; i < destroy_length; i += 1) {
                to_destroy[i].a?.fix();
              }
            }
            pause_effects(state2, to_destroy, controlled_anchor);
          }
        }
        if (is_animated) {
          queue_micro_task(() => {
            if (to_animate === void 0) return;
            for (item of to_animate) {
              item.a?.apply();
            }
          });
        }
        each_effect.first = state2.first && state2.first.e;
        each_effect.last = prev && prev.e;
        for (var unused of offscreen_items.values()) {
          destroy_effect(unused.e);
        }
        offscreen_items.clear();
      }
      function update_item(item, value, index2, type) {
        if ((type & EACH_ITEM_REACTIVE) !== 0) {
          internal_set(item.v, value);
        }
        if ((type & EACH_INDEX_REACTIVE) !== 0) {
          internal_set(
item.i,
            index2
          );
        } else {
          item.i = index2;
        }
      }
      function create_item(anchor, state2, prev, next, value, key, index2, render_fn, flags2, get_collection, deferred2) {
        var reactive = (flags2 & EACH_ITEM_REACTIVE) !== 0;
        var mutable = (flags2 & EACH_ITEM_IMMUTABLE) === 0;
        var v = reactive ? mutable ? mutable_source(value, false, false) : source(value) : value;
        var i = (flags2 & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
        var item = {
          i,
          v,
          k: key,
          a: null,
e: null,
          prev,
          next
        };
        try {
          if (anchor === null) {
            var fragment = document.createDocumentFragment();
            fragment.append(anchor = create_text());
          }
          item.e = branch(() => render_fn(
anchor,
            v,
            i,
            get_collection
          ), hydrating);
          item.e.prev = prev && prev.e;
          item.e.next = next && next.e;
          if (prev === null) {
            if (!deferred2) {
              state2.first = item;
            }
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
item.next.e.nodes_start
        ) : anchor;
        var dest = next ? (
next.e.nodes_start
        ) : anchor;
        var node = (
item.e.nodes_start
        );
        while (node !== null && node !== end) {
          var next_node = (

get_next_sibling(node)
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
snippet2(anchor, ...args)
          ));
        }, EFFECT_TRANSPARENT);
      }
      function r(e) {
        var t, f, n = "";
        if ("string" == typeof e || "number" == typeof e) n += e;
        else if ("object" == typeof e) if (Array.isArray(e)) {
          var o = e.length;
          for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
        } else for (f in e) e[f] && (n && (n += " "), n += f);
        return n;
      }
      function clsx$1() {
        for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
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
            update_styles(dom, prev_styles?.[0], next_styles[0]);
            update_styles(dom, prev_styles?.[1], next_styles[1], "important");
          } else {
            update_styles(dom, prev_styles, next_styles);
          }
        }
        return next_styles;
      }
      const IS_CUSTOM_ELEMENT = Symbol("is custom element");
      const IS_HTML = Symbol("is html");
      function set_value(element, value) {
        var attributes = get_attributes(element);
        if (attributes.value === (attributes.value =
value ?? void 0) ||

element.value === value && (value !== 0 || element.nodeName !== "PROGRESS")) {
          return;
        }
        element.value = value ?? "";
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
      function get_attributes(element) {
        return (

element.__attributes ??= {
            [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
            [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
          }
        );
      }
      var setters_cache = new Map();
      function get_setters(element) {
        var cache_key = element.getAttribute("is") || element.nodeName;
        var setters = setters_cache.get(cache_key);
        if (setters) return setters;
        setters_cache.set(cache_key, setters = []);
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
      function bind_value(input, get2, set2 = get2) {
        var batches2 = new WeakSet();
        listen_to_event_and_reset_event(input, "input", async (is_reset) => {
          var value = is_reset ? input.defaultValue : input.value;
          value = is_numberlike_input(input) ? to_number(value) : value;
          set2(value);
          if (current_batch !== null) {
            batches2.add(current_batch);
          }
          await tick();
          if (value !== (value = get2())) {
            var start = input.selectionStart;
            var end = input.selectionEnd;
            input.value = value ?? "";
            if (end !== null) {
              input.selectionStart = start;
              input.selectionEnd = Math.min(end, input.value.length);
            }
          }
        });
        if (



untrack(get2) == null && input.value
        ) {
          set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
          if (current_batch !== null) {
            batches2.add(current_batch);
          }
        }
        render_effect(() => {
          var value = get2();
          if (input === document.activeElement) {
            var batch = (
previous_batch ?? current_batch
            );
            if (batches2.has(batch)) {
              return;
            }
          }
          if (is_numberlike_input(input) && value === to_number(input.value)) {
            return;
          }
          if (input.type === "date" && !value && !input.value) {
            return;
          }
          if (value !== input.value) {
            input.value = value ?? "";
          }
        });
      }
      function is_numberlike_input(input) {
        var type = input.type;
        return type === "number" || type === "range";
      }
      function to_number(value) {
        return value === "" ? null : +value;
      }
      class ResizeObserverSingleton {
#listeners = new WeakMap();
#observer;
#options;
static entries = new WeakMap();
constructor(options) {
          this.#options = options;
        }
observe(element, listener) {
          var listeners = this.#listeners.get(element) || new Set();
          listeners.add(listener);
          this.#listeners.set(element, listeners);
          this.#getObserver().observe(element, this.#options);
          return () => {
            var listeners2 = this.#listeners.get(element);
            listeners2.delete(listener);
            if (listeners2.size === 0) {
              this.#listeners.delete(element);
              this.#observer.unobserve(element);
            }
          };
        }
        #getObserver() {
          return this.#observer ?? (this.#observer = new ResizeObserver(
(entries) => {
              for (var entry of entries) {
                ResizeObserverSingleton.entries.set(entry.target, entry);
                for (var listener of this.#listeners.get(entry.target) || []) {
                  listener(entry);
                }
              }
            }
          ));
        }
      }
      var resize_observer_border_box = new ResizeObserverSingleton({
        box: "border-box"
      });
      function bind_element_size(element, type, set2) {
        var unsub = resize_observer_border_box.observe(element, () => set2(element[type]));
        effect(() => {
          untrack(() => set2(element[type]));
          return unsub;
        });
      }
      let is_store_binding = false;
      function capture_store_binding(fn) {
        var previous_is_store_binding = is_store_binding;
        try {
          is_store_binding = false;
          return [fn(), is_store_binding];
        } finally {
          is_store_binding = previous_is_store_binding;
        }
      }
      function prop(props, key, flags2, fallback) {
        var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
        var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
        var fallback_value = (
fallback
        );
        var fallback_dirty = true;
        var get_fallback = () => {
          if (fallback_dirty) {
            fallback_dirty = false;
            fallback_value = lazy ? untrack(
fallback
            ) : (
fallback
            );
          }
          return fallback_value;
        };
        var setter;
        if (bindable) {
          var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
          setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
        }
        var initial_value;
        var is_store_sub = false;
        if (bindable) {
          [initial_value, is_store_sub] = capture_store_binding(() => (
props[key]
          ));
        } else {
          initial_value =
props[key];
        }
        if (initial_value === void 0 && fallback !== void 0) {
          initial_value = get_fallback();
          if (setter) {
            props_invalid_value();
            setter(initial_value);
          }
        }
        var getter;
        {
          getter = () => {
            var value = (
props[key]
            );
            if (value === void 0) return get_fallback();
            fallback_dirty = true;
            return value;
          };
        }
        if ((flags2 & PROPS_IS_UPDATED) === 0) {
          return getter;
        }
        if (setter) {
          var legacy_parent = props.$$legacy;
          return (
(function(value, mutation) {
              if (arguments.length > 0) {
                if (!mutation || legacy_parent || is_store_sub) {
                  setter(mutation ? getter() : value);
                }
                return value;
              }
              return getter();
            })
          );
        }
        var overridden = false;
        var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
          overridden = false;
          return getter();
        });
        if (bindable) get(d);
        var parent_effect = (
active_effect
        );
        return (
(function(value, mutation) {
            if (arguments.length > 0) {
              const new_value = mutation ? get(d) : bindable ? proxy(value) : value;
              set(d, new_value);
              overridden = true;
              if (fallback_value !== void 0) {
                fallback_value = new_value;
              }
              return value;
            }
            if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
              return d.v;
            }
            return get(d);
          })
        );
      }
      const PUBLIC_VERSION = "5";
      if (typeof window !== "undefined") {
        ((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
      }
      var root$a = from_html(`<button> </button>`);
      function ActionButton($$anchor, $$props) {
        let kind = prop($$props, "kind", 3, "primary");
        var button = root$a();
        let classes;
        button.__click = function(...$$args) {
          $$props.onClick?.apply(this, $$args);
        };
        var text = child(button);
        template_effect(
          ($0) => {
            classes = set_class(button, 1, "ActionButton svelte-j4psvl", null, classes, $0);
            button.disabled = $$props.disabled;
            set_text(text, $$props.label);
          },
          [
            () => ({
              "ActionButton--primary": kind() === "primary",
              "ActionButton--secondary": kind() === "secondary"
            })
          ]
        );
        append($$anchor, button);
      }
      delegate(["click"]);
      const getTimeString = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      };
      const parseTimeString = (time) => {
        const parts = time.split(":").map((part) => parseInt(part, 10));
        if (parts.some(isNaN)) {
          throw new Error("Invalid time format");
        }
        if (parts.length === 1) {
          return parts[0];
        }
        if (parts.length === 2) {
          return parts[0] * 60 + parts[1];
        }
        throw new Error("Invalid time format");
      };
      const onTimeValueChange = (event, startHandlePosition, length, endHandlePosition) => {
        if (!event.target) return;
        const { name, value } = event.target;
        try {
          const timeInSeconds = parseTimeString(value);
          if (name === "start") {
            set(startHandlePosition, Math.min(Math.max(0, timeInSeconds / length() * 100), get(endHandlePosition)), true);
          } else {
            set(endHandlePosition, Math.min(Math.max(get(startHandlePosition), timeInSeconds / length() * 100), 100), true);
          }
        } catch {
        }
      };
      var on_mousedown = (event, onHandleMouseDown) => onHandleMouseDown(event, "start");
      var on_mousedown_1 = (event, onHandleMouseDown) => onHandleMouseDown(event, "end");
      var on_mousedown_2 = (event, onHandleMouseDown) => onHandleMouseDown(event, "playback");
      var root_1$2 = from_html(`<span class="AudioRangeSelector__Handle AudioRangeSelector__PlayHandle svelte-xbq2f9" role="button" tabindex="0"></span>`);
      var root$9 = from_html(`<div class="AudioRangeSelector svelte-xbq2f9"><span class="AudioRangeSelector__Handle svelte-xbq2f9" role="button" tabindex="0"></span> <span class="AudioRangeSelector__Handle svelte-xbq2f9" role="button" tabindex="0"></span> <!> <div class="AudioRangeSelector__PlayContainer svelte-xbq2f9"><!></div> <span class="AudioRangeSelector__SelectedRange svelte-xbq2f9"></span> <span class="AudioRangeSelector__SelectedRange svelte-xbq2f9"></span> <input class="AudioRangeSelector__HandleValue svelte-xbq2f9" name="start"/> <input class="AudioRangeSelector__HandleValue svelte-xbq2f9" name="end"/></div>`);
      function AudioRangeSelector($$anchor, $$props) {
        push($$props, true);
        let length = prop($$props, "length", 3, 180);
        let startHandlePosition = state(0);
        let endHandlePosition = state(100);
        let containerWidth = state(0);
        let startHasSpace = user_derived(() => get(startHandlePosition) / 100 * get(containerWidth) > 50);
        let endHasSpace = user_derived(() => (1 - get(endHandlePosition) / 100) * get(containerWidth) > 50);
        const onHandleMouseDown = (event, handle) => {
          event.preventDefault();
          const onMouseMove = (moveEvent) => {
            const rect = event.target.parentElement?.getBoundingClientRect();
            if (!rect) return;
            const position = (moveEvent.clientX - rect.left) / rect.width * 100;
            if (handle === "start") {
              set(startHandlePosition, Math.min(Math.max(0, position), get(endHandlePosition)), true);
              $$props.onStartChange?.(get(startHandlePosition) / 100 * length());
            } else if (handle === "end") {
              set(endHandlePosition, Math.max(Math.min(100, position), get(startHandlePosition)), true);
              $$props.onEndChange?.(get(endHandlePosition) / 100 * length());
            } else if (handle === "playback") {
              const clampedPosition = Math.min(Math.max(get(startHandlePosition), position), get(endHandlePosition));
              const timeInSeconds = clampedPosition / 100 * length();
              $$props.onPlaybackDrag?.(timeInSeconds);
            }
          };
          const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            if (handle === "playback") {
              $$props.onPlaybackEndDrag?.();
            }
          };
          window.addEventListener("mousemove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
          if (handle === "playback") {
            $$props.onPlaybackStartDrag?.();
          } else if ($$props.playing) {
            $$props.onPlayStopClick?.();
          }
        };
        var div = root$9();
        var span = child(div);
        span.__mousedown = [on_mousedown, onHandleMouseDown];
        var span_1 = sibling(span, 2);
        span_1.__mousedown = [on_mousedown_1, onHandleMouseDown];
        var node = sibling(span_1, 2);
        {
          var consequent = ($$anchor2) => {
            var span_2 = root_1$2();
            span_2.__mousedown = [on_mousedown_2, onHandleMouseDown];
            template_effect(() => set_style(span_2, `left: ${$$props.progress / length() * 100}%;`));
            append($$anchor2, span_2);
          };
          if_block(node, ($$render) => {
            if ($$props.playing && $$props.progress !== void 0) $$render(consequent);
          });
        }
        var div_1 = sibling(node, 2);
        let styles;
        var node_1 = child(div_1);
        {
          let $0 = user_derived(() => $$props.playing ? "⏹" : "▶");
          ActionButton(node_1, {
            get label() {
              return get($0);
            },
            kind: "secondary",
            get onClick() {
              return $$props.onPlayStopClick;
            }
          });
        }
        var span_3 = sibling(div_1, 2);
        let styles_1;
        var span_4 = sibling(span_3, 2);
        let styles_2;
        var input = sibling(span_4, 2);
        input.__change = [
          onTimeValueChange,
          startHandlePosition,
          length,
          endHandlePosition
        ];
        let styles_3;
        var input_1 = sibling(input, 2);
        input_1.__change = [
          onTimeValueChange,
          startHandlePosition,
          length,
          endHandlePosition
        ];
        let styles_4;
        template_effect(
          ($0, $1, $2, $3, $4, $5, $6) => {
            set_style(span, `left: ${get(startHandlePosition) ?? ""}%;`);
            set_style(span_1, `left: ${get(endHandlePosition) ?? ""}%;`);
            styles = set_style(div_1, "", styles, $0);
            styles_1 = set_style(span_3, "", styles_1, $1);
            styles_2 = set_style(span_4, "", styles_2, $2);
            set_value(input, $3);
            styles_3 = set_style(input, "", styles_3, $4);
            set_value(input_1, $5);
            styles_4 = set_style(input_1, "", styles_4, $6);
          },
          [
            () => ({
              right: `${101 - get(endHandlePosition)}%`,
              opacity: $$props.playing ? 0.7 : 1
            }),
            () => ({ left: "0", right: `${100 - get(startHandlePosition)}%` }),
            () => ({ left: `${get(endHandlePosition) ?? ""}%`, right: "0" }),
            () => getTimeString(get(startHandlePosition) / 100 * length()),
            () => ({
              top: get(startHasSpace) ? "25%" : void 0,
              right: get(startHasSpace) ? `${100 - get(startHandlePosition)}%` : void 0,
              bottom: get(startHasSpace) ? void 0 : "0",
              left: get(startHasSpace) ? void 0 : `${get(startHandlePosition)}%`
            }),
            () => getTimeString(get(endHandlePosition) / 100 * length()),
            () => ({
              top: get(endHasSpace) ? "25%" : void 0,
              right: get(endHasSpace) ? void 0 : `${100 - get(endHandlePosition)}%`,
              bottom: get(endHasSpace) ? void 0 : "0",
              left: get(endHasSpace) ? `${get(endHandlePosition)}%` : void 0
            })
          ]
        );
        bind_element_size(div, "clientWidth", ($$value) => set(containerWidth, $$value));
        append($$anchor, div);
        pop();
      }
      delegate(["mousedown", "change"]);
      var root_1$1 = from_html(`<span class="AudioWaveform__Sample svelte-ib2xuc"></span>`);
      var root$8 = from_html(`<div class="AudioWaveform svelte-ib2xuc"><span class="AudioWaveform__MiddleLine svelte-ib2xuc"></span> <!></div>`);
      function AudioWaveform($$anchor, $$props) {
        let height = state(0);
        var div = root$8();
        var node = sibling(child(div), 2);
        each(node, 17, () => $$props.waveform, index, ($$anchor2, sample) => {
          var span = root_1$1();
          template_effect(() => set_style(span, `height: ${get(sample) * get(height)}px;`));
          append($$anchor2, span);
        });
        bind_element_size(div, "clientHeight", ($$value) => set(height, $$value));
        append($$anchor, div);
      }
      var root$7 = from_html(`<div><!></div>`);
      function Container($$anchor, $$props) {
        push($$props, true);
        const isDragging = prop($$props, "isDragging", 3, false), position = prop($$props, "position", 19, () => ({ x: 0, y: 0 }));
        var div = root$7();
        var node = child(div);
        snippet(node, () => $$props.children ?? noop);
        template_effect(() => {
          set_class(
            div,
            1,
            clsx([
              "Container",
              $$props.open && "Container--open",
              isDragging() && "Container--dragging"
            ]),
            "svelte-1fap42e"
          );
          set_style(div, `transform: translate(${position().x ?? ""}px, ${position().y ?? ""}px);`);
        });
        append($$anchor, div);
        pop();
      }
      const download = (url2, filename) => {
        const stubLink = document.createElement("a");
        stubLink.style.display = "none";
        stubLink.href = url2;
        stubLink.download = filename;
        document.body.appendChild(stubLink);
        stubLink.click();
        document.body.removeChild(stubLink);
      };
      const strings = {
        cover: {
          title: "封面"
        },
        infoItems: {
          filename: "文件名",
          title: "标题",
          author: "作者"
        },
        fetch: {
          idle: "获取音乐",
          processing: "获取中…"
        },
        download: {
          idle: "下载音乐",
          processing: "处理中…",
          lyrics: "下载歌词",
          noLyrics: "无歌词"
        },
        navigation: {
          back: "返回"
        }
      };
      var root$6 = from_html(`<div class="Cover svelte-1470o3e"><h5 class="Cover__title svelte-1470o3e"> </h5> <img class="Cover__image svelte-1470o3e"/></div>`);
      function Cover($$anchor, $$props) {
        push($$props, true);
        var div = root$6();
        var h5 = child(div);
        var text = child(h5);
        var img = sibling(h5, 2);
        template_effect(() => {
          set_text(text, strings.cover.title);
          set_attribute(img, "alt", strings.cover.title);
          set_attribute(img, "src", $$props.imageUrl);
        });
        append($$anchor, div);
        pop();
      }
      var root$5 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 6.939l3.182-3.182a.75.75 0 111.061 1.061L9.061 8l3.182 3.182a.75.75 0 11-1.061 1.061L8 9.061l-3.182 3.182a.75.75 0 11-1.061-1.061L6.939 8 3.757 4.818a.75.75 0 111.061-1.061L8 6.939z"></path></svg>`);
      function CloseIcon($$anchor, $$props) {
        var svg = root$5();
        template_effect(() => {
          set_attribute(svg, "width", $$props.width);
          set_attribute(svg, "height", $$props.height);
        });
        append($$anchor, svg);
      }
      var root$4 = from_svg(`<svg viewBox="0 0 1024 1024" class="icon svelte-vtxwtm"><path d="M881.92 460.8a335.36 335.36 0 0 0-334.336-335.104h-73.216A335.616 335.616 0 0 0 139.776 460.8v313.6a18.688 18.688 0 0 0 18.432 18.688h41.984c13.568 46.336 37.888 80.384 88.576 80.384h98.304a37.376 37.376 0 0 0 37.376-36.864l1.28-284.672a36.864 36.864 0 0 0-37.12-37.12h-99.84a111.616 111.616 0 0 0-51.2 12.8V454.4a242.432 242.432 0 0 1 241.664-241.664h67.328A242.176 242.176 0 0 1 787.968 454.4v74.496a110.592 110.592 0 0 0-54.272-14.08h-99.84a36.864 36.864 0 0 0-37.12 37.12v284.672a37.376 37.376 0 0 0 37.376 36.864h98.304c51.2 0 75.008-34.048 88.576-80.384h41.984a18.688 18.688 0 0 0 18.432-18.688z" fill="#45C7DD"></path><path d="m646.1859999999999 792.7090000000001.274-196.096q.046-32.512 32.558-32.466l1.024.001q32.512.045 32.466 32.557l-.274 196.096q-.045 32.512-32.557 32.467l-1.024-.002q-32.512-.045-32.467-32.557ZM307.26800000000003 792.7349999999999l.274-196.096q.045-32.512 32.557-32.467l1.024.002q32.512.045 32.467 32.557l-.274 196.096q-.045 32.512-32.557 32.466l-1.024-.001q-32.512-.045-32.467-32.557Z" fill="#FF5C7A"></path></svg>`);
      function HeadphoneIcon($$anchor, $$props) {
        var svg = root$4();
        template_effect(() => {
          set_attribute(svg, "width", $$props.width);
          set_attribute(svg, "height", $$props.height);
        });
        append($$anchor, svg);
      }
      var root$3 = from_html(`<div class="Header svelte-zne36e"><button class="icon-button drag-handle svelte-zne36e"><!></button> <button class="icon-button svelte-zne36e"><!></button></div>`);
      function Header($$anchor, $$props) {
        var div = root$3();
        var button = child(div);
        button.__click = function(...$$args) {
          $$props.onHeaderIconClick?.apply(this, $$args);
        };
        button.__dblclick = function(...$$args) {
          $$props.onHeaderIconDblClick?.apply(this, $$args);
        };
        button.__mousedown = function(...$$args) {
          $$props.onDragStart?.apply(this, $$args);
        };
        var node = child(button);
        HeadphoneIcon(node, { width: "2rem", height: "2rem" });
        var button_1 = sibling(button, 2);
        button_1.__click = function(...$$args) {
          $$props.onHeaderIconClick?.apply(this, $$args);
        };
        var node_1 = child(button_1);
        CloseIcon(node_1, { width: "2rem", height: "2rem" });
        append($$anchor, div);
      }
      delegate(["click", "dblclick", "mousedown"]);
      var root$2 = from_html(`<div class="InfoItem svelte-1qbx53k"><h5 class="InfoItem__title svelte-1qbx53k"> </h5> <input class="InfoItem__input svelte-1qbx53k"/></div>`);
      function InfoItem($$anchor, $$props) {
        push($$props, true);
        let value = prop($$props, "value", 15);
        var div = root$2();
        var h5 = child(div);
        var text = child(h5);
        var input = sibling(h5, 2);
        template_effect(() => set_text(text, $$props.label));
        bind_value(input, value);
        append($$anchor, div);
        pop();
      }
      var root$1 = from_html(`<div class="Step svelte-1nopq0p"><div class="Step__Content svelte-1nopq0p"><!></div> <div class="Step__Actions"><!></div></div>`);
      function Step($$anchor, $$props) {
        var div = root$1();
        var div_1 = child(div);
        var node = child(div_1);
        snippet(node, () => $$props.contents ?? noop);
        var div_2 = sibling(div_1, 2);
        var node_1 = child(div_2);
        snippet(node_1, () => $$props.actions ?? noop);
        append($$anchor, div);
      }
      var root_1 = from_html(`<div class="StepContainer__StepContent svelte-2ce4eo"><!></div>`);
      var root = from_html(`<div class="StepsContainer svelte-2ce4eo"></div>`);
      function StepContainer($$anchor, $$props) {
        push($$props, true);
        let steps = prop($$props, "steps", 19, () => []);
        let totalSteps = user_derived(() => steps().length);
        let currentStep = state(0);
        const goNext = () => {
          set(currentStep, Math.min(get(currentStep) + 1, get(totalSteps) - 1), true);
        };
        const goPrevious = () => {
          set(currentStep, Math.max(get(currentStep) - 1, 0), true);
        };
        var div = root();
        each(div, 21, steps, index, ($$anchor2, step) => {
          var div_1 = root_1();
          let styles;
          var node = child(div_1);
          snippet(node, () => get(step), () => goNext, () => goPrevious);
          template_effect(($0) => styles = set_style(div_1, "", styles, $0), [() => ({ left: `${-get(currentStep) * 100}%` })]);
          append($$anchor2, div_1);
        });
        append($$anchor, div);
        pop();
      }
      function createDraggable(options) {
        const { storageKey, onToggle } = options;
        const loadPosition = () => {
          try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (typeof parsed.x === "number" && typeof parsed.y === "number") {
                return parsed;
              }
            }
          } catch {
          }
          return { x: 0, y: 0 };
        };
        const savePosition = (pos) => {
          try {
            localStorage.setItem(storageKey, JSON.stringify(pos));
          } catch {
          }
        };
        let isDragging = state(false);
        let hasDragged = state(false);
        let dragStart = state(proxy({ x: 0, y: 0 }));
        let position = state(proxy(loadPosition()));
        let clickTimeout = null;
        const reset = () => {
          set(position, { x: 0, y: 0 }, true);
          savePosition(get(position));
        };
        const onClick = () => {
          if (get(hasDragged)) {
            set(hasDragged, false);
            return;
          }
          if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            return;
          }
          clickTimeout = setTimeout(
            () => {
              clickTimeout = null;
              onToggle();
            },
            200
          );
        };
        const onDblClick = () => {
          if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
          }
          reset();
        };
        const onDragStart = (e) => {
          e.preventDefault();
          set(isDragging, true);
          set(hasDragged, false);
          set(
            dragStart,
            {
              x: e.clientX - get(position).x,
              y: e.clientY - get(position).y
            },
            true
          );
          const onMouseMove = (e2) => {
            if (!get(isDragging)) return;
            set(hasDragged, true);
            set(
              position,
              {
                x: e2.clientX - get(dragStart).x,
                y: e2.clientY - get(dragStart).y
              },
              true
            );
          };
          const onMouseUp = () => {
            set(isDragging, false);
            if (get(hasDragged)) {
              savePosition(get(position));
            }
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        };
        return {
          get position() {
            return get(position);
          },
          get isDragging() {
            return get(isDragging);
          },
          onClick,
          onDblClick,
          onDragStart,
          reset
        };
      }
      const normalizeData = (data) => {
        const max = Math.max(...data);
        return data.map((n) => Math.log10(n + 1) / Math.log10(max + 1));
      };
      const getAverageSample = (data, start, end) => {
        let sum = 0;
        for (let i = start; i < end; i++) {
          sum += Math.abs(data[i]);
        }
        return sum / (end - start);
      };
      const getFilteredData = (audioBuffer, samples) => {
        const rawData = audioBuffer.getChannelData(0);
        const blockSize = Math.max(1, Math.floor(rawData.length / samples));
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
          const start = i * blockSize;
          const end = start + blockSize;
          if (start >= rawData.length) {
            break;
          }
          const average = getAverageSample(rawData, start, end);
          filteredData.push(average);
        }
        return filteredData;
      };
      const getAudioWaveform = (audioBuffer, samples = 256) => {
        const filteredData = getFilteredData(audioBuffer, samples);
        const normalizedData = normalizeData(filteredData);
        return normalizedData;
      };
      const AppName = "Bilibili Music Extractor";
      const dummyText = /_哔哩哔哩.+/;
function assert$1(x) {
        if (!x) {
          throw new Error("Assertion failed.");
        }
      }
      const normalizeRotation = (rotation) => {
        const mappedRotation = (rotation % 360 + 360) % 360;
        if (mappedRotation === 0 || mappedRotation === 90 || mappedRotation === 180 || mappedRotation === 270) {
          return mappedRotation;
        } else {
          throw new Error(`Invalid rotation ${rotation}.`);
        }
      };
      const last = (arr) => {
        return arr && arr[arr.length - 1];
      };
      const isU32 = (value) => {
        return value >= 0 && value < 2 ** 32;
      };
      class Bitstream {
        constructor(bytes2) {
          this.bytes = bytes2;
          this.pos = 0;
        }
        seekToByte(byteOffset) {
          this.pos = 8 * byteOffset;
        }
        readBit() {
          const byteIndex = Math.floor(this.pos / 8);
          const byte = this.bytes[byteIndex] ?? 0;
          const bitIndex = 7 - (this.pos & 7);
          const bit = (byte & 1 << bitIndex) >> bitIndex;
          this.pos++;
          return bit;
        }
        readBits(n) {
          if (n === 1) {
            return this.readBit();
          }
          let result = 0;
          for (let i = 0; i < n; i++) {
            result <<= 1;
            result |= this.readBit();
          }
          return result;
        }
        writeBits(n, value) {
          const end = this.pos + n;
          for (let i = this.pos; i < end; i++) {
            const byteIndex = Math.floor(i / 8);
            let byte = this.bytes[byteIndex];
            const bitIndex = 7 - (i & 7);
            byte &= ~(1 << bitIndex);
            byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
            this.bytes[byteIndex] = byte;
          }
          this.pos = end;
        }
        readAlignedByte() {
          if (this.pos % 8 !== 0) {
            throw new Error("Bitstream is not byte-aligned.");
          }
          const byteIndex = this.pos / 8;
          const byte = this.bytes[byteIndex] ?? 0;
          this.pos += 8;
          return byte;
        }
        skipBits(n) {
          this.pos += n;
        }
        getBitsLeft() {
          return this.bytes.length * 8 - this.pos;
        }
        clone() {
          const clone = new Bitstream(this.bytes);
          clone.pos = this.pos;
          return clone;
        }
      }
      const readExpGolomb = (bitstream) => {
        let leadingZeroBits = 0;
        while (bitstream.readBits(1) === 0 && leadingZeroBits < 32) {
          leadingZeroBits++;
        }
        if (leadingZeroBits >= 32) {
          throw new Error("Invalid exponential-Golomb code.");
        }
        const result = (1 << leadingZeroBits) - 1 + bitstream.readBits(leadingZeroBits);
        return result;
      };
      const readSignedExpGolomb = (bitstream) => {
        const codeNum = readExpGolomb(bitstream);
        return (codeNum & 1) === 0 ? -(codeNum >> 1) : codeNum + 1 >> 1;
      };
      const toUint8Array = (source2) => {
        if (source2 instanceof Uint8Array) {
          return source2;
        } else if (source2 instanceof ArrayBuffer) {
          return new Uint8Array(source2);
        } else {
          return new Uint8Array(source2.buffer, source2.byteOffset, source2.byteLength);
        }
      };
      const toDataView = (source2) => {
        if (source2 instanceof DataView) {
          return source2;
        } else if (source2 instanceof ArrayBuffer) {
          return new DataView(source2);
        } else {
          return new DataView(source2.buffer, source2.byteOffset, source2.byteLength);
        }
      };
      const textDecoder = new TextDecoder();
      const textEncoder = new TextEncoder();
      const isIso88591Compatible = (text) => {
        for (let i = 0; i < text.length; i++) {
          const code = text.charCodeAt(i);
          if (code > 255) {
            return false;
          }
        }
        return true;
      };
      const invertObject = (object) => {
        return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
      };
      const COLOR_PRIMARIES_MAP = {
        bt709: 1,
bt470bg: 5,
smpte170m: 6,
bt2020: 9,
smpte432: 12
};
      invertObject(COLOR_PRIMARIES_MAP);
      const TRANSFER_CHARACTERISTICS_MAP = {
        "bt709": 1,
"smpte170m": 6,
"linear": 8,
"iec61966-2-1": 13,
"pg": 16,
"hlg": 18
};
      invertObject(TRANSFER_CHARACTERISTICS_MAP);
      const MATRIX_COEFFICIENTS_MAP = {
        "rgb": 0,
"bt709": 1,
"bt470bg": 5,
"smpte170m": 6,
"bt2020-ncl": 9
};
      invertObject(MATRIX_COEFFICIENTS_MAP);
      const colorSpaceIsComplete = (colorSpace) => {
        return !!colorSpace && !!colorSpace.primaries && !!colorSpace.transfer && !!colorSpace.matrix && colorSpace.fullRange !== void 0;
      };
      const isAllowSharedBufferSource = (x) => {
        return x instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && x instanceof SharedArrayBuffer || ArrayBuffer.isView(x);
      };
      class AsyncMutex {
        constructor() {
          this.currentPromise = Promise.resolve();
        }
        async acquire() {
          let resolver;
          const nextPromise = new Promise((resolve) => {
            resolver = resolve;
          });
          const currentPromiseAlias = this.currentPromise;
          this.currentPromise = nextPromise;
          await currentPromiseAlias;
          return resolver;
        }
      }
      const binarySearchExact = (arr, key, valueGetter) => {
        let low = 0;
        let high = arr.length - 1;
        let ans = -1;
        while (low <= high) {
          const mid = low + high >> 1;
          const midVal = valueGetter(arr[mid]);
          if (midVal === key) {
            ans = mid;
            high = mid - 1;
          } else if (midVal < key) {
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return ans;
      };
      const binarySearchLessOrEqual = (arr, key, valueGetter) => {
        let low = 0;
        let high = arr.length - 1;
        let ans = -1;
        while (low <= high) {
          const mid = low + (high - low + 1) / 2 | 0;
          const midVal = valueGetter(arr[mid]);
          if (midVal <= key) {
            ans = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return ans;
      };
      const insertSorted = (arr, item, valueGetter) => {
        const insertionIndex = binarySearchLessOrEqual(arr, valueGetter(item), valueGetter);
        arr.splice(insertionIndex + 1, 0, item);
      };
      const promiseWithResolvers = () => {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      };
      const toAsyncIterator = async function* (source2) {
        if (Symbol.iterator in source2) {
          yield* source2[Symbol.iterator]();
        } else {
          yield* source2[Symbol.asyncIterator]();
        }
      };
      const validateAnyIterable = (iterable) => {
        if (!(Symbol.iterator in iterable) && !(Symbol.asyncIterator in iterable)) {
          throw new TypeError("Argument must be an iterable or async iterable.");
        }
      };
      const assertNever = (x) => {
        throw new Error(`Unexpected value: ${x}`);
      };
      const getUint24 = (view2, byteOffset, littleEndian) => {
        const byte1 = view2.getUint8(byteOffset);
        const byte2 = view2.getUint8(byteOffset + 1);
        const byte3 = view2.getUint8(byteOffset + 2);
        if (littleEndian) {
          return byte1 | byte2 << 8 | byte3 << 16;
        } else {
          return byte1 << 16 | byte2 << 8 | byte3;
        }
      };
      const getInt24 = (view2, byteOffset, littleEndian) => {
        return getUint24(view2, byteOffset, littleEndian) << 8 >> 8;
      };
      const setUint24 = (view2, byteOffset, value, littleEndian) => {
        value = value >>> 0;
        value = value & 16777215;
        if (littleEndian) {
          view2.setUint8(byteOffset, value & 255);
          view2.setUint8(byteOffset + 1, value >>> 8 & 255);
          view2.setUint8(byteOffset + 2, value >>> 16 & 255);
        } else {
          view2.setUint8(byteOffset, value >>> 16 & 255);
          view2.setUint8(byteOffset + 1, value >>> 8 & 255);
          view2.setUint8(byteOffset + 2, value & 255);
        }
      };
      const setInt24 = (view2, byteOffset, value, littleEndian) => {
        value = clamp(value, -8388608, 8388607);
        if (value < 0) {
          value = value + 16777216 & 16777215;
        }
        setUint24(view2, byteOffset, value, littleEndian);
      };
      const mapAsyncGenerator = (generator, map) => {
        return {
          async next() {
            const result = await generator.next();
            if (result.done) {
              return { value: void 0, done: true };
            } else {
              return { value: map(result.value), done: false };
            }
          },
          return() {
            return generator.return();
          },
          throw(error) {
            return generator.throw(error);
          },
          [Symbol.asyncIterator]() {
            return this;
          }
        };
      };
      const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
      };
      const UNDETERMINED_LANGUAGE = "und";
      const ISO_639_2_REGEX = /^[a-z]{3}$/;
      const isIso639Dash2LanguageCode = (x) => {
        return ISO_639_2_REGEX.test(x);
      };
      const SECOND_TO_MICROSECOND_FACTOR = 1e6 * (1 + Number.EPSILON);
      const computeRationalApproximation = (x, maxDenominator) => {
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        let prevNumerator = 0, prevDenominator = 1;
        let currNumerator = 1, currDenominator = 0;
        let remainder = x;
        while (true) {
          const integer = Math.floor(remainder);
          const nextNumerator = integer * currNumerator + prevNumerator;
          const nextDenominator = integer * currDenominator + prevDenominator;
          if (nextDenominator > maxDenominator) {
            return {
              numerator: sign * currNumerator,
              denominator: currDenominator
            };
          }
          prevNumerator = currNumerator;
          prevDenominator = currDenominator;
          currNumerator = nextNumerator;
          currDenominator = nextDenominator;
          remainder = 1 / (remainder - integer);
          if (!isFinite(remainder)) {
            break;
          }
        }
        return {
          numerator: sign * currNumerator,
          denominator: currDenominator
        };
      };
      class CallSerializer {
        constructor() {
          this.currentPromise = Promise.resolve();
        }
        call(fn) {
          return this.currentPromise = this.currentPromise.then(fn);
        }
      }
      let isSafariCache = null;
      const isSafari = () => {
        if (isSafariCache !== null) {
          return isSafariCache;
        }
        const result = !!(typeof navigator !== "undefined" && navigator.vendor?.match(/apple/i) && !navigator.userAgent?.match(/crios/i) && !navigator.userAgent?.match(/fxios/i) && !navigator.userAgent?.match(/Opera|OPT\//));
        isSafariCache = result;
        return result;
      };
      let isFirefoxCache = null;
      const isFirefox = () => {
        if (isFirefoxCache !== null) {
          return isFirefoxCache;
        }
        return isFirefoxCache = typeof navigator !== "undefined" && navigator.userAgent?.includes("Firefox");
      };
      const coalesceIndex = (a, b) => {
        return a !== -1 ? a : b;
      };
      const closedIntervalsOverlap = (startA, endA, startB, endB) => {
        return startA <= endB && startB <= endA;
      };
      const keyValueIterator = function* (object) {
        for (const key in object) {
          const value = object[key];
          if (value === void 0) {
            continue;
          }
          yield { key, value };
        }
      };
class RichImageData {
constructor(data, mimeType) {
          this.data = data;
          this.mimeType = mimeType;
        }
      }
      const validateMetadataTags = (tags) => {
        if (!tags || typeof tags !== "object") {
          throw new TypeError("tags must be an object.");
        }
        if (tags.title !== void 0 && typeof tags.title !== "string") {
          throw new TypeError("tags.title, when provided, must be a string.");
        }
        if (tags.description !== void 0 && typeof tags.description !== "string") {
          throw new TypeError("tags.description, when provided, must be a string.");
        }
        if (tags.artist !== void 0 && typeof tags.artist !== "string") {
          throw new TypeError("tags.artist, when provided, must be a string.");
        }
        if (tags.album !== void 0 && typeof tags.album !== "string") {
          throw new TypeError("tags.album, when provided, must be a string.");
        }
        if (tags.albumArtist !== void 0 && typeof tags.albumArtist !== "string") {
          throw new TypeError("tags.albumArtist, when provided, must be a string.");
        }
        if (tags.trackNumber !== void 0 && (!Number.isInteger(tags.trackNumber) || tags.trackNumber <= 0)) {
          throw new TypeError("tags.trackNumber, when provided, must be a positive integer.");
        }
        if (tags.tracksTotal !== void 0 && (!Number.isInteger(tags.tracksTotal) || tags.tracksTotal <= 0)) {
          throw new TypeError("tags.tracksTotal, when provided, must be a positive integer.");
        }
        if (tags.discNumber !== void 0 && (!Number.isInteger(tags.discNumber) || tags.discNumber <= 0)) {
          throw new TypeError("tags.discNumber, when provided, must be a positive integer.");
        }
        if (tags.discsTotal !== void 0 && (!Number.isInteger(tags.discsTotal) || tags.discsTotal <= 0)) {
          throw new TypeError("tags.discsTotal, when provided, must be a positive integer.");
        }
        if (tags.genre !== void 0 && typeof tags.genre !== "string") {
          throw new TypeError("tags.genre, when provided, must be a string.");
        }
        if (tags.date !== void 0 && (!(tags.date instanceof Date) || Number.isNaN(tags.date.getTime()))) {
          throw new TypeError("tags.date, when provided, must be a valid Date.");
        }
        if (tags.lyrics !== void 0 && typeof tags.lyrics !== "string") {
          throw new TypeError("tags.lyrics, when provided, must be a string.");
        }
        if (tags.images !== void 0) {
          if (!Array.isArray(tags.images)) {
            throw new TypeError("tags.images, when provided, must be an array.");
          }
          for (const image of tags.images) {
            if (!image || typeof image !== "object") {
              throw new TypeError("Each image in tags.images must be an object.");
            }
            if (!(image.data instanceof Uint8Array)) {
              throw new TypeError("Each image.data must be a Uint8Array.");
            }
            if (typeof image.mimeType !== "string") {
              throw new TypeError("Each image.mimeType must be a string.");
            }
            if (!["coverFront", "coverBack", "unknown"].includes(image.kind)) {
              throw new TypeError("Each image.kind must be 'coverFront', 'coverBack', or 'unknown'.");
            }
          }
        }
        if (tags.comment !== void 0 && typeof tags.comment !== "string") {
          throw new TypeError("tags.comment, when provided, must be a string.");
        }
        if (tags.raw !== void 0) {
          if (!tags.raw || typeof tags.raw !== "object") {
            throw new TypeError("tags.raw, when provided, must be an object.");
          }
          for (const value of Object.values(tags.raw)) {
            if (value !== null && typeof value !== "string" && !(value instanceof Uint8Array) && !(value instanceof RichImageData)) {
              throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, or null.");
            }
          }
        }
      };
      const metadataTagsAreEmpty = (tags) => {
        return tags.title === void 0 && tags.description === void 0 && tags.artist === void 0 && tags.album === void 0 && tags.albumArtist === void 0 && tags.trackNumber === void 0 && tags.tracksTotal === void 0 && tags.discNumber === void 0 && tags.discsTotal === void 0 && tags.genre === void 0 && tags.date === void 0 && tags.lyrics === void 0 && (!tags.images || tags.images.length === 0) && tags.comment === void 0 && (tags.raw === void 0 || Object.keys(tags.raw).length === 0);
      };
const VIDEO_CODECS = [
        "avc",
        "hevc",
        "vp9",
        "av1",
        "vp8"
      ];
      const PCM_AUDIO_CODECS = [
        "pcm-s16",
"pcm-s16be",
        "pcm-s24",
        "pcm-s24be",
        "pcm-s32",
        "pcm-s32be",
        "pcm-f32",
        "pcm-f32be",
        "pcm-f64",
        "pcm-f64be",
        "pcm-u8",
        "pcm-s8",
        "ulaw",
        "alaw"
      ];
      const NON_PCM_AUDIO_CODECS = [
        "aac",
        "opus",
        "mp3",
        "vorbis",
        "flac"
      ];
      const AUDIO_CODECS = [
        ...NON_PCM_AUDIO_CODECS,
        ...PCM_AUDIO_CODECS
      ];
      const SUBTITLE_CODECS = [
        "webvtt"
      ];
      const AVC_LEVEL_TABLE = [
        { maxMacroblocks: 99, maxBitrate: 64e3, level: 10 },
{ maxMacroblocks: 396, maxBitrate: 192e3, level: 11 },
{ maxMacroblocks: 396, maxBitrate: 384e3, level: 12 },
{ maxMacroblocks: 396, maxBitrate: 768e3, level: 13 },
{ maxMacroblocks: 396, maxBitrate: 2e6, level: 20 },
{ maxMacroblocks: 792, maxBitrate: 4e6, level: 21 },
{ maxMacroblocks: 1620, maxBitrate: 4e6, level: 22 },
{ maxMacroblocks: 1620, maxBitrate: 1e7, level: 30 },
{ maxMacroblocks: 3600, maxBitrate: 14e6, level: 31 },
{ maxMacroblocks: 5120, maxBitrate: 2e7, level: 32 },
{ maxMacroblocks: 8192, maxBitrate: 2e7, level: 40 },
{ maxMacroblocks: 8192, maxBitrate: 5e7, level: 41 },
{ maxMacroblocks: 8704, maxBitrate: 5e7, level: 42 },
{ maxMacroblocks: 22080, maxBitrate: 135e6, level: 50 },
{ maxMacroblocks: 36864, maxBitrate: 24e7, level: 51 },
{ maxMacroblocks: 36864, maxBitrate: 24e7, level: 52 },
{ maxMacroblocks: 139264, maxBitrate: 24e7, level: 60 },
{ maxMacroblocks: 139264, maxBitrate: 48e7, level: 61 },
{ maxMacroblocks: 139264, maxBitrate: 8e8, level: 62 }
];
      const HEVC_LEVEL_TABLE = [
        { maxPictureSize: 36864, maxBitrate: 128e3, tier: "L", level: 30 },
{ maxPictureSize: 122880, maxBitrate: 15e5, tier: "L", level: 60 },
{ maxPictureSize: 245760, maxBitrate: 3e6, tier: "L", level: 63 },
{ maxPictureSize: 552960, maxBitrate: 6e6, tier: "L", level: 90 },
{ maxPictureSize: 983040, maxBitrate: 1e7, tier: "L", level: 93 },
{ maxPictureSize: 2228224, maxBitrate: 12e6, tier: "L", level: 120 },
{ maxPictureSize: 2228224, maxBitrate: 3e7, tier: "H", level: 120 },
{ maxPictureSize: 2228224, maxBitrate: 2e7, tier: "L", level: 123 },
{ maxPictureSize: 2228224, maxBitrate: 5e7, tier: "H", level: 123 },
{ maxPictureSize: 8912896, maxBitrate: 25e6, tier: "L", level: 150 },
{ maxPictureSize: 8912896, maxBitrate: 1e8, tier: "H", level: 150 },
{ maxPictureSize: 8912896, maxBitrate: 4e7, tier: "L", level: 153 },
{ maxPictureSize: 8912896, maxBitrate: 16e7, tier: "H", level: 153 },
{ maxPictureSize: 8912896, maxBitrate: 6e7, tier: "L", level: 156 },
{ maxPictureSize: 8912896, maxBitrate: 24e7, tier: "H", level: 156 },
{ maxPictureSize: 35651584, maxBitrate: 6e7, tier: "L", level: 180 },
{ maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 180 },
{ maxPictureSize: 35651584, maxBitrate: 12e7, tier: "L", level: 183 },
{ maxPictureSize: 35651584, maxBitrate: 48e7, tier: "H", level: 183 },
{ maxPictureSize: 35651584, maxBitrate: 24e7, tier: "L", level: 186 },
{ maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 186 }
];
      const VP9_LEVEL_TABLE = [
        { maxPictureSize: 36864, maxBitrate: 2e5, level: 10 },
{ maxPictureSize: 73728, maxBitrate: 8e5, level: 11 },
{ maxPictureSize: 122880, maxBitrate: 18e5, level: 20 },
{ maxPictureSize: 245760, maxBitrate: 36e5, level: 21 },
{ maxPictureSize: 552960, maxBitrate: 72e5, level: 30 },
{ maxPictureSize: 983040, maxBitrate: 12e6, level: 31 },
{ maxPictureSize: 2228224, maxBitrate: 18e6, level: 40 },
{ maxPictureSize: 2228224, maxBitrate: 3e7, level: 41 },
{ maxPictureSize: 8912896, maxBitrate: 6e7, level: 50 },
{ maxPictureSize: 8912896, maxBitrate: 12e7, level: 51 },
{ maxPictureSize: 8912896, maxBitrate: 18e7, level: 52 },
{ maxPictureSize: 35651584, maxBitrate: 18e7, level: 60 },
{ maxPictureSize: 35651584, maxBitrate: 24e7, level: 61 },
{ maxPictureSize: 35651584, maxBitrate: 48e7, level: 62 }
];
      const AV1_LEVEL_TABLE = [
        { maxPictureSize: 147456, maxBitrate: 15e5, tier: "M", level: 0 },
{ maxPictureSize: 278784, maxBitrate: 3e6, tier: "M", level: 1 },
{ maxPictureSize: 665856, maxBitrate: 6e6, tier: "M", level: 4 },
{ maxPictureSize: 1065024, maxBitrate: 1e7, tier: "M", level: 5 },
{ maxPictureSize: 2359296, maxBitrate: 12e6, tier: "M", level: 8 },
{ maxPictureSize: 2359296, maxBitrate: 3e7, tier: "H", level: 8 },
{ maxPictureSize: 2359296, maxBitrate: 2e7, tier: "M", level: 9 },
{ maxPictureSize: 2359296, maxBitrate: 5e7, tier: "H", level: 9 },
{ maxPictureSize: 8912896, maxBitrate: 3e7, tier: "M", level: 12 },
{ maxPictureSize: 8912896, maxBitrate: 1e8, tier: "H", level: 12 },
{ maxPictureSize: 8912896, maxBitrate: 4e7, tier: "M", level: 13 },
{ maxPictureSize: 8912896, maxBitrate: 16e7, tier: "H", level: 13 },
{ maxPictureSize: 8912896, maxBitrate: 6e7, tier: "M", level: 14 },
{ maxPictureSize: 8912896, maxBitrate: 24e7, tier: "H", level: 14 },
{ maxPictureSize: 35651584, maxBitrate: 6e7, tier: "M", level: 15 },
{ maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 15 },
{ maxPictureSize: 35651584, maxBitrate: 6e7, tier: "M", level: 16 },
{ maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 16 },
{ maxPictureSize: 35651584, maxBitrate: 1e8, tier: "M", level: 17 },
{ maxPictureSize: 35651584, maxBitrate: 48e7, tier: "H", level: 17 },
{ maxPictureSize: 35651584, maxBitrate: 16e7, tier: "M", level: 18 },
{ maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 18 },
{ maxPictureSize: 35651584, maxBitrate: 16e7, tier: "M", level: 19 },
{ maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 19 }
];
      const buildVideoCodecString = (codec, width, height, bitrate) => {
        if (codec === "avc") {
          const profileIndication = 100;
          const totalMacroblocks = Math.ceil(width / 16) * Math.ceil(height / 16);
          const levelInfo = AVC_LEVEL_TABLE.find((level) => totalMacroblocks <= level.maxMacroblocks && bitrate <= level.maxBitrate) ?? last(AVC_LEVEL_TABLE);
          const levelIndication = levelInfo ? levelInfo.level : 0;
          const hexProfileIndication = profileIndication.toString(16).padStart(2, "0");
          const hexProfileCompatibility = "00";
          const hexLevelIndication = levelIndication.toString(16).padStart(2, "0");
          return `avc1.${hexProfileIndication}${hexProfileCompatibility}${hexLevelIndication}`;
        } else if (codec === "hevc") {
          const profilePrefix = "";
          const profileIdc = 1;
          const compatibilityFlags = "6";
          const pictureSize = width * height;
          const levelInfo = HEVC_LEVEL_TABLE.find((level) => pictureSize <= level.maxPictureSize && bitrate <= level.maxBitrate) ?? last(HEVC_LEVEL_TABLE);
          const constraintFlags = "B0";
          return `hev1.${profilePrefix}${profileIdc}.${compatibilityFlags}.${levelInfo.tier}${levelInfo.level}.${constraintFlags}`;
        } else if (codec === "vp8") {
          return "vp8";
        } else if (codec === "vp9") {
          const profile = "00";
          const pictureSize = width * height;
          const levelInfo = VP9_LEVEL_TABLE.find((level) => pictureSize <= level.maxPictureSize && bitrate <= level.maxBitrate) ?? last(VP9_LEVEL_TABLE);
          const bitDepth = "08";
          return `vp09.${profile}.${levelInfo.level.toString().padStart(2, "0")}.${bitDepth}`;
        } else if (codec === "av1") {
          const profile = 0;
          const pictureSize = width * height;
          const levelInfo = AV1_LEVEL_TABLE.find((level2) => pictureSize <= level2.maxPictureSize && bitrate <= level2.maxBitrate) ?? last(AV1_LEVEL_TABLE);
          const level = levelInfo.level.toString().padStart(2, "0");
          const bitDepth = "08";
          return `av01.${profile}.${level}${levelInfo.tier}.${bitDepth}`;
        }
        throw new TypeError(`Unhandled codec '${codec}'.`);
      };
      const generateAv1CodecConfigurationFromCodecString = (codecString) => {
        const parts = codecString.split(".");
        const marker = 1;
        const version = 1;
        const firstByte = (marker << 7) + version;
        const profile = Number(parts[1]);
        const levelAndTier = parts[2];
        const level = Number(levelAndTier.slice(0, -1));
        const secondByte = (profile << 5) + level;
        const tier = levelAndTier.slice(-1) === "H" ? 1 : 0;
        const bitDepth = Number(parts[3]);
        const highBitDepth = bitDepth === 8 ? 0 : 1;
        const twelveBit = 0;
        const monochrome = parts[4] ? Number(parts[4]) : 0;
        const chromaSubsamplingX = parts[5] ? Number(parts[5][0]) : 1;
        const chromaSubsamplingY = parts[5] ? Number(parts[5][1]) : 1;
        const chromaSamplePosition = parts[5] ? Number(parts[5][2]) : 0;
        const thirdByte = (tier << 7) + (highBitDepth << 6) + (twelveBit << 5) + (monochrome << 4) + (chromaSubsamplingX << 3) + (chromaSubsamplingY << 2) + chromaSamplePosition;
        const initialPresentationDelayPresent = 0;
        const fourthByte = initialPresentationDelayPresent;
        return [firstByte, secondByte, thirdByte, fourthByte];
      };
      const buildAudioCodecString = (codec, numberOfChannels, sampleRate) => {
        if (codec === "aac") {
          if (numberOfChannels >= 2 && sampleRate <= 24e3) {
            return "mp4a.40.29";
          }
          if (sampleRate <= 24e3) {
            return "mp4a.40.5";
          }
          return "mp4a.40.2";
        } else if (codec === "mp3") {
          return "mp3";
        } else if (codec === "opus") {
          return "opus";
        } else if (codec === "vorbis") {
          return "vorbis";
        } else if (codec === "flac") {
          return "flac";
        } else if (PCM_AUDIO_CODECS.includes(codec)) {
          return codec;
        }
        throw new TypeError(`Unhandled codec '${codec}'.`);
      };
      const PCM_CODEC_REGEX = /^pcm-([usf])(\d+)+(be)?$/;
      const parsePcmCodec = (codec) => {
        assert$1(PCM_AUDIO_CODECS.includes(codec));
        if (codec === "ulaw") {
          return { dataType: "ulaw", sampleSize: 1, littleEndian: true, silentValue: 255 };
        } else if (codec === "alaw") {
          return { dataType: "alaw", sampleSize: 1, littleEndian: true, silentValue: 213 };
        }
        const match = PCM_CODEC_REGEX.exec(codec);
        assert$1(match);
        let dataType;
        if (match[1] === "u") {
          dataType = "unsigned";
        } else if (match[1] === "s") {
          dataType = "signed";
        } else {
          dataType = "float";
        }
        const sampleSize = Number(match[2]) / 8;
        const littleEndian = match[3] !== "be";
        const silentValue = codec === "pcm-u8" ? 2 ** 7 : 0;
        return { dataType, sampleSize, littleEndian, silentValue };
      };
      const inferCodecFromCodecString = (codecString) => {
        if (codecString.startsWith("avc1") || codecString.startsWith("avc3")) {
          return "avc";
        } else if (codecString.startsWith("hev1") || codecString.startsWith("hvc1")) {
          return "hevc";
        } else if (codecString === "vp8") {
          return "vp8";
        } else if (codecString.startsWith("vp09")) {
          return "vp9";
        } else if (codecString.startsWith("av01")) {
          return "av1";
        }
        if (codecString.startsWith("mp4a.40") || codecString === "mp4a.67") {
          return "aac";
        } else if (codecString === "mp3" || codecString === "mp4a.69" || codecString === "mp4a.6B" || codecString === "mp4a.6b") {
          return "mp3";
        } else if (codecString === "opus") {
          return "opus";
        } else if (codecString === "vorbis") {
          return "vorbis";
        } else if (codecString === "flac") {
          return "flac";
        } else if (codecString === "ulaw") {
          return "ulaw";
        } else if (codecString === "alaw") {
          return "alaw";
        } else if (PCM_CODEC_REGEX.test(codecString)) {
          return codecString;
        }
        if (codecString === "webvtt") {
          return "webvtt";
        }
        return null;
      };
      const getVideoEncoderConfigExtension = (codec) => {
        if (codec === "avc") {
          return {
            avc: {
              format: "avc"
}
          };
        } else if (codec === "hevc") {
          return {
            hevc: {
              format: "hevc"
}
          };
        }
        return {};
      };
      const getAudioEncoderConfigExtension = (codec) => {
        if (codec === "aac") {
          return {
            aac: {
              format: "aac"
}
          };
        } else if (codec === "opus") {
          return {
            opus: {
              format: "opus"
            }
          };
        }
        return {};
      };
      const VALID_VIDEO_CODEC_STRING_PREFIXES = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01"];
      const AVC_CODEC_STRING_REGEX = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/;
      const HEVC_CODEC_STRING_REGEX = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/;
      const VP9_CODEC_STRING_REGEX = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/;
      const AV1_CODEC_STRING_REGEX = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/;
      const validateVideoChunkMetadata = (metadata) => {
        if (!metadata) {
          throw new TypeError("Video chunk metadata must be provided.");
        }
        if (typeof metadata !== "object") {
          throw new TypeError("Video chunk metadata must be an object.");
        }
        if (!metadata.decoderConfig) {
          throw new TypeError("Video chunk metadata must include a decoder configuration.");
        }
        if (typeof metadata.decoderConfig !== "object") {
          throw new TypeError("Video chunk metadata decoder configuration must be an object.");
        }
        if (typeof metadata.decoderConfig.codec !== "string") {
          throw new TypeError("Video chunk metadata decoder configuration must specify a codec string.");
        }
        if (!VALID_VIDEO_CODEC_STRING_PREFIXES.some((prefix) => metadata.decoderConfig.codec.startsWith(prefix))) {
          throw new TypeError("Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the WebCodecs Codec Registry.");
        }
        if (!Number.isInteger(metadata.decoderConfig.codedWidth) || metadata.decoderConfig.codedWidth <= 0) {
          throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).");
        }
        if (!Number.isInteger(metadata.decoderConfig.codedHeight) || metadata.decoderConfig.codedHeight <= 0) {
          throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).");
        }
        if (metadata.decoderConfig.description !== void 0) {
          if (!isAllowSharedBufferSource(metadata.decoderConfig.description)) {
            throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
          }
        }
        if (metadata.decoderConfig.colorSpace !== void 0) {
          const { colorSpace } = metadata.decoderConfig;
          if (typeof colorSpace !== "object") {
            throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
          }
          const primariesValues = Object.keys(COLOR_PRIMARIES_MAP);
          if (colorSpace.primaries != null && !primariesValues.includes(colorSpace.primaries)) {
            throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${primariesValues.join(", ")}.`);
          }
          const transferValues = Object.keys(TRANSFER_CHARACTERISTICS_MAP);
          if (colorSpace.transfer != null && !transferValues.includes(colorSpace.transfer)) {
            throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${transferValues.join(", ")}.`);
          }
          const matrixValues = Object.keys(MATRIX_COEFFICIENTS_MAP);
          if (colorSpace.matrix != null && !matrixValues.includes(colorSpace.matrix)) {
            throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${matrixValues.join(", ")}.`);
          }
          if (colorSpace.fullRange != null && typeof colorSpace.fullRange !== "boolean") {
            throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
          }
        }
        if (metadata.decoderConfig.codec.startsWith("avc1") || metadata.decoderConfig.codec.startsWith("avc3")) {
          if (!AVC_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
          }
        } else if (metadata.decoderConfig.codec.startsWith("hev1") || metadata.decoderConfig.codec.startsWith("hvc1")) {
          if (!HEVC_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
          }
        } else if (metadata.decoderConfig.codec.startsWith("vp8")) {
          if (metadata.decoderConfig.codec !== "vp8") {
            throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
          }
        } else if (metadata.decoderConfig.codec.startsWith("vp09")) {
          if (!VP9_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
          }
        } else if (metadata.decoderConfig.codec.startsWith("av01")) {
          if (!AV1_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
          }
        }
      };
      const VALID_AUDIO_CODEC_STRING_PREFIXES = ["mp4a", "mp3", "opus", "vorbis", "flac", "ulaw", "alaw", "pcm"];
      const validateAudioChunkMetadata = (metadata) => {
        if (!metadata) {
          throw new TypeError("Audio chunk metadata must be provided.");
        }
        if (typeof metadata !== "object") {
          throw new TypeError("Audio chunk metadata must be an object.");
        }
        if (!metadata.decoderConfig) {
          throw new TypeError("Audio chunk metadata must include a decoder configuration.");
        }
        if (typeof metadata.decoderConfig !== "object") {
          throw new TypeError("Audio chunk metadata decoder configuration must be an object.");
        }
        if (typeof metadata.decoderConfig.codec !== "string") {
          throw new TypeError("Audio chunk metadata decoder configuration must specify a codec string.");
        }
        if (!VALID_AUDIO_CODEC_STRING_PREFIXES.some((prefix) => metadata.decoderConfig.codec.startsWith(prefix))) {
          throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the WebCodecs Codec Registry.");
        }
        if (!Number.isInteger(metadata.decoderConfig.sampleRate) || metadata.decoderConfig.sampleRate <= 0) {
          throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
        }
        if (!Number.isInteger(metadata.decoderConfig.numberOfChannels) || metadata.decoderConfig.numberOfChannels <= 0) {
          throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
        }
        if (metadata.decoderConfig.description !== void 0) {
          if (!isAllowSharedBufferSource(metadata.decoderConfig.description)) {
            throw new TypeError("Audio chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
          }
        }
        if (metadata.decoderConfig.codec.startsWith("mp4a") && metadata.decoderConfig.codec !== "mp4a.69" && metadata.decoderConfig.codec !== "mp4a.6B" && metadata.decoderConfig.codec !== "mp4a.6b") {
          const validStrings = ["mp4a.40.2", "mp4a.40.02", "mp4a.40.5", "mp4a.40.05", "mp4a.40.29", "mp4a.67"];
          if (!validStrings.includes(metadata.decoderConfig.codec)) {
            throw new TypeError("Audio chunk metadata decoder configuration codec string for AAC must be a valid AAC codec string as specified in https://www.w3.org/TR/webcodecs-aac-codec-registration/.");
          }
          if (!metadata.decoderConfig.description) {
            throw new TypeError("Audio chunk metadata decoder configuration for AAC must include a description, which is expected to be an AudioSpecificConfig as specified in ISO 14496-3.");
          }
        } else if (metadata.decoderConfig.codec.startsWith("mp3") || metadata.decoderConfig.codec.startsWith("mp4a")) {
          if (metadata.decoderConfig.codec !== "mp3" && metadata.decoderConfig.codec !== "mp4a.69" && metadata.decoderConfig.codec !== "mp4a.6B" && metadata.decoderConfig.codec !== "mp4a.6b") {
            throw new TypeError('Audio chunk metadata decoder configuration codec string for MP3 must be "mp3", "mp4a.69" or "mp4a.6B".');
          }
        } else if (metadata.decoderConfig.codec.startsWith("opus")) {
          if (metadata.decoderConfig.codec !== "opus") {
            throw new TypeError('Audio chunk metadata decoder configuration codec string for Opus must be "opus".');
          }
          if (metadata.decoderConfig.description && metadata.decoderConfig.description.byteLength < 18) {
            throw new TypeError("Audio chunk metadata decoder configuration description, when specified, is expected to be an Identification Header as specified in Section 5.1 of RFC 7845.");
          }
        } else if (metadata.decoderConfig.codec.startsWith("vorbis")) {
          if (metadata.decoderConfig.codec !== "vorbis") {
            throw new TypeError('Audio chunk metadata decoder configuration codec string for Vorbis must be "vorbis".');
          }
          if (!metadata.decoderConfig.description) {
            throw new TypeError("Audio chunk metadata decoder configuration for Vorbis must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-vorbis-codec-registration/.");
          }
        } else if (metadata.decoderConfig.codec.startsWith("flac")) {
          if (metadata.decoderConfig.codec !== "flac") {
            throw new TypeError('Audio chunk metadata decoder configuration codec string for FLAC must be "flac".');
          }
          const minDescriptionSize = 4 + 4 + 34;
          if (!metadata.decoderConfig.description || metadata.decoderConfig.description.byteLength < minDescriptionSize) {
            throw new TypeError("Audio chunk metadata decoder configuration for FLAC must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-flac-codec-registration/.");
          }
        } else if (metadata.decoderConfig.codec.startsWith("pcm") || metadata.decoderConfig.codec.startsWith("ulaw") || metadata.decoderConfig.codec.startsWith("alaw")) {
          if (!PCM_AUDIO_CODECS.includes(metadata.decoderConfig.codec)) {
            throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${PCM_AUDIO_CODECS.join(", ")}).`);
          }
        }
      };
      const validateSubtitleMetadata = (metadata) => {
        if (!metadata) {
          throw new TypeError("Subtitle metadata must be provided.");
        }
        if (typeof metadata !== "object") {
          throw new TypeError("Subtitle metadata must be an object.");
        }
        if (!metadata.config) {
          throw new TypeError("Subtitle metadata must include a config object.");
        }
        if (typeof metadata.config !== "object") {
          throw new TypeError("Subtitle metadata config must be an object.");
        }
        if (typeof metadata.config.description !== "string") {
          throw new TypeError("Subtitle metadata config description must be a string.");
        }
      };
class Muxer {
        constructor(output) {
          this.mutex = new AsyncMutex();
          this.firstMediaStreamTimestamp = null;
          this.trackTimestampInfo = new WeakMap();
          this.output = output;
        }
onTrackClose(track) {
        }
        validateAndNormalizeTimestamp(track, timestampInSeconds, isKeyFrame) {
          timestampInSeconds += track.source._timestampOffset;
          let timestampInfo = this.trackTimestampInfo.get(track);
          if (!timestampInfo) {
            if (!isKeyFrame) {
              throw new Error("First frame must be a key frame.");
            }
            timestampInfo = {
              maxTimestamp: timestampInSeconds,
              maxTimestampBeforeLastKeyFrame: timestampInSeconds
            };
            this.trackTimestampInfo.set(track, timestampInfo);
          }
          if (timestampInSeconds < 0) {
            throw new Error(`Timestamps must be non-negative (got ${timestampInSeconds}s).`);
          }
          if (isKeyFrame) {
            timestampInfo.maxTimestampBeforeLastKeyFrame = timestampInfo.maxTimestamp;
          }
          if (timestampInSeconds < timestampInfo.maxTimestampBeforeLastKeyFrame) {
            throw new Error(`Timestamps cannot be smaller than the highest timestamp of the previous GOP (a GOP begins with a key frame and ends right before the next key frame). Got ${timestampInSeconds}s, but highest timestamp is ${timestampInfo.maxTimestampBeforeLastKeyFrame}s.`);
          }
          timestampInfo.maxTimestamp = Math.max(timestampInfo.maxTimestamp, timestampInSeconds);
          return timestampInSeconds;
        }
      }
var AvcNalUnitType;
      (function(AvcNalUnitType2) {
        AvcNalUnitType2[AvcNalUnitType2["IDR"] = 5] = "IDR";
        AvcNalUnitType2[AvcNalUnitType2["SPS"] = 7] = "SPS";
        AvcNalUnitType2[AvcNalUnitType2["PPS"] = 8] = "PPS";
        AvcNalUnitType2[AvcNalUnitType2["SPS_EXT"] = 13] = "SPS_EXT";
      })(AvcNalUnitType || (AvcNalUnitType = {}));
      var HevcNalUnitType;
      (function(HevcNalUnitType2) {
        HevcNalUnitType2[HevcNalUnitType2["RASL_N"] = 8] = "RASL_N";
        HevcNalUnitType2[HevcNalUnitType2["RASL_R"] = 9] = "RASL_R";
        HevcNalUnitType2[HevcNalUnitType2["BLA_W_LP"] = 16] = "BLA_W_LP";
        HevcNalUnitType2[HevcNalUnitType2["RSV_IRAP_VCL23"] = 23] = "RSV_IRAP_VCL23";
        HevcNalUnitType2[HevcNalUnitType2["VPS_NUT"] = 32] = "VPS_NUT";
        HevcNalUnitType2[HevcNalUnitType2["SPS_NUT"] = 33] = "SPS_NUT";
        HevcNalUnitType2[HevcNalUnitType2["PPS_NUT"] = 34] = "PPS_NUT";
        HevcNalUnitType2[HevcNalUnitType2["PREFIX_SEI_NUT"] = 39] = "PREFIX_SEI_NUT";
        HevcNalUnitType2[HevcNalUnitType2["SUFFIX_SEI_NUT"] = 40] = "SUFFIX_SEI_NUT";
      })(HevcNalUnitType || (HevcNalUnitType = {}));
      const findNalUnitsInAnnexB = (packetData) => {
        const nalUnits = [];
        let i = 0;
        while (i < packetData.length) {
          let startCodePos = -1;
          let startCodeLength = 0;
          for (let j = i; j < packetData.length - 3; j++) {
            if (packetData[j] === 0 && packetData[j + 1] === 0 && packetData[j + 2] === 1) {
              startCodePos = j;
              startCodeLength = 3;
              break;
            }
            if (j < packetData.length - 4 && packetData[j] === 0 && packetData[j + 1] === 0 && packetData[j + 2] === 0 && packetData[j + 3] === 1) {
              startCodePos = j;
              startCodeLength = 4;
              break;
            }
          }
          if (startCodePos === -1) {
            break;
          }
          if (i > 0 && startCodePos > i) {
            const nalData = packetData.subarray(i, startCodePos);
            if (nalData.length > 0) {
              nalUnits.push(nalData);
            }
          }
          i = startCodePos + startCodeLength;
        }
        if (i < packetData.length) {
          const nalData = packetData.subarray(i);
          if (nalData.length > 0) {
            nalUnits.push(nalData);
          }
        }
        return nalUnits;
      };
      const findNalUnitsInLengthPrefixed = (packetData, lengthSize) => {
        const nalUnits = [];
        let offset = 0;
        const dataView = new DataView(packetData.buffer, packetData.byteOffset, packetData.byteLength);
        while (offset + lengthSize <= packetData.length) {
          let nalUnitLength;
          if (lengthSize === 1) {
            nalUnitLength = dataView.getUint8(offset);
          } else if (lengthSize === 2) {
            nalUnitLength = dataView.getUint16(offset, false);
          } else if (lengthSize === 3) {
            nalUnitLength = getUint24(dataView, offset, false);
          } else if (lengthSize === 4) {
            nalUnitLength = dataView.getUint32(offset, false);
          } else {
            assertNever(lengthSize);
            assert$1(false);
          }
          offset += lengthSize;
          const nalUnit = packetData.subarray(offset, offset + nalUnitLength);
          nalUnits.push(nalUnit);
          offset += nalUnitLength;
        }
        return nalUnits;
      };
      const removeEmulationPreventionBytes = (data) => {
        const result = [];
        const len = data.length;
        for (let i = 0; i < len; i++) {
          if (i + 2 < len && data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 3) {
            result.push(0, 0);
            i += 2;
          } else {
            result.push(data[i]);
          }
        }
        return new Uint8Array(result);
      };
      const transformAnnexBToLengthPrefixed = (packetData) => {
        const NAL_UNIT_LENGTH_SIZE = 4;
        const nalUnits = findNalUnitsInAnnexB(packetData);
        if (nalUnits.length === 0) {
          return null;
        }
        let totalSize = 0;
        for (const nalUnit of nalUnits) {
          totalSize += NAL_UNIT_LENGTH_SIZE + nalUnit.byteLength;
        }
        const avccData = new Uint8Array(totalSize);
        const dataView = new DataView(avccData.buffer);
        let offset = 0;
        for (const nalUnit of nalUnits) {
          const length = nalUnit.byteLength;
          dataView.setUint32(offset, length, false);
          offset += 4;
          avccData.set(nalUnit, offset);
          offset += nalUnit.byteLength;
        }
        return avccData;
      };
      const extractAvcNalUnits = (packetData, decoderConfig) => {
        if (decoderConfig.description) {
          const bytes2 = toUint8Array(decoderConfig.description);
          const lengthSizeMinusOne = bytes2[4] & 3;
          const lengthSize = lengthSizeMinusOne + 1;
          return findNalUnitsInLengthPrefixed(packetData, lengthSize);
        } else {
          return findNalUnitsInAnnexB(packetData);
        }
      };
      const extractNalUnitTypeForAvc = (data) => {
        return data[0] & 31;
      };
      const extractAvcDecoderConfigurationRecord = (packetData) => {
        try {
          const nalUnits = findNalUnitsInAnnexB(packetData);
          const spsUnits = nalUnits.filter((unit) => extractNalUnitTypeForAvc(unit) === AvcNalUnitType.SPS);
          const ppsUnits = nalUnits.filter((unit) => extractNalUnitTypeForAvc(unit) === AvcNalUnitType.PPS);
          const spsExtUnits = nalUnits.filter((unit) => extractNalUnitTypeForAvc(unit) === AvcNalUnitType.SPS_EXT);
          if (spsUnits.length === 0) {
            return null;
          }
          if (ppsUnits.length === 0) {
            return null;
          }
          const spsData = spsUnits[0];
          const bitstream = new Bitstream(removeEmulationPreventionBytes(spsData));
          bitstream.skipBits(1);
          bitstream.skipBits(2);
          const nal_unit_type = bitstream.readBits(5);
          if (nal_unit_type !== 7) {
            console.error("Invalid SPS NAL unit type");
            return null;
          }
          const profile_idc = bitstream.readAlignedByte();
          const constraint_flags = bitstream.readAlignedByte();
          const level_idc = bitstream.readAlignedByte();
          const record = {
            configurationVersion: 1,
            avcProfileIndication: profile_idc,
            profileCompatibility: constraint_flags,
            avcLevelIndication: level_idc,
            lengthSizeMinusOne: 3,
sequenceParameterSets: spsUnits,
            pictureParameterSets: ppsUnits,
            chromaFormat: null,
            bitDepthLumaMinus8: null,
            bitDepthChromaMinus8: null,
            sequenceParameterSetExt: null
          };
          if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 || profile_idc === 144) {
            readExpGolomb(bitstream);
            const chroma_format_idc = readExpGolomb(bitstream);
            if (chroma_format_idc === 3) {
              bitstream.skipBits(1);
            }
            const bit_depth_luma_minus8 = readExpGolomb(bitstream);
            const bit_depth_chroma_minus8 = readExpGolomb(bitstream);
            record.chromaFormat = chroma_format_idc;
            record.bitDepthLumaMinus8 = bit_depth_luma_minus8;
            record.bitDepthChromaMinus8 = bit_depth_chroma_minus8;
            record.sequenceParameterSetExt = spsExtUnits;
          }
          return record;
        } catch (error) {
          console.error("Error building AVC Decoder Configuration Record:", error);
          return null;
        }
      };
      const serializeAvcDecoderConfigurationRecord = (record) => {
        const bytes2 = [];
        bytes2.push(record.configurationVersion);
        bytes2.push(record.avcProfileIndication);
        bytes2.push(record.profileCompatibility);
        bytes2.push(record.avcLevelIndication);
        bytes2.push(252 | record.lengthSizeMinusOne & 3);
        bytes2.push(224 | record.sequenceParameterSets.length & 31);
        for (const sps of record.sequenceParameterSets) {
          const length = sps.byteLength;
          bytes2.push(length >> 8);
          bytes2.push(length & 255);
          for (let i = 0; i < length; i++) {
            bytes2.push(sps[i]);
          }
        }
        bytes2.push(record.pictureParameterSets.length);
        for (const pps of record.pictureParameterSets) {
          const length = pps.byteLength;
          bytes2.push(length >> 8);
          bytes2.push(length & 255);
          for (let i = 0; i < length; i++) {
            bytes2.push(pps[i]);
          }
        }
        if (record.avcProfileIndication === 100 || record.avcProfileIndication === 110 || record.avcProfileIndication === 122 || record.avcProfileIndication === 144) {
          assert$1(record.chromaFormat !== null);
          assert$1(record.bitDepthLumaMinus8 !== null);
          assert$1(record.bitDepthChromaMinus8 !== null);
          assert$1(record.sequenceParameterSetExt !== null);
          bytes2.push(252 | record.chromaFormat & 3);
          bytes2.push(248 | record.bitDepthLumaMinus8 & 7);
          bytes2.push(248 | record.bitDepthChromaMinus8 & 7);
          bytes2.push(record.sequenceParameterSetExt.length);
          for (const spsExt of record.sequenceParameterSetExt) {
            const length = spsExt.byteLength;
            bytes2.push(length >> 8);
            bytes2.push(length & 255);
            for (let i = 0; i < length; i++) {
              bytes2.push(spsExt[i]);
            }
          }
        }
        return new Uint8Array(bytes2);
      };
      const extractHevcNalUnits = (packetData, decoderConfig) => {
        if (decoderConfig.description) {
          const bytes2 = toUint8Array(decoderConfig.description);
          const lengthSizeMinusOne = bytes2[21] & 3;
          const lengthSize = lengthSizeMinusOne + 1;
          return findNalUnitsInLengthPrefixed(packetData, lengthSize);
        } else {
          return findNalUnitsInAnnexB(packetData);
        }
      };
      const extractNalUnitTypeForHevc = (data) => {
        return data[0] >> 1 & 63;
      };
      const extractHevcDecoderConfigurationRecord = (packetData) => {
        try {
          const nalUnits = findNalUnitsInAnnexB(packetData);
          const vpsUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.VPS_NUT);
          const spsUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.SPS_NUT);
          const ppsUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.PPS_NUT);
          const seiUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.PREFIX_SEI_NUT || extractNalUnitTypeForHevc(unit) === HevcNalUnitType.SUFFIX_SEI_NUT);
          if (spsUnits.length === 0 || ppsUnits.length === 0)
            return null;
          const sps = spsUnits[0];
          const bitstream = new Bitstream(removeEmulationPreventionBytes(sps));
          bitstream.skipBits(16);
          bitstream.readBits(4);
          const sps_max_sub_layers_minus1 = bitstream.readBits(3);
          const sps_temporal_id_nesting_flag = bitstream.readBits(1);
          const { general_profile_space, general_tier_flag, general_profile_idc, general_profile_compatibility_flags, general_constraint_indicator_flags, general_level_idc } = parseProfileTierLevel(bitstream, sps_max_sub_layers_minus1);
          readExpGolomb(bitstream);
          const chroma_format_idc = readExpGolomb(bitstream);
          if (chroma_format_idc === 3)
            bitstream.skipBits(1);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          if (bitstream.readBits(1)) {
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
          }
          const bit_depth_luma_minus8 = readExpGolomb(bitstream);
          const bit_depth_chroma_minus8 = readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          const sps_sub_layer_ordering_info_present_flag = bitstream.readBits(1);
          const maxNum = sps_sub_layer_ordering_info_present_flag ? 0 : sps_max_sub_layers_minus1;
          for (let i = maxNum; i <= sps_max_sub_layers_minus1; i++) {
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
          }
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          if (bitstream.readBits(1)) {
            if (bitstream.readBits(1)) {
              skipScalingListData(bitstream);
            }
          }
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          if (bitstream.readBits(1)) {
            bitstream.skipBits(4);
            bitstream.skipBits(4);
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
            bitstream.skipBits(1);
          }
          const num_short_term_ref_pic_sets = readExpGolomb(bitstream);
          skipAllStRefPicSets(bitstream, num_short_term_ref_pic_sets);
          if (bitstream.readBits(1)) {
            const num_long_term_ref_pics_sps = readExpGolomb(bitstream);
            for (let i = 0; i < num_long_term_ref_pics_sps; i++) {
              readExpGolomb(bitstream);
              bitstream.skipBits(1);
            }
          }
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          let min_spatial_segmentation_idc = 0;
          if (bitstream.readBits(1)) {
            min_spatial_segmentation_idc = parseVuiForMinSpatialSegmentationIdc(bitstream, sps_max_sub_layers_minus1);
          }
          let parallelismType = 0;
          if (ppsUnits.length > 0) {
            const pps = ppsUnits[0];
            const ppsBitstream = new Bitstream(removeEmulationPreventionBytes(pps));
            ppsBitstream.skipBits(16);
            readExpGolomb(ppsBitstream);
            readExpGolomb(ppsBitstream);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(3);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            readExpGolomb(ppsBitstream);
            readExpGolomb(ppsBitstream);
            readSignedExpGolomb(ppsBitstream);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            if (ppsBitstream.readBits(1)) {
              readExpGolomb(ppsBitstream);
            }
            readSignedExpGolomb(ppsBitstream);
            readSignedExpGolomb(ppsBitstream);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            const tiles_enabled_flag = ppsBitstream.readBits(1);
            const entropy_coding_sync_enabled_flag = ppsBitstream.readBits(1);
            if (!tiles_enabled_flag && !entropy_coding_sync_enabled_flag)
              parallelismType = 0;
            else if (tiles_enabled_flag && !entropy_coding_sync_enabled_flag)
              parallelismType = 2;
            else if (!tiles_enabled_flag && entropy_coding_sync_enabled_flag)
              parallelismType = 3;
            else
              parallelismType = 0;
          }
          const arrays = [
            ...vpsUnits.length ? [
              {
                arrayCompleteness: 1,
                nalUnitType: HevcNalUnitType.VPS_NUT,
                nalUnits: vpsUnits
              }
            ] : [],
            ...spsUnits.length ? [
              {
                arrayCompleteness: 1,
                nalUnitType: HevcNalUnitType.SPS_NUT,
                nalUnits: spsUnits
              }
            ] : [],
            ...ppsUnits.length ? [
              {
                arrayCompleteness: 1,
                nalUnitType: HevcNalUnitType.PPS_NUT,
                nalUnits: ppsUnits
              }
            ] : [],
            ...seiUnits.length ? [
              {
                arrayCompleteness: 1,
                nalUnitType: extractNalUnitTypeForHevc(seiUnits[0]),
                nalUnits: seiUnits
              }
            ] : []
          ];
          const record = {
            configurationVersion: 1,
            generalProfileSpace: general_profile_space,
            generalTierFlag: general_tier_flag,
            generalProfileIdc: general_profile_idc,
            generalProfileCompatibilityFlags: general_profile_compatibility_flags,
            generalConstraintIndicatorFlags: general_constraint_indicator_flags,
            generalLevelIdc: general_level_idc,
            minSpatialSegmentationIdc: min_spatial_segmentation_idc,
            parallelismType,
            chromaFormatIdc: chroma_format_idc,
            bitDepthLumaMinus8: bit_depth_luma_minus8,
            bitDepthChromaMinus8: bit_depth_chroma_minus8,
            avgFrameRate: 0,
            constantFrameRate: 0,
            numTemporalLayers: sps_max_sub_layers_minus1 + 1,
            temporalIdNested: sps_temporal_id_nesting_flag,
            lengthSizeMinusOne: 3,
            arrays
          };
          return record;
        } catch (error) {
          console.error("Error building HEVC Decoder Configuration Record:", error);
          return null;
        }
      };
      const parseProfileTierLevel = (bitstream, maxNumSubLayersMinus1) => {
        const general_profile_space = bitstream.readBits(2);
        const general_tier_flag = bitstream.readBits(1);
        const general_profile_idc = bitstream.readBits(5);
        let general_profile_compatibility_flags = 0;
        for (let i = 0; i < 32; i++) {
          general_profile_compatibility_flags = general_profile_compatibility_flags << 1 | bitstream.readBits(1);
        }
        const general_constraint_indicator_flags = new Uint8Array(6);
        for (let i = 0; i < 6; i++) {
          general_constraint_indicator_flags[i] = bitstream.readBits(8);
        }
        const general_level_idc = bitstream.readBits(8);
        const sub_layer_profile_present_flag = [];
        const sub_layer_level_present_flag = [];
        for (let i = 0; i < maxNumSubLayersMinus1; i++) {
          sub_layer_profile_present_flag.push(bitstream.readBits(1));
          sub_layer_level_present_flag.push(bitstream.readBits(1));
        }
        if (maxNumSubLayersMinus1 > 0) {
          for (let i = maxNumSubLayersMinus1; i < 8; i++) {
            bitstream.skipBits(2);
          }
        }
        for (let i = 0; i < maxNumSubLayersMinus1; i++) {
          if (sub_layer_profile_present_flag[i])
            bitstream.skipBits(88);
          if (sub_layer_level_present_flag[i])
            bitstream.skipBits(8);
        }
        return {
          general_profile_space,
          general_tier_flag,
          general_profile_idc,
          general_profile_compatibility_flags,
          general_constraint_indicator_flags,
          general_level_idc
        };
      };
      const skipScalingListData = (bitstream) => {
        for (let sizeId = 0; sizeId < 4; sizeId++) {
          for (let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++) {
            const scaling_list_pred_mode_flag = bitstream.readBits(1);
            if (!scaling_list_pred_mode_flag) {
              readExpGolomb(bitstream);
            } else {
              const coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
              if (sizeId > 1) {
                readSignedExpGolomb(bitstream);
              }
              for (let i = 0; i < coefNum; i++) {
                readSignedExpGolomb(bitstream);
              }
            }
          }
        }
      };
      const skipAllStRefPicSets = (bitstream, num_short_term_ref_pic_sets) => {
        const NumDeltaPocs = [];
        for (let stRpsIdx = 0; stRpsIdx < num_short_term_ref_pic_sets; stRpsIdx++) {
          NumDeltaPocs[stRpsIdx] = skipStRefPicSet(bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs);
        }
      };
      const skipStRefPicSet = (bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs) => {
        let NumDeltaPocsThis = 0;
        let inter_ref_pic_set_prediction_flag = 0;
        let RefRpsIdx = 0;
        if (stRpsIdx !== 0) {
          inter_ref_pic_set_prediction_flag = bitstream.readBits(1);
        }
        if (inter_ref_pic_set_prediction_flag) {
          if (stRpsIdx === num_short_term_ref_pic_sets) {
            const delta_idx_minus1 = readExpGolomb(bitstream);
            RefRpsIdx = stRpsIdx - (delta_idx_minus1 + 1);
          } else {
            RefRpsIdx = stRpsIdx - 1;
          }
          bitstream.readBits(1);
          readExpGolomb(bitstream);
          const numDelta = NumDeltaPocs[RefRpsIdx] ?? 0;
          for (let j = 0; j <= numDelta; j++) {
            const used_by_curr_pic_flag = bitstream.readBits(1);
            if (!used_by_curr_pic_flag) {
              bitstream.readBits(1);
            }
          }
          NumDeltaPocsThis = NumDeltaPocs[RefRpsIdx];
        } else {
          const num_negative_pics = readExpGolomb(bitstream);
          const num_positive_pics = readExpGolomb(bitstream);
          for (let i = 0; i < num_negative_pics; i++) {
            readExpGolomb(bitstream);
            bitstream.readBits(1);
          }
          for (let i = 0; i < num_positive_pics; i++) {
            readExpGolomb(bitstream);
            bitstream.readBits(1);
          }
          NumDeltaPocsThis = num_negative_pics + num_positive_pics;
        }
        return NumDeltaPocsThis;
      };
      const parseVuiForMinSpatialSegmentationIdc = (bitstream, sps_max_sub_layers_minus1) => {
        if (bitstream.readBits(1)) {
          const aspect_ratio_idc = bitstream.readBits(8);
          if (aspect_ratio_idc === 255) {
            bitstream.readBits(16);
            bitstream.readBits(16);
          }
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(1);
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(3);
          bitstream.readBits(1);
          if (bitstream.readBits(1)) {
            bitstream.readBits(8);
            bitstream.readBits(8);
            bitstream.readBits(8);
          }
        }
        if (bitstream.readBits(1)) {
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
        }
        bitstream.readBits(1);
        bitstream.readBits(1);
        bitstream.readBits(1);
        if (bitstream.readBits(1)) {
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(32);
          bitstream.readBits(32);
          if (bitstream.readBits(1)) {
            readExpGolomb(bitstream);
          }
          if (bitstream.readBits(1)) {
            skipHrdParameters(bitstream, true, sps_max_sub_layers_minus1);
          }
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(1);
          bitstream.readBits(1);
          bitstream.readBits(1);
          const min_spatial_segmentation_idc = readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          return min_spatial_segmentation_idc;
        }
        return 0;
      };
      const skipHrdParameters = (bitstream, commonInfPresentFlag, maxNumSubLayersMinus1) => {
        let nal_hrd_parameters_present_flag = false;
        let vcl_hrd_parameters_present_flag = false;
        let sub_pic_hrd_params_present_flag = false;
        {
          nal_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
          vcl_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
          if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
            sub_pic_hrd_params_present_flag = bitstream.readBits(1) === 1;
            if (sub_pic_hrd_params_present_flag) {
              bitstream.readBits(8);
              bitstream.readBits(5);
              bitstream.readBits(1);
              bitstream.readBits(5);
            }
            bitstream.readBits(4);
            bitstream.readBits(4);
            if (sub_pic_hrd_params_present_flag) {
              bitstream.readBits(4);
            }
            bitstream.readBits(5);
            bitstream.readBits(5);
            bitstream.readBits(5);
          }
        }
        for (let i = 0; i <= maxNumSubLayersMinus1; i++) {
          const fixed_pic_rate_general_flag = bitstream.readBits(1) === 1;
          let fixed_pic_rate_within_cvs_flag = true;
          if (!fixed_pic_rate_general_flag) {
            fixed_pic_rate_within_cvs_flag = bitstream.readBits(1) === 1;
          }
          let low_delay_hrd_flag = false;
          if (fixed_pic_rate_within_cvs_flag) {
            readExpGolomb(bitstream);
          } else {
            low_delay_hrd_flag = bitstream.readBits(1) === 1;
          }
          let CpbCnt = 1;
          if (!low_delay_hrd_flag) {
            const cpb_cnt_minus1 = readExpGolomb(bitstream);
            CpbCnt = cpb_cnt_minus1 + 1;
          }
          if (nal_hrd_parameters_present_flag) {
            skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
          }
          if (vcl_hrd_parameters_present_flag) {
            skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
          }
        }
      };
      const skipSubLayerHrdParameters = (bitstream, CpbCnt, sub_pic_hrd_params_present_flag) => {
        for (let i = 0; i < CpbCnt; i++) {
          readExpGolomb(bitstream);
          readExpGolomb(bitstream);
          if (sub_pic_hrd_params_present_flag) {
            readExpGolomb(bitstream);
            readExpGolomb(bitstream);
          }
          bitstream.readBits(1);
        }
      };
      const serializeHevcDecoderConfigurationRecord = (record) => {
        const bytes2 = [];
        bytes2.push(record.configurationVersion);
        bytes2.push((record.generalProfileSpace & 3) << 6 | (record.generalTierFlag & 1) << 5 | record.generalProfileIdc & 31);
        bytes2.push(record.generalProfileCompatibilityFlags >>> 24 & 255);
        bytes2.push(record.generalProfileCompatibilityFlags >>> 16 & 255);
        bytes2.push(record.generalProfileCompatibilityFlags >>> 8 & 255);
        bytes2.push(record.generalProfileCompatibilityFlags & 255);
        bytes2.push(...record.generalConstraintIndicatorFlags);
        bytes2.push(record.generalLevelIdc & 255);
        bytes2.push(240 | record.minSpatialSegmentationIdc >> 8 & 15);
        bytes2.push(record.minSpatialSegmentationIdc & 255);
        bytes2.push(252 | record.parallelismType & 3);
        bytes2.push(252 | record.chromaFormatIdc & 3);
        bytes2.push(248 | record.bitDepthLumaMinus8 & 7);
        bytes2.push(248 | record.bitDepthChromaMinus8 & 7);
        bytes2.push(record.avgFrameRate >> 8 & 255);
        bytes2.push(record.avgFrameRate & 255);
        bytes2.push((record.constantFrameRate & 3) << 6 | (record.numTemporalLayers & 7) << 3 | (record.temporalIdNested & 1) << 2 | record.lengthSizeMinusOne & 3);
        bytes2.push(record.arrays.length & 255);
        for (const arr of record.arrays) {
          bytes2.push((arr.arrayCompleteness & 1) << 7 | 0 << 6 | arr.nalUnitType & 63);
          bytes2.push(arr.nalUnits.length >> 8 & 255);
          bytes2.push(arr.nalUnits.length & 255);
          for (const nal of arr.nalUnits) {
            bytes2.push(nal.length >> 8 & 255);
            bytes2.push(nal.length & 255);
            for (let i = 0; i < nal.length; i++) {
              bytes2.push(nal[i]);
            }
          }
        }
        return new Uint8Array(bytes2);
      };
      const iterateAv1PacketObus = function* (packet) {
        const bitstream = new Bitstream(packet);
        const readLeb128 = () => {
          let value = 0;
          for (let i = 0; i < 8; i++) {
            const byte = bitstream.readAlignedByte();
            value |= (byte & 127) << i * 7;
            if (!(byte & 128)) {
              break;
            }
            if (i === 7 && byte & 128) {
              return null;
            }
          }
          if (value >= 2 ** 32 - 1) {
            return null;
          }
          return value;
        };
        while (bitstream.getBitsLeft() >= 8) {
          bitstream.skipBits(1);
          const obuType = bitstream.readBits(4);
          const obuExtension = bitstream.readBits(1);
          const obuHasSizeField = bitstream.readBits(1);
          bitstream.skipBits(1);
          if (obuExtension) {
            bitstream.skipBits(8);
          }
          let obuSize;
          if (obuHasSizeField) {
            const obuSizeValue = readLeb128();
            if (obuSizeValue === null)
              return;
            obuSize = obuSizeValue;
          } else {
            obuSize = Math.floor(bitstream.getBitsLeft() / 8);
          }
          assert$1(bitstream.pos % 8 === 0);
          yield {
            type: obuType,
            data: packet.subarray(bitstream.pos / 8, bitstream.pos / 8 + obuSize)
          };
          bitstream.skipBits(obuSize * 8);
        }
      };
      const parseOpusIdentificationHeader = (bytes2) => {
        const view2 = toDataView(bytes2);
        const outputChannelCount = view2.getUint8(9);
        const preSkip = view2.getUint16(10, true);
        const inputSampleRate = view2.getUint32(12, true);
        const outputGain = view2.getInt16(16, true);
        const channelMappingFamily = view2.getUint8(18);
        let channelMappingTable = null;
        if (channelMappingFamily) {
          channelMappingTable = bytes2.subarray(19, 19 + 2 + outputChannelCount);
        }
        return {
          outputChannelCount,
          preSkip,
          inputSampleRate,
          outputGain,
          channelMappingFamily,
          channelMappingTable
        };
      };
      const determineVideoPacketType = async (videoTrack, packet) => {
        assert$1(videoTrack.codec);
        switch (videoTrack.codec) {
          case "avc": {
            const decoderConfig = await videoTrack.getDecoderConfig();
            assert$1(decoderConfig);
            const nalUnits = extractAvcNalUnits(packet.data, decoderConfig);
            const isKeyframe = nalUnits.some((x) => extractNalUnitTypeForAvc(x) === AvcNalUnitType.IDR);
            return isKeyframe ? "key" : "delta";
          }
          case "hevc": {
            const decoderConfig = await videoTrack.getDecoderConfig();
            assert$1(decoderConfig);
            const nalUnits = extractHevcNalUnits(packet.data, decoderConfig);
            const isKeyframe = nalUnits.some((x) => {
              const type = extractNalUnitTypeForHevc(x);
              return HevcNalUnitType.BLA_W_LP <= type && type <= HevcNalUnitType.RSV_IRAP_VCL23;
            });
            return isKeyframe ? "key" : "delta";
          }
          case "vp8": {
            const frameType = packet.data[0] & 1;
            return frameType === 0 ? "key" : "delta";
          }
          case "vp9": {
            const bitstream = new Bitstream(packet.data);
            if (bitstream.readBits(2) !== 2) {
              return null;
            }
            const profileLowBit = bitstream.readBits(1);
            const profileHighBit = bitstream.readBits(1);
            const profile = (profileHighBit << 1) + profileLowBit;
            if (profile === 3) {
              bitstream.skipBits(1);
            }
            const showExistingFrame = bitstream.readBits(1);
            if (showExistingFrame) {
              return null;
            }
            const frameType = bitstream.readBits(1);
            return frameType === 0 ? "key" : "delta";
          }
          case "av1": {
            let reducedStillPictureHeader = false;
            for (const { type, data } of iterateAv1PacketObus(packet.data)) {
              if (type === 1) {
                const bitstream = new Bitstream(data);
                bitstream.skipBits(4);
                reducedStillPictureHeader = !!bitstream.readBits(1);
              } else if (type === 3 || type === 6 || type === 7) {
                if (reducedStillPictureHeader) {
                  return "key";
                }
                const bitstream = new Bitstream(data);
                const showExistingFrame = bitstream.readBits(1);
                if (showExistingFrame) {
                  return null;
                }
                const frameType = bitstream.readBits(2);
                return frameType === 0 ? "key" : "delta";
              }
            }
            return null;
          }
          default: {
            assertNever(videoTrack.codec);
            assert$1(false);
          }
        }
      };
      var FlacBlockType;
      (function(FlacBlockType2) {
        FlacBlockType2[FlacBlockType2["STREAMINFO"] = 0] = "STREAMINFO";
        FlacBlockType2[FlacBlockType2["VORBIS_COMMENT"] = 4] = "VORBIS_COMMENT";
        FlacBlockType2[FlacBlockType2["PICTURE"] = 6] = "PICTURE";
      })(FlacBlockType || (FlacBlockType = {}));
class Reader {
        constructor(source2) {
          this.source = source2;
        }
        requestSlice(start, length) {
          if (this.fileSize !== null && start + length > this.fileSize) {
            return null;
          }
          const end = start + length;
          const result = this.source._read(start, end);
          if (result instanceof Promise) {
            return result.then((x) => {
              if (!x) {
                return null;
              }
              return new FileSlice(x.bytes, x.view, x.offset, start, end);
            });
          } else {
            if (!result) {
              return null;
            }
            return new FileSlice(result.bytes, result.view, result.offset, start, end);
          }
        }
        requestSliceRange(start, minLength, maxLength) {
          if (this.fileSize !== null) {
            return this.requestSlice(start, clamp(this.fileSize - start, minLength, maxLength));
          } else {
            const promisedAttempt = this.requestSlice(start, maxLength);
            const handleAttempt = (attempt) => {
              if (attempt) {
                return attempt;
              }
              const handleFileSize = (fileSize) => {
                assert$1(fileSize !== null);
                return this.requestSlice(start, clamp(fileSize - start, minLength, maxLength));
              };
              const promisedFileSize = this.source._retrieveSize();
              if (promisedFileSize instanceof Promise) {
                return promisedFileSize.then(handleFileSize);
              } else {
                return handleFileSize(promisedFileSize);
              }
            };
            if (promisedAttempt instanceof Promise) {
              return promisedAttempt.then(handleAttempt);
            } else {
              return handleAttempt(promisedAttempt);
            }
          }
        }
      }
      class FileSlice {
        constructor(bytes2, view2, offset, start, end) {
          this.bytes = bytes2;
          this.view = view2;
          this.offset = offset;
          this.start = start;
          this.end = end;
          this.bufferPos = start - offset;
        }
        static tempFromBytes(bytes2) {
          return new FileSlice(bytes2, toDataView(bytes2), 0, 0, bytes2.length);
        }
        get length() {
          return this.end - this.start;
        }
        get filePos() {
          return this.offset + this.bufferPos;
        }
        set filePos(value) {
          this.bufferPos = value - this.offset;
        }
        skip(byteCount) {
          this.bufferPos += byteCount;
        }
slice(filePos, length = this.end - filePos) {
          if (filePos < this.start || filePos + length > this.end) {
            throw new RangeError("Slicing outside of original slice.");
          }
          return new FileSlice(this.bytes, this.view, this.offset, filePos, filePos + length);
        }
      }
      const readBytes = (slice, length) => {
        const bytes2 = slice.bytes.subarray(slice.bufferPos, slice.bufferPos + length);
        slice.bufferPos += length;
        return bytes2;
      };
      const readU8 = (slice) => slice.view.getUint8(slice.bufferPos++);
      const readU32Be = (slice) => {
        const value = slice.view.getUint32(slice.bufferPos, false);
        slice.bufferPos += 4;
        return value;
      };
      const readAscii = (slice, length) => {
        if (slice.bufferPos + length > slice.bytes.length) {
          throw new RangeError("Reading past end of slice.");
        }
        let str = "";
        for (let i = 0; i < length; i++) {
          str += String.fromCharCode(slice.bytes[slice.bufferPos++]);
        }
        return str;
      };
const inlineTimestampRegex = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g;
      const formatSubtitleTimestamp = (timestamp) => {
        const hours = Math.floor(timestamp / (60 * 60 * 1e3));
        const minutes = Math.floor(timestamp % (60 * 60 * 1e3) / (60 * 1e3));
        const seconds = Math.floor(timestamp % (60 * 1e3) / 1e3);
        const milliseconds = timestamp % 1e3;
        return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + "." + milliseconds.toString().padStart(3, "0");
      };
class IsobmffBoxWriter {
        constructor(writer) {
          this.writer = writer;
          this.helper = new Uint8Array(8);
          this.helperView = new DataView(this.helper.buffer);
          this.offsets = new WeakMap();
        }
        writeU32(value) {
          this.helperView.setUint32(0, value, false);
          this.writer.write(this.helper.subarray(0, 4));
        }
        writeU64(value) {
          this.helperView.setUint32(0, Math.floor(value / 2 ** 32), false);
          this.helperView.setUint32(4, value, false);
          this.writer.write(this.helper.subarray(0, 8));
        }
        writeAscii(text) {
          for (let i = 0; i < text.length; i++) {
            this.helperView.setUint8(i % 8, text.charCodeAt(i));
            if (i % 8 === 7)
              this.writer.write(this.helper);
          }
          if (text.length % 8 !== 0) {
            this.writer.write(this.helper.subarray(0, text.length % 8));
          }
        }
        writeBox(box2) {
          this.offsets.set(box2, this.writer.getPos());
          if (box2.contents && !box2.children) {
            this.writeBoxHeader(box2, box2.size ?? box2.contents.byteLength + 8);
            this.writer.write(box2.contents);
          } else {
            const startPos = this.writer.getPos();
            this.writeBoxHeader(box2, 0);
            if (box2.contents)
              this.writer.write(box2.contents);
            if (box2.children) {
              for (const child2 of box2.children)
                if (child2)
                  this.writeBox(child2);
            }
            const endPos = this.writer.getPos();
            const size = box2.size ?? endPos - startPos;
            this.writer.seek(startPos);
            this.writeBoxHeader(box2, size);
            this.writer.seek(endPos);
          }
        }
        writeBoxHeader(box2, size) {
          this.writeU32(box2.largeSize ? 1 : size);
          this.writeAscii(box2.type);
          if (box2.largeSize)
            this.writeU64(size);
        }
        measureBoxHeader(box2) {
          return 8 + (box2.largeSize ? 8 : 0);
        }
        patchBox(box2) {
          const boxOffset = this.offsets.get(box2);
          assert$1(boxOffset !== void 0);
          const endPos = this.writer.getPos();
          this.writer.seek(boxOffset);
          this.writeBox(box2);
          this.writer.seek(endPos);
        }
        measureBox(box2) {
          if (box2.contents && !box2.children) {
            const headerSize = this.measureBoxHeader(box2);
            return headerSize + box2.contents.byteLength;
          } else {
            let result = this.measureBoxHeader(box2);
            if (box2.contents)
              result += box2.contents.byteLength;
            if (box2.children) {
              for (const child2 of box2.children)
                if (child2)
                  result += this.measureBox(child2);
            }
            return result;
          }
        }
      }
      const bytes = new Uint8Array(8);
      const view = new DataView(bytes.buffer);
      const u8 = (value) => {
        return [(value % 256 + 256) % 256];
      };
      const u16 = (value) => {
        view.setUint16(0, value, false);
        return [bytes[0], bytes[1]];
      };
      const i16 = (value) => {
        view.setInt16(0, value, false);
        return [bytes[0], bytes[1]];
      };
      const u24 = (value) => {
        view.setUint32(0, value, false);
        return [bytes[1], bytes[2], bytes[3]];
      };
      const u32 = (value) => {
        view.setUint32(0, value, false);
        return [bytes[0], bytes[1], bytes[2], bytes[3]];
      };
      const i32 = (value) => {
        view.setInt32(0, value, false);
        return [bytes[0], bytes[1], bytes[2], bytes[3]];
      };
      const u64 = (value) => {
        view.setUint32(0, Math.floor(value / 2 ** 32), false);
        view.setUint32(4, value, false);
        return [bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7]];
      };
      const fixed_8_8 = (value) => {
        view.setInt16(0, 2 ** 8 * value, false);
        return [bytes[0], bytes[1]];
      };
      const fixed_16_16 = (value) => {
        view.setInt32(0, 2 ** 16 * value, false);
        return [bytes[0], bytes[1], bytes[2], bytes[3]];
      };
      const fixed_2_30 = (value) => {
        view.setInt32(0, 2 ** 30 * value, false);
        return [bytes[0], bytes[1], bytes[2], bytes[3]];
      };
      const variableUnsignedInt = (value, byteLength) => {
        const bytes2 = [];
        let remaining = value;
        do {
          let byte = remaining & 127;
          remaining >>= 7;
          if (bytes2.length > 0) {
            byte |= 128;
          }
          bytes2.push(byte);
        } while (remaining > 0 || byteLength);
        return bytes2.reverse();
      };
      const ascii = (text, nullTerminated = false) => {
        const bytes2 = Array(text.length).fill(null).map((_, i) => text.charCodeAt(i));
        if (nullTerminated)
          bytes2.push(0);
        return bytes2;
      };
      const lastPresentedSample = (samples) => {
        let result = null;
        for (const sample of samples) {
          if (!result || sample.timestamp > result.timestamp) {
            result = sample;
          }
        }
        return result;
      };
      const rotationMatrix = (rotationInDegrees) => {
        const theta = rotationInDegrees * (Math.PI / 180);
        const cosTheta = Math.round(Math.cos(theta));
        const sinTheta = Math.round(Math.sin(theta));
        return [
          cosTheta,
          sinTheta,
          0,
          -sinTheta,
          cosTheta,
          0,
          0,
          0,
          1
        ];
      };
      const IDENTITY_MATRIX = rotationMatrix(0);
      const matrixToBytes = (matrix) => {
        return [
          fixed_16_16(matrix[0]),
          fixed_16_16(matrix[1]),
          fixed_2_30(matrix[2]),
          fixed_16_16(matrix[3]),
          fixed_16_16(matrix[4]),
          fixed_2_30(matrix[5]),
          fixed_16_16(matrix[6]),
          fixed_16_16(matrix[7]),
          fixed_2_30(matrix[8])
        ];
      };
      const box = (type, contents, children) => ({
        type,
        contents: contents && new Uint8Array(contents.flat(10)),
        children
      });
      const fullBox = (type, version, flags2, contents, children) => box(type, [u8(version), u24(flags2), contents ?? []], children);
      const ftyp = (details) => {
        const minorVersion = 512;
        if (details.isQuickTime) {
          return box("ftyp", [
            ascii("qt  "),
u32(minorVersion),

ascii("qt  ")
          ]);
        }
        if (details.fragmented) {
          return box("ftyp", [
            ascii("iso5"),
u32(minorVersion),

ascii("iso5"),
            ascii("iso6"),
            ascii("mp41")
          ]);
        }
        return box("ftyp", [
          ascii("isom"),
u32(minorVersion),

ascii("isom"),
          details.holdsAvc ? ascii("avc1") : [],
          ascii("mp41")
        ]);
      };
      const mdat = (reserveLargeSize) => ({ type: "mdat", largeSize: reserveLargeSize });
      const free = (size) => ({ type: "free", size });
      const moov = (muxer) => box("moov", void 0, [
        mvhd(muxer.creationTime, muxer.trackDatas),
        ...muxer.trackDatas.map((x) => trak(x, muxer.creationTime)),
        muxer.isFragmented ? mvex(muxer.trackDatas) : null,
        udta(muxer)
      ]);
      const mvhd = (creationTime, trackDatas) => {
        const duration = intoTimescale(Math.max(0, ...trackDatas.filter((x) => x.samples.length > 0).map((x) => {
          const lastSample = lastPresentedSample(x.samples);
          return lastSample.timestamp + lastSample.duration;
        })), GLOBAL_TIMESCALE);
        const nextTrackId = Math.max(0, ...trackDatas.map((x) => x.track.id)) + 1;
        const needsU64 = !isU32(creationTime) || !isU32(duration);
        const u32OrU64 = needsU64 ? u64 : u32;
        return fullBox("mvhd", +needsU64, 0, [
          u32OrU64(creationTime),
u32OrU64(creationTime),
u32(GLOBAL_TIMESCALE),
u32OrU64(duration),
fixed_16_16(1),
fixed_8_8(1),
Array(10).fill(0),
matrixToBytes(IDENTITY_MATRIX),
Array(24).fill(0),
u32(nextTrackId)
]);
      };
      const trak = (trackData, creationTime) => {
        const trackMetadata = getTrackMetadata(trackData);
        return box("trak", void 0, [
          tkhd(trackData, creationTime),
          mdia(trackData, creationTime),
          trackMetadata.name !== void 0 ? box("udta", void 0, [
            box("name", [
              ...textEncoder.encode(trackMetadata.name)
            ])
          ]) : null
        ]);
      };
      const tkhd = (trackData, creationTime) => {
        const lastSample = lastPresentedSample(trackData.samples);
        const durationInGlobalTimescale = intoTimescale(lastSample ? lastSample.timestamp + lastSample.duration : 0, GLOBAL_TIMESCALE);
        const needsU64 = !isU32(creationTime) || !isU32(durationInGlobalTimescale);
        const u32OrU64 = needsU64 ? u64 : u32;
        let matrix;
        if (trackData.type === "video") {
          const rotation = trackData.track.metadata.rotation;
          matrix = rotationMatrix(rotation ?? 0);
        } else {
          matrix = IDENTITY_MATRIX;
        }
        return fullBox("tkhd", +needsU64, 3, [
          u32OrU64(creationTime),
u32OrU64(creationTime),
u32(trackData.track.id),
u32(0),
u32OrU64(durationInGlobalTimescale),
Array(8).fill(0),
u16(0),
u16(trackData.track.id),
fixed_8_8(trackData.type === "audio" ? 1 : 0),
u16(0),
matrixToBytes(matrix),
fixed_16_16(trackData.type === "video" ? trackData.info.width : 0),
fixed_16_16(trackData.type === "video" ? trackData.info.height : 0)
]);
      };
      const mdia = (trackData, creationTime) => box("mdia", void 0, [
        mdhd(trackData, creationTime),
        hdlr(true, TRACK_TYPE_TO_COMPONENT_SUBTYPE[trackData.type], TRACK_TYPE_TO_HANDLER_NAME[trackData.type]),
        minf(trackData)
      ]);
      const mdhd = (trackData, creationTime) => {
        const lastSample = lastPresentedSample(trackData.samples);
        const localDuration = intoTimescale(lastSample ? lastSample.timestamp + lastSample.duration : 0, trackData.timescale);
        const needsU64 = !isU32(creationTime) || !isU32(localDuration);
        const u32OrU64 = needsU64 ? u64 : u32;
        return fullBox("mdhd", +needsU64, 0, [
          u32OrU64(creationTime),
u32OrU64(creationTime),
u32(trackData.timescale),
u32OrU64(localDuration),
u16(getLanguageCodeInt(trackData.track.metadata.languageCode ?? UNDETERMINED_LANGUAGE)),
u16(0)
]);
      };
      const TRACK_TYPE_TO_COMPONENT_SUBTYPE = {
        video: "vide",
        audio: "soun",
        subtitle: "text"
      };
      const TRACK_TYPE_TO_HANDLER_NAME = {
        video: "MediabunnyVideoHandler",
        audio: "MediabunnySoundHandler",
        subtitle: "MediabunnyTextHandler"
      };
      const hdlr = (hasComponentType, handlerType, name, manufacturer = "\0\0\0\0") => fullBox("hdlr", 0, 0, [
        hasComponentType ? ascii("mhlr") : u32(0),
ascii(handlerType),
ascii(manufacturer),
u32(0),
u32(0),
ascii(name, true)
]);
      const minf = (trackData) => box("minf", void 0, [
        TRACK_TYPE_TO_HEADER_BOX[trackData.type](),
        dinf(),
        stbl(trackData)
      ]);
      const vmhd = () => fullBox("vmhd", 0, 1, [
        u16(0),
u16(0),
u16(0),
u16(0)
]);
      const smhd = () => fullBox("smhd", 0, 0, [
        u16(0),
u16(0)
]);
      const nmhd = () => fullBox("nmhd", 0, 0);
      const TRACK_TYPE_TO_HEADER_BOX = {
        video: vmhd,
        audio: smhd,
        subtitle: nmhd
      };
      const dinf = () => box("dinf", void 0, [
        dref()
      ]);
      const dref = () => fullBox("dref", 0, 0, [
        u32(1)
], [
        url()
      ]);
      const url = () => fullBox("url ", 0, 1);
      const stbl = (trackData) => {
        const needsCtts = trackData.compositionTimeOffsetTable.length > 1 || trackData.compositionTimeOffsetTable.some((x) => x.sampleCompositionTimeOffset !== 0);
        return box("stbl", void 0, [
          stsd(trackData),
          stts(trackData),
          needsCtts ? ctts(trackData) : null,
          needsCtts ? cslg(trackData) : null,
          stsc(trackData),
          stsz(trackData),
          stco(trackData),
          stss(trackData)
        ]);
      };
      const stsd = (trackData) => {
        let sampleDescription;
        if (trackData.type === "video") {
          sampleDescription = videoSampleDescription(VIDEO_CODEC_TO_BOX_NAME[trackData.track.source._codec], trackData);
        } else if (trackData.type === "audio") {
          const boxName = audioCodecToBoxName(trackData.track.source._codec, trackData.muxer.isQuickTime);
          assert$1(boxName);
          sampleDescription = soundSampleDescription(boxName, trackData);
        } else if (trackData.type === "subtitle") {
          sampleDescription = subtitleSampleDescription(SUBTITLE_CODEC_TO_BOX_NAME[trackData.track.source._codec], trackData);
        }
        assert$1(sampleDescription);
        return fullBox("stsd", 0, 0, [
          u32(1)
], [
          sampleDescription
        ]);
      };
      const videoSampleDescription = (compressionType, trackData) => box(compressionType, [
        Array(6).fill(0),
u16(1),
u16(0),
u16(0),
Array(12).fill(0),
u16(trackData.info.width),
u16(trackData.info.height),
u32(4718592),
u32(4718592),
u32(0),
u16(1),
Array(32).fill(0),
u16(24),
i16(65535)
], [
        VIDEO_CODEC_TO_CONFIGURATION_BOX[trackData.track.source._codec](trackData),
        colorSpaceIsComplete(trackData.info.decoderConfig.colorSpace) ? colr(trackData) : null
      ]);
      const colr = (trackData) => box("colr", [
        ascii("nclx"),
u16(COLOR_PRIMARIES_MAP[trackData.info.decoderConfig.colorSpace.primaries]),
u16(TRANSFER_CHARACTERISTICS_MAP[trackData.info.decoderConfig.colorSpace.transfer]),
u16(MATRIX_COEFFICIENTS_MAP[trackData.info.decoderConfig.colorSpace.matrix]),
u8((trackData.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
]);
      const avcC = (trackData) => trackData.info.decoderConfig && box("avcC", [
...toUint8Array(trackData.info.decoderConfig.description)
      ]);
      const hvcC = (trackData) => trackData.info.decoderConfig && box("hvcC", [
...toUint8Array(trackData.info.decoderConfig.description)
      ]);
      const vpcC = (trackData) => {
        if (!trackData.info.decoderConfig) {
          return null;
        }
        const decoderConfig = trackData.info.decoderConfig;
        const parts = decoderConfig.codec.split(".");
        const profile = Number(parts[1]);
        const level = Number(parts[2]);
        const bitDepth = Number(parts[3]);
        const chromaSubsampling = parts[4] ? Number(parts[4]) : 1;
        const videoFullRangeFlag = parts[8] ? Number(parts[8]) : Number(decoderConfig.colorSpace?.fullRange ?? 0);
        const thirdByte = (bitDepth << 4) + (chromaSubsampling << 1) + videoFullRangeFlag;
        const colourPrimaries = parts[5] ? Number(parts[5]) : decoderConfig.colorSpace?.primaries ? COLOR_PRIMARIES_MAP[decoderConfig.colorSpace.primaries] : 2;
        const transferCharacteristics = parts[6] ? Number(parts[6]) : decoderConfig.colorSpace?.transfer ? TRANSFER_CHARACTERISTICS_MAP[decoderConfig.colorSpace.transfer] : 2;
        const matrixCoefficients = parts[7] ? Number(parts[7]) : decoderConfig.colorSpace?.matrix ? MATRIX_COEFFICIENTS_MAP[decoderConfig.colorSpace.matrix] : 2;
        return fullBox("vpcC", 1, 0, [
          u8(profile),
u8(level),
u8(thirdByte),
u8(colourPrimaries),
u8(transferCharacteristics),
u8(matrixCoefficients),
u16(0)
]);
      };
      const av1C = (trackData) => {
        return box("av1C", generateAv1CodecConfigurationFromCodecString(trackData.info.decoderConfig.codec));
      };
      const soundSampleDescription = (compressionType, trackData) => {
        let version = 0;
        let contents;
        let sampleSizeInBits = 16;
        if (PCM_AUDIO_CODECS.includes(trackData.track.source._codec)) {
          const codec = trackData.track.source._codec;
          const { sampleSize } = parsePcmCodec(codec);
          sampleSizeInBits = 8 * sampleSize;
          if (sampleSizeInBits > 16) {
            version = 1;
          }
        }
        if (version === 0) {
          contents = [
            Array(6).fill(0),
u16(1),
u16(version),
u16(0),
u32(0),
u16(trackData.info.numberOfChannels),
u16(sampleSizeInBits),
u16(0),
u16(0),
u16(trackData.info.sampleRate < 2 ** 16 ? trackData.info.sampleRate : 0),
u16(0)
];
        } else {
          contents = [
            Array(6).fill(0),
u16(1),
u16(version),
u16(0),
u32(0),
u16(trackData.info.numberOfChannels),
u16(Math.min(sampleSizeInBits, 16)),
u16(0),
u16(0),
u16(trackData.info.sampleRate < 2 ** 16 ? trackData.info.sampleRate : 0),
u16(0),
u32(1),
u32(sampleSizeInBits / 8),
u32(trackData.info.numberOfChannels * sampleSizeInBits / 8),
u32(2)
];
        }
        return box(compressionType, contents, [
          audioCodecToConfigurationBox(trackData.track.source._codec, trackData.muxer.isQuickTime)?.(trackData) ?? null
        ]);
      };
      const esds = (trackData) => {
        let objectTypeIndication;
        switch (trackData.track.source._codec) {
          case "aac":
            {
              objectTypeIndication = 64;
            }
            break;
          case "mp3":
            {
              objectTypeIndication = 107;
            }
            break;
          case "vorbis":
            {
              objectTypeIndication = 221;
            }
            break;
          default:
            throw new Error(`Unhandled audio codec: ${trackData.track.source._codec}`);
        }
        let bytes2 = [
          ...u8(objectTypeIndication),
...u8(21),
...u24(0),
...u32(0),
...u32(0)
];
        if (trackData.info.decoderConfig.description) {
          const description = toUint8Array(trackData.info.decoderConfig.description);
          bytes2 = [
            ...bytes2,
            ...u8(5),
...variableUnsignedInt(description.byteLength),
            ...description
          ];
        }
        bytes2 = [
          ...u16(1),
...u8(0),
...u8(4),
...variableUnsignedInt(bytes2.length),
          ...bytes2,
          ...u8(6),
...u8(1),
...u8(2)
];
        bytes2 = [
          ...u8(3),
...variableUnsignedInt(bytes2.length),
          ...bytes2
        ];
        return fullBox("esds", 0, 0, bytes2);
      };
      const wave = (trackData) => {
        return box("wave", void 0, [
          frma(trackData),
          enda(trackData),
          box("\0\0\0\0")
]);
      };
      const frma = (trackData) => {
        return box("frma", [
          ascii(audioCodecToBoxName(trackData.track.source._codec, trackData.muxer.isQuickTime))
        ]);
      };
      const enda = (trackData) => {
        const { littleEndian } = parsePcmCodec(trackData.track.source._codec);
        return box("enda", [
          u16(+littleEndian)
        ]);
      };
      const dOps = (trackData) => {
        let outputChannelCount = trackData.info.numberOfChannels;
        let preSkip = 3840;
        let inputSampleRate = trackData.info.sampleRate;
        let outputGain = 0;
        let channelMappingFamily = 0;
        let channelMappingTable = new Uint8Array(0);
        const description = trackData.info.decoderConfig?.description;
        if (description) {
          assert$1(description.byteLength >= 18);
          const bytes2 = toUint8Array(description);
          const header = parseOpusIdentificationHeader(bytes2);
          outputChannelCount = header.outputChannelCount;
          preSkip = header.preSkip;
          inputSampleRate = header.inputSampleRate;
          outputGain = header.outputGain;
          channelMappingFamily = header.channelMappingFamily;
          if (header.channelMappingTable) {
            channelMappingTable = header.channelMappingTable;
          }
        }
        return box("dOps", [
          u8(0),
u8(outputChannelCount),
u16(preSkip),
u32(inputSampleRate),
i16(outputGain),
u8(channelMappingFamily),
...channelMappingTable
        ]);
      };
      const dfLa = (trackData) => {
        const description = trackData.info.decoderConfig?.description;
        assert$1(description);
        const bytes2 = toUint8Array(description);
        return fullBox("dfLa", 0, 0, [
          ...bytes2.subarray(4)
        ]);
      };
      const pcmC = (trackData) => {
        const { littleEndian, sampleSize } = parsePcmCodec(trackData.track.source._codec);
        const formatFlags = +littleEndian;
        return fullBox("pcmC", 0, 0, [
          u8(formatFlags),
          u8(8 * sampleSize)
        ]);
      };
      const subtitleSampleDescription = (compressionType, trackData) => box(compressionType, [
        Array(6).fill(0),
u16(1)
], [
        SUBTITLE_CODEC_TO_CONFIGURATION_BOX[trackData.track.source._codec](trackData)
      ]);
      const vttC = (trackData) => box("vttC", [
        ...textEncoder.encode(trackData.info.config.description)
      ]);
      const stts = (trackData) => {
        return fullBox("stts", 0, 0, [
          u32(trackData.timeToSampleTable.length),
trackData.timeToSampleTable.map((x) => [
            u32(x.sampleCount),
u32(x.sampleDelta)
])
        ]);
      };
      const stss = (trackData) => {
        if (trackData.samples.every((x) => x.type === "key"))
          return null;
        const keySamples = [...trackData.samples.entries()].filter(([, sample]) => sample.type === "key");
        return fullBox("stss", 0, 0, [
          u32(keySamples.length),
keySamples.map(([index2]) => u32(index2 + 1))
]);
      };
      const stsc = (trackData) => {
        return fullBox("stsc", 0, 0, [
          u32(trackData.compactlyCodedChunkTable.length),
trackData.compactlyCodedChunkTable.map((x) => [
            u32(x.firstChunk),
u32(x.samplesPerChunk),
u32(1)
])
        ]);
      };
      const stsz = (trackData) => {
        if (trackData.type === "audio" && trackData.info.requiresPcmTransformation) {
          const { sampleSize } = parsePcmCodec(trackData.track.source._codec);
          return fullBox("stsz", 0, 0, [
            u32(sampleSize * trackData.info.numberOfChannels),
u32(trackData.samples.reduce((acc, x) => acc + intoTimescale(x.duration, trackData.timescale), 0))
          ]);
        }
        return fullBox("stsz", 0, 0, [
          u32(0),
u32(trackData.samples.length),
trackData.samples.map((x) => u32(x.size))
]);
      };
      const stco = (trackData) => {
        if (trackData.finalizedChunks.length > 0 && last(trackData.finalizedChunks).offset >= 2 ** 32) {
          return fullBox("co64", 0, 0, [
            u32(trackData.finalizedChunks.length),
trackData.finalizedChunks.map((x) => u64(x.offset))
]);
        }
        return fullBox("stco", 0, 0, [
          u32(trackData.finalizedChunks.length),
trackData.finalizedChunks.map((x) => u32(x.offset))
]);
      };
      const ctts = (trackData) => {
        return fullBox("ctts", 1, 0, [
          u32(trackData.compositionTimeOffsetTable.length),
trackData.compositionTimeOffsetTable.map((x) => [
            u32(x.sampleCount),
i32(x.sampleCompositionTimeOffset)
])
        ]);
      };
      const cslg = (trackData) => {
        let leastDecodeToDisplayDelta = Infinity;
        let greatestDecodeToDisplayDelta = -Infinity;
        let compositionStartTime = Infinity;
        let compositionEndTime = -Infinity;
        assert$1(trackData.compositionTimeOffsetTable.length > 0);
        assert$1(trackData.samples.length > 0);
        for (let i = 0; i < trackData.compositionTimeOffsetTable.length; i++) {
          const entry = trackData.compositionTimeOffsetTable[i];
          leastDecodeToDisplayDelta = Math.min(leastDecodeToDisplayDelta, entry.sampleCompositionTimeOffset);
          greatestDecodeToDisplayDelta = Math.max(greatestDecodeToDisplayDelta, entry.sampleCompositionTimeOffset);
        }
        for (let i = 0; i < trackData.samples.length; i++) {
          const sample = trackData.samples[i];
          compositionStartTime = Math.min(compositionStartTime, intoTimescale(sample.timestamp, trackData.timescale));
          compositionEndTime = Math.max(compositionEndTime, intoTimescale(sample.timestamp + sample.duration, trackData.timescale));
        }
        const compositionToDtsShift = Math.max(-leastDecodeToDisplayDelta, 0);
        if (compositionEndTime >= 2 ** 31) {
          return null;
        }
        return fullBox("cslg", 0, 0, [
          i32(compositionToDtsShift),
i32(leastDecodeToDisplayDelta),
i32(greatestDecodeToDisplayDelta),
i32(compositionStartTime),
i32(compositionEndTime)
]);
      };
      const mvex = (trackDatas) => {
        return box("mvex", void 0, trackDatas.map(trex));
      };
      const trex = (trackData) => {
        return fullBox("trex", 0, 0, [
          u32(trackData.track.id),
u32(1),
u32(0),
u32(0),
u32(0)
]);
      };
      const moof = (sequenceNumber, trackDatas) => {
        return box("moof", void 0, [
          mfhd(sequenceNumber),
          ...trackDatas.map(traf)
        ]);
      };
      const mfhd = (sequenceNumber) => {
        return fullBox("mfhd", 0, 0, [
          u32(sequenceNumber)
]);
      };
      const fragmentSampleFlags = (sample) => {
        let byte1 = 0;
        let byte2 = 0;
        const byte3 = 0;
        const byte4 = 0;
        const sampleIsDifferenceSample = sample.type === "delta";
        byte2 |= +sampleIsDifferenceSample;
        if (sampleIsDifferenceSample) {
          byte1 |= 1;
        } else {
          byte1 |= 2;
        }
        return byte1 << 24 | byte2 << 16 | byte3 << 8 | byte4;
      };
      const traf = (trackData) => {
        return box("traf", void 0, [
          tfhd(trackData),
          tfdt(trackData),
          trun(trackData)
        ]);
      };
      const tfhd = (trackData) => {
        assert$1(trackData.currentChunk);
        let tfFlags = 0;
        tfFlags |= 8;
        tfFlags |= 16;
        tfFlags |= 32;
        tfFlags |= 131072;
        const referenceSample = trackData.currentChunk.samples[1] ?? trackData.currentChunk.samples[0];
        const referenceSampleInfo = {
          duration: referenceSample.timescaleUnitsToNextSample,
          size: referenceSample.size,
          flags: fragmentSampleFlags(referenceSample)
        };
        return fullBox("tfhd", 0, tfFlags, [
          u32(trackData.track.id),
u32(referenceSampleInfo.duration),
u32(referenceSampleInfo.size),
u32(referenceSampleInfo.flags)
]);
      };
      const tfdt = (trackData) => {
        assert$1(trackData.currentChunk);
        return fullBox("tfdt", 1, 0, [
          u64(intoTimescale(trackData.currentChunk.startTimestamp, trackData.timescale))
]);
      };
      const trun = (trackData) => {
        assert$1(trackData.currentChunk);
        const allSampleDurations = trackData.currentChunk.samples.map((x) => x.timescaleUnitsToNextSample);
        const allSampleSizes = trackData.currentChunk.samples.map((x) => x.size);
        const allSampleFlags = trackData.currentChunk.samples.map(fragmentSampleFlags);
        const allSampleCompositionTimeOffsets = trackData.currentChunk.samples.map((x) => intoTimescale(x.timestamp - x.decodeTimestamp, trackData.timescale));
        const uniqueSampleDurations = new Set(allSampleDurations);
        const uniqueSampleSizes = new Set(allSampleSizes);
        const uniqueSampleFlags = new Set(allSampleFlags);
        const uniqueSampleCompositionTimeOffsets = new Set(allSampleCompositionTimeOffsets);
        const firstSampleFlagsPresent = uniqueSampleFlags.size === 2 && allSampleFlags[0] !== allSampleFlags[1];
        const sampleDurationPresent = uniqueSampleDurations.size > 1;
        const sampleSizePresent = uniqueSampleSizes.size > 1;
        const sampleFlagsPresent = !firstSampleFlagsPresent && uniqueSampleFlags.size > 1;
        const sampleCompositionTimeOffsetsPresent = uniqueSampleCompositionTimeOffsets.size > 1 || [...uniqueSampleCompositionTimeOffsets].some((x) => x !== 0);
        let flags2 = 0;
        flags2 |= 1;
        flags2 |= 4 * +firstSampleFlagsPresent;
        flags2 |= 256 * +sampleDurationPresent;
        flags2 |= 512 * +sampleSizePresent;
        flags2 |= 1024 * +sampleFlagsPresent;
        flags2 |= 2048 * +sampleCompositionTimeOffsetsPresent;
        return fullBox("trun", 1, flags2, [
          u32(trackData.currentChunk.samples.length),
u32(trackData.currentChunk.offset - trackData.currentChunk.moofOffset || 0),
firstSampleFlagsPresent ? u32(allSampleFlags[0]) : [],
          trackData.currentChunk.samples.map((_, i) => [
            sampleDurationPresent ? u32(allSampleDurations[i]) : [],
sampleSizePresent ? u32(allSampleSizes[i]) : [],
sampleFlagsPresent ? u32(allSampleFlags[i]) : [],

sampleCompositionTimeOffsetsPresent ? i32(allSampleCompositionTimeOffsets[i]) : []
          ])
        ]);
      };
      const mfra = (trackDatas) => {
        return box("mfra", void 0, [
          ...trackDatas.map(tfra),
          mfro()
        ]);
      };
      const tfra = (trackData, trackIndex) => {
        const version = 1;
        return fullBox("tfra", version, 0, [
          u32(trackData.track.id),
u32(63),
u32(trackData.finalizedChunks.length),
trackData.finalizedChunks.map((chunk) => [
            u64(intoTimescale(chunk.samples[0].timestamp, trackData.timescale)),
u64(chunk.moofOffset),
u32(trackIndex + 1),
u32(1),
u32(1)
])
        ]);
      };
      const mfro = () => {
        return fullBox("mfro", 0, 0, [

u32(0)
]);
      };
      const vtte = () => box("vtte");
      const vttc = (payload, timestamp, identifier, settings, sourceId) => box("vttc", void 0, [
        sourceId !== null ? box("vsid", [i32(sourceId)]) : null,
        identifier !== null ? box("iden", [...textEncoder.encode(identifier)]) : null,
        timestamp !== null ? box("ctim", [...textEncoder.encode(formatSubtitleTimestamp(timestamp))]) : null,
        settings !== null ? box("sttg", [...textEncoder.encode(settings)]) : null,
        box("payl", [...textEncoder.encode(payload)])
      ]);
      const vtta = (notes) => box("vtta", [...textEncoder.encode(notes)]);
      const udta = (muxer) => {
        const boxes = [];
        const metadataFormat = muxer.format._options.metadataFormat ?? "auto";
        const metadataTags = muxer.output._metadataTags;
        if (metadataFormat === "mdir" || metadataFormat === "auto" && !muxer.isQuickTime) {
          const metaBox = metaMdir(metadataTags);
          if (metaBox)
            boxes.push(metaBox);
        } else if (metadataFormat === "mdta") {
          const metaBox = metaMdta(metadataTags);
          if (metaBox)
            boxes.push(metaBox);
        } else if (metadataFormat === "udta" || metadataFormat === "auto" && muxer.isQuickTime) {
          addQuickTimeMetadataTagBoxes(boxes, muxer.output._metadataTags);
        }
        if (boxes.length === 0) {
          return null;
        }
        return box("udta", void 0, boxes);
      };
      const addQuickTimeMetadataTagBoxes = (boxes, tags) => {
        for (const { key, value } of keyValueIterator(tags)) {
          switch (key) {
            case "title":
              {
                boxes.push(metadataTagStringBoxShort("©nam", value));
              }
              break;
            case "description":
              {
                boxes.push(metadataTagStringBoxShort("©des", value));
              }
              break;
            case "artist":
              {
                boxes.push(metadataTagStringBoxShort("©ART", value));
              }
              break;
            case "album":
              {
                boxes.push(metadataTagStringBoxShort("©alb", value));
              }
              break;
            case "albumArtist":
              {
                boxes.push(metadataTagStringBoxShort("albr", value));
              }
              break;
            case "genre":
              {
                boxes.push(metadataTagStringBoxShort("©gen", value));
              }
              break;
            case "date":
              {
                boxes.push(metadataTagStringBoxShort("©day", value.toISOString().slice(0, 10)));
              }
              break;
            case "comment":
              {
                boxes.push(metadataTagStringBoxShort("©cmt", value));
              }
              break;
            case "lyrics":
              {
                boxes.push(metadataTagStringBoxShort("©lyr", value));
              }
              break;
            case "raw":
              break;
            case "discNumber":
            case "discsTotal":
            case "trackNumber":
            case "tracksTotal":
            case "images":
              break;
            default:
              assertNever(key);
          }
        }
        if (tags.raw) {
          for (const key in tags.raw) {
            const value = tags.raw[key];
            if (value == null || key.length !== 4 || boxes.some((x) => x.type === key)) {
              continue;
            }
            if (typeof value === "string") {
              boxes.push(metadataTagStringBoxShort(key, value));
            } else if (value instanceof Uint8Array) {
              boxes.push(box(key, Array.from(value)));
            }
          }
        }
      };
      const metadataTagStringBoxShort = (name, value) => {
        const encoded = textEncoder.encode(value);
        return box(name, [
          u16(encoded.length),
          u16(getLanguageCodeInt("und")),
          Array.from(encoded)
        ]);
      };
      const DATA_BOX_MIME_TYPE_MAP = {
        "image/jpeg": 13,
        "image/png": 14,
        "image/bmp": 27
      };
      const generateMetadataPairs = (tags, isMdta) => {
        const pairs = [];
        for (const { key, value } of keyValueIterator(tags)) {
          switch (key) {
            case "title":
              {
                pairs.push({ key: isMdta ? "title" : "©nam", value: dataStringBoxLong(value) });
              }
              break;
            case "description":
              {
                pairs.push({ key: isMdta ? "description" : "©des", value: dataStringBoxLong(value) });
              }
              break;
            case "artist":
              {
                pairs.push({ key: isMdta ? "artist" : "©ART", value: dataStringBoxLong(value) });
              }
              break;
            case "album":
              {
                pairs.push({ key: isMdta ? "album" : "©alb", value: dataStringBoxLong(value) });
              }
              break;
            case "albumArtist":
              {
                pairs.push({ key: isMdta ? "album_artist" : "aART", value: dataStringBoxLong(value) });
              }
              break;
            case "comment":
              {
                pairs.push({ key: isMdta ? "comment" : "©cmt", value: dataStringBoxLong(value) });
              }
              break;
            case "genre":
              {
                pairs.push({ key: isMdta ? "genre" : "©gen", value: dataStringBoxLong(value) });
              }
              break;
            case "lyrics":
              {
                pairs.push({ key: isMdta ? "lyrics" : "©lyr", value: dataStringBoxLong(value) });
              }
              break;
            case "date":
              {
                pairs.push({
                  key: isMdta ? "date" : "©day",
                  value: dataStringBoxLong(value.toISOString().slice(0, 10))
                });
              }
              break;
            case "images":
              {
                for (const image of value) {
                  if (image.kind !== "coverFront") {
                    continue;
                  }
                  pairs.push({ key: "covr", value: box("data", [
                    u32(DATA_BOX_MIME_TYPE_MAP[image.mimeType] ?? 0),
u32(0),
Array.from(image.data)
]) });
                }
              }
              break;
            case "trackNumber":
              {
                if (isMdta) {
                  const string = tags.tracksTotal !== void 0 ? `${value}/${tags.tracksTotal}` : value.toString();
                  pairs.push({ key: "track", value: dataStringBoxLong(string) });
                } else {
                  pairs.push({ key: "trkn", value: box("data", [
                    u32(0),
u32(0),
                    u16(0),
u16(value),
                    u16(tags.tracksTotal ?? 0),
                    u16(0)
]) });
                }
              }
              break;
            case "discNumber":
              {
                if (!isMdta) {
                  pairs.push({ key: "disc", value: box("data", [
                    u32(0),
u32(0),
                    u16(0),
u16(value),
                    u16(tags.discsTotal ?? 0),
                    u16(0)
]) });
                }
              }
              break;
            case "tracksTotal":
            case "discsTotal":
              break;
            case "raw":
              break;
            default:
              assertNever(key);
          }
        }
        if (tags.raw) {
          for (const key in tags.raw) {
            const value = tags.raw[key];
            if (value == null || !isMdta && key.length !== 4 || pairs.some((x) => x.key === key)) {
              continue;
            }
            if (typeof value === "string") {
              pairs.push({ key, value: dataStringBoxLong(value) });
            } else if (value instanceof Uint8Array) {
              pairs.push({ key, value: box("data", [
                u32(0),
u32(0),
Array.from(value)
              ]) });
            } else if (value instanceof RichImageData) {
              pairs.push({ key, value: box("data", [
                u32(DATA_BOX_MIME_TYPE_MAP[value.mimeType] ?? 0),
u32(0),
Array.from(value.data)
]) });
            }
          }
        }
        return pairs;
      };
      const metaMdir = (tags) => {
        const pairs = generateMetadataPairs(tags, false);
        if (pairs.length === 0) {
          return null;
        }
        return fullBox("meta", 0, 0, void 0, [
          hdlr(false, "mdir", "", "appl"),
box("ilst", void 0, pairs.map((pair) => box(pair.key, void 0, [pair.value])))
]);
      };
      const metaMdta = (tags) => {
        const pairs = generateMetadataPairs(tags, true);
        if (pairs.length === 0) {
          return null;
        }
        return box("meta", void 0, [
          hdlr(false, "mdta", ""),
fullBox("keys", 0, 0, [
            u32(pairs.length)
          ], pairs.map((pair) => box("mdta", [
            ...textEncoder.encode(pair.key)
          ]))),
          box("ilst", void 0, pairs.map((pair, i) => {
            const boxName = String.fromCharCode(...u32(i + 1));
            return box(boxName, void 0, [pair.value]);
          }))
        ]);
      };
      const dataStringBoxLong = (value) => {
        return box("data", [
          u32(1),
u32(0),
...textEncoder.encode(value)
        ]);
      };
      const VIDEO_CODEC_TO_BOX_NAME = {
        avc: "avc1",
        hevc: "hvc1",
        vp8: "vp08",
        vp9: "vp09",
        av1: "av01"
      };
      const VIDEO_CODEC_TO_CONFIGURATION_BOX = {
        avc: avcC,
        hevc: hvcC,
        vp8: vpcC,
        vp9: vpcC,
        av1: av1C
      };
      const audioCodecToBoxName = (codec, isQuickTime) => {
        switch (codec) {
          case "aac":
            return "mp4a";
          case "mp3":
            return "mp4a";
          case "opus":
            return "Opus";
          case "vorbis":
            return "mp4a";
          case "flac":
            return "fLaC";
          case "ulaw":
            return "ulaw";
          case "alaw":
            return "alaw";
          case "pcm-u8":
            return "raw ";
          case "pcm-s8":
            return "sowt";
        }
        if (isQuickTime) {
          switch (codec) {
            case "pcm-s16":
              return "sowt";
            case "pcm-s16be":
              return "twos";
            case "pcm-s24":
              return "in24";
            case "pcm-s24be":
              return "in24";
            case "pcm-s32":
              return "in32";
            case "pcm-s32be":
              return "in32";
            case "pcm-f32":
              return "fl32";
            case "pcm-f32be":
              return "fl32";
            case "pcm-f64":
              return "fl64";
            case "pcm-f64be":
              return "fl64";
          }
        } else {
          switch (codec) {
            case "pcm-s16":
              return "ipcm";
            case "pcm-s16be":
              return "ipcm";
            case "pcm-s24":
              return "ipcm";
            case "pcm-s24be":
              return "ipcm";
            case "pcm-s32":
              return "ipcm";
            case "pcm-s32be":
              return "ipcm";
            case "pcm-f32":
              return "fpcm";
            case "pcm-f32be":
              return "fpcm";
            case "pcm-f64":
              return "fpcm";
            case "pcm-f64be":
              return "fpcm";
          }
        }
      };
      const audioCodecToConfigurationBox = (codec, isQuickTime) => {
        switch (codec) {
          case "aac":
            return esds;
          case "mp3":
            return esds;
          case "opus":
            return dOps;
          case "vorbis":
            return esds;
          case "flac":
            return dfLa;
        }
        if (isQuickTime) {
          switch (codec) {
            case "pcm-s24":
              return wave;
            case "pcm-s24be":
              return wave;
            case "pcm-s32":
              return wave;
            case "pcm-s32be":
              return wave;
            case "pcm-f32":
              return wave;
            case "pcm-f32be":
              return wave;
            case "pcm-f64":
              return wave;
            case "pcm-f64be":
              return wave;
          }
        } else {
          switch (codec) {
            case "pcm-s16":
              return pcmC;
            case "pcm-s16be":
              return pcmC;
            case "pcm-s24":
              return pcmC;
            case "pcm-s24be":
              return pcmC;
            case "pcm-s32":
              return pcmC;
            case "pcm-s32be":
              return pcmC;
            case "pcm-f32":
              return pcmC;
            case "pcm-f32be":
              return pcmC;
            case "pcm-f64":
              return pcmC;
            case "pcm-f64be":
              return pcmC;
          }
        }
        return null;
      };
      const SUBTITLE_CODEC_TO_BOX_NAME = {
        webvtt: "wvtt"
      };
      const SUBTITLE_CODEC_TO_CONFIGURATION_BOX = {
        webvtt: vttC
      };
      const getLanguageCodeInt = (code) => {
        assert$1(code.length === 3);
        let language = 0;
        for (let i = 0; i < 3; i++) {
          language <<= 5;
          language += code.charCodeAt(i) - 96;
        }
        return language;
      };
class Writer {
        constructor() {
          this.ensureMonotonicity = false;
          this.trackedWrites = null;
          this.trackedStart = -1;
          this.trackedEnd = -1;
        }
        start() {
        }
        maybeTrackWrites(data) {
          if (!this.trackedWrites) {
            return;
          }
          let pos = this.getPos();
          if (pos < this.trackedStart) {
            if (pos + data.byteLength <= this.trackedStart) {
              return;
            }
            data = data.subarray(this.trackedStart - pos);
            pos = 0;
          }
          const neededSize = pos + data.byteLength - this.trackedStart;
          let newLength = this.trackedWrites.byteLength;
          while (newLength < neededSize) {
            newLength *= 2;
          }
          if (newLength !== this.trackedWrites.byteLength) {
            const copy = new Uint8Array(newLength);
            copy.set(this.trackedWrites, 0);
            this.trackedWrites = copy;
          }
          this.trackedWrites.set(data, pos - this.trackedStart);
          this.trackedEnd = Math.max(this.trackedEnd, pos + data.byteLength);
        }
        startTrackingWrites() {
          this.trackedWrites = new Uint8Array(2 ** 10);
          this.trackedStart = this.getPos();
          this.trackedEnd = this.trackedStart;
        }
        stopTrackingWrites() {
          if (!this.trackedWrites) {
            throw new Error("Internal error: Can't get tracked writes since nothing was tracked.");
          }
          const slice = this.trackedWrites.subarray(0, this.trackedEnd - this.trackedStart);
          const result = {
            data: slice,
            start: this.trackedStart,
            end: this.trackedEnd
          };
          this.trackedWrites = null;
          return result;
        }
      }
      const ARRAY_BUFFER_INITIAL_SIZE = 2 ** 16;
      const ARRAY_BUFFER_MAX_SIZE = 2 ** 32;
      class BufferTargetWriter extends Writer {
        constructor(target) {
          super();
          this.pos = 0;
          this.maxPos = 0;
          this.target = target;
          this.supportsResize = "resize" in new ArrayBuffer(0);
          if (this.supportsResize) {
            try {
              this.buffer = new ArrayBuffer(ARRAY_BUFFER_INITIAL_SIZE, { maxByteLength: ARRAY_BUFFER_MAX_SIZE });
            } catch {
              this.buffer = new ArrayBuffer(ARRAY_BUFFER_INITIAL_SIZE);
              this.supportsResize = false;
            }
          } else {
            this.buffer = new ArrayBuffer(ARRAY_BUFFER_INITIAL_SIZE);
          }
          this.bytes = new Uint8Array(this.buffer);
        }
        ensureSize(size) {
          let newLength = this.buffer.byteLength;
          while (newLength < size)
            newLength *= 2;
          if (newLength === this.buffer.byteLength)
            return;
          if (newLength > ARRAY_BUFFER_MAX_SIZE) {
            throw new Error(`ArrayBuffer exceeded maximum size of ${ARRAY_BUFFER_MAX_SIZE} bytes. Please consider using another target.`);
          }
          if (this.supportsResize) {
            this.buffer.resize(newLength);
          } else {
            const newBuffer = new ArrayBuffer(newLength);
            const newBytes = new Uint8Array(newBuffer);
            newBytes.set(this.bytes, 0);
            this.buffer = newBuffer;
            this.bytes = newBytes;
          }
        }
        write(data) {
          this.maybeTrackWrites(data);
          this.ensureSize(this.pos + data.byteLength);
          this.bytes.set(data, this.pos);
          this.target.onwrite?.(this.pos, this.pos + data.byteLength);
          this.pos += data.byteLength;
          this.maxPos = Math.max(this.maxPos, this.pos);
        }
        seek(newPos) {
          this.pos = newPos;
        }
        getPos() {
          return this.pos;
        }
        async flush() {
        }
        async finalize() {
          this.ensureSize(this.pos);
          this.target.buffer = this.buffer.slice(0, Math.max(this.maxPos, this.pos));
        }
        async close() {
        }
        getSlice(start, end) {
          return this.bytes.slice(start, end);
        }
      }
      class NullTargetWriter extends Writer {
        constructor(target) {
          super();
          this.target = target;
          this.pos = 0;
        }
        write(data) {
          this.maybeTrackWrites(data);
          this.target.onwrite?.(this.pos, this.pos + data.byteLength);
          this.pos += data.byteLength;
        }
        getPos() {
          return this.pos;
        }
        seek(newPos) {
          this.pos = newPos;
        }
        async flush() {
        }
        async finalize() {
        }
        async close() {
        }
      }
class Target {
        constructor() {
          this._output = null;
          this.onwrite = null;
        }
      }
      class BufferTarget extends Target {
        constructor() {
          super(...arguments);
          this.buffer = null;
        }
_createWriter() {
          return new BufferTargetWriter(this);
        }
      }
      class NullTarget extends Target {
_createWriter() {
          return new NullTargetWriter(this);
        }
      }
const buildIsobmffMimeType = (info) => {
        const base = info.hasVideo ? "video/" : info.hasAudio ? "audio/" : "application/";
        let string = base + (info.isQuickTime ? "quicktime" : "mp4");
        if (info.codecStrings.length > 0) {
          const uniqueCodecMimeTypes = [...new Set(info.codecStrings)];
          string += `; codecs="${uniqueCodecMimeTypes.join(", ")}"`;
        }
        return string;
      };
const MIN_BOX_HEADER_SIZE = 8;
      const MAX_BOX_HEADER_SIZE = 16;
const GLOBAL_TIMESCALE = 1e3;
      const TIMESTAMP_OFFSET = 2082844800;
      const getTrackMetadata = (trackData) => {
        const metadata = {};
        const track = trackData.track;
        if (track.metadata.name !== void 0) {
          metadata.name = track.metadata.name;
        }
        return metadata;
      };
      const intoTimescale = (timeInSeconds, timescale, round = true) => {
        const value = timeInSeconds * timescale;
        return round ? Math.round(value) : value;
      };
      class IsobmffMuxer extends Muxer {
        constructor(output, format) {
          super(output);
          this.auxTarget = new BufferTarget();
          this.auxWriter = this.auxTarget._createWriter();
          this.auxBoxWriter = new IsobmffBoxWriter(this.auxWriter);
          this.mdat = null;
          this.ftypSize = null;
          this.trackDatas = [];
          this.allTracksKnown = promiseWithResolvers();
          this.creationTime = Math.floor(Date.now() / 1e3) + TIMESTAMP_OFFSET;
          this.finalizedChunks = [];
          this.nextFragmentNumber = 1;
          this.maxWrittenTimestamp = -Infinity;
          this.format = format;
          this.writer = output._writer;
          this.boxWriter = new IsobmffBoxWriter(this.writer);
          this.isQuickTime = format instanceof MovOutputFormat;
          const fastStartDefault = this.writer instanceof BufferTargetWriter ? "in-memory" : false;
          this.fastStart = format._options.fastStart ?? fastStartDefault;
          this.isFragmented = this.fastStart === "fragmented";
          if (this.fastStart === "in-memory" || this.isFragmented) {
            this.writer.ensureMonotonicity = true;
          }
          this.minimumFragmentDuration = format._options.minimumFragmentDuration ?? 1;
        }
        async start() {
          const release = await this.mutex.acquire();
          const holdsAvc = this.output._tracks.some((x) => x.type === "video" && x.source._codec === "avc");
          {
            if (this.format._options.onFtyp) {
              this.writer.startTrackingWrites();
            }
            this.boxWriter.writeBox(ftyp({
              isQuickTime: this.isQuickTime,
              holdsAvc,
              fragmented: this.isFragmented
            }));
            if (this.format._options.onFtyp) {
              const { data, start } = this.writer.stopTrackingWrites();
              this.format._options.onFtyp(data, start);
            }
          }
          this.ftypSize = this.writer.getPos();
          if (this.fastStart === "in-memory") ;
          else if (this.fastStart === "reserve") {
            for (const track of this.output._tracks) {
              if (track.metadata.maximumPacketCount === void 0) {
                throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
              }
            }
          } else if (this.isFragmented) ;
          else {
            if (this.format._options.onMdat) {
              this.writer.startTrackingWrites();
            }
            this.mdat = mdat(true);
            this.boxWriter.writeBox(this.mdat);
          }
          await this.writer.flush();
          release();
        }
        allTracksAreKnown() {
          for (const track of this.output._tracks) {
            if (!track.source._closed && !this.trackDatas.some((x) => x.track === track)) {
              return false;
            }
          }
          return true;
        }
        async getMimeType() {
          await this.allTracksKnown.promise;
          const codecStrings = this.trackDatas.map((trackData) => {
            if (trackData.type === "video") {
              return trackData.info.decoderConfig.codec;
            } else if (trackData.type === "audio") {
              return trackData.info.decoderConfig.codec;
            } else {
              const map = {
                webvtt: "wvtt"
              };
              return map[trackData.track.source._codec];
            }
          });
          return buildIsobmffMimeType({
            isQuickTime: this.isQuickTime,
            hasVideo: this.trackDatas.some((x) => x.type === "video"),
            hasAudio: this.trackDatas.some((x) => x.type === "audio"),
            codecStrings
          });
        }
        getVideoTrackData(track, packet, meta) {
          const existingTrackData = this.trackDatas.find((x) => x.track === track);
          if (existingTrackData) {
            return existingTrackData;
          }
          validateVideoChunkMetadata(meta);
          assert$1(meta);
          assert$1(meta.decoderConfig);
          const decoderConfig = { ...meta.decoderConfig };
          assert$1(decoderConfig.codedWidth !== void 0);
          assert$1(decoderConfig.codedHeight !== void 0);
          let requiresAnnexBTransformation = false;
          if (track.source._codec === "avc" && !decoderConfig.description) {
            const decoderConfigurationRecord = extractAvcDecoderConfigurationRecord(packet.data);
            if (!decoderConfigurationRecord) {
              throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
            }
            decoderConfig.description = serializeAvcDecoderConfigurationRecord(decoderConfigurationRecord);
            requiresAnnexBTransformation = true;
          } else if (track.source._codec === "hevc" && !decoderConfig.description) {
            const decoderConfigurationRecord = extractHevcDecoderConfigurationRecord(packet.data);
            if (!decoderConfigurationRecord) {
              throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
            }
            decoderConfig.description = serializeHevcDecoderConfigurationRecord(decoderConfigurationRecord);
            requiresAnnexBTransformation = true;
          }
          const timescale = computeRationalApproximation(1 / (track.metadata.frameRate ?? 57600), 1e6).denominator;
          const newTrackData = {
            muxer: this,
            track,
            type: "video",
            info: {
              width: decoderConfig.codedWidth,
              height: decoderConfig.codedHeight,
              decoderConfig,
              requiresAnnexBTransformation
            },
            timescale,
            samples: [],
            sampleQueue: [],
            timestampProcessingQueue: [],
            timeToSampleTable: [],
            compositionTimeOffsetTable: [],
            lastTimescaleUnits: null,
            lastSample: null,
            finalizedChunks: [],
            currentChunk: null,
            compactlyCodedChunkTable: []
          };
          this.trackDatas.push(newTrackData);
          this.trackDatas.sort((a, b) => a.track.id - b.track.id);
          if (this.allTracksAreKnown()) {
            this.allTracksKnown.resolve();
          }
          return newTrackData;
        }
        getAudioTrackData(track, meta) {
          const existingTrackData = this.trackDatas.find((x) => x.track === track);
          if (existingTrackData) {
            return existingTrackData;
          }
          validateAudioChunkMetadata(meta);
          assert$1(meta);
          assert$1(meta.decoderConfig);
          const newTrackData = {
            muxer: this,
            track,
            type: "audio",
            info: {
              numberOfChannels: meta.decoderConfig.numberOfChannels,
              sampleRate: meta.decoderConfig.sampleRate,
              decoderConfig: meta.decoderConfig,
              requiresPcmTransformation: !this.isFragmented && PCM_AUDIO_CODECS.includes(track.source._codec)
            },
            timescale: meta.decoderConfig.sampleRate,
            samples: [],
            sampleQueue: [],
            timestampProcessingQueue: [],
            timeToSampleTable: [],
            compositionTimeOffsetTable: [],
            lastTimescaleUnits: null,
            lastSample: null,
            finalizedChunks: [],
            currentChunk: null,
            compactlyCodedChunkTable: []
          };
          this.trackDatas.push(newTrackData);
          this.trackDatas.sort((a, b) => a.track.id - b.track.id);
          if (this.allTracksAreKnown()) {
            this.allTracksKnown.resolve();
          }
          return newTrackData;
        }
        getSubtitleTrackData(track, meta) {
          const existingTrackData = this.trackDatas.find((x) => x.track === track);
          if (existingTrackData) {
            return existingTrackData;
          }
          validateSubtitleMetadata(meta);
          assert$1(meta);
          assert$1(meta.config);
          const newTrackData = {
            muxer: this,
            track,
            type: "subtitle",
            info: {
              config: meta.config
            },
            timescale: 1e3,
samples: [],
            sampleQueue: [],
            timestampProcessingQueue: [],
            timeToSampleTable: [],
            compositionTimeOffsetTable: [],
            lastTimescaleUnits: null,
            lastSample: null,
            finalizedChunks: [],
            currentChunk: null,
            compactlyCodedChunkTable: [],
            lastCueEndTimestamp: 0,
            cueQueue: [],
            nextSourceId: 0,
            cueToSourceId: new WeakMap()
          };
          this.trackDatas.push(newTrackData);
          this.trackDatas.sort((a, b) => a.track.id - b.track.id);
          if (this.allTracksAreKnown()) {
            this.allTracksKnown.resolve();
          }
          return newTrackData;
        }
        async addEncodedVideoPacket(track, packet, meta) {
          const release = await this.mutex.acquire();
          try {
            const trackData = this.getVideoTrackData(track, packet, meta);
            let packetData = packet.data;
            if (trackData.info.requiresAnnexBTransformation) {
              const transformedData = transformAnnexBToLengthPrefixed(packetData);
              if (!transformedData) {
                throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
              }
              packetData = transformedData;
            }
            const timestamp = this.validateAndNormalizeTimestamp(trackData.track, packet.timestamp, packet.type === "key");
            const internalSample = this.createSampleForTrack(trackData, packetData, timestamp, packet.duration, packet.type);
            await this.registerSample(trackData, internalSample);
          } finally {
            release();
          }
        }
        async addEncodedAudioPacket(track, packet, meta) {
          const release = await this.mutex.acquire();
          try {
            const trackData = this.getAudioTrackData(track, meta);
            const timestamp = this.validateAndNormalizeTimestamp(trackData.track, packet.timestamp, packet.type === "key");
            const internalSample = this.createSampleForTrack(trackData, packet.data, timestamp, packet.duration, packet.type);
            if (trackData.info.requiresPcmTransformation) {
              await this.maybePadWithSilence(trackData, timestamp);
            }
            await this.registerSample(trackData, internalSample);
          } finally {
            release();
          }
        }
        async maybePadWithSilence(trackData, untilTimestamp) {
          const lastSample = last(trackData.samples);
          const lastEndTimestamp = lastSample ? lastSample.timestamp + lastSample.duration : 0;
          const delta = untilTimestamp - lastEndTimestamp;
          const deltaInTimescale = intoTimescale(delta, trackData.timescale);
          if (deltaInTimescale > 0) {
            const { sampleSize, silentValue } = parsePcmCodec(trackData.info.decoderConfig.codec);
            const samplesNeeded = deltaInTimescale * trackData.info.numberOfChannels;
            const data = new Uint8Array(sampleSize * samplesNeeded).fill(silentValue);
            const paddingSample = this.createSampleForTrack(trackData, new Uint8Array(data.buffer), lastEndTimestamp, delta, "key");
            await this.registerSample(trackData, paddingSample);
          }
        }
        async addSubtitleCue(track, cue, meta) {
          const release = await this.mutex.acquire();
          try {
            const trackData = this.getSubtitleTrackData(track, meta);
            this.validateAndNormalizeTimestamp(trackData.track, cue.timestamp, true);
            if (track.source._codec === "webvtt") {
              trackData.cueQueue.push(cue);
              await this.processWebVTTCues(trackData, cue.timestamp);
            } else {
            }
          } finally {
            release();
          }
        }
        async processWebVTTCues(trackData, until) {
          while (trackData.cueQueue.length > 0) {
            const timestamps = new Set([]);
            for (const cue of trackData.cueQueue) {
              assert$1(cue.timestamp <= until);
              assert$1(trackData.lastCueEndTimestamp <= cue.timestamp + cue.duration);
              timestamps.add(Math.max(cue.timestamp, trackData.lastCueEndTimestamp));
              timestamps.add(cue.timestamp + cue.duration);
            }
            const sortedTimestamps = [...timestamps].sort((a, b) => a - b);
            const sampleStart = sortedTimestamps[0];
            const sampleEnd = sortedTimestamps[1] ?? sampleStart;
            if (until < sampleEnd) {
              break;
            }
            if (trackData.lastCueEndTimestamp < sampleStart) {
              this.auxWriter.seek(0);
              const box2 = vtte();
              this.auxBoxWriter.writeBox(box2);
              const body2 = this.auxWriter.getSlice(0, this.auxWriter.getPos());
              const sample2 = this.createSampleForTrack(trackData, body2, trackData.lastCueEndTimestamp, sampleStart - trackData.lastCueEndTimestamp, "key");
              await this.registerSample(trackData, sample2);
              trackData.lastCueEndTimestamp = sampleStart;
            }
            this.auxWriter.seek(0);
            for (let i = 0; i < trackData.cueQueue.length; i++) {
              const cue = trackData.cueQueue[i];
              if (cue.timestamp >= sampleEnd) {
                break;
              }
              inlineTimestampRegex.lastIndex = 0;
              const containsTimestamp = inlineTimestampRegex.test(cue.text);
              const endTimestamp = cue.timestamp + cue.duration;
              let sourceId = trackData.cueToSourceId.get(cue);
              if (sourceId === void 0 && sampleEnd < endTimestamp) {
                sourceId = trackData.nextSourceId++;
                trackData.cueToSourceId.set(cue, sourceId);
              }
              if (cue.notes) {
                const box3 = vtta(cue.notes);
                this.auxBoxWriter.writeBox(box3);
              }
              const box2 = vttc(cue.text, containsTimestamp ? sampleStart : null, cue.identifier ?? null, cue.settings ?? null, sourceId ?? null);
              this.auxBoxWriter.writeBox(box2);
              if (endTimestamp === sampleEnd) {
                trackData.cueQueue.splice(i--, 1);
              }
            }
            const body = this.auxWriter.getSlice(0, this.auxWriter.getPos());
            const sample = this.createSampleForTrack(trackData, body, sampleStart, sampleEnd - sampleStart, "key");
            await this.registerSample(trackData, sample);
            trackData.lastCueEndTimestamp = sampleEnd;
          }
        }
        createSampleForTrack(trackData, data, timestamp, duration, type) {
          const sample = {
            timestamp,
            decodeTimestamp: timestamp,
duration,
            data,
            size: data.byteLength,
            type,
            timescaleUnitsToNextSample: intoTimescale(duration, trackData.timescale)
};
          return sample;
        }
        processTimestamps(trackData, nextSample) {
          if (trackData.timestampProcessingQueue.length === 0) {
            return;
          }
          if (trackData.type === "audio" && trackData.info.requiresPcmTransformation) {
            let totalDuration = 0;
            for (let i = 0; i < trackData.timestampProcessingQueue.length; i++) {
              const sample = trackData.timestampProcessingQueue[i];
              const duration = intoTimescale(sample.duration, trackData.timescale);
              totalDuration += duration;
            }
            if (trackData.timeToSampleTable.length === 0) {
              trackData.timeToSampleTable.push({
                sampleCount: totalDuration,
                sampleDelta: 1
              });
            } else {
              const lastEntry = last(trackData.timeToSampleTable);
              lastEntry.sampleCount += totalDuration;
            }
            trackData.timestampProcessingQueue.length = 0;
            return;
          }
          const sortedTimestamps = trackData.timestampProcessingQueue.map((x) => x.timestamp).sort((a, b) => a - b);
          for (let i = 0; i < trackData.timestampProcessingQueue.length; i++) {
            const sample = trackData.timestampProcessingQueue[i];
            sample.decodeTimestamp = sortedTimestamps[i];
            if (!this.isFragmented && trackData.lastTimescaleUnits === null) {
              sample.decodeTimestamp = 0;
            }
            const sampleCompositionTimeOffset = intoTimescale(sample.timestamp - sample.decodeTimestamp, trackData.timescale);
            const durationInTimescale = intoTimescale(sample.duration, trackData.timescale);
            if (trackData.lastTimescaleUnits !== null) {
              assert$1(trackData.lastSample);
              const timescaleUnits = intoTimescale(sample.decodeTimestamp, trackData.timescale, false);
              const delta = Math.round(timescaleUnits - trackData.lastTimescaleUnits);
              assert$1(delta >= 0);
              trackData.lastTimescaleUnits += delta;
              trackData.lastSample.timescaleUnitsToNextSample = delta;
              if (!this.isFragmented) {
                let lastTableEntry = last(trackData.timeToSampleTable);
                assert$1(lastTableEntry);
                if (lastTableEntry.sampleCount === 1) {
                  lastTableEntry.sampleDelta = delta;
                  const entryBefore = trackData.timeToSampleTable[trackData.timeToSampleTable.length - 2];
                  if (entryBefore && entryBefore.sampleDelta === delta) {
                    entryBefore.sampleCount++;
                    trackData.timeToSampleTable.pop();
                    lastTableEntry = entryBefore;
                  }
                } else if (lastTableEntry.sampleDelta !== delta) {
                  lastTableEntry.sampleCount--;
                  trackData.timeToSampleTable.push(lastTableEntry = {
                    sampleCount: 1,
                    sampleDelta: delta
                  });
                }
                if (lastTableEntry.sampleDelta === durationInTimescale) {
                  lastTableEntry.sampleCount++;
                } else {
                  trackData.timeToSampleTable.push({
                    sampleCount: 1,
                    sampleDelta: durationInTimescale
                  });
                }
                const lastCompositionTimeOffsetTableEntry = last(trackData.compositionTimeOffsetTable);
                assert$1(lastCompositionTimeOffsetTableEntry);
                if (lastCompositionTimeOffsetTableEntry.sampleCompositionTimeOffset === sampleCompositionTimeOffset) {
                  lastCompositionTimeOffsetTableEntry.sampleCount++;
                } else {
                  trackData.compositionTimeOffsetTable.push({
                    sampleCount: 1,
                    sampleCompositionTimeOffset
                  });
                }
              }
            } else {
              trackData.lastTimescaleUnits = intoTimescale(sample.decodeTimestamp, trackData.timescale, false);
              if (!this.isFragmented) {
                trackData.timeToSampleTable.push({
                  sampleCount: 1,
                  sampleDelta: durationInTimescale
                });
                trackData.compositionTimeOffsetTable.push({
                  sampleCount: 1,
                  sampleCompositionTimeOffset
                });
              }
            }
            trackData.lastSample = sample;
          }
          trackData.timestampProcessingQueue.length = 0;
          assert$1(trackData.lastSample);
          assert$1(trackData.lastTimescaleUnits !== null);
          if (nextSample !== void 0 && trackData.lastSample.timescaleUnitsToNextSample === 0) {
            assert$1(nextSample.type === "key");
            const timescaleUnits = intoTimescale(nextSample.timestamp, trackData.timescale, false);
            const delta = Math.round(timescaleUnits - trackData.lastTimescaleUnits);
            trackData.lastSample.timescaleUnitsToNextSample = delta;
          }
        }
        async registerSample(trackData, sample) {
          if (sample.type === "key") {
            this.processTimestamps(trackData, sample);
          }
          trackData.timestampProcessingQueue.push(sample);
          if (this.isFragmented) {
            trackData.sampleQueue.push(sample);
            await this.interleaveSamples();
          } else if (this.fastStart === "reserve") {
            await this.registerSampleFastStartReserve(trackData, sample);
          } else {
            await this.addSampleToTrack(trackData, sample);
          }
        }
        async addSampleToTrack(trackData, sample) {
          if (!this.isFragmented) {
            trackData.samples.push(sample);
            if (this.fastStart === "reserve") {
              const maximumPacketCount = trackData.track.metadata.maximumPacketCount;
              assert$1(maximumPacketCount !== void 0);
              if (trackData.samples.length > maximumPacketCount) {
                throw new Error(`Track #${trackData.track.id} has already reached the maximum packet count (${maximumPacketCount}). Either add less packets or increase the maximum packet count.`);
              }
            }
          }
          let beginNewChunk = false;
          if (!trackData.currentChunk) {
            beginNewChunk = true;
          } else {
            trackData.currentChunk.startTimestamp = Math.min(trackData.currentChunk.startTimestamp, sample.timestamp);
            const currentChunkDuration = sample.timestamp - trackData.currentChunk.startTimestamp;
            if (this.isFragmented) {
              const keyFrameQueuedEverywhere = this.trackDatas.every((otherTrackData) => {
                if (trackData === otherTrackData) {
                  return sample.type === "key";
                }
                const firstQueuedSample = otherTrackData.sampleQueue[0];
                if (firstQueuedSample) {
                  return firstQueuedSample.type === "key";
                }
                return otherTrackData.track.source._closed;
              });
              if (currentChunkDuration >= this.minimumFragmentDuration && keyFrameQueuedEverywhere && sample.timestamp > this.maxWrittenTimestamp) {
                beginNewChunk = true;
                await this.finalizeFragment();
              }
            } else {
              beginNewChunk = currentChunkDuration >= 0.5;
            }
          }
          if (beginNewChunk) {
            if (trackData.currentChunk) {
              await this.finalizeCurrentChunk(trackData);
            }
            trackData.currentChunk = {
              startTimestamp: sample.timestamp,
              samples: [],
              offset: null,
              moofOffset: null
            };
          }
          assert$1(trackData.currentChunk);
          trackData.currentChunk.samples.push(sample);
          if (this.isFragmented) {
            this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, sample.timestamp);
          }
        }
        async finalizeCurrentChunk(trackData) {
          assert$1(!this.isFragmented);
          if (!trackData.currentChunk)
            return;
          trackData.finalizedChunks.push(trackData.currentChunk);
          this.finalizedChunks.push(trackData.currentChunk);
          let sampleCount = trackData.currentChunk.samples.length;
          if (trackData.type === "audio" && trackData.info.requiresPcmTransformation) {
            sampleCount = trackData.currentChunk.samples.reduce((acc, sample) => acc + intoTimescale(sample.duration, trackData.timescale), 0);
          }
          if (trackData.compactlyCodedChunkTable.length === 0 || last(trackData.compactlyCodedChunkTable).samplesPerChunk !== sampleCount) {
            trackData.compactlyCodedChunkTable.push({
              firstChunk: trackData.finalizedChunks.length,
samplesPerChunk: sampleCount
            });
          }
          if (this.fastStart === "in-memory") {
            trackData.currentChunk.offset = 0;
            return;
          }
          trackData.currentChunk.offset = this.writer.getPos();
          for (const sample of trackData.currentChunk.samples) {
            assert$1(sample.data);
            this.writer.write(sample.data);
            sample.data = null;
          }
          await this.writer.flush();
        }
        async interleaveSamples(isFinalCall = false) {
          assert$1(this.isFragmented);
          if (!isFinalCall && !this.allTracksAreKnown()) {
            return;
          }
          outer: while (true) {
            let trackWithMinTimestamp = null;
            let minTimestamp = Infinity;
            for (const trackData of this.trackDatas) {
              if (!isFinalCall && trackData.sampleQueue.length === 0 && !trackData.track.source._closed) {
                break outer;
              }
              if (trackData.sampleQueue.length > 0 && trackData.sampleQueue[0].timestamp < minTimestamp) {
                trackWithMinTimestamp = trackData;
                minTimestamp = trackData.sampleQueue[0].timestamp;
              }
            }
            if (!trackWithMinTimestamp) {
              break;
            }
            const sample = trackWithMinTimestamp.sampleQueue.shift();
            await this.addSampleToTrack(trackWithMinTimestamp, sample);
          }
        }
        async finalizeFragment(flushWriter = true) {
          assert$1(this.isFragmented);
          const fragmentNumber = this.nextFragmentNumber++;
          if (fragmentNumber === 1) {
            if (this.format._options.onMoov) {
              this.writer.startTrackingWrites();
            }
            const movieBox = moov(this);
            this.boxWriter.writeBox(movieBox);
            if (this.format._options.onMoov) {
              const { data, start } = this.writer.stopTrackingWrites();
              this.format._options.onMoov(data, start);
            }
          }
          const tracksInFragment = this.trackDatas.filter((x) => x.currentChunk);
          const moofBox = moof(fragmentNumber, tracksInFragment);
          const moofOffset = this.writer.getPos();
          const mdatStartPos = moofOffset + this.boxWriter.measureBox(moofBox);
          let currentPos = mdatStartPos + MIN_BOX_HEADER_SIZE;
          let fragmentStartTimestamp = Infinity;
          for (const trackData of tracksInFragment) {
            trackData.currentChunk.offset = currentPos;
            trackData.currentChunk.moofOffset = moofOffset;
            for (const sample of trackData.currentChunk.samples) {
              currentPos += sample.size;
            }
            fragmentStartTimestamp = Math.min(fragmentStartTimestamp, trackData.currentChunk.startTimestamp);
          }
          const mdatSize = currentPos - mdatStartPos;
          const needsLargeMdatSize = mdatSize >= 2 ** 32;
          if (needsLargeMdatSize) {
            for (const trackData of tracksInFragment) {
              trackData.currentChunk.offset += MAX_BOX_HEADER_SIZE - MIN_BOX_HEADER_SIZE;
            }
          }
          if (this.format._options.onMoof) {
            this.writer.startTrackingWrites();
          }
          const newMoofBox = moof(fragmentNumber, tracksInFragment);
          this.boxWriter.writeBox(newMoofBox);
          if (this.format._options.onMoof) {
            const { data, start } = this.writer.stopTrackingWrites();
            this.format._options.onMoof(data, start, fragmentStartTimestamp);
          }
          assert$1(this.writer.getPos() === mdatStartPos);
          if (this.format._options.onMdat) {
            this.writer.startTrackingWrites();
          }
          const mdatBox = mdat(needsLargeMdatSize);
          mdatBox.size = mdatSize;
          this.boxWriter.writeBox(mdatBox);
          this.writer.seek(mdatStartPos + (needsLargeMdatSize ? MAX_BOX_HEADER_SIZE : MIN_BOX_HEADER_SIZE));
          for (const trackData of tracksInFragment) {
            for (const sample of trackData.currentChunk.samples) {
              this.writer.write(sample.data);
              sample.data = null;
            }
          }
          if (this.format._options.onMdat) {
            const { data, start } = this.writer.stopTrackingWrites();
            this.format._options.onMdat(data, start);
          }
          for (const trackData of tracksInFragment) {
            trackData.finalizedChunks.push(trackData.currentChunk);
            this.finalizedChunks.push(trackData.currentChunk);
            trackData.currentChunk = null;
          }
          if (flushWriter) {
            await this.writer.flush();
          }
        }
        async registerSampleFastStartReserve(trackData, sample) {
          if (this.allTracksAreKnown()) {
            if (!this.mdat) {
              const moovBox = moov(this);
              const moovSize = this.boxWriter.measureBox(moovBox);
              const reservedSize = moovSize + this.computeSampleTableSizeUpperBound() + 4096;
              assert$1(this.ftypSize !== null);
              this.writer.seek(this.ftypSize + reservedSize);
              if (this.format._options.onMdat) {
                this.writer.startTrackingWrites();
              }
              this.mdat = mdat(true);
              this.boxWriter.writeBox(this.mdat);
              for (const trackData2 of this.trackDatas) {
                for (const sample2 of trackData2.sampleQueue) {
                  await this.addSampleToTrack(trackData2, sample2);
                }
                trackData2.sampleQueue.length = 0;
              }
            }
            await this.addSampleToTrack(trackData, sample);
          } else {
            trackData.sampleQueue.push(sample);
          }
        }
        computeSampleTableSizeUpperBound() {
          assert$1(this.fastStart === "reserve");
          let upperBound = 0;
          for (const trackData of this.trackDatas) {
            const n = trackData.track.metadata.maximumPacketCount;
            assert$1(n !== void 0);
            upperBound += (4 + 4) * Math.ceil(2 / 3 * n);
            upperBound += 4 * n;
            upperBound += (4 + 4) * Math.ceil(2 / 3 * n);
            upperBound += (4 + 4 + 4) * Math.ceil(2 / 3 * n);
            upperBound += 4 * n;
            upperBound += 8 * n;
          }
          return upperBound;
        }
async onTrackClose(track) {
          const release = await this.mutex.acquire();
          if (track.type === "subtitle" && track.source._codec === "webvtt") {
            const trackData = this.trackDatas.find((x) => x.track === track);
            if (trackData) {
              await this.processWebVTTCues(trackData, Infinity);
            }
          }
          if (this.allTracksAreKnown()) {
            this.allTracksKnown.resolve();
          }
          if (this.isFragmented) {
            await this.interleaveSamples();
          }
          release();
        }
async finalize() {
          const release = await this.mutex.acquire();
          this.allTracksKnown.resolve();
          for (const trackData of this.trackDatas) {
            if (trackData.type === "subtitle" && trackData.track.source._codec === "webvtt") {
              await this.processWebVTTCues(trackData, Infinity);
            }
          }
          if (this.isFragmented) {
            await this.interleaveSamples(true);
            for (const trackData of this.trackDatas) {
              this.processTimestamps(trackData);
            }
            await this.finalizeFragment(false);
          } else {
            for (const trackData of this.trackDatas) {
              this.processTimestamps(trackData);
              await this.finalizeCurrentChunk(trackData);
            }
          }
          if (this.fastStart === "in-memory") {
            this.mdat = mdat(false);
            let mdatSize;
            for (let i = 0; i < 2; i++) {
              const movieBox2 = moov(this);
              const movieBoxSize = this.boxWriter.measureBox(movieBox2);
              mdatSize = this.boxWriter.measureBox(this.mdat);
              let currentChunkPos = this.writer.getPos() + movieBoxSize + mdatSize;
              for (const chunk of this.finalizedChunks) {
                chunk.offset = currentChunkPos;
                for (const { data } of chunk.samples) {
                  assert$1(data);
                  currentChunkPos += data.byteLength;
                  mdatSize += data.byteLength;
                }
              }
              if (currentChunkPos < 2 ** 32)
                break;
              if (mdatSize >= 2 ** 32)
                this.mdat.largeSize = true;
            }
            if (this.format._options.onMoov) {
              this.writer.startTrackingWrites();
            }
            const movieBox = moov(this);
            this.boxWriter.writeBox(movieBox);
            if (this.format._options.onMoov) {
              const { data, start } = this.writer.stopTrackingWrites();
              this.format._options.onMoov(data, start);
            }
            if (this.format._options.onMdat) {
              this.writer.startTrackingWrites();
            }
            this.mdat.size = mdatSize;
            this.boxWriter.writeBox(this.mdat);
            for (const chunk of this.finalizedChunks) {
              for (const sample of chunk.samples) {
                assert$1(sample.data);
                this.writer.write(sample.data);
                sample.data = null;
              }
            }
            if (this.format._options.onMdat) {
              const { data, start } = this.writer.stopTrackingWrites();
              this.format._options.onMdat(data, start);
            }
          } else if (this.isFragmented) {
            const startPos = this.writer.getPos();
            const mfraBox = mfra(this.trackDatas);
            this.boxWriter.writeBox(mfraBox);
            const mfraBoxSize = this.writer.getPos() - startPos;
            this.writer.seek(this.writer.getPos() - 4);
            this.boxWriter.writeU32(mfraBoxSize);
          } else {
            assert$1(this.mdat);
            const mdatPos = this.boxWriter.offsets.get(this.mdat);
            assert$1(mdatPos !== void 0);
            const mdatSize = this.writer.getPos() - mdatPos;
            this.mdat.size = mdatSize;
            this.mdat.largeSize = mdatSize >= 2 ** 32;
            this.boxWriter.patchBox(this.mdat);
            if (this.format._options.onMdat) {
              const { data, start } = this.writer.stopTrackingWrites();
              this.format._options.onMdat(data, start);
            }
            const movieBox = moov(this);
            if (this.fastStart === "reserve") {
              assert$1(this.ftypSize !== null);
              this.writer.seek(this.ftypSize);
              if (this.format._options.onMoov) {
                this.writer.startTrackingWrites();
              }
              this.boxWriter.writeBox(movieBox);
              const remainingSpace = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
              this.boxWriter.writeBox(free(remainingSpace));
            } else {
              if (this.format._options.onMoov) {
                this.writer.startTrackingWrites();
              }
              this.boxWriter.writeBox(movieBox);
            }
            if (this.format._options.onMoov) {
              const { data, start } = this.writer.stopTrackingWrites();
              this.format._options.onMoov(data, start);
            }
          }
          release();
        }
      }
const FRAME_HEADER_SIZE$1 = 4;
      const SAMPLING_RATES$1 = [44100, 48e3, 32e3];
      const KILOBIT_RATES$1 = [
-1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
-1,
        32,
        40,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        160,
        192,
        224,
        256,
        320,
        -1,
-1,
        32,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        160,
        192,
        224,
        256,
        320,
        384,
        -1,
-1,
        32,
        64,
        96,
        128,
        160,
        192,
        224,
        256,
        288,
        320,
        352,
        384,
        416,
        448,
        -1,

-1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
-1,
        8,
        16,
        24,
        32,
        40,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        -1,
-1,
        8,
        16,
        24,
        32,
        40,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        -1,
-1,
        32,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        176,
        192,
        224,
        256,
        -1
];
      const XING = 1483304551;
      const INFO = 1231971951;
      const computeMp3FrameSize$1 = (lowSamplingFrequency, layer, bitrate, sampleRate, padding) => {
        if (layer === 0) {
          return 0;
        } else if (layer === 1) {
          return Math.round(144 * bitrate / (sampleRate << lowSamplingFrequency)) + padding;
        } else if (layer === 2) {
          return Math.round(144 * bitrate / sampleRate) + padding;
        } else {
          return (Math.round(12 * bitrate / sampleRate) + padding) * 4;
        }
      };
      const getXingOffset = (mpegVersionId, channel) => {
        return mpegVersionId === 3 ? channel === 3 ? 21 : 36 : channel === 3 ? 13 : 21;
      };
      const readFrameHeader$1 = (word, remainingBytes) => {
        const firstByte = word >>> 24;
        const secondByte = word >>> 16 & 255;
        const thirdByte = word >>> 8 & 255;
        const fourthByte = word & 255;
        if (firstByte !== 255 && secondByte !== 255 && thirdByte !== 255 && fourthByte !== 255) {
          return {
            header: null,
            bytesAdvanced: 4
          };
        }
        if (firstByte !== 255) {
          return { header: null, bytesAdvanced: 1 };
        }
        if ((secondByte & 224) !== 224) {
          return { header: null, bytesAdvanced: 1 };
        }
        let lowSamplingFrequency = 0;
        let mpeg25 = 0;
        if (secondByte & 1 << 4) {
          lowSamplingFrequency = secondByte & 1 << 3 ? 0 : 1;
        } else {
          lowSamplingFrequency = 1;
          mpeg25 = 1;
        }
        const mpegVersionId = secondByte >> 3 & 3;
        const layer = secondByte >> 1 & 3;
        const bitrateIndex = thirdByte >> 4 & 15;
        const frequencyIndex = (thirdByte >> 2 & 3) % 3;
        const padding = thirdByte >> 1 & 1;
        const channel = fourthByte >> 6 & 3;
        const modeExtension = fourthByte >> 4 & 3;
        const copyright = fourthByte >> 3 & 1;
        const original = fourthByte >> 2 & 1;
        const emphasis = fourthByte & 3;
        const kilobitRate = KILOBIT_RATES$1[lowSamplingFrequency * 16 * 4 + layer * 16 + bitrateIndex];
        if (kilobitRate === -1) {
          return { header: null, bytesAdvanced: 1 };
        }
        const bitrate = kilobitRate * 1e3;
        const sampleRate = SAMPLING_RATES$1[frequencyIndex] >> lowSamplingFrequency + mpeg25;
        const frameLength = computeMp3FrameSize$1(lowSamplingFrequency, layer, bitrate, sampleRate, padding);
        if (remainingBytes !== null && remainingBytes < frameLength) {
          return { header: null, bytesAdvanced: 1 };
        }
        let audioSamplesInFrame;
        if (mpegVersionId === 3) {
          audioSamplesInFrame = layer === 3 ? 384 : 1152;
        } else {
          if (layer === 3) {
            audioSamplesInFrame = 384;
          } else if (layer === 2) {
            audioSamplesInFrame = 1152;
          } else {
            audioSamplesInFrame = 576;
          }
        }
        return {
          header: {
            totalSize: frameLength,
            mpegVersionId,
            layer,
            bitrate,
            frequencyIndex,
            sampleRate,
            channel,
            modeExtension,
            copyright,
            original,
            emphasis,
            audioSamplesInFrame
          },
          bytesAdvanced: 1
        };
      };
      const encodeSynchsafe = (unsynchsafed) => {
        let mask = 127;
        let synchsafed = 0;
        let unsynchsafedRest = unsynchsafed;
        while ((mask ^ 2147483647) !== 0) {
          synchsafed = unsynchsafedRest & ~mask;
          synchsafed <<= 1;
          synchsafed |= unsynchsafedRest & mask;
          mask = (mask + 1 << 8) - 1;
          unsynchsafedRest = synchsafed;
        }
        return synchsafed;
      };
      const decodeSynchsafe = (synchsafed) => {
        let mask = 2130706432;
        let unsynchsafed = 0;
        while (mask !== 0) {
          unsynchsafed >>= 1;
          unsynchsafed |= synchsafed & mask;
          mask >>= 8;
        }
        return unsynchsafed;
      };
var Id3V2HeaderFlags;
      (function(Id3V2HeaderFlags2) {
        Id3V2HeaderFlags2[Id3V2HeaderFlags2["Unsynchronisation"] = 128] = "Unsynchronisation";
        Id3V2HeaderFlags2[Id3V2HeaderFlags2["ExtendedHeader"] = 64] = "ExtendedHeader";
        Id3V2HeaderFlags2[Id3V2HeaderFlags2["ExperimentalIndicator"] = 32] = "ExperimentalIndicator";
        Id3V2HeaderFlags2[Id3V2HeaderFlags2["Footer"] = 16] = "Footer";
      })(Id3V2HeaderFlags || (Id3V2HeaderFlags = {}));
      var Id3V2TextEncoding;
      (function(Id3V2TextEncoding2) {
        Id3V2TextEncoding2[Id3V2TextEncoding2["ISO_8859_1"] = 0] = "ISO_8859_1";
        Id3V2TextEncoding2[Id3V2TextEncoding2["UTF_16_WITH_BOM"] = 1] = "UTF_16_WITH_BOM";
        Id3V2TextEncoding2[Id3V2TextEncoding2["UTF_16_BE_NO_BOM"] = 2] = "UTF_16_BE_NO_BOM";
        Id3V2TextEncoding2[Id3V2TextEncoding2["UTF_8"] = 3] = "UTF_8";
      })(Id3V2TextEncoding || (Id3V2TextEncoding = {}));
      const ID3_V1_TAG_SIZE = 128;
      const ID3_V2_HEADER_SIZE = 10;
      const ID3_V1_GENRES = [
        "Blues",
        "Classic rock",
        "Country",
        "Dance",
        "Disco",
        "Funk",
        "Grunge",
        "Hip-hop",
        "Jazz",
        "Metal",
        "New age",
        "Oldies",
        "Other",
        "Pop",
        "Rhythm and blues",
        "Rap",
        "Reggae",
        "Rock",
        "Techno",
        "Industrial",
        "Alternative",
        "Ska",
        "Death metal",
        "Pranks",
        "Soundtrack",
        "Euro-techno",
        "Ambient",
        "Trip-hop",
        "Vocal",
        "Jazz & funk",
        "Fusion",
        "Trance",
        "Classical",
        "Instrumental",
        "Acid",
        "House",
        "Game",
        "Sound clip",
        "Gospel",
        "Noise",
        "Alternative rock",
        "Bass",
        "Soul",
        "Punk",
        "Space",
        "Meditative",
        "Instrumental pop",
        "Instrumental rock",
        "Ethnic",
        "Gothic",
        "Darkwave",
        "Techno-industrial",
        "Electronic",
        "Pop-folk",
        "Eurodance",
        "Dream",
        "Southern rock",
        "Comedy",
        "Cult",
        "Gangsta",
        "Top 40",
        "Christian rap",
        "Pop/funk",
        "Jungle music",
        "Native US",
        "Cabaret",
        "New wave",
        "Psychedelic",
        "Rave",
        "Showtunes",
        "Trailer",
        "Lo-fi",
        "Tribal",
        "Acid punk",
        "Acid jazz",
        "Polka",
        "Retro",
        "Musical",
        "Rock 'n' roll",
        "Hard rock",
        "Folk",
        "Folk rock",
        "National folk",
        "Swing",
        "Fast fusion",
        "Bebop",
        "Latin",
        "Revival",
        "Celtic",
        "Bluegrass",
        "Avantgarde",
        "Gothic rock",
        "Progressive rock",
        "Psychedelic rock",
        "Symphonic rock",
        "Slow rock",
        "Big band",
        "Chorus",
        "Easy listening",
        "Acoustic",
        "Humour",
        "Speech",
        "Chanson",
        "Opera",
        "Chamber music",
        "Sonata",
        "Symphony",
        "Booty bass",
        "Primus",
        "Porn groove",
        "Satire",
        "Slow jam",
        "Club",
        "Tango",
        "Samba",
        "Folklore",
        "Ballad",
        "Power ballad",
        "Rhythmic Soul",
        "Freestyle",
        "Duet",
        "Punk rock",
        "Drum solo",
        "A cappella",
        "Euro-house",
        "Dance hall",
        "Goa music",
        "Drum & bass",
        "Club-house",
        "Hardcore techno",
        "Terror",
        "Indie",
        "Britpop",
        "Negerpunk",
        "Polsk punk",
        "Beat",
        "Christian gangsta rap",
        "Heavy metal",
        "Black metal",
        "Crossover",
        "Contemporary Christian",
        "Christian rock",
        "Merengue",
        "Salsa",
        "Thrash metal",
        "Anime",
        "Jpop",
        "Synthpop",
        "Christmas",
        "Art rock",
        "Baroque",
        "Bhangra",
        "Big beat",
        "Breakbeat",
        "Chillout",
        "Downtempo",
        "Dub",
        "EBM",
        "Eclectic",
        "Electro",
        "Electroclash",
        "Emo",
        "Experimental",
        "Garage",
        "Global",
        "IDM",
        "Illbient",
        "Industro-Goth",
        "Jam Band",
        "Krautrock",
        "Leftfield",
        "Lounge",
        "Math rock",
        "New romantic",
        "Nu-breakz",
        "Post-punk",
        "Post-rock",
        "Psytrance",
        "Shoegaze",
        "Space rock",
        "Trop rock",
        "World music",
        "Neoclassical",
        "Audiobook",
        "Audio theatre",
        "Neue Deutsche Welle",
        "Podcast",
        "Indie rock",
        "G-Funk",
        "Dubstep",
        "Garage rock",
        "Psybient"
      ];
      const readNextFrameHeader = async (reader, startPos, until) => {
        let currentPos = startPos;
        while (until === null || currentPos < until) {
          let slice = reader.requestSlice(currentPos, FRAME_HEADER_SIZE$1);
          if (slice instanceof Promise)
            slice = await slice;
          if (!slice)
            break;
          const word = readU32Be(slice);
          const result = readFrameHeader$1(word, reader.fileSize !== null ? reader.fileSize - currentPos : null);
          if (result.header) {
            return { header: result.header, startPos: currentPos };
          }
          currentPos += result.bytesAdvanced;
        }
        return null;
      };
      const parseId3V1Tag = (slice, tags) => {
        const startPos = slice.filePos;
        tags.raw ??= {};
        tags.raw["TAG"] ??= readBytes(slice, ID3_V1_TAG_SIZE - 3);
        slice.filePos = startPos;
        const title = readId3V1String(slice, 30);
        if (title)
          tags.title ??= title;
        const artist = readId3V1String(slice, 30);
        if (artist)
          tags.artist ??= artist;
        const album = readId3V1String(slice, 30);
        if (album)
          tags.album ??= album;
        const yearText = readId3V1String(slice, 4);
        const year = Number.parseInt(yearText, 10);
        if (Number.isInteger(year) && year > 0) {
          tags.date ??= new Date(year, 0, 1);
        }
        const commentBytes = readBytes(slice, 30);
        let comment;
        if (commentBytes[28] === 0 && commentBytes[29] !== 0) {
          const trackNum = commentBytes[29];
          if (trackNum > 0) {
            tags.trackNumber ??= trackNum;
          }
          slice.skip(-30);
          comment = readId3V1String(slice, 28);
          slice.skip(2);
        } else {
          slice.skip(-30);
          comment = readId3V1String(slice, 30);
        }
        if (comment)
          tags.comment ??= comment;
        const genreIndex = readU8(slice);
        if (genreIndex < ID3_V1_GENRES.length) {
          tags.genre ??= ID3_V1_GENRES[genreIndex];
        }
      };
      const readId3V1String = (slice, length) => {
        const bytes2 = readBytes(slice, length);
        const endIndex = coalesceIndex(bytes2.indexOf(0), bytes2.length);
        const relevantBytes = bytes2.subarray(0, endIndex);
        let str = "";
        for (let i = 0; i < relevantBytes.length; i++) {
          str += String.fromCharCode(relevantBytes[i]);
        }
        return str.trimEnd();
      };
      const readId3V2Header = (slice) => {
        const startPos = slice.filePos;
        const tag = readAscii(slice, 3);
        const majorVersion = readU8(slice);
        const revision = readU8(slice);
        const flags2 = readU8(slice);
        const sizeRaw = readU32Be(slice);
        if (tag !== "ID3" || majorVersion === 255 || revision === 255 || (sizeRaw & 2155905152) !== 0) {
          slice.filePos = startPos;
          return null;
        }
        const size = decodeSynchsafe(sizeRaw);
        return { majorVersion, revision, flags: flags2, size };
      };
      const parseId3V2Tag = (slice, header, tags) => {
        if (![2, 3, 4].includes(header.majorVersion)) {
          console.warn(`Unsupported ID3v2 major version: ${header.majorVersion}`);
          return;
        }
        const bytes2 = readBytes(slice, header.size);
        const reader = new Id3V2Reader(header, bytes2);
        if (header.flags & Id3V2HeaderFlags.Footer) {
          reader.removeFooter();
        }
        if (header.flags & Id3V2HeaderFlags.Unsynchronisation && header.majorVersion === 3) {
          reader.ununsynchronizeAll();
        }
        if (header.flags & Id3V2HeaderFlags.ExtendedHeader) {
          const extendedHeaderSize = reader.readU32();
          if (header.majorVersion === 3) {
            reader.pos += extendedHeaderSize;
          } else {
            reader.pos += extendedHeaderSize - 4;
          }
        }
        while (reader.pos <= reader.bytes.length - reader.frameHeaderSize()) {
          const frame = reader.readId3V2Frame();
          if (!frame) {
            break;
          }
          const frameStartPos = reader.pos;
          const frameEndPos = reader.pos + frame.size;
          let frameEncrypted = false;
          let frameCompressed = false;
          let frameUnsynchronized = false;
          if (header.majorVersion === 3) {
            frameEncrypted = !!(frame.flags & 1 << 6);
            frameCompressed = !!(frame.flags & 1 << 7);
          } else if (header.majorVersion === 4) {
            frameEncrypted = !!(frame.flags & 1 << 2);
            frameCompressed = !!(frame.flags & 1 << 3);
            frameUnsynchronized = !!(frame.flags & 1 << 1) || !!(header.flags & Id3V2HeaderFlags.Unsynchronisation);
          }
          if (frameEncrypted) {
            console.warn(`Skipping encrypted ID3v2 frame ${frame.id}`);
            reader.pos = frameEndPos;
            continue;
          }
          if (frameCompressed) {
            console.warn(`Skipping compressed ID3v2 frame ${frame.id}`);
            reader.pos = frameEndPos;
            continue;
          }
          if (frameUnsynchronized) {
            reader.ununsynchronizeRegion(reader.pos, frameEndPos);
          }
          tags.raw ??= {};
          if (frame.id[0] === "T") {
            tags.raw[frame.id] ??= reader.readId3V2EncodingAndText(frameEndPos);
          } else {
            tags.raw[frame.id] ??= reader.readBytes(frame.size);
          }
          reader.pos = frameStartPos;
          switch (frame.id) {
            case "TIT2":
            case "TT2":
              {
                tags.title ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TIT3":
            case "TT3":
              {
                tags.description ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TPE1":
            case "TP1":
              {
                tags.artist ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TALB":
            case "TAL":
              {
                tags.album ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TPE2":
            case "TP2":
              {
                tags.albumArtist ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TRCK":
            case "TRK":
              {
                const trackText = reader.readId3V2EncodingAndText(frameEndPos);
                const parts = trackText.split("/");
                const trackNum = Number.parseInt(parts[0], 10);
                const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                if (Number.isInteger(trackNum) && trackNum > 0) {
                  tags.trackNumber ??= trackNum;
                }
                if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) {
                  tags.tracksTotal ??= tracksTotal;
                }
              }
              break;
            case "TPOS":
            case "TPA":
              {
                const discText = reader.readId3V2EncodingAndText(frameEndPos);
                const parts = discText.split("/");
                const discNum = Number.parseInt(parts[0], 10);
                const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
                if (Number.isInteger(discNum) && discNum > 0) {
                  tags.discNumber ??= discNum;
                }
                if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) {
                  tags.discsTotal ??= discsTotal;
                }
              }
              break;
            case "TCON":
            case "TCO":
              {
                const genreText = reader.readId3V2EncodingAndText(frameEndPos);
                let match = /^\((\d+)\)/.exec(genreText);
                if (match) {
                  const genreNumber = Number.parseInt(match[1]);
                  if (ID3_V1_GENRES[genreNumber] !== void 0) {
                    tags.genre ??= ID3_V1_GENRES[genreNumber];
                    break;
                  }
                }
                match = /^\d+$/.exec(genreText);
                if (match) {
                  const genreNumber = Number.parseInt(match[0]);
                  if (ID3_V1_GENRES[genreNumber] !== void 0) {
                    tags.genre ??= ID3_V1_GENRES[genreNumber];
                    break;
                  }
                }
                tags.genre ??= genreText;
              }
              break;
            case "TDRC":
            case "TDAT":
              {
                const dateText = reader.readId3V2EncodingAndText(frameEndPos);
                const date = new Date(dateText);
                if (!Number.isNaN(date.getTime())) {
                  tags.date ??= date;
                }
              }
              break;
            case "TYER":
            case "TYE":
              {
                const yearText = reader.readId3V2EncodingAndText(frameEndPos);
                const year = Number.parseInt(yearText, 10);
                if (Number.isInteger(year)) {
                  tags.date ??= new Date(year, 0, 1);
                }
              }
              break;
            case "USLT":
            case "ULT":
              {
                const encoding = reader.readU8();
                reader.pos += 3;
                reader.readId3V2Text(encoding, frameEndPos);
                tags.lyrics ??= reader.readId3V2Text(encoding, frameEndPos);
              }
              break;
            case "COMM":
            case "COM":
              {
                const encoding = reader.readU8();
                reader.pos += 3;
                reader.readId3V2Text(encoding, frameEndPos);
                tags.comment ??= reader.readId3V2Text(encoding, frameEndPos);
              }
              break;
            case "APIC":
            case "PIC":
              {
                const encoding = reader.readId3V2TextEncoding();
                let mimeType;
                if (header.majorVersion === 2) {
                  const imageFormat = reader.readAscii(3);
                  mimeType = imageFormat === "PNG" ? "image/png" : imageFormat === "JPG" ? "image/jpeg" : "image/*";
                } else {
                  mimeType = reader.readId3V2Text(encoding, frameEndPos);
                }
                const pictureType = reader.readU8();
                const description = reader.readId3V2Text(encoding, frameEndPos).trimEnd();
                const imageDataSize = frameEndPos - reader.pos;
                if (imageDataSize >= 0) {
                  const imageData = reader.readBytes(imageDataSize);
                  if (!tags.images)
                    tags.images = [];
                  tags.images.push({
                    data: imageData,
                    mimeType,
                    kind: pictureType === 3 ? "coverFront" : pictureType === 4 ? "coverBack" : "unknown",
                    description
                  });
                }
              }
              break;
            default:
              {
                reader.pos += frame.size;
              }
              break;
          }
          reader.pos = frameEndPos;
        }
      };
      class Id3V2Reader {
        constructor(header, bytes2) {
          this.header = header;
          this.bytes = bytes2;
          this.pos = 0;
          this.view = new DataView(bytes2.buffer, bytes2.byteOffset, bytes2.byteLength);
        }
        frameHeaderSize() {
          return this.header.majorVersion === 2 ? 6 : 10;
        }
        ununsynchronizeAll() {
          const newBytes = [];
          for (let i = 0; i < this.bytes.length; i++) {
            const value1 = this.bytes[i];
            newBytes.push(value1);
            if (value1 === 255 && i !== this.bytes.length - 1) {
              const value2 = this.bytes[i];
              if (value2 === 0) {
                i++;
              }
            }
          }
          this.bytes = new Uint8Array(newBytes);
          this.view = new DataView(this.bytes.buffer);
        }
        ununsynchronizeRegion(start, end) {
          const newBytes = [];
          for (let i = start; i < end; i++) {
            const value1 = this.bytes[i];
            newBytes.push(value1);
            if (value1 === 255 && i !== end - 1) {
              const value2 = this.bytes[i + 1];
              if (value2 === 0) {
                i++;
              }
            }
          }
          const before = this.bytes.subarray(0, start);
          const after = this.bytes.subarray(end);
          this.bytes = new Uint8Array(before.length + newBytes.length + after.length);
          this.bytes.set(before, 0);
          this.bytes.set(newBytes, before.length);
          this.bytes.set(after, before.length + newBytes.length);
          this.view = new DataView(this.bytes.buffer);
        }
        removeFooter() {
          this.bytes = this.bytes.subarray(0, this.bytes.length - ID3_V2_HEADER_SIZE);
          this.view = new DataView(this.bytes.buffer);
        }
        readBytes(length) {
          const slice = this.bytes.subarray(this.pos, this.pos + length);
          this.pos += length;
          return slice;
        }
        readU8() {
          const value = this.view.getUint8(this.pos);
          this.pos += 1;
          return value;
        }
        readU16() {
          const value = this.view.getUint16(this.pos, false);
          this.pos += 2;
          return value;
        }
        readU24() {
          const high = this.view.getUint16(this.pos, false);
          const low = this.view.getUint8(this.pos + 1);
          this.pos += 3;
          return high * 256 + low;
        }
        readU32() {
          const value = this.view.getUint32(this.pos, false);
          this.pos += 4;
          return value;
        }
        readAscii(length) {
          let str = "";
          for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.view.getUint8(this.pos + i));
          }
          this.pos += length;
          return str;
        }
        readId3V2Frame() {
          if (this.header.majorVersion === 2) {
            const id = this.readAscii(3);
            if (id === "\0\0\0") {
              return null;
            }
            const size = this.readU24();
            return { id, size, flags: 0 };
          } else {
            const id = this.readAscii(4);
            if (id === "\0\0\0\0") {
              return null;
            }
            const sizeRaw = this.readU32();
            let size = this.header.majorVersion === 4 ? decodeSynchsafe(sizeRaw) : sizeRaw;
            const flags2 = this.readU16();
            const headerEndPos = this.pos;
            const isSizeValid = (size2) => {
              const nextPos = this.pos + size2;
              if (nextPos > this.bytes.length) {
                return false;
              }
              if (nextPos <= this.bytes.length - this.frameHeaderSize()) {
                this.pos += size2;
                const nextId = this.readAscii(4);
                if (nextId !== "\0\0\0\0" && !/[0-9A-Z]{4}/.test(nextId)) {
                  return false;
                }
              }
              return true;
            };
            if (!isSizeValid(size)) {
              const otherSize = this.header.majorVersion === 4 ? sizeRaw : decodeSynchsafe(sizeRaw);
              if (isSizeValid(otherSize)) {
                size = otherSize;
              }
            }
            this.pos = headerEndPos;
            return { id, size, flags: flags2 };
          }
        }
        readId3V2TextEncoding() {
          const number = this.readU8();
          if (number > 3) {
            throw new Error(`Unsupported text encoding: ${number}`);
          }
          return number;
        }
        readId3V2Text(encoding, until) {
          const startPos = this.pos;
          const data = this.readBytes(until);
          switch (encoding) {
            case Id3V2TextEncoding.ISO_8859_1: {
              let str = "";
              for (let i = 0; i < data.length; i++) {
                const value = data[i];
                if (value === 0) {
                  this.pos = startPos + i + 1;
                  break;
                }
                str += String.fromCharCode(value);
              }
              return str;
            }
            case Id3V2TextEncoding.UTF_16_WITH_BOM: {
              if (data[0] === 255 && data[1] === 254) {
                const decoder = new TextDecoder("utf-16le");
                const endIndex = coalesceIndex(data.findIndex((x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
                this.pos = startPos + Math.min(endIndex + 2, data.length);
                return decoder.decode(data.subarray(2, endIndex));
              } else if (data[0] === 254 && data[1] === 255) {
                const decoder = new TextDecoder("utf-16be");
                const endIndex = coalesceIndex(data.findIndex((x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
                this.pos = startPos + Math.min(endIndex + 2, data.length);
                return decoder.decode(data.subarray(2, endIndex));
              } else {
                const endIndex = coalesceIndex(data.findIndex((x) => x === 0), data.length);
                this.pos = startPos + Math.min(endIndex + 1, data.length);
                return textDecoder.decode(data.subarray(0, endIndex));
              }
            }
            case Id3V2TextEncoding.UTF_16_BE_NO_BOM: {
              const decoder = new TextDecoder("utf-16be");
              const endIndex = coalesceIndex(data.findIndex((x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
              this.pos = startPos + Math.min(endIndex + 2, data.length);
              return decoder.decode(data.subarray(0, endIndex));
            }
            case Id3V2TextEncoding.UTF_8: {
              const endIndex = coalesceIndex(data.findIndex((x) => x === 0), data.length);
              this.pos = startPos + Math.min(endIndex + 1, data.length);
              return textDecoder.decode(data.subarray(0, endIndex));
            }
          }
        }
        readId3V2EncodingAndText(until) {
          if (this.pos >= until) {
            return "";
          }
          const encoding = this.readId3V2TextEncoding();
          return this.readId3V2Text(encoding, until);
        }
      }
class Mp3Writer {
        constructor(writer) {
          this.writer = writer;
          this.helper = new Uint8Array(8);
          this.helperView = new DataView(this.helper.buffer);
        }
        writeU8(value) {
          this.helper[0] = value;
          this.writer.write(this.helper.subarray(0, 1));
        }
        writeU16(value) {
          this.helperView.setUint16(0, value, false);
          this.writer.write(this.helper.subarray(0, 2));
        }
        writeU32(value) {
          this.helperView.setUint32(0, value, false);
          this.writer.write(this.helper.subarray(0, 4));
        }
        writeAscii(text) {
          for (let i = 0; i < text.length; i++) {
            this.helper[i] = text.charCodeAt(i);
          }
          this.writer.write(this.helper.subarray(0, text.length));
        }
        writeXingFrame(data) {
          const startPos = this.writer.getPos();
          const firstByte = 255;
          const secondByte = 224 | data.mpegVersionId << 3 | data.layer << 1;
          let lowSamplingFrequency;
          if (data.mpegVersionId & 2) {
            lowSamplingFrequency = data.mpegVersionId & 1 ? 0 : 1;
          } else {
            lowSamplingFrequency = 1;
          }
          const padding = 0;
          const neededBytes = 155;
          let bitrateIndex = -1;
          const bitrateOffset = lowSamplingFrequency * 16 * 4 + data.layer * 16;
          for (let i = 0; i < 16; i++) {
            const kbr = KILOBIT_RATES$1[bitrateOffset + i];
            const size = computeMp3FrameSize$1(lowSamplingFrequency, data.layer, 1e3 * kbr, data.sampleRate, padding);
            if (size >= neededBytes) {
              bitrateIndex = i;
              break;
            }
          }
          if (bitrateIndex === -1) {
            throw new Error("No suitable bitrate found.");
          }
          const thirdByte = bitrateIndex << 4 | data.frequencyIndex << 2 | padding << 1;
          const fourthByte = data.channel << 6 | data.modeExtension << 4 | data.copyright << 3 | data.original << 2 | data.emphasis;
          this.helper[0] = firstByte;
          this.helper[1] = secondByte;
          this.helper[2] = thirdByte;
          this.helper[3] = fourthByte;
          this.writer.write(this.helper.subarray(0, 4));
          const xingOffset = getXingOffset(data.mpegVersionId, data.channel);
          this.writer.seek(startPos + xingOffset);
          this.writeU32(XING);
          let flags2 = 0;
          if (data.frameCount !== null) {
            flags2 |= 1;
          }
          if (data.fileSize !== null) {
            flags2 |= 2;
          }
          if (data.toc !== null) {
            flags2 |= 4;
          }
          this.writeU32(flags2);
          this.writeU32(data.frameCount ?? 0);
          this.writeU32(data.fileSize ?? 0);
          this.writer.write(data.toc ?? new Uint8Array(100));
          const kilobitRate = KILOBIT_RATES$1[bitrateOffset + bitrateIndex];
          const frameSize = computeMp3FrameSize$1(lowSamplingFrequency, data.layer, 1e3 * kilobitRate, data.sampleRate, padding);
          this.writer.seek(startPos + frameSize);
        }
        writeSynchsafeU32(value) {
          this.writeU32(encodeSynchsafe(value));
        }
        writeIsoString(text) {
          const bytes2 = new Uint8Array(text.length + 1);
          for (let i = 0; i < text.length; i++) {
            bytes2[i] = text.charCodeAt(i);
          }
          bytes2[text.length] = 0;
          this.writer.write(bytes2);
        }
        writeUtf8String(text) {
          const utf8Data = textEncoder.encode(text);
          this.writer.write(utf8Data);
          this.writeU8(0);
        }
        writeId3V2TextFrame(frameId, text) {
          const useIso88591 = isIso88591Compatible(text);
          const textDataLength = useIso88591 ? text.length : textEncoder.encode(text).byteLength;
          const frameSize = 1 + textDataLength + 1;
          this.writeAscii(frameId);
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
          if (useIso88591) {
            this.writeIsoString(text);
          } else {
            this.writeUtf8String(text);
          }
        }
        writeId3V2LyricsFrame(lyrics) {
          const useIso88591 = isIso88591Compatible(lyrics);
          const shortDescription = "";
          const frameSize = 1 + 3 + shortDescription.length + 1 + lyrics.length + 1;
          this.writeAscii("USLT");
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
          this.writeAscii("und");
          if (useIso88591) {
            this.writeIsoString(shortDescription);
            this.writeIsoString(lyrics);
          } else {
            this.writeUtf8String(shortDescription);
            this.writeUtf8String(lyrics);
          }
        }
        writeId3V2CommentFrame(comment) {
          const useIso88591 = isIso88591Compatible(comment);
          const textDataLength = useIso88591 ? comment.length : textEncoder.encode(comment).byteLength;
          const shortDescription = "";
          const frameSize = 1 + 3 + shortDescription.length + 1 + textDataLength + 1;
          this.writeAscii("COMM");
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
          this.writeU8(117);
          this.writeU8(110);
          this.writeU8(100);
          if (useIso88591) {
            this.writeIsoString(shortDescription);
            this.writeIsoString(comment);
          } else {
            this.writeUtf8String(shortDescription);
            this.writeUtf8String(comment);
          }
        }
        writeId3V2ApicFrame(mimeType, pictureType, description, imageData) {
          const useIso88591 = isIso88591Compatible(mimeType) && isIso88591Compatible(description);
          const descriptionDataLength = useIso88591 ? description.length : textEncoder.encode(description).byteLength;
          const frameSize = 1 + mimeType.length + 1 + 1 + descriptionDataLength + 1 + imageData.byteLength;
          this.writeAscii("APIC");
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(useIso88591 ? Id3V2TextEncoding.ISO_8859_1 : Id3V2TextEncoding.UTF_8);
          if (useIso88591) {
            this.writeIsoString(mimeType);
          } else {
            this.writeUtf8String(mimeType);
          }
          this.writeU8(pictureType);
          if (useIso88591) {
            this.writeIsoString(description);
          } else {
            this.writeUtf8String(description);
          }
          this.writer.write(imageData);
        }
      }
class Mp3Muxer extends Muxer {
        constructor(output, format) {
          super(output);
          this.xingFrameData = null;
          this.frameCount = 0;
          this.framePositions = [];
          this.xingFramePos = null;
          this.format = format;
          this.writer = output._writer;
          this.mp3Writer = new Mp3Writer(output._writer);
        }
        async start() {
          if (!metadataTagsAreEmpty(this.output._metadataTags)) {
            this.writeId3v2Tag(this.output._metadataTags);
          }
        }
        async getMimeType() {
          return "audio/mpeg";
        }
        async addEncodedVideoPacket() {
          throw new Error("MP3 does not support video.");
        }
        async addEncodedAudioPacket(track, packet) {
          const release = await this.mutex.acquire();
          try {
            const writeXingHeader = this.format._options.xingHeader !== false;
            if (!this.xingFrameData && writeXingHeader) {
              const view2 = toDataView(packet.data);
              if (view2.byteLength < 4) {
                throw new Error("Invalid MP3 header in sample.");
              }
              const word = view2.getUint32(0, false);
              const header = readFrameHeader$1(word, null).header;
              if (!header) {
                throw new Error("Invalid MP3 header in sample.");
              }
              const xingOffset = getXingOffset(header.mpegVersionId, header.channel);
              if (view2.byteLength >= xingOffset + 4) {
                const word2 = view2.getUint32(xingOffset, false);
                const isXing = word2 === XING || word2 === INFO;
                if (isXing) {
                  return;
                }
              }
              this.xingFrameData = {
                mpegVersionId: header.mpegVersionId,
                layer: header.layer,
                frequencyIndex: header.frequencyIndex,
                sampleRate: header.sampleRate,
                channel: header.channel,
                modeExtension: header.modeExtension,
                copyright: header.copyright,
                original: header.original,
                emphasis: header.emphasis,
                frameCount: null,
                fileSize: null,
                toc: null
              };
              this.xingFramePos = this.writer.getPos();
              this.mp3Writer.writeXingFrame(this.xingFrameData);
              this.frameCount++;
            }
            this.validateAndNormalizeTimestamp(track, packet.timestamp, packet.type === "key");
            this.writer.write(packet.data);
            this.frameCount++;
            await this.writer.flush();
            if (writeXingHeader) {
              this.framePositions.push(this.writer.getPos());
            }
          } finally {
            release();
          }
        }
        async addSubtitleCue() {
          throw new Error("MP3 does not support subtitles.");
        }
        writeId3v2Tag(tags) {
          this.mp3Writer.writeAscii("ID3");
          this.mp3Writer.writeU8(4);
          this.mp3Writer.writeU8(0);
          this.mp3Writer.writeU8(0);
          this.mp3Writer.writeSynchsafeU32(0);
          const startPos = this.writer.getPos();
          const writtenTags = new Set();
          for (const { key, value } of keyValueIterator(tags)) {
            switch (key) {
              case "title":
                {
                  this.mp3Writer.writeId3V2TextFrame("TIT2", value);
                  writtenTags.add("TIT2");
                }
                break;
              case "description":
                {
                  this.mp3Writer.writeId3V2TextFrame("TIT3", value);
                  writtenTags.add("TIT3");
                }
                break;
              case "artist":
                {
                  this.mp3Writer.writeId3V2TextFrame("TPE1", value);
                  writtenTags.add("TPE1");
                }
                break;
              case "album":
                {
                  this.mp3Writer.writeId3V2TextFrame("TALB", value);
                  writtenTags.add("TALB");
                }
                break;
              case "albumArtist":
                {
                  this.mp3Writer.writeId3V2TextFrame("TPE2", value);
                  writtenTags.add("TPE2");
                }
                break;
              case "trackNumber":
                {
                  const string = tags.tracksTotal !== void 0 ? `${value}/${tags.tracksTotal}` : value.toString();
                  this.mp3Writer.writeId3V2TextFrame("TRCK", string);
                  writtenTags.add("TRCK");
                }
                break;
              case "discNumber":
                {
                  const string = tags.discsTotal !== void 0 ? `${value}/${tags.discsTotal}` : value.toString();
                  this.mp3Writer.writeId3V2TextFrame("TPOS", string);
                  writtenTags.add("TPOS");
                }
                break;
              case "genre":
                {
                  this.mp3Writer.writeId3V2TextFrame("TCON", value);
                  writtenTags.add("TCON");
                }
                break;
              case "date":
                {
                  this.mp3Writer.writeId3V2TextFrame("TDRC", value.toISOString().slice(0, 10));
                  writtenTags.add("TDRC");
                }
                break;
              case "lyrics":
                {
                  this.mp3Writer.writeId3V2LyricsFrame(value);
                  writtenTags.add("USLT");
                }
                break;
              case "comment":
                {
                  this.mp3Writer.writeId3V2CommentFrame(value);
                  writtenTags.add("COMM");
                }
                break;
              case "images":
                {
                  const pictureTypeMap = { coverFront: 3, coverBack: 4, unknown: 0 };
                  for (const image of value) {
                    const pictureType = pictureTypeMap[image.kind];
                    const description = image.description ?? "";
                    this.mp3Writer.writeId3V2ApicFrame(image.mimeType, pictureType, description, image.data);
                  }
                }
                break;
              case "tracksTotal":
              case "discsTotal":
                break;
              case "raw":
                break;
              default:
                assertNever(key);
            }
          }
          if (tags.raw) {
            for (const key in tags.raw) {
              const value = tags.raw[key];
              if (value == null || key.length !== 4 || writtenTags.has(key)) {
                continue;
              }
              let bytes2;
              if (typeof value === "string") {
                const encoded = textEncoder.encode(value);
                bytes2 = new Uint8Array(encoded.byteLength + 2);
                bytes2[0] = Id3V2TextEncoding.UTF_8;
                bytes2.set(encoded, 1);
              } else if (value instanceof Uint8Array) {
                bytes2 = value;
              } else {
                continue;
              }
              this.mp3Writer.writeAscii(key);
              this.mp3Writer.writeSynchsafeU32(bytes2.byteLength);
              this.mp3Writer.writeU16(0);
              this.writer.write(bytes2);
            }
          }
          const endPos = this.writer.getPos();
          const framesSize = endPos - startPos;
          this.writer.seek(6);
          this.mp3Writer.writeSynchsafeU32(framesSize);
          this.writer.seek(endPos);
        }
        async finalize() {
          if (!this.xingFrameData || this.xingFramePos === null) {
            return;
          }
          const release = await this.mutex.acquire();
          const endPos = this.writer.getPos();
          this.writer.seek(this.xingFramePos);
          const toc = new Uint8Array(100);
          for (let i = 0; i < 100; i++) {
            const index2 = Math.floor(this.framePositions.length * (i / 100));
            assert$1(index2 !== -1 && index2 < this.framePositions.length);
            const byteOffset = this.framePositions[index2];
            toc[i] = 256 * (byteOffset / endPos);
          }
          this.xingFrameData.frameCount = this.frameCount;
          this.xingFrameData.fileSize = endPos;
          this.xingFrameData.toc = toc;
          if (this.format._options.onXingFrame) {
            this.writer.startTrackingWrites();
          }
          this.mp3Writer.writeXingFrame(this.xingFrameData);
          if (this.format._options.onXingFrame) {
            const { data, start } = this.writer.stopTrackingWrites();
            this.format._options.onXingFrame(data, start);
          }
          this.writer.seek(endPos);
          release();
        }
      }
class Demuxer {
        constructor(input) {
          this.input = input;
        }
      }
class CustomVideoEncoder {

static supports(codec, config) {
          return false;
        }
      }
      class CustomAudioEncoder {

static supports(codec, config) {
          return false;
        }
      }
      const customVideoDecoders = [];
      const customAudioDecoders = [];
      const customVideoEncoders = [];
      const customAudioEncoders = [];
      const registerEncoder = (encoder) => {
        if (encoder.prototype instanceof CustomVideoEncoder) {
          const casted = encoder;
          if (customVideoEncoders.includes(casted)) {
            console.warn("Video encoder already registered.");
            return;
          }
          customVideoEncoders.push(casted);
        } else if (encoder.prototype instanceof CustomAudioEncoder) {
          const casted = encoder;
          if (customAudioEncoders.includes(casted)) {
            console.warn("Audio encoder already registered.");
            return;
          }
          customAudioEncoders.push(casted);
        } else {
          throw new TypeError("Encoder must be a CustomVideoEncoder or CustomAudioEncoder.");
        }
      };
const PLACEHOLDER_DATA = new Uint8Array(0);
      class EncodedPacket {
constructor(data, type, timestamp, duration, sequenceNumber = -1, byteLength) {
          this.data = data;
          this.type = type;
          this.timestamp = timestamp;
          this.duration = duration;
          this.sequenceNumber = sequenceNumber;
          if (data === PLACEHOLDER_DATA && byteLength === void 0) {
            throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
          }
          if (byteLength === void 0) {
            byteLength = data.byteLength;
          }
          if (!(data instanceof Uint8Array)) {
            throw new TypeError("data must be a Uint8Array.");
          }
          if (type !== "key" && type !== "delta") {
            throw new TypeError('type must be either "key" or "delta".');
          }
          if (!Number.isFinite(timestamp)) {
            throw new TypeError("timestamp must be a number.");
          }
          if (!Number.isFinite(duration) || duration < 0) {
            throw new TypeError("duration must be a non-negative number.");
          }
          if (!Number.isFinite(sequenceNumber)) {
            throw new TypeError("sequenceNumber must be a number.");
          }
          if (!Number.isInteger(byteLength) || byteLength < 0) {
            throw new TypeError("byteLength must be a non-negative integer.");
          }
          this.byteLength = byteLength;
        }
get isMetadataOnly() {
          return this.data === PLACEHOLDER_DATA;
        }
get microsecondTimestamp() {
          return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.timestamp);
        }
get microsecondDuration() {
          return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.duration);
        }
toEncodedVideoChunk() {
          if (this.isMetadataOnly) {
            throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
          }
          if (typeof EncodedVideoChunk === "undefined") {
            throw new Error("Your browser does not support EncodedVideoChunk.");
          }
          return new EncodedVideoChunk({
            data: this.data,
            type: this.type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration
          });
        }
toEncodedAudioChunk() {
          if (this.isMetadataOnly) {
            throw new TypeError("Metadata-only packets cannot be converted to an audio chunk.");
          }
          if (typeof EncodedAudioChunk === "undefined") {
            throw new Error("Your browser does not support EncodedAudioChunk.");
          }
          return new EncodedAudioChunk({
            data: this.data,
            type: this.type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration
          });
        }
static fromEncodedChunk(chunk) {
          if (!(chunk instanceof EncodedVideoChunk || chunk instanceof EncodedAudioChunk)) {
            throw new TypeError("chunk must be an EncodedVideoChunk or EncodedAudioChunk.");
          }
          const data = new Uint8Array(chunk.byteLength);
          chunk.copyTo(data);
          return new EncodedPacket(data, chunk.type, chunk.timestamp / 1e6, (chunk.duration ?? 0) / 1e6);
        }
clone(options) {
          if (options !== void 0 && (typeof options !== "object" || options === null)) {
            throw new TypeError("options, when provided, must be an object.");
          }
          if (options?.timestamp !== void 0 && !Number.isFinite(options.timestamp)) {
            throw new TypeError("options.timestamp, when provided, must be a number.");
          }
          if (options?.duration !== void 0 && !Number.isFinite(options.duration)) {
            throw new TypeError("options.duration, when provided, must be a number.");
          }
          return new EncodedPacket(this.data, this.type, options?.timestamp ?? this.timestamp, options?.duration ?? this.duration, this.sequenceNumber, this.byteLength);
        }
      }
const toUlaw = (s16) => {
        const MULAW_MAX = 8191;
        const MULAW_BIAS = 33;
        let number = s16;
        let mask = 4096;
        let sign = 0;
        let position = 12;
        let lsb = 0;
        if (number < 0) {
          number = -number;
          sign = 128;
        }
        number += MULAW_BIAS;
        if (number > MULAW_MAX) {
          number = MULAW_MAX;
        }
        while ((number & mask) !== mask && position >= 5) {
          mask >>= 1;
          position--;
        }
        lsb = number >> position - 4 & 15;
        return ~(sign | position - 5 << 4 | lsb) & 255;
      };
      const fromUlaw = (u82) => {
        const MULAW_BIAS = 33;
        let sign = 0;
        let position = 0;
        let number = ~u82;
        if (number & 128) {
          number &= -129;
          sign = -1;
        }
        position = ((number & 240) >> 4) + 5;
        const decoded = (1 << position | (number & 15) << position - 4 | 1 << position - 5) - MULAW_BIAS;
        return sign === 0 ? decoded : -decoded;
      };
      const toAlaw = (s16) => {
        const ALAW_MAX = 4095;
        let mask = 2048;
        let sign = 0;
        let position = 11;
        let lsb = 0;
        let number = s16;
        if (number < 0) {
          number = -number;
          sign = 128;
        }
        if (number > ALAW_MAX) {
          number = ALAW_MAX;
        }
        while ((number & mask) !== mask && position >= 5) {
          mask >>= 1;
          position--;
        }
        lsb = number >> (position === 4 ? 1 : position - 4) & 15;
        return (sign | position - 4 << 4 | lsb) ^ 85;
      };
      const fromAlaw = (u82) => {
        let sign = 0;
        let position = 0;
        let number = u82 ^ 85;
        if (number & 128) {
          number &= -129;
          sign = -1;
        }
        position = ((number & 240) >> 4) + 4;
        let decoded = 0;
        if (position !== 4) {
          decoded = 1 << position | (number & 15) << position - 4 | 1 << position - 5;
        } else {
          decoded = number << 1 | 1;
        }
        return sign === 0 ? decoded : -decoded;
      };
class VideoSample {
get displayWidth() {
          return this.rotation % 180 === 0 ? this.codedWidth : this.codedHeight;
        }
get displayHeight() {
          return this.rotation % 180 === 0 ? this.codedHeight : this.codedWidth;
        }
get microsecondTimestamp() {
          return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.timestamp);
        }
get microsecondDuration() {
          return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.duration);
        }
        constructor(data, init) {
          this._closed = false;
          if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
            if (!init || typeof init !== "object") {
              throw new TypeError("init must be an object.");
            }
            if (!("format" in init) || typeof init.format !== "string") {
              throw new TypeError("init.format must be a string.");
            }
            if (!Number.isInteger(init.codedWidth) || init.codedWidth <= 0) {
              throw new TypeError("init.codedWidth must be a positive integer.");
            }
            if (!Number.isInteger(init.codedHeight) || init.codedHeight <= 0) {
              throw new TypeError("init.codedHeight must be a positive integer.");
            }
            if (init.rotation !== void 0 && ![0, 90, 180, 270].includes(init.rotation)) {
              throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
            }
            if (!Number.isFinite(init.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            if (init.duration !== void 0 && (!Number.isFinite(init.duration) || init.duration < 0)) {
              throw new TypeError("init.duration, when provided, must be a non-negative number.");
            }
            this._data = toUint8Array(data).slice();
            this.format = init.format;
            this.codedWidth = init.codedWidth;
            this.codedHeight = init.codedHeight;
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            this.colorSpace = new VideoColorSpace(init.colorSpace);
          } else if (typeof VideoFrame !== "undefined" && data instanceof VideoFrame) {
            if (init?.rotation !== void 0 && ![0, 90, 180, 270].includes(init.rotation)) {
              throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
            }
            if (init?.timestamp !== void 0 && !Number.isFinite(init?.timestamp)) {
              throw new TypeError("init.timestamp, when provided, must be a number.");
            }
            if (init?.duration !== void 0 && (!Number.isFinite(init.duration) || init.duration < 0)) {
              throw new TypeError("init.duration, when provided, must be a non-negative number.");
            }
            this._data = data;
            this.format = data.format;
            this.codedWidth = data.displayWidth;
            this.codedHeight = data.displayHeight;
            this.rotation = init?.rotation ?? 0;
            this.timestamp = init?.timestamp ?? data.timestamp / 1e6;
            this.duration = init?.duration ?? (data.duration ?? 0) / 1e6;
            this.colorSpace = data.colorSpace;
          } else if (typeof HTMLImageElement !== "undefined" && data instanceof HTMLImageElement || typeof SVGImageElement !== "undefined" && data instanceof SVGImageElement || typeof ImageBitmap !== "undefined" && data instanceof ImageBitmap || typeof HTMLVideoElement !== "undefined" && data instanceof HTMLVideoElement || typeof HTMLCanvasElement !== "undefined" && data instanceof HTMLCanvasElement || typeof OffscreenCanvas !== "undefined" && data instanceof OffscreenCanvas) {
            if (!init || typeof init !== "object") {
              throw new TypeError("init must be an object.");
            }
            if (init.rotation !== void 0 && ![0, 90, 180, 270].includes(init.rotation)) {
              throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
            }
            if (!Number.isFinite(init.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            if (init.duration !== void 0 && (!Number.isFinite(init.duration) || init.duration < 0)) {
              throw new TypeError("init.duration, when provided, must be a non-negative number.");
            }
            if (typeof VideoFrame !== "undefined") {
              return new VideoSample(new VideoFrame(data, {
                timestamp: Math.trunc(init.timestamp * SECOND_TO_MICROSECOND_FACTOR),
duration: Math.trunc((init.duration ?? 0) * SECOND_TO_MICROSECOND_FACTOR) || void 0
              }), init);
            }
            let width = 0;
            let height = 0;
            if ("naturalWidth" in data) {
              width = data.naturalWidth;
              height = data.naturalHeight;
            } else if ("videoWidth" in data) {
              width = data.videoWidth;
              height = data.videoHeight;
            } else if ("width" in data) {
              width = Number(data.width);
              height = Number(data.height);
            }
            if (!width || !height) {
              throw new TypeError("Could not determine dimensions.");
            }
            const canvas = new OffscreenCanvas(width, height);
            const context = canvas.getContext("2d", {
              alpha: isFirefox(),
willReadFrequently: true
            });
            assert$1(context);
            context.drawImage(data, 0, 0);
            this._data = canvas;
            this.format = "RGBX";
            this.codedWidth = width;
            this.codedHeight = height;
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            this.colorSpace = new VideoColorSpace({
              matrix: "rgb",
              primaries: "bt709",
              transfer: "iec61966-2-1",
              fullRange: true
            });
          } else {
            throw new TypeError("Invalid data type: Must be a BufferSource or CanvasImageSource.");
          }
        }
clone() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          assert$1(this._data !== null);
          if (isVideoFrame(this._data)) {
            return new VideoSample(this._data.clone(), {
              timestamp: this.timestamp,
              duration: this.duration,
              rotation: this.rotation
            });
          } else if (this._data instanceof Uint8Array) {
            return new VideoSample(this._data.slice(), {
              format: this.format,
              codedWidth: this.codedWidth,
              codedHeight: this.codedHeight,
              timestamp: this.timestamp,
              duration: this.duration,
              colorSpace: this.colorSpace,
              rotation: this.rotation
            });
          } else {
            return new VideoSample(this._data, {
              format: this.format,
              codedWidth: this.codedWidth,
              codedHeight: this.codedHeight,
              timestamp: this.timestamp,
              duration: this.duration,
              colorSpace: this.colorSpace,
              rotation: this.rotation
            });
          }
        }
close() {
          if (this._closed) {
            return;
          }
          if (isVideoFrame(this._data)) {
            this._data.close();
          } else {
            this._data = null;
          }
          this._closed = true;
        }
allocationSize() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          assert$1(this._data !== null);
          if (isVideoFrame(this._data)) {
            return this._data.allocationSize();
          } else if (this._data instanceof Uint8Array) {
            return this._data.byteLength;
          } else {
            return this.codedWidth * this.codedHeight * 4;
          }
        }
async copyTo(destination) {
          if (!isAllowSharedBufferSource(destination)) {
            throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
          }
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          assert$1(this._data !== null);
          if (isVideoFrame(this._data)) {
            await this._data.copyTo(destination);
          } else if (this._data instanceof Uint8Array) {
            const dest = toUint8Array(destination);
            dest.set(this._data);
          } else {
            const canvas = this._data;
            const context = canvas.getContext("2d");
            assert$1(context);
            const imageData = context.getImageData(0, 0, this.codedWidth, this.codedHeight);
            const dest = toUint8Array(destination);
            dest.set(imageData.data);
          }
        }
toVideoFrame() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          assert$1(this._data !== null);
          if (isVideoFrame(this._data)) {
            return new VideoFrame(this._data, {
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration || void 0
});
          } else if (this._data instanceof Uint8Array) {
            return new VideoFrame(this._data, {
              format: this.format,
              codedWidth: this.codedWidth,
              codedHeight: this.codedHeight,
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration || void 0,
              colorSpace: this.colorSpace
            });
          } else {
            return new VideoFrame(this._data, {
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration || void 0
            });
          }
        }
        draw(context, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          let sx = 0;
          let sy = 0;
          let sWidth = this.displayWidth;
          let sHeight = this.displayHeight;
          let dx = 0;
          let dy = 0;
          let dWidth = this.displayWidth;
          let dHeight = this.displayHeight;
          if (arg5 !== void 0) {
            sx = arg1;
            sy = arg2;
            sWidth = arg3;
            sHeight = arg4;
            dx = arg5;
            dy = arg6;
            if (arg7 !== void 0) {
              dWidth = arg7;
              dHeight = arg8;
            } else {
              dWidth = sWidth;
              dHeight = sHeight;
            }
          } else {
            dx = arg1;
            dy = arg2;
            if (arg3 !== void 0) {
              dWidth = arg3;
              dHeight = arg4;
            }
          }
          if (!(typeof CanvasRenderingContext2D !== "undefined" && context instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D !== "undefined" && context instanceof OffscreenCanvasRenderingContext2D)) {
            throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
          }
          if (!Number.isFinite(sx)) {
            throw new TypeError("sx must be a number.");
          }
          if (!Number.isFinite(sy)) {
            throw new TypeError("sy must be a number.");
          }
          if (!Number.isFinite(sWidth) || sWidth < 0) {
            throw new TypeError("sWidth must be a non-negative number.");
          }
          if (!Number.isFinite(sHeight) || sHeight < 0) {
            throw new TypeError("sHeight must be a non-negative number.");
          }
          if (!Number.isFinite(dx)) {
            throw new TypeError("dx must be a number.");
          }
          if (!Number.isFinite(dy)) {
            throw new TypeError("dy must be a number.");
          }
          if (!Number.isFinite(dWidth) || dWidth < 0) {
            throw new TypeError("dWidth must be a non-negative number.");
          }
          if (!Number.isFinite(dHeight) || dHeight < 0) {
            throw new TypeError("dHeight must be a non-negative number.");
          }
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          ({ sx, sy, sWidth, sHeight } = this._rotateSourceRegion(sx, sy, sWidth, sHeight, this.rotation));
          const source2 = this.toCanvasImageSource();
          context.save();
          const centerX = dx + dWidth / 2;
          const centerY = dy + dHeight / 2;
          context.translate(centerX, centerY);
          context.rotate(this.rotation * Math.PI / 180);
          const aspectRatioChange = this.rotation % 180 === 0 ? 1 : dWidth / dHeight;
          context.scale(1 / aspectRatioChange, aspectRatioChange);
          context.drawImage(source2, sx, sy, sWidth, sHeight, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
          context.restore();
        }
drawWithFit(context, options) {
          if (!(typeof CanvasRenderingContext2D !== "undefined" && context instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D !== "undefined" && context instanceof OffscreenCanvasRenderingContext2D)) {
            throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!["fill", "contain", "cover"].includes(options.fit)) {
            throw new TypeError("options.fit must be 'fill', 'contain', or 'cover'.");
          }
          if (options.rotation !== void 0 && ![0, 90, 180, 270].includes(options.rotation)) {
            throw new TypeError("options.rotation, when provided, must be 0, 90, 180, or 270.");
          }
          if (options.crop !== void 0) {
            validateCropRectangle(options.crop, "options.");
          }
          const canvasWidth = context.canvas.width;
          const canvasHeight = context.canvas.height;
          const rotation = options.rotation ?? this.rotation;
          const [rotatedWidth, rotatedHeight] = rotation % 180 === 0 ? [this.codedWidth, this.codedHeight] : [this.codedHeight, this.codedWidth];
          if (options.crop) {
            clampCropRectangle(options.crop, rotatedWidth, rotatedHeight);
          }
          let dx;
          let dy;
          let newWidth;
          let newHeight;
          const { sx, sy, sWidth, sHeight } = this._rotateSourceRegion(options.crop?.left ?? 0, options.crop?.top ?? 0, options.crop?.width ?? this.codedWidth, options.crop?.height ?? this.codedHeight, rotation);
          if (options.fit === "fill") {
            dx = 0;
            dy = 0;
            newWidth = canvasWidth;
            newHeight = canvasHeight;
          } else {
            const [sampleWidth, sampleHeight] = options.crop ? [options.crop.width, options.crop.height] : [rotatedWidth, rotatedHeight];
            const scale = options.fit === "contain" ? Math.min(canvasWidth / sampleWidth, canvasHeight / sampleHeight) : Math.max(canvasWidth / sampleWidth, canvasHeight / sampleHeight);
            newWidth = sampleWidth * scale;
            newHeight = sampleHeight * scale;
            dx = (canvasWidth - newWidth) / 2;
            dy = (canvasHeight - newHeight) / 2;
          }
          const aspectRatioChange = rotation % 180 === 0 ? 1 : newWidth / newHeight;
          context.translate(canvasWidth / 2, canvasHeight / 2);
          context.rotate(rotation * Math.PI / 180);
          context.scale(1 / aspectRatioChange, aspectRatioChange);
          context.translate(-canvasWidth / 2, -canvasHeight / 2);
          context.drawImage(this.toCanvasImageSource(), sx, sy, sWidth, sHeight, dx, dy, newWidth, newHeight);
        }
_rotateSourceRegion(sx, sy, sWidth, sHeight, rotation) {
          if (rotation === 90) {
            [sx, sy, sWidth, sHeight] = [
              sy,
              this.codedHeight - sx - sWidth,
              sHeight,
              sWidth
            ];
          } else if (rotation === 180) {
            [sx, sy] = [
              this.codedWidth - sx - sWidth,
              this.codedHeight - sy - sHeight
            ];
          } else if (rotation === 270) {
            [sx, sy, sWidth, sHeight] = [
              this.codedWidth - sy - sHeight,
              sx,
              sHeight,
              sWidth
            ];
          }
          return { sx, sy, sWidth, sHeight };
        }
toCanvasImageSource() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          assert$1(this._data !== null);
          if (this._data instanceof Uint8Array) {
            const videoFrame = this.toVideoFrame();
            queueMicrotask(() => videoFrame.close());
            return videoFrame;
          } else {
            return this._data;
          }
        }
setRotation(newRotation) {
          if (![0, 90, 180, 270].includes(newRotation)) {
            throw new TypeError("newRotation must be 0, 90, 180, or 270.");
          }
          this.rotation = newRotation;
        }
setTimestamp(newTimestamp) {
          if (!Number.isFinite(newTimestamp)) {
            throw new TypeError("newTimestamp must be a number.");
          }
          this.timestamp = newTimestamp;
        }
setDuration(newDuration) {
          if (!Number.isFinite(newDuration) || newDuration < 0) {
            throw new TypeError("newDuration must be a non-negative number.");
          }
          this.duration = newDuration;
        }
      }
      const isVideoFrame = (x) => {
        return typeof VideoFrame !== "undefined" && x instanceof VideoFrame;
      };
      const clampCropRectangle = (crop, outerWidth, outerHeight) => {
        crop.left = Math.min(crop.left, outerWidth);
        crop.top = Math.min(crop.top, outerHeight);
        crop.width = Math.min(crop.width, outerWidth - crop.left);
        crop.height = Math.min(crop.height, outerHeight - crop.top);
        assert$1(crop.width >= 0);
        assert$1(crop.height >= 0);
      };
      const validateCropRectangle = (crop, prefix) => {
        if (!crop || typeof crop !== "object") {
          throw new TypeError(prefix + "crop, when provided, must be an object.");
        }
        if (!Number.isInteger(crop.left) || crop.left < 0) {
          throw new TypeError(prefix + "crop.left must be a non-negative integer.");
        }
        if (!Number.isInteger(crop.top) || crop.top < 0) {
          throw new TypeError(prefix + "crop.top must be a non-negative integer.");
        }
        if (!Number.isInteger(crop.width) || crop.width < 0) {
          throw new TypeError(prefix + "crop.width must be a non-negative integer.");
        }
        if (!Number.isInteger(crop.height) || crop.height < 0) {
          throw new TypeError(prefix + "crop.height must be a non-negative integer.");
        }
      };
      const AUDIO_SAMPLE_FORMATS = new Set(["f32", "f32-planar", "s16", "s16-planar", "s32", "s32-planar", "u8", "u8-planar"]);
      class AudioSample {
get microsecondTimestamp() {
          return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.timestamp);
        }
get microsecondDuration() {
          return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.duration);
        }
constructor(init) {
          this._closed = false;
          if (isAudioData(init)) {
            if (init.format === null) {
              throw new TypeError("AudioData with null format is not supported.");
            }
            this._data = init;
            this.format = init.format;
            this.sampleRate = init.sampleRate;
            this.numberOfFrames = init.numberOfFrames;
            this.numberOfChannels = init.numberOfChannels;
            this.timestamp = init.timestamp / 1e6;
            this.duration = init.numberOfFrames / init.sampleRate;
          } else {
            if (!init || typeof init !== "object") {
              throw new TypeError("Invalid AudioDataInit: must be an object.");
            }
            if (!AUDIO_SAMPLE_FORMATS.has(init.format)) {
              throw new TypeError("Invalid AudioDataInit: invalid format.");
            }
            if (!Number.isFinite(init.sampleRate) || init.sampleRate <= 0) {
              throw new TypeError("Invalid AudioDataInit: sampleRate must be > 0.");
            }
            if (!Number.isInteger(init.numberOfChannels) || init.numberOfChannels === 0) {
              throw new TypeError("Invalid AudioDataInit: numberOfChannels must be an integer > 0.");
            }
            if (!Number.isFinite(init?.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            const numberOfFrames = init.data.byteLength / (getBytesPerSample(init.format) * init.numberOfChannels);
            if (!Number.isInteger(numberOfFrames)) {
              throw new TypeError("Invalid AudioDataInit: data size is not a multiple of frame size.");
            }
            this.format = init.format;
            this.sampleRate = init.sampleRate;
            this.numberOfFrames = numberOfFrames;
            this.numberOfChannels = init.numberOfChannels;
            this.timestamp = init.timestamp;
            this.duration = numberOfFrames / init.sampleRate;
            let dataBuffer;
            if (init.data instanceof ArrayBuffer) {
              dataBuffer = new Uint8Array(init.data);
            } else if (ArrayBuffer.isView(init.data)) {
              dataBuffer = new Uint8Array(init.data.buffer, init.data.byteOffset, init.data.byteLength);
            } else {
              throw new TypeError("Invalid AudioDataInit: data is not a BufferSource.");
            }
            const expectedSize = this.numberOfFrames * this.numberOfChannels * getBytesPerSample(this.format);
            if (dataBuffer.byteLength < expectedSize) {
              throw new TypeError("Invalid AudioDataInit: insufficient data size.");
            }
            this._data = dataBuffer;
          }
        }
allocationSize(options) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) {
            throw new TypeError("planeIndex must be a non-negative integer.");
          }
          if (options.format !== void 0 && !AUDIO_SAMPLE_FORMATS.has(options.format)) {
            throw new TypeError("Invalid format.");
          }
          if (options.frameOffset !== void 0 && (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)) {
            throw new TypeError("frameOffset must be a non-negative integer.");
          }
          if (options.frameCount !== void 0 && (!Number.isInteger(options.frameCount) || options.frameCount < 0)) {
            throw new TypeError("frameCount must be a non-negative integer.");
          }
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const destFormat = options.format ?? this.format;
          const frameOffset = options.frameOffset ?? 0;
          if (frameOffset >= this.numberOfFrames) {
            throw new RangeError("frameOffset out of range");
          }
          const copyFrameCount = options.frameCount !== void 0 ? options.frameCount : this.numberOfFrames - frameOffset;
          if (copyFrameCount > this.numberOfFrames - frameOffset) {
            throw new RangeError("frameCount out of range");
          }
          const bytesPerSample = getBytesPerSample(destFormat);
          const isPlanar = formatIsPlanar(destFormat);
          if (isPlanar && options.planeIndex >= this.numberOfChannels) {
            throw new RangeError("planeIndex out of range");
          }
          if (!isPlanar && options.planeIndex !== 0) {
            throw new RangeError("planeIndex out of range");
          }
          const elementCount = isPlanar ? copyFrameCount : copyFrameCount * this.numberOfChannels;
          return elementCount * bytesPerSample;
        }
copyTo(destination, options) {
          if (!isAllowSharedBufferSource(destination)) {
            throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) {
            throw new TypeError("planeIndex must be a non-negative integer.");
          }
          if (options.format !== void 0 && !AUDIO_SAMPLE_FORMATS.has(options.format)) {
            throw new TypeError("Invalid format.");
          }
          if (options.frameOffset !== void 0 && (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)) {
            throw new TypeError("frameOffset must be a non-negative integer.");
          }
          if (options.frameCount !== void 0 && (!Number.isInteger(options.frameCount) || options.frameCount < 0)) {
            throw new TypeError("frameCount must be a non-negative integer.");
          }
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const { planeIndex, format, frameCount: optFrameCount, frameOffset: optFrameOffset } = options;
          const destFormat = format ?? this.format;
          if (!destFormat)
            throw new Error("Destination format not determined");
          const numFrames = this.numberOfFrames;
          const numChannels = this.numberOfChannels;
          const frameOffset = optFrameOffset ?? 0;
          if (frameOffset >= numFrames) {
            throw new RangeError("frameOffset out of range");
          }
          const copyFrameCount = optFrameCount !== void 0 ? optFrameCount : numFrames - frameOffset;
          if (copyFrameCount > numFrames - frameOffset) {
            throw new RangeError("frameCount out of range");
          }
          const destBytesPerSample = getBytesPerSample(destFormat);
          const destIsPlanar = formatIsPlanar(destFormat);
          if (destIsPlanar && planeIndex >= numChannels) {
            throw new RangeError("planeIndex out of range");
          }
          if (!destIsPlanar && planeIndex !== 0) {
            throw new RangeError("planeIndex out of range");
          }
          const destElementCount = destIsPlanar ? copyFrameCount : copyFrameCount * numChannels;
          const requiredSize = destElementCount * destBytesPerSample;
          if (destination.byteLength < requiredSize) {
            throw new RangeError("Destination buffer is too small");
          }
          const destView = toDataView(destination);
          const writeFn = getWriteFunction(destFormat);
          if (isAudioData(this._data)) {
            if (destIsPlanar) {
              if (destFormat === "f32-planar") {
                this._data.copyTo(destination, {
                  planeIndex,
                  frameOffset,
                  frameCount: copyFrameCount,
                  format: "f32-planar"
                });
              } else {
                const tempBuffer = new ArrayBuffer(copyFrameCount * 4);
                const tempArray = new Float32Array(tempBuffer);
                this._data.copyTo(tempArray, {
                  planeIndex,
                  frameOffset,
                  frameCount: copyFrameCount,
                  format: "f32-planar"
                });
                const tempView = new DataView(tempBuffer);
                for (let i = 0; i < copyFrameCount; i++) {
                  const destOffset = i * destBytesPerSample;
                  const sample = tempView.getFloat32(i * 4, true);
                  writeFn(destView, destOffset, sample);
                }
              }
            } else {
              const numCh = numChannels;
              const temp = new Float32Array(copyFrameCount);
              for (let ch = 0; ch < numCh; ch++) {
                this._data.copyTo(temp, {
                  planeIndex: ch,
                  frameOffset,
                  frameCount: copyFrameCount,
                  format: "f32-planar"
                });
                for (let i = 0; i < copyFrameCount; i++) {
                  const destIndex = i * numCh + ch;
                  const destOffset = destIndex * destBytesPerSample;
                  writeFn(destView, destOffset, temp[i]);
                }
              }
            }
          } else {
            const uint8Data = this._data;
            const srcView = new DataView(uint8Data.buffer, uint8Data.byteOffset, uint8Data.byteLength);
            const srcFormat = this.format;
            const readFn = getReadFunction(srcFormat);
            const srcBytesPerSample = getBytesPerSample(srcFormat);
            const srcIsPlanar = formatIsPlanar(srcFormat);
            for (let i = 0; i < copyFrameCount; i++) {
              if (destIsPlanar) {
                const destOffset = i * destBytesPerSample;
                let srcOffset;
                if (srcIsPlanar) {
                  srcOffset = (planeIndex * numFrames + (i + frameOffset)) * srcBytesPerSample;
                } else {
                  srcOffset = ((i + frameOffset) * numChannels + planeIndex) * srcBytesPerSample;
                }
                const normalized = readFn(srcView, srcOffset);
                writeFn(destView, destOffset, normalized);
              } else {
                for (let ch = 0; ch < numChannels; ch++) {
                  const destIndex = i * numChannels + ch;
                  const destOffset = destIndex * destBytesPerSample;
                  let srcOffset;
                  if (srcIsPlanar) {
                    srcOffset = (ch * numFrames + (i + frameOffset)) * srcBytesPerSample;
                  } else {
                    srcOffset = ((i + frameOffset) * numChannels + ch) * srcBytesPerSample;
                  }
                  const normalized = readFn(srcView, srcOffset);
                  writeFn(destView, destOffset, normalized);
                }
              }
            }
          }
        }
clone() {
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          if (isAudioData(this._data)) {
            const sample = new AudioSample(this._data.clone());
            sample.setTimestamp(this.timestamp);
            return sample;
          } else {
            return new AudioSample({
              format: this.format,
              sampleRate: this.sampleRate,
              numberOfFrames: this.numberOfFrames,
              numberOfChannels: this.numberOfChannels,
              timestamp: this.timestamp,
              data: this._data
            });
          }
        }
close() {
          if (this._closed) {
            return;
          }
          if (isAudioData(this._data)) {
            this._data.close();
          } else {
            this._data = new Uint8Array(0);
          }
          this._closed = true;
        }
toAudioData() {
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          if (isAudioData(this._data)) {
            if (this._data.timestamp === this.microsecondTimestamp) {
              return this._data.clone();
            } else {
              if (formatIsPlanar(this.format)) {
                const size = this.allocationSize({ planeIndex: 0, format: this.format });
                const data = new ArrayBuffer(size * this.numberOfChannels);
                for (let i = 0; i < this.numberOfChannels; i++) {
                  this.copyTo(new Uint8Array(data, i * size, size), { planeIndex: i, format: this.format });
                }
                return new AudioData({
                  format: this.format,
                  sampleRate: this.sampleRate,
                  numberOfFrames: this.numberOfFrames,
                  numberOfChannels: this.numberOfChannels,
                  timestamp: this.microsecondTimestamp,
                  data
                });
              } else {
                const data = new ArrayBuffer(this.allocationSize({ planeIndex: 0, format: this.format }));
                this.copyTo(data, { planeIndex: 0, format: this.format });
                return new AudioData({
                  format: this.format,
                  sampleRate: this.sampleRate,
                  numberOfFrames: this.numberOfFrames,
                  numberOfChannels: this.numberOfChannels,
                  timestamp: this.microsecondTimestamp,
                  data
                });
              }
            }
          } else {
            return new AudioData({
              format: this.format,
              sampleRate: this.sampleRate,
              numberOfFrames: this.numberOfFrames,
              numberOfChannels: this.numberOfChannels,
              timestamp: this.microsecondTimestamp,
              data: this._data
            });
          }
        }
toAudioBuffer() {
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const audioBuffer = new AudioBuffer({
            numberOfChannels: this.numberOfChannels,
            length: this.numberOfFrames,
            sampleRate: this.sampleRate
          });
          const dataBytes = new Float32Array(this.allocationSize({ planeIndex: 0, format: "f32-planar" }) / 4);
          for (let i = 0; i < this.numberOfChannels; i++) {
            this.copyTo(dataBytes, { planeIndex: i, format: "f32-planar" });
            audioBuffer.copyToChannel(dataBytes, i);
          }
          return audioBuffer;
        }
setTimestamp(newTimestamp) {
          if (!Number.isFinite(newTimestamp)) {
            throw new TypeError("newTimestamp must be a number.");
          }
          this.timestamp = newTimestamp;
        }
static *_fromAudioBuffer(audioBuffer, timestamp) {
          if (!(audioBuffer instanceof AudioBuffer)) {
            throw new TypeError("audioBuffer must be an AudioBuffer.");
          }
          const MAX_FLOAT_COUNT = 48e3 * 5;
          const numberOfChannels = audioBuffer.numberOfChannels;
          const sampleRate = audioBuffer.sampleRate;
          const totalFrames = audioBuffer.length;
          const maxFramesPerChunk = Math.floor(MAX_FLOAT_COUNT / numberOfChannels);
          let currentRelativeFrame = 0;
          let remainingFrames = totalFrames;
          while (remainingFrames > 0) {
            const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
            const chunkData = new Float32Array(numberOfChannels * framesToCopy);
            for (let channel = 0; channel < numberOfChannels; channel++) {
              audioBuffer.copyFromChannel(chunkData.subarray(channel * framesToCopy, (channel + 1) * framesToCopy), channel, currentRelativeFrame);
            }
            yield new AudioSample({
              format: "f32-planar",
              sampleRate,
              numberOfFrames: framesToCopy,
              numberOfChannels,
              timestamp: timestamp + currentRelativeFrame / sampleRate,
              data: chunkData
            });
            currentRelativeFrame += framesToCopy;
            remainingFrames -= framesToCopy;
          }
        }
static fromAudioBuffer(audioBuffer, timestamp) {
          if (!(audioBuffer instanceof AudioBuffer)) {
            throw new TypeError("audioBuffer must be an AudioBuffer.");
          }
          const MAX_FLOAT_COUNT = 48e3 * 5;
          const numberOfChannels = audioBuffer.numberOfChannels;
          const sampleRate = audioBuffer.sampleRate;
          const totalFrames = audioBuffer.length;
          const maxFramesPerChunk = Math.floor(MAX_FLOAT_COUNT / numberOfChannels);
          let currentRelativeFrame = 0;
          let remainingFrames = totalFrames;
          const result = [];
          while (remainingFrames > 0) {
            const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
            const chunkData = new Float32Array(numberOfChannels * framesToCopy);
            for (let channel = 0; channel < numberOfChannels; channel++) {
              audioBuffer.copyFromChannel(chunkData.subarray(channel * framesToCopy, (channel + 1) * framesToCopy), channel, currentRelativeFrame);
            }
            const audioSample = new AudioSample({
              format: "f32-planar",
              sampleRate,
              numberOfFrames: framesToCopy,
              numberOfChannels,
              timestamp: timestamp + currentRelativeFrame / sampleRate,
              data: chunkData
            });
            result.push(audioSample);
            currentRelativeFrame += framesToCopy;
            remainingFrames -= framesToCopy;
          }
          return result;
        }
      }
      const getBytesPerSample = (format) => {
        switch (format) {
          case "u8":
          case "u8-planar":
            return 1;
          case "s16":
          case "s16-planar":
            return 2;
          case "s32":
          case "s32-planar":
            return 4;
          case "f32":
          case "f32-planar":
            return 4;
          default:
            throw new Error("Unknown AudioSampleFormat");
        }
      };
      const formatIsPlanar = (format) => {
        switch (format) {
          case "u8-planar":
          case "s16-planar":
          case "s32-planar":
          case "f32-planar":
            return true;
          default:
            return false;
        }
      };
      const getReadFunction = (format) => {
        switch (format) {
          case "u8":
          case "u8-planar":
            return (view2, offset) => (view2.getUint8(offset) - 128) / 128;
          case "s16":
          case "s16-planar":
            return (view2, offset) => view2.getInt16(offset, true) / 32768;
          case "s32":
          case "s32-planar":
            return (view2, offset) => view2.getInt32(offset, true) / 2147483648;
          case "f32":
          case "f32-planar":
            return (view2, offset) => view2.getFloat32(offset, true);
        }
      };
      const getWriteFunction = (format) => {
        switch (format) {
          case "u8":
          case "u8-planar":
            return (view2, offset, value) => view2.setUint8(offset, clamp((value + 1) * 127.5, 0, 255));
          case "s16":
          case "s16-planar":
            return (view2, offset, value) => view2.setInt16(offset, clamp(Math.round(value * 32767), -32768, 32767), true);
          case "s32":
          case "s32-planar":
            return (view2, offset, value) => view2.setInt32(offset, clamp(Math.round(value * 2147483647), -2147483648, 2147483647), true);
          case "f32":
          case "f32-planar":
            return (view2, offset, value) => view2.setFloat32(offset, value, true);
        }
      };
      const isAudioData = (x) => {
        return typeof AudioData !== "undefined" && x instanceof AudioData;
      };
const validatePacketRetrievalOptions = (options) => {
        if (!options || typeof options !== "object") {
          throw new TypeError("options must be an object.");
        }
        if (options.metadataOnly !== void 0 && typeof options.metadataOnly !== "boolean") {
          throw new TypeError("options.metadataOnly, when defined, must be a boolean.");
        }
        if (options.verifyKeyPackets !== void 0 && typeof options.verifyKeyPackets !== "boolean") {
          throw new TypeError("options.verifyKeyPackets, when defined, must be a boolean.");
        }
        if (options.verifyKeyPackets && options.metadataOnly) {
          throw new TypeError("options.verifyKeyPackets and options.metadataOnly cannot be enabled together.");
        }
      };
      const validateTimestamp = (timestamp) => {
        if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
          throw new TypeError("timestamp must be a number.");
        }
      };
      const maybeFixPacketType = (track, promise, options) => {
        if (options.verifyKeyPackets) {
          return promise.then(async (packet) => {
            if (!packet || packet.type === "delta") {
              return packet;
            }
            const determinedType = await track.determinePacketType(packet);
            if (determinedType) {
              packet.type = determinedType;
            }
            return packet;
          });
        } else {
          return promise;
        }
      };
      class EncodedPacketSink {
constructor(track) {
          if (!(track instanceof InputTrack)) {
            throw new TypeError("track must be an InputTrack.");
          }
          this._track = track;
        }
getFirstPacket(options = {}) {
          validatePacketRetrievalOptions(options);
          return maybeFixPacketType(this._track, this._track._backing.getFirstPacket(options), options);
        }
getPacket(timestamp, options = {}) {
          validateTimestamp(timestamp);
          validatePacketRetrievalOptions(options);
          return maybeFixPacketType(this._track, this._track._backing.getPacket(timestamp, options), options);
        }
getNextPacket(packet, options = {}) {
          if (!(packet instanceof EncodedPacket)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          validatePacketRetrievalOptions(options);
          return maybeFixPacketType(this._track, this._track._backing.getNextPacket(packet, options), options);
        }
async getKeyPacket(timestamp, options = {}) {
          validateTimestamp(timestamp);
          validatePacketRetrievalOptions(options);
          if (!options.verifyKeyPackets) {
            return this._track._backing.getKeyPacket(timestamp, options);
          }
          const packet = await this._track._backing.getKeyPacket(timestamp, options);
          if (!packet || packet.type === "delta") {
            return packet;
          }
          const determinedType = await this._track.determinePacketType(packet);
          if (determinedType === "delta") {
            return this.getKeyPacket(packet.timestamp - 1 / this._track.timeResolution, options);
          }
          return packet;
        }
async getNextKeyPacket(packet, options = {}) {
          if (!(packet instanceof EncodedPacket)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          validatePacketRetrievalOptions(options);
          if (!options.verifyKeyPackets) {
            return this._track._backing.getNextKeyPacket(packet, options);
          }
          const nextPacket = await this._track._backing.getNextKeyPacket(packet, options);
          if (!nextPacket || nextPacket.type === "delta") {
            return nextPacket;
          }
          const determinedType = await this._track.determinePacketType(nextPacket);
          if (determinedType === "delta") {
            return this.getNextKeyPacket(nextPacket, options);
          }
          return nextPacket;
        }
packets(startPacket, endPacket, options = {}) {
          if (startPacket !== void 0 && !(startPacket instanceof EncodedPacket)) {
            throw new TypeError("startPacket must be an EncodedPacket.");
          }
          if (startPacket !== void 0 && startPacket.isMetadataOnly && !options?.metadataOnly) {
            throw new TypeError("startPacket can only be metadata-only if options.metadataOnly is enabled.");
          }
          if (endPacket !== void 0 && !(endPacket instanceof EncodedPacket)) {
            throw new TypeError("endPacket must be an EncodedPacket.");
          }
          validatePacketRetrievalOptions(options);
          const packetQueue = [];
          let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers();
          let { promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers();
          let ended = false;
          let terminated = false;
          let outOfBandError = null;
          const timestamps = [];
          const maxQueueSize = () => Math.max(2, timestamps.length);
          (async () => {
            let packet = startPacket ?? await this.getFirstPacket(options);
            while (packet && !terminated) {
              if (endPacket && packet.sequenceNumber >= endPacket?.sequenceNumber) {
                break;
              }
              if (packetQueue.length > maxQueueSize()) {
                ({ promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers());
                await queueDequeue;
                continue;
              }
              packetQueue.push(packet);
              onQueueNotEmpty();
              ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers());
              packet = await this.getNextPacket(packet, options);
            }
            ended = true;
            onQueueNotEmpty();
          })().catch((error) => {
            if (!outOfBandError) {
              outOfBandError = error;
              onQueueNotEmpty();
            }
          });
          return {
            async next() {
              while (true) {
                if (terminated) {
                  return { value: void 0, done: true };
                } else if (outOfBandError) {
                  throw outOfBandError;
                } else if (packetQueue.length > 0) {
                  const value = packetQueue.shift();
                  const now = performance.now();
                  timestamps.push(now);
                  while (timestamps.length > 0 && now - timestamps[0] >= 1e3) {
                    timestamps.shift();
                  }
                  onQueueDequeue();
                  return { value, done: false };
                } else if (ended) {
                  return { value: void 0, done: true };
                } else {
                  await queueNotEmpty;
                }
              }
            },
            async return() {
              terminated = true;
              onQueueDequeue();
              onQueueNotEmpty();
              return { value: void 0, done: true };
            },
            async throw(error) {
              throw error;
            },
            [Symbol.asyncIterator]() {
              return this;
            }
          };
        }
      }
      class DecoderWrapper {
        constructor(onSample, onError) {
          this.onSample = onSample;
          this.onError = onError;
        }
      }
      class BaseMediaSampleSink {
mediaSamplesInRange(startTimestamp = 0, endTimestamp = Infinity) {
          validateTimestamp(startTimestamp);
          validateTimestamp(endTimestamp);
          const sampleQueue = [];
          let firstSampleQueued = false;
          let lastSample = null;
          let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers();
          let { promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers();
          let decoderIsFlushed = false;
          let ended = false;
          let terminated = false;
          let outOfBandError = null;
          (async () => {
            const decoderError = new Error();
            const decoder = await this._createDecoder((sample) => {
              onQueueDequeue();
              if (sample.timestamp >= endTimestamp) {
                ended = true;
              }
              if (ended) {
                sample.close();
                return;
              }
              if (lastSample) {
                if (sample.timestamp > startTimestamp) {
                  sampleQueue.push(lastSample);
                  firstSampleQueued = true;
                } else {
                  lastSample.close();
                }
              }
              if (sample.timestamp >= startTimestamp) {
                sampleQueue.push(sample);
                firstSampleQueued = true;
              }
              lastSample = firstSampleQueued ? null : sample;
              if (sampleQueue.length > 0) {
                onQueueNotEmpty();
                ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers());
              }
            }, (error) => {
              if (!outOfBandError) {
                error.stack = decoderError.stack;
                outOfBandError = error;
                onQueueNotEmpty();
              }
            });
            const packetSink = this._createPacketSink();
            const keyPacket = await packetSink.getKeyPacket(startTimestamp, { verifyKeyPackets: true }) ?? await packetSink.getFirstPacket();
            if (!keyPacket) {
              return;
            }
            let currentPacket = keyPacket;
            let endPacket = void 0;
            if (endTimestamp < Infinity) {
              const packet = await packetSink.getPacket(endTimestamp);
              const keyPacket2 = !packet ? null : packet.type === "key" && packet.timestamp === endTimestamp ? packet : await packetSink.getNextKeyPacket(packet, { verifyKeyPackets: true });
              if (keyPacket2) {
                endPacket = keyPacket2;
              }
            }
            const packets = packetSink.packets(keyPacket, endPacket);
            await packets.next();
            while (currentPacket && !ended) {
              const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
              if (sampleQueue.length + decoder.getDecodeQueueSize() > maxQueueSize) {
                ({ promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers());
                await queueDequeue;
                continue;
              }
              decoder.decode(currentPacket);
              const packetResult = await packets.next();
              if (packetResult.done) {
                break;
              }
              currentPacket = packetResult.value;
            }
            await packets.return();
            if (!terminated)
              await decoder.flush();
            decoder.close();
            if (!firstSampleQueued && lastSample) {
              sampleQueue.push(lastSample);
            }
            decoderIsFlushed = true;
            onQueueNotEmpty();
          })().catch((error) => {
            if (!outOfBandError) {
              outOfBandError = error;
              onQueueNotEmpty();
            }
          });
          return {
            async next() {
              while (true) {
                if (terminated) {
                  return { value: void 0, done: true };
                } else if (outOfBandError) {
                  throw outOfBandError;
                } else if (sampleQueue.length > 0) {
                  const value = sampleQueue.shift();
                  onQueueDequeue();
                  return { value, done: false };
                } else if (!decoderIsFlushed) {
                  await queueNotEmpty;
                } else {
                  return { value: void 0, done: true };
                }
              }
            },
            async return() {
              terminated = true;
              ended = true;
              onQueueDequeue();
              onQueueNotEmpty();
              lastSample?.close();
              for (const sample of sampleQueue) {
                sample.close();
              }
              return { value: void 0, done: true };
            },
            async throw(error) {
              throw error;
            },
            [Symbol.asyncIterator]() {
              return this;
            }
          };
        }
mediaSamplesAtTimestamps(timestamps) {
          validateAnyIterable(timestamps);
          const timestampIterator = toAsyncIterator(timestamps);
          const timestampsOfInterest = [];
          const sampleQueue = [];
          let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers();
          let { promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers();
          let decoderIsFlushed = false;
          let terminated = false;
          let outOfBandError = null;
          const pushToQueue = (sample) => {
            sampleQueue.push(sample);
            onQueueNotEmpty();
            ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers());
          };
          (async () => {
            const decoderError = new Error();
            const decoder = await this._createDecoder((sample) => {
              onQueueDequeue();
              if (terminated) {
                sample.close();
                return;
              }
              let sampleUses = 0;
              while (timestampsOfInterest.length > 0 && sample.timestamp - timestampsOfInterest[0] > -1e-10) {
                sampleUses++;
                timestampsOfInterest.shift();
              }
              if (sampleUses > 0) {
                for (let i = 0; i < sampleUses; i++) {
                  pushToQueue(i < sampleUses - 1 ? sample.clone() : sample);
                }
              } else {
                sample.close();
              }
            }, (error) => {
              if (!outOfBandError) {
                error.stack = decoderError.stack;
                outOfBandError = error;
                onQueueNotEmpty();
              }
            });
            const packetSink = this._createPacketSink();
            let lastPacket = null;
            let lastKeyPacket = null;
            let maxSequenceNumber = -1;
            const decodePackets = async () => {
              assert$1(lastKeyPacket);
              let currentPacket = lastKeyPacket;
              decoder.decode(currentPacket);
              while (currentPacket.sequenceNumber < maxSequenceNumber) {
                const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
                while (sampleQueue.length + decoder.getDecodeQueueSize() > maxQueueSize && !terminated) {
                  ({ promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers());
                  await queueDequeue;
                }
                if (terminated) {
                  break;
                }
                const nextPacket = await packetSink.getNextPacket(currentPacket);
                assert$1(nextPacket);
                decoder.decode(nextPacket);
                currentPacket = nextPacket;
              }
              maxSequenceNumber = -1;
            };
            const flushDecoder = async () => {
              await decoder.flush();
              for (let i = 0; i < timestampsOfInterest.length; i++) {
                pushToQueue(null);
              }
              timestampsOfInterest.length = 0;
            };
            for await (const timestamp of timestampIterator) {
              validateTimestamp(timestamp);
              if (terminated) {
                break;
              }
              const targetPacket = await packetSink.getPacket(timestamp);
              const keyPacket = targetPacket && await packetSink.getKeyPacket(timestamp, { verifyKeyPackets: true });
              if (!keyPacket) {
                if (maxSequenceNumber !== -1) {
                  await decodePackets();
                  await flushDecoder();
                }
                pushToQueue(null);
                lastPacket = null;
                continue;
              }
              if (lastPacket && (keyPacket.sequenceNumber !== lastKeyPacket.sequenceNumber || targetPacket.timestamp < lastPacket.timestamp)) {
                await decodePackets();
                await flushDecoder();
              }
              timestampsOfInterest.push(targetPacket.timestamp);
              maxSequenceNumber = Math.max(targetPacket.sequenceNumber, maxSequenceNumber);
              lastPacket = targetPacket;
              lastKeyPacket = keyPacket;
            }
            if (!terminated) {
              if (maxSequenceNumber !== -1) {
                await decodePackets();
              }
              await flushDecoder();
            }
            decoder.close();
            decoderIsFlushed = true;
            onQueueNotEmpty();
          })().catch((error) => {
            if (!outOfBandError) {
              outOfBandError = error;
              onQueueNotEmpty();
            }
          });
          return {
            async next() {
              while (true) {
                if (terminated) {
                  return { value: void 0, done: true };
                } else if (outOfBandError) {
                  throw outOfBandError;
                } else if (sampleQueue.length > 0) {
                  const value = sampleQueue.shift();
                  assert$1(value !== void 0);
                  onQueueDequeue();
                  return { value, done: false };
                } else if (!decoderIsFlushed) {
                  await queueNotEmpty;
                } else {
                  return { value: void 0, done: true };
                }
              }
            },
            async return() {
              terminated = true;
              onQueueDequeue();
              onQueueNotEmpty();
              for (const sample of sampleQueue) {
                sample?.close();
              }
              return { value: void 0, done: true };
            },
            async throw(error) {
              throw error;
            },
            [Symbol.asyncIterator]() {
              return this;
            }
          };
        }
      }
      const computeMaxQueueSize = (decodedSampleQueueSize) => {
        return decodedSampleQueueSize === 0 ? 40 : 8;
      };
      class VideoDecoderWrapper extends DecoderWrapper {
        constructor(onSample, onError, codec, decoderConfig, rotation, timeResolution) {
          super(onSample, onError);
          this.codec = codec;
          this.decoderConfig = decoderConfig;
          this.rotation = rotation;
          this.timeResolution = timeResolution;
          this.decoder = null;
          this.customDecoder = null;
          this.customDecoderCallSerializer = new CallSerializer();
          this.customDecoderQueueSize = 0;
          this.inputTimestamps = [];
          this.sampleQueue = [];
          this.currentPacketIndex = 0;
          this.raslSkipped = false;
          const MatchingCustomDecoder = customVideoDecoders.find((x) => x.supports(codec, decoderConfig));
          if (MatchingCustomDecoder) {
            this.customDecoder = new MatchingCustomDecoder();
            this.customDecoder.codec = codec;
            this.customDecoder.config = decoderConfig;
            this.customDecoder.onSample = (sample) => {
              if (!(sample instanceof VideoSample)) {
                throw new TypeError("The argument passed to onSample must be a VideoSample.");
              }
              this.finalizeAndEmitSample(sample);
            };
            void this.customDecoderCallSerializer.call(() => this.customDecoder.init());
          } else {
            const sampleHandler = (sample) => {
              if (isSafari()) {
                if (this.sampleQueue.length > 0 && sample.timestamp >= last(this.sampleQueue).timestamp) {
                  for (const sample2 of this.sampleQueue) {
                    this.finalizeAndEmitSample(sample2);
                  }
                  this.sampleQueue.length = 0;
                }
                insertSorted(this.sampleQueue, sample, (x) => x.timestamp);
              } else {
                const timestamp = this.inputTimestamps.shift();
                assert$1(timestamp !== void 0);
                sample.setTimestamp(timestamp);
                this.finalizeAndEmitSample(sample);
              }
            };
            this.decoder = new VideoDecoder({
              output: (frame) => sampleHandler(new VideoSample(frame)),
              error: onError
            });
            this.decoder.configure(decoderConfig);
          }
        }
        finalizeAndEmitSample(sample) {
          sample.setTimestamp(Math.round(sample.timestamp * this.timeResolution) / this.timeResolution);
          sample.setDuration(Math.round(sample.duration * this.timeResolution) / this.timeResolution);
          sample.setRotation(this.rotation);
          this.onSample(sample);
        }
        getDecodeQueueSize() {
          if (this.customDecoder) {
            return this.customDecoderQueueSize;
          } else {
            assert$1(this.decoder);
            return this.decoder.decodeQueueSize;
          }
        }
        decode(packet) {
          if (this.codec === "hevc" && this.currentPacketIndex > 0 && !this.raslSkipped) {
            const nalUnits = extractHevcNalUnits(packet.data, this.decoderConfig);
            const hasRaslPicture = nalUnits.some((x) => {
              const type = extractNalUnitTypeForHevc(x);
              return type === HevcNalUnitType.RASL_N || type === HevcNalUnitType.RASL_R;
            });
            if (hasRaslPicture) {
              return;
            }
            this.raslSkipped = true;
          }
          this.currentPacketIndex++;
          if (this.customDecoder) {
            this.customDecoderQueueSize++;
            void this.customDecoderCallSerializer.call(() => this.customDecoder.decode(packet)).then(() => this.customDecoderQueueSize--);
          } else {
            assert$1(this.decoder);
            if (!isSafari()) {
              insertSorted(this.inputTimestamps, packet.timestamp, (x) => x);
            }
            this.decoder.decode(packet.toEncodedVideoChunk());
          }
        }
        async flush() {
          if (this.customDecoder) {
            await this.customDecoderCallSerializer.call(() => this.customDecoder.flush());
          } else {
            assert$1(this.decoder);
            await this.decoder.flush();
          }
          if (isSafari()) {
            for (const sample of this.sampleQueue) {
              this.finalizeAndEmitSample(sample);
            }
            this.sampleQueue.length = 0;
          }
          this.currentPacketIndex = 0;
          this.raslSkipped = false;
        }
        close() {
          if (this.customDecoder) {
            void this.customDecoderCallSerializer.call(() => this.customDecoder.close());
          } else {
            assert$1(this.decoder);
            this.decoder.close();
          }
          for (const sample of this.sampleQueue) {
            sample.close();
          }
          this.sampleQueue.length = 0;
        }
      }
      class VideoSampleSink extends BaseMediaSampleSink {
constructor(videoTrack) {
          if (!(videoTrack instanceof InputVideoTrack)) {
            throw new TypeError("videoTrack must be an InputVideoTrack.");
          }
          super();
          this._videoTrack = videoTrack;
        }
async _createDecoder(onSample, onError) {
          if (!await this._videoTrack.canDecode()) {
            throw new Error("This video track cannot be decoded by this browser. Make sure to check decodability before using a track.");
          }
          const codec = this._videoTrack.codec;
          const rotation = this._videoTrack.rotation;
          const decoderConfig = await this._videoTrack.getDecoderConfig();
          const timeResolution = this._videoTrack.timeResolution;
          assert$1(codec && decoderConfig);
          return new VideoDecoderWrapper(onSample, onError, codec, decoderConfig, rotation, timeResolution);
        }
_createPacketSink() {
          return new EncodedPacketSink(this._videoTrack);
        }
async getSample(timestamp) {
          validateTimestamp(timestamp);
          for await (const sample of this.mediaSamplesAtTimestamps([timestamp])) {
            return sample;
          }
          throw new Error("Internal error: Iterator returned nothing.");
        }
samples(startTimestamp = 0, endTimestamp = Infinity) {
          return this.mediaSamplesInRange(startTimestamp, endTimestamp);
        }
samplesAtTimestamps(timestamps) {
          return this.mediaSamplesAtTimestamps(timestamps);
        }
      }
      class CanvasSink {
constructor(videoTrack, options = {}) {
          this._nextCanvasIndex = 0;
          if (!(videoTrack instanceof InputVideoTrack)) {
            throw new TypeError("videoTrack must be an InputVideoTrack.");
          }
          if (options && typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (options.width !== void 0 && (!Number.isInteger(options.width) || options.width <= 0)) {
            throw new TypeError("options.width, when defined, must be a positive integer.");
          }
          if (options.height !== void 0 && (!Number.isInteger(options.height) || options.height <= 0)) {
            throw new TypeError("options.height, when defined, must be a positive integer.");
          }
          if (options.fit !== void 0 && !["fill", "contain", "cover"].includes(options.fit)) {
            throw new TypeError('options.fit, when provided, must be one of "fill", "contain", or "cover".');
          }
          if (options.width !== void 0 && options.height !== void 0 && options.fit === void 0) {
            throw new TypeError("When both options.width and options.height are provided, options.fit must also be provided.");
          }
          if (options.rotation !== void 0 && ![0, 90, 180, 270].includes(options.rotation)) {
            throw new TypeError("options.rotation, when provided, must be 0, 90, 180 or 270.");
          }
          if (options.crop !== void 0) {
            validateCropRectangle(options.crop, "options.");
          }
          if (options.poolSize !== void 0 && (typeof options.poolSize !== "number" || !Number.isInteger(options.poolSize) || options.poolSize < 0)) {
            throw new TypeError("poolSize must be a non-negative integer.");
          }
          const rotation = options.rotation ?? videoTrack.rotation;
          const [rotatedWidth, rotatedHeight] = rotation % 180 === 0 ? [videoTrack.codedWidth, videoTrack.codedHeight] : [videoTrack.codedHeight, videoTrack.codedWidth];
          const crop = options.crop;
          if (crop) {
            clampCropRectangle(crop, rotatedWidth, rotatedHeight);
          }
          let [width, height] = crop ? [crop.width, crop.height] : [rotatedWidth, rotatedHeight];
          const originalAspectRatio = width / height;
          if (options.width !== void 0 && options.height === void 0) {
            width = options.width;
            height = Math.round(width / originalAspectRatio);
          } else if (options.width === void 0 && options.height !== void 0) {
            height = options.height;
            width = Math.round(height * originalAspectRatio);
          } else if (options.width !== void 0 && options.height !== void 0) {
            width = options.width;
            height = options.height;
          }
          this._videoTrack = videoTrack;
          this._width = width;
          this._height = height;
          this._rotation = rotation;
          this._crop = crop;
          this._fit = options.fit ?? "fill";
          this._videoSampleSink = new VideoSampleSink(videoTrack);
          this._canvasPool = Array.from({ length: options.poolSize ?? 0 }, () => null);
        }
_videoSampleToWrappedCanvas(sample) {
          let canvas = this._canvasPool[this._nextCanvasIndex];
          let canvasIsNew = false;
          if (!canvas) {
            if (typeof document !== "undefined") {
              canvas = document.createElement("canvas");
              canvas.width = this._width;
              canvas.height = this._height;
            } else {
              canvas = new OffscreenCanvas(this._width, this._height);
            }
            if (this._canvasPool.length > 0) {
              this._canvasPool[this._nextCanvasIndex] = canvas;
            }
            canvasIsNew = true;
          }
          if (this._canvasPool.length > 0) {
            this._nextCanvasIndex = (this._nextCanvasIndex + 1) % this._canvasPool.length;
          }
          const context = canvas.getContext("2d", {
            alpha: isFirefox()
});
          assert$1(context);
          context.resetTransform();
          if (!canvasIsNew) {
            if (isFirefox()) {
              context.fillStyle = "black";
              context.fillRect(0, 0, this._width, this._height);
            } else {
              context.clearRect(0, 0, this._width, this._height);
            }
          }
          sample.drawWithFit(context, {
            fit: this._fit,
            rotation: this._rotation,
            crop: this._crop
          });
          const result = {
            canvas,
            timestamp: sample.timestamp,
            duration: sample.duration
          };
          sample.close();
          return result;
        }
async getCanvas(timestamp) {
          validateTimestamp(timestamp);
          const sample = await this._videoSampleSink.getSample(timestamp);
          return sample && this._videoSampleToWrappedCanvas(sample);
        }
canvases(startTimestamp = 0, endTimestamp = Infinity) {
          return mapAsyncGenerator(this._videoSampleSink.samples(startTimestamp, endTimestamp), (sample) => this._videoSampleToWrappedCanvas(sample));
        }
canvasesAtTimestamps(timestamps) {
          return mapAsyncGenerator(this._videoSampleSink.samplesAtTimestamps(timestamps), (sample) => sample && this._videoSampleToWrappedCanvas(sample));
        }
      }
      class AudioDecoderWrapper extends DecoderWrapper {
        constructor(onSample, onError, codec, decoderConfig) {
          super(onSample, onError);
          this.decoder = null;
          this.customDecoder = null;
          this.customDecoderCallSerializer = new CallSerializer();
          this.customDecoderQueueSize = 0;
          this.currentTimestamp = null;
          const sampleHandler = (sample) => {
            if (this.currentTimestamp === null || Math.abs(sample.timestamp - this.currentTimestamp) >= sample.duration) {
              this.currentTimestamp = sample.timestamp;
            }
            const preciseTimestamp = this.currentTimestamp;
            this.currentTimestamp += sample.duration;
            if (sample.numberOfFrames === 0) {
              sample.close();
              return;
            }
            const sampleRate = decoderConfig.sampleRate;
            sample.setTimestamp(Math.round(preciseTimestamp * sampleRate) / sampleRate);
            onSample(sample);
          };
          const MatchingCustomDecoder = customAudioDecoders.find((x) => x.supports(codec, decoderConfig));
          if (MatchingCustomDecoder) {
            this.customDecoder = new MatchingCustomDecoder();
            this.customDecoder.codec = codec;
            this.customDecoder.config = decoderConfig;
            this.customDecoder.onSample = (sample) => {
              if (!(sample instanceof AudioSample)) {
                throw new TypeError("The argument passed to onSample must be an AudioSample.");
              }
              sampleHandler(sample);
            };
            void this.customDecoderCallSerializer.call(() => this.customDecoder.init());
          } else {
            this.decoder = new AudioDecoder({
              output: (data) => sampleHandler(new AudioSample(data)),
              error: onError
            });
            this.decoder.configure(decoderConfig);
          }
        }
        getDecodeQueueSize() {
          if (this.customDecoder) {
            return this.customDecoderQueueSize;
          } else {
            assert$1(this.decoder);
            return this.decoder.decodeQueueSize;
          }
        }
        decode(packet) {
          if (this.customDecoder) {
            this.customDecoderQueueSize++;
            void this.customDecoderCallSerializer.call(() => this.customDecoder.decode(packet)).then(() => this.customDecoderQueueSize--);
          } else {
            assert$1(this.decoder);
            this.decoder.decode(packet.toEncodedAudioChunk());
          }
        }
        flush() {
          if (this.customDecoder) {
            return this.customDecoderCallSerializer.call(() => this.customDecoder.flush());
          } else {
            assert$1(this.decoder);
            return this.decoder.flush();
          }
        }
        close() {
          if (this.customDecoder) {
            void this.customDecoderCallSerializer.call(() => this.customDecoder.close());
          } else {
            assert$1(this.decoder);
            this.decoder.close();
          }
        }
      }
      class PcmAudioDecoderWrapper extends DecoderWrapper {
        constructor(onSample, onError, decoderConfig) {
          super(onSample, onError);
          this.decoderConfig = decoderConfig;
          this.currentTimestamp = null;
          assert$1(PCM_AUDIO_CODECS.includes(decoderConfig.codec));
          this.codec = decoderConfig.codec;
          const { dataType, sampleSize, littleEndian } = parsePcmCodec(this.codec);
          this.inputSampleSize = sampleSize;
          switch (sampleSize) {
            case 1:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view2, byteOffset) => view2.getUint8(byteOffset) - 2 ** 7;
                } else if (dataType === "signed") {
                  this.readInputValue = (view2, byteOffset) => view2.getInt8(byteOffset);
                } else if (dataType === "ulaw") {
                  this.readInputValue = (view2, byteOffset) => fromUlaw(view2.getUint8(byteOffset));
                } else if (dataType === "alaw") {
                  this.readInputValue = (view2, byteOffset) => fromAlaw(view2.getUint8(byteOffset));
                } else {
                  assert$1(false);
                }
              }
              break;
            case 2:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view2, byteOffset) => view2.getUint16(byteOffset, littleEndian) - 2 ** 15;
                } else if (dataType === "signed") {
                  this.readInputValue = (view2, byteOffset) => view2.getInt16(byteOffset, littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            case 3:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view2, byteOffset) => getUint24(view2, byteOffset, littleEndian) - 2 ** 23;
                } else if (dataType === "signed") {
                  this.readInputValue = (view2, byteOffset) => getInt24(view2, byteOffset, littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            case 4:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view2, byteOffset) => view2.getUint32(byteOffset, littleEndian) - 2 ** 31;
                } else if (dataType === "signed") {
                  this.readInputValue = (view2, byteOffset) => view2.getInt32(byteOffset, littleEndian);
                } else if (dataType === "float") {
                  this.readInputValue = (view2, byteOffset) => view2.getFloat32(byteOffset, littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            case 8:
              {
                if (dataType === "float") {
                  this.readInputValue = (view2, byteOffset) => view2.getFloat64(byteOffset, littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            default: {
              assertNever(sampleSize);
              assert$1(false);
            }
          }
          switch (sampleSize) {
            case 1:
              {
                if (dataType === "ulaw" || dataType === "alaw") {
                  this.outputSampleSize = 2;
                  this.outputFormat = "s16";
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setInt16(byteOffset, value, true);
                } else {
                  this.outputSampleSize = 1;
                  this.outputFormat = "u8";
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setUint8(byteOffset, value + 2 ** 7);
                }
              }
              break;
            case 2:
              {
                this.outputSampleSize = 2;
                this.outputFormat = "s16";
                this.writeOutputValue = (view2, byteOffset, value) => view2.setInt16(byteOffset, value, true);
              }
              break;
            case 3:
              {
                this.outputSampleSize = 4;
                this.outputFormat = "s32";
                this.writeOutputValue = (view2, byteOffset, value) => view2.setInt32(byteOffset, value << 8, true);
              }
              break;
            case 4:
              {
                this.outputSampleSize = 4;
                if (dataType === "float") {
                  this.outputFormat = "f32";
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setFloat32(byteOffset, value, true);
                } else {
                  this.outputFormat = "s32";
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setInt32(byteOffset, value, true);
                }
              }
              break;
            case 8:
              {
                this.outputSampleSize = 4;
                this.outputFormat = "f32";
                this.writeOutputValue = (view2, byteOffset, value) => view2.setFloat32(byteOffset, value, true);
              }
              break;
            default: {
              assertNever(sampleSize);
              assert$1(false);
            }
          }
        }
        getDecodeQueueSize() {
          return 0;
        }
        decode(packet) {
          const inputView = toDataView(packet.data);
          const numberOfFrames = packet.byteLength / this.decoderConfig.numberOfChannels / this.inputSampleSize;
          const outputBufferSize = numberOfFrames * this.decoderConfig.numberOfChannels * this.outputSampleSize;
          const outputBuffer = new ArrayBuffer(outputBufferSize);
          const outputView = new DataView(outputBuffer);
          for (let i = 0; i < numberOfFrames * this.decoderConfig.numberOfChannels; i++) {
            const inputIndex = i * this.inputSampleSize;
            const outputIndex = i * this.outputSampleSize;
            const value = this.readInputValue(inputView, inputIndex);
            this.writeOutputValue(outputView, outputIndex, value);
          }
          const preciseDuration = numberOfFrames / this.decoderConfig.sampleRate;
          if (this.currentTimestamp === null || Math.abs(packet.timestamp - this.currentTimestamp) >= preciseDuration) {
            this.currentTimestamp = packet.timestamp;
          }
          const preciseTimestamp = this.currentTimestamp;
          this.currentTimestamp += preciseDuration;
          const audioSample = new AudioSample({
            format: this.outputFormat,
            data: outputBuffer,
            numberOfChannels: this.decoderConfig.numberOfChannels,
            sampleRate: this.decoderConfig.sampleRate,
            numberOfFrames,
            timestamp: preciseTimestamp
          });
          this.onSample(audioSample);
        }
        async flush() {
        }
        close() {
        }
      }
      class AudioSampleSink extends BaseMediaSampleSink {
constructor(audioTrack) {
          if (!(audioTrack instanceof InputAudioTrack)) {
            throw new TypeError("audioTrack must be an InputAudioTrack.");
          }
          super();
          this._audioTrack = audioTrack;
        }
async _createDecoder(onSample, onError) {
          if (!await this._audioTrack.canDecode()) {
            throw new Error("This audio track cannot be decoded by this browser. Make sure to check decodability before using a track.");
          }
          const codec = this._audioTrack.codec;
          const decoderConfig = await this._audioTrack.getDecoderConfig();
          assert$1(codec && decoderConfig);
          if (PCM_AUDIO_CODECS.includes(decoderConfig.codec)) {
            return new PcmAudioDecoderWrapper(onSample, onError, decoderConfig);
          } else {
            return new AudioDecoderWrapper(onSample, onError, codec, decoderConfig);
          }
        }
_createPacketSink() {
          return new EncodedPacketSink(this._audioTrack);
        }
async getSample(timestamp) {
          validateTimestamp(timestamp);
          for await (const sample of this.mediaSamplesAtTimestamps([timestamp])) {
            return sample;
          }
          throw new Error("Internal error: Iterator returned nothing.");
        }
samples(startTimestamp = 0, endTimestamp = Infinity) {
          return this.mediaSamplesInRange(startTimestamp, endTimestamp);
        }
samplesAtTimestamps(timestamps) {
          return this.mediaSamplesAtTimestamps(timestamps);
        }
      }
class InputTrack {
constructor(backing) {
          this._backing = backing;
        }
isVideoTrack() {
          return this instanceof InputVideoTrack;
        }
isAudioTrack() {
          return this instanceof InputAudioTrack;
        }
get id() {
          return this._backing.getId();
        }
get internalCodecId() {
          return this._backing.getInternalCodecId();
        }
get languageCode() {
          return this._backing.getLanguageCode();
        }
get name() {
          return this._backing.getName();
        }
get timeResolution() {
          return this._backing.getTimeResolution();
        }
getFirstTimestamp() {
          return this._backing.getFirstTimestamp();
        }
computeDuration() {
          return this._backing.computeDuration();
        }
async computePacketStats(targetPacketCount = Infinity) {
          const sink = new EncodedPacketSink(this);
          let startTimestamp = Infinity;
          let endTimestamp = -Infinity;
          let packetCount = 0;
          let totalPacketBytes = 0;
          for await (const packet of sink.packets(void 0, void 0, { metadataOnly: true })) {
            if (packetCount >= targetPacketCount && packet.timestamp >= endTimestamp) {
              break;
            }
            startTimestamp = Math.min(startTimestamp, packet.timestamp);
            endTimestamp = Math.max(endTimestamp, packet.timestamp + packet.duration);
            packetCount++;
            totalPacketBytes += packet.byteLength;
          }
          return {
            packetCount,
            averagePacketRate: packetCount ? Number((packetCount / (endTimestamp - startTimestamp)).toPrecision(16)) : 0,
            averageBitrate: packetCount ? Number((8 * totalPacketBytes / (endTimestamp - startTimestamp)).toPrecision(16)) : 0
          };
        }
      }
      class InputVideoTrack extends InputTrack {
constructor(backing) {
          super(backing);
          this._backing = backing;
        }
        get type() {
          return "video";
        }
        get codec() {
          return this._backing.getCodec();
        }
get codedWidth() {
          return this._backing.getCodedWidth();
        }
get codedHeight() {
          return this._backing.getCodedHeight();
        }
get rotation() {
          return this._backing.getRotation();
        }
get displayWidth() {
          const rotation = this._backing.getRotation();
          return rotation % 180 === 0 ? this._backing.getCodedWidth() : this._backing.getCodedHeight();
        }
get displayHeight() {
          const rotation = this._backing.getRotation();
          return rotation % 180 === 0 ? this._backing.getCodedHeight() : this._backing.getCodedWidth();
        }
getColorSpace() {
          return this._backing.getColorSpace();
        }
async hasHighDynamicRange() {
          const colorSpace = await this._backing.getColorSpace();
          return colorSpace.primaries === "bt2020" || colorSpace.primaries === "smpte432" || colorSpace.transfer === "pg" || colorSpace.transfer === "hlg" || colorSpace.matrix === "bt2020-ncl";
        }
getDecoderConfig() {
          return this._backing.getDecoderConfig();
        }
        async getCodecParameterString() {
          const decoderConfig = await this._backing.getDecoderConfig();
          return decoderConfig?.codec ?? null;
        }
        async canDecode() {
          try {
            const decoderConfig = await this._backing.getDecoderConfig();
            if (!decoderConfig) {
              return false;
            }
            const codec = this._backing.getCodec();
            assert$1(codec !== null);
            if (customVideoDecoders.some((x) => x.supports(codec, decoderConfig))) {
              return true;
            }
            if (typeof VideoDecoder === "undefined") {
              return false;
            }
            const support = await VideoDecoder.isConfigSupported(decoderConfig);
            return support.supported === true;
          } catch (error) {
            console.error("Error during decodability check:", error);
            return false;
          }
        }
        async determinePacketType(packet) {
          if (!(packet instanceof EncodedPacket)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          if (packet.isMetadataOnly) {
            throw new TypeError("packet must not be metadata-only to determine its type.");
          }
          if (this.codec === null) {
            return null;
          }
          return determineVideoPacketType(this, packet);
        }
      }
      class InputAudioTrack extends InputTrack {
constructor(backing) {
          super(backing);
          this._backing = backing;
        }
        get type() {
          return "audio";
        }
        get codec() {
          return this._backing.getCodec();
        }
get numberOfChannels() {
          return this._backing.getNumberOfChannels();
        }
get sampleRate() {
          return this._backing.getSampleRate();
        }
getDecoderConfig() {
          return this._backing.getDecoderConfig();
        }
        async getCodecParameterString() {
          const decoderConfig = await this._backing.getDecoderConfig();
          return decoderConfig?.codec ?? null;
        }
        async canDecode() {
          try {
            const decoderConfig = await this._backing.getDecoderConfig();
            if (!decoderConfig) {
              return false;
            }
            const codec = this._backing.getCodec();
            assert$1(codec !== null);
            if (customAudioDecoders.some((x) => x.supports(codec, decoderConfig))) {
              return true;
            }
            if (decoderConfig.codec.startsWith("pcm-")) {
              return true;
            } else {
              if (typeof AudioDecoder === "undefined") {
                return false;
              }
              const support = await AudioDecoder.isConfigSupported(decoderConfig);
              return support.supported === true;
            }
          } catch (error) {
            console.error("Error during decodability check:", error);
            return false;
          }
        }
        async determinePacketType(packet) {
          if (!(packet instanceof EncodedPacket)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          if (this.codec === null) {
            return null;
          }
          return "key";
        }
      }
class OutputFormat {
getSupportedVideoCodecs() {
          return this.getSupportedCodecs().filter((codec) => VIDEO_CODECS.includes(codec));
        }
getSupportedAudioCodecs() {
          return this.getSupportedCodecs().filter((codec) => AUDIO_CODECS.includes(codec));
        }
getSupportedSubtitleCodecs() {
          return this.getSupportedCodecs().filter((codec) => SUBTITLE_CODECS.includes(codec));
        }

_codecUnsupportedHint(codec) {
          return "";
        }
      }
      class IsobmffOutputFormat extends OutputFormat {
constructor(options = {}) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (options.fastStart !== void 0 && ![false, "in-memory", "reserve", "fragmented"].includes(options.fastStart)) {
            throw new TypeError("options.fastStart, when provided, must be false, 'in-memory', 'reserve', or 'fragmented'.");
          }
          if (options.minimumFragmentDuration !== void 0 && (!Number.isFinite(options.minimumFragmentDuration) || options.minimumFragmentDuration < 0)) {
            throw new TypeError("options.minimumFragmentDuration, when provided, must be a non-negative number.");
          }
          if (options.onFtyp !== void 0 && typeof options.onFtyp !== "function") {
            throw new TypeError("options.onFtyp, when provided, must be a function.");
          }
          if (options.onMoov !== void 0 && typeof options.onMoov !== "function") {
            throw new TypeError("options.onMoov, when provided, must be a function.");
          }
          if (options.onMdat !== void 0 && typeof options.onMdat !== "function") {
            throw new TypeError("options.onMdat, when provided, must be a function.");
          }
          if (options.onMoof !== void 0 && typeof options.onMoof !== "function") {
            throw new TypeError("options.onMoof, when provided, must be a function.");
          }
          if (options.metadataFormat !== void 0 && !["mdir", "mdta", "udta", "auto"].includes(options.metadataFormat)) {
            throw new TypeError("options.metadataFormat, when provided, must be either 'auto', 'mdir', 'mdta', or 'udta'.");
          }
          super();
          this._options = options;
        }
        getSupportedTrackCounts() {
          return {
            video: { min: 0, max: Infinity },
            audio: { min: 0, max: Infinity },
            subtitle: { min: 0, max: Infinity },
            total: { min: 1, max: 2 ** 32 - 1 }
};
        }
        get supportsVideoRotationMetadata() {
          return true;
        }
_createMuxer(output) {
          return new IsobmffMuxer(output, this);
        }
      }
      class Mp4OutputFormat extends IsobmffOutputFormat {
constructor(options) {
          super(options);
        }
get _name() {
          return "MP4";
        }
        get fileExtension() {
          return ".mp4";
        }
        get mimeType() {
          return "video/mp4";
        }
        getSupportedCodecs() {
          return [
            ...VIDEO_CODECS,
            ...NON_PCM_AUDIO_CODECS,
"pcm-s16",
            "pcm-s16be",
            "pcm-s24",
            "pcm-s24be",
            "pcm-s32",
            "pcm-s32be",
            "pcm-f32",
            "pcm-f32be",
            "pcm-f64",
            "pcm-f64be",
            ...SUBTITLE_CODECS
          ];
        }
_codecUnsupportedHint(codec) {
          if (new MovOutputFormat().getSupportedCodecs().includes(codec)) {
            return " Switching to MOV will grant support for this codec.";
          }
          return "";
        }
      }
      class MovOutputFormat extends IsobmffOutputFormat {
constructor(options) {
          super(options);
        }
get _name() {
          return "MOV";
        }
        get fileExtension() {
          return ".mov";
        }
        get mimeType() {
          return "video/quicktime";
        }
        getSupportedCodecs() {
          return [
            ...VIDEO_CODECS,
            ...AUDIO_CODECS
          ];
        }
_codecUnsupportedHint(codec) {
          if (new Mp4OutputFormat().getSupportedCodecs().includes(codec)) {
            return " Switching to MP4 will grant support for this codec.";
          }
          return "";
        }
      }
      class Mp3OutputFormat extends OutputFormat {
constructor(options = {}) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (options.xingHeader !== void 0 && typeof options.xingHeader !== "boolean") {
            throw new TypeError("options.xingHeader, when provided, must be a boolean.");
          }
          if (options.onXingFrame !== void 0 && typeof options.onXingFrame !== "function") {
            throw new TypeError("options.onXingFrame, when provided, must be a function.");
          }
          super();
          this._options = options;
        }
_createMuxer(output) {
          return new Mp3Muxer(output, this);
        }
get _name() {
          return "MP3";
        }
        getSupportedTrackCounts() {
          return {
            video: { min: 0, max: 0 },
            audio: { min: 1, max: 1 },
            subtitle: { min: 0, max: 0 },
            total: { min: 1, max: 1 }
          };
        }
        get fileExtension() {
          return ".mp3";
        }
        get mimeType() {
          return "audio/mpeg";
        }
        getSupportedCodecs() {
          return ["mp3"];
        }
        get supportsVideoRotationMetadata() {
          return false;
        }
      }
const validateVideoEncodingConfig = (config) => {
        if (!config || typeof config !== "object") {
          throw new TypeError("Encoding config must be an object.");
        }
        if (!VIDEO_CODECS.includes(config.codec)) {
          throw new TypeError(`Invalid video codec '${config.codec}'. Must be one of: ${VIDEO_CODECS.join(", ")}.`);
        }
        if (!(config.bitrate instanceof Quality) && (!Number.isInteger(config.bitrate) || config.bitrate <= 0)) {
          throw new TypeError("config.bitrate must be a positive integer or a quality.");
        }
        if (config.keyFrameInterval !== void 0 && (!Number.isFinite(config.keyFrameInterval) || config.keyFrameInterval < 0)) {
          throw new TypeError("config.keyFrameInterval, when provided, must be a non-negative number.");
        }
        if (config.sizeChangeBehavior !== void 0 && !["deny", "passThrough", "fill", "contain", "cover"].includes(config.sizeChangeBehavior)) {
          throw new TypeError("config.sizeChangeBehavior, when provided, must be 'deny', 'passThrough', 'fill', 'contain' or 'cover'.");
        }
        if (config.onEncodedPacket !== void 0 && typeof config.onEncodedPacket !== "function") {
          throw new TypeError("config.onEncodedChunk, when provided, must be a function.");
        }
        if (config.onEncoderConfig !== void 0 && typeof config.onEncoderConfig !== "function") {
          throw new TypeError("config.onEncoderConfig, when provided, must be a function.");
        }
        validateVideoEncodingAdditionalOptions(config.codec, config);
      };
      const validateVideoEncodingAdditionalOptions = (codec, options) => {
        if (!options || typeof options !== "object") {
          throw new TypeError("Encoding options must be an object.");
        }
        if (options.bitrateMode !== void 0 && !["constant", "variable"].includes(options.bitrateMode)) {
          throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
        }
        if (options.latencyMode !== void 0 && !["quality", "realtime"].includes(options.latencyMode)) {
          throw new TypeError("latencyMode, when provided, must be 'quality' or 'realtime'.");
        }
        if (options.fullCodecString !== void 0 && typeof options.fullCodecString !== "string") {
          throw new TypeError("fullCodecString, when provided, must be a string.");
        }
        if (options.fullCodecString !== void 0 && inferCodecFromCodecString(options.fullCodecString) !== codec) {
          throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${codec}).`);
        }
        if (options.hardwareAcceleration !== void 0 && !["no-preference", "prefer-hardware", "prefer-software"].includes(options.hardwareAcceleration)) {
          throw new TypeError("hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.");
        }
        if (options.scalabilityMode !== void 0 && typeof options.scalabilityMode !== "string") {
          throw new TypeError("scalabilityMode, when provided, must be a string.");
        }
        if (options.contentHint !== void 0 && typeof options.contentHint !== "string") {
          throw new TypeError("contentHint, when provided, must be a string.");
        }
      };
      const buildVideoEncoderConfig = (options) => {
        const resolvedBitrate = options.bitrate instanceof Quality ? options.bitrate._toVideoBitrate(options.codec, options.width, options.height) : options.bitrate;
        return {
          codec: options.fullCodecString ?? buildVideoCodecString(options.codec, options.width, options.height, resolvedBitrate),
          width: options.width,
          height: options.height,
          bitrate: resolvedBitrate,
          bitrateMode: options.bitrateMode,
          framerate: options.framerate,
latencyMode: options.latencyMode,
          hardwareAcceleration: options.hardwareAcceleration,
          scalabilityMode: options.scalabilityMode,
          contentHint: options.contentHint,
          ...getVideoEncoderConfigExtension(options.codec)
        };
      };
      const validateAudioEncodingConfig = (config) => {
        if (!config || typeof config !== "object") {
          throw new TypeError("Encoding config must be an object.");
        }
        if (!AUDIO_CODECS.includes(config.codec)) {
          throw new TypeError(`Invalid audio codec '${config.codec}'. Must be one of: ${AUDIO_CODECS.join(", ")}.`);
        }
        if (config.bitrate === void 0 && (!PCM_AUDIO_CODECS.includes(config.codec) || config.codec === "flac")) {
          throw new TypeError("config.bitrate must be provided for compressed audio codecs.");
        }
        if (config.bitrate !== void 0 && !(config.bitrate instanceof Quality) && (!Number.isInteger(config.bitrate) || config.bitrate <= 0)) {
          throw new TypeError("config.bitrate, when provided, must be a positive integer or a quality.");
        }
        if (config.onEncodedPacket !== void 0 && typeof config.onEncodedPacket !== "function") {
          throw new TypeError("config.onEncodedChunk, when provided, must be a function.");
        }
        if (config.onEncoderConfig !== void 0 && typeof config.onEncoderConfig !== "function") {
          throw new TypeError("config.onEncoderConfig, when provided, must be a function.");
        }
        validateAudioEncodingAdditionalOptions(config.codec, config);
      };
      const validateAudioEncodingAdditionalOptions = (codec, options) => {
        if (!options || typeof options !== "object") {
          throw new TypeError("Encoding options must be an object.");
        }
        if (options.bitrateMode !== void 0 && !["constant", "variable"].includes(options.bitrateMode)) {
          throw new TypeError("bitrateMode, when provided, must be 'constant' or 'variable'.");
        }
        if (options.fullCodecString !== void 0 && typeof options.fullCodecString !== "string") {
          throw new TypeError("fullCodecString, when provided, must be a string.");
        }
        if (options.fullCodecString !== void 0 && inferCodecFromCodecString(options.fullCodecString) !== codec) {
          throw new TypeError(`fullCodecString, when provided, must be a string that matches the specified codec (${codec}).`);
        }
      };
      const buildAudioEncoderConfig = (options) => {
        const resolvedBitrate = options.bitrate instanceof Quality ? options.bitrate._toAudioBitrate(options.codec) : options.bitrate;
        return {
          codec: options.fullCodecString ?? buildAudioCodecString(options.codec, options.numberOfChannels, options.sampleRate),
          numberOfChannels: options.numberOfChannels,
          sampleRate: options.sampleRate,
          bitrate: resolvedBitrate,
          bitrateMode: options.bitrateMode,
          ...getAudioEncoderConfigExtension(options.codec)
        };
      };
      class Quality {
constructor(factor) {
          this._factor = factor;
        }
_toVideoBitrate(codec, width, height) {
          const pixels = width * height;
          const codecEfficiencyFactors = {
            avc: 1,
hevc: 0.6,
vp9: 0.6,
av1: 0.4,
vp8: 1.2
};
          const referencePixels = 1920 * 1080;
          const referenceBitrate = 3e6;
          const scaleFactor = Math.pow(pixels / referencePixels, 0.95);
          const baseBitrate = referenceBitrate * scaleFactor;
          const codecAdjustedBitrate = baseBitrate * codecEfficiencyFactors[codec];
          const finalBitrate = codecAdjustedBitrate * this._factor;
          return Math.ceil(finalBitrate / 1e3) * 1e3;
        }
_toAudioBitrate(codec) {
          if (PCM_AUDIO_CODECS.includes(codec) || codec === "flac") {
            return void 0;
          }
          const baseRates = {
            aac: 128e3,
opus: 64e3,
mp3: 16e4,
vorbis: 64e3
};
          const baseBitrate = baseRates[codec];
          if (!baseBitrate) {
            throw new Error(`Unhandled codec: ${codec}`);
          }
          let finalBitrate = baseBitrate * this._factor;
          if (codec === "aac") {
            const validRates = [96e3, 128e3, 16e4, 192e3];
            finalBitrate = validRates.reduce((prev, curr) => Math.abs(curr - finalBitrate) < Math.abs(prev - finalBitrate) ? curr : prev);
          } else if (codec === "opus" || codec === "vorbis") {
            finalBitrate = Math.max(6e3, finalBitrate);
          } else if (codec === "mp3") {
            const validRates = [
              8e3,
              16e3,
              24e3,
              32e3,
              4e4,
              48e3,
              64e3,
              8e4,
              96e3,
              112e3,
              128e3,
              16e4,
              192e3,
              224e3,
              256e3,
              32e4
            ];
            finalBitrate = validRates.reduce((prev, curr) => Math.abs(curr - finalBitrate) < Math.abs(prev - finalBitrate) ? curr : prev);
          }
          return Math.round(finalBitrate / 1e3) * 1e3;
        }
      }
      const QUALITY_HIGH = new Quality(2);
      const canEncodeVideo = async (codec, options = {}) => {
        const { width = 1280, height = 720, bitrate = 1e6, ...restOptions } = options;
        if (!VIDEO_CODECS.includes(codec)) {
          return false;
        }
        if (!Number.isInteger(width) || width <= 0) {
          throw new TypeError("width must be a positive integer.");
        }
        if (!Number.isInteger(height) || height <= 0) {
          throw new TypeError("height must be a positive integer.");
        }
        if (!(bitrate instanceof Quality) && (!Number.isInteger(bitrate) || bitrate <= 0)) {
          throw new TypeError("bitrate must be a positive integer or a quality.");
        }
        validateVideoEncodingAdditionalOptions(codec, restOptions);
        let encoderConfig = null;
        if (customVideoEncoders.length > 0) {
          encoderConfig ??= buildVideoEncoderConfig({
            codec,
            width,
            height,
            bitrate,
            framerate: void 0,
            ...restOptions
          });
          if (customVideoEncoders.some((x) => x.supports(codec, encoderConfig))) {
            return true;
          }
        }
        if (typeof VideoEncoder === "undefined") {
          return false;
        }
        encoderConfig ??= buildVideoEncoderConfig({
          codec,
          width,
          height,
          bitrate,
          framerate: void 0,
          ...restOptions
        });
        const support = await VideoEncoder.isConfigSupported(encoderConfig);
        return support.supported === true;
      };
      const canEncodeAudio = async (codec, options = {}) => {
        const { numberOfChannels = 2, sampleRate = 48e3, bitrate = 128e3, ...restOptions } = options;
        if (!AUDIO_CODECS.includes(codec)) {
          return false;
        }
        if (!Number.isInteger(numberOfChannels) || numberOfChannels <= 0) {
          throw new TypeError("numberOfChannels must be a positive integer.");
        }
        if (!Number.isInteger(sampleRate) || sampleRate <= 0) {
          throw new TypeError("sampleRate must be a positive integer.");
        }
        if (!(bitrate instanceof Quality) && (!Number.isInteger(bitrate) || bitrate <= 0)) {
          throw new TypeError("bitrate must be a positive integer.");
        }
        validateAudioEncodingAdditionalOptions(codec, restOptions);
        let encoderConfig = null;
        if (customAudioEncoders.length > 0) {
          encoderConfig ??= buildAudioEncoderConfig({
            codec,
            numberOfChannels,
            sampleRate,
            bitrate,
            ...restOptions
          });
          if (customAudioEncoders.some((x) => x.supports(codec, encoderConfig))) {
            return true;
          }
        }
        if (PCM_AUDIO_CODECS.includes(codec)) {
          return true;
        }
        if (typeof AudioEncoder === "undefined") {
          return false;
        }
        encoderConfig ??= buildAudioEncoderConfig({
          codec,
          numberOfChannels,
          sampleRate,
          bitrate,
          ...restOptions
        });
        const support = await AudioEncoder.isConfigSupported(encoderConfig);
        return support.supported === true;
      };
      const getEncodableAudioCodecs = async (checkedCodecs = AUDIO_CODECS, options) => {
        const bools = await Promise.all(checkedCodecs.map((codec) => canEncodeAudio(codec, options)));
        return checkedCodecs.filter((_, i) => bools[i]);
      };
      const getFirstEncodableVideoCodec = async (checkedCodecs, options) => {
        for (const codec of checkedCodecs) {
          if (await canEncodeVideo(codec, options)) {
            return codec;
          }
        }
        return null;
      };
class MediaSource {
        constructor() {
          this._connectedTrack = null;
          this._closingPromise = null;
          this._closed = false;
          this._timestampOffset = 0;
        }
_ensureValidAdd() {
          if (!this._connectedTrack) {
            throw new Error("Source is not connected to an output track.");
          }
          if (this._connectedTrack.output.state === "canceled") {
            throw new Error("Output has been canceled.");
          }
          if (this._connectedTrack.output.state === "finalizing" || this._connectedTrack.output.state === "finalized") {
            throw new Error("Output has been finalized.");
          }
          if (this._connectedTrack.output.state === "pending") {
            throw new Error("Output has not started.");
          }
          if (this._closed) {
            throw new Error("Source is closed.");
          }
        }
async _start() {
        }

async _flushAndClose(forceClose) {
        }
close() {
          if (this._closingPromise) {
            return;
          }
          const connectedTrack = this._connectedTrack;
          if (!connectedTrack) {
            throw new Error("Cannot call close without connecting the source to an output track.");
          }
          if (connectedTrack.output.state === "pending") {
            throw new Error("Cannot call close before output has been started.");
          }
          this._closingPromise = (async () => {
            await this._flushAndClose(false);
            this._closed = true;
            if (connectedTrack.output.state === "finalizing" || connectedTrack.output.state === "finalized") {
              return;
            }
            connectedTrack.output._muxer.onTrackClose(connectedTrack);
          })();
        }
async _flushOrWaitForOngoingClose(forceClose) {
          if (this._closingPromise) {
            return this._closingPromise;
          } else {
            return this._flushAndClose(forceClose);
          }
        }
      }
      class VideoSource extends MediaSource {
constructor(codec) {
          super();
          this._connectedTrack = null;
          if (!VIDEO_CODECS.includes(codec)) {
            throw new TypeError(`Invalid video codec '${codec}'. Must be one of: ${VIDEO_CODECS.join(", ")}.`);
          }
          this._codec = codec;
        }
      }
      class EncodedVideoPacketSource extends VideoSource {
constructor(codec) {
          super(codec);
        }
add(packet, meta) {
          if (!(packet instanceof EncodedPacket)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          if (packet.isMetadataOnly) {
            throw new TypeError("Metadata-only packets cannot be added.");
          }
          if (meta !== void 0 && (!meta || typeof meta !== "object")) {
            throw new TypeError("meta, when provided, must be an object.");
          }
          this._ensureValidAdd();
          return this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, packet, meta);
        }
      }
      class VideoEncoderWrapper {
        constructor(source2, encodingConfig) {
          this.source = source2;
          this.encodingConfig = encodingConfig;
          this.ensureEncoderPromise = null;
          this.encoderInitialized = false;
          this.encoder = null;
          this.muxer = null;
          this.lastMultipleOfKeyFrameInterval = -1;
          this.codedWidth = null;
          this.codedHeight = null;
          this.resizeCanvas = null;
          this.customEncoder = null;
          this.customEncoderCallSerializer = new CallSerializer();
          this.customEncoderQueueSize = 0;
          this.encoderError = null;
        }
        async add(videoSample, shouldClose, encodeOptions) {
          try {
            this.checkForEncoderError();
            this.source._ensureValidAdd();
            if (this.codedWidth !== null && this.codedHeight !== null) {
              if (videoSample.codedWidth !== this.codedWidth || videoSample.codedHeight !== this.codedHeight) {
                const sizeChangeBehavior = this.encodingConfig.sizeChangeBehavior ?? "deny";
                if (sizeChangeBehavior === "passThrough") {
                } else if (sizeChangeBehavior === "deny") {
                  throw new Error(`Video sample size must remain constant. Expected ${this.codedWidth}x${this.codedHeight}, got ${videoSample.codedWidth}x${videoSample.codedHeight}. To allow the sample size to change over time, set \`sizeChangeBehavior\` to a value other than 'strict' in the encoding options.`);
                } else {
                  let canvasIsNew = false;
                  if (!this.resizeCanvas) {
                    if (typeof document !== "undefined") {
                      this.resizeCanvas = document.createElement("canvas");
                      this.resizeCanvas.width = this.codedWidth;
                      this.resizeCanvas.height = this.codedHeight;
                    } else {
                      this.resizeCanvas = new OffscreenCanvas(this.codedWidth, this.codedHeight);
                    }
                    canvasIsNew = true;
                  }
                  const context = this.resizeCanvas.getContext("2d", {
                    alpha: isFirefox()
});
                  assert$1(context);
                  if (!canvasIsNew) {
                    if (isFirefox()) {
                      context.fillStyle = "black";
                      context.fillRect(0, 0, this.codedWidth, this.codedHeight);
                    } else {
                      context.clearRect(0, 0, this.codedWidth, this.codedHeight);
                    }
                  }
                  videoSample.drawWithFit(context, { fit: sizeChangeBehavior });
                  if (shouldClose) {
                    videoSample.close();
                  }
                  videoSample = new VideoSample(this.resizeCanvas, {
                    timestamp: videoSample.timestamp,
                    duration: videoSample.duration,
                    rotation: videoSample.rotation
                  });
                  shouldClose = true;
                }
              }
            } else {
              this.codedWidth = videoSample.codedWidth;
              this.codedHeight = videoSample.codedHeight;
            }
            if (!this.encoderInitialized) {
              if (!this.ensureEncoderPromise) {
                void this.ensureEncoder(videoSample);
              }
              if (!this.encoderInitialized) {
                await this.ensureEncoderPromise;
              }
            }
            assert$1(this.encoderInitialized);
            const keyFrameInterval = this.encodingConfig.keyFrameInterval ?? 5;
            const multipleOfKeyFrameInterval = Math.floor(videoSample.timestamp / keyFrameInterval);
            const finalEncodeOptions = {
              ...encodeOptions,
              keyFrame: encodeOptions?.keyFrame || keyFrameInterval === 0 || multipleOfKeyFrameInterval !== this.lastMultipleOfKeyFrameInterval
            };
            this.lastMultipleOfKeyFrameInterval = multipleOfKeyFrameInterval;
            if (this.customEncoder) {
              this.customEncoderQueueSize++;
              const clonedSample = videoSample.clone();
              const promise = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(clonedSample, finalEncodeOptions)).then(() => this.customEncoderQueueSize--).catch((error) => this.encoderError ??= error).finally(() => {
                clonedSample.close();
              });
              if (this.customEncoderQueueSize >= 4) {
                await promise;
              }
            } else {
              assert$1(this.encoder);
              const videoFrame = videoSample.toVideoFrame();
              this.encoder.encode(videoFrame, finalEncodeOptions);
              videoFrame.close();
              if (shouldClose) {
                videoSample.close();
              }
              if (this.encoder.encodeQueueSize >= 4) {
                await new Promise((resolve) => this.encoder.addEventListener("dequeue", resolve, { once: true }));
              }
            }
            await this.muxer.mutex.currentPromise;
          } finally {
            if (shouldClose) {
              videoSample.close();
            }
          }
        }
        async ensureEncoder(videoSample) {
          if (this.encoder) {
            return;
          }
          const encoderError = new Error();
          return this.ensureEncoderPromise = (async () => {
            const encoderConfig = buildVideoEncoderConfig({
              width: videoSample.codedWidth,
              height: videoSample.codedHeight,
              ...this.encodingConfig,
              framerate: this.source._connectedTrack?.metadata.frameRate
            });
            this.encodingConfig.onEncoderConfig?.(encoderConfig);
            const MatchingCustomEncoder = customVideoEncoders.find((x) => x.supports(this.encodingConfig.codec, encoderConfig));
            if (MatchingCustomEncoder) {
              this.customEncoder = new MatchingCustomEncoder();
              this.customEncoder.codec = this.encodingConfig.codec;
              this.customEncoder.config = encoderConfig;
              this.customEncoder.onPacket = (packet, meta) => {
                if (!(packet instanceof EncodedPacket)) {
                  throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
                }
                if (meta !== void 0 && (!meta || typeof meta !== "object")) {
                  throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
                }
                this.encodingConfig.onEncodedPacket?.(packet, meta);
                void this.muxer.addEncodedVideoPacket(this.source._connectedTrack, packet, meta);
              };
              await this.customEncoder.init();
            } else {
              if (typeof VideoEncoder === "undefined") {
                throw new Error("VideoEncoder is not supported by this browser.");
              }
              const support = await VideoEncoder.isConfigSupported(encoderConfig);
              if (!support.supported) {
                throw new Error(`This specific encoder configuration (${encoderConfig.codec}, ${encoderConfig.bitrate} bps, ${encoderConfig.width}x${encoderConfig.height}, hardware acceleration: ${encoderConfig.hardwareAcceleration ?? "no-preference"}) is not supported by this browser. Consider using another codec or changing your video parameters.`);
              }
              this.encoder = new VideoEncoder({
                output: (chunk, meta) => {
                  const packet = EncodedPacket.fromEncodedChunk(chunk);
                  this.encodingConfig.onEncodedPacket?.(packet, meta);
                  void this.muxer.addEncodedVideoPacket(this.source._connectedTrack, packet, meta);
                },
                error: (error) => {
                  error.stack = encoderError.stack;
                  this.encoderError ??= error;
                }
              });
              this.encoder.configure(encoderConfig);
            }
            assert$1(this.source._connectedTrack);
            this.muxer = this.source._connectedTrack.output._muxer;
            this.encoderInitialized = true;
          })();
        }
        async flushAndClose(forceClose) {
          if (!forceClose)
            this.checkForEncoderError();
          if (this.customEncoder) {
            if (!forceClose) {
              void this.customEncoderCallSerializer.call(() => this.customEncoder.flush());
            }
            await this.customEncoderCallSerializer.call(() => this.customEncoder.close());
          } else if (this.encoder) {
            if (!forceClose) {
              await this.encoder.flush();
            }
            if (this.encoder.state !== "closed") {
              this.encoder.close();
            }
          }
          if (!forceClose)
            this.checkForEncoderError();
        }
        getQueueSize() {
          if (this.customEncoder) {
            return this.customEncoderQueueSize;
          } else {
            return this.encoder?.encodeQueueSize ?? 0;
          }
        }
        checkForEncoderError() {
          if (this.encoderError) {
            this.encoderError.stack = new Error().stack;
            throw this.encoderError;
          }
        }
      }
      class VideoSampleSource extends VideoSource {
constructor(encodingConfig) {
          validateVideoEncodingConfig(encodingConfig);
          super(encodingConfig.codec);
          this._encoder = new VideoEncoderWrapper(this, encodingConfig);
        }
add(videoSample, encodeOptions) {
          if (!(videoSample instanceof VideoSample)) {
            throw new TypeError("videoSample must be a VideoSample.");
          }
          return this._encoder.add(videoSample, false, encodeOptions);
        }
_flushAndClose(forceClose) {
          return this._encoder.flushAndClose(forceClose);
        }
      }
      class AudioSource extends MediaSource {
constructor(codec) {
          super();
          this._connectedTrack = null;
          if (!AUDIO_CODECS.includes(codec)) {
            throw new TypeError(`Invalid audio codec '${codec}'. Must be one of: ${AUDIO_CODECS.join(", ")}.`);
          }
          this._codec = codec;
        }
      }
      class EncodedAudioPacketSource extends AudioSource {
constructor(codec) {
          super(codec);
        }
add(packet, meta) {
          if (!(packet instanceof EncodedPacket)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          if (packet.isMetadataOnly) {
            throw new TypeError("Metadata-only packets cannot be added.");
          }
          if (meta !== void 0 && (!meta || typeof meta !== "object")) {
            throw new TypeError("meta, when provided, must be an object.");
          }
          this._ensureValidAdd();
          return this._connectedTrack.output._muxer.addEncodedAudioPacket(this._connectedTrack, packet, meta);
        }
      }
      class AudioEncoderWrapper {
        constructor(source2, encodingConfig) {
          this.source = source2;
          this.encodingConfig = encodingConfig;
          this.ensureEncoderPromise = null;
          this.encoderInitialized = false;
          this.encoder = null;
          this.muxer = null;
          this.lastNumberOfChannels = null;
          this.lastSampleRate = null;
          this.isPcmEncoder = false;
          this.outputSampleSize = null;
          this.writeOutputValue = null;
          this.customEncoder = null;
          this.customEncoderCallSerializer = new CallSerializer();
          this.customEncoderQueueSize = 0;
          this.encoderError = null;
        }
        async add(audioSample, shouldClose) {
          try {
            this.checkForEncoderError();
            this.source._ensureValidAdd();
            if (this.lastNumberOfChannels !== null && this.lastSampleRate !== null) {
              if (audioSample.numberOfChannels !== this.lastNumberOfChannels || audioSample.sampleRate !== this.lastSampleRate) {
                throw new Error(`Audio parameters must remain constant. Expected ${this.lastNumberOfChannels} channels at ${this.lastSampleRate} Hz, got ${audioSample.numberOfChannels} channels at ${audioSample.sampleRate} Hz.`);
              }
            } else {
              this.lastNumberOfChannels = audioSample.numberOfChannels;
              this.lastSampleRate = audioSample.sampleRate;
            }
            if (!this.encoderInitialized) {
              if (!this.ensureEncoderPromise) {
                void this.ensureEncoder(audioSample);
              }
              if (!this.encoderInitialized) {
                await this.ensureEncoderPromise;
              }
            }
            assert$1(this.encoderInitialized);
            if (this.customEncoder) {
              this.customEncoderQueueSize++;
              const clonedSample = audioSample.clone();
              const promise = this.customEncoderCallSerializer.call(() => this.customEncoder.encode(clonedSample)).then(() => this.customEncoderQueueSize--).catch((error) => this.encoderError ??= error).finally(() => {
                clonedSample.close();
              });
              if (this.customEncoderQueueSize >= 4) {
                await promise;
              }
              await this.muxer.mutex.currentPromise;
            } else if (this.isPcmEncoder) {
              await this.doPcmEncoding(audioSample, shouldClose);
            } else {
              assert$1(this.encoder);
              const audioData = audioSample.toAudioData();
              this.encoder.encode(audioData);
              audioData.close();
              if (shouldClose) {
                audioSample.close();
              }
              if (this.encoder.encodeQueueSize >= 4) {
                await new Promise((resolve) => this.encoder.addEventListener("dequeue", resolve, { once: true }));
              }
              await this.muxer.mutex.currentPromise;
            }
          } finally {
            if (shouldClose) {
              audioSample.close();
            }
          }
        }
        async doPcmEncoding(audioSample, shouldClose) {
          assert$1(this.outputSampleSize);
          assert$1(this.writeOutputValue);
          const { numberOfChannels, numberOfFrames, sampleRate, timestamp } = audioSample;
          const CHUNK_SIZE2 = 2048;
          const outputs = [];
          for (let frame = 0; frame < numberOfFrames; frame += CHUNK_SIZE2) {
            const frameCount = Math.min(CHUNK_SIZE2, audioSample.numberOfFrames - frame);
            const outputSize = frameCount * numberOfChannels * this.outputSampleSize;
            const outputBuffer = new ArrayBuffer(outputSize);
            const outputView = new DataView(outputBuffer);
            outputs.push({ frameCount, view: outputView });
          }
          const allocationSize = audioSample.allocationSize({ planeIndex: 0, format: "f32-planar" });
          const floats = new Float32Array(allocationSize / Float32Array.BYTES_PER_ELEMENT);
          for (let i = 0; i < numberOfChannels; i++) {
            audioSample.copyTo(floats, { planeIndex: i, format: "f32-planar" });
            for (let j = 0; j < outputs.length; j++) {
              const { frameCount, view: view2 } = outputs[j];
              for (let k = 0; k < frameCount; k++) {
                this.writeOutputValue(view2, (k * numberOfChannels + i) * this.outputSampleSize, floats[j * CHUNK_SIZE2 + k]);
              }
            }
          }
          if (shouldClose) {
            audioSample.close();
          }
          const meta = {
            decoderConfig: {
              codec: this.encodingConfig.codec,
              numberOfChannels,
              sampleRate
            }
          };
          for (let i = 0; i < outputs.length; i++) {
            const { frameCount, view: view2 } = outputs[i];
            const outputBuffer = view2.buffer;
            const startFrame = i * CHUNK_SIZE2;
            const packet = new EncodedPacket(new Uint8Array(outputBuffer), "key", timestamp + startFrame / sampleRate, frameCount / sampleRate);
            this.encodingConfig.onEncodedPacket?.(packet, meta);
            await this.muxer.addEncodedAudioPacket(this.source._connectedTrack, packet, meta);
          }
        }
        ensureEncoder(audioSample) {
          if (this.encoderInitialized) {
            return;
          }
          const encoderError = new Error();
          return this.ensureEncoderPromise = (async () => {
            const { numberOfChannels, sampleRate } = audioSample;
            const encoderConfig = buildAudioEncoderConfig({
              numberOfChannels,
              sampleRate,
              ...this.encodingConfig
            });
            this.encodingConfig.onEncoderConfig?.(encoderConfig);
            const MatchingCustomEncoder = customAudioEncoders.find((x) => x.supports(this.encodingConfig.codec, encoderConfig));
            if (MatchingCustomEncoder) {
              this.customEncoder = new MatchingCustomEncoder();
              this.customEncoder.codec = this.encodingConfig.codec;
              this.customEncoder.config = encoderConfig;
              this.customEncoder.onPacket = (packet, meta) => {
                if (!(packet instanceof EncodedPacket)) {
                  throw new TypeError("The first argument passed to onPacket must be an EncodedPacket.");
                }
                if (meta !== void 0 && (!meta || typeof meta !== "object")) {
                  throw new TypeError("The second argument passed to onPacket must be an object or undefined.");
                }
                this.encodingConfig.onEncodedPacket?.(packet, meta);
                void this.muxer.addEncodedAudioPacket(this.source._connectedTrack, packet, meta);
              };
              await this.customEncoder.init();
            } else if (PCM_AUDIO_CODECS.includes(this.encodingConfig.codec)) {
              this.initPcmEncoder();
            } else {
              if (typeof AudioEncoder === "undefined") {
                throw new Error("AudioEncoder is not supported by this browser.");
              }
              const support = await AudioEncoder.isConfigSupported(encoderConfig);
              if (!support.supported) {
                throw new Error(`This specific encoder configuration (${encoderConfig.codec}, ${encoderConfig.bitrate} bps, ${encoderConfig.numberOfChannels} channels, ${encoderConfig.sampleRate} Hz) is not supported by this browser. Consider using another codec or changing your audio parameters.`);
              }
              this.encoder = new AudioEncoder({
                output: (chunk, meta) => {
                  const packet = EncodedPacket.fromEncodedChunk(chunk);
                  this.encodingConfig.onEncodedPacket?.(packet, meta);
                  void this.muxer.addEncodedAudioPacket(this.source._connectedTrack, packet, meta);
                },
                error: (error) => {
                  error.stack = encoderError.stack;
                  this.encoderError ??= error;
                }
              });
              this.encoder.configure(encoderConfig);
            }
            assert$1(this.source._connectedTrack);
            this.muxer = this.source._connectedTrack.output._muxer;
            this.encoderInitialized = true;
          })();
        }
        initPcmEncoder() {
          this.isPcmEncoder = true;
          const codec = this.encodingConfig.codec;
          const { dataType, sampleSize, littleEndian } = parsePcmCodec(codec);
          this.outputSampleSize = sampleSize;
          switch (sampleSize) {
            case 1:
              {
                if (dataType === "unsigned") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setUint8(byteOffset, clamp((value + 1) * 127.5, 0, 255));
                } else if (dataType === "signed") {
                  this.writeOutputValue = (view2, byteOffset, value) => {
                    view2.setInt8(byteOffset, clamp(Math.round(value * 128), -128, 127));
                  };
                } else if (dataType === "ulaw") {
                  this.writeOutputValue = (view2, byteOffset, value) => {
                    const int16 = clamp(Math.floor(value * 32767), -32768, 32767);
                    view2.setUint8(byteOffset, toUlaw(int16));
                  };
                } else if (dataType === "alaw") {
                  this.writeOutputValue = (view2, byteOffset, value) => {
                    const int16 = clamp(Math.floor(value * 32767), -32768, 32767);
                    view2.setUint8(byteOffset, toAlaw(int16));
                  };
                } else {
                  assert$1(false);
                }
              }
              break;
            case 2:
              {
                if (dataType === "unsigned") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setUint16(byteOffset, clamp((value + 1) * 32767.5, 0, 65535), littleEndian);
                } else if (dataType === "signed") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setInt16(byteOffset, clamp(Math.round(value * 32767), -32768, 32767), littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            case 3:
              {
                if (dataType === "unsigned") {
                  this.writeOutputValue = (view2, byteOffset, value) => setUint24(view2, byteOffset, clamp((value + 1) * 83886075e-1, 0, 16777215), littleEndian);
                } else if (dataType === "signed") {
                  this.writeOutputValue = (view2, byteOffset, value) => setInt24(view2, byteOffset, clamp(Math.round(value * 8388607), -8388608, 8388607), littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            case 4:
              {
                if (dataType === "unsigned") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setUint32(byteOffset, clamp((value + 1) * 21474836475e-1, 0, 4294967295), littleEndian);
                } else if (dataType === "signed") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setInt32(byteOffset, clamp(Math.round(value * 2147483647), -2147483648, 2147483647), littleEndian);
                } else if (dataType === "float") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setFloat32(byteOffset, value, littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            case 8:
              {
                if (dataType === "float") {
                  this.writeOutputValue = (view2, byteOffset, value) => view2.setFloat64(byteOffset, value, littleEndian);
                } else {
                  assert$1(false);
                }
              }
              break;
            default: {
              assertNever(sampleSize);
              assert$1(false);
            }
          }
        }
        async flushAndClose(forceClose) {
          if (!forceClose)
            this.checkForEncoderError();
          if (this.customEncoder) {
            if (!forceClose) {
              void this.customEncoderCallSerializer.call(() => this.customEncoder.flush());
            }
            await this.customEncoderCallSerializer.call(() => this.customEncoder.close());
          } else if (this.encoder) {
            if (!forceClose) {
              await this.encoder.flush();
            }
            if (this.encoder.state !== "closed") {
              this.encoder.close();
            }
          }
          if (!forceClose)
            this.checkForEncoderError();
        }
        getQueueSize() {
          if (this.customEncoder) {
            return this.customEncoderQueueSize;
          } else if (this.isPcmEncoder) {
            return 0;
          } else {
            return this.encoder?.encodeQueueSize ?? 0;
          }
        }
        checkForEncoderError() {
          if (this.encoderError) {
            this.encoderError.stack = new Error().stack;
            throw this.encoderError;
          }
        }
      }
      class AudioSampleSource extends AudioSource {
constructor(encodingConfig) {
          validateAudioEncodingConfig(encodingConfig);
          super(encodingConfig.codec);
          this._encoder = new AudioEncoderWrapper(this, encodingConfig);
        }
add(audioSample) {
          if (!(audioSample instanceof AudioSample)) {
            throw new TypeError("audioSample must be an AudioSample.");
          }
          return this._encoder.add(audioSample, false);
        }
_flushAndClose(forceClose) {
          return this._encoder.flushAndClose(forceClose);
        }
      }
      class AudioBufferSource extends AudioSource {
constructor(encodingConfig) {
          validateAudioEncodingConfig(encodingConfig);
          super(encodingConfig.codec);
          this._accumulatedTime = 0;
          this._encoder = new AudioEncoderWrapper(this, encodingConfig);
        }
async add(audioBuffer) {
          if (!(audioBuffer instanceof AudioBuffer)) {
            throw new TypeError("audioBuffer must be an AudioBuffer.");
          }
          const iterator = AudioSample._fromAudioBuffer(audioBuffer, this._accumulatedTime);
          this._accumulatedTime += audioBuffer.duration;
          for (const audioSample of iterator) {
            await this._encoder.add(audioSample, true);
          }
        }
_flushAndClose(forceClose) {
          return this._encoder.flushAndClose(forceClose);
        }
      }
      class SubtitleSource extends MediaSource {
constructor(codec) {
          super();
          this._connectedTrack = null;
          if (!SUBTITLE_CODECS.includes(codec)) {
            throw new TypeError(`Invalid subtitle codec '${codec}'. Must be one of: ${SUBTITLE_CODECS.join(", ")}.`);
          }
          this._codec = codec;
        }
      }
const ALL_TRACK_TYPES = ["video", "audio", "subtitle"];
      const validateBaseTrackMetadata = (metadata) => {
        if (!metadata || typeof metadata !== "object") {
          throw new TypeError("metadata must be an object.");
        }
        if (metadata.languageCode !== void 0 && !isIso639Dash2LanguageCode(metadata.languageCode)) {
          throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
        }
        if (metadata.name !== void 0 && typeof metadata.name !== "string") {
          throw new TypeError("metadata.name, when provided, must be a string.");
        }
        if (metadata.maximumPacketCount !== void 0 && (!Number.isInteger(metadata.maximumPacketCount) || metadata.maximumPacketCount < 0)) {
          throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
        }
      };
      class Output {
constructor(options) {
          this.state = "pending";
          this._tracks = [];
          this._startPromise = null;
          this._cancelPromise = null;
          this._finalizePromise = null;
          this._mutex = new AsyncMutex();
          this._metadataTags = {};
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!(options.format instanceof OutputFormat)) {
            throw new TypeError("options.format must be an OutputFormat.");
          }
          if (!(options.target instanceof Target)) {
            throw new TypeError("options.target must be a Target.");
          }
          if (options.target._output) {
            throw new Error("Target is already used for another output.");
          }
          options.target._output = this;
          this.format = options.format;
          this.target = options.target;
          this._writer = options.target._createWriter();
          this._muxer = options.format._createMuxer(this);
        }
addVideoTrack(source2, metadata = {}) {
          if (!(source2 instanceof VideoSource)) {
            throw new TypeError("source must be a VideoSource.");
          }
          validateBaseTrackMetadata(metadata);
          if (metadata.rotation !== void 0 && ![0, 90, 180, 270].includes(metadata.rotation)) {
            throw new TypeError(`Invalid video rotation: ${metadata.rotation}. Has to be 0, 90, 180 or 270.`);
          }
          if (!this.format.supportsVideoRotationMetadata && metadata.rotation) {
            throw new Error(`${this.format._name} does not support video rotation metadata.`);
          }
          if (metadata.frameRate !== void 0 && (!Number.isFinite(metadata.frameRate) || metadata.frameRate <= 0)) {
            throw new TypeError(`Invalid video frame rate: ${metadata.frameRate}. Must be a positive number.`);
          }
          this._addTrack("video", source2, metadata);
        }
addAudioTrack(source2, metadata = {}) {
          if (!(source2 instanceof AudioSource)) {
            throw new TypeError("source must be an AudioSource.");
          }
          validateBaseTrackMetadata(metadata);
          this._addTrack("audio", source2, metadata);
        }
addSubtitleTrack(source2, metadata = {}) {
          if (!(source2 instanceof SubtitleSource)) {
            throw new TypeError("source must be a SubtitleSource.");
          }
          validateBaseTrackMetadata(metadata);
          this._addTrack("subtitle", source2, metadata);
        }
setMetadataTags(tags) {
          validateMetadataTags(tags);
          if (this.state !== "pending") {
            throw new Error("Cannot set metadata tags after output has been started or canceled.");
          }
          this._metadataTags = tags;
        }
_addTrack(type, source2, metadata) {
          if (this.state !== "pending") {
            throw new Error("Cannot add track after output has been started or canceled.");
          }
          if (source2._connectedTrack) {
            throw new Error("Source is already used for a track.");
          }
          const supportedTrackCounts = this.format.getSupportedTrackCounts();
          const presentTracksOfThisType = this._tracks.reduce((count, track2) => count + (track2.type === type ? 1 : 0), 0);
          const maxCount = supportedTrackCounts[type].max;
          if (presentTracksOfThisType === maxCount) {
            throw new Error(maxCount === 0 ? `${this.format._name} does not support ${type} tracks.` : `${this.format._name} does not support more than ${maxCount} ${type} track${maxCount === 1 ? "" : "s"}.`);
          }
          const maxTotalCount = supportedTrackCounts.total.max;
          if (this._tracks.length === maxTotalCount) {
            throw new Error(`${this.format._name} does not support more than ${maxTotalCount} tracks${maxTotalCount === 1 ? "" : "s"} in total.`);
          }
          const track = {
            id: this._tracks.length + 1,
            output: this,
            type,
            source: source2,
            metadata
          };
          if (track.type === "video") {
            const supportedVideoCodecs = this.format.getSupportedVideoCodecs();
            if (supportedVideoCodecs.length === 0) {
              throw new Error(`${this.format._name} does not support video tracks.` + this.format._codecUnsupportedHint(track.source._codec));
            } else if (!supportedVideoCodecs.includes(track.source._codec)) {
              throw new Error(`Codec '${track.source._codec}' cannot be contained within ${this.format._name}. Supported video codecs are: ${supportedVideoCodecs.map((codec) => `'${codec}'`).join(", ")}.` + this.format._codecUnsupportedHint(track.source._codec));
            }
          } else if (track.type === "audio") {
            const supportedAudioCodecs = this.format.getSupportedAudioCodecs();
            if (supportedAudioCodecs.length === 0) {
              throw new Error(`${this.format._name} does not support audio tracks.` + this.format._codecUnsupportedHint(track.source._codec));
            } else if (!supportedAudioCodecs.includes(track.source._codec)) {
              throw new Error(`Codec '${track.source._codec}' cannot be contained within ${this.format._name}. Supported audio codecs are: ${supportedAudioCodecs.map((codec) => `'${codec}'`).join(", ")}.` + this.format._codecUnsupportedHint(track.source._codec));
            }
          } else if (track.type === "subtitle") {
            const supportedSubtitleCodecs = this.format.getSupportedSubtitleCodecs();
            if (supportedSubtitleCodecs.length === 0) {
              throw new Error(`${this.format._name} does not support subtitle tracks.` + this.format._codecUnsupportedHint(track.source._codec));
            } else if (!supportedSubtitleCodecs.includes(track.source._codec)) {
              throw new Error(`Codec '${track.source._codec}' cannot be contained within ${this.format._name}. Supported subtitle codecs are: ${supportedSubtitleCodecs.map((codec) => `'${codec}'`).join(", ")}.` + this.format._codecUnsupportedHint(track.source._codec));
            }
          }
          this._tracks.push(track);
          source2._connectedTrack = track;
        }
async start() {
          const supportedTrackCounts = this.format.getSupportedTrackCounts();
          for (const trackType of ALL_TRACK_TYPES) {
            const presentTracksOfThisType = this._tracks.reduce((count, track) => count + (track.type === trackType ? 1 : 0), 0);
            const minCount = supportedTrackCounts[trackType].min;
            if (presentTracksOfThisType < minCount) {
              throw new Error(minCount === supportedTrackCounts[trackType].max ? `${this.format._name} requires exactly ${minCount} ${trackType} track${minCount === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${minCount} ${trackType} track${minCount === 1 ? "" : "s"}.`);
            }
          }
          const totalMinCount = supportedTrackCounts.total.min;
          if (this._tracks.length < totalMinCount) {
            throw new Error(totalMinCount === supportedTrackCounts.total.max ? `${this.format._name} requires exactly ${totalMinCount} track${totalMinCount === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${totalMinCount} track${totalMinCount === 1 ? "" : "s"}.`);
          }
          if (this.state === "canceled") {
            throw new Error("Output has been canceled.");
          }
          if (this._startPromise) {
            console.warn("Output has already been started.");
            return this._startPromise;
          }
          return this._startPromise = (async () => {
            this.state = "started";
            this._writer.start();
            const release = await this._mutex.acquire();
            await this._muxer.start();
            const promises = this._tracks.map((track) => track.source._start());
            await Promise.all(promises);
            release();
          })();
        }
getMimeType() {
          return this._muxer.getMimeType();
        }
async cancel() {
          if (this._cancelPromise) {
            console.warn("Output has already been canceled.");
            return this._cancelPromise;
          } else if (this.state === "finalizing" || this.state === "finalized") {
            console.warn("Output has already been finalized.");
            return;
          }
          return this._cancelPromise = (async () => {
            this.state = "canceled";
            const release = await this._mutex.acquire();
            const promises = this._tracks.map((x) => x.source._flushOrWaitForOngoingClose(true));
            await Promise.all(promises);
            await this._writer.close();
            release();
          })();
        }
async finalize() {
          if (this.state === "pending") {
            throw new Error("Cannot finalize before starting.");
          }
          if (this.state === "canceled") {
            throw new Error("Cannot finalize after canceling.");
          }
          if (this._finalizePromise) {
            console.warn("Output has already been finalized.");
            return this._finalizePromise;
          }
          return this._finalizePromise = (async () => {
            this.state = "finalizing";
            const release = await this._mutex.acquire();
            const promises = this._tracks.map((x) => x.source._flushOrWaitForOngoingClose(false));
            await Promise.all(promises);
            await this._muxer.finalize();
            await this._writer.flush();
            await this._writer.finalize();
            this.state = "finalized";
            release();
          })();
        }
      }
class Source {
        constructor() {
          this._sizePromise = null;
          this.onread = null;
        }
async getSizeOrNull() {
          return this._sizePromise ??= Promise.resolve(this._retrieveSize());
        }
async getSize() {
          const result = await this.getSizeOrNull();
          if (result === null) {
            throw new Error("Cannot determine the size of an unsized source.");
          }
          return result;
        }
      }
      class BlobSource extends Source {
constructor(blob, options = {}) {
          if (!(blob instanceof Blob)) {
            throw new TypeError("blob must be a Blob.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (options.maxCacheSize !== void 0 && (!Number.isInteger(options.maxCacheSize) || options.maxCacheSize < 0)) {
            throw new TypeError("options.maxCacheSize, when provided, must be a non-negative integer.");
          }
          super();
          this._readers = new WeakMap();
          this._blob = blob;
          this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 8 * 2 ** 20,
            maxWorkerCount: 4,
            runWorker: this._runWorker.bind(this),
            prefetchProfile: PREFETCH_PROFILES.fileSystem
          });
        }
_retrieveSize() {
          const size = this._blob.size;
          this._orchestrator.fileSize = size;
          return size;
        }
_read(start, end) {
          return this._orchestrator.read(start, end);
        }
async _runWorker(worker) {
          let reader = this._readers.get(worker);
          if (!reader) {
            reader = this._blob.slice(worker.currentPos).stream().getReader();
            this._readers.set(worker, reader);
          }
          while (worker.currentPos < worker.targetPos && !worker.aborted) {
            const { done, value } = await reader.read();
            if (done) {
              this._orchestrator.forgetWorker(worker);
              if (worker.currentPos < worker.targetPos) {
                throw new Error("Blob reader stopped unexpectedly before all requested data was read.");
              }
              break;
            }
            this.onread?.(worker.currentPos, worker.currentPos + value.length);
            this._orchestrator.supplyWorkerData(worker, value);
          }
          worker.running = false;
        }
get _supportsRandomAccess() {
          return true;
        }
      }
      const PREFETCH_PROFILES = {
        fileSystem: (start, end) => {
          const padding = 2 ** 16;
          start = Math.floor((start - padding) / padding) * padding;
          end = Math.ceil((end + padding) / padding) * padding;
          return { start, end };
        }
      };
      class ReadOrchestrator {
        constructor(options) {
          this.options = options;
          this.fileSize = null;
          this.nextAge = 0;
          this.workers = [];
          this.cache = [];
          this.currentCacheSize = 0;
        }
        read(innerStart, innerEnd) {
          assert$1(this.fileSize !== null);
          const prefetchRange = this.options.prefetchProfile(innerStart, innerEnd, this.workers);
          const outerStart = Math.max(prefetchRange.start, 0);
          const outerEnd = Math.min(prefetchRange.end, this.fileSize);
          assert$1(outerStart <= innerStart && innerEnd <= outerEnd);
          let result = null;
          const innerCacheStartIndex = binarySearchLessOrEqual(this.cache, innerStart, (x) => x.start);
          const innerStartEntry = innerCacheStartIndex !== -1 ? this.cache[innerCacheStartIndex] : null;
          if (innerStartEntry && innerStartEntry.start <= innerStart && innerEnd <= innerStartEntry.end) {
            innerStartEntry.age = this.nextAge++;
            result = {
              bytes: innerStartEntry.bytes,
              view: innerStartEntry.view,
              offset: innerStartEntry.start
            };
          }
          const outerCacheStartIndex = binarySearchLessOrEqual(this.cache, outerStart, (x) => x.start);
          const bytes2 = result ? null : new Uint8Array(innerEnd - innerStart);
          let contiguousBytesWriteEnd = 0;
          let lastEnd = outerStart;
          const outerHoles = [];
          if (outerCacheStartIndex !== -1) {
            for (let i = outerCacheStartIndex; i < this.cache.length; i++) {
              const entry = this.cache[i];
              if (entry.start >= outerEnd) {
                break;
              }
              if (entry.end <= outerStart) {
                continue;
              }
              const cappedOuterStart = Math.max(outerStart, entry.start);
              const cappedOuterEnd = Math.min(outerEnd, entry.end);
              assert$1(cappedOuterStart <= cappedOuterEnd);
              if (lastEnd < cappedOuterStart) {
                outerHoles.push({ start: lastEnd, end: cappedOuterStart });
              }
              lastEnd = cappedOuterEnd;
              if (bytes2) {
                const cappedInnerStart = Math.max(innerStart, entry.start);
                const cappedInnerEnd = Math.min(innerEnd, entry.end);
                if (cappedInnerStart < cappedInnerEnd) {
                  const relativeOffset = cappedInnerStart - innerStart;
                  bytes2.set(entry.bytes.subarray(cappedInnerStart - entry.start, cappedInnerEnd - entry.start), relativeOffset);
                  if (relativeOffset === contiguousBytesWriteEnd) {
                    contiguousBytesWriteEnd = cappedInnerEnd - innerStart;
                  }
                }
              }
              entry.age = this.nextAge++;
            }
            if (lastEnd < outerEnd) {
              outerHoles.push({ start: lastEnd, end: outerEnd });
            }
          } else {
            outerHoles.push({ start: outerStart, end: outerEnd });
          }
          if (bytes2 && contiguousBytesWriteEnd >= bytes2.length) {
            result = {
              bytes: bytes2,
              view: toDataView(bytes2),
              offset: innerStart
            };
          }
          if (outerHoles.length === 0) {
            assert$1(result);
            return result;
          }
          const { promise, resolve, reject } = promiseWithResolvers();
          const innerHoles = [];
          for (const outerHole of outerHoles) {
            const cappedStart = Math.max(innerStart, outerHole.start);
            const cappedEnd = Math.min(innerEnd, outerHole.end);
            if (cappedStart === outerHole.start && cappedEnd === outerHole.end) {
              innerHoles.push(outerHole);
            } else if (cappedStart < cappedEnd) {
              innerHoles.push({ start: cappedStart, end: cappedEnd });
            }
          }
          for (const outerHole of outerHoles) {
            const pendingSlice = bytes2 && {
              start: innerStart,
              bytes: bytes2,
              holes: innerHoles,
              resolve,
              reject
            };
            let workerFound = false;
            for (const worker of this.workers) {
              const gapTolerance = 2 ** 17;
              if (closedIntervalsOverlap(outerHole.start - gapTolerance, outerHole.start, worker.currentPos, worker.targetPos)) {
                worker.targetPos = Math.max(worker.targetPos, outerHole.end);
                workerFound = true;
                if (pendingSlice && !worker.pendingSlices.includes(pendingSlice)) {
                  worker.pendingSlices.push(pendingSlice);
                }
                if (!worker.running) {
                  this.runWorker(worker);
                }
                break;
              }
            }
            if (!workerFound) {
              const newWorker = this.createWorker(outerHole.start, outerHole.end);
              if (pendingSlice) {
                newWorker.pendingSlices = [pendingSlice];
              }
              this.runWorker(newWorker);
            }
          }
          if (!result) {
            assert$1(bytes2);
            result = promise.then((bytes3) => ({
              bytes: bytes3,
              view: toDataView(bytes3),
              offset: innerStart
            }));
          }
          return result;
        }
        createWorker(startPos, targetPos) {
          const worker = {
            startPos,
            currentPos: startPos,
            targetPos,
            running: false,
            aborted: false,
            pendingSlices: [],
            age: this.nextAge++
          };
          this.workers.push(worker);
          while (this.workers.length > this.options.maxWorkerCount) {
            let oldestIndex = 0;
            let oldestWorker = this.workers[0];
            for (let i = 1; i < this.workers.length; i++) {
              const worker2 = this.workers[i];
              if (worker2.age < oldestWorker.age) {
                oldestIndex = i;
                oldestWorker = worker2;
              }
            }
            if (oldestWorker.running && oldestWorker.pendingSlices.length > 0) {
              break;
            }
            oldestWorker.aborted = true;
            this.workers.splice(oldestIndex, 1);
          }
          return worker;
        }
        runWorker(worker) {
          assert$1(!worker.running);
          assert$1(worker.currentPos < worker.targetPos);
          worker.running = true;
          worker.age = this.nextAge++;
          void this.options.runWorker(worker).catch((error) => {
            worker.running = false;
            if (worker.pendingSlices.length > 0) {
              worker.pendingSlices.forEach((x) => x.reject(error));
              worker.pendingSlices.length = 0;
            } else {
              throw error;
            }
          });
        }
supplyWorkerData(worker, bytes2) {
          const start = worker.currentPos;
          const end = start + bytes2.length;
          this.insertIntoCache({
            start,
            end,
            bytes: bytes2,
            view: toDataView(bytes2),
            age: this.nextAge++
          });
          worker.currentPos += bytes2.length;
          worker.targetPos = Math.max(worker.targetPos, worker.currentPos);
          for (let i = 0; i < worker.pendingSlices.length; i++) {
            const pendingSlice = worker.pendingSlices[i];
            const clampedStart = Math.max(start, pendingSlice.start);
            const clampedEnd = Math.min(end, pendingSlice.start + pendingSlice.bytes.length);
            if (clampedStart < clampedEnd) {
              pendingSlice.bytes.set(bytes2.subarray(clampedStart - start, clampedEnd - start), clampedStart - pendingSlice.start);
            }
            for (let j = 0; j < pendingSlice.holes.length; j++) {
              const hole = pendingSlice.holes[j];
              if (start <= hole.start && end > hole.start) {
                hole.start = end;
              }
              if (hole.end <= hole.start) {
                pendingSlice.holes.splice(j, 1);
                j--;
              }
            }
            if (pendingSlice.holes.length === 0) {
              pendingSlice.resolve(pendingSlice.bytes);
              worker.pendingSlices.splice(i, 1);
              i--;
            }
          }
          for (let i = 0; i < this.workers.length; i++) {
            const otherWorker = this.workers[i];
            if (worker === otherWorker || otherWorker.running) {
              continue;
            }
            if (closedIntervalsOverlap(start, end, otherWorker.currentPos, otherWorker.targetPos)) {
              this.workers.splice(i, 1);
              i--;
            }
          }
        }
        forgetWorker(worker) {
          const index2 = this.workers.indexOf(worker);
          assert$1(index2 !== -1);
          this.workers.splice(index2, 1);
        }
        insertIntoCache(entry) {
          if (this.options.maxCacheSize === 0) {
            return;
          }
          let insertionIndex = binarySearchLessOrEqual(this.cache, entry.start, (x) => x.start) + 1;
          if (insertionIndex > 0) {
            const previous = this.cache[insertionIndex - 1];
            if (previous.end >= entry.end) {
              return;
            }
            if (previous.end > entry.start) {
              const joined = new Uint8Array(entry.end - previous.start);
              joined.set(previous.bytes, 0);
              joined.set(entry.bytes, entry.start - previous.start);
              this.currentCacheSize += entry.end - previous.end;
              previous.bytes = joined;
              previous.view = toDataView(joined);
              previous.end = entry.end;
              insertionIndex--;
              entry = previous;
            } else {
              this.cache.splice(insertionIndex, 0, entry);
              this.currentCacheSize += entry.bytes.length;
            }
          } else {
            this.cache.splice(insertionIndex, 0, entry);
            this.currentCacheSize += entry.bytes.length;
          }
          for (let i = insertionIndex + 1; i < this.cache.length; i++) {
            const next = this.cache[i];
            if (entry.end <= next.start) {
              break;
            }
            if (entry.end >= next.end) {
              this.cache.splice(i, 1);
              this.currentCacheSize -= next.bytes.length;
              i--;
              continue;
            }
            const joined = new Uint8Array(next.end - entry.start);
            joined.set(entry.bytes, 0);
            joined.set(next.bytes, next.start - entry.start);
            this.currentCacheSize -= entry.end - next.start;
            entry.bytes = joined;
            entry.view = toDataView(joined);
            entry.end = next.end;
            this.cache.splice(i, 1);
            break;
          }
          while (this.currentCacheSize > this.options.maxCacheSize) {
            let oldestIndex = 0;
            let oldestEntry = this.cache[0];
            for (let i = 1; i < this.cache.length; i++) {
              const entry2 = this.cache[i];
              if (entry2.age < oldestEntry.age) {
                oldestIndex = i;
                oldestEntry = entry2;
              }
            }
            if (this.currentCacheSize - oldestEntry.bytes.length <= this.options.maxCacheSize) {
              break;
            }
            this.cache.splice(oldestIndex, 1);
            this.currentCacheSize -= oldestEntry.bytes.length;
          }
        }
      }
class Mp3Demuxer extends Demuxer {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.firstFrameHeader = null;
          this.loadedSamples = [];
          this.metadataTags = null;
          this.tracks = [];
          this.readingMutex = new AsyncMutex();
          this.lastSampleLoaded = false;
          this.lastLoadedPos = 0;
          this.nextTimestampInSamples = 0;
          this.reader = input._reader;
        }
        async readMetadata() {
          return this.metadataPromise ??= (async () => {
            while (!this.firstFrameHeader && !this.lastSampleLoaded) {
              await this.advanceReader();
            }
            if (!this.firstFrameHeader) {
              throw new Error("No valid MP3 frame found.");
            }
            this.tracks = [new InputAudioTrack(new Mp3AudioTrackBacking(this))];
          })();
        }
        async advanceReader() {
          if (this.lastLoadedPos === 0) {
            while (true) {
              let slice2 = this.reader.requestSlice(this.lastLoadedPos, ID3_V2_HEADER_SIZE);
              if (slice2 instanceof Promise)
                slice2 = await slice2;
              if (!slice2) {
                this.lastSampleLoaded = true;
                return;
              }
              const id3V2Header = readId3V2Header(slice2);
              if (!id3V2Header) {
                break;
              }
              this.lastLoadedPos = slice2.filePos + id3V2Header.size;
            }
          }
          const result = await readNextFrameHeader(this.reader, this.lastLoadedPos, this.reader.fileSize);
          if (!result) {
            this.lastSampleLoaded = true;
            return;
          }
          const header = result.header;
          this.lastLoadedPos = result.startPos + header.totalSize - 1;
          const xingOffset = getXingOffset(header.mpegVersionId, header.channel);
          let slice = this.reader.requestSlice(result.startPos + xingOffset, 4);
          if (slice instanceof Promise)
            slice = await slice;
          if (slice) {
            const word = readU32Be(slice);
            const isXing = word === XING || word === INFO;
            if (isXing) {
              return;
            }
          }
          if (!this.firstFrameHeader) {
            this.firstFrameHeader = header;
          }
          if (header.sampleRate !== this.firstFrameHeader.sampleRate) {
            console.warn(`MP3 changed sample rate mid-file: ${this.firstFrameHeader.sampleRate} Hz to ${header.sampleRate} Hz. Might be a bug, so please report this file.`);
          }
          const sampleDuration = header.audioSamplesInFrame / this.firstFrameHeader.sampleRate;
          const sample = {
            timestamp: this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
            duration: sampleDuration,
            dataStart: result.startPos,
            dataSize: header.totalSize
          };
          this.loadedSamples.push(sample);
          this.nextTimestampInSamples += header.audioSamplesInFrame;
          return;
        }
        async getMimeType() {
          return "audio/mpeg";
        }
        async getTracks() {
          await this.readMetadata();
          return this.tracks;
        }
        async computeDuration() {
          await this.readMetadata();
          const track = this.tracks[0];
          assert$1(track);
          return track.computeDuration();
        }
        async getMetadataTags() {
          const release = await this.readingMutex.acquire();
          try {
            await this.readMetadata();
            if (this.metadataTags) {
              return this.metadataTags;
            }
            this.metadataTags = {};
            let currentPos = 0;
            let id3V2HeaderFound = false;
            while (true) {
              let headerSlice = this.reader.requestSlice(currentPos, ID3_V2_HEADER_SIZE);
              if (headerSlice instanceof Promise)
                headerSlice = await headerSlice;
              if (!headerSlice)
                break;
              const id3V2Header = readId3V2Header(headerSlice);
              if (!id3V2Header) {
                break;
              }
              id3V2HeaderFound = true;
              let contentSlice = this.reader.requestSlice(headerSlice.filePos, id3V2Header.size);
              if (contentSlice instanceof Promise)
                contentSlice = await contentSlice;
              if (!contentSlice)
                break;
              parseId3V2Tag(contentSlice, id3V2Header, this.metadataTags);
              currentPos = headerSlice.filePos + id3V2Header.size;
            }
            if (!id3V2HeaderFound && this.reader.fileSize !== null && this.reader.fileSize >= ID3_V1_TAG_SIZE) {
              let slice = this.reader.requestSlice(this.reader.fileSize - ID3_V1_TAG_SIZE, ID3_V1_TAG_SIZE);
              if (slice instanceof Promise)
                slice = await slice;
              assert$1(slice);
              const tag = readAscii(slice, 3);
              if (tag === "TAG") {
                parseId3V1Tag(slice, this.metadataTags);
              }
            }
            return this.metadataTags;
          } finally {
            release();
          }
        }
      }
      class Mp3AudioTrackBacking {
        constructor(demuxer) {
          this.demuxer = demuxer;
        }
        getId() {
          return 1;
        }
        async getFirstTimestamp() {
          return 0;
        }
        getTimeResolution() {
          assert$1(this.demuxer.firstFrameHeader);
          return this.demuxer.firstFrameHeader.sampleRate / this.demuxer.firstFrameHeader.audioSamplesInFrame;
        }
        async computeDuration() {
          const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
          return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
        }
        getName() {
          return null;
        }
        getLanguageCode() {
          return UNDETERMINED_LANGUAGE;
        }
        getCodec() {
          return "mp3";
        }
        getInternalCodecId() {
          return null;
        }
        getNumberOfChannels() {
          assert$1(this.demuxer.firstFrameHeader);
          return this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2;
        }
        getSampleRate() {
          assert$1(this.demuxer.firstFrameHeader);
          return this.demuxer.firstFrameHeader.sampleRate;
        }
        async getDecoderConfig() {
          assert$1(this.demuxer.firstFrameHeader);
          return {
            codec: "mp3",
            numberOfChannels: this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2,
            sampleRate: this.demuxer.firstFrameHeader.sampleRate
          };
        }
        async getPacketAtIndex(sampleIndex, options) {
          if (sampleIndex === -1) {
            return null;
          }
          const rawSample = this.demuxer.loadedSamples[sampleIndex];
          if (!rawSample) {
            return null;
          }
          let data;
          if (options.metadataOnly) {
            data = PLACEHOLDER_DATA;
          } else {
            let slice = this.demuxer.reader.requestSlice(rawSample.dataStart, rawSample.dataSize);
            if (slice instanceof Promise)
              slice = await slice;
            if (!slice) {
              return null;
            }
            data = readBytes(slice, rawSample.dataSize);
          }
          return new EncodedPacket(data, "key", rawSample.timestamp, rawSample.duration, sampleIndex, rawSample.dataSize);
        }
        getFirstPacket(options) {
          return this.getPacketAtIndex(0, options);
        }
        async getNextPacket(packet, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            const sampleIndex = binarySearchExact(this.demuxer.loadedSamples, packet.timestamp, (x) => x.timestamp);
            if (sampleIndex === -1) {
              throw new Error("Packet was not created from this track.");
            }
            const nextIndex = sampleIndex + 1;
            while (nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded) {
              await this.demuxer.advanceReader();
            }
            return this.getPacketAtIndex(nextIndex, options);
          } finally {
            release();
          }
        }
        async getPacket(timestamp, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            while (true) {
              const index2 = binarySearchLessOrEqual(this.demuxer.loadedSamples, timestamp, (x) => x.timestamp);
              if (index2 === -1 && this.demuxer.loadedSamples.length > 0) {
                return null;
              }
              if (this.demuxer.lastSampleLoaded) {
                return this.getPacketAtIndex(index2, options);
              }
              if (index2 >= 0 && index2 + 1 < this.demuxer.loadedSamples.length) {
                return this.getPacketAtIndex(index2, options);
              }
              await this.demuxer.advanceReader();
            }
          } finally {
            release();
          }
        }
        getKeyPacket(timestamp, options) {
          return this.getPacket(timestamp, options);
        }
        getNextKeyPacket(packet, options) {
          return this.getNextPacket(packet, options);
        }
      }
class InputFormat {
      }
      class Mp3InputFormat extends InputFormat {
async _canReadInput(input) {
          let slice = input._reader.requestSlice(0, 10);
          if (slice instanceof Promise)
            slice = await slice;
          if (!slice)
            return false;
          let currentPos = 0;
          let id3V2HeaderFound = false;
          while (true) {
            let slice2 = input._reader.requestSlice(currentPos, ID3_V2_HEADER_SIZE);
            if (slice2 instanceof Promise)
              slice2 = await slice2;
            if (!slice2)
              break;
            const id3V2Header = readId3V2Header(slice2);
            if (!id3V2Header) {
              break;
            }
            id3V2HeaderFound = true;
            currentPos = slice2.filePos + id3V2Header.size;
          }
          const firstResult = await readNextFrameHeader(input._reader, currentPos, currentPos + 4096);
          if (!firstResult) {
            return false;
          }
          if (id3V2HeaderFound) {
            return true;
          }
          currentPos = firstResult.startPos += firstResult.header.totalSize;
          const secondResult = await readNextFrameHeader(input._reader, currentPos, currentPos + FRAME_HEADER_SIZE$1);
          if (!secondResult) {
            return false;
          }
          const firstHeader = firstResult.header;
          const secondHeader = secondResult.header;
          if (firstHeader.channel !== secondHeader.channel || firstHeader.sampleRate !== secondHeader.sampleRate) {
            return false;
          }
          return true;
        }
_createDemuxer(input) {
          return new Mp3Demuxer(input);
        }
        get name() {
          return "MP3";
        }
        get mimeType() {
          return "audio/mpeg";
        }
      }
      const MP3 = new Mp3InputFormat();
class Input {
constructor(options) {
          this._demuxerPromise = null;
          this._format = null;
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!Array.isArray(options.formats) || options.formats.some((x) => !(x instanceof InputFormat))) {
            throw new TypeError("options.formats must be an array of InputFormat.");
          }
          if (!(options.source instanceof Source)) {
            throw new TypeError("options.source must be a Source.");
          }
          this._formats = options.formats;
          this._source = options.source;
          this._reader = new Reader(options.source);
        }
_getDemuxer() {
          return this._demuxerPromise ??= (async () => {
            this._reader.fileSize = await this._source.getSizeOrNull();
            for (const format of this._formats) {
              const canRead = await format._canReadInput(this);
              if (canRead) {
                this._format = format;
                return format._createDemuxer(this);
              }
            }
            throw new Error("Input has an unsupported or unrecognizable format.");
          })();
        }
get source() {
          return this._source;
        }
async getFormat() {
          await this._getDemuxer();
          assert$1(this._format);
          return this._format;
        }
async computeDuration() {
          const demuxer = await this._getDemuxer();
          return demuxer.computeDuration();
        }
async getTracks() {
          const demuxer = await this._getDemuxer();
          return demuxer.getTracks();
        }
async getVideoTracks() {
          const tracks = await this.getTracks();
          return tracks.filter((x) => x.isVideoTrack());
        }
async getAudioTracks() {
          const tracks = await this.getTracks();
          return tracks.filter((x) => x.isAudioTrack());
        }
async getPrimaryVideoTrack() {
          const tracks = await this.getTracks();
          return tracks.find((x) => x.isVideoTrack()) ?? null;
        }
async getPrimaryAudioTrack() {
          const tracks = await this.getTracks();
          return tracks.find((x) => x.isAudioTrack()) ?? null;
        }
async getMimeType() {
          const demuxer = await this._getDemuxer();
          return demuxer.getMimeType();
        }
async getMetadataTags() {
          const demuxer = await this._getDemuxer();
          return demuxer.getMetadataTags();
        }
      }
const validateVideoOptions = (videoOptions) => {
        if (videoOptions !== void 0 && (!videoOptions || typeof videoOptions !== "object")) {
          throw new TypeError("options.video, when provided, must be an object.");
        }
        if (videoOptions?.discard !== void 0 && typeof videoOptions.discard !== "boolean") {
          throw new TypeError("options.video.discard, when provided, must be a boolean.");
        }
        if (videoOptions?.forceTranscode !== void 0 && typeof videoOptions.forceTranscode !== "boolean") {
          throw new TypeError("options.video.forceTranscode, when provided, must be a boolean.");
        }
        if (videoOptions?.codec !== void 0 && !VIDEO_CODECS.includes(videoOptions.codec)) {
          throw new TypeError(`options.video.codec, when provided, must be one of: ${VIDEO_CODECS.join(", ")}.`);
        }
        if (videoOptions?.bitrate !== void 0 && !(videoOptions.bitrate instanceof Quality) && (!Number.isInteger(videoOptions.bitrate) || videoOptions.bitrate <= 0)) {
          throw new TypeError("options.video.bitrate, when provided, must be a positive integer or a quality.");
        }
        if (videoOptions?.width !== void 0 && (!Number.isInteger(videoOptions.width) || videoOptions.width <= 0)) {
          throw new TypeError("options.video.width, when provided, must be a positive integer.");
        }
        if (videoOptions?.height !== void 0 && (!Number.isInteger(videoOptions.height) || videoOptions.height <= 0)) {
          throw new TypeError("options.video.height, when provided, must be a positive integer.");
        }
        if (videoOptions?.fit !== void 0 && !["fill", "contain", "cover"].includes(videoOptions.fit)) {
          throw new TypeError('options.video.fit, when provided, must be one of "fill", "contain", or "cover".');
        }
        if (videoOptions?.width !== void 0 && videoOptions.height !== void 0 && videoOptions.fit === void 0) {
          throw new TypeError("When both options.video.width and options.video.height are provided, options.video.fit must also be provided.");
        }
        if (videoOptions?.rotate !== void 0 && ![0, 90, 180, 270].includes(videoOptions.rotate)) {
          throw new TypeError("options.video.rotate, when provided, must be 0, 90, 180 or 270.");
        }
        if (videoOptions?.crop !== void 0) {
          validateCropRectangle(videoOptions.crop, "options.video.");
        }
        if (videoOptions?.frameRate !== void 0 && (!Number.isFinite(videoOptions.frameRate) || videoOptions.frameRate <= 0)) {
          throw new TypeError("options.video.frameRate, when provided, must be a finite positive number.");
        }
      };
      const validateAudioOptions = (audioOptions) => {
        if (audioOptions !== void 0 && (!audioOptions || typeof audioOptions !== "object")) {
          throw new TypeError("options.audio, when provided, must be an object.");
        }
        if (audioOptions?.discard !== void 0 && typeof audioOptions.discard !== "boolean") {
          throw new TypeError("options.audio.discard, when provided, must be a boolean.");
        }
        if (audioOptions?.forceTranscode !== void 0 && typeof audioOptions.forceTranscode !== "boolean") {
          throw new TypeError("options.audio.forceTranscode, when provided, must be a boolean.");
        }
        if (audioOptions?.codec !== void 0 && !AUDIO_CODECS.includes(audioOptions.codec)) {
          throw new TypeError(`options.audio.codec, when provided, must be one of: ${AUDIO_CODECS.join(", ")}.`);
        }
        if (audioOptions?.bitrate !== void 0 && !(audioOptions.bitrate instanceof Quality) && (!Number.isInteger(audioOptions.bitrate) || audioOptions.bitrate <= 0)) {
          throw new TypeError("options.audio.bitrate, when provided, must be a positive integer or a quality.");
        }
        if (audioOptions?.numberOfChannels !== void 0 && (!Number.isInteger(audioOptions.numberOfChannels) || audioOptions.numberOfChannels <= 0)) {
          throw new TypeError("options.audio.numberOfChannels, when provided, must be a positive integer.");
        }
        if (audioOptions?.sampleRate !== void 0 && (!Number.isInteger(audioOptions.sampleRate) || audioOptions.sampleRate <= 0)) {
          throw new TypeError("options.audio.sampleRate, when provided, must be a positive integer.");
        }
      };
      const FALLBACK_NUMBER_OF_CHANNELS = 2;
      const FALLBACK_SAMPLE_RATE = 48e3;
      class Conversion {
static async init(options) {
          const conversion = new Conversion(options);
          await conversion._init();
          return conversion;
        }
constructor(options) {
          this._addedCounts = {
            video: 0,
            audio: 0,
            subtitle: 0
          };
          this._totalTrackCount = 0;
          this._trackPromises = [];
          this._executed = false;
          this._synchronizer = new TrackSynchronizer();
          this._totalDuration = null;
          this._maxTimestamps = new Map();
          this._canceled = false;
          this.onProgress = void 0;
          this._computeProgress = false;
          this._lastProgress = 0;
          this.utilizedTracks = [];
          this.discardedTracks = [];
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!(options.input instanceof Input)) {
            throw new TypeError("options.input must be an Input.");
          }
          if (!(options.output instanceof Output)) {
            throw new TypeError("options.output must be an Output.");
          }
          if (options.output._tracks.length > 0 || Object.keys(options.output._metadataTags).length > 0 || options.output.state !== "pending") {
            throw new TypeError("options.output must be fresh: no tracks or metadata tags added and not started.");
          }
          if (typeof options.video !== "function") {
            validateVideoOptions(options.video);
          }
          if (typeof options.audio !== "function") {
            validateAudioOptions(options.audio);
          }
          if (options.trim !== void 0 && (!options.trim || typeof options.trim !== "object")) {
            throw new TypeError("options.trim, when provided, must be an object.");
          }
          if (options.trim?.start !== void 0 && (!Number.isFinite(options.trim.start) || options.trim.start < 0)) {
            throw new TypeError("options.trim.start, when provided, must be a non-negative number.");
          }
          if (options.trim?.end !== void 0 && (!Number.isFinite(options.trim.end) || options.trim.end < 0)) {
            throw new TypeError("options.trim.end, when provided, must be a non-negative number.");
          }
          if (options.trim?.start !== void 0 && options.trim.end !== void 0 && options.trim.start >= options.trim.end) {
            throw new TypeError("options.trim.start must be less than options.trim.end.");
          }
          if (options.tags !== void 0 && (typeof options.tags !== "object" || !options.tags) && typeof options.tags !== "function") {
            throw new TypeError("options.tags, when provided, must be an object or a function.");
          }
          if (typeof options.tags === "object") {
            validateMetadataTags(options.tags);
          }
          this._options = options;
          this.input = options.input;
          this.output = options.output;
          this._startTimestamp = options.trim?.start ?? 0;
          this._endTimestamp = options.trim?.end ?? Infinity;
          const { promise: started, resolve: start } = promiseWithResolvers();
          this._started = started;
          this._start = start;
        }
async _init() {
          const inputTracks = await this.input.getTracks();
          const outputTrackCounts = this.output.format.getSupportedTrackCounts();
          let nVideo = 1;
          let nAudio = 1;
          for (const track of inputTracks) {
            let trackOptions = void 0;
            if (track.isVideoTrack()) {
              if (this._options.video) {
                if (typeof this._options.video === "function") {
                  trackOptions = await this._options.video(track, nVideo);
                  validateVideoOptions(trackOptions);
                  nVideo++;
                } else {
                  trackOptions = this._options.video;
                }
              }
            } else if (track.isAudioTrack()) {
              if (this._options.audio) {
                if (typeof this._options.audio === "function") {
                  trackOptions = await this._options.audio(track, nAudio);
                  validateAudioOptions(trackOptions);
                  nAudio++;
                } else {
                  trackOptions = this._options.audio;
                }
              }
            } else {
              assert$1(false);
            }
            if (trackOptions?.discard) {
              this.discardedTracks.push({
                track,
                reason: "discarded_by_user"
              });
              continue;
            }
            if (this._totalTrackCount === outputTrackCounts.total.max) {
              this.discardedTracks.push({
                track,
                reason: "max_track_count_reached"
              });
              continue;
            }
            if (this._addedCounts[track.type] === outputTrackCounts[track.type].max) {
              this.discardedTracks.push({
                track,
                reason: "max_track_count_of_type_reached"
              });
              continue;
            }
            if (track.isVideoTrack()) {
              await this._processVideoTrack(track, trackOptions ?? {});
            } else if (track.isAudioTrack()) {
              await this._processAudioTrack(track, trackOptions ?? {});
            }
          }
          const unintentionallyDiscardedTracks = this.discardedTracks.filter((x) => x.reason !== "discarded_by_user");
          if (unintentionallyDiscardedTracks.length > 0) {
            console.warn("Some tracks had to be discarded from the conversion:", unintentionallyDiscardedTracks);
          }
          const inputTags = await this.input.getMetadataTags();
          let outputTags;
          if (this._options.tags) {
            const result = typeof this._options.tags === "function" ? await this._options.tags(inputTags) : this._options.tags;
            validateMetadataTags(result);
            outputTags = result;
          } else {
            outputTags = inputTags;
          }
          const inputAndOutputFormatMatch = (await this.input.getFormat()).mimeType === this.output.format.mimeType;
          const rawTagsAreUnchanged = inputTags.raw === outputTags.raw;
          if (inputTags.raw && rawTagsAreUnchanged && !inputAndOutputFormatMatch) {
            delete outputTags.raw;
          }
          this.output.setMetadataTags(outputTags);
        }
async execute() {
          if (this._executed) {
            throw new Error("Conversion cannot be executed twice.");
          }
          this._executed = true;
          if (this.onProgress) {
            this._computeProgress = true;
            this._totalDuration = Math.min(await this.input.computeDuration() - this._startTimestamp, this._endTimestamp - this._startTimestamp);
            for (const track of this.utilizedTracks) {
              this._maxTimestamps.set(track.id, 0);
            }
            this.onProgress?.(0);
          }
          await this.output.start();
          this._start();
          try {
            await Promise.all(this._trackPromises);
          } catch (error) {
            if (!this._canceled) {
              void this.cancel();
            }
            throw error;
          }
          if (this._canceled) {
            await new Promise(() => {
            });
          }
          await this.output.finalize();
          if (this._computeProgress) {
            this.onProgress?.(1);
          }
        }
async cancel() {
          if (this.output.state === "finalizing" || this.output.state === "finalized") {
            return;
          }
          if (this._canceled) {
            console.warn("Conversion already canceled.");
            return;
          }
          this._canceled = true;
          await this.output.cancel();
        }
async _processVideoTrack(track, trackOptions) {
          const sourceCodec = track.codec;
          if (!sourceCodec) {
            this.discardedTracks.push({
              track,
              reason: "unknown_source_codec"
            });
            return;
          }
          let videoSource;
          const totalRotation = normalizeRotation(track.rotation + (trackOptions.rotate ?? 0));
          const outputSupportsRotation = this.output.format.supportsVideoRotationMetadata;
          const [rotatedWidth, rotatedHeight] = totalRotation % 180 === 0 ? [track.codedWidth, track.codedHeight] : [track.codedHeight, track.codedWidth];
          const crop = trackOptions.crop;
          if (crop) {
            clampCropRectangle(crop, rotatedWidth, rotatedHeight);
          }
          const [originalWidth, originalHeight] = crop ? [crop.width, crop.height] : [rotatedWidth, rotatedHeight];
          let width = originalWidth;
          let height = originalHeight;
          const aspectRatio = width / height;
          const ceilToMultipleOfTwo = (value) => Math.ceil(value / 2) * 2;
          if (trackOptions.width !== void 0 && trackOptions.height === void 0) {
            width = ceilToMultipleOfTwo(trackOptions.width);
            height = ceilToMultipleOfTwo(Math.round(width / aspectRatio));
          } else if (trackOptions.width === void 0 && trackOptions.height !== void 0) {
            height = ceilToMultipleOfTwo(trackOptions.height);
            width = ceilToMultipleOfTwo(Math.round(height * aspectRatio));
          } else if (trackOptions.width !== void 0 && trackOptions.height !== void 0) {
            width = ceilToMultipleOfTwo(trackOptions.width);
            height = ceilToMultipleOfTwo(trackOptions.height);
          }
          const firstTimestamp = await track.getFirstTimestamp();
          const needsTranscode = !!trackOptions.forceTranscode || this._startTimestamp > 0 || firstTimestamp < 0 || !!trackOptions.frameRate;
          let needsRerender = width !== originalWidth || height !== originalHeight || totalRotation !== 0 && !outputSupportsRotation || !!crop;
          let videoCodecs = this.output.format.getSupportedVideoCodecs();
          if (!needsTranscode && !trackOptions.bitrate && !needsRerender && videoCodecs.includes(sourceCodec) && (!trackOptions.codec || trackOptions.codec === sourceCodec)) {
            const source2 = new EncodedVideoPacketSource(sourceCodec);
            videoSource = source2;
            this._trackPromises.push((async () => {
              await this._started;
              const sink = new EncodedPacketSink(track);
              const decoderConfig = await track.getDecoderConfig();
              const meta = { decoderConfig: decoderConfig ?? void 0 };
              const endPacket = Number.isFinite(this._endTimestamp) ? await sink.getPacket(this._endTimestamp, { metadataOnly: true }) ?? void 0 : void 0;
              for await (const packet of sink.packets(void 0, endPacket, { verifyKeyPackets: true })) {
                if (this._synchronizer.shouldWait(track.id, packet.timestamp)) {
                  await this._synchronizer.wait(packet.timestamp);
                }
                if (this._canceled) {
                  return;
                }
                await source2.add(packet, meta);
                this._reportProgress(track.id, packet.timestamp + packet.duration);
              }
              source2.close();
              this._synchronizer.closeTrack(track.id);
            })());
          } else {
            const canDecode = await track.canDecode();
            if (!canDecode) {
              this.discardedTracks.push({
                track,
                reason: "undecodable_source_codec"
              });
              return;
            }
            if (trackOptions.codec) {
              videoCodecs = videoCodecs.filter((codec) => codec === trackOptions.codec);
            }
            const bitrate = trackOptions.bitrate ?? QUALITY_HIGH;
            const encodableCodec = await getFirstEncodableVideoCodec(videoCodecs, { width, height, bitrate });
            if (!encodableCodec) {
              this.discardedTracks.push({
                track,
                reason: "no_encodable_target_codec"
              });
              return;
            }
            const encodingConfig = {
              codec: encodableCodec,
              bitrate,
              sizeChangeBehavior: trackOptions.fit ?? "passThrough",
              onEncodedPacket: (sample) => this._reportProgress(track.id, sample.timestamp + sample.duration)
            };
            const source2 = new VideoSampleSource(encodingConfig);
            videoSource = source2;
            if (!needsRerender) {
              const tempOutput = new Output({
                format: new Mp4OutputFormat(),
target: new NullTarget()
              });
              const tempSource = new VideoSampleSource(encodingConfig);
              tempOutput.addVideoTrack(tempSource);
              await tempOutput.start();
              const sink = new VideoSampleSink(track);
              const firstSample = await sink.getSample(firstTimestamp);
              if (firstSample) {
                try {
                  await tempSource.add(firstSample);
                  firstSample.close();
                  await tempOutput.finalize();
                } catch (error) {
                  console.info("Error when probing encoder support. Falling back to rerender path.", error);
                  needsRerender = true;
                  void tempOutput.cancel();
                }
              } else {
                await tempOutput.cancel();
              }
            }
            if (needsRerender) {
              this._trackPromises.push((async () => {
                await this._started;
                const sink = new CanvasSink(track, {
                  width,
                  height,
                  fit: trackOptions.fit ?? "fill",
                  rotation: totalRotation,
crop: trackOptions.crop,
                  poolSize: 1
                });
                const iterator = sink.canvases(this._startTimestamp, this._endTimestamp);
                const frameRate = trackOptions.frameRate;
                let lastCanvas = null;
                let lastCanvasTimestamp = null;
                let lastCanvasEndTimestamp = null;
                const padFrames = async (until) => {
                  assert$1(lastCanvas);
                  assert$1(frameRate !== void 0);
                  const frameDifference = Math.round((until - lastCanvasTimestamp) * frameRate);
                  for (let i = 1; i < frameDifference; i++) {
                    const sample = new VideoSample(lastCanvas, {
                      timestamp: lastCanvasTimestamp + i / frameRate,
                      duration: 1 / frameRate
                    });
                    await source2.add(sample);
                  }
                };
                for await (const { canvas, timestamp, duration } of iterator) {
                  if (this._synchronizer.shouldWait(track.id, timestamp)) {
                    await this._synchronizer.wait(timestamp);
                  }
                  if (this._canceled) {
                    return;
                  }
                  let adjustedSampleTimestamp = Math.max(timestamp - this._startTimestamp, 0);
                  lastCanvasEndTimestamp = adjustedSampleTimestamp + duration;
                  if (frameRate !== void 0) {
                    const alignedTimestamp = Math.floor(adjustedSampleTimestamp * frameRate) / frameRate;
                    if (lastCanvas !== null) {
                      if (alignedTimestamp <= lastCanvasTimestamp) {
                        lastCanvas = canvas;
                        lastCanvasTimestamp = alignedTimestamp;
                        continue;
                      } else {
                        await padFrames(alignedTimestamp);
                      }
                    }
                    adjustedSampleTimestamp = alignedTimestamp;
                  }
                  const sample = new VideoSample(canvas, {
                    timestamp: adjustedSampleTimestamp,
                    duration: frameRate !== void 0 ? 1 / frameRate : duration
                  });
                  await source2.add(sample);
                  if (frameRate !== void 0) {
                    lastCanvas = canvas;
                    lastCanvasTimestamp = adjustedSampleTimestamp;
                  } else {
                    sample.close();
                  }
                }
                if (lastCanvas) {
                  assert$1(lastCanvasEndTimestamp !== null);
                  assert$1(frameRate !== void 0);
                  await padFrames(Math.floor(lastCanvasEndTimestamp * frameRate) / frameRate);
                }
                source2.close();
                this._synchronizer.closeTrack(track.id);
              })());
            } else {
              this._trackPromises.push((async () => {
                await this._started;
                const sink = new VideoSampleSink(track);
                const frameRate = trackOptions.frameRate;
                let lastSample = null;
                let lastSampleTimestamp = null;
                let lastSampleEndTimestamp = null;
                const padFrames = async (until) => {
                  assert$1(lastSample);
                  assert$1(frameRate !== void 0);
                  const frameDifference = Math.round((until - lastSampleTimestamp) * frameRate);
                  for (let i = 1; i < frameDifference; i++) {
                    lastSample.setTimestamp(lastSampleTimestamp + i / frameRate);
                    lastSample.setDuration(1 / frameRate);
                    await source2.add(lastSample);
                  }
                  lastSample.close();
                };
                for await (const sample of sink.samples(this._startTimestamp, this._endTimestamp)) {
                  if (this._synchronizer.shouldWait(track.id, sample.timestamp)) {
                    await this._synchronizer.wait(sample.timestamp);
                  }
                  if (this._canceled) {
                    lastSample?.close();
                    return;
                  }
                  let adjustedSampleTimestamp = Math.max(sample.timestamp - this._startTimestamp, 0);
                  lastSampleEndTimestamp = adjustedSampleTimestamp + sample.duration;
                  if (frameRate !== void 0) {
                    const alignedTimestamp = Math.floor(adjustedSampleTimestamp * frameRate) / frameRate;
                    if (lastSample !== null) {
                      if (alignedTimestamp <= lastSampleTimestamp) {
                        lastSample.close();
                        lastSample = sample;
                        lastSampleTimestamp = alignedTimestamp;
                        continue;
                      } else {
                        await padFrames(alignedTimestamp);
                      }
                    }
                    adjustedSampleTimestamp = alignedTimestamp;
                    sample.setDuration(1 / frameRate);
                  }
                  sample.setTimestamp(adjustedSampleTimestamp);
                  await source2.add(sample);
                  if (frameRate !== void 0) {
                    lastSample = sample;
                    lastSampleTimestamp = adjustedSampleTimestamp;
                  } else {
                    sample.close();
                  }
                }
                if (lastSample) {
                  assert$1(lastSampleEndTimestamp !== null);
                  assert$1(frameRate !== void 0);
                  await padFrames(Math.floor(lastSampleEndTimestamp * frameRate) / frameRate);
                }
                source2.close();
                this._synchronizer.closeTrack(track.id);
              })());
            }
          }
          this.output.addVideoTrack(videoSource, {
            frameRate: trackOptions.frameRate,
languageCode: isIso639Dash2LanguageCode(track.languageCode) ? track.languageCode : void 0,
            name: track.name ?? void 0,
            rotation: needsRerender ? 0 : totalRotation
});
          this._addedCounts.video++;
          this._totalTrackCount++;
          this.utilizedTracks.push(track);
        }
async _processAudioTrack(track, trackOptions) {
          const sourceCodec = track.codec;
          if (!sourceCodec) {
            this.discardedTracks.push({
              track,
              reason: "unknown_source_codec"
            });
            return;
          }
          let audioSource;
          const originalNumberOfChannels = track.numberOfChannels;
          const originalSampleRate = track.sampleRate;
          const firstTimestamp = await track.getFirstTimestamp();
          let numberOfChannels = trackOptions.numberOfChannels ?? originalNumberOfChannels;
          let sampleRate = trackOptions.sampleRate ?? originalSampleRate;
          let needsResample = numberOfChannels !== originalNumberOfChannels || sampleRate !== originalSampleRate || this._startTimestamp > 0 || firstTimestamp < 0;
          let audioCodecs = this.output.format.getSupportedAudioCodecs();
          if (!trackOptions.forceTranscode && !trackOptions.bitrate && !needsResample && audioCodecs.includes(sourceCodec) && (!trackOptions.codec || trackOptions.codec === sourceCodec)) {
            const source2 = new EncodedAudioPacketSource(sourceCodec);
            audioSource = source2;
            this._trackPromises.push((async () => {
              await this._started;
              const sink = new EncodedPacketSink(track);
              const decoderConfig = await track.getDecoderConfig();
              const meta = { decoderConfig: decoderConfig ?? void 0 };
              const endPacket = Number.isFinite(this._endTimestamp) ? await sink.getPacket(this._endTimestamp, { metadataOnly: true }) ?? void 0 : void 0;
              for await (const packet of sink.packets(void 0, endPacket)) {
                if (this._synchronizer.shouldWait(track.id, packet.timestamp)) {
                  await this._synchronizer.wait(packet.timestamp);
                }
                if (this._canceled) {
                  return;
                }
                await source2.add(packet, meta);
                this._reportProgress(track.id, packet.timestamp + packet.duration);
              }
              source2.close();
              this._synchronizer.closeTrack(track.id);
            })());
          } else {
            const canDecode = await track.canDecode();
            if (!canDecode) {
              this.discardedTracks.push({
                track,
                reason: "undecodable_source_codec"
              });
              return;
            }
            let codecOfChoice = null;
            if (trackOptions.codec) {
              audioCodecs = audioCodecs.filter((codec) => codec === trackOptions.codec);
            }
            const bitrate = trackOptions.bitrate ?? QUALITY_HIGH;
            const encodableCodecs = await getEncodableAudioCodecs(audioCodecs, {
              numberOfChannels,
              sampleRate,
              bitrate
            });
            if (!encodableCodecs.some((codec) => NON_PCM_AUDIO_CODECS.includes(codec)) && audioCodecs.some((codec) => NON_PCM_AUDIO_CODECS.includes(codec)) && (numberOfChannels !== FALLBACK_NUMBER_OF_CHANNELS || sampleRate !== FALLBACK_SAMPLE_RATE)) {
              const encodableCodecsWithDefaultParams = await getEncodableAudioCodecs(audioCodecs, {
                numberOfChannels: FALLBACK_NUMBER_OF_CHANNELS,
                sampleRate: FALLBACK_SAMPLE_RATE,
                bitrate
              });
              const nonPcmCodec = encodableCodecsWithDefaultParams.find((codec) => NON_PCM_AUDIO_CODECS.includes(codec));
              if (nonPcmCodec) {
                needsResample = true;
                codecOfChoice = nonPcmCodec;
                numberOfChannels = FALLBACK_NUMBER_OF_CHANNELS;
                sampleRate = FALLBACK_SAMPLE_RATE;
              }
            } else {
              codecOfChoice = encodableCodecs[0] ?? null;
            }
            if (codecOfChoice === null) {
              this.discardedTracks.push({
                track,
                reason: "no_encodable_target_codec"
              });
              return;
            }
            if (needsResample) {
              audioSource = this._resampleAudio(track, codecOfChoice, numberOfChannels, sampleRate, bitrate);
            } else {
              const source2 = new AudioSampleSource({
                codec: codecOfChoice,
                bitrate,
                onEncodedPacket: (packet) => this._reportProgress(track.id, packet.timestamp + packet.duration)
              });
              audioSource = source2;
              this._trackPromises.push((async () => {
                await this._started;
                const sink = new AudioSampleSink(track);
                for await (const sample of sink.samples(void 0, this._endTimestamp)) {
                  if (this._synchronizer.shouldWait(track.id, sample.timestamp)) {
                    await this._synchronizer.wait(sample.timestamp);
                  }
                  if (this._canceled) {
                    return;
                  }
                  await source2.add(sample);
                  sample.close();
                }
                source2.close();
                this._synchronizer.closeTrack(track.id);
              })());
            }
          }
          this.output.addAudioTrack(audioSource, {
languageCode: isIso639Dash2LanguageCode(track.languageCode) ? track.languageCode : void 0,
            name: track.name ?? void 0
          });
          this._addedCounts.audio++;
          this._totalTrackCount++;
          this.utilizedTracks.push(track);
        }
_resampleAudio(track, codec, targetNumberOfChannels, targetSampleRate, bitrate) {
          const source2 = new AudioSampleSource({
            codec,
            bitrate,
            onEncodedPacket: (packet) => this._reportProgress(track.id, packet.timestamp + packet.duration)
          });
          this._trackPromises.push((async () => {
            await this._started;
            const resampler = new AudioResampler({
              targetNumberOfChannels,
              targetSampleRate,
              startTime: this._startTimestamp,
              endTime: this._endTimestamp,
              onSample: (sample) => source2.add(sample)
            });
            const sink = new AudioSampleSink(track);
            const iterator = sink.samples(this._startTimestamp, this._endTimestamp);
            for await (const sample of iterator) {
              if (this._synchronizer.shouldWait(track.id, sample.timestamp)) {
                await this._synchronizer.wait(sample.timestamp);
              }
              if (this._canceled) {
                return;
              }
              await resampler.add(sample);
            }
            await resampler.finalize();
            source2.close();
            this._synchronizer.closeTrack(track.id);
          })());
          return source2;
        }
_reportProgress(trackId, endTimestamp) {
          if (!this._computeProgress) {
            return;
          }
          assert$1(this._totalDuration !== null);
          this._maxTimestamps.set(trackId, Math.max(endTimestamp, this._maxTimestamps.get(trackId)));
          const minTimestamp = Math.min(...this._maxTimestamps.values());
          const newProgress = clamp(minTimestamp / this._totalDuration, 0, 1);
          if (newProgress !== this._lastProgress) {
            this._lastProgress = newProgress;
            this.onProgress?.(newProgress);
          }
        }
      }
      const MAX_TIMESTAMP_GAP = 5;
      class TrackSynchronizer {
        constructor() {
          this.maxTimestamps = new Map();
          this.resolvers = [];
        }
        computeMinAndMaybeResolve() {
          let newMin = Infinity;
          for (const [, timestamp] of this.maxTimestamps) {
            newMin = Math.min(newMin, timestamp);
          }
          for (let i = 0; i < this.resolvers.length; i++) {
            const entry = this.resolvers[i];
            if (entry.timestamp - newMin < MAX_TIMESTAMP_GAP) {
              entry.resolve();
              this.resolvers.splice(i, 1);
              i--;
            }
          }
          return newMin;
        }
        shouldWait(trackId, timestamp) {
          this.maxTimestamps.set(trackId, Math.max(timestamp, this.maxTimestamps.get(trackId) ?? -Infinity));
          const newMin = this.computeMinAndMaybeResolve();
          return timestamp - newMin >= MAX_TIMESTAMP_GAP;
        }
        wait(timestamp) {
          const { promise, resolve } = promiseWithResolvers();
          this.resolvers.push({
            timestamp,
            resolve
          });
          return promise;
        }
        closeTrack(trackId) {
          this.maxTimestamps.delete(trackId);
          this.computeMinAndMaybeResolve();
        }
      }
      class AudioResampler {
        constructor(options) {
          this.sourceSampleRate = null;
          this.sourceNumberOfChannels = null;
          this.targetSampleRate = options.targetSampleRate;
          this.targetNumberOfChannels = options.targetNumberOfChannels;
          this.startTime = options.startTime;
          this.endTime = options.endTime;
          this.onSample = options.onSample;
          this.bufferSizeInFrames = Math.floor(this.targetSampleRate * 5);
          this.bufferSizeInSamples = this.bufferSizeInFrames * this.targetNumberOfChannels;
          this.outputBuffer = new Float32Array(this.bufferSizeInSamples);
          this.bufferStartFrame = 0;
          this.maxWrittenFrame = -1;
        }
doChannelMixerSetup() {
          assert$1(this.sourceNumberOfChannels !== null);
          const sourceNum = this.sourceNumberOfChannels;
          const targetNum = this.targetNumberOfChannels;
          if (sourceNum === 1 && targetNum === 2) {
            this.channelMixer = (sourceData, sourceFrameIndex) => {
              return sourceData[sourceFrameIndex * sourceNum];
            };
          } else if (sourceNum === 1 && targetNum === 4) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              return sourceData[sourceFrameIndex * sourceNum] * +(targetChannelIndex < 2);
            };
          } else if (sourceNum === 1 && targetNum === 6) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              return sourceData[sourceFrameIndex * sourceNum] * +(targetChannelIndex === 2);
            };
          } else if (sourceNum === 2 && targetNum === 1) {
            this.channelMixer = (sourceData, sourceFrameIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              return 0.5 * (sourceData[baseIdx] + sourceData[baseIdx + 1]);
            };
          } else if (sourceNum === 2 && targetNum === 4) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              return sourceData[sourceFrameIndex * sourceNum + targetChannelIndex] * +(targetChannelIndex < 2);
            };
          } else if (sourceNum === 2 && targetNum === 6) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              return sourceData[sourceFrameIndex * sourceNum + targetChannelIndex] * +(targetChannelIndex < 2);
            };
          } else if (sourceNum === 4 && targetNum === 1) {
            this.channelMixer = (sourceData, sourceFrameIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              return 0.25 * (sourceData[baseIdx] + sourceData[baseIdx + 1] + sourceData[baseIdx + 2] + sourceData[baseIdx + 3]);
            };
          } else if (sourceNum === 4 && targetNum === 2) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              return 0.5 * (sourceData[baseIdx + targetChannelIndex] + sourceData[baseIdx + targetChannelIndex + 2]);
            };
          } else if (sourceNum === 4 && targetNum === 6) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              if (targetChannelIndex < 2)
                return sourceData[baseIdx + targetChannelIndex];
              if (targetChannelIndex === 2 || targetChannelIndex === 3)
                return 0;
              return sourceData[baseIdx + targetChannelIndex - 2];
            };
          } else if (sourceNum === 6 && targetNum === 1) {
            this.channelMixer = (sourceData, sourceFrameIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              return Math.SQRT1_2 * (sourceData[baseIdx] + sourceData[baseIdx + 1]) + sourceData[baseIdx + 2] + 0.5 * (sourceData[baseIdx + 4] + sourceData[baseIdx + 5]);
            };
          } else if (sourceNum === 6 && targetNum === 2) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              return sourceData[baseIdx + targetChannelIndex] + Math.SQRT1_2 * (sourceData[baseIdx + 2] + sourceData[baseIdx + targetChannelIndex + 4]);
            };
          } else if (sourceNum === 6 && targetNum === 4) {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              const baseIdx = sourceFrameIndex * sourceNum;
              if (targetChannelIndex < 2) {
                return sourceData[baseIdx + targetChannelIndex] + Math.SQRT1_2 * sourceData[baseIdx + 2];
              }
              return sourceData[baseIdx + targetChannelIndex + 2];
            };
          } else {
            this.channelMixer = (sourceData, sourceFrameIndex, targetChannelIndex) => {
              return targetChannelIndex < sourceNum ? sourceData[sourceFrameIndex * sourceNum + targetChannelIndex] : 0;
            };
          }
        }
        ensureTempBufferSize(requiredSamples) {
          let length = this.tempSourceBuffer.length;
          while (length < requiredSamples) {
            length *= 2;
          }
          if (length !== this.tempSourceBuffer.length) {
            const newBuffer = new Float32Array(length);
            newBuffer.set(this.tempSourceBuffer);
            this.tempSourceBuffer = newBuffer;
          }
        }
        async add(audioSample) {
          if (this.sourceSampleRate === null) {
            this.sourceSampleRate = audioSample.sampleRate;
            this.sourceNumberOfChannels = audioSample.numberOfChannels;
            this.tempSourceBuffer = new Float32Array(this.sourceSampleRate * this.sourceNumberOfChannels);
            this.doChannelMixerSetup();
          }
          const requiredSamples = audioSample.numberOfFrames * audioSample.numberOfChannels;
          this.ensureTempBufferSize(requiredSamples);
          const sourceDataSize = audioSample.allocationSize({ planeIndex: 0, format: "f32" });
          const sourceView = new Float32Array(this.tempSourceBuffer.buffer, 0, sourceDataSize / 4);
          audioSample.copyTo(sourceView, { planeIndex: 0, format: "f32" });
          const inputStartTime = audioSample.timestamp - this.startTime;
          const inputDuration = audioSample.numberOfFrames / this.sourceSampleRate;
          const inputEndTime = Math.min(inputStartTime + inputDuration, this.endTime - this.startTime);
          const outputStartFrame = Math.floor(inputStartTime * this.targetSampleRate);
          const outputEndFrame = Math.ceil(inputEndTime * this.targetSampleRate);
          for (let outputFrame = outputStartFrame; outputFrame < outputEndFrame; outputFrame++) {
            if (outputFrame < this.bufferStartFrame) {
              continue;
            }
            while (outputFrame >= this.bufferStartFrame + this.bufferSizeInFrames) {
              await this.finalizeCurrentBuffer();
              this.bufferStartFrame += this.bufferSizeInFrames;
            }
            const bufferFrameIndex = outputFrame - this.bufferStartFrame;
            assert$1(bufferFrameIndex < this.bufferSizeInFrames);
            const outputTime = outputFrame / this.targetSampleRate;
            const inputTime = outputTime - inputStartTime;
            const sourcePosition = inputTime * this.sourceSampleRate;
            const sourceLowerFrame = Math.floor(sourcePosition);
            const sourceUpperFrame = Math.ceil(sourcePosition);
            const fraction = sourcePosition - sourceLowerFrame;
            for (let targetChannel = 0; targetChannel < this.targetNumberOfChannels; targetChannel++) {
              let lowerSample = 0;
              let upperSample = 0;
              if (sourceLowerFrame >= 0 && sourceLowerFrame < audioSample.numberOfFrames) {
                lowerSample = this.channelMixer(sourceView, sourceLowerFrame, targetChannel);
              }
              if (sourceUpperFrame >= 0 && sourceUpperFrame < audioSample.numberOfFrames) {
                upperSample = this.channelMixer(sourceView, sourceUpperFrame, targetChannel);
              }
              const outputSample = lowerSample + fraction * (upperSample - lowerSample);
              const outputIndex = bufferFrameIndex * this.targetNumberOfChannels + targetChannel;
              this.outputBuffer[outputIndex] += outputSample;
            }
            this.maxWrittenFrame = Math.max(this.maxWrittenFrame, bufferFrameIndex);
          }
        }
        async finalizeCurrentBuffer() {
          if (this.maxWrittenFrame < 0) {
            return;
          }
          const samplesWritten = (this.maxWrittenFrame + 1) * this.targetNumberOfChannels;
          const outputData = new Float32Array(samplesWritten);
          outputData.set(this.outputBuffer.subarray(0, samplesWritten));
          const timestampSeconds = this.bufferStartFrame / this.targetSampleRate;
          const audioSample = new AudioSample({
            format: "f32",
            sampleRate: this.targetSampleRate,
            numberOfChannels: this.targetNumberOfChannels,
            timestamp: timestampSeconds,
            data: outputData
          });
          await this.onSample(audioSample);
          this.outputBuffer.fill(0);
          this.maxWrittenFrame = -1;
        }
        finalize() {
          return this.finalizeCurrentBuffer();
        }
      }
      const logInfo = (...args) => {
        console.info(`[${AppName}]`, ...args);
      };
      const logError = (...args) => {
        console.error(`[${AppName}]`, ...args);
      };
      const getInitialState = () => {
        return window.__INITIAL_STATE__ || __INITIAL_STATE__;
      };
      const getVideoInfo = (fieldname) => {
        let info = "";
        const infoMetadataElement = document.head.querySelector(`meta[itemprop="${fieldname}"]`);
        const initialState = getInitialState();
        if (infoMetadataElement instanceof HTMLMetaElement) {
          info = infoMetadataElement.content;
        }
        if (info.length < 1 && initialState) {
          switch (fieldname) {
            case "image": {
              const videoItems = document.querySelectorAll(".video-episode-card.video-episode-card-title-hover");
              const activeVideoItem = Array.from(videoItems).find(
                (item) => item.textContent.includes(getVideoInfo("name"))
              );
              if (activeVideoItem) {
                const activeVideoCover = activeVideoItem.querySelector(
                  ".activity-image-card.cover-link-image .activity-image-card__image"
                );
                if (activeVideoCover instanceof HTMLElement) {
                  info = activeVideoCover.style.backgroundImage;
                  info = info.replace(/url\("(.+)@.*"\)/, "$1");
                }
              }
              break;
            }
            case "name":
              if (initialState.videoInfo) {
                info = initialState.videoInfo.title || "";
              } else if (initialState.videoData) {
                info = initialState.videoData.title || "";
              }
              break;
            case "author":
              if (initialState.videoInfo) {
                info = initialState.videoInfo.upName || "";
              } else if (initialState.videoData) {
                info = initialState.videoData.author || initialState.videoData.owner?.name || "";
              }
              break;
            case "cid": {
              const videoData = initialState.videoInfo || initialState.videoData;
              if (videoData && Array.isArray(videoData.pages) && videoData.pages.length > 0) {
                let page = parseInt(initialState.p);
                if (Number.isNaN(page)) {
                  page = 0;
                } else {
                  page = Math.max(page - 1, 0);
                }
                info = `${videoData.pages[page].cid}`;
                break;
              }
            }
            default:
              if (initialState.videoInfo) {
                info = initialState[fieldname] || initialState.videoInfo[fieldname] || "";
              } else if (initialState.videoData) {
                info = initialState[fieldname] || initialState.videoData[fieldname] || "";
              }
              info = `${info}`;
              break;
          }
        }
        if (fieldname === "image") {
          try {
            info = info.replace(/(.+)(@.*)/, "$1");
            info = `http:${info}`;
          } catch {
          }
        }
        return info.trim();
      };
      const scriptRel = (function detectScriptRel() {
        const relList = typeof document !== "undefined" && document.createElement("link").relList;
        return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
      })();
      const assetsURL = function(dep) {
        return "/" + dep;
      };
      const seen = {};
      const __vitePreload = function preload(baseModule, deps, importerUrl) {
        let promise = Promise.resolve();
        if (deps && deps.length > 0) {
          let allSettled = function(promises$2) {
            return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
              status: "fulfilled",
              value: value$1
            }), (reason) => ({
              status: "rejected",
              reason
            }))));
          };
          document.getElementsByTagName("link");
          const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
          const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
          promise = allSettled(deps.map((dep) => {
            dep = assetsURL(dep);
            if (dep in seen) return;
            seen[dep] = true;
            const isCss = dep.endsWith(".css");
            const cssSelector = isCss ? '[rel="stylesheet"]' : "";
            if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
            const link2 = document.createElement("link");
            link2.rel = isCss ? "stylesheet" : scriptRel;
            if (!isCss) link2.as = "script";
            link2.crossOrigin = "";
            link2.href = dep;
            if (cspNonce) link2.setAttribute("nonce", cspNonce);
            document.head.appendChild(link2);
            if (isCss) return new Promise((res, rej) => {
              link2.addEventListener("load", res);
              link2.addEventListener("error", () => rej( new Error(`Unable to preload CSS for ${dep}`)));
            });
          }));
        }
        function handlePreloadError(err$2) {
          const e$1 = new Event("vite:preloadError", { cancelable: true });
          e$1.payload = err$2;
          window.dispatchEvent(e$1);
          if (!e$1.defaultPrevented) throw err$2;
        }
        return promise.then((res) => {
          for (const item of res || []) {
            if (item.status !== "rejected") continue;
            handlePreloadError(item.reason);
          }
          return baseModule().catch(handlePreloadError);
        });
      };
      var __require = ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
        get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
      }) : x)(function(x) {
        if (typeof require !== "undefined") return require.apply(this, arguments);
        throw Error('Dynamic require of "' + x + '" is not supported');
      });
      var FRAME_HEADER_SIZE = 4;
      var SAMPLING_RATES = [44100, 48e3, 32e3];
      var KILOBIT_RATES = [
-1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
-1,
        32,
        40,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        160,
        192,
        224,
        256,
        320,
        -1,
-1,
        32,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        160,
        192,
        224,
        256,
        320,
        384,
        -1,
-1,
        32,
        64,
        96,
        128,
        160,
        192,
        224,
        256,
        288,
        320,
        352,
        384,
        416,
        448,
        -1,

-1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
-1,
        8,
        16,
        24,
        32,
        40,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        -1,
-1,
        8,
        16,
        24,
        32,
        40,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        -1,
-1,
        32,
        48,
        56,
        64,
        80,
        96,
        112,
        128,
        144,
        160,
        176,
        192,
        224,
        256,
        -1
];
      var computeMp3FrameSize = (lowSamplingFrequency, layer, bitrate, sampleRate, padding) => {
        if (layer === 0) {
          return 0;
        } else if (layer === 1) {
          return Math.round(144 * bitrate / (sampleRate << lowSamplingFrequency)) + padding;
        } else if (layer === 2) {
          return Math.round(144 * bitrate / sampleRate) + padding;
        } else {
          return (Math.round(12 * bitrate / sampleRate) + padding) * 4;
        }
      };
      var readFrameHeader = (word, remainingBytes) => {
        const firstByte = word >>> 24;
        const secondByte = word >>> 16 & 255;
        const thirdByte = word >>> 8 & 255;
        const fourthByte = word & 255;
        if (firstByte !== 255 && secondByte !== 255 && thirdByte !== 255 && fourthByte !== 255) {
          return {
            header: null,
            bytesAdvanced: 4
          };
        }
        if (firstByte !== 255) {
          return { header: null, bytesAdvanced: 1 };
        }
        if ((secondByte & 224) !== 224) {
          return { header: null, bytesAdvanced: 1 };
        }
        let lowSamplingFrequency = 0;
        let mpeg25 = 0;
        if (secondByte & 1 << 4) {
          lowSamplingFrequency = secondByte & 1 << 3 ? 0 : 1;
        } else {
          lowSamplingFrequency = 1;
          mpeg25 = 1;
        }
        const mpegVersionId = secondByte >> 3 & 3;
        const layer = secondByte >> 1 & 3;
        const bitrateIndex = thirdByte >> 4 & 15;
        const frequencyIndex = (thirdByte >> 2 & 3) % 3;
        const padding = thirdByte >> 1 & 1;
        const channel = fourthByte >> 6 & 3;
        const modeExtension = fourthByte >> 4 & 3;
        const copyright = fourthByte >> 3 & 1;
        const original = fourthByte >> 2 & 1;
        const emphasis = fourthByte & 3;
        const kilobitRate = KILOBIT_RATES[lowSamplingFrequency * 16 * 4 + layer * 16 + bitrateIndex];
        if (kilobitRate === -1) {
          return { header: null, bytesAdvanced: 1 };
        }
        const bitrate = kilobitRate * 1e3;
        const sampleRate = SAMPLING_RATES[frequencyIndex] >> lowSamplingFrequency + mpeg25;
        const frameLength = computeMp3FrameSize(lowSamplingFrequency, layer, bitrate, sampleRate, padding);
        let audioSamplesInFrame;
        if (mpegVersionId === 3) {
          audioSamplesInFrame = layer === 3 ? 384 : 1152;
        } else {
          if (layer === 3) {
            audioSamplesInFrame = 384;
          } else if (layer === 2) {
            audioSamplesInFrame = 1152;
          } else {
            audioSamplesInFrame = 576;
          }
        }
        return {
          header: {
            totalSize: frameLength,
            mpegVersionId,
            layer,
            bitrate,
            frequencyIndex,
            sampleRate,
            channel,
            modeExtension,
            copyright,
            original,
            emphasis,
            audioSamplesInFrame
          },
          bytesAdvanced: 1
        };
      };
      async function inlineWorker(scriptText) {
        if (typeof Worker !== "undefined" && typeof Bun === "undefined") {
          const blob = new Blob([scriptText], { type: "text/javascript" });
          const url2 = URL.createObjectURL(blob);
          const worker = new Worker(url2, { type: typeof Deno !== "undefined" ? "module" : void 0 });
          URL.revokeObjectURL(url2);
          return worker;
        } else {
          let Worker3;
          try {
            Worker3 = (await __vitePreload(async () => {
              const { Worker: Worker4 } = await Promise.resolve().then(() => __viteBrowserExternalL0sNRNKZ);
              return { Worker: Worker4 };
            }, true ? void 0 : void 0)).Worker;
          } catch {
            const workerModule = "worker_threads";
            Worker3 = __require(workerModule).Worker;
          }
          const worker = new Worker3(scriptText, { eval: true });
          return worker;
        }
      }
      function Worker2() {
        return inlineWorker('var fI=Object.defineProperty;var dI=(D,Q,g)=>Q in D?fI(D,Q,{enumerable:!0,configurable:!0,writable:!0,value:g}):D[Q]=g;var GA=(D=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(D,{get:(Q,g)=>(typeof require!="undefined"?require:Q)[g]}):D)(function(D){if(typeof require!="undefined")return require.apply(this,arguments);throw Error(\'Dynamic require of "\'+D+\'" is not supported\')});var SA=(D,Q,g)=>dI(D,typeof Q!="symbol"?Q+"":Q,g);async function nI(D={}){var oA;var Q,g=D,t=typeof window=="object",S=typeof WorkerGlobalScope!="undefined",R=typeof process=="object"&&((oA=process.versions)==null?void 0:oA.node)&&process.type!="renderer",O=[],J="./this.program",kA=(A,I)=>{throw I},hA="",aA="",LA,z;if(t||S){try{aA=new URL(".",hA).href}catch(A){}S&&(z=A=>{var I=new XMLHttpRequest;return I.open("GET",A,!1),I.responseType="arraybuffer",I.send(null),new Uint8Array(I.response)}),LA=async A=>{var I=await fetch(A,{credentials:"same-origin"});if(I.ok)return I.arrayBuffer();throw new Error(I.status+" : "+I.url)}}var X=console.log.bind(console),f=console.error.bind(console),d,x=!1,Z,n,b,e,j,h,YA,qA,HA,l,PA,cA,rA,tA,V=!1;function u(){var A=e.buffer;j=new Int8Array(A),YA=new Int16Array(A),g.HEAPU8=h=new Uint8Array(A),qA=new Uint16Array(A),HA=new Int32Array(A),l=new Uint32Array(A),PA=new Float32Array(A),cA=new Float64Array(A),rA=new BigInt64Array(A),tA=new BigUint64Array(A)}function fA(){if(g.preRun)for(typeof g.preRun=="function"&&(g.preRun=[g.preRun]);g.preRun.length;)ZA(g.preRun.shift());_(AA)}function dA(){V=!0,Y.f()}function nA(){if(g.postRun)for(typeof g.postRun=="function"&&(g.postRun=[g.postRun]);g.postRun.length;)XA(g.postRun.shift());_($)}var N=0,a=null;function bA(A){var I;N++,(I=g.monitorRunDependencies)==null||I.call(g,N)}function eA(A){var C;if(N--,(C=g.monitorRunDependencies)==null||C.call(g,N),N==0&&a){var I=a;a=null,I()}}function lA(A){var C;(C=g.onAbort)==null||C.call(g,A),A="Aborted("+A+")",f(A),x=!0,A+=". Build with -sASSERTIONS for more info.";var I=new WebAssembly.RuntimeError(A);throw b==null||b(I),I}var L;function TA(){return jA("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aiEJA0AgBCAJIAUiA0EBaiIFQQJ0IgpqKAIAIgtKBEAgAkEANgKILCAIIAggC0ECdGoiCyACQYgsaiAAKAK4ngURAAAhDQJAIAkgA0ECakECdCIGaigCACIMIARODQAgAiACKAKILDYCjCwgCyAIIAxBAnRqIAJBjCxqIAAoArieBREAACEPIAIoAowsIgcgA0ECdCIMIAJBoAJqaiIOKAIASARAIA4gBzYCACACQeAAaiAMaiANNgIAIAJBwAFqIAxqIAM2AgAgAiAMaiAPNgIACyAJIANBA2pBAnQiD2ooAgAiByAETg0AIAIgAigCiCw2AowsIAsgCCAHQQJ0aiACQYwsaiAAKAK4ngURAAAhByACKAKMLCIOIAJBoAJqIApqIhAoAgBIBEAgECAONgIAIAJB4ABqIApqIA02AgAgAkHAAWogCmogAzYCACACIApqIAc2AgALIAkgA0EEakECdCIKaigCACIHIARODQAgAiACKAKILDYCjCwgCyAIIAdBAnRqIAJBjCxqIAAoArieBREAACEHIAIoAowsIg4gAkGgAmogBmoiECgCAEgEQCAQIA42AgAgAkHgAGogBmogDTYCACACQcABaiAGaiADNgIAIAIgBmogBzYCAAsgCSADQQVqQQJ0IgZqKAIAIgcgBE4NACACIAIoAogsNgKMLCALIAggB0ECdGogAkGMLGogACgCuJ4FEQAAIQcgAigCjCwiDiACQaACaiAPaiIQKAIASARAIBAgDjYCACACQeAAaiAPaiANNgIAIAJBwAFqIA9qIAM2AgAgAiAPaiAHNgIACyAJIANBBmpBAnQiD2ooAgAiByAETg0AIAIgAigCiCw2AowsIAsgCCAHQQJ0aiACQYwsaiAAKAK4ngURAAAhByACKAKMLCIOIAJBoAJqIApqIhAoAgBIBEAgECAONgIAIAJB4ABqIApqIA02AgAgAkHAAWogCmogAzYCACACIApqIAc2AgALIAkgA0EHakECdCIKaigCACIHIARODQAgAiACKAKILDYCjCwgCyAIIAdBAnRqIAJBjCxqIAAoArieBREAACEHIAIoAowsIg4gAkGgAmogBmoiECgCAEgEQCAQIA42AgAgAkHgAGogBmogDTYCACACQcABaiAGaiADNgIAIAIgBmogBzYCAAsgCSAMaiIGKAIgIgwgBE4NACACIAIoAogsNgKMLCALIAggDEECdGogAkGMLGogACgCuJ4FEQAAIQwgAigCjCwiByACQaACaiAPaiIOKAIASARAIA4gBzYCACACQeAAaiAPaiANNgIAIAJBwAFqIA9qIAM2AgAgAiAPaiAMNgIACyAGKAIkIgYgBE4NACACIAIoAogsNgKMLCALIAggBkECdGogAkGMLGogACgCuJ4FEQAAIQsgAigCjCwiBiACQaACaiAKaiIMKAIATg0AIAwgBjYCACACQeAAaiAKaiANNgIAIAJBwAFqIApqIAM2AgAgAiAKaiALNgIACyAFQRBHDQELCyAIIAIoAqgoIgRBAnRqIQtBAiEDA0AgCSADQQJ0aigCACINIARODQEgAiACKALEKyADQQJrIgpBAnQiBSACQaACamooAgBqIgY2AowsIAEoAqAlIAZMDQEgCCANQQJ0aiALIAJBjCxqIAAoArieBREAACENIAIoAowsIgYgASgCoCVIBEAgASACQYQDakGEKfwKAAAgASAGNgKgJSABIAJBwAFqIAVqKAIAIgY2AtglIAEgCiAGazYC3CUgASACQeAAaiAFaigCADYCvCUgAiAFaigCACEFIAEgDTYCxCUgASAFNgLAJQsgA0EBaiIDQRdHDQALCyACKAKoKCIDRQ0AIAggA0ECdGoiA0EEaygCACADQQhrKAIAckEBSw0AIAEoAqglIgNBvgRKDQAgAkGEA2ogAUGEKfwKAAAgAiADQQJqIgU2AqwoQQAhCQJAIAIoAqgoIg0gBU4EQEEAIQQgBSEDDAELQQAhBANAIAQgCCAFQQJ0aiILQQxrKAIAQQF0IAggBUEEayIDQQJ0aigCAEECdGogC0EIaygCAGpBAXQgC0EEaygCAGoiBUHA3ABqLQAAaiEEIAkgBUGw3ABqLQAAaiEJIAMhBSADIA1KDQALCyACIAM2AqgoIAIgBCAJSTYC7CggAiAJIAQgBCAJSxsiCTYCxCsgAigCuChFBEAgAEH0pgFqIQsgCCADQQJ0aiENQQIhBQNAIAsgBUECdGooAgAiCiADTg0CIAIgCSAFQQJrIgZBAnQiBCACQaACamooAgBqIgw2AowsIAEoAqAlIAxMDQIgCCAKQQJ0aiANIAJBjCxqIAAoArieBREAACEKIAIoAowsIgwgASgCoCVIBEAgASACQYQDakGEKfwK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IABB//kBSg0BIABBoqwBRg0FIABBwLsBRw0CC0EBDAILQQEhAiAAQYD6AUcEQCAAQcTYAkYNAyAAQYD3AkcNASABQQE2AgBBAQ8LIAFBATYCAEECDwtBfwshA0EAIQILIAEgAjYCACADDwsgAUEANgIAQQALjgMBAX9BASEDAkBBAiABIAJBgP0ASBtBBnRBkI0BaiIBKAIAIgJBAEwNACAAIAJHDQBBAA8LIAEoAgQiAkEASiAAIAJGcQR/QQEFAkAgASgCCCICQQBMDQAgACACRw0AQQIPCwJAIAEoAgwiAkEATA0AIAAgAkcNAEEDDwsCQCABKAIQIgJBAEwNACAAIAJHDQBBBA8LAkAgASgCFCICQQBMDQAgACACRw0AQQUPCwJAIAEoAhgiAkEATA0AIAAgAkcNAEEGDwsCQCABKAIcIgJBAEwNACAAIAJHDQBBBw8LAkAgASgCICICQQBMDQAgACACRw0AQQgPCwJAIAEoAiQiAkEATA0AIAAgAkcNAEEJDwsCQCABKAIoIgJBAEwNACAAIAJHDQBBCg8LAkAgASgCLCICQQBMDQAgACACRw0AQQsPCwJAIAEoAjAiAkEATA0AIAAgAkcNAEEMDwsCQCABKAI0IgJBAEwNACAAIAJHDQBBDQ8LQX9BDkF/IAAgASgCOCIARhsgAEEATBsLC4UGAQF/QQIgASACQYD9AEgbQQZ0QZCNAWoiASgCBCECIAEoAggiA0EASgRAIAMgAiADIABrIgMgA0EfdSIDcyADayACIABrIgIgAkEfdSICcyACa0kbIQILIAEoAgwiA0EASgRAIAMgAiADIABrIgMgA0EfdSIDcyADayACIABrIgIgAkEfdSICcyACa0kbIQILIAEoAhAiA0EASgRAIAMgAiADIABrIgMgA0EfdSIDcyADayACIABrIgIgAkEfdSICcyACa0kbIQILIAEoAhQiA0EASgRAIAMgAiADIABrIgMgA0EfdSIDcyADayACIABrIgIgAkEfdSICcyACa0kbIQILIAEoAhgiA0EASgRAIAMgAiADIABrIgMgA0EfdSIDcyADayACIABrIgIgAkEfdSICcyACa0kbIQILIAEoAhwiA0EASgRAIAMgAiADIABrIgMgA0EfdSIDcyADayACIABrIgIgAkEfdSICcyACa0kbIQILIAEoAiAiA0EA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QQAhBEEAIQsjAEHw/gBrIhIkACASQoCAgPiDgICAPzcDOCAS/QwAAAAAAAAAAAAAAAAAAAAA/QsEICASIBw2AmwgEiAaNgJoIBL9DAAAAAAAAAAAAAAAAAAAAAD9CwQQIAYoAghFBEAgBkEBNgIIIAYoAlAhAiASQfA/akEAQfg+/AsAIBJB8ABqQQBB+D78CwAgAkHABGwiAUHeBmoiA0EASgRAA0ACQCAAIAFIBEAgAEECdCIHIBJB8D9qakEANgIAIAYoAkxBAkcNASASQfAAaiAHakEANgIADAELIABBAnQiByASQfA/amogGiALQQJ0IghqKgIAOAIAIAYoAkxBAkYEQCASQfAAaiAHaiAIIBxqKgIAOAIACyALQQFqIQsLIABBAWoiACADRw0ACwsCQCACQQBMDQAgBigCTCIAQQBMDQAgBkG0AmohByAAQfj///8HcSEIIABBB3EhAyAAQQhJIQoDQCAHIARBiNIAbGohAUEAIQBBACENIApFBEADQCABIABBhClsakECNgK0JSABIABBAXJBhClsakECNgK0JSABIABBAnJBhClsakECNgK0JSABIABBA3JBhClsakECNgK0JSABIABBBHJBhClsakECNgK0JSABIABBBXJBhClsakECNgK0JSABIABBBnJBhClsakECNgK0JSABIABBB3JBhClsakECNgK0JSAAQQhqIQAgDUEIaiINIAhHDQALC0EAIQ0gAwRAA0AgASAAQYQpbGpBAjYCtCUgAEEBaiEAIA1BAWoiDSADRw0ACwsgBEEBaiIEIAJHDQALCyAGIBJB8D9qIBJB8ABqEFULQQAhCyAGQQA2ApCWBSAGIAYoApy3AiAGKAKYtwJrIgA2Apy3AiAAQQBIBEAgBkEBNgKQlgUgBiAGKAJEIABqNgKctwILIBJCADcDCCAGKAJQQQBKBEAgBkG0AmohOiAGKAJMIQRBACENA0ACQCAEQQBMDQAgDUGAEmwhAUEAIQAgBEEETwRAIARB/P///wdxIQBBACELA0AgC0ECdCICIBJBCGpqIBJB6ABqIAJq/QACACAB/RH9rgH9DMAEAADABAAAwAQAAMAEAAD9rgH9CwMAIAtBBGoiCyAARw0ACyAAIARGDQELA0AgAEECdCICIBJBCGpqIBJB6ABqIAJqKAIAIAFqQcAJajYCACAAQQFq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AkAgACgCMEUEQCAAQdAANgIwIABBADYCHCAAQgA3AxAgACgCLCEGIAAgBTYCLAwBCyAAKAIQDQELQX8gABBHDQEaCyAAIAEgBUHIAWogBUHQAGogBUGgAWogAyAEED4LIQEgBgR/IABBAEEAIAAoAiQRAAAaIABBADYCMCAAIAY2AiwgAEEANgIcIAAoAhQaIABCADcDEEEABSABCxogACAAKAIAIAdBIHFyNgIADQALIAVB0AFqJAALfgIBfwF+IAC9IgNCNIinQf8PcSICQf8PRwR8IAJFBEAgASAARAAAAAAAAAAAYQR/QQAFIABEAAAAAAAA8EOiIAEQQCEAIAEoAgBBQGoLNgIAIAAPCyABIAJB/gdrNgIAIANC/////////4eAf4NCgICAgICAgPA/hL8FIAALC/ACAgJ/AX4CQCACRQ0AIAAgAToAACAAIAJqIgNBAWsgAToAACACQQNJDQAgACABOgACIAAgAToAASADQQNrIAE6AAAgA0ECayABOgAAIAJBB0kNACAAIAE6AAMgA0EEayABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIANgIAIAMgAiAEa0F8cSICaiIBQQRrIAA2AgAgAkEJSQ0AIAMgADYCCCADIAA2AgQgAUEIayAANgIAIAFBDGsgADYCACACQRlJDQAgAyAANgIYIAMgADYCFCADIAA2AhAgAyAANgIMIAFBEGsgADYCACABQRRrIAA2AgAgAUEYayAANgIAIAFBHGsgADYCACACIANBBHFBGHIiAWsiAkEgSQ0AIACtQoGAgIAQfiEFIAEgA2ohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkEgayICQR9LDQALCwunAQEEfyMAQRBrIgUkACAFIAI2AgwjAEGgAWsiAyQAIANBCGoiBkHgiQJBkAH8CgAAIAMgADYCNCADIAA2AhwgA0H/////B0F+IABrIgQgBEH/////B0sbIgQ2AjggAyAAIARqIgQ2AiQgAyAENgIYIAYgASACQQBBABA/IABBfkcEQCADKAIcIgAgACADKAIYRmtBADoAAAsgA0GgAWokACAFQRBqJAALkwEBBn9BBCECIwBBgAJrIgUkACABQQJOBEAgACABQQJ0aiIHIAU2AgADQCAHKAIA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eK1g7HitYOx4rWDseK1g/QsC4AEgAv0M7HitYOx4rWDseK1g7HitYP0LAuABIAT9DAAAgD8AAIA/AACAPwAAgD/9CwLgASAI/QwAAIA/AACAPwAAgD8AAIA//QsC4AEgAf0M7HitYOx4rWDseK1g7HitYP0LAvABIAL9DOx4rWDseK1g7HitYOx4rWD9CwLwASAE/QwAAIA/AACAPwAAgD8AAIA//QsC8AEgCP0MAACAPwAAgD8AAIA/AACAP/0LAvABIBIgB0H0AWwiBGoiAf0M7HitYOx4rWDseK1g7HitYP0LAgAgBCARaiIC/QzseK1g7HitYOx4rWDseK1g/QsCACAB/QzseK1g7HitYOx4rWDseK1g/QsCECAC/QzseK1g7HitYOx4rWDseK1g/QsCECAB/QzseK1g7HitYOx4rWDseK1g/QsCICAC/QzseK1g7HitYOx4rWDseK1g/QsCICAB/QzseK1g7HitYOx4rWDseK1g/QsCMCAC/QzseK1g7HitYOx4rWDseK1g/QsCMCAB/QzseK1g7HitYOx4rWDseK1g/QsCQCAC/QzseK1g7HitYOx4rWDseK1g/QsCQCAB/QzseK1g7HitYOx4rWDseK1g/QsCUCAC/QzseK1g7HitYOx4rWDseK1g/QsCUCAEIA5qIgH9DOx4rWDseK1g7HitYOx4rWD9CwIIIAQgDWoiAv0M7HitYOx4rWDseK1g7HitYP0LAgggAf0M7HitYOx4rWDseK1g7HitYP0LAhggAv0M7HitYOx4rWDseK1g7HitYP0LAhggAf0M7HitYOx4rWDseK1g7HitYP0LAiggAv0M7HitYOx4rWDseK1g7HitYP0LAiggAf0M7HitYOx4rWDseK1g7HitYP0LAjggAv0M7HitYOx4rWDseK1g7HitYP0LAjggAf0M7HitYOx4rWDseK1g7HitYP0LAkggAv0M7HitYOx4rWDseK1g7HitYP0LAkggAf0M7HitYOx4rWDseK1g7HitYP0LAlggAv0M7HitYOx4rWDseK1g7HitYP0LAlggAf0M7HitYOx4rWDseK1g7HitYP0LAmggAv0M7HitYOx4rWDseK1g7HitYP0LAmggAf0M7HitYOx4rWDseK1g7HitYP0LAnggAv0M7HitYOx4rWDseK1g7HitYP0LAnggAf0M7Hit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ABAAAAAAAAAAwDIAAMA0AEHsgQELkgLANQAAEAAAAAAAAADANgAAwDgAAAEAAAABAAAAwDkAAMA7AAACAAAAAwAAAMA5AADAOwAAAwAAAAcAAADAOQAAwDsAAAQAAAAPAAAAwDkAAMA7AAAGAAAAPwAAAMA5AADAOwAACAAAAP8AAADAOQAAwDsAAAoAAAD/AwAAwDkAAMA7AAANAAAA/x8AAMA5AADAOwAABAAAAA8AAADAPAAAwD4AAAUAAAAfAAAAwDwAAMA+AAAGAAAAPwAAAMA8AADAPgAABwAAAH8AAADAPAAAwD4AAAgAAAD/AAAAwDwAAMA+AAAJAAAA/wEAAMA8AADAPgAACwAAAP8HAADAPAAAwD4AAA0AAAD/HwAAwDwAAMA+AEGIhAELBsA/AAAwLgBBmIQBC6sI4D8AAEAuAAAEAAEABQAFAAcABwAIAAkACQAKAAoACgAKAAsACwALAAsADAAMAAwADAAMAAwADQAMAA0ADAANAA0ADgAKAAoABQAEAAYABgAHAAgACAAJAAkACgAKAAsACgALAAsACwALAAwACwAMAAwADAAMAA0ADAAOAAwADQAMAA4ACgAKAAcABwAHAAgACAAJAAkACgAJAAsACgALAAoADAALAAwACwANAAsADAALAA0ADAANAAwADQAMAA4ADQAOAAkACwAIAAkACAAJAAkACgAJAAsACgALAAoADAAKAAwACwAMAAsADQALAA0ACwAOAAwADgAMAA4ADAAPAAwADwAJAAwACQAKAAkACgAJAAsACgALAAoADAAKAAwACgANAAsADQALAA0ACwAOAAwADgAMAA4ADAAPAAwADwANAA8ACQALAAoACgAJAAoACgALAAoACwAKAAwACgANAAsADQALAA4ACwANAAsADgAMAA4ADAAPAAwADwAMAA8ADAAQAAkADAAKAAsACgALAAoACwAKAAwACgANAAsADQALAA0ACwANAAsADgAMAA4ADAAOAAwADgAMAA8ADAAPAA0AEAAJAAwACwALAAoACwAKAAwACgAMAAsADQALAA0ACwANAAsADgAMAA4ADAAPAAwADwAMAA8ADAAPAA0AEQANABEACgAMAAsACwALAAwACwAMAAsADQALAA0ACwANAAsADgALAA4ACwAPAAwADwAMAA8ADAAPAAwAEAANABAADQAQAAoADAALAAwACwAMAAsADAALAA0ACwANAAsADgALAA4ADAAPAAwADwAMAA8ADAAPAAwAEAANAA8ADQAQAA0ADwAKAA0ADAAMAAsADQALAAwACwANAAsADgAMAA4ADAAOAAwADgAMAA8ADAAQAAwAEAANABAADQARAA0AEQANABAACgAMAAwADQAMAA0ACwANAAsADQALAA4ADAAOAAwADwAMABAADAAQAAwAEAAMABAADQAQAA0AEAANAA8ADQAQAAoADQAMAA0ADAAOAAwADgAMAA4ADAAOAAwADwAMAA8ADAAPAAwADwAMABEADQAQAA0AEAANABAADQAQAA0AEgAKAA0ADAAPAAwADgAMAA4ADAAOAAwADwAMAA8ADAAQAAwAEAANABAADQASAA0AEQANABEADQARAA0AEwANABEACgANAA0ADgAMAA8ADAANAAwADgAMABAADAAQAAwADwANABAADQAQAA0AEQANABIADQARAA0AEwANABEADQAQAAoADQAJAAoACQAKAAkACgAJAAsACQALAAkADAAJAAwACQAMAAkADQAJAA0ACQANAAoADQAKAA0ACgANAAoADQAGAAoAAgABAAMABAAHAAcABAAEAAQABQAHAAcABgAGAAcABwAIAAgAQdCMAQuRAgMAAQAEAAQABgAHAAgACAAEAAQABAAFAAYACAAHAAkABQAHAAYACAAHAAkACAAKAAcACAAHAAgACAAJAAkACgAAAAAACAAAABAAAAAYAAAAIAAAACgAAAAwAAAAOAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAAD/////AAAAACAAAAAoAAAAMAAAADgAAABAAAAAUAAAAGAAAABwAAAAgAAAAKAAAADAAAAA4AAAAAABAABAAQAA/////wAAAAAIAAAAEAAAABgAAAAgAAAAKAAAADAAAAA4AAAAQAAAAP////////////////////////////////////8AAAAABgAAAAsAAAAQAAAAFQBBgI8BC20DAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAAAwAAAAMAAAADAAAABAAAAAQAAAAAAAAAAQAAAAIAAAADAAAAAAAAAAEAAAACAAAAAwAAAAEAAAACAAAAAwAAAAEAAAACAAAAAwAAAAIAAAADAEGckAELiQEBAAAAAQAAAAEA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")}function OA(A){if(ArrayBuffer.isView(A))return A;if(A==L&&d)return new Uint8Array(d);if(z)return z(A);throw"both async and sync fetching of the wasm failed"}async function zA(A){return OA(A)}async function xA(A,I){try{var C=await zA(A),B=await WebAssembly.instantiate(C,I);return B}catch(o){f(`failed to asynchronously prepare wasm: ${o}`),lA(o)}}async function mA(A,I,C){return xA(I,C)}function WA(){return{a:cI}}async function vA(){function A(i,E){return Y=i.exports,e=Y.e,u(),PI(Y),eA("wasm-instantiate"),Y}bA("wasm-instantiate");function I(i){return A(i.instance)}var C=WA();if(g.instantiateWasm)return new Promise((i,E)=>{g.instantiateWasm(C,(w,K)=>{i(A(w,K))})});L!=null||(L=TA());var B=await mA(d,L,C),o=I(B);return o}class pA{constructor(I){SA(this,"name","ExitStatus");this.message=`Program terminated with exit(${I})`,this.status=I}}var _=A=>{for(;A.length>0;)A.shift()(g)},$=[],XA=A=>$.push(A),AA=[],ZA=A=>AA.push(A),jA=A=>{for(var I,C,B=0,o=0,i=A.length,E=new Uint8Array((i*3>>2)-(A[i-2]=="=")-(A[i-1]=="="));B<i;B+=4,o+=3)I=F[A.charCodeAt(B+1)],C=F[A.charCodeAt(B+2)],E[o]=F[A.charCodeAt(B)]<<2|I>>4,E[o+1]=I<<4|C>>2,E[o+2]=C<<6|F[A.charCodeAt(B+3)];return E},IA=!0,VA=A=>EA(A),uA=()=>iA(),_A=()=>2147483648,$A=(A,I)=>Math.ceil(A/I)*I,AI=A=>{var I=e.buffer.byteLength,C=(A-I+65535)/65536|0;try{return e.grow(C),u(),1}catch(B){}},II=A=>{var I=h.length;A>>>=0;var C=_A();if(A>C)return!1;for(var B=1;B<=4;B*=2){var o=I*(1+.2/B);o=Math.min(o,A+100663296);var i=Math.min(C,$A(Math.max(A,o),65536)),E=AI(i);if(E)return!0}return!1},gI=0,CI=()=>IA||gI>0,BI=A=>{var I;Z=A,CI()||((I=g.onExit)==null||I.call(g,A),x=!0),kA(A,new pA(A))},QI=(A,I)=>{Z=A,BI(A)},EI=QI,DI=9007199254740992,iI=-9007199254740992,oI=A=>A<iI||A>DI?NaN:Number(A);function wI(A,I,C,B){return I=oI(I),70}for(var GI=[null,[],[]],gA=typeof TextDecoder!="undefined"?new TextDecoder:void 0,SI=(A,I,C,B)=>{var o=I+C;if(B)return o;for(;A[I]&&!(I>=o);)++I;return I},CA=(A,I=0,C,B)=>{var o=SI(A,I,C,B);if(o-I>16&&A.buffer&&gA)return gA.decode(A.subarray(I,o));for(var i="";I<o;){var E=A[I++];if(!(E&128)){i+=String.fromCharCode(E);continue}var w=A[I++]&63;if((E&224)==192){i+=String.fromCharCode((E&31)<<6|w);continue}var K=A[I++]&63;if((E&240)==224?E=(E&15)<<12|w<<6|K:E=(E&7)<<18|w<<12|K<<6|A[I++]&63,E<65536)i+=String.fromCharCode(E);else{var U=E-65536;i+=String.fromCharCode(55296|U>>10,56320|U&1023)}}return i},KI=(A,I)=>{var C=GI[A];I===0||I===10?((A===1?X:f)(CA(C)),C.length=0):C.push(I)},sI=(A,I,C)=>A?CA(h,A,I,C):"",yI=(A,I,C,B)=>{for(var o=0,i=0;i<C;i++){var E=l[I>>2],w=l[I+4>>2];I+=8;for(var K=0;K<w;K++)KI(A,h[E+K]);o+=w}return l[B>>2]=o,0},BA=A=>{var I=g["_"+A];return I},FI=(A,I)=>{j.set(A,I)},MI=A=>{for(var I=0,C=0;C<A.length;++C){var B=A.charCodeAt(C);B<=127?I++:B<=2047?I+=2:B>=55296&&B<=57343?(I+=4,++C):I+=3}return I},RI=(A,I,C,B)=>{if(!(B>0))return 0;for(var o=C,i=C+B-1,E=0;E<A.length;++E){var w=A.codePointAt(E);if(w<=127){if(C>=i)break;I[C++]=w}else if(w<=2047){if(C+1>=i)break;I[C++]=192|w>>6,I[C++]=128|w&63}else if(w<=65535){if(C+2>=i)break;I[C++]=224|w>>12,I[C++]=128|w>>6&63,I[C++]=128|w&63}else{if(C+3>=i)break;I[C++]=240|w>>18,I[C++]=128|w>>12&63,I[C++]=128|w>>6&63,I[C++]=128|w&63,E++}}return I[C]=0,C-o},JI=(A,I,C)=>RI(A,h,I,C),QA=A=>DA(A),NI=A=>{var I=MI(A)+1,C=QA(I);return JI(A,C,I),C},UI=(A,I,C,B,o)=>{var i={string:G=>{var q=0;return G!=null&&G!==0&&(q=NI(G)),q},array:G=>{var q=QA(G.length);return FI(G,q),q}};function E(G){return I==="string"?sI(G):I==="boolean"?!!G:G}var w=BA(A),K=[],U=0;if(B)for(var k=0;k<B.length;k++){var wA=i[C[k]];wA?(U===0&&(U=uA()),K[k]=wA(B[k])):K[k]=B[k]}var W=w(...K);function tI(G){return U!==0&&VA(U),E(G)}return W=tI(W),W},kI=(A,I,C,B)=>{var o=!C||C.every(E=>E==="number"||E==="boolean"),i=I!=="string";return i&&o&&!B?BA(A):(...E)=>UI(A,I,C,E,B)},F=new Uint8Array(123),M=25;M>=0;--M)F[48+M]=52+M,F[65+M]=M,F[97+M]=26+M;F[43]=62,F[47]=63,g.noExitRuntime&&(IA=g.noExitRuntime),g.print&&(X=g.print),g.printErr&&(f=g.printErr),g.wasmBinary&&(d=g.wasmBinary),g.arguments&&(O=g.arguments),g.thisProgram&&(J=g.thisProgram),g.cwrap=kI;var hI,aI,LI,YI,qI,HI,EA,DA,iA;function PI(A){g._init_lame=hI=A.g,g._encode_samples=aI=A.h,g._flush_lame=LI=A.i,g._close_lame=YI=A.j,g._free=qI=A.k,g._malloc=HI=A.l,EA=A.m,DA=A.n,iA=A.o}var cI={c:II,a:EI,d:wI,b:yI},Y=await vA();function m(){if(N>0){a=m;return}if(fA(),N>0){a=m;return}function A(){var I;g.calledRun=!0,!x&&(dA(),n==null||n(g),(I=g.onRuntimeInitialized)==null||I.call(g),nA())}g.setStatus?(g.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>g.setStatus(""),1),A()},1)):A()}function rI(){if(g.preInit)for(typeof g.preInit=="function"&&(g.preInit=[g.preInit]);g.preInit.length>0;)g.preInit.shift()()}return rI(),m(),V?Q=g:Q=new Promise((A,I)=>{n=A,b=I}),Q}var KA=nI;var s,c,T,FA,MA,P=!1,v,RA,JA,NA,H=null,y=null,bI=async(D,Q,g)=>{T=D,FA=Q,MA=g,s=await KA(),v=s.cwrap("init_lame","number",["number","number","number"]),RA=s.cwrap("encode_samples","number",["number","number","number","number","number","number"]),JA=s.cwrap("flush_lame","number",["number","number","number"]),NA=s.cwrap("close_lame",null,["number"]),c=v(D,Q,g)},UA=()=>{NA(c),c=v(T,FA,MA)},eI=(D,Q)=>{P&&(UA(),P=!1);let g=new Uint8Array(D),t=g.length/T;H=p(H,g.length),s.HEAPU8.set(g,H.ptr);let S=Math.ceil(1.25*Q+7200);y=p(y,S);let R=RA(c,H.ptr,H.ptr+(T-1)*t,Q,y.ptr,S);return s.HEAPU8.slice(y.ptr,y.ptr+R).buffer},lI=()=>{P&&(UA(),P=!1);let D=7200;y=p(y,D);let Q=JA(c,y.ptr,D),g=s.HEAPU8.slice(y.ptr,y.ptr+Q);return P=!0,g.buffer},p=(D,Q)=>!D||D.size<Q?(D&&s._free(D.ptr),{ptr:s._malloc(Q),size:Q}):D,sA=D=>{let{id:Q,command:g}=D;(async()=>{try{let S,R=[];switch(g.type){case"init":await bI(g.data.numberOfChannels,g.data.sampleRate,g.data.bitrate),S={success:!0};break;case"encode":{let J=eI(g.data.audioData,g.data.numberOfFrames);S={encodedData:J},R.push(J)}break;case"flush":{let J=lI();S={flushedData:J},R.push(J)}break}yA({id:Q,success:!0,data:S},R)}catch(S){yA({id:Q,success:!1,error:S})}})()},yA=(D,Q)=>{r?r.postMessage(D,Q!=null?Q:[]):self.postMessage(D,{transfer:Q!=null?Q:[]})},r=null;typeof self=="undefined"&&(r=GA("worker_threads").parentPort);r?r.on("message",sA):self.addEventListener("message",D=>sA(D.data));\n');
      }
      var Mp3Encoder = class extends CustomAudioEncoder {
        constructor() {
          super(...arguments);
          this.worker = null;
          this.nextMessageId = 0;
          this.pendingMessages = new Map();
          this.buffer = new Uint8Array(2 ** 16);
          this.currentBufferOffset = 0;
          this.currentTimestamp = 0;
          this.chunkMetadata = {};
        }
        static supports(codec, config) {
          return codec === "mp3" && (config.numberOfChannels === 1 || config.numberOfChannels === 2) && Object.values(SAMPLING_RATES).some(
            (x) => x === config.sampleRate || x / 2 === config.sampleRate || x / 4 === config.sampleRate
          );
        }
        async init() {
          this.worker = await Worker2();
          const onMessage = (data) => {
            const pending = this.pendingMessages.get(data.id);
            assert(pending !== void 0);
            this.pendingMessages.delete(data.id);
            if (data.success) {
              pending.resolve(data.data);
            } else {
              pending.reject(data.error);
            }
          };
          if (this.worker.addEventListener) {
            this.worker.addEventListener("message", (event) => onMessage(event.data));
          } else {
            const nodeWorker = this.worker;
            nodeWorker.on("message", onMessage);
          }
          assert(this.config.bitrate);
          await this.sendCommand({
            type: "init",
            data: {
              numberOfChannels: this.config.numberOfChannels,
              sampleRate: this.config.sampleRate,
              bitrate: this.config.bitrate
            }
          });
          this.chunkMetadata = {
            decoderConfig: {
              codec: "mp3",
              numberOfChannels: this.config.numberOfChannels,
              sampleRate: this.config.sampleRate
            }
          };
        }
        async encode(audioSample) {
          const sizePerChannel = audioSample.allocationSize({
            format: "s16-planar",
            planeIndex: 0
          });
          const requiredBytes = audioSample.numberOfChannels * sizePerChannel;
          const audioData = new ArrayBuffer(requiredBytes);
          const audioBytes = new Uint8Array(audioData);
          for (let i = 0; i < audioSample.numberOfChannels; i++) {
            audioSample.copyTo(audioBytes.subarray(i * sizePerChannel), {
              format: "s16-planar",
planeIndex: i
            });
          }
          const result = await this.sendCommand({
            type: "encode",
            data: {
              audioData,
              numberOfFrames: audioSample.numberOfFrames
            }
          }, [audioData]);
          assert("encodedData" in result);
          this.digestOutput(new Uint8Array(result.encodedData));
        }
        async flush() {
          const result = await this.sendCommand({ type: "flush" });
          assert("flushedData" in result);
          this.digestOutput(new Uint8Array(result.flushedData));
        }
        close() {
          this.worker?.terminate();
        }
digestOutput(bytes2) {
          const requiredBufferSize = this.currentBufferOffset + bytes2.length;
          if (requiredBufferSize > this.buffer.length) {
            const newSize = 1 << Math.ceil(Math.log2(requiredBufferSize));
            const newBuffer = new Uint8Array(newSize);
            newBuffer.set(this.buffer);
            this.buffer = newBuffer;
          }
          this.buffer.set(bytes2, this.currentBufferOffset);
          this.currentBufferOffset = requiredBufferSize;
          let pos = 0;
          while (pos <= this.currentBufferOffset - FRAME_HEADER_SIZE) {
            const word = new DataView(this.buffer.buffer).getUint32(pos, false);
            const header = readFrameHeader(word).header;
            if (!header) {
              break;
            }
            const fits = header.totalSize <= this.currentBufferOffset - pos;
            if (!fits) {
              break;
            }
            const data = this.buffer.slice(pos, pos + header.totalSize);
            const duration = header.audioSamplesInFrame / header.sampleRate;
            this.onPacket(new EncodedPacket(data, "key", this.currentTimestamp, duration), this.chunkMetadata);
            if (this.currentTimestamp === 0) {
              this.chunkMetadata = {};
            }
            this.currentTimestamp += duration;
            pos += header.totalSize;
          }
          if (pos > 0) {
            this.buffer.set(this.buffer.subarray(pos, this.currentBufferOffset), 0);
            this.currentBufferOffset -= pos;
          }
        }
        sendCommand(command, transferables) {
          return new Promise((resolve, reject) => {
            const id = this.nextMessageId++;
            this.pendingMessages.set(id, { resolve, reject });
            assert(this.worker);
            if (transferables) {
              this.worker.postMessage({ id, command }, transferables);
            } else {
              this.worker.postMessage({ id, command });
            }
          });
        }
      };
      var registerMp3Encoder = () => {
        registerEncoder(Mp3Encoder);
      };
      function assert(x) {
        if (!x) {
          throw new Error("Assertion failed.");
        }
      }
      const CHUNK_SIZE = 1024 * 1024 * 1;
      const fetchAudioPiece = async (url2, start, end) => {
        const headers = {
          Range: `bytes=${start}-${end ?? ""}`,
          Referer: location.href
        };
        logInfo(`fetching audio piece: ${headers.Range}`);
        const response = await fetch(url2, {
          method: "GET",
          cache: "no-cache",
          headers,
          referrerPolicy: "no-referrer-when-downgrade"
        });
        if (response.status === 416) {
          logInfo("reached last piece");
          if (!end) {
            logError("The previous request was the last piece");
            return void 0;
          }
          throw response;
        }
        if (!response.ok) {
          logError(`response not ok: ${response.statusText}, ${response}`);
          throw new Error("Network response was not ok");
        }
        if (!response.headers.get("Content-Range")) {
          logInfo("content reached the end");
          const endError = new Error("reached the end");
          endError.status = 204;
          throw endError;
        }
        const audioBuffer = await response.arrayBuffer();
        return audioBuffer;
      };
      const fetchAudio = async (url2) => {
        let start = 0;
        let end = CHUNK_SIZE - 1;
        let completed = false;
        const result = [];
        do {
          try {
            const buffer = await fetchAudioPiece(url2, start, end);
            if (!buffer) {
              completed = true;
              continue;
            }
            result.push(buffer);
            start = end + 1;
            end = start + CHUNK_SIZE - 1;
          } catch (e) {
            const err = e;
            console.log(`error: ${err}, status: ${err.status}`);
            if (err.status === 204) {
              completed = true;
            } else if (err.status === 416) {
              const lastPiece = await fetchAudioPiece(url2, start);
              if (lastPiece) {
                result.push(lastPiece);
              }
              completed = true;
            } else {
              throw err;
            }
          }
        } while (!completed);
        return result;
      };
      const getAudioData = async () => {
        const bvid = getVideoInfo("bvid");
        const cid = getVideoInfo("cid");
        logInfo(`bvid: ${bvid}, cid: ${cid}`);
        const videoMetadataResponse = await fetch(
`https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&fnval=80`,
          {
            method: "GET",
            cache: "no-cache",
            referrerPolicy: "no-referrer-when-downgrade"
          }
        );
        const videoMetadata = await videoMetadataResponse.json();
        const audioUrlList = videoMetadata.data.dash.audio;
        if (Array.isArray(audioUrlList) && audioUrlList.length > 0) {
          const hiresAudio = audioUrlList.find((audio) => audio.id === 30251);
          const dobyAudio = audioUrlList.find((audio) => audio.id === 30250);
          audioUrlList.sort((a, b) => b.id - a.id);
          const highestQualityAudio = hiresAudio || dobyAudio || audioUrlList[0];
          const { baseUrl, mimeType } = highestQualityAudio;
          const audioResult = await fetchAudio(baseUrl);
          const wholeBlob = new Blob(audioResult, { type: mimeType });
          const buffer = await wholeBlob.arrayBuffer();
          logInfo("audio buffer fetched");
          return { buffer, mimeType };
        }
      };
      const getImageData = async (imageUrl) => {
        const imageResponse = await fetch(imageUrl.replace("http", "https"));
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        return imageArrayBuffer;
      };
      const createMedia = async (options) => {
        if (!await canEncodeAudio("mp3")) {
          registerMp3Encoder();
        }
        const { audioBuffer, coverImageArrayBuffer, title, artist } = options;
        const output = new Output({
          format: new Mp3OutputFormat(),
          target: new BufferTarget()
        });
        const audioSource = new AudioBufferSource({
          codec: "mp3",
          bitrate: QUALITY_HIGH
        });
        output.addAudioTrack(audioSource);
        output.setMetadataTags({
          title,
          artist,
          images: [
            {
              data: new Uint8Array(coverImageArrayBuffer),
              mimeType: "image/jpeg",
              kind: "coverFront"
            }
          ],
          raw: {
            TPUB: `https://${window.location.hostname + window.location.pathname}`
          }
        });
        await output.start();
        await audioSource.add(audioBuffer);
        await output.finalize();
        return output.target.buffer;
      };
      const trimAudio = async (audioFile, start, end) => {
        const input = new Input({
          formats: [MP3],
          source: new BlobSource(audioFile)
        });
        const output = new Output({
          format: new Mp3OutputFormat(),
          target: new BufferTarget()
        });
        const conversion = await Conversion.init({ input, output, trim: { start, end } });
        await conversion.execute();
        if (!output.target.buffer) {
          logError("no output buffer");
          throw new Error("no output buffer");
        }
        return output.target.buffer;
      };
      const acquireAudioBuffer = async () => {
        const data = await getAudioData();
        if (!data) {
          logError("no audio data retrieved");
          return { audioBuffer: null, mimeType: null };
        }
        const { buffer, mimeType } = data;
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(buffer);
        return { audioBuffer, mimeType };
      };
      const downloadAudio = async (options) => {
        const {
          filename,
          title,
          author,
          coverImageUrl,
          audioBuffer,
          mimeType,
          start = 0,
          end = audioBuffer.duration
        } = options;
        const coverImageArrayBuffer = await getImageData(coverImageUrl);
        const mediaFileBuffer = await createMedia({
          audioBuffer,
          coverImageArrayBuffer,
          title,
          artist: author
        });
        if (!mediaFileBuffer) {
          logError("failed to create media file");
          return;
        }
        let mediaFileBlob = new Blob([mediaFileBuffer], { type: mimeType });
        if (start !== 0 || end !== audioBuffer.duration) {
          mediaFileBlob = new Blob([await trimAudio(mediaFileBlob, start, end)], { type: mimeType });
        }
        const mediaFileUrl = URL.createObjectURL(mediaFileBlob);
        download(mediaFileUrl, filename);
        URL.revokeObjectURL(mediaFileUrl);
      };
      const getLyricsTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const rest = seconds - minutes * 60;
        return `${minutes < 10 ? "0" : ""}${minutes}:${rest < 10 ? "0" : ""}${rest.toFixed(2)}`;
      };
      const getLyrics = async () => {
        const initialState = getInitialState();
        if (!Array.isArray(initialState?.videoData?.subtitle?.list) || initialState.videoData.subtitle.list.length === 0)
          return Promise.resolve(null);
        const defaultLyricsUrl = initialState.videoData.subtitle.list[0].subtitle_url;
        const response = await fetch(defaultLyricsUrl.replace("http", "https"));
        const lyricsObject = await response.json();
        if (!lyricsObject) return null;
        const videoElement = document.querySelector("#bilibiliPlayer .bilibili-player-video bwp-video") || document.querySelector("#bilibiliPlayer .bilibili-player-video video");
        if (!videoElement) return null;
        const lyricsText = lyricsObject.body.reduce((accu, current) => {
          accu += `[${getLyricsTime(current.from)}]${current.content}\r
`;
          return accu;
        }, "");
        return lyricsText;
      };
      var root_2 = from_html(`<!> <!> <!>`, 1);
      var root_3 = from_html(`<div class="ActionsContainer svelte-1n46o8q"><div class="ActionsContainer__MainAction svelte-1n46o8q"><!></div> <!></div>`);
      var root_5 = from_html(`<div class="AudioWaveformContainer svelte-1n46o8q"><!> <!></div>`);
      var root_6 = from_html(`<div class="ActionsContainer svelte-1n46o8q"><div class="ActionsContainer__MainAction svelte-1n46o8q"><!></div> <!></div>`);
      var root_8 = from_html(`<div class="ActionsError svelte-1n46o8q"> </div>`);
      var root_7 = from_html(`<!> <!> <!> <div class="ActionsContainer svelte-1n46o8q"><!></div>`, 1);
      function App($$anchor, $$props) {
        push($$props, true);
        const infoStep = ($$anchor2, goNext = noop, _goPrevious = noop) => {
          const infoContent = ($$anchor3) => {
            var fragment = root_2();
            var node = first_child(fragment);
            InfoItem(node, {
              get label() {
                return strings.infoItems.filename;
              },
              get value() {
                return get(filename);
              },
              set value($$value) {
                set(filename, $$value, true);
              }
            });
            var node_1 = sibling(node, 2);
            InfoItem(node_1, {
              get label() {
                return strings.infoItems.title;
              },
              get value() {
                return get(title);
              },
              set value($$value) {
                set(title, $$value, true);
              }
            });
            var node_2 = sibling(node_1, 2);
            InfoItem(node_2, {
              get label() {
                return strings.infoItems.author;
              },
              get value() {
                return get(artist);
              },
              set value($$value) {
                set(artist, $$value, true);
              }
            });
            append($$anchor3, fragment);
          };
          const infoActions = ($$anchor3) => {
            var div = root_3();
            var div_1 = child(div);
            var node_3 = child(div_1);
            {
              let $0 = user_derived(() => get(downloading) ? strings.fetch.processing : strings.fetch.idle);
              ActionButton(node_3, {
                get label() {
                  return get($0);
                },
                onClick: async () => {
                  await onFetchClick();
                  goNext()();
                },
                get disabled() {
                  return get(downloading);
                }
              });
            }
            var node_4 = sibling(div_1, 2);
            {
              let $0 = user_derived(() => get(hasLyrics) ? strings.download.lyrics : strings.download.noLyrics);
              let $1 = user_derived(() => !get(hasLyrics));
              ActionButton(node_4, {
                get label() {
                  return get($0);
                },
                get disabled() {
                  return get($1);
                },
                onClick: onLyricsClick
              });
            }
            append($$anchor3, div);
          };
          Step($$anchor2, {
            get contents() {
              return infoContent;
            },
            get actions() {
              return infoActions;
            }
          });
        };
        const audioStep = ($$anchor2, goNext = noop, goPrevious = noop) => {
          const audioContent = ($$anchor3) => {
            var div_2 = root_5();
            var node_5 = child(div_2);
            AudioWaveform(node_5, {
              get waveform() {
                return get(audioWaveform);
              }
            });
            var node_6 = sibling(node_5, 2);
            {
              let $0 = user_derived(() => get(audioBuffer)?.duration);
              AudioRangeSelector(node_6, {
                get length() {
                  return get($0);
                },
                onStartChange: onAudioStartChange,
                onEndChange: onAudioEndChange,
                get playing() {
                  return get(playing);
                },
                get progress() {
                  return get(progress);
                },
                onPlayStopClick,
                onPlaybackStartDrag,
                onPlaybackDrag,
                onPlaybackEndDrag
              });
            }
            append($$anchor3, div_2);
          };
          const audioActions = ($$anchor3) => {
            var div_3 = root_6();
            var div_4 = child(div_3);
            var node_7 = child(div_4);
            {
              let $0 = user_derived(() => get(downloading) ? strings.download.processing : strings.download.idle);
              ActionButton(node_7, {
                get label() {
                  return get($0);
                },
                onClick: onDownloadClick,
                get disabled() {
                  return get(downloading);
                }
              });
            }
            var node_8 = sibling(div_4, 2);
            ActionButton(node_8, {
              get label() {
                return strings.navigation.back;
              },
              onClick: () => {
                goPrevious()();
              },
              get disabled() {
                return get(downloading);
              },
              kind: "tertiary"
            });
            append($$anchor3, div_3);
          };
          Step($$anchor2, {
            get contents() {
              return audioContent;
            },
            get actions() {
              return audioActions;
            }
          });
        };
        const THROTTLE_INTERVAL = 100;
        const SHORT_PLAYBACK_DURATION = 0.25;
        const PROGRESS_INTERVAL = 200;
        let lastPlayTime = 0;
        let playbackStartTime = 0;
        let playbackStartPosition = 0;
        let playbackTimer = null;
        let containerOpen = state(false);
        const draggable = createDraggable({
          storageKey: "bem/container-position",
          onToggle: () => {
            set(containerOpen, !get(containerOpen));
          }
        });
        const videoName = getVideoInfo("name").replace(dummyText, "");
        const author = getVideoInfo("author");
        let filename = state(`${videoName}.mp3`);
        let title = state(proxy(videoName));
        let artist = state(proxy(author));
        let hasLyrics = state(false);
        let lyrics = state(void 0);
        let downloading = state(false);
        let error = state("");
        let audioBuffer = state(null);
        let mimeType = state(null);
        let audioWaveform = user_derived(() => {
          if (!get(audioBuffer)) return [];
          return getAudioWaveform(get(audioBuffer));
        });
        let audioStartSecond = state(0);
        let audioEndSecond = state(0);
        let playing = state(false);
        let progress = state(0);
        let source2 = state(null);
        getLyrics().then((fetchedLyrics) => {
          if (fetchedLyrics) {
            set(hasLyrics, true);
            set(lyrics, fetchedLyrics, true);
          } else {
            set(hasLyrics, false);
            set(lyrics, void 0);
          }
        });
        const imageUrl = getVideoInfo("image");
        const onFetchClick = async () => {
          try {
            set(downloading, true);
            set(error, "");
            const { audioBuffer: buffer, mimeType: type } = await acquireAudioBuffer();
            set(audioBuffer, buffer, true);
            set(mimeType, type, true);
            set(audioStartSecond, 0);
            set(audioEndSecond, buffer?.duration ?? 0, true);
          } catch (e) {
            set(error, e.message, true);
            throw e;
          } finally {
            set(downloading, false);
          }
        };
        const clearPlayback = () => {
          if (playbackTimer) {
            clearInterval(playbackTimer);
            playbackTimer = null;
          }
        };
        const playAtPosition = (position, duration = SHORT_PLAYBACK_DURATION) => {
          if (!get(audioBuffer)) return;
          if (playbackTimer) {
            clearInterval(playbackTimer);
            playbackTimer = null;
          }
          get(source2)?.stop();
          const audioCtx = new AudioContext();
          const end = Math.min(position + duration, get(audioBuffer).duration);
          const playbackDuration = end - position;
          set(source2, audioCtx.createBufferSource(), true);
          get(source2).buffer = get(audioBuffer);
          get(source2).connect(audioCtx.destination);
          get(source2).onended = () => {
            clearPlayback();
          };
          playbackStartTime = audioCtx.currentTime;
          playbackStartPosition = position;
          get(source2).start(0, position, playbackDuration);
          return audioCtx;
        };
        const throttledPlayAtPosition = (position, duration = SHORT_PLAYBACK_DURATION) => {
          const now = performance.now();
          if (now - lastPlayTime < THROTTLE_INTERVAL) {
            return;
          }
          lastPlayTime = now;
          playAtPosition(position, duration);
        };
        const trackProgress = (audioCtx) => {
          if (!audioCtx) {
            return null;
          }
          return setInterval(
            () => {
              const elapsed = audioCtx.currentTime - playbackStartTime;
              set(progress, playbackStartPosition + elapsed);
            },
            PROGRESS_INTERVAL
          );
        };
        const onPlayStopClick = () => {
          if (get(playing) || !get(audioBuffer)) {
            get(source2)?.stop();
            clearPlayback();
            set(playing, false);
            set(progress, get(audioStartSecond), true);
          } else {
            const start = Math.max(get(audioStartSecond), get(progress));
            set(playing, true);
            const audioCtx = playAtPosition(start, get(audioEndSecond) - start);
            playbackTimer = trackProgress(audioCtx);
          }
        };
        user_effect(() => {
          if (get(playing) && get(progress) >= get(audioEndSecond) - PROGRESS_INTERVAL / 1e3) {
            onPlayStopClick();
          }
        });
        const onPlaybackDrag = (value) => {
          const clampedValue = Math.min(Math.max(value, get(audioStartSecond)), get(audioEndSecond));
          set(progress, clampedValue, true);
        };
        const onPlaybackStartDrag = () => {
          get(source2)?.stop();
          clearPlayback();
        };
        const onPlaybackEndDrag = () => {
          const audioCtx = playAtPosition(get(progress), get(audioEndSecond) - get(progress));
          playbackTimer = trackProgress(audioCtx);
        };
        const onAudioStartChange = (value) => {
          set(audioStartSecond, value, true);
          set(progress, Math.max(get(progress), get(audioStartSecond)), true);
          throttledPlayAtPosition(value);
        };
        const onAudioEndChange = (value) => {
          set(audioEndSecond, value, true);
          set(progress, Math.min(get(progress), get(audioEndSecond)), true);
          throttledPlayAtPosition(value - SHORT_PLAYBACK_DURATION);
        };
        const onDownloadClick = async () => {
          if (!get(audioBuffer) || !get(mimeType)) return;
          try {
            set(downloading, true);
            set(error, "");
            await downloadAudio({
              audioBuffer: get(audioBuffer),
              mimeType: get(mimeType),
              filename: get(filename),
              title: get(title),
              author: get(artist),
              coverImageUrl: imageUrl,
              start: get(audioStartSecond),
              end: get(audioEndSecond)
            });
          } catch (e) {
            set(error, e.message, true);
          } finally {
            set(downloading, false);
          }
        };
        const onLyricsClick = async () => {
          const lyricsText = `[ti:${get(title)}]
[ar:${author}]
${get(lyrics)}`.trim();
          const blob = new Blob([lyricsText], { type: "text/plain" });
          const lyricsUrl = URL.createObjectURL(blob);
          download(lyricsUrl, get(filename).replace(/\.[^\s\.]+$/, ".lrc"));
        };
        const cleanUp = (element) => {
          return () => {
            get(source2)?.stop();
            get(source2)?.disconnect();
          };
        };
        Container($$anchor, {
          [createAttachmentKey()]: cleanUp,
          get open() {
            return get(containerOpen);
          },
          get isDragging() {
            return draggable.isDragging;
          },
          get position() {
            return draggable.position;
          },
          children: ($$anchor2, $$slotProps) => {
            var fragment_4 = root_7();
            var node_9 = first_child(fragment_4);
            Header(node_9, {
              get onHeaderIconClick() {
                return draggable.onClick;
              },
              get onDragStart() {
                return draggable.onDragStart;
              },
              get onHeaderIconDblClick() {
                return draggable.onDblClick;
              }
            });
            var node_10 = sibling(node_9, 2);
            Cover(node_10, {
              get imageUrl() {
                return imageUrl;
              }
            });
            var node_11 = sibling(node_10, 2);
            {
              let $0 = user_derived(() => [infoStep, audioStep]);
              StepContainer(node_11, {
                get steps() {
                  return get($0);
                }
              });
            }
            var div_5 = sibling(node_11, 2);
            var node_12 = child(div_5);
            {
              var consequent = ($$anchor3) => {
                var div_6 = root_8();
                var text = child(div_6);
                template_effect(() => set_text(text, get(error)));
                append($$anchor3, div_6);
              };
              if_block(node_12, ($$render) => {
                if (get(error).length > 0) $$render(consequent);
              });
            }
            append($$anchor2, fragment_4);
          },
          $$slots: { default: true }
        });
        pop();
      }
      const playerElementIds = ["bilibiliPlayer", "bilibili-player"];
      const getBilibiliPlayer = () => {
        let bilibiliPlayer2;
        for (const id of playerElementIds) {
          bilibiliPlayer2 = document.getElementById(id);
          if (bilibiliPlayer2) break;
        }
        return bilibiliPlayer2;
      };
      const appCss = ":root{--bme-color-primary: #00a1d6;--bme-color-secondary: #ffb400;--bme-color-error: #fb7299;--bme-color-inactive: #606060;--bme-color-disabled: #cccccc;--bme-color-light-text: #f4f4f4;--bme-color-dark-text: #333333;--bme-spacing-xsmall: .25rem;--bme-spacing-small: .5rem;--bme-spacing-medium: 1rem;--bme-spacing-large: 2rem;--bme-spacing-xlarge: 3rem;--bme-border-radius-small: .125rem;--bme-border-radius-medium: .25rem;--bme-border-radius-large: .5rem;--bme-border-width-small: 1px;--bme-border-width-medium: 2px;--bme-border-width-large: 4px;--bme-z-index: 1000000}";
      importCSS(appCss);
      const bilibiliPlayer = getBilibiliPlayer();
      bilibiliPlayer ? mount(App, {
        target: (() => {
          logInfo("Bilibili player found, mounting app...");
          const app2 = document.createElement("div");
          bilibiliPlayer.appendChild(app2);
          return app2;
        })()
      }) : null;

      const __viteBrowserExternalL0sNRNKZ = Object.freeze( Object.defineProperty({
        __proto__: null
      }, Symbol.toStringTag, { value: 'Module' }));

    })
  };
}));

System.import("./__entry.js", "./");