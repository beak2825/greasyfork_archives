// ==UserScript==
// @name         plab-ultra
// @namespace    https://github.com/clangmoyai/plab-ultra
// @version      2025.09.18
// @author       clangmoyai
// @description  Userscript for PornoLab.Net
// @license      MIT
// @icon         https://github.com/clangmoyai/plab-ultra/raw/main/src/assets/logo64.png
// @homepage     https://github.com/clangmoyai/plab-ultra
// @supportURL   https://github.com/clangmoyai/plab-ultra/issues
// @match        https://pornolab.net/forum/viewtopic.php*
// @tag          pornolab
// @tag          pornolab.net
// @connect      *
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546450/plab-ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/546450/plab-ultra.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(` .ultra-logo.svelte-zne36e{width:16px;display:inline-flex;vertical-align:top;margin:0 .45rem 0 0}.ultra-logo.svelte-zne36e:hover{cursor:pointer}#x-header.svelte-zne36e{--header-height: 4.5rem;display:grid;grid-template-columns:auto 1fr;column-gap:1rem;margin-bottom:var(--content-margin);min-height:var(--header-height)}.floatingDownload.svelte-zne36e{padding-right:5rem}.logo.svelte-zne36e{height:var(--header-height)}.logo.svelte-zne36e img:where(.svelte-zne36e){height:100%;border-radius:var(--border-radius-large)}.align-right.svelte-zne36e{display:flex;justify-content:flex-end;min-width:0}.container.svelte-zne36e{display:flex;flex-direction:column;min-width:0;row-gap:1rem}.links.svelte-zne36e{display:flex;min-width:0;flex-wrap:nowrap;justify-content:end}.unread.svelte-zne36e{color:var(--highlighted);filter:brightness(1.25)}.item.svelte-zne36e{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.item.svelte-zne36e+.item:where(.svelte-zne36e):before{display:inline-block;content:"|";margin:0 .8rem;color:var(--post-border-color);transform:translateY(-1px)}.search.svelte-zne36e{display:flex;gap:.5rem}.search.svelte-zne36e input:where(.svelte-zne36e){flex:1 1 auto;min-width:0;border:1px solid var(--post-border-color);color:var(--search-color);background:var(--input-bg)!important;padding:.3rem .5rem .4rem;border-radius:var(--border-radius-small);font-size:.8rem!important;font-family:inherit}.search.svelte-zne36e button:where(.svelte-zne36e){background:var(--input-bg)!important;border:1px solid var(--post-border-color)!important;width:1.75rem;border-radius:var(--border-radius-small)}.incognito.svelte-zne36e{filter:var(--incognito-filter)!important}.themeIcon.svelte-zne36e a,.themeIcon.svelte-zne36e a:hover{text-decoration:none!important}@media (max-width: 768px){#x-header.svelte-zne36e{grid-template-columns:1fr}.logo.svelte-zne36e{display:none}.container.svelte-zne36e{width:100%}}.container.svelte-1emp0k3{display:flex;gap:1.15rem;justify-content:space-between}.column.svelte-1emp0k3{display:flex;flex-direction:column;overflow:hidden;gap:.75rem}h2.svelte-1emp0k3{margin:0;margin-bottom:.25rem;font-size:1rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}input[type=checkbox].svelte-1emp0k3{margin:4px}label.svelte-1emp0k3{display:flex;align-items:center;gap:.5rem}.disabled.svelte-1emp0k3{text-decoration:line-through;cursor:default}span.svelte-1emp0k3{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.description.svelte-1emp0k3{opacity:.5}input[type=checkbox].svelte-1emp0k3:disabled{cursor:default}@media (max-width: 1200px){.container.svelte-1emp0k3{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,auto);gap:1rem;justify-content:stretch}.column.svelte-1emp0k3{min-width:0}}@media (max-width: 768px){.container.svelte-1emp0k3{display:flex;flex-direction:column;gap:1rem}.column.svelte-1emp0k3{min-width:0;width:100%}}button.svelte-1obhcw8{all:unset;display:flex;justify-content:center;align-items:center;cursor:pointer;-webkit-user-select:none;user-select:none;white-space:nowrap;background:var(--button-color)!important;border:none!important;border-radius:var(--border-radius-small);padding:.4rem .5rem;font-family:inherit;font-weight:500;font-size:.8rem;color:#fff;transition:background-color opacity 1.8s ease-in-out}button.svelte-1obhcw8:disabled{background-color:var(--post-border-color)!important;opacity:.5;cursor:not-allowed}svg.svelte-1obhcw8{position:absolute}svg.svelte-1obhcw8 path:where(.svelte-1obhcw8){transform-origin:center;fill:#fff}.container.svelte-1hugea{display:flex;justify-content:space-between;align-items:center;margin-top:1rem}.align-right.svelte-1hugea{display:flex;gap:.5rem}.container.svelte-kvmnko{display:flex;flex-direction:column;margin-top:1.25rem}.item.svelte-kvmnko{display:grid;grid-template-columns:min-content minmax(0,10rem) 1fr auto;align-items:center;gap:.75rem;min-width:0;margin-bottom:.5rem}img.svelte-kvmnko{width:.9rem;height:.9rem;flex-shrink:0}input[type=text].svelte-kvmnko{padding:.3rem .5rem .4rem;border:1px solid var(--post-border-color);border-radius:var(--border-radius-small);font-size:.8rem!important;background:var(--input-bg)!important;color:inherit;font:inherit;min-width:0}button.svelte-kvmnko{background:#a62f2fbf!important;border-radius:var(--border-radius-small);font-size:1.2rem;border:none!important;color:#fff!important;display:flex;align-items:center;width:1.5rem;height:1.5rem;align-items:flex-end;justify-content:center;-webkit-user-select:none;user-select:none}button.svelte-kvmnko:hover{background:#a62f2f!important}div.svelte-1kxfd5y{font-size:.8rem;position:relative;background:var(--post-bg);border:1px solid var(--post-border-color);padding:.9rem 1rem 1rem;border-radius:var(--border-radius-large);overflow:hidden;display:flex;flex-flow:column;font-family:inherit;margin-bottom:var(--content-margin)}button.svelte-1kxfd5y{position:absolute;top:.6rem;right:.6rem;background:none!important;border:none;font-size:1.5rem;cursor:pointer;flex-shrink:0;-webkit-user-select:none;user-select:none}div.svelte-wvkwp9{position:fixed;top:1.3rem;right:2.5rem;z-index:9999;border-radius:var(--border-radius-large);padding:.35rem;border:1px solid var(--post-border-color);background-color:#009c3c!important}button.svelte-wvkwp9{cursor:pointer;aspect-ratio:1 / 1;--size: 1.7rem;width:var(--size);background-color:#fff!important}.ic--sharp-download.svelte-wvkwp9{display:inline-block;--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z'/%3E%3C/svg%3E");background-color:currentColor;-webkit-mask-image:var(--svg);mask-image:var(--svg);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%}.container.svelte-vtocc6{position:absolute;z-index:2;transform:translate(-50%);padding-top:.2rem}.indicator.svelte-vtocc6{position:absolute;left:calc(50% - 8px);border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:7px solid var(--post-border-color)}.items.svelte-vtocc6{margin-top:7px;position:relative;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-radius:var(--border-radius-large);-webkit-user-select:none;user-select:none;border:1px solid var(--post-border-color);box-shadow:#00000040 0 25px 50px -12px;background:var(--overlay-bg);white-space:nowrap}.items.svelte-vtocc6 img:where(.svelte-vtocc6){width:.9rem;height:1rem;width:1rem;-webkit-user-drag:none}.items.svelte-vtocc6 a:where(.svelte-vtocc6){display:flex;align-items:center;gap:.75rem;font-size:.9rem;font-weight:500;text-decoration:none;padding:.5rem 1rem;-webkit-user-drag:none}.items.svelte-vtocc6 a:where(.svelte-vtocc6):hover{color:unset}.items.svelte-vtocc6 a:where(.svelte-vtocc6):first-of-type{padding-top:.9rem}.items.svelte-vtocc6 a:where(.svelte-vtocc6):last-of-type{padding-bottom:1rem}#x-title.svelte-1gft3h5{font-size:1.375rem;margin-top:0;margin-bottom:var(--content-margin)}.original-title.svelte-1gft3h5{text-decoration:none}.title-item.svelte-1gft3h5{color:unset;text-decoration:none}.title-item.svelte-1gft3h5:hover,.title-item--hover{text-decoration:underline!important;color:var(--link-color)!important;cursor:pointer}button.svelte-1ai34w7{all:unset;cursor:pointer;background:none!important}button.svelte-1ai34w7:disabled{cursor:text;-webkit-user-select:text;user-select:text}#thx-btn{all:unset!important}#x-stats.svelte-cjprq{display:flex;flex-wrap:wrap;gap:.8rem;font-weight:500;font-size:.8rem;margin-bottom:var(--content-margin)}.item.svelte-cjprq:not(:last-child):after{display:inline-block;content:"|";color:var(--post-border-color);margin-left:.8rem;transform:translateY(-1px)}button.svelte-cjprq{all:unset;cursor:pointer;background:none!important}button.svelte-cjprq:disabled{cursor:text;-webkit-user-select:text;user-select:text}.seeders.svelte-cjprq{color:var(--seed-color)}.leechers.svelte-cjprq,.error.svelte-cjprq{color:var(--leech-color)}#x-tags.svelte-ttnt4a{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:var(--content-margin)}.tag-item.svelte-ttnt4a{display:inline-flex;align-items:center;justify-content:center;padding:.25rem .6rem .255rem;border-radius:var(--border-radius-small);font-size:.7rem;white-space:nowrap;text-decoration:none;cursor:pointer;font-weight:500;opacity:.75;transition:opacity .1s ease;color:var(--tag-color);background-color:var(--tag-bg);row-gap:.35rem;column-gap:.35rem;transition:opacity .15s ease-in-out}.tag-item.svelte-ttnt4a:hover,.tag-item--hover{opacity:1!important;text-decoration:none!important}.tag-res.svelte-ttnt4a{background:var(--highlighted)!important;color:#fff!important;opacity:1}.filelist.svelte-1xito9{background:var(--post-bg);border:1px solid var(--post-border-color);padding:.75rem;border-radius:var(--border-radius-large);margin-bottom:var(--content-margin)}.filelist.svelte-1xito9 i{color:var(--link-color);font-style:normal;font-weight:500}div.svelte-x5vner{column-gap:.75rem;column-fill:balance}.dragging.svelte-x5vner{cursor:ew-resize}.loader.svelte-bb97q4{width:15%;height:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}svg.svelte-bb97q4{width:100%;height:auto;will-change:transform}svg.svelte-bb97q4 path:where(.svelte-bb97q4){fill:#fff}.animate.svelte-bb97q4{animation:svelte-bb97q4-spin 1s linear infinite;transform-origin:center center}@keyframes svelte-bb97q4-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.debug.svelte-swtc1e{position:relative;display:flex;flex-direction:column;font-family:monospace;background:var(--button-color);padding:1rem;width:-webkit-fill-available;color:#fff;-webkit-user-select:text;user-select:text;word-wrap:break-word;gap:.4rem}.debug.svelte-swtc1e a:where(.svelte-swtc1e){color:#fff;text-decoration:none;display:contents}.debug.svelte-swtc1e p:where(.svelte-swtc1e){word-break:break-all}.error.svelte-swtc1e{color:red}.copy.svelte-swtc1e{position:absolute;top:.5rem;right:.5rem;background:none!important;border:none;font-size:1.5rem;cursor:pointer;flex-shrink:0}svg.svelte-swtc1e path:where(.svelte-swtc1e){transform-origin:center;fill:#fff;transform:translateY(2px)}.image-columns.svelte-1bzlgy6{display:flex;grid-template-columns:auto auto 1fr;position:absolute;top:-1px;right:-1px;background:transparent!important;padding:.75rem;z-index:2;background:var(--overlay-bg)!important;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-radius:0 0 0 var(--border-radius-large);border:1px solid var(--post-border-color);transition:box-shadow .2s ease-in-out;box-shadow:#0000 0 25px 50px -12px}.image-columns.svelte-1bzlgy6:hover{box-shadow:#00000040 0 25px 50px -12px}svg.svelte-1bzlgy6{--size: 1.25rem;width:var(--size);height:var(--size);fill:#fff;opacity:.75;mix-blend-mode:difference}.slider.svelte-1bzlgy6{display:flex;gap:.55rem}input.svelte-1bzlgy6{margin-left:.75rem}.value.svelte-1bzlgy6{--size: 1.25rem;width:var(--size);height:var(--size);font-weight:500;font-size:.75rem;background:var(--tag-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none}.value.svelte-1bzlgy6 .text:where(.svelte-1bzlgy6){margin-top:-1px;color:var(--tag-color)}.section.svelte-27jg01{display:grid;padding:1rem;justify-items:center;margin-bottom:var(--content-margin);position:relative}a.svelte-27jg01{position:relative;display:block;overflow:hidden}.container.svelte-27jg01{border-radius:var(--border-radius-small);height:min-content;overflow:hidden;break-inside:avoid;margin-bottom:.75rem}img.svelte-27jg01{width:100%;height:auto;border:none;flex:1 0 100%;-webkit-user-select:none;user-select:none;will-change:width;display:block;word-break:break-all}a.gif.svelte-27jg01{width:fit-content}img.gif.svelte-27jg01{width:auto;max-width:100%}.incognito.svelte-27jg01{filter:var(--incognito-filter)!important}.dragging.svelte-27jg01 a:where(.svelte-27jg01),.dragging.svelte-27jg01 img:where(.svelte-27jg01){pointer-events:none}.forumline.svelte-wfy26x{padding:1rem;position:relative;display:flex;flex-direction:column;align-items:center}.section.svelte-wfy26x{margin-bottom:var(--content-margin)}a.svelte-wfy26x{color:#4da3ff;text-decoration:none}a.svelte-wfy26x:hover{text-decoration:underline}.post.svelte-wfy26x{display:flex;gap:1rem;padding:1rem;border-bottom:1px solid var(--post-border-color)}.post.svelte-wfy26x:nth-child(2n){background-color:var(--post-odd-bg)}.post.svelte-wfy26x:last-child{border-bottom:none}.avatar.svelte-wfy26x img:where(.svelte-wfy26x){width:48px;height:48px;border-radius:var(--border-radius-small);object-fit:cover;border:1px solid var(--post-border-color)}.no-avatar.svelte-wfy26x{display:flex;width:48px;height:48px;text-align:center;line-height:48px;background:var(--main-bg);border:1px solid var(--post-border-color);border-radius:var(--border-radius-small);font-size:1.3rem;cursor:pointer;justify-content:center;align-items:center}.no-avatar.svelte-wfy26x svg:where(.svelte-wfy26x){width:55%;height:55%}.no-avatar.svelte-wfy26x:hover{text-decoration:none!important}.content.svelte-wfy26x{flex:1}.header.svelte-wfy26x{font-size:.8rem;color:#bbb;margin-block-end:.4rem;display:flex;gap:.5rem;align-items:center}.nick.svelte-wfy26x{font-weight:600}.date.svelte-wfy26x{all:unset!important;color:var(--post-date-color)!important;font-weight:400!important;opacity:.8!important;cursor:pointer!important}.date.svelte-wfy26x:hover{opacity:1!important}.message.svelte-wfy26x{margin:0;line-height:1.4}#ultra-pagination.svelte-dlb7of{display:flex;justify-content:space-between;font-size:.75rem;font-weight:600;margin-bottom:var(--content-margin)}#ultra-pagination a{text-decoration:none!important} `);

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
  function is_promise(value) {
    return typeof value?.then === "function";
  }
  function run(fn) {
    return fn();
  }
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
  function to_array(value, n) {
    if (Array.isArray(value)) {
      return value;
    }
    if (!(Symbol.iterator in value)) {
      return Array.from(value);
    }
    const array = [];
    for (const element of value) {
      array.push(element);
      if (array.length === n) break;
    }
    return array;
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
  function lifecycle_outside_component(name) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }
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
  const PROPS_IS_RUNES = 1 << 1;
  const PROPS_IS_UPDATED = 1 << 2;
  const PROPS_IS_BINDABLE = 1 << 3;
  const PROPS_IS_LAZY_INITIAL = 1 << 4;
  const TRANSITION_IN = 1;
  const TRANSITION_OUT = 1 << 1;
  const TRANSITION_GLOBAL = 1 << 2;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
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
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
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
      l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
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
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
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
    const d = is_runes() ? derived : derived_safe_equal;
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
function state$1(v, stack) {
    const s = source(v);
    push_reaction_value(s);
    return s;
  }
