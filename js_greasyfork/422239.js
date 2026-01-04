// ==UserScript==
// @name              Iwara Download Tool
// @description       Download videos from iwara.tv
// @name:ja           Iwara バッチダウンローダー
// @description:ja    Iwara 動画バッチをダウンロード
// @name:zh-CN        Iwara 批量下载工具
// @description:zh-CN 批量下载 Iwara 视频
// @icon              https://www.google.com/s2/favicons?sz=64&domain=iwara.tv
// @namespace         https://github.com/dawn-lc/
// @author            dawn-lc
// @license           Apache-2.0
// @copyright         2025, Dawnlc (https://dawnlc.me/)
// @source            https://github.com/dawn-lc/IwaraDownloadTool
// @supportURL        https://github.com/dawn-lc/IwaraDownloadTool/issues
// @connect           iwara.tv
// @connect           *.iwara.*
// @connect           mmdfans.net
// @connect           *.mmdfans.net
// @connect           localhost
// @connect           127.0.0.1
// @connect           *
// @include           *://*.iwara.*/*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_listValues
// @grant             GM_deleteValue
// @grant             GM_addValueChangeListener
// @grant             GM_addStyle
// @grant             GM_setClipboard
// @grant             GM_download
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @grant             GM_info
// @grant             unsafeWindow
// @grant             window.close
// @run-at            document-start
// @version           3.3.66
// @downloadURL https://update.greasyfork.org/scripts/422239/Iwara%20Download%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/422239/Iwara%20Download%20Tool.meta.js
// ==/UserScript==
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var require_dayjs_min = __commonJS({
    "node_modules/dayjs/dayjs.min.js"(exports, module) {
      "use strict";
      (function(T2, g4) {
        typeof exports == "object" && typeof module < "u" ? module.exports = g4() : typeof define == "function" && define.amd ? define(g4) : (T2 = typeof globalThis < "u" ? globalThis : T2 || self).dayjs = g4();
      })(exports, (function() {
        "use strict";
        var T2 = 1e3, g4 = 6e4, U = 36e5, A2 = "millisecond", w2 = "second", O2 = "minute", b2 = "hour", M2 = "day", L2 = "week", m2 = "month", F2 = "quarter", y2 = "year", _ = "date", J = "Invalid Date", V2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, q = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, B2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(i3) {
          var n5 = ["th", "st", "nd", "rd"], t2 = i3 % 100;
          return "[" + i3 + (n5[(t2 - 20) % 10] || n5[t2] || n5[0]) + "]";
        } }, I2 = function(i3, n5, t2) {
          var r2 = String(i3);
          return !r2 || r2.length >= n5 ? i3 : "" + Array(n5 + 1 - r2.length).join(t2) + i3;
        }, E2 = { s: I2, z: function(i3) {
          var n5 = -i3.utcOffset(), t2 = Math.abs(n5), r2 = Math.floor(t2 / 60), e = t2 % 60;
          return (n5 <= 0 ? "+" : "-") + I2(r2, 2, "0") + ":" + I2(e, 2, "0");
        }, m: function i3(n5, t2) {
          if (n5.date() < t2.date()) return -i3(t2, n5);
          var r2 = 12 * (t2.year() - n5.year()) + (t2.month() - n5.month()), e = n5.clone().add(r2, m2), s = t2 - e < 0, u3 = n5.clone().add(r2 + (s ? -1 : 1), m2);
          return +(-(r2 + (t2 - e) / (s ? e - u3 : u3 - e)) || 0);
        }, a: function(i3) {
          return i3 < 0 ? Math.ceil(i3) || 0 : Math.floor(i3);
        }, p: function(i3) {
          return { M: m2, y: y2, w: L2, d: M2, D: _, h: b2, m: O2, s: w2, ms: A2, Q: F2 }[i3] || String(i3 || "").toLowerCase().replace(/s$/, "");
        }, u: function(i3) {
          return i3 === void 0;
        } }, Y = "en", D2 = {};
        D2[Y] = B2;
        var Z = "$isDayjsObject", N = function(i3) {
          return i3 instanceof C2 || !(!i3 || !i3[Z]);
        }, W2 = function i3(n5, t2, r2) {
          var e;
          if (!n5) return Y;
          if (typeof n5 == "string") {
            var s = n5.toLowerCase();
            D2[s] && (e = s), t2 && (D2[s] = t2, e = s);
            var u3 = n5.split("-");
            if (!e && u3.length > 1) return i3(u3[0]);
          } else {
            var o = n5.name;
            D2[o] = n5, e = o;
          }
          return !r2 && e && (Y = e), e || !r2 && Y;
        }, f2 = function(i3, n5) {
          if (N(i3)) return i3.clone();
          var t2 = typeof n5 == "object" ? n5 : {};
          return t2.date = i3, t2.args = arguments, new C2(t2);
        }, a3 = E2;
        a3.l = W2, a3.i = N, a3.w = function(i3, n5) {
          return f2(i3, { locale: n5.$L, utc: n5.$u, x: n5.$x, $offset: n5.$offset });
        };
        var C2 = (function() {
          function i3(t2) {
            this.$L = W2(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[Z] = true;
          }
          var n5 = i3.prototype;
          return n5.parse = function(t2) {
            this.$d = (function(r2) {
              var e = r2.date, s = r2.utc;
              if (e === null) return new Date(NaN);
              if (a3.u(e)) return new Date();
              if (e instanceof Date) return new Date(e);
              if (typeof e == "string" && !/Z$/i.test(e)) {
                var u3 = e.match(V2);
                if (u3) {
                  var o = u3[2] - 1 || 0, c2 = (u3[7] || "0").substring(0, 3);
                  return s ? new Date(Date.UTC(u3[1], o, u3[3] || 1, u3[4] || 0, u3[5] || 0, u3[6] || 0, c2)) : new Date(u3[1], o, u3[3] || 1, u3[4] || 0, u3[5] || 0, u3[6] || 0, c2);
                }
              }
              return new Date(e);
            })(t2), this.init();
          }, n5.init = function() {
            var t2 = this.$d;
            this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
          }, n5.$utils = function() {
            return a3;
          }, n5.isValid = function() {
            return this.$d.toString() !== J;
          }, n5.isSame = function(t2, r2) {
            var e = f2(t2);
            return this.startOf(r2) <= e && e <= this.endOf(r2);
          }, n5.isAfter = function(t2, r2) {
            return f2(t2) < this.startOf(r2);
          }, n5.isBefore = function(t2, r2) {
            return this.endOf(r2) < f2(t2);
          }, n5.$g = function(t2, r2, e) {
            return a3.u(t2) ? this[r2] : this.set(e, t2);
          }, n5.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
          }, n5.valueOf = function() {
            return this.$d.getTime();
          }, n5.startOf = function(t2, r2) {
            var e = this, s = !!a3.u(r2) || r2, u3 = a3.p(t2), o = function(S2, $) {
              var v2 = a3.w(e.$u ? Date.UTC(e.$y, $, S2) : new Date(e.$y, $, S2), e);
              return s ? v2 : v2.endOf(M2);
            }, c2 = function(S2, $) {
              return a3.w(e.toDate()[S2].apply(e.toDate("s"), (s ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice($)), e);
            }, h2 = this.$W, d = this.$M, l2 = this.$D, k2 = "set" + (this.$u ? "UTC" : "");
            switch (u3) {
              case y2:
                return s ? o(1, 0) : o(31, 11);
              case m2:
                return s ? o(1, d) : o(0, d + 1);
              case L2:
                var p3 = this.$locale().weekStart || 0, H = (h2 < p3 ? h2 + 7 : h2) - p3;
                return o(s ? l2 - H : l2 + (6 - H), d);
              case M2:
              case _:
                return c2(k2 + "Hours", 0);
              case b2:
                return c2(k2 + "Minutes", 1);
              case O2:
                return c2(k2 + "Seconds", 2);
              case w2:
                return c2(k2 + "Milliseconds", 3);
              default:
                return this.clone();
            }
          }, n5.endOf = function(t2) {
            return this.startOf(t2, false);
          }, n5.$set = function(t2, r2) {
            var e, s = a3.p(t2), u3 = "set" + (this.$u ? "UTC" : ""), o = (e = {}, e[M2] = u3 + "Date", e[_] = u3 + "Date", e[m2] = u3 + "Month", e[y2] = u3 + "FullYear", e[b2] = u3 + "Hours", e[O2] = u3 + "Minutes", e[w2] = u3 + "Seconds", e[A2] = u3 + "Milliseconds", e)[s], c2 = s === M2 ? this.$D + (r2 - this.$W) : r2;
            if (s === m2 || s === y2) {
              var h2 = this.clone().set(_, 1);
              h2.$d[o](c2), h2.init(), this.$d = h2.set(_, Math.min(this.$D, h2.daysInMonth())).$d;
            } else o && this.$d[o](c2);
            return this.init(), this;
          }, n5.set = function(t2, r2) {
            return this.clone().$set(t2, r2);
          }, n5.get = function(t2) {
            return this[a3.p(t2)]();
          }, n5.add = function(t2, r2) {
            var e, s = this;
            t2 = Number(t2);
            var u3 = a3.p(r2), o = function(d) {
              var l2 = f2(s);
              return a3.w(l2.date(l2.date() + Math.round(d * t2)), s);
            };
            if (u3 === m2) return this.set(m2, this.$M + t2);
            if (u3 === y2) return this.set(y2, this.$y + t2);
            if (u3 === M2) return o(1);
            if (u3 === L2) return o(7);
            var c2 = (e = {}, e[O2] = g4, e[b2] = U, e[w2] = T2, e)[u3] || 1, h2 = this.$d.getTime() + t2 * c2;
            return a3.w(h2, this);
          }, n5.subtract = function(t2, r2) {
            return this.add(-1 * t2, r2);
          }, n5.format = function(t2) {
            var r2 = this, e = this.$locale();
            if (!this.isValid()) return e.invalidDate || J;
            var s = t2 || "YYYY-MM-DDTHH:mm:ssZ", u3 = a3.z(this), o = this.$H, c2 = this.$m, h2 = this.$M, d = e.weekdays, l2 = e.months, k2 = e.meridiem, p3 = function($, v2, x2, j2) {
              return $ && ($[v2] || $(r2, s)) || x2[v2].slice(0, j2);
            }, H = function($) {
              return a3.s(o % 12 || 12, $, "0");
            }, S2 = k2 || function($, v2, x2) {
              var j2 = $ < 12 ? "AM" : "PM";
              return x2 ? j2.toLowerCase() : j2;
            };
            return s.replace(q, (function($, v2) {
              return v2 || (function(x2) {
                switch (x2) {
                  case "YY":
                    return String(r2.$y).slice(-2);
                  case "YYYY":
                    return a3.s(r2.$y, 4, "0");
                  case "M":
                    return h2 + 1;
                  case "MM":
                    return a3.s(h2 + 1, 2, "0");
                  case "MMM":
                    return p3(e.monthsShort, h2, l2, 3);
                  case "MMMM":
                    return p3(l2, h2);
                  case "D":
                    return r2.$D;
                  case "DD":
                    return a3.s(r2.$D, 2, "0");
                  case "d":
                    return String(r2.$W);
                  case "dd":
                    return p3(e.weekdaysMin, r2.$W, d, 2);
                  case "ddd":
                    return p3(e.weekdaysShort, r2.$W, d, 3);
                  case "dddd":
                    return d[r2.$W];
                  case "H":
                    return String(o);
                  case "HH":
                    return a3.s(o, 2, "0");
                  case "h":
                    return H(1);
                  case "hh":
                    return H(2);
                  case "a":
                    return S2(o, c2, true);
                  case "A":
                    return S2(o, c2, false);
                  case "m":
                    return String(c2);
                  case "mm":
                    return a3.s(c2, 2, "0");
                  case "s":
                    return String(r2.$s);
                  case "ss":
                    return a3.s(r2.$s, 2, "0");
                  case "SSS":
                    return a3.s(r2.$ms, 3, "0");
                  case "Z":
                    return u3;
                }
                return null;
              })($) || u3.replace(":", "");
            }));
          }, n5.utcOffset = function() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }, n5.diff = function(t2, r2, e) {
            var s, u3 = this, o = a3.p(r2), c2 = f2(t2), h2 = (c2.utcOffset() - this.utcOffset()) * g4, d = this - c2, l2 = function() {
              return a3.m(u3, c2);
            };
            switch (o) {
              case y2:
                s = l2() / 12;
                break;
              case m2:
                s = l2();
                break;
              case F2:
                s = l2() / 3;
                break;
              case L2:
                s = (d - h2) / 6048e5;
                break;
              case M2:
                s = (d - h2) / 864e5;
                break;
              case b2:
                s = d / U;
                break;
              case O2:
                s = d / g4;
                break;
              case w2:
                s = d / T2;
                break;
              default:
                s = d;
            }
            return e ? s : a3.a(s);
          }, n5.daysInMonth = function() {
            return this.endOf(m2).$D;
          }, n5.$locale = function() {
            return D2[this.$L];
          }, n5.locale = function(t2, r2) {
            if (!t2) return this.$L;
            var e = this.clone(), s = W2(t2, r2, true);
            return s && (e.$L = s), e;
          }, n5.clone = function() {
            return a3.w(this.$d, this);
          }, n5.toDate = function() {
            return new Date(this.valueOf());
          }, n5.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
          }, n5.toISOString = function() {
            return this.$d.toISOString();
          }, n5.toString = function() {
            return this.$d.toUTCString();
          }, i3;
        })(), z = C2.prototype;
        return f2.prototype = z, [["$ms", A2], ["$s", w2], ["$m", O2], ["$H", b2], ["$W", M2], ["$M", m2], ["$y", y2], ["$D", _]].forEach((function(i3) {
          z[i3[1]] = function(n5) {
            return this.$g(n5, i3[0], i3[1]);
          };
        })), f2.extend = function(i3, n5) {
          return i3.$i || (i3(n5, C2, f2), i3.$i = true), f2;
        }, f2.locale = W2, f2.isDayjs = N, f2.unix = function(i3) {
          return f2(1e3 * i3);
        }, f2.en = D2[Y], f2.Ls = D2, f2.p = {}, f2;
      }));
    }
  });
  var ConvertibleNumber = Symbol("ConvertibleNumber");
  var PositiveInteger = Symbol("PositiveInteger");
  var NegativeInteger = Symbol("NegativeInteger");
  var PositiveFloat = Symbol("PositiveFloat");
  var NegativeFloat = Symbol("NegativeFloat");
  var emojiSeq = String.raw`(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|(?![0-9#*])\p{Emoji})`;
  var emojiSTags = String.raw`\u{E0061}-\u{E007A}`;
  var emojiRegex = new RegExp(String.raw`[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[${emojiSTags}]{2}[\u{E0030}-\u{E0039}${emojiSTags}]{1,3}\u{E007F}|${emojiSeq}(?:\u200D${emojiSeq})*`, "gu");
  var isNull = (obj) => obj === null;
  var isUndefined = (obj) => typeof obj === "undefined";
  var isNullOrUndefined = (obj) => isUndefined(obj) || isNull(obj);
  var isObject = (obj) => !isNullOrUndefined(obj) && typeof obj === "object" && !Array.isArray(obj);
  var isString = (obj) => !isNullOrUndefined(obj) && typeof obj === "string";
  var isNumber = (obj) => !isNullOrUndefined(obj) && typeof obj === "number";
  var isArray = (obj) => Array.isArray(obj);
  var isElement = (obj) => !isNullOrUndefined(obj) && obj instanceof Element;
  var isNode = (obj) => !isNullOrUndefined(obj) && obj instanceof Node;
  var isNotEmpty = (obj) => {
    if (isNullOrUndefined(obj)) {
      return false;
    }
    if (Array.isArray(obj)) {
      return obj.some(isNotEmpty);
    }
    if (isString(obj)) {
      return !obj.isEmpty();
    }
    if (isNumber(obj)) {
      return !Number.isNaN(obj);
    }
    if (isElement(obj) || isNode(obj)) {
      return true;
    }
    if (isObject(obj)) {
      return Object.values(obj).some(isNotEmpty);
    }
    return true;
  };
  var isVideoInfo = (obj) => {
    if (obj === null || typeof obj !== "object") return false;
    const info = obj;
    return isInitVideoInfo(info) || isFullVideoInfo(info) || isPartialVideoInfo(info) || isCacheVideoInfo(info) || isFailVideoInfo(info);
  };
  var hasValidID = (info) => isString(info.ID) && isNotEmpty(info.ID);
  var isInitVideoInfo = (info) => !isNullOrUndefined(info) && info.Type === "init" && hasValidID(info);
  var isFullVideoInfo = (info) => !isNullOrUndefined(info) && info.Type === "full" && hasValidID(info) && isNumber(info.UploadTime) && isString(info.Title) && isNotEmpty(info.Title) && isString(info.FileName) && isNotEmpty(info.FileName) && isNumber(info.Size) && isArray(info.Tags) && typeof info.Liked === "boolean" && typeof info.Following === "boolean" && typeof info.Friend === "boolean" && isString(info.Author) && isNotEmpty(info.Author) && isString(info.AuthorID) && isNotEmpty(info.AuthorID) && typeof info.Private === "boolean" && typeof info.Unlisted === "boolean" && isString(info.DownloadQuality) && typeof info.External === "boolean" && isString(info.DownloadUrl) && isNotEmpty(info.DownloadUrl) && isObject(info.RAW);
  var isPartialVideoInfo = (info) => !isNullOrUndefined(info) && info.Type === "partial" && hasValidID(info) && isNumber(info.UploadTime) && isString(info.Title) && isNotEmpty(info.Title) && isArray(info.Tags) && typeof info.Liked === "boolean" && isString(info.Author) && isNotEmpty(info.Author) && isString(info.AuthorID) && isNotEmpty(info.AuthorID) && typeof info.Private === "boolean" && typeof info.Unlisted === "boolean" && typeof info.External === "boolean" && isObject(info.RAW);
  var isCacheVideoInfo = (info) => !isNullOrUndefined(info) && info.Type === "cache" && hasValidID(info) && isObject(info.RAW);
  var isFailVideoInfo = (info) => !isNullOrUndefined(info) && info.Type === "fail" && hasValidID(info);
  var assertVideoInfoType = (info) => {
    switch (info.Type) {
      case "init":
        return info;
      case "full":
        return info;
      case "partial":
        return info;
      case "cache":
        return info;
      case "fail":
        return info;
      default:
        throw new Error(`未知的 VideoInfo 类型: ${info.Type}`);
    }
  };
  function isConvertibleToNumber(obj, includeInfinity = false) {
    if (isNullOrUndefined(obj)) {
      return false;
    }
    if (isString(obj)) {
      return obj.isConvertibleToNumber(includeInfinity);
    }
    if (isNumber(obj)) {
      return isNaN(obj) ? false : includeInfinity ? true : isFinite(obj);
    }
    return false;
  }
  Number.isConvertibleNumber = (value, includeInfinity = false) => {
    if (isNullOrUndefined(value)) {
      return false;
    }
    if (isString(value)) {
      return value.isConvertibleToNumber(includeInfinity);
    }
    if (isNumber(value)) {
      return isNaN(value) ? false : includeInfinity ? true : isFinite(value);
    }
    return false;
  };
  Number.isPositiveInteger = (value) => typeof value === "number" && Number.isInteger(value) && value > 0;
  Number.isNegativeInteger = (value) => typeof value === "number" && Number.isInteger(value) && value < 0;
  Number.isPositiveFloat = (value) => typeof value === "number" && !Number.isInteger(value) && value > 0;
  Number.isNegativeFloat = (value) => typeof value === "number" && !Number.isInteger(value) && value < 0;
  Number.toPositiveInteger = (value) => {
    if (!Number.isPositiveInteger(value)) {
      throw new Error("值必须为正整数");
    }
    return value;
  };
  Number.toNegativeInteger = (value) => {
    if (!Number.isNegativeInteger(value)) {
      throw new Error("值必须为负整数");
    }
    return value;
  };
  Number.toPositiveFloat = (value) => {
    if (!Number.isPositiveFloat(value)) {
      throw new Error("值必须为正浮点数");
    }
    return value;
  };
  Number.toNegativeFloat = (value) => {
    if (!Number.isNegativeFloat(value)) {
      throw new Error("值必须为负浮点数");
    }
    return value;
  };
  Array.prototype.any = function() {
    return this.filter((i3) => !isNullOrUndefined(i3)).length > 0;
  };
  Array.prototype.unique = function(prop) {
    if (isNullOrUndefined(prop)) {
      const seen = new Set();
      return this.filter((item) => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
      });
    } else {
      const seen = new Map();
      const nanSymbol = Symbol();
      return this.filter((item) => {
        const rawKey = item[prop];
        const key = isNumber(rawKey) && Number.isNaN(rawKey) ? nanSymbol : rawKey;
        if (seen.has(key)) return false;
        seen.set(key, true);
        return true;
      });
    }
  };
  Array.prototype.union = function(that, prop) {
    return [...this, ...that].unique(prop);
  };
  Array.prototype.intersect = function(that, prop) {
    return this.filter(
      (item) => that.some((t2) => isNullOrUndefined(prop) ? t2 === item : t2[prop] === item[prop])
    ).unique(prop);
  };
  Array.prototype.difference = function(that, prop) {
    return this.filter(
      (item) => !that.some((t2) => isNullOrUndefined(prop) ? t2 === item : t2[prop] === item[prop])
    ).unique(prop);
  };
  Array.prototype.complement = function(that, prop) {
    return this.union(that, prop).difference(this.intersect(that, prop), prop);
  };
  String.prototype.isEmpty = function() {
    return !isNullOrUndefined(this) && this.length === 0;
  };
  String.prototype.isConvertibleToNumber = function(includeInfinity = false) {
    const trimmed = this.trim();
    if (trimmed === "") return false;
    return Number.isConvertibleNumber(Number(trimmed), includeInfinity);
  };
  String.prototype.reversed = function() {
    const segmenter = new Intl.Segmenter(navigator.language, { granularity: "grapheme" });
    return [...segmenter.segment(this.toString())].reverse().join("");
  };
  String.prototype.among = function(start, end, greedy = false, reverse = false) {
    if (this.isEmpty() || start.isEmpty() || end.isEmpty()) return "";
    if (!reverse) {
      const startIndex = this.indexOf(start);
      if (startIndex === -1) return "";
      const adjustedStartIndex = startIndex + start.length;
      const endIndex = greedy ? this.lastIndexOf(end) : this.indexOf(end, adjustedStartIndex);
      if (endIndex === -1 || endIndex < adjustedStartIndex) return "";
      return this.slice(adjustedStartIndex, endIndex);
    } else {
      const endIndex = this.lastIndexOf(end);
      if (endIndex === -1) return "";
      const adjustedEndIndex = endIndex - end.length;
      const startIndex = greedy ? this.indexOf(start) : this.lastIndexOf(start, adjustedEndIndex);
      if (startIndex === -1 || startIndex + start.length > adjustedEndIndex) return "";
      return this.slice(startIndex + start.length, endIndex);
    }
  };
  String.prototype.splitLimit = function(separator, limit) {
    if (this.isEmpty() || isNullOrUndefined(separator)) {
      throw new Error("Empty");
    }
    let body = this.split(separator);
    return limit ? body.slice(0, limit).concat(body.slice(limit).join(separator)) : body;
  };
  String.prototype.truncate = function(maxLength) {
    return this.length > maxLength ? this.substring(0, maxLength) : this.toString();
  };
  String.prototype.trimHead = function(prefix) {
    return this.startsWith(prefix) ? this.slice(prefix.length) : this.toString();
  };
  String.prototype.trimTail = function(suffix) {
    return this.endsWith(suffix) ? this.slice(0, -suffix.length) : this.toString();
  };
  String.prototype.replaceEmojis = function(replace) {
    return this.replaceAll(emojiRegex, replace ?? "");
  };
  String.prototype.toURL = function() {
    try {
      return new URL(this.toString());
    } catch (error) {
      if (error instanceof TypeError && this.toString().startsWith("//")) {
        return new URL(unsafeWindow.location.protocol + this.toString());
      }
      throw error;
    }
  };
  Date.prototype.add = function({
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    ms = 0
  } = {}) {
    const newDate = new Date(this.getTime());
    if (years) newDate.setFullYear(newDate.getFullYear() + years);
    if (months) newDate.setMonth(newDate.getMonth() + months);
    if (days) newDate.setDate(newDate.getDate() + days);
    if (hours) newDate.setHours(newDate.getHours() + hours);
    if (minutes) newDate.setMinutes(newDate.getMinutes() + minutes);
    if (seconds) newDate.setSeconds(newDate.getSeconds() + seconds);
    if (ms) newDate.setMilliseconds(newDate.getMilliseconds() + ms);
    return newDate;
  };
  Date.prototype.sub = function({
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    ms = 0
  } = {}) {
    const newDate = new Date(this.getTime());
    if (years) newDate.setFullYear(newDate.getFullYear() - years);
    if (months) newDate.setMonth(newDate.getMonth() - months);
    if (days) newDate.setDate(newDate.getDate() - days);
    if (hours) newDate.setHours(newDate.getHours() - hours);
    if (minutes) newDate.setMinutes(newDate.getMinutes() - minutes);
    if (seconds) newDate.setSeconds(newDate.getSeconds() - seconds);
    if (ms) newDate.setMilliseconds(newDate.getMilliseconds() - ms);
    return newDate;
  };
  function throttle(fn, delay2, { leading = true, trailing = true } = {}) {
    let lastCall = 0;
    let timer = null;
    const throttled = function(...args) {
      const now = Date.now();
      if (!lastCall && !leading) {
        lastCall = now;
      }
      const remaining = delay2 - (now - lastCall);
      if (remaining <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        lastCall = now;
        fn.apply(this, args);
      } else if (trailing && !timer) {
        timer = setTimeout(() => {
          lastCall = leading ? Date.now() : 0;
          timer = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
    throttled.cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCall = 0;
    };
    return throttled;
  }
  function debounce(fn, delay2, { immediate = false } = {}) {
    let timer = null;
    const debounced = function(...args) {
      const callNow = immediate && !timer;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        if (!immediate) {
          fn.apply(this, args);
        }
      }, delay2);
      if (callNow) {
        fn.apply(this, args);
      }
    };
    debounced.cancel = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    return debounced;
  }
  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  function hasProperty(element, property) {
    return property in element;
  }
  function hasOwnProperty(element, prop) {
    return prop in element;
  }
  function hasFunction(obj, method) {
    return isObject(obj) && method in obj && typeof obj[method] === "function";
  }
  ;
  function UUID() {
    return isNullOrUndefined(crypto) ? Array.from({ length: 8 }, () => ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)).join("") : crypto.randomUUID().replaceAll("-", "");
  }
  function stringify(data) {
    switch (typeof data) {
      case "undefined":
        return "undefined";
      case "boolean":
        return data ? "true" : "false";
      case "number":
        return String(data);
      case "string":
        return data;
      case "symbol":
        return data.toString();
      case "function":
        return data.toString();
      case "object":
        if (isNull(data)) {
          return "null";
        }
        if (data instanceof Error) {
          return data.toString();
        }
        if (data instanceof Date) {
          return data.toISOString();
        }
        return JSON.stringify(data, null, 2);
      default:
        return "unknown";
    }
  }
  function prune(data) {
    if (isElement(data) || isNode(data)) {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map((item) => prune(item)).filter(isNotEmpty);
    }
    if (isObject(data)) {
      const result = Object.fromEntries(
        Object.entries(data).filter(([, v2]) => isNotEmpty(v2)).map(([k2, v2]) => [k2, prune(v2)]).filter(([, v2]) => isNotEmpty(v2))
      );
      return result;
    }
    return data;
  }
  String.prototype.replaceVariable = function(replacements, prefix = "%#", suffix = "#%") {
    function escapeRegex(str) {
      return str.replace(/[\.\*\+\?\^\$\{\}\(\)\|\[\]\\]/g, "\\$&");
    }
    let current = this.toString();
    prefix = escapeRegex(prefix);
    suffix = escapeRegex(suffix);
    const seen = new Set();
    const patterns = Object.keys(replacements).map((key) => {
      const escKey = escapeRegex(key);
      return {
        value: replacements[key],
        placeholderRegex: new RegExp(`${prefix}${escKey}(?=(?::.*?${suffix}|${suffix}))(?::.*?)?${suffix}`, "gs"),
        placeholderFormatRegex: new RegExp(`(?<=${prefix}${escKey}(?=(?::.*?${suffix}|${suffix})):).*?(?=${suffix})`, "gs")
      };
    });
    while (true) {
      if (seen.has(current)) {
        console.warn("检测到循环替换！", `终止于: ${current}`);
        break;
      }
      seen.add(current);
      let next = current;
      for (const { value, placeholderRegex, placeholderFormatRegex } of patterns) {
        if (placeholderRegex.test(next)) {
          let format = next.match(placeholderFormatRegex);
          if (!isNullOrUndefined(format) && format.any() && !format[0].isEmpty() && hasFunction(value, "format")) {
            next = next.replace(placeholderRegex, stringify(value.format(format[0])));
          } else {
            next = next.replace(placeholderRegex, stringify(value instanceof Date ? value.format("YYYY-MM-DD") : value));
          }
        }
      }
      if (current === next) break;
      current = next;
    }
    return current;
  };
  var zh_cn_default = {
    appName: "Iwara 批量下载工具",
    language: "语言: ",
    downloadPriority: "下载画质: ",
    downloadPath: "下载到: ",
    downloadProxy: "下载代理: ",
    downloadProxyUsername: "下载代理用户名: ",
    downloadProxyPassword: "下载代理密码: ",
    aria2Path: "Aria2 RPC: ",
    aria2Token: "Aria2 密钥: ",
    iwaradlPath: "iwaradl RPC: ",
    iwaradlToken: "iwaradl 密钥: ",
    experimentalFeatures: "实验性功能",
    enableUnsafeMode: "激进模式（风险自行承担）",
    rename: "重命名",
    save: "保存",
    reset: "重置",
    ok: "确定",
    on: "开启",
    off: "关闭",
    delete: "删除",
    deleteSucceed: "删除成功！",
    isDebug: "调试模式",
    downloadType: "下载方式",
    browserDownload: "浏览器下载",
    iwaradlDownload: "iwaradl下载",
    autoFollow: "自动关注选中的视频作者",
    autoLike: "自动点赞选中的视频",
    addUnlistedAndPrivate: "不公开和私有视频强制显示(需关注作者)",
    checkDownloadLink: "第三方网盘下载地址检查",
    checkPriority: "下载画质检查",
    autoDownloadMetadata: "自动下载视频元数据",
    filterLikedVideos: "过滤时间线上的已喜欢视频",
    videoMetadata: "视频元数据",
    autoInjectCheckbox: "自动注入选择框",
    notOfficialWarning: "警告，此网站不是Iwara官方网站，请勿填写任何敏感信息！\n继续浏览该网站？",
    autoCopySaveFileName: "自动复制根据规则生成的文件名",
    configurationIncompatible: "初始化或配置文件不兼容，请重新配置！",
    browserDownloadNotEnabled: "未启用下载功能！",
    browserDownloadNotWhitelisted: "请求的文件扩展名未列入白名单！",
    browserDownloadNotPermitted: "下载功能已启用，但未授予下载权限！",
    browserDownloadNotSupported: "目前浏览器/版本不支持下载功能！",
    browserDownloadNotSucceeded: "下载未开始或失败！",
    browserDownloadUnknownError: "未知错误，有可能是下载时提供的参数存在问题，请检查文件名是否合法！",
    browserDownloadTimeout: "下载超时，请检查网络环境是否正常！",
    variable: "→ 查看可用变量 ←",
    downloadTime: "下载时间 ",
    uploadTime: "发布时间 ",
    example: "示例: ",
    result: "结果: ",
    loadingCompleted: "加载完成",
    settings: "打开设置",
    downloadThis: "下载当前视频",
    manualDownload: "手动下载指定",
    aria2TaskCheck: "Aria2任务重启",
    reverseSelect: "本页反向选中",
    deselectThis: "取消本页选中",
    deselectAll: "取消所有选中",
    selectThis: "本页全部选中",
    parseUnlistedAndPrivate: "解析近期隐藏或私有的视频",
    downloadSelected: "下载所选",
    selected: "已选中",
    downloadingSelected: "正在下载所选，请稍后...",
    injectCheckbox: "开关选择框",
    configError: "脚本配置中存在错误，请修改。",
    alreadyKnowHowToUse: "我已知晓如何使用!!!（此页面仅显示一次）",
    notice: [
      "加载完成",
      {
        nodeType: "br"
      },
      "公告: ",
      {
        nodeType: "br"
      },
      "解决了批量选中或取消选择时多标签页不同步的问题。",
      {
        nodeType: "br"
      },
      "添加隐藏时间线上已喜欢的视频功能。"
    ],
    useHelpForBase: [
      "请认真阅读使用指南！",
      {
        nodeType: "br"
      },
      "点击网页侧边的灰色侧栏展开脚本菜单，根据需求点击菜单中的功能。"
    ],
    useHelpForInjectCheckbox: "打开任意存在视频卡片的页面，脚本会在视频卡片上注入复选框，点击复选框或鼠标悬浮在视频卡片上按空格将会勾选此视频。",
    useHelpForCheckDownloadLink: "开启“%#checkDownloadLink#%”功能会在下载视频前会检查视频简介以及评论，如果在其中发现疑似第三方网盘下载链接，将会弹出提示，您可以点击提示打开视频页面。",
    useHelpForManualDownload: [
      "使用手动下载功能需要提供视频ID，如需批量手动下载请提供使用“|”分割的视频ID。",
      {
        nodeType: "br"
      },
      "例如: AeGUIRO2D5vQ6F|qQsUMJa19LcK3L",
      {
        nodeType: "br"
      },
      "或提供符合以下格式对象的数组json字符串",
      {
        nodeType: "br"
      },
      "[ ID: string, { Title?: string, Alias?: string, Author?: string } ] ",
      {
        nodeType: "br"
      },
      "例如: ",
      {
        nodeType: "br"
      },
      '[["AeGUIRO2D5vQ6F", { Title: "237知更鸟", Alias: "骑着牛儿追织女", Author: "user1528210" }],["qQsUMJa19LcK3L", { Title: "Mika Automotive Extradimensional", Alias: "Temptation’s_Symphony", Author: "temptations_symphony" }]]'
    ],
    useHelpForBugreport: [
      "反馈遇到的BUG、使用问题等请前往: ",
      {
        nodeType: "a",
        childs: "Github",
        attributes: {
          href: "https://github.com/dawn-lc/IwaraDownloadTool/"
        }
      }
    ],
    tryRestartingDownload: "→ 点击此处重新下载 ←",
    tryReparseDownload: "→ 点击此处重新解析 ←",
    cdnCacheFinded: "→ 进入 MMD Fans 缓存页面 ←",
    openVideoLink: "→ 进入视频页面 ←",
    copySucceed: "复制成功！",
    pushTaskSucceed: "推送下载任务成功！",
    exportConfig: "导出配置",
    exportConfigSucceed: "配置已导出至剪切板！",
    connectionTest: "连接测试",
    settingsCheck: "配置检查",
    createTask: "创建任务",
    downloadPathError: "下载路径错误!",
    browserDownloadModeError: "请启用脚本管理器的浏览器API下载模式!",
    downloadQualityError: "未找到指定的画质下载地址!",
    findedDownloadLink: "发现疑似第三方网盘下载地址!",
    allCompleted: "全部解析完成！",
    parsing: "预解析中...",
    following: "已关注",
    parsingProgress: "解析进度: ",
    manualDownloadTips: '单独下载请直接在此处输入视频ID, 批量下载请提供使用“|”分割的视频ID, 例如: AeGUIRO2D5vQ6F|qQsUMJa19LcK3L\r\n或提供符合以下格式对象的数组json字符串\r\n{ key: string, value: { Title?: string, Alias?: string, Author?: string } }\r\n例如: \r\n[{ key: "AeGUIRO2D5vQ6F", value: { Title: "237知更鸟", Alias: "骑着牛儿追织女", Author: "user1528210" } },{ key: "qQsUMJa19LcK3L", value: { Title: "Mika Automotive Extradimensional", Alias: "Temptation’s_Symphony", Author: "temptations_symphony" } }]',
    externalVideo: "非本站视频",
    noAvailableVideoSource: "没有可供下载的视频源",
    videoSourceNotAvailable: "视频源地址不可用",
    getVideoSourceFailed: "获取视频源失败",
    downloadFailed: "下载失败！",
    downloadThisFailed: "未找到可供下载的视频！",
    pushTaskFailed: "推送下载任务失败！",
    parsingFailed: "视频信息解析失败！",
    autoFollowFailed: "自动关注视频作者失败！",
    autoLikeFailed: "自动点赞视频失败！"
  };
  var en_default = {
    appName: "Iwara Download Tool",
    language: "Language: ",
    downloadPriority: "Download Quality: ",
    downloadPath: "Download Path: ",
    downloadProxy: "Download Proxy: ",
    downloadProxyUsername: "Download Proxy Username: ",
    downloadProxyPassword: "Download Proxy Password: ",
    aria2Path: "Aria2 RPC: ",
    aria2Token: "Aria2 Token: ",
    iwaradlPath: "iwaradl RPC: ",
    iwaradlToken: "iwaradl Token: ",
    experimentalFeatures: "Experimental Features",
    enableUnsafeMode: "Unsafe Mode (Use at your own risk)",
    rename: "Rename",
    save: "Save",
    reset: "Reset",
    ok: "OK",
    on: "On",
    off: "Off",
    delete: "Delete",
    deleteSucceed: "Deletion successful!",
    isDebug: "Debug Mode",
    downloadType: "Download Type",
    browserDownload: "Browser Download",
    iwaradlDownload: "iwaradl Download",
    autoFollow: "Automatically follow the selected video author",
    autoLike: "Automatically like the selected videos",
    addUnlistedAndPrivate: "Force display unlisted and private videos (requires following the author)",
    parseUnlistedAndPrivate: "Parse recent unlisted and private videos",
    checkDownloadLink: "Check third-party cloud storage download links",
    notOfficialWarning: "Warning: This website is not the official Iwara website. Do not enter any sensitive information!\nContinue browsing this website?",
    checkPriority: "Check download quality",
    autoDownloadMetadata: "Auto-download metadata",
    filterLikedVideos: "Filter liked videos on timeline",
    videoMetadata: "Video Metadata",
    autoInjectCheckbox: "Automatically inject selection box",
    autoCopySaveFileName: "Automatically copy the filename generated by rules",
    configurationIncompatible: "Initialization or configuration file incompatible, please reconfigure!",
    browserDownloadNotEnabled: "Download feature not enabled!",
    browserDownloadNotWhitelisted: "Requested file extension not whitelisted!",
    browserDownloadNotPermitted: "Download feature enabled, but permission not granted!",
    browserDownloadNotSupported: "Current browser/version does not support download functionality!",
    browserDownloadNotSucceeded: "Download did not start or failed!",
    browserDownloadUnknownError: "Unknown error, possibly due to invalid download parameters. Please check if the filename is valid!",
    browserDownloadTimeout: "Download timed out. Please check your network connection!",
    variable: "View available variables",
    downloadTime: "Download Time ",
    uploadTime: "Upload Time ",
    example: "Example: ",
    result: "Result: ",
    loadingCompleted: "Loading completed",
    settings: "Open Settings",
    downloadThis: "Download current video",
    manualDownload: "Manually specify download",
    aria2TaskCheck: "Aria2 Task Restart",
    reverseSelect: "Reverse selection on this page",
    deselectThis: "Deselect on this page",
    deselectAll: "Deselect all",
    selectThis: "Select all on this page",
    selected: "Selected",
    downloadSelected: "Download selected",
    downloadingSelected: "Downloading selected, please wait...",
    injectCheckbox: "Toggle selection box",
    configError: "There is an error in the script configuration. Please modify.",
    alreadyKnowHowToUse: "I already know how to use it!!!",
    notice: [
      "Loading Complete",
      {
        nodeType: "br"
      },
      "Notice: ",
      {
        nodeType: "br"
      },
      "Fixed the issue of batch selection or deselection not synchronizing across multiple tabs.",
      {
        nodeType: "br"
      },
      "Added security checks. This script will refuse to load functional modules on risky websites."
    ],
    useHelpForBase: [
      "Please read the usage guide carefully!",
      {
        nodeType: "br"
      },
      "Click the gray sidebar on the webpage to expand the script menu, then click the functions in the menu according to your needs."
    ],
    useHelpForInjectCheckbox: "Open any page with video cards, and the script will inject checkboxes on the video cards. Click the checkbox or hover over the video card and press space to select this video.",
    useHelpForCheckDownloadLink: 'Enabling "%#checkDownloadLink#%" will check the video description and comments before downloading. If third-party cloud storage links are found, a prompt will appear allowing you to visit the video page.',
    useHelpForManualDownload: [
      'To use manual download, provide the video ID. For batch manual download, use "|" to separate video IDs.',
      {
        nodeType: "br"
      },
      "Example: AeGUIRO2D5vQ6F|qQsUMJa19LcK3L",
      {
        nodeType: "br"
      },
      "Or provide an array of objects in JSON format matching the following structure:",
      {
        nodeType: "br"
      },
      "[ ID: string, { Title?: string, Alias?: string, Author?: string } ]",
      {
        nodeType: "br"
      },
      "Example: ",
      {
        nodeType: "br"
      },
      `[["AeGUIRO2D5vQ6F", { Title: "237 Robin", Alias: "Riding Cow Chasing Weaving Maiden", Author: "user1528210" }],["qQsUMJa19LcK3L", { Title: "Mika Automotive Extradimensional", Alias: "Temptation's Symphony", Author: "temptations_symphony" }]]`
    ],
    useHelpForBugreport: [
      "To report bugs or usage issues, please visit: ",
      {
        nodeType: "a",
        childs: "Github",
        attributes: {
          href: "https://github.com/dawn-lc/IwaraDownloadTool/"
        }
      }
    ],
    tryRestartingDownload: "→ Click here to restart download ←",
    tryReparseDownload: "→ Click here to reparse ←",
    cdnCacheFinded: "→ Visit MMD Fans Cache Page ←",
    openVideoLink: "→ Visit Video Page ←",
    copySucceed: "Copy succeeded!",
    pushTaskSucceed: "Task pushed successfully!",
    exportConfig: "Export Configuration",
    exportConfigSucceed: "Configuration exported to clipboard!",
    connectionTest: "Connection Test",
    settingsCheck: "Settings Check",
    createTask: "Create Task",
    downloadPathError: "Download path error!",
    browserDownloadModeError: "Please enable the browser API download mode in the script manager!",
    downloadQualityError: "Specified quality download URL not found!",
    findedDownloadLink: "Possible third-party cloud storage link found!",
    allCompleted: "All parsing completed!",
    parsing: "Parsing...",
    following: "Following",
    parsingProgress: "Parsing Progress: ",
    manualDownloadTips: `For individual downloads, input the video ID here. For batch downloads, separate video IDs with "|". Example: AeGUIRO2D5vQ6F|qQsUMJa19LcK3L\r
Or provide an array of objects in JSON format matching the following structure:\r
{ key: string, value: { Title?: string, Alias?: string, Author?: string } }\r
Example: \r
[{ key: "AeGUIRO2D5vQ6F", value: { Title: "237 Robin", Alias: "Riding Cow Chasing Weaving Maiden", Author: "user1528210" } },{ key: "qQsUMJa19LcK3L", value: { Title: "Mika Automotive Extradimensional", Alias: "Temptation's Symphony", Author: "temptations_symphony" } }]`,
    externalVideo: "External Video",
    noAvailableVideoSource: "No available video sources",
    videoSourceNotAvailable: "Video source URL unavailable",
    getVideoSourceFailed: "Failed to get video source",
    downloadFailed: "Download failed!",
    downloadThisFailed: "No downloadable video found!",
    pushTaskFailed: "Failed to push download task!",
    parsingFailed: "Failed to parse video information!",
    autoFollowFailed: "Failed to auto-follow the video author!",
    autoLikeFailed: "Failed to auto-like the video!"
  };
  var ja_default = {
    appName: "Iwara バッチダウンロードツール",
    language: "言語: ",
    downloadPriority: "ダウンロード画質: ",
    downloadPath: "ダウンロード先: ",
    downloadProxy: "ダウンロードプロキシ: ",
    downloadProxyUsername: "ダウンロードプロキシユーザー名: ",
    downloadProxyPassword: "ダウンロードプロキシパスワード: ",
    aria2Path: "Aria2 RPC: ",
    aria2Token: "Aria2 トークン: ",
    iwaradlPath: "iwaradl RPC: ",
    iwaradlToken: "iwaradl トークン: ",
    experimentalFeatures: "実験的機能",
    enableUnsafeMode: "アンセーフモード（自己責任で使用）",
    rename: "名前変更",
    save: "保存",
    reset: "リセット",
    ok: "OK",
    on: "オン",
    off: "オフ",
    delete: "削除",
    deleteSucceed: "削除成功！",
    isDebug: "デバッグモード",
    downloadType: "ダウンロード方式",
    browserDownload: "ブラウザダウンロード",
    iwaradlDownload: "iwaradlダウンロード",
    autoFollow: "選択した動画の作者を自動フォロー",
    autoLike: "選択した動画を自動いいね",
    addUnlistedAndPrivate: "非公開・限定公開動画を強制表示（作者のフォローが必要）",
    parseUnlistedAndPrivate: "最近の非公開・限定公開動画を解析",
    checkDownloadLink: "サードパーティクラウドストレージのダウンロードリンクをチェック",
    notOfficialWarning: "警告：このサイトはIwara公式サイトではありません。個人情報を入力しないでください！\nこのサイトを閲覧しますか？",
    checkPriority: "ダウンロード画質チェック",
    autoDownloadMetadata: "動画メタデータを自動ダウンロード",
    filterLikedVideos: "タイムライン上のいいね済み動画をフィルタリング",
    videoMetadata: "動画メタデータ",
    autoInjectCheckbox: "選択ボックスを自動注入",
    autoCopySaveFileName: "ルールに基づいて生成されたファイル名を自動コピー",
    configurationIncompatible: "初期化または設定ファイルが互換性がありません。再設定してください！",
    browserDownloadNotEnabled: "ダウンロード機能が有効になっていません！",
    browserDownloadNotWhitelisted: "要求されたファイル拡張子がホワイトリストに登録されていません！",
    browserDownloadNotPermitted: "ダウンロード機能は有効ですが、権限が付与されていません！",
    browserDownloadNotSupported: "現在のブラウザ/バージョンはダウンロード機能をサポートしていません！",
    browserDownloadNotSucceeded: "ダウンロードが開始されなかったか失敗しました！",
    browserDownloadUnknownError: "不明なエラー。ダウンロード時に提供されたパラメータに問題がある可能性があります。ファイル名が有効か確認してください！",
    browserDownloadTimeout: "ダウンロードがタイムアウトしました。ネットワーク環境を確認してください！",
    variable: "→ 利用可能な変数を表示 ←",
    downloadTime: "ダウンロード時間 ",
    uploadTime: "公開時間 ",
    example: "例: ",
    result: "結果: ",
    loadingCompleted: "読み込み完了",
    settings: "設定を開く",
    downloadThis: "現在の動画をダウンロード",
    manualDownload: "手動で指定ダウンロード",
    aria2TaskCheck: "Aria2タスク再起動",
    reverseSelect: "このページで選択を反転",
    deselectThis: "このページの選択を解除",
    deselectAll: "すべての選択を解除",
    selectThis: "このページをすべて選択",
    selected: "選択済み",
    downloadSelected: "選択したものをダウンロード",
    downloadingSelected: "選択したものをダウンロード中、しばらくお待ちください...",
    injectCheckbox: "選択ボックスを切り替え",
    configError: "スクリプト設定にエラーがあります。修正してください。",
    alreadyKnowHowToUse: "使用方法を理解しました!!!（このページは一度だけ表示されます）",
    notice: [
      "読み込み完了",
      {
        nodeType: "br"
      },
      "お知らせ: ",
      {
        nodeType: "br"
      },
      "バッチ選択または選択解除時の複数タブ間の同期問題を解決しました。",
      {
        nodeType: "br"
      },
      "セキュリティチェックを追加。このスクリプトはリスクのあるサイトでは機能モジュールの読み込みを拒否します。"
    ],
    useHelpForBase: [
      "使用ガイドをよくお読みください！",
      {
        nodeType: "br"
      },
      "ウェブページのサイドにある灰色のサイドバーをクリックしてスクリプトメニューを展開し、必要に応じてメニューの機能をクリックしてください。"
    ],
    useHelpForInjectCheckbox: "動画カードがある任意のページを開くと、スクリプトは動画カードにチェックボックスを注入します。チェックボックスをクリックするか、動画カードにマウスをホバーしてスペースキーを押すと、この動画が選択されます。",
    useHelpForCheckDownloadLink: '"%#checkDownloadLink#%"機能を有効にすると、動画をダウンロードする前に動画の説明とコメントをチェックします。サードパーティクラウドストレージのダウンロードリンクが見つかった場合、プロンプトが表示され、動画ページを開くことができます。',
    useHelpForManualDownload: [
      "手動ダウンロード機能を使用するには、動画IDを提供する必要があります。バッチ手動ダウンロードの場合は、「|」で区切った動画IDを提供してください。",
      {
        nodeType: "br"
      },
      "例: AeGUIRO2D5vQ6F|qQsUMJa19LcK3L",
      {
        nodeType: "br"
      },
      "または、以下の形式のオブジェクトの配列をJSON文字列で提供してください",
      {
        nodeType: "br"
      },
      "[ ID: string, { Title?: string, Alias?: string, Author?: string } ] ",
      {
        nodeType: "br"
      },
      "例: ",
      {
        nodeType: "br"
      },
      `[["AeGUIRO2D5vQ6F", { Title: "237知更鳥", Alias: "骑着牛儿追织女", Author: "user1528210" }],["qQsUMJa19LcK3L", { Title: "Mika Automotive Extradimensional", Alias: "Temptation's Symphony", Author: "temptations_symphony" }]]`
    ],
    useHelpForBugreport: [
      "バグや使用上の問題を報告する場合は、以下にアクセスしてください: ",
      {
        nodeType: "a",
        childs: "Github",
        attributes: {
          href: "https://github.com/dawn-lc/IwaraDownloadTool/"
        }
      }
    ],
    tryRestartingDownload: "→ ここをクリックしてダウンロードを再開 ←",
    tryReparseDownload: "→ ここをクリックして再解析 ←",
    cdnCacheFinded: "→ MMD Fans キャッシュページへ ←",
    openVideoLink: "→ 動画ページへ ←",
    copySucceed: "コピー成功！",
    pushTaskSucceed: "ダウンロードタスクのプッシュ成功！",
    exportConfig: "設定をエクスポート",
    exportConfigSucceed: "設定がクリップボードにエクスポートされました！",
    connectionTest: "接続テスト",
    settingsCheck: "設定チェック",
    createTask: "タスク作成",
    downloadPathError: "ダウンロードパスエラー！",
    browserDownloadModeError: "スクリプトマネージャーのブラウザAPIダウンロードモードを有効にしてください！",
    downloadQualityError: "指定された画質のダウンロードURLが見つかりません！",
    findedDownloadLink: "サードパーティクラウドストレージのダウンロードリンクを発見！",
    allCompleted: "すべての解析完了！",
    parsing: "解析中...",
    following: "フォロー中",
    parsingProgress: "解析進捗: ",
    manualDownloadTips: `個別ダウンロードはここに動画IDを直接入力してください。バッチダウンロードは「|」で区切った動画IDを提供してください。例: AeGUIRO2D5vQ6F|qQsUMJa19LcK3L\r
または、以下の形式のオブジェクトの配列をJSON文字列で提供してください\r
{ key: string, value: { Title?: string, Alias?: string, Author?: string } }\r
例: \r
[{ key: "AeGUIRO2D5vQ6F", value: { Title: "237知更鳥", Alias: "骑着牛儿追织女", Author: "user1528210" } },{ key: "qQsUMJa19LcK3L", value: { Title: "Mika Automotive Extradimensional", Alias: "Temptation's Symphony", Author: "temptations_symphony" } }]`,
    externalVideo: "外部動画",
    noAvailableVideoSource: "利用可能な動画ソースがありません",
    videoSourceNotAvailable: "動画ソースURLが利用できません",
    getVideoSourceFailed: "動画ソースの取得に失敗しました",
    downloadFailed: "ダウンロード失敗！",
    downloadThisFailed: "ダウンロード可能な動画が見つかりません！",
    pushTaskFailed: "ダウンロードタスクのプッシュに失敗！",
    parsingFailed: "動画情報の解析に失敗！",
    autoFollowFailed: "動画作者の自動フォローに失敗！",
    autoLikeFailed: "動画の自動いいねに失敗！"
  };
  var i18nList = {
    zh: zh_cn_default,
    en: en_default,
    ja: ja_default
  };
  var originalFetch = unsafeWindow.fetch;
  var originalHistoryPushState = unsafeWindow.history.pushState;
  var originalHistoryReplaceState = unsafeWindow.history.replaceState;
  var originalNodeAppendChild = unsafeWindow.Node.prototype.appendChild;
  var originalNodeRemoveChild = unsafeWindow.Node.prototype.removeChild;
  var originalElementRemove = unsafeWindow.Element.prototype.remove;
  var originalAddEventListener = unsafeWindow.EventTarget.prototype.addEventListener;
  var originalRemoveEventListener = unsafeWindow.EventTarget.prototype.removeEventListener;
  var originalStorageSetItem = unsafeWindow.Storage.prototype.setItem;
  var originalStorageRemoveItem = unsafeWindow.Storage.prototype.removeItem;
  var originalStorageClear = unsafeWindow.Storage.prototype.clear;
  var originalConsole = {
    log: unsafeWindow.console.log.bind(unsafeWindow.console),
    info: unsafeWindow.console.info.bind(unsafeWindow.console),
    warn: unsafeWindow.console.warn.bind(unsafeWindow.console),
    error: unsafeWindow.console.error.bind(unsafeWindow.console),
    debug: unsafeWindow.console.debug.bind(unsafeWindow.console),
    trace: unsafeWindow.console.trace.bind(unsafeWindow.console),
    dir: unsafeWindow.console.dir.bind(unsafeWindow.console),
    table: unsafeWindow.console.table?.bind(unsafeWindow.console)
  };
  var DownloadType = ((DownloadType2) => {
    DownloadType2[DownloadType2["Aria2"] = 0] = "Aria2";
    DownloadType2[DownloadType2["Iwaradl"] = 1] = "Iwaradl";
    DownloadType2[DownloadType2["Browser"] = 2] = "Browser";
    DownloadType2[DownloadType2["Others"] = 3] = "Others";
    return DownloadType2;
  })(DownloadType || {});
  var PageType = ((PageType2) => {
    PageType2["Video"] = "video";
    PageType2["Image"] = "image";
    PageType2["VideoList"] = "videoList";
    PageType2["ImageList"] = "imageList";
    PageType2["Forum"] = "forum";
    PageType2["ForumSection"] = "forumSection";
    PageType2["ForumThread"] = "forumThread";
    PageType2["Page"] = "page";
    PageType2["Home"] = "home";
    PageType2["Profile"] = "profile";
    PageType2["Subscriptions"] = "subscriptions";
    PageType2["Playlist"] = "playlist";
    PageType2["Favorites"] = "favorites";
    PageType2["Search"] = "search";
    PageType2["Account"] = "account";
    return PageType2;
  })(PageType || {});
  var ToastType = ((ToastType2) => {
    ToastType2[ToastType2["Log"] = 0] = "Log";
    ToastType2[ToastType2["Info"] = 1] = "Info";
    ToastType2[ToastType2["Warn"] = 2] = "Warn";
    ToastType2[ToastType2["Error"] = 3] = "Error";
    return ToastType2;
  })(ToastType || {});
  var MessageType = ((MessageType2) => {
    MessageType2[MessageType2["Close"] = 0] = "Close";
    MessageType2[MessageType2["Request"] = 1] = "Request";
    MessageType2[MessageType2["Receive"] = 2] = "Receive";
    MessageType2[MessageType2["Set"] = 3] = "Set";
    MessageType2[MessageType2["Del"] = 4] = "Del";
    return MessageType2;
  })(MessageType || {});
  var VersionState = ((VersionState2) => {
    VersionState2[VersionState2["Low"] = 0] = "Low";
    VersionState2[VersionState2["Equal"] = 1] = "Equal";
    VersionState2[VersionState2["High"] = 2] = "High";
    return VersionState2;
  })(VersionState || {});
  var DEFAULT_CONFIG = {
    language: "zh_cn",
    autoFollow: false,
    autoLike: false,
    autoCopySaveFileName: false,
    autoDownloadMetadata: false,
    enableUnsafeMode: false,
    experimentalFeatures: false,
    autoInjectCheckbox: true,
    checkDownloadLink: false,
    filterLikedVideos: false,
    checkPriority: true,
    addUnlistedAndPrivate: false,
    downloadPriority: "Source",
    downloadType: 3,
    downloadPath: "/Iwara/%#AUTHOR#%/%#TITLE#%[%#ID#%].mp4",
    downloadProxy: "",
    downloadProxyUsername: "",
    downloadProxyPassword: "",
    aria2Path: "http://127.0.0.1:6800/jsonrpc",
    aria2Token: "",
    iwaraDownloaderPath: "http://127.0.0.1:6800/jsonrpc",
    iwaraDownloaderToken: "",
    priority: {
      "Source": 100,
      "540": 99,
      "360": 98,
      "preview": 1
    }
  };
  var Config = class _Config {
    static instance;
    configChange;
    language;
    autoFollow;
    autoLike;
    autoDownloadMetadata;
    addUnlistedAndPrivate;
    enableUnsafeMode;
    experimentalFeatures;
    autoInjectCheckbox;
    autoCopySaveFileName;
    filterLikedVideos;
    checkDownloadLink;
    checkPriority;
    downloadPriority;
    downloadType;
    downloadPath;
    downloadProxy;
    downloadProxyUsername;
    downloadProxyPassword;
    aria2Path;
    aria2Token;
    iwaraDownloaderPath;
    iwaraDownloaderToken;
    authorization;
    priority;
    constructor() {
      this.language = DEFAULT_CONFIG.language;
      this.autoFollow = DEFAULT_CONFIG.autoFollow;
      this.autoLike = DEFAULT_CONFIG.autoLike;
      this.autoCopySaveFileName = DEFAULT_CONFIG.autoCopySaveFileName;
      this.experimentalFeatures = DEFAULT_CONFIG.experimentalFeatures;
      this.enableUnsafeMode = DEFAULT_CONFIG.enableUnsafeMode;
      this.autoInjectCheckbox = DEFAULT_CONFIG.autoInjectCheckbox;
      this.filterLikedVideos = DEFAULT_CONFIG.filterLikedVideos;
      this.checkDownloadLink = DEFAULT_CONFIG.checkDownloadLink;
      this.checkPriority = DEFAULT_CONFIG.checkPriority;
      this.addUnlistedAndPrivate = DEFAULT_CONFIG.addUnlistedAndPrivate;
      this.downloadPriority = DEFAULT_CONFIG.downloadPriority;
      this.downloadType = DEFAULT_CONFIG.downloadType;
      this.downloadPath = DEFAULT_CONFIG.downloadPath;
      this.downloadProxy = DEFAULT_CONFIG.downloadProxy;
      this.downloadProxyUsername = DEFAULT_CONFIG.downloadProxyUsername;
      this.downloadProxyPassword = DEFAULT_CONFIG.downloadProxyPassword;
      this.aria2Path = DEFAULT_CONFIG.aria2Path;
      this.aria2Token = DEFAULT_CONFIG.aria2Token;
      this.iwaraDownloaderPath = DEFAULT_CONFIG.iwaraDownloaderPath;
      this.iwaraDownloaderToken = DEFAULT_CONFIG.iwaraDownloaderToken;
      this.priority = DEFAULT_CONFIG.priority;
      this.autoDownloadMetadata = DEFAULT_CONFIG.autoDownloadMetadata;
      let body = new Proxy(this, {
        get: function(target, property) {
          if (property === "configChange") {
            return target.configChange;
          }
          let value = GM_getValue(property, target[property]);
          if (property === "language") {
            return _Config.getLanguage(value);
          }
          GM_getValue("isDebug") && originalConsole.debug(`[Debug] get: ${property} ${/password/i.test(property) || /token/i.test(property) || /authorization/i.test(property) ? "凭证已隐藏" : stringify(value)}`);
          return value;
        },
        set: function(target, property, value) {
          if (property === "configChange") {
            target.configChange = value;
            return true;
          }
          GM_setValue(property, value);
          GM_getValue("isDebug") && originalConsole.debug(`[Debug] set: ${property} ${/password/i.test(property) || /token/i.test(property) || /authorization/i.test(property) ? "凭证已隐藏" : stringify(value)}`);
          if (!isNullOrUndefined(target.configChange)) target.configChange(property);
          return true;
        }
      });
      for (const item in body) {
        GM_addValueChangeListener(
          item,
          (name, old_value, new_value, remote) => {
            if (remote && !isNullOrUndefined(body.configChange)) body.configChange(name);
          }
        );
      }
      return body;
    }
    static getLanguage(value) {
      function formatLanguage(value2) {
        return value2.replace("-", "_").toLowerCase();
      }
      function getMainLanguage(value2) {
        return value2.split("_").shift();
      }
      let custom = formatLanguage(value ?? DEFAULT_CONFIG.language);
      if (!isNullOrUndefined(custom)) {
        if (!isNullOrUndefined(i18nList[custom])) {
          return custom;
        } else {
          let customMain = getMainLanguage(custom);
          if (!isNullOrUndefined(i18nList[customMain])) {
            return customMain;
          }
        }
      }
      let env = formatLanguage(navigator.language ?? navigator.languages[0] ?? DEFAULT_CONFIG.language);
      if (!isNullOrUndefined(i18nList[env])) {
        return env;
      } else {
        let main2 = getMainLanguage(env);
        if (!isNullOrUndefined(i18nList[main2])) {
          return main2;
        }
      }
      return DEFAULT_CONFIG.language;
    }
    static getInstance() {
      if (isNullOrUndefined(_Config.instance)) _Config.instance = new _Config();
      return _Config.instance;
    }
    static destroyInstance() {
      _Config.instance = void 0;
    }
  };
  var config = Config.getInstance();
  var Path = class {
    fullPath;
    directory;
    fullName;
    type;
    extension;
    baseName;
    constructor(inputPath) {
      if (inputPath === "") {
        throw new Error("路径不能为空");
      }
      if (this.isUNC(inputPath)) {
        throw new Error("不接受UNC路径");
      }
      const detectedType = this.detectPathType(inputPath);
      this.validatePath(inputPath, detectedType);
      const normalized = this.normalizePath(inputPath, detectedType);
      const directory = this.extractDirectory(normalized, detectedType);
      const fileName = this.extractFileName(normalized, detectedType);
      const { baseName, extension } = this.extractBaseAndExtension(fileName);
      this.type = detectedType;
      this.fullPath = normalized;
      this.directory = directory;
      this.fullName = fileName;
      this.baseName = baseName;
      this.extension = extension;
    }
    isUNC(path) {
      return path.startsWith("\\\\");
    }
    detectPathType(path) {
      if (/^[A-Za-z]:[\\/]/.test(path)) {
        return "Windows";
      }
      if (path.startsWith("/")) {
        return "Unix";
      }
      return "Relative";
    }
    validatePath(path, type) {
      const invalidChars = /[<>:"|?*]/;
      if (type === "Windows") {
        if (!/^[A-Za-z]:[\\/]/.test(path)) {
          throw new Error("无效的Windows路径格式");
        }
        const segments = path.split(/[\\/]/);
        for (let i3 = 1; i3 < segments.length; i3++) {
          let segment = segments[i3];
          let variables = [...segment.matchAll(/%#(.*?)#%/g)].map((match) => {
            let variable = match[1].split(":");
            if (variable.length > 1) {
              if (invalidChars.test(variable[1])) {
                throw new Error(`路径变量格式化参数 "${variable[1]}" 含有非法字符`);
              }
            }
            return match[1];
          });
          for (let index = 0; index < variables.length; index++) {
            const variable = variables[index];
            segment = segment.replaceAll(variable, "");
          }
          if (invalidChars.test(segment)) {
            throw new Error(`路径段 "${segments[i3]}" 含有非法字符`);
          }
        }
      } else if (type === "Unix") {
        if (path.indexOf("\0") !== -1) {
          throw new Error("路径中包含非法空字符");
        }
      } else if (type === "Relative") {
        if (path.indexOf("\0") !== -1) {
          throw new Error("路径中包含非法空字符");
        }
        if (invalidChars.test(path)) {
          throw new Error("路径含有非法字符");
        }
      }
    }
    normalizePath(path, type) {
      const sep = type === "Windows" ? "\\" : "/";
      if (type === "Windows") {
        path = path.replace(/\//g, "\\");
        path = path.replace(/\\+/g, "\\");
      } else {
        path = path.replace(/\\/g, "/");
        path = path.replace(/\/+/g, "/");
      }
      let segments;
      if (type === "Windows") {
        segments = path.split("\\");
      } else {
        segments = path.split("/");
      }
      let isAbsolute = false;
      let prefix = "";
      if (type === "Windows") {
        if (/^[A-Za-z]:$/.test(segments[0])) {
          isAbsolute = true;
          prefix = segments[0];
          segments = segments.slice(1);
        }
      } else if (type === "Unix") {
        if (path.startsWith("/")) {
          isAbsolute = true;
          if (segments[0] === "") {
            segments = segments.slice(1);
          }
        }
      } else {
        isAbsolute = false;
      }
      const resolvedSegments = this.resolveSegments(segments, isAbsolute);
      let normalized = "";
      if (type === "Windows") {
        normalized = prefix ? prefix + sep + resolvedSegments.join(sep) : resolvedSegments.join(sep);
        if (prefix && normalized === prefix) {
          normalized += sep;
        }
      } else if (type === "Unix") {
        normalized = (isAbsolute ? sep : "") + resolvedSegments.join(sep);
        if (isAbsolute && normalized === "") {
          normalized = sep;
        }
      } else {
        normalized = resolvedSegments.join(sep);
      }
      return normalized;
    }
    resolveSegments(segments, isAbsolute) {
      const stack = [];
      for (const segment of segments) {
        if (segment === "" || segment === ".") continue;
        if (segment === "..") {
          if (stack.length > 0 && stack[stack.length - 1] !== "..") {
            stack.pop();
          } else {
            if (isAbsolute) {
              throw new Error("绝对路径不能越界");
            } else {
              stack.push("..");
            }
          }
        } else {
          stack.push(segment);
        }
      }
      return stack;
    }
    extractDirectory(path, type) {
      const sep = type === "Windows" ? "\\" : "/";
      if (type === "Windows" && /^[A-Za-z]:\\$/.test(path)) {
        return path;
      }
      if (type === "Unix" && path === "/") {
        return path;
      }
      const lastIndex = path.lastIndexOf(sep);
      return lastIndex === -1 ? "" : path.substring(0, lastIndex);
    }
    extractFileName(path, type) {
      const sep = type === "Windows" ? "\\" : "/";
      const lastIndex = path.lastIndexOf(sep);
      return lastIndex === -1 ? path : path.substring(lastIndex + 1);
    }
    extractBaseAndExtension(fileName) {
      const lastDot = fileName.lastIndexOf(".");
      if (lastDot <= 0) {
        return { baseName: fileName, extension: "" };
      }
      const baseName = fileName.substring(0, lastDot);
      const extension = fileName.substring(lastDot + 1);
      return { baseName, extension };
    }
  };
  var Version = class _Version {
    major;
    minor;
    patch;
    preRelease;
    buildMetadata;
    constructor(versionString) {
      if (!versionString || typeof versionString !== "string") {
        throw new Error("Invalid version string");
      }
      const [version, preRelease, buildMetadata] = versionString.split(/[-+]/);
      const versionParts = version.split(".").map(Number);
      if (versionParts.some(isNaN)) {
        throw new Error("Version string contains invalid numbers");
      }
      this.major = versionParts[0] || 0;
      this.minor = versionParts.length > 1 ? versionParts[1] : 0;
      this.patch = versionParts.length > 2 ? versionParts[2] : 0;
      this.preRelease = preRelease ? preRelease.split(".") : [];
      this.buildMetadata = buildMetadata || "";
    }
    static compareValues(a3, b2) {
      if (a3 < b2) return 0;
      if (a3 > b2) return 2;
      return 1;
    }
    compare(other) {
      let state = _Version.compareValues(this.major, other.major);
      if (state !== 1) return state;
      state = _Version.compareValues(this.minor, other.minor);
      if (state !== 1) return state;
      state = _Version.compareValues(this.patch, other.patch);
      if (state !== 1) return state;
      for (let i3 = 0; i3 < Math.max(this.preRelease.length, other.preRelease.length); i3++) {
        const pre1 = this.preRelease[i3] ?? "";
        const pre2 = other.preRelease[i3] ?? "";
        state = _Version.compareValues(
          isNaN(+pre1) ? pre1 : +pre1,
          isNaN(+pre2) ? pre2 : +pre2
        );
        if (state !== 1) return state;
      }
      return 1;
    }
    toString() {
      const version = `${this.major}.${this.minor}.${this.patch}`;
      const preRelease = this.preRelease.length ? `-${this.preRelease.join(".")}` : "";
      const buildMetadata = this.buildMetadata ? `+${this.buildMetadata}` : "";
      return `${version}${preRelease}${buildMetadata}`;
    }
  };
  var Dictionary = class extends Map {
    constructor(data = []) {
      super(data);
    }
    toArray() {
      return Array.from(this);
    }
    keysArray() {
      return Array.from(this.keys());
    }
    valuesArray() {
      return Array.from(this.values());
    }
  };
  var GMSyncDictionary = class _GMSyncDictionary extends Dictionary {
    onSet;
    onDel;
    onSync;
    name;
    listenerId = null;
    static BATCH_THRESHOLD = 10;
    constructor(name, initial = []) {
      let stored = initial.any() ? initial : GM_getValue(name, initial);
      try {
        super(stored.filter(([_, info]) => isVideoInfo(info)));
      } catch (error) {
        super();
      }
      this.name = name;
      this.saveToStorage();
      this.setupValueChangeListener();
    }
    setupValueChangeListener() {
      if (this.listenerId !== null) {
        GM_removeValueChangeListener(this.listenerId);
      }
      this.listenerId = GM_addValueChangeListener(
        this.name,
        (key, oldValue, newValue, remote) => {
          if (key === this.name && remote) {
            this.handleRemoteChange(newValue);
          }
        }
      );
    }
    handleRemoteChange(newValue) {
      if (isNullOrUndefined(newValue)) {
        super.clear();
        this.onSync?.();
        return;
      }
      const currentKeys = new Set(this.keys());
      const addedOrUpdated = [];
      const deleted = [];
      for (const [key, value] of newValue) {
        if (!currentKeys.has(key)) {
          addedOrUpdated.push([key, value]);
        } else {
          const currentValue = this.get(key);
          if (currentValue !== value) {
            addedOrUpdated.push([key, value]);
          }
          currentKeys.delete(key);
        }
      }
      for (const key of currentKeys) {
        deleted.push(key);
      }
      const totalChanges = addedOrUpdated.length + deleted.length;
      if (totalChanges > _GMSyncDictionary.BATCH_THRESHOLD) {
        super.clear();
        for (const [key, value] of newValue) {
          super.set(key, value);
        }
        this.onSync?.();
      } else {
        for (const [key, value] of addedOrUpdated) {
          super.set(key, value);
          this.onSet?.(key, value);
        }
        for (const key of deleted) {
          super.delete(key);
          this.onDel?.(key);
        }
      }
    }
    saveToStorage() {
      GM_setValue(this.name, this.toArray());
    }
    set(key, value) {
      super.set(key, value);
      this.saveToStorage();
      this.onSet?.(key, value);
      return this;
    }
    delete(key) {
      const result = super.delete(key);
      if (result) {
        this.saveToStorage();
        this.onDel?.(key);
      }
      return result;
    }
    clear() {
      super.clear();
      this.saveToStorage();
      this.onSync?.();
    }
    get(key) {
      return super.get(key);
    }
    has(key) {
      return super.has(key);
    }
    get size() {
      return super.size;
    }
    destroy() {
      if (this.listenerId !== null) {
        GM_removeValueChangeListener(this.listenerId);
        this.listenerId = null;
      }
    }
  };
  var SyncDictionary = class extends Dictionary {
    onSet;
    onDel;
    onSync;
    timestamp;
    lifetime;
    id;
    channel;
    constructor(channelName, initial = []) {
      const hasInitial = prune(initial).any();
      super(hasInitial ? initial : void 0);
      this.timestamp = hasInitial ? Date.now() : 0;
      this.lifetime = hasInitial ? performance.now() : 0;
      this.id = UUID();
      this.channel = new BroadcastChannel(channelName);
      this.channel.onmessage = ({ data: msg }) => this.handleMessage(msg);
      this.channel.postMessage({ type: "sync", id: this.id, timestamp: this.timestamp, lifetime: this.lifetime });
    }
    setTimestamp(timestamp) {
      this.timestamp = timestamp ?? Date.now();
      this.lifetime = performance.now();
    }
    set(key, value) {
      this.setTimestamp();
      super.set(key, value);
      this.channel.postMessage({ type: "set", key, value, timestamp: this.timestamp, lifetime: this.lifetime, id: this.id });
      this.onSet?.(key, value);
      return this;
    }
    delete(key) {
      this.setTimestamp();
      const existed = super.delete(key);
      if (existed) {
        this.onDel?.(key);
        this.channel.postMessage({ type: "delete", key, timestamp: this.timestamp, lifetime: this.lifetime, id: this.id });
      }
      return existed;
    }
    clear() {
      this.setTimestamp();
      super.clear();
      this.channel.postMessage({ timestamp: this.timestamp, lifetime: this.lifetime, id: this.id, type: "state", state: super.toArray() });
      this.onSync?.();
    }
    handleMessage(msg) {
      if (msg.id === this.id) return;
      if (msg.type === "sync") {
        this.channel.postMessage({ timestamp: this.timestamp, lifetime: this.lifetime, id: this.id, type: "state", state: super.toArray() });
        return;
      }
      if (msg.timestamp === this.timestamp && msg.lifetime === this.lifetime) return;
      if (msg.timestamp < this.timestamp || msg.lifetime < this.lifetime) return;
      switch (msg.type) {
        case "state": {
          super.clear();
          for (let index = 0; index < msg.state.length; index++) {
            const [key, value] = msg.state[index];
            super.set(key, value);
          }
          this.setTimestamp(msg.timestamp);
          this.onSync?.();
          break;
        }
        case "set": {
          const { key, value } = msg;
          super.set(key, value);
          this.setTimestamp(msg.timestamp);
          this.onSet?.(key, value);
          break;
        }
        case "delete": {
          const { key } = msg;
          if (super.delete(key)) {
            this.setTimestamp(msg.timestamp);
            this.onDel?.(key);
          }
          break;
        }
      }
    }
  };
  var MultiPage = class {
    pageId;
    onLastPage;
    onPageJoin;
    onPageLeave;
    channel;
    beforeUnloadHandler;
    constructor() {
      this.pageId = UUID();
      GM_saveTab({ id: this.pageId });
      this.channel = new BroadcastChannel("page-status-channel");
      this.channel.onmessage = (event) => this.handleMessage(event.data);
      this.channel.postMessage({ type: "join", id: this.pageId });
      this.beforeUnloadHandler = () => {
        this.channel.postMessage({ type: "leave", id: this.pageId });
        originalRemoveEventListener.call(unsafeWindow.document, "beforeunload", this.beforeUnloadHandler);
      };
      originalAddEventListener.call(unsafeWindow.document, "beforeunload", this.beforeUnloadHandler);
    }
    suicide() {
      this.channel.postMessage({ type: "suicide", id: this.pageId });
    }
    handleMessage(message) {
      switch (message.type) {
        case "suicide":
          if (this.pageId !== message.id) unsafeWindow.close();
          break;
        case "join":
          this.onPageJoin?.(message.id);
          break;
        case "leave":
          this.onPageLeave?.(message.id);
          GM_getTabs((tabs) => {
            if (Object.keys(tabs).length > 1) return;
            this.onLastPage?.();
          });
          break;
      }
    }
  };
  var D = (e, n5) => n5.some((t2) => e instanceof t2);
  var w, b;
  function C() {
    return w || (w = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
  }
  function x() {
    return b || (b = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey]);
  }
  var I = new WeakMap(), l = new WeakMap(), f = new WeakMap();
  function V(e) {
    const n5 = new Promise((t2, r2) => {
      const i3 = () => {
        e.removeEventListener("success", c2), e.removeEventListener("error", o);
      }, c2 = () => {
        t2(a(e.result)), i3();
      }, o = () => {
        r2(e.error), i3();
      };
      e.addEventListener("success", c2), e.addEventListener("error", o);
    });
    return f.set(n5, e), n5;
  }
  function S(e) {
    if (I.has(e)) return;
    const n5 = new Promise((t2, r2) => {
      const i3 = () => {
        e.removeEventListener("complete", c2), e.removeEventListener("error", o), e.removeEventListener("abort", o);
      }, c2 = () => {
        t2(), i3();
      }, o = () => {
        r2(e.error || new DOMException("AbortError", "AbortError")), i3();
      };
      e.addEventListener("complete", c2), e.addEventListener("error", o), e.addEventListener("abort", o);
    });
    I.set(e, n5);
  }
  var y = { get(e, n5, t2) {
    if (e instanceof IDBTransaction) {
      if (n5 === "done") return I.get(e);
      if (n5 === "store") return t2.objectStoreNames[1] ? void 0 : t2.objectStore(t2.objectStoreNames[0]);
    }
    return a(e[n5]);
  }, set(e, n5, t2) {
    return e[n5] = t2, true;
  }, has(e, n5) {
    return e instanceof IDBTransaction && (n5 === "done" || n5 === "store") ? true : n5 in e;
  } };
  function E(e) {
    y = e(y);
  }
  function T(e) {
    return x().includes(e) ? function(...n5) {
      return e.apply(h(this), n5), a(this.request);
    } : function(...n5) {
      return a(e.apply(h(this), n5));
    };
  }
  function j(e) {
    return typeof e == "function" ? T(e) : (e instanceof IDBTransaction && S(e), D(e, C()) ? new Proxy(e, y) : e);
  }
  function a(e) {
    if (e instanceof IDBRequest) return V(e);
    if (l.has(e)) return l.get(e);
    const n5 = j(e);
    return n5 !== e && (l.set(e, n5), f.set(n5, e)), n5;
  }
  var h = (e) => f.get(e);
  function A(e, n5, { blocked: t2, upgrade: r2, blocking: i3, terminated: c2 } = {}) {
    const o = indexedDB.open(e, n5), d = a(o);
    return r2 && o.addEventListener("upgradeneeded", (s) => {
      r2(a(o.result), s.oldVersion, s.newVersion, a(o.transaction), s);
    }), t2 && o.addEventListener("blocked", (s) => t2(s.oldVersion, s.newVersion, s)), d.then((s) => {
      c2 && s.addEventListener("close", () => c2()), i3 && s.addEventListener("versionchange", (u3) => i3(u3.oldVersion, u3.newVersion, u3));
    }).catch(() => {
    }), d;
  }
  function O(e, { blocked: n5 } = {}) {
    const t2 = indexedDB.deleteDatabase(e);
    return n5 && t2.addEventListener("blocked", (r2) => n5(r2.oldVersion, r2)), a(t2).then(() => {
    });
  }
  var v = ["get", "getKey", "getAll", "getAllKeys", "count"], W = ["put", "add", "delete", "clear"], m = new Map();
  function M(e, n5) {
    if (!(e instanceof IDBDatabase && !(n5 in e) && typeof n5 == "string")) return;
    if (m.get(n5)) return m.get(n5);
    const t2 = n5.replace(/FromIndex$/, ""), r2 = n5 !== t2, i3 = W.includes(t2);
    if (!(t2 in (r2 ? IDBIndex : IDBObjectStore).prototype) || !(i3 || v.includes(t2))) return;
    const c2 = async function(o, ...d) {
      const s = this.transaction(o, i3 ? "readwrite" : "readonly");
      let u3 = s.store;
      return r2 && (u3 = u3.index(d.shift())), (await Promise.all([u3[t2](...d), i3 && s.done]))[0];
    };
    return m.set(n5, c2), c2;
  }
  E((e) => ({ ...e, get: (n5, t2, r2) => M(n5, t2) || e.get(n5, t2, r2), has: (n5, t2) => !!M(n5, t2) || e.has(n5, t2) }));
  var p = ["continue", "continuePrimaryKey", "advance"], P = {}, B = new WeakMap(), L = new WeakMap(), F = { get(e, n5) {
    if (!p.includes(n5)) return e[n5];
    let t2 = P[n5];
    return t2 || (t2 = P[n5] = function(...r2) {
      B.set(this, L.get(this)[n5](...r2));
    }), t2;
  } };
  async function* k(...e) {
    let n5 = this;
    if (n5 instanceof IDBCursor || (n5 = await n5.openCursor(...e)), !n5) return;
    n5 = n5;
    const t2 = new Proxy(n5, F);
    for (L.set(t2, n5), f.set(t2, h(n5)); n5; ) yield t2, n5 = await (B.get(t2) || n5.continue()), B.delete(t2);
  }
  function g(e, n5) {
    return n5 === Symbol.asyncIterator && D(e, [IDBIndex, IDBObjectStore, IDBCursor]) || n5 === "iterate" && D(e, [IDBIndex, IDBObjectStore]);
  }
  E((e) => ({ ...e, get(n5, t2, r2) {
    return g(n5, t2) ? k : e.get(n5, t2, r2);
  }, has(n5, t2) {
    return g(n5, t2) || e.has(n5, t2);
  } }));
  var Database = class _Database {
    static instance;
    dbPromise;
    constructor() {
      this.dbPromise = A("IwaraDownloadTool", 20, {
        upgrade(db2, oldVersion, newVersion, transaction) {
          if (!db2.objectStoreNames.contains("follows")) {
            const followsStore = db2.createObjectStore("follows", { keyPath: "id" });
            followsStore.createIndex("id", "id", { unique: true });
            followsStore.createIndex("username", "username", { unique: true });
            followsStore.createIndex("name", "name");
            followsStore.createIndex("friend", "friend");
            followsStore.createIndex("following", "following");
            followsStore.createIndex("followedBy", "followedBy");
          }
          if (!db2.objectStoreNames.contains("friends")) {
            const friendsStore = db2.createObjectStore("friends", { keyPath: "id" });
            friendsStore.createIndex("id", "id", { unique: true });
            friendsStore.createIndex("username", "username", { unique: true });
            friendsStore.createIndex("name", "name");
            friendsStore.createIndex("friend", "friend");
            friendsStore.createIndex("following", "following");
            friendsStore.createIndex("followedBy", "followedBy");
          }
          if (!db2.objectStoreNames.contains("videos")) {
            const videosStore = db2.createObjectStore("videos", { keyPath: "ID" });
            videosStore.createIndex("ID", "ID", { unique: true });
            videosStore.createIndex("UploadTime", "UploadTime");
            videosStore.createIndex("Private", "Private");
            videosStore.createIndex("Unlisted", "Unlisted");
            videosStore.createIndex("Type", "Type");
          }
          if (!db2.objectStoreNames.contains("caches")) {
            const cachesStore = db2.createObjectStore("caches", { keyPath: "ID" });
            cachesStore.createIndex("ID", "ID", { unique: true });
          }
        }
      });
    }
    async getDB() {
      return this.dbPromise;
    }
    async follows() {
      const db2 = await this.getDB();
      return db2.transaction("follows", "readwrite").objectStore("follows");
    }
    async friends() {
      const db2 = await this.getDB();
      return db2.transaction("friends", "readwrite").objectStore("friends");
    }
    async videos() {
      const db2 = await this.getDB();
      return db2.transaction("videos", "readwrite").objectStore("videos");
    }
    async caches() {
      const db2 = await this.getDB();
      return db2.transaction("caches", "readwrite").objectStore("caches");
    }
    async getFollows() {
      const store = await this.follows();
      return store.getAll();
    }
    async getFriends() {
      const store = await this.friends();
      return store.getAll();
    }
    async getVideos() {
      const store = await this.videos();
      return store.getAll();
    }
    async getCaches() {
      const store = await this.caches();
      return store.getAll();
    }
    async getFollowByUsername(username) {
      const db2 = await this.getDB();
      const tx = db2.transaction("follows", "readonly");
      const index = tx.store.index("username");
      return index.get(username);
    }
    async getFollowById(id) {
      const db2 = await this.getDB();
      return db2.get("follows", id);
    }
    async getVideoById(id) {
      const db2 = await this.getDB();
      return db2.get("videos", id);
    }
    async getVideosByIds(ids) {
      const db2 = await this.getDB();
      const tx = db2.transaction("videos", "readonly");
      const store = tx.store;
      const results = [];
      for (const id of ids) {
        const video = await store.get(id);
        if (video) {
          results.push(video);
        }
      }
      return results;
    }
    async putVideo(video) {
      const db2 = await this.getDB();
      await db2.put("videos", video);
    }
    async bulkPutVideos(videos) {
      const db2 = await this.getDB();
      const tx = db2.transaction("videos", "readwrite");
      const store = tx.store;
      for (const video of videos) {
        await store.put(video);
      }
      await tx.done;
    }
    async putFollow(user) {
      const db2 = await this.getDB();
      await db2.put("follows", user);
    }
    async putFriend(user) {
      const db2 = await this.getDB();
      await db2.put("friends", user);
    }
    async deleteFollow(id) {
      const db2 = await this.getDB();
      await db2.delete("follows", id);
    }
    async deleteFriend(id) {
      const db2 = await this.getDB();
      await db2.delete("friends", id);
    }
    async getFilteredVideos(startTime, endTime) {
      if (isNullOrUndefined(startTime) || isNullOrUndefined(endTime)) return [];
      const db2 = await this.getDB();
      const tx = db2.transaction("videos", "readonly");
      const store = tx.store;
      const index = store.index("UploadTime");
      const allVideos = [];
      let cursor = await index.openCursor(IDBKeyRange.bound(startTime, endTime, true, true));
      while (cursor) {
        const video = cursor.value;
        if ((video.Type === "partial" || video.Type === "full") && (video.Private || video.Unlisted) && !isNullOrUndefined(video.RAW)) {
          allVideos.push(video);
        }
        cursor = await cursor.continue();
      }
      return allVideos;
    }
    static getInstance() {
      if (isNullOrUndefined(_Database.instance)) {
        _Database.instance = new _Database();
      }
      return _Database.instance;
    }
    static destroyInstance() {
      _Database.instance = void 0;
    }
    async delete() {
      const db2 = await this.getDB();
      db2.close();
      await O("IwaraDownloadTool");
    }
  };
  var db = Database.getInstance();
  var import_dayjs = __toESM(require_dayjs_min(), 1);
  Date.prototype.format = function(format) {
    return (0, import_dayjs.default)(this).format(format);
  };
  var unlimitedFetch = async (input, init = {}, options) => {
    const {
      force = false,
      retry = false,
      maxRetries = 3,
      retryDelay = 3e3,
      successStatus = [200, 201],
      failStatuses = [403, 404],
      onFail,
      onRetry
    } = options || {};
    const successStatuses = Array.isArray(successStatus) ? successStatus : [successStatus];
    const failStatusList = Array.isArray(failStatuses) ? failStatuses : [failStatuses];
    const url = typeof input === "string" ? input : input.url;
    const isCrossOrigin = force || new URL(url).hostname !== unsafeWindow.location.hostname;
    const doFetch = async () => {
      if (isCrossOrigin) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: init.method,
            url,
            headers: init.headers || {},
            data: init.body || void 0,
            onload: (response) => {
              resolve(new Response(response.responseText, {
                status: response.status,
                statusText: response.statusText
              }));
            },
            onerror: reject
          });
        });
      } else {
        return originalFetch(input, init);
      }
    };
    if (!retry) return doFetch();
    let lastResponse = await doFetch();
    let attempts = 1;
    while (attempts < maxRetries) {
      if (successStatuses.includes(lastResponse.status)) return lastResponse;
      if (failStatusList.includes(lastResponse.status)) break;
      attempts++;
      if (onRetry) await onRetry(lastResponse);
      await delay(retryDelay);
      lastResponse = await doFetch();
    }
    if (onFail) await onFail(lastResponse);
    return lastResponse;
  };
  var findElement = (element, condition) => {
    while (!isNullOrUndefined(element) && !element.matches(condition)) {
      if (isNullOrUndefined(element.parentElement)) return void 0;
      element = element.parentElement;
    }
    return element.querySelectorAll(condition).length > 1 ? void 0 : element;
  };
  var renderNode = (renderCode) => {
    let code = prune(renderCode);
    if (isNullOrUndefined(code)) throw new Error("RenderCode null");
    if (typeof code === "string") {
      return document.createTextNode(code.replaceVariable(i18nList[config.language]));
    }
    if (renderCode instanceof Node) {
      return code;
    }
    if (typeof renderCode !== "object" || !renderCode.nodeType) {
      throw new Error("Invalid arguments");
    }
    const { nodeType, attributes, events, className, childs } = renderCode;
    const node = document.createElement(nodeType);
    if (!isNullOrUndefined(events) && Object.keys(events).length > 0) {
      Object.entries(events).forEach(([eventName, eventHandler]) => originalAddEventListener.call(node, eventName, eventHandler));
    }
    if (!isNullOrUndefined(attributes) && Object.keys(attributes).length > 0) {
      Object.entries(attributes).forEach(([key, value]) => {
        node.setAttribute(key, value);
        node[key] = value;
      });
    }
    if (!isNullOrUndefined(className) && className.length > 0) {
      node.classList.add(...typeof className === "string" ? [className] : className);
    }
    if (!isNullOrUndefined(childs)) {
      node.append(...(isArray(childs) ? childs : [childs]).filter((child) => !isNullOrUndefined(child)).map(renderNode));
    }
    return node;
  };
  var activeToasts = new Dictionary();
  var toastTimeouts = new Map();
  var toastIntervals = new Map();
  var toastContainers = new Map();
  var offscreenContainer = document.createElement("div");
  offscreenContainer.classList.add("offscreen-container");
  var getContainer = (gravity, position) => {
    const containerId = `toast-container-${gravity}-${position}`;
    if (!toastContainers.has(containerId)) {
      const container = document.createElement("div");
      container.id = containerId;
      container.classList.add(
        "toast-container",
        `toast-${gravity}`,
        `toast-${position}`
      );
      document.body.appendChild(container);
      toastContainers.set(containerId, container);
    }
    return toastContainers.get(containerId);
  };
  var addTimeout = (toast, callback) => {
    if (isNullOrUndefined(toast.options.duration)) return;
    delTimeout(toast);
    const duration = toast.options.duration;
    const timeoutId = window.setTimeout(() => {
      callback();
      delTimeout(toast);
    }, duration);
    toastTimeouts.set(toast, timeoutId);
    if (!toast.showProgress) return;
    if (isNullOrUndefined(toast.progress)) return;
    const startTime = Date.now();
    const updateRemainingTime = () => {
      if (isNullOrUndefined(toast.progress)) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      toast.progress.style.setProperty("--toast-progress", `${remaining / duration}`);
    };
    toast.progress.style.setProperty("--toast-progress", `1`);
    const intervalId = window.setInterval(updateRemainingTime, 20);
    toastIntervals.set(toast, intervalId);
  };
  var delTimeout = (toast) => {
    const timeoutId = toastTimeouts.get(toast);
    if (!isNullOrUndefined(timeoutId)) {
      clearTimeout(timeoutId);
      toastTimeouts.delete(toast);
    }
    if (!toast.showProgress) return;
    const intervalId = toastIntervals.get(toast);
    if (!isNullOrUndefined(intervalId)) {
      clearInterval(intervalId);
      toastIntervals.delete(toast);
    }
    if (!isNullOrUndefined(toast.progress)) {
      toast.progress.style.removeProperty("--toast-progress");
    }
  };
  var Toast = class _Toast {
    static defaults = {
      id: UUID(),
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      oldestFirst: true,
      showProgress: false
    };
    id;
    options;
    root;
    element;
    gravity;
    position;
    oldestFirst;
    stopOnFocus;
    showProgress;
    content;
    progress;
    mouseOverHandler;
    mouseLeaveHandler;
    closeButtonHandler;
    animationEndHandler;
    clickHandler;
    closeButton;
    constructor(options) {
      this.options = {
        ..._Toast.defaults,
        ...options
      };
      this.id = this.options.id;
      this.root = getContainer(this.options.gravity, this.options.position);
      this.gravity = this.options.gravity;
      this.position = this.options.position;
      this.stopOnFocus = this.options.stopOnFocus;
      this.oldestFirst = this.options.oldestFirst;
      this.showProgress = this.options.showProgress;
      this.element = document.createElement("div");
      this.applyBaseStyles().addCloseButton().createContent().ensureCloseMethod().bindEvents();
      activeToasts.set(this.id, this);
    }
    applyBaseStyles() {
      this.element.classList.add("toast");
      if (this.options.className) {
        const classes = Array.isArray(this.options.className) ? this.options.className : [this.options.className];
        classes.forEach((cls) => this.element.classList.add(cls));
      }
      return this;
    }
    createContent() {
      this.content = document.createElement("div");
      this.content.classList.add("toast-content");
      if (this.options.text) {
        this.content.textContent = this.options.text;
      }
      if (this.options.node) {
        this.content.appendChild(this.options.node);
      }
      if (this.options.style) {
        this.applyStyles(this.content, this.options.style);
      }
      if (this.options.showProgress) {
        this.progress = document.createElement("div");
        this.progress.classList.add("toast-progress");
        this.content.appendChild(this.progress);
      }
      this.element.appendChild(this.content);
      return this;
    }
    addCloseButton() {
      if (this.options.close) {
        this.closeButton = document.createElement("span");
        this.closeButton.className = "toast-close";
        this.closeButton.textContent = "🗙";
        this.closeButtonHandler = () => this.hide("close-button");
        this.closeButton.addEventListener("click", this.closeButtonHandler);
        this.element.appendChild(this.closeButton);
      }
      return this;
    }
    setToastRect() {
      if (!this.element.classList.contains("show")) offscreenContainer.appendChild(this.element);
      this.element.style.removeProperty("--toast-height");
      this.element.style.removeProperty("--toast-width");
      this.element.style.setProperty("max-height", "none", "important");
      this.element.style.setProperty("max-width", `${this.root.getBoundingClientRect().width}px`, "important");
      const { height, width } = this.element.getBoundingClientRect();
      this.element.style.setProperty("--toast-height", `${height}px`);
      this.element.style.setProperty("--toast-width", `${width}px`);
      this.element.style.removeProperty("max-height");
      this.element.style.removeProperty("max-width");
      if (!this.element.classList.contains("show")) offscreenContainer.removeChild(this.element);
      return this;
    }
    ensureCloseMethod() {
      if (isNullOrUndefined(this.options.duration) && isNullOrUndefined(this.options.close) && isNullOrUndefined(this.options.onClick)) {
        this.options.onClick = () => this.hide("other");
      }
      return this;
    }
    bindEvents() {
      if (this.stopOnFocus && !isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
        this.mouseOverHandler = () => delTimeout(this);
        this.mouseLeaveHandler = () => addTimeout(this, () => this.hide("timeout"));
        this.element.addEventListener("mouseover", this.mouseOverHandler);
        this.element.addEventListener("mouseleave", this.mouseLeaveHandler);
      }
      if (!isNullOrUndefined(this.options.onClick)) {
        this.clickHandler = this.options.onClick.bind(this);
        this.element.addEventListener("click", this.clickHandler);
      }
      return this;
    }
    applyStyles(element, styles) {
      function camelToKebab(str) {
        return str.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
      for (const key in styles) {
        const value = styles[key];
        const property = camelToKebab(key);
        if (isNullOrUndefined(value)) {
          element.style.removeProperty(property);
          continue;
        }
        const important = value.includes("!important");
        const cleanValue = value.replace(/\s*!important\s*/, "").trim();
        element.style.setProperty(property, cleanValue, important ? "important" : "");
      }
    }
    toggleAnimationState(animation) {
      if (!this.element.classList.replace(animation ? "hide" : "show", animation ? "show" : "hide")) {
        this.element.classList.add(animation ? "show" : "hide");
      }
      return this;
    }
    insertToastElement() {
      if (this.oldestFirst) {
        this.root.insertBefore(this.element, this.root.firstChild);
      } else {
        if (this.root.lastChild) {
          this.root.insertBefore(this.element, this.root.lastChild.nextSibling);
        } else {
          this.root.appendChild(this.element);
        }
      }
      return this;
    }
    setupAutoHide() {
      if (!isNullOrUndefined(this.options.duration) && this.options.duration > 0) {
        addTimeout(this, () => this.hide("timeout"));
      }
      return this;
    }
    show() {
      this.setToastRect().insertToastElement().toggleAnimationState(true).setupAutoHide();
      return this;
    }
    showToast() {
      return this.show();
    }
    removeEventListeners() {
      if (this.mouseOverHandler) {
        this.element.removeEventListener("mouseover", this.mouseOverHandler);
      }
      if (this.mouseLeaveHandler) {
        this.element.removeEventListener("mouseleave", this.mouseLeaveHandler);
      }
      if (this.clickHandler) {
        this.element.removeEventListener("click", this.clickHandler);
      }
      if (this.options.close && this.closeButton && this.closeButtonHandler) {
        this.closeButton.removeEventListener("click", this.closeButtonHandler);
      }
      return this;
    }
    hide(reason = "other") {
      if (!this.element) return;
      delTimeout(this);
      activeToasts.delete(this.id);
      this.animationEndHandler = (e) => {
        if (e.animationName.startsWith("toast-out")) {
          this.element.removeEventListener("animationend", this.animationEndHandler);
          this.element.remove();
          this.options.onClose?.call(this, new CustomEvent("toast-close", {
            detail: { reason }
          }));
        }
      };
      this.element.addEventListener("animationend", this.animationEndHandler);
      this.removeEventListeners().toggleAnimationState(false);
    }
    hideToast() {
      this.hide("other");
    }
  };
  function createToast(options) {
    return new Toast(options);
  }
  globalThis.Toast = createToast;
  globalThis.Toastify = createToast;
  (document.body ?? document.documentElement).appendChild(offscreenContainer);
  window.addEventListener("resize", debounce(() => {
    for (const [_, toast] of activeToasts) {
      toast.setToastRect();
    }
  }, 100));
  async function refreshToken() {
    const { authorization } = config;
    if (!isLoggedIn()) throw new Error(`Refresh token failed: Not logged in`);
    const refreshToken2 = localStorage.getItem("token") ?? authorization;
    if (isNullOrUndefined(refreshToken2) || refreshToken2.isEmpty()) {
      throw new Error(`Refresh token failed: no refresh token`);
    }
    const oldAccessToken = localStorage.getItem("accessToken");
    try {
      const res = await unlimitedFetch(
        "https://api.iwara.tv/user/token",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken2}`
          }
        }
      );
      if (!res.ok) {
        throw new Error(`Refresh token failed with status: ${res.status}`);
      }
      const { accessToken } = await res.json();
      if (!accessToken) {
        throw new Error(`No access token in response`);
      }
      if (!oldAccessToken || oldAccessToken !== accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      return accessToken;
    } catch (error) {
      originalConsole.warn("Failed to refresh token:", error);
      if (!oldAccessToken?.trim()) {
        throw new Error(`Refresh token failed and no valid access token available`);
      }
      return oldAccessToken;
    }
  }
  async function getAuth(url) {
    return prune({
      "Accept": "application/json",
      "Cooike": unsafeWindow.document.cookie,
      "Authorization": isLoggedIn() ? `Bearer ${localStorage.getItem("accessToken") ?? await refreshToken()}` : void 0,
      "X-Version": !isNullOrUndefined(url) && !url.isEmpty() ? await getXVersion(url) : void 0
    });
  }
  function checkIsHaveDownloadLink(comment) {
    if (!config.checkDownloadLink || isNullOrUndefined(comment) || comment.isEmpty()) {
      return false;
    }
    return [
      "iwara.zip",
      "pan.baidu",
      "/s/",
      "mega.nz",
      "drive.google.com",
      "aliyundrive",
      "uploadgig",
      "katfile",
      "storex",
      "subyshare",
      "rapidgator",
      "filebe",
      "filespace",
      "mexa.sh",
      "mexashare",
      "mx-sh.net",
      "icerbox",
      "alfafile",
      "1drv.ms",
      "onedrive.",
      "gofile.io",
      "workupload.com",
      "pixeldrain.",
      "dailyuploads.net",
      "katfile.com",
      "fikper.com",
      "frdl.io",
      "rg.to",
      "gigafile.nu"
    ].filter((i3) => comment.toLowerCase().includes(i3)).any();
  }
  function toastNode(body, title) {
    return renderNode({
      nodeType: "div",
      childs: [
        !isNullOrUndefined(title) && !title.isEmpty() ? {
          nodeType: "h3",
          childs: `%#appName#% - ${title}`
        } : {
          nodeType: "h3",
          childs: "%#appName#%"
        },
        {
          nodeType: "p",
          childs: body
        }
      ]
    });
  }
  function getTextNode(node) {
    return node.nodeType === Node.TEXT_NODE ? node.textContent || "" : node.nodeType === Node.ELEMENT_NODE ? Array.from(node.childNodes).map(getTextNode).join("") : "";
  }
  function newToast(type, params) {
    const logFunc = {
      [2]: originalConsole.warn,
      [3]: originalConsole.error,
      [0]: originalConsole.log,
      [1]: originalConsole.info
    }[type] || originalConsole.log;
    if (isNullOrUndefined(params)) params = {};
    if (!isNullOrUndefined(params.id) && activeToasts.has(params.id)) activeToasts.get(params.id)?.hide();
    switch (type) {
      case 1:
        params = Object.assign({
          duration: 2e3,
          style: {
            background: "linear-gradient(-30deg, rgb(0, 108, 215), rgb(0, 180, 255))"
          }
        }, params);
      case 2:
        params = Object.assign({
          duration: -1,
          style: {
            background: "linear-gradient(-30deg, rgb(119, 76, 0), rgb(255, 165, 0))"
          }
        }, params);
        break;
      case 3:
        params = Object.assign({
          duration: -1,
          style: {
            background: "linear-gradient(-30deg, rgb(108, 0, 0), rgb(215, 0, 0))"
          }
        }, params);
      default:
        break;
    }
    if (!isNullOrUndefined(params.text)) {
      params.text = params.text.replaceVariable(i18nList[config.language]).toString();
    }
    logFunc((!isNullOrUndefined(params.text) ? params.text : !isNullOrUndefined(params.node) ? getTextNode(params.node) : "undefined").replaceVariable(i18nList[config.language]));
    return new Toast(params);
  }
  function getDownloadPath(videoInfo) {
    return analyzeLocalPath(
      config.downloadPath.trim().replaceVariable({
        NowTime: new Date(),
        UploadTime: new Date(videoInfo.UploadTime),
        AUTHOR: videoInfo.Author,
        ID: videoInfo.ID,
        TITLE: videoInfo.Title.normalize("NFKC").replaceAll(new RegExp("(\\P{Mark})(\\p{Mark}+)", "gu"), "_").replace(/^\.|[\\\\/:*?\"<>|]/img, "_").truncate(72),
        ALIAS: videoInfo.Alias.normalize("NFKC").replaceAll(new RegExp("(\\P{Mark})(\\p{Mark}+)", "gu"), "_").replace(/^\.|[\\\\/:*?\"<>|]/img, "_").truncate(64),
        QUALITY: videoInfo.DownloadQuality
      })
    );
  }
  function analyzeLocalPath(path) {
    try {
      return new Path(path);
    } catch (error) {
      let toast = newToast(
        3,
        {
          node: toastNode([
            `%#downloadPathError#%`,
            { nodeType: "br" },
            stringify(error)
          ], "%#settingsCheck#%"),
          position: "center",
          onClick() {
            toast.hide();
          }
        }
      );
      toast.show();
      throw new Error(`%#downloadPathError#% ["${path}"]`);
    }
  }
  async function EnvCheck() {
    try {
      if (GM_info.scriptHandler !== "ScriptCat" && GM_info.downloadMode !== "browser") {
        GM_getValue("isDebug") && originalConsole.debug("[Debug]", GM_info);
        throw new Error("%#browserDownloadModeError#%");
      }
    } catch (error) {
      let toast = newToast(
        3,
        {
          node: toastNode([
            `%#configError#%`,
            { nodeType: "br" },
            stringify(error)
          ], "%#settingsCheck#%"),
          position: "center",
          onClick() {
            toast.hide();
          }
        }
      );
      toast.show();
      return false;
    }
    return true;
  }
  async function localPathCheck() {
    try {
      let pathTest = analyzeLocalPath(config.downloadPath.replaceVariable({
        NowTime: new Date(),
        UploadTime: new Date(),
        AUTHOR: "test",
        ID: "test",
        TITLE: "test",
        ALIAS: "test",
        QUALITY: "test"
      }));
      if (isNullOrUndefined(pathTest)) throw "analyzeLocalPath error";
      if (pathTest.fullPath.isEmpty()) throw "analyzeLocalPath isEmpty";
    } catch (error) {
      let toast = newToast(
        3,
        {
          node: toastNode([
            `%#downloadPathError#%`,
            { nodeType: "br" },
            stringify(error)
          ], "%#settingsCheck#%"),
          position: "center",
          onClick() {
            toast.hide();
          }
        }
      );
      toast.show();
      return false;
    }
    return true;
  }
  async function aria2Check() {
    try {
      let res = await (await unlimitedFetch(config.aria2Path, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "aria2.tellActive",
          "id": UUID(),
          "params": ["token:" + config.aria2Token]
        })
      })).json();
      if (res.error) {
        throw new Error(res.error.message);
      }
    } catch (error) {
      let toast = newToast(
        3,
        {
          node: toastNode([
            `Aria2 RPC %#connectionTest#%`,
            { nodeType: "br" },
            stringify(error)
          ], "%#settingsCheck#%"),
          position: "center",
          onClick() {
            toast.hide();
          }
        }
      );
      toast.show();
      return false;
    }
    return true;
  }
  async function iwaradlCheck() {
    try {
      let res = await (await unlimitedFetch(config.iwaradlPath, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify(prune({
          "ver": GM_getValue("version", "0.0.0").split(".").map((i3) => Number(i3)),
          "code": "State",
          "token": config.iwaradlToken
        }))
      })).json();
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
    } catch (error) {
      let toast = newToast(
        3,
        {
          node: toastNode([
            `iwaradl RPC %#connectionTest#%`,
            { nodeType: "br" },
            stringify(error)
          ], "%#settingsCheck#%"),
          position: "center",
          onClick() {
            toast.hide();
          }
        }
      );
      toast.show();
      return false;
    }
    return true;
  }
  function aria2Download(videoInfo) {
    (async function(videoInfo2) {
      let localPath = getDownloadPath(videoInfo2);
      let downloadUrl = videoInfo2.DownloadUrl.toURL();
      downloadUrl.searchParams.set("videoid", videoInfo2.ID);
      downloadUrl.searchParams.set("download", localPath.fullName);
      let params = [
        [downloadUrl.href],
        prune({
          "all-proxy": config.downloadProxy,
          "all-proxy-passwd": !config.downloadProxy.isEmpty() ? config.downloadProxyPassword : void 0,
          "all-proxy-user": !config.downloadProxy.isEmpty() ? config.downloadProxyUsername : void 0,
          "out": localPath.fullName,
          "dir": localPath.directory,
          "referer": window.location.hostname,
          "header": [
            "Cookie:" + unsafeWindow.document.cookie
          ]
        })
      ];
      let res = await aria2API("aria2.addUri", params);
      originalConsole.log(`Aria2 ${videoInfo2.Title} ${JSON.stringify(res)}`);
      newToast(
        1,
        {
          gravity: "bottom",
          node: toastNode(`${videoInfo2.Title}[${videoInfo2.ID}] %#pushTaskSucceed#%`)
        }
      ).show();
    })(videoInfo);
  }
  function iwaradlDownload(videoInfo) {
    (async function(videoInfo2) {
      let r2 = await (await unlimitedFetch(config.iwaradlPath, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify(prune({
          "ver": GM_getValue("version", "0.0.0").split(".").map((i3) => Number(i3)),
          "code": "add",
          "token": config.iwaradlToken,
          "data": {
            "info": {
              "title": videoInfo2.Title,
              "url": videoInfo2.DownloadUrl,
              "size": videoInfo2.Size,
              "source": videoInfo2.ID,
              "alias": videoInfo2.Alias,
              "author": videoInfo2.Author,
              "uploadTime": videoInfo2.UploadTime,
              "comments": videoInfo2.Comments,
              "tags": videoInfo2.Tags,
              "quality": videoInfo2.DownloadQuality,
              "path": config.downloadPath.replaceVariable(
                {
                  NowTime: new Date(),
                  UploadTime: videoInfo2.UploadTime,
                  AUTHOR: videoInfo2.Author,
                  ID: videoInfo2.ID,
                  TITLE: videoInfo2.Title,
                  ALIAS: videoInfo2.Alias,
                  QUALITY: videoInfo2.DownloadQuality
                }
              )
            },
            "option": {
              "proxy": config.downloadProxy,
              "cookies": unsafeWindow.document.cookie
            }
          }
        }))
      })).json();
      if (r2.code === 0) {
        originalConsole.log(`${videoInfo2.Title} %#pushTaskSucceed#% ${r2}`);
        newToast(
          1,
          {
            node: toastNode(`${videoInfo2.Title}[${videoInfo2.ID}] %#pushTaskSucceed#%`)
          }
        ).show();
      } else {
        let toast = newToast(
          3,
          {
            node: toastNode([
              `${videoInfo2.Title}[${videoInfo2.ID}] %#pushTaskFailed#% `,
              { nodeType: "br" },
              r2.msg
            ], "%#iwaradlDownload#%"),
            onClick() {
              toast.hide();
            }
          }
        );
        toast.show();
      }
    })(videoInfo);
  }
  function othersDownload(videoInfo) {
    (async function(DownloadUrl) {
      DownloadUrl.searchParams.set("download", getDownloadPath(videoInfo).fullName);
      GM_openInTab(DownloadUrl.href, { active: false, insert: true, setParent: true });
    })(videoInfo.DownloadUrl.toURL());
  }
  function browserDownloadErrorParse(error) {
    let errorInfo = stringify(error);
    if (!(error instanceof Error)) {
      errorInfo = {
        "not_enabled": `%#browserDownloadNotEnabled#%`,
        "not_whitelisted": `%#browserDownloadNotWhitelisted#%`,
        "not_permitted": `%#browserDownloadNotPermitted#%`,
        "not_supported": `%#browserDownloadNotSupported#%`,
        "not_succeeded": `%#browserDownloadNotSucceeded#% ${isNullOrUndefined(error.details) ? "UnknownError" : error.details}`
      }[error.error] || `%#browserDownloadUnknownError#%`;
    }
    return errorInfo;
  }
  function browserDownload(videoInfo) {
    (async function(videoInfo2) {
      function toastError(error) {
        let toast = newToast(
          3,
          {
            node: toastNode([
              `${videoInfo2.Title}[${videoInfo2.ID}] %#downloadFailed#%`,
              { nodeType: "br" },
              browserDownloadErrorParse(error),
              { nodeType: "br" },
              `%#tryRestartingDownload#%`
            ], "%#browserDownload#%"),
            async onClick() {
              toast.hide();
              await pushDownloadTask(videoInfo2);
            }
          }
        );
        toast.show();
      }
      GM_download({
        url: videoInfo2.DownloadUrl,
        saveAs: false,
        name: getDownloadPath(videoInfo2).fullPath,
        onerror: (err) => toastError(err),
        ontimeout: () => toastError(new Error("%#browserDownloadTimeout#%"))
      });
    })(videoInfo);
  }
  async function aria2API(method, params) {
    return await (await unlimitedFetch(config.aria2Path, {
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        id: UUID(),
        params: [`token:${config.aria2Token}`, ...params]
      }),
      method: "POST"
    })).json();
  }
  function aria2TaskExtractVideoID(task) {
    try {
      if (isNullOrUndefined(task.files) || task.files.length !== 1) return;
      const file = task.files[0];
      if (isNullOrUndefined(file)) return;
      if (file.uris.length < 1) return;
      let downloadUrl = file.uris[0].uri.toURL();
      if (isNullOrUndefined(downloadUrl)) return;
      let videoID;
      if (downloadUrl.searchParams.has("videoid")) videoID = downloadUrl.searchParams.get("videoid");
      if (!isNullOrUndefined(videoID) && !videoID.isEmpty()) return videoID;
      if (isNullOrUndefined(file.path) || file.path.isEmpty()) return;
      let path = analyzeLocalPath(file.path);
      if (isNullOrUndefined(path.fullName) || path.fullName.isEmpty()) return;
      videoID = path.fullName.toLowerCase().among("[", "].mp4", false, true);
      if (videoID.isEmpty()) return;
      return videoID;
    } catch (error) {
      GM_getValue("isDebug") && originalConsole.debug(`[Debug] check aria2 task file fail! ${stringify(task)}`);
      return;
    }
  }
  async function aria2TaskCheckAndRestart() {
    let stoped = prune(
      (await aria2API(
        "aria2.tellStopped",
        [
          0,
          4096,
          [
            "gid",
            "status",
            "files",
            "errorCode",
            "bittorrent"
          ]
        ]
      )).result.filter(
        (task) => isNullOrUndefined(task.bittorrent)
      ).map(
        (task) => {
          let ID = aria2TaskExtractVideoID(task);
          if (!isNullOrUndefined(ID) && !ID.isEmpty()) {
            return {
              id: ID,
              data: task
            };
          }
        }
      )
    );
    let active = prune(
      (await aria2API(
        "aria2.tellActive",
        [
          [
            "gid",
            "status",
            "files",
            "downloadSpeed",
            "bittorrent"
          ]
        ]
      )).result.filter(
        (task) => isNullOrUndefined(task.bittorrent)
      ).map(
        (task) => {
          let ID = aria2TaskExtractVideoID(task);
          if (!isNullOrUndefined(ID) && !ID.isEmpty()) {
            return {
              id: ID,
              data: task
            };
          }
        }
      )
    );
    let downloadNormalTasks = active.filter(
      (task) => isConvertibleToNumber(task.data.downloadSpeed) && Number(task.data.downloadSpeed) >= 512
    ).unique("id");
    let downloadCompleted = stoped.filter(
      (task) => task.data.status === "complete"
    ).unique("id");
    let downloadUncompleted = stoped.difference(downloadCompleted, "id").difference(downloadNormalTasks, "id");
    let downloadToSlowTasks = active.filter(
      (task) => isConvertibleToNumber(task.data.downloadSpeed) && Number(task.data.downloadSpeed) <= 512
    ).unique("id");
    let needRestart = downloadUncompleted.union(downloadToSlowTasks, "id");
    if (needRestart.length !== 0) {
      newToast(
        2,
        {
          id: "aria2TaskCheckAndRestart",
          node: toastNode(
            [
              `发现 ${needRestart.length} 个需要重启的下载任务！`,
              { nodeType: "br" },
              "%#tryRestartingDownload#%"
            ],
            "%#aria2TaskCheck#%"
          ),
          async onClick() {
            this.hide();
            for (let i3 = 0; i3 < needRestart.length; i3++) {
              const task = needRestart[i3];
              await pushDownloadTask(await parseVideoInfo({
                Type: "init",
                ID: task.id
              }), true);
              let activeTasks = active.filter(
                (activeTask) => activeTask.id === task.id
              );
              for (let t2 = 0; t2 < activeTasks.length; t2++) {
                const element = activeTasks[t2];
                await aria2API("aria2.forceRemove", [element.data.gid]);
              }
            }
          }
        }
      ).show();
    } else {
      newToast(1, {
        id: "aria2TaskCheckAndRestart",
        duration: 1e4,
        node: toastNode(
          `未发现需要重启的下载任务！`
        )
      }).show();
    }
  }
  function getPlayload(authorization) {
    return JSON.parse(decodeURIComponent(encodeURIComponent(window.atob(authorization.split(" ").pop().split(".")[1]))));
  }
  async function check() {
    if (await localPathCheck()) {
      switch (config.downloadType) {
        case 0:
          return await aria2Check();
        case 1:
          return await iwaradlCheck();
        case 2:
          return await EnvCheck();
        default:
          break;
      }
      return true;
    } else {
      return false;
    }
  }
  async function getXVersion(urlString) {
    let url = urlString.toURL();
    const data = new TextEncoder().encode([url.pathname.split("/").pop(), url.searchParams.get("expires"), "5nFp9kmbNnHdAFhaqMvt"].join("_"));
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    return Array.from(new Uint8Array(hashBuffer)).map((b2) => b2.toString(16).padStart(2, "0")).join("");
  }
  async function getCommentData(id, commentID, page = 0) {
    return await (await unlimitedFetch(`https://api.iwara.tv/video/${id}/comments?page=${page}${!isNullOrUndefined(commentID) && !commentID.isEmpty() ? "&parent=" + commentID : ""}`, { headers: await getAuth() })).json();
  }
  async function getCommentDatas(id, commentID) {
    let comments = [];
    let base = await getCommentData(id, commentID);
    comments.push(...base.results);
    for (let page = 1; page < Math.ceil(base.count / base.limit); page++) {
      comments.push(...(await getCommentData(id, commentID, page)).results);
    }
    let replies = [];
    for (let index = 0; index < comments.length; index++) {
      const comment = comments[index];
      if (comment.numReplies > 0) {
        replies.push(...await getCommentDatas(id, comment.id));
      }
    }
    comments.push(...replies);
    return comments;
  }
  async function parseVideoInfo(info) {
    let ID = info.ID;
    let Type = info.Type;
    let RAW = info.RAW;
    try {
      switch (info.Type) {
        case "cache":
          RAW = info.RAW;
          ID = RAW.id;
          Type = "partial";
          break;
        case "init":
        case "fail":
        case "partial":
        case "full":
          GM_getValue("isDebug") && originalConsole.debug(`[debug] try parse full source`);
          let sourceResult = await (await unlimitedFetch(
            `https://api.iwara.tv/video/${info.ID}`,
            {
              headers: await getAuth()
            },
            {
              retry: true,
              maxRetries: 3,
              failStatuses: [403, 404],
              retryDelay: 1e3,
              onRetry: async () => {
                await refreshToken();
              }
            }
          )).json();
          if (isNullOrUndefined(sourceResult.id)) {
            Type = "fail";
            return {
              ID,
              Type,
              RAW,
              Msg: sourceResult.message ?? stringify(sourceResult)
            };
          }
          RAW = sourceResult;
          ID = RAW.id;
          Type = "full";
          break;
        default:
          Type = "fail";
          return {
            ID,
            Type,
            RAW,
            Msg: "Unknown type"
          };
      }
    } catch (error) {
      newToast(
        3,
        {
          node: toastNode([
            `${info.RAW?.title}[${ID}] %#parsingFailed#%`
          ], "%#createTask#%"),
          async onClick() {
            await parseVideoInfo({ Type: "init", ID, RAW, UploadTime: 0 });
            this.hide();
          }
        }
      ).show();
      Type = "fail";
      return {
        ID,
        Type,
        RAW,
        Msg: stringify(error)
      };
    }
    let FileName;
    let Size;
    let External;
    let ExternalUrl;
    let Description;
    let DownloadQuality;
    let DownloadUrl;
    let Comments;
    let UploadTime;
    let Title;
    let Tags;
    let Liked;
    let Alias;
    let Author;
    let AuthorID;
    let Private;
    let Unlisted;
    let Following;
    let Friend;
    UploadTime = new Date(RAW.createdAt ?? 0).getTime();
    Title = RAW.title;
    Tags = RAW.tags;
    Liked = RAW.liked;
    Alias = RAW.user.name;
    Author = RAW.user.username;
    AuthorID = RAW.user.id;
    Private = RAW.private;
    Unlisted = RAW.unlisted;
    External = !isNullOrUndefined(RAW.embedUrl) && !RAW.embedUrl.isEmpty();
    ExternalUrl = RAW.embedUrl;
    if (External) {
      Type = "fail";
      return {
        Type,
        RAW,
        ID,
        Alias,
        Author,
        AuthorID,
        Private,
        UploadTime,
        Title,
        Tags,
        Liked,
        External,
        ExternalUrl,
        Description,
        Unlisted,
        Msg: "external Video"
      };
    }
    try {
      switch (Type) {
        case "full":
          Following = RAW.user.following;
          Friend = RAW.user.friend;
          if (Following) {
            await db.putFollow(RAW.user);
          } else {
            await db.deleteFollow(AuthorID);
          }
          if (Friend) {
            await db.putFriend(RAW.user);
          } else {
            await db.deleteFriend(AuthorID);
          }
          Description = RAW.body;
          FileName = RAW.file.name;
          Size = RAW.file.size;
          let VideoFileSource = (await (await unlimitedFetch(RAW.fileUrl, { headers: await getAuth(RAW.fileUrl) })).json()).sort((a3, b2) => (!isNullOrUndefined(config.priority[b2.name]) ? config.priority[b2.name] : 0) - (!isNullOrUndefined(config.priority[a3.name]) ? config.priority[a3.name] : 0));
          if (isNullOrUndefined(VideoFileSource) || !(VideoFileSource instanceof Array) || VideoFileSource.length < 1) throw new Error(i18nList[config.language].getVideoSourceFailed.toString());
          DownloadQuality = config.checkPriority ? config.downloadPriority : VideoFileSource[0].name;
          let fileList = VideoFileSource.filter((x2) => x2.name === DownloadQuality);
          if (!fileList.any()) throw new Error(i18nList[config.language].noAvailableVideoSource.toString());
          let Source = fileList[Math.floor(Math.random() * fileList.length)].src.download;
          if (isNullOrUndefined(Source) || Source.isEmpty()) throw new Error(i18nList[config.language].videoSourceNotAvailable.toString());
          DownloadUrl = decodeURIComponent(`https:${Source}`);
          GM_getValue("isDebug") && originalConsole.debug(`[debug] try parse all comment`);
          Comments = `${(await getCommentDatas(ID)).map((i3) => i3.body).join("\n")}`.normalize("NFKC");
          return {
            Type,
            RAW,
            ID,
            Alias,
            Author,
            AuthorID,
            Private,
            UploadTime,
            Title,
            Tags,
            Liked,
            External,
            FileName,
            DownloadQuality,
            ExternalUrl,
            Description,
            Comments,
            DownloadUrl,
            Size,
            Following,
            Unlisted,
            Friend
          };
        case "partial":
          return {
            Type,
            RAW,
            ID,
            Alias,
            Author,
            AuthorID,
            UploadTime,
            Title,
            Tags,
            Liked,
            External,
            ExternalUrl,
            Unlisted,
            Private
          };
        default:
          Type = "fail";
          return {
            Type,
            RAW,
            ID,
            Alias,
            Author,
            AuthorID,
            Private,
            UploadTime,
            Title,
            Tags,
            Liked,
            External,
            ExternalUrl,
            Description,
            Unlisted,
            Msg: "Unknown type"
          };
      }
    } catch (error) {
      Type = "fail";
      return {
        Type,
        RAW,
        ID,
        Alias,
        Author,
        AuthorID,
        Private,
        UploadTime,
        Title,
        Tags,
        Liked,
        External,
        ExternalUrl,
        Description,
        Unlisted,
        Msg: stringify(error)
      };
    }
  }
  function generateMatadataURL(videoInfo) {
    const metadataContent = generateMetadataContent(videoInfo);
    const blob = new Blob([metadataContent], { type: "text/plain" });
    return URL.createObjectURL(blob);
  }
  function getMatadataPath(videoInfo) {
    const videoPath = getDownloadPath(videoInfo);
    return `${videoPath.directory}/${videoPath.baseName}.json`;
  }
  function generateMetadataContent(videoInfo) {
    const metadata = Object.assign(videoInfo, {
      DownloadPath: getDownloadPath(videoInfo).fullPath,
      MetaDataVersion: GM_info.script.version
    });
    return JSON.stringify(metadata, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }, 2);
  }
  function browserDownloadMetadata(videoInfo) {
    const url = generateMatadataURL(videoInfo);
    function toastError(error) {
      newToast(
        3,
        {
          node: toastNode([
            `${videoInfo.Title}[${videoInfo.ID}] %#videoMetadata#% %#downloadFailed#%`,
            { nodeType: "br" },
            browserDownloadErrorParse(error)
          ], "%#browserDownload#%"),
          close: true
        }
      ).show();
    }
    GM_download({
      url,
      saveAs: false,
      name: getMatadataPath(videoInfo),
      onerror: (err) => toastError(err),
      ontimeout: () => toastError(new Error("%#browserDownloadTimeout#%")),
      onload: () => URL.revokeObjectURL(url)
    });
  }
  function othersDownloadMetadata(videoInfo) {
    const url = generateMatadataURL(videoInfo);
    const metadataFile = analyzeLocalPath(getMatadataPath(videoInfo)).fullName;
    const downloadHandle = renderNode({
      nodeType: "a",
      attributes: {
        href: url,
        download: metadataFile
      }
    });
    downloadHandle.click();
    downloadHandle.remove();
    URL.revokeObjectURL(url);
  }
  async function addDownloadTask() {
    let textArea = renderNode({
      nodeType: "textarea",
      attributes: {
        placeholder: i18nList[config.language].manualDownloadTips,
        style: "margin-bottom: 10px;",
        rows: "16",
        cols: "96"
      }
    });
    let body = renderNode({
      nodeType: "div",
      attributes: {
        id: "pluginOverlay"
      },
      childs: [
        textArea,
        {
          nodeType: "button",
          events: {
            click: (e) => {
              if (!isNullOrUndefined(textArea.value) && !textArea.value.isEmpty()) {
                let list = [];
                try {
                  const parsed = JSON.parse(textArea.value);
                  if (Array.isArray(parsed)) {
                    list = parsed.map((item) => {
                      if (Array.isArray(item) && isString(item[0]) && !item[0].isEmpty()) {
                        if (!isVideoInfo(item[1])) {
                          item[1].Type = "init";
                          item[1].ID = item[1].ID ?? item[0];
                          item[1].UpdateTime = item[1].UpdateTime ?? Date.now();
                        }
                      }
                      return [...item];
                    });
                  } else {
                    throw new Error("解析结果不是符合预期的列表");
                  }
                } catch (error) {
                  list = textArea.value.split("|").map((ID) => [ID.trim(), {
                    Type: "init",
                    ID: ID.trim()
                  }]);
                }
                if (list.length > 0) {
                  analyzeDownloadTask(new Dictionary(list));
                }
              }
              body.remove();
            }
          },
          childs: i18nList[config.language].ok
        }
      ]
    });
    unsafeWindow.document.body.appendChild(body);
  }
  async function downloadTaskUnique(taskList) {
    let stoped = prune(
      (await aria2API(
        "aria2.tellStopped",
        [
          0,
          4096,
          [
            "gid",
            "status",
            "files",
            "errorCode",
            "bittorrent"
          ]
        ]
      )).result.filter(
        (task) => isNullOrUndefined(task.bittorrent)
      ).map(
        (task) => {
          let ID = aria2TaskExtractVideoID(task);
          if (!isNullOrUndefined(ID) && !ID.isEmpty()) {
            return {
              id: ID,
              data: task
            };
          }
        }
      )
    );
    let active = prune(
      (await aria2API(
        "aria2.tellActive",
        [
          [
            "gid",
            "status",
            "files",
            "downloadSpeed",
            "bittorrent"
          ]
        ]
      )).result.filter(
        (task) => isNullOrUndefined(task.bittorrent)
      ).map(
        (task) => {
          let ID = aria2TaskExtractVideoID(task);
          if (!isNullOrUndefined(ID) && !ID.isEmpty()) {
            return {
              id: ID,
              data: task
            };
          }
        }
      )
    );
    let downloadCompleted = stoped.filter(
      (task) => task.data.status === "complete"
    ).unique("id");
    let startedAndCompleted = [...active, ...downloadCompleted].map((i3) => i3.id);
    for (let key of taskList.keysArray().intersect(startedAndCompleted)) {
      taskList.delete(key);
    }
  }
  async function analyzeDownloadTask(taskList = selectList) {
    let size = taskList.size;
    let node = renderNode({
      nodeType: "p",
      childs: `${i18nList[config.language].parsingProgress}[${taskList.size}/${size}]`
    });
    let parsingProgressToast = newToast(1, {
      node,
      duration: -1
    });
    function updateParsingProgress() {
      node.firstChild.textContent = `${i18nList[config.language].parsingProgress}[${taskList.size}/${size}]`;
    }
    parsingProgressToast.show();
    if (config.experimentalFeatures && config.downloadType === 0) {
      await downloadTaskUnique(taskList);
      updateParsingProgress();
    }
    for (let [id, info] of taskList) {
      await pushDownloadTask(await parseVideoInfo(info));
      taskList.delete(id);
      updateParsingProgress();
      !config.enableUnsafeMode && await delay(3e3);
    }
    parsingProgressToast.hide();
    newToast(
      1,
      {
        text: `%#allCompleted#%`,
        duration: -1,
        close: true,
        onClick() {
          this.hide();
        }
      }
    ).show();
  }
  async function pushDownloadTask(videoInfo, bypass = false) {
    switch (videoInfo.Type) {
      case "full":
        await db.putVideo(videoInfo);
        if (!bypass) {
          const authorInfo = await db.getFollowById(videoInfo.AuthorID);
          if (config.autoFollow && (!authorInfo?.following || !videoInfo.Following)) {
            await unlimitedFetch(
              `https://api.iwara.tv/user/${videoInfo.AuthorID}/followers`,
              {
                method: "POST",
                headers: await getAuth()
              },
              {
                retry: true,
                successStatus: 201,
                failStatuses: [404],
                onFail: async (res) => {
                  newToast(2, {
                    text: `${videoInfo.Alias} %#autoFollowFailed#% ${res.status}`,
                    close: true,
                    onClick() {
                      this.hide();
                    }
                  }).show();
                },
                onRetry: async () => {
                  await refreshToken();
                }
              }
            );
          }
          if (config.autoLike && !videoInfo.Liked) {
            await unlimitedFetch(
              `https://api.iwara.tv/video/${videoInfo.ID}/like`,
              {
                method: "POST",
                headers: await getAuth()
              },
              {
                retry: true,
                successStatus: 201,
                failStatuses: [404],
                onFail: async (res) => {
                  newToast(2, {
                    text: `${videoInfo.Alias} %#autoLikeFailed#% ${res.status}`,
                    close: true,
                    onClick() {
                      this.hide();
                    }
                  }).show();
                },
                onRetry: async () => {
                  await refreshToken();
                }
              }
            );
          }
          if (config.checkDownloadLink && checkIsHaveDownloadLink(`${videoInfo.Description} ${videoInfo.Comments}`)) {
            let toastBody = toastNode([
              `${videoInfo.Title}[${videoInfo.ID}] %#findedDownloadLink#%`,
              { nodeType: "br" },
              `%#openVideoLink#%`
            ], "%#createTask#%");
            newToast(
              2,
              {
                node: toastBody,
                close: config.autoCopySaveFileName,
                onClick() {
                  GM_openInTab(`https://www.iwara.tv/video/${videoInfo.ID}`, { active: false, insert: true, setParent: true });
                  if (config.autoCopySaveFileName) {
                    GM_setClipboard(getDownloadPath(videoInfo).fullName, "text");
                    toastBody.appendChild(renderNode({
                      nodeType: "p",
                      childs: "%#copySucceed#%"
                    }));
                  } else {
                    this.hide();
                  }
                }
              }
            ).show();
            return;
          }
        }
        if (config.checkPriority && videoInfo.DownloadQuality !== config.downloadPriority) {
          newToast(
            2,
            {
              node: toastNode([
                `${videoInfo.Title.truncate(64)}[${videoInfo.ID}] %#downloadQualityError#%`,
                { nodeType: "br" },
                `%#tryReparseDownload#%`
              ], "%#createTask#%"),
              async onClick() {
                this.hide();
                await pushDownloadTask(await parseVideoInfo(videoInfo));
              }
            }
          ).show();
          return;
        }
        switch (config.downloadType) {
          case 0:
            aria2Download(videoInfo);
            break;
          case 1:
            iwaradlDownload(videoInfo);
            break;
          case 2:
            browserDownload(videoInfo);
            break;
          default:
            othersDownload(videoInfo);
            break;
        }
        if (config.autoDownloadMetadata) {
          switch (config.downloadType) {
            case 3:
              othersDownloadMetadata(videoInfo);
              break;
            case 2:
              browserDownloadMetadata(videoInfo);
              break;
            default:
              break;
          }
          GM_getValue("isDebug") && originalConsole.debug("[Debug] Download task pushed:", videoInfo);
        }
        selectList.delete(videoInfo.ID);
        break;
      case "partial":
        const partialCache = await db.getVideoById(videoInfo.ID);
        if (!isNullOrUndefined(partialCache) && partialCache.Type !== "full") await db.putVideo(videoInfo);
      case "cache":
      case "init":
        return await pushDownloadTask(await parseVideoInfo(videoInfo));
      case "fail":
        const cache = await db.getVideoById(videoInfo.ID);
        newToast(
          3,
          {
            close: true,
            node: toastNode([
              `${videoInfo.Title ?? videoInfo.RAW?.title ?? cache?.RAW?.title}[${videoInfo.ID}] %#parsingFailed#%`,
              { nodeType: "br" },
              videoInfo.Msg,
              { nodeType: "br" },
              videoInfo.External ? `%#openVideoLink#%` : `%#tryReparseDownload#%`
            ], "%#createTask#%"),
            async onClick() {
              this.hide();
              if (videoInfo.External && !isNullOrUndefined(videoInfo.ExternalUrl) && !videoInfo.ExternalUrl.isEmpty()) {
                GM_openInTab(videoInfo.ExternalUrl, { active: false, insert: true, setParent: true });
              } else {
                await pushDownloadTask(await parseVideoInfo({ Type: "init", ID: videoInfo.ID, RAW: videoInfo.RAW ?? cache?.RAW }));
              }
            }
          }
        ).show();
        break;
      default:
        GM_getValue("isDebug") && originalConsole.debug("[Debug] Unknown type:", videoInfo);
        break;
    }
  }
  function uninjectCheckbox(element) {
    if (element instanceof HTMLElement) {
      if (element instanceof HTMLInputElement && element.classList.contains("selectButton")) {
        element.hasAttribute("videoID") && pageSelectButtons.delete(element.getAttribute("videoID"));
      }
      if (element.querySelector("input.selectButton")) {
        element.querySelectorAll(".selectButton").forEach((i3) => i3.hasAttribute("videoID") && pageSelectButtons.delete(i3.getAttribute("videoID")));
      }
    }
  }
  async function injectCheckbox(element) {
    let ID = element.querySelector("a.videoTeaser__thumbnail").href.toURL().pathname.split("/")[2];
    if (isNullOrUndefined(ID)) return;
    let info = await db.getVideoById(ID);
    let Title = info?.Type === "full" || info?.Type === "partial" ? info?.Title : info?.RAW?.title ?? element.querySelector(".videoTeaser__title")?.getAttribute("title") ?? void 0;
    let Alias = info?.Type === "full" || info?.Type === "partial" ? info?.Alias : info?.RAW?.user.name ?? element.querySelector("a.username")?.getAttribute("title") ?? void 0;
    let Author = info?.Type === "full" || info?.Type === "partial" ? info?.Author : info?.RAW?.user.username ?? element.querySelector("a.username")?.href.toURL().pathname.split("/").pop();
    let UploadTime = info?.Type === "full" || info?.Type === "partial" ? info?.UploadTime : new Date(info?.RAW?.updatedAt ?? 0).getTime();
    let button = renderNode({
      nodeType: "input",
      attributes: {
        type: "checkbox",
        videoID: ID,
        checked: selectList.has(ID) ? true : void 0,
        videoName: Title,
        videoAlias: Alias,
        videoAuthor: Author,
        videoUploadTime: UploadTime
      },
      className: "selectButton",
      events: {
        click: (event) => {
          event.target.checked ? selectList.set(ID, {
            Type: "init",
            ID,
            Title,
            Alias,
            Author,
            UploadTime
          }) : selectList.delete(ID);
          event.stopPropagation();
          event.stopImmediatePropagation();
          return false;
        }
      }
    });
    let item = element.querySelector(".videoTeaser__thumbnail")?.parentElement;
    item?.style.setProperty("position", "relative");
    pageSelectButtons.set(ID, button);
    originalNodeAppendChild.call(item, button);
    if (!isNullOrUndefined(Author)) {
      const AuthorInfo = await db.getFollowByUsername(Author);
      if (AuthorInfo?.following && element.querySelector(".videoTeaser__thumbnail")?.querySelector(".follow") === null) {
        originalNodeAppendChild.call(element.querySelector(".videoTeaser__thumbnail"), renderNode(
          {
            nodeType: "div",
            className: "follow",
            childs: {
              nodeType: "div",
              className: ["text", "text--white", "text--tiny", "text--bold"],
              childs: "%#following#%"
            }
          }
        ));
      }
    }
    if (getPageType() === "playlist") {
      let deletePlaylistItme = renderNode({
        nodeType: "button",
        attributes: {
          videoID: ID
        },
        childs: "%#delete#%",
        className: "deleteButton",
        events: {
          click: async (event) => {
            if ((await unlimitedFetch(`https://api.iwara.tv/playlist/${unsafeWindow.location.pathname.split("/")[2]}/${ID}`, {
              method: "DELETE",
              headers: await getAuth()
            })).ok) {
              newToast(1, { text: `${Title} %#deleteSucceed#%`, close: true }).show();
              deletePlaylistItme.remove();
            }
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
          }
        }
      });
      originalNodeAppendChild.call(item, deletePlaylistItme);
    }
  }
  var configEdit = class {
    source;
    target;
    interfacePage;
    interface;
    constructor(config2) {
      this.target = config2;
      this.target.configChange = (item) => {
        this.configChange.call(this, item);
      };
      this.interfacePage = renderNode({
        nodeType: "p"
      });
      let save = renderNode({
        nodeType: "button",
        childs: "%#save#%",
        attributes: {
          title: i18nList[config2.language].save
        },
        events: {
          click: async () => {
            save.disabled = !save.disabled;
            if (await check()) {
              unsafeWindow.location.reload();
            }
            save.disabled = !save.disabled;
          }
        }
      });
      let reset = renderNode({
        nodeType: "button",
        childs: "%#reset#%",
        attributes: {
          title: i18nList[config2.language].reset
        },
        events: {
          click: () => {
            GM_setValue("isFirstRun", true);
            unsafeWindow.location.reload();
          }
        }
      });
      this.interface = renderNode({
        nodeType: "div",
        attributes: {
          id: "pluginConfig"
        },
        childs: [
          {
            nodeType: "div",
            className: "main",
            childs: [
              {
                nodeType: "h2",
                childs: "%#appName#%"
              },
              {
                nodeType: "label",
                childs: [
                  "%#language#% ",
                  {
                    nodeType: "input",
                    className: "inputRadioLine",
                    attributes: {
                      name: "language",
                      type: "text",
                      value: this.target.language
                    },
                    events: {
                      change: (event) => {
                        this.target.language = event.target.value;
                      }
                    }
                  }
                ]
              },
              this.downloadTypeSelect(),
              this.interfacePage,
              this.switchButton("checkPriority"),
              this.switchButton("checkDownloadLink"),
              this.switchButton("autoFollow"),
              this.switchButton("autoLike"),
              this.switchButton("filterLikedVideos"),
              this.switchButton("autoInjectCheckbox"),
              this.switchButton("autoDownloadMetadata"),
              this.switchButton("autoCopySaveFileName"),
              this.switchButton("addUnlistedAndPrivate"),
              this.switchButton("experimentalFeatures"),
              this.switchButton("enableUnsafeMode"),
              this.switchButton("isDebug", GM_getValue, (name, e) => {
                GM_setValue(name, e.target.checked);
                unsafeWindow.location.reload();
              }, false)
            ]
          },
          {
            nodeType: "p",
            className: "buttonList",
            childs: [
              reset,
              save
            ]
          }
        ]
      });
    }
    switchButton(name, get, set, defaultValue) {
      return renderNode({
        nodeType: "p",
        className: "inputRadioLine",
        childs: [
          {
            nodeType: "label",
            childs: `%#${name}#%`,
            attributes: {
              for: name
            }
          },
          {
            nodeType: "input",
            className: "switch",
            attributes: {
              type: "checkbox",
              name,
              checked: get !== void 0 ? get(name, defaultValue) : this.target[name] ?? defaultValue ?? false
            },
            events: {
              change: (e) => {
                if (set !== void 0) {
                  set(name, e);
                  return;
                } else {
                  this.target[name] = e.target.checked;
                }
              }
            }
          }
        ]
      });
    }
    inputComponent(name, type, help, get, set) {
      return renderNode({
        nodeType: "label",
        childs: [
          {
            nodeType: "span",
            childs: [
              `%#${name}#%`,
              help
            ]
          },
          {
            nodeType: "input",
            attributes: {
              name,
              type: type ?? "text",
              value: get !== void 0 ? get(name) : this.target[name]
            },
            events: {
              change: (e) => {
                if (set !== void 0) {
                  set(name, e);
                  return;
                } else {
                  this.target[name] = e.target.value;
                }
              }
            }
          }
        ]
      });
    }
    downloadTypeSelect() {
      return renderNode({
        nodeType: "fieldset",
        childs: [
          {
            nodeType: "legend",
            childs: "%#downloadType#%"
          },
          ...Object.keys(DownloadType).filter((i3) => isNaN(Number(i3))).map(
            (type, index) => renderNode({
              nodeType: "label",
              childs: [
                {
                  nodeType: "input",
                  attributes: {
                    type: "radio",
                    name: "downloadType",
                    value: index,
                    checked: index === Number(this.target.downloadType)
                  },
                  events: {
                    change: (e) => {
                      this.target.downloadType = Number(e.target.value);
                    }
                  }
                },
                type
              ]
            })
          )
        ]
      });
    }
    configChange(item) {
      switch (item) {
        case "downloadType":
          const radios = this.interface.querySelectorAll(`[name=${item}]`);
          radios.forEach((radio) => {
            radio.checked = Number(radio.value) === Number(this.target.downloadType);
          });
          this.pageChange();
          break;
        case "checkPriority":
          this.pageChange();
          break;
        default:
          let element = this.interface.querySelector(`[name=${item}]`);
          if (element) {
            switch (element.type) {
              case "radio":
                element.value = this.target[item];
                break;
              case "checkbox":
                element.checked = this.target[item];
                break;
              case "text":
              case "password":
                element.value = this.target[item];
                break;
              default:
                break;
            }
          }
          break;
      }
    }
    pageChange() {
      while (this.interfacePage.hasChildNodes()) {
        this.interfacePage.removeChild(this.interfacePage.firstChild);
      }
      let downloadConfigInput = [
        this.inputComponent("downloadPath", "text", renderNode({
          nodeType: "a",
          childs: "%#variable#%",
          className: "rainbow-text",
          attributes: {
            style: "float: inline-end;",
            href: "https://github.com/dawn-lc/IwaraDownloadTool/wiki/路径可用变量"
          }
        }))
      ];
      let proxyConfigInput = [
        this.inputComponent("downloadProxy"),
        this.inputComponent("downloadProxyUsername"),
        this.inputComponent("downloadProxyPassword", "password")
      ];
      let aria2ConfigInput = [
        this.inputComponent("aria2Path"),
        this.inputComponent("aria2Token", "password"),
        ...proxyConfigInput
      ];
      let iwaradlConfigInput = [
        this.inputComponent("iwaradlPath"),
        this.inputComponent("iwaradlToken", "password"),
        ...proxyConfigInput
      ];
      switch (this.target.downloadType) {
        case 0:
          downloadConfigInput.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          aria2ConfigInput.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          break;
        case 1:
          downloadConfigInput.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          iwaradlConfigInput.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          break;
        default:
          downloadConfigInput.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          break;
      }
      if (this.target.checkPriority) {
        originalNodeAppendChild.call(this.interfacePage, this.inputComponent("downloadPriority"));
      }
    }
    inject() {
      if (!unsafeWindow.document.querySelector("#pluginConfig")) {
        originalNodeAppendChild.call(unsafeWindow.document.body, this.interface);
        this.configChange("downloadType");
      }
    }
  };
  var menu = class {
    observer;
    pageType;
    interface;
    interfacePage;
    constructor() {
      let body = new Proxy(this, {
        set: (target, prop, value) => {
          if (prop === "pageType") {
            if (isNullOrUndefined(value) || this.pageType === value) return true;
            target[prop] = value;
            this.pageChange();
            GM_getValue("isDebug") && originalConsole.debug(`[Debug] Page change to ${this.pageType}`);
            return true;
          }
          return target[prop] = value;
        }
      });
      body.interfacePage = renderNode({
        nodeType: "ul"
      });
      body.interface = renderNode({
        nodeType: "div",
        attributes: {
          id: "pluginMenu"
        },
        childs: body.interfacePage
      });
      let mouseoutTimer = null;
      originalAddEventListener.call(body.interface, "mouseover", (event) => {
        if (mouseoutTimer !== null) {
          clearTimeout(mouseoutTimer);
          mouseoutTimer = null;
        }
        body.interface.classList.add("expanded");
      });
      originalAddEventListener.call(body.interface, "mouseout", (event) => {
        const e = event;
        const relatedTarget = e.relatedTarget;
        if (relatedTarget && body.interface.contains(relatedTarget)) {
          return;
        }
        mouseoutTimer = setTimeout(() => {
          body.interface.classList.remove("expanded");
          mouseoutTimer = null;
        }, 300);
      });
      originalAddEventListener.call(body.interface, "click", (event) => {
        if (event.target === body.interface) {
          body.interface.classList.toggle("expanded");
        }
      });
      body.observer = new MutationObserver((mutationsList) => body.pageType = getPageType(mutationsList) ?? body.pageType);
      body.pageType = "page";
      return body;
    }
    button(name, click) {
      return renderNode({
        nodeType: "li",
        childs: `%#${name}#%`,
        events: {
          click: (event) => {
            !isNullOrUndefined(click) && click(name, event);
            event.stopPropagation();
            return false;
          }
        }
      });
    }
    async parseUnlistedAndPrivate() {
      if (!isLoggedIn()) return;
      const lastMonthTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1e3;
      const thisMonthUnlistedAndPrivateVideos = await db.getFilteredVideos(lastMonthTimestamp, Infinity);
      let parseUnlistedAndPrivateVideos = [];
      let pageCount = 0;
      const MAX_FIND_PAGES = 64;
      GM_getValue("isDebug") && originalConsole.debug(`[Debug] Starting fetch loop. MAX_PAGES=${MAX_FIND_PAGES}`);
      while (pageCount < MAX_FIND_PAGES) {
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] Fetching page ${pageCount}.`);
        const response = await unlimitedFetch(
          `https://api.iwara.tv/videos?subscribed=true&limit=50&rating=${rating()}&page=${pageCount}`,
          { method: "GET", headers: await getAuth() },
          {
            retry: true,
            retryDelay: 1e3,
            onRetry: async () => {
              await refreshToken();
            }
          }
        );
        GM_getValue("isDebug") && originalConsole.debug("[Debug] Received response, parsing JSON.");
        const data = (await response.json()).results;
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] Page ${pageCount} returned ${data.length} videos.`);
        data.forEach((info) => info.user.following = true);
        const videoPromises = data.map((info) => parseVideoInfo({
          Type: "cache",
          ID: info.id,
          RAW: info
        }));
        GM_getValue("isDebug") && originalConsole.debug("[Debug] Initializing VideoInfo promises.");
        const videoInfos = await Promise.all(videoPromises);
        parseUnlistedAndPrivateVideos.push(...videoInfos);
        let test = videoInfos.filter((i3) => i3.Type === "partial" && (i3.Private || i3.Unlisted)).any();
        GM_getValue("isDebug") && originalConsole.debug("[Debug] All VideoInfo objects initialized.");
        if (test && thisMonthUnlistedAndPrivateVideos.intersect(videoInfos, "ID").any()) {
          GM_getValue("isDebug") && originalConsole.debug(`[Debug] Found private video on page ${pageCount}.`);
          break;
        }
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] Latest private video not found on page ${pageCount}, continuing.`);
        pageCount++;
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] Incremented page to ${pageCount}, delaying next fetch.`);
        await delay(100);
      }
      GM_getValue("isDebug") && originalConsole.debug("[Debug] Fetch loop ended. Start updating the database");
      const existingVideos = await db.getVideosByIds(parseUnlistedAndPrivateVideos.map((v2) => v2.ID));
      const toUpdate = parseUnlistedAndPrivateVideos.difference(
        existingVideos.filter((v2) => v2.Type === "full"),
        "ID"
      );
      if (toUpdate.any()) {
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] Need to update ${toUpdate.length} pieces of data.`);
        await db.bulkPutVideos(toUpdate);
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] Update Completed.`);
      } else {
        GM_getValue("isDebug") && originalConsole.debug(`[Debug] No need to update data.`);
      }
    }
    async pageChange() {
      while (this.interfacePage.hasChildNodes()) {
        this.interfacePage.removeChild(this.interfacePage.firstChild);
      }
      let manualDownloadButton = this.button("manualDownload", (name, event) => {
        addDownloadTask();
      });
      let settingsButton = this.button("settings", (name, event) => {
        editConfig.inject();
      });
      let exportConfigButton = this.button("exportConfig", (name, event) => {
        GM_setClipboard(stringify(config));
        newToast(
          1,
          {
            node: toastNode(i18nList[config.language].exportConfigSucceed),
            duration: 3e3,
            gravity: "bottom",
            position: "center",
            onClick() {
              this.hide();
            }
          }
        ).show();
      });
      let baseButtons = [
        manualDownloadButton,
        exportConfigButton,
        settingsButton
      ];
      let injectCheckboxButton = this.button("injectCheckbox", (name, event) => {
        if (unsafeWindow.document.querySelector(".selectButton")) {
          unsafeWindow.document.querySelectorAll(".selectButton").forEach((element) => {
            element.remove();
          });
        } else {
          unsafeWindow.document.querySelectorAll(`.videoTeaser`).forEach((element) => {
            injectCheckbox(element);
          });
        }
      });
      let deselectAllButton = this.button("deselectAll", (name, event) => {
        for (const id of selectList.keys()) {
          selectList.delete(id);
        }
      });
      let reverseSelectButton = this.button("reverseSelect", (name, event) => {
        unsafeWindow.document.querySelectorAll(".selectButton").forEach((element) => {
          element.click();
        });
      });
      let selectThisButton = this.button("selectThis", (name, event) => {
        unsafeWindow.document.querySelectorAll(".selectButton").forEach((element) => {
          let button = element;
          !button.checked && button.click();
        });
      });
      let deselectThisButton = this.button("deselectThis", (name, event) => {
        unsafeWindow.document.querySelectorAll(".selectButton").forEach((element) => {
          let button = element;
          button.checked && button.click();
        });
      });
      let downloadSelectedButton = this.button("downloadSelected", (name, event) => {
        analyzeDownloadTask();
        newToast(1, {
          text: `%#${name}#%`,
          close: true
        }).show();
      });
      let selectButtons = [
        injectCheckboxButton,
        deselectAllButton,
        reverseSelectButton,
        selectThisButton,
        deselectThisButton,
        downloadSelectedButton
      ];
      let downloadThisButton = this.button("downloadThis", async (name, event) => {
        let ID = unsafeWindow.location.href.toURL().pathname.split("/")[2];
        await pushDownloadTask(await parseVideoInfo({
          Type: "init",
          ID
        }), true);
      });
      let aria2TaskCheckButton = this.button("aria2TaskCheck", (name, event) => {
        aria2TaskCheckAndRestart();
      });
      config.experimentalFeatures && originalNodeAppendChild.call(this.interfacePage, aria2TaskCheckButton);
      switch (this.pageType) {
        case "video":
          originalNodeAppendChild.call(this.interfacePage, downloadThisButton);
          selectButtons.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          baseButtons.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          break;
        case "search":
        case "profile":
        case "home":
        case "videoList":
        case "subscriptions":
        case "playlist":
        case "favorites":
        case "account":
          selectButtons.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          baseButtons.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          break;
        case "page":
        case "forum":
        case "image":
        case "imageList":
        case "forumSection":
        case "forumThread":
        default:
          baseButtons.map((i3) => originalNodeAppendChild.call(this.interfacePage, i3));
          break;
      }
      if (config.addUnlistedAndPrivate && this.pageType === "videoList") {
        this.parseUnlistedAndPrivate();
      } else {
        GM_getValue("isDebug") && originalConsole.debug("[Debug] Conditions not met: addUnlistedAndPrivate or pageType mismatch.");
      }
    }
    inject() {
      this.observer.observe(unsafeWindow.document.getElementById("app"), { childList: true, subtree: true });
      if (!unsafeWindow.document.querySelector("#pluginMenu")) {
        originalNodeAppendChild.call(unsafeWindow.document.body, this.interface);
        this.pageType = getPageType() ?? this.pageType;
      }
    }
  };
  var waterMark = class {
    debugSwitchCount = 0;
    selected = renderNode({
      nodeType: "span",
      childs: ` %#selected#% ${selectList.size} `
    });
    debugFlag = renderNode({
      nodeType: "span",
      childs: `${GM_getValue("isDebug") ? `${i18nList[config.language].isDebug} ${GM_info.scriptHandler}` : ""}`
    });
    bdoy = renderNode({
      nodeType: "p",
      className: "fixed-bottom-right",
      childs: [
        `%#appName#% ${GM_getValue("version")} `,
        this.selected,
        this.debugFlag
      ],
      events: {
        click: (e) => {
          if (GM_getValue("isDebug")) return;
          if (this.debugSwitchCount < 5) {
            this.debugSwitchCount++;
            return;
          } else {
            GM_setValue("isDebug", true);
            this.debugFlag.textContent = `${GM_getValue("isDebug") ? i18nList[config.language].isDebug : ""}`;
            unsafeWindow.location.reload();
          }
        }
      }
    });
    constructor() {
      return this;
    }
    inject() {
      originalNodeAppendChild.call(unsafeWindow.document.body, this.bdoy);
    }
  };
  function handleAuthorizationHeader(init) {
    if (!init || !init.headers) return;
    let authorization = null;
    if (init.headers instanceof Headers) {
      authorization = init.headers.has("Authorization") ? init.headers.get("Authorization") : null;
    } else if (Array.isArray(init.headers)) {
      const index = init.headers.findIndex(([key]) => key.toLowerCase() === "authorization");
      if (index >= 0) authorization = init.headers[index][1];
    } else if (typeof init.headers === "object") {
      for (const key in init.headers) {
        if (key.toLowerCase() === "authorization") {
          authorization = init.headers[key];
          break;
        }
      }
    }
    if (!authorization) return;
    const payload = getPlayload(authorization);
    const token = authorization.split(" ").pop();
    if (payload["type"] === "refresh_token" && !isUndefined(token)) {
      localStorage.setItem("token", token);
      config.authorization = token;
      GM_getValue("isDebug") && originalConsole.debug(`[Debug] refresh_token: 凭证已隐藏`);
    }
  }
  async function handleUserTokenResponse(response) {
    const cloneResponse = response.clone();
    if (!cloneResponse.ok) return;
    const { accessToken } = await cloneResponse.json();
    const token = localStorage.getItem("accessToken");
    if (isNull(token) || token !== accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  }
  async function handleVideosResponse(response, url) {
    const cloneResponse = response.clone();
    if (!cloneResponse.ok) return response;
    const cloneBody = await cloneResponse.json();
    const rawVideos = cloneBody.results;
    const parsePromises = rawVideos.map(
      (info) => parseVideoInfo({ Type: "cache", ID: info.id, RAW: info })
    );
    const settled = await Promise.allSettled(parsePromises);
    const list = settled.filter((i3) => i3.status === "fulfilled").map((i3) => i3.value).filter((i3) => i3.Type === "partial" || i3.Type === "full");
    const ids = list.map((v2) => v2.ID);
    const existing = await db.getVideosByIds(ids);
    const fullVideos = existing.filter((v2) => v2.Type === "full");
    const toUpdate = list.difference(fullVideos, "ID");
    if (toUpdate.any()) {
      await db.bulkPutVideos(toUpdate);
    }
    if (config.filterLikedVideos) {
      cloneBody.results = rawVideos.filter((i3) => !i3.liked);
    }
    if (!config.addUnlistedAndPrivate) return response;
    if (url.searchParams.has("user")) return response;
    if (url.searchParams.has("subscribed")) return response;
    if (url.searchParams.has("sort") && url.searchParams.get("sort") !== "date") return response;
    const sortedList = list.sort((a3, b2) => a3.UploadTime - b2.UploadTime);
    if (sortedList.length === 0) return response;
    const minTime = sortedList[0].UploadTime;
    const maxTime = sortedList[sortedList.length - 1].UploadTime;
    const startTime = new Date(minTime).sub({ hours: 4 }).getTime();
    const endTime = new Date(maxTime).add({ hours: 4 }).getTime();
    const cacheVideos = (await db.getFilteredVideos(startTime, endTime)).filter((i3) => i3.Type === "partial" || i3.Type === "full").sort((a3, b2) => b2.UploadTime - a3.UploadTime).map((i3) => i3.RAW);
    cloneBody.results.push(...cacheVideos);
    cloneBody.count += cacheVideos.length;
    cloneBody.limit += cacheVideos.length;
    return new Response(JSON.stringify(cloneBody), {
      status: cloneResponse.status,
      statusText: cloneResponse.statusText,
      headers: Object.fromEntries(cloneResponse.headers.entries())
    });
  }
  function createInterceptedFetch() {
    return async function(input, init) {
      GM_getValue("isDebug") && originalConsole.debug(`[Debug] Fetch ${input}`);
      const url = (input instanceof Request ? input.url : input instanceof URL ? input.href : input).toURL();
      if (!isUndefined(init) && init.headers) {
        handleAuthorizationHeader(init);
      }
      return new Promise(
        (resolve, reject) => originalFetch(input, init).then(async (response) => {
          if (!url.pathname.isEmpty()) {
            const path = url.pathname.toLowerCase().split("/").slice(1);
            if (url.hostname === "api.iwara.tv") {
              switch (path[0]) {
                case "user":
                  if (path[1] === "token") await handleUserTokenResponse(response);
                  break;
                case "videos":
                  return resolve(await handleVideosResponse(response, url));
                default:
                  break;
              }
            }
          }
          return resolve(response);
        }).catch((err) => reject(err))
      );
    };
  }
  var main_default = '@keyframes rainbow-horizontal{0%{background-position:0% 0%}to{background-position:200% 0%}}@keyframes rainbow-vertical{0%{background-position:0% 0%}to{background-position:0% 200%}}.rainbow-text{background-image:linear-gradient(to right,#ff4040,#ffff40,#40ff40,#40ffff,#4040ff,#ff40ff,#ff4040);background-size:200% 100%;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:rainbow-horizontal .8s infinite linear;font-weight:700}#pluginMenu{z-index:2147483644;position:fixed;top:50%;right:0;padding:10px 26px;background-color:var(--body-dark);border:1px solid var(--text);border-radius:5px;box-shadow:0 0 10px var(--text);transform:translate(calc(100% - 26px)) translateY(-50%);transition:transform .3s ease-in-out}#pluginMenu:not(.expanded){overflow:visible}#pluginMenu:not(.expanded):before{content:"";mask:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIj48cGF0aCBkPSJNNTYwLTI0MCAzMjAtNDgwbDI0MC0yNDAgNTYgNTYtMTg0IDE4NCAxODQgMTg0LTU2IDU2WiIvPjwvc3ZnPg==) no-repeat center;-webkit-mask:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIj48cGF0aCBkPSJNNTYwLTI0MCAzMjAtNDgwbDI0MC0yNDAgNTYgNTYtMTg0IDE4NCAxODQgMTg0LTU2IDU2WiIvPjwvc3ZnPg==) no-repeat center;background-color:var(--text);width:24px;height:24px;position:absolute;left:0;top:50%;line-height:0;transform:translateY(-50%)}#pluginMenu.expanded{transform:translate(0) translateY(-50%)}#pluginMenu ul{list-style:none;margin:0;padding:0}#pluginMenu li{padding:5px 10px;cursor:pointer;text-align:center;user-select:none;color:var(--text)}#pluginMenu li:hover{background-color:var(--primary-dark);border-radius:3px}#pluginConfig{color:var(--text);position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000000bf;z-index:2147483646;display:flex;flex-direction:column;align-items:center;justify-content:center}#pluginConfig .main{background-color:var(--body);padding:24px;margin:10px;overflow-y:auto;width:480px}#pluginConfig .buttonList{display:flex;flex-direction:row;justify-content:center}@media(max-width:640px){#pluginConfig .main{width:100%;height:80%}}#pluginConfig button{background-color:var(--primary);margin:0 20px;padding:10px 20px;color:var(--primary-text);font-size:18px;border:none;border-radius:4px;cursor:pointer}#pluginConfig button{background-color:var(--primary)}#pluginConfig button[disabled]{background-color:var(--muted);cursor:not-allowed}#pluginConfig p{display:flex;flex-direction:column;margin-top:10px;margin-bottom:0}#pluginConfig fieldset{border:none;margin:10px 0 0;padding:0;display:flex;justify-content:space-between;flex-wrap:nowrap}#pluginConfig fieldset>legend{margin:0 0 5px;padding:0}#pluginConfig fieldset>label{text-align:center}#pluginConfig p label{display:flex;flex-direction:column;margin:5px 0 0}#pluginConfig .inputRadioLine{display:flex;align-items:center;flex-direction:row;justify-content:space-between}#pluginConfig input[type=text],#pluginConfig input[type=password]{outline:none;border-top:none;border-right:none;border-left:none;border-image:initial;border-bottom:1px solid var(--muted);line-height:1;height:30px;box-sizing:border-box;width:100%;background-color:var(--body);color:var(--text)}#pluginConfig input[type=checkbox].switch{outline:none;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:20px;background:var(--muted);border-radius:10px;transition:border-color .2s,background-color .2s}#pluginConfig input[type=checkbox].switch:after{content:"";display:inline-block;width:40%;height:80%;border-radius:50%;background:var(--white);box-shadow:0,0,2px,var(--muted);transition:.2s;top:2px;position:absolute;right:55%}#pluginConfig input[type=checkbox].switch:checked{background:var(--success)}#pluginConfig input[type=checkbox].switch:checked:after{content:"";position:absolute;right:2px;top:2px}#pluginOverlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000000bf;z-index:2147483645;display:flex;flex-direction:column;align-items:center;justify-content:center}#pluginOverlay .main{color:var(--text);font-size:24px;width:60%;background-color:var(--body);padding:24px;margin:10px;overflow-y:auto}@media(max-width:640px){#pluginOverlay .main{width:100%}}#pluginOverlay button{padding:10px 20px;color:var(--primary-text);font-size:18px;border:none;border-radius:4px;cursor:pointer}#pluginOverlay button{background-color:var(--primary)}#pluginOverlay button[disabled]{background-color:var(--muted);cursor:not-allowed}#pluginOverlay .checkbox{width:32px;height:32px;margin:0 4px 0 0;padding:0}#pluginOverlay .checkbox-container{display:flex;align-items:center;margin:0 0 10px}#pluginOverlay .checkbox-label{color:var(--text);font-size:32px;font-weight:700;margin-left:10px;display:flex;align-items:center}.fixed-bottom-right{position:fixed;bottom:0;right:0;background-color:var(--body);color:var(--text);border-top:1px solid var(--primary);border-left:1px solid var(--primary);border-top-left-radius:6px;padding:2px 5px;margin:0;user-select:none;z-index:102}.follow{bottom:24px;right:2px;border-radius:2px;position:absolute;padding:3px 5px;background-color:#000c;pointer-events:none}.selectButton{accent-color:var(--primary);position:absolute;width:38px;height:38px;right:0;cursor:pointer;z-index:102;top:22px}.deleteButton{accent-color:var(--danger);position:absolute;width:38px;height:38px;left:0;cursor:pointer;z-index:101;border:none;padding:0;margin:3px;top:22px}.toast h3{margin:0 0 10px}.toast p{margin:0}.offscreen-container{position:absolute;visibility:hidden;pointer-events:none;max-width:480px}.toast-container{isolation:isolate;position:fixed;z-index:2147483647;display:flex;flex-direction:column;box-sizing:border-box;transition:transform calc(.6 * var(--toast-rate) * 1s) ease,opacity calc(.6 * var(--toast-rate) * 1s) ease}.toast-container.toast-top{top:0}.toast-container.toast-bottom{bottom:0}.toast-container.toast-left{left:0;align-items:flex-start}.toast-container.toast-center{left:50%;transform:translate(-50%);align-items:center}.toast-container.toast-right{right:0;align-items:flex-end}#toast-container-top-left .toast{margin:10px 0 0 10px;transform-origin:left center}#toast-container-top-center .toast{margin:10px 0 0;transform-origin:top}#toast-container-top-right .toast{margin:10px 10px 0 0;transform-origin:right center}#toast-container-bottom-left .toast{margin:0 0 10px 10px;transform-origin:left center}#toast-container-bottom-center .toast{margin:0 0 10px;transform-origin:bottom}#toast-container-bottom-right .toast{margin:0 10px 10px 0;transform-origin:right center}.toast{--toast-rate: 1;--toast-translate: 0;--toast-scale: 1;position:relative;transition:transform calc(.4s * var(--toast-rate)) cubic-bezier(.34,1.56,.64,1),opacity calc(.3s * var(--toast-rate)) ease;transform:translate3d(0,var(--toast-translate),0) scale(var(--toast-scale));max-width:480px;max-height:0px;will-change:transform,opacity;backface-visibility:hidden;contain:content;border-radius:6px;box-shadow:0 4px 8px #00000040}.toast-close{position:absolute;color:var(--text);top:5px;right:5px;cursor:pointer;font-size:12px;line-height:12px;z-index:2147483648;transform-origin:center center}.toast-content{border-radius:6px;padding:14px 18px;max-width:100%;box-sizing:border-box;background:var(--primary);color:var(--primary-text);cursor:pointer;white-space:normal;word-break:break-all;overflow:hidden;position:relative}.toast-progress{position:absolute;bottom:0;left:0;right:0;height:4px;background:#fffc;transform:scaleX(var(--toast-progress, 0));transition:transform calc(.05s * var(--toast-rate)) linear;will-change:transform;backface-visibility:hidden}.toast:hover{z-index:2147483648;--toast-scale: 1.15}.toast-container.toast-left .toast .toast-content .toast-progress{transform-origin:left}.toast-container.toast-center .toast .toast-content .toast-progress{transform-origin:center}.toast-container.toast-right .toast .toast-content .toast-progress{transform-origin:right}.toast-container.toast-top .toast.show{animation:toast-in-top calc(.3 * var(--toast-rate) * 1s) ease-in-out forwards}.toast-container.toast-bottom .toast.show{animation:toast-in-bottom calc(.3 * var(--toast-rate) * 1s) ease-in-out forwards}.toast-container.toast-top .toast.hide{animation:toast-out-top calc(.3 * var(--toast-rate) * 1s) ease-in-out forwards}.toast-container.toast-bottom .toast.hide{animation:toast-out-bottom calc(.3 * var(--toast-rate) * 1s) ease-in-out forwards}@keyframes toast-in-top{0%{opacity:0;max-height:0px}to{max-height:var(--toast-height)}}@keyframes toast-in-bottom{0%{opacity:0;max-height:0px}to{max-height:var(--toast-height)}}@keyframes toast-out-top{0%{max-height:var(--toast-height)}to{opacity:0;max-height:0px}}@keyframes toast-out-bottom{0%{max-height:var(--toast-height)}to{opacity:0;max-height:0px}}\n';
  function r(t2, n5) {
    return t2.endsWith(n5) ? t2.length === n5.length || t2[t2.length - n5.length - 1] === "." : false;
  }
  function u(t2, n5) {
    const l2 = t2.length - n5.length - 2, i3 = t2.lastIndexOf(".", l2);
    return i3 === -1 ? t2 : t2.slice(i3 + 1);
  }
  function g2(t2, n5, l2) {
    if (l2.validHosts !== null) {
      const f2 = l2.validHosts;
      for (const e of f2) if (r(n5, e)) return e;
    }
    let i3 = 0;
    if (n5.startsWith(".")) for (; i3 < n5.length && n5[i3] === "."; ) i3 += 1;
    return t2.length === n5.length - i3 ? null : u(n5, t2);
  }
  function i(t2, e) {
    return t2.slice(0, -e.length - 1);
  }
  function g3(t2, x2) {
    let e = 0, o = t2.length, l2 = false;
    if (!x2) {
      if (t2.startsWith("data:")) return null;
      for (; e < t2.length && t2.charCodeAt(e) <= 32; ) e += 1;
      for (; o > e + 1 && t2.charCodeAt(o - 1) <= 32; ) o -= 1;
      if (t2.charCodeAt(e) === 47 && t2.charCodeAt(e + 1) === 47) e += 2;
      else {
        const c2 = t2.indexOf(":/", e);
        if (c2 !== -1) {
          const i3 = c2 - e, a3 = t2.charCodeAt(e), d = t2.charCodeAt(e + 1), r2 = t2.charCodeAt(e + 2), w2 = t2.charCodeAt(e + 3), O2 = t2.charCodeAt(e + 4);
          if (!(i3 === 5 && a3 === 104 && d === 116 && r2 === 116 && w2 === 112 && O2 === 115)) {
            if (!(i3 === 4 && a3 === 104 && d === 116 && r2 === 116 && w2 === 112)) {
              if (!(i3 === 3 && a3 === 119 && d === 115 && r2 === 115)) {
                if (!(i3 === 2 && a3 === 119 && d === 115)) for (let C2 = e; C2 < c2; C2 += 1) {
                  const n5 = t2.charCodeAt(C2) | 32;
                  if (!(n5 >= 97 && n5 <= 122 || n5 >= 48 && n5 <= 57 || n5 === 46 || n5 === 45 || n5 === 43)) return null;
                }
              }
            }
          }
          for (e = c2 + 2; t2.charCodeAt(e) === 47; ) e += 1;
        }
      }
      let s = -1, h2 = -1, f2 = -1;
      for (let c2 = e; c2 < o; c2 += 1) {
        const i3 = t2.charCodeAt(c2);
        if (i3 === 35 || i3 === 47 || i3 === 63) {
          o = c2;
          break;
        } else i3 === 64 ? s = c2 : i3 === 93 ? h2 = c2 : i3 === 58 ? f2 = c2 : i3 >= 65 && i3 <= 90 && (l2 = true);
      }
      if (s !== -1 && s > e && s < o && (e = s + 1), t2.charCodeAt(e) === 91) return h2 !== -1 ? t2.slice(e + 1, h2).toLowerCase() : null;
      f2 !== -1 && f2 > e && f2 < o && (o = f2);
    }
    for (; o > e + 1 && t2.charCodeAt(o - 1) === 46; ) o -= 1;
    const A2 = e !== 0 || o !== t2.length ? t2.slice(e, o) : t2;
    return l2 ? A2.toLowerCase() : A2;
  }
  function i2(e) {
    if (e.length < 7 || e.length > 15) return false;
    let t2 = 0;
    for (let r2 = 0; r2 < e.length; r2 += 1) {
      const f2 = e.charCodeAt(r2);
      if (f2 === 46) t2 += 1;
      else if (f2 < 48 || f2 > 57) return false;
    }
    return t2 === 3 && e.charCodeAt(0) !== 46 && e.charCodeAt(e.length - 1) !== 46;
  }
  function n(e) {
    if (e.length < 3) return false;
    let t2 = e.startsWith("[") ? 1 : 0, r2 = e.length;
    if (e[r2 - 1] === "]" && (r2 -= 1), r2 - t2 > 39) return false;
    let f2 = false;
    for (; t2 < r2; t2 += 1) {
      const l2 = e.charCodeAt(t2);
      if (l2 === 58) f2 = true;
      else if (!(l2 >= 48 && l2 <= 57 || l2 >= 97 && l2 <= 102 || l2 >= 65 && l2 <= 90)) return false;
    }
    return f2;
  }
  function u2(e) {
    return n(e) || i2(e);
  }
  function n2(r2) {
    return r2 >= 97 && r2 <= 122 || r2 >= 48 && r2 <= 57 || r2 > 127;
  }
  function is_valid_default(r2) {
    if (r2.length > 255 || r2.length === 0 || !n2(r2.charCodeAt(0)) && r2.charCodeAt(0) !== 46 && r2.charCodeAt(0) !== 95) return false;
    let f2 = -1, e = -1;
    const i3 = r2.length;
    for (let t2 = 0; t2 < i3; t2 += 1) {
      const l2 = r2.charCodeAt(t2);
      if (l2 === 46) {
        if (t2 - f2 > 64 || e === 46 || e === 45 || e === 95) return false;
        f2 = t2;
      } else if (!(n2(l2) || l2 === 45 || l2 === 95)) return false;
      e = l2;
    }
    return i3 - f2 - 1 <= 63 && e !== 45;
  }
  function t({ allowIcannDomains: e = true, allowPrivateDomains: u3 = false, detectIp: r2 = true, extractHostname: n5 = true, mixedInputs: f2 = true, validHosts: l2 = null, validateHostname: s = true }) {
    return { allowIcannDomains: e, allowPrivateDomains: u3, detectIp: r2, extractHostname: n5, mixedInputs: f2, validHosts: l2, validateHostname: s };
  }
  var a2 = t({});
  function setDefaults(e) {
    return e === void 0 ? a2 : t(e);
  }
  function n3(e, t2) {
    return t2.length === e.length ? "" : e.slice(0, -t2.length - 1);
  }
  function getEmptyResult() {
    return { domain: null, domainWithoutSuffix: null, hostname: null, isIcann: null, isIp: null, isPrivate: null, publicSuffix: null, subdomain: null };
  }
  function resetResult(i3) {
    i3.domain = null, i3.domainWithoutSuffix = null, i3.hostname = null, i3.isIcann = null, i3.isIp = null, i3.isPrivate = null, i3.publicSuffix = null, i3.subdomain = null;
  }
  function parseImpl(i3, m2, t2, p3, n5) {
    const o = setDefaults(p3);
    return typeof i3 != "string" || (o.extractHostname ? o.mixedInputs ? n5.hostname = g3(i3, is_valid_default(i3)) : n5.hostname = g3(i3, false) : n5.hostname = i3, o.detectIp && n5.hostname !== null && (n5.isIp = u2(n5.hostname), n5.isIp)) ? n5 : o.validateHostname && o.extractHostname && n5.hostname !== null && !is_valid_default(n5.hostname) ? (n5.hostname = null, n5) : (m2 === 0 || n5.hostname === null || (t2(n5.hostname, o, n5), m2 === 2 || n5.publicSuffix === null) || (n5.domain = g2(n5.publicSuffix, n5.hostname, o), m2 === 3 || n5.domain === null) || (n5.subdomain = n3(n5.hostname, n5.domain), m2 === 4) || (n5.domainWithoutSuffix = i(n5.domain, n5.publicSuffix)), n5);
  }
  function fast_path_default(i3, l2, e) {
    if (!l2.allowPrivateDomains && i3.length > 3) {
      const n5 = i3.length - 1, r2 = i3.charCodeAt(n5), f2 = i3.charCodeAt(n5 - 1), c2 = i3.charCodeAt(n5 - 2), s = i3.charCodeAt(n5 - 3);
      if (r2 === 109 && f2 === 111 && c2 === 99 && s === 46) return e.isIcann = true, e.isPrivate = false, e.publicSuffix = "com", true;
      if (r2 === 103 && f2 === 114 && c2 === 111 && s === 46) return e.isIcann = true, e.isPrivate = false, e.publicSuffix = "org", true;
      if (r2 === 117 && f2 === 100 && c2 === 101 && s === 46) return e.isIcann = true, e.isPrivate = false, e.publicSuffix = "edu", true;
      if (r2 === 118 && f2 === 111 && c2 === 103 && s === 46) return e.isIcann = true, e.isPrivate = false, e.publicSuffix = "gov", true;
      if (r2 === 116 && f2 === 101 && c2 === 110 && s === 46) return e.isIcann = true, e.isPrivate = false, e.publicSuffix = "net", true;
      if (r2 === 101 && f2 === 100 && c2 === 46) return e.isIcann = true, e.isPrivate = false, e.publicSuffix = "de", true;
    }
    return false;
  }
  var exceptions = (function() {
    const a3 = [1, {}], o = [0, { city: a3 }];
    return [0, { ck: [0, { www: a3 }], jp: [0, { kawasaki: o, kitakyushu: o, kobe: o, nagoya: o, sapporo: o, sendai: o, yokohama: o }] }];
  })(), rules = (function() {
    const a3 = [1, {}], o = [2, {}], m2 = [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3 }], w2 = [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3 }], e = [0, { "*": o }], M2 = [2, { s: e }], N = [0, { relay: o }], C2 = [2, { id: o }], c2 = [1, { gov: a3 }], n5 = [0, { airflow: e, "lambda-url": o, "transfer-webapp": o }], l2 = [0, { airflow: e, "transfer-webapp": o }], O2 = [0, { "transfer-webapp": o, "transfer-webapp-fips": o }], u3 = [0, { notebook: o, studio: o }], d = [0, { labeling: o, notebook: o, studio: o }], P2 = [0, { notebook: o }], x2 = [0, { labeling: o, notebook: o, "notebook-fips": o, studio: o }], Q = [0, { notebook: o, "notebook-fips": o, studio: o, "studio-fips": o }], D2 = [0, { shop: o }], r2 = [0, { "*": a3 }], y2 = [1, { co: o }], R = [0, { objects: o }], E2 = [2, { nodes: o }], S2 = [0, { my: o }], k2 = [0, { s3: o, "s3-accesspoint": o, "s3-website": o }], T2 = [0, { s3: o, "s3-accesspoint": o }], U = [0, { direct: o }], g4 = [0, { "webview-assets": o }], h2 = [0, { vfs: o, "webview-assets": o }], v2 = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-object-lambda": o, "s3-website": o, "aws-cloud9": g4, cloud9: h2 }], z = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: T2, s3: o, "s3-accesspoint": o, "s3-object-lambda": o, "s3-website": o, "aws-cloud9": g4, cloud9: h2 }], p3 = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-object-lambda": o, "s3-website": o, "analytics-gateway": o, "aws-cloud9": g4, cloud9: h2 }], b2 = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-object-lambda": o, "s3-website": o }], j2 = [0, { s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-fips": o, "s3-website": o }], V2 = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: j2, s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-fips": o, "s3-object-lambda": o, "s3-website": o, "aws-cloud9": g4, cloud9: h2 }], W2 = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: j2, s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-deprecated": o, "s3-fips": o, "s3-object-lambda": o, "s3-website": o, "analytics-gateway": o, "aws-cloud9": g4, cloud9: h2 }], ca = [0, { s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-fips": o }], X = [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: ca, s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-fips": o, "s3-object-lambda": o, "s3-website": o }], s = [0, { auth: o }], q = [0, { auth: o, "auth-fips": o }], Y = [0, { "auth-fips": o }], Z = [0, { apps: o }], F2 = [0, { paas: o }], $ = [2, { eu: o }], G = [0, { app: o }], H = [0, { site: o }], _ = [1, { com: a3, edu: a3, net: a3, org: a3 }], I2 = [0, { j: o }], aa = [0, { dyn: o }], oa = [2, { web: o }], ea = [1, { co: a3, com: a3, edu: a3, gov: a3, net: a3, org: a3 }], ia = [0, { p: o }], sa = [0, { user: o }], f2 = [0, { cdn: o }], na = [2, { raw: e }], J = [0, { cust: o, reservd: o }], ta = [0, { cust: o }], K = [0, { s3: o }], ra = [1, { biz: a3, com: a3, edu: a3, gov: a3, info: a3, net: a3, org: a3 }], L2 = [0, { ipfs: o }], A2 = [1, { framer: o }], ua = [0, { forgot: o }], t2 = [1, { gs: a3 }], ma = [0, { nes: a3 }], i3 = [1, { k12: a3, cc: a3, lib: a3 }], la = [1, { cc: a3 }], B2 = [1, { cc: a3, lib: a3 }];
    return [0, { ac: [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3, drr: o, feedback: o, forms: o }], ad: a3, ae: [1, { ac: a3, co: a3, gov: a3, mil: a3, net: a3, org: a3, sch: a3 }], aero: [1, { airline: a3, airport: a3, "accident-investigation": a3, "accident-prevention": a3, aerobatic: a3, aeroclub: a3, aerodrome: a3, agents: a3, "air-surveillance": a3, "air-traffic-control": a3, aircraft: a3, airtraffic: a3, ambulance: a3, association: a3, author: a3, ballooning: a3, broker: a3, caa: a3, cargo: a3, catering: a3, certification: a3, championship: a3, charter: a3, civilaviation: a3, club: a3, conference: a3, consultant: a3, consulting: a3, control: a3, council: a3, crew: a3, design: a3, dgca: a3, educator: a3, emergency: a3, engine: a3, engineer: a3, entertainment: a3, equipment: a3, exchange: a3, express: a3, federation: a3, flight: a3, freight: a3, fuel: a3, gliding: a3, government: a3, groundhandling: a3, group: a3, hanggliding: a3, homebuilt: a3, insurance: a3, journal: a3, journalist: a3, leasing: a3, logistics: a3, magazine: a3, maintenance: a3, marketplace: a3, media: a3, microlight: a3, modelling: a3, navigation: a3, parachuting: a3, paragliding: a3, "passenger-association": a3, pilot: a3, press: a3, production: a3, recreation: a3, repbody: a3, res: a3, research: a3, rotorcraft: a3, safety: a3, scientist: a3, services: a3, show: a3, skydiving: a3, software: a3, student: a3, taxi: a3, trader: a3, trading: a3, trainer: a3, union: a3, workinggroup: a3, works: a3 }], af: m2, ag: [1, { co: a3, com: a3, net: a3, nom: a3, org: a3, obj: o }], ai: [1, { com: a3, net: a3, off: a3, org: a3, uwu: o, framer: o }], al: w2, am: [1, { co: a3, com: a3, commune: a3, net: a3, org: a3, radio: o }], ao: [1, { co: a3, ed: a3, edu: a3, gov: a3, gv: a3, it: a3, og: a3, org: a3, pb: a3 }], aq: a3, ar: [1, { bet: a3, com: a3, coop: a3, edu: a3, gob: a3, gov: a3, int: a3, mil: a3, musica: a3, mutual: a3, net: a3, org: a3, seg: a3, senasa: a3, tur: a3 }], arpa: [1, { e164: a3, home: a3, "in-addr": a3, ip6: a3, iris: a3, uri: a3, urn: a3 }], as: c2, asia: [1, { cloudns: o, daemon: o, dix: o }], at: [1, { 4: o, ac: [1, { sth: a3 }], co: a3, gv: a3, or: a3, funkfeuer: [0, { wien: o }], futurecms: [0, { "*": o, ex: e, in: e }], futurehosting: o, futuremailing: o, ortsinfo: [0, { ex: e, kunden: e }], biz: o, info: o, "123webseite": o, priv: o, my: o, myspreadshop: o, "12hp": o, "2ix": o, "4lima": o, "lima-city": o }], au: [1, { asn: a3, com: [1, { cloudlets: [0, { mel: o }], myspreadshop: o }], edu: [1, { act: a3, catholic: a3, nsw: a3, nt: a3, qld: a3, sa: a3, tas: a3, vic: a3, wa: a3 }], gov: [1, { qld: a3, sa: a3, tas: a3, vic: a3, wa: a3 }], id: a3, net: a3, org: a3, conf: a3, oz: a3, act: a3, nsw: a3, nt: a3, qld: a3, sa: a3, tas: a3, vic: a3, wa: a3, hrsn: [0, { vps: o }] }], aw: [1, { com: a3 }], ax: a3, az: [1, { biz: a3, co: a3, com: a3, edu: a3, gov: a3, info: a3, int: a3, mil: a3, name: a3, net: a3, org: a3, pp: a3, pro: a3 }], ba: [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3, brendly: D2, rs: o }], bb: [1, { biz: a3, co: a3, com: a3, edu: a3, gov: a3, info: a3, net: a3, org: a3, store: a3, tv: a3 }], bd: [1, { ac: a3, ai: a3, co: a3, com: a3, edu: a3, gov: a3, id: a3, info: a3, it: a3, mil: a3, net: a3, org: a3, sch: a3, tv: a3 }], be: [1, { ac: a3, cloudns: o, webhosting: o, interhostsolutions: [0, { cloud: o }], kuleuven: [0, { ezproxy: o }], "123website": o, myspreadshop: o, transurl: e }], bf: c2, bg: [1, { 0: a3, 1: a3, 2: a3, 3: a3, 4: a3, 5: a3, 6: a3, 7: a3, 8: a3, 9: a3, a: a3, b: a3, c: a3, d: a3, e: a3, f: a3, g: a3, h: a3, i: a3, j: a3, k: a3, l: a3, m: a3, n: a3, o: a3, p: a3, q: a3, r: a3, s: a3, t: a3, u: a3, v: a3, w: a3, x: a3, y: a3, z: a3, barsy: o }], bh: m2, bi: [1, { co: a3, com: a3, edu: a3, or: a3, org: a3 }], biz: [1, { activetrail: o, "cloud-ip": o, cloudns: o, jozi: o, dyndns: o, "for-better": o, "for-more": o, "for-some": o, "for-the": o, selfip: o, webhop: o, orx: o, mmafan: o, myftp: o, "no-ip": o, dscloud: o }], bj: [1, { africa: a3, agro: a3, architectes: a3, assur: a3, avocats: a3, co: a3, com: a3, eco: a3, econo: a3, edu: a3, info: a3, loisirs: a3, money: a3, net: a3, org: a3, ote: a3, restaurant: a3, resto: a3, tourism: a3, univ: a3 }], bm: m2, bn: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, co: o }], bo: [1, { com: a3, edu: a3, gob: a3, int: a3, mil: a3, net: a3, org: a3, tv: a3, web: a3, academia: a3, agro: a3, arte: a3, blog: a3, bolivia: a3, ciencia: a3, cooperativa: a3, democracia: a3, deporte: a3, ecologia: a3, economia: a3, empresa: a3, indigena: a3, industria: a3, info: a3, medicina: a3, movimiento: a3, musica: a3, natural: a3, nombre: a3, noticias: a3, patria: a3, plurinacional: a3, politica: a3, profesional: a3, pueblo: a3, revista: a3, salud: a3, tecnologia: a3, tksat: a3, transporte: a3, wiki: a3 }], br: [1, { "9guacu": a3, abc: a3, adm: a3, adv: a3, agr: a3, aju: a3, am: a3, anani: a3, aparecida: a3, api: a3, app: a3, arq: a3, art: a3, ato: a3, b: a3, barueri: a3, belem: a3, bet: a3, bhz: a3, bib: a3, bio: a3, blog: a3, bmd: a3, boavista: a3, bsb: a3, campinagrande: a3, campinas: a3, caxias: a3, cim: a3, cng: a3, cnt: a3, com: [1, { simplesite: o }], contagem: a3, coop: a3, coz: a3, cri: a3, cuiaba: a3, curitiba: a3, def: a3, des: a3, det: a3, dev: a3, ecn: a3, eco: a3, edu: a3, emp: a3, enf: a3, eng: a3, esp: a3, etc: a3, eti: a3, far: a3, feira: a3, flog: a3, floripa: a3, fm: a3, fnd: a3, fortal: a3, fot: a3, foz: a3, fst: a3, g12: a3, geo: a3, ggf: a3, goiania: a3, gov: [1, { ac: a3, al: a3, am: a3, ap: a3, ba: a3, ce: a3, df: a3, es: a3, go: a3, ma: a3, mg: a3, ms: a3, mt: a3, pa: a3, pb: a3, pe: a3, pi: a3, pr: a3, rj: a3, rn: a3, ro: a3, rr: a3, rs: a3, sc: a3, se: a3, sp: a3, to: a3 }], gru: a3, ia: a3, imb: a3, ind: a3, inf: a3, jab: a3, jampa: a3, jdf: a3, joinville: a3, jor: a3, jus: a3, leg: [1, { ac: o, al: o, am: o, ap: o, ba: o, ce: o, df: o, es: o, go: o, ma: o, mg: o, ms: o, mt: o, pa: o, pb: o, pe: o, pi: o, pr: o, rj: o, rn: o, ro: o, rr: o, rs: o, sc: o, se: o, sp: o, to: o }], leilao: a3, lel: a3, log: a3, londrina: a3, macapa: a3, maceio: a3, manaus: a3, maringa: a3, mat: a3, med: a3, mil: a3, morena: a3, mp: a3, mus: a3, natal: a3, net: a3, niteroi: a3, nom: r2, not: a3, ntr: a3, odo: a3, ong: a3, org: a3, osasco: a3, palmas: a3, poa: a3, ppg: a3, pro: a3, psc: a3, psi: a3, pvh: a3, qsl: a3, radio: a3, rec: a3, recife: a3, rep: a3, ribeirao: a3, rio: a3, riobranco: a3, riopreto: a3, salvador: a3, sampa: a3, santamaria: a3, santoandre: a3, saobernardo: a3, saogonca: a3, seg: a3, sjc: a3, slg: a3, slz: a3, social: a3, sorocaba: a3, srv: a3, taxi: a3, tc: a3, tec: a3, teo: a3, the: a3, tmp: a3, trd: a3, tur: a3, tv: a3, udi: a3, vet: a3, vix: a3, vlog: a3, wiki: a3, xyz: a3, zlg: a3, tche: o }], bs: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, we: o }], bt: m2, bv: a3, bw: [1, { ac: a3, co: a3, gov: a3, net: a3, org: a3 }], by: [1, { gov: a3, mil: a3, com: a3, of: a3, mediatech: o }], bz: [1, { co: a3, com: a3, edu: a3, gov: a3, net: a3, org: a3, za: o, mydns: o, gsj: o }], ca: [1, { ab: a3, bc: a3, mb: a3, nb: a3, nf: a3, nl: a3, ns: a3, nt: a3, nu: a3, on: a3, pe: a3, qc: a3, sk: a3, yk: a3, gc: a3, barsy: o, awdev: e, co: o, "no-ip": o, onid: o, myspreadshop: o, box: o }], cat: a3, cc: [1, { cleverapps: o, "cloud-ip": o, cloudns: o, ftpaccess: o, "game-server": o, myphotos: o, scrapping: o, twmail: o, csx: o, fantasyleague: o, spawn: [0, { instances: o }] }], cd: c2, cf: a3, cg: a3, ch: [1, { square7: o, cloudns: o, cloudscale: [0, { cust: o, lpg: R, rma: R }], objectstorage: [0, { lpg: o, rma: o }], flow: [0, { ae: [0, { alp1: o }], appengine: o }], "linkyard-cloud": o, gotdns: o, dnsking: o, "123website": o, myspreadshop: o, firenet: [0, { "*": o, svc: e }], "12hp": o, "2ix": o, "4lima": o, "lima-city": o }], ci: [1, { ac: a3, "xn--aroport-bya": a3, aéroport: a3, asso: a3, co: a3, com: a3, ed: a3, edu: a3, go: a3, gouv: a3, int: a3, net: a3, or: a3, org: a3 }], ck: r2, cl: [1, { co: a3, gob: a3, gov: a3, mil: a3, cloudns: o }], cm: [1, { co: a3, com: a3, gov: a3, net: a3 }], cn: [1, { ac: a3, com: [1, { amazonaws: [0, { "cn-north-1": [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, rds: e, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-deprecated": o, "s3-object-lambda": o, "s3-website": o }], "cn-northwest-1": [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, rds: e, dualstack: T2, s3: o, "s3-accesspoint": o, "s3-object-lambda": o, "s3-website": o }], compute: e, airflow: [0, { "cn-north-1": e, "cn-northwest-1": e }], eb: [0, { "cn-north-1": o, "cn-northwest-1": o }], elb: e }], amazonwebservices: [0, { on: [0, { "cn-north-1": l2, "cn-northwest-1": l2 }] }], sagemaker: [0, { "cn-north-1": u3, "cn-northwest-1": u3 }] }], edu: a3, gov: a3, mil: a3, net: a3, org: a3, "xn--55qx5d": a3, 公司: a3, "xn--od0alg": a3, 網絡: a3, "xn--io0a7i": a3, 网络: a3, ah: a3, bj: a3, cq: a3, fj: a3, gd: a3, gs: a3, gx: a3, gz: a3, ha: a3, hb: a3, he: a3, hi: a3, hk: a3, hl: a3, hn: a3, jl: a3, js: a3, jx: a3, ln: a3, mo: a3, nm: a3, nx: a3, qh: a3, sc: a3, sd: a3, sh: [1, { as: o }], sn: a3, sx: a3, tj: a3, tw: a3, xj: a3, xz: a3, yn: a3, zj: a3, "canva-apps": o, canvasite: S2, myqnapcloud: o, quickconnect: U }], co: [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, nom: a3, org: a3, carrd: o, crd: o, otap: e, hidns: o, leadpages: o, lpages: o, mypi: o, xmit: e, firewalledreplit: C2, repl: C2, supabase: [2, { realtime: o, storage: o }], umso: o }], com: [1, { a2hosted: o, cpserver: o, adobeaemcloud: [2, { dev: e }], africa: o, aivencloud: o, alibabacloudcs: o, kasserver: o, amazonaws: [0, { "af-south-1": v2, "ap-east-1": z, "ap-northeast-1": p3, "ap-northeast-2": p3, "ap-northeast-3": v2, "ap-south-1": p3, "ap-south-2": b2, "ap-southeast-1": p3, "ap-southeast-2": p3, "ap-southeast-3": b2, "ap-southeast-4": b2, "ap-southeast-5": [0, { "execute-api": o, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-deprecated": o, "s3-object-lambda": o, "s3-website": o }], "ca-central-1": V2, "ca-west-1": [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: j2, s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-fips": o, "s3-object-lambda": o, "s3-website": o }], "eu-central-1": p3, "eu-central-2": b2, "eu-north-1": z, "eu-south-1": v2, "eu-south-2": b2, "eu-west-1": [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-deprecated": o, "s3-object-lambda": o, "s3-website": o, "analytics-gateway": o, "aws-cloud9": g4, cloud9: h2 }], "eu-west-2": z, "eu-west-3": v2, "il-central-1": [0, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: k2, s3: o, "s3-accesspoint": o, "s3-object-lambda": o, "s3-website": o, "aws-cloud9": g4, cloud9: [0, { vfs: o }] }], "me-central-1": b2, "me-south-1": z, "sa-east-1": v2, "us-east-1": [2, { "execute-api": o, "emrappui-prod": o, "emrnotebooks-prod": o, "emrstudio-prod": o, dualstack: j2, s3: o, "s3-accesspoint": o, "s3-accesspoint-fips": o, "s3-deprecated": o, "s3-fips": o, "s3-object-lambda": o, "s3-website": o, "analytics-gateway": o, "aws-cloud9": g4, cloud9: h2 }], "us-east-2": W2, "us-gov-east-1": X, "us-gov-west-1": X, "us-west-1": V2, "us-west-2": W2, compute: e, "compute-1": e, airflow: [0, { "af-south-1": e, "ap-east-1": e, "ap-northeast-1": e, "ap-northeast-2": e, "ap-northeast-3": e, "ap-south-1": e, "ap-south-2": e, "ap-southeast-1": e, "ap-southeast-2": e, "ap-southeast-3": e, "ap-southeast-4": e, "ap-southeast-5": e, "ap-southeast-7": e, "ca-central-1": e, "ca-west-1": e, "eu-central-1": e, "eu-central-2": e, "eu-north-1": e, "eu-south-1": e, "eu-south-2": e, "eu-west-1": e, "eu-west-2": e, "eu-west-3": e, "il-central-1": e, "me-central-1": e, "me-south-1": e, "sa-east-1": e, "us-east-1": e, "us-east-2": e, "us-west-1": e, "us-west-2": e }], rds: [0, { "af-south-1": e, "ap-east-1": e, "ap-east-2": e, "ap-northeast-1": e, "ap-northeast-2": e, "ap-northeast-3": e, "ap-south-1": e, "ap-south-2": e, "ap-southeast-1": e, "ap-southeast-2": e, "ap-southeast-3": e, "ap-southeast-4": e, "ap-southeast-5": e, "ap-southeast-6": e, "ap-southeast-7": e, "ca-central-1": e, "ca-west-1": e, "eu-central-1": e, "eu-central-2": e, "eu-west-1": e, "eu-west-2": e, "eu-west-3": e, "il-central-1": e, "me-central-1": e, "me-south-1": e, "mx-central-1": e, "sa-east-1": e, "us-east-1": e, "us-east-2": e, "us-gov-east-1": e, "us-gov-west-1": e, "us-northeast-1": e, "us-west-1": e, "us-west-2": e }], s3: o, "s3-1": o, "s3-ap-east-1": o, "s3-ap-northeast-1": o, "s3-ap-northeast-2": o, "s3-ap-northeast-3": o, "s3-ap-south-1": o, "s3-ap-southeast-1": o, "s3-ap-southeast-2": o, "s3-ca-central-1": o, "s3-eu-central-1": o, "s3-eu-north-1": o, "s3-eu-west-1": o, "s3-eu-west-2": o, "s3-eu-west-3": o, "s3-external-1": o, "s3-fips-us-gov-east-1": o, "s3-fips-us-gov-west-1": o, "s3-global": [0, { accesspoint: [0, { mrap: o }] }], "s3-me-south-1": o, "s3-sa-east-1": o, "s3-us-east-2": o, "s3-us-gov-east-1": o, "s3-us-gov-west-1": o, "s3-us-west-1": o, "s3-us-west-2": o, "s3-website-ap-northeast-1": o, "s3-website-ap-southeast-1": o, "s3-website-ap-southeast-2": o, "s3-website-eu-west-1": o, "s3-website-sa-east-1": o, "s3-website-us-east-1": o, "s3-website-us-gov-west-1": o, "s3-website-us-west-1": o, "s3-website-us-west-2": o, elb: e }], amazoncognito: [0, { "af-south-1": s, "ap-east-1": s, "ap-northeast-1": s, "ap-northeast-2": s, "ap-northeast-3": s, "ap-south-1": s, "ap-south-2": s, "ap-southeast-1": s, "ap-southeast-2": s, "ap-southeast-3": s, "ap-southeast-4": s, "ap-southeast-5": s, "ap-southeast-7": s, "ca-central-1": s, "ca-west-1": s, "eu-central-1": s, "eu-central-2": s, "eu-north-1": s, "eu-south-1": s, "eu-south-2": s, "eu-west-1": s, "eu-west-2": s, "eu-west-3": s, "il-central-1": s, "me-central-1": s, "me-south-1": s, "mx-central-1": s, "sa-east-1": s, "us-east-1": q, "us-east-2": q, "us-gov-east-1": Y, "us-gov-west-1": Y, "us-west-1": q, "us-west-2": q }], amplifyapp: o, awsapprunner: e, awsapps: o, elasticbeanstalk: [2, { "af-south-1": o, "ap-east-1": o, "ap-northeast-1": o, "ap-northeast-2": o, "ap-northeast-3": o, "ap-south-1": o, "ap-southeast-1": o, "ap-southeast-2": o, "ap-southeast-3": o, "ap-southeast-5": o, "ap-southeast-7": o, "ca-central-1": o, "eu-central-1": o, "eu-north-1": o, "eu-south-1": o, "eu-south-2": o, "eu-west-1": o, "eu-west-2": o, "eu-west-3": o, "il-central-1": o, "me-central-1": o, "me-south-1": o, "sa-east-1": o, "us-east-1": o, "us-east-2": o, "us-gov-east-1": o, "us-gov-west-1": o, "us-west-1": o, "us-west-2": o }], awsglobalaccelerator: o, siiites: o, appspacehosted: o, appspaceusercontent: o, "on-aptible": o, myasustor: o, "balena-devices": o, boutir: o, bplaced: o, cafjs: o, "canva-apps": o, "canva-hosted-embed": o, canvacode: o, "rice-labs": o, "cdn77-storage": o, br: o, cn: o, de: o, eu: o, jpn: o, mex: o, ru: o, sa: o, uk: o, us: o, za: o, "clever-cloud": [0, { services: e }], abrdns: o, dnsabr: o, "ip-ddns": o, jdevcloud: o, wpdevcloud: o, "cf-ipfs": o, "cloudflare-ipfs": o, trycloudflare: o, co: o, devinapps: e, builtwithdark: o, datadetect: [0, { demo: o, instance: o }], dattolocal: o, dattorelay: o, dattoweb: o, mydatto: o, digitaloceanspaces: e, discordsays: o, discordsez: o, drayddns: o, dreamhosters: o, durumis: o, blogdns: o, cechire: o, dnsalias: o, dnsdojo: o, doesntexist: o, dontexist: o, doomdns: o, "dyn-o-saur": o, dynalias: o, "dyndns-at-home": o, "dyndns-at-work": o, "dyndns-blog": o, "dyndns-free": o, "dyndns-home": o, "dyndns-ip": o, "dyndns-mail": o, "dyndns-office": o, "dyndns-pics": o, "dyndns-remote": o, "dyndns-server": o, "dyndns-web": o, "dyndns-wiki": o, "dyndns-work": o, "est-a-la-maison": o, "est-a-la-masion": o, "est-le-patron": o, "est-mon-blogueur": o, "from-ak": o, "from-al": o, "from-ar": o, "from-ca": o, "from-ct": o, "from-dc": o, "from-de": o, "from-fl": o, "from-ga": o, "from-hi": o, "from-ia": o, "from-id": o, "from-il": o, "from-in": o, "from-ks": o, "from-ky": o, "from-ma": o, "from-md": o, "from-mi": o, "from-mn": o, "from-mo": o, "from-ms": o, "from-mt": o, "from-nc": o, "from-nd": o, "from-ne": o, "from-nh": o, "from-nj": o, "from-nm": o, "from-nv": o, "from-oh": o, "from-ok": o, "from-or": o, "from-pa": o, "from-pr": o, "from-ri": o, "from-sc": o, "from-sd": o, "from-tn": o, "from-tx": o, "from-ut": o, "from-va": o, "from-vt": o, "from-wa": o, "from-wi": o, "from-wv": o, "from-wy": o, getmyip: o, gotdns: o, "hobby-site": o, homelinux: o, homeunix: o, iamallama: o, "is-a-anarchist": o, "is-a-blogger": o, "is-a-bookkeeper": o, "is-a-bulls-fan": o, "is-a-caterer": o, "is-a-chef": o, "is-a-conservative": o, "is-a-cpa": o, "is-a-cubicle-slave": o, "is-a-democrat": o, "is-a-designer": o, "is-a-doctor": o, "is-a-financialadvisor": o, "is-a-geek": o, "is-a-green": o, "is-a-guru": o, "is-a-hard-worker": o, "is-a-hunter": o, "is-a-landscaper": o, "is-a-lawyer": o, "is-a-liberal": o, "is-a-libertarian": o, "is-a-llama": o, "is-a-musician": o, "is-a-nascarfan": o, "is-a-nurse": o, "is-a-painter": o, "is-a-personaltrainer": o, "is-a-photographer": o, "is-a-player": o, "is-a-republican": o, "is-a-rockstar": o, "is-a-socialist": o, "is-a-student": o, "is-a-teacher": o, "is-a-techie": o, "is-a-therapist": o, "is-an-accountant": o, "is-an-actor": o, "is-an-actress": o, "is-an-anarchist": o, "is-an-artist": o, "is-an-engineer": o, "is-an-entertainer": o, "is-certified": o, "is-gone": o, "is-into-anime": o, "is-into-cars": o, "is-into-cartoons": o, "is-into-games": o, "is-leet": o, "is-not-certified": o, "is-slick": o, "is-uberleet": o, "is-with-theband": o, "isa-geek": o, "isa-hockeynut": o, issmarterthanyou: o, "likes-pie": o, likescandy: o, "neat-url": o, "saves-the-whales": o, selfip: o, "sells-for-less": o, "sells-for-u": o, servebbs: o, "simple-url": o, "space-to-rent": o, "teaches-yoga": o, writesthisblog: o, ddnsfree: o, ddnsgeek: o, giize: o, gleeze: o, kozow: o, loseyourip: o, ooguy: o, theworkpc: o, mytuleap: o, "tuleap-partners": o, encoreapi: o, evennode: [0, { "eu-1": o, "eu-2": o, "eu-3": o, "eu-4": o, "us-1": o, "us-2": o, "us-3": o, "us-4": o }], onfabrica: o, "fastly-edge": o, "fastly-terrarium": o, "fastvps-server": o, mydobiss: o, firebaseapp: o, fldrv: o, forgeblocks: o, framercanvas: o, "freebox-os": o, freeboxos: o, freemyip: o, aliases121: o, gentapps: o, gentlentapis: o, githubusercontent: o, "0emm": e, appspot: [2, { r: e }], blogspot: o, codespot: o, googleapis: o, googlecode: o, pagespeedmobilizer: o, withgoogle: o, withyoutube: o, grayjayleagues: o, hatenablog: o, hatenadiary: o, herokuapp: o, gr: o, smushcdn: o, wphostedmail: o, wpmucdn: o, pixolino: o, "apps-1and1": o, "live-website": o, "webspace-host": o, dopaas: o, "hosted-by-previder": F2, hosteur: [0, { "rag-cloud": o, "rag-cloud-ch": o }], "ik-server": [0, { jcloud: o, "jcloud-ver-jpc": o }], jelastic: [0, { demo: o }], massivegrid: F2, wafaicloud: [0, { jed: o, ryd: o }], "eu1-plenit": o, "la1-plenit": o, "us1-plenit": o, webadorsite: o, joyent: [0, { cns: e }], "on-forge": o, "on-vapor": o, lpusercontent: o, linode: [0, { members: o, nodebalancer: e }], linodeobjects: e, linodeusercontent: [0, { ip: o }], localtonet: o, lovableproject: o, barsycenter: o, barsyonline: o, lutrausercontent: e, modelscape: o, mwcloudnonprod: o, polyspace: o, mazeplay: o, miniserver: o, atmeta: o, fbsbx: Z, meteorapp: $, routingthecloud: o, "same-app": o, "same-preview": o, mydbserver: o, mochausercontent: o, hostedpi: o, "mythic-beasts": [0, { caracal: o, customer: o, fentiger: o, lynx: o, ocelot: o, oncilla: o, onza: o, sphinx: o, vs: o, x: o, yali: o }], nospamproxy: [0, { cloud: [2, { o365: o }] }], "4u": o, nfshost: o, "3utilities": o, blogsyte: o, ciscofreak: o, damnserver: o, ddnsking: o, ditchyourip: o, dnsiskinky: o, dynns: o, geekgalaxy: o, "health-carereform": o, homesecuritymac: o, homesecuritypc: o, myactivedirectory: o, mysecuritycamera: o, myvnc: o, "net-freaks": o, onthewifi: o, point2this: o, quicksytes: o, securitytactics: o, servebeer: o, servecounterstrike: o, serveexchange: o, serveftp: o, servegame: o, servehalflife: o, servehttp: o, servehumour: o, serveirc: o, servemp3: o, servep2p: o, servepics: o, servequake: o, servesarcasm: o, stufftoread: o, unusualperson: o, workisboring: o, myiphost: o, observableusercontent: [0, { static: o }], simplesite: o, oaiusercontent: e, orsites: o, operaunite: o, "customer-oci": [0, { "*": o, oci: e, ocp: e, ocs: e }], oraclecloudapps: e, oraclegovcloudapps: e, "authgear-staging": o, authgearapps: o, skygearapp: o, outsystemscloud: o, ownprovider: o, pgfog: o, pagexl: o, gotpantheon: o, paywhirl: e, upsunapp: o, "postman-echo": o, prgmr: [0, { xen: o }], "project-study": [0, { dev: o }], pythonanywhere: $, qa2: o, "alpha-myqnapcloud": o, "dev-myqnapcloud": o, mycloudnas: o, mynascloud: o, myqnapcloud: o, qualifioapp: o, ladesk: o, qualyhqpartner: e, qualyhqportal: e, qbuser: o, quipelements: e, rackmaze: o, "readthedocs-hosted": o, rhcloud: o, onrender: o, render: G, "subsc-pay": o, "180r": o, dojin: o, sakuratan: o, sakuraweb: o, x0: o, code: [0, { builder: e, "dev-builder": e, "stg-builder": e }], salesforce: [0, { platform: [0, { "code-builder-stg": [0, { test: [0, { "001": e }] }] }] }], logoip: o, scrysec: o, "firewall-gateway": o, myshopblocks: o, myshopify: o, shopitsite: o, "1kapp": o, appchizi: o, applinzi: o, sinaapp: o, vipsinaapp: o, streamlitapp: o, "try-snowplow": o, "playstation-cloud": o, myspreadshop: o, "w-corp-staticblitz": o, "w-credentialless-staticblitz": o, "w-staticblitz": o, "stackhero-network": o, stdlib: [0, { api: o }], strapiapp: [2, { media: o }], "streak-link": o, streaklinks: o, streakusercontent: o, "temp-dns": o, dsmynas: o, familyds: o, mytabit: o, taveusercontent: o, "tb-hosting": H, reservd: o, thingdustdata: o, "townnews-staging": o, typeform: [0, { pro: o }], hk: o, it: o, "deus-canvas": o, vultrobjects: e, wafflecell: o, hotelwithflight: o, "reserve-online": o, cprapid: o, pleskns: o, remotewd: o, wiardweb: [0, { pages: o }], wixsite: o, wixstudio: o, messwithdns: o, "woltlab-demo": o, wpenginepowered: [2, { js: o }], xnbay: [2, { u2: o, "u2-local": o }], yolasite: o }], coop: a3, cr: [1, { ac: a3, co: a3, ed: a3, fi: a3, go: a3, or: a3, sa: a3 }], cu: [1, { com: a3, edu: a3, gob: a3, inf: a3, nat: a3, net: a3, org: a3 }], cv: [1, { com: a3, edu: a3, id: a3, int: a3, net: a3, nome: a3, org: a3, publ: a3 }], cw: _, cx: [1, { gov: a3, cloudns: o, ath: o, info: o, assessments: o, calculators: o, funnels: o, paynow: o, quizzes: o, researched: o, tests: o }], cy: [1, { ac: a3, biz: a3, com: [1, { scaleforce: I2 }], ekloges: a3, gov: a3, ltd: a3, mil: a3, net: a3, org: a3, press: a3, pro: a3, tm: a3 }], cz: [1, { gov: a3, contentproxy9: [0, { rsc: o }], realm: o, e4: o, co: o, metacentrum: [0, { cloud: e, custom: o }], muni: [0, { cloud: [0, { flt: o, usr: o }] }] }], de: [1, { bplaced: o, square7: o, com: o, cosidns: aa, dnsupdater: o, "dynamisches-dns": o, "internet-dns": o, "l-o-g-i-n": o, ddnss: [2, { dyn: o, dyndns: o }], "dyn-ip24": o, dyndns1: o, "home-webserver": [2, { dyn: o }], "myhome-server": o, dnshome: o, fuettertdasnetz: o, isteingeek: o, istmein: o, lebtimnetz: o, leitungsen: o, traeumtgerade: o, frusky: e, goip: o, "xn--gnstigbestellen-zvb": o, günstigbestellen: o, "xn--gnstigliefern-wob": o, günstigliefern: o, "hs-heilbronn": [0, { it: [0, { pages: o, "pages-research": o }] }], "dyn-berlin": o, "in-berlin": o, "in-brb": o, "in-butter": o, "in-dsl": o, "in-vpn": o, iservschule: o, "mein-iserv": o, schuldock: o, schulplattform: o, schulserver: o, "test-iserv": o, keymachine: o, co: o, "git-repos": o, "lcube-server": o, "svn-repos": o, barsy: o, webspaceconfig: o, "123webseite": o, rub: o, "ruhr-uni-bochum": [2, { noc: [0, { io: o }] }], logoip: o, "firewall-gateway": o, "my-gateway": o, "my-router": o, spdns: o, my: o, speedpartner: [0, { customer: o }], myspreadshop: o, "taifun-dns": o, "12hp": o, "2ix": o, "4lima": o, "lima-city": o, "dd-dns": o, "dray-dns": o, draydns: o, "dyn-vpn": o, dynvpn: o, "mein-vigor": o, "my-vigor": o, "my-wan": o, "syno-ds": o, "synology-diskstation": o, "synology-ds": o, "virtual-user": o, virtualuser: o, "community-pro": o, diskussionsbereich: o, xenonconnect: e }], dj: a3, dk: [1, { biz: o, co: o, firm: o, reg: o, store: o, "123hjemmeside": o, myspreadshop: o }], dm: ea, do: [1, { art: a3, com: a3, edu: a3, gob: a3, gov: a3, mil: a3, net: a3, org: a3, sld: a3, web: a3 }], dz: [1, { art: a3, asso: a3, com: a3, edu: a3, gov: a3, net: a3, org: a3, pol: a3, soc: a3, tm: a3 }], ec: [1, { abg: a3, adm: a3, agron: a3, arqt: a3, art: a3, bar: a3, chef: a3, com: a3, cont: a3, cpa: a3, cue: a3, dent: a3, dgn: a3, disco: a3, doc: a3, edu: a3, eng: a3, esm: a3, fin: a3, fot: a3, gal: a3, gob: a3, gov: a3, gye: a3, ibr: a3, info: a3, k12: a3, lat: a3, loj: a3, med: a3, mil: a3, mktg: a3, mon: a3, net: a3, ntr: a3, odont: a3, org: a3, pro: a3, prof: a3, psic: a3, psiq: a3, pub: a3, rio: a3, rrpp: a3, sal: a3, tech: a3, tul: a3, tur: a3, uio: a3, vet: a3, xxx: a3, base: o, official: o }], edu: [1, { rit: [0, { "git-pages": o }] }], ee: [1, { aip: a3, com: a3, edu: a3, fie: a3, gov: a3, lib: a3, med: a3, org: a3, pri: a3, riik: a3 }], eg: [1, { ac: a3, com: a3, edu: a3, eun: a3, gov: a3, info: a3, me: a3, mil: a3, name: a3, net: a3, org: a3, sci: a3, sport: a3, tv: a3 }], er: r2, es: [1, { com: a3, edu: a3, gob: a3, nom: a3, org: a3, "123miweb": o, myspreadshop: o }], et: [1, { biz: a3, com: a3, edu: a3, gov: a3, info: a3, name: a3, net: a3, org: a3 }], eu: [1, { cloudns: o, prvw: o, dogado: [0, { jelastic: o }], barsy: o, spdns: o, nxa: e, directwp: o, transurl: e, diskstation: o }], fi: [1, { aland: a3, dy: o, "xn--hkkinen-5wa": o, häkkinen: o, iki: o, cloudplatform: [0, { fi: o }], datacenter: [0, { demo: o, paas: o }], kapsi: o, "123kotisivu": o, myspreadshop: o }], fj: [1, { ac: a3, biz: a3, com: a3, edu: a3, gov: a3, id: a3, info: a3, mil: a3, name: a3, net: a3, org: a3, pro: a3 }], fk: r2, fm: [1, { com: a3, edu: a3, net: a3, org: a3, radio: o, user: e }], fo: a3, fr: [1, { asso: a3, com: a3, gouv: a3, nom: a3, prd: a3, tm: a3, avoues: a3, cci: a3, greta: a3, "huissier-justice": a3, "en-root": o, "fbx-os": o, fbxos: o, "freebox-os": o, freeboxos: o, goupile: o, "123siteweb": o, "on-web": o, "chirurgiens-dentistes-en-france": o, dedibox: o, aeroport: o, avocat: o, chambagri: o, "chirurgiens-dentistes": o, "experts-comptables": o, medecin: o, notaires: o, pharmacien: o, port: o, veterinaire: o, myspreadshop: o, ynh: o }], ga: a3, gb: a3, gd: [1, { edu: a3, gov: a3 }], ge: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, pvt: a3, school: a3 }], gf: a3, gg: [1, { co: a3, net: a3, org: a3, ply: [0, { at: e, d6: o }], botdash: o, kaas: o, stackit: o, panel: [2, { daemon: o }] }], gh: [1, { biz: a3, com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3 }], gi: [1, { com: a3, edu: a3, gov: a3, ltd: a3, mod: a3, org: a3 }], gl: [1, { co: a3, com: a3, edu: a3, net: a3, org: a3 }], gm: a3, gn: [1, { ac: a3, com: a3, edu: a3, gov: a3, net: a3, org: a3 }], gov: a3, gp: [1, { asso: a3, com: a3, edu: a3, mobi: a3, net: a3, org: a3 }], gq: a3, gr: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, barsy: o, simplesite: o }], gs: a3, gt: [1, { com: a3, edu: a3, gob: a3, ind: a3, mil: a3, net: a3, org: a3 }], gu: [1, { com: a3, edu: a3, gov: a3, guam: a3, info: a3, net: a3, org: a3, web: a3 }], gw: [1, { nx: o }], gy: ea, hk: [1, { com: a3, edu: a3, gov: a3, idv: a3, net: a3, org: a3, "xn--ciqpn": a3, 个人: a3, "xn--gmqw5a": a3, 個人: a3, "xn--55qx5d": a3, 公司: a3, "xn--mxtq1m": a3, 政府: a3, "xn--lcvr32d": a3, 敎育: a3, "xn--wcvs22d": a3, 教育: a3, "xn--gmq050i": a3, 箇人: a3, "xn--uc0atv": a3, 組織: a3, "xn--uc0ay4a": a3, 組织: a3, "xn--od0alg": a3, 網絡: a3, "xn--zf0avx": a3, 網络: a3, "xn--mk0axi": a3, 组織: a3, "xn--tn0ag": a3, 组织: a3, "xn--od0aq3b": a3, 网絡: a3, "xn--io0a7i": a3, 网络: a3, inc: o, ltd: o }], hm: a3, hn: [1, { com: a3, edu: a3, gob: a3, mil: a3, net: a3, org: a3 }], hr: [1, { com: a3, from: a3, iz: a3, name: a3, brendly: D2 }], ht: [1, { adult: a3, art: a3, asso: a3, com: a3, coop: a3, edu: a3, firm: a3, gouv: a3, info: a3, med: a3, net: a3, org: a3, perso: a3, pol: a3, pro: a3, rel: a3, shop: a3, rt: o }], hu: [1, { 2e3: a3, agrar: a3, bolt: a3, casino: a3, city: a3, co: a3, erotica: a3, erotika: a3, film: a3, forum: a3, games: a3, hotel: a3, info: a3, ingatlan: a3, jogasz: a3, konyvelo: a3, lakas: a3, media: a3, news: a3, org: a3, priv: a3, reklam: a3, sex: a3, shop: a3, sport: a3, suli: a3, szex: a3, tm: a3, tozsde: a3, utazas: a3, video: a3 }], id: [1, { ac: a3, biz: a3, co: a3, desa: a3, go: a3, kop: a3, mil: a3, my: a3, net: a3, or: a3, ponpes: a3, sch: a3, web: a3, e: o, zone: o }], ie: [1, { gov: a3, myspreadshop: o }], il: [1, { ac: a3, co: [1, { ravpage: o, mytabit: o, tabitorder: o }], gov: a3, idf: a3, k12: a3, muni: a3, net: a3, org: a3 }], "xn--4dbrk0ce": [1, { "xn--4dbgdty6c": a3, "xn--5dbhl8d": a3, "xn--8dbq2a": a3, "xn--hebda8b": a3 }], ישראל: [1, { אקדמיה: a3, ישוב: a3, צהל: a3, ממשל: a3 }], im: [1, { ac: a3, co: [1, { ltd: a3, plc: a3 }], com: a3, net: a3, org: a3, tt: a3, tv: a3 }], in: [1, { "5g": a3, "6g": a3, ac: a3, ai: a3, am: a3, bank: a3, bihar: a3, biz: a3, business: a3, ca: a3, cn: a3, co: a3, com: a3, coop: a3, cs: a3, delhi: a3, dr: a3, edu: a3, er: a3, fin: a3, firm: a3, gen: a3, gov: a3, gujarat: a3, ind: a3, info: a3, int: a3, internet: a3, io: a3, me: a3, mil: a3, net: a3, nic: a3, org: a3, pg: a3, post: a3, pro: a3, res: a3, travel: a3, tv: a3, uk: a3, up: a3, us: a3, cloudns: o, barsy: o, web: o, supabase: o }], info: [1, { cloudns: o, "dynamic-dns": o, "barrel-of-knowledge": o, "barrell-of-knowledge": o, dyndns: o, "for-our": o, "groks-the": o, "groks-this": o, "here-for-more": o, knowsitall: o, selfip: o, webhop: o, barsy: o, mayfirst: o, mittwald: o, mittwaldserver: o, typo3server: o, dvrcam: o, ilovecollege: o, "no-ip": o, forumz: o, nsupdate: o, dnsupdate: o, "v-info": o }], int: [1, { eu: a3 }], io: [1, { 2038: o, co: a3, com: a3, edu: a3, gov: a3, mil: a3, net: a3, nom: a3, org: a3, "on-acorn": e, myaddr: o, apigee: o, "b-data": o, beagleboard: o, bitbucket: o, bluebite: o, boxfuse: o, brave: M2, browsersafetymark: o, bubble: f2, bubbleapps: o, bigv: [0, { uk0: o }], cleverapps: o, cloudbeesusercontent: o, dappnode: [0, { dyndns: o }], darklang: o, definima: o, dedyn: o, icp0: na, icp1: na, qzz: o, "fh-muenster": o, shw: o, forgerock: [0, { id: o }], gitbook: o, github: o, gitlab: o, lolipop: o, "hasura-app": o, hostyhosting: o, hypernode: o, moonscale: e, beebyte: F2, beebyteapp: [0, { sekd1: o }], jele: o, webthings: o, loginline: o, barsy: o, azurecontainer: e, ngrok: [2, { ap: o, au: o, eu: o, in: o, jp: o, sa: o, us: o }], nodeart: [0, { stage: o }], pantheonsite: o, pstmn: [2, { mock: o }], protonet: o, qcx: [2, { sys: e }], qoto: o, vaporcloud: o, myrdbx: o, "rb-hosting": H, "on-k3s": e, "on-rio": e, readthedocs: o, resindevice: o, resinstaging: [0, { devices: o }], hzc: o, sandcats: o, scrypted: [0, { client: o }], "mo-siemens": o, lair: Z, stolos: e, musician: o, utwente: o, edugit: o, telebit: o, thingdust: [0, { dev: J, disrec: J, prod: ta, testing: J }], tickets: o, webflow: o, webflowtest: o, editorx: o, wixstudio: o, basicserver: o, virtualserver: o }], iq: w2, ir: [1, { ac: a3, co: a3, gov: a3, id: a3, net: a3, org: a3, sch: a3, "xn--mgba3a4f16a": a3, ایران: a3, "xn--mgba3a4fra": a3, ايران: a3, arvanedge: o, vistablog: o }], is: a3, it: [1, { edu: a3, gov: a3, abr: a3, abruzzo: a3, "aosta-valley": a3, aostavalley: a3, bas: a3, basilicata: a3, cal: a3, calabria: a3, cam: a3, campania: a3, "emilia-romagna": a3, emiliaromagna: a3, emr: a3, "friuli-v-giulia": a3, "friuli-ve-giulia": a3, "friuli-vegiulia": a3, "friuli-venezia-giulia": a3, "friuli-veneziagiulia": a3, "friuli-vgiulia": a3, "friuliv-giulia": a3, "friulive-giulia": a3, friulivegiulia: a3, "friulivenezia-giulia": a3, friuliveneziagiulia: a3, friulivgiulia: a3, fvg: a3, laz: a3, lazio: a3, lig: a3, liguria: a3, lom: a3, lombardia: a3, lombardy: a3, lucania: a3, mar: a3, marche: a3, mol: a3, molise: a3, piedmont: a3, piemonte: a3, pmn: a3, pug: a3, puglia: a3, sar: a3, sardegna: a3, sardinia: a3, sic: a3, sicilia: a3, sicily: a3, taa: a3, tos: a3, toscana: a3, "trentin-sud-tirol": a3, "xn--trentin-sd-tirol-rzb": a3, "trentin-süd-tirol": a3, "trentin-sudtirol": a3, "xn--trentin-sdtirol-7vb": a3, "trentin-südtirol": a3, "trentin-sued-tirol": a3, "trentin-suedtirol": a3, trentino: a3, "trentino-a-adige": a3, "trentino-aadige": a3, "trentino-alto-adige": a3, "trentino-altoadige": a3, "trentino-s-tirol": a3, "trentino-stirol": a3, "trentino-sud-tirol": a3, "xn--trentino-sd-tirol-c3b": a3, "trentino-süd-tirol": a3, "trentino-sudtirol": a3, "xn--trentino-sdtirol-szb": a3, "trentino-südtirol": a3, "trentino-sued-tirol": a3, "trentino-suedtirol": a3, "trentinoa-adige": a3, trentinoaadige: a3, "trentinoalto-adige": a3, trentinoaltoadige: a3, "trentinos-tirol": a3, trentinostirol: a3, "trentinosud-tirol": a3, "xn--trentinosd-tirol-rzb": a3, "trentinosüd-tirol": a3, trentinosudtirol: a3, "xn--trentinosdtirol-7vb": a3, trentinosüdtirol: a3, "trentinosued-tirol": a3, trentinosuedtirol: a3, "trentinsud-tirol": a3, "xn--trentinsd-tirol-6vb": a3, "trentinsüd-tirol": a3, trentinsudtirol: a3, "xn--trentinsdtirol-nsb": a3, trentinsüdtirol: a3, "trentinsued-tirol": a3, trentinsuedtirol: a3, tuscany: a3, umb: a3, umbria: a3, "val-d-aosta": a3, "val-daosta": a3, "vald-aosta": a3, valdaosta: a3, "valle-aosta": a3, "valle-d-aosta": a3, "valle-daosta": a3, valleaosta: a3, "valled-aosta": a3, valledaosta: a3, "vallee-aoste": a3, "xn--valle-aoste-ebb": a3, "vallée-aoste": a3, "vallee-d-aoste": a3, "xn--valle-d-aoste-ehb": a3, "vallée-d-aoste": a3, valleeaoste: a3, "xn--valleaoste-e7a": a3, valléeaoste: a3, valleedaoste: a3, "xn--valledaoste-ebb": a3, valléedaoste: a3, vao: a3, vda: a3, ven: a3, veneto: a3, ag: a3, agrigento: a3, al: a3, alessandria: a3, "alto-adige": a3, altoadige: a3, an: a3, ancona: a3, "andria-barletta-trani": a3, "andria-trani-barletta": a3, andriabarlettatrani: a3, andriatranibarletta: a3, ao: a3, aosta: a3, aoste: a3, ap: a3, aq: a3, aquila: a3, ar: a3, arezzo: a3, "ascoli-piceno": a3, ascolipiceno: a3, asti: a3, at: a3, av: a3, avellino: a3, ba: a3, balsan: a3, "balsan-sudtirol": a3, "xn--balsan-sdtirol-nsb": a3, "balsan-südtirol": a3, "balsan-suedtirol": a3, bari: a3, "barletta-trani-andria": a3, barlettatraniandria: a3, belluno: a3, benevento: a3, bergamo: a3, bg: a3, bi: a3, biella: a3, bl: a3, bn: a3, bo: a3, bologna: a3, bolzano: a3, "bolzano-altoadige": a3, bozen: a3, "bozen-sudtirol": a3, "xn--bozen-sdtirol-2ob": a3, "bozen-südtirol": a3, "bozen-suedtirol": a3, br: a3, brescia: a3, brindisi: a3, bs: a3, bt: a3, bulsan: a3, "bulsan-sudtirol": a3, "xn--bulsan-sdtirol-nsb": a3, "bulsan-südtirol": a3, "bulsan-suedtirol": a3, bz: a3, ca: a3, cagliari: a3, caltanissetta: a3, "campidano-medio": a3, campidanomedio: a3, campobasso: a3, "carbonia-iglesias": a3, carboniaiglesias: a3, "carrara-massa": a3, carraramassa: a3, caserta: a3, catania: a3, catanzaro: a3, cb: a3, ce: a3, "cesena-forli": a3, "xn--cesena-forl-mcb": a3, "cesena-forlì": a3, cesenaforli: a3, "xn--cesenaforl-i8a": a3, cesenaforlì: a3, ch: a3, chieti: a3, ci: a3, cl: a3, cn: a3, co: a3, como: a3, cosenza: a3, cr: a3, cremona: a3, crotone: a3, cs: a3, ct: a3, cuneo: a3, cz: a3, "dell-ogliastra": a3, dellogliastra: a3, en: a3, enna: a3, fc: a3, fe: a3, fermo: a3, ferrara: a3, fg: a3, fi: a3, firenze: a3, florence: a3, fm: a3, foggia: a3, "forli-cesena": a3, "xn--forl-cesena-fcb": a3, "forlì-cesena": a3, forlicesena: a3, "xn--forlcesena-c8a": a3, forlìcesena: a3, fr: a3, frosinone: a3, ge: a3, genoa: a3, genova: a3, go: a3, gorizia: a3, gr: a3, grosseto: a3, "iglesias-carbonia": a3, iglesiascarbonia: a3, im: a3, imperia: a3, is: a3, isernia: a3, kr: a3, "la-spezia": a3, laquila: a3, laspezia: a3, latina: a3, lc: a3, le: a3, lecce: a3, lecco: a3, li: a3, livorno: a3, lo: a3, lodi: a3, lt: a3, lu: a3, lucca: a3, macerata: a3, mantova: a3, "massa-carrara": a3, massacarrara: a3, matera: a3, mb: a3, mc: a3, me: a3, "medio-campidano": a3, mediocampidano: a3, messina: a3, mi: a3, milan: a3, milano: a3, mn: a3, mo: a3, modena: a3, monza: a3, "monza-brianza": a3, "monza-e-della-brianza": a3, monzabrianza: a3, monzaebrianza: a3, monzaedellabrianza: a3, ms: a3, mt: a3, na: a3, naples: a3, napoli: a3, no: a3, novara: a3, nu: a3, nuoro: a3, og: a3, ogliastra: a3, "olbia-tempio": a3, olbiatempio: a3, or: a3, oristano: a3, ot: a3, pa: a3, padova: a3, padua: a3, palermo: a3, parma: a3, pavia: a3, pc: a3, pd: a3, pe: a3, perugia: a3, "pesaro-urbino": a3, pesarourbino: a3, pescara: a3, pg: a3, pi: a3, piacenza: a3, pisa: a3, pistoia: a3, pn: a3, po: a3, pordenone: a3, potenza: a3, pr: a3, prato: a3, pt: a3, pu: a3, pv: a3, pz: a3, ra: a3, ragusa: a3, ravenna: a3, rc: a3, re: a3, "reggio-calabria": a3, "reggio-emilia": a3, reggiocalabria: a3, reggioemilia: a3, rg: a3, ri: a3, rieti: a3, rimini: a3, rm: a3, rn: a3, ro: a3, roma: a3, rome: a3, rovigo: a3, sa: a3, salerno: a3, sassari: a3, savona: a3, si: a3, siena: a3, siracusa: a3, so: a3, sondrio: a3, sp: a3, sr: a3, ss: a3, "xn--sdtirol-n2a": a3, südtirol: a3, suedtirol: a3, sv: a3, ta: a3, taranto: a3, te: a3, "tempio-olbia": a3, tempioolbia: a3, teramo: a3, terni: a3, tn: a3, to: a3, torino: a3, tp: a3, tr: a3, "trani-andria-barletta": a3, "trani-barletta-andria": a3, traniandriabarletta: a3, tranibarlettaandria: a3, trapani: a3, trento: a3, treviso: a3, trieste: a3, ts: a3, turin: a3, tv: a3, ud: a3, udine: a3, "urbino-pesaro": a3, urbinopesaro: a3, va: a3, varese: a3, vb: a3, vc: a3, ve: a3, venezia: a3, venice: a3, verbania: a3, vercelli: a3, verona: a3, vi: a3, "vibo-valentia": a3, vibovalentia: a3, vicenza: a3, viterbo: a3, vr: a3, vs: a3, vt: a3, vv: a3, "12chars": o, ibxos: o, iliadboxos: o, neen: [0, { jc: o }], "123homepage": o, "16-b": o, "32-b": o, "64-b": o, myspreadshop: o, syncloud: o }], je: [1, { co: a3, net: a3, org: a3, of: o }], jm: r2, jo: [1, { agri: a3, ai: a3, com: a3, edu: a3, eng: a3, fm: a3, gov: a3, mil: a3, net: a3, org: a3, per: a3, phd: a3, sch: a3, tv: a3 }], jobs: a3, jp: [1, { ac: a3, ad: a3, co: a3, ed: a3, go: a3, gr: a3, lg: a3, ne: [1, { aseinet: sa, gehirn: o, ivory: o, "mail-box": o, mints: o, mokuren: o, opal: o, sakura: o, sumomo: o, topaz: o }], or: a3, aichi: [1, { aisai: a3, ama: a3, anjo: a3, asuke: a3, chiryu: a3, chita: a3, fuso: a3, gamagori: a3, handa: a3, hazu: a3, hekinan: a3, higashiura: a3, ichinomiya: a3, inazawa: a3, inuyama: a3, isshiki: a3, iwakura: a3, kanie: a3, kariya: a3, kasugai: a3, kira: a3, kiyosu: a3, komaki: a3, konan: a3, kota: a3, mihama: a3, miyoshi: a3, nishio: a3, nisshin: a3, obu: a3, oguchi: a3, oharu: a3, okazaki: a3, owariasahi: a3, seto: a3, shikatsu: a3, shinshiro: a3, shitara: a3, tahara: a3, takahama: a3, tobishima: a3, toei: a3, togo: a3, tokai: a3, tokoname: a3, toyoake: a3, toyohashi: a3, toyokawa: a3, toyone: a3, toyota: a3, tsushima: a3, yatomi: a3 }], akita: [1, { akita: a3, daisen: a3, fujisato: a3, gojome: a3, hachirogata: a3, happou: a3, higashinaruse: a3, honjo: a3, honjyo: a3, ikawa: a3, kamikoani: a3, kamioka: a3, katagami: a3, kazuno: a3, kitaakita: a3, kosaka: a3, kyowa: a3, misato: a3, mitane: a3, moriyoshi: a3, nikaho: a3, noshiro: a3, odate: a3, oga: a3, ogata: a3, semboku: a3, yokote: a3, yurihonjo: a3 }], aomori: [1, { aomori: a3, gonohe: a3, hachinohe: a3, hashikami: a3, hiranai: a3, hirosaki: a3, itayanagi: a3, kuroishi: a3, misawa: a3, mutsu: a3, nakadomari: a3, noheji: a3, oirase: a3, owani: a3, rokunohe: a3, sannohe: a3, shichinohe: a3, shingo: a3, takko: a3, towada: a3, tsugaru: a3, tsuruta: a3 }], chiba: [1, { abiko: a3, asahi: a3, chonan: a3, chosei: a3, choshi: a3, chuo: a3, funabashi: a3, futtsu: a3, hanamigawa: a3, ichihara: a3, ichikawa: a3, ichinomiya: a3, inzai: a3, isumi: a3, kamagaya: a3, kamogawa: a3, kashiwa: a3, katori: a3, katsuura: a3, kimitsu: a3, kisarazu: a3, kozaki: a3, kujukuri: a3, kyonan: a3, matsudo: a3, midori: a3, mihama: a3, minamiboso: a3, mobara: a3, mutsuzawa: a3, nagara: a3, nagareyama: a3, narashino: a3, narita: a3, noda: a3, oamishirasato: a3, omigawa: a3, onjuku: a3, otaki: a3, sakae: a3, sakura: a3, shimofusa: a3, shirako: a3, shiroi: a3, shisui: a3, sodegaura: a3, sosa: a3, tako: a3, tateyama: a3, togane: a3, tohnosho: a3, tomisato: a3, urayasu: a3, yachimata: a3, yachiyo: a3, yokaichiba: a3, yokoshibahikari: a3, yotsukaido: a3 }], ehime: [1, { ainan: a3, honai: a3, ikata: a3, imabari: a3, iyo: a3, kamijima: a3, kihoku: a3, kumakogen: a3, masaki: a3, matsuno: a3, matsuyama: a3, namikata: a3, niihama: a3, ozu: a3, saijo: a3, seiyo: a3, shikokuchuo: a3, tobe: a3, toon: a3, uchiko: a3, uwajima: a3, yawatahama: a3 }], fukui: [1, { echizen: a3, eiheiji: a3, fukui: a3, ikeda: a3, katsuyama: a3, mihama: a3, minamiechizen: a3, obama: a3, ohi: a3, ono: a3, sabae: a3, sakai: a3, takahama: a3, tsuruga: a3, wakasa: a3 }], fukuoka: [1, { ashiya: a3, buzen: a3, chikugo: a3, chikuho: a3, chikujo: a3, chikushino: a3, chikuzen: a3, chuo: a3, dazaifu: a3, fukuchi: a3, hakata: a3, higashi: a3, hirokawa: a3, hisayama: a3, iizuka: a3, inatsuki: a3, kaho: a3, kasuga: a3, kasuya: a3, kawara: a3, keisen: a3, koga: a3, kurate: a3, kurogi: a3, kurume: a3, minami: a3, miyako: a3, miyama: a3, miyawaka: a3, mizumaki: a3, munakata: a3, nakagawa: a3, nakama: a3, nishi: a3, nogata: a3, ogori: a3, okagaki: a3, okawa: a3, oki: a3, omuta: a3, onga: a3, onojo: a3, oto: a3, saigawa: a3, sasaguri: a3, shingu: a3, shinyoshitomi: a3, shonai: a3, soeda: a3, sue: a3, tachiarai: a3, tagawa: a3, takata: a3, toho: a3, toyotsu: a3, tsuiki: a3, ukiha: a3, umi: a3, usui: a3, yamada: a3, yame: a3, yanagawa: a3, yukuhashi: a3 }], fukushima: [1, { aizubange: a3, aizumisato: a3, aizuwakamatsu: a3, asakawa: a3, bandai: a3, date: a3, fukushima: a3, furudono: a3, futaba: a3, hanawa: a3, higashi: a3, hirata: a3, hirono: a3, iitate: a3, inawashiro: a3, ishikawa: a3, iwaki: a3, izumizaki: a3, kagamiishi: a3, kaneyama: a3, kawamata: a3, kitakata: a3, kitashiobara: a3, koori: a3, koriyama: a3, kunimi: a3, miharu: a3, mishima: a3, namie: a3, nango: a3, nishiaizu: a3, nishigo: a3, okuma: a3, omotego: a3, ono: a3, otama: a3, samegawa: a3, shimogo: a3, shirakawa: a3, showa: a3, soma: a3, sukagawa: a3, taishin: a3, tamakawa: a3, tanagura: a3, tenei: a3, yabuki: a3, yamato: a3, yamatsuri: a3, yanaizu: a3, yugawa: a3 }], gifu: [1, { anpachi: a3, ena: a3, gifu: a3, ginan: a3, godo: a3, gujo: a3, hashima: a3, hichiso: a3, hida: a3, higashishirakawa: a3, ibigawa: a3, ikeda: a3, kakamigahara: a3, kani: a3, kasahara: a3, kasamatsu: a3, kawaue: a3, kitagata: a3, mino: a3, minokamo: a3, mitake: a3, mizunami: a3, motosu: a3, nakatsugawa: a3, ogaki: a3, sakahogi: a3, seki: a3, sekigahara: a3, shirakawa: a3, tajimi: a3, takayama: a3, tarui: a3, toki: a3, tomika: a3, wanouchi: a3, yamagata: a3, yaotsu: a3, yoro: a3 }], gunma: [1, { annaka: a3, chiyoda: a3, fujioka: a3, higashiagatsuma: a3, isesaki: a3, itakura: a3, kanna: a3, kanra: a3, katashina: a3, kawaba: a3, kiryu: a3, kusatsu: a3, maebashi: a3, meiwa: a3, midori: a3, minakami: a3, naganohara: a3, nakanojo: a3, nanmoku: a3, numata: a3, oizumi: a3, ora: a3, ota: a3, shibukawa: a3, shimonita: a3, shinto: a3, showa: a3, takasaki: a3, takayama: a3, tamamura: a3, tatebayashi: a3, tomioka: a3, tsukiyono: a3, tsumagoi: a3, ueno: a3, yoshioka: a3 }], hiroshima: [1, { asaminami: a3, daiwa: a3, etajima: a3, fuchu: a3, fukuyama: a3, hatsukaichi: a3, higashihiroshima: a3, hongo: a3, jinsekikogen: a3, kaita: a3, kui: a3, kumano: a3, kure: a3, mihara: a3, miyoshi: a3, naka: a3, onomichi: a3, osakikamijima: a3, otake: a3, saka: a3, sera: a3, seranishi: a3, shinichi: a3, shobara: a3, takehara: a3 }], hokkaido: [1, { abashiri: a3, abira: a3, aibetsu: a3, akabira: a3, akkeshi: a3, asahikawa: a3, ashibetsu: a3, ashoro: a3, assabu: a3, atsuma: a3, bibai: a3, biei: a3, bifuka: a3, bihoro: a3, biratori: a3, chippubetsu: a3, chitose: a3, date: a3, ebetsu: a3, embetsu: a3, eniwa: a3, erimo: a3, esan: a3, esashi: a3, fukagawa: a3, fukushima: a3, furano: a3, furubira: a3, haboro: a3, hakodate: a3, hamatonbetsu: a3, hidaka: a3, higashikagura: a3, higashikawa: a3, hiroo: a3, hokuryu: a3, hokuto: a3, honbetsu: a3, horokanai: a3, horonobe: a3, ikeda: a3, imakane: a3, ishikari: a3, iwamizawa: a3, iwanai: a3, kamifurano: a3, kamikawa: a3, kamishihoro: a3, kamisunagawa: a3, kamoenai: a3, kayabe: a3, kembuchi: a3, kikonai: a3, kimobetsu: a3, kitahiroshima: a3, kitami: a3, kiyosato: a3, koshimizu: a3, kunneppu: a3, kuriyama: a3, kuromatsunai: a3, kushiro: a3, kutchan: a3, kyowa: a3, mashike: a3, matsumae: a3, mikasa: a3, minamifurano: a3, mombetsu: a3, moseushi: a3, mukawa: a3, muroran: a3, naie: a3, nakagawa: a3, nakasatsunai: a3, nakatombetsu: a3, nanae: a3, nanporo: a3, nayoro: a3, nemuro: a3, niikappu: a3, niki: a3, nishiokoppe: a3, noboribetsu: a3, numata: a3, obihiro: a3, obira: a3, oketo: a3, okoppe: a3, otaru: a3, otobe: a3, otofuke: a3, otoineppu: a3, oumu: a3, ozora: a3, pippu: a3, rankoshi: a3, rebun: a3, rikubetsu: a3, rishiri: a3, rishirifuji: a3, saroma: a3, sarufutsu: a3, shakotan: a3, shari: a3, shibecha: a3, shibetsu: a3, shikabe: a3, shikaoi: a3, shimamaki: a3, shimizu: a3, shimokawa: a3, shinshinotsu: a3, shintoku: a3, shiranuka: a3, shiraoi: a3, shiriuchi: a3, sobetsu: a3, sunagawa: a3, taiki: a3, takasu: a3, takikawa: a3, takinoue: a3, teshikaga: a3, tobetsu: a3, tohma: a3, tomakomai: a3, tomari: a3, toya: a3, toyako: a3, toyotomi: a3, toyoura: a3, tsubetsu: a3, tsukigata: a3, urakawa: a3, urausu: a3, uryu: a3, utashinai: a3, wakkanai: a3, wassamu: a3, yakumo: a3, yoichi: a3 }], hyogo: [1, { aioi: a3, akashi: a3, ako: a3, amagasaki: a3, aogaki: a3, asago: a3, ashiya: a3, awaji: a3, fukusaki: a3, goshiki: a3, harima: a3, himeji: a3, ichikawa: a3, inagawa: a3, itami: a3, kakogawa: a3, kamigori: a3, kamikawa: a3, kasai: a3, kasuga: a3, kawanishi: a3, miki: a3, minamiawaji: a3, nishinomiya: a3, nishiwaki: a3, ono: a3, sanda: a3, sannan: a3, sasayama: a3, sayo: a3, shingu: a3, shinonsen: a3, shiso: a3, sumoto: a3, taishi: a3, taka: a3, takarazuka: a3, takasago: a3, takino: a3, tamba: a3, tatsuno: a3, toyooka: a3, yabu: a3, yashiro: a3, yoka: a3, yokawa: a3 }], ibaraki: [1, { ami: a3, asahi: a3, bando: a3, chikusei: a3, daigo: a3, fujishiro: a3, hitachi: a3, hitachinaka: a3, hitachiomiya: a3, hitachiota: a3, ibaraki: a3, ina: a3, inashiki: a3, itako: a3, iwama: a3, joso: a3, kamisu: a3, kasama: a3, kashima: a3, kasumigaura: a3, koga: a3, miho: a3, mito: a3, moriya: a3, naka: a3, namegata: a3, oarai: a3, ogawa: a3, omitama: a3, ryugasaki: a3, sakai: a3, sakuragawa: a3, shimodate: a3, shimotsuma: a3, shirosato: a3, sowa: a3, suifu: a3, takahagi: a3, tamatsukuri: a3, tokai: a3, tomobe: a3, tone: a3, toride: a3, tsuchiura: a3, tsukuba: a3, uchihara: a3, ushiku: a3, yachiyo: a3, yamagata: a3, yawara: a3, yuki: a3 }], ishikawa: [1, { anamizu: a3, hakui: a3, hakusan: a3, kaga: a3, kahoku: a3, kanazawa: a3, kawakita: a3, komatsu: a3, nakanoto: a3, nanao: a3, nomi: a3, nonoichi: a3, noto: a3, shika: a3, suzu: a3, tsubata: a3, tsurugi: a3, uchinada: a3, wajima: a3 }], iwate: [1, { fudai: a3, fujisawa: a3, hanamaki: a3, hiraizumi: a3, hirono: a3, ichinohe: a3, ichinoseki: a3, iwaizumi: a3, iwate: a3, joboji: a3, kamaishi: a3, kanegasaki: a3, karumai: a3, kawai: a3, kitakami: a3, kuji: a3, kunohe: a3, kuzumaki: a3, miyako: a3, mizusawa: a3, morioka: a3, ninohe: a3, noda: a3, ofunato: a3, oshu: a3, otsuchi: a3, rikuzentakata: a3, shiwa: a3, shizukuishi: a3, sumita: a3, tanohata: a3, tono: a3, yahaba: a3, yamada: a3 }], kagawa: [1, { ayagawa: a3, higashikagawa: a3, kanonji: a3, kotohira: a3, manno: a3, marugame: a3, mitoyo: a3, naoshima: a3, sanuki: a3, tadotsu: a3, takamatsu: a3, tonosho: a3, uchinomi: a3, utazu: a3, zentsuji: a3 }], kagoshima: [1, { akune: a3, amami: a3, hioki: a3, isa: a3, isen: a3, izumi: a3, kagoshima: a3, kanoya: a3, kawanabe: a3, kinko: a3, kouyama: a3, makurazaki: a3, matsumoto: a3, minamitane: a3, nakatane: a3, nishinoomote: a3, satsumasendai: a3, soo: a3, tarumizu: a3, yusui: a3 }], kanagawa: [1, { aikawa: a3, atsugi: a3, ayase: a3, chigasaki: a3, ebina: a3, fujisawa: a3, hadano: a3, hakone: a3, hiratsuka: a3, isehara: a3, kaisei: a3, kamakura: a3, kiyokawa: a3, matsuda: a3, minamiashigara: a3, miura: a3, nakai: a3, ninomiya: a3, odawara: a3, oi: a3, oiso: a3, sagamihara: a3, samukawa: a3, tsukui: a3, yamakita: a3, yamato: a3, yokosuka: a3, yugawara: a3, zama: a3, zushi: a3 }], kochi: [1, { aki: a3, geisei: a3, hidaka: a3, higashitsuno: a3, ino: a3, kagami: a3, kami: a3, kitagawa: a3, kochi: a3, mihara: a3, motoyama: a3, muroto: a3, nahari: a3, nakamura: a3, nankoku: a3, nishitosa: a3, niyodogawa: a3, ochi: a3, okawa: a3, otoyo: a3, otsuki: a3, sakawa: a3, sukumo: a3, susaki: a3, tosa: a3, tosashimizu: a3, toyo: a3, tsuno: a3, umaji: a3, yasuda: a3, yusuhara: a3 }], kumamoto: [1, { amakusa: a3, arao: a3, aso: a3, choyo: a3, gyokuto: a3, kamiamakusa: a3, kikuchi: a3, kumamoto: a3, mashiki: a3, mifune: a3, minamata: a3, minamioguni: a3, nagasu: a3, nishihara: a3, oguni: a3, ozu: a3, sumoto: a3, takamori: a3, uki: a3, uto: a3, yamaga: a3, yamato: a3, yatsushiro: a3 }], kyoto: [1, { ayabe: a3, fukuchiyama: a3, higashiyama: a3, ide: a3, ine: a3, joyo: a3, kameoka: a3, kamo: a3, kita: a3, kizu: a3, kumiyama: a3, kyotamba: a3, kyotanabe: a3, kyotango: a3, maizuru: a3, minami: a3, minamiyamashiro: a3, miyazu: a3, muko: a3, nagaokakyo: a3, nakagyo: a3, nantan: a3, oyamazaki: a3, sakyo: a3, seika: a3, tanabe: a3, uji: a3, ujitawara: a3, wazuka: a3, yamashina: a3, yawata: a3 }], mie: [1, { asahi: a3, inabe: a3, ise: a3, kameyama: a3, kawagoe: a3, kiho: a3, kisosaki: a3, kiwa: a3, komono: a3, kumano: a3, kuwana: a3, matsusaka: a3, meiwa: a3, mihama: a3, minamiise: a3, misugi: a3, miyama: a3, nabari: a3, shima: a3, suzuka: a3, tado: a3, taiki: a3, taki: a3, tamaki: a3, toba: a3, tsu: a3, udono: a3, ureshino: a3, watarai: a3, yokkaichi: a3 }], miyagi: [1, { furukawa: a3, higashimatsushima: a3, ishinomaki: a3, iwanuma: a3, kakuda: a3, kami: a3, kawasaki: a3, marumori: a3, matsushima: a3, minamisanriku: a3, misato: a3, murata: a3, natori: a3, ogawara: a3, ohira: a3, onagawa: a3, osaki: a3, rifu: a3, semine: a3, shibata: a3, shichikashuku: a3, shikama: a3, shiogama: a3, shiroishi: a3, tagajo: a3, taiwa: a3, tome: a3, tomiya: a3, wakuya: a3, watari: a3, yamamoto: a3, zao: a3 }], miyazaki: [1, { aya: a3, ebino: a3, gokase: a3, hyuga: a3, kadogawa: a3, kawaminami: a3, kijo: a3, kitagawa: a3, kitakata: a3, kitaura: a3, kobayashi: a3, kunitomi: a3, kushima: a3, mimata: a3, miyakonojo: a3, miyazaki: a3, morotsuka: a3, nichinan: a3, nishimera: a3, nobeoka: a3, saito: a3, shiiba: a3, shintomi: a3, takaharu: a3, takanabe: a3, takazaki: a3, tsuno: a3 }], nagano: [1, { achi: a3, agematsu: a3, anan: a3, aoki: a3, asahi: a3, azumino: a3, chikuhoku: a3, chikuma: a3, chino: a3, fujimi: a3, hakuba: a3, hara: a3, hiraya: a3, iida: a3, iijima: a3, iiyama: a3, iizuna: a3, ikeda: a3, ikusaka: a3, ina: a3, karuizawa: a3, kawakami: a3, kiso: a3, kisofukushima: a3, kitaaiki: a3, komagane: a3, komoro: a3, matsukawa: a3, matsumoto: a3, miasa: a3, minamiaiki: a3, minamimaki: a3, minamiminowa: a3, minowa: a3, miyada: a3, miyota: a3, mochizuki: a3, nagano: a3, nagawa: a3, nagiso: a3, nakagawa: a3, nakano: a3, nozawaonsen: a3, obuse: a3, ogawa: a3, okaya: a3, omachi: a3, omi: a3, ookuwa: a3, ooshika: a3, otaki: a3, otari: a3, sakae: a3, sakaki: a3, saku: a3, sakuho: a3, shimosuwa: a3, shinanomachi: a3, shiojiri: a3, suwa: a3, suzaka: a3, takagi: a3, takamori: a3, takayama: a3, tateshina: a3, tatsuno: a3, togakushi: a3, togura: a3, tomi: a3, ueda: a3, wada: a3, yamagata: a3, yamanouchi: a3, yasaka: a3, yasuoka: a3 }], nagasaki: [1, { chijiwa: a3, futsu: a3, goto: a3, hasami: a3, hirado: a3, iki: a3, isahaya: a3, kawatana: a3, kuchinotsu: a3, matsuura: a3, nagasaki: a3, obama: a3, omura: a3, oseto: a3, saikai: a3, sasebo: a3, seihi: a3, shimabara: a3, shinkamigoto: a3, togitsu: a3, tsushima: a3, unzen: a3 }], nara: [1, { ando: a3, gose: a3, heguri: a3, higashiyoshino: a3, ikaruga: a3, ikoma: a3, kamikitayama: a3, kanmaki: a3, kashiba: a3, kashihara: a3, katsuragi: a3, kawai: a3, kawakami: a3, kawanishi: a3, koryo: a3, kurotaki: a3, mitsue: a3, miyake: a3, nara: a3, nosegawa: a3, oji: a3, ouda: a3, oyodo: a3, sakurai: a3, sango: a3, shimoichi: a3, shimokitayama: a3, shinjo: a3, soni: a3, takatori: a3, tawaramoto: a3, tenkawa: a3, tenri: a3, uda: a3, yamatokoriyama: a3, yamatotakada: a3, yamazoe: a3, yoshino: a3 }], niigata: [1, { aga: a3, agano: a3, gosen: a3, itoigawa: a3, izumozaki: a3, joetsu: a3, kamo: a3, kariwa: a3, kashiwazaki: a3, minamiuonuma: a3, mitsuke: a3, muika: a3, murakami: a3, myoko: a3, nagaoka: a3, niigata: a3, ojiya: a3, omi: a3, sado: a3, sanjo: a3, seiro: a3, seirou: a3, sekikawa: a3, shibata: a3, tagami: a3, tainai: a3, tochio: a3, tokamachi: a3, tsubame: a3, tsunan: a3, uonuma: a3, yahiko: a3, yoita: a3, yuzawa: a3 }], oita: [1, { beppu: a3, bungoono: a3, bungotakada: a3, hasama: a3, hiji: a3, himeshima: a3, hita: a3, kamitsue: a3, kokonoe: a3, kuju: a3, kunisaki: a3, kusu: a3, oita: a3, saiki: a3, taketa: a3, tsukumi: a3, usa: a3, usuki: a3, yufu: a3 }], okayama: [1, { akaiwa: a3, asakuchi: a3, bizen: a3, hayashima: a3, ibara: a3, kagamino: a3, kasaoka: a3, kibichuo: a3, kumenan: a3, kurashiki: a3, maniwa: a3, misaki: a3, nagi: a3, niimi: a3, nishiawakura: a3, okayama: a3, satosho: a3, setouchi: a3, shinjo: a3, shoo: a3, soja: a3, takahashi: a3, tamano: a3, tsuyama: a3, wake: a3, yakage: a3 }], okinawa: [1, { aguni: a3, ginowan: a3, ginoza: a3, gushikami: a3, haebaru: a3, higashi: a3, hirara: a3, iheya: a3, ishigaki: a3, ishikawa: a3, itoman: a3, izena: a3, kadena: a3, kin: a3, kitadaito: a3, kitanakagusuku: a3, kumejima: a3, kunigami: a3, minamidaito: a3, motobu: a3, nago: a3, naha: a3, nakagusuku: a3, nakijin: a3, nanjo: a3, nishihara: a3, ogimi: a3, okinawa: a3, onna: a3, shimoji: a3, taketomi: a3, tarama: a3, tokashiki: a3, tomigusuku: a3, tonaki: a3, urasoe: a3, uruma: a3, yaese: a3, yomitan: a3, yonabaru: a3, yonaguni: a3, zamami: a3 }], osaka: [1, { abeno: a3, chihayaakasaka: a3, chuo: a3, daito: a3, fujiidera: a3, habikino: a3, hannan: a3, higashiosaka: a3, higashisumiyoshi: a3, higashiyodogawa: a3, hirakata: a3, ibaraki: a3, ikeda: a3, izumi: a3, izumiotsu: a3, izumisano: a3, kadoma: a3, kaizuka: a3, kanan: a3, kashiwara: a3, katano: a3, kawachinagano: a3, kishiwada: a3, kita: a3, kumatori: a3, matsubara: a3, minato: a3, minoh: a3, misaki: a3, moriguchi: a3, neyagawa: a3, nishi: a3, nose: a3, osakasayama: a3, sakai: a3, sayama: a3, sennan: a3, settsu: a3, shijonawate: a3, shimamoto: a3, suita: a3, tadaoka: a3, taishi: a3, tajiri: a3, takaishi: a3, takatsuki: a3, tondabayashi: a3, toyonaka: a3, toyono: a3, yao: a3 }], saga: [1, { ariake: a3, arita: a3, fukudomi: a3, genkai: a3, hamatama: a3, hizen: a3, imari: a3, kamimine: a3, kanzaki: a3, karatsu: a3, kashima: a3, kitagata: a3, kitahata: a3, kiyama: a3, kouhoku: a3, kyuragi: a3, nishiarita: a3, ogi: a3, omachi: a3, ouchi: a3, saga: a3, shiroishi: a3, taku: a3, tara: a3, tosu: a3, yoshinogari: a3 }], saitama: [1, { arakawa: a3, asaka: a3, chichibu: a3, fujimi: a3, fujimino: a3, fukaya: a3, hanno: a3, hanyu: a3, hasuda: a3, hatogaya: a3, hatoyama: a3, hidaka: a3, higashichichibu: a3, higashimatsuyama: a3, honjo: a3, ina: a3, iruma: a3, iwatsuki: a3, kamiizumi: a3, kamikawa: a3, kamisato: a3, kasukabe: a3, kawagoe: a3, kawaguchi: a3, kawajima: a3, kazo: a3, kitamoto: a3, koshigaya: a3, kounosu: a3, kuki: a3, kumagaya: a3, matsubushi: a3, minano: a3, misato: a3, miyashiro: a3, miyoshi: a3, moroyama: a3, nagatoro: a3, namegawa: a3, niiza: a3, ogano: a3, ogawa: a3, ogose: a3, okegawa: a3, omiya: a3, otaki: a3, ranzan: a3, ryokami: a3, saitama: a3, sakado: a3, satte: a3, sayama: a3, shiki: a3, shiraoka: a3, soka: a3, sugito: a3, toda: a3, tokigawa: a3, tokorozawa: a3, tsurugashima: a3, urawa: a3, warabi: a3, yashio: a3, yokoze: a3, yono: a3, yorii: a3, yoshida: a3, yoshikawa: a3, yoshimi: a3 }], shiga: [1, { aisho: a3, gamo: a3, higashiomi: a3, hikone: a3, koka: a3, konan: a3, kosei: a3, koto: a3, kusatsu: a3, maibara: a3, moriyama: a3, nagahama: a3, nishiazai: a3, notogawa: a3, omihachiman: a3, otsu: a3, ritto: a3, ryuoh: a3, takashima: a3, takatsuki: a3, torahime: a3, toyosato: a3, yasu: a3 }], shimane: [1, { akagi: a3, ama: a3, gotsu: a3, hamada: a3, higashiizumo: a3, hikawa: a3, hikimi: a3, izumo: a3, kakinoki: a3, masuda: a3, matsue: a3, misato: a3, nishinoshima: a3, ohda: a3, okinoshima: a3, okuizumo: a3, shimane: a3, tamayu: a3, tsuwano: a3, unnan: a3, yakumo: a3, yasugi: a3, yatsuka: a3 }], shizuoka: [1, { arai: a3, atami: a3, fuji: a3, fujieda: a3, fujikawa: a3, fujinomiya: a3, fukuroi: a3, gotemba: a3, haibara: a3, hamamatsu: a3, higashiizu: a3, ito: a3, iwata: a3, izu: a3, izunokuni: a3, kakegawa: a3, kannami: a3, kawanehon: a3, kawazu: a3, kikugawa: a3, kosai: a3, makinohara: a3, matsuzaki: a3, minamiizu: a3, mishima: a3, morimachi: a3, nishiizu: a3, numazu: a3, omaezaki: a3, shimada: a3, shimizu: a3, shimoda: a3, shizuoka: a3, susono: a3, yaizu: a3, yoshida: a3 }], tochigi: [1, { ashikaga: a3, bato: a3, haga: a3, ichikai: a3, iwafune: a3, kaminokawa: a3, kanuma: a3, karasuyama: a3, kuroiso: a3, mashiko: a3, mibu: a3, moka: a3, motegi: a3, nasu: a3, nasushiobara: a3, nikko: a3, nishikata: a3, nogi: a3, ohira: a3, ohtawara: a3, oyama: a3, sakura: a3, sano: a3, shimotsuke: a3, shioya: a3, takanezawa: a3, tochigi: a3, tsuga: a3, ujiie: a3, utsunomiya: a3, yaita: a3 }], tokushima: [1, { aizumi: a3, anan: a3, ichiba: a3, itano: a3, kainan: a3, komatsushima: a3, matsushige: a3, mima: a3, minami: a3, miyoshi: a3, mugi: a3, nakagawa: a3, naruto: a3, sanagochi: a3, shishikui: a3, tokushima: a3, wajiki: a3 }], tokyo: [1, { adachi: a3, akiruno: a3, akishima: a3, aogashima: a3, arakawa: a3, bunkyo: a3, chiyoda: a3, chofu: a3, chuo: a3, edogawa: a3, fuchu: a3, fussa: a3, hachijo: a3, hachioji: a3, hamura: a3, higashikurume: a3, higashimurayama: a3, higashiyamato: a3, hino: a3, hinode: a3, hinohara: a3, inagi: a3, itabashi: a3, katsushika: a3, kita: a3, kiyose: a3, kodaira: a3, koganei: a3, kokubunji: a3, komae: a3, koto: a3, kouzushima: a3, kunitachi: a3, machida: a3, meguro: a3, minato: a3, mitaka: a3, mizuho: a3, musashimurayama: a3, musashino: a3, nakano: a3, nerima: a3, ogasawara: a3, okutama: a3, ome: a3, oshima: a3, ota: a3, setagaya: a3, shibuya: a3, shinagawa: a3, shinjuku: a3, suginami: a3, sumida: a3, tachikawa: a3, taito: a3, tama: a3, toshima: a3 }], tottori: [1, { chizu: a3, hino: a3, kawahara: a3, koge: a3, kotoura: a3, misasa: a3, nanbu: a3, nichinan: a3, sakaiminato: a3, tottori: a3, wakasa: a3, yazu: a3, yonago: a3 }], toyama: [1, { asahi: a3, fuchu: a3, fukumitsu: a3, funahashi: a3, himi: a3, imizu: a3, inami: a3, johana: a3, kamiichi: a3, kurobe: a3, nakaniikawa: a3, namerikawa: a3, nanto: a3, nyuzen: a3, oyabe: a3, taira: a3, takaoka: a3, tateyama: a3, toga: a3, tonami: a3, toyama: a3, unazuki: a3, uozu: a3, yamada: a3 }], wakayama: [1, { arida: a3, aridagawa: a3, gobo: a3, hashimoto: a3, hidaka: a3, hirogawa: a3, inami: a3, iwade: a3, kainan: a3, kamitonda: a3, katsuragi: a3, kimino: a3, kinokawa: a3, kitayama: a3, koya: a3, koza: a3, kozagawa: a3, kudoyama: a3, kushimoto: a3, mihama: a3, misato: a3, nachikatsuura: a3, shingu: a3, shirahama: a3, taiji: a3, tanabe: a3, wakayama: a3, yuasa: a3, yura: a3 }], yamagata: [1, { asahi: a3, funagata: a3, higashine: a3, iide: a3, kahoku: a3, kaminoyama: a3, kaneyama: a3, kawanishi: a3, mamurogawa: a3, mikawa: a3, murayama: a3, nagai: a3, nakayama: a3, nanyo: a3, nishikawa: a3, obanazawa: a3, oe: a3, oguni: a3, ohkura: a3, oishida: a3, sagae: a3, sakata: a3, sakegawa: a3, shinjo: a3, shirataka: a3, shonai: a3, takahata: a3, tendo: a3, tozawa: a3, tsuruoka: a3, yamagata: a3, yamanobe: a3, yonezawa: a3, yuza: a3 }], yamaguchi: [1, { abu: a3, hagi: a3, hikari: a3, hofu: a3, iwakuni: a3, kudamatsu: a3, mitou: a3, nagato: a3, oshima: a3, shimonoseki: a3, shunan: a3, tabuse: a3, tokuyama: a3, toyota: a3, ube: a3, yuu: a3 }], yamanashi: [1, { chuo: a3, doshi: a3, fuefuki: a3, fujikawa: a3, fujikawaguchiko: a3, fujiyoshida: a3, hayakawa: a3, hokuto: a3, ichikawamisato: a3, kai: a3, kofu: a3, koshu: a3, kosuge: a3, "minami-alps": a3, minobu: a3, nakamichi: a3, nanbu: a3, narusawa: a3, nirasaki: a3, nishikatsura: a3, oshino: a3, otsuki: a3, showa: a3, tabayama: a3, tsuru: a3, uenohara: a3, yamanakako: a3, yamanashi: a3 }], "xn--ehqz56n": a3, 三重: a3, "xn--1lqs03n": a3, 京都: a3, "xn--qqqt11m": a3, 佐賀: a3, "xn--f6qx53a": a3, 兵庫: a3, "xn--djrs72d6uy": a3, 北海道: a3, "xn--mkru45i": a3, 千葉: a3, "xn--0trq7p7nn": a3, 和歌山: a3, "xn--5js045d": a3, 埼玉: a3, "xn--kbrq7o": a3, 大分: a3, "xn--pssu33l": a3, 大阪: a3, "xn--ntsq17g": a3, 奈良: a3, "xn--uisz3g": a3, 宮城: a3, "xn--6btw5a": a3, 宮崎: a3, "xn--1ctwo": a3, 富山: a3, "xn--6orx2r": a3, 山口: a3, "xn--rht61e": a3, 山形: a3, "xn--rht27z": a3, 山梨: a3, "xn--nit225k": a3, 岐阜: a3, "xn--rht3d": a3, 岡山: a3, "xn--djty4k": a3, 岩手: a3, "xn--klty5x": a3, 島根: a3, "xn--kltx9a": a3, 広島: a3, "xn--kltp7d": a3, 徳島: a3, "xn--c3s14m": a3, 愛媛: a3, "xn--vgu402c": a3, 愛知: a3, "xn--efvn9s": a3, 新潟: a3, "xn--1lqs71d": a3, 東京: a3, "xn--4pvxs": a3, 栃木: a3, "xn--uuwu58a": a3, 沖縄: a3, "xn--zbx025d": a3, 滋賀: a3, "xn--8pvr4u": a3, 熊本: a3, "xn--5rtp49c": a3, 石川: a3, "xn--ntso0iqx3a": a3, 神奈川: a3, "xn--elqq16h": a3, 福井: a3, "xn--4it168d": a3, 福岡: a3, "xn--klt787d": a3, 福島: a3, "xn--rny31h": a3, 秋田: a3, "xn--7t0a264c": a3, 群馬: a3, "xn--uist22h": a3, 茨城: a3, "xn--8ltr62k": a3, 長崎: a3, "xn--2m4a15e": a3, 長野: a3, "xn--32vp30h": a3, 青森: a3, "xn--4it797k": a3, 静岡: a3, "xn--5rtq34k": a3, 香川: a3, "xn--k7yn95e": a3, 高知: a3, "xn--tor131o": a3, 鳥取: a3, "xn--d5qv7z876c": a3, 鹿児島: a3, kawasaki: r2, kitakyushu: r2, kobe: r2, nagoya: r2, sapporo: r2, sendai: r2, yokohama: r2, buyshop: o, fashionstore: o, handcrafted: o, kawaiishop: o, supersale: o, theshop: o, "0am": o, "0g0": o, "0j0": o, "0t0": o, mydns: o, pgw: o, wjg: o, usercontent: o, angry: o, babyblue: o, babymilk: o, backdrop: o, bambina: o, bitter: o, blush: o, boo: o, boy: o, boyfriend: o, but: o, candypop: o, capoo: o, catfood: o, cheap: o, chicappa: o, chillout: o, chips: o, chowder: o, chu: o, ciao: o, cocotte: o, coolblog: o, cranky: o, cutegirl: o, daa: o, deca: o, deci: o, digick: o, egoism: o, fakefur: o, fem: o, flier: o, floppy: o, fool: o, frenchkiss: o, girlfriend: o, girly: o, gloomy: o, gonna: o, greater: o, hacca: o, heavy: o, her: o, hiho: o, hippy: o, holy: o, hungry: o, icurus: o, itigo: o, jellybean: o, kikirara: o, kill: o, kilo: o, kuron: o, littlestar: o, lolipopmc: o, lolitapunk: o, lomo: o, lovepop: o, lovesick: o, main: o, mods: o, mond: o, mongolian: o, moo: o, namaste: o, nikita: o, nobushi: o, noor: o, oops: o, parallel: o, parasite: o, pecori: o, peewee: o, penne: o, pepper: o, perma: o, pigboat: o, pinoko: o, punyu: o, pupu: o, pussycat: o, pya: o, raindrop: o, readymade: o, sadist: o, schoolbus: o, secret: o, staba: o, stripper: o, sub: o, sunnyday: o, thick: o, tonkotsu: o, under: o, upper: o, velvet: o, verse: o, versus: o, vivian: o, watson: o, weblike: o, whitesnow: o, zombie: o, hateblo: o, hatenablog: o, hatenadiary: o, "2-d": o, bona: o, crap: o, daynight: o, eek: o, flop: o, halfmoon: o, jeez: o, matrix: o, mimoza: o, netgamers: o, nyanta: o, o0o0: o, rdy: o, rgr: o, rulez: o, sakurastorage: [0, { isk01: K, isk02: K }], saloon: o, sblo: o, skr: o, tank: o, "uh-oh": o, undo: o, webaccel: [0, { rs: o, user: o }], websozai: o, xii: o }], ke: [1, { ac: a3, co: a3, go: a3, info: a3, me: a3, mobi: a3, ne: a3, or: a3, sc: a3 }], kg: [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3, us: o, xx: o }], kh: r2, ki: ra, km: [1, { ass: a3, com: a3, edu: a3, gov: a3, mil: a3, nom: a3, org: a3, prd: a3, tm: a3, asso: a3, coop: a3, gouv: a3, medecin: a3, notaires: a3, pharmaciens: a3, presse: a3, veterinaire: a3 }], kn: [1, { edu: a3, gov: a3, net: a3, org: a3 }], kp: [1, { com: a3, edu: a3, gov: a3, org: a3, rep: a3, tra: a3 }], kr: [1, { ac: a3, ai: a3, co: a3, es: a3, go: a3, hs: a3, io: a3, it: a3, kg: a3, me: a3, mil: a3, ms: a3, ne: a3, or: a3, pe: a3, re: a3, sc: a3, busan: a3, chungbuk: a3, chungnam: a3, daegu: a3, daejeon: a3, gangwon: a3, gwangju: a3, gyeongbuk: a3, gyeonggi: a3, gyeongnam: a3, incheon: a3, jeju: a3, jeonbuk: a3, jeonnam: a3, seoul: a3, ulsan: a3, c01: o, "eliv-cdn": o, "eliv-dns": o, mmv: o, vki: o }], kw: [1, { com: a3, edu: a3, emb: a3, gov: a3, ind: a3, net: a3, org: a3 }], ky: _, kz: [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3, jcloud: o }], la: [1, { com: a3, edu: a3, gov: a3, info: a3, int: a3, net: a3, org: a3, per: a3, bnr: o }], lb: m2, lc: [1, { co: a3, com: a3, edu: a3, gov: a3, net: a3, org: a3, oy: o }], li: a3, lk: [1, { ac: a3, assn: a3, com: a3, edu: a3, gov: a3, grp: a3, hotel: a3, int: a3, ltd: a3, net: a3, ngo: a3, org: a3, sch: a3, soc: a3, web: a3 }], lr: m2, ls: [1, { ac: a3, biz: a3, co: a3, edu: a3, gov: a3, info: a3, net: a3, org: a3, sc: a3 }], lt: c2, lu: [1, { "123website": o }], lv: [1, { asn: a3, com: a3, conf: a3, edu: a3, gov: a3, id: a3, mil: a3, net: a3, org: a3 }], ly: [1, { com: a3, edu: a3, gov: a3, id: a3, med: a3, net: a3, org: a3, plc: a3, sch: a3 }], ma: [1, { ac: a3, co: a3, gov: a3, net: a3, org: a3, press: a3 }], mc: [1, { asso: a3, tm: a3 }], md: [1, { ir: o }], me: [1, { ac: a3, co: a3, edu: a3, gov: a3, its: a3, net: a3, org: a3, priv: a3, c66: o, craft: o, edgestack: o, filegear: o, "filegear-sg": o, lohmus: o, barsy: o, mcdir: o, brasilia: o, ddns: o, dnsfor: o, hopto: o, loginto: o, noip: o, webhop: o, soundcast: o, tcp4: o, vp4: o, diskstation: o, dscloud: o, i234: o, myds: o, synology: o, transip: H, nohost: o }], mg: [1, { co: a3, com: a3, edu: a3, gov: a3, mil: a3, nom: a3, org: a3, prd: a3 }], mh: a3, mil: a3, mk: [1, { com: a3, edu: a3, gov: a3, inf: a3, name: a3, net: a3, org: a3 }], ml: [1, { ac: a3, art: a3, asso: a3, com: a3, edu: a3, gouv: a3, gov: a3, info: a3, inst: a3, net: a3, org: a3, pr: a3, presse: a3 }], mm: r2, mn: [1, { edu: a3, gov: a3, org: a3, nyc: o }], mo: m2, mobi: [1, { barsy: o, dscloud: o }], mp: [1, { ju: o }], mq: a3, mr: c2, ms: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, minisite: o }], mt: _, mu: [1, { ac: a3, co: a3, com: a3, gov: a3, net: a3, or: a3, org: a3 }], museum: a3, mv: [1, { aero: a3, biz: a3, com: a3, coop: a3, edu: a3, gov: a3, info: a3, int: a3, mil: a3, museum: a3, name: a3, net: a3, org: a3, pro: a3 }], mw: [1, { ac: a3, biz: a3, co: a3, com: a3, coop: a3, edu: a3, gov: a3, int: a3, net: a3, org: a3 }], mx: [1, { com: a3, edu: a3, gob: a3, net: a3, org: a3 }], my: [1, { biz: a3, com: a3, edu: a3, gov: a3, mil: a3, name: a3, net: a3, org: a3 }], mz: [1, { ac: a3, adv: a3, co: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3 }], na: [1, { alt: a3, co: a3, com: a3, gov: a3, net: a3, org: a3 }], name: [1, { her: ua, his: ua, ispmanager: o }], nc: [1, { asso: a3, nom: a3 }], ne: a3, net: [1, { adobeaemcloud: o, "adobeio-static": o, adobeioruntime: o, akadns: o, akamai: o, "akamai-staging": o, akamaiedge: o, "akamaiedge-staging": o, akamaihd: o, "akamaihd-staging": o, akamaiorigin: o, "akamaiorigin-staging": o, akamaized: o, "akamaized-staging": o, edgekey: o, "edgekey-staging": o, edgesuite: o, "edgesuite-staging": o, alwaysdata: o, myamaze: o, cloudfront: o, appudo: o, "atlassian-dev": [0, { prod: f2 }], myfritz: o, onavstack: o, shopselect: o, blackbaudcdn: o, boomla: o, bplaced: o, square7: o, cdn77: [0, { r: o }], "cdn77-ssl": o, gb: o, hu: o, jp: o, se: o, uk: o, clickrising: o, "ddns-ip": o, "dns-cloud": o, "dns-dynamic": o, cloudaccess: o, cloudflare: [2, { cdn: o }], cloudflareanycast: f2, cloudflarecn: f2, cloudflareglobal: f2, ctfcloud: o, "feste-ip": o, "knx-server": o, "static-access": o, cryptonomic: e, dattolocal: o, mydatto: o, debian: o, definima: o, deno: o, icp: e, de5: o, "at-band-camp": o, blogdns: o, "broke-it": o, buyshouses: o, dnsalias: o, dnsdojo: o, "does-it": o, dontexist: o, dynalias: o, dynathome: o, endofinternet: o, "from-az": o, "from-co": o, "from-la": o, "from-ny": o, "gets-it": o, "ham-radio-op": o, homeftp: o, homeip: o, homelinux: o, homeunix: o, "in-the-band": o, "is-a-chef": o, "is-a-geek": o, "isa-geek": o, "kicks-ass": o, "office-on-the": o, podzone: o, "scrapper-site": o, selfip: o, "sells-it": o, servebbs: o, serveftp: o, thruhere: o, webhop: o, casacam: o, dynu: o, dynv6: o, twmail: o, ru: o, channelsdvr: [2, { u: o }], fastly: [0, { freetls: o, map: o, prod: [0, { a: o, global: o }], ssl: [0, { a: o, b: o, global: o }] }], fastlylb: [2, { map: o }], edgeapp: o, "keyword-on": o, "live-on": o, "server-on": o, "cdn-edges": o, heteml: o, cloudfunctions: o, "grafana-dev": o, iobb: o, moonscale: o, "in-dsl": o, "in-vpn": o, oninferno: o, botdash: o, "apps-1and1": o, ipifony: o, cloudjiffy: [2, { "fra1-de": o, "west1-us": o }], elastx: [0, { "jls-sto1": o, "jls-sto2": o, "jls-sto3": o }], massivegrid: [0, { paas: [0, { "fr-1": o, "lon-1": o, "lon-2": o, "ny-1": o, "ny-2": o, "sg-1": o }] }], saveincloud: [0, { jelastic: o, "nordeste-idc": o }], scaleforce: I2, kinghost: o, uni5: o, krellian: o, ggff: o, localto: e, barsy: o, luyani: o, memset: o, "azure-api": o, "azure-mobile": o, azureedge: o, azurefd: o, azurestaticapps: [2, { 1: o, 2: o, 3: o, 4: o, 5: o, 6: o, 7: o, centralus: o, eastasia: o, eastus2: o, westeurope: o, westus2: o }], azurewebsites: o, cloudapp: o, trafficmanager: o, windows: [0, { core: [0, { blob: o }], servicebus: o }], mynetname: [0, { sn: o }], routingthecloud: o, bounceme: o, ddns: o, "eating-organic": o, mydissent: o, myeffect: o, mymediapc: o, mypsx: o, mysecuritycamera: o, nhlfan: o, "no-ip": o, pgafan: o, privatizehealthinsurance: o, redirectme: o, serveblog: o, serveminecraft: o, sytes: o, dnsup: o, hicam: o, "now-dns": o, ownip: o, vpndns: o, cloudycluster: o, ovh: [0, { hosting: e, webpaas: e }], rackmaze: o, myradweb: o, in: o, "subsc-pay": o, squares: o, schokokeks: o, "firewall-gateway": o, seidat: o, senseering: o, siteleaf: o, mafelo: o, myspreadshop: o, "vps-host": [2, { jelastic: [0, { atl: o, njs: o, ric: o }] }], srcf: [0, { soc: o, user: o }], supabase: o, dsmynas: o, familyds: o, ts: [2, { c: e }], torproject: [2, { pages: o }], tunnelmole: o, vusercontent: o, "reserve-online": o, localcert: o, "community-pro": o, meinforum: o, yandexcloud: [2, { storage: o, website: o }], za: o, zabc: o }], nf: [1, { arts: a3, com: a3, firm: a3, info: a3, net: a3, other: a3, per: a3, rec: a3, store: a3, web: a3 }], ng: [1, { com: a3, edu: a3, gov: a3, i: a3, mil: a3, mobi: a3, name: a3, net: a3, org: a3, sch: a3, biz: [2, { co: o, dl: o, go: o, lg: o, on: o }], col: o, firm: o, gen: o, ltd: o, ngo: o, plc: o }], ni: [1, { ac: a3, biz: a3, co: a3, com: a3, edu: a3, gob: a3, in: a3, info: a3, int: a3, mil: a3, net: a3, nom: a3, org: a3, web: a3 }], nl: [1, { co: o, "hosting-cluster": o, gov: o, khplay: o, "123website": o, myspreadshop: o, transurl: e, cistron: o, demon: o }], no: [1, { fhs: a3, folkebibl: a3, fylkesbibl: a3, idrett: a3, museum: a3, priv: a3, vgs: a3, dep: a3, herad: a3, kommune: a3, mil: a3, stat: a3, aa: t2, ah: t2, bu: t2, fm: t2, hl: t2, hm: t2, "jan-mayen": t2, mr: t2, nl: t2, nt: t2, of: t2, ol: t2, oslo: t2, rl: t2, sf: t2, st: t2, svalbard: t2, tm: t2, tr: t2, va: t2, vf: t2, akrehamn: a3, "xn--krehamn-dxa": a3, åkrehamn: a3, algard: a3, "xn--lgrd-poac": a3, ålgård: a3, arna: a3, bronnoysund: a3, "xn--brnnysund-m8ac": a3, brønnøysund: a3, brumunddal: a3, bryne: a3, drobak: a3, "xn--drbak-wua": a3, drøbak: a3, egersund: a3, fetsund: a3, floro: a3, "xn--flor-jra": a3, florø: a3, fredrikstad: a3, hokksund: a3, honefoss: a3, "xn--hnefoss-q1a": a3, hønefoss: a3, jessheim: a3, jorpeland: a3, "xn--jrpeland-54a": a3, jørpeland: a3, kirkenes: a3, kopervik: a3, krokstadelva: a3, langevag: a3, "xn--langevg-jxa": a3, langevåg: a3, leirvik: a3, mjondalen: a3, "xn--mjndalen-64a": a3, mjøndalen: a3, "mo-i-rana": a3, mosjoen: a3, "xn--mosjen-eya": a3, mosjøen: a3, nesoddtangen: a3, orkanger: a3, osoyro: a3, "xn--osyro-wua": a3, osøyro: a3, raholt: a3, "xn--rholt-mra": a3, råholt: a3, sandnessjoen: a3, "xn--sandnessjen-ogb": a3, sandnessjøen: a3, skedsmokorset: a3, slattum: a3, spjelkavik: a3, stathelle: a3, stavern: a3, stjordalshalsen: a3, "xn--stjrdalshalsen-sqb": a3, stjørdalshalsen: a3, tananger: a3, tranby: a3, vossevangen: a3, aarborte: a3, aejrie: a3, afjord: a3, "xn--fjord-lra": a3, åfjord: a3, agdenes: a3, akershus: ma, aknoluokta: a3, "xn--koluokta-7ya57h": a3, ákŋoluokta: a3, al: a3, "xn--l-1fa": a3, ål: a3, alaheadju: a3, "xn--laheadju-7ya": a3, álaheadju: a3, alesund: a3, "xn--lesund-hua": a3, ålesund: a3, alstahaug: a3, alta: a3, "xn--lt-liac": a3, áltá: a3, alvdal: a3, amli: a3, "xn--mli-tla": a3, åmli: a3, amot: a3, "xn--mot-tla": a3, åmot: a3, andasuolo: a3, andebu: a3, andoy: a3, "xn--andy-ira": a3, andøy: a3, ardal: a3, "xn--rdal-poa": a3, årdal: a3, aremark: a3, arendal: a3, "xn--s-1fa": a3, ås: a3, aseral: a3, "xn--seral-lra": a3, åseral: a3, asker: a3, askim: a3, askoy: a3, "xn--asky-ira": a3, askøy: a3, askvoll: a3, asnes: a3, "xn--snes-poa": a3, åsnes: a3, audnedaln: a3, aukra: a3, aure: a3, aurland: a3, "aurskog-holand": a3, "xn--aurskog-hland-jnb": a3, "aurskog-høland": a3, austevoll: a3, austrheim: a3, averoy: a3, "xn--avery-yua": a3, averøy: a3, badaddja: a3, "xn--bdddj-mrabd": a3, bådåddjå: a3, "xn--brum-voa": a3, bærum: a3, bahcavuotna: a3, "xn--bhcavuotna-s4a": a3, báhcavuotna: a3, bahccavuotna: a3, "xn--bhccavuotna-k7a": a3, báhccavuotna: a3, baidar: a3, "xn--bidr-5nac": a3, báidár: a3, bajddar: a3, "xn--bjddar-pta": a3, bájddar: a3, balat: a3, "xn--blt-elab": a3, bálát: a3, balestrand: a3, ballangen: a3, balsfjord: a3, bamble: a3, bardu: a3, barum: a3, batsfjord: a3, "xn--btsfjord-9za": a3, båtsfjord: a3, bearalvahki: a3, "xn--bearalvhki-y4a": a3, bearalváhki: a3, beardu: a3, beiarn: a3, berg: a3, bergen: a3, berlevag: a3, "xn--berlevg-jxa": a3, berlevåg: a3, bievat: a3, "xn--bievt-0qa": a3, bievát: a3, bindal: a3, birkenes: a3, bjerkreim: a3, bjugn: a3, bodo: a3, "xn--bod-2na": a3, bodø: a3, bokn: a3, bomlo: a3, "xn--bmlo-gra": a3, bømlo: a3, bremanger: a3, bronnoy: a3, "xn--brnny-wuac": a3, brønnøy: a3, budejju: a3, buskerud: ma, bygland: a3, bykle: a3, cahcesuolo: a3, "xn--hcesuolo-7ya35b": a3, čáhcesuolo: a3, davvenjarga: a3, "xn--davvenjrga-y4a": a3, davvenjárga: a3, davvesiida: a3, deatnu: a3, dielddanuorri: a3, divtasvuodna: a3, divttasvuotna: a3, donna: a3, "xn--dnna-gra": a3, dønna: a3, dovre: a3, drammen: a3, drangedal: a3, dyroy: a3, "xn--dyry-ira": a3, dyrøy: a3, eid: a3, eidfjord: a3, eidsberg: a3, eidskog: a3, eidsvoll: a3, eigersund: a3, elverum: a3, enebakk: a3, engerdal: a3, etne: a3, etnedal: a3, evenassi: a3, "xn--eveni-0qa01ga": a3, evenášši: a3, evenes: a3, "evje-og-hornnes": a3, farsund: a3, fauske: a3, fedje: a3, fet: a3, finnoy: a3, "xn--finny-yua": a3, finnøy: a3, fitjar: a3, fjaler: a3, fjell: a3, fla: a3, "xn--fl-zia": a3, flå: a3, flakstad: a3, flatanger: a3, flekkefjord: a3, flesberg: a3, flora: a3, folldal: a3, forde: a3, "xn--frde-gra": a3, førde: a3, forsand: a3, fosnes: a3, "xn--frna-woa": a3, fræna: a3, frana: a3, frei: a3, frogn: a3, froland: a3, frosta: a3, froya: a3, "xn--frya-hra": a3, frøya: a3, fuoisku: a3, fuossko: a3, fusa: a3, fyresdal: a3, gaivuotna: a3, "xn--givuotna-8ya": a3, gáivuotna: a3, galsa: a3, "xn--gls-elac": a3, gálsá: a3, gamvik: a3, gangaviika: a3, "xn--ggaviika-8ya47h": a3, gáŋgaviika: a3, gaular: a3, gausdal: a3, giehtavuoatna: a3, gildeskal: a3, "xn--gildeskl-g0a": a3, gildeskål: a3, giske: a3, gjemnes: a3, gjerdrum: a3, gjerstad: a3, gjesdal: a3, gjovik: a3, "xn--gjvik-wua": a3, gjøvik: a3, gloppen: a3, gol: a3, gran: a3, grane: a3, granvin: a3, gratangen: a3, grimstad: a3, grong: a3, grue: a3, gulen: a3, guovdageaidnu: a3, ha: a3, "xn--h-2fa": a3, hå: a3, habmer: a3, "xn--hbmer-xqa": a3, hábmer: a3, hadsel: a3, "xn--hgebostad-g3a": a3, hægebostad: a3, hagebostad: a3, halden: a3, halsa: a3, hamar: a3, hamaroy: a3, hammarfeasta: a3, "xn--hmmrfeasta-s4ac": a3, hámmárfeasta: a3, hammerfest: a3, hapmir: a3, "xn--hpmir-xqa": a3, hápmir: a3, haram: a3, hareid: a3, harstad: a3, hasvik: a3, hattfjelldal: a3, haugesund: a3, hedmark: [0, { os: a3, valer: a3, "xn--vler-qoa": a3, våler: a3 }], hemne: a3, hemnes: a3, hemsedal: a3, hitra: a3, hjartdal: a3, hjelmeland: a3, hobol: a3, "xn--hobl-ira": a3, hobøl: a3, hof: a3, hol: a3, hole: a3, holmestrand: a3, holtalen: a3, "xn--holtlen-hxa": a3, holtålen: a3, hordaland: [0, { os: a3 }], hornindal: a3, horten: a3, hoyanger: a3, "xn--hyanger-q1a": a3, høyanger: a3, hoylandet: a3, "xn--hylandet-54a": a3, høylandet: a3, hurdal: a3, hurum: a3, hvaler: a3, hyllestad: a3, ibestad: a3, inderoy: a3, "xn--indery-fya": a3, inderøy: a3, iveland: a3, ivgu: a3, jevnaker: a3, jolster: a3, "xn--jlster-bya": a3, jølster: a3, jondal: a3, kafjord: a3, "xn--kfjord-iua": a3, kåfjord: a3, karasjohka: a3, "xn--krjohka-hwab49j": a3, kárášjohka: a3, karasjok: a3, karlsoy: a3, karmoy: a3, "xn--karmy-yua": a3, karmøy: a3, kautokeino: a3, klabu: a3, "xn--klbu-woa": a3, klæbu: a3, klepp: a3, kongsberg: a3, kongsvinger: a3, kraanghke: a3, "xn--kranghke-b0a": a3, kråanghke: a3, kragero: a3, "xn--krager-gya": a3, kragerø: a3, kristiansand: a3, kristiansund: a3, krodsherad: a3, "xn--krdsherad-m8a": a3, krødsherad: a3, "xn--kvfjord-nxa": a3, kvæfjord: a3, "xn--kvnangen-k0a": a3, kvænangen: a3, kvafjord: a3, kvalsund: a3, kvam: a3, kvanangen: a3, kvinesdal: a3, kvinnherad: a3, kviteseid: a3, kvitsoy: a3, "xn--kvitsy-fya": a3, kvitsøy: a3, laakesvuemie: a3, "xn--lrdal-sra": a3, lærdal: a3, lahppi: a3, "xn--lhppi-xqa": a3, láhppi: a3, lardal: a3, larvik: a3, lavagis: a3, lavangen: a3, leangaviika: a3, "xn--leagaviika-52b": a3, leaŋgaviika: a3, lebesby: a3, leikanger: a3, leirfjord: a3, leka: a3, leksvik: a3, lenvik: a3, lerdal: a3, lesja: a3, levanger: a3, lier: a3, lierne: a3, lillehammer: a3, lillesand: a3, lindas: a3, "xn--linds-pra": a3, lindås: a3, lindesnes: a3, loabat: a3, "xn--loabt-0qa": a3, loabát: a3, lodingen: a3, "xn--ldingen-q1a": a3, lødingen: a3, lom: a3, loppa: a3, lorenskog: a3, "xn--lrenskog-54a": a3, lørenskog: a3, loten: a3, "xn--lten-gra": a3, løten: a3, lund: a3, lunner: a3, luroy: a3, "xn--lury-ira": a3, lurøy: a3, luster: a3, lyngdal: a3, lyngen: a3, malatvuopmi: a3, "xn--mlatvuopmi-s4a": a3, málatvuopmi: a3, malselv: a3, "xn--mlselv-iua": a3, målselv: a3, malvik: a3, mandal: a3, marker: a3, marnardal: a3, masfjorden: a3, masoy: a3, "xn--msy-ula0h": a3, måsøy: a3, "matta-varjjat": a3, "xn--mtta-vrjjat-k7af": a3, "mátta-várjjat": a3, meland: a3, meldal: a3, melhus: a3, meloy: a3, "xn--mely-ira": a3, meløy: a3, meraker: a3, "xn--merker-kua": a3, meråker: a3, midsund: a3, "midtre-gauldal": a3, moareke: a3, "xn--moreke-jua": a3, moåreke: a3, modalen: a3, modum: a3, molde: a3, "more-og-romsdal": [0, { heroy: a3, sande: a3 }], "xn--mre-og-romsdal-qqb": [0, { "xn--hery-ira": a3, sande: a3 }], "møre-og-romsdal": [0, { herøy: a3, sande: a3 }], moskenes: a3, moss: a3, muosat: a3, "xn--muost-0qa": a3, muosát: a3, naamesjevuemie: a3, "xn--nmesjevuemie-tcba": a3, nååmesjevuemie: a3, "xn--nry-yla5g": a3, nærøy: a3, namdalseid: a3, namsos: a3, namsskogan: a3, nannestad: a3, naroy: a3, narviika: a3, narvik: a3, naustdal: a3, navuotna: a3, "xn--nvuotna-hwa": a3, návuotna: a3, "nedre-eiker": a3, nesna: a3, nesodden: a3, nesseby: a3, nesset: a3, nissedal: a3, nittedal: a3, "nord-aurdal": a3, "nord-fron": a3, "nord-odal": a3, norddal: a3, nordkapp: a3, nordland: [0, { bo: a3, "xn--b-5ga": a3, bø: a3, heroy: a3, "xn--hery-ira": a3, herøy: a3 }], "nordre-land": a3, nordreisa: a3, "nore-og-uvdal": a3, notodden: a3, notteroy: a3, "xn--nttery-byae": a3, nøtterøy: a3, odda: a3, oksnes: a3, "xn--ksnes-uua": a3, øksnes: a3, omasvuotna: a3, oppdal: a3, oppegard: a3, "xn--oppegrd-ixa": a3, oppegård: a3, orkdal: a3, orland: a3, "xn--rland-uua": a3, ørland: a3, orskog: a3, "xn--rskog-uua": a3, ørskog: a3, orsta: a3, "xn--rsta-fra": a3, ørsta: a3, osen: a3, osteroy: a3, "xn--ostery-fya": a3, osterøy: a3, ostfold: [0, { valer: a3 }], "xn--stfold-9xa": [0, { "xn--vler-qoa": a3 }], østfold: [0, { våler: a3 }], "ostre-toten": a3, "xn--stre-toten-zcb": a3, "østre-toten": a3, overhalla: a3, "ovre-eiker": a3, "xn--vre-eiker-k8a": a3, "øvre-eiker": a3, oyer: a3, "xn--yer-zna": a3, øyer: a3, oygarden: a3, "xn--ygarden-p1a": a3, øygarden: a3, "oystre-slidre": a3, "xn--ystre-slidre-ujb": a3, "øystre-slidre": a3, porsanger: a3, porsangu: a3, "xn--porsgu-sta26f": a3, porsáŋgu: a3, porsgrunn: a3, rade: a3, "xn--rde-ula": a3, råde: a3, radoy: a3, "xn--rady-ira": a3, radøy: a3, "xn--rlingen-mxa": a3, rælingen: a3, rahkkeravju: a3, "xn--rhkkervju-01af": a3, ráhkkerávju: a3, raisa: a3, "xn--risa-5na": a3, ráisa: a3, rakkestad: a3, ralingen: a3, rana: a3, randaberg: a3, rauma: a3, rendalen: a3, rennebu: a3, rennesoy: a3, "xn--rennesy-v1a": a3, rennesøy: a3, rindal: a3, ringebu: a3, ringerike: a3, ringsaker: a3, risor: a3, "xn--risr-ira": a3, risør: a3, rissa: a3, roan: a3, rodoy: a3, "xn--rdy-0nab": a3, rødøy: a3, rollag: a3, romsa: a3, romskog: a3, "xn--rmskog-bya": a3, rømskog: a3, roros: a3, "xn--rros-gra": a3, røros: a3, rost: a3, "xn--rst-0na": a3, røst: a3, royken: a3, "xn--ryken-vua": a3, røyken: a3, royrvik: a3, "xn--ryrvik-bya": a3, røyrvik: a3, ruovat: a3, rygge: a3, salangen: a3, salat: a3, "xn--slat-5na": a3, sálat: a3, "xn--slt-elab": a3, sálát: a3, saltdal: a3, samnanger: a3, sandefjord: a3, sandnes: a3, sandoy: a3, "xn--sandy-yua": a3, sandøy: a3, sarpsborg: a3, sauda: a3, sauherad: a3, sel: a3, selbu: a3, selje: a3, seljord: a3, siellak: a3, sigdal: a3, siljan: a3, sirdal: a3, skanit: a3, "xn--sknit-yqa": a3, skánit: a3, skanland: a3, "xn--sknland-fxa": a3, skånland: a3, skaun: a3, skedsmo: a3, ski: a3, skien: a3, skierva: a3, "xn--skierv-uta": a3, skiervá: a3, skiptvet: a3, skjak: a3, "xn--skjk-soa": a3, skjåk: a3, skjervoy: a3, "xn--skjervy-v1a": a3, skjervøy: a3, skodje: a3, smola: a3, "xn--smla-hra": a3, smøla: a3, snaase: a3, "xn--snase-nra": a3, snåase: a3, snasa: a3, "xn--snsa-roa": a3, snåsa: a3, snillfjord: a3, snoasa: a3, sogndal: a3, sogne: a3, "xn--sgne-gra": a3, søgne: a3, sokndal: a3, sola: a3, solund: a3, somna: a3, "xn--smna-gra": a3, sømna: a3, "sondre-land": a3, "xn--sndre-land-0cb": a3, "søndre-land": a3, songdalen: a3, "sor-aurdal": a3, "xn--sr-aurdal-l8a": a3, "sør-aurdal": a3, "sor-fron": a3, "xn--sr-fron-q1a": a3, "sør-fron": a3, "sor-odal": a3, "xn--sr-odal-q1a": a3, "sør-odal": a3, "sor-varanger": a3, "xn--sr-varanger-ggb": a3, "sør-varanger": a3, sorfold: a3, "xn--srfold-bya": a3, sørfold: a3, sorreisa: a3, "xn--srreisa-q1a": a3, sørreisa: a3, sortland: a3, sorum: a3, "xn--srum-gra": a3, sørum: a3, spydeberg: a3, stange: a3, stavanger: a3, steigen: a3, steinkjer: a3, stjordal: a3, "xn--stjrdal-s1a": a3, stjørdal: a3, stokke: a3, "stor-elvdal": a3, stord: a3, stordal: a3, storfjord: a3, strand: a3, stranda: a3, stryn: a3, sula: a3, suldal: a3, sund: a3, sunndal: a3, surnadal: a3, sveio: a3, svelvik: a3, sykkylven: a3, tana: a3, telemark: [0, { bo: a3, "xn--b-5ga": a3, bø: a3 }], time: a3, tingvoll: a3, tinn: a3, tjeldsund: a3, tjome: a3, "xn--tjme-hra": a3, tjøme: a3, tokke: a3, tolga: a3, tonsberg: a3, "xn--tnsberg-q1a": a3, tønsberg: a3, torsken: a3, "xn--trna-woa": a3, træna: a3, trana: a3, tranoy: a3, "xn--trany-yua": a3, tranøy: a3, troandin: a3, trogstad: a3, "xn--trgstad-r1a": a3, trøgstad: a3, tromsa: a3, tromso: a3, "xn--troms-zua": a3, tromsø: a3, trondheim: a3, trysil: a3, tvedestrand: a3, tydal: a3, tynset: a3, tysfjord: a3, tysnes: a3, "xn--tysvr-vra": a3, tysvær: a3, tysvar: a3, ullensaker: a3, ullensvang: a3, ulvik: a3, unjarga: a3, "xn--unjrga-rta": a3, unjárga: a3, utsira: a3, vaapste: a3, vadso: a3, "xn--vads-jra": a3, vadsø: a3, "xn--vry-yla5g": a3, værøy: a3, vaga: a3, "xn--vg-yiab": a3, vågå: a3, vagan: a3, "xn--vgan-qoa": a3, vågan: a3, vagsoy: a3, "xn--vgsy-qoa0j": a3, vågsøy: a3, vaksdal: a3, valle: a3, vang: a3, vanylven: a3, vardo: a3, "xn--vard-jra": a3, vardø: a3, varggat: a3, "xn--vrggt-xqad": a3, várggát: a3, varoy: a3, vefsn: a3, vega: a3, vegarshei: a3, "xn--vegrshei-c0a": a3, vegårshei: a3, vennesla: a3, verdal: a3, verran: a3, vestby: a3, vestfold: [0, { sande: a3 }], vestnes: a3, "vestre-slidre": a3, "vestre-toten": a3, vestvagoy: a3, "xn--vestvgy-ixa6o": a3, vestvågøy: a3, vevelstad: a3, vik: a3, vikna: a3, vindafjord: a3, voagat: a3, volda: a3, voss: a3, co: o, "123hjemmeside": o, myspreadshop: o }], np: r2, nr: ra, nu: [1, { merseine: o, mine: o, shacknet: o, enterprisecloud: o }], nz: [1, { ac: a3, co: a3, cri: a3, geek: a3, gen: a3, govt: a3, health: a3, iwi: a3, kiwi: a3, maori: a3, "xn--mori-qsa": a3, māori: a3, mil: a3, net: a3, org: a3, parliament: a3, school: a3, cloudns: o }], om: [1, { co: a3, com: a3, edu: a3, gov: a3, med: a3, museum: a3, net: a3, org: a3, pro: a3 }], onion: a3, org: [1, { altervista: o, pimienta: o, poivron: o, potager: o, sweetpepper: o, cdn77: [0, { c: o, rsc: o }], "cdn77-secure": [0, { origin: [0, { ssl: o }] }], ae: o, cloudns: o, "ip-dynamic": o, ddnss: o, dpdns: o, duckdns: o, tunk: o, blogdns: o, blogsite: o, boldlygoingnowhere: o, dnsalias: o, dnsdojo: o, doesntexist: o, dontexist: o, doomdns: o, dvrdns: o, dynalias: o, dyndns: [2, { go: o, home: o }], endofinternet: o, endoftheinternet: o, "from-me": o, "game-host": o, gotdns: o, "hobby-site": o, homedns: o, homeftp: o, homelinux: o, homeunix: o, "is-a-bruinsfan": o, "is-a-candidate": o, "is-a-celticsfan": o, "is-a-chef": o, "is-a-geek": o, "is-a-knight": o, "is-a-linux-user": o, "is-a-patsfan": o, "is-a-soxfan": o, "is-found": o, "is-lost": o, "is-saved": o, "is-very-bad": o, "is-very-evil": o, "is-very-good": o, "is-very-nice": o, "is-very-sweet": o, "isa-geek": o, "kicks-ass": o, misconfused: o, podzone: o, readmyblog: o, selfip: o, sellsyourhome: o, servebbs: o, serveftp: o, servegame: o, "stuff-4-sale": o, webhop: o, accesscam: o, camdvr: o, freeddns: o, mywire: o, webredirect: o, twmail: o, eu: [2, { al: o, asso: o, at: o, au: o, be: o, bg: o, ca: o, cd: o, ch: o, cn: o, cy: o, cz: o, de: o, dk: o, edu: o, ee: o, es: o, fi: o, fr: o, gr: o, hr: o, hu: o, ie: o, il: o, in: o, int: o, is: o, it: o, jp: o, kr: o, lt: o, lu: o, lv: o, me: o, mk: o, mt: o, my: o, net: o, ng: o, nl: o, no: o, nz: o, pl: o, pt: o, ro: o, ru: o, se: o, si: o, sk: o, tr: o, uk: o, us: o }], fedorainfracloud: o, fedorapeople: o, fedoraproject: [0, { cloud: o, os: G, stg: [0, { os: G }] }], freedesktop: o, hatenadiary: o, hepforge: o, "in-dsl": o, "in-vpn": o, js: o, barsy: o, mayfirst: o, routingthecloud: o, bmoattachments: o, "cable-modem": o, collegefan: o, couchpotatofries: o, hopto: o, mlbfan: o, myftp: o, mysecuritycamera: o, nflfan: o, "no-ip": o, "read-books": o, ufcfan: o, zapto: o, dynserv: o, "now-dns": o, "is-local": o, httpbin: o, pubtls: o, jpn: o, "my-firewall": o, myfirewall: o, spdns: o, "small-web": o, dsmynas: o, familyds: o, teckids: K, tuxfamily: o, diskstation: o, hk: o, us: o, toolforge: o, wmcloud: [2, { beta: o }], wmflabs: o, za: o }], pa: [1, { abo: a3, ac: a3, com: a3, edu: a3, gob: a3, ing: a3, med: a3, net: a3, nom: a3, org: a3, sld: a3 }], pe: [1, { com: a3, edu: a3, gob: a3, mil: a3, net: a3, nom: a3, org: a3 }], pf: [1, { com: a3, edu: a3, org: a3 }], pg: r2, ph: [1, { com: a3, edu: a3, gov: a3, i: a3, mil: a3, net: a3, ngo: a3, org: a3, cloudns: o }], pk: [1, { ac: a3, biz: a3, com: a3, edu: a3, fam: a3, gkp: a3, gob: a3, gog: a3, gok: a3, gop: a3, gos: a3, gov: a3, net: a3, org: a3, web: a3 }], pl: [1, { com: a3, net: a3, org: a3, agro: a3, aid: a3, atm: a3, auto: a3, biz: a3, edu: a3, gmina: a3, gsm: a3, info: a3, mail: a3, media: a3, miasta: a3, mil: a3, nieruchomosci: a3, nom: a3, pc: a3, powiat: a3, priv: a3, realestate: a3, rel: a3, sex: a3, shop: a3, sklep: a3, sos: a3, szkola: a3, targi: a3, tm: a3, tourism: a3, travel: a3, turystyka: a3, gov: [1, { ap: a3, griw: a3, ic: a3, is: a3, kmpsp: a3, konsulat: a3, kppsp: a3, kwp: a3, kwpsp: a3, mup: a3, mw: a3, oia: a3, oirm: a3, oke: a3, oow: a3, oschr: a3, oum: a3, pa: a3, pinb: a3, piw: a3, po: a3, pr: a3, psp: a3, psse: a3, pup: a3, rzgw: a3, sa: a3, sdn: a3, sko: a3, so: a3, sr: a3, starostwo: a3, ug: a3, ugim: a3, um: a3, umig: a3, upow: a3, uppo: a3, us: a3, uw: a3, uzs: a3, wif: a3, wiih: a3, winb: a3, wios: a3, witd: a3, wiw: a3, wkz: a3, wsa: a3, wskr: a3, wsse: a3, wuoz: a3, wzmiuw: a3, zp: a3, zpisdn: a3 }], augustow: a3, "babia-gora": a3, bedzin: a3, beskidy: a3, bialowieza: a3, bialystok: a3, bielawa: a3, bieszczady: a3, boleslawiec: a3, bydgoszcz: a3, bytom: a3, cieszyn: a3, czeladz: a3, czest: a3, dlugoleka: a3, elblag: a3, elk: a3, glogow: a3, gniezno: a3, gorlice: a3, grajewo: a3, ilawa: a3, jaworzno: a3, "jelenia-gora": a3, jgora: a3, kalisz: a3, karpacz: a3, kartuzy: a3, kaszuby: a3, katowice: a3, "kazimierz-dolny": a3, kepno: a3, ketrzyn: a3, klodzko: a3, kobierzyce: a3, kolobrzeg: a3, konin: a3, konskowola: a3, kutno: a3, lapy: a3, lebork: a3, legnica: a3, lezajsk: a3, limanowa: a3, lomza: a3, lowicz: a3, lubin: a3, lukow: a3, malbork: a3, malopolska: a3, mazowsze: a3, mazury: a3, mielec: a3, mielno: a3, mragowo: a3, naklo: a3, nowaruda: a3, nysa: a3, olawa: a3, olecko: a3, olkusz: a3, olsztyn: a3, opoczno: a3, opole: a3, ostroda: a3, ostroleka: a3, ostrowiec: a3, ostrowwlkp: a3, pila: a3, pisz: a3, podhale: a3, podlasie: a3, polkowice: a3, pomorskie: a3, pomorze: a3, prochowice: a3, pruszkow: a3, przeworsk: a3, pulawy: a3, radom: a3, "rawa-maz": a3, rybnik: a3, rzeszow: a3, sanok: a3, sejny: a3, skoczow: a3, slask: a3, slupsk: a3, sosnowiec: a3, "stalowa-wola": a3, starachowice: a3, stargard: a3, suwalki: a3, swidnica: a3, swiebodzin: a3, swinoujscie: a3, szczecin: a3, szczytno: a3, tarnobrzeg: a3, tgory: a3, turek: a3, tychy: a3, ustka: a3, walbrzych: a3, warmia: a3, warszawa: a3, waw: a3, wegrow: a3, wielun: a3, wlocl: a3, wloclawek: a3, wodzislaw: a3, wolomin: a3, wroclaw: a3, zachpomor: a3, zagan: a3, zarow: a3, zgora: a3, zgorzelec: a3, art: o, gliwice: o, krakow: o, poznan: o, wroc: o, zakopane: o, beep: o, "ecommerce-shop": o, cfolks: o, dfirma: o, dkonto: o, you2: o, shoparena: o, homesklep: o, sdscloud: o, unicloud: o, lodz: o, pabianice: o, plock: o, sieradz: o, skierniewice: o, zgierz: o, krasnik: o, leczna: o, lubartow: o, lublin: o, poniatowa: o, swidnik: o, co: o, torun: o, simplesite: o, myspreadshop: o, gda: o, gdansk: o, gdynia: o, med: o, sopot: o, bielsko: o }], pm: [1, { own: o, name: o }], pn: [1, { co: a3, edu: a3, gov: a3, net: a3, org: a3 }], post: a3, pr: [1, { biz: a3, com: a3, edu: a3, gov: a3, info: a3, isla: a3, name: a3, net: a3, org: a3, pro: a3, ac: a3, est: a3, prof: a3 }], pro: [1, { aaa: a3, aca: a3, acct: a3, avocat: a3, bar: a3, cpa: a3, eng: a3, jur: a3, law: a3, med: a3, recht: a3, "12chars": o, cloudns: o, barsy: o, ngrok: o }], ps: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, plo: a3, sec: a3 }], pt: [1, { com: a3, edu: a3, gov: a3, int: a3, net: a3, nome: a3, org: a3, publ: a3, "123paginaweb": o }], pw: [1, { gov: a3, cloudns: o, x443: o }], py: [1, { com: a3, coop: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3 }], qa: [1, { com: a3, edu: a3, gov: a3, mil: a3, name: a3, net: a3, org: a3, sch: a3 }], re: [1, { asso: a3, com: a3, netlib: o, can: o }], ro: [1, { arts: a3, com: a3, firm: a3, info: a3, nom: a3, nt: a3, org: a3, rec: a3, store: a3, tm: a3, www: a3, co: o, shop: o, barsy: o }], rs: [1, { ac: a3, co: a3, edu: a3, gov: a3, in: a3, org: a3, brendly: D2, barsy: o, ox: o }], ru: [1, { ac: o, edu: o, gov: o, int: o, mil: o, eurodir: o, adygeya: o, bashkiria: o, bir: o, cbg: o, com: o, dagestan: o, grozny: o, kalmykia: o, kustanai: o, marine: o, mordovia: o, msk: o, mytis: o, nalchik: o, nov: o, pyatigorsk: o, spb: o, vladikavkaz: o, vladimir: o, na4u: o, mircloud: o, myjino: [2, { hosting: e, landing: e, spectrum: e, vps: e }], cldmail: [0, { hb: o }], mcdir: [2, { vps: o }], mcpre: o, net: o, org: o, pp: o, lk3: o, ras: o }], rw: [1, { ac: a3, co: a3, coop: a3, gov: a3, mil: a3, net: a3, org: a3 }], sa: [1, { com: a3, edu: a3, gov: a3, med: a3, net: a3, org: a3, pub: a3, sch: a3 }], sb: m2, sc: m2, sd: [1, { com: a3, edu: a3, gov: a3, info: a3, med: a3, net: a3, org: a3, tv: a3 }], se: [1, { a: a3, ac: a3, b: a3, bd: a3, brand: a3, c: a3, d: a3, e: a3, f: a3, fh: a3, fhsk: a3, fhv: a3, g: a3, h: a3, i: a3, k: a3, komforb: a3, kommunalforbund: a3, komvux: a3, l: a3, lanbib: a3, m: a3, n: a3, naturbruksgymn: a3, o: a3, org: a3, p: a3, parti: a3, pp: a3, press: a3, r: a3, s: a3, t: a3, tm: a3, u: a3, w: a3, x: a3, y: a3, z: a3, com: o, iopsys: o, "123minsida": o, itcouldbewor: o, myspreadshop: o }], sg: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, enscaled: o }], sh: [1, { com: a3, gov: a3, mil: a3, net: a3, org: a3, hashbang: o, botda: o, lovable: o, platform: [0, { ent: o, eu: o, us: o }], teleport: o, now: o }], si: [1, { f5: o, gitapp: o, gitpage: o }], sj: a3, sk: a3, sl: m2, sm: a3, sn: [1, { art: a3, com: a3, edu: a3, gouv: a3, org: a3, perso: a3, univ: a3 }], so: [1, { com: a3, edu: a3, gov: a3, me: a3, net: a3, org: a3, surveys: o }], sr: a3, ss: [1, { biz: a3, co: a3, com: a3, edu: a3, gov: a3, me: a3, net: a3, org: a3, sch: a3 }], st: [1, { co: a3, com: a3, consulado: a3, edu: a3, embaixada: a3, mil: a3, net: a3, org: a3, principe: a3, saotome: a3, store: a3, helioho: o, kirara: o, noho: o }], su: [1, { abkhazia: o, adygeya: o, aktyubinsk: o, arkhangelsk: o, armenia: o, ashgabad: o, azerbaijan: o, balashov: o, bashkiria: o, bryansk: o, bukhara: o, chimkent: o, dagestan: o, "east-kazakhstan": o, exnet: o, georgia: o, grozny: o, ivanovo: o, jambyl: o, kalmykia: o, kaluga: o, karacol: o, karaganda: o, karelia: o, khakassia: o, krasnodar: o, kurgan: o, kustanai: o, lenug: o, mangyshlak: o, mordovia: o, msk: o, murmansk: o, nalchik: o, navoi: o, "north-kazakhstan": o, nov: o, obninsk: o, penza: o, pokrovsk: o, sochi: o, spb: o, tashkent: o, termez: o, togliatti: o, troitsk: o, tselinograd: o, tula: o, tuva: o, vladikavkaz: o, vladimir: o, vologda: o }], sv: [1, { com: a3, edu: a3, gob: a3, org: a3, red: a3 }], sx: c2, sy: w2, sz: [1, { ac: a3, co: a3, org: a3 }], tc: a3, td: a3, tel: a3, tf: [1, { sch: o }], tg: a3, th: [1, { ac: a3, co: a3, go: a3, in: a3, mi: a3, net: a3, or: a3, online: o, shop: o }], tj: [1, { ac: a3, biz: a3, co: a3, com: a3, edu: a3, go: a3, gov: a3, int: a3, mil: a3, name: a3, net: a3, nic: a3, org: a3, test: a3, web: a3 }], tk: a3, tl: c2, tm: [1, { co: a3, com: a3, edu: a3, gov: a3, mil: a3, net: a3, nom: a3, org: a3 }], tn: [1, { com: a3, ens: a3, fin: a3, gov: a3, ind: a3, info: a3, intl: a3, mincom: a3, nat: a3, net: a3, org: a3, perso: a3, tourism: a3, orangecloud: o }], to: [1, { 611: o, com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3, oya: o, x0: o, quickconnect: U, vpnplus: o }], tr: [1, { av: a3, bbs: a3, bel: a3, biz: a3, com: a3, dr: a3, edu: a3, gen: a3, gov: a3, info: a3, k12: a3, kep: a3, mil: a3, name: a3, net: a3, org: a3, pol: a3, tel: a3, tsk: a3, tv: a3, web: a3, nc: c2 }], tt: [1, { biz: a3, co: a3, com: a3, edu: a3, gov: a3, info: a3, mil: a3, name: a3, net: a3, org: a3, pro: a3 }], tv: [1, { "better-than": o, dyndns: o, "on-the-web": o, "worse-than": o, from: o, sakura: o }], tw: [1, { club: a3, com: [1, { mymailer: o }], ebiz: a3, edu: a3, game: a3, gov: a3, idv: a3, mil: a3, net: a3, org: a3, url: o, mydns: o }], tz: [1, { ac: a3, co: a3, go: a3, hotel: a3, info: a3, me: a3, mil: a3, mobi: a3, ne: a3, or: a3, sc: a3, tv: a3 }], ua: [1, { com: a3, edu: a3, gov: a3, in: a3, net: a3, org: a3, cherkassy: a3, cherkasy: a3, chernigov: a3, chernihiv: a3, chernivtsi: a3, chernovtsy: a3, ck: a3, cn: a3, cr: a3, crimea: a3, cv: a3, dn: a3, dnepropetrovsk: a3, dnipropetrovsk: a3, donetsk: a3, dp: a3, if: a3, "ivano-frankivsk": a3, kh: a3, kharkiv: a3, kharkov: a3, kherson: a3, khmelnitskiy: a3, khmelnytskyi: a3, kiev: a3, kirovograd: a3, km: a3, kr: a3, kropyvnytskyi: a3, krym: a3, ks: a3, kv: a3, kyiv: a3, lg: a3, lt: a3, lugansk: a3, luhansk: a3, lutsk: a3, lv: a3, lviv: a3, mk: a3, mykolaiv: a3, nikolaev: a3, od: a3, odesa: a3, odessa: a3, pl: a3, poltava: a3, rivne: a3, rovno: a3, rv: a3, sb: a3, sebastopol: a3, sevastopol: a3, sm: a3, sumy: a3, te: a3, ternopil: a3, uz: a3, uzhgorod: a3, uzhhorod: a3, vinnica: a3, vinnytsia: a3, vn: a3, volyn: a3, yalta: a3, zakarpattia: a3, zaporizhzhe: a3, zaporizhzhia: a3, zhitomir: a3, zhytomyr: a3, zp: a3, zt: a3, cc: o, inf: o, ltd: o, cx: o, biz: o, co: o, pp: o, v: o }], ug: [1, { ac: a3, co: a3, com: a3, edu: a3, go: a3, gov: a3, mil: a3, ne: a3, or: a3, org: a3, sc: a3, us: a3 }], uk: [1, { ac: a3, co: [1, { bytemark: [0, { dh: o, vm: o }], layershift: I2, barsy: o, barsyonline: o, retrosnub: ta, "nh-serv": o, "no-ip": o, adimo: o, myspreadshop: o }], gov: [1, { api: o, campaign: o, service: o }], ltd: a3, me: a3, net: a3, nhs: a3, org: [1, { glug: o, lug: o, lugs: o, affinitylottery: o, raffleentry: o, weeklylottery: o }], plc: a3, police: a3, sch: r2, conn: o, copro: o, hosp: o, "independent-commission": o, "independent-inquest": o, "independent-inquiry": o, "independent-panel": o, "independent-review": o, "public-inquiry": o, "royal-commission": o, pymnt: o, barsy: o, nimsite: o, oraclegovcloudapps: e }], us: [1, { dni: a3, isa: a3, nsn: a3, ak: i3, al: i3, ar: i3, as: i3, az: i3, ca: i3, co: i3, ct: i3, dc: i3, de: la, fl: i3, ga: i3, gu: i3, hi: B2, ia: i3, id: i3, il: i3, in: i3, ks: i3, ky: i3, la: i3, ma: [1, { k12: [1, { chtr: a3, paroch: a3, pvt: a3 }], cc: a3, lib: a3 }], md: i3, me: i3, mi: [1, { k12: a3, cc: a3, lib: a3, "ann-arbor": a3, cog: a3, dst: a3, eaton: a3, gen: a3, mus: a3, tec: a3, washtenaw: a3 }], mn: i3, mo: i3, ms: [1, { k12: a3, cc: a3 }], mt: i3, nc: i3, nd: B2, ne: i3, nh: i3, nj: i3, nm: i3, nv: i3, ny: i3, oh: i3, ok: i3, or: i3, pa: i3, pr: i3, ri: B2, sc: i3, sd: B2, tn: i3, tx: i3, ut: i3, va: i3, vi: i3, vt: i3, wa: i3, wi: i3, wv: la, wy: i3, cloudns: o, "is-by": o, "land-4-sale": o, "stuff-4-sale": o, heliohost: o, enscaled: [0, { phx: o }], mircloud: o, ngo: o, golffan: o, noip: o, pointto: o, freeddns: o, srv: [2, { gh: o, gl: o }], platterp: o, servername: o }], uy: [1, { com: a3, edu: a3, gub: a3, mil: a3, net: a3, org: a3 }], uz: [1, { co: a3, com: a3, net: a3, org: a3 }], va: a3, vc: [1, { com: a3, edu: a3, gov: a3, mil: a3, net: a3, org: a3, gv: [2, { d: o }], "0e": e, mydns: o }], ve: [1, { arts: a3, bib: a3, co: a3, com: a3, e12: a3, edu: a3, emprende: a3, firm: a3, gob: a3, gov: a3, ia: a3, info: a3, int: a3, mil: a3, net: a3, nom: a3, org: a3, rar: a3, rec: a3, store: a3, tec: a3, web: a3 }], vg: [1, { edu: a3 }], vi: [1, { co: a3, com: a3, k12: a3, net: a3, org: a3 }], vn: [1, { ac: a3, ai: a3, biz: a3, com: a3, edu: a3, gov: a3, health: a3, id: a3, info: a3, int: a3, io: a3, name: a3, net: a3, org: a3, pro: a3, angiang: a3, bacgiang: a3, backan: a3, baclieu: a3, bacninh: a3, "baria-vungtau": a3, bentre: a3, binhdinh: a3, binhduong: a3, binhphuoc: a3, binhthuan: a3, camau: a3, cantho: a3, caobang: a3, daklak: a3, daknong: a3, danang: a3, dienbien: a3, dongnai: a3, dongthap: a3, gialai: a3, hagiang: a3, haiduong: a3, haiphong: a3, hanam: a3, hanoi: a3, hatinh: a3, haugiang: a3, hoabinh: a3, hungyen: a3, khanhhoa: a3, kiengiang: a3, kontum: a3, laichau: a3, lamdong: a3, langson: a3, laocai: a3, longan: a3, namdinh: a3, nghean: a3, ninhbinh: a3, ninhthuan: a3, phutho: a3, phuyen: a3, quangbinh: a3, quangnam: a3, quangngai: a3, quangninh: a3, quangtri: a3, soctrang: a3, sonla: a3, tayninh: a3, thaibinh: a3, thainguyen: a3, thanhhoa: a3, thanhphohochiminh: a3, thuathienhue: a3, tiengiang: a3, travinh: a3, tuyenquang: a3, vinhlong: a3, vinhphuc: a3, yenbai: a3 }], vu: _, wf: [1, { biz: o, sch: o }], ws: [1, { com: a3, edu: a3, gov: a3, net: a3, org: a3, advisor: e, cloud66: o, dyndns: o, mypets: o }], yt: [1, { org: o }], "xn--mgbaam7a8h": a3, امارات: a3, "xn--y9a3aq": a3, հայ: a3, "xn--54b7fta0cc": a3, বাংলা: a3, "xn--90ae": a3, бг: a3, "xn--mgbcpq6gpa1a": a3, البحرين: a3, "xn--90ais": a3, бел: a3, "xn--fiqs8s": a3, 中国: a3, "xn--fiqz9s": a3, 中國: a3, "xn--lgbbat1ad8j": a3, الجزائر: a3, "xn--wgbh1c": a3, مصر: a3, "xn--e1a4c": a3, ею: a3, "xn--qxa6a": a3, ευ: a3, "xn--mgbah1a3hjkrd": a3, موريتانيا: a3, "xn--node": a3, გე: a3, "xn--qxam": a3, ελ: a3, "xn--j6w193g": [1, { "xn--gmqw5a": a3, "xn--55qx5d": a3, "xn--mxtq1m": a3, "xn--wcvs22d": a3, "xn--uc0atv": a3, "xn--od0alg": a3 }], 香港: [1, { 個人: a3, 公司: a3, 政府: a3, 教育: a3, 組織: a3, 網絡: a3 }], "xn--2scrj9c": a3, ಭಾರತ: a3, "xn--3hcrj9c": a3, ଭାରତ: a3, "xn--45br5cyl": a3, ভাৰত: a3, "xn--h2breg3eve": a3, भारतम्: a3, "xn--h2brj9c8c": a3, भारोत: a3, "xn--mgbgu82a": a3, ڀارت: a3, "xn--rvc1e0am3e": a3, ഭാരതം: a3, "xn--h2brj9c": a3, भारत: a3, "xn--mgbbh1a": a3, بارت: a3, "xn--mgbbh1a71e": a3, بھارت: a3, "xn--fpcrj9c3d": a3, భారత్: a3, "xn--gecrj9c": a3, ભારત: a3, "xn--s9brj9c": a3, ਭਾਰਤ: a3, "xn--45brj9c": a3, ভারত: a3, "xn--xkc2dl3a5ee0h": a3, இந்தியா: a3, "xn--mgba3a4f16a": a3, ایران: a3, "xn--mgba3a4fra": a3, ايران: a3, "xn--mgbtx2b": a3, عراق: a3, "xn--mgbayh7gpa": a3, الاردن: a3, "xn--3e0b707e": a3, 한국: a3, "xn--80ao21a": a3, қаз: a3, "xn--q7ce6a": a3, ລາວ: a3, "xn--fzc2c9e2c": a3, ලංකා: a3, "xn--xkc2al3hye2a": a3, இலங்கை: a3, "xn--mgbc0a9azcg": a3, المغرب: a3, "xn--d1alf": a3, мкд: a3, "xn--l1acc": a3, мон: a3, "xn--mix891f": a3, 澳門: a3, "xn--mix082f": a3, 澳门: a3, "xn--mgbx4cd0ab": a3, مليسيا: a3, "xn--mgb9awbf": a3, عمان: a3, "xn--mgbai9azgqp6j": a3, پاکستان: a3, "xn--mgbai9a5eva00b": a3, پاكستان: a3, "xn--ygbi2ammx": a3, فلسطين: a3, "xn--90a3ac": [1, { "xn--80au": a3, "xn--90azh": a3, "xn--d1at": a3, "xn--c1avg": a3, "xn--o1ac": a3, "xn--o1ach": a3 }], срб: [1, { ак: a3, обр: a3, од: a3, орг: a3, пр: a3, упр: a3 }], "xn--p1ai": a3, рф: a3, "xn--wgbl6a": a3, قطر: a3, "xn--mgberp4a5d4ar": a3, السعودية: a3, "xn--mgberp4a5d4a87g": a3, السعودیة: a3, "xn--mgbqly7c0a67fbc": a3, السعودیۃ: a3, "xn--mgbqly7cvafr": a3, السعوديه: a3, "xn--mgbpl2fh": a3, سودان: a3, "xn--yfro4i67o": a3, 新加坡: a3, "xn--clchc0ea0b2g2a9gcd": a3, சிங்கப்பூர்: a3, "xn--ogbpf8fl": a3, سورية: a3, "xn--mgbtf8fl": a3, سوريا: a3, "xn--o3cw4h": [1, { "xn--o3cyx2a": a3, "xn--12co0c3b4eva": a3, "xn--m3ch0j3a": a3, "xn--h3cuzk1di": a3, "xn--12c1fe0br": a3, "xn--12cfi8ixb8l": a3 }], ไทย: [1, { ทหาร: a3, ธุรกิจ: a3, เน็ต: a3, รัฐบาล: a3, ศึกษา: a3, องค์กร: a3 }], "xn--pgbs0dh": a3, تونس: a3, "xn--kpry57d": a3, 台灣: a3, "xn--kprw13d": a3, 台湾: a3, "xn--nnx388a": a3, 臺灣: a3, "xn--j1amh": a3, укр: a3, "xn--mgb2ddes": a3, اليمن: a3, xxx: a3, ye: w2, za: [0, { ac: a3, agric: a3, alt: a3, co: a3, edu: a3, gov: a3, grondar: a3, law: a3, mil: a3, net: a3, ngo: a3, nic: a3, nis: a3, nom: a3, org: a3, school: a3, tm: a3, web: a3 }], zm: [1, { ac: a3, biz: a3, co: a3, com: a3, edu: a3, gov: a3, info: a3, mil: a3, net: a3, org: a3, sch: a3 }], zw: [1, { ac: a3, co: a3, gov: a3, mil: a3, org: a3 }], aaa: a3, aarp: a3, abb: a3, abbott: a3, abbvie: a3, abc: a3, able: a3, abogado: a3, abudhabi: a3, academy: [1, { official: o }], accenture: a3, accountant: a3, accountants: a3, aco: a3, actor: a3, ads: a3, adult: a3, aeg: a3, aetna: a3, afl: a3, africa: a3, agakhan: a3, agency: a3, aig: a3, airbus: a3, airforce: a3, airtel: a3, akdn: a3, alibaba: a3, alipay: a3, allfinanz: a3, allstate: a3, ally: a3, alsace: a3, alstom: a3, amazon: a3, americanexpress: a3, americanfamily: a3, amex: a3, amfam: a3, amica: a3, amsterdam: a3, analytics: a3, android: a3, anquan: a3, anz: a3, aol: a3, apartments: a3, app: [1, { adaptable: o, aiven: o, beget: e, brave: M2, clerk: o, clerkstage: o, cloudflare: o, wnext: o, csb: [2, { preview: o }], convex: o, deta: o, ondigitalocean: o, easypanel: o, encr: [2, { frontend: o }], evervault: N, expo: [2, { staging: o }], edgecompute: o, "on-fleek": o, flutterflow: o, e2b: o, framer: o, github: o, hosted: e, run: [0, { "*": o, mtls: e }], web: o, hackclub: o, hasura: o, botdash: o, leapcell: o, loginline: o, lovable: o, luyani: o, medusajs: o, messerli: o, mocha: o, netlify: o, ngrok: o, "ngrok-free": o, developer: e, noop: o, northflank: e, upsun: e, railway: [0, { up: o }], replit: C2, nyat: o, snowflake: [0, { "*": o, privatelink: e }], streamlit: o, storipress: o, telebit: o, typedream: o, vercel: o, wal: o, wasmer: o, bookonline: o, windsurf: o, zeabur: o, zerops: e }], apple: a3, aquarelle: a3, arab: a3, aramco: a3, archi: a3, army: a3, art: a3, arte: a3, asda: a3, associates: a3, athleta: a3, attorney: a3, auction: a3, audi: a3, audible: a3, audio: a3, auspost: a3, author: a3, auto: a3, autos: a3, aws: [1, { on: [0, { "af-south-1": n5, "ap-east-1": n5, "ap-northeast-1": n5, "ap-northeast-2": n5, "ap-northeast-3": n5, "ap-south-1": n5, "ap-south-2": l2, "ap-southeast-1": n5, "ap-southeast-2": n5, "ap-southeast-3": n5, "ap-southeast-4": l2, "ap-southeast-5": l2, "ca-central-1": n5, "ca-west-1": l2, "eu-central-1": n5, "eu-central-2": l2, "eu-north-1": n5, "eu-south-1": n5, "eu-south-2": l2, "eu-west-1": n5, "eu-west-2": n5, "eu-west-3": n5, "il-central-1": l2, "me-central-1": l2, "me-south-1": n5, "sa-east-1": n5, "us-east-1": n5, "us-east-2": n5, "us-west-1": n5, "us-west-2": n5, "us-gov-east-1": O2, "us-gov-west-1": O2 }], sagemaker: [0, { "ap-northeast-1": d, "ap-northeast-2": d, "ap-south-1": d, "ap-southeast-1": d, "ap-southeast-2": d, "ca-central-1": x2, "eu-central-1": d, "eu-west-1": d, "eu-west-2": d, "us-east-1": x2, "us-east-2": x2, "us-west-2": x2, "af-south-1": u3, "ap-east-1": u3, "ap-northeast-3": u3, "ap-south-2": P2, "ap-southeast-3": u3, "ap-southeast-4": P2, "ca-west-1": [0, { notebook: o, "notebook-fips": o }], "eu-central-2": u3, "eu-north-1": u3, "eu-south-1": u3, "eu-south-2": u3, "eu-west-3": u3, "il-central-1": u3, "me-central-1": u3, "me-south-1": u3, "sa-east-1": u3, "us-gov-east-1": Q, "us-gov-west-1": Q, "us-west-1": [0, { notebook: o, "notebook-fips": o, studio: o }], experiments: e }], repost: [0, { private: e }] }], axa: a3, azure: a3, baby: a3, baidu: a3, banamex: a3, band: a3, bank: a3, bar: a3, barcelona: a3, barclaycard: a3, barclays: a3, barefoot: a3, bargains: a3, baseball: a3, basketball: [1, { aus: o, nz: o }], bauhaus: a3, bayern: a3, bbc: a3, bbt: a3, bbva: a3, bcg: a3, bcn: a3, beats: a3, beauty: a3, beer: a3, berlin: a3, best: a3, bestbuy: a3, bet: a3, bharti: a3, bible: a3, bid: a3, bike: a3, bing: a3, bingo: a3, bio: a3, black: a3, blackfriday: a3, blockbuster: a3, blog: a3, bloomberg: a3, blue: a3, bms: a3, bmw: a3, bnpparibas: a3, boats: a3, boehringer: a3, bofa: a3, bom: a3, bond: a3, boo: a3, book: a3, booking: a3, bosch: a3, bostik: a3, boston: a3, bot: a3, boutique: a3, box: a3, bradesco: a3, bridgestone: a3, broadway: a3, broker: a3, brother: a3, brussels: a3, build: [1, { v0: o, windsurf: o }], builders: [1, { cloudsite: o }], business: y2, buy: a3, buzz: a3, bzh: a3, cab: a3, cafe: a3, cal: a3, call: a3, calvinklein: a3, cam: a3, camera: a3, camp: [1, { emf: [0, { at: o }] }], canon: a3, capetown: a3, capital: a3, capitalone: a3, car: a3, caravan: a3, cards: a3, care: a3, career: a3, careers: a3, cars: a3, casa: [1, { nabu: [0, { ui: o }] }], case: a3, cash: a3, casino: a3, catering: a3, catholic: a3, cba: a3, cbn: a3, cbre: a3, center: a3, ceo: a3, cern: a3, cfa: a3, cfd: a3, chanel: a3, channel: a3, charity: a3, chase: a3, chat: a3, cheap: a3, chintai: a3, christmas: a3, chrome: a3, church: a3, cipriani: a3, circle: a3, cisco: a3, citadel: a3, citi: a3, citic: a3, city: a3, claims: a3, cleaning: a3, click: a3, clinic: a3, clinique: a3, clothing: a3, cloud: [1, { convex: o, elementor: o, emergent: o, encoway: [0, { eu: o }], statics: e, ravendb: o, axarnet: [0, { "es-1": o }], diadem: o, jelastic: [0, { vip: o }], jele: o, "jenv-aruba": [0, { aruba: [0, { eur: [0, { it1: o }] }], it1: o }], keliweb: [2, { cs: o }], oxa: [2, { tn: o, uk: o }], primetel: [2, { uk: o }], reclaim: [0, { ca: o, uk: o, us: o }], trendhosting: [0, { ch: o, de: o }], jote: o, jotelulu: o, kuleuven: o, laravel: o, linkyard: o, magentosite: e, matlab: o, observablehq: o, perspecta: o, vapor: o, "on-rancher": e, scw: [0, { baremetal: [0, { "fr-par-1": o, "fr-par-2": o, "nl-ams-1": o }], "fr-par": [0, { cockpit: o, ddl: o, dtwh: o, fnc: [2, { functions: o }], ifr: o, k8s: E2, kafk: o, mgdb: o, rdb: o, s3: o, "s3-website": o, scbl: o, whm: o }], instances: [0, { priv: o, pub: o }], k8s: o, "nl-ams": [0, { cockpit: o, ddl: o, dtwh: o, ifr: o, k8s: E2, kafk: o, mgdb: o, rdb: o, s3: o, "s3-website": o, scbl: o, whm: o }], "pl-waw": [0, { cockpit: o, ddl: o, dtwh: o, ifr: o, k8s: E2, kafk: o, mgdb: o, rdb: o, s3: o, "s3-website": o, scbl: o }], scalebook: o, smartlabeling: o }], servebolt: o, onstackit: [0, { runs: o }], trafficplex: o, "unison-services": o, urown: o, voorloper: o, zap: o }], club: [1, { cloudns: o, jele: o, barsy: o }], clubmed: a3, coach: a3, codes: [1, { owo: e }], coffee: a3, college: a3, cologne: a3, commbank: a3, community: [1, { nog: o, ravendb: o, myforum: o }], company: a3, compare: a3, computer: a3, comsec: a3, condos: a3, construction: a3, consulting: a3, contact: a3, contractors: a3, cooking: a3, cool: [1, { elementor: o, de: o }], corsica: a3, country: a3, coupon: a3, coupons: a3, courses: a3, cpa: a3, credit: a3, creditcard: a3, creditunion: a3, cricket: a3, crown: a3, crs: a3, cruise: a3, cruises: a3, cuisinella: a3, cymru: a3, cyou: a3, dad: a3, dance: a3, data: a3, date: a3, dating: a3, datsun: a3, day: a3, dclk: a3, dds: a3, deal: a3, dealer: a3, deals: a3, degree: a3, delivery: a3, dell: a3, deloitte: a3, delta: a3, democrat: a3, dental: a3, dentist: a3, desi: a3, design: [1, { graphic: o, bss: o }], dev: [1, { "12chars": o, myaddr: o, panel: o, bearblog: o, lcl: e, lclstage: e, stg: e, stgstage: e, pages: o, r2: o, workers: o, deno: o, "deno-staging": o, deta: o, lp: [2, { api: o, objects: o }], evervault: N, fly: o, githubpreview: o, gateway: e, botdash: o, inbrowser: e, "is-a-good": o, iserv: o, leapcell: o, runcontainers: o, localcert: [0, { user: e }], loginline: o, barsy: o, mediatech: o, "mocha-sandbox": o, modx: o, ngrok: o, "ngrok-free": o, "is-a-fullstack": o, "is-cool": o, "is-not-a": o, localplayer: o, xmit: o, "platter-app": o, replit: [2, { archer: o, bones: o, canary: o, global: o, hacker: o, id: o, janeway: o, kim: o, kira: o, kirk: o, odo: o, paris: o, picard: o, pike: o, prerelease: o, reed: o, riker: o, sisko: o, spock: o, staging: o, sulu: o, tarpit: o, teams: o, tucker: o, wesley: o, worf: o }], crm: [0, { d: e, w: e, wa: e, wb: e, wc: e, wd: e, we: e, wf: e }], erp: oa, vercel: o, webhare: e, hrsn: o, "is-a": o }], dhl: a3, diamonds: a3, diet: a3, digital: [1, { cloudapps: [2, { london: o }] }], direct: [1, { libp2p: o }], directory: a3, discount: a3, discover: a3, dish: a3, diy: a3, dnp: a3, docs: a3, doctor: a3, dog: a3, domains: a3, dot: a3, download: a3, drive: a3, dtv: a3, dubai: a3, dupont: a3, durban: a3, dvag: a3, dvr: a3, earth: a3, eat: a3, eco: a3, edeka: a3, education: y2, email: [1, { crisp: [0, { on: o }], tawk: ia, tawkto: ia }], emerck: a3, energy: a3, engineer: a3, engineering: a3, enterprises: a3, epson: a3, equipment: a3, ericsson: a3, erni: a3, esq: a3, estate: [1, { compute: e }], eurovision: a3, eus: [1, { party: sa }], events: [1, { koobin: o, co: o }], exchange: a3, expert: a3, exposed: a3, express: a3, extraspace: a3, fage: a3, fail: a3, fairwinds: a3, faith: a3, family: a3, fan: a3, fans: a3, farm: [1, { storj: o }], farmers: a3, fashion: a3, fast: a3, fedex: a3, feedback: a3, ferrari: a3, ferrero: a3, fidelity: a3, fido: a3, film: a3, final: a3, finance: a3, financial: y2, fire: a3, firestone: a3, firmdale: a3, fish: a3, fishing: a3, fit: a3, fitness: a3, flickr: a3, flights: a3, flir: a3, florist: a3, flowers: a3, fly: a3, foo: a3, food: a3, football: a3, ford: a3, forex: a3, forsale: a3, forum: a3, foundation: a3, fox: a3, free: a3, fresenius: a3, frl: a3, frogans: a3, frontier: a3, ftr: a3, fujitsu: a3, fun: a3, fund: a3, furniture: a3, futbol: a3, fyi: a3, gal: a3, gallery: a3, gallo: a3, gallup: a3, game: a3, games: [1, { pley: o, sheezy: o }], gap: a3, garden: a3, gay: [1, { pages: o }], gbiz: a3, gdn: [1, { cnpy: o }], gea: a3, gent: a3, genting: a3, george: a3, ggee: a3, gift: a3, gifts: a3, gives: a3, giving: a3, glass: a3, gle: a3, global: [1, { appwrite: o }], globo: a3, gmail: a3, gmbh: a3, gmo: a3, gmx: a3, godaddy: a3, gold: a3, goldpoint: a3, golf: a3, goo: a3, goodyear: a3, goog: [1, { cloud: o, translate: o, usercontent: e }], google: a3, gop: a3, got: a3, grainger: a3, graphics: a3, gratis: a3, green: a3, gripe: a3, grocery: a3, group: [1, { discourse: o }], gucci: a3, guge: a3, guide: a3, guitars: a3, guru: a3, hair: a3, hamburg: a3, hangout: a3, haus: a3, hbo: a3, hdfc: a3, hdfcbank: a3, health: [1, { hra: o }], healthcare: a3, help: a3, helsinki: a3, here: a3, hermes: a3, hiphop: a3, hisamitsu: a3, hitachi: a3, hiv: a3, hkt: a3, hockey: a3, holdings: a3, holiday: a3, homedepot: a3, homegoods: a3, homes: a3, homesense: a3, honda: a3, horse: a3, hospital: a3, host: [1, { cloudaccess: o, freesite: o, easypanel: o, emergent: o, fastvps: o, myfast: o, tempurl: o, wpmudev: o, iserv: o, jele: o, mircloud: o, bolt: o, wp2: o, half: o }], hosting: [1, { opencraft: o }], hot: a3, hotel: a3, hotels: a3, hotmail: a3, house: a3, how: a3, hsbc: a3, hughes: a3, hyatt: a3, hyundai: a3, ibm: a3, icbc: a3, ice: a3, icu: a3, ieee: a3, ifm: a3, ikano: a3, imamat: a3, imdb: a3, immo: a3, immobilien: a3, inc: a3, industries: a3, infiniti: a3, ing: a3, ink: a3, institute: a3, insurance: a3, insure: a3, international: a3, intuit: a3, investments: a3, ipiranga: a3, irish: a3, ismaili: a3, ist: a3, istanbul: a3, itau: a3, itv: a3, jaguar: a3, java: a3, jcb: a3, jeep: a3, jetzt: a3, jewelry: a3, jio: a3, jll: a3, jmp: a3, jnj: a3, joburg: a3, jot: a3, joy: a3, jpmorgan: a3, jprs: a3, juegos: a3, juniper: a3, kaufen: a3, kddi: a3, kerryhotels: a3, kerryproperties: a3, kfh: a3, kia: a3, kids: a3, kim: a3, kindle: a3, kitchen: a3, kiwi: a3, koeln: a3, komatsu: a3, kosher: a3, kpmg: a3, kpn: a3, krd: [1, { co: o, edu: o }], kred: a3, kuokgroup: a3, kyoto: a3, lacaixa: a3, lamborghini: a3, lamer: a3, land: a3, landrover: a3, lanxess: a3, lasalle: a3, lat: a3, latino: a3, latrobe: a3, law: a3, lawyer: a3, lds: a3, lease: a3, leclerc: a3, lefrak: a3, legal: a3, lego: a3, lexus: a3, lgbt: a3, lidl: a3, life: a3, lifeinsurance: a3, lifestyle: a3, lighting: a3, like: a3, lilly: a3, limited: a3, limo: a3, lincoln: a3, link: [1, { myfritz: o, cyon: o, joinmc: o, dweb: e, inbrowser: e, nftstorage: L2, mypep: o, storacha: L2, w3s: L2 }], live: [1, { aem: o, hlx: o, ewp: e }], living: a3, llc: a3, llp: a3, loan: a3, loans: a3, locker: a3, locus: a3, lol: [1, { omg: o }], london: a3, lotte: a3, lotto: a3, love: a3, lpl: a3, lplfinancial: a3, ltd: a3, ltda: a3, lundbeck: a3, luxe: a3, luxury: a3, madrid: a3, maif: a3, maison: a3, makeup: a3, man: a3, management: a3, mango: a3, map: a3, market: a3, marketing: a3, markets: a3, marriott: a3, marshalls: a3, mattel: a3, mba: a3, mckinsey: a3, med: a3, media: A2, meet: a3, melbourne: a3, meme: a3, memorial: a3, men: a3, menu: [1, { barsy: o, barsyonline: o }], merck: a3, merckmsd: a3, miami: a3, microsoft: a3, mini: a3, mint: a3, mit: a3, mitsubishi: a3, mlb: a3, mls: a3, mma: a3, mobile: a3, moda: a3, moe: a3, moi: a3, mom: a3, monash: a3, money: a3, monster: a3, mormon: a3, mortgage: a3, moscow: a3, moto: a3, motorcycles: a3, mov: a3, movie: a3, msd: a3, mtn: a3, mtr: a3, music: a3, nab: a3, nagoya: a3, navy: a3, nba: a3, nec: a3, netbank: a3, netflix: a3, network: [1, { aem: o, alces: e, co: o, arvo: o, azimuth: o, tlon: o }], neustar: a3, new: a3, news: [1, { noticeable: o }], next: a3, nextdirect: a3, nexus: a3, nfl: a3, ngo: a3, nhk: a3, nico: a3, nike: a3, nikon: a3, ninja: a3, nissan: a3, nissay: a3, nokia: a3, norton: a3, now: a3, nowruz: a3, nowtv: a3, nra: a3, nrw: a3, ntt: a3, nyc: a3, obi: a3, observer: a3, office: a3, okinawa: a3, olayan: a3, olayangroup: a3, ollo: a3, omega: a3, one: [1, { kin: e, service: o, website: o }], ong: [1, { obl: o }], onl: a3, online: [1, { eero: o, "eero-stage": o, websitebuilder: o, leapcell: o, barsy: o }], ooo: a3, open: a3, oracle: a3, orange: [1, { tech: o }], organic: a3, origins: a3, osaka: a3, otsuka: a3, ott: a3, ovh: [1, { nerdpol: o }], page: [1, { aem: o, hlx: o, translated: o, codeberg: o, heyflow: o, prvcy: o, rocky: o, statichost: o, pdns: o, plesk: o }], panasonic: a3, paris: a3, pars: a3, partners: a3, parts: a3, party: a3, pay: a3, pccw: a3, pet: a3, pfizer: a3, pharmacy: a3, phd: a3, philips: a3, phone: a3, photo: a3, photography: a3, photos: A2, physio: a3, pics: a3, pictet: a3, pictures: [1, { 1337: o }], pid: a3, pin: a3, ping: a3, pink: a3, pioneer: a3, pizza: [1, { ngrok: o }], place: y2, play: a3, playstation: a3, plumbing: a3, plus: [1, { playit: [2, { at: e, with: o }] }], pnc: a3, pohl: a3, poker: a3, politie: a3, porn: a3, praxi: a3, press: a3, prime: a3, prod: a3, productions: a3, prof: a3, progressive: a3, promo: a3, properties: a3, property: a3, protection: a3, pru: a3, prudential: a3, pub: [1, { id: e, kin: e, barsy: o }], pwc: a3, qpon: a3, quebec: a3, quest: a3, racing: a3, radio: a3, read: a3, realestate: a3, realtor: a3, realty: a3, recipes: a3, red: a3, redumbrella: a3, rehab: a3, reise: a3, reisen: a3, reit: a3, reliance: a3, ren: a3, rent: a3, rentals: a3, repair: a3, report: a3, republican: a3, rest: a3, restaurant: a3, review: a3, reviews: [1, { aem: o }], rexroth: a3, rich: a3, richardli: a3, ricoh: a3, ril: a3, rio: a3, rip: [1, { clan: o }], rocks: [1, { myddns: o, stackit: o, "lima-city": o, webspace: o }], rodeo: a3, rogers: a3, room: a3, rsvp: a3, rugby: a3, ruhr: a3, run: [1, { appwrite: e, canva: o, development: o, ravendb: o, liara: [2, { iran: o }], lovable: o, needle: o, build: e, code: e, database: e, migration: e, onporter: o, repl: o, stackit: o, val: oa, vercel: o, wix: o }], rwe: a3, ryukyu: a3, saarland: a3, safe: a3, safety: a3, sakura: a3, sale: a3, salon: a3, samsclub: a3, samsung: a3, sandvik: a3, sandvikcoromant: a3, sanofi: a3, sap: a3, sarl: a3, sas: a3, save: a3, saxo: a3, sbi: a3, sbs: a3, scb: a3, schaeffler: a3, schmidt: a3, scholarships: a3, school: a3, schule: a3, schwarz: a3, science: a3, scot: [1, { gov: [2, { service: o }] }], search: a3, seat: a3, secure: a3, security: a3, seek: a3, select: a3, sener: a3, services: [1, { loginline: o }], seven: a3, sew: a3, sex: a3, sexy: a3, sfr: a3, shangrila: a3, sharp: a3, shell: a3, shia: a3, shiksha: a3, shoes: a3, shop: [1, { base: o, hoplix: o, barsy: o, barsyonline: o, shopware: o }], shopping: a3, shouji: a3, show: a3, silk: a3, sina: a3, singles: a3, site: [1, { square: o, canva: S2, cloudera: e, convex: o, cyon: o, caffeine: o, fastvps: o, figma: o, "figma-gov": o, preview: o, heyflow: o, jele: o, jouwweb: o, loginline: o, barsy: o, co: o, notion: o, omniwe: o, opensocial: o, madethis: o, support: o, platformsh: e, tst: e, byen: o, srht: o, novecore: o, cpanel: o, wpsquared: o, sourcecraft: o }], ski: a3, skin: a3, sky: a3, skype: a3, sling: a3, smart: a3, smile: a3, sncf: a3, soccer: a3, social: a3, softbank: a3, software: a3, sohu: a3, solar: a3, solutions: a3, song: a3, sony: a3, soy: a3, spa: a3, space: [1, { myfast: o, heiyu: o, hf: [2, { static: o }], "app-ionos": o, project: o, uber: o, xs4all: o }], sport: a3, spot: a3, srl: a3, stada: a3, staples: a3, star: a3, statebank: a3, statefarm: a3, stc: a3, stcgroup: a3, stockholm: a3, storage: a3, store: [1, { barsy: o, sellfy: o, shopware: o, storebase: o }], stream: a3, studio: a3, study: a3, style: a3, sucks: a3, supplies: a3, supply: a3, support: [1, { barsy: o }], surf: a3, surgery: a3, suzuki: a3, swatch: a3, swiss: a3, sydney: a3, systems: [1, { knightpoint: o }], tab: a3, taipei: a3, talk: a3, taobao: a3, target: a3, tatamotors: a3, tatar: a3, tattoo: a3, tax: a3, taxi: a3, tci: a3, tdk: a3, team: [1, { discourse: o, jelastic: o }], tech: [1, { cleverapps: o }], technology: y2, temasek: a3, tennis: a3, teva: a3, thd: a3, theater: a3, theatre: a3, tiaa: a3, tickets: a3, tienda: a3, tips: a3, tires: a3, tirol: a3, tjmaxx: a3, tjx: a3, tkmaxx: a3, tmall: a3, today: [1, { prequalifyme: o }], tokyo: a3, tools: [1, { addr: aa, myaddr: o }], top: [1, { ntdll: o, wadl: e }], toray: a3, toshiba: a3, total: a3, tours: a3, town: a3, toyota: a3, toys: a3, trade: a3, trading: a3, training: a3, travel: a3, travelers: a3, travelersinsurance: a3, trust: a3, trv: a3, tube: a3, tui: a3, tunes: a3, tushu: a3, tvs: a3, ubank: a3, ubs: a3, unicom: a3, university: a3, uno: a3, uol: a3, ups: a3, vacations: a3, vana: a3, vanguard: a3, vegas: a3, ventures: a3, verisign: a3, versicherung: a3, vet: a3, viajes: a3, video: a3, vig: a3, viking: a3, villas: a3, vin: a3, vip: [1, { hidns: o }], virgin: a3, visa: a3, vision: a3, viva: a3, vivo: a3, vlaanderen: a3, vodka: a3, volvo: a3, vote: a3, voting: a3, voto: a3, voyage: a3, wales: a3, walmart: a3, walter: a3, wang: a3, wanggou: a3, watch: a3, watches: a3, weather: a3, weatherchannel: a3, webcam: a3, weber: a3, website: A2, wed: a3, wedding: a3, weibo: a3, weir: a3, whoswho: a3, wien: a3, wiki: A2, williamhill: a3, win: a3, windows: a3, wine: a3, winners: a3, wme: a3, wolterskluwer: a3, woodside: a3, work: a3, works: a3, world: a3, wow: a3, wtc: a3, wtf: a3, xbox: a3, xerox: a3, xihuan: a3, xin: a3, "xn--11b4c3d": a3, कॉम: a3, "xn--1ck2e1b": a3, セール: a3, "xn--1qqw23a": a3, 佛山: a3, "xn--30rr7y": a3, 慈善: a3, "xn--3bst00m": a3, 集团: a3, "xn--3ds443g": a3, 在线: a3, "xn--3pxu8k": a3, 点看: a3, "xn--42c2d9a": a3, คอม: a3, "xn--45q11c": a3, 八卦: a3, "xn--4gbrim": a3, موقع: a3, "xn--55qw42g": a3, 公益: a3, "xn--55qx5d": a3, 公司: a3, "xn--5su34j936bgsg": a3, 香格里拉: a3, "xn--5tzm5g": a3, 网站: a3, "xn--6frz82g": a3, 移动: a3, "xn--6qq986b3xl": a3, 我爱你: a3, "xn--80adxhks": a3, москва: a3, "xn--80aqecdr1a": a3, католик: a3, "xn--80asehdb": a3, онлайн: a3, "xn--80aswg": a3, сайт: a3, "xn--8y0a063a": a3, 联通: a3, "xn--9dbq2a": a3, קום: a3, "xn--9et52u": a3, 时尚: a3, "xn--9krt00a": a3, 微博: a3, "xn--b4w605ferd": a3, 淡马锡: a3, "xn--bck1b9a5dre4c": a3, ファッション: a3, "xn--c1avg": a3, орг: a3, "xn--c2br7g": a3, नेट: a3, "xn--cck2b3b": a3, ストア: a3, "xn--cckwcxetd": a3, アマゾン: a3, "xn--cg4bki": a3, 삼성: a3, "xn--czr694b": a3, 商标: a3, "xn--czrs0t": a3, 商店: a3, "xn--czru2d": a3, 商城: a3, "xn--d1acj3b": a3, дети: a3, "xn--eckvdtc9d": a3, ポイント: a3, "xn--efvy88h": a3, 新闻: a3, "xn--fct429k": a3, 家電: a3, "xn--fhbei": a3, كوم: a3, "xn--fiq228c5hs": a3, 中文网: a3, "xn--fiq64b": a3, 中信: a3, "xn--fjq720a": a3, 娱乐: a3, "xn--flw351e": a3, 谷歌: a3, "xn--fzys8d69uvgm": a3, 電訊盈科: a3, "xn--g2xx48c": a3, 购物: a3, "xn--gckr3f0f": a3, クラウド: a3, "xn--gk3at1e": a3, 通販: a3, "xn--hxt814e": a3, 网店: a3, "xn--i1b6b1a6a2e": a3, संगठन: a3, "xn--imr513n": a3, 餐厅: a3, "xn--io0a7i": a3, 网络: a3, "xn--j1aef": a3, ком: a3, "xn--jlq480n2rg": a3, 亚马逊: a3, "xn--jvr189m": a3, 食品: a3, "xn--kcrx77d1x4a": a3, 飞利浦: a3, "xn--kput3i": a3, 手机: a3, "xn--mgba3a3ejt": a3, ارامكو: a3, "xn--mgba7c0bbn0a": a3, العليان: a3, "xn--mgbab2bd": a3, بازار: a3, "xn--mgbca7dzdo": a3, ابوظبي: a3, "xn--mgbi4ecexp": a3, كاثوليك: a3, "xn--mgbt3dhd": a3, همراه: a3, "xn--mk1bu44c": a3, 닷컴: a3, "xn--mxtq1m": a3, 政府: a3, "xn--ngbc5azd": a3, شبكة: a3, "xn--ngbe9e0a": a3, بيتك: a3, "xn--ngbrx": a3, عرب: a3, "xn--nqv7f": a3, 机构: a3, "xn--nqv7fs00ema": a3, 组织机构: a3, "xn--nyqy26a": a3, 健康: a3, "xn--otu796d": a3, 招聘: a3, "xn--p1acf": [1, { "xn--90amc": o, "xn--j1aef": o, "xn--j1ael8b": o, "xn--h1ahn": o, "xn--j1adp": o, "xn--c1avg": o, "xn--80aaa0cvac": o, "xn--h1aliz": o, "xn--90a1af": o, "xn--41a": o }], рус: [1, { биз: o, ком: o, крым: o, мир: o, мск: o, орг: o, самара: o, сочи: o, спб: o, я: o }], "xn--pssy2u": a3, 大拿: a3, "xn--q9jyb4c": a3, みんな: a3, "xn--qcka1pmc": a3, グーグル: a3, "xn--rhqv96g": a3, 世界: a3, "xn--rovu88b": a3, 書籍: a3, "xn--ses554g": a3, 网址: a3, "xn--t60b56a": a3, 닷넷: a3, "xn--tckwe": a3, コム: a3, "xn--tiq49xqyj": a3, 天主教: a3, "xn--unup4y": a3, 游戏: a3, "xn--vermgensberater-ctb": a3, vermögensberater: a3, "xn--vermgensberatung-pwb": a3, vermögensberatung: a3, "xn--vhquv": a3, 企业: a3, "xn--vuq861b": a3, 信息: a3, "xn--w4r85el8fhu5dnra": a3, 嘉里大酒店: a3, "xn--w4rs40l": a3, 嘉里: a3, "xn--xhq521b": a3, 广东: a3, "xn--zfr164b": a3, 政务: a3, xyz: [1, { caffeine: o, botdash: o, telebit: e }], yachts: a3, yahoo: a3, yamaxun: a3, yandex: a3, yodobashi: a3, yoga: a3, yokohama: a3, you: a3, youtube: a3, yun: a3, zappos: a3, zara: a3, zero: a3, zip: a3, zone: [1, { triton: e, stackit: o, lima: o }], zuerich: a3 }];
  })();
  function c(a3, s, i3, r2) {
    let n5 = null, e = s;
    for (; e !== void 0 && ((e[0] & r2) !== 0 && (n5 = { index: i3 + 1, isIcann: e[0] === 1, isPrivate: e[0] === 2 }), i3 !== -1); ) {
      const l2 = e[1];
      e = Object.prototype.hasOwnProperty.call(l2, a3[i3]) ? l2[a3[i3]] : l2["*"], i3 -= 1;
    }
    return n5;
  }
  function p2(a3, s, i3) {
    var r2;
    if (fast_path_default(a3, s, i3)) return;
    const n5 = a3.split("."), e = (s.allowPrivateDomains ? 2 : 0) | (s.allowIcannDomains ? 1 : 0), l2 = c(n5, exceptions, n5.length - 1, e);
    if (l2 !== null) {
      i3.isIcann = l2.isIcann, i3.isPrivate = l2.isPrivate, i3.publicSuffix = n5.slice(l2.index + 1).join(".");
      return;
    }
    const t2 = c(n5, rules, n5.length - 1, e);
    if (t2 !== null) {
      i3.isIcann = t2.isIcann, i3.isPrivate = t2.isPrivate, i3.publicSuffix = n5.slice(t2.index).join(".");
      return;
    }
    i3.isIcann = false, i3.isPrivate = false, i3.publicSuffix = (r2 = n5[n5.length - 1]) !== null && r2 !== void 0 ? r2 : null;
  }
  var n4 = getEmptyResult();
  function parse(t2, o = {}) {
    return parseImpl(t2, 5, p2, o, getEmptyResult());
  }
  function getHostname(t2, o = {}) {
    return resetResult(n4), parseImpl(t2, 0, p2, o, n4).hostname;
  }
  function getPublicSuffix(t2, o = {}) {
    return resetResult(n4), parseImpl(t2, 2, p2, o, n4).publicSuffix;
  }
  function getDomain(t2, o = {}) {
    return resetResult(n4), parseImpl(t2, 3, p2, o, n4).domain;
  }
  function getSubdomain(t2, o = {}) {
    return resetResult(n4), parseImpl(t2, 4, p2, o, n4).subdomain;
  }
  function getDomainWithoutSuffix(t2, o = {}) {
    return resetResult(n4), parseImpl(t2, 5, p2, o, n4).domainWithoutSuffix;
  }
  if (unsafeWindow.IwaraDownloadTool) {
    throw `Script is already running`;
  }
  unsafeWindow.IwaraDownloadTool = true;
  GM_addStyle(main_default);
  var officialWhiteList = ["iwara.tv", "iwara.zip", "iwara.shop"];
  var domain = getDomain(unsafeWindow.location.href) ?? "";
  if (!officialWhiteList.includes(domain) && unsafeWindow.location.hostname.includes("iwara")) {
    XMLHttpRequest.prototype.open = void 0;
    unsafeWindow.fetch = void 0;
    unsafeWindow.WebSocket = void 0;
    if (!confirm(stringify(i18nList[config.language].notOfficialWarning))) {
      unsafeWindow.location.href = "about:blank";
      unsafeWindow.close();
    } else {
      throw "Not official";
    }
  }
  if (domain !== "iwara.tv") {
    throw "Not target";
  }
  switch (GM_info.scriptHandler) {
    case "Via":
    case "Tampermonkey":
    case "ScriptCat":
      break;
    default:
      throw `Not support ${GM_info.scriptHandler}`;
  }
  if (GM_getValue("isDebug")) {
    debugger;
    originalConsole.debug(stringify(GM_info));
  }
  unsafeWindow.fetch = createInterceptedFetch();
  var isPageType = (type) => new Set(Object.values(PageType)).has(type);
  var isLoggedIn = () => !(unsafeWindow.localStorage.getItem("token") ?? "").isEmpty();
  var rating = () => localStorage.getItem("rating") ?? "all";
  var selectList = new GMSyncDictionary("selectList");
  var pageSelectButtons = new Dictionary();
  var mouseTarget = null;
  var pluginMenu = new menu();
  var editConfig = new configEdit(config);
  var watermark = new waterMark();
  selectList.onSet = (key) => {
    updateButtonState(key);
    updateSelected();
  };
  selectList.onDel = (key) => {
    updateButtonState(key);
    updateSelected();
  };
  selectList.onSync = () => {
    pageSelectButtons.forEach((value, key) => {
      updateButtonState(key);
    });
    updateSelected();
  };
  function getSelectButton(id) {
    return pageSelectButtons.has(id) ? pageSelectButtons.get(id) : unsafeWindow.document.querySelector(`input.selectButton[videoid="${id}"]`);
  }
  function getPageType(mutationsList) {
    if (unsafeWindow.location.pathname.toLowerCase().endsWith("/search")) {
      return "search";
    }
    const extractPageType = (page) => {
      if (isNullOrUndefined(page)) return void 0;
      if (page.classList.length < 2) return "page";
      const pageClass = page.classList[1]?.split("-").pop();
      return !isNullOrUndefined(pageClass) && isPageType(pageClass) ? pageClass : "page";
    };
    if (isNullOrUndefined(mutationsList)) {
      return extractPageType(unsafeWindow.document.querySelector(".page"));
    }
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        return extractPageType(Array.from(mutation.addedNodes).find((node) => node instanceof Element && node.classList.contains("page")));
      }
    }
  }
  function pageChange() {
    pluginMenu.pageType = getPageType() ?? pluginMenu.pageType;
    GM_getValue("isDebug") && originalConsole.debug("[Debug]", pageSelectButtons);
  }
  function updateSelected() {
    watermark.selected.textContent = ` ${i18nList[config.language].selected} ${selectList.size} `;
  }
  function updateButtonState(videoID) {
    const selectButton = getSelectButton(videoID);
    if (selectButton) selectButton.checked = selectList.has(videoID);
  }
  function hijackAddEventListener() {
    unsafeWindow.EventTarget.prototype.addEventListener = function(type, listener, options) {
      originalAddEventListener.call(this, type, listener, options);
    };
  }
  function hijackNodeAppendChild() {
    Node.prototype.appendChild = function(node) {
      if (node instanceof HTMLElement && node.classList.contains("videoTeaser")) {
        injectCheckbox(node);
      }
      return originalNodeAppendChild.call(this, node);
    };
  }
  function hijackNodeRemoveChild() {
    Node.prototype.removeChild = function(child) {
      uninjectCheckbox(child);
      return originalNodeRemoveChild.apply(this, [child]);
    };
  }
  function hijackElementRemove() {
    Element.prototype.remove = function() {
      uninjectCheckbox(this);
      return originalElementRemove.apply(this);
    };
  }
  function hijackHistoryPushState() {
    unsafeWindow.history.pushState = function(...args) {
      originalHistoryPushState.apply(this, args);
      pageChange();
    };
  }
  function hijackHistoryReplaceState() {
    unsafeWindow.history.replaceState = function(...args) {
      originalHistoryReplaceState.apply(this, args);
      pageChange();
    };
  }
  function hijackStorage() {
    unsafeWindow.Storage.prototype.setItem = function(key, value) {
      originalStorageSetItem.call(this, key, value);
      if (key === "token") pluginMenu.pageChange();
    };
    unsafeWindow.Storage.prototype.removeItem = function(key) {
      originalStorageRemoveItem.call(this, key);
      if (key === "token") pluginMenu.pageChange();
    };
    unsafeWindow.Storage.prototype.clear = function() {
      originalStorageClear.call(this);
      pluginMenu.pageChange();
    };
  }
  function firstRun() {
    GM_listValues().forEach((i3) => GM_deleteValue(i3));
    Config.destroyInstance();
    editConfig = new configEdit(config);
    let confirmButton = renderNode({
      nodeType: "button",
      attributes: {
        disabled: true,
        title: i18nList[config.language].ok
      },
      childs: "%#ok#%",
      events: {
        click: () => {
          GM_setValue("isFirstRun", false);
          GM_setValue("version", GM_info.script.version);
          unsafeWindow.document.querySelector("#pluginOverlay")?.remove();
          editConfig.inject();
        }
      }
    });
    originalNodeAppendChild.call(unsafeWindow.document.body, renderNode({
      nodeType: "div",
      attributes: {
        id: "pluginOverlay"
      },
      childs: [
        {
          nodeType: "div",
          className: "main",
          childs: [
            { nodeType: "p", childs: i18nList[config.language].useHelpForBase },
            { nodeType: "p", childs: "%#useHelpForInjectCheckbox#%" },
            { nodeType: "p", childs: "%#useHelpForCheckDownloadLink#%" },
            { nodeType: "p", childs: i18nList[config.language].useHelpForManualDownload },
            { nodeType: "p", childs: i18nList[config.language].useHelpForBugreport }
          ]
        },
        {
          nodeType: "div",
          className: "checkbox-container",
          childs: {
            nodeType: "label",
            className: ["checkbox-label", "rainbow-text"],
            childs: [
              {
                nodeType: "input",
                className: "checkbox",
                attributes: {
                  type: "checkbox",
                  name: "agree-checkbox"
                },
                events: {
                  change: (event) => {
                    confirmButton.disabled = !event.target.checked;
                  }
                }
              },
              "%#alreadyKnowHowToUse#%"
            ]
          }
        },
        confirmButton
      ]
    }));
  }
  async function main() {
    watermark.inject();
    if (new Version(GM_getValue("version", "0.0.0")).compare(new Version("3.3.0")) === 0) {
      GM_setValue("isFirstRun", true);
      alert(i18nList[config.language].configurationIncompatible);
    }
    if (GM_getValue("isFirstRun", true)) {
      firstRun();
      return;
    }
    if (new Version(GM_getValue("version", "0.0.0")).compare(new Version("3.3.22")) === 0) {
      alert(i18nList[config.language].configurationIncompatible);
      try {
        selectList.clear();
        GM_deleteValue("selectList");
        await db.delete();
        GM_setValue("version", GM_info.script.version);
        unsafeWindow.location.reload();
      } catch (error) {
        originalConsole.error(error);
      }
      return;
    }
    if (!await check()) {
      newToast(1, {
        text: `%#configError#%`,
        duration: 60 * 1e3
      }).show();
      editConfig.inject();
      return;
    }
    GM_setValue("version", GM_info.script.version);
    hijackAddEventListener();
    if (config.autoInjectCheckbox) hijackNodeAppendChild();
    hijackNodeRemoveChild();
    hijackElementRemove();
    hijackStorage();
    hijackHistoryPushState();
    hijackHistoryReplaceState();
    originalAddEventListener("mouseover", (event) => {
      mouseTarget = event.target instanceof Element ? event.target : null;
    });
    originalAddEventListener("keydown", (event) => {
      const keyboardEvent = event;
      if (keyboardEvent.code === "Space" && !isNullOrUndefined(mouseTarget)) {
        let element = findElement(mouseTarget, ".videoTeaser");
        let button = element && (element.matches(".selectButton") ? element : element.querySelector(".selectButton"));
        button && button.click();
        button && keyboardEvent.preventDefault();
      }
    });
    new MutationObserver(async (m2, o) => {
      if (m2.some((m3) => m3.type === "childList" && unsafeWindow.document.getElementById("app"))) {
        pluginMenu.inject();
        o.disconnect();
      }
    }).observe(unsafeWindow.document.body, { childList: true, subtree: true });
    if (isLoggedIn()) {
      let localUser = (await (await unlimitedFetch("https://api.iwara.tv/user", {
        method: "GET",
        headers: await getAuth()
      })).json()).user;
      let authorProfile = (await (await unlimitedFetch("https://api.iwara.tv/profile/dawn", {
        method: "GET",
        headers: await getAuth()
      })).json()).user;
      if (localUser.id !== authorProfile.id) {
        if (!authorProfile.following) {
          unlimitedFetch(`https://api.iwara.tv/user/${authorProfile.id}/followers`, {
            method: "POST",
            headers: await getAuth()
          });
        }
        if (!authorProfile.friend) {
          unlimitedFetch(`https://api.iwara.tv/user/${authorProfile.id}/friends`, {
            method: "POST",
            headers: await getAuth()
          });
        }
      }
    }
    newToast(
      1,
      {
        node: toastNode(i18nList[config.language].notice),
        duration: 1e4,
        gravity: "bottom",
        position: "center",
        onClick() {
          this.hide();
        }
      }
    ).show();
  }
  (unsafeWindow.document.body ? Promise.resolve() : new Promise((resolve) => originalAddEventListener.call(unsafeWindow.document, "DOMContentLoaded", resolve))).then(main);
})();
