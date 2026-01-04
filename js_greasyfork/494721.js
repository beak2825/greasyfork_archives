// ==UserScript==
// @name         S1 Reaction 帖子回应服务
// @namespace    https://github.com/rkanuj/s1-reaction
// @version      0.1.1
// @author       rkanuj
// @description  用麻将脸回应泥潭吧！
// @license      MIT
// @icon         https://bbs.saraba1st.com/favicon.ico
// @match        https://*.saraba1st.com/2b/thread-*
// @match        https://*.saraba1st.com/2b/forum.php?*tid=*
// @match        https://*.saraba1st.com/2b/space-*
// @match        https://*.stage1st.com/2b/thread-*
// @match        https://*.stage1st.com/2b/forum.php?*tid=*
// @match        https://*.stage1st.com/2b/space-*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494721/S1%20Reaction%20%E5%B8%96%E5%AD%90%E5%9B%9E%E5%BA%94%E6%9C%8D%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/494721/S1%20Reaction%20%E5%B8%96%E5%AD%90%E5%9B%9E%E5%BA%94%E6%9C%8D%E5%8A%A1.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .login.svelte-18l8ze5 .re-login-btn.svelte-18l8ze5.svelte-18l8ze5{width:240px}.login.svelte-18l8ze5 .re-login-btn.svelte-18l8ze5.svelte-18l8ze5:not(:last-child){margin-bottom:8px}.login.svelte-18l8ze5 .login-form.svelte-18l8ze5.svelte-18l8ze5{display:flex;flex-direction:column;width:240px}.login.svelte-18l8ze5 .login-form.svelte-18l8ze5>.svelte-18l8ze5:not(:last-child){margin-bottom:8px}.login.svelte-18l8ze5 .login-form.svelte-18l8ze5>input.svelte-18l8ze5,.login.svelte-18l8ze5 .login-form select.svelte-18l8ze5.svelte-18l8ze5{padding:4px;border:1px solid lightgray}.login.svelte-18l8ze5 .login-form .tips.svelte-18l8ze5.svelte-18l8ze5{font-size:.8em;color:#696969}.login.svelte-18l8ze5 .login-form .error-message.svelte-18l8ze5.svelte-18l8ze5{font-size:.8em;color:red}.modal-dialog.svelte-6la91r.svelte-6la91r{position:fixed;z-index:1001;top:50%;left:50%;overflow:auto;margin:0;padding:0;transform:translate(-50%,-50%);border:none;border-radius:8px;box-shadow:0 0 20px #696969}.modal-dialog.only-login-form.svelte-6la91r.svelte-6la91r{width:270px}.modal-dialog.svelte-6la91r.svelte-6la91r:not(.only-login-form){width:500px;height:80vh;max-height:580px}.modal-dialog.offline.svelte-6la91r.svelte-6la91r{max-height:350px}.modal-dialog.svelte-6la91r .dialog-header.svelte-6la91r{position:sticky;top:0;align-content:center;height:40px;padding:0 12px;border-bottom:1px solid lightgray;background-color:#fff}.modal-dialog.svelte-6la91r .dialog-header .dialog-title.svelte-6la91r{font-size:16px}.modal-dialog.svelte-6la91r .dialog-header .close-btn.svelte-6la91r{padding:0;cursor:pointer;border:none;background:none;font-size:12px;font-family:sans-serif;font-size:24px;position:absolute;top:0;right:16px;transition:color .3s ease;color:gray}.modal-dialog.svelte-6la91r .dialog-header .close-btn.svelte-6la91r:hover{color:#000}.modal-dialog.svelte-6la91r .dialog-content.svelte-6la91r{display:flex;align-items:center;flex-direction:column;padding:12px}.modal-backdrop.svelte-6la91r.svelte-6la91r{position:fixed;z-index:1000;top:0;left:0;width:100%;height:100%;background:#0000004d}.smiles.svelte-5twxn6 .remark.svelte-5twxn6{width:100%;margin-bottom:8px}.smiles.svelte-5twxn6 .smiles-type-btn.svelte-5twxn6{cursor:pointer;border:none;background:none;font-size:12px;font-family:sans-serif;padding:4px;border-top:1px dashed #022c80;border-right:1px dashed #022c80;background-color:buttonface}.smiles.svelte-5twxn6 .smiles-type-btn.svelte-5twxn6:first-child{border-left:1px dashed #022c80}.smiles.svelte-5twxn6 .smiles-type-btn.active.svelte-5twxn6{background-color:#fff}.smiles.svelte-5twxn6 .smiles-table.svelte-5twxn6{overflow:auto;width:440px;height:200px;border:1px dashed #022c80}.smiles.svelte-5twxn6 .smiles-table td.svelte-5twxn6{padding:2px}.smiles.svelte-5twxn6 .smiles-table td img.svelte-5twxn6{width:32px}.user-info.svelte-12lgkya.svelte-12lgkya.svelte-12lgkya{font-size:14px;width:100%}.user-info.svelte-12lgkya .user.svelte-12lgkya.svelte-12lgkya:not(:last-child){margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #022c80}.user-info.svelte-12lgkya .user.svelte-12lgkya>.svelte-12lgkya:not(:last-child){margin-bottom:8px}.user-info.svelte-12lgkya .user .remove-user-btn.svelte-12lgkya.svelte-12lgkya{padding:0;cursor:pointer;border:none;background:none;font-size:12px;font-family:sans-serif;font-weight:700;transition:color .3s ease;color:#ff4500}.user-info.svelte-12lgkya .user .remove-user-btn.svelte-12lgkya.svelte-12lgkya:hover{color:#8b0000}.user-info.svelte-12lgkya .user .token.svelte-12lgkya.svelte-12lgkya{color:#696969}.user-info.svelte-12lgkya .user .date.svelte-12lgkya.svelte-12lgkya{display:inline}.user-info.svelte-12lgkya .user .date.svelte-12lgkya>.svelte-12lgkya{color:green}.user-info.svelte-12lgkya .user .date.svelte-12lgkya>*.expired.svelte-12lgkya{color:red}.user-info.svelte-12lgkya .tips.svelte-12lgkya.svelte-12lgkya{font-size:.8em;color:#696969}.modal.svelte-81eduz .dialog-content>*:not(:last-child){margin-bottom:12px}.reacts.svelte-1kvsz55.svelte-1kvsz55{font-size:14px;display:grid;height:62px;padding:4px;border:1px dashed #022c80;grid-template-columns:repeat(auto-fill,minmax(56px,1fr))}.reacts.offline.svelte-1kvsz55.svelte-1kvsz55{display:flex;flex-wrap:wrap}.reacts.offline.svelte-1kvsz55 .react.svelte-1kvsz55{flex-direction:row}.reacts.svelte-1kvsz55 .react.svelte-1kvsz55{position:relative;display:flex;align-items:center;flex-direction:column;justify-content:space-between;padding:4px}.reacts.svelte-1kvsz55 .react img.svelte-1kvsz55{width:32px}table.plhin .po.hin{border-top:none}.post-reacts.svelte-1hkey2g .action-btn.svelte-1hkey2g{padding:0;cursor:pointer;border:none;background:none;font-size:12px;font-family:sans-serif;font-weight:700;position:absolute;top:0;right:0;transition:color .3s ease}.post-reacts.svelte-1hkey2g .action-btn.remove-react-btn.svelte-1hkey2g{color:#ff4500}.post-reacts.svelte-1hkey2g .action-btn.remove-react-btn.svelte-1hkey2g:hover{color:#8b0000}.post-reacts.svelte-1hkey2g .action-btn.plus-react-btn.svelte-1hkey2g{color:#32cd32}.post-reacts.svelte-1hkey2g .action-btn.plus-react-btn.svelte-1hkey2g:hover{color:#006400}.post-reacts.svelte-1hkey2g .add-react.svelte-1hkey2g{position:relative;align-content:center;padding:8px}.post-reacts.svelte-1hkey2g .add-react .add-react-btn.svelte-1hkey2g{cursor:pointer;border:none;background:none;font-size:12px;font-family:sans-serif;width:100%;padding:4px;transition:background-color .3s ease;border-radius:8px;background-color:#d1d9c1}.post-reacts.svelte-1hkey2g .add-react .add-react-btn.svelte-1hkey2g:hover{background-color:#c2cdb5}.post-reacts.svelte-1hkey2g .add-react .add-react-btn.svelte-1hkey2g:active{background-color:#c3c5ae}.user-reacts.svelte-1mwqdh0.svelte-1mwqdh0{margin-top:8px;border-top:1px dashed #022c80}.user-reacts.svelte-1mwqdh0 .action-btn.svelte-1mwqdh0{padding:0;cursor:pointer;border:none;background:none;font-size:12px;font-family:sans-serif;font-weight:700;position:absolute;top:0;right:0;transition:color .3s ease}.user-reacts.svelte-1mwqdh0 .action-btn.remove-react-btn.svelte-1mwqdh0{color:#ff4500}.user-reacts.svelte-1mwqdh0 .action-btn.remove-react-btn.svelte-1mwqdh0:hover{color:#8b0000}.user-reacts.svelte-1mwqdh0 .mbn.svelte-1mwqdh0{margin-top:8px;margin-bottom:8px!important} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  function noop() {
  }
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return (
      /** @type {T & S} */
      tar
    );
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (element_src === url)
      return true;
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      for (const callback of callbacks) {
        callback(void 0);
      }
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function get_store_value(store) {
    let value;
    subscribe(store, (_) => value = _)();
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
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
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
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
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
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function init_binding_group(group) {
    let _inputs;
    return {
      /* push */
      p(...inputs) {
        _inputs = inputs;
        _inputs.forEach((input) => group.push(input));
      },
      /* remove */
      r() {
        _inputs.forEach((input) => group.splice(group.indexOf(input), 1));
      }
    };
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    text2.data = /** @type {string} */
    data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function select_option(select, value, mounting) {
    for (let i = 0; i < select.options.length; i += 1) {
      const option = select.options[i];
      if (option.__value === value) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function select_value(select) {
    const selected_option = select.querySelector(":checked");
    return selected_option && selected_option.__value;
  }
  function toggle_class(element2, name, toggle) {
    element2.classList.toggle(name, !!toggle);
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
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
    seen_callbacks.clear();
    set_current_component(saved_component);
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
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
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
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block2(key, child_ctx);
        block.c();
      } else {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
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
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
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
      insert2(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
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
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    constructor() {
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$");
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$set");
    }
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  }
  const PUBLIC_VERSION = "4";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  const BASE_PATH = "http://localhost".replace(/\/+$/, "");
  class Configuration {
    constructor(configuration = {}) {
      this.configuration = configuration;
    }
    set config(configuration) {
      this.configuration = configuration;
    }
    get basePath() {
      return this.configuration.basePath != null ? this.configuration.basePath : BASE_PATH;
    }
    get fetchApi() {
      return this.configuration.fetchApi;
    }
    get middleware() {
      return this.configuration.middleware || [];
    }
    get queryParamsStringify() {
      return this.configuration.queryParamsStringify || querystring;
    }
    get username() {
      return this.configuration.username;
    }
    get password() {
      return this.configuration.password;
    }
    get apiKey() {
      const apiKey = this.configuration.apiKey;
      if (apiKey) {
        return typeof apiKey === "function" ? apiKey : () => apiKey;
      }
      return void 0;
    }
    get accessToken() {
      const accessToken = this.configuration.accessToken;
      if (accessToken) {
        return typeof accessToken === "function" ? accessToken : async () => accessToken;
      }
      return void 0;
    }
    get headers() {
      return this.configuration.headers;
    }
    get credentials() {
      return this.configuration.credentials;
    }
  }
  const DefaultConfig = new Configuration();
  const _BaseAPI = class _BaseAPI {
    constructor(configuration = DefaultConfig) {
      __publicField(this, "middleware");
      __publicField(this, "fetchApi", async (url, init2) => {
        let fetchParams = { url, init: init2 };
        for (const middleware of this.middleware) {
          if (middleware.pre) {
            fetchParams = await middleware.pre({
              fetch: this.fetchApi,
              ...fetchParams
            }) || fetchParams;
          }
        }
        let response = void 0;
        try {
          response = await (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init);
        } catch (e) {
          for (const middleware of this.middleware) {
            if (middleware.onError) {
              response = await middleware.onError({
                fetch: this.fetchApi,
                url: fetchParams.url,
                init: fetchParams.init,
                error: e,
                response: response ? response.clone() : void 0
              }) || response;
            }
          }
          if (response === void 0) {
            if (e instanceof Error) {
              throw new FetchError(e, "The request failed and the interceptors did not return an alternative response");
            } else {
              throw e;
            }
          }
        }
        for (const middleware of this.middleware) {
          if (middleware.post) {
            response = await middleware.post({
              fetch: this.fetchApi,
              url: fetchParams.url,
              init: fetchParams.init,
              response: response.clone()
            }) || response;
          }
        }
        return response;
      });
      this.configuration = configuration;
      this.middleware = configuration.middleware;
    }
    withMiddleware(...middlewares) {
      const next = this.clone();
      next.middleware = next.middleware.concat(...middlewares);
      return next;
    }
    withPreMiddleware(...preMiddlewares) {
      const middlewares = preMiddlewares.map((pre) => ({ pre }));
      return this.withMiddleware(...middlewares);
    }
    withPostMiddleware(...postMiddlewares) {
      const middlewares = postMiddlewares.map((post) => ({ post }));
      return this.withMiddleware(...middlewares);
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
      if (!mime) {
        return false;
      }
      return _BaseAPI.jsonRegex.test(mime);
    }
    async request(context, initOverrides) {
      const { url, init: init2 } = await this.createFetchParams(context, initOverrides);
      const response = await this.fetchApi(url, init2);
      if (response && (response.status >= 200 && response.status < 300)) {
        return response;
      }
      throw new ResponseError(response, "Response returned an error code");
    }
    async createFetchParams(context, initOverrides) {
      let url = this.configuration.basePath + context.path;
      if (context.query !== void 0 && Object.keys(context.query).length !== 0) {
        url += "?" + this.configuration.queryParamsStringify(context.query);
      }
      const headers = Object.assign({}, this.configuration.headers, context.headers);
      Object.keys(headers).forEach((key) => headers[key] === void 0 ? delete headers[key] : {});
      const initOverrideFn = typeof initOverrides === "function" ? initOverrides : async () => initOverrides;
      const initParams = {
        method: context.method,
        headers,
        body: context.body,
        credentials: this.configuration.credentials
      };
      const overriddenInit = {
        ...initParams,
        ...await initOverrideFn({
          init: initParams,
          context
        })
      };
      let body;
      if (isFormData(overriddenInit.body) || overriddenInit.body instanceof URLSearchParams || isBlob(overriddenInit.body)) {
        body = overriddenInit.body;
      } else if (this.isJsonMime(headers["Content-Type"])) {
        body = JSON.stringify(overriddenInit.body);
      } else {
        body = overriddenInit.body;
      }
      const init2 = {
        ...overriddenInit,
        body
      };
      return { url, init: init2 };
    }
    /**
     * Create a shallow clone of `this` by constructing a new instance
     * and then shallow cloning data members.
     */
    clone() {
      const constructor = this.constructor;
      const next = new constructor(this.configuration);
      next.middleware = this.middleware.slice();
      return next;
    }
  };
  __publicField(_BaseAPI, "jsonRegex", new RegExp("^(:?application/json|[^;/ 	]+/[^;/ 	]+[+]json)[ 	]*(:?;.*)?$", "i"));
  let BaseAPI = _BaseAPI;
  function isBlob(value) {
    return typeof Blob !== "undefined" && value instanceof Blob;
  }
  function isFormData(value) {
    return typeof FormData !== "undefined" && value instanceof FormData;
  }
  class ResponseError extends Error {
    constructor(response, msg) {
      super(msg);
      __publicField(this, "name", "ResponseError");
      this.response = response;
    }
  }
  class FetchError extends Error {
    constructor(cause, msg) {
      super(msg);
      __publicField(this, "name", "FetchError");
      this.cause = cause;
    }
  }
  function querystring(params, prefix = "") {
    return Object.keys(params).map((key) => querystringSingleKey(key, params[key], prefix)).filter((part) => part.length > 0).join("&");
  }
  function querystringSingleKey(key, value, keyPrefix = "") {
    const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
    if (value instanceof Array) {
      const multiValue = value.map((singleValue) => encodeURIComponent(String(singleValue))).join(`&${encodeURIComponent(fullKey)}=`);
      return `${encodeURIComponent(fullKey)}=${multiValue}`;
    }
    if (value instanceof Set) {
      const valueAsArray = Array.from(value);
      return querystringSingleKey(key, valueAsArray, keyPrefix);
    }
    if (value instanceof Date) {
      return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString())}`;
    }
    if (value instanceof Object) {
      return querystring(value, fullKey);
    }
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
  }
  class JSONApiResponse {
    constructor(raw, transformer = (jsonValue) => jsonValue) {
      this.raw = raw;
      this.transformer = transformer;
    }
    async value() {
      return this.transformer(await this.raw.json());
    }
  }
  function PostBanUserOrTokenRequestAdminAuthPayloadFromJSON(json) {
    return PostBanUserOrTokenRequestAdminAuthPayloadFromJSONTyped(json);
  }
  function PostBanUserOrTokenRequestAdminAuthPayloadFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "uid": json["uid"],
      "iat": json["iat"],
      "exp": json["exp"]
    };
  }
  function PostBanUserOrTokenRequestAdminAuthPayloadToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "uid": value["uid"],
      "iat": value["iat"],
      "exp": value["exp"]
    };
  }
  function PostBanUserOrTokenRequestAdminAuthFromJSON(json) {
    return PostBanUserOrTokenRequestAdminAuthFromJSONTyped(json);
  }
  function PostBanUserOrTokenRequestAdminAuthFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "token": json["token"],
      "payload": PostBanUserOrTokenRequestAdminAuthPayloadFromJSON(json["payload"])
    };
  }
  function PostBanUserOrTokenRequestAdminAuthToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "token": value["token"],
      "payload": PostBanUserOrTokenRequestAdminAuthPayloadToJSON(value["payload"])
    };
  }
  function PostGenerateToken200ResponseFromJSON(json) {
    return PostGenerateToken200ResponseFromJSONTyped(json);
  }
  function PostGenerateToken200ResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "success": json["success"],
      "result": PostBanUserOrTokenRequestAdminAuthFromJSON(json["result"]),
      "message": json["message"]
    };
  }
  function PostGenerateTokenRequestToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "uid": value["uid"],
      "sid": value["sid"],
      "exp": value["exp"]
    };
  }
  function PostQueryPostReacts200ResponseResultInnerReactsInnerFromJSON(json) {
    return PostQueryPostReacts200ResponseResultInnerReactsInnerFromJSONTyped(json);
  }
  function PostQueryPostReacts200ResponseResultInnerReactsInnerFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "smiley": json["smiley"],
      "count": json["count"],
      "reacted": json["reacted"]
    };
  }
  function PostQueryPostReacts200ResponseResultInnerFromJSON(json) {
    return PostQueryPostReacts200ResponseResultInnerFromJSONTyped(json);
  }
  function PostQueryPostReacts200ResponseResultInnerFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "pid": json["pid"],
      "reacts": json["reacts"].map(PostQueryPostReacts200ResponseResultInnerReactsInnerFromJSON)
    };
  }
  function PostQueryPostReacts200ResponseFromJSON(json) {
    return PostQueryPostReacts200ResponseFromJSONTyped(json);
  }
  function PostQueryPostReacts200ResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "success": json["success"],
      "result": json["result"].map(PostQueryPostReacts200ResponseResultInnerFromJSON),
      "message": json["message"]
    };
  }
  function PostQueryPostReactsRequestAuthToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "token": value["token"],
      "payload": PostBanUserOrTokenRequestAdminAuthPayloadToJSON(value["payload"])
    };
  }
  function PostQueryPostReactsRequestToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "pids": value["pids"],
      "auth": PostQueryPostReactsRequestAuthToJSON(value["auth"])
    };
  }
  function PostQueryUserReacts200ResponseResultSentInnerFromJSON(json) {
    return PostQueryUserReacts200ResponseResultSentInnerFromJSONTyped(json);
  }
  function PostQueryUserReacts200ResponseResultSentInnerFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "smiley": json["smiley"],
      "count": json["count"]
    };
  }
  function PostQueryUserReacts200ResponseResultFromJSON(json) {
    return PostQueryUserReacts200ResponseResultFromJSONTyped(json);
  }
  function PostQueryUserReacts200ResponseResultFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "sent": json["sent"].map(PostQueryUserReacts200ResponseResultSentInnerFromJSON),
      "received": json["received"].map(PostQueryUserReacts200ResponseResultSentInnerFromJSON)
    };
  }
  function PostQueryUserReacts200ResponseFromJSON(json) {
    return PostQueryUserReacts200ResponseFromJSONTyped(json);
  }
  function PostQueryUserReacts200ResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "success": json["success"],
      "result": PostQueryUserReacts200ResponseResultFromJSON(json["result"]),
      "message": json["message"]
    };
  }
  function PostQueryUserReactsRequestToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "uid2": value["uid2"]
    };
  }
  function PostUpdatePostReact200ResponseFromJSON(json) {
    return PostUpdatePostReact200ResponseFromJSONTyped(json);
  }
  function PostUpdatePostReact200ResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "success": json["success"],
      "result": json["result"].map(PostQueryPostReacts200ResponseResultInnerReactsInnerFromJSON),
      "message": json["message"]
    };
  }
  function PostUpdatePostReactRequestToJSON(value) {
    if (value == null) {
      return value;
    }
    return {
      "pid": value["pid"],
      "uid2": value["uid2"],
      "smiley": value["smiley"],
      "auth": PostBanUserOrTokenRequestAdminAuthToJSON(value["auth"])
    };
  }
  function PostVerifyToken200ResponseFromJSON(json) {
    return PostVerifyToken200ResponseFromJSONTyped(json);
  }
  function PostVerifyToken200ResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json == null) {
      return json;
    }
    return {
      "success": json["success"],
      "result": json["result"],
      "message": json["message"]
    };
  }
  class ReactApi extends BaseAPI {
    /**
     * Query reactions for post
     */
    async postQueryPostReactsRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = await this.request({
        path: `/react/queryPost`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: PostQueryPostReactsRequestToJSON(requestParameters["postQueryPostReactsRequest"])
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => PostQueryPostReacts200ResponseFromJSON(jsonValue));
    }
    /**
     * Query reactions for post
     */
    async postQueryPostReacts(requestParameters = {}, initOverrides) {
      const response = await this.postQueryPostReactsRaw(requestParameters, initOverrides);
      return await response.value();
    }
    /**
     * Query reactions for user
     */
    async postQueryUserReactsRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = await this.request({
        path: `/react/queryUser`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: PostQueryUserReactsRequestToJSON(requestParameters["postQueryUserReactsRequest"])
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => PostQueryUserReacts200ResponseFromJSON(jsonValue));
    }
    /**
     * Query reactions for user
     */
    async postQueryUserReacts(requestParameters = {}, initOverrides) {
      const response = await this.postQueryUserReactsRaw(requestParameters, initOverrides);
      return await response.value();
    }
    /**
     * Update reaction for post
     */
    async postUpdatePostReactRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = await this.request({
        path: `/react/update`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: PostUpdatePostReactRequestToJSON(requestParameters["postUpdatePostReactRequest"])
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => PostUpdatePostReact200ResponseFromJSON(jsonValue));
    }
    /**
     * Update reaction for post
     */
    async postUpdatePostReact(requestParameters = {}, initOverrides) {
      const response = await this.postUpdatePostReactRaw(requestParameters, initOverrides);
      return await response.value();
    }
  }
  class TokenApi extends BaseAPI {
    /**
     * Generate a token for user
     */
    async postGenerateTokenRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = await this.request({
        path: `/token/generate`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: PostGenerateTokenRequestToJSON(requestParameters["postGenerateTokenRequest"])
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => PostGenerateToken200ResponseFromJSON(jsonValue));
    }
    /**
     * Generate a token for user
     */
    async postGenerateToken(requestParameters = {}, initOverrides) {
      const response = await this.postGenerateTokenRaw(requestParameters, initOverrides);
      return await response.value();
    }
    /**
     * Verify a token if it is valid, without checking the ban list
     */
    async postVerifyTokenRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/json";
      const response = await this.request({
        path: `/token/verify`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: PostBanUserOrTokenRequestAdminAuthToJSON(requestParameters["postBanUserOrTokenRequestAdminAuth"])
      }, initOverrides);
      return new JSONApiResponse(response, (jsonValue) => PostVerifyToken200ResponseFromJSON(jsonValue));
    }
    /**
     * Verify a token if it is valid, without checking the ban list
     */
    async postVerifyToken(requestParameters = {}, initOverrides) {
      const response = await this.postVerifyTokenRaw(requestParameters, initOverrides);
      return await response.value();
    }
  }
  const subscriber_queue = [];
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe
    };
  }
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
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
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update2) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  class LocalStorage {
    static setUserInfoDict(value) {
      this.setItem("users", value);
    }
    static getUserInfoDict() {
      return this.getItem("users");
    }
    static setSelectedUID(value) {
      this.setItem("users.selected", value);
    }
    static getSelectedUID() {
      return this.getItem("users.selected");
    }
    static setSmilesList(value) {
      this.setItem("smiles", value);
    }
    static getSmilesList() {
      return this.getItem("smiles");
    }
    static setReactList(value) {
      this.setItem("reacts", value);
    }
    static getReactList() {
      return this.getItem("reacts");
    }
    static setItem(key, value) {
      localStorage.setItem(`${this.prefix}.${key}`, JSON.stringify(value));
    }
    static getItem(key) {
      const item = localStorage.getItem(`${this.prefix}.${key}`);
      if (!item) {
        return null;
      }
      return JSON.parse(item);
    }
  }
  __publicField(LocalStorage, "prefix", "s1-reaction");
  const userInfoDict = writable(LocalStorage.getUserInfoDict() || {});
  userInfoDict.subscribe((value) => {
    LocalStorage.setUserInfoDict(value);
  });
  const userInfoList = readable([], (set) => {
    return userInfoDict.subscribe((value) => {
      set(Object.values(value).toSorted((a, b) => a.uid - b.uid));
    });
  });
  const needLogin = readable(true, (set) => {
    return userInfoList.subscribe((value) => {
      set(value.length === 0);
    });
  });
  const selectedUID = writable(LocalStorage.getSelectedUID());
  selectedUID.subscribe((value) => {
    LocalStorage.setSelectedUID(value);
  });
  const selectedUserInfo = readable(null, (set) => {
    return selectedUID.subscribe((value) => {
      if (value === null) {
        set(null);
        return;
      }
      const selected = get_store_value(userInfoDict)[value];
      set(selected);
    });
  });
  const reactsDict = writable({});
  const reactsOfflineDict = writable({});
  const smilesList = writable(LocalStorage.getSmilesList() || []);
  smilesList.subscribe((value) => {
    LocalStorage.setSmilesList(value);
  });
  const smilesTable = readable([], (set) => {
    return smilesList.subscribe((value) => {
      const table = value.map((smiles) => {
        const list = [];
        smiles.list.forEach((item, i) => {
          if (i % 12 === 0) {
            list.push([]);
          }
          list[list.length - 1].push(item);
        });
        return {
          typeid: smiles.typeid,
          type: smiles.type,
          list
        };
      });
      set(table);
    });
  });
  const smileyDict = readable({}, (set) => {
    return smilesList.subscribe((value) => {
      const dict = {};
      value.map((item) => {
        return item.list;
      }).flat().forEach((item) => {
        dict[item.code] = item.url;
      });
      set(dict);
    });
  });
  const showModal = writable(false);
  const selectedPost = writable(null);
  function currentTimestamp(date = /* @__PURE__ */ new Date()) {
    return Math.floor(date.getTime() / 1e3);
  }
  function formatTimestamp(timestamp = currentTimestamp(), toLocal = false) {
    const date = new Date(timestamp * 1e3);
    if (toLocal) {
      return date.toLocaleString();
    }
    return date.toISOString();
  }
  function obj2form(data) {
    return Object.keys(data).map(
      (key) => {
        const value = data[key];
        if (value === void 0) {
          return "";
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    ).filter((item) => item).join("&");
  }
  function responseErrorHandle(e) {
    const response = (() => {
      if (e instanceof Response) {
        return e;
      }
      if (e.response && e.response instanceof Response) {
        return e.response;
      }
    })();
    if (response) {
      return response.json();
    }
    return {
      success: false,
      message: e instanceof Error ? e.message : String(e)
    };
  }
  function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function sortReacts(reacts) {
    return reacts.toSorted((a, b) => {
      const num = b.count - a.count;
      return num !== 0 ? num : a.smiley.localeCompare(b.smiley);
    });
  }
  function extractId(str, regexp) {
    var _a;
    const idStr = ((_a = str.match(regexp)) == null ? void 0 : _a[1]) ?? "";
    if (!idStr) {
      return null;
    }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return null;
    }
    return id;
  }
  function justAlert(message) {
    alert(`[S1 Reaction]: ${message}`);
  }
  function justLogError(message) {
    console.error("[S1 Reaction]: ", message);
  }
  async function checkSmiles() {
    {
      const smiles = get_store_value(smilesList);
      if (smiles.length > 0) {
        return true;
      }
    }
    const response = await API.s1Api.getSmiles().catch(responseErrorHandle);
    if (!response.success) {
      justAlert("通过 S1 接口获取麻将脸表情列表失败");
      if (response.message) {
        justLogError(response.message);
      }
      return false;
    }
    smilesList.set(response.data.slice(0, 6));
    return true;
  }
  class S1ApiOffline extends BaseAPI {
    async getSmiles(initOverrides) {
      const response = await this.getSmilesRaw(initOverrides);
      return await response.value();
    }
    async getSmilesRaw(initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      const response = await this.request({
        path: "/post/smiles",
        method: "GET",
        headers: headerParameters,
        query: queryParameters
      }, initOverrides);
      return new JSONApiResponse(response);
    }
  }
  class S1Api extends S1ApiOffline {
    async postLogin(requestParameters, initOverrides) {
      const response = await this.postLoginRaw(requestParameters, initOverrides);
      return await response.value();
    }
    async postLogout(requestParameters, initOverrides) {
      const response = await this.postLogoutRaw(requestParameters, initOverrides);
      return await response.value();
    }
    async postLoginRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      const response = await this.request({
        path: "/user/login",
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: obj2form(requestParameters)
      }, initOverrides);
      return new JSONApiResponse(response);
    }
    async postLogoutRaw(requestParameters, initOverrides) {
      const queryParameters = {};
      const headerParameters = {};
      headerParameters["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      const response = await this.request({
        path: "/user/logout",
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: obj2form(requestParameters)
      }, initOverrides);
      return new JSONApiResponse(response);
    }
  }
  class API {
    static init() {
      const configServer = new Configuration({
        basePath: "https://s1-reaction.beepers-topaz-0c.workers.dev"
      });
      const configS1Api = new Configuration({
        basePath: "https://app.saraba1st.com/2b/api/app"
      });
      {
        this.authApi = new TokenApi(configServer);
        this.reactApi = new ReactApi(configServer);
        this.s1Api = new S1Api(configS1Api);
      }
    }
  }
  __publicField(API, "authApi");
  __publicField(API, "reactApi");
  __publicField(API, "reactApiOffline");
  __publicField(API, "s1Api");
  __publicField(API, "s1ApiOffline");
  API.init();
  async function reactApiUpdatePostReact(post, smiley, user) {
    const response = await API.reactApi.postUpdatePostReact({
      postUpdatePostReactRequest: {
        pid: post.pid,
        uid2: post.uid2,
        smiley,
        auth: user.auth
      }
    }).catch(responseErrorHandle);
    if (!response.success) {
      justAlert(response.message || "更新回应失败");
      return false;
    }
    reactsDict.update((dict) => {
      const newDict = deepCopy(dict);
      newDict[`pid${post.pid}`] = response.result.map((react) => {
        return {
          smiley: react.smiley,
          count: react.count,
          reacted: react.reacted > 0
        };
      });
      return newDict;
    });
    return true;
  }
  function create_if_block$6(ctx) {
    let div;
    function select_block_type(ctx2, dirty) {
      if (!/*needReLogin*/
      ctx2[7])
        return create_if_block_1$5;
      return create_else_block$3;
    }
    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        div = element("div");
        if_block.c();
        attr(div, "class", "login svelte-18l8ze5");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_block.m(div, null);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(div, null);
          }
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if_block.d();
      }
    };
  }
  function create_else_block$3(ctx) {
    let t0;
    let div;
    let input0;
    let t1;
    let input1;
    let t2;
    let select;
    let option0;
    let option1;
    let option2;
    let option3;
    let option4;
    let option5;
    let option6;
    let option7;
    let t11;
    let t12;
    let input2;
    let t13;
    let span;
    let t15;
    let button;
    let t17;
    let mounted;
    let dispose;
    let if_block0 = !/*$needLogin*/
    ctx[0] && create_if_block_4$1(ctx);
    let if_block1 = (
      /*questionid*/
      ctx[3] && /*questionid*/
      ctx[3] !== "0" && create_if_block_3$2(ctx)
    );
    let if_block2 = (
      /*errorMessage*/
      ctx[6] && create_if_block_2$5(ctx)
    );
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        div = element("div");
        input0 = element("input");
        t1 = space();
        input1 = element("input");
        t2 = space();
        select = element("select");
        option0 = element("option");
        option0.textContent = "安全提问（未设置请忽略）";
        option1 = element("option");
        option1.textContent = "母亲的名字";
        option2 = element("option");
        option2.textContent = "爷爷的名字";
        option3 = element("option");
        option3.textContent = "父亲出生的城市";
        option4 = element("option");
        option4.textContent = "您其中一位老师的名字";
        option5 = element("option");
        option5.textContent = "您个人计算机的型号";
        option6 = element("option");
        option6.textContent = "您最喜欢的餐馆名称";
        option7 = element("option");
        option7.textContent = "驾驶执照最后四位数字";
        t11 = space();
        if (if_block1)
          if_block1.c();
        t12 = space();
        input2 = element("input");
        t13 = space();
        span = element("span");
        span.textContent = "留空或 0 设为不过期（单位：秒）";
        t15 = space();
        button = element("button");
        button.textContent = "登录";
        t17 = space();
        if (if_block2)
          if_block2.c();
        attr(input0, "name", "username");
        attr(input0, "placeholder", "用户名");
        attr(input0, "type", "text");
        attr(input0, "class", "svelte-18l8ze5");
        attr(input1, "name", "password");
        attr(input1, "placeholder", "密码");
        attr(input1, "type", "password");
        attr(input1, "class", "svelte-18l8ze5");
        option0.__value = "0";
        set_input_value(option0, option0.__value);
        option1.__value = "1";
        set_input_value(option1, option1.__value);
        option2.__value = "2";
        set_input_value(option2, option2.__value);
        option3.__value = "3";
        set_input_value(option3, option3.__value);
        option4.__value = "4";
        set_input_value(option4, option4.__value);
        option5.__value = "5";
        set_input_value(option5, option5.__value);
        option6.__value = "6";
        set_input_value(option6, option6.__value);
        option7.__value = "7";
        set_input_value(option7, option7.__value);
        attr(select, "class", "svelte-18l8ze5");
        if (
          /*questionid*/
          ctx[3] === void 0
        )
          add_render_callback(() => (
            /*select_change_handler*/
            ctx[14].call(select)
          ));
        attr(input2, "min", "0");
        attr(input2, "placeholder", "Token 有效时长");
        attr(input2, "type", "number");
        attr(input2, "class", "svelte-18l8ze5");
        attr(span, "class", "tips svelte-18l8ze5");
        attr(button, "class", "svelte-18l8ze5");
        attr(div, "class", "login-form svelte-18l8ze5");
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        insert(target, div, anchor);
        append(div, input0);
        set_input_value(
          input0,
          /*username*/
          ctx[1]
        );
        append(div, t1);
        append(div, input1);
        set_input_value(
          input1,
          /*password*/
          ctx[2]
        );
        append(div, t2);
        append(div, select);
        append(select, option0);
        append(select, option1);
        append(select, option2);
        append(select, option3);
        append(select, option4);
        append(select, option5);
        append(select, option6);
        append(select, option7);
        select_option(
          select,
          /*questionid*/
          ctx[3],
          true
        );
        append(div, t11);
        if (if_block1)
          if_block1.m(div, null);
        append(div, t12);
        append(div, input2);
        set_input_value(
          input2,
          /*exp*/
          ctx[5]
        );
        append(div, t13);
        append(div, span);
        append(div, t15);
        append(div, button);
        append(div, t17);
        if (if_block2)
          if_block2.m(div, null);
        if (!mounted) {
          dispose = [
            listen(
              input0,
              "input",
              /*input0_input_handler*/
              ctx[12]
            ),
            listen(
              input1,
              "input",
              /*input1_input_handler*/
              ctx[13]
            ),
            listen(
              select,
              "change",
              /*select_change_handler*/
              ctx[14]
            ),
            listen(
              select,
              "change",
              /*change_handler*/
              ctx[15]
            ),
            listen(
              input2,
              "input",
              /*input2_input_handler*/
              ctx[17]
            ),
            listen(
              button,
              "click",
              /*onLoginBtnClick*/
              ctx[9]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (!/*$needLogin*/
        ctx2[0]) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_4$1(ctx2);
            if_block0.c();
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & /*username*/
        2 && input0.value !== /*username*/
        ctx2[1]) {
          set_input_value(
            input0,
            /*username*/
            ctx2[1]
          );
        }
        if (dirty & /*password*/
        4 && input1.value !== /*password*/
        ctx2[2]) {
          set_input_value(
            input1,
            /*password*/
            ctx2[2]
          );
        }
        if (dirty & /*questionid*/
        8) {
          select_option(
            select,
            /*questionid*/
            ctx2[3]
          );
        }
        if (
          /*questionid*/
          ctx2[3] && /*questionid*/
          ctx2[3] !== "0"
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_3$2(ctx2);
            if_block1.c();
            if_block1.m(div, t12);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (dirty & /*exp*/
        32 && to_number(input2.value) !== /*exp*/
        ctx2[5]) {
          set_input_value(
            input2,
            /*exp*/
            ctx2[5]
          );
        }
        if (
          /*errorMessage*/
          ctx2[6]
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_2$5(ctx2);
            if_block2.c();
            if_block2.m(div, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(div);
        }
        if (if_block0)
          if_block0.d(detaching);
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block_1$5(ctx) {
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "重新登录或登录新账号";
        attr(button, "class", "re-login-btn svelte-18l8ze5");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*click_handler*/
            ctx[10]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_4$1(ctx) {
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "退出登录";
        attr(button, "class", "re-login-btn svelte-18l8ze5");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*click_handler_1*/
            ctx[11]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_3$2(ctx) {
    let input;
    let mounted;
    let dispose;
    return {
      c() {
        input = element("input");
        attr(input, "placeholder", "答案");
        attr(input, "type", "text");
        attr(input, "class", "svelte-18l8ze5");
      },
      m(target, anchor) {
        insert(target, input, anchor);
        set_input_value(
          input,
          /*answer*/
          ctx[4]
        );
        if (!mounted) {
          dispose = listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[16]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*answer*/
        16 && input.value !== /*answer*/
        ctx2[4]) {
          set_input_value(
            input,
            /*answer*/
            ctx2[4]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(input);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_2$5(ctx) {
    let span;
    let t;
    return {
      c() {
        span = element("span");
        t = text(
          /*errorMessage*/
          ctx[6]
        );
        attr(span, "class", "error-message svelte-18l8ze5");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*errorMessage*/
        64)
          set_data(
            t,
            /*errorMessage*/
            ctx2[6]
          );
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_fragment$7(ctx) {
    let if_block_anchor;
    let if_block = create_if_block$6(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, [dirty]) {
        if_block.p(ctx2, dirty);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$7($$self, $$props, $$invalidate) {
    let $selectedUID;
    let $needLogin;
    component_subscribe($$self, selectedUID, ($$value) => $$invalidate(18, $selectedUID = $$value));
    component_subscribe($$self, needLogin, ($$value) => $$invalidate(0, $needLogin = $$value));
    let username = "";
    let password = "";
    let questionid = "0";
    let answer = "";
    let exp;
    let errorMessage = "";
    let needReLogin = $needLogin;
    const resetForm = () => {
      $$invalidate(1, username = "");
      $$invalidate(2, password = "");
      $$invalidate(3, questionid = "0");
      $$invalidate(4, answer = "");
      $$invalidate(5, exp = void 0);
      $$invalidate(6, errorMessage = "");
    };
    const loginAndGenerateToken = async () => {
      if (!username || !password) {
        return "用户名或密码不能为空";
      }
      const loginResponse = await API.s1Api.postLogin(questionid && questionid !== "0" ? { username, password, questionid, answer } : { username, password }).catch(responseErrorHandle);
      if (!loginResponse.success) {
        return loginResponse.message || "S1 登录接口失败";
      }
      const uid = parseInt(loginResponse.data.uid, 10);
      const sid = loginResponse.data.sid;
      $$invalidate(1, username = loginResponse.data.username);
      $$invalidate(5, exp = exp && exp > 0 ? exp : 0);
      const generateTokenResponse = await API.authApi.postGenerateToken({
        postGenerateTokenRequest: { uid, sid, exp }
      }).catch(responseErrorHandle).finally(async () => {
        const logoutResponse = await API.s1Api.postLogout({ sid }).catch(responseErrorHandle);
        if (!logoutResponse.success) {
          justLogError(logoutResponse.message || "S1 登出接口失败");
        }
      });
      if (!generateTokenResponse.success) {
        return generateTokenResponse.message || "生成 Token 失败";
      }
      userInfoDict.update((dict) => {
        const newDict = deepCopy(dict);
        newDict[uid] = {
          uid,
          username,
          auth: generateTokenResponse.result
        };
        return newDict;
      });
      set_store_value(selectedUID, $selectedUID = uid, $selectedUID);
      return null;
    };
    const onLoginBtnClick = async () => {
      const result = await loginAndGenerateToken();
      if (result !== null) {
        $$invalidate(6, errorMessage = `账号登录失败：${result}`);
        return;
      }
      $$invalidate(7, needReLogin = false);
      resetForm();
    };
    const click_handler = () => {
      $$invalidate(7, needReLogin = true);
    };
    const click_handler_1 = () => {
      $$invalidate(7, needReLogin = false);
      resetForm();
    };
    function input0_input_handler() {
      username = this.value;
      $$invalidate(1, username);
    }
    function input1_input_handler() {
      password = this.value;
      $$invalidate(2, password);
    }
    function select_change_handler() {
      questionid = select_value(this);
      $$invalidate(3, questionid);
    }
    const change_handler = () => {
      $$invalidate(4, answer = "");
    };
    function input_input_handler() {
      answer = this.value;
      $$invalidate(4, answer);
    }
    function input2_input_handler() {
      exp = to_number(this.value);
      $$invalidate(5, exp);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$needLogin*/
      1) {
        $$invalidate(7, needReLogin = $needLogin);
      }
    };
    return [
      $needLogin,
      username,
      password,
      questionid,
      answer,
      exp,
      errorMessage,
      needReLogin,
      resetForm,
      onLoginBtnClick,
      click_handler,
      click_handler_1,
      input0_input_handler,
      input1_input_handler,
      select_change_handler,
      change_handler,
      input_input_handler,
      input2_input_handler
    ];
  }
  class Login extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$7, safe_not_equal, {});
    }
  }
  function create_if_block$5(ctx) {
    let div;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        attr(div, "class", "modal-backdrop svelte-6la91r");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (!mounted) {
          dispose = listen(
            div,
            "click",
            /*onBackdropClick*/
            ctx[4]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$6(ctx) {
    let dialog_1;
    let div1;
    let div0;
    let t1;
    let button;
    let t3;
    let div2;
    let t4;
    let if_block_anchor;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[6].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[5],
      null
    );
    let if_block = (
      /*$showModal*/
      ctx[1] && create_if_block$5(ctx)
    );
    return {
      c() {
        dialog_1 = element("dialog");
        div1 = element("div");
        div0 = element("div");
        div0.textContent = "S1 Reaction";
        t1 = space();
        button = element("button");
        button.textContent = "×";
        t3 = space();
        div2 = element("div");
        if (default_slot)
          default_slot.c();
        t4 = space();
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
        attr(div0, "class", "dialog-title svelte-6la91r");
        attr(button, "class", "close-btn svelte-6la91r");
        attr(div1, "class", "dialog-header svelte-6la91r");
        attr(div2, "class", "dialog-content svelte-6la91r");
        attr(dialog_1, "class", "modal-dialog svelte-6la91r");
        toggle_class(dialog_1, "offline", false);
        toggle_class(
          dialog_1,
          "only-login-form",
          /*$needLogin*/
          ctx[2]
        );
      },
      m(target, anchor) {
        insert(target, dialog_1, anchor);
        append(dialog_1, div1);
        append(div1, div0);
        append(div1, t1);
        append(div1, button);
        append(dialog_1, t3);
        append(dialog_1, div2);
        if (default_slot) {
          default_slot.m(div2, null);
        }
        ctx[7](dialog_1);
        insert(target, t4, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*onCloseBtnClick*/
            ctx[3]
          );
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[5],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[5]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[5],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (!current || dirty & /*$needLogin*/
        4) {
          toggle_class(
            dialog_1,
            "only-login-form",
            /*$needLogin*/
            ctx2[2]
          );
        }
        if (
          /*$showModal*/
          ctx2[1]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$5(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(dialog_1);
          detach(t4);
          detach(if_block_anchor);
        }
        if (default_slot)
          default_slot.d(detaching);
        ctx[7](null);
        if (if_block)
          if_block.d(detaching);
        mounted = false;
        dispose();
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    let $showModal;
    let $selectedPost;
    let $needLogin;
    component_subscribe($$self, showModal, ($$value) => $$invalidate(1, $showModal = $$value));
    component_subscribe($$self, selectedPost, ($$value) => $$invalidate(8, $selectedPost = $$value));
    component_subscribe($$self, needLogin, ($$value) => $$invalidate(2, $needLogin = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    let dialog;
    const onCloseBtnClick = () => {
      set_store_value(showModal, $showModal = false, $showModal);
    };
    const onBackdropClick = () => {
      set_store_value(showModal, $showModal = false, $showModal);
    };
    function dialog_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        dialog = $$value;
        $$invalidate(0, dialog);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("$$scope" in $$props2)
        $$invalidate(5, $$scope = $$props2.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*dialog, $showModal*/
      3) {
        if (dialog) {
          if ($showModal) {
            document.body.style.overflow = "hidden";
            dialog.show();
          } else {
            document.body.style.overflow = "";
            dialog.close();
            set_store_value(selectedPost, $selectedPost = null, $selectedPost);
          }
        }
      }
      if ($$self.$$.dirty & /*dialog, $showModal*/
      3)
        ;
    };
    return [
      dialog,
      $showModal,
      $needLogin,
      onCloseBtnClick,
      onBackdropClick,
      $$scope,
      slots,
      dialog_1_binding
    ];
  }
  class ModalDialog extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
    }
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[10] = list[i];
    return child_ctx;
  }
  function get_each_context_1$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[13] = list[i];
    return child_ctx;
  }
  function get_each_context_2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[16] = list[i];
    return child_ctx;
  }
  function get_each_context_3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[10] = list[i];
    return child_ctx;
  }
  function create_each_block_3(key_1, ctx) {
    let button;
    let t0_value = (
      /*smiles*/
      ctx[10].type + ""
    );
    let t0;
    let t1;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[5](
          /*smiles*/
          ctx[10]
        )
      );
    }
    return {
      key: key_1,
      first: null,
      c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", "smiles-type-btn svelte-5twxn6");
        toggle_class(
          button,
          "active",
          /*activeTypeId*/
          ctx[0] === /*smiles*/
          ctx[10].typeid
        );
        this.first = button;
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*$smilesTable*/
        4 && t0_value !== (t0_value = /*smiles*/
        ctx[10].type + ""))
          set_data(t0, t0_value);
        if (dirty & /*activeTypeId, $smilesTable*/
        5) {
          toggle_class(
            button,
            "active",
            /*activeTypeId*/
            ctx[0] === /*smiles*/
            ctx[10].typeid
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block$4(ctx) {
    let table;
    let t;
    let each_value_1 = ensure_array_like(
      /*smiles*/
      ctx[10].list
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    }
    return {
      c() {
        table = element("table");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = space();
      },
      m(target, anchor) {
        insert(target, table, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(table, null);
          }
        }
        append(table, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*$smilesTable, onSmileyClick*/
        12) {
          each_value_1 = ensure_array_like(
            /*smiles*/
            ctx2[10].list
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1$1(ctx2, each_value_1, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block_1$1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(table, t);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value_1.length;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(table);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_each_block_2(key_1, ctx) {
    let td;
    let img;
    let img_src_value;
    let img_alt_value;
    let mounted;
    let dispose;
    function click_handler_1() {
      return (
        /*click_handler_1*/
        ctx[6](
          /*smiley*/
          ctx[16]
        )
      );
    }
    return {
      key: key_1,
      first: null,
      c() {
        td = element("td");
        img = element("img");
        if (!src_url_equal(img.src, img_src_value = /*smiley*/
        ctx[16].url))
          attr(img, "src", img_src_value);
        attr(img, "alt", img_alt_value = /*smiley*/
        ctx[16].code);
        attr(img, "class", "svelte-5twxn6");
        attr(td, "class", "svelte-5twxn6");
        this.first = td;
      },
      m(target, anchor) {
        insert(target, td, anchor);
        append(td, img);
        if (!mounted) {
          dispose = listen(td, "click", click_handler_1);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*$smilesTable*/
        4 && !src_url_equal(img.src, img_src_value = /*smiley*/
        ctx[16].url)) {
          attr(img, "src", img_src_value);
        }
        if (dirty & /*$smilesTable*/
        4 && img_alt_value !== (img_alt_value = /*smiley*/
        ctx[16].code)) {
          attr(img, "alt", img_alt_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(td);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_each_block_1$1(ctx) {
    let tr;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_value_2 = ensure_array_like(
      /*smilesRow*/
      ctx[13]
    );
    const get_key = (ctx2) => (
      /*smiley*/
      ctx2[16].code
    );
    for (let i = 0; i < each_value_2.length; i += 1) {
      let child_ctx = get_each_context_2(ctx, each_value_2, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    }
    return {
      c() {
        tr = element("tr");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
      },
      m(target, anchor) {
        insert(target, tr, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(tr, null);
          }
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*onSmileyClick, $smilesTable*/
        12) {
          each_value_2 = ensure_array_like(
            /*smilesRow*/
            ctx2[13]
          );
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_2, each_1_lookup, tr, destroy_block, create_each_block_2, null, get_each_context_2);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(tr);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      }
    };
  }
  function create_each_block$2(key_1, ctx) {
    let first;
    let if_block_anchor;
    let if_block = (
      /*activeTypeId*/
      ctx[0] === /*smiles*/
      ctx[10].typeid && create_if_block$4(ctx)
    );
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (
          /*activeTypeId*/
          ctx[0] === /*smiles*/
          ctx[10].typeid
        ) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$4(ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(first);
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_fragment$5(ctx) {
    let div2;
    let t0;
    let div0;
    let each_blocks_1 = [];
    let each0_lookup = /* @__PURE__ */ new Map();
    let t1;
    let div1;
    let each_blocks = [];
    let each1_lookup = /* @__PURE__ */ new Map();
    let each_value_3 = ensure_array_like(
      /*$smilesTable*/
      ctx[2]
    );
    const get_key = (ctx2) => (
      /*smiles*/
      ctx2[10].typeid
    );
    for (let i = 0; i < each_value_3.length; i += 1) {
      let child_ctx = get_each_context_3(ctx, each_value_3, i);
      let key = get_key(child_ctx);
      each0_lookup.set(key, each_blocks_1[i] = create_each_block_3(key, child_ctx));
    }
    let each_value = ensure_array_like(
      /*$smilesTable*/
      ctx[2]
    );
    const get_key_1 = (ctx2) => (
      /*smiles*/
      ctx2[10].typeid
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$2(ctx, each_value, i);
      let key = get_key_1(child_ctx);
      each1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    }
    return {
      c() {
        div2 = element("div");
        t0 = space();
        div0 = element("div");
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].c();
        }
        t1 = space();
        div1 = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div1, "class", "smiles-table svelte-5twxn6");
        attr(div2, "class", "smiles svelte-5twxn6");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, t0);
        append(div2, div0);
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          if (each_blocks_1[i]) {
            each_blocks_1[i].m(div0, null);
          }
        }
        append(div2, t1);
        append(div2, div1);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div1, null);
          }
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*activeTypeId, $smilesTable*/
        5) {
          each_value_3 = ensure_array_like(
            /*$smilesTable*/
            ctx2[2]
          );
          each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx2, each_value_3, each0_lookup, div0, destroy_block, create_each_block_3, null, get_each_context_3);
        }
        if (dirty & /*$smilesTable, onSmileyClick, activeTypeId*/
        13) {
          each_value = ensure_array_like(
            /*$smilesTable*/
            ctx2[2]
          );
          each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx2, each_value, each1_lookup, div1, destroy_block, create_each_block$2, null, get_each_context$2);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d();
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      }
    };
  }
  function instance$5($$self, $$props, $$invalidate) {
    let $showModal;
    let $selectedUserInfo;
    let $selectedPost;
    let $smilesTable;
    component_subscribe($$self, showModal, ($$value) => $$invalidate(7, $showModal = $$value));
    component_subscribe($$self, selectedUserInfo, ($$value) => $$invalidate(8, $selectedUserInfo = $$value));
    component_subscribe($$self, selectedPost, ($$value) => $$invalidate(9, $selectedPost = $$value));
    component_subscribe($$self, smilesTable, ($$value) => $$invalidate(2, $smilesTable = $$value));
    let activeTypeId = $smilesTable.length > 0 ? $smilesTable[0].typeid : null;
    let remark = "";
    const onSmileyClick = async (smiley) => {
      if (!$selectedPost) {
        justAlert("请先选择帖子");
        return;
      }
      const result = await (async () => {
        if (!$selectedUserInfo) {
          justAlert("请先选择账号");
          return false;
        }
        return await reactApiUpdatePostReact($selectedPost, smiley, $selectedUserInfo);
      })();
      if (result) {
        set_store_value(showModal, $showModal = false, $showModal);
        $$invalidate(1, remark = "");
      }
    };
    function input_input_handler() {
      remark = this.value;
      $$invalidate(1, remark);
    }
    const click_handler = (smiles) => {
      $$invalidate(0, activeTypeId = smiles.typeid);
    };
    const click_handler_1 = (smiley) => {
      onSmileyClick(smiley.code);
    };
    return [
      activeTypeId,
      remark,
      $smilesTable,
      onSmileyClick,
      input_input_handler,
      click_handler,
      click_handler_1
    ];
  }
  class Smiles extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
    }
  }
  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }
  function get_if_ctx(ctx) {
    const child_ctx = ctx.slice();
    const constants_0 = (
      /*userInfo*/
      child_ctx[6].auth.payload.iat + /*userInfo*/
      child_ctx[6].auth.payload.exp
    );
    child_ctx[9] = constants_0;
    return child_ctx;
  }
  function create_if_block$3(ctx) {
    let div;
    let t;
    let each_value = ensure_array_like(
      /*$userInfoList*/
      ctx[1]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    }
    let if_block = (
      /*$userInfoList*/
      ctx[1].length > 1 && create_if_block_1$4()
    );
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = space();
        if (if_block)
          if_block.c();
        attr(div, "class", "user-info svelte-12lgkya");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        append(div, t);
        if (if_block)
          if_block.m(div, null);
      },
      p(ctx2, dirty) {
        if (dirty & /*$userInfoList, onRemoveBtnClick, $selectedUID*/
        7) {
          each_value = ensure_array_like(
            /*$userInfoList*/
            ctx2[1]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, t);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (
          /*$userInfoList*/
          ctx2[1].length > 1
        ) {
          if (if_block)
            ;
          else {
            if_block = create_if_block_1$4();
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
        if (if_block)
          if_block.d();
      }
    };
  }
  function create_if_block_3$1(ctx) {
    let input;
    let input_value_value;
    let value_has_changed = false;
    let binding_group;
    let mounted;
    let dispose;
    binding_group = init_binding_group(
      /*$$binding_groups*/
      ctx[4][0]
    );
    return {
      c() {
        input = element("input");
        attr(input, "type", "radio");
        input.__value = input_value_value = /*userInfo*/
        ctx[6].uid;
        set_input_value(input, input.__value);
        binding_group.p(input);
      },
      m(target, anchor) {
        insert(target, input, anchor);
        input.checked = input.__value === /*$selectedUID*/
        ctx[0];
        if (!mounted) {
          dispose = listen(
            input,
            "change",
            /*input_change_handler*/
            ctx[3]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*$userInfoList*/
        2 && input_value_value !== (input_value_value = /*userInfo*/
        ctx2[6].uid)) {
          input.__value = input_value_value;
          set_input_value(input, input.__value);
          value_has_changed = true;
        }
        if (value_has_changed || dirty & /*$selectedUID, $userInfoList*/
        3) {
          input.checked = input.__value === /*$selectedUID*/
          ctx2[0];
        }
      },
      d(detaching) {
        if (detaching) {
          detach(input);
        }
        binding_group.r();
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_2$4(ctx) {
    let t0;
    let span;
    let t1_value = formatTimestamp(
      /*expiredAt*/
      ctx[9],
      true
    ) + "";
    let t1;
    return {
      c() {
        t0 = text("| ");
        span = element("span");
        t1 = text(t1_value);
        attr(span, "class", "svelte-12lgkya");
        toggle_class(span, "expired", currentTimestamp() > /*expiredAt*/
        ctx[9]);
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, span, anchor);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*$userInfoList*/
        2 && t1_value !== (t1_value = formatTimestamp(
          /*expiredAt*/
          ctx2[9],
          true
        ) + ""))
          set_data(t1, t1_value);
        if (dirty & /*$userInfoList*/
        2) {
          toggle_class(span, "expired", currentTimestamp() > /*expiredAt*/
          ctx2[9]);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(span);
        }
      }
    };
  }
  function create_each_block$1(ctx) {
    let div3;
    let div0;
    let t0;
    let span0;
    let t1_value = (
      /*userInfo*/
      ctx[6].username + ""
    );
    let t1;
    let t2;
    let t3_value = (
      /*userInfo*/
      ctx[6].uid + ""
    );
    let t3;
    let t4;
    let t5;
    let button;
    let t7;
    let div2;
    let code;
    let t8_value = (
      /*userInfo*/
      ctx[6].auth.token.substring(0, 7) + ""
    );
    let t8;
    let t9;
    let div1;
    let span1;
    let t10_value = formatTimestamp(
      /*userInfo*/
      ctx[6].auth.payload.iat,
      true
    ) + "";
    let t10;
    let t11;
    let mounted;
    let dispose;
    let if_block0 = (
      /*$userInfoList*/
      ctx[1].length > 1 && create_if_block_3$1(ctx)
    );
    function click_handler() {
      return (
        /*click_handler*/
        ctx[5](
          /*userInfo*/
          ctx[6]
        )
      );
    }
    let if_block1 = (
      /*userInfo*/
      ctx[6].auth.payload.exp > 0 && create_if_block_2$4(get_if_ctx(ctx))
    );
    return {
      c() {
        div3 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        span0 = element("span");
        t1 = text(t1_value);
        t2 = text(" (UID: ");
        t3 = text(t3_value);
        t4 = text(")");
        t5 = space();
        button = element("button");
        button.textContent = "×";
        t7 = space();
        div2 = element("div");
        code = element("code");
        t8 = text(t8_value);
        t9 = text(" |\n          ");
        div1 = element("div");
        span1 = element("span");
        t10 = text(t10_value);
        t11 = space();
        if (if_block1)
          if_block1.c();
        attr(button, "class", "remove-user-btn svelte-12lgkya");
        attr(div0, "class", "svelte-12lgkya");
        attr(code, "class", "token svelte-12lgkya");
        attr(span1, "class", "svelte-12lgkya");
        attr(div1, "class", "date svelte-12lgkya");
        attr(div2, "class", "svelte-12lgkya");
        attr(div3, "class", "user svelte-12lgkya");
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        append(div0, span0);
        append(span0, t1);
        append(span0, t2);
        append(span0, t3);
        append(span0, t4);
        append(div0, t5);
        append(div0, button);
        append(div3, t7);
        append(div3, div2);
        append(div2, code);
        append(code, t8);
        append(div2, t9);
        append(div2, div1);
        append(div1, span1);
        append(span1, t10);
        append(div1, t11);
        if (if_block1)
          if_block1.m(div1, null);
        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (
          /*$userInfoList*/
          ctx[1].length > 1
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_3$1(ctx);
            if_block0.c();
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & /*$userInfoList*/
        2 && t1_value !== (t1_value = /*userInfo*/
        ctx[6].username + ""))
          set_data(t1, t1_value);
        if (dirty & /*$userInfoList*/
        2 && t3_value !== (t3_value = /*userInfo*/
        ctx[6].uid + ""))
          set_data(t3, t3_value);
        if (dirty & /*$userInfoList*/
        2 && t8_value !== (t8_value = /*userInfo*/
        ctx[6].auth.token.substring(0, 7) + ""))
          set_data(t8, t8_value);
        if (dirty & /*$userInfoList*/
        2 && t10_value !== (t10_value = formatTimestamp(
          /*userInfo*/
          ctx[6].auth.payload.iat,
          true
        ) + ""))
          set_data(t10, t10_value);
        if (
          /*userInfo*/
          ctx[6].auth.payload.exp > 0
        ) {
          if (if_block1) {
            if_block1.p(get_if_ctx(ctx), dirty);
          } else {
            if_block1 = create_if_block_2$4(get_if_ctx(ctx));
            if_block1.c();
            if_block1.m(div1, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_1$4(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "切换账号后建议手动刷新页面";
        attr(span, "class", "tips svelte-12lgkya");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_fragment$4(ctx) {
    let if_block_anchor;
    let if_block = create_if_block$3(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, [dirty]) {
        if_block.p(ctx2, dirty);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    let $selectedUID;
    let $userInfoList;
    component_subscribe($$self, selectedUID, ($$value) => $$invalidate(0, $selectedUID = $$value));
    component_subscribe($$self, userInfoList, ($$value) => $$invalidate(1, $userInfoList = $$value));
    const onRemoveBtnClick = (uid) => {
      userInfoDict.update((dict) => {
        const newDict = deepCopy(dict);
        delete newDict[uid];
        if (uid === $selectedUID) {
          const values = Object.values(newDict);
          set_store_value(selectedUID, $selectedUID = values.length > 0 ? values[0].uid : null, $selectedUID);
        }
        return newDict;
      });
    };
    const $$binding_groups = [[]];
    function input_change_handler() {
      $selectedUID = this.__value;
      selectedUID.set($selectedUID);
    }
    const click_handler = (userInfo) => {
      onRemoveBtnClick(userInfo.uid);
    };
    return [
      $selectedUID,
      $userInfoList,
      onRemoveBtnClick,
      input_change_handler,
      $$binding_groups,
      click_handler
    ];
  }
  class UserInfo extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
    }
  }
  function create_else_block$2(ctx) {
    let t0;
    let login;
    let t1;
    let if_block1_anchor;
    let current;
    let if_block0 = !/*$needLogin*/
    ctx[0] && create_if_block_2$3();
    login = new Login({});
    let if_block1 = !/*$needLogin*/
    ctx[0] && create_if_block_1$3();
    return {
      c() {
        if (if_block0)
          if_block0.c();
        t0 = space();
        create_component(login.$$.fragment);
        t1 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
      },
      m(target, anchor) {
        if (if_block0)
          if_block0.m(target, anchor);
        insert(target, t0, anchor);
        mount_component(login, target, anchor);
        insert(target, t1, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert(target, if_block1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (!/*$needLogin*/
        ctx2[0]) {
          if (if_block0) {
            if (dirty & /*$needLogin*/
            1) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_2$3();
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if (!/*$needLogin*/
        ctx2[0]) {
          if (if_block1) {
            if (dirty & /*$needLogin*/
            1) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_1$3();
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(login.$$.fragment, local);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(login.$$.fragment, local);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
          detach(if_block1_anchor);
        }
        if (if_block0)
          if_block0.d(detaching);
        destroy_component(login, detaching);
        if (if_block1)
          if_block1.d(detaching);
      }
    };
  }
  function create_if_block$2(ctx) {
    let smiles;
    let current;
    smiles = new Smiles({});
    return {
      c() {
        create_component(smiles.$$.fragment);
      },
      m(target, anchor) {
        mount_component(smiles, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(smiles.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(smiles.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(smiles, detaching);
      }
    };
  }
  function create_if_block_2$3(ctx) {
    let smiles;
    let current;
    smiles = new Smiles({});
    return {
      c() {
        create_component(smiles.$$.fragment);
      },
      m(target, anchor) {
        mount_component(smiles, target, anchor);
        current = true;
      },
      i(local) {
        if (current)
          return;
        transition_in(smiles.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(smiles.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(smiles, detaching);
      }
    };
  }
  function create_if_block_1$3(ctx) {
    let userinfo;
    let current;
    userinfo = new UserInfo({});
    return {
      c() {
        create_component(userinfo.$$.fragment);
      },
      m(target, anchor) {
        mount_component(userinfo, target, anchor);
        current = true;
      },
      i(local) {
        if (current)
          return;
        transition_in(userinfo.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(userinfo.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(userinfo, detaching);
      }
    };
  }
  function create_default_slot(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block$2, create_else_block$2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      return 1;
    }
    current_block_type_index = select_block_type();
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if_block.p(ctx2, dirty);
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
  }
  function create_fragment$3(ctx) {
    let div;
    let modaldialog;
    let current;
    modaldialog = new ModalDialog({
      props: {
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        div = element("div");
        create_component(modaldialog.$$.fragment);
        attr(div, "class", "modal svelte-81eduz");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(modaldialog, div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        const modaldialog_changes = {};
        if (dirty & /*$$scope, $needLogin*/
        3) {
          modaldialog_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modaldialog.$set(modaldialog_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(modaldialog.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modaldialog.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(modaldialog);
      }
    };
  }
  function instance$3($$self, $$props, $$invalidate) {
    let $needLogin;
    component_subscribe($$self, needLogin, ($$value) => $$invalidate(0, $needLogin = $$value));
    return [$needLogin];
  }
  class Modal extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    }
  }
  const get_addButton_slot_changes = (dirty) => ({});
  const get_addButton_slot_context = (ctx) => ({});
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }
  const get_actionButton_slot_changes_1 = (dirty) => ({ react: dirty & /*reacts*/
  1 });
  const get_actionButton_slot_context_1 = (ctx) => ({ react: (
    /*react*/
    ctx[6]
  ) });
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }
  const get_actionButton_slot_changes = (dirty) => ({ react: dirty & /*reactsOffline*/
  2 });
  const get_actionButton_slot_context = (ctx) => ({ react: (
    /*react*/
    ctx[6]
  ) });
  function create_else_block$1(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    let each_value_1 = ensure_array_like(
      /*reacts*/
      ctx[0]
    );
    const get_key = (ctx2) => (
      /*react*/
      ctx2[6].smiley
    );
    for (let i = 0; i < each_value_1.length; i += 1) {
      let child_ctx = get_each_context_1(ctx, each_value_1, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*$$scope, reacts, $smileyDict*/
        25) {
          each_value_1 = ensure_array_like(
            /*reacts*/
            ctx2[0]
          );
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value_1.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
      }
    };
  }
  function create_if_block$1(ctx) {
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like(
      /*reactsOffline*/
      ctx[1]
    );
    const get_key = (ctx2) => (
      /*react*/
      ctx2[6].smiley
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }
    return {
      c() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      m(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert(target, each_1_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*$$scope, reactsOffline, fromUser, $smileyDict*/
        30) {
          each_value = ensure_array_like(
            /*reactsOffline*/
            ctx2[1]
          );
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(each_1_anchor);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
      }
    };
  }
  function create_each_block_1(key_1, ctx) {
    let div;
    let img;
    let img_src_value;
    let img_alt_value;
    let t0;
    let span;
    let t1;
    let t2_value = (
      /*react*/
      ctx[6].count + ""
    );
    let t2;
    let t3;
    let t4;
    let current;
    const actionButton_slot_template = (
      /*#slots*/
      ctx[5].actionButton
    );
    const actionButton_slot = create_slot(
      actionButton_slot_template,
      ctx,
      /*$$scope*/
      ctx[4],
      get_actionButton_slot_context_1
    );
    return {
      key: key_1,
      first: null,
      c() {
        div = element("div");
        img = element("img");
        t0 = space();
        span = element("span");
        t1 = text("+");
        t2 = text(t2_value);
        t3 = space();
        if (actionButton_slot)
          actionButton_slot.c();
        t4 = space();
        if (!src_url_equal(img.src, img_src_value = /*$smileyDict*/
        ctx[3][
          /*react*/
          ctx[6].smiley
        ]))
          attr(img, "src", img_src_value);
        attr(img, "alt", img_alt_value = /*react*/
        ctx[6].smiley);
        attr(img, "class", "svelte-1kvsz55");
        attr(div, "class", "react svelte-1kvsz55");
        this.first = div;
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
        append(div, t0);
        append(div, span);
        append(span, t1);
        append(span, t2);
        append(div, t3);
        if (actionButton_slot) {
          actionButton_slot.m(div, null);
        }
        append(div, t4);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (!current || dirty & /*$smileyDict, reacts*/
        9 && !src_url_equal(img.src, img_src_value = /*$smileyDict*/
        ctx[3][
          /*react*/
          ctx[6].smiley
        ])) {
          attr(img, "src", img_src_value);
        }
        if (!current || dirty & /*reacts*/
        1 && img_alt_value !== (img_alt_value = /*react*/
        ctx[6].smiley)) {
          attr(img, "alt", img_alt_value);
        }
        if ((!current || dirty & /*reacts*/
        1) && t2_value !== (t2_value = /*react*/
        ctx[6].count + ""))
          set_data(t2, t2_value);
        if (actionButton_slot) {
          if (actionButton_slot.p && (!current || dirty & /*$$scope, reacts*/
          17)) {
            update_slot_base(
              actionButton_slot,
              actionButton_slot_template,
              ctx,
              /*$$scope*/
              ctx[4],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx[4]
              ) : get_slot_changes(
                actionButton_slot_template,
                /*$$scope*/
                ctx[4],
                dirty,
                get_actionButton_slot_changes_1
              ),
              get_actionButton_slot_context_1
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(actionButton_slot, local);
        current = true;
      },
      o(local) {
        transition_out(actionButton_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (actionButton_slot)
          actionButton_slot.d(detaching);
      }
    };
  }
  function create_if_block_2$2(ctx) {
    let span;
    let t_value = (
      /*react*/
      ctx[6].remark + ""
    );
    let t;
    return {
      c() {
        span = element("span");
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*reactsOffline*/
        2 && t_value !== (t_value = /*react*/
        ctx2[6].remark + ""))
          set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let a;
    let t;
    let a_href_value;
    return {
      c() {
        a = element("a");
        t = text("#");
        attr(a, "href", a_href_value = `forum.php?mod=redirect&goto=findpost&pid=${/*react*/
      ctx[6].pid}`);
        attr(a, "target", "_blank");
      },
      m(target, anchor) {
        insert(target, a, anchor);
        append(a, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*reactsOffline*/
        2 && a_href_value !== (a_href_value = `forum.php?mod=redirect&goto=findpost&pid=${/*react*/
      ctx2[6].pid}`)) {
          attr(a, "href", a_href_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(a);
        }
      }
    };
  }
  function create_each_block(key_1, ctx) {
    let div;
    let img;
    let img_src_value;
    let img_alt_value;
    let t0;
    let t1;
    let t2;
    let t3;
    let current;
    let if_block0 = (
      /*react*/
      ctx[6].remark && create_if_block_2$2(ctx)
    );
    let if_block1 = (
      /*fromUser*/
      ctx[2] && create_if_block_1$2(ctx)
    );
    const actionButton_slot_template = (
      /*#slots*/
      ctx[5].actionButton
    );
    const actionButton_slot = create_slot(
      actionButton_slot_template,
      ctx,
      /*$$scope*/
      ctx[4],
      get_actionButton_slot_context
    );
    return {
      key: key_1,
      first: null,
      c() {
        div = element("div");
        img = element("img");
        t0 = space();
        if (if_block0)
          if_block0.c();
        t1 = space();
        if (if_block1)
          if_block1.c();
        t2 = space();
        if (actionButton_slot)
          actionButton_slot.c();
        t3 = space();
        if (!src_url_equal(img.src, img_src_value = /*$smileyDict*/
        ctx[3][
          /*react*/
          ctx[6].smiley
        ]))
          attr(img, "src", img_src_value);
        attr(img, "alt", img_alt_value = /*react*/
        ctx[6].smiley);
        attr(img, "class", "svelte-1kvsz55");
        attr(div, "class", "react svelte-1kvsz55");
        this.first = div;
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
        append(div, t0);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t1);
        if (if_block1)
          if_block1.m(div, null);
        append(div, t2);
        if (actionButton_slot) {
          actionButton_slot.m(div, null);
        }
        append(div, t3);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (!current || dirty & /*$smileyDict, reactsOffline*/
        10 && !src_url_equal(img.src, img_src_value = /*$smileyDict*/
        ctx[3][
          /*react*/
          ctx[6].smiley
        ])) {
          attr(img, "src", img_src_value);
        }
        if (!current || dirty & /*reactsOffline*/
        2 && img_alt_value !== (img_alt_value = /*react*/
        ctx[6].smiley)) {
          attr(img, "alt", img_alt_value);
        }
        if (
          /*react*/
          ctx[6].remark
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_2$2(ctx);
            if_block0.c();
            if_block0.m(div, t1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*fromUser*/
          ctx[2]
        ) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_1$2(ctx);
            if_block1.c();
            if_block1.m(div, t2);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (actionButton_slot) {
          if (actionButton_slot.p && (!current || dirty & /*$$scope, reactsOffline*/
          18)) {
            update_slot_base(
              actionButton_slot,
              actionButton_slot_template,
              ctx,
              /*$$scope*/
              ctx[4],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx[4]
              ) : get_slot_changes(
                actionButton_slot_template,
                /*$$scope*/
                ctx[4],
                dirty,
                get_actionButton_slot_changes
              ),
              get_actionButton_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(actionButton_slot, local);
        current = true;
      },
      o(local) {
        transition_out(actionButton_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (actionButton_slot)
          actionButton_slot.d(detaching);
      }
    };
  }
  function create_fragment$2(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let t;
    let current;
    const if_block_creators = [create_if_block$1, create_else_block$1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      return 1;
    }
    current_block_type_index = select_block_type();
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const addButton_slot_template = (
      /*#slots*/
      ctx[5].addButton
    );
    const addButton_slot = create_slot(
      addButton_slot_template,
      ctx,
      /*$$scope*/
      ctx[4],
      get_addButton_slot_context
    );
    return {
      c() {
        div = element("div");
        if_block.c();
        t = space();
        if (addButton_slot)
          addButton_slot.c();
        attr(div, "class", "reacts svelte-1kvsz55");
        toggle_class(div, "offline", false);
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        append(div, t);
        if (addButton_slot) {
          addButton_slot.m(div, null);
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if_block.p(ctx2, dirty);
        if (addButton_slot) {
          if (addButton_slot.p && (!current || dirty & /*$$scope*/
          16)) {
            update_slot_base(
              addButton_slot,
              addButton_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[4],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[4]
              ) : get_slot_changes(
                addButton_slot_template,
                /*$$scope*/
                ctx2[4],
                dirty,
                get_addButton_slot_changes
              ),
              get_addButton_slot_context
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        transition_in(addButton_slot, local);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        transition_out(addButton_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if_blocks[current_block_type_index].d();
        if (addButton_slot)
          addButton_slot.d(detaching);
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let $smileyDict;
    component_subscribe($$self, smileyDict, ($$value) => $$invalidate(3, $smileyDict = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    let { reacts } = $$props;
    let { reactsOffline } = $$props;
    let { fromUser = false } = $$props;
    $$self.$$set = ($$props2) => {
      if ("reacts" in $$props2)
        $$invalidate(0, reacts = $$props2.reacts);
      if ("reactsOffline" in $$props2)
        $$invalidate(1, reactsOffline = $$props2.reactsOffline);
      if ("fromUser" in $$props2)
        $$invalidate(2, fromUser = $$props2.fromUser);
      if ("$$scope" in $$props2)
        $$invalidate(4, $$scope = $$props2.$$scope);
    };
    return [reacts, reactsOffline, fromUser, $smileyDict, $$scope, slots];
  }
  class Reacts extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$2, safe_not_equal, { reacts: 0, reactsOffline: 1, fromUser: 2 });
    }
  }
  function create_if_block_1$1(ctx) {
    let if_block_anchor;
    function select_block_type_1(ctx2, dirty) {
      if (
        /*react*/
        ctx2[14].reacted
      )
        return create_if_block_2$1;
      return create_else_block;
    }
    let current_block_type = select_block_type_1(ctx);
    let if_block = current_block_type(ctx);
    return {
      c() {
        if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if_block.d(detaching);
      }
    };
  }
  function create_else_block(ctx) {
    let button;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[11](
          /*react*/
          ctx[14]
        )
      );
    }
    return {
      c() {
        button = element("button");
        button.textContent = "+";
        attr(button, "class", "action-btn plus-react-btn svelte-1hkey2g");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let button;
    let mounted;
    let dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "×";
        attr(button, "class", "action-btn remove-react-btn svelte-1hkey2g");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*onRemoveBtnClick*/
            ctx[5]
          );
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_actionButton_slot$1(ctx) {
    let if_block_anchor;
    function select_block_type(ctx2, dirty) {
      if (
        /*$selectedUserInfo*/
        ctx2[2]
      )
        return create_if_block_1$1;
    }
    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type && current_block_type(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if (if_block)
            if_block.d(1);
          if_block = current_block_type && current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) {
          if_block.d(detaching);
        }
      }
    };
  }
  function create_addButton_slot(ctx) {
    let div;
    let button;
    let img;
    let img_src_value;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        button = element("button");
        img = element("img");
        attr(img, "alt", "+1");
        if (!src_url_equal(img.src, img_src_value = /*$smileyDict*/
        ctx[3]["[f:253]"]))
          attr(img, "src", img_src_value);
        attr(button, "class", "add-react-btn svelte-1hkey2g");
        attr(div, "class", "add-react svelte-1hkey2g");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, button);
        append(button, img);
        if (!mounted) {
          dispose = listen(
            button,
            "click",
            /*onAddBtnClick*/
            ctx[4]
          );
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*$smileyDict*/
        8 && !src_url_equal(img.src, img_src_value = /*$smileyDict*/
        ctx2[3]["[f:253]"])) {
          attr(img, "src", img_src_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment$1(ctx) {
    let div;
    let reacts_1;
    let current;
    reacts_1 = new Reacts({
      props: {
        reacts: (
          /*reacts*/
          ctx[0]
        ),
        reactsOffline: (
          /*reactsOffline*/
          ctx[1]
        ),
        $$slots: {
          addButton: [create_addButton_slot],
          actionButton: [
            create_actionButton_slot$1,
            ({ react }) => ({ 14: react }),
            ({ react }) => react ? 16384 : 0
          ]
        },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        div = element("div");
        create_component(reacts_1.$$.fragment);
        attr(div, "class", "post-reacts svelte-1hkey2g");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(reacts_1, div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        const reacts_1_changes = {};
        if (dirty & /*reacts*/
        1)
          reacts_1_changes.reacts = /*reacts*/
          ctx2[0];
        if (dirty & /*reactsOffline*/
        2)
          reacts_1_changes.reactsOffline = /*reactsOffline*/
          ctx2[1];
        if (dirty & /*$$scope, $smileyDict, react, $selectedUserInfo*/
        49164) {
          reacts_1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        reacts_1.$set(reacts_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(reacts_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(reacts_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(reacts_1);
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let $selectedUserInfo;
    let $selectedPost;
    let $showModal;
    let $reactsOfflineDict;
    let $reactsDict;
    let $smileyDict;
    component_subscribe($$self, selectedUserInfo, ($$value) => $$invalidate(2, $selectedUserInfo = $$value));
    component_subscribe($$self, selectedPost, ($$value) => $$invalidate(12, $selectedPost = $$value));
    component_subscribe($$self, showModal, ($$value) => $$invalidate(13, $showModal = $$value));
    component_subscribe($$self, reactsOfflineDict, ($$value) => $$invalidate(9, $reactsOfflineDict = $$value));
    component_subscribe($$self, reactsDict, ($$value) => $$invalidate(10, $reactsDict = $$value));
    component_subscribe($$self, smileyDict, ($$value) => $$invalidate(3, $smileyDict = $$value));
    let { pid } = $$props;
    let { uid2 } = $$props;
    let reacts = [];
    let reactsOffline = [];
    const onAddBtnClick = () => {
      set_store_value(showModal, $showModal = true, $showModal);
      set_store_value(selectedPost, $selectedPost = { pid, uid2 }, $selectedPost);
    };
    const onRemoveBtnClick = async () => {
      if (!$selectedUserInfo) {
        justAlert("请先选择账号");
        return;
      }
      await reactApiUpdatePostReact({ pid, uid2 }, null, $selectedUserInfo);
    };
    const onPlusBtnClick = async (smiley) => {
      if (!$selectedUserInfo) {
        justAlert("请先选择账号");
        return;
      }
      await reactApiUpdatePostReact({ pid, uid2 }, smiley, $selectedUserInfo);
    };
    const click_handler = (react) => {
      onPlusBtnClick(react.smiley);
    };
    $$self.$$set = ($$props2) => {
      if ("pid" in $$props2)
        $$invalidate(7, pid = $$props2.pid);
      if ("uid2" in $$props2)
        $$invalidate(8, uid2 = $$props2.uid2);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$reactsDict, pid*/
      1152) {
        {
          const postReacts = $reactsDict[`pid${pid}`];
          if (!postReacts) {
            $$invalidate(0, reacts = []);
          } else {
            $$invalidate(0, reacts = sortReacts(postReacts));
          }
        }
      }
      if ($$self.$$.dirty & /*$reactsOfflineDict, pid*/
      640)
        ;
    };
    return [
      reacts,
      reactsOffline,
      $selectedUserInfo,
      $smileyDict,
      onAddBtnClick,
      onRemoveBtnClick,
      onPlusBtnClick,
      pid,
      uid2,
      $reactsOfflineDict,
      $reactsDict,
      click_handler
    ];
  }
  class PostReacts extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, { pid: 7, uid2: 8 });
    }
  }
  function create_if_block_2(ctx) {
    let div;
    let t;
    let current;
    let if_block0 = (
      /*receivedReacts*/
      ctx[1].length > 0 && create_if_block_4(ctx)
    );
    let if_block1 = (
      /*sentReacts*/
      ctx[0].length > 0 && create_if_block_3(ctx)
    );
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t = space();
        if (if_block1)
          if_block1.c();
        attr(div, "class", "user-reacts svelte-1mwqdh0");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block0)
          if_block0.m(div, null);
        append(div, t);
        if (if_block1)
          if_block1.m(div, null);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*receivedReacts*/
          ctx2[1].length > 0
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty & /*receivedReacts*/
            2) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_4(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div, t);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if (
          /*sentReacts*/
          ctx2[0].length > 0
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & /*sentReacts*/
            1) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_3(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function create_if_block(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*receivedReactsOffline*/
      ctx[2].length > 0 && create_if_block_1(ctx)
    );
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*receivedReactsOffline*/
          ctx2[2].length > 0
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*receivedReactsOffline*/
            4) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_1(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
  }
  function create_if_block_4(ctx) {
    let h2;
    let t1;
    let reacts;
    let current;
    reacts = new Reacts({
      props: {
        reacts: (
          /*receivedReacts*/
          ctx[1]
        ),
        reactsOffline: []
      }
    });
    return {
      c() {
        h2 = element("h2");
        h2.textContent = "收到回应";
        t1 = space();
        create_component(reacts.$$.fragment);
        attr(h2, "class", "mbn svelte-1mwqdh0");
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        insert(target, t1, anchor);
        mount_component(reacts, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const reacts_changes = {};
        if (dirty & /*receivedReacts*/
        2)
          reacts_changes.reacts = /*receivedReacts*/
          ctx2[1];
        reacts.$set(reacts_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(reacts.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(reacts.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(h2);
          detach(t1);
        }
        destroy_component(reacts, detaching);
      }
    };
  }
  function create_if_block_3(ctx) {
    let h2;
    let t1;
    let reacts;
    let current;
    reacts = new Reacts({
      props: {
        reacts: (
          /*sentReacts*/
          ctx[0]
        ),
        reactsOffline: []
      }
    });
    return {
      c() {
        h2 = element("h2");
        h2.textContent = "送出回应";
        t1 = space();
        create_component(reacts.$$.fragment);
        attr(h2, "class", "mbn svelte-1mwqdh0");
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        insert(target, t1, anchor);
        mount_component(reacts, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const reacts_changes = {};
        if (dirty & /*sentReacts*/
        1)
          reacts_changes.reacts = /*sentReacts*/
          ctx2[0];
        reacts.$set(reacts_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(reacts.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(reacts.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(h2);
          detach(t1);
        }
        destroy_component(reacts, detaching);
      }
    };
  }
  function create_if_block_1(ctx) {
    let div;
    let h2;
    let t1;
    let reacts;
    let current;
    reacts = new Reacts({
      props: {
        reacts: (
          /*receivedReacts*/
          ctx[1]
        ),
        reactsOffline: (
          /*receivedReactsOffline*/
          ctx[2]
        ),
        fromUser: true,
        $$slots: {
          actionButton: [
            create_actionButton_slot,
            ({ react }) => ({ 7: react }),
            ({ react }) => react ? 128 : 0
          ]
        },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        div = element("div");
        h2 = element("h2");
        h2.textContent = "收到回应及标记";
        t1 = space();
        create_component(reacts.$$.fragment);
        attr(h2, "class", "mbn svelte-1mwqdh0");
        attr(div, "class", "user-reacts svelte-1mwqdh0");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, h2);
        append(div, t1);
        mount_component(reacts, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        const reacts_changes = {};
        if (dirty & /*receivedReacts*/
        2)
          reacts_changes.reacts = /*receivedReacts*/
          ctx2[1];
        if (dirty & /*receivedReactsOffline*/
        4)
          reacts_changes.reactsOffline = /*receivedReactsOffline*/
          ctx2[2];
        if (dirty & /*$$scope, react*/
        384) {
          reacts_changes.$$scope = { dirty, ctx: ctx2 };
        }
        reacts.$set(reacts_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(reacts.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(reacts.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(reacts);
      }
    };
  }
  function create_actionButton_slot(ctx) {
    let button;
    let mounted;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[6](
          /*react*/
          ctx[7]
        )
      );
    }
    return {
      c() {
        button = element("button");
        button.textContent = "×";
        attr(button, "class", "action-btn remove-react-btn svelte-1mwqdh0");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block, create_if_block_2];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*receivedReacts*/
        ctx2[1].length > 0 || /*sentReacts*/
        ctx2[0].length > 0
      )
        return 1;
      return -1;
    }
    if (~(current_block_type_index = select_block_type(ctx))) {
      if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    }
    return {
      c() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].m(target, anchor);
        }
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if (~current_block_type_index) {
            if_blocks[current_block_type_index].p(ctx2, dirty);
          }
        } else {
          if (if_block) {
            group_outros();
            transition_out(if_blocks[previous_block_index], 1, 1, () => {
              if_blocks[previous_block_index] = null;
            });
            check_outros();
          }
          if (~current_block_type_index) {
            if_block = if_blocks[current_block_type_index];
            if (!if_block) {
              if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
              if_block.c();
            } else {
              if_block.p(ctx2, dirty);
            }
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          } else {
            if_block = null;
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].d(detaching);
        }
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let $reactsOfflineDict;
    let $reactsDict;
    component_subscribe($$self, reactsOfflineDict, ($$value) => $$invalidate(4, $reactsOfflineDict = $$value));
    component_subscribe($$self, reactsDict, ($$value) => $$invalidate(5, $reactsDict = $$value));
    let sentReacts = [];
    let receivedReacts = [];
    let receivedReactsOffline = [];
    const onRemoveBtnClick = (react) => {
      {
        return;
      }
    };
    const click_handler = (react) => {
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$reactsDict*/
      32) {
        {
          const userSentReacts = $reactsDict.sent;
          if (!userSentReacts) {
            $$invalidate(0, sentReacts = []);
          } else {
            $$invalidate(0, sentReacts = sortReacts(userSentReacts));
          }
        }
      }
      if ($$self.$$.dirty & /*$reactsDict*/
      32) {
        {
          const userReceivedReacts = $reactsDict.received;
          if (!userReceivedReacts) {
            $$invalidate(1, receivedReacts = []);
          } else {
            $$invalidate(1, receivedReacts = sortReacts(userReceivedReacts));
          }
        }
      }
      if ($$self.$$.dirty & /*$reactsOfflineDict*/
      16)
        ;
    };
    return [
      sentReacts,
      receivedReacts,
      receivedReactsOffline,
      onRemoveBtnClick,
      $reactsOfflineDict,
      $reactsDict,
      click_handler
    ];
  }
  class UserReacts extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  }
  async function postMode() {
    var _a;
    const postDataList = [];
    const postElements = document.querySelectorAll("table[id^=pid]");
    postElements.forEach((postElement) => {
      const pid = extractId(postElement.id, /^pid(\d+)$/);
      if (pid === null) {
        return;
      }
      const userLinkElement = postElement.querySelector("a[href^=space-uid-]");
      if (!userLinkElement) {
        return;
      }
      const uid2 = extractId(userLinkElement.getAttribute("href") || "", /^space-uid-(\d+)\.html$/);
      if (uid2 === null) {
        return;
      }
      const positionElement = postElement.querySelector(`tr[id=_postposition${pid}]`);
      if (!positionElement) {
        return;
      }
      const avatarElement = postElement.querySelector('td.pls[rowspan="2"]');
      if (!avatarElement) {
        return;
      }
      avatarElement.setAttribute("rowspan", "3");
      const containerElement = document.createElement("tr");
      containerElement.classList.add("s1-reaction");
      containerElement.classList.add("s1-reaction-post");
      containerElement.setAttribute("data-id", String(pid));
      const mountElement = document.createElement("td");
      mountElement.classList.add("plc");
      mountElement.classList.add("plm");
      containerElement.append(mountElement);
      positionElement.before(containerElement);
      postDataList.push({
        pid,
        uid2,
        target: mountElement
      });
    });
    if (postDataList.length === 0) {
      return;
    }
    postDataList.forEach((data) => {
      new PostReacts({
        target: data.target,
        props: {
          pid: data.pid,
          uid2: data.uid2
        }
      });
    });
    new Modal({
      target: document.body
    });
    const response = await API.reactApi.postQueryPostReacts({
      postQueryPostReactsRequest: {
        pids: postDataList.map((item) => item.pid),
        auth: (_a = get_store_value(selectedUserInfo)) == null ? void 0 : _a.auth
      }
    }).catch(responseErrorHandle);
    if (!response.success) {
      justAlert("获取帖子回应失败");
      if (response.message) {
        justLogError(response.message);
      }
      return;
    }
    const dict = {};
    response.result.forEach((item) => {
      dict[`pid${item.pid}`] = item.reacts.map((react) => {
        return {
          smiley: react.smiley,
          count: react.count,
          reacted: react.reacted > 0
        };
      });
    });
    reactsDict.set(dict);
  }
  async function userMode() {
    const uid2 = extractId(location.href, /\/space-uid-(\d+)\.html$/);
    if (uid2 === null) {
      return;
    }
    const positionElement = document.querySelector("div[id=psts]");
    if (!positionElement) {
      return;
    }
    const mountElement = document.createElement("div");
    mountElement.classList.add("s1-reaction");
    mountElement.classList.add("s1-reaction-user");
    mountElement.setAttribute("data-id", String(uid2));
    positionElement.parentElement.append(mountElement);
    new UserReacts({
      target: mountElement
    });
    const response = await API.reactApi.postQueryUserReacts({
      postQueryUserReactsRequest: {
        uid2
      }
    }).catch(responseErrorHandle);
    if (!response.success) {
      justAlert("获取用户回应失败");
      if (response.message) {
        justLogError(response.message);
      }
      return;
    }
    reactsDict.set({
      sent: response.result.sent,
      received: response.result.received
    });
  }
  (async () => {
    if (!await checkSmiles()) {
      return;
    }
    if (location.pathname.startsWith("/2b/space-uid-")) {
      await userMode();
    } else {
      await postMode();
    }
  })();

})();