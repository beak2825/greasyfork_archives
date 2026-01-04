// ==UserScript==
// @name         FZ Tracker
// @namespace    https://f95zone.to/threads/186670/
// @version      1.2.0
// @author       feeling_blue
// @description  Track game versions you finished playing on F95Zone.
// @license      MIT
// @icon         https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @supportURL   https://f95zone.to/threads/186670/
// @match        https://f95zone.to/threads/*
// @match        https://f95zone.to/sam/latest_alpha/*
// @require      https://unpkg.com/vue@3.3.13/dist/vue.global.prod.js
// @require      https://unpkg.com/@vueuse/shared@10.7.0/index.iife.min.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://unpkg.com/@vueuse/core@10.7.0/index.iife.min.js
// @require      https://unpkg.com/element-plus@2.4.4/dist/index.full.min.js
// @require      https://unpkg.com/@element-plus/icons-vue@2.3.1/dist/index.iife.min.js
// @resource     element-plus/dist/index.css  https://unpkg.com/element-plus@2.4.4/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/483174/FZ%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/483174/FZ%20Tracker.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const o=document.createElement("style");o.textContent=r,document.head.append(o)})(' html.dark{color-scheme:dark;--el-color-primary:#409eff;--el-color-primary-light-3:#3375b9;--el-color-primary-light-5:#2a598a;--el-color-primary-light-7:#213d5b;--el-color-primary-light-8:#1d3043;--el-color-primary-light-9:#18222c;--el-color-primary-dark-2:#66b1ff;--el-color-success:#67c23a;--el-color-success-light-3:#4e8e2f;--el-color-success-light-5:#3e6b27;--el-color-success-light-7:#2d481f;--el-color-success-light-8:#25371c;--el-color-success-light-9:#1c2518;--el-color-success-dark-2:#85ce61;--el-color-warning:#e6a23c;--el-color-warning-light-3:#a77730;--el-color-warning-light-5:#7d5b28;--el-color-warning-light-7:#533f20;--el-color-warning-light-8:#3e301c;--el-color-warning-light-9:#292218;--el-color-warning-dark-2:#ebb563;--el-color-danger:#f56c6c;--el-color-danger-light-3:#b25252;--el-color-danger-light-5:#854040;--el-color-danger-light-7:#582e2e;--el-color-danger-light-8:#412626;--el-color-danger-light-9:#2b1d1d;--el-color-danger-dark-2:#f78989;--el-color-error:#f56c6c;--el-color-error-light-3:#b25252;--el-color-error-light-5:#854040;--el-color-error-light-7:#582e2e;--el-color-error-light-8:#412626;--el-color-error-light-9:#2b1d1d;--el-color-error-dark-2:#f78989;--el-color-info:#909399;--el-color-info-light-3:#6b6d71;--el-color-info-light-5:#525457;--el-color-info-light-7:#393a3c;--el-color-info-light-8:#2d2d2f;--el-color-info-light-9:#202121;--el-color-info-dark-2:#a6a9ad;--el-box-shadow:0px 12px 32px 4px rgba(0, 0, 0, .36),0px 8px 20px rgba(0, 0, 0, .72);--el-box-shadow-light:0px 0px 12px rgba(0, 0, 0, .72);--el-box-shadow-lighter:0px 0px 6px rgba(0, 0, 0, .72);--el-box-shadow-dark:0px 16px 48px 16px rgba(0, 0, 0, .72),0px 12px 32px #000000,0px 8px 16px -8px #000000;--el-bg-color-page:#0a0a0a;--el-bg-color:#141414;--el-bg-color-overlay:#1d1e1f;--el-text-color-primary:#E5EAF3;--el-text-color-regular:#CFD3DC;--el-text-color-secondary:#A3A6AD;--el-text-color-placeholder:#8D9095;--el-text-color-disabled:#6C6E72;--el-border-color-darker:#636466;--el-border-color-dark:#58585B;--el-border-color:#4C4D4F;--el-border-color-light:#414243;--el-border-color-lighter:#363637;--el-border-color-extra-light:#2B2B2C;--el-fill-color-darker:#424243;--el-fill-color-dark:#39393A;--el-fill-color:#303030;--el-fill-color-light:#262727;--el-fill-color-lighter:#1D1D1D;--el-fill-color-extra-light:#191919;--el-fill-color-blank:transparent;--el-mask-color:rgba(0, 0, 0, .8);--el-mask-color-extra-light:rgba(0, 0, 0, .3)}html.dark .el-button{--el-button-disabled-text-color:rgba(255, 255, 255, .5)}html.dark .el-card{--el-card-bg-color:var(--el-bg-color-overlay)}html.dark .el-empty{--el-empty-fill-color-0:var(--el-color-black);--el-empty-fill-color-1:#4b4b52;--el-empty-fill-color-2:#36383d;--el-empty-fill-color-3:#1e1e20;--el-empty-fill-color-4:#262629;--el-empty-fill-color-5:#202124;--el-empty-fill-color-6:#212224;--el-empty-fill-color-7:#1b1c1f;--el-empty-fill-color-8:#1c1d1f;--el-empty-fill-color-9:#18181a}#--unocss--{layer:__ALL__}.el-form-item.button-group[data-v-9a23e112] .el-form-item__content{justify-content:flex-end}.fz-tracker .p-body-header{z-index:5}.fz-tracker .p-body{z-index:4}.fz-tracker .el-icon svg path{fill:currentColor}#--unocss-layer-start--__ALL__--{start:__ALL__}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.m-l-\\[10px\\]{margin-left:10px}.m-t-\\[5px\\]{margin-top:5px}.ml-4{margin-left:1rem}.inline-block{display:inline-block}[size~="20"]{width:5rem;height:5rem}[size~="35"]{width:8.75rem;height:8.75rem}.cursor-pointer{cursor:pointer}.border-rd-\\[3px\\]{border-radius:3px}.p-\\[5px\\]{padding:5px}.p-1{padding:.25rem}.p-l-\\[5px\\]{padding-left:5px}.v-middle{vertical-align:middle}.v-sub{vertical-align:sub}.text-\\[0\\.75em\\]{font-size:.75em}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[rgb\\(147\\,152\\,160\\)\\]{--un-text-opacity:1;color:rgb(147 152 160 / var(--un-text-opacity))}.text-\\#ec5555{--un-text-opacity:1;color:rgb(236 85 85 / var(--un-text-opacity))}.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.opacity-70{opacity:.7}.hover\\:opacity-100:hover{opacity:1}.backdrop-blur-5{--un-backdrop-blur:blur(5px);-webkit-backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia);backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)}.blur{--un-blur:blur(8px);filter:var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)}#--unocss-layer-end--__ALL__--{end:__ALL__} ');