function mutable_source(initial_value, immutable = false, trackable = true) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
      (component_context.l.s ??= []).push(s);
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
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      if (!runes && reaction === active_effect) continue;
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
    var version = state$1(0);
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
      sources.set("length", state$1(
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
              var s2 = state$1(descriptor.value);
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
              const s2 = with_parent(() => state$1(UNINITIALIZED));
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
              var s2 = state$1(p);
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
                var s2 = state$1(p);
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
                other_s = with_parent(() => state$1(UNINITIALIZED));
                sources.set(i + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || get_descriptor(target, prop2)?.writable) {
              s = with_parent(() => state$1(void 0));
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
  var $document;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    $document = document;
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
  function listen_to_event_and_reset_event(element, event2, handler, on_reset = handler) {
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
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
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
  function user_pre_effect(fn) {
    validate_effect();
    return create_effect(RENDER_EFFECT | USER_EFFECT, fn, true);
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
      for (const transition2 of transitions) {
        transition2.stop();
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
      for (const transition2 of effect2.transitions) {
        if (transition2.is_global || local) {
          transition2.in();
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
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
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
  function deep_read(value, visited = new Set()) {
    if (typeof value === "object" && value !== null &&
!(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e) {
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
            } catch (e) {
            }
          }
        }
      }
    }
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  const all_registered_events = new Set();
  const root_event_handles = new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return without_reactive_context(() => {
          return handler?.call(this, event2);
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
  function on(element, type, handler, options = {}) {
    var target_handler = create_event(type, element, handler, options);
    return () => {
      element.removeEventListener(type, target_handler, options);
    };
  }
  function event(event_name, dom, handler, capture2, passive) {
    var options = { capture: capture2, passive };
    var target_handler = create_event(event_name, dom, handler, options);
    if (dom === document.body ||
dom === window ||
dom === document ||
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
  let last_propagated_event = null;
  function handle_event_propagation(event2) {
    var handler_element = this;
    var owner_document = (
handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = event2.composedPath?.() || [];
    var current_target = (
path[0] || event2.target
    );
    last_propagated_event = event2;
    var path_idx = 0;
    var handled_at = last_propagated_event === event2 && event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element ===
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
    current_target =
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
        var parent_element = current_target.assignedSlot || current_target.parentNode ||
current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!
current_target.disabled ||

event2.target === current_target)) {
            if (is_array(delegated)) {
              var [fn, ...data2] = delegated;
              fn.apply(current_target, [event2, ...data2]);
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
  function head(render_fn) {
    var anchor;
    {
      anchor = document.head.appendChild(create_text());
    }
    try {
      block(() => render_fn(anchor), HEAD_EFFECT);
    } finally {
    }
  }
  function create_fragment_from_html(html2) {
    var elem = document.createElement("template");
    elem.innerHTML = html2.replaceAll("<!>", "<!---->");
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
dom
    );
  }
  let should_intro = true;
  function set_text(text2, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text2.__t ??= text2.nodeValue)) {
      text2.__t = str;
      text2.nodeValue = str + "";
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
          should_intro = intro;
          component = Component(anchor_node2, props) || {};
          should_intro = true;
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
  const PENDING = 0;
  const THEN = 1;
  const CATCH = 2;
  function await_block(node, get_input, pending_fn, then_fn, catch_fn) {
    var anchor = node;
    var runes = is_runes();
    var active_component_context = component_context;
    var input = UNINITIALIZED;
    var pending_effect;
    var then_effect;
    var catch_effect;
    var input_source = runes ? source(
void 0
    ) : mutable_source(
void 0,
      false,
      false
    );
    var error_source = runes ? source(void 0) : mutable_source(void 0, false, false);
    var resolved = false;
    function update(state2, restore) {
      resolved = true;
      if (restore) {
        set_active_effect(effect2);
        set_active_reaction(effect2);
        set_component_context(active_component_context);
      }
      try {
        if (state2 === PENDING && pending_fn) ;
        if (state2 === THEN && then_fn) {
          if (then_effect) resume_effect(then_effect);
          else then_effect = branch(() => then_fn(anchor, input_source));
        }
        if (state2 === CATCH && catch_fn) ;
        if (state2 !== PENDING && pending_effect) {
          pause_effect(pending_effect, () => pending_effect = null);
        }
        if (state2 !== THEN && then_effect) {
          pause_effect(then_effect, () => then_effect = null);
        }
        if (state2 !== CATCH && catch_effect) {
          pause_effect(catch_effect, () => catch_effect = null);
        }
      } finally {
        if (restore) {
          set_component_context(null);
          set_active_reaction(null);
          set_active_effect(null);
          flushSync();
        }
      }
    }
    var effect2 = block(() => {
      if (input === (input = get_input())) return;
      if (is_promise(input)) {
        var promise = input;
        resolved = false;
        promise.then(
          (value) => {
            if (promise !== input) return;
            internal_set(input_source, value);
            update(THEN, true);
          },
          (error) => {
            if (promise !== input) return;
            internal_set(error_source, error);
            update(CATCH, true);
            {
              throw error_source.v;
            }
          }
        );
        {
          queue_micro_task(() => {
            if (!resolved) update(PENDING, true);
          });
        }
      } else {
        internal_set(input_source, input);
        update(THEN, false);
      }
      return () => input = UNINITIALIZED;
    });
  }
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
    var seen;
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
            (seen ??= new Set()).add(current);
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
  function html(node, get_value, svg = false, mathml = false, skip_warning = false) {
    var anchor = node;
    var value = "";
    template_effect(() => {
      var effect2 = (
active_effect
      );
      if (value === (value = get_value() ?? "")) {
        return;
      }
      if (effect2.nodes_start !== null) {
        remove_effect_dom(
          effect2.nodes_start,
effect2.nodes_end
        );
        effect2.nodes_start = effect2.nodes_end = null;
      }
      if (value === "") return;
      var html2 = value + "";
      if (svg) html2 = `<svg>${html2}</svg>`;
      else if (mathml) html2 = `<math>${html2}</math>`;
      var node2 = create_fragment_from_html(html2);
      if (svg || mathml) {
        node2 =

get_first_child(node2);
      }
      assign_nodes(

get_first_child(node2),
node2.lastChild
      );
      if (svg || mathml) {
        while ( get_first_child(node2)) {
          anchor.before(

get_first_child(node2)
          );
        }
      } else {
        anchor.before(node2);
      }
    });
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
  function attach(node, get_fn) {
    var fn = void 0;
    var e;
    block(() => {
      if (fn !== (fn = get_fn())) {
        if (e) {
          destroy_effect(e);
          e = null;
        }
        if (fn) {
          e = branch(() => {
            effect(() => (
fn(node)
            ));
          });
        }
      }
    });
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
      if (normal_styles) {
        new_style += append_styles(normal_styles);
      }
      if (important_styles) {
        new_style += append_styles(important_styles, true);
      }
      new_style = new_style.trim();
      return new_style === "" ? null : new_style;
    }
    return String(value);
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
  const now = () => performance.now();
  const raf = {


tick: (
(_) => requestAnimationFrame(_)
    ),
    now: () => now(),
    tasks: new Set()
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
        raf.tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        raf.tasks.delete(task);
      }
    };
  }
  function dispatch_event(element, type) {
    without_reactive_context(() => {
      element.dispatchEvent(new CustomEvent(type));
    });
  }
  function css_property_to_camelcase(style) {
    if (style === "float") return "cssFloat";
    if (style === "offset") return "cssOffset";
    if (style.startsWith("--")) return style;
    const parts = style.split("-");
    if (parts.length === 1) return parts[0];
    return parts[0] + parts.slice(1).map(
(word) => word[0].toUpperCase() + word.slice(1)
    ).join("");
  }
  function css_to_keyframe(css) {
    const keyframe = {};
    const parts = css.split(";");
    for (const part of parts) {
      const [property, value] = part.split(":");
      if (!property || value === void 0) break;
      const formatted_property = css_property_to_camelcase(property.trim());
      keyframe[formatted_property] = value.trim();
    }
    return keyframe;
  }
  const linear$1 = (t) => t;
  function transition(flags2, element, get_fn, get_params) {
    var is_intro = (flags2 & TRANSITION_IN) !== 0;
    var is_outro = (flags2 & TRANSITION_OUT) !== 0;
    var is_both = is_intro && is_outro;
    var is_global = (flags2 & TRANSITION_GLOBAL) !== 0;
    var direction = is_both ? "both" : is_intro ? "in" : "out";
    var current_options;
    var inert = element.inert;
    var overflow = element.style.overflow;
    var intro;
    var outro;
    function get_options() {
      return without_reactive_context(() => {
        return current_options ??= get_fn()(element, get_params?.() ??
{}, {
          direction
        });
      });
    }
    var transition2 = {
      is_global,
      in() {
        element.inert = inert;
        if (!is_intro) {
          outro?.abort();
          outro?.reset?.();
          return;
        }
        if (!is_outro) {
          intro?.abort();
        }
        dispatch_event(element, "introstart");
        intro = animate(element, get_options(), outro, 1, () => {
          dispatch_event(element, "introend");
          intro?.abort();
          intro = current_options = void 0;
          element.style.overflow = overflow;
        });
      },
      out(fn) {
        if (!is_outro) {
          fn?.();
          current_options = void 0;
          return;
        }
        element.inert = true;
        dispatch_event(element, "outrostart");
        outro = animate(element, get_options(), intro, 0, () => {
          dispatch_event(element, "outroend");
          fn?.();
        });
      },
      stop: () => {
        intro?.abort();
        outro?.abort();
      }
    };
    var e = (
active_effect
    );
    (e.transitions ??= []).push(transition2);
    if (is_intro && should_intro) {
      var run2 = is_global;
      if (!run2) {
        var block2 = (
e.parent
        );
        while (block2 && (block2.f & EFFECT_TRANSPARENT) !== 0) {
          while (block2 = block2.parent) {
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
        var o = options({ direction: is_intro ? "in" : "out" });
        a = animate(element, o, counterpart, t2, on_finish);
      });
      return {
        abort: () => {
          aborted = true;
          a?.abort();
        },
        deactivate: () => a.deactivate(),
        reset: () => a.reset(),
        t: () => a.t()
      };
    }
    counterpart?.deactivate();
    if (!options?.duration) {
      on_finish();
      return {
        abort: noop,
        deactivate: noop,
        reset: noop,
        t: () => t2
      };
    }
    const { delay = 0, css, tick: tick2, easing = linear$1 } = options;
    var keyframes = [];
    if (is_intro && counterpart === void 0) {
      if (tick2) {
        tick2(0, 1);
      }
      if (css) {
        var styles = css_to_keyframe(css(0, 1));
        keyframes.push(styles, styles);
      }
    }
    var get_t = () => 1 - t2;
    var animation = element.animate(keyframes, { duration: delay, fill: "forwards" });
    animation.onfinish = () => {
      animation.cancel();
      var t1 = counterpart?.t() ?? 1 - t2;
      counterpart?.abort();
      var delta = t2 - t1;
      var duration = (
options.duration * Math.abs(delta)
      );
      var keyframes2 = [];
      if (duration > 0) {
        var needs_overflow_hidden = false;
        if (css) {
          var n = Math.ceil(duration / (1e3 / 60));
          for (var i = 0; i <= n; i += 1) {
            var t = t1 + delta * easing(i / n);
            var styles2 = css_to_keyframe(css(t, 1 - t));
            keyframes2.push(styles2);
            needs_overflow_hidden ||= styles2.overflow === "hidden";
          }
        }
        if (needs_overflow_hidden) {
          element.style.overflow = "hidden";
        }
        get_t = () => {
          var time = (

animation.currentTime
          );
          return t1 + delta * easing(time / duration);
        };
        if (tick2) {
          loop(() => {
            if (animation.playState !== "running") return false;
            var t3 = get_t();
            tick2(t3, 1 - t3);
            return true;
          });
        }
      }
      animation = element.animate(keyframes2, { duration, fill: "forwards" });
      animation.onfinish = () => {
        get_t = () => t2;
        tick2?.(t2, 1 - t2);
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
          tick2?.(1, 0);
        }
      },
      t: () => get_t()
    };
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
  function bind_checked(input, get2, set2 = get2) {
    listen_to_event_and_reset_event(input, "change", (is_reset) => {
      var value = is_reset ? input.defaultChecked : input.checked;
      set2(value);
    });
    if (


untrack(get2) == null
    ) {
      set2(input.checked);
    }
    render_effect(() => {
      var value = get2();
      input.checked = Boolean(value);
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
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
  }
  function bind_this(element_or_component = {}, update, get_value, get_parts) {
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = get_parts?.() || [];
        untrack(() => {
          if (element_or_component !== get_value(...parts)) {
            update(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        queue_micro_task(() => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update(null, ...parts);
          }
        });
      };
    });
    return element_or_component;
  }
  function init(immutable = false) {
    const context = (
component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version = 0;
      let prev = (
{}
      );
      const d = derived(() => {
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
      for (const signal of context.l.s) get(signal);
    }
    props();
  }
  function reactive_import(fn) {
    var s = source(0);
    return function() {
      if (arguments.length === 1) {
        set(s, get(s) + 1);
        return arguments[0];
      } else {
        get(s);
        return fn();
      }
    };
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
    var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
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
    var getter;
    if (runes) {
      getter = () => {
        var value = (
props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    } else {
      getter = () => {
        var value = (
props[key]
        );
        if (value !== void 0) {
          fallback_value =
void 0;
        }
        return value === void 0 ? fallback_value : value;
      };
    }
    if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return (
(function(value, mutation) {
          if (arguments.length > 0) {
            if (!runes || !mutation || legacy_parent || is_store_sub) {
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
          const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
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
context.l
    );
    return l.u ??= { a: [], b: [], m: [] };
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
  }
  function cubicOut(t) {
    const f = t - 1;
    return f * f * f + 1;
  }
  function quadInOut(t) {
    t /= 0.5;
    if (t < 1) return 0.5 * t * t;
    t--;
    return -0.5 * (t * (t - 2) - 1);
  }
  const LINKS_KEY = "performer-links";
  const defaultLinks = [
    {
      label: "Pornolab",
      url: "http://pornolab.net/forum/tracker.php?search_id=&nm={q}"
    },
    {
      label: "Simpcity",
      url: "https://simpcity.su/search/1/?page=99&o=date&q={q}"
    },
    {
      label: "MissAV",
      url: "https://missav.ws/en/search/{q}"
    },
    {
      label: "Bunkr",
      url: "https://bunkr-albums.io/?search={q}"
    }
  ];
  function generateId(link2) {
    const performerLink = { ...link2 };
    performerLink.id = crypto.randomUUID();
    return performerLink;
  }
  function stripId(link2) {
    const performerLink = { ...link2 };
    delete performerLink.id;
    return performerLink;
  }
  function savePerformerLinks() {
    const stored = store.performerLinks.map(stripId);
    localStorage.setItem(LINKS_KEY, JSON.stringify(stored));
  }
  function loadPerformerLinks() {
    try {
      const stored = localStorage.getItem(LINKS_KEY);
      if (stored === null) return defaultLinks.map(generateId);
      const parsed = JSON.parse(stored);
      return parsed.map(generateId);
    } catch {
      return defaultLinks.map(generateId);
    }
  }
  function addPerformerLink() {
    const emptyLink = { label: "", url: "" };
    store.performerLinks.push(generateId(emptyLink));
    savePerformerLinks();
  }
  function removePerformerLink(index2) {
    if (index2 < 0 || index2 >= store.performerLinks.length) return;
    store.performerLinks.splice(index2, 1);
    savePerformerLinks();
  }
  function updatePerformerLink(index2, data2) {
    if (index2 < 0 || index2 >= store.performerLinks.length) return;
    const link2 = store.performerLinks[index2];
    if (link2) Object.assign(link2, data2);
    savePerformerLinks();
  }
  function getLinkUrl(link2, query) {
    const linkUrl = link2.url;
    if (!query || !linkUrl.includes("{q}")) return linkUrl;
    return linkUrl.replace("{q}", encodeURIComponent(query));
  }
  function getFaviconUrl(url) {
    try {
      const domain = new URL(url).host;
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch {
      return "https://icons.duckduckgo.com/ip3/invalid.ico";
    }
  }
  function restorePerformerLinks() {
    localStorage.removeItem(LINKS_KEY);
    for (let i = 0; i < defaultLinks.length; i++) {
      const defaultSite = defaultLinks[i];
      if (i < store.performerLinks.length) {
        const existingLink = store.performerLinks[i];
        if (existingLink?.label !== defaultSite?.label || existingLink?.url !== defaultSite?.url) {
          if (existingLink) Object.assign(existingLink, defaultSite);
        }
      } else {
        if (defaultSite) store.performerLinks.push(generateId(defaultSite));
      }
    }
    if (store.performerLinks.length > defaultLinks.length) {
      store.performerLinks.splice(defaultLinks.length);
    }
    savePerformerLinks();
  }
  const store = proxy({
    readyStateComplete: false,
    showSettings: false,
    options: {
      Title: [],
      Images: [],
      Download: [],
      Shortcuts: [],
      Developer: []
    },
    performerLinks: [],
    resizeWidth: 100,
    dropdown: null,
    openDropdown(event2, item, classList) {
      if (this.dropdown) {
        this.closeDropdown();
      } else {
        this.dropdown = {
          item,
          classList,
          clientX: event2.clientX,
          clientY: event2.clientY,
          currentTarget: event2.currentTarget
        };
      }
    },
    closeDropdown() {
      if (this.dropdown) {
        const currentTarget = this.dropdown.currentTarget;
        const classList = this.dropdown.classList;
        if (currentTarget && classList) currentTarget.classList.remove(...classList);
        this.dropdown = null;
      }
    },
    upgradeImgData: {},
    downloadState: "idle",
    ultraImages: null,
    ultraPost: null,
    imgRefs: [],
    showFileList: false,
    fileListData: null,
    columnCount: 1,
    toggleFileList() {
      this.showFileList = !this.showFileList;
    },
    documentHidden: false,
    get transition() {
      return {
        duration: this.readyStateComplete !== false && !this.documentHidden ? 180 : 0,
        easing: quadInOut
      };
    },
    get favIcons() {
      return Object.fromEntries(this.performerLinks.filter((link2) => link2.url).map((link2) => [link2.url, getFaviconUrl(link2.url)]));
    }
  });
  function handleUser(element) {
    if (!element) return;
    const name = element?.textContent;
    const link2 = element.getAttribute("href");
    if (name && link2 && link2?.includes("viewprofile")) {
      return { name, link: link2 };
    }
    return;
  }
  function handleTheme(element) {
    if (!element) return;
    const parentNode = element.closest("a");
    const darkmode = element.classList.contains("fa-sun");
    return { element: parentNode, darkmode };
  }
  function handleTimes(element) {
    if (!element) return;
    const part = element?.textContent?.split(" ")[0];
    if (!part) return;
    const parsed = parseInt(part);
    if (isNaN(parsed)) return;
    return parsed;
  }
  function handleImages(postImgs) {
    const images = [];
    if (!postImgs) return images;
    postImgs.forEach((varElement) => {
      const src = varElement.getAttribute("title");
      if (src) {
        const parentAnchor = varElement.closest("a");
        const href = parentAnchor?.href;
        images.push({
          id: crypto.randomUUID(),
          href,
          src
        });
      }
    });
    return images;
  }
  function handlePosts(posts) {
    if (posts) {
      return Array.from(posts).map((msg) => {
        const row = msg?.closest("tbody");
        const nickEl = row?.querySelector(".nick");
        const dateEl = row?.querySelector(".small");
        const avatarImg = row?.querySelector(".avatar img");
        const profileLink = row?.querySelector(
          'a.txtb[href*="viewprofile"]'
        );
        return {
          nick: nickEl?.textContent,
          date: dateEl?.textContent,
          avatar: avatarImg?.getAttribute("src"),
          link: profileLink?.getAttribute("href"),
          message: msg
        };
      });
    }
    return [];
  }
  function handleDate(dateString) {
    if (!dateString) return null;
    const ruMonthMap = {
      Янв: "Jan",
      Фев: "Feb",
      Мар: "Mar",
      Апр: "Apr",
      Май: "May",
      Июн: "Jun",
      Июл: "Jul",
      Авг: "Aug",
      Сен: "Sep",
      Окт: "Oct",
      Ноя: "Nov",
      Дек: "Dec"
    };
    const match = dateString.match(
      /(\d{2})-([А-Яа-я]{3})-(\d{2}) (\d{2}:\d{2}:\d{2})/
    );
    if (!match) return null;
    const [, day, ruMonth, shortYear, time] = match;
    if (!ruMonth || !shortYear) return null;
    const enMonth = ruMonthMap[ruMonth];
    const year = 2e3 + parseInt(shortYear, 10);
    const isoString = `${day} ${enMonth} ${year} ${time}`;
    return new Date(isoString);
  }
  function handleRelativeDate(dateLike) {
    if (dateLike === null) return "";
    const locale = "en";
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const divisions = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Infinity, name: "years" }
    ];
    let delta = (new Date(dateLike).getTime() - Date.now()) / 1e3;
    for (const { amount, name } of divisions) {
      if (Math.abs(delta) < amount) {
        return rtf.format(Math.round(delta), name);
      }
      delta /= amount;
    }
    return "";
  }
  function handleThankList(element) {
    if (!element) return new Set();
    const userIds = new Set();
    const uElements = element.querySelectorAll("u");
    uElements.forEach((uElement) => {
      const uid = uElement.textContent;
      if (uid) userIds.add(uid);
    });
    return userIds;
  }
  function handleTitle(topicEl) {
    const text2 = topicEl?.textContent?.trim();
    if (!text2) return null;
    const tags = extractTags(text2);
    const parsed = text2.replace(TAG_RE, "").trim();
    const searchTerms = extractSearchTerms(parsed);
    return { original: text2, parsed, searchTerms, tags };
  }
  function extractTags(text2) {
    const all = [...text2.matchAll(TAG_RE)].flatMap((m) => m[1]?.split(",") ?? []).map((t) => t.trim()).filter(Boolean);
    return [...new Set(all)];
  }
  function extractSearchTerms(text2) {
    const terms = [];
    let cursor = 0;
    const splitOnSeparators = (fragment) => fragment.trim() ? fragment.split(SEP_RE).map((s) => s.trim()).filter(Boolean) : [];
    for (const match of text2.matchAll(BRACKETS_RE)) {
      terms.push(...splitOnSeparators(text2.slice(cursor, match.index)));
      const inner = match[1] ?? match[2] ?? "";
      terms.push(...splitOnSeparators(inner));
      cursor = match.index + match[0].length;
    }
    terms.push(...splitOnSeparators(text2.slice(cursor)));
    return terms.filter((t, i) => terms.indexOf(t) === i);
  }
  const TAG_RE = /\[([^\]]+)]/g;
  const BRACKETS_RE = /\(([^)]+)\)|\{([^}]+)\}/g;
  const SEPARATORS = [",", "|", "/", "&", "-", "—", "aka"];
  const SEP_RE = new RegExp(
    SEPARATORS.map((str) => {
      const escaped = str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      switch (str) {
case "-":
        case "—":
        case "/":
        case "aka":
          return `(?<=\\s)${escaped}(?=\\s)`;
default:
          return escaped;
      }
    }).join("|"),
    "g"
  );
  function handleData() {
    const sel = Object.fromEntries(Object.entries({
      title: "a#topic-title",
      images: "#topic_main > tbody:nth-of-type(2) div.sp-wrap var.postImg",
      user: "div.topmenu td a",
      messages: "div.topmenu a.new-pm-link",
      theme: "div.topmenu .fas.fa-sun, div.topmenu .fas.fa-moon",
      seeders: "span.seed > b",
      leechers: "b.leech > b",
      size: "#tor-reged tr:nth-of-type(5) td:last-of-type",
      date: "div.post_head a.small",
      times: "td.borderless.bCenter.pad_8 > b",
      link: "a.dl-stub.dl-link",
      thank: "input#thx-btn",
      list: "div.thx-list",
      pagination: "table#pagination",
      logo: "img.site-logo",
      forumline: "table.forumline.message"
    }).map(([key, value]) => [key, document.querySelectorAll(value)]));
    return {
      title: handleTitle(sel?.["title"]?.[0]),
      posts: [],
      images: handleImages(sel["images"]),
      user: handleUser(sel?.["user"]?.[0]),
      messages: sel["messages"]?.[0],
      theme: handleTheme(sel["theme"]?.[0]),
      torrent: {
        seeders: sel?.["seeders"]?.[0]?.textContent,
        leechers: sel?.["leechers"]?.[0]?.textContent?.trim(),
        size: sel?.["size"]?.[0]?.textContent,
        date: handleDate(sel?.["date"]?.[0]?.textContent),
        times: handleTimes(sel?.["times"]?.[2]),
        link: sel?.["link"]?.[0]?.href
      },
      thank: {
        element: sel?.["thank"]?.[0],
        list: handleThankList(sel?.["list"]?.[0])
      },
      pagination: sel?.["pagination"]?.[0],
      logo: sel?.["logo"]?.[0]?.src,
      forumline: sel?.["forumline"]?.[0]
    };
  }
  const data = proxy({});
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function GM_fetch(method, url, responseType, headers, data2) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method,
        url,
        responseType,
        headers,
        data: data2,
        onload: (response) => resolve(response),
        onerror: () => reject(new Error(`GM_fetch failed: ${url}`))
      });
    });
  }
  const KEY$1 = "resolved-urls";
  const cache = JSON.parse(
    sessionStorage.getItem(KEY$1) || "{}"
  );
  function getCache$1(url) {
    return cache[url];
  }
  function setCache$1(url, src) {
    cache[url] = src;
    sessionStorage.setItem(KEY$1, JSON.stringify(cache));
  }
  function clearCache() {
    Object.keys(cache).forEach((key) => delete cache[key]);
    sessionStorage.removeItem(KEY$1);
  }
  async function getBlob(url) {
    if (getSettings("proxyCache"))
      return "https://corsproxy.io/?url=" + encodeURIComponent(url);
    const { response } = await GM_fetch("GET", url, "blob");
    return URL.createObjectURL(response);
  }
  const OPTIONS_KEY = "user-settings";
  const defaultOptions = {
    Title: [
      { label: "Parse title", key: "parseTitle", value: true },
      { label: "Show tags", key: "showTags", value: true },
      {
        label: "Performer links",
        key: "performerLinks",
        value: true
      }
    ],
    Images: [
      {
        label: "Upgrade images",
        key: "upgradeImages",
        value: true
      },
      {
        label: "Last image first",
        key: "lastImageFirst",
        value: true
      },
      {
        label: "Drag to resize",
        key: "dragResize",
        value: true
      }
    ],
    Download: [
      {
        label: "Floating download button",
        key: "floatingDownload",
        value: false
      },
      {
        label: 'Send to <a href="https://github.com/valpackett/transmitter" target="_blank">Transmitter</a>',
        key: "sendToTransmitter",
        value: false
      },
      {
        label: "Auto-expand file list",
        key: "expandFiles",
        value: false
      }
    ],
    Shortcuts: [
      {
        label: "Navigate with number keys",
        key: "numKeys",
        value: true,
        description: "[1, 2, 3, 4]"
      },
      {
        label: "Anchor images",
        key: "spaceImageAnchor",
        value: true,
        description: "[Space, Shift + Space]"
      },
      {
        label: "Download torrent",
        key: "dKeyToDownload",
        value: false,
        description: "[d]"
      }
    ],
    Network: [
      {
        label: "Cache resolved urls",
        key: "cacheImages",
        value: true
      },
      {
        label: "Limit concurrent upgrades",
        key: "limitConcurrent",
        value: true
      },
      {
        label: "CorsProxy.io",
        key: "proxyCache",
        value: false,
        description: "cache hotlinked"
      }
    ],
    Developer: [
      {
        label: "Toggle settings",
        key: "sKeySettings",
        value: false,
        description: "[s]"
      },
      {
        label: "Debug upgrade",
        key: "debugImgs",
        value: false
      },
      {
        label: "Incognito",
        key: "incognito",
        value: false
      }
    ]
  };
  function loadOptions() {
    const options = structuredClone(defaultOptions);
    const stored = localStorage.getItem(OPTIONS_KEY);
    if (stored) {
      try {
        const saved = JSON.parse(stored);
        Object.values(options).flat().forEach((opt) => {
          const value = saved[opt.key];
          if (value !== void 0) {
            opt.value = value;
          }
        });
      } catch (error) {
        console.warn(`Failed to load ${OPTIONS_KEY} from localStorage:`, error);
      }
    }
    return options;
  }
  function saveOptions() {
    const options = Object.values(store.options).flat();
    const json = Object.fromEntries(options.map((opt) => [opt.key, opt.value]));
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(json));
  }
  function updateOption(key, value) {
    const option = Object.values(store.options).flat().find((opt) => opt.key === key);
    if (option) option.value = value;
    saveOptions();
  }
  function restoreOptions() {
    Object.entries(defaultOptions).forEach(([groupKey, groupSettings]) => {
      groupSettings.forEach((defaultSetting) => {
        const currentOpt = store.options[groupKey]?.find(
          (opt) => opt.key === defaultSetting.key
        );
        if (currentOpt) {
          currentOpt.value = defaultSetting.value;
        }
      });
    });
    localStorage.removeItem(OPTIONS_KEY);
    saveOptions();
  }
  const DEFAULT_WIDTH = 100;
  const RESIZE_KEY = "images-resize-width";
  function loadResize() {
    try {
      const stored = localStorage.getItem(RESIZE_KEY);
      if (stored) return parseInt(stored);
    } catch (error) {
      console.warn(`Failed to load ${RESIZE_KEY} from localStorage:`, error);
    }
    return DEFAULT_WIDTH;
  }
  function saveResize(value) {
    try {
      localStorage.setItem(RESIZE_KEY, value.toString());
    } catch (error) {
      console.warn(`Failed to save ${RESIZE_KEY} to localStorage:`, error);
    }
  }
  function restoreResize() {
    localStorage.setItem(RESIZE_KEY, DEFAULT_WIDTH.toString());
    store.resizeWidth = DEFAULT_WIDTH;
  }
  const DEFAULT_COUNT = 1;
  const COLUMN_COUNT_KEY = "grid-size-width";
  function loadColumnCount() {
    try {
      const stored = localStorage.getItem(COLUMN_COUNT_KEY);
      if (stored) return parseInt(stored);
    } catch (error) {
      console.warn(
        `Failed to load ${COLUMN_COUNT_KEY} from localStorage:`,
        error
      );
    }
    return DEFAULT_COUNT;
  }
  function saveColumnCount(value) {
    try {
      localStorage.setItem(COLUMN_COUNT_KEY, value.toString());
    } catch (error) {
      console.warn(`Failed to save ${COLUMN_COUNT_KEY} to localStorage:`, error);
    }
  }
  function restoreColumnCount() {
    localStorage.setItem(COLUMN_COUNT_KEY, DEFAULT_COUNT.toString());
    store.columnCount = DEFAULT_COUNT;
  }
  const parser$3 = new DOMParser();
  const decoder = new TextDecoder("windows-1251");
  const regex = /\b\d+[pk]\b/gi;
  async function getRelated(title) {
    const query = stripResolution(title);
    const cache2 = getCache();
    if (cache2[query]) return cache2[query];
    const elements = await handleSearch(query);
    const results = [];
    elements.forEach((element) => {
      if (element instanceof HTMLAnchorElement && element.href && element.textContent) {
        const resolution = getResolution(element.textContent);
        if (resolution) {
          results.push({
            href: element.href,
            textContent: element.textContent,
            resolution
          });
        }
      }
    });
    cache2[query] = results;
    setCache(cache2);
    return results;
  }
  async function handleSearch(searchQuery) {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const body = `max=1&to=1&nm=${encodeURIComponent(searchQuery)}`;
    const response = await fetch("/forum/tracker.php", {
      method: "POST",
      headers,
      body
    });
    const buffer = await response.arrayBuffer();
    const result = decoder.decode(buffer);
    const doc = parser$3.parseFromString(result, "text/html");
    const nothingFound = doc.querySelector(".info_msg_wrap");
    if (nothingFound) return [];
    const related = doc.querySelectorAll(".med.tLink.bold");
    return Array.from(related);
  }
  function stripResolution(title) {
    return title.replace(regex, "").replace(/ ,/g, "").replace(/\s*,\s*(?=\])/g, "").replace(/\[\]/g, "");
  }
  function getResolution(title) {
    const match = title.match(regex);
    return match?.[0];
  }
  const CACHE_KEY = "related-cache";
  function getCache() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  }
  function setCache(cache2) {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache2));
  }
  function restoreRelated() {
    sessionStorage.removeItem(CACHE_KEY);
  }
  const SETTINGS_KEY = "show-settings";
  function getSettings(key) {
    const setting = Object.values(store.options).flat().find((opt) => opt.key === key);
    return setting?.value || false;
  }
  function loadShowSettings() {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored === null) return false;
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn(`Failed to parse settings from localStorage:`, stored, error);
      return false;
    }
  }
  function saveShowSettings(value) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to save ${SETTINGS_KEY} to localStorage:`, error);
    }
  }
  function toggleShowSettings(event2) {
    event2.preventDefault();
    store.showSettings = !store.showSettings;
    saveShowSettings(store.showSettings);
  }
  function restoreDefaultSettings() {
    if (!confirm("Are you sure you want to restore all settings to default?"))
      return;
    restoreOptions();
    restorePerformerLinks();
    restoreResize();
    restoreRelated();
    restoreColumnCount();
    clearCache();
  }
  const SYNC_TRIGGER_KEY = "sync-trigger";
  function syncSettings() {
    localStorage.setItem(SYNC_TRIGGER_KEY, Date.now().toString());
  }
  function onstorage(event2) {
    if (event2.key !== SYNC_TRIGGER_KEY) return;
    const optionsValue = localStorage.getItem(OPTIONS_KEY);
    if (optionsValue) {
      const saved = JSON.parse(optionsValue);
      Object.values(store.options).flat().forEach((setting) => {
        if (setting.key in saved) {
          setting.value = saved[setting.key];
        }
      });
      saveOptions();
    }
    const resizeValue = localStorage.getItem(RESIZE_KEY);
    if (resizeValue) store.resizeWidth = parseInt(resizeValue);
    const linksValue = localStorage.getItem(LINKS_KEY);
    if (linksValue) {
      store.performerLinks.length = 0;
      store.performerLinks.push(...loadPerformerLinks());
    }
    store.showSettings = false;
  }
  function exportSettings() {
    const performerLinks = store.performerLinks.map(stripId);
    const options = Object.values(store.options).flat();
    const optionsJson = Object.fromEntries(
      options.map((opt) => [opt.key, opt.value])
    );
    const fileContent = `// Paste this into browser console

localStorage.setItem("${OPTIONS_KEY}", JSON.stringify(${JSON.stringify(
    optionsJson,
    null,
    2
  )}));

localStorage.setItem("${LINKS_KEY}", JSON.stringify(${JSON.stringify(
    performerLinks,
    null,
    2
  )}));

localStorage.setItem("${RESIZE_KEY}", "${store.resizeWidth || "100"}");

localStorage.setItem("${COLUMN_COUNT_KEY}", "${store.columnCount || "1"}");

location.reload();
`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `data-${( new Date()).toISOString().split("T")[0]}.txt`
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  const KEY = "userscript-disabled";
  function userscriptDisabled() {
    const stored = sessionStorage.getItem(KEY);
    return stored === null ? false : stored === "true";
  }
  function setUserscript(value) {
    sessionStorage.setItem(KEY, JSON.stringify(value));
    location.reload();
  }
  function appendUserscriptEnableButton() {
    console.warn("userscript disabled");
    const button = document.createElement("button");
    Object.assign(button, {
      textContent: "Enable Pornolab Ultra",
      onclick: () => setUserscript(false)
    });
    Object.assign(button.style, {
      position: "fixed",
      top: "0.75rem",
      right: "0.75rem",
      zIndex: "9999"
    });
    const element = document.querySelector("#pl-speedbar-a");
    element?.parentElement?.appendChild(button);
  }
  function prependContentSecurityPolicy() {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = `
    default-src 'self';
    img-src 'self' http: https: data: blob:;
    style-src 'unsafe-inline';
    font-src 'self'
      https://static.pornolab.net/templates/default/webfonts/fa-solid-900.woff2;
    script-src 'unsafe-inline'
      https://static.pornolab.net/js/main.js
      https://static.pornolab.net/js/jquery.pack.js;
  `;
    document.head.prepend(meta);
    return document.head.contains(meta);
  }
  function forumDisabled(app) {
    const p = document.querySelector("body > div > p");
    const disabledText = "Форум временно отключен";
    if (!p?.textContent?.includes(disabledText)) return false;
    const translations = {
      [disabledText]: "Forum is temporarily disabled",
      "Последние новости вы можете узнать в": "You can find out the latest news on",
      твиттере: "Twitter"
    };
    app.remove();
    let html2 = p.innerHTML;
    for (const [russian, english] of Object.entries(translations)) {
      html2 = html2.replace(russian, english);
    }
    p.innerHTML = html2;
    return true;
  }
  enable_legacy_mode_flag();
  function state(state2) {
    store.downloadState = state2;
  }
  async function handleDownload(event2) {
    event2.preventDefault();
    if (store.downloadState === "downloading") {
      return;
    }
    if (!data.torrent?.link) {
      return state("error");
    }
    try {
      store.downloadState = "downloading";
      if (!getSettings("sendToTransmitter")) {
        window.location.assign(data.torrent.link);
        return state("success");
      }
      const url = "http://transmitter.web-extension/" + encodeURIComponent(data.torrent.link);
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue(
        "--main-bg"
      );
      const page = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { background-color: ${bgColor}; }
            img { display: none; }
          </style>
        </head>
        <body>
          <img src="${url}" onload="window.close()" onerror="window.close()">
        </body>
      </html>
    `;
      window.open(
        URL.createObjectURL(new Blob([page], { type: "text/html" })),
        "_blank",
        "noopener"
      );
      state("success");
    } catch (err) {
      console.error("Error downloading torrent:", err);
      state("error");
    }
  }
  var $$_import_store = reactive_import(() => store);
  function Events($$anchor, $$props) {
    push($$props, false);
    function handleReadyStateChange() {
      if (document.readyState === "complete") {
        $$_import_store($$_import_store().readyStateComplete = true);
      }
    }
    onMount(() => {
      handleReadyStateChange();
      if ($$_import_store().readyStateComplete) return;
      return on(document, "readystatechange", handleReadyStateChange);
    });
    function onkeydown(event2) {
      const target = event2.target;
      const input = target.isContentEditable || target instanceof HTMLInputElement && target.type === "text";
      if (input || event2.ctrlKey || event2.metaKey || event2.altKey) return;
      switch (event2.code) {
        case "Space":
          handleSpace(event2);
          break;
        case "KeyS":
          handleKeyS(event2);
          break;
        case "KeyD":
          handleKeyD(event2);
          break;
        case "Escape":
          handleEscape();
          break;
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
          if (!getSettings("numKeys")) return;
          event2.preventDefault();
          digitHandlers[event2.code]();
          break;
        default:
          return;
      }
    }
    const digitHandlers = {
      Digit1: handleDigit1,
      Digit2: handleDigit2,
      Digit3: handleDigit3,
      Digit4: handleDigit4
    };
    function handleSpace(event2) {
      if (!getSettings("spaceImageAnchor") || !$$_import_store().imgRefs.length || !$$_import_store().ultraImages || $$_import_store().columnCount !== 1) return;
      const scrollY = window.scrollY;
      const containerTop = $$_import_store().ultraImages.offsetTop;
      const containerBottom = containerTop + $$_import_store().ultraImages.offsetHeight;
      if (containerTop >= scrollY + window.innerHeight || containerBottom <= scrollY) return;
      let imgRefs = [...$$_import_store().imgRefs];
      let filteredImgRefs = imgRefs.filter((el) => el.dataset["broken"] !== "true");
      if (filteredImgRefs.length === 0) return;
      if (scrollY < containerTop) {
        if (!event2.shiftKey) {
          event2.preventDefault();
          filteredImgRefs[0]?.scrollIntoView({ block: "start" });
        }
        return;
      }
      const backward = event2.shiftKey;
      const threshold = scrollY + (backward ? -10 : 10);
      if (backward) {
        for (const img of filteredImgRefs.slice().reverse()) {
          const imgTop = scrollY + img.getBoundingClientRect().top;
          if (imgTop < threshold) {
            event2.preventDefault();
            img.scrollIntoView({ block: "start" });
            return;
          }
        }
      } else {
        for (const img of filteredImgRefs) {
          const imgTop = scrollY + img.getBoundingClientRect().top;
          if (imgTop > threshold) {
            event2.preventDefault();
            img.scrollIntoView({ block: "start" });
            return;
          }
        }
      }
    }
    function handleKeyD(event2) {
      if (!getSettings("dKeyToDownload")) return;
      event2.preventDefault();
      handleDownload(event2);
    }
    function handleEscape() {
      if ($$_import_store().dropdown !== null) {
        $$_import_store().closeDropdown();
      } else if ($$_import_store().showSettings) {
        $$_import_store($$_import_store().showSettings = false);
        saveShowSettings($$_import_store().showSettings);
      }
    }
    function handleKeyS(event2) {
      if (!getSettings("sKeySettings")) return;
      if (!$$_import_store().showSettings) window.scrollTo({ top: 0 });
      toggleShowSettings(event2);
    }
    function handleDigit1() {
      window.scrollTo({ top: 0 });
    }
    function handleDigit2() {
      $$_import_store().ultraImages?.scrollIntoView({ block: "start" });
    }
    function handleDigit3() {
      $$_import_store().ultraPost?.scrollIntoView({ block: "start" });
    }
    function handleDigit4() {
      window.scrollTo({ top: document.body.scrollHeight });
    }
    function onvisibilitychange() {
      $$_import_store($$_import_store().documentHidden = document.hidden);
    }
    init();
    event("keydown", $window, onkeydown);
    event("storage", $window, function(...$$args) {
      onstorage?.apply(this, $$args);
    });
    event("visibilitychange", $document, onvisibilitychange);
    pop();
  }
  const Item$2 = ($$anchor, title = noop, content = noop) => {
    var div = root_1$d();
    var node = child(div);
    snippet(node, content);
    template_effect(() => set_attribute(div, "title", title()));
    append($$anchor, div);
  };
  const Messages = ($$anchor) => {
    const href = user_derived(() => "/forum/privmsg.php?folder=inbox");
    var a_2 = root_7$3();
    set_attribute(a_2, "href", get(href));
    var i = child(a_2);
    template_effect(() => set_class(i, 1, clsx(["fas", "fa-envelope", data.messages && "unread"]), "svelte-zne36e"));
    append($$anchor, a_2);
  };
  const Settings$1 = ($$anchor) => {
    var fragment_3 = root_11$2();
    var a_4 = first_child(fragment_3);
    a_4.__click = function(...$$args) {
      toggleShowSettings?.apply(this, $$args);
    };
    var a_5 = sibling(a_4, 2);
    a_5.__click = function(...$$args) {
      toggleShowSettings?.apply(this, $$args);
    };
    append($$anchor, fragment_3);
  };
  function disableUserscript(event2) {
    event2.preventDefault();
    setUserscript(true);
  }
  var root_1$d = from_html(`<div class="item svelte-zne36e"><!></div>`);
  var root_5$6 = from_html(`<a>Profile</a>`);
  var root_6$5 = from_html(`<a href="/">Login</a>`);
  var root_7$3 = from_html(`<a aria-label="inbox"><i></i></a>`);
  var root_9$2 = from_html(`<span class="themeIcon svelte-zne36e"></span>`);
  var root_10 = from_html(`<a href="/" aria-label="placeholder"><i></i></a>`);
  var root_11$2 = from_html(`<a href="#settings"><img src="https://github.com/clangmoyai/plab-ultra/raw/main/src/assets/logo64.png" class="ultra-logo svelte-zne36e" alt="logo"/></a> <a href="#settings">Settings</a>`, 1);
  var root_12$1 = from_html(`<a href="#disable">Disable</a>`);
  var root$6 = from_html(`<div id="x-header"><div class="logo svelte-zne36e"><a href="/forum/index.php"><img alt=""/></a></div> <div class="align-right svelte-zne36e"><div class="container svelte-zne36e"><div class="links svelte-zne36e"><!> <!> <!> <!> <!> <!></div> <div class="search svelte-zne36e"><input type="text" name="search" placeholder="Search…" class="svelte-zne36e"/> <button class="svelte-zne36e">»</button></div></div></div></div>`);
  function Header($$anchor, $$props) {
    push($$props, true);
    const Profile = ($$anchor2) => {
      var fragment = comment();
      var node_1 = first_child(fragment);
      {
        var consequent = ($$anchor3) => {
          var text$1 = text("Profile");
          append($$anchor3, text$1);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_1 = comment();
          var node_2 = first_child(fragment_1);
          {
            var consequent_1 = ($$anchor4) => {
              var a = root_5$6();
              template_effect(() => {
                set_attribute(a, "href", data.user.link);
                set_attribute(a, "title", data.user?.name);
              });
              append($$anchor4, a);
            };
            var alternate = ($$anchor4) => {
              var a_1 = root_6$5();
              append($$anchor4, a_1);
            };
            if_block(
              node_2,
              ($$render) => {
                if (data.user?.link) $$render(consequent_1);
                else $$render(alternate, false);
              },
              true
            );
          }
          append($$anchor3, fragment_1);
        };
        if_block(node_1, ($$render) => {
          if (get(incognito)) $$render(consequent);
          else $$render(alternate_1, false);
        });
      }
      append($$anchor2, fragment);
    };
    const Theme = ($$anchor2) => {
      var fragment_2 = comment();
      var node_3 = first_child(fragment_2);
      {
        var consequent_2 = ($$anchor3) => {
          var span = root_9$2();
          attach(span, () => appendThemeButton(data.theme.element));
          append($$anchor3, span);
        };
        var alternate_2 = ($$anchor3) => {
          const darkMode = user_derived(() => data.theme?.darkmode);
          var a_3 = root_10();
          var i_1 = child(a_3);
          template_effect(() => set_class(i_1, 1, clsx([
            "fas",
            get(darkMode) && "fa-sun",
            !get(darkMode) && "fa-moon"
          ])));
          append($$anchor3, a_3);
        };
        if_block(node_3, ($$render) => {
          if (data.theme?.element) $$render(consequent_2);
          else $$render(alternate_2, false);
        });
      }
      append($$anchor2, fragment_2);
    };
    const Disable = ($$anchor2) => {
      var a_6 = root_12$1();
      a_6.__click = [disableUserscript];
      append($$anchor2, a_6);
    };
    let incognito = user_derived(() => getSettings("incognito"));
    let floatingDownload = user_derived(() => getSettings("floatingDownload"));
    let messagesTitle = user_derived(() => data.messages ? "Unread" : "Messages");
    let searchQuery = state$1("");
    function handleSearch2() {
      const url = "/forum/tracker.php?search_id=&nm=";
      window.location.href = `${url}${encodeURIComponent(get(searchQuery))}`;
    }
    function appendThemeButton(themeElement) {
      return (element) => {
        if (!(themeElement instanceof HTMLAnchorElement)) return;
        element.appendChild(themeElement);
        return () => {
          themeElement.remove();
        };
      };
    }
    var div_1 = root$6();
    let classes;
    var div_2 = child(div_1);
    var a_8 = child(div_2);
    var img = child(a_8);
    let classes_1;
    var div_3 = sibling(div_2, 2);
    var div_4 = child(div_3);
    var div_5 = child(div_4);
    var node_4 = child(div_5);
    Item$2(node_4, () => "Profile", () => Profile);
    var node_5 = sibling(node_4, 2);
    Item$2(node_5, () => get(messagesTitle), () => Messages);
    var node_6 = sibling(node_5, 2);
    Item$2(node_6, () => "Theme", () => Theme);
    var node_7 = sibling(node_6, 2);
    Item$2(node_7, () => "Settings", () => Settings$1);
    var node_8 = sibling(node_7, 2);
    {
      if_block(node_8, ($$render) => {
      });
    }
    var node_9 = sibling(node_8, 2);
    Item$2(node_9, () => "Disable", () => Disable);
    var div_6 = sibling(div_5, 2);
    var input = child(div_6);
    var button = sibling(input, 2);
    button.__click = handleSearch2;
    template_effect(
      ($0, $1) => {
        classes = set_class(div_1, 1, "svelte-zne36e", null, classes, $0);
        set_attribute(img, "src", data.logo);
        classes_1 = set_class(img, 1, "svelte-zne36e", null, classes_1, $1);
      },
      [
        () => ({ floatingDownload: get(floatingDownload) }),
        () => ({ incognito: get(incognito) })
      ]
    );
    event("keypress", input, (event2) => {
      if (event2.key === "Enter") handleSearch2();
    });
    bind_value(input, () => get(searchQuery), ($$value) => set(searchQuery, $$value));
    append($$anchor, div_1);
    pop();
  }
  delegate(["click"]);
  function onchange(event2) {
    const checkbox = event2.target;
    if (!checkbox) return;
    const handleToggleFileList = checkbox.id === "expandFiles" && store.showFileList !== checkbox.checked;
    if (handleToggleFileList) store.toggleFileList();
    const handleClearCache = checkbox.id === "cacheImages" && !checkbox.checked;
    if (handleClearCache) clearCache();
    saveOptions();
  }
  var on_click$4 = (event2) => {
    event2.currentTarget?.blur();
  };
  var root_3$5 = from_html(`<span class="description svelte-1emp0k3"> </span>`);
  var root_2$6 = from_html(`<label><input type="checkbox" class="svelte-1emp0k3"/> <span class="svelte-1emp0k3"><!> <!></span></label>`);
  var root_1$c = from_html(`<div class="column svelte-1emp0k3"><h2 class="svelte-1emp0k3"> </h2> <!></div>`);
  var root$5 = from_html(`<div class="container svelte-1emp0k3"></div>`);
  function Options($$anchor, $$props) {
    push($$props, true);
    let parseTitle = user_derived(() => getSettings("parseTitle"));
    var div = root$5();
    each(
      div,
      21,
      () => Object.entries(store.options),
      ([title, items]) => title,
      ($$anchor2, $$item) => {
        var $$array = user_derived(() => to_array(get($$item), 2));
        let title = () => get($$array)[0];
        let items = () => get($$array)[1];
        var div_1 = root_1$c();
        var h2 = child(div_1);
        var text2 = child(h2);
        var node = sibling(h2, 2);
        each(node, 17, items, (item) => item.key, ($$anchor3, item, $$index) => {
          const disabled = user_derived(() => !get(parseTitle) && (get(item).key === "performerLinks" || get(item).key === "showTags") || get(item).key === "spaceImageAnchor" && store.columnCount !== 1);
          var label = root_2$6();
          let classes;
          var input = child(label);
          input.__change = [onchange];
          input.__click = [on_click$4];
          var span = sibling(input, 2);
          var node_1 = child(span);
          html(node_1, () => get(item).label);
          var node_2 = sibling(node_1, 2);
          {
            var consequent = ($$anchor4) => {
              var span_1 = root_3$5();
              var text_1 = child(span_1);
              template_effect(() => set_text(text_1, get(item).description));
              append($$anchor4, span_1);
            };
            if_block(node_2, ($$render) => {
              if (get(item).description) $$render(consequent);
            });
          }
          template_effect(
            ($0) => {
              classes = set_class(label, 1, "svelte-1emp0k3", null, classes, $0);
              set_attribute(input, "id", get(item).key);
              input.disabled = get(disabled);
            },
            [() => ({ disabled: get(disabled) })]
          );
          bind_checked(input, () => get(item).value, ($$value) => get(item).value = $$value);
          append($$anchor3, label);
        });
        template_effect(() => set_text(text2, title()));
        append($$anchor2, div_1);
      }
    );
    append($$anchor, div);
    pop();
  }
  delegate(["change", "click"]);
  const linear = (x) => x;
  function cubic_out(t) {
    const f = t - 1;
    return f * f * f + 1;
  }
  function fade(node, { delay = 0, duration = 400, easing = linear } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`
    };
  }
  function slide(node, { delay = 0, duration = 400, easing = cubic_out, axis = "y" } = {}) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const primary_property = axis === "y" ? "height" : "width";
    const primary_property_value = parseFloat(style[primary_property]);
    const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
    const capitalized_secondary_properties = secondary_properties.map(
      (e) => (
`${e[0].toUpperCase()}${e.slice(1)}`
      )
    );
    const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
    const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
    const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
    const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
    const border_width_start_value = parseFloat(
      style[`border${capitalized_secondary_properties[0]}Width`]
    );
    const border_width_end_value = parseFloat(
      style[`border${capitalized_secondary_properties[1]}Width`]
    );
    return {
      delay,
      duration,
      easing,
      css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;min-${primary_property}: 0`
    };
  }
  function scale(node, { delay = 0, duration = 400, easing = cubic_out, start = 0, opacity = 0 } = {}) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === "none" ? "" : style.transform;
    const sd = 1 - start;
    const od = target_opacity * (1 - opacity);
    return {
      delay,
      duration,
      easing,
      css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${target_opacity - od * u}
		`
    };
  }
  function onclick(_, $$props, handleTransition) {
    $$props.onclick?.();
    handleTransition();
  }
  var root_1$b = from_html(`<span><!></span>`);
  var root_2$5 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="svelte-1obhcw8"><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39l8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33Z" class="svelte-1obhcw8"></path></svg>`);
  var root$4 = from_html(`<button class="svelte-1obhcw8"><!></button>`);
  function Checkmark($$anchor, $$props) {
    push($$props, true);
    const DURATION = 1e3;
    let clicked = state$1(false);
    let timeout;
    let clientWidth = state$1(0);
    let clientHeight = state$1(0);
    let opts = user_derived(() => ({ ...store.transition, start: 0.6 }));
    function handleTransition() {
      set(clicked, true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          set(clicked, false);
          timeout = null;
        },
        DURATION
      );
    }
    onDestroy(() => {
      if (timeout) clearTimeout(timeout);
    });
    var button = root$4();
    button.__click = [onclick, $$props, handleTransition];
    let styles;
    var node = child(button);
    {
      var consequent = ($$anchor2) => {
        var span = root_1$b();
        var node_1 = child(span);
        snippet(node_1, () => $$props.children);
        transition(3, span, () => scale, () => get(opts));
        bind_element_size(span, "clientWidth", ($$value) => set(clientWidth, $$value));
        bind_element_size(span, "clientHeight", ($$value) => set(clientHeight, $$value));
        append($$anchor2, span);
      };
      var alternate = ($$anchor2) => {
        var svg = root_2$5();
        var path = child(svg);
        transition(3, path, () => scale, () => get(opts));
        append($$anchor2, svg);
      };
      if_block(node, ($$render) => {
        if (!get(clicked)) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    template_effect(
      ($0) => {
        set_attribute(button, "title", $$props.title);
        button.disabled = $$props.disabled;
        styles = set_style(button, "", styles, $0);
      },
      [
        () => ({
          width: `${get(clientWidth) ?? ""}px`,
          height: `${get(clientHeight) ?? ""}px`
        })
      ]
    );
    append($$anchor, button);
    pop();
  }
  delegate(["click"]);
  var root$3 = from_html(`<div class="container svelte-1hugea"><!> <div class="align-right svelte-1hugea"><!> <!> <!></div></div>`);
  function Actions($$anchor, $$props) {
    push($$props, true);
    let parseTitle = user_derived(() => getSettings("parseTitle"));
    let performerLinks = user_derived(() => getSettings("performerLinks"));
    var div = root$3();
    var node = child(div);
    {
      let $0 = user_derived(() => !get(parseTitle) || !get(performerLinks));
      Checkmark(node, {
        get onclick() {
          return addPerformerLink;
        },
        title: "Add performer link",
        get disabled() {
          return get($0);
        },
        children: ($$anchor2, $$slotProps) => {
          var text$1 = text("Add link");
          append($$anchor2, text$1);
        },
        $$slots: { default: true }
      });
    }
    var div_1 = sibling(node, 2);
    var node_1 = child(div_1);
    Checkmark(node_1, {
      get onclick() {
        return syncSettings;
      },
      title: "Sync settings to other tabs",
      children: ($$anchor2, $$slotProps) => {
        var text_1 = text("Sync");
        append($$anchor2, text_1);
      },
      $$slots: { default: true }
    });
    var node_2 = sibling(node_1, 2);
    Checkmark(node_2, {
      get onclick() {
        return restoreDefaultSettings;
      },
      title: "Restore all settings to default",
      children: ($$anchor2, $$slotProps) => {
        var text_2 = text("Restore");
        append($$anchor2, text_2);
      },
      $$slots: { default: true }
    });
    var node_3 = sibling(node_2, 2);
    Checkmark(node_3, {
      get onclick() {
        return exportSettings;
      },
      title: "Export settings as text file",
      children: ($$anchor2, $$slotProps) => {
        var text_3 = text("Export");
        append($$anchor2, text_3);
      },
      $$slots: { default: true }
    });
    append($$anchor, div);
    pop();
  }
  function slideFade(node, { delay = 0, duration = 400, easing = cubicOut, axis = "y" } = {}) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const primary_property = axis === "y" ? "height" : "width";
    const primary_property_value = parseFloat(style[primary_property]);
    const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
    const capitalized_secondary_properties = secondary_properties.map(
(e) => `${e[0].toUpperCase()}${e.slice(1)}`
    );
    const padding_start_value = parseFloat(
style[`padding${capitalized_secondary_properties[0]}`]
    );
    const padding_end_value = parseFloat(
style[`padding${capitalized_secondary_properties[1]}`]
    );
    const margin_start_value = parseFloat(
style[`margin${capitalized_secondary_properties[0]}`]
    );
    const margin_end_value = parseFloat(
style[`margin${capitalized_secondary_properties[1]}`]
    );
    const border_width_start_value = parseFloat(
style[`border${capitalized_secondary_properties[0]}Width`]
    );
    const border_width_end_value = parseFloat(
style[`border${capitalized_secondary_properties[1]}Width`]
    );
    return {
      delay,
      duration,
      easing,
      css: (t) => `overflow: hidden;opacity: ${t * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;min-${primary_property}: 0`
    };
  }
  const Favicon = ($$anchor, link2 = noop) => {
    const src = user_derived(() => getFaviconUrl(link2().url));
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var img = root_2$4();
        template_effect(() => {
          set_attribute(img, "src", get(src));
          set_attribute(img, "alt", link2().label);
        });
        append($$anchor2, img);
      };
      if_block(node, ($$render) => {
        if (get(src)) $$render(consequent);
      });
    }
    append($$anchor, fragment);
  };
  const Remove = ($$anchor, index2 = noop) => {
    var button = root_4$3();
    button.__click = [on_click$3, index2];
    append($$anchor, button);
  };
  var root_2$4 = from_html(`<img class="svelte-kvmnko"/>`);
  var on_input = (_, index2, key, link2) => updatePerformerLink(index2(), { [key()]: link2()[key()] });
  var root_3$4 = from_html(`<input type="text" class="svelte-kvmnko"/>`);
  var on_click$3 = (__1, index2) => removePerformerLink(index2());
  var root_4$3 = from_html(`<button title="Remove link" class="svelte-kvmnko">×</button>`);
  var root_6$4 = from_html(`<div class="item svelte-kvmnko"><!> <!> <!> <!></div>`);
  var root_5$5 = from_html(`<div class="container svelte-kvmnko"></div>`);
  function Links($$anchor, $$props) {
    push($$props, true);
    const Input = ($$anchor2, key = noop, link2 = noop, index2 = noop) => {
      var input = root_3$4();
      input.__input = [on_input, index2, key, link2];
      template_effect(() => {
        set_attribute(input, "name", placeholders[key()]);
        set_attribute(input, "placeholder", placeholders[key()]);
      });
      bind_value(input, () => link2()[key()], ($$value) => link2()[key()] = $$value);
      append($$anchor2, input);
    };
    const placeholders = { id: "ID", label: "Label", url: "URL" };
    let parseTitle = user_derived(() => getSettings("parseTitle"));
    let performerLinks = user_derived(() => getSettings("performerLinks"));
    var fragment_1 = comment();
    var node_1 = first_child(fragment_1);
    {
      var consequent_1 = ($$anchor2) => {
        var div = root_5$5();
        each(div, 23, () => store.performerLinks, (link2) => link2.id, ($$anchor3, link2, index2) => {
          var div_1 = root_6$4();
          var node_2 = child(div_1);
          Favicon(node_2, () => get(link2));
          var node_3 = sibling(node_2, 2);
          Input(node_3, () => "label", () => get(link2), () => get(index2));
          var node_4 = sibling(node_3, 2);
          Input(node_4, () => "url", () => get(link2), () => get(index2));
          var node_5 = sibling(node_4, 2);
          Remove(node_5, () => get(index2));
          transition(3, div_1, () => slideFade, () => store.transition);
          append($$anchor3, div_1);
        });
        transition(3, div, () => slideFade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node_1, ($$render) => {
        if (get(parseTitle) && get(performerLinks) && store.performerLinks?.length) $$render(consequent_1);
      });
    }
    append($$anchor, fragment_1);
    pop();
  }
  delegate(["input", "click"]);
  var root_1$a = from_html(`<div class="svelte-1kxfd5y"><button class="svelte-1kxfd5y">×</button> <!> <!> <!></div>`);
  function Settings($$anchor, $$props) {
    push($$props, false);
    init();
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$a();
        var button = child(div);
        button.__click = function(...$$args) {
          toggleShowSettings?.apply(this, $$args);
        };
        var node_1 = sibling(button, 2);
        Options(node_1, {});
        var node_2 = sibling(node_1, 2);
        Links(node_2, {});
        var node_3 = sibling(node_2, 2);
        Actions(node_3, {});
        transition(3, div, () => slideFade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (store.showSettings) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var root_1$9 = from_html(`<div class="svelte-wvkwp9"><button class="ic--sharp-download svelte-wvkwp9" title="Download" aria-label="Download"></button></div>`);
  function Float($$anchor, $$props) {
    push($$props, true);
    let floatingDownload = user_derived(() => getSettings("floatingDownload"));
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$9();
        var button = child(div);
        button.__click = function(...$$args) {
          handleDownload?.apply(this, $$args);
        };
        transition(1, div, () => fade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(floatingDownload)) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var root_3$3 = from_html(`<link rel="prefetch" as="image"/>`);
  var root_6$3 = from_html(`<a class="svelte-vtocc6"><img class="svelte-vtocc6"/> </a>`);
  var root_4$2 = from_html(`<div class="container svelte-vtocc6"><div class="indicator svelte-vtocc6"></div> <div class="items svelte-vtocc6"></div></div>`);
  function Dropdown$1($$anchor, $$props) {
    push($$props, true);
    let top = state$1(0);
    let left = state$1(0);
    let container = state$1(null);
    let currentTarget = user_derived(() => store.dropdown?.currentTarget);
    user_effect(
() => {
        if (!store.dropdown?.clientX || !store.dropdown?.clientY || !get(currentTarget)) return;
        const rect = getClickedRect(store.dropdown.clientX, store.dropdown.clientY);
        if (!rect) return;
        set(top, rect.bottom + window.scrollY);
        set(left, store.dropdown.clientX + window.scrollX);
        if (store.dropdown?.classList) get(currentTarget).classList.add(...store.dropdown.classList);
        return on(get(currentTarget), "pointerleave", onpointerleave);
      }
    );
    function getClickedRect(clientX, clientY) {
      const rects = get(currentTarget).getClientRects();
      if (!rects.length) return null;
      let clickedRect = null;
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        if (rect && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          clickedRect = rect;
          break;
        }
      }
      return clickedRect;
    }
    function onpointerleave(event2) {
      const related = event2.relatedTarget;
      if (get(currentTarget)?.contains(related) || get(container)?.contains(related)) return;
      store.closeDropdown();
    }
    function onclickcapture() {
      store.closeDropdown();
    }
    var fragment_2 = comment();
    head(($$anchor2) => {
      var fragment = comment();
      var node = first_child(fragment);
      each(node, 17, () => store.performerLinks, (link2) => link2.id, ($$anchor3, link2) => {
        var fragment_1 = comment();
        var node_1 = first_child(fragment_1);
        {
          var consequent = ($$anchor4) => {
            var link_1 = root_3$3();
            template_effect(() => set_attribute(link_1, "href", store.favIcons[get(link2).url]));
            append($$anchor4, link_1);
          };
          if_block(node_1, ($$render) => {
            if (get(link2).url && store.favIcons[get(link2).url]) $$render(consequent);
          });
        }
        append($$anchor3, fragment_1);
      });
      append($$anchor2, fragment);
    });
    var node_2 = first_child(fragment_2);
    {
      var consequent_2 = ($$anchor2) => {
        var div = root_4$2();
        let styles;
        var div_1 = sibling(child(div), 2);
        each(div_1, 21, () => store.performerLinks, (link2) => link2.id, ($$anchor3, link2) => {
          var fragment_3 = comment();
          var node_3 = first_child(fragment_3);
          {
            var consequent_1 = ($$anchor4) => {
              var a = root_6$3();
              var img = child(a);
              var text2 = sibling(img);
              template_effect(
                ($0) => {
                  set_attribute(a, "href", $0);
                  set_attribute(img, "src", store.favIcons[get(link2).url]);
                  set_attribute(img, "alt", get(link2).label);
                  set_text(text2, ` ${get(link2).label ?? ""}`);
                },
                [() => getLinkUrl(get(link2), store.dropdown.item)]
              );
              event("click", a, onclickcapture, true);
              append($$anchor4, a);
            };
            if_block(node_3, ($$render) => {
              if (get(link2).label && get(link2).url && store.favIcons[get(link2).url] && store.dropdown?.item) $$render(consequent_1);
            });
          }
          append($$anchor3, fragment_3);
        });
        bind_this(div, ($$value) => set(container, $$value), () => get(container));
        template_effect(($0) => styles = set_style(div, "", styles, $0), [
          () => ({ top: `${get(top) ?? ""}px`, left: `${get(left) ?? ""}px` })
        ]);
        event("pointerleave", div, onpointerleave);
        transition(2, div, () => fade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node_2, ($$render) => {
        if (store.dropdown) $$render(consequent_2);
      });
    }
    append($$anchor, fragment_2);
    pop();
  }
  const Dropdown = ($$anchor, item = noop) => {
    var span = root_3$2();
    span.__click = [on_click$2, item];
    var text2 = child(span);
    template_effect(() => set_text(text2, item()));
    append($$anchor, span);
  };
  const Placholder = ($$anchor) => {
    const items = user_derived(() => ["Performer", "Title"]);
    var fragment_1 = comment();
    var node_1 = first_child(fragment_1);
    each(node_1, 17, () => get(items), index, ($$anchor2, item, i) => {
      var fragment_2 = root_5$4();
      var text_1 = first_child(fragment_2);
      text_1.nodeValue = `${i > 0 ? " - " : ""} `;
      var node_2 = sibling(text_1);
      Dropdown(node_2, () => get(item));
      append($$anchor2, fragment_2);
    });
    append($$anchor, fragment_1);
  };
  var on_click$2 = (event2, item) => store.openDropdown(event2, item(), ["title-item--hover"]);
  var root_3$2 = from_html(`<span class="title-item svelte-1gft3h5"> </span>`);
  var root_5$4 = from_html(` <!>`, 1);
  var root_9$1 = from_html(`<a class="title-item svelte-1gft3h5"> </a>`);
  var root_11$1 = from_html(`<a class="title-item svelte-1gft3h5"> </a>`);
  var root_15$1 = from_html(`<h1 id="x-title" class="svelte-1gft3h5"><!></h1>`);
  var root_17 = from_html(`<h1 id="x-title" class="svelte-1gft3h5"> </h1>`);
  var root_19$1 = from_html(`<h1 id="x-title" class="svelte-1gft3h5"><!></h1>`);
  var root_21 = from_html(`<h1 id="x-title" class="svelte-1gft3h5"><a class="original-title svelte-1gft3h5"> </a></h1>`);
  function Title($$anchor, $$props) {
    push($$props, true);
    const ParsedTitle = ($$anchor2, searchTerms2 = noop) => {
      const validLinks = user_derived(() => store.performerLinks.filter((link2) => link2.url && link2.label));
      var fragment_3 = comment();
      var node_3 = first_child(fragment_3);
      each(node_3, 17, () => get(items), index, ($$anchor3, item) => {
        var fragment_4 = comment();
        var node_4 = first_child(fragment_4);
        {
          var consequent_4 = ($$anchor4) => {
            var fragment_5 = comment();
            var node_5 = first_child(fragment_5);
            {
              var consequent_1 = ($$anchor5) => {
                var a_1 = root_9$1();
                var text_2 = child(a_1);
                template_effect(
                  ($0) => {
                    set_attribute(a_1, "href", `/forum/tracker.php?nm=${$0 ?? ""}`);
                    set_text(text_2, get(item));
                  },
                  [() => encodeURIComponent(get(item))]
                );
                append($$anchor5, a_1);
              };
              var alternate_1 = ($$anchor5) => {
                var fragment_6 = comment();
                var node_6 = first_child(fragment_6);
                {
                  var consequent_2 = ($$anchor6) => {
                    var a_2 = root_11$1();
                    var text_3 = child(a_2);
                    template_effect(
                      ($0) => {
                        set_attribute(a_2, "href", $0);
                        set_text(text_3, get(item));
                      },
                      [() => getLinkUrl(store.performerLinks[0], get(item))]
                    );
                    append($$anchor6, a_2);
                  };
                  var alternate = ($$anchor6) => {
                    var fragment_7 = comment();
                    var node_7 = first_child(fragment_7);
                    {
                      var consequent_3 = ($$anchor7) => {
                        Dropdown($$anchor7, () => get(item));
                      };
                      if_block(
                        node_7,
                        ($$render) => {
                          if (get(validLinks).length > 1) $$render(consequent_3);
                        },
                        true
                      );
                    }
                    append($$anchor6, fragment_7);
                  };
                  if_block(
                    node_6,
                    ($$render) => {
                      if (get(validLinks).length === 1 && store.performerLinks[0]) $$render(consequent_2);
                      else $$render(alternate, false);
                    },
                    true
                  );
                }
                append($$anchor5, fragment_6);
              };
              if_block(node_5, ($$render) => {
                if (get(validLinks).length === 0 || !get(performerLinks)) $$render(consequent_1);
                else $$render(alternate_1, false);
              });
            }
            append($$anchor4, fragment_5);
          };
          var alternate_2 = ($$anchor4) => {
            var text_4 = text();
            template_effect(() => set_text(text_4, get(item)));
            append($$anchor4, text_4);
          };
          if_block(node_4, ($$render) => {
            if (get(item) && searchTerms2().includes(get(item))) $$render(consequent_4);
            else $$render(alternate_2, false);
          });
        }
        append($$anchor3, fragment_4);
      });
      append($$anchor2, fragment_3);
    };
    let incognito = user_derived(() => getSettings("incognito"));
    let parseTitle = user_derived(() => getSettings("parseTitle"));
    let performerLinks = user_derived(() => getSettings("performerLinks"));
    let title = user_derived(() => data.title?.parsed);
    let searchTerms = user_derived(() => data.title?.searchTerms);
    let original = user_derived(() => data.title?.original);
    let firstTag = user_derived(() => {
      const tag = data.title?.tags?.[0];
      if (get(searchTerms)?.length === 0 && tag) return tag;
      return;
    });
    let items = user_derived(
() => {
        if (!get(title) || !get(searchTerms)?.length) return [get(title)];
        const sortedTerms = [...get(searchTerms)].sort((a, b) => b.length - a.length);
        const parts = [];
        let remaining = get(title);
        while (remaining) {
          let foundMatch = null;
          let foundIndex = remaining.length;
          for (const term of sortedTerms) {
            const index2 = remaining.indexOf(term);
            if (index2 !== -1 && index2 < foundIndex) {
              foundMatch = term;
              foundIndex = index2;
            }
          }
          if (foundMatch) {
            if (foundIndex > 0) parts.push(remaining.slice(0, foundIndex));
            parts.push(foundMatch);
            remaining = remaining.slice(foundIndex + foundMatch.length);
          } else {
            parts.push(remaining);
            break;
          }
        }
        return parts.filter((part) => part !== "");
      }
    );
    let documentTitle = user_derived(
() => {
        if (get(parseTitle)) {
          if (get(firstTag)) {
            return get(firstTag);
          } else if (get(title)) {
            return get(title);
          }
        }
        return data.title?.original || document.title;
      }
    );
    var fragment_10 = comment();
    head(($$anchor2) => {
      var fragment = comment();
      var node = first_child(fragment);
      {
        var consequent = ($$anchor3) => {
          template_effect(() => $document.title = get(documentTitle));
        };
        if_block(node, ($$render) => {
          if (get(documentTitle)) $$render(consequent);
        });
      }
      append($$anchor2, fragment);
    });
    var node_8 = first_child(fragment_10);
    {
      var consequent_5 = ($$anchor2) => {
        var h1 = root_15$1();
        var node_9 = child(h1);
        Placholder(node_9);
        append($$anchor2, h1);
      };
      var alternate_5 = ($$anchor2) => {
        var fragment_11 = comment();
        var node_10 = first_child(fragment_11);
        {
          var consequent_6 = ($$anchor3) => {
            var h1_1 = root_17();
            var text_5 = child(h1_1);
            template_effect(() => set_text(text_5, get(firstTag)));
            append($$anchor3, h1_1);
          };
          var alternate_4 = ($$anchor3) => {
            var fragment_12 = comment();
            var node_11 = first_child(fragment_12);
            {
              var consequent_7 = ($$anchor4) => {
                var h1_2 = root_19$1();
                var node_12 = child(h1_2);
                ParsedTitle(node_12, () => get(searchTerms));
                append($$anchor4, h1_2);
              };
              var alternate_3 = ($$anchor4) => {
                var fragment_13 = comment();
                var node_13 = first_child(fragment_13);
                {
                  var consequent_8 = ($$anchor5) => {
                    var h1_3 = root_21();
                    var a_3 = child(h1_3);
                    var text_6 = child(a_3);
                    template_effect(
                      ($0) => {
                        set_attribute(a_3, "href", `/forum/tracker.php?nm=${$0 ?? ""}`);
                        set_text(text_6, get(original));
                      },
                      [() => encodeURIComponent(get(original))]
                    );
                    append($$anchor5, h1_3);
                  };
                  if_block(
                    node_13,
                    ($$render) => {
                      if (get(original)) $$render(consequent_8);
                    },
                    true
                  );
                }
                append($$anchor4, fragment_13);
              };
              if_block(
                node_11,
                ($$render) => {
                  if (get(parseTitle) && get(title) && get(searchTerms)) $$render(consequent_7);
                  else $$render(alternate_3, false);
                },
                true
              );
            }
            append($$anchor3, fragment_12);
          };
          if_block(
            node_10,
            ($$render) => {
              if (get(firstTag)) $$render(consequent_6);
              else $$render(alternate_4, false);
            },
            true
          );
        }
        append($$anchor2, fragment_11);
      };
      if_block(node_8, ($$render) => {
        if (get(incognito)) $$render(consequent_5);
        else $$render(alternate_5, false);
      });
    }
    append($$anchor, fragment_10);
    pop();
  }
  delegate(["click"]);
  var root_1$8 = from_html(`<button class="item svelte-1ai34w7" aria-label="thank"></button>`);
  function Thank($$anchor, $$props) {
    push($$props, true);
    let observer2;
    let clicked = state$1(false);
    let success = state$1(false);
    let disabled = user_derived(
() => {
        if (get(success)) return true;
        if (!data.thank?.list) return false;
        const userLink = data.user?.link;
        if (!userLink) return false;
        const userId = new URL(userLink, location.href).searchParams.get("u");
        if (!userId) return false;
        return data.thank?.list.has(userId);
      }
    );
    let title = user_derived(
() => {
        if (get(disabled)) return "Already thanked";
        return;
      }
    );
    function handleValue(value) {
      if (data.thank?.element && data.thank?.element instanceof HTMLInputElement) data.thank.element.value = "Thanks: " + value;
    }
    function handleElement(thank) {
      return (element) => {
        if (thank) for (const attr of ["title", "style", "class"]) thank.removeAttribute(attr);
        if (get(disabled)) {
          handleValue("Given");
        } else if (get(clicked) && !get(disabled)) {
          handleValue("Loading...");
        } else {
          handleValue("Give");
        }
        element.appendChild(thank);
        return () => thank.remove();
      };
    }
    function onclick2(event2) {
      if (get(disabled) || get(clicked)) return;
      set(clicked, true);
      observer2?.disconnect();
      const currentTarget = event2.currentTarget;
      const callback = (mutationList, observer3) => {
        for (const mutation of mutationList) {
          if (mutation.type !== "childList") continue;
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLHeadingElement) {
              node.remove();
              set(success, true);
              observer3.disconnect();
            }
          });
        }
      };
      observer2 = new MutationObserver(callback);
      observer2.observe(currentTarget, { childList: true });
    }
    onDestroy(() => observer2?.disconnect());
    var fragment = comment();
    var node_1 = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var button = root_1$8();
        button.__click = onclick2;
        attach(button, () => handleElement(data.thank.element));
        template_effect(() => {
          set_attribute(button, "title", get(title));
          button.disabled = get(disabled);
        });
        append($$anchor2, button);
      };
      if_block(node_1, ($$render) => {
        if (data.thank?.element) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  const Item$1 = ($$anchor, title = noop, data2 = noop) => {
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_2$3();
        var span = child(div);
        var text2 = child(span);
        var span_1 = sibling(span, 2);
        var text_1 = child(span_1);
        template_effect(
          ($0) => {
            set_text(text2, `${title() ?? ""}:`);
            set_class(span_1, 1, $0, "svelte-cjprq");
            set_text(text_1, data2());
          },
          [() => clsx(title().toLowerCase())]
        );
        append($$anchor2, div);
      };
      var alternate = ($$anchor2) => {
        Error$1($$anchor2, title);
      };
      if_block(node, ($$render) => {
        if (data2()) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    append($$anchor, fragment);
  };
  const Error$1 = ($$anchor, title = noop) => {
    var div_1 = root_4$1();
    var span_2 = child(div_1);
    var text_2 = child(span_2);
    template_effect(() => set_text(text_2, `${title() ?? ""}:`));
    append($$anchor, div_1);
  };
  function handleDateClick(_, showFullDate) {
    set(showFullDate, !get(showFullDate));
  }
  function handleFileListClick(__1, fileListState) {
    if (store.showFileList) {
      set(fileListState, "idle");
    } else {
      set(fileListState, "loading");
    }
    store.toggleFileList();
  }
  var root_2$3 = from_html(`<div class="item svelte-cjprq"><span class="title"> </span> <span> </span></div>`);
  var root_4$1 = from_html(`<div class="item svelte-cjprq"><span class="title"> </span> <span class="error svelte-cjprq">N/A</span></div>`);
  var root_6$2 = from_html(`<button class="item svelte-cjprq"><span class="title">Date:</span> <!></button>`);
  var root_14 = from_html(`<span class="item svelte-cjprq"><!></span>`);
  var root_22 = from_html(`<a id="dl-link">.torrent</a>`);
  var root_18 = from_html(`<button class="item svelte-cjprq"><span class="title">Download:</span> <!></button>`);
  var root_27 = from_html(`<span><a> </a> </span>`);
  var root_26 = from_html(`<div class="item svelte-cjprq"><span class="title">Related:</span> <!></div>`);
  var root_5$3 = from_html(`<div id="x-stats" class="svelte-cjprq"><!> <!> <!> <!> <button class="item svelte-cjprq"><span class="title">Files:</span> <!></button> <!> <!> <!> <!></div>`);
  function Stats($$anchor, $$props) {
    push($$props, true);
    let showFullDate = state$1(false);
    let expandFiles = user_derived(() => getSettings("expandFiles"));
    let fileListState = state$1("idle");
    let downloadState = "idle";
    onMount(
() => {
        if (get(expandFiles)) {
          store.toggleFileList();
        }
      }
    );
    user_effect(
() => {
        if (!store.showFileList) {
          set(fileListState, "idle");
        }
        if (store.fileListData && get(fileListState) === "loading") {
          set(fileListState, "loaded");
        }
      }
    );
    var fragment_2 = comment();
    var node_1 = first_child(fragment_2);
    {
      var consequent_12 = ($$anchor2) => {
        var div_2 = root_5$3();
        var node_2 = child(div_2);
        Item$1(node_2, () => "Seeders", () => data.torrent?.seeders || "0");
        var node_3 = sibling(node_2, 2);
        Item$1(node_3, () => "Leechers", () => data.torrent?.leechers || "0");
        var node_4 = sibling(node_3, 2);
        Item$1(node_4, () => "Size", () => data.torrent?.size);
        var node_5 = sibling(node_4, 2);
        {
          var consequent_2 = ($$anchor3) => {
            var button = root_6$2();
            button.__click = [handleDateClick, showFullDate];
            var node_6 = sibling(child(button), 2);
            {
              var consequent_1 = ($$anchor4) => {
                var text_3 = text();
                template_effect(($0) => set_text(text_3, $0), [() => handleRelativeDate(data.torrent.date)]);
                append($$anchor4, text_3);
              };
              var alternate_1 = ($$anchor4) => {
                var text_4 = text();
                template_effect(($0) => set_text(text_4, $0), [() => data.torrent.date?.toLocaleString()]);
                append($$anchor4, text_4);
              };
              if_block(node_6, ($$render) => {
                if (!get(showFullDate)) $$render(consequent_1);
                else $$render(alternate_1, false);
              });
            }
            append($$anchor3, button);
          };
          var alternate_2 = ($$anchor3) => {
            Error$1($$anchor3, () => "Date");
          };
          if_block(node_5, ($$render) => {
            if (data.torrent?.date) $$render(consequent_2);
            else $$render(alternate_2, false);
          });
        }
        var button_1 = sibling(node_5, 2);
        button_1.__click = [handleFileListClick, fileListState];
        var node_7 = sibling(child(button_1), 2);
        {
          var consequent_3 = ($$anchor3) => {
            var text_5 = text("Loading...");
            append($$anchor3, text_5);
          };
          var alternate_4 = ($$anchor3) => {
            var fragment_6 = comment();
            var node_8 = first_child(fragment_6);
            {
              var consequent_4 = ($$anchor4) => {
                var text_6 = text("Hide");
                append($$anchor4, text_6);
              };
              var alternate_3 = ($$anchor4) => {
                var text_7 = text("Show");
                append($$anchor4, text_7);
              };
              if_block(
                node_8,
                ($$render) => {
                  if (store.showFileList) $$render(consequent_4);
                  else $$render(alternate_3, false);
                },
                true
              );
            }
            append($$anchor3, fragment_6);
          };
          if_block(node_7, ($$render) => {
            if (get(fileListState) === "loading") $$render(consequent_3);
            else $$render(alternate_4, false);
          });
        }
        var node_9 = sibling(button_1, 2);
        {
          var consequent_5 = ($$anchor3) => {
            var span_3 = root_14();
            var node_10 = child(span_3);
            Thank(node_10, {});
            append($$anchor3, span_3);
          };
          var alternate_5 = ($$anchor3) => {
            Error$1($$anchor3, () => "Thanks");
          };
          if_block(node_9, ($$render) => {
            if (data.thank?.element && data.thank?.list) $$render(consequent_5);
            else $$render(alternate_5, false);
          });
        }
        var node_11 = sibling(node_9, 2);
        {
          var consequent_6 = ($$anchor3) => {
            const format = user_derived(() => new Intl.NumberFormat("en-US").format(data.torrent.times));
            Item$1($$anchor3, () => "Downloads", () => get(format));
          };
          var alternate_6 = ($$anchor3) => {
            Error$1($$anchor3, () => "Downloads");
          };
          if_block(node_11, ($$render) => {
            if (data.torrent?.times != null) $$render(consequent_6);
            else $$render(alternate_6, false);
          });
        }
        var node_12 = sibling(node_11, 2);
        {
          var consequent_9 = ($$anchor3) => {
            var button_2 = root_18();
            button_2.__click = function(...$$args) {
              handleDownload?.apply(this, $$args);
            };
            button_2.disabled = downloadState === "downloading";
            var node_13 = sibling(child(button_2), 2);
            {
              var alternate_8 = ($$anchor4) => {
                var fragment_10 = comment();
                var node_14 = first_child(fragment_10);
                {
                  var alternate_7 = ($$anchor5) => {
                    var a = root_22();
                    template_effect(() => set_attribute(a, "href", data.torrent.link));
                    append($$anchor5, a);
                  };
                  if_block(
                    node_14,
                    ($$render) => {
                      $$render(alternate_7, false);
                    },
                    true
                  );
                }
                append($$anchor4, fragment_10);
              };
              if_block(node_13, ($$render) => {
                $$render(alternate_8, false);
              });
            }
            append($$anchor3, button_2);
          };
          var alternate_9 = ($$anchor3) => {
            Error$1($$anchor3, () => "Download");
          };
          if_block(node_12, ($$render) => {
            if (data.torrent?.link) $$render(consequent_9);
            else $$render(alternate_9, false);
          });
        }
        var node_15 = sibling(node_12, 2);
        {
          var consequent_11 = ($$anchor3) => {
            const max = user_derived(() => 5);
            var fragment_12 = comment();
            var node_16 = first_child(fragment_12);
            await_block(node_16, () => getRelated(data.title.original), null, ($$anchor4, related) => {
              const results = user_derived(() => get(related).filter((result) => result.textContent !== data.title?.original));
              var fragment_13 = comment();
              var node_17 = first_child(fragment_13);
              {
                var consequent_10 = ($$anchor5) => {
                  var div_3 = root_26();
                  var node_18 = sibling(child(div_3), 2);
                  each(node_18, 17, () => get(results), index, ($$anchor6, result, i) => {
                    var span_4 = root_27();
                    var a_1 = child(span_4);
                    var text_10 = child(a_1);
                    var text_11 = sibling(a_1);
                    template_effect(() => {
                      set_attribute(a_1, "href", get(result).href);
                      set_text(text_10, get(result).resolution);
                      set_text(text_11, ` ${i < get(results).length - 1 ? ", " : ""}`);
                    });
                    append($$anchor6, span_4);
                  });
                  append($$anchor5, div_3);
                };
                if_block(node_17, ($$render) => {
                  if (get(results).length > 0 && get(results).length < get(max)) $$render(consequent_10);
                });
              }
              append($$anchor4, fragment_13);
            });
            append($$anchor3, fragment_12);
          };
          if_block(node_15, ($$render) => {
            if (data.title?.original) $$render(consequent_11);
          });
        }
        template_effect(() => button_1.disabled = get(fileListState) === "loading");
        append($$anchor2, div_2);
      };
      if_block(node_1, ($$render) => {
        if (data.user && !data.forumline) $$render(consequent_12);
      });
    }
    append($$anchor, fragment_2);
    pop();
  }
  delegate(["click"]);
  var root_3$1 = from_html(`<a> </a>`);
  var root_6$1 = from_html(`<a> </a>`);
  var on_click$1 = (event2, item) => store.openDropdown(event2, get(item), ["tag-item--hover"]);
  var root_7$2 = from_html(`<span> </span>`);
  var root_1$7 = from_html(`<div id="x-tags" class="svelte-ttnt4a"></div>`);
  function Tags($$anchor, $$props) {
    push($$props, true);
    let parseTitle = user_derived(() => getSettings("parseTitle"));
    let showTags = user_derived(() => getSettings("showTags"));
    let performerLinks = user_derived(() => getSettings("performerLinks"));
    let derivedTags = user_derived(
() => {
        if (getSettings("incognito")) return ["tag1", "tag2", "tag3", "tag4", "tag5"];
        const tags = data?.title?.tags || [];
        return [...new Set(tags)];
      }
    );
    function resTag(tag) {
      return /\b(?:\d{3,}p|\d+k)\b/i.test(tag);
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_3 = ($$anchor2) => {
        var div = root_1$7();
        each(div, 21, () => get(derivedTags), index, ($$anchor3, item) => {
          const classList = user_derived(() => ["tag-item", resTag(get(item)) && "tag-res"]);
          var fragment_1 = comment();
          var node_1 = first_child(fragment_1);
          {
            var consequent = ($$anchor4) => {
              var a = root_3$1();
              var text2 = child(a);
              template_effect(
                ($0) => {
                  set_class(a, 1, clsx(get(classList)), "svelte-ttnt4a");
                  set_attribute(a, "href", `/forum/tracker.php?nm=${$0 ?? ""}`);
                  set_text(text2, get(item));
                },
                [() => encodeURIComponent(get(item))]
              );
              append($$anchor4, a);
            };
            var alternate_1 = ($$anchor4) => {
              var fragment_2 = comment();
              var node_2 = first_child(fragment_2);
              {
                var consequent_2 = ($$anchor5) => {
                  const link2 = user_derived(() => store.performerLinks[0]);
                  var fragment_3 = comment();
                  var node_3 = first_child(fragment_3);
                  {
                    var consequent_1 = ($$anchor6) => {
                      var a_1 = root_6$1();
                      var text_1 = child(a_1);
                      template_effect(
                        ($0) => {
                          set_class(a_1, 1, clsx(get(classList)), "svelte-ttnt4a");
                          set_attribute(a_1, "href", $0);
                          set_text(text_1, get(item));
                        },
                        [() => getLinkUrl(get(link2), get(item))]
                      );
                      append($$anchor6, a_1);
                    };
                    if_block(node_3, ($$render) => {
                      if (get(link2)) $$render(consequent_1);
                    });
                  }
                  append($$anchor5, fragment_3);
                };
                var alternate = ($$anchor5) => {
                  var span = root_7$2();
                  span.__click = [on_click$1, item];
                  var text_2 = child(span);
                  template_effect(() => {
                    set_class(span, 1, clsx(get(classList)), "svelte-ttnt4a");
                    set_text(text_2, get(item));
                  });
                  append($$anchor5, span);
                };
                if_block(
                  node_2,
                  ($$render) => {
                    if (store.performerLinks.length === 1) $$render(consequent_2);
                    else $$render(alternate, false);
                  },
                  true
                );
              }
              append($$anchor4, fragment_2);
            };
            if_block(node_1, ($$render) => {
              if (!get(performerLinks)) $$render(consequent);
              else $$render(alternate_1, false);
            });
          }
          append($$anchor3, fragment_1);
        });
        transition(3, div, () => slideFade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (get(parseTitle) && get(showTags) && get(derivedTags)?.length) $$render(consequent_3);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  var root_1$6 = from_html(`<div class="filelist svelte-1xito9"><!></div>`);
  function FileList($$anchor, $$props) {
    push($$props, true);
    function humanSize(bytes) {
      if (bytes <= 0) return "0 B";
      const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const rounders = [1, 1, 1, 100, 1e3, 1e3, 1e3, 1e3, 1e3];
      const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
      let value = bytes / Math.pow(1024, idx);
      const factor = rounders[idx];
      if (!factor) return null;
      value = Math.round((value + Number.EPSILON) * factor) / factor;
      return `${value} ${units[idx]}`;
    }
    async function getFileList() {
      const t = new URL(location.href).searchParams.get("t");
      if (!t) {
        console.error('Missing "t" parameter');
        return;
      }
      try {
        const res = await fetch("viewtorrent.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ t }).toString()
        });
        if (!res.ok) {
          console.error(`Server error: ${res.status}`);
          return;
        }
        const raw = await res.text();
        const doc = new DOMParser().parseFromString(raw, "text/html");
        doc.querySelectorAll("li.collapsable").forEach((li) => {
          let dirSize = 0;
          li.querySelectorAll("i").forEach((i) => {
            dirSize += parseInt(i.textContent?.trim() || "0", 10);
          });
          const spanB = li.querySelector("span.b");
          if (spanB) {
            const s = doc.createElement("s");
            s.textContent = humanSize(dirSize);
            spanB.append(" · ", s);
          }
        });
        doc.querySelectorAll("i").forEach((i) => {
          const bytes = parseInt(i.textContent?.trim() || "0", 10);
          i.textContent = humanSize(bytes);
        });
        store.fileListData = doc.body.innerHTML;
      } catch (err) {
        console.error("Failed to fetch/transform torrent filelist:", err);
      }
    }
    user_effect(
() => {
        if (!store.fileListData && store.showFileList) {
          getFileList();
        }
      }
    );
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$6();
        var node_1 = child(div);
        html(node_1, () => store.fileListData);
        transition(3, div, () => slideFade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (store.fileListData && store.showFileList) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  const parser$2 = new DOMParser();
  async function generic(href, selector, headers) {
    const { response, responseText, finalUrl } = await GM_fetch(
      "GET",
      href,
      "blob",
      headers
    );
    if (response.type.startsWith("image/")) {
      return finalUrl;
    }
    const doc = parser$2.parseFromString(responseText, "text/html");
    const img = doc.querySelector(selector);
    const src = img?.getAttribute("src");
    if (!src) {
      throw new Error(`image not found: ${href}`);
    }
    return new URL(src, href).href;
  }
  async function imagebam(href, selector) {
    const headers = { Cookie: "nsfw_inter=1" };
    return generic(href, selector, headers);
  }
  async function imagenimage(href, src) {
    const match = src?.match(
      /(https:\/\/img\d+\.imagenimage\.com\/)th\/(.+)\.jpg/
    );
    if (!src || !match) {
      const selector = "#left > a > img";
      const imgSrc2 = await generic(href, selector);
      return await getBlob(imgSrc2);
    }
    const domain = match[1];
    const path = match[2];
    const linkMatch = href.match(/https:\/\/imagenimage\.com\/(.+)/);
    if (!linkMatch) {
      throw new Error(`Invalid URL: ${href}`);
    }
    const filename = linkMatch[1];
    const imgSrc = `${domain}i/${path}.jpg/${filename}`;
    return await getBlob(imgSrc);
  }
  async function imagetwist(href, src) {
    let imgSrc;
    if (src && src.includes("/th/")) {
      const extRegex = /\.([\w]{2,4})(\?|$)/;
      const hrefExt = href.match(extRegex)?.[1];
      imgSrc = src.replace("/th/", "/i/");
      if (hrefExt) {
        imgSrc = imgSrc.replace(extRegex, `.${hrefExt}$2`);
      }
      const response = await GM_fetch("HEAD", imgSrc, "text");
      const imgError = /content-length:\s*8183/i.test(response.responseHeaders);
      if (!imgError) {
        return await getBlob(imgSrc);
      }
    }
    imgSrc = await generic(href, "img.pic");
    if (!imgSrc) {
      throw new Error(`image not found: ${href}`);
    }
    return await getBlob(imgSrc);
  }
  async function imgbase(href, src) {
    if (!src) return href;
    return src.replace("-thumb.", ".");
  }
  async function imgbox(href) {
    if (href.includes("thumbs"))
      return href.replace("thumbs", "images").replace("_t.", "_o.");
    const selector = "#img";
    return generic(href, selector);
  }
  const parser$1 = new DOMParser();
  async function imgbum(href) {
    const { responseText } = await GM_fetch("GET", href, "text");
    const doc = parser$1.parseFromString(responseText, "text/html");
    const selector = "table > tbody > tr > td > img";
    const img = doc.querySelector(selector);
    const onclick2 = img?.getAttribute("onclick");
    const match = onclick2?.match(/\/\*mshow\('([^']+)'\);\*\//);
    const imgSrc = match?.[1];
    if (!imgSrc) {
      throw new Error(`image not found: ${href}`);
    }
    return new URL(imgSrc, href).href;
  }
  async function imgdrive(href, src) {
    if (!src) return href;
    const imgSrc = src.replace("/small/", "/big/");
    if (src.includes("imgwallet.com")) return imgSrc;
    return await getBlob(imgSrc);
  }
  async function imgfrost(href, src) {
    if (!src) return Promise.resolve(href);
    const parsed = new URL(src);
    parsed.hostname = "prcf.imglomalr.site";
    parsed.pathname = parsed.pathname.replace("/small/small_", "/big/");
    const headers = { Referer: "https://imgair.net" };
    const { response, finalUrl } = await GM_fetch(
      "GET",
      parsed.href,
      "blob",
      headers
    );
    if (!response.type.startsWith("image/")) {
      throw new Error(`Expected image but got ${response.type} from ${finalUrl}`);
    }
    return finalUrl;
  }
  async function piccash(href, src) {
    let imgSrc;
    if (src && src.includes("img_thumb")) {
      imgSrc = src;
    } else {
      imgSrc = href;
    }
    return imgSrc.replace("http://", "https://").replace("/img_thumb/", "/img_full/").replace("-thumb.", ".");
  }
  const parser = new DOMParser();
  async function picforall(href) {
    const { responseText } = await GM_fetch("GET", href, "text");
    const selector = "#pay_thumb_img img";
    const doc = parser.parseFromString(responseText, "text/html");
    const img = doc.querySelector(selector);
    const onclick2 = img?.getAttribute("onclick");
    const match = onclick2?.match(/mshow\('([^']+)'\)/);
    const imgSrc = match?.[1];
    if (!imgSrc) {
      throw new Error(`image not found: ${href}`);
    }
    return imgSrc;
  }
  async function picshick(href, src) {
    if (!src || !src.includes("/th/") || !href.includes("/")) {
      const selector = "img.pic";
      const imgSrc = await generic(href, selector);
      return await getBlob(imgSrc);
    }
    const fileName = href.substring(href.lastIndexOf("/") + 1);
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
    const parts = src.split("/");
    const albumId = parts[parts.length - 2];
    const thumbFile = parts[parts.length - 1];
    if (!thumbFile) {
      throw Error(`parsing image: ${href}`);
    }
    const imageId = thumbFile.substring(0, thumbFile.lastIndexOf("."));
    const host = src.substring(0, src.indexOf("/th/"));
    const fullSizePath = `/i/${albumId}/${imageId}.${extension}/${fileName}`;
    const finalUrl = `${host}${fullSizePath}`;
    return await getBlob(finalUrl);
  }
  async function turboimagehost(href) {
    const { response, responseText, finalUrl } = await GM_fetch(
      "GET",
      href,
      "blob"
    );
    if (response.type.startsWith("image/")) {
      return finalUrl;
    }
    const match = responseText.match(/"og:image" content="([^"]+)"/);
    if (match[1]) {
      return new URL(match[1], href).href;
    }
    const selector = "#imageid";
    return generic(href, selector);
  }
  const HANDLERS = {
    "fastpic.": (href) => generic(href, "#imglink > img.image.img-fluid"),
    "imgsto.com": (href) => generic(href, ".main-content-image > img"),
    "imagebam.com": (href) => imagebam(href, "img.main-image"),
    "imageban.ru": (href) => generic(href, "#img_main"),
    "imagenimage.com": (href, src) => imagenimage(href, src),
    "imagetwist.com": (href, src) => imagetwist(href, src),
    "picturelol.com": (href, src) => imagetwist(href, src),
    "vipr.im": (href, src) => imagetwist(href, src),
    "imagevenue.com": (href) => generic(href, "#main-image"),
    "imgbase.ru": (href, src) => imgbase(href, src),
    "picclick.ru": (href, src) => imgbase(href, src),
    "adult-images.ru": (href, src) => imgbase(href, src),
    "payforpic.ru": (href, src) => imgbase(href, src),
    "imgbox.com": (href) => imgbox(href),
    "imgbum.ru": (href) => imgbum(href),
    "imgdrive.net": (href, src) => imgdrive(href, src),
    "imgadult.com": (href, src) => imgdrive(href, src),
    "imgwallet.com": (href, src) => imgdrive(href, src),
    "imgfrost.net": (href, src) => imgfrost(href, src),
    "imgblaze.net": (href, src) => imgfrost(href, src),
    "piccash.net": (href, src) => piccash(href, src),
    "picforall.ru": (href) => picforall(href),
    "imgclick.ru": (href) => picforall(href),
    "freescreens.ru": (href) => picforall(href),
    "picshick.com": (href, src) => picshick(href, src),
    "turboimagehost.com": (href) => turboimagehost(href)
  };
  function updateStatus(imageId, data2) {
    store.upgradeImgData[imageId] = {
      ...store.upgradeImgData[imageId],
      ...data2
    };
  }
  async function upgradeImg(img) {
    if (!img) return;
    if (!img.id) return console.error("Image is missing id");
    const anchor = img.closest("a");
    if (!anchor || !anchor.getAttribute("href")) {
      return updateStatus(img.id, {
        status: "error",
        error: `Image anchor with id ${img.id} is missing href`
      });
    }
    updateStatus(img.id, { status: "loading" });
    if (getSettings("cacheImages")) {
      const cached = getCache$1(anchor.href);
      if (cached) {
        if (img.complete && img.naturalHeight !== 0) {
          updateStatus(img.id, { status: "cached", resolved: cached });
        } else {
          on(
            img,
            "load",
            () => {
              updateStatus(img.id, { status: "cached", resolved: cached });
            },
            { once: true }
          );
          on(
            img,
            "error",
            () => {
              updateStatus(img.id, {
                status: "error",
                error: `Failed to load cached image: ${cached}`
              });
            },
            { once: true }
          );
        }
        img.src = cached;
        return;
      }
    }
    const entry = Object.entries(HANDLERS).find(
      ([domain]) => anchor.href.includes(domain)
    );
    if (!entry)
      return updateStatus(img.id, {
        status: "error",
        error: `No handler for ${new URL(anchor.href).hostname}`
      });
    const [, handler] = entry;
    try {
      const src = await handler(anchor.href, img.src);
      if (src.startsWith("blob:")) {
        on(
          img,
          "load",
          () => {
            URL.revokeObjectURL(src);
            updateStatus(img.id, { status: "resolved", resolved: src });
          },
          { once: true }
        );
        on(
          img,
          "error",
          () => {
            URL.revokeObjectURL(src);
            updateStatus(img.id, {
              status: "error",
              error: `Failed to load blob`
            });
          },
          { once: true }
        );
      } else {
        on(
          img,
          "load",
          () => {
            setCache$1(anchor.href, src);
            updateStatus(img.id, { status: "resolved", resolved: src });
          },
          { once: true }
        );
        on(
          img,
          "error",
          () => {
            updateStatus(img.id, {
              status: "error",
              error: `Failed to load image from: ${src}`
            });
          },
          { once: true }
        );
      }
      updateStatus(img.id, {
        resolved: src
      });
      img.src = src;
    } catch (error) {
      return updateStatus(img.id, {
        error: String(error),
        status: "error"
      });
    }
  }
  function onIntersect(entries, observer2) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer2.unobserve(entry.target);
        upgradeImg(entry.target);
      }
    });
  }
  const observed = new WeakSet();
  const observer = new IntersectionObserver(onIntersect, {
rootMargin: `${getSettings("limitConcurrent") ? "200%" : "1000%"} 0%`
  });
  async function observeImg(imgRefs) {
    const unobserved = imgRefs.filter((img) => {
      return !observed.has(img) && img instanceof HTMLImageElement;
    });
    if (!unobserved.length) return;
    unobserved.forEach((img) => {
      observed.add(img);
    });
    if (unobserved[0]) await upgradeImg(unobserved[0]);
    unobserved.slice(1).forEach((img) => {
      observer.observe(img);
    });
  }
  var root$2 = from_html(`<div><!></div>`);
  function Resize($$anchor, $$props) {
    push($$props, true);
    let clicked = prop($$props, "clicked", 15), resized = prop($$props, "resized", 15);
    let dragResize = user_derived(() => getSettings("dragResize"));
    let clientX = state$1(0);
    let prevResizeWidth = state$1(0);
    let draggedEl = state$1(null);
    let draggedElCenter = state$1(0);
    let fitColumnCount = state$1(proxy(store.columnCount));
    function getElementCenter(element) {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    }
    function clamp(value, min = 20, max = 100) {
      return Math.min(max, Math.max(min, value));
    }
    function onpointerdown(event2) {
      if (!get(dragResize) || !(event2.target instanceof HTMLImageElement)) return;
      if (event2.button !== 0) return;
      event2.preventDefault();
      set(draggedEl, event2.target, true);
      set(draggedElCenter, getElementCenter(get(draggedEl)), true);
      clicked(true);
      set(clientX, event2.clientX, true);
      set(prevResizeWidth, store.resizeWidth, true);
    }
    async function onpointermove(event2) {
      if (!get(dragResize) || !clicked()) return;
      if (!resized()) {
        resized(event2.clientX - get(clientX) !== 0);
      } else if (resized() && $$props.containerWidth) {
        const deltaPercent = (event2.clientX - get(clientX)) / $$props.containerWidth * 100;
        let newWidth = get(prevResizeWidth) + deltaPercent;
        let clampedWidth = clamp(newWidth);
        if (clampedWidth !== newWidth) {
          set(prevResizeWidth, clampedWidth, true);
          set(clientX, event2.clientX, true);
        }
        store.resizeWidth = Math.round(clampedWidth * 10) / 10;
        requestAnimationFrame(() => {
          if (!get(draggedEl)) return;
          const currentCenter = getElementCenter(get(draggedEl));
          const deltaY = currentCenter - get(draggedElCenter);
          window.scrollTo(0, window.scrollY + deltaY);
        });
      }
    }
    function onpointerup() {
      if (clicked() && resized()) {
        saveResize(store.resizeWidth);
      }
      clicked(false);
      resized(false);
      set(clientX, 0);
      set(prevResizeWidth, 0);
    }
    function waitForImages(containerEl) {
      const images = containerEl.querySelectorAll("img");
      return Promise.all(Array.from(images).map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      })));
    }
    function getpopulatedColumns(containerEl) {
      const marker = document.createElement("span");
      marker.style.cssText = "position: absolute; visibility: hidden; height: 1px;";
      containerEl.appendChild(marker);
      const markerRect = marker.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const columnWidth = containerRect.width / parseFloat(getComputedStyle(containerEl).columnCount);
      const actualColumns = Math.floor((markerRect.left - containerRect.left) / columnWidth) + 1;
      containerEl.removeChild(marker);
      return actualColumns;
    }
    user_effect(() => {
      set(fitColumnCount, store.columnCount, true);
      if (store.columnCount === 1) return;
      const containerEl = store.ultraImages?.querySelector('[style*="column-count"]');
      if (containerEl) {
        waitForImages(containerEl).then(() => {
          requestAnimationFrame(() => {
            const populatedColumns = getpopulatedColumns(containerEl);
            if (populatedColumns < store.columnCount) {
              set(fitColumnCount, populatedColumns, true);
            }
          });
        });
      }
    });
    var div = root$2();
    event("pointermove", $document, onpointermove);
    event("pointerup", $document, onpointerup);
    div.__pointerdown = onpointerdown;
    let classes;
    let styles;
    var node = child(div);
    snippet(node, () => $$props.children);
    template_effect(
      ($0, $1) => {
        classes = set_class(div, 1, "svelte-x5vner", null, classes, $0);
        styles = set_style(div, "", styles, $1);
      },
      [
        () => ({ dragging: clicked() && resized() }),
        () => ({
          width: `${(get(dragResize) ? store.resizeWidth : 100) ?? ""}%`,
          "column-count": get(fitColumnCount)
        })
      ]
    );
    append($$anchor, div);
    pop();
  }
  delegate(["pointerdown"]);
  var root_1$5 = from_html(`<div class="loader svelte-bb97q4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="svelte-bb97q4"><path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5" class="svelte-bb97q4"></path><path class="animate svelte-bb97q4" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"></path></svg></div>`);
  function Loader($$anchor, $$props) {
    push($$props, true);
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var div = root_1$5();
        transition(3, div, () => fade, () => store.transition);
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if ($$props.loading) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  const Item = ($$anchor, key = noop, value = noop, error = noop) => {
    var p = root_1$4();
    var strong = child(p);
    var text2 = child(strong);
    var node = sibling(strong, 2);
    {
      var consequent = ($$anchor2) => {
        var a = root_2$2();
        var text_1 = child(a);
        template_effect(() => {
          set_attribute(a, "href", value());
          set_text(text_1, value());
        });
        append($$anchor2, a);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        {
          var consequent_1 = ($$anchor3) => {
            var span = root_4();
            append($$anchor3, span);
          };
          var alternate = ($$anchor3) => {
            var fragment_1 = root_5$2();
            var text_2 = first_child(fragment_1);
            var node_2 = sibling(text_2);
            {
              var consequent_2 = ($$anchor4) => {
                var span_1 = root_6();
                var text_3 = child(span_1);
                template_effect(() => set_text(text_3, error()));
                append($$anchor4, span_1);
              };
              if_block(node_2, ($$render) => {
                if (value() === "error" && error()) $$render(consequent_2);
              });
            }
            template_effect(() => set_text(text_2, `${value() ?? ""} `));
            append($$anchor3, fragment_1);
          };
          if_block(
            node_1,
            ($$render) => {
              if (value() === void 0) $$render(consequent_1);
              else $$render(alternate, false);
            },
            true
          );
        }
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (value() && value().startsWith("http")) $$render(consequent);
        else $$render(alternate_1, false);
      });
    }
    template_effect(() => {
      set_attribute(p, "data-key", key());
      set_text(text2, key());
    });
    append($$anchor, p);
  };
  var root_2$2 = from_html(`<a class="svelte-swtc1e"> </a>`);
  var root_4 = from_html(`<span class="error svelte-swtc1e">null</span>`);
  var root_6 = from_html(`<span class="error svelte-swtc1e"> </span>`);
  var root_5$2 = from_html(` <!>`, 1);
  var root_1$4 = from_html(`<p class="svelte-swtc1e"><strong> </strong>: <!></p>`);
  var root_7$1 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="svelte-swtc1e"><path d="M17 9H7V7h10m0 6H7v-2h10m-3 6H7v-2h7M12 3a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m7 0h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2" class="svelte-swtc1e"></path></svg>`);
  var root$1 = from_html(`<div class="debug svelte-swtc1e"><!> <!> <!> <!> <div class="copy svelte-swtc1e"><!></div></div>`);
  function Debug($$anchor, $$props) {
    push($$props, true);
    let data2 = user_derived(() => store.upgradeImgData?.[$$props.img.id] || {});
    async function copyToClipboard(data3) {
      try {
        const dataWithoutId = Object.fromEntries(Object.entries(data3).filter(([key]) => key !== "id"));
        await navigator.clipboard.writeText(JSON.stringify(dataWithoutId, null, 2));
      } catch (err) {
        console.error("Failed to copy debug:", err);
      }
    }
    var div = root$1();
    var node_3 = child(div);
    Item(node_3, () => "status", () => get(data2).status, () => get(data2).error);
    var node_4 = sibling(node_3, 2);
    Item(node_4, () => "href", () => $$props.img.href);
    var node_5 = sibling(node_4, 2);
    Item(node_5, () => "src", () => $$props.img.src);
    var node_6 = sibling(node_5, 2);
    Item(node_6, () => "resolved", () => get(data2).resolved);
    var div_1 = sibling(node_6, 2);
    var node_7 = child(div_1);
    Checkmark(node_7, {
      onclick: () => copyToClipboard({
        id: $$props.img.id,
        href: $$props.img.href,
        src: $$props.img.src,
        status: get(data2).status,
        resolved: get(data2).resolved,
        error: get(data2).error
      }),
      title: "Copy to clipboard",
      children: ($$anchor2, $$slotProps) => {
        var svg = root_7$1();
        append($$anchor2, svg);
      },
      $$slots: { default: true }
    });
    transition(3, div, () => slide, () => store.transition);
    append($$anchor, div);
    pop();
  }
  var root_1$3 = from_html(`<div class="slider svelte-1bzlgy6"><input type="range" min="1" max="5" step="1" class="svelte-1bzlgy6"/> <span class="value svelte-1bzlgy6" title="Max columns"><span class="text svelte-1bzlgy6"> </span></span></div>`);
  var root = from_html(`<div class="image-columns svelte-1bzlgy6"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svelte-1bzlgy6"><path d="M22 9.999V20a1 1 0 0 1-1 1h-8V9.999zm-11 6V21H3a1 1 0 0 1-1-1v-4.001zM11 3v10.999H2V4a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v3.999h-9V3z"></path></svg> <!></div>`);
  function Columns($$anchor, $$props) {
    push($$props, true);
    let open = state$1(false);
    function onpointerenter() {
      set(open, true);
    }
    function onpointerleave() {
      set(open, false);
    }
    function onchange2() {
      saveColumnCount(store.columnCount);
    }
    var div = root();
    var node = sibling(child(div), 2);
    {
      var consequent = ($$anchor2) => {
        const opts = user_derived(() => ({ ...store.transition, axis: "x" }));
        var div_1 = root_1$3();
        var input = child(div_1);
        input.__change = onchange2;
        var span = sibling(input, 2);
        var span_1 = child(span);
        var text2 = child(span_1);
        template_effect(() => set_text(text2, store.columnCount));
        bind_value(input, () => store.columnCount, ($$value) => store.columnCount = $$value);
        transition(3, div_1, () => slideFade, () => get(opts));
        append($$anchor2, div_1);
      };
      if_block(node, ($$render) => {
        if (get(open)) $$render(consequent);
      });
    }
    event("pointerenter", div, onpointerenter);
    event("pointerleave", div, onpointerleave);
    append($$anchor, div);
    pop();
  }
  delegate(["change"]);
  var root_2$1 = from_html(`<div class="container svelte-27jg01"><!> <a target="_blank"><img/> <!></a></div>`);
  var root_5$1 = from_html(`<div id="x-images"><!> <!></div>`);
  function Images_1($$anchor, $$props) {
    push($$props, true);
    const Images = ($$anchor2, images2 = noop) => {
      var fragment = comment();
      var node = first_child(fragment);
      each(node, 19, images2, (img) => img.id, ($$anchor3, img, i) => {
        const gif = user_derived(() => get(img)?.src?.toLowerCase()?.includes(".gif"));
        const loading = user_derived(() => get(img)?.href ? "eager" : "lazy");
        var div = root_2$1();
        let styles;
        var node_1 = child(div);
        {
          var consequent = ($$anchor4) => {
            Debug($$anchor4, {
              get img() {
                return get(img);
              }
            });
          };
          if_block(node_1, ($$render) => {
            if (get(debugImgs)) $$render(consequent);
          });
        }
        var a = sibling(node_1, 2);
        let classes;
        var img_1 = child(a);
        let classes_1;
        bind_this(img_1, ($$value, i2) => store.imgRefs[i2] = $$value, (i2) => store?.imgRefs?.[i2], () => [get(i)]);
        var node_2 = sibling(img_1, 2);
        {
          var consequent_1 = ($$anchor4) => {
            const statusLoading = user_derived(() => store.upgradeImgData?.[get(img).id]?.status === "loading");
            {
              let $0 = user_derived(() => get(upgradeImages) && get(statusLoading));
              Loader($$anchor4, {
                get loading() {
                  return get($0);
                }
              });
            }
          };
          if_block(node_2, ($$render) => {
            if (!get(gif)) $$render(consequent_1);
          });
        }
        template_effect(
          ($0, $1, $2) => {
            set_attribute(div, "data-id", get(img).id);
            styles = set_style(div, "", styles, $0);
            set_attribute(a, "href", get(img)?.href);
            classes = set_class(a, 1, "svelte-27jg01", null, classes, $1);
            set_attribute(img_1, "loading", get(loading));
            set_attribute(img_1, "id", get(img).id);
            set_attribute(img_1, "src", get(img)?.src);
            set_attribute(img_1, "alt", get(img)?.src);
            classes_1 = set_class(img_1, 1, "svelte-27jg01", null, classes_1, $2);
          },
          [
            () => ({ order: handleOrder(get(i)) }),
            () => ({ gif: get(gif) }),
            () => ({ incognito: get(incognito), gif: get(gif) })
          ]
        );
        event("error", img_1, onerror);
        append($$anchor3, div);
      });
      append($$anchor2, fragment);
    };
    let clicked = state$1(false);
    let resized = state$1(false);
    let containerWidth = state$1(0);
    let upgradeImages = user_derived(() => getSettings("upgradeImages"));
    let incognito = user_derived(() => getSettings("incognito"));
    let lastImageFirst = user_derived(() => getSettings("lastImageFirst"));
    let debugImgs = user_derived(() => getSettings("debugImgs"));
    function onerror(event2) {
      const img = event2.currentTarget;
      img.dataset["broken"] = "true";
    }
    function handleOrder(index2) {
      if (data.images && get(lastImageFirst)) {
        if (index2 === data.images.length - 1) return -1;
      }
      return;
    }
    user_effect(
() => {
        if (get(upgradeImages) && store.imgRefs.length) {
          observeImg(store.imgRefs);
        }
        return () => observer.disconnect();
      }
    );
    let images = user_derived(() => {
      const images2 = data.images || [];
      if (!get(lastImageFirst) || images2.length <= 1) {
        return images2;
      }
      const reordered = images2.slice();
      reordered.unshift(reordered.pop());
      return reordered;
    });
    var fragment_3 = comment();
    var node_3 = first_child(fragment_3);
    {
      var consequent_2 = ($$anchor2) => {
        var div_1 = root_5$1();
        let classes_2;
        var node_4 = child(div_1);
        Columns(node_4, {});
        var node_5 = sibling(node_4, 2);
        Resize(node_5, {
          get containerWidth() {
            return get(containerWidth);
          },
          get clicked() {
            return get(clicked);
          },
          set clicked($$value) {
            set(clicked, $$value, true);
          },
          get resized() {
            return get(resized);
          },
          set resized($$value) {
            set(resized, $$value, true);
          },
          children: ($$anchor3, $$slotProps) => {
            Images($$anchor3, () => get(images));
          },
          $$slots: { default: true }
        });
        bind_this(div_1, ($$value) => store.ultraImages = $$value, () => store?.ultraImages);
        template_effect(($0) => classes_2 = set_class(div_1, 1, "section svelte-27jg01", null, classes_2, $0), [() => ({ dragging: get(clicked) && get(resized) })]);
        bind_element_size(div_1, "offsetWidth", ($$value) => set(containerWidth, $$value));
        append($$anchor2, div_1);
      };
      if_block(node_3, ($$render) => {
        if (data.images && data.images.length) $$render(consequent_2);
      });
    }
    append($$anchor, fragment_3);
    pop();
  }
  const Incognito = ($$anchor) => {
    var div = root_1$2();
    var a = sibling(child(div));
    a.__click = [on_click];
    set_style(a, "", {}, { cursor: "pointer" });
    append($$anchor, div);
  };
  const Forumline = ($$anchor, forumline = noop) => {
    const infoHeader = user_derived(() => forumline()?.querySelector("th")?.textContent);
    const infoBody = user_derived(() => forumline()?.querySelector("td")?.innerHTML);
    const errorMessages = user_derived(() => ({
      "Тема находится в мусорке": "The topic is in the trash",
      "Тема не найдена": "Topic not found",
      "Раздача ожидает проверки": "Distribution is awaiting moderator approval<br /><br />Viewing is currently unavailable"
    }));
    const currentError = user_derived(() => Object.keys(get(errorMessages)).find((key) => forumline()?.textContent?.includes(key)));
    var div_1 = root_2();
    var node = child(div_1);
    {
      var consequent = ($$anchor2) => {
        var fragment = root_3();
        var p = sibling(first_child(fragment), 4);
        set_style(p, "", {}, { "text-align": "center" });
        var node_1 = child(p);
        html(node_1, () => get(errorMessages)[get(currentError)]);
        append($$anchor2, fragment);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        {
          var consequent_1 = ($$anchor3) => {
            var fragment_2 = root_5();
            var h3 = first_child(fragment_2);
            var text2 = child(h3);
            var node_3 = sibling(h3, 2);
            html(node_3, () => get(infoBody));
            template_effect(() => set_text(text2, get(infoHeader)));
            append($$anchor3, fragment_2);
          };
          var alternate = ($$anchor3) => {
            var fragment_3 = comment();
            var node_4 = first_child(fragment_3);
            html(node_4, () => forumline()?.innerHTML);
            append($$anchor3, fragment_3);
          };
          if_block(
            node_2,
            ($$render) => {
              if (get(infoHeader) && get(infoBody)) $$render(consequent_1);
              else $$render(alternate, false);
            },
            true
          );
        }
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if (get(currentError)) $$render(consequent);
        else $$render(alternate_1, false);
      });
    }
    append($$anchor, div_1);
  };
  const Avatar = ($$anchor, avatar = noop, nick = noop, link2 = noop) => {
    var a_1 = root_7();
    var node_5 = child(a_1);
    {
      var consequent_2 = ($$anchor2) => {
        var img = root_8();
        template_effect(() => {
          set_attribute(img, "src", avatar());
          set_attribute(img, "alt", nick());
        });
        append($$anchor2, img);
      };
      var alternate_2 = ($$anchor2) => {
        var svg = root_9();
        append($$anchor2, svg);
      };
      if_block(node_5, ($$render) => {
        if (avatar()) $$render(consequent_2);
        else $$render(alternate_2, false);
      });
    }
    template_effect(() => set_attribute(a_1, "href", link2()));
    append($$anchor, a_1);
  };
  const Nick = ($$anchor, nick = noop, link2 = noop) => {
    var fragment_4 = comment();
    var node_6 = first_child(fragment_4);
    {
      var consequent_4 = ($$anchor2) => {
        const content = user_derived(() => nick() === "Гость" ? "Guest" : nick());
        var span = root_11();
        var node_7 = child(span);
        {
          var consequent_3 = ($$anchor3) => {
            var a_2 = root_12();
            var text_1 = child(a_2);
            template_effect(() => {
              set_attribute(a_2, "href", link2());
              set_text(text_1, get(content));
            });
            append($$anchor3, a_2);
          };
          var alternate_3 = ($$anchor3) => {
            var text_2 = text();
            template_effect(() => set_text(text_2, get(content)));
            append($$anchor3, text_2);
          };
          if_block(node_7, ($$render) => {
            if (link2()) $$render(consequent_3);
            else $$render(alternate_3, false);
          });
        }
        append($$anchor2, span);
      };
      if_block(node_6, ($$render) => {
        if (nick()) $$render(consequent_4);
      });
    }
    append($$anchor, fragment_4);
  };
  var on_click = (event2) => {
    event2.preventDefault();
    updateOption("incognito", false);
  };
  var root_1$2 = from_html(`<div>Post not rendered... <a href="#incognito" class="svelte-wfy26x">turn off incognito</a></div>`);
  var root_3 = from_html(`<h3>Information</h3> <br/> <p><!></p> <br/> <a href="/forum/index.php" class="svelte-wfy26x">Return to home page</a>`, 1);
  var root_5 = from_html(`<h3> </h3> <!>`, 1);
  var root_2 = from_html(`<div class="forumline svelte-wfy26x"><!></div>`);
  var root_8 = from_html(`<img class="svelte-wfy26x"/>`);
  var root_9 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svelte-wfy26x"><path fill="currentcolor" fill-rule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clip-rule="evenodd"></path></svg>`);
  var root_7 = from_html(`<a class="no-avatar svelte-wfy26x"><!></a>`);
  var root_12 = from_html(`<a class="svelte-wfy26x"> </a>`);
  var root_11 = from_html(`<span class="nick svelte-wfy26x"><!></span>`);
  var on_click_1 = (_, toggleFullDate, i) => toggleFullDate(i());
  var root_15 = from_html(`<button class="date svelte-wfy26x"><!></button>`);
  var root_23 = from_html(`<div class="post svelte-wfy26x"><div class="avatar svelte-wfy26x"><!></div> <div class="content svelte-wfy26x"><div class="header svelte-wfy26x"><!> <!></div> <div class="message svelte-wfy26x"></div></div></div>`);
  var root_19 = from_html(`<div id="x-post"><!></div>`);
  function Post($$anchor, $$props) {
    push($$props, true);
    const Date2 = ($$anchor2, date = noop, i = noop) => {
      var fragment_6 = comment();
      var node_8 = first_child(fragment_6);
      {
        var consequent_6 = ($$anchor3) => {
          const paredDate = user_derived(() => handleDate(date()));
          var button = root_15();
          button.__click = [on_click_1, toggleFullDate, i];
          var node_9 = child(button);
          {
            var consequent_5 = ($$anchor4) => {
              var text_3 = text();
              template_effect(($0) => set_text(text_3, $0), [() => get(paredDate)?.toLocaleString()]);
              append($$anchor4, text_3);
            };
            var alternate_4 = ($$anchor4) => {
              var text_4 = text();
              template_effect(($0) => set_text(text_4, $0), [() => handleRelativeDate(get(paredDate))]);
              append($$anchor4, text_4);
            };
            if_block(node_9, ($$render) => {
              if (showFullDate[i()]) $$render(consequent_5);
              else $$render(alternate_4, false);
            });
          }
          append($$anchor3, button);
        };
        if_block(node_8, ($$render) => {
          if (date()) $$render(consequent_6);
        });
      }
      append($$anchor2, fragment_6);
    };
    let incognito = user_derived(() => getSettings("incognito"));
    let showFullDate = proxy({});
    function toggleFullDate(index2) {
      showFullDate[index2] = !showFullDate[index2];
    }
    function insertPost(message) {
      return (element) => {
        element.appendChild(message);
        return () => message.remove();
      };
    }
    var fragment_9 = comment();
    var node_10 = first_child(fragment_9);
    {
      var consequent_7 = ($$anchor2) => {
        Incognito($$anchor2);
      };
      var alternate_6 = ($$anchor2) => {
        var div_2 = root_19();
        let classes;
        var node_11 = child(div_2);
        {
          var consequent_8 = ($$anchor3) => {
            Forumline($$anchor3, () => data.forumline);
          };
          var alternate_5 = ($$anchor3) => {
            var fragment_12 = comment();
            var node_12 = first_child(fragment_12);
            {
              var consequent_9 = ($$anchor4) => {
                var fragment_13 = comment();
                var node_13 = first_child(fragment_13);
                each(node_13, 17, () => data.posts, index, ($$anchor5, $$item, i) => {
                  let nick = () => get($$item).nick;
                  let link2 = () => get($$item).link;
                  let avatar = () => get($$item).avatar;
                  let date = () => get($$item).date;
                  let message = () => get($$item).message;
                  var div_3 = root_23();
                  var div_4 = child(div_3);
                  var node_14 = child(div_4);
                  Avatar(node_14, avatar, nick, link2);
                  var div_5 = sibling(div_4, 2);
                  var div_6 = child(div_5);
                  var node_15 = child(div_6);
                  Nick(node_15, nick, link2);
                  var node_16 = sibling(node_15, 2);
                  Date2(node_16, date, () => i);
                  var div_7 = sibling(div_6, 2);
                  attach(div_7, () => insertPost(message()));
                  append($$anchor5, div_3);
                });
                append($$anchor4, fragment_13);
              };
              if_block(
                node_12,
                ($$render) => {
                  if (data.posts && data.posts?.length) $$render(consequent_9);
                },
                true
              );
            }
            append($$anchor3, fragment_12);
          };
          if_block(node_11, ($$render) => {
            if (data.forumline) $$render(consequent_8);
            else $$render(alternate_5, false);
          });
        }
        bind_this(div_2, ($$value) => store.ultraPost = $$value, () => store?.ultraPost);
        template_effect(($0) => classes = set_class(div_2, 1, "svelte-wfy26x", null, classes, $0), [() => ({ section: data.forumline || data.posts?.length })]);
        append($$anchor2, div_2);
      };
      if_block(node_10, ($$render) => {
        if (get(incognito)) $$render(consequent_7);
        else $$render(alternate_6, false);
      });
    }
    append($$anchor, fragment_9);
    pop();
  }
  delegate(["click"]);
  var root_1$1 = from_html(`<div id="ultra-pagination" class="svelte-dlb7of"><!></div>`);
  function Pagination($$anchor, $$props) {
    push($$props, true);
    const parser2 = new DOMParser();
    const translations = {
      Страница: "Page",
      Страницы: "Pages",
      из: "of",
      "Пред.": "Prev",
      "След.": "Next"
    };
    const regex2 = /Страница|Страницы|из|Пред\.|След\./g;
    let content = user_derived(() => {
      if (!data.pagination?.innerHTML) return "";
      const doc = parser2.parseFromString(data.pagination.innerHTML, "text/html");
      const pageSelect = doc.querySelector("a.menu-root");
      if (pageSelect) {
        pageSelect.replaceWith(doc.createTextNode("Pages"));
      }
      return doc.body.innerHTML.replace(regex2, (match) => translations[match] ?? match).replace(/Pages\s+:/, "Pages:");
    });
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_1 = ($$anchor2) => {
        var div = root_1$1();
        var node_1 = child(div);
        {
          var consequent = ($$anchor3) => {
            var fragment_1 = comment();
            var node_2 = first_child(fragment_1);
            html(node_2, () => get(content));
            append($$anchor3, fragment_1);
          };
          if_block(node_1, ($$render) => {
            if (data.pagination) $$render(consequent);
          });
        }
        append($$anchor2, div);
      };
      if_block(node, ($$render) => {
        if (data?.pagination) $$render(consequent_1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  var root_1 = from_html(`<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>`, 1);
  function App($$anchor, $$props) {
    push($$props, true);
    let app = prop($$props, "app", 7);
    let firstPage = state$1(true);
    if (document.readyState === "loading") {
      on(document, "DOMContentLoaded", parseDOM, { once: true });
    } else {
      parseDOM();
    }
    function parseDOM() {
      if (forumDisabled(app())) return;
      if (Object.keys(data).length === 0) {
        Object.assign(data, handleData());
        store.showSettings = loadShowSettings();
        store.options = loadOptions();
        store.performerLinks = loadPerformerLinks();
        store.resizeWidth = loadResize();
        store.columnCount = loadColumnCount();
        const startParam = new URLSearchParams(location.search).get("start");
        set(firstPage, startParam === null || Number(startParam) === 0, true);
        setTimeout(
          () => {
            const selector = "#topic_main div.post-user-message";
            const posts = document.querySelectorAll(selector);
            data.posts = handlePosts(posts);
            Array.from(document.body.children).forEach((child2) => {
              if (child2 !== app()) child2.remove();
            });
            app().style.height = "auto";
          },
          0
        );
      }
    }
    user_effect(
() => {
        const darkMode = Boolean(data.theme?.darkmode);
        document.documentElement.dataset["theme"] = darkMode ? "dark" : "light";
        sessionStorage.setItem("dark-mode", darkMode.toString());
      }
    );
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent_1 = ($$anchor2) => {
        var fragment_1 = root_1();
        var node_1 = first_child(fragment_1);
        Events(node_1, {});
        var node_2 = sibling(node_1, 2);
        Header(node_2, {});
        var node_3 = sibling(node_2, 2);
        Settings(node_3, {});
        var node_4 = sibling(node_3, 2);
        Float(node_4, {});
        var node_5 = sibling(node_4, 2);
        Dropdown$1(node_5, {});
        var node_6 = sibling(node_5, 2);
        Title(node_6, {});
        var node_7 = sibling(node_6, 2);
        {
          var consequent = ($$anchor3) => {
            Stats($$anchor3, {});
          };
          var alternate = ($$anchor3) => {
            Pagination($$anchor3, {});
          };
          if_block(node_7, ($$render) => {
            if (get(firstPage)) $$render(consequent);
            else $$render(alternate, false);
          });
        }
        var node_8 = sibling(node_7, 2);
        Tags(node_8, {});
        var node_9 = sibling(node_8, 2);
        FileList(node_9, {});
        var node_10 = sibling(node_9, 2);
        Images_1(node_10, {});
        var node_11 = sibling(node_10, 2);
        Post(node_11, {});
        var node_12 = sibling(node_11, 2);
        Pagination(node_12, {});
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if (Object.keys(data).length !== 0) $$render(consequent_1);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  const appCss = "html{--border-radius-large: 8px;--border-radius-small: 4px;--tag-color: rgb(255, 255, 255);--content-margin: 1rem;--highlighted: rgb(180 99 0)}html[data-theme=dark]{--main-bg: rgb(18, 18, 18);--post-bg: rgb(40, 40, 40);--post-date-color: rgb(135, 179, 223);--post-border-color: rgb(85, 85, 85);--post-odd-bg: rgb(55, 55, 55);--link-color: rgb(156, 206, 255);--tag-bg: rgb(50 50 50);--search-color: rgb(255, 255, 255);--overlay-bg: rgb(32, 32, 32, .75);--input-bg: rgb(28, 27, 27);--incognito-filter: brightness(0);--button-color: rgb(40, 74, 134);--seed-color: rgb(51, 185, 51);--leech-color: rgb(255, 84, 84)}html[data-theme=light]{--main-bg: rgb(255, 255, 255);--post-bg: rgb(239, 239, 239);--post-date-color: rgb(52, 93, 164);--post-border-color: rgb(202, 202, 202);--post-odd-bg: rgb(227, 227, 227);--link-color: rgb(52, 93, 164);--tag-bg: var(--link-color);--search-color: rgb(0, 0, 0);--overlay-bg: rgba(255, 255, 255, .75);--input-bg: rgb(250, 250, 250);--incognito-filter: brightness(0) invert(1);--button-color: rgb(70, 119, 204);--seed-color: rgb(0, 102, 0);--leech-color: rgb(153, 0, 0)}#ultra{display:flex;flex-direction:column;padding:1.5rem 2.5rem;font-family:system-ui;background-color:var(--main-bg)}#ultra .section{background-color:var(--post-bg);border-radius:var(--border-radius-large);overflow:hidden;border:1px solid var(--post-border-color)}#ultra img{filter:unset}body{min-width:unset!important}";
  importCSS(appCss);
  if (userscriptDisabled()) {
    if (document.readyState === "loading") {
      on(document, "DOMContentLoaded", appendUserscriptEnableButton, {
        once: true
      });
    } else {
      appendUserscriptEnableButton();
    }
  } else {
    let mountApp = function() {
      const app = document.createElement("div");
      app.id = "ultra";
      app.style.height = "100vh";
      document.body.prepend(app);
      mount(App, {
        target: app,
        props: { app }
      });
    };
    const cachedTheme = sessionStorage.getItem("dark-mode");
    if (cachedTheme !== null)
      document.documentElement.dataset["theme"] = cachedTheme === "true" ? "dark" : "light";
    let CSP = false;
    if (document.head) {
      CSP = prependContentSecurityPolicy();
    }
    if (document.body) {
      mountApp();
      const body_container = document.getElementById("body_container");
      if (body_container) body_container.style.display = "none";
    } else {
      const targetNode = document.documentElement;
      const config = { childList: true, subtree: true };
      const callback = (mutationList, observer22) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              if (node.nodeName === "HEAD" && !CSP)
                CSP = prependContentSecurityPolicy();
              if (node.nodeName === "BODY") mountApp();
              if (node instanceof HTMLElement && node.id === "body_container") {
                node.style.display = "none";
                observer22.disconnect();
              }
            }
          }
        }
      };
      const observer2 = new MutationObserver(callback);
      observer2.observe(targetNode, config);
    }
  }

})();