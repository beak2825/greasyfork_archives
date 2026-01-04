// ==UserScript==
// @name       xiaozhangboo
// @namespace  npm/vite-plugin-monkey
// @version    1.0.0
// @description  提供一键统计课时功能，仅需要登录即可使用
// @author     DT_sht
// @license    MIT
// @icon       https://vitejs.dev/logo.svg
// @match      https://home.xiaozhangboo.com/*
// @require    https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.13/dayjs.min.js
// @grant      GM.addStyle
// @grant      GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/530742/xiaozhangboo.user.js
// @updateURL https://update.greasyfork.org/scripts/530742/xiaozhangboo.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var dayjs_min$1 = { exports: {} };
  var dayjs_min = dayjs_min$1.exports;
  var hasRequiredDayjs_min;
  function requireDayjs_min() {
    if (hasRequiredDayjs_min) return dayjs_min$1.exports;
    hasRequiredDayjs_min = 1;
    (function(module, exports) {
      !function(t, e) {
        module.exports = e();
      }(dayjs_min, function() {
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
          if (e2.date() < n2.date()) return -t2(n2, e2);
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
          if (!e2) return g;
          if ("string" == typeof e2) {
            var s2 = e2.toLowerCase();
            D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
            var u2 = e2.split("-");
            if (!i2 && u2.length > 1) return t2(u2[0]);
          } else {
            var a2 = e2.name;
            D[a2] = e2, i2 = a2;
          }
          return !r2 && i2 && (g = i2), i2 || !r2 && g;
        }, O = function(t2, e2) {
          if (S(t2)) return t2.clone();
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
              if (null === e2) return /* @__PURE__ */ new Date(NaN);
              if (b.u(e2)) return /* @__PURE__ */ new Date();
              if (e2 instanceof Date) return new Date(e2);
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
            } else l2 && this.$d[l2]($2);
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
            if ($2 === c) return this.set(c, this.$M + r2);
            if ($2 === h) return this.set(h, this.$y + r2);
            if ($2 === a) return y2(1);
            if ($2 === o) return y2(7);
            var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
            return b.w(m3, this);
          }, m2.subtract = function(t2, e2) {
            return this.add(-1 * t2, e2);
          }, m2.format = function(t2) {
            var e2 = this, n2 = this.$locale();
            if (!this.isValid()) return n2.invalidDate || l;
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
            if (!t2) return this.$L;
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
    })(dayjs_min$1);
    return dayjs_min$1.exports;
  }
  var dayjs_minExports = requireDayjs_min();
  const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  (function() {
    if (typeof dayjs === "undefined") {
      console.error("dayjs未正确加载，请检查@require URL");
      return;
    }
    const style2 = document.createElement("style");
    style2.textContent = `
    .floating-panel {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px;
        border: 1px solid #ccc;
        z-index: 99999;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        width: 300px;
        font-family: Arial, sans-serif;
    }
    .floating-panel h3 {
        margin-top: 0;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        cursor: move;
        user-select: none;
    }
    .input-group {
        margin-bottom: 15px;
    }
    .input-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .input-group input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .action-btn {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 12px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
        width: 100%;
    }
    #cancelBtn {
        background-color: #f44336;
        display: none;
    }
    .progress-bar {
        width: 100%;
        background-color: #f1f1f1;
        border-radius: 4px;
        margin: 10px 0;
        display: none;
    }
    .progress {
        height: 20px;
        background-color: #4CAF50;
        border-radius: 4px;
        text-align: center;
        line-height: 20px;
        color: white;
        width: 0%;
    }
    .stats-container {
        margin-top: 15px;
        max-height: 300px;
        overflow-y: auto;
    }
    .teacher-stats {
        margin-bottom: 10px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 4px;
    }
    .teacher-stats h4 {
        margin-top: 0;
        color: #2c3e50;
    }
    .grade-stats {
        margin-left: 15px;
        margin-top: 5px;
    }
    .stats-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    .stats-label {
        font-weight: bold;
    }
    .stats-value {
        color: #e74c3c;
    }
    .date-range {
        font-size: 0.9em;
        color: #666;
        margin-top: 5px;
    }
    `;
    document.head.appendChild(style2);
    const panel = createPanel();
    makeDraggable(panel);
    document.body.appendChild(panel);
    let isCollecting = false;
    let allTeachers = {};
    let weeksToProcess = [];
    let currentProcessing = 0;
    function createPanel() {
      const panel2 = document.createElement("div");
      panel2.className = "floating-panel";
      panel2.innerHTML = `
            <h3>跨周课表统计</h3>
            <div class="input-group">
                <label for="startDate">开始日期 (YYYYMMDD)</label>
                <input type="text" id="startDate" placeholder="例如: 20250324">
            </div>
            <div class="input-group">
                <label for="endDate">结束日期 (YYYYMMDD)</label>
                <input type="text" id="endDate" placeholder="例如: 20250330">
            </div>
            <div class="input-group">
                <label for="teacherName">教师姓名筛选</label>
                <input type="text" id="teacherName" placeholder="可选，留空则统计所有教师">
            </div>
            <button id="startBtn" class="action-btn">开始统计</button>
            <button id="cancelBtn" class="action-btn" style="background:#f44336;display:none;">取消统计</button>
            <div class="progress-bar" id="progressBar" style="display:none;">
                <div class="progress" id="progress" style="width:0%">0%</div>
            </div>
            <div class="stats-container" id="statsContainer"></div>
        `;
      const startBtn = panel2.querySelector("#startBtn");
      const cancelBtn = panel2.querySelector("#cancelBtn");
      if (startBtn && cancelBtn) {
        startBtn.addEventListener("click", startMultiWeekStats);
        cancelBtn.addEventListener("click", cancelStats);
      } else {
        console.error("未能找到必要的按钮元素");
      }
      return panel2;
    }
    function makeDraggable(element) {
      const header = element.querySelector("h3");
      if (!header) return;
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      header.onmousedown = dragMouseDown;
      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }
      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
      }
      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    function validateDateInput(dateStr) {
      if (!dateStr || typeof dateStr !== "string" || dateStr.length !== 8) {
        return { valid: false, reason: "日期必须是8位数字(YYYYMMDD)" };
      }
      if (!/^\d+$/.test(dateStr)) {
        return { valid: false, reason: "日期只能包含数字" };
      }
      const year = parseInt(dateStr.substr(0, 4));
      const month = parseInt(dateStr.substr(4, 2));
      parseInt(dateStr.substr(6, 2));
      if (year < 2e3 || year > 2100) {
        return { valid: false, reason: "年份必须在2000-2100之间" };
      }
      if (month < 1 || month > 12) {
        return { valid: false, reason: "月份必须在01-12之间" };
      }
      const dateObj = dayjs(dateStr, "YYYYMMDD");
      if (!dateObj.isValid()) {
        return { valid: false, reason: "无效的日期" };
      }
      const formatted = dateObj.format("YYYYMMDD");
      if (formatted !== dateStr) {
        return {
          valid: false,
          reason: `日期不合法(自动转换为${formatted})`
        };
      }
      return { valid: true, date: dateObj };
    }
    async function startMultiWeekStats() {
      if (isCollecting) return;
      const startDate = document.getElementById("startDate").value.trim();
      const endDate = document.getElementById("endDate").value.trim();
      const teacherFilter = document.getElementById("teacherName").value.trim();
      const startValidation = validateDateInput(startDate);
      if (!startValidation.valid) {
        alert(`开始日期无效: ${startValidation.reason}
示例: 20250101`);
        return;
      }
      const endValidation = validateDateInput(endDate);
      if (!endValidation.valid) {
        alert(`结束日期无效: ${endValidation.reason}
示例: 20251231`);
        return;
      }
      if (startValidation.date.isAfter(endValidation.date)) {
        alert("结束日期不能早于开始日期");
        return;
      }
      isCollecting = true;
      allTeachers = {};
      currentProcessing = 0;
      weeksToProcess = generateWeekDates(startValidation.date, endValidation.date);
      document.getElementById("startBtn").style.display = "none";
      document.getElementById("cancelBtn").style.display = "";
      document.getElementById("progressBar").style.display = "block";
      document.getElementById("statsContainer").innerHTML = `<p>统计 ${startValidation.date.format("YYYY-MM-DD")} 至 ${endValidation.date.format("YYYY-MM-DD")}</p>`;
      updateProgress(0);
      processNextWeek(teacherFilter, startValidation.date, endValidation.date);
    }
    function generateWeekDates(startDate, endDate) {
      const weeks = [];
      let current = startDate.startOf("week");
      while (current.isBefore(endDate) || current.isSame(endDate, "week")) {
        weeks.push(current.format("YYYYMMDD"));
        current = current.add(1, "week");
      }
      console.log("需要处理的周次:", weeks);
      return weeks;
    }
    async function processNextWeek(teacherFilter, targetStartDate, targetEndDate) {
      if (currentProcessing >= weeksToProcess.length || !isCollecting) {
        finishStats();
        return;
      }
      const weekDate = weeksToProcess[currentProcessing];
      updateProgress(currentProcessing / weeksToProcess.length * 100);
      try {
        const { doc, skip } = await fetchWeekData(weekDate, targetStartDate, targetEndDate);
        if (!skip) {
          const weekStats = parseWeekData(doc, teacherFilter, targetStartDate, targetEndDate);
          mergeStats(allTeachers, weekStats);
        }
        currentProcessing++;
        setTimeout(() => processNextWeek(teacherFilter, targetStartDate, targetEndDate), 500);
      } catch (error) {
        console.error("获取周数据失败:", error);
        cancelStats();
      }
    }
    function fetchWeekData(weekDate, targetStartDate, targetEndDate) {
      return new Promise((resolve, reject) => {
        const formData = `prevWeekStartDate=${weekDate}&nextWeekStartDate=${weekDate}&isFirstLoad=false`;
        _GM_xmlhttpRequest({
          method: "POST",
          url: "/ges/teaching/table!viewTableList.action",
          data: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function(response) {
            try {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.responseText, "text/html");
              const weekRange = parseWeekRangeFromDoc(doc);
              if (!weekRange) {
                reject(new Error("无法解析周日期"));
                return;
              }
              const targetStart = dayjs(targetStartDate, "YYYYMMDD");
              const targetEnd = dayjs(targetEndDate, "YYYYMMDD");
              if (weekRange.end.isBefore(targetStart) || weekRange.start.isAfter(targetEnd)) {
                resolve({ doc, skip: true });
                return;
              }
              resolve({ doc, skip: false });
            } catch (e) {
              reject(e);
            }
          },
          onerror: reject
        });
      });
    }
    function parseWeekRangeFromDoc(doc) {
      const headers = doc.querySelectorAll(".listTable.timeTable th");
      if (headers.length < 2) return null;
      const dateMatch = headers[1].textContent.match(/(\d{2})\.(\d{2})/);
      if (!dateMatch) return null;
      const month = parseInt(dateMatch[1], 10);
      const day = parseInt(dateMatch[2], 10);
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      const weekStart = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD").startOf("week");
      return {
        start: weekStart,
        end: weekStart.add(6, "day")
      };
    }
    function parseWeekData(doc, teacherFilter, targetStartDate, targetEndDate) {
      const teachers = {};
      const targetStart = dayjs(targetStartDate, "YYYYMMDD");
      const targetEnd = dayjs(targetEndDate, "YYYYMMDD");
      const weekRange = parseWeekRangeFromDoc(doc);
      if (!weekRange) return teachers;
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(weekRange.start.add(i, "day"));
      }
      const rows = doc.querySelectorAll('tr[style*="border:1px solid #666"]');
      rows.forEach((row) => {
        var _a;
        const teacherName = (_a = row.querySelector('span[style*="color:#00F"]')) == null ? void 0 : _a.textContent.trim();
        if (!teacherName || teacherFilter && !teacherName.includes(teacherFilter)) {
          return;
        }
        const courses = [];
        const timeCells = row.querySelectorAll(".time");
        timeCells.forEach((cell, dayIndex) => {
          const currentDay = weekDays[dayIndex];
          if (!currentDay || currentDay.isBefore(targetStart) || currentDay.isAfter(targetEnd)) {
            return;
          }
          const courseElements = cell.querySelectorAll(".student1 .classtabletype, .student4 .classtabletype");
          courseElements.forEach((course) => {
            const typeElement = course.querySelector(".classtabletype_up");
            const infoElement = course.querySelector(".classtabletype_down, .classtabletype_downx");
            if (!typeElement || !infoElement) return;
            const type = typeElement.textContent.trim();
            let info = infoElement.textContent.trim().replace(/<font[^>]*>|<\/font>/g, "");
            const gradeMatch = info.match(/(小[一二三四五六]|七年级|八年级|九年级|高一|高二|高三)/);
            const grade = gradeMatch ? gradeMatch[0] : "其他";
            let courseType = "";
            if (type.includes("VIP·1V1")) {
              courseType = "1v1";
            } else {
              const match = info.match(/\((\d+)P\/(\d+)P\)/);
              if (match) {
                const current = match[1];
                if (current === "1") courseType = "1p";
                else if (current === "2") courseType = "2p";
                else if (current === "3") courseType = "3p";
              }
            }
            if (courseType && grade) {
              courses.push({
                grade,
                courseType,
                date: currentDay.format("YYYY-MM-DD")
              });
            }
          });
        });
        if (courses.length > 0) {
          teachers[teacherName] = (teachers[teacherName] || []).concat(courses);
        }
      });
      return teachers;
    }
    function mergeStats(allStats, weekStats) {
      for (const [teacher, courses] of Object.entries(weekStats)) {
        allStats[teacher] = (allStats[teacher] || []).concat(courses);
      }
    }
    function updateProgress(percent) {
      const progress = document.getElementById("progress");
      progress.style.width = percent + "%";
      progress.textContent = Math.round(percent) + "%";
    }
    function finishStats() {
      isCollecting = false;
      document.getElementById("startBtn").style.display = "";
      document.getElementById("cancelBtn").style.display = "none";
      showFinalStats(allTeachers);
    }
    function cancelStats() {
      isCollecting = false;
      document.getElementById("startBtn").style.display = "";
      document.getElementById("cancelBtn").style.display = "none";
      document.getElementById("statsContainer").innerHTML = "<p>统计已取消</p>";
      document.getElementById("progressBar").style.display = "none";
    }
    function showFinalStats(teachersData) {
      const container = document.getElementById("statsContainer");
      let html = "<h4>跨周统计结果</h4>";
      if (Object.keys(teachersData).length === 0) {
        html += "<p>未找到符合条件的课程数据</p>";
      } else {
        for (const [teacher, courses] of Object.entries(teachersData)) {
          const stats = calculateTeacherStats(courses);
          html += generateTeacherHTML(teacher, stats);
        }
      }
      container.innerHTML = html;
      document.getElementById("progressBar").style.display = "none";
    }
    function calculateTeacherStats(courses) {
      const stats = {
        "1v1": 0,
        "1p": 0,
        "2p": 0,
        "3p": 0,
        byGrade: {
          // 小学部分
          "小一": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "小二": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "小三": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "小四": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "小五": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "小六": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          // 初中部分
          "七年级": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "八年级": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "九年级": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          // 高中部分
          "高一": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "高二": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "高三": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 },
          "其他": { "1v1": 0, "1p": 0, "2p": 0, "3p": 0 }
        },
        byDate: {}
      };
      courses.forEach((course) => {
        stats[course.courseType]++;
        stats.byGrade[course.grade][course.courseType]++;
        if (!stats.byDate[course.date]) {
          stats.byDate[course.date] = {
            "1v1": 0,
            "1p": 0,
            "2p": 0,
            "3p": 0
          };
        }
        stats.byDate[course.date][course.courseType]++;
      });
      return stats;
    }
    function generateTeacherHTML(teacher, stats, courses) {
      const total = stats["1v1"] + stats["1p"] + stats["2p"] + stats["3p"];
      const sortedDates = Object.keys(stats.byDate).sort();
      let html = `
        <div class="teacher-stats">
            <h4>${teacher} (共 ${total} 节课)</h4>
            <div class="date-range">日期范围: ${sortedDates[0]} 至 ${sortedDates[sortedDates.length - 1]}</div>
        `;
      const gradeOrder = [
        "小一",
        "小二",
        "小三",
        "小四",
        "小五",
        "小六",
        "七年级",
        "八年级",
        "九年级",
        "高一",
        "高二",
        "高三",
        "其他"
      ];
      gradeOrder.forEach((grade) => {
        const gradeStats = stats.byGrade[grade];
        const gradeTotal = gradeStats["1v1"] + gradeStats["1p"] + gradeStats["2p"] + gradeStats["3p"];
        if (gradeTotal > 0) {
          html += `
                <div class="grade-stats">
                    <div><strong>${grade}</strong> (共 ${gradeTotal} 节)</div>
                    ${[
          gradeStats["1v1"] > 0 && generateStatsRow("1v1", gradeStats["1v1"]),
          gradeStats["1p"] > 0 && generateStatsRow("1p/3p", gradeStats["1p"]),
          gradeStats["2p"] > 0 && generateStatsRow("2p/3p", gradeStats["2p"]),
          gradeStats["3p"] > 0 && generateStatsRow("3p/3p", gradeStats["3p"])
        ].filter(Boolean).join("")}
                </div>
                `;
        }
      });
      html += `
            <div class="grade-stats">
                <details class="date-fold">
                    <summary>📅 日期分布 (点击展开)</summary>
                    <div class="date-details">
                        ${sortedDates.map((date) => {
      const dateStats = stats.byDate[date];
      const dateTotal = dateStats["1v1"] + dateStats["1p"] + dateStats["2p"] + dateStats["3p"];
      return `
                            <div class="stats-row">
                                <span class="stats-label">${date}:</span>
                                <span class="stats-value">${dateTotal} 节</span>
                            </div>
                            `;
    }).join("")}
                    </div>
                </details>
            </div>
        `;
      html += `</div>`;
      return html;
    }
    function generateStatsRow(label, value) {
      return value > 0 ? `
        <div class="stats-row">
            <span class="stats-label">${label}:</span>
            <span class="stats-value">${value}</span>
        </div>
        ` : "";
    }
  })();
  const style = document.createElement("style");
  style.textContent = `
    .floating-panel {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px;
        border: 1px solid #ccc;
        z-index: 99999;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        width: 300px;
        font-family: Arial, sans-serif;
    }
    .floating-panel h3 {
        margin-top: 0;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        cursor: move;
        user-select: none;
    }
    .input-group {
        margin-bottom: 15px;
    }
    .input-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .input-group input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .action-btn {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 12px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
        width: 100%;
    }
    #cancelBtn {
        background-color: #f44336;
        display: none;
    }
    .progress-bar {
        width: 100%;
        background-color: #f1f1f1;
        border-radius: 4px;
        margin: 10px 0;
        display: none;
    }
    .progress {
        height: 20px;
        background-color: #4CAF50;
        border-radius: 4px;
        text-align: center;
        line-height: 20px;
        color: white;
        width: 0%;
    }
    .stats-container {
        margin-top: 15px;
        max-height: 300px;
        overflow-y: auto;
    }
    .teacher-stats {
        margin-bottom: 10px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 4px;
    }
    .teacher-stats h4 {
        margin-top: 0;
        color: #2c3e50;
    }
    .grade-stats {
        margin-left: 15px;
        margin-top: 5px;
    }
    .stats-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    .stats-label {
        font-weight: bold;
    }
    .stats-value {
        color: #e74c3c;
    }
    .date-range {
        font-size: 0.9em;
        color: #666;
        margin-top: 5px;
    }
    /* 新增折叠样式 */
    .date-fold {
        margin-top: 8px;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 6px;
    }
    .date-fold summary {
        cursor: pointer;
        color: #3498db;
        font-weight: bold;
    }
    .date-fold summary:hover {
        color: #2980b9;
    }
    .date-details {
        margin-top: 8px;
        padding-left: 10px;
        max-height: 200px;
        overflow-y: auto;
    }
`;

})();