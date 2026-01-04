// ==UserScript==
// @name         codesign
// @namespace    npm/vite-plugin-monkey
// @version      0.0.7
// @author       monkey
// @description  codesign enhance
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://codesign.qq.com/app/design/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.38/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/506210/codesign.user.js
// @updateURL https://update.greasyfork.org/scripts/506210/codesign.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const o=document.createElement("style");o.textContent=a,document.head.append(o)})(" .app-footer[data-v-332c42ac]{position:fixed;z-index:100;left:280px;bottom:15px;background-color:#000;color:#fff;padding:12px 12px 36px;border-radius:4px;display:flex;flex-direction:column;box-shadow:0 8px 12px #0000000a,0 0 4px #00000014}.app-footer[data-v-332c42ac]>div[data-v-332c42ac]{line-height:1.5;cursor:pointer}.app-footer[data-v-332c42ac]>div[data-v-332c42ac][data-v-332c42ac]:hover{color:#218ef6}.app-footer[data-v-332c42ac]>div[data-v-332c42ac][data-v-332c42ac]:active{color:#83b0fa} ");

(function (vue) {
  'use strict';

  const unoData = vue.ref([]);
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  function toCopy(text) {
    $nuxt.$message.success("copy: " + text);
    _GM_setClipboard(text);
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = {
    key: 0,
    class: "app-footer"
  };
  const _hoisted_2 = ["onClick"];
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.unref(unoData).length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(unoData), (item) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: item,
                onClick: ($event) => vue.unref(toCopy)(item)
              }, vue.toDisplayString(item + " "), 9, _hoisted_2);
            }), 128))
          ])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-332c42ac"]]);
  var q = /^(?:calc|clamp|min|max)\s*\(.*\)/, Ut = /^-?[0-9\.]+(px|rem|em|%|vw|vh|vmin|vmax|deg)$/;
  function V(t) {
    return q.test(t);
  }
  function l(t) {
    return t.split("-")[0];
  }
  function $(t) {
    let o = t.split("-");
    return o[o.length - 1];
  }
  function At(t) {
    return t.startsWith("url(");
  }
  function P(t) {
    return t.endsWith("%");
  }
  function R(t) {
    return /^#[0-9A-Fa-f]{2,}$/.test(t);
  }
  function b(t) {
    return t.startsWith("rgb");
  }
  function z(t) {
    return t.startsWith("hsl");
  }
  function a(t, o, r, n = "") {
    return V(t) || At(t) || R(t) || b(t) || z(t) || P(t) || I(t) ? r ? `-[${n}${Z(t, "all").replace(/['"]/g, "")}]` : `="[${n}${Z(t, "all").replace(/['"]/g, "")}]"` : n ? `-[${n}${o ? o(t) : t}]` : `-${o ? o(t) : t}`;
  }
  function w(t) {
    return typeof t == "string" && t.endsWith("%") ? t.slice(0, -1) : +t * 100;
  }
  function W(t) {
    return t.replace(/\s+/, " ").split(" ").join("-");
  }
  function j(t) {
    return t.replace(/\s+/, " ").split(" ").join("_");
  }
  var Mt = ["top", "right", "bottom", "left", "center"];
  function Z(t, o = "around") {
    return o === "pre" ? t.replace(/(^\s*)/g, "") : o === "post" ? t.replace(/(\s*$)/g, "") : o === "all" ? t.replace(/\s+/g, "") : o === "around" ? t.replace(/(^\s*)|(\s*$)/g, "") : t;
  }
  function e(t) {
    return t = t.replace(/\s+/, " ").replace(/\s*,\s*/g, ",").replace(/\s*\/\s*/, "/"), /rgb/.test(t) && (t = t.replace(/rgba?\(([^\)]+)\)/g, (o, r) => {
      let n = r.trim().split(" ");
      return o.replace(r, n.map((i, s) => i.endsWith(",") ? i : i + (n.length - 1 === s ? "" : ",")).join(""));
    })), /hsl/.test(t) && (t = t.replace(/hsla?\(([^\)]+)\)/g, (o, r) => {
      let n = r.trim().split(" ");
      return o.replace(r, n.map((i, s) => i.endsWith(",") ? i : i + (n.length - 1 === s ? "" : ",")).join(""));
    })), /var\([^\)]+\)/.test(t) && (t = t.replace(/var\(([^\)]+)\)/g, (o, r) => {
      let n = r.trim().split(" ");
      return o.replace(r, n.map((i, s) => i.endsWith(",") ? i : i + (n.length - 1 === s ? "" : ",")).join(""));
    })), t.endsWith("!important") ? [t.replace(/\s*\!important/, "").trim(), "!"] : [t.trim(), ""];
  }
  function J(t) {
    return t.replace(/\(\s*/g, "(").replace(/\s*\)/g, ")").replace(/\s*,\s*/g, ",");
  }
  function I(t) {
    return t.startsWith("var(--");
  }
  function Q(t) {
    return q.test(t) || Ut.test(t) || Mt.includes(t);
  }
  var S = /-webkit-|-moz-|-ms-|-o-/g;
  function C(t, o) {
    let [r, n] = e(o);
    return `${t[0]}${a(r, l)}${n}`;
  }
  var Pt = ["background-color", "background-attachment", "background-position"], Ht = /linear-gradient\(\s*to([\w\s]+),?([\w\(\)#%\s\.]+)?,([\w\(\)#%\s\.]+)?,?([\w#%\s\.]+)?\)$/, Bt = /linear-gradient\(\s*([^,]*),?([\w\(\)#%\s\.]+)?,([\w\(\)#%\s\.]+)?,?([\w#%\s\.]+)?\)$/, Et = /(radial|conic)-gradient\(([\w\(\)#%\s\.]+)?,([\w\(\)#%\s\.]+)?,?([\w#%\s\.]+)?\)$/, _ = "__comma__";
  function B(t, o) {
    let [r, n] = e(o);
    if (t === "background-size") return `bg${a(r, N, false, "length:")}${n}`;
    if (Pt.includes(t)) return `bg${a(r, N)}${n}`;
    if (["background", "background-image"].includes(t)) {
      if (Q(r)) return `bg${a(r, N, false, "position:")}${n}`;
      let i = r.replace(/rgba?\([^)]+\)/g, "temp");
      if (/\)\s*,/.test(i)) return `bg="[${Dt(r)}]"`;
      if (/^(linear)-gradient/.test(r)) {
        let m = r.replace(/rgba?\(([^)]+)\)/g, (f, c) => f.replace(c, c.replace(/\s*,\s*/g, _))), g = m.match(Ht);
        if (g) {
          let [f, c, d, L] = g.slice(1);
          return f = f.split(" ").map((F) => F[0]).join(""), f ? `bg-gradient-to-${f}${H(c, d, L)}` : H(c, d, L);
        }
        let u = m.match(Bt);
        return u ? `bg-gradient-linear bg-gradient-[${u[1]},${u[2].replace(/\s+/, "_").replaceAll(_, ",")},${u[3].replace(/\s+/, "_").replaceAll(_, ",")}]` : void 0;
      } else if (/^(radial|conic)-gradient/.test(r)) {
        let g = r.replace(/rgba?\(([^)]+)\)/g, (L, F) => L.replace(F, F.replace(/\s*,\s*/g, _))).match(Et);
        if (!g) return;
        let u = g[1], [f, c, d] = g.slice(2);
        return `bg-gradient-${u}${H(f, c, d)}`;
      }
      let s = r.match(/^rgba?\([^)]+\)$/);
      if (s) {
        let m = s[0];
        return `bg="${r.replace(m, `[${m}]`)}${n}"`;
      }
      let p = r.match(/^url\(["'\s\.\-_\w\/@]*\)$/);
      if (p) return `bg="${r.replace(p[0], `[${p[0].replace(/['"]/g, "")}]${n}`)}"`;
      if (r.includes(" ")) {
        let m = r.split(" ").map((f) => B(t, `${f}${n ? " !important" : ""}`)).join(" "), g = /bg-\[position:([^\]]*)\]/g, u = m.match(g);
        if (u && u.length > 1) {
          let f = `bg-[position:${u.map((c) => c.replace(g, "$1")).join("_")}]`;
          m = `${m.replace(g, "").replace(/\s+/g, " ").split(" ").filter(Boolean).concat([f]).join(" ")}`;
        }
        return m;
      }
      return `bg${a(r, N)}${n}`;
    }
    return t === "background-blend-mode" ? `bg-blend-${r}${n}` : `${Gt(t, r)}-${Ot(r)}${n}`;
  }
  function Gt(t, o) {
    return o.endsWith("repeat") ? "bg" : t.replace("background", "bg");
  }
  function Ot(t) {
    return /(border)|(content)|(padding)-box/.test(t) ? t.replace("-box", "") : t.startsWith("repeat-") ? t.replace("repeat-", "") : N(t);
  }
  function N(t) {
    return t.replace(/\s+/, " ").replace(" ", "-");
  }
  function H(t, o, r) {
    let n = "";
    if (o && !r && (r = o, o = ""), t) {
      t = t.replaceAll(_, ",");
      let [i, s] = t.split(" ");
      s ? n += ` from="${b(i) ? `[${i}]` : i} ${s}"` : i && (n += ` from="${b(i) ? `[${i}]` : i}"`);
    }
    if (o) {
      o = o.replaceAll(_, ",");
      let [i, s] = o.split(" ");
      s ? n += ` via="${b(i) ? `[${i}]` : i} ${s}"` : i && (n += ` via="${b(i) ? `[${i}]` : i}"`);
    }
    if (r) {
      r = r.replaceAll(_, ",");
      let [i, s] = r.split(" ");
      s ? n += ` to="${b(i) ? `[${i}]` : i} ${s}"` : i && (n += ` to="${b(i) ? `[${i}]` : i}"`);
    }
    return n;
  }
  var X = "__transform_to_unocss__";
  function Dt(t) {
    let o = {}, r = 0;
    return t = t.replace(/(rgba?|hsla?|lab|lch|hwb|color)\([\)]*\)/, (n) => (o[r++] = n, `${X}${r}}`)), t = t.split(/\)\s*,/).map((n) => `${n.replace(/\s*,\s*/g, ",").replace(/\s+/g, "_")}`).join("),"), Object.keys(o).forEach((n) => {
      t = t.replace(`${X}${n}}`, o[n]);
    }), t;
  }
  function E(t, o) {
    let [r, n] = e(o), i = t.split("-"), s = V(r) || I(r) ? a(r) : a(l(r));
    return `${i[0]}-${i[1][0]}${s}${n}`;
  }
  function Y(t, o) {
    let [r, n] = e(o);
    if (t === "font-size") return `text-${r}${n}`;
    if (t === "font-weight") return `font-${r}${n}`;
    if (t === "font-family") {
      let i = r.match(/ui-(\w{0,4})/);
      if (!i) return `font-${o}${n}`;
      let [s, p] = i;
      return `font-${p}${n}`;
    }
    return t === "font-style" ? r === "normal" ? `font-not-italic${n}` : `font-${r}${n}` : t === "font-variant-numeric" ? r === "normal" ? `normal-nums${n}` : `${r}${n}` : `font="${Kt(r)}${n}"`;
  }
  function Kt(t) {
    return t.split(" ").map((o) => /^[0-9]/.test(o) ? `text-${o}` : o).join(" ");
  }
  function y(t, o) {
    let [r, n] = e(o);
    return `${t}${a(r)}${n}`;
  }
  var Zt = { "margin-left": "ml", "margin-right": "mr", "margin-top": "mt", "margin-bottom": "mb", "margin-inline-start": "ms", "margin-inline-end": "me", "padding-left": "pl", "padding-right": "pr", "padding-top": "pt", "padding-bottom": "pb", "padding-inline-start": "ps", "padding-inline-end": "pe" };
  function G(t, o) {
    let [r, n] = e(o), i = Zt[t];
    if (i) return `${i}${a(r)}${n}`;
    let s = r.split(" "), p = s.length;
    return p === 1 ? `${t[0]}${a(s[0])}${n}` : p === 2 ? `${t[0]}x${a(s[1])}${n} ${t[0]}y${a(s[0])}${n}` : p === 3 ? `${t[0]}x${a(s[1])}${n} ${t[0]}t${a(s[0])}${n} ${t[0]}b${a(s[2])}${n}` : `${t[0]}t${a(s[0])}${n} ${t[0]}b${a(s[2])}${n} ${t[0]}l${a(s[3])}${n} ${t[0]}r${a(s[1])}${n}`;
  }
  function k(t, o) {
    let [r, n] = e(o);
    return P(o) ? `op-${r.replace("%", "")}${n}` : `op-${+r * 100}${n}`;
  }
  function tt(t, o) {
    let [r, n] = e(o);
    return `text${a(r)}${n}`;
  }
  function rt(t, o) {
    let [r, n] = e(o);
    return t === "text-decoration-line" ? r === "none" ? `no-underline${n}` : `${r}${n}` : t === "text-transform" ? r === "none" ? `normal-case${n}` : `${r}${n}` : t.startsWith("text-decoration") || t === "text-indent" ? `${t.split("-")[1]}${a(r)}${n}` : t === "text-underline-offset" ? `underline-offset-${r}${n}` : `text-${r}${n}`;
  }
  function nt(t, o) {
    let [r, n] = e(o);
    return `v-${r}${n}`;
  }
  var ot = { 1: "none", 1.25: "tight", 1.375: "snug", 1.5: "normal", 1.625: "relaxed", 2: "loose" };
  function et(t, o) {
    let [r, n] = e(o);
    return r in ot ? `lh-${ot[r]}${n}` : `lh${a(r)}${n}`;
  }
  var it = ["border-top", "border-right", "border-bottom", "border-left"];
  function st(t, o) {
    let [r, n] = e(o);
    if (t === "border-spacing") return `${t}="[${j(r)}]${n}"`;
    if (t === "border-color") {
      if (r.includes(" ")) {
        let i = r.split(" ").length, s = r.split(" ").map((f) => R(f) || b(f) || z(f) ? `-[${f}]` : `-${f}`), [p, m, g, u] = s;
        switch (i) {
          case 2:
            return `border-y${p}${n} border-x${m}${n}`;
          case 3:
            return `border-t${p}${n} border-b${g}${n} border-x${m}${n}`;
          case 4:
            return `border-t${p}${n} border-b${g}${n} border-r${m}${n} border-l${u}${n}`;
        }
      }
      return `border${a(r)}${n}`;
    }
    return t === "border-radius" ? V(r) || !r.includes(" ") ? `border-rd${a(r)}${n}` : `border-rd="[${j(r)}]${n}"` : it.some((i) => t.startsWith(i)) ? r.split(" ").map((i) => `border-${t.split("-")[1][0]}${a(i)}${n}`).join(" ") : t === "border-inline-end-width" ? `border-e${a(r)}${n}` : t === "border-inline-start-width" ? `border-s${a(r)}${n}` : t.startsWith("border-image") ? "" : t === "border-width" && r.includes(" ") ? r.split(" ").map((i, s) => `border-${it[s].split("-")[1][0]}${a(i)}${n}`).join(" ") : /^\d[%|(px)|(rem)]$/.test(r) || t === "border-collapse" ? `border-${r}${n}` : t === "border-width" || t === "border-style" ? `border${a(r)}${n}` : t === "border-color" ? r === "currentColor" ? `border-current${n}` : `border${a(r)}${n}` : r.split(" ").map((i) => r === "currentColor" ? `border-current${n}` : `border${a(i)}${n}`).join(" ");
  }
  function T(t, o) {
    let [r, n] = e(o);
    return r === "none" ? `hidden${n}` : r === "hidden" ? `invisible${n}` : `${r}${n}`;
  }
  function x(t, o) {
    let [r, n] = e(o);
    return `${t}-${r}${n}`;
  }
  function v(t, o) {
    let [r, n] = e(o);
    return `${t}${a(r)}${n}`;
  }
  function h(t, o) {
    let [r, n] = e(o);
    return `${l(t)}${a(r)}${n}`;
  }
  var qt = ["box-shadow", "drop-shadow"];
  function U(t, o) {
    let [r, n] = e(o);
    if (t.startsWith("box-decoration")) return `box-decoration-${r}${n}`;
    if (t === "box-sizing") return `box-${l(r)}${n}`;
    if (qt.includes(t)) return `shadow="[${r.split(" ").join("_")}]${n}"`;
  }
  var Jt = ["contrast", "brightness", "saturate"], Qt = ["grayscale", "invert", "sepia"];
  function A(t, o) {
    let [r, n] = e(o), [i, s, p] = r.match(/([\w-]+)\((.*)\)/);
    return Jt.includes(s) ? `${s}-${w(p)}${n}` : s === "drop-shadow" ? `drop-${U(s, p)}${n}` : Qt.includes(s) ? `${s}-${p.endsWith("%") ? p.slice(0, -1) : w(p)}${n}` : s === "hue-rotate" ? `${s}-${p.slice(0, -3)}${n}` : `${s}-${p}${n}`;
  }
  function at(t, o) {
    let [r, n] = e(o);
    return `backdrop-${A(t, r)}${n}`;
  }
  function mt(t, o) {
    let [r, n] = e(o);
    return t === "transform-origin" ? `origin-${W(r)}${n}` : t === "transform-style" ? `transform-${r}` : J(r).split(" ").map((i) => {
      let s = i.match(/([a-z]+)(3d)?([A-Z])?\((.*)\)/);
      if (!s) return;
      let [p, m, g, u, f] = s;
      if (u) {
        let c = f.replace(/,(?![^()]*\))/g, " ").split(" ");
        return c.length > 1 ? `${m}-${u.toLowerCase()}="${c.map((d) => I(d) ? `[${d}]` : m === "scale" ? w(d) : M(d)).join(" ")}${n}"` : `${m}="${u.toLowerCase()}-${I(c[0]) ? `[${c[0]}]` : m === "scale" ? w(c[0]) : M(c[0])}${n}"`;
      } else {
        let c = f.replace(/,(?![^()]*\))/g, " ").split(" ");
        return c.length > 1 ? m === "translate" ? `${m}="[${c.join(",")}]"` : `${m}="${c.map((d) => I(d) ? `[${d}]` : m === "scale" ? w(d) : M(d)).join(" ")}${n}"` : `${m}="${I(c[0]) ? `[${c[0]}]` : m === "scale" ? w(c[0]) : M(c[0])}${n}"`;
      }
    }).filter(Boolean).join(" ");
  }
  function M(t) {
    return t.endsWith("deg") ? t.slice(0, -3) : t;
  }
  var Xt = ["transition-delay", "transition-duration"];
  function pt(t, o) {
    let [r, n] = e(o);
    if (t === "transition-timing-function") return r === "linear" ? `ease-${r}${n}` : `ease="[${r}]${n}"`;
    if (t === "transition") return `transition="${Yt(r)}"`;
    if (t === "transition-property") return r.includes("color") ? `transition-color${n}` : r === "box-shadow" ? `transition-shadow${n}` : `transition-${r}${n}`;
    if (Xt.includes(t)) return `${t.split("-")[1]}-${r.slice(0, -2)}`;
  }
  function Yt(t) {
    let o = false;
    return t.split(" ").map((r) => /^[0-9]/.test(r) || /^\.[0-9]/.test(r) ? o ? `delay${a(r, void 0, true)}` : (o = true, `duration${a(r, void 0, true)}`) : r === "background-color" ? "colors" : r).join(" ");
  }
  function ct(t, o) {
    let [r, n] = e(o);
    return t === "justify-content" ? `justify-${$(r)}${n}` : `${t}-${$(r)}${n}`;
  }
  function ft(t, o) {
    let [r, n] = e(o);
    return `${$(t)}-${$(r)}${n}`;
  }
  var yt = ["flex-basis", "flex-grow", "flex-shrink"];
  function lt(t, o) {
    let [r, n] = e(o);
    if (yt.includes(t)) return `${$(t)}-${r}${n}`;
    if (r === "1") return `flex-1${n}`;
    let i = r[0];
    return t === "flex" && (i === "0" || i === "1") ? `flex="[${j(r)}]${n}"` : `${l(t)}-${r.replace("column", "col")}${n}`;
  }
  function ut(t, o) {
    let [r, n] = e(o);
    return r === "auto" ? `${l(t)}-${r}` : `${l(t)}="[${r}]${n}"`;
  }
  function $t(t, o) {
    let [r, n] = e(o);
    return t === "column-gap" ? `gap-x-${r}${n}` : `${t}-${r}${n}`;
  }
  function gt(t, o) {
    let [r, n] = e(o);
    return o === "isolate" ? `${r}${n}` : `${t}-${r}${n}`;
  }
  function dt(t, o) {
    let [r, n] = e(o);
    return t === "object-position" ? `${l(t)}-${W(r)}${n}` : `${l(t)}-${r}${n}`;
  }
  function bt(t, o) {
    let [r, n] = e(o), [i, s, p] = t.split("-");
    return p ? `${i}-${p}-${r}${n}` : `${i}-${r}${n}`;
  }
  function xt(t, o) {
    let [r, n] = e(o);
    if (t.startsWith("grid-template")) {
      let s = r.match(/repeat\s*\(\s*([0-9]+)/);
      return s ? `grid-${$(t) === "rows" ? "rows" : "cols"}-${s[1]}${n}` : `grid-${$(t) === "rows" ? "rows" : "cols"}-${r.includes(" ") ? `[${j(r)}]` : r}${n}`;
    }
    if (t === "grid-auto-flow") return `grid-flow-${W(r).replace("column", "col")}${n}`;
    if (t.startsWith("grid-auto")) {
      let s = r.match(/minmax\s*\(\s*0\s*,\s*1fr/);
      return `auto-${$(t) === "rows" ? "rows" : "cols"}-${s ? "fr" : l(r)}${n}`;
    }
    let i = r.match(/span\s+([0-9])/);
    return i ? `${t.slice(5).replace("column", "col")}-span-${i[1]}${n}` : r === "1/-1" ? `${t.slice(5).replace("column", "col")}-span-full${n}` : `${t.slice(5).replace("column", "col")}-${r}${n}`;
  }
  function ht(t, o) {
    let [r, n] = e(o);
    return `gap-y-${r}${n}`;
  }
  function wt(t, o) {
    let [r, n] = e(o);
    return `${t}-${$(r)}${n}`;
  }
  function It(t, o) {
    let [r, n] = e(o);
    return `tracking-${r}${n}`;
  }
  function jt(t, o) {
    let [r, n] = e(o);
    return `whitespace-${r}${n}`;
  }
  function _t(t, o) {
    let [r, n] = e(o);
    return t.startsWith("word-spacing") ? `word-spacing${a(o)}` : r === "keep-all" ? `break-keep${n}` : `break-${$(r)}${n}`;
  }
  function Wt(t, o) {
    let [r, n] = e(o);
    return t === "outline-offset" ? `${t}-${r}${n}` : `${l(t)}-${r}${n}`;
  }
  function vt(t, o) {
    let [r, n] = e(o);
    return `mix-blend-${r}${n}`;
  }
  var kt = { vertical: "y", horizontal: "x" };
  function Vt(t, o) {
    let [r, n] = e(o);
    return r === "both" ? `${t}${n}` : `${t}-${kt[r] || r}${n}`;
  }
  function Nt(t, o) {
    let [r, n] = e(o);
    if (t.startsWith("scroll-snap")) return `snap-${r}${n}`;
    if (t === "scroll-behavior") return `scroll-${r}${n}`;
    let [i, s, p, m] = t.match(/scroll-(margin|padding)-?([\w]+)?-?([\w]+)?/);
    return p === "inline" && m ? `scroll-${s[0]}${m[0]}-${r}${n}` : p ? `scroll-${s[0]}${p[0]}-${r}${n}` : `scroll-${s[0]}-${r}${n}`;
  }
  function Lt(t, o) {
    let [r, n] = e(o);
    return `${$(t)}-${r}${n}`;
  }
  function Ft(t, o) {
    let [r, n] = e(o);
    return `${t}-${l(r)}${n}`;
  }
  function Rt(t, o) {
    let [r, n] = e(o);
    return t === "animation-delay" ? `animate${a(r)}${n}` : t === "animation" ? `animate-${r.split(" ")[0]}${n}` : `animate-${r}${n}`;
  }
  function zt(t, o) {
    let [r, n] = e(o);
    return r === '" "' || r === "' '" ? `content-['_']${n}` : `content-[${r.replace(/"/g, "'")}]${n}`;
  }
  var tr = { show: "visible", hide: "hidden" };
  function St(t, o) {
    var i;
    let [r, n] = e(o);
    return `table-empty-cells-${(i = tr[r]) != null ? i : r}${n}`;
  }
  function Ct(t, o) {
    return o === "horizontal-tb" ? "write-normal" : `write-${o.replace("-rl", "-right").replace("-lr", "-left")}`;
  }
  function Tt(t, o) {
    let [r, n] = e(o);
    if (t === "inset-inline-start") return `start${a(r)}${n}`;
    if (t === "inset-inline-end") return `end${a(r)}${n}`;
  }
  var O = { animation: Rt, aspect: ut, backface: h, caption: h, column: $t, columns: x, break: x, empty: St, box: U, writing: Ct, display: T, float: x, clear: x, isolation: gt, object: dt, overflow: x, overscroll: bt, position: T, top: v, left: v, right: v, bottom: v, visibility: T, z: C, flex: lt, order: x, grid: xt, gap: v, justify: ct, align: ft, place: wt, padding: G, perspective: x, margin: G, width: C, min: E, max: E, height: C, font: Y, letter: It, line: et, list: h, text: rt, vertical: nt, white: jt, word: _t, content: zt, background: B, border: st, outline: Wt, opacity: k, mix: vt, filter: A, backdrop: at, table: h, transition: pt, transform: mt, accent: h, appearance: h, cursor: y, caret: h, pointer: x, resize: Vt, scroll: Nt, inset: Tt, touch: h, user: Lt, will: Ft, fill: x, stroke: h, color: tt, row: ht }, rr = /([\w-]+)\s*:\s*([.\w\(\)-\s%+'",#\/!@]+)/;
  function D(t, o = false) {
    var g;
    t = t.replace(S, "");
    let r = t.match(rr);
    if (!r) return;
    let [n, i, s] = r, p = l(i), m = (g = O[p]) == null ? void 0 : g.call(O, i, s);
    return m && o ? m.replace(/-([0-9\.]+)px/, (u, f) => `-${+f / 4}`).replace(/\[[^\]]+\]/g, (u) => u.replace(/([0-9\.]+)px/g, (f, c) => `${+c / 16}rem`)) : m;
  }
  function K(t, o) {
    let r = [], n = /* @__PURE__ */ new Set();
    return [t.split(";").filter(Boolean).reduce((i, s) => {
      let p = s.replaceAll(S, "").trim();
      if (n.has(p)) return i;
      n.add(p);
      let m = D(s, o) || "";
      return m || r.push(s), i += `${m} `;
    }, "").trim().replace(/\s+/g, " "), r];
  }
  function nr(t, o = false) {
    let [r, n] = K(t, o);
    return [r ? r.replace(/([^\s\=]+)="([^"]+)"/g, (i, s, p) => p.split(" ").map((m) => `${s}-${m}`).join(" ")) : "", n];
  }
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
  _GM_addStyle(`
[data-label=段落对齐],[data-label=垂直对齐]{
  display:none !important;
}
`);
  document.addEventListener("keydown", function(event) {
    var _a, _b, _c;
    if (event.ctrlKey && event.key === "c") {
      const selection = window.getSelection().toString();
      const content = (_c = (_b = (_a = document.querySelector(".screen-inspect")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.selectedLayer) == null ? void 0 : _c.content;
      if (!selection && content) {
        toCopy(content);
      }
    }
  });
  document.addEventListener("click", function() {
    var _a, _b;
    const layer = (_b = (_a = document.querySelector(".screen-inspect")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.selectedLayer;
    if (layer) {
      unoData.value = layer.css.filter(
        (item) => !["text-align:", "font-weight:", "font-family:"].some(
          (text) => item.includes(text)
        )
      ).map(
        (item) => nr(item, judgeIsRem(item))[0].replace(
          "border-rd",
          "rounded"
        )
      );
    } else {
      unoData.value = [];
    }
  });
  function judgeIsRem(css) {
    var _a, _b;
    if (["font-size", "box-shadow"].some((item) => css.includes(item))) {
      return false;
    }
    if (((_a = css.match(/px/g)) == null ? void 0 : _a.length) > 1) {
      return false;
    }
    const pxSize = (_b = css.match(/(\d+)px/)) == null ? void 0 : _b[1];
    if (pxSize && pxSize % 4 === 0) {
      return true;
    }
  }

})(Vue);