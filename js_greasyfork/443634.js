// ==UserScript==
// @name            Vue生产环境（production） Devtools 调试
// @namespace       https://github.com/xcr1234/vue-devtools-production
// @version         2.1.0
// @description     使用本脚本支持直接调试生产环境的Vue项目 完美支持Vue2、Vue3！
// @homepage        https://github.com/xcr1234/vue-devtools-production
// @icon            data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAbpJREFUOE+lkz9IG2EYxp/3Eo1GHWzFDqFKLQ6CIGpLS9GSQzGniw5OLTg6CCLO5kT86FpolnR3kFYXJ+9o2u9EcPEPEdqp4qKlbbaihpxw98n3JUqMqYp+03s87/P7/jzvEe656J5+KIC+ymwQBmR99OGnYgoh1rethdeyfjY4tg6gR9Z1U615HfTFMeIDCtC38u6RH/L/yPo0/S/lrmX6VRfRKAEBIcQn+Vn5on4j9LLhlQL43mNnaO7w4grR1XlGRHEpHn/c3xWu1wHgBwANQBtVaPu1E09bCuAEj8Wn1B7Fb6Bb7ARA2Pud28l+Pugq1sIjke+B5nA7gBw3zOpz7RIgarNREliSYnb5IOX9yqmraA2hzZq3Tc/Vjj4mvg2ZybIA9aAW4wCivutnjpN7NUSk1Y4/yVJ18CGANDfMzuKTXYlRt+e7IWhLNrk8w4WPYFVfY28+GejOoOlcCyjEmgBhsmRGFrlhvimdm7KDFLPmHpwikAEQyBvI01yKfB2e+XsrgDqFzaYh8L5gmOWGyUrNV2IsbdAtlgYQ5IYp4yu7rv0XojYbkQAnZi7fCfA/040p3MZ43nMG7TKHEfrJ20kAAAAASUVORK5CYII=
// @include         *
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/443634/Vue%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%EF%BC%88production%EF%BC%89%20Devtools%20%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/443634/Vue%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%EF%BC%88production%EF%BC%89%20Devtools%20%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==
const v = (e, t) => {
  let o = Object.getPrototypeOf(t).constructor;
  for (; o.super; )
    o = o.super;
  if (!o.config.devtools && (o.config.devtools = !0, e.emit("init", o), console.log(`vue devtools for [${o.version}] already open !!!`), t.$store)) {
    const n = t.$store;
    n._devtoolHook = e, e.emit("vuex:init", n), e.on("vuex:travel-to-state", (s) => {
      n.replaceState(s);
    }), n.subscribe((s, a) => {
      e.emit("vuex:mutation", s, a);
    });
  }
};
/**
* @vue/shared v3.4.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const N = (e) => typeof e == "symbol";
/**
* @vue/reactivity v3.4.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(N)
);
function E(e) {
  const t = e && e.__v_raw;
  return t ? E(t) : e;
}
function C() {
  return I().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function I() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : {};
}
const R = typeof Proxy == "function", U = "devtools-plugin:setup", D = "plugin:settings:set";
let _, h;
function G() {
  var e;
  return _ !== void 0 || (typeof window < "u" && window.performance ? (_ = !0, h = window.performance) : typeof globalThis < "u" && (!((e = globalThis.perf_hooks) === null || e === void 0) && e.performance) ? (_ = !0, h = globalThis.perf_hooks.performance) : _ = !1), _;
}
function F() {
  return G() ? h.now() : Date.now();
}
class M {
  constructor(t, o) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = o;
    const n = {};
    if (t.settings)
      for (const i in t.settings) {
        const r = t.settings[i];
        n[i] = r.defaultValue;
      }
    const s = `__vue-devtools-plugin-settings__${t.id}`;
    let a = Object.assign({}, n);
    try {
      const i = localStorage.getItem(s), r = JSON.parse(i);
      Object.assign(a, r);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return a;
      },
      setSettings(i) {
        try {
          localStorage.setItem(s, JSON.stringify(i));
        } catch {
        }
        a = i;
      },
      now() {
        return F();
      }
    }, o && o.on(D, (i, r) => {
      i === this.plugin.id && this.fallbacks.setSettings(r);
    }), this.proxiedOn = new Proxy({}, {
      get: (i, r) => this.target ? this.target.on[r] : (...c) => {
        this.onQueue.push({
          method: r,
          args: c
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (i, r) => this.target ? this.target[r] : r === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(r) ? (...c) => (this.targetQueue.push({
        method: r,
        args: c,
        resolve: () => {
        }
      }), this.fallbacks[r](...c)) : (...c) => new Promise((u) => {
        this.targetQueue.push({
          method: r,
          args: c,
          resolve: u
        });
      })
    });
  }
  async setRealTarget(t) {
    this.target = t;
    for (const o of this.onQueue)
      this.target.on[o.method](...o.args);
    for (const o of this.targetQueue)
      o.resolve(await this.target[o.method](...o.args));
  }
}
function H(e, t) {
  const o = e, n = I(), s = C(), a = R && o.enableEarlyProxy;
  if (s && (n.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !a))
    s.emit(U, e, t);
  else {
    const i = a ? new M(o, s) : null;
    (n.__VUE_DEVTOOLS_PLUGINS__ = n.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: o,
      setupFn: t,
      proxy: i
    }), i && t(i.proxiedTarget);
  }
}
/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
var b;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(b || (b = {}));
const J = typeof window < "u";
const O = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function B(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\uFEFF", e], { type: e.type }) : e;
}
function S(e, t, o) {
  const n = new XMLHttpRequest();
  n.open("GET", e), n.responseType = "blob", n.onload = function() {
    x(n.response, t, o);
  }, n.onerror = function() {
    console.error("could not download file");
  }, n.send();
}
function L(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function g(e) {
  try {
    e.dispatchEvent(new MouseEvent("click"));
  } catch {
    const o = document.createEvent("MouseEvents");
    o.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(o);
  }
}
const m = typeof navigator == "object" ? navigator : { userAgent: "" }, P = /Macintosh/.test(m.userAgent) && /AppleWebKit/.test(m.userAgent) && !/Safari/.test(m.userAgent), x = J ? (
  // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
  typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !P ? Q : (
    // Use msSaveOrOpenBlob as a second approach
    "msSaveOrOpenBlob" in m ? K : (
      // Fallback to using FileReader and a popup
      Y
    )
  )
) : () => {
};
function Q(e, t = "download", o) {
  const n = document.createElement("a");
  n.download = t, n.rel = "noopener", typeof e == "string" ? (n.href = e, n.origin !== location.origin ? L(n.href) ? S(e, t, o) : (n.target = "_blank", g(n)) : g(n)) : (n.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(n.href);
  }, 4e4), setTimeout(function() {
    g(n);
  }, 0));
}
function K(e, t = "download", o) {
  if (typeof e == "string")
    if (L(e))
      S(e, t, o);
    else {
      const n = document.createElement("a");
      n.href = e, n.target = "_blank", setTimeout(function() {
        g(n);
      });
    }
  else
    navigator.msSaveOrOpenBlob(B(e, o), t);
}
function Y(e, t, o, n) {
  if (n = n || open("", "_blank"), n && (n.document.title = n.document.body.innerText = "downloading..."), typeof e == "string")
    return S(e, t, o);
  const s = e.type === "application/octet-stream", a = /constructor/i.test(String(O.HTMLElement)) || "safari" in O, i = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((i || s && a || P) && typeof FileReader < "u") {
    const r = new FileReader();
    r.onloadend = function() {
      let c = r.result;
      if (typeof c != "string")
        throw n = null, new Error("Wrong reader.result type");
      c = i ? c : c.replace(/^data:[^;]*;/, "data:attachment/file;"), n ? n.location.href = c : location.assign(c), n = null;
    }, r.readAsDataURL(e);
  } else {
    const r = URL.createObjectURL(e);
    n ? n.location.assign(r) : location.href = r, n = null, setTimeout(function() {
      URL.revokeObjectURL(r);
    }, 4e4);
  }
}
function l(e, t) {
  const o = "🍍 " + e;
  typeof __VUE_DEVTOOLS_TOAST__ == "function" ? __VUE_DEVTOOLS_TOAST__(o, t) : t === "error" ? console.error(o) : t === "warn" ? console.warn(o) : console.log(o);
}
function w(e) {
  return "_a" in e && "install" in e;
}
function A() {
  if (!("clipboard" in navigator))
    return l("Your browser doesn't support the Clipboard API", "error"), !0;
}
function $(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (l('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function z(e) {
  if (!A())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), l("Global state copied to clipboard.");
    } catch (t) {
      if ($(t))
        return;
      l("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function W(e) {
  if (!A())
    try {
      k(e, JSON.parse(await navigator.clipboard.readText())), l("Global state pasted from clipboard.");
    } catch (t) {
      if ($(t))
        return;
      l("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function q(e) {
  try {
    x(new Blob([JSON.stringify(e.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (t) {
    l("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let f;
function X() {
  f || (f = document.createElement("input"), f.type = "file", f.accept = ".json");
  function e() {
    return new Promise((t, o) => {
      f.onchange = async () => {
        const n = f.files;
        if (!n)
          return t(null);
        const s = n.item(0);
        return t(s ? { text: await s.text(), file: s } : null);
      }, f.oncancel = () => t(null), f.onerror = o, f.click();
    });
  }
  return e;
}
async function Z(e) {
  try {
    const o = await X()();
    if (!o)
      return;
    const { text: n, file: s } = o;
    k(e, JSON.parse(n)), l(`Global state imported from "${s.name}".`);
  } catch (t) {
    l("Failed to import the state from JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function k(e, t) {
  for (const o in t) {
    const n = e.state.value[o];
    n ? Object.assign(n, t[o]) : e.state.value[o] = t[o];
  }
}
const j = "🍍 Pinia (root)", p = "_root";
function ee(e) {
  return w(e) ? {
    id: p,
    label: j
  } : {
    id: e.$id,
    label: e.$id
  };
}
function te(e) {
  if (w(e)) {
    const o = Array.from(e._s.keys()), n = e._s;
    return {
      state: o.map((a) => ({
        editable: !0,
        key: a,
        value: e.state.value[a]
      })),
      getters: o.filter((a) => n.get(a)._getters).map((a) => {
        const i = n.get(a);
        return {
          editable: !1,
          key: a,
          value: i._getters.reduce((r, c) => (r[c] = i[c], r), {})
        };
      })
    };
  }
  const t = {
    state: Object.keys(e.$state).map((o) => ({
      editable: !0,
      key: o,
      value: e.$state[o]
    }))
  };
  return e._getters && e._getters.length && (t.getters = e._getters.map((o) => ({
    editable: !1,
    key: o,
    value: e[o]
  }))), e._customProperties.size && (t.customProperties = Array.from(e._customProperties).map((o) => ({
    editable: !0,
    key: o,
    value: e[o]
  }))), t;
}
const ne = [], oe = "pinia:mutations", d = "pinia", y = (e) => "🍍 " + e;
function re(e, t) {
  H({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: ne,
    app: e
  }, (o) => {
    typeof o.now != "function" && l("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), o.addTimelineLayer({
      id: oe,
      label: "Pinia 🍍",
      color: 15064968
    }), o.addInspector({
      id: d,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            z(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await W(t), o.sendInspectorTree(d), o.sendInspectorState(d);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            q(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await Z(t), o.sendInspectorTree(d), o.sendInspectorState(d);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: 'Reset the state (with "$reset")',
          action: (n) => {
            const s = t._s.get(n);
            s ? typeof s.$reset != "function" ? l(`Cannot reset "${n}" store because it doesn't have a "$reset" method implemented.`, "warn") : (s.$reset(), l(`Store "${n}" reset.`)) : l(`Cannot reset "${n}" store because it wasn't found.`, "warn");
          }
        }
      ]
    }), o.on.inspectComponent((n, s) => {
      const a = n.componentInstance && n.componentInstance.proxy;
      if (a && a._pStores) {
        const i = n.componentInstance.proxy._pStores;
        Object.values(i).forEach((r) => {
          n.instanceData.state.push({
            type: y(r.$id),
            key: "state",
            editable: !0,
            value: r._isOptionsAPI ? {
              _custom: {
                value: E(r.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => r.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(r.$state).reduce((c, u) => (c[u] = r.$state[u], c), {})
            )
          }), r._getters && r._getters.length && n.instanceData.state.push({
            type: y(r.$id),
            key: "getters",
            editable: !1,
            value: r._getters.reduce((c, u) => {
              try {
                c[u] = r[u];
              } catch (V) {
                c[u] = V;
              }
              return c;
            }, {})
          });
        });
      }
    }), o.on.getInspectorTree((n) => {
      if (n.app === e && n.inspectorId === d) {
        let s = [t];
        s = s.concat(Array.from(t._s.values())), n.rootNodes = (n.filter ? s.filter((a) => "$id" in a ? a.$id.toLowerCase().includes(n.filter.toLowerCase()) : j.toLowerCase().includes(n.filter.toLowerCase())) : s).map(ee);
      }
    }), o.on.getInspectorState((n) => {
      if (n.app === e && n.inspectorId === d) {
        const s = n.nodeId === p ? t : t._s.get(n.nodeId);
        if (!s)
          return;
        s && (n.state = te(s));
      }
    }), o.on.editInspectorState((n, s) => {
      if (n.app === e && n.inspectorId === d) {
        const a = n.nodeId === p ? t : t._s.get(n.nodeId);
        if (!a)
          return l(`store "${n.nodeId}" not found`, "error");
        const { path: i } = n;
        w(a) ? i.unshift("state") : (i.length !== 1 || !a._customProperties.has(i[0]) || i[0] in a.$state) && i.unshift("$state"), n.set(a, i, n.state.value);
      }
    }), o.on.editComponentState((n) => {
      if (n.type.startsWith("🍍")) {
        const s = n.type.replace(/^🍍\s*/, ""), a = t._s.get(s);
        if (!a)
          return l(`store "${s}" not found`, "error");
        const { path: i } = n;
        if (i[0] !== "state")
          return l(`Invalid path for store "${s}":
${i}
Only state can be modified.`);
        i[0] = "$state", n.set(a, i, n.state.value);
      }
    });
  });
}
const se = (e) => {
  e.includes("-alpha.") && (e = e.split("-alpha.")[0]);
  const [t, o] = e.split(".").map(Number);
  return t > 3 || t === 3 && o >= 3;
}, T = (e, t) => {
  if (t.config.devtools)
    return;
  t.config.devtools = !0, se(t.version) ? e.emit("app:init", t, t.version, {
    Fragment: Symbol.for("v-fgt"),
    Text: Symbol.for("v-txt"),
    Comment: Symbol.for("v-cmt"),
    Static: Symbol.for("v-stc")
  }) : e.emit("app:init", t, t.version, {
    Fragment: Symbol.for("Fragment"),
    Text: Symbol.for("Text"),
    Comment: Symbol.for("Comment"),
    Static: Symbol.for("Static")
  }), console.log(`vue devtools for [${t.version}] already open !!!`);
  const o = t.unmount.bind(t);
  t.unmount = () => {
    e.emit("app:unmount", t), o();
  }, t.config.globalProperties.$store && console.warn("vuex for vue3 not support. please use pinia");
  const n = t.config.globalProperties.$pinia;
  n && re(t, n);
}, ie = () => {
  if (self != top)
    return;
  const e = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  if (!e) {
    console.warn("No Vue devtools found , Please install it first: "), console.warn("see https://github.com/vuejs/vue-devtools");
    return;
  }
  const t = window.app;
  if (!t)
    return;
  if (t.__vue__) {
    v(e, t.__vue__);
    return;
  }
  if (t.__vue_app__) {
    T(e, t.__vue_app__);
    return;
  }
  new MutationObserver((n, s) => {
    const a = s.disconnect.bind(s);
    for (const i of n) {
      const r = i.target;
      r.__vue__ ? (v(e, r.__vue__), a()) : r.__vue_app__ && (T(e, r.__vue_app__), a());
    }
  }).observe(document.documentElement, {
    attributes: !0,
    subtree: !0,
    childList: !0
  });
};
ie();
