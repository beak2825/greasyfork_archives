// ==UserScript==
// @name         tampermonkey-emoji-commit-github
// @namespace    https://github.com/cumtflyingstudio/tampermonkey-emoji-commit-github
// @version      1.2
// @description  to commit with emoji !!! !!!
// @author       SoonIter
// @match        https://github.com/**
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1iaSIgd2lkdGg9IjFlbSIgaGVpZ2h0PSIxZW0iIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi40OTMgMTMuMzY4YTcgNyAwIDEgMSAyLjQ4OS00Ljg1OGMuMzQ0LjAzMy42OC4xNDcuOTc1LjMyOGE4IDggMCAxIDAtMi42NTQgNS4xNTJhOC41OCA4LjU4IDAgMCAxLS44MS0uNjIyWm0tMy43MzEtMy4yMmExMyAxMyAwIDAgMC0xLjEwNy4zMThhLjUuNSAwIDEgMS0uMzEtLjk1Yy4zOC0uMTI1LjgwMi0uMjU0IDEuMTkyLS4zNDNjLjM3LS4wODYuNzgtLjE1MyAxLjEwMy0uMTA4Yy4xNi4wMjIuMzk0LjA4NS41NjEuMjg2Yy4xODguMjI2LjE4Ny40OTcuMTMxLjcwNWExLjg5MiAxLjg5MiAwIDAgMS0uMzEuNTkzYy0uMDc3LjEwNy0uMTY4LjIyLS4yNzUuMzQzYy4xMDcuMTI0LjE5OS4yNC4yNzYuMzQ3Yy4xNDIuMTk3LjI1Ni4zOTcuMzEuNTk1Yy4wNTUuMjA4LjA1Ni40NzktLjEzMi43MDZjLS4xNjguMi0uNDA0LjI2Mi0uNTYzLjI4NGMtLjMyMy4wNDMtLjczMy0uMDI3LTEuMTAyLS4xMTNhMTQuODcgMTQuODcgMCAwIDEtMS4xOTEtLjM0NWEuNS41IDAgMSAxIC4zMS0uOTVjLjM3MS4xMi43NjEuMjQgMS4xMDkuMzIxYy4xNzYuMDQxLjMyNS4wNjkuNDQ2LjA4NGE1LjYwOSA1LjYwOSAwIDAgMC0uNTAyLS41ODRhLjUuNSAwIDAgMSAuMDAyLS42OTVhNS41MiA1LjUyIDAgMCAwIC41LS41NzdhNC40NjUgNC40NjUgMCAwIDAtLjQ0OC4wODJabS43NjYtLjA4N2wtLjAwMy0uMDAxbC0uMDAzLS4wMDFjLjAwNCAwIC4wMDYuMDAyLjAwNi4wMDJabS4wMDIgMS44NjdsLS4wMDYuMDAxYS4wMzguMDM4IDAgMCAxIC4wMDYtLjAwMlpNNiA4Yy41NTIgMCAxLS42NzIgMS0xLjVTNi41NTIgNSA2IDVzLTEgLjY3Mi0xIDEuNVM1LjQ0OCA4IDYgOFptMi43NTctLjU2M2EuNS41IDAgMCAwIC42OC0uMTk0YS45MzQuOTM0IDAgMCAxIC44MTMtLjQ5M2MuMzM5IDAgLjY0NS4xOS44MTMuNDkzYS41LjUgMCAwIDAgLjg3NC0uNDg2QTEuOTM0IDEuOTM0IDAgMCAwIDEwLjI1IDUuNzVjLS43MyAwLTEuMzU2LjQxMi0xLjY4NyAxLjAwN2EuNS41IDAgMCAwIC4xOTQuNjhaTTE0IDkuODI4YzEuMTEtMS4xNCAzLjg4NC44NTYgMCAzLjQyMmMtMy44ODQtMi41NjYtMS4xMS00LjU2MiAwLTMuNDIxWiI+PC9wYXRoPjwvc3ZnPg==

// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447570/tampermonkey-emoji-commit-github.user.js
// @updateURL https://update.greasyfork.org/scripts/447570/tampermonkey-emoji-commit-github.meta.js
// ==/UserScript==
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Tampermonkey = factory());
})(this, function() {
  "use strict";
  function noop() {
  }
  const identity = (x) => x;
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
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
  const tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0)
      raf(run_tasks);
  }
  function loop(callback) {
    let task;
    if (tasks.size === 0)
      raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
      const style = element("style");
      style.id = style_sheet_id;
      style.textContent = styles;
      append_stylesheet(append_styles_to, style);
    }
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
      return root;
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(node.head || node, style);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
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
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function toggle_class(element2, name, toggle) {
    element2.classList[toggle ? "add" : "remove"](name);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
  }
  const managed_styles = /* @__PURE__ */ new Map();
  let active = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--)
      hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1);
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active)
        clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active)
        return;
      managed_styles.forEach((info) => {
        const { stylesheet } = info;
        let i = stylesheet.cssRules.length;
        while (i--)
          stylesheet.deleteRule(i);
        info.rules = {};
      });
      managed_styles.clear();
    });
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
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
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
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
  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
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
    }
  }
  const null_transition = { duration: 0 };
  function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function go() {
      const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
      if (css)
        animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
      tick(0, 1);
      const start_time = now() + delay;
      const end_time = start_time + duration;
      if (task)
        task.abort();
      running = true;
      add_render_callback(() => dispatch(node, true, "start"));
      task = loop((now2) => {
        if (running) {
          if (now2 >= end_time) {
            tick(1, 0);
            dispatch(node, true, "end");
            cleanup();
            return running = false;
          }
          if (now2 >= start_time) {
            const t = easing((now2 - start_time) / duration);
            tick(t, 1 - t);
          }
        }
        return running;
      });
    }
    let started = false;
    return {
      start() {
        if (started)
          return;
        started = true;
        delete_rule(node);
        if (is_function(config)) {
          config = config();
          wait().then(go);
        } else {
          go();
        }
      },
      invalidate() {
        started = false;
      },
      end() {
        if (running) {
          cleanup();
          running = false;
        }
      }
    };
  }
  function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
      const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
      if (css)
        animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
      const start_time = now() + delay;
      const end_time = start_time + duration;
      add_render_callback(() => dispatch(node, false, "start"));
      loop((now2) => {
        if (running) {
          if (now2 >= end_time) {
            tick(0, 1);
            dispatch(node, false, "end");
            if (!--group.r) {
              run_all(group.c);
            }
            return false;
          }
          if (now2 >= start_time) {
            const t = easing((now2 - start_time) / duration);
            tick(1 - t, t);
          }
        }
        return running;
      });
    }
    if (is_function(config)) {
      wait().then(() => {
        config = config();
        go();
      });
    } else {
      go();
    }
    return {
      end(reset) {
        if (reset && config.tick) {
          config.tick(1, 0);
        }
        if (running) {
          if (animation_name)
            delete_rule(node, animation_name);
          running = false;
        }
      }
    };
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
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block2(key, child_ctx);
        block.c();
      } else if (dynamic) {
        block.p(child_ctx, dirty);
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
    return new_blocks;
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
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
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles2 && append_styles2($$.root);
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
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }
  const clipboard = {};
  clipboard.write = async (text2) => {
    await navigator.clipboard.writeText(text2);
  };
  clipboard.read = async () => navigator.clipboard.readText();
  clipboard.readSync = () => {
    throw new Error("`.readSync()` is not supported in browsers!");
  };
  clipboard.writeSync = () => {
    throw new Error("`.writeSync()` is not supported in browsers!");
  };
  function add_css$1(target) {
    append_styles(target, "svelte-d0op9", ".copied.svelte-d0op9{transform:scale(1.2);transition:all 0.5s}.copy-success.svelte-d0op9{background-color:#86efac;@apply bg-green-300;}@keyframes svelte-d0op9-randomMovearound{from{transform:translate(0, 0)}50%{transform:translate(0, 2px)}to{transform:translate(0, 0)}}.hovering.svelte-d0op9{animation:svelte-d0op9-randomMovearound 2s infinite ease-in}");
  }
  function create_fragment$3(ctx) {
    let div2;
    let div0;
    let span;
    let t0;
    let t1;
    let div1;
    let t2_value = ctx[0].represent + "";
    let t2;
    let mounted;
    let dispose;
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        span = element("span");
        t0 = text(ctx[3]);
        t1 = space();
        div1 = element("div");
        t2 = text(t2_value);
        attr(span, "class", "select-none svelte-d0op9");
        toggle_class(span, "copied", ctx[1]);
        attr(div0, "class", "h-14 w-14 hover:shadow-lg p-2 hover:bg-gray-700 bg-gray-200 opacity-70 flex justify-center items-center cursor-pointer rounded-full hover:ring-4 shadow-inner text-2xl transition-all duration-200  svelte-d0op9");
        attr(div0, "draggable", "true");
        toggle_class(div0, "hovering", ctx[2]);
        toggle_class(div0, "copy-success", ctx[1]);
        attr(div1, "class", "text-md");
        toggle_class(div1, "text-xs", ctx[0].represent.length > 10);
        attr(div2, "class", "flex flex-col justify-center items-center");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, span);
        append(span, t0);
        append(div2, t1);
        append(div2, div1);
        append(div1, t2);
        if (!mounted) {
          dispose = [
            listen(div0, "mouseover", ctx[5]),
            listen(div0, "focus", ctx[5]),
            listen(div0, "mouseleave", ctx[6]),
            listen(div0, "click", ctx[4]),
            listen(div0, "dragstart", ctx[7])
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 8)
          set_data(t0, ctx2[3]);
        if (dirty & 2) {
          toggle_class(span, "copied", ctx2[1]);
        }
        if (dirty & 4) {
          toggle_class(div0, "hovering", ctx2[2]);
        }
        if (dirty & 2) {
          toggle_class(div0, "copy-success", ctx2[1]);
        }
        if (dirty & 1 && t2_value !== (t2_value = ctx2[0].represent + ""))
          set_data(t2, t2_value);
        if (dirty & 1) {
          toggle_class(div1, "text-xs", ctx2[0].represent.length > 10);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div2);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let innerText;
    let { emoji = {
      name: "",
      content: "",
      represent: "",
      description: ""
    } } = $$props;
    let copied = false;
    let hovering = false;
    async function copy() {
      try {
        await clipboard.write(innerText);
        $$invalidate(1, copied = true);
        setTimeout(() => {
          $$invalidate(1, copied = false);
        }, 500);
      } catch (err) {
        console.error(err);
      }
    }
    function hover() {
      $$invalidate(2, hovering = true);
    }
    const mouseleave_handler = () => {
      $$invalidate(2, hovering = false);
    };
    const dragstart_handler = (ev) => {
      ev.dataTransfer.setData("text/plain", innerText);
    };
    $$self.$$set = ($$props2) => {
      if ("emoji" in $$props2)
        $$invalidate(0, emoji = $$props2.emoji);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1) {
        $$invalidate(3, innerText = emoji.content);
      }
    };
    return [
      emoji,
      copied,
      hovering,
      innerText,
      copy,
      hover,
      mouseleave_handler,
      dragstart_handler
    ];
  }
  class CopyButton extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$3, safe_not_equal, { emoji: 0 }, add_css$1);
    }
  }
  function cubicOut(t) {
    const f = t - 1;
    return f * f * f + 1;
  }
  function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === "none" ? "" : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
      delay,
      duration,
      easing,
      css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - od * u}`
    };
  }
  var emojis = [
    {
      name: "\u706B\u82B1",
      content: "\u2728",
      description: "\u5F15\u5165\u65B0\u529F\u80FD",
      represent: "feat"
    },
    {
      name: "bug",
      content: "\u{1F41B}",
      description: "\u4FEE\u590D bug",
      represent: "fix"
    },
    {
      name: "\u5E86\u795D",
      content: "\u{1F389}",
      description: "\u521D\u6B21\u63D0\u4EA4",
      represent: "init"
    },
    {
      name: "\u8C03\u8272\u677F",
      content: "\u{1F3A8}",
      description: "\u6539\u8FDB\u4EE3\u7801\u7ED3\u6784/\u4EE3\u7801\u683C\u5F0F",
      represent: "refactor"
    },
    {
      name: "\u95EA\u7535",
      content: "\u26A1\uFE0F",
      description: "\u63D0\u5347\u6027\u80FD",
      represent: "perf"
    },
    {
      name: "\u706B\u7130",
      content: "\u{1F525}",
      description: "\u79FB\u9664\u4EE3\u7801\u6216\u6587\u4EF6",
      represent: "delete"
    },
    {
      name: "\u6025\u6551\u8F66",
      content: "\u{1F691}",
      description: "\u91CD\u8981\u8865\u4E01",
      represent: "fix(important)"
    },
    {
      name: "\u94C5\u7B14",
      content: "\u{1F4DD}",
      description: "\u64B0\u5199\u6587\u6863",
      represent: "docs"
    },
    {
      name: "\u706B\u7BAD",
      content: "\u{1F680}",
      description: "\u90E8\u7F72\u529F\u80FD",
      represent: "build"
    },
    {
      name: "\u53E3\u7EA2",
      content: "\u{1F484}",
      description: "\u66F4\u65B0 UI \u548C\u6837\u5F0F\u6587\u4EF6",
      represent: "style"
    },
    {
      name: "\u767D\u8272\u590D\u9009\u6846",
      content: "\u2705",
      description: "\u589E\u52A0\u6D4B\u8BD5",
      represent: "test"
    },
    {
      name: "\u9501",
      content: "\u{1F512}",
      description: "\u4FEE\u590D\u5B89\u5168\u95EE\u9898",
      represent: "fix(security)"
    },
    {
      name: "\u82F9\u679C",
      content: "\u{1F34E}",
      description: "\u4FEE\u590D macOS \u4E0B\u7684\u95EE\u9898",
      represent: "fix(macos)"
    },
    {
      name: "\u4F01\u9E45",
      content: "\u{1F427}",
      description: "\u4FEE\u590D Linux \u4E0B\u7684\u95EE\u9898",
      represent: "fix(linux)"
    },
    {
      name: "\u65D7\u5E1C",
      content: "\u{1F3C1}",
      description: "\u4FEE\u590D Windows \u4E0B\u7684\u95EE\u9898",
      represent: "fix(windows)"
    },
    {
      name: "\u4E66\u7B7E",
      content: "\u{1F516}",
      description: "\u53D1\u884C/\u7248\u672C\u6807\u7B7E",
      represent: "publish"
    },
    {
      name: "\u6273\u624B",
      content: "\u{1F527}",
      description: "\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6",
      represent: "chore(config)"
    },
    {
      name: "\u65BD\u5DE5",
      content: "\u{1F6A7}",
      description: "\u5DE5\u4F5C\u8FDB\u884C\u4E2D",
      represent: "doing"
    },
    {
      name: "\u7EFF\u5FC3",
      content: "\u{1F49A}",
      description: "\u4FEE\u590D CI \u6784\u5EFA\u95EE\u9898",
      represent: "fix(CI)"
    },
    {
      name: "\u4E0B\u964D\u7BAD\u5934",
      content: "\u2B07\uFE0F",
      description: "\u964D\u7EA7\u4F9D\u8D56",
      represent: "chore(dependency)"
    },
    {
      name: "\u4E0A\u5347\u7BAD\u5934",
      content: "\u2B06\uFE0F",
      description: "\u5347\u7EA7\u4F9D\u8D56",
      represent: "chore(dependency)"
    },
    {
      name: "\u4E0A\u5347\u8D8B\u52BF\u56FE",
      content: "\u{1F4C8}",
      description: "\u6DFB\u52A0\u5206\u6790\u6216\u8DDF\u8E2A\u4EE3\u7801",
      represent: "UI(debug)"
    },
    {
      name: "\u9524\u5B50",
      content: "\u{1F528}",
      description: "\u91CD\u5927\u91CD\u6784",
      represent: "refactor(important)"
    },
    {
      name: "\u9CB8\u9C7C",
      content: "\u{1F433}",
      description: "Docker \u76F8\u5173\u5DE5\u4F5C",
      represent: "chore(docker)"
    },
    {
      name: "\u5730\u7403",
      content: "\u{1F310}",
      description: "\u56FD\u9645\u5316\u4E0E\u672C\u5730\u5316",
      represent: "i18"
    }
  ];
  function create_if_block_1(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill", "currentColor");
        attr(path, "d", "M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        attr(svg, "width", "1em");
        attr(svg, "height", "1em");
        attr(svg, "viewBox", "0 0 1024 1024");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  function create_if_block$1(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill", "currentColor");
        attr(path, "d", "M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        attr(svg, "width", "1em");
        attr(svg, "height", "1em");
        attr(svg, "viewBox", "0 0 1024 1024");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      d(detaching) {
        if (detaching)
          detach(svg);
      }
    };
  }
  function create_fragment$2(ctx) {
    let if_block_anchor;
    function select_block_type(ctx2, dirty) {
      if (ctx2[0] === "right")
        return create_if_block$1;
      if (ctx2[0] === "left")
        return create_if_block_1;
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
      p(ctx2, [dirty]) {
        if (current_block_type !== (current_block_type = select_block_type(ctx2))) {
          if (if_block)
            if_block.d(1);
          if_block = current_block_type && current_block_type(ctx2);
          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (if_block) {
          if_block.d(detaching);
        }
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let { type = "right" } = $$props;
    $$self.$$set = ($$props2) => {
      if ("type" in $$props2)
        $$invalidate(0, type = $$props2.type);
    };
    return [type];
  }
  class ShowButton extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$2, safe_not_equal, { type: 0 });
    }
  }
  function add_css(target) {
    append_styles(target, "svelte-184jni4", ".bg-main.svelte-184jni4{background-color:rgba(255, 255, 255, 0.7)}.main.svelte-184jni4{height:400px;width:300px}.top-center.svelte-184jni4{top:calc(10rem + 200px)}.no-scrollbar.svelte-184jni4::-webkit-scrollbar{width:5px !important}");
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    return child_ctx;
  }
  function create_else_block(ctx) {
    let button;
    let showbutton;
    let current;
    let mounted;
    let dispose;
    showbutton = new ShowButton({ props: { type: "left" } });
    return {
      c() {
        button = element("button");
        create_component(showbutton.$$.fragment);
        attr(button, "class", "fixed right-0 top-center svelte-184jni4");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        mount_component(showbutton, button, null);
        current = true;
        if (!mounted) {
          dispose = listen(button, "click", ctx[3]);
          mounted = true;
        }
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(showbutton.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(showbutton.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(button);
        destroy_component(showbutton);
        mounted = false;
        dispose();
      }
    };
  }
  function create_if_block(ctx) {
    let div4;
    let button;
    let showbutton;
    let t0;
    let div3;
    let div0;
    let input_1;
    let t1;
    let div2;
    let div1;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let div4_intro;
    let div4_outro;
    let current;
    let mounted;
    let dispose;
    showbutton = new ShowButton({ props: { type: "right" } });
    let each_value = ctx[1];
    const get_key = (ctx2) => ctx2[5].content;
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    }
    return {
      c() {
        div4 = element("div");
        button = element("button");
        create_component(showbutton.$$.fragment);
        t0 = space();
        div3 = element("div");
        div0 = element("div");
        input_1 = element("input");
        t1 = space();
        div2 = element("div");
        div1 = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(input_1, "type", "text");
        attr(input_1, "class", "w-full h-10 px-4 rounded-full bg-gray-200 ");
        attr(input_1, "placeholder", "search something");
        attr(div0, "class", "w-full py-4");
        attr(div1, "class", "grid grid-cols-2 gap-4");
        attr(div2, "class", "main overflow-y-scroll p-4 no-scrollbar svelte-184jni4");
        attr(div3, "class", "");
        attr(div4, "class", "fixed right-0 top-40 flex justify-center items-center rounded-l-3xl border shadow-lg backdrop:filter bg-main svelte-184jni4");
      },
      m(target, anchor) {
        insert(target, div4, anchor);
        append(div4, button);
        mount_component(showbutton, button, null);
        append(div4, t0);
        append(div4, div3);
        append(div3, div0);
        append(div0, input_1);
        set_input_value(input_1, ctx[0]);
        append(div3, t1);
        append(div3, div2);
        append(div2, div1);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div1, null);
        }
        current = true;
        if (!mounted) {
          dispose = [
            listen(button, "click", ctx[3]),
            listen(input_1, "input", ctx[4])
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 1 && input_1.value !== ctx2[0]) {
          set_input_value(input_1, ctx2[0]);
        }
        if (dirty & 2) {
          each_value = ctx2[1];
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block, null, get_each_context);
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(showbutton.$$.fragment, local);
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        add_render_callback(() => {
          if (div4_outro)
            div4_outro.end(1);
          div4_intro = create_in_transition(div4, fly, { x: 100, duration: 500 });
          div4_intro.start();
        });
        current = true;
      },
      o(local) {
        transition_out(showbutton.$$.fragment, local);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        if (div4_intro)
          div4_intro.invalidate();
        div4_outro = create_out_transition(div4, fly, { x: 100, duration: 500 });
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div4);
        destroy_component(showbutton);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
        if (detaching && div4_outro)
          div4_outro.end();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_each_block(key_1, ctx) {
    let first;
    let copybutton;
    let current;
    copybutton = new CopyButton({ props: { emoji: ctx[5] } });
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(copybutton.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(copybutton, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const copybutton_changes = {};
        if (dirty & 2)
          copybutton_changes.emoji = ctx[5];
        copybutton.$set(copybutton_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(copybutton.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(copybutton.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(first);
        destroy_component(copybutton, detaching);
      }
    };
  }
  function create_fragment$1(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[2])
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx);
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
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
        if_blocks[current_block_type_index].d(detaching);
        if (detaching)
          detach(if_block_anchor);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let arr = emojis;
    let visible = true;
    const toggle = () => $$invalidate(2, visible = !visible);
    let input = "";
    function input_1_input_handler() {
      input = this.value;
      $$invalidate(0, input);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1) {
        $$invalidate(1, arr = emojis.filter((i) => {
          if (input === "")
            return true;
          let flag = false;
          Object.keys(i).forEach((k) => {
            typeof i[k] === "string" && i[k].includes(input) && (flag = true);
          });
          return flag;
        }));
      }
    };
    return [input, arr, visible, toggle, input_1_input_handler];
  }
  class Table extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment$1, safe_not_equal, {}, add_css);
    }
  }
  function create_fragment(ctx) {
    let main;
    let table;
    let current;
    table = new Table({});
    return {
      c() {
        main = element("main");
        create_component(table.$$.fragment);
      },
      m(target, anchor) {
        insert(target, main, anchor);
        mount_component(table, main, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(table.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(table.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(main);
        destroy_component(table);
      }
    };
  }
  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment, safe_not_equal, {});
    }
  }
  var tailwindBase = /* @__PURE__ */ (() => "/*\n! tailwindcss v3.1.4 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::-webkit-backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.container {\n  width: 100%;\n}\n@media (min-width: 640px) {\n\n  .container {\n    max-width: 640px;\n  }\n}\n@media (min-width: 768px) {\n\n  .container {\n    max-width: 768px;\n  }\n}\n@media (min-width: 1024px) {\n\n  .container {\n    max-width: 1024px;\n  }\n}\n@media (min-width: 1280px) {\n\n  .container {\n    max-width: 1280px;\n  }\n}\n@media (min-width: 1536px) {\n\n  .container {\n    max-width: 1536px;\n  }\n}\n.visible {\n  visibility: visible;\n}\n.\\!visible {\n  visibility: visible !important;\n}\n.fixed {\n  position: fixed;\n}\n.right-0 {\n  right: 0px;\n}\n.top-40 {\n  top: 10rem;\n}\n.flex {\n  display: flex;\n}\n.grid {\n  display: grid;\n}\n.h-14 {\n  height: 3.5rem;\n}\n.h-10 {\n  height: 2.5rem;\n}\n.w-14 {\n  width: 3.5rem;\n}\n.w-full {\n  width: 100%;\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.flex-col {\n  flex-direction: column;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.gap-4 {\n  gap: 1rem;\n}\n.overflow-y-scroll {\n  overflow-y: scroll;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-l-3xl {\n  border-top-left-radius: 1.5rem;\n  border-bottom-left-radius: 1.5rem;\n}\n.border {\n  border-width: 1px;\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-4 {\n  padding: 1rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.opacity-70 {\n  opacity: 0.7;\n}\n.shadow-inner {\n  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition {\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.duration-200 {\n  transition-duration: 200ms;\n}\n\n:root {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n}\n\n.backdrop\\:filter::-webkit-backdrop {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n\n.backdrop\\:filter::backdrop {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n\n.hover\\:bg-gray-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n\n.hover\\:shadow-lg:hover {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.hover\\:ring-4:hover {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}")();
  function createContainerInDocument() {
    const container = document.createElement("div");
    container.id = "tempermonkey-app";
    container.style.zIndex = "2147483647";
    container.style.position = "fixed";
    return container;
  }
  function containerInShadowRoot() {
    const container = document.createElement("div");
    container.id = "tempermonkey-app-shadow-container";
    return container;
  }
  function createDom() {
    const container = createContainerInDocument();
    const shadowRoot = container.attachShadow({ mode: "closed" });
    const containerInShadow = containerInShadowRoot();
    shadowRoot.appendChild(containerInShadow);
    document.body.appendChild(container);
    return containerInShadow;
  }
  function copyCssFromMainDocument(container) {
    const styleDom = document.createElement("style");
    styleDom.innerText = tailwindBase;
    container.appendChild(styleDom);
  }
  const appDom = createDom();
  copyCssFromMainDocument(appDom);
  const app = new App({
    target: appDom
  });
  return app;
});
