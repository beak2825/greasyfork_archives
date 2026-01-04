// ==UserScript==
// @name         学习通/MOOC等 隐藏答案 Hide Answer
// @namespace    https://github.com/lcandy2/user.js/tree/main/generics/hide-answer
// @version      2.3.2
// @author       甜檸Cirtron (lcandy2)
// @description  添加一个切换答案按钮，点击可显示/隐藏答案
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @homepage     https://greasyfork.org/scripts/469779
// @homepageURL  https://greasyfork.org/scripts/469779
// @match        *://mooc1.chaoxing.com/mooc*
// @match        *://mooc1.chaoxing.com/exam*
// @require      https://registry.npmmirror.com/vue/3.4.27/files/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @downloadURL https://update.greasyfork.org/scripts/469779/%E5%AD%A6%E4%B9%A0%E9%80%9AMOOC%E7%AD%89%20%E9%9A%90%E8%97%8F%E7%AD%94%E6%A1%88%20Hide%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/469779/%E5%AD%A6%E4%B9%A0%E9%80%9AMOOC%E7%AD%89%20%E9%9A%90%E8%97%8F%E7%AD%94%E6%A1%88%20Hide%20Answer.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const chaoxingMooc = "mooc1.chaoxing.com/mooc";
  const chaoxingExam = "mooc1.chaoxing.com/exam";
  const UrlDetection = () => {
    const url = window.location.href;
    if (url.includes(chaoxingMooc) || url.includes(chaoxingExam)) {
      if (url.includes("work/view") || url.includes("test/reVersionPaperMarkContentNew")) {
        return "chaoxing-mooc";
      }
    }
  };
  var oe = "M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M11,15H13V17H11V15M11,7H13V13H11V7", ae = "M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16", re = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z", ne = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", ie = "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z";
  const le = {
    transform: "rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1))"
  }, E = {
    fill: "currentColor"
  }, z = {
    mdi: {
      size: 24,
      viewbox: "0 0 24 24"
    },
    "simple-icons": {
      size: 24,
      viewbox: "0 0 24 24"
    },
    default: {
      size: 0,
      viewbox: "0 0 0 0"
    }
  }, N = {
    name: "icon",
    props: {
      type: {
        type: String,
        default: "mdi"
      },
      faIcon: {
        type: Object,
        default: null
      },
      path: {
        type: [String, Object, Array]
      },
      size: {
        type: [Number, String],
        default: 24
      },
      viewbox: String,
      flip: {
        type: String,
        validator: (t) => ["horizontal", "vertical", "both"].includes(t)
      },
      rotate: {
        type: [Number, String],
        default: 0
      }
    },
    setup(t) {
      if (!t.path && !t.faIcon)
        return console.warn("vue3-icon requires either a 'path' or an 'fa-icon' property"), () => vue.h("div");
      const s = vue.computed(() => {
        var d;
        return ((d = t.faIcon) == null ? void 0 : d.prefix) || t.type;
      }), o = vue.computed(() => parseInt(t.rotate, 10)), e = vue.computed(() => z[s.value] || z.default), r = vue.computed(() => parseInt(t.size, 10) || e.value.size), i = vue.computed(() => t.faIcon ? `0 0 ${t.faIcon.icon[0]} ${t.faIcon.icon[1]}` : false), l = vue.computed(() => i.value || t.viewbox || e.value.viewbox), f = vue.computed(() => ({
        ...le,
        "--sx": ["both", "horizontal"].includes(t.flip) ? "-1" : "1",
        "--sy": ["both", "vertical"].includes(t.flip) ? "-1" : "1",
        "--r": isNaN(o.value) ? o.value : o.value + "deg"
      })), m = vue.computed(() => {
        var d;
        return t.faIcon ? (d = t.faIcon) == null ? void 0 : d.icon[4] : t.type === "simple-icons" && typeof t.path == "object" ? t.path.path : t.path;
      }), p = vue.computed(() => s.value === "fad" ? (console.warn("vue3-icon does not currently support Duotone FontAwesome icons"), vue.h("path")) : Array.isArray(t.path) ? vue.h(
        "g",
        { style: { ...E } },
        t.path.map((d) => typeof d == "string" ? vue.h("path", { d }) : vue.h("path", { ...d }))
      ) : vue.h("path", { d: m.value, style: { ...E } }));
      return () => vue.h(
        "svg",
        {
          style: f.value,
          class: ["vue3-icon"],
          width: r.value,
          height: r.value,
          viewBox: l.value
        },
        [p.value]
      );
    }
  }, ue = { class: "vue3-snackbar-message-wrapper" }, ce = {
    key: 0,
    class: "vue3-snackbar-message-icon"
  }, de = { class: "vue3-snackbar-message-content" }, fe = {
    key: 0,
    class: "vue3-snackbar-message-badge"
  }, me = { class: "vue3-snackbar-message-title" }, pe = {
    key: 0,
    class: "vue3-snackbar-message-additional"
  }, ge = /* @__PURE__ */ vue.createElementVNode("div", { class: "spacer" }, null, -1), ve = { class: "vue3-snackbar-message-close" }, be = {
    __name: "Vue3SnackbarMessage",
    props: {
      borderClass: {
        type: String,
        default: ""
      },
      message: {
        type: Object,
        default: () => ({})
      },
      messageClass: {
        type: String,
        default: ""
      },
      dense: {
        type: Boolean,
        default: false
      }
    },
    emits: ["dismiss"],
    setup(t, { emit: s }) {
      const o = s, e = t;
      let r = null, i = null, l = vue.ref(false);
      const f = () => {
        const a = !e.message.duration && !e.message.dismissible ? 4e3 : e.message.duration;
        r = setTimeout(p, a);
      };
      vue.onMounted(() => {
        f();
      }), vue.watch(
        () => e.message.count,
        (a) => {
          if (a === 1)
            return false;
          clearTimeout(r), clearTimeout(i), i = setTimeout(() => {
            l.value = false;
          }, 1e3), l.value = true, f();
        }
      );
      const m = () => {
        r && clearTimeout(r), p();
      }, p = () => {
        o("dismiss", e.message);
      }, d = {
        success: {
          path: re
        },
        info: {
          path: ie
        },
        warning: {
          path: ae
        },
        error: {
          path: oe
        }
      }, n = vue.computed(() => {
        const a = d[e.message.type];
        return a ? (a.type = "mdi", a) : e.message.icon && typeof e.message.icon == "object" ? e.message.icon : {
          path: "",
          type: "default"
        };
      });
      return (a, u) => (vue.openBlock(), vue.createElementBlock("article", {
        class: vue.normalizeClass(["vue3-snackbar-message", [
          e.message.type || "custom",
          e.messageClass,
          e.borderClass,
          {
            "has-background": e.message.background,
            "has-border": e.borderClass,
            "is-dense": e.dense,
            "shake-baby-shake": vue.unref(l)
          }
        ]]),
        style: vue.normalizeStyle({
          "--message-background": e.message.background,
          "--message-text-color": e.message.textColor,
          "--message-icon-color": e.message.iconColor
        })
      }, [
        vue.renderSlot(a.$slots, "message-inner", {
          message: e.message
        }, () => [
          vue.createElementVNode("div", ue, [
            n.value ? (vue.openBlock(), vue.createElementBlock("div", ce, [
              vue.renderSlot(a.$slots, "message-icon", {
                message: e.message,
                icon: n.value
              }, () => [
                vue.createVNode(vue.unref(N), vue.mergeProps(n.value, { role: "img" }), null, 16)
              ])
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", de, [
              vue.renderSlot(a.$slots, "message-badge", {
                message: e.message,
                count: e.message.count
              }, () => [
                e.message.count > 1 ? (vue.openBlock(), vue.createElementBlock("div", fe, vue.toDisplayString(e.message.count), 1)) : vue.createCommentVNode("", true)
              ]),
              vue.renderSlot(a.$slots, "message-content", {
                message: e.message,
                title: e.message.title,
                text: e.message.text
              }, () => [
                vue.createElementVNode("div", me, vue.toDisplayString(e.message.title || e.message.text), 1),
                e.message.title && e.message.text ? (vue.openBlock(), vue.createElementBlock("div", pe, vue.toDisplayString(e.message.text), 1)) : vue.createCommentVNode("", true)
              ])
            ]),
            ge,
            vue.createElementVNode("div", ve, [
              vue.renderSlot(a.$slots, "message-close-icon", {
                message: e.message,
                isDimissible: e.message.dismissible,
                isDismissible: e.message.dismissible,
                dismiss: m
              }, () => [
                e.message.dismissible !== false ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  onClick: m
                }, [
                  vue.createVNode(vue.unref(N), {
                    type: "mdi",
                    path: vue.unref(ne)
                  }, null, 8, ["path"])
                ])) : vue.createCommentVNode("", true)
              ])
            ])
          ])
        ])
      ], 6));
    }
  }, ye = typeof window < "u" ? HTMLElement : Object, he = {
    /* ******************************************
     * LOCATION PROPS
     ****************************************** */
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    /* ******************************************
     * COLOUR PROPS
     ****************************************** */
    success: {
      type: String,
      default: "#4caf50"
    },
    error: {
      type: String,
      default: "#ff5252"
    },
    warning: {
      type: String,
      default: "#fb8c00"
    },
    info: {
      type: String,
      default: "#2196f3"
    },
    messageTextColor: {
      type: String,
      default: "#fff"
    },
    messageIconColor: {
      type: String,
      default: "currentColor"
    },
    /* ******************************************
     * OTHER PROPS
     ****************************************** */
    attach: {
      type: [String, ye],
      default: "body"
    },
    border: {
      type: String,
      default: "",
      validator: (t) => ["top", "bottom", "left", "right", ""].includes(t)
    },
    backgroundOpacity: {
      type: [String, Number],
      default: 0.12,
      validator: (t) => !isNaN(parseFloat(t)) && isFinite(t)
    },
    backgroundColor: {
      type: String,
      default: "currentColor"
    },
    baseBackgroundColor: {
      type: String,
      default: "#fff"
    },
    duration: {
      type: [Number, String],
      default: null
    },
    messageClass: {
      type: String
    },
    zIndex: {
      type: Number,
      default: 1e4
    },
    dense: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    },
    groups: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    }
  };
  function Se(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  var V = { exports: {} };
  function B() {
  }
  B.prototype = {
    on: function(t, s, o) {
      var e = this.e || (this.e = {});
      return (e[t] || (e[t] = [])).push({
        fn: s,
        ctx: o
      }), this;
    },
    once: function(t, s, o) {
      var e = this;
      function r() {
        e.off(t, r), s.apply(o, arguments);
      }
      return r._ = s, this.on(t, r, o);
    },
    emit: function(t) {
      var s = [].slice.call(arguments, 1), o = ((this.e || (this.e = {}))[t] || []).slice(), e = 0, r = o.length;
      for (e; e < r; e++)
        o[e].fn.apply(o[e].ctx, s);
      return this;
    },
    off: function(t, s) {
      var o = this.e || (this.e = {}), e = o[t], r = [];
      if (e && s)
        for (var i = 0, l = e.length; i < l; i++)
          e[i].fn !== s && e[i].fn._ !== s && r.push(e[i]);
      return r.length ? o[t] = r : delete o[t], this;
    }
  };
  V.exports = B;
  V.exports.TinyEmitter = B;
  var ke = V.exports, Ce = ke, we = new Ce();
  const _ = /* @__PURE__ */ Se(we), C = {
    $on: (...t) => _.on(...t),
    $once: (...t) => _.once(...t),
    $off: (...t) => _.off(...t),
    $emit: (...t) => _.emit(...t)
  }, b = vue.ref([]), W = Symbol();
  function Ee() {
    const t = vue.inject(W);
    if (!t)
      throw new Error("No Snackbar provided!");
    return t;
  }
  const ze = {
    install: (t, s = {}) => {
      const { disableGlobals: o = false } = s, e = {
        add: (r) => {
          C.$emit("add", r);
        },
        clear: () => {
          C.$emit("clear");
        }
      };
      o !== true && (t.config.globalProperties.$snackbar = e, typeof window < "u" && (window.$snackbar = e)), t.provide(W, e);
    }
  };
  function _e(t) {
    return vue.getCurrentScope() ? (vue.onScopeDispose(t), true) : false;
  }
  function P(t) {
    return typeof t == "function" ? t() : vue.unref(t);
  }
  const Z = typeof window < "u" && typeof document < "u";
  typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
  const Me = (t) => t != null;
  function Le(t) {
    return vue.getCurrentInstance();
  }
  function $e(t, s = true, o) {
    Le() ? vue.onMounted(t, o) : s ? t() : vue.nextTick(t);
  }
  function xe(t) {
    var s;
    const o = P(t);
    return (s = o == null ? void 0 : o.$el) != null ? s : o;
  }
  const Ve = Z ? window : void 0, Be = Z ? window.document : void 0;
  function Oe() {
    const t = vue.ref(false), s = vue.getCurrentInstance();
    return s && vue.onMounted(() => {
      t.value = true;
    }, s), t;
  }
  function Te(t) {
    const s = Oe();
    return vue.computed(() => (s.value, !!t()));
  }
  function Ae(t, s, o = {}) {
    const { window: e = Ve, ...r } = o;
    let i;
    const l = Te(() => e && "MutationObserver" in e), f = () => {
      i && (i.disconnect(), i = void 0);
    }, m = vue.computed(() => {
      const a = P(t), u = (Array.isArray(a) ? a : [a]).map(xe).filter(Me);
      return new Set(u);
    }), p = vue.watch(
      () => m.value,
      (a) => {
        f(), l.value && a.size && (i = new MutationObserver(s), a.forEach((u) => i.observe(u, r)));
      },
      { immediate: true, flush: "post" }
    ), d = () => i == null ? void 0 : i.takeRecords(), n = () => {
      f(), p();
    };
    return _e(n), {
      isSupported: l,
      stop: n,
      takeRecords: d
    };
  }
  function He(t = {}) {
    const {
      document: s = Be,
      selector: o = "html",
      observe: e = false,
      initialValue: r = "ltr"
    } = t;
    function i() {
      var f, m;
      return (m = (f = s == null ? void 0 : s.querySelector(o)) == null ? void 0 : f.getAttribute("dir")) != null ? m : r;
    }
    const l = vue.ref(i());
    return $e(() => l.value = i()), e && s && Ae(
      s.querySelector(o),
      () => l.value = i(),
      { attributes: true }
    ), vue.computed({
      get() {
        return l.value;
      },
      set(f) {
        var m, p;
        l.value = f, s && (l.value ? (m = s.querySelector(o)) == null || m.setAttribute("dir", l.value) : (p = s.querySelector(o)) == null || p.removeAttribute("dir"));
      }
    });
  }
  const Ne = {
    __name: "Vue3Snackbar",
    props: { ...he },
    emits: ["added", "dismissed", "removed", "cleared"],
    setup(t, { emit: s }) {
      const o = He(), e = t, r = s, i = vue.computed(() => ({
        "is-top": e.top,
        "is-bottom": e.top === false && e.bottom,
        "is-left": e.left,
        "is-right": e.left === false && e.right,
        "is-middle": e.top === false && e.bottom === false,
        "is-centre": e.left === false && e.right === false,
        "has-shadow": e.shadow,
        "is-rtl": o.value === "rtl"
      })), l = vue.computed(() => ({
        "--success-colour": e.success,
        "--error-colour": e.error,
        "--warning-colour": e.warning,
        "--info-colour": e.info,
        "--snackbar-zindex": e.zIndex,
        "--background-opacity": e.backgroundOpacity,
        "--background-color": e.backgroundColor,
        "--base-background-color": e.baseBackgroundColor,
        "--message-text-color": e.messageTextColor,
        "--message-icon-color": e.messageIconColor
      })), f = vue.computed(() => e.border ? `border-${e.border}` : ""), m = (n) => Math.abs(n.split("").reduce((a, u) => (a << 5) - a + u.charCodeAt(0) | 0, 0));
      let p = 1;
      C.$on("add", (n) => {
        r("added", n), n.group || (n.group = m(`${n.type}${n.title}${n.text}`).toString(16)), e.duration && !n.duration && n.duration !== 0 && (n.duration = +e.duration);
        const a = n.group && b.value.find((u) => u.group === n.group);
        if (e.groups === false || !a) {
          const u = {
            ...n,
            id: p,
            count: 1
          };
          e.reverse ? b.value.unshift(u) : b.value.push(u), p++;
        } else
          a.count++;
      }), C.$on("clear", () => {
        r("cleared"), b.value = [];
      }), vue.onUnmounted(() => {
        C.$off("add"), C.$off("clear");
      });
      const d = (n, a = false) => {
        r(a ? "dismissed" : "removed", n), b.value = b.value.filter((u) => u.id !== n.id);
      };
      return (n, a) => (vue.openBlock(), vue.createBlock(vue.Teleport, {
        to: e.attach
      }, [
        vue.createElementVNode("section", {
          id: "vue3-snackbar--container",
          class: vue.normalizeClass([[i.value], "vue3-snackbar"]),
          style: vue.normalizeStyle(l.value)
        }, [
          vue.createVNode(vue.TransitionGroup, {
            name: "vue3-snackbar-message",
            tag: "div"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(b), (u) => (vue.openBlock(), vue.createBlock(be, {
                key: u.id,
                message: u,
                "message-class": e.messageClass,
                dense: e.dense,
                "border-class": f.value,
                onDismiss: a[0] || (a[0] = (O) => d(O, true))
              }, vue.createSlots({ _: 2 }, [
                vue.renderList(n.$slots, (O, T) => ({
                  name: T,
                  fn: vue.withCtx((R) => [
                    vue.renderSlot(n.$slots, T, vue.mergeProps({ ref_for: true }, R))
                  ])
                }))
              ]), 1032, ["message", "message-class", "dense", "border-class"]))), 128))
            ]),
            _: 3
          })
        ], 6)
      ], 8, ["to"]));
    }
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "chaoxing-mooc",
    setup(__props) {
      const snackbar = Ee();
      const elements = Array.from(
        document.getElementsByClassName("mark_answer")
      );
      const isHide = vue.ref(false);
      const toggleHide = () => {
        const value = isHide.value;
        snackbar.clear();
        snackbar.add({
          type: value ? "info" : "success",
          title: value ? "答案已显示" : "答案已隐藏",
          text: '你还可以按下 "H" 键来切换答案的显示状态。'
        });
        elements.forEach((element) => {
          element.style.visibility = isHide.value ? "visible" : "hidden";
        });
        isHide.value = !isHide.value;
      };
      const keydownHandler = (event) => {
        if (event.key === "h" || event.key === "H") {
          toggleHide();
        }
      };
      vue.onMounted(() => {
        window.addEventListener("keydown", keydownHandler);
      });
      vue.onUnmounted(() => {
        window.removeEventListener("keydown", keydownHandler);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("a", {
            href: "javascript:;",
            onClick: toggleHide,
            class: "fl",
            tabindex: "0",
            role: "button"
          }, vue.toDisplayString(isHide.value ? "显示答案 (H)" : "隐藏答案 (H)"), 1),
          vue.createVNode(vue.unref(Ne), {
            top: "",
            duration: 0,
            border: "left",
            shadow: "",
            dense: "",
            reverse: ""
          })
        ], 64);
      };
    }
  });
  const appendChaoxingMoocButton = () => {
    const app = vue.createApp(_sfc_main);
    app.use(ze);
    const targetElement = document.querySelector(".subNav");
    if (targetElement) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.zhimg.com/vue3-snackbar@2.2.2/dist/style.css";
      document.head.appendChild(css);
      const toggleButton = document.createElement("div");
      toggleButton.className = "sub-button fr";
      toggleButton.id = "submitFocus";
      toggleButton.setAttribute("tabIndex", "-1");
      targetElement.appendChild(toggleButton);
      app.mount(toggleButton);
    }
  };
  const urlDetection = UrlDetection();
  if (urlDetection === "chaoxing-mooc") {
    appendChaoxingMoocButton();
  }

})(Vue);