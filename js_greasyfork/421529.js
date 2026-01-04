// ==UserScript==
// @name        IITC plugin: My keys
// @version     0.1.2
// @author      Odr1ck
// @description Show keys on map and list
// @match       https://*.ingress.com/*
// @match       http://*.ingress.com/*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-plugin-my-keys
// @category    Layer
// @license     MIT
// @include     https://*.ingress.com/*
// @include     http://*.ingress.com/*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/421529/IITC%20plugin%3A%20My%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/421529/IITC%20plugin%3A%20My%20keys.meta.js
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

 // import testData from './test/data.json';

function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  plugin_info.buildName = 'My Keys';
  plugin_info.dateTimeVersion = '20210110130855';
  plugin_info.pluginId = 'iitc-plugin-my-keys';
  var layer = null;
  var e = {};
  var myKeys = [];
  var rawData = null;
  var active = false;
  var iconPopup = null;

  var parseData = function parseData(data) {
    var capsules = ["CAPSULE", "INTEREST_CAPSULE", "KEY_CAPSULE"];
    var keys = [];

    var getInfo = function getInfo(item) {
      return item[2].resource || item[2].modResource || item[2].resourceWithLevels;
    };

    var addKey = function addKey(portal, place) {
      var placeId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var currentKey = null;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (key.guid === portal.portalGuid) {
          currentKey = key;
          break;
        }
      }

      if (!currentKey) {
        var location = portal.portalLocation.split(',');
        currentKey = {
          guid: portal.portalGuid,
          title: portal.portalTitle,
          image: portal.portalImageUrl,
          count: 0,
          lat: (Number.parseInt(location[0], 16) & -1) * 1e-6,
          lng: (Number.parseInt(location[1], 16) & -1) * 1e-6,
          places: {}
        };
        keys.push(currentKey);
      }

      currentKey.count++;
      var placeKey = place + (placeId ? "_" + placeId : "");

      if (!currentKey.places[placeKey]) {
        currentKey.places[placeKey] = {
          type: place,
          id: placeId,
          count: 0
        };
      }

      currentKey.places[placeKey].count++;
    };

    for (var i = 0; i < data.result.length; i++) {
      var item = data.result[i];

      var _info = getInfo(item);

      if (_info) {
        if (_info.resourceType === "PORTAL_LINK_KEY") {
          addKey(item[2].portalCoupler, "INVENTORY");
        }

        if (capsules.indexOf(_info.resourceType) >= 0) {
          if (item[2].container && item[2].container.currentCount > 0) {
            for (var _i = 0; _i < item[2].container.stackableItems.length; _i++) {
              capsuleItem = item[2].container.stackableItems[_i];
              var itemInfo = getInfo(capsuleItem.exampleGameEntity);

              if (itemInfo && itemInfo.resourceType === "PORTAL_LINK_KEY") {
                for (var _i2 = 0; _i2 < capsuleItem.itemGuids.length; _i2++) {
                  addKey(capsuleItem.exampleGameEntity[2].portalCoupler, _info.resourceType, item[2].moniker.differentiator);
                }
              }
            }
          }
        }
      }
    }

    return keys;
  };

  e.refreshData = function () {
    var skipError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    postAjax("getInventory", {
      lastQueryTimestamp: 0
    }, function (data) {
      processData(data, skipError);
    });
  };

  var selectPortal = function selectPortal(guid, lat, lng) {
    window.map.setView({
      lat: lat,
      lng: lng
    }, window.map.getZoom());
    window.selectPortal(guid);
    window.renderPortalDetails(guid);
  };

  e.applyFiler = function () {
    var val = $("#myKeysFilter").val().toLowerCase();
    var views = $("#myKeysList").children();

    for (var i = 0; i < views.length; i++) {
      var view = $(views[i]);
      var title = view.data("title");

      if (!val || title.toLowerCase().indexOf(val) >= 0) {
        view.show();
      } else {
        view.hide();
      }
    }
  };

  var processData = function processData(data) {
    var skipError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!data || !data.result || !data.result.length) {
      if (!skipError) {
        alert("My Keys required inventory access, granted by C.O.R.E. subscription");
      }

      return;
    }

    rawData = data;
    $("#myKeysList").html('');
    $("#myKeysFilter").val('');
    layer.clearLayers();
    var keys = parseData(data);

    var _loop = function _loop(i) {
      var key = keys[i];
      var view = $("<div/>");
      view.addClass("myKeysListItem");
      view.data("title", key.title);
      var title = $("<div/>");
      title.html(key.title);
      title.addClass("myKeysListItemTitle");
      title.click(function () {
        selectPortal(key.guid, key.lat, key.lng);
      });
      view.append(title);
      var count = $("<div/>");
      count.html(key.count);
      count.addClass("myKeysListItemCount");
      view.append(count);
      var places = [];
      var rawPlaces = [];

      for (var pid in key.places) {
        var p = key.places[pid];
        var _title = '';
        if (p.type === 'INVENTORY') _title = 'Inventory';
        if (p.type === 'CAPSULE') _title = 'Capsule ' + p.id;
        if (p.type === 'INTEREST_CAPSULE') _title = 'Quantum capsule ' + p.id;
        if (p.type === 'KEY_CAPSULE') _title = 'Key capsule ' + p.id;
        places.push('<div style="float: left">' + _title + '</div>:' + '<div style="float: right; color: white;">&nbsp;' + p.count + '</div>');
        rawPlaces.push(_title + ': ' + p.count);
      }

      count.attr('title', places.join('<br/>'));
      count.tooltip({
        content: function content() {
          return $(this).attr('title');
        }
      });
      $("#myKeysList").append(view); //Icon

      var icon = L.marker(new L.LatLng(key.lat, key.lng), {
        icon: L.divIcon({
          className: 'myKeysIcon',
          iconAnchor: [12, 28],
          tooltipAnchor: [12, -28],
          iconSize: [20, 14],
          html: key.count + '',
          clickable: true
        }),
        guid: key.guid + '_my_keys',
        clickable: true
      });
      icon.addTo(layer);
      icon._portalGuid = key.guid;

      if (icon.bindTooltip && !window.isSmartphone()) {
        icon.bindTooltip('<b>' + key.title + '</b><br/>' + rawPlaces.join('<br/>'), {
          permanent: false,
          direction: 'top'
        });
        icon.addEventListener('click', selectPortalByMarker);
      } else {
        icon._toolTipContent = '<b style="color: #fff">' + key.title + '</b><br/><br/>' + rawPlaces.join('<br/>');
        icon.addEventListener('click', iconClickListener);
      }
    };

    for (var i = 0; i < keys.length; i++) {
      _loop(i);
    }

    myKeys = keys;
  };

  var selectPortalByMarker = function selectPortalByMarker(e) {
    if (!e || !e.target || !e.target._portalGuid) return;
    window.selectPortal(e.target._portalGuid);
    window.renderPortalDetails(e.target._portalGuid);
  };

  var iconClickListener = function iconClickListener(e) {
    selectPortalByMarker(e);
    var marker = e.target;
    iconPopup.setContent(marker._toolTipContent);
    iconPopup.setLatLng(marker.getLatLng());
    map.openPopup(iconPopup);
  };

  e.toggleBox = function () {
    var box = $("#myKeysBox");
    box.css('display', box.css('display') === 'none' ? 'block' : 'none');

    if (box.css('display') === 'block' && window.isSmartphone()) {
      window.show('map');
    }

    active = box.css('display') === 'block';
  };

  e.hideBox = function () {
    $("#myKeysBox").css('display', 'none');
    active = false;
  };

  e["export"] = function () {
    download(JSON.stringify(myKeys), 'keys.json', 'application/json');
  };

  e.exportRaw = function () {
    var res = encodeURIComponent(JSON.stringify(rawData));
    download(res, 'inventory.json', 'application/json');
  };

  e.importRaw = function () {
    $('#myKeysImportInput').click();
  };

  e.doImportRaw = function () {
    console.log("doImportRaw");
    var selectedFile = $('#myKeysImportInput').get(0).files[0];
    var reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = function () {
      try {
        var res = JSON.parse(decodeURIComponent(reader.result));

        if (res && res.result && res.result.length) {
          processData(res);
        } else {
          alert("Invalid inventory file");
        }
      } catch (e) {
        alert("Invalid inventory file");
      }
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  };

  window.plugin.myKeys = e;

  function setup() {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js');
    $('<style>').prop('type', 'text/css').html(plugin_info.css).appendTo('head');
    $('body').append(plugin_info.ui);
    $('#myKeysBox').draggable({
      handle: '.handle',
      containment: 'window'
    });
    $('#toolbox').append('<a onclick="window.plugin.myKeys.toggleBox();return false;">My keys</a>');
    $('#toolbox').append('<a onclick="window.plugin.myKeys.refreshData();return false;">Refresh keys</a>');
    layer = new L.LayerGroup();
    window.addLayerGroup('My Keys', layer, true);
    window.addHook('paneChanged', function (pane) {
      if (pane !== 'map' && active) {
        $("#myKeysBox").hide();
      }

      if (pane === 'map' && active) {
        $("#myKeysBox").show();
      }
    });
    iconPopup = new L.Popup({
      offset: L.point([1, -16])
    }); // processData(plugin_info.testData);

    setTimeout(function () {
      return e.refreshData(true);
    }, 1000);
  }

  setup.info = plugin_info;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};
