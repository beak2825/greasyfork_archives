// ==UserScript==
// @name        IITC plugin: Cell score graph plugin
// @version     0.0.1
// @author      Odr1ck
// @description Cell score graph plugin
// @match       https://*.ingress.com/*
// @match       http://*.ingress.com/*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-plugin-cell-score
// @category    Misc
// @license     MIT
// @include     https://*.ingress.com/*
// @include     http://*.ingress.com/*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/438469/IITC%20plugin%3A%20Cell%20score%20graph%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/438469/IITC%20plugin%3A%20Cell%20score%20graph%20plugin.meta.js
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

        if (result && result.__esModule) {
            result = result.default;
        }

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(5);

        if (result && result.__esModule) {
            result = result.default;
        }

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
  plugin_info.buildName = 'Cell Score';
  plugin_info.dateTimeVersion = '20220013115848';
  plugin_info.pluginId = 'iitc-plugin-cell-score';
  var e = {};
  var logo = new Image();
  logo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaAQMAAAACZtNBAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAaNJREFUOMuV1EFq6zAQBuAReqAuHk8XENU13iJU18pOzqqXCPQqMl30FKUKvcBANyqoUkeayHLponQCcT6L8MfxL8MPY/Zwe9RlfpY1Tui3NGHXMuHpNUZksGFApb8KB3S8k3mLXOpSBoqo0V1jZVYVdWQotDWrxLDBn73II7IYOsGRRSajkWNl0tHQG3KkCwZo+RoJBhzHVpEJtseKrJBAYYGANhLoXAOtE8CLjgINbm14TXxRlw7skIzQIX5EbbPucbrCf8P4jqPDBIIsAzaBzhsKuA2arvw4oB4ueeK+Ig7Ita4TwZ/igKA7FzagmQA0atlw/AoNGw7G7nG74ebWHP4M/Lfm8G8ga3O0J8ZjUuejvjCeojqjfGe8BPmM8MGovbCekUHUAJaBHYqReskZlwLgF6pzQ/SEcbdbG1zrVkNSCHdUZ02gPrXuaK5s65Pp3aJpfbpp3eLy6sjdoqFj4oa18X2X+KXDUY09t5Iby33lLr9RnRkUW2nxCr9Ubj/vDMeRHGsU7ndjnFubfucGx5E8+jVNyIoT7X+b478+Q34zn/dfSp2/U9a6AAAAAElFTkSuQmCC";
  var dialogID = "cell-score-ui";
  var canvasID = "cell-score-canvas";
  var canvasWidth = 960;
  var canvasHeight = 500;
  var EPOCH = 1389150000000;
  var CYCLE_LENGTH = 630000000;
  var CHECKPOINT_LENGTH = 18000000; ////////////////////////////////////////

  e.toggleBox = function () {
    var scale = 0.58;
    var html = "<canvas width=\"".concat(canvasWidth, "\" height=\"").concat(canvasHeight, "\" id=\"").concat(canvasID, "\" style=\"width: ").concat(canvasWidth * scale, "px; height: ").concat(canvasHeight * scale, "px\"></canvas>");
    dialog({
      html: html,
      title: 'Cell score',
      width: "auto",
      id: dialogID
    });
    var center = window.map.getCenter();
    latE6 = Math.floor(center.lat * 1e6);
    lngE6 = Math.floor(center.lng * 1e6);
    window.postAjax('getRegionScoreDetails', {
      latE6: latE6,
      lngE6: lngE6
    }, draw);
  };

  var getCurrentCycleNumber = function getCurrentCycleNumber() {
    return Math.floor((Date.now() - EPOCH) / CYCLE_LENGTH);
  };

  var getCycleNumber = function getCycleNumber(date) {
    return Math.floor((date.getTime() - EPOCH) / CYCLE_LENGTH);
  };

  var getCurrentCycle = function getCurrentCycle() {
    var timezone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var cycle = getCurrentCycleNumber();
    return calcCycle(cycle, timezone);
  };

  var calcCycle = function calcCycle(cycle) {
    var timezone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var start = new Date();
    var currentOffest = start.getTimezoneOffset();
    var diff = currentOffest - timezone * 60 * -1;
    diff = diff * 60 * 1000;
    var now = start.getTime();
    var localNow = new Date(now + diff);
    var cycleDisplay = cycle + 1;
    start.setTime(EPOCH + cycle * CYCLE_LENGTH);
    year = start.getFullYear();
    start.setTime(start.getTime() + CHECKPOINT_LENGTH);
    var checkpoints = [];
    var naturalCheckpoints = [];
    var nextCp = null;

    for (var i = 0; i < 35; i++) {
      var next = isNext(start, now);
      var d = new Date(start.getTime() + diff);
      var item = {
        id: i,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
        hours: d.getHours(),
        minutes: d.getMinutes(),
        day: d.getDay(),
        status: next ? 'next' : start.getTime() < now ? 'past' : 'upcoming',
        "final": i == 34,
        fake: false,
        diff: d.getTime() - localNow.getTime(),
        next: next
      };
      if (next) nextCp = item;
      checkpoints.push(item);
      naturalCheckpoints.push(item);

      if (d.getHours() === 0) {
        var last = checkpoints.pop();

        var _d = new Date(start.getTime() - 60000 + diff);

        checkpoints.push({
          id: i,
          year: _d.getFullYear(),
          month: _d.getMonth() + 1,
          date: _d.getDate(),
          hours: 24,
          minutes: 0,
          day: _d.getDay(),
          status: last.status,
          "final": last["final"],
          fake: true,
          diff: last.diff,
          next: last.next
        });
        checkpoints.push(last);
      }

      start.setTime(start.getTime() + CHECKPOINT_LENGTH);
    }

    if (year > 2014) {
      var yearEnd = new Date(year - 1, 11, 31, 23, 59);
      var lastCycle = Math.floor((yearEnd.getTime() - EPOCH) / CYCLE_LENGTH);
      cycleDisplay = cycle - lastCycle;
    }

    if (cycleDisplay < 10) {
      cycleDisplay = '0' + cycleDisplay;
    }

    return {
      cycle: year + '.' + cycleDisplay,
      cycleId: parseInt(cycleDisplay),
      checkpoints: checkpoints,
      naturalCheckpoints: naturalCheckpoints,
      nextCheckPoint: nextCp,
      localDate: {
        year: localNow.getFullYear(),
        month: localNow.getMonth() + 1,
        date: localNow.getDate(),
        hours: localNow.getHours(),
        minutes: localNow.getMinutes(),
        day: localNow.getDay()
      }
    };
  };

  var isNext = function isNext(start, now) {
    return start.getTime() > now && now + CHECKPOINT_LENGTH > start.getTime();
  };

  var draw = function draw(data) {
    var date = new Date();
    var cycleData = getCurrentCycle(-(date.getTimezoneOffset() / 60));
    var width = canvasWidth;
    var height = canvasHeight;
    var resColor = '#3b8bff';
    var enlColor = '#03e500';
    var fontFamily = '-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif';
    var cns = $("#".concat(canvasID))[0];
    var ctx = cns.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    var leftSpace = 70;
    var rightSpace = 20;
    var topSpace = 110;
    var bottomSpace = 40;
    var cw = (width - leftSpace - rightSpace) / 35;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#818181";
    var cpPoints = [];

    for (var c = 0; c < 35; c++) {
      var x = Math.floor(leftSpace + c * cw + 5);
      cpPoints[c] = x;
      ctx.beginPath();
      ctx.moveTo(x, topSpace);
      ctx.lineTo(x, height - bottomSpace);
      ctx.stroke();
      ctx.save();
      ctx.translate(x, height - bottomSpace + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 14px " + fontFamily;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(c + 1 + '', 0, 0);
      ctx.restore();
    }

    var score = data.result.scoreHistory.sort(function (a, b) {
      var av = parseInt(a[0]);
      var bv = parseInt(b[0]);
      if (av > bv) return 1;
      if (av < bv) return -1;
      return 0;
    });
    var max = Number.MIN_VALUE;

    for (var i = 0; i < score.length; i++) {
      var item = score[i];
      item[0] = parseInt(item[0]);
      item[1] = parseInt(item[1]);
      item[2] = parseInt(item[2]);
      if (item[1] > max) max = item[1];
      if (item[2] > max) max = item[2];
    }

    var maxPoints = [100, 200, 400, 600, 800];
    var mult = 1;
    var maxFinded = false;
    var newMax = 0;

    while (!maxFinded) {
      for (var _i = 0; _i < maxPoints.length; _i++) {
        var val = maxPoints[_i];
        var mv = val * mult;

        if (mv >= max) {
          newMax = mv;
          maxFinded = true;
          break;
        }
      }

      mult *= 10;
    }

    max = newMax;
    var h = height - topSpace - bottomSpace - 20;
    var cnt = 5;
    var ch = Math.floor(h / (cnt - 1));
    var yStep = max / (cnt - 1);

    function formatYVal(val) {
      if (val < 1000) return val;else if (val < 1000000) return val / 1000 + "K";else return val / 1000000 + "M";
    }

    for (var _c = cnt - 1; _c >= 0; _c--) {
      var y = _c * ch + topSpace + 10;
      ctx.beginPath();
      ctx.moveTo(leftSpace - 10, y);
      ctx.lineTo(width - rightSpace, y);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 14px " + fontFamily;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      var yv = formatYVal((cnt - _c - 1) * yStep);
      ctx.fillText(yv + '', leftSpace - 20, y);
    }

    function drawLine(ix) {
      var color = '#ffffff';
      ctx.lineWidth = 3;
      if (ix == 1) color = enlColor;
      if (ix == 2) color = resColor;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      var points = [];
      ctx.beginPath();

      for (var _i2 = 0; _i2 < score.length; _i2++) {
        var _x = cpPoints[_i2];

        var _y = h - h * (score[_i2][ix] / max) + topSpace + 10;

        points.push({
          x: _x,
          y: _y
        });
        if (_i2 == 0) ctx.moveTo(_x, _y);else ctx.lineTo(_x, _y);
      }

      ctx.stroke();

      for (var _i3 = 0; _i3 < points.length; _i3++) {
        ctx.beginPath();
        ctx.arc(points[_i3].x, points[_i3].y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function padNumber(val) {
      val = val + '';
      if (val.length < 3) return val;
      var parts = [];

      while (val.length > 3) {
        parts.unshift(val.substr(val.length - 3));
        val = val.substr(0, val.length - 3);
      }

      if (val) parts.unshift(val);
      return parts.join(',');
    }

    function zeroPad(val) {
      if (val >= 10) return val + '';
      return '0' + val;
    }

    drawLine(1);
    drawLine(2);
    ctx.fillStyle = '#d4ab75';
    ctx.font = "bold 20px " + fontFamily;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(data.result.regionName, 30, 20);

    if (cycleData) {
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 18px " + fontFamily;
      ctx.fillText(cycleData.cycle + '.' + score.length, 30, 45);
      ctx.fillStyle = '#cccccc';
      ctx.font = "bold 14px " + fontFamily;
      var localDate = zeroPad(cycleData.localDate.date) + '.' + zeroPad(cycleData.localDate.month) + '.' + cycleData.localDate.year;
      localDate += ' ';
      localDate += zeroPad(cycleData.localDate.hours) + ':' + zeroPad(cycleData.localDate.minutes);
      ctx.fillText(localDate, 30, 80);
    }

    var tw = width * 0.9 / 5; /////////////////////

    ctx.fillStyle = '#ffffff';
    ctx.font = "18px " + fontFamily;
    ctx.fillText('Счет:', tw + leftSpace, 20);
    ctx.fillStyle = enlColor;
    ctx.font = "18px " + fontFamily;
    ctx.fillText(padNumber(data.result.gameScore[0]), tw + leftSpace, 45);
    ctx.fillStyle = resColor;
    ctx.font = "18px " + fontFamily;
    ctx.fillText(padNumber(data.result.gameScore[1]), tw + leftSpace, 68); /////////////////////

    ctx.fillStyle = '#ffffff';
    ctx.font = "18px " + fontFamily;
    ctx.fillText('Отсечка:', tw * 2 + leftSpace, 20);
    ctx.fillStyle = enlColor;
    ctx.font = "18px " + fontFamily;
    ctx.fillText(padNumber(score[score.length - 1][1]), tw * 2 + leftSpace, 45);
    ctx.fillStyle = resColor;
    ctx.font = "18px " + fontFamily;
    ctx.fillText(padNumber(score[score.length - 1][2]), tw * 2 + leftSpace, 68); /////////////////////

    ctx.fillStyle = '#ffffff';
    ctx.font = "18px " + fontFamily;
    ctx.fillText('Топ:', tw * 3 + leftSpace, 20);

    for (var _i4 = 0; _i4 < data.result.topAgents.length; _i4++) {
      var _item = data.result.topAgents[_i4];
      ctx.fillStyle = _item.team === 'RESISTANCE' ? resColor : enlColor;
      ctx.font = "18px " + fontFamily;
      ctx.fillText(_item.nick, tw * 3 + leftSpace, 45 + _i4 * 23);
    }

    ctx.drawImage(logo, width - 140, 10);
  }; ////////////////////////////////////////


  window.plugin.cellScore = e;

  function setup() {
    $('<style>').prop('type', 'text/css').html(plugin_info.css).appendTo('head');
    $('body').append(plugin_info.ui);
    $('#toolbox').append('<a onclick="window.plugin.cellScore.toggleBox();return false;">Cell Score</a>');
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