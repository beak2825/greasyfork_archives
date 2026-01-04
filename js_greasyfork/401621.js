// ==UserScript==
// @name        IITC plugin: Bulk passcodes redeem plugin
// @version     0.1.0
// @author      odrick
// @description Bulk passcodes redeem plugin
// @match       https://*.ingress.com/*
// @match       http://*.ingress.com/*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-plugin-bulk-passcodes-redeem
// @category    Misc
// @license     MIT
// @include     https://*.ingress.com/*
// @include     http://*.ingress.com/*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/401621/IITC%20plugin%3A%20Bulk%20passcodes%20redeem%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/401621/IITC%20plugin%3A%20Bulk%20passcodes%20redeem%20plugin.meta.js
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
  plugin_info.buildName = 'Bulk passcodes redeem';
  plugin_info.dateTimeVersion = '20200321142254';
  plugin_info.pluginId = 'iitc-plugin-bulk-passcodes-redeem'; //let layer = null;

  var currentDialog = null;
  var runned = false;
  var currentTimer = null;
  var runButton = null;
  var codes = [];
  var e = {};

  function getTimeFrom() {
    return localStorage.getItem('bulk-passcodes-redeem-time-from') * 1 || 5;
  }

  function getTimeTo() {
    return localStorage.getItem('bulk-passcodes-redeem-time-to') * 1 || 8;
  }

  function getStopOnFirstSuccess() {
    return localStorage.getItem('bulk-passcodes-redeem-stop-on-first-success') === '0' ? false : true;
  }

  function startReddem() {
    if (runned) return;
    var list = $("#bulkPasscodesRedeemInput").val().split(/\s/);
    if (!list.length) return;
    codes = [];

    for (var i = 0; i < list.length; i++) {
      var val = list[i].trim();
      if (val) codes.push(val);
    }

    if (!codes.length) return;
    runned = true;
    $("#bulkPasscodesRedeemLog").html('');
    localStorage.setItem('bulk-passcodes-redeem-time-from', $("#bulkPasscodesRedeemTimeoutFrom").val());
    localStorage.setItem('bulk-passcodes-redeem-time-to', $("#bulkPasscodesRedeemTimeoutTo").val());
    localStorage.setItem('bulk-passcodes-redeem-stop-on-first-success', $("#bulkPasscodesRedeemStopOnFirstSuccess").prop('checked') ? '1' : '0');

    if (window.isSmartphone()) {
      e.showLog();
    }

    redeemNext();
  }

  function redeemNext() {
    if (!runned) {
      return;
    }

    var code = codes.shift();

    if (!code) {
      runned = false;
      stop();
      return;
    }

    var d = getTimeFrom();
    var diff = getTimeTo() - getTimeFrom();

    if (diff > 0) {
      d += Math.random() * diff;
    }

    var jqXHR = window.postAjax('redeemReward', {
      passcode: code
    }, function (data, textStatus, jqXHR) {
      var log = null;

      if (data.error) {
        log = $('<div>' + code + ' - <span style="color: #ff99ff">' + data.error + '</span></div>');
        if (data.error === 'XM object capacity reached.') codes = [];
        if (data.error === 'Passcode circuitry too hot. Wait for cool down to enter another passcode.') codes = [];
      } else if (!data.rewards) {
        log = $('<div>' + code + ' - <span style="color: #9999ff">No rewards</span></div>');
      } else {
        log = $('<div>' + code + ' - <span style="color: #99ff99">Success</span></div>');
        window.handleRedeemResponse(data, textStatus, jqXHR);
        if (getStopOnFirstSuccess()) codes = [];
      }

      log.appendTo("#bulkPasscodesRedeemLog");
      log[0].scrollIntoView();

      if (codes.length) {
        currentTimer = setTimeout(redeemNext, d * 1000);
      } else {
        stop();
      }
    }, function () {
      var log = $('<div>' + code + ' - <span style="color: #ff9999">Server error</span></div>');
      log.appendTo("#bulkPasscodesRedeemLog");
      log[0].scrollIntoView();

      if (codes.length) {
        currentTimer = setTimeout(redeemNext, d * 1000);
      } else {
        stop();
      }
    });
    jqXHR.passcode = code;
  }

  function stop() {
    clearTimeout(currentTimer);
    runButton.innerHTML = "RUN";
    runned = false;
  } ////////////////////////////////////////


  e.showPasscodes = function () {// $("#bulkPasscodesRedeemInput").show();
    // $("#bulkPasscodesRedeemLog").hide();
  };

  e.showLog = function () {// $("#bulkPasscodesRedeemInput").hide();
    // $("#bulkPasscodesRedeemLog").show();
  };

  e.toggleBox = function () {
    if (currentDialog) {
      $(currentDialog).dialog('close');
      currentDialog = null;
      runned = false;
      return;
    }

    currentDialog = dialog({
      html: plugin_info.ui,
      modal: false,
      dialogClass: 'ui-dialog-bulk-passcodes-redeem',
      id: 'bulk-passcodes-redeems',
      title: 'Bulk passcodes redeem',
      width: window.isSmartphone() ? 340 : 520,
      buttons: {
        'RUN': function RUN() {
          if (runned) {
            stop();
          } else {
            startReddem();

            if (runned) {
              runButton.innerHTML = "STOP";
            }
          }
        }
      },
      close: function close() {
        runned = false;
        currentDialog = null;
        stop();
      }
    });
    $("#bulkPasscodesRedeemTimeoutFrom").val(getTimeFrom());
    $("#bulkPasscodesRedeemTimeoutTo").val(getTimeTo());
    $("#bulkPasscodesRedeemStopOnFirstSuccess").prop('checked', getStopOnFirstSuccess());
    var buttons = currentDialog[0].offsetParent.querySelectorAll('.ui-button');

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];

      if (button.innerHTML === 'OK') {
        button.innerHTML = 'CLOSE';
        var parent = button.parentNode;
        parent.removeChild(button);
        parent.appendChild(button);
      } else {
        runButton = button;
      }
    }

    if (window.isSmartphone()) {
      window.show('map'); // $("#bulkPasscodesRedeemLog").hide();
      // $("#bulkPasscodesRedeemControls").show();
    } else {// $("#bulkPasscodesRedeemControls").hide();
      }

    $("#bulkPasscodesRedeemTimeoutFrom").change(function () {
      var val = $("#bulkPasscodesRedeemTimeoutFrom").val();
      var newVal = Math.floor(val);
      if (!newVal) newVal = 0;
      if (newVal < 0) newVal = 0;
      if (isNaN(newVal)) newVal = 0;
      var valTo = $("#bulkPasscodesRedeemTimeoutTo").val();

      if (valTo < newVal) {
        $("#bulkPasscodesRedeemTimeoutTo").val(newVal);
      }

      if (val !== newVal) {
        $("#bulkPasscodesRedeemTimeoutFrom").val(newVal);
      }

      localStorage.setItem('bulk-passcodes-redeem-time-from', $("#bulkPasscodesRedeemTimeoutFrom").val());
      localStorage.setItem('bulk-passcodes-redeem-time-to', $("#bulkPasscodesRedeemTimeoutTo").val());
    });
    $("#bulkPasscodesRedeemTimeoutTo").change(function () {
      var val = $("#bulkPasscodesRedeemTimeoutTo").val();
      var newVal = Math.floor(val);
      if (!newVal) newVal = 0;
      if (newVal < 0) newVal = 0;
      if (isNaN(newVal)) newVal = 0;
      var valFrom = $("#bulkPasscodesRedeemTimeoutFrom").val();
      if (newVal < valFrom) newVal = valFrom;

      if (val !== newVal) {
        $("#bulkPasscodesRedeemTimeoutTo").val(newVal);
      }

      localStorage.setItem('bulk-passcodes-redeem-time-from', $("#bulkPasscodesRedeemTimeoutFrom").val());
      localStorage.setItem('bulk-passcodes-redeem-time-to', $("#bulkPasscodesRedeemTimeoutTo").val());
    });
  }; ////////////////////////////////////////


  window.plugin.bulkPasscodesRedeem = e;

  function setup() {
    $('<style>').prop('type', 'text/css').html(plugin_info.css).appendTo('head');
    $('#toolbox').append('<a onclick="window.plugin.bulkPasscodesRedeem.toggleBox();return false;">Bulk passcodes</a>');
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

module.exports = "<div>\r\n    <textarea id=\"bulkPasscodesRedeemInput\"></textarea>\r\n</div>\r\n<div id=\"bulkPasscodesRedeemLog\"></div>\r\n<div id=\"bulkPasscodesRedeemOptions\">\r\n    <b>Timeout: </b>\r\n    from <input type=\"number\" id=\"bulkPasscodesRedeemTimeoutFrom\"/>\r\n    to <input type=\"number\" id=\"bulkPasscodesRedeemTimeoutTo\"/>\r\n    s.\r\n    ::\r\n    <label for=\"bulkPasscodesRedeemStopOnFirstSuccess\"><b>Stop on success:</b></label>\r\n    <input type=\"checkbox\" id=\"bulkPasscodesRedeemStopOnFirstSuccess\"/>\r\n</div>";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".ui-dialog-bulk-passcodes-redeem {\r\n    width: 320px;\r\n}\r\n\r\n.ui-dialog-bulk-passcodes-redeem button {\r\n    margin-left: 8px;\r\n}\r\n\r\n.ui-dialog-bulk-passcodes-redeem b {\r\n    color: #ffce00;\r\n}\r\n\r\n#bulkPasscodesRedeemInput {\r\n    width: 100%;\r\n    height: 180px;\r\n    box-sizing: border-box;\r\n    white-space: nowrap;\r\n}\r\n\r\n#bulkPasscodesRedeemLog {\r\n    width: 100%;\r\n    height: 185px;\r\n    box-sizing: border-box;\r\n    border: 1px solid #20A8B1;\r\n    overflow-x: hidden;\r\n    overflow-y: auto;\r\n    padding: 4px;\r\n    white-space: nowrap;\r\n    font-size: 13px;\r\n}\r\n\r\n#bulkPasscodesRedeemOptions {\r\n    clear: both;\r\n    margin-top: 8px;\r\n    padding-top: 8px;\r\n    white-space: nowrap;\r\n}\r\n\r\n#bulkPasscodesRedeemControls {\r\n    clear: both;\r\n    margin-bottom: 8px;\r\n}\r\n\r\n#bulkPasscodesRedeemTimeoutFrom {\r\n    width: 40px;\r\n}\r\n\r\n#bulkPasscodesRedeemTimeoutTo {\r\n    width: 40px;\r\n}\r\n\r\n#bulkPasscodesRedeemStopOnFirstSuccess {\r\n    vertical-align: -2px;\r\n}\r\n\r\n@media only screen and (max-width: 480px) {\r\n    #bulkPasscodesRedeemOptions {\r\n        font-size: 12px;\r\n    }\r\n\r\n    #bulkPasscodesRedeemTimeoutFrom {\r\n        width: 30px;\r\n    }\r\n    \r\n    #bulkPasscodesRedeemTimeoutTo {\r\n        width: 30px;\r\n    }\r\n\r\n    #bulkPasscodesRedeemLog {\r\n        font-size: 10px;\r\n    }\r\n}", ""]);
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