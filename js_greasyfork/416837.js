// ==UserScript==
// @name        IITC plugin: Find and highlight full deploy portals
// @version     0.0.6
// @author      Odrick
// @description Find and highlight full deploy portals
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc_plugin_find_full_deploy
// @category    Highlighter
// @license     MIT
// @include     https://*.ingress.com/intel*
// @include     http://*.ingress.com/intel*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/416837/IITC%20plugin%3A%20Find%20and%20highlight%20full%20deploy%20portals.user.js
// @updateURL https://update.greasyfork.org/scripts/416837/IITC%20plugin%3A%20Find%20and%20highlight%20full%20deploy%20portals.meta.js
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
  plugin_info.buildName = 'IITC plugin: find full deploy portals';
  plugin_info.dateTimeVersion = '20201107102437';
  plugin_info.pluginId = 'iitc_plugin_find_full_deploy';
  var isStarted = false;
  var skipped = [];
  var finded = [];
  var e = {}; ////////////////////////////////////////

  e.start = function () {
    if (isStarted) {
      stop();
      return;
    } else {
      isStarted = true;
      $("#findFullDeployControl").html("Stop Find");
    }

    skipped = [];
    finded = [];
    $("#findFullDeployList").html("");

    if (window.plugin.lanched) {
      window.plugin.lanched.request(0);
    } else {
      requestNextPortal();
    }
  };

  e.toggle = function () {
    stop();
    var box = $("#findFullDeployBox");
    box.css('display', box.css('display') === 'none' ? 'block' : 'none');
  };

  e.hideBox = function () {
    stop();
    var box = $("#findFullDeployBox");
    box.css('display', 'none');
  };

  var stop = function stop() {
    isStarted = false;
    $("#findFullDeployControl").html("Start Find");
  };

  var inBounds = function inBounds(portal) {
    var point = portal.getLatLng();
    var eastBound = point.lng < map.getBounds().getNorthEast().lng;
    var westBound = point.lng > map.getBounds().getSouthWest().lng;
    var inLong;

    if (map.getBounds().getNorthEast().lng < map.getBounds().getSouthWest().lng) {
      inLong = eastBound || westBound;
    } else {
      inLong = eastBound && westBound;
    }

    var inLat = point.lat > map.getBounds().getSouthWest().lat && point.lat < map.getBounds().getNorthEast().lat;
    return inLat && inLong;
  };

  var requestNextPortal = function requestNextPortal() {
    if (!isStarted) return;
    var ids = Object.keys(window.portals);
    var noDetailsCount = 0;
    var toFind = '';

    for (var i = 0; i < ids.length; i++) {
      var guid = ids[i];
      var details = portalDetail.get(guid);

      if (!details && inBounds(portals[guid])) {
        noDetailsCount++;
        if (!toFind && skipped.indexOf(guid) < 0) toFind = guid;
      }
    }

    if (toFind) {
      $("#findFullDeployControl").html("Stop Find (" + noDetailsCount + ")");
      portalDetail.request(toFind).then(function () {
        var details = portalDetail.get(toFind);

        if (details && details.resonators.length === 8 && finded.indexOf(toFind) < 0) {
          finded.push(toFind);
          addListItem(toFind, details);
        }

        highlightPortal(window.portals[toFind]);
        setTimeout(requestNextPortal, Math.random() * 1500 + 1500);
      })["catch"](function (e) {
        skipped.push(toFind);
        setTimeout(requestNextPortal, Math.random() * 1500 + 1500);
        highlightPortal(window.portals[toFind]);
        addListItem(toFind, window.portals[toFind].options.data, true);
      });
      return;
    }

    stop();
  };

  var addListItem = function addListItem(guid, info) {
    var isProblem = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var item = document.createElement('div');
    item.addEventListener('click', function () {
      window.map.setView({
        lat: info.latE6 / 1e6,
        lng: info.lngE6 / 1e6
      }, window.map.getZoom());
      window.selectPortal(guid);
      window.renderPortalDetails(guid);
    });
    item.guid = guid;
    item.className = 'findFullDeployListItem';
    var className = '';

    if (isProblem) {
      className = 'findFullDeployListItemError';
    } else {
      className = info.team === 'R' ? 'findFullDeployListItemR' : 'findFullDeployListItemE';
    }

    $(item).append("<div class=\"findFullDeployListItemTitle ".concat(className, "\">").concat(info.title, "</div>"));
    $("#findFullDeployList").append(item);
    item.scrollIntoView();
  };

  e.highlight = function (data) {
    var details = portalDetail.get(data.portal.options.guid);

    if (finded.indexOf(data.portal.options.guid) >= 0 || details && details.resonators.length === 8) {
      data.portal.setStyle({
        fillColor: details.team === 'R' ? '#000066' : '#006600',
        fillOpacity: 1
      });
    } else {
      if (skipped.indexOf(data.portal.options.guid) >= 0) data.portal.setStyle({
        fillColor: '#660000',
        fillOpacity: 1
      });
    }
  }; ////////////////////////////////////////


  window.plugin.findFullDeploy = e;

  function setup() {
    $('<style>').prop('type', 'text/css').html(plugin_info.css).appendTo('head');
    $('body').append(plugin_info.ui);
    $('#toolbox').append('<a onclick="window.plugin.findFullDeploy.toggle();return false;" id="findFullDeployToggle">Find Full Deploy</a>');
    $('#findFullDeployBox').draggable({
      handle: '.handle',
      containment: 'window'
    });
    window.addPortalHighlighter('Full deploy', window.plugin.findFullDeploy.highlight);

    if (window.plugin.lanched) {
      window.plugin.lanched.request = function (offset) {
        if (offset === -1 || window.plugin.lanched.stopRefresh) return;
        console.log("Getting info with offset " + offset);
        var datatoSend = map.getBounds();
        $.ajax({
          type: "GET",
          url: "https://lanched.ru/PortalGet/getPortals.php",
          dataType: 'jsonp',
          crossDomain: true,
          data: {
            nelat: datatoSend._northEast.lat,
            nelng: datatoSend._northEast.lng,
            swlat: datatoSend._southWest.lat,
            swlng: datatoSend._southWest.lng,
            offset: offset
          },
          success: function success(data) {
            if (!window.plugin.lanched.cache) window.plugin.lanched.cache = [];

            if (!window.plugin.lanched.addPortal) {
              window.plugin.lanched.addPortal = function (portal) {
                var render = window.mapDataRequest.render;
                if (!render.bounds.contains(L.latLng(portal.lat, portal.lng))) return console.log('out of bounds');
                render.createPortalEntity([portal.guid, 0, ['p', 0, portal.lat * 1E6, portal.lng * 1E6, 1, 0, 0, null, portal.name, [], false, false, null, 0]]);
              };
            }

            window.plugin.lanched.cache = window.plugin.lanched.cache.concat(data.portalData);
            data.portalData.forEach(window.plugin.lanched.addPortal);

            if (data.nextOffset !== -1) {
              window.plugin.lanched.request(data.nextOffset);
            }

            if (window.plugin.portalNames) {
              window.plugin.portalNames.updatePortalLabels();
            }

            requestNextPortal();
          },
          error: function error(xhr) {
            alert('error');
          }
        });
      };
    }
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

module.exports = "<div id=\"findFullDeployBox\">\r\n    <div id=\"findFullDeployTopBar\">\r\n        <a id=\"findFullDeployMin\" class=\"btn\" onclick=\"window.plugin.findFullDeploy.hideBox();return false;\" title=\"Minimize\">-</a>\r\n        <div class=\"handle\">\r\n            <div id=\"findFullDeployToolBox\">\r\n                <a href=\"#\" onclick=\"window.plugin.findFullDeploy.start();return false;\" id=\"findFullDeployControl\">Start</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n    <div id=\"findFullDeployList\"></div>\r\n</div>";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "#findFullDeployBox {\r\n\tdisplay: none;\r\n\tposition: absolute!important;\r\n\tz-index: 100501;\r\n\ttop: 50px;\r\n\tleft: 60px;\r\n\twidth: 300px;\r\n\toverflow: hidden;\r\n\tbackground: rgba(8, 48, 78, .9);\r\n\tborder: 1px solid #20a8b1;\r\n\tcolor: #ffffff;\r\n\tpadding: 8px;\r\n\tfont-size: 13px;\r\n\t-webkit-touch-callout: none;\r\n\t-webkit-user-select: none;\r\n\t-khtml-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none\r\n}\r\n\r\n#findFullDeployBox a.btn {\r\n    color: #ffce00;\r\n}\r\n\r\n#findFullDeployBox #findFullDeployTopBar {\r\n\theight: 15px!important\r\n}\r\n\r\n#findFullDeployBox #findFullDeployTopBar * {\r\n\theight: 14px!important\r\n}\r\n\r\n#findFullDeployBox .handle {\r\n\twidth: 89%;\r\n\ttext-align: center;\r\n\tcolor: #fff;\r\n\tline-height: 6px;\r\n\tcursor: move;\r\n\tfloat: right\r\n}\r\n\r\n#findFullDeployBox #findFullDeployTopBar .btn {\r\n\tdisplay: block;\r\n\twidth: 10%;\r\n\tcursor: pointer;\r\n\tcolor: #20a8b1;\r\n\tfont-weight: 700;\r\n\ttext-align: center;\r\n\tline-height: 13px;\r\n\tfont-size: 18px;\r\n\tborder: 1px solid #20a8b1;\r\n\tfloat: left\r\n}\r\n\r\n#findFullDeployBox #findFullDeployTopBar .btn:hover {\r\n\tcolor: #ffce00;\r\n\ttext-decoration: none\r\n}\r\n\r\n#findFullDeployBox #findFullDeployTitle {\r\n\tfont-size: 14px;\r\n    padding-top: 5px;\r\n    color: #0099ff;\r\n}\r\n\r\n#findFullDeployToolBox {\r\n    clear: both;\r\n    padding: 2px;\r\n    text-align: right;\r\n}\r\n\r\n#findFullDeployList {\r\n    width: 300px;\r\n    height: 350px;\r\n    margin: auto;\r\n    border: 1px solid #20a8b1;\r\n    overflow-x: hidden;\r\n    overflow-y: auto;\r\n    margin-top: 4px;\r\n    clear: both;\r\n}\r\n\r\n.findFullDeployListItem {\r\n    cursor: pointer;\r\n}\r\n\r\n.findFullDeployListItemTitle {\r\n    display: inline-block;\r\n    padding-left: 4px;\r\n    width: 250px;\r\n    overflow: hidden;\r\n    box-sizing: border-box;\r\n    white-space: nowrap;\r\n}\r\n\r\n.findFullDeployListItemR {\r\n    color: #bbbbff;\r\n}\r\n\r\n.findFullDeployListItemE {\r\n    color: #bbffbb;\r\n}\r\n\r\n.findFullDeployListItemError {\r\n    color: #ffbbbb;\r\n}", ""]);
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