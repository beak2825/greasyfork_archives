// ==UserScript==
// @name        IITC plugin: IITC Agent Track Plugin
// @version     0.0.3
// @author      Odrick
// @description IITC Agent Track Plugin
// @match       https://*.ingress.com/*
// @match       http://*.ingress.com/*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-agent-track-plugin
// @category    Layer
// @license     MIT
// @include     https://*.ingress.com/*
// @include     http://*.ingress.com/*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/431060/IITC%20plugin%3A%20IITC%20Agent%20Track%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/431060/IITC%20plugin%3A%20IITC%20Agent%20Track%20Plugin.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(4);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(5);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ui_main_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _ui_main_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ui_main_html__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui_main_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _ui_main_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_main_css__WEBPACK_IMPORTED_MODULE_1__);



function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  plugin_info.buildName = 'IITC Agent Track';
  plugin_info.dateTimeVersion = '20210719104518';
  plugin_info.pluginId = 'iitc-agent-track-plugin';
  var layer = null;
  var popup = null;
  var e = {}; ////////////////////////////////////////

  window.plugin.agentTrack = e;

  function parseGet() {
    var get = {};
    var s = window.location.toString();
    var p = window.location.toString().indexOf("?");
    var tmp, params;

    if (p >= 0) {
      s = s.substr(p + 1, s.length);
      params = s.split("&");

      for (i = 0; i < params.length; i++) {
        var item = params[i];
        tmp = item.split("=");
        get[tmp[0]] = tmp[1];
      }
    }

    return get;
  }

  function start() {
    var get = parseGet();
    var data = get.t;

    if (data) {
      data = data.split('-');
      var list = [];

      for (var _i = 0; _i < data.length; _i += 3) {
        if (!data[_i]) continue;
        list.push({
          timestamp: (parseInt(data[_i]) + 1629200000) * 1000,
          lat: parseInt(data[_i + 1]) / 1e6,
          lng: parseInt(data[_i + 2]) / 1e6
        });
      }

      if (list.length) {
        render(list);
      }
    }
  }

  function toRad(val) {
    return val * Math.PI / 180;
  }

  function calcDistance(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  function render(list) {
    layer.clearLayers();
    if (!list.length) return;
    var first = list[0];
    window.map.setView(new L.LatLng(first.lat, first.lng), 16);
    var prev = null;

    for (var _i2 = 0; _i2 < list.length; _i2++) {
      var p = list[_i2];

      if (prev) {
        var distace = calcDistance(p.lat, p.lng, prev.lat, prev.lng);
        var time = (p.timestamp - prev.timestamp) / 1000 / 60 / 60;
        var speed = time > 0 ? distace / time : 1000;
        var color = "#33aa33";

        if (distace >= 0.1) {
          if (speed > 6 && speed <= 10) color = "#cccc33";else if (speed > 10) color = "#aa3333";
        }

        var line = L.polyline([new L.LatLng(prev.lat, prev.lng), new L.LatLng(p.lat, p.lng)], {
          color: color,
          opacity: 1,
          weight: 7,
          fill: false,
          interactive: true,
          clickable: true,
          info: {
            distace: distace,
            time: time,
            speed: speed,
            from: prev.timestamp,
            to: p.timestamp
          }
        }).addTo(layer);
        line.addEventListener('click', onLineClick);
      }

      prev = p;
    }

    L.circleMarker(new L.LatLng(first.lat, first.lng), {
      color: "#993333",
      opacity: 1,
      weight: 5,
      fill: true,
      dashArray: '5, 5',
      interactive: false,
      clickable: false,
      radius: 14
    }).addTo(layer);

    if (list.length > 1) {
      var last = list[list.length - 1];
      L.circleMarker(new L.LatLng(last.lat, last.lng), {
        color: "#333399",
        opacity: 1,
        weight: 5,
        fill: true,
        dashArray: '5, 5',
        interactive: false,
        clickable: false,
        radius: 14
      }).addTo(layer);
    }
  }

  function formatDate(timetsamp) {
    var d = new Date(timetsamp);
    var year = d.getFullYear();
    var month = d.getMonth();
    if (month < 10) month = '0' + month;
    var date = d.getDate();
    if (date < 10) date = '0' + date;
    var hours = d.getHours();
    if (hours < 10) hours = '0' + hours;
    var minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    var seconds = d.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    return hours + ':' + minutes + ':' + seconds;
  }

  function onLineClick(e) {
    var info = e.target.options.info;
    var content = '';
    content += "\u0421 <span style=\"color: #fff\">".concat(formatDate(info.from), "</span><br/>");
    content += "\u041F\u043E <span style=\"color: #fff\">".concat(formatDate(info.to), "</span><br/>");
    content += "\u0420\u0430\u0441\u0441\u0442\u043E\u044F\u043D\u0438\u0435: <span style=\"color: #fff\">".concat(info.distace.toFixed(2), " \u043A\u043C</span><br/>");
    content += "\u0412\u0440\u0435\u043C\u044F: <span style=\"color: #fff\">".concat((info.time * 60).toFixed(2), " \u043C\u0438\u043D</span><br/>");
    content += "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C: <span style=\"color: #fff\">".concat(info.speed.toFixed(2), " \u043A\u043C/\u0447</span>");
    popup.setContent(content);
    popup.setLatLng(e.latlng);
    map.openPopup(popup);
  }

  function bringToFront() {
    window.map.removeLayer(layer);
    window.map.addLayer(layer);
  }

  function setup() {
    $('<style>').prop('type', 'text/css').html(plugin_info.css).appendTo('head');
    $('body').append(plugin_info.ui);
    layer = new L.LayerGroup();
    window.addLayerGroup('Agent Track', layer, true);
    window.plugin.agentTrack.layer = layer;
    popup = new L.Popup({
      offset: L.point([0, -4]),
      maxWidth: 600
    });
    window.plugin.agentTrack.popup = popup;
    start();
    setInterval(bringToFront, 5000);
  }

  setup.info = plugin_info;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};
info.ui = _ui_main_html__WEBPACK_IMPORTED_MODULE_0___default.a;
info.css = _ui_main_css__WEBPACK_IMPORTED_MODULE_1___default.a;

if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

var textContent = document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ })
/******/ ]);