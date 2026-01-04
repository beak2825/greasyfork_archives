// ==UserScript==
// @name         Auto Scroll Button
// @namespace    https://github.com/Jkker/tampermonkey-auto-scroll
// @version      1.1.1
// @description  Adds a button to scroll down the page when new content is loaded or by a certain interval
// @author       Jkker
// @license      MIT
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/Jkker/tampermonkey-auto-scroll/master/src/icons/Unfold.svg
// @grant        none
// @supportURL   https://github.com/Jkker/tampermonkey-auto-scroll/issues
// @downloadURL https://update.greasyfork.org/scripts/449098/Auto%20Scroll%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/449098/Auto%20Scroll%20Button.meta.js
// ==/UserScript==

(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["auto-scroll"] = factory());
})(this, function() {
  "use strict";
  const app = "";
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
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
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
    node.parentNode.removeChild(node);
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
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
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
  const outroing = /* @__PURE__ */ new Set();
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
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
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
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
  const ArrowBackIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMTZweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIiBvcGFjaXR5PSIuODciLz4KICA8cGF0aCBkPSJNMTcuNTEgMy44N0wxNS43MyAyLjEgNS44NCAxMmw5LjkgOS45IDEuNzctMS43N0w5LjM4IDEybDguMTMtOC4xM3oiLz4KPC9zdmc+";
  const SettingsIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjBweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjBweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTE5LjQzIDEyLjk4Yy4wNC0uMzIuMDctLjY0LjA3LS45OCAwLS4zNC0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMDktLjE2LS4yNi0uMjUtLjQ0LS4yNS0uMDYgMC0uMTIuMDEtLjE3LjAzbC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4wNi0uMDItLjEyLS4wMy0uMTgtLjAzLS4xNyAwLS4zNC4wOS0uNDMuMjVsLTIgMy40NmMtLjEzLjIyLS4wNy40OS4xMi42NGwyLjExIDEuNjVjLS4wNC4zMi0uMDcuNjUtLjA3Ljk4IDAgLjMzLjAzLjY2LjA3Ljk4bC0yLjExIDEuNjVjLS4xOS4xNS0uMjQuNDItLjEyLjY0bDIgMy40NmMuMDkuMTYuMjYuMjUuNDQuMjUuMDYgMCAuMTItLjAxLjE3LS4wM2wyLjQ5LTFjLjUyLjQgMS4wOC43MyAxLjY5Ljk4bC4zOCAyLjY1Yy4wMy4yNC4yNC40Mi40OS40Mmg0Yy4yNSAwIC40Ni0uMTguNDktLjQybC4zOC0yLjY1Yy42MS0uMjUgMS4xNy0uNTkgMS42OS0uOThsMi40OSAxYy4wNi4wMi4xMi4wMy4xOC4wMy4xNyAwIC4zNC0uMDkuNDMtLjI1bDItMy40NmMuMTItLjIyLjA3LS40OS0uMTItLjY0bC0yLjExLTEuNjV6bS0xLjk4LTEuNzFjLjA0LjMxLjA1LjUyLjA1LjczIDAgLjIxLS4wMi40My0uMDUuNzNsLS4xNCAxLjEzLjg5LjcgMS4wOC44NC0uNyAxLjIxLTEuMjctLjUxLTEuMDQtLjQyLS45LjY4Yy0uNDMuMzItLjg0LjU2LTEuMjUuNzNsLTEuMDYuNDMtLjE2IDEuMTMtLjIgMS4zNWgtMS40bC0uMTktMS4zNS0uMTYtMS4xMy0xLjA2LS40M2MtLjQzLS4xOC0uODMtLjQxLTEuMjMtLjcxbC0uOTEtLjctMS4wNi40My0xLjI3LjUxLS43LTEuMjEgMS4wOC0uODQuODktLjctLjE0LTEuMTNjLS4wMy0uMzEtLjA1LS41NC0uMDUtLjc0cy4wMi0uNDMuMDUtLjczbC4xNC0xLjEzLS44OS0uNy0xLjA4LS44NC43LTEuMjEgMS4yNy41MSAxLjA0LjQyLjktLjY4Yy40My0uMzIuODQtLjU2IDEuMjUtLjczbDEuMDYtLjQzLjE2LTEuMTMuMi0xLjM1aDEuMzlsLjE5IDEuMzUuMTYgMS4xMyAxLjA2LjQzYy40My4xOC44My40MSAxLjIzLjcxbC45MS43IDEuMDYtLjQzIDEuMjctLjUxLjcgMS4yMS0xLjA3Ljg1LS44OS43LjE0IDEuMTN6TTEyIDhjLTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNC0xLjc5LTQtNC00em0wIDZjLTEuMSAwLTItLjktMi0ycy45LTIgMi0yIDIgLjkgMiAyLS45IDItMiAyeiIvPgo8L3N2Zz4=";
  const StopIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTE2IDh2OEg4VjhoOG0yLTJINnYxMmgxMlY2eiIvPgo8L3N2Zz4=";
  const AutoScrollIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTEyIDUuODNMMTUuMTcgOWwxLjQxLTEuNDFMMTIgMyA3LjQxIDcuNTkgOC44MyA5IDEyIDUuODN6bTAgMTIuMzRMOC44MyAxNWwtMS40MSAxLjQxTDEyIDIxbDQuNTktNC41OUwxNS4xNyAxNSAxMiAxOC4xN3oiLz4KPC9zdmc+";
  const ClearIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMTZweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMiAxOSA2LjQxeiIvPgo8L3N2Zz4=";
  const CheckIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMTZweCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik05IDE2LjE3TDQuODMgMTJsLTEuNDIgMS40MUw5IDE5IDIxIDdsLTEuNDEtMS40MUw5IDE2LjE3eiIvPjwvc3ZnPg==";
  const CloseIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjBweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjBweCIgZmlsbD0iI2ZmZiI+CiAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMiAxOSA2LjQxeiIvPgo8L3N2Zz4=";
  function create_if_block_1(ctx) {
    let button0;
    let img;
    let img_src_value;
    let t0;
    let button1;
    let t1;
    let t2;
    let button2;
    let t3;
    let t4;
    let button3;
    let t5;
    let mounted;
    let dispose;
    return {
      c() {
        button0 = element("button");
        img = element("img");
        t0 = space();
        button1 = element("button");
        t1 = text("Auto");
        t2 = space();
        button2 = element("button");
        t3 = text("500ms");
        t4 = space();
        button3 = element("button");
        t5 = text("1.5s");
        if (!src_url_equal(img.src, img_src_value = ctx[1] ? CloseIcon : SettingsIcon))
          attr(img, "src", img_src_value);
        attr(img, "alt", "Settings");
        attr(button0, "style", ctx[12].button);
        attr(button1, "style", ctx[12].button);
        attr(button2, "style", ctx[12].button);
        attr(button3, "style", ctx[12].button);
      },
      m(target, anchor) {
        insert(target, button0, anchor);
        append(button0, img);
        insert(target, t0, anchor);
        insert(target, button1, anchor);
        append(button1, t1);
        insert(target, t2, anchor);
        insert(target, button2, anchor);
        append(button2, t3);
        insert(target, t4, anchor);
        insert(target, button3, anchor);
        append(button3, t5);
        if (!mounted) {
          dispose = [
            listen(button0, "click", ctx[6]),
            listen(button1, "click", ctx[11]("resize")),
            listen(button2, "click", ctx[11]("interval", 500)),
            listen(button3, "click", ctx[11]("interval", 1500))
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 2 && !src_url_equal(img.src, img_src_value = ctx2[1] ? CloseIcon : SettingsIcon)) {
          attr(img, "src", img_src_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(button0);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(button1);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(button2);
        if (detaching)
          detach(t4);
        if (detaching)
          detach(button3);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block(ctx) {
    let div1;
    let label;
    let t0;
    let t1;
    let div0;
    let input;
    let t2;
    let button;
    let img;
    let img_src_value;
    let t3;
    let style;
    let mounted;
    let dispose;
    return {
      c() {
        div1 = element("div");
        label = element("label");
        t0 = text("Stop scrolling if");
        t1 = space();
        div0 = element("div");
        input = element("input");
        t2 = space();
        button = element("button");
        img = element("img");
        t3 = space();
        style = element("style");
        style.textContent = "#auto-scroll-wait-until-element-input::placeholder{color:rgba(255, 255, 255, 0.8);}";
        attr(label, "style", ctx[12].inputLabel);
        attr(label, "for", "auto-scroll-wait-until-element-input");
        attr(input, "id", "auto-scroll-wait-until-element-input");
        attr(input, "style", ctx[12].input);
        input.autofocus = true;
        attr(input, "placeholder", "text appears");
        if (!src_url_equal(img.src, img_src_value = ctx[3] ? ClearIcon : CheckIcon))
          attr(img, "src", img_src_value);
        attr(img, "alt", "Clear input");
        attr(button, "style", ctx[12].inputButton);
        attr(div0, "style", ctx[12].inputContainer);
        attr(div1, "style", ctx[12].menu);
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, label);
        append(label, t0);
        append(div1, t1);
        append(div1, div0);
        append(div0, input);
        set_input_value(input, ctx[2]);
        append(div0, t2);
        append(div0, button);
        append(button, img);
        append(div0, t3);
        append(div0, style);
        input.focus();
        if (!mounted) {
          dispose = [
            listen(input, "input", ctx[13]),
            listen(input, "change", ctx[8]),
            listen(input, "input", ctx[9]),
            listen(input, "keypress", ctx[14]),
            listen(button, "click", function() {
              if (is_function(ctx[3] ? ctx[7] : ctx[8]))
                (ctx[3] ? ctx[7] : ctx[8]).apply(this, arguments);
            })
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & 4 && input.value !== ctx[2]) {
          set_input_value(input, ctx[2]);
        }
        if (dirty & 8 && !src_url_equal(img.src, img_src_value = ctx[3] ? ClearIcon : CheckIcon)) {
          attr(img, "src", img_src_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment(ctx) {
    let div1;
    let div0;
    let t0;
    let button;
    let img;
    let img_src_value;
    let div0_style_value;
    let t1;
    let mounted;
    let dispose;
    let if_block0 = ctx[0] && create_if_block_1(ctx);
    let if_block1 = ctx[0] && ctx[1] && create_if_block(ctx);
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        if (if_block0)
          if_block0.c();
        t0 = space();
        button = element("button");
        img = element("img");
        t1 = space();
        if (if_block1)
          if_block1.c();
        if (!src_url_equal(img.src, img_src_value = ctx[4] ? StopIcon : ctx[0] ? ArrowBackIcon : AutoScrollIcon))
          attr(img, "src", img_src_value);
        attr(img, "alt", "Logo");
        attr(button, "style", ctx[12].button);
        attr(div0, "style", div0_style_value = ctx[12].container + `left: ${ctx[0] ? "0" : "-8px"};`);
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        if (if_block0)
          if_block0.m(div0, null);
        append(div0, t0);
        append(div0, button);
        append(button, img);
        append(div1, t1);
        if (if_block1)
          if_block1.m(div1, null);
        if (!mounted) {
          dispose = listen(button, "click", function() {
            if (is_function(ctx[4] ? ctx[10] : ctx[5]))
              (ctx[4] ? ctx[10] : ctx[5]).apply(this, arguments);
          });
          mounted = true;
        }
      },
      p(new_ctx, [dirty]) {
        ctx = new_ctx;
        if (ctx[0]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_1(ctx);
            if_block0.c();
            if_block0.m(div0, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & 17 && !src_url_equal(img.src, img_src_value = ctx[4] ? StopIcon : ctx[0] ? ArrowBackIcon : AutoScrollIcon)) {
          attr(img, "src", img_src_value);
        }
        if (dirty & 1 && div0_style_value !== (div0_style_value = ctx[12].container + `left: ${ctx[0] ? "0" : "-8px"};`)) {
          attr(div0, "style", div0_style_value);
        }
        if (ctx[0] && ctx[1]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block(ctx);
            if_block1.c();
            if_block1.m(div1, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div1);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        mounted = false;
        dispose();
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    const getLastElementByText = (text2) => {
      const iter = document.evaluate(`//*[contains(text(),"${text2}")]`, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
      let curr, prev;
      try {
        curr = iter.iterateNext();
        while (curr) {
          prev = curr;
          curr = iter.iterateNext();
        }
      } catch (e) {
        console.error(`Auto Scroll Button Error: Document tree modified during iteration ${e}`);
      }
      return prev;
    };
    let menuOpen = false;
    const toggleMenu = () => $$invalidate(0, menuOpen = !menuOpen);
    let settingsOpen = false;
    const toggleSettings = () => $$invalidate(1, settingsOpen = !settingsOpen);
    let inputValue = "";
    let untilTarget;
    const clearScrollUntilCondition = () => $$invalidate(3, untilTarget = void 0);
    const activateScrollUntilCondition = () => {
      $$invalidate(3, untilTarget = inputValue);
      toggleSettings();
    };
    const onInput = () => {
      $$invalidate(3, untilTarget = void 0);
    };
    let lastFound = null;
    function checkStopCondition() {
      if (!untilTarget)
        return false;
      const last = getLastElementByText(untilTarget);
      if (!last)
        return false;
      if (last !== lastFound) {
        lastFound = last;
        last.scrollIntoView();
        return true;
      } else {
        return false;
      }
    }
    const scroll = () => {
      if (checkStopCondition()) {
        cancelCurrentScroll();
        return;
      }
      window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    };
    const resizeObserver = new ResizeObserver(() => setTimeout(scroll, 100));
    let intervalId;
    let scrolling = false;
    const startScroll = (type, interval = 1e3) => {
      if (type === "resize")
        resizeObserver.observe(document.body);
      else if (type === "interval")
        intervalId = setInterval(scroll, interval);
      $$invalidate(4, scrolling = type);
      $$invalidate(0, menuOpen = !menuOpen);
    };
    const cancelScroll = (type) => {
      if (type === "resize")
        resizeObserver.unobserve(document.body);
      else if (type === "interval")
        clearInterval(intervalId);
      $$invalidate(4, scrolling = false);
    };
    const cancelCurrentScroll = () => {
      if (scrolling)
        cancelScroll(scrolling);
    };
    const toggleScroll = (type, intervalSecond = 1e3) => () => {
      if (scrolling) {
        cancelScroll(type);
      } else {
        startScroll(type, intervalSecond);
      }
    };
    const styles = {
      button: "height: 40px; padding: 8px; display: flex; justify-content: center; align-items: center; border: none; outline: none; background: transparent; cursor: pointer; color: white",
      menu: "position: fixed; bottom: 62px; left: 6px; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); padding: 8px; border-radius: 8px; padding-bottom: 12px;",
      inputLabel: "color: white; font-size: 15px",
      inputContainer: "display: flex; position: relative; margin-top: 8px",
      input: "height: 24px; border: 1px solid white; outline: none; background: transparent; border-radius: 4px; padding-left: 4px; padding-right: 32px; color: white",
      inputButton: "height: 100%; width: 28px; padding: 8px; display: flex; justify-content: center; align-items: center; border: none; outline: none; cursor: pointer; position: absolute; top: 0; right: 0; border-left: 1px solid white; background: transparent",
      container: "position: fixed; bottom: 16px;  z-index: 99999999; background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); display: flex; border-radius: 0 20px 20px 0;"
    };
    function input_input_handler() {
      inputValue = this.value;
      $$invalidate(2, inputValue);
    }
    const keypress_handler = (e) => {
      if (e.key === "Enter")
        activateScrollUntilCondition();
    };
    return [
      menuOpen,
      settingsOpen,
      inputValue,
      untilTarget,
      scrolling,
      toggleMenu,
      toggleSettings,
      clearScrollUntilCondition,
      activateScrollUntilCondition,
      onInput,
      cancelCurrentScroll,
      toggleScroll,
      styles,
      input_input_handler,
      keypress_handler
    ];
  }
  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  }
  const main = new App({
    target: document.body
  });
  return main;
});
