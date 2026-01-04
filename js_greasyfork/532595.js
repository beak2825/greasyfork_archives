// ==UserScript==
// @name         Migaku Custom Stats
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @author       sguadalupe
// @description  More stats for Migaku Memory.
// @license      GPL-3.0
// @icon         https://study.migaku.com/favicon.ico
// @homepageURL  https://github.com/SebastianGuadalupe/MigakuStats
// @supportURL   https://github.com/SebastianGuadalupe/MigakuStats/issues
// @match        https://study.migaku.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/pinia@3.0.3/dist/pinia.iife.prod.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.min.js
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @connect      github.com
// @connect      raw.githubusercontent.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532595/Migaku%20Custom%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/532595/Migaku%20Custom%20Stats.meta.js
// ==/UserScript==

(function (vue, pinia, initSqlJs, pako, chart_js) {
  'use strict';

  const d$2=new Set;const e$1 = async e=>{d$2.has(e)||(d$2.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  e$1(' .UiButton__icon[data-v-c676c4b0]{width:24px;height:24px}.MCS__menu-popover[data-v-40732fef]{padding:20px 14px 14px;margin-bottom:8px;overflow:visible}.MCS__menu-settings[data-v-40732fef]{display:flex;flex-direction:column;gap:14px}.MCS__menu-settings.-compact[data-v-40732fef]{gap:8px}.MCS__menu-setting-row[data-v-40732fef]{display:flex;flex-direction:row;align-items:center;gap:8px;width:100%}.MCS__menu-setting-row.-active[data-v-40732fef]{display:grid;grid-template-areas:"label value" "group group";align-items:center;gap:8px;margin-bottom:4px;width:100%}.MCS__menu-setting-row [data-v-40732fef]:nth-child(2){margin-left:auto}.MCS__menu-setting-row .-indented[data-v-40732fef]{display:flex;flex-direction:row;align-items:center;margin-bottom:0;gap:4px}.MCS__menu-setting-row label[data-v-40732fef]{flex:1}.MCS__menu-setting-row [data-v-40732fef] .UiToggle{height:40px}.MCS__menu-setting-row-group[data-v-40732fef]{grid-area:group;display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding-left:24px}.MCS__menu-setting-row-group [data-v-40732fef] .UiToggle{height:30px}.MCS__menu-setting-label[data-v-40732fef]{font-weight:600;display:block;margin-right:8px}.MCS__wordcount[data-v-cbac060c]{display:flex;flex-wrap:wrap;flex-direction:row;align-items:center;justify-content:center;gap:16px;margin:16px 0}.MCS__wordcount__details[data-v-cbac060c]{display:flex;flex-direction:column;align-items:center;justify-content:center}.MCS__wordcount__piechart[data-v-cbac060c]{display:flex;align-items:center;justify-content:center}.MCS__wordcount__piechart__donut[data-v-cbac060c]{aspect-ratio:1.6;max-height:300px;min-height:100px}.skeleton-row[data-v-cbac060c]{display:flex;flex-direction:column;align-items:center;gap:8px}.skeleton-label[data-v-cbac060c]{width:128px;height:16px;border-radius:30px}.skeleton-donut-container[data-v-cbac060c]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;width:100%;justify-content:center}.skeleton-donut[data-v-cbac060c]{height:187px;width:187px;border-radius:50%;border:50px solid rgba(255,255,255,.1);background:transparent}.skeleton-legend[data-v-cbac060c]{display:flex;flex-direction:column;gap:4px}.skeleton-legend-item[data-v-cbac060c]{display:flex;align-items:center;gap:3px}.skeleton-legend-circle[data-v-cbac060c]{width:18px;height:18px;border-radius:50%}.skeleton-legend-text[data-v-cbac060c]{width:60px;height:14px;border-radius:30px}.NativeStatsCard[data-v-628a8123]{background:transparent;border:none;box-shadow:none;padding:0;height:100%}.MCS__due-skeleton-container[data-v-3292d4e4]{width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;padding:32px 32px 64px}.MCS__due-skeleton-bar-chart[data-v-3292d4e4]{height:100%;width:100%;min-width:200px;position:relative;display:flex;align-items:flex-end;justify-content:center;gap:2px}.MCS__due-skeleton-bar[data-v-3292d4e4]{width:100%;border-radius:6px 6px 2px 2px}.MCS__due-skeleton-bar .UiSkeleton[data-v-3292d4e4]{width:100%;height:100%;border-radius:6px 6px 2px 2px;display:block}.MCS__due-skeleton-container[data-v-2a35a85f]{width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;padding:32px 32px 64px}.MCS__due-skeleton-bar-chart[data-v-2a35a85f]{height:100%;width:100%;min-width:200px;position:relative;display:flex;align-items:flex-end;justify-content:center;gap:2px}.MCS__due-skeleton-bar[data-v-2a35a85f]{width:100%;border-radius:6px 6px 2px 2px}.MCS__due-skeleton-bar .UiSkeleton[data-v-2a35a85f]{width:100%;height:100%;border-radius:6px 6px 2px 2px;display:block}.MCS__due-skeleton-container[data-v-bcca767d]{width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;padding:32px 32px 64px}.MCS__due-skeleton-bar-chart[data-v-bcca767d]{height:100%;width:100%;min-width:200px;position:relative;display:flex;align-items:flex-end;justify-content:center;gap:2px}.MCS__due-skeleton-bar[data-v-bcca767d]{width:100%;border-radius:6px 6px 2px 2px}.MCS__due-skeleton-bar .UiSkeleton[data-v-bcca767d]{width:100%;height:100%;border-radius:6px 6px 2px 2px;display:block}.MCS__study-grid[data-v-a204a33d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:16px 0}.MCS__stat-box[data-v-a204a33d]{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;background:#00c7a40d;border-radius:8px}.MCS__stat-value[data-v-a204a33d]{font-size:24px;font-weight:700;margin-bottom:8px}.MCS__stat-label[data-v-a204a33d]{font-size:14px;text-align:center}.MCS__time-skeleton-container[data-v-23dca542]{width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;padding:32px 32px 64px}.MCS__time-skeleton-bar-chart[data-v-23dca542]{height:100%;width:100%;min-width:200px;position:relative;display:flex;align-items:flex-end;justify-content:center;gap:2px}.MCS__time-skeleton-bar[data-v-23dca542]{width:100%;border-radius:6px 6px 2px 2px}.MCS__time-skeleton-bar .UiSkeleton[data-v-23dca542]{width:100%;height:100%;border-radius:6px 6px 2px 2px;display:block}.MCS__word-history-skeleton-container[data-v-c1b7516b]{width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;padding:32px 32px 64px}.MCS__word-history-skeleton-chart[data-v-c1b7516b]{height:100%;width:100%;min-width:200px;position:relative;display:flex;align-items:flex-end;justify-content:center;gap:2px}.MCS__word-history-skeleton-bar[data-v-c1b7516b]{width:100%;border-radius:6px 6px 2px 2px}.MCS__word-history-skeleton-bar .UiSkeleton[data-v-c1b7516b]{width:100%;height:100%;border-radius:6px 6px 2px 2px;display:block}.CustomStatCard[data-v-3692c88c]{background:transparent;border:none;box-shadow:none;padding:0;height:100%}.selected[data-v-2f977adb]{background-color:var(--grey-5)}.MCS__character-grid-wrapper[data-v-83338d7e]{display:flex;flex-direction:column;height:100%;overflow:hidden}.MCS__character-grid-loading[data-v-83338d7e]{display:flex;justify-content:center;align-items:center;padding:20px;text-align:center}.MCS__character-groups-wrapper[data-v-83338d7e]{flex:1 1 auto;overflow-y:scroll;scrollbar-gutter:stable;display:flex;flex-direction:column}.MCS__character-group[data-v-83338d7e]{flex-shrink:0;margin-bottom:20px}.MCS__character-group--single[data-v-83338d7e]{flex:1 1 auto;display:flex;flex-direction:column}.MCS__character-grid[data-v-83338d7e]{display:grid;grid-template-columns:repeat(auto-fill,var(--v0fa89a4c));gap:10px;padding:10px;overflow-y:auto;scrollbar-gutter:stable;box-sizing:border-box;width:100%;max-height:400px;justify-content:center}.MCS__character-group--single .MCS__character-grid[data-v-83338d7e]{max-height:none;flex:1 1 auto}.MCS__character-grid-header[data-v-83338d7e],.MCS__character-group-header[data-v-83338d7e]{text-align:center;margin-bottom:10px;flex-shrink:0}.MCS__character[data-v-83338d7e]{display:flex;justify-content:center;align-items:center;padding:10px;font-size:1.5rem;border-radius:5px;-webkit-user-select:text;user-select:text}.MCS__character--known[data-v-83338d7e]{background-color:#00c7a4}.MCS__character--learning[data-v-83338d7e]{background-color:#ff9345}.MCS__character--unknown[data-v-83338d7e]{background-color:#fe4670}.MCS__character-chart[data-v-9d5df7b4]{display:flex;flex-wrap:wrap;flex-direction:row;align-items:center;justify-content:center;gap:16px;margin:16px 0}.MCS__character-stats__details[data-v-9d5df7b4]{display:flex;flex-direction:column;align-items:center;justify-content:center}.MCS__character-stats__chart[data-v-9d5df7b4]{display:flex;align-items:center;justify-content:center}.MCS__character-stats__chart__donut[data-v-9d5df7b4]{aspect-ratio:1.6;max-height:300px;min-height:100px}.skeleton-row[data-v-9d5df7b4]{display:flex;flex-direction:column;align-items:center;gap:8px}.skeleton-label[data-v-9d5df7b4]{width:128px;height:16px;border-radius:30px}.skeleton-donut-container[data-v-9d5df7b4]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;width:100%;justify-content:center}.skeleton-donut[data-v-9d5df7b4]{height:187px;width:187px;border-radius:50%;border:50px solid rgba(255,255,255,.1);background:transparent}.skeleton-legend[data-v-9d5df7b4]{display:flex;flex-direction:column;gap:4px}.skeleton-legend-item[data-v-9d5df7b4]{display:flex;align-items:center;gap:3px}.skeleton-legend-circle[data-v-9d5df7b4]{width:18px;height:18px;border-radius:50%}.skeleton-legend-text[data-v-9d5df7b4]{width:60px;height:14px;border-radius:30px}.MCS_wrapper[data-v-75be49f4]{max-width:1080px;margin:0 auto}.MCS__stats-card[data-v-75be49f4]{height:100%}.MCS__card-content[data-v-75be49f4]{width:100%;height:100%;max-width:1080px}.MCS__card-content.-no-events[data-v-75be49f4]{pointer-events:none}.MCS__shuffle-button[data-v-75be49f4]{position:fixed;bottom:24px;left:24px;z-index:1000}.MCS__undo-button[data-v-75be49f4]{position:fixed;bottom:24px;left:72px;z-index:1000}.MCS__add-button[data-v-75be49f4]{position:fixed;bottom:24px;left:120px;z-index:1000}.MCS__deck-selector-action-sheet[data-v-75be49f4]{position:fixed;bottom:120px;left:24px;z-index:1000}.MCS__add-card-multiselect[data-v-75be49f4],.MCS__add-card-action-sheet[data-v-75be49f4]{position:fixed!important;bottom:72px;left:120px;min-width:180px;z-index:1001}.vgl-layout[data-v-75be49f4]{--vgl-placeholder-bg: rgb(0, 182, 0)}.vgl-item--placeholder{border-radius:16px}.vgl-item__resizer:before{border-color:var(--text-color);width:12px;height:12px} ');

  const y$2 = typeof window < "u";
  var Ot$1;
  y$2 && ((Ot$1 = window == null ? void 0 : window.navigator) == null ? void 0 : Ot$1.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function ie(t2) {
    return t2 == null;
  }
  function it() {
  }
  const W = Object.freeze({
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
  });
  Object.freeze(new Set(Object.keys(W)));
  function Zr() {
    const t2 = new Map();
    return {
      on(e2, n) {
        const r2 = t2.get(e2);
        (r2 == null ? void 0 : r2.add(n)) || t2.set(e2, new Set([n]));
      },
      off(e2, n) {
        const r2 = t2.get(e2);
        r2 && r2.delete(n);
      },
      clear(e2) {
        const n = t2.get(e2);
        n && n.clear();
      },
      clearAll() {
        t2.clear();
      },
      emit(e2, ...n) {
        const r2 = t2.get(e2);
        r2 && r2.forEach((o) => {
          o(...n);
        });
      }
    };
  }
  function eo(t2, e2 = 16) {
    if (typeof t2 != "function")
      return it;
    const n = (...i2) => {
      t2(...i2);
    };
    if (e2 <= 0)
      return Jt(n);
    let r2 = 0, o;
    return function(...i2) {
      const s2 = Date.now(), c2 = s2 - r2;
      clearTimeout(o), c2 >= e2 ? (r2 = s2, n(...i2)) : o = setTimeout(
        () => {
          r2 = Date.now(), n(...i2);
        },
        Math.max(0, e2 - c2)
      );
    };
  }
  function no(t2, e2 = 100) {
    if (typeof t2 != "function")
      return it;
    const n = (...o) => {
      t2(...o);
    };
    if (e2 <= 0)
      return Jt(n);
    let r2;
    return function(...o) {
      clearTimeout(r2), r2 = setTimeout(() => {
        n(...o);
      }, e2);
    };
  }
  function Jt(t2) {
    if (typeof t2 != "function")
      return t2;
    let e2 = false, n, r2;
    return function(...o) {
      return n = o, e2 || (e2 = true, r2 = Promise.resolve().then(() => (e2 = false, r2 = void 0, t2(...n)))), r2;
    };
  }
  const x$1 = new Set(), vt = new WeakMap();
  function hn() {
    x$1.forEach((t2) => {
      t2(...vt.get(t2));
    }), x$1.clear();
  }
  function oo(t2, ...e2) {
    if (typeof t2 != "function")
      return t2;
    vt.set(t2, e2), !x$1.has(t2) && (x$1.add(t2), x$1.size === 1 && Promise.resolve().then(hn));
  }
  const T = Symbol("LAYOUT_KEY"), v$1 = Symbol("EMITTER_KEY");
  function A(r2) {
    let n = 0, t2;
    for (let e2 = 0, i2 = r2.length; e2 < i2; e2++)
      t2 = r2[e2].y + r2[e2].h, t2 > n && (n = t2);
    return n;
  }
  function Y(r2) {
    const n = Array(r2.length);
    for (let t2 = 0, e2 = r2.length; t2 < e2; t2++)
      n[t2] = y$1(r2[t2]);
    return n;
  }
  function y$1(r2) {
    return { ...r2 };
  }
  function a$1(r2, n) {
    return !(r2 === n || r2.x + r2.w <= n.x || r2.x >= n.x + n.w || r2.y + r2.h <= n.y || r2.y >= n.y + n.h);
  }
  function $(r2, n, t2) {
    const e2 = b(r2), i2 = g(r2), o = Array(r2.length);
    for (let s2 = 0, f = i2.length; s2 < f; s2++) {
      let c2 = i2[s2];
      c2.static || (c2 = E(e2, c2, n, t2), e2.push(c2)), o[r2.findIndex((l) => l.i === c2.i)] = c2, c2.moved = false;
    }
    return o;
  }
  function E(r2, n, t2, e2) {
    if (t2)
      for (; n.y > 0 && !h(r2, n); )
        n.y--;
    else if (e2) {
      const o = e2[n.i].y;
      for (; n.y > o && !h(r2, n); )
        n.y--;
    }
    let i2;
    for (; i2 = h(r2, n); )
      n.y = i2.y + i2.h;
    return n;
  }
  function _(r2, n) {
    const t2 = b(r2);
    for (let e2 = 0, i2 = r2.length; e2 < i2; e2++) {
      const o = r2[e2];
      if (o.x + o.w > n.cols && (o.x = n.cols - o.w), o.x < 0 && (o.x = 0, o.w = n.cols), !o.static) t2.push(o);
      else
        for (; h(t2, o); )
          o.y++;
    }
    return r2;
  }
  function C(r2, n) {
    for (let t2 = 0, e2 = r2.length; t2 < e2; t2++)
      if (r2[t2].i === n) return r2[t2];
  }
  function h(r2, n) {
    for (let t2 = 0, e2 = r2.length; t2 < e2; t2++)
      if (a$1(r2[t2], n)) return r2[t2];
  }
  function L(r2, n) {
    return r2.filter((t2) => a$1(t2, n));
  }
  function b(r2) {
    return r2.filter((n) => n.static);
  }
  function x(r2, n, t2, e2, i2 = false, o = false) {
    if (n.static) return r2;
    const s2 = n.x, f = n.y, c2 = e2 && n.y > e2;
    typeof t2 == "number" && (n.x = t2), typeof e2 == "number" && (n.y = e2), n.moved = true;
    let l = g(r2);
    c2 && (l = l.reverse());
    const p = L(l, n);
    if (o && p.length)
      return n.x = s2, n.y = f, n.moved = false, r2;
    for (let w = 0, m = p.length; w < m; w++) {
      const u = p[w];
      u.moved || n.y > u.y && n.y - u.y > u.h / 4 || (u.static ? r2 = d$1(r2, u, n, i2) : r2 = d$1(r2, n, u, i2));
    }
    return r2;
  }
  function d$1(r2, n, t2, e2) {
    if (e2) {
      const o = {
        x: t2.x,
        y: t2.y,
        w: t2.w,
        h: t2.h
      };
      if (o.y = Math.max(n.y - t2.h, 0), !h(r2, o))
        return x(r2, t2, void 0, o.y, false);
    }
    return x(r2, t2, void 0, t2.y + 1, false);
  }
  function G(r2, n, t2, e2) {
    const i2 = "translate3d(" + n + "px," + r2 + "px, 0)";
    return {
      transform: i2,
      WebkitTransform: i2,
      MozTransform: i2,
      msTransform: i2,
      OTransform: i2,
      width: t2 + "px",
      height: e2 + "px",
      position: "absolute"
    };
  }
  function O(r2, n, t2, e2) {
    const i2 = "translate3d(" + n * -1 + "px," + r2 + "px, 0)";
    return {
      transform: i2,
      WebkitTransform: i2,
      MozTransform: i2,
      msTransform: i2,
      OTransform: i2,
      width: t2 + "px",
      height: e2 + "px",
      position: "absolute"
    };
  }
  function R(r2, n, t2, e2) {
    return {
      top: r2 + "px",
      left: n + "px",
      width: t2 + "px",
      height: e2 + "px",
      position: "absolute"
    };
  }
  function V(r2, n, t2, e2) {
    return {
      top: r2 + "px",
      right: n + "px",
      width: t2 + "px",
      height: e2 + "px",
      position: "absolute"
    };
  }
  function g(r2) {
    return Array.from(r2).sort(function(n, t2) {
      return n.y === t2.y && n.x === t2.x ? 0 : n.y > t2.y || n.y === t2.y && n.x > t2.x ? 1 : -1;
    });
  }
  function k(r2, n) {
    n = n || "Layout";
    const t2 = ["x", "y", "w", "h"], e2 = [];
    if (!Array.isArray(r2)) throw new Error(n + " must be an array!");
    for (let i2 = 0, o = r2.length; i2 < o; i2++) {
      const s2 = r2[i2];
      for (let f = 0; f < t2.length; f++)
        if (typeof s2[t2[f]] != "number")
          throw new Error(
            "VueGridLayout: " + n + "[" + i2 + "]." + t2[f] + " must be a number!"
          );
      if (s2.i === void 0 || s2.i === null)
        throw new Error("VueGridLayout: " + n + "[" + i2 + "].i cannot be null!");
      if (typeof s2.i != "number" && typeof s2.i != "string")
        throw new Error("VueGridLayout: " + n + "[" + i2 + "].i must be a string or number!");
      if (e2.indexOf(s2.i) >= 0)
        throw new Error("VueGridLayout: " + n + "[" + i2 + "].i must be unique!");
      if (e2.push(s2.i), s2.static !== void 0 && typeof s2.static != "boolean")
        throw new Error("VueGridLayout: " + n + "[" + i2 + "].static must be a boolean!");
    }
  }
  function K(r2, n = "vgl") {
    const t2 = () => `${n}-${r2}`;
    return {
      b: t2,
      be: (s2) => `${t2()}__${s2}`,
      bm: (s2) => `${t2()}--${s2}`,
      bem: (s2, f) => `${t2()}__${s2}--${f}`
    };
  }
  function a(t2) {
    return c(t2);
  }
  function c(t2) {
    var f;
    const n = ((f = t2.target) == null ? void 0 : f.offsetParent) || document.body, e2 = t2.offsetParent === document.body ? { left: 0, top: 0 } : n.getBoundingClientRect(), o = t2.clientX + n.scrollLeft - e2.left, r2 = t2.clientY + n.scrollTop - e2.top;
    return { x: o, y: r2 };
  }
  function i(t2, n, e2, o) {
    return s(t2) ? {
      deltaX: e2 - t2,
      deltaY: o - n,
      lastX: t2,
      lastY: n,
      x: e2,
      y: o
    } : {
      deltaX: 0,
      deltaY: 0,
      lastX: e2,
      lastY: o,
      x: e2,
      y: o
    };
  }
  function s(t2) {
    return typeof t2 == "number" && !Number.isNaN(t2);
  }
  function y(t2, e2) {
    const o = d(t2);
    let n = o[0];
    for (let r2 = 1, c2 = o.length; r2 < c2; r2++) {
      const i2 = o[r2];
      e2 > t2[i2] && (n = i2);
    }
    return n;
  }
  function B(t2, e2) {
    if (!e2[t2])
      throw new Error(
        "ResponsiveGridLayout: `cols` entry for breakpoint " + t2 + " is missing!"
      );
    return e2[t2];
  }
  function v(t2, e2, o, n, r2, c2, i2) {
    if (e2[n]) return Y(e2[n]);
    let s2 = t2;
    const u = d(o), l = u.slice(u.indexOf(n));
    for (let f = 0, g2 = l.length; f < g2; f++) {
      const a2 = l[f];
      if (e2[a2]) {
        s2 = e2[a2];
        break;
      }
    }
    return s2 = Y(s2 || []), $(_(s2, { cols: c2 }), i2);
  }
  function d(t2) {
    return Object.keys(t2).sort((o, n) => t2[o] - t2[n]);
  }
  let t = "auto";
  function e() {
    return typeof document < "u";
  }
  function r() {
    return e() ? typeof document.dir < "u" ? document.dir : document.getElementsByTagName("html")[0].getAttribute("dir") : t;
  }
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var interact_min$1 = { exports: {} };
  var interact_min = interact_min$1.exports;
  var hasRequiredInteract_min;
  function requireInteract_min() {
    if (hasRequiredInteract_min) return interact_min$1.exports;
    hasRequiredInteract_min = 1;
    (function(module, exports) {
      !(function(t2, e2) {
        module.exports = e2();
      })(interact_min, (function() {
        function t2(t3, e3) {
          var n2 = Object.keys(t3);
          if (Object.getOwnPropertySymbols) {
            var r3 = Object.getOwnPropertySymbols(t3);
            e3 && (r3 = r3.filter((function(e4) {
              return Object.getOwnPropertyDescriptor(t3, e4).enumerable;
            }))), n2.push.apply(n2, r3);
          }
          return n2;
        }
        function e2(e3) {
          for (var n2 = 1; n2 < arguments.length; n2++) {
            var r3 = null != arguments[n2] ? arguments[n2] : {};
            n2 % 2 ? t2(Object(r3), true).forEach((function(t3) {
              a2(e3, t3, r3[t3]);
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r3)) : t2(Object(r3)).forEach((function(t3) {
              Object.defineProperty(e3, t3, Object.getOwnPropertyDescriptor(r3, t3));
            }));
          }
          return e3;
        }
        function n(t3) {
          return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t4) {
            return typeof t4;
          } : function(t4) {
            return t4 && "function" == typeof Symbol && t4.constructor === Symbol && t4 !== Symbol.prototype ? "symbol" : typeof t4;
          }, n(t3);
        }
        function r2(t3, e3) {
          if (!(t3 instanceof e3)) throw new TypeError("Cannot call a class as a function");
        }
        function i2(t3, e3) {
          for (var n2 = 0; n2 < e3.length; n2++) {
            var r3 = e3[n2];
            r3.enumerable = r3.enumerable || false, r3.configurable = true, "value" in r3 && (r3.writable = true), Object.defineProperty(t3, d2(r3.key), r3);
          }
        }
        function o(t3, e3, n2) {
          return e3 && i2(t3.prototype, e3), Object.defineProperty(t3, "prototype", { writable: false }), t3;
        }
        function a2(t3, e3, n2) {
          return (e3 = d2(e3)) in t3 ? Object.defineProperty(t3, e3, { value: n2, enumerable: true, configurable: true, writable: true }) : t3[e3] = n2, t3;
        }
        function s2(t3, e3) {
          if ("function" != typeof e3 && null !== e3) throw new TypeError("Super expression must either be null or a function");
          t3.prototype = Object.create(e3 && e3.prototype, { constructor: { value: t3, writable: true, configurable: true } }), Object.defineProperty(t3, "prototype", { writable: false }), e3 && l(t3, e3);
        }
        function c2(t3) {
          return c2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t4) {
            return t4.__proto__ || Object.getPrototypeOf(t4);
          }, c2(t3);
        }
        function l(t3, e3) {
          return l = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t4, e4) {
            return t4.__proto__ = e4, t4;
          }, l(t3, e3);
        }
        function u(t3) {
          if (void 0 === t3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t3;
        }
        function p(t3) {
          var e3 = (function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if ("function" == typeof Proxy) return true;
            try {
              return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {
              }))), true;
            } catch (t4) {
              return false;
            }
          })();
          return function() {
            var n2, r3 = c2(t3);
            if (e3) {
              var i3 = c2(this).constructor;
              n2 = Reflect.construct(r3, arguments, i3);
            } else n2 = r3.apply(this, arguments);
            return (function(t4, e4) {
              if (e4 && ("object" == typeof e4 || "function" == typeof e4)) return e4;
              if (void 0 !== e4) throw new TypeError("Derived constructors may only return object or undefined");
              return u(t4);
            })(this, n2);
          };
        }
        function f() {
          return f = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(t3, e3, n2) {
            var r3 = (function(t4, e4) {
              for (; !Object.prototype.hasOwnProperty.call(t4, e4) && null !== (t4 = c2(t4)); ) ;
              return t4;
            })(t3, e3);
            if (r3) {
              var i3 = Object.getOwnPropertyDescriptor(r3, e3);
              return i3.get ? i3.get.call(arguments.length < 3 ? t3 : n2) : i3.value;
            }
          }, f.apply(this, arguments);
        }
        function d2(t3) {
          var e3 = (function(t4, e4) {
            if ("object" != typeof t4 || null === t4) return t4;
            var n2 = t4[Symbol.toPrimitive];
            if (void 0 !== n2) {
              var r3 = n2.call(t4, e4);
              if ("object" != typeof r3) return r3;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return String(t4);
          })(t3, "string");
          return "symbol" == typeof e3 ? e3 : e3 + "";
        }
        var h2 = function(t3) {
          return !(!t3 || !t3.Window) && t3 instanceof t3.Window;
        }, v2 = void 0, g2 = void 0;
        function m(t3) {
          v2 = t3;
          var e3 = t3.document.createTextNode("");
          e3.ownerDocument !== t3.document && "function" == typeof t3.wrap && t3.wrap(e3) === e3 && (t3 = t3.wrap(t3)), g2 = t3;
        }
        function y2(t3) {
          return h2(t3) ? t3 : (t3.ownerDocument || t3).defaultView || g2.window;
        }
        "undefined" != typeof window && window && m(window);
        var b2 = function(t3) {
          return !!t3 && "object" === n(t3);
        }, x2 = function(t3) {
          return "function" == typeof t3;
        }, w = { window: function(t3) {
          return t3 === g2 || h2(t3);
        }, docFrag: function(t3) {
          return b2(t3) && 11 === t3.nodeType;
        }, object: b2, func: x2, number: function(t3) {
          return "number" == typeof t3;
        }, bool: function(t3) {
          return "boolean" == typeof t3;
        }, string: function(t3) {
          return "string" == typeof t3;
        }, element: function(t3) {
          if (!t3 || "object" !== n(t3)) return false;
          var e3 = y2(t3) || g2;
          return /object|function/.test("undefined" == typeof Element ? "undefined" : n(Element)) ? t3 instanceof Element || t3 instanceof e3.Element : 1 === t3.nodeType && "string" == typeof t3.nodeName;
        }, plainObject: function(t3) {
          return b2(t3) && !!t3.constructor && /function Object\b/.test(t3.constructor.toString());
        }, array: function(t3) {
          return b2(t3) && void 0 !== t3.length && x2(t3.splice);
        } };
        function E2(t3) {
          var e3 = t3.interaction;
          if ("drag" === e3.prepared.name) {
            var n2 = e3.prepared.axis;
            "x" === n2 ? (e3.coords.cur.page.y = e3.coords.start.page.y, e3.coords.cur.client.y = e3.coords.start.client.y, e3.coords.velocity.client.y = 0, e3.coords.velocity.page.y = 0) : "y" === n2 && (e3.coords.cur.page.x = e3.coords.start.page.x, e3.coords.cur.client.x = e3.coords.start.client.x, e3.coords.velocity.client.x = 0, e3.coords.velocity.page.x = 0);
          }
        }
        function T2(t3) {
          var e3 = t3.iEvent, n2 = t3.interaction;
          if ("drag" === n2.prepared.name) {
            var r3 = n2.prepared.axis;
            if ("x" === r3 || "y" === r3) {
              var i3 = "x" === r3 ? "y" : "x";
              e3.page[i3] = n2.coords.start.page[i3], e3.client[i3] = n2.coords.start.client[i3], e3.delta[i3] = 0;
            }
          }
        }
        var S = { id: "actions/drag", install: function(t3) {
          var e3 = t3.actions, n2 = t3.Interactable, r3 = t3.defaults;
          n2.prototype.draggable = S.draggable, e3.map.drag = S, e3.methodDict.drag = "draggable", r3.actions.drag = S.defaults;
        }, listeners: { "interactions:before-action-move": E2, "interactions:action-resume": E2, "interactions:action-move": T2, "auto-start:check": function(t3) {
          var e3 = t3.interaction, n2 = t3.interactable, r3 = t3.buttons, i3 = n2.options.drag;
          if (i3 && i3.enabled && (!e3.pointerIsDown || !/mouse|pointer/.test(e3.pointerType) || 0 != (r3 & n2.options.drag.mouseButtons))) return t3.action = { name: "drag", axis: "start" === i3.lockAxis ? i3.startAxis : i3.lockAxis }, false;
        } }, draggable: function(t3) {
          return w.object(t3) ? (this.options.drag.enabled = false !== t3.enabled, this.setPerAction("drag", t3), this.setOnEvents("drag", t3), /^(xy|x|y|start)$/.test(t3.lockAxis) && (this.options.drag.lockAxis = t3.lockAxis), /^(xy|x|y)$/.test(t3.startAxis) && (this.options.drag.startAxis = t3.startAxis), this) : w.bool(t3) ? (this.options.drag.enabled = t3, this) : this.options.drag;
        }, beforeMove: E2, move: T2, defaults: { startAxis: "xy", lockAxis: "xy" }, getCursor: function() {
          return "move";
        }, filterEventType: function(t3) {
          return 0 === t3.search("drag");
        } }, _2 = S, P2 = { init: function(t3) {
          var e3 = t3;
          P2.document = e3.document, P2.DocumentFragment = e3.DocumentFragment || O2, P2.SVGElement = e3.SVGElement || O2, P2.SVGSVGElement = e3.SVGSVGElement || O2, P2.SVGElementInstance = e3.SVGElementInstance || O2, P2.Element = e3.Element || O2, P2.HTMLElement = e3.HTMLElement || P2.Element, P2.Event = e3.Event, P2.Touch = e3.Touch || O2, P2.PointerEvent = e3.PointerEvent || e3.MSPointerEvent;
        }, document: null, DocumentFragment: null, SVGElement: null, SVGSVGElement: null, SVGElementInstance: null, Element: null, HTMLElement: null, Event: null, Touch: null, PointerEvent: null };
        function O2() {
        }
        var k2 = P2;
        var D2 = { init: function(t3) {
          var e3 = k2.Element, n2 = t3.navigator || {};
          D2.supportsTouch = "ontouchstart" in t3 || w.func(t3.DocumentTouch) && k2.document instanceof t3.DocumentTouch, D2.supportsPointerEvent = false !== n2.pointerEnabled && !!k2.PointerEvent, D2.isIOS = /iP(hone|od|ad)/.test(n2.platform), D2.isIOS7 = /iP(hone|od|ad)/.test(n2.platform) && /OS 7[^\d]/.test(n2.appVersion), D2.isIe9 = /MSIE 9/.test(n2.userAgent), D2.isOperaMobile = "Opera" === n2.appName && D2.supportsTouch && /Presto/.test(n2.userAgent), D2.prefixedMatchesSelector = "matches" in e3.prototype ? "matches" : "webkitMatchesSelector" in e3.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in e3.prototype ? "mozMatchesSelector" : "oMatchesSelector" in e3.prototype ? "oMatchesSelector" : "msMatchesSelector", D2.pEventTypes = D2.supportsPointerEvent ? k2.PointerEvent === t3.MSPointerEvent ? { up: "MSPointerUp", down: "MSPointerDown", over: "mouseover", out: "mouseout", move: "MSPointerMove", cancel: "MSPointerCancel" } : { up: "pointerup", down: "pointerdown", over: "pointerover", out: "pointerout", move: "pointermove", cancel: "pointercancel" } : null, D2.wheelEvent = k2.document && "onmousewheel" in k2.document ? "mousewheel" : "wheel";
        }, supportsTouch: null, supportsPointerEvent: null, isIOS7: null, isIOS: null, isIe9: null, isOperaMobile: null, prefixedMatchesSelector: null, pEventTypes: null, wheelEvent: null };
        var I = D2;
        function M(t3, e3) {
          if (t3.contains) return t3.contains(e3);
          for (; e3; ) {
            if (e3 === t3) return true;
            e3 = e3.parentNode;
          }
          return false;
        }
        function z(t3, e3) {
          for (; w.element(t3); ) {
            if (R2(t3, e3)) return t3;
            t3 = A2(t3);
          }
          return null;
        }
        function A2(t3) {
          var e3 = t3.parentNode;
          if (w.docFrag(e3)) {
            for (; (e3 = e3.host) && w.docFrag(e3); ) ;
            return e3;
          }
          return e3;
        }
        function R2(t3, e3) {
          return g2 !== v2 && (e3 = e3.replace(/\/deep\//g, " ")), t3[I.prefixedMatchesSelector](e3);
        }
        var C2 = function(t3) {
          return t3.parentNode || t3.host;
        };
        function j(t3, e3) {
          for (var n2, r3 = [], i3 = t3; (n2 = C2(i3)) && i3 !== e3 && n2 !== i3.ownerDocument; ) r3.unshift(i3), i3 = n2;
          return r3;
        }
        function F(t3, e3, n2) {
          for (; w.element(t3); ) {
            if (R2(t3, e3)) return true;
            if ((t3 = A2(t3)) === n2) return R2(t3, e3);
          }
          return false;
        }
        function X2(t3) {
          return t3.correspondingUseElement || t3;
        }
        function Y2(t3) {
          var e3 = t3 instanceof k2.SVGElement ? t3.getBoundingClientRect() : t3.getClientRects()[0];
          return e3 && { left: e3.left, right: e3.right, top: e3.top, bottom: e3.bottom, width: e3.width || e3.right - e3.left, height: e3.height || e3.bottom - e3.top };
        }
        function L2(t3) {
          var e3, n2 = Y2(t3);
          if (!I.isIOS7 && n2) {
            var r3 = { x: (e3 = (e3 = y2(t3)) || g2).scrollX || e3.document.documentElement.scrollLeft, y: e3.scrollY || e3.document.documentElement.scrollTop };
            n2.left += r3.x, n2.right += r3.x, n2.top += r3.y, n2.bottom += r3.y;
          }
          return n2;
        }
        function q(t3) {
          for (var e3 = []; t3; ) e3.push(t3), t3 = A2(t3);
          return e3;
        }
        function B2(t3) {
          return !!w.string(t3) && (k2.document.querySelector(t3), true);
        }
        function V2(t3, e3) {
          for (var n2 in e3) t3[n2] = e3[n2];
          return t3;
        }
        function W2(t3, e3, n2) {
          return "parent" === t3 ? A2(n2) : "self" === t3 ? e3.getRect(n2) : z(n2, t3);
        }
        function G2(t3, e3, n2, r3) {
          var i3 = t3;
          return w.string(i3) ? i3 = W2(i3, e3, n2) : w.func(i3) && (i3 = i3.apply(void 0, r3)), w.element(i3) && (i3 = L2(i3)), i3;
        }
        function N(t3) {
          return t3 && { x: "x" in t3 ? t3.x : t3.left, y: "y" in t3 ? t3.y : t3.top };
        }
        function U(t3) {
          return !t3 || "x" in t3 && "y" in t3 || ((t3 = V2({}, t3)).x = t3.left || 0, t3.y = t3.top || 0, t3.width = t3.width || (t3.right || 0) - t3.x, t3.height = t3.height || (t3.bottom || 0) - t3.y), t3;
        }
        function H(t3, e3, n2) {
          t3.left && (e3.left += n2.x), t3.right && (e3.right += n2.x), t3.top && (e3.top += n2.y), t3.bottom && (e3.bottom += n2.y), e3.width = e3.right - e3.left, e3.height = e3.bottom - e3.top;
        }
        function K2(t3, e3, n2) {
          var r3 = n2 && t3.options[n2];
          return N(G2(r3 && r3.origin || t3.options.origin, t3, e3, [t3 && e3])) || { x: 0, y: 0 };
        }
        function $2(t3, e3) {
          var n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(t4) {
            return true;
          }, r3 = arguments.length > 3 ? arguments[3] : void 0;
          if (r3 = r3 || {}, w.string(t3) && -1 !== t3.search(" ") && (t3 = J(t3)), w.array(t3)) return t3.forEach((function(t4) {
            return $2(t4, e3, n2, r3);
          })), r3;
          if (w.object(t3) && (e3 = t3, t3 = ""), w.func(e3) && n2(t3)) r3[t3] = r3[t3] || [], r3[t3].push(e3);
          else if (w.array(e3)) for (var i3 = 0, o2 = e3; i3 < o2.length; i3++) {
            var a3 = o2[i3];
            $2(t3, a3, n2, r3);
          }
          else if (w.object(e3)) for (var s3 in e3) {
            $2(J(s3).map((function(e4) {
              return "".concat(t3).concat(e4);
            })), e3[s3], n2, r3);
          }
          return r3;
        }
        function J(t3) {
          return t3.trim().split(/ +/);
        }
        var Q = function(t3, e3) {
          return Math.sqrt(t3 * t3 + e3 * e3);
        }, Z2 = ["webkit", "moz"];
        function tt2(t3, e3) {
          t3.__set || (t3.__set = {});
          var n2 = function(n3) {
            if (Z2.some((function(t4) {
              return 0 === n3.indexOf(t4);
            }))) return 1;
            "function" != typeof t3[n3] && "__set" !== n3 && Object.defineProperty(t3, n3, { get: function() {
              return n3 in t3.__set ? t3.__set[n3] : t3.__set[n3] = e3[n3];
            }, set: function(e4) {
              t3.__set[n3] = e4;
            }, configurable: true });
          };
          for (var r3 in e3) n2(r3);
          return t3;
        }
        function et(t3, e3) {
          t3.page = t3.page || {}, t3.page.x = e3.page.x, t3.page.y = e3.page.y, t3.client = t3.client || {}, t3.client.x = e3.client.x, t3.client.y = e3.client.y, t3.timeStamp = e3.timeStamp;
        }
        function nt2(t3) {
          t3.page.x = 0, t3.page.y = 0, t3.client.x = 0, t3.client.y = 0;
        }
        function rt2(t3) {
          return t3 instanceof k2.Event || t3 instanceof k2.Touch;
        }
        function it2(t3, e3, n2) {
          return t3 = t3 || "page", (n2 = n2 || {}).x = e3[t3 + "X"], n2.y = e3[t3 + "Y"], n2;
        }
        function ot(t3, e3) {
          return e3 = e3 || { x: 0, y: 0 }, I.isOperaMobile && rt2(t3) ? (it2("screen", t3, e3), e3.x += window.scrollX, e3.y += window.scrollY) : it2("page", t3, e3), e3;
        }
        function at(t3) {
          return w.number(t3.pointerId) ? t3.pointerId : t3.identifier;
        }
        function st2(t3, e3, n2) {
          var r3 = e3.length > 1 ? lt(e3) : e3[0];
          ot(r3, t3.page), (function(t4, e4) {
            e4 = e4 || {}, I.isOperaMobile && rt2(t4) ? it2("screen", t4, e4) : it2("client", t4, e4);
          })(r3, t3.client), t3.timeStamp = n2;
        }
        function ct(t3) {
          var e3 = [];
          return w.array(t3) ? (e3[0] = t3[0], e3[1] = t3[1]) : "touchend" === t3.type ? 1 === t3.touches.length ? (e3[0] = t3.touches[0], e3[1] = t3.changedTouches[0]) : 0 === t3.touches.length && (e3[0] = t3.changedTouches[0], e3[1] = t3.changedTouches[1]) : (e3[0] = t3.touches[0], e3[1] = t3.touches[1]), e3;
        }
        function lt(t3) {
          for (var e3 = { pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0 }, n2 = 0; n2 < t3.length; n2++) {
            var r3 = t3[n2];
            for (var i3 in e3) e3[i3] += r3[i3];
          }
          for (var o2 in e3) e3[o2] /= t3.length;
          return e3;
        }
        function ut(t3) {
          if (!t3.length) return null;
          var e3 = ct(t3), n2 = Math.min(e3[0].pageX, e3[1].pageX), r3 = Math.min(e3[0].pageY, e3[1].pageY), i3 = Math.max(e3[0].pageX, e3[1].pageX), o2 = Math.max(e3[0].pageY, e3[1].pageY);
          return { x: n2, y: r3, left: n2, top: r3, right: i3, bottom: o2, width: i3 - n2, height: o2 - r3 };
        }
        function pt2(t3, e3) {
          var n2 = e3 + "X", r3 = e3 + "Y", i3 = ct(t3), o2 = i3[0][n2] - i3[1][n2], a3 = i3[0][r3] - i3[1][r3];
          return Q(o2, a3);
        }
        function ft(t3, e3) {
          var n2 = e3 + "X", r3 = e3 + "Y", i3 = ct(t3), o2 = i3[1][n2] - i3[0][n2], a3 = i3[1][r3] - i3[0][r3];
          return 180 * Math.atan2(a3, o2) / Math.PI;
        }
        function dt2(t3) {
          return w.string(t3.pointerType) ? t3.pointerType : w.number(t3.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][t3.pointerType] : /touch/.test(t3.type || "") || t3 instanceof k2.Touch ? "touch" : "mouse";
        }
        function ht(t3) {
          var e3 = w.func(t3.composedPath) ? t3.composedPath() : t3.path;
          return [X2(e3 ? e3[0] : t3.target), X2(t3.currentTarget)];
        }
        var vt2 = (function() {
          function t3(e3) {
            r2(this, t3), this.immediatePropagationStopped = false, this.propagationStopped = false, this._interaction = e3;
          }
          return o(t3, [{ key: "preventDefault", value: function() {
          } }, { key: "stopPropagation", value: function() {
            this.propagationStopped = true;
          } }, { key: "stopImmediatePropagation", value: function() {
            this.immediatePropagationStopped = this.propagationStopped = true;
          } }]), t3;
        })();
        Object.defineProperty(vt2.prototype, "interaction", { get: function() {
          return this._interaction._proxy;
        }, set: function() {
        } });
        var gt = function(t3, e3) {
          for (var n2 = 0; n2 < e3.length; n2++) {
            var r3 = e3[n2];
            t3.push(r3);
          }
          return t3;
        }, mt = function(t3) {
          return gt([], t3);
        }, yt = function(t3, e3) {
          for (var n2 = 0; n2 < t3.length; n2++) if (e3(t3[n2], n2, t3)) return n2;
          return -1;
        }, bt = function(t3, e3) {
          return t3[yt(t3, e3)];
        }, xt = (function(t3) {
          s2(n2, t3);
          var e3 = p(n2);
          function n2(t4, i3, o2) {
            var a3;
            r2(this, n2), (a3 = e3.call(this, i3._interaction)).dropzone = void 0, a3.dragEvent = void 0, a3.relatedTarget = void 0, a3.draggable = void 0, a3.propagationStopped = false, a3.immediatePropagationStopped = false;
            var s3 = "dragleave" === o2 ? t4.prev : t4.cur, c3 = s3.element, l2 = s3.dropzone;
            return a3.type = o2, a3.target = c3, a3.currentTarget = c3, a3.dropzone = l2, a3.dragEvent = i3, a3.relatedTarget = i3.target, a3.draggable = i3.interactable, a3.timeStamp = i3.timeStamp, a3;
          }
          return o(n2, [{ key: "reject", value: function() {
            var t4 = this, e4 = this._interaction.dropState;
            if ("dropactivate" === this.type || this.dropzone && e4.cur.dropzone === this.dropzone && e4.cur.element === this.target) if (e4.prev.dropzone = this.dropzone, e4.prev.element = this.target, e4.rejected = true, e4.events.enter = null, this.stopImmediatePropagation(), "dropactivate" === this.type) {
              var r3 = e4.activeDrops, i3 = yt(r3, (function(e5) {
                var n3 = e5.dropzone, r4 = e5.element;
                return n3 === t4.dropzone && r4 === t4.target;
              }));
              e4.activeDrops.splice(i3, 1);
              var o2 = new n2(e4, this.dragEvent, "dropdeactivate");
              o2.dropzone = this.dropzone, o2.target = this.target, this.dropzone.fire(o2);
            } else this.dropzone.fire(new n2(e4, this.dragEvent, "dragleave"));
          } }, { key: "preventDefault", value: function() {
          } }, { key: "stopPropagation", value: function() {
            this.propagationStopped = true;
          } }, { key: "stopImmediatePropagation", value: function() {
            this.immediatePropagationStopped = this.propagationStopped = true;
          } }]), n2;
        })(vt2);
        function wt(t3, e3) {
          for (var n2 = 0, r3 = t3.slice(); n2 < r3.length; n2++) {
            var i3 = r3[n2], o2 = i3.dropzone, a3 = i3.element;
            e3.dropzone = o2, e3.target = a3, o2.fire(e3), e3.propagationStopped = e3.immediatePropagationStopped = false;
          }
        }
        function Et(t3, e3) {
          for (var n2 = (function(t4, e4) {
            for (var n3 = [], r4 = 0, i4 = t4.interactables.list; r4 < i4.length; r4++) {
              var o2 = i4[r4];
              if (o2.options.drop.enabled) {
                var a3 = o2.options.drop.accept;
                if (!(w.element(a3) && a3 !== e4 || w.string(a3) && !R2(e4, a3) || w.func(a3) && !a3({ dropzone: o2, draggableElement: e4 }))) for (var s3 = 0, c3 = o2.getAllElements(); s3 < c3.length; s3++) {
                  var l2 = c3[s3];
                  l2 !== e4 && n3.push({ dropzone: o2, element: l2, rect: o2.getRect(l2) });
                }
              }
            }
            return n3;
          })(t3, e3), r3 = 0; r3 < n2.length; r3++) {
            var i3 = n2[r3];
            i3.rect = i3.dropzone.getRect(i3.element);
          }
          return n2;
        }
        function Tt(t3, e3, n2) {
          for (var r3 = t3.dropState, i3 = t3.interactable, o2 = t3.element, a3 = [], s3 = 0, c3 = r3.activeDrops; s3 < c3.length; s3++) {
            var l2 = c3[s3], u2 = l2.dropzone, p2 = l2.element, f2 = l2.rect, d3 = u2.dropCheck(e3, n2, i3, o2, p2, f2);
            a3.push(d3 ? p2 : null);
          }
          var h3 = (function(t4) {
            for (var e4, n3, r4, i4 = [], o3 = 0; o3 < t4.length; o3++) {
              var a4 = t4[o3], s4 = t4[e4];
              if (a4 && o3 !== e4) if (s4) {
                var c4 = C2(a4), l3 = C2(s4);
                if (c4 !== a4.ownerDocument) if (l3 !== a4.ownerDocument) if (c4 !== l3) {
                  i4 = i4.length ? i4 : j(s4);
                  var u3 = void 0;
                  if (s4 instanceof k2.HTMLElement && a4 instanceof k2.SVGElement && !(a4 instanceof k2.SVGSVGElement)) {
                    if (a4 === l3) continue;
                    u3 = a4.ownerSVGElement;
                  } else u3 = a4;
                  for (var p3 = j(u3, s4.ownerDocument), f3 = 0; p3[f3] && p3[f3] === i4[f3]; ) f3++;
                  var d4 = [p3[f3 - 1], p3[f3], i4[f3]];
                  if (d4[0]) for (var h4 = d4[0].lastChild; h4; ) {
                    if (h4 === d4[1]) {
                      e4 = o3, i4 = p3;
                      break;
                    }
                    if (h4 === d4[2]) break;
                    h4 = h4.previousSibling;
                  }
                } else r4 = s4, (parseInt(y2(n3 = a4).getComputedStyle(n3).zIndex, 10) || 0) >= (parseInt(y2(r4).getComputedStyle(r4).zIndex, 10) || 0) && (e4 = o3);
                else e4 = o3;
              } else e4 = o3;
            }
            return e4;
          })(a3);
          return r3.activeDrops[h3] || null;
        }
        function St(t3, e3, n2) {
          var r3 = t3.dropState, i3 = { enter: null, leave: null, activate: null, deactivate: null, move: null, drop: null };
          return "dragstart" === n2.type && (i3.activate = new xt(r3, n2, "dropactivate"), i3.activate.target = null, i3.activate.dropzone = null), "dragend" === n2.type && (i3.deactivate = new xt(r3, n2, "dropdeactivate"), i3.deactivate.target = null, i3.deactivate.dropzone = null), r3.rejected || (r3.cur.element !== r3.prev.element && (r3.prev.dropzone && (i3.leave = new xt(r3, n2, "dragleave"), n2.dragLeave = i3.leave.target = r3.prev.element, n2.prevDropzone = i3.leave.dropzone = r3.prev.dropzone), r3.cur.dropzone && (i3.enter = new xt(r3, n2, "dragenter"), n2.dragEnter = r3.cur.element, n2.dropzone = r3.cur.dropzone)), "dragend" === n2.type && r3.cur.dropzone && (i3.drop = new xt(r3, n2, "drop"), n2.dropzone = r3.cur.dropzone, n2.relatedTarget = r3.cur.element), "dragmove" === n2.type && r3.cur.dropzone && (i3.move = new xt(r3, n2, "dropmove"), n2.dropzone = r3.cur.dropzone)), i3;
        }
        function _t(t3, e3) {
          var n2 = t3.dropState, r3 = n2.activeDrops, i3 = n2.cur, o2 = n2.prev;
          e3.leave && o2.dropzone.fire(e3.leave), e3.enter && i3.dropzone.fire(e3.enter), e3.move && i3.dropzone.fire(e3.move), e3.drop && i3.dropzone.fire(e3.drop), e3.deactivate && wt(r3, e3.deactivate), n2.prev.dropzone = i3.dropzone, n2.prev.element = i3.element;
        }
        function Pt2(t3, e3) {
          var n2 = t3.interaction, r3 = t3.iEvent, i3 = t3.event;
          if ("dragmove" === r3.type || "dragend" === r3.type) {
            var o2 = n2.dropState;
            e3.dynamicDrop && (o2.activeDrops = Et(e3, n2.element));
            var a3 = r3, s3 = Tt(n2, a3, i3);
            o2.rejected = o2.rejected && !!s3 && s3.dropzone === o2.cur.dropzone && s3.element === o2.cur.element, o2.cur.dropzone = s3 && s3.dropzone, o2.cur.element = s3 && s3.element, o2.events = St(n2, 0, a3);
          }
        }
        var Ot2 = { id: "actions/drop", install: function(t3) {
          var e3 = t3.actions, n2 = t3.interactStatic, r3 = t3.Interactable, i3 = t3.defaults;
          t3.usePlugin(_2), r3.prototype.dropzone = function(t4) {
            return (function(t5, e4) {
              if (w.object(e4)) {
                if (t5.options.drop.enabled = false !== e4.enabled, e4.listeners) {
                  var n3 = $2(e4.listeners), r4 = Object.keys(n3).reduce((function(t6, e5) {
                    return t6[/^(enter|leave)/.test(e5) ? "drag".concat(e5) : /^(activate|deactivate|move)/.test(e5) ? "drop".concat(e5) : e5] = n3[e5], t6;
                  }), {}), i4 = t5.options.drop.listeners;
                  i4 && t5.off(i4), t5.on(r4), t5.options.drop.listeners = r4;
                }
                return w.func(e4.ondrop) && t5.on("drop", e4.ondrop), w.func(e4.ondropactivate) && t5.on("dropactivate", e4.ondropactivate), w.func(e4.ondropdeactivate) && t5.on("dropdeactivate", e4.ondropdeactivate), w.func(e4.ondragenter) && t5.on("dragenter", e4.ondragenter), w.func(e4.ondragleave) && t5.on("dragleave", e4.ondragleave), w.func(e4.ondropmove) && t5.on("dropmove", e4.ondropmove), /^(pointer|center)$/.test(e4.overlap) ? t5.options.drop.overlap = e4.overlap : w.number(e4.overlap) && (t5.options.drop.overlap = Math.max(Math.min(1, e4.overlap), 0)), "accept" in e4 && (t5.options.drop.accept = e4.accept), "checker" in e4 && (t5.options.drop.checker = e4.checker), t5;
              }
              if (w.bool(e4)) return t5.options.drop.enabled = e4, t5;
              return t5.options.drop;
            })(this, t4);
          }, r3.prototype.dropCheck = function(t4, e4, n3, r4, i4, o2) {
            return (function(t5, e5, n4, r5, i5, o3, a3) {
              var s3 = false;
              if (!(a3 = a3 || t5.getRect(o3))) return !!t5.options.drop.checker && t5.options.drop.checker(e5, n4, s3, t5, o3, r5, i5);
              var c3 = t5.options.drop.overlap;
              if ("pointer" === c3) {
                var l2 = K2(r5, i5, "drag"), u2 = ot(e5);
                u2.x += l2.x, u2.y += l2.y;
                var p2 = u2.x > a3.left && u2.x < a3.right, f2 = u2.y > a3.top && u2.y < a3.bottom;
                s3 = p2 && f2;
              }
              var d3 = r5.getRect(i5);
              if (d3 && "center" === c3) {
                var h3 = d3.left + d3.width / 2, v3 = d3.top + d3.height / 2;
                s3 = h3 >= a3.left && h3 <= a3.right && v3 >= a3.top && v3 <= a3.bottom;
              }
              if (d3 && w.number(c3)) {
                s3 = Math.max(0, Math.min(a3.right, d3.right) - Math.max(a3.left, d3.left)) * Math.max(0, Math.min(a3.bottom, d3.bottom) - Math.max(a3.top, d3.top)) / (d3.width * d3.height) >= c3;
              }
              t5.options.drop.checker && (s3 = t5.options.drop.checker(e5, n4, s3, t5, o3, r5, i5));
              return s3;
            })(this, t4, e4, n3, r4, i4, o2);
          }, n2.dynamicDrop = function(e4) {
            return w.bool(e4) ? (t3.dynamicDrop = e4, n2) : t3.dynamicDrop;
          }, V2(e3.phaselessTypes, { dragenter: true, dragleave: true, dropactivate: true, dropdeactivate: true, dropmove: true, drop: true }), e3.methodDict.drop = "dropzone", t3.dynamicDrop = false, i3.actions.drop = Ot2.defaults;
        }, listeners: { "interactions:before-action-start": function(t3) {
          var e3 = t3.interaction;
          "drag" === e3.prepared.name && (e3.dropState = { cur: { dropzone: null, element: null }, prev: { dropzone: null, element: null }, rejected: null, events: null, activeDrops: [] });
        }, "interactions:after-action-start": function(t3, e3) {
          var n2 = t3.interaction, r3 = (t3.event, t3.iEvent);
          if ("drag" === n2.prepared.name) {
            var i3 = n2.dropState;
            i3.activeDrops = [], i3.events = {}, i3.activeDrops = Et(e3, n2.element), i3.events = St(n2, 0, r3), i3.events.activate && (wt(i3.activeDrops, i3.events.activate), e3.fire("actions/drop:start", { interaction: n2, dragEvent: r3 }));
          }
        }, "interactions:action-move": Pt2, "interactions:after-action-move": function(t3, e3) {
          var n2 = t3.interaction, r3 = t3.iEvent;
          if ("drag" === n2.prepared.name) {
            var i3 = n2.dropState;
            _t(n2, i3.events), e3.fire("actions/drop:move", { interaction: n2, dragEvent: r3 }), i3.events = {};
          }
        }, "interactions:action-end": function(t3, e3) {
          if ("drag" === t3.interaction.prepared.name) {
            var n2 = t3.interaction, r3 = t3.iEvent;
            Pt2(t3, e3), _t(n2, n2.dropState.events), e3.fire("actions/drop:end", { interaction: n2, dragEvent: r3 });
          }
        }, "interactions:stop": function(t3) {
          var e3 = t3.interaction;
          if ("drag" === e3.prepared.name) {
            var n2 = e3.dropState;
            n2 && (n2.activeDrops = null, n2.events = null, n2.cur.dropzone = null, n2.cur.element = null, n2.prev.dropzone = null, n2.prev.element = null, n2.rejected = false);
          }
        } }, getActiveDrops: Et, getDrop: Tt, getDropEvents: St, fireDropEvents: _t, filterEventType: function(t3) {
          return 0 === t3.search("drag") || 0 === t3.search("drop");
        }, defaults: { enabled: false, accept: null, overlap: "pointer" } }, kt2 = Ot2;
        function Dt2(t3) {
          var e3 = t3.interaction, n2 = t3.iEvent, r3 = t3.phase;
          if ("gesture" === e3.prepared.name) {
            var i3 = e3.pointers.map((function(t4) {
              return t4.pointer;
            })), o2 = "start" === r3, a3 = "end" === r3, s3 = e3.interactable.options.deltaSource;
            if (n2.touches = [i3[0], i3[1]], o2) n2.distance = pt2(i3, s3), n2.box = ut(i3), n2.scale = 1, n2.ds = 0, n2.angle = ft(i3, s3), n2.da = 0, e3.gesture.startDistance = n2.distance, e3.gesture.startAngle = n2.angle;
            else if (a3 || e3.pointers.length < 2) {
              var c3 = e3.prevEvent;
              n2.distance = c3.distance, n2.box = c3.box, n2.scale = c3.scale, n2.ds = 0, n2.angle = c3.angle, n2.da = 0;
            } else n2.distance = pt2(i3, s3), n2.box = ut(i3), n2.scale = n2.distance / e3.gesture.startDistance, n2.angle = ft(i3, s3), n2.ds = n2.scale - e3.gesture.scale, n2.da = n2.angle - e3.gesture.angle;
            e3.gesture.distance = n2.distance, e3.gesture.angle = n2.angle, w.number(n2.scale) && n2.scale !== 1 / 0 && !isNaN(n2.scale) && (e3.gesture.scale = n2.scale);
          }
        }
        var It = { id: "actions/gesture", before: ["actions/drag", "actions/resize"], install: function(t3) {
          var e3 = t3.actions, n2 = t3.Interactable, r3 = t3.defaults;
          n2.prototype.gesturable = function(t4) {
            return w.object(t4) ? (this.options.gesture.enabled = false !== t4.enabled, this.setPerAction("gesture", t4), this.setOnEvents("gesture", t4), this) : w.bool(t4) ? (this.options.gesture.enabled = t4, this) : this.options.gesture;
          }, e3.map.gesture = It, e3.methodDict.gesture = "gesturable", r3.actions.gesture = It.defaults;
        }, listeners: { "interactions:action-start": Dt2, "interactions:action-move": Dt2, "interactions:action-end": Dt2, "interactions:new": function(t3) {
          t3.interaction.gesture = { angle: 0, distance: 0, scale: 1, startAngle: 0, startDistance: 0 };
        }, "auto-start:check": function(t3) {
          if (!(t3.interaction.pointers.length < 2)) {
            var e3 = t3.interactable.options.gesture;
            if (e3 && e3.enabled) return t3.action = { name: "gesture" }, false;
          }
        } }, defaults: {}, getCursor: function() {
          return "";
        }, filterEventType: function(t3) {
          return 0 === t3.search("gesture");
        } }, Mt2 = It;
        function zt2(t3, e3, n2, r3, i3, o2, a3) {
          if (!e3) return false;
          if (true === e3) {
            var s3 = w.number(o2.width) ? o2.width : o2.right - o2.left, c3 = w.number(o2.height) ? o2.height : o2.bottom - o2.top;
            if (a3 = Math.min(a3, Math.abs(("left" === t3 || "right" === t3 ? s3 : c3) / 2)), s3 < 0 && ("left" === t3 ? t3 = "right" : "right" === t3 && (t3 = "left")), c3 < 0 && ("top" === t3 ? t3 = "bottom" : "bottom" === t3 && (t3 = "top")), "left" === t3) {
              var l2 = s3 >= 0 ? o2.left : o2.right;
              return n2.x < l2 + a3;
            }
            if ("top" === t3) {
              var u2 = c3 >= 0 ? o2.top : o2.bottom;
              return n2.y < u2 + a3;
            }
            if ("right" === t3) return n2.x > (s3 >= 0 ? o2.right : o2.left) - a3;
            if ("bottom" === t3) return n2.y > (c3 >= 0 ? o2.bottom : o2.top) - a3;
          }
          return !!w.element(r3) && (w.element(e3) ? e3 === r3 : F(r3, e3, i3));
        }
        function At2(t3) {
          var e3 = t3.iEvent, n2 = t3.interaction;
          if ("resize" === n2.prepared.name && n2.resizeAxes) {
            var r3 = e3;
            n2.interactable.options.resize.square ? ("y" === n2.resizeAxes ? r3.delta.x = r3.delta.y : r3.delta.y = r3.delta.x, r3.axes = "xy") : (r3.axes = n2.resizeAxes, "x" === n2.resizeAxes ? r3.delta.y = 0 : "y" === n2.resizeAxes && (r3.delta.x = 0));
          }
        }
        var Rt, Ct2, jt = { id: "actions/resize", before: ["actions/drag"], install: function(t3) {
          var e3 = t3.actions, n2 = t3.browser, r3 = t3.Interactable, i3 = t3.defaults;
          jt.cursors = (function(t4) {
            return t4.isIe9 ? { x: "e-resize", y: "s-resize", xy: "se-resize", top: "n-resize", left: "w-resize", bottom: "s-resize", right: "e-resize", topleft: "se-resize", bottomright: "se-resize", topright: "ne-resize", bottomleft: "ne-resize" } : { x: "ew-resize", y: "ns-resize", xy: "nwse-resize", top: "ns-resize", left: "ew-resize", bottom: "ns-resize", right: "ew-resize", topleft: "nwse-resize", bottomright: "nwse-resize", topright: "nesw-resize", bottomleft: "nesw-resize" };
          })(n2), jt.defaultMargin = n2.supportsTouch || n2.supportsPointerEvent ? 20 : 10, r3.prototype.resizable = function(e4) {
            return (function(t4, e5, n3) {
              if (w.object(e5)) return t4.options.resize.enabled = false !== e5.enabled, t4.setPerAction("resize", e5), t4.setOnEvents("resize", e5), w.string(e5.axis) && /^x$|^y$|^xy$/.test(e5.axis) ? t4.options.resize.axis = e5.axis : null === e5.axis && (t4.options.resize.axis = n3.defaults.actions.resize.axis), w.bool(e5.preserveAspectRatio) ? t4.options.resize.preserveAspectRatio = e5.preserveAspectRatio : w.bool(e5.square) && (t4.options.resize.square = e5.square), t4;
              if (w.bool(e5)) return t4.options.resize.enabled = e5, t4;
              return t4.options.resize;
            })(this, e4, t3);
          }, e3.map.resize = jt, e3.methodDict.resize = "resizable", i3.actions.resize = jt.defaults;
        }, listeners: { "interactions:new": function(t3) {
          t3.interaction.resizeAxes = "xy";
        }, "interactions:action-start": function(t3) {
          !(function(t4) {
            var e3 = t4.iEvent, n2 = t4.interaction;
            if ("resize" === n2.prepared.name && n2.prepared.edges) {
              var r3 = e3, i3 = n2.rect;
              n2._rects = { start: V2({}, i3), corrected: V2({}, i3), previous: V2({}, i3), delta: { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 } }, r3.edges = n2.prepared.edges, r3.rect = n2._rects.corrected, r3.deltaRect = n2._rects.delta;
            }
          })(t3), At2(t3);
        }, "interactions:action-move": function(t3) {
          !(function(t4) {
            var e3 = t4.iEvent, n2 = t4.interaction;
            if ("resize" === n2.prepared.name && n2.prepared.edges) {
              var r3 = e3, i3 = n2.interactable.options.resize.invert, o2 = "reposition" === i3 || "negate" === i3, a3 = n2.rect, s3 = n2._rects, c3 = s3.start, l2 = s3.corrected, u2 = s3.delta, p2 = s3.previous;
              if (V2(p2, l2), o2) {
                if (V2(l2, a3), "reposition" === i3) {
                  if (l2.top > l2.bottom) {
                    var f2 = l2.top;
                    l2.top = l2.bottom, l2.bottom = f2;
                  }
                  if (l2.left > l2.right) {
                    var d3 = l2.left;
                    l2.left = l2.right, l2.right = d3;
                  }
                }
              } else l2.top = Math.min(a3.top, c3.bottom), l2.bottom = Math.max(a3.bottom, c3.top), l2.left = Math.min(a3.left, c3.right), l2.right = Math.max(a3.right, c3.left);
              for (var h3 in l2.width = l2.right - l2.left, l2.height = l2.bottom - l2.top, l2) u2[h3] = l2[h3] - p2[h3];
              r3.edges = n2.prepared.edges, r3.rect = l2, r3.deltaRect = u2;
            }
          })(t3), At2(t3);
        }, "interactions:action-end": function(t3) {
          var e3 = t3.iEvent, n2 = t3.interaction;
          if ("resize" === n2.prepared.name && n2.prepared.edges) {
            var r3 = e3;
            r3.edges = n2.prepared.edges, r3.rect = n2._rects.corrected, r3.deltaRect = n2._rects.delta;
          }
        }, "auto-start:check": function(t3) {
          var e3 = t3.interaction, n2 = t3.interactable, r3 = t3.element, i3 = t3.rect, o2 = t3.buttons;
          if (i3) {
            var a3 = V2({}, e3.coords.cur.page), s3 = n2.options.resize;
            if (s3 && s3.enabled && (!e3.pointerIsDown || !/mouse|pointer/.test(e3.pointerType) || 0 != (o2 & s3.mouseButtons))) {
              if (w.object(s3.edges)) {
                var c3 = { left: false, right: false, top: false, bottom: false };
                for (var l2 in c3) c3[l2] = zt2(l2, s3.edges[l2], a3, e3._latestPointer.eventTarget, r3, i3, s3.margin || jt.defaultMargin);
                c3.left = c3.left && !c3.right, c3.top = c3.top && !c3.bottom, (c3.left || c3.right || c3.top || c3.bottom) && (t3.action = { name: "resize", edges: c3 });
              } else {
                var u2 = "y" !== s3.axis && a3.x > i3.right - jt.defaultMargin, p2 = "x" !== s3.axis && a3.y > i3.bottom - jt.defaultMargin;
                (u2 || p2) && (t3.action = { name: "resize", axes: (u2 ? "x" : "") + (p2 ? "y" : "") });
              }
              return !t3.action && void 0;
            }
          }
        } }, defaults: { square: false, preserveAspectRatio: false, axis: "xy", margin: NaN, edges: null, invert: "none" }, cursors: null, getCursor: function(t3) {
          var e3 = t3.edges, n2 = t3.axis, r3 = t3.name, i3 = jt.cursors, o2 = null;
          if (n2) o2 = i3[r3 + n2];
          else if (e3) {
            for (var a3 = "", s3 = 0, c3 = ["top", "bottom", "left", "right"]; s3 < c3.length; s3++) {
              var l2 = c3[s3];
              e3[l2] && (a3 += l2);
            }
            o2 = i3[a3];
          }
          return o2;
        }, filterEventType: function(t3) {
          return 0 === t3.search("resize");
        }, defaultMargin: null }, Ft2 = jt, Xt2 = { id: "actions", install: function(t3) {
          t3.usePlugin(Mt2), t3.usePlugin(Ft2), t3.usePlugin(_2), t3.usePlugin(kt2);
        } }, Yt = 0;
        var Lt2 = { request: function(t3) {
          return Rt(t3);
        }, cancel: function(t3) {
          return Ct2(t3);
        }, init: function(t3) {
          if (Rt = t3.requestAnimationFrame, Ct2 = t3.cancelAnimationFrame, !Rt) for (var e3 = ["ms", "moz", "webkit", "o"], n2 = 0; n2 < e3.length; n2++) {
            var r3 = e3[n2];
            Rt = t3["".concat(r3, "RequestAnimationFrame")], Ct2 = t3["".concat(r3, "CancelAnimationFrame")] || t3["".concat(r3, "CancelRequestAnimationFrame")];
          }
          Rt = Rt && Rt.bind(t3), Ct2 = Ct2 && Ct2.bind(t3), Rt || (Rt = function(e4) {
            var n3 = Date.now(), r4 = Math.max(0, 16 - (n3 - Yt)), i3 = t3.setTimeout((function() {
              e4(n3 + r4);
            }), r4);
            return Yt = n3 + r4, i3;
          }, Ct2 = function(t4) {
            return clearTimeout(t4);
          });
        } };
        var qt2 = { defaults: { enabled: false, margin: 60, container: null, speed: 300 }, now: Date.now, interaction: null, i: 0, x: 0, y: 0, isScrolling: false, prevTime: 0, margin: 0, speed: 0, start: function(t3) {
          qt2.isScrolling = true, Lt2.cancel(qt2.i), t3.autoScroll = qt2, qt2.interaction = t3, qt2.prevTime = qt2.now(), qt2.i = Lt2.request(qt2.scroll);
        }, stop: function() {
          qt2.isScrolling = false, qt2.interaction && (qt2.interaction.autoScroll = null), Lt2.cancel(qt2.i);
        }, scroll: function() {
          var t3 = qt2.interaction, e3 = t3.interactable, n2 = t3.element, r3 = t3.prepared.name, i3 = e3.options[r3].autoScroll, o2 = Bt2(i3.container, e3, n2), a3 = qt2.now(), s3 = (a3 - qt2.prevTime) / 1e3, c3 = i3.speed * s3;
          if (c3 >= 1) {
            var l2 = { x: qt2.x * c3, y: qt2.y * c3 };
            if (l2.x || l2.y) {
              var u2 = Vt(o2);
              w.window(o2) ? o2.scrollBy(l2.x, l2.y) : o2 && (o2.scrollLeft += l2.x, o2.scrollTop += l2.y);
              var p2 = Vt(o2), f2 = { x: p2.x - u2.x, y: p2.y - u2.y };
              (f2.x || f2.y) && e3.fire({ type: "autoscroll", target: n2, interactable: e3, delta: f2, interaction: t3, container: o2 });
            }
            qt2.prevTime = a3;
          }
          qt2.isScrolling && (Lt2.cancel(qt2.i), qt2.i = Lt2.request(qt2.scroll));
        }, check: function(t3, e3) {
          var n2;
          return null == (n2 = t3.options[e3].autoScroll) ? void 0 : n2.enabled;
        }, onInteractionMove: function(t3) {
          var e3 = t3.interaction, n2 = t3.pointer;
          if (e3.interacting() && qt2.check(e3.interactable, e3.prepared.name)) if (e3.simulation) qt2.x = qt2.y = 0;
          else {
            var r3, i3, o2, a3, s3 = e3.interactable, c3 = e3.element, l2 = e3.prepared.name, u2 = s3.options[l2].autoScroll, p2 = Bt2(u2.container, s3, c3);
            if (w.window(p2)) a3 = n2.clientX < qt2.margin, r3 = n2.clientY < qt2.margin, i3 = n2.clientX > p2.innerWidth - qt2.margin, o2 = n2.clientY > p2.innerHeight - qt2.margin;
            else {
              var f2 = Y2(p2);
              a3 = n2.clientX < f2.left + qt2.margin, r3 = n2.clientY < f2.top + qt2.margin, i3 = n2.clientX > f2.right - qt2.margin, o2 = n2.clientY > f2.bottom - qt2.margin;
            }
            qt2.x = i3 ? 1 : a3 ? -1 : 0, qt2.y = o2 ? 1 : r3 ? -1 : 0, qt2.isScrolling || (qt2.margin = u2.margin, qt2.speed = u2.speed, qt2.start(e3));
          }
        } };
        function Bt2(t3, e3, n2) {
          return (w.string(t3) ? W2(t3, e3, n2) : t3) || y2(n2);
        }
        function Vt(t3) {
          return w.window(t3) && (t3 = window.document.body), { x: t3.scrollLeft, y: t3.scrollTop };
        }
        var Wt = { id: "auto-scroll", install: function(t3) {
          var e3 = t3.defaults, n2 = t3.actions;
          t3.autoScroll = qt2, qt2.now = function() {
            return t3.now();
          }, n2.phaselessTypes.autoscroll = true, e3.perAction.autoScroll = qt2.defaults;
        }, listeners: { "interactions:new": function(t3) {
          t3.interaction.autoScroll = null;
        }, "interactions:destroy": function(t3) {
          t3.interaction.autoScroll = null, qt2.stop(), qt2.interaction && (qt2.interaction = null);
        }, "interactions:stop": qt2.stop, "interactions:action-move": function(t3) {
          return qt2.onInteractionMove(t3);
        } } }, Gt = Wt;
        function Nt(t3, e3) {
          var n2 = false;
          return function() {
            return n2 || (g2.console.warn(e3), n2 = true), t3.apply(this, arguments);
          };
        }
        function Ut(t3, e3) {
          return t3.name = e3.name, t3.axis = e3.axis, t3.edges = e3.edges, t3;
        }
        function Ht(t3) {
          return w.bool(t3) ? (this.options.styleCursor = t3, this) : null === t3 ? (delete this.options.styleCursor, this) : this.options.styleCursor;
        }
        function Kt(t3) {
          return w.func(t3) ? (this.options.actionChecker = t3, this) : null === t3 ? (delete this.options.actionChecker, this) : this.options.actionChecker;
        }
        var $t = { id: "auto-start/interactableMethods", install: function(t3) {
          var e3 = t3.Interactable;
          e3.prototype.getAction = function(e4, n2, r3, i3) {
            var o2 = (function(t4, e5, n3, r4, i4) {
              var o3 = t4.getRect(r4), a3 = e5.buttons || { 0: 1, 1: 4, 3: 8, 4: 16 }[e5.button], s3 = { action: null, interactable: t4, interaction: n3, element: r4, rect: o3, buttons: a3 };
              return i4.fire("auto-start:check", s3), s3.action;
            })(this, n2, r3, i3, t3);
            return this.options.actionChecker ? this.options.actionChecker(e4, n2, o2, this, i3, r3) : o2;
          }, e3.prototype.ignoreFrom = Nt((function(t4) {
            return this._backCompatOption("ignoreFrom", t4);
          }), "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."), e3.prototype.allowFrom = Nt((function(t4) {
            return this._backCompatOption("allowFrom", t4);
          }), "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."), e3.prototype.actionChecker = Kt, e3.prototype.styleCursor = Ht;
        } };
        function Jt2(t3, e3, n2, r3, i3) {
          return e3.testIgnoreAllow(e3.options[t3.name], n2, r3) && e3.options[t3.name].enabled && ee(e3, n2, t3, i3) ? t3 : null;
        }
        function Qt(t3, e3, n2, r3, i3, o2, a3) {
          for (var s3 = 0, c3 = r3.length; s3 < c3; s3++) {
            var l2 = r3[s3], u2 = i3[s3], p2 = l2.getAction(e3, n2, t3, u2);
            if (p2) {
              var f2 = Jt2(p2, l2, u2, o2, a3);
              if (f2) return { action: f2, interactable: l2, element: u2 };
            }
          }
          return { action: null, interactable: null, element: null };
        }
        function Zt(t3, e3, n2, r3, i3) {
          var o2 = [], a3 = [], s3 = r3;
          function c3(t4) {
            o2.push(t4), a3.push(s3);
          }
          for (; w.element(s3); ) {
            o2 = [], a3 = [], i3.interactables.forEachMatch(s3, c3);
            var l2 = Qt(t3, e3, n2, o2, a3, r3, i3);
            if (l2.action && !l2.interactable.options[l2.action.name].manualStart) return l2;
            s3 = A2(s3);
          }
          return { action: null, interactable: null, element: null };
        }
        function te(t3, e3, n2) {
          var r3 = e3.action, i3 = e3.interactable, o2 = e3.element;
          r3 = r3 || { name: null }, t3.interactable = i3, t3.element = o2, Ut(t3.prepared, r3), t3.rect = i3 && r3.name ? i3.getRect(o2) : null, ie2(t3, n2), n2.fire("autoStart:prepared", { interaction: t3 });
        }
        function ee(t3, e3, n2, r3) {
          var i3 = t3.options, o2 = i3[n2.name].max, a3 = i3[n2.name].maxPerElement, s3 = r3.autoStart.maxInteractions, c3 = 0, l2 = 0, u2 = 0;
          if (!(o2 && a3 && s3)) return false;
          for (var p2 = 0, f2 = r3.interactions.list; p2 < f2.length; p2++) {
            var d3 = f2[p2], h3 = d3.prepared.name;
            if (d3.interacting()) {
              if (++c3 >= s3) return false;
              if (d3.interactable === t3) {
                if ((l2 += h3 === n2.name ? 1 : 0) >= o2) return false;
                if (d3.element === e3 && (u2++, h3 === n2.name && u2 >= a3)) return false;
              }
            }
          }
          return s3 > 0;
        }
        function ne(t3, e3) {
          return w.number(t3) ? (e3.autoStart.maxInteractions = t3, this) : e3.autoStart.maxInteractions;
        }
        function re2(t3, e3, n2) {
          var r3 = n2.autoStart.cursorElement;
          r3 && r3 !== t3 && (r3.style.cursor = ""), t3.ownerDocument.documentElement.style.cursor = e3, t3.style.cursor = e3, n2.autoStart.cursorElement = e3 ? t3 : null;
        }
        function ie2(t3, e3) {
          var n2 = t3.interactable, r3 = t3.element, i3 = t3.prepared;
          if ("mouse" === t3.pointerType && n2 && n2.options.styleCursor) {
            var o2 = "";
            if (i3.name) {
              var a3 = n2.options[i3.name].cursorChecker;
              o2 = w.func(a3) ? a3(i3, n2, r3, t3._interacting) : e3.actions.map[i3.name].getCursor(i3);
            }
            re2(t3.element, o2 || "", e3);
          } else e3.autoStart.cursorElement && re2(e3.autoStart.cursorElement, "", e3);
        }
        var oe2 = { id: "auto-start/base", before: ["actions"], install: function(t3) {
          var e3 = t3.interactStatic, n2 = t3.defaults;
          t3.usePlugin($t), n2.base.actionChecker = null, n2.base.styleCursor = true, V2(n2.perAction, { manualStart: false, max: 1 / 0, maxPerElement: 1, allowFrom: null, ignoreFrom: null, mouseButtons: 1 }), e3.maxInteractions = function(e4) {
            return ne(e4, t3);
          }, t3.autoStart = { maxInteractions: 1 / 0, withinInteractionLimit: ee, cursorElement: null };
        }, listeners: { "interactions:down": function(t3, e3) {
          var n2 = t3.interaction, r3 = t3.pointer, i3 = t3.event, o2 = t3.eventTarget;
          n2.interacting() || te(n2, Zt(n2, r3, i3, o2, e3), e3);
        }, "interactions:move": function(t3, e3) {
          !(function(t4, e4) {
            var n2 = t4.interaction, r3 = t4.pointer, i3 = t4.event, o2 = t4.eventTarget;
            "mouse" !== n2.pointerType || n2.pointerIsDown || n2.interacting() || te(n2, Zt(n2, r3, i3, o2, e4), e4);
          })(t3, e3), (function(t4, e4) {
            var n2 = t4.interaction;
            if (n2.pointerIsDown && !n2.interacting() && n2.pointerWasMoved && n2.prepared.name) {
              e4.fire("autoStart:before-start", t4);
              var r3 = n2.interactable, i3 = n2.prepared.name;
              i3 && r3 && (r3.options[i3].manualStart || !ee(r3, n2.element, n2.prepared, e4) ? n2.stop() : (n2.start(n2.prepared, r3, n2.element), ie2(n2, e4)));
            }
          })(t3, e3);
        }, "interactions:stop": function(t3, e3) {
          var n2 = t3.interaction, r3 = n2.interactable;
          r3 && r3.options.styleCursor && re2(n2.element, "", e3);
        } }, maxInteractions: ne, withinInteractionLimit: ee, validateAction: Jt2 }, ae2 = oe2;
        var se = { id: "auto-start/dragAxis", listeners: { "autoStart:before-start": function(t3, e3) {
          var n2 = t3.interaction, r3 = t3.eventTarget, i3 = t3.dx, o2 = t3.dy;
          if ("drag" === n2.prepared.name) {
            var a3 = Math.abs(i3), s3 = Math.abs(o2), c3 = n2.interactable.options.drag, l2 = c3.startAxis, u2 = a3 > s3 ? "x" : a3 < s3 ? "y" : "xy";
            if (n2.prepared.axis = "start" === c3.lockAxis ? u2[0] : c3.lockAxis, "xy" !== u2 && "xy" !== l2 && l2 !== u2) {
              n2.prepared.name = null;
              for (var p2 = r3, f2 = function(t4) {
                if (t4 !== n2.interactable) {
                  var i4 = n2.interactable.options.drag;
                  if (!i4.manualStart && t4.testIgnoreAllow(i4, p2, r3)) {
                    var o3 = t4.getAction(n2.downPointer, n2.downEvent, n2, p2);
                    if (o3 && "drag" === o3.name && (function(t5, e4) {
                      if (!e4) return false;
                      var n3 = e4.options.drag.startAxis;
                      return "xy" === t5 || "xy" === n3 || n3 === t5;
                    })(u2, t4) && ae2.validateAction(o3, t4, p2, r3, e3)) return t4;
                  }
                }
              }; w.element(p2); ) {
                var d3 = e3.interactables.forEachMatch(p2, f2);
                if (d3) {
                  n2.prepared.name = "drag", n2.interactable = d3, n2.element = p2;
                  break;
                }
                p2 = A2(p2);
              }
            }
          }
        } } };
        function ce(t3) {
          var e3 = t3.prepared && t3.prepared.name;
          if (!e3) return null;
          var n2 = t3.interactable.options;
          return n2[e3].hold || n2[e3].delay;
        }
        var le = { id: "auto-start/hold", install: function(t3) {
          var e3 = t3.defaults;
          t3.usePlugin(ae2), e3.perAction.hold = 0, e3.perAction.delay = 0;
        }, listeners: { "interactions:new": function(t3) {
          t3.interaction.autoStartHoldTimer = null;
        }, "autoStart:prepared": function(t3) {
          var e3 = t3.interaction, n2 = ce(e3);
          n2 > 0 && (e3.autoStartHoldTimer = setTimeout((function() {
            e3.start(e3.prepared, e3.interactable, e3.element);
          }), n2));
        }, "interactions:move": function(t3) {
          var e3 = t3.interaction, n2 = t3.duplicate;
          e3.autoStartHoldTimer && e3.pointerWasMoved && !n2 && (clearTimeout(e3.autoStartHoldTimer), e3.autoStartHoldTimer = null);
        }, "autoStart:before-start": function(t3) {
          var e3 = t3.interaction;
          ce(e3) > 0 && (e3.prepared.name = null);
        } }, getHoldDuration: ce }, ue = le, pe = { id: "auto-start", install: function(t3) {
          t3.usePlugin(ae2), t3.usePlugin(ue), t3.usePlugin(se);
        } }, fe2 = function(t3) {
          return /^(always|never|auto)$/.test(t3) ? (this.options.preventDefault = t3, this) : w.bool(t3) ? (this.options.preventDefault = t3 ? "always" : "never", this) : this.options.preventDefault;
        };
        function de(t3) {
          var e3 = t3.interaction, n2 = t3.event;
          e3.interactable && e3.interactable.checkAndPreventDefault(n2);
        }
        var he = { id: "core/interactablePreventDefault", install: function(t3) {
          var e3 = t3.Interactable;
          e3.prototype.preventDefault = fe2, e3.prototype.checkAndPreventDefault = function(e4) {
            return (function(t4, e5, n2) {
              var r3 = t4.options.preventDefault;
              if ("never" !== r3) if ("always" !== r3) {
                if (e5.events.supportsPassive && /^touch(start|move)$/.test(n2.type)) {
                  var i3 = y2(n2.target).document, o2 = e5.getDocOptions(i3);
                  if (!o2 || !o2.events || false !== o2.events.passive) return;
                }
                /^(mouse|pointer|touch)*(down|start)/i.test(n2.type) || w.element(n2.target) && R2(n2.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *") || n2.preventDefault();
              } else n2.preventDefault();
            })(this, t3, e4);
          }, t3.interactions.docEvents.push({ type: "dragstart", listener: function(e4) {
            for (var n2 = 0, r3 = t3.interactions.list; n2 < r3.length; n2++) {
              var i3 = r3[n2];
              if (i3.element && (i3.element === e4.target || M(i3.element, e4.target))) return void i3.interactable.checkAndPreventDefault(e4);
            }
          } });
        }, listeners: ["down", "move", "up", "cancel"].reduce((function(t3, e3) {
          return t3["interactions:".concat(e3)] = de, t3;
        }), {}) };
        function ve(t3, e3) {
          if (e3.phaselessTypes[t3]) return true;
          for (var n2 in e3.map) if (0 === t3.indexOf(n2) && t3.substr(n2.length) in e3.phases) return true;
          return false;
        }
        function ge2(t3) {
          var e3 = {};
          for (var n2 in t3) {
            var r3 = t3[n2];
            w.plainObject(r3) ? e3[n2] = ge2(r3) : w.array(r3) ? e3[n2] = mt(r3) : e3[n2] = r3;
          }
          return e3;
        }
        var me = (function() {
          function t3(e3) {
            r2(this, t3), this.states = [], this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 }, this.startDelta = void 0, this.result = void 0, this.endResult = void 0, this.startEdges = void 0, this.edges = void 0, this.interaction = void 0, this.interaction = e3, this.result = ye(), this.edges = { left: false, right: false, top: false, bottom: false };
          }
          return o(t3, [{ key: "start", value: function(t4, e3) {
            var n2, r3, i3 = t4.phase, o2 = this.interaction, a3 = (function(t5) {
              var e4 = t5.interactable.options[t5.prepared.name], n3 = e4.modifiers;
              if (n3 && n3.length) return n3;
              return ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map((function(t6) {
                var n4 = e4[t6];
                return n4 && n4.enabled && { options: n4, methods: n4._methods };
              })).filter((function(t6) {
                return !!t6;
              }));
            })(o2);
            this.prepareStates(a3), this.startEdges = V2({}, o2.edges), this.edges = V2({}, this.startEdges), this.startOffset = (n2 = o2.rect, r3 = e3, n2 ? { left: r3.x - n2.left, top: r3.y - n2.top, right: n2.right - r3.x, bottom: n2.bottom - r3.y } : { left: 0, top: 0, right: 0, bottom: 0 }), this.startDelta = { x: 0, y: 0 };
            var s3 = this.fillArg({ phase: i3, pageCoords: e3, preEnd: false });
            return this.result = ye(), this.startAll(s3), this.result = this.setAll(s3);
          } }, { key: "fillArg", value: function(t4) {
            var e3 = this.interaction;
            return t4.interaction = e3, t4.interactable = e3.interactable, t4.element = e3.element, t4.rect || (t4.rect = e3.rect), t4.edges || (t4.edges = this.startEdges), t4.startOffset = this.startOffset, t4;
          } }, { key: "startAll", value: function(t4) {
            for (var e3 = 0, n2 = this.states; e3 < n2.length; e3++) {
              var r3 = n2[e3];
              r3.methods.start && (t4.state = r3, r3.methods.start(t4));
            }
          } }, { key: "setAll", value: function(t4) {
            var e3 = t4.phase, n2 = t4.preEnd, r3 = t4.skipModifiers, i3 = t4.rect, o2 = t4.edges;
            t4.coords = V2({}, t4.pageCoords), t4.rect = V2({}, i3), t4.edges = V2({}, o2);
            for (var a3 = r3 ? this.states.slice(r3) : this.states, s3 = ye(t4.coords, t4.rect), c3 = 0; c3 < a3.length; c3++) {
              var l2, u2 = a3[c3], p2 = u2.options, f2 = V2({}, t4.coords), d3 = null;
              null != (l2 = u2.methods) && l2.set && this.shouldDo(p2, n2, e3) && (t4.state = u2, d3 = u2.methods.set(t4), H(t4.edges, t4.rect, { x: t4.coords.x - f2.x, y: t4.coords.y - f2.y })), s3.eventProps.push(d3);
            }
            V2(this.edges, t4.edges), s3.delta.x = t4.coords.x - t4.pageCoords.x, s3.delta.y = t4.coords.y - t4.pageCoords.y, s3.rectDelta.left = t4.rect.left - i3.left, s3.rectDelta.right = t4.rect.right - i3.right, s3.rectDelta.top = t4.rect.top - i3.top, s3.rectDelta.bottom = t4.rect.bottom - i3.bottom;
            var h3 = this.result.coords, v3 = this.result.rect;
            if (h3 && v3) {
              var g3 = s3.rect.left !== v3.left || s3.rect.right !== v3.right || s3.rect.top !== v3.top || s3.rect.bottom !== v3.bottom;
              s3.changed = g3 || h3.x !== s3.coords.x || h3.y !== s3.coords.y;
            }
            return s3;
          } }, { key: "applyToInteraction", value: function(t4) {
            var e3 = this.interaction, n2 = t4.phase, r3 = e3.coords.cur, i3 = e3.coords.start, o2 = this.result, a3 = this.startDelta, s3 = o2.delta;
            "start" === n2 && V2(this.startDelta, o2.delta);
            for (var c3 = 0, l2 = [[i3, a3], [r3, s3]]; c3 < l2.length; c3++) {
              var u2 = l2[c3], p2 = u2[0], f2 = u2[1];
              p2.page.x += f2.x, p2.page.y += f2.y, p2.client.x += f2.x, p2.client.y += f2.y;
            }
            var d3 = this.result.rectDelta, h3 = t4.rect || e3.rect;
            h3.left += d3.left, h3.right += d3.right, h3.top += d3.top, h3.bottom += d3.bottom, h3.width = h3.right - h3.left, h3.height = h3.bottom - h3.top;
          } }, { key: "setAndApply", value: function(t4) {
            var e3 = this.interaction, n2 = t4.phase, r3 = t4.preEnd, i3 = t4.skipModifiers, o2 = this.setAll(this.fillArg({ preEnd: r3, phase: n2, pageCoords: t4.modifiedCoords || e3.coords.cur.page }));
            if (this.result = o2, !o2.changed && (!i3 || i3 < this.states.length) && e3.interacting()) return false;
            if (t4.modifiedCoords) {
              var a3 = e3.coords.cur.page, s3 = { x: t4.modifiedCoords.x - a3.x, y: t4.modifiedCoords.y - a3.y };
              o2.coords.x += s3.x, o2.coords.y += s3.y, o2.delta.x += s3.x, o2.delta.y += s3.y;
            }
            this.applyToInteraction(t4);
          } }, { key: "beforeEnd", value: function(t4) {
            var e3 = t4.interaction, n2 = t4.event, r3 = this.states;
            if (r3 && r3.length) {
              for (var i3 = false, o2 = 0; o2 < r3.length; o2++) {
                var a3 = r3[o2];
                t4.state = a3;
                var s3 = a3.options, c3 = a3.methods, l2 = c3.beforeEnd && c3.beforeEnd(t4);
                if (l2) return this.endResult = l2, false;
                i3 = i3 || !i3 && this.shouldDo(s3, true, t4.phase, true);
              }
              i3 && e3.move({ event: n2, preEnd: true });
            }
          } }, { key: "stop", value: function(t4) {
            var e3 = t4.interaction;
            if (this.states && this.states.length) {
              var n2 = V2({ states: this.states, interactable: e3.interactable, element: e3.element, rect: null }, t4);
              this.fillArg(n2);
              for (var r3 = 0, i3 = this.states; r3 < i3.length; r3++) {
                var o2 = i3[r3];
                n2.state = o2, o2.methods.stop && o2.methods.stop(n2);
              }
              this.states = null, this.endResult = null;
            }
          } }, { key: "prepareStates", value: function(t4) {
            this.states = [];
            for (var e3 = 0; e3 < t4.length; e3++) {
              var n2 = t4[e3], r3 = n2.options, i3 = n2.methods, o2 = n2.name;
              this.states.push({ options: r3, methods: i3, index: e3, name: o2 });
            }
            return this.states;
          } }, { key: "restoreInteractionCoords", value: function(t4) {
            var e3 = t4.interaction, n2 = e3.coords, r3 = e3.rect, i3 = e3.modification;
            if (i3.result) {
              for (var o2 = i3.startDelta, a3 = i3.result, s3 = a3.delta, c3 = a3.rectDelta, l2 = 0, u2 = [[n2.start, o2], [n2.cur, s3]]; l2 < u2.length; l2++) {
                var p2 = u2[l2], f2 = p2[0], d3 = p2[1];
                f2.page.x -= d3.x, f2.page.y -= d3.y, f2.client.x -= d3.x, f2.client.y -= d3.y;
              }
              r3.left -= c3.left, r3.right -= c3.right, r3.top -= c3.top, r3.bottom -= c3.bottom;
            }
          } }, { key: "shouldDo", value: function(t4, e3, n2, r3) {
            return !(!t4 || false === t4.enabled || r3 && !t4.endOnly || t4.endOnly && !e3 || "start" === n2 && !t4.setStart);
          } }, { key: "copyFrom", value: function(t4) {
            this.startOffset = t4.startOffset, this.startDelta = t4.startDelta, this.startEdges = t4.startEdges, this.edges = t4.edges, this.states = t4.states.map((function(t5) {
              return ge2(t5);
            })), this.result = ye(V2({}, t4.result.coords), V2({}, t4.result.rect));
          } }, { key: "destroy", value: function() {
            for (var t4 in this) this[t4] = null;
          } }]), t3;
        })();
        function ye(t3, e3) {
          return { rect: e3, coords: t3, delta: { x: 0, y: 0 }, rectDelta: { left: 0, right: 0, top: 0, bottom: 0 }, eventProps: [], changed: true };
        }
        function be(t3, e3) {
          var n2 = t3.defaults, r3 = { start: t3.start, set: t3.set, beforeEnd: t3.beforeEnd, stop: t3.stop }, i3 = function(t4) {
            var i4 = t4 || {};
            for (var o2 in i4.enabled = false !== i4.enabled, n2) o2 in i4 || (i4[o2] = n2[o2]);
            var a3 = { options: i4, methods: r3, name: e3, enable: function() {
              return i4.enabled = true, a3;
            }, disable: function() {
              return i4.enabled = false, a3;
            } };
            return a3;
          };
          return e3 && "string" == typeof e3 && (i3._defaults = n2, i3._methods = r3), i3;
        }
        function xe2(t3) {
          var e3 = t3.iEvent, n2 = t3.interaction.modification.result;
          n2 && (e3.modifiers = n2.eventProps);
        }
        var we2 = { id: "modifiers/base", before: ["actions"], install: function(t3) {
          t3.defaults.perAction.modifiers = [];
        }, listeners: { "interactions:new": function(t3) {
          var e3 = t3.interaction;
          e3.modification = new me(e3);
        }, "interactions:before-action-start": function(t3) {
          var e3 = t3.interaction, n2 = t3.interaction.modification;
          n2.start(t3, e3.coords.start.page), e3.edges = n2.edges, n2.applyToInteraction(t3);
        }, "interactions:before-action-move": function(t3) {
          var e3 = t3.interaction, n2 = e3.modification, r3 = n2.setAndApply(t3);
          return e3.edges = n2.edges, r3;
        }, "interactions:before-action-end": function(t3) {
          var e3 = t3.interaction, n2 = e3.modification, r3 = n2.beforeEnd(t3);
          return e3.edges = n2.startEdges, r3;
        }, "interactions:action-start": xe2, "interactions:action-move": xe2, "interactions:action-end": xe2, "interactions:after-action-start": function(t3) {
          return t3.interaction.modification.restoreInteractionCoords(t3);
        }, "interactions:after-action-move": function(t3) {
          return t3.interaction.modification.restoreInteractionCoords(t3);
        }, "interactions:stop": function(t3) {
          return t3.interaction.modification.stop(t3);
        } } }, Ee = we2, Te = { base: { preventDefault: "auto", deltaSource: "page" }, perAction: { enabled: false, origin: { x: 0, y: 0 } }, actions: {} }, Se = (function(t3) {
          s2(n2, t3);
          var e3 = p(n2);
          function n2(t4, i3, o2, a3, s3, c3, l2) {
            var p2;
            r2(this, n2), (p2 = e3.call(this, t4)).relatedTarget = null, p2.screenX = void 0, p2.screenY = void 0, p2.button = void 0, p2.buttons = void 0, p2.ctrlKey = void 0, p2.shiftKey = void 0, p2.altKey = void 0, p2.metaKey = void 0, p2.page = void 0, p2.client = void 0, p2.delta = void 0, p2.rect = void 0, p2.x0 = void 0, p2.y0 = void 0, p2.t0 = void 0, p2.dt = void 0, p2.duration = void 0, p2.clientX0 = void 0, p2.clientY0 = void 0, p2.velocity = void 0, p2.speed = void 0, p2.swipe = void 0, p2.axes = void 0, p2.preEnd = void 0, s3 = s3 || t4.element;
            var f2 = t4.interactable, d3 = (f2 && f2.options || Te).deltaSource, h3 = K2(f2, s3, o2), v3 = "start" === a3, g3 = "end" === a3, m2 = v3 ? u(p2) : t4.prevEvent, y3 = v3 ? t4.coords.start : g3 ? { page: m2.page, client: m2.client, timeStamp: t4.coords.cur.timeStamp } : t4.coords.cur;
            return p2.page = V2({}, y3.page), p2.client = V2({}, y3.client), p2.rect = V2({}, t4.rect), p2.timeStamp = y3.timeStamp, g3 || (p2.page.x -= h3.x, p2.page.y -= h3.y, p2.client.x -= h3.x, p2.client.y -= h3.y), p2.ctrlKey = i3.ctrlKey, p2.altKey = i3.altKey, p2.shiftKey = i3.shiftKey, p2.metaKey = i3.metaKey, p2.button = i3.button, p2.buttons = i3.buttons, p2.target = s3, p2.currentTarget = s3, p2.preEnd = c3, p2.type = l2 || o2 + (a3 || ""), p2.interactable = f2, p2.t0 = v3 ? t4.pointers[t4.pointers.length - 1].downTime : m2.t0, p2.x0 = t4.coords.start.page.x - h3.x, p2.y0 = t4.coords.start.page.y - h3.y, p2.clientX0 = t4.coords.start.client.x - h3.x, p2.clientY0 = t4.coords.start.client.y - h3.y, p2.delta = v3 || g3 ? { x: 0, y: 0 } : { x: p2[d3].x - m2[d3].x, y: p2[d3].y - m2[d3].y }, p2.dt = t4.coords.delta.timeStamp, p2.duration = p2.timeStamp - p2.t0, p2.velocity = V2({}, t4.coords.velocity[d3]), p2.speed = Q(p2.velocity.x, p2.velocity.y), p2.swipe = g3 || "inertiastart" === a3 ? p2.getSwipe() : null, p2;
          }
          return o(n2, [{ key: "getSwipe", value: function() {
            var t4 = this._interaction;
            if (t4.prevEvent.speed < 600 || this.timeStamp - t4.prevEvent.timeStamp > 150) return null;
            var e4 = 180 * Math.atan2(t4.prevEvent.velocityY, t4.prevEvent.velocityX) / Math.PI;
            e4 < 0 && (e4 += 360);
            var n3 = 112.5 <= e4 && e4 < 247.5, r3 = 202.5 <= e4 && e4 < 337.5;
            return { up: r3, down: !r3 && 22.5 <= e4 && e4 < 157.5, left: n3, right: !n3 && (292.5 <= e4 || e4 < 67.5), angle: e4, speed: t4.prevEvent.speed, velocity: { x: t4.prevEvent.velocityX, y: t4.prevEvent.velocityY } };
          } }, { key: "preventDefault", value: function() {
          } }, { key: "stopImmediatePropagation", value: function() {
            this.immediatePropagationStopped = this.propagationStopped = true;
          } }, { key: "stopPropagation", value: function() {
            this.propagationStopped = true;
          } }]), n2;
        })(vt2);
        Object.defineProperties(Se.prototype, { pageX: { get: function() {
          return this.page.x;
        }, set: function(t3) {
          this.page.x = t3;
        } }, pageY: { get: function() {
          return this.page.y;
        }, set: function(t3) {
          this.page.y = t3;
        } }, clientX: { get: function() {
          return this.client.x;
        }, set: function(t3) {
          this.client.x = t3;
        } }, clientY: { get: function() {
          return this.client.y;
        }, set: function(t3) {
          this.client.y = t3;
        } }, dx: { get: function() {
          return this.delta.x;
        }, set: function(t3) {
          this.delta.x = t3;
        } }, dy: { get: function() {
          return this.delta.y;
        }, set: function(t3) {
          this.delta.y = t3;
        } }, velocityX: { get: function() {
          return this.velocity.x;
        }, set: function(t3) {
          this.velocity.x = t3;
        } }, velocityY: { get: function() {
          return this.velocity.y;
        }, set: function(t3) {
          this.velocity.y = t3;
        } } });
        var _e = o((function t3(e3, n2, i3, o2, a3) {
          r2(this, t3), this.id = void 0, this.pointer = void 0, this.event = void 0, this.downTime = void 0, this.downTarget = void 0, this.id = e3, this.pointer = n2, this.event = i3, this.downTime = o2, this.downTarget = a3;
        })), Pe = (function(t3) {
          return t3.interactable = "", t3.element = "", t3.prepared = "", t3.pointerIsDown = "", t3.pointerWasMoved = "", t3._proxy = "", t3;
        })({}), Oe = (function(t3) {
          return t3.start = "", t3.move = "", t3.end = "", t3.stop = "", t3.interacting = "", t3;
        })({}), ke2 = 0, De2 = (function() {
          function t3(e3) {
            var n2 = this, i3 = e3.pointerType, o2 = e3.scopeFire;
            r2(this, t3), this.interactable = null, this.element = null, this.rect = null, this._rects = void 0, this.edges = null, this._scopeFire = void 0, this.prepared = { name: null, axis: null, edges: null }, this.pointerType = void 0, this.pointers = [], this.downEvent = null, this.downPointer = {}, this._latestPointer = { pointer: null, event: null, eventTarget: null }, this.prevEvent = null, this.pointerIsDown = false, this.pointerWasMoved = false, this._interacting = false, this._ending = false, this._stopped = true, this._proxy = void 0, this.simulation = null, this.doMove = Nt((function(t4) {
              this.move(t4);
            }), "The interaction.doMove() method has been renamed to interaction.move()"), this.coords = { start: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, prev: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, cur: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, delta: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 }, velocity: { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 } }, this._id = ke2++, this._scopeFire = o2, this.pointerType = i3;
            var a3 = this;
            this._proxy = {};
            var s3 = function(t4) {
              Object.defineProperty(n2._proxy, t4, { get: function() {
                return a3[t4];
              } });
            };
            for (var c3 in Pe) s3(c3);
            var l2 = function(t4) {
              Object.defineProperty(n2._proxy, t4, { value: function() {
                return a3[t4].apply(a3, arguments);
              } });
            };
            for (var u2 in Oe) l2(u2);
            this._scopeFire("interactions:new", { interaction: this });
          }
          return o(t3, [{ key: "pointerMoveTolerance", get: function() {
            return 1;
          } }, { key: "pointerDown", value: function(t4, e3, n2) {
            var r3 = this.updatePointer(t4, e3, n2, true), i3 = this.pointers[r3];
            this._scopeFire("interactions:down", { pointer: t4, event: e3, eventTarget: n2, pointerIndex: r3, pointerInfo: i3, type: "down", interaction: this });
          } }, { key: "start", value: function(t4, e3, n2) {
            return !(this.interacting() || !this.pointerIsDown || this.pointers.length < ("gesture" === t4.name ? 2 : 1) || !e3.options[t4.name].enabled) && (Ut(this.prepared, t4), this.interactable = e3, this.element = n2, this.rect = e3.getRect(n2), this.edges = this.prepared.edges ? V2({}, this.prepared.edges) : { left: true, right: true, top: true, bottom: true }, this._stopped = false, this._interacting = this._doPhase({ interaction: this, event: this.downEvent, phase: "start" }) && !this._stopped, this._interacting);
          } }, { key: "pointerMove", value: function(t4, e3, n2) {
            this.simulation || this.modification && this.modification.endResult || this.updatePointer(t4, e3, n2, false);
            var r3, i3, o2 = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
            this.pointerIsDown && !this.pointerWasMoved && (r3 = this.coords.cur.client.x - this.coords.start.client.x, i3 = this.coords.cur.client.y - this.coords.start.client.y, this.pointerWasMoved = Q(r3, i3) > this.pointerMoveTolerance);
            var a3, s3, c3, l2 = this.getPointerIndex(t4), u2 = { pointer: t4, pointerIndex: l2, pointerInfo: this.pointers[l2], event: e3, type: "move", eventTarget: n2, dx: r3, dy: i3, duplicate: o2, interaction: this };
            o2 || (a3 = this.coords.velocity, s3 = this.coords.delta, c3 = Math.max(s3.timeStamp / 1e3, 1e-3), a3.page.x = s3.page.x / c3, a3.page.y = s3.page.y / c3, a3.client.x = s3.client.x / c3, a3.client.y = s3.client.y / c3, a3.timeStamp = c3), this._scopeFire("interactions:move", u2), o2 || this.simulation || (this.interacting() && (u2.type = null, this.move(u2)), this.pointerWasMoved && et(this.coords.prev, this.coords.cur));
          } }, { key: "move", value: function(t4) {
            t4 && t4.event || nt2(this.coords.delta), (t4 = V2({ pointer: this._latestPointer.pointer, event: this._latestPointer.event, eventTarget: this._latestPointer.eventTarget, interaction: this }, t4 || {})).phase = "move", this._doPhase(t4);
          } }, { key: "pointerUp", value: function(t4, e3, n2, r3) {
            var i3 = this.getPointerIndex(t4);
            -1 === i3 && (i3 = this.updatePointer(t4, e3, n2, false));
            var o2 = /cancel$/i.test(e3.type) ? "cancel" : "up";
            this._scopeFire("interactions:".concat(o2), { pointer: t4, pointerIndex: i3, pointerInfo: this.pointers[i3], event: e3, eventTarget: n2, type: o2, curEventTarget: r3, interaction: this }), this.simulation || this.end(e3), this.removePointer(t4, e3);
          } }, { key: "documentBlur", value: function(t4) {
            this.end(t4), this._scopeFire("interactions:blur", { event: t4, type: "blur", interaction: this });
          } }, { key: "end", value: function(t4) {
            var e3;
            this._ending = true, t4 = t4 || this._latestPointer.event, this.interacting() && (e3 = this._doPhase({ event: t4, interaction: this, phase: "end" })), this._ending = false, true === e3 && this.stop();
          } }, { key: "currentAction", value: function() {
            return this._interacting ? this.prepared.name : null;
          } }, { key: "interacting", value: function() {
            return this._interacting;
          } }, { key: "stop", value: function() {
            this._scopeFire("interactions:stop", { interaction: this }), this.interactable = this.element = null, this._interacting = false, this._stopped = true, this.prepared.name = this.prevEvent = null;
          } }, { key: "getPointerIndex", value: function(t4) {
            var e3 = at(t4);
            return "mouse" === this.pointerType || "pen" === this.pointerType ? this.pointers.length - 1 : yt(this.pointers, (function(t5) {
              return t5.id === e3;
            }));
          } }, { key: "getPointerInfo", value: function(t4) {
            return this.pointers[this.getPointerIndex(t4)];
          } }, { key: "updatePointer", value: function(t4, e3, n2, r3) {
            var i3, o2, a3, s3 = at(t4), c3 = this.getPointerIndex(t4), l2 = this.pointers[c3];
            return r3 = false !== r3 && (r3 || /(down|start)$/i.test(e3.type)), l2 ? l2.pointer = t4 : (l2 = new _e(s3, t4, e3, null, null), c3 = this.pointers.length, this.pointers.push(l2)), st2(this.coords.cur, this.pointers.map((function(t5) {
              return t5.pointer;
            })), this._now()), i3 = this.coords.delta, o2 = this.coords.prev, a3 = this.coords.cur, i3.page.x = a3.page.x - o2.page.x, i3.page.y = a3.page.y - o2.page.y, i3.client.x = a3.client.x - o2.client.x, i3.client.y = a3.client.y - o2.client.y, i3.timeStamp = a3.timeStamp - o2.timeStamp, r3 && (this.pointerIsDown = true, l2.downTime = this.coords.cur.timeStamp, l2.downTarget = n2, tt2(this.downPointer, t4), this.interacting() || (et(this.coords.start, this.coords.cur), et(this.coords.prev, this.coords.cur), this.downEvent = e3, this.pointerWasMoved = false)), this._updateLatestPointer(t4, e3, n2), this._scopeFire("interactions:update-pointer", { pointer: t4, event: e3, eventTarget: n2, down: r3, pointerInfo: l2, pointerIndex: c3, interaction: this }), c3;
          } }, { key: "removePointer", value: function(t4, e3) {
            var n2 = this.getPointerIndex(t4);
            if (-1 !== n2) {
              var r3 = this.pointers[n2];
              this._scopeFire("interactions:remove-pointer", { pointer: t4, event: e3, eventTarget: null, pointerIndex: n2, pointerInfo: r3, interaction: this }), this.pointers.splice(n2, 1), this.pointerIsDown = false;
            }
          } }, { key: "_updateLatestPointer", value: function(t4, e3, n2) {
            this._latestPointer.pointer = t4, this._latestPointer.event = e3, this._latestPointer.eventTarget = n2;
          } }, { key: "destroy", value: function() {
            this._latestPointer.pointer = null, this._latestPointer.event = null, this._latestPointer.eventTarget = null;
          } }, { key: "_createPreparedEvent", value: function(t4, e3, n2, r3) {
            return new Se(this, t4, this.prepared.name, e3, this.element, n2, r3);
          } }, { key: "_fireEvent", value: function(t4) {
            var e3;
            null == (e3 = this.interactable) || e3.fire(t4), (!this.prevEvent || t4.timeStamp >= this.prevEvent.timeStamp) && (this.prevEvent = t4);
          } }, { key: "_doPhase", value: function(t4) {
            var e3 = t4.event, n2 = t4.phase, r3 = t4.preEnd, i3 = t4.type, o2 = this.rect;
            if (o2 && "move" === n2 && (H(this.edges, o2, this.coords.delta[this.interactable.options.deltaSource]), o2.width = o2.right - o2.left, o2.height = o2.bottom - o2.top), false === this._scopeFire("interactions:before-action-".concat(n2), t4)) return false;
            var a3 = t4.iEvent = this._createPreparedEvent(e3, n2, r3, i3);
            return this._scopeFire("interactions:action-".concat(n2), t4), "start" === n2 && (this.prevEvent = a3), this._fireEvent(a3), this._scopeFire("interactions:after-action-".concat(n2), t4), true;
          } }, { key: "_now", value: function() {
            return Date.now();
          } }]), t3;
        })();
        function Ie(t3) {
          Me2(t3.interaction);
        }
        function Me2(t3) {
          if (!(function(t4) {
            return !(!t4.offset.pending.x && !t4.offset.pending.y);
          })(t3)) return false;
          var e3 = t3.offset.pending;
          return Ae2(t3.coords.cur, e3), Ae2(t3.coords.delta, e3), H(t3.edges, t3.rect, e3), e3.x = 0, e3.y = 0, true;
        }
        function ze(t3) {
          var e3 = t3.x, n2 = t3.y;
          this.offset.pending.x += e3, this.offset.pending.y += n2, this.offset.total.x += e3, this.offset.total.y += n2;
        }
        function Ae2(t3, e3) {
          var n2 = t3.page, r3 = t3.client, i3 = e3.x, o2 = e3.y;
          n2.x += i3, n2.y += o2, r3.x += i3, r3.y += o2;
        }
        Oe.offsetBy = "";
        var Re = { id: "offset", before: ["modifiers", "pointer-events", "actions", "inertia"], install: function(t3) {
          t3.Interaction.prototype.offsetBy = ze;
        }, listeners: { "interactions:new": function(t3) {
          t3.interaction.offset = { total: { x: 0, y: 0 }, pending: { x: 0, y: 0 } };
        }, "interactions:update-pointer": function(t3) {
          return (function(t4) {
            t4.pointerIsDown && (Ae2(t4.coords.cur, t4.offset.total), t4.offset.pending.x = 0, t4.offset.pending.y = 0);
          })(t3.interaction);
        }, "interactions:before-action-start": Ie, "interactions:before-action-move": Ie, "interactions:before-action-end": function(t3) {
          var e3 = t3.interaction;
          if (Me2(e3)) return e3.move({ offset: true }), e3.end(), false;
        }, "interactions:stop": function(t3) {
          var e3 = t3.interaction;
          e3.offset.total.x = 0, e3.offset.total.y = 0, e3.offset.pending.x = 0, e3.offset.pending.y = 0;
        } } }, Ce2 = Re;
        var je2 = (function() {
          function t3(e3) {
            r2(this, t3), this.active = false, this.isModified = false, this.smoothEnd = false, this.allowResume = false, this.modification = void 0, this.modifierCount = 0, this.modifierArg = void 0, this.startCoords = void 0, this.t0 = 0, this.v0 = 0, this.te = 0, this.targetOffset = void 0, this.modifiedOffset = void 0, this.currentOffset = void 0, this.lambda_v0 = 0, this.one_ve_v0 = 0, this.timeout = void 0, this.interaction = void 0, this.interaction = e3;
          }
          return o(t3, [{ key: "start", value: function(t4) {
            var e3 = this.interaction, n2 = Fe(e3);
            if (!n2 || !n2.enabled) return false;
            var r3 = e3.coords.velocity.client, i3 = Q(r3.x, r3.y), o2 = this.modification || (this.modification = new me(e3));
            if (o2.copyFrom(e3.modification), this.t0 = e3._now(), this.allowResume = n2.allowResume, this.v0 = i3, this.currentOffset = { x: 0, y: 0 }, this.startCoords = e3.coords.cur.page, this.modifierArg = o2.fillArg({ pageCoords: this.startCoords, preEnd: true, phase: "inertiastart" }), this.t0 - e3.coords.cur.timeStamp < 50 && i3 > n2.minSpeed && i3 > n2.endSpeed) this.startInertia();
            else {
              if (o2.result = o2.setAll(this.modifierArg), !o2.result.changed) return false;
              this.startSmoothEnd();
            }
            return e3.modification.result.rect = null, e3.offsetBy(this.targetOffset), e3._doPhase({ interaction: e3, event: t4, phase: "inertiastart" }), e3.offsetBy({ x: -this.targetOffset.x, y: -this.targetOffset.y }), e3.modification.result.rect = null, this.active = true, e3.simulation = this, true;
          } }, { key: "startInertia", value: function() {
            var t4 = this, e3 = this.interaction.coords.velocity.client, n2 = Fe(this.interaction), r3 = n2.resistance, i3 = -Math.log(n2.endSpeed / this.v0) / r3;
            this.targetOffset = { x: (e3.x - i3) / r3, y: (e3.y - i3) / r3 }, this.te = i3, this.lambda_v0 = r3 / this.v0, this.one_ve_v0 = 1 - n2.endSpeed / this.v0;
            var o2 = this.modification, a3 = this.modifierArg;
            a3.pageCoords = { x: this.startCoords.x + this.targetOffset.x, y: this.startCoords.y + this.targetOffset.y }, o2.result = o2.setAll(a3), o2.result.changed && (this.isModified = true, this.modifiedOffset = { x: this.targetOffset.x + o2.result.delta.x, y: this.targetOffset.y + o2.result.delta.y }), this.onNextFrame((function() {
              return t4.inertiaTick();
            }));
          } }, { key: "startSmoothEnd", value: function() {
            var t4 = this;
            this.smoothEnd = true, this.isModified = true, this.targetOffset = { x: this.modification.result.delta.x, y: this.modification.result.delta.y }, this.onNextFrame((function() {
              return t4.smoothEndTick();
            }));
          } }, { key: "onNextFrame", value: function(t4) {
            var e3 = this;
            this.timeout = Lt2.request((function() {
              e3.active && t4();
            }));
          } }, { key: "inertiaTick", value: function() {
            var t4, e3, n2, r3, i3, o2, a3, s3 = this, c3 = this.interaction, l2 = Fe(c3).resistance, u2 = (c3._now() - this.t0) / 1e3;
            if (u2 < this.te) {
              var p2, f2 = 1 - (Math.exp(-l2 * u2) - this.lambda_v0) / this.one_ve_v0;
              this.isModified ? (t4 = 0, e3 = 0, n2 = this.targetOffset.x, r3 = this.targetOffset.y, i3 = this.modifiedOffset.x, o2 = this.modifiedOffset.y, p2 = { x: Ye2(a3 = f2, t4, n2, i3), y: Ye2(a3, e3, r3, o2) }) : p2 = { x: this.targetOffset.x * f2, y: this.targetOffset.y * f2 };
              var d3 = { x: p2.x - this.currentOffset.x, y: p2.y - this.currentOffset.y };
              this.currentOffset.x += d3.x, this.currentOffset.y += d3.y, c3.offsetBy(d3), c3.move(), this.onNextFrame((function() {
                return s3.inertiaTick();
              }));
            } else c3.offsetBy({ x: this.modifiedOffset.x - this.currentOffset.x, y: this.modifiedOffset.y - this.currentOffset.y }), this.end();
          } }, { key: "smoothEndTick", value: function() {
            var t4 = this, e3 = this.interaction, n2 = e3._now() - this.t0, r3 = Fe(e3).smoothEndDuration;
            if (n2 < r3) {
              var i3 = { x: Le2(n2, 0, this.targetOffset.x, r3), y: Le2(n2, 0, this.targetOffset.y, r3) }, o2 = { x: i3.x - this.currentOffset.x, y: i3.y - this.currentOffset.y };
              this.currentOffset.x += o2.x, this.currentOffset.y += o2.y, e3.offsetBy(o2), e3.move({ skipModifiers: this.modifierCount }), this.onNextFrame((function() {
                return t4.smoothEndTick();
              }));
            } else e3.offsetBy({ x: this.targetOffset.x - this.currentOffset.x, y: this.targetOffset.y - this.currentOffset.y }), this.end();
          } }, { key: "resume", value: function(t4) {
            var e3 = t4.pointer, n2 = t4.event, r3 = t4.eventTarget, i3 = this.interaction;
            i3.offsetBy({ x: -this.currentOffset.x, y: -this.currentOffset.y }), i3.updatePointer(e3, n2, r3, true), i3._doPhase({ interaction: i3, event: n2, phase: "resume" }), et(i3.coords.prev, i3.coords.cur), this.stop();
          } }, { key: "end", value: function() {
            this.interaction.move(), this.interaction.end(), this.stop();
          } }, { key: "stop", value: function() {
            this.active = this.smoothEnd = false, this.interaction.simulation = null, Lt2.cancel(this.timeout);
          } }]), t3;
        })();
        function Fe(t3) {
          var e3 = t3.interactable, n2 = t3.prepared;
          return e3 && e3.options && n2.name && e3.options[n2.name].inertia;
        }
        var Xe = { id: "inertia", before: ["modifiers", "actions"], install: function(t3) {
          var e3 = t3.defaults;
          t3.usePlugin(Ce2), t3.usePlugin(Ee), t3.actions.phases.inertiastart = true, t3.actions.phases.resume = true, e3.perAction.inertia = { enabled: false, resistance: 10, minSpeed: 100, endSpeed: 10, allowResume: true, smoothEndDuration: 300 };
        }, listeners: { "interactions:new": function(t3) {
          var e3 = t3.interaction;
          e3.inertia = new je2(e3);
        }, "interactions:before-action-end": function(t3) {
          var e3 = t3.interaction, n2 = t3.event;
          return (!e3._interacting || e3.simulation || !e3.inertia.start(n2)) && null;
        }, "interactions:down": function(t3) {
          var e3 = t3.interaction, n2 = t3.eventTarget, r3 = e3.inertia;
          if (r3.active) for (var i3 = n2; w.element(i3); ) {
            if (i3 === e3.element) {
              r3.resume(t3);
              break;
            }
            i3 = A2(i3);
          }
        }, "interactions:stop": function(t3) {
          var e3 = t3.interaction.inertia;
          e3.active && e3.stop();
        }, "interactions:before-action-resume": function(t3) {
          var e3 = t3.interaction.modification;
          e3.stop(t3), e3.start(t3, t3.interaction.coords.cur.page), e3.applyToInteraction(t3);
        }, "interactions:before-action-inertiastart": function(t3) {
          return t3.interaction.modification.setAndApply(t3);
        }, "interactions:action-resume": xe2, "interactions:action-inertiastart": xe2, "interactions:after-action-inertiastart": function(t3) {
          return t3.interaction.modification.restoreInteractionCoords(t3);
        }, "interactions:after-action-resume": function(t3) {
          return t3.interaction.modification.restoreInteractionCoords(t3);
        } } };
        function Ye2(t3, e3, n2, r3) {
          var i3 = 1 - t3;
          return i3 * i3 * e3 + 2 * i3 * t3 * n2 + t3 * t3 * r3;
        }
        function Le2(t3, e3, n2, r3) {
          return -n2 * (t3 /= r3) * (t3 - 2) + e3;
        }
        var qe = Xe;
        function Be2(t3, e3) {
          for (var n2 = 0; n2 < e3.length; n2++) {
            var r3 = e3[n2];
            if (t3.immediatePropagationStopped) break;
            r3(t3);
          }
        }
        var Ve = (function() {
          function t3(e3) {
            r2(this, t3), this.options = void 0, this.types = {}, this.propagationStopped = false, this.immediatePropagationStopped = false, this.global = void 0, this.options = V2({}, e3 || {});
          }
          return o(t3, [{ key: "fire", value: function(t4) {
            var e3, n2 = this.global;
            (e3 = this.types[t4.type]) && Be2(t4, e3), !t4.propagationStopped && n2 && (e3 = n2[t4.type]) && Be2(t4, e3);
          } }, { key: "on", value: function(t4, e3) {
            var n2 = $2(t4, e3);
            for (t4 in n2) this.types[t4] = gt(this.types[t4] || [], n2[t4]);
          } }, { key: "off", value: function(t4, e3) {
            var n2 = $2(t4, e3);
            for (t4 in n2) {
              var r3 = this.types[t4];
              if (r3 && r3.length) for (var i3 = 0, o2 = n2[t4]; i3 < o2.length; i3++) {
                var a3 = o2[i3], s3 = r3.indexOf(a3);
                -1 !== s3 && r3.splice(s3, 1);
              }
            }
          } }, { key: "getRect", value: function(t4) {
            return null;
          } }]), t3;
        })();
        var We2 = (function() {
          function t3(e3) {
            r2(this, t3), this.currentTarget = void 0, this.originalEvent = void 0, this.type = void 0, this.originalEvent = e3, tt2(this, e3);
          }
          return o(t3, [{ key: "preventOriginalDefault", value: function() {
            this.originalEvent.preventDefault();
          } }, { key: "stopPropagation", value: function() {
            this.originalEvent.stopPropagation();
          } }, { key: "stopImmediatePropagation", value: function() {
            this.originalEvent.stopImmediatePropagation();
          } }]), t3;
        })();
        function Ge(t3) {
          return w.object(t3) ? { capture: !!t3.capture, passive: !!t3.passive } : { capture: !!t3, passive: false };
        }
        function Ne2(t3, e3) {
          return t3 === e3 || ("boolean" == typeof t3 ? !!e3.capture === t3 && false == !!e3.passive : !!t3.capture == !!e3.capture && !!t3.passive == !!e3.passive);
        }
        var Ue2 = { id: "events", install: function(t3) {
          var e3, n2 = [], r3 = {}, i3 = [], o2 = { add: a3, remove: s3, addDelegate: function(t4, e4, n3, o3, s4) {
            var u2 = Ge(s4);
            if (!r3[n3]) {
              r3[n3] = [];
              for (var p2 = 0; p2 < i3.length; p2++) {
                var f2 = i3[p2];
                a3(f2, n3, c3), a3(f2, n3, l2, true);
              }
            }
            var d3 = r3[n3], h3 = bt(d3, (function(n4) {
              return n4.selector === t4 && n4.context === e4;
            }));
            h3 || (h3 = { selector: t4, context: e4, listeners: [] }, d3.push(h3));
            h3.listeners.push({ func: o3, options: u2 });
          }, removeDelegate: function(t4, e4, n3, i4, o3) {
            var a4, u2 = Ge(o3), p2 = r3[n3], f2 = false;
            if (!p2) return;
            for (a4 = p2.length - 1; a4 >= 0; a4--) {
              var d3 = p2[a4];
              if (d3.selector === t4 && d3.context === e4) {
                for (var h3 = d3.listeners, v3 = h3.length - 1; v3 >= 0; v3--) {
                  var g3 = h3[v3];
                  if (g3.func === i4 && Ne2(g3.options, u2)) {
                    h3.splice(v3, 1), h3.length || (p2.splice(a4, 1), s3(e4, n3, c3), s3(e4, n3, l2, true)), f2 = true;
                    break;
                  }
                }
                if (f2) break;
              }
            }
          }, delegateListener: c3, delegateUseCapture: l2, delegatedEvents: r3, documents: i3, targets: n2, supportsOptions: false, supportsPassive: false };
          function a3(t4, e4, r4, i4) {
            if (t4.addEventListener) {
              var a4 = Ge(i4), s4 = bt(n2, (function(e5) {
                return e5.eventTarget === t4;
              }));
              s4 || (s4 = { eventTarget: t4, events: {} }, n2.push(s4)), s4.events[e4] || (s4.events[e4] = []), bt(s4.events[e4], (function(t5) {
                return t5.func === r4 && Ne2(t5.options, a4);
              })) || (t4.addEventListener(e4, r4, o2.supportsOptions ? a4 : a4.capture), s4.events[e4].push({ func: r4, options: a4 }));
            }
          }
          function s3(t4, e4, r4, i4) {
            if (t4.addEventListener && t4.removeEventListener) {
              var a4 = yt(n2, (function(e5) {
                return e5.eventTarget === t4;
              })), c4 = n2[a4];
              if (c4 && c4.events) if ("all" !== e4) {
                var l3 = false, u2 = c4.events[e4];
                if (u2) {
                  if ("all" === r4) {
                    for (var p2 = u2.length - 1; p2 >= 0; p2--) {
                      var f2 = u2[p2];
                      s3(t4, e4, f2.func, f2.options);
                    }
                    return;
                  }
                  for (var d3 = Ge(i4), h3 = 0; h3 < u2.length; h3++) {
                    var v3 = u2[h3];
                    if (v3.func === r4 && Ne2(v3.options, d3)) {
                      t4.removeEventListener(e4, r4, o2.supportsOptions ? d3 : d3.capture), u2.splice(h3, 1), 0 === u2.length && (delete c4.events[e4], l3 = true);
                      break;
                    }
                  }
                }
                l3 && !Object.keys(c4.events).length && n2.splice(a4, 1);
              } else for (e4 in c4.events) c4.events.hasOwnProperty(e4) && s3(t4, e4, "all");
            }
          }
          function c3(t4, e4) {
            for (var n3 = Ge(e4), i4 = new We2(t4), o3 = r3[t4.type], a4 = ht(t4)[0], s4 = a4; w.element(s4); ) {
              for (var c4 = 0; c4 < o3.length; c4++) {
                var l3 = o3[c4], u2 = l3.selector, p2 = l3.context;
                if (R2(s4, u2) && M(p2, a4) && M(p2, s4)) {
                  var f2 = l3.listeners;
                  i4.currentTarget = s4;
                  for (var d3 = 0; d3 < f2.length; d3++) {
                    var h3 = f2[d3];
                    Ne2(h3.options, n3) && h3.func(i4);
                  }
                }
              }
              s4 = A2(s4);
            }
          }
          function l2(t4) {
            return c3(t4, true);
          }
          return null == (e3 = t3.document) || e3.createElement("div").addEventListener("test", null, { get capture() {
            return o2.supportsOptions = true;
          }, get passive() {
            return o2.supportsPassive = true;
          } }), t3.events = o2, o2;
        } }, He2 = { methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"], search: function(t3) {
          for (var e3 = 0, n2 = He2.methodOrder; e3 < n2.length; e3++) {
            var r3 = n2[e3], i3 = He2[r3](t3);
            if (i3) return i3;
          }
          return null;
        }, simulationResume: function(t3) {
          var e3 = t3.pointerType, n2 = t3.eventType, r3 = t3.eventTarget, i3 = t3.scope;
          if (!/down|start/i.test(n2)) return null;
          for (var o2 = 0, a3 = i3.interactions.list; o2 < a3.length; o2++) {
            var s3 = a3[o2], c3 = r3;
            if (s3.simulation && s3.simulation.allowResume && s3.pointerType === e3) for (; c3; ) {
              if (c3 === s3.element) return s3;
              c3 = A2(c3);
            }
          }
          return null;
        }, mouseOrPen: function(t3) {
          var e3, n2 = t3.pointerId, r3 = t3.pointerType, i3 = t3.eventType, o2 = t3.scope;
          if ("mouse" !== r3 && "pen" !== r3) return null;
          for (var a3 = 0, s3 = o2.interactions.list; a3 < s3.length; a3++) {
            var c3 = s3[a3];
            if (c3.pointerType === r3) {
              if (c3.simulation && !Ke(c3, n2)) continue;
              if (c3.interacting()) return c3;
              e3 || (e3 = c3);
            }
          }
          if (e3) return e3;
          for (var l2 = 0, u2 = o2.interactions.list; l2 < u2.length; l2++) {
            var p2 = u2[l2];
            if (!(p2.pointerType !== r3 || /down/i.test(i3) && p2.simulation)) return p2;
          }
          return null;
        }, hasPointer: function(t3) {
          for (var e3 = t3.pointerId, n2 = 0, r3 = t3.scope.interactions.list; n2 < r3.length; n2++) {
            var i3 = r3[n2];
            if (Ke(i3, e3)) return i3;
          }
          return null;
        }, idle: function(t3) {
          for (var e3 = t3.pointerType, n2 = 0, r3 = t3.scope.interactions.list; n2 < r3.length; n2++) {
            var i3 = r3[n2];
            if (1 === i3.pointers.length) {
              var o2 = i3.interactable;
              if (o2 && (!o2.options.gesture || !o2.options.gesture.enabled)) continue;
            } else if (i3.pointers.length >= 2) continue;
            if (!i3.interacting() && e3 === i3.pointerType) return i3;
          }
          return null;
        } };
        function Ke(t3, e3) {
          return t3.pointers.some((function(t4) {
            return t4.id === e3;
          }));
        }
        var $e = He2, Je2 = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
        function Qe(t3, e3) {
          return function(n2) {
            var r3 = e3.interactions.list, i3 = dt2(n2), o2 = ht(n2), a3 = o2[0], s3 = o2[1], c3 = [];
            if (/^touch/.test(n2.type)) {
              e3.prevTouchTime = e3.now();
              for (var l2 = 0, u2 = n2.changedTouches; l2 < u2.length; l2++) {
                var p2 = u2[l2], f2 = { pointer: p2, pointerId: at(p2), pointerType: i3, eventType: n2.type, eventTarget: a3, curEventTarget: s3, scope: e3 }, d3 = Ze(f2);
                c3.push([f2.pointer, f2.eventTarget, f2.curEventTarget, d3]);
              }
            } else {
              var h3 = false;
              if (!I.supportsPointerEvent && /mouse/.test(n2.type)) {
                for (var v3 = 0; v3 < r3.length && !h3; v3++) h3 = "mouse" !== r3[v3].pointerType && r3[v3].pointerIsDown;
                h3 = h3 || e3.now() - e3.prevTouchTime < 500 || 0 === n2.timeStamp;
              }
              if (!h3) {
                var g3 = { pointer: n2, pointerId: at(n2), pointerType: i3, eventType: n2.type, curEventTarget: s3, eventTarget: a3, scope: e3 }, m2 = Ze(g3);
                c3.push([g3.pointer, g3.eventTarget, g3.curEventTarget, m2]);
              }
            }
            for (var y3 = 0; y3 < c3.length; y3++) {
              var b3 = c3[y3], x3 = b3[0], w2 = b3[1], E3 = b3[2];
              b3[3][t3](x3, n2, w2, E3);
            }
          };
        }
        function Ze(t3) {
          var e3 = t3.pointerType, n2 = t3.scope, r3 = { interaction: $e.search(t3), searchDetails: t3 };
          return n2.fire("interactions:find", r3), r3.interaction || n2.interactions.new({ pointerType: e3 });
        }
        function tn(t3, e3) {
          var n2 = t3.doc, r3 = t3.scope, i3 = t3.options, o2 = r3.interactions.docEvents, a3 = r3.events, s3 = a3[e3];
          for (var c3 in r3.browser.isIOS && !i3.events && (i3.events = { passive: false }), a3.delegatedEvents) s3(n2, c3, a3.delegateListener), s3(n2, c3, a3.delegateUseCapture, true);
          for (var l2 = i3 && i3.events, u2 = 0; u2 < o2.length; u2++) {
            var p2 = o2[u2];
            s3(n2, p2.type, p2.listener, l2);
          }
        }
        var en = { id: "core/interactions", install: function(t3) {
          for (var e3 = {}, n2 = 0; n2 < Je2.length; n2++) {
            var i3 = Je2[n2];
            e3[i3] = Qe(i3, t3);
          }
          var a3, c3 = I.pEventTypes;
          function l2() {
            for (var e4 = 0, n3 = t3.interactions.list; e4 < n3.length; e4++) {
              var r3 = n3[e4];
              if (r3.pointerIsDown && "touch" === r3.pointerType && !r3._interacting) for (var i4 = function() {
                var e5 = a4[o2];
                t3.documents.some((function(t4) {
                  return M(t4.doc, e5.downTarget);
                })) || r3.removePointer(e5.pointer, e5.event);
              }, o2 = 0, a4 = r3.pointers; o2 < a4.length; o2++) i4();
            }
          }
          (a3 = k2.PointerEvent ? [{ type: c3.down, listener: l2 }, { type: c3.down, listener: e3.pointerDown }, { type: c3.move, listener: e3.pointerMove }, { type: c3.up, listener: e3.pointerUp }, { type: c3.cancel, listener: e3.pointerUp }] : [{ type: "mousedown", listener: e3.pointerDown }, { type: "mousemove", listener: e3.pointerMove }, { type: "mouseup", listener: e3.pointerUp }, { type: "touchstart", listener: l2 }, { type: "touchstart", listener: e3.pointerDown }, { type: "touchmove", listener: e3.pointerMove }, { type: "touchend", listener: e3.pointerUp }, { type: "touchcancel", listener: e3.pointerUp }]).push({ type: "blur", listener: function(e4) {
            for (var n3 = 0, r3 = t3.interactions.list; n3 < r3.length; n3++) {
              r3[n3].documentBlur(e4);
            }
          } }), t3.prevTouchTime = 0, t3.Interaction = (function(e4) {
            s2(i4, e4);
            var n3 = p(i4);
            function i4() {
              return r2(this, i4), n3.apply(this, arguments);
            }
            return o(i4, [{ key: "pointerMoveTolerance", get: function() {
              return t3.interactions.pointerMoveTolerance;
            }, set: function(e5) {
              t3.interactions.pointerMoveTolerance = e5;
            } }, { key: "_now", value: function() {
              return t3.now();
            } }]), i4;
          })(De2), t3.interactions = { list: [], new: function(e4) {
            e4.scopeFire = function(e5, n4) {
              return t3.fire(e5, n4);
            };
            var n3 = new t3.Interaction(e4);
            return t3.interactions.list.push(n3), n3;
          }, listeners: e3, docEvents: a3, pointerMoveTolerance: 1 }, t3.usePlugin(he);
        }, listeners: { "scope:add-document": function(t3) {
          return tn(t3, "add");
        }, "scope:remove-document": function(t3) {
          return tn(t3, "remove");
        }, "interactable:unset": function(t3, e3) {
          for (var n2 = t3.interactable, r3 = e3.interactions.list.length - 1; r3 >= 0; r3--) {
            var i3 = e3.interactions.list[r3];
            i3.interactable === n2 && (i3.stop(), e3.fire("interactions:destroy", { interaction: i3 }), i3.destroy(), e3.interactions.list.length > 2 && e3.interactions.list.splice(r3, 1));
          }
        } }, onDocSignal: tn, doOnInteractions: Qe, methodNames: Je2 }, nn = en, rn = (function(t3) {
          return t3[t3.On = 0] = "On", t3[t3.Off = 1] = "Off", t3;
        })(rn || {}), on2 = (function() {
          function t3(e3, n2, i3, o2) {
            r2(this, t3), this.target = void 0, this.options = void 0, this._actions = void 0, this.events = new Ve(), this._context = void 0, this._win = void 0, this._doc = void 0, this._scopeEvents = void 0, this._actions = n2.actions, this.target = e3, this._context = n2.context || i3, this._win = y2(B2(e3) ? this._context : e3), this._doc = this._win.document, this._scopeEvents = o2, this.set(n2);
          }
          return o(t3, [{ key: "_defaults", get: function() {
            return { base: {}, perAction: {}, actions: {} };
          } }, { key: "setOnEvents", value: function(t4, e3) {
            return w.func(e3.onstart) && this.on("".concat(t4, "start"), e3.onstart), w.func(e3.onmove) && this.on("".concat(t4, "move"), e3.onmove), w.func(e3.onend) && this.on("".concat(t4, "end"), e3.onend), w.func(e3.oninertiastart) && this.on("".concat(t4, "inertiastart"), e3.oninertiastart), this;
          } }, { key: "updatePerActionListeners", value: function(t4, e3, n2) {
            var r3, i3 = this, o2 = null == (r3 = this._actions.map[t4]) ? void 0 : r3.filterEventType, a3 = function(t5) {
              return (null == o2 || o2(t5)) && ve(t5, i3._actions);
            };
            (w.array(e3) || w.object(e3)) && this._onOff(rn.Off, t4, e3, void 0, a3), (w.array(n2) || w.object(n2)) && this._onOff(rn.On, t4, n2, void 0, a3);
          } }, { key: "setPerAction", value: function(t4, e3) {
            var n2 = this._defaults;
            for (var r3 in e3) {
              var i3 = r3, o2 = this.options[t4], a3 = e3[i3];
              "listeners" === i3 && this.updatePerActionListeners(t4, o2.listeners, a3), w.array(a3) ? o2[i3] = mt(a3) : w.plainObject(a3) ? (o2[i3] = V2(o2[i3] || {}, ge2(a3)), w.object(n2.perAction[i3]) && "enabled" in n2.perAction[i3] && (o2[i3].enabled = false !== a3.enabled)) : w.bool(a3) && w.object(n2.perAction[i3]) ? o2[i3].enabled = a3 : o2[i3] = a3;
            }
          } }, { key: "getRect", value: function(t4) {
            return t4 = t4 || (w.element(this.target) ? this.target : null), w.string(this.target) && (t4 = t4 || this._context.querySelector(this.target)), L2(t4);
          } }, { key: "rectChecker", value: function(t4) {
            var e3 = this;
            return w.func(t4) ? (this.getRect = function(n2) {
              var r3 = V2({}, t4.apply(e3, n2));
              return "width" in r3 || (r3.width = r3.right - r3.left, r3.height = r3.bottom - r3.top), r3;
            }, this) : null === t4 ? (delete this.getRect, this) : this.getRect;
          } }, { key: "_backCompatOption", value: function(t4, e3) {
            if (B2(e3) || w.object(e3)) {
              for (var n2 in this.options[t4] = e3, this._actions.map) this.options[n2][t4] = e3;
              return this;
            }
            return this.options[t4];
          } }, { key: "origin", value: function(t4) {
            return this._backCompatOption("origin", t4);
          } }, { key: "deltaSource", value: function(t4) {
            return "page" === t4 || "client" === t4 ? (this.options.deltaSource = t4, this) : this.options.deltaSource;
          } }, { key: "getAllElements", value: function() {
            var t4 = this.target;
            return w.string(t4) ? Array.from(this._context.querySelectorAll(t4)) : w.func(t4) && t4.getAllElements ? t4.getAllElements() : w.element(t4) ? [t4] : [];
          } }, { key: "context", value: function() {
            return this._context;
          } }, { key: "inContext", value: function(t4) {
            return this._context === t4.ownerDocument || M(this._context, t4);
          } }, { key: "testIgnoreAllow", value: function(t4, e3, n2) {
            return !this.testIgnore(t4.ignoreFrom, e3, n2) && this.testAllow(t4.allowFrom, e3, n2);
          } }, { key: "testAllow", value: function(t4, e3, n2) {
            return !t4 || !!w.element(n2) && (w.string(t4) ? F(n2, t4, e3) : !!w.element(t4) && M(t4, n2));
          } }, { key: "testIgnore", value: function(t4, e3, n2) {
            return !(!t4 || !w.element(n2)) && (w.string(t4) ? F(n2, t4, e3) : !!w.element(t4) && M(t4, n2));
          } }, { key: "fire", value: function(t4) {
            return this.events.fire(t4), this;
          } }, { key: "_onOff", value: function(t4, e3, n2, r3, i3) {
            w.object(e3) && !w.array(e3) && (r3 = n2, n2 = null);
            var o2 = $2(e3, n2, i3);
            for (var a3 in o2) {
              "wheel" === a3 && (a3 = I.wheelEvent);
              for (var s3 = 0, c3 = o2[a3]; s3 < c3.length; s3++) {
                var l2 = c3[s3];
                ve(a3, this._actions) ? this.events[t4 === rn.On ? "on" : "off"](a3, l2) : w.string(this.target) ? this._scopeEvents[t4 === rn.On ? "addDelegate" : "removeDelegate"](this.target, this._context, a3, l2, r3) : this._scopeEvents[t4 === rn.On ? "add" : "remove"](this.target, a3, l2, r3);
              }
            }
            return this;
          } }, { key: "on", value: function(t4, e3, n2) {
            return this._onOff(rn.On, t4, e3, n2);
          } }, { key: "off", value: function(t4, e3, n2) {
            return this._onOff(rn.Off, t4, e3, n2);
          } }, { key: "set", value: function(t4) {
            var e3 = this._defaults;
            for (var n2 in w.object(t4) || (t4 = {}), this.options = ge2(e3.base), this._actions.methodDict) {
              var r3 = n2, i3 = this._actions.methodDict[r3];
              this.options[r3] = {}, this.setPerAction(r3, V2(V2({}, e3.perAction), e3.actions[r3])), this[i3](t4[r3]);
            }
            for (var o2 in t4) "getRect" !== o2 ? w.func(this[o2]) && this[o2](t4[o2]) : this.rectChecker(t4.getRect);
            return this;
          } }, { key: "unset", value: function() {
            if (w.string(this.target)) for (var t4 in this._scopeEvents.delegatedEvents) for (var e3 = this._scopeEvents.delegatedEvents[t4], n2 = e3.length - 1; n2 >= 0; n2--) {
              var r3 = e3[n2], i3 = r3.selector, o2 = r3.context, a3 = r3.listeners;
              i3 === this.target && o2 === this._context && e3.splice(n2, 1);
              for (var s3 = a3.length - 1; s3 >= 0; s3--) this._scopeEvents.removeDelegate(this.target, this._context, t4, a3[s3][0], a3[s3][1]);
            }
            else this._scopeEvents.remove(this.target, "all");
          } }]), t3;
        })(), an2 = (function() {
          function t3(e3) {
            var n2 = this;
            r2(this, t3), this.list = [], this.selectorMap = {}, this.scope = void 0, this.scope = e3, e3.addListeners({ "interactable:unset": function(t4) {
              var e4 = t4.interactable, r3 = e4.target, i3 = w.string(r3) ? n2.selectorMap[r3] : r3[n2.scope.id], o2 = yt(i3, (function(t5) {
                return t5 === e4;
              }));
              i3.splice(o2, 1);
            } });
          }
          return o(t3, [{ key: "new", value: function(t4, e3) {
            e3 = V2(e3 || {}, { actions: this.scope.actions });
            var n2 = new this.scope.Interactable(t4, e3, this.scope.document, this.scope.events);
            return this.scope.addDocument(n2._doc), this.list.push(n2), w.string(t4) ? (this.selectorMap[t4] || (this.selectorMap[t4] = []), this.selectorMap[t4].push(n2)) : (n2.target[this.scope.id] || Object.defineProperty(t4, this.scope.id, { value: [], configurable: true }), t4[this.scope.id].push(n2)), this.scope.fire("interactable:new", { target: t4, options: e3, interactable: n2, win: this.scope._win }), n2;
          } }, { key: "getExisting", value: function(t4, e3) {
            var n2 = e3 && e3.context || this.scope.document, r3 = w.string(t4), i3 = r3 ? this.selectorMap[t4] : t4[this.scope.id];
            if (i3) return bt(i3, (function(e4) {
              return e4._context === n2 && (r3 || e4.inContext(t4));
            }));
          } }, { key: "forEachMatch", value: function(t4, e3) {
            for (var n2 = 0, r3 = this.list; n2 < r3.length; n2++) {
              var i3 = r3[n2], o2 = void 0;
              if ((w.string(i3.target) ? w.element(t4) && R2(t4, i3.target) : t4 === i3.target) && i3.inContext(t4) && (o2 = e3(i3)), void 0 !== o2) return o2;
            }
          } }]), t3;
        })();
        var sn2 = (function() {
          function t3() {
            var e3 = this;
            r2(this, t3), this.id = "__interact_scope_".concat(Math.floor(100 * Math.random())), this.isInitialized = false, this.listenerMaps = [], this.browser = I, this.defaults = ge2(Te), this.Eventable = Ve, this.actions = { map: {}, phases: { start: true, move: true, end: true }, methodDict: {}, phaselessTypes: {} }, this.interactStatic = (function(t4) {
              var e4 = function e5(n3, r3) {
                var i3 = t4.interactables.getExisting(n3, r3);
                return i3 || ((i3 = t4.interactables.new(n3, r3)).events.global = e5.globalEvents), i3;
              };
              return e4.getPointerAverage = lt, e4.getTouchBBox = ut, e4.getTouchDistance = pt2, e4.getTouchAngle = ft, e4.getElementRect = L2, e4.getElementClientRect = Y2, e4.matchesSelector = R2, e4.closest = z, e4.globalEvents = {}, e4.version = "1.10.27", e4.scope = t4, e4.use = function(t5, e5) {
                return this.scope.usePlugin(t5, e5), this;
              }, e4.isSet = function(t5, e5) {
                return !!this.scope.interactables.get(t5, e5 && e5.context);
              }, e4.on = Nt((function(t5, e5, n3) {
                if (w.string(t5) && -1 !== t5.search(" ") && (t5 = t5.trim().split(/ +/)), w.array(t5)) {
                  for (var r3 = 0, i3 = t5; r3 < i3.length; r3++) {
                    var o2 = i3[r3];
                    this.on(o2, e5, n3);
                  }
                  return this;
                }
                if (w.object(t5)) {
                  for (var a3 in t5) this.on(a3, t5[a3], e5);
                  return this;
                }
                return ve(t5, this.scope.actions) ? this.globalEvents[t5] ? this.globalEvents[t5].push(e5) : this.globalEvents[t5] = [e5] : this.scope.events.add(this.scope.document, t5, e5, { options: n3 }), this;
              }), "The interact.on() method is being deprecated"), e4.off = Nt((function(t5, e5, n3) {
                if (w.string(t5) && -1 !== t5.search(" ") && (t5 = t5.trim().split(/ +/)), w.array(t5)) {
                  for (var r3 = 0, i3 = t5; r3 < i3.length; r3++) {
                    var o2 = i3[r3];
                    this.off(o2, e5, n3);
                  }
                  return this;
                }
                if (w.object(t5)) {
                  for (var a3 in t5) this.off(a3, t5[a3], e5);
                  return this;
                }
                var s3;
                return ve(t5, this.scope.actions) ? t5 in this.globalEvents && -1 !== (s3 = this.globalEvents[t5].indexOf(e5)) && this.globalEvents[t5].splice(s3, 1) : this.scope.events.remove(this.scope.document, t5, e5, n3), this;
              }), "The interact.off() method is being deprecated"), e4.debug = function() {
                return this.scope;
              }, e4.supportsTouch = function() {
                return I.supportsTouch;
              }, e4.supportsPointerEvent = function() {
                return I.supportsPointerEvent;
              }, e4.stop = function() {
                for (var t5 = 0, e5 = this.scope.interactions.list; t5 < e5.length; t5++) e5[t5].stop();
                return this;
              }, e4.pointerMoveTolerance = function(t5) {
                return w.number(t5) ? (this.scope.interactions.pointerMoveTolerance = t5, this) : this.scope.interactions.pointerMoveTolerance;
              }, e4.addDocument = function(t5, e5) {
                this.scope.addDocument(t5, e5);
              }, e4.removeDocument = function(t5) {
                this.scope.removeDocument(t5);
              }, e4;
            })(this), this.InteractEvent = Se, this.Interactable = void 0, this.interactables = new an2(this), this._win = void 0, this.document = void 0, this.window = void 0, this.documents = [], this._plugins = { list: [], map: {} }, this.onWindowUnload = function(t4) {
              return e3.removeDocument(t4.target);
            };
            var n2 = this;
            this.Interactable = (function(t4) {
              s2(i3, t4);
              var e4 = p(i3);
              function i3() {
                return r2(this, i3), e4.apply(this, arguments);
              }
              return o(i3, [{ key: "_defaults", get: function() {
                return n2.defaults;
              } }, { key: "set", value: function(t5) {
                return f(c2(i3.prototype), "set", this).call(this, t5), n2.fire("interactable:set", { options: t5, interactable: this }), this;
              } }, { key: "unset", value: function() {
                f(c2(i3.prototype), "unset", this).call(this);
                var t5 = n2.interactables.list.indexOf(this);
                t5 < 0 || (n2.interactables.list.splice(t5, 1), n2.fire("interactable:unset", { interactable: this }));
              } }]), i3;
            })(on2);
          }
          return o(t3, [{ key: "addListeners", value: function(t4, e3) {
            this.listenerMaps.push({ id: e3, map: t4 });
          } }, { key: "fire", value: function(t4, e3) {
            for (var n2 = 0, r3 = this.listenerMaps; n2 < r3.length; n2++) {
              var i3 = r3[n2].map[t4];
              if (i3 && false === i3(e3, this, t4)) return false;
            }
          } }, { key: "init", value: function(t4) {
            return this.isInitialized ? this : (function(t5, e3) {
              t5.isInitialized = true, w.window(e3) && m(e3);
              return k2.init(e3), I.init(e3), Lt2.init(e3), t5.window = e3, t5.document = e3.document, t5.usePlugin(nn), t5.usePlugin(Ue2), t5;
            })(this, t4);
          } }, { key: "pluginIsInstalled", value: function(t4) {
            var e3 = t4.id;
            return e3 ? !!this._plugins.map[e3] : -1 !== this._plugins.list.indexOf(t4);
          } }, { key: "usePlugin", value: function(t4, e3) {
            if (!this.isInitialized) return this;
            if (this.pluginIsInstalled(t4)) return this;
            if (t4.id && (this._plugins.map[t4.id] = t4), this._plugins.list.push(t4), t4.install && t4.install(this, e3), t4.listeners && t4.before) {
              for (var n2 = 0, r3 = this.listenerMaps.length, i3 = t4.before.reduce((function(t5, e4) {
                return t5[e4] = true, t5[cn2(e4)] = true, t5;
              }), {}); n2 < r3; n2++) {
                var o2 = this.listenerMaps[n2].id;
                if (o2 && (i3[o2] || i3[cn2(o2)])) break;
              }
              this.listenerMaps.splice(n2, 0, { id: t4.id, map: t4.listeners });
            } else t4.listeners && this.listenerMaps.push({ id: t4.id, map: t4.listeners });
            return this;
          } }, { key: "addDocument", value: function(t4, e3) {
            if (-1 !== this.getDocIndex(t4)) return false;
            var n2 = y2(t4);
            e3 = e3 ? V2({}, e3) : {}, this.documents.push({ doc: t4, options: e3 }), this.events.documents.push(t4), t4 !== this.document && this.events.add(n2, "unload", this.onWindowUnload), this.fire("scope:add-document", { doc: t4, window: n2, scope: this, options: e3 });
          } }, { key: "removeDocument", value: function(t4) {
            var e3 = this.getDocIndex(t4), n2 = y2(t4), r3 = this.documents[e3].options;
            this.events.remove(n2, "unload", this.onWindowUnload), this.documents.splice(e3, 1), this.events.documents.splice(e3, 1), this.fire("scope:remove-document", { doc: t4, window: n2, scope: this, options: r3 });
          } }, { key: "getDocIndex", value: function(t4) {
            for (var e3 = 0; e3 < this.documents.length; e3++) if (this.documents[e3].doc === t4) return e3;
            return -1;
          } }, { key: "getDocOptions", value: function(t4) {
            var e3 = this.getDocIndex(t4);
            return -1 === e3 ? null : this.documents[e3].options;
          } }, { key: "now", value: function() {
            return (this.window.Date || Date).now();
          } }]), t3;
        })();
        function cn2(t3) {
          return t3 && t3.replace(/\/.*$/, "");
        }
        var ln2 = new sn2(), un2 = ln2.interactStatic, pn = "undefined" != typeof globalThis ? globalThis : window;
        ln2.init(pn);
        var fn2 = Object.freeze({ __proto__: null, edgeTarget: function() {
        }, elements: function() {
        }, grid: function(t3) {
          var e3 = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter((function(e4) {
            var n3 = e4[0], r3 = e4[1];
            return n3 in t3 || r3 in t3;
          })), n2 = function(n3, r3) {
            for (var i3 = t3.range, o2 = t3.limits, a3 = void 0 === o2 ? { left: -1 / 0, right: 1 / 0, top: -1 / 0, bottom: 1 / 0 } : o2, s3 = t3.offset, c3 = void 0 === s3 ? { x: 0, y: 0 } : s3, l2 = { range: i3, grid: t3, x: null, y: null }, u2 = 0; u2 < e3.length; u2++) {
              var p2 = e3[u2], f2 = p2[0], d3 = p2[1], h3 = Math.round((n3 - c3.x) / t3[f2]), v3 = Math.round((r3 - c3.y) / t3[d3]);
              l2[f2] = Math.max(a3.left, Math.min(a3.right, h3 * t3[f2] + c3.x)), l2[d3] = Math.max(a3.top, Math.min(a3.bottom, v3 * t3[d3] + c3.y));
            }
            return l2;
          };
          return n2.grid = t3, n2.coordFields = e3, n2;
        } }), dn2 = { id: "snappers", install: function(t3) {
          var e3 = t3.interactStatic;
          e3.snappers = V2(e3.snappers || {}, fn2), e3.createSnapGrid = e3.snappers.grid;
        } }, hn2 = dn2, vn = { start: function(t3) {
          var n2 = t3.state, r3 = t3.rect, i3 = t3.edges, o2 = t3.pageCoords, a3 = n2.options, s3 = a3.ratio, c3 = a3.enabled, l2 = n2.options, u2 = l2.equalDelta, p2 = l2.modifiers;
          "preserve" === s3 && (s3 = r3.width / r3.height), n2.startCoords = V2({}, o2), n2.startRect = V2({}, r3), n2.ratio = s3, n2.equalDelta = u2;
          var f2 = n2.linkedEdges = { top: i3.top || i3.left && !i3.bottom, left: i3.left || i3.top && !i3.right, bottom: i3.bottom || i3.right && !i3.top, right: i3.right || i3.bottom && !i3.left };
          if (n2.xIsPrimaryAxis = !(!i3.left && !i3.right), n2.equalDelta) {
            var d3 = (f2.left ? 1 : -1) * (f2.top ? 1 : -1);
            n2.edgeSign = { x: d3, y: d3 };
          } else n2.edgeSign = { x: f2.left ? -1 : 1, y: f2.top ? -1 : 1 };
          if (false !== c3 && V2(i3, f2), null != p2 && p2.length) {
            var h3 = new me(t3.interaction);
            h3.copyFrom(t3.interaction.modification), h3.prepareStates(p2), n2.subModification = h3, h3.startAll(e2({}, t3));
          }
        }, set: function(t3) {
          var n2 = t3.state, r3 = t3.rect, i3 = t3.coords, o2 = n2.linkedEdges, a3 = V2({}, i3), s3 = n2.equalDelta ? gn : mn;
          if (V2(t3.edges, o2), s3(n2, n2.xIsPrimaryAxis, i3, r3), !n2.subModification) return null;
          var c3 = V2({}, r3);
          H(o2, c3, { x: i3.x - a3.x, y: i3.y - a3.y });
          var l2 = n2.subModification.setAll(e2(e2({}, t3), {}, { rect: c3, edges: o2, pageCoords: i3, prevCoords: i3, prevRect: c3 })), u2 = l2.delta;
          l2.changed && (s3(n2, Math.abs(u2.x) > Math.abs(u2.y), l2.coords, l2.rect), V2(i3, l2.coords));
          return l2.eventProps;
        }, defaults: { ratio: "preserve", equalDelta: false, modifiers: [], enabled: false } };
        function gn(t3, e3, n2) {
          var r3 = t3.startCoords, i3 = t3.edgeSign;
          e3 ? n2.y = r3.y + (n2.x - r3.x) * i3.y : n2.x = r3.x + (n2.y - r3.y) * i3.x;
        }
        function mn(t3, e3, n2, r3) {
          var i3 = t3.startRect, o2 = t3.startCoords, a3 = t3.ratio, s3 = t3.edgeSign;
          if (e3) {
            var c3 = r3.width / a3;
            n2.y = o2.y + (c3 - i3.height) * s3.y;
          } else {
            var l2 = r3.height * a3;
            n2.x = o2.x + (l2 - i3.width) * s3.x;
          }
        }
        var yn = be(vn, "aspectRatio"), bn = function() {
        };
        bn._defaults = {};
        var xn2 = bn;
        function wn(t3, e3, n2) {
          return w.func(t3) ? G2(t3, e3.interactable, e3.element, [n2.x, n2.y, e3]) : G2(t3, e3.interactable, e3.element);
        }
        var En = { start: function(t3) {
          var e3 = t3.rect, n2 = t3.startOffset, r3 = t3.state, i3 = t3.interaction, o2 = t3.pageCoords, a3 = r3.options, s3 = a3.elementRect, c3 = V2({ left: 0, top: 0, right: 0, bottom: 0 }, a3.offset || {});
          if (e3 && s3) {
            var l2 = wn(a3.restriction, i3, o2);
            if (l2) {
              var u2 = l2.right - l2.left - e3.width, p2 = l2.bottom - l2.top - e3.height;
              u2 < 0 && (c3.left += u2, c3.right += u2), p2 < 0 && (c3.top += p2, c3.bottom += p2);
            }
            c3.left += n2.left - e3.width * s3.left, c3.top += n2.top - e3.height * s3.top, c3.right += n2.right - e3.width * (1 - s3.right), c3.bottom += n2.bottom - e3.height * (1 - s3.bottom);
          }
          r3.offset = c3;
        }, set: function(t3) {
          var e3 = t3.coords, n2 = t3.interaction, r3 = t3.state, i3 = r3.options, o2 = r3.offset, a3 = wn(i3.restriction, n2, e3);
          if (a3) {
            var s3 = (function(t4) {
              return !t4 || "left" in t4 && "top" in t4 || ((t4 = V2({}, t4)).left = t4.x || 0, t4.top = t4.y || 0, t4.right = t4.right || t4.left + t4.width, t4.bottom = t4.bottom || t4.top + t4.height), t4;
            })(a3);
            e3.x = Math.max(Math.min(s3.right - o2.right, e3.x), s3.left + o2.left), e3.y = Math.max(Math.min(s3.bottom - o2.bottom, e3.y), s3.top + o2.top);
          }
        }, defaults: { restriction: null, elementRect: null, offset: null, endOnly: false, enabled: false } }, Tn2 = be(En, "restrict"), Sn2 = { top: 1 / 0, left: 1 / 0, bottom: -1 / 0, right: -1 / 0 }, _n = { top: -1 / 0, left: -1 / 0, bottom: 1 / 0, right: 1 / 0 };
        function Pn(t3, e3) {
          for (var n2 = 0, r3 = ["top", "left", "bottom", "right"]; n2 < r3.length; n2++) {
            var i3 = r3[n2];
            i3 in t3 || (t3[i3] = e3[i3]);
          }
          return t3;
        }
        var On2 = { noInner: Sn2, noOuter: _n, start: function(t3) {
          var e3, n2 = t3.interaction, r3 = t3.startOffset, i3 = t3.state, o2 = i3.options;
          o2 && (e3 = N(wn(o2.offset, n2, n2.coords.start.page))), e3 = e3 || { x: 0, y: 0 }, i3.offset = { top: e3.y + r3.top, left: e3.x + r3.left, bottom: e3.y - r3.bottom, right: e3.x - r3.right };
        }, set: function(t3) {
          var e3 = t3.coords, n2 = t3.edges, r3 = t3.interaction, i3 = t3.state, o2 = i3.offset, a3 = i3.options;
          if (n2) {
            var s3 = V2({}, e3), c3 = wn(a3.inner, r3, s3) || {}, l2 = wn(a3.outer, r3, s3) || {};
            Pn(c3, Sn2), Pn(l2, _n), n2.top ? e3.y = Math.min(Math.max(l2.top + o2.top, s3.y), c3.top + o2.top) : n2.bottom && (e3.y = Math.max(Math.min(l2.bottom + o2.bottom, s3.y), c3.bottom + o2.bottom)), n2.left ? e3.x = Math.min(Math.max(l2.left + o2.left, s3.x), c3.left + o2.left) : n2.right && (e3.x = Math.max(Math.min(l2.right + o2.right, s3.x), c3.right + o2.right));
          }
        }, defaults: { inner: null, outer: null, offset: null, endOnly: false, enabled: false } }, kn = be(On2, "restrictEdges"), Dn = V2({ get elementRect() {
          return { top: 0, left: 0, bottom: 1, right: 1 };
        }, set elementRect(t3) {
        } }, En.defaults), In = be({ start: En.start, set: En.set, defaults: Dn }, "restrictRect"), Mn = { width: -1 / 0, height: -1 / 0 }, zn2 = { width: 1 / 0, height: 1 / 0 };
        var An = be({ start: function(t3) {
          return On2.start(t3);
        }, set: function(t3) {
          var e3 = t3.interaction, n2 = t3.state, r3 = t3.rect, i3 = t3.edges, o2 = n2.options;
          if (i3) {
            var a3 = U(wn(o2.min, e3, t3.coords)) || Mn, s3 = U(wn(o2.max, e3, t3.coords)) || zn2;
            n2.options = { endOnly: o2.endOnly, inner: V2({}, On2.noInner), outer: V2({}, On2.noOuter) }, i3.top ? (n2.options.inner.top = r3.bottom - a3.height, n2.options.outer.top = r3.bottom - s3.height) : i3.bottom && (n2.options.inner.bottom = r3.top + a3.height, n2.options.outer.bottom = r3.top + s3.height), i3.left ? (n2.options.inner.left = r3.right - a3.width, n2.options.outer.left = r3.right - s3.width) : i3.right && (n2.options.inner.right = r3.left + a3.width, n2.options.outer.right = r3.left + s3.width), On2.set(t3), n2.options = o2;
          }
        }, defaults: { min: null, max: null, endOnly: false, enabled: false } }, "restrictSize");
        var Rn = { start: function(t3) {
          var e3, n2 = t3.interaction, r3 = t3.interactable, i3 = t3.element, o2 = t3.rect, a3 = t3.state, s3 = t3.startOffset, c3 = a3.options, l2 = c3.offsetWithOrigin ? (function(t4) {
            var e4 = t4.interaction.element, n3 = N(G2(t4.state.options.origin, null, null, [e4])), r4 = n3 || K2(t4.interactable, e4, t4.interaction.prepared.name);
            return r4;
          })(t3) : { x: 0, y: 0 };
          if ("startCoords" === c3.offset) e3 = { x: n2.coords.start.page.x, y: n2.coords.start.page.y };
          else {
            var u2 = G2(c3.offset, r3, i3, [n2]);
            (e3 = N(u2) || { x: 0, y: 0 }).x += l2.x, e3.y += l2.y;
          }
          var p2 = c3.relativePoints;
          a3.offsets = o2 && p2 && p2.length ? p2.map((function(t4, n3) {
            return { index: n3, relativePoint: t4, x: s3.left - o2.width * t4.x + e3.x, y: s3.top - o2.height * t4.y + e3.y };
          })) : [{ index: 0, relativePoint: null, x: e3.x, y: e3.y }];
        }, set: function(t3) {
          var e3 = t3.interaction, n2 = t3.coords, r3 = t3.state, i3 = r3.options, o2 = r3.offsets, a3 = K2(e3.interactable, e3.element, e3.prepared.name), s3 = V2({}, n2), c3 = [];
          i3.offsetWithOrigin || (s3.x -= a3.x, s3.y -= a3.y);
          for (var l2 = 0, u2 = o2; l2 < u2.length; l2++) for (var p2 = u2[l2], f2 = s3.x - p2.x, d3 = s3.y - p2.y, h3 = 0, v3 = i3.targets.length; h3 < v3; h3++) {
            var g3 = i3.targets[h3], m2 = void 0;
            (m2 = w.func(g3) ? g3(f2, d3, e3._proxy, p2, h3) : g3) && c3.push({ x: (w.number(m2.x) ? m2.x : f2) + p2.x, y: (w.number(m2.y) ? m2.y : d3) + p2.y, range: w.number(m2.range) ? m2.range : i3.range, source: g3, index: h3, offset: p2 });
          }
          for (var y3 = { target: null, inRange: false, distance: 0, range: 0, delta: { x: 0, y: 0 } }, b3 = 0; b3 < c3.length; b3++) {
            var x3 = c3[b3], E3 = x3.range, T3 = x3.x - s3.x, S2 = x3.y - s3.y, _3 = Q(T3, S2), P3 = _3 <= E3;
            E3 === 1 / 0 && y3.inRange && y3.range !== 1 / 0 && (P3 = false), y3.target && !(P3 ? y3.inRange && E3 !== 1 / 0 ? _3 / E3 < y3.distance / y3.range : E3 === 1 / 0 && y3.range !== 1 / 0 || _3 < y3.distance : !y3.inRange && _3 < y3.distance) || (y3.target = x3, y3.distance = _3, y3.range = E3, y3.inRange = P3, y3.delta.x = T3, y3.delta.y = S2);
          }
          return y3.inRange && (n2.x = y3.target.x, n2.y = y3.target.y), r3.closest = y3, y3;
        }, defaults: { range: 1 / 0, targets: null, offset: null, offsetWithOrigin: true, origin: null, relativePoints: null, endOnly: false, enabled: false } }, Cn = be(Rn, "snap");
        var jn = { start: function(t3) {
          var e3 = t3.state, n2 = t3.edges, r3 = e3.options;
          if (!n2) return null;
          t3.state = { options: { targets: null, relativePoints: [{ x: n2.left ? 0 : 1, y: n2.top ? 0 : 1 }], offset: r3.offset || "self", origin: { x: 0, y: 0 }, range: r3.range } }, e3.targetFields = e3.targetFields || [["width", "height"], ["x", "y"]], Rn.start(t3), e3.offsets = t3.state.offsets, t3.state = e3;
        }, set: function(t3) {
          var e3 = t3.interaction, n2 = t3.state, r3 = t3.coords, i3 = n2.options, o2 = n2.offsets, a3 = { x: r3.x - o2[0].x, y: r3.y - o2[0].y };
          n2.options = V2({}, i3), n2.options.targets = [];
          for (var s3 = 0, c3 = i3.targets || []; s3 < c3.length; s3++) {
            var l2 = c3[s3], u2 = void 0;
            if (u2 = w.func(l2) ? l2(a3.x, a3.y, e3) : l2) {
              for (var p2 = 0, f2 = n2.targetFields; p2 < f2.length; p2++) {
                var d3 = f2[p2], h3 = d3[0], v3 = d3[1];
                if (h3 in u2 || v3 in u2) {
                  u2.x = u2[h3], u2.y = u2[v3];
                  break;
                }
              }
              n2.options.targets.push(u2);
            }
          }
          var g3 = Rn.set(t3);
          return n2.options = i3, g3;
        }, defaults: { range: 1 / 0, targets: null, offset: null, endOnly: false, enabled: false } }, Fn = be(jn, "snapSize");
        var Xn = { aspectRatio: yn, restrictEdges: kn, restrict: Tn2, restrictRect: In, restrictSize: An, snapEdges: be({ start: function(t3) {
          var e3 = t3.edges;
          return e3 ? (t3.state.targetFields = t3.state.targetFields || [[e3.left ? "left" : "right", e3.top ? "top" : "bottom"]], jn.start(t3)) : null;
        }, set: jn.set, defaults: V2(ge2(jn.defaults), { targets: void 0, range: void 0, offset: { x: 0, y: 0 } }) }, "snapEdges"), snap: Cn, snapSize: Fn, spring: xn2, avoid: xn2, transform: xn2, rubberband: xn2 }, Yn = { id: "modifiers", install: function(t3) {
          var e3 = t3.interactStatic;
          for (var n2 in t3.usePlugin(Ee), t3.usePlugin(hn2), e3.modifiers = Xn, Xn) {
            var r3 = Xn[n2], i3 = r3._defaults, o2 = r3._methods;
            i3._methods = o2, t3.defaults.perAction[n2] = i3;
          }
        } }, Ln2 = Yn, qn = (function(t3) {
          s2(n2, t3);
          var e3 = p(n2);
          function n2(t4, i3, o2, a3, s3, c3) {
            var l2;
            if (r2(this, n2), tt2(u(l2 = e3.call(this, s3)), o2), o2 !== i3 && tt2(u(l2), i3), l2.timeStamp = c3, l2.originalEvent = o2, l2.type = t4, l2.pointerId = at(i3), l2.pointerType = dt2(i3), l2.target = a3, l2.currentTarget = null, "tap" === t4) {
              var p2 = s3.getPointerIndex(i3);
              l2.dt = l2.timeStamp - s3.pointers[p2].downTime;
              var f2 = l2.timeStamp - s3.tapTime;
              l2.double = !!s3.prevTap && "doubletap" !== s3.prevTap.type && s3.prevTap.target === l2.target && f2 < 500;
            } else "doubletap" === t4 && (l2.dt = i3.timeStamp - s3.tapTime, l2.double = true);
            return l2;
          }
          return o(n2, [{ key: "_subtractOrigin", value: function(t4) {
            var e4 = t4.x, n3 = t4.y;
            return this.pageX -= e4, this.pageY -= n3, this.clientX -= e4, this.clientY -= n3, this;
          } }, { key: "_addOrigin", value: function(t4) {
            var e4 = t4.x, n3 = t4.y;
            return this.pageX += e4, this.pageY += n3, this.clientX += e4, this.clientY += n3, this;
          } }, { key: "preventDefault", value: function() {
            this.originalEvent.preventDefault();
          } }]), n2;
        })(vt2), Bn = { id: "pointer-events/base", before: ["inertia", "modifiers", "auto-start", "actions"], install: function(t3) {
          t3.pointerEvents = Bn, t3.defaults.actions.pointerEvents = Bn.defaults, V2(t3.actions.phaselessTypes, Bn.types);
        }, listeners: { "interactions:new": function(t3) {
          var e3 = t3.interaction;
          e3.prevTap = null, e3.tapTime = 0;
        }, "interactions:update-pointer": function(t3) {
          var e3 = t3.down, n2 = t3.pointerInfo;
          if (!e3 && n2.hold) return;
          n2.hold = { duration: 1 / 0, timeout: null };
        }, "interactions:move": function(t3, e3) {
          var n2 = t3.interaction, r3 = t3.pointer, i3 = t3.event, o2 = t3.eventTarget;
          t3.duplicate || n2.pointerIsDown && !n2.pointerWasMoved || (n2.pointerIsDown && Gn(t3), Vn({ interaction: n2, pointer: r3, event: i3, eventTarget: o2, type: "move" }, e3));
        }, "interactions:down": function(t3, e3) {
          !(function(t4, e4) {
            for (var n2 = t4.interaction, r3 = t4.pointer, i3 = t4.event, o2 = t4.eventTarget, a3 = t4.pointerIndex, s3 = n2.pointers[a3].hold, c3 = q(o2), l2 = { interaction: n2, pointer: r3, event: i3, eventTarget: o2, type: "hold", targets: [], path: c3, node: null }, u2 = 0; u2 < c3.length; u2++) {
              var p2 = c3[u2];
              l2.node = p2, e4.fire("pointerEvents:collect-targets", l2);
            }
            if (!l2.targets.length) return;
            for (var f2 = 1 / 0, d3 = 0, h3 = l2.targets; d3 < h3.length; d3++) {
              var v3 = h3[d3].eventable.options.holdDuration;
              v3 < f2 && (f2 = v3);
            }
            s3.duration = f2, s3.timeout = setTimeout((function() {
              Vn({ interaction: n2, eventTarget: o2, pointer: r3, event: i3, type: "hold" }, e4);
            }), f2);
          })(t3, e3), Vn(t3, e3);
        }, "interactions:up": function(t3, e3) {
          Gn(t3), Vn(t3, e3), (function(t4, e4) {
            var n2 = t4.interaction, r3 = t4.pointer, i3 = t4.event, o2 = t4.eventTarget;
            n2.pointerWasMoved || Vn({ interaction: n2, eventTarget: o2, pointer: r3, event: i3, type: "tap" }, e4);
          })(t3, e3);
        }, "interactions:cancel": function(t3, e3) {
          Gn(t3), Vn(t3, e3);
        } }, PointerEvent: qn, fire: Vn, collectEventTargets: Wn, defaults: { holdDuration: 600, ignoreFrom: null, allowFrom: null, origin: { x: 0, y: 0 } }, types: { down: true, move: true, up: true, cancel: true, tap: true, doubletap: true, hold: true } };
        function Vn(t3, e3) {
          var n2 = t3.interaction, r3 = t3.pointer, i3 = t3.event, o2 = t3.eventTarget, a3 = t3.type, s3 = t3.targets, c3 = void 0 === s3 ? Wn(t3, e3) : s3, l2 = new qn(a3, r3, i3, o2, n2, e3.now());
          e3.fire("pointerEvents:new", { pointerEvent: l2 });
          for (var u2 = { interaction: n2, pointer: r3, event: i3, eventTarget: o2, targets: c3, type: a3, pointerEvent: l2 }, p2 = 0; p2 < c3.length; p2++) {
            var f2 = c3[p2];
            for (var d3 in f2.props || {}) l2[d3] = f2.props[d3];
            var h3 = K2(f2.eventable, f2.node);
            if (l2._subtractOrigin(h3), l2.eventable = f2.eventable, l2.currentTarget = f2.node, f2.eventable.fire(l2), l2._addOrigin(h3), l2.immediatePropagationStopped || l2.propagationStopped && p2 + 1 < c3.length && c3[p2 + 1].node !== l2.currentTarget) break;
          }
          if (e3.fire("pointerEvents:fired", u2), "tap" === a3) {
            var v3 = l2.double ? Vn({ interaction: n2, pointer: r3, event: i3, eventTarget: o2, type: "doubletap" }, e3) : l2;
            n2.prevTap = v3, n2.tapTime = v3.timeStamp;
          }
          return l2;
        }
        function Wn(t3, e3) {
          var n2 = t3.interaction, r3 = t3.pointer, i3 = t3.event, o2 = t3.eventTarget, a3 = t3.type, s3 = n2.getPointerIndex(r3), c3 = n2.pointers[s3];
          if ("tap" === a3 && (n2.pointerWasMoved || !c3 || c3.downTarget !== o2)) return [];
          for (var l2 = q(o2), u2 = { interaction: n2, pointer: r3, event: i3, eventTarget: o2, type: a3, path: l2, targets: [], node: null }, p2 = 0; p2 < l2.length; p2++) {
            var f2 = l2[p2];
            u2.node = f2, e3.fire("pointerEvents:collect-targets", u2);
          }
          return "hold" === a3 && (u2.targets = u2.targets.filter((function(t4) {
            var e4, r4;
            return t4.eventable.options.holdDuration === (null == (e4 = n2.pointers[s3]) || null == (r4 = e4.hold) ? void 0 : r4.duration);
          }))), u2.targets;
        }
        function Gn(t3) {
          var e3 = t3.interaction, n2 = t3.pointerIndex, r3 = e3.pointers[n2].hold;
          r3 && r3.timeout && (clearTimeout(r3.timeout), r3.timeout = null);
        }
        var Nn = Object.freeze({ __proto__: null, default: Bn });
        function Un(t3) {
          var e3 = t3.interaction;
          e3.holdIntervalHandle && (clearInterval(e3.holdIntervalHandle), e3.holdIntervalHandle = null);
        }
        var Hn = { id: "pointer-events/holdRepeat", install: function(t3) {
          t3.usePlugin(Bn);
          var e3 = t3.pointerEvents;
          e3.defaults.holdRepeatInterval = 0, e3.types.holdrepeat = t3.actions.phaselessTypes.holdrepeat = true;
        }, listeners: ["move", "up", "cancel", "endall"].reduce((function(t3, e3) {
          return t3["pointerEvents:".concat(e3)] = Un, t3;
        }), { "pointerEvents:new": function(t3) {
          var e3 = t3.pointerEvent;
          "hold" === e3.type && (e3.count = (e3.count || 0) + 1);
        }, "pointerEvents:fired": function(t3, e3) {
          var n2 = t3.interaction, r3 = t3.pointerEvent, i3 = t3.eventTarget, o2 = t3.targets;
          if ("hold" === r3.type && o2.length) {
            var a3 = o2[0].eventable.options.holdRepeatInterval;
            a3 <= 0 || (n2.holdIntervalHandle = setTimeout((function() {
              e3.pointerEvents.fire({ interaction: n2, eventTarget: i3, type: "hold", pointer: r3, event: r3 }, e3);
            }), a3));
          }
        } }) }, Kn = Hn;
        var $n = { id: "pointer-events/interactableTargets", install: function(t3) {
          var e3 = t3.Interactable;
          e3.prototype.pointerEvents = function(t4) {
            return V2(this.events.options, t4), this;
          };
          var n2 = e3.prototype._backCompatOption;
          e3.prototype._backCompatOption = function(t4, e4) {
            var r3 = n2.call(this, t4, e4);
            return r3 === this && (this.events.options[t4] = e4), r3;
          };
        }, listeners: { "pointerEvents:collect-targets": function(t3, e3) {
          var n2 = t3.targets, r3 = t3.node, i3 = t3.type, o2 = t3.eventTarget;
          e3.interactables.forEachMatch(r3, (function(t4) {
            var e4 = t4.events, a3 = e4.options;
            e4.types[i3] && e4.types[i3].length && t4.testIgnoreAllow(a3, r3, o2) && n2.push({ node: r3, eventable: e4, props: { interactable: t4 } });
          }));
        }, "interactable:new": function(t3) {
          var e3 = t3.interactable;
          e3.events.getRect = function(t4) {
            return e3.getRect(t4);
          };
        }, "interactable:set": function(t3, e3) {
          var n2 = t3.interactable, r3 = t3.options;
          V2(n2.events.options, e3.pointerEvents.defaults), V2(n2.events.options, r3.pointerEvents || {});
        } } }, Jn = $n, Qn = { id: "pointer-events", install: function(t3) {
          t3.usePlugin(Nn), t3.usePlugin(Kn), t3.usePlugin(Jn);
        } }, Zn = Qn;
        var tr = { id: "reflow", install: function(t3) {
          var e3 = t3.Interactable;
          t3.actions.phases.reflow = true, e3.prototype.reflow = function(e4) {
            return (function(t4, e5, n2) {
              for (var r3 = t4.getAllElements(), i3 = n2.window.Promise, o2 = i3 ? [] : null, a3 = function() {
                var a4 = r3[s3], c3 = t4.getRect(a4);
                if (!c3) return 1;
                var l2, u2 = bt(n2.interactions.list, (function(n3) {
                  return n3.interacting() && n3.interactable === t4 && n3.element === a4 && n3.prepared.name === e5.name;
                }));
                if (u2) u2.move(), o2 && (l2 = u2._reflowPromise || new i3((function(t5) {
                  u2._reflowResolve = t5;
                })));
                else {
                  var p2 = U(c3), f2 = (function(t5) {
                    return { coords: t5, get page() {
                      return this.coords.page;
                    }, get client() {
                      return this.coords.client;
                    }, get timeStamp() {
                      return this.coords.timeStamp;
                    }, get pageX() {
                      return this.coords.page.x;
                    }, get pageY() {
                      return this.coords.page.y;
                    }, get clientX() {
                      return this.coords.client.x;
                    }, get clientY() {
                      return this.coords.client.y;
                    }, get pointerId() {
                      return this.coords.pointerId;
                    }, get target() {
                      return this.coords.target;
                    }, get type() {
                      return this.coords.type;
                    }, get pointerType() {
                      return this.coords.pointerType;
                    }, get buttons() {
                      return this.coords.buttons;
                    }, preventDefault: function() {
                    } };
                  })({ page: { x: p2.x, y: p2.y }, client: { x: p2.x, y: p2.y }, timeStamp: n2.now() });
                  l2 = (function(t5, e6, n3, r4, i4) {
                    var o3 = t5.interactions.new({ pointerType: "reflow" }), a5 = { interaction: o3, event: i4, pointer: i4, eventTarget: n3, phase: "reflow" };
                    o3.interactable = e6, o3.element = n3, o3.prevEvent = i4, o3.updatePointer(i4, i4, n3, true), nt2(o3.coords.delta), Ut(o3.prepared, r4), o3._doPhase(a5);
                    var s4 = t5.window, c4 = s4.Promise, l3 = c4 ? new c4((function(t6) {
                      o3._reflowResolve = t6;
                    })) : void 0;
                    o3._reflowPromise = l3, o3.start(r4, e6, n3), o3._interacting ? (o3.move(a5), o3.end(i4)) : (o3.stop(), o3._reflowResolve());
                    return o3.removePointer(i4, i4), l3;
                  })(n2, t4, a4, e5, f2);
                }
                o2 && o2.push(l2);
              }, s3 = 0; s3 < r3.length && !a3(); s3++) ;
              return o2 && i3.all(o2).then((function() {
                return t4;
              }));
            })(this, e4, t3);
          };
        }, listeners: { "interactions:stop": function(t3, e3) {
          var n2 = t3.interaction;
          "reflow" === n2.pointerType && (n2._reflowResolve && n2._reflowResolve(), (function(t4, e4) {
            t4.splice(t4.indexOf(e4), 1);
          })(e3.interactions.list, n2));
        } } }, er = tr;
        if (un2.use(he), un2.use(Ce2), un2.use(Zn), un2.use(qe), un2.use(Ln2), un2.use(pe), un2.use(Xt2), un2.use(Gt), un2.use(er), un2.default = un2, "object" === n(module) && module) try {
          module.exports = un2;
        } catch (t3) {
        }
        return un2.default = un2, un2;
      }));
    })(interact_min$1, interact_min$1.exports);
    return interact_min$1.exports;
  }
  var interact_minExports = requireInteract_min();
  const He = getDefaultExportFromCjs(interact_minExports);
  const st = vue.defineComponent({
    __name: "grid-item",
    props: {
      isDraggable: { type: Boolean, default: void 0 },
      isResizable: { type: Boolean, default: void 0 },
      isBounded: { type: Boolean, default: void 0 },
      static: { type: Boolean, default: false },
      minH: { default: 1 },
      minW: { default: 1 },
      maxH: { default: 1 / 0 },
      maxW: { default: 1 / 0 },
      x: {},
      y: {},
      w: {},
      h: {},
      i: {},
      dragIgnoreFrom: { default: "a, button" },
      dragAllowFrom: { default: void 0 },
      resizeIgnoreFrom: { default: "a, button" },
      preserveAspectRatio: { type: Boolean, default: false },
      dragOption: { default: () => ({}) },
      resizeOption: { default: () => ({}) }
    },
    emits: ["container-resized", "resize", "resized", "move", "moved"],
    setup(Se, { expose: Me2, emit: We2 }) {
      const i$1 = Se, M = We2, l = vue.inject(T), g2 = vue.inject(v$1);
      if (!l)
        throw new Error("[grid-layout-plus]: missing layout store, GridItem must under a GridLayout.");
      const d2 = vue.shallowRef(null), e2 = vue.reactive({
        cols: 1,
        containerWidth: 100,
        rowHeight: 30,
        margin: [10, 10],
        maxRows: 1 / 0,
        draggable: void 0,
        resizable: void 0,
        bounded: void 0,
        transformScale: 1,
        useCssTransforms: true,
        useStyleCursor: true,
        isDragging: false,
        dragging: {
          top: -1,
          left: -1
        },
        isResizing: false,
        resizing: {
          width: -1,
          height: -1
        },
        style: {},
        rtl: false
      });
      let X2 = false, _2 = false, $2 = NaN, G$1 = NaN, k2 = NaN, E2 = NaN, j = -1, K$1 = -1, V$1 = -1, q = -1, h2 = i$1.x, v2 = i$1.y, p = i$1.w, y2 = i$1.h;
      const W2 = vue.ref(), J = vue.reactive({
        i: vue.toRef(i$1, "i"),
        state: e2,
        wrapper: W2,
        calcXY: A2
      });
      function Q(t2) {
        Te(t2);
      }
      function Z2() {
        de();
      }
      function U(t2) {
        ie(i$1.isDraggable) && (e2.draggable = t2);
      }
      function ee(t2) {
        ie(i$1.isResizable) && (e2.resizable = t2);
      }
      function te(t2) {
        ie(i$1.isBounded) && (e2.bounded = t2);
      }
      function ie$1(t2) {
        e2.transformScale = t2;
      }
      function ae2(t2) {
        e2.rowHeight = t2;
      }
      function re2(t2) {
        e2.maxRows = t2;
      }
      function ne() {
        e2.rtl = r() === "rtl", de();
      }
      function oe2(t2) {
        e2.cols = Math.floor(t2);
      }
      l.increaseItem(J), vue.onBeforeMount(() => {
        e2.rtl = r() === "rtl";
      }), vue.onMounted(() => {
        l.responsive && l.lastBreakpoint ? e2.cols = B(l.lastBreakpoint, l.cols) : e2.cols = l.colNum, e2.rowHeight = l.rowHeight, e2.containerWidth = l.width !== null ? l.width : 100, e2.margin = l.margin !== void 0 ? l.margin.map(Number) : [10, 10], e2.maxRows = l.maxRows, ie(i$1.isDraggable) ? e2.draggable = l.isDraggable : e2.draggable = i$1.isDraggable, ie(i$1.isResizable) ? e2.resizable = l.isResizable : e2.resizable = i$1.isResizable, ie(i$1.isBounded) ? e2.bounded = l.isBounded : e2.bounded = i$1.isBounded, e2.transformScale = l.transformScale, e2.useCssTransforms = l.useCssTransforms, e2.useStyleCursor = l.useStyleCursor, vue.watchEffect(() => {
          h2 = i$1.x, v2 = i$1.y, y2 = i$1.h, p = i$1.w, oo(H);
        }), g2.on("updateWidth", Q), g2.on("compact", Z2), g2.on("setDraggable", U), g2.on("setResizable", ee), g2.on("setBounded", te), g2.on("setTransformScale", ie$1), g2.on("setRowHeight", ae2), g2.on("setMaxRows", re2), g2.on("directionchange", ne), g2.on("setColNum", oe2);
      }), vue.onBeforeUnmount(() => {
        g2.off("updateWidth", Q), g2.off("compact", Z2), g2.off("setDraggable", U), g2.off("setResizable", ee), g2.off("setBounded", te), g2.off("setTransformScale", ie$1), g2.off("setRowHeight", ae2), g2.off("setMaxRows", re2), g2.off("directionchange", ne), g2.off("setColNum", oe2), d2.value && (d2.value.unset(), d2.value = null), l.decreaseItem(J);
      }), Me2({ state: e2, wrapper: W2 });
      const Be2 = typeof navigator < "u" ? navigator.userAgent.toLowerCase().includes("android") : false, se = vue.computed(() => e2.resizable && !i$1.static), m = vue.computed(() => l.isMirrored ? !e2.rtl : e2.rtl), Ce2 = vue.computed(() => (e2.draggable || e2.resizable) && !i$1.static), z = K("item"), De2 = vue.computed(() => ({
        [z.b()]: true,
        [z.bm("resizable")]: se.value,
        [z.bm("static")]: i$1.static,
        [z.bm("resizing")]: e2.isResizing,
        [z.bm("dragging")]: e2.isDragging,
        [z.bm("transform")]: e2.useCssTransforms,
        [z.bm("rtl")]: m.value,
        [z.bm("no-touch")]: Be2 && Ce2.value
      })), T$1 = vue.computed(() => [z.be("resizer"), m.value && z.bem("resizer", "rtl")].filter(Boolean));
      vue.watch(
        () => i$1.isDraggable,
        (t2) => {
          e2.draggable = t2;
        }
      ), vue.watch(
        () => i$1.static,
        () => {
          oo(ue), oo(S);
        }
      ), vue.watch(
        () => e2.draggable,
        () => {
          oo(ue);
        }
      ), vue.watch(
        () => i$1.isResizable,
        (t2) => {
          e2.resizable = t2;
        }
      ), vue.watch(
        () => i$1.isBounded,
        (t2) => {
          e2.bounded = t2;
        }
      ), vue.watch(
        () => e2.resizable,
        () => {
          oo(S);
        }
      ), vue.watch(
        () => e2.rowHeight,
        () => {
          oo(H), oo(F);
        }
      ), vue.watch([() => e2.cols, () => e2.containerWidth], () => {
        oo(S), oo(H), oo(F);
      }), vue.watch([() => i$1.minH, () => i$1.maxH, () => i$1.minW, () => i$1.maxW], () => {
        oo(S);
      }), vue.watch(m, () => {
        oo(S), oo(H);
      }), vue.watch([() => l.margin, () => l.margin[0], () => l.margin[1]], () => {
        const t2 = l.margin;
        !t2 || t2[0] === e2.margin[0] && t2[1] === e2.margin[1] || (e2.margin = t2.map(Number), oo(H), oo(F));
      });
      function H() {
        i$1.x + i$1.w > e2.cols ? (h2 = 0, p = i$1.w > e2.cols ? e2.cols : i$1.w) : (h2 = i$1.x, p = i$1.w);
        const t2 = B$1(h2, v2, p, y2);
        e2.isDragging && (t2.top = e2.dragging.top, m.value ? t2.right = e2.dragging.left : t2.left = e2.dragging.left), e2.isResizing && (t2.width = e2.resizing.width, t2.height = e2.resizing.height);
        let r2;
        e2.useCssTransforms ? m.value ? r2 = O(t2.top, t2.right, t2.width, t2.height) : r2 = G(t2.top, t2.left, t2.width, t2.height) : m.value ? r2 = V(t2.top, t2.right, t2.width, t2.height) : r2 = R(t2.top, t2.left, t2.width, t2.height), e2.style = r2;
      }
      function F() {
        const t2 = {};
        for (const r2 of ["width", "height"]) {
          const o = e2.style[r2].match(/^(\d+)px$/);
          if (!o)
            return;
          t2[r2] = o[1];
        }
        M("container-resized", i$1.i, i$1.h, i$1.w, t2.height, t2.width);
      }
      function le(t2) {
        if (i$1.static) return;
        const r2 = t2.type;
        if (r2 === "resizestart" && e2.isResizing || r2 !== "resizestart" && !e2.isResizing)
          return;
        const s2 = a(t2);
        if (ie(s2)) return;
        const { x: o, y: c2 } = s2, n = { width: 0, height: 0 };
        let a$12;
        switch (r2) {
          case "resizestart": {
            S(), j = p, K$1 = y2, a$12 = B$1(h2, v2, p, y2), n.width = a$12.width, n.height = a$12.height, e2.resizing = n, e2.isResizing = true;
            break;
          }
          case "resizemove": {
            !t2.edges.right && !t2.edges.left && (k2 = o), !t2.edges.top && !t2.edges.bottom && (E2 = c2);
            const u = i(k2, E2, o, c2);
            m.value ? n.width = e2.resizing.width - u.deltaX / e2.transformScale : n.width = e2.resizing.width + u.deltaX / e2.transformScale, n.height = e2.resizing.height + u.deltaY / e2.transformScale, e2.resizing = n;
            break;
          }
          case "resizeend": {
            a$12 = B$1(h2, v2, p, y2), n.width = a$12.width, n.height = a$12.height, e2.resizing = { width: -1, height: -1 }, e2.isResizing = false;
            break;
          }
        }
        a$12 = Ne2(n.height, n.width), a$12.w < i$1.minW && (a$12.w = i$1.minW), a$12.w > i$1.maxW && (a$12.w = i$1.maxW), a$12.h < i$1.minH && (a$12.h = i$1.minH), a$12.h > i$1.maxH && (a$12.h = i$1.maxH), a$12.h < 1 && (a$12.h = 1), a$12.w < 1 && (a$12.w = 1), k2 = o, E2 = c2, (p !== a$12.w || y2 !== a$12.h) && M("resize", i$1.i, a$12.h, a$12.w, n.height, n.width), t2.type === "resizeend" && (j !== p || K$1 !== y2) && M("resized", i$1.i, a$12.h, a$12.w, n.height, n.width), g2.emit("resizeEvent", t2.type, i$1.i, h2, v2, a$12.h, a$12.w);
      }
      function ge2(t2) {
        if (i$1.static || e2.isResizing) return;
        const r2 = t2.type;
        if (r2 === "dragstart" && e2.isDragging || r2 !== "dragstart" && !e2.isDragging)
          return;
        const s2 = a(t2);
        if (ie(s2)) return;
        const { x: o, y: c2 } = s2, n = t2.target;
        if (!n.offsetParent) return;
        const a$12 = { top: 0, left: 0 };
        switch (r2) {
          case "dragstart": {
            V$1 = h2, q = v2;
            const w = n.offsetParent.getBoundingClientRect(), R2 = n.getBoundingClientRect(), C2 = R2.left / e2.transformScale, D2 = w.left / e2.transformScale, P2 = R2.right / e2.transformScale, Y2 = w.right / e2.transformScale, L2 = R2.top / e2.transformScale, O2 = w.top / e2.transformScale;
            m.value ? a$12.left = (P2 - Y2) * -1 : a$12.left = C2 - D2, a$12.top = L2 - O2, e2.dragging = a$12, e2.isDragging = true;
            break;
          }
          case "dragmove": {
            const w = i($2, G$1, o, c2);
            if (m.value ? a$12.left = e2.dragging.left - w.deltaX / e2.transformScale : a$12.left = e2.dragging.left + w.deltaX / e2.transformScale, a$12.top = e2.dragging.top + w.deltaY / e2.transformScale, e2.bounded) {
              const R2 = n.offsetParent.clientHeight - ce(i$1.h, e2.rowHeight, e2.margin[1]);
              a$12.top = fe2(a$12.top, 0, R2);
              const C2 = I(), D2 = e2.containerWidth - ce(i$1.w, C2, e2.margin[0]);
              a$12.left = fe2(a$12.left, 0, D2);
            }
            e2.dragging = a$12;
            break;
          }
          case "dragend": {
            const w = n.offsetParent.getBoundingClientRect(), R2 = n.getBoundingClientRect(), C2 = R2.left / e2.transformScale, D2 = w.left / e2.transformScale, P2 = R2.right / e2.transformScale, Y2 = w.right / e2.transformScale, L2 = R2.top / e2.transformScale, O2 = w.top / e2.transformScale;
            m.value ? a$12.left = (P2 - Y2) * -1 : a$12.left = C2 - D2, a$12.top = L2 - O2, e2.dragging = { top: -1, left: -1 }, e2.isDragging = false;
            break;
          }
        }
        let u;
        m.value, u = A2(a$12.top, a$12.left), $2 = o, G$1 = c2, (h2 !== u.x || v2 !== u.y) && M("move", i$1.i, u.x, u.y), t2.type === "dragend" && (V$1 !== h2 || q !== v2) && M("moved", i$1.i, u.x, u.y), g2.emit("dragEvent", t2.type, i$1.i, u.x, u.y, y2, p);
      }
      function B$1(t2, r2, s2, o) {
        const c2 = I();
        let n;
        return m.value ? n = {
          right: Math.round(c2 * t2 + (t2 + 1) * e2.margin[0]),
          top: Math.round(e2.rowHeight * r2 + (r2 + 1) * e2.margin[1]),


width: s2 === 1 / 0 ? s2 : Math.round(c2 * s2 + Math.max(0, s2 - 1) * e2.margin[0]),
          height: o === 1 / 0 ? o : Math.round(e2.rowHeight * o + Math.max(0, o - 1) * e2.margin[1])
        } : n = {
          left: Math.round(c2 * t2 + (t2 + 1) * e2.margin[0]),
          top: Math.round(e2.rowHeight * r2 + (r2 + 1) * e2.margin[1]),


width: s2 === 1 / 0 ? s2 : Math.round(c2 * s2 + Math.max(0, s2 - 1) * e2.margin[0]),
          height: o === 1 / 0 ? o : Math.round(e2.rowHeight * o + Math.max(0, o - 1) * e2.margin[1])
        }, n;
      }
      function A2(t2, r2) {
        const s2 = I();
        let o = Math.round((r2 - e2.margin[0]) / (s2 + e2.margin[0])), c2 = Math.round((t2 - e2.margin[1]) / (e2.rowHeight + e2.margin[1]));
        return o = Math.max(Math.min(o, e2.cols - p), 0), c2 = Math.max(Math.min(c2, e2.maxRows - y2), 0), { x: o, y: c2 };
      }
      function I() {
        return (e2.containerWidth - e2.margin[0] * (e2.cols + 1)) / e2.cols;
      }
      function ce(t2, r2, s2) {
        return Number.isFinite(t2) ? Math.round(r2 * t2 + Math.max(0, t2 - 1) * s2) : t2;
      }
      function fe2(t2, r2, s2) {
        return Math.max(Math.min(t2, s2), r2);
      }
      function Ne2(t2, r2, s2 = false) {
        const o = I();
        let c2 = Math.round((r2 + e2.margin[0]) / (o + e2.margin[0])), n = 0;
        return s2 ? n = Math.ceil((t2 + e2.margin[1]) / (e2.rowHeight + e2.margin[1])) : n = Math.round((t2 + e2.margin[1]) / (e2.rowHeight + e2.margin[1])), c2 = Math.max(Math.min(c2, e2.cols - h2), 0), n = Math.max(Math.min(n, e2.maxRows - v2), 0), { w: c2, h: n };
      }
      function Te(t2, r2) {
        e2.containerWidth = t2;
      }
      function de() {
        H();
      }
      function me() {
        !d2.value && W2.value && (d2.value = He(W2.value), e2.useStyleCursor || d2.value.styleCursor(false));
      }
      const Ie = eo(ge2);
      function ue() {
        if (me(), !!d2.value)
          if (e2.draggable && !i$1.static) {
            const t2 = {
              ignoreFrom: i$1.dragIgnoreFrom,
              allowFrom: i$1.dragAllowFrom,
              ...i$1.dragOption
            };
            d2.value.draggable(t2), X2 || (X2 = true, d2.value.on("dragstart dragmove dragend", (r2) => {
              r2.type === "dragmove" ? Ie(r2) : ge2(r2);
            }));
          } else
            d2.value.draggable({ enabled: false });
      }
      const ke2 = eo(le);
      function S() {
        if (me(), !!d2.value)
          if (e2.resizable && !i$1.static) {
            const t2 = B$1(0, 0, i$1.maxW, i$1.maxH), r2 = B$1(0, 0, i$1.minW, i$1.minH), s2 = {
              edges: {
                left: m.value ? `.${T$1.value[0]}` : false,
                right: m.value ? false : `.${T$1.value[0]}`,
                bottom: `.${T$1.value[0]}`,
                top: false
              },
              ignoreFrom: i$1.resizeIgnoreFrom,
              restrictSize: {
                min: {
                  height: r2.height * e2.transformScale,
                  width: r2.width * e2.transformScale
                },
                max: {
                  height: t2.height * e2.transformScale,
                  width: t2.width * e2.transformScale
                }
              },
              ...i$1.resizeOption
            };
            i$1.preserveAspectRatio && (s2.modifiers = [He.modifiers.aspectRatio({ ratio: "preserve" })]), d2.value.resizable(s2), _2 || (_2 = true, d2.value.on("resizestart resizemove resizeend", (o) => {
              o.type === "resizemove" ? ke2(o) : le(o);
            }));
          } else
            d2.value.resizable({ enabled: false });
      }
      return (t2, r2) => (vue.openBlock(), vue.createElementBlock("section", {
        ref_key: "wrapper",
        ref: W2,
        class: vue.normalizeClass(De2.value),
        style: vue.normalizeStyle(e2.style)
      }, [
        vue.renderSlot(t2.$slots, "default"),
        se.value ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(T$1.value)
        }, null, 2)) : vue.createCommentVNode("", true)
      ], 6));
    }
  });
  const D = typeof window < "u";
  var pt;
  D && ((pt = window == null ? void 0 : window.navigator) != null && pt.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function Be(e2) {
    return e2 != null;
  }
  function P() {
  }
  const xn = Object.freeze({
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
  });
  Object.freeze(new Set(Object.keys(xn)));
  const Tn = D && ("ontouchstart" in window || On() > 0), Sn = Tn ? "pointerdown" : "click";
  function On() {
    return typeof navigator < "u" && (navigator.maxTouchPoints || navigator.msMaxTouchPoints) || 0;
  }
  function zn(e2, t2, n = window.Event) {
    const { type: r2, bubbles: o = false, cancelable: i2 = false, ...s2 } = t2;
    if (!Be(r2) || r2 === "") return false;
    let c2;
    return Be(n) ? c2 = new n(r2, { bubbles: o, cancelable: i2 }) : (c2 = document.createEvent("HTMLEvents"), c2.initEvent(r2, o, i2)), Object.assign(c2, s2), e2.dispatchEvent(c2);
  }
  const qt = "clickoutside", Ue = new Set();
  D && document.addEventListener(
    Sn,
    (e2) => {
      const t2 = e2.target, n = e2.composedPath && e2.composedPath();
      Ue.forEach((r2) => {
        r2 !== t2 && (n ? !n.includes(r2) : !r2.contains(t2)) && (!r2.__transferElement || r2.__transferElement !== t2 && !r2.__transferElement.contains(t2)) && zn(r2, { type: qt });
      });
    },
    true
  );
  const Ln = [
    [
      "requestFullscreen",
      "exitFullscreen",
      "fullscreenElement",
      "fullscreenEnabled",
      "fullscreenchange",
      "fullscreenerror"
    ],
[
      "webkitRequestFullscreen",
      "webkitExitFullscreen",
      "webkitFullscreenElement",
      "webkitFullscreenEnabled",
      "webkitfullscreenchange",
      "webkitfullscreenerror"
    ],
[
      "webkitRequestFullScreen",
      "webkitCancelFullScreen",
      "webkitCurrentFullScreenElement",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror"
    ],
    [
      "mozRequestFullScreen",
      "mozCancelFullScreen",
      "mozFullScreenElement",
      "mozFullScreenEnabled",
      "mozfullscreenchange",
      "mozfullscreenerror"
    ],
    [
      "msRequestFullscreen",
      "msExitFullscreen",
      "msFullscreenElement",
      "msFullscreenEnabled",
      "MSFullscreenChange",
      "MSFullscreenError"
    ]
  ];
  let ae;
  if (D) {
    for (const e2 of Ln)
      if (e2[1] in document) {
        ae = e2;
        break;
      }
  }
  ({
    full: vue.computed(() => false)
  });
  const Xt = new Set(), Je = new WeakMap();
  if (D && ae) {
    const e2 = ae[2], t2 = ae[4];
    document.addEventListener(
      t2,
      () => {
        if (Xt.forEach((n) => {
          n.value = false;
        }), document[e2]) {
          const n = Je.get(document[e2]);
          n && (n.value = true);
        }
      },
      false
    );
  }
  const Z = new Map();
  Z.set("x", 0);
  Z.set("y", 0);
  var re = [], Or = function() {
    return re.some(function(e2) {
      return e2.activeTargets.length > 0;
    });
  }, zr = function() {
    return re.some(function(e2) {
      return e2.skippedTargets.length > 0;
    });
  }, Ot = "ResizeObserver loop completed with undelivered notifications.", kr = function() {
    var e2;
    typeof ErrorEvent == "function" ? e2 = new ErrorEvent("error", {
      message: Ot
    }) : (e2 = document.createEvent("Event"), e2.initEvent("error", false, false), e2.message = Ot), window.dispatchEvent(e2);
  }, we;
  (function(e2) {
    e2.BORDER_BOX = "border-box", e2.CONTENT_BOX = "content-box", e2.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
  })(we || (we = {}));
  var oe = function(e2) {
    return Object.freeze(e2);
  }, Ar = (function() {
    function e2(t2, n) {
      this.inlineSize = t2, this.blockSize = n, oe(this);
    }
    return e2;
  })(), on = (function() {
    function e2(t2, n, r2, o) {
      return this.x = t2, this.y = n, this.width = r2, this.height = o, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, oe(this);
    }
    return e2.prototype.toJSON = function() {
      var t2 = this, n = t2.x, r2 = t2.y, o = t2.top, i2 = t2.right, s2 = t2.bottom, c2 = t2.left, a2 = t2.width, l = t2.height;
      return { x: n, y: r2, top: o, right: i2, bottom: s2, left: c2, width: a2, height: l };
    }, e2.fromRect = function(t2) {
      return new e2(t2.x, t2.y, t2.width, t2.height);
    }, e2;
  })(), dt = function(e2) {
    return e2 instanceof SVGElement && "getBBox" in e2;
  }, sn = function(e2) {
    if (dt(e2)) {
      var t2 = e2.getBBox(), n = t2.width, r2 = t2.height;
      return !n && !r2;
    }
    var o = e2, i2 = o.offsetWidth, s2 = o.offsetHeight;
    return !(i2 || s2 || e2.getClientRects().length);
  }, zt = function(e2) {
    var t2;
    if (e2 instanceof Element)
      return true;
    var n = (t2 = e2 == null ? void 0 : e2.ownerDocument) === null || t2 === void 0 ? void 0 : t2.defaultView;
    return !!(n && e2 instanceof n.Element);
  }, Cr = function(e2) {
    switch (e2.tagName) {
      case "INPUT":
        if (e2.type !== "image")
          break;
      case "VIDEO":
      case "AUDIO":
      case "EMBED":
      case "OBJECT":
      case "CANVAS":
      case "IFRAME":
      case "IMG":
        return true;
    }
    return false;
  }, ge = typeof window < "u" ? window : {}, ke = new WeakMap(), kt = /auto|scroll/, Mr = /^tb|vertical/, Lr = /msie|trident/i.test(ge.navigator && ge.navigator.userAgent), X = function(e2) {
    return parseFloat(e2 || "0");
  }, fe = function(e2, t2, n) {
    return e2 === void 0 && (e2 = 0), t2 === void 0 && (t2 = 0), n === void 0 && (n = false), new Ar((n ? t2 : e2) || 0, (n ? e2 : t2) || 0);
  }, At = oe({
    devicePixelContentBoxSize: fe(),
    borderBoxSize: fe(),
    contentBoxSize: fe(),
    contentRect: new on(0, 0, 0, 0)
  }), cn = function(e2, t2) {
    if (t2 === void 0 && (t2 = false), ke.has(e2) && !t2)
      return ke.get(e2);
    if (sn(e2))
      return ke.set(e2, At), At;
    var n = getComputedStyle(e2), r2 = dt(e2) && e2.ownerSVGElement && e2.getBBox(), o = !Lr && n.boxSizing === "border-box", i2 = Mr.test(n.writingMode || ""), s2 = !r2 && kt.test(n.overflowY || ""), c2 = !r2 && kt.test(n.overflowX || ""), a2 = r2 ? 0 : X(n.paddingTop), l = r2 ? 0 : X(n.paddingRight), f = r2 ? 0 : X(n.paddingBottom), d2 = r2 ? 0 : X(n.paddingLeft), v2 = r2 ? 0 : X(n.borderTopWidth), m = r2 ? 0 : X(n.borderRightWidth), b2 = r2 ? 0 : X(n.borderBottomWidth), g2 = r2 ? 0 : X(n.borderLeftWidth), p = d2 + l, h2 = a2 + f, u = g2 + m, y2 = v2 + b2, O2 = c2 ? e2.offsetHeight - y2 - e2.clientHeight : 0, T2 = s2 ? e2.offsetWidth - u - e2.clientWidth : 0, S = o ? p + u : 0, C2 = o ? h2 + y2 : 0, k2 = r2 ? r2.width : X(n.width) - S - T2, M = r2 ? r2.height : X(n.height) - C2 - O2, L2 = k2 + p + T2 + u, $2 = M + h2 + O2 + y2, _2 = oe({
      devicePixelContentBoxSize: fe(Math.round(k2 * devicePixelRatio), Math.round(M * devicePixelRatio), i2),
      borderBoxSize: fe(L2, $2, i2),
      contentBoxSize: fe(k2, M, i2),
      contentRect: new on(d2, a2, k2, M)
    });
    return ke.set(e2, _2), _2;
  }, an = function(e2, t2, n) {
    var r2 = cn(e2, n), o = r2.borderBoxSize, i2 = r2.contentBoxSize, s2 = r2.devicePixelContentBoxSize;
    switch (t2) {
      case we.DEVICE_PIXEL_CONTENT_BOX:
        return s2;
      case we.BORDER_BOX:
        return o;
      default:
        return i2;
    }
  }, Br = (function() {
    function e2(t2) {
      var n = cn(t2);
      this.target = t2, this.contentRect = n.contentRect, this.borderBoxSize = oe([n.borderBoxSize]), this.contentBoxSize = oe([n.contentBoxSize]), this.devicePixelContentBoxSize = oe([n.devicePixelContentBoxSize]);
    }
    return e2;
  })(), ln = function(e2) {
    if (sn(e2))
      return 1 / 0;
    for (var t2 = 0, n = e2.parentNode; n; )
      t2 += 1, n = n.parentNode;
    return t2;
  }, Pr = function() {
    var e2 = 1 / 0, t2 = [];
    re.forEach(function(s2) {
      if (s2.activeTargets.length !== 0) {
        var c2 = [];
        s2.activeTargets.forEach(function(l) {
          var f = new Br(l.target), d2 = ln(l.target);
          c2.push(f), l.lastReportedSize = an(l.target, l.observedBox), d2 < e2 && (e2 = d2);
        }), t2.push(function() {
          s2.callback.call(s2.observer, c2, s2.observer);
        }), s2.activeTargets.splice(0, s2.activeTargets.length);
      }
    });
    for (var n = 0, r2 = t2; n < r2.length; n++) {
      var o = r2[n];
      o();
    }
    return e2;
  }, Ct = function(e2) {
    re.forEach(function(n) {
      n.activeTargets.splice(0, n.activeTargets.length), n.skippedTargets.splice(0, n.skippedTargets.length), n.observationTargets.forEach(function(o) {
        o.isActive() && (ln(o.target) > e2 ? n.activeTargets.push(o) : n.skippedTargets.push(o));
      });
    });
  }, Fr = function() {
    var e2 = 0;
    for (Ct(e2); Or(); )
      e2 = Pr(), Ct(e2);
    return zr() && kr(), e2 > 0;
  }, je, fn = [], Dr = function() {
    return fn.splice(0).forEach(function(e2) {
      return e2();
    });
  }, _r = function(e2) {
    if (!je) {
      var t2 = 0, n = document.createTextNode(""), r2 = { characterData: true };
      new MutationObserver(function() {
        return Dr();
      }).observe(n, r2), je = function() {
        n.textContent = "".concat(t2 ? t2-- : t2++);
      };
    }
    fn.push(e2), je();
  }, Nr = function(e2) {
    _r(function() {
      requestAnimationFrame(e2);
    });
  }, Me = 0, Wr = function() {
    return !!Me;
  }, Ir = 250, Hr = { attributes: true, characterData: true, childList: true, subtree: true }, Mt = [
    "resize",
    "load",
    "transitionend",
    "animationend",
    "animationstart",
    "animationiteration",
    "keyup",
    "keydown",
    "mouseup",
    "mousedown",
    "mouseover",
    "mouseout",
    "blur",
    "focus"
  ], Lt = function(e2) {
    return e2 === void 0 && (e2 = 0), Date.now() + e2;
  }, Ye = false, $r = (function() {
    function e2() {
      var t2 = this;
      this.stopped = true, this.listener = function() {
        return t2.schedule();
      };
    }
    return e2.prototype.run = function(t2) {
      var n = this;
      if (t2 === void 0 && (t2 = Ir), !Ye) {
        Ye = true;
        var r2 = Lt(t2);
        Nr(function() {
          var o = false;
          try {
            o = Fr();
          } finally {
            if (Ye = false, t2 = r2 - Lt(), !Wr())
              return;
            o ? n.run(1e3) : t2 > 0 ? n.run(t2) : n.start();
          }
        });
      }
    }, e2.prototype.schedule = function() {
      this.stop(), this.run();
    }, e2.prototype.observe = function() {
      var t2 = this, n = function() {
        return t2.observer && t2.observer.observe(document.body, Hr);
      };
      document.body ? n() : ge.addEventListener("DOMContentLoaded", n);
    }, e2.prototype.start = function() {
      var t2 = this;
      this.stopped && (this.stopped = false, this.observer = new MutationObserver(this.listener), this.observe(), Mt.forEach(function(n) {
        return ge.addEventListener(n, t2.listener, true);
      }));
    }, e2.prototype.stop = function() {
      var t2 = this;
      this.stopped || (this.observer && this.observer.disconnect(), Mt.forEach(function(n) {
        return ge.removeEventListener(n, t2.listener, true);
      }), this.stopped = true);
    }, e2;
  })(), tt = new $r(), Bt = function(e2) {
    !Me && e2 > 0 && tt.start(), Me += e2, !Me && tt.stop();
  }, qr = function(e2) {
    return !dt(e2) && !Cr(e2) && getComputedStyle(e2).display === "inline";
  }, Vr = (function() {
    function e2(t2, n) {
      this.target = t2, this.observedBox = n || we.CONTENT_BOX, this.lastReportedSize = {
        inlineSize: 0,
        blockSize: 0
      };
    }
    return e2.prototype.isActive = function() {
      var t2 = an(this.target, this.observedBox, true);
      return qr(this.target) && (this.lastReportedSize = t2), this.lastReportedSize.inlineSize !== t2.inlineSize || this.lastReportedSize.blockSize !== t2.blockSize;
    }, e2;
  })(), Xr = (function() {
    function e2(t2, n) {
      this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = t2, this.callback = n;
    }
    return e2;
  })(), Ae = new WeakMap(), Pt = function(e2, t2) {
    for (var n = 0; n < e2.length; n += 1)
      if (e2[n].target === t2)
        return n;
    return -1;
  }, Ce = (function() {
    function e2() {
    }
    return e2.connect = function(t2, n) {
      var r2 = new Xr(t2, n);
      Ae.set(t2, r2);
    }, e2.observe = function(t2, n, r2) {
      var o = Ae.get(t2), i2 = o.observationTargets.length === 0;
      Pt(o.observationTargets, n) < 0 && (i2 && re.push(o), o.observationTargets.push(new Vr(n, r2 && r2.box)), Bt(1), tt.schedule());
    }, e2.unobserve = function(t2, n) {
      var r2 = Ae.get(t2), o = Pt(r2.observationTargets, n), i2 = r2.observationTargets.length === 1;
      o >= 0 && (i2 && re.splice(re.indexOf(r2), 1), r2.observationTargets.splice(o, 1), Bt(-1));
    }, e2.disconnect = function(t2) {
      var n = this, r2 = Ae.get(t2);
      r2.observationTargets.slice().forEach(function(o) {
        return n.unobserve(t2, o.target);
      }), r2.activeTargets.splice(0, r2.activeTargets.length);
    }, e2;
  })(), Ft = (function() {
    function e2(t2) {
      if (arguments.length === 0)
        throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
      if (typeof t2 != "function")
        throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
      Ce.connect(this, t2);
    }
    return e2.prototype.observe = function(t2, n) {
      if (arguments.length === 0)
        throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
      if (!zt(t2))
        throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
      Ce.observe(this, t2, n);
    }, e2.prototype.unobserve = function(t2) {
      if (arguments.length === 0)
        throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
      if (!zt(t2))
        throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
      Ce.unobserve(this, t2);
    }, e2.prototype.disconnect = function() {
      Ce.disconnect(this);
    }, e2.toString = function() {
      return "function ResizeObserver () { [polyfill code] }";
    }, e2;
  })();
  const Ne = new WeakMap();
  function jr(e2) {
    var t2;
    for (let n = 0, r2 = e2.length; n < r2; ++n) {
      const o = e2[n], i2 = Ne.get(o.target);
      if (typeof i2 == "function") {
        const { inlineSize: s2, blockSize: c2 } = ((t2 = o.borderBoxSize) == null ? void 0 : t2[0]) ?? {}, { offsetWidth: a2, offsetHeight: l } = o.target;
        i2(
          Object.assign(o, {
            offsetWidth: a2,
            offsetHeight: l,
            width: s2 ?? a2,
            height: c2 ?? l
          })
        );
      }
    }
  }
  const un = new (D && window.ResizeObserver || Ft)(
    jr
  );
  function xe(e2, t2) {
    Ne.set(e2, t2), un.observe(e2);
  }
  function nt(e2) {
    Ne.has(e2) && (un.unobserve(e2), Ne.delete(e2));
  }
  function wo(e2 = {}) {
    let t2 = P;
    const n = vue.watch(
      () => vue.unref(e2.target),
      (o) => {
        t2(), !(!o || typeof e2.onResize != "function") && (xe(o, e2.onResize), t2 = () => {
          nt(o), t2 = P;
        });
      },
      { immediate: true }
    ), r2 = () => {
      n(), t2();
    };
    return vue.getCurrentScope() && vue.onScopeDispose(r2), {
observeResize: xe,
unobserveResize: nt,
      unobserve: r2
    };
  }
  const dn = vue.ref(false);
  vue.computed(() => dn.value);
  const Dt = "__theme_style__", Le = "__theme_observer__";
  const We = vue.reactive( new Map()), rt = new Map();
  vue.watch(We, () => {
    if (!D) return;
    rt.clear();
    const e2 = document.head.querySelector(`#${Dt}`);
    e2 && document.head.removeChild(e2);
    const t2 = document.createElement("style");
    let n = `.${Le} { width: 1px }`, r2 = 1;
    for (const [o, [i2, s2]] of We.entries())
      n += ` html.${i2} .${Le}, .${s2} .${Le} { width: ${++r2}px }`, rt.set(r2, o);
    t2.textContent = n, t2.id = Dt, document.head.appendChild(t2);
  });
  const De = vue.defineComponent({
    __name: "grid-layout",
    props: {
      autoSize: { type: Boolean, default: true },
      colNum: { default: 12 },
      rowHeight: { default: 150 },
      maxRows: { default: 1 / 0 },
      margin: { default: () => [10, 10] },
      isDraggable: { type: Boolean, default: true },
      isResizable: { type: Boolean, default: true },
      isMirrored: { type: Boolean, default: false },
      isBounded: { type: Boolean, default: false },
      useCssTransforms: { type: Boolean, default: true },
      verticalCompact: { type: Boolean, default: true },
      restoreOnDrag: { type: Boolean, default: false },
      layout: {},
      responsive: { type: Boolean, default: false },
      responsiveLayouts: { default: () => ({}) },
      transformScale: { default: 1 },
      breakpoints: { default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }) },
      cols: { default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }) },
      preventCollision: { type: Boolean, default: false },
      useStyleCursor: { type: Boolean, default: true }
    },
    emits: [
      "layout-before-mount",
      "layout-mounted",
      "layout-updated",
      "breakpoint-changed",
      "update:layout",
      "layout-ready"
    ],
    setup(Y$1, { expose: N, emit: $$1 }) {
      const a2 = Y$1, u = $$1, t2 = vue.reactive({
        width: -1,
        mergedStyle: {},
        lastLayoutLength: 0,
        isDragging: false,
        placeholder: {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          i: ""
        },
        layouts: {},
lastBreakpoint: null,
originalLayout: null
}), k$1 = new Map(), o = vue.ref(a2.layout), g2 = vue.ref(), { observeResize: A$1, unobserveResize: U } = wo(), r2 = Zr();
      r2.on("resizeEvent", q), r2.on("dragEvent", G2), vue.onBeforeMount(() => {
        u("layout-before-mount", o.value);
      }), vue.onMounted(() => {
        u("layout-mounted", o.value), vue.nextTick(() => {
          k(o.value), t2.originalLayout = o.value, vue.nextTick(() => {
            D2(), g2.value && A$1(g2.value, no(C$1, 16)), $(o.value, a2.verticalCompact), u("layout-updated", o.value), y$12(), C$1();
          });
        });
      }), vue.onBeforeUnmount(() => {
        r2.clearAll(), g2.value && U(g2.value);
      });
      function q(e2, n, l, f, d2, c2) {
        S(e2, n, l, f, d2, c2);
      }
      function G2(e2, n, l, f, d2, c2) {
        E2(e2, n, l, f, d2, c2);
      }
      vue.watch(
        () => t2.width,
        (e2, n) => {
          vue.nextTick(() => {
            r2.emit("updateWidth", e2), n === -1 && vue.nextTick(() => {
              u("layout-ready", o.value);
            }), y$12();
          });
        }
      ), vue.watch(
        () => [a2.layout, a2.layout.length],
        () => {
          o.value = a2.layout, R2();
        }
      ), vue.watch(
        () => a2.colNum,
        (e2) => {
          r2.emit("setColNum", e2);
        }
      ), vue.watch(
        () => a2.rowHeight,
        (e2) => {
          r2.emit("setRowHeight", e2);
        }
      ), vue.watch(
        () => a2.isDraggable,
        (e2) => {
          r2.emit("setDraggable", e2);
        }
      ), vue.watch(
        () => a2.isResizable,
        (e2) => {
          r2.emit("setResizable", e2);
        }
      ), vue.watch(
        () => a2.isBounded,
        (e2) => {
          r2.emit("setBounded", e2);
        }
      ), vue.watch(
        () => a2.transformScale,
        (e2) => {
          r2.emit("setTransformScale", e2);
        }
      ), vue.watch(
        () => a2.responsive,
        (e2) => {
          e2 || (u("update:layout", t2.originalLayout), r2.emit("setColNum", a2.colNum)), C$1();
        }
      ), vue.watch(
        () => a2.maxRows,
        (e2) => {
          r2.emit("setMaxRows", e2);
        }
      ), vue.watch([() => a2.margin, () => a2.margin[1]], y$12), vue.provide(
        T,
        vue.reactive({
          ...vue.toRefs(a2),
          ...vue.toRefs(t2),
          increaseItem: K2,
          decreaseItem: j
        })
      ), vue.provide(v$1, r2), N({ state: t2, getItem: P2, resizeEvent: S, dragEvent: E2, layoutUpdate: R2 });
      function K2(e2) {
        k$1.set(e2.i, e2);
      }
      function j(e2) {
        k$1.delete(e2.i);
      }
      function P2(e2) {
        return k$1.get(e2);
      }
      function R2() {
        if (!ie(o.value) && !ie(t2.originalLayout)) {
          if (o.value.length !== t2.originalLayout.length) {
            const e2 = J(o.value, t2.originalLayout);
            if (e2.length > 0)
              if (o.value.length > t2.originalLayout.length)
                t2.originalLayout = t2.originalLayout.concat(e2);
              else {
                const n = new Set(e2.map((l) => l.i));
                t2.originalLayout = t2.originalLayout.filter((l) => !n.has(l.i));
              }
            t2.lastLayoutLength = o.value.length, D2();
          }
          $(o.value, a2.verticalCompact), r2.emit("updateWidth", t2.width), y$12(), u("layout-updated", o.value);
        }
      }
      function y$12() {
        t2.mergedStyle = {
          height: V2()
        };
      }
      function C$1() {
        g2.value && (t2.width = g2.value.offsetWidth), r2.emit("resizeEvent");
      }
      function V2() {
        if (!a2.autoSize) return;
        const e2 = parseFloat(a2.margin[1]);
        return A(o.value) * (a2.rowHeight + e2) + e2 + "px";
      }
      let b2;
      function E2(e2, n, l, f, d2, c2) {
        let i2 = C(o.value, n);
        ie(i2) && (i2 = { h: 0, w: 0, x: 0, y: 0, i: "" }), e2 === "dragstart" && !a2.verticalCompact && (b2 = o.value.reduce(
          (v2, { i: x2, x: p, y: h2 }) => ({
            ...v2,
            [x2]: { x: p, y: h2 }
          }),
          {}
        )), e2 === "dragmove" || e2 === "dragstart" ? (t2.placeholder.i = n, t2.placeholder.x = i2.x, t2.placeholder.y = i2.y, t2.placeholder.w = c2, t2.placeholder.h = d2, vue.nextTick(() => {
          t2.isDragging = true;
        }), r2.emit("updateWidth", t2.width)) : vue.nextTick(() => {
          t2.isDragging = false;
        }), o.value = x(o.value, i2, l, f, true, a2.preventCollision), a2.restoreOnDrag ? (i2.static = true, $(o.value, a2.verticalCompact, b2), i2.static = false) : $(o.value, a2.verticalCompact), r2.emit("compact"), y$12(), e2 === "dragend" && (b2 = void 0, u("layout-updated", o.value));
      }
      function S(e2, n, l, f, d2, c2) {
        let i2 = C(o.value, n);
        ie(i2) && (i2 = { h: 0, w: 0, x: 0, y: 0, i: "" });
        let v2;
        if (a2.preventCollision) {
          const x2 = L(o.value, { ...i2, w: c2, h: d2 }).filter(
            (p) => p.i !== i2.i
          );
          if (v2 = x2.length > 0, v2) {
            let p = 1 / 0, h2 = 1 / 0;
            x2.forEach((L2) => {
              L2.x > i2.x && (p = Math.min(p, L2.x)), L2.y > i2.y && (h2 = Math.min(h2, L2.y));
            }), Number.isFinite(p) && (i2.w = p - i2.x), Number.isFinite(h2) && (i2.h = h2 - i2.y);
          }
        }
        v2 || (i2.w = c2, i2.h = d2), e2 === "resizestart" || e2 === "resizemove" ? (t2.placeholder.i = n, t2.placeholder.x = l, t2.placeholder.y = f, t2.placeholder.w = i2.w, t2.placeholder.h = i2.h, vue.nextTick(() => {
          t2.isDragging = true;
        }), r2.emit("updateWidth", t2.width)) : e2 && vue.nextTick(() => {
          t2.isDragging = false;
        }), a2.responsive && X2(), $(o.value, a2.verticalCompact), r2.emit("compact"), y$12(), e2 === "resizeend" && u("layout-updated", o.value);
      }
      function X2() {
        const e2 = y(a2.breakpoints, t2.width);
        if (e2 === t2.lastBreakpoint)
          return;
        const n = B(e2, a2.cols);
        !ie(t2.lastBreakpoint) && !t2.layouts[t2.lastBreakpoint] && (t2.layouts[t2.lastBreakpoint] = Y(o.value));
        const l = v(
          t2.originalLayout,
          t2.layouts,
          a2.breakpoints,
          e2,
          t2.lastBreakpoint,
          n,
          a2.verticalCompact
        );
        t2.layouts[e2] = l, t2.lastBreakpoint !== e2 && u("breakpoint-changed", e2, l), o.value = l, u("update:layout", l), t2.lastBreakpoint = e2, r2.emit("setColNum", n);
      }
      function D2() {
        t2.layouts = Object.assign({}, a2.responsiveLayouts);
      }
      function J(e2, n) {
        const l = new Set(n.map((i2) => i2.i)), f = new Set(e2.map((i2) => i2.i)), d2 = e2.filter((i2) => !l.has(i2.i)), c2 = n.filter((i2) => !f.has(i2.i));
        return d2.concat(c2);
      }
      return (e2, n) => (vue.openBlock(), vue.createElementBlock("div", {
        ref_key: "wrapper",
        ref: g2,
        class: "vgl-layout",
        style: vue.normalizeStyle(t2.mergedStyle)
      }, [
        e2.$slots.default ? vue.renderSlot(e2.$slots, "default", { key: 0 }) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(o.value, (l) => (vue.openBlock(), vue.createBlock(st, vue.mergeProps({
          key: l.i,
          ref_for: true
        }, l), {
          default: vue.withCtx(() => [
            vue.renderSlot(e2.$slots, "item", { item: l })
          ]),
          _: 2
        }, 1040))), 128)),
        vue.withDirectives(vue.createVNode(st, {
          class: "vgl-item--placeholder",
          x: t2.placeholder.x,
          y: t2.placeholder.y,
          w: t2.placeholder.w,
          h: t2.placeholder.h,
          i: t2.placeholder.i
        }, null, 8, ["x", "y", "w", "h", "i"]), [
          [vue.vShow, t2.isDragging]
        ])
      ], 4));
    }
  });
  (function() {
    try {
      if (typeof document < "u") {
        var e2 = document.createElement("style");
        e2.appendChild(document.createTextNode('.vgl-layout{--vgl-placeholder-bg: red;--vgl-placeholder-opacity: 20%;--vgl-placeholder-z-index: 2;--vgl-item-resizing-z-index: 3;--vgl-item-resizing-opacity: 60%;--vgl-item-dragging-z-index: 3;--vgl-item-dragging-opacity: 100%;--vgl-resizer-size: 10px;--vgl-resizer-border-color: #444;--vgl-resizer-border-width: 2px;position:relative;box-sizing:border-box;transition:height .2s ease}.vgl-item{position:absolute;box-sizing:border-box;transition:.2s ease;transition-property:left,top,right}.vgl-item--placeholder{z-index:var(--vgl-placeholder-z-index, 2);-webkit-user-select:none;-moz-user-select:none;user-select:none;background-color:var(--vgl-placeholder-bg, red);opacity:var(--vgl-placeholder-opacity, 20%);transition-duration:.1s}.vgl-item--no-touch{touch-action:none}.vgl-item--transform{right:auto;left:0;transition-property:transform}.vgl-item--transform.vgl-item--rtl{right:0;left:auto}.vgl-item--resizing{z-index:var(--vgl-item-resizing-z-index, 3);-webkit-user-select:none;-moz-user-select:none;user-select:none;opacity:var(--vgl-item-resizing-opacity, 60%)}.vgl-item--dragging{z-index:var(--vgl-item-dragging-z-index, 3);-webkit-user-select:none;-moz-user-select:none;user-select:none;opacity:var(--vgl-item-dragging-opacity, 100%);transition:none}.vgl-item__resizer{position:absolute;right:0;bottom:0;box-sizing:border-box;width:var(--vgl-resizer-size);height:var(--vgl-resizer-size);cursor:se-resize}.vgl-item__resizer:before{position:absolute;top:0;right:3px;bottom:3px;left:0;content:"";border:0 solid var(--vgl-resizer-border-color);border-right-width:var(--vgl-resizer-border-width);border-bottom-width:var(--vgl-resizer-border-width)}.vgl-item__resizer--rtl{right:auto;left:0;cursor:sw-resize}.vgl-item__resizer--rtl:before{top:0;right:0;bottom:3px;left:3px;border-right-width:0;border-bottom-width:var(--vgl-resizer-border-width);border-left-width:var(--vgl-resizer-border-width)}')), document.head.appendChild(e2);
      }
    } catch (r2) {
      console.error("vite-plugin-css-injected-by-js", r2);
    }
  })();
  const configs = {
    info: {
      level: "info",
      bgColor: "#3498db",
      textColor: "#ffffff"
    },
    warn: {
      level: "warn",
      bgColor: "#f39c12",
      textColor: "#ffffff"
    },
    error: {
      level: "error",
      bgColor: "#e74c3c",
      textColor: "#ffffff"
    },
    debug: {
      level: "debug",
      bgColor: "#613075",
      textColor: "#ffffff"
    }
  };
  function getCallerComponent() {
    const stack = new Error().stack;
    if (!stack) return "Unknown";
    const stackLines = stack.split("\n");
    for (let i2 = 0; i2 < stackLines.length; i2++) {
      const line = stackLines[i2];
      if (line.includes("logger.ts")) continue;
      const vueMatches = [
        line.match(/\(([^)]*\.vue[^:)]*)(?::\d+:\d+)?\)/),
line.match(/@([^)]*\.vue[^:)]*)(?::\d+:\d+)?/),
line.match(/(\w+\.vue)/),
line.match(/(\w+\.vue[?:])/)
];
      for (const match of vueMatches) {
        if (match) {
          const filePath = match[1];
          const fileName = filePath.split("/").pop()?.split("\\").pop() || filePath;
          const cleanFileName = fileName.split("?")[0].split(":")[0];
          const componentName = cleanFileName.replace(".vue", "");
          if (componentName) return componentName;
        }
      }
      if (line.includes("Object.") || line.includes("Array.") || line.includes("<anonymous>") || line.includes("eval")) continue;
      const functionMatch = line.match(/at\s+(?:async\s+)?([A-Z][a-zA-Z0-9_$]+)/);
      if (functionMatch) {
        const funcName = functionMatch[1];
        const skipList = ["Object", "Array", "Promise", "String", "Number", "Boolean", "Date", "RegExp", "Error", "Function"];
        if (!skipList.includes(funcName)) {
          return funcName;
        }
      }
    }
    return "Unknown";
  }
  function createLogger(componentName) {
    const log = (level, ...args) => {
      const caller = getCallerComponent();
      const config = configs[level];
      const header = `%cMCS ${caller}`;
      const message = args.length === 1 ? args[0] : args;
      console.log(
        header,
        `background: ${config.bgColor}; color: ${config.textColor}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
        message
      );
    };
    return {
      log,
      info: (...args) => log("info", ...args),
      warn: (...args) => log("warn", ...args),
      error: (...args) => log("error", ...args),
      debug: (...args) => log("debug", ...args)
    };
  }
  const logger = createLogger();
  const ATTRIBUTES = {
    LANG_SELECTED: "data-mgk-lang-selected",
    THEME: "data-mgk-theme"
  };
  const APP_SETTINGS = {
    ENVIRONMENT: "prod",
    DEFAULT_TIMEOUT: 15e3,
    DEFAULT_DECK_ID: "all"
  };
  const SELECTORS = {
    STATISTICS_ELEMENT: ".Statistic",
    TARGET_ELEMENT: ".UiPageLayout",
    MIGAKU_MAIN: ".MIGAKU-SRS",
    VUE_CONTAINER_ID: "migaku-custom-stats-vue-container",
    ERROR_CONTAINER_ID: "migaku-custom-stats-error",
    HEATMAP: ".Statistic__heatmap"
  };
  const ROUTES = {
    STATS_ROUTE: "/statistic"
  };
  const WORD_STATUS = {
    KNOWN: "KNOWN",
    LEARNING: "LEARNING",
    UNKNOWN: "UNKNOWN",
    IGNORED: "IGNORED"
  };
  const DB_CONFIG = {
    DB_NAME: "srs",
    OBJECT_STORE: "data"
  };
  const CHART_CONFIG = {
    FORECAST_DAYS: 30,
    START_YEAR: 2020,
    START_MONTH: 0,
    START_DAY: 1,
    CHART_LABELS: {
      KNOWN: "Known",
      LEARNING: "Learning",
      UNKNOWN: "Unknown",
      IGNORED: "Ignored"
    },
    TOOLTIP_CONFIG: {
      CORNER_RADIUS: 20,
      PADDING: 12,
      CARET_SIZE: 0,
      BOX_PADDING: 4
    },
    ANIMATION_DELAY: 250
  };
  const CHARACTER_STATS = {
    CHARACTER_REGEX: new RegExp("\\p{Unified_Ideograph}", "u"),
    CHARACTER_STATUS: {
      KNOWN: "KNOWN",
      LEARNING: "LEARNING",
      UNKNOWN: "UNKNOWN"
    }
  };
  function waitForElement(selector, timeout = APP_SETTINGS.DEFAULT_TIMEOUT) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((_2, obs) => {
        const element2 = document.querySelector(selector);
        if (element2) {
          logger.debug(`Element '${selector}' detected.`);
          obs.disconnect();
          resolve(element2);
        }
      });
      const element = document.querySelector(selector);
      if (element) {
        logger.debug(`Element '${selector}' found immediately.`);
        resolve(element);
        return;
      }
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        if (!document.querySelector(selector)) {
          observer.disconnect();
          logger.debug(`Element '${selector}' not found via MutationObserver after ${timeout}ms.`);
          resolve(null);
        }
      }, timeout);
    });
  }
  function setupThemeObserver(onThemeChange) {
    logger.debug("Setting up theme change observer");
    const themeObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === ATTRIBUTES.THEME) {
          const newTheme = document.documentElement.getAttribute(ATTRIBUTES.THEME);
          logger.debug(`Theme changed to: ${newTheme}`);
          onThemeChange(newTheme);
          break;
        }
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [ATTRIBUTES.THEME]
    });
    logger.debug("Theme change observer attached.");
    return themeObserver;
  }
  function setupLanguageObserver(mainElement, onLanguageChange) {
    logger.debug("Setting up language change observer.");
    const languageObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === ATTRIBUTES.LANG_SELECTED) {
          const newLanguage = mainElement.getAttribute(ATTRIBUTES.LANG_SELECTED);
          logger.debug(`Language attribute changed to: ${newLanguage}`);
          onLanguageChange(newLanguage);
          break;
        }
      }
    });
    languageObserver.observe(mainElement, {
      attributes: true,
      attributeFilter: [ATTRIBUTES.LANG_SELECTED]
    });
    logger.debug("Language change observer attached.");
    return languageObserver;
  }
  const STORAGE_KEY$9 = "migaku-app";
  const useAppStore = pinia.defineStore("app", () => {
    const language = vue.ref(null);
    const theme = vue.ref(null);
    const availableDecks = vue.ref([{ id: APP_SETTINGS.DEFAULT_DECK_ID, name: "All decks", lang: "all" }]);
    const selectedDeckId = vue.ref(APP_SETTINGS.DEFAULT_DECK_ID);
    const componentHash = vue.ref(null);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$9);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.language) language.value = data.language;
          if (data.theme) theme.value = data.theme;
          if (data.selectedDeckId) selectedDeckId.value = data.selectedDeckId;
          if (data.componentHash) componentHash.value = data.componentHash;
        }
      } catch (error) {
        console.error("Failed to load app state from localStorage:", error);
      }
    }
    function saveToStorage() {
      try {
        const data = {
          language: language.value,
          theme: theme.value,
          selectedDeckId: selectedDeckId.value,
          componentHash: componentHash.value
        };
        localStorage.setItem(STORAGE_KEY$9, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save app state to localStorage:", error);
      }
    }
    vue.watch([language, theme, selectedDeckId, componentHash], saveToStorage);
    function setLanguage(newLanguage) {
      language.value = newLanguage;
    }
    function setTheme(newTheme) {
      theme.value = newTheme;
    }
    function setSelectedDeckId(newDeckId) {
      selectedDeckId.value = newDeckId;
    }
    function setAvailableDecks(newAvailableDecks) {
      availableDecks.value = newAvailableDecks;
    }
    function setComponentHash(hash) {
      componentHash.value = hash;
    }
    function resetDeckSelection() {
      selectedDeckId.value = APP_SETTINGS.DEFAULT_DECK_ID;
    }
    return {
      language,
      theme,
      selectedDeckId,
      availableDecks,
      componentHash,
      setLanguage,
      setTheme,
      setSelectedDeckId,
      setAvailableDecks,
      setComponentHash,
      resetDeckSelection,
      loadFromStorage
    };
  });
  const STORAGE_KEY$8 = "migaku-cards";
  const DEFAULT_CARDS = [
    { id: "NativeStats", visible: true, item: { i: "NativeStats", x: 0, y: 0, w: 6, h: 17, minW: 6, maxW: 12, minH: 5, maxH: Infinity } },
    { id: "WordCount", visible: true, item: { i: "WordCount", x: 6, y: 0, w: 6, h: 5, minW: 4, maxW: 12, minH: 5, maxH: 8 } },
    { id: "CardsDue", visible: true, item: { i: "CardsDue", x: 6, y: 5, w: 6, h: 6, minW: 4, maxW: 12, minH: 5, maxH: 8 } },
    { id: "ReviewHistory", visible: true, item: { i: "ReviewHistory", x: 0, y: 17, w: 6, h: 6, minW: 4, maxW: 12, minH: 5, maxH: 8 } },
    { id: "ReviewIntervals", visible: true, item: { i: "ReviewIntervals", x: 6, y: 11, w: 6, h: 6, minW: 4, maxW: 12, minH: 5, maxH: 8 } },
    { id: "StudyStatistics", visible: true, item: { i: "StudyStatistics", x: 6, y: 17, w: 6, h: 16, minW: 4, maxW: 12, minH: 5, maxH: Infinity } },
    { id: "TimeChart", visible: true, item: { i: "TimeChart", x: 0, y: 23, w: 6, h: 6, minW: 4, maxW: 12, minH: 5, maxH: 8 } },
    { id: "KnownWordHistory", visible: true, item: { i: "KnownWordHistory", x: 0, y: 29, w: 6, h: 6, minW: 4, maxW: 12, minH: 5, maxH: 8 } },
    { id: "CharacterStats", visible: true, item: { i: "CharacterStats", x: 0, y: 34, w: 12, h: 14, minW: 6, maxW: 12, minH: 5, maxH: Infinity } }
  ];
  const useCardsStore = pinia.defineStore("cards", () => {
    const cards = vue.ref([...DEFAULT_CARDS]);
    const isMoveModeActive = vue.ref(false);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$8);
        if (stored) {
          const loaded = JSON.parse(stored);
          if (Array.isArray(loaded)) {
            const merged = loaded.map((userCard) => {
              const defaultCard = DEFAULT_CARDS.find((d2) => d2.id === userCard.id);
              if (defaultCard) {
                return {
                  ...defaultCard,
                  ...userCard,
                  item: {
                    ...defaultCard.item,
                    ...userCard.item || {}
                  }
                };
              } else {
                return userCard;
              }
            });
            for (const defaultCard of DEFAULT_CARDS) {
              if (!merged.some((c2) => c2.id === defaultCard.id)) {
                merged.push(defaultCard);
              }
            }
            cards.value = merged;
          }
        }
      } catch (error) {
        console.error("Failed to load cards from localStorage:", error);
      }
    }
    loadFromStorage();
    function saveToStorage() {
      try {
        const data = cards.value.map((card) => ({
          id: card.id,
          visible: card.visible,
          item: {
            i: card.item.i,
            x: card.item.x,
            y: card.item.y,
            w: card.item.w,
            h: card.item.h
          }
        }));
        localStorage.setItem(STORAGE_KEY$8, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save cards to localStorage:", error);
      }
    }
    function hideCard(id) {
      const card = cards.value.find((c2) => c2.id === id);
      if (card) card.visible = false;
    }
    function showCard(id) {
      const card = cards.value.find((c2) => c2.id === id);
      if (card) card.visible = true;
    }
    function toggleCardVisibility(id) {
      const card = cards.value.find((c2) => c2.id === id);
      if (card) card.visible = !card.visible;
    }
    function updateLayout(layoutArr) {
      for (const layoutItem of layoutArr) {
        const card = cards.value.find((c2) => c2.item.i === layoutItem.i);
        if (card) {
          card.item.x = layoutItem.x;
          card.item.y = layoutItem.y;
          card.item.w = layoutItem.w;
          card.item.h = layoutItem.h;
        }
      }
      saveToStorage();
    }
    const layout = vue.computed(
      () => cards.value.filter((card) => card.visible).map((card) => card.item)
    );
    function setMoveMode(value) {
      isMoveModeActive.value = value;
    }
    function ensureCard(id, opts) {
      let card = cards.value.find((c2) => c2.id === id);
      if (!card) {
        const minW = opts?.minW ?? 4;
        const minH = opts?.minH ?? 5;
        const w = opts?.w ?? opts?.defaultW ?? minW;
        const h2 = opts?.h ?? opts?.defaultH ?? minH;
        const x2 = opts?.x ?? 0;
        const y2 = opts?.y ?? 1e3;
        const item = {
          i: id,
          x: x2,
          y: y2,
          w,
          h: h2,
          minW,
          minH
        };
        card = { id, visible: true, item };
        cards.value.push(card);
      } else {
        card.visible = true;
        if (typeof opts?.minW === "number") card.item.minW = opts.minW;
        if (typeof opts?.minH === "number") card.item.minH = opts.minH;
      }
      saveToStorage();
    }
    return {
      cards,
      layout,
      isMoveModeActive,
      hideCard,
      showCard,
      toggleCardVisibility,
      loadFromStorage,
      updateLayout,
      setMoveMode,
      ensureCard
    };
  });
  const WORD_QUERY = `
  SELECT
      SUM(CASE WHEN knownStatus = '${WORD_STATUS.KNOWN}' THEN 1 ELSE 0 END) as known_count,
      SUM(CASE WHEN knownStatus = '${WORD_STATUS.LEARNING}' THEN 1 ELSE 0 END) as learning_count,
      SUM(CASE WHEN knownStatus = '${WORD_STATUS.UNKNOWN}' THEN 1 ELSE 0 END) as unknown_count,
      SUM(CASE WHEN knownStatus = '${WORD_STATUS.IGNORED}' THEN 1 ELSE 0 END) as ignored_count
  FROM WordList
  WHERE language = ? AND del = 0`;
  const WORD_QUERY_WITH_DECK = `
  SELECT
    SUM(CASE WHEN w.knownStatus = '${WORD_STATUS.KNOWN}' THEN 1 ELSE 0 END) as known_count,
    SUM(CASE WHEN w.knownStatus = '${WORD_STATUS.LEARNING}' THEN 1 ELSE 0 END) as learning_count,
    SUM(CASE WHEN w.knownStatus = '${WORD_STATUS.UNKNOWN}' THEN 1 ELSE 0 END) as unknown_count,
    SUM(CASE WHEN w.knownStatus = '${WORD_STATUS.IGNORED}' THEN 1 ELSE 0 END) as ignored_count
  FROM (
    SELECT DISTINCT w.dictForm, w.knownStatus
    FROM WordList w
    JOIN CardWordRelation cwr ON w.dictForm = cwr.dictForm
    JOIN card c ON cwr.cardId = c.id
    JOIN deck d ON c.deckId = d.id
    WHERE w.language = ? AND w.del = 0 AND d.id = ? AND c.del = 0
  ) as w`;
  const WORDS_BY_STATUS_QUERY = `
  SELECT dictForm
  FROM WordList
  WHERE language = ? AND knownStatus = ? AND del = 0`;
  const KANJI_BY_JLPT_QUERY = `
  SELECT character, jlpt AS level
  FROM characters
  WHERE jlpt IS NOT NULL
  ORDER BY jlpt DESC`;
  const KANJI_BY_KANKEN_QUERY = `
  SELECT character, kanken AS level
  FROM characters
  WHERE kanken IS NOT NULL
  ORDER BY kanken DESC`;
  const KANJI_BY_JOYO_QUERY = `
  SELECT character, frequency_rank AS level
  FROM characters
  WHERE grade <= 8
  ORDER BY frequency_rank ASC`;
  const DECKS_QUERY = `
  SELECT id, name, lang 
  FROM deck 
  WHERE del = 0
  ORDER BY name;`;
  const DUE_QUERY = `
  SELECT
    due,
    CASE
      WHEN c.interval < 20 THEN 'learning'
      ELSE 'known'
    END as interval_range,
    COUNT(*) as count
  FROM card c
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND c.due BETWEEN ? AND ? AND c.del = 0`;
  const INTERVAL_QUERY = `
  SELECT
    ROUND(interval) as interval_group,
    COUNT(*) as count
  FROM card c
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND c.del = 0 AND c.interval > 0
  GROUP BY interval_group
  ORDER BY interval_group`;
  const REVIEW_HISTORY_QUERY = `
  SELECT 
    r.day,
    r.type,
    COUNT(DISTINCT r.cardId) as review_count
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  JOIN reviewHistory rh ON r.day = rh.day
  WHERE ct.lang = ? AND r.day >= ? AND r.del = 0
  GROUP BY r.day, r.type
  ORDER BY r.day DESC, r.type`;
  const STUDY_STATS_QUERY = `
  SELECT 
    COUNT(DISTINCT r.day) as days_studied,
    COUNT(*) as total_reviews
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0`;
  const CURRENT_DATE_QUERY = `
  SELECT entry 
  FROM keyValue
  WHERE key = 'study.activeDay.currentDate';`;
  const PASS_RATE_QUERY = `
  SELECT 
    SUM(CASE WHEN r.type = 2 THEN 1 ELSE 0 END) as successful_reviews,
    SUM(CASE WHEN r.type = 1 THEN 1 ELSE 0 END) as failed_reviews
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0 AND r.type IN (1, 2);`;
  const NEW_CARDS_QUERY = `
  SELECT 
    COUNT(DISTINCT r.cardId) as new_cards_reviewed
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0 AND r.type = 0;`;
  const CARDS_ADDED_QUERY = `
  SELECT 
    COUNT(*) as cards_added
  FROM card c
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND c.created >= ? AND c.created <= ? AND c.del = 0 AND c.lessonId = '';`;
  const CARDS_LEARNED_QUERY = `
  SELECT 
    COUNT(DISTINCT c.id) as cards_learned
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0 
    AND c.interval >= 20 AND r.interval < 20 AND r.type = 2;`;
  const TOTAL_NEW_CARDS_QUERY = `
  SELECT 
    COUNT(DISTINCT r.cardId) as total_new_cards
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND c.del = 0 AND r.del = 0 AND r.type = 0;`;
  const CARDS_LEARNED_PER_DAY_QUERY = `
  SELECT 
    ROUND(COUNT(DISTINCT c.id) * 1.0 / NULLIF(COUNT(DISTINCT r.day), 0), 1) as cards_learned_per_day
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0 
    AND c.interval >= 20 AND r.interval < 20 AND r.type = 2;`;
  const NEW_CARDS_TIME_QUERY = `
  SELECT 
    SUM(r.duration) as total_time_seconds,
    COUNT(*) as review_count,
    ROUND(AVG(r.duration), 1) as avg_time_seconds
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0 AND r.type = 0;`;
  const REVIEWS_TIME_QUERY = `
  SELECT 
    SUM(r.duration) as total_time_seconds,
    COUNT(*) as review_count,
    ROUND(AVG(r.duration), 1) as avg_time_seconds
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  WHERE ct.lang = ? AND r.day BETWEEN ? AND ? AND r.del = 0 AND r.type IN (1, 2);`;
  const TIME_HISTORY_QUERY = `
  SELECT 
    r.day,
    CASE 
      WHEN r.type = 0 THEN 'new_cards'
      WHEN r.type IN (1, 2) THEN 'reviews'
      ELSE 'other'
    END as review_type,
    SUM(r.duration) as total_time_seconds,
    ROUND(AVG(r.duration), 1) as avg_time_seconds,
    COUNT(*) as review_count
  FROM review r
  JOIN card c ON r.cardId = c.id
  JOIN card_type ct ON c.cardTypeId = ct.id
  JOIN reviewHistory rh ON r.day = rh.day
  WHERE ct.lang = ? AND r.day >= ? AND r.del = 0 AND r.type IN (0, 1, 2)
  GROUP BY r.day, review_type
  ORDER BY r.day DESC, review_type`;
  const WORD_HISTORY_QUERY = `
  SELECT 
    wh.day,
    wh.dictForm,
    wh.secondary,
    wh.partOfSpeech,
    wh.knownStatus,
    wh.prevKnownStatus
  FROM wordHistory wh
  WHERE wh.language = ? AND wh.day >= ? AND wh.del = 0
  ORDER BY wh.day ASC, wh.dictForm, wh.secondary, wh.partOfSpeech`;
  const WORD_HISTORY_QUERY_WITH_DECK = `
  SELECT DISTINCT
    wh.day,
    wh.dictForm,
    wh.secondary,
    wh.partOfSpeech,
    wh.knownStatus,
    wh.prevKnownStatus
  FROM wordHistory wh
  JOIN CardWordRelation cwr ON wh.dictForm = cwr.dictForm
  JOIN card c ON cwr.cardId = c.id
  JOIN deck d ON c.deckId = d.id
  WHERE wh.language = ? AND wh.day >= ? AND wh.del = 0 AND d.id = ? AND c.del = 0
  ORDER BY wh.day ASC, wh.dictForm, wh.secondary, wh.partOfSpeech`;
  const dbState = {
    sql: null,
    db: null,
    isLoading: false,
    error: null
  };
  function initDB() {
    return new Promise((resolve, reject) => {
      logger.debug(`Opening IndexedDB: ${DB_CONFIG.DB_NAME}`);
      const request = indexedDB.open(DB_CONFIG.DB_NAME);
      request.onerror = (event) => {
        const error = event.target.error;
        logger.error(`IndexedDB error: ${error?.message}`);
        reject(new Error(`IndexedDB error: ${error?.message}`));
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        logger.debug(`Connected to IndexedDB: ${DB_CONFIG.DB_NAME}`);
        resolve(db);
      };
      request.onupgradeneeded = () => {
        logger.warn("Database upgrade needed (or first time setup)");
      };
    });
  }
  function decompressData(compressedData) {
    try {
      logger.debug("Attempting Gzip decompression...");
      const decompressedData = pako.inflate(compressedData);
      logger.debug("Decompression successful");
      return decompressedData;
    } catch (err) {
      logger.error("Gzip decompression failed:", err);
      return null;
    }
  }
  async function initializeSqlEngine$1() {
    try {
      if (dbState.sql) {
        logger.debug("Using existing SQL.js instance");
        return dbState.sql;
      }
      logger.debug("Initializing SQL.js...");
      const SQL = await initSqlJs({
        locateFile: (file) => {
          logger.debug(`Locating file: ${file}`);
          if (file.endsWith(".wasm")) {
            return "https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.wasm";
          }
          return file;
        }
      });
      if (!SQL) {
        throw new Error("SQL.js initialization returned null");
      }
      logger.debug("SQL.js initialized successfully");
      dbState.sql = SQL;
      return SQL;
    } catch (err) {
      logger.error("Failed to initialize SQL.js:", err);
      return null;
    }
  }
  async function loadDatabase() {
    try {
      if (dbState.db) {
        logger.debug("Using existing database instance");
        return dbState.db;
      }
      if (dbState.isLoading) {
        logger.debug("Database already loading, waiting...");
        let attempts = 0;
        while (dbState.isLoading && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        return dbState.db;
      }
      dbState.isLoading = true;
      dbState.error = null;
      const idb = await initDB();
      if (!idb.objectStoreNames.contains(DB_CONFIG.OBJECT_STORE)) {
        const error = `Object store "${DB_CONFIG.OBJECT_STORE}" not found in database "${DB_CONFIG.DB_NAME}"`;
        logger.error(error);
        logger.error(`Available stores: ${Array.from(idb.objectStoreNames).join(", ")}`);
        dbState.error = error;
        dbState.isLoading = false;
        return null;
      }
      const data = await new Promise((resolve, reject) => {
        const transaction = idb.transaction([DB_CONFIG.OBJECT_STORE], "readonly");
        const objectStore = transaction.objectStore(DB_CONFIG.OBJECT_STORE);
        const getAllRequest = objectStore.getAll();
        transaction.oncomplete = () => {
          logger.debug("Read transaction completed");
        };
        transaction.onerror = (event) => {
          const error = event.target.error;
          logger.error("Read transaction error:", error);
          reject(error);
        };
        getAllRequest.onsuccess = (event) => {
          const allRecords = event.target.result;
          logger.debug(`Retrieved ${allRecords.length} records from ${DB_CONFIG.OBJECT_STORE}`);
          if (!allRecords || allRecords.length === 0 || !allRecords[0]?.data || !(allRecords[0].data instanceof Uint8Array)) {
            reject(new Error("Invalid data structure in IndexedDB"));
            return;
          }
          resolve(allRecords[0].data);
        };
        getAllRequest.onerror = (event) => {
          const error = event.target.error;
          logger.error("Error getting record:", error);
          reject(error);
        };
      });
      const decompressedData = decompressData(data);
      if (!decompressedData) {
        dbState.error = "Failed to decompress database data";
        dbState.isLoading = false;
        return null;
      }
      const SQL = await initializeSqlEngine$1();
      if (!SQL) {
        dbState.error = "Failed to initialize SQL.js";
        dbState.isLoading = false;
        return null;
      }
      logger.debug("Loading database into SQL.js...");
      const db = new SQL.Database(decompressedData);
      logger.debug("Database loaded successfully");
      dbState.db = db;
      dbState.isLoading = false;
      return db;
    } catch (err) {
      logger.error("Failed to load database:", err);
      dbState.error = err instanceof Error ? err.message : "Unknown error";
      dbState.isLoading = false;
      return null;
    }
  }
  function clearDatabaseCache() {
    logger.debug("Clearing database cache");
    if (dbState.db) {
      try {
        dbState.db.close();
      } catch (err) {
        logger.warn("Error closing database:", err);
      }
      dbState.db = null;
    }
  }
  async function reloadDatabase() {
    logger.debug("Reloading database from IndexedDB");
    clearDatabaseCache();
    return loadDatabase();
  }
  async function fetchAvailableDecks() {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      const decks = [{ id: APP_SETTINGS.DEFAULT_DECK_ID, name: "All decks", lang: "all" }];
      const decksResult = db.exec(DECKS_QUERY);
      if (decksResult.length > 0 && decksResult[0].values.length > 0) {
        decksResult[0].values.forEach((row) => {
          decks.push({ id: String(row[0]), name: String(row[1]), lang: String(row[2]) });
        });
      }
      logger.debug("Available decks:", decks);
      return decks;
    } catch (error) {
      logger.error("Error fetching available decks:", error);
      return null;
    }
  }
  async function fetchWordStats(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID) {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      logger.debug(`Fetching word stats for language: ${language}, deck: ${deckId}`);
      const useDeckFilter = deckId !== APP_SETTINGS.DEFAULT_DECK_ID;
      const wordQuery = useDeckFilter ? WORD_QUERY_WITH_DECK : WORD_QUERY;
      const wordQueryParams = useDeckFilter ? [language, deckId] : [language];
      const wordResults = db.exec(wordQuery, wordQueryParams);
      if (wordResults.length > 0 && wordResults[0].values.length > 0) {
        logger.debug("Word query results:", wordResults);
        const numberOfResults = wordResults[0].values[0].length;
        const wordValues = {};
        for (let i2 = 0; i2 < numberOfResults; i2++) {
          wordValues[wordResults[0].columns[i2]] = wordResults[0].values[0][i2];
        }
        logger.debug("Word stats:", wordValues);
        return wordValues;
      } else {
        logger.warn("Word query returned no results");
        return null;
      }
    } catch (error) {
      logger.error("Error fetching word stats:", error);
      return null;
    }
  }
  async function fetchCharacterStats(language) {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      logger.debug(`Fetching character stats for language: ${language}`);
      const knownCharactersSet = new Set();
      const learningCharactersSet = new Set();
      const knownResults = db.exec(WORDS_BY_STATUS_QUERY, [language, CHARACTER_STATS.CHARACTER_STATUS.KNOWN]);
      if (knownResults.length > 0 && knownResults[0].values.length > 0) {
        logger.debug("Known words count:", knownResults[0].values.length);
        knownResults[0].values.forEach((row) => {
          const dictForm = row[0];
          for (const char of dictForm) {
            if (CHARACTER_STATS.CHARACTER_REGEX.test(char)) {
              knownCharactersSet.add(char);
            }
          }
        });
      }
      const learningResults = db.exec(WORDS_BY_STATUS_QUERY, [language, CHARACTER_STATS.CHARACTER_STATUS.LEARNING]);
      if (learningResults.length > 0 && learningResults[0].values.length > 0) {
        logger.debug("Learning words count:", learningResults[0].values.length);
        learningResults[0].values.forEach((row) => {
          const dictForm = row[0];
          for (const char of dictForm) {
            if (CHARACTER_STATS.CHARACTER_REGEX.test(char) && !knownCharactersSet.has(char)) {
              learningCharactersSet.add(char);
            }
          }
        });
      }
      const knownCharacters = Array.from(knownCharactersSet);
      const learningCharacters = Array.from(learningCharactersSet);
      logger.debug("Character stats:", { knownCount: knownCharacters.length, learningCount: learningCharacters.length });
      return { knownCharacters, learningCharacters };
    } catch (error) {
      logger.error("Error fetching character stats:", error);
      return null;
    }
  }
  async function fetchDueStats(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID, periodId = "1 Month") {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      let currentDayNumber = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      try {
        const dateResult = db.exec(CURRENT_DATE_QUERY);
        if (dateResult.length > 0 && dateResult[0].values.length > 0 && dateResult[0].values[0][0]) {
          currentDate = new Date(dateResult[0].values[0][0] + "T00:00:00");
          currentDate.setHours(0, 0, 0, 0);
        }
      } catch (err) {
        logger.warn("Could not load study.activeDay.currentDate; using system date", err);
      }
      const chartStartDate = new Date(2020, 0, 1, 0, 0, 0, 0);
      currentDayNumber = Math.floor((currentDate.getTime() - chartStartDate.getTime()) / (1e3 * 60 * 60 * 24));
      let forecastDays;
      let endDayNumber;
      if (periodId === "All time") {
        forecastDays = 3650;
        let maxDueQuery = `SELECT MAX(due) as maxDue FROM card c
                          JOIN card_type ct ON c.cardTypeId = ct.id
                          WHERE ct.lang = ? AND c.due >= ? AND c.del = 0`;
        const maxDueParams = [language, currentDayNumber];
        if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
          maxDueQuery += " AND c.deckId = ?";
          maxDueParams.push(deckId);
        }
        let maxDue = null;
        try {
          const maxDueResults = db.exec(maxDueQuery, maxDueParams);
          if (maxDueResults.length > 0 && maxDueResults[0].values.length > 0 && maxDueResults[0].values[0][0] !== null) {
            maxDue = Number(maxDueResults[0].values[0][0]);
          }
        } catch (err) {
          logger.warn("MAX(due) query failed, falling back to default range", err);
        }
        endDayNumber = typeof maxDue === "number" ? maxDue : currentDayNumber + forecastDays - 1;
      } else if (periodId === "1 Year") {
        const endDate = new Date(currentDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        forecastDays = Math.max(1, Math.round((endDate.getTime() - currentDate.getTime()) / (1e3 * 60 * 60 * 24)));
        endDayNumber = currentDayNumber + (forecastDays - 1);
      } else {
        const months = parseInt(periodId.replace(" Months", "").replace("Month", "").replace("Months", ""), 10) || 1;
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + months);
        forecastDays = Math.max(1, Math.round((endDate.getTime() - currentDate.getTime()) / (1e3 * 60 * 60 * 24)));
        endDayNumber = currentDayNumber + (forecastDays - 1);
      }
      const actualForecastDays = endDayNumber - currentDayNumber + 1;
      let dueQuery = DUE_QUERY;
      const params = [language, currentDayNumber, endDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        dueQuery += " AND c.deckId = ?";
        params.push(deckId);
      }
      dueQuery += " GROUP BY due, interval_range ORDER BY due";
      const dueResults = db.exec(dueQuery, params);
      const labels = [];
      const knownCounts = new Array(actualForecastDays).fill(0);
      const learningCounts = new Array(actualForecastDays).fill(0);
      const counts = new Array(actualForecastDays).fill(0);
      let d2 = new Date(currentDate);
      d2.setDate(d2.getDate() - 0);
      for (let i2 = 0; i2 < actualForecastDays; i2++) {
        labels.push(d2.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }));
        d2.setDate(d2.getDate() + 1);
      }
      if (dueResults.length > 0 && dueResults[0].values.length > 0) {
        dueResults[0].values.forEach((row) => {
          const due = row[0];
          const intervalRange = row[1];
          const count = row[2];
          const dayIndex = due - currentDayNumber;
          if (dayIndex >= 0 && dayIndex < actualForecastDays) {
            if (intervalRange === "learning") learningCounts[dayIndex] += count;
            else if (intervalRange === "known") knownCounts[dayIndex] += count;
            counts[dayIndex] += count;
          }
        });
      }
      if (periodId === "All time") {
        let lastNonZeroIndex = counts.length - 1;
        while (lastNonZeroIndex >= 0 && counts[lastNonZeroIndex] === 0) {
          lastNonZeroIndex--;
        }
        const extraDays = 5;
        lastNonZeroIndex = Math.min(lastNonZeroIndex + extraDays, counts.length - 1);
        if (lastNonZeroIndex >= 0) {
          labels.splice(lastNonZeroIndex + 1);
          learningCounts.splice(lastNonZeroIndex + 1);
          knownCounts.splice(lastNonZeroIndex + 1);
          counts.splice(lastNonZeroIndex + 1);
        }
      }
      return { labels, counts, knownCounts, learningCounts };
    } catch (error) {
      logger.error("Error fetching due stats:", error);
      return null;
    }
  }
  async function fetchIntervalStats(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID, percentileId = "75th") {
    try {
      const db = await loadDatabase();
      if (!db) return null;
      let intervalQuery = INTERVAL_QUERY;
      const params = [language];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        intervalQuery = intervalQuery.replace(
          "WHERE ct.lang = ? AND c.del = 0 AND c.interval > 0",
          "WHERE ct.lang = ? AND c.del = 0 AND c.interval > 0 AND c.deckId = ?"
        );
        params.push(deckId);
      }
      const results = db.exec(intervalQuery, params);
      if (results.length === 0 || results[0].values.length === 0) return null;
      const intervalMap = new Map();
      let maxInterval = 0;
      let totalCards = 0;
      for (const row of results[0].values) {
        const interval = Math.round(Number(row[0]));
        const count = Number(row[1]);
        intervalMap.set(interval, count);
        maxInterval = Math.max(maxInterval, interval);
        totalCards += count;
      }
      const percentileNum = parseInt(percentileId.replace("th", ""), 10);
      const cutoffPercentile = isFinite(percentileNum) ? percentileNum / 100 : 0.75;
      let cumulativeCount = 0;
      let cutoffInterval = maxInterval;
      const sortedIntervals = Array.from(intervalMap.keys()).sort((a2, b2) => a2 - b2);
      for (const interval of sortedIntervals) {
        cumulativeCount += intervalMap.get(interval) || 0;
        const pc = totalCards > 0 ? cumulativeCount / totalCards : 1;
        if (pc >= cutoffPercentile) {
          cutoffInterval = interval;
          break;
        }
      }
      const labels = [];
      const counts = [];
      for (let i2 = 1; i2 <= cutoffInterval; i2++) {
        labels.push(i2 === 1 ? "1 day" : `${i2} days`);
        counts.push(intervalMap.get(i2) ?? 0);
      }
      return { labels, counts };
    } catch (error) {
      logger.error("Error fetching interval stats:", error);
      return null;
    }
  }
  async function fetchStudyStats(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID, periodId = "1 Month") {
    try {
      const db = await loadDatabase();
      if (!db) return null;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const startDate = new Date(CHART_CONFIG.START_YEAR, CHART_CONFIG.START_MONTH, CHART_CONFIG.START_DAY);
      let currentDayNumber = Math.floor((currentDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
      let periodDays;
      let startDayNumber;
      let earliestReviewDayForAllTime = null;
      if (periodId === "All time") {
        let earliestReviewQuery = `SELECT MIN(r.day) as minDay FROM review r JOIN card c ON r.cardId = c.id JOIN card_type ct ON c.cardTypeId = ct.id WHERE ct.lang = ? AND r.del = 0`;
        const earliestParams = [language];
        if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
          earliestReviewQuery += " AND c.deckId = ?";
          earliestParams.push(deckId);
        }
        const earliestRes = db.exec(earliestReviewQuery, earliestParams);
        if (earliestRes.length > 0 && earliestRes[0].values.length > 0 && earliestRes[0].values[0][0] !== null) {
          earliestReviewDayForAllTime = Number(earliestRes[0].values[0][0]);
          periodDays = currentDayNumber - earliestReviewDayForAllTime + 1;
          startDayNumber = earliestReviewDayForAllTime;
        } else {
          periodDays = currentDayNumber + 1;
          startDayNumber = 0;
        }
      } else {
        const months = periodId.includes("Year") ? parseInt(periodId.replace(" Year", "").replace("Years", ""), 10) * 12 || 12 : parseInt(periodId.replace(" Months", "").replace("Month", "").replace("Months", ""), 10) || 1;
        const today = new Date(startDate);
        today.setDate(today.getDate() + currentDayNumber);
        const periodStartDate = new Date(today);
        periodStartDate.setMonth(today.getMonth() - months);
        periodDays = Math.round((today.getTime() - periodStartDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
        startDayNumber = currentDayNumber - periodDays + 1;
      }
      let studyQuery = STUDY_STATS_QUERY;
      let studyParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        studyQuery = studyQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        studyParams.push(deckId);
      }
      let passRateQuery = PASS_RATE_QUERY;
      let passRateParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        passRateQuery = passRateQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        passRateParams.push(deckId);
      }
      let newCardsQuery = NEW_CARDS_QUERY;
      let newCardsParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        newCardsQuery = newCardsQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        newCardsParams.push(deckId);
      }
      let cardsAddedQuery = CARDS_ADDED_QUERY;
      const startDayDate = new Date(startDate);
      startDayDate.setDate(startDate.getDate() + startDayNumber);
      startDayDate.setHours(0, 0, 0, 0);
      let cardsAddedParams = [language, startDayDate.getTime(), ( new Date()).getTime()];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        cardsAddedQuery = cardsAddedQuery.replace("AND c.del = 0", "AND c.deckId = ? AND c.del = 0");
        cardsAddedParams.push(deckId);
      }
      let cardsLearnedQuery = CARDS_LEARNED_QUERY;
      let cardsLearnedParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        cardsLearnedQuery = cardsLearnedQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        cardsLearnedParams.push(deckId);
      }
      let totalNewCardsQuery = TOTAL_NEW_CARDS_QUERY;
      let totalNewCardsParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        totalNewCardsQuery = totalNewCardsQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        totalNewCardsParams.push(deckId);
      }
      let cardsLearnedPerDayQuery = CARDS_LEARNED_PER_DAY_QUERY;
      let cardsLearnedPerDayParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        cardsLearnedPerDayQuery = cardsLearnedPerDayQuery.replace("AND c.interval >= 20", "AND c.deckId = ? AND c.interval >= 20");
        cardsLearnedPerDayParams.push(deckId);
      }
      let newCardsTimeQuery = NEW_CARDS_TIME_QUERY;
      let newCardsTimeParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        newCardsTimeQuery = newCardsTimeQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        newCardsTimeParams.push(deckId);
      }
      let reviewsTimeQuery = REVIEWS_TIME_QUERY;
      let reviewsTimeParams = [language, startDayNumber, currentDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        reviewsTimeQuery = reviewsTimeQuery.replace("AND r.del = 0", "AND c.deckId = ? AND r.del = 0");
        reviewsTimeParams.push(deckId);
      }
      const studyResults = db.exec(studyQuery, studyParams);
      const passRateResults = db.exec(passRateQuery, passRateParams);
      const newCardsResults = db.exec(newCardsQuery, newCardsParams);
      const cardsAddedResults = db.exec(cardsAddedQuery, cardsAddedParams);
      const cardsLearnedResults = db.exec(cardsLearnedQuery, cardsLearnedParams);
      const totalNewCardsResults = db.exec(totalNewCardsQuery, totalNewCardsParams);
      const cardsLearnedPerDayResults = db.exec(cardsLearnedPerDayQuery, cardsLearnedPerDayParams);
      const newCardsTimeResults = db.exec(newCardsTimeQuery, newCardsTimeParams);
      const reviewsTimeResults = db.exec(reviewsTimeQuery, reviewsTimeParams);
      const days_studied = Number(studyResults?.[0]?.values?.[0]?.[0] ?? 0);
      const total_reviews = Number(studyResults?.[0]?.values?.[0]?.[1] ?? 0);
      let denominator;
      if (periodId === "All time" && days_studied > 0 && earliestReviewDayForAllTime !== null) {
        denominator = currentDayNumber - earliestReviewDayForAllTime + 1;
      } else {
        denominator = Math.max(1, periodDays);
      }
      const days_studied_percent = Math.round(days_studied / denominator * 100);
      let pass_rate = 0;
      if (passRateResults?.[0]?.values?.length) {
        const successful_reviews = Number(passRateResults[0].values[0][0] ?? 0);
        const failed_reviews = Number(passRateResults[0].values[0][1] ?? 0);
        const total_answered = successful_reviews + failed_reviews;
        pass_rate = total_answered > 0 ? Math.round((successful_reviews - failed_reviews) / successful_reviews * 100) : 0;
      }
      const new_cards_reviewed = Number(newCardsResults?.[0]?.values?.[0]?.[0] ?? 0);
      const new_cards_per_day = Math.round(new_cards_reviewed / Math.max(1, periodDays) * 10) / 10;
      const total_cards_added = Number(cardsAddedResults?.[0]?.values?.[0]?.[0] ?? 0);
      const cards_added_per_day = total_cards_added > 0 ? Math.round(total_cards_added / Math.max(1, periodDays) * 10) / 10 : 0;
      const total_cards_learned = Number(cardsLearnedResults?.[0]?.values?.[0]?.[0] ?? 0);
      const total_new_cards = Number(totalNewCardsResults?.[0]?.values?.[0]?.[0] ?? 0);
      const cards_learned_per_day = Number(cardsLearnedPerDayResults?.[0]?.values?.[0]?.[0] ?? 0);
      const avg_reviews_per_calendar_day = total_reviews > 0 ? Math.round(total_reviews / Math.max(1, periodDays) * 10) / 10 : 0;
      const total_time_new_cards_seconds = Number(newCardsTimeResults?.[0]?.values?.[0]?.[0] ?? 0);
      const avg_time_new_card_seconds = Number(newCardsTimeResults?.[0]?.values?.[0]?.[2] ?? 0);
      const total_time_reviews_seconds = Number(reviewsTimeResults?.[0]?.values?.[0]?.[0] ?? 0);
      const avg_time_review_seconds = Number(reviewsTimeResults?.[0]?.values?.[0]?.[2] ?? 0);
      return {
        days_studied,
        days_studied_percent,
        total_reviews,
        avg_reviews_per_calendar_day,
        period_days: periodDays,
        pass_rate,
        new_cards_per_day,
        total_new_cards,
        total_cards_added,
        cards_added_per_day,
        total_cards_learned,
        cards_learned_per_day,
        total_time_new_cards_seconds,
        avg_time_new_card_seconds,
        total_time_reviews_seconds,
        avg_time_review_seconds
      };
    } catch (error) {
      logger.error("Error fetching study stats:", error);
      return null;
    }
  }
  async function fetchReviewHistory(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID, periodId = "1 Month", grouping = "Days") {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let currentDayNumber = Math.floor(
        (currentDate.getTime() - new Date(
          CHART_CONFIG.START_YEAR,
          CHART_CONFIG.START_MONTH,
          CHART_CONFIG.START_DAY
        ).getTime()) / (1e3 * 60 * 60 * 24)
      );
      let period;
      if (periodId === "All time") {
        period = "All";
      } else if (periodId === "1 Year") {
        period = 12;
      } else {
        period = periodId.replace(" Months", "").replace("Months", "");
      }
      let periodDays;
      if (period === "All") {
        periodDays = currentDayNumber;
      } else {
        const periodMonths = typeof period === "number" ? period : parseInt(period, 10) || 1;
        const periodStartDate = new Date(currentDate);
        periodStartDate.setMonth(currentDate.getMonth() - periodMonths);
        periodDays = Math.round((currentDate.getTime() - periodStartDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
      }
      const periodDaysAgoDayNumber = currentDayNumber - periodDays;
      let reviewQuery = REVIEW_HISTORY_QUERY;
      let reviewQueryParams = [language, periodDaysAgoDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        reviewQuery = reviewQuery.replace(
          "WHERE ct.lang = ? AND r.day >= ? AND r.del = 0",
          "WHERE ct.lang = ? AND r.day >= ? AND r.del = 0 AND c.deckId = ?"
        );
        reviewQueryParams.push(deckId);
      }
      const reviewResults = db.exec(reviewQuery, reviewQueryParams);
      const dateLabels = [];
      const type0Counts = [];
      const type1Counts = [];
      const type2Counts = [];
      const dayMap = new Map();
      const aggregateMap = new Map();
      let actualPeriodDays = periodDays;
      if (period === "All" && reviewResults.length > 0 && reviewResults[0].values.length > 0) {
        let earliestDayWithReviews = currentDayNumber;
        reviewResults[0].values.forEach((row) => {
          const dayNumber = Number(row[0]) ?? 0;
          earliestDayWithReviews = Math.min(earliestDayWithReviews, dayNumber);
        });
        const daysWithData = currentDayNumber - earliestDayWithReviews + 1;
        actualPeriodDays = Math.min(periodDays, daysWithData);
      }
      let currentGroupKey = null;
      let groupIndex = -1;
      const startDate = new Date(CHART_CONFIG.START_YEAR, CHART_CONFIG.START_MONTH, CHART_CONFIG.START_DAY);
      for (let i2 = 0; i2 < actualPeriodDays; i2++) {
        const dayNumber = currentDayNumber - (actualPeriodDays - 1 - i2);
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayNumber);
        date.setHours(0, 0, 0, 0);
        let displayDate;
        let groupKey;
        if (grouping === "Weeks") {
          const dayOfWeek = (date.getDay() + 6) % 7;
          const weekStartDate = new Date(date);
          weekStartDate.setDate(date.getDate() - dayOfWeek);
          groupKey = weekStartDate.toISOString().split("T")[0];
          if (groupKey !== currentGroupKey) {
            displayDate = "Week of " + weekStartDate.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
            dateLabels.push(displayDate);
            type0Counts.push(0);
            type1Counts.push(0);
            type2Counts.push(0);
            currentGroupKey = groupKey;
            groupIndex++;
            aggregateMap.set(groupKey, { index: groupIndex, data: [0, 0, 0] });
          }
        } else if (grouping === "Months") {
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (groupKey !== currentGroupKey) {
            displayDate = date.toLocaleDateString(void 0, { month: "short", year: "numeric" });
            dateLabels.push(displayDate);
            type0Counts.push(0);
            type1Counts.push(0);
            type2Counts.push(0);
            currentGroupKey = groupKey;
            groupIndex++;
            aggregateMap.set(groupKey, { index: groupIndex, data: [0, 0, 0] });
          }
        } else {
          groupKey = dayNumber;
          displayDate = date.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
          dateLabels.push(displayDate);
          type0Counts.push(0);
          type1Counts.push(0);
          type2Counts.push(0);
          dayMap.set(dayNumber, { index: i2 });
        }
      }
      if (reviewResults.length > 0 && reviewResults[0].values.length > 0) {
        reviewResults[0].values.forEach((row) => {
          const dayNumber = typeof row[0] === "number" ? row[0] : Number(row[0]) ?? 0;
          const reviewType = typeof row[1] === "number" ? row[1] : Number(row[1]) ?? 0;
          const count = typeof row[2] === "number" ? row[2] : Number(row[2]) ?? 0;
          const date = new Date(startDate);
          date.setDate(date.getDate() + dayNumber);
          date.setHours(0, 0, 0, 0);
          let targetIndex = -1;
          let targetMapEntry = void 0;
          if (grouping === "Weeks") {
            const dayOfWeek = (date.getDay() + 6) % 7;
            const weekStartDate = new Date(date);
            weekStartDate.setDate(date.getDate() - dayOfWeek);
            const groupKey = weekStartDate.toISOString().split("T")[0];
            if (aggregateMap.has(groupKey)) {
              targetMapEntry = aggregateMap.get(groupKey);
              targetIndex = targetMapEntry?.index ?? -1;
            }
          } else if (grouping === "Months") {
            const groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (aggregateMap.has(groupKey)) {
              targetMapEntry = aggregateMap.get(groupKey);
              targetIndex = targetMapEntry?.index ?? -1;
            }
          } else {
            if (dayMap.has(dayNumber)) {
              targetIndex = dayMap.get(dayNumber)?.index ?? -1;
            }
          }
          if (targetIndex !== -1) {
            if (reviewType === 0) {
              if (grouping === "Days") type0Counts[targetIndex] += count;
              else if (targetMapEntry) targetMapEntry.data[0] += count;
            } else if (reviewType === 1) {
              if (grouping === "Days") type1Counts[targetIndex] += count;
              else if (targetMapEntry) targetMapEntry.data[1] += count;
            } else if (reviewType === 2) {
              if (grouping === "Days") type2Counts[targetIndex] += count;
              else if (targetMapEntry) targetMapEntry.data[2] += count;
            }
          }
        });
        if (grouping === "Weeks" || grouping === "Months") {
          aggregateMap.forEach((entry) => {
            type0Counts[entry.index] = entry.data[0];
            type1Counts[entry.index] = entry.data[1];
            type2Counts[entry.index] = entry.data[2];
          });
        }
      }
      return { labels: dateLabels, counts: [type0Counts, type1Counts, type2Counts], typeLabels: ["New cards", "Failed reviews", "Successful reviews"] };
    } catch (error) {
      logger.error("Error fetching review history:", error);
      return null;
    }
  }
  async function fetchTimeHistory(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID, periodId = "1 Month", grouping = "Days", viewMode = "totals") {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let currentDayNumber = Math.floor(
        (currentDate.getTime() - new Date(
          CHART_CONFIG.START_YEAR,
          CHART_CONFIG.START_MONTH,
          CHART_CONFIG.START_DAY
        ).getTime()) / (1e3 * 60 * 60 * 24)
      );
      let period;
      if (periodId === "All time") {
        period = "All";
      } else if (periodId === "1 Year") {
        period = 12;
      } else {
        period = periodId.replace(" Months", "").replace("Months", "");
      }
      let periodDays;
      if (period === "All") {
        periodDays = currentDayNumber;
      } else {
        const periodMonths = typeof period === "number" ? period : parseInt(period, 10) || 1;
        const periodStartDate = new Date(currentDate);
        periodStartDate.setMonth(currentDate.getMonth() - periodMonths);
        periodDays = Math.round((currentDate.getTime() - periodStartDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
      }
      const periodDaysAgoDayNumber = currentDayNumber - periodDays;
      let timeQuery = TIME_HISTORY_QUERY;
      let timeQueryParams = [language, periodDaysAgoDayNumber];
      if (deckId !== APP_SETTINGS.DEFAULT_DECK_ID) {
        timeQuery = timeQuery.replace(
          "WHERE ct.lang = ? AND r.day >= ? AND r.del = 0",
          "WHERE ct.lang = ? AND r.day >= ? AND r.del = 0 AND c.deckId = ?"
        );
        timeQueryParams.push(deckId);
      }
      const timeResults = db.exec(timeQuery, timeQueryParams);
      const dateLabels = [];
      const newCardsTime = [];
      const reviewsTime = [];
      const dayMap = new Map();
      const aggregateMap = new Map();
      let actualPeriodDays = periodDays;
      if (period === "All" && timeResults.length > 0 && timeResults[0].values.length > 0) {
        let earliestDayWithData = currentDayNumber;
        timeResults[0].values.forEach((row) => {
          const dayNumber = Number(row[0]) ?? 0;
          earliestDayWithData = Math.min(earliestDayWithData, dayNumber);
        });
        const daysWithData = currentDayNumber - earliestDayWithData + 1;
        actualPeriodDays = Math.min(periodDays, daysWithData);
      }
      let currentGroupKey = null;
      let groupIndex = -1;
      const startDate = new Date(CHART_CONFIG.START_YEAR, CHART_CONFIG.START_MONTH, CHART_CONFIG.START_DAY);
      for (let i2 = 0; i2 < actualPeriodDays; i2++) {
        const dayNumber = currentDayNumber - (actualPeriodDays - 1 - i2);
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayNumber);
        date.setHours(0, 0, 0, 0);
        let displayDate;
        let groupKey;
        if (grouping === "Weeks") {
          const dayOfWeek = (date.getDay() + 6) % 7;
          const weekStartDate = new Date(date);
          weekStartDate.setDate(date.getDate() - dayOfWeek);
          groupKey = weekStartDate.toISOString().split("T")[0];
          if (groupKey !== currentGroupKey) {
            displayDate = "Week of " + weekStartDate.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
            dateLabels.push(displayDate);
            newCardsTime.push(0);
            reviewsTime.push(0);
            currentGroupKey = groupKey;
            groupIndex++;
            aggregateMap.set(groupKey, { index: groupIndex, data: { newCards: 0, reviews: 0, newCardsCount: 0, reviewsCount: 0 } });
          }
        } else if (grouping === "Months") {
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (groupKey !== currentGroupKey) {
            displayDate = date.toLocaleDateString(void 0, { month: "short", year: "numeric" });
            dateLabels.push(displayDate);
            newCardsTime.push(0);
            reviewsTime.push(0);
            currentGroupKey = groupKey;
            groupIndex++;
            aggregateMap.set(groupKey, { index: groupIndex, data: { newCards: 0, reviews: 0, newCardsCount: 0, reviewsCount: 0 } });
          }
        } else {
          groupKey = dayNumber;
          displayDate = date.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
          dateLabels.push(displayDate);
          newCardsTime.push(0);
          reviewsTime.push(0);
          dayMap.set(dayNumber, { index: i2, newCards: 0, reviews: 0, newCardsCount: 0, reviewsCount: 0 });
        }
      }
      if (timeResults.length > 0 && timeResults[0].values.length > 0) {
        timeResults[0].values.forEach((row) => {
          const dayNumber = typeof row[0] === "number" ? row[0] : Number(row[0]) ?? 0;
          const reviewType = String(row[1]);
          const totalTime = Number(row[2]) ?? 0;
          const avgTime = Number(row[3]) ?? 0;
          const reviewCount = Number(row[4]) ?? 0;
          const date = new Date(startDate);
          date.setDate(date.getDate() + dayNumber);
          date.setHours(0, 0, 0, 0);
          let targetIndex = -1;
          let targetMapEntry = void 0;
          if (grouping === "Weeks") {
            const dayOfWeek = (date.getDay() + 6) % 7;
            const weekStartDate = new Date(date);
            weekStartDate.setDate(date.getDate() - dayOfWeek);
            const groupKey = weekStartDate.toISOString().split("T")[0];
            if (aggregateMap.has(groupKey)) {
              targetMapEntry = aggregateMap.get(groupKey);
              targetIndex = targetMapEntry?.index ?? -1;
            }
          } else if (grouping === "Months") {
            const groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (aggregateMap.has(groupKey)) {
              targetMapEntry = aggregateMap.get(groupKey);
              targetIndex = targetMapEntry?.index ?? -1;
            }
          } else {
            if (dayMap.has(dayNumber)) {
              const entry = dayMap.get(dayNumber);
              targetIndex = entry?.index ?? -1;
            }
          }
          if (targetIndex !== -1) {
            if (reviewType === "new_cards") {
              if (grouping === "Days") {
                const timeValue = viewMode === "averages" ? avgTime : totalTime;
                newCardsTime[targetIndex] += timeValue;
              } else if (targetMapEntry) {
                if (viewMode === "averages") {
                  targetMapEntry.data.newCards += totalTime;
                  targetMapEntry.data.newCardsCount += reviewCount;
                } else {
                  targetMapEntry.data.newCards += totalTime;
                }
              }
            } else if (reviewType === "reviews") {
              if (grouping === "Days") {
                const timeValue = viewMode === "averages" ? avgTime : totalTime;
                reviewsTime[targetIndex] += timeValue;
              } else if (targetMapEntry) {
                if (viewMode === "averages") {
                  targetMapEntry.data.reviews += totalTime;
                  targetMapEntry.data.reviewsCount += reviewCount;
                } else {
                  targetMapEntry.data.reviews += totalTime;
                }
              }
            }
          }
        });
        if (grouping === "Weeks" || grouping === "Months") {
          aggregateMap.forEach((entry) => {
            if (viewMode === "averages") {
              newCardsTime[entry.index] = entry.data.newCardsCount > 0 ? entry.data.newCards / entry.data.newCardsCount : 0;
              reviewsTime[entry.index] = entry.data.reviewsCount > 0 ? entry.data.reviews / entry.data.reviewsCount : 0;
            } else {
              newCardsTime[entry.index] = entry.data.newCards;
              reviewsTime[entry.index] = entry.data.reviews;
            }
          });
        }
      }
      return { labels: dateLabels, newCardsTime, reviewsTime };
    } catch (error) {
      logger.error("Error fetching time history:", error);
      return null;
    }
  }
  async function fetchWordHistory(language, deckId = APP_SETTINGS.DEFAULT_DECK_ID, periodId = "1 Month", grouping = "Days", viewMode = "cumulative") {
    try {
      const db = await loadDatabase();
      if (!db) {
        logger.error("Failed to load database");
        return null;
      }
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let currentDayNumber = Math.floor(
        (currentDate.getTime() - new Date(
          CHART_CONFIG.START_YEAR,
          CHART_CONFIG.START_MONTH,
          CHART_CONFIG.START_DAY
        ).getTime()) / (1e3 * 60 * 60 * 24)
      );
      let period;
      if (periodId === "All time") {
        period = "All";
      } else if (periodId === "1 Year") {
        period = 12;
      } else {
        period = periodId.replace(" Months", "").replace("Months", "");
      }
      let periodDays;
      if (period === "All") {
        periodDays = currentDayNumber;
      } else {
        const periodMonths = typeof period === "number" ? period : parseInt(period, 10) || 1;
        const periodStartDate = new Date(currentDate);
        periodStartDate.setMonth(currentDate.getMonth() - periodMonths);
        periodDays = Math.round((currentDate.getTime() - periodStartDate.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
      }
      const periodDaysAgoDayNumber = currentDayNumber - periodDays;
      const queryStartDay = viewMode === "cumulative" ? 0 : periodDaysAgoDayNumber;
      const useDeckFilter = deckId !== APP_SETTINGS.DEFAULT_DECK_ID;
      const wordHistoryQuery = useDeckFilter ? WORD_HISTORY_QUERY_WITH_DECK : WORD_HISTORY_QUERY;
      const wordHistoryParams = useDeckFilter ? [language, queryStartDay, deckId] : [language, queryStartDay];
      const wordHistoryResults = db.exec(wordHistoryQuery, wordHistoryParams);
      const wordStatusMap = new Map();
      if (wordHistoryResults.length > 0 && wordHistoryResults[0].values.length > 0) {
        wordHistoryResults[0].values.forEach((row) => {
          const day = Number(row[0]) ?? 0;
          const dictForm = String(row[1] ?? "");
          const secondary = String(row[2] ?? "");
          const partOfSpeech = String(row[3] ?? "");
          const knownStatus = String(row[4] ?? "");
          const prevKnownStatus = row[5] ? String(row[5]) : null;
          const wordKey = `${dictForm}|${secondary}|${partOfSpeech}`;
          if (!wordStatusMap.has(wordKey)) {
            wordStatusMap.set(wordKey, new Map());
          }
          wordStatusMap.get(wordKey).set(day, { knownStatus, prevKnownStatus });
        });
      }
      let actualPeriodDays = periodDays;
      if (period === "All" && wordStatusMap.size > 0) {
        let earliestDay = currentDayNumber;
        wordStatusMap.forEach((dayMap2) => {
          dayMap2.forEach((_2, day) => {
            earliestDay = Math.min(earliestDay, day);
          });
        });
        const daysWithData = currentDayNumber - earliestDay + 1;
        actualPeriodDays = Math.min(periodDays, daysWithData);
      }
      const dateLabels = [];
      const knownCounts = [];
      const dayMap = new Map();
      const aggregateMap = new Map();
      let currentGroupKey = null;
      let groupIndex = -1;
      const startDate = new Date(CHART_CONFIG.START_YEAR, CHART_CONFIG.START_MONTH, CHART_CONFIG.START_DAY);
      for (let i2 = 0; i2 < actualPeriodDays; i2++) {
        const dayNumber = currentDayNumber - (actualPeriodDays - 1 - i2);
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayNumber);
        date.setHours(0, 0, 0, 0);
        let displayDate;
        let groupKey;
        if (grouping === "Weeks") {
          const dayOfWeek = (date.getDay() + 6) % 7;
          const weekStartDate = new Date(date);
          weekStartDate.setDate(date.getDate() - dayOfWeek);
          groupKey = weekStartDate.toISOString().split("T")[0];
          if (groupKey !== currentGroupKey) {
            displayDate = "Week of " + weekStartDate.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
            dateLabels.push(displayDate);
            knownCounts.push(0);
            currentGroupKey = groupKey;
            groupIndex++;
            if (viewMode === "cumulative") {
              aggregateMap.set(groupKey, { index: groupIndex, knownWords: new Set() });
            } else {
              aggregateMap.set(groupKey, { index: groupIndex, netChange: 0 });
            }
          }
        } else if (grouping === "Months") {
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (groupKey !== currentGroupKey) {
            displayDate = date.toLocaleDateString(void 0, { month: "short", year: "numeric" });
            dateLabels.push(displayDate);
            knownCounts.push(0);
            currentGroupKey = groupKey;
            groupIndex++;
            if (viewMode === "cumulative") {
              aggregateMap.set(groupKey, { index: groupIndex, knownWords: new Set() });
            } else {
              aggregateMap.set(groupKey, { index: groupIndex, netChange: 0 });
            }
          }
        } else {
          groupKey = dayNumber;
          displayDate = date.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
          dateLabels.push(displayDate);
          knownCounts.push(0);
          dayMap.set(dayNumber, { index: i2 });
        }
      }
      if (viewMode === "cumulative") {
        const cumulativeKnownWords = new Map();
        const wordInitialStatus = new Map();
        wordStatusMap.forEach((dayMap2, wordKey) => {
          let earliestDay = Infinity;
          let earliestPrevStatus = null;
          dayMap2.forEach((statusInfo, day) => {
            if (day < earliestDay) {
              earliestDay = day;
              earliestPrevStatus = statusInfo.prevKnownStatus;
            }
          });
          if (earliestPrevStatus === "KNOWN") {
            wordInitialStatus.set(wordKey, "KNOWN");
          } else {
            wordInitialStatus.set(wordKey, null);
          }
        });
        for (let i2 = 0; i2 < actualPeriodDays; i2++) {
          const dayNumber = currentDayNumber - (actualPeriodDays - 1 - i2);
          const knownWordsOnDay = new Set();
          wordStatusMap.forEach((dayMap2, wordKey) => {
            let latestStatus = null;
            let latestDay = -1;
            dayMap2.forEach((statusInfo, day) => {
              if (day <= dayNumber && day > latestDay) {
                latestDay = day;
                latestStatus = statusInfo.knownStatus;
              }
            });
            if (latestStatus === null) {
              const initialStatus = wordInitialStatus.get(wordKey);
              if (initialStatus === "KNOWN") {
                latestStatus = "KNOWN";
              }
            }
            if (latestStatus === "KNOWN") {
              knownWordsOnDay.add(wordKey);
            }
          });
          cumulativeKnownWords.set(dayNumber, knownWordsOnDay);
        }
        for (let i2 = 0; i2 < actualPeriodDays; i2++) {
          const dayNumber = currentDayNumber - (actualPeriodDays - 1 - i2);
          const date = new Date(startDate);
          date.setDate(date.getDate() + dayNumber);
          date.setHours(0, 0, 0, 0);
          const knownWordsOnDay = cumulativeKnownWords.get(dayNumber) || new Set();
          if (grouping === "Weeks") {
            const dayOfWeek = (date.getDay() + 6) % 7;
            const weekStartDate = new Date(date);
            weekStartDate.setDate(date.getDate() - dayOfWeek);
            const groupKey = weekStartDate.toISOString().split("T")[0];
            if (aggregateMap.has(groupKey)) {
              const targetMapEntry = aggregateMap.get(groupKey);
              const isLastDayOfWeek = date.getDay() === 0 || i2 === actualPeriodDays - 1;
              if (targetMapEntry && (isLastDayOfWeek || i2 === actualPeriodDays - 1)) {
                targetMapEntry.knownWords = new Set(knownWordsOnDay);
              }
            }
          } else if (grouping === "Months") {
            const groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (aggregateMap.has(groupKey)) {
              const targetMapEntry = aggregateMap.get(groupKey);
              const nextDate = new Date(date);
              nextDate.setDate(date.getDate() + 1);
              const isLastDayOfMonth = nextDate.getMonth() !== date.getMonth() || i2 === actualPeriodDays - 1;
              if (targetMapEntry && (isLastDayOfMonth || i2 === actualPeriodDays - 1)) {
                targetMapEntry.knownWords = new Set(knownWordsOnDay);
              }
            }
          } else {
            if (dayMap.has(dayNumber)) {
              const targetIndex = dayMap.get(dayNumber)?.index ?? -1;
              knownCounts[targetIndex] = knownWordsOnDay.size;
            }
          }
        }
        if (grouping === "Weeks" || grouping === "Months") {
          aggregateMap.forEach((entry) => {
            if (entry.knownWords) {
              knownCounts[entry.index] = entry.knownWords.size;
            }
          });
        }
      } else {
        for (let i2 = 0; i2 < actualPeriodDays; i2++) {
          const dayNumber = currentDayNumber - (actualPeriodDays - 1 - i2);
          const date = new Date(startDate);
          date.setDate(date.getDate() + dayNumber);
          date.setHours(0, 0, 0, 0);
          let netChange = 0;
          wordStatusMap.forEach((dayMap2) => {
            const statusInfo = dayMap2.get(dayNumber);
            if (statusInfo) {
              if (statusInfo.knownStatus === "KNOWN" && statusInfo.prevKnownStatus !== "KNOWN") {
                netChange += 1;
              }
              if (statusInfo.prevKnownStatus === "KNOWN" && statusInfo.knownStatus !== "KNOWN") {
                netChange -= 1;
              }
            }
          });
          let targetIndex = -1;
          if (grouping === "Weeks") {
            const dayOfWeek = (date.getDay() + 6) % 7;
            const weekStartDate = new Date(date);
            weekStartDate.setDate(date.getDate() - dayOfWeek);
            const groupKey = weekStartDate.toISOString().split("T")[0];
            if (aggregateMap.has(groupKey)) {
              const targetMapEntry = aggregateMap.get(groupKey);
              targetIndex = targetMapEntry?.index ?? -1;
              if (targetMapEntry && targetMapEntry.netChange !== void 0) {
                targetMapEntry.netChange += netChange;
              }
            }
          } else if (grouping === "Months") {
            const groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (aggregateMap.has(groupKey)) {
              const targetMapEntry = aggregateMap.get(groupKey);
              targetIndex = targetMapEntry?.index ?? -1;
              if (targetMapEntry && targetMapEntry.netChange !== void 0) {
                targetMapEntry.netChange += netChange;
              }
            }
          } else {
            if (dayMap.has(dayNumber)) {
              targetIndex = dayMap.get(dayNumber)?.index ?? -1;
              knownCounts[targetIndex] = netChange;
            }
          }
        }
        if (grouping === "Weeks" || grouping === "Months") {
          aggregateMap.forEach((entry) => {
            if (entry.netChange !== void 0) {
              knownCounts[entry.index] = entry.netChange;
            }
          });
        }
      }
      return { labels: dateLabels, knownCounts };
    } catch (error) {
      logger.error("Error fetching word history:", error);
      return null;
    }
  }
  const STORAGE_KEY$7 = "migaku-wordstats";
  const SETTINGS_KEY$7 = "migaku-wordstats-settings";
  const useWordStatsStore = pinia.defineStore("wordStats", () => {
    const wordStats = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const showUnknown = vue.ref(true);
    const showIgnored = vue.ref(true);
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$7);
        if (data) {
          const parsed = JSON.parse(data);
          if (typeof parsed.showUnknown === "boolean") showUnknown.value = parsed.showUnknown;
          if (typeof parsed.showIgnored === "boolean") showIgnored.value = parsed.showIgnored;
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(SETTINGS_KEY$7, JSON.stringify({ showUnknown: showUnknown.value, showIgnored: showIgnored.value }));
    }
    function setShowUnknown(val) {
      showUnknown.value = !!val;
    }
    function setShowIgnored(val) {
      showIgnored.value = !!val;
    }
    loadSettingsFromStorage();
    vue.watch([showUnknown, showIgnored], saveSettingsToStorage);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$7);
        if (stored) wordStats.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load word stats.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$7, JSON.stringify(wordStats.value));
      } catch (err) {
        error.value = "Failed to save word stats.";
      }
    }
    vue.watch(wordStats, saveToStorage, { deep: true });
    async function fetchWordStatsIfNeeded(lang, deckId) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchWordStats(lang, deckId);
        if (!stats) throw new Error("No word stats found");
        wordStats.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      wordStats.value = null;
      await reloadDatabase();
      return fetchWordStatsIfNeeded(lang, deckId);
    }
    function setWordStats(stats) {
      wordStats.value = stats;
    }
    function clearWordStats() {
      wordStats.value = null;
    }
    return {
      wordStats,
      isLoading,
      error,
      showUnknown,
      showIgnored,
      setShowUnknown,
      setShowIgnored,
      setWordStats,
      clearWordStats,
      fetchWordStatsIfNeeded,
      refetch,
      loadFromStorage
    };
  });
  const CommonProps = {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    plugins: {
      type: Array,
      default: () => []
    },
    datasetIdKey: {
      type: String,
      default: "label"
    },
    updateMode: {
      type: String,
      default: void 0
    }
  };
  const A11yProps = {
    ariaLabel: {
      type: String
    },
    ariaDescribedby: {
      type: String
    }
  };
  const Props = {
    type: {
      type: String,
      required: true
    },
    destroyDelay: {
      type: Number,
      default: 0
},
    ...CommonProps,
    ...A11yProps
  };
  const compatProps = vue.version[0] === "2" ? (internals, props) => Object.assign(internals, {
    attrs: props
  }) : (internals, props) => Object.assign(internals, props);
  function toRawIfProxy(obj) {
    return vue.isProxy(obj) ? vue.toRaw(obj) : obj;
  }
  function cloneProxy(obj) {
    let src = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : obj;
    return vue.isProxy(src) ? new Proxy(obj, {}) : obj;
  }
  function setOptions(chart, nextOptions) {
    const options = chart.options;
    if (options && nextOptions) {
      Object.assign(options, nextOptions);
    }
  }
  function setLabels(currentData, nextLabels) {
    currentData.labels = nextLabels;
  }
  function setDatasets(currentData, nextDatasets, datasetIdKey) {
    const addedDatasets = [];
    currentData.datasets = nextDatasets.map((nextDataset) => {
      const currentDataset = currentData.datasets.find((dataset) => dataset[datasetIdKey] === nextDataset[datasetIdKey]);
      if (!currentDataset || !nextDataset.data || addedDatasets.includes(currentDataset)) {
        return {
          ...nextDataset
        };
      }
      addedDatasets.push(currentDataset);
      Object.assign(currentDataset, nextDataset);
      return currentDataset;
    });
  }
  function cloneData(data, datasetIdKey) {
    const nextData = {
      labels: [],
      datasets: []
    };
    setLabels(nextData, data.labels);
    setDatasets(nextData, data.datasets, datasetIdKey);
    return nextData;
  }
  const Chart = vue.defineComponent({
    props: Props,
    setup(props, param) {
      let { expose, slots } = param;
      const canvasRef = vue.ref(null);
      const chartRef = vue.shallowRef(null);
      expose({
        chart: chartRef
      });
      const renderChart = () => {
        if (!canvasRef.value) return;
        const { type, data, options, plugins, datasetIdKey } = props;
        const clonedData = cloneData(data, datasetIdKey);
        const proxiedData = cloneProxy(clonedData, data);
        chartRef.value = new chart_js.Chart(canvasRef.value, {
          type,
          data: proxiedData,
          options: {
            ...options
          },
          plugins
        });
      };
      const destroyChart = () => {
        const chart = vue.toRaw(chartRef.value);
        if (chart) {
          if (props.destroyDelay > 0) {
            setTimeout(() => {
              chart.destroy();
              chartRef.value = null;
            }, props.destroyDelay);
          } else {
            chart.destroy();
            chartRef.value = null;
          }
        }
      };
      const update = (chart) => {
        chart.update(props.updateMode);
      };
      vue.onMounted(renderChart);
      vue.onUnmounted(destroyChart);
      vue.watch([
        () => props.options,
        () => props.data
      ], (param2, param1) => {
        let [nextOptionsProxy, nextDataProxy] = param2, [prevOptionsProxy, prevDataProxy] = param1;
        const chart = vue.toRaw(chartRef.value);
        if (!chart) {
          return;
        }
        let shouldUpdate = false;
        if (nextOptionsProxy) {
          const nextOptions = toRawIfProxy(nextOptionsProxy);
          const prevOptions = toRawIfProxy(prevOptionsProxy);
          if (nextOptions && nextOptions !== prevOptions) {
            setOptions(chart, nextOptions);
            shouldUpdate = true;
          }
        }
        if (nextDataProxy) {
          const nextLabels = toRawIfProxy(nextDataProxy.labels);
          const prevLabels = toRawIfProxy(prevDataProxy.labels);
          const nextDatasets = toRawIfProxy(nextDataProxy.datasets);
          const prevDatasets = toRawIfProxy(prevDataProxy.datasets);
          if (nextLabels !== prevLabels) {
            setLabels(chart.config.data, nextLabels);
            shouldUpdate = true;
          }
          if (nextDatasets && nextDatasets !== prevDatasets) {
            setDatasets(chart.config.data, nextDatasets, props.datasetIdKey);
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          vue.nextTick(() => {
            update(chart);
          });
        }
      }, {
        deep: true
      });
      return () => {
        return vue.h("canvas", {
          role: "img",
          ariaLabel: props.ariaLabel,
          ariaDescribedby: props.ariaDescribedby,
          ref: canvasRef
        }, [
          vue.h("p", {}, [
            slots.default ? slots.default() : ""
          ])
        ]);
      };
    }
  });
  function createTypedChart(type, registerables) {
    chart_js.Chart.register(registerables);
    return vue.defineComponent({
      props: CommonProps,
      setup(props, param) {
        let { expose } = param;
        const ref2 = vue.shallowRef(null);
        const reforwardRef = (chartRef) => {
          ref2.value = chartRef?.chart;
        };
        expose({
          chart: ref2
        });
        return () => {
          return vue.h(Chart, compatProps({
            ref: reforwardRef
          }, {
            type,
            ...props
          }));
        };
      }
    });
  }
  const Bar = createTypedChart("bar", chart_js.BarController);
  const Doughnut = createTypedChart("doughnut", chart_js.DoughnutController);
  const Line = createTypedChart("line", chart_js.LineController);
  const THEME_CONFIGS = {
    DARK: {
      backgroundElevation1: "#202047",
      backgroundElevation2: "#2b2b60",
      accent1: "rgba(178, 114, 255, 1)",
      accent2: "#fe4670",
      accent3: "#fba335",
      accent1Transparent: "rgba(178, 114, 255, 0.12)",
      textColor: "rgba(255, 255, 255, 1)",
      gridColor: "rgba(255, 255, 255, 0.1)",
      knownColor: "rgba(0, 199, 164, 1)",
      learningColor: "rgba(0, 199, 164, 0.4)",
      unknownColor: "rgba(255, 255, 255, 0.12)",
      ignoredColor: "rgba(255, 255, 255, 0.35)",
      barColor: "rgba(0, 199, 164, 1)"
    },
    LIGHT: {
      backgroundElevation1: "#fff",
      backgroundElevation2: "#fff",
      accent1: "#672fc3",
      accent2: "#fe4670",
      accent3: "#ff9345",
      accent1Transparent: "rgba(103, 47, 195, 0.12)",
      textColor: "rgba(0, 0, 90, 1)",
      gridColor: "rgba(0, 0, 0, 0.1)",
      knownColor: "rgba(0, 199, 164, 1)",
      learningColor: "rgba(0, 199, 164, 0.4)",
      unknownColor: "rgba(0, 0, 90, 0.07)",
      ignoredColor: "rgba(0, 0, 90, 0.15)",
      barColor: "rgba(0, 199, 164, 1)"
    }
  };
  const _hoisted_1$f = ["aria-label"];
  const _hoisted_2$e = { class: "UiButton__icon" };
  const _sfc_main$h = vue.defineComponent({
    __name: "FloatingButton",
    props: {
      icon: { type: Object, default: null },
      label: { type: String, default: "" },
      top: { type: Number, default: void 0 },
      bottom: { type: Number, default: void 0 },
      left: { type: Number, default: void 0 },
      right: { type: Number, default: void 0 },
      colorClass: { type: String, default: "UiButton -plain -icon-only -icon-left -floating" },
      customClass: { type: String, default: "" }
    },
    emits: ["click"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const styleObject = vue.computed(() => ({
        position: "fixed",
        top: props.top !== void 0 ? `${props.top}px` : void 0,
        bottom: props.bottom !== void 0 ? `${props.bottom}px` : void 0,
        left: props.left !== void 0 ? `${props.left}px` : void 0,
        right: props.right !== void 0 ? `${props.right}px` : void 0,
        zIndex: 1e3
      }));
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("button", {
          class: vue.normalizeClass([__props.colorClass, __props.customClass]),
          style: vue.normalizeStyle(styleObject.value),
          "aria-label": __props.label,
          type: "button",
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
        }, [
          vue.createElementVNode("div", _hoisted_2$e, [
            vue.renderSlot(_ctx.$slots, "icon", {}, () => [
              __props.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(__props.icon), { key: 0 })) : vue.createCommentVNode("", true)
            ], true)
          ]),
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 14, _hoisted_1$f);
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
  const FloatingButton = _export_sfc(_sfc_main$h, [["__scopeId", "data-v-c676c4b0"]]);
  const _hoisted_1$e = { class: "multiselect__tags" };
  const _hoisted_2$d = { class: "multiselect__single" };
  const _hoisted_3$c = { class: "UiTypo UiTypo__caption -no-wrap multiselect__single__text" };
  const _hoisted_4$a = {
    class: "multiselect__content",
    role: "listbox",
    style: { "z-index": "1000" }
  };
  const _hoisted_5$9 = ["onClick"];
  const _hoisted_6$3 = {
    class: "UiIcon multiselect__checkIcon",
    style: { "width": "24px" }
  };
  const _hoisted_7$3 = {
    key: 0,
    class: "UiIcon__inner"
  };
  const _hoisted_8$2 = {
    class: "UiSvg UiIcon__svg",
    name: "Check",
    gradient: "true",
    spin: "false"
  };
  const _hoisted_9$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    role: "img"
  };
  const _hoisted_10$2 = ["id"];
  const _sfc_main$g = vue.defineComponent({
    __name: "DropdownMenu",
    props: {
      items: {
        type: Array,
        required: true
      },
      modelValue: {
        type: [String, Number, Object],
        default: null
      },
      itemKey: {
        type: String,
        default: "id"
      },
      itemLabel: {
        type: [String, Function],
        default: "name"
      },
      placeholder: {
        type: String,
        default: "Select an option"
      },
      width: {
        type: Number,
        default: 250
      },
      componentHash: {
        type: String,
        default: void 0
      }
    },
    emits: ["update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const isDropdownOpen = vue.ref(false);
      const componentHash = vue.computed(() => props.componentHash || "");
      const rootRef = vue.ref(null);
      __expose({ rootRef, isDropdownOpen });
      const selectedItemLabel = vue.computed(() => {
        const selectedItem = props.items.find((item) => getItemKey(item) === props.modelValue);
        return selectedItem ? getItemLabel(selectedItem) : props.placeholder;
      });
      function toggleDropdown(event) {
        event.stopPropagation();
        isDropdownOpen.value = !isDropdownOpen.value;
      }
      function selectItem(item, event) {
        event.stopPropagation();
        const itemKeyVal = getItemKey(item);
        if (props.modelValue !== itemKeyVal) {
          emit("update:modelValue", itemKeyVal);
        }
        isDropdownOpen.value = false;
      }
      function getItemKey(item) {
        return item[props.itemKey];
      }
      function getItemLabel(item) {
        if (typeof props.itemLabel === "function") {
          return props.itemLabel(item);
        }
        return item[props.itemLabel];
      }
      let cleanupClick = null;
      vue.watch(isDropdownOpen, (open) => {
        if (open) {
          const handler = (event) => {
            if (!rootRef.value) return;
            if (rootRef.value.contains(event.target)) return;
            isDropdownOpen.value = false;
          };
          document.addEventListener("mousedown", handler);
          cleanupClick = () => document.removeEventListener("mousedown", handler);
        } else {
          if (cleanupClick) {
            cleanupClick();
            cleanupClick = null;
          }
        }
      });
      vue.onBeforeUnmount(() => {
        if (cleanupClick) cleanupClick();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          ref_key: "rootRef",
          ref: rootRef,
          [componentHash.value || ""]: true,
          tabindex: "0",
          class: ["multiselect multiselect--right", { "-has-value": __props.modelValue !== null, "multiselect--active": isDropdownOpen.value }],
          role: "combobox",
          style: { width: __props.width + "px" },
          onClick: toggleDropdown
        }), [
          _cache[1] || (_cache[1] = vue.createElementVNode("div", {
            class: "UiIcon multiselect__caret",
            style: { "width": "24px" }
          }, [
            vue.createElementVNode("div", { class: "UiIcon__inner" }, [
              vue.createElementVNode("div", {
                class: "UiSvg UiIcon__svg",
                name: "ChevronDownSmall",
                gradient: "false",
                spin: "false"
              }, [
                vue.createElementVNode("div", { class: "UiSvg__inner" }, [
                  vue.createElementVNode("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    role: "img"
                  }, [
                    vue.createElementVNode("path", {
                      fill: "currentColor",
                      "fill-rule": "evenodd",
                      d: "M7.116 10.116a1.25 1.25 0 0 1 1.768 0L12 13.232l3.116-3.116a1.25 1.25 0 0 1 1.768 1.768l-4 4a1.25 1.25 0 0 1-1.768 0l-4-4a1.25 1.25 0 0 1 0-1.768",
                      "clip-rule": "evenodd"
                    })
                  ])
                ])
              ])
            ])
          ], -1)),
          vue.createElementVNode("div", _hoisted_1$e, [
            vue.renderSlot(_ctx.$slots, "trigger", { selectedLabel: selectedItemLabel.value }, () => [
              vue.createElementVNode("span", _hoisted_2$d, [
                vue.createElementVNode("span", _hoisted_3$c, vue.toDisplayString(selectedItemLabel.value), 1)
              ])
            ])
          ]),
          vue.createElementVNode("div", {
            class: "multiselect__content-wrapper",
            tabindex: "-1",
            style: vue.normalizeStyle([{ "max-height": "300px" }, { display: isDropdownOpen.value ? "block" : "none" }])
          }, [
            vue.createElementVNode("ul", _hoisted_4$a, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.items, (item) => {
                return vue.openBlock(), vue.createElementBlock("li", {
                  class: "multiselect__element",
                  role: "option",
                  key: getItemKey(item)
                }, [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass(["multiselect__option", { "multiselect__option--highlight multiselect__option--selected": getItemKey(item) === __props.modelValue }]),
                    onClick: ($event) => selectItem(item, $event)
                  }, [
                    vue.renderSlot(_ctx.$slots, "item", {
                      item,
                      isSelected: getItemKey(item) === __props.modelValue
                    }, () => [
                      vue.createElementVNode("div", {
                        class: "multiselect__optionWrapper",
                        style: vue.normalizeStyle({ width: __props.width - 40 + "px" })
                      }, [
                        vue.createElementVNode("span", {
                          class: vue.normalizeClass(["UiTypo UiTypo__caption", { "-emphasis": getItemKey(item) === __props.modelValue }]),
                          style: { "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }
                        }, vue.toDisplayString(getItemLabel(item)), 3),
                        vue.createElementVNode("div", _hoisted_6$3, [
                          getItemKey(item) === __props.modelValue ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7$3, [
                            vue.createElementVNode("div", _hoisted_8$2, [
                              vue.createElementVNode("div", {
                                class: "UiSvg__inner UiIcon__gradient",
                                style: vue.normalizeStyle("clip-path: url(#checkmark-dd-" + getItemKey(item) + ");")
                              }, [
                                (vue.openBlock(), vue.createElementBlock("svg", _hoisted_9$2, [
                                  vue.createElementVNode("defs", null, [
                                    vue.createElementVNode("clipPath", {
                                      id: "checkmark-dd-" + getItemKey(item),
                                      "data-dont-prefix-id": "",
                                      transform: "scale(1)"
                                    }, [..._cache[0] || (_cache[0] = [
                                      vue.createElementVNode("path", {
                                        fill: "currentColor",
                                        "fill-rule": "evenodd",
                                        d: "M19.83 7.066a1.25 1.25 0 0 1 .104 1.764l-8 9a1.25 1.25 0 0 1-1.818.054l-5-5a1.25 1.25 0 0 1 1.768-1.768l4.063 4.063 7.119-8.01a1.25 1.25 0 0 1 1.765-.103",
                                        "clip-rule": "evenodd"
                                      }, null, -1)
                                    ])], 8, _hoisted_10$2)
                                  ])
                                ]))
                              ], 4)
                            ])
                          ])) : vue.createCommentVNode("", true)
                        ])
                      ], 4)
                    ])
                  ], 10, _hoisted_5$9)
                ]);
              }), 128))
            ])
          ], 4)
        ], 16);
      };
    }
  });
  const _hoisted_1$d = ["id", "aria-label", "checked"];
  const _sfc_main$f = vue.defineComponent({
    __name: "UiToggleSwitch",
    props: {
      modelValue: { type: Boolean },
      id: {},
      ariaLabel: {}
    },
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      const emit = __emit;
      function onChange(e2) {
        emit("update:modelValue", e2.target.checked);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["UiToggle", { "-toggled": !!__props.modelValue }])
        }, [
          vue.createElementVNode("input", {
            id: __props.id,
            class: "UiToggle__input",
            type: "checkbox",
            "aria-label": __props.ariaLabel,
            checked: !!__props.modelValue,
            onChange
          }, null, 40, _hoisted_1$d),
          _cache[0] || (_cache[0] = vue.createElementVNode("div", { class: "UiToggle__interface" }, [
            vue.createElementVNode("div", { class: "UiToggle__spacer" }),
            vue.createElementVNode("div", { class: "UiToggle__circle" })
          ], -1))
        ], 2);
      };
    }
  });
  const _hoisted_1$c = {
    class: "UiTextInput",
    style: { "width": "100%" }
  };
  const _hoisted_2$c = ["id", "name", "type", "required", "placeholder", "value", "min", "max", "step"];
  const _sfc_main$e = vue.defineComponent({
    __name: "UiTextInput",
    props: {
      modelValue: {},
      type: {},
      id: {},
      name: {},
      placeholder: {},
      required: { type: Boolean },
      min: {},
      max: {},
      step: {}
    },
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      function onInput(e2) {
        const target = e2.target;
        const value = props.type === "number" ? Number(target.value) : target.value;
        emit("update:modelValue", value);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$c, [
          vue.createElementVNode("input", {
            id: __props.id,
            name: __props.name,
            type: __props.type ?? "text",
            required: __props.required,
            placeholder: __props.placeholder,
            value: __props.modelValue,
            min: __props.min,
            max: __props.max,
            step: __props.step,
            class: "UiTextInput__input",
            style: vue.normalizeStyle({ textAlign: __props.type === "number" ? "right" : "left", height: "40px" }),
            onInput
          }, null, 44, _hoisted_2$c)
        ]);
      };
    }
  });
  const _hoisted_1$b = { class: "MCS__menu-setting-label" };
  const _hoisted_2$b = { class: "multiselect__single" };
  const _hoisted_3$b = { class: "UiTypo UiTypo__caption -no-wrap multiselect__single__text" };
  const _hoisted_4$9 = { key: 4 };
  const _hoisted_5$8 = {
    key: 5,
    class: "MCS__menu-setting-row-group"
  };
  const _hoisted_6$2 = { class: "MCS__menu-setting-label" };
  const _hoisted_7$2 = { key: 3 };
  const _sfc_main$d = vue.defineComponent({
    __name: "FloatingMenuButton",
    props: {
      buttonPos: {},
      settings: {},
      modelValue: {},
      width: {}
    },
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const isOpen = vue.ref(false);
      const btnRef = vue.ref(null);
      const wrapperRef = vue.ref(null);
      const popoverRef = vue.ref(null);
      const popoverPos = vue.ref({ top: 0, right: 0 });
      function useClickOutside(targetRef, handler, extraRefs = []) {
        function listener(event) {
          const el = targetRef.value;
          const isInTarget = el && el.contains(event.target);
          const isInExtras = extraRefs.some(
            (r2) => r2?.value && r2.value.contains(event.target)
          );
          if (!el || isInTarget || isInExtras) return;
          handler(event);
        }
        vue.onMounted(() => document.addEventListener("mousedown", listener));
        vue.onBeforeUnmount(() => document.removeEventListener("mousedown", listener));
      }
      useClickOutside(wrapperRef, () => isOpen.value = false, [popoverRef]);
      function computePopoverPosition() {
        const btn = btnRef.value;
        const btnEl = btn?.$el ? btn.$el : btn;
        if (!btnEl) return;
        const rect = btnEl.getBoundingClientRect();
        const gap = 12;
        popoverPos.value = {
          top: Math.round(rect.top + rect.height + gap),
          right: Math.round(
            window.innerWidth - rect.right + (props.buttonPos?.right ?? 24)
          )
        };
      }
      function openMenu() {
        isOpen.value = !isOpen.value;
        if (isOpen.value) {
          computePopoverPosition();
        }
      }
      vue.onMounted(() => {
        const handler = () => {
          if (isOpen.value) computePopoverPosition();
        };
        window.addEventListener("resize", handler);
        window.addEventListener("scroll", handler, true);
        vue.onBeforeUnmount(() => {
          window.removeEventListener("resize", handler);
          window.removeEventListener("scroll", handler, true);
        });
      });
      function updateSetting(key, value) {
        emit("update:modelValue", { ...props.modelValue, [key]: value });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "wrapperRef",
          ref: wrapperRef,
          style: { "position": "absolute", "top": "0", "right": "0" }
        }, [
          vue.createVNode(FloatingButton, {
            ref_key: "btnRef",
            ref: btnRef,
            bottom: props.buttonPos?.bottom,
            top: props.buttonPos?.top,
            left: props.buttonPos?.left,
            right: props.buttonPos?.right,
            label: "Open settings menu",
            customClass: "MCS__menu-fab",
            onClick: openMenu,
            style: { "z-index": "1201" }
          }, {
            icon: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
              vue.createElementVNode("svg", {
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                vue.createElementVNode("circle", {
                  cx: "12",
                  cy: "5",
                  r: "1.8",
                  fill: "currentColor"
                }),
                vue.createElementVNode("circle", {
                  cx: "12",
                  cy: "12",
                  r: "1.8",
                  fill: "currentColor"
                }),
                vue.createElementVNode("circle", {
                  cx: "12",
                  cy: "19",
                  r: "1.8",
                  fill: "currentColor"
                })
              ], -1)
            ])]),
            _: 1
          }, 8, ["bottom", "top", "left", "right"]),
          (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
            isOpen.value ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "MCS__menu-popover UiActionSheet -desktop",
              ref_key: "popoverRef",
              ref: popoverRef,
              onMousedown: _cache[2] || (_cache[2] = vue.withModifiers(() => {
              }, ["stop"])),
              onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
              }, ["stop"])),
              style: vue.normalizeStyle({
                minWidth: props.width ? props.width + "px" : "220px",
                width: props.width ? props.width + "px" : "auto",
                maxWidth: props.width ? props.width + "px" : "auto",
                position: "fixed",
                zIndex: 9999,
                top: popoverPos.value.top + "px",
                right: popoverPos.value.right + "px"
              })
            }, [
              vue.createElementVNode("form", {
                class: "MCS__menu-settings -compact",
                onMousedown: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                }, ["stop"])),
                onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                }, ["stop"]))
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.settings, (setting) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: setting.key,
                    class: vue.normalizeClass(["MCS__menu-setting-row", { "-active": !!__props.modelValue[setting.key] && setting.type === "group" }])
                  }, [
                    vue.createElementVNode("label", _hoisted_1$b, vue.toDisplayString(setting.label) + ":", 1),
                    setting.type === "group" ? (vue.openBlock(), vue.createBlock(_sfc_main$f, {
                      key: 0,
                      id: "toggle-" + setting.key,
                      "aria-label": "ID:" + setting.key,
                      modelValue: !!__props.modelValue[setting.key],
                      "onUpdate:modelValue": (val) => updateSetting(setting.key, val)
                    }, null, 8, ["id", "aria-label", "modelValue", "onUpdate:modelValue"])) : setting.type === "dropdown" ? (vue.openBlock(), vue.createBlock(_sfc_main$g, {
                      key: 1,
                      items: setting.options?.map((val) => ({ id: val, name: val })) ?? [],
                      modelValue: __props.modelValue[setting.key],
                      "onUpdate:modelValue": (val) => updateSetting(setting.key, val),
                      width: 180,
                      placeholder: "Select an option"
                    }, {
                      trigger: vue.withCtx(({ selectedLabel }) => [
                        vue.createElementVNode("span", _hoisted_2$b, [
                          vue.createElementVNode("span", _hoisted_3$b, vue.toDisplayString(setting.displayPrefix && selectedLabel !== "All time" ? setting.displayPrefix + selectedLabel : selectedLabel), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["items", "modelValue", "onUpdate:modelValue"])) : setting.type === "switch" ? (vue.openBlock(), vue.createBlock(_sfc_main$f, {
                      key: 2,
                      id: "toggle-" + setting.key,
                      "aria-label": "ID:" + setting.key,
                      modelValue: !!__props.modelValue[setting.key],
                      "onUpdate:modelValue": (val) => updateSetting(setting.key, val)
                    }, null, 8, ["id", "aria-label", "modelValue", "onUpdate:modelValue"])) : setting.type === "number" ? (vue.openBlock(), vue.createBlock(_sfc_main$e, {
                      key: 3,
                      type: "number",
                      min: setting.min,
                      max: setting.max,
                      step: setting.step ?? 1,
                      modelValue: __props.modelValue[setting.key],
                      "onUpdate:modelValue": (val) => updateSetting(setting.key, val),
                      id: "input-" + setting.key,
                      style: { "width": "100px" }
                    }, null, 8, ["min", "max", "step", "modelValue", "onUpdate:modelValue", "id"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$9, "Not implemented :(")),
                    setting.type === "group" && setting.children && __props.modelValue[setting.key] ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$8, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(setting.children, (child) => {
                        return vue.openBlock(), vue.createElementBlock("div", {
                          key: child.key,
                          class: "MCS__menu-setting-row -indented"
                        }, [
                          vue.createElementVNode("label", _hoisted_6$2, vue.toDisplayString(child.label) + ":", 1),
                          child.type === "dropdown" ? (vue.openBlock(), vue.createBlock(_sfc_main$g, {
                            key: 0,
                            items: child.options?.map((val) => ({ id: val, name: val })) ?? [],
                            modelValue: __props.modelValue[child.key],
                            "onUpdate:modelValue": (val) => updateSetting(child.key, val),
                            width: 180,
                            placeholder: "Select an option"
                          }, null, 8, ["items", "modelValue", "onUpdate:modelValue"])) : child.type === "switch" ? (vue.openBlock(), vue.createBlock(_sfc_main$f, {
                            key: 1,
                            id: "toggle-" + child.key,
                            "aria-label": "ID:" + child.key,
                            modelValue: !!__props.modelValue[child.key],
                            "onUpdate:modelValue": (val) => updateSetting(child.key, val)
                          }, null, 8, ["id", "aria-label", "modelValue", "onUpdate:modelValue"])) : child.type === "number" ? (vue.openBlock(), vue.createBlock(_sfc_main$e, {
                            key: 2,
                            type: "number",
                            min: child.min,
                            max: child.max,
                            step: child.step ?? 1,
                            modelValue: __props.modelValue[child.key],
                            "onUpdate:modelValue": (val) => updateSetting(child.key, val),
                            id: "input-" + child.key,
                            style: { "width": "100px" }
                          }, null, 8, ["min", "max", "step", "modelValue", "onUpdate:modelValue", "id"])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_7$2, "Not implemented :("))
                        ]);
                      }), 128))
                    ])) : vue.createCommentVNode("", true)
                  ], 2);
                }), 128))
              ], 32)
            ], 36)) : vue.createCommentVNode("", true)
          ]))
        ], 512);
      };
    }
  });
  const FloatingMenuButton = _export_sfc(_sfc_main$d, [["__scopeId", "data-v-40732fef"]]);
  const _hoisted_1$a = { class: "UiTypo UiTypo__heading4 -heading -inline" };
  const _hoisted_2$a = { class: "UiTypo UiTypo__heading4 -heading -inline" };
  const _hoisted_3$a = { class: "UiTypo UiTypo__heading4 -heading -inline" };
  const _hoisted_4$8 = { class: "UiTypo UiTypo__heading4 -heading -inline" };
  const _sfc_main$c = vue.defineComponent({
    __name: "WordCount",
    setup(__props) {
      chart_js.Chart.register(chart_js.ArcElement, chart_js.Tooltip, chart_js.Legend);
      const appStore = useAppStore();
      const wordStatsStore = useWordStatsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(() => THEME_CONFIGS[theme.value.toUpperCase()]);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const cardsStore = useCardsStore();
      const error = vue.computed(() => wordStatsStore.error);
      const isLoading = vue.computed(() => wordStatsStore.isLoading);
      const wordStats = vue.computed(() => wordStatsStore.wordStats);
      const wordcountContainer = vue.ref(null);
      const isOverflowing = vue.ref(false);
      function checkOverflow() {
        if (!wordcountContainer.value) return;
        let isOverf = false;
        const wordCountCard = cardsStore.cards.find((c2) => c2.item.i === "WordCount");
        if (wordCountCard && wordCountCard.item.w <= 5 && wordCountCard.item.h <= 6) {
          isOverf = true;
        } else if (wordCountCard && wordCountCard.item.h <= 5 && wordCountCard.item.w <= 5) {
          isOverf = true;
        }
        isOverflowing.value = isOverf;
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkOverflow);
        vue.nextTick(() => {
          checkOverflow();
        });
        if (language.value) {
          await wordStatsStore.refetch(language.value, selectedDeckId.value);
        }
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", checkOverflow);
      });
      vue.watch([
        wordStats,
        isLoading,
        error,
        () => cardsStore
      ], async () => {
        await vue.nextTick();
        checkOverflow();
      }, { deep: true });
      const chartData = vue.computed(() => {
        if (!wordStats.value) {
          return {
            labels: [],
            datasets: []
          };
        }
        const labels = ["Known", "Learning"];
        const data = [
          wordStats.value.known_count,
          wordStats.value.learning_count
        ];
        const bg = [
          themeColors.value.knownColor,
          themeColors.value.learningColor
        ];
        const border = [
          themeColors.value.knownColor,
          themeColors.value.learningColor
        ];
        if (wordStatsStore.showUnknown) {
          labels.push("Unknown");
          data.push(wordStats.value.unknown_count);
          bg.push(themeColors.value.unknownColor);
          border.push(themeColors.value.unknownColor);
        }
        if (wordStatsStore.showIgnored) {
          labels.push("Ignored");
          data.push(wordStats.value.ignored_count);
          bg.push(themeColors.value.ignoredColor);
          border.push(themeColors.value.ignoredColor);
        }
        return {
          labels,
          datasets: [
            {
              data,
              backgroundColor: bg,
              borderColor: border,
              borderWidth: 0
            }
          ]
        };
      });
      const chartOptions = vue.computed(() => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1.6,
          animation: {
            duration: 800,
            easing: "easeOutQuart"
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: themeColors.value.textColor,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed !== null) {
                    label += context.parsed.toLocaleString();
                  }
                  return label;
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            },
            bodyColor: themeColors.value.textColor,
            titleColor: themeColors.value.textColor
          }
        };
      });
      const menuSettings = [
        { key: "showUnknown", label: "Show Unknown", type: "switch", value: wordStatsStore.showUnknown },
        { key: "showIgnored", label: "Show Ignored", type: "switch", value: wordStatsStore.showIgnored }
      ];
      const menuValues = vue.computed(() => ({
        showUnknown: !!wordStatsStore.showUnknown,
        showIgnored: !!wordStatsStore.showIgnored
      }));
      function updateMenuSettings(newVals) {
        wordStatsStore.setShowUnknown(!!newVals.showUnknown);
        wordStatsStore.setShowIgnored(!!newVals.showIgnored);
      }
      vue.watch([language, selectedDeckId], async ([lang, deckId], _prev, onCleanup) => {
        if (!lang) return;
        const fetchPromise = wordStatsStore.fetchWordStatsIfNeeded(lang, deckId);
        let cancelled = false;
        onCleanup(() => cancelled = true);
        await fetchPromise;
        if (cancelled) return;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "wordcountContainer",
          ref: wordcountContainer
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Word Status ", 16),
          wordStats.value && !isLoading.value && !error.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 0,
            [componentHash.value || ""]: true,
            style: { "height": "calc(100% - 56px)", "display": "flex", "align-items": "center", "justify-content": "center", "position": "relative" }
          }), [
            vue.createElementVNode("div", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "MCS__wordcount"
            }), [
              vue.withDirectives(vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__wordcount__details"
              }), [
                vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                  vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                    _cache[0] || (_cache[0] = vue.createElementVNode("span", { class: "UiTypo UiTypo__caption" }, "Known:", -1)),
                    vue.createElementVNode("span", _hoisted_1$a, vue.toDisplayString(wordStats.value.known_count ?? "N/A"), 1)
                  ], 16),
                  vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                    _cache[1] || (_cache[1] = vue.createElementVNode("span", { class: "UiTypo UiTypo__caption" }, "Learning:", -1)),
                    vue.createElementVNode("span", _hoisted_2$a, vue.toDisplayString(wordStats.value.learning_count ?? "N/A"), 1)
                  ], 16),
                  vue.unref(wordStatsStore).showUnknown ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
                    key: 0,
                    [componentHash.value || ""]: true
                  }), [
                    _cache[2] || (_cache[2] = vue.createElementVNode("span", { class: "UiTypo UiTypo__caption" }, "Unknown:", -1)),
                    vue.createElementVNode("span", _hoisted_3$a, vue.toDisplayString(wordStats.value.unknown_count ?? "N/A"), 1)
                  ], 16)) : vue.createCommentVNode("", true),
                  vue.unref(wordStatsStore).showIgnored ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
                    key: 1,
                    [componentHash.value || ""]: true
                  }), [
                    _cache[3] || (_cache[3] = vue.createElementVNode("span", { class: "UiTypo UiTypo__caption" }, "Ignored:", -1)),
                    vue.createElementVNode("span", _hoisted_4$8, vue.toDisplayString(wordStats.value.ignored_count ?? "N/A"), 1)
                  ], 16)) : vue.createCommentVNode("", true)
                ], 16)
              ], 16), [
                [vue.vShow, !isOverflowing.value]
              ]),
              vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__wordcount__piechart"
              }), [
                vue.createVNode(vue.unref(Doughnut), {
                  class: "MCS__wordcount__piechart__donut",
                  data: chartData.value,
                  options: chartOptions.value
                }, null, 8, ["data", "options"])
              ], 16)
            ], 16),
            !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 0,
              settings: menuSettings,
              modelValue: menuValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true)
          ], 16)) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 1,
            [componentHash.value || ""]: true
          }), [
            vue.createElementVNode("div", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "MCS__wordcount"
            }), [
              vue.withDirectives(vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__wordcount__details"
              }), [
                vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                  vue.createElementVNode("div", vue.normalizeProps({
                    [componentHash.value || ""]: true,
                    class: "skeleton-row"
                  }), [..._cache[4] || (_cache[4] = [
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1),
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1),
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1),
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1)
                  ])], 16)
                ], 16)
              ], 16), [
                [vue.vShow, !isOverflowing.value]
              ]),
              vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__wordcount__piechart"
              }), [..._cache[5] || (_cache[5] = [
                vue.createStaticVNode('<div class="skeleton-donut-container" data-v-cbac060c><div class="skeleton-donut UiSkeleton" data-v-cbac060c></div><div class="skeleton-legend" data-v-cbac060c><div class="skeleton-legend-item" data-v-cbac060c><span class="skeleton-legend-circle UiSkeleton" data-v-cbac060c></span><span class="skeleton-legend-text UiSkeleton" data-v-cbac060c></span></div><div class="skeleton-legend-item" data-v-cbac060c><span class="skeleton-legend-circle UiSkeleton" data-v-cbac060c></span><span class="skeleton-legend-text UiSkeleton" data-v-cbac060c></span></div><div class="skeleton-legend-item" data-v-cbac060c><span class="skeleton-legend-circle UiSkeleton" data-v-cbac060c></span><span class="skeleton-legend-text UiSkeleton" data-v-cbac060c></span></div><div class="skeleton-legend-item" data-v-cbac060c><span class="skeleton-legend-circle UiSkeleton" data-v-cbac060c></span><span class="skeleton-legend-text UiSkeleton" data-v-cbac060c></span></div></div></div>', 1)
              ])], 16)
            ], 16)
          ], 16)) : error.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 2,
            [componentHash.value || ""]: true,
            class: "MCS__word-stats-card"
          }), [
            vue.createElementVNode("p", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "UiTypo UiTypo__body2"
            }), vue.toDisplayString(error.value), 17)
          ], 16)) : (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 3,
            [componentHash.value || ""]: true,
            class: "MCS__word-stats-card"
          }), [
            vue.createElementVNode("p", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "UiTypo UiTypo__body2"
            }), " Could not load word status data. ", 16)
          ], 16))
        ], 16);
      };
    }
  });
  const WordCount = _export_sfc(_sfc_main$c, [["__scopeId", "data-v-cbac060c"]]);
  const _sfc_main$b = vue.defineComponent({
    __name: "NativeStats",
    setup(__props) {
      const appStore = useAppStore();
      const domSlotRef = vue.ref(null);
      let nativeNode = null;
      let originalParent = null;
      let originalNext = null;
      async function moveNativeNode() {
        nativeNode = document.getElementById("original-stats-card-container");
        if (nativeNode && domSlotRef.value) {
          if (!originalParent) {
            originalParent = nativeNode.parentNode;
            originalNext = nativeNode.nextSibling;
          }
          domSlotRef.value.appendChild(nativeNode);
          nativeNode.style.display = "";
          const h2Title = nativeNode.querySelector("h2");
          if (h2Title) {
            h2Title.remove();
          }
        }
        const heatmapCard = await waitForElement(SELECTORS.HEATMAP);
        if (heatmapCard && heatmapCard instanceof HTMLElement) {
          heatmapCard.style.height = "calc(100% - 256px)";
          heatmapCard.style.overflowY = "scroll";
          heatmapCard.scrollTop = heatmapCard.scrollHeight;
        }
        const averageReviewsPerDayValue = nativeNode?.querySelector("#average-reviews-per-day-value")?.textContent || nativeNode?.querySelector(".UiTypo.UiTypo__heading3.-heading")?.textContent;
        const componentHash = nativeNode?.querySelector(".UiTypo.UiTypo__heading3.-heading")?.attributes[0].nodeName;
        const footer = nativeNode?.querySelector(".Statistic__card__footer");
        if (averageReviewsPerDayValue && footer && componentHash) {
          nativeNode?.querySelector("#average-reviews-per-day")?.remove();
          nativeNode?.querySelector(".Statistic__card__header")?.remove();
          nativeNode?.querySelector("#review-heatmap-header")?.remove();
          const newFooterElement = document.createElement("div");
          newFooterElement.id = "average-reviews-per-day";
          newFooterElement.setAttribute(componentHash, "");
          const firstSpan = document.createElement("span");
          firstSpan.textContent = "Average reviews per day: ";
          firstSpan.setAttribute(componentHash, "");
          firstSpan.classList.add("UiTypo", "UiTypo__caption", "-inline");
          newFooterElement.appendChild(firstSpan);
          const secondSpan = document.createElement("span");
          secondSpan.id = "average-reviews-per-day-value";
          secondSpan.textContent = averageReviewsPerDayValue || "";
          secondSpan.setAttribute(componentHash, "");
          secondSpan.classList.add("UiTypo", "UiTypo__heading4", "-heading", "-inline");
          newFooterElement.appendChild(secondSpan);
          footer.insertBefore(newFooterElement, footer.firstChild);
          const newHeaderElement = document.createElement("h3");
          newHeaderElement.textContent = "Review Heatmap";
          newHeaderElement.setAttribute(componentHash, "");
          newHeaderElement.classList.add("UiTypo", "UiTypo__heading3", "-heading", "Statistic__title");
          newHeaderElement.id = "review-heatmap-header";
          const card = nativeNode?.querySelector(".UiCard.-lesson.Statistic__card");
          card?.insertBefore(newHeaderElement, card?.firstChild);
        }
      }
      function restoreNativeNode() {
        if (nativeNode && originalParent) {
          if (originalNext) {
            originalParent.insertBefore(nativeNode, originalNext);
          } else {
            originalParent.appendChild(nativeNode);
          }
        }
      }
      vue.onMounted(async () => {
        await moveNativeNode();
      });
      vue.onBeforeUnmount(() => {
        restoreNativeNode();
      });
      vue.watch(() => appStore.language, async () => {
        await moveNativeNode();
      }, { deep: true });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "NativeStatsCard",
          ref_key: "domSlotRef",
          ref: domSlotRef
        }, null, 512);
      };
    }
  });
  const NativeStats = _export_sfc(_sfc_main$b, [["__scopeId", "data-v-628a8123"]]);
  const STORAGE_KEY$6 = "migaku-dueStats";
  const SETTINGS_KEY$6 = "migaku-dueStats-settings";
  const useDueStatsStore = pinia.defineStore("dueStats", () => {
    const dueStats = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const periodId = vue.ref("1 Month");
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$6);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.periodId && ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "All time"].includes(parsed.periodId)) periodId.value = parsed.periodId;
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(SETTINGS_KEY$6, JSON.stringify({ periodId: periodId.value }));
    }
    function setPeriod(newPeriodId) {
      periodId.value = newPeriodId;
    }
    loadSettingsFromStorage();
    vue.watch([periodId], saveSettingsToStorage);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$6);
        if (stored) dueStats.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load due stats.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$6, JSON.stringify(dueStats.value));
      } catch (err) {
        error.value = "Failed to save due stats.";
      }
    }
    vue.watch(dueStats, saveToStorage, { deep: true });
    async function fetchDueStatsIfNeeded(lang, deckId, periodIdParam = periodId.value) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchDueStats(lang, deckId, periodIdParam);
        dueStats.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Due stats fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      dueStats.value = null;
      await reloadDatabase();
      return fetchDueStatsIfNeeded(lang, deckId, periodId.value);
    }
    function setDueStats(stats) {
      dueStats.value = stats;
    }
    function clearDueStats() {
      dueStats.value = null;
    }
    return {
      dueStats,
      isLoading,
      error,
      periodId,
      setDueStats,
      clearDueStats,
      fetchDueStatsIfNeeded,
      refetch,
      loadFromStorage,
      setPeriod,
      loadSettingsFromStorage
    };
  });
  const _hoisted_1$9 = { style: { "height": "calc(100% - 56px)", "min-width": "100%", "display": "flex", "align-items": "flex-end", "justify-content": "center" } };
  const _hoisted_2$9 = {
    key: 1,
    class: "MCS__due-skeleton-container"
  };
  const _hoisted_3$9 = { class: "MCS__due-skeleton-bar-chart" };
  const _hoisted_4$7 = { key: 2 };
  const _hoisted_5$7 = { key: 3 };
  const _sfc_main$a = vue.defineComponent({
    __name: "CardsDue",
    setup(__props) {
      chart_js.Chart.register(
        chart_js.BarElement,
        chart_js.LineElement,
        chart_js.PointElement,
        chart_js.CategoryScale,
        chart_js.LinearScale,
        chart_js.Tooltip,
        chart_js.Legend
      );
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(
        () => THEME_CONFIGS[theme.value.toUpperCase()]
      );
      const dueStatsStore = useDueStatsStore();
      const dueStats = vue.computed(() => dueStatsStore.dueStats);
      const isLoading = vue.computed(() => dueStatsStore.isLoading);
      const error = vue.computed(() => dueStatsStore.error);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const periodId = vue.computed(() => dueStatsStore.periodId);
      const cardsDueContainer = vue.ref(null);
      const shouldHideDates = vue.ref(false);
      const shouldHideLateralLabels = vue.ref(false);
      function checkResize() {
        if (!cardsDueContainer.value) return;
        let hideDates = false;
        const cardsDueCard = cardsStore.cards.find((c2) => c2.item.i === "CardsDue");
        if (cardsDueCard && cardsDueCard.item.h <= 5) {
          hideDates = true;
        } else {
          hideDates = false;
        }
        if (cardsDueCard && cardsDueCard.item.w <= 4) {
          shouldHideLateralLabels.value = true;
        } else {
          shouldHideLateralLabels.value = false;
        }
        shouldHideDates.value = hideDates;
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkResize);
        vue.nextTick(() => {
          checkResize();
        });
        if (language.value) {
          await dueStatsStore.refetch(language.value, selectedDeckId.value);
        }
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", checkResize);
      });
      vue.watch(
        [dueStats, isLoading, error, () => cardsStore],
        async () => {
          await vue.nextTick();
          checkResize();
        },
        { deep: true }
      );
      vue.watch(
        [language, selectedDeckId, periodId],
        async ([lang, deckId, period], _prev, onCleanup) => {
          if (!lang) return;
          const fetchPromise = dueStatsStore.fetchDueStatsIfNeeded(lang, deckId, period);
          let cancelled = false;
          onCleanup(() => cancelled = true);
          await fetchPromise;
          if (cancelled) return;
        }
      );
      const cardsDueMenuSettings = [
        {
          key: "periodId",
          label: "Period",
          type: "dropdown",
          options: ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "All time"],
          value: periodId.value,
          displayPrefix: "Next "
        }
      ];
      const menuSettingValues = vue.computed(() => ({
        periodId: periodId.value
      }));
      function updateMenuSettings(newVals) {
        dueStatsStore.setPeriod(newVals.periodId);
      }
      const chartData = vue.computed(() => {
        if (!dueStats.value || !dueStats.value.labels || !dueStats.value.counts) {
          return { labels: [], datasets: [] };
        }
        const { labels, counts, learningCounts, knownCounts } = dueStats.value;
        const cumulativeCounts = [];
        let runningSum = 0;
        for (let i2 = 0; i2 < counts.length; i2++) {
          runningSum += counts[i2];
          cumulativeCounts.push(runningSum);
        }
        const datasets = [];
        if (learningCounts && knownCounts) {
          datasets.push({
            label: "Learning",
            data: learningCounts,
            backgroundColor: themeColors.value.barColor.includes("rgba") ? themeColors.value.barColor.replace(/,\s*[\d.]+\)$/, ", 0.5)") : themeColors.value.barColor + "40",
            borderWidth: 0,
            borderRadius: 4,
            order: 4,
            stack: "bargroup"
          });
          datasets.push({
            label: "Known",
            data: knownCounts,
            backgroundColor: themeColors.value.barColor.includes("rgba") ? themeColors.value.barColor.replace(/,\s*[\d.]+\)$/, ", 1)") : themeColors.value.barColor + "1A",
            borderWidth: 0,
            borderRadius: 4,
            order: 3,
            stack: "bargroup"
          });
        } else {
          datasets.push({
            label: "Cards Due",
            data: counts,
            backgroundColor: themeColors.value.barColor,
            borderWidth: 0,
            borderRadius: 4,
            order: 2,
            stack: "bargroup"
          });
        }
        datasets.push({
          label: "Cumulative Cards",
          data: cumulativeCounts,
          type: "line",
          borderColor: themeColors.value.unknownColor,
          backgroundColor: themeColors.value.unknownColor,
          borderWidth: 2,
          pointStyle: false,
          tension: 0.4,
          fill: "origin",
          yAxisID: "y1",
          order: 1
        });
        return { labels, datasets };
      });
      const chartOptions = vue.computed(() => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: "easeOutQuart"
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              title: {
                display: !shouldHideLateralLabels.value,
                text: "Cards Due",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 0,
                display: !shouldHideLateralLabels.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            },
            y1: {
              position: "right",
              beginAtZero: true,
              title: {
                display: !shouldHideLateralLabels.value,
                text: "Cumulative Cards",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 0,
                display: !shouldHideLateralLabels.value
              },
              grid: {
                drawOnChartArea: false
              }
            },
            x: {
              stacked: true,
              title: {
                display: !shouldHideDates.value,
                text: "Date",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                maxRotation: 45,
                minRotation: 45,
                display: !shouldHideDates.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: themeColors.value.textColor,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                },
                label: function(context) {
                  const datasetLabel = context.dataset.label || "";
                  const value = context.parsed.y;
                  const cumulativeCounts = context.chart.data.datasets.find(
                    (ds) => ds.label === "Cumulative Cards"
                  )?.data || [];
                  const total = cumulativeCounts[cumulativeCounts.length - 1] || 0;
                  const percentage = total > 0 ? (value / total * 100).toFixed(1) : "0.0";
                  return `${datasetLabel}: ${value} (${percentage}%)`;
                },
                footer: function(context) {
                  const values = context.filter((i2) => i2.dataset.label.includes("Cumulative")).map((i2) => i2.parsed.y);
                  return values.length > 0 ? `Total: ${values.reduce((a2, b2) => a2 + b2, 0)}` : "";
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              footerColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            }
          }
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "cardsDueContainer",
          ref: cardsDueContainer
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Cards Due ", 16),
          vue.createElementVNode("div", _hoisted_1$9, [
            dueStats.value && dueStats.value.labels && dueStats.value.counts && !isLoading.value && !error.value ? (vue.openBlock(), vue.createBlock(vue.unref(Bar), {
              key: 0,
              data: chartData.value,
              options: chartOptions.value,
              style: { "width": "100%", "height": "100%" }
            }, null, 8, ["data", "options"])) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$9, [
              vue.createElementVNode("div", _hoisted_3$9, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(30, (n) => {
                  return vue.createElementVNode("div", {
                    key: n,
                    class: "MCS__due-skeleton-bar",
                    style: vue.normalizeStyle({
                      height: `${Math.floor(Math.random() * 80) + 10}%`,
                      flex: "1 1 0",
                      margin: "0 2px"
                    })
                  }, [..._cache[0] || (_cache[0] = [
                    vue.createElementVNode("span", { class: "UiSkeleton" }, null, -1)
                  ])], 4);
                }), 64))
              ])
            ])) : error.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$7, vue.toDisplayString(error.value), 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$7, "Could not load due card data.")),
            !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 4,
              settings: cardsDueMenuSettings,
              modelValue: menuSettingValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true)
          ])
        ], 16);
      };
    }
  });
  const CardsDue = _export_sfc(_sfc_main$a, [["__scopeId", "data-v-3292d4e4"]]);
  const STORAGE_KEY$5 = "migaku-reviewHistory";
  const SETTINGS_KEY$5 = "migaku-reviewHistory-settings";
  const useReviewHistoryStore = pinia.defineStore("reviewHistory", () => {
    const reviewHistory = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const grouping = vue.ref("Days");
    const periodId = vue.ref("1 Month");
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$5);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.grouping && ["Days", "Weeks", "Months"].includes(parsed.grouping)) grouping.value = parsed.grouping;
          if (parsed.periodId && ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "All time"].includes(parsed.periodId)) periodId.value = parsed.periodId;
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(SETTINGS_KEY$5, JSON.stringify({ grouping: grouping.value, periodId: periodId.value }));
    }
    function setGroupingAndPeriod(newGrouping, newPeriodId) {
      grouping.value = newGrouping;
      periodId.value = newPeriodId;
    }
    loadSettingsFromStorage();
    vue.watch([grouping, periodId], saveSettingsToStorage);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$5);
        if (stored) reviewHistory.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load review history.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$5, JSON.stringify(reviewHistory.value));
      } catch (err) {
        error.value = "Failed to save review history.";
      }
    }
    vue.watch(reviewHistory, saveToStorage, { deep: true });
    async function fetchReviewHistoryIfNeeded(lang, deckId, periodIdParam = periodId.value, groupingParam = grouping.value) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchReviewHistory(lang, deckId, periodIdParam, groupingParam);
        reviewHistory.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Review history fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      reviewHistory.value = null;
      await reloadDatabase();
      await fetchReviewHistoryIfNeeded(lang, deckId, periodId.value, grouping.value);
    }
    function setReviewHistory(stats) {
      reviewHistory.value = stats;
    }
    function clearReviewHistory() {
      reviewHistory.value = null;
    }
    return {
      reviewHistory,
      isLoading,
      error,
      grouping,
      periodId,
      setReviewHistory,
      clearReviewHistory,
      fetchReviewHistoryIfNeeded,
      refetch,
      loadFromStorage,
      setGroupingAndPeriod,
      loadSettingsFromStorage
    };
  });
  const _hoisted_1$8 = { style: { "height": "calc(100% - 56px)", "min-width": "100%", "display": "flex", "align-items": "flex-end", "justify-content": "center", "position": "relative" } };
  const _hoisted_2$8 = {
    key: 1,
    class: "MCS__due-skeleton-container"
  };
  const _hoisted_3$8 = { class: "MCS__due-skeleton-bar-chart" };
  const _hoisted_4$6 = { key: 2 };
  const _hoisted_5$6 = { key: 3 };
  const _sfc_main$9 = vue.defineComponent({
    __name: "ReviewHistory",
    setup(__props) {
      chart_js.Chart.register(
        chart_js.BarElement,
        chart_js.LineElement,
        chart_js.PointElement,
        chart_js.CategoryScale,
        chart_js.LinearScale,
        chart_js.Tooltip,
        chart_js.Legend
      );
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(
        () => THEME_CONFIGS[theme.value.toUpperCase()]
      );
      const reviewHistoryStore = useReviewHistoryStore();
      const reviewHistory = vue.computed(() => reviewHistoryStore.reviewHistory);
      const isLoading = vue.computed(() => reviewHistoryStore.isLoading);
      const error = vue.computed(() => reviewHistoryStore.error);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const grouping = vue.computed({
        get: () => reviewHistoryStore.grouping,
        set: (v2) => reviewHistoryStore.setGroupingAndPeriod(v2, reviewHistoryStore.periodId)
      });
      const periodId = vue.computed({
        get: () => reviewHistoryStore.periodId,
        set: (v2) => reviewHistoryStore.setGroupingAndPeriod(reviewHistoryStore.grouping, v2)
      });
      const reviewHistoryContainer = vue.ref(null);
      const shouldHideDates = vue.ref(false);
      const shouldHideLateralLabels = vue.ref(false);
      function checkResize() {
        if (!reviewHistoryContainer.value) return;
        let hideDates = false;
        const reviewHistoryCard = cardsStore.cards.find(
          (c2) => c2.item.i === "ReviewHistory"
        );
        if (reviewHistoryCard && reviewHistoryCard.item.h <= 5) {
          hideDates = true;
        } else {
          hideDates = false;
        }
        if (reviewHistoryCard && reviewHistoryCard.item.w <= 4) {
          shouldHideLateralLabels.value = true;
        } else {
          shouldHideLateralLabels.value = false;
        }
        shouldHideDates.value = hideDates;
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkResize);
        vue.nextTick(() => {
          checkResize();
        });
        if (language.value) {
          await reviewHistoryStore.refetch(language.value, selectedDeckId.value);
        }
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", checkResize);
      });
      vue.watch(
        [reviewHistory, isLoading, error, () => cardsStore],
        async () => {
          await vue.nextTick();
          checkResize();
        },
        { deep: true }
      );
      vue.watch(
        [language, selectedDeckId, periodId, grouping],
        async ([lang, deckId, period, group], _prev, onCleanup) => {
          if (!lang) return;
          const fetchPromise = reviewHistoryStore.fetchReviewHistoryIfNeeded(
            lang,
            deckId,
            period,
            group
          );
          let cancelled = false;
          onCleanup(() => cancelled = true);
          await fetchPromise;
          if (cancelled) return;
        }
      );
      const chartData = vue.computed(() => {
        if (!reviewHistory.value || !reviewHistory.value.labels || !reviewHistory.value.counts) {
          return { labels: [], datasets: [] };
        }
        const { labels, counts, typeLabels } = reviewHistory.value;
        const datasets = counts.map((arr, idx) => ({
          label: typeLabels && typeLabels[idx] ? typeLabels[idx] : `Type ${idx}`,
          data: arr,
          backgroundColor: [
            themeColors.value.accent1,
            themeColors.value.accent2,
            themeColors.value.accent3
          ][idx % 3],
          borderWidth: 0,
          borderRadius: 4,
          order: -idx,
          stack: "bargroup"
        }));
        return { labels, datasets };
      });
      const chartOptions = vue.computed(() => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: "easeOutQuart"
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              title: {
                display: !shouldHideLateralLabels.value,
                text: "Cards",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 0,
                display: !shouldHideLateralLabels.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            },
            x: {
              stacked: true,
              title: {
                display: !shouldHideDates.value,
                text: "Date",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                maxRotation: 45,
                minRotation: 45,
                display: !shouldHideDates.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: themeColors.value.textColor,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                },
                label: function(context) {
                  const datasetLabel = context.dataset.label || "";
                  const value = context.parsed.y;
                  const allData = context.chart.data.datasets.reduce(
                    (acc, ds) => acc + (Array.isArray(ds.data) ? ds.data[context.dataIndex] ?? 0 : 0),
                    0
                  );
                  const percentage = allData > 0 ? (value / allData * 100).toFixed(1) : "0.0";
                  return `${datasetLabel}: ${value} (${percentage}%)`;
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              footerColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            }
          }
        };
      });
      const reviewHistoryMenuSettings = [
        {
          key: "grouping",
          label: "Grouping",
          type: "dropdown",
          options: ["Days", "Weeks", "Months"],
          value: grouping.value
        },
        {
          key: "periodId",
          label: "Period",
          type: "dropdown",
          options: ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "All time"],
          value: periodId.value,
          displayPrefix: "Last "
        }
      ];
      const menuSettingValues = vue.computed(() => ({
        grouping: grouping.value,
        periodId: periodId.value
      }));
      function updateMenuSettings(newVals) {
        reviewHistoryStore.setGroupingAndPeriod(newVals.grouping, newVals.periodId);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "reviewHistoryContainer",
          ref: reviewHistoryContainer
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Review History ", 16),
          vue.createElementVNode("div", _hoisted_1$8, [
            reviewHistory.value && reviewHistory.value.labels && reviewHistory.value.counts && !isLoading.value && !error.value ? (vue.openBlock(), vue.createBlock(vue.unref(Bar), {
              key: 0,
              data: chartData.value,
              options: chartOptions.value,
              style: { "width": "100%", "height": "100%" }
            }, null, 8, ["data", "options"])) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$8, [
              vue.createElementVNode("div", _hoisted_3$8, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(30, (n) => {
                  return vue.createElementVNode("div", {
                    key: n,
                    class: "MCS__due-skeleton-bar",
                    style: vue.normalizeStyle({
                      height: `${Math.floor(Math.random() * 80) + 10}%`,
                      flex: "1 1 0",
                      margin: "0 2px"
                    })
                  }, [..._cache[0] || (_cache[0] = [
                    vue.createElementVNode("span", { class: "UiSkeleton" }, null, -1)
                  ])], 4);
                }), 64))
              ])
            ])) : error.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$6, vue.toDisplayString(error.value), 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$6, "Could not load review history data.")),
            !isLoading.value && !error.value && !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 4,
              settings: reviewHistoryMenuSettings,
              modelValue: menuSettingValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true)
          ])
        ], 16);
      };
    }
  });
  const ReviewHistory = _export_sfc(_sfc_main$9, [["__scopeId", "data-v-2a35a85f"]]);
  const STORAGE_KEY$4 = "migaku-intervalStats";
  const SETTINGS_KEY$4 = "migaku-intervalStats-settings";
  const useIntervalStatsStore = pinia.defineStore("intervalStats", () => {
    const intervalStats = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const percentileId = vue.ref("75th");
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$4);
        if (data) {
          const parsed = JSON.parse(data);
          if (["50th", "75th", "95th", "100th"].includes(parsed.percentileId)) percentileId.value = parsed.percentileId;
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(SETTINGS_KEY$4, JSON.stringify({ percentileId: percentileId.value }));
    }
    function setPercentile(newPercentile) {
      percentileId.value = newPercentile;
    }
    loadSettingsFromStorage();
    vue.watch([percentileId], saveSettingsToStorage);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$4);
        if (stored) intervalStats.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load interval stats.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$4, JSON.stringify(intervalStats.value));
      } catch (err) {
        error.value = "Failed to save interval stats.";
      }
    }
    vue.watch(intervalStats, saveToStorage, { deep: true });
    async function fetchIntervalStatsIfNeeded(lang, deckId, percentileParam = percentileId.value) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchIntervalStats(lang, deckId, percentileParam);
        intervalStats.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Interval stats fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      intervalStats.value = null;
      await reloadDatabase();
      return fetchIntervalStatsIfNeeded(lang, deckId, percentileId.value);
    }
    return {
      intervalStats,
      isLoading,
      error,
      percentileId,
      setPercentile,
      fetchIntervalStatsIfNeeded,
      refetch,
      loadFromStorage,
      loadSettingsFromStorage
    };
  });
  const _hoisted_1$7 = { style: { "height": "calc(100% - 56px)", "min-width": "100%", "display": "flex", "align-items": "flex-end", "justify-content": "center", "position": "relative" } };
  const _hoisted_2$7 = {
    key: 1,
    class: "MCS__due-skeleton-container"
  };
  const _hoisted_3$7 = { class: "MCS__due-skeleton-bar-chart" };
  const _hoisted_4$5 = { key: 2 };
  const _hoisted_5$5 = { key: 3 };
  const _sfc_main$8 = vue.defineComponent({
    __name: "ReviewIntervals",
    setup(__props) {
      chart_js.Chart.register(
        chart_js.BarElement,
        chart_js.LineElement,
        chart_js.PointElement,
        chart_js.CategoryScale,
        chart_js.LinearScale,
        chart_js.Tooltip,
        chart_js.Legend
      );
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(
        () => THEME_CONFIGS[theme.value.toUpperCase()]
      );
      const intervalStatsStore = useIntervalStatsStore();
      const intervalStats = vue.computed(() => intervalStatsStore.intervalStats);
      const isLoading = vue.computed(() => intervalStatsStore.isLoading);
      const error = vue.computed(() => intervalStatsStore.error);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const percentileId = vue.computed(() => intervalStatsStore.percentileId);
      const containerRef = vue.ref(null);
      const shouldHideDates = vue.ref(false);
      const shouldHideLateralLabels = vue.ref(false);
      function checkResize() {
        if (!containerRef.value) return;
        const card = cardsStore.cards.find((c2) => c2.item.i === "ReviewIntervals");
        if (card && card.item.h <= 5) {
          shouldHideDates.value = true;
        } else {
          shouldHideDates.value = false;
        }
        if (card && card.item.w <= 4) {
          shouldHideLateralLabels.value = true;
        } else {
          shouldHideLateralLabels.value = false;
        }
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkResize);
        vue.nextTick(() => checkResize());
        if (language.value) {
          await intervalStatsStore.refetch(language.value, selectedDeckId.value);
        }
      });
      vue.onBeforeUnmount(() => window.removeEventListener("resize", checkResize));
      vue.watch(
        [intervalStats, isLoading, error, () => cardsStore],
        async () => {
          await vue.nextTick();
          checkResize();
        },
        { deep: true }
      );
      vue.watch(
        [language, selectedDeckId, percentileId],
        async ([lang, deckId, pct], _prev, onCleanup) => {
          if (!lang) return;
          const fetchPromise = intervalStatsStore.fetchIntervalStatsIfNeeded(
            lang,
            deckId,
            pct
          );
          let cancelled = false;
          onCleanup(() => cancelled = true);
          await fetchPromise;
          if (cancelled) return;
        }
      );
      const chartData = vue.computed(() => {
        if (!intervalStats.value || !intervalStats.value.labels || !intervalStats.value.counts) {
          return { labels: [], datasets: [] };
        }
        const labels = intervalStats.value.labels;
        const counts = intervalStats.value.counts;
        const cumulativeCounts = [];
        let sum = 0;
        for (const c2 of counts) {
          sum += c2;
          cumulativeCounts.push(sum);
        }
        const datasets = [
          {
            label: "Cards per Interval",
            data: counts,
            backgroundColor: themeColors.value.accent1,
            borderWidth: 0,
            borderRadius: 4,
            order: 2,
            stack: "bargroup"
          },
          {
            label: "Cumulative Cards",
            data: cumulativeCounts,
            type: "line",
            borderColor: themeColors.value.accent1Transparent,
            backgroundColor: themeColors.value.accent1Transparent,
            borderWidth: 2,
            pointStyle: false,
            tension: 0.4,
            fill: "origin",
            yAxisID: "y1",
            order: 1
          }
        ];
        return { labels, datasets };
      });
      const chartOptions = vue.computed(() => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800, easing: "easeOutQuart" },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: !shouldHideLateralLabels.value,
                text: "Number of Cards",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 0,
                display: !shouldHideLateralLabels.value
              },
              grid: { color: themeColors.value.gridColor }
            },
            y1: {
              position: "right",
              beginAtZero: true,
              title: {
                display: !shouldHideLateralLabels.value,
                text: "Cumulative Cards",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 0,
                display: !shouldHideLateralLabels.value
              },
              grid: { drawOnChartArea: false }
            },
            x: {
              title: {
                display: !shouldHideDates.value,
                text: "Review Interval (Days)",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                maxRotation: 45,
                minRotation: 45,
                display: !shouldHideDates.value
              },
              grid: { color: themeColors.value.gridColor }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: themeColors.value.textColor,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: (items) => items[0].label,
                label: (context) => {
                  const datasetLabel = context.dataset.label || "";
                  const value = context.parsed.y;
                  const cum = context.chart.data.datasets.find(
                    (d2) => d2.label === "Cumulative Cards"
                  )?.data || [];
                  const total = cum[cum.length - 1] || 0;
                  if (datasetLabel === "Cards per Interval" && value > 0) {
                    const pct = total > 0 ? (value / total * 100).toFixed(1) : "0.0";
                    return `${datasetLabel}: ${value} (${pct}%)`;
                  }
                  if (datasetLabel === "Cumulative Cards") {
                    const pct = total > 0 ? (value / total * 100).toFixed(1) : "0.0";
                    return `${datasetLabel}: ${value} (${pct}%)`;
                  }
                  return `${datasetLabel}: ${value}`;
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              footerColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            }
          }
        };
      });
      const menuSettings = [
        {
          key: "percentileId",
          label: "Percentile",
          type: "dropdown",
          options: ["50th", "75th", "95th", "100th"],
          value: percentileId.value
        }
      ];
      const menuValues = vue.computed(() => ({ percentileId: percentileId.value }));
      function updateMenuSettings(newVals) {
        intervalStatsStore.setPercentile(newVals.percentileId);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "containerRef",
          ref: containerRef
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Review Intervals ", 16),
          vue.createElementVNode("div", _hoisted_1$7, [
            intervalStats.value && intervalStats.value.labels && intervalStats.value.counts && !isLoading.value && !error.value ? (vue.openBlock(), vue.createBlock(vue.unref(Bar), {
              key: 0,
              data: chartData.value,
              options: chartOptions.value,
              style: { "width": "100%", "height": "100%" }
            }, null, 8, ["data", "options"])) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$7, [
              vue.createElementVNode("div", _hoisted_3$7, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(30, (n) => {
                  return vue.createElementVNode("div", {
                    key: n,
                    class: "MCS__due-skeleton-bar",
                    style: vue.normalizeStyle({
                      height: `${Math.floor(Math.random() * 80) + 10}%`,
                      flex: "1 1 0",
                      margin: "0 2px"
                    })
                  }, [..._cache[0] || (_cache[0] = [
                    vue.createElementVNode("span", { class: "UiSkeleton" }, null, -1)
                  ])], 4);
                }), 64))
              ])
            ])) : error.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$5, vue.toDisplayString(error.value), 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$5, "Could not load interval data.")),
            !isLoading.value && !error.value && !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 4,
              settings: menuSettings,
              modelValue: menuValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true)
          ])
        ], 16);
      };
    }
  });
  const ReviewIntervals = _export_sfc(_sfc_main$8, [["__scopeId", "data-v-bcca767d"]]);
  const STORAGE_KEY$3 = "migaku-studyStats";
  const SETTINGS_KEY$3 = "migaku-studyStats-settings";
  const useStudyStatsStore = pinia.defineStore("studyStats", () => {
    const studyStats = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const periodId = vue.ref("1 Month");
    const visibility = vue.ref({
      percGroup: true,
      totalsGroup: true,
      avgsGroup: true,
      timeGroup: true,
      daysStudiedPercent: true,
      passRate: true,
      totalReviews: true,
      avgReviewsPerDay: true,
      totalCardsAdded: true,
      cardsAddedPerDay: true,
      totalNewCards: true,
      newCardsPerDay: true,
      totalCardsLearned: true,
      cardsLearnedPerDay: true,
      totalTimeNewCards: true,
      avgTimeNewCard: true,
      totalTimeReviews: true,
      avgTimeReview: true
    });
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$3);
        if (data) {
          const parsed = JSON.parse(data);
          if ([
            "1 Month",
            "2 Months",
            "3 Months",
            "6 Months",
            "1 Year",
            "All time"
          ].includes(parsed.periodId))
            periodId.value = parsed.periodId;
          if (parsed.visibility && typeof parsed.visibility === "object")
            visibility.value = { ...visibility.value, ...parsed.visibility };
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(
        SETTINGS_KEY$3,
        JSON.stringify({ periodId: periodId.value, visibility: visibility.value })
      );
    }
    function setPeriod(newPeriodId) {
      periodId.value = newPeriodId;
    }
    loadSettingsFromStorage();
    vue.watch([periodId, visibility], saveSettingsToStorage, { deep: true });
    function setVisibility(key, value) {
      visibility.value = { ...visibility.value, [key]: value };
    }
    function setVisibilities(values) {
      visibility.value = { ...visibility.value, ...values };
    }
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$3);
        if (stored) studyStats.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load study stats.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$3, JSON.stringify(studyStats.value));
      } catch (err) {
        error.value = "Failed to save study stats.";
      }
    }
    vue.watch(studyStats, saveToStorage, { deep: true });
    async function fetchStudyStatsIfNeeded(lang, deckId, periodParam = periodId.value) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchStudyStats(lang, deckId, periodParam);
        studyStats.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Study stats fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      studyStats.value = null;
      await reloadDatabase();
      return fetchStudyStatsIfNeeded(lang, deckId, periodId.value);
    }
    return {
      studyStats,
      isLoading,
      error,
      periodId,
      visibility,
      setPeriod,
      setVisibility,
      setVisibilities,
      fetchStudyStatsIfNeeded,
      refetch,
      loadFromStorage,
      loadSettingsFromStorage
    };
  });
  const _hoisted_1$6 = { style: { "padding": "16px", "position": "relative", "min-height": "140px" } };
  const _hoisted_2$6 = {
    key: 1,
    class: "MCS__study-grid"
  };
  const _hoisted_3$6 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_4$4 = { class: "MCS__stat-value" };
  const _hoisted_5$4 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_6$1 = { class: "MCS__stat-value" };
  const _hoisted_7$1 = {
    key: 3,
    class: "MCS__study-grid"
  };
  const _hoisted_8$1 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_9$1 = { class: "MCS__stat-value" };
  const _hoisted_10$1 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_11 = { class: "MCS__stat-value" };
  const _hoisted_12 = {
    key: 2,
    class: "MCS__stat-box"
  };
  const _hoisted_13 = { class: "MCS__stat-value" };
  const _hoisted_14 = {
    key: 3,
    class: "MCS__stat-box"
  };
  const _hoisted_15 = { class: "MCS__stat-value" };
  const _hoisted_16 = {
    key: 5,
    class: "MCS__study-grid"
  };
  const _hoisted_17 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_18 = { class: "MCS__stat-value" };
  const _hoisted_19 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_20 = { class: "MCS__stat-value" };
  const _hoisted_21 = {
    key: 2,
    class: "MCS__stat-box"
  };
  const _hoisted_22 = { class: "MCS__stat-value" };
  const _hoisted_23 = {
    key: 3,
    class: "MCS__stat-box"
  };
  const _hoisted_24 = { class: "MCS__stat-value" };
  const _hoisted_25 = {
    key: 7,
    class: "MCS__study-grid"
  };
  const _hoisted_26 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_27 = { class: "MCS__stat-value" };
  const _hoisted_28 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_29 = { class: "MCS__stat-value" };
  const _hoisted_30 = {
    key: 2,
    class: "MCS__stat-box"
  };
  const _hoisted_31 = { class: "MCS__stat-value" };
  const _hoisted_32 = {
    key: 3,
    class: "MCS__stat-box"
  };
  const _hoisted_33 = { class: "MCS__stat-value" };
  const _hoisted_34 = {
    key: 1,
    class: "MCS__study-grid"
  };
  const _hoisted_35 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_36 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_37 = {
    key: 3,
    class: "MCS__study-grid"
  };
  const _hoisted_38 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_39 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_40 = {
    key: 2,
    class: "MCS__stat-box"
  };
  const _hoisted_41 = {
    key: 3,
    class: "MCS__stat-box"
  };
  const _hoisted_42 = {
    key: 5,
    class: "MCS__study-grid"
  };
  const _hoisted_43 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_44 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_45 = {
    key: 2,
    class: "MCS__stat-box"
  };
  const _hoisted_46 = {
    key: 3,
    class: "MCS__stat-box"
  };
  const _hoisted_47 = {
    key: 7,
    class: "MCS__study-grid"
  };
  const _hoisted_48 = {
    key: 0,
    class: "MCS__stat-box"
  };
  const _hoisted_49 = {
    key: 1,
    class: "MCS__stat-box"
  };
  const _hoisted_50 = {
    key: 2,
    class: "MCS__stat-box"
  };
  const _hoisted_51 = {
    key: 3,
    class: "MCS__stat-box"
  };
  const _hoisted_52 = { key: 2 };
  const _hoisted_53 = { key: 3 };
  const _sfc_main$7 = vue.defineComponent({
    __name: "StudyStatistics",
    setup(__props) {
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const studyStatsStore = useStudyStatsStore();
      const stats = vue.computed(() => studyStatsStore.studyStats);
      const isLoading = vue.computed(() => studyStatsStore.isLoading);
      const error = vue.computed(() => studyStatsStore.error);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const periodId = vue.computed(() => studyStatsStore.periodId);
      const visibility = vue.computed(() => studyStatsStore.visibility);
      const containerRef = vue.ref(null);
      vue.onMounted(async () => {
        if (language.value) await studyStatsStore.refetch(language.value, selectedDeckId.value);
      });
      vue.onBeforeUnmount(() => {
      });
      vue.watch([language, selectedDeckId, periodId], async ([lang, deck, period], _prev, onCleanup) => {
        if (!lang) return;
        const promise = studyStatsStore.fetchStudyStatsIfNeeded(lang, deck, period);
        let cancelled = false;
        onCleanup(() => cancelled = true);
        await promise;
        if (cancelled) return;
      });
      function formatTime(seconds) {
        if (seconds === 0 || !seconds) return "0s";
        const secs = Math.floor(seconds);
        const minutes = Math.floor(secs / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
          const remainingHours = hours % 24;
          return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
        }
        if (hours > 0) {
          const remainingMinutes = minutes % 60;
          return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
        }
        if (minutes > 0) {
          const remainingSeconds = secs % 60;
          return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
        }
        return `${secs}s`;
      }
      const menuSettings = [
        {
          key: "periodId",
          label: "Period",
          type: "dropdown",
          options: ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "All time"],
          value: periodId.value,
          displayPrefix: "Last "
        },
        {
          key: "percGroup",
          label: "Percentages (group)",
          type: "group",
          value: visibility.value.percGroup,
          children: [
            { key: "daysStudiedPercent", label: "Days studied %", type: "switch", value: visibility.value.daysStudiedPercent },
            { key: "passRate", label: "Pass rate", type: "switch", value: visibility.value.passRate }
          ]
        },
        {
          key: "totalsGroup",
          label: "Totals (group)",
          type: "group",
          value: visibility.value.totalsGroup,
          children: [
            { key: "totalReviews", label: "Total reviews", type: "switch", value: visibility.value.totalReviews },
            { key: "totalCardsAdded", label: "Total cards added", type: "switch", value: visibility.value.totalCardsAdded },
            { key: "totalNewCards", label: "Total new cards reviewed", type: "switch", value: visibility.value.totalNewCards },
            { key: "totalCardsLearned", label: "Total cards learned", type: "switch", value: visibility.value.totalCardsLearned }
          ]
        },
        {
          key: "avgsGroup",
          label: "Averages (group)",
          type: "group",
          value: visibility.value.avgsGroup,
          children: [
            { key: "avgReviewsPerDay", label: "Avg. reviews/day", type: "switch", value: visibility.value.avgReviewsPerDay },
            { key: "cardsAddedPerDay", label: "Avg. cards added/day", type: "switch", value: visibility.value.cardsAddedPerDay },
            { key: "newCardsPerDay", label: "Avg. new cards/day", type: "switch", value: visibility.value.newCardsPerDay },
            { key: "cardsLearnedPerDay", label: "Avg. cards learned/day", type: "switch", value: visibility.value.cardsLearnedPerDay }
          ]
        },
        {
          key: "timeGroup",
          label: "Time (group)",
          type: "group",
          value: visibility.value.timeGroup,
          children: [
            { key: "totalTimeNewCards", label: "Total time on new cards", type: "switch", value: visibility.value.totalTimeNewCards },
            { key: "avgTimeNewCard", label: "Avg. time/new card", type: "switch", value: visibility.value.avgTimeNewCard },
            { key: "totalTimeReviews", label: "Total time on reviews", type: "switch", value: visibility.value.totalTimeReviews },
            { key: "avgTimeReview", label: "Avg. time/review", type: "switch", value: visibility.value.avgTimeReview }
          ]
        }
      ];
      const menuValues = vue.computed(() => ({ periodId: periodId.value, ...visibility.value }));
      function updateMenuSettings(newVals) {
        if (newVals.periodId && newVals.periodId !== periodId.value) studyStatsStore.setPeriod(newVals.periodId);
        const current = visibility.value;
        const updated = { ...current };
        for (const k2 in updated) {
          if (k2 in newVals) updated[k2] = !!newVals[k2];
        }
        studyStatsStore.setVisibilities(updated);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "containerRef",
          ref: containerRef
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), "Study Statistics", 16),
          vue.createElementVNode("div", _hoisted_1$6, [
            stats.value && !isLoading.value && !error.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              visibility.value.percGroup && (visibility.value.daysStudiedPercent || visibility.value.passRate) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 0,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Percentages", 16)) : vue.createCommentVNode("", true),
              visibility.value.percGroup && (visibility.value.daysStudiedPercent || visibility.value.passRate) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$6, [
                visibility.value.percGroup && visibility.value.daysStudiedPercent ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$6, [
                  vue.createElementVNode("div", _hoisted_4$4, vue.toDisplayString(stats.value.days_studied_percent) + "%", 1),
                  _cache[0] || (_cache[0] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "of days studied", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.percGroup && visibility.value.passRate ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$4, [
                  vue.createElementVNode("div", _hoisted_6$1, vue.toDisplayString(stats.value.pass_rate) + "%", 1),
                  _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Pass rate", -1))
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              visibility.value.totalsGroup && (visibility.value.totalReviews || visibility.value.totalCardsAdded || visibility.value.totalNewCards || visibility.value.totalCardsLearned) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 2,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Totals", 16)) : vue.createCommentVNode("", true),
              visibility.value.totalsGroup && (visibility.value.totalReviews || visibility.value.totalCardsAdded || visibility.value.totalNewCards || visibility.value.totalCardsLearned) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7$1, [
                visibility.value.totalsGroup && visibility.value.totalReviews ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$1, [
                  vue.createElementVNode("div", _hoisted_9$1, vue.toDisplayString(stats.value.total_reviews.toLocaleString()), 1),
                  _cache[2] || (_cache[2] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Total reviews", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.totalsGroup && visibility.value.totalCardsAdded ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$1, [
                  vue.createElementVNode("div", _hoisted_11, vue.toDisplayString(stats.value.total_cards_added.toLocaleString()), 1),
                  _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Total cards added", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.totalsGroup && visibility.value.totalNewCards ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
                  vue.createElementVNode("div", _hoisted_13, vue.toDisplayString(stats.value.total_new_cards.toLocaleString()), 1),
                  _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Total new cards reviewed", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.totalsGroup && visibility.value.totalCardsLearned ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14, [
                  vue.createElementVNode("div", _hoisted_15, vue.toDisplayString(stats.value.total_cards_learned.toLocaleString()), 1),
                  _cache[5] || (_cache[5] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Total cards learned", -1))
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              visibility.value.avgsGroup && (visibility.value.avgReviewsPerDay || visibility.value.cardsAddedPerDay || visibility.value.newCardsPerDay || visibility.value.cardsLearnedPerDay) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 4,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Averages", 16)) : vue.createCommentVNode("", true),
              visibility.value.avgsGroup && (visibility.value.avgReviewsPerDay || visibility.value.cardsAddedPerDay || visibility.value.newCardsPerDay || visibility.value.cardsLearnedPerDay) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16, [
                visibility.value.avgsGroup && visibility.value.avgReviewsPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_17, [
                  vue.createElementVNode("div", _hoisted_18, vue.toDisplayString(stats.value.avg_reviews_per_calendar_day), 1),
                  _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Avg. reviews/day", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.avgsGroup && visibility.value.cardsAddedPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19, [
                  vue.createElementVNode("div", _hoisted_20, vue.toDisplayString(stats.value.cards_added_per_day), 1),
                  _cache[7] || (_cache[7] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Avg. cards added/day", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.avgsGroup && visibility.value.newCardsPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_21, [
                  vue.createElementVNode("div", _hoisted_22, vue.toDisplayString(stats.value.new_cards_per_day), 1),
                  _cache[8] || (_cache[8] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Avg. new cards/day", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.avgsGroup && visibility.value.cardsLearnedPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_23, [
                  vue.createElementVNode("div", _hoisted_24, vue.toDisplayString(stats.value.cards_learned_per_day), 1),
                  _cache[9] || (_cache[9] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Avg. cards learned/day", -1))
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              visibility.value.timeGroup && (visibility.value.totalTimeNewCards || visibility.value.avgTimeNewCard || visibility.value.totalTimeReviews || visibility.value.avgTimeReview) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 6,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Time", 16)) : vue.createCommentVNode("", true),
              visibility.value.timeGroup && (visibility.value.totalTimeNewCards || visibility.value.avgTimeNewCard || visibility.value.totalTimeReviews || visibility.value.avgTimeReview) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_25, [
                visibility.value.timeGroup && visibility.value.totalTimeNewCards ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_26, [
                  vue.createElementVNode("div", _hoisted_27, vue.toDisplayString(formatTime(stats.value.total_time_new_cards_seconds)), 1),
                  _cache[10] || (_cache[10] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Total time on new cards", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.timeGroup && visibility.value.avgTimeNewCard ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_28, [
                  vue.createElementVNode("div", _hoisted_29, vue.toDisplayString(formatTime(stats.value.avg_time_new_card_seconds)), 1),
                  _cache[11] || (_cache[11] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Avg. time/new card", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.timeGroup && visibility.value.totalTimeReviews ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_30, [
                  vue.createElementVNode("div", _hoisted_31, vue.toDisplayString(formatTime(stats.value.total_time_reviews_seconds)), 1),
                  _cache[12] || (_cache[12] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Total time on reviews", -1))
                ])) : vue.createCommentVNode("", true),
                visibility.value.timeGroup && visibility.value.avgTimeReview ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_32, [
                  vue.createElementVNode("div", _hoisted_33, vue.toDisplayString(formatTime(stats.value.avg_time_review_seconds)), 1),
                  _cache[13] || (_cache[13] = vue.createElementVNode("div", { class: "MCS__stat-label" }, "Avg. time/review", -1))
                ])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true)
            ], 64)) : isLoading.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              visibility.value.percGroup && (visibility.value.daysStudiedPercent || visibility.value.passRate) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 0,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Percentages", 16)) : vue.createCommentVNode("", true),
              visibility.value.percGroup && (visibility.value.daysStudiedPercent || visibility.value.passRate) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_34, [
                visibility.value.percGroup && visibility.value.daysStudiedPercent ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_35, [..._cache[14] || (_cache[14] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "28px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.percGroup && visibility.value.passRate ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_36, [..._cache[15] || (_cache[15] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "28px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              visibility.value.totalsGroup && (visibility.value.totalReviews || visibility.value.totalCardsAdded || visibility.value.totalNewCards || visibility.value.totalCardsLearned) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 2,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Totals", 16)) : vue.createCommentVNode("", true),
              visibility.value.totalsGroup && (visibility.value.totalReviews || visibility.value.totalCardsAdded || visibility.value.totalNewCards || visibility.value.totalCardsLearned) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_37, [
                visibility.value.totalsGroup && visibility.value.totalReviews ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_38, [..._cache[16] || (_cache[16] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.totalsGroup && visibility.value.totalCardsAdded ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_39, [..._cache[17] || (_cache[17] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.totalsGroup && visibility.value.totalNewCards ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_40, [..._cache[18] || (_cache[18] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.totalsGroup && visibility.value.totalCardsLearned ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_41, [..._cache[19] || (_cache[19] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              visibility.value.avgsGroup && (visibility.value.avgReviewsPerDay || visibility.value.cardsAddedPerDay || visibility.value.newCardsPerDay || visibility.value.cardsLearnedPerDay) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 4,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Averages", 16)) : vue.createCommentVNode("", true),
              visibility.value.avgsGroup && (visibility.value.avgReviewsPerDay || visibility.value.cardsAddedPerDay || visibility.value.newCardsPerDay || visibility.value.cardsLearnedPerDay) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_42, [
                visibility.value.avgsGroup && visibility.value.avgReviewsPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_43, [..._cache[20] || (_cache[20] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.avgsGroup && visibility.value.cardsAddedPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_44, [..._cache[21] || (_cache[21] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.avgsGroup && visibility.value.newCardsPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_45, [..._cache[22] || (_cache[22] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.avgsGroup && visibility.value.cardsLearnedPerDay ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_46, [..._cache[23] || (_cache[23] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              visibility.value.timeGroup && (visibility.value.totalTimeNewCards || visibility.value.avgTimeNewCard || visibility.value.totalTimeReviews || visibility.value.avgTimeReview) ? (vue.openBlock(), vue.createElementBlock("h4", vue.normalizeProps({
                key: 6,
                [componentHash.value || ""]: true,
                class: "UiTypo UiTypo__heading4 -heading"
              }), "Time", 16)) : vue.createCommentVNode("", true),
              visibility.value.timeGroup && (visibility.value.totalTimeNewCards || visibility.value.avgTimeNewCard || visibility.value.totalTimeReviews || visibility.value.avgTimeReview) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_47, [
                visibility.value.timeGroup && visibility.value.totalTimeNewCards ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_48, [..._cache[24] || (_cache[24] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.timeGroup && visibility.value.avgTimeNewCard ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_49, [..._cache[25] || (_cache[25] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.timeGroup && visibility.value.totalTimeReviews ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_50, [..._cache[26] || (_cache[26] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true),
                visibility.value.timeGroup && visibility.value.avgTimeReview ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_51, [..._cache[27] || (_cache[27] = [
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "60%", "height": "24px", "border-radius": "8px" }
                  }, null, -1),
                  vue.createElementVNode("span", {
                    class: "UiSkeleton",
                    style: { "width": "70%", "height": "14px", "margin-top": "8px", "border-radius": "8px" }
                  }, null, -1)
                ])])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true)
            ], 64)) : error.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_52, vue.toDisplayString(error.value), 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_53, "Could not load study statistics.")),
            !isLoading.value && !error.value && !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 4,
              settings: menuSettings,
              modelValue: menuValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 },
              width: 350
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true)
          ])
        ], 16);
      };
    }
  });
  const StudyStatistics = _export_sfc(_sfc_main$7, [["__scopeId", "data-v-a204a33d"]]);
  const STORAGE_KEY$2 = "migaku-timeStats";
  const SETTINGS_KEY$2 = "migaku-timeStats-settings";
  const useTimeStatsStore = pinia.defineStore("timeStats", () => {
    const timeHistory = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const viewMode = vue.ref("totals");
    const grouping = vue.ref("Days");
    const periodId = vue.ref("1 Month");
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$2);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.viewMode && ["totals", "averages"].includes(parsed.viewMode)) {
            viewMode.value = parsed.viewMode;
          }
          if (parsed.grouping && ["Days", "Weeks", "Months"].includes(parsed.grouping)) {
            grouping.value = parsed.grouping;
          }
          if (parsed.periodId && [
            "1 Month",
            "2 Months",
            "3 Months",
            "6 Months",
            "1 Year",
            "All time"
          ].includes(parsed.periodId)) {
            periodId.value = parsed.periodId;
          }
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(
        SETTINGS_KEY$2,
        JSON.stringify({
          viewMode: viewMode.value,
          grouping: grouping.value,
          periodId: periodId.value
        })
      );
    }
    function setViewMode(mode) {
      viewMode.value = mode;
    }
    function setGroupingAndPeriod(newGrouping, newPeriodId) {
      grouping.value = newGrouping;
      periodId.value = newPeriodId;
    }
    loadSettingsFromStorage();
    vue.watch([viewMode, grouping, periodId], saveSettingsToStorage);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$2);
        if (stored) timeHistory.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load time history.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$2, JSON.stringify(timeHistory.value));
      } catch (err) {
        error.value = "Failed to save time history.";
      }
    }
    vue.watch(timeHistory, saveToStorage, { deep: true });
    async function fetchTimeHistoryIfNeeded(lang, deckId, periodIdParam = periodId.value, groupingParam = grouping.value, viewModeParam = viewMode.value) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchTimeHistory(
          lang,
          deckId,
          periodIdParam,
          groupingParam,
          viewModeParam
        );
        timeHistory.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Time history fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      timeHistory.value = null;
      await reloadDatabase();
      await fetchTimeHistoryIfNeeded(
        lang,
        deckId,
        periodId.value,
        grouping.value,
        viewMode.value
      );
    }
    return {
      timeHistory,
      isLoading,
      error,
      viewMode,
      grouping,
      periodId,
      setViewMode,
      setGroupingAndPeriod,
      fetchTimeHistoryIfNeeded,
      refetch,
      loadFromStorage,
      loadSettingsFromStorage
    };
  });
  const _hoisted_1$5 = { style: { "height": "calc(100% - 56px)", "min-width": "100%", "display": "flex", "align-items": "flex-end", "justify-content": "center", "position": "relative" } };
  const _hoisted_2$5 = {
    key: 1,
    class: "MCS__time-skeleton-container"
  };
  const _hoisted_3$5 = { class: "MCS__time-skeleton-bar-chart" };
  const _hoisted_4$3 = { key: 2 };
  const _hoisted_5$3 = { key: 3 };
  const _sfc_main$6 = vue.defineComponent({
    __name: "TimeChart",
    setup(__props) {
      chart_js.Chart.register(chart_js.BarElement, chart_js.CategoryScale, chart_js.LinearScale, chart_js.Tooltip, chart_js.Legend);
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(
        () => THEME_CONFIGS[theme.value.toUpperCase()]
      );
      const timeStatsStore = useTimeStatsStore();
      const timeHistory = vue.computed(() => timeStatsStore.timeHistory);
      const isLoading = vue.computed(() => timeStatsStore.isLoading);
      const error = vue.computed(() => timeStatsStore.error);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const viewMode = vue.computed({
        get: () => timeStatsStore.viewMode === "totals" ? "Total time" : "Average time",
        set: (v2) => timeStatsStore.setViewMode(v2 === "Total time" ? "totals" : "averages")
      });
      const grouping = vue.computed({
        get: () => timeStatsStore.grouping,
        set: (v2) => timeStatsStore.setGroupingAndPeriod(v2, timeStatsStore.periodId)
      });
      const periodId = vue.computed({
        get: () => timeStatsStore.periodId,
        set: (v2) => timeStatsStore.setGroupingAndPeriod(timeStatsStore.grouping, v2)
      });
      const timeChartContainer = vue.ref(null);
      const shouldHideDates = vue.ref(false);
      const shouldHideLateralLabels = vue.ref(false);
      function checkResize() {
        if (!timeChartContainer.value) return;
        let hideDates = false;
        const timeChartCard = cardsStore.cards.find((c2) => c2.item.i === "TimeChart");
        if (timeChartCard && timeChartCard.item.h <= 5) {
          hideDates = true;
        } else {
          hideDates = false;
        }
        if (timeChartCard && timeChartCard.item.w <= 4) {
          shouldHideLateralLabels.value = true;
        } else {
          shouldHideLateralLabels.value = false;
        }
        shouldHideDates.value = hideDates;
      }
      function formatTime(seconds) {
        if (seconds === 0 || !seconds) return "0s";
        const secs = Math.floor(seconds);
        const minutes = Math.floor(secs / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
          const remainingHours = hours % 24;
          return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
        }
        if (hours > 0) {
          const remainingMinutes = minutes % 60;
          return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
        }
        if (minutes > 0) {
          const remainingSeconds = secs % 60;
          return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
        }
        return `${secs}s`;
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkResize);
        vue.nextTick(() => {
          checkResize();
        });
        if (language.value) {
          await timeStatsStore.refetch(language.value, selectedDeckId.value);
        }
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", checkResize);
      });
      vue.watch(
        [timeHistory, isLoading, error, () => cardsStore],
        async () => {
          await vue.nextTick();
          checkResize();
        },
        { deep: true }
      );
      vue.watch(
        [language, selectedDeckId, periodId, grouping, () => timeStatsStore.viewMode],
        async ([lang, deckId, period, group, mode], _prev, onCleanup) => {
          if (!lang) return;
          const fetchPromise = timeStatsStore.fetchTimeHistoryIfNeeded(
            lang,
            deckId,
            period,
            group,
            mode
          );
          let cancelled = false;
          onCleanup(() => cancelled = true);
          await fetchPromise;
          if (cancelled) return;
        }
      );
      const menuSettings = [
        {
          key: "grouping",
          label: "Grouping",
          type: "dropdown",
          options: ["Days", "Weeks", "Months"],
          value: grouping.value
        },
        {
          key: "periodId",
          label: "Period",
          type: "dropdown",
          options: [
            "1 Month",
            "2 Months",
            "3 Months",
            "6 Months",
            "1 Year",
            "All time"
          ],
          value: periodId.value,
          displayPrefix: "Last "
        },
        {
          key: "viewMode",
          label: "Show",
          type: "dropdown",
          options: ["Total time", "Average time"],
          value: viewMode.value
        }
      ];
      const menuSettingValues = vue.computed(() => ({
        grouping: grouping.value,
        periodId: periodId.value,
        viewMode: viewMode.value
      }));
      function updateMenuSettings(newVals) {
        if (newVals.grouping !== void 0 || newVals.periodId !== void 0) {
          timeStatsStore.setGroupingAndPeriod(
            newVals.grouping ?? grouping.value,
            newVals.periodId ?? periodId.value
          );
        }
        if (newVals.viewMode !== void 0) {
          const storeValue = newVals.viewMode === "Total time" ? "totals" : "averages";
          timeStatsStore.setViewMode(storeValue);
        }
      }
      const chartData = vue.computed(() => {
        if (!timeHistory.value || !timeHistory.value.labels || !timeHistory.value.newCardsTime || !timeHistory.value.reviewsTime) {
          return { labels: [], datasets: [] };
        }
        const { labels, newCardsTime, reviewsTime } = timeHistory.value;
        return {
          labels,
          datasets: [
            {
              label: "New Cards Time",
              data: newCardsTime,
              backgroundColor: themeColors.value.learningColor || themeColors.value.accent1,
              borderWidth: 0,
              borderRadius: 4,
              order: 2,
              stack: "timegroup"
            },
            {
              label: "Reviews Time",
              data: reviewsTime,
              backgroundColor: themeColors.value.barColor,
              borderWidth: 0,
              borderRadius: 4,
              order: 1,
              stack: "timegroup"
            }
          ]
        };
      });
      const chartOptions = vue.computed(() => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: "easeOutQuart"
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              title: {
                display: !shouldHideLateralLabels.value,
                text: viewMode.value === "Average time" ? "Average Time" : "Total Time",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 1,
                display: !shouldHideLateralLabels.value,
                callback: function(value) {
                  return formatTime(value);
                }
              },
              grid: {
                color: themeColors.value.gridColor
              }
            },
            x: {
              stacked: true,
              title: {
                display: !shouldHideDates.value,
                text: "Date",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                maxRotation: 45,
                minRotation: 45,
                display: !shouldHideDates.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: themeColors.value.textColor,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                },
                label: function(context) {
                  const datasetLabel = context.dataset.label || "";
                  const value = context.parsed.y;
                  const allData = context.chart.data.datasets.reduce(
                    (acc, ds) => acc + (Array.isArray(ds.data) ? ds.data[context.dataIndex] ?? 0 : 0),
                    0
                  );
                  const percentage = allData > 0 ? (value / allData * 100).toFixed(1) : "0.0";
                  return `${datasetLabel}: ${formatTime(value)} (${percentage}%)`;
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              footerColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            }
          }
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "timeChartContainer",
          ref: timeChartContainer
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Time Statistics ", 16),
          vue.createElementVNode("div", _hoisted_1$5, [
            timeHistory.value && timeHistory.value.labels && timeHistory.value.newCardsTime && timeHistory.value.reviewsTime && !isLoading.value && !error.value ? (vue.openBlock(), vue.createBlock(vue.unref(Bar), {
              key: 0,
              data: chartData.value,
              options: chartOptions.value,
              style: { "width": "100%", "height": "100%" }
            }, null, 8, ["data", "options"])) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$5, [
              vue.createElementVNode("div", _hoisted_3$5, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(30, (n) => {
                  return vue.createElementVNode("div", {
                    key: n,
                    class: "MCS__time-skeleton-bar",
                    style: vue.normalizeStyle({
                      height: `${Math.floor(Math.random() * 80) + 10}%`,
                      flex: "1 1 0",
                      margin: "0 2px"
                    })
                  }, [..._cache[0] || (_cache[0] = [
                    vue.createElementVNode("span", { class: "UiSkeleton" }, null, -1)
                  ])], 4);
                }), 64))
              ])
            ])) : error.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4$3, vue.toDisplayString(error.value), 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$3, "Could not load time statistics.")),
            !isLoading.value && !error.value && !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 4,
              settings: menuSettings,
              modelValue: menuSettingValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("", true)
          ])
        ], 16);
      };
    }
  });
  const TimeChart = _export_sfc(_sfc_main$6, [["__scopeId", "data-v-23dca542"]]);
  const STORAGE_KEY$1 = "migaku-wordHistory";
  const SETTINGS_KEY$1 = "migaku-wordHistory-settings";
  const useWordHistoryStore = pinia.defineStore("wordHistory", () => {
    const wordHistory = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const viewMode = vue.ref("daily");
    const grouping = vue.ref("Days");
    const periodId = vue.ref("1 Month");
    const offsetSettings = vue.ref({});
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY$1);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.viewMode && ["cumulative", "daily"].includes(parsed.viewMode)) {
            viewMode.value = parsed.viewMode;
          }
          if (parsed.grouping && ["Days", "Weeks", "Months"].includes(parsed.grouping)) {
            grouping.value = parsed.grouping;
          }
          if (parsed.periodId && ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "All time"].includes(parsed.periodId)) {
            periodId.value = parsed.periodId;
          }
          if (parsed.offsetSettings && typeof parsed.offsetSettings === "object") {
            offsetSettings.value = parsed.offsetSettings;
          }
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(SETTINGS_KEY$1, JSON.stringify({
        viewMode: viewMode.value,
        grouping: grouping.value,
        periodId: periodId.value,
        offsetSettings: offsetSettings.value
      }));
    }
    function getOffsetForLanguage(language) {
      return offsetSettings.value[language] || { enabled: false, offset: 0 };
    }
    function setOffsetForLanguage(language, enabled, offset) {
      offsetSettings.value[language] = { enabled, offset };
      saveSettingsToStorage();
    }
    function setViewMode(mode) {
      viewMode.value = mode;
    }
    function setGroupingAndPeriod(newGrouping, newPeriodId) {
      grouping.value = newGrouping;
      periodId.value = newPeriodId;
    }
    loadSettingsFromStorage();
    vue.watch([viewMode, grouping, periodId, offsetSettings], saveSettingsToStorage, { deep: true });
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$1);
        if (stored) wordHistory.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load word history.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY$1, JSON.stringify(wordHistory.value));
      } catch (err) {
        error.value = "Failed to save word history.";
      }
    }
    vue.watch(wordHistory, saveToStorage, { deep: true });
    async function fetchWordHistoryIfNeeded(lang, deckId, periodIdParam = periodId.value, groupingParam = grouping.value, viewModeParam = viewMode.value) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchWordHistory(lang, deckId, periodIdParam, groupingParam, viewModeParam);
        wordHistory.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Word history fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang, deckId) {
      isLoading.value = true;
      error.value = "";
      wordHistory.value = null;
      await reloadDatabase();
      await fetchWordHistoryIfNeeded(lang, deckId, periodId.value, grouping.value, viewMode.value);
    }
    function setWordHistory(stats) {
      wordHistory.value = stats;
    }
    function clearWordHistory() {
      wordHistory.value = null;
    }
    return {
      wordHistory,
      isLoading,
      error,
      viewMode,
      grouping,
      periodId,
      offsetSettings,
      setWordHistory,
      clearWordHistory,
      fetchWordHistoryIfNeeded,
      refetch,
      loadFromStorage,
      setGroupingAndPeriod,
      setViewMode,
      loadSettingsFromStorage,
      getOffsetForLanguage,
      setOffsetForLanguage
    };
  });
  const _hoisted_1$4 = { style: { "height": "calc(100% - 56px)", "min-width": "100%", "display": "flex", "align-items": "flex-end", "justify-content": "center", "position": "relative" } };
  const _hoisted_2$4 = {
    key: 1,
    class: "MCS__word-history-skeleton-container"
  };
  const _hoisted_3$4 = { class: "MCS__word-history-skeleton-chart" };
  const _hoisted_4$2 = {
    key: 2,
    style: { "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "12px" }
  };
  const _hoisted_5$2 = {
    key: 3,
    style: { "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "12px" }
  };
  const _sfc_main$5 = vue.defineComponent({
    __name: "WordHistory",
    setup(__props) {
      chart_js.Chart.register(
        chart_js.LineElement,
        chart_js.BarElement,
        chart_js.PointElement,
        chart_js.CategoryScale,
        chart_js.LinearScale,
        chart_js.Tooltip,
        chart_js.Legend
      );
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(
        () => THEME_CONFIGS[theme.value.toUpperCase()]
      );
      const wordHistoryStore = useWordHistoryStore();
      const wordHistory = vue.computed(() => wordHistoryStore.wordHistory);
      const isLoading = vue.computed(() => wordHistoryStore.isLoading);
      const error = vue.computed(() => wordHistoryStore.error);
      const language = vue.computed(() => appStore.language);
      const selectedDeckId = vue.computed(() => appStore.selectedDeckId);
      const viewMode = vue.computed({
        get: () => wordHistoryStore.viewMode === "cumulative" ? "Cumulative" : "Daily snapshot",
        set: (v2) => wordHistoryStore.setViewMode(v2 === "Cumulative" ? "cumulative" : "daily")
      });
      const grouping = vue.computed({
        get: () => wordHistoryStore.grouping,
        set: (v2) => wordHistoryStore.setGroupingAndPeriod(v2, wordHistoryStore.periodId)
      });
      const periodId = vue.computed({
        get: () => wordHistoryStore.periodId,
        set: (v2) => wordHistoryStore.setGroupingAndPeriod(wordHistoryStore.grouping, v2)
      });
      const wordHistoryContainer = vue.ref(null);
      const shouldHideDates = vue.ref(false);
      const shouldHideLateralLabels = vue.ref(false);
      function checkResize() {
        if (!wordHistoryContainer.value) return;
        let hideDates = false;
        const wordHistoryCard = cardsStore.cards.find(
          (c2) => c2.item.i === "WordHistory"
        );
        if (wordHistoryCard && wordHistoryCard.item.h <= 5) {
          hideDates = true;
        } else {
          hideDates = false;
        }
        if (wordHistoryCard && wordHistoryCard.item.w <= 4) {
          shouldHideLateralLabels.value = true;
        } else {
          shouldHideLateralLabels.value = false;
        }
        shouldHideDates.value = hideDates;
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkResize);
        vue.nextTick(() => {
          checkResize();
        });
        if (language.value) {
          await wordHistoryStore.refetch(language.value, selectedDeckId.value);
        }
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", checkResize);
      });
      const offsetForLanguage = vue.computed(() => wordHistoryStore.getOffsetForLanguage(language.value || ""));
      vue.watch(
        [wordHistory, isLoading, error, () => cardsStore],
        async () => {
          await vue.nextTick();
          checkResize();
        },
        { deep: true }
      );
      vue.watch(
        [language, selectedDeckId, periodId, grouping, () => wordHistoryStore.viewMode],
        async ([lang, deckId, period, group, mode], _prev, onCleanup) => {
          if (!lang) return;
          const fetchPromise = wordHistoryStore.fetchWordHistoryIfNeeded(
            lang,
            deckId,
            period,
            group,
            mode
          );
          let cancelled = false;
          onCleanup(() => cancelled = true);
          await fetchPromise;
          if (cancelled) return;
        },
        { deep: true }
      );
      const chartData = vue.computed(() => {
        if (!wordHistory.value || !wordHistory.value.labels || !wordHistory.value.knownCounts) {
          return { labels: [], datasets: [] };
        }
        const { labels, knownCounts } = wordHistory.value;
        const isCumulative = wordHistoryStore.viewMode === "cumulative";
        const offset = isCumulative && offsetForLanguage.value.enabled ? offsetForLanguage.value.offset : 0;
        const adjustedCounts = offset !== 0 ? knownCounts.map((count) => count + offset) : knownCounts;
        const datasets = isCumulative ? [
          {
            type: "line",
            label: "Known Words",
            data: adjustedCounts,
            borderColor: themeColors.value.accent1,
            backgroundColor: themeColors.value.accent1 + "20",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: themeColors.value.accent1,
            pointBorderColor: themeColors.value.accent1,
            tension: 0.4,
            fill: false
          }
        ] : [
          {
            type: "bar",
            label: "Known Words",
            data: knownCounts,
            backgroundColor: themeColors.value.accent1,
            borderWidth: 0,
            borderRadius: 4
          }
        ];
        return { labels, datasets };
      });
      const chartOptions = vue.computed(() => {
        const isCumulative = wordHistoryStore.viewMode === "cumulative";
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: "easeOutQuart"
          },
          scales: {
            y: {
              beginAtZero: isCumulative,
              stacked: !isCumulative,
              title: {
                display: !shouldHideLateralLabels.value,
                text: "Words",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                precision: 0,
                display: !shouldHideLateralLabels.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            },
            x: {
              stacked: !isCumulative,
              title: {
                display: !shouldHideDates.value,
                text: "Date",
                color: themeColors.value.textColor
              },
              ticks: {
                color: themeColors.value.textColor,
                maxRotation: 45,
                minRotation: 45,
                display: !shouldHideDates.value
              },
              grid: {
                color: themeColors.value.gridColor
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                },
                label: function(context) {
                  const datasetLabel = context.dataset.label || "";
                  const value = context.parsed.y;
                  return `${datasetLabel}: ${value}`;
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              footerColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            }
          }
        };
      });
      const wordHistoryMenuSettings = vue.computed(() => {
        const baseSettings = [
          {
            key: "grouping",
            label: "Grouping",
            type: "dropdown",
            options: ["Days", "Weeks", "Months"],
            value: grouping.value
          },
          {
            key: "periodId",
            label: "Period",
            type: "dropdown",
            options: [
              "1 Month",
              "2 Months",
              "3 Months",
              "6 Months",
              "1 Year",
              "All time"
            ],
            value: periodId.value,
            displayPrefix: "Last "
          },
          {
            key: "viewMode",
            label: "Show",
            type: "dropdown",
            options: ["Daily snapshot", "Cumulative"],
            value: viewMode.value
          }
        ];
        if (wordHistoryStore.viewMode === "cumulative") {
          baseSettings.push({
            key: "cumulativeOffset",
            label: "Cumulative Offset",
            type: "group",
            value: offsetForLanguage.value.enabled,
            children: [
              {
                key: "cumulativeOffsetValue",
                label: "Offset",
                type: "number",
                value: offsetForLanguage.value.offset,
                min: 0,
                step: 1
              }
            ]
          });
        }
        return baseSettings;
      });
      const menuSettingValues = vue.computed(() => ({
        grouping: grouping.value,
        periodId: periodId.value,
        viewMode: viewMode.value,
        cumulativeOffset: offsetForLanguage.value.enabled,
        cumulativeOffsetValue: offsetForLanguage.value.offset
      }));
      function updateMenuSettings(newVals) {
        if (newVals.grouping !== void 0 || newVals.periodId !== void 0) {
          wordHistoryStore.setGroupingAndPeriod(
            newVals.grouping ?? grouping.value,
            newVals.periodId ?? periodId.value
          );
        }
        if (newVals.viewMode !== void 0) {
          const storeValue = newVals.viewMode === "Cumulative" ? "cumulative" : "daily";
          wordHistoryStore.setViewMode(storeValue);
        }
        if (newVals.cumulativeOffset !== void 0 || newVals.cumulativeOffsetValue !== void 0) {
          const currentOffset = offsetForLanguage.value;
          const enabled = newVals.cumulativeOffset !== void 0 ? newVals.cumulativeOffset : currentOffset.enabled;
          const offset = newVals.cumulativeOffsetValue !== void 0 ? newVals.cumulativeOffsetValue || 0 : currentOffset.offset;
          if (language.value) {
            wordHistoryStore.setOffsetForLanguage(language.value, enabled, offset);
          }
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "wordHistoryContainer",
          ref: wordHistoryContainer
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Known Word History ", 16),
          vue.createElementVNode("div", _hoisted_1$4, [
            wordHistory.value && wordHistory.value.labels && wordHistory.value.knownCounts && !isLoading.value && !error.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              vue.unref(wordHistoryStore).viewMode === "cumulative" ? (vue.openBlock(), vue.createBlock(vue.unref(Line), {
                key: 0,
                data: chartData.value,
                options: chartOptions.value,
                style: { "width": "100%", "height": "100%" }
              }, null, 8, ["data", "options"])) : (vue.openBlock(), vue.createBlock(vue.unref(Bar), {
                key: 1,
                data: chartData.value,
                options: chartOptions.value,
                style: { "width": "100%", "height": "100%" }
              }, null, 8, ["data", "options"]))
            ], 64)) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$4, [
              vue.createElementVNode("div", _hoisted_3$4, [
                (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(30, (n) => {
                  return vue.createElementVNode("div", {
                    key: n,
                    class: "MCS__word-history-skeleton-bar",
                    style: vue.normalizeStyle({
                      height: `${Math.floor(Math.random() * 80) + 10}%`,
                      flex: "1 1 0",
                      margin: "0 2px"
                    })
                  }, [..._cache[0] || (_cache[0] = [
                    vue.createElementVNode("span", { class: "UiSkeleton" }, null, -1)
                  ])], 4);
                }), 64))
              ])
            ])) : error.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$2, [
              vue.createElementVNode("span", null, vue.toDisplayString(error.value), 1)
            ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$2, [..._cache[1] || (_cache[1] = [
              vue.createElementVNode("span", null, "Could not load word history data.", -1)
            ])])),
            !isLoading.value && !error.value && !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 4,
              settings: wordHistoryMenuSettings.value,
              modelValue: menuSettingValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["settings", "modelValue"])) : vue.createCommentVNode("", true)
          ])
        ], 16);
      };
    }
  });
  const KnownWordHistory = _export_sfc(_sfc_main$5, [["__scopeId", "data-v-c1b7516b"]]);
  const _sfc_main$4 = vue.defineComponent({
    __name: "CustomStat",
    setup(__props) {
      const domSlotRef = vue.ref(null);
      let targetNode = null;
      let originalParent = null;
      let originalNext = null;
      function getCardIdFromContainer(el) {
        let node = el;
        while (node) {
          if (node.classList && node.classList.contains("MCS__stats-card")) {
            const id = node.getAttribute("data-card-id");
            return id || null;
          }
          node = node.parentElement;
        }
        return null;
      }
      function moveCustomNode() {
        const hostId = getCardIdFromContainer(domSlotRef.value);
        if (!hostId) {
          return;
        }
        const found = document.querySelector(`[custom-stat="${CSS.escape(hostId)}"]`);
        if (found && found instanceof HTMLElement && domSlotRef.value) {
          targetNode = found;
          targetNode.style.height = "100%";
          if (!originalParent) {
            originalParent = targetNode.parentNode;
            originalNext = targetNode.nextSibling;
          }
          domSlotRef.value.appendChild(targetNode);
          targetNode.style.display = "";
          const foundTitle = found.querySelector(
            ".UiTypo.UiTypo__heading2.-heading.Statistic__title"
          );
          if (foundTitle && foundTitle instanceof HTMLElement) {
            foundTitle.remove();
          }
          const foundCard = found.querySelector(".UiCard.-lesson.Statistic__card");
          if (foundCard && foundCard instanceof HTMLElement) {
            let parent = foundCard.parentElement;
            while (parent && parent instanceof HTMLElement) {
              if (parent.getAttribute("custom-stat")) {
                break;
              }
              console.log(parent);
              parent.style.margin = "0";
              parent.style.height = "100%";
              parent = parent.parentElement;
            }
            foundCard.style.margin = "0";
          }
        }
      }
      function restoreNode() {
        if (targetNode && originalParent) {
          if (originalNext) {
            originalParent.insertBefore(targetNode, originalNext);
          } else {
            originalParent.appendChild(targetNode);
          }
        }
      }
      vue.onMounted(() => {
        moveCustomNode();
      });
      vue.onBeforeUnmount(() => {
        restoreNode();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "CustomStatCard",
          ref_key: "domSlotRef",
          ref: domSlotRef
        }, null, 512);
      };
    }
  });
  const CustomStat = _export_sfc(_sfc_main$4, [["__scopeId", "data-v-3692c88c"]]);
  const _hoisted_1$3 = ["bottom-sheet-props"];
  const _hoisted_2$3 = ["aria-label", "onClick"];
  const _hoisted_3$3 = {
    key: 0,
    class: "UiIcon UiActionSheet__icon",
    style: { "width": "24px" }
  };
  const _hoisted_4$1 = { class: "UiActionSheet__item__textContainer" };
  const _hoisted_5$1 = { class: "UiTypo UiTypo__body -emphasis UiActionSheet__item__text" };
  const _sfc_main$3 = vue.defineComponent({
    __name: "ActionSheet",
    props: {
      actions: {},
      visible: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true },
      bottomSheetProps: { default: () => ({}) },
      popoverStyle: { default: () => ({}) },
      disableIcons: { type: Boolean }
    },
    emits: ["select"],
    setup(__props, { emit: __emit }) {
      return (_ctx, _cache) => {
        return __props.visible ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "UiPopover -visible",
          role: "dialog",
          tabindex: "-1",
          style: vue.normalizeStyle(__props.popoverStyle)
        }, [
          vue.createElementVNode("ul", {
            class: vue.normalizeClass(["UiActionSheet", { "-desktop": __props.desktop }]),
            "bottom-sheet-props": __props.bottomSheetProps
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.actions, (action, idx) => {
              return vue.openBlock(), vue.createElementBlock("li", {
                key: idx,
                class: vue.normalizeClass(["UiActionSheet__item", { "selected": action.selected }]),
                style: vue.normalizeStyle({ borderBottomWidth: idx !== __props.actions.length - 1 ? "1px" : 0 })
              }, [
                vue.createElementVNode("button", {
                  type: "button",
                  class: "UiActionSheet__button UiActionSheet__action",
                  "aria-label": `ID:UiActionSheet.item.${idx}`,
                  onClick: ($event) => _ctx.$emit("select", { action, idx })
                }, [
                  !__props.disableIcons ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$3, [
                    vue.renderSlot(_ctx.$slots, "icon", {
                      icon: action.icon,
                      action
                    }, () => [
                      action.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(action.icon), {
                        key: 0,
                        class: "UiIcon__svg"
                      })) : vue.createCommentVNode("", true)
                    ], true)
                  ])) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_4$1, [
                    vue.createElementVNode("span", _hoisted_5$1, vue.toDisplayString(action.label), 1)
                  ])
                ], 8, _hoisted_2$3)
              ], 6);
            }), 128))
          ], 10, _hoisted_1$3)
        ], 4)) : vue.createCommentVNode("", true);
      };
    }
  });
  const ActionSheet = _export_sfc(_sfc_main$3, [["__scopeId", "data-v-2f977adb"]]);
  const STORAGE_KEY = "migaku-characterstats";
  const SETTINGS_KEY = "migaku-characterstats-settings";
  const useCharacterStatsStore = pinia.defineStore("characterStats", () => {
    const characterStats = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref("");
    const gridCellWidth = vue.ref(40);
    const selectedGrouping = vue.ref(0);
    function loadSettingsFromStorage() {
      try {
        const data = localStorage.getItem(SETTINGS_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (typeof parsed.gridCellWidth === "number") gridCellWidth.value = parsed.gridCellWidth;
          if (typeof parsed.selectedGrouping === "number") selectedGrouping.value = parsed.selectedGrouping;
        }
      } catch {
      }
    }
    function saveSettingsToStorage() {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        gridCellWidth: gridCellWidth.value,
        selectedGrouping: selectedGrouping.value
      }));
    }
    function setGridCellWidth(val) {
      gridCellWidth.value = val;
    }
    function setSelectedGrouping(val) {
      selectedGrouping.value = val;
    }
    loadSettingsFromStorage();
    vue.watch([gridCellWidth, selectedGrouping], saveSettingsToStorage);
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) characterStats.value = JSON.parse(stored);
      } catch (err) {
        error.value = "Failed to load character stats.";
      }
    }
    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characterStats.value));
      } catch (err) {
        error.value = "Failed to save character stats.";
      }
    }
    vue.watch(characterStats, saveToStorage, { deep: true });
    async function fetchCharacterStatsIfNeeded(lang) {
      if (!lang) return;
      isLoading.value = true;
      try {
        const stats = await fetchCharacterStats(lang);
        if (!stats) throw new Error("No character stats found");
        characterStats.value = stats;
        error.value = "";
      } catch (e2) {
        error.value = "Fetch failed";
      } finally {
        isLoading.value = false;
      }
    }
    async function refetch(lang) {
      isLoading.value = true;
      error.value = "";
      characterStats.value = null;
      await reloadDatabase();
      return fetchCharacterStatsIfNeeded(lang);
    }
    function setCharacterStats(stats) {
      characterStats.value = stats;
    }
    function clearCharacterStats() {
      characterStats.value = null;
    }
    return {
      characterStats,
      isLoading,
      error,
      gridCellWidth,
      selectedGrouping,
      setGridCellWidth,
      setSelectedGrouping,
      setCharacterStats,
      clearCharacterStats,
      fetchCharacterStatsIfNeeded,
      refetch,
      loadFromStorage,
      loadSettingsFromStorage
    };
  });
  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const KANJI_DB_URL = "https://github.com/migaku-official/Migaku-Kanji-Addon/blob/main/addon/kanji.db?raw=true";
  const kanjiDbState = {
    sql: null,
    db: null,
    isLoading: false,
    error: null
  };
  const filterCache = new Map();
  async function initializeSqlEngine() {
    try {
      if (kanjiDbState.sql) {
        logger.debug("Using existing SQL.js instance for kanji DB");
        return kanjiDbState.sql;
      }
      logger.debug("Initializing SQL.js for kanji DB...");
      const SQL = await initSqlJs({
        locateFile: (file) => {
          logger.debug(`Locating file: ${file}`);
          if (file.endsWith(".wasm")) {
            return "https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.wasm";
          }
          return file;
        }
      });
      if (!SQL) {
        throw new Error("SQL.js initialization returned null");
      }
      logger.debug("SQL.js initialized successfully for kanji DB");
      kanjiDbState.sql = SQL;
      return SQL;
    } catch (err) {
      logger.error("Failed to initialize SQL.js for kanji DB:", err);
      return null;
    }
  }
  async function loadKanjiDatabase() {
    try {
      if (kanjiDbState.db) {
        logger.debug("Using existing kanji database instance");
        return kanjiDbState.db;
      }
      if (kanjiDbState.isLoading) {
        logger.debug("Kanji database already loading, waiting...");
        let attempts = 0;
        while (kanjiDbState.isLoading && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        return kanjiDbState.db;
      }
      kanjiDbState.isLoading = true;
      kanjiDbState.error = null;
      logger.debug("Fetching kanji.db from GitHub...");
      const arrayBuffer = await new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "GET",
          url: KANJI_DB_URL,
          responseType: "arraybuffer",
          onload: (response) => {
            if (!response || !response.response) {
              reject(new Error("Empty response when fetching kanji.db"));
              return;
            }
            logger.debug(`Downloaded kanji.db: ${response.response.byteLength} bytes`);
            resolve(response.response);
          },
          onerror: (error) => {
            reject(new Error(`Failed to fetch kanji.db: ${error}`));
          }
        });
      });
      const SQL = await initializeSqlEngine();
      if (!SQL) {
        kanjiDbState.error = "Failed to initialize SQL.js";
        kanjiDbState.isLoading = false;
        return null;
      }
      logger.debug("Loading kanji database into SQL.js...");
      const db = new SQL.Database(new Uint8Array(arrayBuffer));
      logger.debug("Kanji database loaded successfully");
      kanjiDbState.db = db;
      kanjiDbState.isLoading = false;
      return db;
    } catch (err) {
      logger.error("Failed to load kanji database:", err);
      kanjiDbState.error = err instanceof Error ? err.message : "Unknown error";
      kanjiDbState.isLoading = false;
      return null;
    }
  }
  async function fetchFilteredKanji(filterId, knownCharacters, learningCharacters) {
    try {
      if (filterId === 0) {
        const allChars = [... new Set([...knownCharacters, ...learningCharacters])];
        return allChars.map((char) => ({ character: char, level: 0 }));
      }
      if (filterCache.has(filterId)) {
        logger.debug(`Using cached filter results for filterId=${filterId}`);
        return filterCache.get(filterId);
      }
      const db = await loadKanjiDatabase();
      if (!db) {
        logger.error("Failed to load kanji database");
        return [];
      }
      logger.debug(`Fetching filtered kanji for filterId: ${filterId}`);
      const filterOption = FILTER_OPTIONS.find((opt) => opt.id === filterId);
      if (!filterOption || !filterOption.query) {
        logger.warn(`No query defined for filterId: ${filterId}`);
        return [];
      }
      const results = db.exec(filterOption.query);
      if (results.length === 0 || results[0].values.length === 0) {
        logger.warn(`No results for filterId: ${filterId}`);
        return [];
      }
      const filteredKanji = results[0].values.map((row) => ({
        character: String(row[0]),
        level: Number(row[1])
      }));
      filterCache.set(filterId, filteredKanji);
      logger.debug(`Fetched ${filteredKanji.length} kanji for filterId: ${filterId}`);
      return filteredKanji;
    } catch (error) {
      logger.error("Error fetching filtered kanji:", error);
      return [];
    }
  }
  const FILTER_OPTIONS = [
    {
      id: 0,
      label: "All Characters",
      levelLabel: () => null
    },
    {
      id: 1,
      label: "Jōyō",
      levelLabel: () => null,
      query: KANJI_BY_JOYO_QUERY
    },
    {
      id: 2,
      label: "JLPT",
      levelLabel: (level) => `N${level}`,
      query: KANJI_BY_JLPT_QUERY
    },
    {
      id: 3,
      label: "Kanken",
      levelLabel: (level) => `Level ${level}`,
      query: KANJI_BY_KANKEN_QUERY
    }
  ];
  const _hoisted_1$2 = { class: "MCS__character-grid-wrapper" };
  const _hoisted_2$2 = { class: "MCS__character-groups-wrapper" };
  const _hoisted_3$2 = { class: "MCS__character-grid" };
  const _sfc_main$2 = vue.defineComponent({
    __name: "CharacterGrid",
    props: {
      filterId: { type: Number, default: 0 }
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "v0fa89a4c": gridCellWidth.value + "px"
      }));
      const props = __props;
      const store = useCharacterStatsStore();
      const appStore = useAppStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const gridCellWidth = vue.computed(() => store.gridCellWidth);
      const filteredKanji = vue.ref([]);
      const isLoadingFilter = vue.ref(false);
      vue.watch([() => props.filterId, () => store.characterStats], async ([newFilterId, stats]) => {
        if (!stats) return;
        isLoadingFilter.value = true;
        try {
          const result = await fetchFilteredKanji(
            newFilterId,
            stats.knownCharacters,
            stats.learningCharacters
          );
          filteredKanji.value = result;
        } catch (error) {
          console.error("Error loading filtered kanji:", error);
          filteredKanji.value = [];
        } finally {
          isLoadingFilter.value = false;
        }
      }, { immediate: true });
      const groupedCharacters = vue.computed(() => {
        if (!store.characterStats || filteredKanji.value.length === 0) {
          return [];
        }
        const knownSet = new Set(store.characterStats.knownCharacters);
        const learningSet = new Set(store.characterStats.learningCharacters);
        const getStatus = (char) => {
          if (knownSet.has(char)) return "known";
          if (learningSet.has(char)) return "learning";
          return "unknown";
        };
        const filter = FILTER_OPTIONS[props.filterId];
        if (!filter) {
          return [];
        }
        const groupMap = new Map();
        const orderedLevels = [];
        for (const { character, level } of filteredKanji.value) {
          const levelLabel = filter.levelLabel(level) ?? 0;
          if (!groupMap.has(levelLabel)) {
            orderedLevels.push(levelLabel);
            groupMap.set(levelLabel, {
              label: typeof levelLabel === "string" ? levelLabel : null,
              characters: [],
              knownCount: 0,
              totalCount: 0
            });
          }
          const group = groupMap.get(levelLabel);
          const status = getStatus(character);
          group.characters.push({ character, status });
          group.totalCount++;
          if (status === "known") {
            group.knownCount++;
          }
        }
        const groups = orderedLevels.map((level) => groupMap.get(level));
        return groups;
      });
      const overallStats = vue.computed(() => {
        if (!store.characterStats) return "";
        const known = groupedCharacters.value.reduce((sum, g2) => sum + g2.knownCount, 0);
        const total = groupedCharacters.value.reduce((sum, g2) => sum + g2.totalCount, 0);
        const percentage = total > 0 ? (known / total * 100).toFixed(2) : "0.00";
        return `${known}/${total} - ${percentage}%`;
      });
      const filterLabel = vue.computed(() => FILTER_OPTIONS[props.filterId]?.label || "All Characters");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          isLoadingFilter.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 0,
            class: "MCS__character-grid-loading",
            [componentHash.value || ""]: true
          }), [
            vue.createElementVNode("p", vue.normalizeProps({
              class: "UiTypo UiTypo__caption",
              [componentHash.value || ""]: true
            }), "Loading character data...", 16)
          ], 16)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("div", vue.normalizeProps({
              class: "MCS__character-grid-header",
              [componentHash.value || ""]: true
            }), [
              vue.createElementVNode("h3", vue.normalizeProps({
                class: "UiTypo UiTypo__heading3 -heading",
                [componentHash.value || ""]: true
              }), vue.toDisplayString(filterLabel.value), 17),
              vue.createElementVNode("p", vue.normalizeProps({
                class: "UiTypo UiTypo__caption",
                [componentHash.value || ""]: true
              }), vue.toDisplayString(overallStats.value), 17)
            ], 16),
            vue.createElementVNode("div", _hoisted_2$2, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(groupedCharacters.value, (group) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: group.label ?? "all",
                  class: vue.normalizeClass(["MCS__character-group", { "MCS__character-group--single": groupedCharacters.value.length === 1 }])
                }, [
                  group.label && groupedCharacters.value.length > 1 ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
                    key: 0,
                    class: "MCS__character-group-header",
                    [componentHash.value || ""]: true
                  }), [
                    vue.createElementVNode("h4", vue.normalizeProps({
                      class: "UiTypo UiTypo__heading4 -heading",
                      [componentHash.value || ""]: true
                    }), vue.toDisplayString(group.label), 17),
                    vue.createElementVNode("p", vue.normalizeProps({
                      class: "UiTypo UiTypo__caption",
                      [componentHash.value || ""]: true
                    }), vue.toDisplayString(group.knownCount) + "/" + vue.toDisplayString(group.totalCount) + " - " + vue.toDisplayString((group.knownCount / group.totalCount * 100).toFixed(2)) + "%", 17)
                  ], 16)) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_3$2, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(group.characters, (char) => {
                      return vue.openBlock(), vue.createElementBlock("div", {
                        key: char.character,
                        class: vue.normalizeClass(["MCS__character", `MCS__character--${char.status}`])
                      }, vue.toDisplayString(char.character), 3);
                    }), 128))
                  ])
                ], 2);
              }), 128))
            ])
          ], 64))
        ]);
      };
    }
  });
  const CharacterGrid = _export_sfc(_sfc_main$2, [["__scopeId", "data-v-83338d7e"]]);
  const _hoisted_1$1 = { class: "UiTypo UiTypo__heading4 -heading -inline" };
  const _hoisted_2$1 = { class: "UiTypo UiTypo__heading4 -heading -inline" };
  const _hoisted_3$1 = {
    key: 1,
    style: { "text-align": "center", "margin": "16px 0" }
  };
  const _sfc_main$1 = vue.defineComponent({
    __name: "CharacterStats",
    setup(__props) {
      chart_js.Chart.register(chart_js.ArcElement, chart_js.Tooltip, chart_js.Legend);
      const appStore = useAppStore();
      const characterStatsStore = useCharacterStatsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const theme = vue.computed(() => appStore.theme || "dark");
      const themeColors = vue.computed(
        () => THEME_CONFIGS[theme.value.toUpperCase()]
      );
      const language = vue.computed(() => appStore.language);
      const cardsStore = useCardsStore();
      const error = vue.computed(() => characterStatsStore.error);
      const isLoading = vue.computed(() => characterStatsStore.isLoading);
      const characterStats = vue.computed(
        () => characterStatsStore.characterStats
      );
      const characterStatsContainer = vue.ref(null);
      const isOverflowing = vue.ref(false);
      const grouping = vue.computed({
        get: () => characterStatsStore.selectedGrouping,
        set: (v2) => characterStatsStore.setSelectedGrouping(v2)
      });
      const shouldShowCard = vue.computed(() => language.value === "ja");
      function checkOverflow() {
        if (!characterStatsContainer.value) return;
        let isOverf = false;
        const characterStatsCard = cardsStore.cards.find(
          (c2) => c2.item.i === "CharacterStats"
        );
        if (characterStatsCard && characterStatsCard.item.w <= 5 && characterStatsCard.item.h <= 6) {
          isOverf = true;
        } else if (characterStatsCard && characterStatsCard.item.h <= 5 && characterStatsCard.item.w <= 5) {
          isOverf = true;
        }
        isOverflowing.value = isOverf;
      }
      vue.onMounted(async () => {
        window.addEventListener("resize", checkOverflow);
        vue.nextTick(() => {
          checkOverflow();
        });
        if (language.value === "ja") {
          await characterStatsStore.refetch(language.value);
        }
      });
      vue.onBeforeUnmount(() => {
        window.removeEventListener("resize", checkOverflow);
      });
      vue.watch(
        [language, characterStats, grouping, isLoading, error, () => cardsStore],
        async () => {
          await vue.nextTick();
          checkOverflow();
        },
        { deep: true }
      );
      const chartData = vue.computed(() => {
        if (!characterStats.value) {
          return {
            labels: [],
            datasets: []
          };
        }
        const labels = ["Known", "Learning"];
        const data = [
          characterStats.value.knownCharacters.length,
          characterStats.value.learningCharacters.length
        ];
        const bg = [
          themeColors.value.knownColor,
          themeColors.value.learningColor
        ];
        const border = [
          themeColors.value.knownColor,
          themeColors.value.learningColor
        ];
        return {
          labels,
          datasets: [
            {
              data,
              backgroundColor: bg,
              borderColor: border,
              borderWidth: 0
            }
          ]
        };
      });
      const chartOptions = vue.computed(() => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1.6,
          animation: {
            duration: 800,
            easing: "easeOutQuart"
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: themeColors.value.textColor,
                usePointStyle: true,
                pointStyle: "circle"
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed !== null) {
                    label += context.parsed.toLocaleString();
                  }
                  return label;
                }
              },
              backgroundColor: themeColors.value.backgroundElevation2,
              titleFontColor: themeColors.value.textColor,
              caretSize: CHART_CONFIG.TOOLTIP_CONFIG.CARET_SIZE,
              padding: CHART_CONFIG.TOOLTIP_CONFIG.PADDING,
              cornerRadius: CHART_CONFIG.TOOLTIP_CONFIG.CORNER_RADIUS,
              boxPadding: CHART_CONFIG.TOOLTIP_CONFIG.BOX_PADDING,
              multiKeyBackground: themeColors.value.backgroundElevation1,
              bodyColor: themeColors.value.textColor,
              titleColor: themeColors.value.textColor
            },
            bodyColor: themeColors.value.textColor,
            titleColor: themeColors.value.textColor
          }
        };
      });
      const menuSettings = vue.computed(() => [
        {
          key: "grouping",
          label: "Grouping",
          type: "dropdown",
          options: FILTER_OPTIONS.map((f) => f.label),
          value: grouping.value
        },
        {
          key: "gridCellWidth",
          label: "Grid Cell Width",
          type: "number",
          min: 40,
          max: 80,
          step: 5,
          value: characterStatsStore.gridCellWidth
        }
      ]);
      const menuValues = vue.computed(() => ({
        grouping: FILTER_OPTIONS[grouping.value]?.label || FILTER_OPTIONS[0].label,
        gridCellWidth: characterStatsStore.gridCellWidth
      }));
      function updateMenuSettings(newVals) {
        const selectedFilter = FILTER_OPTIONS.find((f) => f.label === newVals.grouping);
        if (selectedFilter) {
          grouping.value = selectedFilter.id;
        }
        if (typeof newVals.gridCellWidth === "number") {
          characterStatsStore.setGridCellWidth(newVals.gridCellWidth);
        }
      }
      vue.watch(language, async (lang, _prev, onCleanup) => {
        if (!lang || lang !== "ja") return;
        const fetchPromise = characterStatsStore.fetchCharacterStatsIfNeeded(lang);
        let cancelled = false;
        onCleanup(() => cancelled = true);
        await fetchPromise;
        if (cancelled) return;
      });
      return (_ctx, _cache) => {
        return shouldShowCard.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
          key: 0,
          [componentHash.value || ""]: true,
          class: "UiCard -lesson Statistic__card",
          ref_key: "characterStatsContainer",
          ref: characterStatsContainer
        }), [
          vue.createElementVNode("h3", vue.normalizeProps({
            [componentHash.value || ""]: true,
            class: "UiTypo UiTypo__heading3 -heading Statistic__title"
          }), " Character Statistics ", 16),
          characterStats.value && !isLoading.value && !error.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 0,
            [componentHash.value || ""]: true,
            style: { "display": "flex", "flex-direction": "column", "justify-content": "center", "position": "relative", "height": "calc(100% - 56px)" }
          }), [
            characterStats.value.knownCharacters.length ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
              key: 0,
              [componentHash.value || ""]: true,
              class: "MCS__character-chart"
            }), [
              vue.withDirectives(vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__character-stats__details"
              }), [
                vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                  vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                    _cache[0] || (_cache[0] = vue.createElementVNode("span", { class: "UiTypo UiTypo__caption" }, "Known:", -1)),
                    vue.createElementVNode("span", _hoisted_1$1, vue.toDisplayString(characterStats.value.knownCharacters.length ?? "N/A"), 1)
                  ], 16),
                  vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                    _cache[1] || (_cache[1] = vue.createElementVNode("span", { class: "UiTypo UiTypo__caption" }, "Learning:", -1)),
                    vue.createElementVNode("span", _hoisted_2$1, vue.toDisplayString(characterStats.value.learningCharacters.length ?? "N/A"), 1)
                  ], 16)
                ], 16)
              ], 16), [
                [vue.vShow, !isOverflowing.value]
              ]),
              vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__character-stats__chart"
              }), [
                vue.createVNode(vue.unref(Doughnut), {
                  class: "MCS__character-stats__chart__donut",
                  data: chartData.value,
                  options: chartOptions.value
                }, null, 8, ["data", "options"])
              ], 16)
            ], 16)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$1, [..._cache[2] || (_cache[2] = [
              vue.createElementVNode("p", null, "Known:0", -1),
              vue.createElementVNode("p", null, "Learning:0", -1)
            ])])),
            vue.createVNode(CharacterGrid, { filterId: grouping.value }, null, 8, ["filterId"]),
            !vue.unref(cardsStore).isMoveModeActive ? (vue.openBlock(), vue.createBlock(FloatingMenuButton, {
              key: 2,
              settings: menuSettings.value,
              modelValue: menuValues.value,
              "onUpdate:modelValue": updateMenuSettings,
              buttonPos: { top: 24, right: 24 }
            }, null, 8, ["settings", "modelValue"])) : vue.createCommentVNode("", true)
          ], 16)) : isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 1,
            [componentHash.value || ""]: true
          }), [
            vue.createElementVNode("div", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "MCS__character-stats"
            }), [
              vue.withDirectives(vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__character-stats__details"
              }), [
                vue.createElementVNode("div", vue.normalizeProps({ [componentHash.value || ""]: true }), [
                  vue.createElementVNode("div", vue.normalizeProps({
                    [componentHash.value || ""]: true,
                    class: "skeleton-row"
                  }), [..._cache[3] || (_cache[3] = [
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1),
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1),
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1),
                    vue.createElementVNode("span", { class: "UiSkeleton skeleton-label" }, null, -1)
                  ])], 16)
                ], 16)
              ], 16), [
                [vue.vShow, !isOverflowing.value]
              ]),
              vue.createElementVNode("div", vue.normalizeProps({
                [componentHash.value || ""]: true,
                class: "MCS__character-stats__chart"
              }), [..._cache[4] || (_cache[4] = [
                vue.createStaticVNode('<div class="skeleton-donut-container" data-v-9d5df7b4><div class="skeleton-donut UiSkeleton" data-v-9d5df7b4></div><div class="skeleton-legend" data-v-9d5df7b4><div class="skeleton-legend-item" data-v-9d5df7b4><span class="skeleton-legend-circle UiSkeleton" data-v-9d5df7b4></span><span class="skeleton-legend-text UiSkeleton" data-v-9d5df7b4></span></div><div class="skeleton-legend-item" data-v-9d5df7b4><span class="skeleton-legend-circle UiSkeleton" data-v-9d5df7b4></span><span class="skeleton-legend-text UiSkeleton" data-v-9d5df7b4></span></div><div class="skeleton-legend-item" data-v-9d5df7b4><span class="skeleton-legend-circle UiSkeleton" data-v-9d5df7b4></span><span class="skeleton-legend-text UiSkeleton" data-v-9d5df7b4></span></div><div class="skeleton-legend-item" data-v-9d5df7b4><span class="skeleton-legend-circle UiSkeleton" data-v-9d5df7b4></span><span class="skeleton-legend-text UiSkeleton" data-v-9d5df7b4></span></div></div></div>', 1)
              ])], 16)
            ], 16)
          ], 16)) : error.value ? (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 2,
            [componentHash.value || ""]: true,
            class: "MCS__character-stats-card"
          }), [
            vue.createElementVNode("p", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "UiTypo UiTypo__body2"
            }), vue.toDisplayString(error.value), 17)
          ], 16)) : (vue.openBlock(), vue.createElementBlock("div", vue.normalizeProps({
            key: 3,
            [componentHash.value || ""]: true,
            class: "MCS__character-stats-card"
          }), [
            vue.createElementVNode("p", vue.normalizeProps({
              [componentHash.value || ""]: true,
              class: "UiTypo UiTypo__body2"
            }), " Could not load character status data. ", 16)
          ], 16))
        ], 16)) : vue.createCommentVNode("", true);
      };
    }
  });
  const CharacterStats = _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9d5df7b4"]]);
  const _hoisted_1 = { class: "MCS_wrapper" };
  const _hoisted_2 = { style: { "margin-bottom": "12px", "display": "flex", "gap": "12px" } };
  const _hoisted_3 = {
    class: "UiIcon",
    style: { "width": "24px" }
  };
  const _hoisted_4 = {
    class: "UiSvg__inner",
    style: { "margin": "0", "font-size": "24px" }
  };
  const _hoisted_5 = {
    key: 0,
    width: "100%",
    height: "100%",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  const _hoisted_6 = {
    key: 1,
    width: "100%",
    height: "100%",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  const _hoisted_7 = ["data-card-id"];
  const _hoisted_8 = { style: { "position": "relative", "display": "flex", "align-items": "center", "justify-content": "space-between" } };
  const _hoisted_9 = {
    key: 0,
    class: "move-handle",
    style: { "position": "absolute", "left": "8px", "top": "8px", "cursor": "move", "user-select": "none", "font-size": "24px" }
  };
  const _hoisted_10 = { style: { "position": "absolute", "right": "8px", "top": "8px" } };
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const appStore = useAppStore();
      const cardsStore = useCardsStore();
      const componentHash = vue.computed(() => appStore.componentHash || "");
      const themeObserver = vue.ref(null);
      const languageObserver = vue.ref(null);
      const moveMode = vue.ref(cardsStore.isMoveModeActive);
      const layout = vue.ref(cardsStore.layout);
      const addCardDropdown = vue.ref(false);
      const canAddCard = vue.computed(() => cardsStore.cards.some((c2) => !c2.visible));
      const deckSelectorDropdown = vue.ref(false);
      const deckSelectorOptions = vue.computed(
        () => appStore.availableDecks.filter((deck) => deck.lang === appStore.language || deck.lang === "all").map((deck) => ({
          id: deck.id,
          label: deck.name,
          selected: deck.id === appStore.selectedDeckId
        }))
      );
      const hiddenCardOptions = vue.computed(() => {
        return cardsStore.cards.filter((c2) => !c2.visible).map((card) => ({
          id: card.id,
          label: getCardLabel(card.id)
        }));
      });
      function getCardLabel(cardId) {
        switch (cardId) {
          case "NativeStats":
            return "Review heatmap";
          case "WordCount":
            return "Word count";
          case "CardsDue":
            return "Cards due";
          case "ReviewHistory":
            return "Review history";
          case "ReviewIntervals":
            return "Review intervals";
          case "StudyStatistics":
            return "Study statistics";
          case "TimeChart":
            return "Time statistics";
          case "KnownWordHistory":
            return "Known word history";
          case "CharacterStats":
            return "Character status";
          default:
            return cardId;
        }
      }
      const addCardDropdownSelection = vue.ref(void 0);
      function handleAddCardSelect(cardId) {
        cardsStore.showCard(cardId);
        addCardDropdown.value = false;
        addCardDropdownSelection.value = void 0;
      }
      vue.watch(
        () => cardsStore.cards.map((card) => ({
          id: card.id,
          visible: card.visible,
          ...card.item
        })),
        () => {
          layout.value = cardsStore.layout;
        },
        { deep: true }
      );
      const cardComponents = {
        NativeStats,
        WordCount,
        CardsDue,
        ReviewHistory,
        ReviewIntervals,
        StudyStatistics,
        TimeChart,
        KnownWordHistory,
        CharacterStats
      };
      vue.watch(
        () => cardsStore.isMoveModeActive,
        (value) => {
          moveMode.value = value;
        }
      );
      function setMoveMode(value) {
        cardsStore.setMoveMode(value);
      }
      function hideCard(id) {
        cardsStore.hideCard(id);
      }
      function saveLayout(newLayout) {
        cardsStore.updateLayout(newLayout);
      }
      function undoLayout() {
        cardsStore.loadFromStorage();
        layout.value = cardsStore.layout;
        setMoveMode(false);
      }
      function toggleAddCardDropdown() {
        addCardDropdown.value = !addCardDropdown.value;
      }
      function toggleDeckSelectorDropdown() {
        deckSelectorDropdown.value = !deckSelectorDropdown.value;
      }
      function handleDeckSelect(deckId) {
        if (deckId !== appStore.selectedDeckId) {
          appStore.setSelectedDeckId(deckId);
          logger.debug(`Deck selected: ${deckId}`);
        }
        deckSelectorDropdown.value = false;
      }
      vue.onMounted(() => {
        logger.debug("App component mounted! 🎉");
        const mainElement = document.querySelector(SELECTORS.MIGAKU_MAIN);
        if (!mainElement) {
          logger.error("Main Migaku element not found - this should not happen");
          return;
        }
        logger.debug("Setting up observers");
        themeObserver.value = setupThemeObserver((newTheme) => {
          logger.debug(`Theme changed to: ${newTheme}`);
          appStore.setTheme(newTheme);
        });
        languageObserver.value = setupLanguageObserver(mainElement, (newLanguage) => {
          logger.debug(`Language changed to: ${newLanguage}`);
          appStore.setLanguage(newLanguage);
          appStore.resetDeckSelection();
          logger.debug(`Reset deck selection due to language change`);
        });
        const currentTheme = document.documentElement.getAttribute(ATTRIBUTES.THEME);
        const currentLanguage = mainElement.getAttribute(ATTRIBUTES.LANG_SELECTED);
        if (currentTheme) {
          appStore.setTheme(currentTheme);
        }
        if (currentLanguage) {
          appStore.setLanguage(currentLanguage);
        }
        const componentHash2 = document.querySelector(SELECTORS.STATISTICS_ELEMENT)?.attributes[0].nodeName;
        if (componentHash2) {
          appStore.setComponentHash(componentHash2);
        }
        logger.debug(`Component hash: ${componentHash2}`);
        fetchAvailableDecks().then((decks) => {
          if (decks) {
            appStore.setAvailableDecks(decks);
          }
        });
        window.setTimeout(() => {
          try {
            const nodes = Array.from(document.querySelectorAll("[custom-stat]"));
            for (const node of nodes) {
              const id = node.getAttribute("custom-stat");
              if (!id) continue;
              const minWAttr = node.getAttribute("minW") || node.getAttribute("minw") || node.getAttribute("data-min-w");
              const minHAttr = node.getAttribute("minH") || node.getAttribute("minh") || node.getAttribute("data-min-h");
              const defaultWAttr = node.getAttribute("defaultW") || node.getAttribute("defaultw") || node.getAttribute("data-default-w");
              const defaultHAttr = node.getAttribute("defaultH") || node.getAttribute("defaulth") || node.getAttribute("data-default-h");
              const minW = minWAttr ? Number(minWAttr) : void 0;
              const minH = minHAttr ? Number(minHAttr) : void 0;
              const defaultW = defaultWAttr ? Number(defaultWAttr) : void 0;
              const defaultH = defaultHAttr ? Number(defaultHAttr) : void 0;
              cardsStore.ensureCard(id, { minW, minH, defaultW, defaultH });
            }
          } catch (e2) {
            logger.error("Error scanning custom stats:", e2);
          }
        }, 250);
      });
      vue.onUnmounted(() => {
        logger.debug("Cleaning up observers");
        if (themeObserver.value) {
          themeObserver.value.disconnect();
          themeObserver.value = null;
        }
        if (languageObserver.value) {
          languageObserver.value.disconnect();
          languageObserver.value = null;
        }
      });
      function renderCardComponent(id) {
        if (cardComponents[id]) return cardComponents[id];
        const hasCustom = !!document.querySelector(`[custom-stat="${id.replace(/"/g, '\\"')}"]`);
        return hasCustom ? CustomStat : null;
      }
      vue.watch(
        () => {
          const card = cardsStore.cards.find((c2) => c2.id === "NativeStats");
          return card ? card.visible : true;
        },
        (visible) => {
          const node = document.getElementById("original-stats-card-container");
          if (node) {
            node.style.display = visible ? "" : "none";
          }
        },
        { immediate: true }
      );
      vue.watch(
        () => cardsStore.cards.map((c2) => ({ id: c2.id, visible: c2.visible })),
        (cards) => {
          for (const { id, visible } of cards) {
            if (!cardComponents[id]) {
              const selector = `[custom-stat="${id.replace(/"/g, '\\"')}" ]`;
              const node = document.querySelector(selector);
              if (node) {
                node.style.display = visible ? "" : "none";
              }
            }
          }
        },
        { immediate: true, deep: true }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.createVNode(FloatingButton, vue.normalizeProps({
              [componentHash.value || ""]: true,
              label: "Deck selector",
              customClass: "deck-selector",
              bottom: 72,
              left: 24,
              onClick: toggleDeckSelectorDropdown
            }), {
              icon: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
                vue.createElementVNode("div", {
                  class: "UiIcon",
                  style: { "width": "24px" }
                }, [
                  vue.createElementVNode("div", {
                    class: "UiSvg__inner",
                    style: { "margin": "0", "font-size": "24px" }
                  }, [
                    vue.createElementVNode("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 25 24",
                      role: "img"
                    }, [
                      vue.createElementVNode("path", {
                        fill: "currentColor",
                        "fill-rule": "evenodd",
                        d: "M14.888 1.335a4.25 4.25 0 0 0-5.51 2.4l-.326.826H6.7a4.25 4.25 0 0 0-4.25 4.25v10a4.25 4.25 0 0 0 4.25 4.25h6a4.24 4.24 0 0 0 3.431-1.742 3.64 3.64 0 0 0 2.801-2.261l3.94-10.017a4.25 4.25 0 0 0-2.4-5.51zm2.062 15.932 3.595-9.14a1.75 1.75 0 0 0-.988-2.27l-5.584-2.196a1.75 1.75 0 0 0-2.231.9h.958a4.25 4.25 0 0 1 4.25 4.25zm-12-8.456c0-.967.784-1.75 1.75-1.75h6c.966 0 1.75.783 1.75 1.75v10a1.75 1.75 0 0 1-1.75 1.75h-6a1.75 1.75 0 0 1-1.75-1.75z",
                        "clip-rule": "evenodd"
                      })
                    ])
                  ])
                ], -1)
              ])]),
              _: 1
            }, 16),
            deckSelectorDropdown.value ? (vue.openBlock(), vue.createBlock(ActionSheet, {
              key: 0,
              class: "MCS__deck-selector-action-sheet",
              actions: deckSelectorOptions.value,
              "disable-icons": true,
              onSelect: _cache[0] || (_cache[0] = ($event) => handleDeckSelect($event.action.id))
            }, null, 8, ["actions"])) : vue.createCommentVNode("", true),
            vue.createVNode(FloatingButton, vue.normalizeProps({
              [componentHash.value || ""]: true,
              label: moveMode.value ? "Exit Move Mode" : "Enter Move Mode",
              customClass: "MCS__shuffle-button",
              bottom: 24,
              left: 24,
              onClick: _cache[1] || (_cache[1] = ($event) => {
                setMoveMode(!moveMode.value);
                saveLayout(layout.value);
              })
            }), {
              icon: vue.withCtx(() => [
                vue.createElementVNode("div", _hoisted_3, [
                  vue.createElementVNode("div", _hoisted_4, [
                    moveMode.value ? (vue.openBlock(), vue.createElementBlock("svg", _hoisted_5, [..._cache[5] || (_cache[5] = [
                      vue.createElementVNode("path", {
                        d: "M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, null, -1)
                    ])])) : (vue.openBlock(), vue.createElementBlock("svg", _hoisted_6, [..._cache[6] || (_cache[6] = [
                      vue.createElementVNode("path", {
                        d: "M18 15L21 18M21 18L18 21M21 18H18.5689C17.6297 18 17.1601 18 16.7338 17.8705C16.3564 17.7559 16.0054 17.5681 15.7007 17.3176C15.3565 17.0348 15.096 16.644 14.575 15.8626L14.3333 15.5M18 3L21 6M21 6L18 9M21 6H18.5689C17.6297 6 17.1601 6 16.7338 6.12945C16.3564 6.24406 16.0054 6.43194 15.7007 6.68236C15.3565 6.96523 15.096 7.35597 14.575 8.13744L9.42496 15.8626C8.90398 16.644 8.64349 17.0348 8.29933 17.3176C7.99464 17.5681 7.64357 17.7559 7.2662 17.8705C6.83994 18 6.37033 18 5.43112 18H3M3 6H5.43112C6.37033 6 6.83994 6 7.2662 6.12945C7.64357 6.24406 7.99464 6.43194 8.29933 6.68236C8.64349 6.96523 8.90398 7.35597 9.42496 8.13744L9.66667 8.5",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, null, -1)
                    ])]))
                  ])
                ])
              ]),
              _: 1
            }, 16, ["label"]),
            moveMode.value ? (vue.openBlock(), vue.createBlock(FloatingButton, vue.normalizeProps({
              key: 1,
              [componentHash.value || ""]: true,
              label: "Undo layout",
              customClass: "MCS__undo-button",
              bottom: 24,
              left: 72,
              onClick: undoLayout
            }), {
              icon: vue.withCtx(() => [..._cache[7] || (_cache[7] = [
                vue.createElementVNode("div", {
                  class: "UiIcon",
                  style: { "width": "24px" }
                }, [
                  vue.createElementVNode("div", {
                    class: "UiSvg__inner",
                    style: { "margin": "0", "font-size": "24px" }
                  }, [
                    vue.createElementVNode("svg", {
                      width: "100%",
                      height: "100%",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg"
                    }, [
                      vue.createElementVNode("path", {
                        d: "M3 9H16.5C18.9853 9 21 11.0147 21 13.5C21 15.9853 18.9853 18 16.5 18H12M3 9L7 5M3 9L7 13",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      })
                    ])
                  ])
                ], -1)
              ])]),
              _: 1
            }, 16)) : vue.createCommentVNode("", true),
            moveMode.value && canAddCard.value ? (vue.openBlock(), vue.createBlock(FloatingButton, vue.normalizeProps({
              key: 2,
              [componentHash.value || ""]: true,
              label: "Add card",
              customClass: "MCS__add-button",
              bottom: 24,
              left: 120,
              onClick: toggleAddCardDropdown
            }), {
              icon: vue.withCtx(() => [..._cache[8] || (_cache[8] = [
                vue.createElementVNode("div", {
                  class: "UiIcon",
                  style: { "width": "24px" }
                }, [
                  vue.createElementVNode("div", {
                    class: "UiSvg__inner",
                    style: { "margin": "0", "font-size": "24px" }
                  }, [
                    vue.createElementVNode("svg", {
                      width: "100%",
                      height: "100%",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg"
                    }, [
                      vue.createElementVNode("path", {
                        d: "M12 5V19M5 12H19",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      })
                    ])
                  ])
                ], -1)
              ])]),
              _: 1
            }, 16)) : vue.createCommentVNode("", true),
            addCardDropdown.value && moveMode.value && canAddCard.value ? (vue.openBlock(), vue.createBlock(ActionSheet, {
              key: 3,
              class: "MCS__add-card-action-sheet",
              actions: hiddenCardOptions.value,
              "disable-icons": true,
              onSelect: _cache[2] || (_cache[2] = ($event) => handleAddCardSelect($event.action.id))
            }, null, 8, ["actions"])) : vue.createCommentVNode("", true)
          ]),
          vue.createVNode(vue.unref(De), {
            layout: layout.value,
            "onUpdate:layout": _cache[3] || (_cache[3] = ($event) => layout.value = $event),
            "col-num": 12,
            "row-height": 50,
            "is-draggable": moveMode.value,
            "is-resizable": moveMode.value,
            "vertical-compact": "",
            "use-css-transforms": ""
          }, {
            item: vue.withCtx(({ item }) => [
              vue.createElementVNode("div", {
                class: "MCS__stats-card",
                "data-card-id": item.i
              }, [
                vue.createElementVNode("div", _hoisted_8, [
                  moveMode.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9, "⠿")) : vue.createCommentVNode("", true),
                  vue.createElementVNode("div", _hoisted_10, [
                    moveMode.value ? (vue.openBlock(), vue.createBlock(FloatingButton, {
                      key: 0,
                      onClick: ($event) => hideCard(String(item.i)),
                      label: "Hide card",
                      customClass: "UiButton UiButton--icon",
                      top: 24,
                      right: 24
                    }, {
                      icon: vue.withCtx(() => [..._cache[9] || (_cache[9] = [
                        vue.createElementVNode("div", {
                          class: "UiIcon",
                          style: { "width": "24px" }
                        }, [
                          vue.createElementVNode("div", {
                            class: "UiSvg__inner",
                            style: { "margin": "0", "font-size": "24px" }
                          }, [
                            vue.createElementVNode("svg", {
                              width: "100%",
                              height: "100%",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              xmlns: "http://www.w3.org/2000/svg"
                            }, [
                              vue.createElementVNode("path", {
                                d: "M18 6L6 18M6 6L18 18",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round"
                              })
                            ])
                          ])
                        ], -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])) : vue.createCommentVNode("", true)
                  ])
                ]),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["MCS__card-content", { "-no-events": moveMode.value }])
                }, [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(renderCardComponent(String(item.i)))))
                ], 2)
              ], 8, _hoisted_7)
            ]),
            _: 1
          }, 8, ["layout", "is-draggable", "is-resizable"])
        ]);
      };
    }
  });
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-75be49f4"]]);
  const VUE_CONTAINER_ID = SELECTORS.VUE_CONTAINER_ID;
  let vueAppInstance = null;
  let vueContainer = null;
  let isMounting = false;
  async function mountApp() {
    if (isMounting || vueAppInstance || vueContainer && document.getElementById(VUE_CONTAINER_ID)) {
      logger.debug("Vue app already mounting or mounted.");
      return;
    }
    isMounting = true;
    try {
      logger.debug("Waiting for main Migaku element...");
      const mainElement = await waitForElement(SELECTORS.MIGAKU_MAIN);
      if (!mainElement) {
        logger.error("Main Migaku element not found. App will not mount.");
        return;
      }
      logger.debug("Main element found. Creating Vue app.");
      const app = vue.createApp(App);
      const pinia$1 = pinia.createPinia();
      app.use(pinia$1);
      const appStore = useAppStore();
      appStore.loadFromStorage();
      const statisticsDiv = await waitForElement(SELECTORS.STATISTICS_ELEMENT);
      if (!statisticsDiv) {
        logger.error("Statistics element not found, cannot display stats.");
        return;
      }
      const componentHash = statisticsDiv.attributes[0].nodeName;
      appStore.setComponentHash(componentHash);
      logger.debug(`Component hash set to: ${componentHash}`);
      const statsContainer = await waitForElement(SELECTORS.TARGET_ELEMENT);
      if (!statsContainer || !(statsContainer instanceof HTMLElement)) {
        logger.error("Target container not found, cannot display stats.");
        return;
      }
      statsContainer.style.maxWidth = "100vw";
      _GM_addStyle(`.Statistic__card[${componentHash}] {
      width: 100% !important;
      height: 100% !important;
      max-width: 1080px !important;
    }`);
      const children = statsContainer.children;
      const newDiv = document.createElement("div");
      newDiv.style.height = "100%";
      newDiv.id = "original-stats-card-container";
      Array.from(children).forEach((child) => {
        newDiv.appendChild(child);
      });
      statsContainer.appendChild(newDiv);
      logger.debug("Mounting Vue app to container");
      vueContainer = document.createElement("div");
      vueContainer.id = VUE_CONTAINER_ID;
      statsContainer.appendChild(vueContainer);
      vueAppInstance = app;
      vueAppInstance.mount(vueContainer);
    } finally {
      isMounting = false;
    }
  }
  function unmountApp() {
    if (vueAppInstance && vueContainer) {
      logger.debug("Unmounting Vue app.");
      vueAppInstance.unmount();
      if (vueContainer.parentNode) {
        vueContainer.parentNode.removeChild(vueContainer);
      }
      vueAppInstance = null;
      vueContainer = null;
    }
    isMounting = false;
  }
  function handleRouteChange() {
    if (window.location.pathname === ROUTES.STATS_ROUTE) {
      mountApp();
    } else {
      unmountApp();
    }
  }
  function monkeyPatchHistoryMethods() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(...args) {
      const ret = originalPushState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
    history.replaceState = function(...args) {
      const ret = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
  }
  function setupRouteListener() {
    monkeyPatchHistoryMethods();
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("locationchange", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
  }
  setupRouteListener();
  handleRouteChange();

})(Vue, Pinia, initSqlJs, pako, Chart);