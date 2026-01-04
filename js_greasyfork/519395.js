// ==UserScript==
// @name         河南工业职业技术学院宿舍强制签到
// @namespace    fachep/hnpi-dorm-checkin
// @version      0.1.1
// @author       Fachep
// @description  河南工业职业技术学院宿舍签到脚本
// @license      MIT
// @icon         https://xg.hnpi.edu.cn/xsfw/sys/swmzncqapp/*default/public/images/newmob/sdkq_5.png
// @source       https://github.com/Fachep/hnpi-dorm-checkin.git
// @match        https://xg.hnpi.edu.cn/xsfw/sys/swmzncqapp/*
// @require      https://fastly.jsdelivr.net/npm/prcoords@1.0.5/js/PRCoords.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/519395/%E6%B2%B3%E5%8D%97%E5%B7%A5%E4%B8%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E5%AE%BF%E8%88%8D%E5%BC%BA%E5%88%B6%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/519395/%E6%B2%B3%E5%8D%97%E5%B7%A5%E4%B8%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E5%AE%BF%E8%88%8D%E5%BC%BA%E5%88%B6%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const a=document.createElement("style");a.textContent=t,document.head.append(a)})(" div#app{height:unset!important}div#app>div#sdkq-box{height:unset!important}div#app>div#sdkq-box>div#sdkq-kqqd{height:unset!important}.root[data-v-542b7bae]{margin:0 auto;width:calc(100% - 24px);padding:16px;background-color:#fff;border-radius:16px}@media screen and (min-width: 900px){.box[data-v-542b7bae]{display:flex;justify-content:space-between}}.box>div[data-v-542b7bae]{margin-right:16px}.map-box[data-v-542b7bae]{display:flex;justify-content:center;flex-direction:column;align-items:center}.van-button+.van-button[data-v-542b7bae]{margin-left:12px}tr.xg-font-maintext>td>input[data-v-542b7bae]{width:100%}.buttons[data-v-542b7bae]{margin:auto 0 0 auto;display:flex;justify-content:end} ");

