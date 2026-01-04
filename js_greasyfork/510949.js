// ==UserScript==
// @name         mission-vehicle-filter
// @namespace    lss.grisu118.ch
// @version      1.0.1
// @author       Grisu118
// @description  Filtert die Fahrzeuge im Alarmfenster und zeigt nur ausgewählte an. Der Filter kann ein / ausgeschaltet werden, der Zustand wird lokal gespeichert.
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/4274139?s=40&v=4
// @match        https://www.leitstellenspiel.de/missions/*
// @downloadURL https://update.greasyfork.org/scripts/510949/mission-vehicle-filter.user.js
// @updateURL https://update.greasyfork.org/scripts/510949/mission-vehicle-filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
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
  const LSS_LOCAL_STORAGE = dist.StorageProvider.localStorage("ls42.lss");
  const VEHICLE_FILTER_KEY = "MVF_FILTER_ENABLED";
  const getVehicleFilterEnabled = () => {
    return LSS_LOCAL_STORAGE.getAsBoolean(VEHICLE_FILTER_KEY) ?? false;
  };
  const setVehicleFilterEnabled = (enabled) => {
    LSS_LOCAL_STORAGE.set(VEHICLE_FILTER_KEY, enabled);
  };
  (() => {
    var _a, _b;
    function setIcon(icon, filterEnabled) {
      if (filterEnabled) {
        icon.className = "glyphicon glyphicon-ok-circle";
      } else {
        icon.className = "glyphicon glyphicon-remove-circle";
      }
    }
    function filterVehicleList() {
      var _a2, _b2;
      const enabled = getVehicleFilterEnabled();
      (_b2 = (_a2 = document.querySelector(".tab-pane.active table tbody")) == null ? void 0 : _a2.querySelectorAll("tr")) == null ? void 0 : _b2.forEach((elem) => {
        var _a3;
        if (enabled) {
          if (((_a3 = elem.querySelector(".vehicle_checkbox")) == null ? void 0 : _a3.checked) === true) {
            elem.style.display = "";
          } else {
            elem.style.display = "none";
          }
        } else {
          elem.style.display = "";
        }
      });
    }
    const dispatchBtnGroup = document.getElementById("dispatch_buttons");
    if (dispatchBtnGroup == null) {
      console.error("Could not find dispatch btn group");
      return;
    }
    const btn = document.createElement("a");
    btn.className = "btn btn-success";
    btn.href = "#";
    const filterIcon = document.createElement("span");
    filterIcon.className = "glyphicon glyphicon-filter";
    btn.append(filterIcon);
    const statusIcon = document.createElement("span");
    setIcon(statusIcon, getVehicleFilterEnabled());
    btn.append(statusIcon);
    dispatchBtnGroup.prepend(btn);
    btn.addEventListener("click", () => {
      const enabled = getVehicleFilterEnabled();
      setVehicleFilterEnabled(!enabled);
      setIcon(statusIcon, !enabled);
      filterVehicleList();
    });
    document.querySelectorAll(".btn.aao").forEach((elem) => {
      elem.addEventListener("click", filterVehicleList);
    });
    (_b = (_a = document.getElementById("tabs")) == null ? void 0 : _a.querySelectorAll("li")) == null ? void 0 : _b.forEach((elem) => {
      elem.addEventListener("click", filterVehicleList);
    });
    filterVehicleList();
  })();

})();