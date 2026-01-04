// ==UserScript==
// @name       Pixiv Mio Tools
// @namespace  remio/script-pixiv
// @version    1.1.0
// @author     kasuie
// @license    MIT
// @icon       https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @match      https://www.pixiv.net/artworks/*
// @match      https://www.pixiv.net/ranking.php*
// @grant      GM.addStyle
// @grant      GM.deleteValue
// @grant      GM.getValue
// @grant      GM.listValues
// @grant      GM.notification
// @grant      GM.setValue
// @grant      GM.xmlHttpRequest
// @description 获取pixiv的排行数据，并新增到mio
// @downloadURL https://update.greasyfork.org/scripts/491140/Pixiv%20Mio%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/491140/Pixiv%20Mio%20Tools.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _a, _b;
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  const storage = {
    set(key, val) {
      return _GM.setValue(key, val);
    },
    get(key, defaultValue) {
      return _GM.getValue(key, defaultValue);
    },
    all() {
      return _GM.listValues();
    },
    del(key) {
      return _GM.deleteValue(key);
    },
    async clear() {
      let keys = this.all();
      for (let key of await keys) {
        _GM.deleteValue(key);
      }
    }
  };
  const request = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.method) {
        data.method = "get";
      }
      if (!data.timeout) {
        data.timeout = 6e4;
      }
      data.onload = function(res) {
        try {
          resolve(JSON.parse(res.responseText));
        } catch (error) {
          reject(error);
        }
      };
      data.onerror = function(e) {
        reject(e);
      };
      data.ontimeout = function() {
        reject("timeout");
      };
      _GM.xmlHttpRequest(data);
    });
  };
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
  var customParseFormat$1 = { exports: {} };
  var customParseFormat = customParseFormat$1.exports;
  var hasRequiredCustomParseFormat;
  function requireCustomParseFormat() {
    if (hasRequiredCustomParseFormat) return customParseFormat$1.exports;
    hasRequiredCustomParseFormat = 1;
    (function(module, exports) {
      !function(e, t) {
        module.exports = t();
      }(customParseFormat, function() {
        var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s = {}, a = function(e2) {
          return (e2 = +e2) + (e2 > 68 ? 1900 : 2e3);
        };
        var f = function(e2) {
          return function(t2) {
            this[e2] = +t2;
          };
        }, h = [/[+-]\d\d:?(\d\d)?|Z/, function(e2) {
          (this.zone || (this.zone = {})).offset = function(e3) {
            if (!e3) return 0;
            if ("Z" === e3) return 0;
            var t2 = e3.match(/([+-]|\d\d)/g), n2 = 60 * t2[1] + (+t2[2] || 0);
            return 0 === n2 ? 0 : "+" === t2[0] ? -n2 : n2;
          }(e2);
        }], u = function(e2) {
          var t2 = s[e2];
          return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
        }, d = function(e2, t2) {
          var n2, r2 = s.meridiem;
          if (r2) {
            for (var i2 = 1; i2 <= 24; i2 += 1) if (e2.indexOf(r2(i2, 0, t2)) > -1) {
              n2 = i2 > 12;
              break;
            }
          } else n2 = e2 === (t2 ? "pm" : "PM");
          return n2;
        }, c = { A: [o, function(e2) {
          this.afternoon = d(e2, false);
        }], a: [o, function(e2) {
          this.afternoon = d(e2, true);
        }], Q: [n, function(e2) {
          this.month = 3 * (e2 - 1) + 1;
        }], S: [n, function(e2) {
          this.milliseconds = 100 * +e2;
        }], SS: [r, function(e2) {
          this.milliseconds = 10 * +e2;
        }], SSS: [/\d{3}/, function(e2) {
          this.milliseconds = +e2;
        }], s: [i, f("seconds")], ss: [i, f("seconds")], m: [i, f("minutes")], mm: [i, f("minutes")], H: [i, f("hours")], h: [i, f("hours")], HH: [i, f("hours")], hh: [i, f("hours")], D: [i, f("day")], DD: [r, f("day")], Do: [o, function(e2) {
          var t2 = s.ordinal, n2 = e2.match(/\d+/);
          if (this.day = n2[0], t2) for (var r2 = 1; r2 <= 31; r2 += 1) t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
        }], w: [i, f("week")], ww: [r, f("week")], M: [i, f("month")], MM: [r, f("month")], MMM: [o, function(e2) {
          var t2 = u("months"), n2 = (u("monthsShort") || t2.map(function(e3) {
            return e3.slice(0, 3);
          })).indexOf(e2) + 1;
          if (n2 < 1) throw new Error();
          this.month = n2 % 12 || n2;
        }], MMMM: [o, function(e2) {
          var t2 = u("months").indexOf(e2) + 1;
          if (t2 < 1) throw new Error();
          this.month = t2 % 12 || t2;
        }], Y: [/[+-]?\d+/, f("year")], YY: [r, function(e2) {
          this.year = a(e2);
        }], YYYY: [/\d{4}/, f("year")], Z: h, ZZ: h };
        function l(n2) {
          var r2, i2;
          r2 = n2, i2 = s && s.formats;
          for (var o2 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t2, n3, r3) {
            var o3 = r3 && r3.toUpperCase();
            return n3 || i2[r3] || e[r3] || i2[o3].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t3, n4) {
              return t3 || n4.slice(1);
            });
          })).match(t), a2 = o2.length, f2 = 0; f2 < a2; f2 += 1) {
            var h2 = o2[f2], u2 = c[h2], d2 = u2 && u2[0], l2 = u2 && u2[1];
            o2[f2] = l2 ? { regex: d2, parser: l2 } : h2.replace(/^\[|\]$/g, "");
          }
          return function(e2) {
            for (var t2 = {}, n3 = 0, r3 = 0; n3 < a2; n3 += 1) {
              var i3 = o2[n3];
              if ("string" == typeof i3) r3 += i3.length;
              else {
                var s2 = i3.regex, f3 = i3.parser, h3 = e2.slice(r3), u3 = s2.exec(h3)[0];
                f3.call(t2, u3), e2 = e2.replace(u3, "");
              }
            }
            return function(e3) {
              var t3 = e3.afternoon;
              if (void 0 !== t3) {
                var n4 = e3.hours;
                t3 ? n4 < 12 && (e3.hours += 12) : 12 === n4 && (e3.hours = 0), delete e3.afternoon;
              }
            }(t2), t2;
          };
        }
        return function(e2, t2, n2) {
          n2.p.customParseFormat = true, e2 && e2.parseTwoDigitYear && (a = e2.parseTwoDigitYear);
          var r2 = t2.prototype, i2 = r2.parse;
          r2.parse = function(e3) {
            var t3 = e3.date, r3 = e3.utc, o2 = e3.args;
            this.$u = r3;
            var a2 = o2[1];
            if ("string" == typeof a2) {
              var f2 = true === o2[2], h2 = true === o2[3], u2 = f2 || h2, d2 = o2[2];
              h2 && (d2 = o2[2]), s = this.$locale(), !f2 && d2 && (s = n2.Ls[d2]), this.$d = function(e4, t4, n3, r4) {
                try {
                  if (["x", "X"].indexOf(t4) > -1) return new Date(("X" === t4 ? 1e3 : 1) * e4);
                  var i3 = l(t4)(e4), o3 = i3.year, s2 = i3.month, a3 = i3.day, f3 = i3.hours, h3 = i3.minutes, u3 = i3.seconds, d3 = i3.milliseconds, c3 = i3.zone, m2 = i3.week, M2 = /* @__PURE__ */ new Date(), Y = a3 || (o3 || s2 ? 1 : M2.getDate()), p = o3 || M2.getFullYear(), v = 0;
                  o3 && !s2 || (v = s2 > 0 ? s2 - 1 : M2.getMonth());
                  var D, w = f3 || 0, g = h3 || 0, y = u3 || 0, L = d3 || 0;
                  return c3 ? new Date(Date.UTC(p, v, Y, w, g, y, L + 60 * c3.offset * 1e3)) : n3 ? new Date(Date.UTC(p, v, Y, w, g, y, L)) : (D = new Date(p, v, Y, w, g, y, L), m2 && (D = r4(D).week(m2).toDate()), D);
                } catch (e5) {
                  return /* @__PURE__ */ new Date("");
                }
              }(t3, a2, r3, n2), this.init(), d2 && true !== d2 && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = /* @__PURE__ */ new Date("")), s = {};
            } else if (a2 instanceof Array) for (var c2 = a2.length, m = 1; m <= c2; m += 1) {
              o2[1] = a2[m - 1];
              var M = n2.apply(this, o2);
              if (M.isValid()) {
                this.$d = M.$d, this.$L = M.$L, this.init();
                break;
              }
              m === c2 && (this.$d = /* @__PURE__ */ new Date(""));
            }
            else i2.call(this, e3);
          };
        };
      });
    })(customParseFormat$1);
    return customParseFormat$1.exports;
  }
  var localizedFormat$1 = { exports: {} };
  var localizedFormat = localizedFormat$1.exports;
  var hasRequiredLocalizedFormat;
  function requireLocalizedFormat() {
    if (hasRequiredLocalizedFormat) return localizedFormat$1.exports;
    hasRequiredLocalizedFormat = 1;
    (function(module, exports) {
      !function(e, t) {
        module.exports = t();
      }(localizedFormat, function() {
        var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" };
        return function(t, o, n) {
          var r = o.prototype, i = r.format;
          n.en.formats = e, r.format = function(t2) {
            void 0 === t2 && (t2 = "YYYY-MM-DDTHH:mm:ssZ");
            var o2 = this.$locale().formats, n2 = function(t3, o3) {
              return t3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t4, n3, r2) {
                var i2 = r2 && r2.toUpperCase();
                return n3 || o3[r2] || e[r2] || o3[i2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t5, o4) {
                  return t5 || o4.slice(1);
                });
              });
            }(t2, void 0 === o2 ? {} : o2);
            return i.call(this, n2);
          };
        };
      });
    })(localizedFormat$1);
    return localizedFormat$1.exports;
  }
  var zhCn$1 = { exports: {} };
  var zhCn = zhCn$1.exports;
  var hasRequiredZhCn;
  function requireZhCn() {
    if (hasRequiredZhCn) return zhCn$1.exports;
    hasRequiredZhCn = 1;
    (function(module, exports) {
      !function(e, _) {
        module.exports = _(requireDayjs_min());
      }(zhCn, function(e) {
        function _(e2) {
          return e2 && "object" == typeof e2 && "default" in e2 ? e2 : { default: e2 };
        }
        var t = _(e), d = { name: "zh-cn", weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"), weekdaysMin: "日_一_二_三_四_五_六".split("_"), months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), ordinal: function(e2, _2) {
          return "W" === _2 ? e2 + "周" : e2 + "日";
        }, weekStart: 1, yearStart: 4, formats: { LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah点mm分", LLLL: "YYYY年M月D日ddddAh点mm分", l: "YYYY/M/D", ll: "YYYY年M月D日", lll: "YYYY年M月D日 HH:mm", llll: "YYYY年M月D日dddd HH:mm" }, relativeTime: { future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天", M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年" }, meridiem: function(e2, _2) {
          var t2 = 100 * e2 + _2;
          return t2 < 600 ? "凌晨" : t2 < 900 ? "早上" : t2 < 1100 ? "上午" : t2 < 1300 ? "中午" : t2 < 1800 ? "下午" : "晚上";
        } };
        return t.default.locale(d, null, true), d;
      });
    })(zhCn$1);
    return zhCn$1.exports;
  }
  var dist;
  var hasRequiredDist;
  function requireDist() {
    if (hasRequiredDist) return dist;
    hasRequiredDist = 1;
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
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
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var __publicField = (obj, key, value) => {
      __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      return value;
    };
    var src_exports = {};
    __export(src_exports, {
      DateFormat: () => DateFormat,
      SakuraAnimation: () => SakuraAnimation,
      aDayjs: () => aDayjs,
      aSakura: () => aSakura,
      addAlphaToHSL: () => addAlphaToHSL,
      addAlphaToHex: () => addAlphaToHex,
      arrayToObject: () => arrayToObject,
      base64ToBuffer: () => base64ToBuffer,
      blboToBuffer: () => blboToBuffer,
      bufferToBase64: () => bufferToBase64,
      bufferToBlbo: () => bufferToBlbo,
      bufferToBlboUrl: () => bufferToBlboUrl,
      calcTimeDiff: () => calcTimeDiff,
      callAll: () => callAll,
      callAllHandlers: () => callAllHandlers,
      capitalize: () => capitalize,
      clampPercentage: () => clampPercentage,
      cleanObject: () => cleanObject,
      cleanObjectKeys: () => cleanObjectKeys,
      cloneDeep: () => cloneDeep,
      clsx: () => clsx,
      compact: () => compact,
      copyObject: () => copyObject,
      copyToClipboard: () => copyToClipboard,
      dataAttr: () => dataAttr,
      dateFormat: () => dateFormat,
      dayOfYear: () => dayOfYear,
      daysOfYear: () => daysOfYear,
      debounce: () => debounce,
      decreaseTransition: () => decreaseTransition,
      downTransition: () => downTransition,
      endOfDayTimestamp: () => endOfDayTimestamp,
      endOfWeekTimestamp: () => endOfWeekTimestamp,
      extractProperty: () => extractProperty,
      extractRGBA: () => extractRGBA,
      fadeInTransition: () => fadeInTransition,
      fadeOutTransition: () => fadeOutTransition,
      fileDownload: () => fileDownload,
      fileToBlbo: () => fileToBlbo,
      fileToBuffer: () => fileToBuffer,
      formatSeconds: () => formatSeconds,
      generateTransitionColors: () => generateTransitionColors,
      getBrowser: () => getBrowser,
      getColorScheme: () => getColorScheme,
      getFileSize: () => getFileSize,
      getImageExt: () => getImageExt,
      getImageMimeType: () => getImageMimeType,
      getKeyValue: () => getKeyValue,
      getOS: () => getOS,
      getProp: () => getProp,
      getRandomElements: () => getRandomElements,
      getUniqueID: () => getUniqueID,
      hexToHsl: () => hexToHsl,
      increaseTransition: () => increaseTransition,
      isArray: () => isArray,
      isClientSide: () => isClientSide,
      isDev: () => isDev,
      isEmpty: () => isEmpty,
      isEmptyArray: () => isEmptyArray,
      isEmptyObject: () => isEmptyObject,
      isFunction: () => isFunction,
      isLeapYear: () => isLeapYear,
      isMobile: () => isMobile,
      isNil: () => isNil,
      isNumeric: () => isNumeric,
      isObject: () => isObject,
      isServerSide: () => isServerSide,
      isValidDate: () => isValidDate,
      isValidUrl: () => isValidUrl,
      makeBlurDataURL: () => makeBlurDataURL,
      microDampingPreset: () => microDampingPreset,
      microReboundPreset: () => microReboundPreset,
      omitObject: () => omitObject,
      onDebug: () => onDebug,
      onDomain: () => onDomain,
      parseDate: () => parseDate,
      pick: () => pick,
      range: () => range,
      reboundPreset: () => reboundPreset,
      relativeTimeFromNow: () => relativeTimeFromNow,
      removeEvents: () => removeEvents,
      renameProp: () => renameProp,
      secondOfDay: () => secondOfDay,
      secondOfDays: () => secondOfDays,
      shuffleArray: () => shuffleArray,
      softBouncePreset: () => softBouncePreset,
      softSpringPreset: () => softSpringPreset,
      startOfDayTimestamp: () => startOfDayTimestamp,
      startOfWeekTimestamp: () => startOfWeekTimestamp,
      storage: () => storage2,
      stringToHue: () => stringToHue,
      throttle: () => throttle,
      toHsl: () => toHsl,
      toLeftTransition: () => toLeftTransition,
      toRightTransition: () => toRightTransition,
      transform: () => transform,
      transitions: () => transitions,
      upTransition: () => upTransition,
      url: () => url
    });
    dist = __toCommonJS(src_exports);
    var import_dayjs = __toESM(requireDayjs_min());
    var import_customParseFormat = __toESM(requireCustomParseFormat());
    var import_localizedFormat = __toESM(requireLocalizedFormat());
    requireZhCn();
    import_dayjs.default.extend(import_customParseFormat.default);
    import_dayjs.default.extend(import_localizedFormat.default);
    import_dayjs.default.locale("zh-cn");
    var aDayjs = import_dayjs.default;
    var DateFormat = /* @__PURE__ */ ((DateFormat2) => {
      DateFormat2[DateFormat2["YYYY-MM-DD HH:mm:ss"] = 0] = "YYYY-MM-DD HH:mm:ss";
      DateFormat2[DateFormat2["MMM DD YYYY"] = 1] = "MMM DD YYYY";
      DateFormat2[DateFormat2["HH:mm"] = 2] = "HH:mm";
      DateFormat2[DateFormat2["LLLL"] = 3] = "LLLL";
      DateFormat2[DateFormat2["H:mm:ss A"] = 4] = "H:mm:ss A";
      DateFormat2[DateFormat2["YYYY-MM-DD"] = 5] = "YYYY-MM-DD";
      DateFormat2[DateFormat2["YYYY-MM-DD dddd"] = 6] = "YYYY-MM-DD dddd";
      DateFormat2[DateFormat2["YYYY-MM-DD ddd"] = 7] = "YYYY-MM-DD ddd";
      DateFormat2[DateFormat2["MM-DD ddd"] = 8] = "MM-DD ddd";
      DateFormat2[DateFormat2["YYYY 年 M 月 D 日 dddd"] = 9] = "YYYY 年 M 月 D 日 dddd";
      return DateFormat2;
    })(DateFormat || {});
    var dateFormat = (time = /* @__PURE__ */ new Date(), format2 = "YYYY-MM-DD HH:mm:ss") => (0, import_dayjs.default)(time).format(format2);
    var parseDate = (time = /* @__PURE__ */ new Date(), format2 = "YYYY-MM-DD HH:mm:ss") => (0, import_dayjs.default)(time).format(format2);
    var relativeTimeFromNow = (time, current = /* @__PURE__ */ new Date()) => {
      if (!time) {
        return "";
      }
      time = new Date(time);
      const msPerMinute = 60 * 1e3;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const msPerMonth = msPerDay * 30;
      const msPerYear = msPerDay * 365;
      const elapsed = +current - +time;
      if (elapsed < msPerMinute) {
        const gap = Math.ceil(elapsed / 1e3);
        return gap <= 0 ? "刚刚" : `${gap} 秒前`;
      } else if (elapsed < msPerHour) {
        return `${Math.round(elapsed / msPerMinute)} 分钟前`;
      } else if (elapsed < msPerDay) {
        return `${Math.round(elapsed / msPerHour)} 小时前`;
      } else if (elapsed < msPerMonth) {
        return `${Math.round(elapsed / msPerDay)} 天前`;
      } else if (elapsed < msPerYear) {
        return `${Math.round(elapsed / msPerMonth)} 个月前`;
      } else {
        return `${Math.round(elapsed / msPerYear)} 年前`;
      }
    };
    var dayOfYear = () => {
      const now = /* @__PURE__ */ new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1e3 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);
      return day;
    };
    function daysOfYear(year) {
      return isLeapYear(year ?? (/* @__PURE__ */ new Date()).getFullYear()) ? 366 : 365;
    }
    function isLeapYear(year) {
      return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
    }
    var secondOfDay = () => {
      const dt = /* @__PURE__ */ new Date();
      const secs = dt.getSeconds() + 60 * (dt.getMinutes() + 60 * dt.getHours());
      return secs;
    };
    var secondOfDays = 86400;
    function isValidDate(d) {
      return d instanceof Date && !Number.isNaN(+d);
    }
    function formatSeconds(seconds) {
      const days = Math.floor(seconds / (24 * 3600));
      const hours = Math.floor(seconds % (24 * 3600) / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return {
        days,
        hours,
        minutes,
        seconds: remainingSeconds
      };
    }
    function calcTimeDiff(date, returnStr = false, hideZero = false) {
      const inputDate = (0, import_dayjs.default)(date);
      const now = (0, import_dayjs.default)();
      const days = now.diff(inputDate, "day");
      const hours = now.diff(inputDate, "hour") % 24;
      const minutes = now.diff(inputDate, "minute") % 60;
      const seconds = now.diff(inputDate, "second") % 60;
      if (returnStr) {
        let result = "";
        if (!hideZero || days > 0) {
          result += `${days}天`;
        }
        if (!hideZero || hours > 0) {
          result += `${hours}小时`;
        }
        if (!hideZero || minutes > 0) {
          result += `${minutes}分钟`;
        }
        if (!hideZero || seconds > 0) {
          result += `${seconds}秒`;
        }
        return result.trim();
      } else {
        return {
          days,
          hours,
          minutes,
          seconds
        };
      }
    }
    var endOfDayTimestamp = (0, import_dayjs.default)().endOf("day").valueOf();
    var startOfDayTimestamp = (0, import_dayjs.default)().startOf("day").valueOf();
    var startOfWeekTimestamp = (0, import_dayjs.default)().day(1).startOf("day").valueOf();
    var endOfWeekTimestamp = (0, import_dayjs.default)().day(7).endOf("day").valueOf();
    function copyToClipboard(text) {
      return new Promise((resolve, reject) => {
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
            document.body.removeChild(textArea);
            resolve();
          } catch (error) {
            document.body.removeChild(textArea);
            reject(error);
          }
        } else {
          navigator.clipboard.writeText(text).then(() => resolve()).catch((error) => reject(error));
        }
      });
    }
    function fileDownload(url2, filename) {
      return new Promise((resolve, reject) => {
        const downloadElement = document.createElement("a");
        downloadElement.target = "_blank";
        downloadElement.style.display = "none";
        downloadElement.href = url2;
        downloadElement.download = filename;
        downloadElement.addEventListener("load", () => {
          document.body.removeChild(downloadElement);
          resolve();
        });
        downloadElement.addEventListener("error", (error) => {
          document.body.removeChild(downloadElement);
          reject(error);
        });
        document.body.appendChild(downloadElement);
        downloadElement.click();
      });
    }
    var onDebug = (redirectUrl = "https://www.baidu.com") => {
      if (window.location.hostname !== "localhost") {
        (() => {
          let callbacks = [];
          const timeLimit = 50;
          let open = false;
          setInterval(loop, 1);
          const devToolsChecker = {
            addListener: (fn) => {
              callbacks.push(fn);
            },
            cancelListener: (fn) => {
              callbacks = callbacks.filter((v) => v !== fn);
            }
          };
          function loop() {
            const startTime = (/* @__PURE__ */ new Date()).getTime();
            debugger;
            if ((/* @__PURE__ */ new Date()).getTime() - startTime > timeLimit) {
              if (!open) {
                callbacks.forEach((fn) => fn());
              }
              open = true;
              window.stop();
              document.body.innerHTML = "";
              window.location.href = redirectUrl;
            } else {
              open = false;
            }
          }
          devToolsChecker.addListener(() => {
            window.location.reload();
          });
          window.document.addEventListener("keydown", (event) => {
            if (event.key === "F12") {
              window.location.href = redirectUrl;
            }
          });
        })();
      }
    };
    function isArray(value) {
      return Array.isArray(value);
    }
    function isEmptyArray(value) {
      return isArray(value) && value.length === 0;
    }
    function isObject(value) {
      const type = typeof value;
      return value != null && (type === "object" || type === "function") && !isArray(value);
    }
    function isEmptyObject(value) {
      return isObject(value) && Object.keys(value).length === 0;
    }
    function isEmpty(value) {
      if (isArray(value))
        return isEmptyArray(value);
      if (isObject(value))
        return isEmptyObject(value);
      if (value == null || value === "")
        return true;
      return false;
    }
    function isFunction(value) {
      return typeof value === "function";
    }
    var dataAttr = (condition) => condition ? "true" : void 0;
    var isNumeric = (value) => value != null && parseInt(value.toString(), 10) > 0;
    function toVal(mix) {
      let k, y, str = "";
      if (typeof mix === "string" || typeof mix === "number") {
        str += mix;
      } else if (typeof mix === "object") {
        if (Array.isArray(mix)) {
          for (k = 0; k < mix.length; k++) {
            if (mix[k]) {
              if (y = toVal(mix[k])) {
                str && (str += " ");
                str += y;
              }
            }
          }
        } else {
          for (k in mix) {
            if (mix[k]) {
              str && (str += " ");
              str += k;
            }
          }
        }
      }
      return str;
    }
    function clsx(...args) {
      let i = 0, tmp, x, str = "";
      while (i < args.length) {
        if (tmp = args[i++]) {
          if (x = toVal(tmp)) {
            str && (str += " ");
            str += x;
          }
        }
      }
      return str;
    }
    var getRandomColor = (lightness, saturation, hue) => {
      const satAccent = Math.floor(
        Math.random() * (saturation[1] - saturation[0] + 1) + saturation[0]
      );
      const lightAccent = Math.floor(
        Math.random() * (lightness[1] - lightness[0] + 1) + lightness[0]
      );
      const satBackground = satAccent > 30 ? satAccent - 30 : 0;
      const lightBackground = lightAccent < 80 ? lightAccent + 20 : 100;
      return {
        accent: `hsl(${hue}, ${satAccent}%, ${lightAccent}%)`,
        // 强调颜色的HSL格式
        background: `hsl(${hue}, ${satBackground}%, ${lightBackground}%)`
        // 背景颜色的HSL格式
      };
    };
    function stringToHue(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;
      return hue < 0 ? hue + 360 : hue;
    }
    var getColorScheme = (hue) => {
      const baseHue = hue ?? Math.floor(Math.random() * 361);
      const complementaryHue = (baseHue + 180) % 360;
      const lightColors = getRandomColor([40, 70], [70, 90], baseHue);
      const darkColors = getRandomColor([20, 50], [70, 90], complementaryHue);
      return {
        light: {
          accent: lightColors.accent,
          background: lightColors.background
        },
        dark: {
          accent: darkColors.accent,
          background: darkColors.background
        }
      };
    };
    function addAlphaToHex(hex, alpha) {
      if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        throw new Error("Invalid hex color value");
      }
      let color = "";
      if (hex.length === 4) {
        color = `#${[1, 2, 3].map(
        (index) => parseInt(hex.charAt(index), 16).toString(16) + parseInt(hex.charAt(index), 16).toString(16)
      ).join("")}`;
      } else {
        color = hex;
      }
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    function addAlphaToHSL(hsl, alpha) {
      if (!/^hsl\((\d{1,3}),\s*([\d.]+)%,\s*([\d.]+)%\)$/.test(hsl)) {
        throw new Error("Invalid HSL color value");
      }
      const hsla = `${hsl.slice(0, -1)}, ${alpha})`;
      return hsla.replace("hsl", "hsla");
    }
    function hexToHsl(hex) {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      let h = 0;
      if (max === min) {
        h = 0;
      } else if (max === r) {
        h = (g - b) / (max - min) % 6;
      } else if (max === g) {
        h = (2 + (b - r) / (max - min)) % 6;
      } else {
        h = (4 + (r - g) / (max - min)) % 6;
      }
      h = Math.round(h * 60);
      const l = (max + min) / 2;
      let s = 0;
      if (max !== min) {
        s = (max - min) / (1 - Math.abs(2 * l - 1));
      }
      s = Math.round(s * 100);
      return [h, s, Math.round(l * 100)];
    }
    function extractRGBA(color) {
      const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d*(?:\.\d+)?))?\)$/;
      const match = color.match(rgbaRegex);
      if (!match) {
        throw new Error("Invalid color format");
      }
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const a = match[4] !== void 0 ? parseFloat(match[4]) : 1;
      return [r, g, b, a];
    }
    function toHsl(color) {
      let r, g, b;
      if (color.includes("#")) {
        color = color.replace("#", "");
        r = parseInt(color.substring(0, 2), 16) / 255;
        g = parseInt(color.substring(2, 4), 16) / 255;
        b = parseInt(color.substring(4, 6), 16) / 255;
      } else if (color.includes("rgb")) {
        const RGBA = extractRGBA(color);
        r = RGBA[0];
        g = RGBA[1];
        b = RGBA[2];
      } else {
        return "";
      }
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      let h = 0;
      if (max === min) {
        h = 0;
      } else if (max === r) {
        h = (g - b) / (max - min) % 6;
      } else if (max === g) {
        h = (2 + (b - r) / (max - min)) % 6;
      } else {
        h = (4 + (r - g) / (max - min)) % 6;
      }
      h = Math.round(h * 60);
      const l = (max + min) / 2;
      let s = 0;
      if (max !== min) {
        s = (max - min) / (1 - Math.abs(2 * l - 1));
      }
      s = Math.round(s * 100);
      return `${h} ${s}% ${Math.round(l * 100)}%`;
    }
    function generateTransitionColors(startColor, targetColor, step) {
      const startRed = parseInt(startColor.substring(1, 3), 16);
      const startGreen = parseInt(startColor.substring(3, 5), 16);
      const startBlue = parseInt(startColor.substring(5, 7), 16);
      const targetRed = parseInt(targetColor.substring(1, 3), 16);
      const targetGreen = parseInt(targetColor.substring(3, 5), 16);
      const targetBlue = parseInt(targetColor.substring(5, 7), 16);
      const redIncrement = (targetRed - startRed) / step;
      const greenIncrement = (targetGreen - startGreen) / step;
      const blueIncrement = (targetBlue - startBlue) / step;
      const transitionColors = [];
      for (let i = 0; i < step; i++) {
        const transitionRed = Math.round(startRed + redIncrement * i);
        const transitionGreen = Math.round(startGreen + greenIncrement * i);
        const transitionBlue = Math.round(startBlue + blueIncrement * i);
        const hexColor = `#${(1 << 24 | transitionRed << 16 | transitionGreen << 8 | transitionBlue).toString(16).slice(1)}`;
        transitionColors.push(hexColor);
      }
      return Array.from(new Set(transitionColors));
    }
    var renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => ({
      [newProp]: old,
      ...others
    });
    var copyObject = (obj) => {
      if (!isObject(obj))
        return obj;
      if (obj instanceof Array)
        return [...obj];
      return { ...obj };
    };
    var omitObject = (obj, omitKeys) => {
      if (!isObject(obj))
        return obj;
      if (obj instanceof Array)
        return [...obj];
      const newObj = { ...obj };
      omitKeys.forEach((key) => newObj[key] && delete newObj[key]);
      return newObj;
    };
    var cleanObject = (obj) => {
      if (!isObject(obj))
        return obj;
      if (obj instanceof Array)
        return [...obj];
      const newObj = { ...obj };
      Object.keys(newObj).forEach((key) => {
        if (newObj[key] === void 0 || newObj[key] === null) {
          delete newObj[key];
        }
      });
      return newObj;
    };
    var cleanObjectKeys = (obj, keys = []) => {
      if (!isObject(obj))
        return obj;
      if (obj instanceof Array)
        return [...obj];
      const newObj = { ...obj };
      keys.forEach((key) => {
        if (newObj[key]) {
          delete newObj[key];
        }
      });
      return newObj;
    };
    var getKeyValue = (obj, key) => {
      if (!isObject(obj))
        return obj;
      if (obj instanceof Array)
        return [...obj];
      return obj[key];
    };
    var getProp = (obj, path, fallback, index) => {
      const key = typeof path === "string" ? path.split(".") : [path];
      for (index = 0; index < key.length; index += 1) {
        if (!obj)
          break;
        obj = obj[key[index]];
      }
      return obj === void 0 ? fallback : obj;
    };
    var arrayToObject = (arr) => {
      if (!arr.length || !Array.isArray(arr))
        return {};
      return arr.reduce((acc, item) => {
        return { ...acc, ...item };
      }, {});
    };
    function compact(object) {
      const clone = Object.assign({}, object);
      for (let key in clone) {
        if (clone[key] === void 0)
          delete clone[key];
      }
      return clone;
    }
    function range(start, end) {
      const length = end - start + 1;
      return Array.from({ length }, (_, index) => index + start);
    }
    function clampPercentage(value, max = 100) {
      return Math.min(Math.max(value, 0), max);
    }
    var capitalize = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };
    function callAllHandlers(...fns) {
      return function func(event) {
        fns.some((fn) => {
          fn == null ? void 0 : fn(event);
          return event == null ? void 0 : event.defaultPrevented;
        });
      };
    }
    function callAll(...fns) {
      return function mergedFn(arg) {
        fns.forEach((fn) => {
          fn == null ? void 0 : fn(arg);
        });
      };
    }
    function extractProperty(key, defaultValue, ...objs) {
      let result = defaultValue;
      for (const obj of objs) {
        if (obj && key in obj && !!obj[key]) {
          result = obj[key];
        }
      }
      return result;
    }
    function getUniqueID(prefix) {
      return `${prefix}-${Math.floor(Math.random() * 1e6)}`;
    }
    function removeEvents(input2) {
      for (const key in input2) {
        if (key.startsWith("on")) {
          delete input2[key];
        }
      }
      return input2;
    }
    var storage2 = {
      s: {
        set(key, val, isObject2 = false) {
          return isObject2 ? sessionStorage.setItem(key, JSON.stringify(val)) : sessionStorage.setItem(key, val);
        },
        get(key, isReturnObject = false) {
          const val = sessionStorage.getItem(key);
          if (val) {
            try {
              return isReturnObject ? JSON.parse(sessionStorage.getItem(key) || "") : sessionStorage.getItem(key);
            } catch (e) {
              return null;
            }
          } else {
            return null;
          }
        },
        remove(key) {
          if (!sessionStorage[key])
            return false;
          sessionStorage.removeItem(key);
          return true;
        },
        clear() {
          sessionStorage.clear();
        }
      },
      l: {
        set(key, val, isObject2 = false) {
          return isObject2 ? localStorage.setItem(key, JSON.stringify(val)) : localStorage.setItem(key, val);
        },
        get(key, isReturnObject = false) {
          const val = localStorage.getItem(key);
          if (val) {
            try {
              return isReturnObject ? JSON.parse(localStorage.getItem(key) || "") : localStorage.getItem(key);
            } catch (e) {
              return null;
            }
          } else {
            return null;
          }
        },
        remove(key) {
          if (!localStorage[key])
            return false;
          localStorage.removeItem(key);
          return true;
        },
        clear() {
          localStorage.clear();
        }
      }
    };
    var debounce = (func, wait, immediate = false) => {
      let timeoutId;
      return function(...args) {
        const context = this;
        const doLater = () => {
          timeoutId = void 0;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        const shouldCallNow = immediate && timeoutId === void 0;
        if (timeoutId !== void 0) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(doLater, wait);
        if (shouldCallNow) {
          func.apply(context, args);
        }
      };
    };
    var throttle = (func, wait, options = {}) => {
      let timeoutId;
      let lastArgs;
      let lastCallTime;
      const doLater = () => {
        timeoutId = void 0;
        if (lastArgs !== void 0) {
          func.apply(void 0, lastArgs);
          lastArgs = void 0;
          lastCallTime = Date.now();
          timeoutId = setTimeout(doLater, wait);
        }
      };
      return function(...args) {
        const currentTime = Date.now();
        if (lastCallTime === void 0 && options.leading === false) {
          lastCallTime = currentTime;
        }
        const remainingTime = wait - (currentTime - (lastCallTime ?? 0));
        if (remainingTime <= 0 || remainingTime > wait) {
          if (timeoutId !== void 0) {
            clearTimeout(timeoutId);
          }
          func.apply(this, args);
          lastCallTime = currentTime;
          timeoutId = setTimeout(doLater, wait);
        } else if (options.trailing !== false) {
          lastArgs = args;
          if (timeoutId === void 0) {
            timeoutId = setTimeout(doLater, remainingTime);
          }
        }
      };
    };
    var cloneDeep = (val) => {
      if (Array.isArray(val)) {
        return val.map(cloneDeep);
      } else if (typeof val === "object" && val !== null) {
        const result = {};
        for (const key in val) {
          result[key] = cloneDeep(val[key]);
        }
        return result;
      } else {
        return val;
      }
    };
    var pick = (obj, keys) => {
      const result = {};
      keys.forEach((key) => {
        if (key in obj) {
          result[key] = obj[key];
        }
      });
      return result;
    };
    var isNil = (value) => {
      return value === null || value === void 0;
    };
    var transform = (collection, iteratee, accumulator) => {
      const result = accumulator;
      if (Array.isArray(collection)) {
        for (let index = 0; index < collection.length; index++) {
          const value = collection[index];
          const shouldContinue = iteratee(
            result,
            value,
            index,
            collection
          );
          if (shouldContinue === false)
            break;
        }
      } else {
        for (const key in collection) {
          if (Object.prototype.hasOwnProperty.call(collection, key)) {
            const value = collection[key];
            const shouldContinue = iteratee(
              result,
              value,
              key,
              collection
            );
            if (shouldContinue === false)
              break;
          }
        }
      }
      return result;
    };
    function getBrowser() {
      const userAgent = navigator.userAgent;
      const getVersion = (userAgent2, reg) => {
        const reBrowser = new RegExp(reg);
        reBrowser.test(userAgent2);
        return ` ${RegExp["$1"]}`;
      };
      const _windows = window;
      let version;
      if (/opera/i.test(userAgent) || /OPR/i.test(userAgent)) {
        version = getVersion(userAgent, "OPR/(\\d+\\.\\d+)?");
        return "Opera" + version;
      } else if (/compatible/i.test(userAgent) && /MSIE/i.test(userAgent)) {
        version = getVersion(userAgent, "MSIE (\\d+\\.+\\d+)?");
        return "IE" + version;
      } else if (/Edg/i.test(userAgent)) {
        version = getVersion(userAgent, "Edg/(\\d+\\.*\\d+)?");
        return "Edge" + version;
      } else if (/Firefox/i.test(userAgent)) {
        version = getVersion(userAgent, "Firefox/(\\d+\\.+\\d+)?");
        return "Firefox" + version;
      } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        version = getVersion(userAgent, "Safari/(\\d+\\.+\\d+)?");
        return "Safari" + version;
      } else if (/Chrome/i.test(userAgent) && /Safari/i.test(userAgent)) {
        version = getVersion(userAgent, "Chrome/(\\d+\\.+\\d+)?");
        return "Chrome" + version;
      } else if (!!_windows.ActiveXObject || "ActiveXObject" in _windows) {
        version = 11;
        return "IE" + version;
      } else {
        return null;
      }
    }
    function getOS() {
      const userAgent = navigator.userAgent.toLowerCase();
      let name = null;
      let version = null;
      if (userAgent.indexOf("win") > -1) {
        name = "Windows";
        if (userAgent.indexOf("windows nt 10.0") > -1) {
          if (userAgent.indexOf("win11") > -1) {
            version = "11";
          } else {
            version = "10";
          }
        } else if (userAgent.indexOf("windows nt 6.3") > -1) {
          version = "8.1";
        } else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1) {
          version = "8";
        } else if (userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1) {
          version = "7";
        } else if (userAgent.indexOf("windows nt 6.0") > -1) {
          version = "Vista";
        } else if (userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("windows nt 5.2") > -1) {
          version = "XP";
        } else if (userAgent.indexOf("windows nt 5.0") > -1) {
          version = "2000";
        }
      } else if (userAgent.indexOf("iphone") > -1) {
        name = "iPhone";
      } else if (userAgent.indexOf("mac") > -1) {
        name = "Mac";
      } else if (userAgent.indexOf("android") > -1) {
        name = "Android";
      } else if (userAgent.indexOf("x11") > -1 || userAgent.indexOf("unix") > -1 || userAgent.indexOf("sunname") > -1 || userAgent.indexOf("bsd") > -1) {
        name = "Unix";
      } else if (userAgent.indexOf("linux") > -1) {
        name = "Linux";
      }
      const os = version && name ? `${name} ${version}` : name ? name : null;
      return os;
    }
    function isMobile() {
      if (typeof navigator != "undefined" && navigator && (navigator.userAgent.indexOf("iPod") != -1 || navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Android") != -1)) {
        return true;
      } else {
        return false;
      }
    }
    var isClientSide = typeof window !== "undefined";
    var isServerSide = !isClientSide;
    var isDev = false;
    var shimmer = (w, h) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" opacity="0.5">
  <defs>
    <linearGradient id="g-image-shimmer">
      <stop stop-color="#ccc" offset="20%" />
      <stop stop-color="#eee" offset="50%" />
      <stop stop-color="#ccc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g-image-shimmer)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
    var toBase64 = (str) => typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);
    function makeBlurDataURL(width, height) {
      return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
    }
    var getImageExt = (file) => {
      if (!file || !file.type) {
        return null;
      }
      const mimeType = file.type;
      if (mimeType === "image/jpeg") {
        return "jpeg";
      } else if (mimeType === "image/png") {
        return "png";
      } else if (mimeType === "image/gif") {
        return "gif";
      } else if (mimeType === "image/webp") {
        return "webp";
      } else if (mimeType === "image/svg+xml") {
        return "svg";
      } else if (mimeType === "image/bmp") {
        return "bmp";
      } else if (mimeType === "image/tiff") {
        return "tiff";
      } else {
        return null;
      }
    };
    var getImageMimeType = (ext) => {
      switch (ext) {
        case "jpeg":
          return "image/jpeg";
        case "jpg":
          return "image/jpg";
        case "png":
          return "image/png";
        case "gif":
          return "image/gif";
        case "webp":
          return "image/webp";
        case "svg":
          return "image/svg+xml";
        case "bmp":
          return "image/bmp";
        case "tiff":
          return "image/tiff";
        default:
          return null;
      }
    };
    var SNOW = "data:image/png;base64,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";
    var SAKURA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAEwCAYAAADVZeifAAAACXBIWXMAAACYAAAAmAGiyIKYAAAHG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDFDMjQxQjYyNjIwNjgxMTgwODNEMjE2MDAzOTU1NDQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozNDVjOWViOC04NDc4LTFkNDctOGRjMi0yZDkyOGNhYTYxZWQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjAzN2ZiMGItNTU5Mi0xYjRkLWJjZGQtOWU4NGExMDJiMGM2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA1LTA5VDE0OjQ5OjM3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wNS0wOVQxNDo1MToyNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNS0wOVQxNDo1MToyNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyMjVlZWE3LTEyY2QtMTY0NC04ZDAzLWFjOTE2ZTAxZDQ1YyIgc3RSZWY6ZG9jdW1lbnRJRD0idXVpZDoxRDIwNUFGNjZCRDlFNTExOUM5REMwMzg2RjlEQjFGNyIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYmMzNjIzMy1hOWNkLWNiNDQtODViYi0zZTgyMjEwYmIxMjYiIHN0RXZ0OndoZW49IjIwMTgtMDUtMDlUMTQ6NTE6MjUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjAzN2ZiMGItNTU5Mi0xYjRkLWJjZGQtOWU4NGExMDJiMGM2IiBzdEV2dDp3aGVuPSIyMDE4LTA1LTA5VDE0OjUxOjI1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2Vx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";
    var Sakura = class {
      constructor(x, y, s, r, fn, idx) {
        __publicField(this, "x");
        __publicField(this, "y");
        __publicField(this, "s");
        __publicField(this, "r");
        __publicField(this, "fn");
        __publicField(this, "idx");
        this.x = x;
        this.y = y;
        this.s = s;
        this.r = r;
        this.fn = fn;
        this.idx = idx;
      }
      draw(cxt, img) {
        cxt.save();
        40 * this.s / 4;
        cxt.translate(this.x, this.y);
        cxt.rotate(this.r);
        cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s);
        cxt.restore();
      }
      update(limitArray, getRandom) {
        this.x = this.fn.x(this.x, this.y);
        this.y = this.fn.y(this.x, this.y);
        this.r = this.fn.r(this.r);
        if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
          if (limitArray[this.idx] === -1) {
            this.reset(getRandom);
          } else {
            if (limitArray[this.idx] > 0) {
              this.reset(getRandom);
              limitArray[this.idx]--;
            }
          }
        }
      }
      reset(getRandom) {
        this.r = getRandom("fnr");
        if (Math.random() > 0.4) {
          this.x = getRandom("x");
          this.y = 0;
          this.s = getRandom("s");
          this.r = getRandom("r");
        } else {
          this.x = window.innerWidth;
          this.y = getRandom("y");
          this.s = getRandom("s");
          this.r = getRandom("r");
        }
      }
    };
    var SakuraList = class {
      constructor() {
        __publicField(this, "list", []);
      }
      push(sakura) {
        this.list.push(sakura);
      }
      update(limitArray, getRandom) {
        for (const sakura of this.list) {
          sakura.update(limitArray, getRandom);
        }
      }
      draw(cxt, img) {
        for (const sakura of this.list) {
          sakura.draw(cxt, img);
        }
      }
    };
    var SakuraAnimation = class {
      constructor() {
        __publicField(this, "stopId", null);
        __publicField(this, "staticx", false);
        __publicField(this, "img");
        __publicField(this, "sakuraNum");
        __publicField(this, "limitTimes");
        __publicField(this, "limitArray");
        __publicField(this, "sakuraList");
        __publicField(this, "onResize", () => {
          const canvasSnow = document.getElementById(
            "canvas_snow"
          );
          if (canvasSnow) {
            canvasSnow.width = window.innerWidth;
            canvasSnow.height = window.innerHeight;
          }
        });
        this.img = new Image();
        this.sakuraNum = this.isMobile() ? 3 : 10;
        this.limitTimes = -1;
        this.limitArray = new Array(this.sakuraNum).fill(this.limitTimes);
        this.sakuraList = new SakuraList();
        window.addEventListener("resize", this.onResize);
      }
      isMobile() {
        return navigator.userAgent.indexOf("iPod") !== -1 || navigator.userAgent.indexOf("iPad") !== -1 || navigator.userAgent.indexOf("Android") !== -1;
      }
      getRandom(option) {
        let ret, random;
        switch (option) {
          case "x":
            ret = Math.random() * window.innerWidth;
            break;
          case "y":
            ret = Math.random() * window.innerHeight;
            break;
          case "s":
            ret = Math.random();
            break;
          case "r":
            ret = Math.random() * 6;
            break;
          case "fnx":
            random = -0.3 + Math.random() * 1;
            ret = (x, y) => x + 0.5 * random - 1.7;
            break;
          case "fny":
            random = 1.1 + Math.random() * 0.7;
            ret = (x, y) => y + random;
            break;
          case "fnr":
            random = Math.random() * 0.03;
            ret = (r) => r + random;
            break;
        }
        return ret;
      }
      setImage(src) {
        this.img.src = src;
        this.img.onload = () => {
          this.startSakura();
        };
      }
      startSakura() {
        const canvas = document.createElement("canvas");
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.setAttribute(
          "style",
          "position: fixed; left: 0; top: 0; pointer-events: none; opacity: 0.4;"
        );
        canvas.setAttribute("id", "remio_sakura");
        document.body.appendChild(canvas);
        const cxt = canvas.getContext("2d");
        for (let i = 0; i < this.sakuraNum; i++) {
          const sakura = new Sakura(
            this.getRandom("x"),
            this.getRandom("y"),
            this.getRandom("s"),
            this.getRandom("r"),
            {
              x: this.getRandom("fnx"),
              y: this.getRandom("fny"),
              r: this.getRandom("fnr")
            },
            i
          );
          sakura.draw(cxt, this.img);
          this.sakuraList.push(sakura);
        }
        this.staticx = true;
        this.stopId = requestAnimationFrame(this.update.bind(this, cxt));
      }
      update(cxt) {
        cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);
        this.sakuraList.update(this.limitArray, this.getRandom.bind(this));
        this.sakuraList.draw(cxt, this.img);
        this.stopId = requestAnimationFrame(this.update.bind(this, cxt));
      }
      stop() {
        var _a2;
        if (this.staticx) {
          const child = document.getElementById("remio_sakura");
          if (child) {
            (_a2 = child.parentNode) == null ? void 0 : _a2.removeChild(child);
            if (this.stopId !== null) {
              cancelAnimationFrame(this.stopId);
            }
          }
          this.staticx = false;
        } else {
          this.startSakura();
        }
      }
    };
    var aSakura = (src = SAKURA) => {
      var _a2;
      const child = document.getElementById("remio_sakura");
      if (child)
        (_a2 = child.parentNode) == null ? void 0 : _a2.removeChild(child);
      const sakuraAnimation = new SakuraAnimation();
      switch (src) {
        case "sakura":
          sakuraAnimation.setImage(SAKURA);
          break;
        case "snow":
          sakuraAnimation.setImage(SNOW);
          break;
        default:
          sakuraAnimation.setImage(SAKURA);
          break;
      }
    };
    var isValidUrl = (url2, validHttp = false, returnHost = false) => {
      if (!url2)
        return false;
      try {
        const newUrl = new URL(url2);
        if (validHttp)
          return newUrl.protocol === "http:" || newUrl.protocol === "https:";
        if (returnHost)
          return newUrl.host;
        return true;
      } catch (err) {
        return false;
      }
    };
    function url(path = "") {
      if ("https://example.com".includes("localhost")) {
        path = path.replace("/api", "");
      }
      const baseUrl = "https://example.com";
      return new URL(path, baseUrl);
    }
    function onDomain(url2, onlyRoot = true) {
      const hostname = new URL(
        url2.includes("http") ? url2 : `http://${url2}`
      ).hostname.replace("www.", "");
      const parts = hostname.split(".");
      if (parts.length <= 2 || !onlyRoot) {
        return hostname;
      }
      return parts.slice(-2).join(".");
    }
    var reboundPreset = {
      type: "spring",
      bounce: 1,
      // 弹性效果的弹性程度
      stiffness: 140,
      // 弹性表现硬度的数值
      damping: 8
      // 反方向的阻力
    };
    var microDampingPreset = {
      type: "spring",
      damping: 24
    };
    var microReboundPreset = {
      type: "spring",
      stiffness: 300,
      damping: 20
    };
    var softSpringPreset = {
      duration: 0.35,
      type: "spring",
      stiffness: 120,
      damping: 20
    };
    var softBouncePreset = {
      type: "spring",
      damping: 10,
      stiffness: 100
    };
    var upTransition = {
      from: {
        y: 50,
        opacity: 1e-3
      },
      to: {
        y: 0,
        opacity: 1
      },
      preset: softBouncePreset
    };
    var downTransition = {
      from: {
        y: -50,
        opacity: 1e-3
      },
      to: {
        y: 0,
        opacity: 1
      },
      preset: softBouncePreset
    };
    var toRightTransition = {
      from: {
        translateX: -70,
        opacity: 1e-3
      },
      to: {
        translateX: 0,
        opacity: 1
      }
    };
    var toLeftTransition = {
      from: {
        translateX: 70,
        opacity: 1e-3
      },
      to: {
        translateX: 0,
        opacity: 1
      }
    };
    var fadeInTransition = {
      from: {
        opacity: 1e-3
      },
      to: {
        opacity: 1
      }
    };
    var fadeOutTransition = {
      from: {
        opacity: 1
      },
      to: {
        opacity: 1e-3
      }
    };
    var increaseTransition = {
      from: {
        scale: 1e-3,
        opacity: 1e-3
      },
      to: {
        scale: 1,
        opacity: 1
      }
    };
    var decreaseTransition = {
      from: {
        scale: 1,
        opacity: 1
      },
      to: {
        scale: 1e-3,
        opacity: 1e-3
      }
    };
    var transitions = {
      up: upTransition,
      down: downTransition,
      toRight: toRightTransition,
      toLeft: toLeftTransition,
      fadeIn: fadeInTransition,
      fadeOut: fadeOutTransition,
      increase: increaseTransition,
      decrease: decreaseTransition
    };
    var bufferToBase64 = (buffer) => {
      return buffer.toString("base64");
    };
    var base64ToBuffer = (base64Str) => {
      return Buffer.from(base64Str, "base64");
    };
    var bufferToBlbo = (buffer) => {
      return new Blob([buffer]);
    };
    var bufferToBlboUrl = (buffer) => {
      return URL.createObjectURL(new Blob([buffer]));
    };
    var blboToBuffer = async (blob) => {
      return Buffer.from(await blob.arrayBuffer());
    };
    var fileToBuffer = async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    };
    var fileToBlbo = async (file) => {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        var _a2;
        const base64 = ((_a2 = e.target) == null ? void 0 : _a2.result) || "";
        return base64 ? new Blob([base64], { type: file.type }) : null;
      });
      reader.readAsDataURL(file);
    };
    function getFileSize(size, { decimalPlaces = 2, showByte = true, showSuffix = true } = {}) {
      if (!size)
        return 0;
      if (typeof decimalPlaces !== "number" || !Number.isInteger(decimalPlaces)) {
        throw new Error("decimalPlaces 必须是一个整数");
      }
      const units = ["B", "K", "M", "G", "T"];
      const powers = [0, 1, 2, 3, 4];
      const num = 1024;
      const precalculated = powers.map((power) => Math.pow(num, power));
      let unitIndex = 0;
      while (size >= precalculated[unitIndex + 1] && unitIndex < precalculated.length - 1) {
        unitIndex++;
      }
      const buildSizeString = (value, unit, _showSuffix = showSuffix) => {
        const suffix = ` ${unit}${_showSuffix ? "B" : ""}`;
        return value.toFixed(decimalPlaces) + suffix;
      };
      if (showByte && size < num) {
        return buildSizeString(size, "B", false);
      }
      return buildSizeString(size / precalculated[unitIndex], units[unitIndex]);
    }
    var getRandomElements = (array, count) => {
      if (!(array == null ? void 0 : array.length))
        return array;
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    var shuffleArray = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    };
    return dist;
  }
  var distExports = requireDist();
  const BaseUrl = "https://example.com";
  let DATE = "";
  let mioDates = "";
  let artwork = null;
  const isArtwork = () => {
    if (window.location.pathname && window.location.pathname.includes("artworks")) {
      const pathname = window.location.pathname.split("/");
      if (pathname == null ? void 0 : pathname.length) {
        return +pathname[pathname.length - 1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  let pid = isArtwork();
  const createRadio = (id, name, value, labelText, div2, field) => {
    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.id = id;
    radioButton.name = name;
    radioButton.value = value.toString();
    radioButton.addEventListener("click", () => {
      artwork[field] = +radioButton.value;
    });
    if (+artwork[field] == +value) {
      radioButton.checked = true;
    }
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    div2.className = "mio-options-item";
    div2.appendChild(radioButton);
    div2.appendChild(label);
  };
  const renderOptions = (root) => {
    const tips = document.createElement("p");
    tips.className = "mio-result-message";
    const r18 = document.createElement("div");
    createRadio("r18-option0", "r18options", 10, "默认", r18, "r18");
    createRadio("r18-option1", "r18options", 0, "r12", r18, "r18");
    createRadio("r18-option2", "r18options", 1, "r18", r18, "r18");
    createRadio("r18-option3", "r18options", 2, "全年龄", r18, "r18");
    const wall = document.createElement("div");
    createRadio("wall-option0", "walloptions", 0, "默认", wall, "wallpaper");
    createRadio("wall-option1", "walloptions", 1, "横屏壁纸", wall, "wallpaper");
    createRadio("wall-option2", "walloptions", 2, "竖屏壁纸", wall, "wallpaper");
    createRadio("wall-option3", "walloptions", 3, "头像", wall, "wallpaper");
    root.appendChild(r18);
    root.appendChild(wall);
    root.appendChild(tips);
  };
  const topError = (text) => {
    const error = document.querySelector(".mio-error");
    if (error) {
      error.innerText = text;
    }
  };
  const onTips = (text, error) => {
    let msg = document.querySelector(".mio-result-message");
    if (msg) {
      msg.style.color = error ? "red" : "#69f769";
      msg.innerHTML = text;
    }
  };
  const format = (v, date, mode, uid, uploadName) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    let tags = (v == null ? void 0 : v.tags) || [];
    let pageCount = +v.illust_page_count;
    let pathDate = null, pixAvatar = null, exts = [];
    if (v.attr == "original" && !tags.includes("original")) {
      tags.push("原创");
      tags.push("original");
    }
    if (tags == null ? void 0 : tags.length) {
      tags = tags.filter((vv) => {
        return vv && !vv.includes("收藏") && !vv.includes("users") && !vv.includes("bookmarks") && !vv.includes("Bookmarks") && !vv.includes("R-18");
      });
    }
    const matches = v.url.match(/\/(\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2})\//);
    if (matches && matches[1]) {
      pathDate = matches[1];
    }
    const extArr = (_a2 = v.url) == null ? void 0 : _a2.split(".");
    if (extArr == null ? void 0 : extArr.length) {
      const ext = extArr[extArr.length - 1];
      for (let index = 0; index < pageCount; index++) {
        exts.push(ext);
      }
    }
    if (v.profile_img && !v.profile_img.includes("no_profile")) {
      pixAvatar = (_c = (_b2 = v.profile_img) == null ? void 0 : _b2.replace("https://i.pximg.net/user-profile/img/", "")) == null ? void 0 : _c.replace("_50", "");
    }
    return {
      pid: v.illust_id,
      uid: v.user_id,
      author: ((_h = (_g = (_f = (_e = (_d = v.user_name) == null ? void 0 : _d.replace(/＠(.*)/, "")) == null ? void 0 : _e.replace(/@(.*)/, "")) == null ? void 0 : _f.replace(/❤(.*)/, "")) == null ? void 0 : _g.replace(/■(.*)/, "")) == null ? void 0 : _h.replace(/▶(.*)/, "")) || v.user_name,
      rankType: mode,
      tags: tags == null ? void 0 : tags.join(","),
      exts: exts[0],
      pageCount,
      title: v.title,
      datePath: pathDate,
      pixAvatar,
      width: v.width,
      height: v.height,
      aspectRatio: Math.round(v.width / v.height * 1e3) / 1e3,
      createDate: new Date(
        new Date(v.illust_upload_timestamp * 1e3).toLocaleString("chinese", {
          hour12: false
        })
      ),
      viewCount: v.view_count,
      ratingCount: v.rating_count,
      illusType: +v.illust_type,
      uploadName,
      uploadUid: uid,
      status: (v == null ? void 0 : v.is_bookmarked) ? v.yes_rank - 101 : v.yes_rank,
      startDate: v.yes_rank == 0 ? `${date}_${v.yes_rank}:${v.rank}` : null,
      endDate: v.yes_rank > 0 ? `${date}_${v.yes_rank}:${v.rank}` : null
    };
  };
  const formatIllust = (image) => {
    var _a2, _b2, _c, _d, _e, _f, _g;
    let {
      id,
      height,
      width,
      aiType,
      pageCount,
      urls,
      createDate,
      bookmarkCount,
      illustType,
      title,
      tags: { tags: tagsObj },
      userName: author,
      userId: uid,
      userAccount: account
    } = image;
    let datePath = null, pixAvatar = null, ext = null, tag = [], r18 = 10;
    const divAvatar = document.querySelector(`a[href="/users/${uid}"]`);
    if (divAvatar) {
      const src = ((_a2 = divAvatar.querySelector("img")) == null ? void 0 : _a2.src) || null;
      if (src && !src.includes("no_profile")) {
        pixAvatar = (_c = (_b2 = src.replace("https://i.pximg.net/user-profile/img/", "")) == null ? void 0 : _b2.replace("_170", "")) == null ? void 0 : _c.replace("_50", "");
      }
    }
    if (urls && urls.original) {
      let matches = urls.original.match(
        /\/(\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2})\//
      );
      if (matches && matches[1]) {
        datePath = matches[1];
      }
      const arrs = urls.original.split(".");
      ext = arrs[arrs.length - 1];
    }
    if (tagsObj == null ? void 0 : tagsObj.length) {
      tagsObj.forEach((v) => {
        if (r18 != 1 && v.tag.includes("R-18")) {
          return r18 = 1;
        }
        if (v.tag.includes("收藏") || v.tag.includes("users") || v.tag.includes("bookmarks") || v.tag.includes("Bookmarks")) {
          return;
        }
        if (aiType != 2 && (v.tag.includes("AIイラスト") || v.tag.includes("ai绘图"))) {
          aiType = 2;
        }
        if (v.tag) {
          tag.push(v.tag);
        }
        if (v.translation && v.translation.en) {
          tag.push(v.translation.en);
        }
        return v;
      });
    }
    tag = [...new Set(tag)];
    const userDom = document.querySelector("div.sc-1asno00-0");
    const uploadUserName = userDom == null ? void 0 : userDom.getAttribute("title");
    return {
      pid: +id,
      pixAccount: account,
      illustType,
      height,
      width,
      aiType,
      pageCount,
      createDate,
      status: bookmarkCount,
      pixAvatar,
      title,
      uid,
      ext: [ext],
      r18,
      wallpaper: 0,
      aspectRatio: Math.round(width / height * 1e3) / 1e3,
      author: ((_g = (_f = (_e = (_d = author == null ? void 0 : author.replace(/＠(.*)/, "")) == null ? void 0 : _d.replace(/@(.*)/, "")) == null ? void 0 : _e.replace(/❤(.*)/, "")) == null ? void 0 : _f.replace(/■(.*)/, "")) == null ? void 0 : _g.replace(/▶(.*)/, "")) || author,
      datePath,
      tag,
      tags: tag.join(","),
      uploadUid: -1,
      uploadUserName
    };
  };
  const getDate = (prev, next, date) => {
    let currentDate = /* @__PURE__ */ new Date();
    if (!prev && !next) {
      if (currentDate.getHours() > 12 || currentDate.getHours() === 12 && currentDate.getMinutes() > 0) {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        currentDate.setDate(currentDate.getDate() - 2);
      }
    } else if (date) {
      const year2 = date.slice(0, 4);
      const month2 = date.slice(4, 6) - 1;
      const day2 = date.slice(6, 8);
      currentDate = new Date(year2, month2, day2);
      if (prev) {
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };
  const getRankAndToMio = (_e) => {
    if (!onCheckDate()) return;
    const urlParams = new URLSearchParams(window.location.search);
    let mode = urlParams.get("mode"), date = DATE;
    let data = [], url = `/ranking.php?format=json`, uid = null;
    if (mode) url = `${url}&mode=${mode}`;
    if (date) url = `${url}&date=${date}`;
    const userDom = document.querySelector("div.sc-1asno00-0");
    const uploadName = userDom == null ? void 0 : userDom.getAttribute("title");
    onLoading(true);
    const page_1 = request({
      method: "GET",
      url: `${url}&p=1`,
      headers: {
        referer: "https://www.pixiv.net/",
        "Accept-Language:": "zh-CN,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7,en,en-CN;q=0.6"
      }
    });
    const page_2 = request({
      method: "GET",
      url: `${url}&p=2`,
      headers: {
        referer: "https://www.pixiv.net/",
        "Accept-Language:": "zh-CN,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7,en,en-CN;q=0.6"
      }
    });
    Promise.all([page_1, page_2]).then(([res_1, res_2]) => {
      if (res_1 && res_2) {
        const { contents: page1, date: date1, mode: mode1 } = res_1;
        const {
          contents: page2,
          date: date2,
          mode: mode2,
          prev_date,
          next_date
        } = res_2;
        if (date1 == date2 && mode1 == mode2) {
          [...page1, ...page2].forEach((ele) => {
            data.push(format(ele, date1, mode1, uid, uploadName));
          });
          return {
            rankDate: date1,
            prevDate: prev_date,
            nextDate: next_date,
            rankType: mode1,
            uploadName,
            rankList: data
          };
        }
      }
      return null;
    }).then((params) => {
      if (!params) return topError("❗未获取到数据~");
      if (!input.value && distExports.isValidUrl(input.value))
        return topError("❗请求地址不正确，请检查~");
      storage.set("RankApi", input.value);
      const proMsg = document.querySelector(".mio-pro-msg");
      if (proMsg) {
        content.removeChild(proMsg);
      }
      content.innerHTML = content.innerHTML + `
        <div class="mio-pro-msg" style="display: flex;flex-direction: column;gap: 10px;">
          <p>当前排行榜类型为：${params.rankType}</p>
          <p>过滤一些非插画类型，实际抓取数据量为：${params.rankList.length}条</p>
          <p>开始发送数据...</p>
          <p style="color: #69f769;" class="mio-result-message"></p>
        </div>
      `;
      let msg = document.querySelector(".mio-result-message");
      request({
        method: "POST",
        url: input.value,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(params)
      }).then((res) => {
        console.log("请求mio结果：", res);
        if (res.success) {
          msg.innerHTML = "🎉好耶！发送数据成功~";
          if (mioDates) {
            _GM.setValue("mio-dates", `${mioDates},${date}`);
            mioDates = `${mioDates},${date}`;
          } else {
            _GM.setValue("mio-dates", date);
            mioDates = data;
          }
        } else {
          msg.style.color = "red";
          msg.innerHTML = `💔发送失败惹。${(res == null ? void 0 : res.message) || ""}`;
        }
        _GM.notification(res.message);
      }).catch((e) => {
        msg.style.color = "red";
        msg.innerHTML = `💔发送失败惹。${(e == null ? void 0 : e.statusText) || e}`;
      }).finally(() => {
        onLoading(false);
      });
    }).finally(() => {
      onLoading(false);
    });
  };
  const getArtworkAndToMio = (_e) => {
    console.log("artwork", artwork, input.value);
    if (+artwork.pid == +(pid || 0) && artwork.illustType == 0) {
      if (!input.value && distExports.isValidUrl(input.value))
        return topError("❗请求地址不正确，请检查~");
      storage.set("ArtApi", input.value);
      request({
        method: "POST",
        url: input.value,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(artwork)
      }).then((res) => {
        console.log("请求新增mio结果：", res);
        if (res.success) {
          onTips(`🎉好耶！${res.message}~`);
        } else {
          onTips(`💔新增失败惹。${(res == null ? void 0 : res.message) || ""}~`, true);
        }
      }).catch((e) => onTips(`💔新增失败惹。${e == null ? void 0 : e.statusText}~`, true)).finally(() => {
        onLoading(false);
      });
    } else {
      topError(
        artwork.pid != pid ? "❗pid不一致，请检查~" : "💤该作品类型不支持添加mio~"
      );
    }
  };
  const getArtwork = () => {
    request({
      method: "GET",
      url: `/ajax/illust/${pid}`,
      headers: {
        referer: "https://www.pixiv.net/",
        "Accept-Language:": "zh-CN,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7,en,en-CN;q=0.6"
      }
    }).then((res) => {
      if (!res.error) {
        artwork = formatIllust(res.body);
        if (artwork.illustType != 0 || artwork.tag.includes("漫画") || artwork.tag.includes("manga")) {
          topError("💤该作品类型不支持添加mio~");
          addMio.disabled = true;
        } else {
          topError("");
          addMio.disabled = false;
        }
        content.innerHTML = content.innerHTML + `
          <p>Pid：${artwork.pid} 画师：${artwork.author}</P>
          <p>标题：${artwork.title}</P>
          <p>标签：${artwork.tags}</P>
          `;
        renderOptions(content);
      }
    });
  };
  const NOW = getDate();
  const actions = document.createElement("div");
  const content = document.createElement("div");
  const addMio = document.createElement("button");
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  const span = document.createElement("span");
  const input = document.createElement("input");
  const html = document.querySelector("html");
  const div = document.createElement("div");
  div.id = "mio-tools";
  const main = document.createElement("div");
  main.className = "mio-tools-main";
  const onLoading = (loading) => {
    if (loading) {
      addMio.disabled = true;
    } else {
      addMio.disabled = false;
    }
  };
  const onModalChange = async () => {
    if (div.classList.contains("mio-tools-open")) {
      html.style.overflow = "unset";
      div.classList.remove("mio-tools-open");
      content.innerHTML = "";
    } else {
      const ArtApi = await storage.get("ArtApi", `${BaseUrl}/img/save`);
      const RankApi = await storage.get("RankApi", `${BaseUrl}/prank/newDate`);
      mioDates = await storage.get("mio-dates", "");
      html.style.overflow = "hidden";
      div.classList.add("mio-tools-open");
      pid = isArtwork();
      if (pid) {
        content.innerHTML = `
        <p style="color: #f5765c;" class="mio-error"></p>
        <p>正在获取：<span style="color: #69f769;" class="mio-date">${pid}</span>数据</p>
        `;
        getArtwork();
        input.value = ArtApi;
      } else {
        if (!DATE) {
          DATE = getDate();
        }
        if (NOW == DATE) {
          nextBtn.disabled = true;
        }
        content.innerHTML = `
        <p style="color: #f5765c;" class="mio-error"></p>
        <p>将要获取排行榜数据日期为：<span style="color: #69f769;" class="mio-date">${DATE}</span></p>
        `;
        onCheckDate();
        input.value = RankApi;
      }
    }
  };
  const onCheckDate = () => {
    if (mioDates && mioDates.includes(DATE)) {
      topError("💤当前日期已抓取过~");
      return false;
    } else {
      const error = document.querySelector(".mio-error");
      error.innerText = "";
      return true;
    }
  };
  span.innerHTML = `
<svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
`;
  span.className = "mio-tools-main-close";
  span.addEventListener("click", (_e) => onModalChange());
  addMio.innerText = "抓取并提交Mio";
  addMio.className = "mio-btn-add";
  addMio.addEventListener("click", (_e) => {
    if (pid) {
      getArtworkAndToMio();
    } else {
      getRankAndToMio();
    }
  });
  prevBtn.innerText = "前一天";
  prevBtn.className = "mio-btn-prev";
  prevBtn.addEventListener("click", (_e) => {
    const mioDate = document.querySelector(".mio-date");
    const proMsg = content.querySelector(".mio-pro-msg");
    DATE = getDate(true, null, DATE);
    if (NOW != DATE && nextBtn.disabled) {
      nextBtn.disabled = false;
    }
    if (proMsg) {
      content.removeChild(proMsg);
    }
    mioDate.innerText = DATE;
    onCheckDate();
  });
  nextBtn.innerText = "后一天";
  nextBtn.className = "mio-btn-next";
  nextBtn.addEventListener("click", (_e) => {
    const mioDate = document.querySelector(".mio-date");
    if (NOW == DATE) {
      nextBtn.disabled = true;
    } else {
      DATE = getDate(null, true, DATE);
      const proMsg = content.querySelector(".mio-pro-msg");
      if (proMsg) {
        content.removeChild(proMsg);
      }
      mioDate.innerText = DATE;
      onCheckDate();
    }
  });
  actions.className = "mio-tools-main-btns";
  actions.appendChild(input);
  if (!pid) {
    actions.appendChild(prevBtn);
    actions.appendChild(nextBtn);
  }
  actions.appendChild(addMio);
  content.className = "mio-tools-main-content";
  main.appendChild(span);
  main.appendChild(content);
  main.appendChild(actions);
  div.appendChild(main);
  const btn = document.createElement("button");
  btn.id = "mio-tools-btn";
  btn.addEventListener("click", (_e) => onModalChange());
  btn.innerHTML = "Mio";
  (_a = document.querySelector("body")) == null ? void 0 : _a.appendChild(btn);
  _GM.addStyle(`
  html {
    &::-webkit-scrollbar {
      width: 4px;
      transition: all .3s ease-in-out;
    }
    &::-webkit-scrollbar-thumb {
      cursor: pointer;
      border-radius: 10px;
      transition: all .15s ease-in-out;
      background: rgba(255, 255, 255, 0.15);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }
    &::-webkit-scrollbar-thumb:hover {
      @apply bg-[#64d1e2];
    }
  }
  #mio-tools-btn {
      position: fixed;
      right: 0px;
      top: 85%;
      border-radius: 16px;
      width: 36px;
      height: 36px;
      outline: none;
      border: none;
      padding: 6px 10px;
      z-index: 10;
      background: #0097fac7;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
  }
  #mio-tools {
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0;
      height: 0;
      overflow: hidden;
      top: 0;
      right: 0;
      background: #00000080;
      backdrop-filter: blur(2px);
      z-index: 99;
   }
  .mio-tools-open {
      width: 100% !important;
      height: 100vh !important;

      > .mio-tools-main {
          position: relative;
          background: #010101;
          width: 600px;
          height: 300px;
          border-radius: 16px;
          padding: 32px;
          transition: all .1s ease-in-out;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;

          .mio-tools-main-close {
              position: absolute;
              right: 10px;
              top: 10px;
              color: #ffffff;
              cursor: pointer;
              rotate: 0deg;
              transition: all .3s ease-in-out;

              &:hover {
                  transform: scale(1.1);
                  color: #0097fa;
                  rotate: 180deg;
              }
          }

          .mio-tools-main-content {
              flex: 1;
              color: #ffffff;
              display: flex;
              flex-direction: column;
              gap: 10px;

              .mio-options-item {
                display: flex;
                align-items: center;
                gap: 5px;
                user-select: none;

                > input, label {
                  cursor: pointer;
                }

                > label {
                  margin-right: 20px;
                }
              }
          }

          .mio-tools-main-btns {
              display: flex;
              justify-content: flex-end;
              gap: 16px;

              .mio-btn-add, .mio-btn-prev, .mio-btn-next {
                  outline: none;
                  border: none;
                  padding: 6px 10px;
                  border-radius: 10px;
                  cursor: pointer;
                  background: #0097fa;
                  color: #ebebeb;
              }

              button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
              }

              > input {
                outline: none;
                border: none;
                color: #ffffff;
                background-color: rgba(255, 255, 255, .3);
                width: 250px;
                border-radius: 8px;
                padding: 6px 8px;
              }
          }
      }
  }
`);
  (_b = document.querySelector("body")) == null ? void 0 : _b.appendChild(div);

})();