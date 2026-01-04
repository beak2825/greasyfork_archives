// ==UserScript==
// @name        IITC plugin: Route planner
// @version     0.1.4
// @author      Odrick
// @description Route planner
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-plugin-route-planner@odrick
// @category    Layer
// @license     MIT
// @include     https://*.ingress.com/intel*
// @include     http://*.ingress.com/intel*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/399409/IITC%20plugin%3A%20Route%20planner.user.js
// @updateURL https://update.greasyfork.org/scripts/399409/IITC%20plugin%3A%20Route%20planner.meta.js
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


        var result = __webpack_require__(6);

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
/* harmony import */ var _ui_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _ui_main_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ui_main_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui_main_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _ui_main_html__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_main_html__WEBPACK_IMPORTED_MODULE_1__);



function wrapper(info) {
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  info.buildName = 'Route planner';
  info.dateTimeVersion = '20200402163000';
  info.pluginId = 'iitc-plugin-route-planner@odrick';
  var layer = null;
  var points = [];
  var navigations = [];
  var active = false;
  var e = {}; ////////////////////////////////////////

  var handlePortalAdded = function handlePortalAdded(data) {
    data.portal.on('click', handlePortalClick);
  };

  var checkPortalInList = function checkPortalInList(guid) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (p.guid === guid) return true;
    }

    return false;
  };

  var handlePortalClick = function handlePortalClick(marker) {
    if (!active) return;
    if (checkPortalInList(marker.target.options.guid)) return;
    var info = {
      guid: marker.target.options.guid,
      title: marker.target.options.data.title,
      lat: marker.target.options.data.latE6 / 1E6,
      lng: marker.target.options.data.lngE6 / 1E6
    };

    if (!info.title) {
      info.title = info.lat + ", " + info.lng;
      info.titleFake = true;
    }

    points.push(info);
    addListItem(info);
    saveData();
    renderRoute();
  };

  var addListItem = function addListItem(info) {
    var item = document.createElement('div');
    item.addEventListener('click', function () {
      window.map.setView({
        lat: info.lat,
        lng: info.lng
      }, window.map.getZoom());
    });
    item.guid = info.guid;
    item.className = 'routePlannerListItem';
    $(item).append("<div class=\"routePlannerListItemTitle\">".concat(info.title, "</div>"));
    $(item).append("<div class=\"routePlannerListItemControls\"><a href=\"#\" onclick=\"window.plugin.routePlanner.removePoint('".concat(info.guid, "')\">X</a></div>"));
    $("#routePlannerList").append(item);
    item.scrollIntoView();
  };

  var renderRoute = function renderRoute() {
    layer.clearLayers();
    var coords = [];

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      L.circleMarker(new L.LatLng(p.lat, p.lng), {
        color: "#ee6666",
        opacity: 1,
        weight: 5,
        fill: true,
        dashArray: '5, 5',
        interactive: false,
        clickable: false,
        radius: 14
      }).addTo(layer);
      coords.push(new L.LatLng(p.lat, p.lng));
    }

    L.polyline(coords, {
      color: "#ee6666",
      opacity: 1,
      weight: 2,
      fill: false,
      interactive: false,
      clickable: false
    }).addTo(layer);
    renderNavigations();
  };

  var renderNavigations = function renderNavigations() {
    navigations = [];
    var list = [];

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (!list.length) list.push('');
      list.push(p.lat + ',' + p.lng);

      if (list.length === getMaxPoints() || i >= points.length - 1) {
        var url = "https://www.google.com/maps/dir/" + list.join('/');
        var start = list[0] || list[1];
        url += '/@' + start + ',18z/';
        navigations.push(url);
        list = [];
      }
    }

    $("#routePlannerLinks").html('');

    for (var _i = 0; _i < navigations.length; _i++) {
      var title = 'Navigation';
      if (navigations.length > 1) title += _i + 1;
      var link = '<a href="' + navigations[_i] + '" target="_blank">' + title + '</a>';
      if (navigations.length > 1 && _i < navigations.length - 1) link += ', ';
      $("#routePlannerLinks").append(link);
    }
  };

  e.removePoint = function (guid) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      if (p.guid === guid) {
        points.splice(i, 1);
        var container = document.querySelector("#routePlannerList");

        for (var n = 0; n < container.children.length; n++) {
          var item = container.children[n];

          if (item.guid === guid) {
            container.removeChild(item);
          }
        }

        saveData();
        renderRoute();
        return;
      }
    }
  };

  e.showBox = function () {
    active = true;
    $("#routePlannerBox").show();

    if (window.isSmartphone()) {
      window.show('map');
    }
  };

  e.hideBox = function () {
    active = false;
    $("#routePlannerBox").hide();
  };

  e.clear = function () {
    points = [];
    $("#routePlannerList").html('');
    saveData();
    renderRoute();
  };

  e["export"] = function () {
    download(JSON.stringify(points), 'route-plan.json');
  };

  e["import"] = function () {
    $('#routePlannerImportInput').click();
  };

  e.doImport = function () {
    var selectedFile = $('#routePlannerImportInput').get(0).files[0];
    var reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = function () {
      try {
        var res = JSON.parse(reader.result);

        if (res && Array.isArray(res)) {
          applyLoadedData(res);
          saveData();
        }
      } catch (e) {}
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  };

  e.copy = function () {
    var textArea = document.createElement("textarea");
    textArea.value = navigations.join('\n\n');
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');

      if (successful) {
        var hint = document.createElement("div");
        hint.innerHTML = "Navigation copied";
        document.body.appendChild(hint);
        hint.style.position = "fixed";
        hint.style.display = "block";
        hint.style.left = "50%";
        hint.style.top = "50%";
        hint.style.transform = "translate(-50%, -50%)";
        hint.style.zIndex = 100500;
        hint.style.padding = "4px";
        hint.style.background = "#fff";
        hint.style.color = "#000";
        setTimeout(function () {
          document.body.removeChild(hint);
        }, 1000);
      }
    } catch (err) {}

    document.body.removeChild(textArea);
  };

  var getPortalByGuid = function getPortalByGuid(guid) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (p.guid === guid) return p;
    }

    return null;
  };

  var handleItemChangePosition = function handleItemChangePosition(event, ui) {
    var guid = ui.item[0].guid;
    var prevIndex = -1;

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (p.guid === guid) prevIndex = i;
    }

    var currentIndex = ui.item.index();

    if (prevIndex >= 0) {
      if (currentIndex === prevIndex) return;
      var _p = points[prevIndex];
      points.splice(prevIndex, 1);
      points.splice(currentIndex, 0, _p);
    }

    saveData();
    renderRoute();
  };

  var storageKey = "iitc-plugin-route-planner";

  var saveData = function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(points));
  };

  var loadData = function loadData() {
    var data = localStorage.getItem(storageKey);

    if (data) {
      try {
        applyLoadedData(JSON.parse(data));
      } catch (e) {
        points = [];
      }
    }
  };

  var getMaxPoints = function getMaxPoints() {
    var val = parseInt($("#routePlannerMaxPoints").val());
    if (!val) val = 10;
    return val;
  };

  var storageKeySettings = "iitc-plugin-route-planner-settings";

  var saveSettings = function saveSettings() {
    localStorage.setItem(storageKeySettings, JSON.stringify({
      maxPoints: getMaxPoints()
    }));
  };

  var loadSettings = function loadSettings() {
    var data = {
      maxPoints: 10
    };
    var save = localStorage.getItem(storageKeySettings);

    if (save) {
      try {
        data = JSON.parse(save);
      } catch (e) {}
    }

    $("#routePlannerMaxPoints").val(data.maxPoints);
  };

  e.applyMaxPoints = function () {
    saveSettings();
    renderNavigations();
  };

  e.handleMaxPointsKey = function (e) {
    if (e.which === 13) {
      e.applyMaxPoints();
    }
  };

  var applyLoadedData = function applyLoadedData(data) {
    points = data;

    for (var i = 0; i < points.length; i++) {
      addListItem(points[i]);
    }

    renderRoute();
  };

  setInterval(function () {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      if (p.titleFake) {
        var portal = window.portals[p.guid];

        if (portal && portal.options && portal.options.data && portal.options.data.title) {
          p.title = portal.options.data.title;
          p.titleFake = false;
          delete p.titleFake;
          saveData();
          var container = document.querySelector("#routePlannerList");

          for (var n = 0; n < container.children.length; n++) {
            var item = container.children[n];

            if (item.guid === p.guid) {
              item.querySelector('.routePlannerListItemTitle').innerHTML = p.title;
            }
          }
        }
      }
    }
  }, 1000); ////////////////////////////////////////

  window.plugin.routePlanner = e;

  function setup() {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js');
    $('<style>').prop('type', 'text/css').html(info.css).appendTo('head');
    $('body').append(info.ui);
    $('#routePlannerBox').draggable({
      handle: '.handle',
      containment: 'window'
    });
    $("#routePlannerList").sortable({
      update: handleItemChangePosition
    });
    $('#toolbox').append('<a onclick="window.plugin.routePlanner.showBox();return false;">Route planner</a>');
    layer = new L.LayerGroup();
    window.addLayerGroup('Route planner', layer, false);
    window.addHook('portalAdded', handlePortalAdded);
    window.addHook('paneChanged', function (pane) {
      if (pane !== 'map' && active) {
        $("#routePlannerBox").hide();
      }

      if (pane === 'map' && active) {
        $("#routePlannerBox").show();
      }
    });
    loadSettings();
    loadData();
    renderRoute(); //e.showBox();
  }

  setup.info = info;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};

