// ==UserScript==
// @name         rrweb-player
// @name:zh      web录屏回放
// @namespace    dagger/rrweb-player
// @version      0.0.2
// @author       superhu
// @description  rrweb播放器
// @license      MIT
// @icon         https://rc-saas.fenqile.com/img/logo.483042e4.png
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @downloadURL https://update.greasyfork.org/scripts/470634/rrweb-player.user.js
// @updateURL https://update.greasyfork.org/scripts/470634/rrweb-player.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(' .replayer-wrapper{position:relative}.replayer-mouse{position:absolute;width:20px;height:20px;transition:left .05s linear,top .05s linear;background-size:contain;background-position:50%;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMwMCIgd2lkdGg9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLW5hbWU9IkxheWVyIDEiIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTQ4LjcxIDQyLjkxTDM0LjA4IDI4LjI5IDQ0LjMzIDE4YTEgMSAwIDAwLS4zMy0xLjYxTDIuMzUgMS4wNmExIDEgMCAwMC0xLjI5IDEuMjlMMTYuMzkgNDRhMSAxIDAgMDAxLjY1LjM2bDEwLjI1LTEwLjI4IDE0LjYyIDE0LjYzYTEgMSAwIDAwMS40MSAwbDQuMzgtNC4zOGExIDEgMCAwMC4wMS0xLjQyem0tNS4wOSAzLjY3TDI5IDMyYTEgMSAwIDAwLTEuNDEgMGwtOS44NSA5Ljg1TDMuNjkgMy42OWwzOC4xMiAxNEwzMiAyNy41OEExIDEgMCAwMDMyIDI5bDE0LjU5IDE0LjYyeiIvPjwvc3ZnPg==);border-color:transparent}.replayer-mouse:after{content:"";display:inline-block;width:20px;height:20px;background:#4950f6;border-radius:100%;transform:translate(-50%,-50%);opacity:.3}.replayer-mouse.active:after{animation:click .2s ease-in-out 1}.replayer-mouse.touch-device{background-image:none;width:70px;height:70px;border-radius:100%;margin-left:-37px;margin-top:-37px;border:4px solid rgba(73,80,246,0);transition:left 0s linear,top 0s linear,border-color .2s ease-in-out}.replayer-mouse.touch-device.touch-active{border-color:#4950f6;transition:left .25s linear,top .25s linear,border-color .2s ease-in-out}.replayer-mouse.touch-device:after{opacity:0}.replayer-mouse.touch-device.active:after{animation:touch-click .2s ease-in-out 1}.replayer-mouse-tail{position:absolute;pointer-events:none}@keyframes click{0%{opacity:.3;width:20px;height:20px}50%{opacity:.5;width:10px;height:10px}}@keyframes touch-click{0%{opacity:0;width:20px;height:20px}50%{opacity:.5;width:10px;height:10px}}.rr-player{position:relative;background:white;float:left;border-radius:5px;box-shadow:0 24px 48px #11103e1f}.rr-player__frame{overflow:hidden}.replayer-wrapper{float:left;clear:both;transform-origin:top left;left:50%;top:50%}.replayer-wrapper>iframe{border:none}.rr-controller.svelte-19ke1iv.svelte-19ke1iv{width:100%;height:80px;background:#fff;display:flex;flex-direction:column;justify-content:space-around;align-items:center;border-radius:0 0 5px 5px}.rr-timeline.svelte-19ke1iv.svelte-19ke1iv{width:80%;display:flex;align-items:center}.rr-timeline__time.svelte-19ke1iv.svelte-19ke1iv{display:inline-block;width:100px;text-align:center;color:#11103e}.rr-progress.svelte-19ke1iv.svelte-19ke1iv{flex:1;height:12px;background:#eee;position:relative;border-radius:3px;cursor:pointer;box-sizing:border-box;border-top:solid 4px #fff;border-bottom:solid 4px #fff}.rr-progress.disabled.svelte-19ke1iv.svelte-19ke1iv{cursor:not-allowed}.rr-progress__step.svelte-19ke1iv.svelte-19ke1iv{height:100%;position:absolute;left:0;top:0;background:#e0e1fe}.rr-progress__handler.svelte-19ke1iv.svelte-19ke1iv{width:20px;height:20px;border-radius:10px;position:absolute;top:2px;transform:translate(-50%,-50%);background:rgb(73,80,246)}.rr-controller__btns.svelte-19ke1iv.svelte-19ke1iv{display:flex;align-items:center;justify-content:center;font-size:13px}.rr-controller__btns.svelte-19ke1iv button.svelte-19ke1iv{width:32px;height:32px;display:flex;padding:0;align-items:center;justify-content:center;background:none;border:none;border-radius:50%;cursor:pointer}.rr-controller__btns.svelte-19ke1iv button.svelte-19ke1iv:active{background:#e0e1fe}.rr-controller__btns.svelte-19ke1iv button.active.svelte-19ke1iv{color:#fff;background:rgb(73,80,246)}.rr-controller__btns.svelte-19ke1iv button.svelte-19ke1iv:disabled{cursor:not-allowed}.switch.svelte-9brlez.svelte-9brlez.svelte-9brlez{height:1em;display:flex;align-items:center}.switch.disabled.svelte-9brlez.svelte-9brlez.svelte-9brlez{opacity:.5}.label.svelte-9brlez.svelte-9brlez.svelte-9brlez{margin:0 8px}.switch.svelte-9brlez input[type=checkbox].svelte-9brlez.svelte-9brlez{position:absolute;opacity:0}.switch.svelte-9brlez label.svelte-9brlez.svelte-9brlez{width:2em;height:1em;position:relative;cursor:pointer;display:block}.switch.disabled.svelte-9brlez label.svelte-9brlez.svelte-9brlez{cursor:not-allowed}.switch.svelte-9brlez label.svelte-9brlez.svelte-9brlez:before{content:"";position:absolute;width:2em;height:1em;left:.1em;transition:background .1s ease;background:rgba(73,80,246,.5);border-radius:50px}.switch.svelte-9brlez label.svelte-9brlez.svelte-9brlez:after{content:"";position:absolute;width:1em;height:1em;border-radius:50px;left:0;transition:all .2s ease;box-shadow:0 2px 5px #0000004d;background:#fcfff4;animation:switch-off .2s ease-out;z-index:2}.switch.svelte-9brlez input[type=checkbox].svelte-9brlez:checked+label.svelte-9brlez:before{background:rgb(73,80,246)}.switch.svelte-9brlez input[type=checkbox].svelte-9brlez:checked+label.svelte-9brlez:after{animation:switch-on .2s ease-out;left:1.1em}#replayer[data-v-a472cbb1]{position:fixed;z-index:99999;top:50px;left:20%}.warp[data-v-a472cbb1]{position:fixed;bottom:20px;right:20px;z-index:99999;box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;transition:color .3s}.rr-button[data-v-a472cbb1]{position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;background-image:none;border:1px solid transparent;cursor:pointer;transition:all .3s cubic-bezier(.645,.045,.355,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:manipulation;min-height:35px;padding:4px 15px;font-size:14px;border-radius:3px;color:#fff;background:#4f77e8;border-color:#4f77e8;text-shadow:0 -1px 0 rgb(0 0 0 / 12%);box-shadow:0 2px #0000000d} ');

