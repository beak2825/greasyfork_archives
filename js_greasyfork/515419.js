// ==UserScript==
// @name         enhanced-map
// @namespace    lss.grisu118.ch
// @version      0.4.0
// @author       Grisu118
// @description  Zusätziche Funktionen für die Karte
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/4274139?s=40&v=4
// @match        https://www.leitstellenspiel.de/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515419/enhanced-map.user.js
// @updateURL https://update.greasyfork.org/scripts/515419/enhanced-map.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const fetchAllBuildings = async () => {
    const response = await fetch("/api/buildings");
    const body = await response.json();
    const result = {};
    for (const building of body) {
      result[building.id] = building;
    }
    return result;
  };
  var BuildingType = ((BuildingType2) => {
    BuildingType2[BuildingType2["FIRE_STATION"] = 0] = "FIRE_STATION";
    BuildingType2[BuildingType2["FIRE_ACADEMY"] = 1] = "FIRE_ACADEMY";
    BuildingType2[BuildingType2["MEDIC_STATION"] = 2] = "MEDIC_STATION";
    BuildingType2[BuildingType2["MEDIC_ACADEMY"] = 3] = "MEDIC_ACADEMY";
    BuildingType2[BuildingType2["HOSPITAL"] = 4] = "HOSPITAL";
    BuildingType2[BuildingType2["MEDICAL_HELICOPTER_STATION"] = 5] = "MEDICAL_HELICOPTER_STATION";
    BuildingType2[BuildingType2["POLICE_STATION"] = 6] = "POLICE_STATION";
    BuildingType2[BuildingType2["DISPATCH_CENTER"] = 7] = "DISPATCH_CENTER";
    BuildingType2[BuildingType2["POLICE_ACADEMY"] = 8] = "POLICE_ACADEMY";
    BuildingType2[BuildingType2["THW_STATION"] = 9] = "THW_STATION";
    BuildingType2[BuildingType2["THW_ACADEMY"] = 10] = "THW_ACADEMY";
    BuildingType2[BuildingType2["FEDERAL_POLICE_STATION"] = 11] = "FEDERAL_POLICE_STATION";
    return BuildingType2;
  })(BuildingType || {});
  const fetchAllMissions = async () => {
    const response = await fetch("/einsaetze.json");
    const body = await response.json();
    const result = {};
    for (const mission of body) {
      result[mission.id] = mission;
    }
    return result;
  };
  var EquipmentType = ((EquipmentType2) => {
    EquipmentType2["BREATHING_PROTECTION"] = "breathing_protection";
    EquipmentType2["DECON"] = "decon";
    EquipmentType2["DIVER"] = "diver";
    EquipmentType2["HAZMAT"] = "hazmat";
    EquipmentType2["HEAVY_RESCUE"] = "heavy_rescue";
    EquipmentType2["HIGHT_RESCUE"] = "hight_rescue";
    EquipmentType2["HOSE_WATER"] = "hose_water";
    EquipmentType2["OIL"] = "oil";
    EquipmentType2["STORM"] = "storm";
    return EquipmentType2;
  })(EquipmentType || {});
  var VehicleType = ((VehicleType2) => {
    VehicleType2[VehicleType2["LF20"] = 0] = "LF20";
    VehicleType2[VehicleType2["LF10"] = 1] = "LF10";
    VehicleType2[VehicleType2["DLK23"] = 2] = "DLK23";
    VehicleType2[VehicleType2["ELW1"] = 3] = "ELW1";
    VehicleType2[VehicleType2["RW"] = 4] = "RW";
    VehicleType2[VehicleType2["GWA"] = 5] = "GWA";
    VehicleType2[VehicleType2["LF8_6"] = 6] = "LF8_6";
    VehicleType2[VehicleType2["LF_20_16"] = 7] = "LF_20_16";
    VehicleType2[VehicleType2["LF_10_6"] = 8] = "LF_10_6";
    VehicleType2[VehicleType2["LF_16TS"] = 9] = "LF_16TS";
    VehicleType2[VehicleType2["GW_OIL"] = 10] = "GW_OIL";
    VehicleType2[VehicleType2["GW_L2_W"] = 11] = "GW_L2_W";
    VehicleType2[VehicleType2["GWM"] = 12] = "GWM";
    VehicleType2[VehicleType2["SW_1000"] = 13] = "SW_1000";
    VehicleType2[VehicleType2["SW_2000"] = 14] = "SW_2000";
    VehicleType2[VehicleType2["SW_2000TR"] = 15] = "SW_2000TR";
    VehicleType2[VehicleType2["SW_KATS"] = 16] = "SW_KATS";
    VehicleType2[VehicleType2["TLF_2000"] = 17] = "TLF_2000";
    VehicleType2[VehicleType2["TLF_3000"] = 18] = "TLF_3000";
    VehicleType2[VehicleType2["TLF_8_8"] = 19] = "TLF_8_8";
    VehicleType2[VehicleType2["TLF_8_18"] = 20] = "TLF_8_18";
    VehicleType2[VehicleType2["TLF_16_24TR"] = 21] = "TLF_16_24TR";
    VehicleType2[VehicleType2["TLF_16_25"] = 22] = "TLF_16_25";
    VehicleType2[VehicleType2["TLF_16_45"] = 23] = "TLF_16_45";
    VehicleType2[VehicleType2["TLF_20_40"] = 24] = "TLF_20_40";
    VehicleType2[VehicleType2["TLF_20_40SL"] = 25] = "TLF_20_40SL";
    VehicleType2[VehicleType2["TLF_16"] = 26] = "TLF_16";
    VehicleType2[VehicleType2["GWG"] = 27] = "GWG";
    VehicleType2[VehicleType2["RTW"] = 28] = "RTW";
    VehicleType2[VehicleType2["NEF"] = 29] = "NEF";
    VehicleType2[VehicleType2["HLF_20"] = 30] = "HLF_20";
    VehicleType2[VehicleType2["RTH"] = 31] = "RTH";
    VehicleType2[VehicleType2["FuStW"] = 32] = "FuStW";
    VehicleType2[VehicleType2["GWH"] = 33] = "GWH";
    VehicleType2[VehicleType2["ELW2"] = 34] = "ELW2";
    VehicleType2[VehicleType2["LEBEFKW"] = 35] = "LEBEFKW";
    VehicleType2[VehicleType2["MTW"] = 36] = "MTW";
    VehicleType2[VehicleType2["TSF_W"] = 37] = "TSF_W";
    VehicleType2[VehicleType2["KTW"] = 38] = "KTW";
    VehicleType2[VehicleType2["GKW"] = 39] = "GKW";
    VehicleType2[VehicleType2["MTW_TZ"] = 40] = "MTW_TZ";
    VehicleType2[VehicleType2["MzKW"] = 41] = "MzKW";
    VehicleType2[VehicleType2["LKW_K9"] = 42] = "LKW_K9";
    VehicleType2[VehicleType2["BRmG_R"] = 43] = "BRmG_R";
    VehicleType2[VehicleType2["Anh_DLE"] = 44] = "Anh_DLE";
    VehicleType2[VehicleType2["MLW_5"] = 45] = "MLW_5";
    VehicleType2[VehicleType2["WLF"] = 46] = "WLF";
    VehicleType2[VehicleType2["AB_HEAVY_RESCUE"] = 47] = "AB_HEAVY_RESCUE";
    VehicleType2[VehicleType2["AB_BREATHING_PROTECTION"] = 48] = "AB_BREATHING_PROTECTION";
    VehicleType2[VehicleType2["AB_OIL"] = 49] = "AB_OIL";
    VehicleType2[VehicleType2["DEKON_P"] = 53] = "DEKON_P";
    VehicleType2[VehicleType2["AB_DEKON_P"] = 54] = "AB_DEKON_P";
    VehicleType2[VehicleType2["AB_HOSE_WATER"] = 62] = "AB_HOSE_WATER";
    VehicleType2[VehicleType2["GW_TAUCHER"] = 63] = "GW_TAUCHER";
    VehicleType2[VehicleType2["AB_HAZMAT"] = 77] = "AB_HAZMAT";
    VehicleType2[VehicleType2["HLF_10"] = 90] = "HLF_10";
    VehicleType2[VehicleType2["ANH_SWPU"] = 101] = "ANH_SWPU";
    VehicleType2[VehicleType2["ANH_7"] = 102] = "ANH_7";
    VehicleType2[VehicleType2["FUSTW_DGL"] = 103] = "FUSTW_DGL";
    VehicleType2[VehicleType2["GW_L1"] = 104] = "GW_L1";
    VehicleType2[VehicleType2["GW_L2"] = 105] = "GW_L2";
    VehicleType2[VehicleType2["MTF_L"] = 106] = "MTF_L";
    VehicleType2[VehicleType2["LF_L"] = 107] = "LF_L";
    VehicleType2[VehicleType2["AB_L"] = 108] = "AB_L";
    VehicleType2[VehicleType2["MTW_OV"] = 124] = "MTW_OV";
    VehicleType2[VehicleType2["BT_LKW"] = 133] = "BT_LKW";
    VehicleType2[VehicleType2["ANH_HOSE_WATER"] = 143] = "ANH_HOSE_WATER";
    return VehicleType2;
  })(VehicleType || {});
  const fetchAllVehicles = async () => {
    const response = await fetch("/api/v2/vehicles");
    const body = await response.json();
    const result = body;
    const resultMap = {};
    for (const vehicle of result.result) {
      resultMap[vehicle.id] = vehicle;
    }
    return resultMap;
  };
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var dist = {};
  var StorageProvider = {};
  var HistoryMode = {};
  var hasRequiredHistoryMode;
  function requireHistoryMode() {
    if (hasRequiredHistoryMode) return HistoryMode;
    hasRequiredHistoryMode = 1;
    (function(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.HistoryMode = void 0;
      (function(HistoryMode2) {
        HistoryMode2["REPLACE"] = "REPLACE";
        HistoryMode2["PUSH"] = "PUSH";
      })(exports.HistoryMode || (exports.HistoryMode = {}));
    })(HistoryMode);
    return HistoryMode;
  }
  var LocalStorage = {};
  var AbstractStorage = {};
  var hasRequiredAbstractStorage;
  function requireAbstractStorage() {
    if (hasRequiredAbstractStorage) return AbstractStorage;
    hasRequiredAbstractStorage = 1;
    Object.defineProperty(AbstractStorage, "__esModule", { value: true });
    AbstractStorage.AbstractStorage = void 0;
    var AbstractStorage$1 = (
(function() {
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
      })()
    );
    AbstractStorage.AbstractStorage = AbstractStorage$1;
    return AbstractStorage;
  }
  var hasRequiredLocalStorage;
  function requireLocalStorage() {
    if (hasRequiredLocalStorage) return LocalStorage;
    hasRequiredLocalStorage = 1;
    var __extends = LocalStorage && LocalStorage.__extends || (function() {
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
    })();
    Object.defineProperty(LocalStorage, "__esModule", { value: true });
    LocalStorage.LocalStorage = void 0;
    var AbstractStorage_1 = requireAbstractStorage();
    var LocalStorage$1 = (
(function(_super) {
        __extends(LocalStorage2, _super);
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
      })(AbstractStorage_1.AbstractStorage)
    );
    LocalStorage.LocalStorage = LocalStorage$1;
    return LocalStorage;
  }
  var SessionStorage = {};
  var hasRequiredSessionStorage;
  function requireSessionStorage() {
    if (hasRequiredSessionStorage) return SessionStorage;
    hasRequiredSessionStorage = 1;
    var __extends = SessionStorage && SessionStorage.__extends || (function() {
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
    })();
    Object.defineProperty(SessionStorage, "__esModule", { value: true });
    SessionStorage.SessionStorage = void 0;
    var AbstractStorage_1 = requireAbstractStorage();
    var SessionStorage$1 = (
(function(_super) {
        __extends(SessionStorage2, _super);
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
      })(AbstractStorage_1.AbstractStorage)
    );
    SessionStorage.SessionStorage = SessionStorage$1;
    return SessionStorage;
  }
  var UrlStorage = {};
  var hasRequiredUrlStorage;
  function requireUrlStorage() {
    if (hasRequiredUrlStorage) return UrlStorage;
    hasRequiredUrlStorage = 1;
    var __extends = UrlStorage && UrlStorage.__extends || (function() {
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
    })();
    Object.defineProperty(UrlStorage, "__esModule", { value: true });
    UrlStorage.UrlStorage = void 0;
    var HistoryMode_1 = requireHistoryMode();
    var AbstractStorage_1 = requireAbstractStorage();
    var UrlStorage$1 = (
(function(_super) {
        __extends(UrlStorage2, _super);
        function UrlStorage2(prefix, mode) {
          if (mode === void 0) {
            mode = HistoryMode_1.HistoryMode.REPLACE;
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
            case HistoryMode_1.HistoryMode.REPLACE:
              history.replaceState(null, "", this.setParams(params));
              break;
            case HistoryMode_1.HistoryMode.PUSH:
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
      })(AbstractStorage_1.AbstractStorage)
    );
    UrlStorage.UrlStorage = UrlStorage$1;
    return UrlStorage;
  }
  var hasRequiredStorageProvider;
  function requireStorageProvider() {
    if (hasRequiredStorageProvider) return StorageProvider;
    hasRequiredStorageProvider = 1;
    Object.defineProperty(StorageProvider, "__esModule", { value: true });
    StorageProvider.StorageProvider = void 0;
    var HistoryMode_1 = requireHistoryMode();
    var LocalStorage_1 = requireLocalStorage();
    var SessionStorage_1 = requireSessionStorage();
    var UrlStorage_1 = requireUrlStorage();
    var StorageProvider$1 = (
(function() {
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
      })()
    );
    StorageProvider.StorageProvider = StorageProvider$1;
    return StorageProvider;
  }
  var hasRequiredDist;
  function requireDist() {
    if (hasRequiredDist) return dist;
    hasRequiredDist = 1;
    (function(exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.HistoryMode = exports.StorageProvider = void 0;
      var StorageProvider_1 = requireStorageProvider();
      Object.defineProperty(exports, "StorageProvider", { enumerable: true, get: function() {
        return StorageProvider_1.StorageProvider;
      } });
      var HistoryMode_1 = requireHistoryMode();
      Object.defineProperty(exports, "HistoryMode", { enumerable: true, get: function() {
        return HistoryMode_1.HistoryMode;
      } });
    })(dist);
    return dist;
  }
  var distExports = requireDist();
  distExports.StorageProvider.localStorage("ls42.lss");
  var dayjs_min$1 = { exports: {} };
  var dayjs_min = dayjs_min$1.exports;
  var hasRequiredDayjs_min;
  function requireDayjs_min() {
    if (hasRequiredDayjs_min) return dayjs_min$1.exports;
    hasRequiredDayjs_min = 1;
    (function(module, exports) {
      !(function(t, e) {
        module.exports = e();
      })(dayjs_min, (function() {
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
        var _ = (function() {
          function M2(t2) {
            this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
          }
          var m2 = M2.prototype;
          return m2.parse = function(t2) {
            this.$d = (function(t3) {
              var e2 = t3.date, n2 = t3.utc;
              if (null === e2) return new Date(NaN);
              if (b.u(e2)) return new Date();
              if (e2 instanceof Date) return new Date(e2);
              if ("string" == typeof e2 && !/Z$/i.test(e2)) {
                var r2 = e2.match($);
                if (r2) {
                  var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                  return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
                }
              }
              return new Date(e2);
            })(t2), this.init();
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
            return r2.replace(y, (function(t3, r3) {
              return r3 || (function(t4) {
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
              })(t3) || i2.replace(":", "");
            }));
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
        })(), k = _.prototype;
        return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach((function(t2) {
          k[t2[1]] = function(e2) {
            return this.$g(e2, t2[0], t2[1]);
          };
        })), O.extend = function(t2, e2) {
          return t2.$i || (t2(e2, _, O), t2.$i = true), O;
        }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
          return O(1e3 * t2);
        }, O.en = D[g], O.Ls = D, O.p = {}, O;
      }));
    })(dayjs_min$1);
    return dayjs_min$1.exports;
  }
  var dayjs_minExports = requireDayjs_min();
  const dayjs = getDefaultExportFromCjs(dayjs_minExports);
  var LSS_INDEXED_DB_KEYS = ((LSS_INDEXED_DB_KEYS2) => {
    LSS_INDEXED_DB_KEYS2["BUILDINGS"] = "buildings";
    LSS_INDEXED_DB_KEYS2["MISSIONS"] = "missions";
    LSS_INDEXED_DB_KEYS2["VEHICLES"] = "vehicles";
    LSS_INDEXED_DB_KEYS2["METADATA"] = "metadata";
    return LSS_INDEXED_DB_KEYS2;
  })(LSS_INDEXED_DB_KEYS || {});
  class IndexedDBWrapper {
    dbName = "ls42.lss-cache";
    version = 1;
    db = null;
    async init() {
      if (this.db) return;
      const request = indexedDB.open(this.dbName, this.version);
      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(
            "buildings"
)) {
            db.createObjectStore("buildings", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(
            "missions"
)) {
            db.createObjectStore("missions", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(
            "vehicles"
)) {
            db.createObjectStore("vehicles", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(
            "metadata"
)) {
            db.createObjectStore("metadata", { keyPath: "id" });
          }
        };
      });
    }
    async setMetadata(id, metadata) {
      if (!this.db) await this.init();
      const store = this.getStore("metadata", "readwrite");
      const value = {
        id,
        data: metadata
      };
      const request = store.put(value);
      await this.handleRequest(request);
    }
    async getMetadata(key) {
      if (!this.db) await this.init();
      const store = this.getStore("metadata", "readonly");
      const request = store.get(key);
      const result = await this.handleRequest(request);
      if (result) {
        return result.data;
      }
      return null;
    }
    async setItem(storeName, id, item) {
      if (!this.db) await this.init();
      const store = this.getStore(storeName, "readwrite");
      const value = {
        id,
        data: item
      };
      const request = store.put(value);
      await this.handleRequest(request);
    }
    async getItem(storeName, id) {
      if (!this.db) await this.init();
      const store = this.getStore(storeName, "readonly");
      const request = store.get(id);
      const result = await this.handleRequest(request);
      if (result) {
        return result.data;
      }
      return null;
    }
    async getAllItems(storeName) {
      if (!this.db) await this.init();
      const store = this.getStore(storeName, "readonly");
      const request = store.getAll();
      const results = await this.handleRequest(request);
      const items = {};
      results?.forEach((item) => {
        const { id, data } = item;
        items[id] = data;
      });
      return items;
    }
    async setAllItems(storeName, items) {
      if (!this.db) await this.init();
      const store = this.getStore(storeName, "readwrite");
      await this.handleRequest(store.clear());
      const promises = Object.entries(items).map(([id, item]) => {
        const value = {
          id,
          data: item
        };
        return this.handleRequest(store.put(value));
      });
      await Promise.all(promises);
    }
    async clearStore(storeName) {
      if (!this.db) await this.init();
      const store = this.getStore(storeName, "readwrite");
      await this.handleRequest(store.clear());
    }
    getStore(storeName, mode) {
      if (!this.db) throw new Error("Database not initialized");
      const transaction = this.db.transaction([storeName], mode);
      return transaction.objectStore(storeName);
    }
    async handleRequest(request) {
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }
  const LSS_INDEXED_DB = new IndexedDBWrapper();
  const isUpToDate = (cachedEntry, currentVersion) => {
    const now = dayjs();
    const then = dayjs(cachedEntry.timestamp);
    return currentVersion == cachedEntry.version && now.diff(then, "hour") < 12;
  };
  class CacheHandler {
    db = LSS_INDEXED_DB;
    storeKey;
    dataVersion;
    fetchFn;
    constructor(storeKey, dataVersion, fetchFn) {
      this.storeKey = storeKey;
      this.dataVersion = dataVersion;
      this.fetchFn = fetchFn;
    }
    async get(key, force = false) {
      let metadata = await this.getMetadataAndCheckUpToDate(force);
      if (!metadata) {
        metadata = await this.updateCache();
      }
      const data = await this.db.getItem(this.storeKey, key);
      return {
        metadata,
        data
      };
    }
    async getAll(force = false) {
      let metadata = await this.getMetadataAndCheckUpToDate(force);
      if (!metadata) {
        metadata = await this.updateCache();
      }
      const data = await this.db.getAllItems(this.storeKey);
      return {
        metadata,
        data
      };
    }
    async updateCache() {
      const data = await this.fetchFn();
      const metadata = {
        timestamp: dayjs().format(),
        version: this.dataVersion
      };
      await this.db.setAllItems(this.storeKey, data);
      await this.db.setMetadata(this.storeKey, metadata);
      return metadata;
    }
async getMetadataAndCheckUpToDate(force = false) {
      if (force) {
        return false;
      }
      const metadata = await this.db.getMetadata(this.storeKey);
      if (metadata && isUpToDate(metadata, this.dataVersion)) {
        return metadata;
      } else {
        return false;
      }
    }
  }
  const VERSION$2 = 1;
  const CACHE_HANDLER$1 = new CacheHandler(LSS_INDEXED_DB_KEYS.BUILDINGS, VERSION$2, fetchAllBuildings);
  const getBuildings = async (force) => {
    return await CACHE_HANDLER$1.getAll(force);
  };
  const VERSION$1 = 1;
  new CacheHandler(LSS_INDEXED_DB_KEYS.MISSIONS, VERSION$1, fetchAllMissions);
  const VERSION = 1;
  const CACHE_HANDLER = new CacheHandler(LSS_INDEXED_DB_KEYS.VEHICLES, VERSION, fetchAllVehicles);
  const getVehicles = async (force) => {
    return await CACHE_HANDLER.getAll(force);
  };
  const drawBuildingsOfDispatchCenter = (controlCenterId, buildings) => {
    const relevantBuildings = buildings.filter((building) => building.leitstelle_building_id === controlCenterId);
    return relevantBuildings.map(
      (building) => L.circleMarker([building.latitude, building.longitude], {
        radius: 10,
        fillColor: "#ff0000",
        color: "#0000ff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
    );
  };
  const VEHICLE_AND_EQUIPMENT_GROUPS = {
    BREATHING_PROTECTION: {
      vehicles: [VehicleType.GWA, VehicleType.AB_BREATHING_PROTECTION],
      equipment: [EquipmentType.BREATHING_PROTECTION]
    },
    DECON: {
      vehicles: [VehicleType.DEKON_P, VehicleType.AB_DEKON_P],
      equipment: [EquipmentType.DECON]
    },
    DIVER: {
      vehicles: [VehicleType.GW_TAUCHER],
      equipment: [EquipmentType.DIVER]
    },
    HAZMAT: {
      vehicles: [VehicleType.GWG, VehicleType.AB_HAZMAT],
      equipment: [EquipmentType.HAZMAT]
    },
    HEAVY_RESQUE: {
      vehicles: [VehicleType.HLF_20, VehicleType.HLF_10, VehicleType.RW, VehicleType.AB_HEAVY_RESCUE],
      equipment: [EquipmentType.HEAVY_RESCUE]
    },
    HIGHT_RESCUE: {
      vehicles: [VehicleType.GWH],
      equipment: [EquipmentType.HIGHT_RESCUE]
    },
    HOSE_WATER: {
      vehicles: [
        VehicleType.SW_1000,
        VehicleType.SW_2000,
        VehicleType.SW_2000TR,
        VehicleType.SW_KATS,
        VehicleType.GW_L2_W,
        VehicleType.AB_HOSE_WATER,
        VehicleType.ANH_HOSE_WATER
      ],
      equipment: [EquipmentType.HOSE_WATER]
    },
    OIL: {
      vehicles: [VehicleType.GW_OIL, VehicleType.AB_OIL],
      equipment: [EquipmentType.OIL]
    }
  };
  const drawVehicleLocations = (group, buildings, vehicles) => {
    const vehiclesToDraw = Object.values(vehicles).filter(
      (vehicle) => group.vehicles.includes(vehicle.vehicle_type) || vehicle.equipments.some((eq) => group.equipment.includes(eq.equipment_type))
    );
    return vehiclesToDraw.map((vehicle) => {
      const building = buildings[vehicle.building_id];
      return L.circleMarker([building.latitude, building.longitude], {
        radius: 10,
        fillColor: "#ff0000",
        color: "#0000ff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    });
  };
  const ID$1 = "LSS_LS42_EHM_MODAL";
  const BUILDING_STATE_REFRESH_BTN_ID = "LSS_LS42_EHM_MODAL_BUILDING_STATE_REFRESH_BTN";
  const BUILDING_STATE_ID = "LSS_LS42_EHM_MODAL_BUILDING_STATE";
  const SELECT_DISPATCH_CENTER_ID = "LSS_LS42_EHM_MODAL_SELECT_DISPATCH_CENTER";
  const CHECKBOX_HIGHLIGHT_BUILDINGS_OF_DISPATCH_ID = "LSS_LS42_EHM_MODAL_CHECKBOX_HIGHLIGHT_BUILDINGS_OF_DISPATCH_CENTER";
  const VEHICLES_STATE_REFRESH_BTN_ID = "LSS_LS42_EHM_MODAL_VEHICLE_STATE_REFRESH_BTN";
  const VEHICLES_STATE_ID = "LSS_LS42_EHM_MODAL_VEHICLE_STATE";
  const SELECT_VEHICLE_GROUP = "LSS_LS42_EHM_MODAL_SELECT_VEHICLE_GROUP";
  const CHECKBOX_HIGHLIGHT_BUILDINGS_OF_VEHICLE_GROUP = "LSS_LS42_EHM_MODAL_CHECKBOX_HIGHLIGHT_BUILDINGS_OF_VEHICLE_GROUP";
  const renderBody = (body) => {
    body.innerHTML = `
<form class="form-horizontal">
  <div class="form-group">
    <h2>DispatchCenter</h2>
  </div>
  <div class="form-group">
    <label for="${SELECT_DISPATCH_CENTER_ID}" class="col-sm-2 control-label">DispatchCenter</label>
    <div class="col-sm-10">
      <select class="form-control" id="${SELECT_DISPATCH_CENTER_ID}">
      </select>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input id="${CHECKBOX_HIGHLIGHT_BUILDINGS_OF_DISPATCH_ID}" type="checkbox"> Highlight Buildings of Dispatch Center
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <h2>Vehicles</h2>
  </div><div class="form-group">
    <label for="${SELECT_VEHICLE_GROUP}" class="col-sm-2 control-label">VehicleGroup</label>
    <div class="col-sm-10">
      <select class="form-control" id="${SELECT_VEHICLE_GROUP}">
      </select>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input id="${CHECKBOX_HIGHLIGHT_BUILDINGS_OF_VEHICLE_GROUP}" type="checkbox"> Highlight Buildings of Vehicile Group
        </label>
      </div>
    </div>
  </div>
</form>
  `;
  };
  let dispatchCenterMarkers = [];
  let vehicleGroupMarkers = [];
  const onHighlightBuildingsOfDispatches = async () => {
    const checkBox = document.querySelector(`#${CHECKBOX_HIGHLIGHT_BUILDINGS_OF_DISPATCH_ID}`);
    const select = document.querySelector(`#${SELECT_DISPATCH_CENTER_ID}`);
    if (checkBox && checkBox.checked && select && !Number.isNaN(Number.parseInt(select.value))) {
      const buildings = await getBuildings();
      dispatchCenterMarkers.forEach((m) => m.remove());
      dispatchCenterMarkers = drawBuildingsOfDispatchCenter(+select.value, Object.values(buildings.data));
      dispatchCenterMarkers.forEach((m) => m.addTo(map));
    } else {
      dispatchCenterMarkers.forEach((m) => m.remove());
    }
  };
  const onHighlightBuildingsOfVehicleGroup = async () => {
    const checkBox = document.querySelector(`#${CHECKBOX_HIGHLIGHT_BUILDINGS_OF_VEHICLE_GROUP}`);
    const select = document.querySelector(`#${SELECT_VEHICLE_GROUP}`);
    if (checkBox && checkBox.checked && select && VEHICLE_AND_EQUIPMENT_GROUPS[select.value] !== void 0) {
      const buildings = await getBuildings();
      const vehicles = await getVehicles();
      vehicleGroupMarkers.forEach((m) => m.remove());
      vehicleGroupMarkers = drawVehicleLocations(
        VEHICLE_AND_EQUIPMENT_GROUPS[select.value],
        buildings.data,
        vehicles.data
      );
      vehicleGroupMarkers.forEach((m) => m.addTo(map));
    } else {
      vehicleGroupMarkers.forEach((m) => m.remove());
    }
  };
  const init = () => {
    const refreshBuildings = document.getElementById(BUILDING_STATE_REFRESH_BTN_ID);
    if (refreshBuildings) {
      refreshBuildings.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        await getBuildings(true);
        await updateModal();
      });
    }
    const refreshVehicles = document.getElementById(VEHICLES_STATE_REFRESH_BTN_ID);
    if (refreshVehicles) {
      refreshVehicles.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        await getVehicles(true);
        await updateModal();
      });
    }
    document.querySelector(`#${CHECKBOX_HIGHLIGHT_BUILDINGS_OF_DISPATCH_ID}`)?.addEventListener("change", onHighlightBuildingsOfDispatches);
    document.querySelector(`#${SELECT_DISPATCH_CENTER_ID}`)?.addEventListener("change", onHighlightBuildingsOfDispatches);
    document.querySelector(`#${CHECKBOX_HIGHLIGHT_BUILDINGS_OF_VEHICLE_GROUP}`)?.addEventListener("change", onHighlightBuildingsOfVehicleGroup);
    document.querySelector(`#${SELECT_VEHICLE_GROUP}`)?.addEventListener("change", onHighlightBuildingsOfVehicleGroup);
  };
  const updateModal = async () => {
    const buildings = await getBuildings();
    const vehicles = await getVehicles();
    const buildingState = document.getElementById(BUILDING_STATE_ID);
    if (buildingState) {
      buildingState.innerText = dayjs(buildings.metadata.timestamp).format("DD.MM.YYYY HH:mm:ss");
    }
    const vehicleState = document.getElementById(VEHICLES_STATE_ID);
    if (vehicleState) {
      vehicleState.innerText = dayjs(vehicles.metadata.timestamp).format("DD.MM.YYYY HH:mm:ss");
    }
    const dispatchSelect = document.getElementById(SELECT_DISPATCH_CENTER_ID);
    if (dispatchSelect) {
      dispatchSelect.innerHTML = "";
      const dispatchCenters = Object.values(buildings.data).filter(
        (b) => b.building_type == BuildingType.DISPATCH_CENTER
      );
      dispatchCenters.forEach((dispatchCenter) => {
        const option = document.createElement("option");
        option.value = dispatchCenter.id.toString();
        option.innerText = dispatchCenter.caption;
        dispatchSelect.appendChild(option);
      });
    }
    const vehicleGroupSelect = document.getElementById(SELECT_VEHICLE_GROUP);
    if (vehicleGroupSelect) {
      vehicleGroupSelect.innerHTML = "";
      Object.keys(VEHICLE_AND_EQUIPMENT_GROUPS).forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.innerText = key;
        vehicleGroupSelect.appendChild(option);
      });
    }
  };
  const renderModal = () => {
    const modal = document.createElement("div");
    modal.id = ID$1;
    modal.classList.add("modal");
    modal.classList.add("fade");
    modal.role = "dialog";
    modal.style.display = "none";
    modal.style.zIndex = "5000";
    const dialog = document.createElement("div");
    dialog.classList.add("modal-dialog");
    dialog.classList.add("modal-lg");
    dialog.role = "document";
    modal.appendChild(dialog);
    const content = document.createElement("div");
    content.classList.add("modal-content");
    dialog.appendChild(content);
    const header = document.createElement("div");
    header.classList.add("modal-header");
    content.appendChild(header);
    const headerText = document.createElement("h1");
    headerText.classList.add("modal-title");
    headerText.innerText = "[EHM] Enhanced Map";
    header.appendChild(headerText);
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close");
    closeBtn.setAttribute("data-dismiss", "modal");
    closeBtn.innerHTML = "<span>×</span>";
    header.appendChild(closeBtn);
    const body = document.createElement("div");
    body.classList.add("modal-body");
    renderBody(body);
    content.appendChild(body);
    const footer = document.createElement("div");
    footer.classList.add("modal-footer");
    content.appendChild(footer);
    const footerRow = document.createElement("div");
    footerRow.classList.add("row");
    footer.appendChild(footerRow);
    const footerLeftCol = document.createElement("div");
    footerLeftCol.classList.add("col-md-8");
    footerRow.appendChild(footerLeftCol);
    const cacheInfo = document.createElement("div");
    cacheInfo.style.display = "flex";
    cacheInfo.style.flexDirection = "row";
    cacheInfo.style.columnGap = "4px";
    cacheInfo.style.alignItems = "center";
    footerLeftCol.appendChild(cacheInfo);
    const refreshBuildingsBtn = document.createElement("button");
    refreshBuildingsBtn.id = BUILDING_STATE_REFRESH_BTN_ID;
    refreshBuildingsBtn.classList.add("btn");
    refreshBuildingsBtn.classList.add("btn-xs");
    refreshBuildingsBtn.classList.add("btn-default");
    refreshBuildingsBtn.title = "Reload Buildings";
    refreshBuildingsBtn.innerHTML = `<span class="glyphicon glyphicon-repeat"></span>`;
    cacheInfo.appendChild(refreshBuildingsBtn);
    const buildingTxt = document.createElement("strong");
    buildingTxt.innerText = "Building State:";
    cacheInfo.appendChild(buildingTxt);
    const buildingTxtDate = document.createElement("span");
    buildingTxtDate.id = BUILDING_STATE_ID;
    buildingTxtDate.innerText = "Date missing";
    cacheInfo.appendChild(buildingTxtDate);
    const refreshVehiclesBtn = document.createElement("button");
    refreshVehiclesBtn.id = VEHICLES_STATE_REFRESH_BTN_ID;
    refreshVehiclesBtn.classList.add("btn");
    refreshVehiclesBtn.classList.add("btn-xs");
    refreshVehiclesBtn.classList.add("btn-default");
    refreshVehiclesBtn.title = "Reload Vehicles";
    refreshVehiclesBtn.innerHTML = `<span class="glyphicon glyphicon-repeat"></span>`;
    cacheInfo.appendChild(refreshVehiclesBtn);
    const vehiclesTxt = document.createElement("strong");
    vehiclesTxt.innerText = "Vehicle State:";
    cacheInfo.appendChild(vehiclesTxt);
    const vehiclesTxtDate = document.createElement("span");
    vehiclesTxtDate.id = VEHICLES_STATE_ID;
    vehiclesTxtDate.innerText = "Date missing";
    cacheInfo.appendChild(vehiclesTxtDate);
    const footerColRight = document.createElement("div");
    footerColRight.classList.add("col-md-4");
    footerRow.appendChild(footerColRight);
    const footerCloseBtn = document.createElement("button");
    footerCloseBtn.classList.add("btn");
    footerCloseBtn.classList.add("btn-secondary");
    footerCloseBtn.setAttribute("data-dismiss", "modal");
    footerCloseBtn.innerText = "Close";
    footerColRight.appendChild(footerCloseBtn);
    document.body.append(modal);
    init();
    updateModal();
  };
  const ID = "LSS_LS42_EHM_MENU_BTN";
  const renderMenuBtn = () => {
    const existingBtn = document.getElementById(ID);
    if (!existingBtn) {
      const bottomLeft = document.querySelector("#map .leaflet-bottom.leaflet-left");
      if (!bottomLeft) {
        throw new Error("No leaflet map found.");
      }
      const bar = document.createElement("div");
      bar.classList.add("leaflet-bar");
      bar.classList.add("leaflet-control");
      const btn = document.createElement("a");
      btn.id = ID;
      btn.innerText = "EHM";
      btn.role = "button";
      btn.href = "#";
      btn.setAttribute("data-toggle", "modal");
      btn.setAttribute("data-target", `#${ID$1}`);
      bar.append(btn);
      bottomLeft.appendChild(bar);
    }
  };
  (() => {
    if (!map) {
      console.warn("No map found, disabling enhanced map");
      return;
    }
    renderModal();
    renderMenuBtn();
  })();

})();