if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}

info.css = _ui_main_css__WEBPACK_IMPORTED_MODULE_0___default.a;
info.ui = _ui_main_html__WEBPACK_IMPORTED_MODULE_1___default.a;
var textContent = document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "#routePlannerBox {\r\n\tdisplay: none;\r\n\tposition: absolute!important;\r\n\tz-index: 1000;\r\n\ttop: 50px;\r\n\tleft: 60px;\r\n\twidth: 300px;\r\n\toverflow: hidden;\r\n\tbackground: rgba(8, 48, 78, .9);\r\n\tborder: 1px solid #20a8b1;\r\n\tcolor: #ffffff;\r\n\tpadding: 8px;\r\n\tfont-size: 13px;\r\n\t-webkit-touch-callout: none;\r\n\t-webkit-user-select: none;\r\n\t-khtml-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none\r\n}\r\n\r\n#routePlannerBox a.btn {\r\n    color: #ffce00;\r\n}\r\n\r\n#routePlannerBox #routePlannerTopBar {\r\n\theight: 15px!important\r\n}\r\n\r\n#routePlannerBox #routePlannerTopBar * {\r\n\theight: 14px!important\r\n}\r\n\r\n#routePlannerBox .handle {\r\n\twidth: 89%;\r\n\ttext-align: center;\r\n\tcolor: #fff;\r\n\tline-height: 6px;\r\n\tcursor: move;\r\n\tfloat: right\r\n}\r\n\r\n#routePlannerBox #routePlannerTopBar .btn {\r\n\tdisplay: block;\r\n\twidth: 10%;\r\n\tcursor: pointer;\r\n\tcolor: #20a8b1;\r\n\tfont-weight: 700;\r\n\ttext-align: center;\r\n\tline-height: 13px;\r\n\tfont-size: 18px;\r\n\tborder: 1px solid #20a8b1;\r\n\tfloat: left\r\n}\r\n\r\n#routePlannerBox #routePlannerTopBar .btn:hover {\r\n\tcolor: #ffce00;\r\n\ttext-decoration: none\r\n}\r\n\r\n#routePlannerBox #routePlannerTitle {\r\n\tfont-size: 14px;\r\n    padding-top: 5px;\r\n    color: #0099ff;\r\n}\r\n\r\n#routePlannerImportInput {\r\n    visibility: hidden;\r\n    width: 2px;\r\n    height: 1px;\r\n}\r\n\r\n#routePlannerToolBox {\r\n    clear: both;\r\n    padding: 2px;\r\n    text-align: right;\r\n}\r\n\r\n#routePlannerList {\r\n    width: 300px;\r\n    height: 350px;\r\n    margin: auto;\r\n    border: 1px solid #20a8b1;\r\n    overflow-x: hidden;\r\n    overflow-y: auto;\r\n    margin-top: 4px;\r\n    clear: both;\r\n}\r\n\r\n.routePlannerListItem {\r\n    cursor: pointer;\r\n}\r\n\r\n.routePlannerListItemTitle {\r\n    display: inline-block;\r\n    padding-left: 4px;\r\n    width: 250px;\r\n    overflow: hidden;\r\n    box-sizing: border-box;\r\n    white-space: nowrap;\r\n}\r\n\r\n.routePlannerListItemControls {\r\n    display: inline-block;\r\n    text-align: center;\r\n    width: 20px;\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n}\r\n\r\n#routePlannerLinks {\r\n    min-height: 14px;\r\n    padding-top: 8px;\r\n}\r\n\r\n#routePlannerMaxPoints {\r\n    width: 32px;\r\n}\r\n\r\n@media only screen and (max-width: 480px) {\r\n    #routePlannerBox {\r\n        left: 50%;\r\n        top: auto;\r\n        right: 0px;\r\n        bottom: 20px;\r\n        width: 95%;\r\n        transform: translate(-50%, 0%);\r\n    }\r\n\r\n    #routePlannerList {\r\n        height: 150px;\r\n        width: 98%;\r\n    }\r\n}", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 5 */
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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "<div id=\"routePlannerBox\">\r\n    <div id=\"routePlannerTopBar\">\r\n        <a id=\"routePlannerMin\" class=\"btn\" onclick=\"window.plugin.routePlanner.hideBox();return false;\" title=\"Minimize\">-</a>\r\n        <div class=\"handle\"><div id=\"routePlannerTitle\" class=\"ui-dialog-title ui-dialog-title-active\">Route planner</div></div>\r\n    </div>\r\n    <div id=\"routePlannerToolBox\">\r\n        <input type=\"file\" id=\"routePlannerImportInput\" visbility=\"hidden\" onchange=\"window.plugin.routePlanner.doImport();return false;\"/>\r\n\r\n        Max points <input type=\"text\" value=\"10\" title=\"Max points in one navigation link\" id=\"routePlannerMaxPoints\" onchange=\"window.plugin.routePlanner.applyMaxPoints()\" onkeyup=\"window.plugin.routePlanner.handleMaxPointsKey()\"/>\r\n        ::\r\n        <a href=\"#\" onclick=\"window.plugin.routePlanner.copy();return false;\">Copy</a>\r\n        ::\r\n        <a href=\"#\" onclick=\"window.plugin.routePlanner.export();return false;\">Export</a>\r\n        ::\r\n        <a href=\"#\" onclick=\"window.plugin.routePlanner.import();return false;\">Import</a>\r\n        ::\r\n        <a href=\"#\" onclick=\"window.plugin.routePlanner.clear();return false;\">Clear</a>\r\n    </div>\r\n    <div id=\"routePlannerList\"></div>\r\n    <div id=\"routePlannerLinks\"></div>\r\n</div>";

/***/ })
/******/ ]);