// ==UserScript==
// @name        IITC plugin: Scout uniques plugin
// @version     0.0.2
// @author      Odrick
// @description Scout uniques plugin
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-plugin-scout-uniques
// @category    Highlighter
// @license     MIT
// @include     https://*.ingress.com/intel*
// @include     http://*.ingress.com/intel*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/418947/IITC%20plugin%3A%20Scout%20uniques%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/418947/IITC%20plugin%3A%20Scout%20uniques%20plugin.meta.js
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
  var UNMARKED_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpUUqDlYQcchQnSwUFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhGaVqWZPDFA1y0gn4mIuvyoGXhHCEIKIwS8xU09mFrPwHF/38PH1LsqzvM/9OfqVgskAn0g8x3TDIt4gntm0dM77xGFWlhTic+IJgy5I/Mh12eU3ziWHBZ4ZNrLpeeIwsVjqYrmLWdlQiaeJI4qqUb6Qc1nhvMVZrdZZ+578haGCtpLhOs1RJLCEJFIQIaOOCqqwEKVVI8VEmvbjHv4Rx58il0yuChg5FlCDCsnxg//B727N4tSkmxSKA70vtv0xBgR2gVbDtr+Pbbt1AvifgSut4681gdlP0hsdLXIEDGwDF9cdTd4DLneA4SddMiRH8tMUikXg/Yy+KQ8M3gJ9a25v7X2cPgBZ6mr5Bjg4BMZLlL3u8e5gd2//nmn39wNwenKm5pw31AAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QMFQg2NTKKvXYAAABBdEVYdENvbW1lbnQAQ1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAKsEVYkwAAAKlJREFUOMulk7EVwyAMRD8aIy2DxDuocIZI54oJXKVjCFOwAx7EredII/KcFHk2XKmnuyeOO8cPcs53YAQGwNt4AwqQVHU97rsD8QYE4Ml/RGBW1f0jYOQX8OAcFmBS1V1sEC6Qsd0A4OzNhTYMYoa1YhRzm54LfIeAFzohFpJWbNLxAwBFgNQhkMSyHRvIUVXXauJs8eRClOdqIlaM6eQlsfbgq42tdX4D66ExyhvObeMAAAAASUVORK5CYII=';
  var MARKED_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpUUqDlYQcchQnSwUFXGUKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEydFJ0UVK/F9SaBHjwXE/3t173L0DhGaVqWZPDFA1y0gn4mIuvyoGXhHCEIKIwS8xU09mFrPwHF/38PH1LsqzvM/9OfqVgskAn0g8x3TDIt4gntm0dM77xGFWlhTic+IJgy5I/Mh12eU3ziWHBZ4ZNrLpeeIwsVjqYrmLWdlQiaeJI4qqUb6Qc1nhvMVZrdZZ+578haGCtpLhOs1RJLCEJFIQIaOOCqqwEKVVI8VEmvbjHv4Rx58il0yuChg5FlCDCsnxg//B727N4tSkmxSKA70vtv0xBgR2gVbDtr+Pbbt1AvifgSut4681gdlP0hsdLXIEDGwDF9cdTd4DLneA4SddMiRH8tMUikXg/Yy+KQ8M3gJ9a25v7X2cPgBZ6mr5Bjg4BMZLlL3u8e5gd2//nmn39wNwenKm5pw31AAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QMFQg2FH7jrSgAAABBdEVYdENvbW1lbnQAQ1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAKsEVYkwAAAKtJREFUOMulk7EVwjAMRL81BmXcewWyRRiCLlUmSEXnIfAWzgr0UZk5aGReoOAl9pV6unvy+c7xg1fXXYEB6AFv4xXIQAqqy37f7YgXYALu/EcE5qC6fQSM/ABuHMMTGIPqJjaYTpCx3QnA2ZszdejFDKvFIOY2LRf4BgEvNEIsJLVYpeEHALIAqUEgiWU7VpBjUF2KibPFkxNRnouJWDHGg5fE0oOvNtbW+Q3UvDSdhLv7eAAAAABJRU5ErkJggg==';
  plugin_info.buildName = 'Scout uniques';
  plugin_info.dateTimeVersion = '20201118161149';
  plugin_info.pluginId = 'iitc-plugin-scout-uniques';
  var portalsList = []; //let layer = null;

  var e = {}; ////////////////////////////////////////

  e.handlePortalSelect = function () {};

  var findPortal = function findPortal(id) {
    for (var pid in window.portals) {
      var portal = window.portals[pid];

      if (id === portal.options.data.latE6 + '_' + portal.options.data.lngE6) {
        return portal;
      }
    }

    return null;
  };

  var addPortal = function addPortal(data) {
    if (!data) return;
    var id = data.latE6 + '_' + data.lngE6;
    if (portalsList.indexOf(id) >= 0) return;
    portalsList.push(id);
    saveData();
    var portal = findPortal(id);

    if (portal) {
      highlightPortal(portal);
    }

    updateCurrentControl();
  };

  var removePortal = function removePortal(data) {
    if (!data) return;
    var id = data.latE6 + '_' + data.lngE6;
    if (portalsList.indexOf(id) < 0) return;
    portalsList.splice(portalsList.indexOf(id), 1);
    saveData();
    var portal = findPortal(id);

    if (portal) {
      highlightPortal(portal);
    }

    updateCurrentControl();
  };

  var handlePublicData = function handlePublicData(data) {
    var res = data.result;
    if (!res) return;

    for (var i = 0; i < res.length; i++) {
      var item = res[i][2];
      if (!item) continue;
      var portal = null;

      for (var n = 0; n < item.plext.markup.length; n++) {
        var mark = item.plext.markup[n];

        if (mark[0] === 'PORTAL') {
          portal = mark[1];
          break;
        }
      }

      if (!portal) continue;

      if (item.plext.text.indexOf('You claimed Scout Controller on') >= 0) {
        console.log('Add Scout Controller on ', portal.plain);
        addPortal(portal);
      }

      if (item.plext.text.indexOf('You were displaced as Scout Controller on') >= 0) {
        console.log('Remove Scout Controller on ', portal.plain);
        removePortal(portal);
      }
    }
  };

  e.highlight = function (data) {
    var id = data.portal.options.data.latE6 + '_' + data.portal.options.data.lngE6;

    if (portalsList.indexOf(id) >= 0) {
      data.portal.setStyle({
        fillColor: '#ff0000',
        fillOpacity: 1
      });
    }
  };

  var storageKey = "iitc-plugin-scout-uniques";

  var getDataForSave = function getDataForSave() {
    return JSON.stringify({
      portalsList: portalsList
    });
  };

  var saveData = function saveData() {
    localStorage.setItem(storageKey, getDataForSave());
  };

  var loadData = function loadData() {
    var data = localStorage.getItem(storageKey);

    if (data) {
      try {
        applyLoadedData(JSON.parse(data));
      } catch (e) {
        portalsList = [];
      }
    }
  };

  var applyLoadedData = function applyLoadedData(data) {
    resetHighlightedPortals();
    portalsList = data.portalsList;

    for (var pid in window.portals) {
      var portal = window.portals[pid];
      highlightPortal(portal);
    }

    updateCurrentControl();
  };

  var currentControl = null;

  var updateCurrentControl = function updateCurrentControl() {
    if (!currentControl) return;
    currentControl.src = portalsList.indexOf(currentControl.pid) >= 0 ? MARKED_IMAGE : UNMARKED_IMAGE;
  };

  e.handlePortalSelect = function (data) {
    setTimeout(function () {
      $('#scoutUniquesMark').remove();
      var control = document.createElement('img');
      control.id = "scoutUniquesMark";
      control.src = UNMARKED_IMAGE;
      control.style.marginRight = "4px";
      control.style.cursor = "pointer";
      control.title = "Add or remove scout unique";
      currentControl = control;
      $('#portaldetails > h3.title').prepend(control);
      var portal = window.portals[data.selectedPortalGuid];
      if (!portal) return;
      var pid = portal.options.data.latE6 + '_' + portal.options.data.lngE6;
      currentControl.pid = pid;
      updateCurrentControl();
      control.addEventListener('click', function () {
        if (portalsList.indexOf(currentControl.pid) >= 0) {
          portalsList.splice(portalsList.indexOf(currentControl.pid), 1);
          resetHighlightedPortals();
        } else {
          portalsList.push(currentControl.pid);
        }

        saveData();
        updateCurrentControl();
        var portal = findPortal(currentControl.pid);

        if (portal) {
          highlightPortal(portal);
        }
      });
    }, 0);
  };

  e.openOptions = function () {
    var html = "<a onclick='window.plugin.scoutUniques.import();return false;'>Import</a>";
    html += "<a onclick='window.plugin.scoutUniques.export();return false;'>Export</a>";
    html += "<a onclick='window.plugin.scoutUniques.clear();return false;'>Clear</a>";
    dialog({
      html: html,
      dialogClass: 'ui-dialog-scout-uniques',
      id: 'dialog-scout-uniques',
      title: 'Scout uniques'
    });
  };

  e["import"] = function () {
    $('#scoutUniquesImportInput').click();
  };

  e.doImport = function () {
    var selectedFile = $('#scoutUniquesImportInput').get(0).files[0];
    var reader = new FileReader();
    reader.readAsText(selectedFile);

    reader.onload = function () {
      try {
        var res = JSON.parse(reader.result);

        if (res) {
          applyLoadedData(res);
          saveData();
        }
      } catch (e) {}
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  };

  e["export"] = function () {
    download(getDataForSave(), 'scout-uniques.json');
  };

  e.clear = function () {
    if (confirm("Realy?")) {
      portalsList = [];
      saveData();
      resetHighlightedPortals();
      updateCurrentControl();
    }
  }; ////////////////////////////////////////


  window.plugin.scoutUniques = e;

  function setup() {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js');
    $('<style>').prop('type', 'text/css').html(plugin_info.css).appendTo('head');
    $('body').append(plugin_info.ui);
    window.addHook('publicChatDataAvailable', handlePublicData);
    window.addPortalHighlighter('Scout uniques', window.plugin.scoutUniques.highlight);
    loadData();
    $('#toolbox').append('<a onclick="window.plugin.scoutUniques.openOptions();return false;">Scout uniques</a>');
    window.addHook('portalSelected', e.handlePortalSelect);
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

module.exports = "<input type=\"file\" id=\"scoutUniquesImportInput\" visbility=\"hidden\" onchange=\"window.plugin.scoutUniques.doImport();return false;\"/>";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "#dialog-dialog-scout-uniques a{\r\n\tdisplay:block;\r\n\tcolor:#ffce00;\r\n\tborder:1px solid #ffce00;\r\n\tpadding:3px 0;\r\n\tmargin:10px auto;\r\n\twidth:80%;\r\n\ttext-align:center;\r\n\tbackground:rgba(8,48,78,.9);\r\n}\r\n\r\n#scoutUniquesImportInput {\r\n    visibility: hidden;\r\n    width: 2px;\r\n    height: 1px;\r\n}", ""]);
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