(async function (prcoords) {
  'use strict';

  function bd2wgs(lng, lat) {
    const ret = prcoords.bd_wgs({ lon: lng, lat });
    return [ret.lon, ret.lat];
  }
  function wgs2bd(lng, lat) {
    const ret = prcoords.wgs_bd({ lon: lng, lat });
    return [ret.lon, ret.lat];
  }
  function requireAsync(module) {
    return new Promise(require.bind(globalThis, module));
  }
  await( requireAsync(["../../swpubapp/newmob/js/resources"]));
  const Vue = await( requireAsync(["vue"]));
  var es = {};
  var computeDestinationPoint$1 = {};
  var getLatitude$1 = {};
  var constants = {};
  Object.defineProperty(constants, "__esModule", { value: true });
  constants.areaConversion = constants.timeConversion = constants.distanceConversion = constants.altitudeKeys = constants.latitudeKeys = constants.longitudeKeys = constants.MAXLON = constants.MINLON = constants.MAXLAT = constants.MINLAT = constants.earthRadius = constants.sexagesimalPattern = void 0;
  var sexagesimalPattern = /^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,}))?)['′]\s*(([0-9]{1,3}(\.([0-9]{1,}))?)["″]\s*)?([NEOSW]?)$/;
  constants.sexagesimalPattern = sexagesimalPattern;
  var earthRadius = 6378137;
  constants.earthRadius = earthRadius;
  var MINLAT = -90;
  constants.MINLAT = MINLAT;
  var MAXLAT = 90;
  constants.MAXLAT = MAXLAT;
  var MINLON = -180;
  constants.MINLON = MINLON;
  var MAXLON = 180;
  constants.MAXLON = MAXLON;
  var longitudeKeys = ["lng", "lon", "longitude", 0];
  constants.longitudeKeys = longitudeKeys;
  var latitudeKeys = ["lat", "latitude", 1];
  constants.latitudeKeys = latitudeKeys;
  var altitudeKeys = ["alt", "altitude", "elevation", "elev", 2];
  constants.altitudeKeys = altitudeKeys;
  var distanceConversion = { m: 1, km: 1e-3, cm: 100, mm: 1e3, mi: 1 / 1609.344, sm: 1 / 1852.216, ft: 100 / 30.48, in: 100 / 2.54, yd: 1 / 0.9144 };
  constants.distanceConversion = distanceConversion;
  var timeConversion = { m: 60, h: 3600, d: 86400 };
  constants.timeConversion = timeConversion;
  var areaConversion = { m2: 1, km2: 1e-6, ha: 1e-4, a: 0.01, ft2: 10.763911, yd2: 1.19599, in2: 1550.0031 };
  constants.areaConversion = areaConversion;
  areaConversion.sqm = areaConversion.m2;
  areaConversion.sqkm = areaConversion.km2;
  areaConversion.sqft = areaConversion.ft2;
  areaConversion.sqyd = areaConversion.yd2;
  areaConversion.sqin = areaConversion.in2;
  var getCoordinateKey$1 = {};
  Object.defineProperty(getCoordinateKey$1, "__esModule", { value: true });
  getCoordinateKey$1.default = void 0;
  var getCoordinateKey = function getCoordinateKey2(point, keysToLookup) {
    return keysToLookup.reduce(function(foundKey, key) {
      if (typeof point === "undefined" || point === null) {
        throw new Error("'".concat(point, "' is no valid coordinate."));
      }
      if (Object.prototype.hasOwnProperty.call(point, key) && typeof key !== "undefined" && typeof foundKey === "undefined") {
        foundKey = key;
        return key;
      }
      return foundKey;
    }, void 0);
  };
  var _default$D = getCoordinateKey;
  getCoordinateKey$1.default = _default$D;
  var toDecimal$1 = {};
  var isDecimal$1 = {};
  Object.defineProperty(isDecimal$1, "__esModule", { value: true });
  isDecimal$1.default = void 0;
  var isDecimal = function isDecimal2(value) {
    var checkedValue = value.toString().trim();
    if (isNaN(parseFloat(checkedValue))) {
      return false;
    }
    return parseFloat(checkedValue) === Number(checkedValue);
  };
  var _default$C = isDecimal;
  isDecimal$1.default = _default$C;
  var isSexagesimal$1 = {};
  Object.defineProperty(isSexagesimal$1, "__esModule", { value: true });
  isSexagesimal$1.default = void 0;
  var _constants$e = constants;
  var isSexagesimal = function isSexagesimal2(value) {
    return _constants$e.sexagesimalPattern.test(value.toString().trim());
  };
  var _default$B = isSexagesimal;
  isSexagesimal$1.default = _default$B;
  var sexagesimalToDecimal$1 = {};
  Object.defineProperty(sexagesimalToDecimal$1, "__esModule", { value: true });
  sexagesimalToDecimal$1.default = void 0;
  var _constants$d = constants;
  var sexagesimalToDecimal = function sexagesimalToDecimal2(sexagesimal) {
    var data = new RegExp(_constants$d.sexagesimalPattern).exec(sexagesimal.toString().trim());
    if (typeof data === "undefined" || data === null) {
      throw new Error("Given value is not in sexagesimal format");
    }
    var min = Number(data[2]) / 60 || 0;
    var sec = Number(data[4]) / 3600 || 0;
    var decimal = parseFloat(data[1]) + min + sec;
    return ["S", "W"].includes(data[7]) ? -decimal : decimal;
  };
  var _default$A = sexagesimalToDecimal;
  sexagesimalToDecimal$1.default = _default$A;
  var isValidCoordinate$1 = {};
  var getCoordinateKeys$1 = {};
  Object.defineProperty(getCoordinateKeys$1, "__esModule", { value: true });
  getCoordinateKeys$1.default = void 0;
  var _constants$c = constants;
  var _getCoordinateKey$2 = _interopRequireDefault$q(getCoordinateKey$1);
  function _interopRequireDefault$q(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys$1(Object(source), true).forEach(function(key) {
          _defineProperty$1(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var getCoordinateKeys = function getCoordinateKeys2(point) {
    var keysToLookup = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { longitude: _constants$c.longitudeKeys, latitude: _constants$c.latitudeKeys, altitude: _constants$c.altitudeKeys };
    var longitude = (0, _getCoordinateKey$2.default)(point, keysToLookup.longitude);
    var latitude = (0, _getCoordinateKey$2.default)(point, keysToLookup.latitude);
    var altitude = (0, _getCoordinateKey$2.default)(point, keysToLookup.altitude);
    return _objectSpread$1({ latitude, longitude }, altitude ? { altitude } : {});
  };
  var _default$z = getCoordinateKeys;
  getCoordinateKeys$1.default = _default$z;
  var isValidLatitude$1 = {};
  Object.defineProperty(isValidLatitude$1, "__esModule", { value: true });
  isValidLatitude$1.default = void 0;
  var _isDecimal$2 = _interopRequireDefault$p(isDecimal$1);
  var _isSexagesimal$2 = _interopRequireDefault$p(isSexagesimal$1);
  var _sexagesimalToDecimal$2 = _interopRequireDefault$p(sexagesimalToDecimal$1);
  var _constants$b = constants;
  function _interopRequireDefault$p(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isValidLatitude = function isValidLatitude2(value) {
    if ((0, _isDecimal$2.default)(value)) {
      if (parseFloat(value) > _constants$b.MAXLAT || value < _constants$b.MINLAT) {
        return false;
      }
      return true;
    }
    if ((0, _isSexagesimal$2.default)(value)) {
      return isValidLatitude2((0, _sexagesimalToDecimal$2.default)(value));
    }
    return false;
  };
  var _default$y = isValidLatitude;
  isValidLatitude$1.default = _default$y;
  var isValidLongitude$1 = {};
  Object.defineProperty(isValidLongitude$1, "__esModule", { value: true });
  isValidLongitude$1.default = void 0;
  var _isDecimal$1 = _interopRequireDefault$o(isDecimal$1);
  var _isSexagesimal$1 = _interopRequireDefault$o(isSexagesimal$1);
  var _sexagesimalToDecimal$1 = _interopRequireDefault$o(sexagesimalToDecimal$1);
  var _constants$a = constants;
  function _interopRequireDefault$o(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isValidLongitude = function isValidLongitude2(value) {
    if ((0, _isDecimal$1.default)(value)) {
      if (parseFloat(value) > _constants$a.MAXLON || value < _constants$a.MINLON) {
        return false;
      }
      return true;
    }
    if ((0, _isSexagesimal$1.default)(value)) {
      return isValidLongitude2((0, _sexagesimalToDecimal$1.default)(value));
    }
    return false;
  };
  var _default$x = isValidLongitude;
  isValidLongitude$1.default = _default$x;
  Object.defineProperty(isValidCoordinate$1, "__esModule", { value: true });
  isValidCoordinate$1.default = void 0;
  var _getCoordinateKeys2 = _interopRequireDefault$n(getCoordinateKeys$1);
  var _isValidLatitude = _interopRequireDefault$n(isValidLatitude$1);
  var _isValidLongitude = _interopRequireDefault$n(isValidLongitude$1);
  function _interopRequireDefault$n(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isValidCoordinate = function isValidCoordinate2(point) {
    var _getCoordinateKeys3 = (0, _getCoordinateKeys2.default)(point), latitude = _getCoordinateKeys3.latitude, longitude = _getCoordinateKeys3.longitude;
    if (Array.isArray(point) && point.length >= 2) {
      return (0, _isValidLongitude.default)(point[0]) && (0, _isValidLatitude.default)(point[1]);
    }
    if (typeof latitude === "undefined" || typeof longitude === "undefined") {
      return false;
    }
    var lon = point[longitude];
    var lat = point[latitude];
    if (typeof lat === "undefined" || typeof lon === "undefined") {
      return false;
    }
    if ((0, _isValidLatitude.default)(lat) === false || (0, _isValidLongitude.default)(lon) === false) {
      return false;
    }
    return true;
  };
  var _default$w = isValidCoordinate;
  isValidCoordinate$1.default = _default$w;
  Object.defineProperty(toDecimal$1, "__esModule", { value: true });
  toDecimal$1.default = void 0;
  var _isDecimal = _interopRequireDefault$m(isDecimal$1);
  var _isSexagesimal = _interopRequireDefault$m(isSexagesimal$1);
  var _sexagesimalToDecimal = _interopRequireDefault$m(sexagesimalToDecimal$1);
  var _isValidCoordinate = _interopRequireDefault$m(isValidCoordinate$1);
  var _getCoordinateKeys = _interopRequireDefault$m(getCoordinateKeys$1);
  function _interopRequireDefault$m(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var toDecimal = function toDecimal2(value) {
    if ((0, _isDecimal.default)(value)) {
      return Number(value);
    }
    if ((0, _isSexagesimal.default)(value)) {
      return (0, _sexagesimalToDecimal.default)(value);
    }
    if ((0, _isValidCoordinate.default)(value)) {
      var keys = (0, _getCoordinateKeys.default)(value);
      if (Array.isArray(value)) {
        return value.map(function(v, index) {
          return [0, 1].includes(index) ? toDecimal2(v) : v;
        });
      }
      return _objectSpread(_objectSpread(_objectSpread({}, value), keys.latitude && _defineProperty({}, keys.latitude, toDecimal2(value[keys.latitude]))), keys.longitude && _defineProperty({}, keys.longitude, toDecimal2(value[keys.longitude])));
    }
    if (Array.isArray(value)) {
      return value.map(function(point) {
        return (0, _isValidCoordinate.default)(point) ? toDecimal2(point) : point;
      });
    }
    return value;
  };
  var _default$v = toDecimal;
  toDecimal$1.default = _default$v;
  Object.defineProperty(getLatitude$1, "__esModule", { value: true });
  getLatitude$1.default = void 0;
  var _constants$9 = constants;
  var _getCoordinateKey$1 = _interopRequireDefault$l(getCoordinateKey$1);
  var _toDecimal$1 = _interopRequireDefault$l(toDecimal$1);
  function _interopRequireDefault$l(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getLatitude = function getLatitude2(point, raw) {
    var latKey = (0, _getCoordinateKey$1.default)(point, _constants$9.latitudeKeys);
    if (typeof latKey === "undefined" || latKey === null) {
      return;
    }
    var value = point[latKey];
    return raw === true ? value : (0, _toDecimal$1.default)(value);
  };
  var _default$u = getLatitude;
  getLatitude$1.default = _default$u;
  var getLongitude$1 = {};
  Object.defineProperty(getLongitude$1, "__esModule", { value: true });
  getLongitude$1.default = void 0;
  var _constants$8 = constants;
  var _getCoordinateKey = _interopRequireDefault$k(getCoordinateKey$1);
  var _toDecimal = _interopRequireDefault$k(toDecimal$1);
  function _interopRequireDefault$k(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getLongitude = function getLongitude2(point, raw) {
    var latKey = (0, _getCoordinateKey.default)(point, _constants$8.longitudeKeys);
    if (typeof latKey === "undefined" || latKey === null) {
      return;
    }
    var value = point[latKey];
    return raw === true ? value : (0, _toDecimal.default)(value);
  };
  var _default$t = getLongitude;
  getLongitude$1.default = _default$t;
  var toRad$1 = {};
  Object.defineProperty(toRad$1, "__esModule", { value: true });
  toRad$1.default = void 0;
  var toRad = function toRad2(value) {
    return value * Math.PI / 180;
  };
  var _default$s = toRad;
  toRad$1.default = _default$s;
  var toDeg$1 = {};
  Object.defineProperty(toDeg$1, "__esModule", { value: true });
  toDeg$1.default = void 0;
  var toDeg = function toDeg2(value) {
    return value * 180 / Math.PI;
  };
  var _default$r = toDeg;
  toDeg$1.default = _default$r;
  Object.defineProperty(computeDestinationPoint$1, "__esModule", { value: true });
  computeDestinationPoint$1.default = void 0;
  var _getLatitude$9 = _interopRequireDefault$j(getLatitude$1);
  var _getLongitude$9 = _interopRequireDefault$j(getLongitude$1);
  var _toRad$7 = _interopRequireDefault$j(toRad$1);
  var _toDeg$4 = _interopRequireDefault$j(toDeg$1);
  var _constants$7 = constants;
  function _interopRequireDefault$j(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var computeDestinationPoint = function computeDestinationPoint2(start, distance, bearing) {
    var radius = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 6371e3;
    var lat = (0, _getLatitude$9.default)(start);
    var lng = (0, _getLongitude$9.default)(start);
    var delta = distance / radius;
    var theta = (0, _toRad$7.default)(bearing);
    var phi1 = (0, _toRad$7.default)(lat);
    var lambda1 = (0, _toRad$7.default)(lng);
    var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(theta));
    var lambda2 = lambda1 + Math.atan2(Math.sin(theta) * Math.sin(delta) * Math.cos(phi1), Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
    var longitude = (0, _toDeg$4.default)(lambda2);
    if (longitude < _constants$7.MINLON || longitude > _constants$7.MAXLON) {
      lambda2 = (lambda2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
      longitude = (0, _toDeg$4.default)(lambda2);
    }
    return { latitude: (0, _toDeg$4.default)(phi2), longitude };
  };
  var _default$q = computeDestinationPoint;
  computeDestinationPoint$1.default = _default$q;
  var convertArea$1 = {};
  Object.defineProperty(convertArea$1, "__esModule", { value: true });
  convertArea$1.default = void 0;
  var _constants$6 = constants;
  var convertArea = function convertArea2(squareMeters) {
    var targetUnit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "m";
    var factor = _constants$6.areaConversion[targetUnit];
    if (factor) {
      return squareMeters * factor;
    }
    throw new Error("Invalid unit used for area conversion.");
  };
  var _default$p = convertArea;
  convertArea$1.default = _default$p;
  var convertDistance$1 = {};
  Object.defineProperty(convertDistance$1, "__esModule", { value: true });
  convertDistance$1.default = void 0;
  var _constants$5 = constants;
  var convertDistance = function convertDistance2(meters) {
    var targetUnit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "m";
    var factor = _constants$5.distanceConversion[targetUnit];
    if (factor) {
      return meters * factor;
    }
    throw new Error("Invalid unit used for distance conversion.");
  };
  var _default$o = convertDistance;
  convertDistance$1.default = _default$o;
  var convertSpeed$1 = {};
  Object.defineProperty(convertSpeed$1, "__esModule", { value: true });
  convertSpeed$1.default = void 0;
  var _constants$4 = constants;
  var convertSpeed = function convertSpeed2(metersPerSecond) {
    var targetUnit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "kmh";
    switch (targetUnit) {
      case "kmh":
        return metersPerSecond * _constants$4.timeConversion.h * _constants$4.distanceConversion.km;
      case "mph":
        return metersPerSecond * _constants$4.timeConversion.h * _constants$4.distanceConversion.mi;
      default:
        return metersPerSecond;
    }
  };
  var _default$n = convertSpeed;
  convertSpeed$1.default = _default$n;
  var decimalToSexagesimal = {};
  Object.defineProperty(decimalToSexagesimal, "__esModule", { value: true });
  decimalToSexagesimal.default = void 0;
  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
  }
  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }
  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit$1(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }
  var imprecise = function imprecise2(number) {
    var decimals = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 4;
    var factor = Math.pow(10, decimals);
    return Math.round(number * factor) / factor;
  };
  var decimal2sexagesimalNext = function decimal2sexagesimalNext2(decimal) {
    var _decimal$toString$spl = decimal.toString().split("."), _decimal$toString$spl2 = _slicedToArray$1(_decimal$toString$spl, 2), pre = _decimal$toString$spl2[0], post = _decimal$toString$spl2[1];
    var deg = Math.abs(Number(pre));
    var min0 = Number("0." + (post || 0)) * 60;
    var sec0 = min0.toString().split(".");
    var min = Math.floor(min0);
    var sec = imprecise(Number("0." + (sec0[1] || 0)) * 60).toString();
    var _sec$split = sec.split("."), _sec$split2 = _slicedToArray$1(_sec$split, 2), secPreDec = _sec$split2[0], _sec$split2$ = _sec$split2[1], secDec = _sec$split2$ === void 0 ? "0" : _sec$split2$;
    return deg + "° " + min.toString().padStart(2, "0") + "' " + secPreDec.padStart(2, "0") + "." + secDec.padEnd(1, "0") + '"';
  };
  var _default$m = decimal2sexagesimalNext;
  decimalToSexagesimal.default = _default$m;
  var findNearest$1 = {};
  var orderByDistance$1 = {};
  var getDistance$2 = {};
  var robustAcos$1 = {};
  Object.defineProperty(robustAcos$1, "__esModule", { value: true });
  robustAcos$1.default = void 0;
  var robustAcos = function robustAcos2(value) {
    if (value > 1) {
      return 1;
    }
    if (value < -1) {
      return -1;
    }
    return value;
  };
  var _default$l = robustAcos;
  robustAcos$1.default = _default$l;
  Object.defineProperty(getDistance$2, "__esModule", { value: true });
  getDistance$2.default = void 0;
  var _getLatitude$8 = _interopRequireDefault$i(getLatitude$1);
  var _getLongitude$8 = _interopRequireDefault$i(getLongitude$1);
  var _toRad$6 = _interopRequireDefault$i(toRad$1);
  var _robustAcos$1 = _interopRequireDefault$i(robustAcos$1);
  var _constants$3 = constants;
  function _interopRequireDefault$i(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getDistance$1 = function getDistance(from, to) {
    var accuracy = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    accuracy = typeof accuracy !== "undefined" && !isNaN(accuracy) ? accuracy : 1;
    var fromLat = (0, _getLatitude$8.default)(from);
    var fromLon = (0, _getLongitude$8.default)(from);
    var toLat = (0, _getLatitude$8.default)(to);
    var toLon = (0, _getLongitude$8.default)(to);
    var distance = Math.acos((0, _robustAcos$1.default)(Math.sin((0, _toRad$6.default)(toLat)) * Math.sin((0, _toRad$6.default)(fromLat)) + Math.cos((0, _toRad$6.default)(toLat)) * Math.cos((0, _toRad$6.default)(fromLat)) * Math.cos((0, _toRad$6.default)(fromLon) - (0, _toRad$6.default)(toLon)))) * _constants$3.earthRadius;
    return Math.round(distance / accuracy) * accuracy;
  };
  var _default$k = getDistance$1;
  getDistance$2.default = _default$k;
  Object.defineProperty(orderByDistance$1, "__esModule", { value: true });
  orderByDistance$1.default = void 0;
  var _getDistance$5 = _interopRequireDefault$h(getDistance$2);
  function _interopRequireDefault$h(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var orderByDistance = function orderByDistance2(point, coords) {
    var distanceFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _getDistance$5.default;
    distanceFn = typeof distanceFn === "function" ? distanceFn : _getDistance$5.default;
    return coords.slice().sort(function(a, b) {
      return distanceFn(point, a) - distanceFn(point, b);
    });
  };
  var _default$j = orderByDistance;
  orderByDistance$1.default = _default$j;
  Object.defineProperty(findNearest$1, "__esModule", { value: true });
  findNearest$1.default = void 0;
  var _orderByDistance = _interopRequireDefault$g(orderByDistance$1);
  function _interopRequireDefault$g(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var findNearest = function findNearest2(point, coords) {
    return (0, _orderByDistance.default)(point, coords)[0];
  };
  var _default$i = findNearest;
  findNearest$1.default = _default$i;
  var getAreaOfPolygon$1 = {};
  Object.defineProperty(getAreaOfPolygon$1, "__esModule", { value: true });
  getAreaOfPolygon$1.default = void 0;
  var _toRad$5 = _interopRequireDefault$f(toRad$1);
  var _getLatitude$7 = _interopRequireDefault$f(getLatitude$1);
  var _getLongitude$7 = _interopRequireDefault$f(getLongitude$1);
  var _constants$2 = constants;
  function _interopRequireDefault$f(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getAreaOfPolygon = function getAreaOfPolygon2(points) {
    var area = 0;
    if (points.length > 2) {
      var lowerIndex;
      var middleIndex;
      var upperIndex;
      for (var i = 0; i < points.length; i++) {
        if (i === points.length - 2) {
          lowerIndex = points.length - 2;
          middleIndex = points.length - 1;
          upperIndex = 0;
        } else if (i === points.length - 1) {
          lowerIndex = points.length - 1;
          middleIndex = 0;
          upperIndex = 1;
        } else {
          lowerIndex = i;
          middleIndex = i + 1;
          upperIndex = i + 2;
        }
        var p1lon = (0, _getLongitude$7.default)(points[lowerIndex]);
        var p2lat = (0, _getLatitude$7.default)(points[middleIndex]);
        var p3lon = (0, _getLongitude$7.default)(points[upperIndex]);
        area += ((0, _toRad$5.default)(p3lon) - (0, _toRad$5.default)(p1lon)) * Math.sin((0, _toRad$5.default)(p2lat));
      }
      area = area * _constants$2.earthRadius * _constants$2.earthRadius / 2;
    }
    return Math.abs(area);
  };
  var _default$h = getAreaOfPolygon;
  getAreaOfPolygon$1.default = _default$h;
  var getBounds$1 = {};
  Object.defineProperty(getBounds$1, "__esModule", { value: true });
  getBounds$1.default = void 0;
  var _getLatitude$6 = _interopRequireDefault$e(getLatitude$1);
  var _getLongitude$6 = _interopRequireDefault$e(getLongitude$1);
  function _interopRequireDefault$e(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getBounds = function getBounds2(points) {
    if (Array.isArray(points) === false || points.length === 0) {
      throw new Error("No points were given.");
    }
    return points.reduce(function(stats, point) {
      var latitude = (0, _getLatitude$6.default)(point);
      var longitude = (0, _getLongitude$6.default)(point);
      return { maxLat: Math.max(latitude, stats.maxLat), minLat: Math.min(latitude, stats.minLat), maxLng: Math.max(longitude, stats.maxLng), minLng: Math.min(longitude, stats.minLng) };
    }, { maxLat: -Infinity, minLat: Infinity, maxLng: -Infinity, minLng: Infinity });
  };
  var _default$g = getBounds;
  getBounds$1.default = _default$g;
  var getBoundsOfDistance$1 = {};
  Object.defineProperty(getBoundsOfDistance$1, "__esModule", { value: true });
  getBoundsOfDistance$1.default = void 0;
  var _getLatitude$5 = _interopRequireDefault$d(getLatitude$1);
  var _getLongitude$5 = _interopRequireDefault$d(getLongitude$1);
  var _toRad$4 = _interopRequireDefault$d(toRad$1);
  var _toDeg$3 = _interopRequireDefault$d(toDeg$1);
  var _constants$1 = constants;
  function _interopRequireDefault$d(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getBoundsOfDistance = function getBoundsOfDistance2(point, distance) {
    var latitude = (0, _getLatitude$5.default)(point);
    var longitude = (0, _getLongitude$5.default)(point);
    var radLat = (0, _toRad$4.default)(latitude);
    var radLon = (0, _toRad$4.default)(longitude);
    var radDist = distance / _constants$1.earthRadius;
    var minLat = radLat - radDist;
    var maxLat = radLat + radDist;
    var MAX_LAT_RAD = (0, _toRad$4.default)(_constants$1.MAXLAT);
    var MIN_LAT_RAD = (0, _toRad$4.default)(_constants$1.MINLAT);
    var MAX_LON_RAD = (0, _toRad$4.default)(_constants$1.MAXLON);
    var MIN_LON_RAD = (0, _toRad$4.default)(_constants$1.MINLON);
    var minLon;
    var maxLon;
    if (minLat > MIN_LAT_RAD && maxLat < MAX_LAT_RAD) {
      var deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
      minLon = radLon - deltaLon;
      if (minLon < MIN_LON_RAD) {
        minLon += Math.PI * 2;
      }
      maxLon = radLon + deltaLon;
      if (maxLon > MAX_LON_RAD) {
        maxLon -= Math.PI * 2;
      }
    } else {
      minLat = Math.max(minLat, MIN_LAT_RAD);
      maxLat = Math.min(maxLat, MAX_LAT_RAD);
      minLon = MIN_LON_RAD;
      maxLon = MAX_LON_RAD;
    }
    return [{ latitude: (0, _toDeg$3.default)(minLat), longitude: (0, _toDeg$3.default)(minLon) }, { latitude: (0, _toDeg$3.default)(maxLat), longitude: (0, _toDeg$3.default)(maxLon) }];
  };
  var _default$f = getBoundsOfDistance;
  getBoundsOfDistance$1.default = _default$f;
  var getCenter$1 = {};
  Object.defineProperty(getCenter$1, "__esModule", { value: true });
  getCenter$1.default = void 0;
  var _getLatitude$4 = _interopRequireDefault$c(getLatitude$1);
  var _getLongitude$4 = _interopRequireDefault$c(getLongitude$1);
  var _toRad$3 = _interopRequireDefault$c(toRad$1);
  var _toDeg$2 = _interopRequireDefault$c(toDeg$1);
  function _interopRequireDefault$c(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getCenter = function getCenter2(points) {
    if (Array.isArray(points) === false || points.length === 0) {
      return false;
    }
    var numberOfPoints = points.length;
    var sum = points.reduce(function(acc, point) {
      var pointLat = (0, _toRad$3.default)((0, _getLatitude$4.default)(point));
      var pointLon = (0, _toRad$3.default)((0, _getLongitude$4.default)(point));
      return { X: acc.X + Math.cos(pointLat) * Math.cos(pointLon), Y: acc.Y + Math.cos(pointLat) * Math.sin(pointLon), Z: acc.Z + Math.sin(pointLat) };
    }, { X: 0, Y: 0, Z: 0 });
    var X = sum.X / numberOfPoints;
    var Y = sum.Y / numberOfPoints;
    var Z = sum.Z / numberOfPoints;
    return { longitude: (0, _toDeg$2.default)(Math.atan2(Y, X)), latitude: (0, _toDeg$2.default)(Math.atan2(Z, Math.sqrt(X * X + Y * Y))) };
  };
  var _default$e = getCenter;
  getCenter$1.default = _default$e;
  var getCenterOfBounds$1 = {};
  Object.defineProperty(getCenterOfBounds$1, "__esModule", { value: true });
  getCenterOfBounds$1.default = void 0;
  var _getBounds = _interopRequireDefault$b(getBounds$1);
  function _interopRequireDefault$b(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getCenterOfBounds = function getCenterOfBounds2(coords) {
    var bounds = (0, _getBounds.default)(coords);
    var latitude = bounds.minLat + (bounds.maxLat - bounds.minLat) / 2;
    var longitude = bounds.minLng + (bounds.maxLng - bounds.minLng) / 2;
    return { latitude: parseFloat(latitude.toFixed(6)), longitude: parseFloat(longitude.toFixed(6)) };
  };
  var _default$d = getCenterOfBounds;
  getCenterOfBounds$1.default = _default$d;
  var getCompassDirection$1 = {};
  var getRhumbLineBearing$1 = {};
  Object.defineProperty(getRhumbLineBearing$1, "__esModule", { value: true });
  getRhumbLineBearing$1.default = void 0;
  var _getLatitude$3 = _interopRequireDefault$a(getLatitude$1);
  var _getLongitude$3 = _interopRequireDefault$a(getLongitude$1);
  var _toRad$2 = _interopRequireDefault$a(toRad$1);
  var _toDeg$1 = _interopRequireDefault$a(toDeg$1);
  function _interopRequireDefault$a(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getRhumbLineBearing = function getRhumbLineBearing2(origin, dest) {
    var diffLon = (0, _toRad$2.default)((0, _getLongitude$3.default)(dest)) - (0, _toRad$2.default)((0, _getLongitude$3.default)(origin));
    var diffPhi = Math.log(Math.tan((0, _toRad$2.default)((0, _getLatitude$3.default)(dest)) / 2 + Math.PI / 4) / Math.tan((0, _toRad$2.default)((0, _getLatitude$3.default)(origin)) / 2 + Math.PI / 4));
    if (Math.abs(diffLon) > Math.PI) {
      if (diffLon > 0) {
        diffLon = (Math.PI * 2 - diffLon) * -1;
      } else {
        diffLon = Math.PI * 2 + diffLon;
      }
    }
    return ((0, _toDeg$1.default)(Math.atan2(diffLon, diffPhi)) + 360) % 360;
  };
  var _default$c = getRhumbLineBearing;
  getRhumbLineBearing$1.default = _default$c;
  Object.defineProperty(getCompassDirection$1, "__esModule", { value: true });
  getCompassDirection$1.default = void 0;
  var _getRhumbLineBearing = _interopRequireDefault$9(getRhumbLineBearing$1);
  function _interopRequireDefault$9(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getCompassDirection = function getCompassDirection2(origin, dest) {
    var bearingFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _getRhumbLineBearing.default;
    var bearing = typeof bearingFn === "function" ? bearingFn(origin, dest) : (0, _getRhumbLineBearing.default)(origin, dest);
    if (isNaN(bearing)) {
      throw new Error("Could not calculate bearing for given points. Check your bearing function");
    }
    switch (Math.round(bearing / 22.5)) {
      case 1:
        return "NNE";
      case 2:
        return "NE";
      case 3:
        return "ENE";
      case 4:
        return "E";
      case 5:
        return "ESE";
      case 6:
        return "SE";
      case 7:
        return "SSE";
      case 8:
        return "S";
      case 9:
        return "SSW";
      case 10:
        return "SW";
      case 11:
        return "WSW";
      case 12:
        return "W";
      case 13:
        return "WNW";
      case 14:
        return "NW";
      case 15:
        return "NNW";
      default:
        return "N";
    }
  };
  var _default$b = getCompassDirection;
  getCompassDirection$1.default = _default$b;
  var getDistanceFromLine$1 = {};
  Object.defineProperty(getDistanceFromLine$1, "__esModule", { value: true });
  getDistanceFromLine$1.default = void 0;
  var _getDistance$4 = _interopRequireDefault$8(getDistance$2);
  var _robustAcos = _interopRequireDefault$8(robustAcos$1);
  function _interopRequireDefault$8(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getDistanceFromLine = function getDistanceFromLine2(point, lineStart, lineEnd) {
    var accuracy = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
    var d1 = (0, _getDistance$4.default)(lineStart, point, accuracy);
    var d2 = (0, _getDistance$4.default)(point, lineEnd, accuracy);
    var d3 = (0, _getDistance$4.default)(lineStart, lineEnd, accuracy);
    var alpha = Math.acos((0, _robustAcos.default)((d1 * d1 + d3 * d3 - d2 * d2) / (2 * d1 * d3)));
    var beta = Math.acos((0, _robustAcos.default)((d2 * d2 + d3 * d3 - d1 * d1) / (2 * d2 * d3)));
    if (alpha > Math.PI / 2) {
      return d1;
    }
    if (beta > Math.PI / 2) {
      return d2;
    }
    return Math.sin(alpha) * d1;
  };
  var _default$a = getDistanceFromLine;
  getDistanceFromLine$1.default = _default$a;
  var getGreatCircleBearing$1 = {};
  Object.defineProperty(getGreatCircleBearing$1, "__esModule", { value: true });
  getGreatCircleBearing$1.default = void 0;
  var _getLatitude$2 = _interopRequireDefault$7(getLatitude$1);
  var _getLongitude$2 = _interopRequireDefault$7(getLongitude$1);
  var _toRad$1 = _interopRequireDefault$7(toRad$1);
  var _toDeg = _interopRequireDefault$7(toDeg$1);
  function _interopRequireDefault$7(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getGreatCircleBearing = function getGreatCircleBearing2(origin, dest) {
    var destLat = (0, _getLatitude$2.default)(dest);
    var detLon = (0, _getLongitude$2.default)(dest);
    var originLat = (0, _getLatitude$2.default)(origin);
    var originLon = (0, _getLongitude$2.default)(origin);
    var bearing = ((0, _toDeg.default)(Math.atan2(Math.sin((0, _toRad$1.default)(detLon) - (0, _toRad$1.default)(originLon)) * Math.cos((0, _toRad$1.default)(destLat)), Math.cos((0, _toRad$1.default)(originLat)) * Math.sin((0, _toRad$1.default)(destLat)) - Math.sin((0, _toRad$1.default)(originLat)) * Math.cos((0, _toRad$1.default)(destLat)) * Math.cos((0, _toRad$1.default)(detLon) - (0, _toRad$1.default)(originLon)))) + 360) % 360;
    return bearing;
  };
  var _default$9 = getGreatCircleBearing;
  getGreatCircleBearing$1.default = _default$9;
  var getPathLength$1 = {};
  Object.defineProperty(getPathLength$1, "__esModule", { value: true });
  getPathLength$1.default = void 0;
  var _getDistance$3 = _interopRequireDefault$6(getDistance$2);
  function _interopRequireDefault$6(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof2(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function _typeof2(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  var getPathLength = function getPathLength2(points) {
    var distanceFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _getDistance$3.default;
    return points.reduce(function(acc, point) {
      if (_typeof(acc) === "object" && acc.last !== null) {
        acc.distance += distanceFn(point, acc.last);
      }
      acc.last = point;
      return acc;
    }, { last: null, distance: 0 }).distance;
  };
  var _default$8 = getPathLength;
  getPathLength$1.default = _default$8;
  var getPreciseDistance = {};
  Object.defineProperty(getPreciseDistance, "__esModule", { value: true });
  getPreciseDistance.default = void 0;
  var _getLatitude$1 = _interopRequireDefault$5(getLatitude$1);
  var _getLongitude$1 = _interopRequireDefault$5(getLongitude$1);
  var _toRad = _interopRequireDefault$5(toRad$1);
  var _constants = constants;
  function _interopRequireDefault$5(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getDistance2 = function getDistance3(start, end) {
    var accuracy = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    accuracy = typeof accuracy !== "undefined" && !isNaN(accuracy) ? accuracy : 1;
    var startLat = (0, _getLatitude$1.default)(start);
    var startLon = (0, _getLongitude$1.default)(start);
    var endLat = (0, _getLatitude$1.default)(end);
    var endLon = (0, _getLongitude$1.default)(end);
    var b = 6356752314245e-6;
    var ellipsoidParams = 1 / 298.257223563;
    var L = (0, _toRad.default)(endLon - startLon);
    var cosSigma;
    var sigma;
    var sinAlpha;
    var cosSqAlpha;
    var cos2SigmaM;
    var sinSigma;
    var U1 = Math.atan((1 - ellipsoidParams) * Math.tan((0, _toRad.default)(parseFloat(startLat))));
    var U2 = Math.atan((1 - ellipsoidParams) * Math.tan((0, _toRad.default)(parseFloat(endLat))));
    var sinU1 = Math.sin(U1);
    var cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2);
    var cosU2 = Math.cos(U2);
    var lambda = L;
    var lambdaP;
    var iterLimit = 100;
    do {
      var sinLambda = Math.sin(lambda);
      var cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt(cosU2 * sinLambda * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      if (sinSigma === 0) {
        return 0;
      }
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      if (isNaN(cos2SigmaM)) {
        cos2SigmaM = 0;
      }
      var C = ellipsoidParams / 16 * cosSqAlpha * (4 + ellipsoidParams * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * ellipsoidParams * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
    if (iterLimit === 0) {
      return NaN;
    }
    var uSq = cosSqAlpha * (_constants.earthRadius * _constants.earthRadius - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    var distance = b * A * (sigma - deltaSigma);
    return Math.round(distance / accuracy) * accuracy;
  };
  var _default$7 = getDistance2;
  getPreciseDistance.default = _default$7;
  var getRoughCompassDirection$1 = {};
  Object.defineProperty(getRoughCompassDirection$1, "__esModule", { value: true });
  getRoughCompassDirection$1.default = void 0;
  var getRoughCompassDirection = function getRoughCompassDirection2(exact) {
    if (/^(NNE|NE|NNW|N)$/.test(exact)) {
      return "N";
    }
    if (/^(ENE|E|ESE|SE)$/.test(exact)) {
      return "E";
    }
    if (/^(SSE|S|SSW|SW)$/.test(exact)) {
      return "S";
    }
    if (/^(WSW|W|WNW|NW)$/.test(exact)) {
      return "W";
    }
  };
  var _default$6 = getRoughCompassDirection;
  getRoughCompassDirection$1.default = _default$6;
  var getSpeed$1 = {};
  Object.defineProperty(getSpeed$1, "__esModule", { value: true });
  getSpeed$1.default = void 0;
  var _getDistance$2 = _interopRequireDefault$4(getDistance$2);
  function _interopRequireDefault$4(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var getSpeed = function getSpeed2(start, end) {
    var distanceFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _getDistance$2.default;
    var distance = distanceFn(start, end);
    var time = Number(end.time) - Number(start.time);
    var metersPerSecond = distance / time * 1e3;
    return metersPerSecond;
  };
  var _default$5 = getSpeed;
  getSpeed$1.default = _default$5;
  var isPointInLine$1 = {};
  Object.defineProperty(isPointInLine$1, "__esModule", { value: true });
  isPointInLine$1.default = void 0;
  var _getDistance$1 = _interopRequireDefault$3(getDistance$2);
  function _interopRequireDefault$3(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isPointInLine = function isPointInLine2(point, lineStart, lineEnd) {
    return (0, _getDistance$1.default)(lineStart, point) + (0, _getDistance$1.default)(point, lineEnd) === (0, _getDistance$1.default)(lineStart, lineEnd);
  };
  var _default$4 = isPointInLine;
  isPointInLine$1.default = _default$4;
  var isPointInPolygon$1 = {};
  Object.defineProperty(isPointInPolygon$1, "__esModule", { value: true });
  isPointInPolygon$1.default = void 0;
  var _getLatitude = _interopRequireDefault$2(getLatitude$1);
  var _getLongitude = _interopRequireDefault$2(getLongitude$1);
  function _interopRequireDefault$2(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isPointInPolygon = function isPointInPolygon2(point, polygon) {
    var isInside = false;
    var totalPolys = polygon.length;
    for (var i = -1, j = totalPolys - 1; ++i < totalPolys; j = i) {
      if (((0, _getLongitude.default)(polygon[i]) <= (0, _getLongitude.default)(point) && (0, _getLongitude.default)(point) < (0, _getLongitude.default)(polygon[j]) || (0, _getLongitude.default)(polygon[j]) <= (0, _getLongitude.default)(point) && (0, _getLongitude.default)(point) < (0, _getLongitude.default)(polygon[i])) && (0, _getLatitude.default)(point) < ((0, _getLatitude.default)(polygon[j]) - (0, _getLatitude.default)(polygon[i])) * ((0, _getLongitude.default)(point) - (0, _getLongitude.default)(polygon[i])) / ((0, _getLongitude.default)(polygon[j]) - (0, _getLongitude.default)(polygon[i])) + (0, _getLatitude.default)(polygon[i])) {
        isInside = !isInside;
      }
    }
    return isInside;
  };
  var _default$3 = isPointInPolygon;
  isPointInPolygon$1.default = _default$3;
  var isPointNearLine$1 = {};
  Object.defineProperty(isPointNearLine$1, "__esModule", { value: true });
  isPointNearLine$1.default = void 0;
  var _getDistanceFromLine = _interopRequireDefault$1(getDistanceFromLine$1);
  function _interopRequireDefault$1(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isPointNearLine = function isPointNearLine2(point, start, end, distance) {
    return (0, _getDistanceFromLine.default)(point, start, end) < distance;
  };
  var _default$2 = isPointNearLine;
  isPointNearLine$1.default = _default$2;
  var isPointWithinRadius$1 = {};
  Object.defineProperty(isPointWithinRadius$1, "__esModule", { value: true });
  isPointWithinRadius$1.default = void 0;
  var _getDistance = _interopRequireDefault(getDistance$2);
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var isPointWithinRadius = function isPointWithinRadius2(point, center, radius) {
    var accuracy = 0.01;
    return (0, _getDistance.default)(point, center, accuracy) < radius;
  };
  var _default$1 = isPointWithinRadius;
  isPointWithinRadius$1.default = _default$1;
  var wktToPolygon$1 = {};
  Object.defineProperty(wktToPolygon$1, "__esModule", { value: true });
  wktToPolygon$1.default = void 0;
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  var wktToPolygon = function wktToPolygon2(wkt) {
    if (!wkt.startsWith("POLYGON")) {
      throw new Error("Invalid wkt.");
    }
    var coordsText = wkt.slice(wkt.indexOf("(") + 2, wkt.indexOf(")")).split(", ");
    var polygon = coordsText.map(function(coordText) {
      var _coordText$split = coordText.split(" "), _coordText$split2 = _slicedToArray(_coordText$split, 2), longitude = _coordText$split2[0], latitude = _coordText$split2[1];
      return { longitude: parseFloat(longitude), latitude: parseFloat(latitude) };
    });
    return polygon;
  };
  var _default = wktToPolygon;
  wktToPolygon$1.default = _default;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var _exportNames = { computeDestinationPoint: true, convertArea: true, convertDistance: true, convertSpeed: true, decimalToSexagesimal: true, findNearest: true, getAreaOfPolygon: true, getBounds: true, getBoundsOfDistance: true, getCenter: true, getCenterOfBounds: true, getCompassDirection: true, getCoordinateKey: true, getCoordinateKeys: true, getDistance: true, getDistanceFromLine: true, getGreatCircleBearing: true, getLatitude: true, getLongitude: true, getPathLength: true, getPreciseDistance: true, getRhumbLineBearing: true, getRoughCompassDirection: true, getSpeed: true, isDecimal: true, isPointInLine: true, isPointInPolygon: true, isPointNearLine: true, isPointWithinRadius: true, isSexagesimal: true, isValidCoordinate: true, isValidLatitude: true, isValidLongitude: true, orderByDistance: true, sexagesimalToDecimal: true, toDecimal: true, toRad: true, toDeg: true, wktToPolygon: true };
    Object.defineProperty(exports, "computeDestinationPoint", { enumerable: true, get: function get() {
      return _computeDestinationPoint.default;
    } });
    Object.defineProperty(exports, "convertArea", { enumerable: true, get: function get() {
      return _convertArea.default;
    } });
    Object.defineProperty(exports, "convertDistance", { enumerable: true, get: function get() {
      return _convertDistance.default;
    } });
    Object.defineProperty(exports, "convertSpeed", { enumerable: true, get: function get() {
      return _convertSpeed.default;
    } });
    Object.defineProperty(exports, "decimalToSexagesimal", { enumerable: true, get: function get() {
      return _decimalToSexagesimal.default;
    } });
    Object.defineProperty(exports, "findNearest", { enumerable: true, get: function get() {
      return _findNearest.default;
    } });
    Object.defineProperty(exports, "getAreaOfPolygon", { enumerable: true, get: function get() {
      return _getAreaOfPolygon.default;
    } });
    Object.defineProperty(exports, "getBounds", { enumerable: true, get: function get() {
      return _getBounds2.default;
    } });
    Object.defineProperty(exports, "getBoundsOfDistance", { enumerable: true, get: function get() {
      return _getBoundsOfDistance.default;
    } });
    Object.defineProperty(exports, "getCenter", { enumerable: true, get: function get() {
      return _getCenter.default;
    } });
    Object.defineProperty(exports, "getCenterOfBounds", { enumerable: true, get: function get() {
      return _getCenterOfBounds.default;
    } });
    Object.defineProperty(exports, "getCompassDirection", { enumerable: true, get: function get() {
      return _getCompassDirection.default;
    } });
    Object.defineProperty(exports, "getCoordinateKey", { enumerable: true, get: function get() {
      return _getCoordinateKey2.default;
    } });
    Object.defineProperty(exports, "getCoordinateKeys", { enumerable: true, get: function get() {
      return _getCoordinateKeys3.default;
    } });
    Object.defineProperty(exports, "getDistance", { enumerable: true, get: function get() {
      return _getDistance2.default;
    } });
    Object.defineProperty(exports, "getDistanceFromLine", { enumerable: true, get: function get() {
      return _getDistanceFromLine2.default;
    } });
    Object.defineProperty(exports, "getGreatCircleBearing", { enumerable: true, get: function get() {
      return _getGreatCircleBearing.default;
    } });
    Object.defineProperty(exports, "getLatitude", { enumerable: true, get: function get() {
      return _getLatitude2.default;
    } });
    Object.defineProperty(exports, "getLongitude", { enumerable: true, get: function get() {
      return _getLongitude2.default;
    } });
    Object.defineProperty(exports, "getPathLength", { enumerable: true, get: function get() {
      return _getPathLength.default;
    } });
    Object.defineProperty(exports, "getPreciseDistance", { enumerable: true, get: function get() {
      return _getPreciseDistance.default;
    } });
    Object.defineProperty(exports, "getRhumbLineBearing", { enumerable: true, get: function get() {
      return _getRhumbLineBearing2.default;
    } });
    Object.defineProperty(exports, "getRoughCompassDirection", { enumerable: true, get: function get() {
      return _getRoughCompassDirection.default;
    } });
    Object.defineProperty(exports, "getSpeed", { enumerable: true, get: function get() {
      return _getSpeed.default;
    } });
    Object.defineProperty(exports, "isDecimal", { enumerable: true, get: function get() {
      return _isDecimal2.default;
    } });
    Object.defineProperty(exports, "isPointInLine", { enumerable: true, get: function get() {
      return _isPointInLine.default;
    } });
    Object.defineProperty(exports, "isPointInPolygon", { enumerable: true, get: function get() {
      return _isPointInPolygon.default;
    } });
    Object.defineProperty(exports, "isPointNearLine", { enumerable: true, get: function get() {
      return _isPointNearLine.default;
    } });
    Object.defineProperty(exports, "isPointWithinRadius", { enumerable: true, get: function get() {
      return _isPointWithinRadius.default;
    } });
    Object.defineProperty(exports, "isSexagesimal", { enumerable: true, get: function get() {
      return _isSexagesimal2.default;
    } });
    Object.defineProperty(exports, "isValidCoordinate", { enumerable: true, get: function get() {
      return _isValidCoordinate2.default;
    } });
    Object.defineProperty(exports, "isValidLatitude", { enumerable: true, get: function get() {
      return _isValidLatitude2.default;
    } });
    Object.defineProperty(exports, "isValidLongitude", { enumerable: true, get: function get() {
      return _isValidLongitude2.default;
    } });
    Object.defineProperty(exports, "orderByDistance", { enumerable: true, get: function get() {
      return _orderByDistance2.default;
    } });
    Object.defineProperty(exports, "sexagesimalToDecimal", { enumerable: true, get: function get() {
      return _sexagesimalToDecimal2.default;
    } });
    Object.defineProperty(exports, "toDecimal", { enumerable: true, get: function get() {
      return _toDecimal2.default;
    } });
    Object.defineProperty(exports, "toRad", { enumerable: true, get: function get() {
      return _toRad2.default;
    } });
    Object.defineProperty(exports, "toDeg", { enumerable: true, get: function get() {
      return _toDeg2.default;
    } });
    Object.defineProperty(exports, "wktToPolygon", { enumerable: true, get: function get() {
      return _wktToPolygon.default;
    } });
    var _computeDestinationPoint = _interopRequireDefault2(computeDestinationPoint$1);
    var _convertArea = _interopRequireDefault2(convertArea$1);
    var _convertDistance = _interopRequireDefault2(convertDistance$1);
    var _convertSpeed = _interopRequireDefault2(convertSpeed$1);
    var _decimalToSexagesimal = _interopRequireDefault2(decimalToSexagesimal);
    var _findNearest = _interopRequireDefault2(findNearest$1);
    var _getAreaOfPolygon = _interopRequireDefault2(getAreaOfPolygon$1);
    var _getBounds2 = _interopRequireDefault2(getBounds$1);
    var _getBoundsOfDistance = _interopRequireDefault2(getBoundsOfDistance$1);
    var _getCenter = _interopRequireDefault2(getCenter$1);
    var _getCenterOfBounds = _interopRequireDefault2(getCenterOfBounds$1);
    var _getCompassDirection = _interopRequireDefault2(getCompassDirection$1);
    var _getCoordinateKey2 = _interopRequireDefault2(getCoordinateKey$1);
    var _getCoordinateKeys3 = _interopRequireDefault2(getCoordinateKeys$1);
    var _getDistance2 = _interopRequireDefault2(getDistance$2);
    var _getDistanceFromLine2 = _interopRequireDefault2(getDistanceFromLine$1);
    var _getGreatCircleBearing = _interopRequireDefault2(getGreatCircleBearing$1);
    var _getLatitude2 = _interopRequireDefault2(getLatitude$1);
    var _getLongitude2 = _interopRequireDefault2(getLongitude$1);
    var _getPathLength = _interopRequireDefault2(getPathLength$1);
    var _getPreciseDistance = _interopRequireDefault2(getPreciseDistance);
    var _getRhumbLineBearing2 = _interopRequireDefault2(getRhumbLineBearing$1);
    var _getRoughCompassDirection = _interopRequireDefault2(getRoughCompassDirection$1);
    var _getSpeed = _interopRequireDefault2(getSpeed$1);
    var _isDecimal2 = _interopRequireDefault2(isDecimal$1);
    var _isPointInLine = _interopRequireDefault2(isPointInLine$1);
    var _isPointInPolygon = _interopRequireDefault2(isPointInPolygon$1);
    var _isPointNearLine = _interopRequireDefault2(isPointNearLine$1);
    var _isPointWithinRadius = _interopRequireDefault2(isPointWithinRadius$1);
    var _isSexagesimal2 = _interopRequireDefault2(isSexagesimal$1);
    var _isValidCoordinate2 = _interopRequireDefault2(isValidCoordinate$1);
    var _isValidLatitude2 = _interopRequireDefault2(isValidLatitude$1);
    var _isValidLongitude2 = _interopRequireDefault2(isValidLongitude$1);
    var _orderByDistance2 = _interopRequireDefault2(orderByDistance$1);
    var _sexagesimalToDecimal2 = _interopRequireDefault2(sexagesimalToDecimal$1);
    var _toDecimal2 = _interopRequireDefault2(toDecimal$1);
    var _toRad2 = _interopRequireDefault2(toRad$1);
    var _toDeg2 = _interopRequireDefault2(toDeg$1);
    var _wktToPolygon = _interopRequireDefault2(wktToPolygon$1);
    var _constants2 = constants;
    Object.keys(_constants2).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
      Object.defineProperty(exports, key, { enumerable: true, get: function get() {
        return _constants2[key];
      } });
    });
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  })(es);
  function coordinateValidator(value) {
    return value.length == 2 && value.every((i) => typeof i === "number");
  }
  const __vue2_script$1 = {
    props: {
      value: {
        type: Array,
        validator: coordinateValidator,
        default: [0, 0]
      },
      center: {
        type: Array,
        validator: coordinateValidator,
        required: true
      },
      maxDistance: {
        type: Number,
        required: true
      },
      size: {
        type: Number,
        default: 50
      }
    },
    data() {
      return {
        offset: [0, 0],
        updating: false,
        isDown: false
      };
    },
    computed: {
      ctx() {
        return this.cvs.getContext("2d");
      },
      cvs() {
        return this.$refs.cvs;
      },
      drawData() {
        return {
          size: this.size,
          center: this.size >>> 1,
          circleRadius: (this.size >>> 1) * 0.8,
          lineUnit: this.size >>> 6
        };
      },
      centerWgs() {
        return bd2wgs(...this.center);
      }
    },
    methods: {
      mouseDown(e) {
        this.isDown = true;
        this.setPoint(e.offsetX, e.offsetY);
      },
      mouseUp(e) {
        this.isDown = false;
        this.setPoint(e.offsetX, e.offsetY);
      },
      mouseMove(e) {
        if (this.isDown) {
          this.setPoint(e.offsetX, e.offsetY);
        }
      },
      setPoint(x, y) {
        const { center, circleRadius } = this.drawData;
        const maxDistance = this.maxDistance;
        let offsetX = x - center;
        let offsetY = y - center;
        let distance = Math.hypot(offsetX, offsetY);
        const angle = Math.atan2(offsetY, offsetX);
        if (distance > circleRadius) {
          offsetX = Math.cos(angle) * maxDistance;
          offsetY = Math.sin(angle) * maxDistance;
          distance = maxDistance;
        } else {
          offsetX *= maxDistance / circleRadius;
          offsetY *= maxDistance / circleRadius;
          distance *= maxDistance / circleRadius;
        }
        this.offset = [offsetX, offsetY];
        const [centerLng, centerLat] = this.centerWgs;
        const { latitude, longitude } = es.computeDestinationPoint(
          {
            longitude: centerLng,
            latitude: centerLat
          },
          distance,
          -angle * 180 / Math.PI
        );
        this.updating = true;
        this.$emit("input", wgs2bd(longitude, latitude));
        this.updating = false;
      },
      setCoordinate(lng, lat) {
        const [longitude, latitude] = this.centerWgs;
        const centerPoint = {
          longitude,
          latitude
        };
        const destPoint = {
          longitude: lng,
          latitude: lat
        };
        const angle = -es.getGreatCircleBearing(centerPoint, destPoint) * Math.PI / 180;
        const distance = Math.min(
          this.maxDistance,
          es.getDistance(centerPoint, destPoint)
        );
        this.offset = [
          Math.cos(angle) * distance,
          Math.sin(angle) * distance
        ];
      },
      drawBackground() {
        const { size, center, circleRadius, lineUnit } = this.drawData;
        const ctx = this.ctx;
        ctx.reset();
        ctx.beginPath();
        ctx.arc(center, center, circleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = lineUnit;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center, center, lineUnit, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
      },
      drawPoint(x, y) {
        const { lineUnit } = this.drawData;
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, lineUnit * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = "red";
        ctx.lineWidth = lineUnit >>> 1;
        ctx.stroke();
      },
      random() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.maxDistance;
        this.offset = [
          Math.cos(angle) * distance,
          Math.sin(angle) * distance
        ];
        const [centerLng, centerLat] = this.centerWgs;
        const { latitude, longitude } = es.computeDestinationPoint(
          {
            longitude: centerLng,
            latitude: centerLat
          },
          distance,
          -angle * 180 / Math.PI
        );
        this.updating = true;
        this.$emit("input", wgs2bd(longitude, latitude));
        this.updating = false;
      }
    },
    watch: {
      offset(offset) {
        this.drawBackground();
        const { center, circleRadius } = this.drawData;
        const distance = this.maxDistance;
        const [offsetX, offsetY] = offset;
        const x = center + offsetX * circleRadius / distance;
        const y = center + offsetY * circleRadius / distance;
        this.drawPoint(x, y);
      },
      value: {
        handler(coordinate) {
          this.updating || this.setCoordinate(...bd2wgs(...coordinate));
        },
        immediate: true
      }
    }
  };
  var render$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("canvas", {
      ref: "cvs",
      attrs: {
        "width": _vm.size,
        "height": _vm.size
      },
      on: {
        "mousedown": _vm.mouseDown,
        "mouseup": _vm.mouseUp,
        "mousemove": _vm.mouseMove
      }
    });
  };
  var staticRenderFns$1 = [];
  function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render2) {
      options.render = render2;
      options.staticRenderFns = staticRenderFns2;
      options._compiled = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    var hook;
    if (injectStyles) {
      hook = injectStyles;
    }
    if (hook) {
      if (options.functional) {
        options._injectStyles = hook;
        var originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const __cssModules$1 = {};
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    __vue2_script$1,
    render$1,
    staticRenderFns$1,
    false,
    __vue2_injectStyles$1,
    null
  );
  function __vue2_injectStyles$1(context) {
    for (let o in __cssModules$1) {
      this[o] = __cssModules$1[o];
    }
  }
  const Map = /* @__PURE__ */ function() {
    return __component__$1.exports;
  }();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const __vue2_script = {
    components: {
      Map
    },
    props: {
      instance: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        selected: 0,
        checkinCoordinate: [0, 0],
        address: ""
      };
    },
    computed: {
      ready() {
        return this.selectedPosition != void 0 && this.checkinCoordinate.every((i) => i != 0);
      },
      centerCoordinate() {
        var _a, _b;
        return [Number(((_a = this.selectedPosition) == null ? void 0 : _a.JDZB) ?? 0), Number(((_b = this.selectedPosition) == null ? void 0 : _b.WDZB) ?? 0)];
      },
      selectedPosition() {
        var _a;
        return (_a = this.instance) == null ? void 0 : _a.ddList[this.selected];
      }
    },
    methods: {
      async checkin() {
        if (!this.ready) {
          return;
        }
        const params = {
          KQWZXX: this.address,
          JDZB: this.checkinCoordinate[0],
          WDZB: this.checkinCoordinate[1]
        };
        await MOB_UTIL.doPost({
          url: (await requireAsync(["api"])).addKqInfo,
          params
        });
        this.instance.dkDialogShow = true;
        this.instance.getKqInfo();
      },
      save() {
        _GM_setValue("position", this.selectedPosition.DDDM);
        _GM_setValue("coordinate", this.checkinCoordinate);
        _GM_setValue("address", this.address);
      },
      load() {
        const i = this.instance.ddList.findIndex((p) => p.DDDM === _GM_getValue("position"));
        if (i) {
          this.selected = i;
          const address = _GM_getValue("address");
          if (address) {
            this.address = address;
          }
          setTimeout(() => this.checkinCoordinate = _GM_getValue("coordinate"));
        }
      },
      random() {
        var _a;
        (_a = this.$refs.map) == null ? void 0 : _a.random();
      }
    },
    watch: {
      selectedPosition(newPoint, oldPoint) {
        if (newPoint) {
          this.checkinCoordinate = [Number(newPoint.JDZB), Number(newPoint.WDZB)];
          if (!oldPoint || !this.address || oldPoint.QDDD === this.address) {
            this.address = newPoint.QDDD;
          }
        }
      }
    }
  };
  var render = function() {
    var _vm$selectedPosition$, _vm$selectedPosition, _vm$selectedPosition2, _vm$selectedPosition3, _vm$selectedPosition4;
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "root"
    }, [_vm._m(0), _c("div", {
      staticClass: "map-box"
    }, [_c("Map", {
      ref: "map",
      attrs: {
        "maxDistance": (_vm$selectedPosition$ = (_vm$selectedPosition = _vm.selectedPosition) === null || _vm$selectedPosition === void 0 ? void 0 : _vm$selectedPosition.YXFW) !== null && _vm$selectedPosition$ !== void 0 ? _vm$selectedPosition$ : 0,
        "center": _vm.centerCoordinate,
        "size": 400
      },
      model: {
        value: _vm.checkinCoordinate,
        callback: function($$v) {
          _vm.checkinCoordinate = $$v;
        },
        expression: "checkinCoordinate"
      }
    })], 1), _c("div", {
      staticClass: "box"
    }, [_c("table", [_c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(1), _c("td", [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.selected,
        expression: "selected"
      }],
      staticClass: "xg-multi-selectv2",
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected;
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.selected = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
        }
      }
    }, _vm._l(_vm.instance.ddList, function(item, i) {
      return _c("option", {
        key: item.DDDM,
        staticClass: "van-cell",
        domProps: {
          "value": i
        }
      }, [_vm._v(_vm._s(item.QDDD) + " ")]);
    }), 0)])]), _c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(2), _c("td", [_c("span", {
      staticClass: "xg-text-color--title"
    }, [_vm._v(_vm._s((_vm$selectedPosition2 = _vm.selectedPosition) === null || _vm$selectedPosition2 === void 0 ? void 0 : _vm$selectedPosition2.JDZB))])])]), _c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(3), _c("td", [_c("span", {
      staticClass: "xg-text-color--title"
    }, [_vm._v(_vm._s((_vm$selectedPosition3 = _vm.selectedPosition) === null || _vm$selectedPosition3 === void 0 ? void 0 : _vm$selectedPosition3.WDZB))])])]), _c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(4), _c("td", [_c("span", {
      staticClass: "xg-text-color--title"
    }, [_vm._v(_vm._s((_vm$selectedPosition4 = _vm.selectedPosition) === null || _vm$selectedPosition4 === void 0 ? void 0 : _vm$selectedPosition4.YXFW))])])])]), _c("table", [_c("tr", {
      staticClass: "xg-font-maintext"
    }, [_c("td", {
      attrs: {
        "colspan": "2"
      }
    }, [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("当前位置")]), _c("i", {
      staticClass: "xg-text-color--primary van-icon van-icon-replay",
      on: {
        "click": _vm.random
      }
    })])]), _c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(5), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.address,
        expression: "address"
      }],
      attrs: {
        "type": "text"
      },
      domProps: {
        "value": _vm.address
      },
      on: {
        "input": function($event) {
          if ($event.target.composing) return;
          _vm.address = $event.target.value;
        }
      }
    })])]), _c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(6), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.checkinCoordinate[0],
        expression: "checkinCoordinate[0]",
        modifiers: {
          "number": true
        }
      }],
      attrs: {
        "type": "number",
        "max": "137.8347",
        "min": "72.004"
      },
      domProps: {
        "value": _vm.checkinCoordinate[0]
      },
      on: {
        "input": function($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.checkinCoordinate, 0, _vm._n($event.target.value));
        },
        "blur": function($event) {
          return _vm.$forceUpdate();
        }
      }
    })])]), _c("tr", {
      staticClass: "xg-font-maintext"
    }, [_vm._m(7), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.checkinCoordinate[1],
        expression: "checkinCoordinate[1]",
        modifiers: {
          "number": true
        }
      }],
      attrs: {
        "type": "number",
        "max": "55.8271",
        "min": "0.8293"
      },
      domProps: {
        "value": _vm.checkinCoordinate[1]
      },
      on: {
        "input": function($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.checkinCoordinate, 1, _vm._n($event.target.value));
        },
        "blur": function($event) {
          return _vm.$forceUpdate();
        }
      }
    })])])]), _c("div", {
      staticClass: "buttons"
    }, [_c("div", {
      staticClass: "van-button van-button--default van-button--normal",
      class: _vm.selectedPosition ? "" : "van-button--disabled",
      attrs: {
        "disabled": !_vm.selectedPosition
      },
      on: {
        "click": _vm.save
      }
    }, [_vm._m(8)]), _c("div", {
      staticClass: "van-button van-button--default van-button--normal",
      class: _vm.instance.ddList.length ? "" : "van-button--disabled",
      attrs: {
        "disabled": !_vm.instance.ddList.length
      },
      on: {
        "click": _vm.load
      }
    }, [_vm._m(9)]), _c("div", {
      staticClass: "van-button van-button--primary van-button--normal",
      class: _vm.ready ? "" : "van-button--disabled",
      attrs: {
        "disabled": !_vm.ready
      },
      on: {
        "click": _vm.checkin
      }
    }, [_vm._m(10)])])])]);
  };
  var staticRenderFns = [function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "xg-flex-SC"
    }, [_c("div", {
      staticClass: "xg-font-title-3 xg-text-color--title",
      staticStyle: {
        "flex": "1 1 0%"
      }
    }, [_vm._v("强制签到")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("签到点")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("经度")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("维度")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("半径")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("地点")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("经度")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("td", [_c("span", {
      staticClass: "xg-text-color--minor",
      staticStyle: {
        "margin-right": "8px"
      }
    }, [_vm._v("维度")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "van-button__content"
    }, [_c("span", {
      staticClass: "van-button__text"
    }, [_vm._v("保存")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "van-button__content"
    }, [_c("span", {
      staticClass: "van-button__text"
    }, [_vm._v("加载")])]);
  }, function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "van-button__content"
    }, [_c("span", {
      staticClass: "van-button__text"
    }, [_vm._v("签到")])]);
  }];
  const __cssModules = {};
  var __component__ = /* @__PURE__ */ normalizeComponent(
    __vue2_script,
    render,
    staticRenderFns,
    false,
    __vue2_injectStyles,
    "542b7bae"
  );
  function __vue2_injectStyles(context) {
    for (let o in __cssModules) {
      this[o] = __cssModules[o];
    }
  }
  const App = /* @__PURE__ */ function() {
    return __component__.exports;
  }();
  if (location.pathname.endsWith("*default/index.do")) {
    const el = document.createElement("div");
    document.body.append(el);
    const app = new Vue({
      render(h) {
        var _a;
        return ((_a = this.instance) == null ? void 0 : _a.ddList.length) ? h(App, {
          props: {
            instance: this.instance
          }
        }) : h();
      },
      data: {
        instance: null
      },
      el
    });
    const modulePath = "newmob/xscq/kqqd/dwdk/dwdk";
    const _define = typeof define === "function" ? define : unsafeWindow.define;
    require([modulePath], function(_module) {
      require.undef(modulePath);
      _define(
        modulePath,
        () => function() {
          const component = _module.apply(
            this,
            arguments
          );
          component.mounted = function() {
            if (this.$route.path === "/xscq/kqqdx") {
              app.instance = this;
              this.$watch("ddList", () => app.$forceUpdate());
            }
          };
          component.destroyed = () => app.instance = null;
          return component;
        }
      );
    });
  }

})(PRCoords);