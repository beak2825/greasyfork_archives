// ==UserScript==
// @name         袋鼠快跳
// @namespace    https://chensuiyi.me
// @version      1.1.4
// @author       陈随易
// @description  浏览器快捷跳转
// @license      MIT
// @icon         https://static.yicode.tech/logo/kuaitiao2.png
// @homepage     https://chensuiyi.me
// @homepageURL  https://chensuiyi.me
// @source       https://github.com/chenbimo/kangaroo-jump
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/499217/%E8%A2%8B%E9%BC%A0%E5%BF%AB%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/499217/%E8%A2%8B%E9%BC%A0%E5%BF%AB%E8%B7%B3.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const i=document.createElement("style");i.textContent=o,document.head.append(i)})(" :root{font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}.kuaitiao{position:fixed;top:50vh;left:50vw;height:600px;width:1000px;margin-top:-300px;margin-left:-500px;z-index:999999999;display:none;background-color:#333;border:2px solid #999;border-radius:10px;font-size:14px}.kuaitiao a{text-decoration:none!important;color:inherit!important}.kuaitiao a:hover{text-decoration:none!important}.kuaitiao *{box-sizing:border-box;padding:0;border:0;margin:0;outline:0}.kuaitiao.active{display:block}.kuaitiao .logo{position:absolute;top:-30px;left:50%;margin-left:-30px;height:60px;width:60px;border:2px solid #999;background-repeat:no-repeat;background-position:center center;background-size:cover;border-radius:20px}.kuaitiao .panel{position:absolute;left:15px;right:0;bottom:41px;top:40px}.kuaitiao .panel .group .grid{display:flex;flex-wrap:wrap}.kuaitiao .panel .group .box{padding-right:15px;flex:0 0 16.6666666667%;margin-bottom:15px}.kuaitiao .panel .group .box .inner{position:relative;height:40px;background-color:#555;border-radius:20px;padding:0 10px;transition:all .2s;display:flex;justify-content:space-between;align-items:center}.kuaitiao .panel .group .box .inner.move .pointer .shou{fill:#e33}.kuaitiao .panel .group .box .inner .pointer{position:absolute;height:100%;width:14px;left:-13px;font-size:14px;display:flex;flex-direction:column;justify-content:flex-end}.kuaitiao .panel .group .box .inner .link{flex:1 1 100%;display:flex;align-items:center;color:#fff}.kuaitiao .panel .group .box .inner .close{flex:0 0 auto;font-size:18px;cursor:pointer;display:flex;align-items:center}.kuaitiao .panel .group .box .inner .close .close-icon{fill:#666;transition:all .2s}.kuaitiao .panel .group .box .inner .close:hover .close-icon{fill:#e33}.kuaitiao .panel .group .box .inner:hover{box-shadow:0 2px #888}.kuaitiao .panel .group .box .inner:hover .dot{background-color:#3fed2d}.kuaitiao .panel .group .box .inner .dot{flex:0 0 12px;height:12px;background-color:#999;margin-right:6px;border-radius:6px;transition:all .2s}.kuaitiao .panel .group .box .inner .text{flex:1 1 100%;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#eee!important;text-decoration:none!important}.kuaitiao .foot{position:absolute;bottom:0;left:15px;right:15px;height:26px;border-top:1px solid #444;display:flex;justify-content:space-between;align-items:center}.kuaitiao .foot .left{flex:0 0 45%;font-size:12px;color:#666;cursor:pointer;transition:all .2s}.kuaitiao .foot .left:hover{color:#999}.kuaitiao .foot .right{flex:0 0 45%;display:flex;justify-content:flex-end;font-size:16px}.kuaitiao .foot .right .icon{cursor:pointer}.kuaitiao .foot .right .icon svg{transition:all .2s;fill:#666}.kuaitiao .foot .right .icon:hover svg{fill:#999}.kuaitiao .foot .center{flex:0 0 10%;display:flex;justify-content:center;align-items:center;font-size:24px}.kuaitiao .foot .center .icon{cursor:pointer}.kuaitiao .foot .center .icon .plus{fill:#ccc;transition:all .2s}.kuaitiao .foot .center .icon:hover .plus{fill:#fff}.kuaitiao .dialog.add{position:absolute;bottom:35px;width:200px;height:52px;border:2px solid #999;background-color:#fff;left:50%;margin-left:-100px;border-radius:6px;display:none}.kuaitiao .dialog.add.active{display:block}.kuaitiao .dialog.add .info{position:absolute;left:0;top:0;bottom:0;width:160px}.kuaitiao .dialog.add .info .input:first-of-type{border-bottom:1px solid #ccc}.kuaitiao .dialog.add .info input{height:24px;background-color:transparent;padding:0 6px}.kuaitiao .dialog.add .info input::placeholder{font-size:12px}.kuaitiao .dialog.add .send{position:absolute;right:0;top:0;bottom:0;width:40px;display:flex;justify-content:center;align-items:center;font-size:20px;cursor:pointer}.kuaitiao .dialog.add .send .gou{fill:#666;transition:all .2s}.kuaitiao .dialog.add .send:hover .gou{fill:#00b42a} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  function noop() {
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
  function safe_not_equal(a2, b) {
    return a2 != a2 ? b == b : a2 !== b || a2 && typeof a2 === "object" || typeof a2 === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
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
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data) return;
    text2.data = /** @type {string} */
    data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    {
      node.style.setProperty(key, value, "");
    }
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
      } catch (e2) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e2;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length) binding_callbacks.pop()();
      for (let i2 = 0; i2 < render_callbacks.length; i2 += 1) {
        const callback = render_callbacks[i2];
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
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
    let o2 = old_blocks.length;
    let n2 = list.length;
    let i2 = o2;
    const old_indexes = {};
    while (i2--) old_indexes[old_blocks[i2].key] = i2;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i2 = n2;
    while (i2--) {
      const child_ctx = get_context(ctx, list, i2);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block2(key, child_ctx);
        block.c();
      } else {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, new_blocks[i2] = block);
      if (key in old_indexes) deltas.set(key, Math.abs(i2 - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n2--;
    }
    while (o2 && n2) {
      const new_block = new_blocks[n2 - 1];
      const old_block = old_blocks[o2 - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o2--;
        n2--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o2--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o2--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
        will_move.add(old_key);
        o2--;
      }
    }
    while (o2--) {
      const old_block = old_blocks[o2];
      if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
    }
    while (n2) insert2(new_blocks[n2 - 1]);
    run_all(updates);
    return new_blocks;
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
  function make_dirty(component, i2) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i2 / 31 | 0] |= 1 << i2 % 31;
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
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i2, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i2], $$.ctx[i2] = value)) {
        if (!$$.skip_bound && $$.bound[i2]) $$.bound[i2](value);
        if (ready) make_dirty(component, i2);
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
      if (options.intro) transition_in(component.$$.fragment);
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
        if (index !== -1) callbacks.splice(index, 1);
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
  var t = ["Shift", "Meta", "Alt", "Control"], e = "object" == typeof navigator ? navigator.platform : "", n = /Mac|iPod|iPhone|iPad/.test(e), r = n ? "Meta" : "Control", o = "Win32" === e ? ["Control", "Alt"] : n ? ["Alt"] : [];
  function i(t2, e2) {
    return "function" == typeof t2.getModifierState && (t2.getModifierState(e2) || o.includes(e2) && t2.getModifierState("AltGraph"));
  }
  function a(t2) {
    return t2.trim().split(" ").map(function(t3) {
      var e2 = t3.split(/\b\+/), n2 = e2.pop();
      return [e2 = e2.map(function(t4) {
        return "$mod" === t4 ? r : t4;
      }), n2];
    });
  }
  function u(e2, n2) {
    var r2;
    void 0 === n2 && (n2 = {});
    var o2 = null != (r2 = n2.timeout) ? r2 : 1e3, u2 = Object.keys(e2).map(function(t2) {
      return [a(t2), e2[t2]];
    }), c = /* @__PURE__ */ new Map(), f = null;
    return function(e3) {
      e3 instanceof KeyboardEvent && (u2.forEach(function(n3) {
        var r3 = n3[0], o3 = n3[1], a2 = c.get(r3) || r3;
        !function(e4, n4) {
          return !(n4[1].toUpperCase() !== e4.key.toUpperCase() && n4[1] !== e4.code || n4[0].find(function(t2) {
            return !i(e4, t2);
          }) || t.find(function(t2) {
            return !n4[0].includes(t2) && n4[1] !== t2 && i(e4, t2);
          }));
        }(e3, a2[0]) ? i(e3, e3.key) || c.delete(r3) : a2.length > 1 ? c.set(r3, a2.slice(1)) : (c.delete(r3), o3(e3));
      }), f && clearTimeout(f), f = setTimeout(c.clear.bind(c), o2));
    };
  }
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const logoSvg = "data:image/png;base64,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";
  const addSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">\r\n    <path class="plus" fill="#cccccc" d="M4.139 20q-.703 0-1.06-.606q-.358-.605.01-1.221L10.95 4.789q.187-.299.467-.457t.58-.159q.301 0 .584.159t.469.457l7.88 13.384q.368.616.01 1.221q-.357.606-1.06.606zm7.361-4.846v1.442q0 .213.144.357t.357.143t.356-.143t.143-.357v-1.442h1.48q.213 0 .357-.144t.144-.357t-.144-.356t-.356-.143H12.5V12.73q0-.213-.144-.356t-.357-.144t-.356.144t-.143.356v1.423h-1.461q-.213 0-.357.144t-.144.357t.144.356t.356.143z" />\r\n</svg>';
  const githubSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">\r\n    <path d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475c0-.237-.012-1.025-.012-1.862c-2.513.462-3.163-.613-3.363-1.175a3.636 3.636 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2.001 2.001 0 0 1 1.538 1.025a2.137 2.137 0 0 0 2.912.825a2.104 2.104 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.892 3.892 0 0 1 1.025-2.688a3.594 3.594 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.427 9.427 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.593 3.593 0 0 1 .1 2.65a3.869 3.869 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.368 2.368 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75c0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247" />\r\n</svg>';
  const gouSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1.18em" height="1em" viewBox="0 0 1179 1000">\r\n    <path class="gou" fill="#666666" d="M1179 72Q929 294 579 822l-115 179Q320 821 0 501l107-107l286 250q150-150 279-271.5T877.5 185T1009 74t77-59l21-14q4 0 11 2t26 19.5t35 49.5" />\r\n</svg>';
  const closeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">\r\n    <path class="close-icon" fill="#666666" fill-rule="evenodd" d="M6.793 6.793a1 1 0 0 1 1.414 0L12 10.586l3.793-3.793a1 1 0 1 1 1.414 1.414L13.414 12l3.793 3.793a1 1 0 0 1-1.414 1.414L12 13.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L10.586 12L6.793 8.207a1 1 0 0 1 0-1.414" clip-rule="evenodd" />\r\n</svg>';
  const pointerSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">\r\n    <g fill="none">\r\n        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />\r\n        <path class="shou" fill="none" d="M9.5 2a2.5 2.5 0 0 1 2.495 2.336L12 4.5v4.605l5.442.605a4 4 0 0 1 3.553 3.772l.005.203V14a8 8 0 0 1-7.75 7.996L13 22h-.674a8 8 0 0 1-7.024-4.171l-.131-.251l-2.842-5.684c-.36-.72-.093-1.683.747-2.028c1.043-.427 2.034-.507 3.055.012q.333.17.654.414l.215.17V4.5A2.5 2.5 0 0 1 9.5 2M4 6a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm12-1a1 1 0 0 1 .117 1.993L16 7h-1a1 1 0 0 1-.117-1.993L15 5zM4.707 1.293l1 1a1 1 0 0 1-1.414 1.414l-1-1a1 1 0 0 1 1.414-1.414m11 0a1 1 0 0 1 0 1.414l-1 1a1 1 0 1 1-1.414-1.414l1-1a1 1 0 0 1 1.414 0" />\r\n    </g>\r\n</svg>';
  function get_each_context(ctx, list, i2) {
    const child_ctx = ctx.slice();
    child_ctx[18] = list[i2];
    child_ctx[20] = i2;
    return child_ctx;
  }
  function create_each_block(key_1, ctx) {
    let div5;
    let div4;
    let div0;
    let raw0_value = (
      /*getSvgCode*/
      ctx[5](pointerSvg) + ""
    );
    let t0;
    let a2;
    let div1;
    let t1;
    let div2;
    let t2_value = (
      /*item*/
      ctx[18].name + ""
    );
    let t2;
    let a_href_value;
    let t3;
    let div3;
    let raw1_value = (
      /*getSvgCode*/
      ctx[5](closeSvg) + ""
    );
    let t4;
    let div5_data_key_value;
    let div5_data_index_value;
    let mounted;
    let dispose;
    return {
      key: key_1,
      first: null,
      c() {
        div5 = element("div");
        div4 = element("div");
        div0 = element("div");
        t0 = space();
        a2 = element("a");
        div1 = element("div");
        t1 = space();
        div2 = element("div");
        t2 = text(t2_value);
        t3 = space();
        div3 = element("div");
        t4 = space();
        attr(div0, "class", "pointer");
        attr(div1, "class", "dot");
        attr(div2, "class", "text");
        attr(a2, "class", "link");
        attr(a2, "target", "_blank");
        attr(a2, "href", a_href_value = /*item*/
        ctx[18].link);
        attr(div3, "class", "close");
        attr(div3, "aria-hidden", "true");
        attr(div4, "class", "inner");
        attr(div5, "class", "box");
        attr(div5, "data-key", div5_data_key_value = /*item*/
        ctx[18].key);
        attr(div5, "data-index", div5_data_index_value = /*index*/
        ctx[20]);
        attr(div5, "draggable", "true");
        this.first = div5;
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div4);
        append(div4, div0);
        div0.innerHTML = raw0_value;
        append(div4, t0);
        append(div4, a2);
        append(a2, div1);
        append(a2, t1);
        append(a2, div2);
        append(div2, t2);
        append(div4, t3);
        append(div4, div3);
        div3.innerHTML = raw1_value;
        append(div5, t4);
        if (!mounted) {
          dispose = [
            listen(
              a2,
              "click",
              /*click_handler*/
              ctx[8]
            ),
            listen(div3, "click", function() {
              if (is_function(
                /*fnDelSite*/
                ctx[7](
                  /*item*/
                  ctx[18].key
                )
              )) ctx[7](
                /*item*/
                ctx[18].key
              ).apply(this, arguments);
            })
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*sitesGrid*/
        16 && t2_value !== (t2_value = /*item*/
        ctx[18].name + "")) set_data(t2, t2_value);
        if (dirty & /*sitesGrid*/
        16 && a_href_value !== (a_href_value = /*item*/
        ctx[18].link)) {
          attr(a2, "href", a_href_value);
        }
        if (dirty & /*sitesGrid*/
        16 && div5_data_key_value !== (div5_data_key_value = /*item*/
        ctx[18].key)) {
          attr(div5, "data-key", div5_data_key_value);
        }
        if (dirty & /*sitesGrid*/
        16 && div5_data_index_value !== (div5_data_index_value = /*index*/
        ctx[20])) {
          attr(div5, "data-index", div5_data_index_value);
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div5);
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment(ctx) {
    let div14;
    let div0;
    let t0;
    let div3;
    let div2;
    let div1;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let t1;
    let div8;
    let div4;
    let t3;
    let div6;
    let div5;
    let raw0_value = (
      /*getSvgCode*/
      ctx[5](addSvg) + ""
    );
    let t4;
    let div7;
    let a1;
    let raw1_value = (
      /*getSvgCode*/
      ctx[5](githubSvg) + ""
    );
    let t5;
    let div13;
    let div11;
    let div9;
    let input0;
    let t6;
    let div10;
    let input1;
    let t7;
    let div12;
    let raw2_value = (
      /*getSvgCode*/
      ctx[5](gouSvg) + ""
    );
    let mounted;
    let dispose;
    let each_value = ensure_array_like(
      /*sitesGrid*/
      ctx[4]
    );
    const get_key = (ctx2) => (
      /*item*/
      ctx2[18].key
    );
    for (let i2 = 0; i2 < each_value.length; i2 += 1) {
      let child_ctx = get_each_context(ctx, each_value, i2);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i2] = create_each_block(key, child_ctx));
    }
    return {
      c() {
        div14 = element("div");
        div0 = element("div");
        t0 = space();
        div3 = element("div");
        div2 = element("div");
        div1 = element("div");
        for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
          each_blocks[i2].c();
        }
        t1 = space();
        div8 = element("div");
        div4 = element("div");
        div4.innerHTML = `<a target="_blank" href="https://chensuiyi.me">作者：陈随易</a>`;
        t3 = space();
        div6 = element("div");
        div5 = element("div");
        t4 = space();
        div7 = element("div");
        a1 = element("a");
        t5 = space();
        div13 = element("div");
        div11 = element("div");
        div9 = element("div");
        input0 = element("input");
        t6 = space();
        div10 = element("div");
        input1 = element("input");
        t7 = space();
        div12 = element("div");
        attr(div0, "class", "logo");
        set_style(div0, "background-image", "url('" + logoSvg + "')");
        attr(div1, "class", "grid");
        attr(div1, "id", "grid");
        attr(div2, "class", "group");
        attr(div3, "class", "panel");
        attr(div4, "class", "left");
        attr(div5, "class", "icon add-site");
        attr(div5, "aria-hidden", "true");
        attr(div6, "class", "center");
        attr(a1, "class", "icon");
        attr(a1, "target", "_blank");
        attr(a1, "href", "https://github.com/chenbimo/kangaroo-jump");
        attr(div7, "class", "right");
        attr(div8, "class", "foot");
        attr(input0, "placeholder", "请输入名称");
        attr(div9, "class", "input");
        attr(input1, "placeholder", "请输入网址");
        attr(div10, "class", "input");
        attr(div11, "class", "info");
        attr(div12, "class", "send");
        attr(div12, "aria-hidden", "true");
        attr(div13, "class", "dialog add");
        toggle_class(
          div13,
          "active",
          /*isActiveAddDialog*/
          ctx[1]
        );
        attr(div14, "class", "kuaitiao");
        toggle_class(
          div14,
          "active",
          /*isActiveKuaiTiao*/
          ctx[0]
        );
      },
      m(target, anchor) {
        insert(target, div14, anchor);
        append(div14, div0);
        append(div14, t0);
        append(div14, div3);
        append(div3, div2);
        append(div2, div1);
        for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
          if (each_blocks[i2]) {
            each_blocks[i2].m(div1, null);
          }
        }
        append(div14, t1);
        append(div14, div8);
        append(div8, div4);
        append(div8, t3);
        append(div8, div6);
        append(div6, div5);
        div5.innerHTML = raw0_value;
        append(div8, t4);
        append(div8, div7);
        append(div7, a1);
        a1.innerHTML = raw1_value;
        append(div14, t5);
        append(div14, div13);
        append(div13, div11);
        append(div11, div9);
        append(div9, input0);
        set_input_value(
          input0,
          /*siteName*/
          ctx[2]
        );
        append(div11, t6);
        append(div11, div10);
        append(div10, input1);
        set_input_value(
          input1,
          /*siteLink*/
          ctx[3]
        );
        append(div13, t7);
        append(div13, div12);
        div12.innerHTML = raw2_value;
        if (!mounted) {
          dispose = [
            listen(
              div5,
              "click",
              /*click_handler_1*/
              ctx[9]
            ),
            listen(
              input0,
              "input",
              /*input0_input_handler*/
              ctx[10]
            ),
            listen(
              input1,
              "input",
              /*input1_input_handler*/
              ctx[11]
            ),
            listen(
              div12,
              "click",
              /*fnAddSite*/
              ctx[6]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*sitesGrid, fnDelSite, getSvgCode, isActiveKuaiTiao*/
        177) {
          each_value = ensure_array_like(
            /*sitesGrid*/
            ctx2[4]
          );
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div1, destroy_block, create_each_block, null, get_each_context);
        }
        if (dirty & /*siteName*/
        4 && input0.value !== /*siteName*/
        ctx2[2]) {
          set_input_value(
            input0,
            /*siteName*/
            ctx2[2]
          );
        }
        if (dirty & /*siteLink*/
        8 && input1.value !== /*siteLink*/
        ctx2[3]) {
          set_input_value(
            input1,
            /*siteLink*/
            ctx2[3]
          );
        }
        if (dirty & /*isActiveAddDialog*/
        2) {
          toggle_class(
            div13,
            "active",
            /*isActiveAddDialog*/
            ctx2[1]
          );
        }
        if (dirty & /*isActiveKuaiTiao*/
        1) {
          toggle_class(
            div14,
            "active",
            /*isActiveKuaiTiao*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div14);
        }
        for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
          each_blocks[i2].d();
        }
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    const generateRandomString = (length) => {
      let result = "";
      let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (var i2 = 0; i2 < length; i2++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };
    let isActiveKuaiTiao = false;
    let isActiveAddDialog = false;
    let siteName = "";
    let siteLink = "";
    let sitesGrid = [];
    let sitesMap = {};
    let dragoverTime = 0;
    const handlerKeydown = u({
      "Control+q": () => {
        $$invalidate(0, isActiveKuaiTiao = !isActiveKuaiTiao);
      }
    });
    window.addEventListener("keydown", handlerKeydown);
    const getSvgCode = (data) => {
      return decodeURIComponent(data).replace(/https?\:\/\/.+\/assets\//, "");
    };
    const renderSiteGrids = () => {
      $$invalidate(4, sitesGrid = _GM_listValues().map((key, index) => {
        const group = _GM_getValue(key);
        const data = {
          name: group.name,
          link: group.link,
          key: group.key
        };
        sitesMap[key] = data;
        return data;
      }));
    };
    const fnAddSite = () => {
      if (sitesGrid.length < 100) {
        const siteKey = generateRandomString(10);
        _GM_setValue(siteKey, {
          name: siteName,
          link: siteLink,
          key: siteKey
        });
        $$invalidate(2, siteName = "");
        $$invalidate(3, siteLink = "");
        $$invalidate(1, isActiveAddDialog = false);
        renderSiteGrids();
      } else {
        alert("常用导航熟练不能超过100个");
      }
    };
    const fnDelSite = (siteKey) => {
      _GM_deleteValue(siteKey);
      renderSiteGrids();
    };
    let draggedElement = null;
    document.addEventListener("click", function(e2) {
      const kuaitiaoElement = e2.target.closest(".kuaitiao");
      if (!kuaitiaoElement) {
        $$invalidate(0, isActiveKuaiTiao = false);
      }
    });
    document.addEventListener("dragstart", function(e2) {
      draggedElement = e2.target.closest(".box");
    });
    document.addEventListener("dragover", function(e2) {
      e2.preventDefault();
      const nowMs = Date.now();
      if (nowMs - dragoverTime > 100) {
        dragoverTime = nowMs;
        document.querySelectorAll(".box .inner").forEach((el) => {
          el.closest(".inner").classList.remove("move");
        });
        const boxInnerEl = e2.target.closest(".inner");
        if (boxInnerEl) {
          boxInnerEl.classList.add("move");
        }
      }
    });
    document.addEventListener("drop", function(e2) {
      e2.preventDefault();
      const boxEl = e2.target.closest(".box");
      if (boxEl) {
        document.querySelectorAll(".box .inner").forEach((el) => {
          el.closest(".inner").classList.remove("move");
        });
        const siteKeyOld = draggedElement.dataset.key;
        const siteKeyNew = boxEl.dataset.key;
        if (siteKeyOld === siteKeyNew) return;
        const siteIndexOld = Number(draggedElement.dataset.index);
        const siteIndexNew = Number(boxEl.dataset.index);
        const siteItemOld = sitesMap[siteKeyOld];
        const siteItemNew = sitesMap[siteKeyNew];
        const sitesGrid2 = [];
        for (let item of sitesGrid) {
          if (item.key !== siteKeyOld) {
            if (siteIndexOld > siteIndexNew) {
              if (item.key !== siteKeyNew) {
                sitesGrid2.push(item);
              } else {
                sitesGrid2.push(siteItemOld);
                sitesGrid2.push(siteItemNew);
              }
            } else {
              if (item.key !== siteKeyOld) {
                sitesGrid2.push(item);
                if (item.key === siteKeyNew) {
                  sitesGrid2.push(siteItemOld);
                }
              }
            }
          }
        }
        sitesGrid2.map((item) => {
          _GM_deleteValue(item.key);
        });
        sitesGrid2.map((item) => {
          _GM_setValue(item.key, item);
        });
        $$invalidate(4, sitesGrid = sitesGrid2);
      }
    });
    renderSiteGrids();
    const click_handler = () => $$invalidate(0, isActiveKuaiTiao = false);
    const click_handler_1 = () => $$invalidate(1, isActiveAddDialog = !isActiveAddDialog);
    function input0_input_handler() {
      siteName = this.value;
      $$invalidate(2, siteName);
    }
    function input1_input_handler() {
      siteLink = this.value;
      $$invalidate(3, siteLink);
    }
    return [
      isActiveKuaiTiao,
      isActiveAddDialog,
      siteName,
      siteLink,
      sitesGrid,
      getSvgCode,
      fnAddSite,
      fnDelSite,
      click_handler,
      click_handler_1,
      input0_input_handler,
      input1_input_handler
    ];
  }
  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  }
  new App({
    target: (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  });

})();