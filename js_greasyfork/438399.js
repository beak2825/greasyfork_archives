// ==UserScript==
// @name        yacu - Yet another CC98 userscript
// @description CC98 增强脚本
// @namespace   https://github.com/CoolSpring8/
// @match       *://www.cc98.org/*
// @match       *://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @run-at      document-idle
// @version     1.0.1
// @homepage    https://github.com/CoolSpring8/yacu
// @author      CoolSpring8
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/438399/yacu%20-%20Yet%20another%20CC98%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/438399/yacu%20-%20Yet%20another%20CC98%20userscript.meta.js
// ==/UserScript==
function _defineProperty(obj, key, value) {
  return (
    key in obj
      ? Object.defineProperty(obj, key, {
          value: value,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (obj[key] = value),
    obj
  );
}
function noop() {}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return "function" == typeof thing;
}
function safe_not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && "object" == typeof a) || "function" == typeof a;
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = (function (node) {
    if (!node) return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) return root;
    return node.ownerDocument;
  })(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    (style.id = style_sheet_id),
      (style.textContent = styles),
      (function (node, style) {
        append(node.head || node, style);
      })(append_styles_to, style);
  }
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
  return (
    node.addEventListener(event, handler, options),
    () => node.removeEventListener(event, handler, options)
  );
}
function attr(node, attribute, value) {
  null == value
    ? node.removeAttribute(attribute)
    : node.getAttribute(attribute) !== value &&
      node.setAttribute(attribute, value);
}
function set_data(text, data) {
  (data = "" + data), text.wholeText !== data && (text.data = data);
}
function set_input_value(input, value) {
  input.value = null == value ? "" : value;
}
function toggle_class(element, name, toggle) {
  element.classList[toggle ? "add" : "remove"](name);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function onMount(fn) {
  (function () {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  })().$$.on_mount.push(fn);
}
!(function (css, ref) {
  void 0 === ref && (ref = {});
  var insertAt = ref.insertAt;
  if (css && "undefined" != typeof document) {
    var head = document.head || document.getElementsByTagName("head")[0],
      style = document.createElement("style");
    (style.type = "text/css"),
      "top" === insertAt && head.firstChild
        ? head.insertBefore(style, head.firstChild)
        : head.appendChild(style),
      style.styleSheet
        ? (style.styleSheet.cssText = css)
        : style.appendChild(document.createTextNode(css));
  }
})(
  "*,:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.flex{display:flex}.hidden{display:none}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.rounded-lg{border-radius:.5rem}.bg-gray-100{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.text-3xl{font-size:1.875rem;line-height:2.25rem}.shadow-2xl{--tw-shadow:0 25px 50px -12px #00000040;--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}"
);
const dirty_components = [],
  binding_callbacks = [],
  render_callbacks = [],
  flush_callbacks = [],
  resolved_promise = Promise.resolve();
let update_scheduled = !1;
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    for (; flushidx < dirty_components.length; ) {
      const component = dirty_components[flushidx];
      flushidx++, set_current_component(component), update(component.$$);
    }
    for (
      set_current_component(null), dirty_components.length = 0, flushidx = 0;
      binding_callbacks.length;

    )
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      seen_callbacks.has(callback) ||
        (seen_callbacks.add(callback), callback());
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  for (; flush_callbacks.length; ) flush_callbacks.pop()();
  (update_scheduled = !1),
    seen_callbacks.clear(),
    set_current_component(saved_component);
}
function update($$) {
  if (null !== $$.fragment) {
    $$.update(), run_all($$.before_update);
    const dirty = $$.dirty;
    ($$.dirty = [-1]),
      $$.fragment && $$.fragment.p($$.ctx, dirty),
      $$.after_update.forEach(add_render_callback);
  }
}
const outroing = new Set();
let outros, defaultGetStoreFunc;
function transition_in(block, local) {
  block && block.i && (outroing.delete(block), block.i(local));
}
function transition_out(block, local, detach, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block),
      outros.c.push(() => {
        outroing.delete(block), callback && (detach && block.d(1), callback());
      }),
      block.o(local);
  }
}
function mount_component(component, target, anchor, customElement) {
  const {
    fragment: fragment,
    on_mount: on_mount,
    on_destroy: on_destroy,
    after_update: after_update,
  } = component.$$;
  fragment && fragment.m(target, anchor),
    customElement ||
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        on_destroy
          ? on_destroy.push(...new_on_destroy)
          : run_all(new_on_destroy),
          (component.$$.on_mount = []);
      }),
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  null !== $$.fragment &&
    (run_all($$.on_destroy),
    $$.fragment && $$.fragment.d(detaching),
    ($$.on_destroy = $$.fragment = null),
    ($$.ctx = []));
}
function make_dirty(component, i) {
  -1 === component.$$.dirty[0] &&
    (dirty_components.push(component),
    update_scheduled || ((update_scheduled = !0), resolved_promise.then(flush)),
    component.$$.dirty.fill(0)),
    (component.$$.dirty[(i / 31) | 0] |= 1 << i % 31);
}
function init(
  component,
  options,
  instance,
  create_fragment,
  not_equal,
  props,
  append_styles,
  dirty = [-1]
) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = (component.$$ = {
    fragment: null,
    ctx: null,
    props: props,
    update: noop,
    not_equal: not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(
      options.context || (parent_component ? parent_component.$$.context : [])
    ),
    callbacks: blank_object(),
    dirty: dirty,
    skip_bound: !1,
    root: options.target || parent_component.$$.root,
  });
  append_styles && append_styles($$.root);
  let ready = !1;
  if (
    (($$.ctx = instance
      ? instance(component, options.props || {}, (i, ret, ...rest) => {
          const value = rest.length ? rest[0] : ret;
          return (
            $$.ctx &&
              not_equal($$.ctx[i], ($$.ctx[i] = value)) &&
              (!$$.skip_bound && $$.bound[i] && $$.bound[i](value),
              ready && make_dirty(component, i)),
            ret
          );
        })
      : []),
    $$.update(),
    (ready = !0),
    run_all($$.before_update),
    ($$.fragment = !!create_fragment && create_fragment($$.ctx)),
    options.target)
  ) {
    if (options.hydrate) {
      const nodes = (function (element) {
        return Array.from(element.childNodes);
      })(options.target);
      $$.fragment && $$.fragment.l(nodes), nodes.forEach(detach);
    } else $$.fragment && $$.fragment.c();
    options.intro && transition_in(component.$$.fragment),
      mount_component(
        component,
        options.target,
        options.anchor,
        options.customElement
      ),
      flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1), (this.$destroy = noop);
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    return (
      callbacks.push(callback),
      () => {
        const index = callbacks.indexOf(callback);
        -1 !== index && callbacks.splice(index, 1);
      }
    );
  }
  $set($$props) {
    var obj;
    this.$$set &&
      ((obj = $$props), 0 !== Object.keys(obj).length) &&
      ((this.$$.skip_bound = !0),
      this.$$set($$props),
      (this.$$.skip_bound = !1));
  }
}
function add_css$2(target) {
  append_styles(
    target,
    "svelte-1hz6wor",
    ".award-info-stats.svelte-1hz6wor{display:flex;gap:2px;font-size:12px}.item.svelte-1hz6wor{color:grey;margin-right:4px}"
  );
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  return (child_ctx[1] = list[i]), child_ctx;
}
function create_each_block(ctx) {
  let p,
    t0,
    t1,
    t2,
    t3,
    t0_value = ctx[1][0] + "",
    t2_value = ctx[1][1] + "";
  return {
    c() {
      (p = element("p")),
        (t0 = text(t0_value)),
        (t1 = text("×")),
        (t2 = text(t2_value)),
        (t3 = text("；")),
        attr(p, "class", "item svelte-1hz6wor");
    },
    m(target, anchor) {
      insert(target, p, anchor),
        append(p, t0),
        append(p, t1),
        append(p, t2),
        append(p, t3);
    },
    p(ctx, dirty) {
      1 & dirty &&
        t0_value !== (t0_value = ctx[1][0] + "") &&
        set_data(t0, t0_value),
        1 & dirty &&
          t2_value !== (t2_value = ctx[1][1] + "") &&
          set_data(t2, t2_value);
    },
    d(detaching) {
      detaching && detach(p);
    },
  };
}
function create_fragment$2(ctx) {
  let div,
    p,
    t1,
    each_value = ctx[0],
    each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1)
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  return {
    c() {
      (div = element("div")),
        (p = element("p")),
        (p.textContent = "统计："),
        (t1 = space());
      for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();
      attr(div, "class", "award-info-stats svelte-1hz6wor");
    },
    m(target, anchor) {
      insert(target, div, anchor), append(div, p), append(div, t1);
      for (let i = 0; i < each_blocks.length; i += 1)
        each_blocks[i].m(div, null);
    },
    p(ctx, [dirty]) {
      if (1 & dirty) {
        let i;
        for (each_value = ctx[0], i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx, each_value, i);
          each_blocks[i]
            ? each_blocks[i].p(child_ctx, dirty)
            : ((each_blocks[i] = create_each_block(child_ctx)),
              each_blocks[i].c(),
              each_blocks[i].m(div, null));
        }
        for (; i < each_blocks.length; i += 1) each_blocks[i].d(1);
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      detaching && detach(div),
        (function (iterations, detaching) {
          for (let i = 0; i < iterations.length; i += 1)
            iterations[i] && iterations[i].d(detaching);
        })(each_blocks, detaching);
    },
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { stats: stats } = $$props;
  return (
    ($$self.$$set = ($$props) => {
      "stats" in $$props && $$invalidate(0, (stats = $$props.stats));
    }),
    [stats]
  );
}
class AwardInfoStats$1 extends SvelteComponent {
  constructor(options) {
    super(),
      init(
        this,
        options,
        instance$2,
        create_fragment$2,
        safe_not_equal,
        { stats: 0 },
        add_css$2
      );
  }
}
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    (request.oncomplete = request.onsuccess = () => resolve(request.result)),
      (request.onabort = request.onerror = () => reject(request.error));
  });
}
function createStore(dbName, storeName) {
  const dbp = (
    !navigator.userAgentData &&
    /Safari\//.test(navigator.userAgent) &&
    !/Chrom(e|ium)\//.test(navigator.userAgent) &&
    indexedDB.databases
      ? new Promise(function (resolve) {
          var tryIdb = function () {
            return indexedDB.databases().finally(resolve);
          };
          (intervalId = setInterval(tryIdb, 100)), tryIdb();
        }).finally(function () {
          return clearInterval(intervalId);
        })
      : Promise.resolve()
  ).then(() => {
    const request = indexedDB.open(dbName);
    return (
      (request.onupgradeneeded = () =>
        request.result.createObjectStore(storeName)),
      promisifyRequest(request)
    );
  });
  var intervalId;
  return (txMode, callback) =>
    dbp.then((db) =>
      callback(db.transaction(storeName, txMode).objectStore(storeName))
    );
}
function defaultGetStore() {
  return (
    defaultGetStoreFunc ||
      (defaultGetStoreFunc = createStore("keyval-store", "keyval")),
    defaultGetStoreFunc
  );
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function add_css$1(target) {
  append_styles(
    target,
    "svelte-4qi5da",
    ".user-preference-modal.svelte-4qi5da{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);z-index:100;width:400px;height:300px;background-color:whitesmoke;padding:40px}"
  );
}
function create_fragment$1(ctx) {
  let div5,
    div1,
    h2,
    t1,
    div0,
    t3,
    div4,
    div3,
    h3,
    t5,
    div2,
    input,
    t6,
    button,
    mounted,
    dispose;
  return {
    c() {
      (div5 = element("div")),
        (div1 = element("div")),
        (h2 = element("h2")),
        (h2.textContent = "偏好设置"),
        (t1 = space()),
        (div0 = element("div")),
        (div0.textContent = "×"),
        (t3 = space()),
        (div4 = element("div")),
        (div3 = element("div")),
        (h3 = element("h3")),
        (h3.textContent = "屏蔽用户发言"),
        (t5 = space()),
        (div2 = element("div")),
        (input = element("input")),
        (t6 = space()),
        (button = element("button")),
        (button.textContent = "保存"),
        attr(div0, "class", "text-3xl cursor-pointer"),
        attr(div1, "class", "flex justify-between items-center"),
        attr(input, "type", "text"),
        attr(div2, "class", "flex gap-2"),
        attr(div3, "class", "block-users"),
        attr(div4, "class", "user-preference-items"),
        attr(
          div5,
          "class",
          "user-preference-modal bg-gray-100 shadow-2xl rounded-lg svelte-4qi5da"
        ),
        toggle_class(div5, "hidden", !ctx[0]);
    },
    m(target, anchor) {
      insert(target, div5, anchor),
        append(div5, div1),
        append(div1, h2),
        append(div1, t1),
        append(div1, div0),
        append(div5, t3),
        append(div5, div4),
        append(div4, div3),
        append(div3, h3),
        append(div3, t5),
        append(div3, div2),
        append(div2, input),
        set_input_value(input, ctx[1]),
        append(div2, t6),
        append(div2, button),
        mounted ||
          ((dispose = [
            listen(div0, "click", ctx[2]),
            listen(input, "input", ctx[3]),
            listen(button, "click", ctx[4]),
          ]),
          (mounted = !0));
    },
    p(ctx, [dirty]) {
      2 & dirty && input.value !== ctx[1] && set_input_value(input, ctx[1]),
        1 & dirty && toggle_class(div5, "hidden", !ctx[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      detaching && detach(div5), (mounted = !1), run_all(dispose);
    },
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let blockedUsers,
    { open: open } = $$props;
  onMount(async () => {
    $$invalidate(
      1,
      (blockedUsers = [...(await get("blocked-users"))]?.join(" ") || "")
    );
  });
  return (
    ($$self.$$set = ($$props) => {
      "open" in $$props && $$invalidate(0, (open = $$props.open));
    }),
    [
      open,
      blockedUsers,
      () => $$invalidate(0, (open = !1)),
      function () {
        (blockedUsers = this.value), $$invalidate(1, blockedUsers);
      },
      () => {
        !(function (key, value, customStore = defaultGetStore()) {
          customStore(
            "readwrite",
            (store) => (
              store.put(value, key), promisifyRequest(store.transaction)
            )
          );
        })("blocked-users", new Set(blockedUsers.split(" ")));
      },
    ]
  );
}
class Modal extends SvelteComponent {
  constructor(options) {
    super(),
      init(
        this,
        options,
        instance$1,
        create_fragment$1,
        safe_not_equal,
        { open: 0 },
        add_css$1
      );
  }
}
function add_css(target) {
  append_styles(
    target,
    "svelte-w6hddt",
    ".user-preference-button.svelte-w6hddt{position:fixed;right:30px;top:80px;z-index:2;background-color:white}"
  );
}
function create_if_block(ctx) {
  let userpreferencemodal, updating_open, current;
  function userpreferencemodal_open_binding(value) {
    ctx[2](value);
  }
  let userpreferencemodal_props = {};
  return (
    void 0 !== ctx[0] && (userpreferencemodal_props.open = ctx[0]),
    (userpreferencemodal = new Modal({ props: userpreferencemodal_props })),
    binding_callbacks.push(() =>
      (function (component, name, callback) {
        const index = component.$$.props[name];
        void 0 !== index &&
          ((component.$$.bound[index] = callback),
          callback(component.$$.ctx[index]));
      })(userpreferencemodal, "open", userpreferencemodal_open_binding)
    ),
    {
      c() {
        var block;
        (block = userpreferencemodal.$$.fragment) && block.c();
      },
      m(target, anchor) {
        mount_component(userpreferencemodal, target, anchor), (current = !0);
      },
      p(ctx, dirty) {
        const userpreferencemodal_changes = {};
        var fn;
        !updating_open &&
          1 & dirty &&
          ((updating_open = !0),
          (userpreferencemodal_changes.open = ctx[0]),
          (fn = () => (updating_open = !1)),
          flush_callbacks.push(fn)),
          userpreferencemodal.$set(userpreferencemodal_changes);
      },
      i(local) {
        current ||
          (transition_in(userpreferencemodal.$$.fragment, local),
          (current = !0));
      },
      o(local) {
        transition_out(userpreferencemodal.$$.fragment, local), (current = !1);
      },
      d(detaching) {
        destroy_component(userpreferencemodal, detaching);
      },
    }
  );
}
function create_fragment(ctx) {
  let button,
    t1,
    if_block_anchor,
    current,
    mounted,
    dispose,
    if_block = ctx[0] && create_if_block(ctx);
  return {
    c() {
      (button = element("button")),
        (button.textContent = "偏好设置"),
        (t1 = space()),
        if_block && if_block.c(),
        (if_block_anchor = text("")),
        attr(button, "class", "user-preference-button svelte-w6hddt");
    },
    m(target, anchor) {
      insert(target, button, anchor),
        insert(target, t1, anchor),
        if_block && if_block.m(target, anchor),
        insert(target, if_block_anchor, anchor),
        (current = !0),
        mounted ||
          ((dispose = listen(button, "click", ctx[1])), (mounted = !0));
    },
    p(ctx, [dirty]) {
      ctx[0]
        ? if_block
          ? (if_block.p(ctx, dirty), 1 & dirty && transition_in(if_block, 1))
          : ((if_block = create_if_block(ctx)),
            if_block.c(),
            transition_in(if_block, 1),
            if_block.m(if_block_anchor.parentNode, if_block_anchor))
        : if_block &&
          ((outros = { r: 0, c: [], p: outros }),
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          }),
          outros.r || run_all(outros.c),
          (outros = outros.p));
    },
    i(local) {
      current || (transition_in(if_block), (current = !0));
    },
    o(local) {
      transition_out(if_block), (current = !1);
    },
    d(detaching) {
      detaching && detach(button),
        detaching && detach(t1),
        if_block && if_block.d(detaching),
        detaching && detach(if_block_anchor),
        (mounted = !1),
        dispose();
    },
  };
}
function instance($$self, $$props, $$invalidate) {
  let open = !1;
  return [
    open,
    () => $$invalidate(0, (open = !0)),
    function (value) {
      (open = value), $$invalidate(0, open);
    },
  ];
}
class UserPreference$1 extends SvelteComponent {
  constructor(options) {
    super(),
      init(
        this,
        options,
        instance,
        create_fragment,
        safe_not_equal,
        {},
        add_css
      );
  }
}
class BasicError extends Error {
  constructor(message) {
    super(`[yacu] ${message}`);
  }
}
const emitter = (() => {
  const emitter = {
    all: (n = n || new Map()),
    on: function (t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    },
    off: function (t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    },
    emit: function (t, e) {
      var i = n.get(t);
      i &&
        i.slice().map(function (n) {
          n(e);
        }),
        (i = n.get("*")) &&
          i.slice().map(function (n) {
            n(t, e);
          });
    },
  };
  var n;
  return emitter.on("*", (...arguments_) => console.log(arguments_)), emitter;
})();
class ReactInteropError extends BasicError {
  constructor(message) {
    super(message), (this.name = "ReactInteropError");
  }
}
function renderToNewElement(component, properties) {
  const element = (function ({ className: className, id: id } = {}) {
    const element = document.createElement("div");
    return (
      className && (element.className = className),
      id && (element.id = id),
      element
    );
  })();
  return new component({ target: element, props: properties }), element;
}
class AwardInfoStats {
  constructor() {
    _defineProperty(this, "pending", !1),
      emitter.on("after-url-change", ({ to: to }) => {
        to?.startsWith("/topic/") && this.activate();
      });
  }
  async activate() {
    this.pending = !0;
    const cancel = (function (selector, callback) {
      let start,
        canceled = !1,
        elapsed = 0;
      const processedElements = new WeakSet();
      return (
        requestAnimationFrame(function step(timestamp) {
          const elements = document.querySelectorAll(selector);
          for (const element of elements.values())
            processedElements.has(element) ||
              (console.log(element),
              callback(element),
              processedElements.add(element));
          canceled ||
            (timestamp &&
              (void 0 === start && (start = timestamp),
              (elapsed = timestamp - start)),
            elapsed < 1e4
              ? requestAnimationFrame(step)
              : setTimeout(step, 5e3));
        }),
        () => {
          canceled = !0;
        }
      );
    })(".awardInfo", (element) => this._activate(element));
    emitter.on("before-url-change", () => cancel());
  }
  _activate(element) {
    const r = (function (element) {
        const [, instance] =
          Object.entries(element).find(([name]) =>
            name.startsWith("__reactInternalInstance")
          ) ?? [];
        if (!instance) throw new ReactInteropError("未发现 React 实例");
        return (function (instance) {
          let parent = instance.return;
          for (; "string" == typeof parent.type; ) parent = parent.return;
          return parent;
        })(instance).stateNode;
      })(element),
      accumulator = {};
    for (const award of r.props.awardInfo)
      accumulator[award.content]
        ? accumulator[award.content]++
        : (accumulator[award.content] = 1);
    const stats = Object.entries(accumulator),
      statsElement = renderToNewElement(AwardInfoStats$1, { stats: stats });
    element.prepend(statsElement), (this.pending = !1);
  }
}
const beforeRequestHooks = [],
  afterResponseHooks = [];
function addAfterResponseHooks(hook) {
  afterResponseHooks.push(async (request, response) => {
    if (!hook.url.some((regex) => regex.test(request.url))) return;
    const oldData = await response.json(),
      newData = hook.process(oldData);
    if (Array.isArray(oldData) && Array.isArray(newData)) {
      const count = oldData.length - newData.length;
      0 === count
        ? console.log("没有内容需要过滤")
        : console.log(`过滤了${count}条内容`);
    }
    return new Response(JSON.stringify(newData), response);
  });
}
class BlockUserTopic {
  constructor() {
    _defineProperty(this, "blockedUsers", void 0);
    const newTopics = new RegExp("^https://api.cc98.org/topic/new?"),
      topicPosts = new RegExp("^https://api.cc98.org/Topic/\\d+/post?");
    this.getBlockedUsers().then(() => {
      addAfterResponseHooks({
        url: [newTopics],
        process: (topics) =>
          topics.filter(
            (topic) =>
              null === topic.userName || !this.blockedUsers?.has(topic.userName)
          ),
      }),
        addAfterResponseHooks({
          url: [topicPosts],
          process: (posts) =>
            posts.filter(
              (post) =>
                null === post.userName || !this.blockedUsers?.has(post.userName)
            ),
        });
    });
  }
  async getBlockedUsers() {
    this.blockedUsers = await get("blocked-users");
  }
}
class UserPreference {
  constructor() {
    const element = renderToNewElement(UserPreference$1);
    document.body.append(element);
  }
}
const defaultOptions = {
    apiBase: ["https://math.vercel.app", "https://math.now.sh"],
    color: "black",
  },
  getPostsRequestRegExp = /post\/\d+\/original$/,
  putPostRequestRegExp = /post\/\d+$/,
  newPostRequestRegExp = /topic\/\d+\/post$/,
  newTopicRequestRegExp = /board\/\d+\/topic$/,
  texImageURLRegExp =
    /(?<=\n|^)( *(?:> *)*)<center>\s*!\[.*?]\((.+?)\)\s*<\/center>|!\[.*?]\((.+?)\)/g,
  texInlineRegExp = /\$(\S|(?:\S.*?\S))\$/g,
  blockquoteAwareTexBlockRegExp =
    /(?<=^|\n)( *(?:> *)*)\${2}((?:\n\1[^\n$]+)+)\n\1\${2}(?=\n|$)/g;
function standardizeColor(string_) {
  const context = document.createElement("canvas").getContext("2d");
  return (context.fillStyle = string_), context.fillStyle;
}
class MarkdownMath {
  constructor() {
    var hook;
    addAfterResponseHooks({
      url: [getPostsRequestRegExp],
      process: (post) => (
        1 === post.contentType &&
          (post.content = (function (
            content,
            { apiBase: apiBase = defaultOptions.apiBase } = defaultOptions
          ) {
            return content.replace(
              texImageURLRegExp,
              function (match, indent, blockURLString, inlineURLString) {
                const url = new URL(blockURLString || inlineURLString);
                if (apiBase.includes(url.origin)) {
                  const searchParameters = url.searchParams;
                  return searchParameters.has("from")
                    ? ["$$", searchParameters.get("from").trim(), "$$"]
                        .join("\n")
                        .replace(/(?<=^|\n)/g, indent)
                    : searchParameters.has("inline")
                    ? `$${searchParameters.get("inline")}$`
                    : match;
                }
                return match;
              }
            );
          })(post.content)),
        post
      ),
    }),
      (hook = {
        url: [
          putPostRequestRegExp,
          newPostRequestRegExp,
          newTopicRequestRegExp,
        ],
        process: (post) => (
          1 === post.contentType &&
            (post.content = (function (
              content,
              {
                apiBase: apiBase = defaultOptions.apiBase,
                color: color = defaultOptions.color,
                alternateColor: alternateColor = defaultOptions.alternateColor,
              } = defaultOptions
            ) {
              function isInsideCodeFence(quoteLayers, precedingLines) {
                for (let index = quoteLayers; index >= 0; --index) {
                  let backtickDelimiterCount = 0,
                    tildeDelimiterCount = 0;
                  for (const line of precedingLines.reverse()) {
                    const matchResult = line.match(
                      new RegExp(String.raw`^ *(?:> *){${index}}(\`\`\`|~~~)?`)
                    );
                    if (null === matchResult) break;
                    if (void 0 !== matchResult[1])
                      switch (matchResult[1]) {
                        case "```":
                          ++backtickDelimiterCount;
                          break;
                        case "~~~":
                          ++tildeDelimiterCount;
                      }
                  }
                  if (
                    backtickDelimiterCount % 2 == 1 ||
                    tildeDelimiterCount % 2 == 1
                  )
                    return !0;
                }
                return !1;
              }
              return content
                .replace(
                  blockquoteAwareTexBlockRegExp,
                  function (match, quote, quotedTex, offset, string) {
                    const precedingString = string.slice(0, offset);
                    if (
                      isInsideCodeFence(
                        (quote.match(/>/g) || []).length,
                        precedingString.replace(/\n$/, "").split("\n")
                      )
                    )
                      return match;
                    const url = new URL(apiBase[0]),
                      searchParameters = url.searchParams;
                    return (
                      searchParameters.set(
                        "from",
                        quotedTex.replaceAll(quote, "").trim()
                      ),
                      void 0 !== color &&
                        searchParameters.set("color", standardizeColor(color)),
                      void 0 !== alternateColor &&
                        searchParameters.set("alternateColor", alternateColor),
                      `${quote}<center>![](${url.href})</center>`
                    );
                  }
                )
                .replace(
                  texInlineRegExp,
                  function (match, tex, offset, string) {
                    const precedingString = string.slice(0, offset),
                      precedingLines = precedingString.split("\n"),
                      currentLine = precedingLines.pop();
                    if (
                      (precedingString.split("\n").pop().match(/`/g) || [])
                        .length %
                        2 ==
                      1
                    )
                      return match;
                    if (
                      isInsideCodeFence(
                        (
                          currentLine.match(/^( *(?:> *)*)/)[0].match(/>/g) ||
                          []
                        ).length,
                        precedingLines
                      )
                    )
                      return match;
                    const url = new URL(apiBase[0]),
                      searchParameters = url.searchParams;
                    return (
                      searchParameters.set("inline", tex),
                      void 0 !== color &&
                        searchParameters.set("color", standardizeColor(color)),
                      void 0 !== alternateColor &&
                        searchParameters.set("alternateColor", alternateColor),
                      `![](${url.href})`
                    );
                  }
                );
            })(post.content)),
          post
        ),
      }),
      beforeRequestHooks.push(async (request, options) => {
        if (!hook.url.some((regex) => regex.test(request.url))) return;
        let oldData;
        options.body && (oldData = JSON.parse(options.body));
        const newData = hook.process(oldData);
        return new Request(request, { body: JSON.stringify(newData) });
      });
  }
}
const changeStates = ["pushState", "replaceState"];
for (const c of [AwardInfoStats, BlockUserTopic, UserPreference, MarkdownMath])
  new c();
for (const f of [
  function () {
    emitter.emit("after-url-change", { to: window.location.pathname });
    for (const changeState of changeStates)
      window.History.prototype[changeState] = new Proxy(
        window.History.prototype[changeState],
        {
          apply: (target, thisArgument, arguments_) => {
            const url = arguments_[2],
              from = window.location.pathname,
              to = url ? String(url) : void 0;
            emitter.emit("before-url-change", { from: from, to: to }),
              Reflect.apply(target, thisArgument, arguments_),
              setTimeout(() =>
                emitter.emit("after-url-change", { from: from, to: to })
              );
          },
        }
      );
  },
  function () {
    var hooks;
    (hooks = {
      beforeRequest: beforeRequestHooks,
      afterResponse: afterResponseHooks,
    }),
      (window.fetch = new Proxy(window.fetch, {
        async apply(target, thisArgument, arguments_) {
          const [input, init] = arguments_;
          let request = new Request(input, init);
          for (const preProcess of hooks.beforeRequest) {
            const temporary = await preProcess(request, init);
            if (temporary instanceof Response) return temporary;
            if (temporary instanceof Request) {
              request = temporary;
              break;
            }
          }
          let response = await Reflect.apply(target, thisArgument, [request]);
          for (const postProcess of hooks.afterResponse) {
            const temporary = await postProcess(request, response.clone());
            temporary instanceof Response && (response = temporary);
          }
          return response;
        },
      }));
  },
])
  f();