(function (vue) {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-3161df91.js"(exports, module) {
      function e() {
      }
      function t(e2, t2) {
        for (const n2 in t2)
          e2[n2] = t2[n2];
        return e2;
      }
      function n(e2) {
        return e2();
      }
      function i$1() {
        return /* @__PURE__ */ Object.create(null);
      }
      function o(e2) {
        e2.forEach(n);
      }
      function r(e2) {
        return "function" == typeof e2;
      }
      function s(e2, t2) {
        return e2 != e2 ? t2 == t2 : e2 !== t2 || e2 && "object" == typeof e2 || "function" == typeof e2;
      }
      function a(e2) {
        const t2 = {};
        for (const n2 in e2)
          "$" !== n2[0] && (t2[n2] = e2[n2]);
        return t2;
      }
      function l(e2, t2) {
        e2.appendChild(t2);
      }
      function c(e2, t2, n2) {
        e2.insertBefore(t2, n2 || null);
      }
      function d(e2) {
        e2.parentNode.removeChild(e2);
      }
      function u(e2, t2) {
        for (let n2 = 0; n2 < e2.length; n2 += 1)
          e2[n2] && e2[n2].d(t2);
      }
      function h(e2) {
        return document.createElement(e2);
      }
      function p(e2) {
        return document.createElementNS("http://www.w3.org/2000/svg", e2);
      }
      function g(e2) {
        return document.createTextNode(e2);
      }
      function m() {
        return g(" ");
      }
      function f(e2, t2, n2, i2) {
        return e2.addEventListener(t2, n2, i2), () => e2.removeEventListener(t2, n2, i2);
      }
      function y(e2, t2, n2) {
        null == n2 ? e2.removeAttribute(t2) : e2.getAttribute(t2) !== n2 && e2.setAttribute(t2, n2);
      }
      function v(e2, t2) {
        t2 = "" + t2, e2.wholeText !== t2 && (e2.data = t2);
      }
      function C(e2, t2, n2, i2) {
        null === n2 ? e2.style.removeProperty(t2) : e2.style.setProperty(t2, n2, i2 ? "important" : "");
      }
      function I(e2, t2, n2) {
        e2.classList[n2 ? "add" : "remove"](t2);
      }
      let A;
      function b(e2) {
        A = e2;
      }
      function w() {
        if (!A)
          throw new Error("Function called outside component initialization");
        return A;
      }
      function N(e2) {
        w().$$.on_mount.push(e2);
      }
      function E(e2) {
        w().$$.on_destroy.push(e2);
      }
      function S() {
        const e2 = w();
        return (t2, n2, { cancelable: i2 = false } = {}) => {
          const o2 = e2.$$.callbacks[t2];
          if (o2) {
            const r2 = function(e3, t3, { bubbles: n3 = false, cancelable: i3 = false } = {}) {
              const o3 = document.createEvent("CustomEvent");
              return o3.initCustomEvent(e3, n3, i3, t3), o3;
            }(t2, n2, { cancelable: i2 });
            return o2.slice().forEach((t3) => {
              t3.call(e2, r2);
            }), !r2.defaultPrevented;
          }
          return true;
        };
      }
      const T = [], D = [], M = [], R = [], x$1 = Promise.resolve();
      let k = false;
      function F(e2) {
        M.push(e2);
      }
      const O = /* @__PURE__ */ new Set();
      let B = 0;
      function L() {
        const e2 = A;
        do {
          for (; B < T.length; ) {
            const e3 = T[B];
            B++, b(e3), V(e3.$$);
          }
          for (b(null), T.length = 0, B = 0; D.length; )
            D.pop()();
          for (let e3 = 0; e3 < M.length; e3 += 1) {
            const t2 = M[e3];
            O.has(t2) || (O.add(t2), t2());
          }
          M.length = 0;
        } while (T.length);
        for (; R.length; )
          R.pop()();
        k = false, O.clear(), b(e2);
      }
      function V(e2) {
        if (null !== e2.fragment) {
          e2.update(), o(e2.before_update);
          const t2 = e2.dirty;
          e2.dirty = [-1], e2.fragment && e2.fragment.p(e2.ctx, t2), e2.after_update.forEach(F);
        }
      }
      const _ = /* @__PURE__ */ new Set();
      let G;
      function W() {
        G = { r: 0, c: [], p: G };
      }
      function U() {
        G.r || o(G.c), G = G.p;
      }
      function Z(e2, t2) {
        e2 && e2.i && (_.delete(e2), e2.i(t2));
      }
      function $(e2, t2, n2, i2) {
        if (e2 && e2.o) {
          if (_.has(e2))
            return;
          _.add(e2), G.c.push(() => {
            _.delete(e2), i2 && (n2 && e2.d(1), i2());
          }), e2.o(t2);
        } else
          i2 && i2();
      }
      function K(e2) {
        e2 && e2.c();
      }
      function Y(e2, t2, i2, s2) {
        const { fragment: a2, on_mount: l2, on_destroy: c2, after_update: d2 } = e2.$$;
        a2 && a2.m(t2, i2), s2 || F(() => {
          const t3 = l2.map(n).filter(r);
          c2 ? c2.push(...t3) : o(t3), e2.$$.on_mount = [];
        }), d2.forEach(F);
      }
      function P(e2, t2) {
        const n2 = e2.$$;
        null !== n2.fragment && (o(n2.on_destroy), n2.fragment && n2.fragment.d(t2), n2.on_destroy = n2.fragment = null, n2.ctx = []);
      }
      function Q(e2, t2) {
        -1 === e2.$$.dirty[0] && (T.push(e2), k || (k = true, x$1.then(L)), e2.$$.dirty.fill(0)), e2.$$.dirty[t2 / 31 | 0] |= 1 << t2 % 31;
      }
      function z(t2, n2, r2, s2, a2, l2, c2, u2 = [-1]) {
        const h2 = A;
        b(t2);
        const p2 = t2.$$ = { fragment: null, ctx: null, props: l2, update: e, not_equal: a2, bound: i$1(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(n2.context || (h2 ? h2.$$.context : [])), callbacks: i$1(), dirty: u2, skip_bound: false, root: n2.target || h2.$$.root };
        c2 && c2(p2.root);
        let g2 = false;
        if (p2.ctx = r2 ? r2(t2, n2.props || {}, (e2, n3, ...i2) => {
          const o2 = i2.length ? i2[0] : n3;
          return p2.ctx && a2(p2.ctx[e2], p2.ctx[e2] = o2) && (!p2.skip_bound && p2.bound[e2] && p2.bound[e2](o2), g2 && Q(t2, e2)), n3;
        }) : [], p2.update(), g2 = true, o(p2.before_update), p2.fragment = !!s2 && s2(p2.ctx), n2.target) {
          if (n2.hydrate) {
            const e2 = function(e3) {
              return Array.from(e3.childNodes);
            }(n2.target);
            p2.fragment && p2.fragment.l(e2), e2.forEach(d);
          } else
            p2.fragment && p2.fragment.c();
          n2.intro && Z(t2.$$.fragment), Y(t2, n2.target, n2.anchor, n2.customElement), L();
        }
        b(h2);
      }
      class J {
        $destroy() {
          P(this, 1), this.$destroy = e;
        }
        $on(e2, t2) {
          const n2 = this.$$.callbacks[e2] || (this.$$.callbacks[e2] = []);
          return n2.push(t2), () => {
            const e3 = n2.indexOf(t2);
            -1 !== e3 && n2.splice(e3, 1);
          };
        }
        $set(e2) {
          var t2;
          this.$$set && (t2 = e2, 0 !== Object.keys(t2).length) && (this.$$.skip_bound = true, this.$$set(e2), this.$$.skip_bound = false);
        }
      }
      var X;
      function H(e2) {
        return e2.nodeType === e2.ELEMENT_NODE;
      }
      !function(e2) {
        e2[e2.Document = 0] = "Document", e2[e2.DocumentType = 1] = "DocumentType", e2[e2.Element = 2] = "Element", e2[e2.Text = 3] = "Text", e2[e2.CDATA = 4] = "CDATA", e2[e2.Comment = 5] = "Comment";
      }(X || (X = {}));
      var j = function() {
        function e2() {
          this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        return e2.prototype.getId = function(e3) {
          var t2;
          if (!e3)
            return -1;
          var n2 = null === (t2 = this.getMeta(e3)) || void 0 === t2 ? void 0 : t2.id;
          return null != n2 ? n2 : -1;
        }, e2.prototype.getNode = function(e3) {
          return this.idNodeMap.get(e3) || null;
        }, e2.prototype.getIds = function() {
          return Array.from(this.idNodeMap.keys());
        }, e2.prototype.getMeta = function(e3) {
          return this.nodeMetaMap.get(e3) || null;
        }, e2.prototype.removeNodeFromMap = function(e3) {
          var t2 = this, n2 = this.getId(e3);
          this.idNodeMap.delete(n2), e3.childNodes && e3.childNodes.forEach(function(e4) {
            return t2.removeNodeFromMap(e4);
          });
        }, e2.prototype.has = function(e3) {
          return this.idNodeMap.has(e3);
        }, e2.prototype.hasNode = function(e3) {
          return this.nodeMetaMap.has(e3);
        }, e2.prototype.add = function(e3, t2) {
          var n2 = t2.id;
          this.idNodeMap.set(n2, e3), this.nodeMetaMap.set(e3, t2);
        }, e2.prototype.replace = function(e3, t2) {
          var n2 = this.getNode(e3);
          if (n2) {
            var i2 = this.nodeMetaMap.get(n2);
            i2 && this.nodeMetaMap.set(t2, i2);
          }
          this.idNodeMap.set(e3, t2);
        }, e2.prototype.reset = function() {
          this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }, e2;
      }();
      function q() {
        return new j();
      }
      var ee = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
      function te(e2, t2) {
        void 0 === t2 && (t2 = {});
        var n2 = 1, i2 = 1;
        function o2(e3) {
          var t3 = e3.match(/\n/g);
          t3 && (n2 += t3.length);
          var o3 = e3.lastIndexOf("\n");
          i2 = -1 === o3 ? i2 + e3.length : e3.length - o3;
        }
        function r2() {
          var e3 = { line: n2, column: i2 };
          return function(t3) {
            return t3.position = new s2(e3), p2(), t3;
          };
        }
        var s2 = function(e3) {
          this.start = e3, this.end = { line: n2, column: i2 }, this.source = t2.source;
        };
        s2.prototype.content = e2;
        var a2 = [];
        function l2(o3) {
          var r3 = new Error("".concat(t2.source || "", ":").concat(n2, ":").concat(i2, ": ").concat(o3));
          if (r3.reason = o3, r3.filename = t2.source, r3.line = n2, r3.column = i2, r3.source = e2, !t2.silent)
            throw r3;
          a2.push(r3);
        }
        function c2() {
          return h2(/^{\s*/);
        }
        function d2() {
          return h2(/^}/);
        }
        function u2() {
          var t3, n3 = [];
          for (p2(), g2(n3); e2.length && "}" !== e2.charAt(0) && (t3 = E2() || S2()); )
            false !== t3 && (n3.push(t3), g2(n3));
          return n3;
        }
        function h2(t3) {
          var n3 = t3.exec(e2);
          if (n3) {
            var i3 = n3[0];
            return o2(i3), e2 = e2.slice(i3.length), n3;
          }
        }
        function p2() {
          h2(/^\s*/);
        }
        function g2(e3) {
          var t3;
          for (void 0 === e3 && (e3 = []); t3 = m2(); )
            false !== t3 && e3.push(t3), t3 = m2();
          return e3;
        }
        function m2() {
          var t3 = r2();
          if ("/" === e2.charAt(0) && "*" === e2.charAt(1)) {
            for (var n3 = 2; "" !== e2.charAt(n3) && ("*" !== e2.charAt(n3) || "/" !== e2.charAt(n3 + 1)); )
              ++n3;
            if (n3 += 2, "" === e2.charAt(n3 - 1))
              return l2("End of comment missing");
            var s3 = e2.slice(2, n3 - 2);
            return i2 += 2, o2(s3), e2 = e2.slice(n3), i2 += 2, t3({ type: "comment", comment: s3 });
          }
        }
        function f2() {
          var e3 = h2(/^([^{]+)/);
          if (e3)
            return ne(e3[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(e4) {
              return e4.replace(/,/g, "‌");
            }).split(/\s*(?![^(]*\)),\s*/).map(function(e4) {
              return e4.replace(/\u200C/g, ",");
            });
        }
        function y2() {
          var e3 = r2(), t3 = h2(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
          if (t3) {
            var n3 = ne(t3[0]);
            if (!h2(/^:\s*/))
              return l2("property missing ':'");
            var i3 = h2(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/), o3 = e3({ type: "declaration", property: n3.replace(ee, ""), value: i3 ? ne(i3[0]).replace(ee, "") : "" });
            return h2(/^[;\s]*/), o3;
          }
        }
        function v2() {
          var e3, t3 = [];
          if (!c2())
            return l2("missing '{'");
          for (g2(t3); e3 = y2(); )
            false !== e3 && (t3.push(e3), g2(t3)), e3 = y2();
          return d2() ? t3 : l2("missing '}'");
        }
        function C2() {
          for (var e3, t3 = [], n3 = r2(); e3 = h2(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/); )
            t3.push(e3[1]), h2(/^,\s*/);
          if (t3.length)
            return n3({ type: "keyframe", values: t3, declarations: v2() });
        }
        var I2, A2 = N2("import"), b2 = N2("charset"), w2 = N2("namespace");
        function N2(e3) {
          var t3 = new RegExp("^@" + e3 + "\\s*([^;]+);");
          return function() {
            var n3 = r2(), i3 = h2(t3);
            if (i3) {
              var o3 = { type: e3 };
              return o3[e3] = i3[1].trim(), n3(o3);
            }
          };
        }
        function E2() {
          if ("@" === e2[0])
            return function() {
              var e3 = r2(), t3 = h2(/^@([-\w]+)?keyframes\s*/);
              if (t3) {
                var n3 = t3[1];
                if (!(t3 = h2(/^([-\w]+)\s*/)))
                  return l2("@keyframes missing name");
                var i3, o3 = t3[1];
                if (!c2())
                  return l2("@keyframes missing '{'");
                for (var s3 = g2(); i3 = C2(); )
                  s3.push(i3), s3 = s3.concat(g2());
                return d2() ? e3({ type: "keyframes", name: o3, vendor: n3, keyframes: s3 }) : l2("@keyframes missing '}'");
              }
            }() || function() {
              var e3 = r2(), t3 = h2(/^@media *([^{]+)/);
              if (t3) {
                var n3 = ne(t3[1]);
                if (!c2())
                  return l2("@media missing '{'");
                var i3 = g2().concat(u2());
                return d2() ? e3({ type: "media", media: n3, rules: i3 }) : l2("@media missing '}'");
              }
            }() || function() {
              var e3 = r2(), t3 = h2(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
              if (t3)
                return e3({ type: "custom-media", name: ne(t3[1]), media: ne(t3[2]) });
            }() || function() {
              var e3 = r2(), t3 = h2(/^@supports *([^{]+)/);
              if (t3) {
                var n3 = ne(t3[1]);
                if (!c2())
                  return l2("@supports missing '{'");
                var i3 = g2().concat(u2());
                return d2() ? e3({ type: "supports", supports: n3, rules: i3 }) : l2("@supports missing '}'");
              }
            }() || A2() || b2() || w2() || function() {
              var e3 = r2(), t3 = h2(/^@([-\w]+)?document *([^{]+)/);
              if (t3) {
                var n3 = ne(t3[1]), i3 = ne(t3[2]);
                if (!c2())
                  return l2("@document missing '{'");
                var o3 = g2().concat(u2());
                return d2() ? e3({ type: "document", document: i3, vendor: n3, rules: o3 }) : l2("@document missing '}'");
              }
            }() || function() {
              var e3 = r2();
              if (h2(/^@page */)) {
                var t3 = f2() || [];
                if (!c2())
                  return l2("@page missing '{'");
                for (var n3, i3 = g2(); n3 = y2(); )
                  i3.push(n3), i3 = i3.concat(g2());
                return d2() ? e3({ type: "page", selectors: t3, declarations: i3 }) : l2("@page missing '}'");
              }
            }() || function() {
              var e3 = r2();
              if (h2(/^@host\s*/)) {
                if (!c2())
                  return l2("@host missing '{'");
                var t3 = g2().concat(u2());
                return d2() ? e3({ type: "host", rules: t3 }) : l2("@host missing '}'");
              }
            }() || function() {
              var e3 = r2();
              if (h2(/^@font-face\s*/)) {
                if (!c2())
                  return l2("@font-face missing '{'");
                for (var t3, n3 = g2(); t3 = y2(); )
                  n3.push(t3), n3 = n3.concat(g2());
                return d2() ? e3({ type: "font-face", declarations: n3 }) : l2("@font-face missing '}'");
              }
            }();
        }
        function S2() {
          var e3 = r2(), t3 = f2();
          return t3 ? (g2(), e3({ type: "rule", selectors: t3, declarations: v2() })) : l2("selector missing");
        }
        return ie((I2 = u2(), { type: "stylesheet", stylesheet: { source: t2.source, rules: I2, parsingErrors: a2 } }));
      }
      function ne(e2) {
        return e2 ? e2.replace(/^\s+|\s+$/g, "") : "";
      }
      function ie(e2, t2) {
        for (var n2 = e2 && "string" == typeof e2.type, i2 = n2 ? e2 : t2, o2 = 0, r2 = Object.keys(e2); o2 < r2.length; o2++) {
          var s2 = e2[r2[o2]];
          Array.isArray(s2) ? s2.forEach(function(e3) {
            ie(e3, i2);
          }) : s2 && "object" == typeof s2 && ie(s2, i2);
        }
        return n2 && Object.defineProperty(e2, "parent", { configurable: true, writable: true, enumerable: false, value: t2 || null }), e2;
      }
      var oe = { script: "noscript", altglyph: "altGlyph", altglyphdef: "altGlyphDef", altglyphitem: "altGlyphItem", animatecolor: "animateColor", animatemotion: "animateMotion", animatetransform: "animateTransform", clippath: "clipPath", feblend: "feBlend", fecolormatrix: "feColorMatrix", fecomponenttransfer: "feComponentTransfer", fecomposite: "feComposite", feconvolvematrix: "feConvolveMatrix", fediffuselighting: "feDiffuseLighting", fedisplacementmap: "feDisplacementMap", fedistantlight: "feDistantLight", fedropshadow: "feDropShadow", feflood: "feFlood", fefunca: "feFuncA", fefuncb: "feFuncB", fefuncg: "feFuncG", fefuncr: "feFuncR", fegaussianblur: "feGaussianBlur", feimage: "feImage", femerge: "feMerge", femergenode: "feMergeNode", femorphology: "feMorphology", feoffset: "feOffset", fepointlight: "fePointLight", fespecularlighting: "feSpecularLighting", fespotlight: "feSpotLight", fetile: "feTile", feturbulence: "feTurbulence", foreignobject: "foreignObject", glyphref: "glyphRef", lineargradient: "linearGradient", radialgradient: "radialGradient" };
      var re = /([^\\]):hover/, se = new RegExp(re.source, "g");
      function ae(e2, t2) {
        var n2 = null == t2 ? void 0 : t2.stylesWithHoverClass.get(e2);
        if (n2)
          return n2;
        var i2 = te(e2, { silent: true });
        if (!i2.stylesheet)
          return e2;
        var o2 = [];
        if (i2.stylesheet.rules.forEach(function(e3) {
          "selectors" in e3 && (e3.selectors || []).forEach(function(e4) {
            re.test(e4) && o2.push(e4);
          });
        }), 0 === o2.length)
          return e2;
        var r2 = new RegExp(o2.filter(function(e3, t3) {
          return o2.indexOf(e3) === t3;
        }).sort(function(e3, t3) {
          return t3.length - e3.length;
        }).map(function(e3) {
          return e3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }).join("|"), "g"), s2 = e2.replace(r2, function(e3) {
          var t3 = e3.replace(se, "$1.\\:hover");
          return "".concat(e3, ", ").concat(t3);
        });
        return null == t2 || t2.stylesWithHoverClass.set(e2, s2), s2;
      }
      function le() {
        return { stylesWithHoverClass: /* @__PURE__ */ new Map() };
      }
      function ce(e2, t2) {
        var n2 = t2.doc, i2 = t2.hackCss, o2 = t2.cache;
        switch (e2.type) {
          case X.Document:
            return n2.implementation.createDocument(null, "", null);
          case X.DocumentType:
            return n2.implementation.createDocumentType(e2.name || "html", e2.publicId, e2.systemId);
          case X.Element:
            var r2, s2 = function(e3) {
              var t3 = oe[e3.tagName] ? oe[e3.tagName] : e3.tagName;
              return "link" === t3 && e3.attributes._cssText && (t3 = "style"), t3;
            }(e2);
            r2 = e2.isSVG ? n2.createElementNS("http://www.w3.org/2000/svg", s2) : n2.createElement(s2);
            var a2 = {};
            for (var l2 in e2.attributes)
              if (Object.prototype.hasOwnProperty.call(e2.attributes, l2)) {
                var c2 = e2.attributes[l2];
                if ("option" !== s2 || "selected" !== l2 || false !== c2)
                  if (true === c2 && (c2 = ""), l2.startsWith("rr_"))
                    a2[l2] = c2;
                  else {
                    var d2 = "textarea" === s2 && "value" === l2, u2 = "style" === s2 && "_cssText" === l2;
                    if (u2 && i2 && "string" == typeof c2 && (c2 = ae(c2, o2)), !d2 && !u2 || "string" != typeof c2)
                      try {
                        if (e2.isSVG && "xlink:href" === l2)
                          r2.setAttributeNS("http://www.w3.org/1999/xlink", l2, c2.toString());
                        else if ("onload" === l2 || "onclick" === l2 || "onmouse" === l2.substring(0, 7))
                          r2.setAttribute("_" + l2, c2.toString());
                        else {
                          if ("meta" === s2 && "Content-Security-Policy" === e2.attributes["http-equiv"] && "content" === l2) {
                            r2.setAttribute("csp-content", c2.toString());
                            continue;
                          }
                          "link" === s2 && "preload" === e2.attributes.rel && "script" === e2.attributes.as || "link" === s2 && "prefetch" === e2.attributes.rel && "string" == typeof e2.attributes.href && e2.attributes.href.endsWith(".js") || ("img" === s2 && e2.attributes.srcset && e2.attributes.rr_dataURL ? r2.setAttribute("rrweb-original-srcset", e2.attributes.srcset) : r2.setAttribute(l2, c2.toString()));
                        }
                      } catch (e3) {
                      }
                    else {
                      for (var h2 = n2.createTextNode(c2), p2 = 0, g2 = Array.from(r2.childNodes); p2 < g2.length; p2++) {
                        var m2 = g2[p2];
                        m2.nodeType === r2.TEXT_NODE && r2.removeChild(m2);
                      }
                      r2.appendChild(h2);
                    }
                  }
              }
            var f2 = function(t3) {
              var n3 = a2[t3];
              if ("canvas" === s2 && "rr_dataURL" === t3) {
                var i3 = document.createElement("img");
                i3.onload = function() {
                  var e3 = r2.getContext("2d");
                  e3 && e3.drawImage(i3, 0, 0, i3.width, i3.height);
                }, i3.src = n3.toString(), r2.RRNodeType && (r2.rr_dataURL = n3.toString());
              } else if ("img" === s2 && "rr_dataURL" === t3) {
                var o3 = r2;
                o3.currentSrc.startsWith("data:") || (o3.setAttribute("rrweb-original-src", e2.attributes.src), o3.src = n3.toString());
              }
              if ("rr_width" === t3)
                r2.style.width = n3.toString();
              else if ("rr_height" === t3)
                r2.style.height = n3.toString();
              else if ("rr_mediaCurrentTime" === t3 && "number" == typeof n3)
                r2.currentTime = n3;
              else if ("rr_mediaState" === t3)
                switch (n3) {
                  case "played":
                    r2.play().catch(function(e3) {
                      return console.warn("media playback error", e3);
                    });
                    break;
                  case "paused":
                    r2.pause();
                }
            };
            for (var y2 in a2)
              f2(y2);
            if (e2.isShadowHost)
              if (r2.shadowRoot)
                for (; r2.shadowRoot.firstChild; )
                  r2.shadowRoot.removeChild(r2.shadowRoot.firstChild);
              else
                r2.attachShadow({ mode: "open" });
            return r2;
          case X.Text:
            return n2.createTextNode(e2.isStyle && i2 ? ae(e2.textContent, o2) : e2.textContent);
          case X.CDATA:
            return n2.createCDATASection(e2.textContent);
          case X.Comment:
            return n2.createComment(e2.textContent);
          default:
            return null;
        }
      }
      function de(e2, t2) {
        var n2 = t2.doc, i2 = t2.mirror, o2 = t2.skipChild, r2 = void 0 !== o2 && o2, s2 = t2.hackCss, a2 = void 0 === s2 || s2, l2 = t2.afterAppend, c2 = t2.cache, d2 = ce(e2, { doc: n2, hackCss: a2, cache: c2 });
        if (!d2)
          return null;
        if (e2.rootId && i2.getNode(e2.rootId) !== n2 && i2.replace(e2.rootId, n2), e2.type === X.Document && (n2.close(), n2.open(), "BackCompat" === e2.compatMode && e2.childNodes && e2.childNodes[0].type !== X.DocumentType && (e2.childNodes[0].type === X.Element && "xmlns" in e2.childNodes[0].attributes && "http://www.w3.org/1999/xhtml" === e2.childNodes[0].attributes.xmlns ? n2.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">') : n2.write('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">')), d2 = n2), i2.add(d2, e2), (e2.type === X.Document || e2.type === X.Element) && !r2)
          for (var u2 = 0, h2 = e2.childNodes; u2 < h2.length; u2++) {
            var p2 = h2[u2], g2 = de(p2, { doc: n2, mirror: i2, skipChild: false, hackCss: a2, afterAppend: l2, cache: c2 });
            g2 ? (p2.isShadow && H(d2) && d2.shadowRoot ? d2.shadowRoot.appendChild(g2) : d2.appendChild(g2), l2 && l2(g2, p2.id)) : console.warn("Failed to rebuild", p2);
          }
        return d2;
      }
      function ue(e2, t2) {
        var n2 = t2.doc, i2 = t2.onVisit, o2 = t2.hackCss, r2 = void 0 === o2 || o2, s2 = t2.afterAppend, a2 = t2.cache, l2 = t2.mirror, c2 = void 0 === l2 ? new j() : l2, d2 = de(e2, { doc: n2, mirror: c2, skipChild: false, hackCss: r2, afterAppend: s2, cache: a2 });
        return function(e3, t3) {
          for (var n3 = 0, i3 = e3.getIds(); n3 < i3.length; n3++) {
            var o3 = i3[n3];
            e3.has(o3) && t3(e3.getNode(o3));
          }
        }(c2, function(e3) {
          i2 && i2(e3), function(e4, t3) {
            var n3 = t3.getMeta(e4);
            if ((null == n3 ? void 0 : n3.type) === X.Element) {
              var i3 = e4;
              for (var o3 in n3.attributes)
                if (Object.prototype.hasOwnProperty.call(n3.attributes, o3) && o3.startsWith("rr_")) {
                  var r3 = n3.attributes[o3];
                  "rr_scrollLeft" === o3 && (i3.scrollLeft = r3), "rr_scrollTop" === o3 && (i3.scrollTop = r3);
                }
            }
          }(e3, c2);
        }), d2;
      }
      const he = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
      let pe = { map: {}, getId: () => (console.error(he), -1), getNode: () => (console.error(he), null), removeNodeFromMap() {
        console.error(he);
      }, has: () => (console.error(he), false), reset() {
        console.error(he);
      } };
      function ge(e2) {
        const t2 = {}, n2 = (e3, n3) => {
          const i3 = { value: e3, parent: n3, children: [] };
          return t2[e3.node.id] = i3, i3;
        }, i2 = [];
        for (const o2 of e2) {
          const { nextId: e3, parentId: r2 } = o2;
          if (e3 && e3 in t2) {
            const r3 = t2[e3];
            if (r3.parent) {
              const e4 = r3.parent.children.indexOf(r3);
              r3.parent.children.splice(e4, 0, n2(o2, r3.parent));
            } else {
              const e4 = i2.indexOf(r3);
              i2.splice(e4, 0, n2(o2, null));
            }
          } else if (r2 in t2) {
            const e4 = t2[r2];
            e4.children.push(n2(o2, e4));
          } else
            i2.push(n2(o2, null));
        }
        return i2;
      }
      function me(e2, t2) {
        t2(e2.value);
        for (let n2 = e2.children.length - 1; n2 >= 0; n2--)
          me(e2.children[n2], t2);
      }
      function fe(e2, t2) {
        return Boolean("IFRAME" === e2.nodeName && t2.getMeta(e2));
      }
      function ye(e2, t2) {
        var n2, i2;
        const o2 = null === (i2 = null === (n2 = e2.ownerDocument) || void 0 === n2 ? void 0 : n2.defaultView) || void 0 === i2 ? void 0 : i2.frameElement;
        if (!o2 || o2 === t2)
          return { x: 0, y: 0, relativeScale: 1, absoluteScale: 1 };
        const r2 = o2.getBoundingClientRect(), s2 = ye(o2, t2), a2 = r2.height / o2.clientHeight;
        return { x: r2.x * s2.relativeScale + s2.x, y: r2.y * s2.relativeScale + s2.y, relativeScale: a2, absoluteScale: s2.absoluteScale * a2 };
      }
      function ve(e2) {
        return Boolean(null == e2 ? void 0 : e2.shadowRoot);
      }
      function Ce(e2, t2) {
        const n2 = e2[t2[0]];
        return 1 === t2.length ? n2 : Ce(n2.cssRules[t2[1]].cssRules, t2.slice(2));
      }
      function Ie(e2) {
        const t2 = [...e2], n2 = t2.pop();
        return { positions: t2, index: n2 };
      }
      "undefined" != typeof window && window.Proxy && window.Reflect && (pe = new Proxy(pe, { get: (e2, t2, n2) => ("map" === t2 && console.error(he), Reflect.get(e2, t2, n2)) }));
      class Ae {
        constructor() {
          this.id = 1, this.styleIDMap = /* @__PURE__ */ new WeakMap(), this.idStyleMap = /* @__PURE__ */ new Map();
        }
        getId(e2) {
          var t2;
          return null !== (t2 = this.styleIDMap.get(e2)) && void 0 !== t2 ? t2 : -1;
        }
        has(e2) {
          return this.styleIDMap.has(e2);
        }
        add(e2, t2) {
          if (this.has(e2))
            return this.getId(e2);
          let n2;
          return n2 = void 0 === t2 ? this.id++ : t2, this.styleIDMap.set(e2, n2), this.idStyleMap.set(n2, e2), n2;
        }
        getStyle(e2) {
          return this.idStyleMap.get(e2) || null;
        }
        reset() {
          this.styleIDMap = /* @__PURE__ */ new WeakMap(), this.idStyleMap = /* @__PURE__ */ new Map(), this.id = 1;
        }
        generateId() {
          return this.id++;
        }
      }
      var be = ((e2) => (e2[e2.DomContentLoaded = 0] = "DomContentLoaded", e2[e2.Load = 1] = "Load", e2[e2.FullSnapshot = 2] = "FullSnapshot", e2[e2.IncrementalSnapshot = 3] = "IncrementalSnapshot", e2[e2.Meta = 4] = "Meta", e2[e2.Custom = 5] = "Custom", e2[e2.Plugin = 6] = "Plugin", e2))(be || {}), we = ((e2) => (e2[e2.Mutation = 0] = "Mutation", e2[e2.MouseMove = 1] = "MouseMove", e2[e2.MouseInteraction = 2] = "MouseInteraction", e2[e2.Scroll = 3] = "Scroll", e2[e2.ViewportResize = 4] = "ViewportResize", e2[e2.Input = 5] = "Input", e2[e2.TouchMove = 6] = "TouchMove", e2[e2.MediaInteraction = 7] = "MediaInteraction", e2[e2.StyleSheetRule = 8] = "StyleSheetRule", e2[e2.CanvasMutation = 9] = "CanvasMutation", e2[e2.Font = 10] = "Font", e2[e2.Log = 11] = "Log", e2[e2.Drag = 12] = "Drag", e2[e2.StyleDeclaration = 13] = "StyleDeclaration", e2[e2.Selection = 14] = "Selection", e2[e2.AdoptedStyleSheet = 15] = "AdoptedStyleSheet", e2))(we || {}), Ne = ((e2) => (e2[e2.MouseUp = 0] = "MouseUp", e2[e2.MouseDown = 1] = "MouseDown", e2[e2.Click = 2] = "Click", e2[e2.ContextMenu = 3] = "ContextMenu", e2[e2.DblClick = 4] = "DblClick", e2[e2.Focus = 5] = "Focus", e2[e2.Blur = 6] = "Blur", e2[e2.TouchStart = 7] = "TouchStart", e2[e2.TouchMove_Departed = 8] = "TouchMove_Departed", e2[e2.TouchEnd = 9] = "TouchEnd", e2[e2.TouchCancel = 10] = "TouchCancel", e2))(Ne || {}), Ee = ((e2) => (e2[e2["2D"] = 0] = "2D", e2[e2.WebGL = 1] = "WebGL", e2[e2.WebGL2 = 2] = "WebGL2", e2))(Ee || {}), Se = ((e2) => (e2.Start = "start", e2.Pause = "pause", e2.Resume = "resume", e2.Resize = "resize", e2.Finish = "finish", e2.FullsnapshotRebuilded = "fullsnapshot-rebuilded", e2.LoadStylesheetStart = "load-stylesheet-start", e2.LoadStylesheetEnd = "load-stylesheet-end", e2.SkipStart = "skip-start", e2.SkipEnd = "skip-end", e2.MouseInteraction = "mouse-interaction", e2.EventCast = "event-cast", e2.CustomEvent = "custom-event", e2.Flush = "flush", e2.StateChange = "state-change", e2.PlayBack = "play-back", e2.Destroy = "destroy", e2))(Se || {});
      /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.
      
      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.
      
      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ***************************************************************************** */
      function Te(e2, t2, n2, i2) {
        return new (n2 || (n2 = Promise))(function(o2, r2) {
          function s2(e3) {
            try {
              l2(i2.next(e3));
            } catch (e4) {
              r2(e4);
            }
          }
          function a2(e3) {
            try {
              l2(i2.throw(e3));
            } catch (e4) {
              r2(e4);
            }
          }
          function l2(e3) {
            var t3;
            e3.done ? o2(e3.value) : (t3 = e3.value, t3 instanceof n2 ? t3 : new n2(function(e4) {
              e4(t3);
            })).then(s2, a2);
          }
          l2((i2 = i2.apply(e2, t2 || [])).next());
        });
      }
      for (var De = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Me = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), Re = 0; Re < De.length; Re++)
        Me[De.charCodeAt(Re)] = Re;
      var xe = null;
      try {
        var ke = "undefined" != typeof module && "function" == typeof module.require && module.require("worker_threads") || "function" == typeof __non_webpack_require__ && __non_webpack_require__("worker_threads") || "function" == typeof require && require("worker_threads");
        xe = ke.Worker;
      } catch (Ht2) {
      }
      function Fe(e2, t2, n2) {
        var i2 = void 0 === t2 ? null : t2, o2 = function(e3, t3) {
          return Buffer.from(e3, "base64").toString(t3 ? "utf16" : "utf8");
        }(e2, void 0 !== n2 && n2), r2 = o2.indexOf("\n", 10) + 1, s2 = o2.substring(r2) + (i2 ? "//# sourceMappingURL=" + i2 : "");
        return function(e3) {
          return new xe(s2, Object.assign({}, e3, { eval: true }));
        };
      }
      var Oe, Be, Le, Ve, _e = "[object process]" === Object.prototype.toString.call("undefined" != typeof process ? process : 0);
      Oe = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KICAgIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLg0KDQogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55DQogICAgcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLg0KDQogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgNCiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkNCiAgICBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsDQogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NDQogICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1INCiAgICBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SDQogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4NCiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqLw0KDQogICAgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikgew0KICAgICAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH0NCiAgICAgICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7DQogICAgICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvclsidGhyb3ciXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfQ0KICAgICAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpOw0KICAgICAgICB9KTsNCiAgICB9CgogICAgLyoKICAgICAqIGJhc2U2NC1hcnJheWJ1ZmZlciAxLjAuMSA8aHR0cHM6Ly9naXRodWIuY29tL25pa2xhc3ZoL2Jhc2U2NC1hcnJheWJ1ZmZlcj4KICAgICAqIENvcHlyaWdodCAoYykgMjAyMSBOaWtsYXMgdm9uIEhlcnR6ZW4gPGh0dHBzOi8vaGVydHplbi5jb20+CiAgICAgKiBSZWxlYXNlZCB1bmRlciBNSVQgTGljZW5zZQogICAgICovCiAgICB2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7CiAgICAvLyBVc2UgYSBsb29rdXAgdGFibGUgdG8gZmluZCB0aGUgaW5kZXguCiAgICB2YXIgbG9va3VwID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gW10gOiBuZXcgVWludDhBcnJheSgyNTYpOwogICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykgewogICAgICAgIGxvb2t1cFtjaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7CiAgICB9CiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24gKGFycmF5YnVmZmVyKSB7CiAgICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpLCBpLCBsZW4gPSBieXRlcy5sZW5ndGgsIGJhc2U2NCA9ICcnOwogICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMykgewogICAgICAgICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaV0gPj4gMl07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1soKGJ5dGVzW2ldICYgMykgPDwgNCkgfCAoYnl0ZXNbaSArIDFdID4+IDQpXTsKICAgICAgICAgICAgYmFzZTY0ICs9IGNoYXJzWygoYnl0ZXNbaSArIDFdICYgMTUpIDw8IDIpIHwgKGJ5dGVzW2kgKyAyXSA+PiA2KV07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1tieXRlc1tpICsgMl0gJiA2M107CiAgICAgICAgfQogICAgICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgJz0nOwogICAgICAgIH0KICAgICAgICBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgJz09JzsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIGJhc2U2NDsKICAgIH07CgogICAgY29uc3QgbGFzdEJsb2JNYXAgPSBuZXcgTWFwKCk7DQogICAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gbmV3IE1hcCgpOw0KICAgIGZ1bmN0aW9uIGdldFRyYW5zcGFyZW50QmxvYkZvcih3aWR0aCwgaGVpZ2h0LCBkYXRhVVJMT3B0aW9ucykgew0KICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgew0KICAgICAgICAgICAgY29uc3QgaWQgPSBgJHt3aWR0aH0tJHtoZWlnaHR9YDsNCiAgICAgICAgICAgIGlmICgnT2Zmc2NyZWVuQ2FudmFzJyBpbiBnbG9iYWxUaGlzKSB7DQogICAgICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW50QmxvYk1hcC5oYXMoaWQpKQ0KICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNwYXJlbnRCbG9iTWFwLmdldChpZCk7DQogICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsNCiAgICAgICAgICAgICAgICBvZmZzY3JlZW4uZ2V0Q29udGV4dCgnMmQnKTsNCiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoZGF0YVVSTE9wdGlvbnMpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0geWllbGQgYmxvYi5hcnJheUJ1ZmZlcigpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7DQogICAgICAgICAgICAgICAgdHJhbnNwYXJlbnRCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZTY0Ow0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgZWxzZSB7DQogICAgICAgICAgICAgICAgcmV0dXJuICcnOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9KTsNCiAgICB9DQogICAgY29uc3Qgd29ya2VyID0gc2VsZjsNCiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHsNCiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHsNCiAgICAgICAgICAgIGlmICgnT2Zmc2NyZWVuQ2FudmFzJyBpbiBnbG9iYWxUaGlzKSB7DQogICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgYml0bWFwLCB3aWR0aCwgaGVpZ2h0LCBkYXRhVVJMT3B0aW9ucyB9ID0gZS5kYXRhOw0KICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKHdpZHRoLCBoZWlnaHQsIGRhdGFVUkxPcHRpb25zKTsNCiAgICAgICAgICAgICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGN0eCA9IG9mZnNjcmVlbi5nZXRDb250ZXh0KCcyZCcpOw0KICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoYml0bWFwLCAwLCAwKTsNCiAgICAgICAgICAgICAgICBiaXRtYXAuY2xvc2UoKTsNCiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoZGF0YVVSTE9wdGlvbnMpOw0KICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBibG9iLnR5cGU7DQogICAgICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSB5aWVsZCBibG9iLmFycmF5QnVmZmVyKCk7DQogICAgICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZW5jb2RlKGFycmF5QnVmZmVyKTsNCiAgICAgICAgICAgICAgICBpZiAoIWxhc3RCbG9iTWFwLmhhcyhpZCkgJiYgKHlpZWxkIHRyYW5zcGFyZW50QmFzZTY0KSA9PT0gYmFzZTY0KSB7DQogICAgICAgICAgICAgICAgICAgIGxhc3RCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlci5wb3N0TWVzc2FnZSh7IGlkIH0pOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KQ0KICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQgfSk7DQogICAgICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHsNCiAgICAgICAgICAgICAgICAgICAgaWQsDQogICAgICAgICAgICAgICAgICAgIHR5cGUsDQogICAgICAgICAgICAgICAgICAgIGJhc2U2NCwNCiAgICAgICAgICAgICAgICAgICAgd2lkdGgsDQogICAgICAgICAgICAgICAgICAgIGhlaWdodCwNCiAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgICAgICBsYXN0QmxvYk1hcC5zZXQoaWQsIGJhc2U2NCk7DQogICAgICAgICAgICB9DQogICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IGUuZGF0YS5pZCB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgfSk7DQogICAgfTsKCn0pKCk7Cgo=", Be = null, Le = false, _e ? Fe(Oe, Be, Le) : /* @__PURE__ */ function(e2, t2, n2) {
      }(), function(e2) {
        e2[e2.Document = 0] = "Document", e2[e2.DocumentType = 1] = "DocumentType", e2[e2.Element = 2] = "Element", e2[e2.Text = 3] = "Text", e2[e2.CDATA = 4] = "CDATA", e2[e2.Comment = 5] = "Comment";
      }(Ve || (Ve = {}));
      var Ge = function() {
        function e2() {
          this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        return e2.prototype.getId = function(e3) {
          var t2;
          if (!e3)
            return -1;
          var n2 = null === (t2 = this.getMeta(e3)) || void 0 === t2 ? void 0 : t2.id;
          return null != n2 ? n2 : -1;
        }, e2.prototype.getNode = function(e3) {
          return this.idNodeMap.get(e3) || null;
        }, e2.prototype.getIds = function() {
          return Array.from(this.idNodeMap.keys());
        }, e2.prototype.getMeta = function(e3) {
          return this.nodeMetaMap.get(e3) || null;
        }, e2.prototype.removeNodeFromMap = function(e3) {
          var t2 = this, n2 = this.getId(e3);
          this.idNodeMap.delete(n2), e3.childNodes && e3.childNodes.forEach(function(e4) {
            return t2.removeNodeFromMap(e4);
          });
        }, e2.prototype.has = function(e3) {
          return this.idNodeMap.has(e3);
        }, e2.prototype.hasNode = function(e3) {
          return this.nodeMetaMap.has(e3);
        }, e2.prototype.add = function(e3, t2) {
          var n2 = t2.id;
          this.idNodeMap.set(n2, e3), this.nodeMetaMap.set(e3, t2);
        }, e2.prototype.replace = function(e3, t2) {
          var n2 = this.getNode(e3);
          if (n2) {
            var i2 = this.nodeMetaMap.get(n2);
            i2 && this.nodeMetaMap.set(t2, i2);
          }
          this.idNodeMap.set(e3, t2);
        }, e2.prototype.reset = function() {
          this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }, e2;
      }();
      function We(e2) {
        const t2 = [];
        for (const n2 in e2) {
          const i2 = e2[n2];
          if ("string" != typeof i2)
            continue;
          const o2 = Ye(n2);
          t2.push(`${o2}: ${i2};`);
        }
        return t2.join(" ");
      }
      const Ue = /-([a-z])/g, Ze = /^--[a-zA-Z0-9-]+$/, $e = (e2) => Ze.test(e2) ? e2 : e2.replace(Ue, (e3, t2) => t2 ? t2.toUpperCase() : ""), Ke = /\B([A-Z])/g, Ye = (e2) => e2.replace(Ke, "-$1").toLowerCase();
      class Pe {
        constructor(...e2) {
          this.childNodes = [], this.parentElement = null, this.parentNode = null, this.ELEMENT_NODE = qe.ELEMENT_NODE, this.TEXT_NODE = qe.TEXT_NODE;
        }
        get firstChild() {
          return this.childNodes[0] || null;
        }
        get lastChild() {
          return this.childNodes[this.childNodes.length - 1] || null;
        }
        get nextSibling() {
          const e2 = this.parentNode;
          if (!e2)
            return null;
          const t2 = e2.childNodes, n2 = t2.indexOf(this);
          return t2[n2 + 1] || null;
        }
        contains(e2) {
          if (e2 === this)
            return true;
          for (const t2 of this.childNodes)
            if (t2.contains(e2))
              return true;
          return false;
        }
        appendChild(e2) {
          throw new Error("RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.");
        }
        insertBefore(e2, t2) {
          throw new Error("RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.");
        }
        removeChild(e2) {
          throw new Error("RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.");
        }
        toString() {
          return "RRNode";
        }
      }
      function Qe(e2) {
        return class extends e2 {
          constructor(e3, t2, n2) {
            super(), this.nodeType = qe.DOCUMENT_TYPE_NODE, this.RRNodeType = Ve.DocumentType, this.textContent = null, this.name = e3, this.publicId = t2, this.systemId = n2, this.nodeName = e3;
          }
          toString() {
            return "RRDocumentType";
          }
        };
      }
      function ze(e2) {
        return class extends e2 {
          constructor(e3) {
            super(), this.nodeType = qe.ELEMENT_NODE, this.RRNodeType = Ve.Element, this.attributes = {}, this.shadowRoot = null, this.tagName = e3.toUpperCase(), this.nodeName = e3.toUpperCase();
          }
          get textContent() {
            let e3 = "";
            return this.childNodes.forEach((t2) => e3 += t2.textContent), e3;
          }
          set textContent(e3) {
            this.childNodes = [this.ownerDocument.createTextNode(e3)];
          }
          get classList() {
            return new je(this.attributes.class, (e3) => {
              this.attributes.class = e3;
            });
          }
          get id() {
            return this.attributes.id || "";
          }
          get className() {
            return this.attributes.class || "";
          }
          get style() {
            const e3 = this.attributes.style ? function(e4) {
              const t3 = {}, n2 = /:(.+)/;
              return e4.replace(/\/\*.*?\*\//g, "").split(/;(?![^(]*\))/g).forEach(function(e5) {
                if (e5) {
                  const i2 = e5.split(n2);
                  i2.length > 1 && (t3[$e(i2[0].trim())] = i2[1].trim());
                }
              }), t3;
            }(this.attributes.style) : {}, t2 = /\B([A-Z])/g;
            return e3.setProperty = (n2, i2, o2) => {
              if (t2.test(n2))
                return;
              const r2 = $e(n2);
              i2 ? e3[r2] = i2 : delete e3[r2], "important" === o2 && (e3[r2] += " !important"), this.attributes.style = We(e3);
            }, e3.removeProperty = (n2) => {
              if (t2.test(n2))
                return "";
              const i2 = $e(n2), o2 = e3[i2] || "";
              return delete e3[i2], this.attributes.style = We(e3), o2;
            }, e3;
          }
          getAttribute(e3) {
            return this.attributes[e3] || null;
          }
          setAttribute(e3, t2) {
            this.attributes[e3] = t2;
          }
          setAttributeNS(e3, t2, n2) {
            this.setAttribute(t2, n2);
          }
          removeAttribute(e3) {
            delete this.attributes[e3];
          }
          appendChild(e3) {
            return this.childNodes.push(e3), e3.parentNode = this, e3.parentElement = this, e3;
          }
          insertBefore(e3, t2) {
            if (null === t2)
              return this.appendChild(e3);
            const n2 = this.childNodes.indexOf(t2);
            if (-1 == n2)
              throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
            return this.childNodes.splice(n2, 0, e3), e3.parentElement = this, e3.parentNode = this, e3;
          }
          removeChild(e3) {
            const t2 = this.childNodes.indexOf(e3);
            if (-1 === t2)
              throw new Error("Failed to execute 'removeChild' on 'RRElement': The RRNode to be removed is not a child of this RRNode.");
            return this.childNodes.splice(t2, 1), e3.parentElement = null, e3.parentNode = null, e3;
          }
          attachShadow(e3) {
            const t2 = this.ownerDocument.createElement("SHADOWROOT");
            return this.shadowRoot = t2, t2;
          }
          dispatchEvent(e3) {
            return true;
          }
          toString() {
            let e3 = "";
            for (const t2 in this.attributes)
              e3 += `${t2}="${this.attributes[t2]}" `;
            return `${this.tagName} ${e3}`;
          }
        };
      }
      function Je(e2) {
        return class extends e2 {
          constructor(e3) {
            super(), this.nodeType = qe.TEXT_NODE, this.nodeName = "#text", this.RRNodeType = Ve.Text, this.data = e3;
          }
          get textContent() {
            return this.data;
          }
          set textContent(e3) {
            this.data = e3;
          }
          toString() {
            return `RRText text=${JSON.stringify(this.data)}`;
          }
        };
      }
      function Xe(e2) {
        return class extends e2 {
          constructor(e3) {
            super(), this.nodeType = qe.COMMENT_NODE, this.nodeName = "#comment", this.RRNodeType = Ve.Comment, this.data = e3;
          }
          get textContent() {
            return this.data;
          }
          set textContent(e3) {
            this.data = e3;
          }
          toString() {
            return `RRComment text=${JSON.stringify(this.data)}`;
          }
        };
      }
      function He(e2) {
        return class extends e2 {
          constructor(e3) {
            super(), this.nodeName = "#cdata-section", this.nodeType = qe.CDATA_SECTION_NODE, this.RRNodeType = Ve.CDATA, this.data = e3;
          }
          get textContent() {
            return this.data;
          }
          set textContent(e3) {
            this.data = e3;
          }
          toString() {
            return `RRCDATASection data=${JSON.stringify(this.data)}`;
          }
        };
      }
      class je {
        constructor(e2, t2) {
          if (this.classes = [], this.add = (...e3) => {
            for (const t3 of e3) {
              const e4 = String(t3);
              this.classes.indexOf(e4) >= 0 || this.classes.push(e4);
            }
            this.onChange && this.onChange(this.classes.join(" "));
          }, this.remove = (...e3) => {
            this.classes = this.classes.filter((t3) => -1 === e3.indexOf(t3)), this.onChange && this.onChange(this.classes.join(" "));
          }, e2) {
            const t3 = e2.trim().split(/\s+/);
            this.classes.push(...t3);
          }
          this.onChange = t2;
        }
      }
      var qe;
      !function(e2) {
        e2[e2.PLACEHOLDER = 0] = "PLACEHOLDER", e2[e2.ELEMENT_NODE = 1] = "ELEMENT_NODE", e2[e2.ATTRIBUTE_NODE = 2] = "ATTRIBUTE_NODE", e2[e2.TEXT_NODE = 3] = "TEXT_NODE", e2[e2.CDATA_SECTION_NODE = 4] = "CDATA_SECTION_NODE", e2[e2.ENTITY_REFERENCE_NODE = 5] = "ENTITY_REFERENCE_NODE", e2[e2.ENTITY_NODE = 6] = "ENTITY_NODE", e2[e2.PROCESSING_INSTRUCTION_NODE = 7] = "PROCESSING_INSTRUCTION_NODE", e2[e2.COMMENT_NODE = 8] = "COMMENT_NODE", e2[e2.DOCUMENT_NODE = 9] = "DOCUMENT_NODE", e2[e2.DOCUMENT_TYPE_NODE = 10] = "DOCUMENT_TYPE_NODE", e2[e2.DOCUMENT_FRAGMENT_NODE = 11] = "DOCUMENT_FRAGMENT_NODE";
      }(qe || (qe = {}));
      const et = { svg: "http://www.w3.org/2000/svg", "xlink:href": "http://www.w3.org/1999/xlink", xmlns: "http://www.w3.org/2000/xmlns/" }, tt = { altglyph: "altGlyph", altglyphdef: "altGlyphDef", altglyphitem: "altGlyphItem", animatecolor: "animateColor", animatemotion: "animateMotion", animatetransform: "animateTransform", clippath: "clipPath", feblend: "feBlend", fecolormatrix: "feColorMatrix", fecomponenttransfer: "feComponentTransfer", fecomposite: "feComposite", feconvolvematrix: "feConvolveMatrix", fediffuselighting: "feDiffuseLighting", fedisplacementmap: "feDisplacementMap", fedistantlight: "feDistantLight", fedropshadow: "feDropShadow", feflood: "feFlood", fefunca: "feFuncA", fefuncb: "feFuncB", fefuncg: "feFuncG", fefuncr: "feFuncR", fegaussianblur: "feGaussianBlur", feimage: "feImage", femerge: "feMerge", femergenode: "feMergeNode", femorphology: "feMorphology", feoffset: "feOffset", fepointlight: "fePointLight", fespecularlighting: "feSpecularLighting", fespotlight: "feSpotLight", fetile: "feTile", feturbulence: "feTurbulence", foreignobject: "foreignObject", glyphref: "glyphRef", lineargradient: "linearGradient", radialgradient: "radialGradient" };
      function nt(e2, t2, n2, i2) {
        const o2 = e2.childNodes, r2 = t2.childNodes;
        i2 = i2 || t2.mirror || t2.ownerDocument.mirror, (o2.length > 0 || r2.length > 0) && it(Array.from(o2), r2, e2, n2, i2);
        let s2 = null, a2 = null;
        switch (t2.RRNodeType) {
          case Ve.Document:
            a2 = t2.scrollData;
            break;
          case Ve.Element: {
            const o3 = e2, r3 = t2;
            switch (function(e3, t3, n3) {
              const i3 = e3.attributes, o4 = t3.attributes;
              for (const i4 in o4) {
                const r4 = o4[i4], s3 = n3.getMeta(t3);
                if (s3 && "isSVG" in s3 && s3.isSVG && et[i4])
                  e3.setAttributeNS(et[i4], i4, r4);
                else if ("CANVAS" === t3.tagName && "rr_dataURL" === i4) {
                  const t4 = document.createElement("img");
                  t4.src = r4, t4.onload = () => {
                    const n4 = e3.getContext("2d");
                    n4 && n4.drawImage(t4, 0, 0, t4.width, t4.height);
                  };
                } else
                  e3.setAttribute(i4, r4);
              }
              for (const { name: t4 } of Array.from(i3))
                t4 in o4 || e3.removeAttribute(t4);
              t3.scrollLeft && (e3.scrollLeft = t3.scrollLeft), t3.scrollTop && (e3.scrollTop = t3.scrollTop);
            }(o3, r3, i2), a2 = r3.scrollData, s2 = r3.inputData, r3.tagName) {
              case "AUDIO":
              case "VIDEO": {
                const t3 = e2, n3 = r3;
                void 0 !== n3.paused && (n3.paused ? t3.pause() : t3.play()), void 0 !== n3.muted && (t3.muted = n3.muted), void 0 !== n3.volume && (t3.volume = n3.volume), void 0 !== n3.currentTime && (t3.currentTime = n3.currentTime), void 0 !== n3.playbackRate && (t3.playbackRate = n3.playbackRate);
                break;
              }
              case "CANVAS":
                {
                  const i3 = t2;
                  if (null !== i3.rr_dataURL) {
                    const e3 = document.createElement("img");
                    e3.onload = () => {
                      const t3 = o3.getContext("2d");
                      t3 && t3.drawImage(e3, 0, 0, e3.width, e3.height);
                    }, e3.src = i3.rr_dataURL;
                  }
                  i3.canvasMutations.forEach((t3) => n2.applyCanvas(t3.event, t3.mutation, e2));
                }
                break;
              case "STYLE": {
                const e3 = o3.sheet;
                e3 && t2.rules.forEach((t3) => n2.applyStyleSheetMutation(t3, e3));
              }
            }
            if (r3.shadowRoot) {
              o3.shadowRoot || o3.attachShadow({ mode: "open" });
              const e3 = o3.shadowRoot.childNodes, t3 = r3.shadowRoot.childNodes;
              (e3.length > 0 || t3.length > 0) && it(Array.from(e3), t3, o3.shadowRoot, n2, i2);
            }
            break;
          }
          case Ve.Text:
          case Ve.Comment:
          case Ve.CDATA:
            e2.textContent !== t2.data && (e2.textContent = t2.data);
        }
        if (a2 && n2.applyScroll(a2, true), s2 && n2.applyInput(s2), "IFRAME" === t2.nodeName) {
          const o3 = e2.contentDocument, r3 = t2;
          if (o3) {
            const e3 = i2.getMeta(r3.contentDocument);
            e3 && n2.mirror.add(o3, Object.assign({}, e3)), nt(o3, r3.contentDocument, n2, i2);
          }
        }
      }
      function it(e2, t2, n2, i2, o2) {
        var r2;
        let s2, a2, l2 = 0, c2 = e2.length - 1, d2 = 0, u2 = t2.length - 1, h2 = e2[l2], p2 = e2[c2], g2 = t2[d2], m2 = t2[u2];
        for (; l2 <= c2 && d2 <= u2; ) {
          const f2 = i2.mirror.getId(h2), y2 = i2.mirror.getId(p2), v2 = o2.getId(g2), C2 = o2.getId(m2);
          if (void 0 === h2)
            h2 = e2[++l2];
          else if (void 0 === p2)
            p2 = e2[--c2];
          else if (-1 !== f2 && f2 === v2)
            nt(h2, g2, i2, o2), h2 = e2[++l2], g2 = t2[++d2];
          else if (-1 !== y2 && y2 === C2)
            nt(p2, m2, i2, o2), p2 = e2[--c2], m2 = t2[--u2];
          else if (-1 !== f2 && f2 === C2)
            n2.insertBefore(h2, p2.nextSibling), nt(h2, m2, i2, o2), h2 = e2[++l2], m2 = t2[--u2];
          else if (-1 !== y2 && y2 === v2)
            n2.insertBefore(p2, h2), nt(p2, g2, i2, o2), p2 = e2[--c2], g2 = t2[++d2];
          else {
            if (!s2) {
              s2 = {};
              for (let t3 = l2; t3 <= c2; t3++) {
                const n3 = e2[t3];
                n3 && i2.mirror.hasNode(n3) && (s2[i2.mirror.getId(n3)] = t3);
              }
            }
            if (a2 = s2[o2.getId(g2)], a2) {
              const t3 = e2[a2];
              n2.insertBefore(t3, h2), nt(t3, g2, i2, o2), e2[a2] = void 0;
            } else {
              const t3 = ot(g2, i2.mirror, o2);
              "#document" === n2.nodeName && (null === (r2 = i2.mirror.getMeta(t3)) || void 0 === r2 ? void 0 : r2.type) === Ve.Element && n2.documentElement && (n2.removeChild(n2.documentElement), e2[l2] = void 0, h2 = void 0), n2.insertBefore(t3, h2 || null), nt(t3, g2, i2, o2);
            }
            g2 = t2[++d2];
          }
        }
        if (l2 > c2) {
          const e3 = t2[u2 + 1];
          let r3 = null;
          for (e3 && n2.childNodes.forEach((t3) => {
            i2.mirror.getId(t3) === o2.getId(e3) && (r3 = t3);
          }); d2 <= u2; ++d2) {
            const e4 = ot(t2[d2], i2.mirror, o2);
            n2.insertBefore(e4, r3), nt(e4, t2[d2], i2, o2);
          }
        } else if (d2 > u2)
          for (; l2 <= c2; l2++) {
            const t3 = e2[l2];
            t3 && (n2.removeChild(t3), i2.mirror.removeNodeFromMap(t3));
          }
      }
      function ot(e2, t2, n2) {
        const i2 = n2.getId(e2), o2 = n2.getMeta(e2);
        let r2 = null;
        if (i2 > -1 && (r2 = t2.getNode(i2)), null !== r2)
          return r2;
        switch (e2.RRNodeType) {
          case Ve.Document:
            r2 = new Document();
            break;
          case Ve.DocumentType:
            r2 = document.implementation.createDocumentType(e2.name, e2.publicId, e2.systemId);
            break;
          case Ve.Element: {
            let t3 = e2.tagName.toLowerCase();
            t3 = tt[t3] || t3, r2 = o2 && "isSVG" in o2 && (null == o2 ? void 0 : o2.isSVG) ? document.createElementNS(et.svg, t3) : document.createElement(e2.tagName);
            break;
          }
          case Ve.Text:
            r2 = document.createTextNode(e2.data);
            break;
          case Ve.Comment:
            r2 = document.createComment(e2.data);
            break;
          case Ve.CDATA:
            r2 = document.createCDATASection(e2.data);
        }
        return o2 && t2.add(r2, Object.assign({}, o2)), r2;
      }
      class rt extends function(e2) {
        return class t2 extends e2 {
          constructor() {
            super(...arguments), this.nodeType = qe.DOCUMENT_NODE, this.nodeName = "#document", this.compatMode = "CSS1Compat", this.RRNodeType = Ve.Document, this.textContent = null;
          }
          get documentElement() {
            return this.childNodes.find((e3) => e3.RRNodeType === Ve.Element && "HTML" === e3.tagName) || null;
          }
          get body() {
            var e3;
            return (null === (e3 = this.documentElement) || void 0 === e3 ? void 0 : e3.childNodes.find((e4) => e4.RRNodeType === Ve.Element && "BODY" === e4.tagName)) || null;
          }
          get head() {
            var e3;
            return (null === (e3 = this.documentElement) || void 0 === e3 ? void 0 : e3.childNodes.find((e4) => e4.RRNodeType === Ve.Element && "HEAD" === e4.tagName)) || null;
          }
          get implementation() {
            return this;
          }
          get firstElementChild() {
            return this.documentElement;
          }
          appendChild(e3) {
            const t3 = e3.RRNodeType;
            if ((t3 === Ve.Element || t3 === Ve.DocumentType) && this.childNodes.some((e4) => e4.RRNodeType === t3))
              throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': Only one ${t3 === Ve.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
            return e3.parentElement = null, e3.parentNode = this, this.childNodes.push(e3), e3;
          }
          insertBefore(e3, t3) {
            const n2 = e3.RRNodeType;
            if ((n2 === Ve.Element || n2 === Ve.DocumentType) && this.childNodes.some((e4) => e4.RRNodeType === n2))
              throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': Only one ${n2 === Ve.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
            if (null === t3)
              return this.appendChild(e3);
            const i2 = this.childNodes.indexOf(t3);
            if (-1 == i2)
              throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
            return this.childNodes.splice(i2, 0, e3), e3.parentElement = null, e3.parentNode = this, e3;
          }
          removeChild(e3) {
            const t3 = this.childNodes.indexOf(e3);
            if (-1 === t3)
              throw new Error("Failed to execute 'removeChild' on 'RRDocument': The RRNode to be removed is not a child of this RRNode.");
            return this.childNodes.splice(t3, 1), e3.parentElement = null, e3.parentNode = null, e3;
          }
          open() {
            this.childNodes = [];
          }
          close() {
          }
          write(e3) {
            let t3;
            if ('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">' === e3 ? t3 = "-//W3C//DTD XHTML 1.0 Transitional//EN" : '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">' === e3 && (t3 = "-//W3C//DTD HTML 4.0 Transitional//EN"), t3) {
              const e4 = this.createDocumentType("html", t3, "");
              this.open(), this.appendChild(e4);
            }
          }
          createDocument(e3, n2, i2) {
            return new t2();
          }
          createDocumentType(e3, t3, n2) {
            const i2 = new (Qe(Pe))(e3, t3, n2);
            return i2.ownerDocument = this, i2;
          }
          createElement(e3) {
            const t3 = new (ze(Pe))(e3);
            return t3.ownerDocument = this, t3;
          }
          createElementNS(e3, t3) {
            return this.createElement(t3);
          }
          createTextNode(e3) {
            const t3 = new (Je(Pe))(e3);
            return t3.ownerDocument = this, t3;
          }
          createComment(e3) {
            const t3 = new (Xe(Pe))(e3);
            return t3.ownerDocument = this, t3;
          }
          createCDATASection(e3) {
            const t3 = new (He(Pe))(e3);
            return t3.ownerDocument = this, t3;
          }
          toString() {
            return "RRDocument";
          }
        };
      }(Pe) {
        constructor(e2) {
          super(), this.UNSERIALIZED_STARTING_ID = -2, this._unserializedId = this.UNSERIALIZED_STARTING_ID, this.mirror = new yt(), this.scrollData = null, e2 && (this.mirror = e2);
        }
        get unserializedId() {
          return this._unserializedId--;
        }
        createDocument(e2, t2, n2) {
          return new rt();
        }
        createDocumentType(e2, t2, n2) {
          const i2 = new st(e2, t2, n2);
          return i2.ownerDocument = this, i2;
        }
        createElement(e2) {
          const t2 = e2.toUpperCase();
          let n2;
          switch (t2) {
            case "AUDIO":
            case "VIDEO":
              n2 = new lt(t2);
              break;
            case "IFRAME":
              n2 = new ut(t2, this.mirror);
              break;
            case "CANVAS":
              n2 = new ct(t2);
              break;
            case "STYLE":
              n2 = new dt(t2);
              break;
            default:
              n2 = new at(t2);
          }
          return n2.ownerDocument = this, n2;
        }
        createComment(e2) {
          const t2 = new pt(e2);
          return t2.ownerDocument = this, t2;
        }
        createCDATASection(e2) {
          const t2 = new gt(e2);
          return t2.ownerDocument = this, t2;
        }
        createTextNode(e2) {
          const t2 = new ht(e2);
          return t2.ownerDocument = this, t2;
        }
        destroyTree() {
          this.childNodes = [], this.mirror.reset();
        }
        open() {
          super.open(), this._unserializedId = this.UNSERIALIZED_STARTING_ID;
        }
      }
      const st = Qe(Pe);
      class at extends ze(Pe) {
        constructor() {
          super(...arguments), this.inputData = null, this.scrollData = null;
        }
      }
      class lt extends function(e2) {
        return class extends e2 {
          attachShadow(e3) {
            throw new Error("RRDomException: Failed to execute 'attachShadow' on 'RRElement': This RRElement does not support attachShadow");
          }
          play() {
            this.paused = false;
          }
          pause() {
            this.paused = true;
          }
        };
      }(at) {
      }
      class ct extends at {
        constructor() {
          super(...arguments), this.rr_dataURL = null, this.canvasMutations = [];
        }
        getContext() {
          return null;
        }
      }
      class dt extends at {
        constructor() {
          super(...arguments), this.rules = [];
        }
      }
      class ut extends at {
        constructor(e2, t2) {
          super(e2), this.contentDocument = new rt(), this.contentDocument.mirror = t2;
        }
      }
      const ht = Je(Pe), pt = Xe(Pe), gt = He(Pe);
      function mt(e2, t2, n2, i2) {
        let o2;
        switch (e2.nodeType) {
          case qe.DOCUMENT_NODE:
            i2 && "IFRAME" === i2.nodeName ? o2 = i2.contentDocument : (o2 = t2, o2.compatMode = e2.compatMode);
            break;
          case qe.DOCUMENT_TYPE_NODE: {
            const n3 = e2;
            o2 = t2.createDocumentType(n3.name, n3.publicId, n3.systemId);
            break;
          }
          case qe.ELEMENT_NODE: {
            const n3 = e2, i3 = function(e3) {
              return e3 instanceof HTMLFormElement ? "FORM" : e3.tagName.toUpperCase();
            }(n3);
            o2 = t2.createElement(i3);
            const r3 = o2;
            for (const { name: e3, value: t3 } of Array.from(n3.attributes))
              r3.attributes[e3] = t3;
            n3.scrollLeft && (r3.scrollLeft = n3.scrollLeft), n3.scrollTop && (r3.scrollTop = n3.scrollTop);
            break;
          }
          case qe.TEXT_NODE:
            o2 = t2.createTextNode(e2.textContent || "");
            break;
          case qe.CDATA_SECTION_NODE:
            o2 = t2.createCDATASection(e2.data);
            break;
          case qe.COMMENT_NODE:
            o2 = t2.createComment(e2.textContent || "");
            break;
          case qe.DOCUMENT_FRAGMENT_NODE:
            o2 = i2.attachShadow({ mode: "open" });
            break;
          default:
            return null;
        }
        let r2 = n2.getMeta(e2);
        return t2 instanceof rt && (r2 || (r2 = vt(o2, t2.unserializedId), n2.add(e2, r2)), t2.mirror.add(o2, Object.assign({}, r2))), o2;
      }
      function ft(e2, t2 = function() {
        return new Ge();
      }(), n2 = new rt()) {
        return function e3(i2, o2) {
          const r2 = mt(i2, n2, t2, o2);
          if (null !== r2)
            if ("IFRAME" !== (null == o2 ? void 0 : o2.nodeName) && i2.nodeType !== qe.DOCUMENT_FRAGMENT_NODE && (null == o2 || o2.appendChild(r2), r2.parentNode = o2, r2.parentElement = o2), "IFRAME" === i2.nodeName) {
              const t3 = i2.contentDocument;
              t3 && e3(t3, r2);
            } else
              i2.nodeType !== qe.DOCUMENT_NODE && i2.nodeType !== qe.ELEMENT_NODE && i2.nodeType !== qe.DOCUMENT_FRAGMENT_NODE || (i2.nodeType === qe.ELEMENT_NODE && i2.shadowRoot && e3(i2.shadowRoot, r2), i2.childNodes.forEach((t3) => e3(t3, r2)));
        }(e2, null), n2;
      }
      class yt {
        constructor() {
          this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        getId(e2) {
          var t2;
          if (!e2)
            return -1;
          const n2 = null === (t2 = this.getMeta(e2)) || void 0 === t2 ? void 0 : t2.id;
          return null != n2 ? n2 : -1;
        }
        getNode(e2) {
          return this.idNodeMap.get(e2) || null;
        }
        getIds() {
          return Array.from(this.idNodeMap.keys());
        }
        getMeta(e2) {
          return this.nodeMetaMap.get(e2) || null;
        }
        removeNodeFromMap(e2) {
          const t2 = this.getId(e2);
          this.idNodeMap.delete(t2), e2.childNodes && e2.childNodes.forEach((e3) => this.removeNodeFromMap(e3));
        }
        has(e2) {
          return this.idNodeMap.has(e2);
        }
        hasNode(e2) {
          return this.nodeMetaMap.has(e2);
        }
        add(e2, t2) {
          const n2 = t2.id;
          this.idNodeMap.set(n2, e2), this.nodeMetaMap.set(e2, t2);
        }
        replace(e2, t2) {
          const n2 = this.getNode(e2);
          if (n2) {
            const e3 = this.nodeMetaMap.get(n2);
            e3 && this.nodeMetaMap.set(t2, e3);
          }
          this.idNodeMap.set(e2, t2);
        }
        reset() {
          this.idNodeMap = /* @__PURE__ */ new Map(), this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
      }
      function vt(e2, t2) {
        switch (e2.RRNodeType) {
          case Ve.Document:
            return { id: t2, type: e2.RRNodeType, childNodes: [] };
          case Ve.DocumentType: {
            const n2 = e2;
            return { id: t2, type: e2.RRNodeType, name: n2.name, publicId: n2.publicId, systemId: n2.systemId };
          }
          case Ve.Element:
            return { id: t2, type: e2.RRNodeType, tagName: e2.tagName.toLowerCase(), attributes: {}, childNodes: [] };
          case Ve.Text:
          case Ve.Comment:
            return { id: t2, type: e2.RRNodeType, textContent: e2.textContent || "" };
          case Ve.CDATA:
            return { id: t2, type: e2.RRNodeType, textContent: "" };
        }
      }
      var Ct = Uint8Array, It = Uint16Array, At = Uint32Array, bt = new Ct([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), wt = new Ct([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), Nt = new Ct([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Et = function(e2, t2) {
        for (var n2 = new It(31), i2 = 0; i2 < 31; ++i2)
          n2[i2] = t2 += 1 << e2[i2 - 1];
        var o2 = new At(n2[30]);
        for (i2 = 1; i2 < 30; ++i2)
          for (var r2 = n2[i2]; r2 < n2[i2 + 1]; ++r2)
            o2[r2] = r2 - n2[i2] << 5 | i2;
        return [n2, o2];
      }, St = Et(bt, 2), Tt = St[0], Dt = St[1];
      Tt[28] = 258, Dt[258] = 28;
      for (var Mt = Et(wt, 0)[0], Rt = new It(32768), xt = 0; xt < 32768; ++xt) {
        var kt = (43690 & xt) >>> 1 | (21845 & xt) << 1;
        kt = (61680 & (kt = (52428 & kt) >>> 2 | (13107 & kt) << 2)) >>> 4 | (3855 & kt) << 4, Rt[xt] = ((65280 & kt) >>> 8 | (255 & kt) << 8) >>> 1;
      }
      var Ft = function(e2, t2, n2) {
        for (var i2 = e2.length, o2 = 0, r2 = new It(t2); o2 < i2; ++o2)
          ++r2[e2[o2] - 1];
        var s2, a2 = new It(t2);
        for (o2 = 0; o2 < t2; ++o2)
          a2[o2] = a2[o2 - 1] + r2[o2 - 1] << 1;
        if (n2) {
          s2 = new It(1 << t2);
          var l2 = 15 - t2;
          for (o2 = 0; o2 < i2; ++o2)
            if (e2[o2])
              for (var c2 = o2 << 4 | e2[o2], d2 = t2 - e2[o2], u2 = a2[e2[o2] - 1]++ << d2, h2 = u2 | (1 << d2) - 1; u2 <= h2; ++u2)
                s2[Rt[u2] >>> l2] = c2;
        } else
          for (s2 = new It(i2), o2 = 0; o2 < i2; ++o2)
            s2[o2] = Rt[a2[e2[o2] - 1]++] >>> 15 - e2[o2];
        return s2;
      }, Ot = new Ct(288);
      for (xt = 0; xt < 144; ++xt)
        Ot[xt] = 8;
      for (xt = 144; xt < 256; ++xt)
        Ot[xt] = 9;
      for (xt = 256; xt < 280; ++xt)
        Ot[xt] = 7;
      for (xt = 280; xt < 288; ++xt)
        Ot[xt] = 8;
      var Bt = new Ct(32);
      for (xt = 0; xt < 32; ++xt)
        Bt[xt] = 5;
      var Lt = Ft(Ot, 9, 1), Vt = Ft(Bt, 5, 1), _t = function(e2) {
        for (var t2 = e2[0], n2 = 1; n2 < e2.length; ++n2)
          e2[n2] > t2 && (t2 = e2[n2]);
        return t2;
      }, Gt = function(e2, t2, n2) {
        var i2 = t2 / 8 >> 0;
        return (e2[i2] | e2[i2 + 1] << 8) >>> (7 & t2) & n2;
      }, Wt = function(e2, t2) {
        var n2 = t2 / 8 >> 0;
        return (e2[n2] | e2[n2 + 1] << 8 | e2[n2 + 2] << 16) >>> (7 & t2);
      }, Ut = function(e2, t2, n2) {
        (null == t2 || t2 < 0) && (t2 = 0), (null == n2 || n2 > e2.length) && (n2 = e2.length);
        var i2 = new (e2 instanceof It ? It : e2 instanceof At ? At : Ct)(n2 - t2);
        return i2.set(e2.subarray(t2, n2)), i2;
      };
      function Zt(e2, t2) {
        return function(e3, t3, n2) {
          var i2 = e3.length, o2 = !t3 || n2, r2 = !n2 || n2.i;
          n2 || (n2 = {}), t3 || (t3 = new Ct(3 * i2));
          var s2, a2 = function(e4) {
            var n3 = t3.length;
            if (e4 > n3) {
              var i3 = new Ct(Math.max(2 * n3, e4));
              i3.set(t3), t3 = i3;
            }
          }, l2 = n2.f || 0, c2 = n2.p || 0, d2 = n2.b || 0, u2 = n2.l, h2 = n2.d, p2 = n2.m, g2 = n2.n, m2 = 8 * i2;
          do {
            if (!u2) {
              n2.f = l2 = Gt(e3, c2, 1);
              var f2 = Gt(e3, c2 + 1, 3);
              if (c2 += 3, !f2) {
                var y2 = e3[(D2 = ((s2 = c2) / 8 >> 0) + (7 & s2 && 1) + 4) - 4] | e3[D2 - 3] << 8, v2 = D2 + y2;
                if (v2 > i2) {
                  if (r2)
                    throw "unexpected EOF";
                  break;
                }
                o2 && a2(d2 + y2), t3.set(e3.subarray(D2, v2), d2), n2.b = d2 += y2, n2.p = c2 = 8 * v2;
                continue;
              }
              if (1 == f2)
                u2 = Lt, h2 = Vt, p2 = 9, g2 = 5;
              else {
                if (2 != f2)
                  throw "invalid block type";
                var C2 = Gt(e3, c2, 31) + 257, I2 = Gt(e3, c2 + 10, 15) + 4, A2 = C2 + Gt(e3, c2 + 5, 31) + 1;
                c2 += 14;
                for (var b2 = new Ct(A2), w2 = new Ct(19), N2 = 0; N2 < I2; ++N2)
                  w2[Nt[N2]] = Gt(e3, c2 + 3 * N2, 7);
                c2 += 3 * I2;
                var E2 = _t(w2), S2 = (1 << E2) - 1;
                if (!r2 && c2 + A2 * (E2 + 7) > m2)
                  break;
                var T2 = Ft(w2, E2, 1);
                for (N2 = 0; N2 < A2; ) {
                  var D2, M2 = T2[Gt(e3, c2, S2)];
                  if (c2 += 15 & M2, (D2 = M2 >>> 4) < 16)
                    b2[N2++] = D2;
                  else {
                    var R2 = 0, x2 = 0;
                    for (16 == D2 ? (x2 = 3 + Gt(e3, c2, 3), c2 += 2, R2 = b2[N2 - 1]) : 17 == D2 ? (x2 = 3 + Gt(e3, c2, 7), c2 += 3) : 18 == D2 && (x2 = 11 + Gt(e3, c2, 127), c2 += 7); x2--; )
                      b2[N2++] = R2;
                  }
                }
                var k2 = b2.subarray(0, C2), F2 = b2.subarray(C2);
                p2 = _t(k2), g2 = _t(F2), u2 = Ft(k2, p2, 1), h2 = Ft(F2, g2, 1);
              }
              if (c2 > m2)
                throw "unexpected EOF";
            }
            o2 && a2(d2 + 131072);
            for (var O2 = (1 << p2) - 1, B2 = (1 << g2) - 1, L2 = p2 + g2 + 18; r2 || c2 + L2 < m2; ) {
              var V2 = (R2 = u2[Wt(e3, c2) & O2]) >>> 4;
              if ((c2 += 15 & R2) > m2)
                throw "unexpected EOF";
              if (!R2)
                throw "invalid length/literal";
              if (V2 < 256)
                t3[d2++] = V2;
              else {
                if (256 == V2) {
                  u2 = null;
                  break;
                }
                var _2 = V2 - 254;
                if (V2 > 264) {
                  var G2 = bt[N2 = V2 - 257];
                  _2 = Gt(e3, c2, (1 << G2) - 1) + Tt[N2], c2 += G2;
                }
                var W2 = h2[Wt(e3, c2) & B2], U2 = W2 >>> 4;
                if (!W2)
                  throw "invalid distance";
                if (c2 += 15 & W2, F2 = Mt[U2], U2 > 3 && (G2 = wt[U2], F2 += Wt(e3, c2) & (1 << G2) - 1, c2 += G2), c2 > m2)
                  throw "unexpected EOF";
                o2 && a2(d2 + 131072);
                for (var Z2 = d2 + _2; d2 < Z2; d2 += 4)
                  t3[d2] = t3[d2 - F2], t3[d2 + 1] = t3[d2 + 1 - F2], t3[d2 + 2] = t3[d2 + 2 - F2], t3[d2 + 3] = t3[d2 + 3 - F2];
                d2 = Z2;
              }
            }
            n2.l = u2, n2.p = c2, n2.b = d2, u2 && (l2 = 1, n2.m = p2, n2.d = h2, n2.n = g2);
          } while (!l2);
          return d2 == t3.length ? t3 : Ut(t3, 0, d2);
        }((function(e3) {
          if (8 != (15 & e3[0]) || e3[0] >>> 4 > 7 || (e3[0] << 8 | e3[1]) % 31)
            throw "invalid zlib data";
          if (32 & e3[1])
            throw "invalid zlib data: preset dictionaries not supported";
        }(e2), e2.subarray(2, -4)), t2);
      }
      const $t = (e2) => {
        if ("string" != typeof e2)
          return e2;
        try {
          const t2 = JSON.parse(e2);
          if (t2.timestamp)
            return t2;
        } catch (e3) {
        }
        try {
          const t2 = JSON.parse(function(e3, t3) {
            var n2 = "";
            if (!t3 && "undefined" != typeof TextDecoder)
              return new TextDecoder().decode(e3);
            for (var i2 = 0; i2 < e3.length; ) {
              var o2 = e3[i2++];
              o2 < 128 || t3 ? n2 += String.fromCharCode(o2) : o2 < 224 ? n2 += String.fromCharCode((31 & o2) << 6 | 63 & e3[i2++]) : o2 < 240 ? n2 += String.fromCharCode((15 & o2) << 12 | (63 & e3[i2++]) << 6 | 63 & e3[i2++]) : (o2 = ((15 & o2) << 18 | (63 & e3[i2++]) << 12 | (63 & e3[i2++]) << 6 | 63 & e3[i2++]) - 65536, n2 += String.fromCharCode(55296 | o2 >> 10, 56320 | 1023 & o2));
            }
            return n2;
          }(Zt(function(e3, t3) {
            var n2 = e3.length;
            if (!t3 && "undefined" != typeof TextEncoder)
              return new TextEncoder().encode(e3);
            for (var i2 = new Ct(e3.length + (e3.length >>> 1)), o2 = 0, r2 = function(e4) {
              i2[o2++] = e4;
            }, s2 = 0; s2 < n2; ++s2) {
              if (o2 + 5 > i2.length) {
                var a2 = new Ct(o2 + 8 + (n2 - s2 << 1));
                a2.set(i2), i2 = a2;
              }
              var l2 = e3.charCodeAt(s2);
              l2 < 128 || t3 ? r2(l2) : l2 < 2048 ? (r2(192 | l2 >>> 6), r2(128 | 63 & l2)) : l2 > 55295 && l2 < 57344 ? (r2(240 | (l2 = 65536 + (1047552 & l2) | 1023 & e3.charCodeAt(++s2)) >>> 18), r2(128 | l2 >>> 12 & 63), r2(128 | l2 >>> 6 & 63), r2(128 | 63 & l2)) : (r2(224 | l2 >>> 12), r2(128 | l2 >>> 6 & 63), r2(128 | 63 & l2));
            }
            return Ut(i2, 0, o2);
          }(e2, true))));
          if ("v1" === t2.v)
            return t2;
          throw new Error(`These events were packed with packer ${t2.v} which is incompatible with current packer v1.`);
        } catch (e3) {
          throw console.error(e3), new Error("Unknown data format.");
        }
      };
      function Kt(e2) {
        return { all: e2 = e2 || /* @__PURE__ */ new Map(), on: function(t2, n2) {
          var i2 = e2.get(t2);
          i2 ? i2.push(n2) : e2.set(t2, [n2]);
        }, off: function(t2, n2) {
          var i2 = e2.get(t2);
          i2 && (n2 ? i2.splice(i2.indexOf(n2) >>> 0, 1) : e2.set(t2, []));
        }, emit: function(t2, n2) {
          var i2 = e2.get(t2);
          i2 && i2.slice().map(function(e3) {
            e3(n2);
          }), (i2 = e2.get("*")) && i2.slice().map(function(e3) {
            e3(t2, n2);
          });
        } };
      }
      var Yt, Pt = Object.freeze({ __proto__: null, default: Kt });
      function Qt(e2 = window, t2 = document) {
        if ("scrollBehavior" in t2.documentElement.style && true !== e2.__forceSmoothScrollPolyfill__)
          return;
        const n2 = e2.HTMLElement || e2.Element, i2 = { scroll: e2.scroll || e2.scrollTo, scrollBy: e2.scrollBy, elementScroll: n2.prototype.scroll || a2, scrollIntoView: n2.prototype.scrollIntoView }, o2 = e2.performance && e2.performance.now ? e2.performance.now.bind(e2.performance) : Date.now;
        const r2 = (s2 = e2.navigator.userAgent, new RegExp(["MSIE ", "Trident/", "Edge/"].join("|")).test(s2) ? 1 : 0);
        var s2;
        function a2(e3, t3) {
          this.scrollLeft = e3, this.scrollTop = t3;
        }
        function l2(e3) {
          if (null === e3 || "object" != typeof e3 || void 0 === e3.behavior || "auto" === e3.behavior || "instant" === e3.behavior)
            return true;
          if ("object" == typeof e3 && "smooth" === e3.behavior)
            return false;
          throw new TypeError("behavior member of ScrollOptions " + e3.behavior + " is not a valid value for enumeration ScrollBehavior.");
        }
        function c2(e3, t3) {
          return "Y" === t3 ? e3.clientHeight + r2 < e3.scrollHeight : "X" === t3 ? e3.clientWidth + r2 < e3.scrollWidth : void 0;
        }
        function d2(t3, n3) {
          const i3 = e2.getComputedStyle(t3, null)["overflow" + n3];
          return "auto" === i3 || "scroll" === i3;
        }
        function u2(e3) {
          const t3 = c2(e3, "Y") && d2(e3, "Y"), n3 = c2(e3, "X") && d2(e3, "X");
          return t3 || n3;
        }
        function h2(e3) {
          for (; e3 !== t2.body && false === u2(e3); )
            e3 = e3.parentNode || e3.host;
          return e3;
        }
        function p2(t3) {
          let n3, i3, r3, s3 = (o2() - t3.startTime) / 468;
          var a3;
          s3 = s3 > 1 ? 1 : s3, a3 = s3, n3 = 0.5 * (1 - Math.cos(Math.PI * a3)), i3 = t3.startX + (t3.x - t3.startX) * n3, r3 = t3.startY + (t3.y - t3.startY) * n3, t3.method.call(t3.scrollable, i3, r3), i3 === t3.x && r3 === t3.y || e2.requestAnimationFrame(p2.bind(e2, t3));
        }
        function g2(n3, r3, s3) {
          let l3, c3, d3, u3;
          const h3 = o2();
          n3 === t2.body ? (l3 = e2, c3 = e2.scrollX || e2.pageXOffset, d3 = e2.scrollY || e2.pageYOffset, u3 = i2.scroll) : (l3 = n3, c3 = n3.scrollLeft, d3 = n3.scrollTop, u3 = a2), p2({ scrollable: l3, method: u3, startTime: h3, startX: c3, startY: d3, x: r3, y: s3 });
        }
        e2.scroll = e2.scrollTo = function() {
          void 0 !== arguments[0] && (true !== l2(arguments[0]) ? g2.call(e2, t2.body, void 0 !== arguments[0].left ? ~~arguments[0].left : e2.scrollX || e2.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : e2.scrollY || e2.pageYOffset) : i2.scroll.call(e2, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : e2.scrollX || e2.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : e2.scrollY || e2.pageYOffset));
        }, e2.scrollBy = function() {
          void 0 !== arguments[0] && (l2(arguments[0]) ? i2.scrollBy.call(e2, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : g2.call(e2, t2.body, ~~arguments[0].left + (e2.scrollX || e2.pageXOffset), ~~arguments[0].top + (e2.scrollY || e2.pageYOffset)));
        }, n2.prototype.scroll = n2.prototype.scrollTo = function() {
          if (void 0 === arguments[0])
            return;
          if (true === l2(arguments[0])) {
            if ("number" == typeof arguments[0] && void 0 === arguments[1])
              throw new SyntaxError("Value could not be converted");
            return void i2.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : "object" != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop);
          }
          const e3 = arguments[0].left, t3 = arguments[0].top;
          g2.call(this, this, void 0 === e3 ? this.scrollLeft : ~~e3, void 0 === t3 ? this.scrollTop : ~~t3);
        }, n2.prototype.scrollBy = function() {
          void 0 !== arguments[0] && (true !== l2(arguments[0]) ? this.scroll({ left: ~~arguments[0].left + this.scrollLeft, top: ~~arguments[0].top + this.scrollTop, behavior: arguments[0].behavior }) : i2.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop));
        }, n2.prototype.scrollIntoView = function() {
          if (true === l2(arguments[0]))
            return void i2.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
          const n3 = h2(this), o3 = n3.getBoundingClientRect(), r3 = this.getBoundingClientRect();
          n3 !== t2.body ? (g2.call(this, n3, n3.scrollLeft + r3.left - o3.left, n3.scrollTop + r3.top - o3.top), "fixed" !== e2.getComputedStyle(n3).position && e2.scrollBy({ left: o3.left, top: o3.top, behavior: "smooth" })) : e2.scrollBy({ left: r3.left, top: r3.top, behavior: "smooth" });
        };
      }
      class zt {
        constructor(e2 = [], t2) {
          this.timeOffset = 0, this.raf = null, this.actions = e2, this.speed = t2.speed, this.liveMode = t2.liveMode;
        }
        addAction(e2) {
          if (!this.actions.length || this.actions[this.actions.length - 1].delay <= e2.delay)
            return void this.actions.push(e2);
          const t2 = this.findActionIndex(e2);
          this.actions.splice(t2, 0, e2);
        }
        start() {
          this.timeOffset = 0;
          let e2 = performance.now();
          const t2 = () => {
            const n2 = performance.now();
            for (this.timeOffset += (n2 - e2) * this.speed, e2 = n2; this.actions.length; ) {
              const e3 = this.actions[0];
              if (!(this.timeOffset >= e3.delay))
                break;
              this.actions.shift(), e3.doAction();
            }
            (this.actions.length > 0 || this.liveMode) && (this.raf = requestAnimationFrame(t2));
          };
          this.raf = requestAnimationFrame(t2);
        }
        clear() {
          this.raf && (cancelAnimationFrame(this.raf), this.raf = null), this.actions.length = 0;
        }
        setSpeed(e2) {
          this.speed = e2;
        }
        toggleLiveMode(e2) {
          this.liveMode = e2;
        }
        isActive() {
          return null !== this.raf;
        }
        findActionIndex(e2) {
          let t2 = 0, n2 = this.actions.length - 1;
          for (; t2 <= n2; ) {
            const i2 = Math.floor((t2 + n2) / 2);
            if (this.actions[i2].delay < e2.delay)
              t2 = i2 + 1;
            else {
              if (!(this.actions[i2].delay > e2.delay))
                return i2 + 1;
              n2 = i2 - 1;
            }
          }
          return t2;
        }
      }
      function Jt(e2, t2) {
        if (e2.type === be.IncrementalSnapshot && e2.data.source === we.MouseMove && e2.data.positions && e2.data.positions.length) {
          const n2 = e2.data.positions[0].timeOffset, i2 = e2.timestamp + n2;
          return e2.delay = i2 - t2, i2 - t2;
        }
        return e2.delay = e2.timestamp - t2, e2.delay;
      }
      /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.
      
      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.
      
      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ***************************************************************************** */
      function Xt(e2, t2) {
        var n2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!n2)
          return e2;
        var i2, o2, r2 = n2.call(e2), s2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(i2 = r2.next()).done; )
            s2.push(i2.value);
        } catch (e3) {
          o2 = { error: e3 };
        } finally {
          try {
            i2 && !i2.done && (n2 = r2.return) && n2.call(r2);
          } finally {
            if (o2)
              throw o2.error;
          }
        }
        return s2;
      }
      !function(e2) {
        e2[e2.NotStarted = 0] = "NotStarted", e2[e2.Running = 1] = "Running", e2[e2.Stopped = 2] = "Stopped";
      }(Yt || (Yt = {}));
      var Ht = { type: "xstate.init" };
      function jt(e2) {
        return void 0 === e2 ? [] : [].concat(e2);
      }
      function qt(e2) {
        return { type: "xstate.assign", assignment: e2 };
      }
      function en(e2, t2) {
        return "string" == typeof (e2 = "string" == typeof e2 && t2 && t2[e2] ? t2[e2] : e2) ? { type: e2 } : "function" == typeof e2 ? { type: e2.name, exec: e2 } : e2;
      }
      function tn(e2) {
        return function(t2) {
          return e2 === t2;
        };
      }
      function nn(e2) {
        return "string" == typeof e2 ? { type: e2 } : e2;
      }
      function on(e2, t2) {
        return { value: e2, context: t2, actions: [], changed: false, matches: tn(e2) };
      }
      function rn(e2, t2, n2) {
        var i2 = t2, o2 = false;
        return [e2.filter(function(e3) {
          if ("xstate.assign" === e3.type) {
            o2 = true;
            var t3 = Object.assign({}, i2);
            return "function" == typeof e3.assignment ? t3 = e3.assignment(i2, n2) : Object.keys(e3.assignment).forEach(function(o3) {
              t3[o3] = "function" == typeof e3.assignment[o3] ? e3.assignment[o3](i2, n2) : e3.assignment[o3];
            }), i2 = t3, false;
          }
          return true;
        }), i2, o2];
      }
      function sn(e2, t2) {
        void 0 === t2 && (t2 = {});
        var n2 = Xt(rn(jt(e2.states[e2.initial].entry).map(function(e3) {
          return en(e3, t2.actions);
        }), e2.context, Ht), 2), i2 = n2[0], o2 = n2[1], r2 = { config: e2, _options: t2, initialState: { value: e2.initial, actions: i2, context: o2, matches: tn(e2.initial) }, transition: function(t3, n3) {
          var i3, o3, s2 = "string" == typeof t3 ? { value: t3, context: e2.context } : t3, a2 = s2.value, l2 = s2.context, c2 = nn(n3), d2 = e2.states[a2];
          if (d2.on) {
            var u2 = jt(d2.on[c2.type]);
            try {
              for (var h2 = function(e3) {
                var t4 = "function" == typeof Symbol && Symbol.iterator, n4 = t4 && e3[t4], i4 = 0;
                if (n4)
                  return n4.call(e3);
                if (e3 && "number" == typeof e3.length)
                  return { next: function() {
                    return e3 && i4 >= e3.length && (e3 = void 0), { value: e3 && e3[i4++], done: !e3 };
                  } };
                throw new TypeError(t4 ? "Object is not iterable." : "Symbol.iterator is not defined.");
              }(u2), p2 = h2.next(); !p2.done; p2 = h2.next()) {
                var g2 = p2.value;
                if (void 0 === g2)
                  return on(a2, l2);
                var m2 = "string" == typeof g2 ? { target: g2 } : g2, f2 = m2.target, y2 = m2.actions, v2 = void 0 === y2 ? [] : y2, C2 = m2.cond, I2 = void 0 === C2 ? function() {
                  return true;
                } : C2, A2 = void 0 === f2, b2 = null != f2 ? f2 : a2, w2 = e2.states[b2];
                if (I2(l2, c2)) {
                  var N2 = Xt(rn((A2 ? jt(v2) : [].concat(d2.exit, v2, w2.entry).filter(function(e3) {
                    return e3;
                  })).map(function(e3) {
                    return en(e3, r2._options.actions);
                  }), l2, c2), 3), E2 = N2[0], S2 = N2[1], T2 = N2[2], D2 = null != f2 ? f2 : a2;
                  return { value: D2, context: S2, actions: E2, changed: f2 !== a2 || E2.length > 0 || T2, matches: tn(D2) };
                }
              }
            } catch (e3) {
              i3 = { error: e3 };
            } finally {
              try {
                p2 && !p2.done && (o3 = h2.return) && o3.call(h2);
              } finally {
                if (i3)
                  throw i3.error;
              }
            }
          }
          return on(a2, l2);
        } };
        return r2;
      }
      var an = function(e2, t2) {
        return e2.actions.forEach(function(n2) {
          var i2 = n2.exec;
          return i2 && i2(e2.context, t2);
        });
      };
      function ln(e2) {
        var t2 = e2.initialState, n2 = Yt.NotStarted, i2 = /* @__PURE__ */ new Set(), o2 = { _machine: e2, send: function(o3) {
          n2 === Yt.Running && (t2 = e2.transition(t2, o3), an(t2, nn(o3)), i2.forEach(function(e3) {
            return e3(t2);
          }));
        }, subscribe: function(e3) {
          return i2.add(e3), e3(t2), { unsubscribe: function() {
            return i2.delete(e3);
          } };
        }, start: function(i3) {
          if (i3) {
            var r2 = "object" == typeof i3 ? i3 : { context: e2.config.context, value: i3 };
            t2 = { value: r2.value, actions: [], context: r2.context, matches: tn(r2.value) };
          }
          return n2 = Yt.Running, an(t2, Ht), o2;
        }, stop: function() {
          return n2 = Yt.Stopped, i2.clear(), o2;
        }, get state() {
          return t2;
        }, get status() {
          return n2;
        } };
        return o2;
      }
      function cn(e2, { getCastFn: t2, applyEventsSynchronously: n2, emitter: i2 }) {
        const o2 = sn({ id: "player", context: e2, initial: "paused", states: { playing: { on: { PAUSE: { target: "paused", actions: ["pause"] }, CAST_EVENT: { target: "playing", actions: "castEvent" }, END: { target: "paused", actions: ["resetLastPlayedEvent", "pause"] }, ADD_EVENT: { target: "playing", actions: ["addEvent"] } } }, paused: { on: { PLAY: { target: "playing", actions: ["recordTimeOffset", "play"] }, CAST_EVENT: { target: "paused", actions: "castEvent" }, TO_LIVE: { target: "live", actions: ["startLive"] }, ADD_EVENT: { target: "paused", actions: ["addEvent"] } } }, live: { on: { ADD_EVENT: { target: "live", actions: ["addEvent"] }, CAST_EVENT: { target: "live", actions: ["castEvent"] } } } } }, { actions: { castEvent: qt({ lastPlayedEvent: (e3, t3) => "CAST_EVENT" === t3.type ? t3.payload.event : e3.lastPlayedEvent }), recordTimeOffset: qt((e3, t3) => {
          let n3 = e3.timeOffset;
          return "payload" in t3 && "timeOffset" in t3.payload && (n3 = t3.payload.timeOffset), Object.assign(Object.assign({}, e3), { timeOffset: n3, baselineTime: e3.events[0].timestamp + n3 });
        }), play(e3) {
          var o3;
          const { timer: r2, events: s2, baselineTime: a2, lastPlayedEvent: l2 } = e3;
          r2.clear();
          for (const e4 of s2)
            Jt(e4, a2);
          const c2 = function(e4, t3) {
            for (let n3 = e4.length - 1; n3 >= 0; n3--) {
              const i3 = e4[n3];
              if (i3.type === be.Meta && i3.timestamp <= t3)
                return e4.slice(n3);
            }
            return e4;
          }(s2, a2);
          let d2 = null == l2 ? void 0 : l2.timestamp;
          (null == l2 ? void 0 : l2.type) === be.IncrementalSnapshot && l2.data.source === we.MouseMove && (d2 = l2.timestamp + (null === (o3 = l2.data.positions[0]) || void 0 === o3 ? void 0 : o3.timeOffset)), a2 < (d2 || 0) && i2.emit(Se.PlayBack);
          const u2 = new Array();
          for (const e4 of c2)
            if (!(d2 && d2 < a2 && (e4.timestamp <= d2 || e4 === l2)))
              if (e4.timestamp < a2)
                u2.push(e4);
              else {
                const n3 = t2(e4, false);
                r2.addAction({ doAction: () => {
                  n3();
                }, delay: e4.delay });
              }
          n2(u2), i2.emit(Se.Flush), r2.start();
        }, pause(e3) {
          e3.timer.clear();
        }, resetLastPlayedEvent: qt((e3) => Object.assign(Object.assign({}, e3), { lastPlayedEvent: null })), startLive: qt({ baselineTime: (e3, t3) => (e3.timer.toggleLiveMode(true), e3.timer.start(), "TO_LIVE" === t3.type && t3.payload.baselineTime ? t3.payload.baselineTime : Date.now()) }), addEvent: qt((e3, n3) => {
          const { baselineTime: i3, timer: o3, events: r2 } = e3;
          if ("ADD_EVENT" === n3.type) {
            const { event: e4 } = n3.payload;
            Jt(e4, i3);
            let s2 = r2.length - 1;
            if (!r2[s2] || r2[s2].timestamp <= e4.timestamp)
              r2.push(e4);
            else {
              let t3 = -1, n4 = 0;
              for (; n4 <= s2; ) {
                const t4 = Math.floor((n4 + s2) / 2);
                r2[t4].timestamp <= e4.timestamp ? n4 = t4 + 1 : s2 = t4 - 1;
              }
              -1 === t3 && (t3 = n4), r2.splice(t3, 0, e4);
            }
            const a2 = e4.timestamp < i3, l2 = t2(e4, a2);
            a2 ? l2() : o3.isActive() && o3.addAction({ doAction: () => {
              l2();
            }, delay: e4.delay });
          }
          return Object.assign(Object.assign({}, e3), { events: r2 });
        }) } });
        return ln(o2);
      }
      const dn = /* @__PURE__ */ new Map();
      function un(e2, t2) {
        let n2 = dn.get(e2);
        return n2 || (n2 = /* @__PURE__ */ new Map(), dn.set(e2, n2)), n2.has(t2) || n2.set(t2, []), n2.get(t2);
      }
      function hn(e2, t2, n2) {
        return (i2) => Te(this, void 0, void 0, function* () {
          if (i2 && "object" == typeof i2 && "rr_type" in i2) {
            if (n2 && (n2.isUnchanged = false), "ImageBitmap" === i2.rr_type && "args" in i2) {
              const o2 = yield hn(e2, t2, n2)(i2.args);
              return yield createImageBitmap.apply(null, o2);
            }
            if ("index" in i2) {
              if (n2 || null === t2)
                return i2;
              const { rr_type: e3, index: o2 } = i2;
              return un(t2, e3)[o2];
            }
            if ("args" in i2) {
              const { rr_type: o2, args: r2 } = i2;
              return new window[o2](...yield Promise.all(r2.map(hn(e2, t2, n2))));
            }
            if ("base64" in i2)
              return function(e3) {
                var t3, n3, i3, o2, r2, s2 = 0.75 * e3.length, a2 = e3.length, l2 = 0;
                "=" === e3[e3.length - 1] && (s2--, "=" === e3[e3.length - 2] && s2--);
                var c2 = new ArrayBuffer(s2), d2 = new Uint8Array(c2);
                for (t3 = 0; t3 < a2; t3 += 4)
                  n3 = Me[e3.charCodeAt(t3)], i3 = Me[e3.charCodeAt(t3 + 1)], o2 = Me[e3.charCodeAt(t3 + 2)], r2 = Me[e3.charCodeAt(t3 + 3)], d2[l2++] = n3 << 2 | i3 >> 4, d2[l2++] = (15 & i3) << 4 | o2 >> 2, d2[l2++] = (3 & o2) << 6 | 63 & r2;
                return c2;
              }(i2.base64);
            if ("src" in i2) {
              const t3 = e2.get(i2.src);
              if (t3)
                return t3;
              {
                const t4 = new Image();
                return t4.src = i2.src, e2.set(i2.src, t4), t4;
              }
            }
            if ("data" in i2 && "Blob" === i2.rr_type) {
              const o2 = yield Promise.all(i2.data.map(hn(e2, t2, n2)));
              return new Blob(o2, { type: i2.type });
            }
          } else if (Array.isArray(i2)) {
            return yield Promise.all(i2.map(hn(e2, t2, n2)));
          }
          return i2;
        });
      }
      const pn = ["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject"];
      function gn({ mutation: e2, target: t2, type: n2, imageMap: i2, errorHandler: o2 }) {
        return Te(this, void 0, void 0, function* () {
          try {
            const o3 = function(e3, t3) {
              try {
                return t3 === Ee.WebGL ? e3.getContext("webgl") || e3.getContext("experimental-webgl") : e3.getContext("webgl2");
              } catch (e4) {
                return null;
              }
            }(t2, n2);
            if (!o3)
              return;
            if (e2.setter)
              return void (o3[e2.property] = e2.args[0]);
            const r2 = o3[e2.property], s2 = yield Promise.all(e2.args.map(hn(i2, o3)));
            !function(e3, t3) {
              if (!(null == t3 ? void 0 : t3.constructor))
                return;
              const { name: n3 } = t3.constructor;
              if (!pn.includes(n3))
                return;
              const i3 = un(e3, n3);
              i3.includes(t3) || i3.push(t3);
            }(o3, r2.apply(o3, s2));
          } catch (t3) {
            o2(e2, t3);
          }
        });
      }
      function mn({ event: e2, mutation: t2, target: n2, imageMap: i2, errorHandler: o2 }) {
        return Te(this, void 0, void 0, function* () {
          try {
            const o3 = n2.getContext("2d");
            if (t2.setter)
              return void (o3[t2.property] = t2.args[0]);
            const r2 = o3[t2.property];
            if ("drawImage" === t2.property && "string" == typeof t2.args[0])
              i2.get(e2), r2.apply(o3, t2.args);
            else {
              const e3 = yield Promise.all(t2.args.map(hn(i2, o3)));
              r2.apply(o3, e3);
            }
          } catch (e3) {
            o2(t2, e3);
          }
        });
      }
      function fn({ event: e2, mutation: t2, target: n2, imageMap: i2, canvasEventMap: o2, errorHandler: r2 }) {
        return Te(this, void 0, void 0, function* () {
          try {
            const s2 = o2.get(e2) || t2, a2 = "commands" in s2 ? s2.commands : [s2];
            if ([Ee.WebGL, Ee.WebGL2].includes(t2.type)) {
              for (let e3 = 0; e3 < a2.length; e3++) {
                const o3 = a2[e3];
                yield gn({ mutation: o3, type: t2.type, target: n2, imageMap: i2, errorHandler: r2 });
              }
              return;
            }
            for (let t3 = 0; t3 < a2.length; t3++) {
              const o3 = a2[t3];
              yield mn({ event: e2, mutation: o3, target: n2, imageMap: i2, errorHandler: r2 });
            }
          } catch (e3) {
            r2(t2, e3);
          }
        });
      }
      const yn = Kt || Pt, vn = { duration: 500, lineCap: "round", lineWidth: 3, strokeStyle: "red" };
      function Cn(e2) {
        return e2.type == be.IncrementalSnapshot && (e2.data.source == we.TouchMove || e2.data.source == we.MouseInteraction && e2.data.type == Ne.TouchStart);
      }
      class In {
        constructor(e2, t2) {
          if (this.usingVirtualDom = false, this.virtualDom = new rt(), this.mouseTail = null, this.tailPositions = [], this.emitter = yn(), this.legacy_missingNodeRetryMap = {}, this.cache = le(), this.imageMap = /* @__PURE__ */ new Map(), this.canvasEventMap = /* @__PURE__ */ new Map(), this.mirror = q(), this.styleMirror = new Ae(), this.firstFullSnapshot = null, this.newDocumentQueue = [], this.mousePos = null, this.touchActive = null, this.lastSelectionData = null, this.constructedStyleMutations = [], this.adoptedStyleSheets = [], this.handleResize = (e3) => {
            this.iframe.style.display = "inherit";
            for (const t3 of [this.mouseTail, this.iframe])
              t3 && (t3.setAttribute("width", String(e3.width)), t3.setAttribute("height", String(e3.height)));
          }, this.applyEventsSynchronously = (e3) => {
            for (const t3 of e3) {
              switch (t3.type) {
                case be.DomContentLoaded:
                case be.Load:
                case be.Custom:
                  continue;
                case be.FullSnapshot:
                case be.Meta:
                case be.Plugin:
                case be.IncrementalSnapshot:
              }
              this.getCastFn(t3, true)();
            }
            true === this.touchActive ? this.mouse.classList.add("touch-active") : false === this.touchActive && this.mouse.classList.remove("touch-active"), this.touchActive = null;
          }, this.getCastFn = (e3, t3 = false) => {
            let n3;
            switch (e3.type) {
              case be.DomContentLoaded:
              case be.Load:
                break;
              case be.Custom:
                n3 = () => {
                  this.emitter.emit(Se.CustomEvent, e3);
                };
                break;
              case be.Meta:
                n3 = () => this.emitter.emit(Se.Resize, { width: e3.data.width, height: e3.data.height });
                break;
              case be.FullSnapshot:
                n3 = () => {
                  var n4;
                  if (this.firstFullSnapshot) {
                    if (this.firstFullSnapshot === e3)
                      return void (this.firstFullSnapshot = true);
                  } else
                    this.firstFullSnapshot = true;
                  this.rebuildFullSnapshot(e3, t3), null === (n4 = this.iframe.contentWindow) || void 0 === n4 || n4.scrollTo(e3.data.initialOffset), this.styleMirror.reset();
                };
                break;
              case be.IncrementalSnapshot:
                n3 = () => {
                  if (this.applyIncremental(e3, t3), !t3 && (e3 === this.nextUserInteractionEvent && (this.nextUserInteractionEvent = null, this.backToNormal()), this.config.skipInactive && !this.nextUserInteractionEvent)) {
                    for (const t4 of this.service.state.context.events)
                      if (!(t4.timestamp <= e3.timestamp) && this.isUserInteraction(t4)) {
                        t4.delay - e3.delay > 1e4 * this.speedService.state.context.timer.speed && (this.nextUserInteractionEvent = t4);
                        break;
                      }
                    if (this.nextUserInteractionEvent) {
                      const t4 = this.nextUserInteractionEvent.delay - e3.delay, n4 = { speed: Math.min(Math.round(t4 / 5e3), this.config.maxSpeed) };
                      this.speedService.send({ type: "FAST_FORWARD", payload: n4 }), this.emitter.emit(Se.SkipStart, n4);
                    }
                  }
                };
            }
            return () => {
              n3 && n3();
              for (const n4 of this.config.plugins || [])
                n4.handler && n4.handler(e3, t3, { replayer: this });
              this.service.send({ type: "CAST_EVENT", payload: { event: e3 } });
              const i3 = this.service.state.context.events.length - 1;
              if (e3 === this.service.state.context.events[i3]) {
                const t4 = () => {
                  i3 < this.service.state.context.events.length - 1 || (this.backToNormal(), this.service.send("END"), this.emitter.emit(Se.Finish));
                };
                e3.type === be.IncrementalSnapshot && e3.data.source === we.MouseMove && e3.data.positions.length ? setTimeout(() => {
                  t4();
                }, Math.max(0, 50 - e3.data.positions[0].timeOffset)) : t4();
              }
              this.emitter.emit(Se.EventCast, e3);
            };
          }, !(null == t2 ? void 0 : t2.liveMode) && e2.length < 2)
            throw new Error("Replayer need at least 2 events.");
          const n2 = { speed: 1, maxSpeed: 360, root: document.body, loadTimeout: 0, skipInactive: false, showWarning: true, showDebug: false, blockClass: "rr-block", liveMode: false, insertStyleRules: [], triggerFocus: true, UNSAFE_replayCanvas: false, pauseAnimation: true, mouseTail: vn, useVirtualDom: true };
          this.config = Object.assign({}, n2, t2), this.handleResize = this.handleResize.bind(this), this.getCastFn = this.getCastFn.bind(this), this.applyEventsSynchronously = this.applyEventsSynchronously.bind(this), this.emitter.on(Se.Resize, this.handleResize), this.setupDom();
          for (const e3 of this.config.plugins || [])
            e3.getMirror && e3.getMirror({ nodeMirror: this.mirror });
          this.emitter.on(Se.Flush, () => {
            if (this.usingVirtualDom) {
              const e3 = { mirror: this.mirror, applyCanvas: (e4, t3, n3) => {
                fn({ event: e4, mutation: t3, target: n3, imageMap: this.imageMap, canvasEventMap: this.canvasEventMap, errorHandler: this.warnCanvasMutationFailed.bind(this) });
              }, applyInput: this.applyInput.bind(this), applyScroll: this.applyScroll.bind(this), applyStyleSheetMutation: (e4, t3) => {
                e4.source === we.StyleSheetRule ? this.applyStyleSheetRule(e4, t3) : e4.source === we.StyleDeclaration && this.applyStyleDeclaration(e4, t3);
              } };
              if (this.iframe.contentDocument && nt(this.iframe.contentDocument, this.virtualDom, e3, this.virtualDom.mirror), this.virtualDom.destroyTree(), this.usingVirtualDom = false, Object.keys(this.legacy_missingNodeRetryMap).length)
                for (const t3 in this.legacy_missingNodeRetryMap)
                  try {
                    const n3 = this.legacy_missingNodeRetryMap[t3], i3 = ot(n3.node, this.mirror, this.virtualDom.mirror);
                    nt(i3, n3.node, e3, this.virtualDom.mirror), n3.node = i3;
                  } catch (e4) {
                    this.config.showWarning && console.warn(e4);
                  }
              this.constructedStyleMutations.forEach((e4) => {
                this.applyStyleSheetMutation(e4);
              }), this.constructedStyleMutations = [], this.adoptedStyleSheets.forEach((e4) => {
                this.applyAdoptedStyleSheet(e4);
              }), this.adoptedStyleSheets = [];
            }
            this.mousePos && (this.moveAndHover(this.mousePos.x, this.mousePos.y, this.mousePos.id, true, this.mousePos.debugData), this.mousePos = null), this.lastSelectionData && (this.applySelection(this.lastSelectionData), this.lastSelectionData = null);
          }), this.emitter.on(Se.PlayBack, () => {
            this.firstFullSnapshot = null, this.mirror.reset(), this.styleMirror.reset();
          });
          const i2 = new zt([], { speed: this.config.speed, liveMode: this.config.liveMode });
          this.service = cn({ events: e2.map((e3) => t2 && t2.unpackFn ? t2.unpackFn(e3) : e3).sort((e3, t3) => e3.timestamp - t3.timestamp), timer: i2, timeOffset: 0, baselineTime: 0, lastPlayedEvent: null }, { getCastFn: this.getCastFn, applyEventsSynchronously: this.applyEventsSynchronously, emitter: this.emitter }), this.service.start(), this.service.subscribe((e3) => {
            this.emitter.emit(Se.StateChange, { player: e3 });
          }), this.speedService = ln(sn({ id: "speed", context: { normalSpeed: -1, timer: i2 }, initial: "normal", states: { normal: { on: { FAST_FORWARD: { target: "skipping", actions: ["recordSpeed", "setSpeed"] }, SET_SPEED: { target: "normal", actions: ["setSpeed"] } } }, skipping: { on: { BACK_TO_NORMAL: { target: "normal", actions: ["restoreSpeed"] }, SET_SPEED: { target: "normal", actions: ["setSpeed"] } } } } }, { actions: { setSpeed: (e3, t3) => {
            "payload" in t3 && e3.timer.setSpeed(t3.payload.speed);
          }, recordSpeed: qt({ normalSpeed: (e3) => e3.timer.speed }), restoreSpeed: (e3) => {
            e3.timer.setSpeed(e3.normalSpeed);
          } } })), this.speedService.start(), this.speedService.subscribe((e3) => {
            this.emitter.emit(Se.StateChange, { speed: e3 });
          });
          const o2 = this.service.state.context.events.find((e3) => e3.type === be.Meta), r2 = this.service.state.context.events.find((e3) => e3.type === be.FullSnapshot);
          if (o2) {
            const { width: e3, height: t3 } = o2.data;
            setTimeout(() => {
              this.emitter.emit(Se.Resize, { width: e3, height: t3 });
            }, 0);
          }
          r2 && setTimeout(() => {
            var e3;
            this.firstFullSnapshot || (this.firstFullSnapshot = r2, this.rebuildFullSnapshot(r2), null === (e3 = this.iframe.contentWindow) || void 0 === e3 || e3.scrollTo(r2.data.initialOffset));
          }, 1), this.service.state.context.events.find(Cn) && this.mouse.classList.add("touch-device");
        }
        get timer() {
          return this.service.state.context.timer;
        }
        on(e2, t2) {
          return this.emitter.on(e2, t2), this;
        }
        off(e2, t2) {
          return this.emitter.off(e2, t2), this;
        }
        setConfig(e2) {
          Object.keys(e2).forEach((t2) => {
            e2[t2], this.config[t2] = e2[t2];
          }), this.config.skipInactive || this.backToNormal(), void 0 !== e2.speed && this.speedService.send({ type: "SET_SPEED", payload: { speed: e2.speed } }), void 0 !== e2.mouseTail && (false === e2.mouseTail ? this.mouseTail && (this.mouseTail.style.display = "none") : (this.mouseTail || (this.mouseTail = document.createElement("canvas"), this.mouseTail.width = Number.parseFloat(this.iframe.width), this.mouseTail.height = Number.parseFloat(this.iframe.height), this.mouseTail.classList.add("replayer-mouse-tail"), this.wrapper.insertBefore(this.mouseTail, this.iframe)), this.mouseTail.style.display = "inherit"));
        }
        getMetaData() {
          const e2 = this.service.state.context.events[0], t2 = this.service.state.context.events[this.service.state.context.events.length - 1];
          return { startTime: e2.timestamp, endTime: t2.timestamp, totalTime: t2.timestamp - e2.timestamp };
        }
        getCurrentTime() {
          return this.timer.timeOffset + this.getTimeOffset();
        }
        getTimeOffset() {
          const { baselineTime: e2, events: t2 } = this.service.state.context;
          return e2 - t2[0].timestamp;
        }
        getMirror() {
          return this.mirror;
        }
        play(e2 = 0) {
          var t2, n2;
          this.service.state.matches("paused") || this.service.send({ type: "PAUSE" }), this.service.send({ type: "PLAY", payload: { timeOffset: e2 } }), null === (n2 = null === (t2 = this.iframe.contentDocument) || void 0 === t2 ? void 0 : t2.getElementsByTagName("html")[0]) || void 0 === n2 || n2.classList.remove("rrweb-paused"), this.emitter.emit(Se.Start);
        }
        pause(e2) {
          var t2, n2;
          void 0 === e2 && this.service.state.matches("playing") && this.service.send({ type: "PAUSE" }), "number" == typeof e2 && (this.play(e2), this.service.send({ type: "PAUSE" })), null === (n2 = null === (t2 = this.iframe.contentDocument) || void 0 === t2 ? void 0 : t2.getElementsByTagName("html")[0]) || void 0 === n2 || n2.classList.add("rrweb-paused"), this.emitter.emit(Se.Pause);
        }
        resume(e2 = 0) {
          console.warn("The 'resume' was deprecated in 1.0. Please use 'play' method which has the same interface."), this.play(e2), this.emitter.emit(Se.Resume);
        }
        destroy() {
          this.pause(), this.config.root.removeChild(this.wrapper), this.emitter.emit(Se.Destroy);
        }
        startLive(e2) {
          this.service.send({ type: "TO_LIVE", payload: { baselineTime: e2 } });
        }
        addEvent(e2) {
          const t2 = this.config.unpackFn ? this.config.unpackFn(e2) : e2;
          Cn(t2) && this.mouse.classList.add("touch-device"), Promise.resolve().then(() => this.service.send({ type: "ADD_EVENT", payload: { event: t2 } }));
        }
        enableInteract() {
          this.iframe.setAttribute("scrolling", "auto"), this.iframe.style.pointerEvents = "auto";
        }
        disableInteract() {
          this.iframe.setAttribute("scrolling", "no"), this.iframe.style.pointerEvents = "none";
        }
        resetCache() {
          this.cache = le();
        }
        setupDom() {
          this.wrapper = document.createElement("div"), this.wrapper.classList.add("replayer-wrapper"), this.config.root.appendChild(this.wrapper), this.mouse = document.createElement("div"), this.mouse.classList.add("replayer-mouse"), this.wrapper.appendChild(this.mouse), false !== this.config.mouseTail && (this.mouseTail = document.createElement("canvas"), this.mouseTail.classList.add("replayer-mouse-tail"), this.mouseTail.style.display = "inherit", this.wrapper.appendChild(this.mouseTail)), this.iframe = document.createElement("iframe");
          const e2 = ["allow-same-origin"];
          this.config.UNSAFE_replayCanvas && e2.push("allow-scripts"), this.iframe.style.display = "none", this.iframe.setAttribute("sandbox", e2.join(" ")), this.disableInteract(), this.wrapper.appendChild(this.iframe), this.iframe.contentWindow && this.iframe.contentDocument && (Qt(this.iframe.contentWindow, this.iframe.contentDocument), function(e3 = window) {
            "NodeList" in e3 && !e3.NodeList.prototype.forEach && (e3.NodeList.prototype.forEach = Array.prototype.forEach), "DOMTokenList" in e3 && !e3.DOMTokenList.prototype.forEach && (e3.DOMTokenList.prototype.forEach = Array.prototype.forEach), Node.prototype.contains || (Node.prototype.contains = (...e4) => {
              let t2 = e4[0];
              if (!(0 in e4))
                throw new TypeError("1 argument is required");
              do {
                if (this === t2)
                  return true;
              } while (t2 = t2 && t2.parentNode);
              return false;
            });
          }(this.iframe.contentWindow));
        }
        rebuildFullSnapshot(e2, t2 = false) {
          if (!this.iframe.contentDocument)
            return console.warn("Looks like your replayer has been destroyed.");
          Object.keys(this.legacy_missingNodeRetryMap).length && console.warn("Found unresolved missing node map", this.legacy_missingNodeRetryMap), this.legacy_missingNodeRetryMap = {};
          const n2 = [], i2 = (e3, t3) => {
            this.collectIframeAndAttachDocument(n2, e3);
            for (const n3 of this.config.plugins || [])
              n3.onBuild && n3.onBuild(e3, { id: t3, replayer: this });
          };
          ue(e2.data.node, { doc: this.iframe.contentDocument, afterAppend: i2, cache: this.cache, mirror: this.mirror }), i2(this.iframe.contentDocument, e2.data.node.id);
          for (const { mutationInQueue: e3, builtNode: t3 } of n2)
            this.attachDocumentToIframe(e3, t3), this.newDocumentQueue = this.newDocumentQueue.filter((t4) => t4 !== e3);
          const { documentElement: o2, head: r2 } = this.iframe.contentDocument;
          this.insertStyleRules(o2, r2), this.service.state.matches("playing") || this.iframe.contentDocument.getElementsByTagName("html")[0].classList.add("rrweb-paused"), this.emitter.emit(Se.FullsnapshotRebuilded, e2), t2 || this.waitForStylesheetLoad(), this.config.UNSAFE_replayCanvas && this.preloadAllImages();
        }
        insertStyleRules(e2, t2) {
          var n2;
          const i2 = (o2 = this.config.blockClass, [`.${o2} { background: currentColor }`, "noscript { display: none !important; }"]).concat(this.config.insertStyleRules);
          var o2;
          if (this.config.pauseAnimation && i2.push("html.rrweb-paused *, html.rrweb-paused *:before, html.rrweb-paused *:after { animation-play-state: paused !important; }"), this.usingVirtualDom) {
            const n3 = this.virtualDom.createElement("style");
            this.virtualDom.mirror.add(n3, vt(n3, this.virtualDom.unserializedId)), e2.insertBefore(n3, t2), n3.rules.push({ source: we.StyleSheetRule, adds: i2.map((e3, t3) => ({ rule: e3, index: t3 })) });
          } else {
            const o3 = document.createElement("style");
            e2.insertBefore(o3, t2);
            for (let e3 = 0; e3 < i2.length; e3++)
              null === (n2 = o3.sheet) || void 0 === n2 || n2.insertRule(i2[e3], e3);
          }
        }
        attachDocumentToIframe(e2, t2) {
          const n2 = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror, i2 = [], o2 = (e3, o3) => {
            this.collectIframeAndAttachDocument(i2, e3);
            const r2 = n2.getMeta(e3);
            if ((null == r2 ? void 0 : r2.type) === X.Element && "HTML" === (null == r2 ? void 0 : r2.tagName.toUpperCase())) {
              const { documentElement: e4, head: n3 } = t2.contentDocument;
              this.insertStyleRules(e4, n3);
            }
            for (const t3 of this.config.plugins || [])
              t3.onBuild && t3.onBuild(e3, { id: o3, replayer: this });
          };
          de(e2.node, { doc: t2.contentDocument, mirror: n2, hackCss: true, skipChild: false, afterAppend: o2, cache: this.cache }), o2(t2.contentDocument, e2.node.id);
          for (const { mutationInQueue: e3, builtNode: t3 } of i2)
            this.attachDocumentToIframe(e3, t3), this.newDocumentQueue = this.newDocumentQueue.filter((t4) => t4 !== e3);
        }
        collectIframeAndAttachDocument(e2, t2) {
          if (fe(t2, this.mirror)) {
            const n2 = this.newDocumentQueue.find((e3) => e3.parentId === this.mirror.getId(t2));
            n2 && e2.push({ mutationInQueue: n2, builtNode: t2 });
          }
        }
        waitForStylesheetLoad() {
          var e2;
          const t2 = null === (e2 = this.iframe.contentDocument) || void 0 === e2 ? void 0 : e2.head;
          if (t2) {
            const e3 = /* @__PURE__ */ new Set();
            let n2, i2 = this.service.state;
            const o2 = () => {
              i2 = this.service.state;
            };
            this.emitter.on(Se.Start, o2), this.emitter.on(Se.Pause, o2);
            const r2 = () => {
              this.emitter.off(Se.Start, o2), this.emitter.off(Se.Pause, o2);
            };
            t2.querySelectorAll('link[rel="stylesheet"]').forEach((t3) => {
              t3.sheet || (e3.add(t3), t3.addEventListener("load", () => {
                e3.delete(t3), 0 === e3.size && -1 !== n2 && (i2.matches("playing") && this.play(this.getCurrentTime()), this.emitter.emit(Se.LoadStylesheetEnd), n2 && clearTimeout(n2), r2());
              }));
            }), e3.size > 0 && (this.service.send({ type: "PAUSE" }), this.emitter.emit(Se.LoadStylesheetStart), n2 = setTimeout(() => {
              i2.matches("playing") && this.play(this.getCurrentTime()), n2 = -1, r2();
            }, this.config.loadTimeout));
          }
        }
        preloadAllImages() {
          return Te(this, void 0, void 0, function* () {
            this.service.state;
            const e2 = () => {
              this.service.state;
            };
            this.emitter.on(Se.Start, e2), this.emitter.on(Se.Pause, e2);
            const t2 = [];
            for (const e3 of this.service.state.context.events)
              if (e3.type === be.IncrementalSnapshot && e3.data.source === we.CanvasMutation) {
                t2.push(this.deserializeAndPreloadCanvasEvents(e3.data, e3));
                ("commands" in e3.data ? e3.data.commands : [e3.data]).forEach((t3) => {
                  this.preloadImages(t3, e3);
                });
              }
            return Promise.all(t2);
          });
        }
        preloadImages(e2, t2) {
          if ("drawImage" === e2.property && "string" == typeof e2.args[0] && !this.imageMap.has(t2)) {
            const t3 = document.createElement("canvas"), n2 = t3.getContext("2d"), i2 = null == n2 ? void 0 : n2.createImageData(t3.width, t3.height);
            null == i2 || i2.data, JSON.parse(e2.args[0]), null == n2 || n2.putImageData(i2, 0, 0);
          }
        }
        deserializeAndPreloadCanvasEvents(e2, t2) {
          return Te(this, void 0, void 0, function* () {
            if (!this.canvasEventMap.has(t2)) {
              const n2 = { isUnchanged: true };
              if ("commands" in e2) {
                const i2 = yield Promise.all(e2.commands.map((e3) => Te(this, void 0, void 0, function* () {
                  const t3 = yield Promise.all(e3.args.map(hn(this.imageMap, null, n2)));
                  return Object.assign(Object.assign({}, e3), { args: t3 });
                })));
                false === n2.isUnchanged && this.canvasEventMap.set(t2, Object.assign(Object.assign({}, e2), { commands: i2 }));
              } else {
                const i2 = yield Promise.all(e2.args.map(hn(this.imageMap, null, n2)));
                false === n2.isUnchanged && this.canvasEventMap.set(t2, Object.assign(Object.assign({}, e2), { args: i2 }));
              }
            }
          });
        }
        applyIncremental(e2, t2) {
          var n2, i2, o2;
          const { data: r2 } = e2;
          switch (r2.source) {
            case we.Mutation:
              try {
                this.applyMutation(r2, t2);
              } catch (e3) {
                this.warn(`Exception in mutation ${e3.message || e3}`, r2);
              }
              break;
            case we.Drag:
            case we.TouchMove:
            case we.MouseMove:
              if (t2) {
                const e3 = r2.positions[r2.positions.length - 1];
                this.mousePos = { x: e3.x, y: e3.y, id: e3.id, debugData: r2 };
              } else
                r2.positions.forEach((n3) => {
                  const i3 = { doAction: () => {
                    this.moveAndHover(n3.x, n3.y, n3.id, t2, r2);
                  }, delay: n3.timeOffset + e2.timestamp - this.service.state.context.baselineTime };
                  this.timer.addAction(i3);
                }), this.timer.addAction({ doAction() {
                }, delay: e2.delay - (null === (n2 = r2.positions[0]) || void 0 === n2 ? void 0 : n2.timeOffset) });
              break;
            case we.MouseInteraction: {
              if (-1 === r2.id || t2)
                break;
              const e3 = new Event(Ne[r2.type].toLowerCase()), n3 = this.mirror.getNode(r2.id);
              if (!n3)
                return this.debugNodeNotFound(r2, r2.id);
              this.emitter.emit(Se.MouseInteraction, { type: r2.type, target: n3 });
              const { triggerFocus: i3 } = this.config;
              switch (r2.type) {
                case Ne.Blur:
                  "blur" in n3 && n3.blur();
                  break;
                case Ne.Focus:
                  i3 && n3.focus && n3.focus({ preventScroll: true });
                  break;
                case Ne.Click:
                case Ne.TouchStart:
                case Ne.TouchEnd:
                  t2 ? (r2.type === Ne.TouchStart ? this.touchActive = true : r2.type === Ne.TouchEnd && (this.touchActive = false), this.mousePos = { x: r2.x, y: r2.y, id: r2.id, debugData: r2 }) : (r2.type === Ne.TouchStart && (this.tailPositions.length = 0), this.moveAndHover(r2.x, r2.y, r2.id, t2, r2), r2.type === Ne.Click ? (this.mouse.classList.remove("active"), this.mouse.offsetWidth, this.mouse.classList.add("active")) : r2.type === Ne.TouchStart ? (this.mouse.offsetWidth, this.mouse.classList.add("touch-active")) : r2.type === Ne.TouchEnd && this.mouse.classList.remove("touch-active"));
                  break;
                case Ne.TouchCancel:
                  t2 ? this.touchActive = false : this.mouse.classList.remove("touch-active");
                  break;
                default:
                  n3.dispatchEvent(e3);
              }
              break;
            }
            case we.Scroll:
              if (-1 === r2.id)
                break;
              if (this.usingVirtualDom) {
                const e3 = this.virtualDom.mirror.getNode(r2.id);
                if (!e3)
                  return this.debugNodeNotFound(r2, r2.id);
                e3.scrollData = r2;
                break;
              }
              this.applyScroll(r2, t2);
              break;
            case we.ViewportResize:
              this.emitter.emit(Se.Resize, { width: r2.width, height: r2.height });
              break;
            case we.Input:
              if (-1 === r2.id)
                break;
              if (this.usingVirtualDom) {
                const e3 = this.virtualDom.mirror.getNode(r2.id);
                if (!e3)
                  return this.debugNodeNotFound(r2, r2.id);
                e3.inputData = r2;
                break;
              }
              this.applyInput(r2);
              break;
            case we.MediaInteraction: {
              const e3 = this.usingVirtualDom ? this.virtualDom.mirror.getNode(r2.id) : this.mirror.getNode(r2.id);
              if (!e3)
                return this.debugNodeNotFound(r2, r2.id);
              const t3 = e3;
              try {
                r2.currentTime && (t3.currentTime = r2.currentTime), r2.volume && (t3.volume = r2.volume), r2.muted && (t3.muted = r2.muted), 1 === r2.type && t3.pause(), 0 === r2.type && t3.play(), 4 === r2.type && (t3.playbackRate = r2.playbackRate);
              } catch (e4) {
                this.config.showWarning && console.warn(`Failed to replay media interactions: ${e4.message || e4}`);
              }
              break;
            }
            case we.StyleSheetRule:
            case we.StyleDeclaration:
              this.usingVirtualDom ? r2.styleId ? this.constructedStyleMutations.push(r2) : r2.id && (null === (i2 = this.virtualDom.mirror.getNode(r2.id)) || void 0 === i2 || i2.rules.push(r2)) : this.applyStyleSheetMutation(r2);
              break;
            case we.CanvasMutation:
              if (!this.config.UNSAFE_replayCanvas)
                return;
              if (this.usingVirtualDom) {
                const t3 = this.virtualDom.mirror.getNode(r2.id);
                if (!t3)
                  return this.debugNodeNotFound(r2, r2.id);
                t3.canvasMutations.push({ event: e2, mutation: r2 });
              } else {
                const t3 = this.mirror.getNode(r2.id);
                if (!t3)
                  return this.debugNodeNotFound(r2, r2.id);
                fn({ event: e2, mutation: r2, target: t3, imageMap: this.imageMap, canvasEventMap: this.canvasEventMap, errorHandler: this.warnCanvasMutationFailed.bind(this) });
              }
              break;
            case we.Font:
              try {
                const e3 = new FontFace(r2.family, r2.buffer ? new Uint8Array(JSON.parse(r2.fontSource)) : r2.fontSource, r2.descriptors);
                null === (o2 = this.iframe.contentDocument) || void 0 === o2 || o2.fonts.add(e3);
              } catch (e3) {
                this.config.showWarning && console.warn(e3);
              }
              break;
            case we.Selection:
              if (t2) {
                this.lastSelectionData = r2;
                break;
              }
              this.applySelection(r2);
              break;
            case we.AdoptedStyleSheet:
              this.usingVirtualDom ? this.adoptedStyleSheets.push(r2) : this.applyAdoptedStyleSheet(r2);
          }
        }
        applyMutation(e2, t2) {
          if (this.config.useVirtualDom && !this.usingVirtualDom && t2 && (this.usingVirtualDom = true, ft(this.iframe.contentDocument, this.mirror, this.virtualDom), Object.keys(this.legacy_missingNodeRetryMap).length))
            for (const e3 in this.legacy_missingNodeRetryMap)
              try {
                const t3 = this.legacy_missingNodeRetryMap[e3], n3 = mt(t3.node, this.virtualDom, this.mirror);
                n3 && (t3.node = n3);
              } catch (e4) {
                this.config.showWarning && console.warn(e4);
              }
          const n2 = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror;
          e2.removes.forEach((t3) => {
            var i3;
            const o3 = n2.getNode(t3.id);
            if (!o3) {
              if (e2.removes.find((e3) => e3.id === t3.parentId))
                return;
              return this.warnNodeNotFound(e2, t3.id);
            }
            let r3 = n2.getNode(t3.parentId);
            if (!r3)
              return this.warnNodeNotFound(e2, t3.parentId);
            if (t3.isShadow && ve(r3) && (r3 = r3.shadowRoot), n2.removeNodeFromMap(o3), r3)
              try {
                r3.removeChild(o3), this.usingVirtualDom && "#text" === o3.nodeName && "STYLE" === r3.nodeName && (null === (i3 = r3.rules) || void 0 === i3 ? void 0 : i3.length) > 0 && (r3.rules = []);
              } catch (t4) {
                if (!(t4 instanceof DOMException))
                  throw t4;
                this.warn("parent could not remove child in mutation", r3, o3, e2);
              }
          });
          const i2 = Object.assign({}, this.legacy_missingNodeRetryMap), o2 = [], r2 = (e3) => {
            var t3;
            if (!this.iframe.contentDocument)
              return console.warn("Looks like your replayer has been destroyed.");
            let r3 = n2.getNode(e3.parentId);
            if (!r3)
              return e3.node.type === X.Document ? this.newDocumentQueue.push(e3) : o2.push(e3);
            e3.node.isShadow && (ve(r3) || r3.attachShadow({ mode: "open" }), r3 = r3.shadowRoot);
            let s3 = null, a2 = null;
            if (e3.previousId && (s3 = n2.getNode(e3.previousId)), e3.nextId && (a2 = n2.getNode(e3.nextId)), ((e4) => {
              let t4 = null;
              return e4.nextId && (t4 = n2.getNode(e4.nextId)), null !== e4.nextId && void 0 !== e4.nextId && -1 !== e4.nextId && !t4;
            })(e3))
              return o2.push(e3);
            if (e3.node.rootId && !n2.getNode(e3.node.rootId))
              return;
            const l2 = e3.node.rootId ? n2.getNode(e3.node.rootId) : this.usingVirtualDom ? this.virtualDom : this.iframe.contentDocument;
            if (fe(r3, n2))
              return void this.attachDocumentToIframe(e3, r3);
            const c2 = (e4, t4) => {
              for (const n3 of this.config.plugins || [])
                n3.onBuild && n3.onBuild(e4, { id: t4, replayer: this });
            }, d2 = de(e3.node, { doc: l2, mirror: n2, skipChild: true, hackCss: true, cache: this.cache, afterAppend: c2 });
            if (-1 === e3.previousId || -1 === e3.nextId)
              return void (i2[e3.node.id] = { node: d2, mutation: e3 });
            const u2 = n2.getMeta(r3);
            if (u2 && u2.type === X.Element && "textarea" === u2.tagName && e3.node.type === X.Text) {
              const e4 = Array.isArray(r3.childNodes) ? r3.childNodes : Array.from(r3.childNodes);
              for (const t4 of e4)
                t4.nodeType === r3.TEXT_NODE && r3.removeChild(t4);
            }
            if (s3 && s3.nextSibling && s3.nextSibling.parentNode)
              r3.insertBefore(d2, s3.nextSibling);
            else if (a2 && a2.parentNode)
              r3.contains(a2) ? r3.insertBefore(d2, a2) : r3.insertBefore(d2, null);
            else {
              if (r3 === l2)
                for (; l2.firstChild; )
                  l2.removeChild(l2.firstChild);
              r3.appendChild(d2);
            }
            if (c2(d2, e3.node.id), this.usingVirtualDom && "#text" === d2.nodeName && "STYLE" === r3.nodeName && (null === (t3 = r3.rules) || void 0 === t3 ? void 0 : t3.length) > 0 && (r3.rules = []), fe(d2, this.mirror)) {
              const e4 = this.mirror.getId(d2), t4 = this.newDocumentQueue.find((t5) => t5.parentId === e4);
              t4 && (this.attachDocumentToIframe(t4, d2), this.newDocumentQueue = this.newDocumentQueue.filter((e5) => e5 !== t4));
            }
            (e3.previousId || e3.nextId) && this.legacy_resolveMissingNode(i2, r3, d2, e3);
          };
          e2.adds.forEach((e3) => {
            r2(e3);
          });
          const s2 = Date.now();
          for (; o2.length; ) {
            const e3 = ge(o2);
            if (o2.length = 0, Date.now() - s2 > 500) {
              this.warn("Timeout in the loop, please check the resolve tree data:", e3);
              break;
            }
            for (const t3 of e3) {
              n2.getNode(t3.value.parentId) ? me(t3, (e4) => {
                r2(e4);
              }) : this.debug("Drop resolve tree since there is no parent for the root node.", t3);
            }
          }
          Object.keys(i2).length && Object.assign(this.legacy_missingNodeRetryMap, i2), function(e3) {
            const t3 = /* @__PURE__ */ new Set(), n3 = [];
            for (let i3 = e3.length; i3--; ) {
              const o3 = e3[i3];
              t3.has(o3.id) || (n3.push(o3), t3.add(o3.id));
            }
            return n3;
          }(e2.texts).forEach((t3) => {
            var i3;
            const o3 = n2.getNode(t3.id);
            if (!o3) {
              if (e2.removes.find((e3) => e3.id === t3.id))
                return;
              return this.warnNodeNotFound(e2, t3.id);
            }
            if (o3.textContent = t3.value, this.usingVirtualDom) {
              const e3 = o3.parentNode;
              (null === (i3 = null == e3 ? void 0 : e3.rules) || void 0 === i3 ? void 0 : i3.length) > 0 && (e3.rules = []);
            }
          }), e2.attributes.forEach((t3) => {
            const i3 = n2.getNode(t3.id);
            if (!i3) {
              if (e2.removes.find((e3) => e3.id === t3.id))
                return;
              return this.warnNodeNotFound(e2, t3.id);
            }
            for (const e3 in t3.attributes)
              if ("string" == typeof e3) {
                const o3 = t3.attributes[e3];
                if (null === o3)
                  i3.removeAttribute(e3);
                else if ("string" == typeof o3)
                  try {
                    if ("_cssText" === e3 && ("LINK" === i3.nodeName || "STYLE" === i3.nodeName))
                      try {
                        const e4 = n2.getMeta(i3);
                        Object.assign(e4.attributes, t3.attributes);
                        const o4 = de(e4, { doc: i3.ownerDocument, mirror: n2, skipChild: true, hackCss: true, cache: this.cache }), r3 = i3.nextSibling, s3 = i3.parentNode;
                        if (o4 && s3) {
                          s3.removeChild(i3), s3.insertBefore(o4, r3), n2.replace(t3.id, o4);
                          break;
                        }
                      } catch (e4) {
                      }
                    i3.setAttribute(e3, o3);
                  } catch (e4) {
                    this.config.showWarning && console.warn("An error occurred may due to the checkout feature.", e4);
                  }
                else if ("style" === e3) {
                  const e4 = o3, t4 = i3;
                  for (const n3 in e4)
                    if (false === e4[n3])
                      t4.style.removeProperty(n3);
                    else if (e4[n3] instanceof Array) {
                      const i4 = e4[n3];
                      t4.style.setProperty(n3, i4[0], i4[1]);
                    } else {
                      const i4 = e4[n3];
                      t4.style.setProperty(n3, i4);
                    }
                }
              }
          });
        }
        applyScroll(e2, t2) {
          var n2, i2;
          const o2 = this.mirror.getNode(e2.id);
          if (!o2)
            return this.debugNodeNotFound(e2, e2.id);
          const r2 = this.mirror.getMeta(o2);
          if (o2 === this.iframe.contentDocument)
            null === (n2 = this.iframe.contentWindow) || void 0 === n2 || n2.scrollTo({ top: e2.y, left: e2.x, behavior: t2 ? "auto" : "smooth" });
          else if ((null == r2 ? void 0 : r2.type) === X.Document)
            null === (i2 = o2.defaultView) || void 0 === i2 || i2.scrollTo({ top: e2.y, left: e2.x, behavior: t2 ? "auto" : "smooth" });
          else
            try {
              o2.scrollTo({ top: e2.y, left: e2.x, behavior: t2 ? "auto" : "smooth" });
            } catch (e3) {
            }
        }
        applyInput(e2) {
          const t2 = this.mirror.getNode(e2.id);
          if (!t2)
            return this.debugNodeNotFound(e2, e2.id);
          try {
            t2.checked = e2.isChecked, t2.value = e2.text;
          } catch (e3) {
          }
        }
        applySelection(e2) {
          try {
            const t2 = /* @__PURE__ */ new Set(), n2 = e2.ranges.map(({ start: e3, startOffset: n3, end: i2, endOffset: o2 }) => {
              const r2 = this.mirror.getNode(e3), s2 = this.mirror.getNode(i2);
              if (!r2 || !s2)
                return;
              const a2 = new Range();
              a2.setStart(r2, n3), a2.setEnd(s2, o2);
              const l2 = r2.ownerDocument, c2 = null == l2 ? void 0 : l2.getSelection();
              return c2 && t2.add(c2), { range: a2, selection: c2 };
            });
            t2.forEach((e3) => e3.removeAllRanges()), n2.forEach((e3) => {
              var t3;
              return e3 && (null === (t3 = e3.selection) || void 0 === t3 ? void 0 : t3.addRange(e3.range));
            });
          } catch (e3) {
          }
        }
        applyStyleSheetMutation(e2) {
          var t2;
          let n2 = null;
          e2.styleId ? n2 = this.styleMirror.getStyle(e2.styleId) : e2.id && (n2 = (null === (t2 = this.mirror.getNode(e2.id)) || void 0 === t2 ? void 0 : t2.sheet) || null), n2 && (e2.source === we.StyleSheetRule ? this.applyStyleSheetRule(e2, n2) : e2.source === we.StyleDeclaration && this.applyStyleDeclaration(e2, n2));
        }
        applyStyleSheetRule(e2, t2) {
          var n2, i2, o2, r2;
          if (null === (n2 = e2.adds) || void 0 === n2 || n2.forEach(({ rule: e3, index: n3 }) => {
            try {
              if (Array.isArray(n3)) {
                const { positions: i3, index: o3 } = Ie(n3);
                Ce(t2.cssRules, i3).insertRule(e3, o3);
              } else {
                const i3 = void 0 === n3 ? void 0 : Math.min(n3, t2.cssRules.length);
                null == t2 || t2.insertRule(e3, i3);
              }
            } catch (e4) {
            }
          }), null === (i2 = e2.removes) || void 0 === i2 || i2.forEach(({ index: e3 }) => {
            try {
              if (Array.isArray(e3)) {
                const { positions: n3, index: i3 } = Ie(e3);
                Ce(t2.cssRules, n3).deleteRule(i3 || 0);
              } else
                null == t2 || t2.deleteRule(e3);
            } catch (e4) {
            }
          }), e2.replace)
            try {
              null === (o2 = t2.replace) || void 0 === o2 || o2.call(t2, e2.replace);
            } catch (e3) {
            }
          if (e2.replaceSync)
            try {
              null === (r2 = t2.replaceSync) || void 0 === r2 || r2.call(t2, e2.replaceSync);
            } catch (e3) {
            }
        }
        applyStyleDeclaration(e2, t2) {
          if (e2.set) {
            Ce(t2.rules, e2.index).style.setProperty(e2.set.property, e2.set.value, e2.set.priority);
          }
          if (e2.remove) {
            Ce(t2.rules, e2.index).style.removeProperty(e2.remove.property);
          }
        }
        applyAdoptedStyleSheet(e2) {
          var t2;
          const n2 = this.mirror.getNode(e2.id);
          if (!n2)
            return;
          null === (t2 = e2.styles) || void 0 === t2 || t2.forEach((e3) => {
            var t3;
            let i3 = null, o3 = null;
            if (ve(n2) ? o3 = (null === (t3 = n2.ownerDocument) || void 0 === t3 ? void 0 : t3.defaultView) || null : "#document" === n2.nodeName && (o3 = n2.defaultView), o3)
              try {
                i3 = new o3.CSSStyleSheet(), this.styleMirror.add(i3, e3.styleId), this.applyStyleSheetRule({ source: we.StyleSheetRule, adds: e3.rules }, i3);
              } catch (e4) {
              }
          });
          let i2 = 0;
          const o2 = (e3, t3) => {
            const n3 = t3.map((e4) => this.styleMirror.getStyle(e4)).filter((e4) => null !== e4);
            ve(e3) ? e3.shadowRoot.adoptedStyleSheets = n3 : "#document" === e3.nodeName && (e3.adoptedStyleSheets = n3), n3.length !== t3.length && i2 < 10 && (setTimeout(() => o2(e3, t3), 0 + 100 * i2), i2++);
          };
          o2(n2, e2.styleIds);
        }
        legacy_resolveMissingNode(e2, t2, n2, i2) {
          const { previousId: o2, nextId: r2 } = i2, s2 = o2 && e2[o2], a2 = r2 && e2[r2];
          if (s2) {
            const { node: i3, mutation: o3 } = s2;
            t2.insertBefore(i3, n2), delete e2[o3.node.id], delete this.legacy_missingNodeRetryMap[o3.node.id], (o3.previousId || o3.nextId) && this.legacy_resolveMissingNode(e2, t2, i3, o3);
          }
          if (a2) {
            const { node: i3, mutation: o3 } = a2;
            t2.insertBefore(i3, n2.nextSibling), delete e2[o3.node.id], delete this.legacy_missingNodeRetryMap[o3.node.id], (o3.previousId || o3.nextId) && this.legacy_resolveMissingNode(e2, t2, i3, o3);
          }
        }
        moveAndHover(e2, t2, n2, i2, o2) {
          const r2 = this.mirror.getNode(n2);
          if (!r2)
            return this.debugNodeNotFound(o2, n2);
          const s2 = ye(r2, this.iframe), a2 = e2 * s2.absoluteScale + s2.x, l2 = t2 * s2.absoluteScale + s2.y;
          this.mouse.style.left = `${a2}px`, this.mouse.style.top = `${l2}px`, i2 || this.drawMouseTail({ x: a2, y: l2 }), this.hoverElements(r2);
        }
        drawMouseTail(e2) {
          if (!this.mouseTail)
            return;
          const { lineCap: t2, lineWidth: n2, strokeStyle: i2, duration: o2 } = true === this.config.mouseTail ? vn : Object.assign({}, vn, this.config.mouseTail), r2 = () => {
            if (!this.mouseTail)
              return;
            const e3 = this.mouseTail.getContext("2d");
            e3 && this.tailPositions.length && (e3.clearRect(0, 0, this.mouseTail.width, this.mouseTail.height), e3.beginPath(), e3.lineWidth = n2, e3.lineCap = t2, e3.strokeStyle = i2, e3.moveTo(this.tailPositions[0].x, this.tailPositions[0].y), this.tailPositions.forEach((t3) => e3.lineTo(t3.x, t3.y)), e3.stroke());
          };
          this.tailPositions.push(e2), r2(), setTimeout(() => {
            this.tailPositions = this.tailPositions.filter((t3) => t3 !== e2), r2();
          }, o2 / this.speedService.state.context.timer.speed);
        }
        hoverElements(e2) {
          var t2;
          null === (t2 = this.iframe.contentDocument) || void 0 === t2 || t2.querySelectorAll(".\\:hover").forEach((e3) => {
            e3.classList.remove(":hover");
          });
          let n2 = e2;
          for (; n2; )
            n2.classList && n2.classList.add(":hover"), n2 = n2.parentElement;
        }
        isUserInteraction(e2) {
          return e2.type === be.IncrementalSnapshot && (e2.data.source > we.Mutation && e2.data.source <= we.Input);
        }
        backToNormal() {
          this.nextUserInteractionEvent = null, this.speedService.state.matches("normal") || (this.speedService.send({ type: "BACK_TO_NORMAL" }), this.emitter.emit(Se.SkipEnd, { speed: this.speedService.state.context.normalSpeed }));
        }
        warnNodeNotFound(e2, t2) {
          this.warn(`Node with id '${t2}' not found. `, e2);
        }
        warnCanvasMutationFailed(e2, t2) {
          this.warn("Has error on canvas update", t2, "canvas mutation:", e2);
        }
        debugNodeNotFound(e2, t2) {
          this.debug("[replayer]", `Node with id '${t2}' not found. `, e2);
        }
        warn(...e2) {
          this.config.showWarning && console.warn("[replayer]", ...e2);
        }
        debug(...e2) {
          this.config.showDebug && console.log("[replayer]", ...e2);
        }
      }
      function An(e2) {
        let t2 = "";
        return Object.keys(e2).forEach((n2) => {
          t2 += `${n2}: ${e2[n2]};`;
        }), t2;
      }
      function bn(e2, t2 = 2) {
        let n2 = String(e2);
        const i2 = Math.pow(10, t2 - 1);
        if (e2 < i2)
          for (; String(i2).length > n2.length; )
            n2 = `0${e2}`;
        return n2;
      }
      function wn(e2) {
        if (e2 <= 0)
          return "00:00";
        const t2 = Math.floor(e2 / 36e5);
        e2 %= 36e5;
        const n2 = Math.floor(e2 / 6e4);
        e2 %= 6e4;
        const i2 = Math.floor(e2 / 1e3);
        return t2 ? `${bn(t2)}:${bn(n2)}:${bn(i2)}` : `${bn(n2)}:${bn(i2)}`;
      }
      function Nn() {
        let e2 = false;
        return ["fullscreen", "webkitIsFullScreen", "mozFullScreen", "msFullscreenElement"].forEach((t2) => {
          t2 in document && (e2 = e2 || Boolean(document[t2]));
        }), e2;
      }
      function En(e2) {
        return { "[object Boolean]": "boolean", "[object Number]": "number", "[object String]": "string", "[object Function]": "function", "[object Array]": "array", "[object Date]": "date", "[object RegExp]": "regExp", "[object Undefined]": "undefined", "[object Null]": "null", "[object Object]": "object" }[Object.prototype.toString.call(e2)];
      }
      function Sn(e2) {
        return e2.type === be.IncrementalSnapshot && (e2.data.source > we.Mutation && e2.data.source <= we.Input);
      }
      function Tn(t2) {
        let n2, i2, o2, r2, s2, a2, u2, p2, C2;
        return { c() {
          n2 = h("div"), i2 = h("input"), o2 = m(), r2 = h("label"), s2 = m(), a2 = h("span"), u2 = g(t2[3]), y(i2, "type", "checkbox"), y(i2, "id", t2[2]), i2.disabled = t2[1], y(i2, "class", "svelte-9brlez"), y(r2, "for", t2[2]), y(r2, "class", "svelte-9brlez"), y(a2, "class", "label svelte-9brlez"), y(n2, "class", "switch svelte-9brlez"), I(n2, "disabled", t2[1]);
        }, m(e2, d2) {
          c(e2, n2, d2), l(n2, i2), i2.checked = t2[0], l(n2, o2), l(n2, r2), l(n2, s2), l(n2, a2), l(a2, u2), p2 || (C2 = f(i2, "change", t2[4]), p2 = true);
        }, p(e2, [t3]) {
          4 & t3 && y(i2, "id", e2[2]), 2 & t3 && (i2.disabled = e2[1]), 1 & t3 && (i2.checked = e2[0]), 4 & t3 && y(r2, "for", e2[2]), 8 & t3 && v(u2, e2[3]), 2 & t3 && I(n2, "disabled", e2[1]);
        }, i: e, o: e, d(e2) {
          e2 && d(n2), p2 = false, C2();
        } };
      }
      function Dn(e2, t2, n2) {
        let { disabled: i2 } = t2, { checked: o2 } = t2, { id: r2 } = t2, { label: s2 } = t2;
        return e2.$$set = (e3) => {
          "disabled" in e3 && n2(1, i2 = e3.disabled), "checked" in e3 && n2(0, o2 = e3.checked), "id" in e3 && n2(2, r2 = e3.id), "label" in e3 && n2(3, s2 = e3.label);
        }, [o2, i2, r2, s2, function() {
          o2 = this.checked, n2(0, o2);
        }];
      }
      class Mn extends J {
        constructor(e2) {
          super(), z(this, e2, Dn, Tn, s, { disabled: 1, checked: 0, id: 2, label: 3 });
        }
      }
      function Rn(e2, t2, n2) {
        const i2 = e2.slice();
        return i2[39] = t2[n2], i2;
      }
      function xn(e2, t2, n2) {
        const i2 = e2.slice();
        return i2[42] = t2[n2], i2;
      }
      function kn(e2, t2, n2) {
        const i2 = e2.slice();
        return i2[45] = t2[n2], i2;
      }
      function Fn(e2) {
        let t2, n2, i2, r2, s2, a2, p2, A2, b2, w2, N2, E2, S2, T2, M2, x2, k2, F2, O2, B2, L2, V2, _2, G2, W2, U2, Q2 = wn(e2[6]) + "", z2 = wn(e2[8].totalTime) + "", J2 = e2[14], X2 = [];
        for (let t3 = 0; t3 < J2.length; t3 += 1)
          X2[t3] = On(kn(e2, J2, t3));
        let H2 = e2[9], j2 = [];
        for (let t3 = 0; t3 < H2.length; t3 += 1)
          j2[t3] = Bn(xn(e2, H2, t3));
        function q2(e3, t3) {
          return "playing" === e3[7] ? Vn : Ln;
        }
        let ee2 = q2(e2), te2 = ee2(e2), ne2 = e2[3], ie2 = [];
        for (let t3 = 0; t3 < ne2.length; t3 += 1)
          ie2[t3] = _n(Rn(e2, ne2, t3));
        function oe2(t3) {
          e2[30](t3);
        }
        let re2 = { id: "skip", disabled: "skipping" === e2[10], label: "skip inactive" };
        return void 0 !== e2[0] && (re2.checked = e2[0]), B2 = new Mn({ props: re2 }), D.push(() => function(e3, t3, n3) {
          const i3 = e3.$$.props[t3];
          void 0 !== i3 && (e3.$$.bound[i3] = n3, n3(e3.$$.ctx[i3]));
        }(B2, "checked", oe2)), { c() {
          t2 = h("div"), n2 = h("div"), i2 = h("span"), r2 = g(Q2), s2 = m(), a2 = h("div"), p2 = h("div"), A2 = m();
          for (let e3 = 0; e3 < X2.length; e3 += 1)
            X2[e3].c();
          b2 = m();
          for (let e3 = 0; e3 < j2.length; e3 += 1)
            j2[e3].c();
          w2 = m(), N2 = h("div"), E2 = m(), S2 = h("span"), T2 = g(z2), M2 = m(), x2 = h("div"), k2 = h("button"), te2.c(), F2 = m();
          for (let e3 = 0; e3 < ie2.length; e3 += 1)
            ie2[e3].c();
          O2 = m(), K(B2.$$.fragment), V2 = m(), _2 = h("button"), _2.innerHTML = '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M916 380c-26.4 0-48-21.6-48-48L868 223.2 613.6 477.6c-18.4\n            18.4-48.8 18.4-68 0-18.4-18.4-18.4-48.8 0-68L800 156 692 156c-26.4\n            0-48-21.6-48-48 0-26.4 21.6-48 48-48l224 0c26.4 0 48 21.6 48 48l0\n            224C964 358.4 942.4 380 916 380zM231.2 860l108.8 0c26.4 0 48 21.6 48\n            48s-21.6 48-48 48l-224 0c-26.4 0-48-21.6-48-48l0-224c0-26.4 21.6-48\n            48-48 26.4 0 48 21.6 48 48L164 792l253.6-253.6c18.4-18.4 48.8-18.4\n            68 0 18.4 18.4 18.4 48.8 0 68L231.2 860z" p-id="1286"></path></svg>', y(i2, "class", "rr-timeline__time svelte-19ke1iv"), y(p2, "class", "rr-progress__step svelte-19ke1iv"), C(p2, "width", e2[13]), y(N2, "class", "rr-progress__handler svelte-19ke1iv"), C(N2, "left", e2[13]), y(a2, "class", "rr-progress svelte-19ke1iv"), I(a2, "disabled", "skipping" === e2[10]), y(S2, "class", "rr-timeline__time svelte-19ke1iv"), y(n2, "class", "rr-timeline svelte-19ke1iv"), y(k2, "class", "svelte-19ke1iv"), y(_2, "class", "svelte-19ke1iv"), y(x2, "class", "rr-controller__btns svelte-19ke1iv"), y(t2, "class", "rr-controller svelte-19ke1iv");
        }, m(o2, d2) {
          c(o2, t2, d2), l(t2, n2), l(n2, i2), l(i2, r2), l(n2, s2), l(n2, a2), l(a2, p2), e2[27](p2), l(a2, A2);
          for (let e3 = 0; e3 < X2.length; e3 += 1)
            X2[e3].m(a2, null);
          l(a2, b2);
          for (let e3 = 0; e3 < j2.length; e3 += 1)
            j2[e3].m(a2, null);
          l(a2, w2), l(a2, N2), e2[28](a2), l(n2, E2), l(n2, S2), l(S2, T2), l(t2, M2), l(t2, x2), l(x2, k2), te2.m(k2, null), l(x2, F2);
          for (let e3 = 0; e3 < ie2.length; e3 += 1)
            ie2[e3].m(x2, null);
          l(x2, O2), Y(B2, x2, null), l(x2, V2), l(x2, _2), G2 = true, W2 || (U2 = [f(a2, "click", e2[16]), f(k2, "click", e2[4]), f(_2, "click", e2[31])], W2 = true);
        }, p(e3, t3) {
          if ((!G2 || 64 & t3[0]) && Q2 !== (Q2 = wn(e3[6]) + "") && v(r2, Q2), (!G2 || 8192 & t3[0]) && C(p2, "width", e3[13]), 16384 & t3[0]) {
            let n4;
            for (J2 = e3[14], n4 = 0; n4 < J2.length; n4 += 1) {
              const i4 = kn(e3, J2, n4);
              X2[n4] ? X2[n4].p(i4, t3) : (X2[n4] = On(i4), X2[n4].c(), X2[n4].m(a2, b2));
            }
            for (; n4 < X2.length; n4 += 1)
              X2[n4].d(1);
            X2.length = J2.length;
          }
          if (512 & t3[0]) {
            let n4;
            for (H2 = e3[9], n4 = 0; n4 < H2.length; n4 += 1) {
              const i4 = xn(e3, H2, n4);
              j2[n4] ? j2[n4].p(i4, t3) : (j2[n4] = Bn(i4), j2[n4].c(), j2[n4].m(a2, w2));
            }
            for (; n4 < j2.length; n4 += 1)
              j2[n4].d(1);
            j2.length = H2.length;
          }
          if ((!G2 || 8192 & t3[0]) && C(N2, "left", e3[13]), 1024 & t3[0] && I(a2, "disabled", "skipping" === e3[10]), (!G2 || 256 & t3[0]) && z2 !== (z2 = wn(e3[8].totalTime) + "") && v(T2, z2), ee2 !== (ee2 = q2(e3)) && (te2.d(1), te2 = ee2(e3), te2 && (te2.c(), te2.m(k2, null))), 1066 & t3[0]) {
            let n4;
            for (ne2 = e3[3], n4 = 0; n4 < ne2.length; n4 += 1) {
              const i4 = Rn(e3, ne2, n4);
              ie2[n4] ? ie2[n4].p(i4, t3) : (ie2[n4] = _n(i4), ie2[n4].c(), ie2[n4].m(x2, O2));
            }
            for (; n4 < ie2.length; n4 += 1)
              ie2[n4].d(1);
            ie2.length = ne2.length;
          }
          const n3 = {};
          var i3;
          1024 & t3[0] && (n3.disabled = "skipping" === e3[10]), !L2 && 1 & t3[0] && (L2 = true, n3.checked = e3[0], i3 = () => L2 = false, R.push(i3)), B2.$set(n3);
        }, i(e3) {
          G2 || (Z(B2.$$.fragment, e3), G2 = true);
        }, o(e3) {
          $(B2.$$.fragment, e3), G2 = false;
        }, d(n3) {
          n3 && d(t2), e2[27](null), u(X2, n3), u(j2, n3), e2[28](null), te2.d(), u(ie2, n3), P(B2), W2 = false, o(U2);
        } };
      }
      function On(e2) {
        let t2, n2;
        return { c() {
          t2 = h("div"), y(t2, "title", n2 = e2[45].name), C(t2, "width", e2[45].width), C(t2, "height", "4px"), C(t2, "position", "absolute"), C(t2, "background", e2[45].background), C(t2, "left", e2[45].position);
        }, m(e3, n3) {
          c(e3, t2, n3);
        }, p(e3, i2) {
          16384 & i2[0] && n2 !== (n2 = e3[45].name) && y(t2, "title", n2), 16384 & i2[0] && C(t2, "width", e3[45].width), 16384 & i2[0] && C(t2, "background", e3[45].background), 16384 & i2[0] && C(t2, "left", e3[45].position);
        }, d(e3) {
          e3 && d(t2);
        } };
      }
      function Bn(e2) {
        let t2, n2;
        return { c() {
          t2 = h("div"), y(t2, "title", n2 = e2[42].name), C(t2, "width", "10px"), C(t2, "height", "5px"), C(t2, "position", "absolute"), C(t2, "top", "2px"), C(t2, "transform", "translate(-50%, -50%)"), C(t2, "background", e2[42].background), C(t2, "left", e2[42].position);
        }, m(e3, n3) {
          c(e3, t2, n3);
        }, p(e3, i2) {
          512 & i2[0] && n2 !== (n2 = e3[42].name) && y(t2, "title", n2), 512 & i2[0] && C(t2, "background", e3[42].background), 512 & i2[0] && C(t2, "left", e3[42].position);
        }, d(e3) {
          e3 && d(t2);
        } };
      }
      function Ln(e2) {
        let t2, n2;
        return { c() {
          t2 = p("svg"), n2 = p("path"), y(n2, "d", "M170.65984 896l0-768 640 384zM644.66944\n              512l-388.66944-233.32864 0 466.65728z"), y(t2, "class", "icon"), y(t2, "viewBox", "0 0 1024 1024"), y(t2, "version", "1.1"), y(t2, "xmlns", "http://www.w3.org/2000/svg"), y(t2, "xmlns:xlink", "http://www.w3.org/1999/xlink"), y(t2, "width", "16"), y(t2, "height", "16");
        }, m(e3, i2) {
          c(e3, t2, i2), l(t2, n2);
        }, d(e3) {
          e3 && d(t2);
        } };
      }
      function Vn(e2) {
        let t2, n2;
        return { c() {
          t2 = p("svg"), n2 = p("path"), y(n2, "d", "M682.65984 128q53.00224 0 90.50112 37.49888t37.49888 90.50112l0\n              512q0 53.00224-37.49888 90.50112t-90.50112\n              37.49888-90.50112-37.49888-37.49888-90.50112l0-512q0-53.00224\n              37.49888-90.50112t90.50112-37.49888zM341.34016 128q53.00224 0\n              90.50112 37.49888t37.49888 90.50112l0 512q0 53.00224-37.49888\n              90.50112t-90.50112\n              37.49888-90.50112-37.49888-37.49888-90.50112l0-512q0-53.00224\n              37.49888-90.50112t90.50112-37.49888zM341.34016 213.34016q-17.67424\n              0-30.16704 12.4928t-12.4928 30.16704l0 512q0 17.67424 12.4928\n              30.16704t30.16704 12.4928 30.16704-12.4928\n              12.4928-30.16704l0-512q0-17.67424-12.4928-30.16704t-30.16704-12.4928zM682.65984\n              213.34016q-17.67424 0-30.16704 12.4928t-12.4928 30.16704l0 512q0\n              17.67424 12.4928 30.16704t30.16704 12.4928 30.16704-12.4928\n              12.4928-30.16704l0-512q0-17.67424-12.4928-30.16704t-30.16704-12.4928z"), y(t2, "class", "icon"), y(t2, "viewBox", "0 0 1024 1024"), y(t2, "version", "1.1"), y(t2, "xmlns", "http://www.w3.org/2000/svg"), y(t2, "xmlns:xlink", "http://www.w3.org/1999/xlink"), y(t2, "width", "16"), y(t2, "height", "16");
        }, m(e3, i2) {
          c(e3, t2, i2), l(t2, n2);
        }, d(e3) {
          e3 && d(t2);
        } };
      }
      function _n(e2) {
        let t2, n2, i2, o2, r2, s2, a2 = e2[39] + "";
        function u2() {
          return e2[29](e2[39]);
        }
        return { c() {
          t2 = h("button"), n2 = g(a2), i2 = g("x"), t2.disabled = o2 = "skipping" === e2[10], y(t2, "class", "svelte-19ke1iv"), I(t2, "active", e2[39] === e2[1] && "skipping" !== e2[10]);
        }, m(e3, o3) {
          c(e3, t2, o3), l(t2, n2), l(t2, i2), r2 || (s2 = f(t2, "click", u2), r2 = true);
        }, p(i3, r3) {
          e2 = i3, 8 & r3[0] && a2 !== (a2 = e2[39] + "") && v(n2, a2), 1024 & r3[0] && o2 !== (o2 = "skipping" === e2[10]) && (t2.disabled = o2), 1034 & r3[0] && I(t2, "active", e2[39] === e2[1] && "skipping" !== e2[10]);
        }, d(e3) {
          e3 && d(t2), r2 = false, s2();
        } };
      }
      function Gn(e2) {
        let t2, n2, i2 = e2[2] && Fn(e2);
        return { c() {
          i2 && i2.c(), t2 = g("");
        }, m(e3, o2) {
          i2 && i2.m(e3, o2), c(e3, t2, o2), n2 = true;
        }, p(e3, n3) {
          e3[2] ? i2 ? (i2.p(e3, n3), 4 & n3[0] && Z(i2, 1)) : (i2 = Fn(e3), i2.c(), Z(i2, 1), i2.m(t2.parentNode, t2)) : i2 && (W(), $(i2, 1, 1, () => {
            i2 = null;
          }), U());
        }, i(e3) {
          n2 || (Z(i2), n2 = true);
        }, o(e3) {
          $(i2), n2 = false;
        }, d(e3) {
          i2 && i2.d(e3), e3 && d(t2);
        } };
      }
      function Wn(e2, t2, n2) {
        return (100 - (t2 - n2) / (t2 - e2) * 100).toFixed(2);
      }
      function Un(e2, t2, n2) {
        const i2 = S();
        let o2, r2, s2, a2, l2, c2, d2, u2, h2, p2, { replayer: g2 } = t2, { showController: m2 } = t2, { autoPlay: f2 } = t2, { skipInactive: y2 } = t2, { speedOption: v2 } = t2, { speed: C2 = v2.length ? v2[0] : 1 } = t2, { tags: I2 = {} } = t2, { inactiveColor: A2 } = t2, b2 = 0, T2 = null, M2 = false, R2 = null;
        const x2 = () => {
          T2 && (cancelAnimationFrame(T2), T2 = null);
        }, k2 = () => {
          "paused" === o2 && (l2 ? (g2.play(), l2 = false) : g2.play(b2));
        }, F2 = () => {
          "playing" === o2 && (g2.pause(), M2 = false);
        }, O2 = (e3, t3) => {
          n2(6, b2 = e3), M2 = false;
          ("boolean" == typeof t3 ? t3 : "playing" === o2) ? g2.play(e3) : g2.pause(e3);
        }, B2 = (e3, t3, i3 = false, o3) => {
          R2 = i3 ? { start: e3, end: t3 } : null, n2(6, b2 = e3), M2 = t3, c2 = o3, g2.play(e3);
        }, L2 = (e3) => {
          let t3 = "playing" === o2;
          n2(1, C2 = e3), t3 && g2.pause(), g2.setConfig({ speed: C2 }), t3 && g2.play(b2);
        };
        var V2;
        N(() => {
          n2(7, o2 = g2.service.state.value), n2(10, r2 = g2.speedService.state.value), g2.on("state-change", (e3) => {
            const { player: t3, speed: i3 } = e3;
            if ((null == t3 ? void 0 : t3.value) && o2 !== t3.value)
              switch (n2(7, o2 = t3.value), o2) {
                case "playing":
                  x2(), T2 = requestAnimationFrame(function e4() {
                    n2(6, b2 = g2.getCurrentTime()), M2 && b2 >= M2 && (R2 ? B2(R2.start, R2.end, true, void 0) : (g2.pause(), c2 && (c2(), c2 = null))), b2 < d2.totalTime && (T2 = requestAnimationFrame(e4));
                  });
                  break;
                case "paused":
                  x2();
              }
            (null == i3 ? void 0 : i3.value) && r2 !== i3.value && n2(10, r2 = i3.value);
          }), g2.on("finish", () => {
            l2 = true, c2 && (c2(), c2 = null);
          }), f2 && g2.play();
        }), V2 = () => {
          y2 !== g2.config.skipInactive && g2.setConfig({ skipInactive: y2 });
        }, w().$$.after_update.push(V2), E(() => {
          g2.pause(), x2();
        });
        return e2.$$set = (e3) => {
          "replayer" in e3 && n2(17, g2 = e3.replayer), "showController" in e3 && n2(2, m2 = e3.showController), "autoPlay" in e3 && n2(18, f2 = e3.autoPlay), "skipInactive" in e3 && n2(0, y2 = e3.skipInactive), "speedOption" in e3 && n2(3, v2 = e3.speedOption), "speed" in e3 && n2(1, C2 = e3.speed), "tags" in e3 && n2(19, I2 = e3.tags), "inactiveColor" in e3 && n2(20, A2 = e3.inactiveColor);
        }, e2.$$.update = () => {
          if (64 & e2.$$.dirty[0] && i2("ui-update-current-time", { payload: b2 }), 128 & e2.$$.dirty[0] && i2("ui-update-player-state", { payload: o2 }), 131072 & e2.$$.dirty[0] && n2(8, d2 = g2.getMetaData()), 320 & e2.$$.dirty[0]) {
            const e3 = Math.min(1, b2 / d2.totalTime);
            n2(13, u2 = 100 * e3 + "%"), i2("ui-update-progress", { payload: e3 });
          }
          655360 & e2.$$.dirty[0] && n2(9, h2 = (() => {
            const { context: e3 } = g2.service.state, t3 = e3.events.length, n3 = e3.events[0].timestamp, i3 = e3.events[t3 - 1].timestamp, o3 = [];
            return e3.events.forEach((e4) => {
              if (e4.type === be.Custom) {
                const t4 = { name: e4.data.tag, background: I2[e4.data.tag] || "rgb(73, 80, 246)", position: `${Wn(n3, i3, e4.timestamp)}%` };
                o3.push(t4);
              }
            }), o3;
          })()), 1179648 & e2.$$.dirty[0] && n2(14, p2 = (() => {
            try {
              const { context: e3 } = g2.service.state, t3 = e3.events.length, n3 = e3.events[0].timestamp, i3 = e3.events[t3 - 1].timestamp, o3 = function(e4) {
                const t4 = [];
                let n4 = e4[0].timestamp;
                for (const i4 of e4)
                  Sn(i4) && (i4.timestamp - n4 > 1e4 && t4.push([n4, i4.timestamp]), n4 = i4.timestamp);
                return t4;
              }(e3.events), r3 = (e4, t4, n4, i4) => ((i4 - n4) / (t4 - e4) * 100).toFixed(2);
              return o3.map((e4) => ({ name: "inactive period", background: A2, position: `${Wn(n3, i3, e4[0])}%`, width: `${r3(n3, i3, e4[0], e4[1])}%` }));
            } catch (e3) {
              return [];
            }
          })());
        }, [y2, C2, m2, v2, () => {
          switch (o2) {
            case "playing":
              F2();
              break;
            case "paused":
              k2();
          }
        }, L2, b2, o2, d2, h2, r2, s2, a2, u2, p2, i2, (e3) => {
          if ("skipping" === r2)
            return;
          const t3 = s2.getBoundingClientRect();
          let n3 = (e3.clientX - t3.left) / t3.width;
          n3 < 0 ? n3 = 0 : n3 > 1 && (n3 = 1);
          const i3 = d2.totalTime * n3;
          l2 = false, O2(i3);
        }, g2, f2, I2, A2, k2, F2, O2, B2, () => {
          n2(0, y2 = !y2);
        }, () => Promise.resolve().then(() => {
          n2(8, d2 = g2.getMetaData());
        }), function(e3) {
          D[e3 ? "unshift" : "push"](() => {
            a2 = e3, n2(12, a2);
          });
        }, function(e3) {
          D[e3 ? "unshift" : "push"](() => {
            s2 = e3, n2(11, s2);
          });
        }, (e3) => L2(e3), function(e3) {
          y2 = e3, n2(0, y2);
        }, () => i2("fullscreen")];
      }
      class Zn extends J {
        constructor(e2) {
          super(), z(this, e2, Un, Gn, s, { replayer: 17, showController: 2, autoPlay: 18, skipInactive: 0, speedOption: 3, speed: 1, tags: 19, inactiveColor: 20, toggle: 4, play: 21, pause: 22, goto: 23, playRange: 24, setSpeed: 5, toggleSkipInactive: 25, triggerUpdateMeta: 26 }, null, [-1, -1]);
        }
        get toggle() {
          return this.$$.ctx[4];
        }
        get play() {
          return this.$$.ctx[21];
        }
        get pause() {
          return this.$$.ctx[22];
        }
        get goto() {
          return this.$$.ctx[23];
        }
        get playRange() {
          return this.$$.ctx[24];
        }
        get setSpeed() {
          return this.$$.ctx[5];
        }
        get toggleSkipInactive() {
          return this.$$.ctx[25];
        }
        get triggerUpdateMeta() {
          return this.$$.ctx[26];
        }
      }
      function $n(e2) {
        let t2, n2, i2 = { replayer: e2[7], showController: e2[3], autoPlay: e2[1], speedOption: e2[2], skipInactive: e2[0], tags: e2[4], inactiveColor: e2[5] };
        return t2 = new Zn({ props: i2 }), e2[32](t2), t2.$on("fullscreen", e2[33]), { c() {
          K(t2.$$.fragment);
        }, m(e3, i3) {
          Y(t2, e3, i3), n2 = true;
        }, p(e3, n3) {
          const i3 = {};
          128 & n3[0] && (i3.replayer = e3[7]), 8 & n3[0] && (i3.showController = e3[3]), 2 & n3[0] && (i3.autoPlay = e3[1]), 4 & n3[0] && (i3.speedOption = e3[2]), 1 & n3[0] && (i3.skipInactive = e3[0]), 16 & n3[0] && (i3.tags = e3[4]), 32 & n3[0] && (i3.inactiveColor = e3[5]), t2.$set(i3);
        }, i(e3) {
          n2 || (Z(t2.$$.fragment, e3), n2 = true);
        }, o(e3) {
          $(t2.$$.fragment, e3), n2 = false;
        }, d(n3) {
          e2[32](null), P(t2, n3);
        } };
      }
      function Kn(e2) {
        let t2, n2, i2, o2, r2 = e2[7] && $n(e2);
        return { c() {
          t2 = h("div"), n2 = h("div"), i2 = m(), r2 && r2.c(), y(n2, "class", "rr-player__frame"), y(n2, "style", e2[11]), y(t2, "class", "rr-player"), y(t2, "style", e2[12]);
        }, m(s2, a2) {
          c(s2, t2, a2), l(t2, n2), e2[31](n2), l(t2, i2), r2 && r2.m(t2, null), e2[34](t2), o2 = true;
        }, p(e3, i3) {
          (!o2 || 2048 & i3[0]) && y(n2, "style", e3[11]), e3[7] ? r2 ? (r2.p(e3, i3), 128 & i3[0] && Z(r2, 1)) : (r2 = $n(e3), r2.c(), Z(r2, 1), r2.m(t2, null)) : r2 && (W(), $(r2, 1, 1, () => {
            r2 = null;
          }), U()), (!o2 || 4096 & i3[0]) && y(t2, "style", e3[12]);
        }, i(e3) {
          o2 || (Z(r2), o2 = true);
        }, o(e3) {
          $(r2), o2 = false;
        }, d(n3) {
          n3 && d(t2), e2[31](null), r2 && r2.d(), e2[34](null);
        } };
      }
      function Yn(e2, n2, i2) {
        let o2, { width: r2 = 1024 } = n2, { height: s2 = 576 } = n2, { maxScale: l2 = 1 } = n2, { events: c2 = [] } = n2, { skipInactive: d2 = true } = n2, { autoPlay: u2 = true } = n2, { speedOption: h2 = [1, 2, 4, 8] } = n2, { speed: p2 = 1 } = n2, { showController: g2 = true } = n2, { tags: m2 = {} } = n2, { inactiveColor: f2 = "#D4D4D4" } = n2;
        let y2, v2, C2, I2, A2, b2, w2 = r2, S2 = s2;
        const T2 = (e3, t2) => {
          const n3 = [r2 / t2.width, s2 / t2.height];
          l2 && n3.push(l2), e3.style.transform = `scale(${Math.min(...n3)})translate(-50%, -50%)`;
        }, M2 = () => {
          var e3;
          y2 && (Nn() ? document.exitFullscreen ? document.exitFullscreen() : document.mozExitFullscreen ? document.mozExitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen() : (e3 = y2).requestFullscreen ? e3.requestFullscreen() : e3.mozRequestFullScreen ? e3.mozRequestFullScreen() : e3.webkitRequestFullscreen ? e3.webkitRequestFullscreen() : e3.msRequestFullscreen && e3.msRequestFullscreen());
        };
        N(() => {
          if (void 0 !== h2 && "array" !== En(h2))
            throw new Error("speedOption must be array");
          if (h2.forEach((e4) => {
            if ("number" !== En(e4))
              throw new Error("item of speedOption must be number");
          }), h2.indexOf(p2) < 0)
            throw new Error(`speed must be one of speedOption,
        current config:
        {
          ...
          speed: ${p2},
          speedOption: [${h2.toString()}]
          ...
        }
        `);
          var e3;
          i2(7, o2 = new In(c2, Object.assign({ speed: p2, root: v2, unpackFn: $t }, n2))), o2.on("resize", (e4) => {
            T2(o2.wrapper, e4);
          }), e3 = () => {
            Nn() ? setTimeout(() => {
              w2 = r2, S2 = s2, i2(13, r2 = y2.offsetWidth), i2(14, s2 = y2.offsetHeight - (g2 ? 80 : 0)), T2(o2.wrapper, { width: o2.iframe.offsetWidth, height: o2.iframe.offsetHeight });
            }, 0) : (i2(13, r2 = w2), i2(14, s2 = S2), T2(o2.wrapper, { width: o2.iframe.offsetWidth, height: o2.iframe.offsetHeight }));
          }, document.addEventListener("fullscreenchange", e3), document.addEventListener("webkitfullscreenchange", e3), document.addEventListener("mozfullscreenchange", e3), document.addEventListener("MSFullscreenChange", e3), C2 = () => {
            document.removeEventListener("fullscreenchange", e3), document.removeEventListener("webkitfullscreenchange", e3), document.removeEventListener("mozfullscreenchange", e3), document.removeEventListener("MSFullscreenChange", e3);
          };
        }), E(() => {
          C2 && C2();
        });
        return e2.$$set = (e3) => {
          i2(39, n2 = t(t({}, n2), a(e3))), "width" in e3 && i2(13, r2 = e3.width), "height" in e3 && i2(14, s2 = e3.height), "maxScale" in e3 && i2(15, l2 = e3.maxScale), "events" in e3 && i2(16, c2 = e3.events), "skipInactive" in e3 && i2(0, d2 = e3.skipInactive), "autoPlay" in e3 && i2(1, u2 = e3.autoPlay), "speedOption" in e3 && i2(2, h2 = e3.speedOption), "speed" in e3 && i2(17, p2 = e3.speed), "showController" in e3 && i2(3, g2 = e3.showController), "tags" in e3 && i2(4, m2 = e3.tags), "inactiveColor" in e3 && i2(5, f2 = e3.inactiveColor);
        }, e2.$$.update = () => {
          24576 & e2.$$.dirty[0] && i2(11, A2 = An({ width: `${r2}px`, height: `${s2}px` })), 24584 & e2.$$.dirty[0] && i2(12, b2 = An({ width: `${r2}px`, height: `${s2 + (g2 ? 80 : 0)}px` }));
        }, n2 = a(n2), [d2, u2, h2, g2, m2, f2, M2, o2, y2, v2, I2, A2, b2, r2, s2, l2, c2, p2, () => o2.getMirror(), () => {
          T2(o2.wrapper, { width: o2.iframe.offsetWidth, height: o2.iframe.offsetHeight });
        }, (e3, t2) => {
          switch (o2.on(e3, t2), e3) {
            case "ui-update-current-time":
            case "ui-update-progress":
            case "ui-update-player-state":
              I2.$on(e3, ({ detail: e4 }) => t2(e4));
          }
        }, (e3) => {
          o2.addEvent(e3), I2.triggerUpdateMeta();
        }, () => o2.getMetaData(), () => o2, () => {
          I2.toggle();
        }, (e3) => {
          I2.setSpeed(e3);
        }, () => {
          I2.toggleSkipInactive();
        }, () => {
          I2.play();
        }, () => {
          I2.pause();
        }, (e3, t2) => {
          I2.goto(e3, t2);
        }, (e3, t2, n3 = false, i3) => {
          I2.playRange(e3, t2, n3, i3);
        }, function(e3) {
          D[e3 ? "unshift" : "push"](() => {
            v2 = e3, i2(9, v2);
          });
        }, function(e3) {
          D[e3 ? "unshift" : "push"](() => {
            I2 = e3, i2(10, I2);
          });
        }, () => M2(), function(e3) {
          D[e3 ? "unshift" : "push"](() => {
            y2 = e3, i2(8, y2);
          });
        }];
      }
      class Pn extends J {
        constructor(e2) {
          super(), z(this, e2, Yn, Kn, s, { width: 13, height: 14, maxScale: 15, events: 16, skipInactive: 0, autoPlay: 1, speedOption: 2, speed: 17, showController: 3, tags: 4, inactiveColor: 5, getMirror: 18, triggerResize: 19, toggleFullscreen: 6, addEventListener: 20, addEvent: 21, getMetaData: 22, getReplayer: 23, toggle: 24, setSpeed: 25, toggleSkipInactive: 26, play: 27, pause: 28, goto: 29, playRange: 30 }, null, [-1, -1]);
        }
        get getMirror() {
          return this.$$.ctx[18];
        }
        get triggerResize() {
          return this.$$.ctx[19];
        }
        get toggleFullscreen() {
          return this.$$.ctx[6];
        }
        get addEventListener() {
          return this.$$.ctx[20];
        }
        get addEvent() {
          return this.$$.ctx[21];
        }
        get getMetaData() {
          return this.$$.ctx[22];
        }
        get getReplayer() {
          return this.$$.ctx[23];
        }
        get toggle() {
          return this.$$.ctx[24];
        }
        get setSpeed() {
          return this.$$.ctx[25];
        }
        get toggleSkipInactive() {
          return this.$$.ctx[26];
        }
        get play() {
          return this.$$.ctx[27];
        }
        get pause() {
          return this.$$.ctx[28];
        }
        get goto() {
          return this.$$.ctx[29];
        }
        get playRange() {
          return this.$$.ctx[30];
        }
      }
      class Qn extends Pn {
        constructor(e2) {
          super({ target: e2.target, props: e2.data || e2.props });
        }
      }
      var EventType$1 = /* @__PURE__ */ ((EventType2) => {
        EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType2[EventType2["Load"] = 1] = "Load";
        EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
        EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType2[EventType2["Meta"] = 4] = "Meta";
        EventType2[EventType2["Custom"] = 5] = "Custom";
        EventType2[EventType2["Plugin"] = 6] = "Plugin";
        return EventType2;
      })(EventType$1 || {});
      var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
        IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
        IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
        IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
        IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
        IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
        IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
        IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
        IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
        IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
        IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
        IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
        IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
        IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
        IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
        IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
        IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
        return IncrementalSource2;
      })(IncrementalSource || {});
      var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
      var fleb = new u8([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        0,
        /* unused */
        0,
        0,
        /* impossible */
        0
      ]);
      var fdeb = new u8([
        0,
        0,
        0,
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        4,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        /* unused */
        0,
        0
      ]);
      var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
      var freb = function(eb, start) {
        var b2 = new u16(31);
        for (var i2 = 0; i2 < 31; ++i2) {
          b2[i2] = start += 1 << eb[i2 - 1];
        }
        var r2 = new u32(b2[30]);
        for (var i2 = 1; i2 < 30; ++i2) {
          for (var j2 = b2[i2]; j2 < b2[i2 + 1]; ++j2) {
            r2[j2] = j2 - b2[i2] << 5 | i2;
          }
        }
        return [b2, r2];
      };
      var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
      fl[28] = 258, revfl[258] = 28;
      var _b = freb(fdeb, 0), fd = _b[0];
      var rev = new u16(32768);
      for (var i = 0; i < 32768; ++i) {
        var x = (i & 43690) >>> 1 | (i & 21845) << 1;
        x = (x & 52428) >>> 2 | (x & 13107) << 2;
        x = (x & 61680) >>> 4 | (x & 3855) << 4;
        rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1;
      }
      var hMap = function(cd, mb, r2) {
        var s2 = cd.length;
        var i2 = 0;
        var l2 = new u16(mb);
        for (; i2 < s2; ++i2)
          ++l2[cd[i2] - 1];
        var le2 = new u16(mb);
        for (i2 = 0; i2 < mb; ++i2) {
          le2[i2] = le2[i2 - 1] + l2[i2 - 1] << 1;
        }
        var co;
        if (r2) {
          co = new u16(1 << mb);
          var rvb = 15 - mb;
          for (i2 = 0; i2 < s2; ++i2) {
            if (cd[i2]) {
              var sv = i2 << 4 | cd[i2];
              var r_1 = mb - cd[i2];
              var v2 = le2[cd[i2] - 1]++ << r_1;
              for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
                co[rev[v2] >>> rvb] = sv;
              }
            }
          }
        } else {
          co = new u16(s2);
          for (i2 = 0; i2 < s2; ++i2)
            co[i2] = rev[le2[cd[i2] - 1]++] >>> 15 - cd[i2];
        }
        return co;
      };
      var flt = new u8(288);
      for (var i = 0; i < 144; ++i)
        flt[i] = 8;
      for (var i = 144; i < 256; ++i)
        flt[i] = 9;
      for (var i = 256; i < 280; ++i)
        flt[i] = 7;
      for (var i = 280; i < 288; ++i)
        flt[i] = 8;
      var fdt = new u8(32);
      for (var i = 0; i < 32; ++i)
        fdt[i] = 5;
      var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
      var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
      var max = function(a2) {
        var m2 = a2[0];
        for (var i2 = 1; i2 < a2.length; ++i2) {
          if (a2[i2] > m2)
            m2 = a2[i2];
        }
        return m2;
      };
      var bits = function(d2, p2, m2) {
        var o2 = p2 / 8 >> 0;
        return (d2[o2] | d2[o2 + 1] << 8) >>> (p2 & 7) & m2;
      };
      var bits16 = function(d2, p2) {
        var o2 = p2 / 8 >> 0;
        return (d2[o2] | d2[o2 + 1] << 8 | d2[o2 + 2] << 16) >>> (p2 & 7);
      };
      var shft = function(p2) {
        return (p2 / 8 >> 0) + (p2 & 7 && 1);
      };
      var slc = function(v2, s2, e2) {
        if (s2 == null || s2 < 0)
          s2 = 0;
        if (e2 == null || e2 > v2.length)
          e2 = v2.length;
        var n2 = new (v2 instanceof u16 ? u16 : v2 instanceof u32 ? u32 : u8)(e2 - s2);
        n2.set(v2.subarray(s2, e2));
        return n2;
      };
      var inflt = function(dat, buf, st2) {
        var sl = dat.length;
        var noBuf = !buf || st2;
        var noSt = !st2 || st2.i;
        if (!st2)
          st2 = {};
        if (!buf)
          buf = new u8(sl * 3);
        var cbuf = function(l3) {
          var bl = buf.length;
          if (l3 > bl) {
            var nbuf = new u8(Math.max(bl * 2, l3));
            nbuf.set(buf);
            buf = nbuf;
          }
        };
        var final = st2.f || 0, pos = st2.p || 0, bt2 = st2.b || 0, lm = st2.l, dm = st2.d, lbt = st2.m, dbt = st2.n;
        var tbts = sl * 8;
        do {
          if (!lm) {
            st2.f = final = bits(dat, pos, 1);
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
              var s2 = shft(pos) + 4, l2 = dat[s2 - 4] | dat[s2 - 3] << 8, t2 = s2 + l2;
              if (t2 > sl) {
                if (noSt)
                  throw "unexpected EOF";
                break;
              }
              if (noBuf)
                cbuf(bt2 + l2);
              buf.set(dat.subarray(s2, t2), bt2);
              st2.b = bt2 += l2, st2.p = pos = t2 * 8;
              continue;
            } else if (type == 1)
              lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
              var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
              var tl = hLit + bits(dat, pos + 5, 31) + 1;
              pos += 14;
              var ldt = new u8(tl);
              var clt = new u8(19);
              for (var i2 = 0; i2 < hcLen; ++i2) {
                clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
              }
              pos += hcLen * 3;
              var clb = max(clt), clbmsk = (1 << clb) - 1;
              if (!noSt && pos + tl * (clb + 7) > tbts)
                break;
              var clm = hMap(clt, clb, 1);
              for (var i2 = 0; i2 < tl; ) {
                var r2 = clm[bits(dat, pos, clbmsk)];
                pos += r2 & 15;
                var s2 = r2 >>> 4;
                if (s2 < 16) {
                  ldt[i2++] = s2;
                } else {
                  var c2 = 0, n2 = 0;
                  if (s2 == 16)
                    n2 = 3 + bits(dat, pos, 3), pos += 2, c2 = ldt[i2 - 1];
                  else if (s2 == 17)
                    n2 = 3 + bits(dat, pos, 7), pos += 3;
                  else if (s2 == 18)
                    n2 = 11 + bits(dat, pos, 127), pos += 7;
                  while (n2--)
                    ldt[i2++] = c2;
                }
              }
              var lt2 = ldt.subarray(0, hLit), dt2 = ldt.subarray(hLit);
              lbt = max(lt2);
              dbt = max(dt2);
              lm = hMap(lt2, lbt, 1);
              dm = hMap(dt2, dbt, 1);
            } else
              throw "invalid block type";
            if (pos > tbts)
              throw "unexpected EOF";
          }
          if (noBuf)
            cbuf(bt2 + 131072);
          var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
          var mxa = lbt + dbt + 18;
          while (noSt || pos + mxa < tbts) {
            var c2 = lm[bits16(dat, pos) & lms], sym = c2 >>> 4;
            pos += c2 & 15;
            if (pos > tbts)
              throw "unexpected EOF";
            if (!c2)
              throw "invalid length/literal";
            if (sym < 256)
              buf[bt2++] = sym;
            else if (sym == 256) {
              lm = null;
              break;
            } else {
              var add = sym - 254;
              if (sym > 264) {
                var i2 = sym - 257, b2 = fleb[i2];
                add = bits(dat, pos, (1 << b2) - 1) + fl[i2];
                pos += b2;
              }
              var d2 = dm[bits16(dat, pos) & dms], dsym = d2 >>> 4;
              if (!d2)
                throw "invalid distance";
              pos += d2 & 15;
              var dt2 = fd[dsym];
              if (dsym > 3) {
                var b2 = fdeb[dsym];
                dt2 += bits16(dat, pos) & (1 << b2) - 1, pos += b2;
              }
              if (pos > tbts)
                throw "unexpected EOF";
              if (noBuf)
                cbuf(bt2 + 131072);
              var end = bt2 + add;
              for (; bt2 < end; bt2 += 4) {
                buf[bt2] = buf[bt2 - dt2];
                buf[bt2 + 1] = buf[bt2 + 1 - dt2];
                buf[bt2 + 2] = buf[bt2 + 2 - dt2];
                buf[bt2 + 3] = buf[bt2 + 3 - dt2];
              }
              bt2 = end;
            }
          }
          st2.l = lm, st2.p = pos, st2.b = bt2;
          if (lm)
            final = 1, st2.m = lbt, st2.d = dm, st2.n = dbt;
        } while (!final);
        return bt2 == buf.length ? buf : slc(buf, 0, bt2);
      };
      var zlv = function(d2) {
        if ((d2[0] & 15) != 8 || d2[0] >>> 4 > 7 || (d2[0] << 8 | d2[1]) % 31)
          throw "invalid zlib data";
        if (d2[1] & 32)
          throw "invalid zlib data: preset dictionaries not supported";
      };
      function unzlibSync(data, out) {
        return inflt((zlv(data), data.subarray(2, -4)), out);
      }
      function strToU8(str, latin1) {
        var l2 = str.length;
        if (!latin1 && typeof TextEncoder != "undefined")
          return new TextEncoder().encode(str);
        var ar = new u8(str.length + (str.length >>> 1));
        var ai = 0;
        var w2 = function(v2) {
          ar[ai++] = v2;
        };
        for (var i2 = 0; i2 < l2; ++i2) {
          if (ai + 5 > ar.length) {
            var n2 = new u8(ai + 8 + (l2 - i2 << 1));
            n2.set(ar);
            ar = n2;
          }
          var c2 = str.charCodeAt(i2);
          if (c2 < 128 || latin1)
            w2(c2);
          else if (c2 < 2048)
            w2(192 | c2 >>> 6), w2(128 | c2 & 63);
          else if (c2 > 55295 && c2 < 57344)
            c2 = 65536 + (c2 & 1023 << 10) | str.charCodeAt(++i2) & 1023, w2(240 | c2 >>> 18), w2(128 | c2 >>> 12 & 63), w2(128 | c2 >>> 6 & 63), w2(128 | c2 & 63);
          else
            w2(224 | c2 >>> 12), w2(128 | c2 >>> 6 & 63), w2(128 | c2 & 63);
        }
        return slc(ar, 0, ai);
      }
      function strFromU8(dat, latin1) {
        var r2 = "";
        if (!latin1 && typeof TextDecoder != "undefined")
          return new TextDecoder().decode(dat);
        for (var i2 = 0; i2 < dat.length; ) {
          var c2 = dat[i2++];
          if (c2 < 128 || latin1)
            r2 += String.fromCharCode(c2);
          else if (c2 < 224)
            r2 += String.fromCharCode((c2 & 31) << 6 | dat[i2++] & 63);
          else if (c2 < 240)
            r2 += String.fromCharCode((c2 & 15) << 12 | (dat[i2++] & 63) << 6 | dat[i2++] & 63);
          else
            c2 = ((c2 & 15) << 18 | (dat[i2++] & 63) << 12 | (dat[i2++] & 63) << 6 | dat[i2++] & 63) - 65536, r2 += String.fromCharCode(55296 | c2 >> 10, 56320 | c2 & 1023);
        }
        return r2;
      }
      const MARK = "v1";
      const unpack = (raw) => {
        if (typeof raw !== "string") {
          return raw;
        }
        try {
          const e2 = JSON.parse(raw);
          if (e2.timestamp) {
            return e2;
          }
        } catch (error) {
        }
        try {
          const e2 = JSON.parse(strFromU8(unzlibSync(strToU8(raw, true))));
          if (e2.v === MARK) {
            return e2;
          }
          throw new Error(`These events were packed with packer ${e2.v} which is incompatible with current packer ${MARK}.`);
        } catch (error) {
          console.error(error);
          throw new Error("Unknown data format.");
        }
      };
      const PLUGIN_NAME = "rrweb/console@1";
      const ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
      const defaultLogConfig = {
        level: [
          "assert",
          "clear",
          "count",
          "countReset",
          "debug",
          "dir",
          "dirxml",
          "error",
          "group",
          "groupCollapsed",
          "groupEnd",
          "info",
          "log",
          "table",
          "time",
          "timeEnd",
          "timeLog",
          "trace",
          "warn"
        ],
        replayLogger: void 0
      };
      class LogReplayPlugin {
        constructor(config) {
          this.config = Object.assign(defaultLogConfig, config);
        }
        getConsoleLogger() {
          const replayLogger = {};
          for (const level of this.config.level) {
            if (level === "trace") {
              replayLogger[level] = (data) => {
                const logger = console.log[ORIGINAL_ATTRIBUTE_NAME] ? console.log[ORIGINAL_ATTRIBUTE_NAME] : console.log;
                logger(...data.payload.map((s2) => JSON.parse(s2)), this.formatMessage(data));
              };
            } else {
              replayLogger[level] = (data) => {
                const logger = console[level][ORIGINAL_ATTRIBUTE_NAME] ? console[level][ORIGINAL_ATTRIBUTE_NAME] : console[level];
                logger(...data.payload.map((s2) => JSON.parse(s2)), this.formatMessage(data));
              };
            }
          }
          return replayLogger;
        }
        formatMessage(data) {
          if (data.trace.length === 0) {
            return "";
          }
          const stackPrefix = "\n	at ";
          let result = stackPrefix;
          result += data.trace.join(stackPrefix);
          return result;
        }
      }
      const getReplayConsolePlugin = (options) => {
        const replayLogger = (options === null || options === void 0 ? void 0 : options.replayLogger) || new LogReplayPlugin(options).getConsoleLogger();
        return {
          handler(event, _isSync, context) {
            let logData = null;
            if (event.type === EventType$1.IncrementalSnapshot && event.data.source === IncrementalSource.Log) {
              logData = event.data;
            } else if (event.type === EventType$1.Plugin && event.data.plugin === PLUGIN_NAME) {
              logData = event.data.payload;
            }
            if (logData) {
              try {
                if (typeof replayLogger[logData.level] === "function") {
                  replayLogger[logData.level](logData);
                }
              } catch (error) {
                if (context.replayer.config.showWarning) {
                  console.warn(error);
                }
              }
            }
          }
        };
      };
      var EventType = /* @__PURE__ */ ((EventType2) => {
        EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType2[EventType2["Load"] = 1] = "Load";
        EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
        EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType2[EventType2["Meta"] = 4] = "Meta";
        EventType2[EventType2["Custom"] = 5] = "Custom";
        EventType2[EventType2["Plugin"] = 6] = "Plugin";
        return EventType2;
      })(EventType || {});
      const NETWORK_PLUGIN_NAME = "rrweb/network@1";
      const getReplayNetworkPlugin = (options) => {
        return {
          handler(event) {
            if (event.type === EventType.Plugin && event.data.plugin === NETWORK_PLUGIN_NAME) {
              const networkData = event.data.payload;
              options.onNetworkData(networkData);
            }
          }
        };
      };
      const _sfc_main$1 = vue.defineComponent({
        name: "player",
        components: {},
        setup() {
          const inputRef = vue.ref();
          const openFile = () => {
            inputRef.value.click();
          };
          let rrwebPlayer = null;
          const replay = (list) => {
            const replayerElemnt = document.getElementById("replayer");
            if (!replayerElemnt) {
              console.error("未找到id=replayer的元素");
              return;
            }
            if (rrwebPlayer) {
              rrwebPlayer.pause();
              rrwebPlayer = null;
            }
            if (replayerElemnt.children && replayerElemnt.children.length) {
              for (let i2 = 0; i2 < replayerElemnt.children.length; i2 += 1) {
                const element = replayerElemnt.children[i2];
                element.remove();
              }
            }
            rrwebPlayer = new Qn({
              target: replayerElemnt,
              // 可以自定义 DOM 元素
              // 配置项
              props: {
                events: list,
                // 要和录制的一致
                unpackFn: unpack,
                plugins: [
                  getReplayConsolePlugin({
                    level: ["info", "log", "warn", "error"]
                  }),
                  getReplayNetworkPlugin({
                    onNetworkData: ({ requests }) => {
                      for (const request of requests) {
                        const { url, method, status, startTime, endTime, requestBody, responseBody } = request;
                        console.log(`${method} ${url} ${status} ，耗时：${endTime - startTime}`);
                        console.log(`requestBody：${requestBody}，responseBody：${responseBody}`);
                      }
                    }
                  })
                ]
              }
            });
          };
          const readeFile = (file) => new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (fileReader) => {
              var _a2;
              const result = (_a2 = fileReader.target) == null ? void 0 : _a2.result;
              if (result) {
                resolve(JSON.parse(result));
              }
            };
          });
          const handleChange = (data) => {
            const target = data.target;
            if (target.files[0]) {
              readeFile(target.files[0]).then((result) => {
                result && replay(result);
              }).catch((e2) => {
                console.error("文件解析失败", e2);
              });
            } else {
              console.error("文件查找失败", target.files);
            }
          };
          const reset = () => {
            window.location.reload();
          };
          return {
            replay,
            openFile,
            handleChange,
            inputRef,
            reset
          };
        }
      });
      const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const _withScopeId = (n2) => (vue.pushScopeId("data-v-a472cbb1"), n2 = n2(), vue.popScopeId(), n2);
      const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("button", { class: "rr-button" }, "播放录屏", -1));
      const _hoisted_2 = [
        _hoisted_1
      ];
      const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { id: "replayer" }, null, -1));
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", null, [
            vue.createElementVNode("div", {
              onClick: _cache[0] || (_cache[0] = (...args) => _ctx.openFile && _ctx.openFile(...args)),
              class: "btn_input warp"
            }, _hoisted_2),
            vue.createElementVNode("input", {
              onChange: _cache[1] || (_cache[1] = (...args) => _ctx.handleChange && _ctx.handleChange(...args)),
              type: "file",
              style: { "display": "none" },
              ref: "inputRef"
            }, null, 544)
          ]),
          _hoisted_3
        ], 64);
      }
      const RrwebPlayer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-a472cbb1"]]);
      const _sfc_main = /* @__PURE__ */ vue.defineComponent({
        __name: "App",
        setup(__props) {
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createBlock(RrwebPlayer);
          };
        }
      });
      vue.createApp(_sfc_main).mount(
        (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      );
    }
  });
  require_main_001();

})(Vue);