(function (vue, ElementPlus, core, iconsVue) {
  'use strict';

  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  function gameStorageKey(gameID) {
    return `${gameID}-tracker`;
  }
  const _hoisted_1$1 = { class: "backdrop-blur-5 text-[0.75em] p-[5px] p-l-[5px] m-l-[10px] m-t-[5px] border-rd-[3px]" };
  const _sfc_main$2 = {
    __name: "LatestRecordTag",
    setup(__props) {
      const gameInfo = vue.inject("gameInfo");
      const gameData = JSON.parse(localStorage.getItem(gameStorageKey(gameInfo.ID)));
      const lastRecord = gameData.records[gameData.records.length - 1];
      const timeAgo = core.useTimeAgo(lastRecord ? lastRecord.time : null);
      let versionText = "";
      if (lastRecord && lastRecord.version !== gameInfo.version)
        versionText = `[${lastRecord.version}] `;
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, vue.toDisplayString(vue.unref(versionText)) + vue.toDisplayString(vue.unref(lastRecord) ? vue.unref(timeAgo) : ""), 1);
      };
    }
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var dayjs_min = { exports: {} };
  (function(module, exports) {
    !function(t, e) {
      module.exports = e();
    }(commonjsGlobal, function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date())
          return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = "$isDayjsObject", S = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r2) {
        var i2;
        if (!e2)
          return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1)
            return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O = function(t2, e2) {
        if (S(t2))
          return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v;
      b.l = w, b.i = S, b.w = function(t2, e2) {
        return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2)
              return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2))
              return /* @__PURE__ */ new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = b.p(f2), y2 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c)
            return this.set(c, this.$M + r2);
          if ($2 === h)
            return this.set(h, this.$y + r2);
          if ($2 === a)
            return y2(1);
          if ($2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid())
            return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, function(t3, r3) {
            return r3 || function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s2, u2, true);
                case "A":
                  return $2(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            }(t3) || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M3) {
            case h:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2)
            return this.$L;
          var n2 = this.clone(), r2 = w(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), k = _.prototype;
      return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
        k[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), O.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O), t2.$i = true), O;
      }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
        return O(1e3 * t2);
      }, O.en = D[g], O.Ls = D, O.p = {}, O;
    });
  })(dayjs_min);
  var dayjs_minExports = dayjs_min.exports;
  const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
  const trackerVersion = "1.2.0";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = {
    key: 0,
    class: "text-2xl"
  };
  const _sfc_main$1 = {
    __name: "VersionTracker",
    setup(__props) {
      const gameInfo = vue.inject("gameInfo");
      const gameData = core.useLocalStorage(
        gameStorageKey(gameInfo.ID),
        {
          name: gameInfo.name,
          author: gameInfo.author,
          records: [],
          trackerVersion
        },
        {
          deep: true,
          listenToStorageChanges: true
        }
      );
      for (const prop of ["name", "author", "scriptVersion"]) {
        if (gameData.value[prop] !== gameInfo[prop]) {
          gameData.value[prop] = gameInfo[prop];
        }
      }
      const checked = vue.computed({
        get() {
          return gameData.value.records.some((record) => record.version === gameInfo.version);
        },
        set(newVal) {
          if (newVal)
            addRecord(gameInfo);
          else
            removeRecord(gameInfo);
        }
      });
      const lastRecord = vue.computed(() => {
        const records = gameData.value.records;
        if (records.length > 0) {
          return records[records.length - 1];
        }
        return null;
      });
      const lastRecordTime = vue.computed(() => {
        if (lastRecord.value) {
          return lastRecord.value.time;
        }
        return null;
      });
      const timeAgo = core.useTimeAgo(lastRecordTime);
      const lastPlayedText = vue.computed(() => {
        if (!lastRecord.value)
          return "";
        const lastRecordVersion = lastRecord.value.version;
        if (lastRecordVersion === gameInfo.version) {
          return "Finished ";
        } else {
          return `Finished [${lastRecordVersion}] `;
        }
      });
      const removeFlagConfirmVisible = vue.ref(false);
      function handleFlagClick() {
        if (checked.value) {
          removeFlagConfirmVisible.value = true;
        } else {
          checked.value = true;
        }
      }
      const form = vue.reactive({
        version: "",
        date: ""
      });
      const rules = vue.reactive({
        version: [
          {
            required: true,
            message: "Please input version",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "Length should be 1 to 30",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (gameData.value.records.some((record) => record.version === value)) {
                callback(new Error(`[${value}] already recorded`));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "Please pick a date",
            trigger: "change"
          }
        ]
      });
      const formRef = vue.ref(null);
      const popoverVisible = vue.ref(false);
      const onSubmit = () => {
        formRef.value.validate().then(() => {
          addRecord({
            version: form.version,
            time: form.date.getTime()
          });
          popoverVisible.value = false;
          form.version = "";
          form.date = "";
        }).catch(() => {
        });
      };
      const popoverCommonProps = {
        effect: "light",
        teleported: false,
        placement: "bottom"
      };
      function addRecord({ version, time }) {
        time = time || Date.now();
        gameData.value.records.push({
          version,
          time
        });
        gameData.value.records.sort((a, b) => a.time - b.time);
      }
      function removeRecord({ version }) {
        gameData.value.records = gameData.value.records.filter((record) => record.version !== version);
      }
      function formatTime(time) {
        if (dayjs(time).hour() === 0 && dayjs(time).minute() === 0 && dayjs(time).second() === 0) {
          return dayjs(time).format("YYYY-MM-DD");
        } else {
          return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
        }
      }
      return (_ctx, _cache) => {
        const _component_el_icon = vue.resolveComponent("el-icon");
        const _component_el_popconfirm = vue.resolveComponent("el-popconfirm");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_popover = vue.resolveComponent("el-popover");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        return vue.openBlock(), vue.createElementBlock("span", null, [
          vue.createVNode(_component_el_popconfirm, vue.mergeProps({ visible: vue.unref(removeFlagConfirmVisible) }, popoverCommonProps, {
            width: "350",
            "confirm-button-text": "OK",
            "cancel-button-text": "Cancel",
            title: "Remove flag and delete corresponding record?",
            onConfirm: _cache[0] || (_cache[0] = ($event) => removeFlagConfirmVisible.value = checked.value = false),
            onCancel: _cache[1] || (_cache[1] = ($event) => removeFlagConfirmVisible.value = false)
          }), {
            reference: vue.withCtx(() => [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["p-1 inline-block cursor-pointer v-sub", vue.unref(checked) ? "text-#ec5555" : "text-[rgb(147,152,160)]"])
              }, [
                vue.createVNode(_component_el_icon, {
                  size: 35,
                  onClick: handleFlagClick
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(iconsVue.Flag))
                  ]),
                  _: 1
                })
              ], 2)
            ]),
            _: 1
          }, 16, ["visible"]),
          vue.unref(lastPlayedText) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, [
            vue.createTextVNode(vue.toDisplayString(vue.unref(lastPlayedText)) + " ", 1),
            vue.createVNode(_component_el_tooltip, vue.mergeProps(popoverCommonProps, {
              content: formatTime(vue.unref(lastRecordTime))
            }), {
              default: vue.withCtx(() => [
                vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(timeAgo)), 1)
              ]),
              _: 1
            }, 16, ["content"])
          ])) : vue.createCommentVNode("", true),
          vue.createVNode(_component_el_popover, vue.mergeProps(popoverCommonProps, {
            visible: vue.unref(popoverVisible),
            width: 350,
            trigger: "click"
          }), {
            reference: vue.withCtx(() => [
              vue.createVNode(_component_el_icon, {
                size: 20,
                class: "v-middle ml-4 cursor-pointer text-white opacity-70 hover:opacity-100"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(iconsVue.CirclePlusFilled), {
                    onClick: _cache[2] || (_cache[2] = ($event) => popoverVisible.value = true)
                  })
                ]),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form, {
                ref_key: "formRef",
                ref: formRef,
                "label-width": "130px",
                rules: vue.unref(rules),
                model: vue.unref(form)
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form_item, {
                    label: "Finished Version",
                    prop: "version"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: vue.unref(form).version,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(form).version = $event)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, {
                    label: "Finished Time",
                    prop: "date"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_date_picker, {
                        modelValue: vue.unref(form).date,
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(form).date = $event),
                        teleported: false,
                        "data-popper-placement": "bottom",
                        type: "date",
                        placeholder: "Pick a date",
                        style: { "width": "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { class: "button-group" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_button, {
                        size: "small",
                        onClick: _cache[5] || (_cache[5] = ($event) => popoverVisible.value = false)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("Cancel")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_button, {
                        size: "small",
                        type: "primary",
                        onClick: onSubmit
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("Create")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["rules", "model"])
            ]),
            _: 1
          }, 16, ["visible"]),
          vue.createVNode(_component_el_popover, vue.mergeProps(popoverCommonProps, {
            width: 500,
            trigger: "click"
          }), {
            reference: vue.withCtx(() => [
              vue.createVNode(_component_el_icon, {
                size: 20,
                class: "v-middle ml-4 cursor-pointer text-white opacity-70 hover:opacity-100"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(iconsVue.Document), {
                    onClick: ($event) => 1
                  })
                ]),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table, {
                data: vue.unref(gameData).records,
                "default-sort": { prop: "time", order: "descending" }
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    "min-width": "120",
                    property: "version",
                    label: "Version"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    sortable: "",
                    "min-width": "150",
                    property: "time",
                    label: "Time"
                  }, {
                    default: vue.withCtx(({ row }) => [
                      vue.createTextVNode(vue.toDisplayString(formatTime(row.time)), 1)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    "min-width": "100",
                    label: "Operations"
                  }, {
                    default: vue.withCtx(({ row }) => [
                      vue.createVNode(_component_el_button, {
                        size: "small",
                        type: "danger",
                        onClick: ($event) => removeRecord(row)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" Delete ")
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["data"])
            ]),
            _: 1
          }, 16)
        ]);
      };
    }
  };
  const VersionTracker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9a23e112"]]);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const titleElement2 = vue.inject("titleElement");
      document.documentElement.classList.add("fz-tracker");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, { to: vue.unref(titleElement2) }, [
          vue.createVNode(VersionTracker)
        ], 8, ["to"]);
      };
    }
  };
  document.documentElement.classList.add("dark");
  const titleElement = document.querySelector(".p-title-value");
  const isGamePage = (() => {
    const breadcrumbUl = document.querySelector("ul.p-breadcrumbs");
    if (breadcrumbUl) {
      const breadcrumbs = [...breadcrumbUl.querySelectorAll(":scope > li")];
      return breadcrumbs.length === 3 && breadcrumbs[2].innerText.trim().toLowerCase().includes("games");
    }
    return false;
  })();
  const isLatestUpdatesPage = window.location.pathname.startsWith("/sam/latest_alpha");
  if (isGamePage) {
    const gameInfo = titleElement ? (() => {
      const titleText = [...titleElement.childNodes].find((node) => node.nodeType === Node.TEXT_NODE).textContent.trim();
      const matches = titleText.match(/^(.*?)\s*\[(.*?)\]\s*\[(.*?)\]$/);
      if (matches && matches.length === 4) {
        const ID = window.location.pathname.split("/")[2].split(".")[1];
        return {
          ID,
          name: matches[1],
          version: matches[2],
          author: matches[3]
        };
      }
    })() : null;
    if (gameInfo) {
      const appEl = document.createElement("div");
      document.body.append(appEl);
      vue.createApp(_sfc_main).use(ElementPlus).provide("gameInfo", gameInfo).provide("titleElement", titleElement).mount(appEl);
    }
  } else if (isLatestUpdatesPage) {
    const gameCardListEl = document.querySelector("#latest-page_items-wrap_inner");
    if (gameCardListEl) {
      gameCardListEl.querySelectorAll("[data-thread-id]").forEach(mountTag);
      core.useMutationObserver(
        gameCardListEl,
        (mutations) => {
          mutations.filter((mutation) => mutation.type === "childList" && mutation.addedNodes.length > 0).map((mutation) => [...mutation.addedNodes]).flat().forEach(mountTag);
        },
        { childList: true }
      );
    }
  }
  function mountTag(gameInfoEl) {
    const gameInfo = {
      ID: parseInt(gameInfoEl.getAttribute("data-thread-id"), 10),
      name: gameInfoEl.querySelector(".resource-tile_info-header_title").textContent.trim(),
      version: gameInfoEl.querySelector(".resource-tile_label-version").textContent.trim(),
      author: gameInfoEl.querySelector(".resource-tile_dev").textContent.trim()
    };
    if (localStorage.getItem(gameStorageKey(gameInfo.ID))) {
      const tageContainer = document.createElement("div");
      Object.assign(tageContainer.style, {
        position: "absolute",
        left: 0,
        top: 0
      });
      gameInfoEl.append(tageContainer);
      vue.createApp(_sfc_main$2).provide("gameInfo", gameInfo).mount(tageContainer);
    }
  }

})(Vue, ElementPlus, VueUse, ElementPlusIconsVue);