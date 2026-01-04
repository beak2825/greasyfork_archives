// ==UserScript==
// @name         mission-info
// @namespace    lss.grisu118.ch
// @version      1.1.0
// @author       Grisu118
// @description  Zeigt details zum Einsatz an, u.a. Kategorie, Generierungszeitpunkt & erwartete Einnahmen
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/4274139?s=40&v=4
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523977/mission-info.user.js
// @updateURL https://update.greasyfork.org/scripts/523977/mission-info.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .ls42-lss-mission-generation-time-danger{border:1px solid red;padding:2px 4px} ");

(function () {
  'use strict';

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var dist = {};
  var StorageProvider$1 = {};
  var HistoryMode = {};
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoryMode = void 0;
    (function(HistoryMode2) {
      HistoryMode2["REPLACE"] = "REPLACE";
      HistoryMode2["PUSH"] = "PUSH";
    })(exports.HistoryMode || (exports.HistoryMode = {}));
  })(HistoryMode);
  var LocalStorage$1 = {};
  var AbstractStorage$1 = {};
  Object.defineProperty(AbstractStorage$1, "__esModule", { value: true });
  AbstractStorage$1.AbstractStorage = void 0;
  var AbstractStorage = (
    /** @class */
    function() {
      function AbstractStorage2(prefix) {
        this.prefix = prefix;
      }
      AbstractStorage2.prototype.getAsString = function(key) {
        return this.get(key);
      };
      AbstractStorage2.prototype.getAsNumber = function(key) {
        var value = Number(this.get(key));
        if (Number.isNaN(value)) {
          return void 0;
        }
        return value;
      };
      AbstractStorage2.prototype.getAsBoolean = function(key) {
        var value = this.get(key);
        switch (value) {
          case "true":
            return true;
          case "false":
            return false;
          default:
            return void 0;
        }
      };
      AbstractStorage2.prototype.getAsRecord = function(key) {
        var s = this.get(key);
        if (s) {
          try {
            var o = JSON.parse(s);
            if (o && typeof o === "object") {
              return o;
            }
          } catch (e) {
            return void 0;
          }
        }
        return void 0;
      };
      AbstractStorage2.prototype.getAsObject = function(key, typeCheck) {
        if (typeCheck === void 0) {
          typeCheck = function() {
            return true;
          };
        }
        var record = this.getAsRecord(key);
        if (record !== void 0 && typeCheck(record)) {
          return record;
        } else {
          return void 0;
        }
      };
      AbstractStorage2.prototype.getAsArray = function(key) {
        var o = this.getAsRecord(key);
        if (o && Array.isArray(o)) {
          return o;
        } else {
          return void 0;
        }
      };
      AbstractStorage2.prototype.isEmpty = function() {
        return this.size() === 0;
      };
      AbstractStorage2.prototype.concat = function(key) {
        if (this.prefix) {
          return this.prefix + "_" + key;
        } else {
          return key;
        }
      };
      AbstractStorage2.prototype.prepareValue = function(value) {
        switch (typeof value) {
          case "boolean":
          case "number":
          case "string":
            return value.toString();
          case "object":
            return JSON.stringify(value);
          default:
            throw new Error("Invalid type of value");
        }
      };
      return AbstractStorage2;
    }()
  );
  AbstractStorage$1.AbstractStorage = AbstractStorage;
  var __extends$2 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(LocalStorage$1, "__esModule", { value: true });
  LocalStorage$1.LocalStorage = void 0;
  var AbstractStorage_1$2 = AbstractStorage$1;
  var LocalStorage = (
    /** @class */
    function(_super) {
      __extends$2(LocalStorage2, _super);
      function LocalStorage2(prefix) {
        return _super.call(this, prefix) || this;
      }
      LocalStorage2.prototype.del = function(key) {
        var _this = this;
        if (Array.isArray(key)) {
          key.forEach(function(k) {
            return localStorage.removeItem(_this.concat(k));
          });
        } else {
          localStorage.removeItem(this.concat(key));
        }
      };
      LocalStorage2.prototype.get = function(key) {
        var value = localStorage.getItem(this.concat(key));
        if (value === null) {
          value = void 0;
        }
        return value;
      };
      LocalStorage2.prototype.set = function(key, value) {
        if (typeof key === "string" && value !== void 0) {
          localStorage.setItem(this.concat(key), this.prepareValue(value));
        } else if (typeof key === "object") {
          for (var _i = 0, _a = Object.keys(key); _i < _a.length; _i++) {
            var k = _a[_i];
            localStorage.setItem(this.concat(k), this.prepareValue(key[k]));
          }
        } else {
          throw new Error("Either specify key, value or an object containing multiple key/value pairs");
        }
      };
      LocalStorage2.prototype.size = function() {
        var count = 0;
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (this.prefix) {
            if ((key === null || key === void 0 ? void 0 : key.indexOf(this.prefix)) === 0) {
              count++;
            }
          } else {
            count++;
          }
        }
        return count;
      };
      return LocalStorage2;
    }(AbstractStorage_1$2.AbstractStorage)
  );
  LocalStorage$1.LocalStorage = LocalStorage;
  var SessionStorage$1 = {};
  var __extends$1 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(SessionStorage$1, "__esModule", { value: true });
  SessionStorage$1.SessionStorage = void 0;
  var AbstractStorage_1$1 = AbstractStorage$1;
  var SessionStorage = (
    /** @class */
    function(_super) {
      __extends$1(SessionStorage2, _super);
      function SessionStorage2(prefix) {
        return _super.call(this, prefix) || this;
      }
      SessionStorage2.prototype.del = function(key) {
        var _this = this;
        if (Array.isArray(key)) {
          key.forEach(function(k) {
            return sessionStorage.removeItem(_this.concat(k));
          });
        } else {
          sessionStorage.removeItem(this.concat(key));
        }
      };
      SessionStorage2.prototype.get = function(key) {
        var value = sessionStorage.getItem(this.concat(key));
        if (value === null) {
          value = void 0;
        }
        return value;
      };
      SessionStorage2.prototype.set = function(key, value) {
        if (typeof key === "string" && value !== void 0) {
          sessionStorage.setItem(this.concat(key), this.prepareValue(value));
        } else if (typeof key === "object") {
          for (var _i = 0, _a = Object.keys(key); _i < _a.length; _i++) {
            var k = _a[_i];
            sessionStorage.setItem(this.concat(k), this.prepareValue(key[k]));
          }
        } else {
          throw new Error("Either specify key, value or an object containing multiple key/value pairs");
        }
      };
      SessionStorage2.prototype.size = function() {
        var count = 0;
        for (var i = 0; i < sessionStorage.length; i++) {
          var key = sessionStorage.key(i);
          if (this.prefix) {
            if ((key === null || key === void 0 ? void 0 : key.indexOf(this.prefix)) === 0) {
              count++;
            }
          } else {
            count++;
          }
        }
        return count;
      };
      return SessionStorage2;
    }(AbstractStorage_1$1.AbstractStorage)
  );
  SessionStorage$1.SessionStorage = SessionStorage;
  var UrlStorage$1 = {};
  var __extends = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(UrlStorage$1, "__esModule", { value: true });
  UrlStorage$1.UrlStorage = void 0;
  var HistoryMode_1$1 = HistoryMode;
  var AbstractStorage_1 = AbstractStorage$1;
  var UrlStorage = (
    /** @class */
    function(_super) {
      __extends(UrlStorage2, _super);
      function UrlStorage2(prefix, mode) {
        if (mode === void 0) {
          mode = HistoryMode_1$1.HistoryMode.REPLACE;
        }
        var _this = _super.call(this, prefix) || this;
        _this.mode = mode;
        return _this;
      }
      UrlStorage2.prototype.del = function(key) {
        var currentParams = this.getQueryValues();
        if (Array.isArray(key)) {
          for (var _i = 0, key_1 = key; _i < key_1.length; _i++) {
            var k = key_1[_i];
            delete currentParams[this.concat(k)];
          }
        } else {
          delete currentParams[this.concat(key)];
        }
        this.updateUrl(currentParams);
      };
      UrlStorage2.prototype.get = function(key) {
        return this.getQueryValues()[this.concat(key)];
      };
      UrlStorage2.prototype.set = function(key, value) {
        var currentParams = this.getQueryValues();
        if (typeof key === "string" && value !== void 0) {
          currentParams[this.concat(key)] = this.prepareValue(value);
        } else if (typeof key === "object") {
          for (var _i = 0, _a = Object.keys(key); _i < _a.length; _i++) {
            var k = _a[_i];
            currentParams[this.concat(k)] = this.prepareValue(key[k]);
          }
        } else {
          throw new Error("Either specify key, value or an object containing multiple key/value pairs");
        }
        this.updateUrl(currentParams);
      };
      UrlStorage2.prototype.size = function() {
        var keys = Object.keys(this.getQueryValues());
        var p = this.prefix;
        if (p) {
          keys = keys.filter(function(it) {
            return it.indexOf(p) === 0;
          });
        }
        return keys.length;
      };
      UrlStorage2.prototype.updateUrl = function(params) {
        switch (this.mode) {
          case HistoryMode_1$1.HistoryMode.REPLACE:
            history.replaceState(null, "", this.setParams(params));
            break;
          case HistoryMode_1$1.HistoryMode.PUSH:
            history.pushState(null, "", this.setParams(params));
        }
      };
      UrlStorage2.prototype.getQueryValues = function() {
        var query = window.location.search.substring(1);
        var params = query.split("&");
        var returnValue = {};
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
          var p = params_1[_i];
          var pair = p.split("=");
          if (pair.length === 2) {
            returnValue[this.decodeComponent(pair[0])] = this.decodeComponent(pair[1]);
          }
        }
        return returnValue;
      };
      UrlStorage2.prototype.join = function() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        var queryString = "";
        for (var _a = 0, params_2 = params; _a < params_2.length; _a++) {
          var param = params_2[_a];
          if (param) {
            if (!queryString) {
              queryString = "?";
            }
            queryString += param;
            queryString += "&";
          }
        }
        return queryString.substring(0, queryString.length - 1);
      };
      UrlStorage2.prototype.setParams = function(params) {
        var protocol = window.location.protocol;
        var host = window.location.host;
        var path = window.location.pathname;
        var hash = window.location.hash;
        var paramsArray = [];
        for (var _i = 0, _a = Object.keys(params); _i < _a.length; _i++) {
          var k = _a[_i];
          paramsArray.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
        }
        var joinedParams = this.join.apply(this, paramsArray);
        return protocol + "//" + host + path + joinedParams + hash;
      };
      UrlStorage2.prototype.decodeComponent = function(component) {
        return decodeURIComponent(component.replace(/\+/g, "%20"));
      };
      return UrlStorage2;
    }(AbstractStorage_1.AbstractStorage)
  );
  UrlStorage$1.UrlStorage = UrlStorage;
  Object.defineProperty(StorageProvider$1, "__esModule", { value: true });
  StorageProvider$1.StorageProvider = void 0;
  var HistoryMode_1 = HistoryMode;
  var LocalStorage_1 = LocalStorage$1;
  var SessionStorage_1 = SessionStorage$1;
  var UrlStorage_1 = UrlStorage$1;
  var StorageProvider = (
    /** @class */
    function() {
      function StorageProvider2() {
      }
      StorageProvider2.localStorage = function(prefix) {
        return new LocalStorage_1.LocalStorage(prefix);
      };
      StorageProvider2.sessionStorage = function(prefix) {
        return new SessionStorage_1.SessionStorage(prefix);
      };
      StorageProvider2.urlStorage = function(prefix, mode) {
        if (mode === void 0) {
          mode = HistoryMode_1.HistoryMode.REPLACE;
        }
        return new UrlStorage_1.UrlStorage(prefix, mode);
      };
      return StorageProvider2;
    }()
  );
  StorageProvider$1.StorageProvider = StorageProvider;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoryMode = exports.StorageProvider = void 0;
    var StorageProvider_1 = StorageProvider$1;
    Object.defineProperty(exports, "StorageProvider", { enumerable: true, get: function() {
      return StorageProvider_1.StorageProvider;
    } });
    var HistoryMode_12 = HistoryMode;
    Object.defineProperty(exports, "HistoryMode", { enumerable: true, get: function() {
      return HistoryMode_12.HistoryMode;
    } });
  })(dist);
  dist.StorageProvider.localStorage("ls42.lss");
  const fetchAllMissions = async () => {
    const response = await fetch("/einsaetze.json");
    const body = await response.json();
    return body;
  };
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
  })(dayjs_min);
  var dayjs_minExports = dayjs_min.exports;
  const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
  const isUpToDate = (cachedEntry) => {
    const now = dayjs();
    const then = dayjs(cachedEntry.timestamp);
    return now.diff(then, "hour") < 12;
  };
  const LSS_CACHE_STORAGE = dist.StorageProvider.sessionStorage("ls42.lss.cache");
  const MISSIONS_CACHE_KEY = "MISSIONS";
  const getMissions = async (force) => {
    const cachedMissions = LSS_CACHE_STORAGE.getAsObject(MISSIONS_CACHE_KEY);
    if (cachedMissions && !force && isUpToDate(cachedMissions)) {
      return cachedMissions;
    }
    const missions = await fetchAllMissions();
    const value = {
      timestamp: dayjs().format(),
      data: missions
    };
    LSS_CACHE_STORAGE.set(MISSIONS_CACHE_KEY, value);
    return value;
  };
  var duration$1 = { exports: {} };
  (function(module, exports) {
    !function(t, s) {
      module.exports = s();
    }(commonjsGlobal, function() {
      var t, s, n = 1e3, i = 6e4, e = 36e5, r = 864e5, o = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, u = 31536e6, d = 2628e6, a = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, h = { years: u, months: d, days: r, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 }, c = function(t2) {
        return t2 instanceof g;
      }, f = function(t2, s2, n2) {
        return new g(t2, n2, s2.$l);
      }, m = function(t2) {
        return s.p(t2) + "s";
      }, l = function(t2) {
        return t2 < 0;
      }, $ = function(t2) {
        return l(t2) ? Math.ceil(t2) : Math.floor(t2);
      }, y = function(t2) {
        return Math.abs(t2);
      }, v = function(t2, s2) {
        return t2 ? l(t2) ? { negative: true, format: "" + y(t2) + s2 } : { negative: false, format: "" + t2 + s2 } : { negative: false, format: "" };
      }, g = function() {
        function l2(t2, s2, n2) {
          var i2 = this;
          if (this.$d = {}, this.$l = n2, void 0 === t2 && (this.$ms = 0, this.parseFromMilliseconds()), s2) return f(t2 * h[m(s2)], this);
          if ("number" == typeof t2) return this.$ms = t2, this.parseFromMilliseconds(), this;
          if ("object" == typeof t2) return Object.keys(t2).forEach(function(s3) {
            i2.$d[m(s3)] = t2[s3];
          }), this.calMilliseconds(), this;
          if ("string" == typeof t2) {
            var e2 = t2.match(a);
            if (e2) {
              var r2 = e2.slice(2).map(function(t3) {
                return null != t3 ? Number(t3) : 0;
              });
              return this.$d.years = r2[0], this.$d.months = r2[1], this.$d.weeks = r2[2], this.$d.days = r2[3], this.$d.hours = r2[4], this.$d.minutes = r2[5], this.$d.seconds = r2[6], this.calMilliseconds(), this;
            }
          }
          return this;
        }
        var y2 = l2.prototype;
        return y2.calMilliseconds = function() {
          var t2 = this;
          this.$ms = Object.keys(this.$d).reduce(function(s2, n2) {
            return s2 + (t2.$d[n2] || 0) * h[n2];
          }, 0);
        }, y2.parseFromMilliseconds = function() {
          var t2 = this.$ms;
          this.$d.years = $(t2 / u), t2 %= u, this.$d.months = $(t2 / d), t2 %= d, this.$d.days = $(t2 / r), t2 %= r, this.$d.hours = $(t2 / e), t2 %= e, this.$d.minutes = $(t2 / i), t2 %= i, this.$d.seconds = $(t2 / n), t2 %= n, this.$d.milliseconds = t2;
        }, y2.toISOString = function() {
          var t2 = v(this.$d.years, "Y"), s2 = v(this.$d.months, "M"), n2 = +this.$d.days || 0;
          this.$d.weeks && (n2 += 7 * this.$d.weeks);
          var i2 = v(n2, "D"), e2 = v(this.$d.hours, "H"), r2 = v(this.$d.minutes, "M"), o2 = this.$d.seconds || 0;
          this.$d.milliseconds && (o2 += this.$d.milliseconds / 1e3, o2 = Math.round(1e3 * o2) / 1e3);
          var u2 = v(o2, "S"), d2 = t2.negative || s2.negative || i2.negative || e2.negative || r2.negative || u2.negative, a2 = e2.format || r2.format || u2.format ? "T" : "", h2 = (d2 ? "-" : "") + "P" + t2.format + s2.format + i2.format + a2 + e2.format + r2.format + u2.format;
          return "P" === h2 || "-P" === h2 ? "P0D" : h2;
        }, y2.toJSON = function() {
          return this.toISOString();
        }, y2.format = function(t2) {
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ss", i2 = { Y: this.$d.years, YY: s.s(this.$d.years, 2, "0"), YYYY: s.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s.s(this.$d.seconds, 2, "0"), SSS: s.s(this.$d.milliseconds, 3, "0") };
          return n2.replace(o, function(t3, s2) {
            return s2 || String(i2[t3]);
          });
        }, y2.as = function(t2) {
          return this.$ms / h[m(t2)];
        }, y2.get = function(t2) {
          var s2 = this.$ms, n2 = m(t2);
          return "milliseconds" === n2 ? s2 %= 1e3 : s2 = "weeks" === n2 ? $(s2 / h[n2]) : this.$d[n2], s2 || 0;
        }, y2.add = function(t2, s2, n2) {
          var i2;
          return i2 = s2 ? t2 * h[m(s2)] : c(t2) ? t2.$ms : f(t2, this).$ms, f(this.$ms + i2 * (n2 ? -1 : 1), this);
        }, y2.subtract = function(t2, s2) {
          return this.add(t2, s2, true);
        }, y2.locale = function(t2) {
          var s2 = this.clone();
          return s2.$l = t2, s2;
        }, y2.clone = function() {
          return f(this.$ms, this);
        }, y2.humanize = function(s2) {
          return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s2);
        }, y2.valueOf = function() {
          return this.asMilliseconds();
        }, y2.milliseconds = function() {
          return this.get("milliseconds");
        }, y2.asMilliseconds = function() {
          return this.as("milliseconds");
        }, y2.seconds = function() {
          return this.get("seconds");
        }, y2.asSeconds = function() {
          return this.as("seconds");
        }, y2.minutes = function() {
          return this.get("minutes");
        }, y2.asMinutes = function() {
          return this.as("minutes");
        }, y2.hours = function() {
          return this.get("hours");
        }, y2.asHours = function() {
          return this.as("hours");
        }, y2.days = function() {
          return this.get("days");
        }, y2.asDays = function() {
          return this.as("days");
        }, y2.weeks = function() {
          return this.get("weeks");
        }, y2.asWeeks = function() {
          return this.as("weeks");
        }, y2.months = function() {
          return this.get("months");
        }, y2.asMonths = function() {
          return this.as("months");
        }, y2.years = function() {
          return this.get("years");
        }, y2.asYears = function() {
          return this.as("years");
        }, l2;
      }(), p = function(t2, s2, n2) {
        return t2.add(s2.years() * n2, "y").add(s2.months() * n2, "M").add(s2.days() * n2, "d").add(s2.hours() * n2, "h").add(s2.minutes() * n2, "m").add(s2.seconds() * n2, "s").add(s2.milliseconds() * n2, "ms");
      };
      return function(n2, i2, e2) {
        t = e2, s = e2().$utils(), e2.duration = function(t2, s2) {
          var n3 = e2.locale();
          return f(t2, { $l: n3 }, s2);
        }, e2.isDuration = c;
        var r2 = i2.prototype.add, o2 = i2.prototype.subtract;
        i2.prototype.add = function(t2, s2) {
          return c(t2) ? p(this, t2, 1) : r2.bind(this)(t2, s2);
        }, i2.prototype.subtract = function(t2, s2) {
          return c(t2) ? p(this, t2, -1) : o2.bind(this)(t2, s2);
        };
      };
    });
  })(duration$1);
  var durationExports = duration$1.exports;
  const duration = /* @__PURE__ */ getDefaultExportFromCjs(durationExports);
  dayjs.extend(duration);
  const MISSION_ID_REGEX = /.*\/einsaetze\/(\d+)\?.*/;
  async function missionInfoNodes() {
    var _a;
    const linkElem = document.getElementById("mission_help");
    if (!linkElem) {
      return void 0;
    }
    const link = linkElem.href;
    console.log("link", link, linkElem);
    const params = new URLSearchParams(link.split("?")[1]);
    let missionId = (_a = link.match(MISSION_ID_REGEX)) == null ? void 0 : _a[1];
    const variant = params.get("additive_overlays");
    if (variant) {
      missionId += `/${variant}`;
    }
    console.log("MissionId", missionId);
    const missions = await getMissions();
    const mission = missions.data.find((mission2) => mission2.id == missionId);
    const creditsElem = document.createElement("span");
    creditsElem.innerText = `Credits: ${mission == null ? void 0 : mission.average_credits}`;
    return [creditsElem];
  }
  function generationTime(missionInfo) {
    const generationTimeString = missionInfo.getAttribute("data-generation-time");
    const generationTime2 = dayjs(generationTimeString);
    const now = dayjs();
    const cutOffTime = now.hour(3).minute(0).second(0);
    const diff = now.diff(generationTime2);
    const duration2 = dayjs.duration(diff);
    let formattedTxt = "";
    if (duration2.asMinutes() < 1) {
      formattedTxt = "jetzt";
    } else if (duration2.asHours() < 1) {
      formattedTxt = `vor ${Math.floor(duration2.asMinutes())} Minuten`;
    } else if (duration2.asHours() < 3) {
      formattedTxt = `vor ${Math.floor(duration2.asHours())} Stunden`;
    } else if (generationTime2.isSame(now, "day")) {
      formattedTxt = `heute um ${generationTime2.format("HH:mm:ss")}`;
    } else if (generationTime2.isSame(now.subtract(1, "day"), "day")) {
      formattedTxt = `gestern um ${generationTime2.format("HH:mm:ss")}`;
    } else {
      formattedTxt = generationTime2.format("DD.MM.YYYY HH:mm:ss");
    }
    const timeNode = document.createElement("span");
    if (generationTime2.isBefore(cutOffTime)) {
      timeNode.classList.add("ls42-lss-mission-generation-time-danger");
    }
    timeNode.innerText = `Generierungszeit: ${formattedTxt}`;
    return timeNode;
  }
  function separator() {
    const separator2 = document.createElement("span");
    separator2.innerText = " | ";
    return separator2;
  }
  (async () => {
    const missionInfo = document.getElementById("mission_general_info");
    if (!missionInfo) {
      return;
    }
    const targetElement = missionInfo.querySelector(":scope > small");
    const timeNode = generationTime(missionInfo);
    const missionNodes = await missionInfoNodes();
    missionNodes == null ? void 0 : missionNodes.forEach((node) => {
      targetElement == null ? void 0 : targetElement.appendChild(separator());
      targetElement == null ? void 0 : targetElement.appendChild(node);
    });
    targetElement == null ? void 0 : targetElement.appendChild(separator());
    targetElement == null ? void 0 : targetElement.appendChild(timeNode);
  })();

})();