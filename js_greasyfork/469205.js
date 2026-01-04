// ==UserScript==
// @name         feiyu_auto_post
// @namespace    npm/vite-plugin-monkey-feiyu
// @version      v1.1.7
// @author       monkey
// @description  auto post feiyuClue to formServer
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://feiyu.oceanengine.com/pc/sales/clue/public
// @match        https://life.douyin.com/p/liteapp/leads_life/sales/list
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.7/index.full.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.4.0/axios.min.js
// @resource     ElementPlus  https://cdn.bootcdn.net/ajax/libs/element-plus/2.3.7/index.min.css
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469205/feiyu_auto_post.user.js
// @updateURL https://update.greasyfork.org/scripts/469205/feiyu_auto_post.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=e,document.head.append(t)})(" .box[data-v-169dba74]{z-index:3;position:fixed;right:20px;bottom:100px}.el-button--primary[data-v-169dba74]{background-color:#409eff!important} ");

(function (vue, $, axios, ElementPlus) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function setWithExpiry(key, value, ttl) {
    const now = /* @__PURE__ */ new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
  function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = /* @__PURE__ */ new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function formatDate(date = null) {
    date = date || /* @__PURE__ */ new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function runAsync(url, send_type, data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: send_type,
        url,
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        data: JSON.stringify(data),
        onload: function(response) {
          console.log("请求成功");
          console.log(response.responseText);
          resolve(response.responseText);
        },
        onerror: function(response) {
          reject(response);
        }
      });
    });
  }
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var dayjs_min = { exports: {} };
  (function(module, exports) {
    !function(t, e) {
      module.exports = e();
    }(commonjsGlobal, function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
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
              var r2 = e2.match($2);
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
          }, $3 = function(t3, e3) {
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
              return $3(v2 + "Hours", 0);
            case u:
              return $3(v2 + "Minutes", 1);
            case s:
              return $3(v2 + "Seconds", 2);
            case i:
              return $3(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $3 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($3), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            l2 && this.$d[l2]($3);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $3 = b.p(f2), y2 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($3 === c)
            return this.set(c, this.$M + r2);
          if ($3 === h)
            return this.set(h, this.$y + r2);
          if ($3 === a)
            return y2(1);
          if ($3 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$3] || 1, m3 = this.$d.getTime() + r2 * M3;
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
          }, $3 = f2 || function(t3, e3, n3) {
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
                  return $3(s2, u2, true);
                case "A":
                  return $3(s2, u2, false);
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
          var $3, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M3) {
            case h:
              $3 = D2() / 12;
              break;
            case c:
              $3 = D2();
              break;
            case f:
              $3 = D2() / 3;
              break;
            case o:
              $3 = (g2 - v2) / 6048e5;
              break;
            case a:
              $3 = (g2 - v2) / 864e5;
              break;
            case u:
              $3 = g2 / n;
              break;
            case s:
              $3 = g2 / e;
              break;
            case i:
              $3 = g2 / t;
              break;
            default:
              $3 = g2;
          }
          return l2 ? $3 : b.a($3);
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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "box" };
  const _hoisted_2 = { class: "dialog-footer" };
  const _hoisted_3 = { class: "dialog-footer" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const dialogFormVisible = vue.ref();
      const dialogPanelVisible = vue.ref();
      const form = vue.reactive({
        enable: _GM_getValue("enable", false),
        url: _GM_getValue("url", "https://hm-crm.xahmyk.cn/"),
        key: _GM_getValue("key", "飞鱼"),
        refresh_time: _GM_getValue("refresh_time", 60),
        ding_robot: _GM_getValue("ding_robot", "")
      });
      const timeoutInstance = vue.ref();
      const autoRun = vue.ref(false);
      const preRunDate = vue.ref(null);
      const successCount = vue.ref(0);
      const repeatCount = vue.ref(0);
      const lastClueDate = vue.ref(null);
      const errorCount = vue.ref(0);
      const running = vue.ref(false);
      const isFeiyu = vue.ref(true);
      const initCount = () => {
        successCount.value = 0;
        repeatCount.value = 0;
        errorCount.value = 0;
        lastClueDate.value = null;
      };
      const handleAuto = () => {
        autoRun.value = !autoRun.value;
        if (autoRun.value) {
          timeoutJob();
        } else {
          clearTimeout(timeoutInstance.value);
        }
      };
      vue.onMounted(async () => {
        if (window.location.host === "life.douyin.com")
          isFeiyu.value = false;
        if (form.enable) {
          autoRun.value = true;
          timeoutJob();
        }
      });
      const handleOpenPushPanel = () => {
        dialogPanelVisible.value = true;
      };
      const setClueIdCache = (clueId, data) => {
        setWithExpiry(clueId, data, 1e3 * 60 * 60 * 24 * 7);
      };
      const getClueIdCache = (clueId) => {
        return getWithExpiry(clueId);
      };
      const callDetail = async (clueId) => {
        var _a, _b;
        try {
          let cache = getClueIdCache(clueId);
          if (cache)
            return cache;
          let url1 = `https://feiyu.oceanengine.com/bff/pc/clue/detail/overview?clueId=${clueId}`;
          const url = (_a = document.querySelector('a[href*="/pc/home?"]')) == null ? void 0 : _a.href;
          const clueAccountId = getParameterByName("clue_account_id", url);
          const aadvid = getParameterByName("aadvid", url);
          if (clueAccountId)
            url1 = `${url1}&clue_account_id=${clueAccountId}`;
          if (aadvid)
            url1 = `${url1}&aadvid=${aadvid}`;
          let response = await axios.get(url1);
          let detail = response.data.data.defaultFieldsValueMap;
          let map = (detail == null ? void 0 : detail.remainInfoMap) ? (_b = JSON.parse(detail.remainInfoMap)) == null ? void 0 : _b.remarkDict : null;
          if (map) {
            setClueIdCache(clueId, map);
            return map;
          }
          return "飞鱼接口限制或者没有表单";
        } catch (e) {
          console.log("e", e);
        }
        return null;
      };
      const callDetailOfLifeCrm = async (clueId) => {
        return null;
      };
      const destroyJob = () => {
        if (timeoutInstance.value)
          clearTimeout(timeoutInstance.value);
      };
      const timeoutJob = () => {
        timeoutInstance.value = setTimeout(startJob, 1e3 * 10);
      };
      const runOnce = async (force = false) => {
        if (running.value)
          return;
        try {
          if (!form.key || !form.url) {
            alert("未配置Key 或者 推送Url");
            return;
          }
          running.value = true;
          initCount();
          if (isFeiyu.value)
            await run(force);
          else {
            await lifeCrmRun(force);
          }
        } catch (e) {
          console.log("e", e, e.message);
          await postMessageToDing(e.message, "推送报错!");
        }
        running.value = false;
      };
      const startJob = async () => {
        await runOnce();
        if (form.refresh_time)
          setTimeout(() => {
            if (dayjs().diff(dayjs(lastClueDate.value), "minute") >= 180 || errorCount.value) {
              navigationRefresh();
            }
            startJob();
          }, 1e3 * form.refresh_time);
      };
      const postMessageToDing = async (msg, title = "推送日志") => {
        if (!msg || !form.ding_robot)
          return;
        msg = `## ${title} 
 ${msg}`;
        await runAsync(form.ding_robot, "POST", {
          "msgtype": "markdown",
          "markdown": {
            "title": title,
            "text": msg
          }
        });
      };
      const handleSaveConfig = async () => {
        _GM_setValue("enable", form.enable);
        _GM_setValue("key", form.key);
        _GM_setValue("refresh_time", parseInt(form.refresh_time) || 60);
        if (!form.url.endsWith("/"))
          form.url = `${form.url}/`;
        _GM_setValue("url", form.url);
        if (form.ding_robot) {
          await postMessageToDing("连通成功", "推送测试");
        }
        _GM_setValue("ding_robot", form.ding_robot);
        autoRun.value = form.enable;
        if (form.enable)
          timeoutJob();
        else
          destroyJob();
        dialogFormVisible.value = false;
      };
      const getRows = () => {
        let rows = $(".feiyu-byted-Table-Body tr");
        if (!rows.length)
          throw new Error("没有数据");
        return rows;
      };
      const hasRefreshBtn = () => {
        return $("button[data-log-name=列表刷新]");
      };
      const refreshFeiyuPage = async () => {
        try {
          let btn = hasRefreshBtn();
          btn.click();
          await sleep(1e4);
        } catch (e) {
          await postMessageToDing("没有刷新按钮!请排查网页", "推送报错");
          console.error("没有刷新按钮");
          navigationToCluePage();
        }
      };
      const refreshLifeCrmPage = async () => {
        window.location.href = "/p/liteapp/leads_life/sales/list";
      };
      const refreshPageData = async () => {
        isFeiyu.value ? await refreshFeiyuPage() : await refreshLifeCrmPage();
      };
      const navigationToCluePage = () => {
        window.location.href = "/pc/sales/clue/public";
      };
      const navigationRefresh = () => {
        if (isFeiyu.value)
          navigationToCluePage();
        else
          refreshLifeCrmPage();
      };
      const TABLE_HEADERS = ["线索ID", "电话", "线索创建时间", "线索类型", "姓名", "年龄", "落地页链接", "组件名称", "线索渠道", "广告计划名称", "广告名称", "广告计划ID", "广告ID", "自动定位城市", "手机号归属地"];
      const validateTableHeader = (arr, diffArr) => {
        let notIncludes = [];
        for (const header of diffArr) {
          if (!arr.includes(header))
            notIncludes.push(header);
        }
        return notIncludes;
      };
      const parseTableData = async (force = false) => {
        let retryRowFn = retryFn(getRows);
        let rows = await retryRowFn();
        if (!rows.length)
          return null;
        let tHeads = $(".feiyu-byted-Table-Head.feiyu-byted-Table-Head_sticky tr th");
        let heads = [];
        for (const tHead of tHeads) {
          heads.push(tHead.innerText);
        }
        let notIncludes = validateTableHeader(heads, TABLE_HEADERS);
        if (notIncludes.length) {
          let str = notIncludes.join(",");
          alert("表头不匹配:" + str);
          throw new Error("表头不匹配:" + str);
        }
        let result = [];
        for (const tBodyElement of rows) {
          let rowItem = {};
          $(tBodyElement).find("td").each((index, item) => {
            rowItem[heads[index]] = item.innerText;
          });
          let id = rowItem["线索ID"];
          let phone = rowItem["电话"];
          let date = rowItem["线索创建时间"];
          if (!phone || !id) {
            errorCount.value++;
            console.log("phone or id empty", id, phone);
            continue;
          }
          if (!date) {
            errorCount.value++;
            console.log("没有时间", id, phone);
            continue;
          }
          if (!lastClueDate.value)
            lastClueDate.value = date;
          if (!force && getWithExpiry(phone)) {
            console.log(`${phone} 24小时内重复`);
            repeatCount.value++;
            continue;
          }
          const detail = await callDetail(id);
          if (!detail) {
            console.log("phone empty detail", phone);
          }
          result.push({
            "source": form.key,
            "id": id,
            "clue_type": /智能电话/.test(rowItem["线索类型"]) ? 2 : 1,
            "name": rowItem["姓名"],
            "telphone": phone,
            "weixin": "",
            "gender": rowItem["性别"] || "",
            "age": rowItem["年龄"] || "",
            "create_time": date,
            "external_url": rowItem["落地页链接"] || "",
            "site_name": rowItem["组件名称"] || rowItem["线索渠道"],
            "ad_name": rowItem["广告计划名称"] || rowItem["广告名称"],
            "ad_id": rowItem["广告计划ID"] || rowItem["广告ID"],
            "location": (rowItem == null ? void 0 : rowItem["自动定位城市"]) || (rowItem == null ? void 0 : rowItem["手机号归属地"]),
            "remark_dict": detail
          });
        }
        return result;
      };
      const handlePostData = async (data) => {
        let response = await axios.post(`${form.url}api/clue/access_clue`, data);
        console.log(`response ${data["telphone"]}`, response);
        if (response.status === 200) {
          setWithExpiry(data["telphone"], 1, 1e3 * 60 * 60 * 24);
        }
      };
      const manualRun = async () => {
        await runOnce(true);
      };
      const lifeCrmRun = async (force = false) => {
        await callDetailOfLifeCrm();
        return;
      };
      const run = async (force = false) => {
        if (!force)
          await refreshPageData();
        let result = await parseTableData(force);
        if (result == null ? void 0 : result.length) {
          await Promise.all(result.map(async (item) => {
            try {
              await handlePostData(item);
              successCount.value++;
            } catch (e) {
              errorCount.value++;
            }
          }));
        }
        preRunDate.value = formatDate();
        await postMessageToDing(`#### 本次时间: ${preRunDate.value} 
#### 最新线索时间: ${lastClueDate.value} 
 #### 成功推送条数: ${successCount.value}
 #### 重复条数: ${repeatCount.value}
 #### 失败条数: ${errorCount.value}`, "飞鱼推送结果");
      };
      const retryFn = (fn) => {
        return async (...args) => {
          let retry = 3;
          do {
            try {
              return await fn(...args);
            } catch (e) {
              retry--;
              await sleep(3e3);
            }
          } while (retry > 0);
          return null;
        };
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_form = vue.resolveComponent("el-form");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_component_el_button, {
            onClick: _cache[0] || (_cache[0] = ($event) => dialogFormVisible.value = true)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("配置")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_button, {
            onClick: manualRun,
            type: "primary",
            loading: running.value
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 手动推送 ")
            ]),
            _: 1
          }, 8, ["loading"]),
          vue.createVNode(_component_el_button, {
            onClick: handleOpenPushPanel,
            type: "primary",
            loading: running.value
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(autoRun.value ? running.value ? "正在运行" : `等待运行,上次推送时间: ${preRunDate.value || "-"}` : "打开面板"), 1)
            ]),
            _: 1
          }, 8, ["loading"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogPanelVisible.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => dialogPanelVisible.value = $event)
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("span", _hoisted_2, [
                vue.createVNode(_component_el_button, {
                  onClick: manualRun,
                  loading: running.value
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("手动推送")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                vue.createVNode(_component_el_button, {
                  type: "primary",
                  onClick: handleAuto,
                  loading: running.value
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(autoRun.value ? running.value ? "正在运行" : `等待运行,上次推送时间${preRunDate.value || "-"}` : "开始"), 1)
                  ]),
                  _: 1
                }, 8, ["loading"])
              ])
            ]),
            default: vue.withCtx(() => [
              vue.createElementVNode("div", null, " 上次推送时间: " + vue.toDisplayString(preRunDate.value || "-"), 1),
              vue.createElementVNode("div", null, " 运行状态: " + vue.toDisplayString(autoRun.value ? running.value ? "正在运行" : "等待运行" : "已停止"), 1),
              vue.createElementVNode("div", null, " 上次运行成功推送条数: " + vue.toDisplayString(successCount.value), 1),
              vue.createElementVNode("div", null, " 上次运行重复条数: " + vue.toDisplayString(repeatCount.value), 1),
              vue.createElementVNode("div", null, " 上次运行失败条数: " + vue.toDisplayString(errorCount.value), 1)
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogFormVisible.value,
            "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => dialogFormVisible.value = $event),
            title: ""
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("span", _hoisted_3, [
                vue.createVNode(_component_el_button, {
                  onClick: _cache[7] || (_cache[7] = ($event) => dialogFormVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("关闭")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_button, {
                  type: "primary",
                  onClick: handleSaveConfig
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 保存 ")
                  ]),
                  _: 1
                })
              ])
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form, { model: form }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form_item, { label: "刷新间隔" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: form.refresh_time,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.refresh_time = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "推送标识" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: form.key,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.key = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "推送Url" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: form.url,
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.url = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "开启自动推送" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_switch, {
                        modelValue: form.enable,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.enable = $event)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "钉钉机器人webhook" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: form.ding_robot,
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.ding_robot = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-169dba74"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("ElementPlus");
  window.beforeXMLHttpRequestOpen = function(xhr, options) {
  };
  XMLHttpRequest.prototype.myOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    var options = {
      method,
      url,
      async,
      user,
      password
    };
    if (url.includes("https://life.douyin.com/clue/bff/pc/sales/action-record")) {
      console.log("this", this, this._reqHeaders, this.getAllResponseHeaders(), this.responseText);
      this.onreadystatechange = () => {
        if (this.readyState === XMLHttpRequest.DONE) {
          console.log(this);
          console.log(this.requestHeaders);
        }
      };
    }
    if ("function" === typeof window.beforeXMLHttpRequestOpen) {
      window.beforeXMLHttpRequestOpen(this, options);
    }
    this.myOpen(options.method, options.url, options.async);
  };
  var originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setCustomRequestHeader = function(header, value) {
    originalSetRequestHeader.call(this, header, value);
    if (!this.requestHeaders) {
      this.requestHeaders = {};
    }
    if (!this.requestHeaders[header]) {
      this.requestHeaders[header] = [];
    }
    this.requestHeaders[header].push(value);
  };
  vue.createApp(App).use(ElementPlus).mount(
    (() => {
      const app = document.createElement("div");
      app.style.position = "relative";
      app.style.zIndex = "999999";
      document.body.append(app);
      return app;
    })()
  );

})(Vue, jQuery, axios, ElementPlus);