info.ui = _ui_main_html__WEBPACK_IMPORTED_MODULE_0___default.a;
info.css = _ui_main_css__WEBPACK_IMPORTED_MODULE_1___default.a; // info.testData = testData;

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

module.exports = "<div id=\"myKeysBox\">\r\n    <div id=\"myKeysTopBar\">\r\n        <a id=\"myKeysMin\" class=\"btn\" onclick=\"window.plugin.myKeys.hideBox();return false;\" title=\"Minimize\">-</a>\r\n        <div class=\"handle\">\r\n            <div id=\"myKeysToolBox\">\r\n                <input type=\"file\" id=\"myKeysImportInput\" visbility=\"hidden\" accept=\".json\" onchange=\"window.plugin.myKeys.doImportRaw();return false;\"/>\r\n\r\n                <b>Filter</b>\r\n                &nbsp;\r\n                <input type=\"text\" id=\"myKeysFilter\" onkeyup=\"window.plugin.myKeys.applyFiler()\" onchange=\"window.plugin.myKeys.applyFiler()\"/>\r\n                &nbsp;\r\n                <a href=\"#\" onclick=\"window.plugin.myKeys.refreshData();return false;\" id=\"myKeysRefreshData\">Refresh</a>\r\n                ::\r\n                <a href=\"#\" onclick=\"window.plugin.myKeys.importRaw();return false;\">Import</a>\r\n                ::\r\n                <a href=\"#\" onclick=\"window.plugin.myKeys.exportRaw();return false;\">Export</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n    <div id=\"myKeysList\">\r\n        \r\n    </div>\r\n</div>";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "#myKeysBox {\r\n\tdisplay: none;\r\n\tposition: absolute!important;\r\n\tz-index: 1000;\r\n\ttop: 50px;\r\n\tleft: 60px;\r\n\twidth: 350px;\r\n\toverflow: hidden;\r\n\tbackground: rgba(8, 48, 78, .9);\r\n\tborder: 1px solid #20a8b1;\r\n\tcolor: #ffffff;\r\n\tpadding: 8px;\r\n\tfont-size: 13px;\r\n\t-webkit-touch-callout: none;\r\n\t-webkit-user-select: none;\r\n\t-khtml-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none\r\n}\r\n\r\n#myKeysBox a.btn {\r\n    color: #ffce00;\r\n}\r\n\r\n#myKeysBox #myKeysTopBar {\r\n\theight: 15px!important\r\n}\r\n\r\n#myKeysBox #myKeysTopBar * {\r\n\theight: 14px!important\r\n}\r\n\r\n#myKeysBox .handle {\r\n\twidth: 89%;\r\n\ttext-align: center;\r\n\tcolor: #fff;\r\n\tline-height: 6px;\r\n\tcursor: move;\r\n\tfloat: right\r\n}\r\n\r\n#myKeysBox #myKeysTopBar .btn {\r\n\tdisplay: block;\r\n\twidth: 10%;\r\n\tcursor: pointer;\r\n\tcolor: #20a8b1;\r\n\tfont-weight: 700;\r\n\ttext-align: center;\r\n\tline-height: 13px;\r\n\tfont-size: 18px;\r\n\tborder: 1px solid #20a8b1;\r\n\tfloat: left\r\n}\r\n\r\n#myKeysBox #myKeysTopBar .btn:hover {\r\n\tcolor: #ffce00;\r\n\ttext-decoration: none\r\n}\r\n\r\n#myKeysBox #myKeysTitle {\r\n\tfont-size: 14px;\r\n    padding-top: 5px;\r\n    color: #0099ff;\r\n}\r\n\r\n#myKeysToolBox {\r\n    clear: both;\r\n\tpadding: 2px;\r\n\tpadding-top: 0px;\r\n    text-align: right;\r\n}\r\n\r\n#myKeysList {\r\n    width: 350px;\r\n    height: 400px;\r\n    margin: auto;\r\n    border: 1px solid #20a8b1;\r\n    overflow-x: hidden;\r\n    overflow-y: auto;\r\n\tclear: both;\r\n\tpadding: 4px;\r\n\tbox-sizing: border-box;\r\n\tmargin-top: 10px;\r\n}\r\n\r\n.myKeysListItem {\r\n    cursor: pointer;\r\n}\r\n\r\n.myKeysListItemTitle {\r\n    display: inline-block;\r\n    width: 290px;\r\n    overflow: hidden;\r\n    box-sizing: border-box;\r\n    white-space: nowrap;\r\n}\r\n\r\n.myKeysListItemCount {\r\n    display: inline-block;\r\n    text-align: center;\r\n    width: 30px;\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n}\r\n\r\n#myKeysFilter {\r\n    width: 90px;\r\n}\r\n\r\n.myKeysIcon {\r\n    background-color: rgba(0,0,0,0.95);\r\n    font-size: 11px;\r\n    text-align: center;\r\n    padding: 2px;\r\n    color: #ffffff;\r\n    cursor: default;\r\n    border-radius: 6px;\r\n}\r\n\r\n@media only screen and (max-width: 480px) {\r\n\t#myKeysBox {\r\n\t\tleft: 45px;\r\n\t\twidth: 320px;\r\n\t}\r\n\r\n\t#myKeysList {\r\n\t\twidth: 320px;\r\n\t}\r\n\r\n\t.myKeysListItemTitle {\r\n\t\twidth: 270px;\r\n\t}\r\n\r\n\t#myKeysFilter {\r\n\t\twidth: 80px;\r\n\t}\r\n}\r\n\r\n#myKeysImportInput {\r\n    visibility: hidden;\r\n    width: 2px;\r\n    height: 1px;\r\n}", ""]);
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